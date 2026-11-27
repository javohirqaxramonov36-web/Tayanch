// IELTS Reading: True / False / Not Given swipe mashqi to'plamlari (/uz/ielts/mashq/tfng/).
// Hozir faqat bitta "NAMUNA" to'plam (2 gap): sahifa ishlashini ko'rsatish uchun, IELTS matni emas.
// Haqiqiy to'plamlarni muallif yozadi. Rasmiy IELTS matnlari ko'chirilmaydi.
// Har to'plam tugaganda progress: markDone(4, `tfng-${setId}`) (ro'yxat: QAVAT_BANDLARI, src/data/progressBandlar.ts).
// Hammasi inglizcha (2026-11-27, IELTS to'liq inglizcha; `izoh_uz` kalit nomi eski, matni inglizcha, muallif tekshiradi). Matnda xatboshilar bo'sh qator bilan ajratiladi.

export type TfngJavob = 'TRUE' | 'FALSE' | 'NOT GIVEN';

export interface TfngGap {
  gap: string;
  javob: TfngJavob;
  izoh_uz: string;
}

export interface TfngToplam {
  setId: string;
  /** Ro'yxatdagi nomi (inglizcha) */
  nomi: string;
  /** Namuna to'plam ekranda "Sample" deb belgilanadi */
  namuna?: boolean;
  matn: string;
  gaplar: TfngGap[];
}

export const tfngToplamlar: TfngToplam[] = [
  {
    setId: 'namuna',
    nomi: 'SAMPLE: a community library',
    namuna: true,
    matn: `The Riverside community library opened in 1998 with a single reading room and about two thousand books.

Today it also lends laptops to students, but only for use inside the building. The library is closed on Sundays.`,
    gaplar: [
      {
        gap: 'Students may take the library laptops home.',
        javob: 'FALSE',
        izoh_uz: 'The text says the laptops are "only for use inside the building". The statement contradicts this, so the answer is FALSE.',
      },
      {
        gap: 'The library was opened by the local council.',
        javob: 'NOT GIVEN',
        izoh_uz: 'The text says when the library opened (1998), but not who opened it. There is no information, so the answer is NOT GIVEN.',
      },
    ],
  },
];

export const tfngBandId = (setId: string) => `tfng-${setId}`;
