import { el, havola, progress, tugma } from './dom';
import { javobMatni, modulNomi, natijala, turNomi, type BallTest } from './test';
import { xatoniSaqla, type Urinish } from './storage';
import { daftarYoli, mashqlarYoli, modulYoli } from './yollar';

export function natijaChiz(root: HTMLElement, test: BallTest, urinish: Urinish) {
  const { togri, jami, band, turBoyicha, xatolar } = natijala(test, urinish.javoblar);
  const sarlavha = el('p', `${modulNomi[test.module]} · ${test.title}`, 'ielts-izoh');
  const xulosa = el('section', '', 'ielts-yuza ielts-oqim');
  const qiymat = el('p', `${togri} / ${jami}`, 'ielts-yirik');
  const bandMatni = band === null
    ? 'Taxminiy band 40 savollik test yakunida ko‘rsatiladi.'
    : `Band (taxminiy) · ${typeof band === 'number' ? band.toFixed(1) : band}`;
  xulosa.append(el('h2', 'To‘g‘ri javoblar'), qiymat, el('p', bandMatni));

  const aniqlik = el('section', '', 'ielts-yuza ielts-oqim');
  aniqlik.append(el('h2', 'Savol turi bo‘yicha aniqlik'));
  for (const [tur, hisob] of turBoyicha) {
    const nom = `${turNomi[tur]} · ${hisob.togri} / ${hisob.jami}`;
    const p = el('p', nom);
    p.lang = 'en';
    aniqlik.append(p, progress(hisob.togri, hisob.jami, nom));
  }

  const tahlil = el('section', '', 'ielts-oqim');
  tahlil.append(el('h2', 'Noto‘g‘ri va bo‘sh javoblar'));
  if (!xatolar.length) tahlil.append(el('p', 'Barcha javoblar to‘g‘ri.'));
  const transcript = test.module === 'listening' ? el('details', '', 'ielts-yuza ielts-ochiladigan') : null;
  if (transcript) {
    transcript.append(el('summary', 'Audio matni'));
    const ichki = el('div', '', 'ielts-ochiladigan-ichki ielts-oqim');
    for (const section of test.sections) {
      ichki.append(el('h3', section.title));
      for (const line of section.script ?? []) ichki.append(el('p', `${line.speaker}: ${line.text}`));
    }
    ichki.lang = 'en';
    transcript.append(ichki);
  }

  for (const { savol, raqam, javob } of xatolar) {
    const qism = el('details', '', 'ielts-yuza ielts-ochiladigan');
    const ichki = el('div', '', 'ielts-ochiladigan-ichki ielts-oqim');
    const matn = el('p', savol.text);
    matn.lang = 'en';
    ichki.append(matn);
    ichki.append(el('p', `Javobingiz · ${javobMatni(javob)}`));
    ichki.append(el('p', `To‘g‘ri javob · ${javobMatni('correct' in savol ? savol.correct : savol.accepted)}`));
    const izoh = el('p', savol.explanation_uz);
    ichki.append(izoh);
    for (const dalil of savol.evidence) {
      const q = el('blockquote', dalil.quote ? `${dalil.ref} · ${dalil.quote}` : dalil.ref, 'ielts-dalil');
      q.lang = 'en';
      ichki.append(q);
    }
    const english = el('details', '', 'ielts-yuza ielts-ochiladigan');
    const en = el('p', savol.explanation_en, 'ielts-ochiladigan-ichki');
    en.lang = 'en';
    english.append(el('summary', 'Inglizcha izoh'), en);
    ichki.append(english);
    const saqla = tugma('Xato daftariga saqlash');
    const holat = el('span');
    holat.setAttribute('role', 'status');
    saqla.addEventListener('click', () => {
      const id = `${test.module}:${test.id}:${savol.id}`;
      if (xatoniSaqla({ id, modul: test.module, test: test.id, savol: savol.id, tur: savol.type, matn: savol.text, sana: Date.now() })) {
        holat.textContent = 'Xato daftariga saqlandi.';
      } else holat.textContent = 'Brauzerda saqlab bo‘lmadi.';
    });
    ichki.append(saqla, holat);
    qism.append(el('summary', `${raqam}-savol · ${turNomi[savol.type]}`), ichki);
    tahlil.append(qism);
  }
  const amallar = el('div', '', 'ielts-amallar');
  amallar.append(havola('Xato daftarini ochish', daftarYoli(), 'tugma tugma-asosiy'), havola('Testni qayta boshlash', modulYoli(test.module, test.id)), havola('Mashqlarga qaytish', mashqlarYoli()));
  const yonma = el('div', '', 'ielts-natija-tor');
  yonma.append(xulosa, aniqlik);
  root.replaceChildren(sarlavha, yonma, tahlil, ...(transcript ? [transcript] : []), amallar);
}
