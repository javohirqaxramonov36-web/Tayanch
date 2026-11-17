// Pure sync helpers between the local profile and the `onboarding_profiles` row.
// Conflict rule: the newer `updatedAt` wins; on an exact tie the server copy wins (deterministic).
import { profilniTozala, type YolProfil } from './profil.ts';

export const JADVAL = 'onboarding_profiles';

/** Row shape of public.onboarding_profiles (supabase/migrations/20261109130000_onboarding_profiles.sql). */
export interface OnboardingQator {
  user_id: string;
  goals: string[];
  primary_goal: string | null;
  time_left: string | null;
  exam_date: string | null;
  daily_minutes: number | null;
  skipped: boolean;
  updated_at: string;
}

export function qatordanProfil(q: OnboardingQator | null | undefined): YolProfil | null {
  if (!q) return null;
  return profilniTozala({
    goals: q.goals,
    primaryGoal: q.primary_goal,
    timeLeft: q.time_left,
    examDate: q.exam_date,
    dailyMinutes: q.daily_minutes,
    skipped: q.skipped,
    updatedAt: q.updated_at,
  });
}

export function profildanQator(p: YolProfil, userId: string): OnboardingQator {
  return {
    user_id: userId,
    goals: p.goals,
    primary_goal: p.primaryGoal,
    time_left: p.timeLeft,
    exam_date: p.timeLeft === 'date' ? p.examDate : null,
    daily_minutes: p.dailyMinutes,
    skipped: p.skipped,
    updated_at: p.updatedAt,
  };
}

/** Same answers, ignoring the timestamp. */
export function birXilmi(a: YolProfil, b: YolProfil): boolean {
  const k = (p: YolProfil) => JSON.stringify({ ...p, updatedAt: '' });
  return k(a) === k(b);
}

export type SinxronQaror =
  | { amal: 'hech' }
  | { amal: 'lokalga'; profil: YolProfil }
  | { amal: 'serverga'; profil: YolProfil };

/** Decides which side to update. */
export function birlashtir(lokal: YolProfil | null, server: YolProfil | null): SinxronQaror {
  if (!lokal && !server) return { amal: 'hech' };
  if (!server) return { amal: 'serverga', profil: lokal! };
  if (!lokal) return { amal: 'lokalga', profil: server };
  const l = Date.parse(lokal.updatedAt);
  const s = Date.parse(server.updatedAt);
  if (l > s) return { amal: 'serverga', profil: lokal };
  if (s > l) return { amal: 'lokalga', profil: server };
  return birXilmi(lokal, server) ? { amal: 'hech' } : { amal: 'lokalga', profil: server };
}
