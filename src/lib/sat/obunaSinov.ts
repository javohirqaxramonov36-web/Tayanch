// Obuna sahifasi uchun sun'iy holatlar (P22). FAQAT dev rejimida: sahifa `import.meta.env.DEV` ichida
// dinamik import qiladi, production build'ga kirmaydi. Ochish: /uz/sat/hisob/obuna/?sinov=faol|5kun|tugagan|hech
// Narx, sana va to'lovlar shu yerda to'qilgan namuna; ular haqiqiy hisob yoki bazadan emas.
import type { ObunaYozuv, TolovYozuv } from './obunaHolat';
import type { UsageJavob } from './usageBar';

export type SinovTur = 'faol' | '5kun' | 'tugagan' | 'hech';

export interface SinovMalumot {
  tariflar: { code: string; name: string; price_uzs: number | null; period_days: number | null; features: unknown; limits: unknown }[];
  usage: UsageJavob;
  obunalar: ObunaYozuv[];
  tolovlar: TolovYozuv[];
}

export const sinovTurmi = (s: string | null): s is SinovTur => s === 'faol' || s === '5kun' || s === 'tugagan' || s === 'hech';

export function sinovMalumot(tur: SinovTur, hozir: Date): SinovMalumot {
  const kun = (n: number) => new Date(hozir.getTime() + n * 86_400_000).toISOString();
  const daq = (n: number) => new Date(hozir.getTime() - n * 60_000).toISOString();
  const tariflar = [
    { code: 'free', name: 'Free', price_uzs: null, period_days: null, features: [], limits: {} },
    { code: 'pro', name: 'Pro', price_uzs: 59000, period_days: 30, features: ['analytics_extended', 'Sample feature (test data)'], limits: {} },
  ];
  const tolov = (id: string, status: string, kunOldin: number, test = false): TolovYozuv => ({
    id, plan_name: 'Pro', amount_uzs: 59000, status, provider: 'inpay', created_at: kun(-kunOldin), test,
  });
  const pro = (starts: number, ends: number, status = 'active'): ObunaYozuv => ({ plan_code: 'pro', status, starts_at: kun(starts), ends_at: kun(ends) });
  const usage = (kod: string): UsageJavob => ({ plan: { code: kod, name: kod === 'pro' ? 'Pro' : 'Free' }, limits: {}, today: { questions: 12, sessions: 2 } });

  switch (tur) {
    case 'faol':
      return {
        tariflar, usage: usage('pro'), obunalar: [pro(-10, 20)],
        tolovlar: [
          { ...tolov('3f2a9c1e-0000-4000-8000-000000000001', 'pending', 0), created_at: daq(25) },
          tolov('8b7d6e5f-0000-4000-8000-000000000002', 'paid', 10),
          tolov('1c2d3e4f-0000-4000-8000-000000000003', 'failed', 10),
          { ...tolov('9a8b7c6d-0000-4000-8000-000000000004', 'canceled', 12, true), amount_uzs: 1000 },
        ],
      };
    case '5kun':
      return { tariflar, usage: usage('pro'), obunalar: [pro(-25, 5)], tolovlar: [tolov('8b7d6e5f-0000-4000-8000-000000000002', 'paid', 25)] };
    case 'tugagan':
      return {
        tariflar, usage: usage('free'), obunalar: [pro(-33, -3, 'expired')],
        tolovlar: [{ ...tolov('5e4d3c2b-0000-4000-8000-000000000005', 'pending', 0), created_at: daq(5) }, tolov('8b7d6e5f-0000-4000-8000-000000000002', 'paid', 33)],
      };
    case 'hech':
      return { tariflar, usage: usage('free'), obunalar: [], tolovlar: [] };
  }
}
