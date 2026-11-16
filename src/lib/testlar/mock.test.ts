// Mock imtihon (P30) sof funksiyalari: ball formulasi, vaqt, ekran, navbat, xarita, kredit, natija, xato turi.
// Va SQL dagi ko'nikmalar ro'yxati src/data/satTaksonomiya.ts bilan bir xilligi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  bolimBall, qolganMs, tanaffusTugashi, ekranTuri, modulNomi, mockMahalliyTekshir, bushMockMahalliy, modulgaMosla,
  javoblarniBirlashtir, navbatBolagi, navbatdanOl, mockXarita, mockXaritaYorliq, topshirishOgohi, kreditMatni,
  natijaJadvali, modulVaqtlari, mockXatosi, MOCK_KALIT, type MockModul,
} from '../sat/mock.ts';
import { savolTaksonomiya } from '../../data/satTaksonomiya.ts';

test('bolimBall: 200 + 600 × to\'g\'ri / jami, 10 ga yaxlitlangan', () => {
  assert.equal(bolimBall(0, 54), 200);
  assert.equal(bolimBall(54, 54), 800);
  assert.equal(bolimBall(13, 54), 340); // SQL M06 bilan bir xil
  assert.equal(bolimBall(22, 44), 500);
  assert.equal(bolimBall(60, 54), 800, 'jamidan oshmaydi');
  assert.equal(bolimBall(-1, 54), 200);
  assert.equal(bolimBall(5, 0), 200, 'savolsiz bo\'lim');
  for (let t = 0; t <= 44; t++) assert.equal(bolimBall(t, 44) % 10, 0);
});

test('qolganMs: server soati bo\'yicha, manfiy emas', () => {
  const server = '2026-11-12T10:00:00.000Z';
  const olingan = 1_000_000;
  // mijoz soati serverdan 5 s orqada: farq hisobga olinadi
  assert.equal(qolganMs('2026-11-12T10:32:00.000Z', server, olingan, olingan), 32 * 60_000);
  assert.equal(qolganMs('2026-11-12T10:32:00.000Z', server, olingan, olingan + 60_000), 31 * 60_000);
  assert.equal(qolganMs('2026-11-12T10:00:00.000Z', server, olingan, olingan + 5_000), 0);
  assert.equal(qolganMs(null, server, olingan, olingan), 0);
});

test('tanaffusTugashi: boshlanish + 10 daqiqa', () => {
  const config = { rw_module_ms: 1920000, math_module_ms: 2100000, break_ms: 600000, grace_ms: 30000 };
  assert.equal(tanaffusTugashi({ break_started_at: '2026-11-12T10:00:00.000Z', config }), '2026-11-12T10:10:00.000Z');
  assert.equal(tanaffusTugashi({ break_started_at: null, config }), null);
});

test('ekranTuri va modulNomi', () => {
  assert.equal(ekranTuri({ status: 'active', phase: 'ready' }), 'modul-oldi');
  assert.equal(ekranTuri({ status: 'active', phase: 'module' }), 'modul');
  assert.equal(ekranTuri({ status: 'active', phase: 'break' }), 'tanaffus');
  assert.equal(ekranTuri({ status: 'finished', phase: 'done' }), 'natija');
  assert.equal(ekranTuri({ status: 'abandoned', phase: 'done' }), 'toxtatilgan');
  assert.equal(modulNomi(1), 'Reading and Writing · Module 1');
  assert.equal(modulNomi(2), 'Reading and Writing · Module 2');
  assert.equal(modulNomi(3), 'Math · Module 1');
  assert.equal(modulNomi(4), 'Math · Module 2');
});

test('mockMahalliyTekshir: buzilgan qiymat bo\'sh holat beradi, maydonlar tozalanadi', () => {
  assert.deepEqual(mockMahalliyTekshir(null), bushMockMahalliy());
  assert.deepEqual(mockMahalliyTekshir('{buzuq'), bushMockMahalliy());
  const m = mockMahalliyTekshir(JSON.stringify({
    modul: 3, joriy: 4,
    navbat: { q1: { answer: 'B', flagged: true, time_ms: 12.6 }, q2: { answer: 5, time_ms: -3 }, q3: null },
    ochirilgan: { q1: ['A', 7, 'C'] },
  }));
  assert.equal(m.modul, 3);
  assert.equal(m.joriy, 4);
  assert.deepEqual(m.navbat.q1, { question_id: 'q1', answer: 'B', flagged: true, time_ms: 13 });
  assert.deepEqual(m.navbat.q2, { question_id: 'q2', answer: null, flagged: false, time_ms: 0 });
  assert.equal(m.navbat.q3, undefined);
  assert.deepEqual(m.ochirilgan.q1, ['A', 'C']);
  assert.equal(mockMahalliyTekshir(JSON.stringify({ modul: 9 })).modul, 1);
  assert.equal(MOCK_KALIT('abc'), 'tayanch:sat-mock:v1:abc');
});

