// IELTS interaktiv darslari: IELTS ga xos turlar. Umumiy turlar: src/data/darsTurlar.ts.
// Savollar Tayanch uchun yozilgan, IELTS (ielts.org, British Council, IDP, Cambridge) savollaridan ko'chirilmagan va parafraz qilinmagan.
// verified: muallif tekshirib bo'lgach true qo'yadi. false bo'lsa saytda "tekshirilmagan" yorlig'i chiqadi.
// Har savol javobi scripts/savollarni-tekshir.ts da ikkinchi usul bilan qayta yechiladi (tekshiruv.ts).
import type { DarsSavol as UmumiySavol } from '../darsTurlar';

export type { Qiyinlik, Variant } from '../darsTurlar';
export type DarsModul = 'ir-tfng' | 'ir-sarlavha';
export type DarsSavol = UmumiySavol<DarsModul>;

export const modulNomi: Record<DarsModul, string> = {
  'ir-tfng': 'True / False / Not Given',
  'ir-sarlavha': 'Matching headings',
};
