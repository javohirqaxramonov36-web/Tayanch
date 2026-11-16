// P25 metrikalar: brauzerdagi tezlik cheklovi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { METRIKA_OYNA_MS, metrikaKaliti, yuborishMumkin } from '../metrikaCheklov.ts';

const hozir = 1_800_000_000_000;

test('key uses the tayanch: prefix', () => {
  assert.equal(metrikaKaliti('plan_viewed'), 'tayanch:metrika:plan_viewed');
});

test('first send is allowed', () => {
  assert.equal(yuborishMumkin(null, hozir), true);
  assert.equal(yuborishMumkin('', hozir), true);
});

test('second send inside the window is blocked, after the window allowed', () => {
  assert.equal(yuborishMumkin(String(hozir - 1000), hozir), false);
  assert.equal(yuborishMumkin(String(hozir - METRIKA_OYNA_MS + 1), hozir), false);
  assert.equal(yuborishMumkin(String(hozir - METRIKA_OYNA_MS), hozir), true);
});

test('broken or future values do not block forever', () => {
  assert.equal(yuborishMumkin('abc', hozir), true);
  assert.equal(yuborishMumkin('-5', hozir), true);
  assert.equal(yuborishMumkin(String(hozir + 60_000), hozir), true);
});
