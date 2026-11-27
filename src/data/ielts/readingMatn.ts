// UI text of the IELTS Reading practice test (English; author decision 2026-11-27: the IELTS floor is
// fully English). All strings live here as keys. Passage and question text comes from the test JSON.
import type { SavolTuriNomi } from '../../lib/ielts/reading/sxema.ts';

export const TUR_NOMI: Record<SavolTuriNomi, string> = {
  tfng: 'True / False / Not Given',
  mcq: 'Multiple choice',
  'matching-headings': 'Matching headings',
  'gap-fill': 'Gap fill',
};

export const RM = {
  eslatma: 'This is practice in the IELTS format, not an official test.',

  // Controls shared by question types
  tanlang: 'Choose',
  javobYoz: 'Your answer',
  sozLimit: (n: number) => `No more than ${n} ${n === 1 ? 'word' : 'words'}`,
  ikkitaTanla: 'Choose two options',
  ikkitadanKop: 'You can choose only two options. Remove one first.',
  javobsiz: 'Not answered',

  // Test screen
  yuklanmoqda: 'Loading the test…',
  yuklashXato: "Couldn't load the test. Check your internet connection and try again.",
  qaytaUrin: 'Try again',
  mockYoq: "The selected mock wasn't found. Choose another test from the catalogue.",
  faolYoq: 'No test in progress. Start a new one from the start page.',
  boshlashSahifasi: 'Go to the start page',
  testYoq: 'No tests have been added yet. New tests are coming soon.',
  qolganVaqt: 'Time left',
  vaqtElon: (daq: number) => `${daq} ${daq === 1 ? 'minute' : 'minutes'} left.`,
  vaqtTugadi: 'Time is up. Your answers are being marked.',
  yakunlash: 'Finish',
  chiqish: 'Leave the test. The timer keeps running.',
  tabMatn: 'Passage',
  tabSavollar: 'Questions',
  tablar: 'View',
  passage: (n: number) => `Passage ${n}`,
  passageTanlov: 'Choose a passage',
  savollarPaneli: 'Question panel',
  panelTugma: (berilgan: number, jami: number) => `Questions: ${berilgan}/${jami}`,
  panelOch: 'Open the question list',
  raqamHolat: (n: number, berilgan: boolean, belgi: boolean) =>
    `Question ${n}, ${berilgan ? 'answered' : 'not answered'}${belgi ? ', flagged' : ''}`,
  belgila: (n: string) => `Flag question ${n} to review later`,
  belgi: 'Flag',
  afsona: { berilgan: 'Answered', belgi: 'Flagged', joriy: 'Not answered' },
  oldingi: 'Previous passage',
  keyingi: 'Next passage',

  // Finish dialog
  yakunSarlavha: 'Finish the test?',
  yakunJavobsiz: (n: number) => (n === 0 ? 'Every question is answered.' : `Unanswered questions: ${n}.`),
  yakunBelgi: (n: number) => (n === 0 ? 'No flagged questions.' : `Flagged questions: ${n}.`),
  yakunIzoh: 'After you finish, you cannot change your answers.',
  yakunHa: 'Yes, finish',
  yakunYoq: 'Back to the test',

  // Storage and second-tab warnings
  xotiraYoq:
    'Browser storage is turned off or full. The test continues, but if you refresh or close the page, your answers and result will not be saved.',
  natijaSaqlanmadi: 'The result was not saved in the browser. You can see it only while this page stays open.',
  boshqaTab: 'This test is open in another tab. To keep answers from mixing, work in only one tab at a time.',
  shuTabda: 'Continue in this tab',
  faqatOqish: 'You cannot change answers in this tab.',
  boshqaTabdaYakun: 'The test was finished in another tab.',
  natijagaOt: 'See the result',

  // Start page
  boshla: 'Start a new test',
  davomEt: 'Continue the test',
  davomIzoh: (vaqt: string) => `You have a test in progress. Time left: ${vaqt}.`,
  vaqtOtgan: 'Time ran out on the test you started. If you open it, the result is calculated from your saved answers.',
  tasodif: 'A test is chosen at random; the last test you took is not repeated.',
  bittaTest: 'There is only one test for now, so it repeats. New tests are coming soon.',
  tarixSarlavha: 'Recent attempts',
  tarixBosh: "You haven't taken a test yet.",
  tarixQator: (raw: number, jami: number, band: string) => `${raw}/${jami}, estimated band ${band}`,

  // Result
  natijaSarlavha: 'Reading result',
  xomBall: 'Correct answers',
  taxminiyBand: 'Estimated band',
  bandPast: 'below 2.0',
  bandIzoh:
    'The band is an estimate. The official source (ielts.org, IE04) gives only four sample points for Academic Reading: 15 → 5, 23 → 6, 30 → 7, 35 → 8. The other boundaries are a Tayanch estimate. In a real test the boundaries shift a little with the test version.',
  sarflangan: 'Time spent',
  daqiqa: (n: number) => `${n} ${n === 1 ? 'minute' : 'minutes'}`,
  avtoYakun: 'The test finished automatically because time ran out.',
  turlar: 'Accuracy by question type',
  tahlil: 'Mistake analysis',
  tahlilZaif: (tur: string, t: number, j: number) => `Most mistakes: ${tur} (${t}/${j} correct).`,
  tahlilJavobsiz: (n: number) => `${n} ${n === 1 ? 'question was' : 'questions were'} left unanswered. An unanswered question scores nothing, so fill in every answer before time runs out.`,
  tahlilPassage: (n: number, t: number, j: number) => `Passage ${n}: ${t}/${j} correct.`,
  tahlilYaxshi: 'Above 60% in every question type.',
  tahlilXatoYoq: 'No mistakes.',
  keyingiQadam: 'Next step',
  savollar: 'Questions and explanations',
  filtrHammasi: 'All',
  filtrXato: 'Wrong and unanswered only',
  togri: 'Correct',
  xato: 'Wrong',
  sizning: 'Your answer',
  togriJavob: 'Correct answer',
  tushuntirish: 'Explanation',
  dalil: 'Evidence in the passage',
  matndaKor: 'Show in the passage',
  dalilYoq: 'The evidence in the passage has not been checked yet.',
  paragraf: (p: string) => `Paragraph ${p}`,
  yopish: 'Close',
  yangiTest: 'Start a new test',
  natijaYoq: 'This attempt was not found. It may have been taken in another browser, or the browser data may have been cleared.',
  natijaYuklanmoqda: 'Loading the result…',
  testTopilmadi: "This attempt's test is no longer on the site, so the question-by-question analysis can't be shown.",
  testXato: "Couldn't load the test text, so the question-by-question analysis isn't shown. Check your internet connection and refresh the page.",
  holatTogri: 'Correct',
  holatXato: 'Wrong',
  holatBosh: 'Not answered',
  filtr: 'Filter questions',
  xatoQolmadi: 'No wrong or unanswered questions.',
  ulush: (t: number, j: number) => `${t}/${j} correct`,

  // Question blocks on the test screen
  guruhNomi: (oraliq: string, kop: boolean) => (kop ? `Questions ${oraliq}` : `Question ${oraliq}`),
  savolNomi: (n: string) => `Question ${n}.`,
  sarlavhalarRoyxati: 'List of headings',
  faolTestYoq: "The test you started is no longer on the site, so it was cancelled. You can start a new test.",
  testNomi: 'IELTS Reading test',
  ustki: 'IELTS · Reading',
  yakunlashQisqa: 'Finish',
} as const;

