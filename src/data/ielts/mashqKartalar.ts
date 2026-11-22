// Mavjud mini-mashqlar va to‘liq testlar alohida ko‘rsatiladi.
// To‘liq Listening, Speaking va birlashtirilgan mock hali ochilmagan. Vaqtlar: IE01, IE02.
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
  { nomi: 'Listening imlo', vaqt: '', tarkib: 'Mini-mashq', tavsif: 'So‘zni tinglab, to‘g‘ri yozish.', qism: 'mashq/listening-imlo/', ikonka: IKONKA.listening },
  { nomi: 'Harf va raqam diktanti', vaqt: '', tarkib: 'Mini-mashq', tavsif: 'Ism, telefon, sana va narxni tinglab yozish.', qism: 'mashq/listening-raqamlar/', ikonka: IKONKA.listening },
  { nomi: 'Listening mock', vaqt: 'taxminan 30 daqiqa', tarkib: '40 savol', tavsif: 'To‘liq Listening testi.', ikonka: IKONKA.listening },
  { nomi: 'Writing', vaqt: '40 daqiqa', tarkib: 'Task 2', tavsif: 'Task 2 inshosini yozish va saqlash.', qism: 'mashq/writing/', ikonka: IKONKA.writing },
  { nomi: 'Speaking', vaqt: '11–14 daqiqa', tarkib: '3 part', tavsif: "Og'zaki javob mashqi.", ikonka: IKONKA.speaking },
];
