// Mock imtihon (P30, /uz/sat/mashq/mock/): sof mantiq (DOM, tarmoq, Supabase yo'q).
// Server: supabase/migrations/20261113012418_mock_imtihon.sql. Sinov: src/lib/testlar/mock.test.ts.
//
// Qoidalar:
//   - Holat (bosqich, modul vaqti, qoralama javoblar) serverda. Brauzerda faqat yuborilmagan javoblar navbati,
//     joriy savol va cross out belgilari: kalit tayanch:sat-mock:v1:<attempt_id>. URL da javob yo'q.
//   - Modul vaqti serverdagi deadline_at dan (qayta yuklash va uzilish taymerni boshidan boshlamaydi).
//   - Ball "taxminiy": 200 + 600 × to'g'ri / jami, 10 ga yaxlitlangan (server bilan bir xil formula). Rasmiy ball emas.

import type { SavolBolimi, SavolFormati } from './savolTuri';

export type MockBosqich = 'ready' | 'module' | 'break' | 'done';
export type MockHolatTuri = 'active' | 'finished' | 'abandoned';
export type MockTuri = 'first' | 'retake';

export interface MockModul {
  module: number;
  section: SavolBolimi;
  question_count: number;
  time_ms: number;
  started_at: string | null;
  deadline_at: string | null;
  submitted_at: string | null;
  auto_submitted: boolean;
}

/** Modul davomidagi savol (javobsiz, ko'nikmasiz). */
export interface MockSavol {
  id: string;
  position: number;
  section: SavolBolimi;
  format: SavolFormati;
  passage?: string | null;
  stem: string;
  options?: { key: string; text: string }[] | null;
  figure?: { path: string; alt: string; caption?: string | null } | null;
}

export interface MockJavob {
  question_id: string;
  answer: string | null;
  flagged: boolean;
  time_ms: number;
}

export interface BolimBall { correct: number; total: number; score: number }
export interface MockBall { estimate: true; rw: BolimBall; math: BolimBall; total: number }

export interface MockSozlama { rw_module_ms: number; math_module_ms: number; break_ms: number; grace_ms: number }

export interface MockHolat {
  attempt_id: string;
  form_id: string;
  form_no: number;
  kind: MockTuri;
  status: MockHolatTuri;
  phase: MockBosqich;
  current_module: number;
  started_at: string;
  finished_at: string | null;
  break_started_at: string | null;
  server_now: string;
  config: MockSozlama;
  scores: MockBall | null;
  modules: MockModul[];
  questions: MockSavol[];
  answers: MockJavob[];
}

export interface MockNatijaSavol extends MockSavol {
  module: number;
  domain: string;
  skill: string;
  difficulty: number;
  answer: string | null;
  answered: boolean;
  is_correct: boolean;
  flagged: boolean;
  time_ms: number | null;
  correct: string | string[] | null;
  explanation: string | null;
  in_review: boolean;
  reason_tag: string | null;
}

export interface MockNatija extends Omit<MockHolat, 'questions'> {
  questions: MockNatijaSavol[];
}

export interface MockKredit { max: number | null; per: string; used: number; resets_at: string }

export interface MockTarixBand {
  attempt_id: string;
  form_id: string;
  form_no: number;
  kind: MockTuri;
  status: MockHolatTuri;
  started_at: string;
  finished_at: string | null;
  scores: MockBall | null;
}

export interface MockStatus {
  ready: boolean;
  active: { attempt_id: string; form_no: number; kind: MockTuri; phase: MockBosqich; current_module: number; started_at: string } | null;
  history: MockTarixBand[];
  credits: { mock_first: MockKredit; mock_retake: MockKredit };
  plan: { code: string; name: string };
}

export interface SaqlashBand { question_id: string; answer: string | null; flagged: boolean; time_ms: number }

