// IELTS Reading test schema (v1): types plus a validator shared by the build and `npm run validate:tests`.
// Human-readable description: docs/ielts-schema.md.

export const SXEMA_VERSIYA = 1;
export const SAVOL_TURLARI = ['tfng', 'mcq', 'matching-headings', 'gap-fill'] as const;
export type SavolTuriNomi = (typeof SAVOL_TURLARI)[number];
export const TFNG_JAVOBLAR = ['TRUE', 'FALSE', 'NOT GIVEN'] as const;

export interface Dalil {
  /** label of the paragraph that holds the evidence */
  paragraph: string;
  /** verbatim quote from that paragraph (used for highlighting) */
  quote: string;
}

export interface Variant {
  id: string;
  text: string;
}

export interface Savol {
  /** question number (1..40); omitted when `numbers` is used */
  number?: number;
  /** "Choose TWO" questions occupy two consecutive numbers, e.g. [20, 21] */
  numbers?: number[];
  prompt: string;
  /** mcq only */
  options?: Variant[];
  /** mcq only: how many options to choose (default 1) */
  choose?: 1 | 2;
  /** gap-fill only: maximum number of words */
  wordLimit?: number;
  /** tfng: "TRUE" | "FALSE" | "NOT GIVEN"; mcq: option id or [id, id]; matching: heading id; gap-fill: text */
  answer: string | string[];
  /** gap-fill only: other spellings that are also correct */
  acceptedAnswers?: string[];
  explanation: string;
  evidence: Dalil;
}

export interface Guruh {
  type: SavolTuriNomi;
  instructions: string;
  /** matching-headings only */
  headings?: Variant[];
  questions: Savol[];
}

export interface Paragraf {
  label: string;
  text: string;
}

export interface Passage {
  id: string;
  difficulty: string;
  title: string;
  paragraphs: Paragraf[];
  groups: Guruh[];
}

export interface ReadingTest {
  schemaVersion: 1;
  testId: string;
  title: string;
  durationMinutes: number;
  /** language of the explanations, for the `lang` attribute on the result screen (default "en") */
  explanationLang?: 'en' | 'uz';
  passages: Passage[];
}

/** Numbers a question occupies: one for regular questions, two for "Choose TWO". */
export function savolRaqamlari(s: Savol): number[] {
  if (Array.isArray(s.numbers) && s.numbers.length > 0) return s.numbers;
  return typeof s.number === 'number' ? [s.number] : [];
}

/** Key used to store the answer of a question: its first number. */
export function savolKaliti(s: Savol): string {
  return String(savolRaqamlari(s)[0]);
}

export function sozSoni(s: string): number {
  const t = s.trim();
  return t === '' ? 0 : t.split(/\s+/).length;
}

export interface TekshiruvSozlama {
  /** expected number of question numbers; 40 for real tests, smaller for fixtures */
  jamiSavol?: number;
}

const matn = (x: unknown): x is string => typeof x === 'string' && x.trim().length > 0;
const obyekt = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

function variantlar(x: unknown, joy: string, xato: string[]): Variant[] {
  if (!Array.isArray(x) || x.length < 2) {
    xato.push(`${joy}: at least 2 items are required`);
    return [];
  }
  const toza: Variant[] = [];
  const idlar = new Set<string>();
  x.forEach((v, i) => {
    if (!obyekt(v) || !matn(v.id) || !matn(v.text)) {
      xato.push(`${joy}[${i}]: "id" and "text" are required`);
      return;
    }
    if (idlar.has(v.id)) xato.push(`${joy}[${i}]: duplicate id "${v.id}"`);
    idlar.add(v.id);
    toza.push({ id: v.id, text: v.text });
  });
  return toza;
}

/**
 * Validates one test. Returns a list of human-readable errors (empty when the test is valid).
 * Never throws: callers decide whether to fail the build.
 */
