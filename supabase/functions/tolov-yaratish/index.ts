// Deploy: supabase functions deploy tolov-yaratish --no-verify-jwt --use-api
// (JWT kod ichida Supabase Auth orqali tekshiriladi; CORS preflight shlyuzda to'xtab qolmasligi uchun.)
import { inpayTolovYarat } from '../_shared/inpay.ts';
import { inpayKalitRejimi, jurnal, sozlamaniOl, yetishmaydi } from '../_shared/sozlama.ts';
import { adminMijoz } from '../_shared/supabase.ts';
import { OCHIQ_TOLOV_DAQIQA, tolovYaratish } from './handler.ts';

const s = sozlamaniOl((nomi) => Deno.env.get(nomi));
const admin = adminMijoz(s);
const log = (xabar: string, tafsilot?: Record<string, unknown>) => jurnal('tolov-yaratish', xabar, tafsilot);

Deno.serve((req) =>
  tolovYaratish(req, {
    supabaseUrl: s.supabaseUrl,
    saytUrl: s.saytUrl,
    originlar: s.originlar,
    yetishmaydi: yetishmaydi(s, ['supabaseUrl', 'serviceKey', 'inpaySecretKey']),
    foydalanuvchi: async (jwt) => {
      if (!admin) return null;
      const { data, error } = await admin.auth.getUser(jwt);
      return error ? null : data.user?.id ?? null;
    },
    rpc: async (nomi, args) => {
      if (!admin) return { data: null, error: { message: 'server_not_configured' } };
      const { data, error } = await admin.rpc(nomi, args);
      return { data, error: error ? { message: error.message, code: error.code } : null };
    },
    ochiqTolov: async (userId, planCode) => {
      if (!admin) return null;
      const chegara = new Date(Date.now() - OCHIQ_TOLOV_DAQIQA * 60_000).toISOString();
      const { data, error } = await admin
        .from('payments')
        .select('id, raw')
        .eq('user_id', userId)
        .eq('plan_code', planCode)
        .eq('status', 'pending')
        .gt('created_at', chegara)
        .order('created_at', { ascending: false })
        .limit(1);
      if (error || !data?.length) return null;
      const inpay = (data[0].raw as { inpay?: { checkout_url?: unknown; livemode?: unknown } } | null)?.inpay;
      // Sinov kalitidan jonli kalitga o'tilgan bo'lsa eski (sinov) havola berilmaydi.
      const jonli = inpayKalitRejimi(s.inpaySecretKey) === 'live';
      if (typeof inpay?.checkout_url !== 'string' || !inpay.checkout_url.startsWith('https://') || inpay.livemode !== jonli) {
        return null;
      }
      return { payment_id: String(data[0].id), checkout_url: inpay.checkout_url };
    },
    inpayYarat: (sorov) => inpayTolovYarat(sorov, { secretKey: s.inpaySecretKey ?? '' }),
    jurnal: log,
  })
);
