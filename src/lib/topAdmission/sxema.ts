// Top Admission kolleksiyalari sxemasi (Admission D-seriya, Q1). Zod v4 (`astro/zod`).
// Bir xil sxema ikki joyda ishlaydi:
//  - src/content.config.ts: build paytida (ref = astro:content `reference`);
//  - scripts/malumot/*.ts va testlar: node'da (ref = oddiy slug qatori, bog'lanishni skript o'zi tekshiradi).
// Xato bo'lsa Astro build to'xtaydi va xabarda kolleksiya, fayl (entry) va maydon yo'li ko'rinadi.
import { z } from 'astro/zod';
import { sanaTogri } from '../muddat.ts';
import { FAKT_HOLATLARI, FAKT_TURLARI, IELTS_HOLATLARI } from './fakt.ts';

type Ref = (kolleksiya: 'davlatlar' | 'grantlar' | 'universitetlar') => z.ZodType;

/** node'da: havola = bo'sh bo'lmagan slug. */
export const oddiyRef: Ref = () => z.string().min(1);

const HTTPS = /^https:\/\//;

/**
 * Umumiy "Fakt": qiymat + manba. Holat "qoralama"/"tasdiqlangan" bo'lsa qiymat, source_url, manba_iborasi, tekshirilgan_sana majburiy.
 * "muallif" bo'lsa manba_iborasi shart emas (tadqiqot to'plamidan, muallif tasdig'i bilan; Admission F).
 */
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
      if (f.holat !== 'muallif' && bosh(f.manba_iborasi)) xato('manba_iborasi', `holat "${f.holat}" bo'lsa majburiy (rasmiy sahifadagi aynan ibora)`);
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
      /**
       * Ixtiyoriy Fakt (E1). `davlat_grantlari` bo'sh bo'lsa: rasmiy manbalarda o'zbek fuqarosi uchun davlat granti
       * topilmagani (source_url = tekshirilgan rasmiy sahifa). Kartada qat'iy matn + sana + manba chiqadi (davlatTaqqos.ts).
       * Eski oddiy matn ham o'tadi (mavjud fayllar buzilmasin), lekin saytda ko'rsatilmaydi.
       */
      izoh: z.union([z.string(), matnFakt]).optional(),
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
    /** Ixtiyoriy (Admission F): bir nechta davlatdagi dastur (masalan Erasmus Mundus). Taqqoslash sahifasida ko'rsatilmaydi. */
    kop_davlatli: z.boolean().optional(),
    /** Ixtiyoriy (Admission F, tadqiqot to'plami 2026-11-20): xavfsizlik va siyosiy barqarorlik. */
    xavfsizlik: z.strictObject({
      ogohlantirish: matnFakt,
      siyosiy_barqarorlik: matnFakt,
    }).optional(),
    /** Ixtiyoriy (Admission F): STEM uchun universitet misollari, tanlov izohi va rasmiy ta'lim portali. */
    tanlov: z.strictObject({
      universitet_misollari: z.array(z.string().min(1)),
      izoh: matnFakt,
      portal: z.string().regex(HTTPS, "https:// bilan boshlanishi kerak").optional(),
    }).optional(),
    /** Tadqiqot to'plamidagi davlat kodi (masalan "DE"); yillik yangilashda moslash uchun. */
    tadqiqot_id: z.string().optional(),
  });
}

/**
 * Grantning to'liq qo'llanmasi (E4, ixtiyoriy). Bo'lsa, `/uz/top-admission/grantlar/<slug>/` sahifasi yaratiladi.
 * Ro'yxatlar Fakt'lardan iborat: saytda faqat "tasdiqlangan" bandlar chiqadi, qolganlari soni "tekshirilmoqda" bilan.
 * Matnli kontent faqat Fakt ichida (rasmiy ibora bilan). Oddiy matn maydonlari: bosqich `nom` (qisqa nom),
 * FAQ `savol` (rasmiy FAQ'dagi savol) va havola `nom`. Konventsiya: docs/rejalar/admission-e-holat.md (E4).
 */
