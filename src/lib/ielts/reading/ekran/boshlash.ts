// Start page controller: attempt count, "continue" state of an unfinished attempt and history.
import { RM } from '../../../../data/ielts/readingMatn.ts';
import { yol } from '../../../yol.ts';
import { bandMatn } from '../band.ts';
import { urinishOmbori } from '../ombor.ts';
import { qolganMs, vaqtMatn, vaqtTugadi } from '../taymer.ts';
import { qoch } from '../turlar/tur.ts';
import { READING_YOL, sanaMatn } from './yollar.ts';

const TARIX_SONI = 10;
const ONG =
  '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

export function ishgaTushirBoshlash(): void {
  const ildiz = document.getElementById('rb');
  if (!ildiz) return;
  const repo = urinishOmbori();
  const faol = repo.faol();
  const urinishlar = repo.urinishlar();

  const son = document.getElementById('rb-son');
  if (son) son.textContent = String(urinishlar.length);

  // An unfinished attempt: the main button continues it instead of starting a new test.
  const tugma = document.getElementById('rb-boshla');
  const izoh = document.getElementById('rb-davom');
  if (faol && izoh) {
    const hozir = Date.now();
    izoh.textContent = vaqtTugadi(faol.deadline, hozir) ? RM.vaqtOtgan : RM.davomIzoh(vaqtMatn(qolganMs(faol.deadline, hozir)));
    izoh.hidden = false;
    if (tugma instanceof HTMLAnchorElement) {
      tugma.textContent = RM.davomEt;
      tugma.href = yol(READING_YOL.test);
    }
  }

  const tarix = document.getElementById('rb-tarix');
  if (!tarix) return;
  if (urinishlar.length === 0) {
    tarix.innerHTML = `<p class="rn-bosh-xabar">${qoch(RM.tarixBosh)}</p>`;
    return;
  }
  const natija = yol(READING_YOL.natija);
  tarix.innerHTML = `<ol class="rb-tarix">${urinishlar
    .slice(-TARIX_SONI)
    .reverse()
    .map((u) => {
      const jami = Object.values(u.perTypeStats).reduce((n, x) => n + (x?.jami ?? 0), 0);
      return `<li><a href="${qoch(natija)}?urinish=${encodeURIComponent(u.id)}"><span class="ball">${qoch(
        RM.tarixQator(u.raw, jami, bandMatn(u.band, RM.bandPast)),
      )}</span><span class="sana">${qoch(sanaMatn(u.finishedAt))}</span>${ONG}</a></li>`;
    })
    .join('')}</ol>`;
}
