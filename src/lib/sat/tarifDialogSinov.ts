// FAQAT DEV: TarifDialog uchun to'qilgan tariflar (haqiqiy tarif emas). Sahifalar uni `import.meta.env.DEV` ichida
// dinamik import qiladi (mock rejimi), production build'ga kirmaydi.
import type { TaklifManba } from './tarifDialog';

export const namunaTaklifManba = (joriy = 'free'): TaklifManba => ({
  tariflar: async () => [
    { code: 'free', name: 'Free', limits: { questions: { max: 20, per: 'day' } }, features: [] },
    { code: 'pro', name: 'Pro', limits: {}, features: ['analytics_extended', 'Sample plan text (test data)'] },
  ],
  joriyKod: async () => joriy,
});
