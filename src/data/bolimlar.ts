// Tayanch'ning bo'limlari (2–6-qavat). 6-qavat AI Academy 2026-11-19 da qo'shilgan.
// Qoralama bo'limga kirish mumkin. Tasdiqlangach "ochiq" ga o'tkaziladi.

export type BolimSlug = 'top-admission' | 'ielts' | 'sat' | 'eyuf' | 'ai-academy';

export interface Bolim {
  slug: BolimSlug;
  nomi: string;
  tavsif: string;
  holat: 'ochiq' | 'qoralama' | 'tez-orada';
  ikonka: 'qalpoq' | 'suhbat' | 'varaq' | 'medal' | 'kod';
  /** Bosh sahifa kartasidagi belgili ro'yxat: ko'pi bilan 3 ta, faqat saytda qurilgan va ishlayotgan narsa.
   *  Raqamli da'vo yo'q. Yangi band qo'shishdan oldin sahifasi src/pages da borligini tekshir. */
  xususiyatlar: string[];
}

export const bolimlar: Bolim[] = [
  { slug: 'top-admission', nomi: 'Top Admission', tavsif: "Universitet tanlashdan qabul xatigacha.", holat: 'ochiq', ikonka: 'qalpoq',
    xususiyatlar: ["Topshirish yoʻli va universitet tanlash", 'Grantlar katalogi va davlatlarni taqqoslash', 'Ariza kursi, shablonlar va namunalar'] },
  { slug: 'sat', nomi: 'SAT', tavsif: 'Digital SAT: Reading & Writing va Math.', holat: 'ochiq', ikonka: 'varaq',
    xususiyatlar: ['Math va Reading & Writing interaktiv darslari', 'Xato daftari va takrorlash', "Lugʻat kartalari va natijalar tahlili"] },
  { slug: 'ielts', nomi: 'IELTS', tavsif: "Toʻrt koʻnikma boʻyicha strategiya va mashq.", holat: 'ochiq', ikonka: 'suhbat',
    xususiyatlar: ['Reading testlari va natija tahlili', "Listening, Writing va Speaking qoʻllanmalari", 'Shaxsiy tayyorgarlik rejasi'] },
  { slug: 'eyuf', nomi: 'El-Yurt Umidi', tavsif: "Hujjatdan suhbatgacha: tanlov bosqichlariga tayyorgarlik.", holat: 'ochiq', ikonka: 'medal',
    xususiyatlar: ['IQ test va test simulyatsiyasi', 'Hujjatlar va esse', 'Suhbatga tayyorgarlik'] },
  // Qavat ochiq (qulfsiz). Kartadagi tugma kurs holatidan (aiAcademy.ts), qavat holatidan emas.
  { slug: 'ai-academy', nomi: 'AI Academy', tavsif: "Sunʼiy intellektdan amalda foydalanishni oʻrganing: toʻgʻri prompt yozing va oʻz muammoingizni AI bilan hal qiling.", holat: 'ochiq', ikonka: 'kod',
    xususiyatlar: ['Prompt Engineering kursi', "Har kurs oxirida oʻz muammoingizni hal qilasiz", 'Birinchi darslar bepul'] },
];
