// Mashq sessiyasi (P08) sof funksiyalari: mahalliy holat, taymer, xarita, navbat, xato turi, natija.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mahalliyniTekshir, bushMahalliy, qolganMs, chegaraOtildi, vaqtMatni, davomiylikMatni, xarita, xaritaYorliq,
  navbatgaQosh, keyingiUrinishMs, sessiyaXatosi, idTogrimi, hisobot, togriMatn, komponentSavoli, sababTogrimi,
  type ServerSavol, type ServerNatija,
} from '../sat/sessiya.ts';

const q = (id: string, section: 'rw' | 'math', skill: string): ServerSavol => ({
  id, position: 1, section, domain: 'D', skill, format: 'mcq', stem: 'S', options: [{ key: 'A', text: 'a' }, { key: 'B', text: 'b' }],
});
const r = (id: string, ok: boolean, t: number | null = 1000): ServerNatija => ({
  question_id: id, answer: 'A', is_correct: ok, correct: 'B', explanation: 'E', time_ms: t,
});

test('mahalliyniTekshir: buzilgan JSON va noto\'g\'ri maydonlar bo\'sh holatga tushadi', () => {
  assert.deepEqual(mahalliyniTekshir(null), bushMahalliy());
  assert.deepEqual(mahalliyniTekshir('{buzuq'), bushMahalliy());
  assert.deepEqual(mahalliyniTekshir('"satr"'), bushMahalliy());
  const m = mahalliyniTekshir(JSON.stringify({
    joriy: 3, belgilar: ['a', 5], otkazilgan: ['b'], vaqt: { a: 1200.4, b: -5, c: 'x' },
    qoralama: { a: 'B', b: 'x'.repeat(101) }, navbat: [{ qid: 'a', javob: 'B', timeMs: 10 }, { qid: 1 }], yakunlanmoqda: true,
  }));
  assert.equal(m.joriy, 3);
  assert.deepEqual(m.belgilar, ['a']);
  assert.deepEqual(m.vaqt, { a: 1200 });
  assert.deepEqual(m.qoralama, { a: 'B' });
  assert.deepEqual(m.navbat, [{ qid: 'a', javob: 'B', timeMs: 10, urinish: 0 }]);
  assert.equal(m.yakunlanmoqda, true);
  assert.equal(mahalliyniTekshir('{"joriy": -1}').joriy, 0);
});

test('qolganMs: server started_at dan, soat farqi hisobga olinadi', () => {
  const o = { startedAt: '2026-11-10T10:00:00Z', limitMs: 600_000, serverNow: '2026-11-10T10:02:00Z', soatOlingan: Date.parse('2026-11-10T10:01:00Z') };
  // Mijoz soati 1 daqiqa orqada: mijozda 10:01 bo'lganda serverda 10:02, ya'ni 8 daqiqa qolgan
  assert.equal(qolganMs(o, Date.parse('2026-11-10T10:01:00Z')), 480_000);
  assert.equal(qolganMs(o, Date.parse('2026-11-10T10:20:00Z')), 0);
});

test('chegaraOtildi: faqat 5 daqiqa, 1 daqiqa va 0 chegaralarida', () => {
  assert.equal(chegaraOtildi(301_000, 300_000), 'besh');
  assert.equal(chegaraOtildi(300_000, 299_000), null);
  assert.equal(chegaraOtildi(61_000, 60_000), 'bir');
  assert.equal(chegaraOtildi(1000, 0), 'tugadi');
  assert.equal(chegaraOtildi(0, 0), null);
  assert.equal(chegaraOtildi(500_000, 499_000), null);
  // Sahifa 30 s qolganda ochildi: faqat eng so'nggi chegara
  assert.equal(chegaraOtildi(null, 30_000), 'bir');
  assert.equal(chegaraOtildi(null, 0), 'tugadi');
  assert.equal(chegaraOtildi(null, 900_000), null);
});

test('vaqtMatni va davomiylikMatni', () => {
  assert.equal(vaqtMatni(754_000), '12:34');
  assert.equal(vaqtMatni(3_725_000), '1:02:05');
  assert.equal(vaqtMatni(400), '0:01');
  assert.equal(vaqtMatni(0), '0:00');
  assert.equal(davomiylikMatni(725_000), '12 min 5 s');
  assert.equal(davomiylikMatni(45_000), '45 s');
  assert.equal(davomiylikMatni(120_000), '2 min');
  assert.equal(davomiylikMatni(3_720_000), '1 h 2 min');
});

