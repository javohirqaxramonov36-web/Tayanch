// FAQAT DEV: analitika panelini bazasiz sinash uchun soxta javoblar
// (?mock=bosh|kam|kop|free|xato|uzilish|anon). Sahifa buni faqat `import.meta.env.DEV` ichida dinamik import qiladi:
// prod build'ga kirmaydi. Raqamlar sun'iy va ekranda "Sample data" deb belgilanadi.
// uzilish: birinchi so'rov TypeError("Failed to fetch"), "Try again" dan keyin `kop` javobi.
import { savolTaksonomiya, type SavolBolim } from '../../data/satTaksonomiya.ts';

export type MockTur = 'bosh' | 'kam' | 'kop' | 'free' | 'xato' | 'uzilish';
export const MOCK_TURLAR: readonly string[] = ['bosh', 'kam', 'kop', 'free', 'xato', 'uzilish'];

const bugun = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent' }).format(new Date());
const kunOldin = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};
// Takrorlanadigan "tasodif": har yuklashda bir xil rasm.
const tasodif = (urug: number) => () => ((urug = (urug * 1664525 + 1013904223) % 4294967296) / 4294967296);

function kop(extended: boolean) {
  const t = bugun();
  const r = tasodif(14);
  const skills = (['rw', 'math'] as SavolBolim[]).flatMap((section) =>
    Object.entries(savolTaksonomiya[section]).flatMap(([domain, nomlar]) =>
      nomlar.flatMap((skill, i) => {
        const attempts = i === 2 ? 3 : Math.floor(6 + r() * 40);
        if (section === 'math' && domain === 'Geometry and Trigonometry' && i === 3) return [];
        return [{ section, domain, skill, attempts, correct: Math.round(attempts * (0.35 + r() * 0.63)) }];
      })));
  const jami = (s: string, k: 'attempts' | 'correct') => skills.filter((x) => x.section === s).reduce((a, x) => a + x[k], 0);
  const days = Array.from({ length: 90 }, (_, i) => ({ date: kunOldin(t, 89 - i), attempts: i > 86 || r() > 0.45 ? Math.ceil(r() * r() * 40) : 0 }))
    .filter((d) => d.attempts > 0);
  const attempts = jami('rw', 'attempts') + jami('math', 'attempts');
  return {
    tz: 'Asia/Tashkent', today: t, extended,
    totals: { attempts, correct: jami('rw', 'correct') + jami('math', 'correct'), bookmarks: 17, streak: 3, active_days: days.length },
    sections: [
      { section: 'math', attempts: jami('math', 'attempts'), correct: jami('math', 'correct'), time_ms: 11_100_000 },
      { section: 'rw', attempts: jami('rw', 'attempts'), correct: jami('rw', 'correct'), time_ms: 7_380_000 },
    ],
    skills, days,
    reasons: [{ tag: 'concept_gap', count: 21 }, { tag: 'careless', count: 14 }, { tag: 'misread', count: 6 }, { tag: 'time_pressure', count: 5 }, { tag: 'eski_teg', count: 2 }],
    reasons_untagged: 9,
    difficulty: extended ? [
      { band: 'easy', attempts: Math.round(attempts * 0.4), correct: Math.round(attempts * 0.4 * 0.88), timed: 200, median_ms: 48_400 },
      { band: 'medium', attempts: Math.round(attempts * 0.4), correct: Math.round(attempts * 0.4 * 0.67), timed: 190, median_ms: 72_000 },
      { band: 'hard', attempts: Math.round(attempts * 0.2), correct: Math.round(attempts * 0.2 * 0.41), timed: 0, median_ms: null },
    ] : null,
  };
}

const javoblar: Record<Exclude<MockTur, 'xato' | 'uzilish'>, () => unknown> = {
  bosh: () => ({
    tz: 'Asia/Tashkent', today: bugun(), extended: false,
    totals: { attempts: 0, correct: 0, bookmarks: 0, streak: 0, active_days: 0 },
    sections: [], skills: [], days: [], reasons: [], reasons_untagged: 0, difficulty: null,
  }),
  kam: () => {
    const t = bugun();
    return {
      tz: 'Asia/Tashkent', today: t, extended: true,
      totals: { attempts: 7, correct: 4, bookmarks: 1, streak: 1, active_days: 2 },
      sections: [{ section: 'math', attempts: 4, correct: 3, time_ms: 250_000 }, { section: 'rw', attempts: 3, correct: 1, time_ms: 20_000 }],
      skills: [
        { section: 'math', domain: 'Algebra', skill: 'Linear functions', attempts: 4, correct: 3 },
        { section: 'rw', domain: 'Expression of Ideas', skill: 'Transitions', attempts: 3, correct: 1 },
      ],
      days: [{ date: kunOldin(t, 6), attempts: 3 }, { date: t, attempts: 4 }],
      reasons: [], reasons_untagged: 3,
      difficulty: [{ band: 'easy', attempts: 5, correct: 4, timed: 5, median_ms: 31_000 }, { band: 'medium', attempts: 2, correct: 0, timed: 2, median_ms: 64_000 }],
    };
  },
  kop: () => kop(true),
  free: () => kop(false),
};

export function mockApi(tur: MockTur) {
  let urinish = 0;
  const kut = (ms: number) => new Promise((ok) => setTimeout(ok, ms));
  return {
    async xulosa(): Promise<unknown> {
      await kut(350);
      urinish += 1;
      if (tur === 'xato') throw { message: 'mock server error', code: 'P0001' };
      if (tur === 'uzilish') {
        if (urinish === 1) throw new TypeError('Failed to fetch');
        return kop(true);
      }
      return javoblar[tur]();
    },
    // Birinchi bosish: mos savol yo'q; ikkinchisi: kvota tugagan; keyin: tarmoq xatosi.
    async boshlash(): Promise<{ session_id: string | null }> {
      await kut(350);
      urinish += 1;
      if (urinish % 3 === 2) return { session_id: null };
      if (urinish % 3 === 0) throw { message: 'quota_exceeded' };
      throw new TypeError('Failed to fetch');
    },
  };
}
