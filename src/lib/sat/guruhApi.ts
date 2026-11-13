// P34 guruhlar: Supabase RPC o'rami. Hamma o'qish va yozish faqat public.group_* funksiyalari orqali
// (jadvallarga to'g'ridan-to'g'ri yozish huquqi yo'q). Xato kodi GuruhXatosi.kod da.
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  GURUH_ROZILIK_VERSIYA, kodniTozala, xatoKodi,
  type GuruhNatija, type GuruhXato, type Korinish, type MeningGuruhlarim, type OqituvchiHolat,
} from './guruh';

export class GuruhXatosi extends Error {
  constructor(public kod: GuruhXato) { super(kod); }
}

async function rpc<T>(c: SupabaseClient, nom: string, args?: Record<string, unknown>): Promise<T> {
  let natija;
  try { natija = await c.rpc(nom, args); } catch { throw new GuruhXatosi('network'); }
  if (natija.error) throw new GuruhXatosi(xatoKodi(natija.error));
  const d = natija.data as T & { error?: string };
  // Kod topilmasa server exception emas, {"error": "not_found"} qaytaradi (urinish yozuvi saqlanishi uchun).
  if (d && typeof d === 'object' && 'error' in d && typeof d.error === 'string') {
    throw new GuruhXatosi(xatoKodi({ message: d.error }));
  }
  return d;
}

export interface Ruxsat {
  summary: boolean;
  topics: boolean;
  guardianName?: string;
  guardianConfirm?: boolean;
}

export function guruhApi(c: SupabaseClient) {
  return {
    oqituvchi: () => rpc<OqituvchiHolat>(c, 'group_teacher_overview'),
    yarat: (nom: string, ustoz: string) => rpc<string>(c, 'group_create', { p_name: nom, p_teacher_name: ustoz }),
    kodniYangila: (g: string) => rpc<string>(c, 'group_rotate_code', { p_group: g }),
    arxivla: (g: string) => rpc<null>(c, 'group_archive', { p_group: g }),
    ochir: (g: string) => rpc<null>(c, 'group_delete', { p_group: g }),
    azoniChiqar: (g: string, m: string) => rpc<null>(c, 'group_remove_member', { p_group: g, p_member: m }),
    natija: (g: string) => rpc<GuruhNatija>(c, 'group_progress', { p_group: g }),
    korinish: (kod: string) => rpc<Korinish>(c, 'group_preview', { p_code: kodniTozala(kod) }),
    qoshil: (kod: string, ism: string, r: Ruxsat) => rpc<{ id: string }>(c, 'group_join', {
      p_code: kodniTozala(kod), p_member_name: ism, p_share_summary: r.summary, p_share_topics: r.topics,
      p_consent_version: GURUH_ROZILIK_VERSIYA, p_guardian_name: r.guardianName ?? null, p_guardian_confirm: r.guardianConfirm ?? null,
    }),
    meningGuruhlarim: () => rpc<MeningGuruhlarim>(c, 'group_my_memberships'),
    ruxsatniYangila: (m: string, r: Ruxsat) => rpc<null>(c, 'group_update_sharing', {
      p_member: m, p_share_summary: r.summary, p_share_topics: r.topics, p_consent_version: GURUH_ROZILIK_VERSIYA,
      p_guardian_name: r.guardianName ?? null, p_guardian_confirm: r.guardianConfirm ?? null,
    }),
    chiq: (m: string) => rpc<null>(c, 'group_leave', { p_member: m }),
  };
}

export type GuruhApi = ReturnType<typeof guruhApi>;