test('modulgaMosla: yangi modulda navbat tashlanadi', () => {
  const m = { ...bushMockMahalliy(1), joriy: 5, navbat: { q: { question_id: 'q', answer: 'A', flagged: false, time_ms: 1 } } };
  assert.equal(modulgaMosla(m, 1), m);
  assert.deepEqual(modulgaMosla(m, 2), bushMockMahalliy(2));
});

test('javoblarniBirlashtir: mahalliy navbat server qoralamasidan ustun, vaqt kamaymaydi', () => {
  const m = { ...bushMockMahalliy(1), navbat: { q1: { question_id: 'q1', answer: 'C', flagged: false, time_ms: 10 } } };
  const r = javoblarniBirlashtir([
    { question_id: 'q1', answer: 'A', flagged: true, time_ms: 50 },
    { question_id: 'q2', answer: 'B', flagged: false, time_ms: 5 },
  ], m);
  assert.deepEqual(r.get('q1'), { question_id: 'q1', answer: 'C', flagged: false, time_ms: 50 });
  assert.equal(r.get('q2')?.answer, 'B');
});

test('navbat: bo\'lak 30 tagacha, yuborilgani olinadi, shu orada o\'zgargani qoladi', () => {
  const navbat: Record<string, { question_id: string; answer: string | null; flagged: boolean; time_ms: number }> = {};
  for (let i = 0; i < 35; i++) navbat[`q${i}`] = { question_id: `q${i}`, answer: 'A', flagged: false, time_ms: i };
  const m = { ...bushMockMahalliy(1), navbat };
  const b = navbatBolagi(m);
  assert.equal(b.length, 30);
  const ozgargan = { ...m, navbat: { ...m.navbat, q0: { ...m.navbat.q0, answer: 'D' } } };
  const keyin = navbatdanOl(ozgargan, b);
  assert.deepEqual(Object.keys(keyin.navbat).sort(), ['q0', 'q30', 'q31', 'q32', 'q33', 'q34']);
  assert.equal(keyin.navbat.q0.answer, 'D');
});

test('mockXarita, yorliq va topshirish ogohi', () => {
  const j = new Map([
    ['a', { question_id: 'a', answer: 'A', flagged: false, time_ms: 0 }],
    ['b', { question_id: 'b', answer: null, flagged: true, time_ms: 0 }],
  ]);
  const x = mockXarita([{ id: 'a' }, { id: 'b' }, { id: 'c' }], j, 1);
  assert.deepEqual(x.map((b) => [b.javobli, b.belgilangan, b.joriy]), [[true, false, false], [false, true, true], [false, false, false]]);
  assert.equal(mockXaritaYorliq(x[1]), 'Question 2, not answered, marked for review, current');
  assert.equal(topshirishOgohi(x), "2 questions have no answer and 1 is marked for review. You can't come back to this module after you submit it.");
  assert.equal(topshirishOgohi([x[0]]), "You can't come back to this module after you submit it.");
});

test('kreditMatni: cheklovsiz, sarflangan, tugagan', () => {
  assert.deepEqual(kreditMatni(undefined), { matn: 'No limit on your plan', qoldi: true });
  assert.deepEqual(kreditMatni({ max: null, per: 'day', used: 4, resets_at: '' }), { matn: 'No limit on your plan', qoldi: true });
  assert.deepEqual(kreditMatni({ max: 2, per: 'month', used: 1, resets_at: '' }), { matn: '1 of 2 used this month', qoldi: true });
  assert.deepEqual(kreditMatni({ max: 1, per: 'month', used: 1, resets_at: '' }), { matn: 'None left this month', qoldi: false });
  assert.deepEqual(kreditMatni({ max: 1, per: 'day', used: 3, resets_at: '' }), { matn: 'None left today', qoldi: false });
});

