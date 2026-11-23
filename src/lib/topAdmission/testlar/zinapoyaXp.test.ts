// Admission D-seriya, Q5: Ariza zinapoyasi XP mijoz mantig'i. Supabase o'rniga SOXTA mijoz.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ADMISSION_XP_QADAMLAR } from '../../../data/topAdmissionXp.ts';
import { xpYozuvi, zinapoyaQadami, zinapoyaXpYuboruvchi, type XpRpcMijoz } from '../zinapoyaXp.ts';
import { zinapoyalar } from '../../../data/topAdmissionDarslar/zinapoyalar.ts';

function soxta(o: { kirgan?: boolean; javob?: () => Promise<{ data: unknown; error: unknown }> } = {}) {
  const chaqiruvlar: string[] = [];
  let kirgan = o.kirgan ?? true;
  const m: XpRpcMijoz = {
    kirganmi: async () => kirgan,
    chaqir: async (q) => { chaqiruvlar.push(q); return o.javob ? o.javob() : { data: 10, error: null }; },
  };
  return { m, chaqiruvlar, kir: () => { kirgan = true; } };
}

test('qadamlar: zinapoya id lari server ruxsat ro\'yxati bilan bir xil', () => {
  assert.deepEqual(zinapoyalar.map((z) => zinapoyaQadami(z.id)).sort(), [...ADMISSION_XP_QADAMLAR].sort());
  assert.equal(zinapoyaQadami('boshqa'), null);
});

test('birinchi to\'g\'ri terish: bitta RPC, 10 XP', async () => {
  const s = soxta();
  const yubor = zinapoyaXpYuboruvchi(() => s.m);
  assert.equal(await yubor('ucas'), 10);
  assert.deepEqual(s.chaqiruvlar, ['zinapoya:ucas']);
});

test('takroriy chaqiriq faqat bir marta yuboriladi (ketma-ket va parallel)', async () => {
  const s = soxta();
  const yubor = zinapoyaXpYuboruvchi(() => s.m);
  const [a, b] = await Promise.all([yubor('commonapp'), yubor('commonapp')]);
  assert.equal(a, 10);
  assert.equal(b, null);
  assert.equal(await yubor('commonapp'), null);
  assert.equal(await yubor('commonapp'), null);
  assert.deepEqual(s.chaqiruvlar, ['zinapoya:commonapp']);
  assert.equal(await yubor('turkiye'), 10);
  assert.deepEqual(s.chaqiruvlar, ['zinapoya:commonapp', 'zinapoya:turkiye']);
});

test('loginsiz: RPC chaqirilmaydi, xato yo\'q; keyin kirsa yuboriladi', async () => {
  const s = soxta({ kirgan: false });
  const yubor = zinapoyaXpYuboruvchi(() => s.m);
  assert.equal(await yubor('ucas'), null);
  assert.equal(await yubor('ucas'), null);
  assert.deepEqual(s.chaqiruvlar, []);
  s.kir();
  assert.equal(await yubor('ucas'), 10);
  assert.deepEqual(s.chaqiruvlar, ['zinapoya:ucas']);
});

test('Supabase sozlanmagan (mijoz yo\'q): jim null', async () => {
  const yubor = zinapoyaXpYuboruvchi(() => null);
  assert.equal(await yubor('ucas'), null);
});

test('xato jim yutiladi va keyingi urinishga ruxsat beriladi', async () => {
  let n = 0;
  const s = soxta({ javob: async () => (++n === 1 ? { data: null, error: { message: 'network' } } : { data: 0, error: null }) });
  const yubor = zinapoyaXpYuboruvchi(() => s.m);
  assert.equal(await yubor('ucas'), null);
  assert.equal(await yubor('ucas'), 0); // server: avval olingan yoki kunlik chegara
  assert.equal(await yubor('ucas'), null);
  assert.equal(s.chaqiruvlar.length, 2);
});

test('istisno tashlansa ham xato chiqmaydi', async () => {
  const m: XpRpcMijoz = { kirganmi: async () => { throw new Error('x'); }, chaqir: async () => ({ data: 10, error: null }) };
  const yubor = zinapoyaXpYuboruvchi(() => m);
  assert.equal(await yubor('ucas'), null);
});

test('noma\'lum zinapoya: yuborilmaydi', async () => {
  const s = soxta();
  assert.equal(await zinapoyaXpYuboruvchi(() => s.m)('misol'), null);
  assert.deepEqual(s.chaqiruvlar, []);
});

test('xpYozuvi: faqat berilgan XP', () => {
  assert.equal(xpYozuvi(10), '+10 XP olindi');
  assert.equal(xpYozuvi(0), '');
  assert.equal(xpYozuvi(null), '');
});
