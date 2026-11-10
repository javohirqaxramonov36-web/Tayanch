// One active tab per attempt. The owning tab refreshes a small lock record ("heartbeat");
// another tab that finds a fresh lock shows a warning and may take the attempt over.
import type { Ombor } from '../../navigator/ombor.ts';

export const QULF_KALIT = 'tayanch:ielts-reading-qulf:v1';
export const QULF_YURAK_MS = 2000;
/** A lock that was not refreshed for this long belongs to a closed or crashed tab. */
export const QULF_ESKIRADI_MS = 7000;

export type QulfEgasi = 'bosh' | 'meniki' | 'boshqa';

export function qulfEgasi(xom: string | null, tabId: string, hozir: number): QulfEgasi {
  if (!xom) return 'bosh';
  try {
    const q = JSON.parse(xom) as { tab?: unknown; vaqt?: unknown };
    if (typeof q.tab !== 'string' || typeof q.vaqt !== 'number') return 'bosh';
    if (q.tab === tabId) return 'meniki';
    return hozir - q.vaqt > QULF_ESKIRADI_MS ? 'bosh' : 'boshqa';
  } catch {
    return 'bosh';
  }
}

export function qulfOl(ombor: Ombor, tabId: string, hozir: number): void {
  ombor.yoz(QULF_KALIT, JSON.stringify({ tab: tabId, vaqt: hozir }));
}

/** Releases the lock only if this tab still owns it. */
export function qulfBoshat(ombor: Ombor, tabId: string, hozir: number): void {
  if (qulfEgasi(ombor.oqi(QULF_KALIT), tabId, hozir) === 'meniki') ombor.ochir(QULF_KALIT);
}
