// SAT musobaqa sof funksiyalari (P32, 2-PR).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { daqiqaElonmi, guruhla, musobaqaXatoMatni, natijaVaqti, oynaMatni, qolganVaqt, slugOl, togriYoz, type Musobaqa } from '../sat/musobaqa.ts';

const m = (slug: string, status: Musobaqa['status']): Musobaqa => ({
  slug, title: slug, description: null, starts_at: '2026-11-20T13:00:00Z', ends_at: '2026-11-20T16:00:00Z',
  duration_min: 30, question_count: 10, status, entry: null,
});

test('server error codes map to text; unknown → generic', () => {
  assert.match(musobaqaXatoMatni('contest_closed'), /Time is up/);
  assert.match(musobaqaXatoMatni('contest_not_ended'), /Results open/);
  assert.match(musobaqaXatoMatni(undefined), /Something went wrong/);
});

test('group by status keeps server order', () => {
  const g = guruhla([m('a-1', 'open'), m('b-1', 'ended'), m('c-1', 'upcoming'), m('d-1', 'open')]);
  assert.deepEqual(g.open.map((x) => x.slug), ['a-1', 'd-1']);
  assert.deepEqual(g.upcoming.map((x) => x.slug), ['c-1']);
  assert.deepEqual(g.ended.map((x) => x.slug), ['b-1']);
});

test('window text: same day shows one date', () => {
  assert.equal(oynaMatni('2026-11-20T13:00:00Z', '2026-11-20T16:00:00Z', 'en-GB', 'Asia/Tashkent'), 'Fri 20 Nov, 18:00 – 21:00');
  assert.equal(oynaMatni('2026-11-20T13:00:00Z', '2026-11-21T16:00:00Z', 'en-GB', 'Asia/Tashkent'), 'Fri 20 Nov, 18:00 – Sat 21 Nov, 21:00');
});

test('result time', () => {
  assert.equal(natijaVaqti(720000), '12 min');
  assert.equal(natijaVaqti(725000), '12 min 5 s');
  assert.equal(natijaVaqti(45000), '45 s');
  assert.equal(natijaVaqti(0), '0 s');
});

test('time left uses server clock offset and never goes below 0', () => {
  const soat = Date.parse('2026-11-20T13:00:00Z');
  // mijoz soati serverdan 60 s orqada
  assert.equal(qolganVaqt('2026-11-20T13:30:00Z', '2026-11-20T13:01:00Z', soat, soat), 29 * 60000);
  assert.equal(qolganVaqt('2026-11-20T13:30:00Z', '2026-11-20T13:01:00Z', soat, soat + 3600000), 0);
});

test('minute announcements only when the minute changes', () => {
  assert.equal(daqiqaElonmi(null, 5 * 60000), '5 minutes left.');
  assert.equal(daqiqaElonmi(5 * 60000, 4.5 * 60000), null);
  assert.equal(daqiqaElonmi(61000, 59000), '1 minute left.');
  assert.equal(daqiqaElonmi(1000, 0), 'Time is up.');
});

test('slug from query and correct answer text', () => {
  assert.equal(slugOl('?c=nov-math-1'), 'nov-math-1');
  assert.equal(slugOl('?c=Bad Slug'), null);
  assert.equal(slugOl(''), null);
  assert.equal(togriYoz(['3/2', '1.5']), '3/2');
  assert.equal(togriYoz('B'), 'B');
});
