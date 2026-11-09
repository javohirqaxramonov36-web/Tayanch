// Kirgan/kirmagan holatni ko'rsatuvchi havolalar (1-qavat menyusi va hamma qavat yon paneli).
// supabase-js yuklanmaydi (har sahifada og'ir bo'lardi): Supabase sessiyasi saqlanadigan
// localStorage kaliti (hisobSozlama.sessiyaKaliti) faqat o'qiladi. Saqlash formati Supabase'ning
// ichki ishi (tekshirish kerak): o'qib bo'lmasa havola "Kirish" holatida qoladi.
//
// Belgilash: <a data-hisob-havola data-kirish="..." data-profil="..." data-matn-kirish="..." data-matn-kirgan="...">
//   ichida ixtiyoriy [data-hisob-nom] (asosiy matn) va [data-hisob-izoh] (kirganda ism yoki email).
import { hisobSozlama } from '../data/hisobSozlama';

interface Foydalanuvchi { email: string; ism: string }

export function kirganFoydalanuvchi(): Foydalanuvchi | null {
  try {
    const u = JSON.parse(localStorage.getItem(hisobSozlama.sessiyaKaliti) ?? 'null')?.user;
    if (!u?.email) return null;
    return { email: String(u.email), ism: String(u.user_metadata?.display_name ?? '') };
  } catch {
    return null;
  }
}

function yangila() {
  const f = kirganFoydalanuvchi();
  document.querySelectorAll<HTMLAnchorElement>('a[data-hisob-havola]').forEach((a) => {
    const d = a.dataset;
    const nomMatn = (f ? d.matnKirgan : d.matnKirish) ?? '';
    const kim = f ? f.ism || f.email : '';
    a.href = (f ? d.profil : d.kirish) ?? a.href;
    const nom = a.querySelector('[data-hisob-nom]');
    if (nom) nom.textContent = nomMatn;
    const izoh = a.querySelector('[data-hisob-izoh]');
    if (izoh) izoh.textContent = f ? kim : (d.izohKirish ?? '');
    const yorliq = f ? `${nomMatn}, ${kim}` : nomMatn;
    a.setAttribute('aria-label', yorliq);
    if (a.hasAttribute('title')) a.title = yorliq;
  });
}

let ulangan = false;
/** Sahifadagi hamma hisob havolalarini yangilaydi va boshqa tabdagi kirish/chiqishni kuzatadi. */
export function hisobHavolalari() {
  yangila();
  if (ulangan) return;
  ulangan = true;
  window.addEventListener('storage', (e) => { if (e.key === hisobSozlama.sessiyaKaliti) yangila(); });
}
