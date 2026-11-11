// Sync conflict resolution between localStorage and the onboarding_profiles row.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { birlashtir, qatordanProfil, profildanQator, type OnboardingQator } from '../sinxron.ts';
import type { YolProfil } from '../profil.ts';

const p = (o: Partial<YolProfil>): YolProfil => ({
  v: 1, goals: ['sat'], primaryGoal: 'sat', timeLeft: '1m', examDate: null, dailyMinutes: 30, skipped: false,
  updatedAt: '2026-11-09T10:00:00.000Z', ...o,
});

test('nothing on either side -> no action', () => {
  assert.deepEqual(birlashtir(null, null), { amal: 'hech' });
});

test('only local -> push; only server -> pull', () => {
  const l = p({});
  assert.deepEqual(birlashtir(l, null), { amal: 'serverga', profil: l });
  assert.deepEqual(birlashtir(null, l), { amal: 'lokalga', profil: l });
});

test('newer updatedAt wins on both sides', () => {
  const eski = p({ dailyMinutes: 15, updatedAt: '2026-11-09T09:00:00.000Z' });
  const yangi = p({ dailyMinutes: 120, updatedAt: '2026-11-09T11:00:00.000Z' });
  assert.deepEqual(birlashtir(yangi, eski), { amal: 'serverga', profil: yangi });
  assert.deepEqual(birlashtir(eski, yangi), { amal: 'lokalga', profil: yangi });
});

test('equal timestamps: identical -> no action, different -> server wins', () => {
  assert.deepEqual(birlashtir(p({}), p({})), { amal: 'hech' });
  const s = p({ goals: ['ielts'], primaryGoal: 'ielts' });
  assert.deepEqual(birlashtir(p({}), s), { amal: 'lokalga', profil: s });
});

test('skipped local vs answered server: still decided by time', () => {
  const skip = p({ goals: [], primaryGoal: null, timeLeft: null, dailyMinutes: null, skipped: true, updatedAt: '2026-11-09T12:00:00.000Z' });
  const javob = p({ updatedAt: '2026-11-08T12:00:00.000Z' });
  assert.equal(birlashtir(skip, javob).amal, 'serverga');
});

test('row <-> profile round trip, server timestamp normalised', () => {
  const l = p({ goals: ['sat', 'ielts'], primaryGoal: 'ielts', timeLeft: 'date', examDate: '2026-12-01' });
  const q = profildanQator(l, 'u1');
  assert.equal(q.exam_date, '2026-12-01');
  const qaytgan = qatordanProfil({ ...q, updated_at: '2026-11-09T10:00:00+00:00' });
  assert.deepEqual(qaytgan, l);
});

test('invalid server row is ignored (treated as missing)', () => {
  const buzuq = { user_id: 'u', goals: ['hack'], primary_goal: null, time_left: null, exam_date: null, daily_minutes: null, skipped: false, updated_at: 'x' } as OnboardingQator;
  assert.equal(qatordanProfil(buzuq), null);
  assert.equal(qatordanProfil(null), null);
});
