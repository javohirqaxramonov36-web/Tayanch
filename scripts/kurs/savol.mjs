import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { aiNomimi, importQatori, matnHash, mazmunHash, savolniTekshir } from '../savol/umumiy.mjs';
import { variantKalitlari } from '../../src/data/savolSxema.ts';
import { pngOqi } from './xususiy.mjs';
import { BOSQICHLAR } from './katalog.mjs';

const MAYDONLAR = new Set([
  'id', 'course', 'domain', 'skill', 'topic_id', 'stage', 'difficulty', 'type', 'time_sec',
  'prompt', 'passage', 'choices', 'answer', 'accepted', 'explanation_en', 'explanation_uz', 'check', 'check_choices',
  'reviewed', 'source', 'author', 'drafted_by', 'version', 'verified_by', 'verified_at', 'verified_hash', 'figure',
]);
const matnmi = (x, max) => typeof x === 'string' && x.trim().length > 0 && x.length <= max;
const qisqaRoyxat = (x, max) => Array.isArray(x) && x.length > 0 && x.length <= max && x.every((j) => matnmi(j, 40));
const sha = (x) => createHash('sha256').update(x).digest('hex');

function tartibla(x) {
  if (Array.isArray(x)) return x.map(tartibla);
  if (x && typeof x === 'object') return Object.fromEntries(Object.keys(x).sort().map((k) => [k, tartibla(x[k])]));
  return x;
}

function tasdiqTekshir(s, hash, muallif) {
  const { verified_by, verified_at, verified_hash } = s;
  if (!s.reviewed) {
    return [verified_by, verified_at, verified_hash].some((x) => x != null)
      ? 'reviewed: false bo‘lganda tasdiq maydonlari bo‘sh bo‘lishi kerak' : null;
  }
  if (!matnmi(verified_by, 120) || aiNomimi(verified_by) || !muallif
      || verified_by.trim() !== muallif || verified_by.trim().toLowerCase() === s.author.trim().toLowerCase()) {
    return 'verified_by: TAYANCH_MUALLIF bilan mos mustaqil inson tasdig‘i kerak';
  }
  const vaqt = new Date(typeof verified_at === 'string' ? verified_at : NaN);
  if (Number.isNaN(vaqt.getTime()) || vaqt.getTime() > Date.now() ||
      (verified_at !== vaqt.toISOString() && verified_at !== vaqt.toISOString().replace('.000Z', 'Z'))) {
    return 'verified_at: UTC ISO 8601 formatida haqiqiy tasdiq vaqti kerak';
  }
  return verified_hash === hash ? null : 'verified_hash: mazmun o‘zgargan yoki tasdiq hash’i yetishmaydi';
}

