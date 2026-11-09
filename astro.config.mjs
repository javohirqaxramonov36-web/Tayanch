// Tayanch: Astro sozlamalari.
// Sayt https://javohirqaxramonov36-web.github.io/Tayanch/ ostida ochiladi.
// GitHub Pages yo'li harf katta-kichikligiga sezgir: base "/Tayanch".
// O'z domenga o'tganda faqat `site` va `base` o'zgaradi.
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://javohirqaxramonov36-web.github.io',
  base: '/Tayanch',
  trailingSlash: 'always',
  output: 'static',
  // Hisob (Supabase Auth). Faqat ochiq qiymatlar: loyiha URL'i va ochiq (publishable/anon) kalit.
  // Build paytida sahifaga yoziladi. Qiymat bo'lmasa sayt baribir quriladi, hisob sahifalari
  // "hali ishlamaydi" deydi. Qayerdan beriladi: docs/lokal-ish-tartibi.md ("Supabase o'zgaruvchilari").
  env: {
    schema: {
      PUBLIC_SUPABASE_URL: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_SUPABASE_ANON_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
});
