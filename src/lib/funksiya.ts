// Edge Function chaqiruvi (brauzer tomoni): joriy sessiya tokeni bilan POST. Kalit yoki secret yubormaydi,
// faqat ochiq (publishable) kalit `apikey` sarlavhasida. SAT to'lovi (src/lib/sat/tolov.ts) va hisob (P23) ishlatadi.
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from 'astro:env/client';
import { hisobMijoz } from './hisob';

export type FunksiyaNomi = 'tolov-yaratish' | 'inpay-holat' | 'hisob-malumot' | 'ai-tutor';
export type FunksiyaNatija<T> = { ok: true; data: T } | { ok: false; kod: string; status: number };

export async function funksiya<T>(nomi: FunksiyaNomi, tana: Record<string, unknown>): Promise<FunksiyaNatija<T>> {
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

/**
 * Sessiya tokenidagi eng yangi autentifikatsiya vaqti (soniya, JWT `amr`). Faqat ekran uchun (qaysi qadamni
 * ko'rsatish): haqiqiy tekshiruv serverda (supabase/functions/hisob-malumot/handler.ts, oxirgiKirish).
 */
export function tokenKirishVaqti(token: string | undefined): number | null {
  const qism = token?.split('.')[1];
  if (!qism) return null;
  try {
    const b64 = qism.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(qism.length / 4) * 4, '=');
    const payload = JSON.parse(atob(b64));
    const vaqtlar = (Array.isArray(payload?.amr) ? payload.amr : [])
      .map((x: { timestamp?: unknown }) => Number(x?.timestamp))
      .filter((n: number) => Number.isFinite(n) && n > 0);
    return vaqtlar.length ? Math.max(...vaqtlar) : null;
  } catch {
    return null;
  }
}
