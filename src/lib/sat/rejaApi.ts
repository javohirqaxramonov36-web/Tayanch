// P13 reja: Supabase bilan ishlash (hisob bilan). Sahifa faqat shu interfeys orqali gaplashadi; dev'da rejaMock.ts.
// Yozish: reja faqat save_study_plan RPC orqali (kvota plan_rebuilds), vazifada faqat done_at, due_on, week (RLS + ustun huquqi).
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RejaQator, SkillStat, VazifaQator, serverArgumentlari } from './reja.ts';
import type { UsageJavob } from './usageBar.ts';

export interface Profil { target_score: number | null; exam_date: string | null }
export interface FaolReja { plan: RejaQator; tasks: VazifaQator[] }
export type ServerArg = ReturnType<typeof serverArgumentlari>;

export interface RejaApi {
  profil(): Promise<Profil | null>;
  faolReja(): Promise<FaolReja | null>;
  stat(): Promise<SkillStat[]>;
  usage(): Promise<UsageJavob | null>;
  saqla(a: ServerArg): Promise<string>;
  belgila(id: string, doneAt: string | null): Promise<void>;
  kochir(list: { id: string; due_on: string; week: number }[]): Promise<void>;
  ochir(planId: string): Promise<void>;
}

const REJA_USTUN = 'id, exam_date, target_score, hours_per_week, weak_skills, rules_version, start_date, created_at';
const VAZIFA_USTUN = 'id, due_on, title, kind, ref, position, done_at, week, phase, minutes';

export function haqiqiyApi(c: SupabaseClient, uid: string): RejaApi {
  const tekshir = <T>(r: { data: T; error: unknown }): T => { if (r.error) throw r.error; return r.data; };
  return {
    async profil() {
      return tekshir(await c.from('profiles').select('target_score, exam_date').eq('id', uid).maybeSingle()) as Profil | null;
    },
    async faolReja() {
      const plan = tekshir(await c.from('study_plans').select(REJA_USTUN).eq('bolim', 'sat').eq('status', 'active').maybeSingle()) as RejaQator | null;
      if (!plan) return null;
      const tasks = tekshir(await c.from('plan_tasks').select(VAZIFA_USTUN).eq('plan_id', plan.id).order('position')) as VazifaQator[];
      return { plan, tasks };
    },
    async stat() {
      return (tekshir(await c.rpc('plan_skill_stats')) as SkillStat[] | null) ?? [];
    },
    async usage() {
      return tekshir(await c.rpc('usage_status')) as UsageJavob | null;
    },
    async saqla(a) {
      return tekshir(await c.rpc('save_study_plan', a)) as string;
    },
    async belgila(id, doneAt) {
      const d = tekshir(await c.from('plan_tasks').update({ done_at: doneAt }).eq('id', id).select('id')) as unknown[];
      if (!d?.length) throw new Error('not_found');
    },
    async kochir(list) {
      await Promise.all(list.map(async (x) => {
        tekshir(await c.from('plan_tasks').update({ due_on: x.due_on, week: x.week }).eq('id', x.id).select('id'));
      }));
    },
    async ochir(planId) {
      tekshir(await c.from('study_plans').delete().eq('id', planId).select('id'));
    },
  };
}
