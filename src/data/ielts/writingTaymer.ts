// Writing taymeri sozlamasi: vaqt va minimal so'z soni shu yerda, sahifa faqat shundan oladi.
// Manba: ielts.org — tekshirish kerak (raqamlarni muallif rasmiy saytdan tasdiqlaydi).
export type TaymerRejim = 'task1' | 'task2';

export interface TaymerSozlama {
  id: TaymerRejim;
  nomi: string;
  /** Tavsiya etilgan vaqt, daqiqa */
  daqiqa: number;
  /** Minimal so'z soni */
  minSoz: number;
  /** Progress bandi (src/data/progressBandlar.ts QAVAT_BANDLARI.ielts) */
  itemId: `writing-${TaymerRejim}`;
}

export const WRITING_TAYMER: Record<TaymerRejim, TaymerSozlama> = {
  task1: { id: 'task1', nomi: 'Task 1', daqiqa: 20, minSoz: 150, itemId: 'writing-task1' },
  task2: { id: 'task2', nomi: 'Task 2', daqiqa: 40, minSoz: 250, itemId: 'writing-task2' },
};

export const WRITING_TAYMER_MANBA = 'Source: ielts.org (to be checked)';

/** Qoralama faqat shu brauzerda: { rejim, task1: { matn, sarflanganMs }, task2: {...} } */
export const KALIT_WRITING_TAYMER = 'tayanch:ielts-writing-taymer:v1';
