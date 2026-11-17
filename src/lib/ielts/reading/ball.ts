// Scoring: one point per question number, plus per-type and per-passage statistics.
import { savolKaliti, savolRaqamlari, type Dalil, type ReadingTest, type SavolTuriNomi } from './sxema.ts';
import { savolTuri } from './turlar/registr.ts';
import type { Javoblar } from './turlar/tur.ts';

export interface SavolNatija {
  number: number;
  /** storage key of the question this number belongs to */
  kalit: string;
  type: SavolTuriNomi;
  passageId: string;
  passageTartib: number;
  prompt: string;
  togri: boolean;
  berilgan: boolean;
  sizning: string;
  togriJavob: string;
  explanation: string;
  evidence: Dalil;
}

export interface Stat {
  togri: number;
  jami: number;
}

export type TurStat = Partial<Record<SavolTuriNomi, Stat>>;

export interface Baho {
  raw: number;
  jami: number;
  javobsiz: number;
  qatorlar: SavolNatija[];
  perTypeStats: TurStat;
  passageStat: (Stat & { id: string })[];
}

export function baholash(test: ReadingTest, javoblar: Javoblar): Baho {
  const qatorlar: SavolNatija[] = [];
  const perTypeStats: TurStat = {};
  const passageStat: (Stat & { id: string })[] = [];

  test.passages.forEach((p, pi) => {
    const ps = { id: p.id, togri: 0, jami: 0 };
    for (const g of p.groups) {
      const tur = savolTuri(g.type);
      const ts = (perTypeStats[g.type] ??= { togri: 0, jami: 0 });
      for (const s of g.questions) {
        const kalit = savolKaliti(s);
        // Stored values are re-normalised so a corrupted entry can never earn a point.
        const javob = tur.normalize(javoblar[kalit], s, g);
        const ballar = tur.check(s, javob);
        const berilgan = tur.berilgan(s, javob);
        const korinish = tur.korsat(s, g, javob);
        savolRaqamlari(s).forEach((n, i) => {
          const togri = ballar[i] === true;
          qatorlar.push({
            number: n, kalit, type: g.type, passageId: p.id, passageTartib: pi, prompt: s.prompt,
            togri, berilgan: berilgan[i] === true,
            sizning: korinish.sizning[i] ?? '', togriJavob: korinish.togri[i] ?? '',
            explanation: s.explanation, evidence: s.evidence,
          });
          ts.jami += 1;
          ps.jami += 1;
          if (togri) {
            ts.togri += 1;
            ps.togri += 1;
          }
        });
      }
    }
    passageStat.push(ps);
  });

  qatorlar.sort((a, b) => a.number - b.number);
  return {
    raw: qatorlar.filter((q) => q.togri).length,
    jami: qatorlar.length,
    javobsiz: qatorlar.filter((q) => !q.berilgan).length,
    qatorlar,
    perTypeStats,
    passageStat,
  };
}

/** Type with the lowest accuracy, or null when there are no questions. Ties keep the first type. */
export function engZaifTur(stat: TurStat): { type: SavolTuriNomi; ulush: number } | null {
  let zaif: { type: SavolTuriNomi; ulush: number } | null = null;
  for (const [type, s] of Object.entries(stat) as [SavolTuriNomi, Stat][]) {
    if (!s || s.jami === 0) continue;
    const ulush = s.togri / s.jami;
    if (!zaif || ulush < zaif.ulush) zaif = { type, ulush };
  }
  return zaif;
}
