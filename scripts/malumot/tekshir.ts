// npm run malumot:tekshir — Top Admission faktlari hisoboti (Admission D-seriya, Q1).
// Ko'rsatadi: (1) sxema xatolari, (2) muddati o'tgan faktlar, (3) "topilmadi" holatidagi faktlar.
// Ustunlar: fayl, maydon, sana, necha kun o'tgan. Build'ga ulanmagan, build'ni to'xtatmaydi.
// Muddat o'tgani va "topilmadi" xato emas (chiqish kodi 0); faqat sxema xatosi bo'lsa chiqish kodi 1.
// Ishga tushirish: node scripts/malumot/tekshir.ts [--papka <yo'l>] [--bugun YYYY-MM-DD]
import { ESKIRISH_KUNLARI, faktEskirganmi, faktYoshi } from '../../src/lib/topAdmission/fakt.ts';
import { toshkentBugun } from '../../src/lib/muddat.ts';
import { faktlarniYig, ildizArg, malumotniYig } from './umumiy.ts';

const argv = process.argv.slice(2);
const bi = argv.indexOf('--bugun');
const bugun = bi >= 0 && argv[bi + 1] ? argv[bi + 1] : toshkentBugun();
const { yozuvlar, xatolar } = malumotniYig(ildizArg(argv));
const faktlar = faktlarniYig(yozuvlar);

const jadval = (sarlavha: string, qatorlar: string[][]) => {
  console.log(`\n${sarlavha}: ${qatorlar.length} ta`);
  if (!qatorlar.length) return;
  console.log('  fayl | maydon | sana | necha kun o\'tgan');
  for (const q of qatorlar) console.log(`  ${q.join(' | ')}`);
};

console.log(`Top Admission ma'lumoti: ${yozuvlar.length} ta hujjat, ${faktlar.length} ta fakt. Bugun: ${bugun}.`);
console.log(`Eskirish muddati: muddatli ${ESKIRISH_KUNLARI.muddatli} kun, barqaror ${ESKIRISH_KUNLARI.barqaror} kun.`);

if (xatolar.length) {
  console.log(`\nSxema xatolari: ${xatolar.length} ta`);
  for (const x of xatolar) console.log(`  ✗ ${x.fayl} | ${x.maydon} | ${x.xabar}`);
}

jadval(
  "Muddati o'tgan faktlar",
  faktlar.filter((f) => faktEskirganmi(f.fakt, bugun))
    .map((f) => [f.fayl, f.maydon, f.fakt.tekshirilgan_sana ?? '', `${faktYoshi(f.fakt, bugun)} (${f.fakt.turi}, ${f.fakt.holat})`]),
);
jadval(
  '"topilmadi" holatidagi faktlar',
  faktlar.filter((f) => f.fakt.holat === 'topilmadi')
    .map((f) => [f.fayl, f.maydon, f.fakt.tekshirilgan_sana || '-', f.fakt.tekshirilgan_sana ? String(faktYoshi(f.fakt, bugun)) : '-']),
);

if (xatolar.length) process.exitCode = 1;
