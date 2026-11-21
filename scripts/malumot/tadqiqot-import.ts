// npm run malumot:tadqiqot -- [to'plam papkasi]
// Codex tadqiqot to'plamini (03-tadqiqot/top-admission-tadqiqot/<sana>/data) sayt kolleksiyalariga ko'chiradi (Admission F, 2026-11-21).
// Muallif qarori (2026-11-21): to'plamdagi hamma ma'lumot ko'chiriladi, faktlar holati "muallif" (manba_iborasi shart emas).
// Qoidalar:
//  - Mavjud "tasdiqlangan" fakt hech qachon ustidan yozilmaydi; faqat "topilmadi" bo'lsa to'plamdagi qiymat qo'yiladi.
//  - Deadline faqat to'plamda tasdiqlangan sana bo'lsa YYYY-MM-DD; aks holda holat matni (countdown va kalendar yo'q).
//  - AT01, UK05, US12, US19 holatlari matnda saqlanadi.
//  - Qayta ishga tushirsa bo'ladi (idempotent): bir xil natija beradi.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PAPKA = process.argv[2] ?? join(homedir(), 'Tayanch/03-tadqiqot/top-admission-tadqiqot/2026-11-20');
const DATA = join(PAPKA, 'data');
const ILDIZ = fileURLToPath(new URL('../../src/data/topAdmission/', import.meta.url));

type Ikki = { uz: string; en: string };
interface Manba { id: string; url: string; method: string }
interface Davlat {
  code: string; name: Ikki; advisory_level: number | null; advisory_issued_on: string | null; advisory_system: string | null;
  political_stability_score: number | null; political_stability_year: number | null; political_stability_source_id: string | null;
  institution_examples: string[]; selection_note: Ikki; education_portal_url: string | null; education_source_id: string | null;
  safety_source_ids: string[]; checked_on: string; funding_record_ids: string[];
}
interface Moliya {
  id: string; slug: string; name: string; country_code: string; levels: string[]; funding_type: string;
  coverage: Ikki; key_requirements: Ikki; remaining_costs: Ikki; obligation: Ikki; source_ids: string[]; checked_on: string;
  cycle_year: number | null; cycle_status: string; deadline_date: string | null; deadline_status: string; application_url: string | null;
}

const oqi = <T>(nom: string): T[] => {
  const d = JSON.parse(readFileSync(join(DATA, nom), 'utf8'));
  return Array.isArray(d) ? d : (Object.values(d).find(Array.isArray) as T[]);
};
const manbalar = new Map(oqi<Manba>('sources.json').map((m) => [m.id, m]));
const davlatlar = oqi<Davlat>('countries.json');
const moliya = oqi<Moliya>('funding.json');

const url = (id: string | null | undefined) => {
  const m = id ? manbalar.get(id) : undefined;
  if (!m) throw new Error(`manba topilmadi: ${id}`);
  return m.url;
};
const muallif = (qiymat: string | number, source_url: string, sana: string, turi: 'muddatli' | 'barqaror' = 'muddatli') =>
  ({ qiymat, source_url, tekshirilgan_sana: sana, turi, holat: 'muallif' });
const topilmadi = (sana: string, turi: 'muddatli' | 'barqaror' = 'muddatli') => ({ tekshirilgan_sana: sana, turi, holat: 'topilmadi' });

const DAVLAT_SLUG: Record<string, string> = {
  US: 'aqsh', CA: 'kanada', GB: 'buyuk-britaniya', DE: 'germaniya', IT: 'italiya', KR: 'janubiy-koreya', PL: 'polsha',
  TR: 'turkiya', HU: 'vengriya', JP: 'yaponiya', SG: 'singapur', AU: 'avstraliya',
  FR: 'fransiya', NL: 'niderlandiya', CH: 'shveytsariya', SE: 'shvetsiya', FI: 'finlandiya', DK: 'daniya', NO: 'norvegiya',
  AT: 'avstriya', BE: 'belgiya', IE: 'irlandiya', CZ: 'chexiya', TW: 'tayvan', NZ: 'yangi-zelandiya', EU: 'yevropa-ittifoqi',
};
const VALYUTA: Record<string, string> = {
  FR: 'EUR', NL: 'EUR', CH: 'CHF', SE: 'SEK', FI: 'EUR', DK: 'DKK', NO: 'NOK', AT: 'EUR', BE: 'EUR', IE: 'EUR',
  CZ: 'CZK', TW: 'TWD', NZ: 'NZD', EU: 'EUR',
};

