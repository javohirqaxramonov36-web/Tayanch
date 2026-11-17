// inPAY API v2: to'lov yaratish va webhook imzosini tekshirish.
// Manba: IP03, https://inpay.uz/api/v2/ (2026-11-09 da o'qildi).
// Tashqi bog'liqliksiz (Web Crypto, fetch): Deno'da ham, testda ham bir xil ishlaydi.

export const INPAY_API_URL = 'https://inpay.uz/api/v2';

/** Imzodagi vaqt (t) bilan hozirgi vaqt farqi chegarasi, soniya. inPAY hujjati: 5 daqiqa. */
export const IMZO_MUDDATI_S = 300;

export type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export interface TolovSorovi {
  /** payments.id: Idempotency-Key va metadata.payment_id sifatida ketadi. */
  paymentId: string;
  planCode: string;
  /** So'm, butun son, kamida 1000 (inPAY). */
  amountUzs: number;
  description: string;
  returnUrl: string;
  webhookUrl: string;
}

/** inPAY javobidagi `data` (biz tekshiradigan maydonlar; qolganlari ham saqlanadi). */
export interface InpayTolov {
  id: string;
  status: string;
  checkout_url: string;
  livemode: boolean;
  [maydon: string]: unknown;
}

export type YaratishNatijasi =
  | { ok: true; tolov: InpayTolov }
  | { ok: false; httpStatus: number; code: string; requestId?: string };

export interface YaratishSozlamasi {
  /** sk_test_… yoki sk_live_… (Supabase secret INPAY_SECRET_KEY). */
  secretKey: string;
  fetchFn?: FetchFn;
  timeoutMs?: number;
  /** Qayta urinishdan oldingi kutish (testda 0). */
  kutishMs?: number;
}

export function tolovTanasi(s: TolovSorovi): Record<string, unknown> {
  return {
    amount: s.amountUzs,
    currency: 'UZS',
    description: s.description,
    return_url: s.returnUrl,
    webhook_url: s.webhookUrl,
    metadata: { payment_id: s.paymentId, plan_code: s.planCode },
  };
}

