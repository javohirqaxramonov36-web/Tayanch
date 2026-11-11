// Koordinata tekisligi (SVG): viewBox 0 0 420 420, o'qlar −10..10, 1 birlik = 20px.
// Ishlatiladi: "Funksiya grafigi" darsi (qollanma/math/grafik) va kalkulyator vositasi (vosita/kalkulyator).
// Panjara, o'qlar va raqamlar markup'i: components/GrafikPanjara.astro.

export const NS = 'http://www.w3.org/2000/svg';
export const SAHNA = 420;
const MARKAZ = SAHNA / 2;
const BIRLIK = 20;
/** Ko'rinadigan chegara (birlikda): undan tashqaridagi nuqta va tutqich chizilmaydi */
export const CHEGARA = 10.5;

export const X = (x: number) => MARKAZ + BIRLIK * x;
export const Y = (y: number) => MARKAZ - BIRLIK * y;
/** SVG nuqtasidan grafik koordinatasiga: [x, y] */
export const teskari = (p: { x: number; y: number }): [number, number] => [(p.x - MARKAZ) / BIRLIK, (MARKAZ - p.y) / BIRLIK];

/** Panjara chiziqlari: −10..10 */
export const panjara = Array.from({ length: 21 }, (_, i) => i - 10);
/** O'qlardagi raqamlar: juft, 0 va ±10 dan tashqari */
export const raqamlar = panjara.filter((i) => i !== 0 && i % 2 === 0 && Math.abs(i) < 10);
export const raqamYozuv = (i: number) => (i < 0 ? `−${-i}` : String(i));

export const korinadimi = (x: number, y: number) => Math.abs(x) <= CHEGARA && Math.abs(y) <= CHEGARA;

/** y = f(x) egri chizig'i uchun path "d" qiymati. Juda katta |y| qiymatlari tashlab yuboriladi. */
export function egriYol(f: (x: number) => number): string {
  let d = '';
  for (let x = -10.6; x <= 10.6; x += 0.05) {
    const y = f(x);
    if (Math.abs(y) > 40) continue;
    d += `${d ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`;
  }
  return d;
}

/** Nuqta va yozuv. Yozuv tutqichlar bilan to'qnashmasligi uchun nuqtaning chap-pastiga qo'yiladi,
 *  chetga yaqin bo'lsa ichkariga suriladi. */
export function belgiQosh(guruh: Element, x: number, y: number, matn: string, sinf = ''): void {
  if (!korinadimi(x, y)) return;
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('cx', String(X(x))); c.setAttribute('cy', String(Y(y))); c.setAttribute('r', '5'); c.setAttribute('class', 'g-nuqta ' + sinf);
  guruh.append(c);
  if (!matn) return;
  const t = document.createElementNS(NS, 'text'); t.setAttribute('class', 'g-yozuv'); t.textContent = matn;
  const kenglik = matn.length * 7.5;
  const chapga = X(x) - 14 - kenglik > 4;
  t.setAttribute('x', String(chapga ? X(x) - 14 : X(x) + 14));
  t.setAttribute('text-anchor', chapga ? 'end' : 'start');
  t.setAttribute('y', String(Math.min(410, Math.max(16, Y(y) + 22))));
  guruh.append(t);
}
