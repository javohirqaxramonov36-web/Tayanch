// Obuna holati (P22): obuna yozuvlaridan ekrandagi holat, eslatma matni, Free cheklovlari, to'lov tarixi qatori.
// Sof funksiyalar (testlanadi: src/lib/testlar/obunaHolat.test.ts). Holatning yagona manbasi baza:
// bu yerdagi hisob faqat ko'rsatish uchun, amaldagi tarifni server (private.current_plan) belgilaydi.
// Matn inglizcha (SAT bo'limi). Bosim, taymer, "oxirgi imkoniyat" yo'q: faqat sana va nima o'zgarishi.

const TOSHKENT = 'Asia/Tashkent';
const KUN_MS = 86_400_000;

export interface ObunaYozuv {
  plan_code: string;
  status: string;
  starts_at: string;
  ends_at: string | null;
}

/** hech: hech qachon pullik tarif bo'lmagan; faol: amalda; tugayapti: <= eslatmaKun qoldi; tugagan: tugab Free ga tushgan. */
export type ObunaTur = 'hech' | 'faol' | 'tugayapti' | 'tugagan';

export interface ObunaHolat {
  tur: ObunaTur;
  planKod: string | null;
  /** Amaldagi davr(lar) oxiri yoki tugagan sana. Muddatsiz tarifda null. */
  tugash: Date | null;
  /** Toshkent kalendar kuni bo'yicha qolgan kun (0 = bugun tugaydi). Tugagan yoki muddatsiz bo'lsa null. */
  qolganKun: number | null;
}

const vaqt = (s: string | null) => (s ? new Date(s).getTime() : NaN);

/** Toshkent sanasi bo'yicha kun raqami (UTC kunlari hisobida), kalendar farqi uchun. */
function toshkentKuni(t: Date): number {
  const [y, m, d] = t.toLocaleDateString('en-CA', { timeZone: TOSHKENT }).split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / KUN_MS);
}

export function qolganKunlar(tugash: Date, hozir: Date): number {
  return Math.max(0, toshkentKuni(tugash) - toshkentKuni(hozir));
}

/**
 * planKod: serverdagi amaldagi tarif (usage_status().plan.code). Pullik bo'lsa, shu tarifning ketma-ket
 * (oldindan uzaytirilgan) davrlari bitta muddat deb olinadi. 'canceled' obunalar e'tiborga olinmaydi.
 */
export function obunaHolati(yozuvlar: readonly ObunaYozuv[], hozir: Date, planKod: string | null = null, eslatmaKun = 7): ObunaHolat {
  const t = hozir.getTime();
  const tegishli = yozuvlar.filter((y) => y.status === 'active' || y.status === 'expired');
  const amalda = (y: ObunaYozuv) =>
    y.status === 'active' && vaqt(y.starts_at) <= t && (y.ends_at === null || vaqt(y.ends_at) > t);

  const faollar = tegishli.filter((y) => amalda(y) && (!planKod || planKod === 'free' || y.plan_code === planKod));
  if (faollar.length && planKod !== 'free') {
    const kod = planKod ?? faollar[0].plan_code;
    const shu = tegishli.filter((y) => y.status === 'active' && y.plan_code === kod);
    if (shu.some((y) => amalda(y) && y.ends_at === null)) return { tur: 'faol', planKod: kod, tugash: null, qolganKun: null };
    // Zanjir: amaldagi davr oxiridan boshlangan keyingi davrlar (P20: uzaytirish oldingi oxiridan boshlanadi).
    let oxir = Math.max(...shu.filter(amalda).map((y) => vaqt(y.ends_at)));
    const keyingilar = shu.filter((y) => y.ends_at && vaqt(y.starts_at) > t).sort((a, b) => vaqt(a.starts_at) - vaqt(b.starts_at));
    for (const y of keyingilar) if (vaqt(y.starts_at) <= oxir) oxir = Math.max(oxir, vaqt(y.ends_at));
    const tugash = new Date(oxir);
    const qolganKun = qolganKunlar(tugash, hozir);
    return { tur: qolganKun <= eslatmaKun ? 'tugayapti' : 'faol', planKod: kod, tugash, qolganKun };
  }

  const tugaganlar = tegishli.filter((y) => y.ends_at !== null && vaqt(y.ends_at) <= t);
  if (tugaganlar.length) {
    const oxirgi = tugaganlar.reduce((a, b) => (vaqt(b.ends_at) > vaqt(a.ends_at) ? b : a));
    return { tur: 'tugagan', planKod: oxirgi.plan_code, tugash: new Date(vaqt(oxirgi.ends_at)), qolganKun: null };
  }
  return { tur: 'hech', planKod: null, tugash: null, qolganKun: null };
}

