import { bearerToken, corsSarlavhalari, jsonJavob } from '../_shared/http.ts';

const TANA_LIMITI = 650_000;
const WAV_LIMITI = 44 + 16_000 * 2 * 15;
const MAX_MATN = 500;

interface Bogliqliklar {
  originlar: readonly string[];
  egasi: string | undefined;
  tayyor: boolean;
  foydalanuvchi(jwt: string): Promise<string | null>;
  transkript(wav: Uint8Array<ArrayBuffer>, signal: AbortSignal): Promise<string>;
  javob(savol: string, qavat: number, oldingi: string, signal: AbortSignal): Promise<string>;
  sintez(javob: string, signal: AbortSignal): Promise<Uint8Array>;
}

function wavOqi(base64: string): Uint8Array<ArrayBuffer> | null {
  if (base64.length > Math.ceil(WAV_LIMITI / 3) * 4) return null;
  let bytes: Uint8Array<ArrayBuffer>;
  try { bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)); }
  catch { return null; }
  if (bytes.length <= 44 || bytes.length > WAV_LIMITI || bytes.length % 2) return null;
  const d = new DataView(bytes.buffer);
  if (d.getUint32(0) !== 0x52494646 || d.getUint32(8) !== 0x57415645 ||
      d.getUint32(12) !== 0x666d7420 || d.getUint32(16, true) !== 16 ||
      d.getUint16(20, true) !== 1 || d.getUint16(22, true) !== 1 ||
      d.getUint32(24, true) !== 16_000 || d.getUint32(28, true) !== 32_000 ||
      d.getUint16(32, true) !== 2 || d.getUint16(34, true) !== 16 ||
      d.getUint32(36) !== 0x64617461 || d.getUint32(40, true) !== bytes.length - 44 ||
      d.getUint32(4, true) !== bytes.length - 8) return null;
  return bytes;
}

async function tanaOqi(req: Request): Promise<Record<string, unknown> | null> {
  if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json') || !req.body) return null;
  const oqim = req.body.getReader();
  const dekoder = new TextDecoder('utf-8', { fatal: true });
  let tana = '';
  let hajm = 0;
  try {
    while (true) {
      const { value, done } = await oqim.read();
      if (done) break;
      hajm += value.byteLength;
      if (hajm > TANA_LIMITI) { await oqim.cancel(); return null; }
      tana += dekoder.decode(value, { stream: true });
    }
    const x = JSON.parse(tana + dekoder.decode());
    return x && typeof x === 'object' && !Array.isArray(x) ? x : null;
  } catch {
    return null;
  } finally {
    oqim.releaseLock();
  }
}

function base64Yoz(bytes: Uint8Array): string {
  let matn = '';
  for (let i = 0; i < bytes.length; i += 8192) matn += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(matn);
}

export async function suhbatdosh(req: Request, s: Bogliqliklar): Promise<Response> {
  const cors = corsSarlavhalari(req.headers.get('origin'), s.originlar);
  if (!cors) return jsonJavob(403, { error: 'origin_forbidden' });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const javob = (status: number, tana: unknown) => jsonJavob(status, tana, cors);
  if (req.method !== 'POST') return javob(405, { error: 'method_not_allowed' });
  const jwt = bearerToken(req.headers.get('authorization'));
  if (!jwt) return javob(401, { error: 'not_signed_in' });
  if (!s.egasi) return javob(503, { error: 'server_not_configured' });

  try {
    const id = await s.foydalanuvchi(jwt);
    if (!id) return javob(401, { error: 'not_signed_in' });
    if (id !== s.egasi) return javob(403, { error: 'forbidden' });
    const tana = await tanaOqi(req);
    if (!tana) return javob(400, { error: 'invalid_input' });
    if (tana.amal === 'holat') return javob(200, { tayyor: s.tayyor });
    if (!s.tayyor) return javob(503, { error: 'server_not_configured' });

    const { amal, qavat, matn, audio, oldingi } = tana;
    if (amal !== 'suhbat' || typeof qavat !== 'number' || !Number.isInteger(qavat) || qavat < 1 || qavat > 5 ||
        typeof oldingi !== 'string' || oldingi.length > MAX_MATN) return javob(400, { error: 'invalid_input' });
    const signal = AbortSignal.any([req.signal, AbortSignal.timeout(35_000)]);
    let savol: string;
    if (typeof audio === 'string' && matn === undefined) {
      const wav = wavOqi(audio);
      if (!wav) return javob(400, { error: 'invalid_audio' });
      savol = (await s.transkript(wav, signal)).trim().slice(0, MAX_MATN);
    } else if (typeof matn === 'string' && matn.length <= MAX_MATN && audio === undefined) {
      savol = matn.trim();
    } else {
      return javob(400, { error: 'invalid_input' });
    }
    if (!savol) return javob(422, { error: 'no_speech' });
    const matnJavob = (await s.javob(savol, qavat, oldingi, signal)).trim().slice(0, 800);
    if (!matnJavob) return javob(502, { error: 'reply_unavailable' });
    // Sintez uzilsa, savol va javob oynada o'qilishi mumkin.
    try {
      const tovush = await s.sintez(matnJavob, signal);
      if (tovush.length === 0 || tovush.length > 2_000_000) throw new Error();
      return javob(200, { savol, javob: matnJavob, audio: base64Yoz(tovush) });
    } catch {
      return javob(200, { savol, javob: matnJavob, audio: null });
    }
  } catch {
    return javob(502, { error: 'voice_unavailable' });
  }
}
