// Admission E-seriya, E1: Q9 javoblari bo'yicha sxema va mantiq. Hamma ma'lumot ATAYLAB SOXTA ("Sinov universiteti" va h.k.).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hujjatniTekshir } from '../../../../scripts/malumot/umumiy.ts';
import type { Fakt, Kurslar } from '../fakt.ts';
import {
  BOSH_HOLAT, KAMIDA_DAVLATLAR, ehtiyojIzohiKerakmi, foundationKerakmi, ieltsYoqmi, kamidami, moslik, uniXulosasi,
  type DavlatYashash, type MoslikHolati, type UniKirish,
} from '../universitetMoslik.ts';
import { MUDDAT_OTGAN_MATNI, deadlineSanasi, muddatHolati } from '../grantKatalog.ts';
import { GRANT_TOPILMADI_MATNI, grantYoqIzohi, tasdiqlanganSoni, type DavlatKirish } from '../davlatTaqqos.ts';

const t = <Q extends string | number | boolean>(qiymat: Q): Fakt => ({
  qiymat, source_url: 'https://example.org/soxta', manba_iborasi: 'soxta ibora', tekshirilgan_sana: '2026-11-01', turi: 'muddatli', holat: 'tasdiqlangan',
});
const q = <Q extends string | number | boolean>(qiymat: Q): Fakt => ({ ...t(qiymat), holat: 'qoralama' });
const yoq: Fakt = { turi: 'muddatli', holat: 'topilmadi' };
const KURS: Kurslar = { manba_url: 'https://example.org/kurs', sana: '2026-11-01', kurslar: { GBP: 1.25, KRW: 0.001 } };
const YASHASH: DavlatYashash = { viza_yashash_summasi: t(10000), valyuta: 'GBP' };

const uni = (slug: string, o: Partial<UniKirish> = {}): UniKirish => ({
  slug, nom: slug, davlat: 'aqsh', min_ielts: t(6.5), yillik_xarajat: t(40000), valyuta: 'USD',
  xalqaro_yordam_turi: t('need-based'), ...o,
});
const uk = (o: Partial<UniKirish> = {}) => uni('sinov-uk', { davlat: 'buyuk-britaniya', valyuta: 'GBP', yillik_xarajat: yoq, kontrakt_eng_past: t(20000), ...o });
const h = (o: Partial<MoslikHolati> = {}): MoslikHolati => ({ ...BOSH_HOLAT, ...o });

test('kamida: kontrakt_eng_past + davlat viza yashash summasi, ikkalasi USD da', () => {
  assert.deepEqual([...KAMIDA_DAVLATLAR], ['buyuk-britaniya', 'janubiy-koreya']);
  const x = uniXulosasi(uk(), KURS, YASHASH);
  assert.deepEqual(x.kamida, { kontraktUsd: 25000, yashashUsd: 12500 });
  assert.equal(x.xarajatUsd, 37500, "jami = qismlar yig'indisi");
  // Koreya: davlat valyutasi universitetnikidan farq qilishi mumkin
  const kr = uniXulosasi(uni('sinov-kr', { davlat: 'janubiy-koreya', valyuta: 'KRW', kontrakt_eng_past: t(5_000_000) }), KURS, { viza_yashash_summasi: t(10000), valyuta: 'USD' });
  assert.equal(kr.xarajatUsd, 15000);
});

test('kamida: biror qism tasdiqlanmagan yoki kurs yo\'q → "tekshirilmoqda"', () => {
  for (const [nom, x] of [
    ['kontrakt qoralama', uniXulosasi(uk({ kontrakt_eng_past: q(20000) }), KURS, YASHASH)],
    ['viza summasi topilmadi', uniXulosasi(uk(), KURS, { viza_yashash_summasi: yoq, valyuta: 'GBP' })],
    ['davlat berilmagan', uniXulosasi(uk(), KURS, null)],
    ['kurs yo\'q', uniXulosasi(uk(), null, YASHASH)],
  ] as const) {
    assert.equal(x.xarajatUsd, null, nom);
    assert.equal(x.kamida, undefined, nom);
    assert.equal(moslik(x, h()).guruh, 'tekshirilmoqda', nom);
  }
});

test('kamida faqat UK/Koreya va maydon bo\'lsa; AQSH har doim yillik_xarajat', () => {
  assert.equal(kamidami(uni('a', { kontrakt_eng_past: t(1) })), false, 'AQSH');
  assert.equal(kamidami(uni('b', { davlat: 'buyuk-britaniya' })), false, "maydon yo'q (eski fayl)");
  assert.equal(kamidami(uk()), true);
  const aqsh = uniXulosasi(uni('a', { kontrakt_eng_past: t(1) }), KURS, YASHASH);
  assert.equal(aqsh.xarajatUsd, 40000);
  assert.equal(aqsh.kamida, undefined);
  // UK yillik_xarajat tasdiqlangan bo'lsa ham "kamida" rejimida ishlatilmaydi
  assert.equal(uniXulosasi(uk({ yillik_xarajat: t(1) }), KURS, YASHASH).xarajatUsd, 37500);
});

