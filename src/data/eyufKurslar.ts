// 5-qavat · EYUF kurslari ro'yxati (2026-11-19).
// holat: 'tayyor' = matn yozilgan; 'skelet' = faqat sarlavha va bo'limlar, kontentni muallif keyin yuklaydi.
// Yangi kurs qo'shilsa shu ro'yxatga yoziladi; sahifa /uz/eyuf/kurslar/<slug>/ da.

export type KursHolati = 'tayyor' | 'skelet';

export interface EyufKurs {
  slug: string;
  nomi: string;
  tavsif: string;
  holat: KursHolati;
  bepul: boolean;
  bolimlar: string[];
}

export const KURS_HOLATI_YORLIQ: Record<KursHolati, string> = {
  tayyor: 'Tayyor',
  skelet: "Struktura tayyor, kontent kutilmoqda",
};

export const eyufKurslar: EyufKurs[] = [
  {
    slug: 'nega-chet-elda',
    nomi: "Nega chet elda o'qish kerak",
    tavsif: "Ta'lim sifati, karyera, shaxsiy rivojlanish va grantlar orqali arzon yoki bepul o'qish yo'llari. Faqat rasmiy manbali faktlar.",
    holat: 'tayyor',
    bepul: true,
    bolimlar: [
      "Ta'lim sifati va xalqaro tan olinish",
      'Karyera imkoniyatlari',
      'Shaxsiy rivojlanish',
      'Moliyaviy imkoniyatlar: grant va stipendiyalar',
      'Raqamlar va misollar',
    ],
  },
  {
    slug: 'el-yurt-umidi',
    nomi: "El-Yurt Umidi'ni yutaylik",
    tavsif: "El-Yurt Umidi davlat granti bo'yicha suhbatga tayyorgarlik kursi — tez orada to'liq material qo'shiladi",
    holat: 'skelet',
    bepul: true,
    bolimlar: [
      'Suhbatga tayyorgarlik',
      'Bridge texnikasi',
      "Tez-tez so'raladigan savollar",
      "Muvaffaqiyatli case'lar",
    ],
  },
];

export function eyufKurs(slug: string): EyufKurs {
  const k = eyufKurslar.find((x) => x.slug === slug);
  if (!k) throw new Error(`eyufKurslar.ts: '${slug}' topilmadi`);
  return k;
}
