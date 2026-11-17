// Tariflar taqqoslash jadvali: katak matni, AI istisnosi, bayroqlar, faol emas tarif, karta ro'yxati.
// Raqamlar shu testning o'zida to'qilgan namuna (haqiqiy tarif emas).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bayroqlar, kartaRoyxati, kvotaMatni, matnlar, taqqoslashJadvali, type QatorTur } from '../sat/tarifJadval.ts';

const qatorlar: QatorTur[] = [
  { tur: 'kvota', kalit: 'questions', nomi: 'Questions' },
  { tur: 'kvota', kalit: 'mock_first', nomi: 'Mocks' },
  { tur: 'kvota', kalit: 'ai_messages', oylikKalit: 'ai_messages_month', yopiqStandart: true, nomi: 'AI' },
  { tur: 'bayroq', kalit: 'analytics_extended', nomi: 'Extended analytics' },
  { tur: 'bayroq', kalit: 'vocab_my_words', nomi: 'Own words' },
];

test('quota cell: absent = No limit, 0 = Not included, number with period', () => {
  assert.equal(kvotaMatni({}, 'questions'), 'No limit');
  assert.equal(kvotaMatni(null, 'questions'), 'No limit');
  assert.equal(kvotaMatni({ questions: { max: 0 } }, 'questions'), 'Not included');
  assert.equal(kvotaMatni({ questions: { max: 1500, per: 'day' } }, 'questions'), 'Up to 1,500 per day');
  assert.equal(kvotaMatni({ questions: { max: 4 } }, 'questions'), 'Up to 4 per day');
  assert.equal(kvotaMatni({ mock_first: { max: 2, per: 'month' } }, 'mock_first'), 'Up to 2 per month');
});

test('AI: closed unless both daily and monthly keys are above 0 (P33)', () => {
  assert.equal(kvotaMatni({}, 'ai_messages', 'ai_messages_month', true), 'Not included');
  assert.equal(kvotaMatni({ ai_messages: { max: 3 } }, 'ai_messages', 'ai_messages_month', true), 'Not included');
  assert.equal(kvotaMatni({ ai_messages: { max: 3 }, ai_messages_month: { max: 0, per: 'month' } }, 'ai_messages', 'ai_messages_month', true), 'Not included');
  assert.equal(
    kvotaMatni({ ai_messages: { max: 3 }, ai_messages_month: { max: 30, per: 'month' } }, 'ai_messages', 'ai_messages_month', true),
    'Up to 3 per day (up to 30 per month)',
  );
});

test('flags: snake_case strings and {"flag": ...} objects; plain text is not a flag', () => {
  const f = ['analytics_extended', { flag: 'vocab_my_words' }, 'Early access price', 42];
  assert.deepEqual([...bayroqlar(f)].sort(), ['analytics_extended', 'vocab_my_words']);
  assert.deepEqual(matnlar(f), ['Early access price']);
  assert.deepEqual(matnlar(null), []);
});

test('table: inactive plan column says Coming soon; unknown limit keys are appended', () => {
  const tariflar = [
    { code: 'free', limits: { questions: { max: 20 }, answers: { max: 40 } }, features: [] },
    { code: 'pro', limits: {}, features: ['analytics_extended'] },
  ];
  const j = taqqoslashJadvali(tariflar, ['free', 'pro', 'max'], qatorlar, { answers: 'Answers' });
  assert.deepEqual(j.map((q) => q.kalit), ['questions', 'mock_first', 'ai_messages', 'analytics_extended', 'vocab_my_words', 'answers']);
  assert.deepEqual(j[0].qiymat, { free: 'Up to 20 per day', pro: 'No limit', max: 'Coming soon' });
  assert.deepEqual(j[2].qiymat, { free: 'Not included', pro: 'Not included', max: 'Coming soon' });
  assert.deepEqual(j[3].qiymat, { free: 'Not included', pro: 'Included', max: 'Coming soon' });
  assert.equal(j[5].nomi, 'Answers');
});

test('card list: drops Not included, keeps plan text from features', () => {
  const tariflar = [{ code: 'pro', limits: {}, features: ['analytics_extended', 'Early access price'] }];
  const j = taqqoslashJadvali(tariflar, ['pro'], qatorlar);
  assert.deepEqual(kartaRoyxati(j, 'pro', tariflar[0].features), [
    { nomi: 'Questions', qiymat: 'No limit' },
    { nomi: 'Mocks', qiymat: 'No limit' },
    { nomi: 'Extended analytics', qiymat: 'Included' },
    { nomi: 'Early access price', qiymat: '' },
  ]);
  assert.deepEqual(kartaRoyxati(j, 'max'), []);
});
