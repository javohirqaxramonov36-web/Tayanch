import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qidiruvMatni } from './soha.ts';
import tracks from '../../../data/eyuf/tracks.json' with { type: 'json' };
import quotas from '../../../data/eyuf/quotas.json' with { type: 'json' };
import lessons from '../../../data/eyuf/lessons.json' with { type: 'json' };
import { treklarniSarala } from '../../../data/eyuf/saralash.mjs';
test('570 mutaxassislik 20 trekda noyob manba raqami bilan', () => {
  const all = tracks.items.flatMap((track) => track.specialties);
  assert.equal(all.length, 570);
  assert.equal(new Set(all.map((s) => s.id)).size, 570);
  for (const specialty of all) {
    assert(specialty.title_original.length > 0);
    assert(specialty.sources.some((source) => source.id === 'S04'));
    assert.equal(specialty.verified, false);
  }
});
test('Soha tartibi, darajasi va dars bog‘lanishi', () => {
  for (const level of ['bachelor', 'master'] as const) {
    const selected = treklarniSarala(tracks, quotas, level);
    assert.equal(selected.length, level === 'bachelor' ? 15 : 20);
    for (const track of selected) {
      const applicable = lessons.items.filter(
        (l) => track.lesson_ids.includes(l.id) && l.level.includes(level),
      );
      assert.equal(applicable.length, level === 'bachelor' ? 8 : 9);
    }
  }
});
test('Apostrof va kirill qidiruvi', () => {
  assert.equal(qidiruvMatni('  O‘rmon  '), qidiruvMatni("O'rmon"));
  assert(qidiruvMatni('Кимё муҳандислиги').includes(qidiruvMatni('КИМЁ')));
});
test('Natija kursining besh darsi manba bilan qoralama', () => {
  const result = lessons.items.filter((l) => l.course === 'c4');
  assert.equal(result.length, 5);
  for (const lesson of result) {
    assert(lesson.content_blocks.every((block) => block.type === 'text'));
    assert(lesson.sources.length);
    assert.equal(lesson.verified, false);
  }
});
