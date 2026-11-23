import { test } from 'node:test';
import assert from 'node:assert/strict';
import bank from '../../../data/eyuf/questions-iq.json' with { type: 'json' };
import {
  mockBoshlash,
  mockTogrimi,
  mockJavob,
  mockYakun,
  mockNatija,
} from './mock.ts';

test('Mock har darajada 20 IQ va 20 tegishli blokdan iborat', () => {
  for (const level of ['bachelor', 'master'] as const) {
    const s = mockBoshlash(bank.items, level, true, 40, 60, 1000);
    assert(mockTogrimi(s, bank.items, true));
    assert.equal(new Set(s.ids).size, 40);
    assert(s.ids.every((id) => bank.items.find((q) => q.id === id)!.verified));
    assert(!mockTogrimi(s, bank.items, false));
  }
  assert.throws(() => mockBoshlash(bank.items, 'bachelor', false, 40, 60));
});
test('Mock muddatdan keyin va yakundan keyin javobni qabul qilmaydi', () => {
  const s = mockBoshlash(bank.items, 'master', true, 40, 60, 1000);
  assert.equal(mockJavob(s, s.ids[0], 'A', s.deadline), s);
  const answer = bank.items.find((q) => q.id === s.ids[0])!.answer!;
  const updated = mockJavob(s, s.ids[0], answer, 2000);
  assert.equal(mockNatija(updated, bank.items).correct, 1);
  const done = mockYakun(updated, 3000);
  assert.equal(mockJavob(done, s.ids[1], 'A', 4000), done);
  assert.equal(mockYakun(done, 5000), done);
});
test('Eski yoki buzilgan mock sessiyasi tiklanmaydi', () => {
  const s = mockBoshlash(bank.items, 'bachelor', true, 10, 15);
  assert(mockTogrimi(s, bank.items, true));
  for (const bad of [
    { ...s, current: 40 },
    { ...s, answers: { [s.ids[0]]: 'Z' } },
    { ...s, ids: Array(10).fill(s.ids[0]) },
    { ...s, deadline: null },
  ]) {
    assert(!mockTogrimi(bad, bank.items, true));
  }
});
