import assert from 'node:assert/strict';
import { test } from 'node:test';
import { baholaMashqJavobi, oqiBirinchiUrinish, oqiMashqJavoblari } from '../sat/mashqVaragi.ts';

test('legacy worksheet answers keep their question IDs and original strings', () => {
  const answers = { 'question-01': '22 / 2', 'question-02': '− 25/2', 'question-03': '' };
  assert.deepEqual(oqiMashqJavoblari(JSON.stringify(answers)), answers);
  assert.deepEqual(oqiMashqJavoblari('{"question-01":"22 / 2","invalid":7}'), { 'question-01': '22 / 2' });
  assert.deepEqual(oqiMashqJavoblari('['), {});
});

test('a saved first result can be read independently of practice and eliminated choices', () => {
  const firstAttempt = { correct: 2, unanswered: 12, total: 15 };
  assert.deepEqual(oqiBirinchiUrinish(JSON.stringify({
    firstAttempt,
    eliminated: { 'question-01': ['C'] },
  })), firstAttempt);
  assert.equal(oqiBirinchiUrinish(JSON.stringify({ firstAttempt: { ...firstAttempt, correct: 5 } })), null);
  assert.equal(oqiBirinchiUrinish(null), null);
});

test('a worksheet grades written equivalents and multiple choices', () => {
  const text = { external_id: 'question-01', stem: 'Sample', explanation: 'Sample explanation' };
  const written = { ...text, format: 'spr' as const, answer: ['-12.5'] };
  const choice = { ...text, format: 'mcq' as const, answer: 'D' as const, options: [] };
  assert.equal(baholaMashqJavobi(written, '− 25/2').status, 'correct');
  assert.equal(baholaMashqJavobi(written, '1/0').status, 'invalid');
  assert.equal(baholaMashqJavobi(choice, 'D').status, 'correct');
  assert.equal(baholaMashqJavobi(choice, 'C').status, 'incorrect');
  assert.equal(baholaMashqJavobi(choice, ' ').status, 'unanswered');
});
