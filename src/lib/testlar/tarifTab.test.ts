import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keyingiTab } from '../tarifTab.ts';
import { tarifKartalar, taqqosGuruhlar, NARX_JOY } from '../../data/tariflar.ts';

test('keyingiTab: strelkalar aylanadi, Home/End chetga', () => {
  assert.equal(keyingiTab(0, 'ArrowRight', 3), 1);
  assert.equal(keyingiTab(2, 'ArrowRight', 3), 0);
  assert.equal(keyingiTab(0, 'ArrowLeft', 3), 2);
  assert.equal(keyingiTab(1, 'Home', 3), 0);
  assert.equal(keyingiTab(1, 'End', 3), 2);
  assert.equal(keyingiTab(1, 'Enter', 3), null);
  assert.equal(keyingiTab(0, 'ArrowRight', 0), null);
});

test('tariflar: bitta tavsiya, pullik narx faqat joy egasi', () => {
  assert.equal(tarifKartalar.filter((k) => k.tavsiya).length, 1);
  for (const k of tarifKartalar.filter((k) => k.kod !== 'free')) assert.equal(k.narx, NARX_JOY);
  assert.doesNotMatch(JSON.stringify(tarifKartalar), /\d{2}\s?\d{3}/);
});

test('taqqoslash: har qatorda uchala tarif', () => {
  for (const g of taqqosGuruhlar) for (const q of g.qatorlar) assert.deepEqual(Object.keys(q.qiymat).sort(), ['free', 'max', 'pro']);
});
