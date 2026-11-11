// Addresses of the Reading practice pages (base-less) and the test loader shared by the screens.
import { yol } from '../../../yol.ts';
import { SXEMA_VERSIYA, type ReadingTest } from '../sxema.ts';

const ILDIZ = '/uz/ielts/mashq/reading/';

export const READING_YOL = {
  boshlash: ILDIZ,
  test: `${ILDIZ}test/`,
  natija: `${ILDIZ}natija/`,
  testJson: (testId: string) => `${ILDIZ}testlar/${encodeURIComponent(testId)}.json`,
} as const;

/** 'yoq' = the test is not on the site (any more); 'xato' = network or server problem. */
export type TestYuklash = ReadingTest | 'yoq' | 'xato';

export async function yuklaTest(testId: string): Promise<TestYuklash> {
  try {
    const javob = await fetch(yol(READING_YOL.testJson(testId)), { headers: { accept: 'application/json' } });
    if (javob.status === 404) return 'yoq';
    if (!javob.ok) return 'xato';
    const test = (await javob.json()) as ReadingTest;
    if (!test || test.schemaVersion !== SXEMA_VERSIYA || !Array.isArray(test.passages)) return 'yoq';
    return test;
  } catch {
    return 'xato';
  }
}

/** "09.11.2026, 14:05" in local time. Written by hand so every browser shows the same format. */
export function sanaMatn(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const i = (n: number) => String(n).padStart(2, '0');
  return `${i(d.getDate())}.${i(d.getMonth() + 1)}.${d.getFullYear()}, ${i(d.getHours())}:${i(d.getMinutes())}`;
}
