// IELTS review: wrong test questions → review items (takrorlash.ts).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { ReadingTest } from '../sxema.ts';
import type { Urinish } from '../urinish.ts';
import { testJavobTekshir, testSavolId, testSavollari, testXatolari, toshkentSana } from '../takrorlash.ts';

const fixture = JSON.parse(
  readFileSync(new URL('../../../../../tests/fixtures/ielts/reading-fixture.json', import.meta.url), 'utf8'),
) as ReadingTest;
const testlar = new Map([[fixture.testId, fixture]]);
const TOGRI = { '1': 'FALSE', '2': 'ii', '3': ['A', 'C'], '5': 'forty' };

const urinish = (answers: Urinish['answers'], finishedAt: string, testId = fixture.testId): Urinish => ({
  id: finishedAt, testId, schemaVersion: 1, startedAt: finishedAt, finishedAt,
  answers, raw: 0, band: null, perTypeStats: {}, syncedAt: null,
});

test('toshkentSana: UTC+5 day boundary, invalid time', () => {
  assert.equal(toshkentSana('2026-11-11T18:59:00.000Z'), '2026-11-11');
  assert.equal(toshkentSana('2026-11-11T19:00:00.000Z'), '2026-11-12');
  assert.equal(toshkentSana('yaroqsiz'), '');
});

test('all correct → no review items', () => {
  assert.deepEqual(testXatolari([urinish(TOGRI, '2026-11-10T08:00:00Z')], testlar), []);
});

test('wrong, unanswered and half-right "Choose TWO" become one item each', () => {
  const u = urinish({ '1': 'TRUE', '3': ['A', 'B'], '5': 'forty' }, '2026-11-10T08:00:00Z');
  assert.deepEqual(testXatolari([u], testlar), [
    { id: testSavolId(fixture.testId, '1'), sana: '2026-11-10' },
    { id: testSavolId(fixture.testId, '2'), sana: '2026-11-10' },
    { id: testSavolId(fixture.testId, '3'), sana: '2026-11-10' },
  ]);
});

test('latest wrong date wins; later correct attempt does not remove the item', () => {
  const a = urinish({ ...TOGRI, '1': 'TRUE' }, '2026-11-08T08:00:00Z');
  const b = urinish({ ...TOGRI, '1': 'NOT GIVEN' }, '2026-11-10T08:00:00Z');
  const c = urinish(TOGRI, '2026-11-11T08:00:00Z');
  assert.deepEqual(testXatolari([b, a, c], testlar), [{ id: testSavolId(fixture.testId, '1'), sana: '2026-11-10' }]);
});

test('attempts of tests that are not loaded are skipped', () => {
  assert.deepEqual(testXatolari([urinish({}, '2026-11-10T08:00:00Z', 'reading-99')], testlar), []);
});

test('testSavollari: one entry per item with its evidence paragraph', () => {
  const m = testSavollari(testlar);
  assert.equal(m.size, 4);
  const j = m.get(testSavolId(fixture.testId, '1'))!;
  assert.equal(j.guruh.type, 'tfng');
  assert.equal(j.paragraf?.label, j.savol.evidence.paragraph);
});

test('testJavobTekshir: normalises raw input; "Choose TWO" needs both letters', () => {
  const m = testSavollari(testlar);
  const id = (k: string) => m.get(testSavolId(fixture.testId, k))!;
  assert.equal(testJavobTekshir(id('1'), 'false').togri, true);
  assert.equal(testJavobTekshir(id('3'), ['C', 'A']).togri, true);
  assert.equal(testJavobTekshir(id('3'), ['A']).togri, false);
  assert.equal(testJavobTekshir(id('5'), '  Forty ').togri, true);
  assert.equal(testJavobTekshir(id('5'), '').javob, undefined);
});
