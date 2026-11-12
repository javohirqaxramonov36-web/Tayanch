// SAT kirishi (2-davra vizual, branch vizual-sat-2): brauzerdagi mavjud kalitlardan shaxsiy holat.
// Sof funksiya: localStorage ni o'qimaydi va yozmaydi, kirish sahifasidagi skript ma'lumotni beradi (node testida ham ishlaydi).
// Hech narsa yozilmaydi; yangi kalit yo'q.

export type SavolHolati = 'togri' | 'xato';

export interface DarsModulMalumot {
  /** darsTurlar modul kaliti, masalan "hajm" */
  modul: string;
  /** Darsdagi joriy savollar id lari (build vaqtida satDarslar dan) */
  idlar: string[];
}

export interface KirishKirish {
  /** tayanch:sat-dars-progress: { modul: { savolId: 'togri' | 'xato' } } */
  progress: unknown;
  /** satGuruhlar tartibida darslar */
  modullar: DarsModulMalumot[];
  /** tayanch:sat-javoblar massivining uzunligi (test javoblari) */
  testJavoblari: number;
  /** tayanch:sat-xato-daftari dagi yozuvlar soni */
  xatolar: number;
  /** Bugun takrorlanadigan savollar soni (takrorlash.ts guruhla().bugun) */
  bugunTakror: number;
  /** tayanch:sat-qayerdan-boshlash da kamida bitta javob bormi */
  yolSaqlangan: boolean;
}

export interface DarsHolati { modul: string; javob: number; jami: number }

export interface KirishHolati {
  /** Davom etilayotgan dars: javob bor, lekin hammasiga emas. Yo'q bo'lsa null */
  davom: DarsHolati | null;
  /** Har dars bo'yicha (javob 0 bo'lsa ham) */
  darslar: Record<string, DarsHolati>;
  bugunTakror: number;
  /** Test javoblari + dars javoblari */
  javoblar: number;
  xatolar: number;
  yolSaqlangan: boolean;
}

const sonmi = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) && n > 0 ? Math.floor(n) : 0);

export function kirishHolati(k: KirishKirish): KirishHolati {
  const p = k.progress && typeof k.progress === 'object' && !Array.isArray(k.progress) ? (k.progress as Record<string, unknown>) : {};
  const darslar: Record<string, DarsHolati> = {};
  let darsJavoblari = 0;
  let davom: DarsHolati | null = null;
  for (const m of k.modullar) {
    const yozuv = p[m.modul];
    const javoblar = yozuv && typeof yozuv === 'object' && !Array.isArray(yozuv) ? (yozuv as Record<string, unknown>) : {};
    // Faqat joriy savollar sanaladi: o'chirilgan yoki eski id progressni oshirmaydi.
    const javob = m.idlar.filter((id) => javoblar[id] === 'togri' || javoblar[id] === 'xato').length;
    const h = { modul: m.modul, javob, jami: m.idlar.length };
    darslar[m.modul] = h;
    darsJavoblari += javob;
    if (!davom && javob > 0 && javob < h.jami) davom = h;
  }
  return {
    davom,
    darslar,
    bugunTakror: sonmi(k.bugunTakror),
    javoblar: sonmi(k.testJavoblari) + darsJavoblari,
    xatolar: sonmi(k.xatolar),
    yolSaqlangan: k.yolSaqlangan === true,
  };
}

/** Ingliz tilida son + ot: 1 answer, 2 answers. */
export const sanoq = (n: number, birlik: string, koplik = `${birlik}s`) => `${n} ${n === 1 ? birlik : koplik}`;
