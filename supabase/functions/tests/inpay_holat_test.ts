// inpay-holat oqimi soxta bog'liqliklar bilan (Supabase va inPAY'ga ulanmaydi).
import assert from 'node:assert/strict';
import { type HolatNatijasi, inpayHolatiniOgir, inpayTolovHolati } from '../_shared/inpay.ts';
import type { RpcNatija } from '../_shared/turlar.ts';
import { type BazaTolov, type HolatBogliqlik, inpayHolat } from '../inpay-holat/handler.ts';

const SAYT = 'https://javohirqaxramonov36-web.github.io';
const EGA = '00000000-0000-4000-8000-00000000000a';
const BEGONA = '00000000-0000-4000-8000-00000000000b';
const PID = '11111111-2222-4333-8444-555555555555';
const INPAY_ID = '0123456789abcdef';

interface Holat {
  rpc: Array<{ nomi: string; args: Record<string, unknown> }>;
  inpay: string[];
  jurnal: string[];
}

function bogliqlik(o: {
  tolov?: BazaTolov | null;
  inpay?: HolatNatijasi;
  qollash?: RpcNatija;
  keyingiStatus?: string;
} = {}): { d: HolatBogliqlik; h: Holat } {
  const h: Holat = { rpc: [], inpay: [], jurnal: [] };
  let joriy: BazaTolov | null = o.tolov === undefined
    ? { id: PID, user_id: EGA, status: 'pending', provider_order_id: INPAY_ID }
    : o.tolov;
  const d: HolatBogliqlik = {
    originlar: [SAYT],
    yetishmaydi: [],
    foydalanuvchi: (jwt) => Promise.resolve(jwt === 'ega-jwt' ? EGA : jwt === 'begona-jwt' ? BEGONA : null),
    tolovOl: (id) => Promise.resolve(joriy && joriy.id === id ? { ...joriy } : null),
    rpc: (nomi, args) => {
      h.rpc.push({ nomi, args });
      if (joriy && o.keyingiStatus) joriy = { ...joriy, status: o.keyingiStatus };
      return Promise.resolve(o.qollash ?? { data: { result: 'paid' }, error: null });
    },
    inpayHolat: (id) => {
      h.inpay.push(id);
      return Promise.resolve(o.inpay ?? {
        ok: true,
        tolov: { id: INPAY_ID, status: 'processing', amount: 1000, currency: 'UZS', livemode: false, metadata: {} },
      });
    },
    jurnal: (x) => h.jurnal.push(x),
  };
  return { d, h };
}

function sorov(o: { jwt?: string | null; tana?: unknown; origin?: string } = {}) {
  const headers = new Headers({ 'content-type': 'application/json', origin: o.origin ?? SAYT });
  if (o.jwt !== null) headers.set('authorization', `Bearer ${o.jwt ?? 'ega-jwt'}`);
  return new Request('https://sinov.supabase.co/functions/v1/inpay-holat', {
    method: 'POST',
    headers,
    body: JSON.stringify(o.tana ?? { payment_id: PID }),
  });
}

Deno.test('inPAY holatlari: faqat succeeded success, failed/canceled failed, qolgani pending', () => {
  assert.equal(inpayHolatiniOgir('succeeded'), 'success');
  assert.equal(inpayHolatiniOgir('failed'), 'failed');
  assert.equal(inpayHolatiniOgir('canceled'), 'failed');
  for (const s of ['requires_payment_method', 'requires_action', 'processing', 'nomalum']) {
    assert.equal(inpayHolatiniOgir(s), 'pending');
  }
});

Deno.test('kirmagan: 401; boshqa origin: 403', async () => {
  assert.equal((await inpayHolat(sorov({ jwt: null }), bogliqlik().d)).status, 401);
  assert.equal((await inpayHolat(sorov({ origin: 'https://boshqa.invalid' }), bogliqlik().d)).status, 403);
});

Deno.test('boshqa foydalanuvchining JWT si: 404 (yo\'q to\'lov bilan bir xil), inPAY so\'ralmaydi', async () => {
  const { d, h } = bogliqlik();
  const r = await inpayHolat(sorov({ jwt: 'begona-jwt' }), d);
  assert.equal(r.status, 404);
  assert.deepEqual(await r.json(), { error: 'not_found' });
  const yoq = await inpayHolat(sorov({ tana: { payment_id: '99999999-2222-4333-8444-555555555555' } }), bogliqlik().d);
  assert.equal(yoq.status, 404);
  assert.deepEqual(await yoq.json(), { error: 'not_found' });
  assert.equal(h.inpay.length, 0);
  assert.equal(h.rpc.length, 0);
});

Deno.test('yaroqsiz payment_id: 400', async () => {
  for (const tana of [{}, { payment_id: 'abc' }, { payment_id: 5 }]) {
    assert.equal((await inpayHolat(sorov({ tana }), bogliqlik().d)).status, 400);
  }
});

