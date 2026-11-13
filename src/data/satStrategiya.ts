// P18: "Strategy" va "Timing and retakes" qo'llanma sahifalari ma'lumoti (matn inglizcha, SAT qoidasi).
// Rasmiy fakt: manba ID (manbalar.ts) bilan. Tayanch hisobi yoki tavsiyasi: alohida yorliq.
// Muallif tajribasi: `muallif` massivi. Bo'sh bo'lsa sahifada "The author will fill this in" ko'rinadi.
// Muallif matnini o'zing yozma: muallif o'zbekcha beradi, inglizchasi docs/tarjima/sat-strategiya-retake.md da tasdiqlanadi.

export type FaktTuri = 'rasmiy' | 'hisob' | 'tavsiya';

export interface Fakt {
  matn: string;
  turi: FaktTuri;
  /** rasmiy uchun majburiy; hisob uchun asos bo'lgan manba */
  manbalar: string[];
}

export interface StrategiyaBolim {
  id: string;
  sarlavha: string;
  faktlar: Fakt[];
  /** Muallif tajribasi (inglizcha, muallif tasdiqlagan). Bo'sh: hali yozilmagan. */
  muallif: string[];
  /** Muallif to'ldirishi kerak bo'lgan mavzu (faqat ichki eslatma, sahifada ko'rinmaydi). */
  muallifMavzu: string;
}

export const TEKSHIRILGAN_P18 = '2026-11-11';
export const KEYINGI_TEKSHIRUV_P18 = '2026-12-11';

/** CB03 (2026-11-11). */
export const TUZILMA = [
  { bolim: 'Reading and Writing', modullar: 2, modulVaqti: 32, savollar: 54, jamiVaqt: 64 },
  { bolim: 'Math', modullar: 2, modulVaqti: 35, savollar: 44, jamiVaqt: 70 },
] as const;

/** Modul ichida bir savolga o'rtacha vaqt (soniya): CB03 dan Tayanch hisobi, modullar teng uzunlikda. */
export const ortachaSoniya = (t: (typeof TUZILMA)[number]) =>
  Math.round((t.modulVaqti * 60) / (t.savollar / t.modullar));

export const STRATEGIYA: StrategiyaBolim[] = [
  {
    id: 'vaqt',
    sarlavha: 'Pacing your time',
    faktlar: [
      {
        matn: `Average time per question inside one module: about ${ortachaSoniya(TUZILMA[0])} seconds in Reading and Writing and about ${ortachaSoniya(TUZILMA[1])} seconds in Math. This is only an average: some questions take longer.`,
        turi: 'hisob',
        manbalar: ['CB03'],
      },
      {
        matn: 'The Bluebook timer shows the time left in each part of the test. You can hide it until 5 minutes remain; then you get an alert.',
        turi: 'rasmiy',
        manbalar: ['CB26'],
      },
    ],
    muallif: [],
    muallifMavzu: "Vaqtni qanday taqsimlagansiz: har modulda tekshiruv nuqtalari bo'lganmi, qiyin savolga necha daqiqadan ko'p sarflamagansiz?",
  },
  {
    id: 'otkazish',
    sarlavha: 'Skipping a question and coming back',
    faktlar: [
      {
        matn: 'Inside a module you can move back and forth between questions and mark questions to return to if you have time.',
        turi: 'rasmiy',
        manbalar: ['CB30'],
      },
      {
        matn: 'Mark for Review flags a question. The Question Menu shows which questions you skipped or marked and lets you go to any of them.',
        turi: 'rasmiy',
        manbalar: ['CB26'],
      },
    ],
    muallif: [],
    muallifMavzu: "Qachon savolni o'tkazib yuborardingiz va qachon qaytardingiz? Belgilash odatingiz qanday edi?",
  },
  {
    id: 'taxmin',
    sarlavha: 'Guessing',
    faktlar: [
      {
        matn: 'There is no penalty for guessing. College Board says it is better to answer every question the best you can.',
        turi: 'rasmiy',
        manbalar: ['CB30'],
      },
      {
        matn: 'The Option Eliminator lets you cross out answer choices you think are wrong, and you can undo it.',
        turi: 'rasmiy',
        manbalar: ['CB26'],
      },
    ],
    muallif: [],
    muallifMavzu: "Javobni bilmaganda qanday taxmin qilardingiz? Variantlarni qanday chiqarib tashlardingiz?",
  },
  {
    id: 'tekshirish',
    sarlavha: 'Checking your answers',
    faktlar: [
      {
        matn: 'Before time runs out, the Question Menu shows which questions are still unanswered or marked for review.',
        turi: 'rasmiy',
        manbalar: ['CB26'],
      },
    ],
    muallif: [],
    muallifMavzu: "Javoblarni qanday tekshirardingiz: qaysi savollarni qayta ko'rardingiz, Math'da Desmos bilan tekshirarmidingiz?",
  },
];

