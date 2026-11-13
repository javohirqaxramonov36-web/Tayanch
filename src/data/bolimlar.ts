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
  /** Bosh sahifa kartasidagi belgili ro'yxat: ko'pi bilan 3 ta, faqat saytda qurilgan va ishlayotgan narsa.
   *  Raqamli da'vo yo'q. Yangi band qo'shishdan oldin sahifasi src/pages da borligini tekshir. */
  xususiyatlar: string[];
}

export const bolimlar: Bolim[] = [
  { slug: 'top-admission', nomi: 'Top Admission', tavsif: "Universitet tanlashdan qabul xatigacha.", holat: 'tez-orada', ikonka: 'qalpoq',
    xususiyatlar: ["Topshirish yo'li vositasi", 'Ariza zinapoyasi', "Türkiye Bursları qo'llanmasi"] },
  { slug: 'sat', nomi: 'SAT', tavsif: 'Digital SAT: Reading & Writing va Math.', holat: 'ochiq', ikonka: 'varaq',
    xususiyatlar: ['Math va Reading & Writing interaktiv darslari', 'Xato daftari va takrorlash', "Lug'at kartalari va natijalar tahlili"] },
  { slug: 'ielts', nomi: 'IELTS', tavsif: "To'rt ko'nikma bo'yicha strategiya va mashq.", holat: 'ochiq', ikonka: 'suhbat',
    xususiyatlar: ["Reading va Listening qo'llanmalari", 'Listening imlo mashqi', 'Shaxsiy tayyorgarlik rejasi'] },
  { slug: 'eyuf', nomi: 'El-Yurt Umidi', tavsif: 'Tanlov bosqichlari xaritasi.', holat: 'tez-orada', ikonka: 'medal',
    xususiyatlar: [] },
];
