// Top Admission: "Grantlar katalogi" sahifasining sof mantig'i (Admission D-seriya, Q3).
// Build paytida (sahifa) va brauzerda (sahifa skripti) bir xil ishlaydi; node --test bilan sinaladi.
// Qoida: filtr, saralash va "muddat o'tgan" belgisi FAQAT "tasdiqlangan" faktlardan (faktKorinadimi).
import { faktKorinadimi, type Fakt } from './fakt.ts';
import { kunFarqi, sanaTogri } from '../muddat.ts';

export type GrantTuri = 'davlat' | 'universitet';
export type Daraja = 'bakalavr' | 'magistr' | 'ikkalasi';
/** Filtrdagi daraja: "ikkalasi" grant ikkala filtrga ham mos keladi. */
export type DarajaFiltr = 'bakalavr' | 'magistr';

export const TURLAR: readonly { id: GrantTuri; nomi: string }[] = [
  { id: 'davlat', nomi: 'Davlat granti' },
  { id: 'universitet', nomi: 'Universitet granti' },
];
export const DARAJALAR: readonly { id: DarajaFiltr; nomi: string }[] = [
  { id: 'bakalavr', nomi: 'Bakalavr' },
  { id: 'magistr', nomi: 'Magistr' },
];
export const DARAJA_MATNI: Record<Daraja, string> = { bakalavr: 'Bakalavr', magistr: 'Magistr', ikkalasi: 'Bakalavr va magistr' };
export const TUR_MATNI: Record<GrantTuri, string> = { davlat: 'Davlat granti', universitet: 'Universitet granti' };

/**
 * Saytdagi ichki yo'nalish sahifalari (o'chirilmaydi, grant kartasidan havola beriladi).
 * Kalit grant slug'i yoki davlat slug'i (turi "davlat" bo'lsa). Kontent agentlari (Q7, Q8): Turkiya davlat slug'i `turkiya`.
 */
export const ICHKI_SAHIFALAR: readonly { grant?: string; davlat?: string; yol: string; nomi: string }[] = [
  { grant: 'turkiye-burslari', davlat: 'turkiya', yol: '/uz/top-admission/turkiye-burslari/', nomi: "Türkiye Bursları bo'yicha qo'llanma" },
];

/** Sahifa uchun kerakli qism (grantSxema'dan). Havolalar slug qatoriga aylantirilgan. */
export interface GrantKirish {
  slug: string;
  nom: string;
  turi: GrantTuri;
  davlat: string;
  daraja: Daraja;
  nimani_qoplaydi: Fakt;
  toliq_qoplaydi?: Fakt;
  deadline: Fakt;
  /** To'liq ehtiyojga asoslangan yordam: kartada oila hissasi izohi (universitetMoslik.ts EHTIYOJ_IZOHI). */
  toliq_ehtiyoj?: boolean;
  /** Qo'llanma bo'limi (E4); bo'lsa kartada "To'liq qo'llanma" tugmasi (ichkiSahifa). */
  qollanma?: unknown;
}

export type MuddatHolati = 'kelajak' | 'nomalum' | 'otgan';

/**
 * Tasdiqlangan deadline o'tgan bo'lsa kartadagi belgi (grant va universitet; muallif qarori 2026-11-20).
 * Keyingi sana rasmiy e'lon qilinsa, kontent agenti deadline faktini yangi sana bilan yangilaydi va belgi o'zi yo'qoladi.
 */
export const MUDDAT_OTGAN_MATNI = "Bu yilgi muddat o'tgan, keyingisi hali e'lon qilinmagan";

export interface GrantXulosa {
  slug: string;
  nom: string;
  turi: GrantTuri;
  davlat: string;
  daraja: Daraja;
  toliq: boolean;
  /** Tasdiqlangan deadline YYYY-MM-DD bo'lsa shu sana, aks holda null (matn yoki tekshirilmoqda). */
  sana: string | null;
}

