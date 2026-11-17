// Saqlash adapteri: brauzerdagi tayanch:* kalitlarini bitta joydan o'qish va yozish.
// Hisobsiz: faqat localStorage (avvalgidek). Hisob bilan va foydalanuvchi roziligidan keyin: localStorage +
// server (Supabase user_state) — debounce, oflayn navbat, xatoda qayta urinish. Qoidalar: docs/sinxron-qoidalari.md.
// Faqat SINXRON_KALITLAR (SAT) kuzatiladi; boshqa kalitlar (IELTS, Top Admission, mavzu) oddiy localStorage.
// Har o'qish/yozish try/catch ichida: maxfiy oyna yoki bloklangan saqlashda sahifa baribir ishlaydi.
import {
  SINXRON_KALITLAR, sinxronKalitmi, vaqtniYangila, birlashtir, sanoq, boshQiymat, serverTomon, serverQiymat, tomonTengmi,
  type SinxronKalit, type Tomon, type Vaqtlar,
} from './holatBirlashtir.ts';

/** Server bilan aloqa (Supabase: holatSupabase.ts; testda soxta server). Xatoda istisno tashlaydi. */
export interface SinxronServer {
  /** user_state dan berilgan kalitlar qiymati: { kalit: value } (yo'q kalit qaytmaydi) */
  oqi(kalitlar: string[]): Promise<Record<string, unknown>>;
  /** user_state ga upsert */
  yoz(yozuvlar: { kalit: string; qiymat: unknown }[]): Promise<void>;
}

const VAQT_KALIT = 'tayanch:sat-sinxron-vaqt';
const NAVBAT_KALIT = 'tayanch:sat-sinxron-navbat';
/** Shu qurilmaning qarori: { foydalanuvchi, holat: 'ulangan' | 'mahalliy' } ("mahalliy" = Don't ask again) */
const ROZILIK_KALIT = 'tayanch:sat-sinxron';
/** sessionStorage: "Not now" (shu sessiyada qayta so'ralmaydi) */
const KEYIN_KALIT = 'tayanch:sat-sinxron-keyin';
/** user_state dagi profil darajasidagi bayroq: { versiya, migrated, birinchi, oxirgi, soni } */
export const IMPORT_BAYROQ = 'tayanch:sat-import';

const KECHIKISH = 2000;
const QAYTA_URINISH = [2000, 10000, 60000];

export type Sanoq = Record<SinxronKalit, number>;
export type UlashNatija = 'ulangan' | 'mahalliy' | 'keyin' | 'sorov' | 'xotira-yoq';

let soat = () => Date.now();
/** Faqat test uchun: vaqt manbasini almashtirish */
export function soatniAlmashtir(f: () => number) { soat = f; }

// ---------- localStorage ----------

function xom(kalit: string): string | null {
  try { return localStorage.getItem(kalit); } catch { return null; }
}
function json<T>(kalit: string, zaxira: T): T {
  const v = xom(kalit);
  if (v == null) return zaxira;
  try { return (JSON.parse(v) as T) ?? zaxira; } catch { return zaxira; }
}

/** O'qish (darsSaqlash.oqi bilan bir xil xatti-harakat) */
export function holatOqi<T>(kalit: string, zaxira: T): T {
  return json(kalit, zaxira);
}

type VaqtJadval = Partial<Record<SinxronKalit, { t: Vaqtlar; o: Vaqtlar }>>;
const vaqtlarniOqi = (): VaqtJadval => {
  const v = json<VaqtJadval>(VAQT_KALIT, {});
  return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
};
const vaqtOl = (j: VaqtJadval, k: SinxronKalit) => ({ t: { ...(j[k]?.t ?? {}) }, o: { ...(j[k]?.o ?? {}) } });
function vaqtQoy(k: SinxronKalit, v: { t: Vaqtlar; o: Vaqtlar }) {
  const j = vaqtlarniOqi();
  j[k] = v;
  try { localStorage.setItem(VAQT_KALIT, JSON.stringify(j)); } catch { /* vaqt saqlanmadi: keyingi birlashtirishda 0 deb olinadi */ }
}

const mahalliyTomon = (k: SinxronKalit): Tomon => {
  const v = vaqtOl(vaqtlarniOqi(), k);
  return { qiymat: json<unknown>(k, undefined), t: v.t, o: v.o };
};

/**
 * Yozish. Avval localStorage (natija shu: true/false, avvalgidek). SAT kaliti bo'lsa yozuv vaqtlari yangilanadi,
 * sinxron yoqilgan bo'lsa serverga yuborish navbatiga qo'yiladi.
 */
