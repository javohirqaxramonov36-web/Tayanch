import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.118.0';
import { corsSarlavhalari, jsonJavob } from '../_shared/http.ts';
import { telegramniTekshir } from './verify.ts';

interface Boglanish {
  admin: SupabaseClient | null;
  token?: string;
  originlar: readonly string[];
  jurnal: (bosqich: string) => void;
}

const XATO = "Kirishda xatolik. Qaytadan urinib ko'ring.";

export async function telegramAuth(req: Request, d: Boglanish): Promise<Response> {
  const cors = corsSarlavhalari(req.headers.get('Origin'), d.originlar);
  if (!cors) return jsonJavob(403, { error: XATO });
  const rad = (status: number, bosqich: string) => {
    d.jurnal(bosqich);
    return jsonJavob(status, { error: XATO }, cors);
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return rad(405, 'method');
  if (!d.admin || !d.token) return rad(503, 'configuration');
  if (!req.headers.get('Content-Type')?.startsWith('application/json')) return rad(400, 'content_type');
  try {
    // Bound the stream before JSON parsing, including chunked requests without Content-Length.
    const reader = req.body?.getReader();
    if (!reader) return rad(400, 'body');
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 8192) { await reader.cancel(); return rad(413, 'body_size'); }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let payload: unknown;
    try { payload = JSON.parse(new TextDecoder().decode(bytes)); } catch { return rad(400, 'json'); }
    const user = await telegramniTekshir(payload, d.token);
    if (!user) return rad(401, 'signature_or_time');
    const admin = d.admin;
    async function profilOl() {
      const result = await admin!.from('profiles').select('id').eq('telegram_id', user!.id).maybeSingle();
      if (result.error) throw new Error('profile_lookup');
      return result.data;
    }
    let profil = await profilOl();
    const name = [user.first_name, user.last_name].filter(Boolean).join(' ').slice(0, 80);
    if (!profil) {
      const created = await admin.auth.admin.createUser({
        email: `tg_${user.id}@users.tayanchedu.uz`, email_confirm: true,
        app_metadata: { telegram_id: user.id },
        user_metadata: { full_name: name, display_name: name },
      });
      // The profiles trigger claims telegram_id atomically. On concurrent create/retry, look up
      // the committed claim again. An unrelated account with the same email is never adopted.
      profil = await profilOl();
      if (!profil || (created.data.user && created.data.user.id !== profil.id)) return rad(409, 'create_or_claim');
    }
    const found = await admin.auth.admin.getUserById(profil.id);
    const account = found.data.user;
    if (found.error || !account?.email || String(account.app_metadata.telegram_id) !== user.id) return rad(401, 'identity');
    const saved = await admin.from('profiles').update({
      display_name: name,
      telegram_username: user.username?.slice(0, 64) ?? null,
      telegram_photo_url: user.photo_url ?? null,
    }).eq('id', account.id).eq('telegram_id', user.id).select('id').single();
    if (saved.error) return rad(500, 'profile_save');
    // generateLink does not send mail. Only the one-use hash is returned to the browser.
    const link = await admin.auth.admin.generateLink({ type: 'magiclink', email: account.email });
    if (link.error || link.data.user?.id !== account.id || !link.data.properties?.hashed_token) return rad(500, 'session_link');
    return jsonJavob(200, { hashed_token: link.data.properties.hashed_token }, cors);
  } catch {
    // No payload, Telegram ID, email, credentials or raw provider errors in logs.
    return rad(500, 'request_failed');
  }
}
