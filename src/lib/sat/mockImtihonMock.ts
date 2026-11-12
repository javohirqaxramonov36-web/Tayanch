// FAQAT DEV: mock imtihon sahifalarini bazasiz sinash uchun soxta server (?mock=oddiy|qisqa|tayyor-emas|kvota|xato).
// oddiy: rasmiy vaqt (32 / 35 daqiqa, 10 daqiqa tanaffus); qisqa: modul 90 s, tanaffus 20 s, grace 5 s (to'liq o'tkazish
// sinovi); tayyor-emas: mock_not_ready; kvota: yangi mock krediti tugagan (retake bitta bor); xato: mock_status xatosi.
// Sahifalar buni faqat `import.meta.env.DEV` ichida dinamik import qiladi: prod build'ga kirmaydi.
// "Server" holati localStorage `tayanch:dev-mock-imtihon` da (qayta yuklash va uzilish sinovi uchun).
// Uzilish: localStorage `tayanch:dev-mock-oflayn` = "1" bo'lsa har so'rov TypeError("Failed to fetch") beradi.
// Savollar shu yerda yasalgan oddiy namunalar ("Sample"), College Board materiali emas.
import namunaRasm from '../../assets/sat/namuna-uchburchak.svg?url';
import { savolTaksonomiya } from '../../data/satTaksonomiya.ts';
import {
  bolimBall, type MockApi, type MockHolat, type MockNatija, type MockNatijaSavol, type MockStatus, type MockSozlama, type SaqlashBand,
} from './mock.ts';
import type { SavolBolimi } from './savolTuri.ts';

export type MockTur = 'oddiy' | 'qisqa' | 'tayyor-emas' | 'kvota' | 'xato';

const SERVER = 'tayanch:dev-mock-imtihon';
const OFLAYN = 'tayanch:dev-mock-oflayn';

interface Gen {
  id: string; section: SavolBolimi; domain: string; skill: string; difficulty: number; format: 'mcq' | 'spr';
  passage: string | null; stem: string; options: { key: string; text: string }[] | null; togri: string; izoh: string;
  figure: { path: string; alt: string; caption: string | null } | null;
}
interface Urinish {
  id: string; form_id: string; kind: 'first' | 'retake'; status: 'active' | 'finished' | 'abandoned';
  phase: 'ready' | 'module' | 'break' | 'done'; current_module: number; started_at: string; finished_at: string | null;
  break_started_at: string | null; scores: MockHolat['scores'];
  modules: Record<number, { started_at: string; deadline_at: string; submitted_at: string | null; auto: boolean }>;
  answers: Record<string, { answer: string | null; flagged: boolean; time_ms: number }>;
  graded: Record<string, boolean>;
}
interface Forma { form_no: number; savollar: { module: number; id: string }[] }
interface Holat { formalar: Record<string, Forma>; urinishlar: Record<string, Urinish>; review: Record<string, string | null>; sarf: { first: number; retake: number } }

const BLUEPRINT: [SavolBolimi, string, number][] = [
  ['rw', 'Craft and Structure', 8], ['rw', 'Information and Ideas', 7], ['rw', 'Standard English Conventions', 7], ['rw', 'Expression of Ideas', 5],
  ['math', 'Algebra', 8], ['math', 'Advanced Math', 8], ['math', 'Problem-Solving and Data Analysis', 3], ['math', 'Geometry and Trigonometry', 3],
];

const kut = (ms: number) => new Promise((r) => setTimeout(r, ms));
const oqi = (): Holat => {
  try { return JSON.parse(localStorage.getItem(SERVER) ?? '') as Holat; } catch { return { formalar: {}, urinishlar: {}, review: {}, sarf: { first: 0, retake: 0 } }; }
};
const yoz = (h: Holat) => localStorage.setItem(SERVER, JSON.stringify(h));
const xato = (message: string, code = 'P0001') => Object.assign(new Error(message), { code });
function tarmoq() {
  if (localStorage.getItem(OFLAYN) === '1') throw new TypeError('Failed to fetch');
}
export function mockTozala() {
  localStorage.removeItem(SERVER);
  for (const k of Object.keys(localStorage)) if (k.startsWith('tayanch:sat-mock:v1:')) localStorage.removeItem(k);
}

