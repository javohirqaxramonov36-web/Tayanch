// Result screen renderer: summary, estimated band, accuracy per question type, error analysis,
// next step and the per-question review with evidence shown inside the passage.
// Used by the result page and, when storage is unavailable, by the test page itself.
import { RM, TUR_NOMI } from '../../../../data/ielts/readingMatn.ts';
import { yol } from '../../../yol.ts';
import { baholash, engZaifTur, type Baho, type SavolNatija } from '../ball.ts';
import { bandMatn } from '../band.ts';
import { SAVOL_TURLARI, type ReadingTest } from '../sxema.ts';
import { qoch } from '../turlar/tur.ts';
import { TAVSIYA_CHEGARA, tavsiyaTanla, type Urinish } from '../urinish.ts';
import { READING_YOL } from './yollar.ts';

export interface NatijaSozlama {
  urinish: Urinish;
  /** null when the test could not be loaded: only the stored summary is shown */
  test: ReadingTest | null;
  /** why `test` is null */
  testHolat?: 'yoq' | 'xato';
  /** the attempt was submitted automatically when time ran out */
  avto?: boolean;
  /** the attempt could not be saved in the browser */
  saqlanmagan?: boolean;
}

const svg = (shakl: string, olcham = 16) =>
  `<svg aria-hidden="true" width="${olcham}" height="${olcham}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${shakl}</svg>`;
const IK = {
  togri: svg('<path d="M5 12l5 5L20 7"/>'),
  xato: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  bosh: svg('<path d="M5 12h14"/>'),
  ok: svg('<path d="M6 9l6 6 6-6"/>', 18),
  ong: svg('<path d="M9 6l6 6-6 6"/>', 20),
  yop: svg('<path d="M6 6l12 12M18 6L6 18"/>', 20),
};

function sarflanganDaqiqa(u: Urinish): number {
  const ms = new Date(u.finishedAt).getTime() - new Date(u.startedAt).getTime();
  return Number.isFinite(ms) ? Math.max(1, Math.round(ms / 60_000)) : 0;
}

function holatHtml(q: SavolNatija): string {
  if (q.togri) return `<span class="rn-holat togri">${IK.togri}${RM.holatTogri}</span>`;
  if (!q.berilgan) return `<span class="rn-holat bosh">${IK.bosh}${RM.holatBosh}</span>`;
  return `<span class="rn-holat xato">${IK.xato}${RM.holatXato}</span>`;
}

function savolHtml(q: SavolNatija, tushuntirishTili: string): string {
  const sizning = q.berilgan && q.sizning ? `<span lang="en">${qoch(q.sizning)}</span>` : RM.javobsiz;
  return `<li data-togri="${q.togri ? '1' : '0'}"><details>
<summary><span class="savol-raqam">${q.number}</span>${holatHtml(q)}<span class="rn-tur">${qoch(TUR_NOMI[q.type])}</span><span class="rn-ok">${IK.ok}</span></summary>
<div class="rn-tana">
<p class="rn-prompt" lang="en">${qoch(q.prompt)}</p>
<dl>
<div><dt>${RM.sizning}</dt><dd>${sizning}</dd></div>
<div><dt>${RM.togriJavob}</dt><dd><span lang="en">${qoch(q.togriJavob)}</span></dd></div>
<div><dt>${RM.tushuntirish}</dt><dd><span lang="${tushuntirishTili}">${qoch(q.explanation)}</span></dd></div>
<div><dt>${RM.dalil} (${qoch(RM.paragraf(q.evidence.paragraph))})</dt><dd><blockquote lang="en">${qoch(q.evidence.quote)}</blockquote><button type="button" class="tugma tugma-ikkinchi" data-kor="${q.number}">${RM.matndaKor}</button></dd></div>
</dl>
</div>
</details></li>`;
}

