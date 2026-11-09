// IELTS mashq ma’lumotlariga yagona kirish nuqtasi. Vaqtlar Unix millisekundlarda.
import { xatolarniOqi } from '../darsSaqlash';
import type { Javob, Modul, SavolTuri } from './test';

const PREFIKS = 'tayanch:ielts-mashq:v1:';
const URINISH = PREFIKS + 'urinish:';
const DAFTAR = PREFIKS + 'xato:';
const MAQSAD = PREFIKS + 'maqsad';
const JUFTLIK = PREFIKS + 'ochiq:';

export interface Ajratma { start: number; end: number }
export interface Urinish {
  id: string;
  modul: Modul;
  test: string;
  boshlangan: number;
  tugash: number;
  topshirilgan?: number;
  savol: number;
  javoblar: Record<string, Javob>;
  bayroqlar: Record<string, boolean>;
  eslatmalar: Record<number, string>;
  ajratmalar: Record<string, Ajratma[]>;
  audio: number[];
  audioTugagan: number[];
  yakuniy?: number;
  belgi: Record<string, boolean>;
  qayta?: string;
}

export interface Xato {
  id: string;
  modul: 'reading' | 'listening';
  test: string;
  savol: string;
  tur: SavolTuri;
  matn: string;
  sana: number;
}

function oqi<T>(kalit: string): T | undefined {
  try {
    const qiymat = localStorage.getItem(kalit);
    return qiymat ? JSON.parse(qiymat) as T : undefined;
  } catch { return undefined; }
}

function yoz(kalit: string, qiymat: unknown) {
  try {
    localStorage.setItem(kalit, JSON.stringify(qiymat));
    return true;
  } catch { return false; }
}

function royxat<T>(prefiks: string): T[] {
  try {
    return Object.keys(localStorage)
      .filter((kalit) => kalit.startsWith(prefiks))
      .flatMap((kalit) => {
        const yozuv = oqi<T>(kalit);
        return yozuv ? [yozuv] : [];
      });
  } catch { return []; }
}

export const urinishniOqi = (id: string) => oqi<Urinish>(URINISH + id);
export const urinishlar = () => royxat<Urinish>(URINISH).sort((a, b) => b.boshlangan - a.boshlangan);
export const maqsadniOqi = () => oqi<number>(MAQSAD);
export const maqsadniYoz = (band: number) => yoz(MAQSAD, band);
export const testXatolari = () => royxat<Xato>(DAFTAR).sort((a, b) => b.sana - a.sana);
export const darsXatolari = () => xatolarniOqi('ielts');
export const xatoniSaqla = (xato: Xato) => yoz(DAFTAR + xato.id, xato);
export function xatoniYechildi(id: string) {
  try { localStorage.removeItem(DAFTAR + id); } catch { /* Saqlash bloklangan. */ }
}

export function urinishOch(modul: Modul, test: string, soniya: number, qayta?: string) {
  const kalit = JUFTLIK + modul + ':' + test;
  const id = qayta ? undefined : oqi<string>(kalit);
  const eski = id && urinishniOqi(id);
  if (eski && !eski.topshirilgan) return { urinish: eski, saqlandi: true };

  const hozir = Date.now();
  const urinish: Urinish = {
    id: crypto.randomUUID(), modul, test, boshlangan: hozir, tugash: hozir + soniya * 1000,
    savol: 0, javoblar: {}, bayroqlar: {}, eslatmalar: {}, ajratmalar: {},
    audio: [], audioTugagan: [], belgi: {}, qayta,
  };
  const saqlandi = yoz(URINISH + urinish.id, urinish);
  if (!qayta && saqlandi) yoz(kalit, urinish.id);
  return { urinish, saqlandi };
}

export function urinishniYoz(jory: Urinish, amal: (u: Urinish) => void, disk = true) {
  const kalit = URINISH + jory.id;
  const saqlangan = oqi<Urinish>(kalit);
  const yangi = structuredClone((disk || saqlangan?.topshirilgan ? saqlangan : undefined) ?? jory);
  if (yangi.topshirilgan) return { urinish: yangi, saqlandi: Boolean(saqlangan) };
  amal(yangi);
  return { urinish: yangi, saqlandi: yoz(kalit, yangi) };
}

export function mezonniYoz(urinish: Urinish, amal: (u: Urinish) => void): Urinish {
  const saqlangan = urinishniOqi(urinish.id);
  const yangi = structuredClone(saqlangan ?? urinish);
  amal(yangi);
  yoz(URINISH + yangi.id, yangi);
  return yangi;
}
