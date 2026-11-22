import type { DarsModul, DarsSavol } from './turlar';
import { irTfngSavollar } from './ir-tfng';
import { irSarlavhaSavollar } from './ir-sarlavha';

import { ivOvqatlanishSavollar } from './iv-ovqatlanish';

export * from './turlar';

export const darsSavollari: Record<DarsModul, DarsSavol[]> = {
  'iv-ovqatlanish': ivOvqatlanishSavollar,
  'ir-tfng': irTfngSavollar,
  'ir-sarlavha': irSarlavhaSavollar,
};

export const hammaSavollar: DarsSavol[] = Object.values(darsSavollari).flat();
