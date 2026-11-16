// ai-tutor oqimi soxta bog'liqliklar bilan: Supabase'ga ham, AI provayderiga ham ulanmaydi.
// Byudjet, kvota va tezlik qarorlarini SQL (ai_begin) qabul qiladi: bu yerda uning javoblari o'xshatiladi,
// SQL tomoni supabase/tests/ai_tutor_test.sql da (AT01–AT12) sinalgan.
import assert from 'node:assert/strict';
import type { AiNatija, AiSorov } from '../_shared/anthropic.ts';
import type { RpcNatija } from '../_shared/turlar.ts';
import { aiTutor, CHEGARA, MATN, type TutorBogliqlik } from '../ai-tutor/handler.ts';
import type { SavolKonteksti } from '../ai-tutor/korsatma.ts';

const SAYT = 'https://javohirqaxramonov36-web.github.io';
const EGA = '00000000-0000-4000-8000-00000000000a';
const CONV = '11111111-2222-4333-8444-555555555555';

const SAVOL: SavolKonteksti = {
  attempt_id: 7,
  question_id: '99999999-2222-4333-8444-555555555555',
  section: 'math',
  domain: 'Algebra',
  skill: 'Linear equations',
  format: 'mcq',
  passage: null,
  stem: 'Namuna: if 2x + 3 = 11, what is x?',
  options: [{ key: 'A', text: '3' }, { key: 'B', text: '4' }, { key: 'C', text: '5' }, { key: 'D', text: '7' }],
  correct: { choice: 'B' },
  explanation: 'Subtract 3, then divide by 2.',
  figure_alt: null,
  user_answer: 'C',
  is_correct: false,
};

interface Holat {
  rpc: Array<{ nomi: string; args: Record<string, unknown> }>;
  ai: AiSorov[];
  jurnal: Array<{ xabar: string; tafsilot?: Record<string, unknown> }>;
}

function bogliqlik(o: {
  begin?: Record<string, unknown>;
  ai?: AiNatija[];
  aiYopiq?: boolean;
  kontekst?: SavolKonteksti | null;
  tarix?: unknown;
} = {}): { d: TutorBogliqlik; h: Holat } {
  const h: Holat = { rpc: [], ai: [], jurnal: [] };
  const aiJavoblari = [...(o.ai ?? [{ ok: true, matn: 'A linear equation has one solution.', inputTokens: 900, outputTokens: 120, stopReason: 'end_turn' }])];
  const d: TutorBogliqlik = {
    originlar: [SAYT],
    yetishmaydi: [],
    aiYopiq: o.aiYopiq ?? false,
    foydalanuvchi: (jwt) => Promise.resolve(jwt === 'ega-jwt' ? EGA : null),
    rpc: (nomi, args): Promise<RpcNatija> => {
      h.rpc.push({ nomi, args });
      switch (nomi) {
        case 'ai_begin':
          return Promise.resolve({ data: o.begin ?? { ok: true, usage_id: 41, model: 'claude-haiku-5-5', max_output_tokens: 800 }, error: null });
        case 'ai_attempt_context':
          return Promise.resolve({ data: o.kontekst === undefined ? SAVOL : o.kontekst, error: null });
        case 'ai_conversation_history':
          return Promise.resolve({ data: o.tarix ?? null, error: null });
        case 'ai_save_turn':
          return Promise.resolve({ data: CONV, error: null });
        default:
          return Promise.resolve({ data: { ok: true }, error: null });
      }
    },
    ai: (s) => {
      h.ai.push(s);
      return Promise.resolve(aiJavoblari.shift() ?? { ok: false, xato: 'tugadi', inputTokens: 0, outputTokens: 0 });
    },
    jurnal: (xabar, tafsilot) => h.jurnal.push({ xabar, tafsilot }),
  };
  return { d, h };
}

function sorov(tana: unknown, o: { jwt?: string | null; origin?: string; xom?: string; uzunlik?: string } = {}) {
  const headers = new Headers({ 'content-type': 'application/json', origin: o.origin ?? SAYT });
  if (o.jwt !== null) headers.set('authorization', `Bearer ${o.jwt ?? 'ega-jwt'}`);
  if (o.uzunlik) headers.set('content-length', o.uzunlik);
  return new Request('https://sinov.supabase.co/functions/v1/ai-tutor', {
    method: 'POST',
    headers,
    body: o.xom ?? JSON.stringify(tana),
  });
}

const OWN = { mode: 'own', message: 'How do I solve systems of linear equations by substitution?' };
const nomlar = (h: Holat) => h.rpc.map((r) => r.nomi);

