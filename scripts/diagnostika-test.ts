// SAT diagnostikasi: natija hisobi, savol tanlash, saqlash va ma'lumot fayli testlari.
// Ishga tushirish: npm run diagnostika:test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hisoblaNatija, javobsizlar, saralaZaif, tanlaSavollar, TAVSIYA_SONI, type DiagSavol, type DomenNatija, type Javoblar } from '../src/lib/diagnostika.ts';
import { localProgressStore, type Urinish } from '../src/lib/progressStore.ts';
import hamma from '../src/data/sat-diagnostic.json' with { type: 'json' };

const savollar = hamma as DiagSavol[];
const { savollar: diag } = tanlaSavollar(savollar, true);
const togriJavoblar: Javoblar = Object.fromEntries(diag.map((s) => [s.id, s.answer]));
const xatoHarf = (h: string) => (h === 'A' ? 'B' : 'A');

test("ma'lumot fayli: 10 savol, maydonlar to'g'ri", () => {
  assert.equal(savollar.length, 10);
  assert.equal(new Set(savollar.map((s) => s.id)).size, 10, 'id takrorlanmaydi');
  for (const s of savollar) {
    assert.ok(s.section === 'RW' || s.section === 'Math', s.id);
    assert.ok(s.domain && s.skill && s.prompt && s.explanation_uz, s.id);
    assert.ok(['easy', 'medium', 'hard'].includes(s.difficulty), s.id);
    assert.equal(s.choices.length, 4, s.id);
    assert.ok(['A', 'B', 'C', 'D'].includes(s.answer), s.id);
    assert.equal(typeof s.reviewed, 'boolean', s.id);
    assert.equal(s.source, 'original', s.id);
    if (s.section === 'RW') assert.equal(s.desmos_tip, undefined, `${s.id}: desmos_tip faqat Math`);
  }
  assert.equal(savollar.filter((s) => s.section === 'RW').length, 5);
  assert.equal(savollar.filter((s) => s.section === 'Math').length, 5);
});

test('tanlaSavollar: dev hammasi, prod faqat reviewed', () => {
  assert.equal(tanlaSavollar(savollar, true).savollar.length, 10);
  const prod = tanlaSavollar(savollar.map((s) => ({ ...s, reviewed: false })), false);
  assert.deepEqual(prod, { savollar: [], yetarli: false });
  const bittaYetmaydi = savollar.map((s, i) => ({ ...s, reviewed: i !== 0 }));
  assert.equal(tanlaSavollar(bittaYetmaydi, false).yetarli, false);
  const hammasi = tanlaSavollar(savollar.map((s) => ({ ...s, reviewed: true })), false);
  assert.equal(hammasi.yetarli, true);
  assert.deepEqual(hammasi.savollar.slice(0, 5).map((s) => s.section), ['RW', 'RW', 'RW', 'RW', 'RW']);
});

test("hammasi to'g'ri", () => {
  const n = hisoblaNatija(diag, togriJavoblar);
  assert.deepEqual(n.bolimlar, { RW: { togri: 5, jami: 5 }, Math: { togri: 5, jami: 5 } });
  assert.deepEqual(n.javobsiz, []);
  assert.deepEqual(n.zaifDomenlar, []);
  assert.ok(n.savollar.every((s) => s.holat === 'togri'));
});

test('hammasi xato', () => {
  const xato: Javoblar = Object.fromEntries(diag.map((s) => [s.id, xatoHarf(s.answer)]));
  const n = hisoblaNatija(diag, xato);
  assert.deepEqual(n.bolimlar, { RW: { togri: 0, jami: 5 }, Math: { togri: 0, jami: 5 } });
  assert.ok(n.savollar.every((s) => s.holat === 'xato'));
  // 8 domenning hammasida xato bor: avval 2 xatoli domenlar, keyin teng holatda asl tartib (R&W avval); 3 tasi ko'rinadi
  assert.deepEqual(n.zaifDomenlar.map((d) => d.domain), ['Standard English Conventions', 'Algebra', 'Craft and Structure']);
  assert.equal(n.qolganZaif, 5);
});

