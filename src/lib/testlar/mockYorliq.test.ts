// Mock imtihon klaviatura yorliqlari: tugma → amal (Mac va boshqa tizimlar).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { yorliqAniqla, macmi, yorliqYozuv, ariaYorliq, type TugmaHodisa } from '../sat/mockYorliq.ts';

const h = (key: string, o: Partial<TugmaHodisa> = {}): TugmaHodisa => ({
  key, code: /^[a-z]$/i.test(key) ? `Key${key.toUpperCase()}` : key,
  metaKey: false, ctrlKey: false, altKey: false, shiftKey: false, ...o,
});

test('Mac: Cmd+Ctrl+X/B/G', () => {
  assert.equal(yorliqAniqla(h('x', { metaKey: true, ctrlKey: true }), true), 'keyingi');
  assert.equal(yorliqAniqla(h('b', { metaKey: true, ctrlKey: true }), true), 'oldingi');
  assert.equal(yorliqAniqla(h('g', { metaKey: true, ctrlKey: true }), true), 'xarita');
});

test('Windows/Linux: Ctrl+Alt+X/B/G', () => {
  assert.equal(yorliqAniqla(h('x', { ctrlKey: true, altKey: true }), false), 'keyingi');
  assert.equal(yorliqAniqla(h('B', { ctrlKey: true, altKey: true }), false), 'oldingi');
  assert.equal(yorliqAniqla(h('g', { ctrlKey: true, altKey: true }), false), 'xarita');
});

test('boshqa tizim kombinatsiyasi o\'z platformasida ishlamaydi', () => {
  assert.equal(yorliqAniqla(h('x', { ctrlKey: true, altKey: true }), true), null);
  assert.equal(yorliqAniqla(h('x', { metaKey: true, ctrlKey: true }), false), null);
});

test('faqat bitta modifikator, Shift yoki ortiqcha modifikator: yorliq emas', () => {
  assert.equal(yorliqAniqla(h('x', { metaKey: true }), true), null);
  assert.equal(yorliqAniqla(h('x', { ctrlKey: true }), false), null);
  assert.equal(yorliqAniqla(h('x', { metaKey: true, ctrlKey: true, shiftKey: true }), true), null);
  assert.equal(yorliqAniqla(h('x', { metaKey: true, ctrlKey: true, altKey: true }), true), null);
  assert.equal(yorliqAniqla(h('x', { ctrlKey: true, altKey: true, metaKey: true }), false), null);
});

test('oddiy harflar (variant tanlash) yorliq emas', () => {
  for (const k of ['a', 'b', 'c', 'd', 'x', 'g']) assert.equal(yorliqAniqla(h(k), true), null);
});

test('boshqa harflar yorliq emas', () => {
  assert.equal(yorliqAniqla(h('q', { metaKey: true, ctrlKey: true }), true), null);
  assert.equal(yorliqAniqla(h('f', { metaKey: true, ctrlKey: true }), true), null);
});

test('Alt bilan key o\'zgarsa ham code bo\'yicha aniqlanadi', () => {
  assert.equal(yorliqAniqla({ key: '≈', code: 'KeyX', metaKey: false, ctrlKey: true, altKey: true, shiftKey: false }, false), 'keyingi');
});

test('code bo\'lmasa key ishlatiladi', () => {
  assert.equal(yorliqAniqla({ key: 'x', metaKey: true, ctrlKey: true, altKey: false, shiftKey: false }, true), 'keyingi');
});

test('F1 faqat modifikatorsiz', () => {
  assert.equal(yorliqAniqla(h('F1'), true), 'yorliqlar');
  assert.equal(yorliqAniqla(h('F1'), false), 'yorliqlar');
  assert.equal(yorliqAniqla(h('F1', { shiftKey: true }), false), null);
  assert.equal(yorliqAniqla(h('F2'), false), null);
});

test('platforma va yozuvlar', () => {
  assert.equal(macmi('MacIntel'), true);
  assert.equal(macmi('macOS'), true);
  assert.equal(macmi('iPad'), true);
  assert.equal(macmi('Win32'), false);
  assert.equal(macmi('Linux x86_64'), false);
  assert.equal(yorliqYozuv('X', true), '⌘ Cmd + Control + X');
  assert.equal(yorliqYozuv('X', false), 'Ctrl + Alt + X');
  assert.equal(ariaYorliq('G'), 'Meta+Control+G Control+Alt+G');
});
