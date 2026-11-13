// P25 mahsulot metrikalari: brauzerdagi yagona yozuvchi. Uchinchi tomon skripti yo'q, so'rov faqat Supabase'ga.
// Server tomoni: supabase/migrations/20261112143717_metrikalar.sql (public.track_event -> private.track).
// - Hisobsiz holatda hech narsa yuborilmaydi.
// - Profilda "Foydalanish statistikasini ulashish" o'chiq bo'lsa server yozmaydi (brauzer buni bilishi shart emas).
// - Xato hech qachon sahifani buzmaydi: track() har doim boolean qaytaradi.
import { hisobMijoz } from './hisob';
import { metrikaKaliti, yuborishMumkin, type MijozHodisa } from './metrikaCheklov';

export type { MijozHodisa } from './metrikaCheklov';

export async function track(hodisa: MijozHodisa, props: Record<string, string | number | boolean> = {}): Promise<boolean> {
  try {
    const c = hisobMijoz();
    if (!c) return false;
    const kalit = metrikaKaliti(hodisa);
    let oxirgi: string | null = null;
    try { oxirgi = sessionStorage.getItem(kalit); } catch { /* xotira yopiq: server cheklovi yetarli */ }
    if (!yuborishMumkin(oxirgi, Date.now())) return false;
    const { data: { session } } = await c.auth.getSession();
    if (!session) return false;
    try { sessionStorage.setItem(kalit, String(Date.now())); } catch { /* xotira yopiq */ }
    const { data, error } = await c.rpc('track_event', { p_name: hodisa, p_props: props });
    return !error && data === true;
  } catch {
    return false;
  }
}
