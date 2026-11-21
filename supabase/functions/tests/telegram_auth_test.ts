import { telegramniTekshir } from '../telegram-auth/verify.ts';
import { telegramAuth } from '../telegram-auth/handler.ts';

const now = Date.UTC(2026, 10, 21, 12);
const secret = crypto.randomUUID();
async function signed(extra: Record<string, unknown> = {}) {
  const data: Record<string, unknown> = { id: 12345, first_name: 'Test', auth_date: now / 1000, username: 'test', ...extra };
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(secret));
  const key = await crypto.subtle.importKey('raw', digest, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const check = Object.keys(data).sort().map((key) => `${key}=${data[key]}`).join('\n');
  data.hash = [...new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(check)))].map((n) => n.toString(16).padStart(2, '0')).join('');
  return data;
}
function assert(ok: unknown) { if (!ok) throw new Error('Assertion failed'); }
Deno.test('Telegram valid payload and exact 600-second boundary', async () => {
  const payload = await signed();
  assert((await telegramniTekshir(payload, secret, now))?.id === '12345');
  assert(await telegramniTekshir(payload, secret, now + 600000));
  assert(!await telegramniTekshir(payload, secret, now + 601000));
});
Deno.test('Telegram tampered fields, wrong secret and invalid hash are rejected', async () => {
  const payload = await signed();
  assert(!await telegramniTekshir({ ...payload, first_name: 'Other' }, secret, now));
  assert(!await telegramniTekshir(payload, crypto.randomUUID(), now));
  assert(!await telegramniTekshir({ ...payload, hash: '0'.repeat(64) }, secret, now));
  assert(!await telegramniTekshir({ ...payload, hash: 'z'.repeat(64) }, secret, now));
});
Deno.test('Telegram future dates, malformed values and optional signed fields', async () => {
  assert(!await telegramniTekshir(await signed({ auth_date: now / 1000 + 31 }), secret, now));
  assert(!await telegramniTekshir(await signed({ id: '1.5' }), secret, now));
  assert(!await telegramniTekshir(await signed({ username: {} }), secret, now));
  assert(await telegramniTekshir(await signed({ photo_url: 'https://example.com/photo.jpg', last_name: 'User' }), secret, now));
  assert(!await telegramniTekshir(null, secret, now));
});
Deno.test('Telegram HTTP rejects foreign origins and safely handles missing configuration', async () => {
  const deps = { admin: null, token: undefined, originlar: ['https://tayanchedu.uz'], jurnal: () => {} };
  const blocked = await telegramAuth(new Request('https://example.com', { headers: { Origin: 'https://other.example' } }), deps);
  assert(blocked.status === 403);
  const preflight = await telegramAuth(new Request('https://example.com', { method: 'OPTIONS', headers: { Origin: 'https://tayanchedu.uz' } }), deps);
  assert(preflight.status === 204);
  const missing = await telegramAuth(new Request('https://example.com', { method: 'POST' }), deps);
  assert(missing.status === 503);
  assert((await missing.json()).error === "Kirishda xatolik. Qaytadan urinib ko'ring.");
});

function backend(mode: 'new' | 'existing' | 'race' | 'collision' | 'wrong_identity' | 'save_failure' | 'link_failure') {
  let profil = ['existing', 'wrong_identity', 'save_failure', 'link_failure'].includes(mode) ? { id: 'account-1' } : null;
  const calls: string[] = [];
  const db = {
    from() {
      return {
        select() { return this; }, eq() { return this; },
        async maybeSingle() { return { data: profil, error: null }; },
        update() { calls.push('save'); return this; },
        async single() { return { data: profil, error: mode === 'save_failure' ? new Error('db') : null }; },
      };
    },
    auth: { admin: {
      async createUser(input: { email: string; email_confirm: boolean; app_metadata: { telegram_id: string } }) {
        calls.push('create');
        assert(input.email === 'tg_12345@users.tayanchedu.uz' && input.email_confirm && input.app_metadata.telegram_id === '12345');
        if (mode !== 'collision') profil = { id: 'account-1' };
        return { data: { user: mode === 'new' ? { id: 'account-1' } : null }, error: mode === 'new' ? null : new Error('existing') };
      },
      async getUserById() {
        return { data: { user: { id: 'account-1', email: 'tg_12345@users.tayanchedu.uz', app_metadata: { telegram_id: mode === 'wrong_identity' ? 'other' : '12345' } } }, error: null };
      },
      async generateLink(input: { type: string }) {
        calls.push('link'); assert(input.type === 'magiclink');
        return { data: { user: { id: 'account-1' }, properties: { hashed_token: 'synthetic-one-use-hash' } }, error: mode === 'link_failure' ? new Error('link') : null };
      },
    } },
  };
  return { calls, deps: { admin: db as unknown as NonNullable<Parameters<typeof telegramAuth>[1]['admin']>, token: secret, originlar: ['https://tayanchedu.uz'], jurnal: () => {} } };
}
async function requestSigned() {
  return new Request('https://example.com', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://tayanchedu.uz' }, body: JSON.stringify(await signed({ auth_date: Math.floor(Date.now() / 1000) })) });
}
Deno.test('Telegram creates or reuses only the claimed identity, including concurrent first login', async () => {
  for (const mode of ['new', 'existing', 'race'] as const) {
    const { deps, calls } = backend(mode);
    const res = await telegramAuth(await requestSigned(), deps);
    assert(res.status === 200);
    const body = await res.json();
    assert(Object.keys(body).join(',') === 'hashed_token');
    assert(body.hashed_token === 'synthetic-one-use-hash');
    assert(calls.filter((x) => x === 'link').length === 1);
    assert(calls.includes('create') === (mode !== 'existing'));
  }
});
Deno.test('Telegram cannot adopt a colliding email or mismatched server identity', async () => {
  for (const mode of ['collision', 'wrong_identity'] as const) {
    const { deps, calls } = backend(mode);
    const res = await telegramAuth(await requestSigned(), deps);
    assert(res.status >= 400);
    assert(!calls.includes('link'));
  }
});
Deno.test('Telegram partial profile/link failures issue no token and return generic errors', async () => {
  for (const mode of ['save_failure', 'link_failure'] as const) {
    const { deps, calls } = backend(mode);
    const res = await telegramAuth(await requestSigned(), deps);
    assert(res.status === 500);
    assert(Object.keys(await res.json()).join(',') === 'error');
    if (mode === 'save_failure') assert(!calls.includes('link'));
  }
});
Deno.test('Telegram malformed, oversized and invalid signed requests do not touch accounts', async () => {
  const { deps, calls } = backend('new');
  for (const body of ['{', JSON.stringify({ hash: '0'.repeat(64) }), JSON.stringify({ long: 'x'.repeat(8200) })]) {
    const req = new Request('https://example.com', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    assert((await telegramAuth(req, deps)).status >= 400);
  }
  assert(calls.length === 0);
});
