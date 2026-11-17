// Dars xatolarining sababi va izohi ("Why I missed it"), faqat brauzerda (P09, muallif ruxsati 2026-11-11).
// Kalit tayanch:<bolim>-xato-sabab, shakli: { versiya: 1, savollar: { [id]: { teg, izoh } } }.
// Bank savollarida teg va izoh serverda (review_queue.reason_tag, note). Bitta kalit = bitta shakl.
// O'qish/yozish darsSaqlash orqali: tayanch:sat-xato-sabab P04 ro'yxatida (holatBirlashtir.ts), hisob bilan sinxronlanadi.
import { oqi, yoz } from './darsSaqlash';
import type { DarsBolim } from '../data/darsTurlar';

export const TEGLAR = ['careless', 'concept_gap', 'time_pressure', 'misread', 'other'] as const;
export type Teg = (typeof TEGLAR)[number];
export interface SababYozuv { teg: Teg | null; izoh: string }
export interface SababHolat { versiya: 1; savollar: Record<string, SababYozuv> }

export const sababKalit = (bolim: DarsBolim) => `tayanch:${bolim}-xato-sabab`;
const IZOH_MAX = 1000;
const tegmi = (x: unknown): x is Teg => TEGLAR.includes(x as Teg);

export function sababOqi(bolim: DarsBolim): SababHolat {
  const x = oqi<SababHolat | null>(sababKalit(bolim), null);
  const h: SababHolat = { versiya: 1, savollar: {} };
  if (x && x.versiya === 1 && x.savollar && typeof x.savollar === 'object') {
    for (const [id, y] of Object.entries(x.savollar)) {
      if (!y || typeof y !== 'object') continue;
      const teg = tegmi(y.teg) ? y.teg : null;
      const izoh = typeof y.izoh === 'string' ? y.izoh.slice(0, IZOH_MAX) : '';
      if (teg || izoh) h.savollar[id] = { teg, izoh };
    }
  }
  return h;
}

/** Bitta savolning tegini yoki izohini o'zgartiradi. Ikkalasi bo'sh bo'lsa yozuv olib tashlanadi. Saqlab bo'lmasa false. */
export function sababYoz(bolim: DarsBolim, id: string, ozgar: Partial<SababYozuv>): boolean {
  const h = sababOqi(bolim);
  const eski = h.savollar[id] ?? { teg: null, izoh: '' };
  const yangi: SababYozuv = {
    teg: 'teg' in ozgar ? (tegmi(ozgar.teg) ? ozgar.teg : null) : eski.teg,
    izoh: 'izoh' in ozgar ? String(ozgar.izoh ?? '').slice(0, IZOH_MAX) : eski.izoh,
  };
  if (yangi.teg || yangi.izoh.trim()) h.savollar[id] = yangi;
  else delete h.savollar[id];
  return yoz(sababKalit(bolim), h);
}
