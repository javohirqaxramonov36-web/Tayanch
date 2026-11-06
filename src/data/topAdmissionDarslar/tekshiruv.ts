// Top Admission darslari savollarini ikkinchi, mustaqil usul bilan tekshirish (scripts/savollarni-tekshir.ts o'qiydi).
// Usullar:
//   Türkiye Bursları: pog'onalar TB01 dagi boshlanish oyi (`oy`) bo'yicha saralanadi; sana savolida kun raqami oyna chegaralari bilan solishtiriladi.
//   Common App / UCAS: tartib `kerak` bog'lanishlaridan qayta quriladi (topologik saralash, tartib yagona bo'lishi shart).
//   Fakt savollari: javob manbalar.ts dagi rasmiy izoh matnidan olinadi (son yoki bo'lim nomi).
// Fayl node bilan to'g'ridan-to'g'ri ishlaydi: qiymat importlari .ts kengaytmasi bilan.
import { taZinapoyaSavollar } from './ta-zinapoya.ts';
import { zinapoyalar, type Pogona } from './zinapoyalar.ts';
import { manbalar } from '../manbalar.ts';
import type { BolimTekshiruv, Natija } from '../tekshiruvTurlar.ts';

const zina = (id: string) => zinapoyalar.find((z) => z.id === id)!;
const izoh = (id: string) => {
  const m = manbalar.find((x) => x.id === id);
  return m && m.tekshiruvDarajasi === 'rasmiy' ? m.izoh ?? '' : '';
};

/** `kerak` bo'yicha tartib. Har qadamda faqat bitta pog'ona tayyor bo'lishi shart (tartib yagona). */
function tartib(pogonalar: Pogona[]): Pogona[] | string {
  const qoldi = [...pogonalar];
  const natija: Pogona[] = [];
  while (qoldi.length) {
    const tayyor = qoldi.filter((p) => p.kerak.every((k) => natija.some((n) => n.id === k)));
    if (tayyor.length !== 1) return `FARQ: ${natija.length + 1}-pog'onaga ${tayyor.length} ta nomzod`;
    natija.push(tayyor[0]);
    qoldi.splice(qoldi.indexOf(tayyor[0]), 1);
  }
  return natija;
}

/** TB01: boshlanish oyi bo'yicha */
const oyTartibi = (pogonalar: Pogona[]) => [...pogonalar].sort((a, b) => (a.oy ?? 0) - (b.oy ?? 0));
/** Kartadagi "Baholash: mart–aprel" → "Baholash" */
const qisqa = (p: Pogona) => p.matn.split(':')[0];

