// P24 Report va feedback sof funksiyalari.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SABABLAR, sababTogrimi, xatoTuri, izohTayyorla, sahifaYoli, IZOH_MAX } from '../sat/xabar.ts';

test('sabablar: 5 ta, bazadagi check bilan bir xil', () => {
  assert.deepEqual(SABABLAR.map((s) => s.qiymat), ['wrong_answer', 'unclear', 'typo', 'figure', 'other']);
  assert.ok(sababTogrimi('typo'));
  assert.ok(!sababTogrimi('spam'));
  assert.ok(!sababTogrimi(null));
});

test('xatoTuri: server xatolari ekran holatiga', () => {
  assert.equal(xatoTuri({ code: '23505', message: 'report_duplicate' }), 'takror');
  assert.equal(xatoTuri({ code: '23505', message: 'duplicate key value violates unique constraint "reports_open_unique"' }), 'takror');
  assert.equal(xatoTuri({ code: 'P0001', message: 'report_rate_limited' }), 'limit');
  assert.equal(xatoTuri({ code: 'P0001', message: 'feedback_rate_limited' }), 'limit');
  assert.equal(xatoTuri({ code: '42501', message: 'permission denied for table reports' }), 'kirish');
  assert.equal(xatoTuri({ code: 'P0002', message: 'question_not_reportable' }), 'yaroqsiz');
  assert.equal(xatoTuri({ code: '22023', message: 'feedback_empty' }), 'yaroqsiz');
  assert.equal(xatoTuri(new TypeError('Failed to fetch')), 'tarmoq');
  assert.equal(xatoTuri(undefined), 'tarmoq');
});

test('izohTayyorla: bo\'shliq va chegara', () => {
  assert.equal(izohTayyorla('  salom  '), 'salom');
  assert.equal(izohTayyorla('x'.repeat(IZOH_MAX + 5)).length, IZOH_MAX);
});

test('sahifaYoli: faqat shu sayt, query va hash yo\'q', () => {
  const o = 'https://example.github.io';
  assert.equal(sahifaYoli('https://example.github.io/Tayanch/uz/sat/mashq/sessiya/?id=abc#q', o, '/Tayanch'), '/Tayanch/uz/sat/mashq/sessiya/');
  assert.equal(sahifaYoli('https://boshqa.example/Tayanch/uz/', o, '/Tayanch'), null);
  assert.equal(sahifaYoli('https://example.github.io/Boshqa/', o, '/Tayanch'), null);
  assert.equal(sahifaYoli('', o, '/Tayanch'), null);
  assert.equal(sahifaYoli(null, o, '/Tayanch'), null);
  assert.equal(sahifaYoli('::', o, '/Tayanch'), null);
});
