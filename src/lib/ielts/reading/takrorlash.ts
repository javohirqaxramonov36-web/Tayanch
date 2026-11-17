// IELTS review: wrong Reading-test questions become review items next to the lesson mistakes.
// Pure functions only (no DOM, no storage). Attempts are read, never changed.
// Item id: "<testId>#<question key>" (key = first number, so "Choose TWO" is one item).
// The Leitner state itself lives in src/lib/takrorlash.ts (tayanch:ielts-takrorlash).
import { baholash } from './ball.ts';
import { savolKaliti, type Guruh, type Passage, type ReadingTest, type Savol } from './sxema.ts';
import { savolTuri } from './turlar/registr.ts';
import type { Javob } from './turlar/tur.ts';
import type { Urinish } from './urinish.ts';

export const TEST_ID_AJRATGICH = '#';

export const testSavolId = (testId: string, kalit: string) => `${testId}${TEST_ID_AJRATGICH}${kalit}`;
export const testSavolimi = (id: string) => id.includes(TEST_ID_AJRATGICH);

/** YYYY-MM-DD of an ISO time in Tashkent (UTC+5, no daylight saving). '' if the time is invalid. */
export function toshkentSana(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  return new Date(t + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export interface TestXato {
  id: string;
  /** date of the latest attempt where this question was wrong or unanswered */
  sana: string;
}

/**
 * Wrong or unanswered questions of finished attempts. A "Choose TWO" item counts as wrong
 * unless both of its points were earned. One entry per item, with the latest wrong date.
 * Attempts whose test is not in `testlar` (removed, or failed to load) are skipped.
 */
export function testXatolari(urinishlar: Urinish[], testlar: Map<string, ReadingTest>): TestXato[] {
  const eng = new Map<string, string>();
  for (const u of urinishlar) {
    const test = testlar.get(u.testId);
    const sana = toshkentSana(u.finishedAt);
    if (!test || !sana) continue;
    const kalitTogri = new Map<string, boolean>();
    for (const q of baholash(test, u.answers).qatorlar) {
      kalitTogri.set(q.kalit, (kalitTogri.get(q.kalit) ?? true) && q.togri);
    }
    for (const [kalit, togri] of kalitTogri) {
      if (togri) continue;
      const id = testSavolId(u.testId, kalit);
      const oldin = eng.get(id);
      if (!oldin || sana > oldin) eng.set(id, sana);
    }
  }
  return [...eng].map(([id, sana]) => ({ id, sana })).sort((a, b) => a.id.localeCompare(b.id));
}

export interface TestSavolJoyi {
  id: string;
  test: ReadingTest;
  passage: Passage;
  passageTartib: number;
  guruh: Guruh;
  savol: Savol;
  /** the paragraph that holds the evidence (shown above the question) */
  paragraf: { label: string; text: string } | null;
}

/** Every question of the given tests by review id. */
export function testSavollari(testlar: Map<string, ReadingTest>): Map<string, TestSavolJoyi> {
  const m = new Map<string, TestSavolJoyi>();
  for (const test of testlar.values()) {
    test.passages.forEach((passage, passageTartib) => {
      for (const guruh of passage.groups) {
        for (const savol of guruh.questions) {
          const id = testSavolId(test.testId, savolKaliti(savol));
          const paragraf = passage.paragraphs.find((p) => p.label === savol.evidence?.paragraph) ?? null;
          m.set(id, { id, test, passage, passageTartib, guruh, savol, paragraf });
        }
      }
    });
  }
  return m;
}

/** Normalises a raw answer and checks it: true only when every point of the item is earned. */
export function testJavobTekshir(joy: Pick<TestSavolJoyi, 'guruh' | 'savol'>, xom: unknown): { javob: Javob | undefined; togri: boolean } {
  const tur = savolTuri(joy.guruh.type);
  const javob = tur.normalize(xom, joy.savol, joy.guruh);
  const ballar = tur.check(joy.savol, javob);
  return { javob, togri: ballar.length > 0 && ballar.every(Boolean) };
}
