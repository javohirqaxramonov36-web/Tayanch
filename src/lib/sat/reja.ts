// SAT haftalik o'quv rejasi (P13): sof funksiyalar, AI yo'q. Qoidalar: docs/reja-algoritmi.md (o'zgarsa ikkalasi birga).
// Brauzerda ham, node testida ham ishlaydi (src/lib/testlar/reja.test.ts). Ekrandagi matn inglizcha (SAT bo'limi).
// Ball oshishi hisoblanmaydi va va'da qilinmaydi: reja faqat vaqtni taqsimlaydi.
import { savolTaksonomiya, type SavolBolim } from '../../data/satTaksonomiya.ts';

/** Qoidalar o'zgarsa oshiriladi (study_plans.rules_version, brauzer yozuvi). */
export const QOIDA_VERSIYA = 1;
/** Bitta o'qish bloki, daqiqa (Tayanch tanlovi). */
export const BLOK_DAQIQA = 45;
export const MAKS_HAFTA = 16;
/** Sana yo'q bo'lsa: shuncha haftalik sikl. */
export const SIKL_HAFTA = 4;
export const SOAT_MIN = 2;
export const SOAT_MAX = 20;
export const ZAIF_MAKS = 6;
/** Zaif skill taklifi: kamida shuncha javob va shu ulushdan kam to'g'ri. */
export const ZAIF_MIN_JAVOB = 5;
export const ZAIF_CHEGARA = 0.6;
export const ZAIF_TAKLIF = 3;
/** Darsdagi xato daftari: moduldagi kamida shuncha xato. */
export const ZAIF_DARS_XATO = 2;
/** Kvota kaliti (plans.limits, P19 docs/tarif-qoidalari.md): har saqlash (tuzish, qayta tuzish, hisobga ko'chirish) bittadan. */
export const KVOTA_KALIT = 'plan_rebuilds';

export type Bosqich = 'diagnostic' | 'foundations' | 'topic' | 'timed' | 'review' | 'final';
export const BOSQICHLAR: readonly Bosqich[] = ['diagnostic', 'foundations', 'topic', 'timed', 'review', 'final'];
export const BOSQICH_NOMI: Record<Bosqich, string> = {
  diagnostic: 'Diagnostic',
  foundations: 'Foundations',
  topic: 'Topic practice',
  timed: 'Timed practice',
  review: 'Mistakes and review',
  final: 'Final prep',
};

export type TopshiriqTuri = 'bank' | 'dars' | 'lugat' | 'rasmiy-test' | 'tahlil' | 'takrorlash';

export interface RejaKirish {
  /** YYYY-MM-DD (Toshkent sanasi) */
  bugun: string;
  /** YYYY-MM-DD yoki null (sana yo'q) */
  imtihon: string | null;
  maqsad: number | null;
  /** Haftalik soat, SOAT_MIN–SOAT_MAX */
  soat: number;
  /** Zaif skill nomlari (taksonomiyadan), ko'pi bilan ZAIF_MAKS */
  zaif: string[];
}

export interface Topshiriq {
  id: string;
  /** 1 dan boshlanadi */
  hafta: number;
  /** YYYY-MM-DD */
  kun: string;
  bosqich: Bosqich;
  tur: TopshiriqTuri;
  nom: string;
  /** Ichki yo'l, base'siz: '/uz/sat/...' (sahifada yol() bilan) */
  ref: string;
  daqiqa: number;
  /** ISO vaqt yoki null */
  bajarildi: string | null;
}

export interface Hafta {
  raqam: number;
  boshi: string;
  oxiri: string;
  bosqich: Bosqich;
  oqishKunlari: string[];
}

export interface Reja {
  qoidaVersiya: number;
  kirish: RejaKirish;
  haftalar: Hafta[];
  topshiriqlar: Topshiriq[];
  /** Imtihongacha jami hafta (rejadagidan ko'p bo'lishi mumkin) */
  jamiHafta: number;
}

// ---------- Sana ----------
const KUN = 86400000;
const sanaMs = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const msSana = (t: number) => new Date(t).toISOString().slice(0, 10);
export const kunQosh = (s: string, n: number) => msSana(sanaMs(s) + n * KUN);
export const kunFarqi = (a: string, b: string) => Math.round((sanaMs(b) - sanaMs(a)) / KUN);
export const sanaTogri = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && msSana(sanaMs(s)) === s;

