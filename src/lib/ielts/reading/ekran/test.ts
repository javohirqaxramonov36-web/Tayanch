// Test screen controller: starts or restores an attempt, renders passages and questions,
// keeps the timer, the number panel, the single-tab lock and submits the attempt.
// State lives in memory; the repository (ombor.ts) is persistence only, so the test keeps
// working when localStorage is full or disabled.
import { RM } from '../../../../data/ielts/readingMatn.ts';
import { ornatKeyingiQadam } from '../../../navigator/keyingiQadam.ts';
import { brauzerOmbori } from '../../../navigator/ombor.ts';
import { yol } from '../../../yol.ts';
import { urinishOmbori } from '../ombor.ts';
import { QULF_KALIT, QULF_YURAK_MS, qulfBoshat, qulfEgasi, qulfOl } from '../qulf.ts';
import { savolKaliti, savolRaqamlari, type Guruh, type ReadingTest, type Savol } from '../sxema.ts';
import { tanlaTest } from '../tanlash.ts';
import { elonDaqiqa, qolganMs, vaqtMatn } from '../taymer.ts';
import { savolTuri } from '../turlar/registr.ts';
import { qoch } from '../turlar/tur.ts';
import { avtoYakunKerak, TAVSIYA_MUDDAT_KUN, tavsiyaTanla, yakunla, yangiId, yangiUrinish, type FaolUrinish } from '../urinish.ts';
import { chizNatija } from './natija.ts';
import { READING_YOL, yuklaTest } from './yollar.ts';

interface Joy {
  savol: Savol;
  guruh: Guruh;
  /** index of the passage the question belongs to */
  passage: number;
}

const BAYROQ =
  '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h12l-2 4 2 4H5"/></svg>';
const KAM_VAQT_MS = 5 * 60_000;
const YOZISH_KECHIKISH_MS = 400;

