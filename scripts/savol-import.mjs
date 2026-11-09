// Original savollarni Supabase'ga yuklaydi (P05). Standart rejim: dry-run (hech narsa yozilmaydi).
// Ishga tushirish:
//   TAYANCH_SAVOLLAR_DIR=~/Tayanch-savollar npm run savol:import              (dry-run)
//   TAYANCH_SAVOLLAR_DIR=~/Tayanch-savollar npm run savol:import -- --apply   (yozadi)
//   npm run savol:import -- --fayl docs/namuna-savol.json                    (dry-run, alohida fayl)
// Kalitlar faqat lokal .env dan (npm skripti --env-file-if-exists=.env bilan ishga tushiradi):
//   SUPABASE_URL (yoki PUBLIC_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY. Qiymatlar hech qachon chiqarilmaydi.
// Jadval va bucket: TAYANCH_SAVOL_JADVAL (standart sat_questions), TAYANCH_SAVOL_BUCKET (standart savol-rasmlar).
// Qoidalar: external_id bo'yicha upsert; verified_by bo'lmasa (yoki hash mos kelmasa) status=draft, aks holda verified.
// "namuna" tegli savol bazaga yuklanmaydi. Bazadagi mazmun o'zgargan, lekin version oshmagan savol rad etiladi.
import { readFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { argumentlar, hammasiniTekshir, joyNomi, mazmunHash, namunaTeg, savolFayllari, savolHolati, savollarPapkasi, xatoBilanChiq } from './savol/umumiy.mjs';

const a = argumentlar();
const apply = a.apply === true;
const fayllar = a.fayl ? String(a.fayl).split(',').map((x) => x.trim()).filter(Boolean) : savolFayllari(savollarPapkasi(a));
const JADVAL = process.env.TAYANCH_SAVOL_JADVAL || 'sat_questions';
const BUCKET = process.env.TAYANCH_SAVOL_BUCKET || 'savol-rasmlar';

const url = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const kalit = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (apply && (!url || !kalit)) xatoBilanChiq('--apply uchun lokal .env da SUPABASE_URL (yoki PUBLIC_SUPABASE_URL) va SUPABASE_SERVICE_ROLE_KEY kerak');
if (kalit) {
  // Ochiq kalit bilan RLS yozishga yo'l bermaydi; xatoni oldinroq aytamiz. Qiymat chiqarilmaydi.
  let rol = null;
  if (/^eyJ/.test(kalit)) {
    try { rol = JSON.parse(Buffer.from(kalit.split('.')[1], 'base64url').toString('utf8')).role; } catch { rol = '?'; }
  }
  if (/^sb_publishable_/.test(kalit) || (rol !== null && rol !== 'service_role')) xatoBilanChiq("SUPABASE_SERVICE_ROLE_KEY ochiq (publishable/anon) kalitga o'xshaydi");
}

// ---------- 1. Tekshiruv ----------
const { natijalar, faylXatolari } = hammasiniTekshir(fayllar);
const rad = faylXatolari.map((x) => ({ id: '-', joy: `${x.fayl}:${x.joy}`, sabab: x.xato }));
const tayyor = [];
for (const n of natijalar) {
  const id = n.savol?.external_id ?? '-';
  if (n.xatolar.length) { rad.push({ id, joy: joyNomi(n), sabab: n.xatolar.join('; ') }); continue; }
  if (apply && n.savol.tags.includes(namunaTeg)) { rad.push({ id, joy: joyNomi(n), sabab: 'namuna savol bazaga yuklanmaydi' }); continue; }
  tayyor.push(n);
}

// ---------- 2. Qatorlar ----------
const qatorlar = tayyor.map((n) => {
  const s = n.savol;
  const hash = mazmunHash(s);
  let figure = null;
  let rasm = null;
  if (s.figure) {
    const manba = resolve(dirname(n.fayl), s.figure.src);
    const yol = `${s.section}/${s.external_id}/${hash.slice(0, 12)}${extname(manba).toLowerCase()}`;
    figure = { type: s.figure.type, src: yol, alt: s.figure.alt };
    rasm = { manba, yol, turi: s.figure.type === 'svg' ? 'image/svg+xml' : 'image/png' };
  }
  const status = savolHolati(s);
  return {
    n,
    rasm,
    qator: {
      external_id: s.external_id,
      section: s.section,
      domain: s.domain,
      skill: s.skill,
      difficulty: s.difficulty,
      format: s.format,
      passage: s.passage ?? null,
      stem: s.stem,
      options: s.format === 'mcq' ? s.options : null,
      answer: s.answer,
      explanation: s.explanation,
      figure,
      tags: s.tags,
      source: s.source,
      drafted_by: s.drafted_by,
      author: s.author,
      verified_by: status === 'verified' ? s.verified_by : null,
      verified_at: status === 'verified' ? s.verified_at : null,
      version: s.version,
      status,
      content_hash: hash,
    },
  };
});

// ---------- 3. Bazadagi holat (kalit bo'lsa; dry-run'da faqat o'qiladi) ----------
let supabase = null;
const bazada = new Map();
if (url && kalit) {
  supabase = createClient(url, kalit, { auth: { persistSession: false, autoRefreshToken: false } });
  const idlar = qatorlar.map((q) => q.qator.external_id);
  for (let i = 0; i < idlar.length; i += 200) {
    const { data, error } = await supabase.from(JADVAL).select('external_id, version, content_hash').in('external_id', idlar.slice(i, i + 200));
    if (error) xatoBilanChiq(`"${JADVAL}" jadvalini o'qib bo'lmadi: ${error.message}`);
    for (const r of data) bazada.set(r.external_id, r);
  }
}

const yangi = [];
const yangilangan = [];
const ozgarishsiz = [];
for (const q of qatorlar) {
  const eski = bazada.get(q.qator.external_id);
  if (!eski) yangi.push(q);
  else if (eski.content_hash === q.qator.content_hash) {
    // Mazmun bir xil: faqat holat yoki meta o'zgargan bo'lishi mumkin, baribir yangilanadi (tasdiqlash shu yo'l bilan yetadi).
    (eski.version === q.qator.version ? ozgarishsiz : yangilangan).push(q);
  } else if (q.qator.version <= eski.version) {
    rad.push({ id: q.qator.external_id, joy: joyNomi(q.n), sabab: `bazadagi mazmundan farq qiladi, lekin version oshmagan (bazada v${eski.version})` });
  } else yangilangan.push(q);
}
// Holati o'zgargan (masalan endi tasdiqlangan) savollar "o'zgarishsiz" bo'lsa ham yoziladi: upsert idempotent.
const yoziladi = [...yangi, ...yangilangan, ...ozgarishsiz];

// ---------- 4. Yozish ----------
if (apply) {
  for (const q of yoziladi.filter((x) => x.rasm)) {
    const { error } = await supabase.storage.from(BUCKET).upload(q.rasm.yol, readFileSync(q.rasm.manba), { contentType: q.rasm.turi, upsert: true });
    if (error) xatoBilanChiq(`Rasm yuklanmadi (${q.qator.external_id}): ${error.message}`);
  }
  for (let i = 0; i < yoziladi.length; i += 100) {
    const { error } = await supabase.from(JADVAL).upsert(yoziladi.slice(i, i + 100).map((q) => q.qator), { onConflict: 'external_id' });
    if (error) xatoBilanChiq(`Upsert xatosi (${i + 1}–${Math.min(i + 100, yoziladi.length)}): ${error.message}`);
  }
}

// ---------- 5. Hisobot ----------
const rejim = apply ? 'APPLY' : 'DRY-RUN (hech narsa yozilmadi; yozish uchun --apply)';
console.log(`\n## Savol importi: ${rejim}\n`);
console.log(`Jadval: ${JADVAL}, bucket: ${BUCKET}, baza: ${supabase ? 'ulangan' : "ulanmagan (kalit yo'q: yaratiladi/yangilanadi farqi aniqlanmadi)"}\n`);
console.log('| Natija | Soni |\n| --- | --- |');
console.log(`| ${apply ? 'Yaratildi' : 'Yaratiladi'} | ${yangi.length} |`);
console.log(`| ${apply ? 'Yangilandi' : 'Yangilanadi'} | ${yangilangan.length} |`);
console.log(`| Mazmuni o'zgarmagan (qayta yoziladi) | ${ozgarishsiz.length} |`);
console.log(`| Rad etildi | ${rad.length} |`);
console.log(`| Shundan verified / draft | ${yoziladi.filter((q) => q.qator.status === 'verified').length} / ${yoziladi.filter((q) => q.qator.status === 'draft').length} |`);
console.log(`| Rasm ${apply ? 'yuklandi' : 'yuklanadi'} | ${yoziladi.filter((q) => q.rasm).length} |\n`);
if (!apply && yoziladi.length) {
  console.log('| external_id | status | v | rasm (bucket yo\'li) |\n| --- | --- | --- | --- |');
  for (const q of yoziladi) console.log(`| ${q.qator.external_id} | ${q.qator.status} | ${q.qator.version} | ${q.rasm?.yol ?? '-'} |`);
  console.log('');
}
if (rad.length) {
  console.log('### Rad etilganlar\n\n| external_id | Joy | Sabab |\n| --- | --- | --- |');
  for (const r of rad) console.log(`| ${r.id} | ${r.joy} | ${String(r.sabab).replace(/\|/g, '\\|')} |`);
  process.exit(1);
}
