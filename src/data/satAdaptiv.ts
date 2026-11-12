// Mock imtihon uchun adaptive-style 2-modul sozlamalari (P31). Hujjat: docs/sat-adaptiv.md.
// Bu College Board'ning rasmiy algoritmi (IRT) emas: oddiy qoida, 1-modul aniqligiga qarab to'plam tanlanadi.
// "taklif" deb belgilangan qiymatlar muallif tasdig'ini kutadi.

export type SatBolim = 'rw' | 'math';

export interface AdaptivSozlama {
  /**
   * 1-modul aniqligi (foiz, 0–100). Aniqlik shu qiymatdan QAT'IY katta bo'lsa qiyin tarmoq, aks holda oson.
   * null: adaptivlik o'chiq, 2-modul standart (oddiy) tartibda. Qiymat muallif bilan kelishiladi, o'ylab topilmaydi.
   */
  chegara: number | null;
  /** Har tarmoq qaysi qiyinlik darajalaridan (questions.difficulty, 1–5) olinadi. Taklif. */
  tarmoqQiyinlik: { oson: readonly number[]; qiyin: readonly number[] };
  /**
   * Har tarmoqda kamida nechta tasdiqlangan savol bo'lsa adaptivlik yoqiladi.
   * Taklif: bitta modul hajmi (CB03: R&W 54 savol / 2 modul = 27, Math 44 / 2 = 22), shunda 2-modul takrorsiz to'ladi.
   */
  minSavolTarmoq: Record<SatBolim, number>;
  kalibrlash: {
    /** Savol qiyinligini yangilash uchun kamida nechta javob (N). Taklif, muallif tasdig'i kutilmoqda. */
    minJavob: number;
    /**
     * To'g'ri javob ulushi (foiz) pog'onalari: ≥ [0] → 1, ≥ [1] → 2, ≥ [2] → 3, ≥ [3] → 4, qolgani → 5. Taklif.
     * SQL dagi standart qiymat bilan bir xil bo'lishi shart (supabase/migrations/*_adaptiv_kalibr.sql, testda tekshiriladi).
     */
    pogonalar: readonly [number, number, number, number];
  };
}

export const adaptivSozlama: AdaptivSozlama = {
  chegara: null,
  tarmoqQiyinlik: { oson: [1, 2, 3], qiyin: [3, 4, 5] },
  minSavolTarmoq: { rw: 27, math: 22 },
  kalibrlash: {
    minJavob: 30,
    pogonalar: [80, 60, 40, 20],
  },
};
