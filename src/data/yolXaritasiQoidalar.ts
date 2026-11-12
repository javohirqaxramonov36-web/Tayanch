// Navigator yo'l xaritasi qoidalari (AI yo'q, faqat jadval).
// Qator: maqsad × sur'at × kunlik daqiqa → qadamlar (navigatorSahifalar.ts ID'lari, muhimlik tartibida).
// Kunlik "*" = shu maqsad va sur'at uchun boshqa aniq qator bo'lmasa. Aniq qator "*" dan ustun.
// Sur'at muddatdan hisoblanadi (src/lib/navigator/qolganKun.ts):
//   intensiv: 15 kun yoki sanagacha <=15 kun; oy: 1 oy yoki 16-45 kun; uzoq: 3 oy yoki 45+ kun;
//   umumiy: "Hali aniq emas", sana o'tib ketgan yoki onboarding o'tkazib yuborilgan.
// Qadamlar soni va ko'p maqsadli taqsimot: QADAMLAR_SONI va yolXaritasi.ts.
// Yangi ID qo'shilsa, u navigatorSahifalar.ts da bo'lishi shart: aks holda build va test xato beradi.
import type { Maqsad } from './navigatorSahifalar.ts';

export type Surat = 'intensiv' | 'oy' | 'uzoq' | 'umumiy';
export type KunlikDaqiqa = 15 | 30 | 60 | 120;

export interface Qoida {
  maqsad: Maqsad;
  surat: Surat;
  kunlik: KunlikDaqiqa | '*';
  qadamlar: string[];
}

/** Kunlik vaqtga qarab jami qadamlar soni (3-5) */
export const QADAMLAR_SONI: Record<KunlikDaqiqa, number> = { 15: 3, 30: 4, 60: 4, 120: 5 };

/** Kunlik vaqt javobi yo'q bo'lsa (o'tkazib yuborilgan) */
export const STANDART_KUNLIK: KunlikDaqiqa = 30;

/** Onboarding o'tkazib yuborilganda: har ochiq qavatdan bittadan qadam va muddatlar */
export const UMUMIY_REJA: string[] = ['sat-kirish', 'ielts-kirish', 'ta-topshirish-yoli', 'umumiy-muddatlar'];

const q = (maqsad: Maqsad, surat: Surat, kunlik: KunlikDaqiqa | '*', qadamlar: string[]): Qoida => ({ maqsad, surat, kunlik, qadamlar });

// prettier-ignore
export const qoidalar: Qoida[] = [
  //  maqsad           sur'at      kunlik  qadamlar
  q('sat',           'intensiv', 15,  ['sat-takrorlash', 'sat-lugat', 'sat-test']),
  q('sat',           'intensiv', 30,  ['sat-test', 'sat-takrorlash', 'sat-natijalar', 'sat-lugat']),
  q('sat',           'intensiv', 60,  ['sat-test', 'sat-natijalar', 'sat-takrorlash', 'sat-strategiya']),
  q('sat',           'intensiv', 120, ['sat-test', 'sat-natijalar', 'sat-takrorlash', 'sat-bank', 'sat-vaqt']),
  q('sat',           'oy',       15,  ['sat-lugat', 'sat-rw-otish', 'sat-takrorlash']),
  q('sat',           'oy',       30,  ['sat-reja', 'sat-math-grafik', 'sat-rw-xato', 'sat-takrorlash']),
  q('sat',           'oy',       60,  ['sat-reja', 'sat-bank', 'sat-test', 'sat-takrorlash']),
  q('sat',           'oy',       120, ['sat-reja', 'sat-bank', 'sat-test', 'sat-natijalar', 'sat-takrorlash']),
  q('sat',           'uzoq',     15,  ['sat-lugat', 'sat-rw-lugat', 'sat-math-aylana']),
  q('sat',           'uzoq',     30,  ['sat-reja', 'sat-math-hajm', 'sat-rw-dalil', 'sat-math-statistika']),
  q('sat',           'uzoq',     60,  ['sat-reja', 'sat-math-grafik', 'sat-rw-xato', 'sat-bank']),
  q('sat',           'uzoq',     120, ['sat-reja', 'sat-math-grafik', 'sat-rw-dalil', 'sat-bank', 'sat-test']),
  q('sat',           'umumiy',   '*', ['sat-kirish', 'sat-reja', 'sat-test', 'sat-lugat', 'sat-bank']),

  q('ielts',         'intensiv', 15,  ['ielts-tfng', 'ielts-sarlavhalar', 'ielts-reading']),
  q('ielts',         'intensiv', '*', ['ielts-tfng', 'ielts-sarlavhalar', 'ielts-reading', 'ielts-writing', 'ielts-listening']),
  q('ielts',         'oy',       '*', ['ielts-reja', 'ielts-reading', 'ielts-tfng', 'ielts-sarlavhalar', 'ielts-writing']),
  q('ielts',         'uzoq',     '*', ['ielts-reja', 'ielts-reading', 'ielts-listening', 'ielts-speaking', 'ielts-tfng']),
  q('ielts',         'umumiy',   '*', ['ielts-kirish', 'ielts-reja', 'ielts-reading', 'ielts-tfng', 'ielts-sarlavhalar']),

  q('top-admission', 'intensiv', '*', ['umumiy-muddatlar', 'ta-topshirish-yoli', 'ta-zinapoya', 'umumiy-manbalar', 'ta-turkiye']),
  q('top-admission', 'oy',       '*', ['ta-topshirish-yoli', 'umumiy-muddatlar', 'ta-zinapoya', 'ta-turkiye', 'umumiy-manbalar']),
  q('top-admission', 'uzoq',     '*', ['ta-kirish', 'ta-topshirish-yoli', 'ta-zinapoya', 'ta-turkiye', 'umumiy-muddatlar']),
  q('top-admission', 'umumiy',   '*', ['ta-kirish', 'ta-topshirish-yoli', 'umumiy-muddatlar', 'ta-zinapoya', 'umumiy-manbalar']),

  q('eyuf',          'intensiv', '*', ['umumiy-muddatlar', 'umumiy-manbalar', 'eyuf-kirish']),
  q('eyuf',          'oy',       '*', ['umumiy-muddatlar', 'eyuf-kirish', 'umumiy-manbalar']),
  q('eyuf',          'uzoq',     '*', ['umumiy-muddatlar', 'eyuf-kirish', 'umumiy-manbalar']),
  q('eyuf',          'umumiy',   '*', ['umumiy-muddatlar', 'eyuf-kirish', 'umumiy-manbalar']),
];
