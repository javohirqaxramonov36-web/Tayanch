import { sirTengmi } from '../_shared/http.ts';

export interface TelegramUser {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

/** Official Login Widget HMAC. A payload is accepted for at most ten minutes. */
export async function telegramniTekshir(payload: unknown, token: string, now = Date.now()): Promise<TelegramUser | null> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload) || !token) return null;
  const data = payload as Record<string, unknown>;
  if (typeof data.hash !== 'string' || !/^[a-f0-9]{64}$/i.test(data.hash)) return null;
  const entries = Object.entries(data).filter(([key]) => key !== 'hash');
  if (entries.some(([key, value]) => !/^[a-z_]+$/.test(key) || !['string', 'number'].includes(typeof value) || String(value).length > 2048)) return null;
  if (!/^[1-9]\d{0,15}$/.test(String(data.id)) || !Number.isSafeInteger(Number(data.id))) return null;
  const authDate = Number(data.auth_date);
  const age = Math.floor(now / 1000) - authDate;
  if (!Number.isSafeInteger(authDate) || authDate <= 0 || age < -30 || age > 600) return null;
  if (typeof data.first_name !== 'string' || !data.first_name.trim()) return null;
  for (const key of ['last_name', 'username', 'photo_url']) {
    if (data[key] !== undefined && typeof data[key] !== 'string') return null;
  }
  const enc = new TextEncoder();
  const secret = await crypto.subtle.digest('SHA-256', enc.encode(token));
  const key = await crypto.subtle.importKey('raw', secret, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const check = entries.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, value]) => `${key}=${value}`).join('\n');
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(check)));
  const hex = [...signature].map((b) => b.toString(16).padStart(2, '0')).join('');
  if (!await sirTengmi(hex, data.hash.toLowerCase())) return null;
  return {
    id: String(data.id), first_name: data.first_name,
    last_name: data.last_name as string | undefined,
    username: data.username as string | undefined,
    photo_url: data.photo_url as string | undefined,
  };
}
