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
});
