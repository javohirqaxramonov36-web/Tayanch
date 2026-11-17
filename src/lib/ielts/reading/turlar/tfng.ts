// True / False / Not Given: three radio buttons.
import { TFNG_JAVOBLAR } from '../sxema.ts';
import { qoch, type SavolTuri } from './tur.ts';

const tozala = (x: unknown) => (typeof x === 'string' ? x.trim().toUpperCase().replace(/\s+/g, ' ') : '');

export const tfng: SavolTuri = {
  type: 'tfng',
  render({ savol, javob, matnId }) {
    const kalit = String(savol.number);
    return `<div class="variantlar qator" role="radiogroup" aria-labelledby="${qoch(matnId)}">${TFNG_JAVOBLAR.map(
      (v) =>
        `<label class="variant"><input type="radio" name="s-${qoch(kalit)}" value="${v}" data-savol="${qoch(kalit)}"${
          javob === v ? ' checked' : ''
        } /><span lang="en">${v}</span></label>`,
    ).join('')}</div>`;
  },
  normalize(xom) {
    const t = tozala(xom);
    return (TFNG_JAVOBLAR as readonly string[]).includes(t) ? t : undefined;
  },
  check(savol, javob) {
    return [typeof javob === 'string' && tozala(javob) === savol.answer];
  },
  berilgan(_savol, javob) {
    return [typeof javob === 'string' && javob !== ''];
  },
  korsat(savol, _guruh, javob) {
    return { sizning: [typeof javob === 'string' ? javob : ''], togri: [String(savol.answer)] };
  },
};
