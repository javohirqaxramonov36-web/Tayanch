// P24: savol xatosi haqida xabar (Report) va fikr-mulohaza (Send feedback). Sof mantiq: DOM va tarmoq yo'q.
// Server qoidalari: supabase/migrations/20261112151943_xabar_cheklov.sql (takror, tezlik, RLS).
// Matn inglizcha (SAT bo'limi). Xato so'zlari migratsiyadagi bilan bir xil bo'lishi kerak.

export type XabarSababi = 'wrong_answer' | 'unclear' | 'typo' | 'figure' | 'other';

/** Ekrandagi tartib (spetsifikatsiya P24). `qiymat` = reports.reason. */
export const SABABLAR: readonly { qiymat: XabarSababi; nomi: string }[] = [
  { qiymat: 'wrong_answer', nomi: 'Wrong answer' },
  { qiymat: 'unclear', nomi: 'Unclear wording' },
  { qiymat: 'typo', nomi: 'Typo' },
  { qiymat: 'figure', nomi: 'Figure problem' },
  { qiymat: 'other', nomi: 'Other' },
];

/** reports.message va feedback.message uchun ekrandagi chegara (bazada 2000 va 4000). */
export const IZOH_MAX = 2000;
export const FIKR_MAX = 2000;

export function sababTogrimi(x: unknown): x is XabarSababi {
  return typeof x === 'string' && SABABLAR.some((s) => s.qiymat === x);
}

export interface XabarApi {
  /** Shu ro'yxatdan qaysi savollarga foydalanuvchining ochiq xabari bor (open yoki reviewed). */
  ochiqlar(qidlar: string[]): Promise<Set<string>>;
  yubor(x: { qid: string; sessiya: string | null; sabab: XabarSababi; izoh: string }): Promise<void>;
}

export interface FikrApi {
  yubor(x: { xabar: string; sahifa: string | null }): Promise<void>;
}

export type YuborishNatijasi = 'ok' | 'takror' | 'limit' | 'kirish' | 'yaroqsiz' | 'tarmoq';

/** Supabase (PostgREST) xatosini ekrandagi holatga aylantiradi. */
export function xatoTuri(e: unknown): Exclude<YuborishNatijasi, 'ok'> {
  const x = (e ?? {}) as { code?: unknown; message?: unknown; status?: unknown };
  const kod = typeof x.code === 'string' ? x.code : '';
  const matn = typeof x.message === 'string' ? x.message : '';
  if (matn.includes('report_duplicate') || (kod === '23505' && matn.includes('reports_open_unique'))) return 'takror';
  if (matn.includes('rate_limited')) return 'limit';
  if (kod === '42501' || kod === 'PGRST301' || x.status === 401 || x.status === 403) return 'kirish';
  if (matn.includes('question_not_reportable') || matn.includes('session_not_found') || matn.includes('feedback_empty') || kod === '23514') return 'yaroqsiz';
  return 'tarmoq';
}

export const XABAR_MATN = {
  ok: 'Thanks. The question author will review your report.',
  takror: 'You already reported this question. The author will review it.',
  limit: "You've sent the maximum number of reports for today. Please try again tomorrow.",
  kirish: 'Your session has ended. Sign in again to send a report.',
  yaroqsiz: "This question can't be reported right now.",
  tarmoq: "Couldn't send. Check your connection and try again.",
  sababYoq: 'Choose a reason.',
} as const;

export const FIKR_MATN = {
  ok: 'Thanks for your feedback. The author reads every message.',
  limit: "You've sent the maximum number of messages for today. Please try again tomorrow.",
  kirish: 'Your session has ended. Sign in again to send feedback.',
  yaroqsiz: 'Write a message first.',
  tarmoq: "Couldn't send. Check your connection and try again.",
  takror: "Couldn't send. Check your connection and try again.",
  bosh: 'Write a message first.',
} as const;

/** Izoh: bo'shliqlar olinadi, chegaradan uzun bo'lsa kesiladi. */
export function izohTayyorla(x: string, max = IZOH_MAX): string {
  return x.trim().slice(0, max);
}

/**
 * Feedback qaysi sahifadan kelganini saqlash: faqat shu saytning yo'li, query va hash'siz
 * (URL da shaxsiy ma'lumot bo'lishi mumkin: ?id=, ?keyin=, email).
 */
export function sahifaYoli(manba: string | null | undefined, origin: string, base: string): string | null {
  if (!manba) return null;
  let u: URL;
  try {
    u = new URL(manba, origin);
  } catch {
    return null;
  }
  if (u.origin !== origin) return null;
  const bosh = base.endsWith('/') ? base : `${base}/`;
  if (u.pathname !== base && !u.pathname.startsWith(bosh)) return null;
  return u.pathname.slice(0, 300);
}
