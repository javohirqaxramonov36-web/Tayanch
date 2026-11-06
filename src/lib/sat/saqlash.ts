// SAT mashq natijalari: faqat shu brauzerda (localStorage "tayanch:sat:v1").
// Sof JSON, versiya maydoni bilan: keyin login qo'shilsa serverga ko'chirish uchun.
// Har o'qish va yozish try/catch ichida. Saqlash ishlamasa sahifa baribir ishlaydi.

export const KALIT = 'tayanch:sat:v1';
export const KALIT_SESSIYA = 'tayanch:sat:sessiya';
export const KALIT_FILTR = 'tayanch:sat:filtr';

export interface Yozuv {
  urinishlar: number;
  oxirgiJavob: string | null;
  togrimi: boolean | null;
  soniya: number;
  saqlangan: boolean;
  oxirgiSana: string | null; // ISO
}

export interface Holat {
  versiya: 1;
  savollar: Record<string, Yozuv>;
}

const bosh = (): Holat => ({ versiya: 1, savollar: {} });
export const boshYozuv = (): Yozuv => ({ urinishlar: 0, oxirgiJavob: null, togrimi: null, soniya: 0, saqlangan: false, oxirgiSana: null });

/** localStorage ishlaydimi (yozib o'chirib ko'radi). */
export function saqlashIshlaydi(): boolean {
  try {
    const k = 'tayanch:sat:sinov';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function oqi(): Holat {
  try {
    const x = JSON.parse(localStorage.getItem(KALIT) ?? 'null');
    if (x && x.versiya === 1 && x.savollar && typeof x.savollar === 'object') return x as Holat;
  } catch { /* bo'sh holat */ }
  return bosh();
}

export function yoz(h: Holat): boolean {
  try {
    localStorage.setItem(KALIT, JSON.stringify(h));
    return true;
  } catch {
    return false;
  }
}

export function yozuvniYangila(id: string, f: (y: Yozuv) => void): boolean {
  const h = oqi();
  const y = h.savollar[id] ?? boshYozuv();
  f(y);
  h.savollar[id] = y;
  return yoz(h);
}

export function tozala(): boolean {
  try {
    localStorage.removeItem(KALIT);
    sessionStorage.removeItem(KALIT_SESSIYA);
    return true;
  } catch {
    return false;
  }
}

/** Shu sessiyada javob berilgan savollar: sahifa yangilansa javob qayta yozilmaydi. */
export function sessiya(): string[] {
  try {
    const x = JSON.parse(sessionStorage.getItem(KALIT_SESSIYA) ?? '[]');
    return Array.isArray(x) ? x : [];
  } catch {
    return [];
  }
}

export function sessiyagaQosh(id: string) {
  try {
    const s = sessiya();
    if (!s.includes(id)) sessionStorage.setItem(KALIT_SESSIYA, JSON.stringify([...s, id]));
  } catch { /* e'tiborsiz */ }
}

export function sessiyadanOl(id: string) {
  try {
    sessionStorage.setItem(KALIT_SESSIYA, JSON.stringify(sessiya().filter((x) => x !== id)));
  } catch { /* e'tiborsiz */ }
}
