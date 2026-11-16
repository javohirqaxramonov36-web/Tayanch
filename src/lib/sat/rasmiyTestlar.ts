// SAT test tracker (P11): foydalanuvchi rasmiy resurslarda (Bluebook practice test yoki haqiqiy SAT) olgan
// natijasini va xatolarini o'zi yozadi. Sof funksiyalar: brauzer API'si yo'q, node testida ham ishlaydi.
// Savol matni, variant va tushuntirish saqlanmaydi: faqat metama'lumot va foydalanuvchining o'z izohi.
// Ball oralig'i 200–800 / 400–1600: CB04. Ball qadami 10: CB04 da yozilmagan (tekshirish kerak), reja tuzgichdagi kabi qulaylik uchun.
// Modul savollari 27 (R&W) va 22 (Math): CB03 dagi jami 54 va 44 ikki modulga teng bo'lingan (tekshirish kerak).
// Ko'nikma statistikasi (konikmaStatistikasi) P13 va P14 uchun manba.
import { savolTaksonomiya, type SavolBolim } from '../../data/satTaksonomiya.ts';

export const KALIT_RASMIY_TESTLAR = 'tayanch:sat-rasmiy-testlar';

export type TestTuri = 'practice' | 'real';
export type Modul = 1 | 2;

export interface RasmiyTest {
  id: string;
  /** oxirgi o'zgarish vaqti, ms (P04 adapteri birlashtirishda ishlatadi) */
  t: number;
  turi: TestTuri;
  nomi: string;
  /** YYYY-MM-DD */
  sana: string;
  rw: number;
  math: number;
  daqiqa: number | null;
  izoh: string;
}

export interface RasmiyXato {
  id: string;
  t: number;
  testId: string;
  bolim: SavolBolim;
  modul: Modul;
  savol: number;
  /** satTaksonomiya domeni; ko'nikma tanlanmagan bo'lsa bo'sh */
  domen: string;
  konikma: string;
  sabab: SababKod;
  izoh: string;
  hal: boolean;
}

export interface Ombor {
  versiya: 1;
  testlar: RasmiyTest[];
  xatolar: RasmiyXato[];
}

export const BOSH_OMBOR: Ombor = { versiya: 1, testlar: [], xatolar: [] };

export const BAL_MIN = 200;
export const BAL_MAX = 800;
export const BAL_QADAM = 10;
export const MODUL_SAVOLLARI: Record<SavolBolim, number> = { rw: 27, math: 22 };
export const CHEGARA = { nomi: 80, izohTest: 2000, izohXato: 1000, daqiqaMax: 300 } as const;

/** Saqlanadigan ma'lumot hajmi chegarasi (bayt, UTF-8 JSON). Hisob bilan sinxronda user_state qatori 256 KB: zaxira qoladi. */
export const HAJM_CHEGARA = 200 * 1024;
export const omborHajmi = (o: Ombor): number => new TextEncoder().encode(JSON.stringify(o)).length;
/**
 * Yangi holatni saqlash mumkinmi: chegaradan oshmasa yoki eskisidan katta bo'lmasa (o'chirish va qisqartirish doim mumkin).
 */
export const sigadimi = (yangi: Ombor, eski: Ombor): boolean => {
  const h = omborHajmi(yangi);
  return h <= HAJM_CHEGARA || h <= omborHajmi(eski);
};
export const HAJM_XABARI = 'Storage limit reached. Delete old tests or shorten notes to add more.';

export const BOLIM_NOMI: Record<SavolBolim, string> = { rw: 'Reading & Writing', math: 'Math' };
export const TUR_NOMI: Record<TestTuri, string> = { practice: 'Practice test', real: 'Real SAT' };

