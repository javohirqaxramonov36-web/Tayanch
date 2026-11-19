// IELTS Writing baholash: so'z sanog'i (server bilan bir xil vektorlar), tekshiruv, xato matnlari, qoralama, natija.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bandMatni, natijaTogrimi, qoralamaniOqi, sanoqIzohi, sozSoni, tekshir, xatoMatni } from '../baho.ts';

const SAVOL = 'Some people think university should be free. Discuss both views.';

test("sozSoni: server vektorlari (supabase/functions/tests/ielts_writing_baho_test.ts)", () => {
  assert.equal(sozSoni(''), 0);
  assert.equal(sozSoni('  Hello   world \n\n again '), 3);
  assert.equal(sozSoni("well-known people don't agree"), 4);
  assert.equal(sozSoni('In 2026 , prices rose - sharply .'), 5);
  assert.equal(sozSoni('Ta’lim — muhim.'), 2);
});

test('tekshir: savol, chegaralar', () => {
  assert.equal(tekshir('', 'word '.repeat(60)), 'savol_yoq');
  assert.equal(tekshir('Too short', 'word '.repeat(60)), 'savol_qisqa');
  assert.equal(tekshir(SAVOL, 'word '.repeat(49)), 'kam');
  assert.equal(tekshir(SAVOL, 'word '.repeat(50)), null);
  assert.equal(tekshir(SAVOL, 'word '.repeat(601)), 'kop');
  assert.equal(tekshir(SAVOL, `${'a'.repeat(80)} `.repeat(75)), 'kop');
});

test('sanoqIzohi: 250 dan kam, yetarli, ortiq', () => {
  assert.match(sanoqIzohi(10), /kamida 250/);
  assert.match(sanoqIzohi(200), /Yana 50 so'z/);
  assert.match(sanoqIzohi(250), /bajarildi/);
  assert.match(sanoqIzohi(700), /qisqartiring/);
});

test('xatoMatni: limit soni, retry, noma\'lum kod', () => {
  assert.match(xatoMatni('quota_exceeded', { daily_limit: 2 }), /2 ta bepul/);
  assert.match(xatoMatni('rate_limited', { retry_after: 7 }), /7 soniya/);
  assert.match(xatoMatni('assessment_failed'), /limitdan sanalmadi/);
  assert.match(xatoMatni('http_500'), /Xatolik/);
});

test('bandMatni', () => {
  assert.equal(bandMatni(6), '6.0');
  assert.equal(bandMatni(6.5), '6.5');
});

test("qoralamaniOqi: to'g'ri, buzilgan, noto'g'ri turlar", () => {
  assert.deepEqual(qoralamaniOqi('{"mavzu":"univ","ozSavol":"","insho":"Hi"}'), { mavzu: 'univ', ozSavol: '', insho: 'Hi' });
  assert.equal(qoralamaniOqi('{bad'), null);
  assert.equal(qoralamaniOqi(null), null);
  assert.deepEqual(qoralamaniOqi('{"mavzu":5,"insho":["x"]}'), { mavzu: null, ozSavol: '', insho: '' });
});

test('natijaTogrimi', () => {
  const m = { band: 6.5, feedback: 'f', example_from_text: '', improvement_tip: 't' };
  const yaxshi = { criteria: { task_response: m, coherence_cohesion: m, lexical_resource: m, grammatical_range_accuracy: m }, overall_summary: 's', under_length: false };
  assert.ok(natijaTogrimi(yaxshi));
  assert.ok(!natijaTogrimi({ ...yaxshi, criteria: { ...yaxshi.criteria, lexical_resource: { ...m, band: 6.3 } } }));
  assert.ok(!natijaTogrimi({ criteria: {} }));
  assert.ok(!natijaTogrimi(null));
});
