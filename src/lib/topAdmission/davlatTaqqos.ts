// Top Admission: "Davlatlarni taqqoslash" sahifasining sof mantig'i (Admission D-seriya, Q2).
// Build paytida (sahifa) va brauzerda (sahifa skripti) bir xil ishlaydi; node --test bilan sinaladi.
// Qoida: filtr, saralash va taxminiy narx FAQAT "tasdiqlangan" faktlardan (faktKorinadimi). Qoralama hech narsaga ta'sir qilmaydi.
import { faktKorinadimi, usdga, kurslarBormi, type Fakt, type Kurslar } from './fakt.ts';
import { grantKorinadimi as katalogdaKorinadimi } from './grantKatalog.ts';

export const FILTRLAR = [
  { id: 'diplom', nomi: "Diplom to'g'ridan-to'g'ri qabul qilinadi" },
  { id: 'ingliz', nomi: 'Ingliz tilida dastur bor' },
  { id: 'grant', nomi: 'Davlat granti bor' },
  { id: 'ishlash', nomi: "O'qish paytida ishlash mumkin" },
] as const;
export type FiltrId = (typeof FILTRLAR)[number]['id'];
export const FILTR_IDLARI: readonly FiltrId[] = FILTRLAR.map((f) => f.id);

export type Saralash = 'nom' | 'narx';
/** Taqqoslash jadvalida ko'pi bilan nechta davlat. */
export const MAKS_TAQQOS = 3;
export const MIN_TAQQOS = 2;

/** Sahifa uchun kerakli qism (davlatSxema'dan). Grant havolalari slug ro'yxatiga aylantirilgan. */
export interface DavlatKirish {
  slug: string;
  nom_uz: string;
  narx: { kontrakt_yillik: Fakt; viza_yashash_summasi: Fakt; valyuta: string };
  /** izoh (E1): ixtiyoriy Fakt, davlat granti topilmagani (grantYoqIzohi). */
  grant: { davlat_grantlari: string[]; izoh?: Fakt | string };
  til: { ingliz_tilida_dastur_bor: Fakt; odatiy_ielts: Fakt };
  ishlash: { oqish_paytida: Fakt; bitirgandan_keyin: Fakt };
  diplom: { togridan_togri: Fakt; tayyorlov_nomi?: Fakt };
}

export interface GrantKirish {
  slug: string;
  turi: 'davlat' | 'universitet';
  nimani_qoplaydi: Fakt;
  deadline: Fakt;
}

/** Davlatning filtr va saralash uchun xulosasi. */
export interface DavlatXulosa {
  slug: string;
  nom: string;
  belgilar: FiltrId[];
  /** Taxminiy yillik xarajat USD'da (kontrakt + viza yashash summasi). Kurs yoki tasdiqlangan fakt yo'q bo'lsa null. */
  usd: number | null;
}

/**
 * Grant davlat kartasida ko'rinadimi: turi "davlat" va Grantlar katalogidagi qoida
 * (`grantKatalog.ts` `grantKorinadimi`: "nimani qoplaydi" va "deadline" tasdiqlangan). "Davlat granti bor" filtri ham shunga tayanadi.
 */
export function grantKorinadimi(g: GrantKirish | undefined): g is GrantKirish {
  return !!g && g.turi === 'davlat' && katalogdaKorinadimi(g);
}

/**
 * "O'qish paytida ishlash mumkin": fakt tasdiqlangan va qiymati "yo'q" ma'nosida emas.
 * Kontent konventsiyasi (Q6/Q7): mumkin emas bo'lsa qiymat `false` (yoki 0 / "yo'q"); mumkin bo'lsa `true`, son (haftasiga soat) yoki qisqa matn.
 */
export function ishlashMumkinmi(f: Fakt | undefined): boolean {
  if (!f || !faktKorinadimi(f)) return false;
  const q = f.qiymat;
  if (q === false || q === 0 || q === null || q === undefined) return false;
  if (typeof q === 'string' && ["yo'q", 'yoq', 'yo‘q', 'yo`q'].includes(q.trim().toLowerCase())) return false;
  return true;
}

const sonmi = (f: Fakt | undefined): f is Fakt<number> =>
  !!f && faktKorinadimi(f) && typeof f.qiymat === 'number' && Number.isFinite(f.qiymat);

/** Taxminiy yillik xarajat USD'da (butun songa yaxlitlangan). Kurs fayli bo'sh bo'lsa null: narx bo'yicha saralash o'chadi. */
export function taxminiyUsd(d: DavlatKirish, kurslar: Kurslar | null | undefined): number | null {
  if (!kurslarBormi(kurslar)) return null;
  const { kontrakt_yillik: k, viza_yashash_summasi: v, valyuta } = d.narx;
  if (!sonmi(k) || !sonmi(v)) return null;
  const usd = usdga((k.qiymat as number) + (v.qiymat as number), valyuta, kurslar);
  return usd === null ? null : Math.round(usd);
}

export function davlatXulosasi(d: DavlatKirish, grantlar: Map<string, GrantKirish>, kurslar: Kurslar | null | undefined): DavlatXulosa {
  const belgilar: FiltrId[] = [];
  const dip = d.diplom.togridan_togri;
  if (faktKorinadimi(dip) && dip.qiymat === 'ha') belgilar.push('diplom');
  const ing = d.til.ingliz_tilida_dastur_bor;
  if (faktKorinadimi(ing) && ing.qiymat === true) belgilar.push('ingliz');
  if (d.grant.davlat_grantlari.some((s) => grantKorinadimi(grantlar.get(s)))) belgilar.push('grant');
  if (ishlashMumkinmi(d.ishlash.oqish_paytida)) belgilar.push('ishlash');
  return { slug: d.slug, nom: d.nom_uz, belgilar, usd: taxminiyUsd(d, kurslar) };
}

