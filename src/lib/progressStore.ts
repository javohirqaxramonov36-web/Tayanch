// SAT diagnostikasi urinishlarini saqlash interfeysi.
// Hozir localStorage (kalit tayanch:sat-diagnostika). Kelajakda hisob bilan Supabase'ga almashtiriladi:
// komponentlar localStorage'ga to'g'ridan-to'g'ri murojaat qilmaydi, faqat shu interfeys orqali ishlaydi.
// Faqat javoblar, natija va sana saqlanadi. Shaxsiy ma'lumot yo'q.
// Xotira ishlamasa (taqiqlangan, to'la, private rejim) ichki massivga tushadi va mashq to'liq ishlayveradi.
import type { Harf, Natija, XatoTuri } from './diagnostika';

export interface Urinish {
  v: 1;
  id: string;
  /** ISO sana */
  sana: string;
  sekund: number;
  javoblar: Record<string, Harf | null>;
  xatoTurlari: Record<string, XatoTuri>;
  natija: Pick<Natija, 'bolimlar' | 'domenlar'>;
}

export interface ProgressStore {
  /** id bo'yicha upsert. false: brauzer xotirasiga yozilmadi (faqat shu sessiyada qoladi). */
  saveAttempt(u: Urinish): boolean;
  /** Yangisi birinchi. Xato bo'lsa []. */
  getAttempts(): Urinish[];
  clear(): boolean;
}

export const KALIT_DIAGNOSTIKA = 'tayanch:sat-diagnostika';
const ENG_KOP = 20;

function togriUrinish(x: unknown): x is Urinish {
  const u = x as Urinish;
  return !!u && u.v === 1 && typeof u.id === 'string' && typeof u.sana === 'string'
    && typeof u.javoblar === 'object' && typeof u.natija === 'object' && u.natija !== null;
}

export function localProgressStore(kalit: string = KALIT_DIAGNOSTIKA): ProgressStore {
  let xotira: Urinish[] = [];

  const oqi = (): Urinish[] => {
    try {
      const xom = localStorage.getItem(kalit);
      if (!xom) return xotira;
      const m = JSON.parse(xom);
      return Array.isArray(m) ? m.filter(togriUrinish) : xotira;
    } catch {
      return xotira;
    }
  };

  const yoz = (royxat: Urinish[]): boolean => {
    xotira = royxat;
    try {
      localStorage.setItem(kalit, JSON.stringify(royxat));
      return true;
    } catch {
      return false;
    }
  };

  return {
    saveAttempt(u) {
      const boshqalar = oqi().filter((x) => x.id !== u.id);
      return yoz([u, ...boshqalar].slice(0, ENG_KOP));
    },
    getAttempts() {
      return [...oqi()].sort((a, b) => b.sana.localeCompare(a.sana));
    },
    clear() {
      xotira = [];
      try {
        localStorage.removeItem(kalit);
        return true;
      } catch {
        return false;
      }
    },
  };
}
