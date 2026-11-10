// tolov-yaratish oqimi soxta bog'liqliklar bilan (Supabase va inPAY'ga ulanmaydi).
import assert from 'node:assert/strict';
import type { TolovSorovi, YaratishNatijasi } from '../_shared/inpay.ts';
import type { RpcNatija } from '../_shared/turlar.ts';
import { type YaratishBogliqlik, tolovYaratish } from '../tolov-yaratish/handler.ts';

const SAYT = 'https://javohirqaxramonov36-web.github.io';
const USER = '00000000-0000-4000-8000-00000000000c';
const PID = '11111111-2222-4333-8444-555555555555';

interface Holat {
  rpc: Array<{ nomi: string; args: Record<string, unknown> }>;
  inpay: TolovSorovi[];
  jurnal: string[];
}

function bogliqlik(o: {
  yaratish?: RpcNatija;
  inpay?: YaratishNatijasi;
  setInvoice?: RpcNatija;
  yetishmaydi?: string[];
  ochiq?: { payment_id: string; checkout_url: string } | null;
} = {}): { d: YaratishBogliqlik; h: Holat } {
  const h: Holat = { rpc: [], inpay: [], jurnal: [] };
  const d: YaratishBogliqlik = {
    supabaseUrl: 'https://sinov.supabase.co',
    saytUrl: `${SAYT}/Tayanch`,
    originlar: [SAYT],
    yetishmaydi: o.yetishmaydi ?? [],
    foydalanuvchi: (jwt) => Promise.resolve(jwt === 'yaroqli-jwt' ? USER : null),
    rpc: (nomi, args) => {
      h.rpc.push({ nomi, args });
      if (nomi === 'payment_create') {
        return Promise.resolve(o.yaratish ?? {
          data: { payment_id: PID, amount_uzs: 1000, period_days: 30, plan_code: 'pro', plan_name: 'Pro', bolim: 'sat' },
          error: null,
        });
      }
      return Promise.resolve(o.setInvoice ?? { data: 'pending', error: null });
    },
    inpayYarat: (s) => {
      h.inpay.push(s);
      return Promise.resolve(o.inpay ?? {
        ok: true,
        tolov: { id: 'sinovord00000001', status: 'requires_payment_method', checkout_url: 'https://inpay.uz/checkout/sinovord00000001', livemode: false },
      });
    },
    ochiqTolov: () => Promise.resolve(o.ochiq ?? null),
    jurnal: (x) => h.jurnal.push(x),
  };
  return { d, h };
}

function sorov(o: { method?: string; origin?: string | null; jwt?: string | null; tana?: unknown } = {}) {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (o.origin !== null) headers.set('origin', o.origin ?? SAYT);
  if (o.jwt !== null) headers.set('authorization', `Bearer ${o.jwt ?? 'yaroqli-jwt'}`);
  const method = o.method ?? 'POST';
  return new Request('https://sinov.supabase.co/functions/v1/tolov-yaratish', {
    method,
    headers,
    body: method === 'POST' ? JSON.stringify(o.tana ?? { plan: 'pro' }) : undefined,
  });
}

Deno.test('CORS: ruxsat etilgan origin preflight 204, boshqasi 403', async () => {
  const { d } = bogliqlik();
  const r1 = await tolovYaratish(sorov({ method: 'OPTIONS' }), d);
  assert.equal(r1.status, 204);
  assert.equal(r1.headers.get('access-control-allow-origin'), SAYT);
  const r2 = await tolovYaratish(sorov({ origin: 'https://boshqa.invalid' }), d);
  assert.equal(r2.status, 403);
  assert.equal(r2.headers.get('access-control-allow-origin'), null);
});

Deno.test('GET 405; sozlama yetishmasa 500 va nomi logda', async () => {
  assert.equal((await tolovYaratish(sorov({ method: 'GET' }), bogliqlik().d)).status, 405);
  const { d, h } = bogliqlik({ yetishmaydi: ['INPAY_SECRET_KEY'] });
  const r = await tolovYaratish(sorov(), d);
  assert.equal(r.status, 500);
  assert.deepEqual(await r.json(), { error: 'server_not_configured' });
  assert.equal(h.rpc.length, 0);
});

Deno.test('hisobga kirmagan yoki yaroqsiz token: 401, bazaga murojaat yo\'q', async () => {
  for (const jwt of [null, 'eskirgan-jwt']) {
    const { d, h } = bogliqlik();
    const r = await tolovYaratish(sorov({ jwt }), d);
    assert.equal(r.status, 401);
    assert.equal(h.rpc.length, 0);
  }
});

Deno.test('yaroqsiz tana: 400', async () => {
  for (const tana of [{}, { plan: 'PRO' }, { plan: 5 }, 'pro']) {
    const { d, h } = bogliqlik();
    assert.equal((await tolovYaratish(sorov({ tana }), d)).status, 400);
    assert.equal(h.rpc.length, 0);
  }
});

