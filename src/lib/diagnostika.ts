// SAT diagnostikasi: toza funksiyalar (DOM va localStorage yo'q).
// Importsiz: node to'g'ridan-to'g'ri test qila oladi (scripts/diagnostika-test.ts).
// Bu taxminiy diagnostika: ball (400–1600) va persentil hisoblanmaydi.

export type Harf = 'A' | 'B' | 'C' | 'D';
export type Bolim = 'RW' | 'Math';
export type XatoTuri = 'bilim' | 'etibor' | 'vaqt';

export interface DiagSavol {
  id: string;
  section: Bolim;
  domain: string;
  skill: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  choices: string[];
  answer: Harf;
  explanation_uz: string;
  desmos_tip?: string;
  reviewed: boolean;
  source: 'original';
}

/** Savol id → tanlangan harf; javob berilmagan bo'lsa null yoki yo'q */
export type Javoblar = Record<string, Harf | null | undefined>;

export interface Hisob { togri: number; jami: number }
export interface DomenNatija extends Hisob { section: Bolim; domain: string; xato: number }
export interface SavolNatija { id: string; javob: Harf | null; holat: 'togri' | 'xato' | 'javobsiz' }

export interface Natija {
  bolimlar: Record<Bolim, Hisob>;
  domenlar: DomenNatija[];
  savollar: SavolNatija[];
  javobsiz: string[];
  /**
   * Tavsiya qilinadigan domenlar: kamida 1 xato (javobsiz ham xato) bo'lganlar, saralangan (saralaZaif),
   * ko'pi bilan `chegara` ta. Xato yo'q bo'lsa bo'sh.
   */
  zaifDomenlar: DomenNatija[];
  /** Xatosi bor, lekin chegaradan tashqarida qolgan domenlar soni ("and K more areas") */
  qolganZaif: number;
}

export const BOLIM_SONI = 5;
/** Natijada ko'pi bilan nechta domen tavsiya qilinadi (muallif qarori C, 2026-11-09) */
export const TAVSIYA_SONI = 3;

const ulush = (h: Hisob) => (h.jami === 0 ? 0 : h.togri / h.jami);

/**
 * Xatosi bor domenlar tartibi: 1) xato soni ko'p, 2) xato ulushi (xato/jami) katta,
 * 3) bo'limi pastroq ball olgan (to'g'ri/jami kichik). Hammasi teng bo'lsa asl tartib (R&W avval) saqlanadi.
 */
export function saralaZaif(domenlar: DomenNatija[], bolimlar: Record<Bolim, Hisob>): DomenNatija[] {
  return domenlar
    .filter((d) => d.xato > 0)
    .map((d, i) => ({ d, i }))
    .sort((a, b) =>
      b.d.xato - a.d.xato
      || b.d.xato / b.d.jami - a.d.xato / a.d.jami
      || ulush(bolimlar[a.d.section]) - ulush(bolimlar[b.d.section])
      || a.i - b.i)
    .map(({ d }) => d);
}

/** Prod'da faqat reviewed: true. Har bo'limdan BOLIM_SONI ta, R&W avval. Yetmasa yetarli: false. */
export function tanlaSavollar(hamma: DiagSavol[], dev: boolean): { savollar: DiagSavol[]; yetarli: boolean } {
  const ruxsat = hamma.filter((s) => dev || s.reviewed === true);
  const rw = ruxsat.filter((s) => s.section === 'RW').slice(0, BOLIM_SONI);
  const math = ruxsat.filter((s) => s.section === 'Math').slice(0, BOLIM_SONI);
  const yetarli = rw.length === BOLIM_SONI && math.length === BOLIM_SONI;
  return { savollar: yetarli ? [...rw, ...math] : [], yetarli };
}

export function javobsizlar(savollar: DiagSavol[], javoblar: Javoblar): string[] {
  return savollar.filter((s) => !javoblar[s.id]).map((s) => s.id);
}

export function hisoblaNatija(savollar: DiagSavol[], javoblar: Javoblar, chegara = TAVSIYA_SONI): Natija {
  const bolimlar: Record<Bolim, Hisob> = { RW: { togri: 0, jami: 0 }, Math: { togri: 0, jami: 0 } };
  const domenMap = new Map<string, DomenNatija>();
  const natijalar: SavolNatija[] = [];

  for (const s of savollar) {
    const javob = javoblar[s.id] ?? null;
    const holat: SavolNatija['holat'] = javob === null ? 'javobsiz' : javob === s.answer ? 'togri' : 'xato';
    natijalar.push({ id: s.id, javob, holat });

    const b = bolimlar[s.section];
    b.jami += 1;
    const kalit = `${s.section}|${s.domain}`;
    let d = domenMap.get(kalit);
    if (!d) { d = { section: s.section, domain: s.domain, togri: 0, jami: 0, xato: 0 }; domenMap.set(kalit, d); }
    d.jami += 1;
    if (holat === 'togri') { b.togri += 1; d.togri += 1; } else { d.xato += 1; }
  }

  const domenlar = [...domenMap.values()];
  const zaif = saralaZaif(domenlar, bolimlar);
  const n = Math.max(0, Math.floor(chegara));

  return {
    bolimlar,
    domenlar,
    savollar: natijalar,
    javobsiz: natijalar.filter((n) => n.holat === 'javobsiz').map((n) => n.id),
    zaifDomenlar: zaif.slice(0, n),
    qolganZaif: Math.max(0, zaif.length - n),
  };
}
