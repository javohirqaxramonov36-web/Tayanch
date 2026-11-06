import type { DarsModul, DarsSavol } from './turlar';
import { hajmSavollar } from './hajm';
import { grafikSavollar } from './grafik';
import { aylanaSavollar } from './aylana';
import { statistikaSavollar } from './statistika';
import { rwXatoSavollar } from './rw-xatoni-toping';
import { rwDalilSavollar } from './rw-dalil';
import { rwOtishSavollar } from './rw-otish';
import { rwLugatSavollar } from './rw-lugat';

export * from './turlar';

export const darsSavollari: Record<DarsModul, DarsSavol[]> = {
  hajm: hajmSavollar,
  grafik: grafikSavollar,
  aylana: aylanaSavollar,
  statistika: statistikaSavollar,
  'rw-xato': rwXatoSavollar,
  'rw-dalil': rwDalilSavollar,
  'rw-otish': rwOtishSavollar,
  'rw-lugat': rwLugatSavollar,
};

export const hammaSavollar: DarsSavol[] = Object.values(darsSavollari).flat();
