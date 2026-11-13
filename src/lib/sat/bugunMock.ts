// "Today" bloki uchun dev mock (faqat import.meta.env.DEV, dist'da yo'q): /uz/sat/?bugun-mock=yangi|toliq|mock|takror|xato
// Raqamlar sinov uchun, ekranga saytda chiqmaydi.
import type { BugunKirish } from './bugun';

export const BUGUN_MOCKLAR = ['yangi', 'toliq', 'mock', 'takror', 'xato'] as const;
export type BugunMock = (typeof BUGUN_MOCKLAR)[number];

export function bugunMock(tur: BugunMock): BugunKirish | 'xato' {
  const bosh: BugunKirish = { mockFaol: null, xatoDue: 0, sozDue: 0, rejaBor: false, tahlil: { urinish: 0, togri: 0, streak: 0, zaif: [] }, oxirgiBall: null };
  if (tur === 'xato') return 'xato';
  if (tur === 'yangi') return bosh;
  const tahlil = { urinish: 64, togri: 41, streak: 4, zaif: [{ skill: 'Inferences', foiz: 38 }, { skill: 'Nonlinear functions', foiz: 45 }, { skill: 'Boundaries', foiz: 52 }] };
  if (tur === 'mock') return { ...bosh, tahlil, xatoDue: 3, sozDue: 8, mockFaol: { form_no: 1, current_module: 2, phase: 'module' }, oxirgiBall: null };
  if (tur === 'takror') return { ...bosh, tahlil, xatoDue: 3, sozDue: 8, oxirgiBall: { total: 1180, sana: '2026-11-10' } };
  return { ...bosh, tahlil, xatoDue: 0, sozDue: 0, oxirgiBall: { total: 1180, sana: '2026-11-10' } };
}
