// P16: "Where to start" (SAT yo'l xaritasi) va bepul resurslar xaritasi.
// Matn inglizcha (SAT bo'limi qoidasi). Har fakt manbalar.ts dagi ID bilan; tekshirilmaganida `tekshirish: true`.
// College Board mazmuni ko'chirilmaydi: faqat qisqa tavsif va havola.

export const KALIT_YOL_XARITASI = 'tayanch:sat-qayerdan-boshlash';

export type Sana = 'bor' | 'yoq';
export type Daraja = 'yangi' | 'mashq' | 'haqiqiy';
export type Soat = 'kam' | 'orta' | 'kop';
export type Byudjet = 'bepul' | 'qoshimcha';

export interface Variant<T extends string> { qiymat: T; matn: string }

export const SAVOLLAR = {
  sana: {
    sarlavha: 'Do you have a test date?',
    variantlar: [
      { qiymat: 'bor', matn: 'Yes, I have a date' },
      { qiymat: 'yoq', matn: 'Not yet' },
    ] as Variant<Sana>[],
  },
  daraja: {
    sarlavha: 'Where are you now?',
    variantlar: [
      { qiymat: 'yangi', matn: "I haven't tried SAT questions yet" },
      { qiymat: 'mashq', matn: "I've taken a practice test" },
      { qiymat: 'haqiqiy', matn: "I've taken the real SAT" },
    ] as Variant<Daraja>[],
  },
  soat: {
    sarlavha: 'How many hours a week can you study?',
    variantlar: [
      { qiymat: 'kam', matn: 'Under 3 hours' },
      { qiymat: 'orta', matn: '3 to 6 hours' },
      { qiymat: 'kop', matn: '7 hours or more' },
    ] as Variant<Soat>[],
  },
  byudjet: {
    sarlavha: 'Budget',
    variantlar: [
      { qiymat: 'bepul', matn: 'Free official resources only' },
      { qiymat: 'qoshimcha', matn: 'Also show non-official free tests' },
    ] as Variant<Byudjet>[],
  },
};

/** Bosqichdagi Tayanch sahifasi: tayyor bo'lmasa "Coming soon" (havolasiz). */
export interface TayanchHavola { qism: string; matn: string }
/** Bosqichdagi tashqi rasmiy havola (manbalar.ts ID si bilan). */
export interface TashqiHavola { manba: string; matn: string; havola: string }

export interface Bosqich {
  id: string;
  sarlavha: string;
  /** Tayanch'dagi vazifa kodi (ichki, ekranda ko'rinmaydi) */
  kod?: string;
  tayanch?: TayanchHavola;
  tashqi: TashqiHavola[];
}

