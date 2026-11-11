// Xato daftari (P09) sof mantiqi: dars xatolari (brauzer, takrorlash.ts) va savol banki xatolari / saqlanganlar
// (Supabase: review_overview, review_preview; 20261111120000_xato_daftari.sql) bitta ro'yxatga.
// Brauzer API'si yo'q: sahifa (src/pages/uz/sat/vosita/takrorlash/) va sinov (src/lib/testlar/xatoDaftari.test.ts) ishlatadi.
// Ro'yxatlar: Due today (1–4-quti, muddati kelgan), All mistakes (1–4-quti), Saved (bookmarks), Mastered (5-quti).
import { SABABLAR, type Sabab } from './sessiya.ts';

export type Manba = 'dars' | 'bank';
export type Tab = 'due' | 'all' | 'saved' | 'mastered';
export const TABLAR: readonly { kalit: Tab; nomi: string }[] = [
  { kalit: 'due', nomi: 'Due today' },
  { kalit: 'all', nomi: 'All mistakes' },
  { kalit: 'saved', nomi: 'Saved' },
  { kalit: 'mastered', nomi: 'Mastered' },
];
export const tabTogrimi = (x: unknown): x is Tab => TABLAR.some((t) => t.kalit === x);

/** Teg filtri: 'all' hammasi, 'none' tegsiz. */
export type TegFiltr = 'all' | Sabab | 'none';
export const TEG_FILTRLARI: readonly { kalit: TegFiltr; nomi: string }[] = [
  { kalit: 'all', nomi: 'All' },
  ...SABABLAR.map((s) => ({ kalit: s.kalit as TegFiltr, nomi: s.nomi })),
  { kalit: 'none', nomi: 'No reason yet' },
];
export const IZOH_MAX = 1000;
export const QISQA_UZUNLIK = 90;

export interface Band {
  /** `dars:<id>` yoki `bank:<uuid>`: ro'yxatda yagona */
  kalit: string;
  manba: Manba;
  id: string;
  /** Dars nomi · mavzu yoki domain · skill */
  mavzu: string;
  qiyinlik: string;
  qisqa: string;
  /** 1–5; faqat saqlangan bank savolida null */
  quti: number | null;
  keyingi: string | null;
  teg: Sabab | null;
  izoh: string;
  saqlangan: boolean;
}

/** review_overview() qatori */
export interface BankQator {
  question_id: string;
  section: 'math' | 'rw';
  domain: string;
  skill: string;
  difficulty: number;
  format: 'mcq' | 'spr';
  preview: string;
  in_queue: boolean;
  box: number | null;
  next_due: string | null;
  reason_tag: string | null;
  note: string | null;
  bookmarked: boolean;
}
export interface BankRoyxat { today: string; items: BankQator[] }

/** review_preview() javobi: javob (correct) va tushuntirish yo'q */
export interface BankSavol {
  id: string;
  section: 'math' | 'rw';
  domain: string;
  skill: string;
  difficulty: number;
  format: 'mcq' | 'spr';
  passage: string | null;
  stem: string;
  options: { key: string; text: string }[] | null;
  figure: { path: string; alt: string | null; caption: string | null } | null;
}

export interface DaftarApi {
  royxat(): Promise<BankRoyxat>;
  ochish(qid: string): Promise<BankSavol>;
  teg(qid: string, teg: Sabab | null): Promise<void>;
  izoh(qid: string, izoh: string): Promise<void>;
  saqla(qid: string, on: boolean): Promise<void>;
  /** start_review_session: faqat muddati kelgan bank savollari */
  takrorla(): Promise<{ session_id: string | null }>;
  rasm(path: string): Promise<string | null>;
}

const SANA = /^\d{4}-\d{2}-\d{2}$/;
const sababmi = (s: unknown): s is Sabab => SABABLAR.some((x) => x.kalit === s);

export function qiyinlikNomi(d: number): string {
  return d <= 2 ? 'easy' : d === 3 ? 'medium' : 'hard';
}

