// Qavatlar orasidagi yo'l: dars yoki vosita oxirida "boshqa qavatda" kartalari (dizayn rejasi B, 4-bosqich).
// Juftliklarni muallif tasdiqlagan (2026-11-09). Matn manba sahifa tilida: SAT sahifalarida inglizcha.
// Faqat saytda bor sahifalarga havola; imtihon yoki qabul haqida fakt yozilmaydi.
import { yol } from '../lib/yol';

export interface QavatlarAroKarta {
  /** Maqsad qavat raqami (yorliq qavatlar.ts dan olinadi) */
  qavat: 2 | 3 | 4 | 5;
  nomi: string;
  /** nomi sahifa tilidan boshqa tilda bo'lsa */
  nomiTili?: string;
  izoh: string;
  href: string;
}

const topshirishYoliEn: QavatlarAroKarta = {
  qavat: 2,
  nomi: 'Application path',
  izoh: 'Choose a country, degree and funding to see matching application paths. In Uzbek.',
  href: yol('/uz/top-admission/vosita/topshirish-yoli/'),
};

const ieltsTfngEn: QavatlarAroKarta = {
  qavat: 4,
  nomi: 'IELTS Reading: True / False / Not Given',
  izoh: 'Another lesson on finding the evidence sentence, for IELTS. In Uzbek.',
  href: yol('/uz/ielts/qollanma/reading/tfng/'),
};

const satDalilUz: QavatlarAroKarta = {
  qavat: 3,
  nomi: 'SAT Reading & Writing: Mark the evidence',
  nomiTili: 'en',
  izoh: 'Dalil gapni topish, SAT matnlarida. Dars ingliz tilida.',
  href: yol('/uz/sat/qollanma/reading-writing/dalil/'),
};

const ieltsUz: QavatlarAroKarta = {
  qavat: 4,
  nomi: 'IELTS Reading darslari',
  izoh: 'True / False / Not Given, Matching headings va 30 kunlik reja.',
  href: yol('/uz/ielts/'),
};

const satUz: QavatlarAroKarta = {
  qavat: 3,
  nomi: 'SAT darslari va mashq',
  izoh: "Math va Reading & Writing darslari, mashq testi, lug'at. Ingliz tilida.",
  href: yol('/uz/sat/'),
};

/** DarsQolip `modul` bo'yicha */
export const darsQavatlarAro: Record<string, QavatlarAroKarta[]> = {
  hajm: [topshirishYoliEn],
  grafik: [topshirishYoliEn],
  aylana: [topshirishYoliEn],
  statistika: [topshirishYoliEn],
  'rw-xato': [ieltsTfngEn],
  'rw-dalil': [ieltsTfngEn],
  'rw-otish': [ieltsTfngEn],
  'rw-lugat': [ieltsTfngEn],
  'ir-tfng': [satDalilUz],
  'ir-sarlavha': [satDalilUz],
  'ta-zinapoya': [ieltsUz],
};

/** Topshirish yo'li vositasi oxirida */
export const topshirishYoliQavatlarAro: QavatlarAroKarta[] = [satUz, ieltsUz];
