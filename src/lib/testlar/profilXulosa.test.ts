// My SAT profile: afzallik tozalash, maqsad bloki, xato daftari sonlari. Ma'lumot shu testda to'qilgan namuna.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { afzallikTozala, STANDART_AFZALLIK } from '../sat/afzallik.ts';
import { bankXulosa, darsBugun, ismYozuv, maqsadXulosa, sonBirlik, takrorMatn } from '../sat/profilXulosa.ts';

test('preferences: unknown or broken values fall back to the default', () => {
  assert.deepEqual(afzallikTozala(null), STANDART_AFZALLIK);
  assert.deepEqual(afzallikTozala([]), STANDART_AFZALLIK);
  assert.deepEqual(afzallikTozala({ rejim: 'fast', kunlikDaqiqa: 20 }), { versiya: 1, rejim: 'practice', kunlikDaqiqa: null });
  assert.deepEqual(afzallikTozala({ rejim: 'timed', kunlikDaqiqa: 45 }), { versiya: 1, rejim: 'timed', kunlikDaqiqa: 45 });
});

test('name: nickname first, then display name, else null', () => {
  assert.equal(ismYozuv({ nickname: 'sat_2027', display_name: 'Aziza' }), 'sat_2027');
  assert.equal(ismYozuv({ nickname: '  ', display_name: 'Aziza' }), 'Aziza');
  assert.equal(ismYozuv({}), null);
  assert.equal(ismYozuv(null), null);
});

test('goal: empty profile is "bosh", values outside 400–1600 are ignored', () => {
  const b = maqsadXulosa({}, '2026-11-13');
  assert.equal(b.bosh, true);
  assert.equal(b.maqsad, 'Not set');
  assert.equal(b.qolgan, null);
  const x = maqsadXulosa({ target_score: 2000, current_score: 1200 }, '2026-11-13');
  assert.equal(x.bosh, false);
  assert.equal(x.maqsad, 'Not set');
  assert.equal(x.joriy, '1200');
});

test('goal: days left, today, passed (Tashkent date strings)', () => {
  const k = maqsadXulosa({ target_score: 1450, exam_date: '2026-12-05' }, '2026-11-13');
  assert.equal(k.maqsad, '1450');
  assert.equal(k.sana, '5 December 2026');
  assert.equal(k.qolgan, '22 days left');
  assert.equal(maqsadXulosa({ exam_date: '2026-11-14' }, '2026-11-13').qolgan, '1 day left');
  assert.equal(maqsadXulosa({ exam_date: '2026-11-13' }, '2026-11-13').qolgan, 'Today');
  const o = maqsadXulosa({ exam_date: '2026-10-01' }, '2026-11-13');
  assert.equal(o.qolgan, 'This date has passed');
  assert.equal(o.otgan, true);
  assert.equal(maqsadXulosa({ exam_date: '2026-02-30' }, '2026-11-13').sana, 'Not set');
});

test('mistake log: lessons due today (boxes 1–4), bank due and saved', () => {
  assert.equal(darsBugun({ a: { quti: 1, keyingi: '2026-11-13' }, b: { quti: 3, keyingi: '2026-11-20' }, c: { quti: 5, keyingi: '2026-11-01' } }, '2026-11-13'), 1);
  assert.equal(darsBugun(null, '2026-11-13'), 0);
  const q = (id: string, box: number | null, due: string | null, bookmarked = false) => ({
    question_id: id, section: 'rw' as const, domain: 'D', skill: 'S', difficulty: 2, format: 'mcq' as const, preview: 'p',
    in_queue: box !== null, box, next_due: due, reason_tag: null, note: null, bookmarked,
  });
  assert.deepEqual(bankXulosa([q('1', 2, '2026-11-12'), q('2', 2, '2026-11-15'), q('3', null, null, true), q('4', 5, '2026-11-01')], '2026-11-13'), { bugun: 1, saqlangan: 1 });
  assert.deepEqual(bankXulosa(null, '2026-11-13'), { bugun: 0, saqlangan: 0 });
});

test('text helpers', () => {
  assert.equal(takrorMatn(0), 'Nothing due today');
  assert.equal(takrorMatn(3), '3 to review today');
  assert.equal(sonBirlik(1, 'word', 'words'), '1 word');
  assert.equal(sonBirlik(4, 'word', 'words'), '4 words');
});
