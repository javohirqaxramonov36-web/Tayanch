// SAT tariflari sahifasi (/uz/sat/hisob/obuna/) va to'lov natijasi sahifasi sozlamasi.
// Narx va muddat bu yerda YO'Q: ular faqat bazada (plans.price_uzs, plans.period_days; P19 da muallif beradi).
// Narxi yo'q yoki faol emas tarif ekranda "Not available yet" bo'ladi, to'lov tugmasi chiqmaydi.
// Matn inglizcha (SAT bo'limi qoidasi); kod nomlari o'zbekcha.

export type TarifKod = 'free' | 'pro' | 'elite';
export type DavrKod = 'oylik' | '3oylik';
export type TolovUsuli = 'click' | 'payme' | 'uzcard-humo';

export const satTarif = {
  tariflar: [
    { kod: 'free', nomi: 'Free' },
    { kod: 'pro', nomi: 'Pro' },
    { kod: 'elite', nomi: 'Elite' },
  ] as { kod: TarifKod; nomi: string }[],
  /** Belgi qo'yiladigan tarif. Yorliq "Recommended": "most popular" foydalanuvchi soniga oid da'vo, raqam yo'q. */
  tavsiya: 'pro' as TarifKod,
  tavsiyaYorliq: 'Recommended',
  davrlar: [
    { kod: 'oylik', nomi: 'Monthly' },
    { kod: '3oylik', nomi: '3 months' },
  ] as { kod: DavrKod; nomi: string }[],
  /** Serverda (tolov-yaratish, DAVRLAR) qabul qilinadigan davrlar. 3 oylik narx P19 da beriladi. */
  faolDavrlar: ['oylik'] as DavrKod[],
  /** inPAY kassasida yoqilgan usullar (muallif javobi, 2026-11-11). Bo'sh bo'lsa usullar nomi aytilmaydi. */
  tolovUsullari: ['click', 'payme', 'uzcard-humo'] as TolovUsuli[],
  /** To'lov tasdiqlanmasa aloqa yo'li. Hozircha yo'q (muallif, 2026-11-11). null: faqat to'lov raqamini saqlash so'raladi. */
  aloqa: null as null | { matn: string; havola: string },
  /** Natija sahifasi: inpay-holat har necha soniyada va jami necha soniya so'raladi. */
  sorovOraligiS: 3,
  kutishS: 60,
} as const;

export const usulNomi: Record<TolovUsuli, string> = {
  click: 'Click',
  payme: 'Payme',
  'uzcard-humo': 'UzCard/HUMO',
};

/** Kvota kalitlari (0008_rpc.sql) -> ekrandagi nom. */
export const kvotaNomi: Record<string, string> = {
  sessions: 'Practice sessions',
  questions: 'Questions',
  answers: 'Answers',
  daily: 'Daily question',
  review_sessions: 'Review sessions',
};

/** Brauzerda faqat oxirgi to'lov raqami (qaytish sahifasi uchun). Karta ma'lumoti hech qayerda saqlanmaydi. */
export const TOLOV_KALITI = 'tayanch:sat-tolov';