export const qollanmaSxema = z.strictObject({
  kim_topshira_oladi: z.array(matnFakt),
  nimani_qoplaydi_batafsil: z.array(matnFakt),
  hujjatlar: z.array(matnFakt),
  bosqichlar: z.array(z.strictObject({
    nom: z.string().min(1),
    tavsif: matnFakt.optional(),
    sana: matnFakt,
  })),
  ariza_yoli: matnFakt,
  rasmiy_faq: z.array(z.strictObject({ savol: z.string().min(1), javob: matnFakt })).optional(),
  rasmiy_havolalar: z.array(z.strictObject({
    nom: z.string().min(1),
    url: z.string().regex(HTTPS, "https:// bilan boshlanishi kerak"),
  })),
});

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
    /**
     * Ixtiyoriy (E1): yordam to'liq ehtiyojga asoslangan (full need-based). Kartada oila hissasi izohi chiqadi;
     * bunday grantga "to'liq qoplaydi" (toliq_qoplaydi: true) QO'YILMAYDI (muallif qarori, 2026-11-20).
     */
    toliq_ehtiyoj: z.boolean().optional(),
    /** Ixtiyoriy (E4): to'liq qo'llanma bo'limi. */
    qollanma: qollanmaSxema.optional(),
    /**
     * Ixtiyoriy (Admission F): tadqiqot to'plamidan (03-tadqiqot/top-admission-tadqiqot) qo'shimcha ma'lumot.
     * Kartada "Batafsil" ichida chiqadi. `idlar`: to'plamdagi yozuv ID'lari (masalan "JP01"), `qabul_yili`: tegishli qabul yili.
     */
    tadqiqot: z.strictObject({
      idlar: z.array(z.string().min(1)).min(1),
      qabul_yili: z.number().int().nullable(),
      talablar: matnFakt,
      qoladigan_xarajat: matnFakt,
      majburiyat: matnFakt,
    }).optional(),
  }).superRefine((g, ctx) => {
    if (g.toliq_ehtiyoj && g.toliq_qoplaydi?.qiymat === true) {
      ctx.addIssue({ code: 'custom', path: ['toliq_qoplaydi'], message: "to'liq ehtiyojga asoslangan yordamga \"to'liq qoplaydi\" qo'yilmaydi" });
    }
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
    // ---- E1 (ixtiyoriy maydonlar; mavjud fayllar buzilmaydi) ----
    /**
     * Rasmiy eng past xalqaro bakalavr kontrakti, yillik, `valyuta` da. Buyuk Britaniya va Janubiy Koreyada bo'lsa,
     * filtr xarajati "kamida" = shu + davlat kartasidagi viza yashash summasi (universitetMoslik.ts, KAMIDA_DAVLATLAR).
     */
    kontrakt_eng_past: sonFakt.optional(),
    /**
     * IELTS talabining turi. Yo'q bo'lsa "minimum" deb olinadi (min_ielts). "tavsiya": ielts_tavsiya fakti;
     * "talab_qilinmaydi": dalil `imtihonlar` faktida; "topilmadi": filtrda "Ma'lumot tekshirilmoqda".
     */
    ielts_holati: z.enum(IELTS_HOLATLARI as [string, ...string[]]).optional(),
    /** Rasmiy tavsiya etilgan (recommended / competitive) IELTS bali. Saralashga ta'sir qilmaydi. */
    ielts_tavsiya: faktSxema(z.number().min(0).max(9)).optional(),
    foundation_kerak: faktSxema(z.enum(['ha', "yo'q", 'dasturga_qarab'])).optional(),
    /** Yordam to'liq ehtiyojga asoslangan: kartada oila hissasi izohi (grantSxema'dagi bilan bir xil). */
    toliq_ehtiyoj: z.boolean().optional(),
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
