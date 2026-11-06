// TEST: soxta savollar, faqat lokal sinov uchun (SAT_TEST_BANK=1). Saytga chiqmaydi.
// Mazmuni ataylab ma'nosiz: haqiqiy SAT savoli emas.
import type { Savol } from '../../src/lib/sat/turlar';

const umumiy = { manba: 'original', muallif: 'Javohir' } as const;
const izoh = (togri: string) => ({
  A: togri === 'A' ? "TEST: to'g'ri variant izohi." : "TEST: A nega noto'g'ri.",
  B: togri === 'B' ? "TEST: to'g'ri variant izohi." : "TEST: B nega noto'g'ri.",
  C: togri === 'C' ? "TEST: to'g'ri variant izohi." : "TEST: C nega noto'g'ri.",
  D: togri === 'D' ? "TEST: to'g'ri variant izohi." : "TEST: D nega noto'g'ri.",
});

export const savollar: Savol[] = [
  {
    id: 'test-math-1', fan: 'math', domen: 'Algebra', konikma: 'Linear equations in one variable', qiyinlik: 'oson',
    turi: 'tanlov', matn: 'TEST 1. If $x + 1 = 3$, choose $x$.',
    variantlar: [{ harf: 'A', matn: '$1$' }, { harf: 'B', matn: '$2$' }, { harf: 'C', matn: '$3$' }, { harf: 'D', matn: '$4$' }],
    togri: 'B', tushuntirish_uz: 'TEST: $x = 3 - 1 = 2$.', variant_izohi_uz: izoh('B'), holat: 'tekshirilgan', ...umumiy,
  },
  {
    id: 'test-math-2', fan: 'math', domen: 'Advanced Math', konikma: 'Equivalent expressions', qiyinlik: 'qiyin',
    turi: 'tanlov', matn: 'TEST 2. Which equals $\\frac{x^2}{x}$ for $x \\neq 0$? A shop sells it for \\$5.',
    variantlar: [{ harf: 'A', matn: '$x$' }, { harf: 'B', matn: '$x^2$' }, { harf: 'C', matn: '$1$' }, { harf: 'D', matn: '$2x$' }],
    togri: 'A', tushuntirish_uz: 'TEST: qisqartirish.', variant_izohi_uz: izoh('A'), holat: 'tekshirilgan', ...umumiy,
  },
  {
    id: 'test-math-3', fan: 'math', domen: 'Problem-Solving and Data Analysis', konikma: 'Percentages', qiyinlik: 'orta',
    turi: 'yozma', matn: 'TEST 3. Type $7/2$ as a number.',
    togri: ['3.5', '7/2'], tushuntirish_uz: "TEST: $7 \\div 2 = 3.5$. Qabul qilinadi: 3.5 yoki 7/2.", holat: 'tekshirilgan', ...umumiy,
  },
  {
    id: 'test-rw-1', fan: 'rw', domen: 'Craft and Structure', konikma: 'Words in Context', qiyinlik: 'oson',
    turi: 'tanlov', matn: 'TEST 4. Placeholder passage text for layout only.\n\nWhich choice is marked correct in this test?',
    variantlar: [{ harf: 'A', matn: 'Test option A' }, { harf: 'B', matn: 'Test option B' }, { harf: 'C', matn: 'Test option C' }, { harf: 'D', matn: 'Test option D' }],
    togri: 'C', tushuntirish_uz: "TEST: bu sinov savoli, to'g'ri javob C.", variant_izohi_uz: izoh('C'), holat: 'tekshirilgan', ...umumiy,
  },
  {
    id: 'test-rw-2', fan: 'rw', domen: 'Standard English Conventions', konikma: 'Boundaries', qiyinlik: 'orta',
    turi: 'tanlov', matn: 'TEST 5. Second placeholder for the last-question state.',
    variantlar: [{ harf: 'A', matn: 'Test A' }, { harf: 'B', matn: 'Test B' }, { harf: 'C', matn: 'Test C' }, { harf: 'D', matn: 'Test D' }],
    togri: 'D', tushuntirish_uz: "TEST: to'g'ri javob D.", variant_izohi_uz: izoh('D'), holat: 'tekshirilgan', ...umumiy,
  },
  {
    id: 'test-qoralama', fan: 'rw', domen: 'Expression of Ideas', konikma: 'Transitions', qiyinlik: 'oson',
    turi: 'tanlov', matn: "TEST 6. Qoralama: saytda ko'rinmasligi kerak.",
    variantlar: [{ harf: 'A', matn: 'A' }, { harf: 'B', matn: 'B' }, { harf: 'C', matn: 'C' }, { harf: 'D', matn: 'D' }],
    togri: 'A', tushuntirish_uz: 'TEST.', variant_izohi_uz: izoh('A'), holat: 'qoralama', ...umumiy,
  },
];
