// Admission D-seriya, Q3: grantlar katalogi mantig'i. Hamma ma'lumot ATAYLAB SOXTA ("Sinoviya" va h.k.).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Fakt } from '../fakt.ts';
import {
  BOSH_HOLAT, almashtir, deadlineSanasi, filtrBormi, filtrdanOtadimi, grantKorinadimi, grantXulosasi, holatniOqi,
  holatniYoz, ichkiSahifa, muddatHolati, saralash, toliqQoplaydimi, type GrantKirish,
} from '../grantKatalog.ts';

const t = <Q extends string | number | boolean>(qiymat: Q): Fakt => ({
  qiymat, source_url: 'https://example.org/soxta', manba_iborasi: 'soxta ibora', tekshirilgan_sana: '2026-11-01', turi: 'muddatli', holat: 'tasdiqlangan',
});
const q = <Q extends string | number | boolean>(qiymat: Q): Fakt => ({ ...t(qiymat), holat: 'qoralama' });
const yoq: Fakt = { turi: 'muddatli', holat: 'topilmadi' };

const grant = (slug: string, o: Partial<GrantKirish> = {}): GrantKirish => ({
  slug, nom: o.nom ?? slug.toUpperCase(), turi: 'davlat', davlat: 'sinoviya', daraja: 'bakalavr',
  nimani_qoplaydi: t("o'qish"), deadline: yoq, ...o,
});
const BUGUN = '2026-11-20';

test("ko'rinish va 'to'liq qoplaydi' faqat tasdiqlangan faktdan", () => {
  assert.equal(grantKorinadimi(grant('a')), true);
  assert.equal(grantKorinadimi(grant('b', { nimani_qoplaydi: q("o'qish") })), false);
  assert.equal(grantKorinadimi(grant('c', { nimani_qoplaydi: yoq })), false);
  assert.equal(toliqQoplaydimi(grant('d', { toliq_qoplaydi: t(true) })), true);
  assert.equal(toliqQoplaydimi(grant('e', { toliq_qoplaydi: q(true) })), false);
  assert.equal(toliqQoplaydimi(grant('f', { toliq_qoplaydi: t(false) })), false);
  assert.equal(toliqQoplaydimi(grant('g')), false);
});

test('deadline sanasi: faqat tasdiqlangan va haqiqiy YYYY-MM-DD', () => {
  assert.equal(deadlineSanasi(t('2027-02-20')), '2027-02-20');
  assert.equal(deadlineSanasi(q('2027-02-20')), null);
  assert.equal(deadlineSanasi(t('yil davomida')), null);
  assert.equal(deadlineSanasi(t('2027-02-30')), null);
  assert.equal(deadlineSanasi(yoq), null);
});

test("muddat holati: bugun hali o'tmagan, kecha o'tgan", () => {
  assert.equal(muddatHolati('2026-11-20', BUGUN), 'kelajak');
  assert.equal(muddatHolati('2026-11-19', BUGUN), 'otgan');
  assert.equal(muddatHolati(null, BUGUN), 'nomalum');
});

test("saralash: yaqin muddat birinchi, keyin noma'lum, oxirida o'tganlar", () => {
  const xlar = [
    grantXulosasi(grant('otgan-eski', { nom: 'E', deadline: t('2026-01-10') })),
    grantXulosasi(grant('nomalum-b', { nom: 'B', deadline: q('2026-12-01') })),
    grantXulosasi(grant('uzoq', { nom: 'U', deadline: t('2027-03-01') })),
    grantXulosasi(grant('otgan-yaqin', { nom: 'Y', deadline: t('2026-10-01') })),
    grantXulosasi(grant('yaqin', { nom: 'Z', deadline: t('2026-12-01') })),
    grantXulosasi(grant('nomalum-a', { nom: 'A', deadline: t('yil davomida') })),
  ];
  assert.deepEqual(saralash(xlar, BUGUN).map((x) => x.slug), ['yaqin', 'uzoq', 'nomalum-a', 'nomalum-b', 'otgan-yaqin', 'otgan-eski']);
  assert.equal(xlar[0].slug, 'otgan-eski', "asl massiv o'zgarmaydi");
});

test("filtr: guruh ichida 'yoki', guruhlar orasida 'va'; 'ikkalasi' ikkala darajaga mos", () => {
  const a = grantXulosasi(grant('a', { turi: 'davlat', davlat: 'sinoviya', daraja: 'ikkalasi', toliq_qoplaydi: t(true) }));
  const b = grantXulosasi(grant('b', { turi: 'universitet', davlat: 'soxtaland', daraja: 'magistr' }));
  const h = (o: Partial<typeof BOSH_HOLAT>) => ({ ...BOSH_HOLAT, ...o });
  assert.equal(filtrdanOtadimi(a, BOSH_HOLAT) && filtrdanOtadimi(b, BOSH_HOLAT), true);
  assert.equal(filtrdanOtadimi(a, h({ darajalar: ['bakalavr'] })), true);
  assert.equal(filtrdanOtadimi(a, h({ darajalar: ['magistr'] })), true);
  assert.equal(filtrdanOtadimi(b, h({ darajalar: ['bakalavr'] })), false);
  assert.equal(filtrdanOtadimi(b, h({ turlar: ['davlat', 'universitet'] })), true);
  assert.equal(filtrdanOtadimi(b, h({ turlar: ['davlat'] })), false);
  assert.equal(filtrdanOtadimi(a, h({ davlatlar: ['soxtaland'] })), false);
  assert.equal(filtrdanOtadimi(a, h({ toliq: true })), true);
  assert.equal(filtrdanOtadimi(b, h({ toliq: true })), false);
  assert.equal(filtrBormi(BOSH_HOLAT), false);
  assert.equal(filtrBormi(h({ toliq: true })), true);
});

test("URL holati: o'qish/yozish, noma'lum qiymatlar tashlanadi, boshqa parametr saqlanadi", () => {
  const h = holatniOqi('?tur=universitet,xato,davlat&d=soxtaland,yoq&dr=magistr&toliq=1', ['sinoviya', 'soxtaland']);
  assert.deepEqual(h, { turlar: ['davlat', 'universitet'], davlatlar: ['soxtaland'], darajalar: ['magistr'], toliq: true });
  assert.equal(holatniYoz(h), '?tur=davlat,universitet&d=soxtaland&dr=magistr&toliq=1');
  assert.equal(holatniYoz(BOSH_HOLAT, '?boshqa=1&toliq=1'), '?boshqa=1');
  assert.deepEqual(holatniOqi('', ['sinoviya']), BOSH_HOLAT);
});

test("almashtir va ichki sahifa (Türkiye Bursları)", () => {
  assert.deepEqual(almashtir(['magistr'], 'bakalavr', ['bakalavr', 'magistr']), ['bakalavr', 'magistr']);
  assert.deepEqual(almashtir(['bakalavr', 'magistr'], 'bakalavr', ['bakalavr', 'magistr']), ['magistr']);
  assert.equal(ichkiSahifa({ slug: 'turkiye-burslari', turi: 'davlat', davlat: 'turkiya' })?.yol, '/uz/top-admission/turkiye-burslari/');
  assert.equal(ichkiSahifa({ slug: 'boshqa', turi: 'davlat', davlat: 'turkiya' })?.yol, '/uz/top-admission/turkiye-burslari/');
  assert.equal(ichkiSahifa({ slug: 'boshqa', turi: 'universitet', davlat: 'turkiya' }), undefined);
  assert.equal(ichkiSahifa({ slug: 'boshqa', turi: 'davlat', davlat: 'sinoviya' }), undefined);
});