test('kamida: byudjet bilan solishtirish', () => {
  const x = uniXulosasi(uk(), KURS, YASHASH);
  assert.equal(moslik(x, h({ byudjet: 37500 })).guruh, 'mos');
  assert.deepEqual(moslik(x, h({ byudjet: 37499 })), { guruh: 'yetmaydi', ieltsPast: false, qimmat: true });
});

test('IELTS: faqat "minimum" saralaydi; "tavsiya" va "talab_qilinmaydi" ta\'sir qilmaydi', () => {
  const min = uniXulosasi(uni('a', { ielts_holati: 'minimum', min_ielts: t(7) }), null);
  assert.equal(min.ielts, 7);
  assert.equal(moslik(min, h({ ielts: 6.5 })).guruh, 'yetmaydi');

  const tav = uniXulosasi(uni('b', { ielts_holati: 'tavsiya', min_ielts: t(7.5), ielts_tavsiya: t(7) }), null);
  assert.equal(tav.ielts, null, "min_ielts tasdiqlangan bo'lsa ham ishlatilmaydi");
  assert.equal(tav.ieltsYoq, true);
  assert.deepEqual(moslik(tav, h({ ielts: 4 })), { guruh: 'mos', ieltsPast: false, qimmat: false });

  const tq = uniXulosasi(uni('c', { ielts_holati: 'talab_qilinmaydi', min_ielts: yoq, imtihonlar: t('IELTS talab qilinmaydi') }), null);
  assert.equal(tq.ieltsYoq, true);
  assert.equal(moslik(tq, h({ ielts: 4, faqatMos: true })).guruh, 'mos');
});

test('IELTS: dalil fakti tasdiqlanmagan yoki "topilmadi" → "tekshirilmoqda"', () => {
  const holatlar: UniKirish[] = [
    uni('a', { ielts_holati: 'tavsiya', ielts_tavsiya: q(7) }),
    uni('b', { ielts_holati: 'tavsiya' }),
    uni('c', { ielts_holati: 'talab_qilinmaydi', imtihonlar: q('x') }),
    uni('d', { ielts_holati: 'topilmadi', min_ielts: t(6) }),
    uni('e', { min_ielts: q(6) }),
  ];
  for (const u of holatlar) {
    const x = uniXulosasi(u, null);
    assert.equal(x.ieltsYoq, undefined, u.slug);
    assert.equal(moslik(x, h()).guruh, 'tekshirilmoqda', u.slug);
  }
  assert.equal(ieltsYoqmi({ ielts_holati: undefined }), false, "maydon yo'q = minimum");
});

test('foundation va to\'liq ehtiyoj izohi faqat tasdiqlangan faktdan', () => {
  assert.equal(foundationKerakmi({ foundation_kerak: t('ha') }), true);
  assert.equal(foundationKerakmi({ foundation_kerak: q('ha') }), false);
  assert.equal(foundationKerakmi({ foundation_kerak: t('dasturga_qarab') }), false);
  assert.equal(foundationKerakmi({}), false);
  assert.equal(ehtiyojIzohiKerakmi({ toliq_ehtiyoj: true, xalqaro_yordam_turi: t('need') }), true);
  assert.equal(ehtiyojIzohiKerakmi({ toliq_ehtiyoj: true, xalqaro_yordam_turi: q('need') }), false);
  assert.equal(ehtiyojIzohiKerakmi({ xalqaro_yordam_turi: t('need') }), false);
});

test("deadline o'tgan: matn va hisob (faqat tasdiqlangan sana)", () => {
  assert.equal(MUDDAT_OTGAN_MATNI, "Bu yilgi muddat o'tgan, keyingisi hali e'lon qilinmagan");
  assert.equal(muddatHolati(deadlineSanasi(t('2026-01-15')), '2026-11-20'), 'otgan');
  assert.equal(muddatHolati(deadlineSanasi(t('2026-11-20')), '2026-11-20'), 'kelajak');
  assert.equal(muddatHolati(deadlineSanasi(q('2026-01-15')), '2026-11-20'), 'nomalum');
});

const davlat = (grant: DavlatKirish['grant']): DavlatKirish => ({
  slug: 'sinoviya', nom_uz: 'Sinoviya',
  narx: { kontrakt_yillik: yoq, viza_yashash_summasi: yoq, valyuta: 'USD' }, grant,
  til: { ingliz_tilida_dastur_bor: yoq, odatiy_ielts: yoq },
  ishlash: { oqish_paytida: yoq, bitirgandan_keyin: yoq },
  diplom: { togridan_togri: yoq },
});

