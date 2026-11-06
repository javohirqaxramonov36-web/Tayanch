// Top Admission interaktiv darslari: bo'limga xos turlar. Umumiy turlar: src/data/darsTurlar.ts.
// Savollar Tayanch uchun yozilgan. Faktlar faqat manbalar.ts dagi rasmiy ID bilan (CA01, CA02, UC01, TB01).
// verified: muallif tekshirib bo'lgach true qo'yadi. false bo'lsa saytda "tekshirilmagan" yorlig'i chiqadi.
// Har savol javobi scripts/savollarni-tekshir.ts da ikkinchi usul bilan qayta yechiladi (tekshiruv.ts).
import type { DarsSavol as UmumiySavol } from '../darsTurlar';

export type { Qiyinlik, Variant } from '../darsTurlar';
export type DarsModul = 'ta-zinapoya';
export type DarsSavol = UmumiySavol<DarsModul>;

export const modulNomi: Record<DarsModul, string> = {
  'ta-zinapoya': 'Ariza zinapoyasi',
};
