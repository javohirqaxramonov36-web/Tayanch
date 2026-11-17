import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { argumentlar, hammasiniTekshir, savolFayllari, savolHolati, xatoBilanChiq } from '../savol/umumiy.mjs';
import { katalogniOqi } from './katalog.mjs';
import { mavzuYoli } from './nashr.mjs';
import { kursPapkasi } from './xususiy.mjs';

try {
  const a = argumentlar();
  if (typeof a.reja !== 'string') throw new Error('Xususiy konvertatsiya rejasi uchun --reja kerak');
  const staging = kursPapkasi(a.papka, 'staging');
  const katalog = katalogniOqi();
  const { natijalar, faylXatolari } = hammasiniTekshir(savolFayllari(kursPapkasi(a.papka, 'stage4')));
  if (faylXatolari.length || natijalar.some((n) => n.xatolar.length)) throw new Error('Stage 4 P05 tekshiruvidan o‘tmadi');
  const reja = JSON.parse(readFileSync(a.reja, 'utf8'));
  for (const mavzu of katalog.filter((m) => m.skill)) {
    const manbalar = natijalar.map((n) => n.savol).filter((s) =>
      s.section === 'math' && s.domain === mavzu.domain && s.skill === mavzu.skill);
    if (!manbalar.length) continue;
    const izlar = {};
    const savollar = manbalar.map((s) => {
      const t = reja[s.external_id];
      if (!t || savolHolati(s) !== 'verified' || s.figure) throw new Error(`${mavzu.id}: manba tasdig‘i yoki konvertatsiya rejasi yetishmaydi`);
      const id = `kurs-${mavzu.topicSlug}-${s.external_id}`;
      const matn = (x) => x.replace(/<br\s*\/?\s*>/gi, '\n').replace(/\u2212/g, '-');
      const { verified_by, verified_at, verified_hash } = s;
      izlar[id] = { external_id: s.external_id, verified_by, verified_at, verified_hash };
      return {
        id, course: 'math', topic_id: mavzu.id, domain: s.domain, skill: s.skill, stage: t.stage,
        difficulty: s.difficulty <= 2 ? 1 : s.difficulty <= 4 ? 2 : 3,
        time_sec: t.time_sec, type: s.format, prompt: matn(s.stem),
        ...(s.passage ? { passage: matn(s.passage) } : {}),
        ...(s.format === 'mcq'
          ? { choices: s.options.map((o) => matn(o.text)), answer: s.answer }
          : { answer: t.exact ?? s.answer[0], accepted: s.answer }),
        explanation_en: matn(s.explanation),
        ...(t.explanation_uz ? { explanation_uz: t.explanation_uz } : {}),
        check: t.check, ...(t.check_choices ? { check_choices: t.check_choices } : {}), reviewed: false, source: s.source, author: s.author,
        drafted_by: s.drafted_by, version: 1,
      };
    });
    const joy = mavzuYoli(staging, mavzu);
    mkdirSync(joy, { recursive: true, mode: 0o700 });
    for (const [nom, matn] of [['questions.json', savollar], ['p05-manbalar.json', izlar]]) {
      writeFileSync(join(joy, nom), JSON.stringify(matn, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    }
    console.log(`${mavzu.id}: ${savollar.length} ta konvertatsiya qilindi.`);
  }
} catch (e) { xatoBilanChiq(e.message); }
