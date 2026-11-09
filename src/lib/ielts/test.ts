import bandlar from '../../data/ielts/bandlar.json' with { type: 'json' };

export const modullar = ['listening', 'reading', 'writing', 'speaking'] as const;
export type Modul = typeof modullar[number];
export type BallModul = 'reading' | 'listening';
export const modulNomi = { reading: 'Reading', listening: 'Listening', writing: 'Writing', speaking: 'Speaking' };

export const turNomi = {
  tfng: 'True / False / Not Given',
  ynng: 'Yes / No / Not Given',
  'choice-single': 'Multiple choice',
  'choice-multiple': 'Choose more than one',
  'matching-headings': 'Matching headings',
  'matching-information': 'Matching information',
  'sentence-completion': 'Sentence completion',
  'summary-completion': 'Summary completion',
  'short-answer': 'Short answer',
  'form-completion': 'Form completion',
  'note-completion': 'Note completion',
  matching: 'Matching',
  'map-labelling': 'Map / diagram labelling',
} as const;

export type SavolTuri = keyof typeof turNomi;
export type Javob = string | string[];
export interface Dalil {
  ref: string;
  quote: string;
}
interface SavolAsos {
  id: string;
  type: SavolTuri;
  text: string;
  evidence: Dalil[];
  explanation_uz: string;
  explanation_en: string;
  difficulty: 1 | 2 | 3;
}
export type Savol = SavolAsos & (
  | { type: 'choice-multiple'; options: string[]; correct: string[] }
  | { options: string[]; correct: string }
  | { accepted: string[]; maxWords: number }
);

export interface Diagram {
  title: string;
  alt: string;
  places: { label: string; x: number; y: number }[];
}
export interface BallQism {
  title: string;
  paragraphs?: string[];
  script?: { speaker: string; text: string }[];
  audio?: string;
  diagram?: Diagram;
  questions: Savol[];
}
export interface TestAsos {
  id: string;
  title: string;
  durationSeconds: number;
  verified_by: string | null;
}
export interface BallTest extends TestAsos {
  module: BallModul;
  sections: BallQism[];
  reviewSeconds?: number;
}
export interface Chart {
  title: string;
  unit: string;
  labels: string[];
  series: { name: string; values: number[] }[];
}
export interface WritingTest extends TestAsos {
  module: 'writing';
  tasks: { text: string; minWords: number; chart?: Chart }[];
}
export interface SpeakingTest extends TestAsos {
  module: 'speaking';
  parts: { title: string; questions: string[]; prepSeconds?: number; cue?: string }[];
}
export type Test = BallTest | WritingTest | SpeakingTest;

export const testIdMi = (id: string) => /^(?:mock-\d{2}|namuna)$/.test(id);
export const ballModulmi = (modul: Modul): modul is BallModul => modul === 'reading' || modul === 'listening';
export const savollar = (test: BallTest) => test.sections.flatMap((qism) => qism.questions);

export function norm(matn: string) {
  return matn.normalize('NFKC').toLowerCase().trim().replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
}

export function javobBormi(javob?: Javob) {
  return typeof javob === 'string' ? Boolean(javob.trim()) : Boolean(javob?.length);
}

export function sozlar(matn: string) {
  return matn.trim().split(/\s+/u).filter(Boolean).length;
}

export function bahola(savol: Savol, javob?: Javob) {
  if (Array.isArray(javob)) {
    if (!('correct' in savol) || !Array.isArray(savol.correct)) return false;
    const yagona = new Set(javob.map(norm));
    return yagona.size === savol.correct.length && savol.correct.every((variant) => yagona.has(norm(variant)));
  }
  if (!javob?.trim()) return false;
  if ('accepted' in savol) return sozlar(javob) <= savol.maxWords && savol.accepted.some((variant) => norm(variant) === norm(javob));
  return typeof savol.correct === 'string' && norm(savol.correct) === norm(javob);
}

export function taxminiyBand(modul: BallModul, togri: number, jami: number) {
  if (jami !== 40) return null;
  return bandlar[modul].find(([minimum]) => togri >= minimum)?.[1] ?? '< 4';
}

export function natijala(test: BallTest, javoblar: Record<string, Javob>) {
  const turBoyicha = new Map<SavolTuri, { jami: number; togri: number }>();
  const xatolar: { savol: Savol; raqam: number; javob?: Javob }[] = [];
  const barcha = savollar(test);
  for (const [i, savol] of barcha.entries()) {
    const tur = turBoyicha.get(savol.type) ?? { jami: 0, togri: 0 };
    tur.jami += 1;
    const javob = javoblar[savol.id];
    if (bahola(savol, javob)) tur.togri += 1;
    else xatolar.push({ savol, raqam: i + 1, javob });
    turBoyicha.set(savol.type, tur);
  }
  const togri = barcha.length - xatolar.length;
  return { togri, jami: barcha.length, band: taxminiyBand(test.module, togri, barcha.length), turBoyicha, xatolar };
}

export function javobMatni(javob?: Javob) {
  return javobBormi(javob) ? (Array.isArray(javob) ? javob.join(', ') : javob!) : 'Javobsiz';
}
