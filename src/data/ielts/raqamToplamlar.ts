// IELTS Listening "Harf va raqam diktanti" (/uz/ielts/mashq/listening-raqamlar/).
// Hamma gap, ism va raqam Tayanch tomonidan yozilgan (original, "Namuna"); tashqi test yoki imtihon materiali emas.
// Telefon raqamlari Ofcom'ning badiiy asarlar uchun ajratilgan oralig'idan olingan (haqiqiy abonentga tegishli emas; tekshirish kerak).
// Sana qoidasi: ID03 (IDP). `kontekst` va `qoida` inglizcha (2026-11-27), muallif tekshiradi.
import type { RaqamJavob } from '../../lib/ielts/raqamTekshir';

export interface RaqamSavol {
  /** Ovoz o'qiydigan bo'laklar (har biri alohida utterance: harflar orasida pauza bo'ladi) */
  aytiladi: string[];
  /** Maydon ustidagi yorliq, masalan "Familiyasi" */
  kontekst: string;
  /** Maydon oldidagi va keyingi birlik (masalan "£", "m") */
  oldin?: string;
  keyin?: string;
  javob: RaqamJavob;
  /** Xato qilinganda ko'rsatiladigan qoida */
  qoida?: string;
}

export interface RaqamToplam {
  id: string;
  nomi: string;
  tavsif: string;
  /** Telefon klaviaturasi: `inputmode` */
  klaviatura: 'text' | 'tel' | 'decimal';
  savollar: RaqamSavol[];
}

export const KALIT_IELTS_RAQAMLAR = 'tayanch:ielts-raqamlar';

const harflar = (s: string) => s.split(' ');

const DOUBLE = '"double" means you write the letter (or number) twice.';

