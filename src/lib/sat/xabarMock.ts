// FAQAT DEV: Report va feedback'ni bazasiz sinash (sahifalar buni import.meta.env.DEV ichida dinamik import qiladi).
// ?xabar=ok (standart) | takror | limit | xato | kirish — yuborishda shu javob qaytadi.
// "Server" xotirada: sahifa qayta yuklansa ochiq xabarlar yo'qoladi (localStorage ishlatilmaydi).
import type { XabarApi, FikrApi } from './xabar.ts';

type Tur = 'ok' | 'takror' | 'limit' | 'xato' | 'kirish';

const XATO: Record<Exclude<Tur, 'ok'>, unknown> = {
  takror: { code: '23505', message: 'report_duplicate' },
  limit: { code: 'P0001', message: 'report_rate_limited' },
  xato: new TypeError('Failed to fetch'),
  kirish: { code: '42501', message: 'permission denied for table reports' },
};

const kut = (ms: number) => new Promise((r) => setTimeout(r, ms));

function tur(): Tur {
  const t = new URLSearchParams(location.search).get('xabar');
  return t === 'takror' || t === 'limit' || t === 'xato' || t === 'kirish' ? t : 'ok';
}

export function mockXabarApi(): XabarApi {
  const ochiq = new Set<string>();
  return {
    async ochiqlar(qidlar) {
      await kut(150);
      return new Set(qidlar.filter((q) => ochiq.has(q)));
    },
    async yubor({ qid }) {
      await kut(600);
      const t = tur();
      if (t !== 'ok') throw XATO[t];
      if (ochiq.has(qid)) throw XATO.takror;
      ochiq.add(qid);
    },
  };
}

export function mockFikrApi(): FikrApi {
  return {
    async yubor() {
      await kut(600);
      const t = tur();
      if (t === 'limit') throw { code: 'P0001', message: 'feedback_rate_limited' };
      if (t !== 'ok' && t !== 'takror') throw XATO[t];
    },
  };
}
