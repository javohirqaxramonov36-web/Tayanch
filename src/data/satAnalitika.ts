// Analitika paneli sozlamalari (P14, "My results"). Sahifadagi izoh matni shu qiymatlardan tuziladi.

export const analitikaSozlama = {
  /** Aniqlik shu foizdan (≥) boshlab "Strong". */
  kuchli: 85,
  /** Aniqlik shu foizdan (≥) boshlab "Developing", pastida "Needs work". */
  rivojlanmoqda: 60,
  /**
   * Ko'nikmaga holat berish uchun eng kam urinish soni (N).
   * Sabab: 1–4 urinishda bitta javob aniqlikni 20–100 foiz bandga siljitadi (shovqin);
   * 5 urinishda bitta javob 20 bandga teng. Kam bo'lsa holat "Not enough data".
   */
  minUrinish: 5,
  /** "Skills to practice" ro'yxati uzunligi. */
  maxTavsiya: 6,
  /** Faollik xaritasi kunlari (server ham 90 kun qaytaradi). */
  kunlar: 90,
  /** Kun chegarasi. Server: private.today_tashkent(). */
  vaqtMintaqasi: 'Asia/Tashkent',
  vaqtMintaqasiYozuv: 'Tashkent time (Asia/Tashkent, UTC+5)',
  /** "Practice this skill" sessiyasi hajmi (savol soni; mos savol kam bo'lsa server kamroq beradi). */
  mashqHajmi: 10,
  /** plans.features dagi bayroq: qiyinlik bo'yicha aniqlik va vaqt bloklari. */
  kengaytirilganBayroq: 'analytics_extended',
} as const;

/** plans.features dagi mashina bayrog'i (snake_case kalit): Obuna sahifasida imkoniyat matni sifatida ko'rsatilmaydi. */
export const tarifBayrogimi = (s: string) => /^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(s);
