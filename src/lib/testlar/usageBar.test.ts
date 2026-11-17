// UsageBar (P19) sof funksiyalari: qatorlar, tugash holati, tiklanish yozuvi (Toshkent).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { usageQatorlari, tiklanishYozuv } from '../sat/usageBar.ts';

const nomlar = { sessions: 'Practice sessions', questions: 'Questions', new_words: 'New words' };

test('no limits and nothing used: no rows', () => {
  assert.deepEqual(usageQatorlari({ plan: { code: 'free' }, limits: {}, today: {} }, nomlar), []);
  assert.deepEqual(usageQatorlari(null), []);
});

test('limited key: used, left, reset time, bar percent', () => {
  const [q] = usageQatorlari({ limits: { questions: { max: 20, per: 'day', used: 12, remaining: 8 } } }, nomlar);
  assert.equal(q.nomi, 'Questions');
  assert.equal(q.asosiy, '12 of 20');
  assert.equal(q.izoh, '8 left today · Resets at midnight (Tashkent time)');
  assert.equal(q.foiz, 60);
  assert.equal(q.tugagan, false);
});

test('limit reached: honest message, bar full, never over 100%', () => {
  const [q] = usageQatorlari({ limits: { questions: { max: 5, per: 'day', used: 7 } } }, nomlar);
  assert.equal(q.asosiy, '5 of 5');
  assert.equal(q.izoh, 'All used today · Resets at midnight (Tashkent time)');
  assert.equal(q.foiz, 100);
  assert.equal(q.tugagan, true);
});

test('max 0 means not included: no "0 of 0", no bar, not a reached limit', () => {
  const [z] = usageQatorlari({ limits: { questions: { max: 0, used: 0 } } }, nomlar);
  assert.equal(z.asosiy, 'Not included');
  assert.equal(z.izoh, 'Not part of your plan');
  assert.equal(z.foiz, null);
  assert.equal(z.tugagan, false);
});

test('monthly key: date in Tashkent time (UTC evening before is already the 1st)', () => {
  assert.equal(tiklanishYozuv('month', '2026-11-30T19:00:00Z'), 'Resets on 1 December (Tashkent time)');
  assert.equal(tiklanishYozuv('month'), 'Resets on the 1st of next month (Tashkent time)');
  assert.equal(tiklanishYozuv('day', 'garbage'), 'Resets at midnight (Tashkent time)');
  const [q] = usageQatorlari({ limits: { plan_rebuilds: { max: 2, per: 'month', used: 1, resets_at: '2026-11-30T19:00:00Z' } } });
  assert.equal(q.izoh, '1 left this month · Resets on 1 December (Tashkent time)');
});

test('unlimited keys from today: shown after limited ones, no bar, zero counts hidden', () => {
  const r = usageQatorlari({
    limits: { new_words: { max: 10, per: 'day', used: 2 } },
    today: { new_words: 2, questions: 12, sessions: 0, answers: 3 },
  }, nomlar);
  assert.deepEqual(r.map((q) => q.kalit), ['new_words', 'questions', 'answers']);
  assert.equal(r[1].asosiy, '12 today');
  assert.equal(r[1].izoh, 'No limit on your plan');
  assert.equal(r[1].foiz, null);
  assert.equal(r[2].nomi, 'answers'); // nomi yo'q kalit: o'zi
});
