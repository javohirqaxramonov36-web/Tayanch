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

/** URL va ochiq kalit build paytida berilganmi (hisob saytda ishlaydimi). Mijoz yaratmaydi. */
export const hisobSozlangan = () => Boolean(PUBLIC_SUPABASE_URL && PUBLIC_SUPABASE_ANON_KEY);

/** Supabase mijozi. URL yoki kalit build paytida berilmagan bo'lsa null (hisob hali ishlamaydi). */
export function hisobMijoz(): SupabaseClient | null {
  if (mijoz !== undefined) return mijoz;
  if (!hisobSozlangan()) return (mijoz = null);
  mijoz = createClient(PUBLIC_SUPABASE_URL!, PUBLIC_SUPABASE_ANON_KEY!, {
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

/** "Keyin qayerga" faqat sayt ichidagi yo'l bo'lsa qabul qilinadi (ochiq redirect yo'q). Callback sahifasi qabul qilinmaydi. */
export function xavfsizKeyin(k: string | null | undefined, standart = hisobYoli('profil')): string {
  if (
    k && k.startsWith(yol('/uz/')) && !k.startsWith('//') && !k.includes('\\') && !k.includes('://')
    && !k.startsWith(hisobYoli('callback'))
  ) return k;
  return standart;
}

/** ?keyin= dan keyingi manzil (xavfsizKeyin qoidasi bilan). */
export function keyingiManzil(standart = hisobYoli('profil')): string {
  return xavfsizKeyin(new URLSearchParams(location.search).get('keyin'), standart);
}

// ---- Google (OAuth, PKCE) ----
// Email havolalari implicit qoladi (boshqa qurilmada ochilsa ham ishlaydi). Google uchun alohida PKCE mijozi:
// kod shu brauzerda, 5 daqiqa ichida, bir marta almashtiriladi (verifier `tayanch:auth-code-verifier` da).
// Sessiya bir xil kalitga (`tayanch:auth`) yoziladi, keyin uni asosiy (implicit) mijoz o'qiydi va yangilaydi.
// Batafsil: docs/qarorlar/002-google-kirish.md.

let googleC: SupabaseClient | null | undefined;

/**
 * Google uchun PKCE mijozi. Faqat Google tugmasi bosilganda va callback sahifasida yaratiladi.
 * detectSessionInUrl o'chiq: ?code= ni callback sahifasi o'zi almashtiradi. Token yangilashni asosiy mijoz qiladi.
 * Bir sahifada ikkala mijoz bo'lsa supabase-js console'da "Multiple GoTrueClient instances" ogohligini beradi:
 * kalit va qulf (lock) bir xil, shuning uchun zararsiz.
 */
export function googleMijoz(): SupabaseClient | null {
  if (googleC !== undefined) return googleC;
  if (!hisobSozlangan()) return (googleC = null);
  googleC = createClient(PUBLIC_SUPABASE_URL!, PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      storageKey: hisobSozlama.sessiyaKaliti,
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  });
  return googleC;
}

/**
 * Google'ga yuboradi. `keyin` sessionStorage'ga yoziladi (redirectTo query'siz: allow-list'da aniq manzil).
 * Muvaffaqiyatda brauzer Google'ga o'tadi; xato bo'lsa AuthError qaytadi.
 */
export async function googleBilanKirish(keyin: string): Promise<AuthError | null> {
  const c = googleMijoz();
  if (!c) return null;
  try {
    sessionStorage.setItem(hisobSozlama.keyinKaliti, keyin);
  } catch {
    // sessionStorage yopiq bo'lsa kirgandan keyin profilga qaytadi.
  }
  const { error } = await c.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: toliqManzil(hisobYoli('callback')) },
  });
  return error;
}

type GoogleXato = 'bekor' | 'eskirgan' | 'tarmoq' | 'boshqa';

