// Savol ko'rsatkichi (P06): R&W va Math, test javobli (mcq) va o'zi yoziladigan (spr) savollar.
// Boshqariladigan komponent: holatni faqat ota sahifa o'zgartiradi (hodisa → ota → yangila(holat)).
// Tarmoq so'rovi, Supabase, localStorage yo'q. Matn faqat xavfsizMatn() orqali (innerHTML yo'q).
// Uslub: src/components/sat/SavolUslub.astro (sahifaga bir marta qo'yiladi). Matn inglizcha (SAT bo'limi).
//
// Klaviatura (fokus komponent ichida bo'lsa):
//   A–D (yoki variant kaliti): variantni tanlash; strelkalar / Home / End: variantlar orasida yurish va tanlash
//   (ARIA radio namunasi); Space / Enter: fokusdagi variantni tanlash; SPR maydonida Enter: yuborish.

import type { Savol, SavolHolati, SavolKorsatkichProps } from './savolTuri';
import { xavfsizMatn } from './xavfsizMatn';
import { sprTekshir } from './sprFormat';

export interface SavolKorsatkich {
  /** Ota sahifa yangi holatni beradi */
  yangila(holat: SavolHolati): void;
  /** DOM dan olib tashlaydi */
  yoq(): void;
  /** Matn va formulalar chizilganda bajariladi */
  tayyor: Promise<void>;
}

const M = {
  savol: (n: number) => `Question ${n}`,
  passage: 'Passage',
  belgila: 'Mark for review',
  ochirishRejimi: 'Cross out',
  ochirishRejimiIzoh: 'Cross out answer choices you have ruled out',
  ochirVariant: (k: string) => `Cross out choice ${k}`,
  ochirilgan: ', eliminated',
  togriJavobSr: ', correct answer',
  sizningXato: ', your answer, incorrect',
  sprYorliq: 'Your answer',
  sprYordam: 'Enter a whole number, a decimal like 0.75 or a fraction like 3/4. For a negative answer, start with a minus sign.',
  sprKorinish: 'Answer preview:',
  sprSaqla: 'Save answer',
  sprTekshir: 'Check answer',
  togri: (j: string) => `Correct. Answer: ${j}`,
  xato: (j: string) => `Not this time. Correct answer: ${j}`,
  rasmAltYoq: 'SavolKorsatkich: figure.alt majburiy (bo\'sh bo\'lmasin)',
  variantYoq: 'SavolKorsatkich: mcq savolda options bo\'lishi kerak',
};

const SVG_NS = 'http://www.w3.org/2000/svg';
let raqamlagich = 0;

function el<K extends keyof HTMLElementTagNameMap>(teg: K, sinf?: string, matn?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(teg);
  if (sinf) e.className = sinf;
  if (matn !== undefined) e.textContent = matn;
  return e;
}

/** Chiziqli ikonka (DESIGN.md: stroke 2, currentColor), aria-hidden. */
function ikonka(yollar: string[], sinf = '', qalinlik = 2): SVGSVGElement {
  const s = document.createElementNS(SVG_NS, 'svg');
  s.setAttribute('aria-hidden', 'true');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', '20');
  s.setAttribute('height', '20');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', String(qalinlik));
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  if (sinf) s.setAttribute('class', sinf);
  for (const d of yollar) {
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', d);
    s.appendChild(p);
  }
  return s;
}

