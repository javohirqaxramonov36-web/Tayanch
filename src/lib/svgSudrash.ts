// 2D darslar (grafik, birlik aylana, statistika) uchun SVG ichida sudrash.
// touch-action: none faqat sudraladigan tutqichda: sahifa scroll'i sahnaning qolgan qismida ishlayveradi.
// Tutqichning bosiladigan doirasi ekranda kamida 44px (WCAG 2.5.8) bo'lishi uchun SVG o'lchamiga qarab yangilanadi.

export interface Nuqta { x: number; y: number }

/** Mijoz koordinatasini SVG viewBox koordinatasiga aylantiradi */
export function svgNuqta(svg: SVGSVGElement, clientX: number, clientY: number): Nuqta {
  const m = svg.getScreenCTM();
  if (!m) return { x: 0, y: 0 };
  const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
  return { x: p.x, y: p.y };
}

/** el ni sudraladigan qiladi. harakat SVG koordinatasida chaqiriladi. */
export function sudraladigan(svg: SVGSVGElement, el: SVGElement, harakat: (p: Nuqta) => void, tugadi?: () => void): void {
  el.style.touchAction = 'none';
  el.style.cursor = 'grab';
  let id: number | null = null;
  el.addEventListener('pointerdown', (e) => {
    id = e.pointerId;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = 'grabbing';
    e.preventDefault();
    harakat(svgNuqta(svg, e.clientX, e.clientY));
  });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return;
    harakat(svgNuqta(svg, e.clientX, e.clientY));
  });
  const tugat = (e: PointerEvent) => {
    if (e.pointerId !== id) return;
    id = null;
    el.style.cursor = 'grab';
    tugadi?.();
  };
  el.addEventListener('pointerup', tugat);
  el.addEventListener('pointercancel', tugat);
}

/** Ekranda 44px bo'ladigan radiusni (viewBox birligida) qaytaradi va o'lcham o'zgarsa qayta hisoblaydi */
export function bosishRadiusi(svg: SVGSVGElement, viewBoxKenglik: number, yangila: (r: number) => void): void {
  const hisob = () => {
    const w = svg.getBoundingClientRect().width || viewBoxKenglik;
    yangila((22 * viewBoxKenglik) / w);
  };
  if ('ResizeObserver' in window) new ResizeObserver(hisob).observe(svg);
  hisob();
}

/** Ekran o'quvchi uchun yangilanishni kechiktirib e'lon qiladi (har slayder qadamida emas) */
export function kechikibElon(el: HTMLElement, ms = 450): (matn: string) => void {
  let t = 0;
  return (matn: string) => {
    clearTimeout(t);
    t = window.setTimeout(() => { el.textContent = matn; }, ms);
  };
}
