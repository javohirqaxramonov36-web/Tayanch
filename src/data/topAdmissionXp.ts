// Top Admission XP (Admission D-seriya, Q5). Qiymat va ro'yxat supabase/migrations/20261120120000_admission_xp.sql
// dagi private.xp_rule('admission_step') va public.admission_step_done ruxsat ro'yxati bilan BIR XIL bo'lishi shart:
// server hisoblaydi, bu yerda faqat ko'rsatiladi. Qoida hujjati: docs/xp-qoidasi.md ("Top Admission").
/** Bitta zinapoyani birinchi marta to'g'ri terish uchun XP (zinapoyaga umrida bir marta). */
export const ADMISSION_ZINAPOYA_XP = 10;

/** Server qabul qiladigan qadamlar (`zinapoya:<id>`, id: src/data/topAdmissionDarslar/zinapoyalar.ts). */
export const ADMISSION_XP_QADAMLAR = ['zinapoya:turkiye', 'zinapoya:commonapp', 'zinapoya:ucas'] as const;
export type AdmissionXpQadam = (typeof ADMISSION_XP_QADAMLAR)[number];
