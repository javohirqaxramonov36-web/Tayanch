// ielts-writing-baho: IELTS Writing Task 2 inshosini AI bilan taxminiy baholash.
//
// So'rov:  POST, Authorization: Bearer <Supabase sessiya tokeni>
//          {"task_type": "task2", "prompt": "...", "prompt_id"?: "t2-01" | null, "essay": "..."}
// Javob:   200 {"result_id", "cached", "task_band", "word_count", "under_length", "result", "remaining"}
//          xato {"error": "<kod>"} (kodlar docs/ielts-writing-baho.md da).
//
// Tartib (arzon tekshiruvlar oldin, provayder eng oxirida):
//   kill switch -> JWT -> hajm -> tekshirish va tozalash -> so'z sanog'i -> ielts_writing_begin (kesh, yoqilganlik,
//   tezlik, kunlik limit, byudjet) -> provayder (yaroqsiz javobda 1 marta qayta) -> ielts_writing_finish -> javob.
// AI kaliti, JWT, insho matni va provayder javobi logga yozilmaydi.
import { normallashtir, shaxsiyniTozala, xesh } from '../_shared/aiTozalash.ts';
import type { AiChaqiruv, AiXabar } from '../_shared/anthropic.ts';
import { bearerToken, corsSarlavhalari, jsonJavob } from '../_shared/http.ts';
import type { RpcNatija } from '../_shared/turlar.ts';
import {
  type Baho,
  BAHO_SXEMASI,
  bahoniOl,
  foydalanuvchiXabari,
  MIN_SOZ,
  QAYTA_URINISH,
  sozSoni,
  TIZIM_KORSATMASI,
  vazifaBali,
} from './korsatma.ts';

export const CHEGARA = {
  /** So'rov tanasi (bayt). */
  tana: 40_000,
  savolMin: 20,
  savolMax: 1_200,
  inshoBelgi: 6_000,
  sozMin: 50,
  sozMax: 600,
  /** Yaroqsiz javobda qayta urinish bilan eng ko'p chaqiruv. */
  chaqiruv: 2,
} as const;

export interface BahoBogliqlik {
  originlar: readonly string[];
  /** Yetishmayotgan server sozlamalari NOMLARI. */
  yetishmaydi: string[];
  /** Kill switch: AI_TUTOR_OFF yoki AI_API_KEY yo'q. Rost bo'lsa provayderga hech narsa ketmaydi. */
  aiYopiq: boolean;
  foydalanuvchi: (jwt: string) => Promise<string | null>;
  rpc: (nomi: string, args: Record<string, unknown>) => Promise<RpcNatija>;
  ai: AiChaqiruv;
  jurnal: (xabar: string, tafsilot?: Record<string, unknown>) => void;
}

interface Sorov {
  savol: string;
  savolId: string | null;
  insho: string;
}

const SAVOL_ID = /^[a-z0-9-]{1,40}$/;

function sorovniTekshir(o: unknown): Sorov | null {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
  const t = o as Record<string, unknown>;
  if (t.task_type !== 'task2') return null;
  if (typeof t.prompt !== 'string' || typeof t.essay !== 'string') return null;
  const id = t.prompt_id ?? null;
  if (id !== null && (typeof id !== 'string' || !SAVOL_ID.test(id))) return null;
  return { savol: t.prompt, savolId: id as string | null, insho: t.essay };
}

/** Taxminiy kirish tokeni (byudjet bandi uchun ataylab oshirilgan: 3 belgi = 1 token). */
export function tokenTaxmini(...matnlar: string[]): number {
  return Math.ceil(matnlar.reduce((s, m) => s + m.length, 0) / 3) + 50;
}

