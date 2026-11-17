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
    mavzu: 'Comma: two independent clauses',
    qiyinlik: 'oson',
    matn: g1.matn,
    belgilash: g1.belgilash,
    variantlar: [
      { matn: 'hours, however, students', xato: 'A comma with "however": a conjunctive adverb cannot join two independent clauses with a comma (comma splice)' },
      { matn: 'hours; students' },
      { matn: 'hours students', xato: 'Run-on sentence: there is no punctuation at all between the two independent clauses' },
      { matn: 'hours, students', xato: 'Comma splice: the two independent clauses are joined by a comma alone' },
    ],
    togri: 1,
    yechim: '"The library extended its weekend hours" and "students can now study there until midnight": each has a subject and a verb, so both are independent clauses. Two independent clauses cannot be joined by a comma alone; a semicolon joins them correctly.',
    verified: false,
  },
  {
    id: 'rw-xato-2',
    modul: 'rw-xato',
    mavzu: 'Semicolon',
    qiyinlik: "o'rta",
    matn: g2.matn,
    belgilash: g2.belgilash,
    variantlar: [
      { matn: 'repairs: the bus', xato: 'A colon after an incomplete sentence: the "Because …" part is not an independent clause' },
      { matn: 'repairs. The bus', xato: 'The dependent part is split off as a separate sentence (fragment): "Because the bridge was closed for repairs." is not a complete sentence' },
      { matn: 'repairs, the bus' },
      { matn: 'repairs; the bus', xato: 'A semicolon after a dependent part: a semicolon needs an independent clause on both sides' },
    ],
    togri: 2,
    yechim: 'The part that begins with "Because" is dependent (it is not a complete sentence on its own). When a dependent part comes at the start of a sentence, a comma separates it from the main clause. A semicolon goes only between two independent clauses.',
    verified: false,
  },
  {
    id: 'rw-xato-3',
    modul: 'rw-xato',
    mavzu: 'Colon',
    qiyinlik: 'oson',
    matn: g3.matn,
    belgilash: g3.belgilash,
    variantlar: [
      { matn: 'requires: flour', xato: 'A colon after an incomplete sentence: the verb "requires" is separated from its object' },
      { matn: 'requires; flour', xato: 'A semicolon before a list: the part that follows is not an independent clause' },
      { matn: 'requires, flour', xato: 'An unnecessary comma between a verb and its object' },
      { matn: 'requires flour' },
    ],
    togri: 3,
    yechim: 'A colon must come after a complete sentence. "The recipe requires" is not complete: the verb "requires" needs its object (flour, butter, and two eggs). No punctuation goes between a verb and its object.',
    verified: false,
  },
  {
    id: 'rw-xato-4',
    modul: 'rw-xato',
    mavzu: 'Subject-verb agreement',
    qiyinlik: 'qiyin',
    matn: g4.matn,
    belgilash: g4.belgilash,
    variantlar: [
      { matn: 'was donated' },
      { matn: 'being donated', xato: 'An -ing form instead of a finite verb: the sentence is left without a main verb (fragment)' },
      { matn: 'were donated', xato: 'The subject and verb do not agree: the verb agrees with the nearby "letters", but the subject is "collection" (singular)' },
      { matn: 'was donating', xato: 'Wrong voice: "by a local family" calls for the passive voice, but "was donating" is active' },
    ],
    togri: 0,
    yechim: 'The subject is "collection" (singular); "of old letters" only describes it. So the verb is singular: "was". "by a local family" tells who did the action, so the passive voice is needed: "was donated".',
    verified: false,
  },
  {
    id: 'rw-xato-5',
    modul: 'rw-xato',
    mavzu: 'Verb tense',
    qiyinlik: "o'rta",
    matn: g5.matn,
    belgilash: g5.belgilash,
    variantlar: [
      { matn: 'has planted', xato: 'Present Perfect with a specific past time: Present Perfect is not used with "Last winter"' },
      { matn: 'will plant', xato: 'Future tense: "Last winter" refers to past time' },
      { matn: 'planted' },
      { matn: 'plants', xato: 'Present tense for a past event: "Last winter" calls for the past tense' },
    ],
    togri: 2,
    yechim: '"Last winter" is a specific time that is already over. A finished action at a specific past time is expressed with the Past Simple: "planted". "still enjoy" in the second part of the sentence is a present situation, so it stays in the present tense.',
    verified: false,
  },
];
