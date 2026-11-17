// Gap-fill: a text input. Case and extra spaces are ignored; more words than `wordLimit` is wrong.
import { RM } from '../../../../data/ielts/readingMatn.ts';
import { boshliqTogri } from '../normallash.ts';
import { qoch, type SavolTuri } from './tur.ts';

export const boshliq: SavolTuri = {
  type: 'gap-fill',
  render({ savol, javob, matnId }) {
    const kalit = String(savol.number);
    const limit = typeof savol.wordLimit === 'number' ? `<span class="savol-izoh" id="${qoch(matnId)}-izoh">${RM.sozLimit(savol.wordLimit)}</span>` : '';
    return `<div class="boshliq"><input class="maydon" type="text" data-savol="${qoch(kalit)}" value="${qoch(
      typeof javob === 'string' ? javob : '',
    )}" aria-labelledby="${qoch(matnId)}"${
      limit ? ` aria-describedby="${qoch(matnId)}-izoh"` : ''
    } maxlength="80" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" lang="en" placeholder="${RM.javobYoz}" />${limit}</div>`;
  },
  normalize(xom) {
    // The raw text is kept as typed (trimmed); comparison rules live in normallash.ts.
    const t = typeof xom === 'string' ? xom.replace(/\s+/g, ' ').trim().slice(0, 80) : '';
    return t === '' ? undefined : t;
  },
  check(savol, javob) {
    return [typeof javob === 'string' && boshliqTogri(javob, savol)];
  },
  berilgan(_savol, javob) {
    return [typeof javob === 'string' && javob.trim() !== ''];
  },
  korsat(savol, _guruh, javob) {
    const togri = [savol.answer, ...(savol.acceptedAnswers ?? [])].filter((x): x is string => typeof x === 'string');
    return { sizning: [typeof javob === 'string' ? javob : ''], togri: [togri.join(' / ')] };
  },
};
