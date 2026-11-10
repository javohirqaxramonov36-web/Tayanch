// Timer maths. The clock is always derived from the stored deadline (start timestamp + duration),
// never from counting interval ticks, so refreshes, sleeping tabs and throttled timers cannot drift.

/** Minutes-left marks announced to screen readers. Nothing else is announced. */
export const ELON_DAQIQALARI = [10, 5, 1] as const;

export function tugashVaqti(boshlangan: number, davomiylikDaqiqa: number): number {
  return boshlangan + davomiylikDaqiqa * 60_000;
}

export function qolganMs(tugash: number, hozir: number): number {
  return Math.max(0, tugash - hozir);
}

export function vaqtTugadi(tugash: number, hozir: number): boolean {
  return hozir >= tugash;
}

/** "59:07". Seconds are rounded up so the clock shows 00:00 only when time is really over. */
export function vaqtMatn(ms: number): string {
  const s = Math.ceil(Math.max(0, ms) / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Which "N minutes left" mark was crossed between two readings of the remaining time.
 * Returns null when no mark was crossed, on the first reading, or when time is already over.
 */
export function elonDaqiqa(oldingiMs: number | null, yangiMs: number): number | null {
  if (oldingiMs === null || yangiMs <= 0) return null;
  let topildi: number | null = null;
  for (const d of ELON_DAQIQALARI) {
    const chegara = d * 60_000;
    if (oldingiMs > chegara && yangiMs <= chegara) topildi = d;
  }
  return topildi;
}
