// UI text of the IELTS Reading practice test (Uzbek). All strings live here as keys so a second
// language can be added later without touching the screens. Passage and question text is English
// and comes from the test JSON, not from this file.
import type { SavolTuriNomi } from '../../lib/ielts/reading/sxema.ts';

export const TUR_NOMI: Record<SavolTuriNomi, string> = {
  tfng: 'True / False / Not Given',
  mcq: 'Multiple choice',
  'matching-headings': 'Matching headings',
  'gap-fill': "Bo'sh joyni to'ldirish",
};

export const RM = {
  eslatma: 'Bu IELTS formatidagi mashq, rasmiy test emas.',

  // Controls shared by question types
  tanlang: 'Tanlang',
  javobYoz: 'Javobingiz',
  sozLimit: (n: number) => `Ko'pi bilan ${n} ta so'z`,
  ikkitaTanla: 'Ikkita variantni tanlang',
  ikkitadanKop: 'Faqat ikkita variantni tanlash mumkin. Avval bittasini olib tashlang.',
  javobsiz: 'Javob berilmagan',

  // Test screen
  yuklanmoqda: 'Test yuklanmoqda…',
  yuklashXato: "Testni yuklab bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.",
  qaytaUrin: 'Qayta urinish',
  faolYoq: "Faol test yo'q. Yangi testni boshlash sahifasidan boshlang.",
  boshlashSahifasi: 'Boshlash sahifasiga',
  testYoq: "Testlar hali qo'shilmagan. Yangi testlar tez orada.",
  qolganVaqt: 'Qolgan vaqt',
  vaqtElon: (daq: number) => `${daq} daqiqa qoldi.`,
  vaqtTugadi: 'Vaqt tugadi. Javoblaringiz tekshirilmoqda.',
  yakunlash: 'Yakunlash',
  chiqish: 'Testdan chiqish. Vaqt davom etadi.',
  tabMatn: 'Matn',
  tabSavollar: 'Savollar',
  tablar: "Ko'rinish",
  passage: (n: number) => `Passage ${n}`,
  passageTanlov: 'Passage tanlash',
  savollarPaneli: 'Savollar paneli',
  panelTugma: (berilgan: number, jami: number) => `Savollar: ${berilgan}/${jami}`,
  panelOch: "Savollar ro'yxatini ochish",
  raqamHolat: (n: number, berilgan: boolean, belgi: boolean) =>
    `${n}-savol, ${berilgan ? 'javob berilgan' : 'javob berilmagan'}${belgi ? ', belgilangan' : ''}`,
  belgila: (n: string) => `${n}-savolni qayta ko'rish uchun belgilash`,
  belgi: 'Belgi',
  afsona: { berilgan: 'Javob berilgan', belgi: 'Belgilangan', joriy: 'Javobsiz' },
  oldingi: 'Oldingi passage',
  keyingi: 'Keyingi passage',

  // Finish dialog
  yakunSarlavha: 'Testni yakunlaysizmi?',
  yakunJavobsiz: (n: number) => (n === 0 ? 'Hamma savolga javob berilgan.' : `Javobsiz savollar: ${n} ta.`),
  yakunBelgi: (n: number) => (n === 0 ? "Belgilangan savol yo'q." : `Belgilangan savollar: ${n} ta.`),
  yakunIzoh: "Yakunlagandan keyin javoblarni o'zgartirib bo'lmaydi.",
  yakunHa: 'Ha, yakunlash',
  yakunYoq: 'Testga qaytish',

  // Storage and second-tab warnings
  xotiraYoq:
    "Brauzer xotirasi o'chirilgan yoki to'lgan. Test davom etadi, lekin sahifani yangilasangiz yoki yopsangiz javoblar va natija saqlanmaydi.",
  natijaSaqlanmadi: "Natija brauzerda saqlanmadi. U faqat shu sahifa ochiq turganda ko'rinadi.",
  boshqaTab: "Bu test boshqa tabda ochiq. Javoblar aralashmasligi uchun bir vaqtda faqat bitta tabda ishlang.",
  shuTabda: 'Shu tabda davom ettirish',
  faqatOqish: "Bu tabda javoblarni o'zgartirib bo'lmaydi.",
  boshqaTabdaYakun: 'Test boshqa tabda yakunlandi.',
  natijagaOt: "Natijani ko'rish",

  // Start page
  boshla: 'Yangi test boshlash',
  davomEt: 'Testni davom ettirish',
  davomIzoh: (vaqt: string) => `Boshlangan testingiz bor. Qolgan vaqt: ${vaqt}.`,
  vaqtOtgan: "Boshlangan testingiz vaqti tugagan. Ochsangiz, saqlangan javoblar bilan natija hisoblanadi.",
  tasodif: 'Test random tanlanadi, oxirgi ishlangan test takrorlanmaydi.',
  bittaTest: "Hozircha bitta test bor, shuning uchun u takrorlanadi. Yangi testlar tez orada.",
  tarixSarlavha: 'Oxirgi urinishlar',
  tarixBosh: "Hali test ishlamagansiz.",
  tarixQator: (raw: number, jami: number, band: string) => `${raw}/${jami}, taxminiy band ${band}`,

  // Result
  natijaSarlavha: 'Reading natijasi',
  xomBall: "To'g'ri javoblar",
  taxminiyBand: 'Taxminiy band',
  bandPast: '2.0 dan past',
  bandIzoh:
    "Band taxminiy. Rasmiy manbada (ielts.org, IE04) Academic Reading uchun faqat to'rtta namunaviy nuqta bor: 15 → 5, 23 → 6, 30 → 7, 35 → 8. Qolgan chegaralar Tayanch taxmini. Haqiqiy testda chegara test versiyasiga qarab biroz o'zgaradi.",
  sarflangan: 'Sarflangan vaqt',
  daqiqa: (n: number) => `${n} daqiqa`,
  avtoYakun: 'Vaqt tugagani uchun test avtomatik yakunlandi.',
  turlar: "Savol turlari bo'yicha aniqlik",
  tahlil: 'Xatolar tahlili',
  tahlilZaif: (tur: string, t: number, j: number) => `Eng ko'p xato: ${tur} (${t}/${j} to'g'ri).`,
  tahlilJavobsiz: (n: number) => `${n} ta savol javobsiz qolgan. Javobsiz savol uchun ball olinmaydi, shuning uchun vaqt tugashidan oldin hammasini to'ldiring.`,
  tahlilPassage: (n: number, t: number, j: number) => `Passage ${n}: ${t}/${j} to'g'ri.`,
  tahlilYaxshi: "Hamma savol turida natija 60% dan yuqori.",
  tahlilXatoYoq: "Xato yo'q.",
  keyingiQadam: 'Keyingi qadam',
  savollar: 'Savollar va tushuntirish',
  filtrHammasi: 'Hammasi',
  filtrXato: 'Faqat xato va javobsiz',
  togri: "To'g'ri",
  xato: 'Xato',
  sizning: 'Sizning javobingiz',
  togriJavob: "To'g'ri javob",
  tushuntirish: 'Tushuntirish',
  dalil: 'Matndagi dalil',
  matndaKor: "Matnda ko'rish",
  paragraf: (p: string) => `${p}-paragraf`,
  yopish: 'Yopish',
  yangiTest: 'Yangi test boshlash',
  natijaYoq: "Bu urinish topilmadi. U boshqa brauzerda ishlangan yoki brauzer ma'lumotlari tozalangan bo'lishi mumkin.",
  natijaYuklanmoqda: 'Natija yuklanmoqda…',
  testTopilmadi: "Bu urinishning testi saytda topilmadi, shuning uchun savollar bo'yicha tahlilni ko'rsatib bo'lmaydi.",
  testXato: "Test matnini yuklab bo'lmadi, shuning uchun savollar bo'yicha tahlil ko'rinmayapti. Internetni tekshirib, sahifani yangilang.",
  holatTogri: "To'g'ri",
  holatXato: 'Xato',
  holatBosh: 'Javobsiz',
  filtr: "Savollarni saralash",
  xatoQolmadi: "Xato yoki javobsiz savol yo'q.",
  ulush: (t: number, j: number) => `${t}/${j} to'g'ri`,

  // Question blocks on the test screen
  guruhNomi: (oraliq: string, kop: boolean) => (kop ? `${oraliq}-savollar` : `${oraliq}-savol`),
  savolNomi: (n: string) => `${n}-savol.`,
  sarlavhalarRoyxati: "Sarlavhalar ro'yxati",
  faolTestYoq: "Boshlangan testingiz saytda topilmadi, shuning uchun u bekor qilindi. Yangi testni boshlashingiz mumkin.",
  testNomi: 'IELTS Reading test',
  ustki: 'IELTS · Reading',
  yakunlashQisqa: 'Yakunlash',
} as const;

