// inpay-muvofiqlash: webhook kelmay qolgan to'lovlarni inPAY'dan tekshiradi (P21).
//
// So'rov:  POST, sarlavha X-Cron-Secret: <MUVOFIQLASH_SECRET>. Supabase Cron (har 10 daqiqada) yoki qo'lda.
// Javob:   200 {"checked": n, "results": {"paid": n, "pending": n, ...}}; xato {"error": "<kod>"}
//
// Oqim: payment_pending_stale (15 daqiqadan eski, 48 soatdan yangi pending) -> har biri uchun inPAY
// GET /payments/{id} -> yakuniy bo'lsa payment_apply_event (webhook va inpay-holat bilan bir xil funksiya).
// Obuna takror uzaytirilmaydi: webhook keyin kelsa 'already_paid', takror ishga tushish 'duplicate'.
// Brauzer bu funksiyani chaqirmaydi (CORS yo'q). Sir noto'g'ri bo'lsa bazaga ham, inPAY'ga ham murojaat yo'q.
import { jsonJavob, sirTengmi } from '../_shared/http.ts';
import { type QollashBogliqlik, inpaydanQolla } from '../_shared/tolovQollash.ts';
import type { RpcNatija } from '../_shared/turlar.ts';

/** Bir ishga tushishda ko'pi bilan shuncha to'lov (inPAY'ga so'rovlar ketma-ket, har biri 8 soniyagacha). */
export const MAKS_TOLOV = 20;
/** Shu vaqtdan keyin yangi to'lov boshlanmaydi (qolgani keyingi ishga tushishda). Tayanch tanlovi. */
export const VAQT_CHEGARASI_MS = 60_000;

export interface MuvofiqlashBogliqlik extends QollashBogliqlik {
  muvofiqlashSecret?: string;
  yetishmaydi: string[];
  hozirMs: () => number;
  rpc: (nomi: string, args: Record<string, unknown>) => Promise<RpcNatija>;
}

export async function inpayMuvofiqlash(req: Request, d: MuvofiqlashBogliqlik): Promise<Response> {
  if (req.method !== 'POST') return jsonJavob(405, { error: 'method_not_allowed' });

  if (d.yetishmaydi.length || !d.muvofiqlashSecret) {
    d.jurnal('sozlama yetishmaydi', { nomlar: d.yetishmaydi });
    return jsonJavob(500, { error: 'server_not_configured' });
  }
  if (!(await sirTengmi(req.headers.get('x-cron-secret'), d.muvofiqlashSecret))) {
    d.jurnal('sir rad etildi');
    return jsonJavob(401, { error: 'unauthorized' });
  }

  const boshlanish = d.hozirMs();
  const royxat = await d.rpc('payment_pending_stale', { p_min_minutes: 15, p_max_hours: 48, p_limit: MAKS_TOLOV });
  if (royxat.error || !Array.isArray(royxat.data)) {
    d.jurnal('payment_pending_stale xatosi', { kod: royxat.error?.code });
    return jsonJavob(500, { error: 'server_error' });
  }

  const results: Record<string, number> = {};
  const qosh = (k: string) => (results[k] = (results[k] ?? 0) + 1);
  let checked = 0;
  for (const qator of royxat.data as Array<Record<string, unknown>>) {
    if (d.hozirMs() - boshlanish > VAQT_CHEGARASI_MS) {
      qosh('deferred');
      continue;
    }
    if (typeof qator?.id !== 'string' || typeof qator?.provider_order_id !== 'string') continue;
    checked++;
    const q = await inpaydanQolla({ id: qator.id, provider_order_id: qator.provider_order_id }, d);
    if (q.holat === 'qollandi') {
      qosh(q.result === 'error' ? `error:${q.error ?? 'unknown'}` : q.result);
    } else if (q.holat === 'pending') {
      qosh(q.sabab === 'inpay_pending' ? 'pending' : `pending:${q.sabab}`);
    } else {
      qosh('db_error');
    }
  }

  d.jurnal('muvofiqlash tugadi', { checked, results });
  return jsonJavob(200, { checked, results });
}
