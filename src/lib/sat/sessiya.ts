// Mashq sessiyasi (P08, /uz/sat/mashq/sessiya/): sof mantiq (DOM, tarmoq, Supabase yo'q).
// Server javoblari (get_session, submit_answer) turlari, mahalliy holat (brauzer xotirasi), taymer, savollar xaritasi,
// qayta urinish navbati va yakuniy natija hisobi. Sinov: src/lib/testlar/sessiya.test.ts.
//
// Qoidalar:
//   - To'g'ri javob va tushuntirish faqat javob yuborilgandan keyin keladi (submit_answer, get_session.results).
//   - Brauzerda faqat: joriy savol, "Mark for review" belgilari, o'tkazilganlar, sarflangan vaqt, taymerli rejim
//     qoralamalari va yuborilmagan javoblar navbati. Kalit: tayanch:sat-sessiya:v1:<session_id>. URL da javob yo'q.

import type { Savol, SavolBolimi, SavolFormati } from './savolTuri';

export type SessiyaRejimi = 'practice' | 'timed' | 'daily' | 'review';

/** get_session / start_session dagi savol (javobsiz). */
export interface ServerSavol {
  id: string;
  external_id?: string;
  position: number;
  section: SavolBolimi;
  domain: string;
  skill: string;
  difficulty?: number;
  format: SavolFormati;
  passage?: string | null;
  stem: string;
  options?: { key: string; text: string }[] | null;
  figure?: { path: string; alt: string; caption?: string | null } | null;
  answered?: boolean;
  bookmarked?: boolean;
}

/** get_session.results: faqat javob berilgan savollar. */
export interface ServerNatija {
  question_id: string;
  answer: string;
  is_correct: boolean;
  /** mcq: "B"; spr: ["1/2", "0.5"] */
  correct: string | string[] | null;
  explanation: string | null;
  time_ms: number | null;
}

export interface ServerReview {
  question_id: string;
  reason_tag: string | null;
}

export interface SessiyaJavob {
  session_id: string;
  mode: SessiyaRejimi;
  started_at: string;
  finished_at: string | null;
  server_now: string;
  time_limit_ms: number | null;
  questions: ServerSavol[];
  results: ServerNatija[];
  review: ServerReview[];
}

/** submit_answer javobi */
export interface YuborJavob {
  is_correct: boolean;
  correct: string | string[] | null;
  explanation: string | null;
  already_answered: boolean;
}

/** Sahifa ishlatadigan server amallari (haqiqiy: Supabase RPC va RLS jadvallar; dev: sessiyaMock.ts). */
export interface SessiyaApi {
  ol(id: string): Promise<SessiyaJavob>;
  yubor(id: string, qid: string, javob: string, timeMs: number): Promise<YuborJavob>;
  yakunla(id: string): Promise<{ finished_at: string }>;
  navbatgaQosh(qid: string): Promise<void>;
  navbatdanOl(qid: string): Promise<void>;
  sabab(qid: string, tag: string | null): Promise<void>;
  rasm(path: string): Promise<string | null>;
}

export const MAHALLIY_KALIT = (id: string) => `tayanch:sat-sessiya:v1:${id}`;

export interface NavbatBand {
  qid: string;
  javob: string;
  timeMs: number;
  urinish: number;
}

export interface Mahalliy {
  joriy: number;
  belgilar: string[];
  otkazilgan: string[];
  /** Savol bo'yicha sarflangan vaqt, ms */
  vaqt: Record<string, number>;
  /** Taymerli rejim: tanlangan / kiritilgan javoblar (oxirida yuboriladi) */
  qoralama: Record<string, string>;
  /** Yuborilmagan javoblar (tarmoq xatosi, yakunlash paytida) */
  navbat: NavbatBand[];
  /** Taymerli rejim: "Finish" bosilgan yoki vaqt tugagan (yuborish davom etmoqda) */
  yakunlanmoqda: boolean;
}

