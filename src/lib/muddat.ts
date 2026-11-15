// Qolgan kun hisobi: hamma joyda bir xil (2-qavat chiptalari, SAT maqsad sarlavhasi).
// Bugungi sana Toshkent bo'yicha (Asia/Tashkent), sanalar YYYY-MM-DD qatori sifatida solishtiriladi.
// Sof funksiyalar: brauzer va node --test ikkalasida ishlaydi.

const SANA_NAQSH = /^\d{4}-\d{2}-\d{2}$/;

/** Toshkent vaqti bo'yicha sana, YYYY-MM-DD. Intl ishlamasa UTC sanasi. */
export function toshkentBugun(hozir: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent' }).format(hozir);
  } catch {
    return hozir.toISOString().slice(0, 10);
  }
}

/** YYYY-MM-DD shaklida va kalendarda bor sanami (masalan 2027-02-30 emas). */
export function sanaTogri(s: unknown): s is string {
  if (typeof s !== 'string' || !SANA_NAQSH.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** a dan b gacha butun kunlar (b - a). Ikkalasi YYYY-MM-DD. */
export function kunFarqi(a: string, b: string): number {
  const k = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((k(b) - k(a)) / 864e5);
}

/** Sanaga n yil qo'shadi (29-fevral → 28-fevral). */
export function yilQosh(sana: string, n: number): string {
  const [y, m, d] = sana.split('-').map(Number);
  const yy = y + n;
  const oxirgi = new Date(Date.UTC(yy, m, 0)).getUTCDate();
  const p = (x: number) => String(x).padStart(2, '0');
  return `${yy}-${p(m)}-${p(Math.min(d, oxirgi))}`;
}

export type KunTuri = 'kelajak' | 'bugun' | 'otgan';

/** Sana bugunga nisbatan qayerda: kelajak (kun > 0), bugun (0), o'tgan (kun < 0). */
export function kunHolati(bugun: string, sana: string): { tur: KunTuri; kun: number } {
  const kun = kunFarqi(bugun, sana);
  return { tur: kun > 0 ? 'kelajak' : kun === 0 ? 'bugun' : 'otgan', kun };
}

const KUN_MS = 86_400_000;

/** Mintaqa ko‘rsatilmasa, kalendar kunining UTC−12 dagi oxirini kutamiz. */
export function muddatChegarasi(sana: string, soat?: string, utcSiljish?: number) {
  const kun = Date.parse(`${sana}T00:00:00Z`) - (utcSiljish ?? -720) * 60_000;
  const [s, d] = (soat ?? '23:59').split(':').map(Number);
  const oxir = utcSiljish === undefined ? kun + KUN_MS : kun + (s * 60 + d + 1) * 60_000;
  return { kun, oxir };
}

export function muddatHolati(hozir: number, kun: number, oxir: number): string {
  if (hozir >= oxir) return 'Tugadi';
  if (hozir >= kun) return 'Bugun tugaydi';
  return `${Math.ceil((kun - hozir) / KUN_MS)} kun qoldi`;
}
