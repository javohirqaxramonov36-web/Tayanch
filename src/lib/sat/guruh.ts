// P34 guruhlar: sof funksiyalar (testlanadi: src/lib/testlar/guruh.test.ts). Server: 20261113100000_guruhlar_p34.sql.
// Holatning yagona manbasi baza: bu yerda faqat ko'rsatish (foiz, sana, kod formati, xato kodi).
import { kunFarqi, toshkentBugun } from '../muddat.ts';

/** Rozilik matni versiyasi. Rozilik ekrani matni o'zgarsa yangilanadi; a'zolik qatoriga yoziladi. */
export const GURUH_ROZILIK_VERSIYA = 'guruh-2026-11-12';

/** Taklif kodi alifbosi (serverdagi bilan bir xil): 0/O, 1/I/L yo'q. */
export const KOD_ALIFBO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const KOD_UZUNLIK = 8;

/** Foydalanuvchi yozgan kodni tozalaydi: bo'shliq va chiziqcha olib tashlanadi, katta harf. */
export function kodniTozala(s: string): string {
  return s.replace(/[\s-]/g, '').toUpperCase();
}

export function kodTogrimi(s: string): boolean {
  return new RegExp(`^[${KOD_ALIFBO}]{${KOD_UZUNLIK}}$`).test(kodniTozala(s));
}

/** Ko'rsatish uchun: ABCD-EFGH (o'qish oson). */
export function kodKorinishi(kod: string): string {
  const k = kodniTozala(kod);
  return k.length === KOD_UZUNLIK ? `${k.slice(0, 4)}-${k.slice(4)}` : k;
}

export interface Xulosa {
  answered: number;
  correct: number;
  answered_7d: number;
  last_active: string | null;
}

export interface Mavzu {
  section: 'math' | 'rw';
  domain: string;
  answered: number;
  correct: number;
}

export interface Azo {
  id: string;
  name: string;
  joined_at: string;
  share_summary: boolean;
  share_topics: boolean;
  summary: Xulosa | null;
  topics: Mavzu[] | null;
}

export interface GuruhNatija {
  group: { id: string; name: string };
  members: Azo[];
}

export interface OqituvchiGuruh {
  id: string;
  name: string;
  teacher_name: string;
  invite_code: string;
  archived: boolean;
  created_at: string;
  members: number;
}

export interface OqituvchiHolat {
  license: { max_groups: number; max_members: number; ends_at: string | null } | null;
  groups: OqituvchiGuruh[];
}

export interface Azolik {
  id: string;
  group_name: string;
  teacher_name: string;
  archived: boolean;
  member_name: string;
  share_summary: boolean;
  share_topics: boolean;
  joined_at: string;
  consent_at: string;
}

export interface MeningGuruhlarim {
  minor: boolean;
  memberships: Azolik[];
}

export interface Korinish {
  name: string;
  teacher_name: string;
  own_group: boolean;
  already_member: boolean;
  minor: boolean;
}

/** Aniqlik foizi (butun son) yoki null (javob yo'q). */
export function aniqlik(correct: number, answered: number): number | null {
  if (!answered || answered < 0) return null;
  return Math.round((Math.min(correct, answered) / answered) * 100);
}

const TOSHKENT = 'Asia/Tashkent';

/** "12 Nov 2026" (Toshkent vaqti). */
export function sanaYoz(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TOSHKENT });
}

/** Oxirgi faollikdan beri necha kalendar kuni o'tgan (Toshkent, muddat.ts), null: faollik yo'q. */
export function necheKunOldin(iso: string | null, hozir: Date): number | null {
  if (!iso) return null;
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return null;
  return Math.max(0, kunFarqi(toshkentBugun(t), toshkentBugun(hozir)));
}

/** 7 kun va undan ko'p faol bo'lmagan (yoki umuman javob bermagan) o'quvchi: o'qituvchi uchun belgi. */
export const NOFAOL_KUN = 7;
export function nofaolmi(x: Xulosa | null, hozir: Date): boolean {
  if (!x) return false;
  const k = necheKunOldin(x.last_active, hozir);
  return k === null || k >= NOFAOL_KUN;
}

/** Ruxsatni kengaytiradimi (18 yoshgacha bo'lsa ota-ona tasdig'i qayta so'raladi). */
export function kengaytiradimi(oldin: { s: boolean; t: boolean }, keyin: { s: boolean; t: boolean }): boolean {
  return (keyin.s && !oldin.s) || (keyin.t && !oldin.t);
}

export type GuruhXato =
  | 'not_found' | 'too_many_attempts' | 'own_group' | 'already_member' | 'group_full' | 'guardian_required'
  | 'invalid_member_name' | 'invalid_name' | 'invalid_teacher_name' | 'no_license' | 'group_limit'
  | 'group_archived' | 'group_not_found' | 'member_not_found' | 'invalid_consent' | 'auth' | 'network';

const MALUM: GuruhXato[] = [
  'not_found', 'too_many_attempts', 'own_group', 'already_member', 'group_full', 'guardian_required',
  'invalid_member_name', 'invalid_name', 'invalid_teacher_name', 'no_license', 'group_limit',
  'group_archived', 'group_not_found', 'member_not_found', 'invalid_consent',
];

/** Supabase xatosidan (message = server kodi) GuruhXato. */
export function xatoKodi(e: { code?: string; message?: string } | null | undefined): GuruhXato {
  const m = e?.message ?? '';
  const topildi = MALUM.find((k) => m === k);
  if (topildi) return topildi;
  if (e?.code === '42501' || e?.code === '28000' || m.includes('not_authenticated') || m.includes('JWT')) return 'auth';
  return 'network';
}
