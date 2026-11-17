import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aiUsage, attemptParam, qisqaSana, tekshiruvYozuv, tutorHolati, tutorXatoMatni, xatoYozuv, XABAR_MAX,
} from '../sat/aiTutor.ts';

test('tutorHolati: available, not_in_plan, qolgani yopiq', () => {
  assert.equal(tutorHolati({ available: true }), 'tayyor');
  assert.equal(tutorHolati({ available: false, reason: 'not_in_plan' }), 'tarifda-yoq');
  assert.equal(tutorHolati({ available: false, reason: 'paused' }), 'yopiq');
  assert.equal(tutorHolati(null), 'yopiq');
});

test('tutorXatoMatni: har kod uchun tushunarli matn, noma\'lum kod umumiy', () => {
  assert.match(tutorXatoMatni('cb_content'), /official or copied test material/);
  assert.match(tutorXatoMatni('message_too_long'), new RegExp(String(XABAR_MAX)));
  assert.match(tutorXatoMatni('rate_limited', 4), /4 seconds/);
  assert.match(tutorXatoMatni('rate_limited'), /5 seconds/);
  assert.match(tutorXatoMatni('ai_unavailable'), /Nothing was counted/);
  assert.equal(tutorXatoMatni('boshqa'), 'Something went wrong. Please try again.');
});

test('tekshiruvYozuv', () => {
  assert.match(tekshiruvYozuv('verified'), /matches the answer key/);
  assert.match(tekshiruvYozuv('unverified'), /Couldn't be checked/);
  assert.match(tekshiruvYozuv(null), /Not checked/);
});

test('qisqaSana va xatoYozuv: Toshkent sanasi', () => {
  assert.equal(qisqaSana('2026-11-11T20:30:00Z'), '12 Nov');
  assert.equal(qisqaSana('yaroqsiz'), '');
  assert.equal(
    xatoYozuv({ attempt_id: 1, created_at: '2026-11-12T08:00:00Z', section: 'rw', skill: 'Transitions', difficulty: 2, snippet: 'Sample' }),
    'Reading and Writing · Transitions · 12 Nov: Sample',
  );
});

test('aiUsage: faqat ai_messages va ai_messages_month', () => {
  const u = aiUsage({
    limits: { questions: { max: 5, used: 1 }, ai_messages: { max: 3, used: 1 } },
    today: { questions: 1, ai_messages: 1, ai_messages_month: 4 },
  });
  assert.deepEqual(Object.keys(u!.limits!), ['ai_messages']);
  assert.deepEqual(Object.keys(u!.today!).sort(), ['ai_messages', 'ai_messages_month']);
  assert.equal(aiUsage(null), null);
});

test('attemptParam', () => {
  assert.equal(attemptParam('?attempt=42'), 42);
  assert.equal(attemptParam('?attempt=0'), null);
  assert.equal(attemptParam('?attempt=1e3'), null);
  assert.equal(attemptParam('?attempt=-2'), null);
  assert.equal(attemptParam(''), null);
});
