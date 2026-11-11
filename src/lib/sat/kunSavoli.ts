// Kun savoli (P10) sof mantiqi: turlar, mehmon yozuvi (localStorage), matnlar. DOM va tarmoq yo'q (testlanadi).
// Server: supabase/migrations/20261111220000_kun_savoli.sql (daily_question_public, check_daily_answer,
// daily_question, submit_answer). Komponent: src/components/sat/KunSavoli.astro. Matn inglizcha (SAT bo'limi).
//
// Sana chegarasi: Asia/Tashkent (UTC+5). Savol Toshkent vaqti 00:00 da almashadi; next_at shu vaqt (ISO).
// Mehmon yozuvi faqat shu brauzerda: tayanch:sat-kun-savoli = {sana, questionId, javob, natija}.

export const KUN_KALIT = 'tayanch:sat-kun-savoli';

export type KunBolim = 'math' | 'rw';

export interface KunSavol {
  id: string;
  external_id?: string;
  section: KunBolim;
  domain?: string;
  skill?: string;
  difficulty?: number;
  format: 'mcq' | 'spr';
  passage?: string | null;
  stem: string;
  options?: { key: string; text: string }[] | null;
}

export interface KunNatija {
  is_correct: boolean;
  correct: string | string[];
  explanation: string | null;
}

export interface KunStreak {
  current: number;
  active_today: boolean;
}

/** daily_question_public (mehmon) yoki daily_question (kirgan) javobi. */
export interface KunJavob {
  date: string;
  next_at: string;
  question: KunSavol | null;
  session_id?: string | null;
  result?: (KunNatija & { answer: string }) | null;
  streak?: KunStreak;
}

export interface KunApi {
  kirgan: boolean;
  ol(): Promise<KunJavob>;
  tekshir(j: KunJavob, javob: string): Promise<KunNatija>;
}

export interface MehmonYozuv {
  sana: string;
  questionId: string;
  javob: string;
  natija: KunNatija | null;
}

/** Saqlangan mehmon yozuvi: faqat bugungi sana va o'sha savol uchun; boshqasi null (eskirgan yoki buzilgan). */
export function mehmonOqi(xom: string | null, sana: string, questionId: string): MehmonYozuv | null {
  if (!xom) return null;
  try {
    const y = JSON.parse(xom) as Partial<MehmonYozuv>;
    if (y?.sana !== sana || y.questionId !== questionId || typeof y.javob !== 'string' || !y.javob) return null;
    const n = y.natija;
    const natija = n && typeof n.is_correct === 'boolean' && n.correct != null
      ? { is_correct: n.is_correct, correct: n.correct, explanation: n.explanation ?? null }
      : null;
    return { sana: y.sana, questionId: y.questionId, javob: y.javob, natija };
  } catch {
    return null;
  }
}

export function togriJavobMatni(c: string | string[] | null | undefined): string {
  if (Array.isArray(c)) return c[0] ?? '';
  return c ?? '';
}

export const bolimNomi = (b: KunBolim) => (b === 'rw' ? 'Reading and Writing' : 'Math');

/** "Wed 11 Nov" (sana Toshkent kuni, YYYY-MM-DD; vaqt mintaqasi ta'sir qilmaydi). Qisqa: telefonda bir qatorga sig'adi. */
export function sanaMatni(sana: string): string {
  const d = new Date(`${sana}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return sana;
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d);
}

/**
 * Keyingi savol vaqti. Toshkent bilan bir xil soat mintaqasida faqat "00:00 Tashkent time",
 * boshqa joyda qavs ichida mahalliy vaqt ham ("7:00 PM your time" emas, 24 soat: "19:00 your time").
 */
export function keyingiVaqtMatni(nextAt: string, mintaqa?: string): string {
  const d = new Date(nextAt);
  const asos = "Tomorrow's question opens at 00:00 Tashkent time";
  if (Number.isNaN(d.getTime())) return `${asos}.`;
  const f = (tz?: string) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(d);
  const mahalliy = f(mintaqa);
  if (mahalliy === f('Asia/Tashkent')) return `${asos}.`;
  return `${asos} (${mahalliy} your time).`;
}

/** Streak matni. Uzilgan streak haqida ayblov yo'q: faqat keyingi qadam. */
export function streakMatni(s: KunStreak): string {
  if (s.active_today) return s.current === 1 ? 'Day 1 of your streak. Nice start.' : `${s.current}-day streak.`;
  if (s.current > 0) return `${s.current}-day streak. Answer today's question to keep it going.`;
  return 'Answer today to start a streak.';
}

export type KunXato = 'eskirgan' | 'tarmoq';

/** Server xatosi: kun almashgan (savol eskirgan) yoki boshqa (tarmoq, server). */
export function kunXatoTuri(e: unknown): KunXato {
  const m = String((e as { message?: string })?.message ?? e ?? '');
  return /question_not_today|daily_expired|question_not_in_session|question_unavailable/.test(m) ? 'eskirgan' : 'tarmoq';
}

export const KUN_MATN = {
  sarlavha: 'Question of the day',
  izohMehmon: 'One original Tayanch question a day, the same for everyone. No account needed.',
  izohKirgan: "One original Tayanch question a day, the same for everyone. It doesn't count toward your plan limits.",
  tekshir: 'Check answer',
  tekshirilmoqda: 'Checking…',
  tanlang: 'Choose an answer first.',
  ertaga: 'See tomorrow',
  saqlashTaklif: 'Sign in to save your streak',
  saqlashIzoh: 'Your answer is kept only in this browser until you sign in.',
  tarmoqXato: "Couldn't check your answer. Check your connection and try again.",
  eskirgan: "A new day has started, so today's question has changed.",
  yangisiniOch: 'Load the new question',
  rasmiy: "College Board's official Question of the Day",
  rasmiyIzoh: 'Official SAT practice on the College Board site. Separate from Tayanch.',
} as const;
