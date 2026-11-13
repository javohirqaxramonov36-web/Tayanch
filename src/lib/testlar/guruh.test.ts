// P34 guruhlar sof funksiyalari: kod formati, aniqlik, faollik, ruxsat kengayishi, server xato kodlari.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aniqlik, kengaytiradimi, kodKorinishi, kodniTozala, kodTogrimi, necheKunOldin, nofaolmi, xatoKodi,
} from '../sat/guruh.ts';

test('kod: tozalash va tekshirish', () => {
  assert.equal(kodniTozala(' abcd-ef23 '), 'ABCDEF23');
  assert.equal(kodTogrimi('abcd-ef23'), true);
  assert.equal(kodTogrimi('ABCDEF2'), false, '7 belgi');
  assert.equal(kodTogrimi('ABCDEF20'), false, '0 alifboda yo\'q');
  assert.equal(kodTogrimi('ABCDEFI3'), false, 'I alifboda yo\'q');
  assert.equal(kodKorinishi('abcdef23'), 'ABCD-EF23');
});

test('aniqlik: javob yo\'q bo\'lsa null, aks holda butun foiz', () => {
  assert.equal(aniqlik(0, 0), null);
  assert.equal(aniqlik(1, 3), 33);
  assert.equal(aniqlik(2, 3), 67);
  assert.equal(aniqlik(5, 3), 100, 'correct > answered bo\'lsa ham 100 dan oshmaydi');
});

test('necheKunOldin va nofaolmi: Toshkent kalendar kuni', () => {
  const hozir = new Date('2026-11-12T07:00:00Z'); // 12:00 Toshkent
  assert.equal(necheKunOldin('2026-11-11T20:00:00Z', hozir), 0, '01:00 Toshkent, shu kun');
  assert.equal(necheKunOldin('2026-11-11T07:00:00Z', hozir), 1);
  assert.equal(necheKunOldin(null, hozir), null);
  const x = (last: string | null) => ({ answered: 1, correct: 1, answered_7d: 0, last_active: last });
  assert.equal(nofaolmi(x('2026-11-05T07:00:00Z'), hozir), true, '7 kun');
  assert.equal(nofaolmi(x('2026-11-06T07:00:00Z'), hozir), false, '6 kun');
  assert.equal(nofaolmi(x(null), hozir), true, 'hech javob yo\'q');
  assert.equal(nofaolmi(null, hozir), false, 'ulashilmagan: belgi yo\'q');
});

test('kengaytiradimi: faqat yangi ruxsat qo\'shilganda', () => {
  assert.equal(kengaytiradimi({ s: false, t: false }, { s: true, t: false }), true);
  assert.equal(kengaytiradimi({ s: true, t: false }, { s: false, t: false }), false);
  assert.equal(kengaytiradimi({ s: true, t: true }, { s: true, t: true }), false);
  assert.equal(kengaytiradimi({ s: true, t: false }, { s: false, t: true }), true);
});

test('xatoKodi: server kodlari va boshqalar', () => {
  assert.equal(xatoKodi({ message: 'guardian_required', code: 'P0001' }), 'guardian_required');
  assert.equal(xatoKodi({ message: 'not_found' }), 'not_found');
  assert.equal(xatoKodi({ code: '28000', message: 'not_authenticated' }), 'auth');
  assert.equal(xatoKodi({ code: '42501', message: 'permission denied for function group_join' }), 'auth');
  assert.equal(xatoKodi({ message: 'boshqa narsa' }), 'network');
  assert.equal(xatoKodi(null), 'network');
});