/** Saytda allaqachon bor grantlar: to'plam ID → mavjud slug. */
const MAVJUD: Record<string, string> = {
  US01: 'harvard-moliyaviy-yordam', US02: 'yale-moliyaviy-yordam', US03: 'princeton-moliyaviy-yordam', US04: 'mit-moliyaviy-yordam',
  US05: 'amherst-moliyaviy-yordam', US06: 'dartmouth-moliyaviy-yordam', US17: 'berea-xalqaro-stipendiya', US19: 'fulbright',
  UK05: 'chevening', IT01: 'maeci', HU01: 'stipendium-hungaricum', PL01: 'banach-nawa', TR01: 'turkiye-burslari',
  JP01: 'mext', JP02: 'mext', KR01: 'global-korea-scholarship', KR02: 'global-korea-scholarship',
  KR03: 'kaist-stipendiya', KR04: 'kaist-stipendiya', AU01: 'research-training-program',
};

/** Davlat (hukumat, hudud, konsorsium) granti; qolgani universitet granti. */
const DAVLAT_GRANTI = new Set([
  'US19', 'UK05', 'DE01', 'DE02', 'FR01', 'IT01', 'IT02', 'IE01', 'HU01', 'PL01', 'TR01', 'JP01', 'JP02', 'KR01', 'KR02',
  'EU01', 'TW01', 'DK02', 'BE01',
]);

const OGOH: Record<number, string> = {
  1: "odatiy ehtiyot choralari", 2: "ko'proq ehtiyot bo'ling", 3: "safarni qayta o'ylab ko'ring", 4: 'safar qilmang',
};
const TIZIM: Record<string, string> = { 'U.S. Department of State': 'AQSH Davlat departamenti' };

const sanaUz = (s: string) => s.split('-').reverse().join('.');

function deadlineMatni(m: Moliya): string {
  if (m.cycle_status === 'cancelled_2026') return '2026 tanlovi bekor qilingan';
  if (m.cycle_status === 'closed_2027_2028') return '2027–2028 qabuli yopilgan, keyingisi hali e\'lon qilinmagan';
  if (m.cycle_status === 'historical_award_next_call_unverified') return "Tarixiy mukofot: yangi tanlov e'lon qilinmagan";
  if (m.cycle_status === 'watchlist_local_call_required') return "O'zbekiston uchun mahalliy e'lonni kuting";
  if (m.deadline_status === 'prior_cycle_not_current') return "Oldingi qabul sanasi o'tgan, keyingisi hali e'lon qilinmagan";
  return 'Keyingi qabul sanasi hali e\'lon qilinmagan, rasmiy sahifani kuzating';
}

const DARAJA_NOM: Record<string, string> = { UG: 'Bakalavr', MS: 'Magistratura' };
const daraja = (lv: string[]) => (lv.includes('UG') && lv.includes('MS') ? 'ikkalasi' : lv.includes('UG') ? 'bakalavr' : 'magistr');

/** Bir nechta yozuv bitta grantga tushsa (MEXT, GKS, KAIST): "Bakalavr: ... Magistratura: ..." */
function birlashtir(yozuvlar: Moliya[], olish: (m: Moliya) => string): string {
  if (yozuvlar.length === 1) return olish(yozuvlar[0]);
  return yozuvlar.map((m) => `${m.levels.map((l) => DARAJA_NOM[l]).join(' va ')}: ${olish(m)}`).join(' ');
}

function tadqiqotBlok(yozuvlar: Moliya[]) {
  const b = yozuvlar[0];
  const u = url(b.source_ids[0]);
  return {
    idlar: yozuvlar.map((m) => m.id),
    qabul_yili: b.cycle_year,
    talablar: muallif(birlashtir(yozuvlar, (m) => m.key_requirements.uz), u, b.checked_on),
    qoladigan_xarajat: muallif(birlashtir(yozuvlar, (m) => m.remaining_costs.uz), u, b.checked_on),
    majburiyat: muallif(birlashtir(yozuvlar, (m) => m.obligation.uz), u, b.checked_on),
  };
}

function deadlineFakt(m: Moliya) {
  const u = m.application_url ?? url(m.source_ids[0]);
  return m.deadline_date && m.deadline_status === 'date_confirmed_time_may_be_unspecified'
    ? muallif(m.deadline_date, u, m.checked_on)
    : muallif(deadlineMatni(m), u, m.checked_on);
}

const yoz = (fayl: string, d: unknown) => writeFileSync(fayl, JSON.stringify(d, null, 2) + '\n');
const hisob = { yangiGrant: 0, boyitilganGrant: 0, yangiDavlat: 0, boyitilganDavlat: 0, toldirilganFakt: 0 };

