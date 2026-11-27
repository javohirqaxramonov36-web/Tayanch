// IELTS Reading: "True / False / Not Given" (IE02: Identifying information). 5 ta mashq. Matn inglizcha (2026-11-27).
// Parchalar Tayanch uchun yozilgan, vaziyatlar o'ylab topilgan (namuna): ular haqiqiy joy, odam yoki voqea haqida ma'lumot emas.
// variantlar tartibi doim True, False, Not Given. Noto'g'ri variantda xato = shu javobga olib keladigan tipik xato nomi.
// Ikkinchi usul: tekshiruv.ts (har parcha gapi da'voga nisbatan alohida baholanadi).
import type { DarsSavol } from './turlar';

const tfng = (togri: 0 | 1 | 2, xato: [string, string]): Pick<DarsSavol, 'variantlar' | 'togri'> => {
  const nomlar = ['True', 'False', 'Not Given'];
  let k = 0;
  return { togri, variantlar: nomlar.map((matn, j) => (j === togri ? { matn } : { matn, xato: xato[k++] })) };
};

export const irTfngSavollar: DarsSavol[] = [
  {
    id: 'ir-tfng-1',
    modul: 'ir-tfng',
    mavzu: 'Paraphrase: the same idea in other words',
    qiyinlik: 'oson',
    parcha: 'The hill town museum was founded by a group of retired teachers. For its first ten years, it opened only at weekends. When the town gave it a larger building, it began opening every day except Monday.',
    matn: 'Statement: The museum is now closed on one day each week.',
    ...tfng(0, [
      'Reading a paraphrase as a contradiction: "every day except Monday" confirms one closed day',
      'Missing the paraphrase: the text says the same thing in other words',
    ]),
    yechim: 'Last sentence: the museum opens every day except Monday, so it is closed one day a week. Different words, same meaning: True.',
    verified: false,
  },
  {
    id: 'ir-tfng-2',
    modul: 'ir-tfng',
    mavzu: 'Then and now',
    qiyinlik: "o'rta",
    parcha: 'A student radio station at a riverside college began broadcasting fifteen years ago. At first, all of its programmes were music shows. Today, more than half of its weekly hours are filled with news and interviews made by students.',
    matn: "Statement: Music still takes up most of the station's weekly broadcasting time.",
    ...tfng(1, [
      'Reading the past as the present: "At first" is about the past',
      'Missing the contradiction: if news and interviews fill more than half the time, music cannot be the majority',
    ]),
    yechim: 'Today more than half of the time goes to news and interviews, so music gets less than half. The statement says music takes up most of the time; the text says the opposite: False.',
    verified: false,
  },
  {
    id: 'ir-tfng-3',
    modul: 'ir-tfng',
    mavzu: 'Information the text does not give',
    qiyinlik: "o'rta",
    parcha: "A city's first bicycle-sharing scheme started with two hundred bicycles at twenty stations. Users pay a small fee through a mobile app and can return a bicycle to any station. The scheme proved so popular that the number of stations was doubled within two years.",
    matn: 'Statement: Most users of the scheme are university students.',
    ...tfng(2, [
      'Relying on general knowledge: the text does not say who the users are',
      'Treating missing information as a contradiction: False needs a sentence that says the opposite',
    ]),
    yechim: 'The text is about how the scheme works and how popular it became. Nothing confirms or denies who the users are (students or not): Not Given.',
    verified: false,
  },
  {
    id: 'ir-tfng-4',
    modul: 'ir-tfng',
    mavzu: 'The similar-word trap',
    qiyinlik: 'qiyin',
    parcha: "The bakery on Market Street uses flour from a mill in the next valley. The owner says that the mill grinds its wheat slowly, which keeps more of the grain's flavour. The bakery's bread costs more than bread sold in the supermarket.",
    matn: "Statement: The bakery's bread is more popular than supermarket bread.",
    ...tfng(2, [
      'Fooled by a similar word: "more" is about price, not popularity',
      'Treating a guess as a fact: the text never says that dearer bread sells less',
    ]),
    yechim: 'The text compares the price of the bread (it costs more), not its popularity. Nothing says how many people buy it: Not Given.',
    verified: false,
  },
  {
    id: 'ir-tfng-5',
    modul: 'ir-tfng',
    mavzu: 'Order of events',
    qiyinlik: 'qiyin',
    parcha: "A writer from a small coastal town spent six years on her first novel. A small publisher accepted the book, and it sold slowly at first. In its second year, a radio interview with the writer brought it many new readers.",
    matn: 'Statement: The novel was popular as soon as it was published.',
    ...tfng(1, [
      'Moving later success to the start: many readers came in the second year',
      'Missing the contradiction: "sold slowly at first" directly denies the statement',
    ]),
    yechim: '"Sold slowly at first": the book sold slowly at the start. The statement says it was popular as soon as it came out. The text says the opposite: False.',
    verified: false,
  },
];
