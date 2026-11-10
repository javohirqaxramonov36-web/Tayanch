// tolov-yaratish: hisobga kirgan foydalanuvchi uchun SAT tarifiga inPAY to'lovi yaratadi.
//
// So'rov:  POST, Authorization: Bearer <Supabase sessiya tokeni>,
//          tana {"plan_code": "pro" | "elite", "period"?: "oylik"}  ("plan" ham qabul qilinadi)
// Javob:   200 {"payment_id", "checkout_url", "reused"}; xato {"error": "<kod>"}
// Narx va muddat faqat bazadan (plans). Tanada summa (amount, amount_uzs, price...) bo'lsa so'rov rad etiladi.
// Bir xil tarif uchun yaqinda ochilgan pending to'lov bo'lsa yangisi yaratilmaydi, o'sha havola qaytadi.
// To'lovni "paid" qilish bu funksiyada yo'q: inpay-webhook yoki inpay-holat (inPAY'dan o'qib) qiladi.
import { kassaFaolEmasmi, type TolovSorovi, type YaratishNatijasi } from '../_shared/inpay.ts';
import { bearerToken, corsSarlavhalari, jsonJavob } from '../_shared/http.ts';
import type { RpcNatija } from '../_shared/turlar.ts';

export interface YaratishBogliqlik {
  supabaseUrl?: string;
  saytUrl: string;
  originlar: readonly string[];
  /** Yetishmayotgan sozlama nomlari (bo'sh bo'lsa hammasi bor). */
  yetishmaydi: string[];
  /** JWT bo'yicha foydalanuvchi id si (Supabase Auth). Yaroqsiz bo'lsa null. */
  foydalanuvchi: (jwt: string) => Promise<string | null>;
  rpc: (nomi: string, args: Record<string, unknown>) => Promise<RpcNatija>;
  inpayYarat: (s: TolovSorovi) => Promise<YaratishNatijasi>;
  /** Shu foydalanuvchi va tarif uchun OCHIQ_TOLOV_DAQIQA ichida yaratilgan pending to'lov (checkout havolasi bilan). */
  ochiqTolov: (userId: string, planCode: string) => Promise<{ payment_id: string; checkout_url: string } | null>;
  jurnal: (xabar: string, tafsilot?: Record<string, unknown>) => void;
}

/** payment_create xato matni -> HTTP holati va brauzerga beriladigan kod. */
const YARATISH_XATOLARI: Record<string, [number, string]> = {
  plan_not_found: [404, 'plan_not_found'],
  plan_not_available: [409, 'plan_not_available'],
  plan_price_not_set: [409, 'plan_not_available'],
  too_many_payments: [429, 'too_many_payments'],
  user_not_found: [401, 'not_signed_in'],
};

/** Shu daqiqa ichida ochilgan pending to'lov qayta beriladi. inPAY checkout havolasining amal muddati hujjatda
 *  ko'rsatilmagan (tekshirish kerak): shuning uchun qisqa oyna, Tayanch tanlovi. */
export const OCHIQ_TOLOV_DAQIQA = 30;

/** Hozir bitta davr bor: plans.period_days (P19). Boshqa davrlar narxi berilgach qo'shiladi. */
export const DAVRLAR = ['oylik'] as const;
/** Mijoz yuborishi mumkin bo'lmagan summa maydonlari. */
const SUMMA_MAYDONLARI = ['amount', 'amount_uzs', 'price', 'price_uzs', 'summa', 'narx'];

interface YaratilganTolov {
  payment_id: string;
  amount_uzs: number;
  period_days: number;
  plan_code: string;
  plan_name: string;
}

function yaratilganmi(x: unknown): x is YaratilganTolov {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o.payment_id === 'string' && Number.isSafeInteger(o.amount_uzs) &&
    Number.isSafeInteger(o.period_days) && typeof o.plan_code === 'string' && typeof o.plan_name === 'string';
}

