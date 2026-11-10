// Hisob sozlamalari (P03). Qiymatlar muallif qarori; o'ylab topilgan qiymat yozilmaydi.
// Manba: HANDOFF.md §5 (12-savol), docs/qarorlar/001-hisob-tolov-server.md.

export const hisobSozlama = {
  /** Hisob ochish uchun minimal yosh (muallif, 2026-11-08). null bo'lsa ro'yxat formasi yosh belgisini so'ramaydi. */
  minYosh: 12 as number | null,
  /**
   * 18 yoshgacha bo'lganlar uchun qo'shimcha qoida. Qaror (2026-11-09, P23, HANDOFF §5 12-savol):
   * "Shaxsga doir ma'lumotlar to'g'risida"gi Qonun 21-moddasi voyaga yetmagan subyekt ma'lumotiga ishlov berish uchun
   * ota-ona (vasiy) roziligini yozma, shu jumladan elektron shaklda talab qiladi (LX02); voyaga yetish 18 yosh (LX03).
   * Ro'yxat formasi 12–17 yoshlilardan ota-ona ismi va rozilik belgisini so'raydi. null: qadam ko'rsatilmaydi.
   */
  voyagaYetmaganQoida: { yoshgacha: 18, talab: 'ota-ona-roziligi', manbalar: ['LX02', 'LX03'] } as
    null | { yoshgacha: number; talab: 'ota-ona-roziligi'; manbalar: string[] },
  /** Maxfiylik va Shartlar sahifalari (P23, 2026-11-09). Qiymat yol() ga beriladi. */
  maxfiylikSahifa: '/uz/maxfiylik/' as string | null,
  shartlarSahifa: '/uz/shartlar/' as string | null,
  /**
   * Parolning eng kam uzunligi (forma tekshiruvi; 2026-11-09 qarori, HANDOFF §5, 18-savol).
   * Supabase'dagi `minimum_password_length` (supabase/config.toml) bilan bir xil bo'lishi kerak.
   */
  parolMinUzunlik: 8,
  /**
   * Rozilik (Maxfiylik + Shartlar + yosh) versiyasi (P03B, 2026-11-09). Ro'yxat user_metadata'ga, rozilik sahifasi
   * profiles.consent_version ga yozadi; consent_at ni server triggeri qo'yadi. Hujjatlar o'zgarsa yangi sana.
   */
  // 2026-11-10: Maxfiylik qayta yozildi, Shartlar qo'shildi (P23): avval rozi bo'lganlar qayta so'raladi.
  rozilikVersiya: '2026-11-10',
  /** Reyting taxallusi (ixtiyoriy): harf, raqam, pastki chiziq. */
  taxallusNaqsh: '[A-Za-z0-9_]{3,20}',
  /**
   * Supabase sessiyasi saqlanadigan localStorage kaliti. `tayanch:` bilan boshlanadi (CLAUDE.md qoidasi),
   * shuning uchun istisno kerak emas. Supabase o'zi yana `tayanch:auth-code-verifier` kabi yordamchi kalit qo'shishi mumkin.
   */
  sessiyaKaliti: 'tayanch:auth',
  /** Google'ga ketishdan oldin "kirgandan keyin qayerga" (sessionStorage; callback o'qib o'chiradi). */
  keyinKaliti: 'tayanch:hisob-keyin',
} as const;