/** Har ko'nikmaga 8 ta oddiy namuna savol (bazadagi tayyorlik qoidasi kabi). */
function bank(): Gen[] {
  const r: Gen[] = [];
  let n = 0;
  for (const [section, domenlar] of Object.entries(savolTaksonomiya) as [SavolBolimi, Record<string, readonly string[]>][]) {
    for (const [domain, skills] of Object.entries(domenlar)) {
      for (const skill of skills) {
        for (let i = 0; i < 8; i++) {
          n++;
          const keys = ['A', 'B', 'C', 'D'];
          const togriKey = keys[n % 4];
          if (section === 'rw') {
            r.push({
              id: `mk-${n}`, section, domain, skill, difficulty: 1 + (i % 5), format: 'mcq',
              passage: `<p>Sample passage ${n}. A small team in a city library counted how many visitors used the reading room each morning and wrote the totals in a notebook.</p>`,
              stem: `Sample question for ${skill}: which choice is marked as correct in this sample?`,
              options: keys.map((k) => ({ key: k, text: k === togriKey ? `Choice ${k} (the sample answer)` : `Choice ${k}` })),
              togri: togriKey, izoh: `Sample explanation: choice ${togriKey} is the sample answer.`, figure: null,
            });
          } else {
            const a = 2 + (n % 5), x = 3 + (n % 7), b = 1 + (n % 9), c = a * x + b;
            const spr = n % 4 === 0;
            const qiymat = [x - 1, x, x + 1, x + 2];
            const tk = keys[qiymat.indexOf(x)];
            r.push({
              id: `mk-${n}`, section, domain, skill, difficulty: 1 + (i % 5), format: spr ? 'spr' : 'mcq', passage: null,
              stem: `Sample: if $${a}x + ${b} = ${c}$, what is the value of $x$?`,
              options: spr ? null : keys.map((k, j) => ({ key: k, text: String(qiymat[j]) })),
              togri: spr ? String(x) : tk, izoh: `Subtract ${b} from both sides: $${a}x = ${c - b}$. Divide by ${a}: $x = ${x}$.`,
              figure: skill === 'Lines, angles, and triangles' && i === 0 ? { path: 'mock/figure.svg', alt: 'A sample triangle.', caption: 'Sample figure' } : null,
            });
          }
        }
      }
    }
  }
  return r;
}

