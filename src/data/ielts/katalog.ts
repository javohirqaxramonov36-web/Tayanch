import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { modullar, testIdMi, type Modul, type Test } from '../../lib/ielts/test';

export interface KatalogYozuvi { id: string; title: string; module: Modul }

export function katalog(modullarRoyxati: readonly Modul[] = modullar): KatalogYozuvi[] {
  return modullarRoyxati.flatMap((modul) => {
    const papka = resolve('public/data/ielts', modul);
    if (!existsSync(papka)) return [];
    return readdirSync(papka).filter((f) => f.endsWith('.json')).sort().flatMap((f) => {
      const id = f.slice(0, -5);
      if (!testIdMi(id)) return [];
      const test = JSON.parse(readFileSync(resolve(papka, f), 'utf8')) as Test;
      if (test.id !== id || test.module !== modul) throw new Error(`IELTS katalogi: ${modul}/${f}`);
      return [{ id, title: test.title, module: modul }];
    });
  });
}
