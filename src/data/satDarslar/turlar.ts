// SAT Math interaktiv darslari: SAT ga xos turlar. Umumiy turlar: src/data/darsTurlar.ts.
// Savollar Tayanch uchun yozilgan, College Board savollaridan ko'chirilmagan.
// verified: muallif tekshirib bo'lgach true qo'yadi. false bo'lsa saytda "tekshirilmagan" yorlig'i chiqadi.
// Har savol javobi scripts/savollarni-tekshir.ts da ikkinchi usul bilan qayta hisoblanadi.
import type { DarsSavol as UmumiySavol } from '../darsTurlar';

export type { Qiyinlik, Variant } from '../darsTurlar';
export type DarsModul = 'hajm' | 'grafik' | 'aylana' | 'statistika' | 'rw-xato' | 'rw-dalil' | 'rw-otish' | 'rw-lugat';
export type DarsSavol = UmumiySavol<DarsModul>;

export const KALIT_PROGRESS = 'tayanch:sat-dars-progress';
export const KALIT_XATO_DAFTARI = 'tayanch:sat-xato-daftari';
export const KALIT_REJA = 'tayanch:sat-reja';

export const modulNomi: Record<DarsModul, string> = {
  hajm: 'Volume lab',
  grafik: 'Function graphs',
  aylana: 'Unit circle',
  statistika: 'Statistics',
  'rw-xato': 'Find the error',
  'rw-dalil': 'Mark the evidence',
  'rw-otish': 'Transition words',
  'rw-lugat': 'Vocabulary in context',
};
