// P31: adaptive-style 2-modul tanlash va kalibrlash. Sun'iy (soxta) javoblar bilan; chegara faqat sinov ichida beriladi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import {
  aniqlik, adaptivHolat, tarmoqTanla, tarmoqQiyinliklari, ulushdanQiyinlik, kalibrla, kalibrJadval, type KalibrQator,
} from '../sat/adaptiv.ts';
import { adaptivSozlama, type AdaptivSozlama } from '../../data/satAdaptiv.ts';

/** Sinov chegarasi: haqiqiy qiymat emas, muallif hali bermagan. */
const sinov = (chegara: number | null): AdaptivSozlama => ({ ...adaptivSozlama, chegara });
const yetarli = { oson: 40, qiyin: 40 };

/** Sun'iy 1-modul: true = to'g'ri javob. */
const modul = (javoblar: boolean[]) => ({ togri: javoblar.filter(Boolean).length, jami: javoblar.length });
const takror = (togri: number, jami: number) => modul(Array.from({ length: jami }, (_, i) => i < togri));

test('default config: threshold is not set, so adaptivity is off', () => {
  assert.equal(adaptivSozlama.chegara, null);
  assert.deepEqual(tarmoqTanla(takror(27, 27), 'rw', yetarli), { tarmoq: 'standart', sabab: 'chegara-yoq', aniqlik: 100 });
});

test('synthetic answers: strong module 1 → hard branch, weak → easy branch (R&W and Math)', () => {
  const s = sinov(50);
  // R&W, 27 savol: 22 to'g'ri (81.5%) va 9 to'g'ri (33.3%)
  const kuchliRw = tarmoqTanla(takror(22, 27), 'rw', yetarli, s);
  const kuchsizRw = tarmoqTanla(takror(9, 27), 'rw', yetarli, s);
  assert.equal(kuchliRw.tarmoq, 'qiyin');
  assert.equal(kuchliRw.sabab, 'ustida');
  assert.equal(kuchsizRw.tarmoq, 'oson');
  assert.equal(kuchsizRw.sabab, 'ostida');
  // Math, 22 savol, aralash tartib
  const math = [true, false, true, true, true, false, true, true, true, true, false, true, true, true, true, true, false, true, true, true, true, true];
  assert.equal(tarmoqTanla(modul(math), 'math', yetarli, s).tarmoq, 'qiyin');
  assert.equal(tarmoqTanla(modul(math.map((x) => !x)), 'math', yetarli, s).tarmoq, 'oson');
  assert.deepEqual(tarmoqQiyinliklari('qiyin'), [3, 4, 5]);
  assert.deepEqual(tarmoqQiyinliklari('oson'), [1, 2, 3]);
  assert.equal(tarmoqQiyinliklari('standart'), null);
});

test('boundary: exactly at the threshold → easy branch (rule is strictly greater)', () => {
  assert.equal(tarmoqTanla(takror(11, 22), 'math', yetarli, sinov(50)).tarmoq, 'oson'); // 50%
  assert.equal(tarmoqTanla(takror(12, 22), 'math', yetarli, sinov(50)).tarmoq, 'qiyin'); // 54.5%
  assert.equal(tarmoqTanla(takror(0, 22), 'math', yetarli, sinov(0)).tarmoq, 'oson');
  assert.equal(tarmoqTanla(takror(22, 22), 'math', yetarli, sinov(100)).tarmoq, 'oson');
});

