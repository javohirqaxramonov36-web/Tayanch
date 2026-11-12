// Navigator page controller: onboarding dialog + roadmap rendering. Browser only.
// All logic that can be unit-tested lives in the pure modules next to this file.
import { navigatorMatni, type MuddatJavob } from '../../data/navigatorMatn.ts';
import { MAQSADLAR, type Maqsad } from '../../data/navigatorSahifalar.ts';
import { qoidalar, UMUMIY_REJA, type KunlikDaqiqa } from '../../data/yolXaritasiQoidalar.ts';
import { brauzerOmbori } from './ombor.ts';
import { PROFIL_KALITI, profilniOqi, profilniYoz, otkazilganProfil, sanaTogrimi, type YolProfil } from './profil.ts';
import { mahalliySana, muddatHolati, qolganKun } from './qolganKun.ts';
import { yolXaritasiTuz, type RoyxatSahifa } from './yolXaritasi.ts';
import { KEYINGI_QADAM_HODISA, KEYINGI_QADAM_KALITI, oqiKeyingiQadam, tanlaKeyingiQadam } from './keyingiQadam.ts';
import { salomMatni } from './salom.ts';
import { serverga, sinxronla } from './sinxronMijoz.ts';
import { kirganFoydalanuvchi } from '../hisobHolat.ts';
import { yol } from '../yol.ts';

type Rejim = 'birinchi' | 'qayta';
type Qoralama = Pick<YolProfil, 'goals' | 'primaryGoal' | 'timeLeft' | 'examDate' | 'dailyMinutes'>;

const m = navigatorMatni('uz');
const JAMI_QADAM = 3;

/** Max wait for the account sync before showing first-run onboarding to a signed-in user. */
const SINXRON_KUTISH_MS = 2500;

