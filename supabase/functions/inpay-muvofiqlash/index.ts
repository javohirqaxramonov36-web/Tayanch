// Deploy: supabase functions deploy inpay-muvofiqlash --no-verify-jwt --use-api
// (Supabase Cron / pg_net Supabase sessiya JWT sini yubormaydi; so'rov X-Cron-Secret = MUVOFIQLASH_SECRET bilan
// tekshiriladi, doimiy vaqtli solishtirish. Rejalashtirish: supabase/README.md, 10-bo'lim.)
import { inpayTolovHolati } from '../_shared/inpay.ts';
import { jurnal, sozlamaniOl, yetishmaydi } from '../_shared/sozlama.ts';
import { adminMijoz } from '../_shared/supabase.ts';
import { inpayMuvofiqlash } from './handler.ts';

const s = sozlamaniOl((nomi) => Deno.env.get(nomi));
const admin = adminMijoz(s);
const log = (xabar: string, tafsilot?: Record<string, unknown>) => jurnal('inpay-muvofiqlash', xabar, tafsilot);

Deno.serve((req) =>
  inpayMuvofiqlash(req, {
    muvofiqlashSecret: s.muvofiqlashSecret,
    yetishmaydi: yetishmaydi(s, ['supabaseUrl', 'serviceKey', 'inpaySecretKey', 'muvofiqlashSecret']),
    hozirMs: () => Date.now(),
    rpc: async (nomi, args) => {
      if (!admin) return { data: null, error: { message: 'server_not_configured' } };
      const { data, error } = await admin.rpc(nomi, args);
      return { data, error: error ? { message: error.message, code: error.code } : null };
    },
    inpayHolat: (id) => inpayTolovHolati(id, { secretKey: s.inpaySecretKey ?? '' }),
    jurnal: log,
  })
);
