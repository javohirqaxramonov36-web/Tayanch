// Top Admission kursi: "Kuchli STEM profilidan arizaga" (Admission H, muallif tasdiqlagan spetsifikatsiya 2026-11-21).
// Manba: Codex tadqiqot to'plami `03-tadqiqot/top-admission-tadqiqot/2026-11-20/course/` (o'zbekcha qismi).
// To'plamda yo'q bo'lgan ishlangan misol, tekshiruv mezonlari va keyingi qadam Tayanch uchun original yozilgan
// (`qoshilgan` ro'yxatida belgilangan); hammasi muallif ko'rigida, sahifalar "Qoralama".
// Dars tartibi: Tushuntirish → Ishlangan misol ("Namuna") → Mashq → Tekshiruv mezonlari → Keyingi qadam.

export interface KursHavola { nom: string; url: string; ichki?: boolean }
export interface KursMezon { id: string; matn: string }
export interface KursDars {
  raqam: number;
  slug: string;
  nom: string;
  modul: number;
  /** Mazmuni bor dars sahifasi quriladi; bo'lmasa kurs sahifasida "tez orada". */
  tushuntirish?: string[];
  misol?: { matn: string; izoh?: string; til?: 'en' };
  mashq?: string;
  mezonlar?: KursMezon[];
  keyingi?: string;
  havolalar?: KursHavola[];
  /** Tayanch qo'shgan qismlar (to'plamda yo'q edi): muallif ko'rigi uchun. */
  qoshilgan?: ('misol' | 'mezonlar' | 'keyingi')[];
}

export const KURS_NOMI = "Kuchli STEM profilidan arizaga";
export const KURS_TAVSIF =
  "Mavjud kuchli STEM profilini tushunarli, dalillangan arizaga aylantirish uchun 16 dars. Har dars oxirida aniq hujjat yoki jadval yaratasiz. Universitetga oid har talabni rasmiy manbadan qayta tekshiring.";

export const MODULLAR = [
  { raqam: 1, nom: 'Strategiya va dalillar' },
  { raqam: 2, nom: 'Bakalavr arizasi' },
  { raqam: 3, nom: 'Magistratura arizasi' },
  { raqam: 4, nom: 'Grant va topshirish' },
] as const;

/** Tavsiya etilgan yo'llar (to'plam: bakalavr 1–8 va 13–16, magistratura 1–4 va 9–16). */
export const YOLLAR = [
  { id: 'bakalavr', nom: 'Bakalavr', darslar: [1, 2, 3, 4, 5, 6, 7, 8, 13, 14, 15, 16] },
  { id: 'magistr', nom: 'Magistratura', darslar: [1, 2, 3, 4, 9, 10, 11, 12, 13, 14, 15, 16] },
] as const;

const davlatlar: KursHavola = { nom: 'Davlatlarni taqqoslash', url: '/uz/top-admission/davlatlar/', ichki: true };
const arzon: KursHavola = { nom: "Arzonroq o'qish yo'llari", url: '/uz/top-admission/arzon-yollar/', ichki: true };

