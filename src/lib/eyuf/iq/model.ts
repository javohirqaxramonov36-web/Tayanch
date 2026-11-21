import { xpQoida } from '../../../data/satReyting.ts';

export const SAQLASH_KALITI = 'tayanch:eyuf-iq:v1';
export const KONTENT_VERSIYA = 'prep-1-2026-11-20';
export const TOGRI_XP = xpQoida.javob + xpQoida.togri;
export const OTISH_BALLI = 61;
export const VARIANTLAR = ['A', 'B', 'C', 'D', 'E'] as const;
export type Variant = typeof VARIANTLAR[number];
export type Rejim = '1' | '2' | '3' | '4' | '5' | 'aralash' | 'xatolar';

export interface SavolRasmi {
  fayl: string;
  kenglik: number;
  balandlik: number;
  sahifa: number;
}

export interface IqSavol {
  id: string;
  test: number;
  raqam: number;
  variantlar: readonly Variant[];
  rasmlar: readonly SavolRasmi[];
  kitobJavobi: Variant;
  tekshirilgan: boolean;
  yechim: string;
}

export interface Sessiya {
  id: string;
  rejim: Rejim;
  savollar: string[];
  javoblar: Record<string, Variant>;
  joriy: number;
  boshlangan: number;
  muddat: number;
  yakunlangan: number | null;
  vaqtTugadi: boolean;
  olinganXp: number;
}

export interface Mukofot { id: string; kun: string }
export interface Holat {
  versiya: 1;
  kontent: string;
  daqiqa: number;
  sessiya: Sessiya | null;
  mukofotlar: Mukofot[];
}

export const boshHolat = (): Holat => ({
  versiya: 1, kontent: KONTENT_VERSIYA, daqiqa: 30, sessiya: null, mukofotlar: [],
});

export function daqiqaTogrimi(qiymat: number): boolean {
  return Number.isInteger(qiymat) && qiymat >= 1 && qiymat <= 180;
}

export function aralashtir<T>(royxat: readonly T[], tasodif = Math.random): T[] {
  const nusxa = [...royxat];
  for (let i = nusxa.length - 1; i > 0; i--) {
    const j = Math.floor(tasodif() * (i + 1));
    [nusxa[i], nusxa[j]] = [nusxa[j], nusxa[i]];
  }
  return nusxa;
}

export function yangiSessiya(rejim: Rejim, savollar: readonly IqSavol[], daqiqa: number, hozir = Date.now()): Sessiya {
  if (!daqiqaTogrimi(daqiqa) || savollar.length === 0 || savollar.length > 20) {
    throw new Error('Test savollari yoki vaqt noto‘g‘ri.');
  }
  return {
    id: crypto.randomUUID(), rejim, savollar: savollar.map(s => s.id), javoblar: {}, joriy: 0,
    boshlangan: hozir, muddat: hozir + daqiqa * 60_000, yakunlangan: null,
    vaqtTugadi: false, olinganXp: 0,
  };
}

export function rejimNomi(rejim: Rejim): string {
  if (rejim === 'aralash') return 'Aralash 20 savol';
  if (rejim === 'xatolar') return 'Xatolarni qayta yechish';
  return `${rejim}-test`;
}

export function natijaniHisobla(sessiya: Sessiya, bank: readonly IqSavol[]) {
  const savollar = sessiya.savollar.map(id => bank.find(s => s.id === id)!);
  const togri = savollar.filter(s => s.tekshirilgan && sessiya.javoblar[s.id] === s.kitobJavobi);
  const xatolar = savollar.filter(s => s.tekshirilgan && sessiya.javoblar[s.id] !== s.kitobJavobi);
  const tekshirilmoqda = savollar.filter(s => !s.tekshirilgan);
  const ball = Math.round(togri.length / savollar.length * 100);
  const engYuqori = Math.round((togri.length + tekshirilmoqda.length) / savollar.length * 100);
  let combo = 0;
  let engUzunCombo = 0;
  for (const s of savollar) {
    combo = s.tekshirilgan && sessiya.javoblar[s.id] === s.kitobJavobi ? combo + 1 : 0;
    engUzunCombo = Math.max(combo, engUzunCombo);
  }
  const chegara = ball >= OTISH_BALLI ? 'yuqori' : engYuqori < OTISH_BALLI ? 'past' : 'kutilmoqda';
  return { savollar, togri, xatolar, tekshirilmoqda, ball, engYuqori, engUzunCombo, chegara };
}

export function chegaraMatni(chegara: string): string {
  if (chegara === 'yuqori') return '61 ballik chegaraga yetdingiz';
  if (chegara === 'past') return '61 ballik chegaradan past';
  return '61 ball bilan solishtirish uchun javoblar tekshirilmoqda';
}

