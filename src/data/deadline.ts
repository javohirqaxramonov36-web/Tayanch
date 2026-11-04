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

export const deadlinelar: DeadlineYozuvi[] = [];

export function korinadiganDeadlinelar(opts: { bolim?: BolimSlug; faqatKelajak?: boolean } = {}) {
  const bugun = new Date().toISOString().slice(0, 10);
  return deadlinelar
    .filter((d) => d.kalendardaKorsatish)
    .filter((d) => rasmiyManbalar(d.manbaIdlar).length > 0)
    .filter((d) => !opts.bolim || d.bolim === opts.bolim)
    .filter((d) => !opts.faqatKelajak || d.sana >= bugun)
    .sort((a, b) => a.sana.localeCompare(b.sana));
}