Deno.test('payment_create xatolari HTTP holatiga aylanadi', async () => {
  const holatlar: Array<[string, number, string]> = [
    ['plan_not_found', 404, 'plan_not_found'],
    ['plan_not_available', 409, 'plan_not_available'],
    ['plan_price_not_set', 409, 'plan_not_available'],
    ['too_many_payments', 429, 'too_many_payments'],
    ['boshqa xato', 500, 'server_error'],
  ];
  for (const [xabar, status, kod] of holatlar) {
    const { d, h } = bogliqlik({ yaratish: { data: null, error: { message: xabar } } });
    const r = await tolovYaratish(sorov(), d);
    assert.equal(r.status, status, xabar);
    assert.deepEqual(await r.json(), { error: kod });
    assert.equal(h.inpay.length, 0);
  }
});

Deno.test('summa mijozdan kelsa: 400 amount_not_allowed, bazaga va inPAY\'ga murojaat yo\'q', async () => {
  for (const tana of [{ plan: 'pro', amount: 1 }, { plan_code: 'pro', amount_uzs: 1000 }, { plan: 'pro', price: 0 }]) {
    const { d, h } = bogliqlik();
    const r = await tolovYaratish(sorov({ tana }), d);
    assert.equal(r.status, 400);
    assert.deepEqual(await r.json(), { error: 'amount_not_allowed' });
    assert.equal(h.rpc.length, 0);
    assert.equal(h.inpay.length, 0);
  }
});

Deno.test('davr: oylik (standart) qabul qilinadi, boshqasi 409 period_not_available', async () => {
  const { d, h } = bogliqlik();
  const r = await tolovYaratish(sorov({ tana: { plan_code: 'pro', period: '3oylik' } }), d);
  assert.equal(r.status, 409);
  assert.deepEqual(await r.json(), { error: 'period_not_available' });
  assert.equal(h.rpc.length, 0);
  assert.equal((await tolovYaratish(sorov({ tana: { plan_code: 'pro', period: 'oylik' } }), bogliqlik().d)).status, 200);
});

Deno.test('ochiq pending to\'lov bor: yangisi yaratilmaydi, o\'sha havola qaytadi', async () => {
  const ochiq = { payment_id: PID, checkout_url: 'https://inpay.uz/checkout/eski' };
  const { d, h } = bogliqlik({ ochiq });
  const r = await tolovYaratish(sorov(), d);
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ...ochiq, reused: true });
  assert.equal(h.rpc.length, 0);
  assert.equal(h.inpay.length, 0);
});

Deno.test('kassa faol emas (merchant_inactive): 503 payments_unavailable, sabab logda', async () => {
  const { d, h } = bogliqlik({ inpay: { ok: false, httpStatus: 403, code: 'merchant_inactive' } });
  const r = await tolovYaratish(sorov(), d);
  assert.equal(r.status, 503);
  assert.deepEqual(await r.json(), { error: 'payments_unavailable' });
  assert.ok(h.jurnal.some((x) => x.includes('merchant_inactive')));
});

Deno.test('muvaffaqiyat: summa bazadan, set_invoice, checkout_url', async () => {
  const { d, h } = bogliqlik();
  const r = await tolovYaratish(sorov({ tana: { plan: 'pro' } }), d);
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('access-control-allow-origin'), SAYT);
  assert.deepEqual(await r.json(), { payment_id: PID, checkout_url: 'https://inpay.uz/checkout/sinovord00000001', reused: false });
  assert.deepEqual(h.rpc[0], { nomi: 'payment_create', args: { p_user: USER, p_plan_code: 'pro' } });
  assert.deepEqual(h.inpay[0], {
    paymentId: PID,
    planCode: 'pro',
    amountUzs: 1000,
    description: 'Tayanch SAT Pro, 30 days',
    returnUrl: `${SAYT}/Tayanch/uz/sat/hisob/tolov-natija/?tolov=${PID}`,
    webhookUrl: 'https://sinov.supabase.co/functions/v1/inpay-webhook',
  });
  assert.equal(h.rpc[1].nomi, 'payment_set_invoice');
  assert.equal(h.rpc[1].args.p_payment_id, PID);
  assert.equal(h.rpc[1].args.p_provider_order_id, 'sinovord00000001');
});

Deno.test('inPAY xatosi: to\'lov failed deb yoziladi, 502, havola yo\'q', async () => {
  const { d, h } = bogliqlik({ inpay: { ok: false, httpStatus: 400, code: 'domain_not_whitelisted', requestId: 'req_sinov' } });
  const r = await tolovYaratish(sorov(), d);
  assert.equal(r.status, 502);
  assert.deepEqual(await r.json(), { error: 'payment_provider_error' });
  assert.deepEqual(h.rpc[1], {
    nomi: 'payment_set_invoice',
    args: {
      p_payment_id: PID,
      p_provider_order_id: null,
      p_response: { code: 'domain_not_whitelisted', http_status: 400, request_id: 'req_sinov' },
    },
  });
});

Deno.test('set_invoice yozilmasa: 500, checkout_url berilmaydi', async () => {
  const { d } = bogliqlik({ setInvoice: { data: null, error: { message: 'payment_wrong_state' } } });
  const r = await tolovYaratish(sorov(), d);
  assert.equal(r.status, 500);
  assert.deepEqual(await r.json(), { error: 'server_error' });
});