export function mockApi(tur: MockTur): MockApi {
  const sozlama: MockSozlama = tur === 'qisqa'
    ? { rw_module_ms: 90_000, math_module_ms: 90_000, break_ms: 20_000, grace_ms: 5_000 }
    : { rw_module_ms: 1_920_000, math_module_ms: 2_100_000, break_ms: 600_000, grace_ms: 30_000 };
  const savollar = bank();
  const qMap = new Map(savollar.map((q) => [q.id, q]));
  const modulMs = (m: number) => (m <= 2 ? sozlama.rw_module_ms : sozlama.math_module_ms);
  const kredit = (used: number, max: number | null) => ({ max, per: 'month', used, resets_at: '2026-12-01T00:00:00+05:00' });

  async function tayyor<T>(f: (h: Holat) => T, kechikish = 150): Promise<T> {
    await kut(kechikish);
    tarmoq();
    const h = oqi();
    for (const u of Object.values(h.urinishlar)) tick(h, u);
    const r = f(h);
    yoz(h);
    return structuredClone(r);
  }

  function formaYasa(h: Holat): string {
    const id = crypto.randomUUID();
    const korilgan = new Set(Object.values(h.formalar).flatMap((f) => f.savollar.map((s) => s.id)));
    const tanlov: { module: number; id: string; key: number }[] = [];
    BLUEPRINT.forEach(([section, domain, soni], ord) => {
      const pool = savollar.filter((q) => q.section === section && q.domain === domain)
        .sort((a, b) => Number(korilgan.has(a.id)) - Number(korilgan.has(b.id)) || Math.random() - 0.5)
        .slice(0, soni * 2).sort((a, b) => a.difficulty - b.difficulty);
      pool.forEach((q, i) => tanlov.push({ module: (section === 'rw' ? 1 : 3) + (i % 2), id: q.id, key: (section === 'rw' ? ord * 10 : 0) + q.difficulty + Math.random() * 0.5 }));
    });
    tanlov.sort((a, b) => a.module - b.module || a.key - b.key);
    h.formalar[id] = { form_no: Object.keys(h.formalar).length + 1, savollar: tanlov.map(({ module, id: qid }) => ({ module, id: qid })) };
    return id;
  }

  const formaSavollari = (h: Holat, u: Urinish, m: number) => h.formalar[u.form_id].savollar.filter((s) => s.module === m);

  function yop(h: Holat, u: Urinish, auto: boolean) {
    if (u.status !== 'active' || u.phase !== 'module') return;
    const mod = u.modules[u.current_module];
    const tugash = auto ? mod.deadline_at : new Date().toISOString();
    for (const s of formaSavollari(h, u, u.current_module)) {
      const a = u.answers[s.id];
      if (!a?.answer) continue;
      const q = qMap.get(s.id)!;
      const togri = q.format === 'spr' ? Number(a.answer) === Number(q.togri) : a.answer.toUpperCase() === q.togri;
      u.graded[s.id] = togri;
      if (!togri) h.review[s.id] = h.review[s.id] ?? null;
    }
    mod.submitted_at = tugash; mod.auto = auto;
    if (u.current_module === 4) {
      const hisob = (b: SavolBolimi) => {
        const qs = h.formalar[u.form_id].savollar.filter((s) => qMap.get(s.id)!.section === b);
        const c = qs.filter((s) => u.graded[s.id]).length;
        return { correct: c, total: qs.length, score: bolimBall(c, qs.length) };
      };
      const rw = hisob('rw'), math = hisob('math');
      Object.assign(u, { status: 'finished', phase: 'done', finished_at: tugash, scores: { estimate: true, rw, math, total: rw.score + math.score } });
    } else if (u.current_module === 2) {
      Object.assign(u, { phase: 'break', current_module: 3, break_started_at: tugash });
    } else {
      Object.assign(u, { phase: 'ready', current_module: u.current_module + 1 });
    }
  }

  function tick(h: Holat, u: Urinish) {
    if (u.status === 'active' && u.phase === 'module') {
      const mod = u.modules[u.current_module];
      if (Date.now() > Date.parse(mod.deadline_at) + sozlama.grace_ms) yop(h, u, true);
    }
  }

  const savolChiqar = (q: Gen, position: number) => ({
    id: q.id, position, section: q.section, format: q.format, passage: q.passage, stem: q.stem, options: q.options, figure: q.figure,
  });

  function payload(h: Holat, u: Urinish): MockHolat {
    const f = h.formalar[u.form_id];
    const modulda = u.phase === 'module' ? formaSavollari(h, u, u.current_module) : [];
    return {
      attempt_id: u.id, form_id: u.form_id, form_no: f.form_no, kind: u.kind, status: u.status, phase: u.phase,
      current_module: u.current_module, started_at: u.started_at, finished_at: u.finished_at, break_started_at: u.break_started_at,
      server_now: new Date().toISOString(), config: sozlama, scores: u.scores,
      modules: [1, 2, 3, 4].map((m) => ({
        module: m, section: m <= 2 ? 'rw' : 'math', question_count: f.savollar.filter((s) => s.module === m).length, time_ms: modulMs(m),
        started_at: u.modules[m]?.started_at ?? null, deadline_at: u.modules[m]?.deadline_at ?? null,
        submitted_at: u.modules[m]?.submitted_at ?? null, auto_submitted: u.modules[m]?.auto ?? false,
      })),
      questions: modulda.map((s, i) => savolChiqar(qMap.get(s.id)!, i + 1)),
      answers: modulda.filter((s) => u.answers[s.id]).map((s) => ({ question_id: s.id, ...u.answers[s.id] })),
    };
  }

  const ol = (h: Holat, id: string) => {
    const u = h.urinishlar[id];
    if (!u) throw xato('mock_not_found', 'P0002');
    return u;
  };

  return {
    status: () => tayyor((h): MockStatus => {
      if (tur === 'xato') throw xato('internal error', 'XX000');
      const aktiv = Object.values(h.urinishlar).find((u) => u.status === 'active');
      return {
        ready: tur !== 'tayyor-emas',
        active: aktiv ? { attempt_id: aktiv.id, form_no: h.formalar[aktiv.form_id].form_no, kind: aktiv.kind, phase: aktiv.phase, current_module: aktiv.current_module, started_at: aktiv.started_at } : null,
        history: Object.values(h.urinishlar).filter((u) => u.status !== 'active').sort((a, b) => b.started_at.localeCompare(a.started_at))
          .map((u) => ({ attempt_id: u.id, form_id: u.form_id, form_no: h.formalar[u.form_id].form_no, kind: u.kind, status: u.status, started_at: u.started_at, finished_at: u.finished_at, scores: u.scores })),
        credits: {
          mock_first: tur === 'kvota' ? kredit(1 + h.sarf.first, 1) : kredit(h.sarf.first, null),
          mock_retake: tur === 'kvota' ? kredit(h.sarf.retake, 1) : kredit(h.sarf.retake, null),
        },
        plan: { code: 'free', name: 'Free' },
      };
    }),
    boshla: (formId) => tayyor((h) => {
      if (Object.values(h.urinishlar).some((u) => u.status === 'active')) throw xato('mock_in_progress', '55000');
      let fid: string;
      if (!formId) {
        if (tur === 'tayyor-emas') throw xato('mock_not_ready', '55000');
        if (tur === 'kvota') throw xato('quota_exceeded');
        fid = formaYasa(h);
        h.sarf.first++;
      } else {
        if (!h.formalar[formId]) throw xato('mock_not_found', 'P0002');
        if (tur === 'kvota' && h.sarf.retake >= 1) throw xato('quota_exceeded');
        fid = formId;
        h.sarf.retake++;
      }
      const u: Urinish = {
        id: crypto.randomUUID(), form_id: fid, kind: formId ? 'retake' : 'first', status: 'active', phase: 'ready', current_module: 1,
        started_at: new Date().toISOString(), finished_at: null, break_started_at: null, scores: null, modules: {}, answers: {}, graded: {},
      };
      h.urinishlar[u.id] = u;
      return payload(h, u);
    }, 400),
    ol: (id) => tayyor((h) => payload(h, ol(h, id))),
    modulBoshla: (id) => tayyor((h) => {
      const u = ol(h, id);
      if (u.status === 'active' && (u.phase === 'ready' || u.phase === 'break')) {
        const now = Date.now();
        u.modules[u.current_module] ??= { started_at: new Date(now).toISOString(), deadline_at: new Date(now + modulMs(u.current_module)).toISOString(), submitted_at: null, auto: false };
        u.phase = 'module';
      }
      return payload(h, u);
    }),
    saqla: (id, bandlar: SaqlashBand[]) => tayyor((h) => {
      const u = ol(h, id);
      if (u.status !== 'active' || u.phase !== 'module') return { saved: 0, module_closed: true, server_now: new Date().toISOString() };
      const ruxsat = new Set(formaSavollari(h, u, u.current_module).map((s) => s.id));
      let n = 0;
      for (const b of bandlar) {
        if (!ruxsat.has(b.question_id)) continue;
        const eski = u.answers[b.question_id];
        u.answers[b.question_id] = { answer: b.answer?.trim() || null, flagged: b.flagged, time_ms: Math.max(eski?.time_ms ?? 0, Math.min(b.time_ms, modulMs(u.current_module))) };
        n++;
      }
      return { saved: n, server_now: new Date().toISOString() };
    }, 120),
    topshir: (id, modul) => tayyor((h) => {
      const u = ol(h, id);
      if (u.current_module === modul) yop(h, u, false);
      return payload(h, u);
    }, 300),
    toxtat: (id) => tayyor((h) => {
      const u = ol(h, id);
      if (u.status === 'active') {
        if (u.phase === 'module') yop(h, u, false);
        Object.assign(u, { status: 'abandoned', phase: 'done', finished_at: u.finished_at ?? new Date().toISOString(), scores: null });
      }
      return payload(h, u);
    }),
    natija: (id) => tayyor((h): MockNatija => {
      const u = ol(h, id);
      if (u.status !== 'finished') throw xato('mock_not_finished', '55000');
      const f = h.formalar[u.form_id];
      const pos: Record<number, number> = {};
      const questions: MockNatijaSavol[] = f.savollar.map((s) => {
        const q = qMap.get(s.id)!;
        pos[s.module] = (pos[s.module] ?? 0) + 1;
        const a = u.answers[s.id];
        return {
          ...savolChiqar(q, pos[s.module]), module: s.module, domain: q.domain, skill: q.skill, difficulty: q.difficulty,
          answer: a?.answer ?? null, answered: !!a?.answer, is_correct: !!u.graded[s.id], flagged: !!a?.flagged,
          time_ms: a?.answer ? a.time_ms : null, correct: q.format === 'spr' ? [q.togri] : q.togri, explanation: q.izoh,
          in_review: s.id in h.review, reason_tag: h.review[s.id] ?? null,
        };
      });
      return { ...payload(h, u), questions };
    }),
    navbatgaQosh: async (qid) => { await tayyor((h) => { h.review[qid] = h.review[qid] ?? null; }, 120); },
    sabab: async (qid, tag) => { await tayyor((h) => { if (qid in h.review) h.review[qid] = tag; }, 120); },
    rasm: async () => namunaRasm,
  };
}
