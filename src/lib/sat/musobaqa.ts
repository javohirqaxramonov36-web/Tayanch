// SAT musobaqalari (P32, 2-PR): server javob turlari va sof funksiyalar (xato matni, vaqt, guruhlash, qolgan vaqt).
// Sahifa: src/pages/uz/sat/vosita/musobaqa/index.astro. Server: public.contest_*, 20261113125033_musobaqa.sql.
// Matn inglizcha (SAT bo'limi).
import type { ServerSavol } from './sessiya.ts';

export type MusobaqaHolati = 'upcoming' | 'open' | 'ended';

export interface Urinish {
  session_id: string;
  started_at: string;
  deadline: string;
  finished: boolean;
  answered: number;
}

export interface Musobaqa {
  slug: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string;
  duration_min: number;
  question_count: number;
  status: MusobaqaHolati;
  entry: Urinish | null;
}

export interface Royxat {
  server_now: string;
  contests: Musobaqa[];
}

export interface MusobaqaHolat extends Musobaqa {
  server_now: string;
  /** Urinish davom etayotganda: savollar (javobsiz) */
  questions: ServerSavol[] | null;
  /** Saqlangan javoblar matni: savol id → javob. To'g'ri/xato YO'Q. */
  answers: Record<string, string> | null;
}

export interface YuborJavob {
  accepted: boolean;
  hidden: boolean;
  already_answered: boolean;
}

export interface NatijaQator {
  rank: number;
  nickname: string;
  country: string | null;
  score: number;
  time_ms: number;
  me: boolean;
}

export interface Natijalar extends Musobaqa {
  eligible: boolean;
  entered: boolean;
  rows: NatijaQator[];
  me_row: NatijaQator | null;
  me: { score: number; time_ms: number; answered: number; rank: number | null } | null;
}

export interface SharhBand {
  id: string;
  position: number;
  section: 'math' | 'rw';
  format: 'mcq' | 'spr';
  passage?: string | null;
  stem: string;
  options?: { key: string; text: string }[] | null;
  answer: string | null;
  is_correct: boolean | null;
  correct: string | string[] | null;
  explanation: string | null;
}

export interface Sharh { slug: string; items: SharhBand[] }

/** Server xato kodi → foydalanuvchi matni. */
export function musobaqaXatoMatni(kod: string | undefined): string {
  switch (kod) {
    case 'contest_not_found': return 'This contest was not found. It may have been removed.';
    case 'contest_not_started': return 'This contest has not started yet.';
    case 'contest_closed': return 'Time is up for this contest. Your saved answers are kept.';
    case 'contest_not_ended': return 'Results open when the contest ends.';
    case 'contest_entry_not_found': return 'You did not take part in this contest.';
    case 'contest_empty': return 'This contest has no questions yet.';
    case 'session_finished': return 'You have finished this contest. Your answers are saved.';
    case 'invalid_answer': return 'Enter an answer of up to 100 characters.';
    case 'question_unavailable': return 'This question is no longer available. Go to the next one.';
    case 'not_authenticated': return 'Your session has ended. Sign in again.';
    default: return 'Something went wrong. Refresh the page and try again.';
  }
}

/** Ro'yxatni holat bo'yicha guruhlash: ochiq, keyingi, tugagan (server tartibi saqlanadi). */
export function guruhla(m: Musobaqa[]): Record<MusobaqaHolati, Musobaqa[]> {
  const g: Record<MusobaqaHolati, Musobaqa[]> = { open: [], upcoming: [], ended: [] };
  for (const x of m) g[x.status]?.push(x);
  return g;
}

/** Sana va vaqt foydalanuvchining mahalliy vaqtida: "Fri 20 Nov, 18:00". */
export function vaqtYoz(iso: string, til = 'en-GB', tz?: string): string {
  return new Date(iso).toLocaleString(til, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: tz });
}

/** Oyna: "Fri 20 Nov, 18:00 – 21:00" (bir kunda) yoki ikki to'liq sana. */
export function oynaMatni(boshi: string, oxiri: string, til = 'en-GB', tz?: string): string {
  const b = new Date(boshi);
  const o = new Date(oxiri);
  const kun = (d: Date) => d.toLocaleDateString(til, { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: tz });
  if (kun(b) === kun(o)) {
    return `${vaqtYoz(boshi, til, tz)} – ${o.toLocaleTimeString(til, { hour: '2-digit', minute: '2-digit', timeZone: tz })}`;
  }
  return `${vaqtYoz(boshi, til, tz)} – ${vaqtYoz(oxiri, til, tz)}`;
}

/** Natija vaqti: "12 min 5 s", "45 s". */
export function natijaVaqti(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const daq = Math.floor(s / 60);
  const son = s % 60;
  if (daq >= 60) return `${Math.floor(daq / 60)} h ${daq % 60} min`;
  if (daq) return son ? `${daq} min ${son} s` : `${daq} min`;
  return `${son} s`;
}

/**
 * Qolgan vaqt (ms) server soatiga nisbatan: serverNow va mijozning shu javob kelgan paytdagi vaqti (soatOlingan)
 * orasidagi farq hisobga olinadi. Muddat serverda tekshiriladi; bu faqat ko'rsatish uchun.
 */
export function qolganVaqt(deadline: string, serverNow: string, soatOlingan: number, hozir: number): number {
  const farq = Date.parse(serverNow) - soatOlingan;
  return Math.max(0, Date.parse(deadline) - (hozir + farq));
}

/** Ekran o'quvchi uchun qolgan daqiqa e'loni: faqat butun daqiqa o'zgarganda (null = e'lon yo'q). */
export function daqiqaElonmi(oldingiMs: number | null, ms: number): string | null {
  const d = Math.ceil(ms / 60000);
  if (oldingiMs !== null && Math.ceil(oldingiMs / 60000) === d) return null;
  if (d <= 0) return 'Time is up.';
  return d === 1 ? '1 minute left.' : `${d} minutes left.`;
}

/** To'g'ri javob ko'rinishi (mcq "B", spr birinchi qabul qilingan qiymat). */
export function togriYoz(c: string | string[] | null | undefined): string {
  if (Array.isArray(c)) return c[0] ?? '';
  return c ?? '';
}

/** Natija jadvali sarlavhasi. */
export function natijaSarlavhasi(n: Pick<Natijalar, 'rows' | 'question_count'>): string {
  return `Top ${Math.min(100, n.rows.length)} · score out of ${n.question_count}`;
}

/** URL dagi slug (?c=...): faqat server qabul qiladigan shakl. */
export function slugOl(qidiruv: string): string | null {
  const s = new URLSearchParams(qidiruv).get('c');
  return s && /^[a-z0-9][a-z0-9-]{2,39}$/.test(s) ? s : null;
}
