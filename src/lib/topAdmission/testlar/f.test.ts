// Admission F: "muallif" holati (tadqiqot to'plamidan ko'chirilgan fakt). Ma'lumot ATAYLAB SOXTA.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hujjatniTekshir } from '../../../../scripts/malumot/umumiy.ts';
import { faktKorinadimi, type Fakt } from '../fakt.ts';
import { grantKorinadimi } from '../grantKatalog.ts';

const m = (qiymat: string): Fakt => ({ qiymat, source_url: 'https://example.org/soxta', tekshirilgan_sana: '2026-11-20', turi: 'muddatli', holat: 'muallif' });

test("muallif: saytda ko'rinadi, manba_iborasi shart emas", () => {
  assert.equal(faktKorinadimi(m('Soxta qamrov')), true);
  assert.equal(grantKorinadimi({ nimani_qoplaydi: m('Soxta qamrov'), deadline: m("Keyingi sana e'lon qilinmagan") }), true);
});

test('muallif: qiymat, source_url va sana majburiy', () => {
  const grant = (f: Partial<Fakt>) => ({
    slug: 'soxta-grant', nom: 'Soxta grant', turi: 'davlat', davlat: 'soxta', daraja: 'magistr',
    nimani_qoplaydi: { ...m('Soxta qamrov'), ...f }, deadline: m('2027-01-01'), rasmiy_havola: 'https://example.org',
  });
  assert.deepEqual(hujjatniTekshir('grantlar', grant({}), 'f'), []);
  assert.ok(hujjatniTekshir('grantlar', grant({ source_url: undefined }), 'f').length > 0);
  assert.ok(hujjatniTekshir('grantlar', grant({ qiymat: undefined }), 'f').length > 0);
  assert.ok(hujjatniTekshir('grantlar', grant({ tekshirilgan_sana: undefined }), 'f').length > 0);
});

test("qoralama hali ko'rinmaydi va iborasiz o'tmaydi", () => {
  assert.equal(faktKorinadimi({ ...m('x'), holat: 'qoralama' }), false);
});