export const DARSLAR: KursDars[] = [
  {
    raqam: 1, slug: '01-maqsad-va-muvofiqlik', nom: 'Maqsad va muvofiqlik', modul: 1,
    tushuntirish: [
      "Bir sahifada o'qimoqchi bo'lgan muammo, hozirgi tayyorgarlik va kerakli ta'lim imkoniyatini yozing. Masalan, “AI o'rganaman” o'rniga qaysi turdagi ma'lumot, usul yoki cheklov sizni qiziqtirishini aniqlang.",
      "So'ng kirishdagi to'siqlarni ajrating. O'zbekiston maktab attestati, bakalavr diplomi, fan kreditlari, til hujjati va bitirish sanasi har universitetda alohida tekshiriladi. Yuqori SAT yoki ingliz tili natijasining o'zi maktab hujjati ekvivalentligini tasdiqlamaydi.",
      "Qabul bo'limiga so'rov yuborsangiz, ta'lim bosqichi va hujjatning aniq nomini kiriting.",
    ],
    misol: {
      matn: "Dastur: X universiteti, Computer Science (bakalavr), 2027 qabuli. Attestat: rasmiy sahifada O'zbekiston attestati ro'yxatda yo'q → savol: “11 yillik umumiy o'rta ta'lim attestati bilan to'g'ridan-to'g'ri topshira olamanmi?” va qabul bo'limi aloqa havolasi. Prerequisite: matematika talabi → rasmiy sahifa havolasi. Til: minimal IELTS → rasmiy sahifa havolasi.",
      izoh: "Har qatorda manba yoki ochiq savol bor. Taxmin bilan to'ldirilgan joy yo'q.",
    },
    mashq: "Uch dastur uchun credential, prerequisite, til va daraja mezonlarini yozing. Tasdiqlanmagan joyga savol va rasmiy aloqa havolasini qo'ying.",
    mezonlar: [
      { id: 'mezonlar', matn: "Uch dasturning har biri uchun credential, prerequisite, til va daraja mezoni yozilgan." },
      { id: 'manba', matn: "Har bir mezonning manbasi va qabul yili bor." },
      { id: 'savol', matn: "Tasdiqlanmagan joyda savol va rasmiy aloqa havolasi qo'yilgan." },
    ],
    keyingi: "2-darsda shu uch dasturning ichiga kirasiz: o'quv rejasi va laboratoriya sizning tayyorgarligingizga mosligini tekshirasiz.",
    havolalar: [
      { nom: 'DAAD admission database', url: 'https://www.daad.de/en/studying-in-germany/requirements/admission-database/' },
      { nom: 'Oxford international qualifications', url: 'https://www.ox.ac.uk/admissions/undergraduate/courses/admissions-requirements/international-qualifications' },
    ],
    qoshilgan: ['misol', 'keyingi'],
  },
  {
    raqam: 2, slug: '02-dastur-va-laboratoriya', nom: 'Dastur va laboratoriya mosligi', modul: 1,
    tushuntirish: [
      "Universitetning umumiy nomidan keyin aniq degree sahifasiga o'ting. Bakalavr uchun fanlar ketma-ketligi, tadqiqotga kirish, bitiruv loyihasi va mentoringni tekshiring. Magistratura uchun coursework, thesis va research yo'llarini ajrating.",
      "Laboratoriya faoliyatini so'nggi loyihalar va ilmiy rahbarning rasmiy profilidan tekshiring. Bir maqoladagi mavzu sizning loyihangiz bilan qanday tutashishini yozing. “Mashhur laboratoriya” degan izoh yetarli emas.",
      "Rahbarning yangi magistr talabasi olayotganini taxmin qilmang. Qabul huquqi kimda ekanini aniqlang.",
    ],
    misol: {
      matn: "“Men computer visionni yoqtiraman” jumlasini “Loyihamdagi shovqinli tasvir muammosi uchun guruhning uncertainty estimation usulini o'rganmoqchiman” deb aniqlashtirish mumkin.",
      izoh: "Guruh haqiqatan shu usulda ishlashini rasmiy sahifadan tekshiring.",
    },
    mashq: "Uch dastur uchun tayyorgarligingiz, o'rganiladigan usul va rasmiy dalildan iborat moslik jadvali tuzing.",
    mezonlar: [
      { id: 'jadval', matn: "Jadvalda uch dastur bor, har qatorda tayyorgarlik, o'rganiladigan usul va rasmiy dalil." },
      { id: 'aniq', matn: "“Mashhur”, “kuchli” kabi umumiy so'z o'rniga aniq kurs, loyiha yoki usul nomi yozilgan." },
      { id: 'taxmin', matn: "Rahbar talaba olishi yoki qabulni kim hal qilishi taxmin qilinmagan, manbadan aniqlangan yoki savol qilib qo'yilgan." },
    ],
    keyingi: "3-darsda shu dasturlarni xavfsizlik va haqiqiy xarajat bo'yicha saralaysiz.",
    qoshilgan: ['mezonlar', 'keyingi'],
  },
  {
    raqam: 3, slug: '03-xavfsizlik-va-moliya', nom: 'Xavfsizlik va moliyaviy saralash', modul: 1,
    tushuntirish: [
      "Tanlovni uch tekshiruv orqali o'tkazing. Avval mamlakat va kampus hududining xavfsizligini ko'ring. Keyin degree va laboratoriya mosligini tekshiring. So'ng kafolatlangan mablag'dan keyingi haqiqiy xarajatni hisoblang.",
      "Tuition waiver yashash xarajatini o'z-o'zidan qoplamaydi. Need-based yordamda oila hissasini universitet hisoblaydi. Stipendiya to'lovi kelishidan oldin depozit, chipta va viza xarajatlari paydo bo'lishi mumkin.",
      "Kelajakdagi topilmagan ish yoki tanlovda olinmagan grantni kafolatlangan daromadga kiritmang. Bir martalik va yillik xarajatlarni alohida ko'rsating.",
    ],
    misol: {
      matn: "Budjet qatori: “Turar joy · [summa] EUR · oyiga, 12 oy · universitet yotoqxona sahifasi, 2027 qabuli”. “Viza yig'imi · [summa] · bir martalik, grant to'lovidan oldin · elchixona sahifasi”. “Kontrakt · 0 · grant xatida to'liq qoplanishi yozilgan”.",
      izoh: "Har qatorda valyuta, davr va manba bor. Nol faqat hujjat bilan tasdiqlangan joyda.",
    },
    mashq: "Bitta grant uchun kontrakt, yig'im, turar joy, ovqat, sug'urta, safar va boshlang'ich to'lovlarni budjet jadvaliga kiriting.",
    mezonlar: [
      { id: 'xavfsizlik', matn: "Mamlakat xavfsizligi rasmiy manbada (masalan, Davlatlarni taqqoslash sahifasidagi ogohlantirish) tekshirilgan." },
      { id: 'valyuta', matn: "Har xarajatning valyutasi, davri va manbasi bor." },
      { id: 'nol', matn: "Nol faqat tasdiqlangan nol xarajatga yozilgan." },
      { id: 'kafolat', matn: "Bir martalik va yillik xarajatlar alohida; olinmagan grant yoki ish daromadga kiritilmagan." },
    ],
    keyingi: "4-darsda arizadagi har da'vo uchun dalil yig'asiz: shu jadval kabi, faqat tajribalaringiz uchun.",
    havolalar: [davlatlar, arzon, { nom: 'EducationUSA graduate finance', url: 'https://educationusa.state.gov/node/2617' }],
    qoshilgan: ['misol', 'keyingi'],
  },
  {
    raqam: 4, slug: '04-dalillar-inventari', nom: 'Dalillar inventari', modul: 1,
    tushuntirish: [
      "Arizadagi har katta da'vo uchun tekshiriladigan iz toping. Loyiha daftari, kod tarixi, o'qituvchi kuzatuvi, musobaqa natijasi yoki foydalanuvchi fikri dalil bo'lishi mumkin.",
      "Jamoaviy ishda aynan siz qilgan qismni ajrating. Natija, tajriba va shaxsiy talqinni bir-biridan farqlang. “Model muvaffaqiyatli ishladi” o'rniga qanday tekshiruv o'tkazilgani va cheklovi nima bo'lganini tushuntiring.",
      "Miqdoriy natijani faqat asosiy yozuvingiz tasdiqlasa ishlating. Ko'rsatkich yetishmasa, uydirma raqam kiritish o'rniga aniq harakatni tasvirlang.",
    ],
    misol: {
      matn: "Vaziyat: maktab robototexnika jamoasida masofa sensori noto'g'ri o'lchardi. Mening harakatim: kalibrlash skriptini yozdim va har o'zgarishdan keyin sinov o'tkazdim. Dalil: GitHub commit tarixi, murabbiyning kuzatuvi. Natija: robot musobaqa yo'lini to'liq bosib o'tdi. O'rganganim: o'zgarishni sinovsiz qo'shmaslik.",
      izoh: "Har qism alohida va tekshiriladigan. Natijada uydirma foiz yo'q.",
    },
    mashq: "Eng muhim besh tajribangizni “vaziyat, mening harakatim, dalil, natija, o'rganganim” ketma-ketligida yozing.",
    mezonlar: [
      { id: 'besh', matn: "Besh tajribaning har biri besh qismda yozilgan." },
      { id: 'dalil', matn: "Har da'vo yonida tekshiriladigan dalil bor; jamoaviy ishda o'z qismingiz ajratilgan." },
      { id: 'mos', matn: "CV, activities va essedagi sanalar, vazifalar hamda natijalar bir-biriga mos." },
      { id: 'raqam', matn: "Yozuv tasdiqlamaydigan raqam yoki foiz yo'q." },
    ],
    keyingi: "Bakalavr arizasi bo'lsa, 5-darsda shu tajribalardan personal essay mavzusini tanlaysiz. Magistratura bo'lsa, 9-dars (Academic CV) ga o'ting.",
    qoshilgan: ['misol', 'keyingi'],
  },
  {
    raqam: 5, slug: '05-personal-essay-mavzu', nom: 'Personal essay uchun mavzu', modul: 2,
    tushuntirish: [
      "Besh voqeani xotiradan yozing. Har birida qaror, harakat, qarama-qarshilik va keyingi o'zgarishni aniqlang. Voqea katta sovrin bilan tugashi shart emas. O'zingiz biror masalani boshqacha tushungan payt kuchli asos bo'lishi mumkin.",
      "Mavzuni “meni aqlli ko'rsatadi” degan sabab bilan tanlamang. Uni boshqalarning tafsilotlari bilan almashtirsangiz ham o'zgarmaydigan matn juda umumiy bo'lishi mumkin. Qiziqishning qanday rivojlanganini ko'rsating.",
      "Maxfiy yoki boshqa shaxsga tegishli tafsilotlarni kiritishda ularning manfaatini ham hisobga oling.",
    ],
    misol: {
      matn: "Oldin nimaga ishonardim: olimpiada masalasini faqat to'g'ri javob uchun yechardim. Nima qildim: ukamga bitta masalani tushuntira olmay, yechimni uch marta boshqacha yozdim. Endi nimani boshqacha qilaman: yechimni boshqa odam tushunadimi, deb tekshiraman.",
      izoh: "Voqea kichik, lekin fikrlashdagi o'zgarishni ko'rsatadi.",
    },
    mashq: "Har voqea uchun “oldin nimaga ishonardim, nima qildim, endi nimani boshqacha qilaman” savollariga javob yozing.",
    mezonlar: [
      { id: 'besh', matn: "Besh voqea yozilgan, har birida qaror, harakat va o'zgarish bor." },
      { id: 'uch-savol', matn: "Har voqea uchun uch savolga javob yozilgan." },
      { id: 'tanlov', matn: "Tanlangan mavzu sizning tanlovingiz va fikrlashingizni ochadi." },
      { id: 'maxfiy', matn: "Boshqa shaxsning maxfiy tafsiloti uning manfaatini hisobga olmay kiritilmagan." },
    ],
    keyingi: "6-darsda tanlangan voqeadan esse qoralamasini tuzasiz va tahrir qilasiz.",
    havolalar: [{ nom: 'Common App essay prompts', url: 'https://www.commonapp.org/apply/essay-prompts/' }],
    qoshilgan: ['misol', 'keyingi'],
  },
  {
    raqam: 6, slug: '06-esse-tuzilishi', nom: 'Esse tuzilishi va tahriri', modul: 2,
    tushuntirish: [
      "Dastlab voqeaning asosiy qaror nuqtasini yozing. Keyin uni tushunish uchun kerakli kontekstni qo'shing. Har sahnadan so'ng uning siz uchun ahamiyatini ko'rsating. Faqat birin-ketin yutuqlarni sanash CVdagi ma'lumotni takrorlashi mumkin.",
      "Birinchi tahrirda mantiq va mualliflik ovoziga, keyingi tahrirda ortiqcha jumlalar va tilga qarang. Portalning amaldagi limitini oxirida qayta tekshiring.",
      "Tashqi o'quvchidan “Bu matndan men haqimda nima bildingiz?” deb so'rang. Uning o'rniga siz aytmoqchi bo'lgan fikrni tushuntirib bermang.",
    ],
    misol: {
      matn: "Umumiy fikr: “Men hech qachon taslim bo'lmayman.” Aniqroq fikr: “Tekshiruvdagi xato sababli loyihani qayta sinadim va keyingi versiyada tekshiruv yozuvlarini guruh bilan bo'lishdim.”",
    },
    mashq: "Qoralamada har paragrafning vazifasini bir jumlada yozing, takror vazifalarni birlashtiring.",
    mezonlar: [
      { id: 'vazifa', matn: "Har paragrafning vazifasi bir jumlada yozilgan, takrorlari birlashtirilgan." },
      { id: 'ahamiyat', matn: "Har sahnadan keyin uning siz uchun ahamiyati ko'rsatilgan, yutuqlar ro'yxati emas." },
      { id: 'limit', matn: "Portalning amaldagi limiti oxirida qayta tekshirilgan." },
      { id: 'oquvchi', matn: "Tashqi o'quvchi “men haqimda nima bildingiz?” savoliga javob bergan." },
    ],
    keyingi: "7-darsda “Nega shu fan?” va “Nega shu universitet?” savollariga javob yozasiz.",
    qoshilgan: ['mezonlar', 'keyingi'],
  },
  {
    raqam: 7, slug: '07-supplemental', nom: 'Supplemental va akademik motivatsiya', modul: 2,
    tushuntirish: [
      "“Nega shu fan?” savoliga qiziqishingizning rivoji va tayyorgarligingiz bilan javob bering. “Nega shu universitet?” savolida aniq o'quv imkoniyati, undan qanday foydalanishingiz va bunga tayyorgarligingizni bog'lang.",
      "Bir maktab matnidagi nomlarni almashtirish yetmaydi. Fan yoki laboratoriya amalda mavjudligini tekshiring.",
      "UCAS formatida 2026 qabuli va keyingi davrlar uchun uch savol ishlatiladi. Umumiy limit 4 000 belgi, har javob kamida 350 belgi. Bu belgilar, so'zlar emas. Har bir portalning joriy ko'rsatmasini tekshiring.",
    ],
    misol: {
      matn: "Umumiy: “Universitetingiz kuchli va mashhur.” Aniqroq: “Ikkinchi kursdagi [kurs nomi] va bakalavrlar tadqiqot dasturi orqali maktabdagi havo sifati sensori loyihamni davom ettirmoqchiman. Buning uchun statistika kursini tugatdim.”",
      izoh: "Imkoniyat aniq, shaxsiy dalil va reja bor. Nom almashtirilsa, matn boshqa universitetga mos kelmaydi.",
    },
    mashq: "Bitta dastur uchun uchta tekshirilgan imkoniyatni toping. Har biriga tegishli shaxsiy dalil va rejalashtirilgan harakatni yozing.",
    mezonlar: [
      { id: 'uch', matn: "Uchta imkoniyat rasmiy havola bilan tekshirilgan." },
      { id: 'dalil', matn: "Har imkoniyatga shaxsiy dalil va rejalashtirilgan harakat bog'langan." },
      { id: 'nom', matn: "Universitet nomi almashtirilsa, matn boshqa joyga mos kelmaydi." },
      { id: 'limit', matn: "Portal limiti (UCAS bo'lsa belgilar soni) joriy ko'rsatmada tekshirilgan." },
    ],
    keyingi: "8-darsda activities, honors va loyiha portfoliosini tartibga keltirasiz.",
    havolalar: [{ nom: 'UCAS personal statement guidance', url: 'https://www.ucas.com/applying/applying-to-university/writing-your-personal-statement/how-to-write-your-personal-statement' }],
    qoshilgan: ['misol', 'keyingi'],
  },
  {
    raqam: 8, slug: '08-activities-va-portfolio', nom: 'Activities, honors va STEM portfolio', modul: 2,
    tushuntirish: [
      "Activities yozuvi uchun tashkilot nomi, aniq rol, ish muddati, shaxsiy harakat va natijani yozing. Portalning shu yilgi belgi limitini tekshiring. Qisqartirishda muhim harakatni saqlang.",
      "Honors yozuvida sovrin nomi, darajasi, beruvchi tashkilot va vaqtini aniqlashtiring.",
      "GitHub portfolio uchun README, o'rnatish bosqichi, ma'lumot manbasi, sinov usuli va cheklovlarni kiriting. Uchinchi tomon kodi, shaxsiy ma'lumot va yopiq tadqiqotni ruxsatsiz chiqarmang. Portal so'ramagan qo'shimcha materialni o'zboshimchalik bilan yubormang.",
    ],
    misol: {
      matn: 'Maintained the project’s preprocessing pipeline, documented failed runs and added a reproducible evaluation script.',
      izoh: "Bu jumlada rol va tekshiriladigan ish bor. O'lchanmagan ta'sir uydirilmagan.",
      til: 'en',
    },
    mashq: "Uch activities yozuvi va bitta loyiha READMEsi yarating.",
    mezonlar: [
      { id: 'beshta', matn: "Har activities yozuvida tashkilot, rol, muddat, harakat va natija bor." },
      { id: 'limit', matn: "Portalning shu yilgi belgi limiti tekshirilgan." },
      { id: 'readme', matn: "READMEda o'rnatish, ma'lumot manbasi, sinov usuli va cheklovlar bor." },
      { id: 'ruxsat', matn: "Uchinchi tomon kodi, shaxsiy ma'lumot va yopiq tadqiqot ruxsatsiz chiqarilmagan." },
    ],
    keyingi: "Bakalavr yo'lida keyingisi 13-dars: scholarship esselari.",
    havolalar: [{ nom: 'MIT: essays, activities and academics', url: 'https://mitadmissions.org/apply/firstyear/essays-activities-academics/' }],
    qoshilgan: ['mezonlar', 'keyingi'],
  },
  { raqam: 9, slug: '09-academic-cv', nom: 'Academic CV va resume', modul: 3 },
  { raqam: 10, slug: '10-statement-of-purpose', nom: 'Statement of Purpose', modul: 3 },
  { raqam: 11, slug: '11-research-proposal', nom: 'Research proposal va ilmiy fikrlash', modul: 3 },
  { raqam: 12, slug: '12-professor-va-funding', nom: 'Professor bilan yozishish va funding', modul: 3 },
  { raqam: 13, slug: '13-scholarship-esselari', nom: 'Scholarship esselari', modul: 4 },
  { raqam: 14, slug: '14-tavsiyanoma-va-hujjatlar', nom: 'Tavsiyanoma va hujjatlar', modul: 4 },
  { raqam: 15, slug: '15-suhbat', nom: 'Suhbat va texnik tushuntirish', modul: 4 },
  { raqam: 16, slug: '16-yakuniy-tekshiruv', nom: "Yakuniy tekshiruv, offer va jo'nash", modul: 4 },
];
