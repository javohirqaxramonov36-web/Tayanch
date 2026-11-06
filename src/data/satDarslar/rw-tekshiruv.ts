// Reading & Writing savollarini ikkinchi, mustaqil usul bilan tekshirish (tekshiruv.ts ga qo'shiladi).
// Sonli hisob yo'q: har variant qoida jadvali (grammatika) yoki gap belgilari (dalil) bo'yicha alohida baholanadi.
// Qoidadan faqat bitta variant o'tishi kerak; u to'g'ri variant matniga teng bo'lishi shart.
// Fayl node bilan to'g'ridan-to'g'ri ishlaydi: qiymat importlari .ts kengaytmasi bilan.
import { rwXatoSavollar } from './rw-xatoni-toping.ts';
import { rwDalilSavollar } from './rw-dalil.ts';
import { rwOtishSavollar } from './rw-otish.ts';
import { rwLugatSavollar } from './rw-lugat.ts';
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

const sv = (id: string) => [...rwXatoSavollar, ...rwDalilSavollar, ...rwOtishSavollar, ...rwLugatSavollar].find((s) => s.id === id)!;

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

// ---------- O'tish so'zlari: munosabat jadvali (savol faylidan mustaqil) ----------
type Munosabat = 'zid' | 'sabab' | 'misol' | 'davom';
const OTISH: Record<string, Munosabat> = {
  'However,': 'zid', 'In contrast,': 'zid', 'Nevertheless,': 'zid', 'On the other hand,': 'zid',
  'Therefore,': 'sabab', 'As a result,': 'sabab', 'Consequently,': 'sabab',
  'For example,': 'misol', 'For instance,': 'misol', 'Specifically,': 'misol',
  'Moreover,': 'davom', 'In addition,': 'davom', 'Furthermore,': 'davom',
};
// Har savol: 1- va 2-gap orasidagi munosabat, matnni qayta o'qib aniqlangan
const OTISH_KUTILGAN: Record<string, { m: Munosabat; nega: string }> = {
  'rw-otish-1': { m: 'zid', nega: "2-gap 1-gapdagi taxminni rad etadi" },
  'rw-otish-2': { m: 'sabab', nega: "bozor ko'chirilishi yo'l ko'milishining oqibati" },
  'rw-otish-3': { m: 'misol', nega: "qarg'alar 1-gapdagi umumiy fikrning aniq holati" },
  'rw-otish-4': { m: 'davom', nega: "ikkinchi, mustaqil foyda; birinchisining oqibati emas" },
  'rw-otish-5': { m: 'zid', nega: "kamchiliklarga qaramay yutuq" },
};
function otish(id: string): Natija {
  const s = sv(id);
  const k = OTISH_KUTILGAN[id];
  const joylar = s.matn.split('______').length - 1;
  const turlar = new Set(s.variantlar.map((v) => OTISH[v.matn]));
  const qoshimcha = joylar !== 1 ? ` · FARQ: bo'sh joy ${joylar} ta` : turlar.size !== 4 ? ' · FARQ: variantlar 4 xil munosabatdan emas' : ' · Bitta bo\'sh joy, 4 variant 4 xil munosabatdan.';
  return farqmi(yagona(s, (m) => {
    const t = OTISH[m];
    if (!t) return { ok: false, sabab: "jadvalda yo'q" };
    return t === k.m ? { ok: true, sabab: '' } : { ok: false, sabab: `munosabati "${t}", kerak "${k.m}"` };
  }, `Qoida: munosabat "${k.m}" (${k.nega})`, qoshimcha));
}

// ---------- Lug'at: kontekst ishorasi va variant belgilari ----------
// ohang: so'zning baho yo'nalishi; maydon: ma'no sohasi. To'g'ri variant ikkalasiga mos bo'lishi shart.
type Belgi = { ohang: 'ijobiy' | 'salbiy' | 'neytral'; maydon: string };
const b = (ohang: Belgi['ohang'], maydon: string): Belgi => ({ ohang, maydon });
const LUGAT: Record<string, { ishora: string; kerak: Belgi; variantlar: Record<string, Belgi> }> = {
  'rw-lugat-1': { ishora: 'fallen branches covered the path', kerak: b('salbiy', 'xavf'), variantlar: {
    scenic: b('ijobiy', 'manzara'), crowded: b('salbiy', "odam ko'pligi"), hazardous: b('salbiy', 'xavf'), familiar: b('neytral', 'tanishlik') } },
  'rw-lugat-2': { ishora: 'starting with repairs to the old pipes', kerak: b('neytral', 'muammoni hal qilish'), variantlar: {
    'write a location on': b('neytral', 'manzil yozish'), 'deal with': b('neytral', 'muammoni hal qilish'),
    'give a speech to': b('neytral', "nutq so'zlash"), 'send a letter to': b('neytral', "xat jo'natish") } },
  'rw-lugat-3': { ishora: 'he rarely spoke', kerak: b('neytral', 'kam gapirish'), variantlar: {
    outspoken: b('neytral', 'ochiq gapirish'), careless: b('salbiy', "e'tiborsizlik"), curious: b('ijobiy', 'qiziquvchanlik'), reserved: b('neytral', 'kam gapirish') } },
  'rw-lugat-4': { ishora: 'proved them wrong', kerak: b('ijobiy', 'yuqori baho'), variantlar: {
    modest: b('neytral', 'kichik hajm'), remarkable: b('ijobiy', 'yuqori baho'), predictable: b('salbiy', 'kutilganlik'), expensive: b('neytral', 'narx') } },
  'rw-lugat-5': { ishora: 'drop in the number', kerak: b('neytral', "o'zgarish tezligi"), variantlar: {
    pointed: b('neytral', 'shakl'), intelligent: b('ijobiy', 'aql'), sudden: b('neytral', "o'zgarish tezligi"), 'harsh in tone': b('salbiy', 'ovoz ohangi') } },
};
function lugat(id: string): Natija {
  const s = sv(id);
  const l = LUGAT[id];
  const qoshimcha = s.matn.includes(l.ishora) ? ` · Ishora matnda bor: "${l.ishora}".` : ` · FARQ: ishora "${l.ishora}" matnda yo'q`;
  return farqmi(yagona(s, (m) => {
    const x = l.variantlar[m];
    if (!x) return { ok: false, sabab: "jadvalda yo'q" };
    if (x.maydon !== l.kerak.maydon) return { ok: false, sabab: `ma'no "${x.maydon}", kerak "${l.kerak.maydon}"` };
    if (x.ohang !== l.kerak.ohang) return { ok: false, sabab: `ohang ${x.ohang}, kerak ${l.kerak.ohang}` };
    return { ok: true, sabab: '' };
  }, `Qoida: ishora "${l.ishora}" → ${l.kerak.ohang}, "${l.kerak.maydon}"`, qoshimcha));
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
  'rw-otish-1': () => otish('rw-otish-1'),
  'rw-otish-2': () => otish('rw-otish-2'),
  'rw-otish-3': () => otish('rw-otish-3'),
  'rw-otish-4': () => otish('rw-otish-4'),
  'rw-otish-5': () => otish('rw-otish-5'),
  'rw-lugat-1': () => lugat('rw-lugat-1'),
  'rw-lugat-2': () => lugat('rw-lugat-2'),
  'rw-lugat-3': () => lugat('rw-lugat-3'),
  'rw-lugat-4': () => lugat('rw-lugat-4'),
  'rw-lugat-5': () => lugat('rw-lugat-5'),
};
