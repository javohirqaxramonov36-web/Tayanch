// IELTS Reading: True / False / Not Given swipe mashqi to'plamlari (/uz/ielts/mashq/tfng/).
// Hozir faqat bitta "NAMUNA" to'plam (2 gap): sahifa ishlashini ko'rsatish uchun, IELTS matni emas.
// Haqiqiy to'plamlarni muallif yozadi. Rasmiy IELTS matnlari ko'chirilmaydi.
// Har to'plam tugaganda progress: markDone(4, `tfng-${setId}`) (ro'yxat: QAVAT_BANDLARI, src/data/progressBandlar.ts).
// `matn` va `gap` inglizcha; `izoh_uz` o'zbekcha (muallif tekshiradi). Matnda xatboshilar bo'sh qator bilan ajratiladi.

export type TfngJavob = 'TRUE' | 'FALSE' | 'NOT GIVEN';

export interface TfngGap {
  gap: string;
  javob: TfngJavob;
  izoh_uz: string;
}

export interface TfngToplam {
  setId: string;
  /** Ro'yxatdagi nomi (o'zbekcha) */
  nomi: string;
  /** Namuna to'plam ekranda "Namuna" deb belgilanadi */
  namuna?: boolean;
  matn: string;
  gaplar: TfngGap[];
}

export const tfngToplamlar: TfngToplam[] = [
  {
    setId: 'namuna',
    nomi: 'NAMUNA: mahalla kutubxonasi',
    namuna: true,
    matn: `The Riverside community library opened in 1998 with a single reading room and about two thousand books.

Today it also lends laptops to students, but only for use inside the building. The library is closed on Sundays.`,
    gaplar: [
      {
        gap: 'Students may take the library laptops home.',
        javob: 'FALSE',
        izoh_uz: 'Matnda noutbuklar faqat bino ichida ishlatilishi aytilgan („only for use inside the building“). Gap bunga zid, shuning uchun FALSE.',
      },
      {
        gap: 'The library was opened by the local council.',
        javob: 'NOT GIVEN',
        izoh_uz: 'Matnda kutubxona qachon ochilgani (1998) bor, lekin uni kim ochgani aytilmagan. Maʼlumot yoʻq, shuning uchun NOT GIVEN.',
      },
    ],
  },
];

export const tfngBandId = (setId: string) => `tfng-${setId}`;
