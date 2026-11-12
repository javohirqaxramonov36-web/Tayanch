// SAT to'lovi: brauzer tomoni. Faqat Edge Function'larni chaqiradi; summa yubormaydi, to'lovni "tasdiqlamaydi".
//   tolov-yaratish  {plan_code, period}  -> {payment_id, checkout_url}
//   inpay-holat     {payment_id}         -> {status: pending | success | failed}
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from 'astro:env/client';
import { hisobMijoz } from '../hisob';
import { TOLOV_KALITI } from '../../data/satTarif';

export type FunksiyaNatija<T> = { ok: true; data: T } | { ok: false; kod: string; status: number };

export async function funksiya<T>(nomi: 'tolov-yaratish' | 'inpay-holat' | 'ai-tutor', tana: Record<string, unknown>): Promise<FunksiyaNatija<T>> {
  const c = hisobMijoz();
  if (!c || !PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return { ok: false, kod: 'server_not_configured', status: 0 };
  const { data } = await c.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return { ok: false, kod: 'not_signed_in', status: 401 };
  let res: Response;
  try {
    res = await fetch(`${PUBLIC_SUPABASE_URL}/functions/v1/${nomi}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, apikey: PUBLIC_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(tana),
    });
  } catch {
    return { ok: false, kod: 'network_error', status: 0 };
  }
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  if (res.ok && json && typeof json === 'object') return { ok: true, data: json as T };
  const kod = json && typeof json === 'object' && typeof (json as { error?: unknown }).error === 'string'
    ? (json as { error: string }).error
    : `http_${res.status}`;
  return { ok: false, kod, status: res.status };
}

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
