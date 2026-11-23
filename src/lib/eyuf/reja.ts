import rules from '../../../data/eyuf/rules.json' with { type: 'json' };
export type Daraja = 'bachelor' | 'master';
export type Javob = 'yes' | 'no' | 'unknown';
export interface Profil {
  level: Daraja;
  age: number | null;
  citizen: Javob;
  prior: Javob;
  study: Javob;
  conviction: Javob;
  work: number | null;
  letter: 'unconditional' | 'conditional' | 'none' | 'unknown';
  ielts: number | null;
  funding: 'full-cost' | 'tuition' | 'partial' | 'none' | 'unknown';
  grantPercent: number | null;
  ranking: number | null;
  rankingSystem: 'QS' | 'THE' | 'unknown';
  rankingEdition: string;
  university: string;
  specialty: string;
  school: Javob;
  certificate: 'sat' | 'gre' | 'gmat' | 'alevel' | 'none' | 'unknown';
  certificateValid: Javob;
  sat: number | null;
  verbal: number | null;
  quant: number | null;
  writing: number | null;
  alevel: Javob;
}
export interface Hisobot {
  state: 'mos' | 'mos-emas' | 'aniqlashtirish';
  reasons: string[];
}
export function moslik(p: Profil): Hisobot {
  const bad: string[] = [];
  const missing: string[] = [];
  if (p.citizen === 'no')
    bad.push('Nizomda O‘zbekiston fuqaroligi talab etiladi.');
  if (p.prior === 'yes')
    bad.push(
      'Avval xorijda shu darajadagi ayni yoki turdosh yo‘nalishda o‘qiganlikni Jamg‘arma bilan tekshiring.',
    );
  if (p.study === 'yes')
    bad.push(
      'Xorijdagi sirtqi yoki onlayn dastur ishtirok etish shartiga mos kelmaydi.',
    );
  if (p.conviction === 'yes')
    bad.push(
      'Tugallanmagan yoki olib tashlanmagan sudlanganlik cheklovi mavjud.',
    );
  if (p.funding === 'full-cost')
    bad.push(
      'Barcha ta’lim xarajatlari to‘liq xorijiy grant bilan qoplangan holat cheklangan.',
    );
  if (p.age === null) missing.push('Yosh ko‘rsatilmagan.');
  else if (
    p.age >
      (p.level === 'master' ? rules.master_max_age : rules.bachelor_max_age) ||
    (p.level === 'master' && p.age < rules.master_min_age)
  )
    bad.push('Yosh ko‘rsatkichi Nizomdagi oraliqqa mos kelmaydi.');
  else
    missing.push(
      'Yoshni hisoblash sanasi joriy tanlov uchun aniqlashtiriladi.',
    );
  if (
    p.level === 'master' &&
    p.work !== null &&
    p.work < rules.master_min_work_years
  )
    bad.push(
      'Magistratura uchun kamida bir yil qayd etilgan mehnat staji talab etiladi.',
    );
  if (p.level === 'master' && p.work === null)
    missing.push(
      'Mehnat staji va uning Yagona milliy mehnat tizimidagi qaydi tekshiriladi.',
    );
  if (p.letter === 'none')
    bad.push(
      'Yo‘nalish ko‘rsatilgan amaldagi qabul yoki shartli qabul xati kerak.',
    );
  if (p.letter === 'unknown')
    missing.push('Qabul xati holati aniqlashtiriladi.');
  if (p.letter !== 'unconditional') {
    if (p.ielts === null)
      missing.push(
        'Til sertifikati yoki unga tenglashtirilgan sertifikat tekshiriladi.',
      );
    else if (p.ielts < rules.ielts[p.level])
      bad.push(
        'Kiritilgan IELTS Academic bali daraja uchun belgilangan chegaradan past.',
      );
  }
  if (
    [p.citizen, p.prior, p.study, p.conviction].includes('unknown') ||
    p.funding === 'unknown'
  )
    missing.push('Cheklovlar bo‘yicha barcha javoblar aniqlanmagan.');
  missing.push(
    'Hujjatlar haqiqiyligi va universitetning joriy ro‘yxatga mosligi Jamg‘arma tomonidan tekshiriladi.',
  );
  return {
    state: bad.length ? 'mos-emas' : 'aniqlashtirish',
    reasons: [...bad, ...missing],
  };
}
export function imtihonsiz(p: Profil): Hisobot {
  const system = p.level === 'bachelor' ? 'QS' : 'THE';
  if (
    p.ranking === null ||
    !p.rankingEdition.trim() ||
    p.rankingSystem !== system ||
    p.funding === 'unknown'
  )
    return {
      state: 'aniqlashtirish',
      reasons: [
        `Darajangiz uchun ${system} global reyting nashri, o‘rni va grant qamrovi tekshirilishi kerak.`,
      ],
    };
  if (p.funding === 'tuition' && p.ranking <= rules.top100)
    return {
      state: 'mos',
      reasons: [
        'Top-100 tuition granti yo‘li shartiga mos ko‘rsatkich kiritildi. G‘oliblik tegishli kvota va hujjatlar asosida aniqlanadi.',
      ],
    };
  if (p.funding === 'tuition' && p.ranking <= rules.top300)
    return {
      state: 'mos',
      reasons: [
        'Top-300 tuition granti yo‘li shartiga mos ko‘rsatkich kiritildi. Shu yo‘lda transport va turar joy xarajatlari nazarda tutilgan. Kvota va hujjatlar tekshiriladi.',
      ],
    };
  if (
    p.level === 'bachelor' &&
    p.ranking <= rules.top20 &&
    p.funding === 'partial'
  ) {
    if (p.school === 'unknown' || p.grantPercent === null)
      return {
        state: 'aniqlashtirish',
        reasons: ['Maktab turi va tuition granti ulushi aniqlashtiriladi.'],
      };
    if (p.school === 'yes' && p.grantPercent! >= rules.partial_grant_percent)
      return {
        state: 'mos',
        reasons: [
          'QS top-20, tegishli maktab bitiruvchisi va kamida 50% tuition grant yo‘li shartiga mos ko‘rsatkichlar kiritildi. Kvota hamda hujjatlar tekshiriladi.',
        ],
      };
  }
  return {
    state: 'mos-emas',
    reasons: [
      'Kiritilgan reyting/grant ma’lumotida ushbu uchta imtihonsiz yo‘l sharti aniqlanmadi.',
    ],
  };
}
export function testIstisnosi(p: Profil): Hisobot {
  if (p.certificate === 'none')
    return {
      state: 'mos-emas',
      reasons: ['Testdan ozod qiluvchi sertifikat ko‘rsatilmagan.'],
    };
  if (
    p.certificateValid !== 'yes' ||
    p.certificate === 'unknown' ||
    p.certificate === 'gmat'
  )
    return {
      state: 'aniqlashtirish',
      reasons: [
        'Sertifikatning amal qilishi, formati va joriy talqini tekshiriladi.',
      ],
    };
  let ok: boolean | null = null;
  if (p.certificate === 'sat' && p.sat !== null) ok = p.sat >= rules.sat;
  if (
    p.certificate === 'gre' &&
    [p.verbal, p.quant, p.writing].every((x) => x !== null)
  )
    ok = [p.verbal, p.quant, p.writing].every((x) => x! >= rules.percentile);
  if (p.certificate === 'alevel' && p.alevel !== 'unknown')
    ok = p.alevel === 'yes';
  return {
    state: ok === null ? 'aniqlashtirish' : ok ? 'mos' : 'mos-emas',
    reasons: [
      ok === null
        ? 'Sertifikat bo‘limlari bo‘yicha ma’lumot yetarli emas.'
        : ok
          ? 'Kiritilgan sertifikat ko‘rsatkichi testdan ozodlik shartiga mos. Hujjatning amaldaligi rasmiy ko‘rikda tekshiriladi.'
          : 'Kiritilgan ko‘rsatkich testdan ozodlik chegarasiga yetmaydi.',
    ],
  };
}
export function rejaTuz(
  darslar: {
    id: string;
    title: string;
    duration_min: number;
    level: string[];
    course: string;
    module: string;
  }[],
  level: Daraja,
  minutes: number,
  days: number | null,
  skipTest: boolean,
) {
  const selected = darslar.filter(
    (l) =>
      l.level.includes(level) &&
      l.course !== 'c0' &&
      (l.course === 'c1' ||
        (l.course === 'c3' && l.module === 'yadro') ||
        (l.course === 'c2' && !skipTest)),
  );
  const plan: {
    day: number;
    ids: string[];
    titles: string[];
    minutes: number;
  }[] = [];
  let day = { day: 1, ids: [] as string[], titles: [] as string[], minutes: 0 };
  for (const lesson of selected) {
    if (day.ids.length && day.minutes + lesson.duration_min > minutes) {
      plan.push(day);
      day = { day: day.day + 1, ids: [], titles: [], minutes: 0 };
    }
    day.ids.push(lesson.id);
    day.titles.push(lesson.title);
    day.minutes += lesson.duration_min;
  }
  if (day.ids.length) plan.push(day);
  return {
    days: days === null ? plan : plan.slice(0, days),
    remaining: days === null ? 0 : Math.max(0, plan.length - days),
    oversized: selected.some((l) => l.duration_min > minutes),
  };
}