export const bushMahalliy = (): Mahalliy => ({
  joriy: 0, belgilar: [], otkazilgan: [], vaqt: {}, qoralama: {}, navbat: [], yakunlanmoqda: false,
});

const satrlar = (x: unknown): string[] => (Array.isArray(x) ? x.filter((v): v is string => typeof v === 'string') : []);
const sonlar = (x: unknown): Record<string, number> => {
  const r: Record<string, number> = {};
  if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) if (typeof v === 'number' && v >= 0 && Number.isFinite(v)) r[k] = Math.round(v);
  return r;
};
const satrMap = (x: unknown): Record<string, string> => {
  const r: Record<string, string> = {};
  if (x && typeof x === 'object') for (const [k, v] of Object.entries(x)) if (typeof v === 'string' && v.length <= 100) r[k] = v;
  return r;
};

/** Xotiradagi JSON ni tekshirib o'qiydi: buzilgan yoki eski bo'lsa bo'sh holat. */
export function mahalliyniTekshir(xom: string | null): Mahalliy {
  if (!xom) return bushMahalliy();
  let d: Record<string, unknown>;
  try {
    d = JSON.parse(xom);
    if (!d || typeof d !== 'object') return bushMahalliy();
  } catch {
    return bushMahalliy();
  }
  const navbat = Array.isArray(d.navbat)
    ? (d.navbat as Record<string, unknown>[]).filter((b) => b && typeof b.qid === 'string' && typeof b.javob === 'string')
        .map((b) => ({ qid: b.qid as string, javob: (b.javob as string).slice(0, 100), timeMs: Math.max(0, Math.round(Number(b.timeMs) || 0)), urinish: Math.max(0, Number(b.urinish) || 0) }))
    : [];
  return {
    joriy: Number.isInteger(d.joriy) && (d.joriy as number) >= 0 ? (d.joriy as number) : 0,
    belgilar: satrlar(d.belgilar),
    otkazilgan: satrlar(d.otkazilgan),
    vaqt: sonlar(d.vaqt),
    qoralama: satrMap(d.qoralama),
    navbat,
    yakunlanmoqda: d.yakunlanmoqda === true,
  };
}

/** Server savolini P06 komponenti turiga aylantiradi. Rasm URL'ini ota sahifa oladi (yopiq bucket). */
export function komponentSavoli(q: ServerSavol, rasmUrl: string | null): Savol {
  return {
    id: q.id,
    section: q.section,
    format: q.format,
    passage: q.passage ?? null,
    stem: q.stem,
    options: q.options ?? null,
    figure: q.figure ? { src: rasmUrl ?? '', alt: q.figure.alt, caption: q.figure.caption ?? undefined } : null,
  };
}

/** To'g'ri javobni ko'rsatish uchun matn: mcq "B", spr birinchi qabul qilingan qiymat. */
export function togriMatn(c: string | string[] | null | undefined): string {
  if (Array.isArray(c)) return c[0] ?? '';
  return c ?? '';
}

// ---------- Taymer ----------

/**
 * Qolgan vaqt (ms). Soat farqi: serverNow va mijozning shu javob kelgan paytdagi vaqti (soatOlingan) orasidagi farq.
 * Qayta yuklash taymerni nolga qaytarmaydi: hisob doim serverdagi started_at dan.
 */
export function qolganMs(o: { startedAt: string; limitMs: number; serverNow: string; soatOlingan: number }, hozir: number): number {
  const farq = Date.parse(o.serverNow) - o.soatOlingan;
  const tugash = Date.parse(o.startedAt) + o.limitMs;
  return Math.max(0, Math.round(tugash - (hozir + farq)));
}

export type TaymerChegara = 'besh' | 'bir' | 'tugadi';

/**
 * Ekran o'qish dasturi uchun e'lon: faqat chegaradan o'tilganda (5 daqiqa, 1 daqiqa, vaqt tugadi).
 * Sahifa ochilganda allaqachon chegaradan past bo'lsa, faqat eng so'nggi chegara bir marta aytiladi.
 */
