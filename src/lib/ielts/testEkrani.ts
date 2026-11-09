import { el, havola, progress, soniyaMatni, top, tugma } from './dom';
import { natijaChiz } from './natija';
import { mezonniYoz, ochiqUrinishniOqi, urinishOch, urinishniYoz, xatoniYechildi, type Urinish } from './storage';
import { audioIjro } from './tinglash';
import { bahola, ballModulmi, javobBormi, javobMatni, savollar, testIdMi, turNomi, type BallTest, type Diagram, type Javob, type Modul, type Savol, type Test } from './test';
import { daftarYoli, jsonYoli, natijaYoli } from './yollar';
import { ochiqModulChiz } from './yozishGapirish';

const QAROR = 'ielts-javob';
export type Yangila = (amal: (u: Urinish) => void) => Urinish;

export async function testniYukla(modul: Modul, id: string): Promise<Test> {
  if (!testIdMi(id)) throw new Error('Test ID');
  const res = await fetch(jsonYoli(modul, id));
  if (!res.ok) throw new Error(String(res.status));
  const test = await res.json() as Test;
  if (test.id !== id || test.module !== modul) throw new Error('Test turi');
  return test;
}

export async function ishgaTushir(root: HTMLElement) {
  const modul = root.dataset.ieltsTest as Modul;
  const params = new URLSearchParams(location.search);
  const id = params.get('test');
  if (!id) return;
  const holat = top(root, '[data-holat]');
  holat.textContent = 'Test yuklanmoqda…';
  let test: Test;
  try { test = await testniYukla(modul, id); }
  catch { holat.textContent = 'Testni ochib bo‘lmadi. Ro‘yxatdan boshqa testni tanlang.'; return; }

  top(root, '[data-tanlov]').hidden = true;
  holat.textContent = '';
  const boshlash = top(root, '[data-boshlash]');
  const nom = top(root, '[data-test-nom]');
  nom.textContent = test.title;
  nom.lang = 'en';
  const qaytaId = params.get('qayta');
  const qaytaSavol = qaytaId && ballModulmi(test.module)
    ? savollar(test as BallTest).find((q) => q.id === qaytaId)
    : undefined;
  top(root, '[data-test-izoh]').textContent = qaytaSavol ? 'Xato daftaridan bitta savolni qayta ishlaysiz.'
    : test.module === 'speaking' ? 'Savollarni ovoz chiqarib mashq qiling.'
    : `Vaqt · ${Math.ceil(test.durationSeconds / 60)} daqiqa. Boshlagandan keyin javoblar shu brauzerda saqlanadi.`;
  const start = top<HTMLButtonElement>(root, '[data-start]');
  const draft = ochiqUrinishniOqi(test.module, test.id, qaytaSavol?.id);
  if (draft) start.textContent = 'Mashqni davom ettirish';
  boshlash.hidden = false;

  start.addEventListener('click', () => {
    boshlash.hidden = true;
    const yangi = urinishOch(test.module, test.id, qaytaSavol ? 300 : test.durationSeconds, qaytaSavol?.id);
    let urinish = yangi.urinish;
    let saqlandi = yangi.saqlandi;
    const ogohlantir = () => { holat.textContent = saqlandi ? '' : 'Brauzerga saqlab bo‘lmadi. Sahifani ochiq qoldiring.'; };
    const oqi = () => urinish;
    const yangila: Yangila = (amal) => {
      const natija = urinishniYoz(urinish, amal, saqlandi);
      urinish = natija.urinish;
      saqlandi = natija.saqlandi;
      ogohlantir();
      return urinish;
    };
    ogohlantir();
    const ish = top(root, '[data-ish]');
    ish.hidden = false;
    const dialog = top<HTMLDialogElement>(root, '[data-tasdiq]');
    const natijaJoy = top(root, '[data-joriy-natija]');
    let yop = () => {};
    let taymer: ReturnType<typeof setInterval> | undefined;
    let tugadi = false;

    const yakunla = (vaqtTugadi = false) => {
      if (tugadi) return;
      tugadi = true;
      clearInterval(taymer);
      if (dialog.open) dialog.close();
      yop();
      yangila((u) => { u.topshirilgan = Date.now(); });
      ish.hidden = true;
      natijaJoy.hidden = false;
      if (vaqtTugadi) holat.textContent = 'Ajratilgan vaqt tugadi.';
      if (saqlandi && !qaytaSavol) { location.assign(natijaYoli(urinish.id)); return; }
      if (qaytaSavol) {
        const togri = bahola(qaytaSavol, urinish.javoblar[qaytaSavol.id]);
        if (togri) xatoniYechildi(`${test.module}:${test.id}:${qaytaSavol.id}`);
        const izoh = el('p', qaytaSavol.explanation_uz);
        natijaJoy.append(el('h2', togri ? 'To‘g‘ri' : 'Yana urinib ko‘ring'), el('p', `To‘g‘ri javob · ${javobMatni('correct' in qaytaSavol ? qaytaSavol.correct : qaytaSavol.accepted)}`), izoh, havola('Xato daftariga qaytish', daftarYoli()));
      } else if (ballModulmi(test.module)) {
        natijaChiz(natijaJoy, test as BallTest, urinish);
      } else {
        ochiqModulChiz(natijaJoy, test as Exclude<Test, BallTest>, oqi, (amal) => (urinish = mezonniYoz(urinish, amal)), true);
      }
      const sarlavha = natijaJoy.querySelector('h2');
      if (sarlavha) { sarlavha.tabIndex = -1; sarlavha.focus(); }
    };

    if (ballModulmi(test.module)) yop = ballMashqi(ish, test as BallTest, oqi, yangila, holat, qaytaSavol);
    else yop = ochiqModulChiz(top(ish, '[data-ochiq-modul]'), test as Exclude<Test, BallTest>, oqi, yangila, false, () => yakunla());

    root.querySelector('[data-topshir]')?.addEventListener('click', () => {
      const jami = ballModulmi(test.module)
        ? (qaytaSavol ? [qaytaSavol] : savollar(test as BallTest)).filter((savol) => !javobBormi(urinish.javoblar[savol.id])).length
        : null;
      top(dialog, '[data-tasdiq-matni]').textContent = jami === null ? 'Javoblaringizni tekshirib bo‘lganingizdan so‘ng topshiring.'
        : jami ? `${jami} ta savol javobsiz. Topshirsangiz, natija hisoblanadi.` : 'Barcha savollarga javob berdingiz.';
      dialog.showModal();
    });
    top(dialog, '[data-yakunla]').addEventListener('click', () => yakunla());
    const soat = document.querySelector<HTMLElement>('[data-test-vaqt]');
    const tick = () => {
      if (tugadi || !soat) return;
      const qoldi = Math.ceil(((urinish.yakuniy ?? urinish.tugash) - Date.now()) / 1000);
      soat.textContent = soniyaMatni(qoldi);
      if (qoldi <= 0) yakunla(true);
    };
    if (soat) {
      taymer = setInterval(tick, 250);
      tick();
    }
    if (!tugadi) {
      const fokus = ish.querySelector<HTMLElement>('#savol-joyi, [data-ochiq-modul]');
      if (fokus) { fokus.tabIndex = -1; fokus.focus(); }
    }
    window.addEventListener('pagehide', () => yop(), { once: true });
    window.addEventListener('pageshow', (event) => { if (event.persisted) location.reload(); });
  }, { once: true });
}

