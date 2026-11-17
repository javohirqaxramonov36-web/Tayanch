// IELTS Reading engine: scoring, band conversion, gap-fill normalisation, timer restore,
// auto-submit on time-out, random selection, repository, tab lock, schema validation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { xotiraOmbori, type Ombor } from '../../../navigator/ombor.ts';
import { BAND_JADVALI } from '../../../../data/ielts/bandJadvali.ts';
import { baholash, engZaifTur } from '../ball.ts';
import { bandMatn, bandTop, jadvalXatolari } from '../band.ts';
import { boshliqTogri, normalMatn } from '../normallash.ts';
import { FAOL_KALIT, URINISHLAR_KALIT, urinishOmbori } from '../ombor.ts';
import { QULF_ESKIRADI_MS, QULF_KALIT, qulfBoshat, qulfEgasi, qulfOl } from '../qulf.ts';
import { tekshirTest, type ReadingTest, type Savol } from '../sxema.ts';
import { tanlaTest } from '../tanlash.ts';
import { elonDaqiqa, qolganMs, vaqtMatn, vaqtTugadi } from '../taymer.ts';
import { savolTuri } from '../turlar/registr.ts';
import { avtoYakunKerak, tavsiyaTanla, yakunla, yangiUrinish } from '../urinish.ts';

const fixture = JSON.parse(
  readFileSync(new URL('../../../../../tests/fixtures/ielts/reading-fixture.json', import.meta.url), 'utf8'),
) as ReadingTest;
const nusxa = () => JSON.parse(JSON.stringify(fixture)) as ReadingTest;
const TOGRI = { '1': 'FALSE', '2': 'ii', '3': ['A', 'C'], '5': 'forty' };

// ---------- Schema ----------
test('fixture is a valid test for its own question count', () => {
  assert.deepEqual(tekshirTest(fixture, { jamiSavol: 5 }), []);
});

test('a real test must have exactly 40 numbers', () => {
  assert.ok(tekshirTest(fixture).some((x) => x.includes('expected 40')));
});

test('validator reports duplicate and missing numbers', () => {
  const t = nusxa();
  t.passages[0].groups[1].questions[0].number = 1;
  const xato = tekshirTest(t, { jamiSavol: 5 });
  assert.ok(xato.some((x) => x.includes('1 is used more than once')));
  assert.ok(xato.some((x) => x.includes('2 is missing')));
});

test('validator checks answers, evidence and word limits', () => {
  const t = nusxa();
  const [tf, mh, mc, gap] = t.passages[0].groups;
  tf.questions[0].answer = 'MAYBE';
  mh.questions[0].answer = 'ix';
  mc.questions[0].answer = ['A', 'Z'];
  gap.questions[0].acceptedAnswers = ['forty whole minutes'];
  gap.questions[0].evidence = { paragraph: 'Z', quote: 'x' };
  const xato = tekshirTest(t, { jamiSavol: 5 }).join('\n');
  assert.match(xato, /Q1: answer must be one of TRUE/);
  assert.match(xato, /Q2: answer must be one of the heading ids/);
  assert.match(xato, /Q3-4: answer must list two different option ids/);
  assert.match(xato, /Q5: accepted answer "forty whole minutes" is longer than wordLimit 1/);
  assert.match(xato, /Q5: evidence.paragraph "Z" does not exist/);
});

test('validator rejects duplicate paragraph labels and quotes that are not in the text', () => {
  const t = nusxa();
  t.passages[0].paragraphs[1].label = 'A';
  t.passages[0].groups[0].questions[0].evidence.quote = 'this sentence is not in the passage';
  const xato = tekshirTest(t, { jamiSavol: 5 }).join('\n');
  assert.match(xato, /duplicate label "A"/);
  assert.match(xato, /Q1: evidence.quote is not found verbatim/);
});

test('missing explanation is an error', () => {
  const t = nusxa();
  t.passages[0].groups[0].questions[0].explanation = ' ';
  assert.ok(tekshirTest(t, { jamiSavol: 5 }).some((x) => x === 'Q1: explanation is required'));
});

