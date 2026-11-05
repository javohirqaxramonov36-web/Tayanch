// Tayanch binosi: 5 qavat (muallif qarori, 2026-11-05).
// 2–5 qavat holati bolimlar.ts dan olinadi, bu yerda takrorlanmaydi.
import { bolimlar, type BolimSlug } from './bolimlar';
import { yol } from '../lib/yol';

export interface Qavat {
  raqam: 1 | 2 | 3 | 4 | 5;
  slug: 'navigator' | BolimSlug;
  nomi: string;
  qisqaNom: string;
  /** base'siz manzil: "/uz/sat/" */
  manzil: string;
  /** ochiq yoki tez-orada (1-qavat doim ochiq) */
  holat: 'ochiq' | 'tez-orada';
  ikonka: string;
}

const IKONKA = {
  navigator: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  qalpoq: '<path d="M3 10l9-5 9 5-9 5z"/><path d="M7 12v5c3 2 7 2 10 0v-5"/>',
  suhbat: '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
  varaq: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  medal: '<circle cx="12" cy="9" r="5"/><path d="M9 13l-2 8 5-3 5 3-2-8"/>',
};

const holatI = (slug: BolimSlug) => bolimlar.find((b) => b.slug === slug)?.holat ?? 'tez-orada';
const ikonkaI = (slug: BolimSlug) => IKONKA[bolimlar.find((b) => b.slug === slug)?.ikonka ?? 'varaq'];

export const qavatlar: Qavat[] = [
  { raqam: 1, slug: 'navigator', nomi: 'Navigator', qisqaNom: 'Navigator', manzil: '/uz/', holat: 'ochiq', ikonka: IKONKA.navigator },
  { raqam: 2, slug: 'top-admission', nomi: 'Top Admission', qisqaNom: 'Admission', manzil: '/uz/top-admission/', holat: holatI('top-admission'), ikonka: ikonkaI('top-admission') },
  { raqam: 3, slug: 'sat', nomi: 'SAT prep', qisqaNom: 'SAT', manzil: '/uz/sat/', holat: holatI('sat'), ikonka: ikonkaI('sat') },
  { raqam: 4, slug: 'ielts', nomi: 'IELTS prep', qisqaNom: 'IELTS', manzil: '/uz/ielts/', holat: holatI('ielts'), ikonka: ikonkaI('ielts') },
  { raqam: 5, slug: 'eyuf', nomi: 'EYUF prep', qisqaNom: 'EYUF', manzil: '/uz/eyuf/', holat: holatI('eyuf'), ikonka: ikonkaI('eyuf') },
];

/** Sahifa manzilidan qavat raqami. /uz/deadline/, /uz/manbalar/, /uz/maxfiylik/ va boshqalar = 1-qavat. */
export function joriyQavat(pathname: string): Qavat['raqam'] {
  const base = yol('/').replace(/\/$/, '');
  const yolQismi = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  for (const q of qavatlar.slice(1)) {
    if (yolQismi === q.manzil.replace(/\/$/, '') || yolQismi.startsWith(q.manzil)) return q.raqam;
  }
  return 1;
}

export const qavatI = (raqam: number) => qavatlar[raqam - 1];
