// Leitner qutilari: Xato daftari takrorlashi (takrorlash.ts) va SAT lug'ati (sat/lugat.ts) uchun bitta qoida.
// Serverdagi nusxasi: supabase/migrations/20261111170000_lugat_p15.sql, private.leitner_next (raqamlar bir xil bo'lishi shart).
// Oraliqlar (kun) Tayanch tanlovi, rasmiy qoida emas.

/** 1–4: takrorlanadi; 5: o'zlashtirildi */
export type Quti = 1 | 2 | 3 | 4 | 5;

/** To'g'ri javobdan keyin keyingi qutigacha oraliq: 1→2 uchun 3 kun, 2→3 7, 3→4 14. 4-qutida to'g'ri = o'zlashtirildi. */
export const ORALIQ: Record<1 | 2 | 3, number> = { 1: 3, 2: 7, 3: 14 };
/** Xato (yoki "Still learning") ertaga takrorlanadi */
export const BIRINCHI_ORALIQ = 1;

export function sanaQosh(sana: string, kun: number): string {
  const [y, m, d] = sana.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d) + kun * 86400000).toISOString().slice(0, 10);
}

/** Keyingi quti va sana (sof funksiya). quti null = yangi, 1-quti deb olinadi. */
export function keyingiQuti(quti: Quti | null, togri: boolean, kun: string): { quti: Quti; keyingi: string } {
  if (!togri) return { quti: 1, keyingi: sanaQosh(kun, BIRINCHI_ORALIQ) };
  const q = quti ?? 1;
  if (q >= 4) return { quti: 5, keyingi: kun };
  return { quti: (q + 1) as Quti, keyingi: sanaQosh(kun, ORALIQ[q as 1 | 2 | 3]) };
}
