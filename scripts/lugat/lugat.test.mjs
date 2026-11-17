// Lug'at CSV tekshiruvchisi sinovlari: npm run lugat:sinov
// Sinov to'plami: 20 ta soxta "SINOV" so'z (haqiqiy ta'rif emas).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { csvOqi, tekshir, xulosa, USTUNLAR } from './tekshir.mjs';

const SARLAVHA = 'word,part_of_speech,definition,example,difficulty,topic,uzbek';
const sinov20 = () => [SARLAVHA, ...Array.from({ length: 20 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  const soz = `sinov ${String.fromCharCode(97 + i)}`;
  return `${soz},noun,"SINOV definition ${n}, with a comma","SINOV example with ${soz} inside",${['easy', 'medium', 'hard'][i % 3]},${i < 10 ? 'SINOV-a' : 'SINOV-b'},`;
})].join('\n');

test('shablon: faqat sarlavha, kerakli ustunlarning hammasi bor', () => {
  const qatorlar = csvOqi(readFileSync(new URL('../../docs/lugat-shablon.csv', import.meta.url), 'utf8'));
  assert.equal(qatorlar.length, 1);
  for (const u of USTUNLAR) assert.ok(qatorlar[0].maydonlar.includes(u), u);
});

test('20 so\'zli sinov to\'plami xatosiz o\'tadi', () => {
  const r = tekshir(sinov20());
  assert.deepEqual(r.xatolar, []);
  assert.equal(r.sozlar.length, 20);
  assert.equal(r.sozlar[0].definition, 'SINOV definition 01, with a comma');
  assert.equal(r.sozlar[0].uzbek, null);
  assert.deepEqual(xulosa(r.sozlar).mavzu, { 'SINOV-a': 10, 'SINOV-b': 10 });
});

test('CSV: qo\'shtirnoq ichida "" va yangi qator, CRLF, BOM', () => {
  const q = csvOqi('﻿a,b\r\n"x ""y""","1\n2"\r\n');
  assert.deepEqual(q.map((r) => r.maydonlar), [['a', 'b'], ['x "y"', '1\n2']]);
  assert.throws(() => csvOqi('a\n"ochiq'), /yopilmagan/);
});

test('xatolar: takror so\'z, noto\'g\'ri qiymatlar, ustunlar', () => {
  const r = tekshir([SARLAVHA,
    'Apt,adjective,SINOV d,SINOV apt e,easy,SINOV,',
    'apt,adjective,SINOV d,SINOV apt e,easy,SINOV,',
    'b2b,thing,,SINOV,hardest,,',
  ].join('\n'));
  assert.equal(r.sozlar.length, 1);
  assert.ok(r.xatolar.some((e) => e.includes('takror')));
  assert.ok(r.xatolar.some((e) => e.includes('word "b2b"')));
  assert.ok(r.xatolar.some((e) => e.includes('part_of_speech')));
  assert.ok(r.xatolar.some((e) => e.includes('difficulty')));
  assert.ok(tekshir('word,definition\n').xatolar[0].includes("ustun yo'q"));
  assert.ok(tekshir(`${SARLAVHA},extra\n`).xatolar.some((e) => e.includes('Notanish')));
});

test('ogohlar: ta\'rifda so\'zning o\'zi, misolda so\'z yo\'q', () => {
  const r = tekshir([SARLAVHA, 'apt,adjective,SINOV apt is apt,SINOV nothing here,easy,SINOV,'].join('\n'));
  assert.equal(r.xatolar.length, 0);
  assert.equal(r.ogohlar.length, 2);
});
