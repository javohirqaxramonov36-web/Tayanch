// deno test --no-lock supabase/functions/tests/
// Tarmoqsiz: fetch soxta, imzo Node crypto bilan mustaqil hisoblanadi (Web Crypto'dagi kod bilan solishtirish uchun).
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import {
  type FetchFn,
  imzoSarlavhasi,
  inpayTolovYarat,
  type TolovSorovi,
  tolovTanasi,
  webhookImzosiniTekshir,
} from '../_shared/inpay.ts';

const SIR = 'sinov-siri';
const T = 1_790_511_600;
const enc = (s: string) => new TextEncoder().encode(s);
const imzola = (tana: string, t = T, sir = SIR) => createHmac('sha256', sir).update(`${t}.${tana}`).digest('hex');

const SOROV: TolovSorovi = {
  paymentId: '11111111-2222-4333-8444-555555555555',
  planCode: 'pro',
  amountUzs: 1000,
  description: 'Tayanch SAT Pro, 30 days',
  returnUrl: 'https://sinov.invalid/qaytish',
  webhookUrl: 'https://sinov.invalid/webhook',
};

const TOLOV = {
  id: '47907909afd21a28',
  object: 'payment',
  amount: 1000,
  currency: 'UZS',
  status: 'requires_payment_method',
  checkout_url: 'https://inpay.uz/checkout/47907909afd21a28',
  livemode: false,
  metadata: { payment_id: SOROV.paymentId, plan_code: 'pro' },
};

function soxtaFetch(javoblar: Array<Response | Error>) {
  const chaqiruvlar: Array<{ url: string; init?: RequestInit }> = [];
  const fetchFn: FetchFn = (url, init) => {
    chaqiruvlar.push({ url, init });
    const j = javoblar.shift();
    if (!j) throw new Error('kutilmagan chaqiruv');
    return j instanceof Error ? Promise.reject(j) : Promise.resolve(j);
  };
  return { fetchFn, chaqiruvlar };
}

const jsonRes = (status: number, tana: unknown) => new Response(JSON.stringify(tana), { status });

Deno.test('tolovTanasi: inPAY v2 maydonlari, summa butun so\'m, metadata', () => {
  assert.deepEqual(tolovTanasi(SOROV), {
    amount: 1000,
    currency: 'UZS',
    description: 'Tayanch SAT Pro, 30 days',
    return_url: 'https://sinov.invalid/qaytish',
    webhook_url: 'https://sinov.invalid/webhook',
    metadata: { payment_id: SOROV.paymentId, plan_code: 'pro' },
  });
});

Deno.test('inpayTolovYarat: muvaffaqiyat; manzil, kalit, Idempotency-Key', async () => {
  const { fetchFn, chaqiruvlar } = soxtaFetch([jsonRes(200, { success: true, data: TOLOV })]);
  const n = await inpayTolovYarat(SOROV, { secretKey: 'sk_test_sinov', fetchFn, kutishMs: 0 });
  assert.equal(n.ok, true);
  assert.equal(n.ok && n.tolov.id, TOLOV.id);
  assert.equal(chaqiruvlar.length, 1);
  assert.equal(chaqiruvlar[0].url, 'https://inpay.uz/api/v2/payments/');
  assert.equal(chaqiruvlar[0].init?.method, 'POST');
  const h = new Headers(chaqiruvlar[0].init?.headers);
  assert.equal(h.get('authorization'), 'Bearer sk_test_sinov');
  assert.equal(h.get('idempotency-key'), SOROV.paymentId);
  assert.equal(h.get('content-type'), 'application/json');
  assert.deepEqual(JSON.parse(String(chaqiruvlar[0].init?.body)), tolovTanasi(SOROV));
});

Deno.test('inpayTolovYarat: 503 dan keyin bir xil Idempotency-Key bilan qayta urinadi', async () => {
  const { fetchFn, chaqiruvlar } = soxtaFetch([
    jsonRes(503, { success: false, error: { code: 'service_unavailable' } }),
    jsonRes(200, { success: true, data: TOLOV }),
  ]);
  const n = await inpayTolovYarat(SOROV, { secretKey: 'sk_test_sinov', fetchFn, kutishMs: 0 });
  assert.equal(n.ok, true);
  assert.equal(chaqiruvlar.length, 2);
  const kalitlar = chaqiruvlar.map((c) => new Headers(c.init?.headers).get('idempotency-key'));
  assert.deepEqual(kalitlar, [SOROV.paymentId, SOROV.paymentId]);
});

