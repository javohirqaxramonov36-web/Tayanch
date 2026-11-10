// Validates a set of test files (already read as text). No file-system access here, so the same
// rules run in two places: the Node script (testlarYukla.ts) and the Astro build (saytTestlari.ts).
import { savolRaqamlari, tekshirTest, type ReadingTest } from './sxema.ts';

export const TEST_PAPKA = 'src/data/ielts/reading-testlar';
export const FIXTURE_PAPKA = 'tests/fixtures/ielts';
export const JAMI_SAVOL = 40;

export interface TestManba {
  /** project-relative path, used in error messages */
  fayl: string;
  /** true for files from tests/fixtures: short, never published */
  fixture: boolean;
  /** raw JSON text */
  matn: string;
}

export interface YuklanganFayl {
  fayl: string;
  fixture: boolean;
  testId: string | null;
  savollar: number;
  xatolar: string[];
}

export interface YuklashNatija {
  testlar: ReadingTest[];
  fayllar: YuklanganFayl[];
  /** every error, prefixed with its file path */
  xatolar: string[];
}

function raqamSoni(test: unknown): number {
  try {
    return (test as ReadingTest).passages.flatMap((p) => p.groups.flatMap((g) => g.questions.flatMap(savolRaqamlari))).length;
  } catch {
    return 0;
  }
}

export function tekshirManbalar(manbalar: TestManba[]): YuklashNatija {
  const testlar: ReadingTest[] = [];
  const fayllar: YuklanganFayl[] = [];
  const idlar = new Map<string, string>();

  for (const { fayl, fixture, matn } of [...manbalar].sort((a, b) => a.fayl.localeCompare(b.fayl))) {
    const nom = fayl.split('/').pop() ?? fayl;
    const xatolar: string[] = [];
    let test: unknown = null;
    try {
      test = JSON.parse(matn);
    } catch (e) {
      xatolar.push(`invalid JSON: ${(e as Error).message}`);
    }
    const savollar = raqamSoni(test);
    if (test !== null) {
      // A fixture is deliberately short: it is checked against its own question count.
      xatolar.push(...tekshirTest(test, { jamiSavol: fixture ? Math.max(savollar, 1) : JAMI_SAVOL }));
    }
    const testId = test && typeof (test as ReadingTest).testId === 'string' ? (test as ReadingTest).testId : null;
    if (testId) {
      if (!fixture && nom !== `${testId}.json`) xatolar.push(`file name must be "${testId}.json" (same as testId)`);
      if (!fixture && testId.startsWith('fixture')) xatolar.push('testId of a real test must not start with "fixture"');
      if (idlar.has(testId)) xatolar.push(`testId "${testId}" is already used by ${idlar.get(testId)}`);
      else idlar.set(testId, fayl);
    }
    fayllar.push({ fayl, fixture, testId, savollar, xatolar });
    if (xatolar.length === 0) testlar.push(test as ReadingTest);
  }
  return { testlar, fayllar, xatolar: fayllar.flatMap((f) => f.xatolar.map((x) => `${f.fayl}: ${x}`)) };
}
