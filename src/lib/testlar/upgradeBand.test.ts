// Yon paneldagi Upgrade bandi: ko'rinish sharti, izoh faqat plans farqidan, kesh muddati. Raqamlar to'qilgan namuna.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bandKorinadimi, keshYaroqli, KESH_MS, upgradeIzohi } from '../sat/upgradeBand.ts';
import type { QatorTur } from '../sat/tarifJadval.ts';

const qatorlar: QatorTur[] = [
  { tur: 'kvota', kalit: 'questions', nomi: 'Question bank questions' },
  { tur: 'kvota', kalit: 'ai_messages', oylikKalit: 'ai_messages_month', yopiqStandart: true, nomi: 'AI tutor messages' },
  { tur: 'bayroq', kalit: 'analytics_extended', nomi: 'Extended analytics' },
  { tur: 'bayroq', kalit: 'vocab_my_words', nomi: 'Add your own words' },
];

test('band: only for the free plan; paid or unknown plan hides it', () => {
  assert.equal(bandKorinadimi('free'), true);
  assert.equal(bandKorinadimi('pro'), false);
  assert.equal(bandKorinadimi('max'), false);
  assert.equal(bandKorinadimi(null), false);
});

test('note: names what Pro adds over Free, from plans data only', () => {
  const t = [
    { code: 'free', limits: {}, features: [] },
    { code: 'pro', limits: {}, features: ['analytics_extended'] },
  ];
  assert.equal(upgradeIzohi(t, 'pro', qatorlar), 'Extended analytics');
  const k = [
    { code: 'free', limits: { questions: { max: 20 } }, features: [] },
    { code: 'pro', limits: {}, features: ['analytics_extended', { flag: 'vocab_my_words' }] },
  ];
  assert.equal(upgradeIzohi(k, 'pro', qatorlar), 'Question bank questions, Extended analytics and more');
});

test('note: no difference or no Pro row gives null', () => {
  assert.equal(upgradeIzohi([{ code: 'free', limits: {}, features: [] }, { code: 'pro', limits: {}, features: [] }], 'pro', qatorlar), null);
  assert.equal(upgradeIzohi([{ code: 'free', limits: {}, features: [] }], 'pro', qatorlar), null);
});

test('cache: valid for 10 minutes only', () => {
  const k = { vaqt: 1000, plan: 'free', izoh: null, tarifNomi: 'Pro' };
  assert.equal(keshYaroqli(k, 1000 + KESH_MS - 1), true);
  assert.equal(keshYaroqli(k, 1000 + KESH_MS), false);
  assert.equal(keshYaroqli(null, 1000), false);
  assert.equal(keshYaroqli({ vaqt: 'x' }, 1000), false);
});