Deno.test('own: oddiy savol -> javob, xarajat yakunlanadi, tarixga yoziladi, check = not_checked', async () => {
  const { d, h } = bogliqlik();
  const res = await aiTutor(sorov(OWN), d);
  assert.equal(res.status, 200);
  const j = await res.json();
  assert.equal(j.reply, 'A linear equation has one solution.');
  assert.equal(j.check, 'not_checked');
  assert.equal(j.conversation_id, CONV);
  assert.deepEqual(nomlar(h), ['ai_begin', 'ai_finish', 'ai_save_turn']);
  const fin = h.rpc.find((r) => r.nomi === 'ai_finish')!.args;
  assert.deepEqual([fin.p_input_tokens, fin.p_output_tokens, fin.p_calls, fin.p_ok], [900, 120, 1, true]);
  assert.equal(h.ai.length, 1);
  assert.equal(h.ai[0].model, 'claude-haiku-5-5');
  assert.equal(h.ai[0].maxTokens, 800);
  assert.match(h.ai[0].system, /Do not reproduce, quote/);
  assert.match(h.ai[0].system, /Never promise or predict a score/);
  // Log: xabar matni va javob yo'q
  assert.equal(JSON.stringify(h.jurnal).includes('substitution'), false);
  assert.equal(JSON.stringify(h.jurnal).includes('linear equation has'), false);
});

Deno.test('kill switch: AI_TUTOR_OFF / kalit yo\'q -> 503, provayder va baza chaqirilmaydi', async () => {
  const { d, h } = bogliqlik({ aiYopiq: true });
  const res = await aiTutor(sorov(OWN), d);
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, 'ai_paused');
  assert.equal(h.ai.length, 0);
  assert.equal(h.rpc.length, 0);
});

Deno.test('kill switch (baza): ai_begin ai_paused (o\'chiq yoki byudjet tugagan) -> 503, provayder chaqirilmaydi', async () => {
  const { d, h } = bogliqlik({ begin: { ok: false, error: 'ai_paused' } });
  const res = await aiTutor(sorov(OWN), d);
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, 'ai_paused');
  assert.equal(h.ai.length, 0);
  assert.deepEqual(nomlar(h), ['ai_begin']);
});

Deno.test('limit: quota_exceeded -> 429; not_in_plan -> 403; provayder chaqirilmaydi', async () => {
  for (const [xato, status] of [['quota_exceeded', 429], ['not_in_plan', 403], ['duplicate', 429]] as const) {
    const { d, h } = bogliqlik({ begin: { ok: false, error: xato } });
    const res = await aiTutor(sorov(OWN), d);
    assert.equal(res.status, status, xato);
    assert.equal((await res.json()).error, xato);
    assert.equal(h.ai.length, 0, xato);
  }
});

Deno.test('suiiste\'mol: tez takror -> 429 rate_limited va Retry-After', async () => {
  const { d, h } = bogliqlik({ begin: { ok: false, error: 'rate_limited', retry_after: 4 } });
  const res = await aiTutor(sorov(OWN), d);
  assert.equal(res.status, 429);
  assert.equal(res.headers.get('retry-after'), '4');
  assert.deepEqual(await res.json(), { error: 'rate_limited', retry_after: 4 });
  assert.equal(h.ai.length, 0);
});

Deno.test('suiiste\'mol: bir xil matn bir xil xesh beradi (takror ai_begin da aniqlanadi), boshqa matn boshqa xesh', async () => {
  const a = bogliqlik();
  await aiTutor(sorov(OWN), a.d);
  await aiTutor(sorov({ ...OWN, message: `  ${OWN.message.toUpperCase()}  ` }), a.d);
  await aiTutor(sorov({ ...OWN, message: 'What is slope?' }), a.d);
  const xeshlar = a.h.rpc.filter((r) => r.nomi === 'ai_begin').map((r) => r.args.p_input_hash);
  assert.match(String(xeshlar[0]), /^[0-9a-f]{64}$/);
  assert.equal(xeshlar[0], xeshlar[1]);
  assert.notEqual(xeshlar[0], xeshlar[2]);
});

