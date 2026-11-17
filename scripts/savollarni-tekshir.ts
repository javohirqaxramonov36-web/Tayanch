// Interaktiv darslar savollarini ikkinchi, mustaqil usul bilan tekshiradi va tekshirish jadvalini yozadi.
// Ishga tushirish: node scripts/savollarni-tekshir.ts            (faqat tekshiradi)
//                  node scripts/savollarni-tekshir.ts --jadval   (docs/<bolim>-savollar-tekshiruv.md ni ham yozadi)
// Bo'limlar: src/data/<bolim>Darslar/tekshiruv.ts (masalan satDarslar). Har biri `tekshiruv` ni eksport qiladi:
// savollar, id bo'yicha ikkinchi usul va jadval izohlari (turlar: src/data/tekshiruvTurlar.ts).
// Natija to'g'ri variantga teng bo'lishi, noto'g'ri variantlardan hech biri unga teng bo'lmasligi kerak.
// Farq bo'lsa skript xato bilan tugaydi.
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import type { BolimTekshiruv } from '../src/data/tekshiruvTurlar.ts';

const EPS = 1e-6;
const dataPapka = new URL('../src/data/', import.meta.url);
const bolimlar: { papka: string; t: BolimTekshiruv }[] = [];
for (const papka of readdirSync(dataPapka).filter((x) => x.endsWith('Darslar')).sort()) {
  const fayl = new URL(`${papka}/tekshiruv.ts`, dataPapka);
  if (!existsSync(fayl)) { console.log(`  ✗ ${papka}: tekshiruv.ts yo'q`); process.exitCode = 1; continue; }
  const { tekshiruv } = (await import(fayl.href)) as { tekshiruv: BolimTekshiruv };
  bolimlar.push({ papka, t: tekshiruv });
}

// ---------- Variant matnini songa aylantirish ----------
// "45π", "5π/6", "−1/2", "√3/2", "⅓", "17.5", "≈ 0.999", "x = 3", "(2, 5)" -> son yoki [x, y]
// Eski yozuv ham o'qiladi: o'nli vergul va nuqtali vergulli juftlik ("17,5", "(1,5; 2)").
function son(matn: string): number | [number, number] | null {
  let s = matn.trim().replace(/−/g, '-').replace(/^≈\s*/, '').replace(/^[xy]\s*=\s*/, '').replace(/°$/, '');
  const juft = s.includes(';') ? s.match(/^\((.+);(.+)\)$/) : s.match(/^\(([^,]+),([^,]+)\)$/);
  if (!juft) s = s.replace(/,/g, '.');
  if (juft) {
    const a = son(juft[1]), b = son(juft[2]);
    return typeof a === 'number' && typeof b === 'number' ? [a, b] : null;
  }
  if (s === '⅓') return 1 / 3;
  const m = s.match(/^(-?)(\d*\.?\d*)?(√\d+)?(π)?(?:\/(\d+))?$/);
  if (!m || (!m[2] && !m[3] && !m[4])) return null;
  let q = m[2] ? Number(m[2]) : 1;
  if (m[3]) q *= Math.sqrt(Number(m[3].slice(1)));
  if (m[4]) q *= Math.PI;
  if (m[5]) q /= Number(m[5]);
  return m[1] ? -q : q;
}
const teng = (a: unknown, b: unknown, eps = EPS): boolean => {
  if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) < eps;
  if (Array.isArray(a) && Array.isArray(b)) return teng(a[0], b[0], eps) && teng(a[1], b[1], eps);
  return false;
};

// ---------- Tekshiruv ----------
const idlar = new Set<string>();
let jamiXato = 0;

