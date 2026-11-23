// Admission D-seriya, Q5: Ariza zinapoyasi XP'si (mijoz mantig'i, sof: Supabase mijozi tashqaridan beriladi).
// Server: supabase/migrations/20261120120000_admission_xp.sql (public.admission_step_done). XP ni faqat server yozadi,
// bir martalik kafolati serverda (unique (user_id, kind, ref)). Bu modul faqat bitta sahifa ochiqligida takror
// so'rov yubormaydi va hech qachon xato tashlamaydi: login yo'q yoki xato bo'lsa jim null qaytaradi.
// Reyting va boshqa foydalanuvchilar XP'si bu yerda yo'q: faqat o'quvchining o'z natijasi (berilgan XP).
import { ADMISSION_XP_QADAMLAR, type AdmissionXpQadam } from '../../data/topAdmissionXp.ts';

export interface XpRpcMijoz {
  /** Hisob bilan kirganmi (sessiya bor). */
  kirganmi(): Promise<boolean>;
  /** `admission_step_done` RPC chaqiruvi. */
  chaqir(qadam: AdmissionXpQadam): Promise<{ data: unknown; error: unknown }>;
}

export const zinapoyaQadami = (id: string): AdmissionXpQadam | null => {
  const q = `zinapoya:${id}`;
  return (ADMISSION_XP_QADAMLAR as readonly string[]).includes(q) ? (q as AdmissionXpQadam) : null;
};

/**
 * Yuboruvchi: `yubor(id)` zinapoya to'g'ri terilganda chaqiriladi.
 * Qaytaradi: server bergan XP (10 yoki 0) yoki null (yuborilmadi: login yo'q, mijoz yo'q, xato, noma'lum zinapoya).
 * Bir zinapoya uchun muvaffaqiyatli javobdan keyin (yoki so'rov jarayonida) qayta so'rov yuborilmaydi.
 * Xato bo'lsa keyingi to'g'ri terishda qayta urinadi (server baribir bir marta yozadi).
 */
export function zinapoyaXpYuboruvchi(mijoz: () => XpRpcMijoz | null | Promise<XpRpcMijoz | null>) {
  const jarayonda = new Map<AdmissionXpQadam, Promise<number | null>>();

  return function yubor(id: string): Promise<number | null> {
    const qadam = zinapoyaQadami(id);
    if (!qadam) return Promise.resolve(null);
    const bor = jarayonda.get(qadam);
    if (bor) return bor.then(() => null); // takror: XP allaqachon hisoblangan, yangi yozuv yo'q

    const p = (async (): Promise<number | null> => {
      try {
        const m = await mijoz(); // supabase-js faqat kerak bo'lganda yuklanadi (sahifa skripti)
        if (!m || !(await m.kirganmi())) return null;
        const { data, error } = await m.chaqir(qadam);
        if (error) return null;
        return typeof data === 'number' && Number.isFinite(data) ? data : null;
      } catch {
        return null;
      }
    })();
    jarayonda.set(qadam, p);
    // Yuborilmagan (login yo'q yoki xato) bo'lsa keyingi urinishga ruxsat.
    void p.then((natija) => { if (natija === null) jarayonda.delete(qadam); });
    return p;
  };
}

/** Faqat o'z holati: XP berilgan bo'lsa qisqa yozuv, aks holda bo'sh. */
export const xpYozuvi = (xp: number | null): string => (xp && xp > 0 ? `+${xp} XP olindi` : '');
