// IELTS Listening "Harf va raqam diktanti" (/uz/ielts/mashq/listening-raqamlar/).
// Hamma gap, ism va raqam Tayanch tomonidan yozilgan (original, "Namuna"); tashqi test yoki imtihon materiali emas.
// Telefon raqamlari Ofcom'ning badiiy asarlar uchun ajratilgan oralig'idan olingan (haqiqiy abonentga tegishli emas; tekshirish kerak).
// Sana qoidasi: ID03 (IDP). O'zbekcha `kontekst` va `qoida` matnini muallif tekshiradi.
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

const DOUBLE = '"double" harfni (yoki raqamni) ikki marta yozishni bildiradi.';

export const raqamToplamlar: RaqamToplam[] = [
  {
    id: 'ismlar',
    nomi: 'Harflab aytilgan ismlar',
    tavsif: 'Familiya harfma-harf aytiladi',
    klaviatura: 'text',
    savollar: [
      { aytiladi: ["My surname's Brennan. That's", ...harflar('B R E'), 'double N', 'A', 'N'], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Brennan' }, qoida: DOUBLE },
      { aytiladi: ["It's Whitfield.", ...harflar('W H I T F I E L D')], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Whitfield' }, qoida: 'I va E ni chalkashtirmang: I "ay", E "i" deb aytiladi.' },
      { aytiladi: ['The name is Gallagher.', 'G', 'A', 'double L', ...harflar('A G H E R')], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Gallagher' }, qoida: `${DOUBLE} G "ji", J "jey" deb aytiladi.` },
      { aytiladi: ["That's Okafor.", ...harflar('O K A F O R')], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Okafor' }, qoida: 'A "ey", E "i" deb aytiladi.' },
      { aytiladi: ['Jessop.', 'J', 'E', 'double S', 'O', 'P'], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Jessop' }, qoida: DOUBLE },
      { aytiladi: ['Featherstone.', ...harflar('F E A T H E R S T O N E')], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Featherstone' }, qoida: 'Uzun ismni bo\'g\'inlarga bo\'lib yozing: Feather-stone.' },
      { aytiladi: ["It's Quayle.", ...harflar('Q U A Y L E')], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Quayle' }, qoida: 'Q "kyu", U "yu" deb aytiladi.' },
      { aytiladi: ['Vickers.', ...harflar('V I C K E R S')], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Vickers' }, qoida: 'V va B ni chalkashtirmang: V "vi", B "bi".' },
      { aytiladi: ['Haddington.', 'H', 'A', 'double D', ...harflar('I N G T O N')], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Haddington' }, qoida: DOUBLE },
      { aytiladi: ['Yarwood.', ...harflar('Y A R W'), 'double O', 'D'], kontekst: 'Familiyasi', javob: { tur: 'harf', matn: 'Yarwood' }, qoida: `${DOUBLE} Y "uay", W "dabl-yu" deb aytiladi.` },
    ],
  },
  {
    id: 'telefon',
    nomi: 'Telefon raqamlari',
    tavsif: '"oh", "double" va "triple" bilan',
    klaviatura: 'tel',
    savollar: [
      { aytiladi: ["My mobile number is", 'oh seven seven double oh,', 'nine double oh,', 'four six one.'], kontekst: 'Telefon raqami', javob: { tur: 'raqam', raqamlar: '07700900461' }, qoida: '"oh" nolni bildiradi; "double oh" = 00.' },
      { aytiladi: ['You can call the office on', 'oh one six three two,', 'nine six oh,', 'seven two eight.'], kontekst: 'Ofis telefoni', javob: { tur: 'raqam', raqamlar: '01632960728' }, qoida: '"oh" nolni bildiradi.' },
      { aytiladi: ["It's", 'oh two oh,', 'seven nine four six,', 'oh five double three.'], kontekst: 'Telefon raqami', javob: { tur: 'raqam', raqamlar: '02079460533' }, qoida: '"double three" = 33.' },
      { aytiladi: ['The number is', 'oh seven seven double oh,', 'nine double oh,', 'double one eight.'], kontekst: 'Telefon raqami', javob: { tur: 'raqam', raqamlar: '07700900118' }, qoida: '"double one" = 11.' },
      { aytiladi: ['Ring us on', 'oh one six three two,', 'nine six oh,', 'triple nine.'], kontekst: 'Telefon raqami', javob: { tur: 'raqam', raqamlar: '01632960999' }, qoida: '"triple nine" = 999: raqam uch marta yoziladi.' },
      { aytiladi: ['My home number is', 'oh one six one,', 'four nine six,', 'oh seven five four.'], kontekst: 'Uy telefoni', javob: { tur: 'raqam', raqamlar: '01614960754' }, qoida: '"oh" nolni bildiradi.' },
      { aytiladi: ["It's", 'oh one one three,', 'four nine six,', 'oh double two one.'], kontekst: 'Telefon raqami', javob: { tur: 'raqam', raqamlar: '01134960221' }, qoida: '"double two" = 22.' },
      { aytiladi: ['Text me on', 'oh seven seven double oh,', 'nine double oh,', 'three five oh.'], kontekst: 'Telefon raqami', javob: { tur: 'raqam', raqamlar: '07700900350' }, qoida: 'Oxiridagi "oh" ham nol: 350.' },
      { aytiladi: ['The reception number is', 'oh one one seven,', 'four nine six,', 'oh double eight four.'], kontekst: 'Qabulxona telefoni', javob: { tur: 'raqam', raqamlar: '01174960884' }, qoida: '"double eight" = 88.' },
      { aytiladi: ["It's", 'oh two oh,', 'seven nine four six,', 'double oh one oh.'], kontekst: 'Telefon raqami', javob: { tur: 'raqam', raqamlar: '02079460010' }, qoida: '"double oh" = 00, oxiridagi "oh" ham nol.' },
    ],
  },
  {
    id: 'sana-vaqt',
    nomi: 'Sana va vaqt',
    tavsif: 'Kun, oy va soat',
    klaviatura: 'text',
    savollar: [
      { aytiladi: ['The course starts on the twenty-first of February.'], kontekst: 'Kurs boshlanadigan sana', javob: { tur: 'sana', kun: 21, oy: 2 }, qoida: '"the" va "of" yozilmaydi: 21 February yoki February 21.' },
      { aytiladi: ['Can you come on March the third?'], kontekst: 'Uchrashuv sanasi', javob: { tur: 'sana', kun: 3, oy: 3 }, qoida: 'March the third = 3 March.' },
      { aytiladi: ["The deadline is the thirteenth of September."], kontekst: 'Topshirish muddati', javob: { tur: 'sana', kun: 13, oy: 9 }, qoida: 'thirTEEN (13) da urg\'u oxirida, THIRty (30) da boshida.' },
      { aytiladi: ['We leave on the thirtieth of June.'], kontekst: 'Jo\'nash sanasi', javob: { tur: 'sana', kun: 30, oy: 6 }, qoida: 'thirtieth = 30, thirteenth = 13.' },
      { aytiladi: ["The museum reopens on August the second."], kontekst: 'Muzey ochiladigan sana', javob: { tur: 'sana', kun: 2, oy: 8 }, qoida: 'second = 2-chi.' },
      { aytiladi: ['The tour begins at half past seven.'], kontekst: 'Boshlanish vaqti', javob: { tur: 'vaqt', soat: 7, daqiqa: 30 }, qoida: '"half past seven" = 7.30.' },
      { aytiladi: ['Please arrive by quarter to nine.'], kontekst: 'Kelish vaqti', javob: { tur: 'vaqt', soat: 8, daqiqa: 45 }, qoida: '"quarter to nine" = 9 dan 15 daqiqa oldin = 8.45.' },
      { aytiladi: ['The bus leaves at ten fifteen.'], kontekst: 'Avtobus vaqti', javob: { tur: 'vaqt', soat: 10, daqiqa: 15 }, qoida: '"ten fifteen" = 10.15.' },
      { aytiladi: ['The talk finishes at twenty past four.'], kontekst: 'Tugash vaqti', javob: { tur: 'vaqt', soat: 4, daqiqa: 20 }, qoida: '"twenty past four" = 4.20.' },
      { aytiladi: ['Your room is booked from the first of December.'], kontekst: 'Bron sanasi', javob: { tur: 'sana', kun: 1, oy: 12 }, qoida: 'first = 1: 1 December.' },
    ],
  },
  {
    id: 'narx-olcham',
    nomi: "Narx va o'lchamlar",
    tavsif: "Funt, pens, metr va og'irlik",
    klaviatura: 'decimal',
    savollar: [
      { aytiladi: ['A single ticket costs fifteen pounds.'], kontekst: 'Bilet narxi', oldin: '£', javob: { tur: 'son', qiymat: 15 }, qoida: 'fifTEEN (15) da urg\'u oxirida, FIFty (50) da boshida.' },
      { aytiladi: ['The deposit is fifty pounds.'], kontekst: 'Garov puli', oldin: '£', javob: { tur: 'son', qiymat: 50 }, qoida: 'FIFty (50): urg\'u boshida.' },
      { aytiladi: ['Lunch is twelve pounds fifty.'], kontekst: 'Tushlik narxi', oldin: '£', javob: { tur: 'son', qiymat: 12.5 }, qoida: '"twelve pounds fifty" = 12.50.' },
      { aytiladi: ['A coffee is eighty-five pence.'], kontekst: 'Qahva narxi', keyin: 'p', javob: { tur: 'son', qiymat: 85 }, qoida: 'pence (p) = pens.' },
      { aytiladi: ['The table is two point seven five metres long.'], kontekst: 'Stol uzunligi', keyin: 'm', javob: { tur: 'son', qiymat: 2.75 }, qoida: '"point" o\'nli nuqtani bildiradi: 2.75.' },
      { aytiladi: ['The path is one and a half kilometres.'], kontekst: "Yo'l uzunligi", keyin: 'km', javob: { tur: 'son', qiymat: 1.5 }, qoida: '"one and a half" = 1.5.' },
      { aytiladi: ['The fee for the year is fifteen hundred pounds.'], kontekst: "Yillik to'lov", oldin: '£', javob: { tur: 'son', qiymat: 1500 }, qoida: '"fifteen hundred" = 1500.' },
      { aytiladi: ['The flat is three hundred and forty square metres.'], kontekst: 'Kvartira maydoni', keyin: 'm²', javob: { tur: 'son', qiymat: 340 }, qoida: '"three hundred and forty" = 340: "and" yozilmaydi.' },
      { aytiladi: ['You need two hundred and fifty grams of flour.'], kontekst: 'Un miqdori', keyin: 'g', javob: { tur: 'son', qiymat: 250 }, qoida: '"two hundred and fifty" = 250.' },
      { aytiladi: ['The book is on sale for nineteen ninety-nine.'], kontekst: 'Kitob narxi', oldin: '£', javob: { tur: 'son', qiymat: 19.99 }, qoida: 'Narxda ikki son ketma-ket aytilsa: funt va pens, 19.99.' },
    ],
  },
];
