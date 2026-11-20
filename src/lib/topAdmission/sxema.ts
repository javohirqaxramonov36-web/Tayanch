// Top Admission kolleksiyalari sxemasi (Admission D-seriya, Q1). Zod v4 (`astro/zod`).
// Bir xil sxema ikki joyda ishlaydi:
//  - src/content.config.ts: build paytida (ref = astro:content `reference`);
//  - scripts/malumot/*.ts va testlar: node'da (ref = oddiy slug qatori, bog'lanishni skript o'zi tekshiradi).
// Xato bo'lsa Astro build to'xtaydi va xabarda kolleksiya, fayl (entry) va maydon yo'li ko'rinadi.
import { z } from 'astro/zod';
import { sanaTogri } from '../muddat.ts';
import { FAKT_HOLATLARI, FAKT_TURLARI } from './fakt.ts';

type Ref = (kolleksiya: 'davlatlar' | 'grantlar' | 'universitetlar') => z.ZodType;

/** node'da: havola = bo'sh bo'lmagan slug. */
export const oddiyRef: Ref = () => z.string().min(1);

const HTTPS = /^https:\/\//;

/** Umumiy "Fakt": qiymat + manba. Holat "qoralama"/"tasdiqlangan" bo'lsa qiymat, source_url, manba_iborasi, tekshirilgan_sana majburiy. */
export function faktSxema<T extends z.ZodType>(qiymat: T) {
  return z
    .strictObject({
      qiymat: qiymat.nullable().optional(),
      source_url: z.string().optional(),
      manba_iborasi: z.string().optional(),
      tekshirilgan_sana: z.string().optional(),
      turi: z.enum(FAKT_TURLARI as [string, ...string[]]),
      holat: z.enum(FAKT_HOLATLARI as [string, ...string[]]),
    })
    .superRefine((f, ctx) => {
      const xato = (maydon: string, message: string) => ctx.addIssue({ code: 'custom', path: [maydon], message });
      if (f.source_url && !HTTPS.test(f.source_url)) xato('source_url', "https:// bilan boshlanishi kerak");
      if (f.tekshirilgan_sana !== undefined && f.tekshirilgan_sana !== '' && !sanaTogri(f.tekshirilgan_sana)) {
        xato('tekshirilgan_sana', "YYYY-MM-DD shaklidagi haqiqiy sana bo'lishi kerak");
      }
      if (f.holat === 'topilmadi') return;
      const bosh = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
      if (bosh(f.qiymat)) xato('qiymat', `holat "${f.holat}" bo'lsa majburiy`);
      if (bosh(f.source_url)) xato('source_url', `holat "${f.holat}" bo'lsa majburiy`);
      if (bosh(f.manba_iborasi)) xato('manba_iborasi', `holat "${f.holat}" bo'lsa majburiy (rasmiy sahifadagi aynan ibora)`);
      if (bosh(f.tekshirilgan_sana)) xato('tekshirilgan_sana', `holat "${f.holat}" bo'lsa majburiy`);
    });
}

const matnFakt = faktSxema(z.string());
const sonFakt = faktSxema(z.number().nonnegative());
const haYoqFakt = faktSxema(z.boolean());
const umumiyFakt = faktSxema(z.union([z.string(), z.number(), z.boolean()]));
const valyuta = z.string().regex(/^[A-Z]{3}$/, 'ISO 4217 kod (masalan USD, GBP, KRW)');
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "kichik lotin harflar, raqam va '-'");

export function davlatSxema(ref: Ref) {
  return z.strictObject({
    slug,
    nom_uz: z.string().min(1),
    chuqur_qollanma: z.boolean(),
    chuqur_qollanma_havola: z.string().optional(),
    narx: z.strictObject({
      kontrakt_yillik: sonFakt,
      viza_yashash_summasi: sonFakt,
      valyuta,
    }),
    grant: z.strictObject({
      davlat_grantlari: z.array(ref('grantlar')),
      izoh: z.string().optional(),
    }),
    til: z.strictObject({
      ingliz_tilida_dastur_bor: haYoqFakt,
      odatiy_ielts: sonFakt,
    }),
    ishlash: z.strictObject({
      oqish_paytida: umumiyFakt,
      bitirgandan_keyin: umumiyFakt,
    }),
    diplom: z.strictObject({
      togridan_togri: faktSxema(z.enum(['ha', "yo'q", 'dasturga_qarab'])),
      tayyorlov_nomi: matnFakt.optional(),
    }),
  });
}

export function grantSxema(ref: Ref) {
  return z.strictObject({
    slug,
    nom: z.string().min(1),
    turi: z.enum(['davlat', 'universitet']),
    davlat: ref('davlatlar'),
    universitet: ref('universitetlar').optional(),
    daraja: z.enum(['bakalavr', 'magistr', 'ikkalasi']),
    nimani_qoplaydi: matnFakt,
    /** Ixtiyoriy: "to'liq qoplaydi" filtri faqat shu fakt rasmiy sahifada aniq yozilgan bo'lsa (Q3, Q8). */
    toliq_qoplaydi: haYoqFakt.optional(),
    /** qiymat YYYY-MM-DD bo'lsa saralanadi; boshqa matn (masalan "yil davomida") ro'yxat oxirida. */
    deadline: matnFakt,
    rasmiy_havola: z.string().regex(HTTPS, "https:// bilan boshlanishi kerak"),
  });
}

export function universitetSxema(ref: Ref) {
  return z.strictObject({
    slug,
    nom: z.string().min(1),
    davlat: ref('davlatlar'),
    imtihonlar: matnFakt,
    min_ielts: sonFakt,
    yillik_xarajat: sonFakt,
    valyuta,
    ariza_tolovi: sonFakt,
    tolovdan_ozod_qilish: umumiyFakt,
    xalqaro_yordam_turi: matnFakt,
    /** qiymat YYYY-MM-DD bo'lsa saralanadi. */
    deadline: matnFakt,
  });
}

/** src/data/topAdmission/kurslar.json. Bo'sh fayl (manba_url "", kurslar {}) ham to'g'ri: sahifalar narx saralashini o'chiradi. */
export const kurslarSxema = z
  .strictObject({
    manba_url: z.string(),
    manba_nomi: z.string().optional(),
    sana: z.string(),
    izoh: z.string().optional(),
    kurslar: z.record(valyuta, z.number().positive()),
  })
  .superRefine((k, ctx) => {
    if (k.manba_url && !HTTPS.test(k.manba_url)) ctx.addIssue({ code: 'custom', path: ['manba_url'], message: "https:// bilan boshlanishi kerak" });
    if (k.sana && !sanaTogri(k.sana)) ctx.addIssue({ code: 'custom', path: ['sana'], message: 'YYYY-MM-DD' });
    if (Object.keys(k.kurslar).length > 0 && (!k.manba_url || !k.sana)) {
      ctx.addIssue({ code: 'custom', path: ['manba_url'], message: "kurs bor bo'lsa manba_url va sana majburiy" });
    }
  });

/** Kolleksiya nomi → papka (src/data/topAdmission/<papka>/*.json) va sxema. */
export const KOLLEKSIYALAR = {
  davlatlar: davlatSxema,
  grantlar: grantSxema,
  universitetlar: universitetSxema,
} as const;
export type KolleksiyaNomi = keyof typeof KOLLEKSIYALAR;
