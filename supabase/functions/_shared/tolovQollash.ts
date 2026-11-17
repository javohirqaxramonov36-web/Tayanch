// inPAY'dan to'lov holatini o'qib, yakuniy bo'lsa bazaga qo'llash. inpay-holat (foydalanuvchi so'raydi) va
// inpay-muvofiqlash (webhook kelmay qolgan to'lovlar, rejalashtirilgan) uchun umumiy.
//
// IP03: "Webhook kelmagan yoki shubha bo'lgan holatda holatni GET /payments/{id} dan tekshiring".
// Yakuniy holat webhook bilan BIR XIL SQL funksiya payment_apply_event ga beriladi (summa, valyuta, livemode,
// metadata tekshiruvi, obuna, audit_log shu yerda). Hodisa id si barqaror (poll_<inpay id>_<status>):
// takror chaqiruv 'duplicate', webhook allaqachon qo'llagan bo'lsa 'already_paid'. Obuna takror uzaytirilmaydi.
import { type HolatNatijasi, inpayHolatiniOgir, kassaFaolEmasmi } from './inpay.ts';
import type { RpcNatija } from './turlar.ts';

export interface QollashBogliqlik {
  inpayHolat: (inpayId: string) => Promise<HolatNatijasi>;
  rpc: (nomi: string, args: Record<string, unknown>) => Promise<RpcNatija>;
  jurnal: (xabar: string, tafsilot?: Record<string, unknown>) => void;
}

/**
 * pending        inPAY hali yakuniy emas, yoki inPAY'dan javob olinmadi (keyinroq qayta so'raladi)
 * qollandi       payment_apply_event chaqirildi; natija `result` da (paid, already_paid, failed, canceled, duplicate, error)
 * xato           payment_apply_event baza xatosi (keyinroq qayta so'raladi)
 */
export type QollashNatijasi =
  | { holat: 'pending'; sabab: 'inpay_pending' | 'inpay_xato' | 'boshqa_tolov' }
  | { holat: 'qollandi'; result: string; error?: string }
  | { holat: 'xato' };

export async function inpaydanQolla(
  tolov: { id: string; provider_order_id: string },
  d: QollashBogliqlik,
): Promise<QollashNatijasi> {
  const natija = await d.inpayHolat(tolov.provider_order_id);
  if (!natija.ok) {
    d.jurnal(kassaFaolEmasmi(natija.code) ? 'inPAY kassasi faol emas (merchant_inactive)' : 'inPAY holati olinmadi', {
      payment_id: tolov.id,
      kod: natija.code,
      http: natija.httpStatus,
      request_id: natija.requestId,
    });
    return { holat: 'pending', sabab: 'inpay_xato' };
  }

  const inpay = natija.tolov;
  if (inpay.id !== tolov.provider_order_id) {
    d.jurnal('inPAY boshqa to\'lovni qaytardi', { payment_id: tolov.id });
    return { holat: 'pending', sabab: 'boshqa_tolov' };
  }
  if (inpayHolatiniOgir(inpay.status) === 'pending') return { holat: 'pending', sabab: 'inpay_pending' };

  // Webhook hodisasi shaklida (payment_apply_event kutgan tuzilma).
  const hodisa = {
    id: `poll_${inpay.id}_${inpay.status}`,
    type: `payment.${inpay.status}`,
    livemode: inpay.livemode,
    source: 'inpay-holat',
    data: { object: inpay },
  };
  const qollash = await d.rpc('payment_apply_event', { p_event: hodisa });
  if (qollash.error) {
    d.jurnal('payment_apply_event xatosi', { payment_id: tolov.id, kod: qollash.error.code });
    return { holat: 'xato' };
  }
  const r = (typeof qollash.data === 'object' && qollash.data !== null ? qollash.data : {}) as Record<string, unknown>;
  const result = typeof r.result === 'string' ? r.result : 'unknown';
  if (result === 'error') {
    // Masalan amount_mismatch yoki livemode_mismatch: obuna berilmaydi, muallif qo'lda ko'radi.
    d.jurnal('to\'lov qo\'llanmadi', { payment_id: tolov.id, sabab: r.error });
  }
  return { holat: 'qollandi', result, ...(typeof r.error === 'string' ? { error: r.error } : {}) };
}
