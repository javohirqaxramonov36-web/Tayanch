import type { APIRoute } from 'astro';
import { kursBosqichlari, kursHavola, kursMavzuOchiq, kursMavzulari, kursOchiq, kursPreview, mavzuManzili } from '../lib/sat/kursKatalog';
import { yol } from '../lib/yol';

export const GET: APIRoute = ({ site }) => {
  // Bo‘limlarning qoralama kirishlari va kurs preview sahifalari indekslanmaydi.
  const yollar = new Set(['/uz/', '/uz/deadline/', '/uz/manbalar/'].map(yol));
  if (kursOchiq && !kursPreview) {
    yollar.add(kursHavola());
    for (const mavzu of kursMavzulari.filter((m) => kursMavzuOchiq(m.id))) {
      const asos = mavzuManzili(mavzu);
      yollar.add(kursHavola(`${mavzu.domainSlug}/`));
      yollar.add(kursHavola(asos));
      for (const { slug } of kursBosqichlari) {
        yollar.add(kursHavola(`${asos}${slug}/dars/`));
        yollar.add(kursHavola(`${asos}${slug}/mashq/`));
      }
      if (mavzu.counts.mini_test) yollar.add(kursHavola(`${asos}mini-test/`));
    }
  }
  const urls = [...yollar].map((path) => `<url><loc>${new URL(path, site)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
