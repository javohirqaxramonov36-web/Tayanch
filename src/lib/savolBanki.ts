// Savol banki (P07): sof funksiyalar. Supabase chaqiruvi yo'q, shuning uchun brauzerda ham, node testida ham ishlaydi.
// RPC'lar: question_counts, start_session, usage_status (supabase/migrations/20261108000008_rpc.sql, PR #65).
// Filtr kalitlari private.filtered_questions bilan bir xil. Matn inglizcha (SAT bo'limi).
import { savolTaksonomiya, type SavolBolim } from '../data/satTaksonomiya.ts';

export type Qiyinlik = 'easy' | 'medium' | 'hard';
export type Yechilgan = 'all' | 'unsolved';
export type Rejim = 'practice' | 'timed';
export type Hajm = 10 | 20 | 30 | 40 | 50 | 'all';

export const HAJMLAR: readonly Hajm[] = [10, 20, 30, 40, 50, 'all'];
/** start_session p_volume chegarasi (texnik, tarif emas). */
export const MAX_HAJM = 100;

/** Easy = 1–2, Medium = 3, Hard = 4–5 (bazadagi difficulty 1–5). */
export const QIYINLIK_DARAJA: Record<Qiyinlik, readonly number[]> = { easy: [1, 2], medium: [3], hard: [4, 5] };

export interface BankFiltr {
  section: SavolBolim;
  /** Bo'sh: hamma qiyinlik. */
  qiyinlik: Qiyinlik[];
  yechilgan: Yechilgan;
  belgilangan: boolean;
  qaytaYechish: boolean;
}

/** private.filtered_questions kutadigan jsonb. skills berilmasa (sonlar uchun) butun bo'lim. */
export function filtrJson(f: BankFiltr, skills?: readonly string[]): Record<string, unknown> {
  const j: Record<string, unknown> = { section: f.section };
  if (skills) j.skills = [...skills];
  const d = [...new Set(f.qiyinlik)].flatMap((q) => QIYINLIK_DARAJA[q]).sort((a, b) => a - b);
  if (d.length) j.difficulties = d;
  if (f.yechilgan === 'unsolved') j.unanswered_only = true;
  if (f.belgilangan) j.bookmarked_only = true;
  if (f.qaytaYechish) j.incorrect_only = true;
  return j;
}

export interface SonGuruh { section: string; domain: string; skill: string; difficulty: number; total: number; answered: number }
export interface SonJavob { total: number; groups: SonGuruh[] }

/** question_counts javobi → skill bo'yicha son (qiyinliklar yig'indisi). Taksonomiyadagi har skill bor, yo'qi 0. */
export function skillSonlari(javob: SonJavob | null | undefined, section: SavolBolim): Map<string, number> {
  const m = new Map<string, number>();
  for (const skills of Object.values(savolTaksonomiya[section])) for (const s of skills) m.set(s, 0);
  for (const g of javob?.groups ?? []) {
    if (g.section !== section || !m.has(g.skill)) continue;
    m.set(g.skill, (m.get(g.skill) ?? 0) + Number(g.total || 0));
  }
  return m;
}

/** Bo'lim bo'yicha jami (filtrsiz javobdan): bo'sh bo'limni aniqlash uchun. */
export function bolimJami(javob: SonJavob | null | undefined): Record<SavolBolim, number> {
  const r: Record<SavolBolim, number> = { rw: 0, math: 0 };
  for (const g of javob?.groups ?? []) if (g.section === 'rw' || g.section === 'math') r[g.section] += Number(g.total || 0);
  return r;
}

/** Tanlangan va hozir soni > 0 bo'lgan skill'lar (soni 0 bo'lsa tanlov eslab qolinadi, lekin hisoblanmaydi). */
export function faolSkilllar(tanlangan: Iterable<string>, sonlar: Map<string, number>): string[] {
  return [...tanlangan].filter((s) => (sonlar.get(s) ?? 0) > 0);
}

export function mosSon(tanlangan: Iterable<string>, sonlar: Map<string, number>): number {
  return faolSkilllar(tanlangan, sonlar).reduce((a, s) => a + (sonlar.get(s) ?? 0), 0);
}

export type DomenHolati = 'none' | 'some' | 'all';

/** Domen checkbox'i: faqat tanlanishi mumkin bo'lgan (son > 0) skill'lar hisobga olinadi. sonlar null: hammasi tanlanadi. */
export function domenHolati(skills: readonly string[], tanlangan: ReadonlySet<string>, sonlar: Map<string, number> | null): DomenHolati {
  const ochiq = sonlar ? skills.filter((s) => (sonlar.get(s) ?? 0) > 0) : [...skills];
  if (!ochiq.length) return 'none';
  const n = ochiq.filter((s) => tanlangan.has(s)).length;
  return n === 0 ? 'none' : n === ochiq.length ? 'all' : 'some';
}

export type HajmSabab = 'tanlov' | 'mos' | 'chegara' | 'kvota';

