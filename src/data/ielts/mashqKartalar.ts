// Cards of the IELTS practice landing page. Reading and Writing (Task 2) work; the other cards are shown
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
  { nomi: 'Listening', vaqt: '45 daqiqa', tarkib: '40 savol', tavsif: 'Audio bilan mock test.', qism: 'mashq/listening/', ikonka: IKONKA.listening },
  { nomi: 'Writing', vaqt: '40 daqiqa', tarkib: 'Task 2', tavsif: 'Insho yozing, AI taxminiy band va maslahat beradi.', qism: 'mashq/writing/', ikonka: IKONKA.writing },
  { nomi: 'Speaking', vaqt: '11–14 daqiqa', tarkib: '3 part', tavsif: "Og'zaki javob mashqi.", ikonka: IKONKA.speaking },
];
