// Bino chiroqlari uchun har qavat vazifalari ro'yxati (itemId'lar). Progress moduli (src/lib/progress.ts) jami (total)ni
// faqat sahifalar registerItems bilan e'lon qilgan bandlardan biladi; bosh sahifa shu ro'yxatni e'lon qiladi.
// Yangi vazifa turi qo'shilsa, shu yerga qo'shiladi: Top Admission "chamadon-<yo'nalish id>", IELTS Writing taymeri.
import type { ProgressQavat } from '../lib/progress';
import { YOLLAR } from './topshirishYoli';

export const QAVAT_BANDLARI: Record<ProgressQavat, string[]> = {
  navigator: [],
  'top-admission': Object.keys(YOLLAR).map((id) => `chamadon-${id}`),
  sat: [],
  ielts: [
    'writing-task1', // Writing taymeri: Task 1 minimal so'zga vaqt ichida yetildi
    'writing-task2', // Writing taymeri: Task 2 minimal so'zga vaqt ichida yetildi
  ],
  eyuf: [],
};