test('cheklash: chegara 3 standart, boshqa qiymatlar ham ishlaydi', () => {
  assert.equal(TAVSIYA_SONI, 3);
  const xato: Javoblar = Object.fromEntries(diag.map((s) => [s.id, xatoHarf(s.answer)]));
  const bitta = hisoblaNatija(diag, xato, 1);
  assert.deepEqual([bitta.zaifDomenlar.length, bitta.qolganZaif], [1, 7]);
  const kop = hisoblaNatija(diag, xato, 10);
  assert.deepEqual([kop.zaifDomenlar.length, kop.qolganZaif], [8, 0]);
  const nol = hisoblaNatija(diag, xato, 0);
  assert.deepEqual([nol.zaifDomenlar.length, nol.qolganZaif], [0, 8]);
  // Xatosi 3 tadan kam bo'lsa "yana K ta" chiqmaydi
  const ikki = hisoblaNatija(diag, { ...togriJavoblar, 'rw-soz-1': xatoHarf(togriJavoblar['rw-soz-1']!) });
  assert.deepEqual([ikki.zaifDomenlar.length, ikki.qolganZaif], [1, 0]);
  assert.equal(hisoblaNatija(diag, togriJavoblar).qolganZaif, 0);
});

const dom = (section: 'RW' | 'Math', domain: string, xato: number, jami: number): DomenNatija =>
  ({ section, domain, xato, jami, togri: jami - xato });

test('saralaZaif: xato soni, keyin xato ulushi, keyin pastroq bolim', () => {
  const teng = { RW: { togri: 3, jami: 5 }, Math: { togri: 3, jami: 5 } };
  // Xato soni ulushdan ustun: 3/6 (0.5) 2/2 (1.0) dan oldin
  assert.deepEqual(saralaZaif([dom('Math', 'B', 2, 2), dom('RW', 'A', 3, 6)], teng).map((d) => d.domain), ['A', 'B']);
  // Xato soni teng: ulushi katta oldin (2/2 > 2/3)
  assert.deepEqual(saralaZaif([dom('RW', 'A', 2, 3), dom('Math', 'B', 2, 2)], teng).map((d) => d.domain), ['B', 'A']);
  // Xato va ulush teng: bo'limi pastroq ball olgani oldin (Math 1/5 < R&W 4/5)
  const mathPast = { RW: { togri: 4, jami: 5 }, Math: { togri: 1, jami: 5 } };
  assert.deepEqual(saralaZaif([dom('RW', 'A', 1, 1), dom('Math', 'B', 1, 1)], mathPast).map((d) => d.domain), ['B', 'A']);
  // Hammasi teng: asl tartib saqlanadi
  assert.deepEqual(saralaZaif([dom('RW', 'A', 1, 1), dom('Math', 'B', 1, 1)], teng).map((d) => d.domain), ['A', 'B']);
  // Xatosiz domen tavsiyaga kirmaydi
  assert.deepEqual(saralaZaif([dom('RW', 'A', 0, 2)], teng), []);
});

test("teng holat haqiqiy savollarda: bo'lim bali hal qiladi", () => {
  // Craft and Structure (R&W 4/5) va Advanced Math (Math 3/5) ikkalasi 1/1 xato; Algebra 1/2
  const j: Javoblar = {
    ...togriJavoblar,
    'rw-soz-1': xatoHarf(togriJavoblar['rw-soz-1']!),
    'm-kvadrat-1': xatoHarf(togriJavoblar['m-kvadrat-1']!),
    'm-chiziqli-1': xatoHarf(togriJavoblar['m-chiziqli-1']!),
  };
  const n = hisoblaNatija(diag, j);
  assert.deepEqual(n.bolimlar, { RW: { togri: 4, jami: 5 }, Math: { togri: 3, jami: 5 } });
  assert.deepEqual(n.zaifDomenlar.map((d) => d.domain), ['Advanced Math', 'Craft and Structure', 'Algebra']);
  assert.equal(n.qolganZaif, 0);
});

