import type { Guruh, Passage, ReadingTest } from '../reading/sxema';

export interface ListeningGuruh extends Guruh {
  illustration?: { src: string; alt: string };
}

export interface ListeningTest extends ReadingTest {
  audio: { url: string };
  passages: (Omit<Passage, 'groups'> & { groups: ListeningGuruh[] })[];
}

export const LISTENING_KALITLAR = {
  faol: 'tayanch:ielts-listening-faol:v1',
  urinishlar: 'tayanch:ielts-listening-urinishlar:v1',
};
export const LISTENING_QULF = 'tayanch:ielts-listening-qulf:v1';
