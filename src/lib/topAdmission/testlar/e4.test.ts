// Admission E-seriya, E4: grant qo'llanmasi sxemasi va sahifa mantig'i. Hamma ma'lumot ATAYLAB SOXTA ("Sinov granti").
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { faktlarniYig, hujjatniTekshir } from '../../../../scripts/malumot/umumiy.ts';
import type { Fakt } from '../fakt.ts';
import { QOLLANMA_TUGMA, ichkiSahifa, qollanmaYoli } from '../grantKatalog.ts';
import {
  QOLLANMA_OGOH, bosqichKorinadimi, bosqichSanaMatni, bosqichlarRoyxati, faktRoyxati, faqRoyxati, mundarija, qolganMatni,
  qollanmaSahifasiBormi,
} from '../qollanma.ts';

const t = (qiymat: string): Fakt => ({
  qiymat, source_url: 'https://example.org/soxta', manba_iborasi: 'soxta ibora', tekshirilgan_sana: '2026-11-01', turi: 'muddatli', holat: 'tasdiqlangan',
});
const q = (qiymat: string): Fakt => ({ ...t(qiymat), holat: 'qoralama' });
const yoq: Fakt = { turi: 'muddatli', holat: 'topilmadi' };

const qollanma = () => ({
  kim_topshira_oladi: [t('Soxta shart 1'), q('Soxta shart 2'), yoq],
  nimani_qoplaydi_batafsil: [q('Soxta qoplash')],
  hujjatlar: [],
  bosqichlar: [
    { nom: 'Ariza', sana: t('2027-01-10') },
    { nom: 'Intervyu', tavsif: t('Soxta tavsif'), sana: yoq },
    { nom: 'Natija', sana: q('avgust') },
  ],
  ariza_yoli: yoq,
  rasmiy_faq: [{ savol: 'Soxta savol?', javob: t('Soxta javob') }, { savol: 'Ikkinchi?', javob: q('x') }],
  rasmiy_havolalar: [{ nom: 'Soxta portal', url: 'https://example.org/portal' }],
});
const grant = (o: Record<string, unknown> = {}) => ({
  slug: 'sinov-granti', nom: 'Sinov granti', turi: 'davlat', davlat: 'sinoviya', daraja: 'bakalavr',
  nimani_qoplaydi: t('Soxta'), deadline: yoq, rasmiy_havola: 'https://example.org', ...o,
});

test('sxema: qollanma ixtiyoriy; bor bo\'lsa to\'g\'ri shakl o\'tadi', () => {
  assert.deepEqual(hujjatniTekshir('grantlar', grant(), 'g.json'), []);
  assert.deepEqual(hujjatniTekshir('grantlar', grant({ qollanma: qollanma() }), 'g.json'), []);
  const { rasmiy_faq: _, ...faqsiz } = qollanma();
  assert.deepEqual(hujjatniTekshir('grantlar', grant({ qollanma: faqsiz }), 'g.json'), [], 'rasmiy_faq ixtiyoriy');
});

test("sxema: manbasiz qoralama, http havola, ortiqcha maydon va bo'sh nom xato", () => {
  const xatoMaydon = (qo: unknown) => hujjatniTekshir('grantlar', grant({ qollanma: qo }), 'g.json').map((x) => x.maydon).join(' ');
  assert.match(xatoMaydon({ ...qollanma(), hujjatlar: [{ qiymat: 'x', turi: 'muddatli', holat: 'qoralama' }] }), /qollanma\.hujjatlar\.0\.source_url/);
  assert.match(xatoMaydon({ ...qollanma(), rasmiy_havolalar: [{ nom: 'a', url: 'http://example.org' }] }), /qollanma\.rasmiy_havolalar\.0\.url/);
  assert.match(xatoMaydon({ ...qollanma(), maslahat: [] }), /qollanma/);
  assert.match(xatoMaydon({ ...qollanma(), bosqichlar: [{ nom: '', sana: yoq }] }), /qollanma\.bosqichlar\.0\.nom/);
  assert.match(xatoMaydon({ ...qollanma(), bosqichlar: [{ nom: 'a' }] }), /qollanma\.bosqichlar\.0\.sana/, 'bosqich sanasi majburiy (topilmadi bo\'lsa ham)');
});

