// Faqat Astro frontmatter: javobsiz katalog, xususiy savol yoki dars fayli o'qilmaydi.
import { katalogniOqi } from '../../../scripts/kurs/katalog.mjs';
import kursCsv from '../../../docs/course-spec/math-topics.csv?raw';
import { yol } from '../yol';

export const KURS_YOLI = '/uz/sat/kurs/matematika/';
export const kursPreview = import.meta.env.DEV || import.meta.env.MODE === 'kurs-preview';

export interface KursMavzu {
  id: string;
  domain: string;
  domainSlug: string;
  topic: string;
  topicSlug: string;
  prerequisites: string[];
  subtopics: string[];
  desmos: boolean;
  counts: { mini_test: number };
}

export const kursMavzulari: KursMavzu[] = kursPreview ? katalogniOqi(kursCsv) : [];

export const kursBosqichlari = [
  { slug: 'asos', nom: 'Foundation', set: 'foundation', tavsif: 'Build the core idea.' },
  { slug: 'asosiy', nom: 'Core', set: 'core', tavsif: 'Apply the idea independently.' },
  { slug: 'murakkab', nom: 'Advanced', set: 'advanced', tavsif: 'Use it in more demanding problems.' },
] as const;

export type KursBosqich = (typeof kursBosqichlari)[number];
export const mavzuManzili = (mavzu: KursMavzu) => `${mavzu.domainSlug}/${mavzu.topicSlug}/`;
export const kursHavola = (qism = '') => yol(KURS_YOLI + qism);

export function kursNatijaHavolalari() {
  return Object.fromEntries(kursMavzulari.map((mavzu, i) => {
    const keyingi = kursMavzulari[i + 1];
    return [mavzu.id, {
      mavzu: kursHavola(mavzuManzili(mavzu)),
      keyingi: keyingi ? kursHavola(mavzuManzili(keyingi)) : undefined,
    }];
  }));
}
