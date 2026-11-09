// Hisob (Supabase Auth) uchun brauzer yordamchilari. Faqat <script> ichida ishlatiladi.
// Kalitlar: faqat ochiq URL va ochiq (publishable/anon) kalit, astro:env orqali (astro.config.mjs).
// Parol, token va sessiya hech qachon console'ga yozilmaydi.
import { createClient, type AuthError, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from 'astro:env/client';
import { hisobSozlama } from '../data/hisobSozlama';
import { yol } from './yol';
import type { HisobSahifaKalit } from '../data/hisobSahifalar';

// Hisob sahifalari 1-qavatda (bir bino, bitta kalit): hamma qavat shu yerga yuboradi. Matn o'zbekcha.
export const hisobYoli = (sahifa: HisobSahifaKalit) => yol(`/uz/hisob/${sahifa}/`);
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
    return "Serverga ulanib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.";
  }
  if (x.status === 429 || x.code?.startsWith('over_')) {
    return "Urinishlar juda ko'p. Bir necha daqiqa kutib, qayta urinib ko'ring.";
  }
  if (x.code === 'weak_password') return "Parol juda oddiy. Uzunroq va topish qiyinroq parol tanlang.";
  if (x.code === 'same_password') return "Yangi parol hozirgisidan farq qilishi kerak.";
  if (amal === 'kirish') {
    // Supabase bu xatoni parol to'g'ri bo'lgandagina beradi (tekshirish kerak), shuning uchun email borligini oshkor qilmaydi.
    if (x.code === 'email_not_confirmed') return "Avval emailingizni tasdiqlang: sizga yuborilgan havolani oching.";
    return "Email yoki parol noto'g'ri.";
  }
  if (amal === 'royxat') return "Hisob ochilmadi. Qayta urinib ko'ring.";
  if (amal === 'yangilash') return "Yangi parol saqlanmadi. Havolaning muddati o'tgan bo'lishi mumkin: yangisini so'rang.";
  return "Nimadir xato ketdi. Qayta urinib ko'ring.";
}

/** Havoladagi xato (muddati o'tgan yoki ishlatilgan havola) uchun matn. */
export const havolaXatoMatni = "Havola noto'g'ri yoki muddati o'tgan. Pastda yangisini so'rang.";

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
  tugma.textContent = band ? (matn ?? 'Kuting…') : tugma.dataset.asl;
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
