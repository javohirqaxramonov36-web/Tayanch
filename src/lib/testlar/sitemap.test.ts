// scripts/sitemap.mjs: qaysi sahifa sitemap'ga kiradi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { sitemapYoli } from '../../../scripts/sitemap.mjs';

test('oddiy sahifa yo\'li', () => {
  assert.equal(sitemapYoli('<html><head></head></html>', join('uz', 'deadline', 'index.html')), '/uz/deadline/');
  assert.equal(sitemapYoli('<html></html>', 'index.html'), '/');
});

test('noindex sahifa kirmaydi', () => {
  assert.equal(sitemapYoli('<meta name="robots" content="noindex">', join('uz', 'sat', 'index.html')), null);
  assert.equal(sitemapYoli('<meta name="robots" content="noindex, nofollow">', join('uz', 'a', 'index.html')), null);
});

test("yo'naltiruvchi sahifa kirmaydi", () => {
  assert.equal(sitemapYoli('<meta http-equiv="refresh" content="0; url=/uz/">', 'index.html'), null);
});
