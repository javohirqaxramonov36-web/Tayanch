export const MOCK_KALITI = 'tayanch:eyuf-mock:v1';
export interface MockSavol {
  id: string;
  level: string[];
  tags: string[];
  verified: boolean;
  answer: string | null;
  contentSource: string;
  options: { id: string }[];
}
export interface MockHolat {
  version: 1;
  id: string;
  level: 'bachelor' | 'master';
  ids: string[];
  answers: Record<string, string>;
  current: number;
  deadline: number;
  finishedAt: number | null;
  progressApplied?: boolean;
}

export function mockBloklari(
  bank: MockSavol[],
  level: string,
  bookEnabled: boolean,
) {
  const available = bank.filter(
    (q) =>
      q.verified &&
      q.answer !== null &&
      q.level.includes(level) &&
      (q.contentSource !== 'book' || bookEnabled),
  );
  const second = level === 'bachelor' ? 'verbal' : 'research';
  return [
    available.filter((q) => q.tags.includes('iq')),
    available.filter((q) => q.tags.includes(second)),
  ];
}

export function mockBoshlash(
  bank: MockSavol[],
  level: MockHolat['level'],
  bookEnabled: boolean,
  count: number,
  minutes: number,
  now = Date.now(),
  random = Math.random,
): MockHolat {
  const blocks = mockBloklari(bank, level, bookEnabled);
  if (
    ![10, 40].includes(count) ||
    !Number.isFinite(minutes) ||
    minutes <= 0 ||
    blocks.some((block) => block.length < count / 2)
  ) {
    throw new Error('Darajaga mos tasdiqlangan bloklar yetarli emas.');
  }
  const ids = blocks.flatMap((block) => {
    const copy = [...block];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count / 2).map((q) => q.id);
  });
  return {
    version: 1,
    id: crypto.randomUUID(),
    level,
    ids,
    answers: {},
    current: 0,
    deadline: now + minutes * 60000,
    finishedAt: null,
  };
}

export function mockTogrimi(
  value: unknown,
  bank: MockSavol[],
  bookEnabled: boolean,
): value is MockHolat {
  if (!value || typeof value !== 'object') return false;
  const s = value as MockHolat;
  if (
    s.version !== 1 ||
    typeof s.id !== 'string' ||
    !['bachelor', 'master'].includes(s.level) ||
    !Array.isArray(s.ids) ||
    ![10, 40].includes(s.ids.length) ||
    new Set(s.ids).size !== s.ids.length ||
    !s.answers ||
    typeof s.answers !== 'object' ||
    Array.isArray(s.answers) ||
    !Number.isInteger(s.current) ||
    s.current < 0 ||
    s.current >= s.ids.length ||
    !Number.isFinite(s.deadline) ||
    s.deadline <= 0 ||
    !(s.finishedAt === null || Number.isFinite(s.finishedAt)) ||
    !(s.progressApplied === undefined || typeof s.progressApplied === 'boolean')
  )
    return false;
  const blocks = mockBloklari(bank, s.level, bookEnabled);
  if (
    !blocks.every(
      (block) =>
        s.ids.filter((id) => block.some((q) => q.id === id)).length ===
        s.ids.length / 2,
    )
  )
    return false;
  return Object.entries(s.answers).every(
    ([id, answer]) =>
      s.ids.includes(id) &&
      bank
        .find((q) => q.id === id)
        ?.options.some((option) => option.id === answer),
  );
}

export function mockJavob(
  s: MockHolat,
  id: string,
  answer: string,
  now = Date.now(),
): MockHolat {
  if (s.finishedAt !== null || now >= s.deadline || !s.ids.includes(id))
    return s;
  return { ...s, answers: { ...s.answers, [id]: answer } };
}

export function mockYakun(s: MockHolat, now = Date.now()): MockHolat {
  return s.finishedAt === null
    ? { ...s, finishedAt: Math.min(now, s.deadline) }
    : s;
}

export function mockNatija(s: MockHolat, bank: MockSavol[]) {
  const rows = s.ids.map((id) => bank.find((q) => q.id === id)!);
  const correct = rows.filter((q) => q.answer === s.answers[q.id]).length;
  return {
    correct,
    total: rows.length,
    score: (correct / rows.length) * 100,
    unanswered: rows.filter((q) => !s.answers[q.id]).length,
  };
}
