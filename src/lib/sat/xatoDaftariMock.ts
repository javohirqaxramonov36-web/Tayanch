// FAQAT DEV: Xato daftari sahifasini bazasiz sinash uchun soxta server (?mock=toliq|bosh|xato|kvota).
// toliq: 6 ta bank savoli (due, keyinroq, mastered, faqat saqlangan); bosh: hech narsa; xato: ro'yxat server xatosi;
// kvota: "Review practice questions" quota_exceeded. Sahifa buni faqat `import.meta.env.DEV` ichida dinamik import qiladi.
// Savollar sessiya mock'idan (sessiyaMock.ts, ?mock=oddiy): "Review practice questions" o'sha mock sessiyani ochadi.
// Saqlanganlar sessiya mock'i bilan umumiy (`tayanch:dev-sessiya-mock`.saqlangan): sessiyadagi "Save question" shu yerda ko'rinadi.
import { mockApi as sessiyaMockApi, MOCK_ID } from './sessiyaMock.ts';
import type { BankQator, BankSavol, DaftarApi } from './xatoDaftari.ts';
import type { ServerSavol } from './sessiya.ts';

export type DaftarMock = 'toliq' | 'bosh' | 'xato' | 'kvota';
const HOLAT = 'tayanch:dev-xato-daftari-mock';
const SESSIYA = 'tayanch:dev-sessiya-mock';

interface Yozuv { box: number; next_due: string; reason_tag: string | null; note: string | null }
const kut = (ms: number) => new Promise((r) => setTimeout(r, ms));
const kunQosh = (n: number) => {
  const d = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent' }).format(new Date());
  const [y, m, k] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, k) + n * 86400000).toISOString().slice(0, 10);
};
function oqi<T>(k: string, z: T): T { try { return (JSON.parse(localStorage.getItem(k) ?? '') as T) ?? z; } catch { return z; } }
const yoz = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* */ } };
const saqlanganOqi = () => new Set(oqi<{ saqlangan?: string[] }>(SESSIYA, {}).saqlangan ?? []);
function saqlanganYoz(s: Set<string>) {
  const h = oqi<Record<string, unknown>>(SESSIYA, { sessiyalar: {}, review: {} });
  h.saqlangan = [...s];
  yoz(SESSIYA, h);
}

export function mockApi(tur: DaftarMock): DaftarApi {
  let savollar: ServerSavol[] | null = null;
  const savollarOl = async () => (savollar ??= (await sessiyaMockApi('oddiy').ol(MOCK_ID.oddiy)).questions);

  async function navbat(): Promise<Record<string, Yozuv>> {
    const qs = await savollarOl();
    let h = oqi<Record<string, Yozuv> | null>(HOLAT, null);
    if (!h) {
      h = {};
      if (tur === 'toliq') {
        h[qs[0].id] = { box: 1, next_due: kunQosh(0), reason_tag: 'careless', note: 'Sample note: I copied the sign wrong.' };
        h[qs[1].id] = { box: 2, next_due: kunQosh(0), reason_tag: null, note: null };
        h[qs[2].id] = { box: 3, next_due: kunQosh(5), reason_tag: 'concept_gap', note: null };
        h[qs[3].id] = { box: 5, next_due: kunQosh(-2), reason_tag: 'misread', note: null };
        h[qs[5].id] = { box: 1, next_due: kunQosh(1), reason_tag: null, note: null };
        const s = saqlanganOqi(); s.add(qs[4].id); s.add(qs[5].id); saqlanganYoz(s);
      }
      yoz(HOLAT, h);
    }
    return h;
  }
  const topSavol = async (qid: string) => (await savollarOl()).find((q) => q.id === qid);

  return {
    async royxat() {
      await kut(400);
      if (tur === 'xato') throw { message: 'mock: server error', code: 'XX000' };
      const h = await navbat();
      const s = saqlanganOqi();
      const ids = [...new Set([...Object.keys(h), ...s])];
      const items: BankQator[] = [];
      for (const id of ids) {
        const q = await topSavol(id);
        if (!q) continue;
        const y = h[id];
        items.push({
          question_id: id, section: q.section, domain: q.domain, skill: q.skill, difficulty: q.difficulty ?? 3, format: q.format,
          preview: (q.passage || q.stem).slice(0, 140), in_queue: !!y, box: y?.box ?? null, next_due: y?.next_due ?? null,
          reason_tag: y?.reason_tag ?? null, note: y?.note ?? null, bookmarked: s.has(id),
        });
      }
      return { today: kunQosh(0), items };
    },
    async ochish(qid) {
      await kut(300);
      const q = await topSavol(qid);
      if (!q) throw { message: 'not_in_list', code: 'P0002' };
      const r: BankSavol = {
        id: q.id, section: q.section, domain: q.domain, skill: q.skill, difficulty: q.difficulty ?? 3, format: q.format,
        passage: q.passage ?? null, stem: q.stem, options: q.options ?? null,
        figure: q.figure ? { path: q.figure.path, alt: q.figure.alt, caption: q.figure.caption ?? null } : null,
      };
      return r;
    },
    async teg(qid, teg) {
      await kut(250);
      const h = await navbat(); if (h[qid]) h[qid].reason_tag = teg; yoz(HOLAT, h);
    },
    async izoh(qid, izoh) {
      await kut(250);
      const h = await navbat(); if (h[qid]) h[qid].note = izoh || null; yoz(HOLAT, h);
    },
    async saqla(qid, on) {
      await kut(250);
      const s = saqlanganOqi(); if (on) s.add(qid); else s.delete(qid); saqlanganYoz(s);
    },
    async takrorla() {
      await kut(400);
      if (tur === 'kvota') throw { message: 'quota_exceeded', code: 'P0001' };
      return { session_id: MOCK_ID.oddiy };
    },
    async rasm(path) {
      return sessiyaMockApi('oddiy').rasm(path);
    },
  };
}

export function mockTozala() {
  localStorage.removeItem(HOLAT);
}
