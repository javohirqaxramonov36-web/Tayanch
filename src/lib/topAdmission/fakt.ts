// Top Admission ma'lumot faktlari (Admission D-seriya, Q1): tur, ko'rinish va eskirish qoidalari.
// Sof funksiyalar, zod'siz: sahifa, komponent, node skriptlari va node --test hammasi shuni ishlatadi.
// Sxema (build paytidagi tekshiruv) alohida: ./sxema.ts.
import { kunFarqi, toshkentBugun } from '../muddat.ts';

export type FaktTuri = 'muddatli' | 'barqaror';
/**
 * "muallif" (Admission F, 2026-11-21): Codex tadqiqot to'plamidan ko'chirilgan va muallif tekshirgan deb tasdiqlagan fakt.
 * Qiymat, source_url va tekshirilgan_sana majburiy; rasmiy sahifadagi aynan ibora (manba_iborasi) shart emas.
 * Saytda "tasdiqlangan" kabi ko'rinadi.
 */
export type FaktHolati = 'qoralama' | 'tasdiqlangan' | 'muallif' | 'topilmadi';
export type FaktQiymat = string | number | boolean;

/** Bitta qattiq fakt. "qoralama", "tasdiqlangan" va "muallif" da manba maydonlari majburiy (sxema tekshiradi). */
export interface Fakt<Q extends FaktQiymat = FaktQiymat> {
  qiymat?: Q | null;
  source_url?: string;
  manba_iborasi?: string;
  tekshirilgan_sana?: string; // YYYY-MM-DD
  turi: FaktTuri;
  holat: FaktHolati;
}

/**
 * Eskirish muddati, kun. Yagona joy: ikkala skript (malumot:tekshir, malumot:tasdiq) va UI shundan oladi.
 * "barqaror" uchun 180 kun muallif tomonidan hali tasdiqlanmagan (docs/rejalar/admission-holat.md, "Sozlamalar").
 */
export const ESKIRISH_KUNLARI: Readonly<Record<FaktTuri, number>> = Object.freeze({
  muddatli: 60,
  barqaror: 180,
});

export const FAKT_HOLATLARI: readonly FaktHolati[] = ['qoralama', 'tasdiqlangan', 'muallif', 'topilmadi'];
export const FAKT_TURLARI: readonly FaktTuri[] = ['muddatli', 'barqaror'];

/** Universitetning IELTS talabi turi (E1, muallif qarori 2026-11-20). */
export type IeltsHolati = 'minimum' | 'tavsiya' | 'talab_qilinmaydi' | 'topilmadi';
export const IELTS_HOLATLARI: readonly IeltsHolati[] = ['minimum', 'tavsiya', 'talab_qilinmaydi', 'topilmadi'];

/** Saytda faqat "tasdiqlangan" va "muallif" fakt ko'rinadi. Qolgani o'rniga "Ma'lumot tekshirilmoqda". */
export function faktKorinadimi(fakt: Fakt | null | undefined): boolean {
  return !!fakt && (fakt.holat === 'tasdiqlangan' || fakt.holat === 'muallif');
}

/** Tekshirilgan sanadan beri o'tgan kun (bugun Toshkent bo'yicha). Sana yo'q bo'lsa null. */
export function faktYoshi(fakt: Fakt | null | undefined, bugun: string = toshkentBugun()): number | null {
  if (!fakt?.tekshirilgan_sana) return null;
  return kunFarqi(fakt.tekshirilgan_sana, bugun);
}

/**
 * Fakt eskirganmi: tekshirilgan sanadan beri o'tgan kun turining muddatidan KATTA bo'lsa true
 * (muddatli: 61-kundan, barqaror: 181-kundan). Sanasi yo'q fakt (masalan "topilmadi") eskirmaydi.
 */
export function faktEskirganmi(fakt: Fakt | null | undefined, bugun: string = toshkentBugun()): boolean {
  const yosh = faktYoshi(fakt, bugun);
  if (yosh === null || !fakt) return false;
  return yosh > ESKIRISH_KUNLARI[fakt.turi];
}

const ENUM_MATN: Record<string, string> = {
  ha: 'Ha',
  "yo'q": "Yo'q",
  dasturga_qarab: 'Dasturga qarab',
};

/** Qiymatni ekranga chiqarish: ha/yo'q, minglik bo'shliq bilan son, diplom enum'i. */
export function faktQiymatMatni(qiymat: FaktQiymat | null | undefined): string {
  if (qiymat === null || qiymat === undefined) return '';
  if (typeof qiymat === 'boolean') return qiymat ? 'Ha' : "Yo'q";
  if (typeof qiymat === 'number') {
    const [butun, kasr] = String(qiymat).split('.');
    const guruh = butun.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return kasr ? `${guruh}.${kasr}` : guruh;
  }
  return ENUM_MATN[qiymat] ?? qiymat;
}

/** YYYY-MM-DD → DD.MM.YYYY (ekran uchun). Noto'g'ri qator o'zgarishsiz qaytadi. */
export function sanaMatni(sana: string | undefined): string {
  if (!sana || !/^\d{4}-\d{2}-\d{2}$/.test(sana)) return sana ?? '';
  const [y, m, d] = sana.split('-');
  return `${d}.${m}.${y}`;
}

// ---------- Valyuta kurslari (src/data/topAdmission/kurslar.json, Q6 da to'ldiriladi) ----------

/** kurslar: valyuta kodi → 1 birlik necha USD (masalan "GBP": 1.27). USD o'zi 1. */
export interface Kurslar {
  manba_url: string;
  manba_nomi?: string;
  sana: string;
  kurslar: Record<string, number>;
}

/** Kurs fayli ishlatsa bo'ladimi: manba, sana va kamida bitta kurs bor. Bo'lmasa narx bo'yicha saralash o'chadi. */
export function kurslarBormi(k: Kurslar | null | undefined): k is Kurslar {
  return !!k && /^https:\/\//.test(k.manba_url) && !!k.sana && Object.keys(k.kurslar).length > 0;
}

/** Summani USD ga o'giradi. Kurs yo'q bo'lsa null ("kurs ma'lumoti yo'q"). */
export function usdga(summa: number, valyuta: string, k: Kurslar | null | undefined): number | null {
  if (valyuta === 'USD') return summa;
  if (!kurslarBormi(k)) return null;
  const n = k.kurslar[valyuta];
  return typeof n === 'number' && n > 0 ? summa * n : null;
}
