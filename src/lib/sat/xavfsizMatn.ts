// Savol matnini xavfsiz DOM ga aylantiradi (P06). innerHTML ishlatilmaydi.
// 1) Formulalar ($...$, $$...$$) belgi bilan almashtiriladi (TeX dagi < > HTML sifatida o'qilmasin).
// 2) Matn DOMParser bilan inert hujjatga o'qiladi: skript ishlamaydi, rasm yuklanmaydi.
// 3) Daraxt qayta quriladi: faqat ruxsat etilgan teglar createElement bilan, matn createTextNode bilan.
//    Atributlardan faqat th[scope] (row/col). Boshqa teglar ochib tashlanadi, xavfli teglar mazmuni bilan o'chadi.
// 4) Formula bo'lsa KaTeX kechiktirib yuklanadi (npm paketi, lokal; CDN yo'q), trust: false.

const RUXSAT = new Set(['u', 'em', 'strong', 'sup', 'sub', 'br', 'p', 'table', 'thead', 'tbody', 'tr', 'th', 'td']);
const OCHIRISH = new Set(['script', 'style', 'template', 'noscript', 'iframe', 'object', 'embed', 'head', 'title', 'link', 'meta']);

const FORMULA_BOSH = '\uE000';
const FORMULA_OXIR = '\uE001';
const DOLLAR = '\uE002';
const BELGI_RE = /\uE000(\d+)\uE001/g;

interface Formula { tex: string; alohida: boolean }

type Katex = typeof import('katex').default;
let katexVada: Promise<Katex> | null = null;

/** KaTeX CSS'i: faqat formula chiziladigan paytda <link> bilan ulanadi (sahifa boshida yuklanmaydi). */
function katexCss(): Promise<void> {
  return import('katex/dist/katex.min.css?url').then(({ default: href }) => new Promise<void>((tayyor) => {
    if (document.querySelector('link[data-katex]')) return tayyor();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.katex = '';
    link.onload = link.onerror = () => tayyor();
    document.head.appendChild(link);
  }));
}

/** KaTeX va uning CSS'ini bir marta yuklaydi. */
export function katexYukla(): Promise<Katex> {
  if (!katexVada) {
    katexVada = Promise.all([import('katex'), katexCss()]).then(([m]) => m.default);
  }
  return katexVada;
}

function formulalarniAjrat(manba: string): { matn: string; formulalar: Formula[] } {
  const formulalar: Formula[] = [];
  const matn = manba
    .replace(/[\uE000-\uE002]/g, '') // ichki belgilar manbada bo'lmasin
    .replace(/\\\$/g, DOLLAR)
    .replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (_, alohida: string | undefined, ichki: string | undefined) => {
      formulalar.push({ tex: (alohida ?? ichki ?? '').trim(), alohida: alohida !== undefined });
      return `${FORMULA_BOSH}${formulalar.length - 1}${FORMULA_OXIR}`;
    });
  return { matn, formulalar };
}

function matnTugunlari(matn: string, formulalar: Formula[], yigilgan: HTMLElement[]): Node[] {
  const tugunlar: Node[] = [];
  let oxirgi = 0;
  const qosh = (s: string) => { if (s) tugunlar.push(document.createTextNode(s.replaceAll(DOLLAR, '$'))); };
  for (const m of matn.matchAll(BELGI_RE)) {
    qosh(matn.slice(oxirgi, m.index));
    const f = formulalar[Number(m[1])];
    const el = document.createElement(f.alohida ? 'div' : 'span');
    el.className = f.alohida ? 'sk-formula sk-formula-alohida' : 'sk-formula';
    el.dataset.tex = f.tex;
    el.textContent = f.tex; // KaTeX yuklanguncha (yoki yuklanmasa) TeX matni
    yigilgan.push(el);
    tugunlar.push(el);
    oxirgi = (m.index ?? 0) + m[0].length;
  }
  qosh(matn.slice(oxirgi));
  return tugunlar;
}

function qur(manba: Node, ota: Node, formulalar: Formula[], yigilgan: HTMLElement[]): void {
  for (const t of Array.from(manba.childNodes)) {
    if (t.nodeType === Node.TEXT_NODE) {
      for (const n of matnTugunlari(t.textContent ?? '', formulalar, yigilgan)) ota.appendChild(n);
      continue;
    }
    if (t.nodeType !== Node.ELEMENT_NODE) continue; // izoh va boshqalar tashlanadi
    const el = t as Element;
    const teg = el.localName.toLowerCase();
    if (OCHIRISH.has(teg)) continue;
    if (!RUXSAT.has(teg) || el.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
      qur(el, ota, formulalar, yigilgan); // teg ochib tashlanadi, matni qoladi
      continue;
    }
    const yangi = document.createElement(teg);
    if (teg === 'th') {
      const scope = el.getAttribute('scope');
      if (scope === 'row' || scope === 'col') yangi.setAttribute('scope', scope);
    }
    if (teg === 'table') {
      // Keng jadval telefonda gorizontal suriladi; klaviatura bilan surish uchun fokuslanadigan hudud.
      const oram = document.createElement('div');
      oram.className = 'sk-jadval';
      oram.tabIndex = 0;
      oram.setAttribute('role', 'region');
      oram.setAttribute('aria-label', 'Table');
      oram.appendChild(yangi);
      ota.appendChild(oram);
    } else {
      ota.appendChild(yangi);
    }
    if (teg !== 'br') qur(el, yangi, formulalar, yigilgan);
  }
}

/**
 * `manba` matnini tozalab `ota` ichiga yozadi (avvalgi mazmun o'chiriladi).
 * Formulalar chizilganda Promise bajariladi.
 */
export async function xavfsizMatn(manba: string, ota: HTMLElement): Promise<void> {
  ota.replaceChildren();
  const { matn, formulalar } = formulalarniAjrat(manba ?? '');
  const hujjat = new DOMParser().parseFromString(`<!doctype html><body>${matn}</body>`, 'text/html');
  const yigilgan: HTMLElement[] = [];
  qur(hujjat.body, ota, formulalar, yigilgan);
  if (!yigilgan.length) return;
  try {
    const katex = await katexYukla();
    for (const el of yigilgan) {
      katex.render(el.dataset.tex ?? '', el, {
        displayMode: el.classList.contains('sk-formula-alohida'),
        throwOnError: false,
        trust: false,
        strict: 'ignore',
        output: 'htmlAndMathml',
      });
    }
  } catch {
    // KaTeX yuklanmasa TeX matni qoladi: o'qilsa bo'ladi, sahifa buzilmaydi.
  }
}

/** Testlar va SPR ko'rinishi uchun: matnda formula bormi */
export const formulaBormi = (s: string) => /\$[^$]+\$/.test((s ?? '').replace(/\\\$/g, ''));
