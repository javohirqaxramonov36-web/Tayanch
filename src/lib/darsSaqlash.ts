// Interaktiv darslar: brauzerda saqlash (faqat shu qurilma). Har o'qish va yozish try/catch ichida:
// maxfiy oyna yoki bloklangan saqlashda sahifa baribir ishlaydi, faqat progress eslab qolinmaydi.
// Kalitlar bo'lim bo'yicha: tayanch:<bolim>-dars-progress, tayanch:<bolim>-xato-daftari (darsTurlar.ts).
import { darsKalitlari, type DarsBolim } from '../data/darsTurlar';

export function oqi<T>(kalit: string, zaxira: T): T {
  try {
    const v = localStorage.getItem(kalit);
    if (v == null) return zaxira;
    const q = JSON.parse(v);
    return q ?? zaxira;
  } catch {
    return zaxira;
  }
}

export function yoz(kalit: string, qiymat: unknown): boolean {
  try {
    localStorage.setItem(kalit, JSON.stringify(qiymat));
    return true;
  } catch {
    return false;
  }
}

export type SavolHolati = 'togri' | 'xato';
export type Progress = Record<string, Record<string, SavolHolati>>;

export interface XatoYozuv {
  id: string;
  modul: string;
  /** Tanlangan noto'g'ri variant matni */
  tanlangan: string;
  /** YYYY-MM-DD */
  sana: string;
}

export const progressniOqi = (bolim: DarsBolim) => {
  const p = oqi<Progress>(darsKalitlari(bolim).progress, {});
  return p && typeof p === 'object' && !Array.isArray(p) ? p : {};
};
export const xatolarniOqi = (bolim: DarsBolim) => {
  const x = oqi<XatoYozuv[]>(darsKalitlari(bolim).xatoDaftari, []);
  return Array.isArray(x) ? x : [];
};

/** Javobni yozadi. Xato bo'lsa daftarga qo'shadi (eskisini yangilaydi), to'g'ri bo'lsa daftardan olib tashlaydi. */
export function javobniYoz(bolim: DarsBolim, modul: string, id: string, togrimi: boolean, tanlangan: string): boolean {
  const k = darsKalitlari(bolim);
  const p = progressniOqi(bolim);
  p[modul] = { ...(p[modul] ?? {}), [id]: togrimi ? 'togri' : 'xato' };
  const ok1 = yoz(k.progress, p);
  const daftar = xatolarniOqi(bolim).filter((x) => x.id !== id);
  if (!togrimi) daftar.unshift({ id, modul, tanlangan, sana: bugun() });
  const ok2 = yoz(k.xatoDaftari, daftar.slice(0, 300));
  return ok1 && ok2;
}

export function modulniTozala(bolim: DarsBolim, modul: string): void {
  const k = darsKalitlari(bolim);
  const p = progressniOqi(bolim);
  delete p[modul];
  yoz(k.progress, p);
  yoz(k.xatoDaftari, xatolarniOqi(bolim).filter((x) => x.modul !== modul));
}

/** Toshkent vaqti bo'yicha bugungi sana, YYYY-MM-DD */
export function bugun(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent' }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}
