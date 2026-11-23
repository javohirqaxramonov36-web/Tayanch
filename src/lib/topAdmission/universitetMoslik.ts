// Top Admission: "Menga mos universitet" filtrining sof mantig'i (Admission D-seriya, Q4).
// Build paytida (sahifa) va brauzerda (sahifa skripti) bir xil ishlaydi; node --test bilan sinaladi.
// Qoida: taqqoslash FAQAT "tasdiqlangan" faktlardan (faktKorinadimi). Bu rasmiy talablar bo'yicha saralash,
// qabul natijasini bashorat qilmaydi; SAT bo'yicha moslashtirish yo'q (rasmiy minimal ball odatda e'lon qilinmaydi).
import { faktKorinadimi, usdga, type Fakt, type IeltsHolati, type Kurslar } from './fakt.ts';

/** Filtrdagi davlatlar (reja Q4: AQSH, Buyuk Britaniya, Janubiy Koreya). Kontent agentlari (Q6, Q9) shu slug'larni ishlatsin. */
export const MOS_DAVLATLAR: readonly { slug: string; nom: string }[] = [
  { slug: 'aqsh', nom: 'AQSH' },
  { slug: 'buyuk-britaniya', nom: 'Buyuk Britaniya' },
  { slug: 'janubiy-koreya', nom: 'Janubiy Koreya' },
];

/** IELTS tanlovi: 4.0 dan 9.0 gacha, 0.5 qadam. */
export const IELTS_BALLARI: readonly number[] = Array.from({ length: 11 }, (_, i) => 4 + i * 0.5);

/**
 * `xalqaro_yordam_turi` qiymati shu bo'lsa universitet xalqaro talabaga moliyaviy yordam BERMAYDI.
 * Kontent agenti (Q9): rasmiy sahifada yordam yo'qligi aniq yozilgan bo'lsa qiymatni aynan "yo'q" qilib yozadi.
 */
export const YORDAM_YOQ = "yo'q";

/**
 * "Kamida" xarajat hisoblanadigan davlatlar (E1, muallif qarori 2026-11-20): universitetda `kontrakt_eng_past` bo'lsa,
 * xarajat = rasmiy eng past xalqaro kontrakt + davlat kartasidagi viza yashash summasi (ikkalasi USD'ga).
 * Maydon yo'q bo'lsa (eski fayl) `yillik_xarajat` ishlatiladi. AQSH uchun har doim `yillik_xarajat` (rasmiy cost of attendance).
 */
export const KAMIDA_DAVLATLAR: readonly string[] = ['buyuk-britaniya', 'janubiy-koreya'];

/** To'liq ehtiyojga asoslangan yordam izohi (universitet va grant kartalarida; "to'liq qoplaydi" belgisi o'rniga). */
export const EHTIYOJ_IZOHI = "Yordam miqdori oila daromadi asosida hisoblanadi; oila hissasi talab qilinishi mumkin.";

/** Sahifa uchun kerakli qism (universitetSxema'dan). Havolalar slug qatoriga aylantirilgan. */
export interface UniKirish {
  slug: string;
  nom: string;
  davlat: string;
  min_ielts: Fakt;
  yillik_xarajat: Fakt;
  valyuta: string;
  xalqaro_yordam_turi: Fakt;
  // E1 ixtiyoriy maydonlari
  imtihonlar?: Fakt;
  kontrakt_eng_past?: Fakt;
  ielts_holati?: IeltsHolati;
  ielts_tavsiya?: Fakt;
  foundation_kerak?: Fakt;
  toliq_ehtiyoj?: boolean;
}

/** Davlat kartasidagi viza yashash summasi ("kamida" hisobi uchun). */
export interface DavlatYashash {
  viza_yashash_summasi: Fakt;
  valyuta: string;
}