export function holatYoz(kalit: string, qiymat: unknown): boolean {
  const kuzat = sinxronKalitmi(kalit);
  const eski = kuzat ? json<unknown>(kalit, undefined) : undefined;
  try {
    localStorage.setItem(kalit, JSON.stringify(qiymat));
  } catch {
    return false;
  }
  if (kuzat) ozgardi(kalit, eski, qiymat);
  return true;
}

/** O'chirish (masalan "Delete results"). SAT kalitida o'chirish boshqa qurilmalarga ham o'tadi (tombstone). */
export function holatOchir(kalit: string): void {
  const kuzat = sinxronKalitmi(kalit);
  const eski = kuzat ? json<unknown>(kalit, undefined) : undefined;
  try { localStorage.removeItem(kalit); } catch { return; }
  if (kuzat) ozgardi(kalit, eski, boshQiymat(kalit));
}

function ozgardi(k: SinxronKalit, eski: unknown, yangi: unknown) {
  vaqtQoy(k, vaqtniYangila(k, eski, yangi, vaqtOl(vaqtlarniOqi(), k), soat()));
  if (faol) navbatgaQosh([k]);
}

/** Brauzerdagi SAT ma'lumoti soni (kalit bo'yicha) */
export function mahalliySanoq(): Sanoq {
  return Object.fromEntries(SINXRON_KALITLAR.map((k) => [k, sanoq(k, json<unknown>(k, undefined))])) as Sanoq;
}
export const jami = (s: Sanoq) => Object.values(s).reduce((a, b) => a + b, 0);

// ---------- sinxron holati ----------

let server: SinxronServer | null = null;
let foydalanuvchi: string | null = null;
let faol = false;
let taymer: ReturnType<typeof setTimeout> | undefined;
let urinish = 0;
let yuborilmoqda: Promise<void> | null = null;
/** Navbatdagi kalitning o'zgarish hisoblagichi: yuborish paytida yangi yozuv kelsa kalit navbatda qoladi */
const versiya = new Map<string, number>();

interface Rozilik { foydalanuvchi: string; holat: 'ulangan' | 'mahalliy' }
const rozilik = () => json<Rozilik | null>(ROZILIK_KALIT, null);
const roziligiYoz = (holat: Rozilik['holat']) => {
  try { localStorage.setItem(ROZILIK_KALIT, JSON.stringify({ foydalanuvchi, holat })); } catch { /* saqlanmadi */ }
};

const navbat = (): SinxronKalit[] => {
  const n = json<unknown>(NAVBAT_KALIT, []);
  return Array.isArray(n) ? n.filter((k): k is SinxronKalit => typeof k === 'string' && sinxronKalitmi(k)) : [];
};
function navbatgaQosh(kalitlar: readonly SinxronKalit[]) {
  const n = new Set(navbat());
  for (const k of kalitlar) { n.add(k); versiya.set(k, (versiya.get(k) ?? 0) + 1); }
  try { localStorage.setItem(NAVBAT_KALIT, JSON.stringify([...n])); } catch { /* xotirada qoladi */ }
  rejala(KECHIKISH);
}
function navbatdanOl(kalitlar: Map<SinxronKalit, number>) {
  const qolgan = navbat().filter((k) => !kalitlar.has(k) || (versiya.get(k) ?? 0) !== kalitlar.get(k));
  try { localStorage.setItem(NAVBAT_KALIT, JSON.stringify(qolgan)); } catch { /* saqlanmadi */ }
}

function rejala(ms: number) {
  if (taymer !== undefined) clearTimeout(taymer);
  taymer = setTimeout(() => { taymer = undefined; void sinxronlaHozir(); }, ms);
}

const onlaynmi = () => (globalThis as { navigator?: { onLine?: boolean } }).navigator?.onLine !== false;

const hodisa = (nomi: string, detail: unknown) => {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(nomi, { detail }));
};

/** Brauzerga yozish (birlashtirish natijasi). Yozish paytida foydalanuvchi o'zgartirgan bo'lsa yozmaydi. */
function mahalliyYoz(k: SinxronKalit, b: Tomon, boshlangich: string | null): boolean {
  if (xom(k) !== boshlangich) return false;
  if (boshlangich === null && sanoq(k, b.qiymat) === 0) { vaqtQoy(k, { t: b.t, o: b.o }); return false; }
  try {
    if (b.qiymat === undefined || b.qiymat === null) localStorage.removeItem(k);
    else localStorage.setItem(k, JSON.stringify(b.qiymat));
  } catch { return false; }
  vaqtQoy(k, { t: b.t, o: b.o });
  return true;
}