export function kursSavoliniOqi(s, mavzu, fayl, muallif) {
  if (!s || typeof s !== 'object' || Array.isArray(s)) throw new Error('Savol obyekt bo‘lishi kerak');
  if (Object.keys(s).some((nom) => !MAYDONLAR.has(nom))) throw new Error('Savolda noma’lum maydon bor');
  if (s.course !== 'math' || s.topic_id !== mavzu.id || !BOSQICHLAR.includes(s.stage)
      || !mavzu.counts[s.stage]) throw new Error('course, topic_id yoki stage mavzu to‘plamiga mos emas');
  if (mavzu.skill && (s.domain !== mavzu.domain || s.skill !== mavzu.skill)) {
    throw new Error('domain va skill CSV katalogiga mos emas');
  }
  if (!matnmi(s.domain, 120) || !matnmi(s.skill, 120) || ![1, 2, 3].includes(s.difficulty)
      || !Number.isSafeInteger(s.time_sec) || s.time_sec < 1 || !['mcq', 'spr'].includes(s.type)
      || typeof s.reviewed !== 'boolean' || s.source !== 'original' || !matnmi(s.author, 120)
      || !Number.isSafeInteger(s.version)) throw new Error('Savol metama’lumotlari sxemaga mos emas');
  if (!matnmi(s.prompt, 4000) || !matnmi(s.explanation_en, 6000)
      || (s.passage != null && !matnmi(s.passage, 4000))) throw new Error('prompt, passage yoki explanation_en matni xato');
  if (s.stage === 'Foundation' ? !matnmi(s.explanation_uz, 6000) : s.explanation_uz != null) {
    throw new Error('explanation_uz faqat Foundation bosqichida majburiy');
  }

  const mcq = s.type === 'mcq';
  if (mcq && (!Array.isArray(s.choices) || s.choices.length !== 4 ||
      s.choices.some((x) => !matnmi(x, 160)) || !variantKalitlari.includes(s.answer) || s.accepted != null)) {
    throw new Error('MCQ: 4 ta A–D variant va bitta javob harfi kerak');
  }
  if (s.check_choices !== undefined && (!mcq || s.check?.kind === 'linear_count' || !Array.isArray(s.check_choices)
      || s.check_choices.length !== 4 || s.check_choices.some((x) => !matnmi(x, 160)))) {
    throw new Error('check_choices: MCQ uchun to‘rtta matematik ifoda kerak');
  }
  const exact = Array.isArray(s.answer) ? s.answer : [s.answer];
  if (!mcq && (s.choices != null || !qisqaRoyxat(exact, 4) || !qisqaRoyxat(s.accepted, 24))) {
    throw new Error('SPR: aniq javob va accepted ro‘yxati kerak');
  }

  let rasmHash = null;
  if (s.figure != null) {
    const f = s.figure;
    if (typeof f !== 'object' || Object.keys(f).sort().join(',') !== 'alt,src,type'
        || f.type !== 'png' || !matnmi(f.alt, 400) || f.alt.trim().length < 5 || /[<>\r\n]/.test(f.alt)) {
      throw new Error('figure: PNG va oddiy matnli alt tavsifi kerak');
    }
    rasmHash = sha(pngOqi(dirname(fayl), f.src));
  }

  const toplam = `sat-kurs:v1:${mavzu.topicSlug}:${s.stage.toLowerCase()}`;
  const savol = {
    external_id: s.id,
    section: 'math',
    domain: s.domain,
    skill: s.skill,
    difficulty: 2 * s.difficulty - 1,
    format: s.type,
    stem: s.prompt,
    passage: s.passage ?? null,
    options: mcq ? s.choices.map((text, i) => ({ key: variantKalitlari[i], text })) : null,
    answer: mcq ? s.answer : s.accepted,
    explanation: s.explanation_en,
    figure: s.figure ?? null,
    tags: [toplam],
    source: s.source,
    drafted_by: s.drafted_by,
    author: s.author,
    version: s.version,
  };
  const p05 = savolniTekshir(savol, { fayl, sprAniqTekshiriladi: true });
  // P05 xato matnlarida savol yoki javob parchasi bo‘lishi mumkin.
  if (p05.xatolar.length) throw new Error('P05: savol sxemasi, taksonomiya yoki matn formati xato');

  const { reviewed, verified_by, verified_at, verified_hash, ...mazmun } = s;
  const hash = sha(JSON.stringify(tartibla({ ...mazmun, set: toplam, image_hash: rasmHash })));
  const tasdiqXatosi = tasdiqTekshir(s, hash, muallif);
  if (tasdiqXatosi) throw new Error(tasdiqXatosi);

  if (reviewed) Object.assign(savol, { verified_by, verified_at, verified_hash: mazmunHash(savol) });

  const texts = [s.prompt, s.passage, s.explanation_en, s.explanation_uz].filter((x) => x != null);
  const topshiriq = mcq
    ? { type: s.type, check: s.check, choices: s.check_choices ?? s.choices, key: variantKalitlari.indexOf(s.answer), texts }
    : { type: s.type, check: s.check, exact, accepted: s.accepted, texts };
  const normalla = (x) => x?.normalize('NFKC');
  const matnImzosi = matnHash({ stem: normalla(savol.stem), passage: normalla(savol.passage) });
  return { savol, fayl, hash, matnImzosi, topshiriq, reviewed };
}

export function kursImportRejasi(natijalar, katalog) {
  const jami = katalog.reduce((n, m) => n + m.total, 0);
  if (natijalar.length !== jami || natijalar.some((n) => !n.reviewed)) return [];
  return natijalar.map((n) => {
    const reja = importQatori(n, { hash: n.hash });
    if (n.topshiriq.type === 'spr') reja.qator.correct.exact = n.topshiriq.exact;
    return reja;
  });
}