/** Taqqoslash uchun: faqat tasdiqlangan qiymatlar, qolgani null. */
export interface UniXulosa {
  slug: string;
  nom: string;
  davlat: string;
  /** Tasdiqlangan min IELTS (faqat ielts_holati "minimum" bo'lsa) */
  ielts: number | null;
  /** Tasdiqlangan yillik xarajat USD'da (butun songa yaxlitlangan); kurs yo'q bo'lsa null. "Kamida" bo'lsa yig'indi. */
  xarajatUsd: number | null;
  /** true: yordam beradi, false: rasmiy "yo'q", null: tasdiqlanmagan */
  yordam: boolean | null;
  /**
   * Faqat rasmiy minimum yo'qligi tasdiqlangan bo'lsa (ielts_holati "tavsiya" yoki "talab_qilinmaydi" va dalil fakti
   * tasdiqlangan): IELTS saralashga ta'sir qilmaydi. Boshqa hollarda maydon yo'q.
   */
  ieltsYoq?: true;
  /** Faqat "kamida" hisobida: tarkib (USD, yaxlitlangan). */
  kamida?: { kontraktUsd: number; yashashUsd: number };
}

const tasdiqlanganSon = (f: Fakt | undefined): number | null =>
  f && faktKorinadimi(f) && typeof f.qiymat === 'number' && Number.isFinite(f.qiymat) ? f.qiymat : null;

/** "Kamida" hisobi ishlatiladimi (davlat KAMIDA_DAVLATLAR da va `kontrakt_eng_past` maydoni bor). */
export const kamidami = (u: Pick<UniKirish, 'davlat' | 'kontrakt_eng_past'>): boolean =>
  KAMIDA_DAVLATLAR.includes(u.davlat) && u.kontrakt_eng_past !== undefined;

/** IELTS holati (maydon yo'q bo'lsa "minimum"). */
export const ieltsHolati = (u: Pick<UniKirish, 'ielts_holati'>): IeltsHolati => u.ielts_holati ?? 'minimum';

/**
 * Rasmiy minimum yo'qligi tasdiqlanganmi: "tavsiya" bo'lsa ielts_tavsiya fakti, "talab_qilinmaydi" bo'lsa
 * imtihonlar fakti (rasmiy matnda IELTS talab qilinmasligi yozilgan) tasdiqlangan bo'lishi kerak.
 */
export function ieltsYoqmi(u: Pick<UniKirish, 'ielts_holati' | 'ielts_tavsiya' | 'imtihonlar'>): boolean {
  const h = ieltsHolati(u);
  if (h === 'tavsiya') return tasdiqlanganSon(u.ielts_tavsiya) !== null;
  if (h === 'talab_qilinmaydi') return faktKorinadimi(u.imtihonlar);
  return false;
}

/** "Foundation yili kerak" belgisi: fakt tasdiqlangan va qiymati aynan "ha". */
export const foundationKerakmi = (u: Pick<UniKirish, 'foundation_kerak'>): boolean =>
  faktKorinadimi(u.foundation_kerak) && u.foundation_kerak!.qiymat === 'ha';

/** Ehtiyoj izohi: belgi bor va yordam turi fakti tasdiqlangan (izoh tasdiqlanmagan yordamni "ochib" qo'ymasin). */
export const ehtiyojIzohiKerakmi = (u: Pick<UniKirish, 'toliq_ehtiyoj' | 'xalqaro_yordam_turi'>): boolean =>
  u.toliq_ehtiyoj === true && faktKorinadimi(u.xalqaro_yordam_turi);

export function uniXulosasi(u: UniKirish, kurslar: Kurslar | null | undefined, yashash?: DavlatYashash | null): UniXulosa {
  let usd: number | null = null;
  let kamida: UniXulosa['kamida'];
  if (kamidami(u)) {
    const k = tasdiqlanganSon(u.kontrakt_eng_past);
    const v = yashash ? tasdiqlanganSon(yashash.viza_yashash_summasi) : null;
    const kUsd = k === null ? null : usdga(k, u.valyuta, kurslar);
    const vUsd = v === null || !yashash ? null : usdga(v, yashash.valyuta, kurslar);
    if (kUsd !== null && vUsd !== null) {
      // Yig'indi yaxlitlangan qismlardan: kartadagi tarkib va jami bir-biriga mos bo'lsin.
      kamida = { kontraktUsd: Math.round(kUsd), yashashUsd: Math.round(vUsd) };
      usd = kamida.kontraktUsd + kamida.yashashUsd;
    }
  } else {
    const xarajat = tasdiqlanganSon(u.yillik_xarajat);
    usd = xarajat === null ? null : usdga(xarajat, u.valyuta, kurslar);
  }
  const y = u.xalqaro_yordam_turi;
  let yordam: boolean | null = null;
  if (faktKorinadimi(y) && typeof y.qiymat === 'string' && y.qiymat.trim() !== '') {
    yordam = y.qiymat.trim().toLowerCase() !== YORDAM_YOQ;
  }
  const holat = ieltsHolati(u);
  const x: UniXulosa = {
    slug: u.slug, nom: u.nom, davlat: u.davlat,
    ielts: holat === 'minimum' ? tasdiqlanganSon(u.min_ielts) : null,
    xarajatUsd: usd === null ? null : Math.round(usd),
    yordam,
  };
  if (ieltsYoqmi(u)) x.ieltsYoq = true;
  if (kamida) x.kamida = kamida;
  return x;
}

