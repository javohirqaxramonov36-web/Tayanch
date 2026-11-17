// Safe key-value storage. localStorage may be disabled (private mode, blocked cookies) or throw
// on access/quota: every call is wrapped, and on failure we fall back to an in-memory map so the
// page keeps working for the current visit.

export interface Ombor {
  oqi(kalit: string): string | null;
  yoz(kalit: string, qiymat: string): boolean;
  ochir(kalit: string): void;
  /** false when values only live in memory (lost on reload) */
  doimiy: boolean;
}

export function xotiraOmbori(): Ombor {
  const m = new Map<string, string>();
  return {
    oqi: (k) => (m.has(k) ? m.get(k)! : null),
    yoz: (k, v) => (m.set(k, v), true),
    ochir: (k) => void m.delete(k),
    doimiy: false,
  };
}

let standart: Ombor | null = null;

/** Browser localStorage wrapped in try/catch; memory fallback when unavailable. */
export function brauzerOmbori(): Ombor {
  if (standart) return standart;
  let ls: Storage | null = null;
  try {
    ls = globalThis.localStorage ?? null;
    const sinov = 'tayanch:__sinov__';
    ls?.setItem(sinov, '1');
    ls?.removeItem(sinov);
  } catch {
    ls = null;
  }
  if (!ls) return (standart = xotiraOmbori());
  const zaxira = xotiraOmbori();
  const s = ls;
  standart = {
    oqi(k) {
      try { return s.getItem(k); } catch { return zaxira.oqi(k); }
    },
    yoz(k, v) {
      try { s.setItem(k, v); return true; } catch { zaxira.yoz(k, v); return false; }
    },
    ochir(k) {
      try { s.removeItem(k); } catch { /* ignore */ }
      zaxira.ochir(k);
    },
    doimiy: true,
  };
  return standart;
}
