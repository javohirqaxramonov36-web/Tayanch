// FAQAT DEV: sessiya sahifasini bazasiz sinash uchun soxta server (?mock=oddiy|taymerli|qisqa|uzilish|kvota|xato|mini).
// oddiy: 10 savol, taymersiz; taymerli: 10 savol (Math 95,5 s/savol); qisqa: taymerli, 70 s; kvota: 3 javobdan keyin
// quota_exceeded; xato: get_session server xatosi; boshqa id: session_not_found.
// Sahifa buni faqat `import.meta.env.DEV` ichida dinamik import qiladi: prod build'ga kirmaydi (dist'da tekshiriladi).
// "Server" holati localStorage `tayanch:dev-sessiya-mock` da: qayta yuklash va ikki tab sinovi uchun umumiy.
// Uzilish: localStorage `tayanch:dev-sessiya-oflayn` = "1" bo'lsa har so'rov TypeError("Failed to fetch") beradi.
// Savollar: 4 tasi src/data/satSavolNamuna.ts dan (Sample), 6 tasi shu yerda yasalgan oddiy namuna tenglamalar.
import { namunaSavollar } from '../../data/satSavolNamuna.ts';
import namunaRasm from '../../assets/sat/namuna-uchburchak.svg?url';
import type { SessiyaApi, ServerSavol, SessiyaRejimi } from './sessiya.ts';

export type MockTur = 'oddiy' | 'taymerli' | 'qisqa' | 'uzilish' | 'kvota' | 'xato' | 'mini';

const SERVER = 'tayanch:dev-sessiya-mock';
const OFLAYN = 'tayanch:dev-sessiya-oflayn';
export const MOCK_ID: Record<MockTur, string> = {
  oddiy: '00000000-0000-4000-8000-000000000001',
  taymerli: '00000000-0000-4000-8000-000000000002',
  qisqa: '00000000-0000-4000-8000-000000000003',
  uzilish: '00000000-0000-4000-8000-000000000004',
  kvota: '00000000-0000-4000-8000-000000000005',
  xato: '00000000-0000-4000-8000-000000000006',
  mini: '00000000-0000-4000-8000-000000000007',
};

interface Yozuv {
  mode: SessiyaRejimi;
  started_at: string;
  finished_at: string | null;
  limit: number | null;
  attempts: Record<string, { answer: string; is_correct: boolean; time_ms: number; at: number }>;
}
interface Holat { sessiyalar: Record<string, Yozuv>; review: Record<string, string | null>; saqlangan?: string[] }

const kut = (ms: number) => new Promise((r) => setTimeout(r, ms));
const oqi = (): Holat => {
  try { return JSON.parse(localStorage.getItem(SERVER) ?? '') as Holat; } catch { return { sessiyalar: {}, review: {} }; }
};
const yoz = (h: Holat) => localStorage.setItem(SERVER, JSON.stringify(h));

function tarmoq() {
  if (localStorage.getItem(OFLAYN) === '1') throw new TypeError('Failed to fetch');
}

interface MockSavol { q: ServerSavol; togri: string[]; izoh: string }

function savollar(): MockSavol[] {
  const skillRw = ['Text Structure and Purpose', 'Words in Context'];
  const skillMath = ['Linear equations in one variable', 'Area and volume'];
  const r: MockSavol[] = namunaSavollar.map((n, i) => ({
    q: {
      id: `mock-${i + 1}`, position: i + 1, section: n.savol.section, format: n.savol.format,
      domain: n.savol.section === 'rw' ? 'Craft and Structure' : 'Algebra',
      skill: n.savol.section === 'rw' ? skillRw[i % 2] : skillMath[i % 2],
      passage: n.savol.passage ?? null, stem: n.savol.stem, options: n.savol.options ?? null,
      figure: n.savol.figure ? { path: 'mock/figure.svg', alt: n.savol.figure.alt, caption: n.savol.figure.caption ?? null } : null,
    },
    togri: n.togri,
    izoh: n.izoh ?? 'Sample explanation.',
  }));
  for (let k = 0; k < 6; k++) {
    const a = k + 2, x = k + 3, b = 2 * k + 1, c = a * x + b;
    const spr = k % 3 === 2;
    const keys = ['A', 'B', 'C', 'D'];
    const qiymatlar = [x - 1, x, x + 1, x + 2];
    r.push({
      q: {
        id: `mock-${r.length + 1}`, position: r.length + 1, section: 'math', format: spr ? 'spr' : 'mcq',
        domain: 'Algebra', skill: 'Linear equations in one variable',
        stem: `Sample: if $${a}x + ${b} = ${c}$, what is the value of $x$?`,
        options: spr ? null : keys.map((key, j) => ({ key, text: String(qiymatlar[j]) })),
      },
      togri: spr ? [String(x)] : ['B'],
      izoh: `Subtract ${b} from both sides: $${a}x = ${c - b}$. Divide by ${a}: $x = ${x}$.`,
    });
  }
  return r;
}

