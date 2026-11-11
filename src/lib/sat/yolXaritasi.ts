// P16 "Where to start": javoblardan har bosqich matnini tuzuvchi sof funksiyalar (brauzer va node testida ishlaydi).
// Matnlar Tayanch tavsiyasi; faktlar (Bluebook pauza, My Practice, Khan darajalari) manbalar.ts dagi CB21–CB25 dan.
import type { Sana, Daraja, Soat, Byudjet } from '../../data/satYolXaritasi';

export interface Javoblar {
  sana?: Sana;
  /** YYYY-MM-DD, faqat sana === 'bor' bo'lsa */
  sanaQiymat?: string;
  daraja?: Daraja;
  soat?: Soat;
  byudjet?: Byudjet;
}

export interface Holat {
  javoblar: Javoblar;
  belgilar: Record<string, boolean>;
}

const KUN = 86400000;
/** Sana yaqin deb hisoblanadigan chegara (Tayanch tanlovi, rasmiy tavsiya emas). */
export const YAQIN_HAFTA = 4;

const sanaUTC = (s: string): number | null => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  const t = Date.UTC(y, m - 1, d);
  const q = new Date(t);
  return q.getUTCFullYear() === y && q.getUTCMonth() === m - 1 && q.getUTCDate() === d ? t : null;
};

/** Bugundan imtihongacha to'liq bo'lmagan haftalar soni (yuqoriga yaxlitlanadi). null: sana yo'q yoki noto'g'ri; 0: bugun yoki o'tgan. */
export function qolganHafta(sana: string | undefined, bugun: string): number | null {
  if (!sana) return null;
  const a = sanaUTC(sana);
  const b = sanaUTC(bugun);
  if (a == null || b == null) return null;
  const kun = Math.round((a - b) / KUN);
  return kun <= 0 ? 0 : Math.ceil(kun / 7);
}

/** Saqlangan holatni tekshiradi: begona yoki eski qiymatlar tashlab yuboriladi. */
export function holatniTekshir(x: unknown): Holat {
  const bosh: Holat = { javoblar: {}, belgilar: {} };
  if (!x || typeof x !== 'object') return bosh;
  const o = x as Record<string, unknown>;
  const j = (o.javoblar && typeof o.javoblar === 'object' ? o.javoblar : {}) as Record<string, unknown>;
  const tanla = <T extends string>(v: unknown, ruxsat: readonly T[]): T | undefined =>
    typeof v === 'string' && (ruxsat as readonly string[]).includes(v) ? (v as T) : undefined;
  const javoblar: Javoblar = {
    sana: tanla(j.sana, ['bor', 'yoq'] as const),
    sanaQiymat: typeof j.sanaQiymat === 'string' && sanaUTC(j.sanaQiymat) != null ? j.sanaQiymat : undefined,
    daraja: tanla(j.daraja, ['yangi', 'mashq', 'haqiqiy'] as const),
    soat: tanla(j.soat, ['kam', 'orta', 'kop'] as const),
    byudjet: tanla(j.byudjet, ['bepul', 'qoshimcha'] as const),
  };
  const belgilar: Record<string, boolean> = {};
  if (o.belgilar && typeof o.belgilar === 'object') {
    for (const [k, v] of Object.entries(o.belgilar as Record<string, unknown>)) if (v === true) belgilar[k] = true;
  }
  return { javoblar, belgilar };
}

