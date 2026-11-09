import { el, havola, soniyaMatni, tugma } from './dom';
import { sozlar, type Chart, type SpeakingTest, type WritingTest } from './test';
import type { Urinish } from './storage';
import type { Yangila } from './testEkrani';
import { mashqlarYoli } from './yollar';

const writing = [
  'Topshiriq talablari bajarilgan va asosiy fikrlar ochilgan.',
  'Xatboshilar tartibli, fikrlar orasidagi bog‘lanish tushunarli.',
  'So‘zlar ma’noga mos va yetarlicha xilma-xil.',
  'Gap tuzilishi, grammatika va imlo tekshirilgan.',
];
const speaking = [
  'Fikrlar izchil va ortiqcha to‘xtalishlarsiz aytildi.',
  'So‘zlar ma’noga mos va yetarlicha xilma-xil.',
  'Sodda hamda murakkab gaplar to‘g‘ri ishlatildi.',
  'Talaffuz, urg‘u va ohangni tushunish oson.',
];

function mezonlar(root: HTMLElement, nomlar: string[], oqi: () => Urinish, yangila: Yangila) {
  const section = el('section', '', 'ielts-yuza ielts-oqim');
  section.append(el('h2', 'O‘zini tekshirish'));
  const royxat = el('ul', '', 'ielts-tekshiruv');
  nomlar.forEach((nom, index) => {
    const li = el('li');
    const input = el('input');
    input.type = 'checkbox';
    input.id = 'mezon-' + index;
    input.checked = Boolean(oqi().belgi[input.id]);
    input.addEventListener('change', () => { yangila((u) => { u.belgi[input.id] = input.checked; }); });
    const label = el('label');
    label.htmlFor = input.id;
    label.append(input, nom);
    li.append(label);
    royxat.append(li);
  });
  section.append(royxat);
  root.append(section);
}

function chartChiz(chart: Chart) {
  const rasm = el('figure', '', 'ielts-diagram');
  rasm.lang = 'en';
  rasm.append(el('figcaption', chart.title + ' · ' + chart.unit + ' (fictional data)'));
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 320 160');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'ielts-chart');
  const max = Math.max(1, ...chart.series.flatMap((s) => s.values));
  const group = 280 / chart.labels.length;
  const wide = group / chart.series.length;
  const axis = document.createElementNS(svg.namespaceURI, 'path');
  axis.setAttribute('d', 'M16 16V130H305');
  axis.setAttribute('class', 'ielts-diagram-yolak');
  svg.append(axis);
  chart.labels.forEach((label, i) => {
    chart.series.forEach((s, seriesIndex) => {
      const n = s.values[i];
      const x = 20 + group * i + wide * seriesIndex;
      const height = n / max * 105;
      const rect = document.createElementNS(svg.namespaceURI, 'rect');
      rect.setAttribute('x', String(x));
      rect.setAttribute('y', String(130 - height));
      rect.setAttribute('width', String(wide - 3));
      rect.setAttribute('height', String(height));
      rect.setAttribute('class', seriesIndex === 0 ? 'ielts-chart-a' : 'ielts-chart-b');
      const t = document.createElementNS(svg.namespaceURI, 'text');
      t.setAttribute('x', String(x + wide / 2));
      t.setAttribute('y', String(126 - height));
      t.setAttribute('text-anchor', 'middle');
      t.textContent = (chart.series.length > 1 ? String.fromCharCode(65 + seriesIndex) + ' ' : '') + n;
      svg.append(rect, t);
    });
    const t = document.createElementNS(svg.namespaceURI, 'text');
    t.setAttribute('x', String(20 + group * i + wide * chart.series.length / 2));
    t.setAttribute('text-anchor', 'middle');
    t.setAttribute('y', '147');
    t.textContent = label;
    svg.append(t);
  });
  const legend = el('ul', '', 'ielts-chart-legend');
  chart.series.forEach((s, i) => legend.append(el('li', String.fromCharCode(65 + i) + ' · ' + s.name)));
  rasm.append(svg, legend);
  const data = el('details');
  data.append(el('summary', 'Chart data'));
  const table = el('table');
  const thead = el('thead');
  const first = el('tr');
  first.append(el('th', 'Category'), ...chart.series.map((s) => el('th', s.name)));
  thead.append(first);
  const tbody = el('tbody');
  chart.labels.forEach((label, i) => {
    const tr = el('tr');
    const row = el('th', label);
    row.scope = 'row';
    tr.append(row, ...chart.series.map((s) => el('td', String(s.values[i]))));
    tbody.append(tr);
  });
  table.append(thead, tbody);
  data.append(table);
  rasm.append(data);
  return rasm;
}

