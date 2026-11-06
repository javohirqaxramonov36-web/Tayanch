// IELTS darslari savollarini ikkinchi, mustaqil usul bilan tekshirish (scripts/savollarni-tekshir.ts o'qiydi).
// Sonli hisob yo'q: javob qoida bo'yicha qayta yechiladi va to'g'ri variant matni qaytariladi.
// TFNG: parchaning har gapi da'voga nisbatan alohida baholanadi (mos / zid / aloqasiz) va dalil ibora gapda borligi tekshiriladi.
//   Qoida (IE02): zid gap bor → False; zid yo'q, mos gap bor → True; ikkalasi ham yo'q → Not Given.
// Sarlavha: paragrafning majburiy qismlari (har biri matndagi belgi ibora bilan) va har sarlavha qamrovi jadvali.
//   Qoida: sarlavha hamma majburiy qismni qamrasa va matnda yo'q fikr qo'shmasa, mos. Faqat bitta sarlavha o'tishi shart.
// Fayl node bilan to'g'ridan-to'g'ri ishlaydi: qiymat importlari .ts kengaytmasi bilan.
import { irTfngSavollar } from './ir-tfng.ts';
import { irSarlavhaSavollar } from './ir-sarlavha.ts';
import type { BolimTekshiruv, Natija } from '../tekshiruvTurlar.ts';
import type { DarsSavol } from './turlar.ts';

const topish = (id: string): DarsSavol => [...irTfngSavollar, ...irSarlavhaSavollar].find((s) => s.id === id)!;
const gaplar = (parcha: string) => parcha.split(/(?<=\.)\s+/);

// ---------- TFNG ----------
type Munosabat = 'mos' | 'zid' | '-';
/** Har gap uchun: munosabat va (mos/zid bo'lsa) gapdagi dalil ibora */
const tfngJadval: Record<string, [Munosabat, string?][]> = {
  'ir-tfng-1': [['-'], ['-'], ['mos', 'every day except Monday']],
  'ir-tfng-2': [['-'], ['-'], ['zid', 'more than half of its weekly hours are filled with news and interviews']],
  'ir-tfng-3': [['-'], ['-'], ['-']],
  'ir-tfng-4': [['-'], ['-'], ['-']],
  'ir-tfng-5': [['-'], ['zid', 'sold slowly at first'], ['-']],
};

function tfng(id: string): Natija {
  const s = topish(id);
  const g = gaplar(s.parcha ?? '');
  const j = tfngJadval[id];
  if (g.length !== j.length) return { qiymat: `FARQ: parchada ${g.length} gap, jadvalda ${j.length}`, usul: '' };
  const qatorlar: string[] = [];
  for (let k = 0; k < g.length; k++) {
    const [m, ibora] = j[k];
    if (m !== '-' && !(ibora && g[k].includes(ibora))) return { qiymat: `FARQ: ${k + 1}-gapda "${ibora}" yo'q`, usul: '' };
    qatorlar.push(`${k + 1}-gap: ${m === '-' ? "da'vo omiliga tegmaydi" : `${m} («${ibora}»)`}`);
  }
  const javob = j.some(([m]) => m === 'zid') ? 'False' : j.some(([m]) => m === 'mos') ? 'True' : 'Not Given';
  return { qiymat: javob, usul: `Qoida: zid → False, mos → True, yo'q → Not Given · ${qatorlar.join(' · ')}` };
}

// ---------- Sarlavha ----------
interface SarlavhaJadval {
  /** Majburiy qism nomi → parchadagi belgi ibora */
  qismlar: Record<string, string>;
  /** Har variant: qamragan qismlar va matnda yo'q fikr qo'shadimi */
  variantlar: { qamrov: string[]; tashqi?: boolean; izoh: string }[];
}

