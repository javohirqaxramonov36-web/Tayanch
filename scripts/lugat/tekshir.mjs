// Lug'at CSV (P15): o'qish va tekshirish. Sof funksiyalar, faqat Node'ning o'z imkoniyatlari.
// Shablon: docs/lugat-shablon.csv. Qoidalar: docs/lugat-import.md.
// Chegaralar migratsiya bilan bir xil (20261111120000_lugat_p15.sql, 0005 vocab_words).

export const USTUNLAR = ['word', 'part_of_speech', 'definition', 'example', 'difficulty', 'topic'];
export const IXTIYORIY = ['uzbek'];
export const QIYINLIK = ['easy', 'medium', 'hard'];
export const SOZ_TURKUMI = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'phrase'];

/** RFC 4180 CSV: qo'shtirnoq ichida vergul, qo'shtirnoq ("") va yangi qator bo'lishi mumkin. BOM olib tashlanadi. */
export function csvOqi(matn) {
  const s = matn.replace(/^﻿/, '');
  const qatorlar = [];
  let qator = [];
  let maydon = '';
  let qoshtirnoq = false;
  let qatorRaqami = 1;
  let boshlanish = 1;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (qoshtirnoq) {
      if (c === '"' && s[i + 1] === '"') { maydon += '"'; i++; }
      else if (c === '"') qoshtirnoq = false;
      else { if (c === '\n') qatorRaqami++; maydon += c; }
      continue;
    }
    if (c === '"' && maydon === '') qoshtirnoq = true;
    else if (c === ',') { qator.push(maydon); maydon = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      qator.push(maydon); maydon = '';
      if (qator.some((x) => x !== '')) qatorlar.push({ raqam: boshlanish, maydonlar: qator });
      qator = [];
      qatorRaqami++;
      boshlanish = qatorRaqami;
    } else maydon += c;
  }
  if (qoshtirnoq) throw new Error(`CSV: ${boshlanish}-qatorda yopilmagan qo'shtirnoq`);
  qator.push(maydon);
  if (qator.some((x) => x !== '')) qatorlar.push({ raqam: boshlanish, maydonlar: qator });
  return qatorlar;
}

const toza = (x) => (x ?? '').replace(/\s+/g, ' ').trim();
const SOZ = /^[A-Za-z][A-Za-z' -]*[A-Za-z]$|^[A-Za-z]$/;

/**
 * CSV matnini tekshiradi. Natija: { sozlar, xatolar, ogohlar }.
 * xatolar bo'lsa import qilinmaydi. ogohlar: import to'xtamaydi, lekin muallif ko'rib chiqadi.
 */
export function tekshir(matn) {
  const xatolar = [];
  const ogohlar = [];
  const sozlar = [];
  let qatorlar;
  try { qatorlar = csvOqi(matn); } catch (e) { return { sozlar, xatolar: [e.message], ogohlar }; }
  if (!qatorlar.length) return { sozlar, xatolar: ['CSV bo\'sh: sarlavha qatori yo\'q'], ogohlar };

  const sarlavha = qatorlar[0].maydonlar.map((x) => toza(x).toLowerCase());
  const yetishmaydi = USTUNLAR.filter((u) => !sarlavha.includes(u));
  const notanish = sarlavha.filter((u) => !USTUNLAR.includes(u) && !IXTIYORIY.includes(u));
  const takrorUstun = sarlavha.filter((u, i) => sarlavha.indexOf(u) !== i);
  if (yetishmaydi.length) xatolar.push(`Sarlavhada ustun yo'q: ${yetishmaydi.join(', ')}`);
  if (notanish.length) xatolar.push(`Notanish ustun: ${notanish.join(', ')}`);
  if (takrorUstun.length) xatolar.push(`Takror ustun: ${takrorUstun.join(', ')}`);
  if (xatolar.length) return { sozlar, xatolar, ogohlar };

  const korilgan = new Map();
  for (const { raqam, maydonlar } of qatorlar.slice(1)) {
    const q = (m) => `${raqam}-qator: ${m}`;
    if (maydonlar.length !== sarlavha.length) {
      xatolar.push(q(`${sarlavha.length} ta maydon kutilgan, ${maydonlar.length} ta bor`));
      continue;
    }
    const r = Object.fromEntries(sarlavha.map((u, i) => [u, toza(maydonlar[i])]));
    const s = {
      word: r.word,
      part_of_speech: r.part_of_speech.toLowerCase(),
      definition: r.definition,
      example: r.example,
      difficulty: r.difficulty.toLowerCase(),
      topic: r.topic,
      uzbek: r.uzbek || null,
    };
    const oldingi = xatolar.length;
    if (!s.word) xatolar.push(q('word bo\'sh'));
    else if (s.word.length > 80 || !SOZ.test(s.word)) xatolar.push(q(`word "${s.word}": faqat lotin harflari, bo'shliq, chiziqcha, apostrof (80 belgigacha)`));
    if (!SOZ_TURKUMI.includes(s.part_of_speech)) xatolar.push(q(`part_of_speech "${s.part_of_speech}": ${SOZ_TURKUMI.join(' | ')} bo'lishi kerak`));
    if (!s.definition || s.definition.length > 300) xatolar.push(q('definition 1–300 belgi bo\'lishi kerak'));
    if (!s.example || s.example.length > 300) xatolar.push(q('example 1–300 belgi bo\'lishi kerak'));
    if (!QIYINLIK.includes(s.difficulty)) xatolar.push(q(`difficulty "${s.difficulty}": ${QIYINLIK.join(' | ')} bo'lishi kerak`));
    if (!s.topic || s.topic.length > 40) xatolar.push(q('topic 1–40 belgi bo\'lishi kerak'));
    if (s.uzbek && s.uzbek.length > 120) xatolar.push(q('uzbek 120 belgidan oshmasin'));
    const kalit = s.word.toLowerCase();
    if (s.word && korilgan.has(kalit)) xatolar.push(q(`"${s.word}" takror (${korilgan.get(kalit)}-qatorda bor)`));
    if (xatolar.length !== oldingi) continue;
    korilgan.set(kalit, raqam);

    // Ogohlar: ta'rifda so'zning o'zi, misolda so'z (yoki uning o'zagi) yo'q.
    const ozak = kalit.slice(0, Math.max(3, kalit.length - 3));
    if (new RegExp(`\\b${kalit.replace(/[-']/g, '.')}\\b`, 'i').test(s.definition)) ogohlar.push(q(`ta'rifda "${s.word}" so'zining o'zi bor`));
    if (!s.example.toLowerCase().includes(ozak)) ogohlar.push(q(`misolda "${s.word}" topilmadi`));
    sozlar.push(s);
  }
  if (!sozlar.length && !xatolar.length) xatolar.push('CSV da so\'z yo\'q (faqat sarlavha)');
  return { sozlar, xatolar, ogohlar };
}

/** Qisqa hisobot uchun: qiyinlik va mavzu bo'yicha sonlar. */
export function xulosa(sozlar) {
  const sana = (k) => sozlar.reduce((m, s) => m.set(s[k], (m.get(s[k]) ?? 0) + 1), new Map());
  return { jami: sozlar.length, qiyinlik: Object.fromEntries(sana('difficulty')), mavzu: Object.fromEntries(sana('topic')) };
}