// ---------- Grantlar ----------
const davlatGrantlari = new Map<string, string[]>();
const qoshDavlatGranti = (dav: string, slug: string) => {
  const r = davlatGrantlari.get(dav) ?? [];
  if (!r.includes(slug)) r.push(slug);
  davlatGrantlari.set(dav, r);
};

const mavjudGuruh = new Map<string, Moliya[]>();
for (const m of moliya) {
  const mavjud = MAVJUD[m.id];
  if (mavjud) { mavjudGuruh.set(mavjud, [...(mavjudGuruh.get(mavjud) ?? []), m]); continue; }
  const fayl = join(ILDIZ, 'grantlar', `${m.slug}.json`);
  const davlat = DAVLAT_SLUG[m.country_code];
  if (!davlat) throw new Error(`davlat kodi noma'lum: ${m.country_code} (${m.id})`);
  const turi = DAVLAT_GRANTI.has(m.id) ? 'davlat' : 'universitet';
  const g: Record<string, unknown> = {
    slug: m.slug,
    nom: m.name,
    turi,
    davlat,
    daraja: daraja(m.levels),
    nimani_qoplaydi: muallif(m.coverage.uz, url(m.source_ids[0]), m.checked_on),
    deadline: deadlineFakt(m),
    rasmiy_havola: m.application_url ?? url(m.source_ids[0]),
  };
  if (m.funding_type === 'need_based_full_need') g.toliq_ehtiyoj = true;
  g.tadqiqot = tadqiqotBlok([m]);
  if (existsSync(fayl)) {
    const eski = JSON.parse(readFileSync(fayl, 'utf8'));
    if (!eski.tadqiqot) throw new Error(`slug band, lekin tadqiqot yozuvi emas: ${m.slug}`);
  } else hisob.yangiGrant++;
  yoz(fayl, g);
  if (turi === 'davlat') qoshDavlatGranti(davlat, m.slug);
}

for (const [slug, yozuvlar] of mavjudGuruh) {
  const fayl = join(ILDIZ, 'grantlar', `${slug}.json`);
  const g = JSON.parse(readFileSync(fayl, 'utf8'));
  const b = yozuvlar[0];
  if (g.nimani_qoplaydi?.holat === 'topilmadi' || g.nimani_qoplaydi?.holat === 'muallif') {
    g.nimani_qoplaydi = muallif(birlashtir(yozuvlar, (m) => m.coverage.uz), url(b.source_ids[0]), b.checked_on);
    hisob.toldirilganFakt++;
  }
  if (g.deadline?.holat === 'topilmadi' || g.deadline?.holat === 'muallif') {
    g.deadline = yozuvlar.length === 1 ? deadlineFakt(b) : muallif(deadlineMatni(b), b.application_url ?? url(b.source_ids[0]), b.checked_on);
    hisob.toldirilganFakt++;
  }
  if (!g.toliq_ehtiyoj && yozuvlar.every((m) => m.funding_type === 'need_based_full_need') && g.toliq_qoplaydi?.qiymat !== true) g.toliq_ehtiyoj = true;
  g.tadqiqot = tadqiqotBlok(yozuvlar);
  yoz(fayl, g);
  hisob.boyitilganGrant++;
}

// ---------- Davlatlar ----------
const davlatBlok = (d: Davlat) => {
  const xavf = d.safety_source_ids[0];
  const blok: Record<string, unknown> = {};
  if (d.advisory_level && xavf) {
    const tizim = TIZIM[d.advisory_system ?? ''] ?? d.advisory_system ?? '';
    blok.xavfsizlik = {
      ogohlantirish: muallif(`${d.advisory_level}-daraja: ${OGOH[d.advisory_level]} (${tizim}, ${sanaUz(d.advisory_issued_on ?? d.checked_on)})`, url(xavf), d.checked_on),
      siyosiy_barqarorlik: d.political_stability_score !== null && d.political_stability_source_id
        ? muallif(`${d.political_stability_score} / 100 (Jahon banki WGI, ${d.political_stability_year})`, url(d.political_stability_source_id), d.checked_on, 'barqaror')
        : topilmadi(d.checked_on, 'barqaror'),
    };
  }
  blok.tanlov = {
    universitet_misollari: d.institution_examples,
    izoh: d.education_source_id ? muallif(d.selection_note.uz, url(d.education_source_id), d.checked_on, 'barqaror') : topilmadi(d.checked_on, 'barqaror'),
    ...(d.education_portal_url ? { portal: d.education_portal_url } : {}),
  };
  blok.tadqiqot_id = d.code;
  return blok;
};

