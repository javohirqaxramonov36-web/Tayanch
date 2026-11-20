// Admission D-seriya, Q2: davlatlarni taqqoslash mantig'i. Hamma ma'lumot ATAYLAB SOXTA ("Sinoviya" va h.k.).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Fakt, Kurslar } from '../fakt.ts';
import {
  davlatXulosasi, filtrdanOtadimi, holatniOqi, holatniYoz, ishlashMumkinmi, saralash, taqqosAlmashtir,
  tasdiqlanganSoni, taxminiyUsd, MAKS_TAQQOS, type DavlatKirish, type GrantKirish,
} from '../davlatTaqqos.ts';

const t = <Q extends string | number | boolean>(qiymat: Q): Fakt => ({
  qiymat, source_url: 'https://example.org/soxta', manba_iborasi: 'soxta ibora', tekshirilgan_sana: '2026-11-01', turi: 'muddatli', holat: 'tasdiqlangan',
});
const q = <Q extends string | number | boolean>(qiymat: Q): Fakt => ({ ...t(qiymat), holat: 'qoralama' });
const yoq: Fakt = { turi: 'muddatli', holat: 'topilmadi' };

const davlat = (slug: string, nom: string, o: Partial<{ k: Fakt; v: Fakt; val: string; dip: Fakt; ing: Fakt; ish: Fakt; grantlar: string[] }> = {}): DavlatKirish => ({
  slug, nom_uz: nom,
  narx: { kontrakt_yillik: o.k ?? yoq, viza_yashash_summasi: o.v ?? yoq, valyuta: o.val ?? 'USD' },
  grant: { davlat_grantlari: o.grantlar ?? [] },
  til: { ingliz_tilida_dastur_bor: o.ing ?? yoq, odatiy_ielts: yoq },
  ishlash: { oqish_paytida: o.ish ?? yoq, bitirgandan_keyin: yoq },
  diplom: { togridan_togri: o.dip ?? yoq },
});

const kurs: Kurslar = { manba_url: 'https://example.org/kurs', sana: '2026-11-01', kurslar: { EUR: 1.1 } };
const grantlar = new Map<string, GrantKirish>([
  ['tasdiq', { slug: 'tasdiq', turi: 'davlat', nimani_qoplaydi: t("o'qish"), deadline: t('2027-02-01') }],
  ['qoralama', { slug: 'qoralama', turi: 'davlat', nimani_qoplaydi: q("o'qish"), deadline: t('2027-02-01') }],
  ['univ', { slug: 'univ', turi: 'universitet', nimani_qoplaydi: t("o'qish"), deadline: t('2027-02-01') }],
  ['deadline-qoralama', { slug: 'deadline-qoralama', turi: 'davlat', nimani_qoplaydi: t("o'qish"), deadline: q('2027-02-01') }],
  ['deadline-yoq', { slug: 'deadline-yoq', turi: 'davlat', nimani_qoplaydi: t("o'qish"), deadline: yoq }],
]);

test("belgilar faqat tasdiqlangan faktlardan: qoralama filtrga ta'sir qilmaydi", () => {
  const a = davlatXulosasi(davlat('a', 'A', { dip: t('ha'), ing: t(true), ish: t(20), grantlar: ['tasdiq'] }), grantlar, kurs);
  assert.deepEqual(a.belgilar, ['diplom', 'ingliz', 'grant', 'ishlash']);
  const b = davlatXulosasi(davlat('b', 'B', { dip: q('ha'), ing: q(true), ish: q(20), grantlar: ['qoralama', 'univ', 'yoq-slug'] }), grantlar, kurs);
  assert.deepEqual(b.belgilar, []);
  const c = davlatXulosasi(davlat('c', 'C', { dip: t('dasturga_qarab'), ing: t(false) }), grantlar, kurs);
  assert.deepEqual(c.belgilar, []);
  const d = davlatXulosasi(davlat('d', 'D', { grantlar: ['deadline-qoralama', 'deadline-yoq'] }), grantlar, kurs);
  assert.deepEqual(d.belgilar, [], "deadline tasdiqlanmagan grant 'Davlat granti bor' ga ta'sir qilmaydi (katalog qoidasi)");
});

