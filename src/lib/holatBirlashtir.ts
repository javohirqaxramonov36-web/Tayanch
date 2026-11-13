// SAT progressini hisob bilan sinxronlash: kalitlar ro'yxati va sof birlashtirish funksiyalari.
// Brauzer API'si yo'q (Node testida ham ishlaydi: scripts/sinxron-test.ts). Qoidalar: docs/sinxron-qoidalari.md.
// Har kalit "yozuvlar" (id → qiymat) ga ajratiladi; har yozuvning oxirgi o'zgarish vaqti (t, ms) va
// o'chirilganlar (o, tombstone, ms) alohida saqlanadi. Kalitning o'z shakli (localStorage) o'zgarmaydi.

export const SINXRON_KALITLAR = [
  'tayanch:sat-javoblar',
  'tayanch:sat-dars-progress',
  'tayanch:sat-xato-daftari',
  'tayanch:sat-takrorlash',
  'tayanch:sat-reja',
  'tayanch:sat-xato-sabab',
] as const;
// tayanch:sat-lugat bu yerda yo'q: P15 (PR #99) dan beri lug'at o'z jadvallarida (vocab_progress, vocab_import_local).
// tayanch:sat-rasmiy-testlar (P11) hali yo'q: alohida PR (docs/sinxron-qoidalari.md).
export type SinxronKalit = (typeof SINXRON_KALITLAR)[number];
export const sinxronKalitmi = (k: string): k is SinxronKalit => (SINXRON_KALITLAR as readonly string[]).includes(k);

export type Vaqtlar = Record<string, number>;
/** Bir tomon (brauzer yoki server) holati: kalitning odatiy qiymati, yozuv vaqtlari, o'chirilganlar. */
export interface Tomon { qiymat: unknown; t: Vaqtlar; o: Vaqtlar }
/** Serverdagi user_state.value shakli */
export interface ServerQiymat extends Tomon { versiya: 1 }

/** Eng ko'p saqlanadigan tombstone soni (har kalitga): eng yangilari qoladi. */
const MAKS_TOMBSTONE = 1000;

type Yozuvlar = Map<string, unknown>;
interface Shakl {
  /** Kalit qiymatini yozuvlarga ajratadi (noto'g'ri qiymat → bo'sh) */
  ajrat(q: unknown): Yozuvlar;
  /** Yozuvlardan kalit qiymatini qayta yig'adi (t: tartib uchun) */
  yig(y: Yozuvlar, t: Vaqtlar): unknown;
}

const obyektmi = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);

/** Ro'yxat (yangisi birinchi), har elementda string id. Tartib: vaqt bo'yicha kamayish, teng bo'lsa avvalgi tartib. */
const royxat = (maks: number): Shakl => ({
  ajrat(q) {
    const m: Yozuvlar = new Map();
    if (Array.isArray(q)) for (const x of q) if (obyektmi(x) && typeof x.id === 'string' && !m.has(x.id)) m.set(x.id, x);
    return m;
  },
  yig(y, t) {
    return [...y.entries()]
      .map(([id, x], i) => ({ x, i, v: t[id] ?? 0 }))
      .sort((a, b) => b.v - a.v || a.i - b.i)
      .slice(0, maks)
      .map((e) => e.x);
  },
});

/** { versiya: 1, savollar: { id: yozuv } }: har savol bitta yozuv (takrorlash, xato sababi) */
const savollarShakl: Shakl = {
  ajrat(q) {
    const m: Yozuvlar = new Map();
    if (obyektmi(q) && obyektmi(q.savollar)) for (const [id, y] of Object.entries(q.savollar)) if (obyektmi(y)) m.set(id, y);
    return m;
  },
  yig: (y) => ({ versiya: 1, savollar: Object.fromEntries(y) }),
};