export function chegaraOtildi(oldin: number | null, hozir: number): TaymerChegara | null {
  const chegaralar: [number, TaymerChegara][] = [[0, 'tugadi'], [60_000, 'bir'], [300_000, 'besh']];
  for (const [ms, nom] of chegaralar) {
    const hozirPast = ms === 0 ? hozir <= 0 : hozir <= ms;
    const oldinPast = oldin === null ? false : ms === 0 ? oldin <= 0 : oldin <= ms;
    if (hozirPast && !oldinPast) return nom;
  }
  return null;
}

/** 754000 → "12:34", 3_725_000 → "1:02:05" (soniya yuqoriga yaxlitlanadi: 0,4 s qolsa "0:01"). */
export function vaqtMatni(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const soat = Math.floor(s / 3600);
  const daq = Math.floor((s % 3600) / 60);
  const son = s % 60;
  const ikki = (n: number) => String(n).padStart(2, '0');
  return soat ? `${soat}:${ikki(daq)}:${ikki(son)}` : `${daq}:${ikki(son)}`;
}

/** Jami vaqt so'z bilan: "12 min 5 s", "45 s", "1 h 2 min". */
export function davomiylikMatni(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const soat = Math.floor(s / 3600);
  const daq = Math.floor((s % 3600) / 60);
  const son = s % 60;
  if (soat) return `${soat} h ${daq} min`;
  if (daq) return son ? `${daq} min ${son} s` : `${daq} min`;
  return `${son} s`;
}

// ---------- Savollar xaritasi ----------

export type XaritaHolati = 'answered' | 'pending' | 'skipped' | 'unanswered';

export interface XaritaBand {
  raqam: number;
  qid: string;
  holat: XaritaHolati;
  belgilangan: boolean;
  joriy: boolean;
}

/**
 * Har savol holati. answered: serverda javob bor (yoki taymerli rejimda qoralama bor); pending: navbatda;
 * skipped: ko'rilgan, lekin javobsiz qoldirilgan; unanswered: hali ochilmagan.
 */
export function xarita(
  savollar: Pick<ServerSavol, 'id'>[],
  m: Mahalliy,
  javoblar: Set<string>,
  taymerli: boolean,
): XaritaBand[] {
  const navbatda = new Set(m.navbat.map((b) => b.qid));
  return savollar.map((q, i) => {
    let holat: XaritaHolati = 'unanswered';
    if (javoblar.has(q.id)) holat = 'answered';
    else if (navbatda.has(q.id)) holat = 'pending';
    else if (taymerli && m.qoralama[q.id]) holat = 'answered';
    else if (m.otkazilgan.includes(q.id)) holat = 'skipped';
    return { raqam: i + 1, qid: q.id, holat, belgilangan: m.belgilar.includes(q.id), joriy: i === m.joriy };
  });
}

export const XARITA_MATN: Record<XaritaHolati, string> = {
  answered: 'Answered',
  pending: 'Saving',
  skipped: 'Skipped',
  unanswered: 'Not answered',
};

/** Tugma uchun to'liq yorliq: "Question 3, answered, marked for review, current" */
export function xaritaYorliq(b: XaritaBand): string {
  return [`Question ${b.raqam}`, XARITA_MATN[b.holat].toLowerCase(), b.belgilangan ? 'marked for review' : '', b.joriy ? 'current' : '']
    .filter(Boolean).join(', ');
}

// ---------- Navbat ----------

/** Navbatga qo'shadi; shu savol allaqachon navbatda bo'lsa yangi qiymat bilan almashtiradi (ikki marta yuborilmaydi). */
export function navbatgaQosh(navbat: NavbatBand[], band: Omit<NavbatBand, 'urinish'>): NavbatBand[] {
  return [...navbat.filter((b) => b.qid !== band.qid), { ...band, urinish: 0 }];
}

/** Keyingi urinishgacha kutish: 1, 2, 4, 8, 16, 30, 30… soniya. */
export const keyingiUrinishMs = (urinish: number) => Math.min(30_000, 1000 * 2 ** Math.max(0, urinish));

