// Top Admission kirishidagi muddat chiptalari: sahifa (index.astro) va kalendar fayli (.ics) bitta manbadan.
// Sanalar deadline.ts dan (EY01, TB01), yangi fakt yo'q.
import { deadlinelar } from './deadline';
import { manbalar, type Manba } from './manbalar';

const OYLAR = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
export const sanaMatn = (iso: string) => {
  const [, oy, kun] = iso.split('-').map(Number);
  return `${kun}-${OYLAR[oy - 1]}`;
};

const m = (id: string) => manbalar.find((x) => x.id === id)!;
const d = (id: string) => deadlinelar.find((x) => x.id === id)!;
const eyuf = d('eyuf-2026-2-hujjat');
const tb = d('turkiye-burslari-2027-ariza');

export interface TaChipta {
  id: string;
  ustki: string;
  katta: string;
  matn: string;
  izoh: string | null;
  manba: Manba;
  ochilish: string | null;
  yopilish: string;
  korishokKatta: string;
  korishokMatn: string;
}

export const taChiptalar: TaChipta[] = [
  {
    id: eyuf.id,
    ustki: "El-yurt umidi · 2026-yil 2-tanlov",
    katta: sanaMatn(eyuf.sana),
    matn: `Hujjat qabuli ${eyuf.soat} gacha`,
    izoh: null,
    manba: m('EY01'),
    ochilish: null,
    yopilish: eyuf.sana,
    korishokKatta: sanaMatn(eyuf.sana),
    korishokMatn: 'oxirgi kun',
  },
  {
    id: tb.id,
    ustki: "Türkiye Bursları · umumiy ariza",
    katta: '10-yanvar – 20-fevral',
    matn: 'Ariza oynasi',
    izoh: "Har yilgi taqvim, 2027 e'loni kutilmoqda",
    manba: m('TB01'),
    // TB01: ariza har yili 10-yanvarda ochiladi; yil deadline.ts dagi yopilish yilidan olinadi.
    ochilish: `${tb.sana.slice(0, 4)}-01-10`,
    yopilish: tb.sana,
    korishokKatta: sanaMatn(tb.sana),
    korishokMatn: 'oxirgi kun',
  },
];
