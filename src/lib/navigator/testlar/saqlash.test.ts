// localStorage persistence: corrupted data, disabled storage, validation, next-step override API.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xotiraOmbori, brauzerOmbori, type Ombor } from '../ombor.ts';
import { PROFIL_KALITI, profilniOqi, profilniYoz, profilniTozala, otkazilganProfil, type YolProfil } from '../profil.ts';
import {
  KEYINGI_QADAM_KALITI, ornatKeyingiQadam, oqiKeyingiQadam, tozalaKeyingiQadam, tanlaKeyingiQadam, ichkiManzilmi,
} from '../keyingiQadam.ts';
import type { Qadam } from '../yolXaritasi.ts';

const profil: YolProfil = {
  v: 1, goals: ['sat', 'ielts'], primaryGoal: 'ielts', timeLeft: 'date', examDate: '2026-12-01',
  dailyMinutes: 60, skipped: false, updatedAt: '2026-11-09T10:00:00.000Z',
};

test('round trip', () => {
  const o = xotiraOmbori();
  profilniYoz(o, profil);
  assert.deepEqual(profilniOqi(o), profil);
});

test('corrupted JSON is silently removed', () => {
  const o = xotiraOmbori();
  o.yoz(PROFIL_KALITI, '{"goals": [sat');
  assert.equal(profilniOqi(o), null);
  assert.equal(o.oqi(PROFIL_KALITI), null);
});

test('wrong shape is removed, partial junk is cleaned', () => {
  const o = xotiraOmbori();
  o.yoz(PROFIL_KALITI, '"salom"');
  assert.equal(profilniOqi(o), null);
  const t = profilniTozala({ goals: ['sat', 'hack', 'sat'], primaryGoal: 'eyuf', timeLeft: 'date', examDate: '2026-13-01', dailyMinutes: 45, updatedAt: 'x' });
  assert.deepEqual(t, { v: 1, goals: ['sat'], primaryGoal: 'sat', timeLeft: null, examDate: null, dailyMinutes: null, skipped: false, updatedAt: '1970-01-01T00:00:00.000Z' });
  assert.equal(profilniTozala({ goals: [] }), null);
});

test('skip keeps a valid profile with skipped=true', () => {
  const s = otkazilganProfil(new Date('2026-11-09T00:00:00Z'));
  assert.equal(s.skipped, true);
  assert.deepEqual(profilniTozala(s), s);
});

test('throwing localStorage does not break the page', () => {
  const buzuq = {
    getItem() { throw new Error('SecurityError'); },
    setItem() { throw new Error('QuotaExceeded'); },
    removeItem() { throw new Error('SecurityError'); },
  };
  const g = globalThis as { localStorage?: unknown };
  const asl = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { value: buzuq, configurable: true });
  try {
    const o: Ombor = brauzerOmbori();
    assert.equal(o.doimiy, false);
    assert.equal(profilniYoz(o, profil), true);
    assert.deepEqual(profilniOqi(o), profil);
  } finally {
    if (asl) Object.defineProperty(globalThis, 'localStorage', asl);
    else delete g.localStorage;
  }
});

const qadamlar: Qadam[] = [
  { id: 'a', maqsad: 'sat', nomi: 'A', izoh: '', manzil: null, tayyor: false },
  { id: 'b', maqsad: 'sat', nomi: 'B', izoh: '', manzil: '/uz/sat/mashq/test/', tayyor: true },
];

test('next step: first ready roadmap step without override', () => {
  const k = tanlaKeyingiQadam(qadamlar, null);
  assert.equal(k?.turi === 'qadam' && k.qadam.id, 'b');
  assert.equal(tanlaKeyingiQadam([qadamlar[0]], null), null);
});

test('setNextStepOverride: set, read, prefer over roadmap, clear by source', () => {
  const o = xotiraOmbori();
  const hozir = new Date('2026-11-09T12:00:00Z');
  assert.equal(ornatKeyingiQadam({ manba: 'ielts-natija', sarlavha: 'Reading darsini takrorlang', manzil: '/uz/ielts/qollanma/reading/tfng/' }, o, hozir), true);
  const ov = oqiKeyingiQadam(o, hozir);
  assert.equal(ov?.manba, 'ielts-natija');
  const k = tanlaKeyingiQadam(qadamlar, ov);
  assert.equal(k?.turi, 'override');
  tozalaKeyingiQadam('boshqa-modul', o);
  assert.ok(oqiKeyingiQadam(o, hozir));
  tozalaKeyingiQadam('ielts-natija', o);
  assert.equal(oqiKeyingiQadam(o, hozir), null);
});

test('override rejects external or malformed links', () => {
  const o = xotiraOmbori();
  for (const manzil of ['https://example.com/', '//evil.uz/', '/uz/sat', 'javascript:alert(1)', '/Tayanch/uz/sat/', '/uz/../x/']) {
    assert.equal(ornatKeyingiQadam({ manba: 'x', sarlavha: 'y', manzil }, o), false, manzil);
    assert.equal(ichkiManzilmi(manzil), false);
  }
  assert.equal(o.oqi(KEYINGI_QADAM_KALITI), null);
});

test('expired or corrupted override is dropped', () => {
  const o = xotiraOmbori();
  ornatKeyingiQadam({ manba: 'x', sarlavha: 'y', manzil: '/uz/sat/', tugaydi: '2026-11-10T00:00:00Z' }, o, new Date('2026-11-09T00:00:00Z'));
  assert.ok(oqiKeyingiQadam(o, new Date('2026-11-09T23:00:00Z')));
  assert.equal(oqiKeyingiQadam(o, new Date('2026-11-10T00:00:01Z')), null);
  o.yoz(KEYINGI_QADAM_KALITI, 'not json');
  assert.equal(oqiKeyingiQadam(o), null);
  assert.equal(o.oqi(KEYINGI_QADAM_KALITI), null);
});