test("ishlash: false / 0 / \"yo'q\" = mumkin emas; son yoki matn = mumkin", () => {
  assert.equal(ishlashMumkinmi(t(false)), false);
  assert.equal(ishlashMumkinmi(t(0)), false);
  assert.equal(ishlashMumkinmi(t("Yo'q")), false);
  assert.equal(ishlashMumkinmi(t(true)), true);
  assert.equal(ishlashMumkinmi(t('haftasiga 20 soat')), true);
  assert.equal(ishlashMumkinmi(yoq), false);
});

test('filtrlar VA bilan birlashadi', () => {
  assert.equal(filtrdanOtadimi({ belgilar: ['diplom', 'ingliz'] }, ['diplom', 'ingliz']), true);
  assert.equal(filtrdanOtadimi({ belgilar: ['diplom'] }, ['diplom', 'ingliz']), false);
  assert.equal(filtrdanOtadimi({ belgilar: [] }, []), true);
});

test('taxminiy USD: kontrakt + viza summasi, kurs bilan; kurs yoki tasdiqlangan fakt yo\'q bo\'lsa null', () => {
  assert.equal(taxminiyUsd(davlat('a', 'A', { k: t(1000), v: t(9000), val: 'EUR' }), kurs), 11000);
  assert.equal(taxminiyUsd(davlat('a', 'A', { k: t(1000), v: t(9000), val: 'USD' }), kurs), 10000);
  assert.equal(taxminiyUsd(davlat('a', 'A', { k: t(1000), v: t(9000), val: 'GBP' }), kurs), null, "kursi yo'q valyuta");
  assert.equal(taxminiyUsd(davlat('a', 'A', { k: t(1000), v: q(9000), val: 'EUR' }), kurs), null, 'qoralama summa');
  const bosh: Kurslar = { manba_url: '', sana: '', kurslar: {} };
  assert.equal(taxminiyUsd(davlat('a', 'A', { k: t(1000), v: t(9000), val: 'USD' }), bosh), null, "kurs fayli bo'sh: saralash o'chiq");
});

test("saralash: narx bo'yicha arzonidan, narxsizlar oxirida; nom bo'yicha alifbo", () => {
  const x = [
    { nom: 'Polsha', usd: null }, { nom: 'Avstraliya', usd: 30000 }, { nom: 'Germaniya', usd: 12000 }, { nom: 'Italiya', usd: null },
  ];
  assert.deepEqual(saralash(x, 'narx').map((d) => d.nom), ['Germaniya', 'Avstraliya', 'Italiya', 'Polsha']);
  assert.deepEqual(saralash(x, 'nom').map((d) => d.nom), ['Avstraliya', 'Germaniya', 'Italiya', 'Polsha']);
  assert.equal(x[0].nom, 'Polsha', "asl massiv o'zgarmaydi");
});

test('taqqoslash: ko\'pi bilan 3 ta, qayta bosish olib tashlaydi', () => {
  let s: string[] = [];
  for (const d of ['a', 'b', 'c', 'd']) s = taqqosAlmashtir(s, d);
  assert.deepEqual(s, ['a', 'b', 'c']);
  assert.equal(s.length, MAKS_TAQQOS);
  assert.deepEqual(taqqosAlmashtir(s, 'b'), ['a', 'c']);
});

test("URL holati: o'qish va yozish bir-biriga mos, noma'lum qiymatlar tashlanadi", () => {
  const slugs = ['germaniya', 'italiya', 'polsha', 'turkiya'];
  const h = holatniOqi('?f=ingliz,xato,diplom&s=narx&t=italiya,yoq,italiya,germaniya,polsha,turkiya', slugs, true);
  assert.deepEqual(h, { filtrlar: ['diplom', 'ingliz'], saralash: 'narx', tanlov: ['italiya', 'germaniya', 'polsha'] });
  assert.equal(holatniYoz(h), '?f=diplom,ingliz&s=narx&t=italiya,germaniya,polsha');
  assert.equal(holatniOqi('?s=narx', slugs, false).saralash, 'nom', "kurs yo'q: narx saralashi o'chiq");
  assert.equal(holatniYoz({ filtrlar: [], saralash: 'nom', tanlov: [] }), '');
  assert.equal(holatniYoz({ filtrlar: ['grant'], saralash: 'nom', tanlov: [] }, '?boshqa=1&s=narx'), '?boshqa=1&f=grant');
});

test("tasdiqlangan faktlar soni: bo'sh holat uchun", () => {
  assert.equal(tasdiqlanganSoni(davlat('a', 'A')), 0);
  assert.equal(tasdiqlanganSoni(davlat('a', 'A', { k: t(1), dip: q('ha'), ing: t(true) })), 2);
});
