// SAT Math interaktiv darslari: umumiy turlar.
// Savollar Tayanch uchun yozilgan, College Board savollaridan ko'chirilmagan.
// verified: muallif tekshirib bo'lgach true qo'yadi. false bo'lsa saytda "tekshirilmagan" yorlig'i chiqadi.
// Har savol javobi scripts/savollarni-tekshir.ts da ikkinchi usul bilan qayta hisoblanadi.

export type DarsModul = 'hajm' | 'grafik' | 'aylana' | 'statistika';
export type Qiyinlik = 'oson' | "o'rta" | 'qiyin';

export interface Variant {
  matn: string;
  /** Faqat noto'g'ri variantda: bu javobga olib keladigan tipik xato nomi */
  xato?: string;
}

export interface DarsSavol {
  id: string;
  modul: DarsModul;
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

export const KALIT_PROGRESS = 'tayanch:sat-dars-progress';
export const KALIT_XATO_DAFTARI = 'tayanch:sat-xato-daftari';
export const KALIT_REJA = 'tayanch:sat-reja';

export const modulNomi: Record<DarsModul, string> = {
  hajm: 'Hajm laboratoriyasi',
  grafik: 'Funksiya grafigi',
  aylana: 'Birlik aylana',
  statistika: 'Statistika',
};