export async function ieltsWritingBaho(req: Request, d: BahoBogliqlik): Promise<Response> {
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

  const savol = shaxsiyniTozala(normallashtir(s.savol)).matn;
  if (savol.length < CHEGARA.savolMin || savol.length > CHEGARA.savolMax) {
    return rad(400, 'invalid_prompt', 'invalid_request');
  }
  const normal = normallashtir(s.insho);
  // So'zlar asl (tozalashdan oldingi) matnda sanaladi: foydalanuvchi ekranda ko'rgan son bilan bir xil bo'lsin.
  const soz = sozSoni(normal);
  if (soz < CHEGARA.sozMin) return rad(400, 'essay_too_short', 'invalid_request');
  if (soz > CHEGARA.sozMax || normal.length > CHEGARA.inshoBelgi) return rad(400, 'essay_too_long', 'too_long');
  const insho = shaxsiyniTozala(normal).matn;
  const kamSoz = soz < MIN_SOZ;

  const inshoXeshi = await xesh(`task2|${s.savolId ?? ''}|${savol}|${insho}`);
  const xabar = foydalanuvchiXabari(savol, insho, soz);

  const boshla = await d.rpc('ielts_writing_begin', {
    p_user: userId,
    p_essay_hash: inshoXeshi,
    p_est_input_tokens: Math.min(tokenTaxmini(TIZIM_KORSATMASI, xabar) * 2, 100_000),
    p_calls: CHEGARA.chaqiruv,
  });
  if (boshla.error) {
    d.jurnal('ielts_writing_begin xatosi', { code: boshla.error.code });
    return javob(500, { error: 'server_error' });
  }
  const b = boshla.data as {
    ok?: boolean;
    cached?: boolean;
    error?: string;
    usage_id?: number;
    model?: string;
    max_output_tokens?: number;
    remaining?: number;
    retry_after?: number;
    daily_limit?: number;
    result_id?: string;
    task_band?: number;
    result?: Record<string, unknown>;
    word_count?: number;
  };

  if (b?.ok && b.cached) {
    return javob(200, {
      result_id: b.result_id,
      cached: true,
      task_band: Number(b.task_band),
      word_count: b.word_count,
      under_length: Number(b.word_count) < MIN_SOZ,
      result: b.result,
      remaining: null,
    });
  }
  if (!b?.ok) {
    switch (b?.error) {
      case 'ai_paused':
        return javob(503, { error: 'ai_paused' });
      case 'quota_exceeded':
        return javob(429, { error: 'quota_exceeded', daily_limit: b.daily_limit ?? null });
      case 'rate_limited':
        return javob(429, { error: 'rate_limited', retry_after: b.retry_after ?? 5 }, { 'Retry-After': String(b.retry_after ?? 5) });
      default:
        d.jurnal('ielts_writing_begin kutilmagan javob');
        return javob(500, { error: 'server_error' });
    }
  }

  // Provayder: strukturali JSON; yaroqsiz bo'lsa bir marta qayta so'raladi.
  let inT = 0;
  let outT = 0;
  let chaqirildi = 0;
  let baho: Baho | null = null;
  let provayderXato: string | null = null;
  let rad_etdi = false;
  const asos: AiXabar[] = [{ role: 'user', content: xabar }];
  let joriy = asos;
  for (let i = 0; i < CHEGARA.chaqiruv; i++) {
    const n = await d.ai({
      model: String(b.model),
      maxTokens: Number(b.max_output_tokens),
      system: TIZIM_KORSATMASI,
      messages: joriy,
      jsonSxema: BAHO_SXEMASI as unknown as Record<string, unknown>,
    });
    chaqirildi++;
    inT += n.inputTokens;
    outT += n.outputTokens;
    if (!n.ok) {
      provayderXato = n.xato;
      break;
    }
    if (n.stopReason === 'refusal') {
      rad_etdi = true;
      break;
    }
    baho = bahoniOl(n.matn, insho);
    if (baho) break;
    joriy = [...asos, { role: 'assistant', content: n.matn.slice(0, 6000) || '{}' }, { role: 'user', content: QAYTA_URINISH }];
  }

  const bal = baho ? vazifaBali(baho) : null;
  const natija = baho
    ? {
      criteria: {
        task_response: baho.task_response,
        coherence_cohesion: baho.coherence_cohesion,
        lexical_resource: baho.lexical_resource,
        grammatical_range_accuracy: baho.grammatical_range_accuracy,
      },
      overall_summary: baho.overall_summary,
      under_length: kamSoz,
    }
    : null;

  // Har holda xarajat yakunlanadi; muvaffaqiyatsiz baholash kunlik limitdan sanalmaydi.
  const yakun = await d.rpc('ielts_writing_finish', {
    p_usage_id: b.usage_id,
    p_user: userId,
    p_input_tokens: inT,
    p_output_tokens: outT,
    p_calls: chaqirildi,
    p_ok: natija !== null,
    p_prompt_id: s.savolId,
    p_prompt: savol,
    p_essay: insho,
    p_word_count: soz,
    p_essay_hash: inshoXeshi,
    p_task_band: bal,
    p_result: natija,
  });
  const y = yakun.data as { ok?: boolean; result_id?: string } | null;
  if (yakun.error || !y?.ok) d.jurnal('ielts_writing_finish xatosi', { code: yakun.error?.code ?? 'not_ok' });

  if (provayderXato !== null) {
    d.jurnal('provayder xatosi', { xato: provayderXato });
    return javob(502, { error: 'ai_unavailable' });
  }
  if (rad_etdi) return javob(422, { error: 'cannot_assess' });
  if (!natija || bal === null) {
    d.jurnal('yaroqsiz baho', { chaqiruv: chaqirildi });
    return javob(502, { error: 'assessment_failed' });
  }

  d.jurnal('baho', { chaqiruv: chaqirildi, input_tokens: inT, output_tokens: outT, soz });

  return javob(200, {
    result_id: y?.result_id ?? null,
    cached: false,
    task_band: bal,
    word_count: soz,
    under_length: kamSoz,
    result: natija,
    remaining: typeof b.remaining === 'number' ? b.remaining : null,
  });
}
