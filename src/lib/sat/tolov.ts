// SAT to'lovi: brauzer tomoni. Faqat Edge Function'larni chaqiradi; summa yubormaydi, to'lovni "tasdiqlamaydi".
//   tolov-yaratish  {plan_code, period}  -> {payment_id, checkout_url}
//   inpay-holat     {payment_id}         -> {status: pending | success | failed}
import { TOLOV_KALITI } from '../../data/satTarif';
import { funksiya as umumiyFunksiya, type FunksiyaNatija } from '../funksiya';

export type { FunksiyaNatija };

/** Umumiy chaqiruv (src/lib/funksiya.ts): bu yerda faqat to'lov funksiyalari. */
export const funksiya = <T>(nomi: 'tolov-yaratish' | 'inpay-holat', tana: Record<string, unknown>): Promise<FunksiyaNatija<T>> =>
  umumiyFunksiya<T>(nomi, tana);

/** Xato kodi -> foydalanuvchi matni (inglizcha). Sabab tafsiloti faqat server logida. */
export function tolovXatoMatni(kod: string): string {
  switch (kod) {
    case 'payments_unavailable':
      return 'Payments are temporarily unavailable. Please try again later.';
    case 'plan_not_available':
    case 'plan_not_found':
    case 'period_not_available':
      return 'This plan is not available yet.';
    case 'too_many_payments':
      return 'Too many payment attempts. Please wait an hour and try again.';
    case 'network_error':
      return 'Could not reach the server. Check your connection and try again.';
    case 'server_not_configured':
      return 'Payments are not set up on this site yet.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/** "149,000 so'm" (butun so'm, inglizcha guruhlash). */
export const narxYozuv = (som: number) => `${new Intl.NumberFormat('en-US').format(som)} so'm`;

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function oxirgiTolov(): string | null {
  try {
    const id = JSON.parse(localStorage.getItem(TOLOV_KALITI) ?? 'null')?.payment_id;
    return typeof id === 'string' && UUID.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function tolovniEsla(paymentId: string): void {
  try {
    localStorage.setItem(TOLOV_KALITI, JSON.stringify({ payment_id: paymentId, vaqt: new Date().toISOString() }));
  } catch {
    // saqlab bo'lmasa ham to'lov ishlaydi: qaytish havolasida ?tolov= bor
  }
}

export function tolovniUnut(): void {
  try {
    localStorage.removeItem(TOLOV_KALITI);
  } catch {
    // e'tiborsiz
  }
}