/**
 * Navbatdagi kalitlarni server bilan birlashtiradi: serverdan o'qiydi, birlashtiradi, brauzerga yozadi,
 * farq bo'lsa serverga yuboradi. Xatoda 2 s, 10 s, 60 s keyin qayta urinadi; "online" hodisasida darhol.
 */
export function sinxronlaHozir(): Promise<void> {
  if (!faol || !server) return Promise.resolve();
  if (yuborilmoqda) return yuborilmoqda;
  const kalitlar = navbat();
  if (!kalitlar.length) return Promise.resolve();
  if (!onlaynmi()) return Promise.resolve();
  const s = server;
  const boshlanish = new Map(kalitlar.map((k) => [k, versiya.get(k) ?? 0]));
  yuborilmoqda = (async () => {
    try {
      const bosh = new Map(kalitlar.map((k) => [k, xom(k)]));
      const sv = await s.oqi([...kalitlar]);
      const yuborish: { kalit: string; qiymat: unknown }[] = [];
      const yangilangan: SinxronKalit[] = [];
      for (const k of kalitlar) {
        const st = serverTomon(sv[k]);
        const b = birlashtir(k, mahalliyTomon(k), st, 'sinxron');
        if (!tomonTengmi(k, b, mahalliyTomon(k)) && mahalliyYoz(k, b, bosh.get(k) ?? null)) yangilangan.push(k);
        if (!tomonTengmi(k, b, st)) yuborish.push({ kalit: k, qiymat: serverQiymat(b) });
      }
      if (yuborish.length) await s.yoz(yuborish);
      navbatdanOl(boshlanish);
      urinish = 0;
      if (yangilangan.length) hodisa('tayanch:holat-yangilandi', { kalitlar: yangilangan });
    } catch {
      // Xabar yozilmaydi (logga token yoki ma'lumot tushmasin). Navbat saqlanadi.
      rejala(QAYTA_URINISH[Math.min(urinish, QAYTA_URINISH.length - 1)]);
      urinish++;
    } finally {
      yuborilmoqda = null;
    }
    if (navbat().length && taymer === undefined && urinish === 0) rejala(KECHIKISH);
  })();
  return yuborilmoqda;
}

function yoqish() {
  faol = true;
  navbatgaQosh(SINXRON_KALITLAR);
  void sinxronlaHozir();
}

let tinglovchilar = false;
function tinglovchilarniQoy() {
  if (tinglovchilar || typeof window === 'undefined') return;
  tinglovchilar = true;
  window.addEventListener('online', () => { urinish = 0; void sinxronlaHozir(); });
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && navbat().length) void sinxronlaHozir();
    });
  }
}

// ---------- hisob bilan ulash va import ----------

let kutilayotgan: Sanoq | null = null;
let sorovTinglovchi: ((s: Sanoq) => void) | null = null;

/** Import dialogi (SatSinxron.astro) ro'yxatdan o'tadi; so'rov oldinroq kelgan bo'lsa darhol chaqiriladi. */
export function sinxronSoroviniKut(f: (s: Sanoq) => void) {
  sorovTinglovchi = f;
  if (kutilayotgan) f(kutilayotgan);
}

/**
 * Hisob bilan kirilganda chaqiriladi (hisob moduli, P03). Rozilik bo'lmaguncha serverga hech narsa yuborilmaydi.
 * - shu foydalanuvchi avval rozi bo'lgan → sinxron yoqiladi;
 * - "Don't ask again" → shu qurilma faqat brauzerda qoladi;
 * - brauzerda SAT ma'lumoti yo'q → yuboradigan eski ma'lumot yo'q, sinxron yoqiladi;
 * - "Not now" shu sessiyada → hech narsa;
 * - aks holda import dialogi so'raladi.
 */
export function ulash(s: SinxronServer, foydalanuvchiId: string): UlashNatija {
  if (foydalanuvchi !== foydalanuvchiId) uzish();
  server = s;
  foydalanuvchi = foydalanuvchiId;
  tinglovchilarniQoy();
  const r = rozilik();
  if (r?.foydalanuvchi === foydalanuvchiId && r.holat === 'ulangan') { yoqish(); return 'ulangan'; }
  if (r?.foydalanuvchi === foydalanuvchiId && r.holat === 'mahalliy') return 'mahalliy';
  const sq = mahalliySanoq();
  if (jami(sq) === 0) {
    roziligiYoz('ulangan');
    if (rozilik()?.holat !== 'ulangan') return 'xotira-yoq';
    yoqish();
    return 'ulangan';
  }
  try { if (sessionStorage.getItem(KEYIN_KALIT) === foydalanuvchiId) return 'keyin'; } catch { /* sessionStorage yo'q */ }
  kutilayotgan = sq;
  sorovTinglovchi?.(sq);
  return 'sorov';
}