/** Sahifalar ishlatadigan server amallari (haqiqiy: Supabase RPC; dev: mockImtihonMock.ts). */
export interface MockApi {
  status(): Promise<MockStatus>;
  boshla(formId: string | null): Promise<MockHolat>;
  ol(id: string): Promise<MockHolat>;
  modulBoshla(id: string): Promise<MockHolat>;
  saqla(id: string, bandlar: SaqlashBand[]): Promise<{ saved: number; module_closed?: boolean; server_now: string }>;
  topshir(id: string, modul: number): Promise<MockHolat>;
  toxtat(id: string): Promise<MockHolat>;
  natija(id: string): Promise<MockNatija>;
  navbatgaQosh(qid: string): Promise<void>;
  sabab(qid: string, tag: string | null): Promise<void>;
  rasm(path: string): Promise<string | null>;
}

// ---------- Matnlar ----------

export const BOLIM_NOMI: Record<SavolBolimi, string> = { rw: 'Reading and Writing', math: 'Math' };

/** 1 → "Reading and Writing · Module 1", 3 → "Math · Module 1" */
export function modulNomi(modul: number): string {
  return `${BOLIM_NOMI[modul <= 2 ? 'rw' : 'math']} · Module ${modul <= 2 ? modul : modul - 2}`;
}

export const SINOV_YOZUVI = 'Estimated score. This is not an official SAT score.';

// ---------- Ball ----------

/** Taxminiy bo'lim balli: 200 + 600 × to'g'ri / jami, 10 ga yaxlitlangan (server private.mock_section_score bilan bir xil). */
export function bolimBall(togri: number, jami: number): number {
  if (!(jami > 0)) return 200;
  const t = Math.min(Math.max(togri, 0), jami);
  return 200 + Math.round((60 * t) / jami) * 10;
}

// ---------- Vaqt ----------

/** Serverdagi tugash vaqtigacha qolgan ms. Soat farqi: serverNow va javob kelgan paytdagi mijoz vaqti. */
export function qolganMs(tugash: string | null, serverNow: string, soatOlingan: number, hozir: number): number {
  if (!tugash) return 0;
  const farq = Date.parse(serverNow) - soatOlingan;
  return Math.max(0, Math.round(Date.parse(tugash) - (hozir + farq)));
}

/** Tanaffus tugash vaqti (ISO) yoki null. */
export function tanaffusTugashi(h: Pick<MockHolat, 'break_started_at' | 'config'>): string | null {
  if (!h.break_started_at) return null;
  return new Date(Date.parse(h.break_started_at) + h.config.break_ms).toISOString();
}

export function joriyModul(h: Pick<MockHolat, 'modules' | 'current_module'>): MockModul | undefined {
  return h.modules.find((m) => m.module === h.current_module);
}

// ---------- Ekran ----------

export type MockEkran = 'modul-oldi' | 'modul' | 'tanaffus' | 'natija' | 'toxtatilgan';

export function ekranTuri(h: Pick<MockHolat, 'status' | 'phase'>): MockEkran {
  if (h.status === 'finished') return 'natija';
  if (h.status === 'abandoned') return 'toxtatilgan';
  if (h.phase === 'module') return 'modul';
  if (h.phase === 'break') return 'tanaffus';
  return 'modul-oldi';
}

// ---------- Mahalliy holat (navbat) ----------

export const MOCK_KALIT = (id: string) => `tayanch:sat-mock:v1:${id}`;

export interface MockMahalliy {
  /** Navbat qaysi modulga tegishli (modul almashsa eski navbat tashlanadi: server baribir qabul qilmaydi) */
  modul: number;
  joriy: number;
  /** Yuborilmagan javoblar: savol → oxirgi qiymat */
  navbat: Record<string, SaqlashBand>;
  /** Cross out qilingan variantlar (faqat shu brauzerda) */
  ochirilgan: Record<string, string[]>;
}

export const bushMockMahalliy = (modul = 1): MockMahalliy => ({ modul, joriy: 0, navbat: {}, ochirilgan: {} });

