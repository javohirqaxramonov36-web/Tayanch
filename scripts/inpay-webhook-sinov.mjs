#!/usr/bin/env node
// inPAY webhook (P21): 5 stsenariy lokal, vaqtinchalik Postgres'da HAQIQIY SQL funksiyalar va HAQIQIY handler bilan.
//   1. noto'g'ri imzo (va imzo yo'q)   2. to'g'ri imzo   3. takror xabar   4. noto'g'ri summa   5. noma'lum to'lov
//   + webhook kelmagan to'lov muvofiqlashtiriladi (inpay-muvofiqlash) va obuna bir marta uzaytiriladi.
//
// Ishga tushirish: npm run inpay:webhook-sinov   (Node 23.6+: .ts handler'lar tur olib tashlanib yuklanadi;
// Postgres 15+ binar fayllari: brew install postgresql@17).
// Haqiqiy Supabase'ga ham, inPAY'ga ham ulanmaydi. Webhook siri har ishga tushishda tasodifiy yaratiladi
// (haqiqiy INPAY_WEBHOOK_SECRET o'qilmaydi). inPAY GET /payments/{id} javobi soxta.
import { spawnSync } from 'node:child_process';
import { createHmac, randomBytes } from 'node:crypto';
import { existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { inpayWebhook } from '../supabase/functions/inpay-webhook/handler.ts';
import { inpayMuvofiqlash } from '../supabase/functions/inpay-muvofiqlash/handler.ts';
import { inpaydanQolla } from '../supabase/functions/_shared/tolovQollash.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- Postgres -------------------------------------------------------------------------------------------
function pgBin() {
  if (process.env.PGBIN) return process.env.PGBIN;
  for (const d of ['/opt/homebrew/opt/postgresql@17/bin', '/usr/local/opt/postgresql@17/bin']) {
    if (existsSync(join(d, 'initdb'))) return d;
  }
  const w = spawnSync('sh', ['-c', 'command -v initdb'], { encoding: 'utf8' });
  if (w.status !== 0) throw new Error('initdb topilmadi: brew install postgresql@17 yoki PGBIN=...');
  return dirname(w.stdout.trim());
}

const BIN = pgBin();
const PORT = process.env.PGPORT_SINOV ?? '54331';
const TMP = mkdtempSync(join(tmpdir(), 'tayanch-webhook-'));
const env = { ...process.env, LC_ALL: 'C', LANG: 'C' };

function ishla(cmd, args, input) {
  const r = spawnSync(join(BIN, cmd), args, { encoding: 'utf8', env, input });
  return { ok: r.status === 0, out: (r.stdout ?? '').trim(), err: (r.stderr ?? '').trim() };
}

function toxtat() {
  ishla('pg_ctl', ['-D', join(TMP, 'data'), '-m', 'fast', 'stop']);
  rmSync(TMP, { recursive: true, force: true });
}
process.on('exit', toxtat);

const PSQL = ['-h', TMP, '-p', PORT, '-U', 'postgres', '-X', '-q', '-At', '-v', 'ON_ERROR_STOP=1', '-d', 'tayanch_sinov'];

/** SQL ishga tushiradi; o'zgaruvchilar psql :'nomi' orqali (matn sifatida, SQL'ga ulanmaydi). */
function sql(matn, vars = {}) {
  const v = Object.entries(vars).flatMap(([k, x]) => ['-v', `${k}=${x}`]);
  const r = ishla('psql', [...PSQL, ...v], matn);
  if (!r.ok) {
    const m = /ERROR:\s+(.+)/.exec(r.err);
    return { ok: false, xato: m ? m[1].trim() : r.err };
  }
  return { ok: true, out: r.out };
}
function sqlQiymat(matn, vars) {
  const r = sql(matn, vars);
  if (!r.ok) throw new Error(`SQL xatosi: ${r.xato}`);
  return r.out;
}

ishla('initdb', ['-D', join(TMP, 'data'), '-U', 'postgres', '--auth=trust', '-E', 'UTF8', '--locale=C']);
const start = ishla('pg_ctl', ['-D', join(TMP, 'data'), '-l', join(TMP, 'log'), '-w', '-o',
  `-p ${PORT} -k ${TMP} -c listen_addresses='' -c timezone=UTC`, 'start']);
if (!start.ok) throw new Error(`Postgres ishga tushmadi: ${start.err}`);
ishla('psql', ['-h', TMP, '-p', PORT, '-U', 'postgres', '-X', '-q', '-d', 'postgres', '-c', 'create database tayanch_sinov']);

for (const f of [join(ROOT, 'supabase/tests/lokal-shim.sql'),
  ...readdirSync(join(ROOT, 'supabase/migrations')).filter((x) => x.endsWith('.sql')).sort()
    .map((x) => join(ROOT, 'supabase/migrations', x))]) {
  const r = ishla('psql', [...PSQL, '-f', f]);
  if (!r.ok || /ERROR/.test(r.err)) throw new Error(`${f}: ${r.err}`);
}

// --- Sinov ma'lumoti -----------------------------------------------------------------------------------
const USER = '00000000-0000-4000-8000-0000000000d1';
sqlQiymat(`
  insert into auth.users (id, email, raw_user_meta_data) values ('${USER}', 'webhook@sinov.invalid', '{}');
  update public.plans set is_active = true, price_uzs = 1000, period_days = 30 where code = 'pro';`);

function tolovYarat(inpayId) {
  const id = sqlQiymat(`select public.payment_create('${USER}', 'pro') ->> 'payment_id'`);
  sqlQiymat(`select public.payment_set_invoice(:'id'::uuid, :'oid', jsonb_build_object('id', :'oid', 'livemode', false))`,
    { id, oid: inpayId });
  return { id, inpayId };
}
const P1 = tolovYarat('sinovord0000a001');
const P2 = tolovYarat('sinovord0000a002');

const holat = (p) => sqlQiymat(`select status from public.payments where id = :'id'`, { id: p.id });
const obunaSoni = (p) => Number(sqlQiymat(`select count(*) from public.subscriptions where payment_id = :'id'`, { id: p.id }));
const obuna = (p) => sqlQiymat(
  `select coalesce(extract(epoch from starts_at)::bigint || ' ' || extract(epoch from ends_at)::bigint, '')
     from public.subscriptions where payment_id = :'id'`, { id: p.id });
const hodisaSoni = () => Number(sqlQiymat('select count(*) from public.payment_events'));
const hodisaXatosi = (eid) => sqlQiymat(`select coalesce(error, '') from public.payment_events where event_id = :'e'`, { e: eid });

// --- Handler bog'liqliklari (haqiqiy SQL, service_role sifatida) ---------------------------------------
const SIR = `whsec_lokal_${randomBytes(24).toString('hex')}`;
const jurnal = [];
const log = (xabar, tafsilot) => jurnal.push(JSON.stringify({ xabar, ...tafsilot }));

async function rpc(nomi, args) {
  let r;
  if (nomi === 'payment_apply_event') {
    r = sql(`set role service_role; select public.payment_apply_event(:'ev'::jsonb)`, { ev: JSON.stringify(args.p_event) });
  } else if (nomi === 'payment_pending_stale') {
    r = sql(`set role service_role; select coalesce(jsonb_agg(to_jsonb(s)), '[]') from public.payment_pending_stale(
               :'a'::integer, :'b'::integer, :'c'::integer) s`, { a: args.p_min_minutes, b: args.p_max_hours, c: args.p_limit });
  } else {
    throw new Error(`kutilmagan rpc: ${nomi}`);
  }
  return r.ok ? { data: JSON.parse(r.out), error: null } : { data: null, error: { message: r.xato } };
}

const webhookD = { webhookSecret: SIR, yetishmaydi: [], hozirS: () => Math.floor(Date.now() / 1000), rpc, jurnal: log };

const imzola = (tana, sir = SIR, t = Math.floor(Date.now() / 1000)) =>
  `t=${t},v1=${createHmac('sha256', sir).update(`${t}.${tana}`).digest('hex')}`;

function hodisa(eid, p, o = {}) {
  return {
    id: eid,
    object: 'event',
    type: 'payment.succeeded',
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    data: {
      object: {
        id: p.inpayId,
        object: 'payment',
        amount: o.amount ?? 1000,
        currency: 'UZS',
        status: 'succeeded',
        livemode: false,
        metadata: { payment_id: p.id, plan_code: 'pro' },
        ...(o.qoshimcha ?? {}),
      },
    },
  };
}

async function yubor(tana, imzo) {
  const headers = new Headers({ 'content-type': 'application/json', 'x-inpay-event': 'payment.succeeded' });
  if (imzo !== null) headers.set('x-inpay-signature', imzo);
  const r = await inpayWebhook(new Request('http://lokal/functions/v1/inpay-webhook', { method: 'POST', headers, body: tana }), webhookD);
  return { status: r.status, tana: await r.json() };
}

// --- Stsenariylar --------------------------------------------------------------------------------------
const natijalar = [];
function tekshir(nomi, shartlar) {
  const xato = Object.entries(shartlar).filter(([, v]) => !v).map(([k]) => k);
  natijalar.push({ nomi, ok: xato.length === 0, xato });
}

// 1. Noto'g'ri imzo (boshqa sir) va imzo yo'q: 401, bazaga hech narsa yozilmaydi.
{
  const tana = JSON.stringify(hodisa('evt_lokal_01', P1));
  const a = await yubor(tana, imzola(tana, 'whsec_boshqa_sir'));
  const b = await yubor(tana, null);
  const c = await yubor(tana, imzola(tana.replace('1000', '1')));
  tekshir("1. Noto'g'ri imzo / imzo yo'q / tana o'zgartirilgan", {
    'boshqa sir 401': a.status === 401 && a.tana.error === 'signature_invalid',
    "imzo yo'q 401": b.status === 401 && b.tana.error === 'signature_missing',
    "o'zgartirilgan tana 401": c.status === 401,
    "payment_events bo'sh": hodisaSoni() === 0,
    'P1 pending': holat(P1) === 'pending',
    "obuna yo'q": obunaSoni(P1) === 0,
  });
}

// 2. To'g'ri imzo: paid, 30 kunlik obuna, payload tozalangan (mijoz telefoni bazaga tushmaydi).
let p1Obuna;
{
  const tana = JSON.stringify(hodisa('evt_lokal_02', P1, { qoshimcha: { customer_phone: '+998900000000' } }));
  const r = await yubor(tana, imzola(tana));
  p1Obuna = obuna(P1);
  const [s, e] = p1Obuna.split(' ').map(Number);
  const payload = sqlQiymat(`select payload::text from public.payment_events where event_id = 'evt_lokal_02'`);
  tekshir("2. To'g'ri imzo", {
    '200': r.status === 200,
    'P1 paid': holat(P1) === 'paid',
    '1 obuna': obunaSoni(P1) === 1,
    '30 kun': e - s === 30 * 86400,
    "payload'da telefon yo'q": !payload.includes('998900000000') && payload.includes('data.object.customer_phone'),
  });
}

// 3. Takror xabar: bir xil evt_ (duplicate), boshqa evt_ (already_paid), inpay-holat yo'li (poll) ham: obuna bitta.
{
  const tana = JSON.stringify(hodisa('evt_lokal_02', P1, { qoshimcha: { customer_phone: '+998900000000' } }));
  const a = await yubor(tana, imzola(tana));
  const tana2 = JSON.stringify(hodisa('evt_lokal_03', P1));
  const b = await yubor(tana2, imzola(tana2));
  const poll = await inpaydanQolla({ id: P1.id, provider_order_id: P1.inpayId }, {
    rpc,
    jurnal: log,
    inpayHolat: async (id) => ({ ok: true, tolov: { id, status: 'succeeded', amount: 1000, currency: 'UZS', livemode: false, metadata: { payment_id: P1.id } } }),
  });
  const natija = (eid) => sqlQiymat(`select processed_at is not null from public.payment_events where event_id = :'e'`, { e: eid });
  tekshir('3. Takror xabar', {
    'ikkala javob 200': a.status === 200 && b.status === 200,
    "bir xil evt_ qayta yozilmadi": Number(sqlQiymat(`select count(*) from public.payment_events where event_id = 'evt_lokal_02'`)) === 1,
    'boshqa evt_ qayd etildi': natija('evt_lokal_03') === 't',
    'poll already_paid': poll.holat === 'qollandi' && poll.result === 'already_paid',
    'obuna hali 1 ta': obunaSoni(P1) === 1,
    "muddat o'zgarmadi": obuna(P1) === p1Obuna,
  });
}

// 4. Noto'g'ri summa: 200 (inPAY qayta yubormasin), xato saqlanadi, obuna berilmaydi.
{
  const tana = JSON.stringify(hodisa('evt_lokal_04', P2, { amount: 999 }));
  const r = await yubor(tana, imzola(tana));
  tekshir("4. Noto'g'ri summa", {
    '200': r.status === 200,
    'xato amount_mismatch': hodisaXatosi('evt_lokal_04') === 'amount_mismatch',
    'P2 pending': holat(P2) === 'pending',
    "obuna yo'q": obunaSoni(P2) === 0,
  });
}

// 5. Noma'lum to'lov: 200, xato saqlanadi, hech kimga obuna berilmaydi.
{
  const obunalar = () => Number(sqlQiymat('select count(*) from public.subscriptions'));
  const oldin = obunalar();
  const yoq = { id: '99999999-0000-4000-8000-000000000000', inpayId: 'sinovyoq0000a999' };
  const tana = JSON.stringify(hodisa('evt_lokal_05', yoq));
  const r = await yubor(tana, imzola(tana));
  tekshir("5. Noma'lum to'lov", {
    '200': r.status === 200,
    'xato unknown_order': hodisaXatosi('evt_lokal_05') === 'unknown_order',
    "yangi obuna yo'q": obunalar() === oldin,
  });
}

// + Muvofiqlashtirish: P2 ga webhook kelmadi (20 daqiqa oldin yaratilgan); inPAY succeeded deydi -> paid,
//   obuna P1 obunasining oxiridan; ikkinchi ishga tushish va kech kelgan webhook obunani qayta uzaytirmaydi.
{
  sqlQiymat(`update public.payments set created_at = now() - interval '20 minutes' where id = :'id'`, { id: P2.id });
  const MSIR = `lokal_${randomBytes(16).toString('hex')}`;
  const md = {
    muvofiqlashSecret: MSIR,
    yetishmaydi: [],
    hozirMs: () => Date.now(),
    rpc,
    jurnal: log,
    inpayHolat: async (id) => ({ ok: true, tolov: { id, status: 'succeeded', amount: 1000, currency: 'UZS', livemode: false, metadata: { payment_id: P2.id } } }),
  };
  const chaqir = async (sir) => {
    const r = await inpayMuvofiqlash(new Request('http://lokal/functions/v1/inpay-muvofiqlash', {
      method: 'POST', headers: { 'x-cron-secret': sir },
    }), md);
    return { status: r.status, tana: await r.json() };
  };
  const rad = await chaqir('notogri');
  const a = await chaqir(MSIR);
  const p2Obuna = obuna(P2);
  const b = await chaqir(MSIR);
  const tana = JSON.stringify(hodisa('evt_lokal_06', P2));
  const kech = await yubor(tana, imzola(tana));
  const [s2] = p2Obuna.split(' ').map(Number);
  const [, e1] = p1Obuna.split(' ').map(Number);
  tekshir("+ Muvofiqlashtirish (webhook kelmagan)", {
    "noto'g'ri sir 401": rad.status === 401,
    '1-ishga tushish: paid': a.status === 200 && a.tana.checked === 1 && a.tana.results.paid === 1,
    'P2 paid': holat(P2) === 'paid',
    "obuna P1 oxiridan (ustiga qo'shildi)": s2 === e1,
    "2-ishga tushish: ro'yxat bo'sh": b.status === 200 && b.tana.checked === 0,
    'kech webhook already_paid': kech.status === 200 && hodisaXatosi('evt_lokal_06') === '',
    'P2 obunasi 1 ta, muddat o\'zgarmadi': obunaSoni(P2) === 1 && obuna(P2) === p2Obuna,
  });
}

// Loglar: sir, imzo, telefon yo'q.
{
  const hammasi = jurnal.join('\n');
  tekshir('Loglar', {
    "webhook siri yo'q": !hammasi.includes(SIR),
    "imzo (v1=) yo'q": !hammasi.includes('v1='),
    "telefon yo'q": !hammasi.includes('998900000000'),
    "tana (metadata) yo'q": !hammasi.includes('metadata'),
  });
}

// --- Hisobot -------------------------------------------------------------------------------------------
for (const n of natijalar) {
  console.log(`${n.ok ? 'OK  ' : 'FAIL'} ${n.nomi}${n.ok ? '' : `: ${n.xato.join(', ')}`}`);
}
const otmadi = natijalar.filter((n) => !n.ok).length;
console.log(otmadi ? `\n${otmadi} ta stsenariy O'TMADI` : `\nHammasi o'tdi (${natijalar.length} ta tekshiruv guruhi)`);
process.exitCode = otmadi ? 1 : 0;
