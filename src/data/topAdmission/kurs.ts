// Top Admission kursi: "Kuchli STEM profilidan arizaga" (Admission H, muallif tasdiqlagan spetsifikatsiya 2026-11-21).
// Manba: Codex tadqiqot to'plami `03-tadqiqot/top-admission-tadqiqot/2026-11-20/course/` (o'zbekcha qismi).
// To'plamda yo'q bo'lgan ishlangan misol, tekshiruv mezonlari va keyingi qadam Tayanch uchun original yozilgan
// (`qoshilgan` ro'yxatida belgilangan); hammasi muallif ko'rigida, sahifalar "Qoralama".
// 9–16-darslar: Admission I (2026-11-21).
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
  {
    raqam: 9, slug: '09-academic-cv', nom: 'Academic CV va resume', modul: 3,
    tushuntirish: [
      "CVni degree talabi va o'quvchi ehtiyojiga moslang. Education, research, loyihalar, texnik ko'nikmalar va kerak bo'lsa publications bo'limlarini tartiblang. Har bulletda harakat, usul va dalil bo'lsin.",
      "Publication holatini aniq yozing: submitted, preprint va published bir xil maqom emas. Jamoaviy maqoladagi hammualliflikni o'zgartirmang. Skills bo'limiga amalda ishlatib ko'rgan usullarni kiriting.",
      "Har bir hujjatga bir xil sahifa limitini majburlamang. Dastur belgilagan limit bo'lsa, unga rioya qiling. Matnni o'qish qiyin bo'ladigan darajada maydalamang.",
    ],
    misol: {
      matn: 'Implemented the data-cleaning pipeline in Python, added unit tests and documented missing-data assumptions.',
      izoh: "“Pythonni mukammal bilaman” o'rniga tekshiriladigan ish: nima qilingani, qanday usul va qanday iz qoldirgani.",
      til: 'en',
    },
    mashq: "CVdagi har bullet uchun dalil havolasini ichki inventaringizga qo'ying. Dalilsiz sifatlarni olib tashlang.",
    mezonlar: [
      { id: 'bullet', matn: "Har bulletda harakat, usul va dalil bor; dalilsiz sifatlar olib tashlangan." },
      { id: 'publication', matn: "Publication maqomi (submitted, preprint, published) va hammualliflik aniq yozilgan." },
      { id: 'skills', matn: "Skills bo'limida faqat amalda ishlatilgan usullar bor." },
      { id: 'limit', matn: "Dastur belgilagan sahifa limiti tekshirilgan, matn o'qilishi oson." },
    ],
    keyingi: "10-darsda shu CVdagi tajribalarni Statement of Purpose ichida dastur bilan bog'laysiz.",
    havolalar: [{ nom: 'MIT CAPD: CV guidance', url: 'https://capd.mit.edu/resources/cvs/' }],
    qoshilgan: ['mezonlar', 'keyingi'],
  },
  {
    raqam: 10, slug: '10-statement-of-purpose', nom: 'Statement of Purpose', modul: 3,
    tushuntirish: [
      "SOPda o'rganmoqchi bo'lgan muammo, tayyorgarligingiz, aniq tajribangiz va dastur mosligini bog'lang. Research magistratura uchun oldingi loyihadagi savol, siz bajargan usul, kuzatilgan natija va cheklovni tushuntiring. Taught magistratura uchun tegishli fan tayyorgarligi va o'rganiladigan ko'nikmani oching.",
      "Faqat universitetni maqtash bilan moslik yaratilmaydi. Personal history so'ralganda hayotiy kontekstni alohida maqsadda ishlating. Bir matnni ikkala savolga nusxalash o'rniga har hujjatning vazifasini yozib chiqing.",
      "Yakuniy format va limitni degree sahifasidan oling.",
    ],
    misol: {
      matn: "Paragraf rejasi: 1) Savol: shovqinli sensor ma'lumotida anomaliyani qanday ishonchli aniqlash mumkin? 2) Dalil: bitiruv loyihamda shu muammoga ikki usulni solishtirdim, cheklovi kichik ma'lumot to'plami edi. 3) Dasturga aloqasi: [kurs nomi] va [guruh nomi] ning shu sohadagi ishi keyingi qadamni beradi.",
      izoh: "Har paragrafda savol, dalil va dasturga aloqasi bor. Universitetni maqtash yo'q.",
    },
    mashq: "Besh paragrafli reja yarating. Har paragraf yoniga “savol, dalil, bu dasturga aloqasi” yozing.",
    mezonlar: [
      { id: 'reja', matn: "Besh paragrafning har biri yonida savol, dalil va dasturga aloqasi yozilgan." },
      { id: 'moslik', matn: "Boshqa universitet nomi qo'yilganda moslik qismi o'z ma'nosini yo'qotadi." },
      { id: 'vazifa', matn: "SOP va personal history (so'ralgan bo'lsa) alohida vazifani bajaradi, nusxa emas." },
      { id: 'format', matn: "Format va limit degree sahifasidan olingan." },
    ],
    keyingi: "Research magistraturasi bo'lsa, 11-darsda research proposal yozasiz. Taught magistratura bo'lsa, 12-darsga o'tishingiz mumkin.",
    havolalar: [{ nom: 'Berkeley: Writing Your Statements', url: 'https://grad.berkeley.edu/admissions/application-process/writing-your-statements/' }],
    qoshilgan: ['misol', 'keyingi'],
  },
  {
    raqam: 11, slug: '11-research-proposal', nom: 'Research proposal va ilmiy fikrlash', modul: 3,
    tushuntirish: [
      "Proposalni bajarilishi mumkin bo'lgan savoldan boshlang. Nima ma'lum, nimasi ochiq va siz nima tekshirmoqchi ekaningizni ajrating. Ma'lumotga kirish, hisoblash resursi, etik ruxsat va rahbarlik imkoniyatini ko'rib chiqing.",
      "Metod bo'limida bazaviy yechim, solishtirish va tekshiruv rejasini yozing. Natijani oldindan “tasdiqlangan” qilib bermang. Tajriba salbiy natija bersa, nimani o'rganishingizni ko'rsating.",
      "Keltirilgan maqolaning asl matni yoki rasmiy yozuvini tekshiring. Sun'iy yaratilgan citationni bibliografiyaga qo'shmang.",
    ],
    misol: {
      matn: "“Ma'lumot tarqalishi o'zgarganda model ishonchliligi qanday o'zgaradi, va tanlangan kalibrlash usuli buni qanchalik yaxshilaydi?”",
      izoh: "Bu o'quv savoli, bajarilgan tadqiqot da'vosi emas. Savol tekshiriladigan va hajmi cheklangan.",
    },
    mashq: "Bir sahifada savol, manba, ma'lumot, metod, tekshiruv, xavf va zaxira reja yozing.",
    mezonlar: [
      { id: 'savol', matn: "Savol bajarilishi mumkin; ma'lum, ochiq va tekshiriladigan qism ajratilgan." },
      { id: 'resurs', matn: "Ma'lumotga kirish, hisoblash resursi va etik ruxsat ko'rib chiqilgan." },
      { id: 'metod', matn: "Metodda bazaviy yechim, solishtirish va tekshiruv rejasi bor; natija oldindan da'vo qilinmagan." },
      { id: 'citation', matn: "Har citation asl manbada tekshirilgan." },
    ],
    keyingi: "12-darsda proposal bilan bog'liq professorga xat yozasiz va moliyalashtirishni aniqlaysiz.",
    qoshilgan: ['mezonlar', 'keyingi'],
  },
  {
    raqam: 12, slug: '12-professor-va-funding', nom: 'Professor bilan yozishish va funding', modul: 3,
    tushuntirish: [
      "Avval dastur rahbar bilan oldindan bog'lanishni talab qiladimi, ruxsat beradimi yoki markazlashgan qabul ishlatadimi, tekshiring. Zarur bo'lsa, qisqa va moslashtirilgan xat yuboring.",
      "O'zingizni tanishtiring, guruhning bitta aniq ishiga bog'laning, tegishli tajribangizni ko'rsating va bitta aniq savol bering. Mass-emaildan saqlaning. Javobsiz xat uchun bitta odobli eslatma yetarli.",
      "Ijobiy suhbatni qabul yoki moliyaviy kafolat sifatida qabul qilmang. Funding offerda summa, kontrakt, muddat, vazifa, soliq va renewal sharti yozma ravishda aniqlashtiriladi.",
    ],
    misol: {
      matn: "Subject: Prospective MSc applicant: question about [project name]. Dear Professor [name], I am a final-year student at [university]. In my thesis I compared two anomaly-detection methods on sensor data. Your group's recent work on [topic] addresses the limitation I found. Does your group expect to supervise MSc thesis students for the [year] intake?",
      izoh: "Qisqa, bitta aniq ishga bog'langan va bitta savol bilan tugaydi. Kvadrat qavsdagi joylar o'zingizniki bilan to'ldiriladi.",
      til: 'en',
    },
    mashq: "Bitta professor uchun xat tayyorlang va har moslik da'vosiga manba toping.",
    mezonlar: [
      { id: 'qoida', matn: "Dastur oldindan bog'lanishga ruxsat berishi yoki talab qilishi tekshirilgan." },
      { id: 'maqsad', matn: "Xatning maqsadi va javob talab qiladigan bitta savol aniq." },
      { id: 'manba', matn: "Har moslik da'vosi (guruh ishi, maqola) uchun manba bor." },
      { id: 'funding', matn: "Funding shartlari (summa, muddat, vazifa, renewal) yozma tasdiqni kutadigan ochiq savol sifatida belgilangan." },
    ],
    keyingi: "13-darsda grant (scholarship) esselariga o'tasiz: bu modul bakalavr va magistratura uchun umumiy.",
    havolalar: [
      { nom: 'EducationUSA: graduate funding', url: 'https://educationusa.state.gov/node/2617' },
      { nom: 'University of Alberta: AFNS funding example', url: 'https://www.ualberta.ca/en/agriculture-life-environment-sciences/programs/graduate-programs/prospective-students/agricultural-food-and-nutritional-science/afns-admission-process/funding-opportunities.html' },
    ],
    qoshilgan: ['misol', 'keyingi'],
  },
  {
    raqam: 13, slug: '13-scholarship-esselari', nom: 'Scholarship esselari', modul: 4,
    tushuntirish: [
      "Scholarship mezonini tegishli tajriba bilan bog'lang. Akademik merit uchun fikrlash va tayyorgarlik, yetakchilik uchun qaror va jamoaga qo'shilgan hissa, moliyaviy ehtiyoj uchun tasdiqlanadigan holat kerak.",
      "Kelajak rejasida muammo, keyingi qadam va mavjud hamkorlikni ajrating. Bajarilishi noma'lum ulkan va'dadan saqlaning. Scholarship va degree arizalarida bir-biriga zid maqsad yozmang.",
      "Vatanga qaytish, xizmat, ish majburiyati, boshqa grant bilan birlashtirish va davomiylik shartlarini o'qing. Ular sizning hayotiy rejangizga mos kelishini baholang.",
    ],
    misol: {
      matn: "Mezon: yetakchilik. Tajriba: maktab dasturlash to'garagida yangi a'zolar uchun haftalik mashg'ulot tashkil qildim. Dalil: to'garak rahbarining tavsiyasi, mashg'ulot rejalari. Kelajakdagi qadam: universitetda shu formatni birinchi kurs talabalari uchun taklif qilish.",
      izoh: "Mezon, tajriba, dalil va real keyingi qadam bir qatorda. Ulkan va'da yo'q.",
    },
    mashq: "Bitta scholarshipning uch mezoni uchun tajriba, dalil va kelajakdagi tegishli qadam jadvalini tuzing.",
    mezonlar: [
      { id: 'jadval', matn: "Uch mezonning har biri uchun tajriba, dalil va keyingi qadam yozilgan." },
      { id: 'zid', matn: "Scholarship va degree arizasidagi maqsadlar bir-biriga zid emas." },
      { id: 'shartlar', matn: "Vatanga qaytish, xizmat, birlashtirish va davomiylik shartlari o'qilgan va rejaga mos." },
      { id: 'vada', matn: "Kelajak rejasida bajarilishi noma'lum ulkan va'da yo'q." },
    ],
    keyingi: "14-darsda tavsiyanoma va hujjatlarni yig'asiz.",
    havolalar: [
      { nom: 'Chevening: eligibility', url: 'https://www.chevening.org/resource-hub/guidance/eligibility/' },
      { nom: 'NTU: Nanyang Scholarship terms', url: 'https://www.ntu.edu.sg/admissions/ug/scholarships/scholarship-opportunities/detail/nanyang-scholarship' },
    ],
    qoshilgan: ['misol', 'mezonlar', 'keyingi'],
  },
  {
    raqam: 14, slug: '14-tavsiyanoma-va-hujjatlar', nom: 'Tavsiyanoma va hujjatlar', modul: 4,
    tushuntirish: [
      "Sizning ish usulingizni kuzatgan tavsiya beruvchini tanlang. Unga maqsadli dastur, deadline, CV va birgalikdagi ishlar ro'yxatini bering. Yutuqni qayerdan bilishini ko'rsatishiga yordam beradigan faktlarni yuboring.",
      "Tavsiyanomani boshqa shaxs nomidan yozish yoki topshirishdan saqlaning. Portal yuborish yo'lini tavsiya beruvchi bilan tekshiring.",
      "Transkript, tarjima va sertifikat nusxalari uchun universitetning rasmiylashtirish talabini o'qing. Barcha davlatlar uchun bir xil notarial yoki apostil qoidasi bor deb taxmin qilmang. Tekshirish nusxalarida keraksiz shaxsiy ma'lumotni yashiring.",
    ],
    misol: {
      matn: "Tavsiya beruvchiga paket: dasturlar ro'yxati va har birining deadline'i; CV; birga qilgan uch ish (sana, sizning rolingiz, natija); portal havolasi qachon kelishi. Hujjat nazorati: “Transkript tarjimasi · egasi: men · deadline: [sana] · yo'l: portal · rasmiylashtirish: universitet sahifasiga ko'ra”.",
      izoh: "Tavsiya beruvchi faktlarni oladi, matnni o'zi yozadi.",
    },
    mashq: "Tavsiya beruvchiga yuboriladigan faktlar paketi va hujjatlar nazorat ro'yxatini tayyorlang.",
    mezonlar: [
      { id: 'paket', matn: "Paketda dasturlar, deadline'lar, CV va birgalikdagi ishlar bor." },
      { id: 'hujjat', matn: "Har hujjatning egasi, deadline'i va topshirish yo'li aniq." },
      { id: 'rasmiy', matn: "Tarjima va tasdiqlash talabi har universitet sahifasidan alohida tekshirilgan." },
      { id: 'maxfiy', matn: "Nusxalarda keraksiz shaxsiy ma'lumot yashirilgan." },
    ],
    keyingi: "15-darsda arizangizdagi tajribalarni suhbatda tushuntirishni mashq qilasiz.",
    havolalar: [
      { nom: 'MIT: letters of recommendation', url: 'https://mitadmissions.org/apply/firstyear/letters-of-recommendation/' },
      { nom: 'Berkeley: admissions requirements', url: 'https://grad.berkeley.edu/admissions/application-process/requirements/' },
    ],
    qoshilgan: ['misol', 'keyingi'],
  },
  {
    raqam: 15, slug: '15-suhbat', nom: 'Suhbat va texnik tushuntirish', modul: 4,
    tushuntirish: [
      "Arizangizdagi har muhim tajribani qisqa va batafsil shaklda tushuntirishni mashq qiling. Suhbatdosh oldindan barcha texnik atamani biladi deb hisoblamang. Muammo, o'zingizning rolingiz, qaroringiz va cheklovni tartiblang.",
      "“Bilmayman” deyishdan keyin qanday tekshirish mumkinligini tushuntiring. Liderlik savolida guruhning hamma ishini o'zingizga olmang. Texnik savolning taxminlarini ovoz chiqarib aniqlang.",
      "Yodlangan nutq o'rniga savolga mos javob bering. Oxirida o'quv dasturi, mentoring yoki research jarayoniga oid haqiqiy savol tayyorlang.",
    ],
    misol: {
      matn: "Savol: “Loyihangizda nega aynan shu usulni tanladingiz?” Javob: “Ma'lumot kam edi, shuning uchun murakkab model o'rniga oddiyrog'ini tanladim va ikkalasini bir xil tekshiruvda solishtirdim. Oddiy model barqarorroq chiqdi. Cheklovi: faqat bitta ma'lumot to'plamida sinalgan, keyingi qadam boshqa to'plamda tekshirish.”",
      izoh: "Sabab, o'z qarori, natija va cheklov bor. Atama tushuntirilgan.",
    },
    mashq: "Telefoningizga loyiha haqida qisqa izoh yozib oling. Undan so'ng nima sababdan shu metodni tanlaganingiz va keyingi tajribangizni tushuntiring.",
    mezonlar: [
      { id: 'mos', matn: "Javob aniq savolga mos, yodlangan nutq emas." },
      { id: 'halol', matn: "Javob texnik jihatdan halol: cheklov va bilmagan joy ochiq aytilgan." },
      { id: 'rol', matn: "Shaxsiy rol guruh ishidan ajratilgan." },
      { id: 'savol', matn: "Suhbat oxiri uchun dastur haqida haqiqiy savol tayyor." },
    ],
    keyingi: "16-darsda arizani yakuniy tekshiruvdan o'tkazasiz va offerlarni solishtirasiz.",
    qoshilgan: ['misol', 'keyingi'],
  },
  {
    raqam: 16, slug: '16-yakuniy-tekshiruv', nom: "Yakuniy tekshiruv, offer va jo'nash", modul: 4,
    tushuntirish: [
      "Deadline'ni qabul yili, mahalliy sana, vaqt va vaqt mintaqasi bilan yozing. Degree va scholarship muddatlarini ajrating. Hujjat yuborishdan oldin limit, ism, daraja, universitet nomi, sana, havola va ilovalarni tekshiring. Yuborish tasdig'ini saqlang.",
      "Offer kelganda akademik shart, grant summasi, qoplanmagan xarajat, depozit, qaytarish qoidasi va renewalni solishtiring. Viza talabini faqat vakolatli davlat manbasidan oling. Qabul xatini viza tasdig'i deb qabul qilmang. Uy-joyni rasmiy kanal orqali tekshiring, jo'nash oldidan xavfsizlik va aloqa rejasini yangilang.",
      "Mustaqil baholash: har mezonni “yetarli dalil bor”, “qayta ishlash kerak” yoki “tasdiqlanmagan” deb belgilang. Mezonlar: savolga javob, aniq shaxsiy hissa, dalil, dastur mosligi, mantiq, mualliflik, format, moliyaviy hisob va hujjatlar muvofiqligi. Bu rubrika tahrir uchun; undan qabul yoki grant ehtimolini hisoblamang.",
    ],
    misol: {
      matn: "Deadline qatori: “X universiteti, MSc · ariza: 15.01.[yil], 23:59, Yevropa/Berlin vaqti (Toshkentda ertasi kuni 03:59) · scholarship: alohida forma, 01.12.[yil] · yuborish tasdig'i: saqlangan”.",
      izoh: "Vaqt mintaqasi va Toshkent vaqti yonma-yon. Degree va scholarship muddati alohida.",
    },
    mashq: "Tayyor arizani ikkinchi o'quvchiga hujjat ro'yxati bilan bering. Natijada faqat aniqlangan xatolar va ochiq tekshiruvlar ro'yxatini oling.",
    mezonlar: [
      { id: 'deadline', matn: "Har deadline qabul yili, sana, vaqt va vaqt mintaqasi bilan yozilgan." },
      { id: 'zid', matn: "Qabul va grant hujjatlari o'rtasida zidlik yo'q." },
      { id: 'ochiq', matn: "Tasdiqlanmagan talab ochiq belgilangan." },
      { id: 'offer', matn: "Offerlar summa, qoplanmagan xarajat, depozit va renewal bo'yicha solishtirilgan." },
    ],
    keyingi: "Kurs tugadi. Grantlar katalogi va Davlatlarni taqqoslash sahifalarida tanlovingizni qayta tekshiring.",
    havolalar: [
      { nom: 'U.S. student visa guidance', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
      { nom: 'Grantlar katalogi', url: '/uz/top-admission/grantlar/', ichki: true },
      davlatlar,
    ],
    qoshilgan: ['misol', 'keyingi'],
  },
];
