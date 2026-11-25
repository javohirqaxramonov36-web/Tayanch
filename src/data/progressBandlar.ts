// Bino chiroqlari uchun har qavat vazifalari ro'yxati (itemId'lar). Progress moduli (src/lib/progress.ts) jami (total)ni
// faqat sahifalar registerItems bilan e'lon qilgan bandlardan biladi; bosh sahifa shu ro'yxatni e'lon qiladi.
// Yangi vazifa turi qo'shilsa, shu yerga qo'shiladi. Top Admission "chamadon-<yo'nalish id>",
// IELTS "tfng-<setId>" (True / False / Not Given swipe mashqi, /uz/ielts/mashq/tfng/).
import type { ProgressQavat } from '../lib/progress';
import { YOLLAR } from './topshirishYoli';
import { tfngToplamlar, tfngBandId } from './ielts/tfngToplamlar';

export const QAVAT_BANDLARI: Record<ProgressQavat, string[]> = {
  navigator: [],
  'top-admission': Object.keys(YOLLAR).map((id) => `chamadon-${id}`),
  sat: [],
  ielts: tfngToplamlar.map((t) => tfngBandId(t.setId)),
  eyuf: [],
};
