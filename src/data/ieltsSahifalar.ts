// IELTS bo'limining sahifalari va yon panel guruhlari.
// Dizayn: Tayanch-IELTS-dizayn.md. "tez-orada" bandlar havola emas: kulrang ikonka va yorliq bilan matn.

export interface IeltsBand {
  nomi: string;
  tavsif: string;
  /** /uz/ielts/ dan keyingi qism; yo'q bo'lsa band "tez orada" */
  qism?: string;
  ikonka: string;
}

export const IKONKA = {
  listening: '<path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  reading: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  writing: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  speaking: '<path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10v1a7 7 0 0 0 14 0v-1M12 18v4"/>',
  general: '<path d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20zM2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z"/>',
  reja: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  takror: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  namuna: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h6"/>',
  tahlil: '<path d="M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM21 21l-4.3-4.3"/>',
} as const;

export const qollanmalar: IeltsBand[] = [
  { nomi: 'Listening', tavsif: "Savol turlari, oldindan o'qish, imlo tuzoqlari", qism: 'qollanma/listening/', ikonka: IKONKA.listening },
  { nomi: 'Reading', tavsif: 'Skimming, scanning, True/False/Not Given', qism: 'qollanma/reading/', ikonka: IKONKA.reading },
  { nomi: 'Writing Task 2', tavsif: 'Insho tuzilishi va reja', ikonka: IKONKA.writing },
  { nomi: 'Speaking', tavsif: "Uch qism va o'zingni yozib eshitish", ikonka: IKONKA.speaking },
];

export const asos: IeltsBand = {
  nomi: 'General English',
  tavsif: "B1 darajasidan B2'ga: grammatika va lug'at, IELTS'dan oldin.",
  ikonka: IKONKA.general,
};

/** Interaktiv darslar (standart: docs/interaktiv-dars-standarti.md) */
export const darslar: IeltsBand[] = [
  { nomi: 'True / False / Not Given', tavsif: "Dalil gapni topib, mos, zid yoki yo'qligini ajratish", qism: 'qollanma/reading/tfng/', ikonka: IKONKA.tahlil },
  { nomi: 'Matching headings', tavsif: 'Paragrafning asosiy fikriga sarlavha tanlash', qism: 'qollanma/reading/sarlavhalar/', ikonka: IKONKA.namuna },
];

/** Mashq testlari (hozircha faqat Reading ishlaydi) */
export const mashqlar: IeltsBand[] = [
  { nomi: 'Mashq testlari', tavsif: "Reading test ochiq, qolgan bo'limlar tez orada", qism: 'mashq/', ikonka: IKONKA.namuna },
  { nomi: 'Reading test', tavsif: '60 daqiqa, 40 savol, taxminiy band', qism: 'mashq/reading/', ikonka: IKONKA.reading },
  { nomi: 'Listening imlo', tavsif: "So'zni tinglab, to'g'ri yozish", qism: 'mashq/listening-imlo/', ikonka: IKONKA.listening },
  { nomi: 'Harf va raqam diktanti', tavsif: 'Ism, telefon, sana va narxni tinglab yozish', qism: 'mashq/listening-raqamlar/', ikonka: IKONKA.listening },
];

export const vositalar: IeltsBand[] = [
  { nomi: '30 kunlik reja', tavsif: "Uch savol asosida kunma-kun reja", qism: 'vosita/reja/', ikonka: IKONKA.reja },
];

export const KALIT_IELTS_REJA = 'tayanch:ielts-reja';
