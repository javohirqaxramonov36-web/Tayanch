// Tayanch: Astro sozlamalari.
// Sayt https://javohirqaxramonov36-web.github.io/Tayanch/ ostida ochiladi.
// GitHub Pages yo'li harf katta-kichikligiga sezgir: base "/Tayanch".
// O'z domenga o'tganda faqat `site` va `base` o'zgaradi.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://javohirqaxramonov36-web.github.io',
  base: '/Tayanch',
  trailingSlash: 'always',
  output: 'static',
  // Eski SAT mashq sahifalari (PR #7) yangi mashq bo'limiga ko'chdi (2026-11-05).
  redirects: {
    '/uz/sat/mashq/test/': '/Tayanch/uz/sat/mashq/',
    '/uz/sat/mashq/bank/': '/Tayanch/uz/sat/mashq/',
    '/uz/sat/vosita/natijalar/': '/Tayanch/uz/sat/mashq/xatolar/',
  },
});
