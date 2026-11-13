// SAT tariflari sahifasi (/uz/sat/hisob/obuna/) va to'lov natijasi sahifasi sozlamasi.
// Narx va muddat bu yerda YO'Q: ular faqat bazada (plans.price_uzs, plans.period_days; P19 da muallif beradi).
// Narxi yo'q yoki faol emas tarif ekranda "Not available yet" bo'ladi, to'lov tugmasi chiqmaydi.
// Matn inglizcha (SAT bo'limi qoidasi); kod nomlari o'zbekcha.

export type TarifKod = 'free' | 'pro' | 'max';
export type DavrKod = 'oylik' | '3oylik';
export type TolovUsuli = 'click' | 'payme' | 'uzcard-humo';

export const satTarif = {
  tariflar: [
    { kod: 'free', nomi: 'Free' },
    { kod: 'pro', nomi: 'Pro' },
    { kod: 'max', nomi: 'Max' },
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
  /** Qaytarish (refund) siyosati sahifasi, yol() ga beriladigan yo'l (P23). null: havola chiqmaydi, "not published yet". */
  // P23 (2026-11-11): Refund Policy qoralamasi (inglizcha nusxa; asosiy matn /uz/qaytarish/).
  qaytarishHavola: '/uz/sat/huquqiy/qaytarish/' as null | string,
  /** Obuna eslatmasi: tugashiga shu kun yoki kamroq qolganda (P22). */
  eslatmaKun: 7,
  /** Kutilayotgan to'lov shu daqiqadan eski bo'lsa "Check payment status" (P22; inpay-muvofiqlash ham 15 daqiqadan). */
  tekshirishDaqiqa: 15,
  /** Natija sahifasi: inpay-holat har necha soniyada va jami necha soniya so'raladi. */
  sorovOraligiS: 3,
  kutishS: 60,
} as const;

export const usulNomi: Record<TolovUsuli, string> = {
  click: 'Click',
  payme: 'Payme',
  'uzcard-humo': 'UzCard/HUMO',
};

/** Kvota kalitlari (0008_rpc.sql, 20261111210000_kvota_p19.sql) -> ekrandagi nom. Tartib = UsageBar tartibi. */
export const kvotaNomi: Record<string, string> = {
  sessions: 'Practice sessions',
  questions: 'Questions',
  answers: 'Answers',
  daily: 'Daily question',
  review_sessions: 'Review sessions',
  new_words: 'New words', // P15
  plan_rebuilds: 'Plan rebuilds', // P13
  ai_messages: 'AI tutor messages', // P33
  ai_messages_month: 'AI tutor messages this month', // P33
};

/** plans.features dagi mashina bayrog'i -> Free ga tushganda "nima cheklanadi" ro'yxatidagi nom (P22). */
export const bayroqNomi: Record<string, string> = {
  analytics_extended: 'Extended analytics (accuracy by difficulty, timing)',
};

/** Brauzerda faqat oxirgi to'lov raqami (qaytish sahifasi uchun). Karta ma'lumoti hech qayerda saqlanmaydi. */
export const TOLOV_KALITI = 'tayanch:sat-tolov';
