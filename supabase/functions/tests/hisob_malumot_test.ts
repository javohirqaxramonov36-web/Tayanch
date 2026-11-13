// hisob-malumot oqimi soxta bog'liqliklar bilan (Supabase'ga ulanmaydi).
import assert from 'node:assert/strict';
import { hisobMalumot, type MalumotBogliqlik, oxirgiKirish, QAYTA_KIRISH_SONIYA } from '../hisob-malumot/handler.ts';

const SAYT = 'https://javohirqaxramonov36-web.github.io';
const EGA = '00000000-0000-4000-8000-00000000000a';
const HOZIR = 1_800_000_000;

/** Imzosiz soxta JWT: faqat payload (imzoni `foydalanuvchi` tekshiradi, bu yerda soxta). */
function jwt(amr: unknown): string {
  const b64 = (o: unknown) => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64({ alg: 'HS256' })}.${b64({ sub: EGA, amr })}.imzo`;
}
const YANGI = jwt([{ method: 'password', timestamp: HOZIR - 60 }]);
const ESKI = jwt([{ method: 'password', timestamp: HOZIR - QAYTA_KIRISH_SONIYA - 1 }]);

interface Holat { ochirildi: string[]; eksport: number; jurnal: string[]; audit: string[]; bekor: [number, string][] }

function bogliqlik(
  o: { tolovJarayonda?: boolean; ochirXato?: boolean; auditXato?: boolean } = {},
): { d: MalumotBogliqlik; h: Holat } {
  const h: Holat = { ochirildi: [], eksport: 0, jurnal: [], audit: [], bekor: [] };
  const d: MalumotBogliqlik = {
    originlar: [SAYT],
    yetishmaydi: [],
    foydalanuvchi: (t) => Promise.resolve(t === YANGI || t === ESKI ? { id: EGA, email: 'Sinov@Example.com' } : null),
    eksport: () => {
      h.eksport++;
      return Promise.resolve({ format: 'tayanch-malumot/1' });
    },
    jarayondagiTolov: () => Promise.resolve(o.tolovJarayonda ?? false),
    auditYoz: (id) => {
      if (o.auditXato) return Promise.resolve(null);
      h.audit.push(id);
      return Promise.resolve(42);
    },
    auditBekor: (id, xato) => {
      h.bekor.push([id, xato]);
      return Promise.resolve();
    },
    ochir: (id) => {
      if (o.ochirXato) return Promise.resolve({ ok: false, xato: '500:unexpected_failure' });
      h.ochirildi.push(id);
      return Promise.resolve({ ok: true });
    },
    hozir: () => HOZIR,
    jurnal: (x) => h.jurnal.push(x),
  };
  return { d, h };
}

const sorov = (token: string | null, tana: unknown, method = 'POST') =>
  new Request('https://x.supabase.co/functions/v1/hisob-malumot', {
    method,
    headers: { origin: SAYT, 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: method === 'POST' ? JSON.stringify(tana) : undefined,
  });

Deno.test('oxirgiKirish: amr ichidagi eng yangi vaqt; amr yo\'q yoki buzuq bo\'lsa null', () => {
  assert.equal(oxirgiKirish(jwt([{ method: 'password', timestamp: 10 }, { method: 'oauth', timestamp: 20 }])), 20);
  assert.equal(oxirgiKirish(jwt(undefined)), null);
  assert.equal(oxirgiKirish('buzuq'), null);
});

Deno.test('kirmagan foydalanuvchi 401', async () => {
  const { d } = bogliqlik();
  assert.equal((await hisobMalumot(sorov(null, { amal: 'eksport' }), d)).status, 401);
  assert.equal((await hisobMalumot(sorov('yaroqsiz', { amal: 'eksport' }), d)).status, 401);
});

Deno.test('begona origin 403, OPTIONS 204, GET 405', async () => {
  const { d } = bogliqlik();
  const begona = new Request('https://x/', { method: 'POST', headers: { origin: 'https://yomon.example' } });
  assert.equal((await hisobMalumot(begona, d)).status, 403);
  const opt = new Request('https://x/', { method: 'OPTIONS', headers: { origin: SAYT } });
  assert.equal((await hisobMalumot(opt, d)).status, 204);
  assert.equal((await hisobMalumot(sorov(YANGI, null, 'GET'), d)).status, 405);
});

Deno.test('eksport: eski sessiya bilan ham ishlaydi (qayta kirish talab qilinmaydi)', async () => {
  const { d, h } = bogliqlik();
  const r = await hisobMalumot(sorov(ESKI, { amal: 'eksport' }), d);
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { malumot: { format: 'tayanch-malumot/1' } });
  assert.equal(h.eksport, 1);
});

Deno.test('o\'chirish: tasdiq emaili mos kelmasa 400, hech narsa o\'chmaydi', async () => {
  const { d, h } = bogliqlik();
  const r = await hisobMalumot(sorov(YANGI, { amal: 'ochirish', tasdiq: 'boshqa@example.com' }), d);
  assert.equal(r.status, 400);
  assert.deepEqual(await r.json(), { error: 'confirmation_mismatch' });
  assert.equal(h.ochirildi.length, 0);
});

Deno.test('o\'chirish: eski kirish bilan 403 reauth_required', async () => {
  const { d, h } = bogliqlik();
  const r = await hisobMalumot(sorov(ESKI, { amal: 'ochirish', tasdiq: 'sinov@example.com' }), d);
  assert.equal(r.status, 403);
  assert.deepEqual(await r.json(), { error: 'reauth_required' });
  assert.equal(h.ochirildi.length, 0);
});

Deno.test('o\'chirish: tugallanmagan to\'lov bo\'lsa 409', async () => {
  const { d, h } = bogliqlik({ tolovJarayonda: true });
  const r = await hisobMalumot(sorov(YANGI, { amal: 'ochirish', tasdiq: 'sinov@example.com' }), d);
  assert.equal(r.status, 409);
  assert.equal(h.ochirildi.length, 0);
});

Deno.test('o\'chirish: yangi kirish va to\'g\'ri email (katta-kichik harf farqi bilan) 200', async () => {
  const { d, h } = bogliqlik();
  const r = await hisobMalumot(sorov(YANGI, { amal: 'ochirish', tasdiq: '  SINOV@example.com ' }), d);
  assert.equal(r.status, 200);
  assert.deepEqual(h.ochirildi, [EGA]);
  assert.deepEqual(h.audit, [EGA]);
  assert.equal(h.bekor.length, 0);
});

Deno.test('o\'chirish: server xatosi 500 delete_failed, audit yozuvi account_delete_failed ga o\'zgaradi', async () => {
  // Masalan jonli bazada payments.user_id hali "on delete restrict" (20261112090000 qo'llanmagan) va hisobda to'lov bor.
  const { d, h } = bogliqlik({ ochirXato: true });
  const r = await hisobMalumot(sorov(YANGI, { amal: 'ochirish', tasdiq: 'sinov@example.com' }), d);
  assert.equal(r.status, 500);
  assert.deepEqual(await r.json(), { error: 'delete_failed' });
  assert.deepEqual(h.bekor, [[42, '500:unexpected_failure']]);
});

Deno.test('o\'chirish: audit yozilmasa 500 audit_failed, hisob o\'chirilmaydi', async () => {
  const { d, h } = bogliqlik({ auditXato: true });
  const r = await hisobMalumot(sorov(YANGI, { amal: 'ochirish', tasdiq: 'sinov@example.com' }), d);
  assert.equal(r.status, 500);
  assert.deepEqual(await r.json(), { error: 'audit_failed' });
  assert.equal(h.ochirildi.length, 0);
});

Deno.test('o\'chirish: Google bilan qayta kirish (amr oauth) ham yangi kirish hisoblanadi', async () => {
  const { d, h } = bogliqlik();
  const g = jwt([{ method: 'password', timestamp: HOZIR - 86_400 }, { method: 'oauth', timestamp: HOZIR - 30 }]);
  d.foydalanuvchi = (t) => Promise.resolve(t === g ? { id: EGA, email: 'sinov@example.com' } : null);
  const r = await hisobMalumot(sorov(g, { amal: 'ochirish', tasdiq: 'sinov@example.com' }), d);
  assert.equal(r.status, 200);
  assert.deepEqual(h.ochirildi, [EGA]);
});

Deno.test('noma\'lum amal 400', async () => {
  const { d } = bogliqlik();
  assert.equal((await hisobMalumot(sorov(YANGI, { amal: 'boshqa' }), d)).status, 400);
});
