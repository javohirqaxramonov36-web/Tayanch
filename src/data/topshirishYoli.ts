// "Topshirish yo'li" vositasi (2-qavat, Top Admission) ma'lumotlari.
// Manba: prototip (branch prototip-topshirish-yoli, prototip/topshirish-yoli.html). Matnlar o'zgartirilmagan.
// Har fakt faqat manbalar.ts dagi "rasmiy" ID bilan; aks holda build xato beradi.
// EYUF muddati deadline.ts dan olinadi (Toshkent vaqti, +05:00).
import { manbalar } from './manbalar';
import { deadlinelar } from './deadline';

export type SavolKalit = 'davlat' | 'daraja' | 'grant';
export interface Variant { id: string; nomi: string; izoh?: string }
import type { Javoblar } from '../lib/yollarniTanla';
export type { Javoblar };

export const SAVOLLAR: Record<SavolKalit, { sarlavha: string; yorliq: string; variantlar: Variant[] }> = {
  davlat: {
    sarlavha: "Qaysi davlatda o'qimoqchisiz?",
    yorliq: 'Davlat',
    variantlar: [
      { id: 'aqsh', nomi: 'AQSH' },
      { id: 'uk', nomi: 'Buyuk Britaniya' },
      { id: 'turkiya', nomi: 'Turkiya' },
      { id: 'vengriya', nomi: 'Vengriya' },
      { id: 'boshqa', nomi: 'Boshqa davlat', izoh: 'Kanada, Avstraliya, Koreya...' },
    ],
  },
  daraja: {
    sarlavha: 'Qaysi darajaga topshirasiz?',
    yorliq: 'Daraja',
    variantlar: [
      { id: 'bak', nomi: 'Bakalavriat' },
      { id: 'mag', nomi: 'Magistratura' },
    ],
  },
  grant: {
    sarlavha: 'Moliyaviy yordam kerakmi?',
    yorliq: 'Grant',
    variantlar: [
      { id: 'toliq', nomi: "Ha, to'liq", izoh: "O'zim to'lay olmayman" },
      { id: 'qisman', nomi: 'Qisman', izoh: "Bir qismini to'lay olaman" },
      { id: 'yoq', nomi: "Yo'q", izoh: "O'zim to'layman" },
    ],
  },
};

export const NAMUNA: Required<Javoblar> = { davlat: 'aqsh', daraja: 'bak', grant: 'toliq' };
export const KALIT = 'tayanch-topshirish-yoli';

export const IKONKA = {
  hujjat: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',
  qalpoq: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  bino: '<path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/>',
  yulduz: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
  yol: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  globus: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
} as const;

export interface Fakt {
  matn: string;
  manbaId: string;
  /** ISO muddat: shu bo'lsa karta qolgan kunni ko'rsatadi */
  muddat?: string;
  /** Tanlov yopilgach ko'rsatilmaydigan fakt (sana, kvota) */
  vaqtli?: boolean;
}
export interface Yol {
  id: string;
  nomi: string;
  ikonka: keyof typeof IKONKA;
  tavsif: string;
  qadamlar: string[];
  faktlar: Fakt[];
  tekshirilmagan: string[];
}

// EYUF muddati deadline.ts dan
const eyufMuddat = deadlinelar.find((d) => d.id === 'eyuf-2026-2-hujjat');
if (!eyufMuddat || !eyufMuddat.soat) throw new Error("topshirishYoli: deadline.ts da 'eyuf-2026-2-hujjat' (sana + soat) topilmadi");
const OYLAR = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
const [eY, eO, eK] = eyufMuddat.sana.split('-').map(Number);
const EYUF_MUDDAT_ISO = `${eyufMuddat.sana}T${eyufMuddat.soat}:00+05:00`;
const eyufYopilish = `${eK}-${OYLAR[eO - 1]}, ${eyufMuddat.soat}`;