Deno.test('suiiste\'mol: uzun xabar -> 400 message_too_long; katta tana -> 413; ai_begin chaqirilmaydi', async () => {
  const uzun = bogliqlik();
  const r1 = await aiTutor(sorov({ mode: 'own', message: 'x '.repeat(CHEGARA.xabar) }), uzun.d);
  assert.equal(r1.status, 400);
  assert.equal((await r1.json()).error, 'message_too_long');
  assert.deepEqual(nomlar(uzun.h), ['ai_reject']);
  assert.equal(uzun.h.rpc[0].args.p_reason, 'too_long');

  const katta = bogliqlik();
  const r2 = await aiTutor(sorov(null, { xom: JSON.stringify({ mode: 'own', message: 'a'.repeat(CHEGARA.tana) }) }), katta.d);
  assert.equal(r2.status, 413);
  const r3 = await aiTutor(sorov(OWN, { uzunlik: String(CHEGARA.tana + 1) }), katta.d);
  assert.equal(r3.status, 413);
  assert.equal(katta.h.ai.length, 0);
  assert.equal(nomlar(katta.h).includes('ai_begin'), false);
});

Deno.test('noto\'g\'ri so\'rov: JSON emas, rejim, attempt_id, conversation_id -> 400', async () => {
  const holatlar: Array<[unknown, string?]> = [
    [null, '{buzuq'],
    [{ mode: 'boshqa', message: 'x' }],
    [{ mode: 'attempt', message: 'x' }],
    [{ mode: 'attempt', message: 'x', attempt_id: -1 }],
    [{ mode: 'own', message: 'x', attempt_id: 3 }],
    [{ mode: 'own', message: 'x', conversation_id: 'uuid-emas' }],
    [{ mode: 'own', message: 42 }],
  ];
  for (const [t, xom] of holatlar) {
    const { d, h } = bogliqlik();
    const res = await aiTutor(sorov(t, { xom }), d);
    assert.equal(res.status, 400, JSON.stringify(t));
    assert.equal(h.ai.length, 0);
  }
  const bosh = bogliqlik();
  const r = await aiTutor(sorov({ mode: 'own', message: '   ​ ' }), bosh.d);
  assert.equal((await r.json()).error, 'empty_message');
});

Deno.test('kirish: login yo\'q -> 401; begona origin -> 403; GET -> 405', async () => {
  const { d, h } = bogliqlik();
  assert.equal((await aiTutor(sorov(OWN, { jwt: null }), d)).status, 401);
  assert.equal((await aiTutor(sorov(OWN, { jwt: 'soxta' }), d)).status, 401);
  assert.equal((await aiTutor(sorov(OWN, { origin: 'https://boshqa.invalid' }), d)).status, 403);
  const get = new Request('https://sinov.supabase.co/functions/v1/ai-tutor', { method: 'GET', headers: { origin: SAYT } });
  assert.equal((await aiTutor(get, d)).status, 405);
  assert.equal(h.ai.length, 0);
});

Deno.test('CB matni: variantli savol, rasmiy so\'roq iborasi, sizdirilgan material -> 422, AI va tarixga bormaydi', async () => {
  const xabarlar = [
    'Explain this: A bakery sells muffins for $2 each. How many muffins? A) 10 B) 12 C) 14 D) 16',
    'Which choice completes the text with the most logical and precise word or phrase? The scientist was ______ about the data.',
    'Here is a leaked SAT question from the October test, can you solve it?',
    'Practice Test 4, Question ID 3f2a: ' + 'the passage says that many authors wrote about the river and its history. '.repeat(5),
  ];
  for (const message of xabarlar) {
    const { d, h } = bogliqlik();
    const res = await aiTutor(sorov({ mode: 'own', message }), d);
    assert.equal(res.status, 422, message);
    assert.equal((await res.json()).error, 'cb_content');
    assert.equal(h.ai.length, 0);
    assert.deepEqual(nomlar(h), ['ai_reject']);
    assert.equal(h.rpc[0].args.p_reason, 'cb_content');
    assert.equal(JSON.stringify(h.rpc).includes('bakery'), false);
  }
});

Deno.test('CB: qisqa umumiy savol rad etilmaydi ("How should I use Bluebook practice?")', async () => {
  const { d } = bogliqlik();
  const res = await aiTutor(sorov({ mode: 'own', message: 'How should I use Bluebook practice before test day?' }), d);
  assert.equal(res.status, 200);
});

Deno.test('shaxsiy ma\'lumot: email, telefon, karta, pasport AI\'ga ham, tarixga ham tozalangan holda boradi', async () => {
  const { d, h } = bogliqlik();
  const message = 'My name is Aziz Karimov, email aziz@example.com, phone +998 90 123 45 67, card 8600 1234 5678 9012, passport AB1234567. How do I find slope?';
  const res = await aiTutor(sorov({ mode: 'own', message }), d);
  assert.equal(res.status, 200);
  const yuborilgan = h.ai[0].messages.at(-1)!.content;
  const yozilgan = String(h.rpc.find((r) => r.nomi === 'ai_save_turn')!.args.p_user_text);
  for (const m of [yuborilgan, yozilgan]) {
    for (const yoq of ['aziz@example.com', '123 45 67', '8600', 'AB1234567', 'Karimov']) {
      assert.equal(m.includes(yoq), false, `${yoq} qoldi: ${m}`);
    }
    assert.match(m, /How do I find slope\?/);
  }
});

