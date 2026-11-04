// Deadline kalendari. Yozuv faqat ikki shart bajarilsa ko'rinadi:
//   1) kalendardaKorsatish: true
//   2) manbaIdlar ichida kamida bitta "rasmiy" manba bor.
import { rasmiyManbalar } from './manbalar';
import type { BolimSlug } from './bolimlar';

export interface DeadlineYozuvi {
  id: string;
  dastur: string;
  bolim: BolimSlug;
  bosqich: string;
  sana: string; // YYYY-MM-DD
  soat?: string;
  vaqtMintaqasi?: string;
  manbaIdlar: string[];
  tekshirilganSana: string;
  kalendardaKorsatish: boolean;
}

export const deadlinelar: DeadlineYozuvi[] = [
  {
    id: 'eyuf-2026-2-hujjat',
    dastur: "El-yurt umidi: 2026-yil 2-ochiq stipendiya tanlovi",
    bolim: 'eyuf',
    bosqich: 'Hujjat qabuli (el-yurt.uz/application)',
    sana: '2026-11-15',
    soat: '23:59',
    manbaIdlar: ['EY01'],
    tekshirilganSana: '2026-11-04',
    kalendardaKorsatish: true,
  },
  {
    id: 'turkiye-burslari-2027-ariza',
    dastur: 'Türkiye Bursları: umumiy ariza (har yilgi rasmiy taqvim)',
    bolim: 'top-admission',
    bosqich: 'Ariza: 10-yanvar – 20-fevral',
    sana: '2027-02-20',
    manbaIdlar: ['TB01'],
    tekshirilganSana: '2026-11-04',
    kalendardaKorsatish: true,
  },
];

export function korinadiganDeadlinelar(opts: { bolim?: BolimSlug; faqatKelajak?: boolean } = {}) {
  const bugun = new Date().toISOString().slice(0, 10);
  return deadlinelar
    .filter((d) => d.kalendardaKorsatish)
    .filter((d) => rasmiyManbalar(d.manbaIdlar).length > 0)
    .filter((d) => !opts.bolim || d.bolim === opts.bolim)
    .filter((d) => !opts.faqatKelajak || d.sana >= bugun)
    .sort((a, b) => a.sana.localeCompare(b.sana));
}