Deno.test('inpayTolovYarat: tarmoq ikki marta uzilsa network_error', async () => {
  const { fetchFn, chaqiruvlar } = soxtaFetch([new TypeError('uzildi'), new TypeError('uzildi')]);
  const n = await inpayTolovYarat(SOROV, { secretKey: 'sk_test_sinov', fetchFn, kutishMs: 0 });
  assert.deepEqual(n, { ok: false, httpStatus: 0, code: 'network_error' });
  assert.equal(chaqiruvlar.length, 2);
});

Deno.test('inpayTolovYarat: 400 da qayta urinmaydi, code va request_id qaytadi', async () => {
  const { fetchFn, chaqiruvlar } = soxtaFetch([
    jsonRes(400, {
      success: false,
      error: { type: 'invalid_request_error', code: 'domain_not_whitelisted', request_id: 'req_sinov' },
    }),
  ]);
  const n = await inpayTolovYarat(SOROV, { secretKey: 'sk_test_sinov', fetchFn, kutishMs: 0 });
  assert.deepEqual(n, { ok: false, httpStatus: 400, code: 'domain_not_whitelisted', requestId: 'req_sinov' });
  assert.equal(chaqiruvlar.length, 1);
});

Deno.test('inpayTolovYarat: https bo\'lmagan checkout_url yoki livemode yo\'q bo\'lsa invalid_response', async () => {
  for (const data of [{ ...TOLOV, checkout_url: 'http://inpay.uz/x' }, { ...TOLOV, livemode: undefined }, { ...TOLOV, id: 'a b' }]) {
    const { fetchFn } = soxtaFetch([jsonRes(200, { success: true, data })]);
    const n = await inpayTolovYarat(SOROV, { secretKey: 'sk_test_sinov', fetchFn, kutishMs: 0 });
    assert.equal(n.ok, false);
    assert.equal(!n.ok && n.code, 'invalid_response');
  }
});

Deno.test('imzoSarlavhasi: t va v1 ajratiladi, noto\'g\'ri format null', () => {
  const v = 'a'.repeat(64);
  assert.deepEqual(imzoSarlavhasi(`t=${T},v1=${v}`), { t: T, v1: [v] });
  assert.deepEqual(imzoSarlavhasi(` t=${T} , v1=${v.toUpperCase()} `), { t: T, v1: [v] });
  assert.equal(imzoSarlavhasi(null), null);
  assert.equal(imzoSarlavhasi(`v1=${v}`), null);
  assert.equal(imzoSarlavhasi(`t=${T}`), null);
  assert.equal(imzoSarlavhasi(`t=${T},v1=abc`), null);
});

Deno.test('webhookImzosiniTekshir: to\'g\'ri imzo, buzilgan tana, boshqa sir, eskirgan, sarlavhasiz', async () => {
  const tana = JSON.stringify({ id: 'evt_sinov', type: 'payment.succeeded', livemode: false });
  const sarlavha = `t=${T},v1=${imzola(tana)}`;
  assert.equal(await webhookImzosiniTekshir(enc(tana), sarlavha, SIR, T + 10), 'ok');
  assert.equal(await webhookImzosiniTekshir(enc(tana), sarlavha, SIR, T - 300), 'ok');
  assert.equal(await webhookImzosiniTekshir(enc(tana.replace('false', 'true')), sarlavha, SIR, T), 'notogri');
  assert.equal(await webhookImzosiniTekshir(enc(tana), sarlavha, 'boshqa-sir', T), 'notogri');
  assert.equal(await webhookImzosiniTekshir(enc(tana), `t=${T + 1},v1=${imzola(tana)}`, SIR, T), 'notogri');
  assert.equal(await webhookImzosiniTekshir(enc(tana), sarlavha, SIR, T + 301), 'eskirgan');
  assert.equal(await webhookImzosiniTekshir(enc(tana), null, SIR, T), 'sarlavha_yoq');
  assert.equal(await webhookImzosiniTekshir(enc(tana), `t=${T},v1=${'0'.repeat(64)},v1=${imzola(tana)}`, SIR, T), 'ok');
});

Deno.test('webhookImzosiniTekshir: xom tana (UTF-8, bo\'sh joy) bo\'yicha; qayta seriyalangan matn mos kelmaydi', async () => {
  const tana = '{"id": "evt_sinov",  "description": "Oʻzbekcha toʻlov"}';
  const sarlavha = `t=${T},v1=${imzola(tana)}`;
  assert.equal(await webhookImzosiniTekshir(enc(tana), sarlavha, SIR, T), 'ok');
  assert.equal(await webhookImzosiniTekshir(enc(JSON.stringify(JSON.parse(tana))), sarlavha, SIR, T), 'notogri');
});
