// IELTS Reading: "Matching headings" (IE02). 5 ta mashq: bitta paragraf, to'rt sarlavha, eng mosini tanlash.
// Paragraflar Tayanch uchun yozilgan, vaziyatlar o'ylab topilgan (namuna): ular haqiqiy joy yoki voqea haqida ma'lumot emas.
// Haqiqiy imtihonda sarlavhalar ro'yxati bir nechta paragrafga beriladi; bu yerda har mashq bitta paragraf.
// Noto'g'ri variantda xato = shu sarlavhani tanlatadigan tipik xato (detal, kalit so'z, juda keng, matnda yo'q).
// Ikkinchi usul: tekshiruv.ts (har sarlavha paragraf qismlari bo'yicha qamrov jadvali bilan baholanadi).
import type { DarsSavol } from './turlar';

const MATN = 'Which heading best summarises the main idea of the paragraph?';

export const irSarlavhaSavollar: DarsSavol[] = [
  {
    id: 'ir-sarlavha-1',
    modul: 'ir-sarlavha',
    mavzu: 'Asosiy fikr va kirish',
    qiyinlik: 'oson',
    parcha: 'Many small towns have lost their weekly markets as large supermarkets opened nearby. In one hill town, however, the market has grown. Farmers now sell there every Saturday, and the town has added a covered area so that the market can continue in winter. Local people say it is busier than it has been for decades.',
    matn: MATN,
    variantlar: [
      { matn: 'How supermarkets changed shopping', xato: "Kirish gapiga aldanish: supermarketlar faqat fon, paragraf ular haqida emas" },
      { matn: 'A market that grew against the trend' },
      { matn: 'A new roof for the winter months', xato: "Detalni asosiy fikr deb olish: yopiq joy faqat bitta misol" },
      { matn: 'The history of farming in the region', xato: "Kalit so'zga aldanish: \"farmers\" bor, lekin dehqonchilik tarixi yo'q" },
    ],
    togri: 1,
    yechim: "Birinchi gap umumiy holatni beradi, \"however\" dan keyin asosiy fikr keladi: shu shaharda bozor aksincha o'sgan. Qolgan gaplar shuni misollar bilan ko'rsatadi.",
    verified: false,
  },
  {
    id: 'ir-sarlavha-2',
    modul: 'ir-sarlavha',
    mavzu: 'Ijobiy va salbiy natija',
    qiyinlik: "o'rta",
    parcha: 'A city school tried starting lessons an hour later for one term. Teachers recorded fewer students arriving late, and many students said they felt less tired in morning classes. However, some parents found the new timetable difficult because it no longer matched their working hours.',
    matn: MATN,
    variantlar: [
      { matn: 'Why students arrive late', xato: "Kalit so'zga aldanish: kechikish tilga olingan, lekin sababi tushuntirilmagan" },
      { matn: "Parents' working hours", xato: "Detalni asosiy fikr deb olish: ota-onalar faqat bitta natija" },
      { matn: 'Mixed results from a later school day' },
      { matn: 'Students feel less tired', xato: "Qismni butun deb olish: faqat ijobiy tomon, \"However\" dan keyingi qism yo'q" },
    ],
    togri: 2,
    yechim: "Paragrafda ikki tomon bor: o'quvchilar uchun foyda va ota-onalar uchun qiyinchilik. Ikkalasini qamraydigan sarlavha: \"aralash natija\".",
    verified: false,
  },
  {
    id: 'ir-sarlavha-3',
    modul: 'ir-sarlavha',
    mavzu: 'Muammo va yechim',
    qiyinlik: "o'rta",
    parcha: 'When the neighbourhood first put out recycling bins, very little was collected, because people were unsure what could go in them. The council then printed simple pictures on each bin showing which items belonged inside. Within months, the amount of correctly sorted waste had risen sharply.',
    matn: MATN,
    variantlar: [
      { matn: 'The cost of new recycling bins', xato: "Matnda yo'q fikr: narx haqida hech narsa aytilmagan" },
      { matn: 'Confusion among residents', xato: "Qismni butun deb olish: faqat muammo, yechim va natija yo'q" },
      { matn: 'Why recycling matters for the planet', xato: "Juda keng sarlavha: paragraf bitta mahalladagi holat haqida" },
      { matn: 'Clear pictures solve a sorting problem' },
    ],
    togri: 3,
    yechim: "Tuzilish: muammo (nimani tashlashni bilmaslik), yechim (rasmlar), natija (to'g'ri saralash oshdi). Uchala qismni qamraydigan sarlavha faqat bitta.",
    verified: false,
  },
  {
    id: 'ir-sarlavha-4',
    modul: 'ir-sarlavha',
    mavzu: "Rad etilgan qarash",
    qiyinlik: 'qiyin',
    parcha: 'Translators are often imagined as people who simply replace each word with its equal in another language. In practice, the work involves constant choices. A joke may have to be replaced by a different joke, and a polite phrase in one culture may sound cold in another. Good translators therefore think about the effect on the reader as much as the meaning of the words.',
    matn: MATN,
    variantlar: [
      { matn: 'Translation as a series of choices about effect' },
      { matn: 'Translating jokes', xato: "Detalni asosiy fikr deb olish: hazil faqat misol" },
      { matn: 'A common view of translators', xato: "Rad etilgan qarashni asosiy fikr deb olish: birinchi gapdagi fikrni muallif inkor qiladi" },
      { matn: 'Learning a second language', xato: "Kalit so'zga aldanish: \"language\" bor, lekin til o'rganish haqida emas" },
    ],
    togri: 0,
    yechim: "Birinchi gap keng tarqalgan qarash, \"In practice\" uni rad etadi. Asosiy fikr: tarjima tanlovlar ketma-ketligi, va oxirgi gap uni o'quvchiga ta'sir bilan bog'laydi.",
    verified: false,
  },
  {
    id: 'ir-sarlavha-5',
    modul: 'ir-sarlavha',
    mavzu: "O'zgarish: oldin va hozir",
    qiyinlik: 'qiyin',
    parcha: "For years, the old railway bridge was seen as an ugly reminder of the town's lost industry, and several plans to pull it down were discussed. A group of residents argued that it could be useful instead. Today it carries a footpath and a cycle lane, and it has become one of the most photographed places in the town.",
    matn: MATN,
    variantlar: [
      { matn: 'Plans to pull down the bridge', xato: "Qismni butun deb olish: faqat \"oldin\" qismi, rejalar amalga oshmagan" },
      { matn: 'The decline of local industry', xato: "Fonni asosiy fikr deb olish: sanoat faqat ko'prik nega yoqmaganini tushuntiradi" },
      { matn: 'A popular place for photographers', xato: "Detalni asosiy fikr deb olish: suratga olish faqat oxirgi natija" },
      { matn: 'From unwanted structure to valued landmark' },
    ],
    togri: 3,
    yechim: "Paragraf o'zgarish haqida: oldin keraksiz deb ko'rilgan ko'prik endi qadrli joy. Faqat shu sarlavha boshini ham, oxirini ham qamraydi.",
    verified: false,
  },
];
