// SAT Reading & Writing: "Xatoni toping" (Standard English Conventions). 5 ta mashq.
// Tayanch uchun yozilgan, College Board savollaridan ko'chirilmagan va parafraz qilinmagan.
// Gap shabloni: xato bo'lak [kvadrat qavs] ichida. Har noto'g'ri variant bitta tipik xatodan kelib chiqadi.
// Ikkinchi usul: tekshiruv.ts (qoida jadvali bo'yicha har variant alohida baholanadi).
import type { DarsSavol } from './turlar';
import type { SozBelgilash } from '../darsTurlar';

/** Shablonni bo'laklarga ajratadi: so'zlar va tinish belgilari alohida, [..] ichidagisi bitta bo'lak va xato joyi. */
function bolakla(shablon: string): { matn: string; belgilash: SozBelgilash } {
  const bolaklar: string[] = [];
  let togriBolak = -1;
  for (const qism of shablon.split(/(\[[^\]]+\])/)) {
    if (!qism) continue;
    if (qism.startsWith('[')) { togriBolak = bolaklar.length; bolaklar.push(qism.slice(1, -1)); continue; }
    for (const m of qism.matchAll(/[A-Za-z'’-]+|[,.;:!?]/g)) bolaklar.push(m[0]);
  }
  const matn = bolaklar.reduce((s, b, i) => (i === 0 ? b : /^[,.;:!?]$/.test(b) ? s + b : `${s} ${b}`), '');
  return { matn, belgilash: { tur: 'soz', bolaklar, togriBolak } };
}

const g1 = bolakla('The library extended its weekend hours[,] students can now study there until midnight.');
const g2 = bolakla('Because the bridge was closed for repairs[;] the bus took a longer route through the valley.');
const g3 = bolakla('The recipe requires[:] flour, butter, and two eggs.');
const g4 = bolakla('The collection of old letters [were donated] to the town archive by a local family.');
const g5 = bolakla('Last winter, the city [plants] hundreds of trees along the river, and residents still enjoy the shade they provide.');

export const rwXatoSavollar: DarsSavol[] = [
  {
    id: 'rw-xato-1',
    modul: 'rw-xato',
    mavzu: 'Vergul: ikki mustaqil gap',
    qiyinlik: 'oson',
    matn: g1.matn,
    belgilash: g1.belgilash,
    variantlar: [
      { matn: 'hours, however, students', xato: "\"however\" bilan vergul: bog'lovchi ravish ikki mustaqil gapni vergul bilan ulay olmaydi (comma splice)" },
      { matn: 'hours; students' },
      { matn: 'hours students', xato: "Belgisiz qo'shilgan gap (run-on): ikki mustaqil gap orasida hech qanday belgi yo'q" },
      { matn: 'hours, students', xato: "Vergul bilan qo'shilgan gap (comma splice): ikki mustaqil gap faqat vergul bilan ulangan" },
    ],
    togri: 1,
    yechim: "\"The library extended its weekend hours\" va \"students can now study there until midnight\": ikkalasida ham ega va kesim bor, ya'ni ikkalasi mustaqil gap. Ikki mustaqil gap faqat vergul bilan ulanmaydi; nuqtali vergul ularni to'g'ri bog'laydi.",
    verified: false,
  },
  {
    id: 'rw-xato-2',
    modul: 'rw-xato',
    mavzu: 'Nuqtali vergul',
    qiyinlik: "o'rta",
    matn: g2.matn,
    belgilash: g2.belgilash,
    variantlar: [
      { matn: 'repairs: the bus', xato: "Ikki nuqta to'liq bo'lmagan gapdan keyin: \"Because …\" qismi mustaqil gap emas" },
      { matn: 'repairs. The bus', xato: "Tobe qism alohida gap qilib ajratilgan (fragment): \"Because the bridge was closed for repairs.\" to'liq gap emas" },
      { matn: 'repairs, the bus' },
      { matn: 'repairs; the bus', xato: "Nuqtali vergul tobe qismdan keyin: nuqtali vergulning ikki tomonida mustaqil gap bo'lishi kerak" },
    ],
    togri: 2,
    yechim: "\"Because\" bilan boshlangan qism tobe (o'zi to'liq gap emas). Tobe qism gap boshida kelsa, asosiy gapdan vergul bilan ajratiladi. Nuqtali vergul esa faqat ikki mustaqil gap orasida turadi.",
    verified: false,
  },
  {
    id: 'rw-xato-3',
    modul: 'rw-xato',
    mavzu: 'Ikki nuqta',
    qiyinlik: 'oson',
    matn: g3.matn,
    belgilash: g3.belgilash,
    variantlar: [
      { matn: 'requires: flour', xato: "Ikki nuqta to'liq bo'lmagan gapdan keyin: \"requires\" fe'li to'ldiruvchisidan ajratilgan" },
      { matn: 'requires; flour', xato: "Nuqtali vergul ro'yxat oldidan: keyingi qism mustaqil gap emas" },
      { matn: 'requires, flour', xato: "Fe'l va to'ldiruvchi orasida ortiqcha vergul" },
      { matn: 'requires flour' },
    ],
    togri: 3,
    yechim: "Ikki nuqtadan oldin to'liq gap turishi kerak. \"The recipe requires\" to'liq emas: \"requires\" fe'li to'ldiruvchini (flour, butter, and two eggs) kutadi. Fe'l va uning to'ldiruvchisi orasiga hech qanday belgi qo'yilmaydi.",
    verified: false,
  },
  {
    id: 'rw-xato-4',
    modul: 'rw-xato',
    mavzu: "Ega va fe'l moslashuvi",
    qiyinlik: 'qiyin',
    matn: g4.matn,
    belgilash: g4.belgilash,
    variantlar: [
      { matn: 'was donated' },
      { matn: 'being donated', xato: "Tuslangan fe'l o'rniga -ing shakli: gapda asosiy fe'l qolmaydi (fragment)" },
      { matn: 'were donated', xato: "Ega va fe'l mos emas: fe'l yaqindagi \"letters\" ga moslashtirilgan, ega esa \"collection\" (birlik)" },
      { matn: 'was donating', xato: "Nisbat noto'g'ri: \"by a local family\" majhul nisbatni talab qiladi, \"was donating\" aniq nisbat" },
    ],
    togri: 0,
    yechim: "Ega \"collection\" (birlik); \"of old letters\" faqat uni aniqlaydi. Shuning uchun fe'l birlikda: \"was\". \"by a local family\" ishni kim qilganini aytadi, demak majhul nisbat kerak: \"was donated\".",
    verified: false,
  },
  {
    id: 'rw-xato-5',
    modul: 'rw-xato',
    mavzu: 'Zamon',
    qiyinlik: "o'rta",
    matn: g5.matn,
    belgilash: g5.belgilash,
    variantlar: [
      { matn: 'has planted', xato: "Present Perfect aniq o'tgan vaqt bilan: \"Last winter\" bilan Present Perfect ishlatilmaydi" },
      { matn: 'will plant', xato: "Kelasi zamon: \"Last winter\" o'tgan vaqtni bildiradi" },
      { matn: 'planted' },
      { matn: 'plants', xato: "Hozirgi zamon o'tgan voqea uchun: \"Last winter\" o'tgan zamonni talab qiladi" },
    ],
    togri: 2,
    yechim: "\"Last winter\" o'tib ketgan, aniq vaqt. Aniq o'tgan vaqtdagi tugagan ish Past Simple bilan aytiladi: \"planted\". Gapning ikkinchi qismidagi \"still enjoy\" esa hozirgi holat, u hozirgi zamonda qoladi.",
    verified: false,
  },
];
