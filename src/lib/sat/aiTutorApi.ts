// AI Tutor: brauzer API'si (Supabase RPC, RLS bilan o'z tarixi, Edge Function ai-tutor).
// Dev mock (aiTutorMock.ts) xuddi shu interfeysni beradi.
import { hisobMijoz } from '../hisob';
import { funksiya, type FunksiyaNatija } from '../funksiya';
import type { Suhbat, Tekshiruv, TutorXabar, XatoTanlov } from './aiTutor';
import type { UsageJavob } from './usageBar';

export interface YuborTana {
  mode: 'attempt' | 'own';
  message: string;
  attempt_id?: number;
  conversation_id?: string | null;
}

export interface YuborJavob {
  conversation_id: string | null;
  reply: string;
  check: Tekshiruv;
}

export interface TutorApi {
  holat(): Promise<{ status: { available?: boolean; reason?: string | null }; usage: UsageJavob | null }>;
  xatolar(): Promise<XatoTanlov[]>;
  suhbatlar(): Promise<Suhbat[]>;
  xabarlar(id: string): Promise<TutorXabar[]>;
  yubor(t: YuborTana): Promise<FunksiyaNatija<YuborJavob>>;
  ochir(id: string): Promise<void>;
  hammasiniOchir(): Promise<void>;
}

export function haqiqiyApi(userId: string): TutorApi | null {
  const c = hisobMijoz();
  if (!c) return null;
  const tashla = (e: unknown) => {
    if (e) throw e;
  };
  return {
    async holat() {
      const [s, u] = await Promise.all([c.rpc('ai_tutor_status'), c.rpc('usage_status')]);
      tashla(s.error);
      return { status: s.data ?? {}, usage: u.error ? null : (u.data as UsageJavob) };
    },
    async xatolar() {
      const { data, error } = await c.rpc('ai_recent_mistakes', { p_limit: 20 });
      tashla(error);
      return (data ?? []) as XatoTanlov[];
    },
    async suhbatlar() {
      const { data, error } = await c.from('ai_conversations')
        .select('id, mode, attempt_id, title, updated_at').order('updated_at', { ascending: false }).limit(30);
      tashla(error);
      return (data ?? []) as Suhbat[];
    },
    async xabarlar(id) {
      const { data, error } = await c.from('ai_messages')
        .select('role, content, check_status').eq('conversation_id', id).order('id', { ascending: true });
      tashla(error);
      return (data ?? []) as TutorXabar[];
    },
    yubor: (t) => funksiya<YuborJavob>('ai-tutor', { ...t }),
    async ochir(id) {
      const { error } = await c.from('ai_conversations').delete().eq('id', id);
      tashla(error);
    },
    async hammasiniOchir() {
      const { error } = await c.from('ai_conversations').delete().eq('user_id', userId);
      tashla(error);
    },
  };
}