const FOKUSLANADI = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function navigatorniIshgaTushir(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-onboarding]');
  const forma = dialog?.querySelector<HTMLFormElement>('[data-onb-forma]');
  const blok = document.querySelector<HTMLElement>('[data-yol-blok]');
  if (!dialog || !forma || !blok) return;

  const ombor = brauzerOmbori();
  let sahifalar: RoyxatSahifa[] = [];
  try {
    sahifalar = JSON.parse(document.getElementById('navigator-sahifalar')?.textContent ?? '[]');
  } catch { /* build always writes valid JSON; keep an empty registry otherwise */ }

  const $ = <T extends Element = HTMLElement>(s: string, ota: ParentNode = document) => ota.querySelector<T>(s)!;
  const qadamlarEl = [...dialog.querySelectorAll<HTMLElement>('[data-onb-qadam]')];
  const orqagaBtn = $<HTMLButtonElement>('[data-onb-orqaga]', dialog);
  const keyingiBtn = $<HTMLButtonElement>('[data-onb-keyingi]', dialog);
  const otkazBtn = $<HTMLButtonElement>('[data-onb-otkaz]', dialog);
  const yordam = $('[data-onb-yordam]', dialog);
  const sanaQuti = $('[data-onb-sana]', dialog);
  const sanaMaydon = $<HTMLInputElement>('input[name="sana"]', dialog);
  const sanaXato = $('[data-onb-sana-xato]', dialog);
  const qaytaBtn = $<HTMLButtonElement>('[data-yol-qayta]', blok);
  const salomEl = $('[data-yol-salom]', blok);
  const taklif = document.querySelector<HTMLElement>('[data-yol-taklif]');

  let profil = profilniOqi(ombor);
  let rejim: Rejim = 'birinchi';
  let qadam = 0;
  let qaytarilsin: HTMLElement | null = null;
  let yopishSababi: 'saqlandi' | 'otkazildi' | 'bekor' | null = null;
  let sanaTegildi = false;
  /** true once the post-close work (render, focus) ran for the current opening */
  let yakunlandi = true;

  // ---------- form state ----------
  const inputlar = (nom: string) => [...forma.querySelectorAll<HTMLInputElement>(`input[name="${nom}"]`)];
  const tanlangan = (nom: string) => inputlar(nom).find((i) => i.checked)?.value ?? null;

  function qoralama(): Qoralama {
    const goals = MAQSADLAR.filter((g) => inputlar('goal').some((i) => i.checked && i.value === g));
    const asosiy = tanlangan('asosiy') as Maqsad | null;
    const timeLeft = tanlangan('muddat') as MuddatJavob | null;
    const kunlik = tanlangan('kunlik');
    return {
      goals,
      primaryGoal: asosiy && goals.includes(asosiy) ? asosiy : goals[0] ?? null,
      timeLeft,
      examDate: timeLeft === 'date' && sanaMaydon.value ? sanaMaydon.value : null,
      dailyMinutes: kunlik ? (Number(kunlik) as KunlikDaqiqa) : null,
    };
  }

  function formgaYoz(p: YolProfil | null) {
    forma.reset();
    const tanla = (nom: string, qiymat: string | null) =>
      inputlar(nom).forEach((i) => (i.checked = qiymat !== null && i.value === qiymat));
    inputlar('goal').forEach((i) => (i.checked = !!p?.goals.includes(i.value as Maqsad)));
    tanla('asosiy', p?.primaryGoal ?? null);
    tanla('muddat', p?.timeLeft ?? null);
    sanaMaydon.value = p?.examDate ?? '';
    tanla('kunlik', p?.dailyMinutes ? String(p.dailyMinutes) : null);
    sanaTegildi = false;
  }

  /** Error text for the date field, or null when valid. */
  function sanaXatosi(q: Qoralama): string | null {
    if (q.timeLeft !== 'date') return null;
    if (!q.examDate || !sanaTogrimi(q.examDate)) return m.sanaKerak;
    const k = qolganKun(q.examDate, new Date());
    return k === null || k < 0 ? m.sanaOtgan : null;
  }

  function qadamTogrimi(n: number, q = qoralama()): boolean {
    if (n === 0) return q.goals.length > 0;
    if (n === 1) return q.timeLeft !== null && sanaXatosi(q) === null;
    if (n === 2) return q.dailyMinutes !== null;
    return true;
  }

  // ---------- dialog UI ----------
  function yangilaUI() {
    const q = qoralama();
    // primary-goal radios: visible only for selected goals and only when 2+ are selected
    dialog!.querySelectorAll<HTMLElement>('[data-m-karta]').forEach((k) => {
      const g = k.dataset.mKarta as Maqsad;
      const r = $<HTMLElement>('[data-m-asosiy]', k);
      r.hidden = !(q.goals.includes(g) && q.goals.length > 1);
    });
    inputlar('asosiy').forEach((i) => (i.checked = i.value === q.primaryGoal));

    const sanami = q.timeLeft === 'date';
    sanaQuti.hidden = !sanami;
    sanaMaydon.min = mahalliySana(new Date());
    const xato = sanami && sanaTegildi ? sanaXatosi(q) : null;
    sanaXato.hidden = !xato;
    $('[data-onb-sana-matn]', dialog!).textContent = xato ?? '';
    if (xato) sanaMaydon.setAttribute('aria-invalid', 'true');
    else sanaMaydon.removeAttribute('aria-invalid');

    const togri = qadamTogrimi(qadam, q);
    keyingiBtn.disabled = !togri;
    yordam.hidden = !(qadam === 0 && !togri);

    orqagaBtn.hidden = qadam === 0;
    const oxirgi = rejim === 'birinchi' ? 2 : 3;
    keyingiBtn.textContent = qadam < 2 ? m.keyingi : qadam === oxirgi ? (rejim === 'qayta' ? m.tasdiqHa : m.saqlash) : m.keyingi;
    otkazBtn.textContent = rejim === 'qayta' ? m.bekor : m.otkazish;

    const korsatilgan = Math.min(qadam, 2) + 1;
    $('[data-onb-hisob]', dialog!).textContent = m.qadamHisob(korsatilgan, JAMI_QADAM);
    $<HTMLElement>('[data-onb-progress]', dialog!).style.width = `${(korsatilgan / JAMI_QADAM) * 100}%`;
  }

  function korsat(n: number) {
    qadam = n;
    qadamlarEl.forEach((el) => (el.hidden = Number(el.dataset.onbQadam) !== n));
    yangilaUI();
    qadamlarEl[n]?.querySelector<HTMLElement>('.onb-savol')?.focus();
  }

  function och(r: Rejim) {
    rejim = r;
    yopishSababi = null;
    yakunlandi = false;
    qaytarilsin = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
      ? document.activeElement
      : null;
    formgaYoz(r === 'qayta' ? profil : null);
    dialog!.showModal();
    korsat(0);
  }

  // Post-close work runs directly from yop() instead of relying only on the async `close` event
  // (some embedded browsers deliver it late or not at all after a scripted close()).
  function yop(sabab: NonNullable<typeof yopishSababi>) {
    yopishSababi = sabab;
    if (dialog!.open) dialog!.close();
    yakunla();
  }

  function yakunla() {
    if (yakunlandi) return;
    yakunlandi = true;
    // Browser may force-close (e.g. repeated ESC): treat it as skip/cancel so state stays consistent.
    if (yopishSababi === null) {
      if (rejim === 'birinchi' && !profil) {
        profil = otkazilganProfil(new Date());
        profilniYoz(ombor, profil);
        yuborish();
      }
      yopishSababi = rejim === 'birinchi' ? 'otkazildi' : 'bekor';
    }
    chiz();
    // Return focus: rebuild button (or whatever opened it); after first run, the roadmap heading.
    const nishon = yopishSababi === 'bekor' ? qaytarilsin ?? qaytaBtn : salomEl;
    nishon.focus();
  }

  function saqla() {
    const q = qoralama();
    profil = { v: 1, ...q, skipped: false, updatedAt: new Date().toISOString() };
    profilniYoz(ombor, profil);
    yuborish();
    yop('saqlandi');
  }

  /** Push the saved profile to the account (signed-in users only); adopt the server copy if newer. */
  function yuborish() {
    if (!profil) return;
    void serverga(profil, ombor).then((yangi) => {
      if (yangi) { profil = yangi; if (!dialog!.open) chiz(); }
    });
  }

  function otkaz() {
    if (rejim === 'qayta') return yop('bekor');
    profil = otkazilganProfil(new Date());
    profilniYoz(ombor, profil);
    yuborish();
    yop('otkazildi');
  }

  // ---------- dialog events ----------
  forma.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'sana') sanaTegildi = true;
    if (t.name === 'muddat' && t.value === 'date') {
      sanaTegildi = false;
      yangilaUI();
      sanaMaydon.focus();
      return;
    }
    yangilaUI();
  });
  forma.addEventListener('input', (e) => {
    if ((e.target as HTMLInputElement).name === 'sana') yangilaUI();
  });
  sanaMaydon.addEventListener('blur', () => {
    if (sanaMaydon.value) { sanaTegildi = true; yangilaUI(); }
  });

  forma.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!qadamTogrimi(qadam)) {
      if (qadam === 1) { sanaTegildi = true; yangilaUI(); }
      return;
    }
    const oxirgi = rejim === 'birinchi' ? 2 : 3;
    if (qadam < oxirgi) korsat(qadam + 1);
    else saqla();
  });
  orqagaBtn.addEventListener('click', () => korsat(Math.max(0, qadam - 1)));
  otkazBtn.addEventListener('click', otkaz);

  // ESC = skip (first run) / cancel (rebuild). preventDefault keeps our own close path.
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    otkaz();
  });
  dialog.addEventListener('close', yakunla);

  // Focus trap: keep Tab / Shift+Tab inside the dialog.
  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const el = [...dialog.querySelectorAll<HTMLElement>(FOKUSLANADI)].filter(
      (x) => x.offsetParent !== null || x === document.activeElement,
    ).filter((x) => !(x instanceof HTMLInputElement && x.type === 'radio' && !x.checked && inputlar(x.name).some((i) => i.checked)));
    if (el.length === 0) return;
    const birinchi = el[0];
    const oxirgi = el[el.length - 1];
    const faol = document.activeElement;
    if (e.shiftKey && (faol === birinchi || !dialog.contains(faol))) {
      e.preventDefault();
      oxirgi.focus();
    } else if (!e.shiftKey && faol === oxirgi) {
      e.preventDefault();
      birinchi.focus();
    }
  });

  qaytaBtn.addEventListener('click', () => och('qayta'));
  // Birinchi tashrif kartasi: "Boshlash" oynani ochadi, "Hozir emas" oynadagi "O'tkazib yuborish" bilan bir xil.
  taklif?.querySelector('[data-yol-taklif-boshla]')?.addEventListener('click', () => och('birinchi'));
  taklif?.querySelector('[data-yol-taklif-keyin]')?.addEventListener('click', () => {
    if (profil) return;
    profil = otkazilganProfil(new Date());
    profilniYoz(ombor, profil);
    yuborish();
    chiz();
    salomEl.focus();
  });

  // ---------- roadmap rendering ----------
  function el<K extends keyof HTMLElementTagNameMap>(teg: K, klass?: string, matn?: string) {
    const x = document.createElement(teg);
    if (klass) x.className = klass;
    if (matn !== undefined) x.textContent = matn;
    return x;
  }

  function chiz() {
    document.documentElement.setAttribute('data-yol', profil ? 'bor' : 'yoq');
    if (taklif && profil) taklif.hidden = true;
    if (!profil) return;
    const hozir = new Date();
    const holat = muddatHolati(profil, hozir);
    const qadamlar = yolXaritasiTuz(profil, holat.surat, { qoidalar, sahifalar, umumiyReja: UMUMIY_REJA });

    salomEl.textContent = salomMatni(m, hozir, kirganFoydalanuvchi()?.ism);

    const bugun = $('[data-yol-bugun]', blok!);
    const daqiqa = !profil.skipped ? profil.dailyMinutes : null;
    bugun.hidden = !daqiqa;
    bugun.textContent = daqiqa ? m.bugunDaqiqa(daqiqa) : '';

    const muddat = $('[data-yol-muddat]', blok!);
    const kun = holat.qolgan !== null && !holat.otgan ? holat.qolgan : null;
    muddat.hidden = kun === null;
    muddat.textContent = kun !== null ? m.qolganKun(kun) : '';

    // Next step card: override (other modules) > first ready roadmap step.
    const keyingi = tanlaKeyingiQadam(qadamlar, oqiKeyingiQadam(ombor, hozir));
    const karta = $('[data-yol-keyingi]', blok!);
    karta.hidden = !keyingi;
    if (keyingi) {
      const nom = keyingi.turi === 'override' ? keyingi.sarlavha : keyingi.qadam.nomi;
      const izoh = keyingi.turi === 'override' ? keyingi.izoh : keyingi.qadam.izoh;
      const manzil = keyingi.turi === 'override' ? keyingi.manzil : keyingi.qadam.manzil!;
      $('[data-yol-k-nom]', karta).textContent = nom;
      $('[data-yol-k-izoh]', karta).textContent = izoh;
      $<HTMLAnchorElement>('[data-yol-k-havola]', karta).href = yol(manzil);
    }

    const asosiy = $('[data-yol-asosiy]', blok!);
    const asosiyNom = !profil.skipped && profil.primaryGoal ? m.maqsadlar[profil.primaryGoal].nomi : null;
    asosiy.hidden = !asosiyNom || profil.goals.length < 2;
    asosiy.textContent = asosiyNom ? m.asosiyMaqsad(asosiyNom) : '';

    const ol = $('[data-yol-qadamlar]', blok!);
    ol.replaceChildren(
      ...qadamlar.map((q, i) => {
        const li = el('li', q.tayyor ? '' : 'tez');
        const raqam = el('span', 'q-raqam', String(i + 1));
        raqam.setAttribute('aria-hidden', 'true');
        const matn = el('div', 'q-matn');
        const qator = el('div', 'q-qator');
        if (q.tayyor && q.manzil) {
          const a = el('a', 'q-nom', q.nomi);
          a.href = yol(q.manzil);
          qator.append(a);
        } else {
          qator.append(el('span', 'q-nom', q.nomi), el('span', 'yorliq', m.tezOrada));
        }
        const maqsad = q.maqsad === 'umumiy' ? null : m.maqsadlar[q.maqsad].nomi;
        if (maqsad && (profil!.skipped || profil!.goals.length > 1)) qator.append(el('span', 'yorliq', maqsad));
        matn.append(qator, el('span', 'q-izoh', q.izoh));
        li.append(raqam, matn);
        return li;
      }),
    );

    const ogoh = $('[data-yol-ogoh]', blok!);
    ogoh.hidden = !holat.otgan;
    ogoh.textContent = holat.otgan ? m.sanaOtibKetdi : '';

    const izohlar = [profil.skipped ? m.umumiyIzoh : '', m.qoidaIzoh].filter(Boolean);
    $('[data-yol-izoh]', blok!).textContent = izohlar.join(' ');
    $('[data-yol-saqlanmadi]', blok!).hidden = ombor.doimiy;
  }

  // ---------- start ----------
  chiz();
  void (async () => {
    // Signed-in user: pull/push the account copy first. Without a local profile we wait (bounded) so a
    // returning user on a new device does not see onboarding flash before their roadmap arrives.
    if (kirganFoydalanuvchi()) {
      const sinxron = sinxronla(ombor).then((yangi) => {
        if (yangi) { profil = yangi; if (!dialog.open) chiz(); }
      });
      if (!profil) await Promise.race([sinxron, new Promise((r) => setTimeout(r, SINXRON_KUTISH_MS))]);
    }
    if (!profil && !dialog.open && taklif) taklif.hidden = false;
  })();

  // Re-render when another tab/module changes the profile or the override, and when the tab
  // becomes visible again (greeting and days-left depend on the current time).
  window.addEventListener('storage', (e) => {
    if (e.key === PROFIL_KALITI) profil = profilniOqi(ombor);
    if (e.key === PROFIL_KALITI || e.key === KEYINGI_QADAM_KALITI || e.key === null) chiz();
  });
  window.addEventListener(KEYINGI_QADAM_HODISA, chiz);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !dialog.open) chiz();
  });
}