// ---------- Scoring ----------
test('all correct answers earn every point', () => {
  const b = baholash(fixture, TOGRI);
  assert.equal(b.raw, 5);
  assert.equal(b.jami, 5);
  assert.equal(b.javobsiz, 0);
  assert.deepEqual(b.perTypeStats, {
    tfng: { togri: 1, jami: 1 }, 'matching-headings': { togri: 1, jami: 1 }, mcq: { togri: 2, jami: 2 }, 'gap-fill': { togri: 1, jami: 1 },
  });
});

test('no answers: zero points, everything unanswered', () => {
  const b = baholash(fixture, {});
  assert.equal(b.raw, 0);
  assert.equal(b.javobsiz, 5);
  assert.deepEqual(b.qatorlar.map((q) => q.number), [1, 2, 3, 4, 5]);
});

test('"Choose TWO": each correct letter is one point, order does not matter', () => {
  assert.equal(baholash(fixture, { '3': ['C', 'A'] }).raw, 2);
  const bitta = baholash(fixture, { '3': ['C', 'B'] });
  assert.equal(bitta.raw, 1);
  const [q3, q4] = bitta.qatorlar.filter((q) => q.kalit === '3');
  assert.deepEqual([q3.togri, q4.togri], [false, true]);
  assert.match(q3.sizning, /^B\./);
  assert.match(q4.sizning, /^C\./);
  assert.equal(baholash(fixture, { '3': ['B', 'D'] }).raw, 0);
  // Only one option chosen: one number counts as answered.
  const yarim = baholash(fixture, { '3': ['A'] });
  assert.equal(yarim.raw, 1);
  assert.equal(yarim.javobsiz, 4);
});

test('corrupted stored answers never earn points', () => {
  const b = baholash(fixture, { '1': ['FALSE'], '2': 'zz', '3': 'A', '5': 5 } as never);
  assert.equal(b.raw, 0);
});

test('"Choose TWO" keeps at most two options', () => {
  const s = fixture.passages[0].groups[2].questions[0];
  const g = fixture.passages[0].groups[2];
  assert.deepEqual(savolTuri('mcq').normalize(['A', 'B', 'C'], s, g), ['A', 'B']);
});

test('weakest type', () => {
  assert.deepEqual(engZaifTur({ tfng: { togri: 2, jami: 8 }, mcq: { togri: 5, jami: 6 } }), { type: 'tfng', ulush: 0.25 });
  assert.equal(engZaifTur({}), null);
});

// ---------- Band ----------
test('band table covers 0..40 exactly once', () => {
  assert.deepEqual(jadvalXatolari(BAND_JADVALI), []);
});

test('band conversion at every boundary', () => {
  const kutilgan: [number, number | null][] = [
    [40, 9], [39, 9], [38, 8.5], [37, 8.5], [36, 8], [35, 8], [34, 7.5], [33, 7.5], [32, 7], [30, 7], [29, 6.5], [27, 6.5],
    [26, 6], [23, 6], [22, 5.5], [19, 5.5], [18, 5], [15, 5], [14, 4.5], [13, 4.5], [12, 4], [10, 4], [9, 3.5], [8, 3.5],
    [7, 3], [6, 3], [5, 2.5], [4, 2.5], [3, null], [0, null],
  ];
  for (const [raw, band] of kutilgan) assert.equal(bandTop(raw), band, `raw ${raw}`);
});

test('band text', () => {
  assert.equal(bandMatn(7, 'past'), '7.0');
  assert.equal(bandMatn(6.5, 'past'), '6.5');
  assert.equal(bandMatn(null, '2.0 dan past'), '2.0 dan past');
});

// ---------- Gap-fill ----------
const gap = (ustama: Partial<Savol> = {}): Savol => ({
  number: 1, prompt: 'x', wordLimit: 2, answer: 'solar power', acceptedAnswers: ['solar energy'], explanation: 'x',
  evidence: { paragraph: 'A', quote: 'x' }, ...ustama,
});

test('gap-fill ignores case and extra spaces', () => {
  assert.equal(normalMatn('  Solar   POWER '), 'solar power');
  assert.ok(boshliqTogri('  Solar   POWER ', gap()));
  assert.ok(boshliqTogri('solar energy', gap()));
});

test('gap-fill: wrong word, empty answer', () => {
  assert.equal(boshliqTogri('wind power', gap()), false);
  assert.equal(boshliqTogri('   ', gap()), false);
});