export const sanaYozuv = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TOSHKENT });

export interface Eslatma {
  sarlavha: string;
  matn: string;
}

/** Sahifa tepasidagi eslatma. faol (> eslatmaKun) va hech: eslatma yo'q. */
export function eslatma(h: ObunaHolat, planNomi: string): Eslatma | null {
  if (h.tur === 'tugayapti' && h.tugash && h.qolganKun !== null) {
    const sana = sanaYozuv(h.tugash);
    const qachon = h.qolganKun === 0 ? 'today' : h.qolganKun === 1 ? 'tomorrow' : `in ${h.qolganKun} days`;
    return {
      sarlavha: `Your ${planNomi} plan ends ${qachon}`,
      matn: `It is paid until ${sana}. Nothing is charged automatically. To keep ${planNomi}, extend it for another period; the new period starts when the current one ends, so no days are lost.`,
    };
  }
  if (h.tur === 'tugagan' && h.tugash) {
    return {
      sarlavha: `Your ${planNomi} plan ended on ${sanaYozuv(h.tugash)}`,
      matn: 'You are on Free now. Your answers, mistake log, study plan and history are kept. You can extend at any time.',
    };
  }
  return null;
}

export interface TarifQator {
  code: string;
  limits?: unknown;
  features?: unknown;
}

const obyekt = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

/**
 * Free ga tushganda nima cheklanadi: pullik tarifdagi bayroqlar (Free da yo'q) va Free limitlari.
 * Hammasi bazadan (plans): kodda tarif raqami yo'q. Nomi ma'lum bo'lmagan bayroq ko'rsatilmaydi.
 */
export function freeCheklovlari(
  free: TarifQator | undefined,
  pullik: TarifQator | undefined,
  bayroqNomi: Record<string, string>,
  kvotaNomi: Record<string, string>,
  bayroqmi: (s: string) => boolean,
): string[] {
  const royxat: string[] = [];
  const freeB = new Set(Array.isArray(free?.features) ? free.features.filter((f): f is string => typeof f === 'string') : []);
  if (Array.isArray(pullik?.features)) {
    for (const f of pullik.features) {
      if (typeof f === 'string' && bayroqmi(f) && !freeB.has(f) && bayroqNomi[f]) royxat.push(`${bayroqNomi[f]}: not included`);
    }
  }
  if (obyekt(free?.limits)) {
    for (const [kalit, q] of Object.entries(free.limits)) {
      if (!obyekt(q) || typeof q.max !== 'number') continue;
      const nomi = kvotaNomi[kalit] ?? kalit;
      royxat.push(`${nomi}: up to ${q.max} per ${q.per === 'month' ? 'month' : 'day'}`);
    }
  }
  return royxat;
}

export interface TolovYozuv {
  id: string;
  plan_name: string;
  amount_uzs: number;
  status: string;
  provider: string;
  created_at: string;
  test: boolean;
}

export const holatNomi: Record<string, string> = {
  created: 'Not completed',
  pending: 'Waiting for confirmation',
  paid: 'Paid',
  failed: 'Failed',
  canceled: 'Canceled',
  refunded: 'Refunded',
};

export const usulYozuv = (provider: string) => (provider === 'inpay' ? 'inPAY' : provider);

/** Qisqa to'lov raqami (UUID boshi): yordam so'rashda shu yetadi. */
export const qisqaId = (id: string) => id.slice(0, 8).toUpperCase();

/** "Check payment status" tugmasi: faqat inPAY'da hisob ochilgan (pending) va shu daqiqadan eski to'lovda. */
export function tekshirishMumkin(t: Pick<TolovYozuv, 'status' | 'created_at'>, hozir: Date, daqiqa = 15): boolean {
  return t.status === 'pending' && hozir.getTime() - vaqt(t.created_at) >= daqiqa * 60_000;
}
