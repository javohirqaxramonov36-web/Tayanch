// Deploy: supabase functions deploy inpay-holat --no-verify-jwt --use-api
// (JWT kod ichida Supabase Auth orqali tekshiriladi; CORS preflight shlyuzda to'xtab qolmasligi uchun.)
import { inpayTolovHolati } from '../_shared/inpay.ts';
import { jurnal, sozlamaniOl, yetishmaydi } from '../_shared/sozlama.ts';
import { adminMijoz } from '../_shared/supabase.ts';
import { inpayHolat } from './handler.ts';

const s = sozlamaniOl((nomi) => Deno.env.get(nomi));
const admin = adminMijoz(s);
const log = (xabar: string, tafsilot?: Record<string, unknown>) => jurnal('inpay-holat', xabar, tafsilot);

Deno.serve((req) =>
  inpayHolat(req, {
    originlar: s.originlar,
    yetishmaydi: yetishmaydi(s, ['supabaseUrl', 'serviceKey', 'inpaySecretKey']),
    foydalanuvchi: async (jwt) => {
      if (!admin) return null;
      const { data, error } = await admin.auth.getUser(jwt);
      return error ? null : data.user?.id ?? null;
    },
    tolovOl: async (id) => {
      if (!admin) return null;
      const { data, error } = await admin
        .from('payments')
        .select('id, user_id, status, provider_order_id')
        .eq('id', id)
        .maybeSingle();
      if (error || !data) return null;
      return {
        id: String(data.id),
        user_id: String(data.user_id),
        status: String(data.status),
        provider_order_id: String(data.provider_order_id),
      };
    },
    rpc: async (nomi, args) => {
      if (!admin) return { data: null, error: { message: 'server_not_configured' } };
      const { data, error } = await admin.rpc(nomi, args);
      return { data, error: error ? { message: error.message, code: error.code } : null };
    },
    inpayHolat: (id) => inpayTolovHolati(id, { secretKey: s.inpaySecretKey ?? '' }),
    jurnal: log,
  })
);
