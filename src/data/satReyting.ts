// SAT reyting (P32): XP qoidalari va sahifa sozlamasi. Matn inglizcha (SAT bo'limi).
// XP raqamlari supabase/migrations/20261112184613_reyting.sql dagi private.xp_rule bilan BIR XIL bo'lishi shart:
// server hisoblaydi, bu yerda faqat ko'rsatiladi. Raqamlar boshlang'ich, muallif tasdig'i kerak (docs/xp-qoidasi.md).

export const xpQoida = {
  javob: 2,
  togri: 3,
  takror: 4,
  kunSavoli: 5,
  kunSavoliTogri: 5,
  kunlikChegara: 300,
  minSoniya: 3,
} as const;

/** "How XP works" ro'yxati (sahifada). */
export const xpQatorlar: { nima: string; xp: string }[] = [
  { nima: 'Answer a practice question for the first time', xp: `${xpQoida.javob} XP` },
  { nima: 'Get it right on your first try (on top of the answer XP)', xp: `+${xpQoida.togri} XP` },
  { nima: 'Get a question right in review (once per question per day)', xp: `${xpQoida.takror} XP` },
  { nima: 'Answer the question of the day', xp: `${xpQoida.kunSavoli} XP` },
  { nima: 'Get the question of the day right', xp: `+${xpQoida.kunSavoliTogri} XP` },
];

export const xpCheklovlar: string[] = [
  'Solving the same question again in a new session gives no new XP.',
  `Practice answers sent in under ${xpQoida.minSoniya} seconds give no XP.`,
  `You can earn up to ${xpQoida.kunlikChegara} XP a day.`,
  'XP is counted on the server from your saved answers. It starts on the day the leaderboard opened: earlier answers do not count.',
];

/** Laqab shakli: server bilan bir xil (leaderboard_join). Moderatsiya faqat serverda. */
export const laqabNaqsh = '[A-Za-z0-9_]{3,20}';
export const laqabRegex = new RegExp(`^${laqabNaqsh}$`);

/** Mamlakat ro'yxati (ISO 3166-1 alpha-2). Nomi brauzerda Intl.DisplayNames bilan. Tanlash ixtiyoriy. */
export const mamlakatlar = [
  'UZ', 'KZ', 'KG', 'TJ', 'TM', 'AF', 'AZ', 'RU', 'TR', 'KR', 'CN', 'IN', 'PK', 'AE', 'SA', 'MY', 'US', 'GB', 'DE', 'CA',
] as const;

/** Brauzerda faqat tanlangan tugmalar (davr va doira). Ma'lumot emas. */
export const reytingKaliti = 'tayanch:sat-reyting';

export const jadvalHajmi = 50;