export function tekshirTest(test: unknown, sozlama: TekshiruvSozlama = {}): string[] {
  const jami = sozlama.jamiSavol ?? 40;
  const xato: string[] = [];
  if (!obyekt(test)) return ['test: must be a JSON object'];
  if (test.schemaVersion !== SXEMA_VERSIYA) xato.push(`schemaVersion: must be ${SXEMA_VERSIYA}`);
  if (!matn(test.testId) || !/^[a-z0-9-]+$/.test(test.testId as string)) xato.push('testId: lowercase letters, digits and "-" only');
  if (!matn(test.title)) xato.push('title: required');
  if (typeof test.durationMinutes !== 'number' || !(test.durationMinutes > 0)) xato.push('durationMinutes: must be a positive number');
  if (test.explanationLang !== undefined && test.explanationLang !== 'en' && test.explanationLang !== 'uz') {
    xato.push('explanationLang: must be "en" or "uz"');
  }
  if (!Array.isArray(test.passages) || test.passages.length === 0) {
    xato.push('passages: at least one passage is required');
    return xato;
  }

  const raqamlar: number[] = [];
  const passageIdlar = new Set<string>();

  test.passages.forEach((p: unknown, pi: number) => {
    const pj = `passages[${pi}]`;
    if (!obyekt(p)) {
      xato.push(`${pj}: must be an object`);
      return;
    }
    if (!matn(p.id)) xato.push(`${pj}.id: required`);
    else if (passageIdlar.has(p.id)) xato.push(`${pj}.id: duplicate "${p.id}"`);
    else passageIdlar.add(p.id);
    if (!matn(p.difficulty)) xato.push(`${pj}.difficulty: required`);
    if (!matn(p.title)) xato.push(`${pj}.title: required`);

    // Paragraph labels must be unique inside a passage: evidence points at them.
    const paragraflar = new Map<string, string>();
    if (!Array.isArray(p.paragraphs) || p.paragraphs.length === 0) {
      xato.push(`${pj}.paragraphs: at least one paragraph is required`);
    } else {
      p.paragraphs.forEach((g: unknown, gi: number) => {
        if (!obyekt(g) || !matn(g.label) || !matn(g.text)) {
          xato.push(`${pj}.paragraphs[${gi}]: "label" and "text" are required`);
          return;
        }
        if (paragraflar.has(g.label)) xato.push(`${pj}.paragraphs[${gi}]: duplicate label "${g.label}"`);
        paragraflar.set(g.label, g.text);
      });
    }

    if (!Array.isArray(p.groups) || p.groups.length === 0) {
      xato.push(`${pj}.groups: at least one group is required`);
      return;
    }
    p.groups.forEach((g: unknown, gi: number) => {
      const gj = `${pj}.groups[${gi}]`;
      if (!obyekt(g)) {
        xato.push(`${gj}: must be an object`);
        return;
      }
      const type = g.type as SavolTuriNomi;
      if (!SAVOL_TURLARI.includes(type)) {
        xato.push(`${gj}.type: must be one of ${SAVOL_TURLARI.join(', ')}`);
        return;
      }
      if (!matn(g.instructions)) xato.push(`${gj}.instructions: required`);
      const sarlavhalar = type === 'matching-headings' ? variantlar(g.headings, `${gj}.headings`, xato) : [];
      if (!Array.isArray(g.questions) || g.questions.length === 0) {
        xato.push(`${gj}.questions: at least one question is required`);
        return;
      }
      const ishlatilgan = new Set<string>();
      g.questions.forEach((s: unknown, si: number) => {
        const sj = `${gj}.questions[${si}]`;
        if (!obyekt(s)) {
          xato.push(`${sj}: must be an object`);
          return;
        }
        // Numbers
        const ikkita = type === 'mcq' && s.choose === 2;
        let nums: number[] = [];
        if (ikkita) {
          if (!Array.isArray(s.numbers) || s.numbers.length !== 2 || !s.numbers.every((n) => Number.isInteger(n))) {
            xato.push(`${sj}.numbers: "Choose TWO" needs two question numbers, e.g. [20, 21]`);
          } else if (s.numbers[1] !== s.numbers[0] + 1) {
            xato.push(`${sj}.numbers: the two numbers must be consecutive`);
          } else nums = s.numbers as number[];
        } else if (!Number.isInteger(s.number)) {
          xato.push(`${sj}.number: an integer question number is required`);
        } else nums = [s.number as number];
        raqamlar.push(...nums);
        const nom = nums.length ? `Q${nums.join('-')}` : sj;

        if (!matn(s.prompt)) xato.push(`${nom}: prompt is required`);
        if (!matn(s.explanation)) xato.push(`${nom}: explanation is required`);

        // Evidence must point at an existing paragraph and quote it verbatim.
        if (!obyekt(s.evidence) || !matn(s.evidence.paragraph) || !matn(s.evidence.quote)) {
          xato.push(`${nom}: evidence with "paragraph" and "quote" is required`);
        } else if (!paragraflar.has(s.evidence.paragraph)) {
          xato.push(`${nom}: evidence.paragraph "${s.evidence.paragraph}" does not exist in passage "${String(p.id)}"`);
        } else if (!paragraflar.get(s.evidence.paragraph)!.includes(s.evidence.quote)) {
          xato.push(`${nom}: evidence.quote is not found verbatim in paragraph "${s.evidence.paragraph}"`);
        }

        // Answer, per type
        if (type === 'tfng') {
          if (!TFNG_JAVOBLAR.includes(s.answer as (typeof TFNG_JAVOBLAR)[number])) {
            xato.push(`${nom}: answer must be one of ${TFNG_JAVOBLAR.join(' / ')}`);
          }
        } else if (type === 'mcq') {
          const ids = variantlar(s.options, `${nom}.options`, xato).map((v) => v.id);
          if (s.choose !== undefined && s.choose !== 1 && s.choose !== 2) xato.push(`${nom}: choose must be 1 or 2`);
          if (ikkita) {
            const a = s.answer;
            if (!Array.isArray(a) || a.length !== 2 || a[0] === a[1] || !a.every((x) => typeof x === 'string' && ids.includes(x))) {
              xato.push(`${nom}: answer must list two different option ids`);
            }
          } else if (typeof s.answer !== 'string' || !ids.includes(s.answer)) {
            xato.push(`${nom}: answer must be one of the option ids`);
          }
        } else if (type === 'matching-headings') {
          if (typeof s.answer !== 'string' || !sarlavhalar.some((h) => h.id === s.answer)) {
            xato.push(`${nom}: answer must be one of the heading ids`);
          } else if (ishlatilgan.has(s.answer)) {
            xato.push(`${nom}: heading "${s.answer}" is already the answer of another question`);
          } else ishlatilgan.add(s.answer);
        } else {
          const limit = s.wordLimit;
          if (!Number.isInteger(limit) || (limit as number) < 1) xato.push(`${nom}: wordLimit must be a positive integer`);
          if (!matn(s.answer)) xato.push(`${nom}: answer is required`);
          if (s.acceptedAnswers !== undefined && (!Array.isArray(s.acceptedAnswers) || !s.acceptedAnswers.every(matn))) {
            xato.push(`${nom}: acceptedAnswers must be a list of non-empty strings`);
          } else if (Number.isInteger(limit) && matn(s.answer)) {
            const hammasi = [s.answer, ...((s.acceptedAnswers as string[] | undefined) ?? [])];
            hammasi.forEach((j) => {
              if (sozSoni(j) > (limit as number)) xato.push(`${nom}: accepted answer "${j}" is longer than wordLimit ${limit}`);
            });
          }
        }
      });
    });
  });

  // Question numbers: 1..N, contiguous and unique.
  const korilgan = new Set<number>();
  raqamlar.forEach((n) => {
    if (korilgan.has(n)) xato.push(`question numbers: ${n} is used more than once`);
    korilgan.add(n);
  });
  if (raqamlar.length !== jami) xato.push(`question numbers: expected ${jami}, found ${raqamlar.length}`);
  for (let n = 1; n <= jami; n++) {
    if (!korilgan.has(n)) xato.push(`question numbers: ${n} is missing`);
  }
  // Numbers must also appear in reading order (reported once, and only when the set itself is right).
  if (!xato.some((x) => x.startsWith('question numbers'))) {
    const buzilgan = raqamlar.find((n, i) => i > 0 && n !== raqamlar[i - 1] + 1);
    if (buzilgan !== undefined) xato.push(`question numbers: ${buzilgan} is out of order`);
  }
  return xato;
}