// Text of the practice landing page and of the Reading start page.
export const MM = {
  mashqSarlavha: 'IELTS practice tests',
  mashqLead: 'Start with the Reading test, Listening spelling and dictation, and Writing Task 2 practice.',
  ustki: 'Practice',
  ochiq: 'open',
  tezOrada: 'Coming soon',
  boshlashga: 'Open practice',
  bolimlar: 'Sections',

  readingSarlavha: 'IELTS Reading Test',
  readingLead: '3 passages, 40 questions, in the IELTS format.',
  statVaqt: 'Time',
  statVaqtQiymat: '60 minutes',
  statSavol: 'Questions',
  statSavolQiymat: '40 questions',
  statMatn: 'Passages',
  statMatnQiymat: '3 passages',
  statUrinish: 'Tests you have taken',
  passageSarlavha: 'Passage level',
  passagelar: [
    { nomi: 'Passage 1', daraja: 'Easy–Medium' },
    { nomi: 'Passage 2', daraja: 'Medium' },
    { nomi: 'Passage 3', daraja: 'Medium–Hard' },
  ],
  ogohSarlavha: 'Before you start',
  ogoh: 'Once the test starts, you have 60 minutes. Get ready and sit somewhere quiet.',
  ogohVaqt: 'The timer keeps running even if you close the page: when you come back, your answers and the time left are restored.',
  imkoniyatSarlavha: "What's in the test",
  imkoniyatlar: [
    { nomi: 'Different question types', matn: 'True / False / Not Given, Multiple choice, Matching headings and gap fill.' },
    { nomi: 'Automatic marking', matn: 'When you finish, each question shows the correct answer, a short explanation and the evidence in the passage.' },
    { nomi: 'Band score', matn: 'An estimated Academic Reading band is calculated from how many of the 40 you get right.' },
  ],
} as const;

// Next-step recommendations after a result. Only pages that exist are listed (base-less paths).
export const TAVSIYA = {
  tfng: {
    sarlavha: 'Reading lesson: True / False / Not Given',
    izoh: 'You made many mistakes on this question type in your last test.',
    manzil: '/uz/ielts/qollanma/reading/tfng/',
  },
  'matching-headings': {
    sarlavha: 'Reading lesson: Matching headings',
    izoh: 'You made many mistakes on this question type in your last test.',
    manzil: '/uz/ielts/qollanma/reading/sarlavhalar/',
  },
  mcq: {
    sarlavha: 'Review the Reading guide',
    izoh: 'You made many mistakes on Multiple choice questions in your last test.',
    manzil: '/uz/ielts/qollanma/reading/',
  },
  'gap-fill': {
    sarlavha: 'Review the Reading guide',
    izoh: 'You made many mistakes on gap-fill questions in your last test.',
    manzil: '/uz/ielts/qollanma/reading/',
  },
  yangi: {
    sarlavha: 'A new Reading test',
    izoh: 'Above 60% in every question type in your last test.',
    manzil: '/uz/ielts/mashq/reading/',
  },
} as const;
