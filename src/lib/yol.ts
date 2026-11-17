// Ichki havola yasaydi: base ni hisobga oladi (hozir base yo'q, sayt tayanchedu.uz ildizida).
// yol('/uz/sat/') -> '/uz/sat/' (base "/X" bo'lsa '/X/uz/sat/')
export function yol(manzil: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (manzil.startsWith('/') ? manzil : '/' + manzil);
}
