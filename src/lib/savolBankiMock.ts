// FAQAT DEV: Savol banki sahifasini bazasiz sinash uchun soxta RPC javoblari (?mock=bosh|kam|kop|kvota|kvota2|xato).
// Sahifa buni faqat `import.meta.env.DEV` ichida dinamik import qiladi: prod build'ga kirmaydi (dist'da tekshiriladi).
import { savolTaksonomiya, type SavolBolim } from '../data/satTaksonomiya.ts';
import type { SonGuruh, SonJavob, UsageJavob } from './savolBanki.ts';

/** kvota: bugungi limit tugagan; kvota2: limit ko'rinmaydi, lekin start_session quota_exceeded qaytaradi. */
export type MockTur = 'bosh' | 'kam' | 'kop' | 'kvota' | 'kvota2' | 'xato';

interface Api {
  sonlar(f: Record<string, unknown>): Promise<SonJavob>;
  boshlash(f: Record<string, unknown>, hajm: number, rejim: string): Promise<{ session_id: string | null; mode: string; questions: unknown[] }>;
  kvota(): Promise<UsageJavob>;
}

const kut = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Deterministik "baza": kam — bir nechta skill'da 1–3 savol; kop — hamma skill'da 6–40. */
function baza(tur: MockTur): SonGuruh[] {
  if (tur === 'bosh' || tur === 'xato') return [];
  const g: SonGuruh[] = [];
  let i = 0;
  for (const section of ['rw', 'math'] as SavolBolim[]) {
    for (const [domain, skills] of Object.entries(savolTaksonomiya[section])) {
      for (const skill of skills) {
        i++;
        for (let d = 1; d <= 5; d++) {
          const total = tur === 'kam' ? (i % 4 === 0 && d <= 3 ? d : 0) : ((i * 7 + d * 3) % 9) + 1;
          if (total) g.push({ section, domain, skill, difficulty: d, total, answered: Math.floor(total / 3) });
        }
      }
    }
  }
  return g;
}

export function mockApi(tur: MockTur): Api {
  const hammasi = baza(tur);
  return {
    async sonlar(f) {
      await kut(500);
      if (tur === 'xato') throw new TypeError('Failed to fetch (mock)');
      const d = Array.isArray(f.difficulties) ? (f.difficulties as number[]) : [];
      const groups = hammasi
        .filter((g) => !f.section || g.section === f.section)
        .filter((g) => !d.length || d.includes(g.difficulty))
        .map((g) => {
          let total = g.total;
          if (f.unanswered_only) total -= g.answered;
          if (f.bookmarked_only) total = Math.floor(total / 4);
          if (f.incorrect_only) total = Math.floor(g.answered / 2);
          return { ...g, total };
        })
        .filter((g) => g.total > 0);
      return { total: groups.reduce((a, g) => a + g.total, 0), groups };
    },
    async boshlash(_f, hajm, rejim) {
      await kut(600);
      if (tur === 'kvota' || tur === 'kvota2') throw { message: 'quota_exceeded', code: 'P0001' };
      return { session_id: `mock-${Date.now()}`, mode: rejim, questions: Array.from({ length: hajm }, (_, i) => ({ position: i + 1 })) };
    },
    async kvota() {
      await kut(200);
      if (tur === 'kvota') return { plan: { code: 'free', name: 'Free' }, limits: { questions: { max: 20, per: 'day', used: 20, remaining: 0 } } };
      if (tur === 'kam') return { plan: { code: 'free', name: 'Free' }, limits: { questions: { max: 20, per: 'day', used: 8, remaining: 12 } } };
      return { plan: { code: 'free', name: 'Free' }, limits: {} };
    },
  };
}