export const raqamToplamlar: RaqamToplam[] = [
  {
    id: 'ismlar',
    nomi: 'Spelled-out names',
    tavsif: 'A surname is spelled letter by letter',
    klaviatura: 'text',
    savollar: [
      { aytiladi: ["My surname's Brennan. That's", ...harflar('B R E'), 'double N', 'A', 'N'], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Brennan' }, qoida: DOUBLE },
      { aytiladi: ["It's Whitfield.", ...harflar('W H I T F I E L D')], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Whitfield' }, qoida: 'Don\'t mix up I and E: I sounds like "eye", E like "ee".' },
      { aytiladi: ['The name is Gallagher.', 'G', 'A', 'double L', ...harflar('A G H E R')], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Gallagher' }, qoida: `${DOUBLE} G sounds like "jee", J like "jay".` },
      { aytiladi: ["That's Okafor.", ...harflar('O K A F O R')], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Okafor' }, qoida: 'A is said like "ay" in "day", E like "ee" in "see".' },
      { aytiladi: ['Jessop.', 'J', 'E', 'double S', 'O', 'P'], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Jessop' }, qoida: DOUBLE },
      { aytiladi: ['Featherstone.', ...harflar('F E A T H E R S T O N E')], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Featherstone' }, qoida: 'Split a long name into parts as you write: Feather-stone.' },
      { aytiladi: ["It's Quayle.", ...harflar('Q U A Y L E')], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Quayle' }, qoida: 'Q sounds like "cue", U like "you".' },
      { aytiladi: ['Vickers.', ...harflar('V I C K E R S')], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Vickers' }, qoida: 'Don\'t mix up V and B: V sounds like "vee", B like "bee".' },
      { aytiladi: ['Haddington.', 'H', 'A', 'double D', ...harflar('I N G T O N')], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Haddington' }, qoida: DOUBLE },
      { aytiladi: ['Yarwood.', ...harflar('Y A R W'), 'double O', 'D'], kontekst: 'Surname', javob: { tur: 'harf', matn: 'Yarwood' }, qoida: `${DOUBLE} Y sounds like "why", W like "double-you".` },
    ],
  },
  {
    id: 'telefon',
    nomi: 'Phone numbers',
    tavsif: 'With "oh", "double" and "triple"',
    klaviatura: 'tel',
    savollar: [
      { aytiladi: ["My mobile number is", 'oh seven seven double oh,', 'nine double oh,', 'four six one.'], kontekst: 'Phone number', javob: { tur: 'raqam', raqamlar: '07700900461' }, qoida: '"oh" means zero; "double oh" = 00.' },
      { aytiladi: ['You can call the office on', 'oh one six three two,', 'nine six oh,', 'seven two eight.'], kontekst: 'Office phone', javob: { tur: 'raqam', raqamlar: '01632960728' }, qoida: '"oh" means zero.' },
      { aytiladi: ["It's", 'oh two oh,', 'seven nine four six,', 'oh five double three.'], kontekst: 'Phone number', javob: { tur: 'raqam', raqamlar: '02079460533' }, qoida: '"double three" = 33.' },
      { aytiladi: ['The number is', 'oh seven seven double oh,', 'nine double oh,', 'double one eight.'], kontekst: 'Phone number', javob: { tur: 'raqam', raqamlar: '07700900118' }, qoida: '"double one" = 11.' },
      { aytiladi: ['Ring us on', 'oh one six three two,', 'nine six oh,', 'triple nine.'], kontekst: 'Phone number', javob: { tur: 'raqam', raqamlar: '01632960999' }, qoida: '"triple nine" = 999: the number is written three times.' },
      { aytiladi: ['My home number is', 'oh one six one,', 'four nine six,', 'oh seven five four.'], kontekst: 'Home phone', javob: { tur: 'raqam', raqamlar: '01614960754' }, qoida: '"oh" means zero.' },
      { aytiladi: ["It's", 'oh one one three,', 'four nine six,', 'oh double two one.'], kontekst: 'Phone number', javob: { tur: 'raqam', raqamlar: '01134960221' }, qoida: '"double two" = 22.' },
      { aytiladi: ['Text me on', 'oh seven seven double oh,', 'nine double oh,', 'three five oh.'], kontekst: 'Phone number', javob: { tur: 'raqam', raqamlar: '07700900350' }, qoida: 'The "oh" at the end is zero too: 350.' },
      { aytiladi: ['The reception number is', 'oh one one seven,', 'four nine six,', 'oh double eight four.'], kontekst: 'Reception phone', javob: { tur: 'raqam', raqamlar: '01174960884' }, qoida: '"double eight" = 88.' },
      { aytiladi: ["It's", 'oh two oh,', 'seven nine four six,', 'double oh one oh.'], kontekst: 'Phone number', javob: { tur: 'raqam', raqamlar: '02079460010' }, qoida: '"double oh" = 00, and the "oh" at the end is zero too.' },
    ],
  },
  {
    id: 'sana-vaqt',
    nomi: 'Dates and times',
    tavsif: 'Day, month and time of day',
    klaviatura: 'text',
    savollar: [
      { aytiladi: ['The course starts on the twenty-first of February.'], kontekst: 'Course start date', javob: { tur: 'sana', kun: 21, oy: 2 }, qoida: 'Don\'t write "the" or "of": 21 February or February 21.' },
      { aytiladi: ['Can you come on March the third?'], kontekst: 'Appointment date', javob: { tur: 'sana', kun: 3, oy: 3 }, qoida: 'March the third = 3 March.' },
      { aytiladi: ["The deadline is the thirteenth of September."], kontekst: 'Deadline', javob: { tur: 'sana', kun: 13, oy: 9 }, qoida: 'thirTEEN (13) is stressed at the end, THIRty (30) at the start.' },
      { aytiladi: ['We leave on the thirtieth of June.'], kontekst: 'Departure date', javob: { tur: 'sana', kun: 30, oy: 6 }, qoida: 'thirtieth = 30, thirteenth = 13.' },
      { aytiladi: ["The museum reopens on August the second."], kontekst: 'Museum reopening date', javob: { tur: 'sana', kun: 2, oy: 8 }, qoida: 'second = 2nd.' },
      { aytiladi: ['The tour begins at half past seven.'], kontekst: 'Start time', javob: { tur: 'vaqt', soat: 7, daqiqa: 30 }, qoida: '"half past seven" = 7.30.' },
      { aytiladi: ['Please arrive by quarter to nine.'], kontekst: 'Arrival time', javob: { tur: 'vaqt', soat: 8, daqiqa: 45 }, qoida: '"quarter to nine" = 15 minutes before 9 = 8.45.' },
      { aytiladi: ['The bus leaves at ten fifteen.'], kontekst: 'Bus time', javob: { tur: 'vaqt', soat: 10, daqiqa: 15 }, qoida: '"ten fifteen" = 10.15.' },
      { aytiladi: ['The talk finishes at twenty past four.'], kontekst: 'Finish time', javob: { tur: 'vaqt', soat: 4, daqiqa: 20 }, qoida: '"twenty past four" = 4.20.' },
      { aytiladi: ['Your room is booked from the first of December.'], kontekst: 'Booking date', javob: { tur: 'sana', kun: 1, oy: 12 }, qoida: 'first = 1: 1 December.' },
    ],
  },
  {
    id: 'narx-olcham',
    nomi: 'Prices and measurements',
    tavsif: 'Pounds, pence, metres and weight',
    klaviatura: 'decimal',
    savollar: [
      { aytiladi: ['A single ticket costs fifteen pounds.'], kontekst: 'Ticket price', oldin: '£', javob: { tur: 'son', qiymat: 15 }, qoida: 'fifTEEN (15) is stressed at the end, FIFty (50) at the start.' },
      { aytiladi: ['The deposit is fifty pounds.'], kontekst: 'Deposit', oldin: '£', javob: { tur: 'son', qiymat: 50 }, qoida: 'FIFty (50): stressed at the start.' },
      { aytiladi: ['Lunch is twelve pounds fifty.'], kontekst: 'Lunch price', oldin: '£', javob: { tur: 'son', qiymat: 12.5 }, qoida: '"twelve pounds fifty" = 12.50.' },
      { aytiladi: ['A coffee is eighty-five pence.'], kontekst: 'Coffee price', keyin: 'p', javob: { tur: 'son', qiymat: 85 }, qoida: 'pence is written p.' },
      { aytiladi: ['The table is two point seven five metres long.'], kontekst: 'Table length', keyin: 'm', javob: { tur: 'son', qiymat: 2.75 }, qoida: '"point" means the decimal point: 2.75.' },
      { aytiladi: ['The path is one and a half kilometres.'], kontekst: 'Path length', keyin: 'km', javob: { tur: 'son', qiymat: 1.5 }, qoida: '"one and a half" = 1.5.' },
      { aytiladi: ['The fee for the year is fifteen hundred pounds.'], kontekst: 'Yearly fee', oldin: '£', javob: { tur: 'son', qiymat: 1500 }, qoida: '"fifteen hundred" = 1500.' },
      { aytiladi: ['The flat is three hundred and forty square metres.'], kontekst: 'Flat size', keyin: 'm²', javob: { tur: 'son', qiymat: 340 }, qoida: '"three hundred and forty" = 340: "and" is not written.' },
      { aytiladi: ['You need two hundred and fifty grams of flour.'], kontekst: 'Amount of flour', keyin: 'g', javob: { tur: 'son', qiymat: 250 }, qoida: '"two hundred and fifty" = 250.' },
      { aytiladi: ['The book is on sale for nineteen ninety-nine.'], kontekst: 'Book price', oldin: '£', javob: { tur: 'son', qiymat: 19.99 }, qoida: 'Two numbers said together in a price are pounds and pence: 19.99.' },
    ],
  },
];
