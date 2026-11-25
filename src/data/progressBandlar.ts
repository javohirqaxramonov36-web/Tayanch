// Qavatlar bo'yicha progress bandlari (itemId) ro'yxati: src/lib/progress.ts bilan ishlatiladi.
// Sahifa o'z bandlarini registerItems(qavat, ro'yxat) bilan e'lon qiladi, shunda getFloorProgress jami sonni biladi.
// Yangi band qo'shilsa, shu yerga yoziladi.
import type { ProgressQavat } from '../lib/progress';

/** EYUF Suhbat mashqi: har 5 ta tugagan mashq = bitta band (suhbat-1 = 5 mashq, suhbat-10 = 50 mashq). */
export const SUHBAT_BAND_SONI = 10;
export const SUHBAT_QADAM = 5;
export const suhbatBandi = (n: number) => `suhbat-${n}`;

export const progressBandlar: Partial<Record<ProgressQavat, string[]>> = {
  eyuf: Array.from({ length: SUHBAT_BAND_SONI }, (_, i) => suhbatBandi(i + 1)),
};