export type SessiyaXato = 'tarmoq' | 'kirish' | 'kvota' | 'yakunlangan' | 'topilmadi' | 'savol' | 'boshqa';

/** Supabase / fetch xatosini turga ajratadi. */
export function sessiyaXatosi(e: unknown): SessiyaXato {
  const x = (e ?? {}) as { message?: string; code?: string; details?: string };
  const m = `${x.message ?? ''} ${x.details ?? ''}`;
  if (m.includes('quota_exceeded')) return 'kvota';
  if (m.includes('session_finished')) return 'yakunlangan';
  if (m.includes('session_not_found')) return 'topilmadi';
  if (m.includes('question_not_in_session') || m.includes('question_unavailable') || m.includes('invalid_answer')) return 'savol';
  if (m.includes('not_authenticated') || x.code === '42501' || x.code === 'PGRST301') return 'kirish';
  if (e instanceof TypeError || /fetch|network|load failed/i.test(m)) return 'tarmoq';
  return 'boshqa';
}

/** UUID ko'rinishidagi sessiya identifikatori (URL dan). */
export const idTogrimi = (id: string | null): id is string =>
  !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

// ---------- Natija ----------

export const SABABLAR = [
  { kalit: 'careless', nomi: 'Careless' },
  { kalit: 'concept_gap', nomi: 'Concept gap' },
  { kalit: 'time_pressure', nomi: 'Time pressure' },
  { kalit: 'misread', nomi: 'Misread' },
] as const;
export type Sabab = (typeof SABABLAR)[number]['kalit'];
export const sababTogrimi = (s: unknown): s is Sabab => SABABLAR.some((x) => x.kalit === s);

export interface SkillQator {
  section: SavolBolimi;
  domain: string;
  skill: string;
  togri: number;
  jami: number;
}

export interface NatijaBand {
  raqam: number;
  savol: ServerSavol;
  natija: ServerNatija | null;
}

export interface Hisobot {
  jami: number;
  javobBerilgan: number;
  togri: number;
  /** To'g'ri javoblar ulushi, butun foiz, hamma savollar bo'yicha (o'tkazilganlar ham hisobda) */
  foiz: number;
  /** Savollarga sarflangan vaqt yig'indisi (server time_ms; yo'q bo'lsa mahalliy) */
  vaqtMs: number;
  skilllar: SkillQator[];
  xatolar: NatijaBand[];
  otkazilgan: NatijaBand[];
  togrilar: NatijaBand[];
}

export function hisobot(s: Pick<SessiyaJavob, 'questions' | 'results'>, mahalliyVaqt: Record<string, number> = {}): Hisobot {
  const nat = new Map(s.results.map((r) => [r.question_id, r]));
  const skill = new Map<string, SkillQator>();
  const xatolar: NatijaBand[] = [];
  const otkazilgan: NatijaBand[] = [];
  const togrilar: NatijaBand[] = [];
  let togri = 0;
  let vaqtMs = 0;
  s.questions.forEach((q, i) => {
    const r = nat.get(q.id) ?? null;
    const band = { raqam: i + 1, savol: q, natija: r };
    const k = `${q.section}|${q.skill}`;
    const qator = skill.get(k) ?? { section: q.section, domain: q.domain, skill: q.skill, togri: 0, jami: 0 };
    qator.jami++;
    if (r?.is_correct) { qator.togri++; togri++; togrilar.push(band); }
    else if (r) xatolar.push(band);
    else otkazilgan.push(band);
    skill.set(k, qator);
    vaqtMs += r?.time_ms ?? mahalliyVaqt[q.id] ?? 0;
  });
  const jami = s.questions.length;
  return {
    jami,
    javobBerilgan: s.results.length,
    togri,
    foiz: jami ? Math.round((togri / jami) * 100) : 0,
    vaqtMs,
    skilllar: [...skill.values()].sort((a, b) => (a.section === b.section ? a.skill.localeCompare(b.skill) : a.section === 'rw' ? -1 : 1)),
    xatolar,
    otkazilgan,
    togrilar,
  };
}
