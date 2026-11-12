// AI javobini tekshirish: tushuntirishdagi yakuniy javob savolning to'g'ri javobiga mos kelishi shart.
// MCQ: harf. SPR: son sifatida teng (kasr va o'nlik): private.spr_equal ning soddalashgan nusxasi.

export interface ModelJavobi {
  final_answer: string;
  explanation: string;
}

/** Strukturali chiqish JSON sxemasi (xato rejimi). */
export const JAVOB_SXEMASI = {
  type: 'object',
  properties: {
    final_answer: { type: 'string', description: 'The final answer exactly as the answer key states it: a choice letter, or a number.' },
    explanation: { type: 'string', description: 'The explanation shown to the student, plain text.' },
  },
  required: ['final_answer', 'explanation'],
  additionalProperties: false,
} as const;

/** Model matnidan JSON obyektni oladi (format buzilgan bo'lsa birinchi {...} bo'lagi). */
export function modelJsonOl(matn: string): ModelJavobi | null {
  const urin = (s: string): ModelJavobi | null => {
    try {
      const o = JSON.parse(s);
      if (o && typeof o.final_answer === 'string' && typeof o.explanation === 'string' && o.explanation.trim()) {
        return { final_answer: o.final_answer.trim(), explanation: o.explanation.trim() };
      }
    } catch {
      // davom
    }
    return null;
  };
  const toza = matn.trim();
  const birinchi = urin(toza);
  if (birinchi) return birinchi;
  const a = toza.indexOf('{');
  const b = toza.lastIndexOf('}');
  return a >= 0 && b > a ? urin(toza.slice(a, b + 1)) : null;
}

/** "B", "(B)", "Choice B", "B) 5", "b." -> "B". */
export function harfniAjrat(s: string): string | null {
  const m = /^\s*(?:choice|option|answer)?\s*\(?([A-F])\)?(?:[).:,]|\s|$)/i.exec(s);
  return m ? m[1].toUpperCase() : null;
}

/** SPR javobini songa aylantiradi: "7/2", "3.5", ".5", "-2", "x = 4". Noto'g'ri bo'lsa null. */
export function sprSon(s: string): number | null {
  let t = s.trim().replace(/^[a-z]\s*=\s*/i, '').replace(/\s+/g, '').replace(/[−–]/g, '-');
  t = t.replace(/\.$/, '');
  if (/^-?\d+(?:\.\d+)?$/.test(t) || /^-?\.\d+$/.test(t)) return Number(t);
  const k = /^(-?\d+)\/(\d+)$/.exec(t);
  if (k && Number(k[2]) !== 0) return Number(k[1]) / Number(k[2]);
  return null;
}

/** Savoldagi to'g'ri javobning ko'rinishi (promptga va tekshiruvga). */
export function togriJavobMatni(format: string, correct: unknown): string | null {
  const c = correct as { choice?: unknown; accepted?: unknown } | null;
  if (format === 'mcq' && typeof c?.choice === 'string') return c.choice.toUpperCase();
  if (format === 'spr' && Array.isArray(c?.accepted) && typeof c.accepted[0] === 'string') return c.accepted[0];
  return null;
}

export function javobMosmi(format: string, correct: unknown, yakuniy: string): boolean {
  const c = correct as { choice?: unknown; accepted?: unknown } | null;
  if (format === 'mcq') {
    return typeof c?.choice === 'string' && harfniAjrat(yakuniy) === c.choice.toUpperCase();
  }
  if (format === 'spr' && Array.isArray(c?.accepted)) {
    const n = sprSon(yakuniy);
    return c.accepted.some((a) => {
      if (typeof a !== 'string') return false;
      if (a.trim() === yakuniy.trim()) return true;
      const m = sprSon(a);
      return n !== null && m !== null && Math.abs(m - n) < 1e-9;
    });
  }
  return false;
}