export function ochiqModulChiz(
  root: HTMLElement, test: WritingTest | SpeakingTest, oqi: () => Urinish, yangila: Yangila,
  yakun: boolean, tugat?: () => void,
): () => void {
  root.classList.add('ielts-oqim');
  root.replaceChildren();
  if (test.module === 'writing') {
    const nav = el('div', '', 'ielts-satr');
    const panel = el('div', '', 'ielts-ish-tor');
    root.append(nav, panel);
    const chiz = (i: number) => {
      const task = test.tasks[i];
      const key = 'task-' + (i + 1);
      const prompt = el('section', '', 'ielts-yuza ielts-oqim');
      const text = el('p', task.text);
      text.lang = 'en';
      prompt.append(el('h2', 'Topshiriq'), text);
      if (task.chart) prompt.append(chartChiz(task.chart));
      const answer = el('section', '', 'ielts-yuza ielts-oqim');
      const label = el('label', `Javobingiz · Task ${i + 1}`);
      label.htmlFor = 'writing-javob';
      const field = el('textarea', '', 'ielts-maydon');
      field.id = label.htmlFor;
      field.rows = 13;
      field.maxLength = 30000;
      field.readOnly = yakun;
      const stored = oqi().javoblar[key];
      field.value = typeof stored === 'string' ? stored : '';
      field.lang = 'en';
      const hisob = el('p', '', 'ielts-izoh');
      hisob.id = 'writing-soz';
      field.setAttribute('aria-describedby', hisob.id);
      const hisobla = () => { hisob.textContent = `${sozlar(field.value)} so‘z · kamida ${task.minWords} so‘z`; };
      field.addEventListener('input', () => {
        yangila((u) => { u.javoblar[key] = field.value; });
        hisobla();
      });
      hisobla();
      answer.append(label, field, hisob);
      panel.replaceChildren(prompt, answer);
      [...nav.children].forEach((b, index) => b.setAttribute('aria-pressed', String(i === index)));
    };
    test.tasks.forEach((_, i) => {
      const b = tugma('Task ' + (i + 1));
      b.lang = 'en';
      b.addEventListener('click', () => {
        if (!yakun) yangila((u) => { u.savol = i; });
        chiz(i);
      });
      nav.append(b);
    });
    chiz(Math.min(test.tasks.length - 1, oqi().savol));
    if (yakun) {
      mezonlar(root, writing, oqi, yangila);
      root.append(havola('Mashqlarga qaytish', mashqlarYoli()));
    }
    return () => {};
  }

  if (yakun) {
    root.append(el('h2', 'Speaking mashqi yakunlandi'));
    mezonlar(root, speaking, oqi, yangila);
    root.append(havola('Mashqlarga qaytish', mashqlarYoli()));
    return () => {};
  }

  const qismlar = el('div', '', 'ielts-oqim');
  const yozuv = el('section', '', 'ielts-yuza ielts-oqim');
  root.append(qismlar, yozuv);
  let taymer: ReturnType<typeof setInterval> | undefined;
  test.parts.forEach((part, i) => {
    const section = el('section', '', 'ielts-yuza ielts-oqim');
    const h = el('h2', `Part ${i + 1} · ${part.title}`);
    h.lang = 'en';
    section.append(h);
    if (part.cue) {
      const p = el('p', part.cue);
      p.lang = 'en';
      section.append(p);
    }
    const questions = el('ul');
    questions.lang = 'en';
    part.questions.forEach((q) => questions.append(el('li', q)));
    section.append(questions);
    if (part.prepSeconds) {
      const vaqt = el('p', soniyaMatni(part.prepSeconds));
      vaqt.setAttribute('role', 'timer');
      vaqt.setAttribute('aria-label', 'Tayyorlanish vaqti');
      const holat = el('p');
      holat.setAttribute('role', 'status');
      const start = tugma('Tayyorlanish taymerini boshlash');
      start.addEventListener('click', () => {
        const end = Date.now() + part.prepSeconds! * 1000;
        start.disabled = true;
        holat.textContent = '';
        taymer = setInterval(() => {
          const qoldi = (end - Date.now()) / 1000;
          vaqt.textContent = soniyaMatni(qoldi);
          if (qoldi <= 0) {
            clearInterval(taymer);
            holat.textContent = 'Tayyorlanish vaqti tugadi. Gapirishni boshlang.';
            start.disabled = false;
          }
        }, 200);
      });
      section.append(vaqt, start, holat);
    }
    qismlar.append(section);
  });

  const record = tugma('Ovozni yozishni boshlash', 'tugma tugma-asosiy');
  const player = el('audio');
  player.controls = true;
  player.hidden = true;
  player.setAttribute('aria-label', 'Yozib olingan javob');
  const status = el('p', '', 'ielts-izoh');
  status.setAttribute('role', 'status');
  const yukla = havola('Yozuvni yuklab olish', '#');
  yukla.hidden = true;
  yozuv.append(el('h2', 'Ovozni yozish'), el('p', 'Yozuv shu sahifada saqlanadi. Uni qurilmangizga yuklab olishingiz mumkin.'), record, status, player, yukla);
  mezonlar(root, speaking, oqi, yangila);
  const finish = tugma('Mashqni yakunlash');
  root.append(finish);
  finish.addEventListener('click', () => tugat?.());
  let media: MediaRecorder | undefined;
  let stream: MediaStream | undefined;
  let url: string | undefined;
  let yopildi = false;
  let ovozTaymer: ReturnType<typeof setTimeout> | undefined;
  record.addEventListener('click', async () => {
    if (media?.state === 'recording') { media.stop(); return; }
    record.disabled = true;
    let parts: Blob[] = [];
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (yopildi) { stream.getTracks().forEach((track) => track.stop()); return; }
      media = new MediaRecorder(stream);
      media.ondataavailable = ({ data }) => { if (data.size) parts.push(data); };
      media.onstop = () => {
        clearTimeout(ovozTaymer);
        stream?.getTracks().forEach((track) => track.stop());
        if (yopildi) return;
        if (url) URL.revokeObjectURL(url);
        const type = media?.mimeType || parts[0]?.type || 'audio/webm';
        url = URL.createObjectURL(new Blob(parts, { type }));
        parts = [];
        player.src = url;
        player.hidden = false;
        yukla.href = url;
        yukla.download = 'tayanch-speaking.' + (type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm');
        yukla.hidden = false;
        status.textContent = 'Yozuv tayyor.';
        record.textContent = 'Yangi yozuvni boshlash';
      };
      media.start();
      ovozTaymer = setTimeout(() => { if (media?.state === 'recording') media.stop(); }, 5 * 60 * 1000);
      status.textContent = 'Ovoz yozilmoqda.';
      record.textContent = 'Yozuvni to‘xtatish';
    } catch {
      stream?.getTracks().forEach((track) => track.stop());
      status.textContent = 'Mikrofon ochilmadi. Brauzer ruxsatini va qurilma sozlamalarini tekshiring.';
    } finally { record.disabled = false; }
  });
  return () => {
    yopildi = true;
    clearInterval(taymer);
    clearTimeout(ovozTaymer);
    if (media?.state === 'recording') media.stop();
    stream?.getTracks().forEach((track) => track.stop());
    if (url) URL.revokeObjectURL(url);
  };
}
