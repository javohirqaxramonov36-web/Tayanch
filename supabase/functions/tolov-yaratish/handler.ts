// tolov-yaratish: hisobga kirgan foydalanuvchi uchun SAT tarifiga inPAY to'lovi yaratadi.
//
// So'rov:  POST, Authorization: Bearer <Supabase sessiya tokeni>, tana {"plan": "pro" | "elite"}
// Javob:   200 {"payment_id", "checkout_url"}; xato {"error": "<kod>"}
// Narx va muddat faqat bazadan (plans): brauzer summa yubormaydi. To'lov holatini bu funksiya "paid" qilmaydi,
// buni faqat inpay-webhook qiladi.
import type { TolovSorovi, YaratishNatijasi } from '../_shared/inpay.ts';
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

  let plan: unknown;
  try {
    plan = (await req.json())?.plan;
  } catch {
    plan = undefined;
  }
  if (typeof plan !== 'string' || !/^[a-z][a-z0-9_]{1,31}$/.test(plan)) {
    return javob(400, { error: 'invalid_request' });
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
    returnUrl: `${d.saytUrl}/uz/sat/hisob/tolov/?tolov=${encodeURIComponent(p.payment_id)}`,
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
  return javob(200, { payment_id: p.payment_id, checkout_url: natija.tolov.checkout_url });
}
