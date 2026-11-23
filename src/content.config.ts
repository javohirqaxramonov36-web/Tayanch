// Astro content collections (Astro 7 content layer). Hozircha faqat Top Admission ma'lumotlari (Admission D-seriya, Q1).
// Ma'lumot: src/data/topAdmission/<kolleksiya>/<slug>.json. Sxema: src/lib/topAdmission/sxema.ts.
// Fakt maydoni noto'g'ri bo'lsa build to'xtaydi (xabarda kolleksiya, fayl va maydon).
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { davlatSxema, grantSxema, universitetSxema } from './lib/topAdmission/sxema.ts';

const papka = (nom: string) => glob({ pattern: '*.json', base: `./src/data/topAdmission/${nom}` });

export const collections = {
  davlatlar: defineCollection({ loader: papka('davlatlar'), schema: davlatSxema(reference) }),
  grantlar: defineCollection({ loader: papka('grantlar'), schema: grantSxema(reference) }),
  universitetlar: defineCollection({ loader: papka('universitetlar'), schema: universitetSxema(reference) }),
};
