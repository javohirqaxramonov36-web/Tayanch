import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bushMahalliy, kursQoralamasiniTekshir } from '../sat/sessiya.ts';
import { miniTestOtdimi } from '../sat/kursNatija.ts';

for (const [togri, jami, kutilgan] of [
  [3, 5, false], [4, 5, true], [6, 10, false], [7, 10, true], [0, 0, false],
] as const) {
  test(`Mini-test: ${togri}/${jami} → ${kutilgan ? 'Passed' : 'Not yet passed'}`, () => {
    assert.equal(miniTestOtdimi(togri, jami), kutilgan);
  });
}

test('Kurs qoralamasi serverdagi savol IDlariga mos kelsa davom etadi', () => {
  const m = { ...bushMahalliy(), qoralama: { mavjud: 'B' }, yakunlanmoqda: true };
  assert.equal(kursQoralamasiniTekshir(m, new Set(['mavjud'])), m);
  assert.deepEqual(kursQoralamasiniTekshir(m, new Set(['boshqa'])), bushMahalliy());
});
