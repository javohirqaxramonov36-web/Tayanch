// Navigator (1-qavat) onboarding va yo'l xaritasi matni. O'zbekcha asosiy til.
// Boshqa til uchun shu kalitlar bilan obyekt qo'shiladi; yo'q kalit o'zbekchadan olinadi (zaxira).
// umumiyMatn.ts dagi `Til` turidan foydalanadi.
import type { Til } from './umumiyMatn.ts';
import type { Maqsad } from './navigatorSahifalar.ts';
import type { KunlikDaqiqa } from './yolXaritasiQoidalar.ts';

export type MuddatJavob = '15d' | '1m' | '3m' | 'date' | 'unknown';

const uz = {
  dialogSarlavha: "Yo'l xaritangizni tuzamiz",
  qadamHisob: (n: number, jami: number) => `${n}/${jami}-qadam`,
  orqaga: 'Orqaga',
  keyingi: 'Keyingi',
  saqlash: "Yo'l xaritasini ko'rish",
  otkazish: "O'tkazib yuborish",
  /** "Qayta tuzish" rejimida: javoblar o'zgarmay yopiladi */
  bekor: 'Bekor qilish',

  savol1: 'Qaysi maqsad ustida ishlayapsiz?',
  savol1Izoh: "Bir nechtasini tanlash mumkin. Bittasini asosiy qiling: reja ko'proq unga qaratiladi.",
  maqsadlar: {
    'top-admission': { nomi: 'Top Admission', izoh: 'Universitet tanlash, hujjat va ariza.' },
    sat: { nomi: 'SAT', izoh: 'Digital SAT: Reading & Writing va Math.' },
    ielts: { nomi: 'IELTS', izoh: "To'rt ko'nikma bo'yicha tayyorgarlik." },
    eyuf: { nomi: 'EYUF', izoh: 'El-yurt Umidi jamg\'armasi tanlovi.' },
  } as Record<Maqsad, { nomi: string; izoh: string }>,
  asosiy: 'Asosiy',
  asosiyQilish: 'Asosiy qilish',
  asosiyYorliq: (nom: string) => `${nom}ni asosiy maqsad qilish`,
  kamidaBitta: 'Davom etish uchun kamida bitta maqsadni tanlang.',

  savol2: 'Imtihon yoki muddatgacha qancha vaqt qoldi?',
  muddatlar: {
    '15d': '15 kun',
    '1m': '1 oy',
    '3m': '3 oy',
    date: 'Aniq sana',
    unknown: 'Hali aniq emas',
  } as Record<MuddatJavob, string>,
  sanaYorliq: 'Imtihon yoki muddat sanasi',
  sanaKerak: 'Sanani tanlang.',
  sanaOtgan: "Sana bugundan oldin bo'lmasligi kerak. Bugungi yoki keyingi sanani tanlang.",

  savol3: 'Kuniga qancha vaqt ajrata olasiz?',
  kunliklar: {
    15: { nomi: '15 daqiqa', izoh: 'Tezkor mashqlar' },
    30: { nomi: '30 daqiqa', izoh: "Bitta bo'lim" },
    60: { nomi: '60 daqiqa', izoh: "To'liq mashq" },
    120: { nomi: '120+ daqiqa', izoh: 'Intensiv' },
  } as Record<KunlikDaqiqa, { nomi: string; izoh: string }>,

  tasdiqSarlavha: "Yo'l xaritasi almashtirilsinmi?",
  tasdiqMatn: "Eski javoblaringiz va yo'l xaritangiz yangisi bilan almashadi.",
  tasdiqHa: 'Ha, almashtirish',

  salom: { tong: 'Xayrli tong', kun: 'Xayrli kun', kech: 'Xayrli kech' },
  bugunDaqiqa: (n: number) => `Bugun ${n} daqiqa mashq qiling`,

  keyingiQadam: 'Keyingi qadam',
  boshlash: 'Boshlash',
  yolXaritasi: "Sizning yo'l xaritangiz",
  yolXaritasiRoyxat: "Yo'l xaritasi qadamlari",
  qaytaTuzish: "Yo'l xaritamni qayta tuzish",
  tezOrada: 'Tez orada',
  hammasiTezOrada: "Bu yo'nalishdagi sahifalar hali tayyorlanmoqda.",
  qolganKun: (n: number) => (n === 0 ? 'Muddat bugun' : `Muddatgacha ${n} kun`),
  sanaOtibKetdi: "Belgilangan sana o'tib ketdi. Yo'l xaritasini qayta tuzing.",
  umumiyIzoh: "Bu umumiy boshlang'ich reja. \"Yo'l xaritamni qayta tuzish\" tugmasi bilan 3 ta savolga javob bersangiz, reja sizga moslashadi.",
  asosiyMaqsad: (nom: string) => `Asosiy maqsad: ${nom}`,
  qoidaIzoh: "Reja oddiy qoidalar asosida tuziladi va faqat yo'nalish beradi. Natija kafolatlanmaydi.",
  saqlanmadi: "Brauzer xotirasi yopiq: javoblar saqlanmaydi, sahifa yangilansa reja yo'qoladi.",
  noscript: "Shaxsiy yo'l xaritasi uchun JavaScript kerak.",
};

export type NavigatorMatn = typeof uz;

// Inglizcha va boshqa tillar: kalit bo'yicha qisman to'ldiriladi, qolgani o'zbekchadan.
// Hozircha bo'sh: Navigator 1-qavat, matni o'zbekcha (CLAUDE.md).
const tillar: Partial<Record<Til, Partial<NavigatorMatn>>> = { uz, en: {} };

export function navigatorMatni(til: Til = 'uz'): NavigatorMatn {
  return { ...uz, ...(tillar[til] ?? {}) };
}