/**
 * Grant katalogda ko'rinadimi: "nimani qoplaydi" VA "deadline" faktlari ikkalasi ham tasdiqlangan
 * (muallif qarori, 2026-11-20). Deadline matnli bo'lishi mumkin (masalan "yil davomida"), u ham tasdiqlangan bo'lsa yetarli.
 */
export function grantKorinadimi(g: Pick<GrantKirish, 'nimani_qoplaydi' | 'deadline'> | undefined): boolean {
  return !!g && faktKorinadimi(g.nimani_qoplaydi) && faktKorinadimi(g.deadline);
}

/** "To'liq qoplaydi": faqat `toliq_qoplaydi` fakti tasdiqlangan va qiymati aynan true bo'lsa. */
export function toliqQoplaydimi(g: Pick<GrantKirish, 'toliq_qoplaydi'>): boolean {
  const f = g.toliq_qoplaydi;
  return !!f && faktKorinadimi(f) && f.qiymat === true;
}

/** Saralanadigan deadline sanasi: fakt tasdiqlangan va qiymati haqiqiy YYYY-MM-DD. */
export function deadlineSanasi(f: Fakt | undefined): string | null {
  if (!f || !faktKorinadimi(f)) return null;
  return sanaTogri(f.qiymat) ? f.qiymat : null;
}

export function grantXulosasi(g: GrantKirish): GrantXulosa {
  return { slug: g.slug, nom: g.nom, turi: g.turi, davlat: g.davlat, daraja: g.daraja, toliq: toliqQoplaydimi(g), sana: deadlineSanasi(g.deadline) };
}

/** Muddat bugunga nisbatan: bugun ham hali "kelajak" (o'tmagan). Sana yo'q bo'lsa "nomalum". */
export function muddatHolati(sana: string | null, bugun: string): MuddatHolati {
  if (!sana) return 'nomalum';
  return kunFarqi(bugun, sana) < 0 ? 'otgan' : 'kelajak';
}

const DARAJA_MOS: Record<Daraja, readonly DarajaFiltr[]> = { bakalavr: ['bakalavr'], magistr: ['magistr'], ikkalasi: ['bakalavr', 'magistr'] };

/** Grant qo'llanmasi sahifasining yo'li (E4): `src/pages/uz/top-admission/grantlar/[slug].astro`. */
export const qollanmaYoli = (slug: string) => `/uz/top-admission/grantlar/${slug}/`;
export const QOLLANMA_TUGMA = "To'liq qo'llanma";

/**
 * Ichki sahifa (bo'lsa). Tartib: (1) grant slug'iga bog'langan mavjud sahifa (Türkiye Bursları);
 * (2) grantda `qollanma` bo'limi bo'lsa, umumiy qo'llanma sahifasi (E4); (3) davlat grantlari uchun davlatning ichki sahifasi.
 */
export function ichkiSahifa(g: Pick<GrantKirish, 'slug' | 'turi' | 'davlat'> & { qollanma?: unknown }) {
  const aniq = ICHKI_SAHIFALAR.find((s) => s.grant === g.slug);
  if (aniq) return aniq;
  if (g.qollanma) return { grant: g.slug, yol: qollanmaYoli(g.slug), nomi: QOLLANMA_TUGMA };
  return ICHKI_SAHIFALAR.find((s) => g.turi === 'davlat' && s.davlat === g.davlat);
}

// ---------- Filtr holati (URL query'da; shaxsiy ma'lumot yo'q) ----------
// ?tur=davlat  &d=slug1,slug2  &dr=bakalavr  &toliq=1
// Guruh ichida "yoki", guruhlar orasida "va". Bo'sh guruh = hammasi.

export interface KatalogHolati {
  turlar: GrantTuri[];
  davlatlar: string[];
  darajalar: DarajaFiltr[];
  toliq: boolean;
}

export const BOSH_HOLAT: KatalogHolati = Object.freeze({ turlar: [], davlatlar: [], darajalar: [], toliq: false }) as KatalogHolati;

