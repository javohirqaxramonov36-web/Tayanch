// Raw score → estimated band. The table itself is configuration: src/data/ielts/bandJadvali.ts.
import { BAND_JADVALI, type BandQator } from '../../../data/ielts/bandJadvali.ts';

/** Row of the table that contains `raw`. Out-of-range scores are clamped to the table's ends. */
export function bandQatori(raw: number, jadval: BandQator[] = BAND_JADVALI): BandQator {
  const eng = Math.max(...jadval.map((q) => q.gacha));
  const kam = Math.min(...jadval.map((q) => q.dan));
  const r = Math.min(eng, Math.max(kam, Math.round(raw)));
  return jadval.find((q) => r >= q.dan && r <= q.gacha)!;
}

/** Estimated band, or null when the score is below band 2.0. */
export function bandTop(raw: number, jadval: BandQator[] = BAND_JADVALI): number | null {
  return bandQatori(raw, jadval).band;
}

/** "6.5", "7.0"; `past` is shown when the band is null ("2.0 dan past"). */
export function bandMatn(band: number | null, past: string): string {
  return band === null ? past : band.toFixed(1);
}

/** Problems in a band table: gaps, overlaps, wrong order. Empty when the table covers 0..jami exactly once. */
export function jadvalXatolari(jadval: BandQator[], jami = 40): string[] {
  const xato: string[] = [];
  for (let r = 0; r <= jami; r++) {
    const mos = jadval.filter((q) => r >= q.dan && r <= q.gacha).length;
    if (mos !== 1) xato.push(`raw ${r}: covered by ${mos} rows`);
  }
  return xato;
}
