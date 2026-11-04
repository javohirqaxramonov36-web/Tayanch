// Ichki havola yasaydi: base ("/Tayanch") ni hisobga oladi.
// yol('/uz/sat/') -> '/Tayanch/uz/sat/'
export function yol(manzil: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (manzil.startsWith('/') ? manzil : '/' + manzil);
}
