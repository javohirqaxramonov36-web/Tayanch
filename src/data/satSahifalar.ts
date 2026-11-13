// SAT bo'limining sahifalari va sidebar guruhlari.
// Manzillar taklif (S1 vazifasi). Hamma sahifa hozircha "tez orada" va holati "qoralama".
// Tavsiflarda fakt yo'q: faqat sahifada nima bo'lishi yozilgan. Fakt qo'shilsa, manba ID si ham qo'shiladi.
// Matn inglizcha (SAT bo'limi qoidasi, CLAUDE.md); qism (URL) va kod nomlari o'zbekcha qoladi.

export type SatTuri = 'mashq' | 'vosita' | 'qollanma';

export interface SatSahifa {
  /** /uz/sat/ dan keyingi qism, oxirida / bilan: "mashq/test/" */
  qism: string;
  nomi: string;
  tavsif: string;
  turi: SatTuri;
  manbalar: string[];
  tekshirilmagan: string[];
  /** true: sahifa o'z ekrani bilan qurilgan (dizayndagi interaktiv ekran) */
  tayyor?: boolean;
}

export interface SatGuruh {
  nomi: string;
  sahifalar: SatSahifa[];
}

const UMUMIY_TEKSHIRILMAGAN = 'The page content has not been written yet: for now there is only a title and a plan.';

