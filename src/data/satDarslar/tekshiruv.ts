// SAT darslari savollarini ikkinchi, mustaqil usul bilan tekshirish (scripts/savollarni-tekshir.ts o'qiydi).
// Usul: savoldagi formula bilan emas, boshqa yo'l bilan hisoblanadi (disklar yig'indisi, sonli qidiruv,
// teskari tekshiruv). Natija to'g'ri variantning son qiymatiga teng bo'lishi, noto'g'ri variantlardan
// hech biri unga teng bo'lmasligi kerak.
// Fayl node bilan to'g'ridan-to'g'ri ishlaydi: qiymat importlari .ts kengaytmasi bilan yoziladi.
import { hajmSavollar } from './hajm.ts';
import { grafikSavollar } from './grafik.ts';
import { aylanaSavollar } from './aylana.ts';
import { statistikaSavollar } from './statistika.ts';
import type { BolimTekshiruv, Natija } from '../tekshiruvTurlar.ts';

const EPS = 1e-6;

/** Aylanma jism hajmi: balandlik bo'yicha n ta yupqa disk yig'indisi (o'rta nuqta qoidasi). */
function disklar(radius: (y: number) => number, h: number, n = 200000): number {
  const dy = h / n;
  let v = 0;
  for (let i = 0; i < n; i++) { const r = radius((i + 0.5) * dy); v += Math.PI * r * r * dy; }
  return v;
}
const ortacha = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const mediana = (a: number[]) => { const b = [...a].sort((x, y) => x - y); const n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; };
const sigma = (a: number[]) => { const o = ortacha(a); return Math.sqrt(ortacha(a.map((x) => (x - o) ** 2))); };
const oraliq = (a: number[]) => Math.max(...a) - Math.min(...a);

