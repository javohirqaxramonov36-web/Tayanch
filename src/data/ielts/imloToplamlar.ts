// IELTS Listening imlo mashqi: so'z to'plamlari (/uz/ielts/mashq/listening-imlo/).
// So'zlarni Tayanch o'zi tanlagan (umumiy kundalik mavzular), tashqi ro'yxatdan ko'chirilmagan.
// Imlo qoidasi: ID02 (britancha va amerikancha imlo qabul qilinadi; imlo xatosi noto'g'ri javob).
// `soz` britancha yozilishi; `variantlar` qabul qilinadigan boshqa yozilishlar (amerikancha).
// O'zbekcha `tarjima` va `maslahat` matnini muallif tekshiradi.

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
    nomi: 'Kunlar va oylar',
    tavsif: "Sana, kun va vaqt so'zlari",
    sozlar: [
      { soz: 'Wednesday', tarjima: 'chorshanba', maslahat: "O'rtadagi d eshitilmaydi: Wed-nes-day." },
      { soz: 'February', tarjima: 'fevral', maslahat: 'Birinchi r ko\'pincha eshitilmaydi: Feb-ru-ary.' },
      { soz: 'Thursday', tarjima: 'payshanba' },
      { soz: 'September', tarjima: 'sentabr' },
      { soz: 'Saturday', tarjima: 'shanba' },
      { soz: 'January', tarjima: 'yanvar' },
      { soz: 'August', tarjima: 'avgust', maslahat: 'Boshida au: Au-gust.' },
      { soz: 'weekend', tarjima: 'dam olish kunlari' },
      { soz: 'fortnight', tarjima: 'ikki hafta', maslahat: 'gh yoziladi, lekin eshitilmaydi.' },
      { soz: 'December', tarjima: 'dekabr' },
    ],
  },
  {
    id: 'pul',
    nomi: "Pul va to'lov",
    tavsif: "Bank, narx va to'lov so'zlari",
    sozlar: [
      { soz: 'cheque', variantlar: ['check'], tarjima: 'chek (bank cheki)', maslahat: 'Britancha cheque, amerikancha check.' },
      { soz: 'deposit', tarjima: "oldindan to'lov, omonat" },
      { soz: 'receipt', tarjima: 'kvitansiya, chek', maslahat: 'p yoziladi, lekin eshitilmaydi: re-ceipt.' },
      { soz: 'discount', tarjima: 'chegirma' },
      { soz: 'instalment', variantlar: ['installment'], tarjima: "bo'lib to'lashning bir qismi", maslahat: 'Britancha bitta l (instalment), amerikancha ikkita (installment).' },
      { soz: 'salary', tarjima: 'maosh' },
      { soz: 'refund', tarjima: 'pulni qaytarish' },
      { soz: 'insurance', tarjima: "sug'urta", maslahat: 'Oxiri -ance.' },
      { soz: 'budget', tarjima: 'byudjet', maslahat: "j tovushi dg bilan yoziladi: bu-dget." },
      { soz: 'account', tarjima: 'hisob raqam', maslahat: 'Ikkita c: ac-count.' },
    ],
  },
  {
    id: 'oqish',
    nomi: "O'qish va universitet",
    tavsif: "Kurs, dars va talabalar hayoti",
    sozlar: [
      { soz: 'library', tarjima: 'kutubxona', maslahat: 'Ikkita r: li-bra-ry.' },
      { soz: 'lecture', tarjima: "ma'ruza" },
      { soz: 'assignment', tarjima: 'topshiriq', maslahat: 'Ikkita s va eshitilmaydigan g: as-sign-ment.' },
      { soz: 'seminar', tarjima: 'seminar' },
      { soz: 'tutorial', tarjima: "kichik guruh darsi" },
      { soz: 'timetable', tarjima: 'dars jadvali' },
      { soz: 'certificate', tarjima: 'sertifikat, guvohnoma' },
      { soz: 'research', tarjima: 'tadqiqot' },
      { soz: 'accommodation', tarjima: 'turar joy', maslahat: 'Ikkita c va ikkita m: ac-com-mo-da-tion.' },
      { soz: 'semester', tarjima: 'semestr' },
    ],
  },
  {
    id: 'joylar',
    nomi: "Joylar va yo'nalish",
    tavsif: "Shahar, bino va yo'l so'zlari",
    sozlar: [
      { soz: 'centre', variantlar: ['center'], tarjima: 'markaz', maslahat: 'Britancha -re (centre), amerikancha -er (center).' },
      { soz: 'theatre', variantlar: ['theater'], tarjima: 'teatr', maslahat: 'Britancha -re (theatre), amerikancha -er (theater).' },
      { soz: 'museum', tarjima: 'muzey' },
      { soz: 'avenue', tarjima: 'xiyobon, keng ko\'cha' },
      { soz: 'pedestrian', tarjima: 'piyoda' },
      { soz: 'roundabout', tarjima: 'aylanma chorraha' },
      { soz: 'junction', tarjima: 'chorraha, yo\'l kesishmasi' },
      { soz: 'harbour', variantlar: ['harbor'], tarjima: 'port, bandargoh', maslahat: 'Britancha -our (harbour), amerikancha -or (harbor).' },
      { soz: 'neighbourhood', variantlar: ['neighborhood'], tarjima: 'mahalla, atrof', maslahat: 'Britancha -our-, amerikancha -or-. gh eshitilmaydi.' },
      { soz: 'castle', tarjima: "qal'a", maslahat: 't eshitilmaydi: cas-tle.' },
    ],
  },
  {
    id: 'kundalik',
    nomi: "Sog'liq va kundalik hayot",
    tavsif: "Shifokor, ish va xizmatlar",
    sozlar: [
      { soz: 'appointment', tarjima: 'uchrashuv vaqti, qabul', maslahat: 'Ikkita p: ap-point-ment.' },
      { soz: 'prescription', tarjima: 'retsept' },
      { soz: 'colleague', tarjima: 'hamkasb', maslahat: 'Ikkita l, oxiri -gue.' },
      { soz: 'questionnaire', tarjima: "so'rovnoma", maslahat: 'Ikkita n: question-naire.' },
      { soz: 'programme', variantlar: ['program'], tarjima: 'dastur', maslahat: 'Britancha programme, amerikancha program (kompyuter dasturi britanchada ham program).' },
      { soz: 'equipment', tarjima: 'jihozlar', maslahat: "Ko'plik -s qo'shilmaydi." },
      { soz: 'environment', tarjima: 'atrof-muhit', maslahat: 'n eshitilmay qolishi mumkin: envi-ron-ment.' },
      { soz: 'necessary', tarjima: 'zarur', maslahat: 'Bitta c, ikkita s: ne-ces-sa-ry.' },
      { soz: 'guarantee', tarjima: 'kafolat', maslahat: 'u eshitilmaydi: gu-a-ran-tee.' },
      { soz: 'vegetarian', tarjima: 'vegetarian' },
    ],
  },
];
