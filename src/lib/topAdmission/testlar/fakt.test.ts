// Admission D-seriya, Q1: Fakt sxemasi, ko'rinish va eskirish. Fixture'lar ATAYLAB SOXTA (tests/fixtures/topAdmission/).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, readFileSync as oqi } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { hujjatniTekshir, malumotniYig, faktlarniYig, REPO } from '../../../../scripts/malumot/umumiy.ts';
import { ESKIRISH_KUNLARI, faktEskirganmi, faktKorinadimi, faktQiymatMatni, kurslarBormi, usdga, type Fakt } from '../fakt.ts';
import { kurslarSxema } from '../sxema.ts';

const FIX = join(REPO, 'tests/fixtures/topAdmission');
const fixture = (n: string) => JSON.parse(readFileSync(join(FIX, 'davlatlar', `${n}.json`), 'utf8'));

test("fixture 1 (to'g'ri) o'tadi", () => {
  assert.deepEqual(hujjatniTekshir('davlatlar', fixture('sinoviya-togri'), 'togri'), []);
});

test("fixture 2 (source_url'siz qoralama) xato beradi: fayl va maydon ko'rsatiladi", () => {
  const x = hujjatniTekshir('davlatlar', fixture('sinoviya-manbasiz'), 'sinoviya-manbasiz.json');
  assert.equal(x.length, 1);
  assert.equal(x[0].fayl, 'sinoviya-manbasiz.json');
  assert.equal(x[0].maydon, 'narx.kontrakt_yillik.source_url');
});

test('fixture 3 ("topilmadi", manbasiz) o\'tadi', () => {
  assert.deepEqual(hujjatniTekshir('davlatlar', fixture('sinoviya-topilmadi'), 'topilmadi'), []);
});

test("tasdiqlangan/qoralama: qiymat, manba_iborasi, sana ham majburiy; https va sana shakli", () => {
  const d = fixture('sinoviya-togri');
  d.til.odatiy_ielts = { turi: 'muddatli', holat: 'tasdiqlangan', source_url: 'http://example.org', tekshirilgan_sana: '2026-02-30' };
  const maydonlar = hujjatniTekshir('davlatlar', d, 'f').map((x) => x.maydon).sort();
  assert.deepEqual(maydonlar, ['til.odatiy_ielts.manba_iborasi', 'til.odatiy_ielts.qiymat', 'til.odatiy_ielts.source_url', 'til.odatiy_ielts.tekshirilgan_sana']);
  const e = fixture('sinoviya-togri');
  delete e.narx.kontrakt_yillik.holat;
  assert.deepEqual(hujjatniTekshir('davlatlar', e, 'f').map((x) => x.maydon), ['narx.kontrakt_yillik.holat']);
});

test('papka yig\'ish: 3 hujjat, 1 xato, faktlar yo\'li bilan', () => {
  const { yozuvlar, xatolar } = malumotniYig(FIX);
  assert.equal(yozuvlar.length, 3);
  assert.equal(xatolar.length, 1);
  const f = faktlarniYig(yozuvlar);
  assert.ok(f.some((q) => q.maydon === 'diplom.togridan_togri'));
  assert.equal(f.filter((q) => q.fakt.holat === 'topilmadi').length, 1);
});

test("faktKorinadimi: faqat tasdiqlangan", () => {
  const f = (holat: Fakt['holat']): Fakt => ({ qiymat: 1, turi: 'muddatli', holat });
  assert.equal(faktKorinadimi(f('tasdiqlangan')), true);
  assert.equal(faktKorinadimi(f('qoralama')), false);
  assert.equal(faktKorinadimi(f('topilmadi')), false);
  assert.equal(faktKorinadimi(undefined), false);
});

test('faktEskirganmi: muddatli 60, barqaror 180 kun (chegara kuni hali eskirmagan)', () => {
  assert.deepEqual({ ...ESKIRISH_KUNLARI }, { muddatli: 60, barqaror: 180 });
  const f = (turi: Fakt['turi'], sana?: string): Fakt => ({ qiymat: 1, turi, holat: 'tasdiqlangan', tekshirilgan_sana: sana });
  assert.equal(faktEskirganmi(f('muddatli', '2026-09-21'), '2026-11-20'), false); // 60 kun
  assert.equal(faktEskirganmi(f('muddatli', '2026-09-20'), '2026-11-20'), true); // 61 kun
  assert.equal(faktEskirganmi(f('barqaror', '2026-05-24'), '2026-11-20'), false); // 180 kun
  assert.equal(faktEskirganmi(f('barqaror', '2026-05-23'), '2026-11-20'), true); // 181 kun
  assert.equal(faktEskirganmi(f('muddatli'), '2026-11-20'), false);
});

test("faktQiymatMatni", () => {
  assert.equal(faktQiymatMatni(true), 'Ha');
  assert.equal(faktQiymatMatni(false), "Yo'q");
  assert.equal(faktQiymatMatni(25000), '25 000');
  assert.equal(faktQiymatMatni(6.5), '6.5');
  assert.equal(faktQiymatMatni('dasturga_qarab'), 'Dasturga qarab');
  assert.equal(faktQiymatMatni(null), '');
});

test("kurslar: bo'sh fayl to'g'ri, lekin ishlatilmaydi; kurs bo'lsa USD ga o'giradi", () => {
  const bosh = JSON.parse(readFileSync(join(REPO, 'src/data/topAdmission/kurslar.json'), 'utf8'));
  assert.equal(kurslarSxema.safeParse(bosh).success, true);
  assert.equal(kurslarBormi(bosh), false);
  assert.equal(usdga(100, 'GBP', bosh), null);
  assert.equal(usdga(100, 'USD', bosh), 100);
  const soxta = { manba_url: 'https://example.org/soxta', sana: '2026-11-01', kurslar: { GBP: 2 } };
  assert.equal(kurslarSxema.safeParse(soxta).success, true);
  assert.equal(usdga(100, 'GBP', soxta), 200);
  assert.equal(usdga(100, 'KRW', soxta), null);
  assert.equal(kurslarSxema.safeParse({ ...soxta, manba_url: '' }).success, false);
});

test("malumot:tasdiq skripti qoralama faktlardan jadval yozadi", () => {
  const chiqish = join(mkdtempSync(join(tmpdir(), 'tasdiq-')), 'r.md');
  try {
    execFileSync(process.execPath, [join(REPO, 'scripts/malumot/tasdiq.ts'), '--papka', FIX, '--chiqish', chiqish], { stdio: 'pipe' });
  } catch { /* fixture'da ataylab 1 sxema xatosi bor: chiqish kodi 1 */ }
  const md = oqi(chiqish, 'utf8');
  assert.match(md, /\| Fayl \| Maydon \| Qiymat \| source_url \| Manba iborasi \|/);
  assert.match(md, /sinoviya-togri\.json \| narx\.viza_yashash_summasi \| 2 000 \| https:\/\/example\.org/);
});