/** Har bosqich uchun 1–3 jumla. Javob berilmagan bo'lsa umumiy matn (JS'siz ko'rinish ham shu). */
export function bosqichMatnlari(j: Javoblar, bugun: string): Record<string, string[]> {
  const hafta = j.sana === 'bor' ? qolganHafta(j.sanaQiymat, bugun) : null;
  const yaqin = hafta != null && hafta > 0 && hafta <= YAQIN_HAFTA;

  const diagnostika: string[] = [];
  if (j.daraja === 'mashq') {
    diagnostika.push('If you already have a Bluebook™ practice score, use it as your starting point and go to step 2. If that test was long ago, take a new one.');
  } else if (j.daraja === 'haqiqiy') {
    diagnostika.push('Your real SAT® score report is your starting point. For question-by-question detail, also take a Bluebook practice test: after it, My Practice shows every question.');
  } else {
    diagnostika.push('In the Bluebook app, open Practice and Prepare and take a full-length practice test. Do not study for it first: the score is only your starting point.');
  }
  if (j.soat === 'kam') {
    diagnostika.push('Short on time? Bluebook lets you pause a practice test and come back later, but College Board recommends taking at least one in one sitting, like test day.');
  } else {
    diagnostika.push('Take it in one sitting, like test day, somewhere quiet.');
  }

  const kiritish = [
    'In My Practice, open Score Details: you see every question, your answer and the correct answer.',
    'Write down which skills you missed and how many. This list decides what you practice next.',
  ];

  const reja: string[] = [];
  if (j.sana === 'bor' && hafta === 0) {
    reja.push('The date you entered is today or has passed. Enter your next test date above.');
  } else if (j.sana === 'bor' && hafta != null) {
    reja.push(`You have ${hafta} ${hafta === 1 ? 'week' : 'weeks'} until your test date. Enter the date in the Study planner: it splits the weeks into stages.`);
  } else if (j.sana === 'bor') {
    reja.push('Enter your test date above to see how many weeks you have.');
  } else if (j.sana === 'yoq') {
    reja.push('No date yet: plan a few weeks at a time and choose a date when you see your progress. Official test dates are on the College Board website.');
  } else {
    reja.push('Turn your missed skills into a weekly plan with the Study planner.');
  }
  if (j.soat === 'kam') reja.push('With under 3 hours a week, focus on one or two skills per week.');
  else if (j.soat === 'kop') reja.push('With 7 or more hours a week, you can work on Reading and Writing and Math in the same week.');

  const konikma = [
    'Practice the skills from step 2. Filter the Student Question Bank or the Tayanch question bank by skill.',
    j.daraja === 'yangi' || !j.daraja
      ? 'On Khan Academy, each skill has three levels: start at Foundations, then Medium, then Advanced.'
      : 'On Khan Academy, each skill has three levels (Foundations, Medium, Advanced): start at the level where you made mistakes.',
  ];

  const vaqtli: string[] = [];
  if (yaqin) {
    vaqtli.push('Your test date is close: spend more time on timed full-length tests and their review than on new topics.');
  } else {
    vaqtli.push('Every few weeks, take another full-length Bluebook test to check your progress under time. Use short timed sets between them.');
  }
  if (j.byudjet === 'qoshimcha') {
    vaqtli.push('After the official tests, the non-official free tests listed below can add timed practice. Their quality is not checked.');
  }

  const tahlil = [
    'For each mistake, note why: you did not know the skill, misread the question, or ran out of time.',
    'Come back to the same questions after a few days. After each Bluebook test, Khan Academy has a walk-through of every question.',
  ];

  const qayta =
    j.daraja === 'haqiqiy'
      ? ['You already have a real score. Compare it with what your universities ask for and with their deadlines, then decide whether to retake.']
      : ['After your test, compare your score with what your universities ask for and with their deadlines. Rules and dates for the next test are on the official SAT® website.'];

  return { diagnostika, kiritish, reja, konikma, vaqtli, tahlil, qayta };
}

/** Ekrandagi qisqa xulosa (aria-live uchun). */
export function xulosa(j: Javoblar, bugun: string, jami: number, bajarildi: number): string {
  const hafta = j.sana === 'bor' ? qolganHafta(j.sanaQiymat, bugun) : null;
  const qism = hafta != null && hafta > 0 ? ` ${hafta} ${hafta === 1 ? 'week' : 'weeks'} to your test.` : '';
  return `Your path is updated: ${bajarildi} of ${jami} steps done.${qism}`;
}
