// Days-left and pace ("sur'at") calculation. All dates use the device's local calendar day,
// so the count changes at local midnight, not at UTC midnight.
import type { Surat } from '../../data/yolXaritasiQoidalar.ts';
import type { YolProfil } from './profil.ts';
import { sanaTogrimi } from './profil.ts';

const KUN = 86_400_000;

/** Local calendar date as YYYY-MM-DD. */
export function mahalliySana(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Whole days from today's local date to `sana` (YYYY-MM-DD). 0 = today, negative = past.
 * Uses Math.round so a 23h/25h DST day still counts as one day.
 */
export function qolganKun(sana: string, bugun: Date): number | null {
  if (!sanaTogrimi(sana)) return null;
  const [y, m, d] = sana.split('-').map(Number);
  const maqsad = new Date(y, m - 1, d).getTime();
  const bosh = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate()).getTime();
  return Math.round((maqsad - bosh) / KUN);
}

/** Pace thresholds (days). Kept here next to the logic; the table lives in yolXaritasiQoidalar.ts. */
export const INTENSIV_CHEGARA = 15;
export const OY_CHEGARA = 45;

export interface MuddatHolati {
  surat: Surat;
  /** only for an exact date; recomputed on every render */
  qolgan: number | null;
  /** exact date is already in the past */
  otgan: boolean;
}

export function muddatHolati(p: Pick<YolProfil, 'timeLeft' | 'examDate' | 'skipped'>, bugun: Date): MuddatHolati {
  if (p.skipped) return { surat: 'umumiy', qolgan: null, otgan: false };
  switch (p.timeLeft) {
    case '15d': return { surat: 'intensiv', qolgan: null, otgan: false };
    case '1m': return { surat: 'oy', qolgan: null, otgan: false };
    case '3m': return { surat: 'uzoq', qolgan: null, otgan: false };
    case 'date': {
      const k = p.examDate ? qolganKun(p.examDate, bugun) : null;
      if (k === null) return { surat: 'umumiy', qolgan: null, otgan: false };
      if (k < 0) return { surat: 'umumiy', qolgan: k, otgan: true };
      const surat: Surat = k <= INTENSIV_CHEGARA ? 'intensiv' : k <= OY_CHEGARA ? 'oy' : 'uzoq';
      return { surat, qolgan: k, otgan: false };
    }
    default: return { surat: 'umumiy', qolgan: null, otgan: false };
  }
}
