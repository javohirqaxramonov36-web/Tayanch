// SAT lug'ati (P15): sof mantiq. DOM va tarmoq yo'q, shuning uchun node --test bilan sinaladi (src/lib/testlar/lugat.test.ts).
//
// Hisobsiz holat (brauzerda) ikki kalitda:
//   tayanch:sat-lugat         { [so'z]: 'bilaman' | 'organ' }  oxirgi baho; avvalgi shakl o'zgarmagan, dars sahifasi uni o'qiydi.
//   tayanch:sat-lugat-takror  { versiya: 1, sozlar: { [so'z kichik harfda]: { quti, keyingi, yulduz } } }  Leitner va yulduzcha.
// Hisob bilan: manba Supabase (vocab_progress, user_vocab_words); brauzer kalitlari bir marta vocab_import_local bilan ko'chiriladi.
import { keyingiQuti, type Quti } from '../leitner.ts';

export const KALIT_LUGAT = 'tayanch:sat-lugat';
export const KALIT_TAKROR = 'tayanch:sat-lugat-takror';

export type Qiyinlik = 'easy' | 'medium' | 'hard';
export const QIYINLIKLAR: Qiyinlik[] = ['easy', 'medium', 'hard'];
export type Baho = 'bilaman' | 'organ';

export interface Soz {
  /** So'z kichik harfda: brauzer kalitlari va import shu bo'yicha */
  kalit: string;
  /** Bazadagi id (vocab_words yoki user_vocab_words); namunada null */
  id: string | null;
  word: string;
  pos: string | null;
  definition: string | null;
  example: string | null;
  difficulty: Qiyinlik | null;
  topic: string | null;
  uzbek: string | null;
  /** O'z so'zi (My Words) */
  oz: boolean;
}

export interface SozHolat {
  quti: Quti | null;
  keyingi: string | null;
  baho: Baho | null;
  yulduz: boolean;
}

export const BOSH_HOLAT: SozHolat = { quti: null, keyingi: null, baho: null, yulduz: false };
export const kalitQil = (word: string) => word.trim().toLowerCase();

const SANA = /^\d{4}-\d{2}-\d{2}$/;
const qutimi = (x: unknown): x is Quti => [1, 2, 3, 4, 5].includes(x as number);

// ---- Brauzer holati ----

export interface Ombor { getItem(k: string): string | null; setItem(k: string, v: string): void }

function jsonOqi(o: Ombor, k: string): unknown {
  try { return JSON.parse(o.getItem(k) ?? 'null'); } catch { return null; }
}

/**
 * Ikki kalitni bitta xaritaga birlashtiradi. Faqat eski baho bor so'z (P15 dan oldingi): "bilaman" 2-quti, "organ" 1-quti,
 * ikkalasi ham bugun takrorlanadi (serverdagi vocab_import_local bilan bir xil qoida).
 */
export function lokalOqi(o: Ombor, kun: string): Map<string, SozHolat> {
  const m = new Map<string, SozHolat>();
  const baholar = jsonOqi(o, KALIT_LUGAT);
  if (baholar && typeof baholar === 'object') {
    for (const [w, b] of Object.entries(baholar)) {
      if (b !== 'bilaman' && b !== 'organ') continue;
      m.set(kalitQil(w), { quti: b === 'bilaman' ? 2 : 1, keyingi: kun, baho: b, yulduz: false });
    }
  }
  const t = jsonOqi(o, KALIT_TAKROR) as { versiya?: number; sozlar?: Record<string, unknown> } | null;
  if (t && t.versiya === 1 && t.sozlar && typeof t.sozlar === 'object') {
    for (const [k, v] of Object.entries(t.sozlar)) {
      if (!v || typeof v !== 'object') continue;
      const y = v as { quti?: unknown; keyingi?: unknown; yulduz?: unknown };
      const quti = qutimi(y.quti) ? y.quti : null;
      const keyingi = quti && SANA.test(String(y.keyingi)) ? String(y.keyingi) : quti ? kun : null;
      const eski = m.get(k);
      m.set(k, { quti, keyingi, baho: eski?.baho ?? null, yulduz: y.yulduz === true });
    }
  }
  return m;
}

