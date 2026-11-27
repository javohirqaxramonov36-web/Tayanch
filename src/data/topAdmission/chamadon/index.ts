// Hujjat chamadoni (2-qavat): yo'nalishlar va ularning hujjat ro'yxati.
// Har yo'nalish alohida JSON (shu papkada). Yangi yo'nalish: JSON qo'shib, pastdagi YONALISHLAR ga import qiling.
// Ro'yxatni faqat muallif rasmiy saytdan to'ldiradi; namuna qatorlarda manba_url va tekshirilgan_sana bo'sh.
import { manbalar } from '../../manbalar';
import stipendiumHungaricum from './stipendium-hungaricum.json';
import turkiyeBurslari from './turkiye-burslari.json';

export interface ChamadonHujjat {
  id: string;
  nomi: string;
  izoh: string;
  /** Bo'sh bo'lsa ekranda "tekshirish kerak" */
  manba_url: string;
  /** YYYY-MM-DD; bo'sh bo'lsa ekranda "tekshirish kerak" */
  tekshirilgan_sana: string;
}

export interface ChamadonYonalish {
  id: string;
  nomi: string;
  /** manbalar.ts dagi rasmiy sayt yozuvi */
  rasmiy_manba_id: string;
  hujjatlar: ChamadonHujjat[];
}

const YONALISHLAR: ChamadonYonalish[] = [stipendiumHungaricum, turkiyeBurslari];

const SANA = /^\d{4}-\d{2}-\d{2}$/;

// Build vaqtida tekshiruv: maydon yo'q yoki noto'g'ri bo'lsa build to'xtaydi.
for (const y of YONALISHLAR) {
  if (!y.id || !y.nomi) throw new Error(`Hujjat chamadoni: yo'nalish id/nomi bo'sh (${y.id})`);
  if (!manbalar.some((m) => m.id === y.rasmiy_manba_id)) throw new Error(`Hujjat chamadoni: ${y.id} uchun manba ${y.rasmiy_manba_id} topilmadi`);
  const idlar = new Set<string>();
  for (const h of y.hujjatlar) {
    for (const k of ['id', 'nomi', 'izoh', 'manba_url', 'tekshirilgan_sana'] as const) {
      if (typeof h[k] !== 'string') throw new Error(`Hujjat chamadoni: ${y.id}/${h.id} da "${k}" yo'q`);
    }
    if (!h.id || idlar.has(h.id)) throw new Error(`Hujjat chamadoni: ${y.id} da id bo'sh yoki takror (${h.id})`);
    idlar.add(h.id);
    if (h.manba_url && !/^https:\/\//.test(h.manba_url)) throw new Error(`Hujjat chamadoni: ${h.id} manba_url https bilan boshlanmaydi`);
    if (h.tekshirilgan_sana && !SANA.test(h.tekshirilgan_sana)) throw new Error(`Hujjat chamadoni: ${h.id} sanasi YYYY-MM-DD emas`);
  }
}

export const chamadonYonalishlari = YONALISHLAR;