export const YOLLAR: Record<string, Yol> = {
  commonapp: {
    id: 'commonapp', nomi: 'Common App', ikonka: 'hujjat',
    tavsif: "Bitta ariza bilan ko'plab AQSH kollejlariga topshirish platformasi.",
    qadamlar: ['Akkaunt va profil', "Kollejlar ro'yxatini tuzish", 'Esse va tavsiyanomalar', 'Har kollejga alohida yuborish'],
    faktlar: [
      { matn: 'Har yili 200 dan ortiq davlatdan talabalar foydalanadi.', manbaId: 'CA02' },
      { matn: "Xalqaro talaba ehtiyojga asoslangan fee waiver olishi mumkin (Profile bo'limida).", manbaId: 'CA02' },
      { matn: "Kollej fee waiver'ni hamma talabadan yoki faqat AQSH talabalaridan qabul qilishi mumkin: har kollej sahifasini tekshiring.", manbaId: 'CA01' },
      { matn: "Fee waiver huquqingizni maktab maslahatchisi (counselor) tasdiqlashi so'raladi.", manbaId: 'CA01' },
    ],
    tekshirilmagan: ["A'zo kollejlar soni", '2026–27 esse mavzulari', "Deadline'lar (har kollejda alohida)", 'Magistraturaga tegishliligi'],
  },
  coalition: {
    id: 'coalition', nomi: 'Coalition (Scoir orqali)', ikonka: 'yol',
    tavsif: "Coalition a'zo kollejlariga Scoir platformasi orqali ariza.",
    qadamlar: ['Bepul Scoir akkaunti', 'Profil va hujjatlar', "Coalition a'zo kollejni tanlash", 'Ariza yuborish'],
    faktlar: [
      { matn: 'Ariza Scoir platformasi orqali topshiriladi.', manbaId: 'CO01' },
      { matn: 'Scoir akkaunti har qanday talaba uchun bepul.', manbaId: 'CO01' },
      { matn: "Coalition'ning eski platformasi to'xtatilgan.", manbaId: 'CO01' },
    ],
    tekshirilmagan: ['Xalqaro talabalar uchun shartlar', "A'zo kollejlar ro'yxati"],
  },
  ucas: {
    id: 'ucas', nomi: 'UCAS', ikonka: 'hujjat',
    tavsif: 'Buyuk Britaniya bakalavriatiga ariza markazi.',
    qadamlar: ["UCAS'da ro'yxatdan o'tish", 'Kurslarni tanlash', 'Personal statement va tavsiyanoma', "To'lov va yuborish"],
    faktlar: [
      { matn: 'UCAS orqali bakalavriatda 5 tagacha kursga topshirish mumkin.', manbaId: 'UC01' },
      { matn: "Ariza to'lovi bor (miqdori shu sahifada yozilmagan).", manbaId: 'UC01' },
    ],
    tekshirilmagan: ["2027 sikli ariza to'lovi miqdori", "Deadline'lar", "Grant va stipendiyalar (universitetga bog'liq)"],
  },
  turkiye: {
    id: 'turkiye', nomi: 'Türkiye Bursları', ikonka: 'yulduz',
    tavsif: 'Turkiya hukumatining xalqaro talabalar uchun stipendiya dasturi.',
    qadamlar: ['Portalda ariza: 10-yanvar – 20-fevral', 'Baholash: mart–aprel', 'Intervyu: aprel–iyun', 'Natija: avgust boshi'],
    faktlar: [
      { matn: 'Umumiy ariza har yili 10-yanvar – 20-fevral.', manbaId: 'TB01' },
      { matn: 'Baholash mart–aprel, intervyu aprel–iyun, natija avgust boshida.', manbaId: 'TB01' },
      { matn: 'Ariza tbbs.turkiyeburslari.gov.tr portali orqali (rasmiy saytdagi "Application/Login").', manbaId: 'TB01' },
    ],
    tekshirilmagan: ['2027-yil e\'loni (taqvimda yil yozilmagan)', "Daraja bo'yicha talablar", 'Stipendiya qamrovi va miqdori'],
  },
  hungary: {
    id: 'hungary', nomi: 'Stipendium Hungaricum', ikonka: 'yulduz',
    tavsif: 'Vengriya hukumatining hamkor davlatlar uchun stipendiyasi.',
    qadamlar: ["Rasmiy e'lonni kuting", 'Dasturni tanlang', 'Onlayn ariza', 'Yuboruvchi tashkilot (sending partner) jarayoni'],
    faktlar: [
      { matn: "O'zbekiston hamkor davlatlar ro'yxatida bor.", manbaId: 'SH01' },
    ],
    tekshirilmagan: ["2027/28 e'loni va muddati (hali chiqmagan)", "O'zbekiston uchun ochiq darajalar", 'Sending partner talablari'],
  },
  eyuf: {
    id: 'eyuf', nomi: 'El-yurt umidi', ikonka: 'qalpoq',
    tavsif: "O'zbekiston davlat jamg'armasining xorijda o'qish uchun stipendiyasi.",
    qadamlar: ['Qabul xati va hujjatlar', 'el-yurt.uz/application orqali ariza', 'Tanlov bosqichlari', 'Natija'],
    faktlar: [
      { matn: `${eY}-yil 2-tanlov: hujjatlar 1–${eyufYopilish} gacha.`, manbaId: 'EY01', muddat: EYUF_MUDDAT_ISO, vaqtli: true },
      { matn: 'Kvota 290 ta: bakalavriat 101, magistratura 158, doktorantura 31.', manbaId: 'EY01', vaqtli: true },
      { matn: 'Ariza el-yurt.uz/application platformasi orqali.', manbaId: 'EY01' },
    ],
    tekshirilmagan: ['Yosh chegarasi', 'Til sertifikati talabi', 'Qabul xati sharti va tanlov bosqichlari'],
  },
  portal: {
    id: 'portal', nomi: "Universitetning o'z portali", ikonka: 'bino',
    tavsif: "Ko'p universitetlar arizani o'z saytida qabul qiladi.",
    qadamlar: ['"International admissions" sahifasini toping', "Talab va deadline'ni yozib oling", "Moliyaviy yordam sahifasini o'qing", 'Portalda ariza'],
    faktlar: [],
    tekshirilmagan: ["Hammasi universitetga bog'liq: har birini o'sha universitetning rasmiy sahifasida tekshiring"],
  },
  pathway: {
    id: 'pathway', nomi: 'Pathway dasturi', ikonka: 'globus',
    tavsif: 'Universitetga tayyorlov dasturi orqali kirish yo\'li (masalan Kaplan).',
    qadamlar: ['Dastur va hamkor universitetni tanlash', 'Dastur talablarini tekshirish', 'Ariza', "Dasturdan keyin universitetga o'tish"],
    faktlar: [],
    tekshirilmagan: ['Narx', 'Hamkor universitetlar', "O'tish shartlari"],
  },
};