// ---------- Hajm qoidalari ----------
export const soatniTozala = (soat: number) => Math.min(SOAT_MAX, Math.max(SOAT_MIN, Math.round(Number.isFinite(soat) ? soat : SOAT_MIN)));
/** Haftalik bloklar soni: soat × 60 / 45, yaxlitlangan. */
export const haftaBloklari = (soat: number) => Math.round((soatniTozala(soat) * 60) / BLOK_DAQIQA);
/** O'qish kunlari: ≤3 soat → 3, ≤6 → 4, ≤10 → 5, ko'p → 6. Haftada kamida 1 dam kuni. */
export function oqishKunlariSoni(soat: number): number {
  const s = soatniTozala(soat);
  return s <= 3 ? 3 : s <= 6 ? 4 : s <= 10 ? 5 : 6;
}
/** 7 kunlik oynada o'qish kunlari o'rni: round(i × 7 / D). */
export const kunOrinlari = (d: number) => Array.from({ length: d }, (_, i) => Math.round((i * 7) / d));
export const blokNarxi = (t: Pick<Topshiriq, 'daqiqa'>) => Math.max(1, Math.ceil(t.daqiqa / BLOK_DAQIQA));

/** Imtihongacha haftalar soni (sana bo'lmasa null). */
export function haftalarSoni(bugun: string, imtihon: string | null): number | null {
  if (!imtihon) return null;
  return Math.max(1, Math.ceil(kunFarqi(bugun, imtihon) / 7));
}

/** Bosqichlar ketma-ketligi. n: imtihongacha haftalar (sanasiz: SIKL_HAFTA). */
export function bosqichlar(n: number, sanasiz: boolean): Bosqich[] {
  if (sanasiz) return ['diagnostic', 'foundations', 'topic', 'timed'];
  if (n <= 1) return ['final'];
  if (n === 2) return ['diagnostic', 'final'];
  if (n === 3) return ['diagnostic', 'topic', 'final'];
  const m = n - 2;
  const r = m >= 4 ? 1 : 0;
  const m2 = m - r;
  let orta: Bosqich[];
  if (m2 === 1) orta = ['topic'];
  else if (m2 === 2) orta = ['topic', 'timed'];
  else {
    const f = Math.max(1, Math.round(m2 * 0.35));
    const tm = Math.max(1, Math.round(m2 * 0.3));
    const tp = Math.max(1, m2 - f - tm);
    const f2 = m2 - tm - tp;
    orta = [...Array(f2).fill('foundations'), ...Array(tp).fill('topic'), ...Array(tm).fill('timed')];
  }
  return ['diagnostic', ...orta, ...(r ? (['review'] as Bosqich[]) : []), 'final'];
}

// ---------- Skill va darslar ----------
export function skillBolimi(skill: string): SavolBolim | null {
  for (const b of ['rw', 'math'] as SavolBolim[]) for (const s of Object.values(savolTaksonomiya[b])) if (s.includes(skill)) return b;
  return null;
}
export const hammaSkilllar = (): string[] => (['rw', 'math'] as SavolBolim[]).flatMap((b) => Object.values(savolTaksonomiya[b]).flat());

export interface DarsHavola { modul: string; nomi: string; ref: string; skilllar: string[] }
/** Mavjud interaktiv darslar va ular yopadigan skill'lar (Tayanch moslashtirishi, rasmiy emas). */
export const DARSLAR: readonly DarsHavola[] = [
  { modul: 'rw-xato', nomi: 'Find the error', ref: '/uz/sat/qollanma/reading-writing/xatoni-toping/', skilllar: ['Boundaries', 'Form, Structure, and Sense'] },
  { modul: 'rw-dalil', nomi: 'Mark the evidence', ref: '/uz/sat/qollanma/reading-writing/dalil/', skilllar: ['Command of Evidence: Textual'] },
  { modul: 'rw-otish', nomi: 'Transition words', ref: '/uz/sat/qollanma/reading-writing/otish-sozlari/', skilllar: ['Transitions'] },
  { modul: 'rw-lugat', nomi: 'Vocabulary in context', ref: '/uz/sat/qollanma/reading-writing/lugat-kontekstda/', skilllar: ['Words in Context'] },
  { modul: 'hajm', nomi: 'Volume lab', ref: '/uz/sat/qollanma/math/hajm/', skilllar: ['Area and volume'] },
  { modul: 'grafik', nomi: 'Function graphs', ref: '/uz/sat/qollanma/math/grafik/', skilllar: ['Nonlinear functions'] },
  { modul: 'aylana', nomi: 'Unit circle', ref: '/uz/sat/qollanma/math/birlik-aylana/', skilllar: ['Right triangles and trigonometry'] },
  { modul: 'statistika', nomi: 'Statistics', ref: '/uz/sat/qollanma/math/statistika/', skilllar: ['One-variable data: Distributions and measures of center and spread'] },
];

