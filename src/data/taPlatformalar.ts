// "Platformalar xaritasi" (2-qavat, Top Admission): qaysi davlatga qaysi platforma orqali topshiriladi.
// Ariza platformalari faktlari topshirishYoli.ts dagi YOLLAR dan olinadi (qayta yozilmaydi).
// Yordamchi saytlar faktlari manbalar.ts dagi CS01, BF01, ID04, KI01, GR01 (rasmiy, 2026-11-19).
// Davlat id'lari Topshirish yo'li savoli bilan bir xil (SAVOLLAR.davlat), filtr shu kalitni o'qiydi.
import { manbalar } from './manbalar';
import { SAVOLLAR, YOLLAR, type Fakt } from './topshirishYoli';

export type DavlatId = 'aqsh' | 'uk' | 'turkiya' | 'vengriya' | 'boshqa';
export const DAVLATLAR = SAVOLLAR.davlat.variantlar as { id: DavlatId; nomi: string }[];

export interface Platforma {
  id: string;
  nomi: string;
  guruh: 'ariza' | 'yordamchi';
  /** 'hamma' = davlatga bog'liq emas */
  davlatlar: DavlatId[] | 'hamma';
  /** Kartadagi qisqa davlat yozuvi */
  qayerga: string;
  tavsif: string;
  /** Rasmiy sayt (havola, fakt emas) */
  sayt?: { matn: string; href: string };
  faktlar: Fakt[];
  /** Tayanch ichidagi tegishli sahifa (/uz/ dan boshlanadi) */
  tayanch?: { matn: string; href: string };
}

/** Topshirish yo'lidan: faqat doimiy faktlar (vaqtli sana va kvotalar bu yerda ko'rsatilmaydi), ko'pi bilan 2 ta. */
const yolFaktlari = (id: keyof typeof YOLLAR): Fakt[] => YOLLAR[id].faktlar.filter((f) => !f.vaqtli).slice(0, 2);

const ZINAPOYA = { matn: 'Ariza zinapoyasi', href: '/uz/top-admission/qollanma/ariza-zinapoyasi/' };

