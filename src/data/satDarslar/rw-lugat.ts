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
    mavzu: "Bo'sh joy: ishora gapning o'zida",
    qiyinlik: 'oson',
    matn: 'The guide warned the hikers that the trail was ______ after the storm: fallen branches covered the path, and parts of it had washed away.',
    variantlar: [
      { matn: 'scenic', xato: "Mavzuga yaqin: so'qmoq haqida, lekin ikki nuqtadan keyingi ishora (shoxlar, yuvilgan joylar) xavf haqida" },
      { matn: 'crowded', xato: "Ohang mos (salbiy), lekin ma'no boshqa: odam ko'pligi haqida ishora yo'q" },
      { matn: 'hazardous' },
      { matn: 'familiar', xato: "Ishorasiz tanlov: tanishlik haqida gapda hech narsa yo'q" },
    ],
    togri: 2,
    yechim: "Ikki nuqtadan keyingi qism bo'sh joyni tushuntiradi: shoxlar yo'lni yopgan, bir qismi yuvilib ketgan. Demak so'qmoq xavfli: \"hazardous\".",
    verified: false,
  },
  {
    id: 'rw-lugat-2',
    modul: 'rw-lugat',
    mavzu: "Ko'p ma'noli so'z: address",
    qiyinlik: "o'rta",
    matn: 'The mayor promised to address the shortage of clean water before the summer, starting with repairs to the old pipes. As used in the text, what does "address" most nearly mean?',
    variantlar: [
      { matn: 'write a location on', xato: "Asosiy ma'no tuzog'i: \"address\" ning eng tanish ma'nosi (manzil), lekin gapda xat yo'q" },
      { matn: 'deal with' },
      { matn: 'give a speech to', xato: "Boshqa ma'no: \"address a crowd\" dagi ma'no, lekin bu yerda tanqislikka nutq so'zlanmaydi" },
      { matn: 'send a letter to', xato: "Asosiy ma'noga yaqin: xat jo'natish, gapda esa quvurlar ta'miri bor" },
    ],
    togri: 1,
    yechim: "\"starting with repairs to the old pipes\" ishorasi: mer muammoni hal qilishni quvurlar ta'miridan boshlaydi. \"address\" bu yerda \"hal qilishga kirishmoq\": \"deal with\".",
    verified: false,
  },
  {
    id: 'rw-lugat-3',
    modul: 'rw-lugat',
    mavzu: "Bo'sh joy: \"Unlike\" qarama-qarshi ishora",
    qiyinlik: "o'rta",
    matn: 'Unlike his talkative classmates, the new student was ______: he rarely spoke during lessons, though his written answers showed careful thought.',
    variantlar: [
      { matn: 'outspoken', xato: "Teskari ma'no: \"Unlike talkative\" kam gapiradiganni talab qiladi, bu esa ochiq gapiradigan" },
      { matn: 'careless', xato: "Gapga zid: yozma javoblari puxta o'ylangan (careful thought)" },
      { matn: 'curious', xato: "Ishorasiz tanlov: qiziquvchanlik haqida gapda dalil yo'q" },
      { matn: 'reserved' },
    ],
    togri: 3,
    yechim: "\"Unlike his talkative classmates\" va \"he rarely spoke\" ikkalasi kam gapirishni ko'rsatadi. \"reserved\" (kamgap, o'zini tutadigan) mos.",
    verified: false,
  },
  {
    id: 'rw-lugat-4',
    modul: 'rw-lugat',
    mavzu: "Bo'sh joy: ohang \"but\" dan keyin o'zgaradi",
    qiyinlik: 'qiyin',
    matn: "Critics had expected the young director's second film to be a minor effort, but its careful pacing and inventive camera work proved them wrong; several reviewers called it ______.",
    variantlar: [
      { matn: 'modest', xato: "Ohang tuzog'i: tanqidchilarning kutgani (minor effort), \"but … proved them wrong\" esa teskarisini aytadi" },
      { matn: 'remarkable' },
      { matn: 'predictable', xato: "Teskari ohang: \"inventive\" bilan zid, salbiy baho" },
      { matn: 'expensive', xato: "Mavzuga yaqin: film haqida, lekin narx haqida ishora yo'q" },
    ],
    togri: 1,
    yechim: "\"but … proved them wrong\": film kutilganidan yaxshi chiqqan, \"careful pacing and inventive camera work\" yuqori baho. Ijobiy va kuchli so'z kerak: \"remarkable\".",
    verified: false,
  },
  {
    id: 'rw-lugat-5',
    modul: 'rw-lugat',
    mavzu: "Ko'p ma'noli so'z: sharp",
    qiyinlik: 'qiyin',
    matn: 'After the factory closed, the town saw a sharp drop in the number of families who could afford to eat at local restaurants. As used in the text, what does "sharp" most nearly mean?',
    variantlar: [
      { matn: 'pointed', xato: "Asosiy ma'no tuzog'i: pichoq yoki uchli narsa haqida, gapda esa son kamaygan" },
      { matn: 'intelligent', xato: "Boshqa ma'no: \"a sharp student\" dagi ma'no, kamayishga mos emas" },
      { matn: 'sudden' },
      { matn: 'harsh in tone', xato: "Boshqa ma'no: \"sharp words\" dagi ma'no, ovoz yoki gap ohangi haqida" },
    ],
    togri: 2,
    yechim: "\"drop in the number\" ishorasi: so'z kamayish qanday bo'lganini aytadi. Zavod yopilgandan keyin tez va keskin kamaygan: \"sudden\".",
    verified: false,
  },
];