const IK = {
  bayroq: ['M4 22V4', 'M4 4h13l-2 4 2 4H4'],
  togri: ['M5 12l5 5L20 7'],
  xato: ['M6 6l12 12M18 6L6 18'],
  ochirish: ['M4 12h16', 'M8 6h8a4 4 0 0 1 0 8', 'M16 18H8a4 4 0 0 1 0-8'],
  ogoh: ['M12 9v4', 'M12 17h.01', 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'],
};

function tekshirSavol(s: Savol): void {
  if (s.figure && !s.figure.alt?.trim()) throw new Error(M.rasmAltYoq);
  if (s.format === 'mcq' && !(s.options && s.options.length >= 2)) throw new Error(M.variantYoq);
}

export function savolChiz(konteyner: HTMLElement, props: SavolKorsatkichProps): SavolKorsatkich {
  const { savol, rejim, raqam } = props;
  tekshirSavol(savol);
  let holat: SavolHolati = { ...props.holat, ochirilgan: [...props.holat.ochirilgan] };
  let ochirishRejimi = false;
  const id = `sk${++raqamlagich}`;
  const vadalar: Promise<void>[] = [];
  const yoz = (manba: string, ota: HTMLElement) => vadalar.push(xavfsizMatn(manba, ota));

  // ---------- Tuzilma ----------
  const ildiz = el('div', 'sk');
  ildiz.lang = 'en';
  ildiz.dataset.format = savol.format;
  ildiz.dataset.bolim = savol.section;
  const tartib = el('div', 'sk-tartib');
  ildiz.appendChild(tartib);

  if (savol.passage) {
    tartib.classList.add('sk-passageli');
    const p = el('section', 'sk-passage');
    p.setAttribute('aria-label', M.passage);
    p.tabIndex = 0; // keng ekranda alohida suriladi: klaviatura bilan surish uchun
    const ichki = el('div', 'sk-matn');
    yoz(savol.passage, ichki);
    p.appendChild(ichki);
    tartib.appendChild(p);
  }

  const qism = el('section', 'sk-savol');
  qism.setAttribute('aria-labelledby', `${id}-stem`);
  tartib.appendChild(qism);

  const bosh = el('div', 'sk-bosh');
  if (raqam) bosh.appendChild(el('span', 'sk-pill', M.savol(raqam)));
  const asboblar = el('div', 'sk-asboblar');
  bosh.appendChild(asboblar);
  qism.appendChild(bosh);

  let ochirishTugma: HTMLButtonElement | null = null;
  if (savol.format === 'mcq') {
    ochirishTugma = el('button', 'sk-asbob sk-ochirish-tugma');
    ochirishTugma.type = 'button';
    ochirishTugma.setAttribute('aria-pressed', 'false');
    ochirishTugma.title = M.ochirishRejimiIzoh;
    ochirishTugma.append(ikonka(IK.ochirish), el('span', '', M.ochirishRejimi));
    asboblar.appendChild(ochirishTugma);
  }
  const bayroq = el('button', 'sk-asbob sk-bayroq');
  bayroq.type = 'button';
  bayroq.append(ikonka(IK.bayroq), el('span', '', M.belgila));
  asboblar.appendChild(bayroq);

  if (savol.figure) {
    const f = el('figure', 'sk-rasm');
    const img = el('img');
    img.src = savol.figure.src;
    img.alt = savol.figure.alt;
    img.decoding = 'async';
    f.appendChild(img);
    if (savol.figure.caption) {
      const fc = el('figcaption');
      yoz(savol.figure.caption, fc);
      f.appendChild(fc);
    }
    qism.appendChild(f);
  }

  const stem = el('div', 'sk-stem sk-matn');
  stem.id = `${id}-stem`;
  yoz(savol.stem, stem);
  qism.appendChild(stem);

  // ---------- MCQ ----------
  const variantlar: { kalit: string; radio: HTMLButtonElement; ochir: HTMLButtonElement; sr: HTMLSpanElement; qator: HTMLDivElement }[] = [];
  let guruh: HTMLDivElement | null = null;
  if (savol.format === 'mcq') {
    guruh = el('div', 'sk-variantlar');
    guruh.setAttribute('role', 'radiogroup');
    guruh.setAttribute('aria-labelledby', `${id}-stem`);
    for (const v of savol.options ?? []) {
      const qator = el('div', 'sk-qator');
      const radio = el('button', 'sk-variant');
      radio.type = 'button';
      radio.setAttribute('role', 'radio');
      radio.dataset.kalit = v.key;
      const harf = el('span', 'sk-harf', v.key);
      harf.setAttribute('aria-hidden', 'true');
      const vMatn = el('span', 'sk-v-matn');
      yoz(v.text, vMatn);
      const sr = el('span', 'sk-sr'); // holat matni: eliminated / correct answer
      // Nomi ichki matndan: "A. <variant matni>, eliminated"
      const harfSr = el('span', 'sk-sr', `${v.key}. `);
      radio.append(harfSr, harf, vMatn, sr, ikonka(IK.togri, 'sk-belgi sk-belgi-togri', 2.5), ikonka(IK.xato, 'sk-belgi sk-belgi-xato', 2.5));

      const ochir = el('button', 'sk-ochir');
      ochir.type = 'button';
      ochir.setAttribute('aria-label', M.ochirVariant(v.key));
      ochir.setAttribute('aria-pressed', 'false');
      const ochirHarf = el('span', 'sk-ochir-harf', v.key);
      ochirHarf.setAttribute('aria-hidden', 'true');
      ochir.appendChild(ochirHarf);

      qator.append(radio, ochir);
      guruh.appendChild(qator);
      variantlar.push({ kalit: v.key, radio, ochir, sr, qator });
    }
    qism.appendChild(guruh);
  }

  // ---------- SPR ----------
  let kiritish: HTMLInputElement | null = null;
  let xatoP: HTMLParagraphElement | null = null;
  let xatoMatn: HTMLSpanElement | null = null;
  let korinish: HTMLDivElement | null = null;
  let korinishQiymat: HTMLSpanElement | null = null;
  let yuborTugma: HTMLButtonElement | null = null;
  if (savol.format === 'spr') {
    const quti = el('div', 'sk-spr');
    const label = el('label', 'sk-spr-yorliq', M.sprYorliq);
    label.htmlFor = `${id}-spr`;
    const qator = el('div', 'sk-spr-qator');
    kiritish = el('input', 'sk-spr-maydon');
    kiritish.id = `${id}-spr`;
    kiritish.type = 'text';
    kiritish.inputMode = 'text';
    kiritish.autocomplete = 'off';
    kiritish.spellcheck = false;
    kiritish.setAttribute('autocapitalize', 'off');
    kiritish.setAttribute('autocorrect', 'off');
    kiritish.setAttribute('aria-describedby', `${id}-spr-yordam ${id}-spr-korinish`);
    kiritish.value = holat.sprQiymat ?? '';
    yuborTugma = el('button', 'sk-katta sk-asosiy', rejim === 'taymersiz' ? M.sprTekshir : M.sprSaqla);
    yuborTugma.type = 'button';
    qator.append(kiritish, yuborTugma);
    const yordam = el('p', 'sk-yordam', M.sprYordam);
    yordam.id = `${id}-spr-yordam`;
    xatoP = el('p', 'sk-spr-xato');
    xatoP.id = `${id}-spr-xato`;
    xatoP.hidden = true;
    xatoMatn = el('span');
    xatoP.append(ikonka(IK.ogoh), xatoMatn);
    korinish = el('div', 'sk-korinish');
    korinish.id = `${id}-spr-korinish`;
    korinishQiymat = el('span', 'sk-korinish-qiymat');
    korinish.append(el('span', 'sk-korinish-yorliq', M.sprKorinish), korinishQiymat);
    korinish.hidden = true;
    quti.append(label, qator, yordam, xatoP, korinish);
    qism.appendChild(quti);
  }

  // ---------- Natija (taymersiz rejim) ----------
  const natija = el('section', 'sk-natija');
  natija.setAttribute('aria-live', 'polite');
  natija.hidden = true;
  const natijaSarlavha = el('p', 'sk-natija-sarlavha');
  const natijaIzoh = el('div', 'sk-natija-izoh sk-matn');
  natija.append(natijaSarlavha, natijaIzoh);
  ildiz.appendChild(natija);

  konteyner.appendChild(ildiz);

  // ---------- Amallar ----------
  const qulf = () => holat.javobBerilgan;

  function tanla(kalit: string, fokus = false) {
    if (qulf()) return;
    if (holat.ochirilgan.includes(kalit)) props.onEliminate?.(kalit, false);
    props.onSelect?.(kalit);
    if (fokus) variantlar.find((v) => v.kalit === kalit)?.radio.focus();
  }

  function ochir(kalit: string) {
    if (qulf()) return;
    const yangi = !holat.ochirilgan.includes(kalit);
    props.onEliminate?.(kalit, yangi);
    if (yangi && holat.tanlangan === kalit) props.onSelect?.(null);
  }

  for (const v of variantlar) {
    v.radio.addEventListener('click', () => tanla(v.kalit));
    v.ochir.addEventListener('click', () => ochir(v.kalit));
  }

  guruh?.addEventListener('keydown', (e) => {
    const joriy = variantlar.findIndex((v) => v.radio === document.activeElement);
    if (joriy < 0) return;
    let keyingi = -1;
    const n = variantlar.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') keyingi = (joriy + 1) % n;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') keyingi = (joriy - 1 + n) % n;
    else if (e.key === 'Home') keyingi = 0;
    else if (e.key === 'End') keyingi = n - 1;
    if (keyingi < 0) return;
    e.preventDefault();
    const v = variantlar[keyingi];
    v.radio.focus();
    if (!qulf()) tanla(v.kalit);
  });

  ildiz.addEventListener('keydown', (e) => {
    if (savol.format !== 'mcq' || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (e.key.length !== 1) return;
    const v = variantlar.find((x) => x.kalit.toUpperCase() === e.key.toUpperCase());
    if (!v || qulf()) return;
    e.preventDefault();
    tanla(v.kalit, true);
  });

  ochirishTugma?.addEventListener('click', () => {
    ochirishRejimi = !ochirishRejimi;
    chiz();
  });

  bayroq.addEventListener('click', () => props.onFlag?.(!holat.belgilangan));

  function sprKorsat(xom: string) {
    if (!korinish || !korinishQiymat) return;
    const t = sprTekshir(xom);
    if (!t.ok) { korinish.hidden = true; return; }
    korinish.hidden = false;
    const [surat, maxraj] = t.qiymat.replace(/^-/, '').split('/');
    const minus = t.qiymat.startsWith('-') ? '-' : '';
    // Faqat raqam, nuqta va minus: TeX sifatida xavfsiz
    const tex = maxraj ? `${minus}\\dfrac{${surat}}{${maxraj}}` : `${minus}${surat}`;
    vadalar.push(xavfsizMatn(`$${tex}$`, korinishQiymat));
  }

  function sprXato(xabar: string | null) {
    if (!kiritish || !xatoP || !xatoMatn) return;
    if (xabar) {
      xatoMatn.textContent = xabar;
      xatoP.hidden = false;
      kiritish.setAttribute('aria-invalid', 'true');
      kiritish.setAttribute('aria-describedby', `${id}-spr-xato ${id}-spr-yordam ${id}-spr-korinish`);
    } else {
      xatoP.hidden = true;
      kiritish.removeAttribute('aria-invalid');
      kiritish.setAttribute('aria-describedby', `${id}-spr-yordam ${id}-spr-korinish`);
    }
  }

  function sprYubor() {
    if (!kiritish || qulf()) return;
    const t = sprTekshir(kiritish.value);
    if (!t.ok) {
      sprXato(t.xabar);
      sprKorsat(kiritish.value);
      kiritish.focus();
      return;
    }
    sprXato(null);
    props.onSubmitSpr?.(t.qiymat);
  }

  kiritish?.addEventListener('input', () => {
    if (kiritish!.getAttribute('aria-invalid')) sprXato(null);
    sprKorsat(kiritish!.value);
  });
  kiritish?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); sprYubor(); }
  });
  yuborTugma?.addEventListener('click', sprYubor);
  if (kiritish?.value) sprKorsat(kiritish.value);

  // ---------- Holatni chizish ----------
  function chiz() {
    const nat = rejim === 'taymersiz' && holat.javobBerilgan ? holat.natija ?? null : null;
    ildiz.classList.toggle('sk-qulf', holat.javobBerilgan);
    ildiz.classList.toggle('sk-ochirish-rejimi', ochirishRejimi && !holat.javobBerilgan);

    bayroq.setAttribute('aria-pressed', String(holat.belgilangan));
    if (ochirishTugma) {
      ochirishTugma.setAttribute('aria-pressed', String(ochirishRejimi));
      ochirishTugma.hidden = holat.javobBerilgan;
    }

    const fokuslanadigan = variantlar.find((v) => v.kalit === holat.tanlangan) ?? variantlar[0];
    for (const v of variantlar) {
      const tanlangan = holat.tanlangan === v.kalit;
      const ochirilgan = holat.ochirilgan.includes(v.kalit);
      const togri = !!nat && nat.togriJavob === v.kalit;
      const xato = !!nat && tanlangan && !togri;
      v.radio.setAttribute('aria-checked', String(tanlangan));
      v.radio.tabIndex = v === fokuslanadigan ? 0 : -1;
      if (holat.javobBerilgan) v.radio.setAttribute('aria-disabled', 'true');
      else v.radio.removeAttribute('aria-disabled');
      v.qator.classList.toggle('sk-tanlangan', tanlangan);
      v.qator.classList.toggle('sk-ochirilgan', ochirilgan);
      v.qator.classList.toggle('sk-togri', togri);
      v.qator.classList.toggle('sk-xato', xato);
      v.ochir.setAttribute('aria-pressed', String(ochirilgan));
      v.ochir.hidden = !ochirishRejimi || holat.javobBerilgan;
      v.sr.textContent = (ochirilgan ? M.ochirilgan : '') + (togri ? M.togriJavobSr : '') + (xato ? M.sizningXato : '');
    }

    if (kiritish && yuborTugma) {
      kiritish.readOnly = holat.javobBerilgan;
      yuborTugma.hidden = holat.javobBerilgan;
      if (holat.sprQiymat !== undefined && document.activeElement !== kiritish && kiritish.value !== holat.sprQiymat) {
        kiritish.value = holat.sprQiymat;
        sprKorsat(kiritish.value);
      }
    }

    // Natija faqat o'zgarganda qayta yoziladi (aria-live qayta o'qimasin)
    const imzo = nat ? JSON.stringify(nat) : '';
    if (imzo === oxirgiNatija) return;
    oxirgiNatija = imzo;
    if (nat) {
      natija.hidden = false;
      natija.classList.toggle('sk-natija-togri', nat.togrimi);
      natijaSarlavha.textContent = nat.togrimi ? M.togri(nat.togriJavob) : M.xato(nat.togriJavob);
      if (nat.izoh) vadalar.push(xavfsizMatn(nat.izoh, natijaIzoh));
      else natijaIzoh.replaceChildren();
    } else {
      natija.hidden = true;
      natijaSarlavha.textContent = '';
      natijaIzoh.replaceChildren();
    }
  }
  let oxirgiNatija = '';

  chiz();

  return {
    yangila(yangi: SavolHolati) {
      holat = { ...yangi, ochirilgan: [...yangi.ochirilgan] };
      chiz();
    },
    yoq() {
      ildiz.remove();
    },
    tayyor: Promise.all(vadalar).then(() => undefined),
  };
}
