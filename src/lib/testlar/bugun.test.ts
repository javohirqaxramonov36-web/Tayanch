// SAT "Today" bloki (bugun.ts): asosiy qadam ustuvorligi, takrorlash soni, reja kaliti, matnlar.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { asosiyQadam, xatoDueSoni, rejaBormi, streakMatn, aniqlikMatn, type BugunKirish } from '../sat/bugun.ts';

const bosh: BugunKirish = { mockFaol: null, xatoDue: 0, sozDue: 0, rejaBor: false, tahlil: null, oxirgiBall: null, bankSavol: 120 };

test('unfinished mock comes first', () => {
  const q = asosiyQadam({ ...bosh, mockFaol: { form_no: 2, current_module: 3, phase: 'module' }, xatoDue: 5, rejaBor: true });
  assert.equal(q.tur, 'mock');
  assert.equal(q.qism, 'mashq/mock/');
  assert.match(q.matn, /Mock test 2/);
});

test('due reviews before plan; mistakes link to the due tab', () => {
  const q = asosiyQadam({ ...bosh, xatoDue: 1, sozDue: 3, rejaBor: true });
  assert.equal(q.tur, 'takrorlash');
  assert.equal(q.qism, 'vosita/takrorlash/?tab=due');
  assert.match(q.matn, /^1 mistake and 3 words/);
});

test('only words due: vocabulary page', () => {
  const q = asosiyQadam({ ...bosh, sozDue: 2 });
  assert.equal(q.qism, 'mashq/lugat/');
  assert.match(q.matn, /^2 words/);
});

test('unknown counts (null) do not invent reviews', () => {
  assert.equal(asosiyQadam({ ...bosh, xatoDue: null, sozDue: null }).tur, 'boshlash');
});

test('plan, then weakest skill, then start', () => {
  assert.equal(asosiyQadam({ ...bosh, rejaBor: true }).tur, 'reja');
  const zaif = asosiyQadam({ ...bosh, tahlil: { urinish: 20, togri: 10, streak: 2, zaif: [{ skill: 'Inferences', foiz: 40 }] } });
  assert.equal(zaif.tur, 'zaif');
  assert.match(zaif.matn, /Inferences: 40%/);
  const yangi = asosiyQadam(bosh);
  assert.equal(yangi.tur, 'boshlash');
  assert.match(yangi.matn, /first questions/);
});

test('empty question bank: point to lessons, never to an empty page', () => {
  const q = asosiyQadam({ ...bosh, bankSavol: 0 });
  assert.equal(q.tur, 'dars');
  assert.equal(q.qism, 'qollanma/qayerdan-boshlash/');
  assert.equal(asosiyQadam({ ...bosh, bankSavol: null }).tur, 'boshlash');
  assert.equal(asosiyQadam({ ...bosh, bankSavol: 0, xatoDue: 2 }).tur, 'takrorlash');
});

test('due count matches the mistake log rule (box 1-4, date today or earlier)', () => {
  const items = [
    { in_queue: true, box: 1, next_due: '2026-11-13' },
    { in_queue: true, box: 4, next_due: '2026-11-01' },
    { in_queue: true, box: 5, next_due: '2026-11-01' },
    { in_queue: true, box: 2, next_due: '2026-11-14' },
    { in_queue: false, box: null, next_due: null },
  ];
  assert.equal(xatoDueSoni(items, '2026-11-13'), 2);
});

test('plan key: only a saved, non-empty plan counts', () => {
  assert.equal(rejaBormi(null), false);
  assert.equal(rejaBormi('{}'), false);
  assert.equal(rejaBormi('not json'), false);
  assert.equal(rejaBormi('{"weeks":[]}'), true);
});

test('streak and accuracy text', () => {
  assert.equal(streakMatn(0), 'No streak yet');
  assert.equal(streakMatn(1), '1 day');
  assert.equal(streakMatn(7), '7 days');
  assert.equal(aniqlikMatn(0, 0), null);
  assert.equal(aniqlikMatn(8, 6), '75%');
});
