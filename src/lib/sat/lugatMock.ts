// FAQAT DEV: lug'at sahifasini Supabase'siz sinash (?mock=...). Prod build'ga kirmaydi (sahifada import.meta.env.DEV ichida).
//   anon   20 so'z, hisobsiz (brauzer rejimi)
//   bosh   hisob bilan, cheklovsiz, o'z so'zlari yopiq
//   limit  hisob bilan, kuniga 3 ta yangi so'z (&kun=YYYY-MM-DD bilan "ertasi kun")
//   pro    hisob bilan, o'z so'zlari ochiq
//   bosh-baza  bazada so'z yo'q (namuna kartalarga qaytadi)
//   xato   tarmoq xatosi
// Holat localStorage'da: tayanch:dev-lugat-mock:<ssenariy>; &tozala=1 tozalaydi. So'zlar soxta "SINOV" yozuvlar.
import { keyingiQuti } from '../leitner.ts';
import { kalitQil, type Soz, type SozHolat } from './lugat.ts';
import { LugatXato, type LugatApi } from './lugatApi.ts';

export type MockTur = 'anon' | 'bosh' | 'limit' | 'pro' | 'bosh-baza' | 'xato';

interface MockHolat { progress: Record<string, SozHolat>; ozlari: Soz[]; sarf: Record<string, number>; imported: boolean }

const SOZLAR: Soz[] = Array.from({ length: 20 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  const word = `sinov-${n}`;
  return {
    kalit: word, id: `mock-${n}`, word, pos: i % 2 ? 'verb' : 'adjective',
    definition: `SINOV definition ${n}: a placeholder meaning used only in the dev mock.`,
    example: `SINOV example sentence with ${word}.`,
    difficulty: (['easy', 'medium', 'hard'] as const)[i % 3], topic: i < 10 ? 'SINOV topic A' : 'SINOV topic B',
    uzbek: i % 4 === 0 ? `SINOV tarjima ${n}` : null, oz: false,
  };
});

const kut = () => new Promise((r) => setTimeout(r, 250));

export function mockApi(tur: MockTur): LugatApi {
  const p = new URLSearchParams(location.search);
  const kalit = `tayanch:dev-lugat-mock:${tur}`;
  if (p.get('tozala') === '1') localStorage.removeItem(kalit);
  const today = p.get('kun') ?? new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent' }).format(new Date());
  const max = tur === 'limit' ? 3 : null;
  let h: MockHolat = { progress: {}, ozlari: [], sarf: {}, imported: false };
  try { h = { ...h, ...JSON.parse(localStorage.getItem(kalit) ?? '{}') }; } catch { /* yangi */ }
  const saqla = () => localStorage.setItem(kalit, JSON.stringify(h));
  const kirgan = tur !== 'anon';
  const talab = () => { if (!kirgan) throw new LugatXato('auth'); };

  return {
    async sozlar() {
      await kut();
      if (tur === 'xato') throw new LugatXato('network');
      return tur === 'bosh-baza' ? [] : SOZLAR;
    },
    async foydalanuvchi() { return kirgan ? 'mock-user' : null; },
    async holat() {
      talab();
      const used = h.sarf[today] ?? 0;
      return { today, yangiMax: max, yangiQoldiq: max === null ? null : Math.max(max - used, 0), ozSozlar: tur === 'pro', importQilingan: h.imported };
    },
    async progress() {
      talab(); await kut();
      return { holat: new Map(Object.entries(h.progress)), ozlari: [...h.ozlari] };
    },
    async baholash(s, togri) {
      talab(); await kut();
      const eski = h.progress[s.kalit];
      if (!s.oz && (!eski || eski.quti === null)) {
        const used = h.sarf[today] ?? 0;
        if (max !== null && used >= max) throw new LugatXato('quota');
        h.sarf[today] = used + 1;
      }
      const k = keyingiQuti(eski?.quti ?? null, togri, today);
      h.progress[s.kalit] = { quti: k.quti, keyingi: k.keyingi, baho: togri ? 'bilaman' : 'organ', yulduz: eski?.yulduz ?? false };
      saqla();
      return h.progress[s.kalit];
    },
    async yulduz(s, qiymat) {
      talab();
      h.progress[s.kalit] = { ...(h.progress[s.kalit] ?? { quti: null, keyingi: null, baho: null, yulduz: false }), yulduz: qiymat };
      saqla();
    },
    async importLokal(royxat) {
      talab();
      if (h.imported) return 0;
      h.imported = true;
      let n = 0;
      for (const x of royxat as { word: string; status?: string; box?: number; next_due?: string; starred?: boolean }[]) {
        const s = SOZLAR.find((w) => w.kalit === kalitQil(x.word));
        if (!s) continue;
        const box = (x.box ?? (x.status === 'bilaman' ? 2 : x.status === 'organ' ? 1 : null)) as SozHolat['quti'];
        h.progress[s.kalit] = { quti: box, keyingi: box ? (x.next_due ?? today) : null, baho: x.status === 'bilaman' ? 'bilaman' : x.status === 'organ' ? 'organ' : null, yulduz: !!x.starred };
        n++;
      }
      saqla();
      return n;
    },
    async ozQosh(k) {
      talab(); await kut();
      if (tur !== 'pro') throw new LugatXato('feature');
      if (h.ozlari.some((s) => s.word.toLowerCase() === k.word.trim().toLowerCase())) throw new LugatXato('duplicate');
      const s: Soz = { kalit: `oz:${kalitQil(k.word)}`, id: `oz-${Date.now()}`, word: k.word.trim(), pos: k.pos, definition: k.definition.trim(), example: k.example, difficulty: null, topic: null, uzbek: null, oz: true };
      h.ozlari.push(s); saqla();
      return s;
    },
    async ozOchir(id) {
      talab();
      const s = h.ozlari.find((x) => x.id === id);
      h.ozlari = h.ozlari.filter((x) => x.id !== id);
      if (s) delete h.progress[s.kalit];
      saqla();
    },
  };
}
