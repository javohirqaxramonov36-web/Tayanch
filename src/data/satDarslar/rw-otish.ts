// SAT Reading & Writing: "O'tish so'zlari" (Expression of Ideas). 5 ta mashq.
// Matnlar Tayanch uchun yozilgan, College Board savollaridan ko'chirilmagan va parafraz qilinmagan.
// Vaziyatlar o'ylab topilgan (namuna). Har savolda 4 variant 4 xil ma'no munosabatidan:
// qarama-qarshilik, sabab-natija, misol, davom. Noto'g'ri variantda xato = nega bu munosabat mos emas.
// Ikkinchi usul: rw-tekshiruv.ts (munosabat jadvali bo'yicha har variant alohida baholanadi).
import type { DarsSavol } from './turlar';

const XATO = {
  zid: "Qarama-qarshilik so'zi: 2-gap 1-gapga qarshi chiqmaydi",
  sabab: "Sabab-natija so'zi: 2-gap 1-gapdan kelib chiqqan natija emas",
  misol: "Misol so'zi: 2-gap 1-gapdagi umumiy fikrning aniq misoli emas",
  davom: "Davom so'zi: 2-gap yangi, bir yo'nalishdagi fikr qo'shmaydi",
};

export const rwOtishSavollar: DarsSavol[] = [
  {
    id: 'rw-otish-1',
    modul: 'rw-otish',
    mavzu: 'Qarama-qarshilik: keng tarqalgan fikr va fakt',
    qiyinlik: 'oson',
    matn: 'Many people assume that cacti need almost no water. ______ most cactus species grow faster and flower more often when they are watered regularly during the warm months.',
    variantlar: [
      { matn: 'For example,', xato: XATO.misol },
      { matn: 'However,' },
      { matn: 'As a result,', xato: XATO.sabab },
      { matn: 'Moreover,', xato: XATO.davom },
    ],
    togri: 1,
    yechim: "1-gap ko'pchilikning taxmini (suv deyarli kerak emas), 2-gap unga qarshi fakt (muntazam sug'orilsa yaxshi o'sadi). Munosabat: qarama-qarshilik, demak \"However,\".",
    verified: false,
  },
  {
    id: 'rw-otish-2',
    modul: 'rw-otish',
    mavzu: 'Sabab-natija: voqea va oqibat',
    qiyinlik: 'oson',
    matn: "The village's only road was buried under a landslide in early spring. ______ the weekly market was moved to a field on the other side of the river until the repairs were finished.",
    variantlar: [
      { matn: 'Nevertheless,', xato: XATO.zid },
      { matn: 'For instance,', xato: XATO.misol },
      { matn: 'Therefore,' },
      { matn: 'In addition,', xato: XATO.davom },
    ],
    togri: 2,
    yechim: "Yo'l ko'milgani sabab, bozorning boshqa joyga ko'chirilgani uning natijasi. Munosabat: sabab-natija, demak \"Therefore,\".",
    verified: false,
  },
  {
    id: 'rw-otish-3',
    modul: 'rw-otish',
    mavzu: 'Misol: umumiy fikr va aniq holat',
    qiyinlik: "o'rta",
    matn: 'Some birds use tools to reach food they could not get otherwise. ______ certain crows bend thin twigs into hooks and use them to pull insects out of narrow holes in tree bark.',
    variantlar: [
      { matn: 'Consequently,', xato: XATO.sabab },
      { matn: 'Furthermore,', xato: XATO.davom },
      { matn: 'However,', xato: XATO.zid },
      { matn: 'For instance,' },
    ],
    togri: 3,
    yechim: "1-gap umumiy fikr (ba'zi qushlar asbob ishlatadi), 2-gap uning aniq holati (qarg'alar novdadan ilgak yasaydi). Yangi fikr emas, o'sha fikrning misoli. Demak \"For instance,\".",
    verified: false,
  },
  {
    id: 'rw-otish-4',
    modul: 'rw-otish',
    mavzu: "Davom: bir yo'nalishdagi ikkinchi foyda",
    qiyinlik: "o'rta",
    matn: "Planting trees along the school's parking lot kept the parked cars noticeably cooler in summer. ______ the trees' roots helped hold the soil in place during heavy rain, so less mud washed onto the nearby path.",
    variantlar: [
      { matn: 'In addition,' },
      { matn: 'In contrast,', xato: XATO.zid },
      { matn: 'For example,', xato: XATO.misol },
      { matn: 'As a result,', xato: XATO.sabab },
    ],
    togri: 0,
    yechim: "Ikkala gap daraxtlarning foydasi haqida: biri soya, ikkinchisi tuproqni ushlash. Ildizlar tuproqni ushlashi mashinalar salqin bo'lganining natijasi emas. Munosabat: davom, demak \"In addition,\".",
    verified: false,
  },
  {
    id: 'rw-otish-5',
    modul: 'rw-otish',
    mavzu: "Qarama-qarshilik: kamchilikka qaramay",
    qiyinlik: 'qiyin',
    matn: "The team's first prototype of the water filter was heavy, slow, and expensive to build. ______ it removed nearly all of the sediment from the river water during the field test, so the engineers decided to keep its basic design.",
    variantlar: [
      { matn: 'Therefore,', xato: "Sabab-natija so'zi: gap oxiridagi \"so\" tuzog'i; filtr yaxshi tozalagani og'ir va qimmatligidan kelib chiqmaydi" },
      { matn: 'Specifically,', xato: XATO.misol },
      { matn: 'Nevertheless,' },
      { matn: 'Furthermore,', xato: "Davom so'zi: 1-gap kamchiliklar, 2-gap yutuq; ular bir yo'nalishda emas" },
    ],
    togri: 2,
    yechim: "1-gap kamchiliklarni sanaydi, 2-gap ularga qaramay yutuqni aytadi. Munosabat: qarama-qarshilik (yon berish), demak \"Nevertheless,\". 2-gapdagi \"so\" boshqa bog'lanish: u yutuq va qarorni ulaydi.",
    verified: false,
  },
];
