// Greeting hour boundaries and days-left / pace calculation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kunQismi, salomMatni } from '../salom.ts';
import { qolganKun, muddatHolati, mahalliySana } from '../qolganKun.ts';
import { navigatorMatni } from '../../../data/navigatorMatn.ts';

const matn = navigatorMatni('uz');
const soatda = (h: number, m = 0) => new Date(2026, 10, 9, h, m);

test('greeting boundaries: 05-11 morning, 11-18 day, 18-05 evening', () => {
  const kutilgan: [number, string][] = [
    [0, 'kech'], [4, 'kech'], [5, 'tong'], [10, 'tong'], [11, 'kun'], [17, 'kun'], [18, 'kech'], [23, 'kech'],
  ];
  for (const [h, k] of kutilgan) assert.equal(kunQismi(h), k, `${h}:00`);
  assert.equal(kunQismi(soatda(10, 59).getHours()), 'tong');
});

test('greeting with and without a name', () => {
  assert.equal(salomMatni(matn, soatda(8), 'Aziza'), 'Xayrli tong, Aziza!');
  assert.equal(salomMatni(matn, soatda(12), '  '), 'Xayrli kun!');
  assert.equal(salomMatni(matn, soatda(21), null), 'Xayrli kech!');
});

test('days left uses the local calendar day', () => {
  const bugun = new Date(2026, 10, 9, 23, 59);
  assert.equal(qolganKun('2026-11-09', bugun), 0);
  assert.equal(qolganKun('2026-11-10', bugun), 1);
  assert.equal(qolganKun('2026-11-08', bugun), -1);
  assert.equal(qolganKun('2027-01-01', bugun), 53);
  assert.equal(qolganKun('2026-02-30', bugun), null);
  assert.equal(mahalliySana(bugun), '2026-11-09');
});

test('days left is recomputed from the date each time', () => {
  const p = { timeLeft: 'date' as const, examDate: '2026-12-09', skipped: false };
  assert.equal(muddatHolati(p, new Date(2026, 10, 9)).qolgan, 30);
  assert.equal(muddatHolati(p, new Date(2026, 10, 30)).qolgan, 9);
});

test('pace from answers and exact date', () => {
  const d = (examDate: string) => muddatHolati({ timeLeft: 'date', examDate, skipped: false }, new Date(2026, 10, 9));
  assert.equal(muddatHolati({ timeLeft: '15d', examDate: null, skipped: false }, new Date()).surat, 'intensiv');
  assert.equal(muddatHolati({ timeLeft: '1m', examDate: null, skipped: false }, new Date()).surat, 'oy');
  assert.equal(muddatHolati({ timeLeft: '3m', examDate: null, skipped: false }, new Date()).surat, 'uzoq');
  assert.equal(muddatHolati({ timeLeft: 'unknown', examDate: null, skipped: false }, new Date()).surat, 'umumiy');
  assert.equal(d('2026-11-24').surat, 'intensiv'); // 15 days
  assert.equal(d('2026-11-25').surat, 'oy'); // 16 days
  assert.equal(d('2026-12-24').surat, 'oy'); // 45 days
  assert.equal(d('2026-12-25').surat, 'uzoq'); // 46 days
  assert.deepEqual(d('2026-11-01'), { surat: 'umumiy', qolgan: -8, otgan: true });
  assert.equal(muddatHolati({ timeLeft: '15d', examDate: null, skipped: true }, new Date()).surat, 'umumiy');
});