test('gap-fill: more words than wordLimit is wrong even when the answer is inside', () => {
  assert.equal(boshliqTogri('the solar power', gap()), false);
  assert.equal(boshliqTogri('solar power', gap({ wordLimit: 1, answer: 'solar' })), false);
});

test('gap-fill: curly apostrophes and dashes are unified', () => {
  assert.ok(boshliqTogri('farmer’s co–op', gap({ answer: "farmer's co-op", acceptedAnswers: [] })));
});

// ---------- Timer ----------
test('remaining time comes from the deadline, not from tick counts', () => {
  const boshlangan = Date.parse('2026-11-10T10:00:00Z');
  const u = yangiUrinish({ testId: 't', durationMinutes: 60 }, boshlangan, 'id-1');
  assert.equal(u.deadline, boshlangan + 3_600_000);
  // Page closed for 25 minutes and reopened: the clock continues from the stored deadline.
  assert.equal(qolganMs(u.deadline, boshlangan + 25 * 60_000), 35 * 60_000);
  assert.equal(vaqtMatn(qolganMs(u.deadline, boshlangan + 25 * 60_000)), '35:00');
  assert.equal(qolganMs(u.deadline, boshlangan + 2 * 3_600_000), 0);
});

test('clock text rounds seconds up', () => {
  assert.equal(vaqtMatn(3_600_000), '60:00');
  assert.equal(vaqtMatn(59_001), '01:00');
  assert.equal(vaqtMatn(999), '00:01');
  assert.equal(vaqtMatn(0), '00:00');
});

test('announcements only at 10, 5 and 1 minutes left', () => {
  const m = 60_000;
  assert.equal(elonDaqiqa(null, 10 * m), null);
  assert.equal(elonDaqiqa(10 * m + 500, 10 * m), 10);
  assert.equal(elonDaqiqa(10 * m, 10 * m - 500), null);
  assert.equal(elonDaqiqa(5 * m + 1, 5 * m - 1), 5);
  assert.equal(elonDaqiqa(m + 200, m - 50), 1);
  assert.equal(elonDaqiqa(30 * m, 29 * m), null);
  // A sleeping tab can jump over several marks: only the latest one is announced.
  assert.equal(elonDaqiqa(12 * m, 4 * m), 5);
  assert.equal(elonDaqiqa(500, 0), null);
});

// ---------- Auto-submit ----------
test('attempt restored after the deadline is submitted with the saved answers', () => {
  const o = urinishOmbori(xotiraOmbori());
  const boshlangan = Date.parse('2026-11-10T10:00:00Z');
  const faol = { ...yangiUrinish(fixture, boshlangan, 'id-2'), answers: { '1': 'FALSE', '5': ' FORTY ' } };
  o.saqlaFaol(faol);

  const keyin = boshlangan + 3 * 3_600_000;
  const tiklangan = o.faol()!;
  assert.deepEqual(tiklangan.answers, faol.answers);
  assert.equal(vaqtTugadi(tiklangan.deadline, keyin), true);
  assert.equal(avtoYakunKerak(tiklangan, keyin), true);
  assert.equal(avtoYakunKerak(tiklangan, boshlangan + 60_000), false);

  const { urinish } = yakunla(tiklangan, fixture, keyin);
  assert.equal(urinish.raw, 2);
  assert.equal(urinish.finishedAt, new Date(tiklangan.deadline).toISOString());
  assert.equal(urinish.syncedAt, null);
  assert.deepEqual(Object.keys(urinish).sort(), [
    'answers', 'band', 'finishedAt', 'id', 'perTypeStats', 'raw', 'schemaVersion', 'startedAt', 'syncedAt', 'testId',
  ]);
});

test('manual submit before the deadline is stamped with the current time', () => {
  const boshlangan = Date.parse('2026-11-10T10:00:00Z');
  const { urinish } = yakunla(yangiUrinish(fixture, boshlangan, 'id-3'), fixture, boshlangan + 10 * 60_000);
  assert.equal(urinish.finishedAt, '2026-11-10T10:10:00.000Z');
});

// ---------- Random selection ----------
test('the last finished test is never picked when there is another one', () => {
  for (const r of [0, 0.3, 0.6, 0.999]) {
    assert.notEqual(tanlaTest(['a', 'b', 'c'], 'b', () => r), 'b');
  }
  assert.equal(tanlaTest(['a', 'b'], 'a', () => 0), 'b');
});