/** "Timing and retakes": muallif bloklari. */
export const VAQT_MUALLIF: { boshlash: StrategiyaBolim; qachon: StrategiyaBolim } = {
  boshlash: {
    id: 'boshlash',
    sarlavha: 'How early to start',
    faktlar: [],
    muallif: [],
    muallifMavzu: "Imtihondan qancha vaqt oldin tayyorlanishni boshlagansiz, haftasiga necha soat? Hozir boshqalarga nima maslahat berasiz?",
  },
  qachon: {
    id: 'qachon',
    sarlavha: 'When to retake',
    faktlar: [
      {
        matn: 'Students can take the SAT as many times as they want.',
        turi: 'rasmiy',
        manbalar: ['CB31'],
      },
      {
        matn: 'College Board recommends taking it at least twice: in the spring of junior year and the fall of senior year (the US school calendar).',
        turi: 'rasmiy',
        manbalar: ['CB31'],
      },
    ],
    muallif: [],
    muallifMavzu: "SAT'ni necha marta topshirgansiz? Qayta topshirishga qanday qaror qildingiz, ikki urinish orasida nima o'zgartirdingiz?",
  },
};

/** Rasmiy qoidalar (Timing and retakes). */
export const RASMIY_QOIDALAR: Fakt[] = [
  {
    matn: 'Score Choice lets you choose which scores to send, by test date. Some colleges and scholarship programs require you to send all your scores.',
    turi: 'rasmiy',
    manbalar: ['CB32'],
  },
  {
    matn: 'Each time you register for a weekend SAT, you can send your score to up to four organizations for free. You can use or change these free sends until nine days after the test; after that there is a fee.',
    turi: 'rasmiy',
    manbalar: ['CB33'],
  },
  {
    matn: 'Score Choice does not apply to the free score sends you pick when you register.',
    turi: 'rasmiy',
    manbalar: ['CB32'],
  },
  {
    matn: 'Most scores from weekend tests are released 2–4 weeks after test day.',
    turi: 'rasmiy',
    manbalar: ['CB35'],
  },
  {
    matn: 'The same test dates and deadlines apply to US and international students. Deadlines end at 11:59 p.m. ET (US Eastern time). Late registration is available worldwide for an extra fee.',
    turi: 'rasmiy',
    manbalar: ['CB34'],
  },
];

export interface TestSanasi {
  test: string;
  royxat: string;
  kech: string;
  ball: string;
}

/** 2026-27 weekend sanalari: CB34 (ro'yxat muddatlari), CB35 (o'quvchi ball chiqish sanasi). 2026-11-11. */
export const SANALAR_2026_27: TestSanasi[] = [
  { test: '2026-10-03', royxat: '2026-09-18', kech: '2026-09-22', ball: '2026-10-16' },
  { test: '2026-11-07', royxat: '2026-10-23', kech: '2026-10-27', ball: '2026-11-20' },
  { test: '2026-12-05', royxat: '2026-11-20', kech: '2026-11-24', ball: '2026-12-18' },
  { test: '2027-03-06', royxat: '2027-02-19', kech: '2027-02-23', ball: '2027-03-19' },
  { test: '2027-05-01', royxat: '2027-04-16', kech: '2027-04-20', ball: '2027-05-14' },
  { test: '2027-06-05', royxat: '2027-05-21', kech: '2027-05-25', ball: '2027-06-21' },
];

/** 2027-28: CB34 da "Anticipated" (muddatlar hali yo'q). */
export const SANALAR_2027_28_TAXMINIY = [
  '2027-08-28', '2027-09-18', '2027-10-09', '2027-11-06', '2027-12-04', '2028-03-04', '2028-05-06', '2028-06-03',
];

export const KALIT_RETAKE = 'tayanch:sat-retake-tekshiruv';

export interface RetakeBand {
  id: string;
  matn: string;
  manbalar: string[];
  /** Tayanch sahifasi (satSahifalar qism) */
  tayanch?: { qism: string; matn: string };
}

/** Qayta topshirishdan oldingi ro'yxat: Tayanch tavsiyasi, rasmiy ko'rsatmalarga tayanadi. Muallif ko'rib chiqadi. */
export const RETAKE_ROYXAT: RetakeBand[] = [
  { id: 'ball', matn: 'Write down your section scores from this attempt.', manbalar: [] },
  {
    id: 'amaliy',
    matn: 'Take a full-length practice test in Bluebook, then review each question in My Practice.',
    manbalar: ['CB21', 'CB25'],
  },
  {
    id: 'xatolar',
    matn: 'Log the questions you missed and group them by skill.',
    manbalar: ['CB25'],
    tayanch: { qism: 'vosita/takrorlash/', matn: 'Open the Mistake log' },
  },
  {
    id: 'mashq',
    matn: 'Practice those skills in the Student Question Bank or on Khan Academy.',
    manbalar: ['CB23', 'CB24'],
  },
  {
    id: 'sana',
    matn: 'Pick your next test date and note its registration deadline.',
    manbalar: ['CB34'],
  },
  {
    id: 'qoida',
    matn: "Check each college's score rules: some require all your scores.",
    manbalar: ['CB32'],
  },
  {
    id: 'yuborish',
    matn: 'Decide your free score recipients: you can change them until nine days after the test.',
    manbalar: ['CB33'],
  },
  {
    id: 'reja',
    matn: 'Plan your study hours for each week until the new test date.',
    manbalar: [],
    tayanch: { qism: 'vosita/reja/', matn: 'Open the Study planner' },
  },
];
