// IELTS Writing Task 2 baholash: sof mantiq (brauzer API'siz). Sahifa: /uz/ielts/mashq/writing/.
// So'z sanog'i va chegaralar serverdagi bilan bir xil (supabase/functions/ielts-writing-baho/korsatma.ts, handler.ts).
// Testlar: src/lib/ielts/writing/testlar/baho.test.ts.

export const KALIT_QORALAMA = 'tayanch:ielts-writing-qoralama';

export const CHEGARA = {
  sozMin: 50,
  sozTavsiya: 250,
  sozMax: 600,
  inshoBelgi: 6000,
  savolMin: 20,
  ozSavolMax: 600,
} as const;

export const MEZONLAR = [
  { kalit: 'task_response', nomi: 'Task Response', izoh: 'Answering the question' },
  { kalit: 'coherence_cohesion', nomi: 'Coherence and Cohesion', izoh: 'Organisation and linking' },
  { kalit: 'lexical_resource', nomi: 'Lexical Resource', izoh: 'Vocabulary' },
  { kalit: 'grammatical_range_accuracy', nomi: 'Grammatical Range and Accuracy', izoh: 'Grammar' },
] as const;

export type MezonKalit = (typeof MEZONLAR)[number]['kalit'];

export interface MezonBahosi {
  band: number;
  feedback: string;
  example_from_text: string;
  improvement_tip: string;
}

export interface BahoNatija {
  criteria: Record<MezonKalit, MezonBahosi>;
  overall_summary: string;
  under_length: boolean;
}

/** Edge Function 200 javobi. */
export interface BahoJavob {
  result_id: string | null;
  cached: boolean;
  task_band: number;
  word_count: number;
  under_length: boolean;
  result: BahoNatija;
  remaining: number | null;
}

export interface Qoralama {
  /** Tanlangan mavzu id si yoki 'oz' (o'z savoli). */
  mavzu: string | null;
  ozSavol: string;
  insho: string;
}

/** Serverdagi bilan bir xil: bo'shliq bilan ajralgan, harf yoki raqami bor bo'laklar. */
export function sozSoni(matn: string): number {
  let n = 0;
  for (const b of matn.split(/\s+/)) if (/[\p{L}\p{N}]/u.test(b)) n++;
  return n;
}

export type TekshiruvXato = 'savol_yoq' | 'savol_qisqa' | 'kam' | 'kop';

/** Yuborishdan oldin brauzerdagi tekshiruv (server baribir qayta tekshiradi). */
export function tekshir(savol: string, insho: string): TekshiruvXato | null {
  const s = savol.trim();
  if (!s) return 'savol_yoq';
  if (s.length < CHEGARA.savolMin) return 'savol_qisqa';
  const n = sozSoni(insho);
  if (n < CHEGARA.sozMin) return 'kam';
  if (n > CHEGARA.sozMax || insho.trim().length > CHEGARA.inshoBelgi) return 'kop';
  return null;
}

export const TEKSHIRUV_MATNI: Record<TekshiruvXato, string> = {
  savol_yoq: 'First choose a topic or type your own question.',
  savol_qisqa: `The question is too short: write at least ${CHEGARA.savolMin} characters.`,
  kam: `At least ${CHEGARA.sozMin} words are needed for assessment.`,
  kop: `The essay is too long: ${CHEGARA.sozMax} words at most.`,
};

/** So'z sanog'i ostidagi izoh. */
export function sanoqIzohi(n: number): string {
  if (n > CHEGARA.sozMax) return `More than ${CHEGARA.sozMax} words: please shorten it.`;
  if (n >= CHEGARA.sozTavsiya) return 'Requirement met: at least 250 words.';
  if (n >= CHEGARA.sozMin) return `${CHEGARA.sozTavsiya - n} more words. Under 250, the Task Response score usually drops.`;
  return `IELTS Task 2 needs at least ${CHEGARA.sozTavsiya} words.`;
}

/** Server xato kodlari -> inglizcha xabar (2026-11-27). */
export function xatoMatni(kod: string, qoshimcha: { daily_limit?: number | null; retry_after?: number | null } = {}): string {
  switch (kod) {
    case 'not_signed_in':
      return 'Sign in to get your essay assessed.';
    case 'quota_exceeded':
      return qoshimcha.daily_limit
        ? `You have used today's ${qoshimcha.daily_limit} free assessments. You can get more tomorrow (after midnight, Tashkent time).`
        : "You have used today's free assessments. You can get more tomorrow.";
    case 'rate_limited':
      return `Sent too quickly. Try again in ${qoshimcha.retry_after ?? 5} seconds.`;
    case 'ai_paused':
      return 'AI assessment is temporarily off. Your essay stays saved; try again later.';
    case 'essay_too_short':
      return TEKSHIRUV_MATNI.kam;
    case 'essay_too_long':
    case 'request_too_large':
      return TEKSHIRUV_MATNI.kop;
    case 'invalid_prompt':
      return TEKSHIRUV_MATNI.savol_qisqa;
    case 'cannot_assess':
      return "This text couldn't be assessed. Check that the essay answers the question, then send it again.";
    case 'assessment_failed':
    case 'ai_unavailable':
      return "The assessment didn't come through. This attempt was not counted against your limit: send it again in a moment.";
    case 'network_error':
      return 'The internet connection dropped. Your essay is saved: send it again once you are back online.';
    default:
      return 'Something went wrong. Your essay is saved: try again in a moment.';
  }
}

/** Band ko'rinishi: 6 -> "6.0", 6.5 -> "6.5". */
export const bandMatni = (b: number) => b.toFixed(1);

/** localStorage dagi qoralamani o'qiydi; buzilgan bo'lsa null. */
export function qoralamaniOqi(xom: string | null): Qoralama | null {
  if (!xom) return null;
  try {
    const o = JSON.parse(xom);
    if (!o || typeof o !== 'object') return null;
    return {
      mavzu: typeof o.mavzu === 'string' ? o.mavzu.slice(0, 40) : null,
      ozSavol: typeof o.ozSavol === 'string' ? o.ozSavol.slice(0, CHEGARA.ozSavolMax) : '',
      insho: typeof o.insho === 'string' ? o.insho.slice(0, CHEGARA.inshoBelgi * 2) : '',
    };
  } catch {
    return null;
  }
}

const bandmi = (x: unknown) => typeof x === 'number' && x >= 1 && x <= 9 && Number.isInteger(x * 2);

/** Bazadan yoki serverdan kelgan natija tuzilishini tekshiradi (eski yoki buzilgan qator ko'rsatilmaydi). */
export function natijaTogrimi(r: unknown): r is BahoNatija {
  if (!r || typeof r !== 'object') return false;
  const o = r as Record<string, unknown>;
  const c = o.criteria as Record<string, unknown> | undefined;
  if (!c || typeof o.overall_summary !== 'string') return false;
  return MEZONLAR.every(({ kalit }) => {
    const m = c[kalit] as Record<string, unknown> | undefined;
    return !!m && bandmi(m.band) && typeof m.feedback === 'string' && typeof m.improvement_tip === 'string'
      && typeof m.example_from_text === 'string';
  });
}