/** localStorage dagi qiymatni tekshiradi; buzilgan yoki eski shakl bo'lsa bo'sh holat. */
export function mockMahalliyTekshir(xom: string | null): MockMahalliy {
  if (!xom) return bushMockMahalliy();
  try {
    const x = JSON.parse(xom) as Partial<MockMahalliy>;
    const m = bushMockMahalliy(Number.isInteger(x.modul) && x.modul! >= 1 && x.modul! <= 4 ? x.modul! : 1);
    m.joriy = Number.isInteger(x.joriy) && x.joriy! >= 0 ? x.joriy! : 0;
    if (x.navbat && typeof x.navbat === 'object') {
      for (const [k, v] of Object.entries(x.navbat)) {
        if (!v || typeof v !== 'object') continue;
        const b = v as Partial<SaqlashBand>;
        m.navbat[k] = {
          question_id: k,
          answer: typeof b.answer === 'string' ? b.answer.slice(0, 100) : null,
          flagged: b.flagged === true,
          time_ms: typeof b.time_ms === 'number' && b.time_ms >= 0 ? Math.round(b.time_ms) : 0,
        };
      }
    }
    if (x.ochirilgan && typeof x.ochirilgan === 'object') {
      for (const [k, v] of Object.entries(x.ochirilgan)) {
        if (Array.isArray(v)) m.ochirilgan[k] = v.filter((s): s is string => typeof s === 'string').slice(0, 6);
      }
    }
    return m;
  } catch {
    return bushMockMahalliy();
  }
}

/** Modul almashganda: navbat va belgilar tozalanadi, joriy savol boshiga. */
export function modulgaMosla(m: MockMahalliy, modul: number): MockMahalliy {
  return m.modul === modul ? m : bushMockMahalliy(modul);
}

/** Server qoralamalari ustiga mahalliy navbat (yangiroq) qo'yiladi. */
export function javoblarniBirlashtir(server: MockJavob[], m: MockMahalliy): Map<string, SaqlashBand> {
  const r = new Map<string, SaqlashBand>();
  for (const j of server) r.set(j.question_id, { question_id: j.question_id, answer: j.answer, flagged: j.flagged, time_ms: j.time_ms });
  for (const [k, b] of Object.entries(m.navbat)) {
    const eski = r.get(k);
    r.set(k, { ...b, time_ms: Math.max(b.time_ms, eski?.time_ms ?? 0) });
  }
  return r;
}

/** Navbatdan bir so'rovga (server 30 tagacha qabul qiladi). */
export const navbatBolagi = (m: MockMahalliy, max = 30): SaqlashBand[] => Object.values(m.navbat).slice(0, max);

/** Server qabul qilgan bandlarni navbatdan oladi: shu orada o'zgargan band (boshqa qiymat) qoladi. */
export function navbatdanOl(m: MockMahalliy, yuborilgan: SaqlashBand[]): MockMahalliy {
  const navbat = { ...m.navbat };
  for (const b of yuborilgan) {
    const hozir = navbat[b.question_id];
    if (hozir && hozir.answer === b.answer && hozir.flagged === b.flagged && hozir.time_ms === b.time_ms) delete navbat[b.question_id];
  }
  return { ...m, navbat };
}

// ---------- Savollar xaritasi ----------

export interface MockXaritaBand {
  raqam: number;
  qid: string;
  javobli: boolean;
  belgilangan: boolean;
  joriy: boolean;
}

export function mockXarita(savollar: Pick<MockSavol, 'id'>[], javoblar: Map<string, SaqlashBand>, joriy: number): MockXaritaBand[] {
  return savollar.map((q, i) => {
    const j = javoblar.get(q.id);
    return { raqam: i + 1, qid: q.id, javobli: !!j?.answer, belgilangan: !!j?.flagged, joriy: i === joriy };
  });
}

export function mockXaritaYorliq(b: MockXaritaBand): string {
  return [`Question ${b.raqam}`, b.javobli ? 'answered' : 'not answered', b.belgilangan ? 'marked for review' : '', b.joriy ? 'current' : '']
    .filter(Boolean).join(', ');
}

