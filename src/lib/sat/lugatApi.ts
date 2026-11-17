// SAT lug'ati (P15): Supabase bilan ishlash. Faqat brauzer <script> ichida.
// So'zlar (vocab_words, tasdiqlangan) hisobsiz ham o'qiladi; progress, kvota va o'z so'zlari faqat hisob bilan (RPC).
// Xatolar kodga aylantiriladi: ekranda inglizcha matn sahifada tanlanadi.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Quti } from '../leitner.ts';
import { kalitQil, type Qiyinlik, type Soz, type SozHolat } from './lugat.ts';

export type XatoKod = 'quota' | 'feature' | 'duplicate' | 'not_found' | 'invalid' | 'auth' | 'network';
export class LugatXato extends Error {
  constructor(public kod: XatoKod) { super(kod); }
}

export interface LugatHolat {
  today: string;
  /** null: cheklov yo'q */
  yangiQoldiq: number | null;
  yangiMax: number | null;
  ozSozlar: boolean;
  importQilingan: boolean;
}

export interface OzSozKiritma { word: string; definition: string; pos: string | null; example: string | null }

export interface LugatApi {
  /** Tasdiqlangan so'zlar (bo'sh bo'lishi mumkin) */
  sozlar(): Promise<Soz[]>;
  /** Kirgan foydalanuvchi id si; kirmagan bo'lsa null */
  foydalanuvchi(): Promise<string | null>;
  holat(): Promise<LugatHolat>;
  /** Server progressi va o'z so'zlari */
  progress(): Promise<{ holat: Map<string, SozHolat>; ozlari: Soz[] }>;
  baholash(s: Soz, togri: boolean): Promise<SozHolat>;
  yulduz(s: Soz, qiymat: boolean): Promise<void>;
  importLokal(royxat: unknown[]): Promise<number>;
  ozQosh(k: OzSozKiritma): Promise<Soz>;
  ozOchir(id: string): Promise<void>;
}

const QIY = new Set(['easy', 'medium', 'hard']);
interface SozQator { id: string; word: string; part_of_speech: string | null; definition: string; example: string | null; difficulty?: string | null; topic?: string | null; uzbek?: string | null }

export function qatordanSoz(r: SozQator, oz = false): Soz {
  return {
    kalit: oz ? `oz:${kalitQil(r.word)}` : kalitQil(r.word),
    id: r.id,
    word: r.word,
    pos: r.part_of_speech ?? null,
    definition: r.definition,
    example: r.example ?? null,
    difficulty: r.difficulty && QIY.has(r.difficulty) ? (r.difficulty as Qiyinlik) : null,
    topic: r.topic ?? null,
    uzbek: r.uzbek ?? null,
    oz,
  };
}

const quti = (x: unknown): Quti | null => ([1, 2, 3, 4, 5].includes(x as number) ? (x as Quti) : null);
const bahoQil = (s: string | null): SozHolat['baho'] => (s === 'known' ? 'bilaman' : s === 'learning' ? 'organ' : null);

function xatoKodi(e: { code?: string; message?: string } | null | undefined): XatoKod {
  const m = e?.message ?? '';
  if (m.includes('quota_exceeded')) return 'quota';
  if (m.includes('feature_not_available')) return 'feature';
  if (e?.code === '23505' || m.includes('duplicate_word')) return 'duplicate';
  if (m.includes('word_not_found')) return 'not_found';
  if (m.includes('invalid_input') || m.includes('too_many_words')) return 'invalid';
  if (e?.code === '42501' || m.includes('not_authenticated')) return 'auth';
  return 'network';
}

async function rpc<T>(c: SupabaseClient, nom: string, args?: Record<string, unknown>): Promise<T> {
  let natija;
  try { natija = await c.rpc(nom, args); } catch { throw new LugatXato('network'); }
  if (natija.error) throw new LugatXato(xatoKodi(natija.error));
  return natija.data as T;
}

export function haqiqiyApi(c: SupabaseClient): LugatApi {
  return {
    async sozlar() {
      const { data, error } = await c.from('vocab_words')
        .select('id, word, part_of_speech, definition, example, difficulty, topic, uzbek')
        .order('word');
      if (error) throw new LugatXato('network');
      return (data as SozQator[]).map((r) => qatordanSoz(r));
    },
    async foydalanuvchi() {
      const { data } = await c.auth.getSession();
      return data.session?.user.id ?? null;
    },
    async holat() {
      const r = await rpc<{ today: string; new_words: { max: number | null; remaining: number | null }; my_words: boolean; imported: boolean }>(c, 'vocab_status');
      return { today: r.today, yangiQoldiq: r.new_words.remaining, yangiMax: r.new_words.max, ozSozlar: r.my_words, importQilingan: r.imported };
    },
    async progress() {
      const [p, o] = await Promise.all([
        c.from('vocab_progress').select('box, next_due, status, starred, vocab_words!inner(word)'),
        c.from('user_vocab_words').select('id, word, part_of_speech, definition, example, box, next_due, status, starred').order('created_at'),
      ]);
      if (p.error || o.error) throw new LugatXato('network');
      const holat = new Map<string, SozHolat>();
      for (const r of p.data as unknown as { box: number | null; next_due: string | null; status: string; starred: boolean; vocab_words: { word: string } }[]) {
        holat.set(kalitQil(r.vocab_words.word), { quti: quti(r.box), keyingi: r.next_due, baho: bahoQil(r.status), yulduz: r.starred });
      }
      const ozlari = (o.data as (SozQator & { box: number | null; next_due: string | null; status: string; starred: boolean })[]).map((r) => {
        const s = qatordanSoz(r, true);
        holat.set(s.kalit, { quti: quti(r.box), keyingi: r.next_due, baho: bahoQil(r.status), yulduz: r.starred });
        return s;
      });
      return { holat, ozlari };
    },
    async baholash(s, togri) {
      const r = await rpc<{ box: number; next_due: string; status: string; starred: boolean }>(c, 'vocab_rate', { p_word: s.id, p_known: togri, p_own: s.oz });
      return { quti: quti(r.box), keyingi: r.next_due, baho: bahoQil(r.status), yulduz: r.starred };
    },
    async yulduz(s, qiymat) { await rpc(c, 'vocab_star', { p_word: s.id, p_starred: qiymat, p_own: s.oz }); },
    async importLokal(royxat) {
      const r = await rpc<{ imported: number }>(c, 'vocab_import_local', { p_items: royxat });
      return r.imported;
    },
    async ozQosh(k) {
      const r = await rpc<SozQator>(c, 'user_word_add', { p_word: k.word, p_definition: k.definition, p_part_of_speech: k.pos, p_example: k.example });
      return qatordanSoz(r, true);
    },
    async ozOchir(id) {
      const { error } = await c.from('user_vocab_words').delete().eq('id', id);
      if (error) throw new LugatXato('network');
    },
  };
}
