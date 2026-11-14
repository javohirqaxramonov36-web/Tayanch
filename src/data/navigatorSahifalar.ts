// Navigator yo'l xaritasi qadamlari uchun sahifalar ro'yxati (1-qavat, o'zbekcha).
// Bu fayl faqat ma'lumot: node testlari ham o'qiydi, shuning uchun yol() yoki astro import qilinmaydi.
// "Tayyor"lik bu yerda yozilmaydi: build paytida src/pages ichida sahifa fayli bor-yo'qligidan
// hisoblanadi (YolXaritasi.astro). `manzil` bo'lmasa yoki `qurilmoqda: true` bo'lsa qadam "Tez orada".
// Matnlarda fakt yo'q: faqat sahifada nima qilinishi yozilgan.

export type Maqsad = 'top-admission' | 'sat' | 'ielts' | 'eyuf';

/** Maqsadlarning doimiy tartibi (kartalar va "boshqa maqsadlar" shu tartibda) */
export const MAQSADLAR: Maqsad[] = ['top-admission', 'sat', 'ielts', 'eyuf'];

export interface NavigatorSahifa {
  id: string;
  maqsad: Maqsad | 'umumiy';
  nomi: string;
  izoh: string;
  /** base'siz manzil: "/uz/sat/mashq/test/". Yo'q bo'lsa sahifa hali rejada */
  manzil?: string;
  /** Sahifa fayli bor, lekin "qavat qurilmoqda" ekrani: havola berilmaydi */
  qurilmoqda?: true;
}

