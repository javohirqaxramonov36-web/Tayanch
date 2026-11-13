// Edge Function sozlamasi muhit o'zgaruvchilaridan. Qiymatlar hech qachon logga yozilmaydi, faqat NOMLARI.
//
// Supabase o'zi beradi: SUPABASE_URL, SUPABASE_SECRET_KEYS (yangi), SUPABASE_SERVICE_ROLE_KEY (eski, hali beriladi).
// Muallif Supabase Secrets'ga qo'yadi: INPAY_SECRET_KEY (sk_test_… / sk_live_…), INPAY_WEBHOOK_SECRET (whsec_…),
// MUVOFIQLASH_SECRET (inpay-muvofiqlash ni chaqirish uchun, o'zi yaratgan tasodifiy satr),
// AI_API_KEY (ai-tutor: Anthropic API kaliti; bo'lmasa AI yopiq).
// Ixtiyoriy kill switch (maxfiy emas): AI_TUTOR_OFF = 1 | true -> ai-tutor provayderga hech narsa yubormaydi.
// Ixtiyoriy (maxfiy emas): SAYT_URL, TOLOV_ORIGINLAR (vergul bilan).

export const STANDART_SAYT_URL = 'https://javohirqaxramonov36-web.github.io/Tayanch';
export const STANDART_ORIGINLAR = [
  'https://javohirqaxramonov36-web.github.io',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
] as const;

export interface Sozlama {
  supabaseUrl?: string;
  serviceKey?: string;
  inpaySecretKey?: string;
  inpayWebhookSecret?: string;
  muvofiqlashSecret?: string;
  aiApiKey?: string;
  aiTutorOff: boolean;
  saytUrl: string;
  originlar: string[];
}

export type MuhitOquvchi = (nomi: string) => string | undefined;

/** SUPABASE_SECRET_KEYS: JSON lug'at (masalan {"default": "sb_secret_…"}); tuzilishi tekshirish kerak, shuning uchun eski kalit zaxira. */
function serviceKalit(o: MuhitOquvchi): string | undefined {
  const yangi = o('SUPABASE_SECRET_KEYS');
  if (yangi) {
    try {
      const lugat = JSON.parse(yangi);
      if (lugat && typeof lugat === 'object') {
        const qiymat = typeof lugat.default === 'string'
          ? lugat.default
          : Object.values(lugat).find((v) => typeof v === 'string');
        if (typeof qiymat === 'string' && qiymat) return qiymat;
      }
    } catch {
      // JSON emas: eski kalitga o'tiladi
    }
  }
  return o('SUPABASE_SERVICE_ROLE_KEY') || undefined;
}

export function sozlamaniOl(o: MuhitOquvchi): Sozlama {
  const originlar = (o('TOLOV_ORIGINLAR') ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  return {
    supabaseUrl: o('SUPABASE_URL')?.replace(/\/+$/, '') || undefined,
    serviceKey: serviceKalit(o),
    inpaySecretKey: o('INPAY_SECRET_KEY') || undefined,
    inpayWebhookSecret: o('INPAY_WEBHOOK_SECRET') || undefined,
    muvofiqlashSecret: o('MUVOFIQLASH_SECRET') || undefined,
    aiApiKey: o('AI_API_KEY') || undefined,
    aiTutorOff: /^(1|true|yes|on)$/i.test((o('AI_TUTOR_OFF') ?? '').trim()),
    saytUrl: (o('SAYT_URL') || STANDART_SAYT_URL).replace(/\/+$/, ''),
    originlar: originlar.length ? originlar : [...STANDART_ORIGINLAR],
  };
}

/** sk_test_ yoki sk_live_ bilan boshlanmasa noto'g'ri (masalan API v1 kaliti: v2'da ishlamaydi). */
export function inpayKalitRejimi(kalit: string | undefined): 'test' | 'live' | null {
  if (!kalit) return null;
  if (kalit.startsWith('sk_test_')) return 'test';
  if (kalit.startsWith('sk_live_')) return 'live';
  return null;
}

/** Yetishmayotgan sozlamalar NOMLARI (logga yozish uchun; qiymat yo'q). */
export function yetishmaydi(s: Sozlama, kerak: ReadonlyArray<keyof Sozlama>): string[] {
  // [maydon, muhit o'zgaruvchisi NOMI] juftliklari (qiymat emas).
  const nomlar = new Map<keyof Sozlama, string>([
    ['supabaseUrl', 'SUPABASE_URL'],
    ['serviceKey', 'SUPABASE_SECRET_KEYS | SUPABASE_SERVICE_ROLE_KEY'],
    ['inpaySecretKey', 'INPAY_SECRET_KEY'],
    ['inpayWebhookSecret', 'INPAY_WEBHOOK_SECRET'],
    ['muvofiqlashSecret', 'MUVOFIQLASH_SECRET'],
    ['aiApiKey', 'AI_API_KEY'],
  ]);
  const xato = kerak.filter((k) => !s[k]).map((k) => nomlar.get(k) ?? String(k));
  if (kerak.includes('inpaySecretKey') && s.inpaySecretKey && !inpayKalitRejimi(s.inpaySecretKey)) {
    xato.push('INPAY_SECRET_KEY (sk_test_ yoki sk_live_ emas)');
  }
  return xato;
}

/** Bitta qatorli JSON log. Kalit, token, JWT va webhook tanasi bu yerga berilmaydi. */
export function jurnal(funksiya: string, xabar: string, tafsilot: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ fn: funksiya, xabar, ...tafsilot }));
}
