// Common interface of a question type. Each type lives in its own module and is added to the
// registry (registr.ts); screens and scoring only talk to this interface.
import type { Guruh, Savol, SavolTuriNomi } from '../sxema.ts';

/** Stored answer of one question: text / id, or a list of ids for "Choose TWO". */
export type Javob = string | string[];
/** Answers of an attempt, keyed by the question's first number. */
export type Javoblar = Record<string, Javob>;

export interface RenderKontekst {
  savol: Savol;
  guruh: Guruh;
  javob: Javob | undefined;
  /** id of the element holding the question text, for aria-labelledby */
  matnId: string;
}

export interface Korinish {
  /** one string per occupied question number: what the user answered ("" = no answer) */
  sizning: string[];
  /** one string per occupied question number: the correct answer */
  togri: string[];
}

export interface SavolTuri {
  type: SavolTuriNomi;
  /** HTML of the answer control(s). Controls carry data-savol="<key>" so one listener can read them. */
  render(k: RenderKontekst): string;
  /** Cleans a raw value (from the DOM or from storage). Returns undefined for "no answer". */
  normalize(xom: unknown, savol: Savol, guruh: Guruh): Javob | undefined;
  /** One boolean per occupied question number: is that point earned? */
  check(savol: Savol, javob: Javob | undefined): boolean[];
  /** One boolean per occupied question number: has the user answered it? */
  berilgan(savol: Savol, javob: Javob | undefined): boolean[];
  /** Human-readable answers for the result screen. */
  korsat(savol: Savol, guruh: Guruh, javob: Javob | undefined): Korinish;
}

const BELGILAR: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapes text for use inside HTML text nodes and double-quoted attributes. */
export function qoch(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => BELGILAR[c]);
}
