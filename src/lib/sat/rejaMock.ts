// FAQAT DEV: reja sahifasini bazasiz sinash (?mock=anon|bosh|reja|limit|tugadi|taklif|xato).
// Sahifa buni faqat import.meta.env.DEV ichida dinamik import qiladi: prod build'ga kirmaydi.
// Holat xotirada: sahifa yangilansa boshidan. Kvota qoidasi save_study_plan bilan bir xil (har saqlash 1).
import { rejaTuz, serverArgumentlari, kunQosh, type RejaQator, type VazifaQator, type SkillStat } from './reja.ts';
import type { FaolReja, RejaApi } from './rejaApi.ts';
import type { UsageJavob } from './usageBar.ts';

/** anon: hisobsiz; bosh: kirgan, reja yo'q; reja: faol reja bor; limit: oyiga 3, 1 ishlatilgan;
 * tugadi: oyiga 1, ishlatilgan (saqlash quota_exceeded); taklif: zaif skill statistikasi bor; xato: yuklash xatosi. */
export type MockTur = 'anon' | 'bosh' | 'reja' | 'limit' | 'tugadi' | 'taklif' | 'xato';

const kut = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function mockApi(tur: MockTur, bugun: string): RejaApi | null {
  if (tur === 'anon') return null;
  const max = tur === 'limit' ? 3 : tur === 'tugadi' ? 1 : null;
  let used = tur === 'limit' || tur === 'tugadi' ? 1 : 0;
  let faol: FaolReja | null = null;
  let n = 0;

  const yarat = (a: ReturnType<typeof serverArgumentlari>): FaolReja => {
    const id = `mock-plan-${++n}`;
    const plan: RejaQator = { id, ...a.p_plan, created_at: new Date().toISOString() };
    const tasks: VazifaQator[] = a.p_tasks.map((t, i) => ({ id: `${id}-t${i}`, position: i, ...t }));
    return { plan, tasks };
  };
  if (tur === 'reja') {
    // 10 kun oldin tuzilgan reja: o'tgan kunlarda bajarilmagan topshiriqlar bor ("Move missed tasks" sinovi).
    const boshi = kunQosh(bugun, -10);
    const r = rejaTuz({ bugun: boshi, imtihon: kunQosh(bugun, 40), maqsad: 1450, soat: 8, zaif: ['Transitions', 'Circles'] });
    r.topshiriqlar.slice(0, 3).forEach((t) => (t.bajarildi = `${t.kun}T12:00:00.000Z`));
    faol = yarat(serverArgumentlari(r));
  }
  const stat: SkillStat[] = tur === 'taklif'
    ? [
        { section: 'rw', skill: 'Transitions', answered: 12, correct: 5 },
        { section: 'math', skill: 'Circles', answered: 6, correct: 2 },
        { section: 'math', skill: 'Percentages', answered: 9, correct: 8 },
      ]
    : [];

  return {
    async profil() {
      await kut(200);
      if (tur === 'xato') throw new TypeError('fetch failed');
      return { target_score: 1400, exam_date: kunQosh(bugun, 30) };
    },
    async faolReja() {
      await kut(300);
      if (tur === 'xato') throw new TypeError('fetch failed');
      return faol ? structuredClone(faol) : null;
    },
    async stat() { await kut(200); return stat; },
    async usage(): Promise<UsageJavob> {
      await kut(100);
      if (max === null) return { plan: { code: 'free', name: 'Free' }, limits: {} };
      const oy = new Date(); oy.setUTCMonth(oy.getUTCMonth() + 1, 1);
      return { plan: { code: 'free', name: 'Free' }, limits: { plan_rebuilds: { max, per: 'month', used, remaining: Math.max(max - used, 0), resets_at: oy.toISOString() } } };
    },
    async saqla(a) {
      await kut(500);
      if (max !== null && used + 1 > max) throw { message: 'quota_exceeded', code: 'P0001' };
      used++;
      faol = yarat(a);
      return faol.plan.id;
    },
    async belgila(id, doneAt) {
      await kut(150);
      const t = faol?.tasks.find((x) => x.id === id);
      if (!t) throw new Error('not_found');
      t.done_at = doneAt;
    },
    async kochir(list) {
      await kut(300);
      for (const x of list) { const t = faol?.tasks.find((y) => y.id === x.id); if (t) { t.due_on = x.due_on; t.week = x.week; } }
    },
    async ochir() { await kut(200); faol = null; },
  };
}
