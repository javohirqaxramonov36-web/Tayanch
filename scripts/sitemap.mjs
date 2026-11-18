// Build tugagach dist/ dan sitemap.xml va robots.txt yasaydi (Astro integratsiyasi, tashqi paketsiz).
// Sitemap'ga faqat indekslanadigan sahifa kiradi: <meta name="robots" content="noindex"> (qoralama,
// namuna, hisob sahifalari), yo'naltiruvchi sahifa (meta refresh, masalan ildiz "/") va 404 chiqmaydi.
// Shuning uchun ro'yxat qo'lda yuritilmaydi: sahifa noindex bo'lsa, o'zi tushib qoladi.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const NOINDEX = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i;
const REFRESH = /<meta\s+http-equiv=["']refresh["']/i;

async function htmlFayllar(papka) {
  const natija = [];
  for (const e of await readdir(papka, { withFileTypes: true })) {
    const yol = join(papka, e.name);
    if (e.isDirectory()) natija.push(...(await htmlFayllar(yol)));
    else if (e.name === 'index.html') natija.push(yol);
  }
  return natija;
}

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function sitemapYoli(html, nisbiy) {
  if (NOINDEX.test(html) || REFRESH.test(html)) return null;
  const qism = nisbiy.split(sep).slice(0, -1).join('/');
  return qism ? `/${qism}/` : '/';
}

export default function sitemap() {
  let site;
  let base = '/';
  return {
    name: 'tayanch-sitemap',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site;
        base = config.base;
      },
      'astro:build:done': async ({ dir, logger }) => {
        if (!site) {
          logger.warn('site berilmagan: sitemap.xml yasalmadi');
          return;
        }
        const dist = fileURLToPath(dir);
        const ildiz = new URL(base, site);
        const manzillar = [];
        for (const fayl of await htmlFayllar(dist)) {
          const yol = sitemapYoli(await readFile(fayl, 'utf8'), relative(dist, fayl));
          if (yol) manzillar.push(new URL(yol.slice(1), ildiz).href);
        }
        manzillar.sort();
        const body = manzillar.map((u) => `  <url><loc>${xml(u)}</loc></url>`).join('\n');
        await writeFile(join(dist, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
        await writeFile(join(dist, 'robots.txt'),
          `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', ildiz).href}\n`);
        logger.info(`sitemap.xml: ${manzillar.length} sahifa, robots.txt yozildi`);
      },
    },
  };
}
