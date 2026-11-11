// Matching headings: one <select> per paragraph, options are the group's headings.
import type { Guruh } from '../sxema.ts';
import { RM } from '../../../../data/ielts/readingMatn.ts';
import { qoch, type SavolTuri } from './tur.ts';

const yozuv = (g: Guruh, id: string) => {
  const h = (g.headings ?? []).find((x) => x.id === id);
  return h ? `${h.id}. ${h.text}` : '';
};

export const sarlavha: SavolTuri = {
  type: 'matching-headings',
  render({ savol, guruh, javob, matnId }) {
    const kalit = String(savol.number);
    const variantlar = (guruh.headings ?? [])
      .map((h) => `<option value="${qoch(h.id)}"${javob === h.id ? ' selected' : ''}>${qoch(h.id)}. ${qoch(h.text)}</option>`)
      .join('');
    return `<select class="tanlov" data-savol="${qoch(kalit)}" aria-labelledby="${qoch(matnId)}" lang="en"><option value="">${RM.tanlang}</option>${variantlar}</select>`;
  },
  normalize(xom, _savol, guruh) {
    return typeof xom === 'string' && (guruh.headings ?? []).some((h) => h.id === xom) ? xom : undefined;
  },
  check(savol, javob) {
    return [typeof javob === 'string' && javob === savol.answer];
  },
  berilgan(_savol, javob) {
    return [typeof javob === 'string' && javob !== ''];
  },
  korsat(savol, guruh, javob) {
    return { sizning: [typeof javob === 'string' ? yozuv(guruh, javob) : ''], togri: [yozuv(guruh, String(savol.answer))] };
  },
};