const AJRATGICH = '\t';
const SHAKLLAR: Record<SinxronKalit, Shakl> = {
  // tayanch:sat-javoblar: Javob[] (satNamuna.ts), test sahifasi 500 tagacha saqlaydi
  'tayanch:sat-javoblar': royxat(500),
  // tayanch:sat-xato-daftari: XatoYozuv[] (darsSaqlash.ts), 300 tagacha
  'tayanch:sat-xato-daftari': royxat(300),
  // tayanch:sat-dars-progress: { modul: { savolId: 'togri' | 'xato' } } → yozuv id "modul<TAB>savolId"
  'tayanch:sat-dars-progress': {
    ajrat(q) {
      const m: Yozuvlar = new Map();
      if (obyektmi(q)) for (const [modul, s] of Object.entries(q)) {
        if (obyektmi(s)) for (const [id, h] of Object.entries(s)) m.set(modul + AJRATGICH + id, h);
      }
      return m;
    },
    yig(y) {
      const p: Record<string, Record<string, unknown>> = {};
      for (const [k, h] of y) {
        const i = k.indexOf(AJRATGICH);
        const modul = k.slice(0, i);
        (p[modul] ??= {})[k.slice(i + 1)] = h;
      }
      return p;
    },
  },
  // tayanch:sat-takrorlash: { versiya: 1, savollar: { id: { quti, keyingi, xatoSana } } } (takrorlash.ts).
  // Quti va keyingi sana o'zgarishsiz ko'chadi: oraliqlar (1, 3, 7, 14 kun) shu sanalarda saqlangan.
  'tayanch:sat-takrorlash': savollarShakl,
  // tayanch:sat-xato-sabab: { versiya: 1, savollar: { id: { teg, izoh } } } (xatoSabab.ts, P09); izoh 1000 belgigacha,
  // yozuvlar soni dars savollari soni bilan cheklangan.
  'tayanch:sat-xato-sabab': savollarShakl,
  // tayanch:sat-reja: bitta obyekt yoki yo'q → bitta yozuv "reja"
  'tayanch:sat-reja': {
    ajrat(q) {
      const m: Yozuvlar = new Map();
      if (obyektmi(q)) m.set('reja', q);
      return m;
    },
    yig: (y) => (y.has('reja') ? y.get('reja') : null),
  },
};

export const yozuvlar = (kalit: SinxronKalit, q: unknown): Yozuvlar => SHAKLLAR[kalit].ajrat(q);

/** Dialog uchun: kalitdagi yozuvlar soni (reja: 0 yoki 1) */
export const sanoq = (kalit: SinxronKalit, q: unknown): number => yozuvlar(kalit, q).size;

/** Bo'sh qiymat (hamma yozuv o'chganda) */
export const boshQiymat = (kalit: SinxronKalit): unknown => SHAKLLAR[kalit].yig(new Map(), {});

const teng = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function tombstoneKes(o: Vaqtlar): Vaqtlar {
  const e = Object.entries(o);
  if (e.length <= MAKS_TOMBSTONE) return o;
  return Object.fromEntries(e.sort((a, b) => b[1] - a[1]).slice(0, MAKS_TOMBSTONE));
}

/**
 * Brauzerdagi yozish: eski va yangi qiymatni solishtirib vaqtlarni yangilaydi.
 * Yangi yoki o'zgargan yozuv → t = hozir; yo'qolgan yozuv → tombstone (o = hozir).
 */
export function vaqtniYangila(kalit: SinxronKalit, eski: unknown, yangi: unknown, v: { t: Vaqtlar; o: Vaqtlar }, hozir: number) {
  const a = yozuvlar(kalit, eski);
  const b = yozuvlar(kalit, yangi);
  const t = { ...v.t };
  const o = { ...v.o };
  for (const [id, x] of b) {
    if (!a.has(id) || !teng(a.get(id), x)) { t[id] = hozir; delete o[id]; }
  }
  for (const id of a.keys()) {
    if (!b.has(id)) { o[id] = hozir; delete t[id]; }
  }
  // Qiymatda yo'q yozuvlarning vaqti kerak emas
  for (const id of Object.keys(t)) if (!b.has(id)) delete t[id];
  return { t, o: tombstoneKes(o) };
}

