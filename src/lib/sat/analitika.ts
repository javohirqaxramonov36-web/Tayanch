// Analitika paneli (P14): public.analytics_summary() javobi ustidagi sof hisob-kitob. DOM yo'q, sinovi: src/lib/testlar/analitika.test.ts.
import { analitikaSozlama as S } from '../../data/satAnalitika.ts';
import { savolTaksonomiya, type SavolBolim } from '../../data/satTaksonomiya.ts';

export interface SkillQator { section: string; domain: string; skill: string; attempts: number; correct: number }
export interface BolimQator { section: string; attempts: number; correct: number; time_ms: number }
export interface KunQator { date: string; attempts: number }
export interface SababQator { tag: string; count: number }
export interface QiyinlikQator { band: string; attempts: number; correct: number; timed: number; median_ms: number | null }

export interface Xulosa {
  tz: string;
  today: string;
  extended: boolean;
  totals: { attempts: number; correct: number; bookmarks: number; streak: number; active_days: number };
  sections: BolimQator[];
  skills: SkillQator[];
  days: KunQator[];
  reasons: SababQator[];
  reasons_untagged: number;
  difficulty: QiyinlikQator[] | null;
}

export type Holat = 'strong' | 'developing' | 'needs-work' | 'low-data' | 'none';

export const HOLAT_NOMI: Record<Holat, string> = {
  strong: 'Strong',
  developing: 'Developing',
  'needs-work': 'Needs work',
  'low-data': 'Not enough data',
  none: 'No attempts yet',
};

const son = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) && x > 0 ? x : 0);

/** Aniqlik, butun foiz. Urinish yo'q bo'lsa null (0% emas: soxta raqam ko'rsatilmaydi). */
export const foiz = (correct: number, attempts: number): number | null =>
  attempts > 0 ? Math.round((Math.min(correct, attempts) / attempts) * 100) : null;

/** Holat yaxlitlanmagan aniqlikdan: 84,6% "Strong" bo'lib qolmasin. */
export function holat(correct: number, attempts: number): Holat {
  if (attempts <= 0) return 'none';
  if (attempts < S.minUrinish) return 'low-data';
  const a = (correct / attempts) * 100;
  return a >= S.kuchli ? 'strong' : a >= S.rivojlanmoqda ? 'developing' : 'needs-work';
}

/** Server javobini tekshirib, kutilgan shaklga keltiradi. Shakl butunlay boshqacha bo'lsa null. */
export function xulosaOqi(x: unknown): Xulosa | null {
  if (!x || typeof x !== 'object') return null;
  const j = x as Record<string, any>;
  if (!j.totals || typeof j.totals !== 'object' || typeof j.today !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(j.today)) return null;
  const qator = <T,>(v: unknown, f: (r: Record<string, any>) => T | null): T[] =>
    Array.isArray(v) ? v.flatMap((r) => { const y = r && typeof r === 'object' ? f(r) : null; return y ? [y] : []; }) : [];
  const matn = (v: unknown) => (typeof v === 'string' ? v : '');
  return {
    tz: matn(j.tz) || S.vaqtMintaqasi,
    today: j.today,
    extended: j.extended === true,
    totals: {
      attempts: son(j.totals.attempts), correct: son(j.totals.correct), bookmarks: son(j.totals.bookmarks),
      streak: son(j.totals.streak), active_days: son(j.totals.active_days),
    },
    sections: qator(j.sections, (r) => (matn(r.section) ? { section: r.section, attempts: son(r.attempts), correct: son(r.correct), time_ms: son(r.time_ms) } : null)),
    skills: qator(j.skills, (r) => (matn(r.skill) && matn(r.section)
      ? { section: r.section, domain: matn(r.domain), skill: r.skill, attempts: son(r.attempts), correct: son(r.correct) } : null)),
    days: qator(j.days, (r) => (/^\d{4}-\d{2}-\d{2}$/.test(matn(r.date)) ? { date: r.date, attempts: son(r.attempts) } : null)),
    reasons: qator(j.reasons, (r) => (matn(r.tag) ? { tag: r.tag, count: son(r.count) } : null)),
    reasons_untagged: son(j.reasons_untagged),
    difficulty: j.extended === true
      ? qator(j.difficulty, (r) => (matn(r.band)
        ? { band: r.band, attempts: son(r.attempts), correct: son(r.correct), timed: son(r.timed), median_ms: typeof r.median_ms === 'number' ? son(r.median_ms) : null } : null))
      : null,
  };
}

export interface SkillKorinish extends SkillQator { foiz: number | null; holat: Holat }
export interface DomenGuruh { domain: string; skills: SkillKorinish[] }

const korinish = (q: SkillQator): SkillKorinish => ({ ...q, foiz: foiz(q.correct, q.attempts), holat: holat(q.correct, q.attempts) });