/** id -> ikkinchi usul natijasi (son, juft yoki to'g'ri variant matni) va usul tavsifi */
const ikkinchiUsul: Record<string, () => Natija> = {
  'hajm-1': () => ({ qiymat: disklar(() => 3, 5), usul: `Disklar yig'indisi: ${(disklar(() => 3, 5) / Math.PI).toFixed(4)}π` }),
  'hajm-2': () => { const v = disklar((y) => 6 * (1 - y / 4), 4); return { qiymat: v, usul: `Kichrayib boruvchi disklar yig'indisi: ${(v / Math.PI).toFixed(4)}π` }; },
  'hajm-3': () => { const v = disklar((y) => Math.sqrt(Math.max(0, 9 - (y - 3) ** 2)), 6); return { qiymat: v, usul: `Shar kesimlari yig'indisi (r = 6 : 2): ${(v / Math.PI).toFixed(4)}π` }; },
  'hajm-4': () => { let h = 0; for (let t = 1; t <= 1000; t++) if (5 * 4 * t === 120) h = t; return { qiymat: h, usul: `Teskari tekshiruv: 5 · 4 · h = 120 bo'ladigan butun h qidirildi → ${h}` }; },
  'hajm-5': () => {
    const r = 1.7, h = 3.1;
    const k = disklar(() => 2 * r, h / 2) / disklar(() => r, h);
    return { qiymat: Math.abs(k - 2) < 1e-6 ? '2 marta ortadi' : `nisbat ${k}`, usul: `Ixtiyoriy r = 1,7, h = 3,1 da disklar bilan: yangi/eski = ${k.toFixed(6)}` };
  },
  'hajm-6': () => { const k = disklar(() => 3, 10) / disklar((y) => 3 * (1 - y / 10), 10); return { qiymat: k, usul: `Disklar bilan: silindr/konus = ${k.toFixed(5)}` }; },

  'grafik-1': () => { const y = [0].map((x) => 2 * x - 3)[0]; return { qiymat: [0, y], usul: `x = 0 qo'yildi: y = ${y}` }; },
  'grafik-2': () => {
    // Sonli qidiruv: ikki chiziq orasidagi farq ishora almashtiradigan joy
    let x = 0; for (let t = -100; t <= 100; t += 0.001) if (Math.abs((2 * t + 1) - (-t + 7)) < 5e-4) { x = Math.round(t * 1000) / 1000; break; }
    return { qiymat: [x, 2 * x + 1], usul: `Sonli qidiruv (qadam 0,001): x = ${x}, ikkala chiziqda y = ${2 * x + 1} va ${-x + 7}` };
  },
  'grafik-3': () => {
    // f(3 + d) = f(3 − d) tekshiruvi orqali simmetriya o'qi qidiriladi
    const f = (x: number) => 2 * (x - 3) ** 2 - 8;
    let oq = NaN; for (let c = -10; c <= 10; c += 0.5) if ([1, 2.5, 7].every((d) => Math.abs(f(c + d) - f(c - d)) < EPS)) oq = c;
    return { qiymat: oq, usul: `f(c + d) = f(c − d) bo'ladigan c qidirildi: c = ${oq}` };
  },
  'grafik-4': () => { let min = Infinity; for (let x = -20; x <= 20; x += 0.0005) min = Math.min(min, x * x - 6 * x + 5); return { qiymat: Math.round(min * 1e6) / 1e6, usul: `Sonli qidiruv [−20; 20], qadam 0,0005: eng kichik ${min.toFixed(6)}` }; },
  'grafik-5': () => {
    const det = 3 * 1 - 3 * 1; // −3x + y = 2, −3x + y = −4 sistemasi determinanti
    const yechim = det !== 0 ? 'Bitta' : (2 === -4 ? "Cheksiz ko'p" : "Yechimi yo'q");
    return { qiymat: yechim, usul: `Determinant = ${det}, ozod hadlar 2 ≠ −4 → ${yechim}` };
  },

  'aylana-1': () => { const r = 150 * Math.PI / 180; return { qiymat: r, usul: `150 · π/180 = ${r.toFixed(6)}; teskari: ${(r * 180 / Math.PI).toFixed(6)}°` }; },
  'aylana-2': () => ({ qiymat: Math.sin(Math.PI / 6), usul: `Math.sin(π/6) = ${Math.sin(Math.PI / 6).toFixed(6)}` }),
  'aylana-3': () => {
    const v = Math.cos(2 * Math.PI / 3), gradusRejim = Math.cos((2 * Math.PI / 3) * Math.PI / 180);
    return { qiymat: v, usul: `Math.cos(2π/3) = ${v.toFixed(6)}; gradus rejimidagi xato: cos(2,094°) = ${gradusRejim.toFixed(4)}` };
  },
  'aylana-4': () => { const t = Math.cos(20 * Math.PI / 180); let x = NaN; for (let g = 1; g < 90; g++) if (Math.abs(Math.sin(g * Math.PI / 180) - t) < 1e-9) x = g; return { qiymat: x, usul: `1° dan 89° gacha qidiruv: sin x = cos 20° (${t.toFixed(6)}) → x = ${x}` }; },
  'aylana-5': () => { let g = Math.atan2(1 / 2, -Math.sqrt(3) / 2) * 180 / Math.PI; if (g < 0) g += 360; return { qiymat: Math.round(g * 1e6) / 1e6, usul: `atan2(1/2; −√3/2) = ${g.toFixed(6)}°` }; },

  'statistika-1': () => { const a = [4, 7, 7, 9, 13]; return { qiymat: ortacha(a), usul: `O'rtacha ${ortacha(a)} (mediana ${mediana(a)}, oraliq ${oraliq(a)})` }; },
  'statistika-2': () => { const a = [3, 9, 4, 18, 6, 8]; return { qiymat: mediana(a), usul: `Saralangan: ${[...a].sort((x, y) => x - y).join(', ')}; mediana ${mediana(a)}, o'rtacha ${ortacha(a)}` }; },
  'statistika-3': () => {
    // Aniq ro'yxat bilan tekshiruv: o'nta 12 va 23
    const a = [...Array(10).fill(12), 23];
    return { qiymat: ortacha(a), usul: `O'nta 12 va bitta 23: o'rtacha ${ortacha(a)}` };
  },
  'statistika-4': () => {
    const a = [5, 6, 6, 7, 8], b = [...a, 40];
    const ozgarish = { "O'rtacha": Math.abs(ortacha(b) - ortacha(a)), Oraliq: Math.abs(oraliq(b) - oraliq(a)), Mediana: Math.abs(mediana(b) - mediana(a)), "Standart og'ish": Math.abs(sigma(b) - sigma(a)) };
    const eng = Object.entries(ozgarish).sort((x, y) => x[1] - y[1])[0][0];
    return { qiymat: eng, usul: `O'zgarishlar: ${Object.entries(ozgarish).map(([k, v]) => `${k} ${v.toFixed(3)}`).join(', ')}` };
  },
  'statistika-5': () => {
    const A = [10, 10, 10, 10], B = [7, 9, 11, 13];
    const ok = ortacha(A) === ortacha(B) && sigma(B) > sigma(A);
    return { qiymat: ok ? "O'rtachalar teng, B ning standart og'ishi kattaroq" : 'mos kelmadi', usul: `O'rtachalar ${ortacha(A)} va ${ortacha(B)}; σ(A) = ${sigma(A)}, σ(B) = ${sigma(B).toFixed(4)}` };
  },
};


export const tekshiruv: BolimTekshiruv = {
  bolim: 'sat',
  sarlavha: 'SAT Math darslari',
  savollar: [...hajmSavollar, ...grafikSavollar, ...aylanaSavollar, ...statistikaSavollar],
  ikkinchiUsul,
  izoh: [
    `"Ikkinchi usul" ustunida javob savoldagi formulasiz, boshqa yo'l bilan qayta hisoblangan (disklar yig'indisi, sonli qidiruv, teskari tekshiruv).`,
    "Standart og'ish populatsiya formulasi bilan (n ga bo'linadi).",
  ],
};
