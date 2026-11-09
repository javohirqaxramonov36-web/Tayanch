import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { bahola, modullar, natijala, norm, sozlar, testIdMi } from '../src/lib/ielts/test.ts';

const reading = new Set(['tfng', 'ynng', 'choice-single', 'choice-multiple', 'matching-headings', 'matching-information', 'sentence-completion', 'summary-completion', 'short-answer']);
const listening = new Set(['form-completion', 'note-completion', 'choice-single', 'choice-multiple', 'matching', 'map-labelling', 'sentence-completion']);
const idlar = new Set();
const matnlar = new Set();
const hisobot = [];
const fullIds = new Map(modullar.map((modul) => [modul, new Set()]));

for (const modul of modullar) {
  const papka = new URL(`../public/data/ielts/${modul}/`, import.meta.url);
  if (!existsSync(papka)) continue;
  for (const fayl of readdirSync(papka).sort()) {
    if (!fayl.endsWith('.json')) continue;
    const test = JSON.parse(readFileSync(new URL(fayl, papka), 'utf8'));
    const belgi = modul + '/' + fayl;
    assert.ok(testIdMi(test.id) && fayl === test.id + '.json' && test.module === modul, belgi);
    assert.ok(test.title && Number.isInteger(test.durationSeconds) && test.durationSeconds > 0, belgi);
    if (test.id !== 'namuna') fullIds.get(modul).add(test.id);
    assert.ok(test.verified_by === null || typeof test.verified_by === 'string', belgi);
    if (modul === 'writing') {
      assert.equal(test.tasks.length, 2, belgi);
      const [task1, task2] = test.tasks;
      assert.equal(task1.minWords, 150, belgi);
      assert.equal(task2.minWords, 250, belgi);
      assert.ok(task1.text && task2.text && task1.chart?.labels.length && task1.chart?.series.length, belgi);
      for (const s of task1.chart.series) {
        assert.equal(s.values.length, task1.chart.labels.length, belgi);
        assert.ok(s.values.every((v) => Number.isFinite(v) && v >= 0), belgi);
      }
      hisobot.push(belgi + ' · 2 topshiriq');
      continue;
    }
    if (modul === 'speaking') {
      assert.equal(test.parts.length, 3, belgi);
      assert.ok(test.parts.every((p) => p.title && p.questions.length && p.questions.every(Boolean)), belgi);
      assert.equal(test.parts[1].prepSeconds, 60, belgi);
      assert.ok(test.parts[1].cue, belgi);
      hisobot.push(belgi + ' · 3 qism');
      continue;
    }

    const counts = [];
    const key = {};
    const full = test.id !== 'namuna';
    if (full) {
      assert.equal(test.sections.length, modul === 'reading' ? 3 : 4, belgi);
      assert.equal(test.durationSeconds, modul === 'reading' ? 3600 : 1800, belgi);
    }
    for (const [i, part] of test.sections.entries()) {
      assert.ok(part.title && part.questions.length, belgi);
      const text = modul === 'reading' ? part.paragraphs : part.script.map((line) => line.text);
      assert.ok(text.length && text.every(Boolean), belgi);
      if (modul === 'reading' && full) {
        const words = sozlar(text.join(' '));
        assert.ok(words >= 700 && words <= 900, `${belgi}, ${i + 1}-matn · ${words} so‘z`);
        assert.ok(!matnlar.has(text.join(' ')), belgi);
        matnlar.add(text.join(' '));
        counts.push(words);
      }
      if (modul === 'listening' && full) assert.equal(part.questions.length, 10, belgi);
      for (const q of part.questions) {
        const savol = `${belgi} · ${q.id}`;
        assert.ok(q.id && !idlar.has(q.id), savol);
        idlar.add(q.id);
        assert.ok((modul === 'reading' ? reading : listening).has(q.type), savol);
        assert.ok(q.text && q.explanation_uz && q.explanation_en && [1, 2, 3].includes(q.difficulty), savol);
        if (modul === 'reading' && full) assert.equal(q.difficulty, i + 1, savol);
        assert.ok(q.evidence.length, savol);
        const notGiven = q.correct === 'Not Given' && ['tfng', 'ynng'].includes(q.type);
        for (const { ref, quote } of q.evidence) {
          assert.ok(ref, savol);
          if (notGiven) {
            assert.equal(quote, '', savol);
          } else if (modul === 'reading') {
            const index = /^[A-Z]$/.test(ref) ? ref.charCodeAt(0) - 65 : -1;
            assert.ok(quote && text[index]?.includes(quote), savol + ' dalil xatboshisi');
          } else {
            const line = /^Part (\d+), line (\d+) \((.+)\)$/.exec(ref);
            const evidence = line ? part.script[Number(line[2]) - 1] : undefined;
            assert.ok(quote && line && Number(line[1]) === i + 1 && evidence?.speaker === line[3] && evidence.text.includes(quote), savol + ' dalil satri');
          }
        }
        if (q.options) {
          const options = q.options.map(norm);
          assert.ok(options.length >= 2 && new Set(options).size === options.length, savol);
          if (q.type === 'choice-multiple') {
            assert.ok(Array.isArray(q.correct) && q.correct.length >= 2 && q.correct.length < options.length, savol);
            assert.ok(new Set(q.correct).size === q.correct.length, savol);
            assert.ok(q.correct.every((c) => q.options.includes(c)), savol);
            assert.equal(bahola(q, q.correct.slice(0, -1)), false, savol);
          } else assert.ok(typeof q.correct === 'string' && q.options.includes(q.correct), savol);
          key[q.id] = q.correct;
        } else {
          assert.ok(q.accepted.length && Number.isInteger(q.maxWords) && q.maxWords > 0, savol);
          assert.ok(q.accepted.every((a) => a.trim() && sozlar(a) <= q.maxWords), savol);
          key[q.id] = q.accepted[0];
        }
        assert.equal(bahola(q, key[q.id]), true, savol);
        assert.equal(bahola(q, ''), false, savol);
      }
    }
    const all = Object.keys(key).length;
    if (full) assert.equal(all, 40, belgi);
    assert.equal(natijala(test, key).togri, all, belgi);
    assert.equal(natijala(test, {}).togri, 0, belgi);
    hisobot.push(`${belgi} · ${all} savol${counts.length ? ' · ' + counts.join(' / ') + ' so‘z' : ''}`);
  }
}

if (process.argv.includes('--toliq')) {
  for (const [modul, ids] of fullIds) {
    for (let i = 1; i <= 10; i++) assert.ok(ids.has('mock-' + String(i).padStart(2, '0')), modul + ' · ' + i);
  }
}

console.log(hisobot.join('\n'));
console.log(`${idlar.size} savolning tuzilishi, dalil iqtibosi va baholanishi tekshirildi.`);
