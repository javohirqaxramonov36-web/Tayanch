// Top Admission ma'lumotini o'qish, sxema bilan tekshirish va faktlarni yig'ish (malumot:tekshir, malumot:tasdiq va testlar uchun).
// Papka tuzilishi: <ildiz>/davlatlar/*.json, <ildiz>/grantlar/*.json, <ildiz>/universitetlar/*.json, <ildiz>/kurslar.json.
// Standart ildiz src/data/topAdmission; sinovda boshqa papka beriladi (--papka).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KOLLEKSIYALAR, kurslarSxema, oddiyRef, type KolleksiyaNomi } from '../../src/lib/topAdmission/sxema.ts';
import type { Fakt } from '../../src/lib/topAdmission/fakt.ts';

export const REPO = fileURLToPath(new URL('../../', import.meta.url));
export const STANDART_ILDIZ = join(REPO, 'src/data/topAdmission');

export interface Yozuv { kolleksiya: KolleksiyaNomi; fayl: string; slug: string; data: Record<string, unknown> }
export interface SxemaXato { fayl: string; maydon: string; xabar: string }
export interface FaktQator { fayl: string; maydon: string; fakt: Fakt }

const sxemalar = {
  davlatlar: KOLLEKSIYALAR.davlatlar(oddiyRef),
  grantlar: KOLLEKSIYALAR.grantlar(oddiyRef),
  universitetlar: KOLLEKSIYALAR.universitetlar(oddiyRef),
};

const nisbiy = (p: string) => relative(REPO, p) || p;

/** Bitta JSON hujjatni sxema bilan tekshiradi. Xatolar: fayl + maydon yo'li (masalan narx.kontrakt_yillik.source_url). */
export function hujjatniTekshir(kolleksiya: KolleksiyaNomi, data: unknown, fayl: string): SxemaXato[] {
  const r = sxemalar[kolleksiya].safeParse(data);
  if (r.success) return [];
  return r.error.issues.map((i) => ({ fayl, maydon: i.path.join('.') || '(ildiz)', xabar: i.message }));
}

/** Papkadagi hamma hujjatni o'qiydi va tekshiradi; slug = fayl nomi va havolalar (bog'lanish) ham tekshiriladi. */
export function malumotniYig(ildiz: string = STANDART_ILDIZ): { yozuvlar: Yozuv[]; xatolar: SxemaXato[] } {
  const yozuvlar: Yozuv[] = [];
  const xatolar: SxemaXato[] = [];
  for (const kolleksiya of Object.keys(KOLLEKSIYALAR) as KolleksiyaNomi[]) {
    const papka = join(ildiz, kolleksiya);
    if (!existsSync(papka)) continue;
    for (const nom of readdirSync(papka).filter((f) => f.endsWith('.json')).sort()) {
      const yol = join(papka, nom);
      const fayl = nisbiy(yol);
      let data: unknown;
      try { data = JSON.parse(readFileSync(yol, 'utf8')); } catch (e) {
        xatolar.push({ fayl, maydon: '(JSON)', xabar: (e as Error).message });
        continue;
      }
      xatolar.push(...hujjatniTekshir(kolleksiya, data, fayl));
      const d = (data ?? {}) as Record<string, unknown>;
      const slug = typeof d.slug === 'string' ? d.slug : '';
      if (slug && slug !== nom.replace(/\.json$/, '')) xatolar.push({ fayl, maydon: 'slug', xabar: `fayl nomi bilan bir xil bo'lishi kerak (${nom})` });
      yozuvlar.push({ kolleksiya, fayl, slug, data: d });
    }
  }
  // Havolalar: grant -> davlat/universitet, davlat -> grantlar, universitet -> davlat.
  const bor = (k: KolleksiyaNomi, s: unknown) => typeof s !== 'string' || yozuvlar.some((y) => y.kolleksiya === k && y.slug === s);
  for (const y of yozuvlar) {
    const tekshir = (k: KolleksiyaNomi, maydon: string, s: unknown) => {
      if (!bor(k, s)) xatolar.push({ fayl: y.fayl, maydon, xabar: `"${String(s)}" ${k} kolleksiyasida yo'q` });
    };
    if (y.kolleksiya === 'davlatlar') {
      const g = (y.data.grant as { davlat_grantlari?: unknown[] } | undefined)?.davlat_grantlari ?? [];
      g.forEach((s, i) => tekshir('grantlar', `grant.davlat_grantlari.${i}`, s));
    } else if (y.kolleksiya === 'grantlar') {
      tekshir('davlatlar', 'davlat', y.data.davlat);
      if (y.data.universitet !== undefined) tekshir('universitetlar', 'universitet', y.data.universitet);
    } else {
      tekshir('davlatlar', 'davlat', y.data.davlat);
    }
  }
  const kurs = join(ildiz, 'kurslar.json');
  if (existsSync(kurs)) {
    try {
      const r = kurslarSxema.safeParse(JSON.parse(readFileSync(kurs, 'utf8')));
      if (!r.success) xatolar.push(...r.error.issues.map((i) => ({ fayl: nisbiy(kurs), maydon: i.path.join('.') || '(ildiz)', xabar: i.message })));
    } catch (e) {
      xatolar.push({ fayl: nisbiy(kurs), maydon: '(JSON)', xabar: (e as Error).message });
    }
  }
  return { yozuvlar, xatolar };
}

const faktmi = (v: unknown): v is Fakt =>
  !!v && typeof v === 'object' && !Array.isArray(v) && 'holat' in v && 'turi' in v;

/** Hujjat ichidagi hamma faktlarni maydon yo'li bilan qaytaradi (masalan narx.kontrakt_yillik, qollanma.bosqichlar.2.sana). */
export function faktlarniYig(yozuvlar: Yozuv[]): FaktQator[] {
  const natija: FaktQator[] = [];
  const yur = (v: unknown, yol: string[], fayl: string) => {
    if (faktmi(v)) { natija.push({ fayl, maydon: yol.join('.'), fakt: v }); return; }
    // Ro'yxatlar (masalan qollanma.hujjatlar, E4): maydon yo'lida JSON indeksi, 0 dan (sxema xatolari bilan bir xil).
    if (Array.isArray(v)) { v.forEach((ich, i) => yur(ich, [...yol, String(i)], fayl)); return; }
    if (v && typeof v === 'object') {
      for (const [k, ich] of Object.entries(v)) yur(ich, [...yol, k], fayl);
    }
  };
  for (const y of yozuvlar) yur(y.data, [], y.fayl);
  return natija;
}

/** --papka <yo'l> argumenti (sinov uchun), bo'lmasa standart ildiz. */
export function ildizArg(argv: string[] = process.argv.slice(2)): string {
  const i = argv.indexOf('--papka');
  return i >= 0 && argv[i + 1] ? resolve(process.cwd(), argv[i + 1]) : STANDART_ILDIZ;
}

/** Markdown jadval katagi: | va qator tashlashni xavfsiz qiladi. */
export const katak = (s: unknown) => String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
