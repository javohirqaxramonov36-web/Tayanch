// IELTS Listening mashqlari uchun brauzer ovozi (speechSynthesis): inglizcha ovoz tanlash va o'qish.
// Ishlatadi: /uz/ielts/mashq/listening-imlo/, /uz/ielts/mashq/listening-raqamlar/.
// Ovoz tanlash: en-GB afzal; macOS o'yin ovozlari (Bubbles, Zarvox va h.k.) so'zni buzib o'qiydi, chetlatiladi.

export interface IngOvoz {
  /** true: brauzerda ishlatsa bo'ladigan inglizcha ovoz yo'q */
  ovozsiz(): boolean;
  /** Matnni o'qiydi. Massiv bo'lsa, har bo'lak alohida utterance (harflab aytish uchun: orada tabiiy pauza). */
  gapir(matn: string | string[], sekin?: boolean): void;
  toxtat(): void;
}

const OYIN = /^(Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Grandma|Grandpa|Rocko)\b/;
const YAXSHI = /Daniel|Google UK|United Kingdom|Kate|Serena|Arthur/;

/** `holat` ovoz ro'yxati yuklanganda (yoki o'zgarganda) chaqiriladi: ovozsiz holatni ko'rsatish uchun. */
export function ingOvozYarat(holat: (ovozsiz: boolean) => void): IngOvoz {
  const ss: SpeechSynthesis | null = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  let ovoz: SpeechSynthesisVoice | null = null;
  let ovozsiz = !ss;

  function tanla() {
    if (!ss) return;
    const v = ss.getVoices();
    if (!v.length) return; // ro'yxat hali yuklanmagan: lang bilan baribir urinib ko'riladi
    const en = (x: SpeechSynthesisVoice, p: string) => x.lang.toLowerCase().replace('_', '-').startsWith(p);
    const toza = v.filter((x) => en(x, 'en') && !OYIN.test(x.name));
    ovoz = toza.find((x) => en(x, 'en-gb') && YAXSHI.test(x.name))
      ?? toza.find((x) => en(x, 'en-gb'))
      ?? toza.find((x) => x.default)
      ?? toza[0] ?? null;
    ovozsiz = !ovoz;
    holat(ovozsiz);
  }

  if (ss) {
    tanla();
    ss.addEventListener?.('voiceschanged', tanla);
    window.addEventListener('pagehide', () => ss.cancel());
  }

  return {
    ovozsiz: () => ovozsiz,
    gapir(matn, sekin = false) {
      if (!ss || ovozsiz) return;
      ss.cancel();
      for (const bolak of Array.isArray(matn) ? matn : [matn]) {
        const u = new SpeechSynthesisUtterance(bolak);
        u.lang = ovoz?.lang ?? 'en-GB';
        if (ovoz) u.voice = ovoz;
        u.rate = sekin ? 0.6 : 0.85;
        ss.speak(u);
      }
    },
    toxtat() { ss?.cancel(); },
  };
}