export const YOLLAR = {
  bank: '/uz/sat/mashq/bank/',
  lugat: '/uz/sat/mashq/lugat/',
  takrorlash: '/uz/sat/vosita/takrorlash/',
  rasmiyTest: '/uz/sat/vosita/rasmiy-testlar/',
} as const;

/** Topshiriq havolasi: faqat ichki '/uz/...' yo'l, ixtiyoriy so'rov qatori bilan. SQL check bilan bir xil (save_study_plan). */
export const REF_NAQSH = /^\/uz\/[a-z0-9\/-]*\/(\?[A-Za-z0-9=&%|,._~-]*)?$/;
export const refTogri = (r: unknown): r is string => typeof r === 'string' && r.length <= 300 && !r.includes('//') && REF_NAQSH.test(r);

// ---------- Zaif tomon takliflari ----------
export interface SkillStat { section: string; skill: string; answered: number; correct: number }

/** Hisobdagi javoblar: kamida 5 javob va 60% dan kam to'g'ri; eng pasti birinchi, 3 tagacha. */
export function zaifTaklifStat(stat: readonly SkillStat[]): string[] {
  const bor = new Set(hammaSkilllar());
  return stat
    .filter((s) => bor.has(s.skill) && s.answered >= ZAIF_MIN_JAVOB && s.correct / s.answered < ZAIF_CHEGARA)
    .sort((a, b) => a.correct / a.answered - b.correct / b.answered || b.answered - a.answered || a.skill.localeCompare(b.skill))
    .slice(0, ZAIF_TAKLIF)
    .map((s) => s.skill);
}

/** Darslar xato daftari (tayanch:sat-xato-daftari): moduldagi xato ≥ 2 → dars skill'lari; ko'p xatoli modul birinchi. */
export function zaifTaklifDaftar(xatolar: readonly { modul: string }[]): string[] {
  const son = new Map<string, number>();
  for (const x of xatolar) son.set(x.modul, (son.get(x.modul) ?? 0) + 1);
  const tartib = DARSLAR.map((d, i) => ({ d, i, n: son.get(d.modul) ?? 0 }))
    .filter((x) => x.n >= ZAIF_DARS_XATO)
    .sort((a, b) => b.n - a.n || a.i - b.i);
  return [...new Set(tartib.flatMap((x) => x.d.skilllar))].slice(0, ZAIF_TAKLIF);
}

// ---------- Topshiriq shablonlari ----------
type Shablon = Omit<Topshiriq, 'id' | 'hafta' | 'kun' | 'bosqich' | 'bajarildi'>;
type Qiyinlik = 'easy' | 'medium' | 'hard';
interface BankSozlama { section: SavolBolim; skills?: string[]; qiyinlik?: Qiyinlik[]; rejim: 'practice' | 'timed'; hajm: 10 | 20; qayta?: boolean }

const BOLIM_NOMI: Record<SavolBolim, string> = { rw: 'Reading and Writing', math: 'Math' };

/** Savol banki havolasi: bank sahifasi shu parametrlarni o'qib filtrni oldindan tanlaydi (Start'ni foydalanuvchi bosadi). */
export function bankRef(b: BankSozlama): string {
  const p: string[] = [`section=${b.section}`];
  if (b.skills?.length) p.push(`skills=${b.skills.map(encodeURIComponent).join('|')}`);
  if (b.qiyinlik?.length) p.push(`difficulty=${b.qiyinlik.join(',')}`);
  if (b.qayta) p.push('retry=1');
  p.push(`mode=${b.rejim}`, `size=${b.hajm}`);
  return `${YOLLAR.bank}?${p.join('&')}`;
}