/** Har savolning birinchi tasdiqlangan to‘g‘ri javobi lokal XP beradi. */
export function mukofotHisobla(holat: Holat, bank: readonly IqSavol[], hozir = Date.now()): Holat {
  const sessiya = holat.sessiya;
  if (!sessiya || sessiya.yakunlangan !== null) return holat;
  const natija = natijaniHisobla(sessiya, bank);
  const kun = new Date(hozir).toLocaleDateString('en-CA', { timeZone: 'Asia/Tashkent' });
  const avval = new Set(holat.mukofotlar.map(m => m.id));
  const bugungiXp = holat.mukofotlar.filter(m => m.kun === kun).length * TOGRI_XP;
  const joy = Math.max(0, Math.floor((xpQoida.kunlikChegara - bugungiXp) / TOGRI_XP));
  const yangi = natija.togri.filter(s => !avval.has(s.id)).slice(0, joy).map(s => ({ id: s.id, kun }));
  return {
    ...holat,
    mukofotlar: [...holat.mukofotlar, ...yangi],
    sessiya: { ...sessiya, yakunlangan: hozir, vaqtTugadi: hozir >= sessiya.muddat, olinganXp: yangi.length * TOGRI_XP },
  };
}

export function ulashishMatni(sessiya: Sessiya, bank: readonly IqSavol[]): string {
  const n = natijaniHisobla(sessiya, bank);
  const chegara = n.chegara === 'yuqori' ? '61 dan yuqori' : n.chegara === 'past' ? '61 dan past' : 'chegara tekshirilmoqda';
  const izoh = n.tekshirilmoqda.length ? `, ${n.tekshirilmoqda.length} javob tekshirilmoqda` : '';
  return `Tayanch EYUF IQ: ${rejimNomi(sessiya.rejim)}, ${n.ball}/100, ${chegara}${izoh}\n${new URL('uz/eyuf/iq/', 'https://tayanchedu.uz/').href}`;
}

/** localStorage tarkibi ishonchli hisoblanmaydi. Eski yoki buzilgan sessiya tashlanadi. */
export function holatniOqi(xom: string | null, bank: readonly IqSavol[]): Holat {
  const bosh = boshHolat();
  if (!xom) return bosh;
  try {
    const x = JSON.parse(xom);
    if (x?.versiya !== 1 || x.kontent !== KONTENT_VERSIYA) return bosh;
    const xarita = new Map(bank.map(s => [s.id, s]));
    bosh.daqiqa = daqiqaTogrimi(x.daqiqa) ? x.daqiqa : 30;
    const noyob = new Set<string>();
    if (Array.isArray(x.mukofotlar)) {
      bosh.mukofotlar = x.mukofotlar.filter((m: Mukofot) => {
        if (!m || !xarita.has(m.id) || noyob.has(m.id) || typeof m.kun !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(m.kun)) return false;
        noyob.add(m.id);
        return true;
      });
    }
    const s = x.sessiya;
    if (!s) return bosh;
    if (typeof s.id !== 'string' || !['1','2','3','4','5','aralash','xatolar'].includes(s.rejim)) return bosh;
    if (!Array.isArray(s.savollar) || s.savollar.length < 1 || s.savollar.length > 20 || new Set(s.savollar).size !== s.savollar.length) return bosh;
    if (!s.savollar.every((id: unknown) => typeof id === 'string' && xarita.has(id))) return bosh;
    if (!Number.isInteger(s.joriy) || s.joriy < 0 || s.joriy >= s.savollar.length) return bosh;
    if (!Number.isFinite(s.boshlangan) || !Number.isFinite(s.muddat) || s.muddat <= s.boshlangan || s.muddat - s.boshlangan > 180 * 60_000) return bosh;
    if (s.yakunlangan !== null && (!Number.isFinite(s.yakunlangan) || s.yakunlangan < s.boshlangan)) return bosh;
    const javoblar: Record<string, Variant> = {};
    for (const id of s.savollar as string[]) {
      const javob = s.javoblar?.[id];
      if (xarita.get(id)!.variantlar.includes(javob)) javoblar[id] = javob;
    }
    bosh.sessiya = {
      id: s.id, rejim: s.rejim, savollar: s.savollar, javoblar, joriy: s.joriy,
      boshlangan: s.boshlangan, muddat: s.muddat, yakunlangan: s.yakunlangan,
      vaqtTugadi: s.vaqtTugadi === true,
      olinganXp: Number.isInteger(s.olinganXp) && s.olinganXp >= 0 && s.olinganXp <= 20 * TOGRI_XP ? s.olinganXp : 0,
    };
  } catch { /* Saqlangan qiymat buzilgan bo‘lsa yangi holat. */ }
  return bosh;
}
