// Deploy (muallif qaroridan keyin): supabase functions deploy ai-tutor --no-verify-jwt --use-api
// (JWT kod ichida Supabase Auth orqali tekshiriladi; CORS preflight shlyuzda to'xtab qolmasligi uchun.)
// Secrets: AI_API_KEY (muallif qo'yadi). Ixtiyoriy kill switch: AI_TUTOR_OFF=1.
import { claudeChaqiruv } from '../_shared/anthropic.ts';
import { jurnal, sozlamaniOl, yetishmaydi } from '../_shared/sozlama.ts';
import { adminMijoz } from '../_shared/supabase.ts';
import { aiTutor } from './handler.ts';

const s = sozlamaniOl((nomi) => Deno.env.get(nomi));
const admin = adminMijoz(s);
const ai = s.aiApiKey ? claudeChaqiruv(s.aiApiKey) : null;
const log = (xabar: string, tafsilot?: Record<string, unknown>) => jurnal('ai-tutor', xabar, tafsilot);

Deno.serve((req) =>
  aiTutor(req, {
    originlar: s.originlar,
    yetishmaydi: yetishmaydi(s, ['supabaseUrl', 'serviceKey']),
    aiYopiq: s.aiTutorOff || !ai,
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
    ai: ai ?? (() => Promise.resolve({ ok: false, xato: 'yopiq', inputTokens: 0, outputTokens: 0 })),
    jurnal: log,
  })
);
