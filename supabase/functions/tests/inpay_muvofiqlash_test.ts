// inpay-muvofiqlash oqimi soxta bog'liqliklar bilan (Supabase va inPAY'ga ulanmaydi).
import assert from 'node:assert/strict';
import { sirTengmi } from '../_shared/http.ts';
import type { HolatNatijasi } from '../_shared/inpay.ts';
import type { RpcNatija } from '../_shared/turlar.ts';
import { inpayMuvofiqlash, type MuvofiqlashBogliqlik, VAQT_CHEGARASI_MS } from '../inpay-muvofiqlash/handler.ts';

const SIR = 'sinov-muvofiqlash-siri';
const tolov = (n: number) => ({ id: `11111111-2222-4333-8444-55555555555${n}`, provider_order_id: `sinovord0000000${n}` });

function bogliqlik(o: {
  royxat?: RpcNatija;
  inpay?: Record<string, HolatNatijasi>;
  qollash?: (hodisa: Record<string, unknown>) => RpcNatija;
  sir?: string;
  vaqt?: number[];
} = {}) {
  const rpc: Array<{ nomi: string; args: Record<string, unknown> }> = [];
  const inpay: string[] = [];
  const jurnal: Array<Record<string, unknown>> = [];
  const vaqt = [...(o.vaqt ?? [])];
  const d: MuvofiqlashBogliqlik = {
    muvofiqlashSecret: 'sir' in o ? o.sir : SIR,
    yetishmaydi: [],
    hozirMs: () => vaqt.shift() ?? 0,
    rpc: (nomi, args) => {
      rpc.push({ nomi, args });
      if (nomi === 'payment_pending_stale') return Promise.resolve(o.royxat ?? { data: [tolov(1)], error: null });
      return Promise.resolve(o.qollash?.(args.p_event as Record<string, unknown>) ?? { data: { result: 'paid' }, error: null });
    },
    inpayHolat: (id) => {
      inpay.push(id);
      return Promise.resolve(o.inpay?.[id] ?? {
        ok: true,
        tolov: { id, status: 'succeeded', amount: 1000, currency: 'UZS', livemode: false, metadata: {} },
      });
    },
    jurnal: (xabar, tafsilot) => jurnal.push({ xabar, ...tafsilot }),
  };
  return { d, rpc, inpay, jurnal };
}

const sorov = (sir: string | null = SIR, method = 'POST') => {
  const headers = new Headers();
  if (sir !== null) headers.set('x-cron-secret', sir);
  return new Request('https://sinov.supabase.co/functions/v1/inpay-muvofiqlash', { method, headers });
};

Deno.test('sirTengmi: bir xil true; boshqa, bo\'sh yoki uzunligi farqli false', async () => {
  assert.equal(await sirTengmi('abc', 'abc'), true);
  assert.equal(await sirTengmi('abc', 'abd'), false);
  assert.equal(await sirTengmi('abc', 'abcd'), false);
  assert.equal(await sirTengmi('', ''), false);
  assert.equal(await sirTengmi(null, 'abc'), false);
});

Deno.test('sir yo\'q yoki noto\'g\'ri: 401, baza va inPAY so\'ralmaydi; sozlama yo\'q: 500; GET: 405', async () => {
  for (const sir of [null, 'notogri', '']) {
    const { d, rpc, inpay } = bogliqlik();
    const r = await inpayMuvofiqlash(sorov(sir), d);
    assert.equal(r.status, 401, String(sir));
    assert.equal(rpc.length + inpay.length, 0);
  }
  const yoq = bogliqlik({ sir: undefined });
  assert.equal((await inpayMuvofiqlash(sorov(), yoq.d)).status, 500);
  assert.equal(yoq.rpc.length, 0);
  assert.equal((await inpayMuvofiqlash(sorov(SIR, 'GET'), bogliqlik().d)).status, 405);
});

Deno.test('eski pending to\'lovlar: succeeded qo\'llanadi, processing pending qoladi, inPAY xatosi keyinga', async () => {
  const { d, rpc, inpay, jurnal } = bogliqlik({
    royxat: { data: [tolov(1), tolov(2), tolov(3)], error: null },
    inpay: {
      [tolov(2).provider_order_id]: {
        ok: true,
        tolov: { id: tolov(2).provider_order_id, status: 'processing', amount: 1000, currency: 'UZS', livemode: false, metadata: {} },
      },
      [tolov(3).provider_order_id]: { ok: false, httpStatus: 503, code: 'http_503' },
    },
  });
  const r = await inpayMuvofiqlash(sorov(), d);
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { checked: 3, results: { paid: 1, pending: 1, 'pending:inpay_xato': 1 } });
  assert.deepEqual(inpay, [tolov(1), tolov(2), tolov(3)].map((t) => t.provider_order_id));
  assert.deepEqual(rpc[0], { nomi: 'payment_pending_stale', args: { p_min_minutes: 15, p_max_hours: 48, p_limit: 20 } });
  const qollash = rpc.filter((x) => x.nomi === 'payment_apply_event');
  assert.equal(qollash.length, 1);
  const hodisa = qollash[0].args.p_event as Record<string, unknown>;
  assert.equal(hodisa.id, `poll_${tolov(1).provider_order_id}_succeeded`);
  assert.equal(hodisa.type, 'payment.succeeded');
  assert.equal(JSON.stringify(jurnal).includes(SIR), false, 'logda sir yo\'q');
});

Deno.test('webhook allaqachon qo\'llagan va summa mos emas: natijada ko\'rinadi', async () => {
  const javoblar = [
    { data: { result: 'already_paid' }, error: null },
    { data: { result: 'error', error: 'amount_mismatch' }, error: null },
    { data: null, error: { message: 'connection lost', code: '08006' } },
  ];
  const { d } = bogliqlik({ royxat: { data: [tolov(1), tolov(2), tolov(3)], error: null }, qollash: () => javoblar.shift()! });
  const r = await inpayMuvofiqlash(sorov(), d);
  assert.deepEqual(await r.json(), { checked: 3, results: { already_paid: 1, 'error:amount_mismatch': 1, db_error: 1 } });
});

Deno.test('ro\'yxat olinmasa 500; vaqt chegarasidan keyin qolganlari keyingi ishga tushishga', async () => {
  assert.equal((await inpayMuvofiqlash(sorov(), bogliqlik({ royxat: { data: null, error: { message: 'x' } } }).d)).status, 500);
  const { d, inpay } = bogliqlik({
    royxat: { data: [tolov(1), tolov(2)], error: null },
    vaqt: [0, 10, VAQT_CHEGARASI_MS + 1],
  });
  const r = await inpayMuvofiqlash(sorov(), d);
  assert.deepEqual(await r.json(), { checked: 1, results: { paid: 1, deferred: 1 } });
  assert.equal(inpay.length, 1);
});
