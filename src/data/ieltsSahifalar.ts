// IELTS bo'limining sahifalari va yon panel guruhlari.
// Dizayn: Tayanch-IELTS-dizayn.md. "tez-orada" bandlar havola emas: kulrang ikonka va yorliq bilan matn.
// Matn inglizcha (muallif qarori 2026-11-27: IELTS to'liq inglizcha); inglizcha matnni muallif tekshiradi.

export interface IeltsBand {
  nomi: string;
  tavsif: string;
  /** /uz/ielts/ dan keyingi qism; yo'q bo'lsa band "tez orada" */
  qism?: string;
  ikonka: string;
}

export const IKONKA = {
  listening: '<path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  reading: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  writing: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  speaking: '<path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"/>',
  general: '<path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"/>',
  reja: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  takror: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  namuna: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6"/>',
  kalkulyator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/>',
  tahlil: '<path d="M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3"/>',
  taymer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
} as const;

export const qollanmalar: IeltsBand[] = [
  { nomi: 'Listening', tavsif: 'Question types, reading ahead, spelling traps', qism: 'qollanma/listening/', ikonka: IKONKA.listening },
  { nomi: 'Reading', tavsif: 'Skimming, scanning, True/False/Not Given', qism: 'qollanma/reading/', ikonka: IKONKA.reading },
  { nomi: 'Writing Task 2', tavsif: 'Criteria, essay structure and self-check', qism: 'qollanma/writing-task-2/', ikonka: IKONKA.writing },
  { nomi: 'Speaking', tavsif: 'The three parts, and recording yourself', qism: 'qollanma/speaking/', ikonka: IKONKA.speaking },
];

export const asos: IeltsBand = {
  nomi: 'General English',
  tavsif: 'From B1 to B2: grammar and vocabulary before IELTS.',
  ikonka: IKONKA.general,
};

/** Interaktiv darslar (standart: docs/interaktiv-dars-standarti.md) */
export const darslar: IeltsBand[] = [
  { nomi: 'True / False / Not Given', tavsif: 'Find the evidence sentence and decide: agrees, contradicts or not there', qism: 'qollanma/reading/tfng/', ikonka: IKONKA.tahlil },
  { nomi: 'Matching headings', tavsif: "Choose a heading for each paragraph's main idea", qism: 'qollanma/reading/sarlavhalar/', ikonka: IKONKA.namuna },
];

/** Mavjud mashqlar. To'liq Listening va Speaking testlari keyingi bosqichda. */
export const mashqlar: IeltsBand[] = [
  { nomi: 'Practice tests', tavsif: 'Reading, short Listening drills and Writing Task 2', qism: 'mashq/', ikonka: IKONKA.namuna },
  { nomi: 'Reading test', tavsif: '60 minutes, 40 questions, estimated band', qism: 'mashq/reading/', ikonka: IKONKA.reading },
  { nomi: 'Writing Task 2 practice', tavsif: 'Write an essay and continue saved work', qism: 'mashq/writing/', ikonka: IKONKA.writing },
  { nomi: 'Listening spelling', tavsif: 'Listen to a word and spell it correctly', qism: 'mashq/listening-imlo/', ikonka: IKONKA.listening },
  { nomi: 'Letters and numbers dictation', tavsif: 'Listen and write names, phone numbers, dates and prices', qism: 'mashq/listening-raqamlar/', ikonka: IKONKA.listening },
];

export const vositalar: IeltsBand[] = [
  { nomi: '30-day plan', tavsif: 'A day-by-day plan from three questions', qism: 'vosita/reja/', ikonka: IKONKA.reja },
  { nomi: 'Review', tavsif: 'Mistakes from lessons and tests, spaced out', qism: 'vosita/takrorlash/', ikonka: IKONKA.takror },
  { nomi: 'Score calculator', tavsif: 'Listening, Reading and overall band', qism: 'vosita/kalkulyator/', ikonka: IKONKA.kalkulyator },
  { nomi: 'Writing timer', tavsif: 'Task 1 and Task 2: time and word counter', qism: 'vosita/writing-taymer/', ikonka: IKONKA.taymer },
];

/** Ko'nikma sahifalari (2026-11-24, muallif qarori: IELTS ko'nikma bo'yicha tuziladi).
 *  Har ko'nikma: qo'llanma → darslar → mashqlar → natijalar. Vaqt IE01 (ielts.org) dan, bosh sahifa bilan bir xil. */
export type KonikmaId = 'listening' | 'reading' | 'writing' | 'speaking';
export interface Konikma {
  id: KonikmaId;
  nomi: string;
  ikonka: string;
  vaqt: string;
  /** Bir gap: bu sahifada nima bor */
  tavsif: string;
  qollanma: IeltsBand;
  darslar: IeltsBand[];
  mashqlar: IeltsBand[];
  natijalar: IeltsBand[];
}