const ikkinchiUsul: Record<string, () => Natija> = {
  'ta-zinapoya-1': () => {
    const t = oyTartibi(zina('turkiye').pogonalar);
    const k = t.findIndex((p) => p.id === 'intervyu');
    if (!izoh('TB01').includes('intervyu aprel–iyun')) return { qiymat: "FARQ: TB01 izohida intervyu yo'q", usul: '' };
    return { qiymat: qisqa(t[k - 1]), usul: `Oy bo'yicha: ${t.map((p) => `${qisqa(p)} (${p.oy}-oy)`).join(' → ')}` };
  },
  'ta-zinapoya-2': () => {
    const iz = izoh('TB01');
    const m = iz.match(/(\d+)-yanvar – (\d+)-fevral/);
    if (!m) return { qiymat: "FARQ: TB01 izohida ariza oynasi yo'q", usul: '' };
    // Sana yil ichidagi kun tartibi bilan (kabisa yil farqi bu oraliqqa ta'sir qilmaydi)
    const kun = (oy: number, k: number) => [0, 31, 59][oy - 1] + k;
    const boshi = kun(1, Number(m[1])), oxiri = kun(2, Number(m[2])), bugun = kun(3, 1);
    const holat = bugun < boshi ? 'oldin' : bugun <= oxiri ? 'ochiq' : 'yopilgan';
    const javoblar: Record<string, string> = {
      yopilgan: `Yopilgan: oyna ${m[2]}-fevralda tugagan, hozir baholash bosqichi`,
      ochiq: 'Ochiq',
      oldin: 'Hali ochilmagan',
    };
    if (holat === 'yopilgan' && !iz.includes('baholash mart')) return { qiymat: "FARQ: TB01 da baholash marti yo'q", usul: '' };
    return { qiymat: javoblar[holat], usul: `1-mart = ${bugun}-kun; oyna ${boshi}–${oxiri}-kun → ${holat}; mart TB01 da baholash` };
  },
  'ta-zinapoya-3': () => {
    const m = izoh('UC01').match(/(\d+) tagacha kursga/);
    if (!m) return { qiymat: "FARQ: UC01 izohida kurs soni yo'q", usul: '' };
    return { qiymat: `${m[1]} tagacha`, usul: `UC01 izohi: «${m[0]}»; 1, 3 va cheklovsiz variantlar bu songa teng emas` };
  },
  'ta-zinapoya-4': () => {
    if (!izoh('CA02').includes("Profile bo'limida")) return { qiymat: "FARQ: CA02 izohida Profile yo'q", usul: '' };
    const t = tartib(zina('commonapp').pogonalar);
    if (typeof t === 'string') return { qiymat: t, usul: '' };
    const k = t.findIndex((p) => p.matn.includes('Profile'));
    return { qiymat: `${k + 1}-pog'ona: akkaunt va Profile bo'limida`, usul: `CA02: waiver Profile bo'limida; Profile ${k + 1}-pog'onada (kerak bo'yicha tartib)` };
  },
  'ta-zinapoya-5': () => {
    const t = tartib(zina('commonapp').pogonalar);
    if (typeof t === 'string') return { qiymat: t, usul: '' };
    return {
      qiymat: t.map((p) => p.matn).join(' → '),
      usul: `kerak bog'lanishlari: ${t.map((p) => `${p.id}${p.kerak.length ? ` ← ${p.kerak.join(', ')}` : ''}`).join('; ')}`,
    };
  },
};

// Sahna zinapoyalari ham tekshiriladi: saqlangan tartib qayta qurilgan tartibga teng bo'lishi shart.
for (const z of zinapoyalar) {
  const t = z.id === 'turkiye' ? oyTartibi(z.pogonalar) : tartib(z.pogonalar);
  const ok = typeof t !== 'string' && t.every((p, k) => p.id === z.pogonalar[k].id);
  if (!ok) throw new Error(`Zinapoya "${z.id}": saqlangan tartib qayta qurilgan tartibga teng emas`);
  for (const p of z.pogonalar) {
    if (p.manbaId && !izoh(p.manbaId)) throw new Error(`Zinapoya "${z.id}", "${p.id}": ${p.manbaId} rasmiy manba emas`);
  }
}

export const tekshiruv: BolimTekshiruv = {
  bolim: 'top-admission',
  sarlavha: 'Top Admission darslari (Ariza zinapoyasi)',
  savollar: taZinapoyaSavollar,
  ikkinchiUsul,
  izoh: [
    "Türkiye Bursları: pog'onalar TB01 dagi boshlanish oyi bo'yicha saralanadi; sana savolida 1-mart TB01 izohidagi ariza oynasi chegaralari bilan kun raqami orqali solishtiriladi.",
    "Common App va UCAS: tartib har pog'onaning `kerak` bog'lanishidan qayta quriladi, har qadamda faqat bitta pog'ona tayyor bo'lishi shart. Bu tartib Tayanch tavsiyasi, rasmiy ketma-ketlik emas.",
    "Fakt savollari (UCAS kurs soni, Common App fee waiver): javob manbalar.ts dagi rasmiy manba izohidan olinadi. Sahnadagi uch zinapoya ham shu skript ichida tekshiriladi.",
  ],
};