/** Qisqa ko'rinish: bitta qator, formulasiz belgilar o'zgarmaydi, uzun bo'lsa so'z chegarasida "…". */
export function qisqaMatn(t: string, n = QISQA_UZUNLIK): string {
  const s = String(t ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  const kesik = s.slice(0, n - 1);
  const joy = kesik.lastIndexOf(' ');
  return `${(joy > n * 0.6 ? kesik.slice(0, joy) : kesik).replace(/[\s,.;:]+$/, '')}…`;
}

export function bankdanBand(q: BankQator): Band | null {
  if (!q || typeof q.question_id !== 'string') return null;
  const navbatda = q.in_queue && typeof q.box === 'number' && q.box >= 1 && q.box <= 5 && SANA.test(String(q.next_due));
  if (!navbatda && !q.bookmarked) return null;
  return {
    kalit: `bank:${q.question_id}`,
    manba: 'bank',
    id: q.question_id,
    mavzu: `${q.domain} · ${q.skill}`,
    qiyinlik: qiyinlikNomi(q.difficulty),
    qisqa: qisqaMatn(q.preview),
    quti: navbatda ? q.box : null,
    keyingi: navbatda ? q.next_due : null,
    teg: sababmi(q.reason_tag) ? q.reason_tag : null,
    izoh: typeof q.note === 'string' ? q.note : '',
    saqlangan: !!q.bookmarked,
  };
}

export const navbatda = (b: Band) => b.quti !== null && b.keyingi !== null;
const faol = (b: Band) => navbatda(b) && b.quti! < 5;

export function tabdami(b: Band, tab: Tab, kun: string): boolean {
  if (tab === 'due') return faol(b) && b.keyingi! <= kun;
  if (tab === 'all') return faol(b);
  if (tab === 'saved') return b.saqlangan;
  return navbatda(b) && b.quti === 5;
}

const tartib = (a: Band, b: Band) =>
  (a.keyingi ?? '9999').localeCompare(b.keyingi ?? '9999') || a.manba.localeCompare(b.manba) || a.kalit.localeCompare(b.kalit);

export function tabBandlari(bandlar: readonly Band[], tab: Tab, kun: string): Band[] {
  const r = bandlar.filter((b) => tabdami(b, tab, kun));
  return tab === 'mastered' || tab === 'saved' ? r.sort((a, b) => a.mavzu.localeCompare(b.mavzu) || a.kalit.localeCompare(b.kalit)) : r.sort(tartib);
}

export function tabSonlari(bandlar: readonly Band[], kun: string): Record<Tab, number> {
  const s = { due: 0, all: 0, saved: 0, mastered: 0 } as Record<Tab, number>;
  for (const b of bandlar) for (const t of TABLAR) if (tabdami(b, t.kalit, kun)) s[t.kalit]++;
  return s;
}

export function tegMos(b: Band, f: TegFiltr): boolean {
  return f === 'all' || (f === 'none' ? b.teg === null : b.teg === f);
}

/** Teg sanoqlari (P14 analitikaga manba): berilgan bandlar ichida. */
export function tegSonlari(bandlar: readonly Band[]): Record<TegFiltr, number> {
  const s = Object.fromEntries(TEG_FILTRLARI.map((t) => [t.kalit, 0])) as Record<TegFiltr, number>;
  for (const b of bandlar) {
    s.all++;
    s[b.teg ?? 'none']++;
  }
  return s;
}

const OYLAR = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const sanaMatn = (s: string) => { const [, m, d] = s.split('-').map(Number); return `${OYLAR[m - 1]} ${d}`; };

/** Qatordagi holat yozuvi. */
export function holatMatni(b: Band, kun: string): string {
  if (!navbatda(b)) return 'Saved';
  if (b.quti === 5) return 'Mastered';
  return b.keyingi! <= kun ? `Box ${b.quti} · due today` : `Box ${b.quti} · next ${sanaMatn(b.keyingi!)}`;
}

/** Due bo'lgan bandlar soni manba bo'yicha (tugmalar uchun). */
export function dueSoni(bandlar: readonly Band[], kun: string): Record<Manba, number> {
  const s: Record<Manba, number> = { dars: 0, bank: 0 };
  for (const b of bandlar) if (tabdami(b, 'due', kun)) s[b.manba]++;
  return s;
}
