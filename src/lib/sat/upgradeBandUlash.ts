// Yon paneldagi "Upgrade to Pro" bandini to'ldiradi (BolimYon, faqat SAT). Brauzerda.
// supabase-js yuklanmaydi: sessiya tokeni localStorage `tayanch:auth` dan o'qiladi (hisobHolat.ts kabi; saqlash
// formati Supabase'ning ichki ishi: o'qib bo'lmasa band yashirin qoladi), REST'ga 2 ta so'rov: usage_status va plans.
// Natija sessionStorage `tayanch:sat-tarif-kesh` da 10 daqiqa (foydalanuvchi id bilan). Xato bo'lsa band ko'rinmaydi.
// Dev: ?upgrade=sinov (namuna tariflar, faqat DEV dinamik import).
import { satTarif, jadvalQatorlari, kvotaNomi } from '../../data/satTarif';
import { hisobSozlama } from '../../data/hisobSozlama';
import { bandKorinadimi, keshYaroqli, upgradeIzohi, KESH_KALITI, type Kesh } from './upgradeBand';
import type { TarifManba } from './tarifJadval';

type Tarif = TarifManba & { name?: string };
interface KeshF extends Kesh { uid: string }

function sessiya(): { token: string; uid: string } | null {
  try {
    const x = JSON.parse(localStorage.getItem(hisobSozlama.sessiyaKaliti) ?? 'null');
    const token = x?.access_token;
    const uid = x?.user?.id;
    const tugash = Number(x?.expires_at); // soniya
    if (typeof token !== 'string' || typeof uid !== 'string') return null;
    if (Number.isFinite(tugash) && tugash * 1000 <= Date.now()) return null;
    return { token, uid };
  } catch {
    return null;
  }
}

const keshOqi = (): unknown => { try { return JSON.parse(sessionStorage.getItem(KESH_KALITI) ?? 'null'); } catch { return null; } };
const keshYoz = (k: KeshF) => { try { sessionStorage.setItem(KESH_KALITI, JSON.stringify(k)); } catch { /* xotira yopiq */ } };
export const tarifKeshiniTozala = () => { try { sessionStorage.removeItem(KESH_KALITI); } catch { /* */ } };

function xulosa(plan: string | null, tariflar: Tarif[]): Kesh {
  const t = tariflar.find((x) => x.code === satTarif.tavsiya);
  return {
    vaqt: Date.now(),
    plan,
    izoh: upgradeIzohi(tariflar, satTarif.tavsiya, jadvalQatorlari, kvotaNomi),
    tarifNomi: t?.name ?? null,
  };
}

function chiz(ildiz: HTMLElement, k: Kesh) {
  const korinadi = bandKorinadimi(k.plan) && !!k.tarifNomi;
  ildiz.hidden = !korinadi;
  if (!korinadi) return;
  const nom = `Upgrade to ${k.tarifNomi}`;
  const izoh = k.izoh ?? 'Compare plans';
  ildiz.querySelector('[data-upgrade-nom]')!.textContent = nom;
  ildiz.querySelector('[data-upgrade-izoh]')!.textContent = izoh;
  const a = ildiz.querySelector<HTMLAnchorElement>('a')!;
  a.setAttribute('aria-label', `${nom}: ${izoh}`);
  a.title = `${nom}: ${izoh}`;
}

export async function upgradeBandUlash() {
  const ildiz = document.querySelector<HTMLElement>('[data-upgrade-band]');
  if (!ildiz) return;

  if (import.meta.env.DEV && new URLSearchParams(location.search).get('upgrade') === 'sinov') {
    const m = (await import('./tarifDialogSinov')).namunaTaklifManba();
    chiz(ildiz, xulosa(await m.joriyKod(), await m.tariflar()));
    return;
  }

  const url = import.meta.env.PUBLIC_SUPABASE_URL as string | undefined;
  const kalit = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string | undefined;
  const s = sessiya();
  if (!url || !kalit || !s) { tarifKeshiniTozala(); return; }

  const k = keshOqi();
  if (keshYaroqli(k, Date.now()) && (k as KeshF).uid === s.uid) { chiz(ildiz, k); return; }

  try {
    const h = { apikey: kalit, Authorization: `Bearer ${s.token}`, 'Content-Type': 'application/json' };
    const [u, p] = await Promise.all([
      fetch(`${url}/rest/v1/rpc/usage_status`, { method: 'POST', headers: h, body: '{}' }),
      fetch(`${url}/rest/v1/plans?select=code,name,limits,features&bolim=eq.sat`, { headers: h }),
    ]);
    if (!u.ok || !p.ok) return;
    const usage = (await u.json()) as { plan?: { code?: string } } | null;
    const tariflar = (await p.json()) as Tarif[];
    const x = xulosa(usage?.plan?.code ?? null, Array.isArray(tariflar) ? tariflar : []);
    keshYoz({ ...x, uid: s.uid });
    chiz(ildiz, x);
  } catch {
    /* tarmoq xatosi: band yashirin qoladi */
  }
}