export const satGuruhlar: SatGuruh[] = [
  {
    nomi: 'Practice',
    sahifalar: [
      {
        qism: 'mashq/test/',
        tayyor: true,
        nomi: 'Test',
        tavsif: 'Short practice tests in Reading & Writing and Math. For a full mock test, links to official materials are provided.',
        turi: 'mashq',
        manbalar: ['CB01'],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, 'The practice questions have not been written yet; they are not copied from other sites.'],
      },
      {
        // P30: hisob bilan ishlaydi. Imtihon ekrani satIchkiSahifalar dagi 'mashq/mock/imtihon/'.
        qism: 'mashq/mock/',
        tayyor: true,
        nomi: 'Mock test',
        tavsif: 'A full-length, timed practice test in four modules, built from questions written and checked by the author. The score is a rough estimate, not an official SAT score.',
        turi: 'mashq',
        manbalar: ['CB03', 'CB41', 'CB42'],
        tekshirilmagan: [
          'The mock test is not adaptive: the second module of each section has the same mix of difficulty as the first.',
          'The estimated score is a simple Tayanch formula, not the College Board scoring method.',
          'The test opens only when the bank has at least 8 checked questions in every skill.',
        ],
      },
      {
        qism: 'mashq/bank/',
        tayyor: true,
        nomi: 'Question bank',
        tavsif: 'Pick SAT skills, set the difficulty and start a practice session with questions checked by the author.',
        turi: 'mashq',
        manbalar: ['CB02'],
        tekshirilmagan: [
          'Question counts come from the Tayanch database and appear only after you sign in. The bank is empty until the author publishes checked questions.',
        ],
      },
      {
        qism: 'vosita/natijalar/',
        tayyor: true,
        nomi: 'My results',
        tavsif: 'A list of your answers and mistakes in the exercises. Data is saved only in this browser. No score is calculated.',
        turi: 'vosita',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN],
      },
      {
        qism: 'vosita/reja/',
        tayyor: true,
        nomi: 'Study planner',
        tavsif: 'A weekly prep list built from your test date and target score. Data is saved only in this browser. No score is guaranteed.',
        turi: 'vosita',
        manbalar: ['CB01', 'CB04'],
        tekshirilmagan: ['The weekly tasks are a Tayanch recommendation, not an official plan.', 'The score step (10) is not stated on the official page: it is used in the input field for convenience.'],
      },
      {
        qism: 'vosita/rasmiy-testlar/',
        tayyor: true,
        nomi: 'Test tracker',
        tavsif: 'Log the scores and mistakes from your Bluebook practice tests and real SAT attempts, and see which skills you miss most. Only your own entries: no questions are stored and no score is estimated.',
        turi: 'vosita',
        manbalar: ['CB01', 'CB03', 'CB04'],
        tekshirilmagan: [
          'The score step (10) is not stated on the official page: it is used in the fields for convenience.',
          'Questions per module (27 and 22) are the CB03 section totals split equally between two modules.',
        ],
      },
      {
        qism: 'vosita/takrorlash/',
        tayyor: true,
        nomi: 'Mistake log: review',
        tavsif: 'Review the exercises you got wrong in lessons at intervals: tomorrow, then after 3, 7 and 14 days. Data stays only in this browser. No score is calculated.',
        turi: 'vosita',
        manbalar: [],
        tekshirilmagan: ['The review intervals are a Tayanch choice, not an official recommendation.'],
      },
      {
        qism: 'vosita/ai-tutor/',
        tayyor: true,
        nomi: 'AI tutor',
        tavsif: 'Ask an AI tutor about a mistake on a Tayanch practice question or about an SAT skill in your own words. Answers can be wrong; explanations of your mistakes are checked against the answer key.',
        turi: 'vosita',
        manbalar: [],
        tekshirilmagan: [
          'The tutor is off until the author sets the AI key, a monthly budget and plan limits.',
          'Answers come from an AI model and can contain mistakes. Only the final answer of a mistake explanation is checked, not every step.',
        ],
      },
    ],
  },
  {
    nomi: 'Math lessons',
    sahifalar: [
      {
        qism: 'qollanma/math/hajm/',
        tayyor: true,
        nomi: 'Volume lab',
        tavsif: 'The volume of a cylinder, cone, sphere and prism in a 3D scene: change the dimensions, see the formula, 6 exercises.',
        turi: 'qollanma',
        manbalar: ['CB05'],
        tekshirilmagan: ['The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".'],
      },
      {
        qism: 'qollanma/math/grafik/',
        tayyor: true,
        nomi: 'Function graphs',
        tavsif: 'A straight line, three forms of a parabola and the intersection of two equations: change the graph with sliders, 5 exercises.',
        turi: 'qollanma',
        manbalar: ['CB05'],
        tekshirilmagan: ['The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".'],
      },
      {
        qism: 'qollanma/math/birlik-aylana/',
        tayyor: true,
        nomi: 'Unit circle',
        tavsif: 'Drag the angle to see the sin, cos and tan values, switch between degrees and radians, 5 exercises.',
        turi: 'qollanma',
        manbalar: ['CB05'],
        tekshirilmagan: ['The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".'],
      },
      {
        qism: 'qollanma/math/statistika/',
        tayyor: true,
        nomi: 'Statistics',
        tavsif: 'Drag the points to see how the mean, median and standard deviation change, 5 exercises.',
        turi: 'qollanma',
        manbalar: ['CB05'],
        tekshirilmagan: ['The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".', 'Standard deviation uses the population formula (divided by n).'],
      },
    ],
  },
  {
    nomi: 'Reading & Writing lessons',
    sahifalar: [
      {
        qism: 'qollanma/reading-writing/xatoni-toping/',
        tayyor: true,
        nomi: 'Find the error',
        tavsif: 'Tap the word or punctuation mark with the error in a sentence, then fix it: commas, semicolons, colons, subject and verb, tense. 5 exercises.',
        turi: 'qollanma',
        manbalar: ['CB06'],
        tekshirilmagan: ['The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".'],
      },
      {
        qism: 'qollanma/reading-writing/dalil/',
        tayyor: true,
        nomi: 'Mark the evidence',
        tavsif: 'In a short text, mark the sentence that supports the claim and tell the trap sentences apart. 5 exercises.',
        turi: 'qollanma',
        manbalar: ['CB06'],
        tekshirilmagan: ['The texts and questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".'],
      },
      {
        qism: 'qollanma/reading-writing/otish-sozlari/',
        tayyor: true,
        nomi: 'Transition words',
        tavsif: 'Find the relationship between two sentences (contrast, cause and effect, example, continuation) and choose the matching transition word. 5 exercises.',
        turi: 'qollanma',
        manbalar: ['CB06'],
        tekshirilmagan: ['The texts and questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".', 'The relationship table is a Tayanch recommendation, not an official classification.'],
      },
      {
        qism: 'qollanma/reading-writing/lugat-kontekstda/',
        tayyor: true,
        nomi: 'Vocabulary in context',
        tavsif: "Find a word's meaning from the context clue in the sentence: words with several meanings, tone, and the primary-meaning trap. 5 exercises.",
        turi: 'qollanma',
        manbalar: ['CB06'],
        tekshirilmagan: ['The texts and questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".'],
      },
    ],
  },
  {
    nomi: 'Reading',
    sahifalar: [
      {
        qism: 'mashq/kitoblar/',
        nomi: 'Books',
        tavsif: 'A reading list for your prep. Only free or openly licensed materials, with links.',
        turi: 'mashq',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, 'The license of each material on the list is checked separately.'],
      },
      {
        qism: 'mashq/lugat/',
        tayyor: true,
        nomi: 'Vocabulary',
        tavsif: 'Flashcards for words that appear in Reading & Writing texts.',
        turi: 'mashq',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, 'The source of the word list has not been decided yet.'],
      },
    ],
  },
  {
    nomi: 'Guides',
    sahifalar: [
      {
        qism: 'qollanma/qayerdan-boshlash/',
        tayyor: true,
        nomi: 'Where to start',
        tavsif: 'Answer four questions and get a step-by-step self-study path, plus a map of free official resources.',
        turi: 'qollanma',
        manbalar: ['CB20', 'CB21', 'CB27'],
        tekshirilmagan: ['The steps and their order are a Tayanch recommendation, not an official plan.'],
      },
      {
        qism: 'qollanma/strategiya/',
        nomi: 'Strategy',
        tavsif: "Where to start your prep and how to plan it: based on the author's experience.",
        turi: 'qollanma',
        manbalar: ['CB02'],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN],
      },
      {
        qism: 'qollanma/math-desmos/',
        nomi: 'Math and Desmos',
        tavsif: 'Ways to use the Desmos calculator and formulas in the Math section.',
        turi: 'qollanma',
        manbalar: ['CB26', 'DS01'],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, 'The official source used here does not say which Desmos modes are available or whether Desmos is in Bluebook practice tests: still to be checked.'],
      },
      {
        qism: 'qollanma/reading-writing/',
        tayyor: true,
        nomi: 'Reading & Writing',
        tavsif: 'The four Reading & Writing question domains, a way to work each one, and what to do after a mistake. Linked to Tayanch lessons and the question bank.',
        turi: 'qollanma',
        manbalar: ['CB06'],
        tekshirilmagan: ['The steps are a Tayanch recommendation, not official advice. The official page does not give the number of questions per domain.'],
      },
      {
        qism: 'qollanma/vaqt/',
        nomi: 'Timing and retakes',
        tavsif: 'Pacing your time in the test and planning a retake.',
        turi: 'qollanma',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, 'An official source for test timing and retake rules has not been added to the source log yet.'],
      },
    ],
  },
  {
    nomi: 'Account',
    sahifalar: [
      {
        // 2026-11-13: SAT "men" markazi (maqsad, afzalliklar, saqlangan ish, tarif). Hisob sozlamalari 1-qavatda.
        qism: 'hisob/profil/',
        tayyor: true,
        nomi: 'My SAT profile',
        tavsif: 'Your SAT goal and test date, study preferences, saved work and plan in one place.',
        turi: 'vosita',
        manbalar: [],
        tekshirilmagan: ['Saved work counts have not been checked with a real account yet.'],
      },
      {
        qism: 'hisob/obuna/',
        tayyor: true,
        nomi: 'Plans',
        tavsif: 'Choose a SAT plan and pay through inPAY. Each payment covers one prepaid period; nothing renews automatically.',
        turi: 'vosita',
        manbalar: ['IP03'],
        tekshirilmagan: ['Prices and usage limits are not set yet.'],
      },
      {
        qism: 'hisob/fikr/',
        tayyor: true,
        nomi: 'Send feedback',
        tavsif: 'Send a short message to the Tayanch author about the SAT section: what works, what is missing, what to fix.',
        turi: 'vosita',
        manbalar: [],
        tekshirilmagan: ['The daily message limit is a starting value and may change.'],
      },
      {
        // P34: o'quvchi guruhlari va ulashish; guruh tarifli o'qituvchi uchun guruhlar va natija (docs/qarorlar/004-guruhlar.md).
        qism: 'guruh/',
        tayyor: true,
        nomi: 'Groups',
        tavsif: "Join your teacher's group and choose what they can see. Teachers on the group plan can follow their students' practice.",
        turi: 'vosita',
        manbalar: [],
        tekshirilmagan: [
          'The consent rules for students under 18 still need a lawyer\'s review.',
          'The group plan is not on sale yet: the author opens it for teachers by hand.',
        ],
      },
    ],
  },
];

