// SAT kirishi shaxsiy holati (src/lib/sat/kirishHolat.ts) va takrorlash.xatolarniQosh (yozmaydigan sof qism).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(s, c, n) {
    try { return n(s, c); }
    catch (e) { if (s.startsWith('.') && !/\.[a-z]+$/.test(s)) return n(s + '.ts', c); throw e; }
  },
});

const { kirishHolati, sanoq } = await import('../sat/kirishHolat.ts');
const { xatolarniQosh, guruhla } = await import('../takrorlash.ts');

const modullar = [
  { modul: 'hajm', idlar: ['h1', 'h2', 'h3'] },
  { modul: 'grafik', idlar: ['g1', 'g2'] },
  { modul: 'rw-xato', idlar: ['x1', 'x2'] },
];
const bosh = { modullar, testJavoblari: 0, xatolar: 0, bugunTakror: 0, yolSaqlangan: false };

test("ma'lumot yo'q: davom yo'q, hamma son 0", () => {
  const h = kirishHolati({ ...bosh, progress: null });
  assert.equal(h.davom, null);
  assert.equal(h.javoblar, 0);
  assert.deepEqual(h.darslar.hajm, { modul: 'hajm', javob: 0, jami: 3 });
});

test("davom: tartibdagi birinchi tugamagan dars; tugagan dars o'tkaziladi", () => {
  const progress = { hajm: { h1: 'togri', h2: 'xato', h3: 'togri' }, grafik: { g1: 'xato' }, 'rw-xato': { x1: 'togri' } };
  const h = kirishHolati({ ...bosh, progress, testJavoblari: 4 });
  assert.deepEqual(h.davom, { modul: 'grafik', javob: 1, jami: 2 });
  assert.equal(h.darslar.hajm.javob, 3);
  assert.equal(h.javoblar, 4 + 3 + 1 + 1);
});

test("eski yoki begona id va noto'g'ri qiymat sanalmaydi", () => {
  const progress = { hajm: { h1: 'togri', eski: 'togri', h2: 'balki' }, grafik: [1, 2], begona: { z: 'togri' } };
  const h = kirishHolati({ ...bosh, progress });
  assert.equal(h.darslar.hajm.javob, 1);
  assert.equal(h.darslar.grafik.javob, 0);
  assert.equal(h.javoblar, 1);
});

test("buzuq sonlar 0 ga tushadi", () => {
  const h = kirishHolati({ ...bosh, progress: 'buzuq', testJavoblari: -3, xatolar: Number.NaN, bugunTakror: 2.7, yolSaqlangan: 'ha' as unknown as boolean });
  assert.equal(h.javoblar, 0);
  assert.equal(h.xatolar, 0);
  assert.equal(h.bugunTakror, 2);
  assert.equal(h.yolSaqlangan, false);
});

test('sanoq: birlik va ko\'plik', () => {
  assert.equal(sanoq(1, 'answer'), '1 answer');
  assert.equal(sanoq(3, 'answer'), '3 answers');
  assert.equal(sanoq(0, 'mistake'), '0 mistakes');
});

test("xatolarniQosh: kirish holatini o'zgartirmaydi, yangi xatoni ertangi kunga qo'shadi", () => {
  const h = { versiya: 1 as const, savollar: { a: { quti: 3 as const, keyingi: '2026-11-20', xatoSana: '2026-11-01' } } };
  const xatolar = [
    { id: 'b', sana: '2026-11-10' },
    { id: 'a', sana: '2026-11-05' },
    { id: 'yoq', sana: '2026-11-10' },
    { id: 'c', sana: 'buzuq' },
  ];
  const { h: n, ozgardi } = xatolarniQosh(h, xatolar, new Set(['a', 'b', 'c']));
  assert.equal(ozgardi, true);
  assert.equal(h.savollar.a.quti, 3, 'kirish obyekti o\'zgarmaydi');
  assert.deepEqual(n.savollar.a, { quti: 1, keyingi: '2026-11-06', xatoSana: '2026-11-05' });
  assert.deepEqual(n.savollar.b, { quti: 1, keyingi: '2026-11-11', xatoSana: '2026-11-10' });
  assert.equal(n.savollar.yoq, undefined);
  assert.equal(n.savollar.c, undefined);
  assert.deepEqual(guruhla(n, '2026-11-11').bugun, ['a', 'b']);
});

test("xatolarniQosh: eski xato qayta qo'shilmaydi", () => {
  const h = { versiya: 1 as const, savollar: { a: { quti: 2 as const, keyingi: '2026-11-20', xatoSana: '2026-11-10' } } };
  const { ozgardi } = xatolarniQosh(h, [{ id: 'a', sana: '2026-11-10' }], new Set(['a']));
  assert.equal(ozgardi, false);
});
