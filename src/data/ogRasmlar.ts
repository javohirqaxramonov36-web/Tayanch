// Ulashish rasmlari (og:image): har qavatga bitta, 1200×630 WebP, public/og/ ichida.
// Rasmlar scripts/og-rasm-yasash.mjs bilan yasaladi; prompt va kredit: docs/og-rasmlar.md.
// alt: SAT inglizcha (3-qavat qoidasi), qolganlari o'zbekcha.
import type { BolimSlug } from './bolimlar';

export type OgSlug = 'navigator' | BolimSlug;

export const OG_KENGLIK = 1200;
export const OG_BALANDLIK = 630;

export const ogRasmlar: Record<OgSlug, { fayl: string; alt: string }> = {
  navigator: {
    fayl: '/og/navigator.webp',
    alt: "Ertalabki shahar ko'rinadigan deraza oldidagi stol: kompas, xarita, daftar va choy piyolasi. Tayanch, 1-qavat: Navigator.",
  },
  'top-admission': {
    fayl: '/og/top-admission.webp',
    alt: "Kutubxona stolida konvertlar, pero ruchka va choy piyolasi. Tayanch, 2-qavat: Top Admission.",
  },
  sat: {
    fayl: '/og/sat.webp',
    alt: 'A hand sketching on grid paper next to a laptop, a calculator and a cup of green tea. Tayanch, Floor 3: SAT prep.',
  },
  ielts: {
    fayl: '/og/ielts.webp',
    alt: "Kechki o'qish burchagi: ochiq kitob ushlagan qo'llar, quloqchin va choy piyolasi. Tayanch, 4-qavat: IELTS prep.",
  },
  eyuf: {
    fayl: '/og/eyuf.webp',
    alt: "Aeroport ko'rinadigan deraza oldida atlas ro'molli chamadon va ryukzak. Tayanch, 5-qavat: EYUF prep.",
  },
};

/** Sahifa yo'lidan (base bilan yoki base'siz) qavatni topadi: /uz/<bolim>/... bo'lmasa 1-qavat. */
export function ogQavat(pathname: string): OgSlug {
  const m = pathname.match(/\/uz\/(top-admission|sat|ielts|eyuf)(\/|$)/);
  return (m?.[1] as OgSlug | undefined) ?? 'navigator';
}
