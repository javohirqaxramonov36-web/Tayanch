// Original savollar uchun umumiy mantiq (P05): fayllarni o'qish, tekshirish, hash, papka xavfsizligi.
// savol-tekshir, savol-korib-chiq, savol-tasdiqla va savol-import shu moduldan foydalanadi.
// Format: docs/savol-formati.md, turlar va taksonomiya: src/data/savolSxema.ts.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';
import {
  namunaTeg,
  ruxsatTeglar,
  savolMaydonlari,
  savolTaksonomiya,
  variantKalitlari,
} from '../../src/data/savolSxema.ts';

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export { namunaTeg, savolTaksonomiya };

// ---------- Argumentlar va papka ----------

/** --kalit qiymat, --kalit=qiymat va --bayroq ko'rinishidagi argumentlar. */
export function argumentlar(argv = process.argv.slice(2)) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (!x.startsWith('--')) { a._.push(x); continue; }
    const [k, v] = x.slice(2).split(/=(.*)/s);
    if (v !== undefined) a[k] = v;
    else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith('--')) a[k] = argv[++i];
    else a[k] = true;
  }
  return a;
}

export function repoIchidami(yol) {
  const r = relative(REPO, resolve(yol));
  return r === '' || (!r.startsWith('..') && !isAbsolute(r));
}

/** TAYANCH_SAVOLLAR_DIR (yoki --papka). Repo ichida bo'lsa to'xtaydi: original savollar ochiq repoga tushmasin. */
export function savollarPapkasi(a, { majburiy = true } = {}) {
  const p = a.papka ?? process.env.TAYANCH_SAVOLLAR_DIR;
  if (!p) {
    if (!majburiy) return null;
    xatoBilanChiq("TAYANCH_SAVOLLAR_DIR berilmagan (repodan tashqaridagi papka). Masalan: TAYANCH_SAVOLLAR_DIR=~/Tayanch-savollar npm run savol:tekshir");
  }
  const yol = resolve(p.replace(/^~(?=$|\/)/, process.env.HOME ?? '~'));
  if (repoIchidami(yol)) xatoBilanChiq(`Savollar papkasi repo ichida bo'lmasligi kerak (repo ochiq): ${yol}`);
  if (!existsSync(yol) || !statSync(yol).isDirectory()) xatoBilanChiq(`Savollar papkasi topilmadi: ${yol}`);
  return yol;
}

export function xatoBilanChiq(xabar) {
  console.error(`XATO: ${xabar}`);
  process.exit(1);
}

/** Papkadagi .json va .jsonl fayllar (ichki papkalar bilan; nuqta bilan boshlanganlari va node_modules o'tkaziladi). */
export function savolFayllari(papka, ildiz = papka) {
  const natija = [];
  for (const nom of readdirSync(papka).sort()) {
    if (nom.startsWith('.') || nom === 'node_modules' || (papka === ildiz && nom === 'staging')) continue;
    // Kurs sxemasiga tegishli fayllarni kurs:tekshir o'qiydi.
    if (papka === join(ildiz, 'content') && ['sat-math', 'sat-english'].includes(nom)) continue;
    const yol = join(papka, nom);
    const st = statSync(yol);
    if (st.isDirectory()) natija.push(...savolFayllari(yol, ildiz));
    else if (/\.jsonl?$/i.test(nom)) natija.push(yol);
  }
  return natija;
}

/**
 * Faylni o'qiydi. .json: bitta obyekt yoki massiv. .jsonl: har qatorda bitta obyekt.
 * Natija: { yozuvlar: [{ fayl, joy, savol }], xatolar: [{ fayl, joy, xato }] }.
 */
