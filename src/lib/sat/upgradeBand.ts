// SAT yon panelidagi doimiy "Upgrade to Pro" bandi (TopTierPrep sidebar CTA'siga o'xshash, lekin bosimsiz).
// Faqat kirgan va bepul tarifdagi foydalanuvchiga ko'rinadi; izoh faqat plans ma'lumotidan (kodda tarif raqami yo'q).
// Sof qism (bandKorinadimi, upgradeIzohi) testlanadi: src/lib/testlar/upgradeBand.test.ts.
// Brauzer qismi (upgradeBandUlash) supabase-js yuklamaydi: REST'ga ochiq kalit va sessiya tokeni bilan 2 ta so'rov,
// natija sessionStorage `tayanch:sat-tarif-kesh` da 10 daqiqa saqlanadi (har sahifada so'rov yubormaslik uchun).
import { taqqoslashJadvali, type QatorTur, type TarifManba } from './tarifJadval.ts';

export const KESH_KALITI = 'tayanch:sat-tarif-kesh';
export const KESH_MS = 10 * 60_000;

/** Band ko'rinadimi: amaldagi tarif ma'lum va u bepul (free). Pullik yoki noma'lum: ko'rinmaydi. */
export function bandKorinadimi(planKod: string | null | undefined): boolean {
  return planKod === 'free';
}

/**
 * Izoh: tavsiya tarif Free'dan farq qiladigan qatorlar nomi (ko'pi bilan 2 ta), masalan "Extended analytics".
 * Farq yo'q yoki tavsiya tarif bazada yo'q bo'lsa null (band faqat "Upgrade to Pro" va umumiy izoh bilan chiqadi).
 */
export function upgradeIzohi(tariflar: readonly TarifManba[], tavsiya: string, qatorlar: readonly QatorTur[], kvotaNomi: Record<string, string> = {}): string | null {
  if (!tariflar.some((t) => t.code === tavsiya)) return null;
  const jadval = taqqoslashJadvali(tariflar, ['free', tavsiya], qatorlar, kvotaNomi);
  const farq = jadval.filter((q) => q.qiymat[tavsiya] !== q.qiymat.free && q.qiymat[tavsiya] !== 'Not included').map((q) => q.nomi);
  if (!farq.length) return null;
  return farq.slice(0, 2).join(', ') + (farq.length > 2 ? ' and more' : '');
}

export interface Kesh { vaqt: number; plan: string | null; izoh: string | null; tarifNomi: string | null }

export function keshYaroqli(k: unknown, hozir: number): k is Kesh {
  if (!k || typeof k !== 'object') return false;
  const x = k as Kesh;
  return typeof x.vaqt === 'number' && hozir - x.vaqt >= 0 && hozir - x.vaqt < KESH_MS;
}