function diagramChiz(diagram: Diagram) {
  const rasm = el('figure', '', 'ielts-diagram');
  const nom = el('figcaption', diagram.title);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 100 75');
  svg.setAttribute('class', 'ielts-xarita-sxema');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', diagram.alt);
  const yolak = document.createElementNS(svg.namespaceURI, 'path');
  yolak.setAttribute('d', 'M50 10V65M10 38H90');
  yolak.setAttribute('class', 'ielts-diagram-yolak');
  svg.append(yolak);
  for (const joy of diagram.places) {
    const nuqta = document.createElementNS(svg.namespaceURI, 'circle');
    nuqta.setAttribute('cx', String(joy.x));
    nuqta.setAttribute('cy', String(joy.y));
    nuqta.setAttribute('r', '6');
    const t = document.createElementNS(svg.namespaceURI, 'text');
    t.setAttribute('x', String(joy.x));
    t.setAttribute('y', String(joy.y));
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('dominant-baseline', 'central');
    t.textContent = joy.label;
    svg.append(nuqta, t);
  }
  rasm.append(nom, svg);
  return rasm;
}

function savolChiz(root: HTMLElement, savol: Savol, qiymat: Javob | undefined, yoz: (javob: Javob) => void) {
  const tur = el('p', turNomi[savol.type], 'yorliq');
  tur.lang = 'en';
  const fs = el('fieldset', '', 'ielts-variantlar');
  fs.lang = 'en';
  const legend = el('legend', savol.text);
  fs.append(legend);
  if ('accepted' in savol) {
    const input = el('input', '', 'ielts-maydon');
    input.id = QAROR;
    input.maxLength = 240;
    input.value = typeof qiymat === 'string' ? qiymat : '';
    const label = el('label', `Your answer (up to ${savol.maxWords} words)`, 'ielts-izoh');
    label.htmlFor = QAROR;
    input.addEventListener('input', () => yoz(input.value));
    fs.append(label, input);
  } else {
    const kop = Array.isArray(savol.correct);
    if (kop) fs.append(el('p', `Choose ${(savol.correct as string[]).length} options.`, 'ielts-izoh'));
    for (const [i, variant] of savol.options.entries()) {
      const input = el('input');
      input.id = QAROR + '-' + i;
      input.type = kop ? 'checkbox' : 'radio';
      input.name = QAROR;
      input.value = variant;
      input.checked = Array.isArray(qiymat) ? qiymat.includes(variant) : qiymat === variant;
      const label = el('label', '', 'ielts-variant');
      label.htmlFor = input.id;
      label.append(input, el('span', variant));
      fs.append(label);
      input.addEventListener('change', () => {
        if (!kop) yoz(input.value);
        else yoz([...fs.querySelectorAll<HTMLInputElement>('input:checked')].map((v) => v.value));
      });
    }
    const tozala = tugma('Javobni tozalash');
    tozala.lang = 'uz';
    tozala.addEventListener('click', () => {
      fs.querySelectorAll<HTMLInputElement>('input').forEach((input) => { input.checked = false; });
      yoz(kop ? [] : '');
    });
    fs.append(tozala);
  }
  root.replaceChildren(tur, fs);
}