/** Sessiya hajmi: tanlangan hajm, mos savollar, 100 chegarasi va bugungi savol kvotasining eng kichigi. */
export function sessiyaHajmi(hajm: Hajm, mos: number, kvotaQolgan: number | null): { soni: number; sabab: HajmSabab } {
  let soni = hajm === 'all' ? Math.min(mos, MAX_HAJM) : hajm;
  let sabab: HajmSabab = hajm === 'all' && mos > MAX_HAJM ? 'chegara' : 'tanlov';
  if (hajm !== 'all' && mos < soni) { soni = mos; sabab = 'mos'; }
  if (kvotaQolgan !== null && kvotaQolgan < soni) { soni = Math.max(kvotaQolgan, 0); sabab = 'kvota'; }
  return { soni, sabab };
}

export function hajmIzohi(hajm: Hajm, natija: { soni: number; sabab: HajmSabab }): string {
  const n = natija.soni;
  const q = n === 1 ? 'question' : 'questions';
  if (natija.sabab === 'mos' && hajm !== 'all') return `Only ${sonMatni(n)}, so the session will have ${n}.`;
  if (natija.sabab === 'chegara') return `A session holds at most ${MAX_HAJM} questions.`;
  if (natija.sabab === 'kvota') return `You have ${n} ${q} left today, so the session will have ${n}.`;
  return `The session will have ${n} ${q}.`;
}

export interface Limit { max: number; per: string; used: number; remaining: number }
export interface UsageJavob { bolim?: string; plan?: { code?: string; name?: string } | null; limits?: Record<string, Limit> | null }

export interface Kvota {
  /** Ekrandagi qisqa qator. */
  matn: string;
  rejaNomi: string;
  kalit: 'questions' | 'sessions' | null;
  max: number | null;
  qolgan: number | null;
  tugadi: boolean;
  /** Faqat questions kaliti bo'lsa: sessiya hajmini cheklaydi. */
  savolQolgan: number | null;
}

const LIMIT_SOZ = { questions: ['question', 'questions'], sessions: ['session', 'sessions'] } as const;

/** usage_status → kvota. limits.questions, yo'q bo'lsa limits.sessions; ikkalasi ham yo'q: faqat tarif nomi. */
export function kvotaHolati(u: UsageJavob | null | undefined): Kvota {
  const rejaNomi = (u?.plan?.name || u?.plan?.code || 'Free').trim();
  const reja = `${rejaNomi} plan`;
  const limits = u?.limits ?? {};
  const kalit = limits.questions ? 'questions' : limits.sessions ? 'sessions' : null;
  if (!kalit) return { matn: reja, rejaNomi, kalit: null, max: null, qolgan: null, tugadi: false, savolQolgan: null };
  const l = limits[kalit];
  const max = Number(l.max);
  const qolgan = Math.max(Number(l.remaining), 0);
  const [bir, kop] = LIMIT_SOZ[kalit];
  return {
    matn: `${qolgan} of ${max} ${max === 1 ? bir : kop} left today · ${reja}`,
    rejaNomi,
    kalit,
    max,
    qolgan,
    tugadi: qolgan <= 0,
    savolQolgan: kalit === 'questions' ? qolgan : null,
  };
}

export function kvotaTugadiMatni(k: Pick<Kvota, 'kalit' | 'max'>): string {
  if (k.kalit && k.max !== null) {
    const [bir, kop] = LIMIT_SOZ[k.kalit];
    return `You've used today's ${k.max} ${k.max === 1 ? bir : kop}. Resets at midnight (Tashkent time).`;
  }
  return "You've reached today's limit. Resets at midnight (Tashkent time).";
}

/** Supabase (PostgREST) xatosi: kvota (consume_quota 'quota_exceeded'), kirish kerak, tarmoq yoki boshqa. */
export function xatoTuri(e: unknown): 'kvota' | 'kirish' | 'tarmoq' | 'boshqa' {
  const x = (e ?? {}) as { message?: string; code?: string; details?: string; name?: string };
  const m = `${x.message ?? ''} ${x.details ?? ''}`;
  if (m.includes('quota_exceeded')) return 'kvota';
  if (m.includes('not_authenticated') || x.code === '42501') return 'kirish';
  if (e instanceof TypeError || /fetch|network/i.test(m)) return 'tarmoq';
  return 'boshqa';
}

export type BankHolat = 'loading' | 'empty' | 'error' | 'anon' | 'no-supabase' | 'ready';

/** Start tugmasi o'chirilgan bo'lsa sababi (ko'rinadigan matn), aks holda null. */
export function boshlashSababi(p: { holat: BankHolat; tanlanganSoni: number; mos: number; kvotaTugadi: boolean; bolimBosh: boolean }): string | null {
  if (p.holat === 'loading') return 'Loading question counts…';
  if (p.holat === 'error') return 'Question counts did not load.';
  if (p.holat === 'empty' || p.bolimBosh) return 'No verified questions yet';
  if (p.kvotaTugadi) return 'Daily limit reached';
  if (p.tanlanganSoni === 0) return 'Select at least one skill';
  if (p.mos === 0) return 'No questions match these filters';
  return null;
}

export const sonMatni = (n: number) => `${n} ${n === 1 ? 'question matches' : 'questions match'}`;

/** sessionStorage kaliti: start_session javobi. P08 sessiya sahifasi uni o'qimaydi (sessiya doim get_session dan), ochilganda o'chiradi. */
export const SESSIYA_KALITI = 'tayanch:sat-sessiya';