function bank(b: BankSozlama): Shablon {
  const qism = b.skills?.length === 1 ? b.skills[0] : BOLIM_NOMI[b.section];
  const qiy = b.qiyinlik?.length ? ` (${b.qiyinlik.join(' and ')})` : '';
  const nom = b.qayta
    ? `Question bank: redo ${BOLIM_NOMI[b.section]} questions you missed`
    : b.rejim === 'timed'
      ? `Timed set: ${b.hajm} ${qism} questions`
      : `Question bank: ${b.hajm} ${qism} questions${qiy}`;
  return { tur: 'bank', nom, ref: bankRef(b), daqiqa: BLOK_DAQIQA };
}
const dars = (d: DarsHavola): Shablon => ({ tur: 'dars', nom: `Lesson: ${d.nomi} (all steps and exercises)`, ref: d.ref, daqiqa: BLOK_DAQIQA });
const LUGAT: Shablon = { tur: 'lugat', nom: 'Vocabulary cards: 20 words', ref: YOLLAR.lugat, daqiqa: BLOK_DAQIQA };
const TAKRORLASH: Shablon = { tur: 'takrorlash', nom: 'Mistake log: review the cards due today', ref: YOLLAR.takrorlash, daqiqa: BLOK_DAQIQA };
const RASMIY: Shablon = {
  tur: 'rasmiy-test',
  nom: 'Full practice test in the Bluebook™ app, then log your score in the Test tracker',
  ref: YOLLAR.rasmiyTest,
  daqiqa: 180,
};
const TAHLIL: Shablon = { tur: 'tahlil', nom: 'Test tracker: sort your mistakes by skill and update your weak areas', ref: YOLLAR.rasmiyTest, daqiqa: BLOK_DAQIQA };

// ---------- Rejani tuzish ----------
export function kirishniTozala(k: RejaKirish): RejaKirish {
  const bor = new Set(hammaSkilllar());
  const imtihon = k.imtihon && sanaTogri(k.imtihon) && kunFarqi(k.bugun, k.imtihon) > 0 ? k.imtihon : null;
  const maqsad = typeof k.maqsad === 'number' && k.maqsad >= 400 && k.maqsad <= 1600 ? Math.round(k.maqsad) : null;
  return { bugun: k.bugun, imtihon, maqsad, soat: soatniTozala(k.soat), zaif: [...new Set(k.zaif.filter((s) => bor.has(s)))].slice(0, ZAIF_MAKS) };
}

/** Haftaning o'qish kunlari: imtihon kuni va undan oldingi kun dam (sig'masa hafta bo'sh qoladi). */
export function haftaKunlari(boshi: string, d: number, imtihon: string | null): string[] {
  return kunOrinlari(d).map((o) => kunQosh(boshi, o)).filter((k) => !imtihon || kunFarqi(k, imtihon) >= 2);
}

