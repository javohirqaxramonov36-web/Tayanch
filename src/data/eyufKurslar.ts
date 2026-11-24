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
    nomi: "Nega chet elda oʻqish kerak",
    tavsif: "Taʼlim sifati, karyera, shaxsiy rivojlanish va grantlar orqali arzon yoki bepul oʻqish yoʻllari. Faqat rasmiy manbali faktlar.",
    holat: 'tayyor',
    bepul: true,
    bolimlar: [
      "Taʼlim sifati va xalqaro tan olinish",
      'Karyera imkoniyatlari',
      'Shaxsiy rivojlanish',
      'Moliyaviy imkoniyatlar: grant va stipendiyalar',
      'Raqamlar va misollar',
    ],
  },
  {
    slug: 'el-yurt-umidi',
    nomi: "El-Yurt Umidiʼni yutaylik",
    tavsif: "El-Yurt Umidi davlat granti boʻyicha suhbatga tayyorgarlik kursi — tez orada toʻliq material qoʻshiladi",
    holat: 'skelet',
    bepul: true,
    bolimlar: [
      'Suhbatga tayyorgarlik',
      'Bridge texnikasi',
      "Tez-tez soʻraladigan savollar",
      "Muvaffaqiyatli caseʼlar",
    ],
  },
];

export function eyufKurs(slug: string): EyufKurs {
  const k = eyufKurslar.find((x) => x.slug === slug);
  if (!k) throw new Error(`eyufKurslar.ts: '${slug}' topilmadi`);
  return k;
}