/** Ikki kalitni yozadi. Boshqa (masalan namunadan tashqari) so'zlarning eski bahosi saqlanadi. */
export function lokalYoz(o: Ombor, holat: Map<string, SozHolat>, sozNomi: (kalit: string) => string = (k) => k): boolean {
  try {
    const eski = jsonOqi(o, KALIT_LUGAT);
    const baholar: Record<string, Baho> = {};
    if (eski && typeof eski === 'object') {
      for (const [w, b] of Object.entries(eski)) if ((b === 'bilaman' || b === 'organ') && !holat.has(kalitQil(w))) baholar[w] = b;
    }
    const sozlar: Record<string, { quti: Quti | null; keyingi: string | null; yulduz: boolean }> = {};
    for (const [k, h] of holat) {
      if (h.baho) baholar[sozNomi(k)] = h.baho;
      if (h.quti || h.yulduz) sozlar[k] = { quti: h.quti, keyingi: h.keyingi, yulduz: h.yulduz };
    }
    o.setItem(KALIT_LUGAT, JSON.stringify(baholar));
    o.setItem(KALIT_TAKROR, JSON.stringify({ versiya: 1, sozlar }));
    return true;
  } catch {
    return false;
  }
}

/** Baholashdan keyingi holat (sof). Server vocab_rate bilan bir xil. */
export function baholash(h: SozHolat, togri: boolean, kun: string): SozHolat {
  const k = keyingiQuti(h.quti, togri, kun);
  return { ...h, quti: k.quti, keyingi: k.keyingi, baho: togri ? 'bilaman' : 'organ' };
}

/** vocab_import_local uchun ro'yxat: faqat bahosi, qutisi yoki yulduzi bor so'zlar. */
export function importRoyxati(holat: Map<string, SozHolat>) {
  return [...holat].filter(([, h]) => h.quti || h.yulduz || h.baho).map(([word, h]) => ({
    word,
    status: h.baho ?? undefined,
    box: h.quti ?? undefined,
    next_due: h.keyingi ?? undefined,
    starred: h.yulduz || undefined,
  }));
}

// ---- Filtr, navbat, kutubxona ----

export interface Filtr { qiyinlik: Set<Qiyinlik>; mavzu: Set<string>; yulduzli: boolean }
export const boshFiltr = (): Filtr => ({ qiyinlik: new Set(), mavzu: new Set(), yulduzli: false });

/** Bo'sh to'plam = hammasi. O'z so'zlarida qiyinlik va mavzu yo'q: ular shu filtrlar tanlanganda chiqmaydi. */
export function filtrla(sozlar: Soz[], holat: Map<string, SozHolat>, f: Filtr): Soz[] {
  return sozlar.filter((s) =>
    (!f.qiyinlik.size || (s.difficulty !== null && f.qiyinlik.has(s.difficulty)))
    && (!f.mavzu.size || (s.topic !== null && f.mavzu.has(s.topic)))
    && (!f.yulduzli || holat.get(s.kalit)?.yulduz === true));
}

export const mavzular = (sozlar: Soz[]) => [...new Set(sozlar.map((s) => s.topic).filter((t): t is string => !!t))].sort((a, b) => a.localeCompare(b));

export interface Navbat {
  /** Bugungi takrorlash (quti 1–4, keyingi ≤ bugun), eng eskisi oldin */
  takror: Soz[];
  /** Yangi so'zlar (kvota bo'yicha kesilgan; o'z so'zlari kvotaga kirmaydi) */
  yangi: Soz[];
  /** Kvota tufayli bugun ko'rsatilmagan yangi so'zlar soni */
  ushlangan: number;
  /** Eng yaqin keyingi takrorlash sanasi (bugundan keyin), bo'lmasa null */
  keyingiSana: string | null;
}

