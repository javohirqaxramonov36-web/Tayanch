import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  boshProgress,
  progressTogrimi,
  javobniYoz,
  mahorat,
  streak,
  badges,
} from './trenajyor.ts';
test('Buzilgan progress tekshiriladi', () => {
  assert(progressTogrimi(boshProgress()));
  assert(
    !progressTogrimi({
      version: 1,
      history: [],
      reviews: null,
      days: [],
      daily: {},
    }),
  );
});
test('Xatolar 1,3,7 kundan so‘ng qaytadi', () => {
  let p = javobniYoz(boshProgress(), 'a', 'kub-yoyilmasi', false, 0);
  assert.equal(p.reviews.a.due, 86400000);
  p = javobniYoz(p, 'a', 'kub-yoyilmasi', true, 86400000);
  assert.equal(p.reviews.a.due, 4 * 86400000);
  p = javobniYoz(p, 'a', 'kub-yoyilmasi', true, 4 * 86400000);
  assert.equal(p.reviews.a.due, 11 * 86400000);
  p = javobniYoz(p, 'a', 'kub-yoyilmasi', true, 11 * 86400000);
  assert(!p.reviews.a);
});
test('Mahorat oxirgi20, badge noyob10', () => {
  let p = boshProgress();
  for (let i = 0; i < 25; i++)
    p = javobniYoz(p, String(i), 'kub-yoyilmasi', i >= 5, i);
  assert.equal(mahorat(p, 'kub-yoyilmasi').percent, 100);
  assert.equal(mahorat(p, 'kub-yoyilmasi').count, 20);
  assert.equal(badges(p)[0].count, 20);
});
test('Toshkent kuni va kechagi streak', () => {
  const p = boshProgress();
  p.days = ['2026-11-19', '2026-11-20'];
  assert.equal(streak(p, Date.parse('2026-11-21T12:00:00+05:00')), 2);
  assert.equal(streak(p, Date.parse('2026-11-22T12:00:00+05:00')), 0);
});
test('Parallel progressdagi javoblar yo‘qolmaydi', async () => {
  const { progressniBirlashtir } = await import('./trenajyor.ts');
  const a = javobniYoz(boshProgress(), 'a', 'son-ketma-ketligi', false, 1);
  const b = javobniYoz(boshProgress(), 'b', 'son-ketma-ketligi', true, 2);
  const merged = progressniBirlashtir(a, b);
  assert.equal(merged.history.length, 2);
  assert(merged.reviews.a);
  assert.equal(progressniBirlashtir(merged, merged).history.length, 2);
});
test('Adaptiv tanlov faqat tekshirilgan qiyinlikdan foydalanadi', async () => {
  const { mosSavolniTanla } = await import('./trenajyor.ts');
  const questions = [1, 2, 3].map(difficulty => ({
    id: String(difficulty), type: 'test', verified: true,
    difficulty, difficulty_verified: true,
  }));
  assert.equal(mosSavolniTanla(questions, boshProgress())?.difficulty, 2);
  let weak = boshProgress();
  let strong = boshProgress();
  for (let i = 0; i < 5; i++) {
    weak = javobniYoz(weak, String(i), 'test', false, i);
    strong = javobniYoz(strong, String(i), 'test', true, i);
  }
  assert.equal(mosSavolniTanla(questions, weak)?.difficulty, 1);
  assert.equal(mosSavolniTanla(questions, strong)?.difficulty, 3);
  questions[2].difficulty_verified = false;
  assert.equal(mosSavolniTanla(questions, strong)?.difficulty, 2);
});
