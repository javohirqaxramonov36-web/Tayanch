// Homepage card copy from the author's brief. Free means usable content exists without payment.
// AI Academy: kurs ochilmaguncha (aiAcademy.ts `holat`) karta "Boshlash" va'da qilmaydi.
import { aiKursOchiq } from './aiAcademy';
export const boshKartalar = [
  { slug: 'top-admission', title: 'Top Admission', line: "Qaysi davlatda grant bilan oʻqish mumkin? Universitet tanlashdan qabul xatigacha.", short: 'Qaysi davlatda grant bor?', cta: 'Boshlash →', href: '/uz/top-admission/', color: 'var(--home-admission)', free: true },
  { slug: 'sat', title: 'SAT', line: 'Digital SAT: Math va Reading & Writing — interaktiv darslar va xato daftari.', short: 'Math va Reading & Writing darslari', cta: 'Boshlash →', href: '/uz/sat/', color: 'var(--home-sat)', free: true },
  { slug: 'ielts', title: 'IELTS', line: "Qaysi koʻnikmangiz boʻsh? Reading testi va natija tahlili bilan aniqlang.", short: "Qaysi koʻnikmangiz boʻsh?", cta: 'Boshlash →', href: '/uz/ielts/', color: 'var(--home-ielts)', free: true },
  { slug: 'eyuf', title: 'El-Yurt Umidi', line: 'IQ testga tayyormisiz? Hoziroq tekshiring. Hujjatdan suhbatgacha tayyorgarlik.', short: 'IQ testga tayyormisiz?', cta: 'IQ testni boshlash →', href: '/uz/eyuf/iq/', color: 'var(--home-eyuf)', free: true },
  { slug: 'ai-academy', title: 'AI Academy', ...(aiKursOchiq
    ? { line: "Toʻgʻri prompt yozishni oʻrganing va oʻz muammoingizni AI bilan hal qiling.", short: "Prompt yozishni oʻrganing", cta: 'Boshlash →' }
    : { line: "Tez orada: toʻgʻri prompt yozish va oʻz muammoingizni AI bilan hal qilish kursi.", short: 'Prompt kursi tez orada', cta: "Nima boʻlishini koʻrish →" }), href: '/uz/ai-academy/', color: 'var(--home-ai)', free: false },
] as const;
export const bepulImkoniyatlar = ['SAT interaktiv darslari va xato daftari', 'IELTS Reading testi va natija tahlili', "Top Admission qoʻllanmalari", 'El-Yurt Umidi IQ mashqlari'];
