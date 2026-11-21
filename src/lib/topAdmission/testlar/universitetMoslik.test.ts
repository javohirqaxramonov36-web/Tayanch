// Admission D-seriya, Q4: "Menga mos universitet" mantig'i. Hamma ma'lumot ATAYLAB SOXTA ("Sinov universiteti" va h.k.).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Fakt, Kurslar } from '../fakt.ts';
import {
  BOSH_HOLAT, SHORTLIST_MAKS, alifbo, byudjetniOqi, holatniOqi, holatniYoz, ieltsMatni, ieltsniOqi, moslik,
  shortlistAlmashtir, shortlistTozala, uniXulosasi, type MoslikHolati, type UniKirish,
} from '../universitetMoslik.ts';

const t = <Q extends string | number | boolean>(qiymat: Q): Fakt => ({
  qiymat, source_url: 'https://example.org/soxta', manba_iborasi: 'soxta ibora', tekshirilgan_sana: '2026-11-01', turi: 'muddatli', holat: 'tasdiqlangan',
});
const q = <Q extends string | number | boolean>(qiymat: Q): Fakt => ({ ...t(qiymat), holat: 'qoralama' });
const yoq: Fakt = { turi: 'muddatli', holat: 'topilmadi' };
const KURS: Kurslar = { manba_url: 'https://example.org/kurs', sana: '2026-11-01', kurslar: { GBP: 1.25 } };

const uni = (slug: string, o: Partial<UniKirish> = {}): UniKirish => ({
  slug, nom: o.nom ?? slug, davlat: 'aqsh', min_ielts: t(6.5), yillik_xarajat: t(40000), valyuta: 'USD',
  xalqaro_yordam_turi: t('need-based'), ...o,
});
const h = (o: Partial<MoslikHolati> = {}): MoslikHolati => ({ ...BOSH_HOLAT, ...o });

test('xulosa: faqat tasdiqlangan qiymat; kurs bilan USD, kurs yo\'q bo\'lsa null', () => {
  assert.deepEqual(uniXulosasi(uni('a'), null), { slug: 'a', nom: 'a', davlat: 'aqsh', ielts: 6.5, xarajatUsd: 40000, yordam: true });
  const b = uniXulosasi(uni('b', { min_ielts: q(6), yillik_xarajat: q(1), xalqaro_yordam_turi: q('x') }), KURS);
  assert.deepEqual([b.ielts, b.xarajatUsd, b.yordam], [null, null, null], 'qoralama ishlatilmaydi');
  assert.equal(uniXulosasi(uni('c', { valyuta: 'GBP', yillik_xarajat: t(30001) }), KURS).xarajatUsd, 37501);
  assert.equal(uniXulosasi(uni('d', { valyuta: 'GBP' }), null).xarajatUsd, null);
  assert.equal(uniXulosasi(uni('e', { valyuta: 'KRW' }), KURS).xarajatUsd, null, 'kurs ro\'yxatida yo\'q valyuta');
  assert.equal(uniXulosasi(uni('f', { xalqaro_yordam_turi: t("Yo'q") }), null).yordam, false);
  assert.equal(uniXulosasi(uni('g', { xalqaro_yordam_turi: yoq }), null).yordam, null);
});

test('moslik: IELTS va byudjet, "talabga yetmaydi" va "faqat mos"', () => {
  const x = uniXulosasi(uni('a'), null);
  assert.equal(moslik(x, h()).guruh, 'mos', 'hech narsa kiritilmasa ham taqqoslanadi');
  assert.equal(moslik(x, h({ ielts: 6.5, byudjet: 40000 })).guruh, 'mos', 'teng qiymat mos');
  const past = moslik(x, h({ ielts: 6 }));
  assert.deepEqual(past, { guruh: 'yetmaydi', ieltsPast: true, qimmat: false });
  const qimmat = moslik(x, h({ byudjet: 39999 }));
  assert.deepEqual(qimmat, { guruh: 'yetmaydi', ieltsPast: false, qimmat: true });
  assert.equal(moslik(x, h({ ielts: 6, faqatMos: true })).guruh, 'yashirin');
});

test('moslik: kerakli fakt tasdiqlanmagan → "tekshirilmoqda", moslik hisoblanmaydi', () => {
  for (const u of [uni('a', { min_ielts: q(6) }), uni('b', { yillik_xarajat: yoq }), uni('c', { valyuta: 'GBP' })]) {
    const m = moslik(uniXulosasi(u, null), h({ ielts: 4, byudjet: 1, faqatMos: true }));
    assert.deepEqual(m, { guruh: 'tekshirilmoqda', ieltsPast: false, qimmat: false }, u.slug);
  }
  // Yordam turi faqat belgi yoqilganda kerakli
  const nomalum = uniXulosasi(uni('d', { xalqaro_yordam_turi: q('need-based') }), null);
  assert.equal(moslik(nomalum, h()).guruh, 'mos');
  assert.equal(moslik(nomalum, h({ yordam: true })).guruh, 'tekshirilmoqda');
});

