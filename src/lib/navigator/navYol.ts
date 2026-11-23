// NavYol qadami (DS NavYol) uchun DOM quruvchi: NavYol.astro dagi statik belgilash bilan bir xil.
// Brauzer kodi (boshqaruv.ts) ishlatadi; matn faqat textContent bilan yoziladi.

export type NavHolat = 'bajarildi' | 'hozir' | 'keyin';

export interface NavYorliqMalumot {
  matn: string;
  /** Laym yorliq: joriy holat, ekranda bitta */
  laym?: boolean;
}

export interface NavQadamMalumot {
  raqam: number;
  nomi: string;
  holat: NavHolat;
  /** Tayyor havola (yol() dan o'tgan). Yo'q bo'lsa nom oddiy matn */
  manzil?: string | null;
  izoh?: string;
  yorliqlar: NavYorliqMalumot[];
}

const SVG = 'http://www.w3.org/2000/svg';

/** Ikki xonali raqam: 1 → "01" */
export const ikkiXona = (n: number) => String(n).padStart(2, '0');

export function navQadam(q: NavQadamMalumot, doc: Document = document): HTMLLIElement {
  const el = <K extends keyof HTMLElementTagNameMap>(teg: K, klass: string, matn?: string) => {
    const x = doc.createElement(teg);
    x.className = klass;
    if (matn !== undefined) x.textContent = matn;
    return x;
  };
  const li = el('li', 'nav-qadam');
  li.dataset.holat = q.holat;
  if (q.holat === 'hozir') li.setAttribute('aria-current', 'step');

  const tugun = el('span', 'nav-tugun');
  tugun.setAttribute('aria-hidden', 'true');
  if (q.holat === 'bajarildi') {
    const svg = doc.createElementNS(SVG, 'svg');
    for (const [k, v] of Object.entries({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })) svg.setAttribute(k, v);
    const p = doc.createElementNS(SVG, 'path');
    p.setAttribute('d', 'M5 12l5 5 9-10');
    svg.append(p);
    tugun.append(svg);
  }

  const asos = el('div', 'nav-qadam-asos');
  const raqam = el('span', 'nav-num', ikkiXona(q.raqam));
  raqam.setAttribute('aria-hidden', 'true');
  asos.append(raqam);
  if (q.manzil) {
    const a = el('a', 'nav-nom', q.nomi);
    a.href = q.manzil;
    asos.append(a);
  } else {
    asos.append(el('span', 'nav-nom', q.nomi));
  }
  if (q.yorliqlar.length) {
    const qator = el('span', 'nav-qadam-yorliqlar');
    qator.append(...q.yorliqlar.map((y) => el('span', y.laym ? 'nav-chip nav-chip--laym' : 'nav-chip nav-chip--sahna', y.matn)));
    asos.append(qator);
  }
  if (q.izoh) asos.append(el('p', 'nav-qadam-izoh', q.izoh));

  li.append(tugun, asos);
  return li;
}
