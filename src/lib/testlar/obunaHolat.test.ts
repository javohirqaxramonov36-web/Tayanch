// Obuna holati (P22) sof funksiyalari: to'rt sun'iy holat, zanjir, eslatma, Free cheklovlari, tekshirish tugmasi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eslatma, freeCheklovlari, obunaHolati, qolganKunlar, tekshirishMumkin } from '../sat/obunaHolat.ts';

// 2026-11-13 12:00 Toshkent (07:00 UTC)
const HOZIR = new Date('2026-11-13T07:00:00Z');
const kun = (n: number) => new Date(HOZIR.getTime() + n * 86_400_000).toISOString();
const pro = (starts: number, ends: number | null, status = 'active') => ({
  plan_code: 'pro', status, starts_at: kun(starts), ends_at: ends === null ? null : kun(ends),
});

test('never paid: hech, no reminder', () => {
  const h = obunaHolati([], HOZIR, 'free');
  assert.equal(h.tur, 'hech');
  assert.equal(eslatma(h, 'Pro'), null);
});

test('active with 20 days left: faol, no reminder', () => {
  const h = obunaHolati([pro(-10, 20)], HOZIR, 'pro');
  assert.equal(h.tur, 'faol');
  assert.equal(h.qolganKun, 20);
  assert.equal(eslatma(h, 'Pro'), null);
});

test('ends in 5 days: tugayapti, honest reminder without pressure', () => {
  const h = obunaHolati([pro(-25, 5)], HOZIR, 'pro');
  assert.equal(h.tur, 'tugayapti');
  assert.equal(h.qolganKun, 5);
  const e = eslatma(h, 'Pro')!;
  assert.match(e.sarlavha, /ends in 5 days/);
  assert.match(e.matn, /18 November 2026/);
  assert.match(e.matn, /Nothing is charged automatically/);
  assert.doesNotMatch(e.sarlavha + e.matn, /hurry|last chance|only|!/i);
});

test('7 days is the first reminder day, 8 is not', () => {
  assert.equal(obunaHolati([pro(-23, 7)], HOZIR, 'pro').tur, 'tugayapti');
  assert.equal(obunaHolati([pro(-22, 8)], HOZIR, 'pro').tur, 'faol');
});

test('1 day and same day wording', () => {
  assert.match(eslatma(obunaHolati([pro(-29, 1)], HOZIR, 'pro'), 'Pro')!.sarlavha, /ends tomorrow/);
  const bugun = obunaHolati([{ ...pro(-30, 0), ends_at: '2026-11-13T18:00:00Z' }], HOZIR, 'pro'); // 23:00 Toshkent
  assert.equal(bugun.qolganKun, 0);
  assert.match(eslatma(bugun, 'Pro')!.sarlavha, /ends today/);
});

test('ended: tugagan, data kept message, latest end date', () => {
  const h = obunaHolati([pro(-70, -40, 'expired'), pro(-33, -3)], HOZIR, 'free');
  assert.equal(h.tur, 'tugagan');
  assert.equal(h.planKod, 'pro');
  const e = eslatma(h, 'Pro')!;
  assert.match(e.sarlavha, /ended on 10 November 2026/);
  assert.match(e.matn, /You are on Free now/);
  assert.match(e.matn, /kept/);
});

test('extended in advance: chained periods count as one', () => {
  const h = obunaHolati([pro(-25, 5), pro(5, 35)], HOZIR, 'pro');
  assert.equal(h.tur, 'faol');
  assert.equal(h.qolganKun, 35);
});

test('canceled subscriptions are ignored; no end date grant is faol', () => {
  assert.equal(obunaHolati([pro(-40, -10, 'canceled')], HOZIR, 'free').tur, 'hech');
  const h = obunaHolati([pro(-1, null)], HOZIR, 'pro');
  assert.equal(h.tur, 'faol');
  assert.equal(h.tugash, null);
});

test('calendar days use Tashkent time', () => {
  // 2026-11-13 23:30 Toshkent -> 2026-11-14 00:30 Toshkent: 1 kalendar kun
  assert.equal(qolganKunlar(new Date('2026-11-13T19:30:00Z'), new Date('2026-11-13T18:30:00Z')), 1);
});

test('Free limits list comes from plans data only', () => {
  const bayroqmi = (s: string) => /^[a-z]+(_[a-z]+)+$/.test(s);
  const royxat = freeCheklovlari(
    { code: 'free', limits: { questions: { max: 20, per: 'day' }, plan_rebuilds: { max: 2, per: 'month' } }, features: [] },
    { code: 'pro', limits: {}, features: ['analytics_extended', 'unknown_flag', 'Early access price'] },
    { analytics_extended: 'Extended analytics' },
    { questions: 'Questions', plan_rebuilds: 'Plan rebuilds' },
    bayroqmi,
  );
  assert.deepEqual(royxat, [
    'Extended analytics: not included',
    'Questions: up to 20 per day',
    'Plan rebuilds: up to 2 per month',
  ]);
  assert.deepEqual(freeCheklovlari(undefined, undefined, {}, {}, bayroqmi), []);
});

test('check status button only for pending older than 15 minutes', () => {
  const t = (min: number, status = 'pending') => ({ status, created_at: new Date(HOZIR.getTime() - min * 60_000).toISOString() });
  assert.equal(tekshirishMumkin(t(14), HOZIR), false);
  assert.equal(tekshirishMumkin(t(15), HOZIR), true);
  assert.equal(tekshirishMumkin(t(60, 'created'), HOZIR), false);
  assert.equal(tekshirishMumkin(t(60, 'paid'), HOZIR), false);
});
