import { readFileSync } from 'node:fs';
import { csvOqi } from '../lugat/tekshir.mjs';
import { savolTaksonomiya } from '../savol/umumiy.mjs';

const USTUNLAR = 'id,course,domain,cb_skill,topic,order,prerequisites,subtopics,desmos_useful,spr_share,foundation_practice,core_practice,advanced_practice,mini_test,total_questions,est_minutes,notes';
const MVP = ['MX3', 'A1', 'A2', 'A3', 'A4', 'A5'];
export const BOSQICHLAR = ['Foundation', 'Core', 'Advanced', 'mini_test'];

export function katalogniOqi(matn = readFileSync(new URL('../../docs/course-spec/math-topics.csv', import.meta.url), 'utf8')) {
  const [sarlavha, ...qatorlar] = csvOqi(matn);
  const ustunlar = USTUNLAR.split(',');
  if (sarlavha?.maydonlar.join(',') !== USTUNLAR || sarlavha.maydonlar.length !== ustunlar.length) {
    throw new Error('CSV: ustunlar sxemaga mos emas');
  }

  const mavzular = new Map();
  const tartib = new Set();
  for (const { raqam, maydonlar } of qatorlar) {
    const joy = `CSV: ${raqam}-qator`;
    if (maydonlar.length !== ustunlar.length) throw new Error(`${joy}: ustunlar soni xato`);
    const q = Object.fromEntries(ustunlar.map((ustun, i) => [ustun, maydonlar[i].trim()]));
    if (!/^(MX|[AMPG])[1-9]\d*$/.test(q.id) || mavzular.has(q.id) || q.course !== 'math' || !q.topic || !q.subtopics) {
      throw new Error(`${joy}: mavzu ma’lumoti yoki noyob ID xato`);
    }
    const son = (nom) => {
      if (!/^\d{1,4}$/.test(q[nom])) throw new Error(`${joy}: ${nom} butun son bo‘lishi kerak`);
      return Number(q[nom]);
    };
    const order = son('order');
    const minutes = son('est_minutes');
    if (!order || tartib.has(order) || !minutes || !['yes', 'no'].includes(q.desmos_useful)) {
      throw new Error(`${joy}: tartib, vaqt yoki Desmos maydoni xato`);
    }
    tartib.add(order);
    const extra = q.id.startsWith('MX');
    const domenlar = savolTaksonomiya.math;
    const skill = Object.hasOwn(domenlar, q.domain)
      ? domenlar[q.domain].find((nom) => nom.toLowerCase() === q.cb_skill.toLowerCase())
      : undefined;
    if (extra ? q.domain !== 'Extra' || q.cb_skill !== '(none)' : !skill) {
      throw new Error(`${joy}: domen yoki skill P05 taksonomiyasiga mos emas`);
    }
    const counts = Object.fromEntries(BOSQICHLAR.map((nom) => [nom, son(nom === 'mini_test' ? nom : `${nom.toLowerCase()}_practice`)]));
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (total !== son('total_questions') || BOSQICHLAR.slice(0, 3).some((nom) => !counts[nom])) {
      throw new Error(`${joy}: bosqichlar va jami savol soni mos emas`);
    }
    if (!/^(?:0(?:\.\d+)?|1(?:\.0+)?)$/.test(q.spr_share)) throw new Error(`${joy}: spr_share 0–1 oralig‘ida bo‘lishi kerak`);
    const prerequisites = q.prerequisites ? q.prerequisites.split(';').map((nom) => nom.trim()) : [];
    if (new Set(prerequisites).size !== prerequisites.length) throw new Error(`${joy}: prerequisite takrorlangan`);
    mavzular.set(q.id, {
      id: q.id, course: q.course, domain: q.domain, skill: skill ?? null, topic: q.topic,
      order, prerequisites, subtopics: q.subtopics.split(';').map((nom) => nom.trim()),
      desmos: q.desmos_useful === 'yes', counts, total, minutes,
      spr: Math.round(total * Number(q.spr_share)),
      domainSlug: q.domain.toLowerCase().replaceAll(' ', '-'), topicSlug: q.id.toLowerCase(),
    });
  }

  const tashrif = new Set();
  const tugagan = new Set();
  function prerequisiteTekshir(id) {
    if (tashrif.has(id)) throw new Error(`CSV: ${id} prerequisite siklida`);
    if (tugagan.has(id)) return;
    if (!mavzular.has(id)) throw new Error(`CSV: ${id} prerequisite topilmadi`);
    tashrif.add(id);
    mavzular.get(id).prerequisites.forEach(prerequisiteTekshir);
    tashrif.delete(id);
    tugagan.add(id);
  }
  mavzular.forEach((mavzu) => prerequisiteTekshir(mavzu.id));

  const mvp = MVP.map((id) => mavzular.get(id));
  if (mvp.some((mavzu, i) => !mavzu || mavzu.domain !== (i ? 'Algebra' : 'Extra')
      || mavzu.counts.mini_test !== (i ? 10 : 0) || mavzu.prerequisites.some((id) => !MVP.includes(id)))
      || mvp.reduce((jami, mavzu) => jami + mavzu.total, 0) !== 200) {
    throw new Error('CSV: MVP 6 mavzu, 200 savol va 5 ta 10 savolli mini-testdan iborat bo‘lishi kerak');
  }
  return mvp.sort((a, b) => a.order - b.order);
}
