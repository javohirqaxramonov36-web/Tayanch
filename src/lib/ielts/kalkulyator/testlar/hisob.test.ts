import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GT_READING_JADVALI, LISTENING_JADVALI } from '../../../../data/ielts/bandJadvali.ts';
import { jadvalXatolari } from '../../reading/band.ts';
import { sonMatn, umumiyBand, xomBand, xomTekshir } from '../hisob.ts';

test('jadvallar 0..40 ni bir martadan qoplaydi', () => {
  assert.deepEqual(jadvalXatolari(LISTENING_JADVALI), []);
  assert.deepEqual(jadvalXatolari(GT_READING_JADVALI), []);
});

test('ielts.org (IE04) namunaviy nuqtalari', () => {
  const nuqtalar: [Parameters<typeof xomBand>[1], number, number][] = [
    ['listening', 16, 5], ['listening', 23, 6], ['listening', 30, 7], ['listening', 35, 8],
    ['academic', 15, 5], ['academic', 23, 6], ['academic', 30, 7], ['academic', 35, 8],
    ['general', 15, 4], ['general', 23, 5], ['general', 30, 6], ['general', 35, 7],
  ];
  for (const [tur, raw, band] of nuqtalar) {
    const n = xomBand(raw, tur);
    assert.equal(n.band, band, `${tur} ${raw}`);
    assert.equal(n.rasmiy, true, `${tur} ${raw} rasmiy`);
  }
});

test('rasmiy nuqtadan boshqa ball taxminiy', () => {
  assert.equal(xomBand(31, 'academic').rasmiy, false);
  assert.equal(xomBand(40, 'listening').band, 9);
  assert.equal(xomBand(40, 'listening').rasmiy, false);
  assert.equal(xomBand(2, 'listening').band, null);
  assert.equal(xomBand(34, 'general').band, 6.5);
});

test('kiritishni tekshirish', () => {
  assert.deepEqual(xomTekshir(' 27 '), { son: 27 });
  assert.deepEqual(xomTekshir('0'), { son: 0 });
  assert.ok('xato' in xomTekshir(''));
  assert.ok('xato' in xomTekshir('41'));
  assert.ok('xato' in xomTekshir('-1'));
  assert.ok('xato' in xomTekshir('27.5'));
  assert.ok('xato' in xomTekshir('abc'));
});

test('umumiy band: ielts.org misollari', () => {
  assert.deepEqual(umumiyBand([6.5, 6.5, 5, 7]), { ortacha: 6.25, band: 6.5, qoida: 'yarimga' });
  assert.deepEqual(umumiyBand([4, 3.5, 4, 4]), { ortacha: 3.875, band: 4, qoida: 'butunga' });
  assert.deepEqual(umumiyBand([6.5, 6.5, 5.5, 6]), { ortacha: 6.125, band: 6, qoida: 'pastga' });
});

test('umumiy band: chegaralar', () => {
  assert.equal(umumiyBand([7, 7, 7, 7]).band, 7);
  assert.equal(umumiyBand([6.5, 6.5, 6.5, 6]).band, 6.5); // 6.375
  assert.equal(umumiyBand([6.5, 6.5, 7, 6.5]).band, 6.5); // 6.625
  assert.equal(umumiyBand([7, 7, 7, 6]).band, 7); // 6.75
  assert.equal(umumiyBand([9, 9, 9, 9]).band, 9);
  assert.equal(umumiyBand([0, 0, 0, 0]).band, 0);
  assert.throws(() => umumiyBand([6, 6, 6]));
});

test('son matni', () => {
  assert.equal(sonMatn(7), '7.0');
  assert.equal(sonMatn(6.25), '6.25');
  assert.equal(sonMatn(3.875), '3.875');
});
