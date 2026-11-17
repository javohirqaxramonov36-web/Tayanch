// Savol banki sof funksiyalari: filtr → jsonb, sonlar, hajm, kvota, xato turi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  filtrJson, skillSonlari, bolimJami, mosSon, domenHolati, sessiyaHajmi, hajmIzohi,
  kvotaHolati, kvotaTugadiMatni, xatoTuri, boshlashSababi, type BankFiltr,
} from '../savolBanki.ts';

const asos: BankFiltr = { section: 'math', qiyinlik: [], yechilgan: 'all', belgilangan: false, qaytaYechish: false };

test('filter json: only set keys, difficulty bands expand to 1-5', () => {
  assert.deepEqual(filtrJson(asos), { section: 'math' });
  assert.deepEqual(
    filtrJson({ ...asos, qiyinlik: ['hard', 'easy'], yechilgan: 'unsolved', belgilangan: true, qaytaYechish: true }, ['Circles']),
    { section: 'math', skills: ['Circles'], difficulties: [1, 2, 4, 5], unanswered_only: true, bookmarked_only: true, incorrect_only: true },
  );
  assert.deepEqual(filtrJson({ ...asos, qiyinlik: ['medium'] }).difficulties, [3]);
});

test('skill counts sum difficulties and keep zero skills', () => {
  const m = skillSonlari({ total: 5, groups: [
    { section: 'math', domain: 'Geometry and Trigonometry', skill: 'Circles', difficulty: 1, total: 2, answered: 0 },
    { section: 'math', domain: 'Geometry and Trigonometry', skill: 'Circles', difficulty: 4, total: 1, answered: 1 },
    { section: 'rw', domain: 'Expression of Ideas', skill: 'Transitions', difficulty: 3, total: 2, answered: 0 },
    { section: 'math', domain: 'X', skill: 'Unknown skill', difficulty: 3, total: 9, answered: 0 },
  ] }, 'math');
  assert.equal(m.get('Circles'), 3);
  assert.equal(m.get('Percentages'), 0);
  assert.equal(m.has('Transitions'), false);
  assert.equal(m.has('Unknown skill'), false);
  assert.equal(m.size, 19);
  assert.equal(skillSonlari(null, 'rw').size, 11);
  assert.deepEqual(bolimJami({ total: 3, groups: [{ section: 'rw', domain: '', skill: '', difficulty: 1, total: 3, answered: 0 }] }), { rw: 3, math: 0 });
});

test('match count ignores selected skills with zero questions', () => {
  const s = new Map([['A', 4], ['B', 0], ['C', 2]]);
  assert.equal(mosSon(['A', 'B'], s), 4);
  assert.equal(mosSon([], s), 0);
});

test('domain checkbox state', () => {
  const s = new Map([['A', 1], ['B', 0], ['C', 2]]);
  assert.equal(domenHolati(['A', 'B', 'C'], new Set(), s), 'none');
  assert.equal(domenHolati(['A', 'B', 'C'], new Set(['A']), s), 'some');
  assert.equal(domenHolati(['A', 'B', 'C'], new Set(['A', 'C']), s), 'all');
  assert.equal(domenHolati(['B'], new Set(['B']), s), 'none');
  assert.equal(domenHolati(['A', 'B'], new Set(['A']), null), 'some');
});

test('session size: volume, matches, 100 cap, quota', () => {
  assert.deepEqual(sessiyaHajmi(20, 50, null), { soni: 20, sabab: 'tanlov' });
  assert.deepEqual(sessiyaHajmi(20, 7, null), { soni: 7, sabab: 'mos' });
  assert.deepEqual(sessiyaHajmi('all', 40, null), { soni: 40, sabab: 'tanlov' });
  assert.deepEqual(sessiyaHajmi('all', 340, null), { soni: 100, sabab: 'chegara' });
  assert.deepEqual(sessiyaHajmi(30, 50, 12), { soni: 12, sabab: 'kvota' });
  assert.equal(hajmIzohi(20, { soni: 7, sabab: 'mos' }), 'Only 7 questions match, so the session will have 7.');
  assert.equal(hajmIzohi(10, { soni: 1, sabab: 'mos' }), 'Only 1 question matches, so the session will have 1.');
  assert.equal(hajmIzohi('all', { soni: 100, sabab: 'chegara' }), 'A session holds at most 100 questions.');
});

test('quota text', () => {
  assert.deepEqual(kvotaHolati({ plan: { code: 'free', name: 'Free' }, limits: {} }).matn, 'Free plan');
  const k = kvotaHolati({ plan: { name: 'Free' }, limits: { questions: { max: 20, per: 'day', used: 8, remaining: 12 } } });
  assert.equal(k.matn, '12 of 20 questions left today · Free plan');
  assert.equal(k.savolQolgan, 12);
  const s = kvotaHolati({ plan: { name: 'Pro' }, limits: { sessions: { max: 3, per: 'day', used: 3, remaining: 0 } } });
  assert.equal(s.tugadi, true);
  assert.equal(s.savolQolgan, null);
  assert.equal(kvotaTugadiMatni(s), "You've used today's 3 sessions. Resets at midnight (Tashkent time).");
  assert.equal(kvotaHolati(null).matn, 'Free plan');
});

test('error kinds', () => {
  assert.equal(xatoTuri({ message: 'quota_exceeded', code: 'P0001' }), 'kvota');
  assert.equal(xatoTuri({ message: 'not_authenticated', code: '42501' }), 'kirish');
  assert.equal(xatoTuri(new TypeError('Failed to fetch')), 'tarmoq');
  assert.equal(xatoTuri({ message: 'invalid_filters' }), 'boshqa');
});

test('start button reason order', () => {
  const p = { holat: 'ready' as const, tanlanganSoni: 1, mos: 5, kvotaTugadi: false, bolimBosh: false };
  assert.equal(boshlashSababi(p), null);
  assert.equal(boshlashSababi({ ...p, tanlanganSoni: 0 }), 'Select at least one skill');
  assert.equal(boshlashSababi({ ...p, mos: 0 }), 'No questions match these filters');
  assert.equal(boshlashSababi({ ...p, kvotaTugadi: true }), 'Daily limit reached');
  assert.equal(boshlashSababi({ ...p, holat: 'empty' }), 'No verified questions yet');
});
