// Saqlash adapterini (holat.ts) hisobga (P03, hisob.ts) ulash. SatSinxron.astro chaqiradi.
// supabase-js og'ir: faqat build'da Supabase sozlangan va shu brauzerda sessiya kaliti bo'lsa yuklanadi
// (BolimYon hisob bandi bilan bir xil yondashuv). Hisobsiz foydalanuvchida hech narsa yuklanmaydi va yuborilmaydi.
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from 'astro:env/client';
import { hisobSozlama } from '../data/hisobSozlama';
import { ulash, uzish } from './holat';

const sessiyaBormi = () => {
  try { return localStorage.getItem(hisobSozlama.sessiyaKaliti) !== null; } catch { return false; }
};

let boshlandi = false;

export async function hisobniUla(): Promise<void> {
  if (boshlandi || !PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) return;
  // Boshqa tabda chiqilsa: sinxron to'xtaydi (brauzerdagi nusxa qoladi)
  window.addEventListener('storage', (e) => {
    if (e.key === hisobSozlama.sessiyaKaliti && e.newValue === null) uzish();
  });
  if (!sessiyaBormi()) return;
  boshlandi = true;
  const [{ hisobMijoz }, { supabaseServer }] = await Promise.all([import('./hisob'), import('./holatSupabase')]);
  const c = hisobMijoz();
  if (!c) return;
  let joriy: string | null = null;
  const qoy = (id: string | null) => {
    if (id === joriy) return;
    joriy = id;
    if (id) ulash(supabaseServer(c, id), id);
    else uzish();
  };
  const { data } = await c.auth.getSession();
  qoy(data.session?.user.id ?? null);
  // supabase-js callback ichida boshqa Supabase so'rovini kutmaslikni tavsiya qiladi: setTimeout bilan keyinga suriladi
  c.auth.onAuthStateChange((hodisa, sessiya) => {
    setTimeout(() => qoy(hodisa === 'SIGNED_OUT' ? null : sessiya?.user.id ?? joriy), 0);
  });
}