export function mockApi(tur: MockTur): SessiyaApi {
  const hammasi = savollar();
  const topSavol = (qid: string) => hammasi.find((s) => s.q.id === qid);
  const yangi = (): Yozuv => ({
    mode: tur === 'mini' ? 'mini_test' : tur === 'taymerli' || tur === 'qisqa' ? 'timed' : 'practice',
    started_at: new Date().toISOString(),
    finished_at: null,
    limit: tur === 'taymerli' ? 10 * 95_455 : tur === 'qisqa' ? 70_000 : null,
    attempts: {},
  });
  const sessiya = (id: string): Yozuv => {
    if (tur === 'xato') throw { message: 'mock: server error', code: 'XX000' };
    if (id !== MOCK_ID[tur]) throw { message: 'session_not_found', code: 'P0002' };
    const h = oqi();
    h.sessiyalar ??= {};
    h.review ??= {};
    if (!h.sessiyalar[id]) { h.sessiyalar[id] = yangi(); yoz(h); }
    return h.sessiyalar[id];
  };
  const saqla = (id: string, y: Yozuv) => { const h = oqi(); h.sessiyalar[id] = y; yoz(h); };
  const togrimi = (s: MockSavol, javob: string) => s.togri.some((t) => t.toLowerCase() === javob.trim().toLowerCase());

  return {
    async ol(id) {
      await kut(400);
      tarmoq();
      const y = sessiya(id);
      const h = oqi();
      const passed = Object.values(y.attempts).filter((a) => a.is_correct).length * 10 >= hammasi.length * 7;
      const mini = y.mode === 'mini_test' && y.finished_at;
      return {
        session_id: id, mode: y.mode, started_at: y.started_at, finished_at: y.finished_at,
        server_now: new Date().toISOString(), time_limit_ms: y.limit,
        questions: hammasi.map((s) => ({ ...s.q, answered: !!y.attempts[s.q.id], bookmarked: (h.saqlangan ?? []).includes(s.q.id) })),
        results: Object.entries(y.attempts).sort((a, b) => a[1].at - b[1].at).map(([qid, a]) => {
          const s = topSavol(qid)!;
          return { question_id: qid, answer: a.answer, is_correct: a.is_correct, correct: s.q.format === 'mcq' ? s.togri[0] : s.togri, explanation: s.izoh, time_ms: a.time_ms };
        }),
        review: Object.entries(h.review ?? {}).filter(([qid]) => topSavol(qid)).map(([question_id, reason_tag]) => ({ question_id, reason_tag })),
        ...(y.mode === 'mini_test' ? {
          course: { v: 1, set_id: 'sample', topic_id: 'Sample', stage: 'mini_test' },
        } : {}),
        ...(mini ? {
          elapsed_ms: Date.parse(mini) - Date.parse(y.started_at), passed, topic_passed: passed,
          skipped_solutions: hammasi.filter(({ q }) => !y.attempts[q.id]).map(({ q, togri, izoh }) => ({
            question_id: q.id, correct: q.format === 'mcq' ? togri[0] : togri, explanation: izoh,
          })),
        } : {}),
      };
    },
    async yubor(id, qid, javob, timeMs) {
      await kut(600);
      tarmoq();
      const y = sessiya(id);
      if (y.mode === 'mini_test') throw { message: 'mini_test_requires_batch' };
      const s = topSavol(qid);
      if (!s) throw { message: 'question_not_in_session' };
      const correct = s.q.format === 'mcq' ? s.togri[0] : s.togri;
      const bor = y.attempts[qid];
      if (bor) return { is_correct: bor.is_correct, correct, explanation: s.izoh, already_answered: true };
      if (y.finished_at) throw { message: 'session_finished', code: '55000' };
      if (tur === 'kvota' && Object.keys(y.attempts).length >= 3) throw { message: 'quota_exceeded', code: 'P0001' };
      const ok = togrimi(s, javob);
      y.attempts[qid] = { answer: javob, is_correct: ok, time_ms: timeMs, at: Date.now() };
      if (Object.keys(y.attempts).length >= hammasi.length) y.finished_at = new Date().toISOString();
      saqla(id, y);
      if (!ok) { const h = oqi(); h.review[qid] = h.review[qid] ?? null; yoz(h); }
      return { is_correct: ok, correct, explanation: s.izoh, already_answered: false };
    },
    async yakunla(id) {
      await kut(400);
      tarmoq();
      const y = sessiya(id);
      y.finished_at ??= new Date().toISOString();
      saqla(id, y);
      return { finished_at: y.finished_at };
    },
    async miniTestniYakunla(id, javoblar) {
      await kut(400);
      tarmoq();
      const y = sessiya(id);
      if (!y.finished_at) {
        const h = oqi();
        for (const { question_id, answer, time_ms } of javoblar) {
          const s = topSavol(question_id)!;
          const is_correct = togrimi(s, answer);
          y.attempts[question_id] = { answer, is_correct, time_ms: time_ms ?? 0, at: Date.now() };
          if (!is_correct) h.review[question_id] ??= null;
        }
        y.finished_at = new Date().toISOString();
        h.sessiyalar[id] = y;
        yoz(h);
      }
      return this.ol(id);
    },
    async navbatgaQosh(qid) {
      await kut(300); tarmoq();
      const h = oqi(); h.review[qid] = h.review[qid] ?? null; yoz(h);
    },
    async navbatdanOl(qid) {
      await kut(300); tarmoq();
      const h = oqi(); delete h.review[qid]; yoz(h);
    },
    async sabab(qid, tag) {
      await kut(300); tarmoq();
      const h = oqi(); if (qid in h.review) h.review[qid] = tag; yoz(h);
    },
    async saqla(qid, on) {
      await kut(300); tarmoq();
      const h = oqi(); const b = new Set(h.saqlangan ?? []);
      if (on) b.add(qid); else b.delete(qid);
      h.saqlangan = [...b]; yoz(h);
    },
    async rasm() {
      return namunaRasm;
    },
  };
}

/** Dev: mock "serveri"ni tozalaydi (?mock=...&tozala=1). */
export function mockTozala() {
  localStorage.removeItem(SERVER);
  localStorage.removeItem(OFLAYN);
  for (const id of Object.values(MOCK_ID)) localStorage.removeItem(`tayanch:sat-sessiya:v1:${id}`);
}
