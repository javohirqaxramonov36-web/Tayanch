// Registry of question types. To add a type: write a module that implements SavolTuri (tur.ts),
// register it here, add its name to SAVOL_TURLARI and its validation branch in sxema.ts.
import type { SavolTuriNomi } from '../sxema.ts';
import type { SavolTuri } from './tur.ts';
import { tfng } from './tfng.ts';
import { mcq } from './mcq.ts';
import { sarlavha } from './sarlavha.ts';
import { boshliq } from './boshliq.ts';

const REGISTR: Record<SavolTuriNomi, SavolTuri> = {
  tfng,
  mcq,
  'matching-headings': sarlavha,
  'gap-fill': boshliq,
};

export function savolTuri(type: SavolTuriNomi): SavolTuri {
  const t = REGISTR[type];
  if (!t) throw new Error(`Unknown question type: ${type}`);
  return t;
}