// Bosqichlar tartibi muallif bilan tasdiqlangan (2026-11-11). Matnning javobga bog'liq qismi sahifa skriptida.
export const BOSQICHLAR: Bosqich[] = [
  {
    id: 'diagnostika',
    sarlavha: 'Take a full official practice test as a diagnostic',
    tashqi: [
      { manba: 'CB29', matn: 'Download Bluebook™', havola: 'https://bluebook.collegeboard.org/students/download-bluebook' },
      { manba: 'CB25', matn: 'How to use Bluebook practice tests', havola: 'https://satsuite.collegeboard.org/practice/bluebook' },
    ],
  },
  {
    id: 'kiritish',
    sarlavha: 'Log your score and your mistakes',
    kod: 'P11',
    tayanch: { qism: 'vosita/rasmiy-testlar/', matn: 'Tayanch test tracker' },
    tashqi: [{ manba: 'CB20', matn: 'My Practice', havola: 'https://mypractice.collegeboard.org/' }],
  },
  {
    id: 'reja',
    sarlavha: 'Make a weekly plan',
    kod: 'P13',
    tayanch: { qism: 'vosita/reja/', matn: 'Study planner' },
    tashqi: [],
  },
  {
    id: 'konikma',
    sarlavha: 'Practice skill by skill',
    kod: 'P07',
    tayanch: { qism: 'mashq/bank/', matn: 'Tayanch question bank' },
    tashqi: [
      { manba: 'CB23', matn: 'Student Question Bank', havola: 'https://mypractice.collegeboard.org/questionbank/search' },
      { manba: 'CB24', matn: 'Official SAT Prep on Khan Academy®', havola: 'https://www.khanacademy.org/test-prep/digital-sat' },
    ],
  },
  {
    id: 'vaqtli',
    sarlavha: 'Practice under time',
    tayanch: { qism: 'mashq/test/', matn: 'Tayanch short tests' },
    tashqi: [{ manba: 'CB21', matn: 'Full-length tests in Bluebook', havola: 'https://satsuite.collegeboard.org/practice/practice-tests/bluebook' }],
  },
  {
    id: 'tahlil',
    sarlavha: 'Review your mistakes and come back to them',
    kod: 'P09',
    tayanch: { qism: 'vosita/takrorlash/', matn: 'Mistake log: review' },
    tashqi: [{ manba: 'CB24', matn: 'Khan Academy practice test breakdowns', havola: 'https://satsuite.collegeboard.org/practice/khan-academy' }],
  },
  {
    id: 'qayta',
    sarlavha: 'Decide whether to retake',
    kod: 'P18',
    // P18 sahifasi hali yo'q; satSahifalar.ts dagi "Timing and retakes" bandi (tayyor emas)
    tayanch: { qism: 'qollanma/vaqt/', matn: 'Timing and retakes guide' },
    tashqi: [{ manba: 'CB07', matn: 'The SAT® on College Board', havola: 'https://satsuite.collegeboard.org/sat' }],
  },
];

// ---------- Resurslar xaritasi ----------
export interface Resurs {
  nomi: string;
  nimaUchun: string;
  narx: string;
  /** narx yoki asosiy da'vo rasmiy sahifada tasdiqlanmagan */
  tekshirish?: boolean;
  /** College Board yoki College Board o'z ro'yxatida bergan hamkor */
  rasmiy: 'ha' | 'hamkor' | 'yoq';
  havola: string;
  /** Da'vo tekshirilgan manba ID'lari (manbalar.ts) */
  manbalar: string[];
  sana: string;
  izoh?: string;
}

const S = '2026-11-11';