/**
 * Bo'lim jadvali: taksonomiyadagi hamma ko'nikma (urinishsizlari "No attempts yet" bilan),
 * so'ng taksonomiyada yo'q, lekin bazadan kelgan ko'nikmalar o'z domeni ostida.
 */
export function bolimJadvali(skills: readonly SkillQator[], section: SavolBolim): DomenGuruh[] {
  const kelgan = new Map(skills.filter((s) => s.section === section).map((s) => [s.skill, s]));
  const guruhlar: DomenGuruh[] = Object.entries(savolTaksonomiya[section]).map(([domain, nomlar]) => ({
    domain,
    skills: nomlar.map((skill) => {
      const k = kelgan.get(skill);
      kelgan.delete(skill);
      return korinish(k ?? { section, domain, skill, attempts: 0, correct: 0 });
    }),
  }));
  for (const k of kelgan.values()) {
    let g = guruhlar.find((x) => x.domain === k.domain);
    if (!g) guruhlar.push((g = { domain: k.domain || 'Other', skills: [] }));
    g.skills.push(korinish(k));
  }
  return guruhlar;
}

/** "Skills to practice": kamida N urinishli, "Strong" bo'lmagan ko'nikmalar; eng past aniqlik birinchi, 6 tagacha. */
export function tavsiyalar(skills: readonly SkillQator[]): SkillKorinish[] {
  return skills
    .filter((s) => s.attempts >= S.minUrinish)
    .map(korinish)
    .filter((s) => s.holat !== 'strong')
    .sort((a, b) => a.correct / a.attempts - b.correct / b.attempts || b.attempts - a.attempts || a.skill.localeCompare(b.skill))
    .slice(0, S.maxTavsiya);
}

// ---------- Faollik xaritasi ----------

const kunQosh = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
/** Dushanba = 0 … yakshanba = 6. Sana serverdan Toshkent kuni sifatida keladi, bu yerda faqat taqvim arifmetikasi. */
const haftaKuni = (iso: string) => (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;

export interface Katak { date: string; attempts: number; daraja: 0 | 1 | 2 | 3 | 4; ustun: number; qator: number }

/**
 * Oxirgi `kunlar` kun (bugun bilan). Ustun = hafta (dushanbadan), qator = hafta kuni.
 * Daraja foydalanuvchining shu davrdagi eng faol kuniga nisbatan: 0 = urinish yo'q, 1–4 = choraklar.
 */
export function faollikXaritasi(days: readonly KunQator[], today: string, kunlar: number = S.kunlar): { kataklar: Katak[]; ustunlar: number; eng: number } {
  const son = new Map(days.map((d) => [d.date, d.attempts]));
  const bosh = kunQosh(today, -(kunlar - 1));
  const siljish = haftaKuni(bosh);
  const eng = Math.max(0, ...Array.from({ length: kunlar }, (_, i) => son.get(kunQosh(bosh, i)) ?? 0));
  const kataklar: Katak[] = Array.from({ length: kunlar }, (_, i) => {
    const date = kunQosh(bosh, i);
    const attempts = son.get(date) ?? 0;
    const daraja = (attempts === 0 ? 0 : Math.min(4, Math.ceil((attempts / eng) * 4))) as Katak['daraja'];
    return { date, attempts, daraja, ustun: Math.floor((i + siljish) / 7), qator: (i + siljish) % 7 };
  });
  return { kataklar, ustunlar: kataklar[kataklar.length - 1].ustun + 1, eng };
}

// ---------- Yozuv ----------

const OYLAR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "2026-11-08" → "Nov 8" (yil kerak bo'lsa "Nov 8, 2026"). */
export function sanaYozuv(iso: string, yil = false): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${OYLAR[m - 1]} ${d}${yil ? `, ${y}` : ''}`;
}

/** Bitta savol vaqti: "48 s", "1 min 12 s". */
export function soniyaYozuv(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const q = s % 60;
  return q ? `${Math.floor(s / 60)} min ${q} s` : `${Math.floor(s / 60)} min`;
}

/** Jami o'qish vaqti: "0 min", "42 min", "3 h 5 min". */
export function davomYozuv(ms: number): string {
  const min = Math.round(ms / 60000);
  if (min < 60) return ms > 0 && min === 0 ? 'under 1 min' : `${min} min`;
  const q = min % 60;
  return q ? `${Math.floor(min / 60)} h ${q} min` : `${Math.floor(min / 60)} h`;
}

export const kop = (n: number, bir: string, kopi = `${bir}s`) => `${n} ${n === 1 ? bir : kopi}`;

export const BOLIM_NOMI: Record<string, string> = { rw: 'Reading and Writing', math: 'Math' };
export const QIYINLIK_NOMI: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
