// AI Tutor kirishi: shaxsiy ma'lumotni tozalash va College Board / sizdirilgan material belgilarini aniqlash.
// Ikkalasi ham evristika: hamma holatni ushlay olmaydi (docs/ai-tutor.md, "Cheklovlar").
// Tozalangan matn AI'ga yuboriladi va tarixga yoziladi; asl matn hech qayerda saqlanmaydi.

/** Tozalash qoidalari: tartib muhim (avval email va havola, keyin raqamlar). */
const SHAXSIY: ReadonlyArray<readonly [RegExp, string]> = [
  [/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email removed]'],
  [/\bhttps?:\/\/\S+/gi, '[link removed]'],
  [/\b(?:t\.me|wa\.me|instagram\.com|facebook\.com)\/\S+/gi, '[link removed]'],
  // O'zbekiston telefoni: +998 90 123 45 67, 998901234567, (90) 123-45-67
  [/(?:\+|\b00)?\s?998[\s-]?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}\b/g, '[phone removed]'],
  [/\+\d[\d\s()-]{8,}\d/g, '[phone removed]'],
  [/\(?\b\d{2}\)?[\s-]\d{3}[\s-]\d{2}[\s-]\d{2}\b/g, '[phone removed]'],
  // Karta (4 tadan guruh) va uzun raqam (karta, JSHSHIR/PINFL 14 xona)
  [/\b\d{4}([ -]?)\d{4}\1\d{4}\1\d{1,7}\b/g, '[number removed]'],
  [/\b\d{12,19}\b/g, '[number removed]'],
  // Pasport / ID karta: AA1234567
  [/\b[A-Z]{2}\s?\d{7}\b/g, '[ID removed]'],
  // Telegram va boshqa @taxallus
  [/(^|[\s(])@[A-Za-z0-9_]{4,32}\b/g, '$1[handle removed]'],
  // "My name is ..." / "Ismim ..." dan keyingi 1-2 so'z
  [/\b(my name is|i am called|call me|ismim|mening ismim|familiyam)\s+[\p{L}'’-]+(?:\s+[\p{L}'’-]+)?/giu, '$1 [name removed]'],
];

export interface Tozalangan {
  matn: string;
  /** Nechta joy almashtirildi. */
  soni: number;
}

export function shaxsiyniTozala(kirish: string): Tozalangan {
  let matn = kirish;
  let soni = 0;
  for (const [naqsh, orniga] of SHAXSIY) {
    matn = matn.replace(naqsh, (...args) => {
      soni++;
      // $1 bor qoidalar uchun birinchi guruhni saqlaymiz
      return orniga.includes('$1') ? orniga.replace('$1', String(args[1] ?? '')) : orniga;
    });
  }
  return { matn, soni };
}

/** Bo'shliqlarni bittaga keltiradi, boshqaruv belgilarini olib tashlaydi. */
export function normallashtir(kirish: string): string {
  return kirish
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏⁠﻿]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Rasmiy SAT savollarining odatiy so'roq iboralari (iqtibos emas: qisqa umumiy naqshlar).
const RASMIY_IBORALAR: readonly RegExp[] = [
  /which choice (?:most logically )?completes the text/i,
  /most logical and precise word or phrase/i,
  /which choice best states the main (?:idea|purpose)/i,
  /which choice best describes the (?:overall )?(?:structure|function)/i,
  /which finding, if true, would most directly (?:support|weaken|undermine)/i,
  /which quotation from .{0,120}most effectively illustrates/i,
  /as used in the text, what does the word/i,
  /conventions of standard english/i,
  /most effectively uses (?:relevant )?(?:data|information) from the (?:table|graph|notes)/i,
  /the student wants to (?:emphasize|present|introduce)/i,
  /\btext\s*1\b[\s\S]{0,1500}\btext\s*2\b/i,
];

const MANBA_BELGILARI: readonly RegExp[] = [
  /college\s*board/i,
  /\bbluebook\b/i,
  /\bquestion\s*id\b/i,
  /\bpractice\s*test\s*#?\s*\d/i,
  /©|\(c\)\s*(?:19|20)\d\d/i,
  /\bquestion\s*bank\b|\bqbank\b/i,
  /\bkhan\s*academy\b/i,
];

const SIZDIRILGAN: readonly RegExp[] = [
  /\b(?:leaked|leak)\b[\s\S]{0,40}\b(?:sat|test|exam|question|passage)s?\b/i,
  /\bprediction\s*(?:test|questions?|passages?|papers?)\b/i,
  /\b(?:real|actual)\s+(?:sat|exam)\s+(?:questions?|passages?)\s+(?:from|on|in)\b/i,
  /\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+20\d\d\s+(?:sat|exam|test)\b[\s\S]{0,60}\b(?:question|passage)s?\b/i,
];

/** Kamida 3 ta har xil A–D javob varianti belgisi: "A) ...", "(B) ...", "C. ...", "D: ...". */
export function variantlarBormi(matn: string): boolean {
  const harflar = new Set<string>();
  for (const m of matn.matchAll(/(?:^|\n|\s)\(?([A-D])[).:]\s+\S/g)) harflar.add(m[1]);
  return harflar.size >= 3;
}

export type CbSabab = 'pasted_question' | 'official_material' | 'leaked_material';

/**
 * College Board / rasmiy test matni yoki sizdirilgan material belgisi bo'lsa sababini qaytaradi.
 * Qisqa savol ("How do I use Bluebook?") rad etilmaydi: faqat belgi + matn hajmi yoki savol shakli birga bo'lsa.
 */
export function cbMatnmi(matn: string): CbSabab | null {
  const uzunlik = matn.length;
  if (SIZDIRILGAN.some((r) => r.test(matn))) return 'leaked_material';
  const variant = variantlarBormi(matn);
  const ibora = RASMIY_IBORALAR.some((r) => r.test(matn));
  const manba = MANBA_BELGILARI.some((r) => r.test(matn));
  if (variant && uzunlik > 20) return 'pasted_question';
  if (ibora && uzunlik > 40) return 'pasted_question';
  if (manba && (uzunlik > 280 || ibora || variant)) return 'official_material';
  if (/\bwhich choice\b/i.test(matn) && uzunlik > 300) return 'pasted_question';
  return null;
}

/** SHA-256 hex (takror so'rovni aniqlash uchun; matnning o'zi saqlanmaydi). */
export async function xesh(matn: string): Promise<string> {
  const b = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(matn)));
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}
