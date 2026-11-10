// Gap-fill answer normalisation: case-insensitive, extra spaces ignored, word limit enforced.
import { sozSoni, type Savol } from './sxema.ts';

/** Lowercases, unifies quotes and dashes, collapses whitespace. */
export function normalMatn(s: string): string {
  return s
    .normalize('NFKC')
    .replace(/[‘’ʻʼ`]/g, "'")
    .replace(/[‐-―]/g, '-')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** True when the typed answer matches `answer` or one of `acceptedAnswers` and respects `wordLimit`. */
export function boshliqTogri(javob: string, savol: Savol): boolean {
  const toza = normalMatn(javob);
  if (toza === '') return false;
  // More words than allowed is wrong even if the extra words are harmless.
  if (typeof savol.wordLimit === 'number' && sozSoni(toza) > savol.wordLimit) return false;
  const togri = [savol.answer, ...(savol.acceptedAnswers ?? [])].filter((x): x is string => typeof x === 'string');
  return togri.some((t) => normalMatn(t) === toza);
}
