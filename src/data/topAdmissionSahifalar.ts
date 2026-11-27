// Top Admission (2-qavat) yon panel guruhlari.
// Dizayn: Claude Design "Tayanch Top Admission maketi", "LiftSidebar" artboard'i
// (https://claude.ai/artifact/1zP2rnjMp46RgY9WpD84GF). Bandlar ikonkasiz (maket bo'yicha).
// "Qo'llanmalar" guruhi maketdan keyin qo'shildi (Ariza zinapoyasi darsi, PR #25).
// "Davlatlarni taqqoslash" Admission D-seriya Q2 da qo'shildi (rejadagi "header ochiladigan ro'yxati" o'rniga: bo'limda header menyusi yo'q).
// "Grantlar" Q3 da, "Menga mos universitet" Q4 da shu yerga qo'shildi (xuddi shu sabab bilan).
// href bo'lmasa band havola emas: "tez orada" yorlig'i bilan matn (Tab bilan o'tilmaydi).

export interface TaBand {
  nomi: string;
  /** /uz/ dan keyingi to'liq qism (boshqa qavat sahifasi ham bo'lishi mumkin) */
  href?: string;
}

export interface TaGuruh {
  nomi: string;
  bandlar: TaBand[];
}

export const taGuruhlar: TaGuruh[] = [
  {
    nomi: "Yo'nalishlar",
    bandlar: [
      { nomi: 'Türkiye Bursları', href: 'top-admission/turkiye-burslari/' },
      { nomi: 'Stipendium Hungaricum', href: 'top-admission/grantlar/stipendium-hungaricum/' },
      { nomi: 'Global Korea Scholarship', href: 'top-admission/grantlar/global-korea-scholarship/' },
      { nomi: 'MEXT (Yaponiya)', href: 'top-admission/grantlar/mext/' },
    ],
  },
  {
    nomi: "Qo'llanmalar",
    bandlar: [
      { nomi: 'Ariza zinapoyasi', href: 'top-admission/qollanma/ariza-zinapoyasi/' },
      { nomi: 'Kurs: STEM profildan arizaga', href: 'top-admission/kurs/' },
      { nomi: 'Platformalar xaritasi', href: 'top-admission/platformalar/' },
      { nomi: "Arzonroq oʻqish yoʻllari", href: 'top-admission/arzon-yollar/' },
      { nomi: 'Ochiq manbalar', href: 'top-admission/manbalar/' },
    ],
  },
  {
    nomi: 'Vositalar',
    bandlar: [
      { nomi: "Topshirish yoʻli", href: 'top-admission/vosita/topshirish-yoli/' },
      { nomi: 'Hujjat chamadoni', href: 'top-admission/vosita/hujjat-chamadoni/' },
      { nomi: 'Davlatlarni taqqoslash', href: 'top-admission/davlatlar/' },
      { nomi: 'Grantlar', href: 'top-admission/grantlar/' },
      { nomi: 'Menga mos universitet', href: 'top-admission/universitetlar/' },
      { nomi: 'Muddatlar', href: 'deadline/' },
    ],
  },
];
