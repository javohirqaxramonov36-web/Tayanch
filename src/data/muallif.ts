// Muallif yo'li (bosh sahifadagi timeline).
// Manba: muallif tasdiqlagan matnlar va hujjatlar (Obsidian: mening-yolim-proof-gallery-2026-08-19).
// Qabul xatlari: 18 ta tasdiqlangan (Doha fayli va UniSuccess hujjati chiqarilgan).
// Preview rasmlar: shaxsiy ma'lumotlar yopilgan, original emas (public/proof/).

export interface YolBosqichi {
  yil?: string;
  sarlavha: string;
  matn: string;
  katta?: boolean; // natija bosqichi: katta yoziladi
}

export const yolBosqichlari: YolBosqichi[] = [
  { sarlavha: 'Ixtisoslashtirilgan maktab', matn: "Matematika va fizika, qattiq imtihonlar, vaqtni boshqarish." },
  { sarlavha: 'IELTS 7.0', matn: 'Qimmat kurssiz, mustaqil tayyorgarlik bilan.', katta: true },
  { sarlavha: 'SAT 1420', matn: 'Qimmat kurslarsiz.', katta: true },
  { yil: '2025–2026', sarlavha: 'Gap year', matn: "Ishlash va tayyorlanish bir vaqtda: ingliz tili o'qituvchisi, kechasi o'qish." },
];

export const qabulXatlari = {
  soni: 18,
  stipendiyaMatni: "jami $1.1M dan ortiq stipendiya takliflari",
  previewlar: [
    { fayl: 'purdue-university.webp', nomi: 'Purdue University', izoh: 'Offer of admission · Fall 2026' },
    { fayl: 'university-of-birmingham.webp', nomi: 'University of Birmingham', izoh: 'Conditional offer · 2026' },
    { fayl: 'university-of-oregon.webp', nomi: 'University of Oregon', izoh: 'Offer of admission · Fall 2026' },
    { fayl: 'university-of-alberta.webp', nomi: 'University of Alberta', izoh: 'Unconditional admission · Fall 2026' },
    { fayl: 'university-of-victoria.webp', nomi: 'University of Victoria', izoh: 'Letter of acceptance · Fall 2026' },
    { fayl: 'miami-university.webp', nomi: 'Miami University', izoh: 'Offer of admission · Fall 2026' },
  ],
  qolganlari: [
    'ASU London', 'Hope College', 'Illinois College', 'Kent State University', 'Le Moyne College',
    'Missouri University of Science and Technology', 'University of Cincinnati', 'University of Delaware',
    'University of New Haven', 'University of Southern Mississippi', 'University of Oklahoma',
    'Western New England University',
  ],
};
