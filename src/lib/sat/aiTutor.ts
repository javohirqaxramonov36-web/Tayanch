// AI Tutor (P33): brauzer tomonidagi sof mantiq. Edge Function `ai-tutor` ni chaqirish tolov.ts dagi funksiya() orqali.
// Limit, byudjet va tekshiruv faqat serverda; bu yerda faqat ko'rsatish. Matn inglizcha (SAT bo'limi).
import type { UsageJavob } from './usageBar';

export const XABAR_MAX = 1200;

export type Tekshiruv = 'verified' | 'unverified' | 'not_checked';
export type TutorHolati = 'tayyor' | 'yopiq' | 'tarifda-yoq';

export interface TutorXabar {
  role: 'user' | 'assistant';
  content: string;
  check_status?: Tekshiruv | null;
}

export interface XatoTanlov {
  attempt_id: number;
  created_at: string;
  section: string;
  skill: string;
  difficulty: number;
  snippet: string;
}

export interface Suhbat {
  id: string;
  mode: 'attempt' | 'own';
  attempt_id: number | null;
  title: string;
  updated_at: string;
}

/** ai_tutor_status() -> sahifa holati. */
export function tutorHolati(s: { available?: unknown; reason?: unknown } | null | undefined): TutorHolati {
  if (s?.available === true) return 'tayyor';
  return s?.reason === 'not_in_plan' ? 'tarifda-yoq' : 'yopiq';
}

/** Edge Function xato kodi -> foydalanuvchi matni. */
export function tutorXatoMatni(kod: string, qaytaSoniya?: number): string {
  switch (kod) {
    case 'cb_content':
      return "This looks like official or copied test material, so the tutor can't read or rewrite it. Describe the idea you're stuck on in your own words, or pick one of your Tayanch mistakes.";
    case 'message_too_long':
    case 'request_too_large':
      return `Your message is too long. Keep it under ${XABAR_MAX} characters.`;
    case 'empty_message':
      return 'Write a question first.';
    case 'rate_limited':
      return `Please wait ${Math.max(1, qaytaSoniya ?? 5)} seconds before sending another message.`;
    case 'duplicate':
      return 'You just sent this message. Change the wording or wait a minute.';
    case 'quota_exceeded':
      return "You've used all AI tutor messages for now. The counter below shows when it resets.";
    case 'not_in_plan':
      return "The AI tutor isn't included in your plan.";
    case 'ai_paused':
      return 'The AI tutor is turned off right now. Your saved conversations are still here.';
    case 'attempt_not_found':
      return "That mistake can't be used with the tutor. Only Tayanch practice questions are supported.";
    case 'conversation_not_found':
      return "This conversation can't be continued. Start a new one.";
    case 'ai_unavailable':
      return "The AI service didn't answer. Nothing was counted. Please try again in a moment.";
    case 'not_signed_in':
      return 'Your session has ended. Sign in again.';
    case 'network_error':
      return 'No connection. Check your internet and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/** Tekshiruv belgisi matni (har AI javobi ostida). */
export function tekshiruvYozuv(t: Tekshiruv | null | undefined): string {
  switch (t) {
    case 'verified':
      return 'Checked: the final answer matches the answer key.';
    case 'unverified':
      return "Couldn't be checked against the answer key.";
    default:
      return 'Not checked against an answer key.';
  }
}

const OYLAR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Toshkent sanasi: "12 Nov". */
export function qisqaSana(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const t = new Date(d.getTime() + 5 * 3600 * 1000);
  return `${t.getUTCDate()} ${OYLAR[t.getUTCMonth()]}`;
}

/** Xato tanlovi ro'yxatidagi yozuv: "Math · Linear equations · 12 Nov: If 2x + 3 = ..." */
export function xatoYozuv(x: XatoTanlov): string {
  const bolim = x.section === 'math' ? 'Math' : 'Reading and Writing';
  return `${bolim} · ${x.skill} · ${qisqaSana(x.created_at)}: ${x.snippet}`;
}

/** usage_status() dan faqat AI kalitlari (UsageBar faqat shularni ko'rsatadi). */
export const AI_KALITLAR = ['ai_messages', 'ai_messages_month'] as const;
export function aiUsage(u: UsageJavob | null | undefined): UsageJavob | null {
  if (!u) return null;
  const tanla = <T>(o: Record<string, T> | null | undefined) =>
    Object.fromEntries(Object.entries(o ?? {}).filter(([k]) => (AI_KALITLAR as readonly string[]).includes(k)));
  return { ...u, limits: tanla(u.limits), today: tanla(u.today) };
}

/** ?attempt=123 -> 123 (musbat butun son bo'lmasa null). */
export function attemptParam(qidiruv: string): number | null {
  const v = new URLSearchParams(qidiruv).get('attempt');
  if (!v || !/^\d{1,15}$/.test(v)) return null;
  const n = Number(v);
  return n > 0 ? n : null;
}
