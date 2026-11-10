// inpay-holat: foydalanuvchining O'Z to'lovi holati (qaytish sahifasi /uz/sat/hisob/tolov-natija/ so'raydi).
//
// So'rov:  POST, Authorization: Bearer <Supabase sessiya tokeni>, tana {"payment_id": "<uuid>"}
// Javob:   200 {"status": "pending" | "success" | "failed"}; xato {"error": "<kod>"}
//
// Nega kerak: webhook (inpay-webhook) kechikishi yoki kelmasligi mumkin; IP03 bunday holatda
// GET /payments/{id} bilan tekshirishni aytadi.
// Holatning yagona manbasi baza (payments.status). inPAY yakuniy holat qaytarsa, u webhook bilan BIR XIL
// SQL funksiya payment_apply_event orqali qo'llanadi (summa, valyuta, livemode, metadata tekshiruvi, obuna,
// audit_log shu yerda; takror chaqiruv idempotent). Brauzer obunani hech qachon o'zi yoqmaydi.
// Boshqa foydalanuvchining to'lovi so'ralsa javob "topilmadi" bilan bir xil (borligi oshkor qilinmaydi).
import type { HolatNatijasi, TayanchHolat } from '../_shared/inpay.ts';
import { inpaydanQolla } from '../_shared/tolovQollash.ts';
import { bearerToken, corsSarlavhalari, jsonJavob } from '../_shared/http.ts';
import type { RpcNatija } from '../_shared/turlar.ts';

/** Bazadagi to'lov (service role bilan o'qiladi; raw'dan faqat livemode). */
export interface BazaTolov {
  id: string;
  user_id: string;
  status: string;
  provider_order_id: string;
}

export interface HolatBogliqlik {
  originlar: readonly string[];
  yetishmaydi: string[];
  foydalanuvchi: (jwt: string) => Promise<string | null>;
  tolovOl: (paymentId: string) => Promise<BazaTolov | null>;
  rpc: (nomi: string, args: Record<string, unknown>) => Promise<RpcNatija>;
  inpayHolat: (inpayId: string) => Promise<HolatNatijasi>;
  jurnal: (xabar: string, tafsilot?: Record<string, unknown>) => void;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** payments.status -> ekrandagi holat. created/pending: hali yakuniy emas. */
export function bazaHolati(status: string): TayanchHolat {
  if (status === 'paid') return 'success';
  if (status === 'failed' || status === 'canceled' || status === 'refunded') return 'failed';
  return 'pending';
}

export async function inpayHolat(req: Request, d: HolatBogliqlik): Promise<Response> {
  const cors = corsSarlavhalari(req.headers.get('origin'), d.originlar);
  if (cors === null) return jsonJavob(403, { error: 'origin_not_allowed' });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const javob = (status: number, tana: unknown) => jsonJavob(status, tana, cors);
  if (req.method !== 'POST') return javob(405, { error: 'method_not_allowed' });

  if (d.yetishmaydi.length) {
    d.jurnal('sozlama yetishmaydi', { nomlar: d.yetishmaydi });
    return javob(500, { error: 'server_not_configured' });
  }

  const jwt = bearerToken(req.headers.get('authorization'));
  const userId = jwt ? await d.foydalanuvchi(jwt) : null;
  if (!userId) return javob(401, { error: 'not_signed_in' });

  let paymentId: unknown;
  try {
    paymentId = (await req.json())?.payment_id;
  } catch {
    paymentId = undefined;
  }
  if (typeof paymentId !== 'string' || !UUID.test(paymentId)) return javob(400, { error: 'invalid_request' });

  const tolov = await d.tolovOl(paymentId);
  if (!tolov || tolov.user_id !== userId) return javob(404, { error: 'not_found' });

  const holat = bazaHolati(tolov.status);
  // Yakuniy holat yoki inPAY id si hali yo'q (created): inPAY'ga so'rov kerak emas.
  if (holat !== 'pending' || tolov.status !== 'pending') return javob(200, { status: holat });

  // inPAY'dan o'qish va yakuniy bo'lsa qo'llash (inpay-muvofiqlash bilan umumiy). Natija baribir bazadan o'qiladi.
  const q = await inpaydanQolla(tolov, d);
  if (q.holat !== 'qollandi') return javob(200, { status: 'pending' });

  // Yakuniy javob bazadan (qo'llangandan keyingi holat).
  const keyin = await d.tolovOl(tolov.id);
  return javob(200, { status: keyin ? bazaHolati(keyin.status) : 'pending' });
}