// ---------- Filtr holati ----------
// URL query'da faqat davlat va belgilar: ?d=aqsh,janubiy-koreya &yordam=1 &mos=1.
// IELTS bali va byudjet URL'ga ham, brauzerga ham yozilmaydi (shaxsiy ma'lumot): faqat sahifa ochiq turganda.

export interface MoslikHolati {
  davlatlar: string[];
  /** O'quvchining IELTS bali; null = kiritilmagan */
  ielts: number | null;
  /** Yillik byudjet, USD; null = kiritilmagan */
  byudjet: number | null;
  /** "Faqat xalqaro talabaga moliyaviy yordam beradiganlar" */
  yordam: boolean;
  /** "Faqat talabga mos keladiganlar" */
  faqatMos: boolean;
}

export const BOSH_HOLAT: MoslikHolati = Object.freeze({ davlatlar: [], ielts: null, byudjet: null, yordam: false, faqatMos: false }) as MoslikHolati;

export type Guruh = 'mos' | 'yetmaydi' | 'tekshirilmoqda' | 'yashirin';

export interface Moslik {
  guruh: Guruh;
  /** IELTS talabi bajarilmaydimi (faqat bal kiritilgan va talab tasdiqlangan bo'lsa) */
  ieltsPast: boolean;
  /** Yillik xarajat byudjetdan qimmatmi (faqat byudjet kiritilgan va xarajat USD'da ma'lum bo'lsa) */
  qimmat: boolean;
}

/**
 * Bitta universitetning holati:
 * - davlat filtri yoki "yordam" belgisi bo'yicha rasmiy "yo'q" → "yashirin";
 * - kerakli fakt tasdiqlanmagan (min IELTS yoki rasmiy minimum yo'qligi, yillik/"kamida" xarajat USD'da; "yordam" belgisi yoqilgan bo'lsa yordam turi ham)
 *   → "tekshirilmoqda", moslik hisoblanmaydi;
 * - IELTS bali talabdan past yoki xarajat byudjetdan qimmat → "yetmaydi" ("faqat mos" belgisi bilan "yashirin");
 * - aks holda "mos".
 */
export function moslik(x: UniXulosa, h: MoslikHolati): Moslik {
  const yoq: Moslik = { guruh: 'yashirin', ieltsPast: false, qimmat: false };
  if (h.davlatlar.length && !h.davlatlar.includes(x.davlat)) return yoq;
  if (h.yordam && x.yordam === false) return yoq;
  if ((x.ielts === null && !x.ieltsYoq) || x.xarajatUsd === null || (h.yordam && x.yordam === null)) {
    return { guruh: 'tekshirilmoqda', ieltsPast: false, qimmat: false };
  }
  // Rasmiy minimum yo'q ("tavsiya", "talab qilinmaydi"): IELTS bali saralashga ta'sir qilmaydi.
  const ieltsPast = h.ielts !== null && x.ielts !== null && h.ielts < x.ielts;
  const qimmat = h.byudjet !== null && x.xarajatUsd > h.byudjet;
  if (!ieltsPast && !qimmat) return { guruh: 'mos', ieltsPast, qimmat };
  return { guruh: h.faqatMos ? 'yashirin' : 'yetmaydi', ieltsPast, qimmat };
}

const nomTartib = (a: { nom: string }, b: { nom: string }) => a.nom.localeCompare(b.nom, 'uz');
/** Tartib: alifbo (reyting yo'q). Asl massiv o'zgarmaydi. */
export const alifbo = <T extends { nom: string }>(xlar: readonly T[]): T[] => [...xlar].sort(nomTartib);

