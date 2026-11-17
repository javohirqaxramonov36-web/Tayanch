// Attempt repository. Screens talk only to the UrinishOmbori interface, never to localStorage,
// so a Supabase-backed implementation can replace this one later (records keep `syncedAt: null`).
import { brauzerOmbori, type Ombor } from '../../navigator/ombor.ts';
import type { FaolUrinish, Urinish } from './urinish.ts';

export const FAOL_KALIT = 'tayanch:ielts-reading-faol:v1';
export const URINISHLAR_KALIT = 'tayanch:ielts-reading-urinishlar:v1';
/** Oldest attempts are dropped beyond this many so history cannot fill the storage quota. */
export const URINISH_CHEGARA = 100;

export interface UrinishOmbori {
  /** false when data lives only in memory (storage disabled): it is lost on reload */
  readonly doimiy: boolean;
  faol(): FaolUrinish | null;
  /** returns false when the write was not persisted */
  saqlaFaol(u: FaolUrinish): boolean;
  tozalaFaol(): void;
  /** finished attempts, oldest first */
  urinishlar(): Urinish[];
  qoshUrinish(u: Urinish): boolean;
  topUrinish(id: string): Urinish | null;
}

const obyekt = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

function faolmi(x: unknown): x is FaolUrinish {
  return (
    obyekt(x) && x.v === 1 && typeof x.id === 'string' && typeof x.testId === 'string' &&
    typeof x.startedAt === 'string' && typeof x.deadline === 'number' && Number.isFinite(x.deadline) &&
    obyekt(x.answers) && Array.isArray(x.flags)
  );
}

function urinishmi(x: unknown): x is Urinish {
  return (
    obyekt(x) && typeof x.id === 'string' && typeof x.testId === 'string' && typeof x.startedAt === 'string' &&
    typeof x.finishedAt === 'string' && obyekt(x.answers) && typeof x.raw === 'number' &&
    (x.band === null || typeof x.band === 'number') && obyekt(x.perTypeStats)
  );
}

function oqiJson(ombor: Ombor, kalit: string): unknown {
  const xom = ombor.oqi(kalit);
  if (xom === null) return null;
  try {
    return JSON.parse(xom);
  } catch {
    // Corrupted value: drop it instead of crashing every screen.
    ombor.ochir(kalit);
    return null;
  }
}

export function urinishOmbori(ombor: Ombor = brauzerOmbori()): UrinishOmbori {
  const urinishlar = (): Urinish[] => {
    const x = oqiJson(ombor, URINISHLAR_KALIT);
    return Array.isArray(x) ? x.filter(urinishmi) : [];
  };
  return {
    get doimiy() {
      return ombor.doimiy;
    },
    faol() {
      const x = oqiJson(ombor, FAOL_KALIT);
      if (x === null) return null;
      if (!faolmi(x)) {
        ombor.ochir(FAOL_KALIT);
        return null;
      }
      return x;
    },
    saqlaFaol(u) {
      return ombor.yoz(FAOL_KALIT, JSON.stringify(u)) && ombor.doimiy;
    },
    tozalaFaol() {
      ombor.ochir(FAOL_KALIT);
    },
    urinishlar,
    qoshUrinish(u) {
      const hammasi = [...urinishlar().filter((x) => x.id !== u.id), u].slice(-URINISH_CHEGARA);
      return ombor.yoz(URINISHLAR_KALIT, JSON.stringify(hammasi)) && ombor.doimiy;
    },
    topUrinish(id) {
      return urinishlar().find((x) => x.id === id) ?? null;
    },
  };
}
