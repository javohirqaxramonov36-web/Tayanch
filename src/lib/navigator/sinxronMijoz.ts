// Browser side of the onboarding sync. supabase-js is loaded lazily and only for signed-in users
// (the Navigator is the public home page; anonymous visitors never download it).
// Every failure is silent: the local profile keeps working and the next visit retries.
import type { SupabaseClient } from '@supabase/supabase-js';
import { kirganFoydalanuvchi } from '../hisobHolat.ts';
import type { Ombor } from './ombor.ts';
import { profilniOqi, profilniYoz, type YolProfil } from './profil.ts';
import { JADVAL, birlashtir, profildanQator, qatordanProfil, type OnboardingQator } from './sinxron.ts';

interface Ulanish { mijoz: SupabaseClient; userId: string }

async function ulan(): Promise<Ulanish | null> {
  if (!kirganFoydalanuvchi()) return null; // cheap check of the stored session, no network
  try {
    const { hisobMijoz } = await import('../hisob.ts');
    const mijoz = hisobMijoz();
    if (!mijoz) return null;
    const { data } = await mijoz.auth.getSession();
    const userId = data.session?.user.id;
    return userId ? { mijoz, userId } : null;
  } catch {
    return null;
  }
}

/** Upserts the profile and returns the row the server kept (it may be newer, or have a clamped time). */
async function yoz(u: Ulanish, p: YolProfil): Promise<YolProfil | null> {
  const { data, error } = await u.mijoz
    .from(JADVAL)
    .upsert(profildanQator(p, u.userId), { onConflict: 'user_id' })
    .select()
    .maybeSingle<OnboardingQator>();
  return error ? null : qatordanProfil(data);
}

/**
 * Two-way sync on page load. Returns the profile to show if the local copy changed, otherwise null.
 * The local side is re-read after the network call, so an answer saved meanwhile is never overwritten
 * by an older server copy.
 */
export async function sinxronla(ombor: Ombor): Promise<YolProfil | null> {
  const u = await ulan();
  if (!u) return null;
  try {
    const { data, error } = await u.mijoz.from(JADVAL).select('*').eq('user_id', u.userId).maybeSingle<OnboardingQator>();
    if (error) return null;
    const qaror = birlashtir(profilniOqi(ombor), qatordanProfil(data));
    if (qaror.amal === 'lokalga') {
      profilniYoz(ombor, qaror.profil);
      return qaror.profil;
    }
    if (qaror.amal === 'serverga') {
      const saqlangan = await yoz(u, qaror.profil);
      // Adopt the server's copy (newer row from another device, or clamped timestamp) to avoid ping-pong.
      if (saqlangan && saqlangan.updatedAt !== qaror.profil.updatedAt) {
        profilniYoz(ombor, saqlangan);
        return saqlangan;
      }
    }
  } catch { /* offline or table missing: keep local */ }
  return null;
}

/** Fire-and-forget push after a local save (onboarding finished, skipped or rebuilt). */
export async function serverga(p: YolProfil, ombor: Ombor): Promise<YolProfil | null> {
  const u = await ulan();
  if (!u) return null;
  try {
    const saqlangan = await yoz(u, p);
    if (saqlangan && saqlangan.updatedAt !== p.updatedAt) {
      profilniYoz(ombor, saqlangan);
      return saqlangan;
    }
  } catch { /* keep local */ }
  return null;
}
