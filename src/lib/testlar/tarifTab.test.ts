import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keyingiTab } from '../tarifTab.ts';
import { tarifKartalar, taqqosGuruhlar, NARX_YOQ, PRO_NARX } from '../../data/tariflar.ts';

test('keyingiTab: strelkalar aylanadi, Home/End chetga', () => {
  assert.equal(keyingiTab(0, 'ArrowRight', 3), 1);
  assert.equal(keyingiTab(2, 'ArrowRight', 3), 0);
  assert.equal(keyingiTab(0, 'ArrowLeft', 3), 2);
  assert.equal(keyingiTab(1, 'Home', 3), 0);
  assert.equal(keyingiTab(1, 'End', 3), 2);
  assert.equal(keyingiTab(1, 'Enter', 3), null);
  assert.equal(keyingiTab(0, 'ArrowRight', 0), null);
});

test('tariflar: bitta tavsiya, Pro narxi docs jadvalidan, Max belgilanmagan', () => {
  assert.equal(tarifKartalar.filter((k) => k.tavsiya).length, 1);
  const pro = tarifKartalar.find((k) => k.kod === 'pro')!;
  assert.equal(pro.narx, PRO_NARX);
  assert.equal(PRO_NARX, '59 000 soʻm');
  assert.doesNotMatch(JSON.stringify(pro), /\/oy/);
  assert.equal(tarifKartalar.find((k) => k.kod === 'max')!.narx, NARX_YOQ);
});

test('taqqoslash: Max bepul va Pro qatorlarini takrorlaydi', () => {
  for (const g of taqqosGuruhlar) for (const q of g.qatorlar) {
    if (q.qiymat.free === true || q.qiymat.pro === true) assert.equal(q.qiymat.max, true, q.nomi);
  }
});

test('taqqoslash: har qatorda uchala tarif', () => {
  for (const g of taqqosGuruhlar) for (const q of g.qatorlar) assert.deepEqual(Object.keys(q.qiymat).sort(), ['free', 'max', 'pro']);
});
