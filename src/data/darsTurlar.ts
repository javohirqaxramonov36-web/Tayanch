// Interaktiv darslar: barcha bo'limlar uchun umumiy turlar (standart: docs/interaktiv-dars-standarti.md).
// Har bo'lim o'z modul nomlarini src/data/<bolim>Darslar/turlar.ts da beradi.
// verified: muallif tekshirib bo'lgach true qo'yadi. Claude hech qachon true qo'ymaydi.
import type { BolimSlug } from './bolimlar';

export type DarsBolim = BolimSlug;
export type Qiyinlik = 'oson' | "o'rta" | 'qiyin';

export interface Variant {
  matn: string;
  /** Faqat noto'g'ri variantda: bu javobga olib keladigan tipik xato nomi */
  xato?: string;
}

export interface DarsSavol<M extends string = string> {
  id: string;
  modul: M;
  mavzu: string;
  qiyinlik: Qiyinlik;
  matn: string;
  variantlar: Variant[];
  /** variantlar indeksi */
  togri: number;
  /** Qisqa yechim */
  yechim: string;
  verified: boolean;
}

/** localStorage kalitlari: tayanch:<bolim>-dars-progress va tayanch:<bolim>-xato-daftari */
export const darsKalitlari = (bolim: DarsBolim) => ({
  progress: `tayanch:${bolim}-dars-progress`,
  xatoDaftari: `tayanch:${bolim}-xato-daftari`,
});
