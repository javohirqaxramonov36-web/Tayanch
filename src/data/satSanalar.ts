// Rasmiy SAT Weekend sanalari (CB14, College Board "SAT Suite Test Dates and Deadlines").
// Sahifada: "These test dates and deadlines apply to all students—U.S. and international—taking the SAT".
// Faqat tasdiqlangan 2026–27 jadvali. 2027–28 sanalari sahifada "anticipated" (taxminiy), shuning uchun kiritilmagan.
// Sanalar sahifa HTML'ida so'zma-so'z tekshirildi (2026-11-11, HTTP 200). O'tgan sanalar ekranda chiqmaydi.
// O'zbekistondagi test markazlarida har bir sana bormi: tekshirilmagan (ro'yxatdan o'tishda ko'rinadi).

export interface SatSana {
  /** Imtihon kuni, YYYY-MM-DD */
  sana: string;
  /** Registration Deadline */
  royxat: string;
  /** Deadline for Changes, Regular Cancellation, and Late Registration */
  kechRoyxat: string;
}

export const satSanalar = {
  manbaId: 'CB14',
  tekshirilganSana: '2026-11-11',
  keyingiTekshiruv: '2026-12-11',
  sanalar: [
    { sana: '2026-10-03', royxat: '2026-09-18', kechRoyxat: '2026-09-22' },
    { sana: '2026-11-07', royxat: '2026-10-23', kechRoyxat: '2026-10-27' },
    { sana: '2026-12-05', royxat: '2026-11-20', kechRoyxat: '2026-11-24' },
    { sana: '2027-03-06', royxat: '2027-02-19', kechRoyxat: '2027-02-23' },
    { sana: '2027-05-01', royxat: '2027-04-16', kechRoyxat: '2027-04-20' },
    { sana: '2027-06-05', royxat: '2027-05-21', kechRoyxat: '2027-05-25' },
  ] satisfies SatSana[],
} as const;
