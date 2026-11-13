// TarifDialog boshqaruvi (src/components/sat/TarifDialog.astro). Faqat brauzerda.
// Yopilgandan keyingi ish (fokusni qaytarish) yopuvchi funksiyada bajariladi: skript bilan close() da
// 'close' hodisasi kelmasligi mumkin (ilova brauzeri), shuning uchun hodisaga tayanilmaydi.
import { satTarif, jadvalQatorlari, kvotaNomi } from '../../data/satTarif';
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
