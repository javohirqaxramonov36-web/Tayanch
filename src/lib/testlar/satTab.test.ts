// SAT telefon pastki tab bari (satTab.ts): bandlar, havolalar va joriy tab.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { satQism, satTablar, type SatTabGuruh } from '../sat/satTab.ts';

const guruhlar: SatTabGuruh[] = [
  { nomi: 'Practice', qismlar: ['mashq/bank/', 'mashq/mock/', 'mashq/test/', 'mashq/lugat/'] },
  { nomi: 'Learn', qismlar: ['qollanma/qayerdan-boshlash/', 'qollanma/reading-writing/', 'qollanma/math/hajm/', 'qollanma/reading-writing/dalil/'] },
  { nomi: 'Progress', qismlar: ['vosita/natijalar/', 'vosita/takrorlash/'] },
  { nomi: 'Plan', qismlar: ['vosita/reja/', 'hisob/maqsad/'] },
  { nomi: 'Account', qismlar: ['hisob/profil/', 'hisob/obuna/'] },
];

const joriylar = (q: string | null) => satTablar(guruhlar, q).map((t) => `${t.kalit}:${t.joriy ?? '-'}`).join(' ');

test('five tabs in sidebar order, each opens the first page of its group', () => {
  const t = satTablar(guruhlar, null);
  assert.deepEqual(t.map((x) => x.nomi), ['Today', 'Practice', 'Learn', 'Progress', 'Plan']);
  assert.deepEqual(t.map((x) => x.qism), ['', 'mashq/bank/', 'qollanma/qayerdan-boshlash/', 'vosita/natijalar/', 'vosita/reja/']);
});

test('current tab: exact page is "page", other pages of the group are "true"', () => {
  assert.equal(joriylar(''), 'today:page practice:- learn:- progress:- plan:-');
  assert.equal(joriylar('mashq/bank/'), 'today:- practice:page learn:- progress:- plan:-');
  assert.equal(joriylar('mashq/lugat/'), 'today:- practice:true learn:- progress:- plan:-');
  assert.equal(joriylar('mashq/lugat/flashcards/'), 'today:- practice:true learn:- progress:- plan:-');
  assert.equal(joriylar('hisob/maqsad/'), 'today:- practice:- learn:- progress:- plan:true');
});

test('longest matching page wins (nested lesson inside a guide)', () => {
  assert.equal(joriylar('qollanma/reading-writing/dalil/'), 'today:- practice:- learn:true progress:- plan:-');
});

test('account pages and unknown pages highlight no tab', () => {
  assert.equal(joriylar('hisob/profil/'), 'today:- practice:- learn:- progress:- plan:-');
  assert.equal(joriylar('huquqiy/maxfiylik/'), 'today:- practice:- learn:- progress:- plan:-');
});

test('missing group stops the build', () => {
  assert.throws(() => satTablar(guruhlar.filter((g) => g.nomi !== 'Plan'), ''), /Plan/);
});

test('satQism', () => {
  assert.equal(satQism('/Tayanch/uz/sat/'), '');
  assert.equal(satQism('/Tayanch/uz/sat'), '');
  assert.equal(satQism('/Tayanch/uz/sat/mashq/bank/'), 'mashq/bank/');
  assert.equal(satQism('/Tayanch/uz/sat/mashq/bank'), 'mashq/bank/');
  assert.equal(satQism('/Tayanch/uz/ielts/'), null);
});
