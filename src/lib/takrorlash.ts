// Xato daftari takrorlashi (Leitner qutilari). Faqat shu brauzerda.
// Kalit tayanch:<bolim>-takrorlash, shakli: { versiya: 1, savollar: { [id]: { quti, keyingi, xatoSana } } }.
// Xato daftari (tayanch:<bolim>-xato-daftari) bu yerda faqat o'qiladi; javob darsSaqlash.javobniYoz orqali yoziladi,
// shuning uchun daftar shakli o'zgarmaydi ("bitta kalit = bitta shakl").
// Oraliqlar (kun) Tayanch tanlovi, rasmiy qoida emas; qoida o'zi leitner.ts da (SAT lug'ati bilan umumiy).
import { oqi, yoz, xatolarniOqi, bugun } from './darsSaqlash';
import type { DarsBolim } from '../data/darsTurlar';
import { ORALIQ, BIRINCHI_ORALIQ, sanaQosh, keyingiQuti, type Quti } from './leitner';

export { ORALIQ, BIRINCHI_ORALIQ, sanaQosh, type Quti };
export interface TakrorYozuv {
  quti: Quti;
  /** Keyingi takrorlash sanasi, YYYY-MM-DD (Toshkent) */
  keyingi: string;
  /** Daftardagi oxirgi xato sanasi: darsda yangi xato bo'lsa savol 1-qutiga qaytadi */
  xatoSana: string;
}
export interface TakrorHolat { versiya: 1; savollar: Record<string, TakrorYozuv> }

export const takrorKalit = (bolim: DarsBolim) => `tayanch:${bolim}-takrorlash`;

const SANA = /^\d{4}-\d{2}-\d{2}$/;

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
  const { h, ozgardi } = xatolarniQosh(holatniOqi(bolim), xatolarniOqi(bolim), mavjudId);
  if (ozgardi) holatniYoz(bolim, h);
  return h;
}

/** sinxronla ning sof qismi: hech narsa yozmaydi (masalan, SAT kirishidagi "N to review today" hisobi uchun). */
export function xatolarniQosh(h: TakrorHolat, xatolar: unknown[], mavjudId: Set<string>): { h: TakrorHolat; ozgardi: boolean } {
  const natija: TakrorHolat = { versiya: 1, savollar: { ...h.savollar } };
  let ozgardi = false;
  for (const x of xatolar as { id?: unknown; sana?: unknown }[]) {
    if (!x || typeof x.id !== 'string' || !mavjudId.has(x.id) || !SANA.test(String(x.sana))) continue;
    const sana = String(x.sana);
    const y = natija.savollar[x.id];
    if (!y || sana > y.xatoSana) {
      natija.savollar[x.id] = { quti: 1, keyingi: sanaQosh(sana, BIRINCHI_ORALIQ), xatoSana: sana };
      ozgardi = true;
    }
  }
  return { h: natija, ozgardi };
}

/** Javobdan keyingi yozuv (sof funksiya). */
export function javobdanKeyin(y: TakrorYozuv, togrimi: boolean, kun: string): TakrorYozuv {
  if (!togrimi) return { ...keyingiQuti(y.quti, false, kun), xatoSana: kun };
  return { ...y, ...keyingiQuti(y.quti, true, kun) };
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
