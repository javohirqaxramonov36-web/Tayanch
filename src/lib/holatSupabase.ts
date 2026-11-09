// holat.ts uchun Supabase serveri: public.user_state jadvali (RLS: faqat o'z qatorlari).
// Mijozni hisob moduli (P03, hisobMijoz) beradi; ulash: holatHisob.ts.
// Xato matni va qiymatlar console'ga yozilmaydi.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { SinxronServer } from './holat.ts';

type SupabaseMijoz = Pick<SupabaseClient, 'from'>;

export function supabaseServer(mijoz: SupabaseMijoz, foydalanuvchiId: string): SinxronServer {
  return {
    async oqi(kalitlar) {
      const { data, error } = await mijoz.from('user_state').select('key,value').in('key', kalitlar);
      if (error) throw new Error('user_state: o\'qib bo\'lmadi');
      return Object.fromEntries(((data ?? []) as { key: string; value: unknown }[]).map((q) => [q.key, q.value]));
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
