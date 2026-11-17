// File-system loader of Reading tests for Node scripts (`npm run validate:tests`).
// Never import this from pages or browser code: the site build uses saytTestlari.ts instead.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FIXTURE_PAPKA, TEST_PAPKA, tekshirManbalar, type TestManba, type YuklashNatija } from './testlarTekshir.ts';

export { FIXTURE_PAPKA, JAMI_SAVOL, TEST_PAPKA } from './testlarTekshir.ts';
export type { YuklanganFayl, YuklashNatija } from './testlarTekshir.ts';

function jsonFayllar(papka: string): string[] {
  if (!existsSync(papka)) return [];
  return readdirSync(papka).filter((f) => f.endsWith('.json')).sort();
}

export function yuklaTestlar(sozlama: { ildiz?: string; fixture?: boolean } = {}): YuklashNatija {
  const ildiz = sozlama.ildiz ?? process.cwd();
  const papkalar = [{ papka: TEST_PAPKA, fixture: false }];
  if (sozlama.fixture) papkalar.push({ papka: FIXTURE_PAPKA, fixture: true });

  const manbalar: TestManba[] = [];
  for (const { papka, fixture } of papkalar) {
    for (const nom of jsonFayllar(join(ildiz, papka))) {
      manbalar.push({ fayl: `${papka}/${nom}`, fixture, matn: readFileSync(join(ildiz, papka, nom), 'utf8') });
    }
  }
  return tekshirManbalar(manbalar);
}
