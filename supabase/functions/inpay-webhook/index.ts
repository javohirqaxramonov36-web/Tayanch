// Deploy: supabase functions deploy inpay-webhook --no-verify-jwt --use-api
// (inPAY Supabase JWT yubormaydi; so'rov X-Inpay-Signature imzosi bilan tekshiriladi.)
import { jurnal, sozlamaniOl, yetishmaydi } from '../_shared/sozlama.ts';
import { adminMijoz } from '../_shared/supabase.ts';
import { inpayWebhook } from './handler.ts';

const s = sozlamaniOl((nomi) => Deno.env.get(nomi));
const admin = adminMijoz(s);
const log = (xabar: string, tafsilot?: Record<string, unknown>) => jurnal('inpay-webhook', xabar, tafsilot);

Deno.serve((req) =>
  inpayWebhook(req, {
    webhookSecret: s.inpayWebhookSecret,
    yetishmaydi: yetishmaydi(s, ['supabaseUrl', 'serviceKey', 'inpayWebhookSecret']),
    hozirS: () => Math.floor(Date.now() / 1000),
    rpc: async (nomi, args) => {
      if (!admin) return { data: null, error: { message: 'server_not_configured' } };
      const { data, error } = await admin.rpc(nomi, args);
      return { data, error: error ? { message: error.message, code: error.code } : null };
    },
    jurnal: log,
  })
);
