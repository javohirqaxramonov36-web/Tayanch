// Homepage card copy from the author's brief. Free means usable content exists without payment.
// AI Academy: kurs ochilmaguncha (aiAcademy.ts `holat`) karta "Boshlash" va'da qilmaydi.
// 2026-11-24 CTA brifi: har bepul qavatda aniq fe'l (`harakat`), hero paneli tugmasi (`tugma`) va
// birinchi bepul sahifa (`href`). Hero paneli faqat `tugma` bor qavatlarni ko'rsatadi.
import { aiKursOchiq } from './aiAcademy';

export type BoshKarta = {
  slug: 'top-admission' | 'sat' | 'ielts' | 'eyuf' | 'ai-academy';
  title: string;
  line: string;
  short: string;
  /** Karta pastidagi aniq harakat (strelkasiz) */
  harakat: string;
  /** Karta va panel havolasi: qavatning birinchi bepul sahifasi */
  href: string;
  free: boolean;
  /** Hero paneli tasdiq tugmasi matni (bo'lmasa qavat panelda yo'q) */
  tugma?: string;
};

export const boshKartalar: readonly BoshKarta[] = [
  { slug: 'top-admission', title: 'Top Admission', line: "Qaysi davlatda grant bilan oʻqish mumkin? Universitet tanlashdan qabul xatigacha.", short: 'Qaysi davlatda grant bor?', harakat: "Qoʻllanmani ochish", tugma: "Top Admission qoʻllanmasini ochish", href: '/uz/top-admission/qollanma/ariza-zinapoyasi/', free: true },
  { slug: 'sat', title: 'SAT', line: 'Digital SAT: Math va Reading & Writing — interaktiv darslar va xato daftari.', short: 'Math va Reading & Writing darslari', harakat: 'SAT darsini boshlash', tugma: 'Birinchi SAT darsini boshlash', href: '/uz/sat/qollanma/math/hajm/', free: true },
  { slug: 'ielts', title: 'IELTS', line: "Qaysi koʻnikmangiz boʻsh? Reading testi va natija tahlili bilan aniqlang.", short: "Qaysi koʻnikmangiz boʻsh?", harakat: 'IELTS testini boshlash', tugma: 'IELTS Reading testini boshlash', href: '/uz/ielts/mashq/reading/test/?boshla=1', free: true },
  { slug: 'eyuf', title: 'El-Yurt Umidi', line: 'IQ testga tayyormisiz? Hoziroq tekshiring. Hujjatdan suhbatgacha tayyorgarlik.', short: 'IQ testga tayyormisiz?', harakat: 'IQ testini boshlash', tugma: 'IQ testini boshlash', href: '/uz/eyuf/iq/', free: true },
  { slug: 'ai-academy', title: 'AI Academy', ...(aiKursOchiq
    ? { line: "Toʻgʻri prompt yozishni oʻrganing va oʻz muammoingizni AI bilan hal qiling.", short: "Prompt yozishni oʻrganing", harakat: 'Kursni boshlash' }
    : { line: "Tez orada: toʻgʻri prompt yozish va oʻz muammoingizni AI bilan hal qilish kursi.", short: 'Prompt kursi tez orada', harakat: "Nima boʻlishini koʻrish" }), href: '/uz/ai-academy/', free: false },
];

/** Hero paneli standart tanlovi (brif: SAT) */
export const standartQavat: BoshKarta['slug'] = 'sat';

export const bepulImkoniyatlar = ['SAT interaktiv darslari va xato daftari', 'IELTS Reading testi va natija tahlili', "Top Admission qoʻllanmalari", 'El-Yurt Umidi IQ mashqlari'];

/** Yakuniy banner isbot chiplari: asoschining shaxsiy natijalari (muallif brifi, 2026-11-24) */
export const asoschiNatijalari = ['24 ta qabul xati', '$1M+ grant taklifi', 'IELTS 7.0', 'SAT 1420'];
