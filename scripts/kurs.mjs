import { argumentlar, xatoBilanChiq } from './savol/umumiy.mjs';
import { katalogniOqi } from './kurs/katalog.mjs';
import { kursniTekshir } from './kurs/tekshir.mjs';

const a = argumentlar();
const importSinovi = process.argv[2] === 'dry-run';
const bayroqlar = importSinovi ? ['papka'] : ['papka', 'katalog', 'hashlar', 'nashr'];

try {
  if (a._.length !== (importSinovi ? 1 : 0) || Object.keys(a).some((k) => k !== '_' && !bayroqlar.includes(k))
      || (a.papka !== undefined && typeof a.papka !== 'string')
      || bayroqlar.some((k) => k !== 'papka' && a[k] !== undefined && a[k] !== true)
      || (a.katalog && Object.keys(a).length !== 2) || (a.hashlar && a.nashr)) {
    throw new Error('Noma’lum yoki mos kelmaydigan argument');
  }
  if (a.katalog) {
    const katalog = katalogniOqi();
    console.log('Mavzu | Foundation | Core | Advanced | mini_test | Jami | SPR');
    for (const m of katalog) console.log([m.id, ...Object.values(m.counts), m.total, m.spr].join(' | '));
    console.log(`MVP: ${katalog.length} mavzu, ${katalog.reduce((n, m) => n + m.total, 0)} savol.`);
  } else {
    const { xatolar, natijalar, reja } = kursniTekshir({ papka: a.papka });
    if (xatolar.length) xatoBilanChiq(xatolar.join('\n'));
    const tasdiq = natijalar.filter((n) => n.reviewed).length;
    if (importSinovi) console.log('DRY-RUN. Tarmoq, baza va fayl yozuvi yo‘q.');
    console.log(`6 mavzu, ${natijalar.length} savol. Tasdiqlangan: ${tasdiq}. Qoralama: ${natijalar.length - tasdiq}. Importga tayyor: ${reja.length}.`);
    if (a.hashlar) for (const n of natijalar.filter((x) => !x.reviewed)) console.log(`${n.joy} ${n.hash}`);
    if ((importSinovi || a.nashr) && !reja.length) xatoBilanChiq('MVP uchun 200 ta tasdiqlangan savol kerak');
  }
} catch (e) {
  xatoBilanChiq(e.message);
}
