// "Next step" card source of truth + a small public API so other modules can override it.
//
// Usage from any page (e.g. a future IELTS result screen):
//   import { ornatKeyingiQadam } from '../lib/navigator/keyingiQadam';
//   ornatKeyingiQadam({ manba: 'ielts-natija', sarlavha: '...', manzil: '/uz/ielts/...', tugaydi: '2026-12-01T00:00:00Z' });
//
// The override is stored in localStorage (pages are separate documents), so the Navigator reads it
// on its next render. On the same page a `tayanch:keyingi-qadam` event is dispatched on window.
// Only internal, base-less paths ("/uz/...") are accepted: no external links can be injected.
import { brauzerOmbori, type Ombor } from './ombor.ts';
import type { Qadam } from './yolXaritasi.ts';

export const KEYINGI_QADAM_KALITI = 'tayanch:navigator-keyingi-qadam:v1';
export const KEYINGI_QADAM_HODISA = 'tayanch:keyingi-qadam';

export interface KeyingiQadamOverride {
  /** which module set it, e.g. "ielts-natija"; used to clear only your own override */
  manba: string;
  sarlavha: string;
  izoh?: string;
  /** base-less internal path ending with "/": "/uz/ielts/vosita/reja/" */
  manzil: string;
  /** optional ISO expiry; after it the roadmap step is shown again */
  tugaydi?: string;
}

export interface SaqlanganOverride extends KeyingiQadamOverride {
  v: 1;
  ornatilgan: string;
}

export type KeyingiQadam =
  | { turi: 'override'; manba: string; sarlavha: string; izoh: string; manzil: string }
  | { turi: 'qadam'; qadam: Qadam };

/** Internal path under /uz/, lowercase slug segments, trailing slash, no protocol or "//". */
export function ichkiManzilmi(m: unknown): m is string {
  return typeof m === 'string' && /^\/uz\/(?:[a-z0-9-]+\/)*$/.test(m);
}

const matnmi = (s: unknown, max: number) => typeof s === 'string' && s.trim().length > 0 && s.length <= max;

function tekshir(x: unknown): KeyingiQadamOverride | null {
  if (!x || typeof x !== 'object') return null;
  const o = x as Record<string, unknown>;
  if (!matnmi(o.manba, 64) || !matnmi(o.sarlavha, 120) || !ichkiManzilmi(o.manzil)) return null;
  if (o.izoh !== undefined && !(typeof o.izoh === 'string' && o.izoh.length <= 240)) return null;
  if (o.tugaydi !== undefined && !(typeof o.tugaydi === 'string' && Number.isFinite(Date.parse(o.tugaydi)))) return null;
  return {
    manba: (o.manba as string).trim(),
    sarlavha: (o.sarlavha as string).trim(),
    manzil: o.manzil as string,
    ...(o.izoh ? { izoh: o.izoh as string } : {}),
    ...(o.tugaydi ? { tugaydi: o.tugaydi as string } : {}),
  };
}

function xabarBer() {
  const g = globalThis as { dispatchEvent?: (e: Event) => boolean };
  if (typeof g.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
    g.dispatchEvent(new CustomEvent(KEYINGI_QADAM_HODISA));
  }
}

/** Sets (replaces) the next-step override. Returns false if the input is invalid or not persisted. */
export function ornatKeyingiQadam(q: KeyingiQadamOverride, ombor: Ombor = brauzerOmbori(), hozir = new Date()): boolean {
  const toza = tekshir(q);
  if (!toza) return false;
  const saqlangan: SaqlanganOverride = { v: 1, ...toza, ornatilgan: hozir.toISOString() };
  const ok = ombor.yoz(KEYINGI_QADAM_KALITI, JSON.stringify(saqlangan));
  xabarBer();
  return ok;
}

/** Clears the override. With `manba`, only clears it if that module set it. */
export function tozalaKeyingiQadam(manba?: string, ombor: Ombor = brauzerOmbori()): void {
  if (manba !== undefined && oqiKeyingiQadam(ombor)?.manba !== manba) return;
  ombor.ochir(KEYINGI_QADAM_KALITI);
  xabarBer();
}

/** Reads a valid, non-expired override. Corrupted or expired values are removed. */
export function oqiKeyingiQadam(ombor: Ombor = brauzerOmbori(), hozir = new Date()): SaqlanganOverride | null {
  const xom = ombor.oqi(KEYINGI_QADAM_KALITI);
  if (xom === null) return null;
  let toza: KeyingiQadamOverride | null = null;
  let ornatilgan = '';
  try {
    const o = JSON.parse(xom);
    toza = o?.v === 1 ? tekshir(o) : null;
    ornatilgan = typeof o?.ornatilgan === 'string' ? o.ornatilgan : '';
  } catch {
    toza = null;
  }
  if (!toza || (toza.tugaydi && Date.parse(toza.tugaydi) <= hozir.getTime())) {
    ombor.ochir(KEYINGI_QADAM_KALITI);
    return null;
  }
  return { v: 1, ...toza, ornatilgan };
}

/** Override first, otherwise the first ready roadmap step. */
export function tanlaKeyingiQadam(qadamlar: Qadam[], override: SaqlanganOverride | null): KeyingiQadam | null {
  if (override) {
    return { turi: 'override', manba: override.manba, sarlavha: override.sarlavha, izoh: override.izoh ?? '', manzil: override.manzil };
  }
  const q = qadamlar.find((x) => x.tayyor && x.manzil);
  return q ? { turi: 'qadam', qadam: q } : null;
}
