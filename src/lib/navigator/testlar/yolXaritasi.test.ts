// Roadmap rules: table integrity, step counts, multi-goal split, readiness.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { navigatorSahifalar, MAQSADLAR } from '../../../data/navigatorSahifalar.ts';
import { qoidalar, UMUMIY_REJA, QADAMLAR_SONI, type Surat, type KunlikDaqiqa } from '../../../data/yolXaritasiQoidalar.ts';
import { yolXaritasiTuz, nomalumIdlar, qoidaQadamlari, tayyorlikniBelgila, faylManzili } from '../yolXaritasi.ts';
import type { YolProfil } from '../profil.ts';

const hammaTayyor = tayyorlikniBelgila(navigatorSahifalar, new Set(navigatorSahifalar.map((s) => s.manzil!).filter(Boolean)));
const opts = { qoidalar, sahifalar: hammaTayyor, umumiyReja: UMUMIY_REJA };
const p = (o: Partial<YolProfil>): YolProfil => ({
  v: 1, goals: ['sat'], primaryGoal: 'sat', timeLeft: '1m', examDate: null, dailyMinutes: 30, skipped: false,
  updatedAt: '2026-11-09T00:00:00.000Z', ...o,
});
const SURATLAR: Surat[] = ['intensiv', 'oy', 'uzoq', 'umumiy'];
const KUNLIKLAR: KunlikDaqiqa[] = [15, 30, 60, 120];

test('every rule and default-plan ID exists in the registry', () => {
  assert.deepEqual(nomalumIdlar(qoidalar, UMUMIY_REJA, navigatorSahifalar), []);
});

test('registry IDs are unique', () => {
  const ids = navigatorSahifalar.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every goal x pace x daily combination has a rule with enough steps', () => {
  for (const m of MAQSADLAR) for (const s of SURATLAR) for (const k of KUNLIKLAR) {
    const ids = qoidaQadamlari(qoidalar, m, s, k);
    assert.ok(ids.length >= 3, `${m}/${s}/${k}`);
  }
});

test('exact daily row wins over "*" row', () => {
  assert.deepEqual(qoidaQadamlari(qoidalar, 'ielts', 'intensiv', 15), ['ielts-tfng', 'ielts-sarlavhalar', 'ielts-reading']);
  assert.equal(qoidaQadamlari(qoidalar, 'ielts', 'intensiv', 60).length, 5);
});

test('single goal: step count follows daily minutes (3-5)', () => {
  for (const k of KUNLIKLAR) {
    const q = yolXaritasiTuz(p({ dailyMinutes: k }), 'oy', opts);
    assert.equal(q.length, QADAMLAR_SONI[k], String(k));
  }
});

test('intensive pace uses intensive steps', () => {
  const q = yolXaritasiTuz(p({ dailyMinutes: 60 }), 'intensiv', opts);
  assert.deepEqual(q.map((x) => x.id), ['sat-test', 'sat-natijalar', 'sat-takrorlash', 'sat-strategiya']);
});

test('multiple goals: primary gets the majority, others one each', () => {
  const q = yolXaritasiTuz(p({ goals: ['sat', 'ielts', 'top-admission'], primaryGoal: 'ielts', dailyMinutes: 120 }), 'oy', opts);
  assert.equal(q.length, 5);
  assert.equal(q.filter((x) => x.maqsad === 'ielts').length, 3);
  assert.equal(q[0].maqsad, 'ielts');
  assert.equal(q.filter((x) => x.maqsad === 'sat').length, 1);
});

test('four goals: primary keeps at least 2 steps, no duplicates', () => {
  const q = yolXaritasiTuz(p({ goals: [...MAQSADLAR], primaryGoal: 'eyuf', dailyMinutes: 15 }), 'intensiv', opts);
  const ids = q.map((x) => x.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(q.filter((x) => x.maqsad === 'eyuf' || x.id.startsWith('umumiy')).length >= 2);
  assert.ok(q.length >= 3 && q.length <= 5);
});

test('skipped or unknown -> default starter plan', () => {
  assert.deepEqual(yolXaritasiTuz(p({ skipped: true }), 'umumiy', opts).map((x) => x.id), UMUMIY_REJA);
});

test('pages without a file or flagged "coming soon" are not linked', () => {
  const sahifalar = tayyorlikniBelgila(navigatorSahifalar, new Set(['/uz/sat/mashq/test/', '/uz/eyuf/']));
  const q = yolXaritasiTuz(p({ dailyMinutes: 60 }), 'intensiv', { ...opts, sahifalar });
  const test1 = q.find((x) => x.id === 'sat-test')!;
  const strategiya = q.find((x) => x.id === 'sat-strategiya')!;
  assert.equal(test1.tayyor, true);
  assert.equal(test1.manzil, '/uz/sat/mashq/test/');
  assert.equal(strategiya.tayyor, false);
  assert.equal(strategiya.manzil, null);
  assert.equal(sahifalar.find((s) => s.id === 'eyuf-kirish')!.tayyor, false);
  assert.equal(sahifalar.find((s) => s.id === 'ielts-listening')!.tayyor, false);
});

test('page file path -> route', () => {
  assert.equal(faylManzili('/src/pages/uz/sat/mashq/test/index.astro'), '/uz/sat/mashq/test/');
  assert.equal(faylManzili('/src/pages/uz/index.astro'), '/uz/');
  assert.equal(faylManzili('/src/pages/uz/sat/[...qism].astro'), null);
});
