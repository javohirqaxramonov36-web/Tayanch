// Original SAT savollari formati (P05). Hujjat: docs/savol-formati.md.
// Savollarning o'zi repoda emas: TAYANCH_SAVOLLAR_DIR (repodan tashqaridagi papka). Repoda faqat sxema va 3 ta namuna.
// Bu fayl scripts/savol/ skriptlari tomonidan to'g'ridan-to'g'ri import qilinadi (Node type stripping):
// faqat o'chiriladigan TS sintaksisi (enum, namespace yo'q).
//
// Taksonomiya: rasmiy Digital SAT kontent domenlari va ko'nikmalari, manba CB12 (src/data/manbalar.ts).
// Nomlar sahifadagidek; PSAT uchun qavs ichidagi izohlar olib tashlangan (SAT nomi qolgan).
// "Command of Evidence" rasmiy ro'yxatda ikki qismga bo'lingan (Textual, Quantitative): bu yerda ikki alohida ko'nikma.

export type SavolBolim = 'rw' | 'math';
export type SavolFormat = 'mcq' | 'spr';
export type VariantKalit = 'A' | 'B' | 'C' | 'D';
export type Qiyinlik = 1 | 2 | 3 | 4 | 5;
export type Qoralovchi = 'ai' | 'human';
export type SavolStatus = 'draft' | 'verified';

export interface SavolVariant {
  key: VariantKalit;
  text: string;
}

export interface SavolRasm {
  type: 'svg' | 'png';
  /** Manba faylda: savol fayliga nisbatan yo'l. Bazada: Storage bucket ichidagi yo'l (import yozadi). */
  src: string;
  /** Ekran o'quvchi uchun matn (majburiy). */
  alt: string;
}

export interface Savol {
  /** Barqaror ID: kichik lotin harf, raqam, defis (3–64 belgi). Import shu bo'yicha upsert qiladi. */
  external_id: string;
  section: SavolBolim;
  /** CB12 dagi domen nomi (savolTaksonomiya[section] kaliti). */
  domain: string;
  /** CB12 dagi ko'nikma nomi (shu domen ichida). */
  skill: string;
  difficulty: Qiyinlik;
  format: SavolFormat;
  /** Ixtiyoriy matn yoki jadval. Ruxsat etilgan teglar: ruxsatTeglar. R&W da majburiy. */
  passage?: string | null;
  stem: string;
  /** mcq: aniq 4 ta (A–D). spr: yo'q yoki bo'sh. */
  options?: SavolVariant[] | null;
  /** mcq: bitta harf. spr: qabul qilinadigan javoblar ro'yxati, masalan ['3/4', '.75', '0.75']. */
  answer: VariantKalit | string[];
  explanation: string;
  figure?: SavolRasm | null;
  tags: string[];
  source: 'original';
  drafted_by: Qoralovchi;
  /** Savolni yozgan (yoki AI qoralamasini tayyorlagan) odam yoki AI nomi. */
  author: string;
  /** Tasdiqlagan inson ismi. author bilan bir xil bo'lmaydi; AI nomi bo'lmaydi. */
  verified_by: string | null;
  /** Tasdiqlash vaqti (ISO 8601). savol:tasdiqla yozadi. */
  verified_at?: string | null;
  /** Tasdiqlash paytidagi mazmun hash'i. Mazmun keyin o'zgarsa, savol yana draft bo'ladi (tekshiruvchi xato beradi). */
  verified_hash?: string | null;
  /** Butun son, 1 dan. Tasdiqlangandan keyin mazmun o'zgarsa oshiriladi. */
  version: number;
}

export const variantKalitlari: readonly VariantKalit[] = ['A', 'B', 'C', 'D'];

/** passage, stem, variant va tushuntirishda ruxsat etilgan HTML teglari (atributsiz). */
export const ruxsatTeglar: readonly string[] = ['u', 'b', 'i', 'br', 'table', 'caption', 'thead', 'tbody', 'tr', 'th', 'td'];

/** Fayldagi ruxsat etilgan maydonlar (boshqasi bo'lsa xato: imlo xatosini ushlash uchun). */
export const savolMaydonlari: readonly string[] = [
  'external_id', 'section', 'domain', 'skill', 'difficulty', 'format', 'passage', 'stem', 'options', 'answer',
  'explanation', 'figure', 'tags', 'source', 'drafted_by', 'author', 'verified_by', 'verified_at', 'verified_hash', 'version',
];

/** Namuna savollar shu teg bilan belgilanadi; import ularni bazaga yuklamaydi. */
export const namunaTeg = 'namuna';

export const savolTaksonomiya: Record<SavolBolim, Record<string, readonly string[]>> = {
  rw: {
    'Information and Ideas': [
      'Central Ideas and Details',
      'Command of Evidence: Textual',
      'Command of Evidence: Quantitative',
      'Inferences',
    ],
    'Craft and Structure': ['Words in Context', 'Text Structure and Purpose', 'Cross-Text Connections'],
    'Expression of Ideas': ['Rhetorical Synthesis', 'Transitions'],
    'Standard English Conventions': ['Boundaries', 'Form, Structure, and Sense'],
  },
  math: {
    Algebra: [
      'Linear equations in one variable',
      'Linear equations in two variables',
      'Linear functions',
      'Systems of two linear equations in two variables',
      'Linear inequalities in one or two variables',
    ],
    'Advanced Math': [
      'Equivalent expressions',
      'Nonlinear equations in one variable and systems of equations in two variables',
      'Nonlinear functions',
    ],
    'Problem-Solving and Data Analysis': [
      'Ratios, rates, proportional relationships, and units',
      'Percentages',
      'One-variable data: Distributions and measures of center and spread',
      'Two-variable data: Models and scatterplots',
      'Probability and conditional probability',
      'Inference from sample statistics and margin of error',
      'Evaluating statistical claims: Observational studies and experiments',
    ],
    'Geometry and Trigonometry': [
      'Area and volume',
      'Lines, angles, and triangles',
      'Right triangles and trigonometry',
      'Circles',
    ],
  },
};