export function ishgaTushirTest(): void {
  const ildiz = document.getElementById('rt');
  if (!ildiz) return;
  const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

  const holatEl = el('rt-holat');
  const xotiraOgoh = el('rt-ogoh-xotira');
  const tabOgoh = el('rt-ogoh-tab');
  const tabOgohMatn = el('rt-ogoh-tab-matn');
  const shuTabTugma = el<HTMLButtonElement>('rt-shu-tab');
  const natijaHavola = el<HTMLAnchorElement>('rt-natija-havola');
  const ish = el('rt-ish');
  const natijaOram = el('rt-natija');
  const elon = el('rt-elon');
  const vaqtOram = el('rt-vaqt-oram');
  const vaqtEl = el('rt-vaqt');
  const yakunTugma = el<HTMLButtonElement>('rt-yakunla');
  const passageTugmalar = el('rt-passagelar');
  const tablar = el('rt-tablar');
  const tabMatn = el<HTMLButtonElement>('rt-tab-matn');
  const tabSavol = el<HTMLButtonElement>('rt-tab-savollar');
  const matnPanel = el('rt-matn');
  const savolPanel = el('rt-savollar');
  const navTugma = el<HTMLButtonElement>('rt-nav-tugma');
  const navSon = el('rt-nav-son');
  const navIchi = el('rt-nav-ichi');
  const yakunDialog = el<HTMLDialogElement>('rt-yakun');

  const ombor = brauzerOmbori();
  const repo = urinishOmbori(ombor);
  // One id per page load: a reloaded or duplicated tab is a different tab.
  const tabId = yangiId();
  const telefon = window.matchMedia('(max-width: 1023px)');
  const kamHarakat = window.matchMedia('(prefers-reduced-motion: reduce)');

  let test: ReadingTest;
  let faol: FaolUrinish;
  const joylar = new Map<string, Joy>();
  const raqamKalit = new Map<number, string>();
  let passage = 0;
  let tab: 'matn' | 'savollar' = 'matn';
  /** another tab owns the attempt: this one is read-only */
  let passiv = false;
  let tugadi = false;
  /** false when the attempt never reached localStorage: cross-tab checks would be meaningless */
  let saqlanadi = true;
  let oldingiMs: number | null = null;
  let soat: number | undefined;
  let oxirgiYurak = 0;
  let kutilgan: { kalit: string; maydon: HTMLInputElement; taymer: number } | null = null;

  // ---------- Messages ----------

  function holatXabar(matn: string, turi: 'yoq' | 'boshlash' | 'qayta' = 'yoq'): void {
    const amal =
      turi === 'boshlash'
        ? `<a class="tugma tugma-asosiy" href="${qoch(yol(READING_YOL.boshlash))}">${RM.boshlashSahifasi}</a>`
        : turi === 'qayta'
          ? `<button type="button" class="tugma tugma-asosiy" data-qayta>${RM.qaytaUrin}</button>`
          : '';
    holatEl.innerHTML = `<p>${qoch(matn)}</p>${amal}`;
    holatEl.hidden = false;
    ish.hidden = true;
    holatEl.querySelector('[data-qayta]')?.addEventListener('click', () => location.reload());
  }

  /** Screen-reader announcement. Cleared first so the same text can be announced twice. */
  function elonQil(matn: string): void {
    elon.textContent = '';
    window.setTimeout(() => {
      elon.textContent = matn;
    }, 50);
  }

  function xotiraOgohlantir(): void {
    if (!xotiraOgoh.hidden) return;
    xotiraOgoh.innerHTML = `<p>${qoch(RM.xotiraYoq)}</p>`;
    xotiraOgoh.hidden = false;
  }

  function tabXabar(matn: string | null, amal: 'ol' | 'natija' | 'yoq' = 'yoq'): void {
    tabOgoh.hidden = matn === null;
    tabOgohMatn.textContent = matn ?? '';
    shuTabTugma.hidden = amal !== 'ol';
    natijaHavola.hidden = amal !== 'natija';
  }

  // ---------- Persistence and the single-tab lock ----------

  function saqla(): void {
    if (!repo.saqlaFaol(faol)) xotiraOgohlantir();
  }

  function qulf(): 'bosh' | 'meniki' | 'boshqa' {
    return qulfEgasi(ombor.oqi(QULF_KALIT), tabId, Date.now());
  }

  function passivQil(): void {
    if (passiv || tugadi) return;
    passiv = true;
    if (yakunDialog.open) yakunDialog.close();
    ish.toggleAttribute('inert', true);
    yakunTugma.disabled = true;
    tabXabar(`${RM.boshqaTab} ${RM.faqatOqish}`, 'ol');
  }

  /** The attempt was submitted in another tab: nothing more can be done here. */
  function boshqaTabdaYakun(): void {
    if (tugadi) return;
    tugadi = true;
    window.clearInterval(soat);
    if (yakunDialog.open) yakunDialog.close();
    ish.toggleAttribute('inert', true);
    yakunTugma.hidden = true;
    const bor = repo.topUrinish(faol.id) !== null;
    natijaHavola.href = bor ? `${yol(READING_YOL.natija)}?urinish=${encodeURIComponent(faol.id)}` : yol(READING_YOL.boshlash);
    natijaHavola.textContent = bor ? RM.natijagaOt : RM.boshlashSahifasi;
    tabXabar(RM.boshqaTabdaYakun, 'natija');
  }

  /** Heartbeat and cross-tab check: runs every two seconds and on storage / visibility events. */
  function tekshirHolat(): void {
    if (tugadi || !saqlanadi) return;
    const saqlangan = repo.faol();
    if (!saqlangan || saqlangan.id !== faol.id) {
      boshqaTabdaYakun();
      return;
    }
    if (passiv) return;
    if (qulf() === 'boshqa') passivQil();
    else qulfOl(ombor, tabId, Date.now());
  }

  /** True when this tab may change the attempt. */
  function yozishMumkin(): boolean {
    if (tugadi || passiv) return false;
    if (saqlanadi && qulf() === 'boshqa') {
      passivQil();
      return false;
    }
    return true;
  }

  /** "Continue in this tab": reload the attempt from storage and take the lock. */
  function shuTabdaDavom(): void {
    const saqlangan = repo.faol();
    if (!saqlangan || saqlangan.id !== faol.id) {
      boshqaTabdaYakun();
      return;
    }
    faol = saqlangan;
    qulfOl(ombor, tabId, Date.now());
    passiv = false;
    ish.removeAttribute('inert');
    yakunTugma.disabled = false;
    tabXabar(null);
    chizPassage();
    matnPanel.focus();
  }

  // ---------- Rendering ----------

  function savolHtml(s: Savol, g: Guruh): string {
    const kalit = savolKaliti(s);
    const yorliq = savolRaqamlari(s).join('–');
    const matnId = `s-${kalit}-matn`;
    const belgili = faol.flags.includes(kalit);
    return `<div class="savol" id="savol-${qoch(kalit)}">
<div class="savol-bosh"><span class="savol-raqam" aria-hidden="true">${qoch(yorliq)}</span>
<p class="savol-matn" id="${qoch(matnId)}" lang="en"><span class="ekranda-yoq" lang="uz">${qoch(RM.savolNomi(yorliq))} </span>${qoch(s.prompt)}</p>
<button type="button" class="belgi-tugma" data-belgi="${qoch(kalit)}" aria-pressed="${belgili}" aria-label="${qoch(RM.belgila(yorliq))}">${BAYROQ}</button></div>
${savolTuri(g.type).render({ savol: s, guruh: g, javob: faol.answers[kalit], matnId })}
</div>`;
  }

  function chizPassage(): void {
    const p = test.passages[passage];
    matnPanel.innerHTML = `<div class="rt-matn-ichi"><p class="rt-daraja">${qoch(RM.passage(passage + 1))} · ${qoch(p.difficulty)}</p><h2 lang="en">${qoch(p.title)}</h2>${p.paragraphs
      .map((g) => `<p class="rt-par" lang="en"><b class="rt-par-harf">${qoch(g.label)}</b><span>${qoch(g.text)}</span></p>`)
      .join('')}</div>`;
    matnPanel.scrollTop = 0;

    const guruhlar = p.groups
      .map((g) => {
        const raqamlar = g.questions.flatMap(savolRaqamlari);
        const oraliq = raqamlar.length > 1 ? `${raqamlar[0]}–${raqamlar[raqamlar.length - 1]}` : String(raqamlar[0]);
        const sarlavhalar =
          g.type === 'matching-headings' && g.headings
            ? `<ul class="rt-sarlavhalar" lang="en" aria-label="${qoch(RM.sarlavhalarRoyxati)}">${g.headings
                .map((h) => `<li><b>${qoch(h.id)}</b><span>${qoch(h.text)}</span></li>`)
                .join('')}</ul>`
            : '';
        return `<section class="rt-guruh"><h3>${qoch(RM.guruhNomi(oraliq, raqamlar.length > 1))}</h3><p class="rt-korsatma" lang="en">${qoch(g.instructions)}</p>${sarlavhalar}${g.questions
          .map((s) => savolHtml(s, g))
          .join('')}</section>`;
      })
      .join('');
    const oldingi = passage > 0 ? `<button type="button" class="tugma tugma-ikkinchi" data-passage-ot="${passage - 1}">${RM.oldingi}</button>` : '<span></span>';
    const keyingi =
      passage < test.passages.length - 1 ? `<button type="button" class="tugma tugma-ikkinchi" data-passage-ot="${passage + 1}">${RM.keyingi}</button>` : '';
    savolPanel.innerHTML = `<div class="rt-savol-ichi">${guruhlar}${test.passages.length > 1 ? `<div class="rt-otish">${oldingi}${keyingi}</div>` : ''}</div>`;
    savolPanel.scrollTop = 0;
    yangilaNav();
  }

  function quriNav(): void {
    passageTugmalar.innerHTML = test.passages
      .map((_p, i) => `<button type="button" data-passage="${i}" aria-pressed="false">${qoch(RM.passage(i + 1))}</button>`)
      .join('');
    passageTugmalar.hidden = test.passages.length < 2;
    const guruhlar = test.passages
      .map((p, i) => {
        const raqamlar = p.groups.flatMap((g) => g.questions.flatMap(savolRaqamlari));
        return `<div class="rt-nav-guruh" data-nav-passage="${i}"><span id="rt-nav-p${i}">${qoch(RM.passage(i + 1))}</span><ol aria-labelledby="rt-nav-p${i}">${raqamlar
          .map((n) => `<li><button type="button" class="rt-raqam" data-raqam="${n}">${n}</button></li>`)
          .join('')}</ol></div>`;
      })
      .join('');
    navIchi.innerHTML = `${guruhlar}<ul class="rt-afsona" aria-hidden="true"><li><i class="berilgan"></i>${RM.afsona.berilgan}</li><li><i></i>${RM.afsona.joriy}</li><li><i class="belgi"></i>${RM.afsona.belgi}</li></ul>`;
  }

  /** Updates the number panel in place (buttons keep focus). */
  function yangilaNav(): void {
    let berilganSoni = 0;
    let jami = 0;
    for (const [kalit, joy] of joylar) {
      const berilgan = savolTuri(joy.guruh.type).berilgan(joy.savol, faol.answers[kalit]);
      const belgili = faol.flags.includes(kalit);
      savolRaqamlari(joy.savol).forEach((n, i) => {
        const tugma = navIchi.querySelector<HTMLElement>(`[data-raqam="${n}"]`);
        const bor = berilgan[i] === true;
        jami += 1;
        if (bor) berilganSoni += 1;
        if (!tugma) return;
        tugma.classList.toggle('berilgan', bor);
        tugma.classList.toggle('belgi', belgili);
        tugma.setAttribute('aria-label', RM.raqamHolat(n, bor, belgili));
      });
    }
    navSon.textContent = RM.panelTugma(berilganSoni, jami);
    passageTugmalar.querySelectorAll<HTMLElement>('[data-passage]').forEach((t) => t.setAttribute('aria-pressed', String(Number(t.dataset.passage) === passage)));
    navIchi.querySelectorAll<HTMLElement>('[data-nav-passage]').forEach((g) => g.classList.toggle('joriy', Number(g.dataset.navPassage) === passage));
  }

  /** Phone: one panel at a time behind "Matn / Savollar" tabs. Desktop: both panels, no tabs. */
  function yangilaKorinish(): void {
    const tel = telefon.matches;
    const juftlar: [HTMLButtonElement, HTMLElement, 'matn' | 'savollar', string][] = [
      [tabMatn, matnPanel, 'matn', RM.tabMatn],
      [tabSavol, savolPanel, 'savollar', RM.tabSavollar],
    ];
    for (const [tugma, panel, nom, yorliq] of juftlar) {
      const tanlangan = tab === nom;
      tugma.setAttribute('aria-selected', String(tanlangan));
      tugma.tabIndex = tanlangan ? 0 : -1;
      panel.hidden = tel && !tanlangan;
      if (tel) {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tugma.id);
        panel.removeAttribute('aria-label');
      } else {
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', yorliq);
        panel.removeAttribute('aria-labelledby');
      }
    }
  }

  function navOch(ochiq: boolean): void {
    navTugma.setAttribute('aria-expanded', String(ochiq));
    navIchi.hidden = !ochiq;
  }

  // ---------- Answers and flags ----------

  function yozKutilgan(): void {
    if (!kutilgan) return;
    const { kalit, maydon, taymer } = kutilgan;
    window.clearTimeout(taymer);
    kutilgan = null;
    javobQoy(kalit, maydon.value);
  }

  function javobQoy(kalit: string, xom: unknown): void {
    const joy = joylar.get(kalit);
    if (!joy || !yozishMumkin()) return;
    const javob = savolTuri(joy.guruh.type).normalize(xom, joy.savol, joy.guruh);
    if (javob === undefined) delete faol.answers[kalit];
    else faol.answers[kalit] = javob;
    saqla();
    yangilaNav();
  }

  function belgiAlmashtir(kalit: string, tugma: HTMLElement): void {
    if (!joylar.has(kalit) || !yozishMumkin()) return;
    const bor = faol.flags.includes(kalit);
    faol.flags = bor ? faol.flags.filter((k) => k !== kalit) : [...faol.flags, kalit];
    tugma.setAttribute('aria-pressed', String(!bor));
    saqla();
    yangilaNav();
  }

  function passageQoy(i: number, fokus: boolean): void {
    if (i < 0 || i >= test.passages.length) return;
    yozKutilgan();
    passage = i;
    chizPassage();
    if (fokus) {
      // A new passage starts with its text.
      tab = 'matn';
      yangilaKorinish();
      matnPanel.focus();
    }
  }

  function savolgaOt(n: number): void {
    const kalit = raqamKalit.get(n);
    const joy = kalit ? joylar.get(kalit) : undefined;
    if (!kalit || !joy) return;
    if (joy.passage !== passage) {
      yozKutilgan();
      passage = joy.passage;
      chizPassage();
    }
    if (telefon.matches) {
      tab = 'savollar';
      navOch(false);
    }
    yangilaKorinish();
    const blok = document.getElementById(`savol-${kalit}`);
    if (!blok) return;
    blok.scrollIntoView({ block: 'start', behavior: kamHarakat.matches ? 'auto' : 'smooth' });
    const nazorat = blok.querySelector<HTMLElement>('input[data-savol]:checked') ?? blok.querySelector<HTMLElement>('[data-savol]');
    nazorat?.focus({ preventScroll: true });
  }

  // ---------- Timer ----------

  function tik(): void {
    if (tugadi) return;
    const hozir = Date.now();
    const qoldi = qolganMs(faol.deadline, hozir);
    const matn = vaqtMatn(qoldi);
    if (vaqtEl.textContent !== matn) vaqtEl.textContent = matn;
    vaqtOram.classList.toggle('kam', qoldi <= KAM_VAQT_MS);
    const daqiqa = elonDaqiqa(oldingiMs, qoldi);
    if (daqiqa !== null) elonQil(RM.vaqtElon(daqiqa));
    oldingiMs = qoldi;

    if (hozir - oxirgiYurak >= QULF_YURAK_MS) {
      oxirgiYurak = hozir;
      tekshirHolat();
    }
    if (qoldi > 0 || tugadi) return;
    if (!passiv) {
      yakun(true);
    } else if (qulf() !== 'boshqa') {
      // The tab that owned the attempt is gone: submit what it saved.
      const saqlangan = repo.faol();
      if (saqlangan && saqlangan.id === faol.id) {
        faol = saqlangan;
        passiv = false;
        yakun(true);
      }
    }
  }

  // ---------- Finish ----------

  function yakunSora(): void {
    if (tugadi || passiv) return;
    yozKutilgan();
    let javobsiz = 0;
    for (const [kalit, joy] of joylar) {
      javobsiz += savolTuri(joy.guruh.type).berilgan(joy.savol, faol.answers[kalit]).filter((b) => !b).length;
    }
    el('rt-yakun-javobsiz').textContent = RM.yakunJavobsiz(javobsiz);
    el('rt-yakun-belgi').textContent = RM.yakunBelgi(faol.flags.filter((k) => joylar.has(k)).length);
    yakunDialog.showModal();
  }

  function yakun(avto: boolean): void {
    if (tugadi) return;
    yozKutilgan();
    tugadi = true;
    window.clearInterval(soat);
    if (yakunDialog.open) yakunDialog.close();
    if (avto) elonQil(RM.vaqtTugadi);

    const hozir = Date.now();
    const { urinish } = yakunla(faol, test, hozir);
    const saqlandi = repo.qoshUrinish(urinish);
    repo.tozalaFaol();
    qulfBoshat(ombor, tabId, hozir);

    // Navigator "Keyingi qadam": the weakest question type's lesson, or a new test.
    const tavsiya = tavsiyaTanla(urinish.perTypeStats);
    ornatKeyingiQadam(
      {
        manba: 'ielts-reading',
        sarlavha: tavsiya.sarlavha,
        izoh: tavsiya.izoh,
        manzil: tavsiya.manzil,
        tugaydi: new Date(hozir + TAVSIYA_MUDDAT_KUN * 86_400_000).toISOString(),
      },
      ombor,
    );

    if (saqlandi) {
      location.replace(`${yol(READING_YOL.natija)}?urinish=${encodeURIComponent(urinish.id)}${avto ? '&avto=1' : ''}`);
      return;
    }
    // Nothing was persisted: show the result on this page, it cannot be opened anywhere else.
    holatEl.hidden = true;
    ish.hidden = true;
    vaqtOram.hidden = true;
    yakunTugma.hidden = true;
    xotiraOgoh.hidden = true;
    tabXabar(null);
    natijaOram.hidden = false;
    chizNatija(el('rt-natija-ichi'), { urinish, test, avto, saqlanmagan: true });
    el('rt-natija-h').focus();
  }

  // ---------- Events ----------

  function bogla(): void {
    savolPanel.addEventListener('change', (e) => {
      const t = e.target;
      if (t instanceof HTMLSelectElement) {
        if (t.dataset.savol) javobQoy(t.dataset.savol, t.value);
        return;
      }
      if (!(t instanceof HTMLInputElement) || !t.dataset.savol) return;
      const kalit = t.dataset.savol;
      if (t.type === 'checkbox') {
        const guruh = t.closest<HTMLElement>('.variantlar');
        if (!guruh) return;
        const tanlangan = [...guruh.querySelectorAll<HTMLInputElement>('input:checked')];
        const izoh = document.getElementById(`s-${kalit}-matn-izoh`);
        const ortiqcha = tanlangan.length > Number(guruh.dataset.chegara ?? '2');
        if (izoh) {
          izoh.textContent = ortiqcha ? RM.ikkitadanKop : RM.ikkitaTanla;
          izoh.classList.toggle('ogoh', ortiqcha);
        }
        if (ortiqcha) {
          // A third option is refused instead of silently replacing an earlier choice.
          t.checked = false;
          elonQil(RM.ikkitadanKop);
          return;
        }
        javobQoy(kalit, tanlangan.map((i) => i.value));
      } else if (t.type === 'text') {
        yozKutilgan();
        javobQoy(kalit, t.value);
      } else {
        javobQoy(kalit, t.value);
      }
    });

    // Text answers are saved shortly after typing stops, and at once on blur or page hide.
    savolPanel.addEventListener('input', (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement) || t.type !== 'text' || !t.dataset.savol) return;
      if (kutilgan && kutilgan.maydon !== t) yozKutilgan();
      if (kutilgan) window.clearTimeout(kutilgan.taymer);
      kutilgan = { kalit: t.dataset.savol, maydon: t, taymer: window.setTimeout(yozKutilgan, YOZISH_KECHIKISH_MS) };
    });

    savolPanel.addEventListener('click', (e) => {
      const nishon = e.target as HTMLElement;
      const belgi = nishon.closest<HTMLElement>('[data-belgi]');
      if (belgi?.dataset.belgi) {
        belgiAlmashtir(belgi.dataset.belgi, belgi);
        return;
      }
      const ot = nishon.closest<HTMLElement>('[data-passage-ot]');
      if (ot) passageQoy(Number(ot.dataset.passageOt), true);
    });

    passageTugmalar.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-passage]');
      if (t) passageQoy(Number(t.dataset.passage), false);
    });

    navIchi.addEventListener('click', (e) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-raqam]');
      if (t) savolgaOt(Number(t.dataset.raqam));
    });
    navTugma.addEventListener('click', () => navOch(navTugma.getAttribute('aria-expanded') !== 'true'));

    // Tabs: click, arrows, Home and End (selection follows focus).
    const tabTanla = (nom: 'matn' | 'savollar', fokus: boolean) => {
      tab = nom;
      yangilaKorinish();
      if (fokus) (nom === 'matn' ? tabMatn : tabSavol).focus();
    };
    tabMatn.addEventListener('click', () => tabTanla('matn', false));
    tabSavol.addEventListener('click', () => tabTanla('savollar', false));
    tablar.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') tabTanla(tab === 'matn' ? 'savollar' : 'matn', true);
      else if (e.key === 'Home') tabTanla('matn', true);
      else if (e.key === 'End') tabTanla('savollar', true);
      else return;
      e.preventDefault();
    });
    telefon.addEventListener('change', () => {
      yangilaKorinish();
      navOch(!telefon.matches);
    });

    yakunTugma.addEventListener('click', yakunSora);
    el('rt-yakun-ha').addEventListener('click', () => yakun(false));
    el('rt-yakun-yoq').addEventListener('click', () => {
      yakunDialog.close();
      yakunTugma.focus();
    });
    shuTabTugma.addEventListener('click', shuTabdaDavom);

    window.addEventListener('storage', () => tekshirHolat());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') yozKutilgan();
      else tik();
    });
    window.addEventListener('pagehide', () => {
      yozKutilgan();
      // Release the lock so a reload of this tab is not mistaken for a second tab.
      if (!tugadi && !passiv && saqlanadi) qulfBoshat(ombor, tabId, Date.now());
    });
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) tekshirHolat();
    });
    window.addEventListener('beforeunload', (e) => {
      // Only when leaving would lose the attempt (nothing is persisted).
      if (!tugadi && !saqlanadi) e.preventDefault();
    });
  }

  // ---------- Start ----------

  async function boshla(): Promise<void> {
    let idlar: string[] = [];
    try {
      const xom: unknown = JSON.parse(ildiz!.dataset.testlar ?? '[]');
      if (Array.isArray(xom)) idlar = xom.filter((x): x is string => typeof x === 'string');
    } catch {
      idlar = [];
    }
    const boshlashSoralgan = new URLSearchParams(location.search).has('boshla');

    let f = repo.faol();
    let t: ReadingTest | null = null;
    if (!f) {
      if (!boshlashSoralgan) return holatXabar(RM.faolYoq, 'boshlash');
      if (idlar.length === 0) return holatXabar(RM.testYoq, 'boshlash');
      const tarix = repo.urinishlar();
      const tanlangan = tanlaTest(idlar, tarix.length > 0 ? tarix[tarix.length - 1].testId : null);
      const yuklangan = tanlangan ? await yuklaTest(tanlangan) : 'yoq';
      if (typeof yuklangan === 'string') return holatXabar(RM.yuklashXato, 'qayta');
      t = yuklangan;
      // Another tab may have started an attempt while this one was loading.
      f = repo.faol();
      if (!f) {
        // The clock starts now, when the test is on screen.
        f = yangiUrinish(t, Date.now());
        saqlanadi = repo.saqlaFaol(f);
      }
    }
    if (!t || t.testId !== f.testId) {
      const yuklangan = await yuklaTest(f.testId);
      if (yuklangan === 'xato') return holatXabar(RM.yuklashXato, 'qayta');
      if (yuklangan === 'yoq') {
        repo.tozalaFaol();
        return holatXabar(RM.faolTestYoq, 'boshlash');
      }
      t = yuklangan;
    }
    // Drop "?boshla=1" so a reload or the back button cannot be read as "start again".
    history.replaceState(null, '', location.pathname);

    test = t;
    faol = { ...f, flags: f.flags.filter((k): k is string => typeof k === 'string') };
    test.passages.forEach((p, i) => {
      for (const g of p.groups) {
        for (const s of g.questions) {
          const kalit = savolKaliti(s);
          joylar.set(kalit, { savol: s, guruh: g, passage: i });
          savolRaqamlari(s).forEach((n) => raqamKalit.set(n, kalit));
        }
      }
    });

    if (!saqlanadi || !repo.doimiy) {
      saqlanadi = false;
      xotiraOgohlantir();
    }
    if (saqlanadi) {
      if (qulf() === 'boshqa') passiv = true;
      else qulfOl(ombor, tabId, Date.now());
    }
    bogla();
    if (avtoYakunKerak(faol, Date.now()) && !passiv) {
      // Time ran out while the page was closed: submit with the saved answers.
      yakun(true);
      return;
    }

    quriNav();
    chizPassage();
    navOch(!telefon.matches);
    yangilaKorinish();
    holatEl.hidden = true;
    ish.hidden = false;
    vaqtOram.hidden = false;
    yakunTugma.hidden = false;
    if (passiv) {
      passiv = false;
      passivQil();
    }
    oxirgiYurak = Date.now();
    soat = window.setInterval(tik, 250);
    tik();
  }

  void boshla();
}