test('aralash', () => {
  const j: Javoblar = { ...togriJavoblar, 'rw-tinish-1': 'C', 'm-geometriya-1': 'D', 'm-foiz-1': null };
  const n = hisoblaNatija(diag, j);
  assert.deepEqual(n.bolimlar, { RW: { togri: 4, jami: 5 }, Math: { togri: 3, jami: 5 } });
  assert.deepEqual(n.javobsiz, ['m-foiz-1']);
  const sec = n.domenlar.find((d) => d.domain === 'Standard English Conventions')!;
  assert.deepEqual([sec.togri, sec.jami, sec.xato], [1, 2, 1]);
  // Uch domen 1 tadan xato: ulushi 1/1 bo'lganlar (asl tartibda) oldin, Standard English Conventions (1/2) oxirida
  assert.deepEqual(n.zaifDomenlar.map((d) => d.domain), ['Problem-Solving and Data Analysis', 'Geometry and Trigonometry', 'Standard English Conventions']);
  assert.equal(n.qolganZaif, 0);
  assert.equal(n.savollar.find((s) => s.id === 'rw-tinish-1')!.holat, 'xato');
});

test('javobsiz holat', () => {
  const n = hisoblaNatija(diag, {});
  assert.deepEqual(n.bolimlar, { RW: { togri: 0, jami: 5 }, Math: { togri: 0, jami: 5 } });
  assert.equal(n.javobsiz.length, 10);
  assert.ok(n.savollar.every((s) => s.holat === 'javobsiz' && s.javob === null));
  assert.deepEqual(javobsizlar(diag, { 'rw-soz-1': 'A' }).length, 9);
  assert.deepEqual(hisoblaNatija([], {}).bolimlar, { RW: { togri: 0, jami: 0 }, Math: { togri: 0, jami: 0 } });
});

const urinish = (id: string, sana: string): Urinish => ({
  v: 1, id, sana, sekund: 60, javoblar: {}, xatoTurlari: {},
  natija: { bolimlar: { RW: { togri: 0, jami: 5 }, Math: { togri: 0, jami: 5 } }, domenlar: [] },
});

test('progressStore: localStorage bilan', () => {
  const xotira = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (k: string) => xotira.get(k) ?? null,
    setItem: (k: string, v: string) => void xotira.set(k, v),
    removeItem: (k: string) => void xotira.delete(k),
  };
  const st = localProgressStore('tayanch:test');
  assert.deepEqual(st.getAttempts(), []);
  assert.equal(st.saveAttempt(urinish('a', '2026-11-08T10:00:00Z')), true);
  assert.equal(st.saveAttempt(urinish('b', '2026-11-09T10:00:00Z')), true);
  assert.equal(st.saveAttempt({ ...urinish('a', '2026-11-08T10:00:00Z'), xatoTurlari: { x: 'vaqt' } }), true);
  const r = st.getAttempts();
  assert.deepEqual(r.map((u) => u.id), ['b', 'a'], 'upsert va yangisi birinchi');
  assert.equal(r[1].xatoTurlari.x, 'vaqt');
  xotira.set('tayanch:test', '{buzilgan');
  assert.deepEqual(st.getAttempts().map((u) => u.id), ['b', 'a'], "buzilgan JSON: ichki nusxa qaytadi");
  assert.equal(st.clear(), true);
  assert.deepEqual(st.getAttempts(), []);
});

test("progressStore: localStorage ishlamasa ham mashq davom etadi", () => {
  const otadi = () => { throw new Error('SecurityError'); };
  (globalThis as any).localStorage = { getItem: otadi, setItem: otadi, removeItem: otadi };
  const st = localProgressStore('tayanch:test');
  assert.deepEqual(st.getAttempts(), []);
  assert.equal(st.saveAttempt(urinish('a', '2026-11-08T10:00:00Z')), false);
  assert.deepEqual(st.getAttempts().map((u) => u.id), ['a'], 'sessiya ichida saqlanadi');
  assert.equal(st.clear(), false);
  assert.deepEqual(st.getAttempts(), []);
  delete (globalThis as any).localStorage;
  assert.deepEqual(localProgressStore().getAttempts(), [], "localStorage umuman yo'q");
});