test('xarita: answered, pending, skipped, belgilangan; taymerli qoralama = answered', () => {
  const sav = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
  const m = { ...bushMahalliy(), joriy: 1, belgilar: ['c'], otkazilgan: ['c', 'd'], qoralama: { d: 'A' },
    navbat: [{ qid: 'b', javob: 'A', timeMs: 0, urinish: 1 }] };
  const x = xarita(sav, m, new Set(['a']), false);
  assert.deepEqual(x.map((b) => b.holat), ['answered', 'pending', 'skipped', 'skipped']);
  assert.equal(x[1].joriy, true);
  assert.equal(x[2].belgilangan, true);
  assert.equal(xarita(sav, m, new Set(), true)[3].holat, 'answered');
  assert.equal(xaritaYorliq(x[2]), 'Question 3, skipped, marked for review');
  assert.equal(xaritaYorliq(x[1]), 'Question 2, saving, current');
});

test('navbatgaQosh: bir savol navbatda bir marta', () => {
  let n = navbatgaQosh([], { qid: 'a', javob: 'A', timeMs: 1 });
  n = navbatgaQosh(n, { qid: 'b', javob: 'B', timeMs: 2 });
  n = navbatgaQosh(n, { qid: 'a', javob: 'C', timeMs: 3 });
  assert.deepEqual(n.map((b) => `${b.qid}${b.javob}`), ['bB', 'aC']);
  assert.deepEqual([0, 1, 2, 3, 4, 5, 9].map(keyingiUrinishMs), [1000, 2000, 4000, 8000, 16000, 30000, 30000]);
});

test('sessiyaXatosi', () => {
  assert.equal(sessiyaXatosi(new TypeError('Failed to fetch')), 'tarmoq');
  assert.equal(sessiyaXatosi({ message: 'quota_exceeded' }), 'kvota');
  assert.equal(sessiyaXatosi({ message: 'session_finished' }), 'yakunlangan');
  assert.equal(sessiyaXatosi({ message: 'session_not_found' }), 'topilmadi');
  assert.equal(sessiyaXatosi({ message: 'question_unavailable' }), 'savol');
  assert.equal(sessiyaXatosi({ message: 'not_authenticated', code: '42501' }), 'kirish');
  assert.equal(sessiyaXatosi({ message: 'boom' }), 'boshqa');
});

test('idTogrimi: faqat UUID', () => {
  assert.equal(idTogrimi('00000000-0000-4000-8000-00000000c0de'), true);
  assert.equal(idTogrimi('abc'), false);
  assert.equal(idTogrimi(null), false);
  assert.equal(idTogrimi('00000000-0000-4000-8000-00000000c0de<script>'), false);
});

test('hisobot: foiz hamma savollar bo\'yicha, ko\'nikma taqsimoti, xato va o\'tkazilganlar', () => {
  const questions = [q('a', 'math', 'Linear'), q('b', 'math', 'Linear'), q('c', 'rw', 'Words'), q('d', 'rw', 'Words')];
  const h = hisobot({ questions, results: [r('a', true, 2000), r('b', false, null), r('c', true, 500)] }, { b: 700, d: 300 });
  assert.equal(h.jami, 4);
  assert.equal(h.togri, 2);
  assert.equal(h.foiz, 50);
  assert.equal(h.vaqtMs, 2000 + 700 + 500 + 300);
  assert.deepEqual(h.skilllar.map((s) => `${s.section}:${s.skill}:${s.togri}/${s.jami}`), ['rw:Words:1/2', 'math:Linear:1/2']);
  assert.deepEqual(h.xatolar.map((b) => b.raqam), [2]);
  assert.deepEqual(h.otkazilgan.map((b) => b.raqam), [4]);
  assert.equal(hisobot({ questions: [], results: [] }).foiz, 0);
});

test('togriMatn, komponentSavoli, sababTogrimi', () => {
  assert.equal(togriMatn('B'), 'B');
  assert.equal(togriMatn(['1/2', '0.5']), '1/2');
  assert.equal(togriMatn(null), '');
  const s = komponentSavoli({ ...q('a', 'math', 'X'), figure: { path: 'p.png', alt: 'Alt' } }, 'https://x/p.png');
  assert.deepEqual(s.figure, { src: 'https://x/p.png', alt: 'Alt', caption: undefined });
  assert.equal(sababTogrimi('misread'), true);
  assert.equal(sababTogrimi('lazy'), false);
});
