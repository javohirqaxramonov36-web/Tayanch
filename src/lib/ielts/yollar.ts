import { yol } from '../yol';
import type { Modul } from './test';

export const mashqlarYoli = () => yol('/uz/ielts/mashq/');
export const modulYoli = (modul: Modul, id?: string, qayta?: string) => {
  const manzil = yol(`/uz/ielts/mashq/${modul}/`);
  if (!id) return manzil;
  const params = new URLSearchParams({ test: id });
  if (qayta) params.set('qayta', qayta);
  return manzil + '?' + params;
};
export const jsonYoli = (modul: Modul, id: string) => yol(`/data/ielts/${modul}/${id}.json`);
export const natijaYoli = (id: string) => yol('/uz/ielts/vosita/natijalar/') + '?' + new URLSearchParams({ urinish: id });
export const daftarYoli = () => yol('/uz/ielts/vosita/xato-daftari/');