const band = (nomi: string, tavsif: string, ikonka: string, qism?: string): IeltsBand => ({ nomi, tavsif, ikonka, qism });

export const konikmalar: Konikma[] = [
  {
    id: 'listening', nomi: 'Listening', ikonka: IKONKA.listening, vaqt: 'About 30 minutes',
    tavsif: 'Question types and spelling traps, then listen-and-write drills.',
    qollanma: band('Listening guide', qollanmalar[0].tavsif, IKONKA.listening, 'qollanma/listening/'),
    darslar: [],
    mashqlar: [
      band('Listening spelling', 'Listen to a word and spell it correctly', IKONKA.listening, 'mashq/listening-imlo/'),
      band('Letters and numbers dictation', 'Listen and write names, phone numbers, dates and prices', IKONKA.listening, 'mashq/listening-raqamlar/'),
      band(
        'Listening mock',
        'A full Listening test',
        IKONKA.namuna,
        import.meta.env.SSR && process.env.TAYANCH_IELTS_LISTENING_DIR ? 'mashq/listening/' : undefined,
      ),
    ],
    natijalar: [],
  },
  {
    id: 'reading', nomi: 'Reading', ikonka: IKONKA.reading, vaqt: '60 minutes (including transfer time)',
    tavsif: 'Learn to find the evidence, practise question types in lessons, then take a full test.',
    qollanma: band('Reading guide', qollanmalar[1].tavsif, IKONKA.reading, 'qollanma/reading/'),
    darslar,
    mashqlar: [
      band('Reading test', '60 minutes, 40 questions, estimated band', IKONKA.reading, 'mashq/reading/'),
      band('True / False / Not Given', 'Swipe a card to answer, with an explanation after each statement', IKONKA.tahlil, 'mashq/tfng/'),
    ],
    natijalar: [
      band('Reading results', 'Attempts saved in this browser', IKONKA.tahlil, 'mashq/reading/#rb-tarix-h'),
      band('Review mistakes', 'Mistakes from lessons and tests, spaced out', IKONKA.takror, 'vosita/takrorlash/'),
    ],
  },
  {
    id: 'writing', nomi: 'Writing', ikonka: IKONKA.writing, vaqt: '60 minutes',
    tavsif: 'Task 2 criteria and essay structure, then timed essay writing.',
    qollanma: band('Task 2 guide', qollanmalar[2].tavsif, IKONKA.writing, 'qollanma/writing-task-2/'),
    darslar: [],
    mashqlar: [band('Task 2 essay practice', 'Write an essay and continue saved work', IKONKA.writing, 'mashq/writing/')],
    natijalar: [],
  },
  {
    id: 'speaking', nomi: 'Speaking', ikonka: IKONKA.speaking, vaqt: '11–14 minutes',
    tavsif: 'How the three parts work, and checking yourself by recording.',
    qollanma: band('Speaking guide', qollanmalar[3].tavsif, IKONKA.speaking, 'qollanma/speaking/'),
    darslar: [],
    mashqlar: [band('Speaking practice', 'Timed answers to Part 1–3 questions, then listen to your recording', IKONKA.speaking, 'qollanma/speaking/#mashq')],
    natijalar: [],
  },
];

export const konikmaI = (id: KonikmaId) => konikmalar.find((k) => k.id === id)!;
/** Ko'nikma sahifasi manzili (/uz/ielts/ dan keyingi qism) */
export const konikmaQism = (id: KonikmaId) => `${id}/`;

/** Barcha IELTS menyulari (ustki menyu, telefon paneli) shu ro'yxatdan: ko'nikma bo'yicha. */
export const ieltsGuruhlar: { nomi: string; bandlar: IeltsBand[] }[] = [
  ...konikmalar.map((k) => ({
    nomi: k.nomi,
    bandlar: [
      band(`${k.nomi} page`, k.tavsif, k.ikonka, konikmaQism(k.id)),
      { ...k.qollanma, nomi: 'Guide' },
      ...k.darslar.map((d) => ({ ...d, nomi: `Lesson: ${d.nomi}` })),
      ...k.mashqlar,
    ],
  })),
  // Lug'at darslari (ko'nikmaga bog'lanmagan): #223 ovqatlanish kollokatsiyalari.
  { nomi: 'Vocabulary', bandlar: [
    band('Food collocations', 'Five food phrases in context, 5 sample exercises', IKONKA.general, 'qollanma/lugat/ovqatlanish/'),
  ] },
  { nomi: 'Plan and review', bandlar: [
    ...vositalar,
    band('All practice', 'Practice for every skill in one place', IKONKA.namuna, 'mashq/'),
    asos,
  ] },
];

export const KALIT_IELTS_REJA = 'tayanch:ielts-reja';
/** Writing Task 2 insho mashqi qoralamasi (mavzu, matn, taymer, o'zini tekshirish belgilari) */
export const KALIT_IELTS_WRITING_T2 = 'tayanch:ielts-writing-t2';
