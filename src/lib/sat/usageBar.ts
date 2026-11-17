// UsageBar (P19): usage_status() javobidan ekrandagi qatorlar. Sof qism (usageQatorlari, tiklanishYozuv) testlanadi,
// usageBarniChiz faqat brauzerda. Limit faqat serverda majburlanadi; bu yerdagi hisob faqat ko'rsatish uchun.
// Matn inglizcha (SAT bo'limi). Qo'rqitish, taymer, "shoshiling" yo'q: faqat qancha ishlatilgani va qachon tiklanishi.

export interface KvotaHolat { max: number; per?: string; used: number; remaining?: number; resets_at?: string }
export interface UsageJavob {
  plan?: { code?: string; name?: string } | null;
  limits?: Record<string, KvotaHolat> | null;
  today?: Record<string, number> | null;
  today_resets_at?: string;
}

export interface UsageQator {
  kalit: string;
  nomi: string;
  /** "3 of 5" yoki cheklovsiz "12" */
  asosiy: string;
  /** "2 left today · Resets at midnight (Tashkent time)" */
  izoh: string;
  /** 0–100, cheklovsiz bo'lsa null (shkala chizilmaydi) */
  foiz: number | null;
  tugagan: boolean;
}

const TOSHKENT = 'Asia/Tashkent';

/** Davr tugash vaqti yozuvi. Kunlik: yarim tun; oylik: sana (Toshkent bo'yicha). */
export function tiklanishYozuv(per: string | undefined, resetsAt?: string): string {
  if (per === 'month') {
    const d = resetsAt ? new Date(resetsAt) : null;
    if (d && !Number.isNaN(d.getTime())) {
      const sana = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: TOSHKENT });
      return `Resets on ${sana} (Tashkent time)`;
    }
    return 'Resets on the 1st of next month (Tashkent time)';
  }
  return 'Resets at midnight (Tashkent time)';
}

const davrSozi = (per?: string) => (per === 'month' ? 'this month' : 'today');

export function usageQatorlari(u: UsageJavob | null | undefined, nomlar: Record<string, string> = {}): UsageQator[] {
  const limits = u?.limits ?? {};
  const today = u?.today ?? {};
  const tartib = Object.keys(nomlar);
  const saralash = (a: string, b: string) => {
    const ia = tartib.indexOf(a), ib = tartib.indexOf(b);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b);
  };

  const cheklangan = Object.keys(limits)
    .filter((k) => Number.isFinite(limits[k]?.max) && limits[k].max >= 0)
    .sort(saralash)
    .map((kalit): UsageQator => {
      const q = limits[kalit];
      // max 0: tarifga kirmagan imkoniyat. "0 of 0" emas, "Not included" (tugagan limit ham emas).
      if (Math.trunc(q.max) === 0) {
        return { kalit, nomi: nomlar[kalit] ?? kalit, asosiy: 'Not included', izoh: 'Not part of your plan', foiz: null, tugagan: false };
      }
      const used = Math.max(0, Math.trunc(q.used ?? 0));
      const max = Math.trunc(q.max);
      const qolgan = Math.max(0, max - used);
      const tugagan = qolgan === 0;
      const tiklanish = tiklanishYozuv(q.per, q.resets_at);
      return {
        kalit,
        nomi: nomlar[kalit] ?? kalit,
        asosiy: `${Math.min(used, max)} of ${max}`,
        izoh: tugagan ? `All used ${davrSozi(q.per)} · ${tiklanish}` : `${qolgan} left ${davrSozi(q.per)} · ${tiklanish}`,
        foiz: max > 0 ? Math.min(100, Math.round((used / max) * 100)) : 100,
        tugagan,
      };
    });

  const cheklovsiz = Object.keys(today)
    .filter((k) => !(k in limits) && Number(today[k]) > 0)
    .sort(saralash)
    .map((kalit): UsageQator => ({
      kalit,
      nomi: nomlar[kalit] ?? kalit,
      asosiy: `${Math.trunc(Number(today[kalit]))} today`,
      izoh: 'No limit on your plan',
      foiz: null,
      tugagan: false,
    }));

  return [...cheklangan, ...cheklovsiz];
}

/** Komponent ildizini (UsageBar.astro, [data-usage-bar]) usage_status javobi bilan to'ldiradi. */
export function usageBarniChiz(ildiz: HTMLElement, u: UsageJavob | null | undefined, nomlar: Record<string, string> = {}) {
  const qatorlar = usageQatorlari(u, nomlar);
  const royxat = ildiz.querySelector<HTMLUListElement>('[data-ub-royxat]');
  const bosh = ildiz.querySelector<HTMLElement>('[data-ub-bosh]');
  const tugadi = ildiz.querySelector<HTMLElement>('[data-ub-tugadi]');
  if (!royxat) return;

  royxat.replaceChildren(...qatorlar.map((q) => {
    const li = document.createElement('li');
    li.className = 'ub-qator';
    if (q.tugagan) li.dataset.tugagan = '';
    const bosh = document.createElement('p');
    bosh.className = 'ub-bosh';
    const nom = Object.assign(document.createElement('span'), { className: 'ub-nom', textContent: q.nomi });
    const son = Object.assign(document.createElement('span'), { className: 'ub-son', textContent: q.asosiy });
    bosh.append(nom, son);
    li.append(bosh);
    if (q.foiz !== null) {
      const chiziq = document.createElement('div');
      chiziq.className = 'ub-chiziq';
      chiziq.setAttribute('aria-hidden', 'true');
      const ichi = document.createElement('span');
      ichi.style.inlineSize = `${q.foiz}%`;
      chiziq.append(ichi);
      li.append(chiziq);
    }
    li.append(Object.assign(document.createElement('p'), { className: 'ub-izoh', textContent: q.izoh }));
    return li;
  }));

  royxat.hidden = qatorlar.length === 0;
  if (bosh) bosh.hidden = qatorlar.length > 0;
  if (tugadi) tugadi.hidden = !qatorlar.some((q) => q.tugagan);
}
