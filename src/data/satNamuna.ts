// SAT ekranlari uchun NAMUNA ma'lumot (dizayn: Tayanch-SAT-dizayn.md).
// Savollar Tayanch uchun yozilgan, boshqa saytlardan ko'chirilmagan. Rasmiy SAT savoli emas.
// Ekranlarda "Namuna" deb belgilanadi.

export interface Savol {
  id: string;
  bolim: 'Math' | 'Reading & Writing';
  mavzu: string;
  matn: string;
  variantlar: string[]; // A, B, C, D tartibida
  togri: number; // variantlar indeksi
  izoh: string;
}

export const savollar: Savol[] = [
  {
    id: 'm-chiziqli-1',
    bolim: 'Math',
    mavzu: 'Chiziqli tenglamalar',
    matn: "Agar 3x + 5 = 20 bo'lsa, x ning qiymati nechaga teng?",
    variantlar: ['3', '5', '15', '25/3'],
    togri: 1,
    izoh: "Ikki tomondan 5 ni ayiramiz: 3x = 15. Keyin 3 ga bo'lamiz: x = 5. Tekshirish: 3 · 5 + 5 = 20.",
  },
  {
    id: 'm-foiz-1',
    bolim: 'Math',
    mavzu: 'Foizlar va nisbatlar',
    matn: '80 ning 25 foizi nechaga teng?',
    variantlar: ['15', '20', '25', '60'],
    togri: 1,
    izoh: '25% = 0,25. 80 · 0,25 = 20.',
  },
  {
    id: 'm-kvadrat-1',
    bolim: 'Math',
    mavzu: 'Kvadrat tenglamalar',
    matn: "x² = 49 va x > 0 bo'lsa, x nechaga teng?",
    variantlar: ['5', '7', '14', '49'],
    togri: 1,
    izoh: "x² = 49 tenglamaning ildizlari 7 va −7. Shart bo'yicha x > 0, demak x = 7.",
  },
  {
    id: 'm-funksiya-1',
    bolim: 'Math',
    mavzu: 'Funksiyalar',
    matn: "f(x) = 2x − 1 bo'lsa, f(4) nechaga teng?",
    variantlar: ['3', '7', '8', '9'],
    togri: 1,
    izoh: "x o'rniga 4 qo'yamiz: 2 · 4 − 1 = 7.",
  },
  {
    id: 'rw-tinish-1',
    bolim: 'Reading & Writing',
    mavzu: 'Tinish belgilari',
    matn: 'Qaysi variant gapni to\'g\'ri yakunlaydi? "The library opened in ___ has served the town ever since."',
    variantlar: ['1998, and it', '1998 and, it', '1998, it', '1998 it'],
    togri: 0,
    izoh: "Ikki mustaqil gap vergul va \"and\" bilan bog'lanadi: \"1998, and it\". Faqat vergul qo'yish (C) xato hisoblanadi.",
  },
  {
    id: 'rw-soz-1',
    bolim: 'Reading & Writing',
    mavzu: "So'zning kontekstdagi ma'nosi",
    matn: 'Qaysi so\'z mantiqan to\'g\'ri keladi? "The scientist was cautious, refusing to draw conclusions until every result was ___."',
    variantlar: ['verified', 'ignored', 'imagined', 'hidden'],
    togri: 0,
    izoh: "\"Cautious\" (ehtiyotkor) olim natijalar tekshirilmaguncha xulosa qilmaydi: \"verified\" — tekshirilgan.",
  },
];

export interface Karta {
  soz: string;
  turkum: string;
  tarjima: string;
  misol: string;
}

export const kartalar: Karta[] = [
  { soz: 'ambiguous', turkum: 'sifat', tarjima: "noaniq, ikki xil tushunilishi mumkin", misol: 'The ending of the story was deliberately ambiguous.' },
  { soz: 'concede', turkum: "fe'l", tarjima: 'tan olmoq, yon bermoq', misol: 'She conceded that her first plan had a flaw.' },
  { soz: 'meticulous', turkum: 'sifat', tarjima: "juda puxta, mayda-chuydasigacha e'tiborli", misol: 'He kept meticulous notes on every mistake.' },
  { soz: 'undermine', turkum: "fe'l", tarjima: 'zaiflashtirmoq, putur yetkazmoq', misol: 'One weak example can undermine the whole argument.' },
  { soz: 'plausible', turkum: 'sifat', tarjima: "ishonarli, bo'lishi mumkin", misol: 'Both explanations sound plausible at first.' },
  { soz: 'scrutinize', turkum: "fe'l", tarjima: 'sinchiklab tekshirmoq', misol: 'Scrutinize each answer choice before you pick one.' },
];

export interface BankMavzu { nomi: string; yechilgan: number; jami: number }

// Savol banki ekrani uchun namuna holat (dizayndagi raqamlar).
export const bankMavzular: Record<'rw' | 'math', BankMavzu[]> = {
  rw: [
    { nomi: "Matndagi asosiy g'oya", yechilgan: 6, jami: 12 },
    { nomi: "So'zning kontekstdagi ma'nosi", yechilgan: 3, jami: 10 },
    { nomi: 'Matn tuzilishi va maqsadi', yechilgan: 0, jami: 8 },
    { nomi: 'Dalil bilan xulosa', yechilgan: 2, jami: 9 },
    { nomi: 'Tinish belgilari', yechilgan: 9, jami: 9 },
    { nomi: "Gaplarni bog'lash", yechilgan: 1, jami: 7 },
  ],
  math: [
    { nomi: 'Chiziqli tenglamalar', yechilgan: 4, jami: 12 },
    { nomi: 'Foizlar va nisbatlar', yechilgan: 2, jami: 10 },
    { nomi: 'Kvadrat tenglamalar', yechilgan: 0, jami: 8 },
    { nomi: 'Funksiyalar', yechilgan: 5, jami: 11 },
    { nomi: 'Geometriya', yechilgan: 1, jami: 9 },
    { nomi: 'Statistika', yechilgan: 7, jami: 7 },
  ],
};

// Natijalar ekranida, brauzerda hali javob bo'lmasa ko'rsatiladigan namuna (dizayndagi qatorlar).
export interface Javob { id: string; mavzu: string; bolim: string; sana: string; javob: string; togriJavob: string; togri: boolean }
export const namunaJavoblar: Javob[] = [
  { id: 'n1', mavzu: 'Chiziqli tenglamalar', bolim: 'Math', sana: '3-noyabr', javob: 'B', togriJavob: 'B', togri: true },
  { id: 'n2', mavzu: "Matndagi asosiy g'oya", bolim: 'Reading & Writing', sana: '3-noyabr', javob: 'C', togriJavob: 'A', togri: false },
  { id: 'n3', mavzu: 'Foizlar', bolim: 'Math', sana: '2-noyabr', javob: 'D', togriJavob: 'A', togri: false },
  { id: 'n4', mavzu: 'Tinish belgilari', bolim: 'Reading & Writing', sana: '2-noyabr', javob: 'A', togriJavob: 'A', togri: true },
  { id: 'n5', mavzu: 'Kvadrat tenglamalar', bolim: 'Math', sana: '1-noyabr', javob: 'C', togriJavob: 'B', togri: false },
];

// localStorage kalitlari (hammasi "tayanch:" bilan)
export const KALIT_JAVOBLAR = 'tayanch:sat-javoblar';
export const KALIT_LUGAT = 'tayanch:sat-lugat';
