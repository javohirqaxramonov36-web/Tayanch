// Multiple choice: one answer (radio) or "Choose TWO" (two checkboxes, two question numbers).
import { savolKaliti, savolRaqamlari, type Savol } from '../sxema.ts';
import { RM } from '../../../../data/ielts/readingMatn.ts';
import { qoch, type Javob, type SavolTuri } from './tur.ts';

const ikkita = (s: Savol) => s.choose === 2;
const idlar = (s: Savol) => (s.options ?? []).map((o) => o.id);
const yozuv = (s: Savol, id: string) => {
  const o = (s.options ?? []).find((x) => x.id === id);
  return o ? `${o.id}. ${o.text}` : '';
};

/**
 * "Choose TWO" slots. Each correct letter is worth one point and order does not matter:
 * a chosen correct letter fills its own slot, a chosen wrong letter fills a slot that is left.
 */
function ikkitaJoy(savol: Savol, javob: Javob | undefined): { tanlangan: string; togri: string; ball: boolean }[] {
  const togri = (Array.isArray(savol.answer) ? savol.answer : [savol.answer]).slice().sort();
  const tanlov = Array.isArray(javob) ? javob.filter((x) => idlar(savol).includes(x)).slice(0, togri.length) : [];
  const notogri = tanlov.filter((x) => !togri.includes(x));
  return togri.map((t) => {
    if (tanlov.includes(t)) return { tanlangan: t, togri: t, ball: true };
    return { tanlangan: notogri.shift() ?? '', togri: t, ball: false };
  });
}

export const mcq: SavolTuri = {
  type: 'mcq',
  render({ savol, javob, matnId }) {
    const kalit = savolKaliti(savol);
    const kop = ikkita(savol);
    const tanlangan = (id: string) => (kop ? Array.isArray(javob) && javob.includes(id) : javob === id);
    const variantlar = (savol.options ?? [])
      .map(
        (o) =>
          `<label class="variant"><input type="${kop ? 'checkbox' : 'radio'}" name="s-${qoch(kalit)}" value="${qoch(o.id)}" data-savol="${qoch(
            kalit,
          )}"${tanlangan(o.id) ? ' checked' : ''} /><span class="harf" aria-hidden="true">${qoch(o.id)}</span><span lang="en"><span class="ekranda-yoq">${qoch(
            o.id,
          )}. </span>${qoch(o.text)}</span></label>`,
      )
      .join('');
    const izoh = kop ? `<p class="savol-izoh" id="${qoch(matnId)}-izoh">${RM.ikkitaTanla}</p>` : '';
    return `${izoh}<div class="variantlar" role="${kop ? 'group' : 'radiogroup'}" aria-labelledby="${qoch(matnId)}"${
      kop ? ` aria-describedby="${qoch(matnId)}-izoh" data-chegara="2"` : ''
    }>${variantlar}</div>`;
  },
  normalize(xom, savol) {
    const bor = idlar(savol);
    if (ikkita(savol)) {
      const r = (Array.isArray(xom) ? xom : []).filter((x): x is string => typeof x === 'string' && bor.includes(x));
      const toza = [...new Set(r)].slice(0, 2).sort();
      return toza.length > 0 ? toza : undefined;
    }
    return typeof xom === 'string' && bor.includes(xom) ? xom : undefined;
  },
  check(savol, javob) {
    if (ikkita(savol)) return ikkitaJoy(savol, javob).map((j) => j.ball);
    return [typeof javob === 'string' && javob === savol.answer];
  },
  berilgan(savol, javob) {
    if (ikkita(savol)) {
      const n = Array.isArray(javob) ? javob.length : 0;
      return savolRaqamlari(savol).map((_r, i) => n > i);
    }
    return [typeof javob === 'string' && javob !== ''];
  },
  korsat(savol, _guruh, javob) {
    if (ikkita(savol)) {
      const joy = ikkitaJoy(savol, javob);
      return { sizning: joy.map((j) => yozuv(savol, j.tanlangan)), togri: joy.map((j) => yozuv(savol, j.togri)) };
    }
    return { sizning: [typeof javob === 'string' ? yozuv(savol, javob) : ''], togri: [yozuv(savol, String(savol.answer))] };
  },
};