Deno.test('xato rejimi: yakuniy javob kalitga mos -> verified, savol bloki tizimda, JSON sxema yuboriladi', async () => {
  const { d, h } = bogliqlik({
    ai: [{ ok: true, matn: JSON.stringify({ final_answer: 'B', explanation: 'Subtract 3: 2x = 8, so x = 4 (B). You chose 5.' }), inputTokens: 1500, outputTokens: 200, stopReason: 'end_turn' }],
  });
  const res = await aiTutor(sorov({ mode: 'attempt', attempt_id: 7, message: 'Why is my answer wrong?' }), d);
  assert.equal(res.status, 200);
  const j = await res.json();
  assert.equal(j.check, 'verified');
  assert.match(j.reply, /x = 4/);
  assert.equal(h.ai.length, 1);
  assert.ok(h.ai[0].jsonSxema);
  assert.match(h.ai[0].system, /Answer key: B/);
  assert.match(h.ai[0].system, /Student's answer: C/);
  assert.equal(h.rpc.find((r) => r.nomi === 'ai_begin')!.args.p_calls, 2);
  const save = h.rpc.find((r) => r.nomi === 'ai_save_turn')!.args;
  assert.equal(save.p_question, SAVOL.question_id);
  assert.equal(save.p_check, 'verified');
});

Deno.test('xato rejimi: birinchi javob mos emas -> bir marta qayta so\'raladi, ikkinchisi mos -> verified, tokenlar yig\'iladi', async () => {
  const { d, h } = bogliqlik({
    ai: [
      { ok: true, matn: JSON.stringify({ final_answer: 'C', explanation: 'x = 5' }), inputTokens: 1000, outputTokens: 100, stopReason: 'end_turn' },
      { ok: true, matn: JSON.stringify({ final_answer: '(B)', explanation: 'x = 4' }), inputTokens: 1200, outputTokens: 90, stopReason: 'end_turn' },
    ],
  });
  const res = await aiTutor(sorov({ mode: 'attempt', attempt_id: 7, message: 'Explain please' }), d);
  const j = await res.json();
  assert.equal(j.check, 'verified');
  assert.equal(j.reply, 'x = 4');
  assert.equal(h.ai.length, 2);
  assert.match(h.ai[1].messages.at(-1)!.content, /did not match the answer key \(B\)/);
  const fin = h.rpc.find((r) => r.nomi === 'ai_finish')!.args;
  assert.deepEqual([fin.p_input_tokens, fin.p_output_tokens, fin.p_calls, fin.p_check], [2200, 190, 2, 'verified']);
});

Deno.test('xato rejimi: ikki marta mos emas -> tushuntirish ko\'rsatilmaydi (unverified), uchinchi chaqiruv yo\'q', async () => {
  const { d, h } = bogliqlik({
    ai: [
      { ok: true, matn: JSON.stringify({ final_answer: 'C', explanation: 'x = 5 (noto\'g\'ri)' }), inputTokens: 1000, outputTokens: 100, stopReason: 'end_turn' },
      { ok: true, matn: 'JSON emas', inputTokens: 1000, outputTokens: 100, stopReason: 'end_turn' },
    ],
  });
  const res = await aiTutor(sorov({ mode: 'attempt', attempt_id: 7, message: 'Explain please' }), d);
  const j = await res.json();
  assert.equal(j.check, 'unverified');
  assert.equal(j.reply, MATN.unverified);
  assert.equal(h.ai.length, 2);
  assert.equal(h.rpc.find((r) => r.nomi === 'ai_finish')!.args.p_check, 'unverified');
});

Deno.test('xato rejimi: SPR kasr va o\'nlik teng hisoblanadi', async () => {
  const spr: SavolKonteksti = { ...SAVOL, format: 'spr', options: null, correct: { accepted: ['7/2', '3.5'] }, user_answer: '3' };
  const { d } = bogliqlik({
    kontekst: spr,
    ai: [{ ok: true, matn: JSON.stringify({ final_answer: 'x = 3.50', explanation: 'x = 7/2' }), inputTokens: 10, outputTokens: 10, stopReason: 'end_turn' }],
  });
  const j = await (await aiTutor(sorov({ mode: 'attempt', attempt_id: 7, message: 'Why?' }), d)).json();
  assert.equal(j.check, 'verified');
});

Deno.test('xato rejimi: begona yoki original bo\'lmagan urinish -> 404, provayder chaqirilmaydi', async () => {
  const { d, h } = bogliqlik({ kontekst: null });
  const res = await aiTutor(sorov({ mode: 'attempt', attempt_id: 999, message: 'Why?' }), d);
  assert.equal(res.status, 404);
  assert.equal(h.ai.length, 0);
  assert.equal(nomlar(h).includes('ai_begin'), false);
});

Deno.test('suhbat davomi: tarix promptga qo\'shiladi; begona yoki boshqa rejim suhbati -> 404', async () => {
  const tarix = { mode: 'own', attempt_id: null, messages: [{ role: 'user', content: 'What is slope?' }, { role: 'assistant', content: 'Rise over run.' }] };
  const { d, h } = bogliqlik({ tarix });
  const res = await aiTutor(sorov({ ...OWN, conversation_id: CONV }), d);
  assert.equal(res.status, 200);
  assert.deepEqual(h.ai[0].messages.map((m) => m.role), ['user', 'assistant', 'user']);
  assert.equal(h.rpc.find((r) => r.nomi === 'ai_conversation_history')!.args.p_limit, CHEGARA.tarix);

  const begona = bogliqlik({ tarix: null });
  assert.equal((await aiTutor(sorov({ ...OWN, conversation_id: CONV }), begona.d)).status, 404);
  const rejim = bogliqlik({ tarix: { ...tarix, mode: 'attempt', attempt_id: 7 } });
  assert.equal((await aiTutor(sorov({ ...OWN, conversation_id: CONV }), rejim.d)).status, 404);
  assert.equal(begona.h.ai.length + rejim.h.ai.length, 0);
});

Deno.test('provayder xatosi -> 502, ai_finish p_ok=false (kvota qaytadi), tarixga yozilmaydi', async () => {
  const { d, h } = bogliqlik({ ai: [{ ok: false, xato: 'api_529', inputTokens: 0, outputTokens: 0 }] });
  const res = await aiTutor(sorov(OWN), d);
  assert.equal(res.status, 502);
  assert.equal((await res.json()).error, 'ai_unavailable');
  const fin = h.rpc.find((r) => r.nomi === 'ai_finish')!.args;
  assert.equal(fin.p_ok, false);
  assert.equal(nomlar(h).includes('ai_save_turn'), false);
});

Deno.test('refusal -> tayyor matn (provayder javobi emas), xarajat yoziladi', async () => {
  const { d, h } = bogliqlik({ ai: [{ ok: true, matn: '', inputTokens: 300, outputTokens: 0, stopReason: 'refusal' }] });
  const j = await (await aiTutor(sorov(OWN), d)).json();
  assert.equal(j.reply, MATN.refusal);
  assert.equal(h.rpc.find((r) => r.nomi === 'ai_finish')!.args.p_ok, true);
});

Deno.test('suiiste\'mol: 20 ta ketma-ket so\'rov -> har biri ai_begin dan o\'tadi (limit va tezlik serverda), rad etilganda provayder 0 marta', async () => {
  let n = 0;
  const ok: AiNatija = { ok: true, matn: 'Slope is rise over run.', inputTokens: 500, outputTokens: 50, stopReason: 'end_turn' };
  const { d, h } = bogliqlik({ ai: Array.from({ length: 20 }, () => ok) });
  d.rpc = (nomi, args) => {
    h.rpc.push({ nomi, args });
    if (nomi === 'ai_begin') {
      n++;
      // 3 tadan keyin limit tugadi (SQL AT05 bilan bir xil xatti-harakat)
      return Promise.resolve({ data: n <= 3 ? { ok: true, usage_id: n, model: 'm', max_output_tokens: 800 } : { ok: false, error: 'quota_exceeded' }, error: null });
    }
    return Promise.resolve({ data: nomi === 'ai_save_turn' ? CONV : { ok: true }, error: null });
  };
  const statuslar: number[] = [];
  for (let i = 0; i < 20; i++) statuslar.push((await aiTutor(sorov({ mode: 'own', message: `Question ${i} about slope` }), d)).status);
  assert.equal(statuslar.filter((s) => s === 200).length, 3);
  assert.equal(statuslar.filter((s) => s === 429).length, 17);
  assert.equal(h.ai.length, 3);
});