test('natijaJadvali: soha va ko\'nikma bo\'yicha, R&W oldin', () => {
  const r = natijaJadvali([
    { section: 'math', domain: 'Algebra', skill: 'Linear functions', is_correct: true },
    { section: 'rw', domain: 'Craft and Structure', skill: 'Words in Context', is_correct: false },
    { section: 'rw', domain: 'Craft and Structure', skill: 'Words in Context', is_correct: true },
    { section: 'rw', domain: 'Craft and Structure', skill: 'Cross-Text Connections', is_correct: true },
  ]);
  assert.deepEqual(r.sohalar, [
    { section: 'rw', domain: 'Craft and Structure', correct: 2, total: 3 },
    { section: 'math', domain: 'Algebra', correct: 1, total: 1 },
  ]);
  assert.equal(r.konikmalar.length, 3);
  assert.deepEqual(r.konikmalar[0], { section: 'rw', domain: 'Craft and Structure', skill: 'Words in Context', correct: 1, total: 2 });
});

test('modulVaqtlari: faqat topshirilgan modullar', () => {
  const m = (module: number, s: string | null, e: string | null, auto = false): MockModul => ({
    module, section: module <= 2 ? 'rw' : 'math', question_count: 27, time_ms: 1920000,
    started_at: s, deadline_at: null, submitted_at: e, auto_submitted: auto,
  });
  assert.deepEqual(modulVaqtlari([
    m(1, '2026-11-12T10:00:00Z', '2026-11-12T10:20:00Z'),
    m(2, '2026-11-12T10:21:00Z', '2026-11-12T10:53:00Z', true),
    m(3, '2026-11-12T11:05:00Z', null),
    m(4, null, null),
  ]), [{ module: 1, ms: 1_200_000, auto: false }, { module: 2, ms: 1_920_000, auto: true }]);
});

test('mockXatosi: server xato kodlari', () => {
  assert.equal(mockXatosi({ message: 'quota_exceeded' }), 'kvota');
  assert.equal(mockXatosi({ message: 'mock_not_ready' }), 'tayyor-emas');
  assert.equal(mockXatosi({ message: 'mock_in_progress' }), 'ochiq');
  assert.equal(mockXatosi({ message: 'mock_not_found' }), 'topilmadi');
  assert.equal(mockXatosi({ message: 'mock_form_unavailable' }), 'forma');
  assert.equal(mockXatosi({ message: 'mock_not_finished' }), 'tugamagan');
  assert.equal(mockXatosi({ message: 'x', code: '42501' }), 'kirish');
  assert.equal(mockXatosi(new TypeError('Failed to fetch')), 'tarmoq');
  assert.equal(mockXatosi({ message: 'boshqa' }), 'boshqa');
});

test('SQL ko\'nikmalar ro\'yxati satTaksonomiya.ts bilan bir xil, blueprint 27/22', () => {
  const sql = readFileSync(new URL('../../../supabase/migrations/20261113012418_mock_imtihon.sql', import.meta.url), 'utf8');
  const skillBlok = sql.slice(sql.indexOf('function private.mock_skills()'), sql.indexOf('function private.mock_section('));
  const sqlSkill = [...skillBlok.matchAll(/\('(rw|math)', '([^']+)', '([^']+)'\)/g)].map((m) => `${m[1]}|${m[2]}|${m[3]}`).sort();
  const tsSkill = Object.entries(savolTaksonomiya).flatMap(([b, d]) => Object.entries(d).flatMap(([dom, sk]) => sk.map((s) => `${b}|${dom}|${s}`))).sort();
  assert.deepEqual(sqlSkill, tsSkill);
  const bpBlok = sql.slice(sql.indexOf('function private.mock_blueprint()'), sql.indexOf('function private.mock_skills()'));
  const bp = [...bpBlok.matchAll(/\('(rw|math)', '([^']+)', (\d+), \d+\)/g)];
  const jami = (b: string) => bp.filter((m) => m[1] === b).reduce((s, m) => s + Number(m[3]), 0);
  assert.equal(jami('rw'), 27);
  assert.equal(jami('math'), 22);
  assert.deepEqual(bp.map((m) => `${m[1]}|${m[2]}`).sort(), Object.entries(savolTaksonomiya).flatMap(([b, d]) => Object.keys(d).map((dom) => `${b}|${dom}`)).sort());
});