export function rejaTuz(kirishXom: RejaKirish): Reja {
  const k = kirishniTozala(kirishXom);
  const sanasiz = !k.imtihon;
  const jamiHafta = sanasiz ? SIKL_HAFTA : (haftalarSoni(k.bugun, k.imtihon) as number);
  const tartib = bosqichlar(jamiHafta, sanasiz).slice(0, MAKS_HAFTA);
  const bloklar = haftaBloklari(k.soat);
  const d = oqishKunlariSoni(k.soat);

  // Zaif skill'lar bo'lim bo'yicha; bo'sh bo'lsa bo'lim aralash to'plamlar.
  const zaif = k.zaif.map((s) => ({ s, b: skillBolimi(s)! }));
  // Darslar navbati: zaif skill darslari avval, keyin qolganlari; har dars rejada bir marta.
  const zaifDarslar = DARSLAR.filter((x) => x.skilllar.some((s) => k.zaif.includes(s)));
  const darsNavbati = [...zaifDarslar, ...DARSLAR.filter((x) => !zaifDarslar.includes(x))];
  let darsI = 0;
  let zaifI = 0;
  let bolimI = 0;
  const keyingiZaif = (o: Omit<BankSozlama, 'section' | 'skills'>): Shablon => {
    if (!zaif.length) return keyingiBolim(o);
    const z = zaif[zaifI++ % zaif.length];
    return bank({ ...o, section: z.b, skills: [z.s] });
  };
  const keyingiBolim = (o: Omit<BankSozlama, 'section' | 'skills'>): Shablon => bank({ ...o, section: bolimI++ % 2 === 0 ? 'rw' : 'math' });

  const haftalar: Hafta[] = [];
  const topshiriqlar: Topshiriq[] = [];
  let timedHafta = 0;

  tartib.forEach((bosqich, i) => {
    const raqam = i + 1;
    const boshi = kunQosh(k.bugun, i * 7);
    const oxiri = k.imtihon ? (kunFarqi(kunQosh(boshi, 6), k.imtihon) <= 0 ? kunQosh(k.imtihon, -1) : kunQosh(boshi, 6)) : kunQosh(boshi, 6);
    const kunlar = haftaKunlari(boshi, d, k.imtihon);
    haftalar.push({ raqam, boshi, oxiri, bosqich, oqishKunlari: kunlar });

    // Hafta byudjeti: final haftada yarmi; o'qish kuni kam bo'lsa (imtihon oldi) kunlar × kunlik sig'imdan oshmaydi.
    const kunlikSigim = Math.ceil(bloklar / d);
    const byudjet = Math.min(bosqich === 'final' ? Math.max(2, Math.ceil(bloklar / 2)) : bloklar, kunlar.length * kunlikSigim);
    if (!kunlar.length) return;
    const bosh: Shablon[] = [];
    let aylana: () => Shablon;
    const tak = raqam >= 2;
    switch (bosqich) {
      case 'diagnostic':
        bosh.push(RASMIY, TAHLIL);
        { let n = 0; aylana = () => (++n % 3 === 0 ? LUGAT : keyingiBolim({ rejim: 'practice', hajm: 20 })); }
        break;
      case 'foundations': {
        if (tak) bosh.push(TAKRORLASH);
        const darsSoni = Math.max(1, Math.floor(byudjet / 2));
        for (let j = 0; j < darsSoni && darsI < darsNavbati.length; j++) bosh.push(dars(darsNavbati[darsI++]));
        bosh.push(LUGAT);
        aylana = () => keyingiZaif({ rejim: 'practice', hajm: 10, qiyinlik: ['easy', 'medium'] });
        break;
      }
      case 'topic':
        if (tak) bosh.push(TAKRORLASH);
        bosh.push(LUGAT);
        { let n = 0; aylana = () => (++n % 3 === 0 ? keyingiBolim({ rejim: 'practice', hajm: 20 }) : keyingiZaif({ rejim: 'practice', hajm: 10, qiyinlik: ['medium', 'hard'] })); }
        break;
      case 'timed':
        // Takrorlash birinchi: byudjet kichik bo'lsa ham haftalik takrorlash qoladi; to'liq test har 2-timed haftada, sig'sa.
        bosh.push(TAKRORLASH);
        if (timedHafta++ % 2 === 0) bosh.push(RASMIY, TAHLIL);
        { let n = 0; aylana = () => (++n % 2 === 1 ? keyingiBolim({ rejim: 'timed', hajm: 20 }) : keyingiZaif({ rejim: 'timed', hajm: 10 })); }
        break;
      case 'review':
        bosh.push(TAKRORLASH, bank({ section: 'rw', rejim: 'practice', hajm: 10, qayta: true }), bank({ section: 'math', rejim: 'practice', hajm: 10, qayta: true }), TAHLIL);
        { let n = 0; aylana = () => (++n % 2 === 1 ? TAKRORLASH : keyingiZaif({ rejim: 'practice', hajm: 10, qiyinlik: ['medium'] })); }
        break;
      case 'final':
      default:
        bosh.push(TAKRORLASH, bank({ section: 'rw', rejim: 'practice', hajm: 10, qayta: true }), bank({ section: 'math', rejim: 'practice', hajm: 10, qayta: true }));
        { let n = 0; aylana = () => (++n % 2 === 1 ? keyingiZaif({ rejim: 'practice', hajm: 10, qiyinlik: ['easy', 'medium'] }) : TAKRORLASH); }
        break;
    }

    // Byudjetni to'ldirish: avval bosh ro'yxat, keyin aylana. Diagnostika testi va tahlili byudjetdan oshsa ham qoladi.
    const hafta: Shablon[] = [];
    let ishlatildi = 0;
    for (const t of bosh) {
      const majburiy = bosqich === 'diagnostic' && (t === RASMIY || t === TAHLIL);
      if (majburiy || ishlatildi + blokNarxi(t) <= byudjet) { hafta.push(t); ishlatildi += blokNarxi(t); }
    }
    let xavfsiz = 0;
    while (ishlatildi < byudjet && xavfsiz++ < 100) {
      const t = aylana();
      if (ishlatildi + blokNarxi(t) > byudjet) break;
      hafta.push(t);
      ishlatildi += blokNarxi(t);
    }

    // Kunlarga taqsimlash: kunlik sig'im ceil(byudjet / kunlar); to'lsa keyingi kun. 4 blokli test alohida kunda.
    const sigim = Math.max(1, Math.ceil(byudjet / Math.max(1, kunlar.length)));
    const yuk = kunlar.map(() => 0);
    let kunI = 0;
    hafta.forEach((t, j) => {
      const narx = blokNarxi(t);
      while (kunI < kunlar.length - 1 && yuk[kunI] > 0 && yuk[kunI] + narx > sigim) kunI++;
      if (kunI === kunlar.length - 1 && yuk[kunI] > 0 && yuk[kunI] + narx > sigim) {
        kunI = yuk.indexOf(Math.min(...yuk));
      }
      yuk[kunI] += narx;
      topshiriqlar.push({ ...t, id: `h${raqam}-${j + 1}`, hafta: raqam, kun: kunlar[kunI] ?? boshi, bosqich, bajarildi: null });
    });
  });
  topshiriqlar.sort((a, b) => a.hafta - b.hafta || a.kun.localeCompare(b.kun));
  return { qoidaVersiya: QOIDA_VERSIYA, kirish: k, haftalar, topshiriqlar, jamiHafta };
}