/** IELTS tanlovini o'qish: faqat IELTS_BALLARI dagi qiymat, aks holda null. */
export function ieltsniOqi(v: string | null | undefined): number | null {
  if (v === null || v === undefined || v.trim() === '') return null;
  const n = Number(v);
  return IELTS_BALLARI.includes(n) ? n : null;
}

/** Byudjet maydonini o'qish: bo'shliq va vergul tashlanadi; manfiy, son bo'lmagan yoki bo'sh → null. */
export function byudjetniOqi(v: string | null | undefined): number | null {
  const s = (v ?? '').replace(/[\s,]/g, '');
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
}

const royxat = (v: string | null) => (v ?? '').split(',').map((s) => s.trim()).filter(Boolean);

/** Query'ni o'qish (davlat va belgilar). Noma'lum davlat tashlab yuboriladi; IELTS va byudjet o'qilmaydi. */
export function holatniOqi(search: string): MoslikHolati {
  const p = new URLSearchParams(search);
  const d = royxat(p.get('d'));
  return {
    ...BOSH_HOLAT,
    davlatlar: MOS_DAVLATLAR.map((x) => x.slug).filter((s) => d.includes(s)),
    yordam: p.get('yordam') === '1',
    faqatMos: p.get('mos') === '1',
  };
}

/** Holatni query qatoriga yozish ('' yoki '?...'). IELTS va byudjet yozilmaydi. Boshqa parametrlar saqlanadi. */
export function holatniYoz(h: MoslikHolati, mavjud = ''): string {
  const p = new URLSearchParams(mavjud);
  const qoy = (k: string, v: string) => (v ? p.set(k, v) : p.delete(k));
  qoy('d', MOS_DAVLATLAR.map((x) => x.slug).filter((s) => h.davlatlar.includes(s)).join(','));
  qoy('yordam', h.yordam ? '1' : '');
  qoy('mos', h.faqatMos ? '1' : '');
  const q = p.toString().replace(/%2C/g, ',');
  return q ? `?${q}` : '';
}

/** Son ekranda: minglik bo'shliq bilan (faktQiymatMatni bilan bir xil). */
export const sonMatni = (n: number): string => {
  const [butun, kasr] = String(n).split('.');
  const g = butun.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return kasr ? `${g}.${kasr}` : g;
};
/** IELTS bali har doim bitta kasr bilan: 6 → "6.0". */
export const ieltsMatni = (n: number): string => n.toFixed(1);

// ---------- Shortlist (saqlangan universitetlar) ----------
// localStorage kaliti `tayanch:admission-shortlist`: [{ id: slug }], yangisi birinchi, SHORTLIST_MAKS tagacha.
// Hisob bilan kirilgan va sinxron yoqilgan bo'lsa holat.ts orqali user_state ga ham yoziladi (docs/sinxron-qoidalari.md).

export const SHORTLIST_KALIT = 'tayanch:admission-shortlist';
export const SHORTLIST_MAKS = 200;
export interface ShortlistYozuv { id: string }

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Saqlangan qiymatni tekshiradi: noto'g'ri element tashlanadi, dublikat yo'q, tartib saqlanadi. */
export function shortlistTozala(x: unknown): ShortlistYozuv[] {
  if (!Array.isArray(x)) return [];
  const kor = new Set<string>();
  const r: ShortlistYozuv[] = [];
  for (const e of x) {
    const id = e && typeof e === 'object' && typeof (e as { id?: unknown }).id === 'string' ? (e as { id: string }).id : null;
    if (!id || !SLUG.test(id) || kor.has(id)) continue;
    kor.add(id);
    r.push({ id });
    if (r.length >= SHORTLIST_MAKS) break;
  }
  return r;
}

/** Universitetni qo'shish (boshiga) yoki olib tashlash. */
export function shortlistAlmashtir(r: readonly ShortlistYozuv[], slug: string): ShortlistYozuv[] {
  if (r.some((y) => y.id === slug)) return r.filter((y) => y.id !== slug);
  return [{ id: slug }, ...r].slice(0, SHORTLIST_MAKS);
}
