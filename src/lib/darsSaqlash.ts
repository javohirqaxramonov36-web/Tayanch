// SAT darslari: brauzerda saqlash (faqat shu qurilma). Har o'qish va yozish try/catch ichida:
// maxfiy oyna yoki bloklangan saqlashda sahifa baribir ishlaydi, faqat progress eslab qolinmaydi.
import { KALIT_PROGRESS, KALIT_XATO_DAFTARI, type DarsModul } from '../data/satDarslar/turlar';

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
export type Progress = Partial<Record<DarsModul, Record<string, SavolHolati>>>;

export interface XatoYozuv {
  id: string;
  modul: DarsModul;
  /** Tanlangan noto'g'ri variant matni */
  tanlangan: string;
  /** YYYY-MM-DD */
  sana: string;
}

export const progressniOqi = () => oqi<Progress>(KALIT_PROGRESS, {});
export const xatolarniOqi = () => {
  const x = oqi<XatoYozuv[]>(KALIT_XATO_DAFTARI, []);
  return Array.isArray(x) ? x : [];
};

/** Javobni yozadi. Xato bo'lsa daftarga qo'shadi (eskisini yangilaydi), to'g'ri bo'lsa daftardan olib tashlaydi. */
export function javobniYoz(modul: DarsModul, id: string, togrimi: boolean, tanlangan: string): boolean {
  const p = progressniOqi();
  p[modul] = { ...(p[modul] ?? {}), [id]: togrimi ? 'togri' : 'xato' };
  const ok1 = yoz(KALIT_PROGRESS, p);
  const daftar = xatolarniOqi().filter((x) => x.id !== id);
  if (!togrimi) daftar.unshift({ id, modul, tanlangan, sana: bugun() });
  const ok2 = yoz(KALIT_XATO_DAFTARI, daftar.slice(0, 300));
  return ok1 && ok2;
}

export function modulniTozala(modul: DarsModul): void {
  const p = progressniOqi();
  delete p[modul];
  yoz(KALIT_PROGRESS, p);
  yoz(KALIT_XATO_DAFTARI, xatolarniOqi().filter((x) => x.modul !== modul));
}

/** Toshkent vaqti bo'yicha bugungi sana, YYYY-MM-DD */
export function bugun(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent' }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}
