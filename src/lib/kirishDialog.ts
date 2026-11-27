import { hisobSozlangan, googleBilanKirish, xavfsizKeyin } from './hisob';
import { yol } from './yol';

export function kirishDialogniUla() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-kirish-dialog]');
  if (!dialog) return;
  const xato = dialog.querySelector<HTMLElement>('[data-kirish-xato]')!;
  const google = dialog.querySelector<HTMLButtonElement>('[data-kirish-google]')!;
  let keyin = location.pathname + location.search + location.hash;
  let ochuvchi: HTMLElement | null = null;
  let band = false;
  function xabar() { xato.hidden = false; xato.textContent = dialog!.dataset.xatoMatn ?? "Kirishda xatolik. Qaytadan urinib ko'ring."; }
  function bandQoy(qiymat: boolean) {
    band = qiymat;
    google.disabled = qiymat || !hisobSozlangan();
    dialog!.setAttribute('aria-busy', String(qiymat));
  }
  function yop() {
    dialog!.close();
    bandQoy(false);
    ochuvchi?.focus({ preventScroll: true });
  }
  function och(yangiKeyin: string, fokus?: HTMLElement | null) {
    keyin = xavfsizKeyin(yangiKeyin, location.pathname + location.search + location.hash);
    ochuvchi = fokus ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    xato.hidden = true;
    document.querySelectorAll<HTMLDetailsElement>('header details[open]').forEach((d) => { d.open = false; });
    const parol = dialog!.querySelector<HTMLAnchorElement>('[data-parol-kirish]')!;
    parol.href = `${yol('/uz/hisob/kirish/')}?keyin=${encodeURIComponent(keyin)}`;
    if (!dialog!.open) dialog!.showModal();
    bandQoy(false);
  }
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !(e.target instanceof Element)) return;
    const a = e.target.closest<HTMLAnchorElement>('a[href]');
    if (!a || a.hasAttribute('data-parol-kirish') || a.target === '_blank') return;
    const manzil = new URL(a.href, location.href);
    if (manzil.origin !== location.origin || manzil.pathname !== yol('/uz/hisob/kirish/')) return;
    e.preventDefault();
    const talab = manzil.searchParams.get('keyin');
    const qaytish = !talab || talab === location.pathname ? location.pathname + location.search + location.hash : talab;
    och(qaytish, a);
  });
  document.addEventListener('tayanch:kirish-och', (e) => {
    const detail = (e as CustomEvent<{ keyin?: string; ochuvchi?: HTMLElement }>).detail;
    och(detail?.keyin ?? location.pathname + location.search + location.hash, detail?.ochuvchi);
  });
  dialog.querySelector('[data-kirish-yop]')!.addEventListener('click', yop);
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); yop(); });
  dialog.addEventListener('click', (e) => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); const p = e as MouseEvent; if (p.clientX < r.left || p.clientX > r.right || p.clientY < r.top || p.clientY > r.bottom) yop(); } });
  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const tugmalar = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')].filter((x) => x.getClientRects().length);
    const birinchi = tugmalar[0], oxirgi = tugmalar.at(-1);
    if (e.shiftKey && document.activeElement === birinchi) { e.preventDefault(); oxirgi?.focus(); }
    else if (!e.shiftKey && document.activeElement === oxirgi) { e.preventDefault(); birinchi?.focus(); }
  });
  google.addEventListener('click', async () => {
    if (band) return;
    bandQoy(true);
    try { const error = await googleBilanKirish(keyin); if (error) throw error; }
    catch { xabar(); bandQoy(false); }
  });
  window.addEventListener('pageshow', () => bandQoy(false));
}
