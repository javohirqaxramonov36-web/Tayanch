// Kun savoli (P10): Supabase RPC'lari. Kirgan bo'lsa daily_question + submit_answer (kvota sarflamaydi),
// kirmagan bo'lsa daily_question_public + check_daily_answer (hech narsa yozmaydi).
// Supabase sozlanmagan build'da null: komponent yashirin qoladi.
//
// Mehmon yo'li supabase-js klientini (~216KB) yuklamaydi: ikki ochiq RPC to'g'ridan-to'g'ri PostgREST'ga
// fetch bilan chaqiriladi (supabase-js mehmonda yuboradigan sarlavhalar bilan bir xil: apikey va Bearer ochiq kalit).
// Klient faqat brauzerda saqlangan sessiya bo'lsa dinamik yuklanadi.
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from 'astro:env/client';
import { kirganFoydalanuvchi } from '../hisobHolat';
import type { KunApi, KunJavob, KunNatija } from './kunSavoli';

type Rpc = <T>(nom: string, args?: Record<string, unknown>) => Promise<T>;

// PostgREST xatosi supabase-js PostgrestError bilan bir xil shaklda ({ message, code, details, hint }),
// shuning uchun kunXatoTuri() message bo'yicha avvalgidek ishlaydi.
const mehmonRpc = (url: string, kalit: string): Rpc => async <T>(nom: string, args?: Record<string, unknown>) => {
  const javob = await fetch(`${url}/rest/v1/rpc/${nom}`, {
    method: 'POST',
    headers: { apikey: kalit, Authorization: `Bearer ${kalit}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args ?? {}),
  });
  const matn = await javob.text();
  const malumot = matn ? JSON.parse(matn) : null;
  if (!javob.ok) throw Object.assign(new Error(String(malumot?.message ?? javob.statusText)), malumot ?? {});
  return malumot as T;
};

export async function kunApi(): Promise<KunApi | null> {
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return null;

  if (kirganFoydalanuvchi()) {
    const { hisobMijoz } = await import('../hisob');
    const c = hisobMijoz();
    if (!c) return null;
    const { data } = await c.auth.getSession();
    if (data.session) {
      const rpc: Rpc = async <T>(nom: string, args?: Record<string, unknown>) => {
        const { data: d, error } = await c.rpc(nom, args);
        if (error) throw error;
        return d as T;
      };
      return {
        kirgan: true,
        ol: () => rpc<KunJavob>('daily_question'),
        tekshir: async (j, javob) => {
          const r = await rpc<KunNatija>('submit_answer', { p_session: j.session_id, p_question: j.question!.id, p_answer: javob });
          return { is_correct: r.is_correct, correct: r.correct, explanation: r.explanation };
        },
      };
    }
  }

  const rpc = mehmonRpc(PUBLIC_SUPABASE_URL.replace(/\/+$/, ''), PUBLIC_SUPABASE_ANON_KEY);
  return {
    kirgan: false,
    ol: () => rpc<KunJavob>('daily_question_public'),
    tekshir: (j, javob) => rpc<KunNatija>('check_daily_answer', { p_question: j.question!.id, p_answer: javob }),
  };
}
