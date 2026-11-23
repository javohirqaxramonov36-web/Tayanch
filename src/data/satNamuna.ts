// SAT ekranlari uchun NAMUNA ma'lumot (dizayn: Tayanch-SAT-dizayn.md).
// Savollar Tayanch uchun yozilgan, boshqa saytlardan ko'chirilmagan. Rasmiy SAT savoli emas.
// Ekranlarda "Namuna" deb belgilanadi.

export interface Savol {
  id: string;
  bolim: 'Math' | 'Reading & Writing';
  mavzu: string;
  /** Reading & Writing: savoldan oldin o'qiladigan qisqa matn (passage). Math'da yo'q. */
  parcha?: string;
  matn: string;
  variantlar: string[]; // A, B, C, D tartibida
  togri: number; // variantlar indeksi
  izoh: string;
}

// 2-versiya (2026-11-23, audit): savollar haqiqiy Digital SAT'ning o'rta darajasiga yaqinlashtirildi,
// R&W savollari qisqa matn bilan, izohda "nega boshqa variantlar xato". Id'lar yangi (-2), mavzu nomlari
// eskilari bilan bir xil, shuning uchun Natijalar'dagi "Solve again" filtri ishlayveradi. Muallif ko'rigi kerak.
export const savollar: Savol[] = [
  {
    id: 'm-chiziqli-2',
    bolim: 'Math',
    mavzu: 'Linear equations',
    matn: 'A school club sells small notebooks for $3 each and large notebooks for $5 each. On Monday, the club sold 40 notebooks for a total of $156. How many large notebooks did the club sell on Monday?',
    variantlar: ['12', '18', '22', '31'],
    togri: 1,
    izoh: 'Let s and L be the numbers of small and large notebooks: s + L = 40 and 3s + 5L = 156. Substitute s = 40 − L: 120 − 3L + 5L = 156, so 2L = 36 and L = 18. Why not the others: 22 is the number of small notebooks (40 − 18). 31 comes from 156 ÷ 5, which ignores the small notebooks. 12 does not satisfy both equations.',
  },
  {
    id: 'm-foiz-2',
    bolim: 'Math',
    mavzu: 'Percentages and ratios',
    matn: 'The price of a jacket was increased by 20%. Later, the new price was decreased by 20%. The final price is what percent of the original price?',
    variantlar: ['80%', '96%', '100%', '104%'],
    togri: 1,
    izoh: 'An increase of 20% multiplies the price by 1.2, and a decrease of 20% multiplies it by 0.8. 1.2 · 0.8 = 0.96, so the final price is 96% of the original. Why not 100%: the 20% decrease is taken from a larger number, so it removes more than the increase added.',
  },
  {
    id: 'm-kvadrat-2',
    bolim: 'Math',
    mavzu: 'Quadratic equations',
    matn: 'The function h(t) = −5t² + 20t + 25 gives the height, in meters, of a ball t seconds after it is thrown. How many seconds after it is thrown does the ball hit the ground?',
    variantlar: ['1', '2', '5', '25'],
    togri: 2,
    izoh: 'The ball hits the ground when h(t) = 0. Divide −5t² + 20t + 25 = 0 by −5: t² − 4t − 5 = 0, so (t − 5)(t + 1) = 0. Time cannot be negative, so t = 5. Why not the others: 2 is the time of the highest point (t = −b ÷ 2a), not the landing time. 25 is the starting height in meters. 1 comes from a sign error in the factors.',
  },
  {
    id: 'm-funksiya-2',
    bolim: 'Math',
    mavzu: 'Functions',
    matn: 'For the linear function f, f(2) = 7 and f(6) = 19. What is the value of f(10)?',
    variantlar: ['27', '30', '31', '38'],
    togri: 2,
    izoh: 'The slope is (19 − 7) ÷ (6 − 2) = 3. Then 7 = 3 · 2 + b, so b = 1 and f(x) = 3x + 1. f(10) = 31. Why not the others: 30 is 3 · 10 without the y-intercept. 38 doubles f(6), which works only if the line passes through the origin. 27 uses a slope of 2.',
  },
  {
    id: 'rw-soz-2',
    bolim: 'Reading & Writing',
    mavzu: 'Meaning of a word in context',
    parcha: 'Early weather maps were drawn by hand from reports sent by telegraph. Because each station reported at a slightly different time, forecasters had to ______ the readings into a single picture, adjusting for the delays before they could predict where a storm would move.',
    matn: 'Which choice completes the text with the most logical and precise word?',
    variantlar: ['reconcile', 'dismiss', 'duplicate', 'celebrate'],
    togri: 0,
    izoh: '"Reconcile" means to make different pieces of information fit together, which is what forecasters did when they adjusted for the delays. Why not the others: "dismiss" means to ignore, but they used the readings. "Duplicate" means to copy, which does not combine anything. "Celebrate" does not fit the task described.',
  },
  {
    id: 'rw-otish-1',
    bolim: 'Reading & Writing',
    mavzu: 'Transitions',
    parcha: 'Many desert plants store water in thick, fleshy leaves. The aloe plant, for instance, keeps water in a gel inside its leaves. ______ some cacti have no true leaves at all and store water in their stems instead.',
    matn: 'Which choice completes the text with the most logical transition?',
    variantlar: ['For example,', 'As a result,', 'By contrast,', 'In other words,'],
    togri: 2,
    izoh: 'The last sentence describes plants that store water in a different place (stems, not leaves), so it contrasts with the first two sentences. Why not the others: "For example" would need another plant that stores water in its leaves. "As a result" claims a cause, but the aloe does not cause anything about cacti. "In other words" would need a restatement, not a new fact.',
  },
  {
    id: 'rw-goya-1',
    bolim: 'Reading & Writing',
    mavzu: 'Central ideas and details',
    parcha: 'For a class project, students counted how often birds visited feeders placed at different heights in a city park. Feeders near the ground were visited less often than feeders hung two meters high, even though all of them held the same seeds. The students noted that the ground feeders were close to bushes where cats often hid, and they suggested that birds may choose feeding spots partly by how safe the spots seem.',
    matn: 'Which choice best states the main idea of the text?',
    variantlar: [
      'Birds in the park preferred some kinds of seeds over others.',
      'Students found that birds visited higher feeders more often and proposed that a sense of safety may explain this.',
      'Cats in city parks catch more birds than the students expected.',
      'Feeders hung two meters high hold more seeds than ground feeders.',
    ],
    togri: 1,
    izoh: 'The text reports one finding (higher feeders got more visits) and one possible explanation (safety from cats). Choice B states both. Why not the others: A contradicts the text, since all feeders held the same seeds. C is not stated: the text says cats hid nearby, not how many birds they caught. D is not supported: the amount of seeds was the same.',
  },
  {
    id: 'rw-tinish-2',
    bolim: 'Reading & Writing',
    mavzu: 'Punctuation',
    parcha: "The museum's newest exhibit features three tools used by early ______ a bone folder, a wooden press, and a curved needle.",
    matn: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    variantlar: ['bookbinders;', 'bookbinders:', 'bookbinders,', 'bookbinders'],
    togri: 1,
    izoh: 'The part before the blank is a complete sentence, and the list after it names the "three tools." A colon is used to introduce such a list. Why not the others: a semicolon (A) must be followed by a complete sentence, but the list is not one. A comma (C) makes the list look like more items added to "bookbinders." No punctuation (D) runs the noun and the list together.',
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

// PR #47 dan oldin brauzerda saqlangan javoblarda mavzu va sana o'zbekcha.
// O'qishda yangi (inglizcha) shaklga moslanadi; saqlangan ma'lumot qayta yozilmaydi.
const ESKI_MAVZU: Record<string, string> = {
  'Chiziqli tenglamalar': 'Linear equations',
  'Foizlar va nisbatlar': 'Percentages and ratios',
  'Kvadrat tenglamalar': 'Quadratic equations',
  'Funksiyalar': 'Functions',
  'Tinish belgilari': 'Punctuation',
  "So'zning kontekstdagi ma'nosi": 'Meaning of a word in context',
};
const ESKI_OYLAR = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
const OYLAR_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Eski o'zbekcha mavzu nomini yangisiga moslaydi; noma'lum nom o'zicha qaytadi. */
export const mavzuNomi = (nom: string): string =>
  Object.prototype.hasOwnProperty.call(ESKI_MAVZU, nom) ? ESKI_MAVZU[nom] : nom;

/** "3-noyabr" → "November 3"; boshqa shakl o'zicha qaytadi. */
export const sanaYozuvi = (sana: string): string => {
  const m = /^(\d{1,2})-([a-z]+)$/.exec(sana);
  const oy = m ? ESKI_OYLAR.indexOf(m[2]) : -1;
  return m && oy >= 0 ? `${OYLAR_EN[oy]} ${Number(m[1])}` : sana;
};

/** Saqlangan javobni ko'rsatish uchun moslaydi (yangi nusxa, asl obyekt o'zgarmaydi). */
export const javobniMosla = (j: Javob): Javob => ({ ...j, mavzu: mavzuNomi(j.mavzu), sana: sanaYozuvi(j.sana) });
