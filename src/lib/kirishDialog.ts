import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from 'astro:env/client';
import { hisobMijoz, hisobSozlangan, googleBilanKirish, xavfsizKeyin, rozilikHolati, rozilikYoli } from './hisob';
import { hisobHavolalari } from './hisobHolat';
import { telegramLogin } from '../data/telegramLogin';
import { yol } from './yol';

declare global {
  interface Window {
    Telegram?: { Login: { auth: (options: { bot_id: number; lang: string }, callback: (user: Record<string, unknown> | false) => void) => void } };
  }
}

let widgetVadasi: Promise<void> | undefined;
function widgetaYukla(): Promise<void> {
  widgetVadasi ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); widgetVadasi = undefined; reject(new Error('Widget')); };
    document.head.append(script);
  });
  return widgetVadasi;
}

export function kirishDialogniUla() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-kirish-dialog]');
  if (!dialog) return;
  const xato = dialog.querySelector<HTMLElement>('[data-kirish-xato]')!;
  const google = dialog.querySelector<HTMLButtonElement>('[data-kirish-google]')!;
  const telegram = dialog.querySelector<HTMLButtonElement>('[data-kirish-telegram]')!;
  let keyin = location.pathname + location.search + location.hash;
  let ochuvchi: HTMLElement | null = null;
  let band = false;
  let urinish = 0;
  const botTayyor = Boolean(telegramLogin.username && telegramLogin.botId);
  function xabar() { xato.hidden = false; xato.textContent = "Kirishda xatolik. Qaytadan urinib ko'ring."; }
  function bandQoy(qiymat: boolean) {
    band = qiymat;
    google.disabled = qiymat || !hisobSozlangan();
    telegram.disabled = qiymat || !botTayyor || !hisobSozlangan() || !window.Telegram?.Login;
    dialog!.setAttribute('aria-busy', String(qiymat));
  }
  function yop() {
    urinish++;
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
    if (botTayyor && hisobSozlangan()) void widgetaYukla().then(() => bandQoy(band)).catch(xabar);
  }
  async function yakunla() {
    const c = hisobMijoz();
    const sessiya = c && (await c.auth.getSession()).data.session;
    if (!c || !sessiya) throw new Error('Session');
    hisobHavolalari();
    if ((await rozilikHolati(c, sessiya)) === 'yoq') { location.assign(rozilikYoli(keyin)); return; }
    const manzil = new URL(keyin, location.origin);
    yop();
    if (manzil.pathname !== location.pathname || manzil.search !== location.search) { location.assign(keyin); return; }
    document.dispatchEvent(new Event('tayanch:hisob-kirdi'));
  }
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || !(e.target instanceof Element)) return;
    const a = e.target.closest<HTMLAnchorElement>('a[href]');
    if (!a || a.hasAttribute('data-parol-kirish') || a.target === '_blank') return;
    const manzil = new URL(a.href, location.href);
    if (manzil.origin !== location.origin || manzil.pathname !== yol('/uz/hisob/kirish/')) return;
    e.preventDefault();
    och(manzil.searchParams.get('keyin') ?? location.pathname + location.search + location.hash, a);
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
  telegram.addEventListener('click', () => {
    if (band || !telegramLogin.botId || !window.Telegram?.Login) return;
    const joriyUrinish = ++urinish;
    bandQoy(true);
    // Official widget JS callback API. No redirect and no message permission requested.
    window.Telegram.Login.auth({ bot_id: telegramLogin.botId, lang: 'uz' }, (user) => {
      if (joriyUrinish !== urinish || !dialog.open) return;
      if (!user) { bandQoy(false); return; }
      void (async () => {
        try {
          const c = hisobMijoz();
          if (!c || !PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) throw new Error('Config');
          const res = await fetch(`${PUBLIC_SUPABASE_URL}/functions/v1/telegram-auth`, {
            method: 'POST', headers: { apikey: PUBLIC_SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify(user), signal: AbortSignal.timeout(20000),
          });
          const body = await res.json();
          if (!res.ok || typeof body.hashed_token !== 'string') throw new Error('Auth');
          if (joriyUrinish !== urinish || !dialog.open) return;
          const { error } = await c.auth.verifyOtp({ token_hash: body.hashed_token, type: 'magiclink' });
          if (error) throw error;
          await yakunla();
        } catch { if (dialog.open && joriyUrinish === urinish) xabar(); }
        finally { if (joriyUrinish === urinish) bandQoy(false); }
      })();
    });
  });
  window.addEventListener('pageshow', () => bandQoy(false));
}
