// Tariflar taqqoslash jadvali va karta ro'yxati (Obuna sahifasi, TarifDialog). Sof funksiyalar, testlanadi:
// src/lib/testlar/tarifJadval.test.ts. Hamma raqam bazadan (plans.limits, plans.features): bu yerda tarif raqami YO'Q.
// Qoida (docs/tarif-qoidalari.md): kalit yo'q = cheklov yo'q ("No limit"); max 0 = "Not included".
// Istisno: AI Tutor kalitlari yo'q bo'lsa "yopiq" (P33), ya'ni "Not included".
// Matn inglizcha (SAT bo'limi).

export interface Kvota { max: number; per?: string }
export interface TarifManba { code: string; limits?: unknown; features?: unknown }

/** Jadval qatori: kvota kaliti yoki tarif bayrog'i. */
export type QatorTur = { tur: 'kvota'; kalit: string; nomi: string; oylikKalit?: string; yopiqStandart?: boolean } | { tur: 'bayroq'; kalit: string; nomi: string };

export const KIRITILMAGAN = 'Not included';
export const CHEKLOVSIZ = 'No limit';
export const KIRITILGAN = 'Included';

const obyekt = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const son = (n: number) => new Intl.NumberFormat('en-US').format(n);

function kvotaOl(limits: unknown, kalit: string): Kvota | null {
  if (!obyekt(limits)) return null;
  const q = limits[kalit];
  if (!obyekt(q) || typeof q.max !== 'number' || !Number.isFinite(q.max)) return null;
  return { max: Math.max(0, Math.trunc(q.max)), per: typeof q.per === 'string' ? q.per : undefined };
}

/** plans.features dagi mashina bayroqlari: snake_case satr yoki {"flag": "..."} obyekt (P15). */
export function bayroqlar(features: unknown): Set<string> {
  const s = new Set<string>();
  if (!Array.isArray(features)) return s;
  for (const f of features) {
    if (typeof f === 'string' && /^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(f)) s.add(f);
    else if (obyekt(f) && typeof f.flag === 'string') s.add(f.flag);
  }
  return s;
}

/** plans.features dagi oddiy matn (bayroq emas): kartada ko'rsatiladi. */
export function matnlar(features: unknown): string[] {
  if (!Array.isArray(features)) return [];
  return features.filter((f): f is string => typeof f === 'string' && !/^[a-z][a-z0-9]*(_[a-z0-9]+)+$/.test(f) && f.trim() !== '');
}

const davr = (per?: string) => (per === 'month' ? 'month' : 'day');

/** Bitta kvota katagi. oylikKalit berilsa kunlik va oylik birga: "Up to 30 per day (up to 300 per month)". */
export function kvotaMatni(limits: unknown, kalit: string, oylikKalit?: string, yopiqStandart = false): string {
  const q = kvotaOl(limits, kalit);
  const o = oylikKalit ? kvotaOl(limits, oylikKalit) : null;
  if (yopiqStandart) {
    // AI: ikkala kalit ham max > 0 bo'lgandagina ochiq (P33).
    if (!q || q.max === 0 || (oylikKalit && (!o || o.max === 0))) return KIRITILMAGAN;
  } else {
    if (!q && !o) return CHEKLOVSIZ;
    if ((q && q.max === 0) || (o && o.max === 0)) return KIRITILMAGAN;
  }
  const qism = [q ? `Up to ${son(q.max)} per ${davr(q.per)}` : null, o ? `up to ${son(o.max)} per month` : null].filter(Boolean) as string[];
  if (qism.length === 2) return `${qism[0]} (${qism[1]})`;
  const bitta = qism[0];
  return bitta.charAt(0).toUpperCase() + bitta.slice(1);
}

export function katak(t: TarifManba | undefined, q: QatorTur): string {
  if (!t) return 'Coming soon';
  if (q.tur === 'bayroq') return bayroqlar(t.features).has(q.kalit) ? KIRITILGAN : KIRITILMAGAN;
  return kvotaMatni(t.limits, q.kalit, q.oylikKalit, q.yopiqStandart);
}

export interface JadvalQator { kalit: string; nomi: string; qiymat: Record<string, string> }

/**
 * Jadval: tanlangan qatorlar + biror tarif limitida bor, lekin ro'yxatda yo'q kalitlar (oxirida, nomi kvotaNomi dan).
 * kodlar: ustunlar tartibi (masalan free, pro, max). Bazada yo'q tarif (faol emas) ustunida "Coming soon".
 */
export function taqqoslashJadvali(
  tariflar: readonly TarifManba[],
  kodlar: readonly string[],
  qatorlar: readonly QatorTur[],
  kvotaNomi: Record<string, string> = {},
): JadvalQator[] {
  const bor = new Set(qatorlar.flatMap((q) => (q.tur === 'kvota' && q.oylikKalit ? [q.kalit, q.oylikKalit] : [q.kalit])));
  const qoshimcha: QatorTur[] = [];
  for (const t of tariflar) {
    if (!obyekt(t.limits)) continue;
    for (const k of Object.keys(t.limits)) {
      if (bor.has(k)) continue;
      bor.add(k);
      qoshimcha.push({ tur: 'kvota', kalit: k, nomi: kvotaNomi[k] ?? k });
    }
  }
  return [...qatorlar, ...qoshimcha].map((q) => ({
    kalit: q.kalit,
    nomi: q.nomi,
    qiymat: Object.fromEntries(kodlar.map((kod) => [kod, katak(tariflar.find((t) => t.code === kod), q)])),
  }));
}

export interface KartaBand { nomi: string; qiymat: string }

/** Karta "What's included": jadvaldagi shu tarif qiymatlari ("Not included" tashlanadi) + features matni. */
export function kartaRoyxati(jadval: readonly JadvalQator[], kod: string, features?: unknown): KartaBand[] {
  const bandlar = jadval
    .filter((q) => q.qiymat[kod] && q.qiymat[kod] !== KIRITILMAGAN && q.qiymat[kod] !== 'Coming soon')
    .map((q) => ({ nomi: q.nomi, qiymat: q.qiymat[kod] }));
  return [...bandlar, ...matnlar(features).map((m) => ({ nomi: m, qiymat: '' }))];
}
