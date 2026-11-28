import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { variantKalitlari, type Savol } from '../../data/savolSxema';
import type { MashqSavoli } from './mashqVaragi';
import { sprTekshir } from './sprFormat';

export interface MashqMavzusi {
  id: string;
  name: string;
  items: MashqSavoli[];
}

export async function saytMashqVaraglari(): Promise<MashqMavzusi[]> {
  // The drafts are supplied by the local preview. The standard site build has no worksheet routes.
  const folder = process.env.TAYANCH_SAT_MATH_DIR;
  if (!folder) return [];

  const titles = {
    parabola: 'Parabolas',
    'parabola-models': 'Quadratic models',
    'projectile-motion': 'Projectile motion',
  };
  const files = await readdir(folder);
  const sets: MashqMavzusi[] = [];
  for (const [id, name] of Object.entries(titles)) {
    if (!files.includes(id + '.json')) continue;
    const data = JSON.parse(await readFile(join(folder, id + '.json'), 'utf8')) as Savol[];
    if (!Array.isArray(data) || !data.length || new Set(data.map((q) => q.external_id)).size !== data.length) {
      throw new Error(`${id}: expected a non-empty set with distinct question IDs`);
    }
    const items = data.map<MashqSavoli>(({ external_id, section, format, stem, answer, explanation, options }) => {
      if (section !== 'math' || !/^[a-z0-9][a-z0-9-]{2,63}$/.test(external_id) || !stem || !explanation) {
        throw new Error(`${external_id}: expected a Math question with an explanation`);
      }
      if (format === 'spr' && Array.isArray(answer) && answer.length &&
          answer.every((value) => typeof value === 'string' && sprTekshir(value).ok)) {
        return { external_id, stem, explanation, format, answer };
      }
      if (format === 'mcq' && typeof answer === 'string' && variantKalitlari.includes(answer) &&
          options?.length === variantKalitlari.length &&
          options.every((option, index) => option?.key === variantKalitlari[index] &&
            typeof option.text === 'string' && option.text.trim())) {
        return { external_id, stem, explanation, format, answer, options };
      }
      throw new Error(`${external_id}: expected valid written or multiple-choice answers`);
    });
    sets.push({ id, name, items });
  }
  return sets;
}
