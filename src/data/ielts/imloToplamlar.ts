// IELTS Listening imlo mashqi: so'z to'plamlari (/uz/ielts/mashq/listening-imlo/).
// So'zlarni Tayanch o'zi tanlagan (umumiy kundalik mavzular), tashqi ro'yxatdan ko'chirilmagan.
// Imlo qoidasi: ID02 (britancha va amerikancha imlo qabul qilinadi; imlo xatosi noto'g'ri javob).
// `soz` britancha yozilishi; `variantlar` qabul qilinadigan boshqa yozilishlar (amerikancha).
// `tarjima` o'zbekcha (ekranda "Uzbek:" yorlig'i, lang="uz"), `maslahat` inglizcha (2026-11-27); muallif tekshiradi.

export interface ImloSoz {
  soz: string;
  variantlar?: string[];
  tarjima: string;
  /** Xato qilinganda ko'rsatiladigan qisqa eslatma */
  maslahat?: string;
}

export interface ImloToplam {
  id: string;
  nomi: string;
  tavsif: string;
  sozlar: ImloSoz[];
}

export const KALIT_IELTS_IMLO = 'tayanch:ielts-imlo';

export const imloToplamlar: ImloToplam[] = [
  {
    id: 'sanalar',
    nomi: 'Days and months',
    tavsif: 'Words for dates, days and time',
    sozlar: [
      { soz: 'Wednesday', tarjima: 'chorshanba', maslahat: "The d in the middle is silent: Wed-nes-day." },
      { soz: 'February', tarjima: 'fevral', maslahat: "The first r is often not heard: Feb-ru-ary." },
      { soz: 'Thursday', tarjima: 'payshanba' },
      { soz: 'September', tarjima: 'sentabr' },
      { soz: 'Saturday', tarjima: 'shanba' },
      { soz: 'January', tarjima: 'yanvar' },
      { soz: 'August', tarjima: 'avgust', maslahat: "It starts with au: Au-gust." },
      { soz: 'weekend', tarjima: 'dam olish kunlari' },
      { soz: 'fortnight', tarjima: 'ikki hafta', maslahat: "The gh is written but not heard." },
      { soz: 'December', tarjima: 'dekabr' },
    ],
  },
  {
    id: 'pul',
    nomi: 'Money and payment',
    tavsif: 'Words for banks, prices and payment',
    sozlar: [
      { soz: 'cheque', variantlar: ['check'], tarjima: 'chek (bank cheki)', maslahat: "British cheque, American check." },
      { soz: 'deposit', tarjima: "oldindan toʻlov, omonat" },
      { soz: 'receipt', tarjima: 'kvitansiya, chek', maslahat: "The p is written but not heard: re-ceipt." },
      { soz: 'discount', tarjima: 'chegirma' },
      { soz: 'instalment', variantlar: ['installment'], tarjima: "boʻlib toʻlashning bir qismi", maslahat: "British has one l (instalment), American two (installment)." },
      { soz: 'salary', tarjima: 'maosh' },
      { soz: 'refund', tarjima: 'pulni qaytarish' },
      { soz: 'insurance', tarjima: "sug'urta", maslahat: "It ends in -ance." },
      { soz: 'budget', tarjima: 'byudjet', maslahat: "The j sound is spelled dg: bu-dget." },
      { soz: 'account', tarjima: 'hisob raqam', maslahat: "Double c: ac-count." },
    ],
  },
  {
    id: 'oqish',
    nomi: 'Study and university',
    tavsif: 'Courses, classes and student life',
    sozlar: [
      { soz: 'library', tarjima: 'kutubxona', maslahat: "Two r's: li-bra-ry." },
      { soz: 'lecture', tarjima: "ma'ruza" },
      { soz: 'assignment', tarjima: 'topshiriq', maslahat: "Double s and a silent g: as-sign-ment." },
      { soz: 'seminar', tarjima: 'seminar' },
      { soz: 'tutorial', tarjima: "kichik guruh darsi" },
      { soz: 'timetable', tarjima: 'dars jadvali' },
      { soz: 'certificate', tarjima: 'sertifikat, guvohnoma' },
      { soz: 'research', tarjima: 'tadqiqot' },
      { soz: 'accommodation', tarjima: 'turar joy', maslahat: "Double c and double m: ac-com-mo-da-tion." },
      { soz: 'semester', tarjima: 'semestr' },
    ],
  },
  {
    id: 'joylar',
    nomi: 'Places and directions',
    tavsif: 'Words for towns, buildings and roads',
    sozlar: [
      { soz: 'centre', variantlar: ['center'], tarjima: 'markaz', maslahat: "British -re (centre), American -er (center)." },
      { soz: 'theatre', variantlar: ['theater'], tarjima: 'teatr', maslahat: "British -re (theatre), American -er (theater)." },
      { soz: 'museum', tarjima: 'muzey' },
      { soz: 'avenue', tarjima: 'xiyobon, keng ko\'cha' },
      { soz: 'pedestrian', tarjima: 'piyoda' },
      { soz: 'roundabout', tarjima: 'aylanma chorraha' },
      { soz: 'junction', tarjima: 'chorraha, yo\'l kesishmasi' },
      { soz: 'harbour', variantlar: ['harbor'], tarjima: 'port, bandargoh', maslahat: "British -our (harbour), American -or (harbor)." },
      { soz: 'neighbourhood', variantlar: ['neighborhood'], tarjima: 'mahalla, atrof', maslahat: "British -our-, American -or-. The gh is silent." },
      { soz: 'castle', tarjima: "qal'a", maslahat: "The t is silent: cas-tle." },
    ],
  },
  {
    id: 'kundalik',
    nomi: 'Health and daily life',
    tavsif: 'Doctors, work and services',
    sozlar: [
      { soz: 'appointment', tarjima: 'uchrashuv vaqti, qabul', maslahat: "Double p: ap-point-ment." },
      { soz: 'prescription', tarjima: 'retsept' },
      { soz: 'colleague', tarjima: 'hamkasb', maslahat: "Double l, and it ends in -gue." },
      { soz: 'questionnaire', tarjima: "so'rovnoma", maslahat: "Double n: question-naire." },
      { soz: 'programme', variantlar: ['program'], tarjima: 'dastur', maslahat: "British programme, American program (a computer program is program in British English too)." },
      { soz: 'equipment', tarjima: 'jihozlar', maslahat: "No plural -s." },
      { soz: 'environment', tarjima: 'atrof-muhit', maslahat: "The n may not be heard: envi-ron-ment." },
      { soz: 'necessary', tarjima: 'zarur', maslahat: "One c, double s: ne-ces-sa-ry." },
      { soz: 'guarantee', tarjima: 'kafolat', maslahat: "The u is silent: gu-a-ran-tee." },
      { soz: 'vegetarian', tarjima: 'vegetarian' },
    ],
  },
];