export function filtrdanOtadimi(x: Pick<GrantXulosa, 'turi' | 'davlat' | 'daraja' | 'toliq'>, h: KatalogHolati): boolean {
  if (h.turlar.length && !h.turlar.includes(x.turi)) return false;
  if (h.davlatlar.length && !h.davlatlar.includes(x.davlat)) return false;
  if (h.darajalar.length && !h.darajalar.some((d) => DARAJA_MOS[x.daraja].includes(d))) return false;
  if (h.toliq && !x.toliq) return false;
  return true;
}

export function filtrBormi(h: KatalogHolati): boolean {
  return h.turlar.length > 0 || h.davlatlar.length > 0 || h.darajalar.length > 0 || h.toliq;
}

const nomTartib = (a: { nom: string }, b: { nom: string }) => a.nom.localeCompare(b.nom, 'uz');
const GURUH: Record<MuddatHolati, number> = { kelajak: 0, nomalum: 1, otgan: 2 };

/**
 * Deadline bo'yicha: eng yaqin kelgusi muddat birinchi; keyin sanasi noma'lum (alifbo);
 * oxirida muddati o'tganlar (eng yaqinda o'tgani birinchi). Asl massiv o'zgarmaydi.
 */
export function saralash<T extends Pick<GrantXulosa, 'nom' | 'sana'>>(xlar: readonly T[], bugun: string): T[] {
  return [...xlar].sort((a, b) => {
    const ga = GURUH[muddatHolati(a.sana, bugun)];
    const gb = GURUH[muddatHolati(b.sana, bugun)];
    if (ga !== gb) return ga - gb;
    if (ga === 0) return a.sana!.localeCompare(b.sana!) || nomTartib(a, b);
    if (ga === 2) return b.sana!.localeCompare(a.sana!) || nomTartib(a, b);
    return nomTartib(a, b);
  });
}

const royxat = (v: string | null) => (v ?? '').split(',').map((s) => s.trim()).filter(Boolean);

/** Query'ni o'qish. Noma'lum tur, davlat va daraja tashlab yuboriladi. */
export function holatniOqi(search: string, davlatSluglar: readonly string[]): KatalogHolati {
  const p = new URLSearchParams(search);
  const tur = royxat(p.get('tur'));
  const d = royxat(p.get('d'));
  const dr = royxat(p.get('dr'));
  return {
    turlar: TURLAR.map((x) => x.id).filter((id) => tur.includes(id)),
    davlatlar: davlatSluglar.filter((s) => d.includes(s)),
    darajalar: DARAJALAR.map((x) => x.id).filter((id) => dr.includes(id)),
    toliq: p.get('toliq') === '1',
  };
}

/** Holatni query qatoriga yozish ('' yoki '?...'). Mavjud boshqa parametrlar saqlanadi. */
export function holatniYoz(h: KatalogHolati, mavjud = ''): string {
  const p = new URLSearchParams(mavjud);
  const qoy = (k: string, v: string) => (v ? p.set(k, v) : p.delete(k));
  qoy('tur', TURLAR.map((x) => x.id).filter((id) => h.turlar.includes(id)).join(','));
  qoy('d', h.davlatlar.join(','));
  qoy('dr', DARAJALAR.map((x) => x.id).filter((id) => h.darajalar.includes(id)).join(','));
  qoy('toliq', h.toliq ? '1' : '');
  const q = p.toString().replace(/%2C/g, ',');
  return q ? `?${q}` : '';
}

/** Ro'yxatda bitta qiymatni yoqish/o'chirish (tartib `tartib` bo'yicha). */
export function almashtir<T extends string>(royxat: readonly T[], qiymat: T, tartib: readonly T[]): T[] {
  const yangi = royxat.includes(qiymat) ? royxat.filter((x) => x !== qiymat) : [...royxat, qiymat];
  return tartib.filter((x) => yangi.includes(x));
}
