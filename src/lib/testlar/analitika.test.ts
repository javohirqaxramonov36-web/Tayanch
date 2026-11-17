// Analitika paneli sof funksiyalari (P14): holat chegaralari, tavsiya, faollik xaritasi, yozuv.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  holat, foiz, tavsiyalar, bolimJadvali, faollikXaritasi, xulosaOqi, soniyaYozuv, davomYozuv, sanaYozuv, type SkillQator,
} from '../sat/analitika.ts';
import { tarifBayrogimi } from '../../data/satAnalitika.ts';

const q = (skill: string, correct: number, attempts: number, section = 'math'): SkillQator => ({ section, domain: 'Algebra', skill, attempts, correct });

test('status: thresholds 85 and 60, minimum 5 attempts', () => {
  assert.equal(holat(0, 0), 'none');
  assert.equal(holat(4, 4), 'low-data');
  assert.equal(holat(5, 5), 'strong');
  assert.equal(holat(17, 20), 'strong'); // 85%
  assert.equal(holat(11, 13), 'developing'); // 84.6%: rounds to 85 but is below the threshold
  assert.equal(holat(3, 5), 'developing'); // 60%
  assert.equal(holat(59, 100), 'needs-work');
  assert.equal(foiz(0, 0), null);
  assert.equal(foiz(11, 13), 85);
});

test('skills to practice: lowest accuracy first, at most 6, no low-data or strong skills', () => {
  const r = tavsiyalar([
    q('a', 1, 4), q('b', 9, 10), q('c', 2, 10), q('d', 6, 10), q('e', 0, 5), q('f', 5, 10), q('g', 7, 10), q('h', 8, 10), q('i', 3, 10),
  ]);
  assert.deepEqual(r.map((x) => x.skill), ['e', 'c', 'i', 'f', 'd', 'g']);
  assert.deepEqual(tavsiyalar([q('a', 1, 4), q('b', 10, 10)]), []);
});

test('section table: every taxonomy skill is listed, unknown skills are appended', () => {
  const g = bolimJadvali([q('Linear functions', 3, 5), q('Brand new skill', 1, 1), q('Transitions', 1, 1, 'rw')], 'math');
  const hammasi = g.flatMap((x) => x.skills);
  assert.equal(hammasi.find((s) => s.skill === 'Linear functions')?.holat, 'developing');
  assert.equal(hammasi.find((s) => s.skill === 'Circles')?.holat, 'none');
  assert.equal(g.find((x) => x.domain === 'Algebra')?.skills.at(-1)?.skill, 'Brand new skill');
  assert.ok(!hammasi.some((s) => s.skill === 'Transitions'));
});

test('activity map: 90 days ending today, Monday rows, levels relative to the busiest day', () => {
  // 2026-11-11 is a Wednesday
  const x = faollikXaritasi([{ date: '2026-11-11', attempts: 8 }, { date: '2026-11-09', attempts: 1 }, { date: '2026-01-01', attempts: 50 }], '2026-11-11');
  assert.equal(x.kataklar.length, 90);
  assert.equal(x.kataklar[0].date, '2026-08-14');
  assert.equal(x.eng, 8);
  const bugun = x.kataklar.at(-1)!;
  assert.deepEqual([bugun.date, bugun.qator, bugun.daraja], ['2026-11-11', 2, 4]);
  assert.deepEqual([x.kataklar.at(-3)!.qator, x.kataklar.at(-3)!.daraja], [0, 1]);
  assert.equal(x.kataklar.at(-2)!.daraja, 0);
  assert.equal(x.ustunlar, bugun.ustun + 1);
  assert.equal(faollikXaritasi([], '2026-11-11').eng, 0);
});

test('summary parsing: rejects wrong shapes, drops difficulty unless extended', () => {
  assert.equal(xulosaOqi(null), null);
  assert.equal(xulosaOqi({ totals: {} }), null);
  const x = xulosaOqi({ today: '2026-11-11', totals: { attempts: 3, correct: '2' }, skills: [{ skill: 'A', section: 'math', attempts: 3, correct: 2 }, { nope: 1 }], difficulty: [{ band: 'easy', attempts: 1 }] })!;
  assert.equal(x.totals.attempts, 3);
  assert.equal(x.totals.correct, 0);
  assert.equal(x.skills.length, 1);
  assert.equal(x.difficulty, null);
  assert.equal(x.tz, 'Asia/Tashkent');
});

test('text: seconds, durations, dates, plan flag keys', () => {
  assert.equal(soniyaYozuv(48400), '48 s');
  assert.equal(soniyaYozuv(72000), '1 min 12 s');
  assert.equal(davomYozuv(0), '0 min');
  assert.equal(davomYozuv(20000), 'under 1 min');
  assert.equal(davomYozuv(11100000), '3 h 5 min');
  assert.equal(sanaYozuv('2026-11-08'), 'Nov 8');
  assert.equal(tarifBayrogimi('analytics_extended'), true);
  assert.equal(tarifBayrogimi('Early access price'), false);
  assert.equal(tarifBayrogimi('unlimited'), false);
});