export const satSahifalar: SatSahifa[] = satGuruhlar.flatMap((g) => g.sahifalar);

export const turiNomi: Record<SatTuri | 'bolim-kirishi', string> = {
  'bolim-kirishi': 'Section home',
  mashq: 'Practice',
  vosita: 'Tool',
  qollanma: 'Guide',
};

/** Yon panel guruhlari (dizayn rejasi B, 3-bosqich, muallif tanlovi 2026-11-09).
 *  SAT kirish sahifasi va sahifa yo'li `satGuruhlar` dan foydalanadi, u o'zgarmaydi.
 *  "Coming soon": hali yozilmagan sahifalar (tayyor emas) yon panelda havola emas. */
export interface SatYonGuruh {
  nomi: string;
  qismlar: { nomi?: string; sahifalar: SatSahifa[] }[];
  tezOrada?: boolean;
}

const s = (qism: string) => {
  const t = satSahifalar.find((x) => x.qism === qism);
  if (!t) throw new Error(`satYonGuruhlar: ${qism} topilmadi`);
  return t;
};

export const satYonGuruhlar: SatYonGuruh[] = [
  { nomi: 'Start here', qismlar: [{ sahifalar: ['qollanma/qayerdan-boshlash/'].map(s) }] },
  { nomi: 'Guides', qismlar: [{ sahifalar: ['qollanma/reading-writing/'].map(s) }] },
  {
    nomi: 'Lessons',
    qismlar: [
      { nomi: 'Math', sahifalar: ['hajm', 'grafik', 'birlik-aylana', 'statistika'].map((q) => s(`qollanma/math/${q}/`)) },
      { nomi: 'Reading & Writing', sahifalar: ['xatoni-toping', 'dalil', 'otish-sozlari', 'lugat-kontekstda'].map((q) => s(`qollanma/reading-writing/${q}/`)) },
    ],
  },
  { nomi: 'Practice', qismlar: [{ sahifalar: ['mashq/test/', 'mashq/mock/', 'mashq/bank/', 'mashq/lugat/'].map(s) }] },
  { nomi: 'Tools', qismlar: [{ sahifalar: ['vosita/natijalar/', 'vosita/rasmiy-testlar/', 'vosita/reja/', 'vosita/takrorlash/', 'vosita/ai-tutor/'].map(s) }] },
  { nomi: 'Account', qismlar: [{ sahifalar: ['hisob/profil/', 'hisob/obuna/', 'hisob/fikr/', 'guruh/'].map(s) }] },
  { nomi: 'Coming soon', tezOrada: true, qismlar: [{ sahifalar: satSahifalar.filter((x) => !x.tayyor) }] },
];