test('not enough questions in either branch → adaptivity off (standard order)', () => {
  const s = sinov(50);
  assert.deepEqual(adaptivHolat('rw', { oson: 26, qiyin: 40 }, s), { yoqilgan: false, sabab: 'savol-kam' });
  assert.deepEqual(adaptivHolat('rw', { oson: 40, qiyin: 26 }, s), { yoqilgan: false, sabab: 'savol-kam' });
  assert.deepEqual(adaptivHolat('rw', { oson: 27, qiyin: 27 }, s), { yoqilgan: true });
  assert.deepEqual(adaptivHolat('math', { oson: 22, qiyin: 21 }, s), { yoqilgan: false, sabab: 'savol-kam' });
  assert.deepEqual(adaptivHolat('math', { oson: Number.NaN, qiyin: 40 }, s), { yoqilgan: false, sabab: 'savol-kam' });
  assert.equal(tarmoqTanla(takror(27, 27), 'rw', { oson: 0, qiyin: 0 }, s).tarmoq, 'standart');
});

test('invalid threshold or module 1 result → standard', () => {
  for (const c of [Number.NaN, -1, 101, Number.POSITIVE_INFINITY]) {
    assert.equal(tarmoqTanla(takror(20, 27), 'rw', yetarli, sinov(c)).sabab, 'chegara-yoq');
  }
  assert.deepEqual(tarmoqTanla({ togri: 0, jami: 0 }, 'rw', yetarli, sinov(50)), { tarmoq: 'standart', sabab: 'natija-yoq', aniqlik: null });
  assert.equal(tarmoqTanla({ togri: 5, jami: 4 }, 'rw', yetarli, sinov(50)).sabab, 'natija-yoq');
  assert.equal(tarmoqTanla({ togri: 1.5, jami: 4 }, 'rw', yetarli, sinov(50)).sabab, 'natija-yoq');
  assert.equal(aniqlik({ togri: 3, jami: 4 }), 75);
});

test('calibration: bands and minimum answers N', () => {
  assert.deepEqual([100, 80, 79.9, 60, 40, 20, 19.9, 0].map((u) => ulushdanQiyinlik(u)), [1, 1, 2, 2, 3, 4, 5, 5]);
  const N = adaptivSozlama.kalibrlash.minJavob;
  const qatorlar: KalibrQator[] = [
    { savolId: 'kam', joriy: 3, javoblar: N - 1, togri: N - 1 }, // 100%, lekin N dan kam
    { savolId: 'oson-chiqdi', joriy: 3, javoblar: N, togri: Math.ceil(N * 0.9) },
    { savolId: 'mos', joriy: 3, javoblar: N * 2, togri: N }, // 50%
    { savolId: 'nol', joriy: 2, javoblar: 0, togri: 0 },
  ];
  const r = kalibrla(qatorlar);
  assert.deepEqual(r.map((x) => [x.savolId, x.taklif, x.holat]), [
    ['kam', null, 'kam'], ['oson-chiqdi', 1, 'ozgaradi'], ['mos', 3, 'mos'], ['nol', null, 'kam'],
  ]);
  const jadval = kalibrJadval(r).split('\n');
  assert.equal(jadval.length, 6);
  assert.match(jadval[2], /^\| oson-chiqdi \| 3 \| 30 \| 90\.0 \| 1 \| ozgaradi \|$/);
  assert.match(jadval[5], /^\| nol \| 2 \| 0 \| — \| — \| kam \|$/);
});

test('SQL defaults match satAdaptiv.ts (N and bands)', () => {
  const papka = new URL('../../../supabase/migrations/', import.meta.url);
  const fayl = readdirSync(papka).find((f) => f.endsWith('_adaptiv_kalibr.sql'));
  assert.ok(fayl, 'adaptiv_kalibr migratsiyasi topilmadi');
  const sql = readFileSync(new URL(fayl, papka), 'utf8');
  const { minJavob, pogonalar } = adaptivSozlama.kalibrlash;
  assert.equal(sql.match(/p_min_answers integer default (\d+)/g)?.length, 2);
  for (const m of sql.matchAll(/p_min_answers integer default (\d+)/g)) assert.equal(Number(m[1]), minJavob);
  const bands = [...sql.matchAll(/p_bands numeric\[\] default '\{([\d,]+)\}'/g)].map((m) => m[1]);
  assert.deepEqual(bands, [pogonalar.join(','), pogonalar.join(',')]);
});
