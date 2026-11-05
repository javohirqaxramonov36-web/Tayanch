// SAT bo'limining sahifalari va sidebar guruhlari.
// Manzillar taklif (S1 vazifasi). Hamma sahifa hozircha "tez orada" va holati "qoralama".
// Tavsiflarda fakt yo'q: faqat sahifada nima bo'lishi yozilgan. Fakt qo'shilsa, manba ID si ham qo'shiladi.

export type SatTuri = 'mashq' | 'vosita' | 'qollanma';

export interface SatSahifa {
  /** /uz/sat/ dan keyingi qism, oxirida / bilan: "mashq/test/" */
  qism: string;
  nomi: string;
  tavsif: string;
  turi: SatTuri;
  manbalar: string[];
  tekshirilmagan: string[];
  /** true: sahifa o'z ekrani bilan qurilgan (dizayndagi interaktiv ekran) */
  tayyor?: boolean;
}

export interface SatGuruh {
  nomi: string;
  sahifalar: SatSahifa[];
}

const UMUMIY_TEKSHIRILMAGAN = "Sahifa mazmuni hali yozilmagan: hozircha faqat sarlavha va reja.";

export const satGuruhlar: SatGuruh[] = [
  {
    nomi: 'Mashq',
    sahifalar: [
      {
        qism: 'mashq/test/',
        tayyor: true,
        nomi: 'Test',
        tavsif: "Reading & Writing va Math bo'yicha qisqa mashq testlari. To'liq mock uchun rasmiy materiallarga havola beriladi.",
        turi: 'mashq',
        manbalar: ['CB01'],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Mashq savollari hali tuzilmagan; ular boshqa saytlardan ko'chirilmaydi."],
      },
      {
        qism: 'mashq/bank/',
        tayyor: true,
        nomi: 'Savol banki',
        tavsif: "Mavzu bo'yicha saralangan mashq savollari: Reading & Writing va Math.",
        turi: 'mashq',
        manbalar: ['CB02'],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Savollar manbasi va litsenziyasi hali belgilanmagan."],
      },
      {
        qism: 'vosita/natijalar/',
        tayyor: true,
        nomi: 'Mening natijalarim',
        tavsif: "Mashqlardagi javoblaringiz va xatolaringiz ro'yxati. Ma'lumot faqat shu brauzerda saqlanadi. Ball hisoblanmaydi.",
        turi: 'vosita',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN],
      },
    ],
  },
  {
    nomi: "O'qish",
    sahifalar: [
      {
        qism: 'mashq/kitoblar/',
        nomi: 'Kitoblar',
        tavsif: "Tayyorgarlik uchun o'qish ro'yxati. Faqat bepul yoki ochiq litsenziyali materiallar, havola bilan.",
        turi: 'mashq',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Ro'yxatdagi har material litsenziyasi alohida tekshiriladi."],
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
    nomi: "Qo'llanmalar",
    sahifalar: [
      {
        qism: 'qollanma/strategiya/',
        nomi: 'Strategiya',
        tavsif: "Tayyorgarlikni qayerdan boshlash va qanday rejalashtirish: muallif tajribasi asosida.",
        turi: 'qollanma',
        manbalar: ['CB02'],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN],
      },
      {
        qism: 'qollanma/math-desmos/',
        nomi: 'Math va Desmos',
        tavsif: "Math bo'limida Desmos kalkulyatori va formulalarni qo'llash usullari.",
        turi: 'qollanma',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Imtihonda Desmos qanday berilishi haqida rasmiy manba hali jurnalga qo'shilmagan."],
      },
      {
        qism: 'qollanma/reading-writing/',
        nomi: 'Reading & Writing',
        tavsif: "Reading & Writing savol turlari bilan ishlash va xatolarni tahlil qilish.",
        turi: 'qollanma',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Savol turlari ro'yxati uchun rasmiy manba hali jurnalga qo'shilmagan."],
      },
      {
        qism: 'qollanma/vaqt/',
        nomi: 'Vaqt va retake',
        tavsif: "Imtihon vaqtini taqsimlash va qayta topshirishni rejalashtirish.",
        turi: 'qollanma',
        manbalar: [],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN, "Imtihon vaqti va qayta topshirish qoidalari uchun rasmiy manba hali jurnalga qo'shilmagan."],
      },
    ],
  },
];

export const satSahifalar: SatSahifa[] = satGuruhlar.flatMap((g) => g.sahifalar);

export const turiNomi: Record<SatTuri | 'bolim-kirishi', string> = {
  'bolim-kirishi': "Bo'lim kirishi",
  mashq: 'Mashq',
  vosita: 'Vosita',
  qollanma: "Qo'llanma",
};