function tahlilHtml(u: Urinish, baho: Baho | null): string {
  const qatorlar: string[] = [];
  const zaif = engZaifTur(u.perTypeStats);
  const stat = zaif ? u.perTypeStats[zaif.type] : undefined;
  if (zaif && stat && zaif.ulush < 1) qatorlar.push(RM.tahlilZaif(TUR_NOMI[zaif.type], stat.togri, stat.jami));
  if (zaif && zaif.ulush >= 1) qatorlar.push(RM.tahlilXatoYoq);
  else if (zaif && zaif.ulush >= TAVSIYA_CHEGARA) qatorlar.push(RM.tahlilYaxshi);
  if (baho) {
    if (baho.javobsiz > 0) qatorlar.push(RM.tahlilJavobsiz(baho.javobsiz));
    if (baho.passageStat.length > 1) baho.passageStat.forEach((p, i) => qatorlar.push(RM.tahlilPassage(i + 1, p.togri, p.jami)));
  }
  return `<ul class="rn-tahlil">${qatorlar.map((q) => `<li>${qoch(q)}</li>`).join('')}</ul>`;
}

/** Fills `ildiz` with the result of one attempt and wires its buttons. */
export function chizNatija(ildiz: HTMLElement, s: NatijaSozlama): void {
  const { urinish: u, test } = s;
  const baho = test ? baholash(test, u.answers) : null;
  const jami = Object.values(u.perTypeStats).reduce((n, x) => n + (x?.jami ?? 0), 0) || (baho?.jami ?? 0);
  const band = bandMatn(u.band, RM.bandPast);
  const daqiqa = sarflanganDaqiqa(u);
  const tavsiya = tavsiyaTanla(u.perTypeStats);
  const boshlash = yol(READING_YOL.boshlash);

  const xabarlar = [
    s.avto ? RM.avtoYakun : '',
    s.saqlanmagan ? RM.natijaSaqlanmadi : '',
    !test ? (s.testHolat === 'xato' ? RM.testXato : RM.testTopilmadi) : '',
  ].filter(Boolean);

  const turlar = SAVOL_TURLARI.filter((t) => (u.perTypeStats[t]?.jami ?? 0) > 0)
    .map((t) => {
      const st = u.perTypeStats[t]!;
      const foiz = Math.round((st.togri / st.jami) * 100);
      return `<li><span class="nom">${qoch(TUR_NOMI[t])}</span><span class="son">${qoch(RM.ulush(st.togri, st.jami))} · ${foiz}%</span><span class="rn-chiziq" aria-hidden="true"><span style="--ulush:${foiz}%"></span></span></li>`;
    })
    .join('');

  ildiz.innerHTML = `
<section aria-labelledby="rn-xulosa-h">
<h2 id="rn-xulosa-h" class="ekranda-yoq">${RM.natijaSarlavha}</h2>
${test ? `<p class="rn-test" lang="en">${qoch(test.title)}</p>` : ''}
${xabarlar.map((x) => `<p class="rn-xabar">${qoch(x)}</p>`).join('')}
<dl class="rn-raqamlar">
<div><dt>${RM.xomBall}</dt><dd>${u.raw}<small> / ${jami}</small></dd></div>
<div><dt>${RM.taxminiyBand}</dt><dd${u.band === null ? ' class="kichik"' : ''}>${qoch(band)}</dd></div>
<div><dt>${RM.sarflangan}</dt><dd class="kichik">${qoch(RM.daqiqa(daqiqa))}</dd></div>
</dl>
<p class="rn-izoh">${qoch(RM.bandIzoh)}</p>
</section>
<section aria-labelledby="rn-tur-h"><h2 id="rn-tur-h">${RM.turlar}</h2><ul class="rn-turlar">${turlar}</ul></section>
<section aria-labelledby="rn-tahlil-h"><h2 id="rn-tahlil-h">${RM.tahlil}</h2>${tahlilHtml(u, baho)}</section>
<section aria-labelledby="rn-qadam-h"><h2 id="rn-qadam-h">${RM.keyingiQadam}</h2>
<a class="rn-qadam" href="${qoch(yol(tavsiya.manzil))}"><strong>${qoch(tavsiya.sarlavha)}</strong><span>${qoch(tavsiya.izoh)}</span>${IK.ong}</a>
${tavsiya.zaifTur ? `<div class="rn-amal"><a class="tugma tugma-ikkinchi" href="${qoch(boshlash)}">${RM.yangiTest}</a></div>` : ''}
</section>
${
  baho
    ? `<section aria-labelledby="rn-savol-h"><h2 id="rn-savol-h">${RM.savollar}</h2>
<div class="rn-filtr" role="group" aria-label="${qoch(RM.filtr)}"><button type="button" data-filtr="hammasi" aria-pressed="true">${RM.filtrHammasi}</button><button type="button" data-filtr="xato" aria-pressed="false">${RM.filtrXato}</button></div>
<ol class="rn-savollar">${baho.qatorlar.map((q) => savolHtml(q, test?.explanationLang ?? 'en')).join('')}</ol>
<p class="rn-bosh-xabar" data-xato-yoq hidden>${RM.xatoQolmadi}</p>
</section>
<dialog class="rt-dialog rn-matn" aria-labelledby="rn-matn-h">
<div class="rn-matn-bosh"><h2 id="rn-matn-h" lang="en"></h2><button type="button" class="rn-matn-yop" aria-label="${qoch(RM.yopish)}">${IK.yop}</button></div>
<div class="rn-matn-ichi"></div>
</dialog>`
    : ''
}`;

  if (!baho || !test) return;

  // Filter: all questions, or only wrong and unanswered ones.
  const royxat = ildiz.querySelector<HTMLElement>('.rn-savollar')!;
  const xatoYoq = ildiz.querySelector<HTMLElement>('[data-xato-yoq]')!;
  const filtrlar = [...ildiz.querySelectorAll<HTMLButtonElement>('[data-filtr]')];
  filtrlar.forEach((tugma) =>
    tugma.addEventListener('click', () => {
      const faqatXato = tugma.dataset.filtr === 'xato';
      filtrlar.forEach((t) => t.setAttribute('aria-pressed', String(t === tugma)));
      let korinadi = 0;
      royxat.querySelectorAll<HTMLElement>(':scope > li').forEach((li) => {
        li.hidden = faqatXato && li.dataset.togri === '1';
        if (!li.hidden) korinadi += 1;
      });
      royxat.hidden = korinadi === 0;
      xatoYoq.hidden = korinadi !== 0;
    }),
  );

  // "Show in text": the passage opens in a dialog with the evidence highlighted and focused.
  const dialog = ildiz.querySelector<HTMLDialogElement>('.rn-matn')!;
  const sarlavha = dialog.querySelector<HTMLElement>('#rn-matn-h')!;
  const ichi = dialog.querySelector<HTMLElement>('.rn-matn-ichi')!;
  let chaqirgan: HTMLElement | null = null;

  // Focus goes back inside this function, not in a "close" listener: a scripted close() does not
  // always fire the event.
  const yop = () => {
    if (dialog.open) dialog.close();
    chaqirgan?.focus();
    chaqirgan = null;
  };
  dialog.querySelector('.rn-matn-yop')!.addEventListener('click', yop);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) yop();
  });

  royxat.addEventListener('click', (e) => {
    const tugma = (e.target as HTMLElement).closest<HTMLElement>('[data-kor]');
    if (!tugma) return;
    const q = baho.qatorlar.find((x) => String(x.number) === tugma.dataset.kor);
    const passage = q ? test.passages[q.passageTartib] : undefined;
    if (!q || !passage) return;
    sarlavha.textContent = passage.title;
    ichi.innerHTML = passage.paragraphs
      .map((p) => {
        let matn = qoch(p.text);
        const joy = p.label === q.evidence.paragraph ? p.text.indexOf(q.evidence.quote) : -1;
        if (joy >= 0) {
          matn = `${qoch(p.text.slice(0, joy))}<mark tabindex="-1">${qoch(q.evidence.quote)}</mark>${qoch(p.text.slice(joy + q.evidence.quote.length))}`;
        }
        return `<p class="rt-par" lang="en"><b class="rt-par-harf">${qoch(p.label)}</b><span>${matn}</span></p>`;
      })
      .join('');
    chaqirgan = tugma;
    dialog.showModal();
    const belgi = ichi.querySelector<HTMLElement>('mark');
    if (belgi) {
      belgi.focus({ preventScroll: true });
      belgi.scrollIntoView({ block: 'center' });
    }
  });
}
