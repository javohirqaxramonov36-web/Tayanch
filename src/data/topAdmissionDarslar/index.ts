import type { DarsModul, DarsSavol } from './turlar';
import { taZinapoyaSavollar } from './ta-zinapoya';

export * from './turlar';

export const darsSavollari: Record<DarsModul, DarsSavol[]> = {
  'ta-zinapoya': taZinapoyaSavollar,
};

export const hammaSavollar: DarsSavol[] = Object.values(darsSavollari).flat();