export function faylniOqi(fayl) {
  const matn = readFileSync(fayl, 'utf8');
  const yozuvlar = [];
  const xatolar = [];
  if (/\.jsonl$/i.test(fayl)) {
    matn.split('\n').forEach((qator, i) => {
      if (!qator.trim()) return;
      try { yozuvlar.push({ fayl, joy: `${i + 1}-qator`, savol: JSON.parse(qator) }); }
      catch (e) { xatolar.push({ fayl, joy: `${i + 1}-qator`, xato: `JSON o'qilmadi: ${e.message}` }); }
    });
  } else {
    try {
      const d = JSON.parse(matn);
      (Array.isArray(d) ? d : [d]).forEach((savol, i) => yozuvlar.push({ fayl, joy: `${i + 1}-yozuv`, savol }));
    } catch (e) {
      xatolar.push({ fayl, joy: '-', xato: `JSON o'qilmadi: ${e.message}` });
    }
  }
  return { yozuvlar, xatolar };
}

/** Faylni o'sha formatda qayta yozadi (savol obyektlari joyida o'zgartirilgan bo'lishi kerak). */
export function faylniYoz(fayl, savollar) {
  if (/\.jsonl$/i.test(fayl)) writeFileSync(fayl, savollar.map((s) => JSON.stringify(s)).join('\n') + '\n');
  else {
    const asl = JSON.parse(readFileSync(fayl, 'utf8'));
    writeFileSync(fayl, JSON.stringify(Array.isArray(asl) ? savollar : savollar[0], null, 2) + '\n');
  }
}

// ---------- Hash ----------

const sha = (x) => createHash('sha256').update(x).digest('hex');
const normal = (x) => String(x ?? '').toLowerCase().replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

/** Dublikat qidirish uchun: faqat matn (passage, stem, variantlar), teg va bo'shliqlarsiz. */
export function matnHash(s) {
  const variantlar = Array.isArray(s.options) ? s.options.map((o) => normal(o?.text)).sort() : [];
  return sha(JSON.stringify([normal(s.passage), normal(s.stem), variantlar]));
}

/** Tasdiqlash va import uchun: savolning butun mazmuni (meta-ma'lumotsiz). */
export function mazmunHash(s) {
  const m = {};
  for (const k of ['section', 'domain', 'skill', 'difficulty', 'format', 'passage', 'stem', 'options', 'answer', 'explanation', 'figure']) {
    m[k] = s[k] ?? null;
  }
  return sha(JSON.stringify(m));
}

// ---------- Matn tekshiruvlari ----------

const AI_NOMI = /\b(ai|claude|gpt|chatgpt|openai|gemini|llm|copilot|codex)\b/i;
export const aiNomimi = (x) => AI_NOMI.test(String(x ?? ''));
const bir = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();

/** \( ... \) va \[ ... \] ichidagi LaTeX'ni KaTeX bilan tekshiradi; ajratgichsiz LaTeX buyrug'ini ham ushlaydi. */
function latexTekshir(matn, maydon, xatolar) {
  let tashqi = '';
  let i = 0;
  while (i < matn.length) {
    const ochish = matn.slice(i).search(/\\[([]/);
    if (ochish < 0) { tashqi += matn.slice(i); break; }
    const bosh = i + ochish;
    tashqi += matn.slice(i, bosh);
    const display = matn[bosh + 1] === '[';
    const yopish = matn.indexOf(display ? '\\]' : '\\)', bosh + 2);
    if (yopish < 0) { xatolar.push(`${maydon}: LaTeX yopilmagan (${display ? '\\[' : '\\('} bor, ${display ? '\\]' : '\\)'} yo'q)`); return; }
    const ifoda = matn.slice(bosh + 2, yopish);
    try { katex.renderToString(ifoda, { throwOnError: true, displayMode: display, strict: 'error' }); }
    catch (e) { xatolar.push(`${maydon}: LaTeX xato: ${String(e.message).replace(/^KaTeX parse error: /, '').slice(0, 140)}`); }
    i = yopish + 2;
  }
  if (/\\[)\]]/.test(tashqi)) xatolar.push(`${maydon}: ochilmagan LaTeX yopuvchisi (\\) yoki \\])`);
  const buyruq = tashqi.match(/\\(frac|dfrac|sqrt|cdot|times|div|le|ge|leq|geq|neq|pi|theta|alpha|beta|sin|cos|tan|left|right|text|mathrm|circ|pm|approx|infty|overline)\b/);
  if (buyruq) xatolar.push(`${maydon}: LaTeX buyrug'i \\${buyruq[1]} \\( \\) yoki \\[ \\] ichida emas (masalan $...$ ishlatilgan)`);
}

