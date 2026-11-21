// Top Admission: grant qo'llanmasi sahifasining sof mantig'i (Admission E-seriya, E4).
// Sahifa: src/pages/uz/top-admission/grantlar/[slug].astro. Sxema: qollanmaSxema (./sxema.ts).
// Qoida: faqat "tasdiqlangan" fakt ko'rinadi. Ro'yxatda tasdiqlanmagan bandlar o'rniga ularning soni
// ("Yana N ta band tekshirilmoqda"); hech biri tasdiqlanmagan bo'lsa "Ma'lumot tekshirilmoqda".
import { faktKorinadimi, sanaMatni, type Fakt } from './fakt.ts';
import { ICHKI_SAHIFALAR } from './grantKatalog.ts';

export const QOLLANMA_OGOH = "Grant shartlari har yili o'zgaradi. Topshirishdan oldin rasmiy sahifani tekshiring.";

export interface QollanmaBosqich {
  nom: string;
  tavsif?: Fakt;
  sana: Fakt;
}

export interface Qollanma {
  kim_topshira_oladi: Fakt[];
  nimani_qoplaydi_batafsil: Fakt[];
  hujjatlar: Fakt[];
  bosqichlar: QollanmaBosqich[];
  ariza_yoli: Fakt;
  rasmiy_faq?: { savol: string; javob: Fakt }[];
  rasmiy_havolalar: { nom: string; url: string }[];
}

/**
 * Qo'llanma sahifasi yaratiladimi: `qollanma` bor va grantning o'z ichki sahifasi yo'q
 * (Türkiye Bursları mavjud sahifasida qoladi, muallif qarori 9, 2026-11-20).
 */
export function qollanmaSahifasiBormi(g: { slug: string; qollanma?: unknown }): boolean {
  return !!g.qollanma && !ICHKI_SAHIFALAR.some((s) => s.grant === g.slug);
}

export interface RoyxatXulosa<T> {
  korinadi: T[];
  /** Tasdiqlanmagan (qoralama yoki topilmadi) bandlar soni. */
  tekshirilmoqda: number;
}

function ajrat<T>(royxat: readonly T[] | undefined, korinadimi: (x: T) => boolean): RoyxatXulosa<T> {
  const r = royxat ?? [];
  const korinadi = r.filter(korinadimi);
  return { korinadi, tekshirilmoqda: r.length - korinadi.length };
}

/** Fakt ro'yxati: faqat tasdiqlanganlari, asl tartibda. */
export const faktRoyxati = (r: readonly Fakt[] | undefined) => ajrat(r, (f) => faktKorinadimi(f));

/** Bosqich ko'rinadi, agar sanasi yoki tavsifi tasdiqlangan bo'lsa (nomi yolg'iz chiqmaydi). */
export const bosqichKorinadimi = (b: QollanmaBosqich) => faktKorinadimi(b.sana) || faktKorinadimi(b.tavsif);
export const bosqichlarRoyxati = (r: readonly QollanmaBosqich[] | undefined) => ajrat(r, bosqichKorinadimi);

/** Rasmiy FAQ: javobi tasdiqlangan savollar. */
export const faqRoyxati = (r: Qollanma['rasmiy_faq']) => ajrat(r, (x) => faktKorinadimi(x.javob));

/** "Yana N ta band tekshirilmoqda" (N > 0 bo'lsa), aks holda bo'sh qator. */
export function qolganMatni(n: number, korinadiSoni: number): string {
  if (n <= 0) return '';
  return korinadiSoni > 0 ? `Yana ${n} ta band tekshirilmoqda` : '';
}

/** Bosqich sanasi: YYYY-MM-DD bo'lsa DD.MM.YYYY, matn bo'lsa o'zgarishsiz. */
export const bosqichSanaMatni = (q: Fakt['qiymat']) => (typeof q === 'string' ? sanaMatni(q) : String(q ?? ''));

/** Sahifa mundarijasi (bo'lim id'lari sahifadagi bilan bir xil). FAQ faqat `rasmiy_faq` bo'lsa. */
export function mundarija(q: Pick<Qollanma, 'rasmiy_faq'>): { id: string; nomi: string }[] {
  return [
    { id: 'kim', nomi: 'Kim topshira oladi' },
    { id: 'qoplash', nomi: 'Nimani qoplaydi' },
    { id: 'hujjatlar', nomi: 'Hujjatlar' },
    { id: 'bosqichlar', nomi: 'Bosqichlar' },
    { id: 'ariza', nomi: 'Ariza qayerga beriladi' },
    ...(q.rasmiy_faq?.length ? [{ id: 'faq', nomi: 'Rasmiy savol-javob' }] : []),
    { id: 'havolalar', nomi: 'Rasmiy havolalar' },
  ];
}
