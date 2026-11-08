// Sonlarni yozish (faqat SAT Math darslari ishlatadi, matn inglizcha): o'nli kasr nuqta bilan (muallif qarori 2026-11-08),
// manfiy belgi "−" (minus), ortiqcha nollarsiz. Boshqa qavatga kerak bo'lsa, vergulli variant alohida qo'shiladi.
export function son(n: number, xona = 2): string {
  if (!Number.isFinite(n)) return '—';
  const yaxlit = Math.round(n * 10 ** xona) / 10 ** xona;
  const t = (Object.is(yaxlit, -0) ? 0 : yaxlit).toFixed(xona).replace(/\.?0+$/, '');
  return t.replace('-', '−');
}

/** Koeffitsientli had: had(1, 'x') -> "x", had(-1, 'x') -> "−x", had(2.5, 'x') -> "2.5x" */
export function had(k: number, harf: string): string {
  if (k === 1) return harf;
  if (k === -1) return '−' + harf;
  return son(k) + harf;
}

/** Qo'shiladigan had ishorasi bilan: qosh(3) -> " + 3", qosh(-3) -> " − 3", qosh(0) -> "" */
export function qosh(k: number, harf = ''): string {
  if (k === 0) return '';
  const abs = Math.abs(k);
  const tana = harf ? (abs === 1 ? harf : son(abs) + harf) : son(abs);
  return (k < 0 ? ' − ' : ' + ') + tana;
}

/** Koordinata juftligi: (1.5, −2) */
export function nuqta(x: number, y: number): string {
  return `(${son(x)}, ${son(y)})`;
}