// ---------- Kuzatish ----------
export const otkazilgan = (r: Pick<Reja, 'topshiriqlar'>, bugun: string) => r.topshiriqlar.filter((t) => !t.bajarildi && t.kun < bugun);

export function progress(r: Pick<Reja, 'topshiriqlar'>, hafta?: number) {
  const t = hafta == null ? r.topshiriqlar : r.topshiriqlar.filter((x) => x.hafta === hafta);
  return { bajarildi: t.filter((x) => x.bajarildi).length, jami: t.length };
}

export interface Taqsimot { topshiriqlar: Topshiriq[]; kochdi: string[]; sigmadi: string[] }

/**
 * O'tkazib yuborilgan (bajarilmagan, kuni o'tgan) topshiriqlarni bugundan keyingi o'qish kunlariga ko'chiradi.
 * Kunlik sig'im: ceil(haftalik bloklar / o'qish kunlari) + 1. Imtihon oldidagi dam kunlariga qo'yilmaydi.
 * Sig'magani o'z joyida qoladi va sigmadi ro'yxatida qaytadi. Asl rejani o'zgartirmaydi (yangi massiv).
 */
export function qaytaTaqsimla(r: Reja, bugun: string): Taqsimot {
  const tlar = r.topshiriqlar.map((t) => ({ ...t }));
  const kunlar = r.haftalar.flatMap((h) => h.oqishKunlari.map((kun) => ({ kun, hafta: h.raqam, final: h.bosqich === 'final' }))).filter((x) => x.kun >= bugun);
  const bloklar = haftaBloklari(r.kirish.soat);
  const d = oqishKunlariSoni(r.kirish.soat);
  const asosSigim = Math.max(1, Math.ceil(bloklar / d));
  const yuk = new Map<string, number>();
  for (const t of tlar) if (!t.bajarildi && t.kun >= bugun) yuk.set(t.kun, (yuk.get(t.kun) ?? 0) + blokNarxi(t));
  const kochdi: string[] = [];
  const sigmadi: string[] = [];
  for (const t of tlar.filter((x) => !x.bajarildi && x.kun < bugun)) {
    const narx = blokNarxi(t);
    const joy = kunlar.find((x) => {
      const y = yuk.get(x.kun) ?? 0;
      return y === 0 || y + narx <= asosSigim + 1;
    });
    if (!joy) { sigmadi.push(t.id); continue; }
    yuk.set(joy.kun, (yuk.get(joy.kun) ?? 0) + narx);
    t.kun = joy.kun;
    t.hafta = joy.hafta;
    kochdi.push(t.id);
  }
  tlar.sort((a, b) => a.hafta - b.hafta || a.kun.localeCompare(b.kun));
  return { topshiriqlar: tlar, kochdi, sigmadi };
}

// ---------- Saqlash shakllari ----------
/** Brauzer yozuvi: tayanch:sat-haftalik-reja (versiya 1). */
export const KALIT_HAFTALIK = 'tayanch:sat-haftalik-reja';
export interface BrauzerReja { versiya: 1; reja: Reja; yaratilgan: string }

