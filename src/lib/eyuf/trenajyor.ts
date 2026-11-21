export interface JavobYozuvi {
  id: string;
  type: string;
  correct: boolean;
  at: number;
}
export interface IqProgress {
  version: 1;
  history: JavobYozuvi[];
  reviews: Record<string, { step: number; due: number }>;
  days: string[];
  daily: Record<string, string[]>;
}
export const boshProgress = (): IqProgress => ({
  version: 1,
  history: [],
  reviews: {},
  days: [],
  daily: {},
});
export function progressTogrimi(v: unknown): v is IqProgress {
  if (!v || typeof v !== 'object') return false;
  const p = v as IqProgress;
  return (
    p.version === 1 &&
    Array.isArray(p.history) &&
    p.history.every(
      (x) =>
        x &&
        typeof x.id === 'string' &&
        typeof x.type === 'string' &&
        typeof x.correct === 'boolean' &&
        Number.isFinite(x.at),
    ) &&
    p.reviews !== null &&
    typeof p.reviews === 'object' &&
    !Array.isArray(p.reviews) &&
    Object.values(p.reviews).every(
      (x) =>
        x &&
        Number.isInteger(x.step) &&
        x.step >= 0 &&
        x.step <= 2 &&
        Number.isFinite(x.due),
    ) &&
    Array.isArray(p.days) &&
    p.days.every((x) => typeof x === 'string') &&
    p.daily !== null &&
    typeof p.daily === 'object' &&
    !Array.isArray(p.daily) &&
    Object.values(p.daily).every(
      (x) => Array.isArray(x) && x.every((id) => typeof id === 'string'),
    )
  );
}
export const toshkentKuni = (at = Date.now()) =>
  new Date(at).toLocaleDateString('en-CA', { timeZone: 'Asia/Tashkent' });
export function javobniYoz(
  p: IqProgress,
  id: string,
  type: string,
  correct: boolean,
  at = Date.now(),
): IqProgress {
  const next = structuredClone(p);
  next.history.push({ id, type, correct, at });
  next.history = next.history.slice(-2000);
  const old = next.reviews[id];
  if (!correct) next.reviews[id] = { step: 0, due: at + 86400000 };
  else if (old) {
    if (old.step === 2) delete next.reviews[id];
    else {
      const step = old.step + 1;
      next.reviews[id] = { step, due: at + [1, 3, 7][step] * 86400000 };
    }
  }
  return next;
}
export function mahorat(p: IqProgress, type: string) {
  const h = p.history.filter((x) => x.type === type).slice(-20);
  return {
    count: h.length,
    percent: h.length
      ? Math.round((h.filter((x) => x.correct).length / h.length) * 100)
      : 0,
  };
}
export function streak(p: IqProgress, at = Date.now()) {
  const set = new Set(p.days);
  const today = toshkentKuni(at);
  let time = Date.parse(today + 'T12:00:00+05:00');
  if (!set.has(today)) time -= 86400000;
  let n = 0;
  while (set.has(toshkentKuni(time))) {
    n++;
    time -= 86400000;
  }
  return n;
}
export function badges(p: IqProgress) {
  return [
    { name: 'Kub ustasi', type: 'kub-yoyilmasi' },
    { name: 'Ketma-ketlik ovchisi', type: 'son-ketma-ketligi' },
  ].map((b) => ({
    ...b,
    count: new Set(
      p.history.filter((x) => x.type === b.type && x.correct).map((x) => x.id),
    ).size,
  }));
}

/** Parallel tablarning yangi baholangan javoblarini birlashtiradi. */
export function progressniBirlashtir(
  local: IqProgress,
  remote: IqProgress,
): IqProgress {
  const events = new Map<string, JavobYozuvi>();
  for (const event of [...remote.history, ...local.history]) {
    events.set(`${event.id}:${event.at}:${event.correct}`, event);
  }
  const history = [...events.values()].sort((a, b) => a.at - b.at).slice(-2000);
  const reviews = { ...remote.reviews };
  const latest = (state: IqProgress, id: string) =>
    state.history.filter((event) => event.id === id).at(-1)?.at ?? -1;
  const ids = new Set([
    ...local.history.map((event) => event.id),
    ...Object.keys(local.reviews),
  ]);
  for (const id of ids) {
    if (latest(local, id) < latest(remote, id)) continue;
    if (local.reviews[id]) reviews[id] = local.reviews[id];
    else delete reviews[id];
  }
  return {
    version: 1,
    history,
    reviews,
    days: [...new Set([...remote.days, ...local.days])],
    daily: { ...remote.daily, ...local.daily },
  };
}
