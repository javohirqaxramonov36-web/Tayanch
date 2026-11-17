// P16 "Where to start" sof funksiyalari: qolgan hafta, holatni tekshirish, bosqich matnlari.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qolganHafta, holatniTekshir, bosqichMatnlari, xulosa } from '../sat/yolXaritasi.ts';

test('qolganHafta: yuqoriga yaxlitlanadi, o\'tgan sana 0, noto\'g\'ri sana null', () => {
  assert.equal(qolganHafta('2026-11-18', '2026-11-11'), 1);
  assert.equal(qolganHafta('2026-11-19', '2026-11-11'), 2);
  assert.equal(qolganHafta('2026-11-11', '2026-11-11'), 0);
  assert.equal(qolganHafta('2026-11-01', '2026-11-11'), 0);
  assert.equal(qolganHafta('2026-02-30', '2026-11-11'), null);
  assert.equal(qolganHafta(undefined, '2026-11-11'), null);
});

test('holatniTekshir: begona qiymatlar tashlanadi', () => {
  const h = holatniTekshir({ javoblar: { sana: 'balki', daraja: 'yangi', soat: 3 }, belgilar: { reja: true, x: 'ha' } });
  assert.deepEqual(h.javoblar, { sana: undefined, sanaQiymat: undefined, daraja: 'yangi', soat: undefined, byudjet: undefined });
  assert.deepEqual(h.belgilar, { reja: true });
  assert.deepEqual(holatniTekshir(null), { javoblar: {}, belgilar: {} });
});

test('bosqichMatnlari: 7 bosqich, har birida matn', () => {
  const m = bosqichMatnlari({}, '2026-11-11');
  assert.deepEqual(Object.keys(m), ['diagnostika', 'kiritish', 'reja', 'konikma', 'vaqtli', 'tahlil', 'qayta']);
  for (const v of Object.values(m)) assert.ok(v.length > 0);
});

test('bosqichMatnlari: sana yaqin bo\'lsa vaqtli mashq ustun, qo\'shimcha byudjetda norasmiy testlar eslatiladi', () => {
  const m = bosqichMatnlari({ sana: 'bor', sanaQiymat: '2026-11-25', byudjet: 'qoshimcha' }, '2026-11-11');
  assert.match(m.reja[0], /2 weeks/);
  assert.match(m.vaqtli[0], /close/);
  assert.match(m.vaqtli[1], /not checked/);
  const uzoq = bosqichMatnlari({ sana: 'bor', sanaQiymat: '2027-03-13', byudjet: 'bepul' }, '2026-11-11');
  assert.doesNotMatch(uzoq.vaqtli[0], /close/);
  assert.equal(uzoq.vaqtli.length, 1);
});

test('bosqichMatnlari: o\'tgan sana va haqiqiy SAT', () => {
  const m = bosqichMatnlari({ sana: 'bor', sanaQiymat: '2026-10-01', daraja: 'haqiqiy' }, '2026-11-11');
  assert.match(m.reja[0], /has passed/);
  assert.match(m.diagnostika[0], /real SAT/);
  assert.match(m.qayta[0], /already have a real score/);
});

test('xulosa: hafta faqat kelajakdagi sanada', () => {
  assert.equal(xulosa({ sana: 'bor', sanaQiymat: '2026-11-18' }, '2026-11-11', 7, 2), 'Your path is updated: 2 of 7 steps done. 1 week to your test.');
  assert.equal(xulosa({ sana: 'yoq' }, '2026-11-11', 7, 0), 'Your path is updated: 0 of 7 steps done.');
});