// Har tayyor sahifa yon panelda aynan bir marta bo'lishi kerak (yangi sahifa qo'shilsa build eslatadi).
{
  const yonda = satYonGuruhlar.flatMap((g) => g.qismlar.flatMap((q) => q.sahifalar));
  const yoq = satSahifalar.filter((x) => !yonda.includes(x));
  if (yoq.length || new Set(yonda).size !== yonda.length) {
    throw new Error(`satYonGuruhlar: yon panelda yo'q yoki takroriy sahifa: ${yoq.map((x) => x.qism).join(', ')}`);
  }
}

/** Namuna (demo) sahifalari: `noindex` (SatFokus), yon panelda va `satGuruhlar` da yo'q (P06, muallif qarori 2026-11-09). */
export const satNamunaSahifalar: SatSahifa[] = [
  {
    qism: 'vosita/savol-namuna/',
    tayyor: true,
    nomi: 'Question viewer',
    tavsif: 'A sample of the component that shows SAT practice questions: multiple choice and student-produced response, formulas, figures and passages.',
    turi: 'vosita',
    manbalar: [],
    tekshirilmagan: ['The sample questions were written for Tayanch and still need the author\'s review.'],
  },
];

/**
 * Ichki fokus sahifalari: faqat boshqa sahifadan ochiladi (masalan Savol banki → sessiya, ?id= bilan),
 * shuning uchun yon panelda va `satGuruhlar` da yo'q. SatFokus qolipi: noindex.
 */
