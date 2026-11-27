// IELTS bo'limining sahifalari va yon panel guruhlari.
// Dizayn: Tayanch-IELTS-dizayn.md. "tez-orada" bandlar havola emas: kulrang ikonka va yorliq bilan matn.

export interface IeltsBand {
  nomi: string;
  tavsif: string;
  /** /uz/ielts/ dan keyingi qism; yo'q bo'lsa band "tez orada" */
  qism?: string;
  ikonka: string;
}

export const IKONKA = {
  listening: '<path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  reading: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  writing: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  speaking: '<path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"/>',
  general: '<path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"/>',
  reja: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  takror: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  namuna: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6"/>',
  kalkulyator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8"/>',
  tahlil: '<path d="M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3"/>',
  taymer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
} as const;

export const qollanmalar: IeltsBand[] = [
  { nomi: 'Listening', tavsif: "Savol turlari, oldindan o'qish, imlo tuzoqlari", qism: 'qollanma/listening/', ikonka: IKONKA.listening },
  { nomi: 'Reading', tavsif: 'Skimming, scanning, True/False/Not Given', qism: 'qollanma/reading/', ikonka: IKONKA.reading },
  { nomi: 'Writing Task 2', tavsif: "Mezonlar, insho tuzilmasi va o'zini tekshirish", qism: 'qollanma/writing-task-2/', ikonka: IKONKA.writing },
  { nomi: 'Speaking', tavsif: "Uch qism va o'zingni yozib eshitish", qism: 'qollanma/speaking/', ikonka: IKONKA.speaking },
];

export const asos: IeltsBand = {
  nomi: 'General English',
  tavsif: "B1 darajasidan B2'ga: grammatika va lug'at, IELTS'dan oldin.",
  ikonka: IKONKA.general,
};

/** Interaktiv darslar (standart: docs/interaktiv-dars-standarti.md) */
export const darslar: IeltsBand[] = [
  { nomi: 'True / False / Not Given', tavsif: "Dalil gapni topib, mos, zid yoki yo'qligini ajratish", qism: 'qollanma/reading/tfng/', ikonka: IKONKA.tahlil },
  { nomi: 'Matching headings', tavsif: 'Paragrafning asosiy fikriga sarlavha tanlash', qism: 'qollanma/reading/sarlavhalar/', ikonka: IKONKA.namuna },
];

/** Mavjud mashqlar. To‘liq Listening va Speaking testlari keyingi bosqichda. */
export const mashqlar: IeltsBand[] = [
  { nomi: 'Mashq testlari', tavsif: "Reading, Listening mini-mashqlari va Writing Task 2", qism: 'mashq/', ikonka: IKONKA.namuna },
  { nomi: 'Reading test', tavsif: '60 daqiqa, 40 savol, taxminiy band', qism: 'mashq/reading/', ikonka: IKONKA.reading },
  { nomi: 'Writing Task 2 mashqi', tavsif: 'Insho yozish va saqlangan ishni davom ettirish', qism: 'mashq/writing/', ikonka: IKONKA.writing },
  { nomi: 'Listening imlo', tavsif: "So'zni tinglab, to'g'ri yozish", qism: 'mashq/listening-imlo/', ikonka: IKONKA.listening },
  { nomi: 'Harf va raqam diktanti', tavsif: 'Ism, telefon, sana va narxni tinglab yozish', qism: 'mashq/listening-raqamlar/', ikonka: IKONKA.listening },
];

export const vositalar: IeltsBand[] = [
  { nomi: '30 kunlik reja', tavsif: "Uch savol asosida kunma-kun reja", qism: 'vosita/reja/', ikonka: IKONKA.reja },
  { nomi: 'Takrorlash', tavsif: 'Darslar va testlardagi xatolar, oraliq bilan', qism: 'vosita/takrorlash/', ikonka: IKONKA.takror },
  { nomi: 'Ball kalkulyatori', tavsif: "Listening, Reading va umumiy band", qism: 'vosita/kalkulyator/', ikonka: IKONKA.kalkulyator },
  { nomi: 'Writing taymeri', tavsif: "Task 1 va Task 2: vaqt va so'z hisoblagichi", qism: 'vosita/writing-taymer/', ikonka: IKONKA.taymer },
];

/** Ko'nikma sahifalari (2026-11-24, muallif qarori: IELTS ko'nikma bo'yicha tuziladi).
 *  Har ko'nikma: qo'llanma → darslar → mashqlar → natijalar. Vaqt IE01 (ielts.org) dan, bosh sahifa bilan bir xil. */
export type KonikmaId = 'listening' | 'reading' | 'writing' | 'speaking';
export interface Konikma {
  id: KonikmaId;
  nomi: string;
  ikonka: string;
  vaqt: string;
  /** Bir gap: bu sahifada nima bor */
  tavsif: string;
  qollanma: IeltsBand;
  darslar: IeltsBand[];
  mashqlar: IeltsBand[];
  natijalar: IeltsBand[];
}