test('filtr: davlat va "faqat yordam beradiganlar"', () => {
  const uk = uniXulosasi(uni('a', { davlat: 'buyuk-britaniya' }), null);
  assert.equal(moslik(uk, h({ davlatlar: ['aqsh'] })).guruh, 'yashirin');
  assert.equal(moslik(uk, h({ davlatlar: ['aqsh', 'buyuk-britaniya'] })).guruh, 'mos');
  const yordamsiz = uniXulosasi(uni('b', { xalqaro_yordam_turi: t("yo'q") }), null);
  assert.equal(moslik(yordamsiz, h()).guruh, 'mos');
  assert.equal(moslik(yordamsiz, h({ yordam: true })).guruh, 'yashirin');
  // Tekshirilmayotgan universitet ham davlat filtriga bo'ysunadi
  assert.equal(moslik(uniXulosasi(uni('c', { davlat: 'janubiy-koreya', min_ielts: yoq }), null), h({ davlatlar: ['aqsh'] })).guruh, 'yashirin');
});

test('kiritish: IELTS faqat ro\'yxatdagi qiymat, byudjet manfiy emas son', () => {
  assert.equal(ieltsniOqi('6.5'), 6.5);
  assert.equal(ieltsniOqi('6.3'), null);
  assert.equal(ieltsniOqi('10'), null);
  assert.equal(ieltsniOqi(''), null);
  assert.equal(ieltsMatni(6), '6.0');
  assert.equal(byudjetniOqi('20 000'), 20000);
  assert.equal(byudjetniOqi('20,000'), 20000);
  assert.equal(byudjetniOqi('0'), 0);
  assert.equal(byudjetniOqi('-5'), null);
  assert.equal(byudjetniOqi('abc'), null);
  assert.equal(byudjetniOqi(''), null);
});

test('URL: faqat davlat va belgilar; IELTS va byudjet yozilmaydi', () => {
  const holat = h({ davlatlar: ['janubiy-koreya', 'aqsh'], ielts: 7, byudjet: 50000, yordam: true, faqatMos: true });
  const s = holatniYoz(holat, '?boshqa=1');
  assert.equal(s, '?boshqa=1&d=aqsh,janubiy-koreya&yordam=1&mos=1');
  assert.ok(!/ielts|byudjet|50000/.test(s));
  assert.deepEqual(holatniOqi(s), h({ davlatlar: ['aqsh', 'janubiy-koreya'], yordam: true, faqatMos: true }));
  assert.deepEqual(holatniOqi('?d=sinoviya,aqsh&ielts=9'), h({ davlatlar: ['aqsh'] }));
  assert.equal(holatniYoz(BOSH_HOLAT), '');
});

test('tartib alifbo (reyting yo\'q)', () => {
  assert.deepEqual(alifbo([{ nom: 'Sinov B' }, { nom: 'Sinov A' }]).map((x) => x.nom), ['Sinov A', 'Sinov B']);
});

test('shortlist: qo\'shish/olib tashlash, tozalash, chegara', () => {
  let r = shortlistAlmashtir([], 'sinov-a');
  r = shortlistAlmashtir(r, 'sinov-b');
  assert.deepEqual(r, [{ id: 'sinov-b' }, { id: 'sinov-a' }], 'yangisi birinchi');
  assert.deepEqual(shortlistAlmashtir(r, 'sinov-b'), [{ id: 'sinov-a' }], 'qayta bosish olib tashlaydi');
  assert.deepEqual(shortlistTozala([{ id: 'a' }, { id: 'a' }, { id: 'Yomon Slug' }, 5, null, { x: 1 }, { id: 'b', ortiqcha: 1 }]), [{ id: 'a' }, { id: 'b' }]);
  assert.deepEqual(shortlistTozala('buzilgan'), []);
  const kop = Array.from({ length: SHORTLIST_MAKS + 5 }, (_, i) => ({ id: `u-${i}` }));
  assert.equal(shortlistTozala(kop).length, SHORTLIST_MAKS);
  assert.equal(shortlistAlmashtir(shortlistTozala(kop), 'yangi').length, SHORTLIST_MAKS);
});