export const satIchkiSahifalar: SatSahifa[] = [
  {
    // P08: manzil ?id=<session_id> (javoblar URL da emas). Savol banki start javobini sessionStorage "tayanch:sat-sessiya" ga ham yozadi.
    qism: 'mashq/sessiya/',
    tayyor: true,
    nomi: 'Practice session',
    tavsif: 'Solve the questions you picked in the question bank, one at a time, timed or untimed, and review your mistakes.',
    turi: 'mashq',
    manbalar: ['CB03'],
    tekshirilmagan: [
      'Timed mode gives about 71 seconds per Reading and Writing question and about 95 seconds per Math question, worked out from the official section times. The real test times each module, not each question.',
      'The time limit is kept by this page. The server does not yet reject answers sent after the time is up.',
    ],
  },
  {
    // P30: manzil ?id=<attempt_id>. Holat serverda (mock_attempts), brauzerda faqat yuborilmagan javoblar navbati.
    qism: 'mashq/mock/imtihon/',
    tayyor: true,
    nomi: 'Mock test',
    tavsif: 'Take a full-length mock test: two Reading and Writing modules, a 10-minute break, then two Math modules.',
    turi: 'mashq',
    manbalar: ['CB03', 'CB41', 'CB42'],
    tekshirilmagan: [
      'Module times (32 and 35 minutes) and the break (10 minutes) follow the official test. The real test also has unscored pretest questions; this mock does not.',
      'The estimated score is a simple Tayanch formula, not the College Board scoring method.',
    ],
  },
  {
    // P12: yon panelda emas (2026-11-13 dan My SAT profile o'rnida); profil, SAT bosh sahifasi va onboarding'dan ochiladi.
    qism: 'hisob/maqsad/',
    tayyor: true,
    nomi: 'Goal and test date',
    tavsif: 'Set your target SAT score, your best score so far and your test date. You can change them any time.',
    turi: 'vosita',
    manbalar: ['CB04', 'CB14'],
    tekshirilmagan: ['Whether every official date is offered at test centers in Uzbekistan.'],
  },
  {
    // P34: taklif kodi bilan guruhga qo'shilish (Groups sahifasidan va o'qituvchining havolasidan, ?kod=).
    qism: 'guruh/qoshilish/',
    tayyor: true,
    nomi: 'Join a group',
    tavsif: "Join your teacher's SAT group with an invite code and choose what they can see.",
    turi: 'vosita',
    manbalar: [],
    tekshirilmagan: ['The consent rules for students under 18 still need a lawyer\'s review.'],
  },
];


export const ichkiSahifa = (qism: string): SatSahifa => {
  const t = satIchkiSahifalar.find((x) => x.qism === qism);
  if (!t) throw new Error(`satIchkiSahifalar: ${qism} topilmadi`);
  return t;
};

export const namunaSahifa = (qism: string): SatSahifa => {
  const t = satNamunaSahifalar.find((x) => x.qism === qism);
  if (!t) throw new Error(`satNamunaSahifalar: ${qism} topilmadi`);
  return t;
};
