// Edge Function'lar uchun umumiy HTTP yordamchilari: JSON javob, CORS, Bearer token.

export function jsonJavob(status: number, tana: unknown, sarlavhalar: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(tana), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...sarlavhalar },
  });
}

/**
 * Brauzerdan chaqiriladigan funksiya uchun CORS sarlavhalari.
 * Origin ro'yxatda bo'lmasa null (so'rov rad etiladi). Origin yo'q bo'lsa (brauzer emas) bo'sh obyekt.
 */
export function corsSarlavhalari(origin: string | null, ruxsat: readonly string[]): Record<string, string> | null {
  if (!origin) return {};
  if (!ruxsat.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

export function bearerToken(sarlavha: string | null): string | null {
  const m = /^Bearer\s+(\S+)$/i.exec(sarlavha?.trim() ?? '');
  return m ? m[1] : null;
}

/**
 * Ikki maxfiy satrni doimiy vaqtda solishtiradi (uzunligi har xil bo'lsa ham): avval SHA-256, so'ng bayt XOR.
 * Bo'sh satr hech qachon teng emas.
 */
export async function sirTengmi(a: string | null | undefined, b: string | null | undefined): Promise<boolean> {
  if (!a || !b) return false;
  const enc = new TextEncoder();
  const [x, y] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  const u = new Uint8Array(x);
  const v = new Uint8Array(y);
  let farq = 0;
  for (let i = 0; i < u.length; i++) farq |= u[i] ^ v[i];
  return farq === 0;
}
