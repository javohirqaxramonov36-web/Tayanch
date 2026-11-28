import type { Savol, SavolVariant, VariantKalit } from '../../data/savolSxema.ts';
import { sprNormalla, sprTekshir } from './sprFormat.ts';

type SavolMatni = Pick<Savol, 'external_id' | 'stem' | 'explanation'>;
export type MashqSavoli = SavolMatni & (
  | { format: 'spr'; answer: string[] }
  | { format: 'mcq'; answer: VariantKalit; options: SavolVariant[] }
);

export interface MashqBali {
  correct: number;
  unanswered: number;
  total: number;
}

export function oqiObyekt(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const data: unknown = JSON.parse(raw);
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return data as Record<string, unknown>;
    }
  } catch { /* Ignore damaged browser data. */ }
  return {};
}

/** The v1 answer key keeps its original question-ID-to-string format. */
export function oqiMashqJavoblari(raw: string | null): Record<string, string> {
  return Object.fromEntries(Object.entries(oqiObyekt(raw))
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
}

export function oqiBirinchiUrinish(raw: string | null): MashqBali | null {
  const { firstAttempt } = oqiObyekt(raw);
  if (!firstAttempt || typeof firstAttempt !== 'object') return null;
  const { correct, unanswered, total } = firstAttempt as MashqBali;
  if (![correct, unanswered, total].every((n) => Number.isSafeInteger(n) && n >= 0) ||
      total === 0 || correct + unanswered > total) return null;
  return { correct, unanswered, total };
}

function kasr(value: string): [bigint, bigint] {
  const [numerator, denominator] = value.split('/');
  if (denominator) return [BigInt(numerator), BigInt(denominator)];
  const [whole, decimal = ''] = numerator.split('.');
  return [BigInt(whole + decimal), 10n ** BigInt(decimal.length)];
}

export function baholaMashqJavobi(item: MashqSavoli, raw: string) {
  const value = raw.trim();
  if (!value) return { status: 'unanswered', text: 'Unanswered' } as const;
  if (item.format === 'mcq') {
    return value === item.answer
      ? { status: 'correct', text: 'Correct' } as const
      : { status: 'incorrect', text: 'Incorrect' } as const;
  }
  const checked = sprTekshir(value);
  if (!checked.ok) return { status: 'invalid', text: checked.xabar } as const;
  const [a, b] = kasr(checked.qiymat);
  const matches = item.answer.some((accepted) => {
    const [c, d] = kasr(sprNormalla(accepted));
    return a * d === b * c;
  });
  return matches
    ? { status: 'correct', text: 'Correct' } as const
    : { status: 'incorrect', text: 'Incorrect' } as const;
}
