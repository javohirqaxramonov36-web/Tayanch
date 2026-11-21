import { adminMijoz } from '../_shared/supabase.ts';
import { sozlamaniOl } from '../_shared/sozlama.ts';
import { telegramAuth } from './handler.ts';

const sozlama = sozlamaniOl((key) => Deno.env.get(key));
const admin = adminMijoz(sozlama);
const token = Deno.env.get('TELEGRAM_BOT_TOKEN');
Deno.serve((req) => telegramAuth(req, {
  admin, token, originlar: sozlama.originlar,
  jurnal: (bosqich) => console.error('telegram-auth', bosqich),
}));
