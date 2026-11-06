// Reading & Writing savollarini ikkinchi, mustaqil usul bilan tekshirish (tekshiruv.ts ga qo'shiladi).
// Sonli hisob yo'q: har variant qoida jadvali (grammatika) yoki gap belgilari (dalil) bo'yicha alohida baholanadi.
// Qoidadan faqat bitta variant o'tishi kerak; u to'g'ri variant matniga teng bo'lishi shart.
// Fayl node bilan to'g'ridan-to'g'ri ishlaydi: qiymat importlari .ts kengaytmasi bilan.
import { rwXatoSavollar } from './rw-xatoni-toping.ts';
import { rwDalilSavollar } from './rw-dalil.ts';
import type { Natija } from '../tekshiruvTurlar.ts';
import type { DarsSavol } from './turlar.ts';

type Baho = { ok: boolean; sabab: string };

/** Qoidadan o'tgan yagona variant matni; aks holda farq beradigan matn */
function yagona(s: DarsSavol, baho: (matn: string) => Baho, qoida: string, qoshimcha = ''): Natija {
  const natijalar = s.variantlar.map((v) => ({ matn: v.matn, ...baho(v.matn) }));
  const otgan = natijalar.filter((n) => n.ok);
  const usul = [qoida, ...natijalar.map((n) => `"${n.matn}": ${n.ok ? 'qoidaga mos' : `yo'q, ${n.sabab}`}`)].join(' · ') + qoshimcha;
  if (otgan.length !== 1) return { qiymat: `FARQ: qoidadan ${otgan.length} ta variant o'tdi`, usul };
  return { qiymat: otgan[0].matn, usul };
}

/** Bo'laklar gapga qayta qo'shilganda matnga tengmi va xato joyi kutilgan bo'lakmi */
function bolakTekshir(s: DarsSavol, kutilganBolak: string): string {
  const b = s.belgilash;
  if (!b || b.tur !== 'soz') return ' · FARQ: belgilash yo\'q';
  const qayta = b.bolaklar.reduce((m, x, i) => (i === 0 ? x : /^[,.;:!?]$/.test(x) ? m + x : `${m} ${x}`), '');
  if (qayta !== s.matn) return ' · FARQ: bo\'laklar gapga teng emas';
  if (b.bolaklar[b.togriBolak] !== kutilganBolak) return ` · FARQ: xato joyi "${b.bolaklar[b.togriBolak]}", kutilgan "${kutilganBolak}"`;
  return ` · Xato joyi: "${kutilganBolak}" (${b.togriBolak + 1}-bo'lak), bo'laklar gapga teng.`;
}
const farqmi = (n: Natija) => (typeof n.usul === 'string' && n.usul.includes('FARQ') ? { ...n, qiymat: `FARQ: ${n.usul}` } : n);

const sv = (id: string) => [...rwXatoSavollar, ...rwDalilSavollar].find((s) => s.id === id)!;

/** Ikki so'z orasidagi belgi: "hours; students" -> ";" */
const orasi = (matn: string, chap: string, ong: string) => matn.slice(chap.length, matn.length - ong.length).trim();

// ---------- Grammatika: qoida jadvallari ----------
// Ikki mustaqil gapni ulay oladigan belgilar (nuqta, nuqtali vergul, vergul + teng bog'lovchi)
const MUSTAQIL_ULAYDI = new Set([';', '.', ', and', ', but', ', so']);

// Fe'l shakllari: son, nisbat, tuslanganmi
const FEL: Record<string, { son: 'birlik' | "ko'plik" | '-'; nisbat: 'majhul' | 'aniq'; tuslangan: boolean }> = {
  'was donated': { son: 'birlik', nisbat: 'majhul', tuslangan: true },
  'were donated': { son: "ko'plik", nisbat: 'majhul', tuslangan: true },
  'being donated': { son: '-', nisbat: 'majhul', tuslangan: false },
  'was donating': { son: 'birlik', nisbat: 'aniq', tuslangan: true },
};
// Zamon shakllari
const ZAMON: Record<string, { zamon: "o'tgan" | 'hozirgi' | 'kelasi'; perfect: boolean }> = {
  planted: { zamon: "o'tgan", perfect: false },
  plants: { zamon: 'hozirgi', perfect: false },
  'will plant': { zamon: 'kelasi', perfect: false },
  'has planted': { zamon: 'hozirgi', perfect: true },
};

// ---------- Dalil: har gap belgilari ----------
// kuzatuv: gap kuzatilgan fakt yoki natija (tajriba usuli, kontekst, taxmin yoki xulosa emas)
// omil: gap da'voning asosiy omiliga to'g'ridan-to'g'ri tegadi
// takror: gap da'voning o'zini takrorlaydi
type Gap = { kuzatuv: boolean; omil: boolean; takror: boolean };
const g = (kuzatuv: boolean, omil: boolean, takror = false): Gap => ({ kuzatuv, omil, takror });
const DALIL: Record<string, { omil: string; gaplar: Gap[] }> = {
  'rw-dalil-1': { omil: 'suv (suvni istisno qilish)', gaplar: [g(false, false), g(true, true), g(true, false), g(false, false)] },
  'rw-dalil-2': { omil: 'kechki tashrif buyuruvchilar: ishlaydigan kattalar', gaplar: [g(false, false), g(true, false), g(true, false), g(true, true)] },
  'rw-dalil-3': { omil: "o'z ishini qo'yib, boshqaga yordam", gaplar: [g(true, false), g(true, false), g(true, true), g(true, false)] },
  'rw-dalil-4': { omil: "vaqt o'tib ham buzilmaslik", gaplar: [g(false, false), g(true, true), g(true, false), g(true, false)] },
  'rw-dalil-5': { omil: 'tanish belgilar yo\'q joydan qaytish', gaplar: [g(false, false), g(false, false), g(true, true), g(false, true, true)] },
};
function dalil(id: string): Natija {
  const s = sv(id);
  const d = DALIL[id];
  if (d.gaplar.length !== s.variantlar.length) return { qiymat: 'FARQ: gaplar soni', usul: 'Gap belgilari soni variantlarga teng emas' };
  return yagona(
    s,
    (matn) => {
      const x = d.gaplar[s.variantlar.findIndex((v) => v.matn === matn)];
      if (x.takror) return { ok: false, sabab: "da'voni takrorlaydi" };
      if (!x.kuzatuv) return { ok: false, sabab: 'kuzatilgan natija emas (kontekst, usul yoki taxmin)' };
      if (!x.omil) return { ok: false, sabab: "da'vo omiliga tegmaydi" };
      return { ok: true, sabab: '' };
    },
    `Qoida: dalil = kuzatilgan fakt + da'vo omiliga (${d.omil}) tegadi + da'voni takrorlamaydi`,
  );
}

export const rwIkkinchiUsul: Record<string, () => Natija> = {
  'rw-xato-1': () => {
    const s = sv('rw-xato-1');
    return farqmi(yagona(s, (m) => {
      const b = orasi(m, 'hours', 'students') || '(belgisiz)';
      return MUSTAQIL_ULAYDI.has(b) ? { ok: true, sabab: '' } : { ok: false, sabab: `"${b}" ikki mustaqil gapni ulay olmaydi` };
    }, "Qoida: ikkala qism mustaqil gap (ega + kesim), ular faqat . ; yoki \", and/but/so\" bilan ulanadi", bolakTekshir(s, ',')));
  },
  'rw-xato-2': () => {
    const s = sv('rw-xato-2');
    return farqmi(yagona(s, (m) => {
      const b = orasi(m, 'repairs', m.endsWith('The bus') ? 'The bus' : 'the bus') || '(belgisiz)';
      return b === ',' ? { ok: true, sabab: '' } : { ok: false, sabab: `"${b}": chapdagi "Because …" tobe qism, unga faqat vergul mos` };
    }, "Qoida: gap boshidagi tobe qism (Because …) asosiy gapdan vergul bilan ajratiladi", bolakTekshir(s, ';')));
  },
  'rw-xato-3': () => {
    const s = sv('rw-xato-3');
    return farqmi(yagona(s, (m) => {
      const b = orasi(m, 'requires', 'flour');
      return b === '' ? { ok: true, sabab: '' } : { ok: false, sabab: `"${b}": fe'l va to'ldiruvchi orasiga belgi qo'yilmaydi` };
    }, "Qoida: \"requires\" to'ldiruvchini kutadi; fe'l va to'ldiruvchi orasida belgi bo'lmaydi", bolakTekshir(s, ':')));
  },
  'rw-xato-4': () => {
    const s = sv('rw-xato-4');
    return farqmi(yagona(s, (m) => {
      const f = FEL[m];
      if (!f) return { ok: false, sabab: "jadvalda yo'q" };
      if (!f.tuslangan) return { ok: false, sabab: "tuslangan fe'l emas" };
      if (f.son !== 'birlik') return { ok: false, sabab: `son ${f.son}, ega birlik` };
      if (f.nisbat !== 'majhul') return { ok: false, sabab: 'aniq nisbat, "by …" majhulni talab qiladi' };
      return { ok: true, sabab: '' };
    }, "Qoida: ega \"collection\" (birlik), \"by a local family\" bor, demak tuslangan, birlik, majhul fe'l", bolakTekshir(s, 'were donated')));
  },
  'rw-xato-5': () => {
    const s = sv('rw-xato-5');
    return farqmi(yagona(s, (m) => {
      const z = ZAMON[m];
      if (!z) return { ok: false, sabab: "jadvalda yo'q" };
      if (z.zamon !== "o'tgan") return { ok: false, sabab: `${z.zamon} zamon` };
      if (z.perfect) return { ok: false, sabab: 'perfect aniq o\'tgan vaqt bilan ishlatilmaydi' };
      return { ok: true, sabab: '' };
    }, "Qoida: \"Last winter\" aniq o'tgan vaqt, tugagan ish: Past Simple", bolakTekshir(s, 'plants')));
  },
  'rw-dalil-1': () => dalil('rw-dalil-1'),
  'rw-dalil-2': () => dalil('rw-dalil-2'),
  'rw-dalil-3': () => dalil('rw-dalil-3'),
  'rw-dalil-4': () => dalil('rw-dalil-4'),
  'rw-dalil-5': () => dalil('rw-dalil-5'),
};