/** Callback'dagi xato turini aniqlaydi: URL'dagi `error` yoki almashtirish (exchange) xatosi. */
export function googleXatoTuri(e: { name?: string; code?: string; error?: string } | null): GoogleXato {
  if (!e) return 'boshqa';
  if (e.error === 'access_denied' || e.code === 'access_denied') return 'bekor';
  if (e.name === 'AuthRetryableFetchError' || e instanceof TypeError) return 'tarmoq';
  if (
    e.name === 'AuthPKCECodeVerifierMissingError'
    || ['pkce_code_verifier_not_found', 'flow_state_expired', 'flow_state_not_found', 'bad_code_verifier'].includes(e.code ?? '')
  ) return 'eskirgan';
  return 'boshqa';
}

export const googleXatoMatni: Record<GoogleXato, string> = {
  bekor: 'Google orqali kirishni bekor qildingiz.',
  eskirgan: "Bu kirish urinishining muddati o'tgan. Qaytadan boshlang.",
  tarmoq: "Serverga ulanib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.",
  boshqa: "Google orqali kirib bo'lmadi. Qayta urinib ko'ring.",
};

// ---- Rozilik darvozasi ----
// Hisob bilan ishlashdan oldin profiles.consent_version bo'sh bo'lmasligi kerak (Maxfiylik, Shartlar, yosh).
// Email bilan ro'yxatda rozilik formada beriladi va user_metadata'ga yoziladi: joriy versiya bo'lsa
// darvoza uni profiles'ga o'zi ko'chiradi. Google bilan birinchi kirishda rozilik sahifasi so'raydi.
// profiles o'qib bo'lmasa darvoza yopiq qoladi (xato).

export type RozilikHolati = 'bor' | 'yoq';

export const rozilikYoli = (keyin: string) => `${hisobYoli('rozilik')}?keyin=${encodeURIComponent(keyin)}`;

/** profiles.consent_version ga joriy versiyani yozadi (consent_at ni trigger qo'yadi). */
export async function rozilikYoz(c: SupabaseClient, sessiya: Session): Promise<void> {
  const { data, error } = await c
    .from('profiles')
    .update({ consent_version: hisobSozlama.rozilikVersiya })
    .eq('id', sessiya.user.id)
    .select('consent_version')
    .maybeSingle();
  if (error) throw error;
  if (!data?.consent_version) throw new Error('Rozilik yozilmadi');
}

/** Rozilik bormi. O'qib bo'lmasa xato tashlaydi (darvoza yopiq qoladi). */
export async function rozilikHolati(c: SupabaseClient, sessiya: Session): Promise<RozilikHolati> {
  const { data, error } = await c.from('profiles').select('consent_version').eq('id', sessiya.user.id).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('Profil topilmadi');
  // Hujjatlar o'zgarsa (rozilikVersiya yangi sana) eski rozilik yetmaydi: qayta so'raladi.
  if (data.consent_version === hisobSozlama.rozilikVersiya) return 'bor';
  if (sessiya.user.user_metadata?.consent_version === hisobSozlama.rozilikVersiya) {
    await rozilikYoz(c, sessiya);
    return 'bor';
  }
  return 'yoq';
}

/** Darvoza xatosi uchun matn (HisobQorovul va rozilik sahifasi). */
export const rozilikXatoMatni = "Hisob ma'lumotini o'qib bo'lmadi. Sahifani yangilab, qayta urinib ko'ring.";

let qorovulVadasi: Promise<Session | null> | undefined;

/**
 * Himoyalangan sahifa qorovuli (HisobQorovul komponenti va sahifa skripti bir xil va'dani oladi).
 * Sessiya yo'q bo'lsa kirish sahifasiga yuboradi (?keyin= bilan) va null qaytaradi.
 * Rozilik yo'q bo'lsa rozilik sahifasiga yuboradi va null qaytaradi. profiles o'qib bo'lmasa va'da rad etiladi.
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
    if ((await rozilikHolati(c, data.session)) === 'yoq') {
      location.replace(rozilikYoli(location.pathname));
      return null;
    }
    return data.session;
  })();
  return qorovulVadasi;
}

type Amal = 'kirish' | 'royxat' | 'tiklash' | 'yangilash' | 'profil' | 'qayta-yuborish' | 'ochirish';

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
  if (amal === 'ochirish') return "Hisob o'chirilmadi. Qayta urinib ko'ring.";
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
