// Kun savoli (P10): Supabase RPC'lari. Kirgan bo'lsa daily_question + submit_answer (kvota sarflamaydi),
// kirmagan bo'lsa daily_question_public + check_daily_answer (hech narsa yozmaydi).
// Supabase sozlanmagan build'da null: komponent yashirin qoladi.
import { hisobMijoz } from '../hisob';
import type { KunApi, KunJavob, KunNatija } from './kunSavoli';

export async function kunApi(): Promise<KunApi | null> {
  const c = hisobMijoz();
  if (!c) return null;
  const { data } = await c.auth.getSession();
  const rpc = async <T>(nom: string, args?: Record<string, unknown>): Promise<T> => {
    const { data: d, error } = await c.rpc(nom, args);
    if (error) throw error;
    return d as T;
  };

  if (data.session) {
    return {
      kirgan: true,
      ol: () => rpc<KunJavob>('daily_question'),
      tekshir: async (j, javob) => {
        const r = await rpc<KunNatija>('submit_answer', { p_session: j.session_id, p_question: j.question!.id, p_answer: javob });
        return { is_correct: r.is_correct, correct: r.correct, explanation: r.explanation };
      },
    };
  }
  return {
    kirgan: false,
    ol: () => rpc<KunJavob>('daily_question_public'),
    tekshir: (j, javob) => rpc<KunNatija>('check_daily_answer', { p_question: j.question!.id, p_answer: javob }),
  };
}
