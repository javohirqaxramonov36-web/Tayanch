// Mock imtihon: adaptive-style 2-modul tanlash va savol qiyinligini kalibrlash (P31). Sof funksiyalar, DOM va tarmoq yo'q.
// Rasmiy SAT algoritmi (IRT) bilan bir xil emas. Sozlama: src/data/satAdaptiv.ts, hujjat: docs/sat-adaptiv.md.
import { adaptivSozlama, type AdaptivSozlama, type SatBolim } from '../../data/satAdaptiv.ts';

export type Tarmoq = 'qiyin' | 'oson' | 'standart';

/**
 * Nima uchun shu tarmoq:
 * chegara-yoq: sozlamada chegara berilmagan (yoki noto'g'ri) → adaptivlik o'chiq;
 * savol-kam: tarmoqlardan birida savol yetarli emas → adaptivlik o'chiq;
 * natija-yoq: 1-modul natijasi yaroqsiz (0 savol, manfiy, to'g'ri > jami);
 * ustida / ostida: aniqlik chegaradan qat'iy katta / katta emas.
 */
export type TarmoqSabab = 'chegara-yoq' | 'savol-kam' | 'natija-yoq' | 'ustida' | 'ostida';

export interface Modul1Natija {
  togri: number;
  jami: number;
}

/** Har tarmoq uchun 2-modulga olish mumkin bo'lgan tasdiqlangan savollar soni (1-modulda ishlatilganlarsiz). */
export interface TarmoqSavolSoni {
  oson: number;
  qiyin: number;
}

export interface TarmoqTanlov {
  tarmoq: Tarmoq;
  sabab: TarmoqSabab;
  /** 1-modul aniqligi foizda (0–100, yaxlitlanmagan), natija yaroqsiz bo'lsa null. */
  aniqlik: number | null;
}

const butunMi = (n: number) => Number.isInteger(n) && n >= 0;

/** Aniqlik foizda. Yaroqsiz natija → null. */
export function aniqlik(n: Modul1Natija): number | null {
  if (!butunMi(n.togri) || !butunMi(n.jami) || n.jami === 0 || n.togri > n.jami) return null;
  return (n.togri / n.jami) * 100;
}

/** Chegara yaroqlimi: chekli son, 0 dan 100 gacha. Aks holda adaptivlik o'chiq hisoblanadi. */
export function chegaraYaroqli(c: number | null): c is number {
  return typeof c === 'number' && Number.isFinite(c) && c >= 0 && c <= 100;
}

/**
 * Adaptivlik shu bo'lim uchun yoqiladimi. Yoqilmasa sabab qaytadi, 2-modul standart tartibda.
 * Natijaga bog'liq emas: P30 1-modul boshlanishidan oldin ham so'rashi mumkin.
 */
export function adaptivHolat(
  bolim: SatBolim,
  savolSoni: TarmoqSavolSoni,
  sozlama: AdaptivSozlama = adaptivSozlama,
): { yoqilgan: true } | { yoqilgan: false; sabab: 'chegara-yoq' | 'savol-kam' } {
  if (!chegaraYaroqli(sozlama.chegara)) return { yoqilgan: false, sabab: 'chegara-yoq' };
  const min = sozlama.minSavolTarmoq[bolim];
  if (!(savolSoni.oson >= min) || !(savolSoni.qiyin >= min)) return { yoqilgan: false, sabab: 'savol-kam' };
  return { yoqilgan: true };
}

/** 1-modul natijasidan 2-modul tarmog'i. Adaptivlik o'chiq bo'lsa doim 'standart'. */
export function tarmoqTanla(
  natija: Modul1Natija,
  bolim: SatBolim,
  savolSoni: TarmoqSavolSoni,
  sozlama: AdaptivSozlama = adaptivSozlama,
): TarmoqTanlov {
  const a = aniqlik(natija);
  const h = adaptivHolat(bolim, savolSoni, sozlama);
  if (!h.yoqilgan) return { tarmoq: 'standart', sabab: h.sabab, aniqlik: a };
  if (a === null) return { tarmoq: 'standart', sabab: 'natija-yoq', aniqlik: null };
  // Butun sonlar bilan taqqoslanadi: (togri / jami) × 100 float'da 7/10 → 70.00000000000001 bo'lib, tenglikni "ustida" qilardi.
  return natija.togri * 100 > (sozlama.chegara as number) * natija.jami
    ? { tarmoq: 'qiyin', sabab: 'ustida', aniqlik: a }
    : { tarmoq: 'oson', sabab: 'ostida', aniqlik: a };
}

/** Tarmoq qaysi qiyinlik darajalaridan olinadi. 'standart' → null (P30 dagi oddiy tartib, qiyinlik bo'yicha filtr yo'q). */
export function tarmoqQiyinliklari(tarmoq: Tarmoq, sozlama: AdaptivSozlama = adaptivSozlama): readonly number[] | null {
  return tarmoq === 'standart' ? null : sozlama.tarmoqQiyinlik[tarmoq];
}

// ---------- Kalibrlash ----------

/** Bitta savol bo'yicha javoblar: har foydalanuvchining shu savol versiyasiga bergan BIRINCHI javobi. */
export interface KalibrQator {
  savolId: string;
  joriy: number;
  javoblar: number;
  togri: number;
}

export type KalibrHolat = 'kam' | 'mos' | 'ozgaradi';

export interface KalibrNatija extends KalibrQator {
  /** To'g'ri javob ulushi foizda, javob yo'q bo'lsa null. */
  ulush: number | null;
  /** Taklif qilingan qiyinlik (1–5); javoblar N dan kam bo'lsa null. */
  taklif: number | null;
  holat: KalibrHolat;
}

/** Ulushdan (foiz) qiyinlik: pog'onalar kamayish tartibida. */
export function ulushdanQiyinlik(ulush: number, pogonalar = adaptivSozlama.kalibrlash.pogonalar): number {
  for (let i = 0; i < pogonalar.length; i++) if (ulush >= pogonalar[i]) return i + 1;
  return pogonalar.length + 1;
}

export function kalibrla(qatorlar: readonly KalibrQator[], sozlama: AdaptivSozlama = adaptivSozlama): KalibrNatija[] {
  const { minJavob, pogonalar } = sozlama.kalibrlash;
  return qatorlar.map((q) => {
    const ulush = q.javoblar > 0 ? (q.togri / q.javoblar) * 100 : null;
    if (ulush === null || q.javoblar < minJavob) return { ...q, ulush, taklif: null, holat: 'kam' as const };
    const taklif = ulushdanQiyinlik(ulush, pogonalar);
    return { ...q, ulush, taklif, holat: taklif === q.joriy ? ('mos' as const) : ('ozgaradi' as const) };
  });
}

/** Hisobot jadvali (Markdown): o'zgaradiganlar avval, keyin mos, keyin kam javobli. */
export function kalibrJadval(natijalar: readonly KalibrNatija[]): string {
  const tartib: Record<KalibrHolat, number> = { ozgaradi: 0, mos: 1, kam: 2 };
  const qatorlar = [...natijalar]
    .sort((a, b) => tartib[a.holat] - tartib[b.holat] || b.javoblar - a.javoblar || a.savolId.localeCompare(b.savolId))
    .map((n) => `| ${n.savolId} | ${n.joriy} | ${n.javoblar} | ${n.ulush === null ? '—' : n.ulush.toFixed(1)} | ${n.taklif ?? '—'} | ${n.holat} |`);
  return ['| Savol | Joriy | Javoblar | To\'g\'ri, % | Taklif | Holat |', '| --- | --- | --- | --- | --- | --- |', ...qatorlar].join('\n');
}
