// SAT reyting (P32): server javob turlari va sof funksiyalar (xato matni, laqab tekshiruvi, tanlov xotirasi).
// Sahifa: src/pages/uz/sat/vosita/reyting/index.astro. Server: public.leaderboard*, 20261112184613_reyting.sql.
import { laqabRegex } from '../../data/satReyting.ts';

export type Davr = 'week' | 'month';
export type Doira = 'all' | 'country';

export interface MenHolat {
  today: string;
  eligible: boolean;
  joined: boolean;
  hidden: boolean;
  nickname: string | null;
  nickname_ok: boolean;
  country: string | null;
  show_country: boolean;
  xp: { today: number; week: number; month: number };
  daily_cap: number;
}

export interface JadvalQator {
  rank: number;
  nickname: string;
  country: string | null;
  xp: number;
  me: boolean;
}

export interface Jadval {
  period: Davr;
  scope: Doira;
  country: string | null;
  from: string;
  to: string;
  resets_at: string;
  rows: JadvalQator[];
  me: JadvalQator | null;
}

/** Brauzerdagi laqab tekshiruvi (faqat shakl). null = to'g'ri. */
export function laqabXatosi(s: string): string | null {
  const t = s.trim();
  if (!t) return 'Enter a nickname.';
  if (!laqabRegex.test(t)) return 'Use 3 to 20 Latin letters, digits or underscores (_).';
  return null;
}

/** Server xato kodi → foydalanuvchi matni. Kod xato xabarida (raise exception '<kod>'). */
export function reytingXatoMatni(kod: string | undefined): string {
  switch (kod) {
    case 'nickname_not_allowed': return 'This nickname is not allowed. Choose a different one.';
    case 'nickname_invalid': return 'Use 3 to 20 Latin letters, digits or underscores (_).';
    case 'nickname_taken': return 'This nickname is already taken. Choose a different one.';
    case 'country_invalid': return 'Choose a country from the list, or leave it empty.';
    case 'leaderboard_not_eligible': return 'The leaderboard is open only to accounts marked 18 or older.';
    case 'no_country': return 'Choose your country and allow it to be shown to use this view.';
    case 'not_authenticated': return 'Your session has ended. Sign in again.';
    default: return "Something went wrong. Refresh the page and try again.";
  }
}

/** Laqab xatosimi (maydon yonida ko'rsatiladi) yoki umumiy xato. */
export const laqabXatoKodimi = (kod: string | undefined) =>
  kod === 'nickname_not_allowed' || kod === 'nickname_invalid' || kod === 'nickname_taken';

export interface Tanlov { davr: Davr; doira: Doira }

/** Saqlangan tanlovni o'qish: noma'lum qiymat standartga qaytadi. */
export function tanlovniOqi(xom: string | null): Tanlov {
  const t: Tanlov = { davr: 'week', doira: 'all' };
  if (!xom) return t;
  try {
    const o = JSON.parse(xom) as Partial<Tanlov>;
    if (o.davr === 'week' || o.davr === 'month') t.davr = o.davr;
    if (o.doira === 'all' || o.doira === 'country') t.doira = o.doira;
  } catch { /* buzilgan qiymat: standart */ }
  return t;
}

/** Jadval sarlavhasi: "Top 50 · this week (Nov 9 – Nov 12)". */
export function jadvalSarlavhasi(j: Pick<Jadval, 'period' | 'from' | 'to'>, hajm: number): string {
  const f = (s: string) => new Date(`${s}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  const nom = j.period === 'week' ? 'this week' : 'this month';
  return `Top ${hajm} · ${nom} (${f(j.from)} – ${f(j.to)})`;
}

/** Yangilanish vaqti foydalanuvchining mahalliy vaqtida. */
export function yangilanishMatni(resetsAt: string, davr: Davr, til = 'en-GB', tz?: string): string {
  const d = new Date(resetsAt);
  const vaqt = d.toLocaleString(til, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: tz });
  return `${davr === 'week' ? 'Weekly' : 'Monthly'} XP starts again on ${vaqt} (your local time).`;
}