export const SABABLAR = [
  ['misread', 'Misread the question'],
  ['concept', 'Concept gap'],
  ['calculation', 'Calculation error'],
  ['careless', 'Careless mistake'],
  ['time', 'Ran out of time'],
  ['guess', 'Guessed'],
  ['other', 'Other'],
] as const;
export type SababKod = (typeof SABABLAR)[number][0];
export const sababNomi = (k: string) => SABABLAR.find(([kod]) => kod === k)?.[1] ?? 'Other';
const sababmi = (k: unknown): k is SababKod => SABABLAR.some(([kod]) => kod === k);

/** Ko'nikma → domen (bo'lim ichida). Topilmasa bo'sh. */
export function domenTop(bolim: SavolBolim, konikma: string): string {
  for (const [domen, k] of Object.entries(savolTaksonomiya[bolim])) if (k.includes(konikma)) return domen;
  return '';
}

// ---------- Validatsiya ----------

const OYLAR = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const QISQA_OY = OYLAR.map((o) => o.slice(0, 3));
const SANA_RE = /^\d{4}-\d{2}-\d{2}$/;

export function sanaYaroqli(s: string): boolean {
  if (!SANA_RE.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

export function sanaMatn(s: string, qisqa = false): string {
  if (!sanaYaroqli(s)) return s;
  const [y, m, d] = s.split('-').map(Number);
  return `${(qisqa ? QISQA_OY : OYLAR)[m - 1]} ${d}, ${y}`;
}

/** Bo'lim balli: bo'sh, son emas, oraliqdan tashqari yoki 10 ga karrali emas bo'lsa xato matni. */
export function balXatosi(qiymat: string, nomi: string): string | null {
  const v = qiymat.trim();
  if (!v) return `Enter your ${nomi} score.`;
  if (!/^\d+$/.test(v)) return `${nomi} score must be a whole number from ${BAL_MIN} to ${BAL_MAX}.`;
  const n = Number(v);
  if (n < BAL_MIN || n > BAL_MAX) return `${nomi} score must be from ${BAL_MIN} to ${BAL_MAX}.`;
  if (n % BAL_QADAM !== 0) return `${nomi} score goes in steps of ${BAL_QADAM}, for example ${Math.round(n / BAL_QADAM) * BAL_QADAM}.`;
  return null;
}

export interface TestKirish {
  turi: string;
  nomi: string;
  sana: string;
  rw: string;
  math: string;
  daqiqa: string;
  izoh: string;
}
export type TestMaydon = keyof TestKirish;
export type Natija<T, M extends string> = { ok: true; qiymat: T } | { ok: false; xatolar: Partial<Record<M, string>> };

/** Forma qiymatlarini tekshiradi. bugun: YYYY-MM-DD (kelajak sanasi qabul qilinmaydi). */
export function testniTekshir(k: TestKirish, bugun: string): Natija<Omit<RasmiyTest, 'id' | 't'>, TestMaydon> {
  const x: Partial<Record<TestMaydon, string>> = {};
  if (k.turi !== 'practice' && k.turi !== 'real') x.turi = 'Choose the test type.';
  const nomi = k.nomi.trim();
  if (!nomi) x.nomi = 'Enter a name, for example the practice test number.';
  else if (nomi.length > CHEGARA.nomi) x.nomi = `Use at most ${CHEGARA.nomi} characters.`;
  if (!k.sana) x.sana = 'Enter the test date.';
  else if (!sanaYaroqli(k.sana)) x.sana = 'Enter a valid date.';
  else if (k.sana > bugun) x.sana = 'The date cannot be in the future.';
  const rwX = balXatosi(k.rw, 'Reading & Writing');
  if (rwX) x.rw = rwX;
  const mathX = balXatosi(k.math, 'Math');
  if (mathX) x.math = mathX;
  let daqiqa: number | null = null;
  const d = k.daqiqa.trim();
  if (d) {
    if (!/^\d+$/.test(d) || Number(d) < 1 || Number(d) > CHEGARA.daqiqaMax) x.daqiqa = `Enter minutes from 1 to ${CHEGARA.daqiqaMax}, or leave it blank.`;
    else daqiqa = Number(d);
  }
  const izoh = k.izoh.trim();
  if (izoh.length > CHEGARA.izohTest) x.izoh = `Use at most ${CHEGARA.izohTest} characters.`;
  if (Object.keys(x).length) return { ok: false, xatolar: x };
  return { ok: true, qiymat: { turi: k.turi as TestTuri, nomi, sana: k.sana, rw: Number(k.rw), math: Number(k.math), daqiqa, izoh } };
}

export interface XatoKirish {
  testId: string;
  bolim: string;
  modul: string;
  savol: string;
  konikma: string;
  sabab: string;
  izoh: string;
}
export type XatoMaydon = keyof XatoKirish;

export function xatoniTekshir(k: XatoKirish, testIdlar: readonly string[]): Natija<Omit<RasmiyXato, 'id' | 't' | 'hal'>, XatoMaydon> {
  const x: Partial<Record<XatoMaydon, string>> = {};
  if (!testIdlar.includes(k.testId)) x.testId = 'Choose a test.';
  const bolimOk = k.bolim === 'rw' || k.bolim === 'math';
  if (!bolimOk) x.bolim = 'Choose a section.';
  if (k.modul !== '1' && k.modul !== '2') x.modul = 'Choose a module.';
  const max = bolimOk ? MODUL_SAVOLLARI[k.bolim as SavolBolim] : 99;
  const s = k.savol.trim();
  if (!s) x.savol = 'Enter the question number.';
  else if (!/^\d+$/.test(s) || Number(s) < 1 || Number(s) > max) x.savol = `Enter a question number from 1 to ${max}.`;
  let domen = '';
  if (k.konikma && bolimOk) {
    domen = domenTop(k.bolim as SavolBolim, k.konikma);
    if (!domen) x.konikma = 'Choose a skill from the list.';
  }
  if (!sababmi(k.sabab)) x.sabab = 'Choose a reason.';
  const izoh = k.izoh.trim();
  if (izoh.length > CHEGARA.izohXato) x.izoh = `Use at most ${CHEGARA.izohXato} characters.`;
  if (Object.keys(x).length) return { ok: false, xatolar: x };
  return {
    ok: true,
    qiymat: { testId: k.testId, bolim: k.bolim as SavolBolim, modul: Number(k.modul) as Modul, savol: Number(s), domen, konikma: domen ? k.konikma : '', sabab: k.sabab as SababKod, izoh },
  };
}

// ---------- O'qilgan ma'lumotni tozalash ----------
/* eslint-disable @typescript-eslint/no-explicit-any */

const matnmi = (v: unknown, max: number): v is string => typeof v === 'string' && v.length <= max;
const balmi = (v: unknown) => Number.isInteger(v) && (v as number) >= BAL_MIN && (v as number) <= BAL_MAX;

/** localStorage yoki serverdan kelgan noma'lum qiymatni Ombor ga aylantiradi; yaroqsiz yozuvlar tashlanadi. */
export function omborniTozala(xom: unknown): Ombor {
  if (!xom || typeof xom !== 'object') return { versiya: 1, testlar: [], xatolar: [] };
  const o = xom as { testlar?: unknown; xatolar?: unknown };
  const testlar: RasmiyTest[] = (Array.isArray(o.testlar) ? o.testlar : []).filter((t: any): t is RasmiyTest =>
    !!t && typeof t === 'object'
    && matnmi(t.id, 64) && Number.isFinite(t.t)
    && (t.turi === 'practice' || t.turi === 'real')
    && matnmi(t.nomi, CHEGARA.nomi) && t.nomi.length > 0
    && typeof t.sana === 'string' && sanaYaroqli(t.sana)
    && balmi(t.rw) && balmi(t.math)
    && (t.daqiqa === null || (Number.isInteger(t.daqiqa) && t.daqiqa >= 1 && t.daqiqa <= CHEGARA.daqiqaMax))
    && matnmi(t.izoh, CHEGARA.izohTest));
  const idlar = new Set(testlar.map((t) => t.id));
  const xatolar: RasmiyXato[] = (Array.isArray(o.xatolar) ? o.xatolar : []).filter((x: any): x is RasmiyXato =>
    !!x && typeof x === 'object'
    && matnmi(x.id, 64) && Number.isFinite(x.t) && idlar.has(x.testId)
    && (x.bolim === 'rw' || x.bolim === 'math')
    && (x.modul === 1 || x.modul === 2)
    && Number.isInteger(x.savol) && x.savol >= 1 && x.savol <= MODUL_SAVOLLARI[x.bolim as SavolBolim]
    && typeof x.konikma === 'string' && typeof x.domen === 'string'
    && (x.konikma === '' ? x.domen === '' : domenTop(x.bolim, x.konikma) === x.domen)
    && sababmi(x.sabab)
    && matnmi(x.izoh, CHEGARA.izohXato)
    && typeof x.hal === 'boolean');
  return { versiya: 1, testlar, xatolar };
}

// ---------- Tartib va urinishlar ----------

export const jami = (t: Pick<RasmiyTest, 'rw' | 'math'>) => t.rw + t.math;

/** Sana bo'yicha eskidan yangiga; bir kunda bo'lsa avval kiritilgani oldin. */
export function xronologik<T extends Pick<RasmiyTest, 'sana' | 't'>>(testlar: readonly T[]): T[] {
  return [...testlar].sort((a, b) => (a.sana < b.sana ? -1 : a.sana > b.sana ? 1 : a.t - b.t));
}

/** Real SAT urinish raqamlari (1, 2, 3…), sana tartibida. Practice testlar raqam olmaydi. */
export function urinishlar(testlar: readonly RasmiyTest[]): Map<string, number> {
  const m = new Map<string, number>();
  xronologik(testlar.filter((t) => t.turi === 'real')).forEach((t, i) => m.set(t.id, i + 1));
  return m;
}

// ---------- Ko'nikma statistikasi (P13, P14) ----------

export interface KonikmaQator {
  bolim: SavolBolim;
  domen: string;
  /** bo'sh: ko'nikma tanlanmagan */
  konikma: string;
  jami: number;
  halQilinmagan: number;
}

/** Ko'nikmalar bo'yicha xato soni: avval hal qilinmagan, keyin jami bo'yicha kamayish tartibida. */
export function konikmaStatistikasi(xatolar: readonly RasmiyXato[], bolim?: SavolBolim): KonikmaQator[] {
  const m = new Map<string, KonikmaQator>();
  for (const x of xatolar) {
    if (bolim && x.bolim !== bolim) continue;
    const kalit = `${x.bolim}\t${x.konikma}`;
    const q = m.get(kalit) ?? { bolim: x.bolim, domen: x.domen, konikma: x.konikma, jami: 0, halQilinmagan: 0 };
    q.jami++;
    if (!x.hal) q.halQilinmagan++;
    m.set(kalit, q);
  }
  return [...m.values()].sort((a, b) =>
    b.halQilinmagan - a.halQilinmagan || b.jami - a.jami
    || (a.konikma === '' ? 1 : 0) - (b.konikma === '' ? 1 : 0) || a.konikma.localeCompare(b.konikma));
}

// ---------- CSV ----------

/** Bitta katak: qo'shtirnoq ekranlanadi; = + - @ TAB CR bilan boshlansa ' qo'shiladi (formula injection). */
export function csvKatak(v: string | number | boolean | null): string {
  if (v === null) return '';
  let s = String(v);
  if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) || s !== s.trim() ? `"${s.replace(/"/g, '""')}"` : s;
}

const csv = (qatorlar: (string | number | boolean | null)[][]) => '﻿' + qatorlar.map((q) => q.map(csvKatak).join(',')).join('\r\n') + '\r\n';

export function testlarCsv(o: Ombor): string {
  const u = urinishlar(o.testlar);
  return csv([
    ['type', 'attempt', 'name', 'date', 'reading_writing', 'math', 'total', 'minutes', 'notes'],
    ...xronologik(o.testlar).map((t) => [TUR_NOMI[t.turi], u.get(t.id) ?? null, t.nomi, t.sana, t.rw, t.math, jami(t), t.daqiqa, t.izoh]),
  ]);
}

export function xatolarCsv(o: Ombor): string {
  const testlar = new Map(o.testlar.map((t) => [t.id, t]));
  const tartib = new Map(xronologik(o.testlar).map((t, i) => [t.id, i]));
  const xatolar = [...o.xatolar].sort((a, b) =>
    (tartib.get(a.testId) ?? 0) - (tartib.get(b.testId) ?? 0) || a.bolim.localeCompare(b.bolim) || a.modul - b.modul || a.savol - b.savol);
  return csv([
    ['test_name', 'test_date', 'section', 'module', 'question', 'domain', 'skill', 'reason', 'note', 'resolved'],
    ...xatolar.map((x) => {
      const t = testlar.get(x.testId);
      return [t?.nomi ?? '', t?.sana ?? '', BOLIM_NOMI[x.bolim], x.modul, x.savol, x.domen, x.konikma, sababNomi(x.sabab), x.izoh, x.hal ? 'yes' : 'no'];
    }),
  ]);
}

// ---------- Chizma geometriyasi ----------

export interface ChizmaNuqta {
  id: string;
  x: number;
  y: number;
  qiymat: number;
  turi: TestTuri;
  sana: string;
}
export interface Chizma {
  nuqtalar: ChizmaNuqta[];
  /** Y o'qi chiziqlari (ball, y) */
  belgilar: { qiymat: number; y: number }[];
  min: number;
  max: number;
}

/** Jami ball chizmasi: X teng oraliqli (sana tartibida), Y 400–1600 ichida ma'lumotga moslangan 100 lik oraliq. */
export function chizmaHisobla(testlar: readonly RasmiyTest[], o: { en: number; boy: number; chap: number; ong: number; tepa: number; past: number }): Chizma {
  const tartib = xronologik(testlar);
  const qiymatlar = tartib.map(jami);
  let min = qiymatlar.length ? Math.floor((Math.min(...qiymatlar) - 50) / 100) * 100 : 400;
  let max = qiymatlar.length ? Math.ceil((Math.max(...qiymatlar) + 50) / 100) * 100 : 1600;
  min = Math.max(400, min);
  max = Math.min(1600, max);
  if (max - min < 200) { if (max + 100 <= 1600) max += 100; if (max - min < 200) min = Math.max(400, max - 200); }
  const qadam = max - min > 600 ? 200 : 100;
  const ichkiEn = o.en - o.chap - o.ong;
  const ichkiBoy = o.boy - o.tepa - o.past;
  const yHisob = (v: number) => o.tepa + ichkiBoy * (1 - (v - min) / (max - min));
  const n = tartib.length;
  const nuqtalar = tartib.map((t, i) => ({
    id: t.id,
    x: o.chap + (n === 1 ? ichkiEn / 2 : (ichkiEn * i) / (n - 1)),
    y: yHisob(jami(t)),
    qiymat: jami(t),
    turi: t.turi,
    sana: t.sana,
  }));
  const belgilar: Chizma['belgilar'] = [];
  for (let v = Math.ceil(min / qadam) * qadam; v <= max; v += qadam) belgilar.push({ qiymat: v, y: yHisob(v) });
  return { nuqtalar, belgilar, min, max };
}

/** Yangi id: crypto.randomUUID bo'lmasa vaqt + tasodifiy. */
export function yangiId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  return c?.randomUUID ? c.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
