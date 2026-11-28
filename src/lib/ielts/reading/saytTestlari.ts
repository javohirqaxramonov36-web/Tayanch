// Tests for the site build (Astro / Vite only). Files are found with import.meta.glob, so the
// project root is always right, whatever directory the build was started from.
// The fixture in tests/fixtures/ielts/ is added only when IELTS_FIXTURE=1 (local preview):
// a normal build never loads it, so it cannot reach production.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tashqiReadingMocklar } from '../../../data/ielts/tashqiReadingMocklar.ts';
import type { ReadingTest } from './sxema.ts';
import { tekshirManbalar, type TestManba } from './testlarTekshir.ts';

const haqiqiy = import.meta.glob<string>('/src/data/ielts/reading-testlar/*.json', { query: '?raw', import: 'default' });
const fixture = import.meta.glob<string>('/tests/fixtures/ielts/*.json', { query: '?raw', import: 'default' });

async function oqi(fayllar: Record<string, () => Promise<string>>, fx: boolean): Promise<TestManba[]> {
  return Promise.all(
    Object.entries(fayllar).map(async ([yol, yukla]) => ({ fayl: yol.replace(/^\//, ''), fixture: fx, matn: await yukla() })),
  );
}

/** Valid tests of the site. Throws on any invalid test, which fails `astro build`. */
export async function saytTestlari(): Promise<ReadingTest[]> {
  const manbalar = await oqi(haqiqiy, false);
  const mockPapka = process.env.TAYANCH_IELTS_MOCK_DIR;
  if (mockPapka) {
    const fayllar = (await readdir(mockPapka)).filter((f) => f.endsWith('.json')).sort();
    for (const fayl of fayllar) {
      const manba = { fayl, fixture: false, matn: await readFile(join(mockPapka, fayl), 'utf8') };
      if (tashqiReadingMocklar.some(({ id }) => fayl === `${id}.json`)) {
        const tekshiruv = tekshirManbalar([manba]);
        if (tekshiruv.xatolar.length) {
          console.warn(`[IELTS] External mock unavailable: ${tekshiruv.xatolar.join('; ')}`);
          continue;
        }
      }
      manbalar.push(manba);
    }
  }
  if (process.env.IELTS_FIXTURE === '1') manbalar.push(...(await oqi(fixture, true)));
  const { testlar, xatolar } = tekshirManbalar(manbalar);
  if (xatolar.length > 0) {
    throw new Error(`IELTS Reading tests are invalid (run "npm run validate:tests"):\n- ${xatolar.join('\n- ')}`);
  }
  return testlar;
}
