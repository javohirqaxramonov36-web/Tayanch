// Sozlama: muhit o'zgaruvchilari, kalit rejimi, yetishmayotgan nomlar (qiymatlar soxta).
import assert from 'node:assert/strict';
import { bearerToken, corsSarlavhalari } from '../_shared/http.ts';
import { inpayKalitRejimi, sozlamaniOl, STANDART_ORIGINLAR, STANDART_SAYT_URL, yetishmaydi } from '../_shared/sozlama.ts';

const muhit = (o: Record<string, string>) => (nomi: string) => o[nomi];

Deno.test('sozlamaniOl: standart sayt va originlar, oxirgi / olib tashlanadi', () => {
  const s = sozlamaniOl(muhit({ SUPABASE_URL: 'https://sinov.supabase.co/', SUPABASE_SERVICE_ROLE_KEY: 'eski-kalit' }));
  assert.equal(s.supabaseUrl, 'https://sinov.supabase.co');
  assert.equal(s.serviceKey, 'eski-kalit');
  assert.equal(s.saytUrl, STANDART_SAYT_URL);
  assert.deepEqual(s.originlar, [...STANDART_ORIGINLAR]);
});

Deno.test('sozlamaniOl: SUPABASE_SECRET_KEYS (JSON) eski kalitdan ustun; JSON bo\'lmasa eskisi', () => {
  const yangi = sozlamaniOl(muhit({ SUPABASE_SECRET_KEYS: '{"default": "yangi-kalit"}', SUPABASE_SERVICE_ROLE_KEY: 'eski-kalit' }));
  assert.equal(yangi.serviceKey, 'yangi-kalit');
  const buzuq = sozlamaniOl(muhit({ SUPABASE_SECRET_KEYS: 'json-emas', SUPABASE_SERVICE_ROLE_KEY: 'eski-kalit' }));
  assert.equal(buzuq.serviceKey, 'eski-kalit');
});

Deno.test('sozlamaniOl: TOLOV_ORIGINLAR va SAYT_URL', () => {
  const s = sozlamaniOl(muhit({ TOLOV_ORIGINLAR: 'https://a.invalid, https://b.invalid', SAYT_URL: 'https://a.invalid/x/' }));
  assert.deepEqual(s.originlar, ['https://a.invalid', 'https://b.invalid']);
  assert.equal(s.saytUrl, 'https://a.invalid/x');
});

Deno.test('inpayKalitRejimi va yetishmaydi: faqat nomlar, v1 kaliti rad', () => {
  assert.equal(inpayKalitRejimi('sk_test_x'), 'test');
  assert.equal(inpayKalitRejimi('sk_live_x'), 'live');
  assert.equal(inpayKalitRejimi('v1-kalit'), null);
  const s = sozlamaniOl(muhit({ SUPABASE_URL: 'https://sinov.supabase.co', INPAY_SECRET_KEY: 'v1-kalit' }));
  const nomlar = yetishmaydi(s, ['supabaseUrl', 'serviceKey', 'inpaySecretKey']);
  assert.deepEqual(nomlar, ['SUPABASE_SECRET_KEYS | SUPABASE_SERVICE_ROLE_KEY', 'INPAY_SECRET_KEY (sk_test_ yoki sk_live_ emas)']);
  assert.equal(nomlar.join().includes('v1-kalit'), false);
});

Deno.test('http: Bearer token va CORS', () => {
  assert.equal(bearerToken('Bearer abc.def'), 'abc.def');
  assert.equal(bearerToken('bearer  abc'), 'abc');
  assert.equal(bearerToken('Basic abc'), null);
  assert.equal(bearerToken(null), null);
  assert.deepEqual(corsSarlavhalari(null, ['https://a.invalid']), {});
  assert.equal(corsSarlavhalari('https://b.invalid', ['https://a.invalid']), null);
  assert.equal(corsSarlavhalari('https://a.invalid', ['https://a.invalid'])?.['Access-Control-Allow-Origin'], 'https://a.invalid');
});
