// Kun savoli sof funksiyalari: mehmon yozuvi, vaqt va streak matni, xato turi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mehmonOqi, keyingiVaqtMatni, streakMatni, sanaMatni, kunXatoTuri, togriJavobMatni } from '../sat/kunSavoli.ts';

const yozuv = (o: object) => JSON.stringify({ sana: '2026-11-11', questionId: 'q1', javob: 'B', natija: null, ...o });

test('guest record: only today and the same question', () => {
  assert.deepEqual(mehmonOqi(yozuv({}), '2026-11-11', 'q1'), { sana: '2026-11-11', questionId: 'q1', javob: 'B', natija: null });
  assert.equal(mehmonOqi(yozuv({}), '2026-11-12', 'q1'), null, 'yesterday is stale');
  assert.equal(mehmonOqi(yozuv({}), '2026-11-11', 'q2'), null, 'other question');
  assert.equal(mehmonOqi(yozuv({ javob: '' }), '2026-11-11', 'q1'), null);
  assert.equal(mehmonOqi('{buzuq', '2026-11-11', 'q1'), null);
  assert.equal(mehmonOqi(null, '2026-11-11', 'q1'), null);
  const n = mehmonOqi(yozuv({ natija: { is_correct: false, correct: 'A', explanation: 'x' } }), '2026-11-11', 'q1');
  assert.deepEqual(n?.natija, { is_correct: false, correct: 'A', explanation: 'x' });
});

test('next question time: Tashkent midnight, local time added elsewhere', () => {
  const t = '2026-11-11T19:00:00Z';
  assert.equal(keyingiVaqtMatni(t, 'Asia/Tashkent'), "Tomorrow's question opens at 00:00 Tashkent time.");
  assert.equal(keyingiVaqtMatni(t, 'Asia/Karachi'), "Tomorrow's question opens at 00:00 Tashkent time.", 'same offset');
  assert.equal(keyingiVaqtMatni(t, 'America/New_York'), "Tomorrow's question opens at 00:00 Tashkent time (14:00 your time).");
  assert.equal(keyingiVaqtMatni(t, 'Europe/London'), "Tomorrow's question opens at 00:00 Tashkent time (19:00 your time).");
  assert.equal(keyingiVaqtMatni('yaroqsiz'), "Tomorrow's question opens at 00:00 Tashkent time.");
});

test('streak text: no blame when it breaks', () => {
  assert.equal(streakMatni({ current: 0, active_today: false }), 'Answer today to start a streak.');
  assert.equal(streakMatni({ current: 1, active_today: true }), 'Day 1 of your streak. Nice start.');
  assert.equal(streakMatni({ current: 4, active_today: true }), '4-day streak.');
  assert.equal(streakMatni({ current: 4, active_today: false }), "4-day streak. Answer today's question to keep it going.");
  for (const s of [0, 1, 5].flatMap((c) => [true, false].map((a) => streakMatni({ current: c, active_today: a })))) {
    assert.doesNotMatch(s, /lost|broke|miss|fail/i);
  }
});

test('date, error type, correct answer text', () => {
  assert.match(sanaMatni('2026-11-11'), /^Wed,? 11 Nov$/);
  assert.equal(kunXatoTuri(new Error('question_not_today')), 'eskirgan');
  assert.equal(kunXatoTuri({ message: 'daily_expired' }), 'eskirgan');
  assert.equal(kunXatoTuri(new TypeError('Failed to fetch')), 'tarmoq');
  assert.equal(togriJavobMatni(['1/2', '.5']), '1/2');
  assert.equal(togriJavobMatni('C'), 'C');
});
