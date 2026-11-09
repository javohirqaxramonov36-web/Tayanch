// Hisob (Supabase Auth) uchun brauzer yordamchilari. Faqat <script> ichida ishlatiladi.
// Kalitlar: faqat ochiq URL va ochiq (publishable/anon) kalit, astro:env orqali (astro.config.mjs).
// Parol, token va sessiya hech qachon console'ga yozilmaydi.
import { createClient, type AuthError, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from 'astro:env/client';
import { hisobSozlama } from '../data/hisobSozlama';
import { yol } from './yol';

export type HisobSahifa = 'kirish' | 'royxat' | 'parol-tiklash' | 'profil';
export const hisobYoli = (sahifa: HisobSahifa) => yol(`/uz/sat/hisob/${sahifa}/`);
/** Xatdagi havolalar uchun to'liq manzil (Supabase "Redirect URLs" ro'yxatida bo'lishi kerak). */
export const toliqManzil = (ichki: string) => location.origin + ichki;

// Supabase URL'dagi #access_token... va #error=... ni o'qib, tozalab yuboradi.
// Shuning uchun boshlang'ich hash modul yuklanishi bilan (mijoz yaratilishidan oldin) eslab qolinadi.
const BOSHLANGICH = new URLSearchParams(typeof location === 'undefined' ? '' : location.hash.replace(/^#/, ''));

/** Xatdagi havoladan kelganda: tur (signup, recovery) va xato (masalan muddati o'tgan havola). */
export const havolaHolati = {
  tur: BOSHLANGICH.get('type'),
  xato: BOSHLANGICH.get('error_code') || BOSHLANGICH.get('error'),
};

let mijoz: SupabaseClient | null | undefined;

/** Supabase mijozi. URL yoki kalit build paytida berilmagan bo'lsa null (hisob hali ishlamaydi). */
export function hisobMijoz(): SupabaseClient | null {
  if (mijoz !== undefined) return mijoz;
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return (mijoz = null);
  mijoz = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      storageKey: hisobSozlama.sessiyaKaliti,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // implicit: xatdagi havola boshqa brauzer yoki telefonda ochilsa ham ishlaydi (PKCE esa shu brauzerni talab qiladi).
      flowType: 'implicit',
    },
  });
  // Havoladagi xato hash'da qoladi: foydalanuvchi sahifani yangilasa qayta ko'rinmasin.
  if (havolaHolati.xato) history.replaceState(null, '', location.pathname + location.search);
  return mijoz;
}

/** ?keyin= faqat sayt ichidagi yo'l bo'lsa qabul qilinadi (ochiq redirect yo'q). */
export function keyingiManzil(standart = hisobYoli('profil')): string {
  const k = new URLSearchParams(location.search).get('keyin');
  if (k && k.startsWith(yol('/uz/')) && !k.startsWith('//') && !k.includes('\\') && !k.includes('://')) return k;
  return standart;
}

let qorovulVadasi: Promise<Session | null> | undefined;

/**
 * Himoyalangan sahifa qorovuli (HisobQorovul komponenti va sahifa skripti bir xil va'dani oladi).
 * Sessiya yo'q bo'lsa kirish sahifasiga yuboradi (?keyin= bilan) va null qaytaradi.
 */
export function hisobQorovul(): Promise<Session | null> {
  qorovulVadasi ??= (async () => {
    const c = hisobMijoz();
    if (!c) return null;
    const { data } = await c.auth.getSession();
    if (!data.session) {
      location.replace(`${hisobYoli('kirish')}?keyin=${encodeURIComponent(location.pathname)}`);
      return null;
    }
    return data.session;
  })();
  return qorovulVadasi;
}

type Amal = 'kirish' | 'royxat' | 'tiklash' | 'yangilash' | 'profil' | 'qayta-yuborish';

/** Supabase xatosini foydalanuvchi matniga aylantiradi. Email borligi yoki yo'qligi hech qachon aytilmaydi. */
export function xatoMatni(e: AuthError | Error, amal: Amal): string {
  const x = e as AuthError & { code?: string; status?: number };
  if (x.name === 'AuthRetryableFetchError' || x instanceof TypeError) {
    return 'Could not reach the server. Check your internet connection and try again.';
  }
  if (x.status === 429 || x.code?.startsWith('over_')) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  if (x.code === 'weak_password') return 'This password is too weak. Choose a longer one that is harder to guess.';
  if (x.code === 'same_password') return 'The new password must be different from your current one.';
  if (amal === 'kirish') {
    // Supabase bu xatoni parol to'g'ri bo'lgandagina beradi (tekshirish kerak), shuning uchun email borligini oshkor qilmaydi.
    if (x.code === 'email_not_confirmed') return 'Please confirm your email first: open the link we sent you.';
    return 'Invalid email or password.';
  }
  if (amal === 'royxat') return 'Could not create the account. Please try again.';
  if (amal === 'yangilash') return 'Could not save the new password. The reset link may have expired: request a new one.';
  return 'Something went wrong. Please try again.';
}

/** Havoladagi xato (muddati o'tgan yoki ishlatilgan havola) uchun matn. */
export const havolaXatoMatni = 'This link is invalid or has expired. Request a new one below.';

// ---- Forma yordamchilari ----

/** Maydon xatosini ko'rsatadi yoki tozalaydi (aria-invalid va aria-describedby bilan bog'langan <p>). */
export function maydonXatosi(input: HTMLInputElement, matn: string | null): void {
  const p = document.getElementById(`${input.id}-xato`);
  if (matn) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
  if (p) {
    p.textContent = matn ?? '';
    p.hidden = !matn;
  }
}

/** Tugmani yuklanish holatiga o'tkazadi (qayta bosilmaydi, ekran o'quvchiga band ekani aytiladi). */
export function yuklanish(tugma: HTMLButtonElement, band: boolean, matn?: string): void {
  if (!tugma.dataset.asl) tugma.dataset.asl = tugma.textContent ?? '';
  tugma.disabled = band;
  tugma.setAttribute('aria-busy', String(band));
  tugma.textContent = band ? (matn ?? 'Please wait…') : tugma.dataset.asl;
}

/** Forma darajasidagi xato (role="alert") yoki holat (role="status") xabari. */
export function xabar(el: HTMLElement | null, matn: string | null): void {
  if (!el) return;
  el.textContent = matn ?? '';
  el.hidden = !matn;
}

/** Oddiy email tekshiruvi (asosiy tekshiruv Supabase'da). */
export const emailTogrimi = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/** Hisob o'chirilgan (env yo'q) holat: forma yashiriladi, ogohlik ko'rinadi. */
export function hisobYoqBolsa(): boolean {
  if (hisobMijoz()) return false;
  document.querySelectorAll<HTMLElement>('[data-hisob-bor]').forEach((el) => (el.hidden = true));
  document.querySelectorAll<HTMLElement>('[data-hisob-yoq]').forEach((el) => (el.hidden = false));
  return true;
}
