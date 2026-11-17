// Xato daftari (P09) sof funksiyalari: bank qatori → band, ro'yxatlar, teg filtri va sanoqlar, qisqa ko'rinish.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bankdanBand, tabBandlari, tabSonlari, tegSonlari, tegMos, qisqaMatn, holatMatni, dueSoni, tabTogrimi, qiyinlikNomi,
  type Band, type BankQator,
} from '../sat/xatoDaftari.ts';
import { SABABLAR, sababTogrimi } from '../sat/sessiya.ts';

const KUN = '2026-11-11';
const qator = (o: Partial<BankQator>): BankQator => ({
  question_id: 'q', section: 'math', domain: 'Algebra', skill: 'Linear equations', difficulty: 3, format: 'mcq',
  preview: 'Sample stem', in_queue: true, box: 1, next_due: KUN, reason_tag: null, note: null, bookmarked: false, ...o,
});
const band = (o: Partial<Band>): Band => ({
  kalit: `dars:${o.id ?? 'x'}`, manba: 'dars', id: 'x', mavzu: 'Volume · Prisms', qiyinlik: 'easy', qisqa: 'q',
  quti: 1, keyingi: KUN, teg: null, izoh: '', saqlangan: false, ...o,
});

test('5 ta sabab tegi: other qo\'shilgan, eski 4 tasi o\'zgarmagan', () => {
  assert.deepEqual(SABABLAR.map((s) => s.kalit), ['careless', 'concept_gap', 'time_pressure', 'misread', 'other']);
  assert.equal(sababTogrimi('other'), true);
  assert.equal(sababTogrimi('lazy'), false);
});

test('bankdanBand: navbatdagi, faqat saqlangan va buzilgan qatorlar', () => {
  const b = bankdanBand(qator({ question_id: 'a', box: 2, next_due: '2026-11-14', reason_tag: 'misread', note: 'n', difficulty: 5 }))!;
  assert.equal(b.kalit, 'bank:a');
  assert.equal(b.quti, 2);
  assert.equal(b.teg, 'misread');
  assert.equal(b.qiyinlik, 'hard');
  assert.equal(b.mavzu, 'Algebra · Linear equations');
  const s = bankdanBand(qator({ question_id: 's', in_queue: false, box: null, next_due: null, bookmarked: true }))!;
  assert.equal(s.quti, null);
  assert.equal(s.saqlangan, true);
  assert.equal(bankdanBand(qator({ in_queue: false, box: null, next_due: null })), null);
  assert.equal(bankdanBand(qator({ reason_tag: 'boshqa' }))!.teg, null);
  assert.equal(bankdanBand(qator({ box: 9 })), null);
  assert.deepEqual([1, 2, 3, 4, 5].map(qiyinlikNomi), ['easy', 'easy', 'medium', 'hard', 'hard']);
});

test('ro\'yxatlar: Due today, All mistakes, Saved, Mastered', () => {
  const b = [
    band({ id: 'd1', keyingi: '2026-11-10', quti: 2 }),
    band({ id: 'd2', keyingi: KUN, quti: 1, manba: 'bank', kalit: 'bank:d2', saqlangan: true }),
    band({ id: 'l1', keyingi: '2026-11-20', quti: 3 }),
    band({ id: 'm1', keyingi: '2026-11-01', quti: 5 }),
    band({ id: 's1', quti: null, keyingi: null, manba: 'bank', kalit: 'bank:s1', saqlangan: true }),
  ];
  const id = (t: Parameters<typeof tabBandlari>[1]) => tabBandlari(b, t, KUN).map((x) => x.id);
  assert.deepEqual(id('due'), ['d1', 'd2']);
  assert.deepEqual(id('all'), ['d1', 'd2', 'l1']);
  assert.deepEqual(id('saved').sort(), ['d2', 's1']);
  assert.deepEqual(id('mastered'), ['m1']);
  assert.deepEqual(tabSonlari(b, KUN), { due: 2, all: 3, saved: 2, mastered: 1 });
  assert.deepEqual(dueSoni(b, KUN), { dars: 1, bank: 1 });
  assert.equal(tabTogrimi('saved'), true);
  assert.equal(tabTogrimi('xyz'), false);
});

test('teg filtri va sanoqlari (P14 manbasi)', () => {
  const b = [band({ id: 'a', teg: 'careless' }), band({ id: 'b', teg: 'careless' }), band({ id: 'c', teg: 'other' }), band({ id: 'd' })];
  const s = tegSonlari(b);
  assert.equal(s.all, 4);
  assert.equal(s.careless, 2);
  assert.equal(s.other, 1);
  assert.equal(s.none, 1);
  assert.equal(s.misread, 0);
  assert.deepEqual(b.filter((x) => tegMos(x, 'careless')).map((x) => x.id), ['a', 'b']);
  assert.deepEqual(b.filter((x) => tegMos(x, 'none')).map((x) => x.id), ['d']);
  assert.equal(b.filter((x) => tegMos(x, 'all')).length, 4);
});

test('qisqa ko\'rinish: HTML siz, bitta qator, so\'z chegarasida kesiladi', () => {
  assert.equal(qisqaMatn('  A <b>short</b>\n stem  '), 'A short stem');
  const uzun = 'word '.repeat(40);
  const q = qisqaMatn(uzun, 30);
  assert.ok(q.endsWith('…'));
  assert.ok(q.length <= 30);
  assert.ok(!q.includes('wor…'));
});

test('holat yozuvi', () => {
  assert.equal(holatMatni(band({ quti: 2, keyingi: KUN }), KUN), 'Box 2 · due today');
  assert.equal(holatMatni(band({ quti: 3, keyingi: '2026-11-18' }), KUN), 'Box 3 · next November 18');
  assert.equal(holatMatni(band({ quti: 5 }), KUN), 'Mastered');
  assert.equal(holatMatni(band({ quti: null, keyingi: null }), KUN), 'Saved');
});
