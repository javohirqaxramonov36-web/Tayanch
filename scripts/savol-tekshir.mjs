// Original savollarni tekshiradi va qamrov hisobotini chiqaradi (P05). Format: docs/savol-formati.md.
// Ishga tushirish:
//   TAYANCH_SAVOLLAR_DIR=~/Tayanch-savollar npm run savol:tekshir     (papkadagi hamma .json/.jsonl)
//   npm run savol:tekshir -- --fayl docs/namuna-savol.json            (alohida fayl, faqat o'qiladi)
// Xato bo'lsa chiqish kodi 1. Dars savollari (scripts/savollarni-tekshir.ts) bu skriptga aloqasi yo'q.
import { argumentlar, hammasiniTekshir, joyNomi, kalitMuvozanati, katak, savolFayllari, savolHolati, savollarPapkasi, savolTaksonomiya } from './savol/umumiy.mjs';

const a = argumentlar();
const fayllar = a.fayl ? String(a.fayl).split(',').map((x) => x.trim()).filter(Boolean) : savolFayllari(savollarPapkasi(a));
if (!fayllar.length) { console.log('Savol fayli topilmadi (.json yoki .jsonl).'); process.exit(0); }

const { natijalar, faylXatolari } = hammasiniTekshir(fayllar);
const xatoli = natijalar.filter((n) => n.xatolar.length);
const togri = natijalar.filter((n) => !n.xatolar.length);

console.log(`\n## Savol tekshiruvi\n\nFayllar: ${fayllar.length}, savollar: ${natijalar.length}, o'tdi: ${togri.length}, rad etildi: ${xatoli.length + faylXatolari.length}\n`);

if (faylXatolari.length || xatoli.length) {
  console.log('### Xatolar\n\n| Joy | external_id | Xato |\n| --- | --- | --- |');
  for (const x of faylXatolari) console.log(`| ${katak(x.fayl)}:${katak(x.joy)} | - | ${katak(x.xato)} |`);
  for (const n of xatoli) for (const x of n.xatolar) console.log(`| ${katak(joyNomi(n))} | ${katak(n.savol?.external_id ?? '-')} | ${katak(x)} |`);
  console.log('');
}

const ogohli = natijalar.filter((n) => n.ogohlar.length);
if (ogohli.length) {
  console.log('### Ogohlantirishlar\n\n| external_id | Izoh |\n| --- | --- |');
  for (const n of ogohli) for (const x of n.ogohlar) console.log(`| ${katak(n.savol?.external_id ?? '-')} | ${katak(x)} |`);
  console.log('');
}

// ---------- Kalit muvozanati: fayl bo'yicha (bloklamaydi) ----------
const muvozanat = kalitMuvozanati(natijalar);
if (muvozanat.length) {
  console.log("### Kalit muvozanati (fayl bo'yicha, mcq)\n\n| Fayl | MCQ | A | B | C | D | Eng uzun ketma-ketlik | To'g'ri = eng uzun | Izoh |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const m of muvozanat) {
    const joy = joyNomi({ fayl: m.fayl, joy: '' }).replace(/:$/, '');
    const s = m.sanoq;
    console.log(`| ${katak(joy)} | ${m.soni} | ${s.A} | ${s.B} | ${s.C} | ${s.D} | ${m.ketma.harf ?? '-'} × ${m.ketma.uzunlik} | ${m.uzun.length} | ${m.ogohlar.length ? katak('Ogohlantirish: ' + m.ogohlar.join('; ')) : 'OK'} |`);
  }
  console.log('');
}

// ---------- Qamrov: faqat tekshiruvdan o'tgan savollar ----------
const sanoq = new Map(); // "section|domain|skill" -> { d: [0..4], verified, draft }
for (const n of togri) {
  const s = n.savol;
  const k = `${s.section}|${s.domain}|${s.skill}`;
  const q = sanoq.get(k) ?? { d: [0, 0, 0, 0, 0], verified: 0, draft: 0 };
  q.d[s.difficulty - 1]++;
  q[savolHolati(s)]++;
  sanoq.set(k, q);
}
console.log("### Qamrov (o'tgan savollar)\n\n| Bo'lim | Domen | Ko'nikma | 1 | 2 | 3 | 4 | 5 | Jami | Tasdiqlangan | Draft |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
const jami = { d: [0, 0, 0, 0, 0], verified: 0, draft: 0 };
for (const [section, domenlar] of Object.entries(savolTaksonomiya)) {
  for (const [domain, skilllar] of Object.entries(domenlar)) {
    for (const skill of skilllar) {
      const q = sanoq.get(`${section}|${domain}|${skill}`) ?? { d: [0, 0, 0, 0, 0], verified: 0, draft: 0 };
      q.d.forEach((x, i) => (jami.d[i] += x));
      jami.verified += q.verified;
      jami.draft += q.draft;
      const j = q.d.reduce((x, y) => x + y, 0);
      console.log(`| ${section} | ${katak(domain)} | ${katak(skill)} | ${q.d.join(' | ')} | ${j} | ${q.verified} | ${q.draft} |`);
    }
  }
}
console.log(`| **Jami** | | | ${jami.d.join(' | ')} | ${jami.d.reduce((x, y) => x + y, 0)} | ${jami.verified} | ${jami.draft} |\n`);
const bosh = Object.values(savolTaksonomiya).flatMap((d) => Object.values(d).flat()).length - [...sanoq.keys()].length;
console.log(`Savolsiz ko'nikmalar: ${bosh}.`);

if (xatoli.length || faylXatolari.length) process.exit(1);
