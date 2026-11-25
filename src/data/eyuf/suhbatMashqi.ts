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

export const suhbatSavollari: SuhbatSavol[] = [
  { id: 'namuna-1', savol: 'NAMUNA: bu yerga 1-savol matni yoziladi.', mavzu: 'NAMUNA', namuna: true },
  { id: 'namuna-2', savol: 'NAMUNA: bu yerga 2-savol matni yoziladi.', mavzu: 'NAMUNA', namuna: true },
  { id: 'namuna-3', savol: 'NAMUNA: bu yerga 3-savol matni yoziladi.', mavzu: 'NAMUNA', namuna: true },
];
