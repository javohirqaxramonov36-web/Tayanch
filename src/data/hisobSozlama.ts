// Hisob sozlamalari (P03). Qiymatlar muallif qarori; o'ylab topilgan qiymat yozilmaydi.
// Manba: HANDOFF.md §5 (12-savol), docs/qarorlar/001-hisob-tolov-server.md.

export const hisobSozlama = {
  /** Hisob ochish uchun minimal yosh (muallif, 2026-11-08). null bo'lsa ro'yxat formasi yosh belgisini so'ramaydi. */
  minYosh: 12 as number | null,
  /**
   * 18 yoshgacha bo'lganlar uchun qo'shimcha qoida (masalan ota-ona roziligi).
   * Qaror (2026-11-09): hozircha qo'shimcha qadam yo'q; lex.uz tekshiruvi P23 (Maxfiylik siyosati) bilan birga
   * (HANDOFF §5, 12-savol). null: ro'yxat formasida ko'rsatilmaydi.
   */
  voyagaYetmaganQoida: null as null | { yoshgacha: number; talab: 'ota-ona-roziligi' },
  /** Maxfiylik va Shartlar sahifalari (P23). null: havola o'rniga "coming soon" matni. Qiymat yol() ga beriladi. */
  maxfiylikSahifa: null as string | null,
  shartlarSahifa: null as string | null,
  /**
   * Parolning eng kam uzunligi (forma tekshiruvi; 2026-11-09 qarori, HANDOFF §5, 18-savol).
   * Supabase'dagi `minimum_password_length` (supabase/config.toml) bilan bir xil bo'lishi kerak.
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

/** SAT umumiy ball oralig'i (CB04, College Board "SAT Suite Score Structure"). profiles.target_score check bilan bir xil. */
export const satBall = { min: 400, max: 1600, manba: 'CB04' } as const;