/**
 * Ikki tomonni birlashtiradi (sof, idempotent: birlashtir(x, x) = x).
 * - Yozuvlar id bo'yicha; ikkala tomonda bo'lsa yangiroq t yutadi, teng bo'lsa server yutadi.
 * - rejim 'sinxron': tombstone faqat yozuvdan qat'iy yangiroq bo'lsa o'chiradi (teng bo'lsa yozuv qoladi).
 * - rejim 'import': hech narsa o'chirilmaydi. Tombstone'ga qarshi qolgan yozuv vaqti tombstone + 1 bo'ladi,
 *   shunda boshqa qurilma keyingi sinxronda uni o'chirmaydi.
 */
export function birlashtir(kalit: SinxronKalit, mahalliy: Tomon, server: Tomon, rejim: 'import' | 'sinxron'): Tomon {
  const L = yozuvlar(kalit, mahalliy.qiymat);
  const S = yozuvlar(kalit, server.qiymat);
  // Tartib: avval server yozuvlari, keyin faqat brauzerda borlari (vaqti teng ro'yxatlarda barqaror tartib)
  const idlar = new Set<string>([...S.keys(), ...L.keys(), ...Object.keys(server.o), ...Object.keys(mahalliy.o)]);
  const natija: Yozuvlar = new Map();
  const t: Vaqtlar = {};
  const o: Vaqtlar = {};

  for (const id of idlar) {
    const tL = mahalliy.t[id] ?? 0;
    const tS = server.t[id] ?? 0;
    let yozuv: unknown;
    let vaqt = 0;
    let bor = false;
    if (S.has(id) && (!L.has(id) || tS >= tL)) { yozuv = S.get(id); vaqt = tS; bor = true; }
    else if (L.has(id)) { yozuv = L.get(id); vaqt = tL; bor = true; }

    const oL = mahalliy.o[id];
    const oS = server.o[id];
    const oMaks = oL === undefined ? oS : oS === undefined ? oL : Math.max(oL, oS);

    if (bor && oMaks !== undefined && oMaks > vaqt) {
      if (rejim === 'import') { vaqt = oMaks + 1; }
      else { o[id] = oMaks; continue; }
    } else if (!bor) {
      if (oMaks !== undefined) o[id] = oMaks;
      continue;
    }
    natija.set(id, yozuv);
    if (vaqt > 0) t[id] = vaqt;
  }

  const qiymat = SHAKLLAR[kalit].yig(natija, t);
  // Ro'yxat chegarasi (500/300) dan tushib qolgan yozuvlar: vaqti olib tashlanadi, tombstone qo'yilmaydi
  const qolgan = yozuvlar(kalit, qiymat);
  for (const id of Object.keys(t)) if (!qolgan.has(id)) delete t[id];
  return { qiymat, t, o: tombstoneKes(o) };
}

/** Ikki tomon bir xilmi (bo'sh qiymat va yo'q kalit teng hisoblanadi) */
export const tomonTengmi = (kalit: SinxronKalit, a: Tomon, b: Tomon) =>
  (teng(a.qiymat, b.qiymat) || (sanoq(kalit, a.qiymat) === 0 && sanoq(kalit, b.qiymat) === 0)) &&
  teng(tartibla(a.t), tartibla(b.t)) && teng(tartibla(a.o), tartibla(b.o));
const tartibla = (v: Vaqtlar) => Object.fromEntries(Object.entries(v).sort((x, y) => x[0].localeCompare(y[0])));

/** Serverdan kelgan qiymatni tekshiradi; noto'g'ri bo'lsa bo'sh tomon. */
export function serverTomon(x: unknown): Tomon {
  if (obyektmi(x) && x.versiya === 1) {
    const vaqtlar = (v: unknown): Vaqtlar => {
      const r: Vaqtlar = {};
      if (obyektmi(v)) for (const [k, n] of Object.entries(v)) if (typeof n === 'number' && Number.isFinite(n)) r[k] = n;
      return r;
    };
    return { qiymat: x.qiymat, t: vaqtlar(x.t), o: vaqtlar(x.o) };
  }
  return { qiymat: undefined, t: {}, o: {} };
}

export const serverQiymat = (x: Tomon): ServerQiymat => ({ versiya: 1, qiymat: x.qiymat, t: x.t, o: x.o });
