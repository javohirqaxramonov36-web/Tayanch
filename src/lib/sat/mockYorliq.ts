// Mock imtihon klaviatura yorliqlari (Bluebook'dagi bilan bir xil). Sof mantiq: tugma hodisasidan amalni aniqlaydi.
// Mac: Cmd+Ctrl+X/B/G, boshqa tizimlar: Ctrl+Alt+X/B/G. F1 yorliqlar ro'yxatini ochadi/yopadi.
// Harf `code` bo'yicha tekshiriladi: Alt bilan `key` boshqa belgiga aylanishi mumkin (masalan, Mac'da Option).

export type YorliqAmal = 'keyingi' | 'oldingi' | 'xarita' | 'yorliqlar';

export interface TugmaHodisa {
  key: string;
  code?: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

const HARF: Record<string, YorliqAmal> = { x: 'keyingi', b: 'oldingi', g: 'xarita' };

/** navigator.platform / userAgentData.platform matnidan Mac (va iPad) ekanini aniqlaydi. */
export function macmi(platforma: string): boolean {
  return /mac|iphone|ipad|ipod/i.test(platforma);
}

function harfi(e: TugmaHodisa): string {
  const m = /^Key([A-Z])$/.exec(e.code ?? '');
  if (m) return m[1].toLowerCase();
  return e.key.length === 1 ? e.key.toLowerCase() : '';
}

/** Hodisa yorliq bo'lsa amalni, aks holda null qaytaradi. */
export function yorliqAniqla(e: TugmaHodisa, mac: boolean): YorliqAmal | null {
  if (e.key === 'F1' || e.code === 'F1') {
    return e.metaKey || e.ctrlKey || e.altKey || e.shiftKey ? null : 'yorliqlar';
  }
  if (e.shiftKey) return null;
  const modifikator = mac
    ? e.metaKey && e.ctrlKey && !e.altKey
    : e.ctrlKey && e.altKey && !e.metaKey;
  if (!modifikator) return null;
  return HARF[harfi(e)] ?? null;
}

/** Ekranda ko'rsatish uchun yozuv: Mac'da "⌘ Cmd + Control + X", boshqasida "Ctrl + Alt + X". */
export function yorliqYozuv(harf: string, mac: boolean): string {
  return mac ? `⌘ Cmd + Control + ${harf}` : `Ctrl + Alt + ${harf}`;
}

/** aria-keyshortcuts qiymati: ikkala tizim varianti. */
export function ariaYorliq(harf: string): string {
  return `Meta+Control+${harf} Control+Alt+${harf}`;
}

/** Yorliqlar oynasidagi qatorlar. harf bo'lsa platformaga qarab yoziladi, aks holda `tugma` matni o'zi. */
export const YORLIQLAR: ReadonlyArray<{ amal: string; harf?: string; tugma?: string }> = [
  { amal: 'Next question', harf: 'X' },
  { amal: 'Previous question', harf: 'B' },
  { amal: 'Open or close the question list', harf: 'G' },
  { amal: 'Open or close this list', tugma: 'F1' },
  { amal: 'Choose answer A, B, C or D', tugma: 'A, B, C, D' },
  { amal: 'Move between answer choices', tugma: 'Arrow keys' },
  { amal: 'Close a window', tugma: 'Esc' },
];
