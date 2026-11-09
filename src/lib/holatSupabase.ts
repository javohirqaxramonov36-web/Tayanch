// holat.ts uchun Supabase serveri: public.user_state jadvali (RLS: faqat o'z qatorlari).
// supabase-js'ga bog'liq emas: hisob moduli (P03) o'z mijozini beradi:
//   ulash(supabaseServer(hisobMijoz(), session.user.id), session.user.id)
// Xato matni va qiymatlar console'ga yozilmaydi.
import type { SinxronServer } from './holat.ts';

interface Javob<T> { data: T | null; error: unknown }
/** Supabase mijozining shu yerda ishlatiladigan qismi */
export interface SupabaseMijoz {
  from(jadval: 'user_state'): {
    select(ustunlar: string): { in(ustun: string, qiymatlar: string[]): PromiseLike<Javob<{ key: string; value: unknown }[]>> };
    upsert(qatorlar: { user_id: string; key: string; value: unknown }[], s: { onConflict: string }): PromiseLike<Javob<unknown>>;
  };
}

export function supabaseServer(mijoz: SupabaseMijoz, foydalanuvchiId: string): SinxronServer {
  return {
    async oqi(kalitlar) {
      const { data, error } = await mijoz.from('user_state').select('key,value').in('key', kalitlar);
      if (error) throw new Error('user_state: o\'qib bo\'lmadi');
      return Object.fromEntries((data ?? []).map((q) => [q.key, q.value]));
    },
    async yoz(yozuvlar) {
      if (!yozuvlar.length) return;
      const { error } = await mijoz
        .from('user_state')
        .upsert(yozuvlar.map((y) => ({ user_id: foydalanuvchiId, key: y.kalit, value: y.qiymat })), { onConflict: 'user_id,key' });
      if (error) throw new Error('user_state: yozib bo\'lmadi');
    },
  };
}
