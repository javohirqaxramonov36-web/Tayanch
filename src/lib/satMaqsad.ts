// SAT maqsad va imtihon sanasi (P12): sof tekshiruv va sarlavha holati.
// Ma'lumot public.profiles da: target_score, current_score, exam_date, sat_setup_at.
// Ekrandagi matn src/data/satMaqsadMatn.ts da (inglizcha); bu yerda faqat xato kodlari.
import { kunHolati, sanaTogri, yilQosh, type KunTuri } from './muddat.ts';
import type { SatSana } from '../data/satSanalar.ts';

/** SAT umumiy ball: 400–1600, qadam 10 (CB04). profiles check bilan bir xil. */
export const BALL = { min: 400, max: 1600, qadam: 10 } as const;
/** Imtihon sanasi bugundan ko'pi bilan shuncha yil keyin (Tayanch tanlovi). */
export const SANA_MAX_YIL = 2;

export type BallXato = 'bosh' | 'raqam' | 'oraliq' | 'qadam';
export type SanaXato = 'bosh' | 'format' | 'otgan' | 'uzoq';

/** Ball maydoni: bo'sh qiymat faqat majburiy bo'lsa xato. */
export function ballXatosi(qiymat: string, majburiy = false): BallXato | null {
  const q = qiymat.trim();
  if (!q) return majburiy ? 'bosh' : null;
  if (!/^\d+$/.test(q)) return 'raqam';
  const n = Number(q);
  if (n < BALL.min || n > BALL.max) return 'oraliq';
  if (n % BALL.qadam !== 0) return 'qadam';
  return null;
}

/** Imtihon sanasi: bo'sh bo'lishi mumkin (hali bilmayman), aks holda bugun yoki keyin, 2 yildan uzoq emas. */
export function sanaXatosi(qiymat: string, bugun: string, majburiy = false): SanaXato | null {
  if (!qiymat) return majburiy ? 'bosh' : null;
  if (!sanaTogri(qiymat)) return 'format';
  if (qiymat < bugun) return 'otgan';
  if (qiymat > yilQosh(bugun, SANA_MAX_YIL)) return 'uzoq';
  return null;
}

export type RoyxatHolati = 'ochiq' | 'kech' | 'yopiq';

/** Rasmiy sanalardan bugun va keyingilari, ro'yxat holati bilan (manba sanalari bo'yicha, Toshkent kuni). */
export function kelgusiSanalar(sanalar: readonly SatSana[], bugun: string) {
  return sanalar
    .filter((s) => s.sana >= bugun)
    .map((s) => ({
      ...s,
      royxatHolati: (bugun <= s.royxat ? 'ochiq' : bugun <= s.kechRoyxat ? 'kech' : 'yopiq') as RoyxatHolati,
    }));
}

export interface MaqsadProfil {
  target_score: number | null;
  current_score: number | null;
  exam_date: string | null;
  sat_setup_at: string | null;
}

export type SarlavhaHolati =
  | { tur: 'sozlanmagan' }
  | { tur: 'bor'; ball: number | null; sana: { tur: KunTuri; kun: number } | null };

/**
 * Sarlavha nimani ko'rsatadi. Hech narsa yo'q va sozlash o'tkazib yuborilmagan: taklif kartasi.
 * O'tkazib yuborilgan (sat_setup_at bor) lekin bo'sh: "bor" holati, ikkala qism ham null (qo'shish havolalari).
 */
export function sarlavhaHolati(p: MaqsadProfil, bugun: string): SarlavhaHolati {
  const sana = p.exam_date && sanaTogri(p.exam_date) ? kunHolati(bugun, p.exam_date) : null;
  if (p.target_score == null && !sana && !p.sat_setup_at) return { tur: 'sozlanmagan' };
  return { tur: 'bor', ball: p.target_score, sana };
}
