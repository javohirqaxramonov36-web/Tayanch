import type { DarsModul, DarsSavol } from './turlar';
import { irTfngSavollar } from './ir-tfng';
import { irSarlavhaSavollar } from './ir-sarlavha';

export * from './turlar';

export const darsSavollari: Record<DarsModul, DarsSavol[]> = {
  'ir-tfng': irTfngSavollar,
  'ir-sarlavha': irSarlavhaSavollar,
};

export const hammaSavollar: DarsSavol[] = Object.values(darsSavollari).flat();
