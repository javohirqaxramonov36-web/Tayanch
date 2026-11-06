// "Ariza zinapoyasi" darsi sahnasi uchun ariza yo'llari. Pog'onalar pastdan tepaga, to'g'ri tartibda.
// Asos: src/data/topshirishYoli.ts dagi qadamlar (Topshirish yo'li vositasi).
// Türkiye Bursları: tartib va sanalar rasmiy kalendardan (TB01).
// Common App va UCAS: pog'onalar tartibi Tayanch tavsiyasi (rasmiy ketma-ketlik emas); `kerak` = qaysi pog'onaga tayanadi.
// Pog'ona ichidagi fakt faqat `manbaId` bilan (manbalar.ts, "rasmiy").
// Bu fayl hech narsani import qilmaydi: tekshiruv.ts uni node bilan to'g'ridan-to'g'ri o'qiydi.

export interface Pogona {
  id: string;
  /** Kartadagi qisqa nom */
  matn: string;
  /** Nega aynan shu joyda turadi */
  sabab: string;
  /** Oldin bajarilishi kerak bo'lgan pog'onalar (Common App, UCAS) */
  kerak: string[];
  /** TB01: bosqich boshlanadigan oy (1–12), tartibni sana bo'yicha tekshirish uchun */
  oy?: number;
  manbaId?: string;
}

export interface Zinapoya {
  id: 'turkiye' | 'commonapp' | 'ucas';
  nomi: string;
  /** Topshirish yo'li (tayanch-topshirish-yoli) dagi davlat javobi */
  davlat: string;
  pogonalar: Pogona[];
}

export const zinapoyalar: Zinapoya[] = [
  {
    id: 'turkiye',
    nomi: 'Türkiye Bursları',
    davlat: 'turkiya',
    pogonalar: [
      { id: 'ariza', matn: 'Portalda ariza: 10-yanvar – 20-fevral', sabab: 'Kalendardagi birinchi bosqich: ariza oynasi.', kerak: [], oy: 1, manbaId: 'TB01' },
      { id: 'baholash', matn: 'Baholash: mart–aprel', sabab: "Ariza oynasi yopilgach, kelgan arizalar ko'rib chiqiladi.", kerak: ['ariza'], oy: 3, manbaId: 'TB01' },
      { id: 'intervyu', matn: 'Intervyu: aprel–iyun', sabab: 'Kalendarda intervyu baholashdan keyin turadi.', kerak: ['baholash'], oy: 4, manbaId: 'TB01' },
      { id: 'natija', matn: 'Natija: avgust boshi', sabab: 'Oxirgi bosqich: natija e\'lon qilinadi.', kerak: ['intervyu'], oy: 8, manbaId: 'TB01' },
    ],
  },
  {
    id: 'commonapp',
    nomi: 'Common App',
    davlat: 'aqsh',
    pogonalar: [
      { id: 'profil', matn: "Akkaunt va Profile bo'limi", sabab: "Hamma narsa akkauntda saqlanadi. Xalqaro talaba fee waiver'ni Profile bo'limida so'raydi (CA02).", kerak: [], manbaId: 'CA02' },
      { id: 'royxat', matn: "Kollejlar ro'yxati", sabab: "Ro'yxat akkauntga qo'shiladi, shuning uchun u akkauntdan keyin keladi.", kerak: ['profil'] },
      { id: 'hujjat', matn: 'Esse va tavsiyanomalar', sabab: "Talablar kollejga qarab farq qilishi mumkin: ro'yxat aniq bo'lgach tayyorlash oson.", kerak: ['royxat'] },
      { id: 'yuborish', matn: 'Har kollejga alohida yuborish', sabab: "Har kollejga ariza alohida yuboriladi, hujjatlar tayyor bo'lgach.", kerak: ['hujjat'] },
    ],
  },
  {
    id: 'ucas',
    nomi: 'UCAS',
    davlat: 'uk',
    pogonalar: [
      { id: 'royxat', matn: "UCAS'da ro'yxatdan o'tish", sabab: 'Ariza UCAS akkauntida tuziladi.', kerak: [] },
      { id: 'kurs', matn: 'Kurslarni tanlash: 5 tagacha', sabab: 'Bakalavriatda UCAS orqali 5 tagacha kursga topshiriladi (UC01).', kerak: ['royxat'], manbaId: 'UC01' },
      { id: 'hujjat', matn: 'Personal statement va tavsiyanoma', sabab: 'Personal statement tanlangan kurslarga mos yoziladi: avval kurslar aniq bo\'lsin.', kerak: ['kurs'] },
      { id: 'yuborish', matn: "To'lov va yuborish", sabab: "Ariza to'lovi bor (UC01): to'lov qilinib, ariza yuboriladi.", kerak: ['hujjat'], manbaId: 'UC01' },
    ],
  },
];
