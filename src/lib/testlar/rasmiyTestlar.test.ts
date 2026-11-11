// SAT test tracker (P11) sof funksiyalari: validatsiya, urinishlar, statistika, CSV, chizma.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  balXatosi, testniTekshir, xatoniTekshir, omborniTozala, urinishlar, konikmaStatistikasi,
  csvKatak, testlarCsv, xatolarCsv, chizmaHisobla, domenTop, type RasmiyTest, type RasmiyXato, type Ombor,
} from '../sat/rasmiyTestlar.ts';
import { namunaOmbor } from '../sat/rasmiyTestlarNamuna.ts';

const kirish = { turi: 'real', nomi: 'March SAT', sana: '2026-03-14', rw: '650', math: '700', daqiqa: '', izoh: '' };

test('section score: 200-800, steps of 10', () => {
  for (const ok of ['200', '210', '650', '800']) assert.equal(balXatosi(ok, 'Math'), null, ok);
  assert.match(balXatosi('', 'Math')!, /Enter your Math score/);
  assert.match(balXatosi('190', 'Math')!, /from 200 to 800/);
  assert.match(balXatosi('810', 'Math')!, /from 200 to 800/);
  assert.match(balXatosi('655', 'Math')!, /steps of 10, for example 660/);
  assert.match(balXatosi('652', 'Math')!, /for example 650/);
  for (const yomon of ['6.5e2', '650.0', '-200', 'abc', '0x20']) assert.ok(balXatosi(yomon, 'Math'), yomon);
});

test('test form: total is computed, future date and bad fields rejected', () => {
  const n = testniTekshir(kirish, '2026-11-11');
  assert.ok(n.ok);
  if (n.ok) assert.equal(n.qiymat.rw + n.qiymat.math, 1350);
  const k = testniTekshir({ ...kirish, turi: 'x', nomi: ' ', sana: '2026-12-01', rw: '195', math: '705', daqiqa: '0', izoh: 'a'.repeat(2001) }, '2026-11-11');
  assert.ok(!k.ok);
  if (!k.ok) assert.deepEqual(Object.keys(k.xatolar).sort(), ['daqiqa', 'izoh', 'math', 'nomi', 'rw', 'sana', 'turi']);
  const s = testniTekshir({ ...kirish, sana: '2026-02-30' }, '2026-11-11');
  assert.ok(!s.ok && s.xatolar.sana === 'Enter a valid date.');
  const d = testniTekshir({ ...kirish, daqiqa: '134' }, '2026-11-11');
  assert.ok(d.ok && d.qiymat.daqiqa === 134);
});

test('mistake form: question number limits per section, skill → domain', () => {
  const asos = { testId: 'a', bolim: 'rw', modul: '2', savol: '27', konikma: 'Transitions', sabab: 'concept', izoh: 'I mixed up contrast words' };
  const n = xatoniTekshir(asos, ['a']);
  assert.ok(n.ok && n.qiymat.domen === 'Expression of Ideas' && n.qiymat.modul === 2);
  assert.ok(!xatoniTekshir({ ...asos, savol: '28' }, ['a']).ok);
  assert.ok(!xatoniTekshir({ ...asos, bolim: 'math', savol: '23', konikma: '' }, ['a']).ok);
  assert.ok(xatoniTekshir({ ...asos, bolim: 'math', savol: '22', konikma: '' }, ['a']).ok);
  const k = xatoniTekshir({ ...asos, konikma: 'Circles', sabab: 'x', testId: 'b' }, ['a']);
  assert.ok(!k.ok);
  if (!k.ok) assert.deepEqual(Object.keys(k.xatolar).sort(), ['konikma', 'sabab', 'testId']);
  assert.equal(domenTop('math', 'Circles'), 'Geometry and Trigonometry');
});

test('stored data is cleaned: bad records and orphan mistakes dropped', () => {
  const o = namunaOmbor('2026-11-11');
  assert.deepEqual(omborniTozala(JSON.parse(JSON.stringify(o))), o);
  assert.deepEqual(omborniTozala(null), { versiya: 1, testlar: [], xatolar: [] });
  const buzuq = { testlar: [...o.testlar, { ...o.testlar[0], id: 'z', rw: 805 }], xatolar: [...o.xatolar, { ...o.xatolar[0], id: 'y', testId: 'yoq' }, { ...o.xatolar[0], id: 'w', savol: 30 }] };
  const t = omborniTozala(buzuq);
  assert.equal(t.testlar.length, o.testlar.length);
  assert.equal(t.xatolar.length, o.xatolar.length);
});

