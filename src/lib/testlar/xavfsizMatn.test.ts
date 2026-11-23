// Formula belgilari: P05 savollari \( \) va \[ \], eski matnlar $ va $$ ishlatadi (UX sinovi, 2026-11-19).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formulaBormi } from '../sat/xavfsizMatn.ts';

test('formula: \\( \\) va \\[ \\] ham taniladi', () => {
  assert.equal(formulaBormi(String.raw`The function \(f(x) = -3x + b\) is defined.`), true);
  assert.equal(formulaBormi(String.raw`\[y = x^2 - 3\]\[y = 2x + 5\]`), true);
  assert.equal(formulaBormi('Solve $3x + 5 = 20$.'), true);
  assert.equal(formulaBormi('$$x^2$$'), true);
});

test('formula: oddiy matn va \\$ pul belgisi formula emas', () => {
  assert.equal(formulaBormi('It costs 5 dollars.'), false);
  assert.equal(formulaBormi(String.raw`It costs \$5 and \$7.`), false);
  assert.equal(formulaBormi('(x, y) is a point'), false);
});
