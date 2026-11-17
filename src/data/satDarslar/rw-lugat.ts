// SAT Reading & Writing: "Lug'at kontekstda" (Craft and Structure). 5 ta mashq.
// Matnlar Tayanch uchun yozilgan, College Board savollaridan ko'chirilmagan va parafraz qilinmagan.
// Vaziyatlar o'ylab topilgan (namuna). Ikki shakl: bo'sh joyga eng aniq so'z yoki gapdagi so'zning ma'nosi.
// Noto'g'ri variantda xato = tipik xato (asosiy ma'no, teskari ohang, mavzuga yaqin, boshqa ma'no).
// Ikkinchi usul: rw-tekshiruv.ts (kontekst ishorasi va har variant belgilari bo'yicha qayta baholanadi).
import type { DarsSavol } from './turlar';

export const rwLugatSavollar: DarsSavol[] = [
  {
    id: 'rw-lugat-1',
    modul: 'rw-lugat',
    mavzu: 'Blank: the clue is in the sentence itself',
    qiyinlik: 'oson',
    matn: 'The guide warned the hikers that the trail was ______ after the storm: fallen branches covered the path, and parts of it had washed away.',
    variantlar: [
      { matn: 'scenic', xato: 'Close to the topic: it describes the trail, but the clue after the colon (branches, washed-away parts) is about danger' },
      { matn: 'crowded', xato: 'The tone fits (negative), but the meaning is different: there is no clue about crowds' },
      { matn: 'hazardous' },
      { matn: 'familiar', xato: 'A choice with no clue: nothing in the sentence is about familiarity' },
    ],
    togri: 2,
    yechim: 'The part after the colon explains the blank: branches covered the path, and part of it washed away. So the trail is dangerous: "hazardous".',
    verified: false,
  },
  {
    id: 'rw-lugat-2',
    modul: 'rw-lugat',
    mavzu: 'A word with several meanings: address',
    qiyinlik: "o'rta",
    matn: 'The mayor promised to address the shortage of clean water before the summer, starting with repairs to the old pipes. As used in the text, what does "address" most nearly mean?',
    variantlar: [
      { matn: 'write a location on', xato: 'Primary meaning trap: the most familiar meaning of "address" (a location), but there is no letter in the sentence' },
      { matn: 'deal with' },
      { matn: 'give a speech to', xato: 'A different meaning: the meaning in "address a crowd", but here no one gives a speech to a shortage' },
      { matn: 'send a letter to', xato: 'Close to the primary meaning: sending a letter, but the sentence is about repairing pipes' },
    ],
    togri: 1,
    yechim: 'The clue is "starting with repairs to the old pipes": the mayor begins solving the problem with pipe repairs. Here "address" means "to set about solving": "deal with".',
    verified: false,
  },
  {
    id: 'rw-lugat-3',
    modul: 'rw-lugat',
    mavzu: 'Blank: "Unlike" signals a contrast',
    qiyinlik: "o'rta",
    matn: 'Unlike his talkative classmates, the new student was ______: he rarely spoke during lessons, though his written answers showed careful thought.',
    variantlar: [
      { matn: 'outspoken', xato: 'Opposite meaning: "Unlike talkative" calls for someone who speaks little, but this word means someone who speaks openly' },
      { matn: 'careless', xato: 'It contradicts the sentence: his written answers were carefully thought out (careful thought)' },
      { matn: 'curious', xato: 'A choice with no clue: the sentence gives no evidence of curiosity' },
      { matn: 'reserved' },
    ],
    togri: 3,
    yechim: '"Unlike his talkative classmates" and "he rarely spoke" both point to speaking little. "reserved" (quiet, restrained) fits.',
    verified: false,
  },
  {
    id: 'rw-lugat-4',
    modul: 'rw-lugat',
    mavzu: 'Blank: the tone changes after "but"',
    qiyinlik: 'qiyin',
    matn: "Critics had expected the young director's second film to be a minor effort, but its careful pacing and inventive camera work proved them wrong; several reviewers called it ______.",
    variantlar: [
      { matn: 'modest', xato: 'Tone trap: this is what the critics expected (minor effort), but "but … proved them wrong" says the opposite' },
      { matn: 'remarkable' },
      { matn: 'predictable', xato: 'Opposite tone: it clashes with "inventive" and is a negative judgment' },
      { matn: 'expensive', xato: 'Close to the topic: it is about the film, but there is no clue about cost' },
    ],
    togri: 1,
    yechim: '"but … proved them wrong": the film turned out better than expected, and "careful pacing and inventive camera work" is high praise. A strong, positive word is needed: "remarkable".',
    verified: false,
  },
  {
    id: 'rw-lugat-5',
    modul: 'rw-lugat',
    mavzu: 'A word with several meanings: sharp',
    qiyinlik: 'qiyin',
    matn: 'After the factory closed, the town saw a sharp drop in the number of families who could afford to eat at local restaurants. As used in the text, what does "sharp" most nearly mean?',
    variantlar: [
      { matn: 'pointed', xato: 'Primary meaning trap: it is about a knife or a pointed object, but the sentence is about a number going down' },
      { matn: 'intelligent', xato: 'A different meaning: the meaning in "a sharp student", which does not fit a drop' },
      { matn: 'sudden' },
      { matn: 'harsh in tone', xato: 'A different meaning: the meaning in "sharp words", about the tone of a voice or of speech' },
    ],
    togri: 2,
    yechim: 'The clue is "drop in the number": the word tells how the decrease happened. After the factory closed, the number fell quickly and steeply: "sudden".',
    verified: false,
  },
];
