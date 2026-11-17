// SAT Reading & Writing: "O'tish so'zlari" (Expression of Ideas). 5 ta mashq.
// Matnlar Tayanch uchun yozilgan, College Board savollaridan ko'chirilmagan va parafraz qilinmagan.
// Vaziyatlar o'ylab topilgan (namuna). Har savolda 4 variant 4 xil ma'no munosabatidan:
// qarama-qarshilik, sabab-natija, misol, davom. Noto'g'ri variantda xato = nega bu munosabat mos emas.
// Ikkinchi usul: rw-tekshiruv.ts (munosabat jadvali bo'yicha har variant alohida baholanadi).
import type { DarsSavol } from './turlar';

const XATO = {
  zid: 'A contrast word: sentence 2 does not go against sentence 1',
  sabab: 'A cause-and-effect word: sentence 2 is not a result of sentence 1',
  misol: 'An example word: sentence 2 is not a specific example of the general idea in sentence 1',
  davom: 'An addition word: sentence 2 does not add a new idea in the same direction',
};

export const rwOtishSavollar: DarsSavol[] = [
  {
    id: 'rw-otish-1',
    modul: 'rw-otish',
    mavzu: 'Contrast: a common belief and a fact',
    qiyinlik: 'oson',
    matn: 'Many people assume that cacti need almost no water. ______ most cactus species grow faster and flower more often when they are watered regularly during the warm months.',
    variantlar: [
      { matn: 'For example,', xato: XATO.misol },
      { matn: 'However,' },
      { matn: 'As a result,', xato: XATO.sabab },
      { matn: 'Moreover,', xato: XATO.davom },
    ],
    togri: 1,
    yechim: 'Sentence 1 is what many people assume (cacti need almost no water); sentence 2 is a fact that goes against it (they grow better when watered regularly). Relationship: contrast, so "However,".',
    verified: false,
  },
  {
    id: 'rw-otish-2',
    modul: 'rw-otish',
    mavzu: 'Cause and effect: an event and its consequence',
    qiyinlik: 'oson',
    matn: "The village's only road was buried under a landslide in early spring. ______ the weekly market was moved to a field on the other side of the river until the repairs were finished.",
    variantlar: [
      { matn: 'Nevertheless,', xato: XATO.zid },
      { matn: 'For instance,', xato: XATO.misol },
      { matn: 'Therefore,' },
      { matn: 'In addition,', xato: XATO.davom },
    ],
    togri: 2,
    yechim: 'The buried road is the cause; moving the market to another place is its result. Relationship: cause and effect, so "Therefore,".',
    verified: false,
  },
  {
    id: 'rw-otish-3',
    modul: 'rw-otish',
    mavzu: 'Example: a general idea and a specific case',
    qiyinlik: "o'rta",
    matn: 'Some birds use tools to reach food they could not get otherwise. ______ certain crows bend thin twigs into hooks and use them to pull insects out of narrow holes in tree bark.',
    variantlar: [
      { matn: 'Consequently,', xato: XATO.sabab },
      { matn: 'Furthermore,', xato: XATO.davom },
      { matn: 'However,', xato: XATO.zid },
      { matn: 'For instance,' },
    ],
    togri: 3,
    yechim: 'Sentence 1 is a general idea (some birds use tools); sentence 2 is a specific case of it (crows make hooks from twigs). It is not a new idea but an example of the same idea. So "For instance,".',
    verified: false,
  },
  {
    id: 'rw-otish-4',
    modul: 'rw-otish',
    mavzu: 'Addition: a second benefit in the same direction',
    qiyinlik: "o'rta",
    matn: "Planting trees along the school's parking lot kept the parked cars noticeably cooler in summer. ______ the trees' roots helped hold the soil in place during heavy rain, so less mud washed onto the nearby path.",
    variantlar: [
      { matn: 'In addition,' },
      { matn: 'In contrast,', xato: XATO.zid },
      { matn: 'For example,', xato: XATO.misol },
      { matn: 'As a result,', xato: XATO.sabab },
    ],
    togri: 0,
    yechim: 'Both sentences are about the benefits of the trees: one is shade, the other is holding the soil. The roots holding the soil is not a result of the cars staying cool. Relationship: addition, so "In addition,".',
    verified: false,
  },
  {
    id: 'rw-otish-5',
    modul: 'rw-otish',
    mavzu: 'Contrast: in spite of the drawbacks',
    qiyinlik: 'qiyin',
    matn: "The team's first prototype of the water filter was heavy, slow, and expensive to build. ______ it removed nearly all of the sediment from the river water during the field test, so the engineers decided to keep its basic design.",
    variantlar: [
      { matn: 'Therefore,', xato: 'A cause-and-effect word: the "so" trap at the end of the sentence; the filter cleaning well does not follow from its being heavy and expensive' },
      { matn: 'Specifically,', xato: XATO.misol },
      { matn: 'Nevertheless,' },
      { matn: 'Furthermore,', xato: 'An addition word: sentence 1 is about drawbacks, sentence 2 about an achievement; they do not go in the same direction' },
    ],
    togri: 2,
    yechim: 'Sentence 1 lists the drawbacks; sentence 2 states an achievement in spite of them. Relationship: contrast (concession), so "Nevertheless,". The "so" in sentence 2 is a different connection: it links the achievement and the decision.',
    verified: false,
  },
];