const sarlavhaJadval: Record<string, SarlavhaJadval> = {
  'ir-sarlavha-1': {
    qismlar: { "umumiy holatga qarshi": 'however', "bozor o'sgan": 'the market has grown' },
    variantlar: [
      { qamrov: [], izoh: 'faqat fon (supermarketlar)' },
      { qamrov: ["umumiy holatga qarshi", "bozor o'sgan"], izoh: 'ikkala qism' },
      { qamrov: [], izoh: 'faqat detal (yopiq joy)' },
      { qamrov: [], tashqi: true, izoh: "dehqonchilik tarixi matnda yo'q" },
    ],
  },
  'ir-sarlavha-2': {
    qismlar: { foyda: 'felt less tired', qiyinchilik: 'found the new timetable difficult' },
    variantlar: [
      { qamrov: [], tashqi: true, izoh: "kechikish sababi matnda yo'q" },
      { qamrov: ['qiyinchilik'], izoh: 'faqat salbiy qism' },
      { qamrov: ['foyda', 'qiyinchilik'], izoh: 'ikkala qism (aralash)' },
      { qamrov: ['foyda'], izoh: 'faqat ijobiy qism' },
    ],
  },
  'ir-sarlavha-3': {
    qismlar: { muammo: 'people were unsure', yechim: 'printed simple pictures', natija: 'correctly sorted waste had risen' },
    variantlar: [
      { qamrov: [], tashqi: true, izoh: "narx matnda yo'q" },
      { qamrov: ['muammo'], izoh: 'faqat muammo' },
      { qamrov: [], tashqi: true, izoh: "sayyora uchun ahamiyat matnda yo'q (juda keng)" },
      { qamrov: ['muammo', 'yechim', 'natija'], izoh: 'uchala qism' },
    ],
  },
  'ir-sarlavha-4': {
    qismlar: { tanlovlar: 'constant choices', "o'quvchiga ta'sir": 'the effect on the reader' },
    variantlar: [
      { qamrov: ['tanlovlar', "o'quvchiga ta'sir"], izoh: 'ikkala qism' },
      { qamrov: [], izoh: 'faqat misol (hazil)' },
      { qamrov: [], izoh: 'rad etilgan qarash' },
      { qamrov: [], tashqi: true, izoh: "til o'rganish matnda yo'q" },
    ],
  },
  'ir-sarlavha-5': {
    qismlar: { "oldin keraksiz": 'ugly reminder', 'hozir qadrli': 'most photographed places' },
    variantlar: [
      { qamrov: ["oldin keraksiz"], izoh: "faqat oldingi holat" },
      { qamrov: [], izoh: 'faqat fon (sanoat)' },
      { qamrov: ['hozir qadrli'], izoh: 'faqat oxirgi natija' },
      { qamrov: ["oldin keraksiz", 'hozir qadrli'], izoh: "ikkala qism (o'zgarish)" },
    ],
  },
};

function sarlavha(id: string): Natija {
  const s = topish(id);
  const j = sarlavhaJadval[id];
  const parcha = (s.parcha ?? '').toLowerCase();
  for (const [q, ibora] of Object.entries(j.qismlar)) {
    if (!parcha.includes(ibora.toLowerCase())) return { qiymat: `FARQ: "${q}" belgisi («${ibora}») parchada yo'q`, usul: '' };
  }
  if (j.variantlar.length !== s.variantlar.length) return { qiymat: 'FARQ: variantlar soni mos emas', usul: '' };
  const kerak = Object.keys(j.qismlar);
  const baho = j.variantlar.map((v, k) => ({ matn: s.variantlar[k].matn, ok: !v.tashqi && kerak.every((q) => v.qamrov.includes(q)), izoh: v.izoh }));
  const otgan = baho.filter((b) => b.ok);
  const usul = [`Majburiy qismlar: ${kerak.join(', ')}`, ...baho.map((b) => `"${b.matn}": ${b.ok ? 'mos' : `yo'q, ${b.izoh}`}`)].join(' · ');
  if (otgan.length !== 1) return { qiymat: `FARQ: qoidadan ${otgan.length} ta sarlavha o'tdi`, usul };
  return { qiymat: otgan[0].matn, usul };
}

const ikkinchiUsul: Record<string, () => Natija> = Object.fromEntries([
  ...irTfngSavollar.map((s) => [s.id, () => tfng(s.id)] as const),
  ...irSarlavhaSavollar.map((s) => [s.id, () => sarlavha(s.id)] as const),
]);

export const tekshiruv: BolimTekshiruv = {
  bolim: 'ielts',
  sarlavha: 'IELTS darslari (Reading)',
  savollar: [...irTfngSavollar, ...irSarlavhaSavollar],
  ikkinchiUsul,
  izoh: [
    "Sonli hisob yo'q. True / False / Not Given (ir-tfng): parchaning har gapi da'voga nisbatan alohida baholanadi (mos, zid yoki aloqasiz), mos va zid gaplarda dalil ibora gap ichida borligi tekshiriladi. Qoida IE02 dagi ta'rifdan: zid gap bo'lsa False, faqat mos gap bo'lsa True, hech biri bo'lmasa Not Given.",
    "Matching headings (ir-sarlavha): har paragrafning majburiy qismlari belgi ibora bilan beriladi (ibora parchada borligi tekshiriladi). Sarlavha hamma majburiy qismni qamrasa va matnda yo'q fikr qo'shmasa mos; qoidadan faqat bitta sarlavha o'tishi shart.",
  ],
};
