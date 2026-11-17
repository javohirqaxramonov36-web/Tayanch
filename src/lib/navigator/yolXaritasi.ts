// Rule-based roadmap builder (no AI). Pure functions: rules and page registry are passed in,
// so the same code runs in the browser, at build time and in node tests.
import { MAQSADLAR, type Maqsad, type NavigatorSahifa } from '../../data/navigatorSahifalar.ts';
import {
  QADAMLAR_SONI, STANDART_KUNLIK,
  type KunlikDaqiqa, type Qoida, type Surat,
} from '../../data/yolXaritasiQoidalar.ts';
import type { YolProfil } from './profil.ts';

export interface RoyxatSahifa extends NavigatorSahifa {
  /** resolved at build time: page file exists and is not a "coming soon" screen */
  tayyor: boolean;
}

export interface Qadam {
  id: string;
  maqsad: Maqsad | 'umumiy';
  nomi: string;
  izoh: string;
  /** base-less path, only when the page is ready */
  manzil: string | null;
  tayyor: boolean;
}

/** '/src/pages/uz/sat/mashq/test/index.astro' -> '/uz/sat/mashq/test/' */
export function faylManzili(fayl: string): string | null {
  const m = /\/pages(\/.*\/)index\.astro$/.exec(fayl);
  return m ? m[1] : null;
}

/** A step is ready only if it has a path, is not flagged "coming soon" and the page file exists. */
export function tayyorlikniBelgila(sahifalar: NavigatorSahifa[], mavjud: Set<string>): RoyxatSahifa[] {
  return sahifalar.map((s) => ({ ...s, tayyor: !!s.manzil && !s.qurilmoqda && mavjud.has(s.manzil) }));
}

/** IDs referenced by rules or the default plan that do not exist in the registry. */
export function nomalumIdlar(qoidalar: Qoida[], umumiyReja: string[], sahifalar: NavigatorSahifa[]): string[] {
  const bor = new Set(sahifalar.map((s) => s.id));
  const hamma = [...qoidalar.flatMap((q) => q.qadamlar), ...umumiyReja];
  return [...new Set(hamma.filter((id) => !bor.has(id)))];
}

/** Rule lookup: exact daily-minutes row wins over a "*" row. */
export function qoidaQadamlari(qoidalar: Qoida[], maqsad: Maqsad, surat: Surat, kunlik: KunlikDaqiqa): string[] {
  const mos = qoidalar.filter((q) => q.maqsad === maqsad && q.surat === surat);
  return (mos.find((q) => q.kunlik === kunlik) ?? mos.find((q) => q.kunlik === '*'))?.qadamlar ?? [];
}

/** Total step count for the daily time answer. */
export const qadamlarSoni = (kunlik: KunlikDaqiqa | null) => QADAMLAR_SONI[kunlik ?? STANDART_KUNLIK];

export interface TuzishOpts {
  qoidalar: Qoida[];
  sahifalar: RoyxatSahifa[];
  umumiyReja: string[];
}

/**
 * Builds 3-5 steps.
 * - skipped profile -> default starter plan;
 * - primary goal takes max(2, total - otherGoals) steps from its rule row;
 * - every other goal (fixed MAQSADLAR order) adds its first step not already in the list.
 */
export function yolXaritasiTuz(p: YolProfil, surat: Surat, o: TuzishOpts): Qadam[] {
  const sahifa = new Map(o.sahifalar.map((s) => [s.id, s]));
  const qadam = (id: string): Qadam | null => {
    const s = sahifa.get(id);
    if (!s) return null;
    return { id, maqsad: s.maqsad, nomi: s.nomi, izoh: s.izoh, manzil: s.tayyor ? s.manzil ?? null : null, tayyor: s.tayyor };
  };
  const tayyorla = (ids: string[]) => ids.map(qadam).filter((q): q is Qadam => q !== null);

  if (p.skipped || p.goals.length === 0 || !p.primaryGoal) return tayyorla(o.umumiyReja);

  const kunlik = p.dailyMinutes ?? STANDART_KUNLIK;
  const jami = qadamlarSoni(kunlik);
  const boshqalar = MAQSADLAR.filter((m) => m !== p.primaryGoal && p.goals.includes(m));
  const asosiySoni = Math.max(2, jami - boshqalar.length);

  const tanlangan: string[] = [];
  for (const id of qoidaQadamlari(o.qoidalar, p.primaryGoal, surat, kunlik)) {
    if (tanlangan.length >= asosiySoni) break;
    if (!tanlangan.includes(id)) tanlangan.push(id);
  }
  for (const m of boshqalar) {
    const id = qoidaQadamlari(o.qoidalar, m, surat, kunlik).find((x) => !tanlangan.includes(x));
    if (id) tanlangan.push(id);
  }
  return tayyorla(tanlangan);
}
