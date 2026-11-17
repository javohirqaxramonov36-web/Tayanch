// FAQAT DEV: AI Tutor sahifasini Supabase va AI'siz sinash (?mock=...). Prod build'ga kirmaydi
// (sahifada import.meta.env.DEV ichida dinamik import). Hech qanday tarmoq so'rovi yo'q.
//   tayyor   AI ochiq, 2 ta xato, 1 ta suhbat; javoblar soxta "SINOV" matn
//   yopiq    AI o'chiq (kill switch yoki byudjet)
//   tarif    AI tarifda yo'q (not_in_plan)
//   limit    ochiq, lekin birinchi xabarda quota_exceeded
//   cb       ochiq, har xabar cb_content bilan rad etiladi
import type { Suhbat, TutorXabar, XatoTanlov } from './aiTutor';
import type { TutorApi } from './aiTutorApi';

export type MockTur = 'tayyor' | 'yopiq' | 'tarif' | 'limit' | 'cb';

const kut = () => new Promise((r) => setTimeout(r, 250));

export function mockApi(tur: MockTur): TutorApi {
  let son = 1;
  const suhbatlar: Suhbat[] = [
    { id: 'mock-1', mode: 'own', attempt_id: null, title: 'SINOV: how do I find slope?', updated_at: '2026-11-11T09:00:00Z' },
  ];
  const xabarlar: Record<string, TutorXabar[]> = {
    'mock-1': [
      { role: 'user', content: 'SINOV: how do I find slope?' },
      { role: 'assistant', content: 'SINOV javob: slope is the change in y divided by the change in x.', check_status: 'not_checked' },
    ],
  };
  const xatolar: XatoTanlov[] = [
    { attempt_id: 11, created_at: '2026-11-12T06:00:00Z', section: 'math', skill: 'SINOV linear equations', difficulty: 2, snippet: 'SINOV: if 2x + 3 = 11, what is x?' },
    { attempt_id: 12, created_at: '2026-11-10T06:00:00Z', section: 'rw', skill: 'SINOV transitions', difficulty: 3, snippet: 'SINOV: choose the transition' },
  ];
  return {
    async holat() {
      await kut();
      const available = tur !== 'yopiq' && tur !== 'tarif';
      return {
        status: { available, reason: tur === 'yopiq' ? 'paused' : tur === 'tarif' ? 'not_in_plan' : null },
        usage: available
          ? {
            limits: {
              ai_messages: { max: 3, per: 'day', used: son - 1, remaining: 4 - son, resets_at: '2026-11-12T19:00:00Z' },
              ai_messages_month: { max: 30, per: 'month', used: 5 + son, remaining: 25 - son, resets_at: '2026-11-30T19:00:00Z' },
            },
            today: { ai_messages: son - 1, ai_messages_month: 5 + son },
          }
          : null,
      };
    },
    async xatolar() {
      await kut();
      return xatolar;
    },
    async suhbatlar() {
      await kut();
      return [...suhbatlar];
    },
    async xabarlar(id) {
      await kut();
      return [...(xabarlar[id] ?? [])];
    },
    async yubor(t) {
      await kut();
      if (tur === 'limit') return { ok: false, kod: 'quota_exceeded', status: 429 };
      if (tur === 'cb') return { ok: false, kod: 'cb_content', status: 422 };
      son++;
      const id = t.conversation_id ?? `mock-${son}`;
      if (!t.conversation_id) {
        suhbatlar.unshift({ id, mode: t.mode, attempt_id: t.attempt_id ?? null, title: `SINOV ${t.message.slice(0, 40)}`, updated_at: new Date().toISOString() });
      }
      const check = t.mode === 'attempt' ? (son % 3 === 0 ? 'unverified' : 'verified') : 'not_checked';
      const reply = check === 'unverified'
        ? "I couldn't check this explanation against the answer key, so I'm not showing it."
        : 'SINOV javob: subtract 3 from both sides, then divide by 2. So x = 4.';
      (xabarlar[id] ??= []).push({ role: 'user', content: t.message }, { role: 'assistant', content: reply, check_status: check });
      return { ok: true, data: { conversation_id: id, reply, check } };
    },
    async ochir(id) {
      await kut();
      const i = suhbatlar.findIndex((s) => s.id === id);
      if (i >= 0) suhbatlar.splice(i, 1);
      delete xabarlar[id];
    },
    async hammasiniOchir() {
      await kut();
      suhbatlar.splice(0);
      for (const k of Object.keys(xabarlar)) delete xabarlar[k];
    },
  };
}
