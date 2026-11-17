// "Harf va raqam diktanti" javoblarini tekshirish (/uz/ielts/mashq/listening-raqamlar/).
// Sana: "12 March" ham, "March 12" ham, raqamli 12/03 va 03/12 ham qabul qilinadi (ID03, IDP).
// Raqamlarda bo'shliq, chiziqcha, nuqta va qavs hisobga olinmaydi.

export type RaqamJavob =
  | { tur: 'harf'; matn: string }
  | { tur: 'raqam'; raqamlar: string }
  | { tur: 'sana'; kun: number; oy: number }
  | { tur: 'vaqt'; soat: number; daqiqa: number }
  | { tur: 'son'; qiymat: number };

export const OYLAR = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const OY_NOMI = OYLAR.map((o) => o[0].toUpperCase() + o.slice(1));

const kichik = (s: string) => s.trim().toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ');

function sana(yozgan: string, kun: number, oy: number): boolean {
  const s = kichik(yozgan)
    .replace(/,/g, ' ')
    .replace(/\b(the|of)\b/g, ' ')
    .replace(/(\d+)(st|nd|rd|th)\b/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  const oyNomi = OYLAR[oy - 1];
  if (s === `${kun} ${oyNomi}` || s === `${oyNomi} ${kun}`) return true;
  const m = s.match(/^(\d{1,2})\s*[/.-]\s*(\d{1,2})$/);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  return (a === kun && b === oy) || (a === oy && b === kun);
}

function vaqt(yozgan: string, soat: number, daqiqa: number): boolean {
  const s = kichik(yozgan).replace(/\s+/g, '').replace(/\./g, (_n, i, x) => (/\d/.test(x[i - 1] ?? '') && /\d/.test(x[i + 1] ?? '') ? ':' : ''));
  const m = s.match(/^(\d{1,2}):(\d{2})(am|pm)?$/);
  if (!m) return false;
  const h = Number(m[1]);
  return Number(m[2]) === daqiqa && (h === soat || h === soat + 12 || h - 12 === soat);
}

function son(yozgan: string, qiymat: number): boolean {
  const s = kichik(yozgan)
    .replace(/[£$€%]/g, '')
    .replace(/(?<![a-z])(kilometres?|kilometers?|kilograms?|kilos?|square|metres?|meters?|pounds?|pence|grams?|km|kg|sq|m|p|g)(?![a-z])/g, '')
    .replace(/(\d),(?=\d{3}\b)/g, '$1')
    .replace(/\s+/g, '');
  if (!/^\d+(\.\d+)?$/.test(s)) return false;
  return Math.abs(Number(s) - qiymat) < 1e-9;
}

export function tekshir(yozgan: string, j: RaqamJavob): boolean {
  switch (j.tur) {
    case 'harf': return kichik(yozgan).replace(/[\s'-]/g, '') === j.matn.toLowerCase().replace(/[\s'-]/g, '');
    case 'raqam': return /^[\d\s().+-]+$/.test(yozgan.trim()) && yozgan.replace(/\D/g, '') === j.raqamlar;
    case 'sana': return sana(yozgan, j.kun, j.oy);
    case 'vaqt': return vaqt(yozgan, j.soat, j.daqiqa);
    case 'son': return son(yozgan, j.qiymat);
  }
}

/** Ekranda ko'rsatiladigan to'g'ri javob */
export function javobMatni(j: RaqamJavob): string {
  switch (j.tur) {
    case 'harf': return j.matn;
    case 'raqam': return j.raqamlar;
    case 'sana': return `${j.kun} ${OY_NOMI[j.oy - 1]} (yoki ${OY_NOMI[j.oy - 1]} ${j.kun})`;
    case 'vaqt': return `${j.soat}.${String(j.daqiqa).padStart(2, '0')}`;
    case 'son': return String(j.qiymat);
  }
}