/** Bugungi kartalar. yangiQoldiq: kvotadan qolgan yangi so'z soni; null = cheklov yo'q. */
export function navbat(sozlar: Soz[], holat: Map<string, SozHolat>, kun: string, yangiQoldiq: number | null): Navbat {
  const h = (s: Soz) => holat.get(s.kalit) ?? BOSH_HOLAT;
  const takror = sozlar
    .filter((s) => { const x = h(s); return x.quti !== null && x.quti < 5 && (x.keyingi ?? kun) <= kun; })
    .sort((a, b) => (h(a).keyingi ?? '').localeCompare(h(b).keyingi ?? '') || a.kalit.localeCompare(b.kalit));
  const yangiHammasi = sozlar.filter((s) => h(s).quti === null);
  const ozlari = yangiHammasi.filter((s) => s.oz);
  const umumiy = yangiHammasi.filter((s) => !s.oz);
  const chegara = yangiQoldiq === null ? umumiy.length : Math.max(0, Math.min(yangiQoldiq, umumiy.length));
  const keyingilar = sozlar.map((s) => h(s)).filter((x) => x.quti !== null && x.quti < 5 && (x.keyingi ?? '') > kun).map((x) => x.keyingi!).sort();
  return { takror, yangi: [...ozlari, ...umumiy.slice(0, chegara)], ushlangan: umumiy.length - chegara, keyingiSana: keyingilar[0] ?? null };
}

export type HolatTuri = 'new' | 'due' | 'later' | 'mastered';
export function holatTuri(h: SozHolat | undefined, kun: string): HolatTuri {
  if (!h || h.quti === null) return 'new';
  if (h.quti === 5) return 'mastered';
  return (h.keyingi ?? kun) <= kun ? 'due' : 'later';
}

const OYLAR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "2026-11-14" → "Nov 14" (inglizcha, SAT bo'limi) */
export const sanaMatn = (sana: string) => { const [, m, d] = sana.split('-').map(Number); return `${OYLAR[m - 1]} ${d}`; };

/** Kutubxonadagi holat yozuvi */
export function holatMatn(h: SozHolat | undefined, kun: string): string {
  const t = holatTuri(h, kun);
  if (t === 'new') return 'New';
  if (t === 'mastered') return 'Mastered';
  if (t === 'due') return `Box ${h!.quti} · review today`;
  return `Box ${h!.quti} · next ${sanaMatn(h!.keyingi!)}`;
}

// ---- Quiz ----

export interface QuizSavol { soz: Soz; variantlar: Soz[]; togri: number }

function aralash<T>(a: T[], rnd: () => number): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
  return b;
}

export const QUIZ_VARIANT = 4;
export const quizMumkinmi = (sozlar: Soz[]) => new Set(sozlar.filter((s) => s.definition).map((s) => s.kalit)).size >= QUIZ_VARIANT;

/**
 * Ta'rif bo'yicha 4 variantli savollar. Faqat ta'rifi bor so'zlar. Chalg'ituvchilar avval shu so'z turkumidan,
 * yetmasa boshqalaridan. Bir savolda bir so'z ikki marta chiqmaydi. 4 tadan kam so'z bo'lsa bo'sh ro'yxat.
 */
export function quizTuz(sozlar: Soz[], soni = 10, rnd: () => number = Math.random): QuizSavol[] {
  const yagona = [...new Map(sozlar.filter((s) => s.definition).map((s) => [s.kalit, s])).values()];
  if (yagona.length < QUIZ_VARIANT) return [];
  return aralash(yagona, rnd).slice(0, soni).map((soz) => {
    const qolgan = aralash(yagona.filter((s) => s.kalit !== soz.kalit), rnd);
    const bir = qolgan.filter((s) => s.pos && s.pos === soz.pos);
    const boshqa = qolgan.filter((s) => !(s.pos && s.pos === soz.pos));
    const variantlar = aralash([soz, ...[...bir, ...boshqa].slice(0, QUIZ_VARIANT - 1)], rnd);
    return { soz, variantlar, togri: variantlar.indexOf(soz) };
  });
}