export function brauzerRejani(q: unknown): Reja | null {
  const x = q as BrauzerReja | null;
  if (!x || typeof x !== 'object' || x.versiya !== 1 || !x.reja || typeof x.reja !== 'object') return null;
  const r = x.reja;
  if (!r.kirish || !sanaTogri(r.kirish.bugun) || !Array.isArray(r.topshiriqlar) || !Array.isArray(r.haftalar)) return null;
  const kirish = kirishniTozala({ ...r.kirish, zaif: Array.isArray(r.kirish.zaif) ? r.kirish.zaif : [], soat: Number(r.kirish.soat) });
  const haftalar = r.haftalar.filter((h) => h && Number.isInteger(h.raqam) && sanaTogri(h.boshi) && sanaTogri(h.oxiri)
    && BOSQICHLAR.includes(h.bosqich) && Array.isArray(h.oqishKunlari) && h.oqishKunlari.every(sanaTogri));
  if (!haftalar.length) return null;
  const toza = r.topshiriqlar.filter((t) => t && typeof t.id === 'string' && Number.isInteger(t.hafta) && sanaTogri(t.kun)
    && typeof t.nom === 'string' && refTogri(t.ref) && BOSQICHLAR.includes(t.bosqich));
  return {
    qoidaVersiya: Number(r.qoidaVersiya) || QOIDA_VERSIYA,
    kirish,
    haftalar,
    jamiHafta: Number.isInteger(r.jamiHafta) ? r.jamiHafta : haftalar.length,
    topshiriqlar: toza.map((t) => ({
      ...t,
      daqiqa: Number.isFinite(t.daqiqa) && t.daqiqa > 0 ? t.daqiqa : BLOK_DAQIQA,
      bajarildi: typeof t.bajarildi === 'string' ? t.bajarildi : null,
    })),
  };
}

export const brauzerYozuvi = (reja: Reja, hozir = new Date()): BrauzerReja => ({ versiya: 1, reja, yaratilgan: hozir.toISOString() });

/** Eski reja tuzgich yozuvi (tayanch:sat-reja): o'qiladi, o'zgartirilmaydi. */
export interface EskiReja { sana: string; hozirgi: number | null; maqsad: number; kunlar: number; fokus: string; belgilar: Record<string, boolean> }
export function eskiRejani(q: unknown): EskiReja | null {
  const x = q as EskiReja | null;
  if (!x || typeof x.sana !== 'string' || typeof x.maqsad !== 'number') return null;
  return { ...x, belgilar: x.belgilar && typeof x.belgilar === 'object' ? x.belgilar : {} };
}
/** Eski rejadan forma uchun boshlang'ich qiymat: sana (kelajakda bo'lsa), maqsad, soat ≈ haftalik kunlar (1 kun ≈ 1 soat). */
export function eskidanKirish(e: EskiReja, bugun: string): Partial<RejaKirish> {
  return {
    imtihon: sanaTogri(e.sana) && kunFarqi(bugun, e.sana) > 0 ? e.sana : null,
    maqsad: e.maqsad >= 400 && e.maqsad <= 1600 ? e.maqsad : null,
    soat: soatniTozala(Number(e.kunlar) || 4),
  };
}

/** Supabase: save_study_plan(p_plan, p_tasks) argumentlari. */
export function serverArgumentlari(r: Reja) {
  return {
    p_plan: {
      title: 'SAT study plan',
      exam_date: r.kirish.imtihon,
      target_score: r.kirish.maqsad,
      hours_per_week: r.kirish.soat,
      weak_skills: r.kirish.zaif,
      rules_version: r.qoidaVersiya,
      start_date: r.kirish.bugun,
    },
    p_tasks: r.topshiriqlar.map((t) => ({
      due_on: t.kun, title: t.nom, kind: t.tur, ref: t.ref, week: t.hafta, phase: t.bosqich, minutes: t.daqiqa, done_at: t.bajarildi,
    })),
  };
}

export interface RejaQator {
  id: string; exam_date: string | null; target_score: number | null; hours_per_week: number | null;
  weak_skills: string[] | null; rules_version: number | null; start_date: string | null; created_at: string;
}
export interface VazifaQator {
  id: string; due_on: string | null; title: string; kind: string | null; ref: string | null;
  position: number; done_at: string | null; week: number | null; phase: string | null; minutes: number | null;
}