export { yollarniTanla } from '../lib/yollarniTanla';

// Build vaqtidagi tekshiruv: har fakt rasmiy manbaga bog'langan bo'lishi shart.
for (const y of Object.values(YOLLAR)) {
  for (const f of y.faktlar) {
    const m = manbalar.find((x) => x.id === f.manbaId);
    if (!m) throw new Error(`topshirishYoli: "${y.nomi}" faktidagi manba ${f.manbaId} manbalar.ts da yo'q`);
    if (m.tekshiruvDarajasi !== 'rasmiy') throw new Error(`topshirishYoli: ${f.manbaId} rasmiy emas ("${y.nomi}")`);
  }
}

/** Brauzerga beriladigan manba ma'lumoti (faqat ishlatilganlari). */
export const ishlatilganManbalar = Object.fromEntries(
  [...new Set(Object.values(YOLLAR).flatMap((y) => y.faktlar.map((f) => f.manbaId)))].map((id) => {
    const m = manbalar.find((x) => x.id === id)!;
    return [id, { tashkilot: m.tashkilot, havola: m.havola, sana: m.tekshirilganSana }];
  }),
);

export const hammaTekshirilmagan = Object.values(YOLLAR).flatMap((y) => y.tekshirilmagan.map((t) => `${y.nomi}: ${t}`));
