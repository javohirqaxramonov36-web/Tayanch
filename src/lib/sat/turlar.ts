// SAT savol turlari. Ma'lumot: src/data/sat/savollar.ts
import type { Fan } from '../../data/sat/format';

export type Qiyinlik = 'oson' | 'orta' | 'qiyin';
export type Harf = 'A' | 'B' | 'C' | 'D';

export interface Savol {
  id: string;
  fan: Fan;
  domen: string;
  konikma: string;
  qiyinlik: Qiyinlik;
  turi: 'tanlov' | 'yozma';
  matn: string;
  variantlar?: { harf: Harf; matn: string }[];
  togri: Harf | string[];
  tushuntirish_uz: string;
  variant_izohi_uz?: Record<Harf, string>;
  holat: 'qoralama' | 'tekshirilgan';
  manba: 'original';
  muallif: string;
}

/** Brauzerga boradigan shakl: matnlar KaTeX bilan HTML'ga aylantirilgan. */
export interface TayyorSavol {
  id: string;
  fan: Fan;
  domen: string;
  konikma: string;
  qiyinlik: Qiyinlik;
  turi: 'tanlov' | 'yozma';
  matn: string;
  variantlar: { harf: Harf; matn: string }[];
  togri: string | string[];
  tushuntirish: string;
  izoh: Partial<Record<Harf, string>>;
}

export const qiyinlikNomi: Record<Qiyinlik, string> = { oson: 'Oson', orta: "O'rta", qiyin: 'Qiyin' };
export const HARFLAR: Harf[] = ['A', 'B', 'C', 'D'];
