// Tayanch'ning 4 bo'limi.
// holat "ochiq" bo'lsa menyuda chiqadi va kartada havola bo'ladi.
// Bo'lim sahifasi qurilib tasdiqlangandan keyingina "ochiq" ga o'tkaziladi.

export type BolimSlug = 'top-admission' | 'ielts' | 'sat' | 'eyuf';

export interface Bolim {
  slug: BolimSlug;
  nomi: string;
  tavsif: string;
  holat: 'ochiq' | 'tez-orada';
  ikonka: 'qalpoq' | 'suhbat' | 'varaq' | 'medal';
}

export const bolimlar: Bolim[] = [
  { slug: 'top-admission', nomi: 'Top Admission', tavsif: "Universitet tanlashdan qabul xatigacha.", holat: 'tez-orada', ikonka: 'qalpoq' },
  { slug: 'sat', nomi: 'SAT', tavsif: 'Digital SAT: Reading & Writing va Math.', holat: 'ochiq', ikonka: 'varaq' },
  { slug: 'ielts', nomi: 'IELTS', tavsif: "To'rt ko'nikma bo'yicha strategiya va mashq.", holat: 'ochiq', ikonka: 'suhbat' },
  { slug: 'eyuf', nomi: 'El-Yurt Umidi', tavsif: 'Tanlov bosqichlari xaritasi.', holat: 'tez-orada', ikonka: 'medal' },
];
