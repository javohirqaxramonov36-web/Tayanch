// Huquqiy sahifalar (P23, 2026-11-11). Muallif qarori (A variant): asosiy matn o'zbekcha, 1-qavatda (hisob butun sayt uchun);
// SAT bo'limi uchun inglizcha nusxa /uz/sat/huquqiy/<kalit>/ da. Hamma matn QORALAMA: muallif va yurist tasdiqlaydi.
// Google OAuth consent ekrani uchun ommaviy manzillar: maxfiylik va shartlar (o'zbekcha manzil o'zgarmaydi).
// Footer (1-qavat) va SatEslatma (SAT) havolalari shu ro'yxatdan olinadi.

export type HuquqiyKalit = 'maxfiylik' | 'shartlar' | 'oferta' | 'qaytarish' | 'saqlash' | 'aloqa';

export interface HuquqiySahifa {
  kalit: HuquqiyKalit;
  /** 1-qavat, o'zbekcha (asosiy matn) */
  uz: { yol: string; nomi: string; qisqa: string };
  /** SAT, inglizcha nusxa */
  en: { yol: string; nomi: string; qisqa: string };
}

const sahifa = (kalit: HuquqiyKalit, uz: [string, string], en: [string, string]): HuquqiySahifa => ({
  kalit,
  uz: { yol: `/uz/${kalit}/`, nomi: uz[0], qisqa: uz[1] },
  en: { yol: `/uz/sat/huquqiy/${kalit}/`, nomi: en[0], qisqa: en[1] },
});

export const huquqiySahifalar: HuquqiySahifa[] = [
  sahifa('maxfiylik', ['Maxfiylik siyosati', 'Maxfiylik'], ['Privacy Policy', 'Privacy']),
  sahifa('shartlar', ['Foydalanish shartlari', 'Shartlar'], ['Terms of Use', 'Terms']),
  sahifa('oferta', ['Ommaviy oferta', 'Oferta'], ['Public Offer', 'Public Offer']),
  sahifa('qaytarish', ["Pulni qaytarish siyosati", 'Qaytarish'], ['Refund Policy', 'Refunds']),
  sahifa('saqlash', ["Brauzerda saqlash va cookie", 'Saqlash va cookie'], ['Storage and Cookies', 'Storage and cookies']),
  sahifa('aloqa', ['Aloqa', 'Aloqa'], ['Contact', 'Contact']),
];

export const huquqiy = (kalit: HuquqiyKalit): HuquqiySahifa => {
  const s = huquqiySahifalar.find((x) => x.kalit === kalit);
  if (!s) throw new Error(`huquqiySahifalar: ${kalit} topilmadi`);
  return s;
};

/**
 * Muallif va yurist javobi kutilayotgan joylar. Qiymat null bo'lsa sahifada "tekshirish kerak" izohi chiqadi,
 * o'ylab topilgan qiymat yozilmaydi (CLAUDE.md: uydirma yo'q). Javob kelganda shu yerda to'ldiriladi.
 */
export const huquqiyOchiq = {
  /** Sotuvchi (YaTT yoki MChJ) nomi, STIR, manzil: oferta uchun. */
  sotuvchi: null as null | { nomi: string; stir: string; manzil: string },
  /** Ommaviy murojaat emaili (Aloqa sahifasi). */
  aloqaEmail: null as string | null,
  /** Pulni qaytarish muddati (kun) va shartlari. */
  qaytarishKun: null as number | null,
  /** 12–17 yoshlilar to'lovi: 'ota-ona' (ota-ona/vasiy roziligi va to'lovi) yoki 'faqat-18' (to'lov 18+). */
  voyagaYetmaganTolov: null as null | 'ota-ona' | 'faqat-18',
  /** Hisob o'chirilganda to'lov yozuvi qancha saqlanadi (yil): buxgalter/yurist javobi. */
  tolovSaqlashYil: null as number | null,
} as const;