export const navigatorSahifalar: NavigatorSahifa[] = [
  // 1-qavat
  { id: 'umumiy-muddatlar', maqsad: 'umumiy', nomi: 'Muddatlarni tekshiring', izoh: "Rasmiy muddatlar ro'yxati, manba va sana bilan.", manzil: '/uz/deadline/' },
  { id: 'umumiy-manbalar', maqsad: 'umumiy', nomi: 'Rasmiy manbalar', izoh: "Qoida va talablarni asl manbada o'qing.", manzil: '/uz/manbalar/' },

  // 2-qavat: Top Admission
  { id: 'ta-kirish', maqsad: 'top-admission', nomi: 'Top Admission qavatini ko\'ring', izoh: "Qavatda nima borligi va qayerdan boshlash.", manzil: '/uz/top-admission/' },
  { id: 'ta-topshirish-yoli', maqsad: 'top-admission', nomi: "Topshirish yo'lingizni tuzing", izoh: "Davlat va dastur bo'yicha umumiy qadamlar.", manzil: '/uz/top-admission/vosita/topshirish-yoli/' },
  { id: 'ta-zinapoya', maqsad: 'top-admission', nomi: 'Ariza zinapoyasi darsi', izoh: 'Ariza bosqichlarini tartib bilan mashq qiling.', manzil: '/uz/top-admission/qollanma/ariza-zinapoyasi/' },
  { id: 'ta-turkiye', maqsad: 'top-admission', nomi: 'Türkiye Bursları', izoh: "Yo'nalish sahifasi: shartlar va hujjatlar.", manzil: '/uz/top-admission/turkiye-burslari/' },

  // 3-qavat: SAT
  { id: 'sat-kirish', maqsad: 'sat', nomi: "SAT qavatini ko'ring", izoh: "Bo'limda nima borligi va qayerdan boshlash.", manzil: '/uz/sat/' },
  { id: 'sat-reja', maqsad: 'sat', nomi: 'SAT reja tuzgich', izoh: 'Imtihon sanasigacha haftalik reja.', manzil: '/uz/sat/vosita/reja/' },
  { id: 'sat-test', maqsad: 'sat', nomi: 'SAT mashq testi', izoh: 'Qisqa test: Reading & Writing va Math.', manzil: '/uz/sat/mashq/test/' },
  { id: 'sat-bank', maqsad: 'sat', nomi: 'SAT savol banki', izoh: "Mavzu bo'yicha savollar.", manzil: '/uz/sat/mashq/bank/' },
  { id: 'sat-natijalar', maqsad: 'sat', nomi: "Natijalaringizni ko'ring", izoh: "Qaysi mavzuda ko'proq xato borligini toping.", manzil: '/uz/sat/vosita/natijalar/' },
  { id: 'sat-takrorlash', maqsad: 'sat', nomi: 'Xato daftarini takrorlang', izoh: 'Avvalgi xatolarni qayta yeching.', manzil: '/uz/sat/vosita/takrorlash/' },
  { id: 'sat-lugat', maqsad: 'sat', nomi: "SAT lug'at kartalari", izoh: "Qisqa so'z mashqi.", manzil: '/uz/sat/mashq/lugat/' },
  { id: 'sat-math-hajm', maqsad: 'sat', nomi: 'Math darsi: hajm', izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/sat/qollanma/math/hajm/' },
  { id: 'sat-math-grafik', maqsad: 'sat', nomi: 'Math darsi: funksiya grafiklari', izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/sat/qollanma/math/grafik/' },
  { id: 'sat-math-aylana', maqsad: 'sat', nomi: 'Math darsi: birlik aylana', izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/sat/qollanma/math/birlik-aylana/' },
  { id: 'sat-math-statistika', maqsad: 'sat', nomi: 'Math darsi: statistika', izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/sat/qollanma/math/statistika/' },
  { id: 'sat-rw-xato', maqsad: 'sat', nomi: 'R&W darsi: xatoni toping', izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/sat/qollanma/reading-writing/xatoni-toping/' },
  { id: 'sat-rw-dalil', maqsad: 'sat', nomi: 'R&W darsi: dalilni belgilang', izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/sat/qollanma/reading-writing/dalil/' },
  { id: 'sat-rw-otish', maqsad: 'sat', nomi: "R&W darsi: o'tish so'zlari", izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/sat/qollanma/reading-writing/otish-sozlari/' },
  { id: 'sat-rw-lugat', maqsad: 'sat', nomi: "R&W darsi: lug'at kontekstda", izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/sat/qollanma/reading-writing/lugat-kontekstda/' },
  { id: 'sat-strategiya', maqsad: 'sat', nomi: 'SAT strategiya qo\'llanmasi', izoh: 'Imtihon kuni va vaqtni boshqarish.', manzil: '/uz/sat/qollanma/strategiya/' },
  { id: 'sat-vaqt', maqsad: 'sat', nomi: 'Vaqt va qayta topshirish', izoh: "Vaqtni taqsimlash va retake rejasi.", manzil: '/uz/sat/qollanma/vaqt/' },

  // 4-qavat: IELTS (faqat havola; IELTS fayllari o'zgartirilmaydi)
  { id: 'ielts-kirish', maqsad: 'ielts', nomi: "IELTS qavatini ko'ring", izoh: "Bo'limda nima borligi va qayerdan boshlash.", manzil: '/uz/ielts/' },
  { id: 'ielts-reja', maqsad: 'ielts', nomi: 'IELTS 30 kunlik reja', izoh: 'Uch savol asosida kunma-kun reja.', manzil: '/uz/ielts/vosita/reja/' },
  { id: 'ielts-reading', maqsad: 'ielts', nomi: "Reading qo'llanmasi", izoh: 'Skimming, scanning va savol turlari.', manzil: '/uz/ielts/qollanma/reading/' },
  { id: 'ielts-tfng', maqsad: 'ielts', nomi: 'Reading darsi: True / False / Not Given', izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/ielts/qollanma/reading/tfng/' },
  { id: 'ielts-sarlavhalar', maqsad: 'ielts', nomi: 'Reading darsi: Matching headings', izoh: 'Interaktiv dars va mashqlar.', manzil: '/uz/ielts/qollanma/reading/sarlavhalar/' },
  { id: 'ielts-listening', maqsad: 'ielts', nomi: "Listening qo'llanmasi", izoh: 'Audio bilan mashq.' },
  { id: 'ielts-writing', maqsad: 'ielts', nomi: "Writing Task 2 qo'llanmasi", izoh: "Mezonlar, insho tuzilmasi va o'zini tekshirish.", manzil: '/uz/ielts/qollanma/writing-task-2/' },
  { id: 'ielts-speaking', maqsad: 'ielts', nomi: 'Speaking', izoh: "Uch qism va o'zingizni yozib eshitish." },

  // 5-qavat: EYUF
  { id: 'eyuf-kirish', maqsad: 'eyuf', nomi: 'EYUF qavati', izoh: 'Tanlov bosqichlari xaritasi.', manzil: '/uz/eyuf/', qurilmoqda: true },
];

/** id -> sahifa */
export const sahifaById = (id: string) => navigatorSahifalar.find((s) => s.id === id);
