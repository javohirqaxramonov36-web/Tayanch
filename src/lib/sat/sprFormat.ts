// SPR (o'zi yoziladigan javob) formatini brauzerda tekshiradi (P06).
// Bu faqat format: to'g'ri yoki noto'g'riligini server (P02 `private.spr_parse` / `spr_equal`) hal qiladi.
// Qoidalar P02 normallashiga mos: .5 = 0.5 = 1/2; kasr surati va maxraji butun son;
// rad: aralash son (1 1/2), vergul (1,5), plyus (+2), maxraj 0, bir nechta minus.

/** Kursdagi belgi chegarasi. Bank va mock avvalgi SPR formatidan foydalanadi. */
export const SPR_UZUNLIK = { musbat: 5, manfiy: 6 };

export type SprNatija =
  | { ok: true; qiymat: string; korinish: string }
  | { ok: false; xabar: string };

const MINUSLAR = /[−–—﹣－]/g;

/** P02 dagi kabi normallash: chetdagi bo'shliq, unicode minus, minusdan keyin va / atrofidagi bo'shliq. */
export function sprNormalla(xom: string): string {
  return (xom ?? '')
    .trim()
    .replace(MINUSLAR, '-')
    .replace(/^-\s+/, '-')
    .replace(/\s*\/\s*/, '/');
}

export function sprTekshir(xom: string, kurs = false): SprNatija {
  if (kurs && xom.length > 100) return { ok: false, xabar: 'Enter a shorter answer.' };
  // Kurs va SQL bir xil bo'shliq to'plamini taniydi.
  const s = sprNormalla(kurs ? xom.replace(/[\u0009-\u000D\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]/g, ' ') : xom);
  if (!s) return { ok: false, xabar: 'Enter an answer.' };
  if (s.includes(',')) return { ok: false, xabar: 'Use a period for decimals, not a comma: 1.5, not 1,5.' };
  if (/^-?\d+\s+\d+\/\d+$/.test(s)) {
    return { ok: false, xabar: 'Mixed numbers are not accepted. For 1 1/2, enter 3/2 or 1.5.' };
  }
  if (s.startsWith('+')) return { ok: false, xabar: 'Leave out the plus sign.' };
  if (/[^0-9./-]/.test(s)) {
    return { ok: false, xabar: 'Use only digits, a period (.), a slash (/) and a minus sign (-).' };
  }
  if (/-/.test(s.slice(1))) return { ok: false, xabar: 'A minus sign can only go at the start of the answer.' };
  const tana = s.replace(/^-/, '');
  if ((tana.match(/\//g) ?? []).length > 1) return { ok: false, xabar: 'Use only one slash (/).' };
  if (tana.includes('/')) {
    const [surat, maxraj] = tana.split('/');
    if (!/^\d+$/.test(surat) || !/^\d+$/.test(maxraj)) {
      return { ok: false, xabar: 'In a fraction, use whole numbers above and below the slash, for example 7/2.' };
    }
    if (/^0+$/.test(maxraj)) return { ok: false, xabar: 'A fraction cannot have 0 below the slash.' };
  } else {
    if ((tana.match(/\./g) ?? []).length > 1) return { ok: false, xabar: 'Use only one decimal point.' };
    if (!/\d/.test(tana)) return { ok: false, xabar: 'Enter at least one digit.' };
  }
  if (kurs) {
    if (s.endsWith('.')) return { ok: false, xabar: 'Enter a digit after the decimal point, or leave out the point.' };
    const chegara = s.startsWith('-') ? SPR_UZUNLIK.manfiy : SPR_UZUNLIK.musbat;
    if (s.length > chegara) return { ok: false, xabar: `The answer can have at most ${chegara} characters.` };
  }
  return { ok: true, qiymat: s, korinish: s.replace('-', '−') };
}
