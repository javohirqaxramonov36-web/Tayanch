// SAT savol bankini yuklaydi, build vaqtida tekshiradi va HTML'ga aylantiradi.
// Xato bo'lsa build aniq xabar bilan to'xtaydi.
//
// Sinov rejimi (faqat lokal): SAT_TEST_BANK=1 -> tests/sat/test-savollar.ts,
// SAT_TEST_BANK=buzilgan -> tests/sat/buzilgan.ts. Oddiy build tests/ papkasini ishlatmaydi.
import katex from 'katex';
import { domenlar } from '../../data/sat/format';
import { savollar as asosiyBank } from '../../data/sat/savollar';
import { HARFLAR, type Savol, type TayyorSavol } from './turlar';

const testModullari = import.meta.glob<{ savollar: Savol[] }>('/tests/sat/*.ts');

function xatolar(bank: Savol[], sinov: boolean): string[] {
  const x: string[] = [];
  const idlar = new Set<string>();
  bank.forEach((s, i) => {
    const kim = `savol #${i + 1} (id: "${s?.id ?? '?'}")`;
    const ayt = (m: string) => x.push(`${kim}: ${m}`);
    if (!s.id || typeof s.id !== 'string') ayt("id bo'sh");
    else if (idlar.has(s.id)) ayt('id takrorlangan');
    else idlar.add(s.id);
    if (s.fan !== 'math' && s.fan !== 'rw') { ayt(`fan "${s.fan}" noto'g'ri ('math' | 'rw')`); return; }
    const domen = domenlar[s.fan].find((d) => d.nomi === s.domen);
    if (!domen) ayt(`domen "${s.domen}" ${s.fan} uchun rasmiy ro'yxatda yo'q (src/data/sat/format.ts)`);
    else if (!domen.konikmalar.includes(s.konikma)) ayt(`ko'nikma "${s.konikma}" "${s.domen}" domenining rasmiy ro'yxatida yo'q`);
    if (!['oson', 'orta', 'qiyin'].includes(s.qiyinlik)) ayt(`qiyinlik "${s.qiyinlik}" noto'g'ri`);
    if (!s.matn?.trim()) ayt("matn bo'sh");
    if (!s.tushuntirish_uz?.trim()) ayt("tushuntirish_uz bo'sh");
    if (!['qoralama', 'tekshirilgan'].includes(s.holat)) ayt(`holat "${s.holat}" noto'g'ri`);
    if (s.manba !== 'original') ayt("manba 'original' bo'lishi kerak");
    if (!s.muallif?.trim()) ayt("muallif bo'sh");
    if (s.turi === 'tanlov') {
      const v = s.variantlar ?? [];
      if (v.length !== 4) ayt(`tanlov turida aynan 4 ta variant kerak (${v.length} ta bor)`);
      v.forEach((vr, j) => {
        if (vr.harf !== HARFLAR[j]) ayt(`${j + 1}-variant harfi "${vr.harf}", "${HARFLAR[j]}" bo'lishi kerak`);
        if (!vr.matn?.trim()) ayt(`${vr.harf}-variant matni bo'sh`);
      });
      if (typeof s.togri !== 'string' || !v.some((vr) => vr.harf === s.togri)) ayt(`togri "${s.togri}" variantlar ichida yo'q`);
      HARFLAR.forEach((h) => { if (!s.variant_izohi_uz?.[h]?.trim()) ayt(`variant_izohi_uz.${h} bo'sh`); });
    } else if (s.turi === 'yozma') {
      if (s.variantlar?.length) ayt("yozma turida variantlar bo'lmaydi");
      if (!Array.isArray(s.togri) || s.togri.length === 0 || s.togri.some((t) => !String(t).trim())) {
        ayt("yozma turida togri bo'sh bo'lmagan javoblar ro'yxati bo'lishi kerak");
      }
    } else ayt(`turi "${s.turi}" noto'g'ri ('tanlov' | 'yozma')`);
    if (!sinov && (/^test-/i.test(s.id) || /^TEST\b/.test(s.matn ?? ''))) ayt("TEST savol asosiy bankda turibdi: u faqat tests/ papkasida bo'ladi");
  });
  return x;
}

const ekran = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Matnni HTML'ga aylantiradi: $...$ -> KaTeX, \$ -> oddiy dollar, bo'sh qator -> yangi xatboshi. */
function chiz(matn: string, kim: string, inline = false): string {
  const DOLLAR = '\u0000';
  const t = matn.replace(/\\\$/g, DOLLAR);
  const bolak = t.split('$');
  if (bolak.length % 2 === 0) throw new Error(`[SAT savollar] ${kim}: yopilmagan $ belgisi. Oddiy dollar uchun \\$ yozing.`);
  const html = bolak
    .map((b, i) => {
      if (i % 2 === 0) return ekran(b.replace(new RegExp(DOLLAR, 'g'), '$'));
      try {
        return katex.renderToString(b.replace(new RegExp(DOLLAR, 'g'), '\\$'), { throwOnError: true, output: 'htmlAndMathml' });
      } catch (e) {
        throw new Error(`[SAT savollar] ${kim}: KaTeX ifodasi xato "$${b}$": ${(e as Error).message}`);
      }
    })
    .join('');
  if (inline) return html;
  return html.split(/\n\s*\n/).map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('');
}

let kesh: Promise<TayyorSavol[]> | undefined;

async function yukla(): Promise<TayyorSavol[]> {
  const rejim = process.env.SAT_TEST_BANK;
  let bank = asosiyBank;
  if (rejim) {
    const fayl = rejim === 'buzilgan' ? '/tests/sat/buzilgan.ts' : '/tests/sat/test-savollar.ts';
    const yuklovchi = testModullari[fayl];
    if (!yuklovchi) throw new Error(`[SAT savollar] sinov fayli topilmadi: ${fayl}`);
    bank = (await yuklovchi()).savollar;
    console.warn(`[SAT savollar] SINOV REJIMI: ${fayl}. Bu build joylanmaydi.`);
  }
  const x = xatolar(bank, !!rejim);
  if (x.length) throw new Error(`[SAT savollar] Bankda ${x.length} ta xato:\n  - ${x.join('\n  - ')}`);
  return bank
    .filter((s) => s.holat === 'tekshirilgan')
    .map((s) => {
      const kim = `id "${s.id}"`;
      const izoh: TayyorSavol['izoh'] = {};
      HARFLAR.forEach((h) => { if (s.variant_izohi_uz?.[h]) izoh[h] = chiz(s.variant_izohi_uz[h], `${kim} izoh ${h}`); });
      return {
        id: s.id,
        fan: s.fan,
        domen: s.domen,
        konikma: s.konikma,
        qiyinlik: s.qiyinlik,
        turi: s.turi,
        matn: chiz(s.matn, kim),
        variantlar: (s.variantlar ?? []).map((v) => ({ harf: v.harf, matn: chiz(v.matn, `${kim} ${v.harf}`, true) })),
        togri: s.togri,
        tushuntirish: chiz(s.tushuntirish_uz, `${kim} tushuntirish`),
        izoh,
      };
    });
}

/** Saytda ko'rinadigan savollar (holat: 'tekshirilgan'). */
export function tayyorSavollar(): Promise<TayyorSavol[]> {
  kesh ??= yukla();
  return kesh;
}
