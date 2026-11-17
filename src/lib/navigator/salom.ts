// Time-of-day greeting. Boundaries (device local hour):
//   05:00-10:59 morning ("tong"), 11:00-17:59 day ("kun"), 18:00-04:59 evening ("kech").
import type { NavigatorMatn } from '../../data/navigatorMatn.ts';

export type KunQismi = 'tong' | 'kun' | 'kech';

export function kunQismi(soat: number): KunQismi {
  if (soat >= 5 && soat < 11) return 'tong';
  if (soat >= 11 && soat < 18) return 'kun';
  return 'kech';
}

/** "Xayrli tong, Aziza!" or "Xayrli tong!" when no name is known. */
export function salomMatni(matn: Pick<NavigatorMatn, 'salom'>, sana: Date, ism?: string | null): string {
  const asos = matn.salom[kunQismi(sana.getHours())];
  const toza = (ism ?? '').trim();
  return toza ? `${asos}, ${toza}!` : `${asos}!`;
}
