// EYUF (El-Yurt Umidi) yon panel guruhlari (2026-11-21, ustki bo'limlar menyusi PR'i).
// Faqat saytda bor sahifalar (src/pages/uz/eyuf/). Yangi sahifa qo'shilsa, shu yerga ham yoziladi.
import type { TaGuruh } from './topAdmissionSahifalar';

export const eyufGuruhlar: TaGuruh[] = [
  {
    nomi: 'Tayyorgarlik',
    bandlar: [
      { nomi: 'Hujjatlar va esse', href: 'eyuf/tayyorgarlik/' },
      { nomi: 'Tayyorgarlik rejasi', href: 'eyuf/reja/' },
      { nomi: 'Kurslar', href: 'eyuf/kurslar/' },
    ],
  },
  {
    nomi: 'Test',
    bandlar: [
      { nomi: 'IQ test', href: 'eyuf/iq/' },
      { nomi: 'IQ trenajyor', href: 'eyuf/trenajyor/' },
    ],
  },
  {
    nomi: 'Suhbat',
    bandlar: [
      { nomi: 'Suhbatga tayyorgarlik', href: 'eyuf/suhbat/' },
      { nomi: 'Soha treklari', href: 'eyuf/soha/' },
    ],
  },
  {
    nomi: 'Natija',
    bandlar: [{ nomi: 'Natija va keyingi qadamlar', href: 'eyuf/natija/' }],
  },
];
