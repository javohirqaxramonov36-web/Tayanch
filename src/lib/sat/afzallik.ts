// SAT o'qish afzalliklari (My SAT profile): standart mashq rejimi va kunlik o'qish maqsadi (daqiqa).
// Saqlash: localStorage `tayanch:sat-afzallik`, hisob bilan P04 orqali user_state ga sinxron (holatBirlashtir.ts).
// Sof funksiyalar (Node testida ishlaydi): src/lib/testlar/afzallik.test.ts. O'qish/yozish sahifada holat.ts orqali.
// Kunlik maqsad variantlari Tayanch tanlovi (muallif tasdiqlagan spetsifikatsiya, 2026-11-13), rasmiy tavsiya emas.

export const AFZALLIK_KALITI = 'tayanch:sat-afzallik';

export type MashqRejim = 'practice' | 'timed';
export const REJIMLAR: readonly { kalit: MashqRejim; nomi: string; izoh: string }[] = [
  { kalit: 'practice', nomi: 'Practice', izoh: 'Check each answer as you go, no timer.' },
  { kalit: 'timed', nomi: 'Timed', izoh: 'A timer runs and answers are checked at the end.' },
];

export const KUNLIK_VARIANTLAR = [15, 30, 45, 60] as const;

export interface Afzallik {
  versiya: 1;
  rejim: MashqRejim;
  /** Kunlik o'qish maqsadi, daqiqa. null: tanlanmagan. */
  kunlikDaqiqa: number | null;
}

export const STANDART_AFZALLIK: Afzallik = { versiya: 1, rejim: 'practice', kunlikDaqiqa: null };

/** Brauzer yoki serverdan kelgan har qanday qiymatni xavfsiz shaklga keltiradi. */
export function afzallikTozala(x: unknown): Afzallik {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return { ...STANDART_AFZALLIK };
  const o = x as Record<string, unknown>;
  const rejim: MashqRejim = o.rejim === 'timed' ? 'timed' : 'practice';
  const d = o.kunlikDaqiqa;
  const kunlikDaqiqa = typeof d === 'number' && (KUNLIK_VARIANTLAR as readonly number[]).includes(d) ? d : null;
  return { versiya: 1, rejim, kunlikDaqiqa };
}
