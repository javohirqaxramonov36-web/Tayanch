// SAT telefon pastki tab bari (< 1024px): Today, Practice, Learn, Progress, Plan.
// Bandlar yon paneldagi guruhlardan (satYonGuruhlar) olinadi, shuning uchun yon panel va tab bar bir xil tartibda qoladi.
// Sof funksiyalar (DOM yo'q, Node testida ishlaydi): src/lib/testlar/satTab.test.ts.

export type SatTabKalit = 'today' | 'practice' | 'learn' | 'progress' | 'plan';

export interface SatTabGuruh {
  nomi: string;
  /** Guruhdagi sahifalar qismi, yon paneldagi tartibda ("mashq/bank/" kabi). */
  qismlar: string[];
}

export interface SatTab {
  kalit: SatTabKalit;
  nomi: string;
  /** "/uz/sat/" dan keyingi qism: tab bosilganda shu sahifa ochiladi (guruhning birinchi sahifasi). */
  qism: string;
  /** Joriy sahifa: aynan shu tab sahifasi ("page") yoki shu guruh ichidagi boshqa sahifa ("true"). */
  joriy?: 'page' | 'true';
}

const TARTIB: readonly { kalit: Exclude<SatTabKalit, 'today'>; nomi: string }[] = [
  { kalit: 'practice', nomi: 'Practice' },
  { kalit: 'learn', nomi: 'Learn' },
  { kalit: 'progress', nomi: 'Progress' },
  { kalit: 'plan', nomi: 'Plan' },
];

/** "/Tayanch/uz/sat/mashq/bank/" -> "mashq/bank/". SAT tashqarisida null. */
export function satQism(pathname: string): string | null {
  const i = pathname.indexOf('/uz/sat/');
  if (i < 0) return pathname.endsWith('/uz/sat') ? '' : null;
  const q = pathname.slice(i + '/uz/sat/'.length);
  return q === '' || q.endsWith('/') ? q : `${q}/`;
}

/**
 * Tablar va joriy tab. Guruh nomi topilmasa (yon panel o'zgargan) build to'xtaydi: tab bar jim buzilmasin.
 * Joriy guruh: guruhdagi biror sahifa qismi joriy qismning boshi bo'lsa (ichki sahifalar ham, masalan "mashq/lugat/x/").
 * Account sahifalari (profil, obuna) hech bir tabga tegishli emas.
 */
export function satTablar(guruhlar: readonly SatTabGuruh[], joriyQism: string | null): SatTab[] {
  const tablar: SatTab[] = [{ kalit: 'today', nomi: 'Today', qism: '' }];
  for (const t of TARTIB) {
    const g = guruhlar.find((x) => x.nomi === t.nomi);
    if (!g || !g.qismlar.length) throw new Error(`satTablar: yon panelda "${t.nomi}" guruhi yo'q yoki bo'sh`);
    tablar.push({ kalit: t.kalit, nomi: t.nomi, qism: g.qismlar[0] });
  }
  if (joriyQism == null) return tablar;
  if (joriyQism === '') {
    tablar[0].joriy = 'page';
    return tablar;
  }
  // Eng uzun mos boshlanish qaysi guruhda bo'lsa, o'sha tab joriy.
  let eng: { i: number; uzunlik: number } | null = null;
  TARTIB.forEach((t, i) => {
    const g = guruhlar.find((x) => x.nomi === t.nomi)!;
    for (const q of g.qismlar) {
      if (joriyQism.startsWith(q) && (!eng || q.length > eng.uzunlik)) eng = { i: i + 1, uzunlik: q.length };
    }
  });
  if (eng) {
    const tab = tablar[(eng as { i: number }).i];
    tab.joriy = tab.qism === joriyQism ? 'page' : 'true';
  }
  return tablar;
}
