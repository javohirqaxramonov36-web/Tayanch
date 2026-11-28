import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tekshirManbalar } from '../reading/testlarTekshir';
import type { ListeningTest } from './turlar';

export async function saytListeningTestlari(): Promise<ListeningTest[]> {
  const root = process.env.TAYANCH_IELTS_LISTENING_DIR;
  if (!root) return [];
  const directory = join(root, 'tests');
  const files = (await readdir(directory)).filter((name) => name.endsWith('.json')).sort();
  const sources = await Promise.all(files.map(async (file) => ({
    fayl: file,
    fixture: false,
    matn: await readFile(join(directory, file), 'utf8'),
  })));
  const { testlar, xatolar } = tekshirManbalar(sources);
  if (xatolar.length) throw new Error(xatolar.join('\n'));
  const tests = testlar as ListeningTest[];
  for (const test of tests) {
    if (test.passages.length !== 4 || !/^\/uz\/ielts\/mashq\/listening\/audio\/listening-\d{2}\.mp3$/.test(test.audio?.url)) {
      throw new Error(`${test.testId}: four parts and a local audio file are required`);
    }
    for (const group of test.passages.flatMap((part) => part.groups)) {
      if (group.illustration && !/^data:image\/png;base64,[A-Za-z0-9+/]+=*$/.test(group.illustration.src)) {
        throw new Error(`${test.testId}: illustration must be a PNG`);
      }
    }
  }
  return tests;
}
