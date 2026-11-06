// Xato daftari takrorlashi (Leitner qutilari). Faqat shu brauzerda.
// Kalit tayanch:<bolim>-takrorlash, shakli: { versiya: 1, savollar: { [id]: { quti, keyingi, xatoSana } } }.
// Xato daftari (tayanch:<bolim>-xato-daftari) bu yerda faqat o'qiladi; javob darsSaqlash.javobniYoz orqali yoziladi,
// shuning uchun daftar shakli o'zgarmaydi ("bitta kalit = bitta shakl").
// Oraliqlar (kun) Tayanch tanlovi, rasmiy qoida emas.
import { oqi, yoz, xatolarniOqi, bugun } from './darsSaqlash';
import type { DarsBolim } from '../data/darsTurlar';

/** 1–4: takrorlanadi; 5: o'zlashtirildi */
export type Quti = 1 | 2 | 3 | 4 | 5;
export interface TakrorYozuv {
  quti: Quti;
  /** Keyingi takrorlash sanasi, YYYY-MM-DD (Toshkent) */
  keyingi: string;
  /** Daftardagi oxirgi xato sanasi: darsda yangi xato bo'lsa savol 1-qutiga qaytadi */
  xatoSana: string;
}
export interface TakrorHolat { versiya: 1; savollar: Record<string, TakrorYozuv> }

/** To'g'ri javobdan keyin keyingi qutigacha oraliq: 1→2 uchun 3 kun, 2→3 7, 3→4 14. 4-qutida to'g'ri = o'zlashtirildi. */
export const ORALIQ: Record<1 | 2 | 3, number> = { 1: 3, 2: 7, 3: 14 };
/** Yangi xato ertaga takrorlanadi */
export const BIRINCHI_ORALIQ = 1;

export const takrorKalit = (bolim: DarsBolim) => `tayanch:${bolim}-takrorlash`;

const SANA = /^\d{4}-\d{2}-\d{2}$/;
export function sanaQosh(sana: string, kun: number): string {
  const [y, m, d] = sana.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d) + kun * 86400000).toISOString().slice(0, 10);
}

function yozuvTogrimi(y: unknown): y is TakrorYozuv {
  if (!y || typeof y !== 'object') return false;
  const x = y as TakrorYozuv;
  return [1, 2, 3, 4, 5].includes(x.quti) && SANA.test(String(x.keyingi)) && SANA.test(String(x.xatoSana));
}

export function holatniOqi(bolim: DarsBolim): TakrorHolat {
  const x = oqi<TakrorHolat | null>(takrorKalit(bolim), null);
  const h: TakrorHolat = { versiya: 1, savollar: {} };
  if (x && x.versiya === 1 && x.savollar && typeof x.savollar === 'object') {
    for (const [id, y] of Object.entries(x.savollar)) if (yozuvTogrimi(y)) h.savollar[id] = y;
  }
  return h;
}

export const holatniYoz = (bolim: DarsBolim, h: TakrorHolat) => yoz(takrorKalit(bolim), h);

/**
 * Daftardagi xatolarni takrorlash holatiga qo'shadi.
 * Yangi xato yoki darsda qayta xato (daftar sanasi yozuvdagidan keyin) → 1-quti, keyingi = xato sanasi + 1 kun.
 * O'zgarish bo'lsa yozadi. Saqlash ishlamasa ham holatni qaytaradi.
 */
export function sinxronla(bolim: DarsBolim, mavjudId: Set<string>): TakrorHolat {
  const h = holatniOqi(bolim);
  let ozgardi = false;
  for (const x of xatolarniOqi(bolim)) {
    if (!x || typeof x.id !== 'string' || !mavjudId.has(x.id) || !SANA.test(String(x.sana))) continue;
    const y = h.savollar[x.id];
    if (!y || x.sana > y.xatoSana) {
      h.savollar[x.id] = { quti: 1, keyingi: sanaQosh(x.sana, BIRINCHI_ORALIQ), xatoSana: x.sana };
      ozgardi = true;
    }
  }
  if (ozgardi) holatniYoz(bolim, h);
  return h;
}

/** Javobdan keyingi yozuv (sof funksiya). */
export function javobdanKeyin(y: TakrorYozuv, togrimi: boolean, kun: string): TakrorYozuv {
  if (!togrimi) return { quti: 1, keyingi: sanaQosh(kun, BIRINCHI_ORALIQ), xatoSana: kun };
  if (y.quti >= 4) return { ...y, quti: 5, keyingi: kun };
  const q = y.quti as 1 | 2 | 3;
  return { ...y, quti: (q + 1) as Quti, keyingi: sanaQosh(kun, ORALIQ[q]) };
}

export interface Guruhlar { bugun: string[]; keyinroq: string[]; ozlashtirildi: string[] }

/** Savollarni guruhlarga ajratadi; bugungi va keyingilari sana bo'yicha (eng eskisi oldin). */
export function guruhla(h: TakrorHolat, kun = bugun()): Guruhlar {
  const e = Object.entries(h.savollar).sort((a, b) => a[1].keyingi.localeCompare(b[1].keyingi) || a[0].localeCompare(b[0]));
  return {
    bugun: e.filter(([, y]) => y.quti < 5 && y.keyingi <= kun).map(([id]) => id),
    keyinroq: e.filter(([, y]) => y.quti < 5 && y.keyingi > kun).map(([id]) => id),
    ozlashtirildi: e.filter(([, y]) => y.quti === 5).map(([id]) => id),
  };
}
