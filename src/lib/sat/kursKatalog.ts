// Faqat Astro frontmatter. Mijozga havolalar, sonlar va ochiq nazariya chiqariladi.
import { katalogniOqi } from '../../../scripts/kurs/katalog.mjs';
import { nashrniOqi } from '../../../scripts/kurs/buildNashr.mjs';
import kursCsv from '../../../docs/course-spec/math-topics.csv?raw';
import { yol } from '../yol';

export const KURS_YOLI = '/uz/sat/kurs/matematika/';
export const kursPreview = import.meta.env.DEV || import.meta.env.MODE === 'kurs-preview';

export interface KursMavzu {
  id: string;
  domain: string;
  skill: string | null;
  domainSlug: string;
  topic: string;
  topicSlug: string;
  prerequisites: string[];
  subtopics: string[];
  desmos: boolean;
  counts: { mini_test: number };
}

const mavzular = katalogniOqi(kursCsv);
export const kursMavzulari: KursMavzu[] = mavzular;
type NashrMavzusi = { savollar: number; miniTest: number; darslar: [string, string, string] };
// Astro prerender modullarini .astro ichiga yig‘adi. Validator manba katalogidan ishlaydi.
export const kursNashri: Record<string, NashrMavzusi> = process.env.TAYANCH_KURS_NASHR === '1'
  ? nashrniOqi(undefined, undefined, { mavzular, repo: process.cwd() })
  : {};
export const kursOchiq = Object.keys(kursNashri).length > 0;
export const kursMavzuOchiq = (id: string) => Object.hasOwn(kursNashri, id);

export const kursBosqichlari = [
  { slug: 'asos', nom: 'Foundation', set: 'foundation', tavsif: 'Build the core idea.' },
  { slug: 'asosiy', nom: 'Core', set: 'core', tavsif: 'Apply the idea independently.' },
  { slug: 'murakkab', nom: 'Advanced', set: 'advanced', tavsif: 'Use it in more demanding problems.' },
] as const;

export type KursBosqich = (typeof kursBosqichlari)[number];
export const mavzuManzili = (mavzu: KursMavzu) => `${mavzu.domainSlug}/${mavzu.topicSlug}/`;
export const kursHavola = (qism = '') => yol(KURS_YOLI + qism);

export function kursNatijaHavolalari() {
  const mavzular = kursMavzulari.filter((m) => kursMavzuOchiq(m.id) || kursPreview);
  return Object.fromEntries(mavzular.map((mavzu, i) => {
    const keyingi = mavzular[i + 1];
    return [mavzu.id, {
      mavzu: kursHavola(mavzuManzili(mavzu)),
      keyingi: keyingi ? kursHavola(mavzuManzili(keyingi)) : undefined,
    }];
  }));
}

export function kursTavsiyaYollari() {
  return kursMavzulari.filter((m) => kursMavzuOchiq(m.id)).map((m) => ({
    id: m.id, domain: m.domain, skill: m.skill, prerequisites: m.prerequisites,
    href: kursHavola(mavzuManzili(m)), domainHref: kursHavola(`${m.domainSlug}/`),
  }));
}
