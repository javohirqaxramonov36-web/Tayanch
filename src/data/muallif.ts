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

// Matnlar eski saytdagi "Mening yo'lim" hikoyasidan qisqartirildi (6 bosqich).
// Oila sharoiti haqidagi tafsilotlar muallifning o'z qarori bilan qoldirildi (2026-11-04).
export const yolBosqichlari: YolBosqichi[] = [
  {
    sarlavha: 'Otam bilan qurilishda',
    matn: "\"Ikki marta o'lcha, bir marta kes.\" Beton quyish, kafel va material hisoblash. Muhandislikka qiziqishim shu yerdan boshlandi.",
  },
  {
    sarlavha: 'IELTS 7.0',
    matn: "Oilamizdagi moliyaviy qiyinchiliklar sabab IELTS kursini tark etib, mustaqil tayyorlandim. Imtihon to'lovi uchun hovlimizdagi daraxtlar ham sotilgan.",
    katta: true,
  },
  {
    sarlavha: 'SAT 1420',
    matn: "Pullik kurssiz: bepul materiallar, muntazam amaliy testlar va bor resursni to'g'ri ishlatish.",
    katta: true,
  },
  {
    yil: '2025–2026',
    sarlavha: 'Gap year',
    matn: "Oilamni qo'llab-quvvatlash uchun yuk ortish-tushirish ishida ishladim. Ba'zan tungi va kunduzgi smenalar ulanib ketardi, lekin to'xtamadim.",
  },
  {
    sarlavha: "AI: vaqtni bo'shatadigan vosita",
    matn: "AutoCAD'dagi takrorlanuvchi ishni AI yordamida yozilgan AutoLISP skripti bilan 2 soatdan 15 daqiqaga tushirdim.",
  },
  {
    sarlavha: "O'qituvchilik",
    matn: "Sydney School'da 40 dan ortiq o'quvchiga ingliz tili, speaking va IELTS/CEFR bo'yicha dars berdim.",
  },
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
