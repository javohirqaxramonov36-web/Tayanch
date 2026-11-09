// Hisob sozlamalari (P03). Qiymatlar muallif qarori; o'ylab topilgan qiymat yozilmaydi.
// Manba: HANDOFF.md §5 (12-savol), docs/qarorlar/001-hisob-tolov-server.md.

export const hisobSozlama = {
  /** Hisob ochish uchun minimal yosh (muallif, 2026-11-08). null bo'lsa ro'yxat formasi yosh belgisini so'ramaydi. */
  minYosh: 12 as number | null,
  /**
   * 18 yoshgacha bo'lganlar uchun qo'shimcha qoida (masalan ota-ona roziligi).
   * Hali hal qilinmagan: O'zbekiston qonunchiligi (lex.uz) tekshirilishi kerak (HANDOFF §5, 12-savol).
   * null: qo'shimcha qadam yo'q, ro'yxat formasida ham ko'rsatilmaydi.
   */
  voyagaYetmaganQoida: null as null | { yoshgacha: number; talab: 'ota-ona-roziligi' },
  /** Maxfiylik va Shartlar sahifalari (P23). null: havola o'rniga "coming soon" matni. Qiymat yol() ga beriladi. */
  maxfiylikSahifa: null as string | null,
  shartlarSahifa: null as string | null,
  /**
   * Parolning eng kam uzunligi (forma tekshiruvi). Supabase dashboard'idagi
   * Authentication → Providers → Email → "Minimum password length" shundan kam bo'lmasin.
   * Qiymat muallif tasdig'ini kutadi.
   */
  parolMinUzunlik: 8,
  /** Reyting taxallusi (ixtiyoriy): harf, raqam, pastki chiziq. */
  taxallusNaqsh: '[A-Za-z0-9_]{3,20}',
  /**
   * Supabase sessiyasi saqlanadigan localStorage kaliti. `tayanch:` bilan boshlanadi (CLAUDE.md qoidasi),
   * shuning uchun istisno kerak emas. Supabase o'zi yana `tayanch:auth-code-verifier` kabi yordamchi kalit qo'shishi mumkin.
   */
  sessiyaKaliti: 'tayanch:auth',
} as const;
