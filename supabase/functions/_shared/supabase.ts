// Service role mijozi (RLS'ni chetlab o'tadi): faqat server ichida, brauzerga hech qachon berilmaydi.
import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
import type { Sozlama } from './sozlama.ts';

export function adminMijoz(s: Sozlama) {
  if (!s.supabaseUrl || !s.serviceKey) return null;
  return createClient(s.supabaseUrl, s.serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
