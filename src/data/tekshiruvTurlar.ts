// Savol tekshirish skripti (scripts/savollarni-tekshir.ts) uchun turlar.
// Har bo'lim src/data/<bolim>Darslar/tekshiruv.ts faylida `tekshiruv` ni eksport qiladi.
import type { DarsBolim, DarsSavol } from './darsTurlar.ts';

/** Ikkinchi usul natijasi: son, (x; y) juftligi yoki to'g'ri variantning aynan matni */
export type Natija = { qiymat: number | [number, number] | string; usul: string };

export interface BolimTekshiruv {
  bolim: DarsBolim;
  /** Jadval sarlavhasi: "<sarlavha>: savollar tekshirish ro'yxati" */
  sarlavha: string;
  savollar: DarsSavol[];
  /** id -> ikkinchi usul. Sonli hisob yo'q joyda: qoida bo'yicha qayta yechib, to'g'ri variant matnini qaytaradi. */
  ikkinchiUsul: Record<string, () => Natija>;
  /** Jadval ustidagi qo'shimcha izoh qatorlari */
  izoh: string[];
}
