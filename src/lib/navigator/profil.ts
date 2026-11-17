// Navigator onboarding profile: type, validation and versioned localStorage persistence.
// Field names mirror the future `onboarding_profiles` table (snake_case there, camelCase here).
import { MAQSADLAR, type Maqsad } from '../../data/navigatorSahifalar.ts';
import type { KunlikDaqiqa } from '../../data/yolXaritasiQoidalar.ts';
import type { MuddatJavob } from '../../data/navigatorMatn.ts';
import type { Ombor } from './ombor.ts';

/** Versioned key: bump the suffix (and add a migration) if the shape changes. */
export const PROFIL_KALITI = 'tayanch:navigator-yol:v1';

export interface YolProfil {
  v: 1;
  goals: Maqsad[];
  primaryGoal: Maqsad | null;
  timeLeft: MuddatJavob | null;
  /** YYYY-MM-DD, only when timeLeft === 'date' */
  examDate: string | null;
  dailyMinutes: KunlikDaqiqa | null;
  skipped: boolean;
  /** ISO timestamp of the last local edit (used for sync conflict resolution) */
  updatedAt: string;
}

const MUDDATLAR: MuddatJavob[] = ['15d', '1m', '3m', 'date', 'unknown'];
const KUNLIKLAR: KunlikDaqiqa[] = [15, 30, 60, 120];

/** Strict YYYY-MM-DD that is also a real calendar date. */
export function sanaTogrimi(s: unknown): s is string {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/**
 * Normalises unknown input into a valid profile, or null if it cannot be one.
 * Unknown/invalid fields are dropped rather than failing the whole profile.
 */
export function profilniTozala(x: unknown): YolProfil | null {
  if (!x || typeof x !== 'object') return null;
  const o = x as Record<string, unknown>;
  const goals = Array.isArray(o.goals)
    ? MAQSADLAR.filter((m) => (o.goals as unknown[]).includes(m))
    : [];
  const skipped = o.skipped === true;
  if (!skipped && goals.length === 0) return null;

  let primaryGoal = goals.includes(o.primaryGoal as Maqsad) ? (o.primaryGoal as Maqsad) : null;
  if (!primaryGoal && goals.length > 0) primaryGoal = goals[0];

  let timeLeft = MUDDATLAR.includes(o.timeLeft as MuddatJavob) ? (o.timeLeft as MuddatJavob) : null;
  let examDate = timeLeft === 'date' && sanaTogrimi(o.examDate) ? o.examDate : null;
  if (timeLeft === 'date' && !examDate) timeLeft = null;

  const dailyMinutes = KUNLIKLAR.includes(o.dailyMinutes as KunlikDaqiqa) ? (o.dailyMinutes as KunlikDaqiqa) : null;
  const vaqt = typeof o.updatedAt === 'string' ? Date.parse(o.updatedAt) : NaN;
  const updatedAt = Number.isFinite(vaqt) ? new Date(vaqt).toISOString() : new Date(0).toISOString();

  return { v: 1, goals, primaryGoal, timeLeft, examDate, dailyMinutes, skipped, updatedAt };
}

/** Reads the saved profile. Corrupted JSON or an invalid shape is silently removed. */
export function profilniOqi(ombor: Ombor): YolProfil | null {
  const xom = ombor.oqi(PROFIL_KALITI);
  if (xom === null) return null;
  let p: YolProfil | null = null;
  try {
    p = profilniTozala(JSON.parse(xom));
  } catch {
    p = null;
  }
  if (!p) ombor.ochir(PROFIL_KALITI);
  return p;
}

/** Saves the profile; returns false if it only reached memory. */
export function profilniYoz(ombor: Ombor, p: YolProfil): boolean {
  return ombor.yoz(PROFIL_KALITI, JSON.stringify(p));
}

/** Profile written when the user presses "Skip". */
export function otkazilganProfil(hozir: Date, avvalgi?: YolProfil | null): YolProfil {
  return {
    v: 1,
    goals: avvalgi?.goals ?? [],
    primaryGoal: avvalgi?.primaryGoal ?? null,
    timeLeft: avvalgi?.timeLeft ?? null,
    examDate: avvalgi?.examDate ?? null,
    dailyMinutes: avvalgi?.dailyMinutes ?? null,
    skipped: true,
    updatedAt: hozir.toISOString(),
  };
}