/** Faqat ruxsat etilgan teglar, atributsiz, ochilgan-yopilgani teng. */
function htmlTekshir(matn, maydon, xatolar) {
  const sanoq = {};
  for (const m of matn.matchAll(/<\s*(\/?)\s*([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g)) {
    const [, yop, tegXom, attr] = m;
    const teg = tegXom.toLowerCase();
    if (!ruxsatTeglar.includes(teg)) { xatolar.push(`${maydon}: ruxsat etilmagan teg <${teg}>`); continue; }
    if (attr.replace(/\//g, '').trim()) xatolar.push(`${maydon}: <${teg}> da atribut bo'lmasligi kerak`);
    if (teg === 'br') continue;
    sanoq[teg] = (sanoq[teg] ?? 0) + (yop ? -1 : 1);
  }
  for (const [teg, n] of Object.entries(sanoq)) if (n !== 0) xatolar.push(`${maydon}: <${teg}> ochilgan va yopilganlari soni teng emas`);
}

function matnMaydon(s, maydon, xatolar, { majburiy = true, min = 1 } = {}) {
  const v = s[maydon];
  if (v === undefined || v === null || (typeof v === 'string' && !v.trim())) {
    if (majburiy) xatolar.push(`${maydon}: majburiy`);
    return;
  }
  if (typeof v !== 'string') { xatolar.push(`${maydon}: matn bo'lishi kerak`); return; }
  if (v.trim().length < min) xatolar.push(`${maydon}: juda qisqa (kamida ${min} belgi)`);
  htmlTekshir(v, maydon, xatolar);
  latexTekshir(v, maydon, xatolar);
}

// ---------- SPR javoblari ----------

/** SPR javobini songa aylantiradi: butun, o'nli (.75 ham) yoki oddiy kasr. Boshqasi null. */
export function sprSon(x) {
  const m = String(x).match(/^(-?)(?:(\d+)\/(\d+)|(\d+\.?\d*|\.\d+))$/);
  if (!m) return null;
  const q = m[2] !== undefined ? Number(m[2]) / Number(m[3]) : Number(m[4]);
  if (!Number.isFinite(q)) return null;
  return m[1] ? -q : q;
}

function sprTekshir(answer, xatolar, ogohlar, qiymatlarniSolishtir = true) {
  if (!Array.isArray(answer) || answer.length === 0) { xatolar.push("answer: spr uchun qabul qilinadigan javoblar ro'yxati kerak, masalan ['3/4', '.75', '0.75']"); return; }
  const qiymatlar = [];
  const korilgan = new Set();
  for (const j of answer) {
    if (typeof j !== 'string' || !j.trim()) { xatolar.push('answer: har javob bo\'sh bo\'lmagan matn bo\'lishi kerak'); continue; }
    if (/^-?\d+\s+\d+\/\d+$/.test(j)) { xatolar.push(`answer "${j}": aralash son bo'lmaydi (noto'g'ri kasr yoki o'nli son yozing)`); continue; }
    if (j !== j.trim() || /\s/.test(j)) { xatolar.push(`answer "${j}": bo'shliq bo'lmasligi kerak`); continue; }
    if (korilgan.has(j)) xatolar.push(`answer "${j}": takrorlangan`);
    korilgan.add(j);
    if (/[%$,]/.test(j)) { xatolar.push(`answer "${j}": %, $ yoki vergul bo'lmaydi`); continue; }
    const q = sprSon(j);
    if (q === null) { xatolar.push(`answer "${j}": butun son, o'nli son yoki kasr emas`); continue; }
    if (/\/0+$/.test(j)) { xatolar.push(`answer "${j}": maxraj 0`); continue; }
    const chegara = j.startsWith('-') ? 6 : 5;
    if (j.length > chegara) ogohlar.push(`answer "${j}": ${j.length} belgi (musbat javob 5, manfiy 6 belgidan oshmasligi kerak; qoida rasmiy matnda tekshirish kerak)`);
    qiymatlar.push({ j, q });
  }
  if (!qiymatlarniSolishtir) return;
  for (const { j, q } of qiymatlar.slice(1)) {
    const asos = qiymatlar[0];
    // O'nli yaxlitlash (masalan 2/3 → .6666, .6667) uchun kichik tafovutga ruxsat.
    if (Math.abs(q - asos.q) > 1e-3 + 1e-9) xatolar.push(`answer "${j}": "${asos.j}" bilan teng emas (javoblar bitta qiymatning yozuvlari bo'lishi kerak)`);
  }
}

// ---------- Savolni tekshirish ----------

/**
 * Bitta savolni tekshiradi. kontekst.fayl: figure yo'lini tekshirish uchun.
 * Natija: { xatolar: string[], ogohlar: string[] }.
 */
export function savolniTekshir(s, kontekst = {}) {
  const xatolar = [];
  const ogohlar = [];
  if (!s || typeof s !== 'object' || Array.isArray(s)) return { xatolar: ['savol obyekt emas'], ogohlar };

  for (const k of Object.keys(s)) if (!savolMaydonlari.includes(k)) xatolar.push(`noma'lum maydon "${k}"`);

  if (typeof s.external_id !== 'string' || !/^[a-z0-9][a-z0-9-]{2,63}$/.test(s.external_id)) {
    xatolar.push('external_id: 3–64 belgi, kichik lotin harf, raqam va defis');
  }

  const domenlar = savolTaksonomiya[s.section];
  if (!domenlar) xatolar.push(`section: "rw" yoki "math" bo'lishi kerak`);
  else if (!Object.hasOwn(domenlar, s.domain)) xatolar.push(`domain: "${s.domain}" ${s.section} taksonomiyasida yo'q`);
  else if (!domenlar[s.domain].includes(s.skill)) xatolar.push(`skill: "${s.skill}" "${s.domain}" domenida yo'q`);

  if (!Number.isInteger(s.difficulty) || s.difficulty < 1 || s.difficulty > 5) xatolar.push('difficulty: 1–5 butun son');

  matnMaydon(s, 'passage', xatolar, { majburiy: s.section === 'rw' });
  matnMaydon(s, 'stem', xatolar);
  matnMaydon(s, 'explanation', xatolar, { min: 20 });

  if (s.format === 'mcq') {
    if (!Array.isArray(s.options) || s.options.length !== 4) xatolar.push('options: mcq uchun aniq 4 ta variant');
    else {
      s.options.forEach((o, i) => {
        if (!o || o.key !== variantKalitlari[i]) xatolar.push(`options[${i}].key: "${variantKalitlari[i]}" bo'lishi kerak (A, B, C, D tartibida)`);
        if (o && Object.keys(o).some((k) => k !== 'key' && k !== 'text')) xatolar.push(`options[${i}]: faqat key va text maydonlari (to'g'ri javob answer'da)`);
        matnMaydon(o ?? {}, 'text', xatolar);
      });
      const matnlar = s.options.map((o) => normal(o?.text));
      if (new Set(matnlar).size !== matnlar.length) xatolar.push('options: bir xil matnli variantlar bor');
    }
    if (Array.isArray(s.answer)) xatolar.push(`answer: mcq uchun bitta harf (${s.answer.length} ta javob berilgan)`);
    else if (typeof s.answer !== 'string' || !variantKalitlari.includes(s.answer)) xatolar.push('answer: mcq uchun bitta harf: A, B, C yoki D');
  } else if (s.format === 'spr') {
    if (s.section !== 'math') xatolar.push('format: spr faqat math bo\'limida');
    if (Array.isArray(s.options) && s.options.length) xatolar.push('options: spr savolda variant bo\'lmaydi');
    // Kurs adapteri qiymatlarni alohida, aniq ratsional tekshiruvdan o'tkazadi.
    sprTekshir(s.answer, xatolar, ogohlar, !kontekst.sprAniqTekshiriladi);
  } else {
    xatolar.push('format: "mcq" yoki "spr"');
  }

  if (s.figure !== undefined && s.figure !== null) {
    const f = s.figure;
    if (typeof f !== 'object' || !['svg', 'png'].includes(f.type)) xatolar.push('figure.type: "svg" yoki "png"');
    else if (typeof f.src !== 'string' || !f.src || isAbsolute(f.src) || f.src.split(/[\\/]/).includes('..')) xatolar.push('figure.src: savol fayliga nisbatan yo\'l (absolyut yoki ".." emas)');
    else if (extname(f.src).toLowerCase() !== `.${f.type}`) xatolar.push(`figure.src: kengaytma .${f.type} bo'lishi kerak`);
    else if (kontekst.fayl && !existsSync(resolve(dirname(kontekst.fayl), f.src))) xatolar.push(`figure.src: fayl topilmadi (${f.src})`);
    if (typeof f?.alt !== 'string' || f.alt.trim().length < 5) xatolar.push('figure.alt: rasm tavsifi majburiy (kamida 5 belgi)');
  }

  if (!Array.isArray(s.tags) || s.tags.some((t) => typeof t !== 'string' || !t.trim())) xatolar.push("tags: matnlar ro'yxati (bo'sh bo'lishi mumkin)");
  if (s.source !== 'original') xatolar.push('source: faqat "original"');
  if (!['ai', 'human'].includes(s.drafted_by)) xatolar.push('drafted_by: "ai" yoki "human"');
  if (typeof s.author !== 'string' || !s.author.trim()) xatolar.push('author: majburiy');
  if (!Number.isInteger(s.version) || s.version < 1) xatolar.push('version: 1 dan boshlanadigan butun son');

  if (s.verified_by !== null && s.verified_by !== undefined) {
    if (typeof s.verified_by !== 'string' || !s.verified_by.trim()) xatolar.push('verified_by: inson ismi yoki null');
    else {
      if (bir(s.verified_by, s.author)) xatolar.push('verified_by: author bilan bir xil bo\'lmasligi kerak');
      if (aiNomimi(s.verified_by)) xatolar.push('verified_by: tasdiqlovchi inson bo\'lishi kerak (AI nomi emas)');
      if (typeof s.verified_at !== 'string' || Number.isNaN(Date.parse(s.verified_at))) xatolar.push('verified_at: tasdiqlangan savolda ISO sana kerak (savol:tasdiqla yozadi)');
      if (typeof s.verified_hash !== 'string') xatolar.push('verified_hash: yo\'q (savol:tasdiqla orqali tasdiqlang)');
      else if (s.verified_hash !== mazmunHash(s)) xatolar.push('verified_hash: tasdiqlangandan keyin mazmun o\'zgargan; version oshiring va qayta tasdiqlang (yoki verified_by ni null qiling)');
    }
  } else {
    if (s.verified_at) xatolar.push('verified_at: verified_by yo\'q, lekin tasdiqlash vaqti bor');
    if (s.drafted_by === 'ai') ogohlar.push('drafted_by=ai, verified_by yo\'q: draft bo\'lib qoladi (savol:korib-chiq → savol:tasdiqla)');
  }

  return { xatolar, ogohlar };
}

/** Holat: faqat to'liq tasdiqlangan (verified_by, author dan farqli, hash mos) savol verified bo'ladi. */
export function savolHolati(s) {
  const ok = typeof s.verified_by === 'string' && s.verified_by.trim() && !bir(s.verified_by, s.author)
    && !aiNomimi(s.verified_by) && s.verified_hash === mazmunHash(s);
  return ok ? 'verified' : 'draft';
}

/**
 * Savolni public.questions qatoriga aylantiradi (P02 sxemasi, PR #38 + 0010; ADR 002).
 * answer -> correct: mcq {"choice": "B"}, spr {"accepted": [...]} (RPC check_answer shu shaklni o'qiydi).
 * figure -> {path, alt, type}: path bucket ichidagi yo'l (can_read_question_figure shu bilan solishtiradi).
 * id yuborilmaydi: baza yaratadi, upsert external_id bo'yicha.
 */
export function bazaQatori(s, { hash, figureYol = null, status = savolHolati(s) } = {}) {
  const tasdiqlangan = status === 'verified';
  return {
    external_id: s.external_id,
    section: s.section,
    domain: s.domain,
    skill: s.skill,
    difficulty: s.difficulty,
    format: s.format,
    passage: s.passage ?? null,
    stem: s.stem,
    options: s.format === 'mcq' ? s.options : null,
    correct: s.format === 'mcq' ? { choice: s.answer } : { accepted: s.answer },
    explanation: s.explanation,
    figure: s.figure ? { path: figureYol, alt: s.figure.alt, type: s.figure.type } : null,
    tags: s.tags,
    source: s.source,
    drafted_by: s.drafted_by,
    author: s.author,
    verified_by: tasdiqlangan ? s.verified_by : null,
    verified_at: tasdiqlangan ? s.verified_at : null,
    version: s.version,
    status,
    content_hash: hash ?? mazmunHash(s),
  };
}

/** P05 importining xotiradagi qatori va ixtiyoriy rasm rejasi. */
export function importQatori(n, { hash = mazmunHash(n.savol) } = {}) {
  const s = n.savol;
  let rasm = null;
  if (s.figure) {
    const manba = resolve(dirname(n.fayl), s.figure.src);
    const yol = `${s.section}/${s.external_id}/${hash.slice(0, 12)}${extname(manba).toLowerCase()}`;
    rasm = { manba, yol, turi: s.figure.type === 'svg' ? 'image/svg+xml' : 'image/png' };
  }
  return { n, rasm, qator: bazaQatori(s, { hash, figureYol: rasm?.yol ?? null }) };
}

/**
 * Bir nechta fayldagi savollarni o'qib tekshiradi: alohida tekshiruv + ID va matn dublikati.
 * Natija: { natijalar: [{ fayl, joy, savol, xatolar, ogohlar }], faylXatolari }.
 */
export function hammasiniTekshir(fayllar) {
  const natijalar = [];
  const faylXatolari = [];
  for (const fayl of fayllar) {
    const { yozuvlar, xatolar } = faylniOqi(fayl);
    faylXatolari.push(...xatolar);
    for (const y of yozuvlar) natijalar.push({ ...y, ...savolniTekshir(y.savol, { fayl }) });
  }
  const idlar = new Map();
  const hashlar = new Map();
  for (const n of natijalar) {
    const id = n.savol?.external_id;
    if (typeof id === 'string') {
      if (idlar.has(id)) n.xatolar.push(`external_id takrorlangan (avval: ${joyNomi(idlar.get(id))})`);
      else idlar.set(id, n);
    }
    if (n.savol && typeof n.savol === 'object') {
      const h = matnHash(n.savol);
      if (hashlar.has(h)) n.xatolar.push(`dublikat matn (${hashlar.get(h).savol.external_id} bilan bir xil)`);
      else hashlar.set(h, n);
    }
  }
  return { natijalar, faylXatolari };
}

/** Joy: savollar papkasiga (bo'lsa) yoki joriy papkaga nisbatan qisqa yo'l. */
export function joyNomi(n) {
  const asos = process.env.TAYANCH_SAVOLLAR_DIR ? resolve(process.env.TAYANCH_SAVOLLAR_DIR.replace(/^~(?=$|\/)/, process.env.HOME ?? '~')) : null;
  const r = asos && !relative(asos, n.fayl).startsWith('..') ? relative(asos, n.fayl) : relative(process.cwd(), n.fayl);
  return `${r.split(sep).join('/')}:${n.joy}`;
}

/** Markdown jadval katagi uchun: | va yangi qator qochiriladi. */
export const katak = (x) => String(x ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');

// ---------- Kalit muvozanati (fayl bo'yicha) ----------
// Bitta fayl = bitta to'plam (masalan mock testning bitta moduli), savollar fayldagi tartibda ko'rsatiladi.
// Sabab: Stage 4 qoralamasida R&W'ning 54 savolidan 34 tasida javob A edi, D umuman yo'q edi
// ("har doim A" strategiyasi 63% berardi). Bu tekshiruv bloklamaydi, faqat ogohlantiradi.

/** Chegaralar. Kichik to'plamda (min dan kam mcq) foiz tekshirilmaydi, faqat ketma-ketlik. */
export const kalitChegara = { min: 8, maxUlush: 0.35, minUlush: 0.15, maxKetma: 3, uzunUlush: 0.4 };

const variantUzunligi = (o) => String(o?.text ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().length;

/** To'g'ri javob yagona eng uzun variantmi (teng uzunlik bo'lsa: yo'q). */
export function engUzunTogrimi(s) {
  if (s?.format !== 'mcq' || !Array.isArray(s.options) || s.options.length !== 4) return false;
  const u = s.options.map(variantUzunligi);
  const i = variantKalitlari.indexOf(s.answer);
  if (i < 0) return false;
  return u.every((x, j) => j === i || x < u[i]);
}

/**
 * Fayl bo'yicha mcq kalitlari taqsimoti. Faqat xatosiz natijalar hisoblanadi.
 * Natija: [{ fayl, soni, sanoq: {A,B,C,D}, ketma: {harf, uzunlik}, uzun: [external_id], ogohlar: string[] }].
 */
export function kalitMuvozanati(natijalar, chegara = kalitChegara) {
  const guruhlar = new Map();
  for (const n of natijalar) {
    if (n.xatolar?.length || n.savol?.format !== 'mcq') continue;
    if (!guruhlar.has(n.fayl)) guruhlar.set(n.fayl, []);
    guruhlar.get(n.fayl).push(n.savol);
  }
  const natija = [];
  for (const [fayl, savollar] of guruhlar) {
    const sanoq = Object.fromEntries(variantKalitlari.map((k) => [k, 0]));
    let ketma = { harf: null, uzunlik: 0 };
    let joriy = { harf: null, uzunlik: 0 };
    for (const s of savollar) {
      sanoq[s.answer]++;
      joriy = s.answer === joriy.harf ? { harf: joriy.harf, uzunlik: joriy.uzunlik + 1 } : { harf: s.answer, uzunlik: 1 };
      if (joriy.uzunlik > ketma.uzunlik) ketma = { ...joriy };
    }
    const uzun = savollar.filter(engUzunTogrimi).map((s) => s.external_id);
    const soni = savollar.length;
    const ogohlar = [];
    if (soni >= chegara.min) {
      for (const k of variantKalitlari) {
        const ulush = sanoq[k] / soni;
        if (ulush > chegara.maxUlush) ogohlar.push(`${k}: ${sanoq[k]}/${soni} (${Math.round(ulush * 100)}%), ${Math.round(chegara.maxUlush * 100)}% dan ko'p`);
        if (ulush < chegara.minUlush) ogohlar.push(`${k}: ${sanoq[k]}/${soni} (${Math.round(ulush * 100)}%), ${Math.round(chegara.minUlush * 100)}% dan kam`);
      }
      if (uzun.length / soni > chegara.uzunUlush) ogohlar.push(`to'g'ri javob ${uzun.length}/${soni} savolda eng uzun variant (tasodifan ~25%): ${uzun.join(', ')}`);
    }
    if (ketma.uzunlik > chegara.maxKetma) ogohlar.push(`${ketma.harf} ketma-ket ${ketma.uzunlik} marta (ko'pi bilan ${chegara.maxKetma})`);
    natija.push({ fayl, soni, sanoq, ketma, uzun, ogohlar });
  }
  return natija;
}
