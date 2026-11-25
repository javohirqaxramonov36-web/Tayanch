// IELTS ball kalkulyatori: sof mantiq (DOM yo'q). Manba IE04 (ielts.org).
import { BAND_JADVALI, GT_READING_JADVALI, LISTENING_JADVALI, type BandQator } from '../../../data/ielts/bandJadvali.ts';
import { bandQatori } from '../reading/band.ts';

export type TestTuri = 'listening' | 'academic' | 'general';

export const JADVALLAR: Record<TestTuri, BandQator[]> = {
  listening: LISTENING_JADVALI,
  academic: BAND_JADVALI,
  general: GT_READING_JADVALI,
};

export interface XomNatija {
  /** null = 2.0 dan past */
  band: number | null;
  /** raw shu bandning ielts.org'dagi namunaviy nuqtasiga teng */
  rasmiy: boolean;
  dan: number;
  gacha: number;
}

/** Kiritilgan matn → 0..40 butun son, yoki xato matni. */
export function xomTekshir(matn: string): { son: number } | { xato: string } {
  const t = matn.trim();
  if (t === '') return { xato: '0 dan 40 gacha son kiriting.' };
  if (!/^-?\d+$/.test(t)) return { xato: 'Faqat butun son kiriting (masalan, 27).' };
  const son = Number(t);
  if (son < 0 || son > 40) return { xato: "Son 0 dan 40 gacha boʻlishi kerak." };
  return { son };
}

export function xomBand(raw: number, tur: TestTuri): XomNatija {
  const q = bandQatori(raw, JADVALLAR[tur]);
  return { band: q.band, rasmiy: Boolean(q.rasmiyNuqta) && raw === q.dan, dan: q.dan, gacha: q.gacha };
}

export type Yaxlitlash = 'pastga' | 'yarimga' | 'butunga';

/**
 * Umumiy band: to'rt ko'nikma o'rtachasi eng yaqin yarim bandga.
 * IE04: .25 bilan tugasa keyingi yarim bandga, .75 bilan tugasa keyingi butun bandga ko'tariladi.
 */
export function umumiyBand(ballar: number[]): { ortacha: number; band: number; qoida: Yaxlitlash } {
  if (ballar.length !== 4) throw new Error('4 ta ball kerak');
  const ortacha = ballar.reduce((a, b) => a + b, 0) / 4;
  const butun = Math.floor(ortacha);
  const qoldiq = ortacha - butun;
  if (qoldiq < 0.25) return { ortacha, band: butun, qoida: 'pastga' };
  if (qoldiq < 0.75) return { ortacha, band: butun + 0.5, qoida: 'yarimga' };
  return { ortacha, band: butun + 1, qoida: 'butunga' };
}

/** 6.25 → "6.25", 6.5 → "6.5", 7 → "7.0", 3.875 → "3.875" */
export function sonMatn(n: number): string {
  return Number.isInteger(n) ? n.toFixed(1) : String(n);
}
