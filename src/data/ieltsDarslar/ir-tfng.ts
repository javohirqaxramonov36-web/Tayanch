// IELTS Reading: "True / False / Not Given" (IE02: Identifying information). 5 ta mashq.
// Parchalar Tayanch uchun yozilgan, vaziyatlar o'ylab topilgan (namuna): ular haqiqiy joy, odam yoki voqea haqida ma'lumot emas.
// variantlar tartibi doim True, False, Not Given. Noto'g'ri variantda xato = shu javobga olib keladigan tipik xato nomi.
// Ikkinchi usul: tekshiruv.ts (har parcha gapi da'voga nisbatan alohida baholanadi).
import type { DarsSavol } from './turlar';

const tfng = (togri: 0 | 1 | 2, xato: [string, string]): Pick<DarsSavol, 'variantlar' | 'togri'> => {
  const nomlar = ['True', 'False', 'Not Given'];
  let k = 0;
  return { togri, variantlar: nomlar.map((matn, j) => (j === togri ? { matn } : { matn, xato: xato[k++] })) };
};

export const irTfngSavollar: DarsSavol[] = [
  {
    id: 'ir-tfng-1',
    modul: 'ir-tfng',
    mavzu: 'Parafraz: boshqa so\'zlar bilan',
    qiyinlik: 'oson',
    parcha: 'The hill town museum was founded by a group of retired teachers. For its first ten years, it opened only at weekends. When the town gave it a larger building, it began opening every day except Monday.',
    matn: 'Statement: The museum is now closed on one day each week.',
    ...tfng(0, [
      "Parafrazni zid deb o'qish: \"every day except Monday\" bitta yopiq kunni tasdiqlaydi",
      "Parafrazni tanimaslik: matn shu fikrni boshqa so'zlar bilan aytgan",
    ]),
    yechim: "Oxirgi gap: muzey dushanbadan boshqa har kuni ochiq. Demak haftada bir kun yopiq. So'zlar boshqa, ma'no bir xil: True.",
    verified: false,
  },
  {
    id: 'ir-tfng-2',
    modul: 'ir-tfng',
    mavzu: "Eski holat va hozirgi holat",
    qiyinlik: "o'rta",
    parcha: 'A student radio station at a riverside college began broadcasting fifteen years ago. At first, all of its programmes were music shows. Today, more than half of its weekly hours are filled with news and interviews made by students.',
    matn: "Statement: Music still takes up most of the station's weekly broadcasting time.",
    ...tfng(1, [
      "Eski holatni hozirgi deb o'qish: \"At first\" o'tmish haqida",
      "Zid gapni ko'rmaslik: vaqtning yarmidan ko'pi yangilik va intervyu bo'lsa, musiqa ko'pchilik bo'la olmaydi",
    ]),
    yechim: "Hozir vaqtning yarmidan ko'pi yangilik va intervyuga ketadi, ya'ni musiqaga yarmidan kami qoladi. Da'vo \"musiqa ko'pchilik\" deydi, matn buning teskarisini aytadi: False.",
    verified: false,
  },
  {
    id: 'ir-tfng-3',
    modul: 'ir-tfng',
    mavzu: "Matnda yo'q ma'lumot",
    qiyinlik: "o'rta",
    parcha: "A city's first bicycle-sharing scheme started with two hundred bicycles at twenty stations. Users pay a small fee through a mobile app and can return a bicycle to any station. The scheme proved so popular that the number of stations was doubled within two years.",
    matn: 'Statement: Most users of the scheme are university students.',
    ...tfng(2, [
      "Umumiy bilimga tayanish: matnda foydalanuvchilar kimligi aytilmagan",
      "Ma'lumot yo'qligini zidlik deb o'ylash: False uchun matnda teskari gap bo'lishi kerak",
    ]),
    yechim: "Matn sxema qanday ishlashi va mashhur bo'lgani haqida. Foydalanuvchilar kimligi (talabami yoki yo'q) haqida na tasdiq, na inkor bor: Not Given.",
    verified: false,
  },
  {
    id: 'ir-tfng-4',
    modul: 'ir-tfng',
    mavzu: "Yaqin so'z tuzog'i",
    qiyinlik: 'qiyin',
    parcha: "The bakery on Market Street uses flour from a mill in the next valley. The owner says that the mill grinds its wheat slowly, which keeps more of the grain's flavour. The bakery's bread costs more than bread sold in the supermarket.",
    matn: "Statement: The bakery's bread is more popular than supermarket bread.",
    ...tfng(2, [
      "Yaqin so'zga aldanish: \"more\" narx haqida, mashhurlik haqida emas",
      "Taxminni fakt deb olish: qimmatroq non kamroq sotiladi, degan gap matnda yo'q",
    ]),
    yechim: "Matnda nonning narxi solishtirilgan (qimmatroq), mashhurligi emas. Qancha odam sotib olishi haqida hech narsa yo'q: Not Given.",
    verified: false,
  },
  {
    id: 'ir-tfng-5',
    modul: 'ir-tfng',
    mavzu: 'Vaqt tartibi',
    qiyinlik: 'qiyin',
    parcha: "A writer from a small coastal town spent six years on her first novel. A small publisher accepted the book, and it sold slowly at first. In its second year, a radio interview with the writer brought it many new readers.",
    matn: 'Statement: The novel was popular as soon as it was published.',
    ...tfng(1, [
      "Keyingi muvaffaqiyatni boshiga ko'chirish: ko'p o'quvchi ikkinchi yilda kelgan",
      "Zid gapni topmaslik: \"sold slowly at first\" da'voni bevosita inkor qiladi",
    ]),
    yechim: "\"Sold slowly at first\": kitob boshida sekin sotilgan. Da'vo esa chiqishi bilan mashhur bo'lgan deydi. Matn teskarisini aytadi: False.",
    verified: false,
  },
];
