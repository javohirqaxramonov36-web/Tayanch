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
    mavzu: 'Linear equations',
    matn: 'If 3x + 5 = 20, what is the value of x?',
    variantlar: ['3', '5', '15', '25/3'],
    togri: 1,
    izoh: 'Subtract 5 from both sides: 3x = 15. Then divide by 3: x = 5. Check: 3 · 5 + 5 = 20.',
  },
  {
    id: 'm-foiz-1',
    bolim: 'Math',
    mavzu: 'Percentages and ratios',
    matn: 'What is 25 percent of 80?',
    variantlar: ['15', '20', '25', '60'],
    togri: 1,
    izoh: '25% = 0.25. 80 · 0.25 = 20.',
  },
  {
    id: 'm-kvadrat-1',
    bolim: 'Math',
    mavzu: 'Quadratic equations',
    matn: 'If x² = 49 and x > 0, what is x?',
    variantlar: ['5', '7', '14', '49'],
    togri: 1,
    izoh: 'The roots of the equation x² = 49 are 7 and −7. The condition says x > 0, so x = 7.',
  },
  {
    id: 'm-funksiya-1',
    bolim: 'Math',
    mavzu: 'Functions',
    matn: 'If f(x) = 2x − 1, what is f(4)?',
    variantlar: ['3', '7', '8', '9'],
    togri: 1,
    izoh: 'Substitute 4 for x: 2 · 4 − 1 = 7.',
  },
  {
    id: 'rw-tinish-1',
    bolim: 'Reading & Writing',
    mavzu: 'Punctuation',
    matn: 'Which choice completes the sentence correctly? "The library opened in ___ has served the town ever since."',
    variantlar: ['1998, and it', '1998 and, it', '1998, it', '1998 it'],
    togri: 0,
    izoh: 'Two independent clauses are joined with a comma and "and": "1998, and it". Using only a comma (C) is an error.',
  },
  {
    id: 'rw-soz-1',
    bolim: 'Reading & Writing',
    mavzu: 'Meaning of a word in context',
    matn: 'Which word fits most logically? "The scientist was cautious, refusing to draw conclusions until every result was ___."',
    variantlar: ['verified', 'ignored', 'imagined', 'hidden'],
    togri: 0,
    izoh: 'A "cautious" scientist does not draw conclusions until the results are checked: "verified" means checked.',
  },
];

export interface Karta {
  soz: string;
  turkum: string;
  tarjima: string;
  misol: string;
}

export const kartalar: Karta[] = [
  { soz: 'ambiguous', turkum: 'adjective', tarjima: "noaniq, ikki xil tushunilishi mumkin", misol: 'The ending of the story was deliberately ambiguous.' },
  { soz: 'concede', turkum: 'verb', tarjima: 'tan olmoq, yon bermoq', misol: 'She conceded that her first plan had a flaw.' },
  { soz: 'meticulous', turkum: 'adjective', tarjima: "juda puxta, mayda-chuydasigacha e'tiborli", misol: 'He kept meticulous notes on every mistake.' },
  { soz: 'undermine', turkum: 'verb', tarjima: 'zaiflashtirmoq, putur yetkazmoq', misol: 'One weak example can undermine the whole argument.' },
  { soz: 'plausible', turkum: 'adjective', tarjima: "ishonarli, bo'lishi mumkin", misol: 'Both explanations sound plausible at first.' },
  { soz: 'scrutinize', turkum: 'verb', tarjima: 'sinchiklab tekshirmoq', misol: 'Scrutinize each answer choice before you pick one.' },
];

// Natijalar ekranida, brauzerda hali javob bo'lmasa ko'rsatiladigan namuna (dizayndagi qatorlar).
export interface Javob { id: string; mavzu: string; bolim: string; sana: string; javob: string; togriJavob: string; togri: boolean }
export const namunaJavoblar: Javob[] = [
  { id: 'n1', mavzu: 'Linear equations', bolim: 'Math', sana: 'November 3', javob: 'B', togriJavob: 'B', togri: true },
  { id: 'n2', mavzu: 'Main idea of a text', bolim: 'Reading & Writing', sana: 'November 3', javob: 'C', togriJavob: 'A', togri: false },
  { id: 'n3', mavzu: 'Percentages', bolim: 'Math', sana: 'November 2', javob: 'D', togriJavob: 'A', togri: false },
  { id: 'n4', mavzu: 'Punctuation', bolim: 'Reading & Writing', sana: 'November 2', javob: 'A', togriJavob: 'A', togri: true },
  { id: 'n5', mavzu: 'Quadratic equations', bolim: 'Math', sana: 'November 1', javob: 'C', togriJavob: 'B', togri: false },
];

// localStorage kalitlari (hammasi "tayanch:" bilan)
export const KALIT_JAVOBLAR = 'tayanch:sat-javoblar';
export const KALIT_LUGAT = 'tayanch:sat-lugat';