export const PLATFORMALAR: Platforma[] = [
  {
    id: 'commonapp', nomi: 'Common App', guruh: 'ariza', davlatlar: ['aqsh'], qayerga: 'AQSH',
    tavsif: YOLLAR.commonapp.tavsif,
    sayt: { matn: 'commonapp.org', href: 'https://www.commonapp.org/' },
    faktlar: yolFaktlari('commonapp'),
    tayanch: ZINAPOYA,
  },
  {
    id: 'coalition', nomi: 'Coalition (Scoir orqali)', guruh: 'ariza', davlatlar: ['aqsh'], qayerga: 'AQSH',
    tavsif: YOLLAR.coalition.tavsif,
    sayt: { matn: 'scoir.com', href: 'https://www.scoir.com/' },
    faktlar: yolFaktlari('coalition'),
  },
  {
    id: 'ucas', nomi: 'UCAS', guruh: 'ariza', davlatlar: ['uk'], qayerga: 'Buyuk Britaniya',
    tavsif: YOLLAR.ucas.tavsif,
    sayt: { matn: 'ucas.com', href: 'https://www.ucas.com/' },
    faktlar: yolFaktlari('ucas'),
    tayanch: ZINAPOYA,
  },
  {
    id: 'turkiye', nomi: 'Türkiye Bursları', guruh: 'ariza', davlatlar: ['turkiya'], qayerga: 'Turkiya',
    tavsif: YOLLAR.turkiye.tavsif,
    sayt: { matn: 'turkiyeburslari.gov.tr', href: 'https://www.turkiyeburslari.gov.tr/' },
    faktlar: yolFaktlari('turkiye'),
    tayanch: { matn: 'Türkiye Bursları sahifasi', href: '/uz/top-admission/turkiye-burslari/' },
  },
  {
    id: 'hungary', nomi: 'Stipendium Hungaricum', guruh: 'ariza', davlatlar: ['vengriya'], qayerga: 'Vengriya',
    tavsif: YOLLAR.hungary.tavsif,
    sayt: { matn: 'stipendiumhungaricum.hu', href: 'https://stipendiumhungaricum.hu/' },
    faktlar: yolFaktlari('hungary'),
  },
  {
    id: 'eyuf', nomi: 'El-yurt umidi', guruh: 'ariza', davlatlar: 'hamma', qayerga: 'Xorijdagi universitet',
    tavsif: YOLLAR.eyuf.tavsif,
    sayt: { matn: 'el-yurt.uz', href: 'https://el-yurt.uz/' },
    faktlar: yolFaktlari('eyuf'),
  },
  {
    id: 'portal', nomi: "Universitetning o'z portali", guruh: 'ariza', davlatlar: 'hamma', qayerga: 'Har qanday davlat',
    tavsif: YOLLAR.portal.tavsif,
    faktlar: [],
  },
  {
    id: 'pathway', nomi: 'Pathway dasturi (Kaplan misolida)', guruh: 'ariza', davlatlar: ['aqsh', 'uk', 'boshqa'], qayerga: 'AQSH, Buyuk Britaniya, Kanada, Avstraliya, Yangi Zelandiya',
    tavsif: "Universitetga to'g'ridan-to'g'ri emas, tayyorlov kursi orqali kirish yo'li. Kaplan shunday tashkilotlardan biri.",
    sayt: { matn: 'kaplanpathways.com', href: 'https://www.kaplanpathways.com/' },
    faktlar: [
      { matn: 'Kaplan bakalavriat, magistratura, ingliz tili va doktorantura uchun tayyorlov kurslarini (pathway course) taklif qiladi.', manbaId: 'KI01' },
      { matn: "Yo'nalishlari: AQSH, Kanada, Buyuk Britaniya, Avstraliya va Yangi Zelandiya.", manbaId: 'KI01' },
    ],
  },
  {
    id: 'css', nomi: 'CSS Profile (College Board)', guruh: 'yordamchi', davlatlar: ['aqsh'], qayerga: 'AQSH kollejlari',
    tavsif: "Arizaning o'zi emas: kollej moliyaviy yordam (grant) uchun so'raydigan oila daromadi shakli.",
    sayt: { matn: 'cssprofile.collegeboard.org', href: 'https://cssprofile.collegeboard.org/international-students' },
    faktlar: [
      { matn: "Ko'p kollejlar xalqaro talabalarga o'z moliyaviy yordamini beradi; kollejingiz xalqaro talabadan CSS Profile qabul qilishini ishtirokchilar ro'yxatida tekshiring.", manbaId: 'CS01' },
      { matn: "Daromad o'z valyutangizda kiritiladi.", manbaId: 'CS01' },
    ],
  },
  {
    id: 'bigfuture', nomi: 'BigFuture (College Board)', guruh: 'yordamchi', davlatlar: ['aqsh'], qayerga: 'AQSH kollejlari',
    tavsif: "Kollej va stipendiya qidirish sayti: ro'yxat tuzishdan oldin ishlatiladi.",
    sayt: { matn: 'bigfuture.collegeboard.org', href: 'https://bigfuture.collegeboard.org/' },
    faktlar: [
      { matn: "Saytda College Search va Scholarship Search bo'limlari bor.", manbaId: 'BF01' },
    ],
  },
  {
    id: 'idp', nomi: 'IDP', guruh: 'yordamchi', davlatlar: ['uk', 'aqsh', 'boshqa'], qayerga: 'Buyuk Britaniya, AQSH, Kanada, Avstraliya, Yangi Zelandiya, Irlandiya',
    tavsif: "O'qishga kirish agentligi va IELTS hammuallifi: kurs tanlash, ariza va vizada yordam beradi.",
    sayt: { matn: 'idp.com/uzbekistan', href: 'https://www.idp.com/uzbekistan/' },
    faktlar: [
      { matn: "O'zbekiston sahifasida talaba va ota-onalar uchun maslahat bepul deb yozilgan.", manbaId: 'ID04' },
      { matn: 'IDP IELTS imtihonining hammuallifi (co-owner).', manbaId: 'ID04' },
    ],
    tayanch: { matn: "IELTS bo'limi", href: '/uz/ielts/' },
  },
  {
    id: 'grantlar', nomi: 'Grantlar.uz', guruh: 'yordamchi', davlatlar: 'hamma', qayerga: "Ko'p davlatlar va onlayn",
    tavsif: "O'zbekcha grant va tanlov e'lonlari sayti. Mustaqil sayt: e'lonni grant beruvchining rasmiy sahifasida tekshiring.",
    sayt: { matn: 'grantlar.uz', href: 'https://grantlar.uz/' },
    faktlar: [
      { matn: "Bakalavriat, magistratura va doktorantura grantlari davlat va soha bo'yicha saralanadi; e'lonlar ro'yxatdan o'tmasdan ko'rinadi.", manbaId: 'GR01' },
      { matn: "Pullik \"Premium obuna\" ham bor (tarkibi va narxi bosh sahifada yozilmagan).", manbaId: 'GR01' },
    ],
  },
];

export const TEKSHIRILMAGAN = [
  "Common App va Coalition'dan AQSHdan tashqari qaysi universitetlar foydalanishi",
  "CSS Profile: xalqaro talaba uchun to'lov va fee waiver (CS01 sahifasida yozilmagan)",
  'BigFuture to\'liq bepulligi (BF01 da aniq yozilmagan)',
  "IDP va Kaplan xizmati uchun universitetlar haq to'lashi (rasmiy sahifalarda yozilmagan)",
  'Kaplan pathway kurslari narxi va universitetga o\'tish shartlari',
  'Grantlar.uz Premium obunasi tarkibi va narxi',
];

// Build vaqtidagi tekshiruv: har fakt rasmiy manbaga bog'langan bo'lishi shart.
for (const p of PLATFORMALAR) {
  for (const f of p.faktlar) {
    const m = manbalar.find((x) => x.id === f.manbaId);
    if (!m) throw new Error(`taPlatformalar: "${p.nomi}" faktidagi manba ${f.manbaId} manbalar.ts da yo'q`);
    if (m.tekshiruvDarajasi !== 'rasmiy') throw new Error(`taPlatformalar: ${f.manbaId} rasmiy emas ("${p.nomi}")`);
  }
}

export const platformaManbalari = [...new Set(PLATFORMALAR.flatMap((p) => p.faktlar.map((f) => f.manbaId)))];
