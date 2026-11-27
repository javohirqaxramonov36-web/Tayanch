// Progress xotirasi: qaysi qavatda qaysi band (dars, test, qadam) tugatilgani. Faqat brauzerda (localStorage).
// Kalit: tayanch:progress:v1. Shakl: { "sat": { "done": ["id", ...], "known": ["id", ...] }, ... }
//   done  = tugatilgan bandlar; known = sahifa registerItems bilan e'lon qilgan bandlar (jami hisobi uchun).
// Qavatlar: 1 navigator, 2 top-admission, 3 sat, 4 ielts, 5 eyuf (raqam yoki slug bilan berish mumkin).
// localStorage ishlamasa (private rejim, kvota, o'chirilgan) xato bermaydi: shu sahifa davomida xotirada ishlaydi.
// Har o'zgarishda window'ga "tayanch-progress" hodisasi (detail: { floor, itemId }), boshqa tabdagi o'zgarishda ham.

export const PROGRESS_KALITI = 'tayanch:progress:v1';
export const PROGRESS_HODISASI = 'tayanch-progress';

const QAVATLAR = { 1: 'navigator', 2: 'top-admission', 3: 'sat', 4: 'ielts', 5: 'eyuf' } as const;
export type ProgressQavat = (typeof QAVATLAR)[keyof typeof QAVATLAR];
type QavatKirish = ProgressQavat | 1 | 2 | 3 | 4 | 5;
interface QavatYozuv { done: string[]; known: string[] }
type Ombor = Partial<Record<ProgressQavat, QavatYozuv>>;

const SLUGLAR = Object.values(QAVATLAR) as ProgressQavat[];
let zaxira: Ombor = {}; // localStorage ishlamaganda

function qavatSlug(floor: QavatKirish | string | number): ProgressQavat | null {
  if (typeof floor === 'number') return QAVATLAR[floor as keyof typeof QAVATLAR] ?? null;
  return (SLUGLAR as string[]).includes(floor) ? (floor as ProgressQavat) : null;
}

const toza = (x: unknown): string[] => (Array.isArray(x) ? [...new Set(x.filter((s): s is string => typeof s === 'string' && s !== ''))] : []);

function oqi(): Ombor {
  let xom: unknown;
  try {
    const matn = localStorage.getItem(PROGRESS_KALITI);
    if (matn === null) return zaxira;
    xom = JSON.parse(matn);
  } catch {
    return zaxira;
  }
  const natija: Ombor = {};
  if (xom && typeof xom === 'object') {
    for (const slug of SLUGLAR) {
      const q = (xom as Record<string, unknown>)[slug] as Partial<QavatYozuv> | undefined;
      if (q && typeof q === 'object') natija[slug] = { done: toza(q.done), known: toza(q.known) };
    }
  }
  return natija;
}

function yoz(ombor: Ombor): void {
  zaxira = ombor;
  try { localStorage.setItem(PROGRESS_KALITI, JSON.stringify(ombor)); } catch { /* private rejim: xotirada qoladi */ }
}

function xabar(floor: ProgressQavat | null, itemId: string | null): void {
  try { window.dispatchEvent(new CustomEvent(PROGRESS_HODISASI, { detail: { floor, itemId } })); } catch { /* SSR */ }
}

/** Bandni tugatilgan deb belgilaydi. O'zgarish bo'lsa true. */
export function markDone(floor: QavatKirish, itemId: string): boolean {
  const slug = qavatSlug(floor);
  if (!slug || typeof itemId !== 'string' || itemId === '') return false;
  const ombor = oqi();
  const q = ombor[slug] ?? { done: [], known: [] };
  if (q.done.includes(itemId)) return false;
  q.done.push(itemId);
  if (!q.known.includes(itemId)) q.known.push(itemId);
  ombor[slug] = q;
  yoz(ombor);
  xabar(slug, itemId);
  return true;
}

export function isDone(floor: QavatKirish, itemId: string): boolean {
  const slug = qavatSlug(floor);
  return !!slug && (oqi()[slug]?.done.includes(itemId) ?? false);
}

/** Sahifa o'z bandlarini e'lon qiladi, shunda jami (total) to'g'ri hisoblanadi. Belgini o'zgartirmaydi. */
export function registerItems(floor: QavatKirish, itemIds: string[]): void {
  const slug = qavatSlug(floor);
  if (!slug) return;
  const ombor = oqi();
  const q = ombor[slug] ?? { done: [], known: [] };
  const yangi = toza(itemIds).filter((id) => !q.known.includes(id));
  if (yangi.length === 0) return;
  q.known.push(...yangi);
  ombor[slug] = q;
  yoz(ombor);
  xabar(slug, null);
}

/** { done, total }: total = e'lon qilingan va tugatilgan bandlar soni (registerItems chaqirilmagan bo'lsa done bilan teng). */
export function getFloorProgress(floor: QavatKirish): { done: number; total: number } {
  const slug = qavatSlug(floor);
  const q = slug ? oqi()[slug] : undefined;
  return { done: q?.done.length ?? 0, total: q?.known.length ?? 0 };
}

/** Hamma qavatlar: { navigator: { done: [...], total }, ... }. Nusxa qaytadi, o'zgartirish omborga ta'sir qilmaydi. */
export function getAll(): Record<ProgressQavat, { done: string[]; total: number }> {
  const ombor = oqi();
  return Object.fromEntries(SLUGLAR.map((s) => [s, { done: [...(ombor[s]?.done ?? [])], total: ombor[s]?.known.length ?? 0 }])) as Record<ProgressQavat, { done: string[]; total: number }>;
}

// Boshqa tabda o'zgarsa, shu tabga ham hodisa.
try {
  window.addEventListener('storage', (e) => { if (e.key === PROGRESS_KALITI) xabar(null, null); });
} catch { /* SSR */ }
