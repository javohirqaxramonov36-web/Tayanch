// FAQAT DEV: kun savoli holatlarini brauzerda serversiz ko'rish. Prod build'ga kirmaydi (import.meta.env.DEV shoxi).
// ?kun-mock=mehmon | kirgan | yoq | xato | eskirgan   (&kun-sana=YYYY-MM-DD: sana almashishini simulyatsiya)
// Savollar original sinov matni, ekranda "Sample · dev mock" yorlig'i bilan.
import type { KunApi, KunJavob, KunNatija, KunSavol } from './kunSavoli';

export type KunMockTur = 'mehmon' | 'kirgan' | 'yoq' | 'xato' | 'eskirgan';

const SAVOLLAR: Record<'rw' | 'math', { q: KunSavol; togri: string; izoh: string }> = {
  rw: {
    q: {
      id: 'mock-rw', section: 'rw', format: 'mcq', skill: 'Form, Structure, and Sense',
      stem: 'Before the hike, the volunteers ______ the trail map, so every group knew where the water stations were.',
      options: [
        { key: 'A', text: 'revise' },
        { key: 'B', text: 'revised' },
        { key: 'C', text: 'revising' },
        { key: 'D', text: 'to revise' },
      ],
    },
    togri: 'B',
    izoh: 'The sentence needs a main verb in the past tense: <em>revised</em>. "Revising" and "to revise" cannot be the main verb, and "revise" does not match the past-tense clause that follows.',
  },
  math: {
    q: { id: 'mock-math', section: 'math', format: 'spr', skill: 'Linear equations in one variable', stem: 'If $3x + 5 = 20$, what is the value of $x$?' },
    togri: '5',
    izoh: 'Subtract 5 from both sides: $3x = 15$. Divide both sides by 3: $x = 5$.',
  },
};

const bolim = (sana: string) =>
  Math.round((Date.parse(`${sana}T00:00:00Z`) - Date.parse('2026-01-01T00:00:00Z')) / 86400000) % 2 === 0 ? 'rw' : 'math';

export function kunMock(tur: KunMockTur, sanaParam: string | null): KunApi {
  const sana = sanaParam && /^\d{4}-\d{2}-\d{2}$/.test(sanaParam) ? sanaParam : new Date().toISOString().slice(0, 10);
  const s = SAVOLLAR[bolim(sana)];
  const next = new Date(Date.parse(`${sana}T00:00:00Z`) + 19 * 3600000).toISOString();
  const kirgan = tur === 'kirgan';
  let natija: (KunNatija & { answer: string }) | null = null;
  const streak = { current: 2, active_today: false };
  const kut = () => new Promise((r) => setTimeout(r, 400));

  return {
    kirgan,
    async ol(): Promise<KunJavob> {
      await kut();
      return {
        date: sana, next_at: next,
        question: tur === 'yoq' ? null : s.q,
        session_id: kirgan ? 'mock-sessiya' : null,
        result: kirgan ? natija : null,
        streak: kirgan ? { ...streak } : undefined,
      };
    },
    async tekshir(_j, javob) {
      await kut();
      if (tur === 'xato') throw new TypeError('Failed to fetch');
      if (tur === 'eskirgan') throw new Error('question_not_today');
      const n = { is_correct: javob.trim().toUpperCase() === s.togri, correct: s.togri, explanation: s.izoh };
      if (kirgan) {
        natija = { ...n, answer: javob };
        if (!streak.active_today) { streak.current += 1; streak.active_today = true; }
      }
      return n;
    },
  };
}
