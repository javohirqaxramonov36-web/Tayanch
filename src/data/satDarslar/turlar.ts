// SAT Math interaktiv darslari: SAT ga xos turlar. Umumiy turlar: src/data/darsTurlar.ts.
// Savollar Tayanch uchun yozilgan, College Board savollaridan ko'chirilmagan.
// verified: muallif tekshirib bo'lgach true qo'yadi. false bo'lsa saytda "tekshirilmagan" yorlig'i chiqadi.
// Har savol javobi scripts/savollarni-tekshir.ts da ikkinchi usul bilan qayta hisoblanadi.
import type { DarsSavol as UmumiySavol } from '../darsTurlar';

export type { Qiyinlik, Variant } from '../darsTurlar';
export type DarsModul = 'hajm' | 'grafik' | 'aylana' | 'statistika';
export type DarsSavol = UmumiySavol<DarsModul>;

export const KALIT_PROGRESS = 'tayanch:sat-dars-progress';
export const KALIT_XATO_DAFTARI = 'tayanch:sat-xato-daftari';
export const KALIT_REJA = 'tayanch:sat-reja';

export const modulNomi: Record<DarsModul, string> = {
  hajm: 'Hajm laboratoriyasi',
  grafik: 'Funksiya grafigi',
  aylana: 'Birlik aylana',
  statistika: 'Statistika',
};