for (const { papka, t } of bolimlar) {
  const { savollar: hamma, ikkinchiUsul } = t;
  const xatolar: string[] = [];
  const qatorlar: string[] = [];

  for (const s of hamma) {
    const tekshir = ikkinchiUsul[s.id];
    if (idlar.has(s.id)) xatolar.push(`${s.id}: id takrorlangan`);
    idlar.add(s.id);
    if (!tekshir) { xatolar.push(`${s.id}: ikkinchi usul yozilmagan`); continue; }
    if (s.togri < 0 || s.togri >= s.variantlar.length) xatolar.push(`${s.id}: togri indeksi noto'g'ri`);
    const matnlar = s.variantlar.map((v) => v.matn);
    if (new Set(matnlar).size !== matnlar.length) xatolar.push(`${s.id}: variantlar takrorlangan`);
    s.variantlar.forEach((v, i) => {
      if (i !== s.togri && !v.xato) xatolar.push(`${s.id}: ${i + 1}-variantda xato nomi yo'q`);
      if (i === s.togri && v.xato) xatolar.push(`${s.id}: to'g'ri variantda xato nomi turibdi`);
    });

    const { qiymat, usul } = tekshir();
    const togriMatn = s.variantlar[s.togri].matn;
    let mos: boolean;
    if (typeof qiymat === 'string') {
      mos = qiymat === togriMatn;
      // Matnli javobda noto'g'ri variantlar ham boshqa bo'lishi kerak (yuqorida tekshirildi)
    } else {
      mos = teng(son(togriMatn), qiymat, 1e-4);
      s.variantlar.forEach((v, i) => {
        if (i === s.togri) return;
        const q = son(v.matn);
        if (q !== null && teng(q, qiymat, 1e-4)) xatolar.push(`${s.id}: noto'g'ri variant "${v.matn}" ham to'g'ri javobga teng chiqdi`);
      });
    }
    if (!mos) xatolar.push(`${s.id}: ikkinchi usul (${JSON.stringify(qiymat)}) to'g'ri variant "${togriMatn}" bilan mos emas`);

    const harf = 'ABCD';
    const variantlar = s.variantlar.map((v, i) => `${harf[i]}) ${v.matn}${i === s.togri ? ' **(to\'g\'ri)**' : ` — ${v.xato}`}`).join('<br>');
    const q = (x: string) => x.replace(/\|/g, '\\|');
    qatorlar.push(`| ${s.id} | ${q(s.mavzu)} | ${s.qiyinlik} | ${q(s.matn)} | ${q(variantlar)} | ${q(s.yechim)} | ${q(usul)} | ${mos ? 'mos' : '**FARQ**'} | ${s.verified ? 'ha' : "yo'q"} |`);
  }

  console.log(`${t.sarlavha}. Savollar: ${hamma.length}. Xatolar: ${xatolar.length}.`);
  jamiXato += xatolar.length;
  xatolar.forEach((x) => console.log('  ✗ ' + x));

  if (process.argv.includes('--jadval')) {
    const bugun = new Date().toISOString().slice(0, 10);
    const md = `# ${t.sarlavha}: savollar tekshirish ro'yxati

Bu fayl \`scripts/savollarni-tekshir.ts --jadval\` bilan yaratiladi, qo'lda tahrir qilinmaydi. Savollar: \`src/data/${papka}/\`.
Yaratilgan: ${bugun}. Savollar soni: ${hamma.length}. Skript topgan farqlar: ${xatolar.length}.

Muallif uchun: savolni tekshirib bo'lgach, ma'lumot faylida \`verified: true\` qo'ying va skriptni qayta ishga tushiring.
${t.izoh.join('\n')}

| ID | Mavzu | Qiyinlik | Savol | Variantlar (noto'g'risida tipik xato) | Yechim | Ikkinchi usul | Natija | verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
${qatorlar.join('\n')}
`;
    const nom = `docs/${t.bolim}-savollar-tekshiruv.md`;
    writeFileSync(new URL(`../${nom}`, import.meta.url), md);
    console.log(`Jadval yozildi: ${nom}`);
  }
}

if (jamiXato) process.exit(1);