// Text of the practice landing page and of the Reading start page.
export const MM = {
  mashqSarlavha: 'IELTS mashq testlari',
  mashqLead: "Haqiqiy test formatida vaqt bilan ishlang. Hozircha Reading ochiq, qolgan bo'limlar tayyorlanmoqda.",
  ustki: 'Mashq',
  ochiq: 'ochiq',
  tezOrada: 'Tez orada',
  boshlashga: 'Reading testga',
  bolimlar: "Bo'limlar",

  readingSarlavha: 'IELTS Reading Test',
  readingLead: '3 ta passage, 40 ta savol, IELTS formatida.',
  statVaqt: 'Vaqt',
  statVaqtQiymat: '60 daqiqa',
  statSavol: 'Savollar',
  statSavolQiymat: '40 savol',
  statMatn: 'Matnlar',
  statMatnQiymat: '3 matn',
  statUrinish: 'Ishlagan testlaringiz',
  passageSarlavha: 'Matnlar darajasi',
  passagelar: [
    { nomi: 'Passage 1', daraja: "Oson-O'rta" },
    { nomi: 'Passage 2', daraja: "O'rta" },
    { nomi: 'Passage 3', daraja: "O'rta-Qiyin" },
  ],
  ogohSarlavha: 'Boshlashdan oldin',
  ogoh: 'Test boshlangandan keyin 60 daqiqa vaqtingiz bor. Tayyorlaning va tinch joyda o\'tiring.',
  ogohVaqt: "Sahifani yopsangiz ham vaqt to'xtamaydi: qaytib ochsangiz, javoblar va qolgan vaqt tiklanadi.",
  imkoniyatSarlavha: 'Testda nima bor',
  imkoniyatlar: [
    { nomi: 'Turli savol turlari', matn: "True / False / Not Given, Multiple choice, Matching headings va bo'sh joyni to'ldirish." },
    { nomi: 'Avtomatik tekshirish', matn: "Yakunlaganingizda har savolga to'g'ri javob, qisqa tushuntirish va matndagi dalil ko'rsatiladi." },
    { nomi: 'Band score', matn: "40 dan nechta to'g'ri topganingizga qarab taxminiy Academic Reading band hisoblanadi." },
  ],
} as const;