/** "Next module" tasdiqlash matni: javobsiz va belgilangan savollar. */
export function topshirishOgohi(x: MockXaritaBand[]): string {
  const javobsiz = x.filter((b) => !b.javobli).length;
  const belgi = x.filter((b) => b.belgilangan).length;
  const qism: string[] = [];
  if (javobsiz) qism.push(`${javobsiz} ${javobsiz === 1 ? 'question has' : 'questions have'} no answer`);
  if (belgi) qism.push(`${belgi} ${belgi === 1 ? 'is' : 'are'} marked for review`);
  return qism.length ? `${qism.join(' and ')}. You can't come back to this module after you submit it.` : "You can't come back to this module after you submit it.";
}

// ---------- Kreditlar ----------

/** Kirish sahifasidagi qator: "No limit on your plan", "1 of 2 used this month", "None left this month". */
export function kreditMatni(k: MockKredit | undefined): { matn: string; qoldi: boolean } {
  if (!k || k.max === null) return { matn: 'No limit on your plan', qoldi: true };
  const davr = k.per === 'month' ? 'this month' : 'today';
  const qolgan = Math.max(k.max - k.used, 0);
  if (!qolgan) return { matn: `None left ${davr}`, qoldi: false };
  return { matn: `${Math.min(k.used, k.max)} of ${k.max} used ${davr}`, qoldi: true };
}

// ---------- Natija ----------

export interface SohaQator { section: SavolBolimi; domain: string; correct: number; total: number }
export interface MockKonikma { section: SavolBolimi; domain: string; skill: string; correct: number; total: number }

/** Soha va ko'nikma bo'yicha to'g'ri / jami (birinchi uchragan tartibda: R&W, keyin Math). */
export function natijaJadvali(qs: Pick<MockNatijaSavol, 'section' | 'domain' | 'skill' | 'is_correct'>[]): { sohalar: SohaQator[]; konikmalar: MockKonikma[] } {
  const sohalar = new Map<string, SohaQator>();
  const konikmalar = new Map<string, MockKonikma>();
  const tartib = [...qs].sort((a, b) => (a.section === b.section ? 0 : a.section === 'rw' ? -1 : 1));
  for (const q of tartib) {
    const d = sohalar.get(`${q.section}|${q.domain}`) ?? { section: q.section, domain: q.domain, correct: 0, total: 0 };
    d.total += 1; if (q.is_correct) d.correct += 1;
    sohalar.set(`${q.section}|${q.domain}`, d);
    const k = konikmalar.get(`${q.section}|${q.skill}`) ?? { section: q.section, domain: q.domain, skill: q.skill, correct: 0, total: 0 };
    k.total += 1; if (q.is_correct) k.correct += 1;
    konikmalar.set(`${q.section}|${q.skill}`, k);
  }
  return { sohalar: [...sohalar.values()], konikmalar: [...konikmalar.values()] };
}

/** Sarflangan vaqt: modul boshlanishidan topshirilguncha (ms), modul bo'yicha. */
export function modulVaqtlari(mods: MockModul[]): { module: number; ms: number; auto: boolean }[] {
  return mods.filter((m) => m.started_at && m.submitted_at)
    .map((m) => ({ module: m.module, ms: Math.max(0, Date.parse(m.submitted_at!) - Date.parse(m.started_at!)), auto: m.auto_submitted }));
}

// ---------- Xatolar ----------

export type MockXato = 'tarmoq' | 'kirish' | 'kvota' | 'tayyor-emas' | 'ochiq' | 'topilmadi' | 'forma' | 'tugamagan' | 'boshqa';

export function mockXatosi(e: unknown): MockXato {
  const x = (e ?? {}) as { message?: string; code?: string; details?: string };
  const m = `${x.message ?? ''} ${x.details ?? ''}`;
  if (m.includes('quota_exceeded')) return 'kvota';
  if (m.includes('mock_not_ready')) return 'tayyor-emas';
  if (m.includes('mock_in_progress')) return 'ochiq';
  if (m.includes('mock_not_found')) return 'topilmadi';
  if (m.includes('mock_form_unavailable')) return 'forma';
  if (m.includes('mock_not_finished')) return 'tugamagan';
  if (m.includes('not_authenticated') || x.code === '42501' || x.code === 'PGRST301') return 'kirish';
  if (e instanceof TypeError || /fetch|network|load failed/i.test(m)) return 'tarmoq';
  return 'boshqa';
}
