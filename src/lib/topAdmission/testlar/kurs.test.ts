// Admission H: kurs progressi va kurs ma'lumoti.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bajarilganSoni, darsBajarildimi, mezonniAlmashtir, progressniTozala } from '../kursProgress.ts';
import { DARSLAR, MODULLAR, YOLLAR } from '../../../data/topAdmission/kurs.ts';

test('progressniTozala: buzilgan qiymatlar tashlanadi', () => {
  assert.deepEqual(progressniTozala(null), {});
  assert.deepEqual(progressniTozala([1, 2]), {});
  assert.deepEqual(progressniTozala({ a: ['x', 'x', 3, 'y'], b: 'z', c: [] }), { a: ['x', 'y'] });
});

test("mezonniAlmashtir: qo'shadi, olib tashlaydi, aslini o'zgartirmaydi", () => {
  const p0 = {};
  const p1 = mezonniAlmashtir(p0, 'd1', 'm1', true);
  assert.deepEqual(p0, {});
  assert.deepEqual(p1, { d1: ['m1'] });
  assert.deepEqual(mezonniAlmashtir(p1, 'd1', 'm1', true), { d1: ['m1'] });
  assert.deepEqual(mezonniAlmashtir(p1, 'd1', 'm1', false), {});
});

test('darsBajarildimi va bajarilganSoni', () => {
  const p = { d1: ['a', 'b', 'eski'], d2: ['a'] };
  assert.equal(darsBajarildimi(p, 'd1', ['a', 'b']), true);
  assert.equal(darsBajarildimi(p, 'd2', ['a', 'b']), false);
  assert.equal(darsBajarildimi(p, 'd3', []), false);
  assert.equal(bajarilganSoni(p, [{ slug: 'd1', mezonlar: ['a', 'b'] }, { slug: 'd2', mezonlar: ['a', 'b'] }]), 1);
});

test("kurs ma'lumoti: 16 dars, noyob slug, to'liq darslarda besh qism", () => {
  assert.equal(DARSLAR.length, 16);
  assert.equal(new Set(DARSLAR.map((d) => d.slug)).size, 16);
  DARSLAR.forEach((d, i) => assert.equal(d.raqam, i + 1));
  for (const d of DARSLAR.filter((x) => x.tushuntirish)) {
    assert.ok(d.tushuntirish!.length > 0 && d.misol && d.mashq && d.keyingi, d.slug);
    assert.ok(d.mezonlar!.length >= 3 && d.mezonlar!.length <= 5, d.slug);
    assert.equal(new Set(d.mezonlar!.map((m) => m.id)).size, d.mezonlar!.length, d.slug);
    assert.ok(MODULLAR.some((m) => m.raqam === d.modul));
  }
  for (const y of YOLLAR) for (const r of y.darslar) assert.ok(DARSLAR.some((d) => d.raqam === r));
});