// Next-step recommendations after a result. Only pages that exist are listed (base-less paths).
export const TAVSIYA = {
  tfng: {
    sarlavha: 'Reading darsi: True / False / Not Given',
    izoh: "Oxirgi testda bu savol turida xato ko'p bo'ldi.",
    manzil: '/uz/ielts/qollanma/reading/tfng/',
  },
  'matching-headings': {
    sarlavha: 'Reading darsi: Matching headings',
    izoh: "Oxirgi testda bu savol turida xato ko'p bo'ldi.",
    manzil: '/uz/ielts/qollanma/reading/sarlavhalar/',
  },
  mcq: {
    sarlavha: "Reading qo'llanmasini takrorlang",
    izoh: "Oxirgi testda Multiple choice savollarida xato ko'p bo'ldi.",
    manzil: '/uz/ielts/qollanma/reading/',
  },
  'gap-fill': {
    sarlavha: "Reading qo'llanmasini takrorlang",
    izoh: "Oxirgi testda bo'sh joyni to'ldirish savollarida xato ko'p bo'ldi.",
    manzil: '/uz/ielts/qollanma/reading/',
  },
  yangi: {
    sarlavha: 'Yangi Reading test',
    izoh: "Oxirgi testda hamma savol turida natija 60% dan yuqori.",
    manzil: '/uz/ielts/mashq/reading/',
  },
} as const;
