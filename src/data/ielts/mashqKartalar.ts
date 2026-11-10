// Cards of the IELTS practice landing page. Only Reading works; the other cards are shown
// disabled with a "Tez orada" badge. Timings: IE01, IE02 (src/data/manbalar.ts).
import { IKONKA } from '../ieltsSahifalar.ts';

export interface MashqKarta {
  nomi: string;
  vaqt: string;
  tarkib: string;
  tavsif: string;
  /** part after /uz/ielts/; cards without it are "coming soon" */
  qism?: string;
  ikonka: string;
}

export const mashqKartalar: MashqKarta[] = [
  { nomi: 'Full Mock Test', vaqt: '2 soat 45 daqiqa', tarkib: "4 bo'lim", tavsif: "To'rt bo'lim bitta testda.", ikonka: IKONKA.namuna },
  { nomi: 'Reading', vaqt: '60 daqiqa', tarkib: '40 savol', tavsif: '3 ta matn, avtomatik tekshirish va taxminiy band.', qism: 'mashq/reading/', ikonka: IKONKA.reading },
  { nomi: 'Listening', vaqt: 'taxminan 30 daqiqa', tarkib: '40 savol', tavsif: 'Audio bilan ishlash mashqi.', ikonka: IKONKA.listening },
  { nomi: 'Writing', vaqt: '60 daqiqa', tarkib: '2 task', tavsif: 'Task 1 va Task 2.', ikonka: IKONKA.writing },
  { nomi: 'Speaking', vaqt: '11–14 daqiqa', tarkib: '3 part', tavsif: "Og'zaki javob mashqi.", ikonka: IKONKA.speaking },
];
