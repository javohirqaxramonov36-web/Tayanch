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
      {
        qism: 'vosita/reja/',
        tayyor: true,
        nomi: 'Reja tuzgich',
        tavsif: "Imtihon sanasi va maqsad ballingizdan haftalik tayyorgarlik ro'yxati. Ma'lumot faqat shu brauzerda saqlanadi. Ball kafolatlanmaydi.",
        turi: 'vosita',
        manbalar: ['CB01', 'CB04'],
        tekshirilmagan: ["Haftalik vazifalar Tayanch tavsiyasi, rasmiy reja emas.", "Ball qadami (10) rasmiy sahifada yozilmagan: kiritish maydonida qulaylik uchun olingan."],
      },
      {
        qism: 'vosita/takrorlash/',
        tayyor: true,
        nomi: 'Xato daftari: takrorlash',
        tavsif: "Darslarda xato qilingan mashqlarni oraliq bilan takrorlash: ertaga, keyin 3, 7 va 14 kundan so'ng. Ma'lumot faqat shu brauzerda. Ball hisoblanmaydi.",
        turi: 'vosita',
        manbalar: [],
        tekshirilmagan: ["Takrorlash oraliqlari Tayanch tanlovi, rasmiy tavsiya emas."],
      },
      {
        // SAT matni inglizcha (CLAUDE.md); qolgan bandlar hozircha o'zbekcha.
        qism: 'vosita/kalkulyator/',
        tayyor: true,
        nomi: 'Graph sketcher',
        tavsif: 'Sketch up to 3 lines or parabolas and see where they intersect. Links to the official Desmos calculators. Saved in this browser only.',
        turi: 'vosita',
        manbalar: ['CB12'],
        tekshirilmagan: ['How the Desmos calculator looks and behaves inside Bluebook was not checked: this page relies only on the College Board calculator policy (CB12).'],
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
    nomi: 'Reading & Writing darslari',
    sahifalar: [
      {
        qism: 'qollanma/reading-writing/xatoni-toping/',
        tayyor: true,
        nomi: 'Xatoni toping',
        tavsif: "Gapdagi xatoli so'z yoki belgini bosing, keyin tuzating: vergul, nuqtali vergul, ikki nuqta, ega va fe'l, zamon. 5 ta mashq.",
        turi: 'qollanma',
        manbalar: ['CB06'],
        tekshirilmagan: ["Mashq savollari Tayanch uchun yozilgan; muallif tekshiruvidan o'tmaganlari \"tekshirilmagan\" deb belgilangan."],
      },
      {
        qism: 'qollanma/reading-writing/dalil/',
        tayyor: true,
        nomi: 'Dalilni belgilang',
        tavsif: "Qisqa matnda da'voni qo'llab-quvvatlaydigan gapni belgilang va tuzoq gaplarni ajrating. 5 ta mashq.",
        turi: 'qollanma',
        manbalar: ['CB06'],
        tekshirilmagan: ["Matnlar va savollar Tayanch uchun yozilgan; muallif tekshiruvidan o'tmaganlari \"tekshirilmagan\" deb belgilangan."],
      },
      {
        qism: 'qollanma/reading-writing/otish-sozlari/',
        tayyor: true,
        nomi: "O'tish so'zlari",
        tavsif: "Ikki gap orasidagi munosabatni toping (qarama-qarshilik, sabab-natija, misol, davom) va mos o'tish so'zini tanlang. 5 ta mashq.",
        turi: 'qollanma',
        manbalar: ['CB06'],
        tekshirilmagan: ["Matnlar va savollar Tayanch uchun yozilgan; muallif tekshiruvidan o'tmaganlari \"tekshirilmagan\" deb belgilangan.", "Munosabat jadvali Tayanch tavsiyasi, rasmiy tasnif emas."],
      },
      {
        qism: 'qollanma/reading-writing/lugat-kontekstda/',
        tayyor: true,
        nomi: "Lug'at kontekstda",
        tavsif: "So'z ma'nosini gapdagi kontekst ishorasidan toping: ko'p ma'noli so'zlar, ohang va asosiy ma'no tuzog'i. 5 ta mashq.",
        turi: 'qollanma',
        manbalar: ['CB06'],
        tekshirilmagan: ["Matnlar va savollar Tayanch uchun yozilgan; muallif tekshiruvidan o'tmaganlari \"tekshirilmagan\" deb belgilangan."],
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
        manbalar: ['CB12'],
        tekshirilmagan: [UMUMIY_TEKSHIRILMAGAN],
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
