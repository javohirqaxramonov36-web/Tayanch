// inpay-webhook oqimi soxta bog'liqliklar bilan. Imzo Node crypto bilan mustaqil hisoblanadi.
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import type { RpcNatija } from '../_shared/turlar.ts';
import { inpayWebhook, MAKS_TANA_BAYT, type WebhookBogliqlik } from '../inpay-webhook/handler.ts';

const SIR = 'sinov-siri';
const T = 1_790_511_600;
const imzola = (tana: string, t = T) => `t=${t},v1=${createHmac('sha256', SIR).update(`${t}.${tana}`).digest('hex')}`;

const HODISA = {
  id: 'evt_839201ab9c02d84716e5f0a1b2c3d4e5',
  object: 'event',
  type: 'payment.succeeded',
  created: T,
  livemode: false,
  data: {
    object: {
      id: '47907909afd21a28',
      amount: 1000,
      currency: 'UZS',
      status: 'succeeded',
      metadata: { payment_id: '11111111-2222-4333-8444-555555555555' },
    },
  },
};

function bogliqlik(o: { rpc?: RpcNatija; sir?: string } = {}) {
  const chaqiruvlar: Array<{ nomi: string; args: Record<string, unknown> }> = [];
  const jurnal: Array<Record<string, unknown>> = [];
  const d: WebhookBogliqlik = {
    webhookSecret: 'sir' in o ? o.sir : SIR,
    yetishmaydi: [],
    hozirS: () => T + 5,
    rpc: (nomi, args) => {
      chaqiruvlar.push({ nomi, args });
      return Promise.resolve(o.rpc ?? { data: { result: 'paid', payment_id: '11111111-2222-4333-8444-555555555555' }, error: null });
    },
    jurnal: (xabar, tafsilot) => jurnal.push({ xabar, ...tafsilot }),
  };
  return { d, chaqiruvlar, jurnal };
}

function sorov(tana: string, imzo: string | null = imzola(tana), method = 'POST') {
  const headers = new Headers({ 'content-type': 'application/json', 'x-inpay-event': 'payment.succeeded' });
  if (imzo !== null) headers.set('x-inpay-signature', imzo);
  return new Request('https://sinov.supabase.co/functions/v1/inpay-webhook', {
    method,
    headers,
    body: method === 'POST' ? tana : undefined,
  });
}

Deno.test('to\'g\'ri imzo: hodisa payment_apply_event ga butunligicha beriladi, 200', async () => {
  const tana = JSON.stringify(HODISA);
  const { d, chaqiruvlar, jurnal } = bogliqlik();
  const r = await inpayWebhook(sorov(tana), d);
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { received: true });
  assert.deepEqual(chaqiruvlar, [{ nomi: 'payment_apply_event', args: { p_event: HODISA } }]);
  assert.equal(jurnal.at(-1)?.natija, 'paid');
  assert.equal(JSON.stringify(jurnal).includes('metadata'), false, 'logda tana yo\'q');
});

Deno.test('imzo yo\'q, noto\'g\'ri yoki eskirgan: 400/401, bazaga murojaat yo\'q', async () => {
  const tana = JSON.stringify(HODISA);
  const holatlar: Array<[string | null, number, string]> = [
    [null, 400, 'signature_missing'],
    [imzola(tana.replace('1000', '1')), 401, 'signature_invalid'],
    [imzola(tana, T - 400), 400, 'signature_expired'],
  ];
  for (const [imzo, status, kod] of holatlar) {
    const { d, chaqiruvlar } = bogliqlik();
    const r = await inpayWebhook(sorov(tana, imzo), d);
    assert.equal(r.status, status, kod);
    assert.deepEqual(await r.json(), { error: kod });
    assert.equal(chaqiruvlar.length, 0);
  }
});

Deno.test('soxta "to\'landi" (boshqa sir bilan imzolangan): 401', async () => {
  const tana = JSON.stringify(HODISA);
  const soxta = `t=${T},v1=${createHmac('sha256', 'boshqa-sir').update(`${T}.${tana}`).digest('hex')}`;
  const { d, chaqiruvlar } = bogliqlik();
  assert.equal((await inpayWebhook(sorov(tana, soxta), d)).status, 401);
  assert.equal(chaqiruvlar.length, 0);
});

Deno.test('GET 405; INPAY_WEBHOOK_SECRET yo\'q bo\'lsa 500 (inPAY keyin qayta yuboradi)', async () => {
  assert.equal((await inpayWebhook(sorov('', null, 'GET'), bogliqlik().d)).status, 405);
  const { d, chaqiruvlar } = bogliqlik({ sir: undefined });
  const tana = JSON.stringify(HODISA);
  assert.equal((await inpayWebhook(sorov(tana), d)).status, 500);
  assert.equal(chaqiruvlar.length, 0);
});

Deno.test('juda katta tana: 413', async () => {
  const tana = JSON.stringify({ ...HODISA, ortiqcha: 'x'.repeat(MAKS_TANA_BAYT) });
  const { d, chaqiruvlar } = bogliqlik();
  assert.equal((await inpayWebhook(sorov(tana), d)).status, 413);
  assert.equal(chaqiruvlar.length, 0);
});

Deno.test('imzolangan, lekin JSON obyekt emas: 400', async () => {
  for (const tana of ['[1,2]', 'salom', '']) {
    const { d, chaqiruvlar } = bogliqlik();
    assert.equal((await inpayWebhook(sorov(tana), d)).status, 400, tana);
    assert.equal(chaqiruvlar.length, 0);
  }
});

Deno.test('baza javobi: invalid_event 400, boshqa xato 500, saqlangan xato 200', async () => {
  const tana = JSON.stringify(HODISA);
  assert.equal((await inpayWebhook(sorov(tana), bogliqlik({ rpc: { data: null, error: { message: 'invalid_event' } } }).d)).status, 400);
  assert.equal((await inpayWebhook(sorov(tana), bogliqlik({ rpc: { data: null, error: { message: 'connection lost', code: '08006' } } }).d)).status, 500);
  const xato = bogliqlik({ rpc: { data: { result: 'error', error: 'amount_mismatch' }, error: null } });
  assert.equal((await inpayWebhook(sorov(tana), xato.d)).status, 200);
  assert.equal(xato.jurnal.at(-1)?.xato, 'amount_mismatch');
  const takror = bogliqlik({ rpc: { data: { result: 'duplicate' }, error: null } });
  assert.equal((await inpayWebhook(sorov(tana), takror.d)).status, 200);
});
