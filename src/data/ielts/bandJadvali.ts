// Raw score (out of 40) → ESTIMATED Academic Reading band.
// Official source IE04 (ielts.org, checked 2026-11-10) publishes only four sample points for
// Academic Reading: 15 → 5, 23 → 6, 30 → 7, 35 → 8. Rows with `rasmiyNuqta` start at one of them.
// Every other boundary is a Tayanch estimate (author's table) and is labelled as such on screen.
export interface BandQator {
  dan: number;
  gacha: number;
  /** null = below band 2.0 */
  band: number | null;
  /** the lower bound matches a sample point published on ielts.org */
  rasmiyNuqta?: boolean;
}

export const BAND_MANBA = 'IE04';

export const BAND_JADVALI: BandQator[] = [
  { dan: 39, gacha: 40, band: 9 },
  { dan: 37, gacha: 38, band: 8.5 },
  { dan: 35, gacha: 36, band: 8, rasmiyNuqta: true },
  { dan: 33, gacha: 34, band: 7.5 },
  { dan: 30, gacha: 32, band: 7, rasmiyNuqta: true },
  { dan: 27, gacha: 29, band: 6.5 },
  { dan: 23, gacha: 26, band: 6, rasmiyNuqta: true },
  { dan: 19, gacha: 22, band: 5.5 },
  { dan: 15, gacha: 18, band: 5, rasmiyNuqta: true },
  { dan: 13, gacha: 14, band: 4.5 },
  { dan: 10, gacha: 12, band: 4 },
  { dan: 8, gacha: 9, band: 3.5 },
  { dan: 6, gacha: 7, band: 3 },
  { dan: 4, gacha: 5, band: 2.5 },
  { dan: 0, gacha: 3, band: null },
];
