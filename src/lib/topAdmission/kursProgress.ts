// Top Admission kursi: tekshiruv mezonlari progressi (Admission H). Sof funksiyalar, node --test bilan sinaladi.
// Saqlash faqat brauzerda, kalit `tayanch:top-admission-kurs-progress`, shakl { "<dars-slug>": ["mezon-id", ...] }.
// O'qish/yozish sahifa skriptida `darsSaqlash.ts` (oqi/yoz, try/catch) orqali.

export const KURS_KALIT = 'tayanch:top-admission-kurs-progress';

export type KursProgress = Record<string, string[]>;

/** Noma'lum yoki buzilgan qiymatni toza shaklga keltiradi (faqat qator ro'yxatlari). */
export function progressniTozala(x: unknown): KursProgress {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return {};
  const natija: KursProgress = {};
  for (const [k, v] of Object.entries(x as Record<string, unknown>)) {
    if (Array.isArray(v)) {
      const toza = [...new Set(v.filter((s): s is string => typeof s === 'string'))];
      if (toza.length) natija[k] = toza;
    }
  }
  return natija;
}

/** Bitta mezonni belgilash yoki olib tashlash. Asl obyekt o'zgarmaydi. */
export function mezonniAlmashtir(p: KursProgress, dars: string, mezon: string, belgilandi: boolean): KursProgress {
  const eski = p[dars] ?? [];
  const yangi = belgilandi ? [...new Set([...eski, mezon])] : eski.filter((m) => m !== mezon);
  const natija = { ...p };
  if (yangi.length) natija[dars] = yangi;
  else delete natija[dars];
  return natija;
}

/** Dars bajarildi: darsning hamma mezonlari belgilangan (eski, endi yo'q mezon id'lari hisobga olinmaydi). */
export function darsBajarildimi(p: KursProgress, dars: string, mezonIdlari: readonly string[]): boolean {
  if (!mezonIdlari.length) return false;
  const b = new Set(p[dars] ?? []);
  return mezonIdlari.every((m) => b.has(m));
}

export function bajarilganSoni(p: KursProgress, darslar: readonly { slug: string; mezonlar: readonly string[] }[]): number {
  return darslar.filter((d) => darsBajarildimi(p, d.slug, d.mezonlar)).length;
}
