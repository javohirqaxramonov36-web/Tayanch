import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { aiNomimi, argumentlar, xatoBilanChiq } from '../savol/umumiy.mjs';
import { mavzuYoli } from './nashr.mjs';
import { kursniTekshir } from './tekshir.mjs';
import { kursPapkasi } from './xususiy.mjs';

try {
  const a = argumentlar();
  if (typeof a.mavzu !== 'string' || typeof a.kim !== 'string' || !a.kim.trim() || aiNomimi(a.kim)) {
    throw new Error('--mavzu va inson ismi uchun --kim kerak');
  }
  const mavzuId = a.mavzu.toUpperCase();
  const { katalog: [mavzu], natijalar, xatolar } = kursniTekshir({ papka: a.papka, mavzuId, staging: true, muallif: a.kim.trim() });
  if (xatolar.length) xatoBilanChiq(xatolar.join('\n'));
  const ildiz = mavzuYoli(kursPapkasi(a.papka, 'staging'), mavzu);
  const review = [`# ${mavzuId} · ${mavzu.topic} · Muallif ko‘rigi`, '',
    'Har savol va yechimni tekshiring. Tasdiqlamaydigan qatorlarni tasdiqlash ro‘yxatida # bilan belgilang.', ''];
  const ids = ['# Ko‘rikdan o‘tgan savollarni qoldiring. Har qatorda ID va kurs mazmunining hash’i.'];
  for (const { manba: s, hash } of natijalar) {
    review.push(`## ${s.id} · ${s.stage} · ${s.type.toUpperCase()}`, '', s.prompt, '');
    if (s.choices) review.push(...s.choices.map((matn, i) => `- ${'ABCD'[i]}. ${matn}`), '');
    review.push(`**Javob:** ${[s.answer].flat().join(', ')}`, '', s.explanation_en, '');
    if (s.explanation_uz) review.push(`<div lang="uz">\n\n${s.explanation_uz}\n\n</div>`, '');
    ids.push(`${s.id} ${hash}`);
  }
  const shell = (x) => "'" + x.replaceAll("'", "'\\''") + "'";
  const env = a.papka ? `TAYANCH_SAVOLLAR_DIR=${shell(a.papka)} ` : '';
  review.push('## Tasdiqlash', '', '```sh',
    `${env}PATH=/opt/homebrew/bin:$PATH TAYANCH_KURS_PYTHON=/tmp/tayanch-kurs-venv/bin/python npm run kurs:tasdiqla -- --mavzu ${mavzuId} --kim ${shell(a.kim.trim())}`,
    '```', '');
  writeFileSync(join(ildiz, 'REVIEW.md'), review.join('\n'), { flag: 'wx', mode: 0o600 });
  writeFileSync(join(ildiz, 'tasdiqlash.txt'), ids.join('\n') + '\n', { flag: 'wx', mode: 0o600 });
  console.log(`${mavzuId}: ko‘rik uchun ${natijalar.length} ta savol.`);
} catch (e) { xatoBilanChiq(e.message); }