test('sample: 5 real SAT attempts numbered by date', () => {
  const o = namunaOmbor('2026-11-11');
  const u = urinishlar(o.testlar);
  assert.equal(u.size, 5);
  const real = o.testlar.filter((t) => t.turi === 'real').sort((a, b) => a.sana.localeCompare(b.sana));
  assert.deepEqual(real.map((t) => u.get(t.id)), [1, 2, 3, 4, 5]);
  assert.ok(o.testlar.filter((t) => t.turi === 'practice').every((t) => !u.has(t.id)));
});

test('skill stats: unresolved first, then total', () => {
  const x = (konikma: string, hal: boolean, bolim: 'rw' | 'math' = 'math'): RasmiyXato => ({
    id: Math.random().toString(), t: 0, testId: 'a', bolim, modul: 1, savol: 1, konikma, domen: konikma ? domenTop(bolim, konikma) : '', sabab: 'other', izoh: '', hal,
  });
  const s = konikmaStatistikasi([x('Circles', true), x('Circles', true), x('Circles', true), x('Percentages', false), x('', false), x('Transitions', false, 'rw')]);
  assert.deepEqual(s.map((q) => [q.konikma, q.jami, q.halQilinmagan]), [['Percentages', 1, 1], ['Transitions', 1, 1], ['', 1, 1], ['Circles', 3, 0]]);
  assert.deepEqual(konikmaStatistikasi([x('Transitions', false, 'rw'), x('Circles', false)], 'rw').map((q) => q.konikma), ['Transitions']);
});

test('csv: quotes, commas, newlines, formula injection, BOM', () => {
  assert.equal(csvKatak('plain'), 'plain');
  assert.equal(csvKatak('a, "b"'), '"a, ""b"""');
  assert.equal(csvKatak('line\nbreak'), '"line\nbreak"');
  assert.equal(csvKatak('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"');
  assert.equal(csvKatak('+1'), "'+1");
  assert.equal(csvKatak(-5), '-5');
  assert.equal(csvKatak(null), '');
  const t: RasmiyTest = { id: 'a', t: 1, turi: 'real', nomi: 'SAT, March', sana: '2026-03-14', rw: 650, math: 700, daqiqa: null, izoh: '@note' };
  const o: Ombor = { versiya: 1, testlar: [t], xatolar: [{ id: 'm', t: 1, testId: 'a', bolim: 'math', modul: 2, savol: 7, domen: 'Algebra', konikma: 'Linear functions', sabab: 'careless', izoh: 'sign', hal: true }] };
  assert.equal(testlarCsv(o), '﻿type,attempt,name,date,reading_writing,math,total,minutes,notes\r\nReal SAT,1,"SAT, March",2026-03-14,650,700,1350,,\'@note\r\n');
  assert.equal(xatolarCsv(o), '﻿test_name,test_date,section,module,question,domain,skill,reason,note,resolved\r\n"SAT, March",2026-03-14,Math,2,7,Algebra,Linear functions,Careless mistake,sign,yes\r\n');
});

test('chart: points in date order, axis within 400-1600', () => {
  const o = namunaOmbor('2026-11-11');
  const c = chizmaHisobla(o.testlar, { en: 640, boy: 280, chap: 48, ong: 16, tepa: 24, past: 40 });
  assert.equal(c.nuqtalar.length, o.testlar.length);
  for (let i = 1; i < c.nuqtalar.length; i++) {
    assert.ok(c.nuqtalar[i].x > c.nuqtalar[i - 1].x);
    assert.ok(c.nuqtalar[i].sana >= c.nuqtalar[i - 1].sana);
  }
  assert.ok(c.min >= 400 && c.max <= 1600 && c.max - c.min >= 200);
  for (const p of c.nuqtalar) assert.ok(p.y >= 24 && p.y <= 240, `${p.y}`);
  const bitta = chizmaHisobla([o.testlar[0]], { en: 640, boy: 280, chap: 48, ong: 16, tepa: 24, past: 40 });
  assert.equal(bitta.nuqtalar[0].x, 48 + (640 - 64) / 2);
  const chekka = chizmaHisobla([{ ...o.testlar[0], rw: 800, math: 800 }], { en: 640, boy: 280, chap: 48, ong: 16, tepa: 24, past: 40 });
  assert.ok(chekka.max === 1600 && chekka.min === 1400);
});
