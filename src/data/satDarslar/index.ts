import type { DarsModul, DarsSavol } from './turlar';
import { hajmSavollar } from './hajm';
import { grafikSavollar } from './grafik';
import { aylanaSavollar } from './aylana';
import { statistikaSavollar } from './statistika';

export * from './turlar';

export const darsSavollari: Record<DarsModul, DarsSavol[]> = {
  hajm: hajmSavollar,
  grafik: grafikSavollar,
  aylana: aylanaSavollar,
  statistika: statistikaSavollar,
};

export const hammaSavollar: DarsSavol[] = Object.values(darsSavollari).flat();