export const RASMIY_RESURSLAR: Resurs[] = [
  {
    nomi: 'Bluebook™ full-length practice tests',
    nimaUchun: 'Timed, scored practice in the same app as the real digital test. Start here for your diagnostic.',
    narx: 'Free',
    rasmiy: 'ha',
    havola: 'https://satsuite.collegeboard.org/practice/practice-tests/bluebook',
    manbalar: ['CB20', 'CB21'],
    sana: S,
    izoh: 'The number of tests is not stated on the College Board page. Check Practice and Prepare in the app.',
  },
  {
    nomi: 'My Practice',
    nimaUchun: 'After a Bluebook test: your scores, every question with your answer and the correct one, and explanations.',
    narx: 'Free',
    rasmiy: 'ha',
    havola: 'https://mypractice.collegeboard.org/',
    manbalar: ['CB20', 'CB25'],
    sana: S,
  },
  {
    nomi: 'Student Question Bank',
    nimaUchun: 'Official questions you can filter by test, domain, skill and difficulty.',
    narx: 'Free',
    rasmiy: 'ha',
    havola: 'https://mypractice.collegeboard.org/questionbank/search',
    manbalar: ['CB20', 'CB23'],
    sana: S,
    izoh: 'Sign in with a College Board student account or a school sign-in ticket.',
  },
  {
    nomi: 'Question of the Day',
    nimaUchun: 'One official question a day: a quick warm-up.',
    narx: 'Free',
    rasmiy: 'ha',
    havola: 'https://qotd.collegeboard.org/',
    manbalar: ['CB20', 'CB28'],
    sana: S,
  },
  {
    nomi: 'Paper (nonadaptive) practice tests',
    nimaUchun: 'PDF tests with scoring guides and answer explanations.',
    narx: 'Free',
    rasmiy: 'ha',
    havola: 'https://satsuite.collegeboard.org/practice/practice-tests/paper',
    manbalar: ['CB22'],
    sana: S,
    izoh: 'College Board recommends them only for students who will test with paper-based accommodations.',
  },
  {
    nomi: 'Official SAT Prep on Khan Academy®',
    nimaUchun: 'Lessons and practice for every skill at three levels, plus a walk-through course for each Bluebook practice test.',
    narx: 'Free',
    rasmiy: 'hamkor',
    havola: 'https://www.khanacademy.org/test-prep/digital-sat',
    manbalar: ['CB24'],
    sana: S,
    izoh: 'Full-length tests are in Bluebook, not on Khan Academy.',
  },
  {
    nomi: 'Schoolhouse.world SAT Bootcamp',
    nimaUchun: 'Live small-group tutoring with trained peer tutors.',
    narx: 'Free',
    rasmiy: 'hamkor',
    havola: 'https://schoolhouse.world/sat-bootcamp',
    manbalar: ['CB20', 'CB21'],
    sana: S,
    izoh: 'Schoolhouse recommends signing up at least 4 weeks before your test date.',
  },
  {
    nomi: 'Desmos graphing calculator',
    nimaUchun: 'The SAT gives you a Desmos calculator in Bluebook: get used to it before test day.',
    narx: 'Needs verification',
    tekshirish: true,
    rasmiy: 'yoq',
    havola: 'https://www.desmos.com/calculator',
    manbalar: ['CB26'],
    sana: S,
    izoh: 'Desmos itself is not a College Board resource.',
  },
];

export const BOSHQA_RESURSLAR: Resurs[] = [
  {
    nomi: 'The Princeton Review: free practice test',
    nimaUchun: 'Extra timed practice after you have used the official tests.',
    narx: 'Free (as the provider says)',
    rasmiy: 'yoq',
    havola: 'https://www.princetonreview.com/college/free-sat-practice-test',
    manbalar: [],
    sana: S,
    izoh: 'Asks you to register. The page also offers paid courses.',
  },
  {
    nomi: 'Kaplan: free practice test',
    nimaUchun: 'Extra timed practice after you have used the official tests.',
    narx: 'Free (as the provider says)',
    rasmiy: 'yoq',
    havola: 'https://www.kaptest.com/sat/free/sat-practice',
    manbalar: [],
    sana: S,
    izoh: 'Asks you to sign up. The page also offers paid courses.',
  },
  {
    nomi: 'Magoosh: free practice test',
    nimaUchun: 'Extra timed practice after you have used the official tests.',
    narx: 'Free (as the provider says)',
    rasmiy: 'yoq',
    havola: 'https://magoosh.com/sat/sat-practice-test/',
    manbalar: [],
    sana: S,
    izoh: 'Asks for your email to start. The page also advertises paid plans.',
  },
  {
    nomi: 'Gemini: SAT practice tests',
    nimaUchun: 'Full-length practice tests inside the Gemini app (Google says the content comes from The Princeton Review).',
    narx: 'Free (as the provider says)',
    rasmiy: 'yoq',
    havola: 'https://blog.google/products-and-platforms/products/education/practice-sat-gemini/',
    manbalar: [],
    sana: S,
    izoh: 'AI explanations can be wrong. Check answers against official material.',
  },
];

/** CB27: korrelyatsiya, sabab emas. Raqamlar hisobotdan so'zma-so'z. */
export const TADQIQOT = {
  manba: 'CB27',
  sana: S,
  matn:
    'A College Board research report (May 2025, SAT takers in the high school class of 2025) found that students who completed 1, 2, and 3 or more full-length practice tests in Bluebook scored approximately 25, 45 and 60 points higher than similar students who completed none.',
  ogohlik: 'The report itself says the estimates are not causal: students who practice more may differ in other ways. This is not a promise for your score.',
};
