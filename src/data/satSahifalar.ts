// SAT bo'limining sahifalari va sidebar guruhlari.
// Tavsiflarda fakt yo'q: faqat sahifada nima bo'lishi yozilgan. Fakt qo'shilsa, manba ID si ham qo'shiladi.

export type SatTuri = 'mashq' | 'vosita' | 'qollanma';

export interface SatSahifa {
  /** /uz/sat/ dan keyingi qism, oxirida / bilan: "mashq/xatolar/". Sahifasiz bandda bo'sh. */
  qism: string;
  nomi: string;
  tavsif: string;
  turi: SatTuri;
  manbalar: string[];
  tekshirilmagan: string[];
  /** true: sahifa o'z ekrani bilan qurilgan */
  tayyor?: boolean;
  /** true: menyuda havola emas, "tez orada" yorlig'i bilan (sahifasi bo'lsa ham) */
  tezOrada?: boolean;
  /** true: hali sahifasi yo'q, faqat menyuda "tez orada" */
  sahifasiz?: boolean;
  /** SAT bo'limidan tashqaridagi sahifa: "/uz/manbalar/" */
  tashqi?: string;
}

export interface SatGuruh {
  nomi: string;
  sahifalar: SatSahifa[];
}

const UMUMIY_TEKSHIRILMAGAN = "Sahifa mazmuni hali yozilmagan: hozircha faqat sarlavha va reja.";

