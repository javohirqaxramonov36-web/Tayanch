// npm run malumot:tasdiq — "qoralama" holatidagi hamma faktdan muallif uchun tasdiq ro'yxati (Admission D-seriya, Q1).
// Natija: docs/tekshiruv/tasdiq-royxati.md. Har qator: fayl, maydon, qiymat, source_url, manba_iborasi.
// Muallif havolani ochib, iborani Cmd+F bilan qidiradi va mos bo'lsa faktning holatini "tasdiqlangan" qiladi.
// Ishga tushirish: node scripts/malumot/tasdiq.ts [--papka <yo'l>] [--chiqish <fayl>]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { toshkentBugun } from '../../src/lib/muddat.ts';
import { faktQiymatMatni } from '../../src/lib/topAdmission/fakt.ts';
import { REPO, faktlarniYig, ildizArg, katak, malumotniYig } from './umumiy.ts';

const argv = process.argv.slice(2);
const ci = argv.indexOf('--chiqish');
const chiqish = ci >= 0 && argv[ci + 1] ? resolve(process.cwd(), argv[ci + 1]) : join(REPO, 'docs/tekshiruv/tasdiq-royxati.md');

const { yozuvlar, xatolar } = malumotniYig(ildizArg(argv));
const qoralama = faktlarniYig(yozuvlar).filter((f) => f.fakt.holat === 'qoralama');

const satrlar = [
  '# Top Admission: tasdiq ro\'yxati',
  '',
  `Avtomatik yaratilgan (\`npm run malumot:tasdiq\`, ${toshkentBugun()}). Qo'lda tahrirlamang: fayl har ishga tushirishda qayta yoziladi.`,
  '',
  'Qanday tasdiqlanadi: havolani oching, "Manba iborasi" ni sahifada Cmd+F bilan qidiring. Ibora bor va qiymat unga mos bo\'lsa,',
  'ma\'lumot faylida shu faktning `holat` ini `"tasdiqlangan"` qiling. Mos bo\'lmasa, faktni tuzating yoki `"topilmadi"` qiling.',
  '',
  `Qoralama faktlar: ${qoralama.length} ta.`,
  '',
];
if (qoralama.length) {
  satrlar.push('| # | Fayl | Maydon | Qiymat | source_url | Manba iborasi |', '|---|---|---|---|---|---|');
  qoralama.forEach((f, i) => satrlar.push(
    `| ${i + 1} | ${katak(f.fayl)} | ${katak(f.maydon)} | ${katak(faktQiymatMatni(f.fakt.qiymat))} | ${katak(f.fakt.source_url)} | ${katak(f.fakt.manba_iborasi)} |`,
  ));
} else {
  satrlar.push('Hozircha tasdiq kutayotgan fakt yo\'q.');
}
if (xatolar.length) {
  satrlar.push('', `Diqqat: ma'lumotda ${xatolar.length} ta sxema xatosi bor (\`npm run malumot:tekshir\`).`);
}

mkdirSync(dirname(chiqish), { recursive: true });
writeFileSync(chiqish, satrlar.join('\n') + '\n');
console.log(`${relative(REPO, chiqish)}: ${qoralama.length} ta qoralama fakt.`);
if (xatolar.length) { console.log(`Sxema xatolari: ${xatolar.length} ta (npm run malumot:tekshir).`); process.exitCode = 1; }
