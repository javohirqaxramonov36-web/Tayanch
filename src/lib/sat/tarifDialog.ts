// TarifDialog boshqaruvi (src/components/sat/TarifDialog.astro). Faqat brauzerda.
// Yopilgandan keyingi ish (fokusni qaytarish) yopuvchi funksiyada bajariladi: skript bilan close() da
// 'close' hodisasi kelmasligi mumkin (ilova brauzeri), shuning uchun hodisaga tayanilmaydi.
import { satTarif, jadvalQatorlari, kvotaNomi } from '../../data/satTarif';
import type { SupabaseClient } from '@supabase/supabase-js';
import { kartaRoyxati, taqqoslashJadvali, type KartaBand, type TarifManba } from './tarifJadval';

export interface TarifDialogMalumot {
  sarlavha?: string;
  matn: string;
  /** Tavsiya tarif nomi ("Pro") va uning "What's included" ro'yxati. Bo'sh bo'lsa blok chiqmaydi. */
  tarifNomi?: string;
  royxat?: KartaBand[];
}

/** plans qatorlaridan tavsiya tarif (satTarif.tavsiya) ro'yxati. Tarif bazada yo'q (faol emas) bo'lsa null. */
export function tavsiyaRoyxati(tariflar: readonly (TarifManba & { name?: string })[]): { nomi: string; royxat: KartaBand[] } | null {
  const kod = satTarif.tavsiya;
  const t = tariflar.find((x) => x.code === kod);
  if (!t) return null;
  const jadval = taqqoslashJadvali(tariflar, [kod], jadvalQatorlari, kvotaNomi);
  return { nomi: t.name ?? satTarif.tariflar.find((x) => x.kod === kod)?.nomi ?? kod, royxat: kartaRoyxati(jadval, kod, t.features) };
}

let ochgan: HTMLElement | null = null;
let ulangan = false;

function dialog() {
  return document.getElementById('tarif-dialog') as HTMLDialogElement | null;
}

function yop() {
  const d = dialog();
  if (d?.open) d.close();
  const f = ochgan;
  ochgan = null;
  if (f && f.isConnected && !f.matches(':disabled')) f.focus();
}

function ula(d: HTMLDialogElement) {
  if (ulangan) return;
  ulangan = true;
  d.querySelectorAll<HTMLButtonElement>('[data-td-yop]').forEach((b) => b.addEventListener('click', yop));
  // ESC: brauzer o'zi yopadi, lekin fokusni biz qaytaramiz.
  d.addEventListener('cancel', (e) => { e.preventDefault(); yop(); });
  // Fon (backdrop) bosilsa yopiladi: bosish dialogning o'ziga tushadi, ichki blokka emas.
  d.addEventListener('click', (e) => { if (e.target === d) yop(); });
}

export function tarifDialogOch(m: TarifDialogMalumot, qaytishFokus: HTMLElement | null = null) {
  const d = dialog();
  if (!d) return;
  ula(d);
  const $ = <T extends HTMLElement>(s: string) => d.querySelector<T>(s)!;
  if (m.sarlavha) $('[data-td-sarlavha]').textContent = m.sarlavha;
  $('[data-td-matn]').textContent = m.matn;
  const royxat = m.royxat ?? [];
  $('[data-td-tarif]').hidden = royxat.length === 0;
  $('[data-td-tarif-sarlavha]').textContent = `What ${m.tarifNomi ?? 'Pro'} includes`;
  $('[data-td-royxat]').replaceChildren(...royxat.map((b) => {
    const li = document.createElement('li');
    if (b.qiymat) li.append(Object.assign(document.createElement('b'), { textContent: `${b.nomi}:` }), ` ${b.qiymat}`);
    else li.textContent = b.nomi;
    return li;
  }));
  ochgan = qaytishFokus ?? (document.activeElement as HTMLElement | null);
  if (!d.open) d.showModal();
  $<HTMLElement>('#td-h').focus();
}

/** Dialog uchun ma'lumot manbai: tariflar (plans) va foydalanuvchining amaldagi tarif kodi (usage_status). */
export interface TaklifManba {
  tariflar(): Promise<(TarifManba & { name?: string })[]>;
  joriyKod(): Promise<string | null>;
}

/** Supabase mijozidan manba. Xato bo'lsa bo'sh ro'yxat / null (dialog ro'yxatsiz ochiladi). */
export function supabaseTaklifManba(c: SupabaseClient): TaklifManba {
  return {
    async tariflar() {
      const { data, error } = await c.from('plans').select('code, name, limits, features').eq('bolim', 'sat');
      return error ? [] : ((data ?? []) as (TarifManba & { name?: string })[]);
    },
    async joriyKod() {
      const { data, error } = await c.rpc('usage_status');
      return error ? null : ((data as { plan?: { code?: string } } | null)?.plan?.code ?? null);
    },
  };
}

/**
 * Server limit tugadi desa (quota_exceeded, foydalanuvchi amalidan keyin): tavsiya tarif ro'yxati bilan dialog.
 * Tavsiya tarifdagi (Pro) foydalanuvchiga ochilmaydi: undan yuqori ochiq tarif yo'q. Qaytaradi: ochildimi.
 * Limit oldindan ma'lum bo'lsa sahifa tugmani o'chiq qiladi va sababini yozadi: bu funksiya chaqirilmaydi.
 */
export async function tarifTaklifiniOch(manba: TaklifManba, matn: string, qaytishFokus: HTMLElement | null, sarlavha?: string): Promise<boolean> {
  const [kod, tariflar] = await Promise.all([manba.joriyKod().catch(() => null), manba.tariflar().catch(() => [])]);
  if (kod === satTarif.tavsiya) return false;
  const t = tavsiyaRoyxati(tariflar);
  tarifDialogOch({ sarlavha, matn, tarifNomi: t?.nomi, royxat: t?.royxat }, qaytishFokus);
  return true;
}
