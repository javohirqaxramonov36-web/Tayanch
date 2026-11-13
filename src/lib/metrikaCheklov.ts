// P25 metrikalar: brauzerdagi tezlik cheklovi (sof mantiq, test: src/lib/testlar/metrikaCheklov.test.ts).
// Asosiy cheklov serverda (private.track: soatiga 60, plan_viewed 10 daqiqada 1); bu faqat ortiqcha so'rovni kamaytiradi.

/** Brauzer track_event orqali yubora oladigan hodisalar. Qolganlari serverda trigger bilan yoziladi. */
export type MijozHodisa = 'plan_viewed';

/** Bir hodisa bir oynada (sessionStorage) shuncha vaqtda ko'pi bilan bir marta yuboriladi. */
export const METRIKA_OYNA_MS = 10 * 60 * 1000;

export const metrikaKaliti = (hodisa: MijozHodisa) => `tayanch:metrika:${hodisa}`;

/** Oxirgi yuborilgan vaqt (sessionStorage qiymati) va hozirgi vaqt bo'yicha: yuborish mumkinmi. */
export function yuborishMumkin(oxirgi: string | null, hozir: number, oyna = METRIKA_OYNA_MS): boolean {
  const t = Number(oxirgi);
  if (!oxirgi || !Number.isFinite(t) || t <= 0) return true;
  if (t > hozir) return true; // soat orqaga surilgan: eski qiymatga ishonilmaydi
  return hozir - t >= oyna;
}
