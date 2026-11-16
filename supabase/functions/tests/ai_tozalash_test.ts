// AI kirishini tozalash, CB aniqlash va javob tekshiruvi (sof funksiyalar).
import assert from 'node:assert/strict';
import { harfniAjrat, javobMosmi, modelJsonOl, sprSon } from '../_shared/aiJavob.ts';
import { cbMatnmi, normallashtir, shaxsiyniTozala, variantlarBormi } from '../_shared/aiTozalash.ts';

Deno.test('shaxsiyniTozala: email, havola, telefon, karta, JSHSHIR, pasport, @taxallus, ism', () => {
  const k = 'Ismim Dilnoza. mail: d.k@mail.uz, t.me/dilnoza, @dilnoza_k, +998901234567, (90) 123-45-67, ' +
    '8600 1234 5678 9012, 31234567890123, AA1234567, https://example.com/x';
  const { matn, soni } = shaxsiyniTozala(k);
  for (const yoq of ['Dilnoza', 'd.k@mail.uz', 't.me/dilnoza', '@dilnoza_k', '901234567', '123-45-67', '8600', '31234567890123', 'AA1234567', 'example.com']) {
    assert.equal(matn.includes(yoq), false, `${yoq} qoldi: ${matn}`);
  }
  assert.ok(soni >= 9);
});

Deno.test('shaxsiyniTozala: SAT matematikasi buzilmaydi', () => {
  const k = 'If f(x) = 3x^2 - 12x + 7 and x = 1250, what is 2/3 of 4,500? The set is 2, 4, 6, 8, 10, 12, 14.';
  assert.equal(shaxsiyniTozala(k).matn, k);
});

Deno.test('normallashtir: yashirin belgilar va bo\'shliqlar', () => {
  assert.equal(normallashtir('  a​\u0000b \t c\r\n\n\n\nd  '), 'ab c\n\nd');
});

Deno.test('cbMatnmi: rad etiladigan va o\'tadigan holatlar', () => {
  assert.equal(variantlarBormi('A) 1 B) 2 C) 3 D) 4'), true);
  assert.equal(variantlarBormi('Plan A) start B) later'), false);
  assert.equal(cbMatnmi('Solve: what is 5% of 300? A) 10 B) 15 C) 20 D) 25'), 'pasted_question');
  assert.equal(cbMatnmi('Which choice most logically completes the text? Researchers found that the plant ______.'), 'pasted_question');
  assert.equal(cbMatnmi('Give me prediction questions for the next SAT'), 'leaked_material');
  assert.equal(cbMatnmi('These are real SAT questions from the March exam'), 'leaked_material');
  assert.equal(cbMatnmi('© 2026 College Board. ' + 'Passage text about a river. '.repeat(12)), 'official_material');
  // O'tadi
  assert.equal(cbMatnmi('How do I use Bluebook?'), null);
  assert.equal(cbMatnmi('What does College Board say about calculators?'), null);
  assert.equal(cbMatnmi('I keep picking choice A on transition questions. Why?'), null);
  assert.equal(cbMatnmi('Explain how to find the vertex of a parabola.'), null);
});

Deno.test('javob tekshiruvi: harf, SPR son, JSON', () => {
  assert.equal(harfniAjrat('B'), 'B');
  assert.equal(harfniAjrat('(c)'), 'C');
  assert.equal(harfniAjrat('Choice D'), 'D');
  assert.equal(harfniAjrat('B) 4'), 'B');
  assert.equal(harfniAjrat('Because'), null);
  assert.equal(sprSon('7/2'), 3.5);
  assert.equal(sprSon('.5'), 0.5);
  assert.equal(sprSon('x = -4'), -4);
  assert.equal(sprSon('1/0'), null);
  assert.equal(sprSon('four'), null);
  assert.equal(javobMosmi('mcq', { choice: 'B' }, 'b.'), true);
  assert.equal(javobMosmi('mcq', { choice: 'B' }, 'C'), false);
  assert.equal(javobMosmi('spr', { accepted: ['1/2'] }, '0.5'), true);
  assert.equal(javobMosmi('spr', { accepted: ['1/2'] }, '0.55'), false);
  assert.equal(javobMosmi('spr', { accepted: [] }, '1'), false);
  assert.deepEqual(modelJsonOl('```json\n{"final_answer": "A", "explanation": "ok"}\n```'), { final_answer: 'A', explanation: 'ok' });
  assert.equal(modelJsonOl('{"final_answer": "A", "explanation": "  "}'), null);
  assert.equal(modelJsonOl('nothing'), null);
});
