// Attempt lifecycle (pure functions): start, restore, finish. No DOM and no storage access here.
import { baholash, engZaifTur, type Baho, type TurStat } from './ball.ts';
import { bandTop } from './band.ts';
import { SXEMA_VERSIYA, type ReadingTest, type SavolTuriNomi } from './sxema.ts';
import { tugashVaqti, vaqtTugadi } from './taymer.ts';
import type { Javoblar } from './turlar/tur.ts';
import { TAVSIYA } from '../../../data/ielts/readingMatn.ts';

/** Attempt in progress. `deadline` is fixed at start: the timer is always `deadline - now`. */
export interface FaolUrinish {
  v: 1;
  id: string;
  testId: string;
  schemaVersion: number;
  startedAt: string;
  /** epoch milliseconds */
  deadline: number;
  answers: Javoblar;
  /** keys of questions flagged for review */
  flags: string[];
}

/** Finished attempt as kept in history. `syncedAt` stays null until a server sync exists. */
export interface Urinish {
  id: string;
  testId: string;
  schemaVersion: number;
  startedAt: string;
  finishedAt: string;
  answers: Javoblar;
  raw: number;
  /** estimated band; null = below 2.0 */
  band: number | null;
  perTypeStats: TurStat;
  syncedAt: string | null;
}

export function yangiId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function yangiUrinish(test: Pick<ReadingTest, 'testId' | 'durationMinutes'>, hozir: number, id: string = yangiId()): FaolUrinish {
  return {
    v: 1, id, testId: test.testId, schemaVersion: SXEMA_VERSIYA,
    startedAt: new Date(hozir).toISOString(),
    deadline: tugashVaqti(hozir, test.durationMinutes),
    answers: {}, flags: [],
  };
}

/** True when a restored attempt ran out of time while the page was closed: it must be submitted as is. */
export function avtoYakunKerak(faol: FaolUrinish, hozir: number): boolean {
  return vaqtTugadi(faol.deadline, hozir);
}

/**
 * Scores an attempt and turns it into a history record.
 * A late submit (page reopened after the deadline) is stamped with the deadline, not with "now".
 */
export function yakunla(faol: FaolUrinish, test: ReadingTest, hozir: number): { urinish: Urinish; baho: Baho } {
  const baho = baholash(test, faol.answers);
  const urinish: Urinish = {
    id: faol.id,
    testId: faol.testId,
    schemaVersion: faol.schemaVersion,
    startedAt: faol.startedAt,
    finishedAt: new Date(Math.min(hozir, faol.deadline)).toISOString(),
    answers: faol.answers,
    raw: baho.raw,
    band: bandTop(baho.raw),
    perTypeStats: baho.perTypeStats,
    syncedAt: null,
  };
  return { urinish, baho };
}

export const TAVSIYA_CHEGARA = 0.6;
export const TAVSIYA_MUDDAT_KUN = 14;

export interface Tavsiya {
  sarlavha: string;
  izoh: string;
  /** base-less internal path */
  manzil: string;
  zaifTur: SavolTuriNomi | null;
}

/** Next step after a result: the weakest type below 60% gets its lesson, otherwise a new test. */
export function tavsiyaTanla(stat: TurStat): Tavsiya {
  const zaif = engZaifTur(stat);
  if (zaif && zaif.ulush < TAVSIYA_CHEGARA) return { ...TAVSIYA[zaif.type], zaifTur: zaif.type };
  return { ...TAVSIYA.yangi, zaifTur: null };
}