test('faktlarniYig: ro\'yxatdagi faktlar JSON indeksi bilan (0 dan) yig\'iladi', () => {
  const f = faktlarniYig([{ fayl: 'g.json', kolleksiya: 'grantlar', data: grant({ qollanma: qollanma() }) } as never]);
  const yollar = f.map((x) => x.maydon);
  for (const y of ['qollanma.kim_topshira_oladi.2', 'qollanma.bosqichlar.2.sana', 'qollanma.bosqichlar.1.tavsif', 'qollanma.rasmiy_faq.0.javob', 'qollanma.ariza_yoli']) {
    assert.ok(yollar.includes(y), y);
  }
  assert.equal(f.filter((x) => x.fakt.holat === 'qoralama').length, 4);
});

test("ro'yxat: faqat tasdiqlangan bandlar, qolgani soni", () => {
  const r = faktRoyxati(qollanma().kim_topshira_oladi);
  assert.deepEqual(r.korinadi.map((x) => x.qiymat), ['Soxta shart 1']);
  assert.equal(r.tekshirilmoqda, 2);
  assert.equal(qolganMatni(r.tekshirilmoqda, r.korinadi.length), 'Yana 2 ta band tekshirilmoqda');
  assert.equal(qolganMatni(1, 0), '', 'hech biri ko\'rinmasa "Ma\'lumot tekshirilmoqda" (sahifa), son emas');
  assert.equal(qolganMatni(0, 3), '');
  assert.deepEqual(faktRoyxati(undefined), { korinadi: [], tekshirilmoqda: 0 });
});

test('bosqich: sana yoki tavsif tasdiqlangan bo\'lsa ko\'rinadi; nom yolg\'iz chiqmaydi', () => {
  const b = qollanma().bosqichlar;
  assert.deepEqual(b.map(bosqichKorinadimi), [true, true, false]);
  const r = bosqichlarRoyxati(b);
  assert.deepEqual(r.korinadi.map((x) => x.nom), ['Ariza', 'Intervyu']);
  assert.equal(r.tekshirilmoqda, 1);
  assert.equal(bosqichSanaMatni('2027-01-10'), '10.01.2027');
  assert.equal(bosqichSanaMatni('yanvar–fevral'), 'yanvar–fevral');
});

test('FAQ: javobi tasdiqlanganlari; mundarijada faqat FAQ bo\'lsa', () => {
  const r = faqRoyxati(qollanma().rasmiy_faq);
  assert.deepEqual(r.korinadi.map((x) => x.savol), ['Soxta savol?']);
  assert.equal(r.tekshirilmoqda, 1);
  assert.ok(mundarija(qollanma()).some((m) => m.id === 'faq'));
  assert.ok(!mundarija({ rasmiy_faq: undefined }).some((m) => m.id === 'faq'));
  assert.ok(!mundarija({ rasmiy_faq: [] }).some((m) => m.id === 'faq'));
});

test("sahifa va katalog tugmasi: qollanma bo'lsa; Türkiye Bursları o'z sahifasida", () => {
  assert.equal(qollanmaSahifasiBormi({ slug: 'sinov-granti', qollanma: qollanma() }), true);
  assert.equal(qollanmaSahifasiBormi({ slug: 'sinov-granti' }), false);
  assert.equal(qollanmaSahifasiBormi({ slug: 'turkiye-burslari', qollanma: qollanma() }), false);
  assert.equal(qollanmaYoli('sinov-granti'), '/uz/top-admission/grantlar/sinov-granti/');

  const ichki = ichkiSahifa({ slug: 'sinov-granti', turi: 'davlat', davlat: 'sinoviya', qollanma: qollanma() });
  assert.deepEqual({ yol: ichki?.yol, nomi: ichki?.nomi }, { yol: '/uz/top-admission/grantlar/sinov-granti/', nomi: QOLLANMA_TUGMA });
  assert.equal(ichkiSahifa({ slug: 'turkiye-burslari', turi: 'davlat', davlat: 'turkiya', qollanma: qollanma() })?.yol, '/uz/top-admission/turkiye-burslari/');
  assert.equal(ichkiSahifa({ slug: 'sinov-granti', turi: 'davlat', davlat: 'sinoviya' }), undefined);
  assert.equal(QOLLANMA_OGOH, "Grant shartlari har yili o'zgaradi. Topshirishdan oldin rasmiy sahifani tekshiring.");
});
