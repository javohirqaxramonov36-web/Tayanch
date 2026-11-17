// Faqat dev: musobaqa sahifasining sun'iy holatlari (?sinov=mehmon|royxat|yaqin|ochiq|ishlayapti|topshirgan|tugagan|kichik).
// Production build'da sahifa bu faylni import.meta.env.DEV ichida dinamik yuklaydi. Laqablar va savollar "Sample":
// haqiqiy foydalanuvchi yoki natija emas. Savollar Tayanch'ning o'zi yozgan oddiy namuna (College Board materiali emas).
import type { ServerSavol } from './sessiya.ts';
import type { Musobaqa, MusobaqaHolat, Natijalar, Royxat, Sharh, YuborJavob } from './musobaqa.ts';

export type SinovTuri = 'mehmon' | 'royxat' | 'yaqin' | 'ochiq' | 'ishlayapti' | 'topshirgan' | 'tugagan' | 'kichik';
const turlar: SinovTuri[] = ['mehmon', 'royxat', 'yaqin', 'ochiq', 'ishlayapti', 'topshirgan', 'tugagan', 'kichik'];
export const sinovTurmi = (s: string | null): s is SinovTuri => turlar.includes(s as SinovTuri);

const savollar: (ServerSavol & { togri: string; izoh: string })[] = [
  { id: 's1', position: 1, section: 'math', domain: 'Algebra', skill: 'Linear equations', format: 'mcq', stem: 'Sample question. If $3x + 2 = 11$, what is the value of $x$?',
    options: [{ key: 'A', text: '$2$' }, { key: 'B', text: '$3$' }, { key: 'C', text: '$4$' }, { key: 'D', text: '$9$' }], togri: 'B', izoh: 'Sample explanation. Subtract 2 from both sides: $3x = 9$, so $x = 3$.' },
  { id: 's2', position: 2, section: 'math', domain: 'Algebra', skill: 'Linear equations', format: 'spr', stem: 'Sample question. What is the value of $y$ if $y - 7 = 5$?',
    options: null, togri: '12', izoh: 'Sample explanation. Add 7 to both sides: $y = 12$.' },
  { id: 's3', position: 3, section: 'rw', domain: 'Craft and Structure', skill: 'Words in context', format: 'mcq',
    passage: 'Sample passage. The gardener was so ______ that she checked every seedling twice before leaving.',
    stem: 'Which choice completes the text with the most logical and precise word?',
    options: [{ key: 'A', text: 'careless' }, { key: 'B', text: 'thorough' }, { key: 'C', text: 'hurried' }, { key: 'D', text: 'distant' }], togri: 'B', izoh: 'Sample explanation. Checking twice shows care, so "thorough" fits.' },
];

const soat = (daqiqa: number) => new Date(Date.now() + daqiqa * 60000).toISOString();

function asos(slug: string, status: Musobaqa['status']): Musobaqa {
  const oyna = { upcoming: [60 * 26, 60 * 29], open: [-30, 150], ended: [-60 * 50, -60 * 47] }[status];
  return {
    slug, title: { upcoming: 'Sample Math Sprint', open: 'Sample Mixed Contest', ended: 'Sample Weekly Contest' }[status],
    description: 'Sample contest for development. Not a real event.',
    starts_at: soat(oyna[0]), ends_at: soat(oyna[1]), duration_min: 20, question_count: savollar.length, status, entry: null,
  };
}