/** Bazadagi faol reja → Reja (haftalar va o'qish kunlari qoidadan qayta tiklanadi, topshiriqlar bazadan). */
export function serverdanReja(p: RejaQator, vazifalar: readonly VazifaQator[]): Reja {
  const bugun = p.start_date && sanaTogri(p.start_date) ? p.start_date : p.created_at.slice(0, 10);
  const asos = rejaTuz({ bugun, imtihon: p.exam_date, maqsad: p.target_score, soat: p.hours_per_week ?? 4, zaif: p.weak_skills ?? [] });
  const topshiriqlar: Topshiriq[] = [...vazifalar].sort((a, b) => a.position - b.position).map((v) => ({
    id: v.id,
    hafta: v.week ?? 1,
    kun: v.due_on ?? asos.kirish.bugun,
    bosqich: (BOSQICHLAR as readonly string[]).includes(v.phase ?? '') ? (v.phase as Bosqich) : 'topic',
    tur: (v.kind ?? 'bank') as TopshiriqTuri,
    nom: v.title,
    ref: v.ref ?? YOLLAR.bank,
    daqiqa: v.minutes ?? BLOK_DAQIQA,
    bajarildi: v.done_at,
  }));
  topshiriqlar.sort((a, b) => a.hafta - b.hafta || a.kun.localeCompare(b.kun));
  return { ...asos, qoidaVersiya: p.rules_version ?? QOIDA_VERSIYA, topshiriqlar };
}

// ---------- Ko'rinish yordamchilari (sahifa, sof) ----------
export type KunTuri = 'oqish' | 'dam' | 'imtihon-oldi' | 'imtihon';
export interface KunQator { kun: string; tur: KunTuri; topshiriqlar: Topshiriq[] }

/** Haftaning har kuni: o'qish kuni (topshiriqlari bilan), dam kuni, imtihon oldidan dam, imtihon kuni. */
export function haftaJadvali(r: Reja, h: Hafta): KunQator[] {
  const oxiri = r.kirish.imtihon && kunFarqi(h.oxiri, r.kirish.imtihon) === 1 ? r.kirish.imtihon : h.oxiri;
  const kunlar: KunQator[] = [];
  for (let k = h.boshi; k <= oxiri; k = kunQosh(k, 1)) {
    const topshiriqlar = r.topshiriqlar.filter((t) => t.hafta === h.raqam && t.kun === k);
    const im = r.kirish.imtihon;
    const tur: KunTuri = im && k === im ? 'imtihon' : im && kunFarqi(k, im) === 1 ? 'imtihon-oldi'
      : h.oqishKunlari.includes(k) || topshiriqlar.length ? 'oqish' : 'dam';
    kunlar.push({ kun: k, tur, topshiriqlar });
  }
  // ko'chirilgan topshiriq hafta oralig'idan tashqarida bo'lmaydi, lekin ehtiyot uchun: qolganlari oxirida
  const bor = new Set(kunlar.map((x) => x.kun));
  for (const t of r.topshiriqlar.filter((x) => x.hafta === h.raqam && !bor.has(x.kun))) kunlar.push({ kun: t.kun, tur: 'oqish', topshiriqlar: [t] });
  return kunlar;
}

/** Joriy hafta raqami: bugun shu hafta oralig'ida; reja boshlanmagan bo'lsa 1; tugagan bo'lsa null. */
export function joriyHafta(r: Pick<Reja, 'haftalar'>, bugun: string): number | null {
  const h = r.haftalar.find((x) => bugun >= x.boshi && bugun <= kunQosh(x.boshi, 6));
  if (h) return h.raqam;
  if (r.haftalar.length && bugun < r.haftalar[0].boshi) return 1;
  return null;
}

export const rejaTugaganmi = (r: Pick<Reja, 'haftalar'>, bugun: string) => !!r.haftalar.length && bugun > r.haftalar[r.haftalar.length - 1].oxiri;

/** usage_status → plan_rebuilds limiti (faqat limit bo'lsa). */
export interface RejaKvota { max: number; qolgan: number; per: string; resetsAt?: string }
export function rejaKvota(u: { limits?: Record<string, { max: number; per?: string; used: number; remaining?: number; resets_at?: string }> | null } | null | undefined): RejaKvota | null {
  const l = u?.limits?.[KVOTA_KALIT];
  if (!l || !Number.isFinite(Number(l.max))) return null;
  const max = Number(l.max);
  const qolgan = Math.max(0, Number(l.remaining ?? max - Number(l.used ?? 0)));
  return { max, qolgan, per: l.per ?? 'month', resetsAt: l.resets_at };
}
export function rejaKvotaMatni(k: RejaKvota): string {
  const davr = k.per === 'day' ? 'today' : 'this month';
  return `${k.qolgan} of ${k.max} plan ${k.max === 1 ? 'change' : 'changes'} left ${davr}`;
}
