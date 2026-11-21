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
    xususiyatlar: ["Topshirish yo'li vositasi", 'Ariza zinapoyasi', "Türkiye Bursları qo'llanmasi"] },
  { slug: 'sat', nomi: 'SAT', tavsif: 'Digital SAT: Reading & Writing va Math.', holat: 'ochiq', ikonka: 'varaq',
    xususiyatlar: ['Math va Reading & Writing interaktiv darslari', 'Xato daftari va takrorlash', "Lug'at kartalari va natijalar tahlili"] },
  { slug: 'ielts', nomi: 'IELTS', tavsif: "To'rt ko'nikma bo'yicha strategiya va mashq.", holat: 'ochiq', ikonka: 'suhbat',
    xususiyatlar: ["Reading va Listening qo'llanmalari", 'Listening imlo mashqi', 'Shaxsiy tayyorgarlik rejasi'] },
  { slug: 'eyuf', nomi: 'El-Yurt Umidi', tavsif: 'Tanlov bosqichlari xaritasi.', holat: 'tez-orada', ikonka: 'medal',
    xususiyatlar: [] },
  // Qavat ochiq (qulfsiz). Kartadagi tugma kurs holatidan (aiAcademy.ts), qavat holatidan emas.
  { slug: 'ai-academy', nomi: 'AI Academy', tavsif: "Sun'iy intellektdan amalda foydalanishni o'rganing: to'g'ri prompt yozing va o'z muammoingizni AI bilan hal qiling.", holat: 'ochiq', ikonka: 'kod',
    xususiyatlar: ['Prompt Engineering kursi', "Har kurs oxirida o'z muammoingizni hal qilasiz", 'Birinchi darslar bepul'] },
];
