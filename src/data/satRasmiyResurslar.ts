// SAT sahifalaridagi "Official resources" bo'limi uchun umumiy ro'yxat (P11 test tracker, P16 bilan umumiy).
// Faqat manbalar.ts dagi rasmiy ID'lar: nom, havola va tekshirilgan sana o'sha yerdan olinadi.
// izoh: sahifada ko'rinadigan inglizcha qisqa tavsif (fakt emas, nima uchun havola ekanligi).
export interface SatRasmiyResurs {
  id: string;
  izoh: string;
}

export const satRasmiyResurslar: SatRasmiyResurs[] = [
  { id: 'CB01', izoh: 'Full-length practice tests in the Bluebook™ app. Log your scores and mistakes here after each one.' },
  { id: 'CB02', izoh: 'The College Board list of official study and practice materials.' },
  { id: 'CB07', izoh: 'The SAT® home page: registration, test dates and score reports.' },
];
