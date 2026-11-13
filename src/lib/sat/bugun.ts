// SAT "Today" bloki (/uz/sat/, kirgan o'quvchi; rekonstruksiya 1-bosqich, 2026-11-13).
// Sof mantiq: server javoblaridan (mock_status, review_overview, vocab_progress soni, analytics_summary) va
// brauzerdagi reja kalitidan bitta "asosiy qadam" va kartalar holatini chiqaradi. Tarmoq va DOM yo'q (testlar: testlar/bugun.test.ts).
// Uydirma raqam yo'q: ma'lumot kelmagan karta "null" bo'lib qoladi va ekranda yashiriladi.

export type QadamTur = 'mock' | 'takrorlash' | 'reja' | 'zaif' | 'boshlash';

export interface BugunKirish {
  /** Tugallanmagan mock (mock_status.active); null: yo'q yoki o'qib bo'lmadi */
  mockFaol: { form_no: number; current_module: number; phase: string } | null;
  /** Bugun takrorlanadigan xatolar (bank, review_overview). null: o'qib bo'lmadi */
  xatoDue: number | null;
  /** Bugun takrorlanadigan so'zlar (vocab_progress + user_vocab_words). null: o'qib bo'lmadi */
  sozDue: number | null;
  /** Brauzerda o'quv rejasi bor (tayanch:sat-reja) */
  rejaBor: boolean;
  /** analytics_summary; null: o'qib bo'lmadi */
  tahlil: {
    urinish: number;
    togri: number;
    streak: number;
    /** Eng zaif ko'nikmalar (analitika.tavsiyalar tartibida), 3 tagacha */
    zaif: { skill: string; foiz: number | null }[];
  } | null;
  /** Oxirgi tugagan mock ball (taxminiy); null: yo'q */
  oxirgiBall: { total: number; sana: string } | null;
}

export interface AsosiyQadam {
  tur: QadamTur;
  sarlavha: string;
  matn: string;
  tugma: string;
  /** /uz/sat/ dan keyingi qism (yol() ga beriladi) */
  qism: string;
}

const sonMatn = (n: number, bir: string, kop: string) => `${n} ${n === 1 ? bir : kop}`;

/** Ustuvorlik: tugallanmagan mock → bugungi takrorlash → reja → zaif ko'nikma → boshlash. */
export function asosiyQadam(k: BugunKirish): AsosiyQadam {
  if (k.mockFaol) {
    return {
      tur: 'mock',
      sarlavha: 'Finish your mock test',
      matn: `Mock test ${k.mockFaol.form_no} is waiting for you. You'll continue where you stopped.`,
      tugma: 'Resume mock test',
      qism: 'mashq/mock/',
    };
  }
  const due = (k.xatoDue ?? 0) + (k.sozDue ?? 0);
  if (due > 0) {
    const qism = (k.xatoDue ?? 0) > 0 ? 'vosita/takrorlash/?tab=due' : 'mashq/lugat/';
    const qismlar: string[] = [];
    if (k.xatoDue) qismlar.push(sonMatn(k.xatoDue, 'mistake', 'mistakes'));
    if (k.sozDue) qismlar.push(sonMatn(k.sozDue, 'word', 'words'));
    return {
      tur: 'takrorlash',
      sarlavha: 'Review what is due today',
      matn: `${qismlar.join(' and ')} to review today. Short reviews keep what you learned.`,
      tugma: 'Start review',
      qism,
    };
  }
  if (k.rejaBor) {
    return {
      tur: 'reja',
      sarlavha: "Continue your study plan",
      matn: "Open your plan and pick up today's tasks.",
      tugma: 'Open my plan',
      qism: 'vosita/reja/',
    };
  }
  const eng = k.tahlil?.zaif[0];
  if (eng) {
    return {
      tur: 'zaif',
      sarlavha: 'Practice your weakest skill',
      matn: eng.foiz == null ? `${eng.skill} needs more practice.` : `${eng.skill}: ${eng.foiz}% correct so far.`,
      tugma: 'Practice questions',
      qism: 'mashq/bank/',
    };
  }
  return {
    tur: 'boshlash',
    sarlavha: 'Start with a short set',
    matn: k.tahlil && k.tahlil.urinish > 0
      ? 'Pick a topic in the question bank and answer a few questions.'
      : 'Answer your first questions in the question bank. Your progress will show up here.',
    tugma: 'Open the question bank',
    qism: 'mashq/bank/',
  };
}

export function streakMatn(streak: number): string {
  if (streak <= 0) return 'No streak yet';
  return streak === 1 ? '1 day' : `${streak} days`;
}

export function aniqlikMatn(urinish: number, togri: number): string | null {
  if (urinish <= 0) return null;
  return `${Math.round((togri / urinish) * 100)}%`;
}

/** Bugun takrorlanadigan bank xatolari: quti 1–4 va keyingi sana bugun yoki oldin (xatoDaftari.tabdami 'due' bilan bir xil). */
export function xatoDueSoni(items: readonly { in_queue: boolean; box: number | null; next_due: string | null }[], bugun: string): number {
  return items.filter((q) => q.in_queue && typeof q.box === 'number' && q.box >= 1 && q.box < 5 && typeof q.next_due === 'string' && q.next_due <= bugun).length;
}

/** tayanch:sat-reja ichida nimadir saqlanganmi (shakli muhim emas: faqat bo'sh emasligi). */
export function rejaBormi(xom: string | null): boolean {
  if (!xom) return false;
  try {
    const v = JSON.parse(xom);
    if (Array.isArray(v)) return v.length > 0;
    return !!v && typeof v === 'object' && Object.keys(v).length > 0;
  } catch {
    return false;
  }
}
