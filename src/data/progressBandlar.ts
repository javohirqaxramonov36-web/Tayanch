// Bino chiroqlari uchun har qavat vazifalari ro'yxati (itemId'lar). Progress moduli (src/lib/progress.ts) jami (total)ni
// faqat sahifalar registerItems bilan e'lon qilgan bandlardan biladi; bosh sahifa shu ro'yxatni e'lon qiladi.
// Yangi vazifa turi qo'shilsa, shu yerga qo'shiladi. Top Admission "chamadon-<yo'nalish id>",
// EYUF "suhbat-<N>" (har 5 ta tugagan Suhbat mashqi = bitta band, /uz/eyuf/suhbat-mashqi/).
import type { ProgressQavat } from '../lib/progress';
import { YOLLAR } from './topshirishYoli';
import { suhbatBandlari } from './eyuf/suhbatMashqi';

export const QAVAT_BANDLARI: Record<ProgressQavat, string[]> = {
  navigator: [],
  'top-admission': Object.keys(YOLLAR).map((id) => `chamadon-${id}`),
  sat: [],
  ielts: [],
  eyuf: suhbatBandlari,
};
