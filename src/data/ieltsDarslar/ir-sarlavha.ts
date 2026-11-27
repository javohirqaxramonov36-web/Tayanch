// IELTS Reading: "Matching headings" (IE02). 5 ta mashq: bitta paragraf, to'rt sarlavha, eng mosini tanlash.
// Paragraflar Tayanch uchun yozilgan, vaziyatlar o'ylab topilgan (namuna): ular haqiqiy joy yoki voqea haqida ma'lumot emas.
// Haqiqiy imtihonda sarlavhalar ro'yxati bir nechta paragrafga beriladi; bu yerda har mashq bitta paragraf.
// Noto'g'ri variantda xato = shu sarlavhani tanlatadigan tipik xato (detal, kalit so'z, juda keng, matnda yo'q).
// Ikkinchi usul: tekshiruv.ts (har sarlavha paragraf qismlari bo'yicha qamrov jadvali bilan baholanadi).
import type { DarsSavol } from './turlar';

const MATN = 'Which heading best summarises the main idea of the paragraph?';

export const irSarlavhaSavollar: DarsSavol[] = [
  {
    id: 'ir-sarlavha-1',
    modul: 'ir-sarlavha',
    mavzu: "Main idea and introduction",
    qiyinlik: 'oson',
    parcha: 'Many small towns have lost their weekly markets as large supermarkets opened nearby. In one hill town, however, the market has grown. Farmers now sell there every Saturday, and the town has added a covered area so that the market can continue in winter. Local people say it is busier than it has been for decades.',
    matn: MATN,
    variantlar: [
      { matn: 'How supermarkets changed shopping', xato: "Fooled by the opening sentence: supermarkets are only background; the paragraph is not about them" },
      { matn: 'A market that grew against the trend' },
      { matn: 'A new roof for the winter months', xato: "Taking a detail for the main idea: the covered area is only one example" },
      { matn: 'The history of farming in the region', xato: "Fooled by a key word: \"farmers\" appears, but there is no history of farming" },
    ],
    togri: 1,
    yechim: "The first sentence gives the general situation; the main idea comes after \"however\": in this town the market grew instead. The other sentences show this with examples.",
    verified: false,
  },
  {
    id: 'ir-sarlavha-2',
    modul: 'ir-sarlavha',
    mavzu: "Positive and negative results",
    qiyinlik: "o'rta",
    parcha: 'A city school tried starting lessons an hour later for one term. Teachers recorded fewer students arriving late, and many students said they felt less tired in morning classes. However, some parents found the new timetable difficult because it no longer matched their working hours.',
    matn: MATN,
    variantlar: [
      { matn: 'Why students arrive late', xato: "Fooled by a key word: lateness is mentioned, but its cause is not explained" },
      { matn: "Parents' working hours", xato: "Taking a detail for the main idea: parents are only one result" },
      { matn: 'Mixed results from a later school day' },
      { matn: 'Students feel less tired', xato: "Taking a part for the whole: only the positive side, without the part after \"However\"" },
    ],
    togri: 2,
    yechim: "The paragraph has two sides: a benefit for students and a difficulty for parents. The heading that covers both is \"mixed results\".",
    verified: false,
  },
  {
    id: 'ir-sarlavha-3',
    modul: 'ir-sarlavha',
    mavzu: "Problem and solution",
    qiyinlik: "o'rta",
    parcha: 'When the neighbourhood first put out recycling bins, very little was collected, because people were unsure what could go in them. The council then printed simple pictures on each bin showing which items belonged inside. Within months, the amount of correctly sorted waste had risen sharply.',
    matn: MATN,
    variantlar: [
      { matn: 'The cost of new recycling bins', xato: "An idea not in the text: nothing is said about cost" },
      { matn: 'Confusion among residents', xato: "Taking a part for the whole: only the problem, without the solution and result" },
      { matn: 'Why recycling matters for the planet', xato: "Too broad: the paragraph is about one neighbourhood" },
      { matn: 'Clear pictures solve a sorting problem' },
    ],
    togri: 3,
    yechim: "Structure: problem (not knowing what goes where), solution (pictures), result (more correct sorting). Only one heading covers all three parts.",
    verified: false,
  },
  {
    id: 'ir-sarlavha-4',
    modul: 'ir-sarlavha',
    mavzu: "A view the writer rejects",
    qiyinlik: 'qiyin',
    parcha: 'Translators are often imagined as people who simply replace each word with its equal in another language. In practice, the work involves constant choices. A joke may have to be replaced by a different joke, and a polite phrase in one culture may sound cold in another. Good translators therefore think about the effect on the reader as much as the meaning of the words.',
    matn: MATN,
    variantlar: [
      { matn: 'Translation as a series of choices about effect' },
      { matn: 'Translating jokes', xato: "Taking a detail for the main idea: jokes are only an example" },
      { matn: 'A common view of translators', xato: "Taking the rejected view for the main idea: the writer denies the idea in the first sentence" },
      { matn: 'Learning a second language', xato: "Fooled by a key word: \"language\" appears, but the paragraph is not about learning a language" },
    ],
    togri: 0,
    yechim: "The first sentence is a common view, and \"In practice\" rejects it. The main idea: translation is a series of choices, and the last sentence links them to the effect on the reader.",
    verified: false,
  },
  {
    id: 'ir-sarlavha-5',
    modul: 'ir-sarlavha',
    mavzu: "Change: before and now",
    qiyinlik: 'qiyin',
    parcha: "For years, the old railway bridge was seen as an ugly reminder of the town's lost industry, and several plans to pull it down were discussed. A group of residents argued that it could be useful instead. Today it carries a footpath and a cycle lane, and it has become one of the most photographed places in the town.",
    matn: MATN,
    variantlar: [
      { matn: 'Plans to pull down the bridge', xato: "Taking a part for the whole: only the \"before\" part, and the plans never happened" },
      { matn: 'The decline of local industry', xato: "Taking background for the main idea: industry only explains why people disliked the bridge" },
      { matn: 'A popular place for photographers', xato: "Taking a detail for the main idea: photography is only the final result" },
      { matn: 'From unwanted structure to valued landmark' },
    ],
    togri: 3,
    yechim: "The paragraph is about change: a bridge once seen as useless is now a valued place. Only this heading covers both the beginning and the end.",
    verified: false,
  },
];
