// Draft (tasdiqlanmagan) savollarni muallif o'qishi uchun Markdown faylga chiqaradi (P05).
// Natija repodan tashqarida: $TAYANCH_SAVOLLAR_DIR/korib-chiqish/<sana>.md va tasdiqlash ro'yxati <sana>-tasdiqlash.txt.
// Ishga tushirish: TAYANCH_SAVOLLAR_DIR=~/Tayanch-savollar npm run savol:korib-chiq [-- --section math] [-- --limit 20]
// Tekshiruvdan o'tmagan draft savollar ham chiqadi, lekin xatolari bilan va tasdiqlash ro'yxatiga kirmaydi.
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { argumentlar, hammasiniTekshir, savolFayllari, savolHolati, savollarPapkasi } from './savol/umumiy.mjs';

const a = argumentlar();
const papka = savollarPapkasi(a);
const { natijalar, faylXatolari } = hammasiniTekshir(savolFayllari(papka));
for (const x of faylXatolari) console.error(`XATO ${x.fayl}:${x.joy}: ${x.xato}`);

let draftlar = natijalar.filter((n) => n.savol && typeof n.savol === 'object' && savolHolati(n.savol) === 'draft');
if (a.section) draftlar = draftlar.filter((n) => n.savol.section === a.section);
if (a.limit) draftlar = draftlar.slice(0, Number(a.limit));
if (!draftlar.length) { console.log("Ko'rib chiqiladigan draft savol yo'q."); process.exit(0); }

const sana = new Date().toISOString().slice(0, 10);
const chiqish = join(papka, 'korib-chiqish');
mkdirSync(chiqish, { recursive: true });
let nom = sana;
for (let i = 2; existsSync(join(chiqish, `${nom}.md`)); i++) nom = `${sana}-${i}`;

const md = [`# Ko'rib chiqish: ${draftlar.length} ta draft savol (${sana})`, '',
  "Har savolni o'qing. Tasdiqlamaydiganlaringizni `" + `${nom}-tasdiqlash.txt` + "` dan o'chiring (yoki `#` bilan izohga oling), so'ng:", '',
  '```', `npm run savol:tasdiqla -- --kim "<ismingiz>" --fayl ${join(chiqish, `${nom}-tasdiqlash.txt`)}`, '```', ''];
const royxat = [`# ${sana}: tasdiqlanadigan external_id lar (bir qatorda bitta; # bilan boshlangani o'tkaziladi)`];

for (const n of draftlar) {
  const s = n.savol;
  md.push('---', '', `## ${s.external_id}`, '');
  md.push(`- ${s.section} / ${s.domain} / ${s.skill} / qiyinlik ${s.difficulty} / ${s.format} / v${s.version}`);
  md.push(`- Muallif: ${s.author} (${s.drafted_by}); fayl: ${relative(papka, n.fayl)} (${n.joy})`);
  if (s.tags?.length) md.push(`- Teglar: ${s.tags.join(', ')}`);
  if (n.xatolar.length) {
    md.push('', '**Tekshiruvdan o\'tmagan (tasdiqlab bo\'lmaydi):**', '', ...n.xatolar.map((x) => `- ${x}`));
  } else {
    royxat.push(s.external_id);
  }
  if (n.ogohlar.length) md.push('', ...n.ogohlar.map((x) => `- Ogohlantirish: ${x}`));
  if (s.passage) md.push('', '**Passage**', '', ...String(s.passage).split('\n').map((q) => `> ${q}`));
  md.push('', '**Savol**', '', String(s.stem ?? ''));
  if (s.figure) md.push('', `**Rasm** (${s.figure.type}): ${s.figure.src}; alt: ${s.figure.alt}`);
  if (s.format === 'mcq' && Array.isArray(s.options)) {
    md.push('', ...s.options.map((o) => `- **${o.key}.** ${o.text}${o.key === s.answer ? '  ← to\'g\'ri javob' : ''}`));
  }
  md.push('', `**To'g'ri javob:** ${Array.isArray(s.answer) ? s.answer.map((x) => `\`${x}\``).join(', ') : s.answer}`);
  md.push('', '**Tushuntirish**', '', String(s.explanation ?? ''), '');
}

writeFileSync(join(chiqish, `${nom}.md`), md.join('\n'));
writeFileSync(join(chiqish, `${nom}-tasdiqlash.txt`), royxat.join('\n') + '\n');
console.log(`${draftlar.length} ta draft savol yozildi (${royxat.length - 1} tasi tasdiqlashga tayyor):`);
console.log(`  ${join(chiqish, `${nom}.md`)}`);
console.log(`  ${join(chiqish, `${nom}-tasdiqlash.txt`)}`);
