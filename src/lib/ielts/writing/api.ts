// IELTS Writing baholash: brauzer API'si (Supabase sessiya, RPC ielts_writing_status, RLS bilan o'z natijalari,
// Edge Function ielts-writing-baho). Dev mock (faqat `npm run dev`, ?mock=...) xuddi shu interfeysni beradi.
import { funksiya, type FunksiyaNatija } from '../../funksiya';
import { hisobMijoz } from '../../hisob';
import type { BahoJavob, BahoNatija } from './baho';

export interface Holat {
  /** Kirgan foydalanuvchi bormi. */
  kirgan: boolean;
  available: boolean;
  daily_limit: number;
  remaining: number;
}

export interface OldingiNatija {
  id: string;
  created_at: string;
  prompt: string;
  word_count: number;
  task_band: number;
  result: BahoNatija;
}

export interface YuborTana {
  prompt: string;
  prompt_id: string | null;
  essay: string;
}

/** Xato javobidagi qo'shimcha maydonlar (funksiya() faqat kodni beradi). */
export type YuborNatija = FunksiyaNatija<BahoJavob>;

export interface WritingApi {
  holat(): Promise<Holat>;
  oldingilar(): Promise<OldingiNatija[]>;
  yubor(t: YuborTana): Promise<YuborNatija>;
  ochir(id: string): Promise<void>;
}

export function haqiqiyApi(): WritingApi | null {
  const c = hisobMijoz();
  if (!c) return null;
  return {
    async holat() {
      const { data } = await c.auth.getSession();
      if (!data.session) return { kirgan: false, available: false, daily_limit: 0, remaining: 0 };
      const r = await c.rpc('ielts_writing_status');
      if (r.error) throw r.error;
      const s = r.data as { available?: boolean; daily_limit?: number; remaining?: number };
      return { kirgan: true, available: !!s.available, daily_limit: Number(s.daily_limit ?? 0), remaining: Number(s.remaining ?? 0) };
    },
    async oldingilar() {
      const { data, error } = await c.from('ielts_writing_results')
        .select('id, created_at, prompt, word_count, task_band, result')
        .order('created_at', { ascending: false }).limit(5);
      if (error) throw error;
      return (data ?? []).map((x) => ({ ...x, task_band: Number(x.task_band) })) as OldingiNatija[];
    },
    yubor: (t) => funksiya<BahoJavob>('ielts-writing-baho', { task_type: 'task2', ...t }),
    async ochir(id) {
      const { error } = await c.from('ielts_writing_results').delete().eq('id', id);
      if (error) throw error;
    },
  };
}

// ---- Dev mock: ?mock=ok | kesh | limit | yopiq | xato | kirmagan ----

const NAMUNA_MEZON = (band: number, misol: string) => ({
  band,
  feedback: 'Sample: you give a clear position, but some ideas are listed rather than explained.',
  example_from_text: misol,
  improvement_tip: 'Sample: add one specific example to each body paragraph and explain how it supports your view.',
});

export function mockApi(rejim: string): WritingApi {
  let qoldi = rejim === 'limit' ? 0 : 2;
  const saqlangan: OldingiNatija[] = [];
  const kut = (ms: number) => new Promise((r) => setTimeout(r, ms));
  return {
    async holat() {
      if (rejim === 'kirmagan') return { kirgan: false, available: false, daily_limit: 0, remaining: 0 };
      return { kirgan: true, available: rejim !== 'yopiq', daily_limit: 2, remaining: rejim === 'yopiq' ? 0 : qoldi };
    },
    async oldingilar() {
      return [...saqlangan];
    },
    async yubor(t) {
      await kut(1200);
      if (rejim === 'kirmagan') return { ok: false, kod: 'not_signed_in', status: 401 };
      if (rejim === 'yopiq') return { ok: false, kod: 'ai_paused', status: 503 };
      if (rejim === 'xato') return { ok: false, kod: 'assessment_failed', status: 502 };
      if (qoldi <= 0) return { ok: false, kod: 'quota_exceeded', status: 429 };
      const soz = t.essay.split(/\s+/).filter((b) => /[\p{L}\p{N}]/u.test(b)).length;
      const birinchi = t.essay.trim().split(/\s+/).slice(0, 6).join(' ');
      const result: BahoNatija = {
        criteria: {
          task_response: NAMUNA_MEZON(6.5, birinchi),
          coherence_cohesion: NAMUNA_MEZON(6, ''),
          lexical_resource: NAMUNA_MEZON(6.5, birinchi),
          grammatical_range_accuracy: NAMUNA_MEZON(6, ''),
        },
        overall_summary: 'Sample: your opinion is clear and easy to follow. The main weakness is that body paragraphs need more developed support.',
        under_length: soz < 250,
      };
      const kesh = rejim === 'kesh';
      if (!kesh) qoldi--;
      const id = crypto.randomUUID();
      saqlangan.unshift({ id, created_at: new Date().toISOString(), prompt: t.prompt, word_count: soz, task_band: 6, result });
      return { ok: true, data: { result_id: id, cached: kesh, task_band: 6, word_count: soz, under_length: soz < 250, result, remaining: kesh ? null : qoldi } };
    },
    async ochir(id) {
      const i = saqlangan.findIndex((x) => x.id === id);
      if (i >= 0) saqlangan.splice(i, 1);
    },
  };
}
