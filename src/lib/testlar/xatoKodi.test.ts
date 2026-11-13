// P23: xato kodi faqat xavfsiz texnik nom bo'lib qoladi (email, token, server matni chiqmaydi).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authXatoKodi, kodBilan, xatoKodi } from '../xatoKodi.ts';

test('xatoKodi: texnik nom o\'tadi, boshqasi nomalum', () => {
  assert.equal(xatoKodi('delete_failed'), 'delete_failed');
  assert.equal(xatoKodi('HTTP_404'), 'http_404');
  assert.equal(xatoKodi('sinov@example.com'), 'nomalum');
  assert.equal(xatoKodi('Database error deleting user'), 'nomalum');
  assert.equal(xatoKodi('a'.repeat(41)), 'nomalum');
  assert.equal(xatoKodi(undefined), 'nomalum');
});

test('authXatoKodi: code, tarmoq, status', () => {
  assert.equal(authXatoKodi({ name: 'AuthApiError', code: 'invalid_credentials', status: 400 }), 'invalid_credentials');
  assert.equal(authXatoKodi({ name: 'AuthRetryableFetchError', status: 0 }), 'network_error');
  assert.equal(authXatoKodi(new TypeError('Failed to fetch')), 'network_error');
  assert.equal(authXatoKodi({ name: 'AuthApiError', status: 429 }), 'http_429');
  assert.equal(authXatoKodi(null), 'nomalum');
});

test('kodBilan: matn oxiriga kod', () => {
  assert.equal(kodBilan("Hisob o'chirilmadi.", 'delete_failed'), "Hisob o'chirilmadi. (kod: delete_failed)");
});
