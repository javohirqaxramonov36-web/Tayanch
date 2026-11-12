// SAT reyting sof funksiyalari (P32).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jadvalSarlavhasi, laqabXatoKodimi, laqabXatosi, reytingXatoMatni, tanlovniOqi, yangilanishMatni } from '../sat/reyting.ts';

test('nickname shape: 3–20 Latin letters, digits, underscore', () => {
  assert.equal(laqabXatosi('Aziz_01'), null);
  assert.equal(laqabXatosi('  Bek  '), null);
  assert.ok(laqabXatosi(''));
  assert.ok(laqabXatosi('ab'));
  assert.ok(laqabXatosi('with space'));
  assert.ok(laqabXatosi('Ad.min'));
  assert.ok(laqabXatosi('Azizbek'.repeat(3)));
  assert.ok(laqabXatosi('Ўзбек'));
});

test('server error codes map to text; unknown → generic', () => {
  assert.match(reytingXatoMatni('nickname_taken'), /taken/);
  assert.match(reytingXatoMatni('leaderboard_not_eligible'), /18/);
  assert.match(reytingXatoMatni(undefined), /Something went wrong/);
  assert.equal(laqabXatoKodimi('nickname_not_allowed'), true);
  assert.equal(laqabXatoKodimi('no_country'), false);
});

test('saved choice: unknown values fall back to week / all', () => {
  assert.deepEqual(tanlovniOqi(null), { davr: 'week', doira: 'all' });
  assert.deepEqual(tanlovniOqi('{"davr":"month","doira":"country"}'), { davr: 'month', doira: 'country' });
  assert.deepEqual(tanlovniOqi('{"davr":"year","doira":"x"}'), { davr: 'week', doira: 'all' });
  assert.deepEqual(tanlovniOqi('not json'), { davr: 'week', doira: 'all' });
});

test('table caption and reset time', () => {
  assert.equal(jadvalSarlavhasi({ period: 'week', from: '2026-11-09', to: '2026-11-12' }, 50), 'Top 50 · this week (Nov 9 – Nov 12)');
  // Dushanba 00:00 Toshkent = yakshanba 19:00 UTC
  assert.match(yangilanishMatni('2026-11-15T19:00:00Z', 'week', 'en-GB', 'Asia/Tashkent'), /^Weekly XP starts again on Mon 16 Nov, 00:00/);
});