export async function tolovYaratish(req: Request, d: YaratishBogliqlik): Promise<Response> {
  const cors = corsSarlavhalari(req.headers.get('origin'), d.originlar);
  if (cors === null) return jsonJavob(403, { error: 'origin_not_allowed' });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const javob = (status: number, tana: unknown) => jsonJavob(status, tana, cors);
  if (req.method !== 'POST') return javob(405, { error: 'method_not_allowed' });

  if (d.yetishmaydi.length || !d.supabaseUrl) {
    d.jurnal('sozlama yetishmaydi', { nomlar: d.yetishmaydi });
    return javob(500, { error: 'server_not_configured' });
  }

  const jwt = bearerToken(req.headers.get('authorization'));
  const userId = jwt ? await d.foydalanuvchi(jwt) : null;
  if (!userId) return javob(401, { error: 'not_signed_in' });

  let tana: Record<string, unknown> = {};
  try {
    const t = await req.json();
    if (t && typeof t === 'object' && !Array.isArray(t)) tana = t;
  } catch {
    // bo'sh yoki JSON emas: pastda invalid_request
  }
  if (SUMMA_MAYDONLARI.some((k) => k in tana)) {
    d.jurnal('summa mijozdan keldi, rad etildi', { user_id: userId });
    return javob(400, { error: 'amount_not_allowed' });
  }
  const plan = tana.plan_code ?? tana.plan;
  if (typeof plan !== 'string' || !/^[a-z][a-z0-9_]{1,31}$/.test(plan)) {
    return javob(400, { error: 'invalid_request' });
  }
  const davr = tana.period ?? 'oylik';
  if (typeof davr !== 'string' || !(DAVRLAR as readonly string[]).includes(davr)) {
    return javob(409, { error: 'period_not_available' });
  }

  const ochiq = await d.ochiqTolov(userId, plan);
  if (ochiq) {
    d.jurnal('ochiq to\'lov qayta berildi', { payment_id: ochiq.payment_id });
    return javob(200, { ...ochiq, reused: true });
  }

  const yaratish = await d.rpc('payment_create', { p_user: userId, p_plan_code: plan });
  if (yaratish.error) {
    const mos = YARATISH_XATOLARI[yaratish.error.message];
    if (mos) return javob(mos[0], { error: mos[1] });
    d.jurnal('payment_create xatosi', { kod: yaratish.error.code });
    return javob(500, { error: 'server_error' });
  }
  if (!yaratilganmi(yaratish.data)) {
    d.jurnal('payment_create kutilmagan javob');
    return javob(500, { error: 'server_error' });
  }
  const p = yaratish.data;

  const natija = await d.inpayYarat({
    paymentId: p.payment_id,
    planCode: p.plan_code,
    amountUzs: p.amount_uzs,
    description: `Tayanch SAT ${p.plan_name}, ${p.period_days} days`,
    returnUrl: `${d.saytUrl}/uz/sat/hisob/tolov-natija/?tolov=${encodeURIComponent(p.payment_id)}`,
    webhookUrl: `${d.supabaseUrl}/functions/v1/inpay-webhook`,
  });

  if (!natija.ok) {
    const yoz = await d.rpc('payment_set_invoice', {
      p_payment_id: p.payment_id,
      p_provider_order_id: null,
      p_response: { code: natija.code, http_status: natija.httpStatus, request_id: natija.requestId ?? null },
    });
    d.jurnal('inPAY to\'lov yaratmadi', {
      payment_id: p.payment_id,
      kod: natija.code,
      http: natija.httpStatus,
      request_id: natija.requestId,
      yozildi: !yoz.error,
    });
    if (kassaFaolEmasmi(natija.code)) {
      d.jurnal('inPAY kassasi faol emas (merchant_inactive): kabinetda kassa holatini tekshiring', { payment_id: p.payment_id });
      return javob(503, { error: 'payments_unavailable' });
    }
    return javob(502, { error: 'payment_provider_error' });
  }

  const yoz = await d.rpc('payment_set_invoice', {
    p_payment_id: p.payment_id,
    p_provider_order_id: natija.tolov.id,
    p_response: natija.tolov,
  });
  if (yoz.error) {
    // inPAY to'lovi bor, lekin bazada id yo'q: webhook uni topa olmaydi. Shuning uchun havola berilmaydi.
    d.jurnal('payment_set_invoice xatosi', { payment_id: p.payment_id, kod: yoz.error.code });
    return javob(500, { error: 'server_error' });
  }

  d.jurnal('to\'lov yaratildi', { payment_id: p.payment_id, livemode: natija.tolov.livemode });
  return javob(200, { payment_id: p.payment_id, checkout_url: natija.tolov.checkout_url, reused: false });
}
