// TEST: ataylab buzilgan savollar (SAT_TEST_BANK=buzilgan). Build to'xtashi kerak.
import type { Savol } from '../../src/lib/sat/turlar';

export const savollar = [
  {
    id: 'test-buzilgan-1', fan: 'math', domen: 'Algebra', konikma: 'Linear functions', qiyinlik: 'oson',
    turi: 'tanlov', matn: 'TEST buzilgan: 3 ta variant.',
    variantlar: [{ harf: 'A', matn: '1' }, { harf: 'B', matn: '2' }, { harf: 'C', matn: '3' }],
    togri: 'D', tushuntirish_uz: '', variant_izohi_uz: { A: 'x', B: 'x', C: 'x', D: '' },
    holat: 'tekshirilgan', manba: 'original', muallif: 'Javohir',
  },
  {
    id: 'test-buzilgan-2', fan: 'rw', domen: 'Craft and Structure', konikma: 'Uydirma ko\'nikma', qiyinlik: 'oson',
    turi: 'yozma', matn: 'TEST buzilgan: rasmiy ro\'yxatda yo\'q ko\'nikma.', togri: [],
    tushuntirish_uz: 'TEST.', holat: 'tekshirilgan', manba: 'original', muallif: 'Javohir',
  },
] as unknown as Savol[];
