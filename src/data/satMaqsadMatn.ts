// SAT maqsad va imtihon sanasi (P12): ekrandagi matn, inglizcha (SAT bo'limi qoidasi). Muallif tekshiradi.
// Natija va'dasi yo'q: "ball oshadi" kabi matn qo'yilmaydi.
import type { BallXato, SanaXato, RoyxatHolati } from '../lib/satMaqsad.ts';
import { BALL } from '../lib/satMaqsad.ts';

/** YYYY-MM-DD → "Sat, Dec 5, 2026" (sana kalendar kuni sifatida, vaqt mintaqasisiz). */
export function sanaYoz(iso: string, uzun = false): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC', weekday: uzun ? 'long' : 'short', month: uzun ? 'long' : 'short', day: 'numeric', year: 'numeric',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export const maqsadMatn = {
  // Sozlash sahifasi
  sarlavha: 'Your goal and test date',
  lead: 'Three quick questions. Your answers set the countdown on the SAT home page. You can skip them now and change them any time.',
  kutish: 'Checking your account…',
  hisobYoq: 'Accounts are not available on this site yet.',
  oqishXato: "We couldn't load your account details. Refresh the page and try again.",
  saqlashXato: "We couldn't save your answers. Check your connection and try again.",
  xatolarSarlavha: 'Please fix the following:',

  ballNomi: '1. Target total score',
  ballIzoh: `A whole number from ${BALL.min} to ${BALL.max} in steps of ${BALL.qadam}, the SAT total score scale.`,
  joriyNomi: '2. Your best SAT score so far',
  joriyIzoh: "From an official SAT or a full-length practice test. Leave it empty if you don't have one yet.",
  ixtiyoriy: '(optional)',

  sanaNomi: '3. Test date',
  sanaIzoh: 'Pick an official date, enter another date, or leave it for later.',
  boshqaSana: 'Another date',
  boshqaSanaMaydon: 'Your test date',
  bilmayman: "I don't know yet",
  royxat: (h: RoyxatHolati, royxat: string, kech: string) =>
    h === 'ochiq' ? `Register by ${sanaYoz(royxat)}`
      : h === 'kech' ? `Regular deadline passed. Late registration until ${sanaYoz(kech)}`
        : 'Registration for this date has closed',
  manba: 'Official dates: College Board, SAT Suite Test Dates and Deadlines.',
  tekshirildi: (sana: string) => `Checked ${sanaYoz(sana)}. Dates apply to U.S. and international test takers; check test center availability when you register.`,
  tekshirilmoqda: 'Official dates are being verified',
  tekshirilmoqdaIzoh: 'Until they are, enter the date you plan to take the test. Official dates are listed on the College Board site.',
  otganSana: (sana: string) => `Your saved test date (${sanaYoz(sana)}) has passed. Choose a new date or leave it for later.`,

  saqlash: 'Save',
  saqlanmoqda: 'Saving…',
  otkazish: 'Skip for now',
  bekor: 'Cancel',

  ballXato: {
    bosh: 'Enter your target score.',
    raqam: 'Use digits only, for example 1400.',
    oraliq: `Enter a score from ${BALL.min} to ${BALL.max}.`,
    qadam: `SAT scores go up in steps of ${BALL.qadam}. Round to the nearest ${BALL.qadam}, for example 1450.`,
  } satisfies Record<BallXato, string>,
  sanaXato: {
    bosh: 'Choose a test date.',
    format: 'Enter the full date: day, month and year.',
    otgan: 'This date has already passed. Choose today or a later date.',
    uzoq: 'Choose a date within the next two years.',
  } satisfies Record<SanaXato, string>,
  sanaTanlanmadi: 'Enter your test date, or choose "I don\'t know yet".',

  // Sarlavha (SAT bosh sahifasi)
  bolimNomi: 'Your SAT goal',
  taklifSarlavha: 'Set your SAT goal',
  taklifMatn: 'Three quick questions: target score, best score so far and test date.',
  boshlash: 'Start',
  keyinroq: 'Not now',
  maqsad: 'Goal',
  maqsadYoq: 'No goal set',
  maqsadQosh: 'Add a goal',
  kunQoldi: (n: number) => (n === 1 ? '1 day left' : `${n} days left`),
  bugun: 'Test day is today',
  otdi: 'Your test date has passed',
  yangiSana: 'Set a new date',
  sanaYoq: 'No test date',
  sanaQosh: 'Add a test date',
  imtihonKuni: (iso: string) => `Test day: ${sanaYoz(iso)}`,
  engYaxshi: (n: number) => `Best so far: ${n}`,
  tahrirlash: 'Edit goal and date',
} as const;
