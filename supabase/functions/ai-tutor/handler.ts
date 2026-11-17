// ai-tutor: foydalanuvchi o'z xatosi (Tayanch original savoli) yoki o'z SAT savoli bo'yicha AI'dan so'raydi.
//
// So'rov:  POST, Authorization: Bearer <Supabase sessiya tokeni>
//          {"mode": "attempt", "attempt_id": 123, "message": "...", "conversation_id"?: "<uuid>"}
//          {"mode": "own", "message": "...", "conversation_id"?: "<uuid>"}
// Javob:   200 {"conversation_id", "reply", "check": "verified" | "unverified" | "not_checked"}
//          xato {"error": "<kod>"} (kodlar pastda va docs/ai-tutor.md da).
//
// Tartib (arzon tekshiruvlar oldin, provayder eng oxirida):
//   kill switch (AI_TUTOR_OFF / AI_API_KEY yo'q) -> JWT -> hajm -> tozalash -> CB/sizdirilgan material ->
//   kontekst (o'z urinishi, o'z suhbati) -> ai_begin (yoqilganlik, tarif limiti, tezlik, takror, byudjet, kvota,
//   xarajatni band qilish) -> provayder -> javobni tekshirish -> ai_finish (haqiqiy token) -> tarixga yozish.
// AI kaliti, JWT, xabar matni va provayder javobi logga yozilmaydi.
import { cbMatnmi, normallashtir, shaxsiyniTozala, xesh } from '../_shared/aiTozalash.ts';
import { JAVOB_SXEMASI, javobMosmi, modelJsonOl, togriJavobMatni } from '../_shared/aiJavob.ts';
import type { AiChaqiruv, AiXabar } from '../_shared/anthropic.ts';
import { bearerToken, corsSarlavhalari, jsonJavob } from '../_shared/http.ts';
import type { RpcNatija } from '../_shared/turlar.ts';
import { qaytaUrinish, sarlavha, type SavolKonteksti, savolBloki, TIZIM_KORSATMASI, XATO_REJIMI } from './korsatma.ts';

export const CHEGARA = {
  /** So'rov tanasi (bayt). */
  tana: 16_000,
  /** Foydalanuvchi xabari (belgi, tozalashdan oldin). */
  xabar: 1_200,
  /** Promptga qo'shiladigan oldingi xabarlar soni. */
  tarix: 6,
} as const;

export const MATN = {
  unverified:
    "I couldn't check this explanation against the answer key, so I'm not showing it. Please review the Tayanch explanation for this question, or ask about one specific step.",
  refusal: "I can't help with that request. I can explain an SAT skill or one of your Tayanch mistakes instead.",
  empty: "I couldn't write an answer this time. Please try rephrasing your question.",
} as const;

