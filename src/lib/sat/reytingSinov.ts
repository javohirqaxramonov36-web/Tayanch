// Faqat dev: reyting sahifasining sun'iy holatlari (?sinov=mehmon|yangi|azo|kichik|uzun). Production build'da
// sahifa bu faylni import.meta.env.DEV ichida dinamik yuklaydi. Laqablar "Namuna" sifatida, haqiqiy foydalanuvchi emas.
import type { Davr, Doira, Jadval, JadvalQator, MenHolat } from './reyting.ts';

export type SinovTuri = 'mehmon' | 'yangi' | 'azo' | 'kichik' | 'uzun';
export const sinovTurmi = (s: string | null): s is SinovTuri =>
  s === 'mehmon' || s === 'yangi' || s === 'azo' || s === 'kichik' || s === 'uzun';

const asos: MenHolat = {
  today: '2026-11-12', eligible: true, joined: false, hidden: false, nickname: null, nickname_ok: false,
  country: null, show_country: false, xp: { today: 14, week: 61, month: 180 }, daily_cap: 300,
};

export function sinovMen(t: SinovTuri): MenHolat {
  if (t === 'kichik') return { ...asos, eligible: false };
  if (t === 'azo' || t === 'uzun') return { ...asos, joined: true, nickname: 'Sample_You', nickname_ok: true, country: 'UZ', show_country: true };
  return asos;
}

export function sinovJadval(t: SinovTuri, davr: Davr, doira: Doira): Jadval {
  const son = t === 'uzun' ? 60 : 8;
  const qatorlar: JadvalQator[] = Array.from({ length: son }, (_, i) => ({
    rank: i + 1 - (i === 3 ? 1 : 0), // 3 va 4-qator teng XP: bir xil o'rin
    nickname: `Sample_${String(i + 1).padStart(2, '0')}${i === 5 ? '_with_long' : ''}`.slice(0, 20),
    country: doira === 'country' || i % 3 === 0 ? 'UZ' : null,
    xp: (son - i) * (davr === 'week' ? 9 : 31) + (i === 3 ? 9 : 0),
    me: false,
  }));
  let me: JadvalQator | null = null;
  if (t === 'azo') qatorlar[4] = { ...qatorlar[4], nickname: 'Sample_You', me: true };
  if (t === 'uzun') me = { rank: 74, nickname: 'Sample_You', country: 'UZ', xp: 6, me: true };
  return {
    period: davr, scope: doira, country: doira === 'country' ? 'UZ' : null,
    from: davr === 'week' ? '2026-11-09' : '2026-11-01', to: '2026-11-12',
    resets_at: davr === 'week' ? '2026-11-15T19:00:00Z' : '2026-11-30T19:00:00Z',
    rows: qatorlar.slice(0, 50), me,
  };
}