export function sinovApi(t: SinovTuri) {
  const ochiq = asos('sample-open', 'open');
  const yaqin = asos('sample-soon', 'upcoming');
  const tugagan = asos('sample-ended', 'ended');
  const javoblar: Record<string, string> = {};
  let boshlangan: string | null = null;
  let yakun = false;

  if (t === 'ishlayapti' || t === 'topshirgan') {
    boshlangan = soat(-4);
    javoblar.s1 = 'B';
    if (t === 'topshirgan') { javoblar.s2 = '12'; javoblar.s3 = 'A'; yakun = true; }
  }
  const tugaganKirgan = t === 'tugagan' || t === 'kichik';

  const urinish = (m: Musobaqa) => {
    if (m.slug === 'sample-open' && boshlangan) {
      const deadline = new Date(Math.min(Date.parse(boshlangan) + m.duration_min * 60000, Date.parse(m.ends_at))).toISOString();
      return { session_id: 'sinov-sessiya', started_at: boshlangan, deadline, finished: yakun || Date.now() >= Date.parse(deadline), answered: Object.keys(javoblar).length };
    }
    if (m.slug === 'sample-ended' && tugaganKirgan) {
      return { session_id: 'sinov-eski', started_at: m.starts_at, deadline: m.ends_at, finished: true, answered: 3 };
    }
    return null;
  };
  const royxat = (): Musobaqa[] => [ochiq, yaqin, tugagan].map((m) => ({ ...m, entry: t === 'mehmon' ? null : urinish(m) }));
  const topish = (slug: string) => {
    const m = royxat().find((x) => x.slug === slug);
    if (!m) throw new Error('contest_not_found');
    return m;
  };
  const holat = async (slug: string): Promise<MusobaqaHolat> => {
    const m = topish(slug);
    const davom = m.entry && !m.entry.finished;
    return {
      ...m, server_now: new Date().toISOString(),
      questions: davom ? savollar.map(({ togri: _t, izoh: _i, ...q }) => q) : null,
      answers: m.entry ? (slug === 'sample-ended' ? { s1: 'B', s2: '10', s3: 'B' } : { ...javoblar }) : null,
    };
  };

  return {
    royxat: async (): Promise<Royxat> => ({ server_now: new Date().toISOString(), contests: royxat() }),
    holat,
    boshla: async (slug: string) => {
      const m = topish(slug);
      if (m.status === 'upcoming') throw new Error('contest_not_started');
      if (m.status === 'ended') throw new Error('contest_closed');
      if (!boshlangan) boshlangan = new Date().toISOString();
      return holat(slug);
    },
    yubor: async (_sid: string, qid: string, javob: string): Promise<YuborJavob> => {
      if (yakun) throw new Error('session_finished');
      const bor = qid in javoblar;
      if (!bor) javoblar[qid] = javob;
      if (Object.keys(javoblar).length >= savollar.length) yakun = true;
      return { accepted: true, hidden: true, already_answered: bor };
    },
    yakunla: async (slug: string) => { yakun = true; return holat(slug); },
    natija: async (slug: string): Promise<Natijalar> => {
      const m = topish(slug);
      if (m.status !== 'ended') throw new Error('contest_not_ended');
      const kichik = t === 'kichik';
      const rows = Array.from({ length: 12 }, (_, i) => ({
        rank: i < 2 ? 1 : i + 1, nickname: `Sample_${String(i + 1).padStart(2, '0')}`,
        country: i % 4 === 0 ? 'UZ' : null, score: Math.max(0, 3 - Math.floor(i / 4)), time_ms: 240000 + i * 37000, me: false,
      }));
      if (t === 'tugagan') rows[5] = { ...rows[5], nickname: 'Sample_You', me: true };
      return {
        ...m, eligible: !kichik, entered: tugaganKirgan, rows: kichik ? [] : rows, me_row: null,
        me: tugaganKirgan ? { score: 2, time_ms: rows[5].time_ms, answered: 3, rank: kichik ? null : rows[5].rank } : null,
      };
    },
    sharh: async (slug: string): Promise<Sharh> => {
      if (topish(slug).status !== 'ended') throw new Error('contest_not_ended');
      const mening: Record<string, string> = { s1: 'B', s2: '10', s3: 'B' };
      return {
        slug,
        items: savollar.map(({ togri, izoh, ...q }) => ({
          ...q, answer: mening[q.id] ?? null, is_correct: mening[q.id] ? mening[q.id] === togri : null,
          correct: q.format === 'spr' ? [togri] : togri, explanation: izoh,
        })),
      };
    },
  };
}

/** ?sinov=... bilan ?c= berilmasa qaysi musobaqa ochiladi (null = ro'yxat). */
export function sinovSlug(t: SinovTuri): string | null {
  if (t === 'yaqin') return 'sample-soon';
  if (t === 'ochiq' || t === 'ishlayapti' || t === 'topshirgan') return 'sample-open';
  if (t === 'tugagan' || t === 'kichik') return 'sample-ended';
  return null;
}