export interface TutorBogliqlik {
  originlar: readonly string[];
  /** Yetishmayotgan server sozlamalari NOMLARI (Supabase). */
  yetishmaydi: string[];
  /** Kill switch: AI_TUTOR_OFF yoqilgan yoki AI_API_KEY yo'q. Rost bo'lsa provayderga hech narsa ketmaydi. */
  aiYopiq: boolean;
  foydalanuvchi: (jwt: string) => Promise<string | null>;
  rpc: (nomi: string, args: Record<string, unknown>) => Promise<RpcNatija>;
  ai: AiChaqiruv;
  jurnal: (xabar: string, tafsilot?: Record<string, unknown>) => void;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Sorov {
  mode: 'attempt' | 'own';
  message: string;
  attemptId: number | null;
  conversationId: string | null;
}

function sorovniTekshir(o: unknown): Sorov | null {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
  const t = o as Record<string, unknown>;
  if (t.mode !== 'attempt' && t.mode !== 'own') return null;
  if (typeof t.message !== 'string') return null;
  const conv = t.conversation_id ?? null;
  if (conv !== null && (typeof conv !== 'string' || !UUID.test(conv))) return null;
  let attemptId: number | null = null;
  if (t.mode === 'attempt') {
    if (typeof t.attempt_id !== 'number' || !Number.isSafeInteger(t.attempt_id) || t.attempt_id <= 0) return null;
    attemptId = t.attempt_id;
  } else if (t.attempt_id !== undefined && t.attempt_id !== null) {
    return null;
  }
  return { mode: t.mode, message: t.message, attemptId, conversationId: conv as string | null };
}

/** Taxminiy kirish tokeni (byudjet bandi uchun ataylab oshirilgan: 3 belgi = 1 token). */
export function tokenTaxmini(...matnlar: string[]): number {
  const belgi = matnlar.reduce((s, m) => s + m.length, 0);
  return Math.ceil(belgi / 3) + 50;
}

export async function aiTutor(req: Request, d: TutorBogliqlik): Promise<Response> {
  const cors = corsSarlavhalari(req.headers.get('origin'), d.originlar);
  if (cors === null) return jsonJavob(403, { error: 'origin_not_allowed' });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const javob = (status: number, tana: unknown, qoshimcha: Record<string, string> = {}) =>
    jsonJavob(status, tana, { ...cors, ...qoshimcha });
  if (req.method !== 'POST') return javob(405, { error: 'method_not_allowed' });

  if (d.yetishmaydi.length) {
    d.jurnal('sozlama yetishmaydi', { nomlar: d.yetishmaydi });
    return javob(500, { error: 'server_not_configured' });
  }
  if (d.aiYopiq) return javob(503, { error: 'ai_paused' });

  const jwt = bearerToken(req.headers.get('authorization'));
  const userId = jwt ? await d.foydalanuvchi(jwt) : null;
  if (!userId) return javob(401, { error: 'not_signed_in' });

  const rad = async (status: number, kod: string, sabab: string) => {
    await d.rpc('ai_reject', { p_reason: sabab });
    return javob(status, { error: kod });
  };

  // Hajm: Content-Length ishonchsiz bo'lishi mumkin, shuning uchun matn uzunligi ham tekshiriladi.
  const uzunlik = Number(req.headers.get('content-length') ?? '0');
  if (uzunlik > CHEGARA.tana) return rad(413, 'request_too_large', 'too_long');
  let xom: string;
  try {
    xom = await req.text();
  } catch {
    return rad(400, 'invalid_request', 'invalid_request');
  }
  if (xom.length > CHEGARA.tana) return rad(413, 'request_too_large', 'too_long');
  let tana: unknown;
  try {
    tana = JSON.parse(xom);
  } catch {
    return rad(400, 'invalid_request', 'invalid_request');
  }
  const s = sorovniTekshir(tana);
  if (!s) return rad(400, 'invalid_request', 'invalid_request');

  const normal = normallashtir(s.message);
  if (!normal) return rad(400, 'empty_message', 'invalid_request');
  if (normal.length > CHEGARA.xabar) return rad(400, 'message_too_long', 'too_long');

  const { matn: toza } = shaxsiyniTozala(normal);
  if (cbMatnmi(toza) || cbMatnmi(normal)) return rad(422, 'cb_content', 'cb_content');

  // Kontekst: o'z urinishi (faqat Tayanch original, tasdiqlangan savol) va o'z suhbati.
  let q: SavolKonteksti | null = null;
  if (s.mode === 'attempt') {
    const r = await d.rpc('ai_attempt_context', { p_user: userId, p_attempt: s.attemptId });
    if (r.error) {
      d.jurnal('kontekst xatosi', { code: r.error.code });
      return javob(500, { error: 'server_error' });
    }
    if (!r.data) return javob(404, { error: 'attempt_not_found' });
    q = r.data as SavolKonteksti;
  }

  let tarix: AiXabar[] = [];
  if (s.conversationId) {
    const r = await d.rpc('ai_conversation_history', { p_user: userId, p_conversation: s.conversationId, p_limit: CHEGARA.tarix });
    if (r.error) {
      d.jurnal('tarix xatosi', { code: r.error.code });
      return javob(500, { error: 'server_error' });
    }
    const h = r.data as { mode?: string; attempt_id?: number | null; messages?: AiXabar[] } | null;
    if (!h || h.mode !== s.mode || (s.mode === 'attempt' && h.attempt_id !== s.attemptId)) {
      return javob(404, { error: 'conversation_not_found' });
    }
    tarix = (h.messages ?? []).filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string');
    while (tarix.length && tarix[0].role !== 'user') tarix.shift();
  }

  const tizim = q ? `${TIZIM_KORSATMASI}\n\n${XATO_REJIMI}\n\n${savolBloki(q)}` : TIZIM_KORSATMASI;
  const xabarlar: AiXabar[] = [...tarix, { role: 'user', content: toza }];
  const chaqiruvlar = q ? 2 : 1;
  const taxmin = tokenTaxmini(tizim, ...xabarlar.map((m) => m.content)) + (q ? 400 : 0);

  const boshla = await d.rpc('ai_begin', {
    p_user: userId,
    p_input_hash: await xesh(`${s.mode}|${s.attemptId ?? ''}|${toza.toLowerCase()}`),
    p_est_input_tokens: Math.min(taxmin, 100_000),
    p_calls: chaqiruvlar,
  });
  if (boshla.error) {
    d.jurnal('ai_begin xatosi', { code: boshla.error.code });
    return javob(500, { error: 'server_error' });
  }
  const b = boshla.data as { ok?: boolean; error?: string; usage_id?: number; model?: string; max_output_tokens?: number; retry_after?: number };
  if (!b?.ok) {
    switch (b?.error) {
      case 'ai_paused':
        return javob(503, { error: 'ai_paused' });
      case 'not_in_plan':
        return javob(403, { error: 'not_in_plan' });
      case 'quota_exceeded':
        return javob(429, { error: 'quota_exceeded' });
      case 'duplicate':
        return javob(429, { error: 'duplicate' });
      case 'rate_limited':
        return javob(429, { error: 'rate_limited', retry_after: b.retry_after ?? 5 }, { 'Retry-After': String(b.retry_after ?? 5) });
      default:
        d.jurnal('ai_begin kutilmagan javob');
        return javob(500, { error: 'server_error' });
    }
  }

  // Provayder
  let inT = 0;
  let outT = 0;
  let chaqirildi = 0;
  let reply = '';
  let check: 'verified' | 'unverified' | 'not_checked' = 'not_checked';
  let provayderXato: string | null = null;
  const sorov = { model: String(b.model), maxTokens: Number(b.max_output_tokens), system: tizim };

  if (!q) {
    const n = await d.ai({ ...sorov, messages: xabarlar });
    chaqirildi = 1;
    inT += n.inputTokens;
    outT += n.outputTokens;
    if (!n.ok) provayderXato = n.xato;
    else if (n.stopReason === 'refusal') reply = MATN.refusal;
    else reply = n.matn.trim() || MATN.empty;
  } else {
    const kalit = togriJavobMatni(q.format, q.correct) ?? '';
    let joriy = xabarlar;
    for (let i = 0; i < chaqiruvlar; i++) {
      const n = await d.ai({ ...sorov, messages: joriy, jsonSxema: JAVOB_SXEMASI as unknown as Record<string, unknown> });
      chaqirildi++;
      inT += n.inputTokens;
      outT += n.outputTokens;
      if (!n.ok) {
        provayderXato = n.xato;
        break;
      }
      if (n.stopReason === 'refusal') {
        reply = MATN.refusal;
        check = 'not_checked';
        break;
      }
      const j = modelJsonOl(n.matn);
      if (j && javobMosmi(q.format, q.correct, j.final_answer)) {
        reply = j.explanation;
        check = 'verified';
        break;
      }
      // Mos kelmadi: bir marta qayta so'raladi, keyin tushuntirish ko'rsatilmaydi.
      check = 'unverified';
      reply = MATN.unverified;
      joriy = [...xabarlar, { role: 'assistant', content: n.matn.slice(0, 4000) || '{}' }, { role: 'user', content: qaytaUrinish(kalit) }];
    }
  }

  // Provayderdagi xatoda ham, javobsiz holatda ham xarajat yakunlanadi (kvota faqat xatoda qaytadi).
  const yakun = await d.rpc('ai_finish', {
    p_usage_id: b.usage_id,
    p_input_tokens: inT,
    p_output_tokens: outT,
    p_calls: chaqirildi,
    p_ok: provayderXato === null,
    p_check: provayderXato === null ? check : null,
  });
  if (yakun.error) d.jurnal('ai_finish xatosi', { code: yakun.error.code });

  if (provayderXato !== null) {
    d.jurnal('provayder xatosi', { xato: provayderXato });
    return javob(502, { error: 'ai_unavailable' });
  }

  d.jurnal('javob', { rejim: s.mode, chaqiruv: chaqirildi, input_tokens: inT, output_tokens: outT, check });

  const saqla = await d.rpc('ai_save_turn', {
    p_user: userId,
    p_conversation: s.conversationId,
    p_mode: s.mode,
    p_attempt: s.attemptId,
    p_question: q?.question_id ?? null,
    p_title: sarlavha(s.mode, toza, q),
    p_user_text: toza,
    p_assistant_text: reply.slice(0, 8000),
    p_check: check,
  });
  if (saqla.error) d.jurnal('tarixga yozilmadi', { code: saqla.error.code });

  return javob(200, {
    conversation_id: saqla.error ? s.conversationId : saqla.data,
    reply,
    check,
  });
}
