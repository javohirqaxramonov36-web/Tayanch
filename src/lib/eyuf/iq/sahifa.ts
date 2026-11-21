import { yol } from '../../yol';
import { savollar } from './savollar';
import {
  SAQLASH_KALITI, TOGRI_XP, aralashtir, boshHolat, chegaraMatni, daqiqaTogrimi,
  holatniOqi, mukofotHisobla, natijaniHisobla, rejimNomi, ulashishMatni, yangiSessiya,
  type Holat, type IqSavol, type Rejim, type Variant,
} from './model';

export function ishgaTushir() {
  const ildiz = document.querySelector<HTMLElement>('#eyuf-iq');
  if (!ildiz) return;
  const top = <T extends HTMLElement = HTMLElement>(selektor: string) => ildiz.querySelector<T>(selektor)!;
  const ekranlar = [top('[data-tanlash]'), top('[data-test-ekran]'), top('[data-natija]')];
  const zoom = top<HTMLDialogElement>('[data-zoom]');
  const tasdiq = top<HTMLDialogElement>('[data-tasdiq]');
  const daqiqa = top<HTMLInputElement>('#iq-daqiqa');
  let holat: Holat = boshHolat();
  let ekran = 0;
  let ogohSessiya = '';
  let tasdiqAmal: (() => void) | null = null;

  function saqlashXabari() {
    const xabar = top('[data-saqlash]');
    xabar.hidden = false;
    xabar.textContent = 'Brauzer ma’lumotni saqlay olmadi. Mashqni davom ettirishingiz mumkin. Sahifa yopilsa progress yo‘qolishi mumkin.';
  }

  function saqla() {
    try { localStorage.setItem(SAQLASH_KALITI, JSON.stringify(holat)); }
    catch { saqlashXabari(); }
  }

  try { holat = holatniOqi(localStorage.getItem(SAQLASH_KALITI), savollar); }
  catch { saqlashXabari(); }
  daqiqa.value = String(holat.daqiqa);

  function ekranOch(raqam: number) {
    ekran = raqam;
    ekranlar.forEach((e, i) => { e.hidden = i !== raqam; });
    top('[data-jami-xp]').textContent = String(holat.mukofotlar.length * TOGRI_XP);
  }

  function tanlashniChiz() {
    ekranOch(0);
    const s = holat.sessiya;
    top('[data-davom]').hidden = !s;
    if (s) {
      top('[data-davom-matn]').textContent = s.yakunlangan === null
        ? `${rejimNomi(s.rejim)} — ${Object.keys(s.javoblar).length}/${s.savollar.length} javob saqlangan. Taymer davom etmoqda.`
        : `${rejimNomi(s.rejim)} natijasi saqlangan.`;
      top('[data-davom-et]').textContent = s.yakunlangan === null ? 'Davom ettirish' : 'Natijani ko‘rish';
    }
  }

  function rasmYasa(savol: IqSavol, rasm: IqSavol['rasmlar'][number], qism: number) {
    const img = document.createElement('img');
    img.src = yol(rasm.fayl);
    img.width = rasm.kenglik;
    img.height = rasm.balandlik;
    img.alt = `${savol.test}-test, ${savol.raqam}-savol${savol.rasmlar.length > 1 ? `, ${qism + 1}-qism` : ''}. Savol va javob variantlari.`;
    img.decoding = 'async';
    return img;
  }

  function kattalashtir(savol: IqSavol) {
    top('[data-zoom-rasmlar]').replaceChildren(...savol.rasmlar.map((r, i) => rasmYasa(savol, r, i)));
    top('#iq-zoom-h').textContent = `${savol.test}-test · ${savol.raqam}-savol`;
    zoom.showModal();
    top('[data-zoom-yop]').focus();
  }

  function rasmlarniChiz(joy: HTMLElement, savol: IqSavol) {
    const rasmlar = savol.rasmlar.map((r, i) => {
      const tugma = document.createElement('button');
      tugma.type = 'button';
      tugma.className = 'iq-rasm-tugma';
      tugma.setAttribute('aria-label', `${savol.raqam}-savol rasmini kattalashtirish${savol.rasmlar.length > 1 ? `, ${i + 1}-qism` : ''}`);
      tugma.append(rasmYasa(savol, r, i));
      tugma.addEventListener('click', () => kattalashtir(savol));
      return tugma;
    });
    joy.replaceChildren(...rasmlar);
  }

  function savolniOch(indeks: number, fokus = true) {
    const s = holat.sessiya;
    if (!s || s.yakunlangan !== null || indeks < 0 || indeks >= s.savollar.length) return;
    if (Date.now() >= s.muddat) { yakunla(); return; }
    s.joriy = indeks;
    ekranOch(1);
    const savol = savollar.find(q => q.id === s.savollar[indeks])!;
    top('[data-rejim]').textContent = rejimNomi(s.rejim);
    top('#iq-savol-h').textContent = `${indeks + 1}-savol`;
    top('[data-manba]').textContent = `${savol.test}-test · ${savol.raqam}-savol`;
    top('[data-tekshiruv]').hidden = savol.tekshirilgan;
    rasmlarniChiz(top('[data-rasmlar]'), savol);
    const variantlar = savol.variantlar.map(harf => {
      const tugma = document.createElement('button');
      tugma.type = 'button';
      tugma.className = 'iq-variant';
      tugma.textContent = harf;
      tugma.dataset.variant = harf;
      tugma.setAttribute('aria-label', `${harf} javob`);
      tugma.addEventListener('click', () => javobTanla(harf));
      return tugma;
    });
    top('[data-variantlar]').replaceChildren(...variantlar);
    top<HTMLButtonElement>('[data-oldingi]').disabled = indeks === 0;
    top<HTMLButtonElement>('[data-keyingi]').disabled = indeks === s.savollar.length - 1;
    javobHolatiniChiz();
    vaqtniChiz();
    saqla();
    if (fokus) top('#iq-savol-h').focus();
  }

  function javobHolatiniChiz() {
    const s = holat.sessiya!;
    const tanlangan = s.javoblar[s.savollar[s.joriy]];
    top('[data-javob-soni]').textContent = `${Object.keys(s.javoblar).length} / ${s.savollar.length} javob`;
    ildiz!.querySelectorAll<HTMLButtonElement>('[data-variant]').forEach(t => {
      t.setAttribute('aria-pressed', String(t.dataset.variant === tanlangan));
    });
    const tugmalar = s.savollar.map((id, i) => {
      const t = document.createElement('button');
      t.type = 'button';
      t.className = 'iq-nav-tugma';
      t.textContent = String(i + 1);
      t.dataset.javob = s.javoblar[id] ? 'bor' : 'yoq';
      t.setAttribute('aria-label', `${i + 1}-savol, ${s.javoblar[id] ? 'javob berilgan' : 'javobsiz'}`);
      if (i === s.joriy) t.setAttribute('aria-current', 'step');
      t.addEventListener('click', () => savolniOch(i));
      return t;
    });
    top('[data-nav]').replaceChildren(...tugmalar);
  }

  function javobTanla(harf: Variant) {
    const s = holat.sessiya;
    if (!s || s.yakunlangan !== null || ekran !== 1) return;
    if (Date.now() >= s.muddat) { yakunla(); return; }
    const savol = savollar.find(q => q.id === s.savollar[s.joriy])!;
    if (!savol.variantlar.includes(harf)) return;
    s.javoblar[savol.id] = harf;
    javobHolatiniChiz();
    top('[data-javob-xabar]').textContent = `${harf} javob tanlandi.`;
    saqla();
  }

  function vaqtniChiz() {
    const s = holat.sessiya;
    if (!s || s.yakunlangan !== null) return;
    const qolgan = Math.max(0, Math.ceil((s.muddat - Date.now()) / 1000));
    const vaqt = `${Math.floor(qolgan / 60).toString().padStart(2, '0')}:${(qolgan % 60).toString().padStart(2, '0')}`;
    top('[data-taymer]').textContent = vaqt;
    if (qolgan === 0) { yakunla(); return; }
    const ogoh = top('[data-ogoh]');
    ogoh.hidden = qolgan > 300;
    if (qolgan <= 300 && ogohSessiya !== s.id) {
      ogohSessiya = s.id;
      ogoh.textContent = '5 daqiqa yoki undan kam vaqt qoldi. Javobsiz savollarni tekshiring.';
    }
  }

  function natijaniChiz(fokus = true) {
    const s = holat.sessiya;
    if (!s || s.yakunlangan === null) return;
    const n = natijaniHisobla(s, savollar);
    ekranOch(2);
    top('[data-natija-rejim]').textContent = rejimNomi(s.rejim);
    top('[data-ball]').textContent = String(n.ball);
    top('[data-chegara]').textContent = chegaraMatni(n.chegara);
    top('[data-natija-izoh]').textContent = s.vaqtTugadi ? 'Vaqt tugadi. Saqlangan javoblar hisoblandi.' : 'Test yakunlandi. Saqlangan javoblar hisoblandi.';
    top('[data-togri]').textContent = String(n.togri.length);
    top('[data-xato-son]').textContent = String(n.xatolar.length);
    top('[data-combo]').textContent = String(n.engUzunCombo);
    top('[data-xp]').textContent = `+${s.olinganXp}`;
    const ogoh = top('[data-natija-ogoh]');
    ogoh.hidden = n.tekshirilmoqda.length === 0;
    ogoh.textContent = `${n.tekshirilmoqda.length} javob tekshirilmoqda. Tasdiqlangan ball ${n.ball}/100. Tekshiruvdan keyingi eng yuqori mumkin bo‘lgan ball ${n.engYuqori}/100. Bu savollar xato hisoblanmaydi va XP bermaydi.`;
    top<HTMLButtonElement>('[data-qayta]').disabled = n.xatolar.length === 0;
    top('[data-xatosiz]').hidden = n.xatolar.length > 0 || n.tekshirilmoqda.length > 0;
    const tahlil = [...n.xatolar, ...n.tekshirilmoqda].map(savol => {
      const li = document.createElement('li');
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = `${savol.test}-test · ${savol.raqam}-savol — ${savol.tekshirilgan ? 'Xato yoki javobsiz' : 'Javob tekshirilmoqda'}`;
      const ichki = document.createElement('div');
      ichki.className = 'iq-tahlil-ichki';
      const javob = document.createElement('p');
      javob.textContent = `Sizning javobingiz ${s.javoblar[savol.id] ?? 'berilmagan'}. ${savol.tekshirilgan ? 'To‘g‘ri javob' : 'Kitob kalitidagi javob'} ${savol.kitobJavobi}.`;
      const izoh = document.createElement('p');
      izoh.textContent = savol.yechim;
      const rasmlar = document.createElement('div');
      rasmlar.className = 'iq-rasmlar';
      details.addEventListener('toggle', () => {
        if (details.open && !rasmlar.childElementCount) rasmlarniChiz(rasmlar, savol);
      });
      ichki.append(javob, izoh, rasmlar);
      details.append(summary, ichki);
      li.append(details);
      return li;
    });
    top('[data-tahlil]').replaceChildren(...tahlil);
    top('[data-nusxa-xabar]').textContent = '';
    top('[data-nusxa-oram]').hidden = true;
    if (fokus) top('#iq-natija-h').focus();
  }

  function yakunla() {
    if (!holat.sessiya || holat.sessiya.yakunlangan !== null) return;
    // Boshqa oynada berilgan XP qayta qo‘shilmasin.
    try {
      const yangi = holatniOqi(localStorage.getItem(SAQLASH_KALITI), savollar);
      const barcha = new Map([...holat.mukofotlar, ...yangi.mukofotlar].map(m => [m.id, m]));
      holat.mukofotlar = [...barcha.values()];
    } catch { saqlashXabari(); }
    holat = mukofotHisobla(holat, savollar);
    saqla();
    if (tasdiq.open) tasdiq.close();
    if (zoom.open) zoom.close();
    natijaniChiz();
  }

  function tasdiqSora(sarlavha: string, matn: string, tugma: string, amal: () => void) {
    top('#iq-tasdiq-h').textContent = sarlavha;
    top('[data-tasdiq-matn]').textContent = matn;
    top('[data-tasdiqla]').textContent = tugma;
    tasdiqAmal = amal;
    tasdiq.showModal();
    top('[data-bekor]').focus();
  }

  function boshlash(rejim: Rejim, xatolar?: readonly IqSavol[]) {
    const vaqt = Number(daqiqa.value);
    const xato = top('#iq-vaqt-xato');
    if (!daqiqaTogrimi(vaqt)) {
      xato.textContent = 'Vaqtni 1 dan 180 gacha butun daqiqada kiriting.';
      daqiqa.setAttribute('aria-invalid', 'true');
      daqiqa.focus();
      return;
    }
    xato.textContent = '';
    daqiqa.removeAttribute('aria-invalid');
    const royxat = rejim === 'xatolar' ? [...xatolar!]
      : rejim === 'aralash' ? aralashtir(savollar).slice(0, 20)
      : savollar.filter(s => s.test === Number(rejim));
    const amal = () => {
      holat.daqiqa = vaqt;
      holat.sessiya = yangiSessiya(rejim, royxat, vaqt);
      ogohSessiya = '';
      savolniOch(0);
    };
    if (holat.sessiya?.yakunlangan === null) {
      tasdiqSora('Yangi test boshlaysizmi?', 'Davom etayotgan test o‘rniga yangi test ochiladi.', 'Yangi test', amal);
    } else amal();
  }

  ildiz.querySelectorAll<HTMLButtonElement>('[data-test]').forEach(t => {
    t.disabled = false;
    t.addEventListener('click', () => boshlash(t.dataset.test as Rejim));
  });
  top('[data-oldingi]').addEventListener('click', () => savolniOch(holat.sessiya!.joriy - 1));
  top('[data-keyingi]').addEventListener('click', () => savolniOch(holat.sessiya!.joriy + 1));
  top('[data-tanlashga]').addEventListener('click', tanlashniChiz);
  top('[data-boshqa]').addEventListener('click', tanlashniChiz);
  top('[data-davom-et]').addEventListener('click', () => {
    if (holat.sessiya?.yakunlangan !== null) natijaniChiz();
    else savolniOch(holat.sessiya.joriy);
  });
  top('[data-yakunla]').addEventListener('click', () => {
    const s = holat.sessiya!;
    const qolgan = s.savollar.length - Object.keys(s.javoblar).length;
    tasdiqSora('Testni yakunlaysizmi?', qolgan ? `${qolgan} savol javobsiz. Tasdiqlangan javobsiz savollar xato hisoblanadi.` : 'Barcha javoblar hisoblanib, natija ko‘rsatiladi.', 'Yakunlash', yakunla);
  });
  top('[data-bekor]').addEventListener('click', () => tasdiq.close());
  top('[data-tasdiqla]').addEventListener('click', () => { tasdiq.close(); tasdiqAmal?.(); });
  top('[data-zoom-yop]').addEventListener('click', () => zoom.close());
  top('[data-qayta]').addEventListener('click', () => {
    const n = natijaniHisobla(holat.sessiya!, savollar);
    if (n.xatolar.length) boshlash('xatolar', n.xatolar);
  });
  top('[data-ulash]').addEventListener('click', async () => {
    const matn = ulashishMatni(holat.sessiya!, savollar);
    try {
      await navigator.clipboard.writeText(matn);
      top('[data-nusxa-xabar]').textContent = 'Natija nusxalandi. Telegram’ga joylashingiz mumkin.';
    } catch {
      top('[data-nusxa-xabar]').textContent = 'Avtomatik nusxalash ishlamadi. Quyidagi matnni nusxalang.';
      top('[data-nusxa-oram]').hidden = false;
      const maydon = top<HTMLTextAreaElement>('#iq-nusxa');
      maydon.value = matn;
      maydon.focus();
      maydon.select();
    }
  });
  document.addEventListener('keydown', e => {
    if (ekran !== 1 || zoom.open || tasdiq.open || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) return;
    const harf = e.key.toUpperCase();
    if (/^[A-E]$/.test(harf)) { e.preventDefault(); javobTanla(harf as Variant); }
    if (e.key === 'ArrowRight') { e.preventDefault(); savolniOch(holat.sessiya!.joriy + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); savolniOch(holat.sessiya!.joriy - 1); }
  });
  window.addEventListener('storage', e => {
    if (e.key !== SAQLASH_KALITI) return;
    holat = holatniOqi(e.newValue, savollar);
    if (holat.sessiya?.yakunlangan === null && ekran === 1) savolniOch(holat.sessiya.joriy, false);
    else if (holat.sessiya?.yakunlangan != null && ekran !== 0) natijaniChiz(false);
    else tanlashniChiz();
  });
  window.setInterval(vaqtniChiz, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) vaqtniChiz(); });
  if (holat.sessiya?.yakunlangan === null && Date.now() >= holat.sessiya.muddat) yakunla();
  else tanlashniChiz();
}
