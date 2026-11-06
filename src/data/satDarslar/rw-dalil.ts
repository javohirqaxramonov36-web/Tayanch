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
    mavzu: 'Fan: tajriba natijasi',
    qiyinlik: 'oson',
    matn: "Sinf o'quvchilari o'simliklar o'sishidagi farqni suv emas, yorug'lik keltirib chiqargan, degan xulosaga keldi. Qaysi gap suv sabab bo'lmaganini ko'rsatadi?",
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'A science class placed two groups of bean seedlings in different spots: one group on a sunny windowsill and the other inside a closed cupboard.', xato: "Tajriba sharoiti: guruhlar qayerda turganini aytadi, suvni istisno qilmaydi" },
      { matn: 'Both groups received the same amount of water every morning.' },
      { matn: 'After two weeks, the windowsill seedlings were green and upright, while the cupboard seedlings were pale and thin.', xato: "Natija: farq borligini ko'rsatadi, lekin suv sabab emasligini isbotlamaydi" },
      { matn: 'Several students noted that beans are easy plants to grow at home.', xato: "Mavzuga yaqin, lekin da'voga aloqasi yo'q" },
    ],
    togri: 1,
    yechim: "Da'vo ikki qismdan iborat: farqni yorug'lik keltirib chiqargan va suv sabab emas. Ikkala guruh bir xil suv olgan bo'lsa, suv farqni tushuntira olmaydi. Faqat 2-gap suvni istisno qiladi.",
    verified: false,
  },
  {
    id: 'rw-dalil-2',
    modul: 'rw-dalil',
    mavzu: 'Ijtimoiy fanlar: kuzatuv',
    qiyinlik: "o'rta",
    matn: "Kutubxona xodimlari kechki soatlar ayniqsa kunduzi ishlaydigan kattalarga foyda berdi, deb hisoblaydi. Qaysi gap bu fikrni eng to'g'ridan-to'g'ri qo'llab-quvvatlaydi?",
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'When the town library began staying open until nine in the evening, the staff started keeping a simple record of who came in after six.', xato: "Kontekst: kuzatuv qanday yig'ilganini aytadi, natijani emas" },
      { matn: 'Students also used the library, but they mostly came in the early afternoon, as they had before.', xato: "Boshqa guruh haqida: talabalar odati kattalar foyda ko'rganini ko'rsatmaydi" },
      { matn: 'The library also holds a large collection of local newspapers going back many decades.', xato: "Mavzuga yaqin, lekin da'voga aloqasi yo'q" },
      { matn: 'Most of the late visitors were adults who said they had come straight from work.' },
    ],
    togri: 3,
    yechim: "Da'vo kechki soatlardan kim foyda ko'rgani haqida. Kechki tashrif buyuruvchilarning ko'pi ishdan to'g'ri kelgan kattalar bo'lgani aynan shuni ko'rsatadi.",
    verified: false,
  },
  {
    id: 'rw-dalil-3',
    modul: 'rw-dalil',
    mavzu: 'Adabiyot: xarakter',
    qiyinlik: "o'rta",
    matn: "Matn soatsozni o'z ishidan ko'ra boshqalarga yordam berishni ustun qo'yadigan inson sifatida tasvirlaydi. Qaysi gap buni eng yaxshi qo'llab-quvvatlaydi?",
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'The old clockmaker opened his shop at dawn, as he had done for most of his life.', xato: "Odatni ko'rsatadi, boshqalarga munosabatni emas" },
      { matn: 'One morning, a boy came in holding a pocket watch that had stopped.', xato: "Voqeani boshlaydi, xarakterni ko'rsatmaydi" },
      { matn: 'The clockmaker set aside his own unfinished work, spent the whole afternoon on the tiny gears, and refused to take any payment.' },
      { matn: 'Outside, the street grew noisy as carts filled the market square.', xato: "Sahna tavsifi, xarakter haqida emas" },
    ],
    togri: 2,
    yechim: "Da'voda ikki narsa bor: o'z ishi va boshqalarga yordam. 3-gapda soatsoz o'z ishini chetga qo'yadi, bolaga yordam beradi va haq olmaydi, ya'ni ikkalasi ham bor.",
    verified: false,
  },
  {
    id: 'rw-dalil-4',
    modul: 'rw-dalil',
    mavzu: "Madaniyat: qo'l mehnati",
    qiyinlik: "o'rta",
    matn: "Oila qo'lda qilingan qog'oz uzoq yillar buzilmay saqlanadi, deb hisoblaydi. Qaysi gap shu da'voni eng yaxshi qo'llab-quvvatlaydi?",
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'In a small workshop near Samarkand, a family makes paper by hand from mulberry bark.', xato: "Kontekst: ustaxona haqida, chidamlilik haqida emas" },
      { matn: 'The family still keeps a notebook made in the workshop long ago, and its pages remain smooth and unbroken.' },
      { matn: 'The work is slow because every sheet is shaped and dried by hand.', xato: "Asossiz sabab-oqibat: ishning sekinligi qog'oz uzoq saqlanishini isbotlamaydi" },
      { matn: 'Visitors often buy the paper as a gift because they like its soft, slightly uneven surface.', xato: "Tashqi ko'rinish haqida, chidamlilik haqida emas" },
    ],
    togri: 1,
    yechim: "Da'vo vaqt o'tishi bilan qog'oz buzilmasligi haqida. Uzoq vaqt oldin qilingan daftar sahifalari hali ham butun ekani shuni bevosita ko'rsatadi.",
    verified: false,
  },
  {
    id: 'rw-dalil-5',
    modul: 'rw-dalil',
    mavzu: 'Fan: xulosa va dalil',
    qiyinlik: 'qiyin',
    matn: "Talaba kaptarlar uyga yo'lni faqat tanish binolarni ko'rib topmaydi, degan xulosaga keldi. Qaysi gap bu xulosani eng yaxshi qo'llab-quvvatlaydi?",
    belgilash: { tur: 'gap' },
    variantlar: [
      { matn: 'Many people assume that city pigeons find their way home mainly by recognizing familiar buildings.', xato: "Rad etilayotgan qarash (teskari fikr), dalil emas" },
      { matn: 'To test this idea, a student released trained pigeons in a field the birds had never visited, far from any landmarks they knew.', xato: "Tajriba usuli: natijani aytmaydi" },
      { matn: 'Most of the birds still returned to their loft.' },
      { matn: 'The student concluded that familiar landmarks alone cannot explain how pigeons find their way.', xato: "Da'voning o'zi: xulosani takrorlaydi, dalil emas" },
    ],
    togri: 2,
    yechim: "Dalil kuzatilgan natija bo'lishi kerak. Qushlar tanish belgilar yo'q joydan ham qaytgani xulosani qo'llab-quvvatlaydi. 4-gap esa xulosaning o'zi, uni dalil deb bo'lmaydi.",
    verified: false,
  },
];
