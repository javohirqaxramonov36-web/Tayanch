// Qolgan kun (muddat.ts) va SAT maqsad tekshiruvi (satMaqsad.ts): bugun / kelajak / o'tgan, validatsiya.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toshkentBugun, sanaTogri, kunFarqi, kunHolati, yilQosh } from '../muddat.ts';
import { ballXatosi, sanaXatosi, kelgusiSanalar, sarlavhaHolati } from '../satMaqsad.ts';
import { satSanalar } from '../../data/satSanalar.ts';

test('Tashkent date: UTC+5, day changes at 19:00 UTC', () => {
  assert.equal(toshkentBugun(new Date('2026-11-11T18:59:00Z')), '2026-11-11');
  assert.equal(toshkentBugun(new Date('2026-11-11T19:00:00Z')), '2026-11-12');
});

test('valid calendar dates only', () => {
  assert.equal(sanaTogri('2026-12-05'), true);
  assert.equal(sanaTogri('2027-02-29'), false);
  assert.equal(sanaTogri('2028-02-29'), true);
  assert.equal(sanaTogri('2026-13-01'), false);
  assert.equal(sanaTogri('5.12.2026'), false);
  assert.equal(sanaTogri(null), false);
});

test('day difference across months and years', () => {
  assert.equal(kunFarqi('2026-11-11', '2026-12-05'), 24);
  assert.equal(kunFarqi('2026-12-31', '2027-01-01'), 1);
  assert.equal(kunFarqi('2026-11-11', '2026-11-10'), -1);
});

test('day status: future, today, past', () => {
  assert.deepEqual(kunHolati('2026-11-11', '2027-01-13'), { tur: 'kelajak', kun: 63 });
  assert.deepEqual(kunHolati('2026-11-11', '2026-11-11'), { tur: 'bugun', kun: 0 });
  assert.deepEqual(kunHolati('2026-11-11', '2026-11-07'), { tur: 'otgan', kun: -4 });
});

test('add years keeps leap day valid', () => {
  assert.equal(yilQosh('2026-11-11', 2), '2028-11-11');
  assert.equal(yilQosh('2028-02-29', 1), '2029-02-28');
});

test('score validation: 400-1600, step 10', () => {
  assert.equal(ballXatosi('1500', true), null);
  assert.equal(ballXatosi('400'), null);
  assert.equal(ballXatosi('1600'), null);
  assert.equal(ballXatosi('', true), 'bosh');
  assert.equal(ballXatosi('  '), null);
  assert.equal(ballXatosi('15a0'), 'raqam');
  assert.equal(ballXatosi('1500.5'), 'raqam');
  assert.equal(ballXatosi('-500'), 'raqam');
  assert.equal(ballXatosi('390'), 'oraliq');
  assert.equal(ballXatosi('1610'), 'oraliq');
  assert.equal(ballXatosi('1505'), 'qadam');
});

test('date validation: today ok, past, too far, malformed, empty', () => {
  const b = '2026-11-11';
  assert.equal(sanaXatosi('', b), null);
  assert.equal(sanaXatosi('', b, true), 'bosh');
  assert.equal(sanaXatosi(b, b), null);
  assert.equal(sanaXatosi('2026-11-10', b), 'otgan');
  assert.equal(sanaXatosi('2028-11-11', b), null);
  assert.equal(sanaXatosi('2028-11-12', b), 'uzoq');
  assert.equal(sanaXatosi('2027-02-30', b), 'format');
});

test('official dates: past hidden, registration status from source deadlines', () => {
  const k = kelgusiSanalar(satSanalar.sanalar, '2026-11-21');
  assert.deepEqual(k.map((s) => s.sana), ['2026-12-05', '2027-03-06', '2027-05-01', '2027-06-05']);
  assert.equal(k[0].royxatHolati, 'kech'); // 20-noyabr o'tdi, 24-noyabrgacha kech ro'yxat
  assert.equal(k[1].royxatHolati, 'ochiq');
  assert.equal(kelgusiSanalar(satSanalar.sanalar, '2026-11-25')[0].royxatHolati, 'yopiq');
  assert.equal(kelgusiSanalar(satSanalar.sanalar, '2026-12-05')[0].sana, '2026-12-05');
  assert.equal(kelgusiSanalar(satSanalar.sanalar, '2027-06-06').length, 0);
});

test('header state: not set up, skipped, goal with date states', () => {
  const bosh = { target_score: null, current_score: null, exam_date: null, sat_setup_at: null };
  const b = '2026-11-11';
  assert.deepEqual(sarlavhaHolati(bosh, b), { tur: 'sozlanmagan' });
  assert.deepEqual(sarlavhaHolati({ ...bosh, sat_setup_at: '2026-11-11T10:00:00Z' }, b), { tur: 'bor', ball: null, sana: null });
  assert.deepEqual(sarlavhaHolati({ ...bosh, target_score: 1500, exam_date: '2027-01-13' }, b),
    { tur: 'bor', ball: 1500, sana: { tur: 'kelajak', kun: 63 } });
  assert.deepEqual(sarlavhaHolati({ ...bosh, target_score: 1500, exam_date: b }, b).tur, 'bor');
  const otgan = sarlavhaHolati({ ...bosh, target_score: 1500, exam_date: '2026-11-07' }, b);
  assert.equal(otgan.tur === 'bor' && otgan.sana?.tur, 'otgan');
  assert.deepEqual(sarlavhaHolati({ ...bosh, exam_date: 'buzuq' }, b), { tur: 'sozlanmagan' });
});
