// 1-qavat · Tariflar bo'limi (BoshTariflar, /uz/hisob/obunalar/). Matn o'zbekcha.
// Pro narxi docs/tarif-qoidalari.md jadvalidan (plans.price_uzs 59 000, period_days 30, bir martalik; jonli
// 2026-11-11 dan). Bazada narx o'zgarsa, PRO_NARX ham qo'lda yangilanadi (muallif qarori, 2026-11-24).
// Imkoniyatlar shu jadvaldan: Free va Pro'da kvotalar hozircha cheklovsiz, Pro farqi kengaytirilgan analitika
// (/uz/sat/vosita/natijalar/: qiyinlik bo'yicha aniqlik va bir savolga ketgan vaqt), Max faol emas
// ("Tez orada", narxi belgilanmagan), AI Tutor hamma tarifda yopiq. Jadval o'zgarsa, shu fayl ham yangilanadi.

export type TarifKod = 'free' | 'pro' | 'max';

export interface TarifKarta {
  kod: TarifKod;
  nomi: string;
  tavsif: string;
  narx: string;
  /** Narx ostidagi qisqa izoh (davr). */
  narxIzoh?: string;
  /** "X dagi hamma narsa, plus…" qatori. Bepulda yo'q. */
  asos?: string;
  imkoniyatlar: string[];
  tavsiya?: boolean;
  cta: { matn: string; href: string } | null;
  ctaIzoh?: string;
}

/** Narxi hali belgilanmagan tarif (Max). */
export const NARX_YOQ = '—';
export const PRO_NARX = '59 000 soʻm';

export const tarifKartalar: TarifKarta[] = [
  {
    kod: 'free',
    nomi: 'Bepul',
    tavsif: 'Hisob ochmasdan ham boshlash mumkin.',
    narx: '0 soʻm',
    imkoniyatlar: [
      'SAT interaktiv darslari va xato daftari',
      'Savol banki, mashq sessiyasi va mock imtihon',
      'IELTS Reading testlari va natija tahlili',
      'Top Admission qoʻllanmalari',
      'El-Yurt Umidi IQ mashqlari',
    ],
    cta: { matn: 'Bepul boshlash', href: '/uz/#qavatlar' },
  },
  {
    kod: 'pro',
    nomi: 'Pro',
    tavsif: 'SAT boʻlimi uchun.',
    narx: PRO_NARX,
    narxIzoh: '30 kunga',
    asos: 'Bepuldagi hamma narsa, plus:',
    imkoniyatlar: [
      'SAT natijalarida Easy, Medium va Hard savollar boʻyicha aniqlik',
      'Har qiyinlikda bir savolga ketgan oʻrtacha vaqt',
      'Qaysi qiyinlikda vaqt yoki xato koʻpayishini koʻrasiz',
    ],
    tavsiya: true,
    cta: { matn: 'Pro tarifini koʻrish', href: '/uz/sat/hisob/obuna/' },
    ctaIzoh: 'Bir martalik toʻlov, avtomatik yangilanmaydi. Mashq bepulda ham cheklovsiz; Pro analitikani ochadi va loyihani qoʻllab-quvvatlaydi.',
  },
  {
    kod: 'max',
    nomi: 'Max',
    tavsif: 'SAT boʻlimi uchun.',
    narx: NARX_YOQ,
    asos: 'Proʼdagi hamma narsa, plus:',
    imkoniyatlar: ['Qoʻshimcha imkoniyatlar hali belgilanmagan'],
    cta: null,
    ctaIzoh: 'Tez orada',
  },
];

/** Katak: true = bor, false = yo'q, satr = matn. */
export type Katak = boolean | string;
export interface TaqqosQator { nomi: string; qiymat: Record<TarifKod, Katak> }
export interface TaqqosGuruh { nomi: string; qatorlar: TaqqosQator[] }

const TEZ = 'Tez orada';
// Max "Pro'dagi hamma narsa, plus": bepul va Pro'dagi qatorlar Max'da ham bor; faqat yangi imkoniyat "Tez orada".
const hamma = (q: Katak): Record<TarifKod, Katak> => ({ free: q, pro: q, max: q });

export const taqqosGuruhlar: TaqqosGuruh[] = [
  {
    nomi: 'SAT',
    qatorlar: [
      { nomi: 'Interaktiv darslar va xato daftari', qiymat: hamma(true) },
      { nomi: 'Savol banki va mashq sessiyasi', qiymat: hamma(true) },
      { nomi: 'Mock imtihon', qiymat: hamma(true) },
      { nomi: 'Haftalik reja', qiymat: hamma(true) },
      { nomi: 'Lugʻat kartalari', qiymat: hamma(true) },
      { nomi: 'Kengaytirilgan analitika', qiymat: { free: false, pro: true, max: true } },
      { nomi: 'AI Tutor', qiymat: { free: TEZ, pro: TEZ, max: TEZ } },
    ],
  },
  {
    nomi: 'Boshqa qavatlar (hammasi bepul)',
    qatorlar: [
      { nomi: 'IELTS Reading testlari', qiymat: hamma(true) },
      { nomi: 'Top Admission qoʻllanmalari', qiymat: hamma(true) },
      { nomi: 'El-Yurt Umidi IQ mashqlari', qiymat: hamma(true) },
    ],
  },
];

export interface FaqBand { savol: string; javob: string[]; havola?: { matn: string; href: string } }

// Ota-onalar uchun. Faktlar: /uz/qaytarish/ (qoralama, muddat belgilanmagan), TolovUsullari (inPAY),
// docs/tarif-qoidalari.md 1-qoida (obuna tugasa ma'lumot o'chirilmaydi).
export const tarifFaq: FaqBand[] = [
  {
    savol: 'Nima tekin?',
    javob: [
      'SAT darslari va mashqlari, IELTS Reading testlari, Top Admission qoʻllanmalari va El-Yurt Umidi IQ mashqlari bepul. Hisob ochish ham bepul.',
      'Hisobsiz ishlasangiz, natijalar faqat shu brauzerda saqlanadi. Hisob bilan ular boshqa qurilmada ham koʻrinadi.',
    ],
  },
  {
    savol: 'Qanday toʻlash mumkin?',
    javob: [
      'Toʻlov inPAY sahifasida boʻladi: Click, Payme, Uzcard yoki Humo. Karta maʼlumotlari Tayanch saytiga kiritilmaydi.',
      'Toʻlov bir martalik, avtomatik yangilanmaydi: muddat tugagach, kartadan pul oʻzi yechilmaydi.',
    ],
  },
  {
    savol: 'Pulni qaytarib olsa boʻladimi?',
    javob: [
      'Qaytarish muddati va shartlari hali belgilanmagan. Belgilangunga qadar har murojaat alohida koʻrib chiqiladi.',
      'Ikki marta yoki xato bilan yechilgan toʻlov har doim tekshiriladi va tasdiqlansa qaytariladi.',
    ],
    havola: { matn: 'Pulni qaytarish siyosati', href: '/uz/qaytarish/' },
  },
  {
    savol: 'Obuna tugasa, farzandimning ishlari oʻchib ketadimi?',
    javob: ['Yoʻq. Javoblar, xato daftari va reja joyida qoladi. Faqat pullik imkoniyatlar yopiladi.'],
  },
  {
    savol: 'Pullik tarif qaysi boʻlimlarda bor?',
    javob: ['Hozircha faqat SAT boʻlimida. IELTS, Top Admission va El-Yurt Umidi boʻlimlari bepul.'],
  },
];