test('davlat: "grant topilmadi" izohi faqat grantlar bo\'sh va izoh tasdiqlangan bo\'lsa', () => {
  assert.equal(GRANT_TOPILMADI_MATNI, "Rasmiy manbalarda o'zbek fuqarosi uchun davlat granti topilmadi");
  const izoh = t('topilmadi');
  assert.equal(grantYoqIzohi(davlat({ davlat_grantlari: [], izoh })), izoh);
  assert.equal(grantYoqIzohi(davlat({ davlat_grantlari: [], izoh: q('x') })), null);
  assert.equal(grantYoqIzohi(davlat({ davlat_grantlari: ['sinov-grant'], izoh })), null);
  assert.equal(grantYoqIzohi(davlat({ davlat_grantlari: [] })), null);
  assert.equal(tasdiqlanganSoni(davlat({ davlat_grantlari: [], izoh })), 1);
  assert.equal(tasdiqlanganSoni(davlat({ davlat_grantlari: [] })), 0);
});

// ---------- Sxema: yangi maydonlar ixtiyoriy ----------
const uniJson = () => ({
  slug: 'sinov-uni', nom: 'Sinov universiteti', davlat: 'buyuk-britaniya',
  imtihonlar: yoq, min_ielts: yoq, yillik_xarajat: yoq, valyuta: 'GBP', ariza_tolovi: yoq,
  tolovdan_ozod_qilish: yoq, xalqaro_yordam_turi: yoq, deadline: yoq,
});

test("sxema: universitet yangi maydonlarsiz ham, ular bilan ham o'tadi; noto'g'ri qiymat xato", () => {
  assert.deepEqual(hujjatniTekshir('universitetlar', uniJson(), 'f'), []);
  const toliq = {
    ...uniJson(), kontrakt_eng_past: q(20000), ielts_holati: 'tavsiya', ielts_tavsiya: q(7),
    foundation_kerak: q('dasturga_qarab'), toliq_ehtiyoj: true,
  };
  assert.deepEqual(hujjatniTekshir('universitetlar', toliq, 'f'), []);
  const maydonlar = hujjatniTekshir('universitetlar', { ...uniJson(), ielts_holati: 'balki', foundation_kerak: q('albatta'), ielts_tavsiya: q(12) }, 'f')
    .map((x) => x.maydon).sort();
  assert.deepEqual(maydonlar, ['foundation_kerak.qiymat', 'ielts_holati', 'ielts_tavsiya.qiymat']);
});

const grantJson = () => ({
  slug: 'sinov-grant', nom: 'Sinov granti', turi: 'universitet', davlat: 'aqsh', daraja: 'bakalavr',
  nimani_qoplaydi: yoq, deadline: yoq, rasmiy_havola: 'https://example.org',
});

test("sxema: to'liq ehtiyojga asoslangan grantga \"to'liq qoplaydi\" qo'yilmaydi", () => {
  assert.deepEqual(hujjatniTekshir('grantlar', { ...grantJson(), toliq_ehtiyoj: true }, 'f'), []);
  assert.deepEqual(hujjatniTekshir('grantlar', { ...grantJson(), toliq_ehtiyoj: true, toliq_qoplaydi: q(false) }, 'f'), []);
  const x = hujjatniTekshir('grantlar', { ...grantJson(), toliq_ehtiyoj: true, toliq_qoplaydi: q(true) }, 'f');
  assert.deepEqual(x.map((e) => e.maydon), ['toliq_qoplaydi']);
});

test("sxema: davlat grant.izoh Fakt bo'lishi mumkin; eski oddiy matn o'tadi, lekin ko'rsatilmaydi", () => {
  const d = (izoh: unknown) => ({
    slug: 'sinoviya', nom_uz: 'Sinoviya', chuqur_qollanma: false,
    narx: { kontrakt_yillik: yoq, viza_yashash_summasi: yoq, valyuta: 'USD' },
    grant: { davlat_grantlari: [], ...(izoh === undefined ? {} : { izoh }) },
    til: { ingliz_tilida_dastur_bor: yoq, odatiy_ielts: yoq },
    ishlash: { oqish_paytida: yoq, bitirgandan_keyin: yoq },
    diplom: { togridan_togri: yoq },
  });
  assert.deepEqual(hujjatniTekshir('davlatlar', d(undefined), 'f'), []);
  assert.deepEqual(hujjatniTekshir('davlatlar', d(q('topilmadi')), 'f'), []);
  assert.deepEqual(hujjatniTekshir('davlatlar', d('oddiy matn'), 'f'), []);
  assert.equal(grantYoqIzohi(davlat({ davlat_grantlari: [], izoh: 'oddiy matn' })), null);
  assert.ok(hujjatniTekshir('davlatlar', d({ turi: 'muddatli', holat: 'tasdiqlangan' }), 'f').length > 0, 'manbasiz tasdiqlangan izoh xato');
});
