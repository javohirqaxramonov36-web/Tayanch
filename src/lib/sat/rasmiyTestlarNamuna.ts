// Faqat dev va sinov: test tracker'ni ma'lumot bilan ko'rish uchun namuna (?namuna=5).
// Sahifa bu modulni faqat import.meta.env.DEV da yuklaydi, prod build'ga tushmaydi.
// Raqamlar to'qima namuna (ekranda "Sample" deb belgilanadi), hech kimning natijasi emas. Saqlanmaydi.
import { domenTop, type Ombor, type RasmiyXato } from './rasmiyTestlar.ts';

/** bugun: YYYY-MM-DD; sanalar undan oldinga hisoblanadi, shuning uchun hech biri kelajakda emas. */
export function namunaOmbor(bugun: string): Ombor {
  const [y, m, d] = bugun.split('-').map(Number);
  const oldin = (kun: number) => new Date(Date.UTC(y, m - 1, d) - kun * 86400000).toISOString().slice(0, 10);
  const t = (id: string, turi: 'real' | 'practice', nomi: string, kun: number, rw: number, math: number, daqiqa: number | null = null) =>
    ({ id, t: 1000 - kun, turi, nomi, sana: oldin(kun), rw, math, daqiqa, izoh: '' });
  const testlar = [
    t('n-p1', 'practice', 'Sample practice test A', 420, 560, 590, 150),
    t('n-r1', 'real', 'Sample SAT 1', 380, 580, 610),
    t('n-r2', 'real', 'Sample SAT 2', 300, 610, 640),
    t('n-p2', 'practice', 'Sample practice test B', 250, 630, 650, 140),
    t('n-r3', 'real', 'Sample SAT 3', 210, 640, 690),
    t('n-r4', 'real', 'Sample SAT 4', 120, 670, 710),
    t('n-r5', 'real', 'Sample SAT 5', 40, 690, 730),
  ];
  const x = (id: string, testId: string, bolim: 'rw' | 'math', modul: 1 | 2, savol: number, konikma: string, sabab: RasmiyXato['sabab'], hal: boolean, izoh = ''): RasmiyXato =>
    ({ id, t: 1, testId, bolim, modul, savol, konikma, domen: konikma ? domenTop(bolim, konikma) : '', sabab, izoh, hal });
  const xatolar = [
    x('n-x1', 'n-r1', 'math', 2, 18, 'Circles', 'concept', true, 'Sample note: forgot the arc length formula.'),
    x('n-x2', 'n-r1', 'rw', 1, 9, 'Transitions', 'misread', true),
    x('n-x3', 'n-r3', 'math', 2, 21, 'Nonlinear functions', 'time', false),
    x('n-x4', 'n-r3', 'math', 1, 14, 'Circles', 'calculation', false),
    x('n-x5', 'n-r4', 'rw', 2, 24, 'Command of Evidence: Quantitative', 'concept', false),
    x('n-x6', 'n-r4', 'math', 2, 20, 'Percentages', 'careless', false),
    x('n-x7', 'n-r5', 'math', 2, 22, 'Circles', 'guess', false),
    x('n-x8', 'n-r5', 'rw', 1, 3, '', 'other', false),
  ];
  return { versiya: 1, testlar, xatolar };
}
