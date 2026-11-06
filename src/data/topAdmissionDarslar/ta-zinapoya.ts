// Top Admission: "Ariza zinapoyasi". 5 ta mashq: ariza qadamlari tartibi va har pog'onadagi rasmiy fakt.
// Faktlar: TB01 (Türkiye Bursları kalendari), UC01 (UCAS), CA02 (Common App, xalqaro talaba).
// Common App va UCAS tartibi Tayanch tavsiyasi (zinapoyalar.ts), rasmiy ketma-ketlik emas.
// Noto'g'ri variantda xato = shu javobga olib keladigan tipik xato.
// Ikkinchi usul: tekshiruv.ts (TB01 oylari bo'yicha saralash, `kerak` bog'lanishlari bo'yicha tartib, manba izohidagi son).
import type { DarsSavol } from './turlar';

export const taZinapoyaSavollar: DarsSavol[] = [
  {
    id: 'ta-zinapoya-1',
    modul: 'ta-zinapoya',
    mavzu: "Türkiye Bursları: bosqichlar tartibi",
    qiyinlik: 'oson',
    matn: "Türkiye Bursları kalendarida (TB01) intervyudan bevosita oldin qaysi bosqich turadi?",
    variantlar: [
      { matn: 'Portalda ariza', xato: "Oraliq bosqichni tashlab ketish: arizadan keyin darhol intervyu deb o'ylash" },
      { matn: 'Baholash' },
      { matn: 'Natija', xato: "Tartibni teskari o'qish: natijani intervyudan oldin qo'yish" },
      { matn: "Oldin hech narsa yo'q: intervyu birinchi bosqich", xato: "Intervyuni ariza bilan almashtirish" },
    ],
    togri: 1,
    yechim: "Kalendar: ariza (10-yanvar – 20-fevral) → baholash (mart–aprel) → intervyu (aprel–iyun) → natija (avgust boshi). Intervyudan oldin baholash turadi.",
    verified: false,
  },
  {
    id: 'ta-zinapoya-2',
    modul: 'ta-zinapoya',
    mavzu: 'Türkiye Bursları: ariza oynasi',
    qiyinlik: "o'rta",
    matn: "Bugun 1-mart. TB01 kalendariga ko'ra Türkiye Bursları umumiy arizasi hozir qaysi holatda?",
    variantlar: [
      { matn: 'Ochiq: ariza mart oxirigacha qabul qilinadi', xato: "Baholash oylarini ariza oylari deb olish" },
      { matn: "Yopilgan: oyna 20-fevralda tugagan, hozir baholash bosqichi" },
      { matn: 'Hali ochilmagan: 10-martni kutish kerak', xato: "Ochilish sanasidagi oyni adashtirish (yanvar o'rniga mart)" },
      { matn: 'Ochiq: ariza butun yil qabul qilinadi', xato: "Ariza oynasi borligini bilmaslik" },
    ],
    togri: 1,
    yechim: "Umumiy ariza 10-yanvardan 20-fevralgacha. 1-mart 20-fevraldan keyin: oyna yopilgan. Mart–aprel kalendarda baholash bosqichi.",
    verified: false,
  },
  {
    id: 'ta-zinapoya-3',
    modul: 'ta-zinapoya',
    mavzu: 'UCAS: kurslarni tanlash',
    qiyinlik: 'oson',
    matn: "UCAS zinapoyasining \"Kurslarni tanlash\" pog'onasida bakalavriat uchun nechta kursgacha tanlash mumkin (UC01)?",
    variantlar: [
      { matn: '1 ta', xato: "Bitta ariza = bitta kurs deb o'ylash" },
      { matn: '3 tagacha', xato: "Rasmiy sonni tekshirmasdan taxmin qilish" },
      { matn: '5 tagacha' },
      { matn: "Cheklov yo'q", xato: "Pog'onani chegarasiz deb o'ylash" },
    ],
    togri: 2,
    yechim: "UC01: bakalavriatda UCAS orqali 5 tagacha kursga topshiriladi. Shuning uchun ro'yxatni 5 ta kursga sig'diring.",
    verified: false,
  },
  {
    id: 'ta-zinapoya-4',
    modul: 'ta-zinapoya',
    mavzu: 'Common App: fee waiver',
    qiyinlik: "o'rta",
    matn: "Xalqaro talaba Common App fee waiver'ini zinapoyaning qaysi pog'onasida so'raydi (CA02)?",
    variantlar: [
      { matn: "1-pog'ona: akkaunt va Profile bo'limida" },
      { matn: "3-pog'ona: esse bilan birga", xato: "Waiver'ni esse yoki hujjat bilan bog'lash" },
      { matn: "4-pog'onadan keyin: ariza yuborilgach", xato: "To'lov masalasini oxirga qoldirish" },
      { matn: "Hech qaysi: xalqaro talaba waiver so'ray olmaydi", xato: "Xalqaro talabaga waiver yo'q deb o'ylash" },
    ],
    togri: 0,
    yechim: "CA02: xalqaro talaba ehtiyojga asoslangan Common App fee waiver olishi mumkin, u Profile bo'limida. Profile esa birinchi pog'ona. Kollej waiver'ni qabul qiladimi, har kollej sahifasida tekshiriladi (CA01).",
    verified: false,
  },
  {
    id: 'ta-zinapoya-5',
    modul: 'ta-zinapoya',
    mavzu: 'Common App: butun zinapoya',
    qiyinlik: 'qiyin',
    matn: "Common App zinapoyasi uchun qaysi tartib to'g'ri (pastdan tepaga)?",
    variantlar: [
      { matn: "Kollejlar ro'yxati → Akkaunt va Profile bo'limi → Esse va tavsiyanomalar → Har kollejga alohida yuborish", xato: "Akkauntsiz ro'yxat tuzish: ro'yxat akkauntga qo'shiladi" },
      { matn: "Akkaunt va Profile bo'limi → Esse va tavsiyanomalar → Kollejlar ro'yxati → Har kollejga alohida yuborish", xato: "Kollejni tanlamasdan hujjat tayyorlash" },
      { matn: "Akkaunt va Profile bo'limi → Kollejlar ro'yxati → Esse va tavsiyanomalar → Har kollejga alohida yuborish" },
      { matn: "Akkaunt va Profile bo'limi → Kollejlar ro'yxati → Har kollejga alohida yuborish → Esse va tavsiyanomalar", xato: "Yuborishni hujjatlardan oldin qo'yish" },
    ],
    togri: 2,
    yechim: "Har pog'ona oldingisiga tayanadi: akkaunt → ro'yxat (akkauntga qo'shiladi) → esse va tavsiyanoma (kollejlar aniq bo'lgach) → yuborish (hujjatlar tayyor bo'lgach).",
    verified: false,
  },
];