function obyektmi(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

function tolovniTekshir(data: unknown): InpayTolov | null {
  if (!obyektmi(data)) return null;
  const { id, status, checkout_url, livemode } = data;
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
  if (typeof status !== 'string') return null;
  if (typeof checkout_url !== 'string' || !checkout_url.startsWith('https://')) return null;
  if (typeof livemode !== 'boolean') return null;
  return data as InpayTolov;
}

/**
 * POST /payments/. Tarmoq xatosi, 429 yoki 5xx bo'lsa bir marta qayta uriniladi: Idempotency-Key bir xil,
 * shuning uchun inPAY ikkinchi to'lov yaratmaydi (hujjat: bir xil kalit + bir xil mazmun = avvalgi javob).
 */
export async function inpayTolovYarat(s: TolovSorovi, o: YaratishSozlamasi): Promise<YaratishNatijasi> {
  const fetchFn = o.fetchFn ?? fetch;
  const tana = JSON.stringify(tolovTanasi(s));
  let oxirgi: YaratishNatijasi = { ok: false, httpStatus: 0, code: 'network_error' };

  for (let urinish = 1; urinish <= 2; urinish++) {
    if (urinish > 1 && (o.kutishMs ?? 500) > 0) {
      await new Promise((r) => setTimeout(r, o.kutishMs ?? 500));
    }
    let res: Response;
    try {
      res = await fetchFn(`${INPAY_API_URL}/payments/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${o.secretKey}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Idempotency-Key': s.paymentId,
          'X-Request-Id': `tayanch-${s.paymentId}`,
        },
        body: tana,
        signal: AbortSignal.timeout(o.timeoutMs ?? 10_000),
      });
    } catch {
      oxirgi = { ok: false, httpStatus: 0, code: 'network_error' };
      continue;
    }

    let json: unknown = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (res.ok && obyektmi(json) && json.success === true) {
      const tolov = tolovniTekshir(json.data);
      if (tolov) return { ok: true, tolov };
      return { ok: false, httpStatus: res.status, code: 'invalid_response' };
    }

    const xato = obyektmi(json) && obyektmi(json.error) ? json.error : {};
    oxirgi = {
      ok: false,
      httpStatus: res.status,
      code: typeof xato.code === 'string' ? xato.code : `http_${res.status}`,
      ...(typeof xato.request_id === 'string' ? { requestId: xato.request_id } : {}),
    };
    if (res.status !== 429 && res.status < 500) break;
  }
  return oxirgi;
}

// ---------------------------------------------------------------------------
// To'lov holati: GET /payments/{id} (IP03: "Webhook kelmagan yoki shubha bo'lgan holatda holatni shu yerdan tekshiring").
// inPAY holatlari: requires_payment_method, requires_action, processing, succeeded (yakuniy), failed, canceled (yakuniy).
// ---------------------------------------------------------------------------

/** GET javobidagi `data`: bazaga yozishdan oldin tekshiriladigan maydonlar. */
export interface InpayTolovHolati {
  id: string;
  status: string;
  amount: number;
  currency: string;
  livemode: boolean;
  metadata: Record<string, unknown>;
  [maydon: string]: unknown;
}

export type HolatNatijasi =
  | { ok: true; tolov: InpayTolovHolati }
  | { ok: false; httpStatus: number; code: string; requestId?: string };

/** Tayanch ekranidagi uch holat. Faqat `succeeded` to'langan hisoblanadi (IP03). */
export type TayanchHolat = 'pending' | 'success' | 'failed';

export function inpayHolatiniOgir(status: string): TayanchHolat {
  if (status === 'succeeded') return 'success';
  if (status === 'failed' || status === 'canceled') return 'failed';
  return 'pending';
}

function holatniTekshir(data: unknown): InpayTolovHolati | null {
  if (!obyektmi(data)) return null;
  const { id, status, amount, currency, livemode, metadata } = data;
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
  if (typeof status !== 'string' || !/^[a-z_]{1,40}$/.test(status)) return null;
  if (!Number.isSafeInteger(amount) || typeof currency !== 'string' || typeof livemode !== 'boolean') return null;
  return { ...data, id, status, amount: amount as number, currency, livemode, metadata: obyektmi(metadata) ? metadata : {} };
}

export async function inpayTolovHolati(
  inpayId: string,
  o: Omit<YaratishSozlamasi, 'kutishMs'>,
): Promise<HolatNatijasi> {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(inpayId)) return { ok: false, httpStatus: 0, code: 'invalid_id' };
  const fetchFn = o.fetchFn ?? fetch;
  let res: Response;
  try {
    res = await fetchFn(`${INPAY_API_URL}/payments/${inpayId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${o.secretKey}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(o.timeoutMs ?? 8_000),
    });
  } catch {
    return { ok: false, httpStatus: 0, code: 'network_error' };
  }
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  if (res.ok && obyektmi(json) && json.success === true) {
    const tolov = holatniTekshir(json.data);
    return tolov ? { ok: true, tolov } : { ok: false, httpStatus: res.status, code: 'invalid_response' };
  }
  const xato = obyektmi(json) && obyektmi(json.error) ? json.error : {};
  return {
    ok: false,
    httpStatus: res.status,
    code: typeof xato.code === 'string' ? xato.code : `http_${res.status}`,
    ...(typeof xato.request_id === 'string' ? { requestId: xato.request_id } : {}),
  };
}

/** Kassa faol emas (IP03 xato kodi `merchant_inactive`): foydalanuvchiga "vaqtincha ishlamaydi". */
export const kassaFaolEmasmi = (code: string) => code.toLowerCase() === 'merchant_inactive';

// ---------------------------------------------------------------------------
// Webhook imzosi: X-Inpay-Signature: t=<unix>,v1=<hex>; v1 = HMAC-SHA256("{t}.{xom tana}", whsec_…)
// ---------------------------------------------------------------------------

export type ImzoNatijasi = 'ok' | 'sarlavha_yoq' | 'eskirgan' | 'notogri';

export function imzoSarlavhasi(sarlavha: string | null): { t: number; v1: string[] } | null {
  if (!sarlavha) return null;
  let t: number | null = null;
  const v1: string[] = [];
  for (const qism of sarlavha.split(',')) {
    const i = qism.indexOf('=');
    if (i < 0) continue;
    const kalit = qism.slice(0, i).trim();
    const qiymat = qism.slice(i + 1).trim();
    if (kalit === 't' && /^\d{1,12}$/.test(qiymat)) t = Number(qiymat);
    else if (kalit === 'v1' && /^[0-9a-fA-F]{64}$/.test(qiymat)) v1.push(qiymat.toLowerCase());
  }
  return t === null || v1.length === 0 ? null : { t, v1 };
}

async function hmacHex(sir: string, xabar: BufferSource): Promise<string> {
  const kalit = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sir),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const imzo = new Uint8Array(await crypto.subtle.sign('HMAC', kalit, xabar));
  return Array.from(imzo, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Doimiy vaqtli taqqoslash (uzunlik bir xil bo'lgan hex satrlar uchun). */
function tengmi(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let farq = 0;
  for (let i = 0; i < a.length; i++) farq |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return farq === 0;
}

/**
 * Imzo so'rovning XOM tanasi bo'yicha tekshiriladi (JSON'ga aylantirib qayta yozilgan matn mos kelmaydi).
 * @param hozirS hozirgi vaqt, Unix soniya
 */
export async function webhookImzosiniTekshir(
  xomTana: Uint8Array,
  sarlavha: string | null,
  sir: string,
  hozirS: number,
): Promise<ImzoNatijasi> {
  const s = imzoSarlavhasi(sarlavha);
  if (!s) return 'sarlavha_yoq';
  if (Math.abs(hozirS - s.t) > IMZO_MUDDATI_S) return 'eskirgan';
  const old = new TextEncoder().encode(`${s.t}.`);
  const xabar = new Uint8Array(old.length + xomTana.length);
  xabar.set(old, 0);
  xabar.set(xomTana, old.length);
  const kutilgan = await hmacHex(sir, xabar);
  return s.v1.some((v) => tengmi(v, kutilgan)) ? 'ok' : 'notogri';
}
