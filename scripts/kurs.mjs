import { aiNomimi, argumentlar, xatoBilanChiq } from './savol/umumiy.mjs';
import { katalogniOqi } from './kurs/katalog.mjs';
import { idsOqi, kursTasdiqla, mavzuniKochir, nashrMalumoti } from './kurs/nashr.mjs';
import { importSqlYoz } from './kurs/importSql.mjs';
import { kursniTekshir } from './kurs/tekshir.mjs';

const a = argumentlar();
const amal = a._[0] ?? 'tekshir';
const mavzuId = typeof a.mavzu === 'string' ? a.mavzu.toUpperCase() : undefined;
const staging = a.staging === true;
const bayroqlar = {
  tekshir: ['papka', 'mavzu', 'staging', 'katalog', 'hashlar', 'nashr'],
  'dry-run': ['papka', 'mavzu', 'staging', 'sql'],
  kochir: ['papka', 'mavzu'],
  tasdiqla: ['papka', 'mavzu', 'kim', 'sinov'],
};

try {
  if (!Object.hasOwn(bayroqlar, amal) || a._.length > 1
      || Object.keys(a).some((k) => k !== '_' && !bayroqlar[amal].includes(k))
      || ['papka', 'kim'].some((k) => a[k] !== undefined && typeof a[k] !== 'string')
      || ['katalog', 'hashlar', 'nashr', 'staging', 'sinov', 'sql'].some((k) => a[k] !== undefined && a[k] !== true)
      || (a.mavzu !== undefined && !mavzuId)
      || (a.katalog && Object.keys(a).length !== 2) || (a.hashlar && a.nashr)
      || ((['kochir', 'tasdiqla'].includes(amal) || a.sql) && !mavzuId)
      || (a.sql && staging)) {
    throw new Error('Noma’lum yoki mos kelmaydigan argument');
  }
  if (a.katalog) {
    const katalog = katalogniOqi();
    console.log('Mavzu | Foundation | Core | Advanced | mini_test | Jami | SPR');
    for (const m of katalog) console.log([m.id, ...Object.values(m.counts), m.total, m.spr].join(' | '));
    console.log(`MVP: ${katalog.length} mavzu, ${katalog.reduce((n, m) => n + m.total, 0)} savol.`);
  } else {
    const kim = typeof a.kim === 'string' ? a.kim.trim() : process.env.TAYANCH_MUALLIF?.trim();
    if (amal === 'tasdiqla' && (!kim || aiNomimi(kim))) throw new Error('Inson tasdiqlovchisi kerak: --kim yoki TAYANCH_MUALLIF');
    const natija = kursniTekshir({ papka: a.papka, mavzuId, staging: staging || ['tasdiqla', 'kochir'].includes(amal), muallif: kim });
    const { katalog, xatolar, natijalar, reja } = natija;
    if (xatolar.length) xatoBilanChiq(xatolar.join('\n'));
    const tasdiq = natijalar.filter((n) => n.reviewed).length;
    if (amal === 'dry-run') console.log('DRY-RUN. Tarmoq va bazaga yozuv yo‘q.');
    console.log(`${mavzuId ?? katalog.length + ' mavzu'}, ${natijalar.length} savol. Tasdiqlangan: ${tasdiq}. Qoralama: ${natijalar.length - tasdiq}. Importga tayyor: ${reja.length}.`);
    if (a.hashlar) for (const n of natijalar.filter((x) => !x.reviewed)) console.log(`${n.joy} ${n.hash}`);
    if ((amal === 'dry-run' || amal === 'kochir' || a.nashr) && !reja.length) {
      xatoBilanChiq(mavzuId ? `${mavzuId}: muallifning to‘liq tasdig‘i kerak (Coming soon)`
        : `MVP uchun ${katalog.reduce((n, m) => n + m.total, 0)} ta tasdiqlangan savol kerak`);
    }
    if (amal === 'tasdiqla') {
      const idlar = idsOqi(a.papka, katalog[0]);
      kursTasdiqla({ papka: a.papka, natija, kim, idlar, sinov: a.sinov });
      console.log(`${a.sinov ? 'Sinov. ' : ''}Ko‘rik ro‘yxati: ${idlar.length} savol.`);
    }
    if (amal === 'kochir') mavzuniKochir(a.papka, katalog[0]);
    if (a.sql) {
      importSqlYoz(a.papka, katalog[0], reja);
      const { savollar, miniTest } = nashrMalumoti(reja);
      console.log(`Xususiy import.sql tayyor. ${savollar} savol, mini-testda ${miniTest} savol.`);
    }
  }
} catch (e) {
  xatoBilanChiq(e.message);
}
