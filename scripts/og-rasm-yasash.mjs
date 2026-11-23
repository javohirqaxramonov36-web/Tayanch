// Ulashish rasmlari (og:image, 1200×630) yasash.
// Kirish: AI yaratgan xom fotolar (repoga qo'shilmaydi), masalan <xom>/navigator.png.
// Chiqish: public/og/<slug>.webp. Bo'lim nomi rasm ustiga shu skript bilan qo'yiladi (qavat raqami yozilmaydi):
// shrift Onest (node_modules), ranglar src/styles/tokens.css dan (qorong'i mavzu qiymatlari).
// Ishlatish: node scripts/og-rasm-yasash.mjs <xom-papka> [slug ...]
// Talab: Google Chrome (headless skrinshot) va sharp (Astro bilan keladi).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const ildiz = resolve(import.meta.dirname, '..');
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const KENGLIK = 1200;
const BALANDLIK = 630;

// Faqat bo'lim nomi (2026-11-19: saytda "N-qavat" yozuvi yo'q).
const rasmlar = {
  navigator: { nom: 'Navigator' },
  'top-admission': { nom: 'Top Admission' },
  sat: { nom: 'SAT<sup>®</sup> prep' },
  ielts: { nom: 'IELTS prep' },
  eyuf: { nom: 'EYUF prep' },
};
const shrift = pathToFileURL(createRequire(import.meta.url).resolve('@fontsource-variable/onest/index.css')).href;

const [xomPapka, ...tanlangan] = process.argv.slice(2);
if (!xomPapka) {
  console.error('Ishlatish: node scripts/og-rasm-yasash.mjs <xom-papka> [slug ...]');
  process.exit(1);
}
const sluglar = tanlangan.length ? tanlangan : Object.keys(rasmlar);
const ish = mkdtempSync(join(tmpdir(), 'tayanch-og-'));
const url = (p) => pathToFileURL(join(ildiz, p)).href;

for (const slug of sluglar) {
  const r = rasmlar[slug];
  const xom = resolve(xomPapka, `${slug}.png`);
  if (!r || !existsSync(xom)) {
    console.error(`O'tkazildi: ${slug} (ma'lumot yoki ${xom} yo'q)`);
    continue;
  }
  const html = `<!doctype html><html data-mavzu="qorongi"><head><meta charset="utf-8">
<link rel="stylesheet" href="${shrift}">
<link rel="stylesheet" href="${url('src/styles/tokens.css')}">
<style>
  html, body { margin: 0; width: ${KENGLIK}px; height: ${BALANDLIK}px; overflow: hidden; }
  body {
    font-family: var(--shrift);
    background: var(--fon) url('${pathToFileURL(xom).href}') right center / cover no-repeat;
  }
  .karta {
    position: absolute; left: var(--b-10); top: var(--b-10);
    background: var(--fon); color: var(--matn);
    border-radius: var(--r-orta);
    padding: var(--b-5) var(--b-6);
    display: flex; flex-direction: column; gap: var(--b-1);
    max-width: 420px;
  }
  .brend { font-size: 20px; font-weight: 700; letter-spacing: var(--oraliq-kichik-sarlavha); }
  .nom { font-size: 44px; line-height: 1.05; font-weight: 700; letter-spacing: var(--oraliq-sarlavha); }
  .nom sup { font-size: 0.4em; vertical-align: 1.2em; font-weight: 600; }
</style></head><body>
<div class="karta">
  <span class="brend">Tayanch</span>
  <span class="nom">${r.nom}</span>
</div></body></html>`;
  const htmlYol = join(ish, `${slug}.html`);
  const png = join(ish, `${slug}.png`);
  writeFileSync(htmlYol, html);
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--window-size=${KENGLIK},${BALANDLIK}`, '--allow-file-access-from-files',
    '--virtual-time-budget=3000', `--screenshot=${png}`, pathToFileURL(htmlYol).href,
  ], { stdio: 'ignore' });
  const chiqish = join(ildiz, 'public/og', `${slug}.webp`);
  await sharp(png).resize(KENGLIK, BALANDLIK, { fit: 'cover' }).webp({ quality: 80, effort: 6 }).toFile(chiqish);
  console.log(`${slug}: ${chiqish} (${Math.round(statSync(chiqish).size / 1024)} KB)`);
}
