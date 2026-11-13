// My SAT profile (/uz/sat/hisob/profil/) uchun sof xulosa funksiyalari: maqsad bloki, xato daftari sonlari.
// Brauzer API'si yo'q (Node testida ishlaydi): src/lib/testlar/profilXulosa.test.ts.
// Hisob, saqlash va tarif ma'lumoti sahifada o'qiladi; bu yerda faqat ekrandagi matn va sonlar.
// Matn inglizcha (SAT bo'limi). Natija va'dasi, soxta 0 yoki reyting yo'q.
import { kunHolati, sanaTogri } from '../muddat.ts';
import { bankdanBand, tabSonlari, type Band, type BankQator } from './xatoDaftari.ts';

export interface ProfilQator {
  display_name?: string | null;
  nickname?: string | null;
  target_score?: number | null;
  current_score?: number | null;
  exam_date?: string | null;
}

/** Sarlavhadagi ism: taxallus, bo'lmasa ism, bo'lmasa null (sahifa "Your SAT profile" deydi). */
export function ismYozuv(p: ProfilQator | null | undefined): string | null {
  const t = (p?.nickname ?? '').trim() || (p?.display_name ?? '').trim();
  return t || null;
}

const ballmi = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n >= 400 && n <= 1600;

/** Imtihon sanasi: "14 March 2027" (sana qatori, vaqt mintaqasisiz). */
export function sanaYozuv(s: string): string {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export interface MaqsadXulosa {
  /** Hech narsa kiritilmagan: blok "Set your goal" taklifini ko'rsatadi. */
  bosh: boolean;
  maqsad: string;
  joriy: string;
  sana: string;
  /** "84 days left" / "Today" / "This date has passed"; sana yo'q bo'lsa null. */
  qolgan: string | null;
  otgan: boolean;
}

export function maqsadXulosa(p: ProfilQator | null | undefined, bugun: string): MaqsadXulosa {
  const maqsad = ballmi(p?.target_score) ? String(p!.target_score) : null;
  const joriy = ballmi(p?.current_score) ? String(p!.current_score) : null;
  const sana = sanaTogri(p?.exam_date) ? p!.exam_date! : null;
  let qolgan: string | null = null;
  let otgan = false;
  if (sana) {
    const h = kunHolati(bugun, sana);
    if (h.tur === 'bugun') qolgan = 'Today';
    else if (h.tur === 'otgan') { qolgan = 'This date has passed'; otgan = true; }
    else qolgan = `${h.kun} ${h.kun === 1 ? 'day' : 'days'} left`;
  }
  return {
    bosh: !maqsad && !joriy && !sana,
    maqsad: maqsad ?? 'Not set',
    joriy: joriy ?? 'Not set',
    sana: sana ? sanaYozuv(sana) : 'Not set',
    qolgan,
    otgan,
  };
}

/** Dars takrorlash holati (tayanch:sat-takrorlash) dan bugungi navbat: 1–4-quti, muddati kelgan. */
export function darsBugun(savollar: Record<string, { quti: number; keyingi: string }> | null | undefined, kun: string): number {
  if (!savollar) return 0;
  let n = 0;
  for (const y of Object.values(savollar)) if (y && y.quti >= 1 && y.quti < 5 && typeof y.keyingi === 'string' && y.keyingi <= kun) n++;
  return n;
}

export interface BankXulosa { bugun: number; saqlangan: number }

/** review_overview() qatorlaridan savol banki xatolari (bugun) va saqlangan savollar soni. */
export function bankXulosa(items: readonly BankQator[] | null | undefined, kun: string): BankXulosa {
  const bandlar = (items ?? []).map(bankdanBand).filter((b): b is Band => b !== null);
  const s = tabSonlari(bandlar, kun);
  return { bugun: s.due, saqlangan: s.saved };
}

/** "3 to review today" / "Nothing due today" */
export const takrorMatn = (n: number) => (n > 0 ? `${n} to review today` : 'Nothing due today');

/** Son va birlik: "1 word", "4 words". */
export const sonBirlik = (n: number, bir: string, kop: string) => `${n} ${n === 1 ? bir : kop}`;