// Menyu guruhlari (2026-11-06, muallif tasdig'i): Mashq · Math darslari (PR #15) · Qo'llanmalar · Vositalar · Tayanch.
export const satGuruhlar: SatGuruh[] = [
  {
    nomi: 'Mashq',
    sahifalar: [
      {
        qism: 'mashq/',
        tayyor: true,
        nomi: 'Mashq',
        tavsif: "Rasmiy domen va ko'nikmalar bo'yicha SAT savollari, har javobdan keyin o'zbekcha izoh.",
        turi: 'mashq',
        manbalar: ['CB08'],
        tekshirilmagan: [],
      },
      {
        qism: 'mashq/xatolar/',
        tayyor: true,
        nomi: 'Xato daftari',
        tavsif: "Xato qilgan va saqlagan savollaringiz. Ma'lumot faqat shu brauzerda saqlanadi.",
        turi: 'mashq',
        manbalar: [],
        tekshirilmagan: [],
      },
      {
        qism: 'mashq/lugat/',
        tayyor: true,
        nomi: "Lug'at",
        tavsif: "Reading & Writing matnlarida uchraydigan so'zlar uchun kartochkalar.",
        turi: 'mashq',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "So'zlar ro'yxati manbasi hali belgilanmagan."],
      },
    ],
  },
  {
    nomi: 'Math darslari',
    sahifalar: [
      {
        qism: 'qollanma/math/hajm/',
        tayyor: true,
        nomi: 'Hajm laboratoriyasi',
        tavsif: "Silindr, konus, shar va prizma hajmi 3D sahnada: o'lchamni o'zgartiring, formulani ko'ring, 6 ta mashq.",
        turi: 'qollanma',
        manbalar: ['CB05'],
        tekshirilmagan: ["Mashq savollari Tayanch uchun yozilgan; muallif tekshiruvidan o'tmaganlari \"tekshirilmagan\" deb belgilangan."],
      },
      {
        qism: 'qollanma/math/grafik/',
        tayyor: true,
        nomi: 'Funksiya grafigi',
        tavsif: "To'g'ri chiziq, parabolaning uch shakli va ikki tenglama kesishishi: slayder bilan grafikni o'zgartiring, 5 ta mashq.",
        turi: 'qollanma',
        manbalar: ['CB05'],
        tekshirilmagan: ["Mashq savollari Tayanch uchun yozilgan; muallif tekshiruvidan o'tmaganlari \"tekshirilmagan\" deb belgilangan."],
      },
      {
        qism: 'qollanma/math/birlik-aylana/',
        tayyor: true,
        nomi: 'Birlik aylana',
        tavsif: "Burchakni sudrab sin, cos va tan qiymatlarini ko'ring, gradus va radianni almashtiring, 5 ta mashq.",
        turi: 'qollanma',
        manbalar: ['CB05'],
        tekshirilmagan: ["Mashq savollari Tayanch uchun yozilgan; muallif tekshiruvidan o'tmaganlari \"tekshirilmagan\" deb belgilangan."],
      },
      {
        qism: 'qollanma/math/statistika/',
        tayyor: true,
        nomi: 'Statistika',
        tavsif: "Nuqtalarni sudrab o'rtacha, mediana va standart og'ish qanday o'zgarishini ko'ring, 5 ta mashq.",
        turi: 'qollanma',
        manbalar: ['CB05'],
        tekshirilmagan: ["Mashq savollari Tayanch uchun yozilgan; muallif tekshiruvidan o'tmaganlari \"tekshirilmagan\" deb belgilangan.", "Standart og'ish populatsiya formulasi bilan (n ga bo'linadi)."],
      },
    ],
  },
  {
    nomi: "Qo'llanmalar",
    sahifalar: [
      {
        qism: 'qollanma/strategiya/',
        tezOrada: true,
        nomi: 'Strategiya',
        tavsif: "Tayyorgarlikni qayerdan boshlash va qanday rejalashtirish: muallif tajribasi asosida.",
        turi: 'qollanma',
        manbalar: ['CB02'],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN],
      },
      {
        qism: 'qollanma/math-desmos/',
        tezOrada: true,
        nomi: 'Math va Desmos',
        tavsif: "Math bo'limida Desmos kalkulyatori va formulalarni qo'llash usullari.",
        turi: 'qollanma',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Imtihonda Desmos qanday berilishi haqida rasmiy manba hali jurnalga qo'shilmagan."],
      },
      {
        qism: 'qollanma/reading-writing/',
        tezOrada: true,
        nomi: 'Reading & Writing',
        tavsif: "Reading & Writing savol turlari bilan ishlash va xatolarni tahlil qilish.",
        turi: 'qollanma',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Savol turlari ro'yxati uchun rasmiy manba hali jurnalga qo'shilmagan."],
      },
      {
        qism: 'qollanma/vaqt/',
        tezOrada: true,
        nomi: 'Vaqt va retake',
        tavsif: "Imtihon vaqtini taqsimlash va qayta topshirishni rejalashtirish.",
        turi: 'qollanma',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Imtihon vaqti va qayta topshirish qoidalari uchun rasmiy manba hali jurnalga qo'shilmagan."],
      },
      {
        qism: 'mashq/kitoblar/',
        tezOrada: true,
        nomi: 'Kitoblar',
        tavsif: "Tayyorgarlik uchun o'qish ro'yxati. Faqat bepul yoki ochiq litsenziyali materiallar, havola bilan.",
        turi: 'qollanma',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Ro'yxatdagi har material litsenziyasi alohida tekshiriladi."],
      },
    ],
  },
  {
    nomi: 'Vositalar',
    sahifalar: [
      {
        qism: 'vosita/reja/',
        tayyor: true,
        nomi: 'Reja tuzgich',
        tavsif: "Imtihon sanasi va maqsad ballingizdan haftalik tayyorgarlik ro'yxati. Ma'lumot faqat shu brauzerda saqlanadi. Ball kafolatlanmaydi.",
        turi: 'vosita',
        manbalar: ['CB01', 'CB04'],
        tekshirilmagan: ["Haftalik vazifalar Tayanch tavsiyasi, rasmiy reja emas.", "Ball qadami (10) rasmiy sahifada yozilmagan: kiritish maydonida qulaylik uchun olingan."],
      },
      { qism: '', sahifasiz: true, tezOrada: true, nomi: 'Mini-drill', tavsif: '', turi: 'vosita', manbalar: [], tekshirilmagan: [] },
    ],
  },
  {
    nomi: 'Tayanch',
    sahifalar: [
      { qism: '', tashqi: '/uz/manbalar/', tayyor: true, nomi: 'Manbalar', tavsif: 'Saytdagi har fakt uchun rasmiy manbalar jurnali.', turi: 'vosita', manbalar: [], tekshirilmagan: [] },
    ],
  },
];

export const satSahifalar: SatSahifa[] = satGuruhlar.flatMap((g) => g.sahifalar);
/** SAT ichida o'z sahifasi bor bandlar */
export const satIchkiSahifalar = satSahifalar.filter((s) => s.qism && !s.sahifasiz && !s.tashqi);

export const turiNomi: Record<SatTuri | 'bolim-kirishi', string> = {
  'bolim-kirishi': "Bo'lim kirishi",
  mashq: 'Mashq',
  vosita: 'Vosita',
  qollanma: "Qo'llanma",
};