/** Davlat kartasidagi qat'iy matn (muallif qarori, 2026-11-20); yonida tekshirilgan sana va manba havolasi. */
export const GRANT_TOPILMADI_MATNI = "Rasmiy manbalarda o'zbek fuqarosi uchun davlat granti topilmadi";

/**
 * "Davlat granti topilmadi" izohi ko'rsatiladimi: `davlat_grantlari` bo'sh va `grant.izoh` fakti tasdiqlangan.
 * Qaytaradi: shu fakt (sana va manba uchun) yoki null (u holda karta "Ma'lumot tekshirilmoqda" ko'rsatadi).
 */
export function grantYoqIzohi(d: Pick<DavlatKirish, 'grant'>): Fakt | null {
  const f = d.grant.izoh;
  return d.grant.davlat_grantlari.length === 0 && f && typeof f === 'object' && faktKorinadimi(f) ? f : null;
}

/** Davlatdagi tasdiqlangan faktlar soni (bo'sh holatni aniqlash uchun). */
export function tasdiqlanganSoni(d: DavlatKirish): number {
  const f = [
    d.narx.kontrakt_yillik, d.narx.viza_yashash_summasi, d.til.ingliz_tilida_dastur_bor, d.til.odatiy_ielts,
    d.ishlash.oqish_paytida, d.ishlash.bitirgandan_keyin, d.diplom.togridan_togri, d.diplom.tayyorlov_nomi,
  ];
  return f.filter((x) => faktKorinadimi(x)).length + (grantYoqIzohi(d) ? 1 : 0);
}

export function filtrdanOtadimi(x: Pick<DavlatXulosa, 'belgilar'>, filtrlar: readonly FiltrId[]): boolean {
  return filtrlar.every((f) => x.belgilar.includes(f));
}

const nomTartib = (a: { nom: string }, b: { nom: string }) => a.nom.localeCompare(b.nom, 'uz');

/** "nom": alifbo. "narx": arzonidan; narxi yo'qlar oxirida (o'zaro alifbo bo'yicha). Asl massiv o'zgarmaydi. */
export function saralash<T extends Pick<DavlatXulosa, 'nom' | 'usd'>>(xlar: readonly T[], tartib: Saralash): T[] {
  const n = [...xlar];
  if (tartib === 'nom') return n.sort(nomTartib);
  return n.sort((a, b) => {
    if (a.usd === null && b.usd === null) return nomTartib(a, b);
    if (a.usd === null) return 1;
    if (b.usd === null) return -1;
    return a.usd - b.usd || nomTartib(a, b);
  });
}

/** Taqqoslash tanlovini almashtirish: bor bo'lsa olib tashlaydi, yo'q bo'lsa (joy bo'lsa) qo'shadi. */
export function taqqosAlmashtir(tanlov: readonly string[], slug: string): string[] {
  if (tanlov.includes(slug)) return tanlov.filter((s) => s !== slug);
  return tanlov.length >= MAKS_TAQQOS ? [...tanlov] : [...tanlov, slug];
}

// ---------- URL holati (ulashish uchun; shaxsiy ma'lumot yo'q) ----------
// ?f=diplom,ingliz  (filtrlar)  &s=narx  (saralash; standart "nom" yozilmaydi)  &t=slug1,slug2  (taqqoslash)

export interface SahifaHolati {
  filtrlar: FiltrId[];
  saralash: Saralash;
  tanlov: string[];
}

const royxat = (v: string | null) => (v ?? '').split(',').map((s) => s.trim()).filter(Boolean);

/** Query'ni o'qish. Noma'lum filtr va slug tashlab yuboriladi; narx saralashi faqat kurs bo'lsa. */
export function holatniOqi(search: string, slugs: readonly string[], narxMumkin: boolean): SahifaHolati {
  const p = new URLSearchParams(search);
  const filtrlar = FILTR_IDLARI.filter((id) => royxat(p.get('f')).includes(id));
  const saralash: Saralash = narxMumkin && p.get('s') === 'narx' ? 'narx' : 'nom';
  const tanlov: string[] = [];
  for (const s of royxat(p.get('t'))) {
    if (slugs.includes(s) && !tanlov.includes(s) && tanlov.length < MAKS_TAQQOS) tanlov.push(s);
  }
  return { filtrlar, saralash, tanlov };
}

/** Holatni query qatoriga yozish ('' yoki '?...'). Mavjud boshqa parametrlar saqlanadi. */
export function holatniYoz(h: SahifaHolati, mavjud = ''): string {
  const p = new URLSearchParams(mavjud);
  const qoy = (k: string, v: string) => (v ? p.set(k, v) : p.delete(k));
  qoy('f', FILTR_IDLARI.filter((id) => h.filtrlar.includes(id)).join(','));
  qoy('s', h.saralash === 'narx' ? 'narx' : '');
  qoy('t', h.tanlov.join(','));
  const q = p.toString().replace(/%2C/g, ',');
  return q ? `?${q}` : '';
}