const yangiDavlat = (slug: string, nom: string, code: string, sana: string) => ({
  slug, nom_uz: nom, chuqur_qollanma: false,
  narx: { kontrakt_yillik: topilmadi(sana), viza_yashash_summasi: topilmadi(sana), valyuta: VALYUTA[code] },
  grant: { davlat_grantlari: [] as string[] },
  til: { ingliz_tilida_dastur_bor: topilmadi(sana, 'barqaror'), odatiy_ielts: topilmadi(sana) },
  ishlash: { oqish_paytida: topilmadi(sana), bitirgandan_keyin: topilmadi(sana) },
  diplom: { togridan_togri: topilmadi(sana, 'barqaror') },
});

const sana0 = davlatlar[0].checked_on;
for (const d of [...davlatlar, { code: 'EU' } as Davlat]) {
  const slug = DAVLAT_SLUG[d.code];
  const fayl = join(ILDIZ, 'davlatlar', `${slug}.json`);
  let obj: Record<string, any>;
  if (existsSync(fayl)) {
    obj = JSON.parse(readFileSync(fayl, 'utf8'));
    if (obj.tadqiqot_id) { /* oldingi importdan */ } else hisob.boyitilganDavlat++;
  } else {
    obj = d.code === 'EU'
      ? { ...yangiDavlat(slug, "Yevropa (ko'p davlatli dasturlar)", 'EU', sana0), kop_davlatli: true }
      : yangiDavlat(slug, d.name.uz, d.code, d.checked_on);
    hisob.yangiDavlat++;
  }
  if (d.code !== 'EU') Object.assign(obj, davlatBlok(d));
  else obj.tadqiqot_id = 'EU';
  const grantlar: string[] = obj.grant.davlat_grantlari;
  for (const s of davlatGrantlari.get(slug) ?? []) if (!grantlar.includes(s)) grantlar.push(s);
  yoz(fayl, obj);
}

// ---------- Arzonroq yo'llar va ochiq manbalar (Admission G) ----------
interface Yol { id: string; country_code: string; title: string; summary: Ikki; conditions: Ikki; source_id: string; url: string; checked_on: string }
interface Resurs { id: string; levels: string[]; title: string; url: string; use: Ikki; access: string; source_id: string; checked_on: string }
const RESURS_GURUH: Record<string, string> = {
  R01: 'ariza', R02: 'ariza', R03: 'ariza', R04: 'ariza', R05: 'ariza', R06: 'ariza', R12: 'ariza', R24: 'ariza',
  R07: 'magistr', R08: 'magistr', R09: 'magistr', R10: 'magistr', R11: 'magistr', R14: 'magistr',
  R13: 'qidiruv', R15: 'qidiruv', R16: 'qidiruv', R17: 'qidiruv', R20: 'qidiruv',
  R18: 'stem', R19: 'stem',
  R21: 'xavfsizlik', R22: 'xavfsizlik', R23: 'xavfsizlik',
};
/** Yo'l sarlavhalari o'zbekcha (2-qavat matni o'zbekcha; to'plamda faqat inglizcha sarlavha bor). */
const YOL_NOMI: Record<string, string> = {
  A01: 'Davlat universitetlarida kontraktsiz o\'qish',
  A02: 'Davlat universitetlarida past kontrakt',
  A03: 'Davlat kontrakti va undan ozod qilish',
  A04: 'Hududiy ehtiyojga asoslangan yordam',
  A05: 'Chex tilidagi bepul dasturlar',
  A06: 'Yevropadan tashqari talabalar uchun kontrakt',
};
const yollar = oqi<Yol>('affordable-routes.json').map((y) => ({
  id: y.id, davlat: DAVLAT_SLUG[y.country_code], nom: YOL_NOMI[y.id] ?? y.title,
  qisqacha: muallif(y.summary.uz, y.url, y.checked_on), shartlar: muallif(y.conditions.uz, y.url, y.checked_on),
}));
const resurslar = oqi<Resurs>('resources.json').map((r) => {
  const guruh = RESURS_GURUH[r.id];
  if (!guruh) throw new Error(`resurs guruhi yo'q: ${r.id}`);
  return { id: r.id, guruh, daraja: daraja(r.levels), nom: r.title, url: r.url, nima_uchun: r.use.uz, bepul: r.access === 'free_to_read_at_check_date', tekshirilgan_sana: r.checked_on };
});
yoz(join(ILDIZ, 'arzonYollar.json'), yollar);
yoz(join(ILDIZ, 'ochiqManbalar.json'), resurslar);

console.log(JSON.stringify({ ...hisob, yollar: yollar.length, resurslar: resurslar.length }));
