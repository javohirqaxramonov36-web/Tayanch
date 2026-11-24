// Telegram hamjamiyati havolalari (muallif keyin to'ldiradi).
// Havola bo'sh bo'lsa: dev'da placeholder ko'rinadi, production build'da Telegram bloklari umuman chiqmaydi
// (saytga ishlamaydigan tugma va raqamsiz "faol" da'vosi chiqmasin).
export const telegram = {
  /** Kanal: https://t.me/... */
  kanal: 'https://t.me/tayanch_go',
  /** Savol-javob guruhi: https://t.me/... */
  guruh: '',
  /** Kanaldagi faol talabalar soni: faqat haqiqiy raqam, manba bilan */
  azolar: null as number | null,
};

export type TelegramTuri = 'kanal' | 'guruh';

/** Blok ko'rsatiladimi: havola bor yoki dev rejim */
export const telegramKorinadi = (turi: TelegramTuri) => Boolean(telegram[turi]) || import.meta.env.DEV;

export const telegramHref = (turi: TelegramTuri) => telegram[turi] || '#';
