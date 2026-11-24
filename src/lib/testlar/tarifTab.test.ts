import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keyingiTab } from '../tarifTab.ts';
import { tarifKartalar, taqqosGuruhlar, MAX_NARX, PRO_NARX } from '../../data/tariflar.ts';
import { satTarif } from '../../data/satTarif.ts';

test('keyingiTab: strelkalar aylanadi, Home/End chetga', () => {
  assert.equal(keyingiTab(0, 'ArrowRight', 3), 1);
  assert.equal(keyingiTab(2, 'ArrowRight', 3), 0);
  assert.equal(keyingiTab(0, 'ArrowLeft', 3), 2);
  assert.equal(keyingiTab(1, 'Home', 3), 0);
  assert.equal(keyingiTab(1, 'End', 3), 2);
  assert.equal(keyingiTab(1, 'Enter', 3), null);
  assert.equal(keyingiTab(0, 'ArrowRight', 0), null);
});

test('tariflar: bitta tavsiya, Pro va Max narxi docs jadvalidan', () => {
  assert.equal(tarifKartalar.filter((k) => k.tavsiya).length, 1);
  const pro = tarifKartalar.find((k) => k.kod === 'pro')!;
  assert.equal(pro.narx, PRO_NARX);
  assert.equal(PRO_NARX, '59 000 soʻm');
  assert.doesNotMatch(JSON.stringify(pro), /\/oy/);
  const max = tarifKartalar.find((k) => k.kod === 'max')!;
  assert.equal(max.narx, MAX_NARX);
  assert.equal(MAX_NARX, '119 000 soʻm');
  assert.equal(max.narxIzoh, '30 kunga');
  // Sotuvga chiqmagan: CTA yo'q, "Tez orada".
  assert.equal(max.cta, null);
  assert.equal(max.ctaIzoh, 'Tez orada');
});

test('Max: bosh sahifa va SAT obuna sahifasidagi rejalashtirilgan narx bir xil', () => {
  const kut = satTarif.kutilayotgan.max!;
  assert.equal(kut.narxUzs, 119000);
  assert.equal(kut.kun, 30);
  assert.equal(MAX_NARX.replace(/\D/g, ''), String(kut.narxUzs));
});

test('taqqoslash: AI Tutor faqat Max ustunida', () => {
  const ai = taqqosGuruhlar.flatMap((g) => g.qatorlar).find((q) => q.nomi === 'AI Tutor')!;
  assert.equal(ai.qiymat.free, false);
  assert.equal(ai.qiymat.pro, false);
  assert.equal(ai.qiymat.max, 'Tez orada');
});

test('taqqoslash: Max bepul va Pro qatorlarini takrorlaydi', () => {
  for (const g of taqqosGuruhlar) for (const q of g.qatorlar) {
    if (q.qiymat.free === true || q.qiymat.pro === true) assert.equal(q.qiymat.max, true, q.nomi);
  }
});

test('taqqoslash: har qatorda uchala tarif', () => {
  for (const g of taqqosGuruhlar) for (const q of g.qatorlar) assert.deepEqual(Object.keys(q.qiymat).sort(), ['free', 'max', 'pro']);
});
