// Tayanch: Astro sozlamalari.
// Sayt https://tayanchedu.uz/ ildizida ochiladi (2026-11-16 gacha github.io/Tayanch/ edi).
// Eski /Tayanch/... manzillari 404 sahifasida yangi yo'lga yo'naltiriladi (src/pages/404.astro).
// Boshqa joyda build uchun (masalan Cloudflare Pages, PR #169): SITE_URL=https://tayanch.pages.dev, kerak bo'lsa BASE_PATH.
// Berilmasa (yoki bo'sh bo'lsa) tayanchedu.uz ildizi.
import { defineConfig, envField } from 'astro/config';
// Build oxirida dist/sitemap.xml va dist/robots.txt (noindex sahifalarsiz). Qoidasi scripts/sitemap.mjs da.
import sitemap from './scripts/sitemap.mjs';

const site = process.env.SITE_URL?.trim() || 'https://tayanchedu.uz';
const base = process.env.BASE_PATH?.trim() || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap()],
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
