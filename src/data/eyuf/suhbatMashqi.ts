// EYUF "Suhbat mashqi" savollari (/uz/eyuf/suhbat-mashqi/). Savollarni muallif yozadi.
// Hozir faqat 3 ta NAMUNA qator: haqiqiy savollar qo'shilganda namuna: true qatorlarni o'chiring.
// id takrorlanmasin (sahifa ketma-ket bir xil id chiqarmaydi).

export interface SuhbatSavol {
  id: string;
  savol: string;
  mavzu: string;
  /** true bo'lsa ekranda "Namuna" yorlig'i chiqadi. */
  namuna?: boolean;
}

/** Progress: har SUHBAT_QADAM ta tugagan mashq = bitta band (suhbat-1 = 5 mashq, suhbat-10 = 50 mashq). */
export const SUHBAT_QADAM = 5;
export const SUHBAT_BAND_SONI = 10;
export const suhbatBandi = (n: number) => `suhbat-${n}`;
export const suhbatBandlari = Array.from({ length: SUHBAT_BAND_SONI }, (_, i) => suhbatBandi(i + 1));

export const suhbatSavollari: SuhbatSavol[] = [
  { id: 'namuna-1', savol: 'NAMUNA: bu yerga 1-savol matni yoziladi.', mavzu: 'NAMUNA', namuna: true },
  { id: 'namuna-2', savol: 'NAMUNA: bu yerga 2-savol matni yoziladi.', mavzu: 'NAMUNA', namuna: true },
  { id: 'namuna-3', savol: 'NAMUNA: bu yerga 3-savol matni yoziladi.', mavzu: 'NAMUNA', namuna: true },
];
