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
  /** Ixtiyoriy: javobni matndan belgilash (R&W). Bo'lmasa oddiy A–D variantlar. */
  belgilash?: SozBelgilash | GapBelgilash;
}

/**
 * "Xatoni toping": avval gapdagi xato bo'lak (so'z yoki tinish belgisi) belgilanadi, keyin variantlardan tuzatish tanlanadi.
 * bolaklar tinish belgisi oldidan bo'shliqsiz qo'shilganda `matn` ga teng bo'ladi.
 */
export interface SozBelgilash {
  tur: 'soz';
  bolaklar: string[];
  /** Xato bo'lak indeksi */
  togriBolak: number;
}

/** "Dalilni belgilang": variantlar matndagi gaplar; ular bitta parcha bo'lib ko'rsatiladi va gap bosib tanlanadi. */
export interface GapBelgilash {
  tur: 'gap';
  /** Parcha ustidagi qisqa ko'rsatma, masalan "Matn" */
  sarlavha?: string;
}

/** localStorage kalitlari: tayanch:<bolim>-dars-progress va tayanch:<bolim>-xato-daftari */
export const darsKalitlari = (bolim: DarsBolim) => ({
  progress: `tayanch:${bolim}-dars-progress`,
  xatoDaftari: `tayanch:${bolim}-xato-daftari`,
});
