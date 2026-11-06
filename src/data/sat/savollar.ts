// SAT savol banki. Har savol alohida obyekt.
// Savollarni muallif beradi (manba: 'original'). Savol o'ylab topilmaydi, boshqa saytlardan ko'chirilmaydi.
// Saytda faqat holat: 'tekshirilgan' savollar ko'rinadi.
// Build vaqtida tekshiriladi: src/lib/sat/bank.ts (xato bo'lsa build to'xtaydi).
//
// Maydonlar (turlar: src/lib/sat/turlar.ts):
//   id, fan ('math' | 'rw'), domen, konikma (src/data/sat/format.ts dagi rasmiy ro'yxatdan),
//   qiyinlik ('oson' | 'orta' | 'qiyin'), turi ('tanlov' | 'yozma'),
//   matn (inglizcha; matematik ifoda $...$ ichida, oddiy dollar belgisi \$),
//   variantlar: tanlovda aynan 4 ta [{ harf: 'A', matn }, ... 'D'],
//   togri: tanlovda harf ('C'); yozmada qabul qilinadigan javoblar ['3.5', '7/2'],
//   tushuntirish_uz, variant_izohi_uz: { A, B, C, D } (tanlovda majburiy),
//   holat ('qoralama' | 'tekshirilgan'), manba: 'original', muallif: 'Javohir'.
//
// Namuna (izoh ichida, bankda emas):
// {
//   id: 'math-alg-001', fan: 'math', domen: 'Algebra', konikma: 'Linear equations in one variable',
//   qiyinlik: 'oson', turi: 'tanlov', matn: 'If $2x + 3 = 11$, what is the value of $x$?',
//   variantlar: [{ harf: 'A', matn: '$3$' }, { harf: 'B', matn: '$4$' }, { harf: 'C', matn: '$5$' }, { harf: 'D', matn: '$7$' }],
//   togri: 'B', tushuntirish_uz: '...', variant_izohi_uz: { A: '...', B: '...', C: '...', D: '...' },
//   holat: 'qoralama', manba: 'original', muallif: 'Javohir',
// }
import type { Savol } from '../../lib/sat/turlar';

export const savollar: Savol[] = [];
