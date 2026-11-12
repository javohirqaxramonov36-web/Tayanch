// hisob-malumot: foydalanuvchining O'Z ma'lumoti bilan ikki amal (P23, 2026-11-11).
//
// So'rov:  POST, Authorization: Bearer <Supabase sessiya tokeni>
//   {"amal": "eksport"}                       -> 200 {"malumot": {...}}   (serverdagi hamma ma'lumot, JSON)
//   {"amal": "ochirish", "tasdiq": "<email>"} -> 200 {"ok": true}         (hisob va bog'liq ma'lumot o'chadi)
// Xato: {"error": "<kod>"}: not_signed_in 401, bad_request 400, confirmation_mismatch 400, reauth_required 403,
//       payment_in_progress 409, export_failed / delete_failed / server_not_configured 500, method_not_allowed 405.
//
// Qayta autentifikatsiya: JWT dagi `amr` (autentifikatsiya usullari va vaqti) ichidagi eng yangi vaqt
// QAYTA_KIRISH_SONIYA dan eski bo'lmasligi kerak. Token yangilansa ham `amr` vaqti o'zgarmaydi (tekshirish kerak:
// sinov hisobida tasdiqlanadi), shuning uchun eski sessiya bilan o'chirib bo'lmaydi: brauzer avval parol yoki
// Google bilan qayta kiradi. Token imzosi `foydalanuvchi` (auth.getUser) orqali tekshiriladi, keyin payload o'qiladi.
import { bearerToken, corsSarlavhalari, jsonJavob } from '../_shared/http.ts';

export const QAYTA_KIRISH_SONIYA = 10 * 60;

export interface HisobFoydalanuvchi {
  id: string;
  email: string | null;
}

export type OchirishNatija = { ok: true } | { ok: false; xato: string };

export interface MalumotBogliqlik {
  originlar: readonly string[];
  yetishmaydi: string[];
  /** Token imzosini server tekshiradi; yaroqsiz bo'lsa null. */
  foydalanuvchi: (jwt: string) => Promise<HisobFoydalanuvchi | null>;
  eksport: (u: HisobFoydalanuvchi) => Promise<Record<string, unknown>>;
  /** created yoki pending holatdagi to'lov bormi */
  jarayondagiTolov: (userId: string) => Promise<boolean>;
  ochir: (userId: string) => Promise<OchirishNatija>;
  /** Hozirgi vaqt, soniya */
  hozir: () => number;
  jurnal: (xabar: string, tafsilot?: Record<string, unknown>) => void;
}

/** JWT payload'idagi `amr` dan eng yangi autentifikatsiya vaqti (soniya). Imzo bu yerda tekshirilmaydi. */
export function oxirgiKirish(jwt: string): number | null {
  const qism = jwt.split('.')[1];
  if (!qism) return null;
  try {
    const b64 = qism.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(qism.length / 4) * 4, '=');
    const payload = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))));
    const amr = Array.isArray(payload?.amr) ? payload.amr : [];
    const vaqtlar = amr
      .map((x: unknown) => (x && typeof x === 'object' ? Number((x as { timestamp?: unknown }).timestamp) : NaN))
      .filter((n: number) => Number.isFinite(n) && n > 0);
    return vaqtlar.length ? Math.max(...vaqtlar) : null;
  } catch {
    return null;
  }
}

const emailNorm = (s: string) => s.trim().toLowerCase();

export async function hisobMalumot(req: Request, d: MalumotBogliqlik): Promise<Response> {
  const cors = corsSarlavhalari(req.headers.get('origin'), d.originlar);
  if (cors === null) return jsonJavob(403, { error: 'origin_not_allowed' });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const javob = (status: number, tana: unknown) => jsonJavob(status, tana, cors);
  if (req.method !== 'POST') return javob(405, { error: 'method_not_allowed' });

  if (d.yetishmaydi.length) {
    d.jurnal('sozlama yetishmaydi', { nomlar: d.yetishmaydi });
    return javob(500, { error: 'server_not_configured' });
  }

  const jwt = bearerToken(req.headers.get('authorization'));
  const u = jwt ? await d.foydalanuvchi(jwt) : null;
  if (!jwt || !u) return javob(401, { error: 'not_signed_in' });

  let tana: { amal?: unknown; tasdiq?: unknown };
  try {
    tana = await req.json();
  } catch {
    return javob(400, { error: 'bad_request' });
  }

  if (tana?.amal === 'eksport') {
    try {
      const malumot = await d.eksport(u);
      d.jurnal('eksport', { user: u.id });
      return javob(200, { malumot });
    } catch (e) {
      d.jurnal('eksport xatosi', { user: u.id, xato: e instanceof Error ? e.message : 'nomalum' });
      return javob(500, { error: 'export_failed' });
    }
  }

  if (tana?.amal === 'ochirish') {
    if (typeof tana.tasdiq !== 'string' || !u.email || emailNorm(tana.tasdiq) !== emailNorm(u.email)) {
      return javob(400, { error: 'confirmation_mismatch' });
    }
    const kirgan = oxirgiKirish(jwt);
    if (kirgan === null || d.hozir() - kirgan > QAYTA_KIRISH_SONIYA) {
      return javob(403, { error: 'reauth_required' });
    }
    if (await d.jarayondagiTolov(u.id)) return javob(409, { error: 'payment_in_progress' });
    const n = await d.ochir(u.id);
    if (!n.ok) {
      d.jurnal('ochirish xatosi', { user: u.id, xato: n.xato });
      return javob(500, { error: 'delete_failed' });
    }
    d.jurnal('hisob ochirildi', { user: u.id });
    return javob(200, { ok: true });
  }

  return javob(400, { error: 'bad_request' });
}
