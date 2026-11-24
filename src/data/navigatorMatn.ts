// Navigator (1-qavat) onboarding va yo'l xaritasi matni. O'zbekcha asosiy til.
// Boshqa til uchun shu kalitlar bilan obyekt qo'shiladi; yo'q kalit o'zbekchadan olinadi (zaxira).
// umumiyMatn.ts dagi `Til` turidan foydalanadi.
import type { Til } from './umumiyMatn.ts';
import type { Maqsad } from './navigatorSahifalar.ts';
import type { KunlikDaqiqa, Surat } from './yolXaritasiQoidalar.ts';

export type MuddatJavob = '15d' | '1m' | '3m' | 'date' | 'unknown';

const uz = {
  dialogSarlavha: "Yoʻl xaritangizni tuzamiz",
  qadamHisob: (n: number, jami: number) => `${n}/${jami}-qadam`,
  orqaga: 'Orqaga',
  keyingi: 'Keyingi',
  saqlash: "Yoʻl xaritasini koʻrish",
  otkazish: "Oʻtkazib yuborish",
  /** "Qayta tuzish" rejimida: javoblar o'zgarmay yopiladi */
  bekor: 'Bekor qilish',

  savol1: 'Qaysi maqsad ustida ishlayapsiz?',
  savol1Izoh: "Bir nechtasini tanlash mumkin. Bittasini asosiy qiling: reja koʻproq unga qaratiladi.",
  maqsadlar: {
    'top-admission': { nomi: 'Top Admission', izoh: 'Universitet tanlash, hujjat va ariza.' },
    sat: { nomi: 'SAT', izoh: 'Digital SAT: Reading & Writing va Math.' },
    ielts: { nomi: 'IELTS', izoh: "Toʻrt koʻnikma boʻyicha tayyorgarlik." },
    eyuf: { nomi: 'EYUF', izoh: 'El-yurt Umidi jamgʻarmasi tanlovi.' },
  } as Record<Maqsad, { nomi: string; izoh: string }>,
  asosiy: 'Asosiy',
  asosiyQilish: 'Asosiy qilish',
  asosiyYorliq: (nom: string) => `${nom}ni asosiy maqsad qilish`,
  kamidaBitta: 'Davom etish uchun kamida bitta maqsadni tanlang.',

  savol2: 'Imtihon yoki muddatgacha qancha vaqt qoldi?',
  muddatlar: {
    '15d': '15 kun',
    '1m': '1 oy',
    '3m': "3 oy yoki koʻproq",
    date: 'Aniq sana',
    unknown: 'Hali aniq emas',
  } as Record<MuddatJavob, string>,
  muddatYordam: "6 oy yoki undan uzoq boʻlsa, \"Aniq sana\"ni tanlang: reja sanaga qarab tuziladi.",
  sanaYorliq: 'Imtihon yoki muddat sanasi',
  sanaKerak: 'Sanani tanlang.',
  sanaOtgan: "Sana bugundan oldin boʻlmasligi kerak. Bugungi yoki keyingi sanani tanlang.",

  savol3: 'Kuniga qancha vaqt ajrata olasiz?',
  kunliklar: {
    15: { nomi: '15 daqiqa', izoh: 'Tezkor mashqlar' },
    30: { nomi: '30 daqiqa', izoh: "Bitta boʻlim" },
    60: { nomi: '60 daqiqa', izoh: "Toʻliq mashq" },
    120: { nomi: '120+ daqiqa', izoh: 'Intensiv' },
  } as Record<KunlikDaqiqa, { nomi: string; izoh: string }>,

  tasdiqSarlavha: "Yoʻl xaritasi almashtirilsinmi?",
  tasdiqMatn: "Eski javoblaringiz va yoʻl xaritangiz yangisi bilan almashadi.",
  tasdiqHa: 'Ha, almashtirish',

  salom: { tong: 'Xayrli tong', kun: 'Xayrli kun', kech: 'Xayrli kech' },
  bugunDaqiqa: (n: number) => `Bugun ${n} daqiqa mashq qiling`,

  keyingiQadam: 'Keyingi qadam',
  boshlash: 'Boshlash',
  yolXaritasi: "Sizning yoʻl xaritangiz",
  yolXaritasiRoyxat: "Yoʻl xaritasi qadamlari",
  qaytaTuzish: "Yoʻl xaritamni qayta tuzish",
  tezOrada: 'Tez orada',
  /** NavYol holat yorliqlari: holat rang bilan yolg'iz aytilmaydi */
  holatHozir: 'Hozir',
  holatKeyin: 'Keyin',
  hammasiTezOrada: "Bu yoʻnalishdagi sahifalar hali tayyorlanmoqda.",
  /** Aniq sana bo'lmaganda natija chipida sur'at nomi */
  suratNomi: { intensiv: 'Shoshilinch reja · 15 kun', oy: 'Bir oylik reja', uzoq: 'Uzoq muddatli reja', umumiy: 'Umumiy reja' } as Record<Surat, string>,
  qolganKun: (n: number) => (n === 0 ? 'Muddat bugun' : `Muddatgacha ${n} kun`),
  sanaOtibKetdi: "Belgilangan sana oʻtib ketdi. Yoʻl xaritasini qayta tuzing.",
  muddatNomalumIzoh: "Muddat aniqlansa, rejani qayta tuzing: qadamlar surʼatga moslashadi.",
  umumiyIzoh: "Bu umumiy boshlangʻich reja. \"Yoʻl xaritamni qayta tuzish\" tugmasi bilan 3 ta savolga javob bersangiz, reja sizga moslashadi.",
  asosiyMaqsad: (nom: string) => `Asosiy maqsad: ${nom}`,
  qoidaIzoh: "Reja oddiy qoidalar asosida tuziladi va faqat yoʻnalish beradi. Natija kafolatlanmaydi.",
  saqlanmadi: "Brauzer xotirasi yopiq: javoblar saqlanmaydi, sahifa yangilansa reja yoʻqoladi.",
  noscript: "Shaxsiy yoʻl xaritasi uchun JavaScript kerak.",
};

export type NavigatorMatn = typeof uz;

// Inglizcha va boshqa tillar: kalit bo'yicha qisman to'ldiriladi, qolgani o'zbekchadan.
// Hozircha bo'sh: Navigator 1-qavat, matni o'zbekcha (CLAUDE.md).
const tillar: Partial<Record<Til, Partial<NavigatorMatn>>> = { uz, en: {} };

export function navigatorMatni(til: Til = 'uz'): NavigatorMatn {
  return { ...uz, ...(tillar[til] ?? {}) };
}
