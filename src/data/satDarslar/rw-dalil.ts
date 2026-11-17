// SAT Reading & Writing: "Dalilni belgilang" (Information and Ideas). 5 ta mashq.
// Matnlar Tayanch uchun yozilgan, College Board savollaridan ko'chirilmagan va parafraz qilinmagan.
// Vaziyatlar o'ylab topilgan (namuna): ular haqiqiy tadqiqot yoki voqea haqida ma'lumot emas.
// variantlar = matndagi gaplar (tartib bilan). Noto'g'ri gapda xato = nega u dalil emas (tipik xato nomi).
// Ikkinchi usul: tekshiruv.ts (har gap belgilari bo'yicha qayta baholanadi).
import type { DarsSavol } from './turlar';

export const rwDalilSavollar: DarsSavol[] = [
  {
    id: 'rw-dalil-1',
    modul: 'rw-dalil',
    mavzu: 'Science: an experiment result',
    qiyinlik: 'oson',
    matn: 'The students in the class concluded that light, not water, caused the difference in how the plants grew. Which sentence shows that water was not the cause?',
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'A science class placed two groups of bean seedlings in different spots: one group on a sunny windowsill and the other inside a closed cupboard.', xato: 'Experimental setup: it tells where the groups were placed but does not rule out water' },
      { matn: 'Both groups received the same amount of water every morning.' },
      { matn: 'After two weeks, the windowsill seedlings were green and upright, while the cupboard seedlings were pale and thin.', xato: 'Result: it shows that there was a difference but does not prove that water was not the cause' },
      { matn: 'Several students noted that beans are easy plants to grow at home.', xato: 'Close to the topic, but unrelated to the claim' },
    ],
    togri: 1,
    yechim: 'The claim has two parts: light caused the difference, and water was not the cause. If both groups received the same amount of water, water cannot explain the difference. Only sentence 2 rules out water.',
    verified: false,
  },
  {
    id: 'rw-dalil-2',
    modul: 'rw-dalil',
    mavzu: 'Social science: an observation',
    qiyinlik: "o'rta",
    matn: 'The library staff believe that the evening hours especially benefited adults who work during the day. Which sentence most directly supports this idea?',
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'When the town library began staying open until nine in the evening, the staff started keeping a simple record of who came in after six.', xato: 'Context: it tells how the observations were collected, not what they showed' },
      { matn: 'Students also used the library, but they mostly came in the early afternoon, as they had before.', xato: "About another group: the students' habits do not show that adults benefited" },
      { matn: 'The library also holds a large collection of local newspapers going back many decades.', xato: 'Close to the topic, but unrelated to the claim' },
      { matn: 'Most of the late visitors were adults who said they had come straight from work.' },
    ],
    togri: 3,
    yechim: 'The claim is about who benefited from the evening hours. That most of the late visitors were adults who came straight from work shows exactly this.',
    verified: false,
  },
  {
    id: 'rw-dalil-3',
    modul: 'rw-dalil',
    mavzu: 'Literature: character',
    qiyinlik: "o'rta",
    matn: 'The text portrays the clockmaker as a person who puts helping others ahead of his own work. Which sentence best supports this?',
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'The old clockmaker opened his shop at dawn, as he had done for most of his life.', xato: 'It shows a habit, not his attitude toward others' },
      { matn: 'One morning, a boy came in holding a pocket watch that had stopped.', xato: 'It starts the story but does not show character' },
      { matn: 'The clockmaker set aside his own unfinished work, spent the whole afternoon on the tiny gears, and refused to take any payment.' },
      { matn: 'Outside, the street grew noisy as carts filled the market square.', xato: 'A description of the scene, not of the character' },
    ],
    togri: 2,
    yechim: 'The claim has two parts: his own work and helping others. In sentence 3, the clockmaker sets his own work aside, helps the boy and takes no payment, so both parts are there.',
    verified: false,
  },
  {
    id: 'rw-dalil-4',
    modul: 'rw-dalil',
    mavzu: 'Culture: handicraft',
    qiyinlik: "o'rta",
    matn: 'The family believes that handmade paper lasts for many years without falling apart. Which sentence best supports this claim?',
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'In a small workshop near Samarkand, a family makes paper by hand from mulberry bark.', xato: 'Context: it is about the workshop, not about durability' },
      { matn: 'The family still keeps a notebook made in the workshop long ago, and its pages remain smooth and unbroken.' },
      { matn: 'The work is slow because every sheet is shaped and dried by hand.', xato: 'Unsupported cause and effect: slow work does not prove that the paper lasts a long time' },
      { matn: 'Visitors often buy the paper as a gift because they like its soft, slightly uneven surface.', xato: 'It is about appearance, not about durability' },
    ],
    togri: 1,
    yechim: 'The claim is that the paper does not fall apart over time. The pages of a notebook made long ago are still intact, and this shows it directly.',
    verified: false,
  },
  {
    id: 'rw-dalil-5',
    modul: 'rw-dalil',
    mavzu: 'Science: conclusion and evidence',
    qiyinlik: 'qiyin',
    matn: 'A student concluded that pigeons do not find their way home only by seeing familiar buildings. Which sentence best supports this conclusion?',
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'Many people assume that city pigeons find their way home mainly by recognizing familiar buildings.', xato: 'The view being rejected (the opposing view), not evidence' },
      { matn: 'To test this idea, a student released trained pigeons in a field the birds had never visited, far from any landmarks they knew.', xato: 'Experimental method: it does not state the result' },
      { matn: 'Most of the birds still returned to their loft.' },
      { matn: 'The student concluded that familiar landmarks alone cannot explain how pigeons find their way.', xato: 'The claim itself: it repeats the conclusion and is not evidence' },
    ],
    togri: 2,
    yechim: 'Evidence must be an observed result. The birds returned even from a place with no familiar landmarks, and this supports the conclusion. Sentence 4 is the conclusion itself, so it cannot count as evidence.',
    verified: false,
  },
];