/** Hisobdan chiqilganda: sinxron to'xtaydi, brauzerdagi nusxa qoladi. */
export function uzish() {
  faol = false;
  server = null;
  foydalanuvchi = null;
  kutilayotgan = null;
  if (taymer !== undefined) clearTimeout(taymer);
  taymer = undefined;
}

/**
 * Import (foydalanuvchi "Import" ni bosgandan keyin). Serverdan o'qiydi, 'import' rejimida birlashtiradi
 * (hech narsa o'chirilmaydi), serverga yozadi, keyin brauzerga yozadi va sinxronni yoqadi.
 * Server xatosida brauzerdagi ma'lumot o'zgarmaydi. Takror ishga tushsa natija bir xil (dublikat yo'q).
 */
export async function importQil(): Promise<Sanoq> {
  if (!server || !foydalanuvchi) throw new Error('hisob ulanmagan');
  const s = server;
  const kalitlar = [...SINXRON_KALITLAR];
  const bosh = new Map(kalitlar.map((k) => [k, xom(k)]));
  const sv = await s.oqi([...kalitlar, IMPORT_BAYROQ]);
  const natija = new Map<SinxronKalit, Tomon>();
  const yuborish: { kalit: string; qiymat: unknown }[] = [];
  for (const k of kalitlar) {
    const st = serverTomon(sv[k]);
    const b = birlashtir(k, mahalliyTomon(k), st, 'import');
    natija.set(k, b);
    if (!tomonTengmi(k, b, st)) yuborish.push({ kalit: k, qiymat: serverQiymat(b) });
  }
  const sq = mahalliySanoq();
  const eskiBayroq = sv[IMPORT_BAYROQ] as { birinchi?: string } | undefined;
  const hozir = new Date(soat()).toISOString();
  yuborish.push({
    kalit: IMPORT_BAYROQ,
    qiymat: { versiya: 1, migrated: true, birinchi: eskiBayroq?.birinchi ?? hozir, oxirgi: hozir, soni: sq },
  });
  await s.yoz(yuborish);

  const yangilangan: SinxronKalit[] = [];
  for (const k of kalitlar) {
    const b = natija.get(k)!;
    if (!tomonTengmi(k, b, mahalliyTomon(k))) {
      if (mahalliyYoz(k, b, bosh.get(k) ?? null)) yangilangan.push(k);
    }
  }
  roziligiYoz('ulangan');
  kutilayotgan = null;
  try { sessionStorage.removeItem(KEYIN_KALIT); } catch { /* yo'q */ }
  yoqish();
  if (yangilangan.length) hodisa('tayanch:holat-yangilandi', { kalitlar: yangilangan });
  return sq;
}

/** "Not now": shu sessiyada qayta so'ralmaydi */
export function keyinroq() {
  kutilayotgan = null;
  try { if (foydalanuvchi) sessionStorage.setItem(KEYIN_KALIT, foydalanuvchi); } catch { /* yo'q */ }
}

/** "Don't ask again": shu qurilma shu hisob uchun faqat brauzerda qoladi (serverga hech narsa yuborilmaydi) */
export function soramaslik() {
  kutilayotgan = null;
  roziligiYoz('mahalliy');
}

/** Profil sahifasi uchun (keyinroq): "Don't ask again" ni bekor qilib, dialogni qayta ko'rsatish */
export function importniQaytaTaklif(): UlashNatija {
  try { localStorage.removeItem(ROZILIK_KALIT); sessionStorage.removeItem(KEYIN_KALIT); } catch { /* yo'q */ }
  return server && foydalanuvchi ? ulash(server, foydalanuvchi) : 'mahalliy';
}

/**
 * "Clear local copy": brauzerdagi SAT nusxasini o'chiradi. Hisobdagi nusxaga tegmaydi (tombstone yo'q).
 * Yuborilmagan o'zgarish bo'lsa avval yuboradi; yuborib bo'lmasa o'chirmaydi va false qaytaradi.
 */
export async function mahalliyNusxaniTozala(): Promise<boolean> {
  if (faol) await sinxronlaHozir();
  if (navbat().length) return false;
  try {
    for (const k of SINXRON_KALITLAR) localStorage.removeItem(k);
    localStorage.removeItem(VAQT_KALIT);
    localStorage.removeItem(NAVBAT_KALIT);
  } catch { return false; }
  return true;
}

/** Test uchun ichki holat */
export const _ichki = { navbat, sinxronFaolmi: () => faol };