function ballMashqi(ish: HTMLElement, test: BallTest, oqi: () => Urinish, yangila: Yangila, holat: HTMLElement, qayta?: Savol) {
  const entries = test.sections.flatMap((section, qism) => section.questions.map((savol) => ({ savol, qism })));
  const barchasi = qayta ? entries.filter(({ savol }) => savol.id === qayta.id) : entries;
  const qismRoyxati = top(ish, '[data-qismlar]');
  const xarita = top(ish, '[data-xarita]');
  const savolJoy = top(ish, '[data-savol]');
  const savolBosh = top(ish, '#savol-bosh');
  const bayroq = top<HTMLButtonElement>(ish, '[data-bayroq]');
  const oldin = top<HTMLButtonElement>(ish, '[data-oldin]');
  const keyin = top<HTMLButtonElement>(ish, '[data-keyin]');
  const parcha = ish.querySelector<HTMLElement>('[data-parcha]');
  const eslatma = ish.querySelector<HTMLTextAreaElement>('[data-eslatma]');
  const audioJoy = ish.querySelector<HTMLElement>('[data-audio]');
  const joy = () => Math.max(0, Math.min(oqi().savol, barchasi.length - 1));
  let faolQism = -1;
  let ijro: { index: number; progress: number } | null = null;
  let toxtat = () => {};
  let oxirgiRange: Range | null = null;

  const ot = (i: number) => {
    yangila((u) => { u.savol = i; });
    chiz();
    top(ish, '#savol-joyi').focus();
  };
  const tugmalar = barchasi.map(({ savol }, i) => {
    const b = tugma(String(i + 1), 'ielts-qkatak');
    b.addEventListener('click', () => ot(i));
    xarita.append(b);
    return { b, savol };
  });

  if (!qayta) test.sections.forEach((_, i) => {
    const b = tugma(`${i + 1}-qism`);
    b.addEventListener('click', () => ot(barchasi.findIndex((entry) => entry.qism === i)));
    qismRoyxati.append(b);
  });

  function holatChiz() {
    const { javoblar, bayroqlar } = oqi();
    const joriy = joy();
    for (const [i, { b, savol }] of tugmalar.entries()) {
      const javob = javobBormi(javoblar[savol.id]);
      const flag = Boolean(bayroqlar[savol.id]);
      b.classList.toggle('ielts-javobli', javob);
      b.classList.toggle('ielts-bayroq', flag);
      b.toggleAttribute('data-joriy', joriy === i);
      if (joriy === i) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
      const belgi = el('span', `${javob ? ' ✓' : ''}${flag ? ' ⚑' : ''}`);
      belgi.setAttribute('aria-hidden', 'true');
      b.replaceChildren(String(i + 1), belgi);
      b.setAttribute('aria-label', `${i + 1}-savol, ${javob ? 'javob berilgan' : 'javobsiz'}${flag ? ', bayroq qo‘yilgan' : ''}`);
    }
    const flag = Boolean(bayroqlar[barchasi[joriy].savol.id]);
    bayroq.setAttribute('aria-pressed', String(flag));
    top(ish, '[data-hisob]').textContent = `${barchasi.filter(({ savol }) => javobBormi(javoblar[savol.id])).length} / ${barchasi.length} javob berilgan`;
  }

  function parchaChiz(qism: number) {
    if (!parcha) return;
    const section = test.sections[qism];
    parcha.replaceChildren(el('h3', section.title));
    for (const [i, matn] of (section.paragraphs ?? []).entries()) {
      const p = el('p');
      const belgi = el('strong', String.fromCharCode(65 + i), 'ielts-xatboshi-belgi');
      const mazmun = el('span');
      const kalit = `${qism}:${i}`;
      mazmun.dataset.xatboshi = kalit;
      let start = 0;
      for (const belgilangan of oqi().ajratmalar[kalit] ?? []) {
        mazmun.append(matn.slice(start, belgilangan.start), el('mark', matn.slice(belgilangan.start, belgilangan.end)));
        start = belgilangan.end;
      }
      mazmun.append(matn.slice(start));
      p.append(belgi, mazmun);
      parcha.append(p);
    }
    if (eslatma) eslatma.value = oqi().eslatmalar[qism] ?? '';
  }

  function audioChiz(qism: number) {
    if (!audioJoy) return;
    const section = test.sections[qism];
    const u = oqi();
    const oxirgiQism = test.sections.length - 1;
    const kutilgan = test.sections.findIndex((_, i) => !u.audioTugagan.includes(i));
    const p = el('p', '', 'ielts-izoh');
    const nom = el('h2', u.yakuniy ? 'Yakuniy tekshiruv' : `${qism + 1}-qism audiosi`, 'ielts-kichik-sarlavha');
    const audioBar = progress(u.audioTugagan.includes(qism) ? 1 : ijro?.index === qism ? ijro.progress : 0, 1, 'Audio ijrosi');
    const play = tugma('Audioni bir marta ijro etish', 'tugma tugma-asosiy');
    if (u.yakuniy) p.textContent = 'Audio yakunlandi. Javoblaringizni tekshirib chiqing.';
    else if (ijro) p.textContent = `${ijro.index + 1}-qism audiosi ijro etilmoqda.`;
    else if (u.audioTugagan.includes(qism)) p.textContent = 'Bu qism audiosi yakunlangan.';
    else if (u.audio.includes(qism)) p.textContent = 'Audio avval boshlangan. Keyingi qismga o‘tishingiz mumkin.';
    else if (qism !== kutilgan && !qayta) p.textContent = 'Avval oldingi qism audiosini eshiting.';
    else p.textContent = section.audio ? 'Audio bir marta ijro etiladi.' : 'Brauzerning mahalliy inglizcha ovozi ishlatiladi.';
    play.disabled = Boolean(ijro || u.audio.includes(qism) || (qism !== kutilgan && !qayta));
    const tugat = () => {
      ijro = null;
      yangila((draft) => {
        if (!draft.audioTugagan.includes(qism)) draft.audioTugagan.push(qism);
        if (qism === oxirgiQism && !qayta) {
          draft.yakuniy = Math.min(draft.tugash, Date.now() + (test.reviewSeconds ?? 120) * 1000);
        }
      });
      audioChiz(faolQism);
    };
    play.addEventListener('click', () => {
      // Marker refresh va bir necha ochiq tabda bir audioni qayta boshlashdan saqlaydi.
      let ruxsat = false;
      yangila((draft) => {
        if (!draft.audio.includes(qism)) { draft.audio.push(qism); ruxsat = true; }
      });
      if (!ruxsat) { audioChiz(faolQism); return; }
      ijro = { index: qism, progress: 0 };
      audioChiz(faolQism);
      toxtat = audioIjro(section, {
        boshlandi: () => { holat.textContent = `${qism + 1}-qism audiosi boshlandi.`; },
        progress: (qiymat) => {
          if (ijro) ijro.progress = qiymat;
          const bar = audioJoy.querySelector('progress');
          if (bar && faolQism === qism) bar.value = qiymat;
        },
        tugadi: tugat,
        xato: (boshlangan) => {
          ijro = null;
          if (boshlangan) tugat();
          else {
            yangila((draft) => { draft.audio = draft.audio.filter((q) => q !== qism); });
            audioChiz(faolQism);
          }
          holat.textContent = 'Audioni ijro etib bo‘lmadi. Qurilmada mahalliy inglizcha ovoz mavjudligini tekshiring.';
        },
      });
    });
    audioJoy.replaceChildren(nom, p, audioBar, play);
    if (!ijro && !u.audioTugagan.includes(qism) && u.audio.includes(qism)) {
      const davom = tugma('Keyingi qismga o‘tish');
      davom.addEventListener('click', tugat);
      audioJoy.append(davom);
    }
  }

  function chiz() {
    const i = joy();
    const { savol, qism } = barchasi[i];
    const u = oqi();
    savolBosh.textContent = qayta ? 'Savolni qayta ishlash' : `${i + 1}-savol`;
    oldin.disabled = i === 0;
    keyin.disabled = i === barchasi.length - 1;
    const yoz = (javob: Javob) => { yangila((draft) => { draft.javoblar[savol.id] = javob; }); holatChiz(); };
    savolChiz(savolJoy, savol, u.javoblar[savol.id], yoz);
    const diagram = test.sections[qism].diagram;
    if (diagram && savol.type === 'map-labelling') savolJoy.prepend(diagramChiz(diagram));
    if (faolQism !== qism) {
      faolQism = qism;
      oxirgiRange = null;
      parchaChiz(qism);
      audioChiz(qism);
      [...qismRoyxati.children].forEach((b, index) => b.setAttribute('aria-pressed', String(index === qism)));
    }
    holatChiz();
  }

  oldin.addEventListener('click', () => ot(joy() - 1));
  keyin.addEventListener('click', () => ot(joy() + 1));
  bayroq.addEventListener('click', () => {
    const id = barchasi[joy()].savol.id;
    yangila((u) => { u.bayroqlar[id] = !u.bayroqlar[id]; });
    holatChiz();
  });
  eslatma?.addEventListener('input', () => { yangila((u) => { u.eslatmalar[faolQism] = eslatma.value; }); });
  const tanlovniOqi = () => {
    const selection = getSelection();
    if (selection?.rangeCount && !selection.isCollapsed && parcha?.contains(selection.getRangeAt(0).commonAncestorContainer)) {
      oxirgiRange = selection.getRangeAt(0).cloneRange();
    }
  };
  parcha?.addEventListener('pointerup', tanlovniOqi);
  parcha?.addEventListener('keyup', tanlovniOqi);
  ish.querySelector('[data-ajrat]')?.addEventListener('click', () => {
    tanlovniOqi();
    const range = oxirgiRange;
    const mazmun = range && (range.startContainer.parentElement?.closest<HTMLElement>('[data-xatboshi]'));
    if (!range || !mazmun || !mazmun.contains(range.endContainer)) {
      holat.textContent = 'Bitta xatboshi ichidan matn tanlang.';
      return;
    }
    const bosh = document.createRange();
    bosh.selectNodeContents(mazmun);
    bosh.setEnd(range.startContainer, range.startOffset);
    const start = bosh.toString().length;
    const end = start + range.toString().length;
    const kalit = mazmun.dataset.xatboshi!;
    yangila((u) => {
      const tartib = [...(u.ajratmalar[kalit] ?? []), { start, end }].sort((a, b) => a.start - b.start);
      const birlashgan: typeof tartib = [];
      for (const belgi of tartib) {
        const oxirgi = birlashgan.at(-1);
        if (oxirgi && oxirgi.end >= belgi.start) oxirgi.end = Math.max(oxirgi.end, belgi.end);
        else birlashgan.push(belgi);
      }
      u.ajratmalar[kalit] = birlashgan;
    });
    oxirgiRange = null;
    parchaChiz(faolQism);
  });
  ish.querySelector('[data-ajrat-ochir]')?.addEventListener('click', () => {
    yangila((u) => {
      Object.keys(u.ajratmalar).filter((kalit) => kalit.startsWith(faolQism + ':')).forEach((kalit) => { delete u.ajratmalar[kalit]; });
    });
    oxirgiRange = null;
    parchaChiz(faolQism);
  });
  chiz();
  return () => toxtat();
}
