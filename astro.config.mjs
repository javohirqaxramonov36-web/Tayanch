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
  integrations: process.env.TAYANCH_IELTS_PREVIEW === '1' ? [{
    name: 'tayanch-ielts-preview',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        for (const [path, file] of Object.entries({
          'mashq': 'dashboard',
          'mashq/reading': 'reading',
          'mashq/listening': 'listening',
          'mashq/writing': 'writing',
          'mashq/speaking': 'speaking',
          'vosita/natijalar': 'natijalar',
          'vosita/xato-daftari': 'xato-daftari',
        })) {
          injectRoute({ pattern: `/uz/ielts/${path}`, entrypoint: `./src/preview/ielts/${file}.astro` });
        }
      },
    },
  }] : [],
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
