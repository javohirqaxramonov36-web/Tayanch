// Tariflar taqqoslash jadvalining telefon tablari (WAI-ARIA tabs, avtomatik faollashuv).
// Sof funksiya: tugma nomidan keyingi tab indeksini qaytaradi, boshqa tugmada null.
export function keyingiTab(joriy: number, tugma: string, soni: number): number | null {
  if (soni <= 0) return null;
  switch (tugma) {
    case 'ArrowRight': return (joriy + 1) % soni;
    case 'ArrowLeft': return (joriy - 1 + soni) % soni;
    case 'Home': return 0;
    case 'End': return soni - 1;
    default: return null;
  }
}
