// Hisob sahifalari (1-qavat, /uz/hisob/, o'zbekcha). Bitta hisob butun sayt uchun ("bir bino, bitta kalit").
// Yo'llar `src/lib/hisob.ts` dagi `hisobYoli()` bilan bir xil. Qolip: `HisobKarta` (Asosiy ichida).

export type HisobSahifaKalit = 'kirish' | 'royxat' | 'parol-tiklash' | 'profil' | 'callback' | 'rozilik';

/** 2026-11-09 gacha SAT ichida (/uz/sat/hisob/) bo'lgan sahifalar: eski manzillar shularga yo'naltiriladi. */
export const eskiSatHisobSahifalar: HisobSahifaKalit[] = ['kirish', 'royxat', 'parol-tiklash', 'profil'];

export interface HisobSahifaMalumot {
  nomi: string;
  tavsif: string;
}

export const hisobSahifalar: Record<HisobSahifaKalit, HisobSahifaMalumot> = {
  kirish: {
    nomi: 'Kirish',
    tavsif: "Tayanch hisobingizga kiring. Hisob ixtiyoriy: darslar va mashqlar hisobsiz ham ishlaydi.",
  },
  royxat: {
    nomi: "Ro'yxatdan o'tish",
    tavsif: "Email bilan Tayanch hisobini oching. Hisob ixtiyoriy.",
  },
  'parol-tiklash': {
    nomi: 'Parolni tiklash',
    tavsif: "Tayanch hisobingiz uchun yangi parol o'rnatish havolasini oling.",
  },
  profil: {
    nomi: 'Hisobim',
    tavsif: "Tayanch hisobingiz: ism, taxallus va chiqish.",
  },
  // Google'dan qaytish sahifasi (P03B). Supabase Redirect URLs ro'yxatida aniq shu manzil turadi.
  callback: {
    nomi: 'Google orqali kirish',
    tavsif: "Google hisobingiz bilan Tayanch'ga kirish yakunlanmoqda.",
  },
  // Rozilik darvozasi (P03B): Google bilan birinchi kirishda yoki rozilik yozilmagan hisobda.
  rozilik: {
    nomi: 'Rozilik',
    tavsif: "Tayanch hisobidan foydalanishdan oldin Maxfiylik siyosati va Foydalanish shartlariga rozilik.",
  },
};