test('with a single test it repeats; with none there is nothing to pick', () => {
  assert.equal(tanlaTest(['a'], 'a'), 'a');
  assert.equal(tanlaTest([], null), null);
  assert.equal(tanlaTest(['a', 'b'], null, () => 0.99), 'b');
  assert.equal(tanlaTest(['a', 'b'], null, () => 1), 'b');
});

// ---------- Repository ----------
test('history keeps attempts in order and replaces the same id', () => {
  const o = urinishOmbori(xotiraOmbori());
  const b = Date.parse('2026-11-10T10:00:00Z');
  const u1 = yakunla(yangiUrinish(fixture, b, 'a'), fixture, b + 1000).urinish;
  const u2 = yakunla({ ...yangiUrinish(fixture, b, 'b'), answers: TOGRI }, fixture, b + 2000).urinish;
  o.qoshUrinish(u1);
  o.qoshUrinish(u2);
  o.qoshUrinish(u1);
  assert.deepEqual(o.urinishlar().map((x) => x.id), ['b', 'a']);
  assert.equal(o.topUrinish('b')!.raw, 5);
  assert.equal(o.topUrinish('yoq'), null);
});

test('corrupted storage is dropped, not thrown', () => {
  const xom = xotiraOmbori();
  xom.yoz(FAOL_KALIT, '{"v":1,');
  xom.yoz(URINISHLAR_KALIT, '[{"id":1},"x"]');
  const o = urinishOmbori(xom);
  assert.equal(o.faol(), null);
  assert.deepEqual(o.urinishlar(), []);
  assert.equal(xom.oqi(FAOL_KALIT), null);
});

test('a failed or memory-only write is reported so the screen can warn the user', () => {
  const tola: Ombor = { ...xotiraOmbori(), doimiy: true, yoz: () => false };
  assert.equal(urinishOmbori(tola).saqlaFaol(yangiUrinish(fixture, 0, 'x')), false);
  const xotira = urinishOmbori(xotiraOmbori());
  assert.equal(xotira.doimiy, false);
  assert.equal(xotira.saqlaFaol(yangiUrinish(fixture, 0, 'x')), false);
  // The attempt is still readable from memory: the test continues.
  assert.equal(xotira.faol()!.id, 'x');
});

// ---------- Tab lock ----------
test('tab lock: free, mine, other tab, stale', () => {
  const o = xotiraOmbori();
  assert.equal(qulfEgasi(o.oqi(QULF_KALIT), 't1', 1000), 'bosh');
  qulfOl(o, 't1', 1000);
  assert.equal(qulfEgasi(o.oqi(QULF_KALIT), 't1', 1500), 'meniki');
  assert.equal(qulfEgasi(o.oqi(QULF_KALIT), 't2', 1500), 'boshqa');
  assert.equal(qulfEgasi(o.oqi(QULF_KALIT), 't2', 1001 + QULF_ESKIRADI_MS), 'bosh');
  qulfBoshat(o, 't2', 1500);
  assert.notEqual(o.oqi(QULF_KALIT), null);
  qulfBoshat(o, 't1', 1500);
  assert.equal(o.oqi(QULF_KALIT), null);
  assert.equal(qulfEgasi('not json', 't1', 0), 'bosh');
});

// ---------- Next step ----------
test('next step: weakest type under 60% gets its lesson, otherwise a new test', () => {
  assert.equal(tavsiyaTanla({ tfng: { togri: 4, jami: 8 }, mcq: { togri: 5, jami: 6 } }).manzil, '/uz/ielts/qollanma/reading/tfng/');
  assert.equal(tavsiyaTanla({ 'matching-headings': { togri: 1, jami: 6 } }).manzil, '/uz/ielts/qollanma/reading/sarlavhalar/');
  assert.equal(tavsiyaTanla({ 'gap-fill': { togri: 0, jami: 4 }, tfng: { togri: 8, jami: 8 } }).manzil, '/uz/ielts/qollanma/reading/');
  assert.equal(tavsiyaTanla({ tfng: { togri: 6, jami: 10 }, mcq: { togri: 9, jami: 10 } }).manzil, '/uz/ielts/mashq/reading/');
});
