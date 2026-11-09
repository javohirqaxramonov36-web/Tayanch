export function el<K extends keyof HTMLElementTagNameMap>(tag: K, matn = '', klass = '') {
  const tugun = document.createElement(tag);
  tugun.textContent = matn;
  if (klass) tugun.className = klass;
  return tugun;
}
export const top = <T extends Element = HTMLElement>(root: ParentNode, selector: string) => root.querySelector<T>(selector)!;
export function havola(matn: string, href: string, klass = 'ielts-havola') {
  const a = el('a', matn, klass);
  a.href = href;
  return a;
}
export function tugma(matn: string, klass = 'tugma tugma-ikkinchi') {
  const b = el('button', matn, klass);
  b.type = 'button';
  return b;
}
export function soniyaMatni(soniya: number) {
  const butun = Math.max(0, Math.ceil(soniya));
  return [Math.floor(butun / 60), butun % 60].map((n) => String(n).padStart(2, '0')).join(':');
}
export function progress(qiymat: number, jami: number, nom: string) {
  const p = el('progress', '', 'ielts-olga');
  p.max = jami;
  p.value = qiymat;
  p.setAttribute('aria-label', nom);
  return p;
}
