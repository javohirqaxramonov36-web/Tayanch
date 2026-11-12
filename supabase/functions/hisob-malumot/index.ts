// Deploy: supabase functions deploy hisob-malumot --no-verify-jwt --use-api
// (JWT kod ichida Supabase Auth orqali tekshiriladi; CORS preflight shlyuzda to'xtab qolmasligi uchun.)
// Kerakli sozlama: faqat SUPABASE_URL va service kalit (Supabase o'zi beradi). Yangi secret kerak emas.
import { jurnal, sozlamaniOl, yetishmaydi } from '../_shared/sozlama.ts';
import { adminMijoz } from '../_shared/supabase.ts';
import { hisobMalumot } from './handler.ts';

const s = sozlamaniOl((nomi) => Deno.env.get(nomi));
const admin = adminMijoz(s);
const log = (xabar: string, tafsilot?: Record<string, unknown>) => jurnal('hisob-malumot', xabar, tafsilot);

/**
 * Eksportga kiradigan jadvallar va foydalanuvchi ustuni. Hammasi auth.users ga "on delete cascade" bilan bog'langan
 * (payments: "on delete set null", 20261112090000). Yangi foydalanuvchi jadvali qo'shilsa shu yerga va
 * docs/maxfiylik-jadvali.md ga yoziladi. payments.raw (provayder javobi) eksportga kirmaydi.
 */
const JADVALLAR: Array<{ nomi: string; ustun: string; tanlov?: string }> = [
  { nomi: 'profiles', ustun: 'id' },
  { nomi: 'onboarding_profiles', ustun: 'user_id' },
  { nomi: 'practice_sessions', ustun: 'user_id' },
  { nomi: 'attempts', ustun: 'user_id' },
  { nomi: 'bookmarks', ustun: 'user_id' },
  { nomi: 'review_queue', ustun: 'user_id' },
  { nomi: 'official_tests', ustun: 'user_id' },
  { nomi: 'official_mistakes', ustun: 'user_id' },
  { nomi: 'study_plans', ustun: 'user_id' },
  { nomi: 'plan_tasks', ustun: 'user_id' },
  { nomi: 'user_state', ustun: 'user_id' },
  { nomi: 'vocab_progress', ustun: 'user_id' },
  { nomi: 'user_vocab_words', ustun: 'user_id' },
  { nomi: 'subscriptions', ustun: 'user_id' },
  { nomi: 'usage_counters', ustun: 'user_id' },
  { nomi: 'reports', ustun: 'user_id' },
  { nomi: 'feedback', ustun: 'user_id' },
  { nomi: 'events', ustun: 'user_id' },
  {
    nomi: 'payments',
    ustun: 'user_id',
    tanlov: 'id, bolim, plan_code, provider, provider_order_id, amount_uzs, status, paid_at, created_at, updated_at',
  },
];

const SAHIFA = 1000;

async function jadvalOl(nomi: string, ustun: string, tanlov: string, userId: string): Promise<unknown[] | { error: string }> {
  if (!admin) return { error: 'unavailable' };
  const qatorlar: unknown[] = [];
  for (let dan = 0; ; dan += SAHIFA) {
    const { data, error } = await admin.from(nomi).select(tanlov).eq(ustun, userId).range(dan, dan + SAHIFA - 1);
    if (error) return { error: 'unavailable' };
    qatorlar.push(...(data ?? []));
    if (!data || data.length < SAHIFA) return qatorlar;
  }
}

Deno.serve((req) =>
  hisobMalumot(req, {
    originlar: s.originlar,
    yetishmaydi: yetishmaydi(s, ['supabaseUrl', 'serviceKey']),
    foydalanuvchi: async (jwt) => {
      if (!admin) return null;
      const { data, error } = await admin.auth.getUser(jwt);
      if (error || !data.user) return null;
      return { id: data.user.id, email: data.user.email ?? null };
    },
    eksport: async (u) => {
      if (!admin) throw new Error('admin yoq');
      const { data, error } = await admin.auth.admin.getUserById(u.id);
      if (error || !data.user) throw new Error('foydalanuvchi oqilmadi');
      const x = data.user;
      const jadvallar: Record<string, unknown> = {};
      for (const j of JADVALLAR) jadvallar[j.nomi] = await jadvalOl(j.nomi, j.ustun, j.tanlov ?? '*', u.id);
      return {
        format: 'tayanch-malumot/1',
        yaratilgan: new Date().toISOString(),
        hisob: {
          id: x.id,
          email: x.email ?? null,
          created_at: x.created_at,
          email_confirmed_at: x.email_confirmed_at ?? null,
          last_sign_in_at: x.last_sign_in_at ?? null,
          providers: (x.identities ?? []).map((i) => i.provider),
          user_metadata: x.user_metadata ?? {},
        },
        jadvallar,
      };
    },
    jarayondagiTolov: async (userId) => {
      if (!admin) return true;
      const { count, error } = await admin
        .from('payments')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['created', 'pending']);
      // O'qib bo'lmasa xavfsiz tomonga: o'chirish to'xtaydi.
      return error ? true : (count ?? 0) > 0;
    },
    ochir: async (userId) => {
      if (!admin) return { ok: false, xato: 'admin_yoq' };
      const { count } = await admin.from('payments').select('id', { count: 'exact', head: true }).eq('user_id', userId);
      // Xavfsizlik jurnali: hisob raqami va vaqt, email yo'q (Maxfiylik siyosati, "Qancha saqlanadi").
      const audit = await admin.from('audit_log').insert({
        actor: 'hisob-malumot',
        action: 'account_deleted',
        target_table: 'auth.users',
        target_id: userId,
        details: { payments_unlinked: count ?? 0 },
      });
      if (audit.error) return { ok: false, xato: 'audit' };
      const { error } = await admin.auth.admin.deleteUser(userId);
      return error ? { ok: false, xato: error.message } : { ok: true };
    },
    hozir: () => Math.floor(Date.now() / 1000),
    jurnal: log,
  })
);
