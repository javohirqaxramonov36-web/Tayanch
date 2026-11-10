// inpay-webhook: inPAY v2 hodisalarini qabul qiladi (payment.succeeded, payment.failed, payment.canceled, ...).
//
// 1. Imzo (X-Inpay-Signature, 5 daqiqa) xom tana bo'yicha tekshiriladi. O'tmasa (yo'q, eskirgan yoki noto'g'ri): 401,
//    bazaga hech narsa yozilmaydi. Imzo tekshirilmasdan tana parse ham qilinmaydi.
// 2. Hodisa butunligicha payment_apply_event ga beriladi: bitta tranzaksiyada payment_events (evt_ id unique),
//    payments, subscriptions, audit_log. Takror hodisa "duplicate", hech narsa o'zgarmaydi.
// 3. Javob: qayta ishlansa yoki xato bilan saqlansa 200 (inPAY qayta yubormaydi); baza xatosida 500 (inPAY
//    1 daqiqadan 24 soatgacha jami 8 marta urinadi, IP03).
import { type ImzoNatijasi, webhookImzosiniTekshir } from '../_shared/inpay.ts';
import { jsonJavob } from '../_shared/http.ts';
import type { RpcNatija } from '../_shared/turlar.ts';

/** inPAY hodisasi bir necha KB; undan kattasi imzo hisoblanmasdan rad etiladi. */
export const MAKS_TANA_BAYT = 64 * 1024;

const IMZO_XATOLARI: Record<Exclude<ImzoNatijasi, 'ok'>, [number, string]> = {
  sarlavha_yoq: [401, 'signature_missing'],
  eskirgan: [401, 'signature_expired'],
  notogri: [401, 'signature_invalid'],
};

export interface WebhookBogliqlik {
  webhookSecret?: string;
  yetishmaydi: string[];
  hozirS: () => number;
  rpc: (nomi: string, args: Record<string, unknown>) => Promise<RpcNatija>;
  jurnal: (xabar: string, tafsilot?: Record<string, unknown>) => void;
}

export async function inpayWebhook(req: Request, d: WebhookBogliqlik): Promise<Response> {
  if (req.method !== 'POST') return jsonJavob(405, { error: 'method_not_allowed' });

  if (d.yetishmaydi.length || !d.webhookSecret) {
    // 500: sozlama tuzatilgach inPAY qayta yuborgan xabar qabul qilinadi.
    d.jurnal('sozlama yetishmaydi', { nomlar: d.yetishmaydi });
    return jsonJavob(500, { error: 'server_not_configured' });
  }

  if (Number(req.headers.get('content-length') ?? '0') > MAKS_TANA_BAYT) {
    return jsonJavob(413, { error: 'payload_too_large' });
  }
  const xom = new Uint8Array(await req.arrayBuffer());
  if (xom.byteLength > MAKS_TANA_BAYT) return jsonJavob(413, { error: 'payload_too_large' });

  const imzo = await webhookImzosiniTekshir(xom, req.headers.get('x-inpay-signature'), d.webhookSecret, d.hozirS());
  if (imzo !== 'ok') {
    d.jurnal('imzo rad etildi', { sabab: imzo });
    const [status, kod] = IMZO_XATOLARI[imzo];
    return jsonJavob(status, { error: kod });
  }

  let hodisa: unknown;
  try {
    hodisa = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(xom));
  } catch {
    hodisa = null;
  }
  if (typeof hodisa !== 'object' || hodisa === null || Array.isArray(hodisa)) {
    d.jurnal('tana JSON obyekt emas');
    return jsonJavob(400, { error: 'invalid_json' });
  }

  const h = hodisa as Record<string, unknown>;
  const { data, error } = await d.rpc('payment_apply_event', { p_event: h });
  if (error) {
    if (error.message === 'invalid_event') {
      d.jurnal('hodisa yaroqsiz', { type: typeof h.type === 'string' ? h.type : null });
      return jsonJavob(400, { error: 'invalid_event' });
    }
    d.jurnal('payment_apply_event xatosi', { event_id: h.id, kod: error.code });
    return jsonJavob(500, { error: 'server_error' });
  }

  const n = (typeof data === 'object' && data !== null ? data : {}) as Record<string, unknown>;
  d.jurnal('hodisa', {
    event_id: h.id,
    type: h.type,
    livemode: h.livemode,
    natija: n.result,
    xato: n.error,
    payment_id: n.payment_id,
  });
  return jsonJavob(200, { received: true });
}
