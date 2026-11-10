// Result page controller: finds the attempt (?urinish=<id>, or the latest one), loads its test
// and hands both to the renderer.
import { RM } from '../../../../data/ielts/readingMatn.ts';
import { yol } from '../../../yol.ts';
import { urinishOmbori } from '../ombor.ts';
import { qoch } from '../turlar/tur.ts';
import { chizNatija } from './natija.ts';
import { READING_YOL, yuklaTest } from './yollar.ts';

export async function ishgaTushirNatija(): Promise<void> {
  const ildiz = document.getElementById('rn');
  if (!ildiz) return;
  const repo = urinishOmbori();
  const param = new URLSearchParams(location.search);
  const id = param.get('urinish');
  const hammasi = repo.urinishlar();
  const urinish = id ? repo.topUrinish(id) : (hammasi[hammasi.length - 1] ?? null);

  if (!urinish) {
    ildiz.innerHTML = `<p class="rn-bosh-xabar">${qoch(id ? RM.natijaYoq : RM.tarixBosh)}</p><div class="rn-amal"><a class="tugma tugma-asosiy" href="${qoch(
      yol(READING_YOL.boshlash),
    )}">${RM.boshlashSahifasi}</a></div>`;
    return;
  }
  const test = await yuklaTest(urinish.testId);
  chizNatija(ildiz, {
    urinish,
    test: typeof test === 'string' ? null : test,
    testHolat: typeof test === 'string' ? test : undefined,
    avto: param.get('avto') === '1',
  });
}