const band = (nomi: string, tavsif: string, ikonka: string, qism?: string): IeltsBand => ({ nomi, tavsif, ikonka, qism });

export const konikmalar: Konikma[] = [
  {
    id: 'listening', nomi: 'Listening', ikonka: IKONKA.listening, vaqt: 'Taxminan 30 daqiqa',
    tavsif: "Savol turlari va imlo tuzoqlari, keyin tinglab yozish mashqlari.",
    qollanma: band("Listening qo'llanmasi", qollanmalar[0].tavsif, IKONKA.listening, 'qollanma/listening/'),
    darslar: [],
    mashqlar: [
      band('Listening imlo', "So'zni tinglab, to'g'ri yozish", IKONKA.listening, 'mashq/listening-imlo/'),
      band('Harf va raqam diktanti', 'Ism, telefon, sana va narxni tinglab yozish', IKONKA.listening, 'mashq/listening-raqamlar/'),
      band('Listening mock', "To'liq Listening testi", IKONKA.namuna),
    ],
    natijalar: [],
  },
  {
    id: 'reading', nomi: 'Reading', ikonka: IKONKA.reading, vaqt: "60 daqiqa (ko'chirish vaqti ichida)",
    tavsif: "Dalilni topishni o'rgan, savol turlarini darsda mashq qil, keyin to'liq testni ishla.",
    qollanma: band("Reading qo'llanmasi", qollanmalar[1].tavsif, IKONKA.reading, 'qollanma/reading/'),
    darslar,
    mashqlar: [
      band('Reading testi', '60 daqiqa, 40 savol, taxminiy band', IKONKA.reading, 'mashq/reading/'),
      band('True / False / Not Given', 'Kartani surib javob berish, har gapdan keyin izoh', IKONKA.tahlil, 'mashq/tfng/'),
    ],
    natijalar: [
      band('Reading natijalari', 'Shu brauzerda saqlangan urinishlar', IKONKA.tahlil, 'mashq/reading/#rb-tarix-h'),
      band('Xatolarni takrorlash', 'Darslar va testlardagi xatolar, oraliq bilan', IKONKA.takror, 'vosita/takrorlash/'),
    ],
  },
  {
    id: 'writing', nomi: 'Writing', ikonka: IKONKA.writing, vaqt: '60 daqiqa',
    tavsif: "Task 2 mezonlari va insho tuzilmasi, keyin vaqt bilan insho yozish.",
    qollanma: band("Task 2 qo'llanmasi", qollanmalar[2].tavsif, IKONKA.writing, 'qollanma/writing-task-2/'),
    darslar: [],
    mashqlar: [band('Task 2 insho mashqi', 'Insho yozish va saqlangan ishni davom ettirish', IKONKA.writing, 'mashq/writing/')],
    natijalar: [],
  },
  {
    id: 'speaking', nomi: 'Speaking', ikonka: IKONKA.speaking, vaqt: '11–14 daqiqa',
    tavsif: "Uch qism qanday o'tadi va o'zingni yozib eshitib tekshirish.",
    qollanma: band("Speaking qo'llanmasi", qollanmalar[3].tavsif, IKONKA.speaking, 'qollanma/speaking/'),
    darslar: [],
    mashqlar: [band('Gapirish mashqi', "Part 1–3 savollariga vaqt bilan javob, o'zingni yozib eshitish", IKONKA.speaking, 'qollanma/speaking/#mashq')],
    natijalar: [],
  },
];

export const konikmaI = (id: KonikmaId) => konikmalar.find((k) => k.id === id)!;
/** Ko'nikma sahifasi manzili (/uz/ielts/ dan keyingi qism) */
export const konikmaQism = (id: KonikmaId) => `${id}/`;

/** Barcha IELTS menyulari (ustki menyu, telefon paneli) shu ro'yxatdan: ko'nikma bo'yicha. */
export const ieltsGuruhlar: { nomi: string; bandlar: IeltsBand[] }[] = [
  ...konikmalar.map((k) => ({
    nomi: k.nomi,
    bandlar: [
      band(`${k.nomi} sahifasi`, k.tavsif, k.ikonka, konikmaQism(k.id)),
      { ...k.qollanma, nomi: "Qo'llanma" },
      ...k.darslar.map((d) => ({ ...d, nomi: `Dars: ${d.nomi}` })),
      ...k.mashqlar,
    ],
  })),
  { nomi: 'Reja va takrorlash', bandlar: [
    ...vositalar,
    band('Barcha mashqlar', "Hamma ko'nikmalar mashqlari bir joyda", IKONKA.namuna, 'mashq/'),
    asos,
  ] },
];

export const KALIT_IELTS_REJA = 'tayanch:ielts-reja';
/** Writing Task 2 insho mashqi qoralamasi (mavzu, matn, taymer, o'zini tekshirish belgilari) */
export const KALIT_IELTS_WRITING_T2 = 'tayanch:ielts-writing-t2';