Deno.test('bazada yakuniy holat: inPAY so\'ralmaydi', async () => {
  for (const [status, kutilgan] of [['paid', 'success'], ['failed', 'failed'], ['canceled', 'failed'], ['created', 'pending']]) {
    const { d, h } = bogliqlik({ tolov: { id: PID, user_id: EGA, status, provider_order_id: INPAY_ID } });
    const r = await inpayHolat(sorov(), d);
    assert.deepEqual(await r.json(), { status: kutilgan }, status);
    assert.equal(h.inpay.length, 0);
  }
});

Deno.test('inPAY hali processing: pending, bazaga yozilmaydi', async () => {
  const { d, h } = bogliqlik();
  const r = await inpayHolat(sorov(), d);
  assert.deepEqual(await r.json(), { status: 'pending' });
  assert.deepEqual(h.inpay, [INPAY_ID]);
  assert.equal(h.rpc.length, 0);
});

Deno.test('inPAY succeeded: payment_apply_event bilan qo\'llanadi, javob bazadan', async () => {
  const tolov = { id: INPAY_ID, status: 'succeeded', amount: 1000, currency: 'UZS', livemode: false, metadata: { payment_id: PID } };
  const { d, h } = bogliqlik({ inpay: { ok: true, tolov }, keyingiStatus: 'paid' });
  const r = await inpayHolat(sorov(), d);
  assert.deepEqual(await r.json(), { status: 'success' });
  assert.equal(h.rpc.length, 1);
  assert.equal(h.rpc[0].nomi, 'payment_apply_event');
  const e = h.rpc[0].args.p_event as Record<string, unknown>;
  assert.equal(e.id, `poll_${INPAY_ID}_succeeded`);
  assert.equal(e.type, 'payment.succeeded');
  assert.equal(e.livemode, false);
  assert.deepEqual(e.data, { object: tolov });
});

Deno.test('qo\'llash rad etsa (masalan amount_mismatch): obuna yo\'q, pending, sabab logda', async () => {
  const tolov = { id: INPAY_ID, status: 'succeeded', amount: 1, currency: 'UZS', livemode: false, metadata: {} };
  const { d, h } = bogliqlik({ inpay: { ok: true, tolov }, qollash: { data: { result: 'error', error: 'amount_mismatch' }, error: null } });
  const r = await inpayHolat(sorov(), d);
  assert.deepEqual(await r.json(), { status: 'pending' });
  assert.ok(h.jurnal.includes('to\'lov qo\'llanmadi'));
});

Deno.test('inPAY failed: failed', async () => {
  const tolov = { id: INPAY_ID, status: 'failed', amount: 1000, currency: 'UZS', livemode: false, metadata: {} };
  const { d, h } = bogliqlik({ inpay: { ok: true, tolov }, keyingiStatus: 'failed' });
  assert.deepEqual(await (await inpayHolat(sorov(), d)).json(), { status: 'failed' });
  assert.equal((h.rpc[0].args.p_event as Record<string, unknown>).type, 'payment.failed');
});

Deno.test('inPAY xatosi yoki boshqa id: pending, merchant_inactive logda aniq', async () => {
  const { d, h } = bogliqlik({ inpay: { ok: false, httpStatus: 403, code: 'merchant_inactive' } });
  assert.deepEqual(await (await inpayHolat(sorov(), d)).json(), { status: 'pending' });
  assert.ok(h.jurnal.some((x) => x.includes('merchant_inactive')));
  const b = bogliqlik({ inpay: { ok: true, tolov: { id: 'boshqa0000000000', status: 'succeeded', amount: 1000, currency: 'UZS', livemode: false, metadata: {} } } });
  assert.deepEqual(await (await inpayHolat(sorov(), b.d)).json(), { status: 'pending' });
  assert.equal(b.h.rpc.length, 0);
});

Deno.test('inpayTolovHolati: GET /payments/{id}, Bearer kalit, javob tekshiriladi', async () => {
  const chaqiruvlar: Array<{ url: string; init?: RequestInit }> = [];
  const fetchFn = (url: string, init?: RequestInit) => {
    chaqiruvlar.push({ url, init });
    return Promise.resolve(new Response(JSON.stringify({
      success: true,
      data: { id: INPAY_ID, object: 'payment', status: 'succeeded', amount: 1000, currency: 'UZS', livemode: false, metadata: null },
    })));
  };
  const r = await inpayTolovHolati(INPAY_ID, { secretKey: 'sk_test_soxta', fetchFn });
  assert.equal(r.ok, true);
  assert.equal(chaqiruvlar[0].url, `https://inpay.uz/api/v2/payments/${INPAY_ID}`);
  assert.equal(chaqiruvlar[0].init?.method, 'GET');
  assert.equal(new Headers(chaqiruvlar[0].init?.headers).get('authorization'), 'Bearer sk_test_soxta');
  if (r.ok) assert.deepEqual(r.tolov.metadata, {});

  const xato = await inpayTolovHolati(INPAY_ID, {
    secretKey: 'sk_test_soxta',
    fetchFn: () => Promise.resolve(new Response(JSON.stringify({ success: false, error: { code: 'resource_missing' } }), { status: 404 })),
  });
  assert.deepEqual(xato, { ok: false, httpStatus: 404, code: 'resource_missing' });
  assert.deepEqual(await inpayTolovHolati('../boshqa', { secretKey: 'x' }), { ok: false, httpStatus: 0, code: 'invalid_id' });
});
