// P13 haftalik reja: qoidalar docs/reja-algoritmi.md bilan bir xilligi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bosqichlar, rejaTuz, haftaBloklari, oqishKunlariSoni, haftalarSoni, kunQosh, kunFarqi, blokNarxi,
  zaifTaklifStat, zaifTaklifDaftar, bankRef, refTogri, qaytaTaqsimla, otkazilgan, progress,
  brauzerRejani, brauzerYozuvi, eskiRejani, eskidanKirish, serverArgumentlari, serverdanReja,
  kirishniTozala, MAKS_HAFTA, BLOK_DAQIQA, KVOTA_KALIT, DARSLAR, hammaSkilllar, haftaJadvali, joriyHafta, rejaTugaganmi, rejaKvota, rejaKvotaMatni,
  type Reja, type RejaKirish, type VazifaQator,
} from '../sat/reja.ts';
import { urlTanlov } from '../savolBanki.ts';

const BUGUN = '2026-11-12';
const kirish = (o: Partial<RejaKirish> = {}): RejaKirish => ({ bugun: BUGUN, imtihon: null, maqsad: null, soat: 6, zaif: [], ...o });
const haftaBlok = (r: Reja, h: number) => r.topshiriqlar.filter((t) => t.hafta === h).reduce((a, t) => a + blokNarxi(t), 0);

test('bosqichlar: qisqa muddatlar', () => {
  assert.deepEqual(bosqichlar(1, false), ['final']);
  assert.deepEqual(bosqichlar(2, false), ['diagnostic', 'final']);
  assert.deepEqual(bosqichlar(3, false), ['diagnostic', 'topic', 'final']);
  assert.deepEqual(bosqichlar(4, false), ['diagnostic', 'topic', 'timed', 'final']);
  assert.deepEqual(bosqichlar(5, false), ['diagnostic', 'foundations', 'topic', 'timed', 'final']);
  assert.deepEqual(bosqichlar(9, true), ['diagnostic', 'foundations', 'topic', 'timed']);
});

test('bosqichlar: M ≥ 4 da bitta review, qolgani 35/35/30', () => {
  // N=6: M=4 → review 1, qolgan 3: f=1, tm=1, tp=1
  assert.deepEqual(bosqichlar(6, false), ['diagnostic', 'foundations', 'topic', 'timed', 'review', 'final']);
  // N=12: M=10 → review 1, qolgan 9: f=round(3.15)=3, tm=round(2.7)=3, tp=3
  const b12 = bosqichlar(12, false);
  assert.equal(b12.length, 12);
  assert.deepEqual(b12.filter((x) => x === 'foundations').length, 3);
  assert.deepEqual(b12.filter((x) => x === 'topic').length, 3);
  assert.deepEqual(b12.filter((x) => x === 'timed').length, 3);
  assert.deepEqual(b12.filter((x) => x === 'review').length, 1);
  for (let n = 4; n <= 30; n++) {
    const b = bosqichlar(n, false);
    assert.equal(b.length, n, `N=${n}`);
    assert.equal(b[0], 'diagnostic');
    assert.equal(b.at(-1), 'final');
    assert.equal(b.filter((x) => x === 'review').length, n - 2 >= 4 ? 1 : 0, `N=${n} review`);
    // ketma-ketlik tartibi buzilmaydi
    const tartib = ['diagnostic', 'foundations', 'topic', 'timed', 'review', 'final'];
    for (let i = 1; i < b.length; i++) assert.ok(tartib.indexOf(b[i]) >= tartib.indexOf(b[i - 1]), `N=${n} tartib`);
  }
});

test('hajm qoidalari', () => {
  assert.equal(haftaBloklari(2), 3);
  assert.equal(haftaBloklari(6), 8);
  assert.equal(haftaBloklari(20), 27);
  assert.equal(haftaBloklari(50), 27); // 20 soatga qisiladi
  assert.deepEqual([2, 3, 4, 6, 7, 10, 11, 20].map(oqishKunlariSoni), [3, 3, 4, 4, 5, 5, 6, 6]);
  assert.equal(haftalarSoni(BUGUN, null), null);
  assert.equal(haftalarSoni(BUGUN, kunQosh(BUGUN, 1)), 1);
  assert.equal(haftalarSoni(BUGUN, kunQosh(BUGUN, 28)), 4);
  assert.equal(haftalarSoni(BUGUN, kunQosh(BUGUN, 29)), 5);
});

function umumiyQoidalar(r: Reja) {
  const k = r.kirish;
  const bloklar = haftaBloklari(k.soat);
  for (const h of r.haftalar) {
    // kamida 1 dam kuni
    assert.ok(h.oqishKunlari.length <= 6, `hafta ${h.raqam}: dam kuni yo'q`);
    const tlar = r.topshiriqlar.filter((t) => t.hafta === h.raqam);
    for (const t of tlar) {
      assert.ok(h.oqishKunlari.includes(t.kun), `${t.id}: o'qish kunida emas (${t.kun})`);
      assert.ok(refTogri(t.ref), `${t.id}: ref ${t.ref}`);
      if (k.imtihon) assert.ok(kunFarqi(t.kun, k.imtihon) >= 2, `${t.id}: imtihon kuni yoki oldingi kun`);
    }
    // byudjet: diagnostika testi va tahlili bundan mustasno
    const byudjet = h.bosqich === 'final' ? Math.max(2, Math.ceil(bloklar / 2)) : bloklar;
    const majburiy = h.bosqich === 'diagnostic' ? 5 : 0;
    assert.ok(haftaBlok(r, h.raqam) <= Math.max(byudjet, majburiy), `hafta ${h.raqam}: ${haftaBlok(r, h.raqam)} > ${byudjet}`);
    // 2-haftadan har haftada takrorlash (o'qish kuni bo'lsa)
    if (h.raqam >= 2 && h.oqishKunlari.length) assert.ok(tlar.some((t) => t.tur === 'takrorlash'), `hafta ${h.raqam}: takrorlash yo'q`);
  }
  // diagnostika: to'liq test (180 daq) + tracker tahlili
  const d = r.haftalar.find((h) => h.bosqich === 'diagnostic');
  if (d) {
    const tlar = r.topshiriqlar.filter((t) => t.hafta === d.raqam);
    assert.ok(tlar.some((t) => t.tur === 'rasmiy-test' && t.daqiqa === 180));
    assert.ok(tlar.some((t) => t.tur === 'tahlil'));
  }
  // hafta raqamlari ketma-ket, sanalar 7 kundan
  r.haftalar.forEach((h, i) => { assert.equal(h.raqam, i + 1); assert.equal(h.boshi, kunQosh(k.bugun, i * 7)); });
}

test('stsenariy: imtihonga 4 hafta', () => {
  const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 28), soat: 6, zaif: ['Transitions', 'Circles'] }));
  assert.equal(r.haftalar.length, 4);
  assert.deepEqual(r.haftalar.map((h) => h.bosqich), ['diagnostic', 'topic', 'timed', 'final']);
  assert.equal(r.haftalar[3].oxiri, kunQosh(BUGUN, 27));
  umumiyQoidalar(r);
  // zaif skill'lar topic haftasida bank filtrida
  const topic = r.topshiriqlar.filter((t) => t.hafta === 2 && t.tur === 'bank');
  assert.ok(topic.some((t) => t.ref.includes('skills=Transitions')));
  assert.ok(topic.some((t) => t.ref.includes('skills=Circles')));
});

test('stsenariy: imtihonga 12 hafta', () => {
  const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 80), soat: 10 }));
  assert.equal(r.haftalar.length, 12);
  umumiyQoidalar(r);
  assert.ok(r.topshiriqlar.some((t) => t.tur === 'dars'));
  assert.equal(r.haftalar.at(-1)!.bosqich, 'final');
});

test('stsenariy: sana yo\'q → 4 haftalik sikl', () => {
  const r = rejaTuz(kirish({ soat: 4 }));
  assert.equal(r.jamiHafta, 4);
  assert.deepEqual(r.haftalar.map((h) => h.bosqich), ['diagnostic', 'foundations', 'topic', 'timed']);
  umumiyQoidalar(r);
});

test('har soat va muddat uchun umumiy qoidalar', () => {
  for (const soat of [2, 3, 5, 8, 12, 20]) for (const kun of [1, 2, 5, 8, 9, 15, 22, 40, 77, 111, 200]) {
    const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, kun), soat }));
    assert.ok(r.haftalar.length <= MAKS_HAFTA);
    umumiyQoidalar(r);
  }
});

test('imtihon ertaga: topshiriq yo\'q; indinga: faqat bugun', () => {
  const r1 = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 1) }));
  assert.equal(r1.haftalar.length, 1);
  assert.equal(r1.topshiriqlar.length, 0);
  const r2 = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 2) }));
  assert.deepEqual(r2.haftalar[0].oqishKunlari, [BUGUN]);
  assert.ok(r2.topshiriqlar.length > 0 && r2.topshiriqlar.every((t) => t.kun === BUGUN));
});

test('16 haftadan uzoq: reja birinchi 16 haftani beradi, jamiHafta haqiqiy son', () => {
  const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 200) }));
  assert.equal(r.haftalar.length, 16);
  assert.equal(r.jamiHafta, 29);
  assert.ok(!r.haftalar.some((h) => h.bosqich === 'final'));
});

test('maqsad ball rejani o\'zgartirmaydi', () => {
  const a = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 50), maqsad: 1200 }));
  const b = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 50), maqsad: 1550 }));
  assert.deepEqual(a.topshiriqlar, b.topshiriqlar);
});

test('kirishniTozala: noto\'g\'ri qiymatlar', () => {
  const k = kirishniTozala({ bugun: BUGUN, imtihon: BUGUN, maqsad: 2000, soat: 0, zaif: ['Transitions', 'X', 'Transitions', ...hammaSkilllar()] });
  assert.equal(k.imtihon, null);
  assert.equal(k.maqsad, null);
  assert.equal(k.soat, 2);
  assert.equal(k.zaif.length, 6);
  assert.equal(k.zaif[0], 'Transitions');
});

test('zaif taklif: hisobdagi statistika', () => {
  const stat = [
    { section: 'rw', skill: 'Transitions', answered: 10, correct: 3 },
    { section: 'rw', skill: 'Boundaries', answered: 4, correct: 0 }, // kam javob
    { section: 'math', skill: 'Circles', answered: 5, correct: 2 },
    { section: 'math', skill: 'Percentages', answered: 10, correct: 6 }, // 60%: zaif emas
    { section: 'math', skill: 'Area and volume', answered: 8, correct: 4 },
    { section: 'math', skill: 'Linear functions', answered: 20, correct: 5 },
    { section: 'math', skill: 'Noma\'lum', answered: 20, correct: 0 },
  ];
  assert.deepEqual(zaifTaklifStat(stat), ['Linear functions', 'Transitions', 'Circles']);
  assert.deepEqual(zaifTaklifStat([]), []);
});

test('zaif taklif: darslar xato daftari (modulda ≥ 2)', () => {
  const x = [{ modul: 'rw-otish' }, { modul: 'rw-otish' }, { modul: 'hajm' }, { modul: 'rw-xato' }, { modul: 'rw-xato' }, { modul: 'rw-xato' }];
  assert.deepEqual(zaifTaklifDaftar(x), ['Boundaries', 'Form, Structure, and Sense', 'Transitions']);
  assert.deepEqual(zaifTaklifDaftar([{ modul: 'hajm' }]), []);
});

test('DARSLAR skill nomlari taksonomiyada bor', () => {
  const bor = new Set(hammaSkilllar());
  for (const d of DARSLAR) for (const s of d.skilllar) assert.ok(bor.has(s), s);
});

test('bankRef va bank sahifasi urlTanlov bir-biriga mos', () => {
  const ref = bankRef({ section: 'rw', skills: ['Form, Structure, and Sense', 'Transitions'], qiyinlik: ['easy', 'medium'], rejim: 'timed', hajm: 10, qayta: true });
  assert.ok(refTogri(ref), ref);
  const t = urlTanlov(ref.slice(ref.indexOf('?')));
  assert.deepEqual(t, { section: 'rw', skills: ['Form, Structure, and Sense', 'Transitions'], qiyinlik: ['easy', 'medium'], rejim: 'timed', hajm: 10, qaytaYechish: true });
  assert.equal(urlTanlov(''), null);
  assert.equal(urlTanlov('?mock=bosh'), null);
  // boshqa bo'lim skill'i, noma'lum qiymatlar tashlanadi; uchala qiyinlik = hammasi
  assert.deepEqual(urlTanlov('?section=math&skills=Transitions|Circles&difficulty=easy,medium,hard,x&mode=fast&size=7'),
    { section: 'math', skills: ['Circles'], qiyinlik: [], rejim: undefined, hajm: undefined, qaytaYechish: false });
});

test('refTogri: faqat ichki /uz/ yo\'l', () => {
  for (const r of ['/uz/sat/mashq/bank/', '/uz/sat/vosita/rasmiy-testlar/', '/uz/sat/mashq/bank/?section=rw&size=10']) assert.ok(refTogri(r), r);
  for (const r of ['https://x.com/', '//x.com/uz/', '/en/sat/', '/uz/sat', 'javascript:alert(1)', '/uz/../x/', '/uz/sat/?a=<b>', '/uz//x/', '']) assert.ok(!refTogri(r), r);
});

test('progress va otkazilgan', () => {
  const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 28) }));
  const birinchi = r.topshiriqlar[0];
  birinchi.bajarildi = '2026-11-12T10:00:00Z';
  assert.equal(progress(r).bajarildi, 1);
  assert.equal(progress(r, 1).jami, r.topshiriqlar.filter((t) => t.hafta === 1).length);
  const keyin = kunQosh(BUGUN, 10);
  assert.ok(otkazilgan(r, keyin).every((t) => !t.bajarildi && t.kun < keyin));
});

test('qaytaTaqsimla: o\'tganlar keyingi kunlarga, sig\'im ceil(blok/kun)+1, kvota yo\'q', () => {
  const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 56), soat: 6 }));
  const bugun = kunQosh(BUGUN, 9);
  const oldin = otkazilgan(r, bugun).length;
  assert.ok(oldin > 0);
  const n = qaytaTaqsimla(r, bugun);
  assert.equal(n.kochdi.length + n.sigmadi.length, oldin);
  assert.equal(otkazilgan({ topshiriqlar: n.topshiriqlar }, bugun).length, n.sigmadi.length);
  // asl reja o'zgarmagan
  assert.equal(otkazilgan(r, bugun).length, oldin);
  // kunlik yuk sig'imdan oshmaydi (bo'sh kunga katta topshiriq qo'yilishi mumkin)
  const sigim = Math.ceil(haftaBloklari(6) / oqishKunlariSoni(6)) + 1;
  const yuk = new Map<string, { b: number; n: number }>();
  for (const t of n.topshiriqlar) if (!t.bajarildi && t.kun >= bugun) {
    const y = yuk.get(t.kun) ?? { b: 0, n: 0 };
    yuk.set(t.kun, { b: y.b + blokNarxi(t), n: y.n + 1 });
  }
  for (const t of n.topshiriqlar.filter((x) => n.kochdi.includes(x.id))) {
    const y = yuk.get(t.kun)!;
    assert.ok(y.b <= Math.max(sigim, 4), `${t.kun}: ${y.b} > ${sigim}`);
    assert.ok(r.haftalar.find((h) => h.raqam === t.hafta)!.oqishKunlari.includes(t.kun));
  }
});

test('qaytaTaqsimla: joy qolmasa sigmadi', () => {
  const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 14), soat: 20 }));
  const bugun = kunQosh(BUGUN, 11); // final haftaning oxirgi o'qish kunlari
  const n = qaytaTaqsimla(r, bugun);
  assert.ok(n.sigmadi.length > 0);
  for (const id of n.sigmadi) assert.ok(n.topshiriqlar.find((t) => t.id === id)!.kun < bugun);
});

test('brauzer yozuvi: aylanma va buzilgan ma\'lumot', () => {
  const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 30), zaif: ['Circles'] }));
  r.topshiriqlar[1].bajarildi = '2026-11-13T08:00:00.000Z';
  const yozuv = JSON.parse(JSON.stringify(brauzerYozuvi(r, new Date('2026-11-12T00:00:00Z'))));
  assert.equal(yozuv.versiya, 1);
  assert.equal(yozuv.yaratilgan, '2026-11-12T00:00:00.000Z');
  assert.deepEqual(brauzerRejani(yozuv), r);
  assert.equal(brauzerRejani(null), null);
  assert.equal(brauzerRejani({ versiya: 2, reja: r }), null);
  assert.equal(brauzerRejani('x'), null);
  const buzuq = JSON.parse(JSON.stringify(yozuv));
  buzuq.reja.topshiriqlar[0].ref = 'https://boshqa.example/';
  assert.equal(brauzerRejani(buzuq)!.topshiriqlar.length, r.topshiriqlar.length - 1);
});

test('eski tayanch:sat-reja yozuvi', () => {
  const e = eskiRejani({ sana: '2026-12-05', hozirgi: 1100, maqsad: 1350, kunlar: 5, fokus: 'math', belgilar: { '0-0': true } });
  assert.ok(e);
  assert.deepEqual(eskidanKirish(e!, BUGUN), { imtihon: '2026-12-05', maqsad: 1350, soat: 5 });
  assert.deepEqual(eskidanKirish({ ...e!, sana: '2026-10-01' }, BUGUN).imtihon, null);
  assert.equal(eskiRejani({ sana: 1 }), null);
  assert.deepEqual(eskiRejani({ sana: '2026-12-05', maqsad: 1300 })!.belgilar, {});
});

test('server: argumentlar → qatorlar → Reja', () => {
  const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 40), maqsad: 1400, soat: 8, zaif: ['Circles', 'Transitions'] }));
  const a = serverArgumentlari(r);
  assert.equal(a.p_plan.hours_per_week, 8);
  assert.deepEqual(a.p_plan.weak_skills, ['Circles', 'Transitions']);
  assert.equal(a.p_plan.start_date, BUGUN);
  assert.equal(a.p_tasks.length, r.topshiriqlar.length);
  assert.ok(a.p_tasks.every((t) => refTogri(t.ref) && t.week >= 1 && t.minutes > 0));
  const vazifalar: VazifaQator[] = a.p_tasks.map((t, i) => ({
    id: `u${i}`, due_on: t.due_on, title: t.title, kind: t.kind, ref: t.ref, position: i, done_at: t.done_at, week: t.week, phase: t.phase, minutes: t.minutes,
  }));
  const s = serverdanReja({ id: 'p', exam_date: a.p_plan.exam_date, target_score: 1400, hours_per_week: 8, weak_skills: a.p_plan.weak_skills, rules_version: 1, start_date: BUGUN, created_at: '2026-11-12T05:00:00Z' }, vazifalar);
  assert.deepEqual(s.haftalar, r.haftalar);
  assert.deepEqual(s.topshiriqlar.map((t) => [t.kun, t.nom, t.ref, t.daqiqa]), r.topshiriqlar.map((t) => [t.kun, t.nom, t.ref, t.daqiqa]));
});

test('konstantalar', () => {
  assert.equal(BLOK_DAQIQA, 45);
  assert.equal(KVOTA_KALIT, 'plan_rebuilds');
});

test('haftaJadvali: dam kunlari, imtihon oldi va imtihon kuni', () => {
  const imtihon = kunQosh(BUGUN, 10);
  const r = rejaTuz(kirish({ imtihon, soat: 4 }));
  const h2 = haftaJadvali(r, r.haftalar[1]);
  assert.equal(h2.at(-1)!.kun, imtihon);
  assert.equal(h2.at(-1)!.tur, 'imtihon');
  assert.equal(h2.at(-2)!.tur, 'imtihon-oldi');
  assert.ok(h2.every((k) => k.tur === 'oqish' || k.topshiriqlar.length === 0));
  const h1 = haftaJadvali(r, r.haftalar[0]);
  assert.equal(h1.length, 7);
  assert.equal(h1.filter((k) => k.tur === 'dam').length, 7 - oqishKunlariSoni(4));
  assert.equal(h1.flatMap((k) => k.topshiriqlar).length, r.topshiriqlar.filter((t) => t.hafta === 1).length);
});

test('joriyHafta va rejaTugaganmi', () => {
  const r = rejaTuz(kirish());
  assert.equal(joriyHafta(r, BUGUN), 1);
  assert.equal(joriyHafta(r, kunQosh(BUGUN, 8)), 2);
  assert.equal(joriyHafta(r, kunQosh(BUGUN, -3)), 1);
  assert.equal(joriyHafta(r, kunQosh(BUGUN, 40)), null);
  assert.equal(rejaTugaganmi(r, kunQosh(BUGUN, 27)), false);
  assert.equal(rejaTugaganmi(r, kunQosh(BUGUN, 28)), true);
});

test('rejaKvota: faqat limit bo\'lsa', () => {
  assert.equal(rejaKvota(null), null);
  assert.equal(rejaKvota({ limits: {} }), null);
  assert.equal(rejaKvota({ limits: { questions: { max: 20, used: 1 } } }), null);
  const k = rejaKvota({ limits: { plan_rebuilds: { max: 3, per: 'month', used: 1, remaining: 2 } } })!;
  assert.deepEqual(k, { max: 3, qolgan: 2, per: 'month', resetsAt: undefined });
  assert.equal(rejaKvotaMatni(k), '2 of 3 plan changes left this month');
  assert.equal(rejaKvotaMatni({ max: 1, qolgan: 0, per: 'month' }), '0 of 1 plan change left this month');
});

test('darslar: har dars rejada bir marta, zaif skill darsi birinchi', () => {
  const r = rejaTuz(kirish({ imtihon: kunQosh(BUGUN, 110), soat: 20, zaif: ['Circles', 'Transitions'] }));
  const darslar = r.topshiriqlar.filter((t) => t.tur === 'dars').map((t) => t.ref);
  assert.equal(new Set(darslar).size, darslar.length);
  assert.equal(darslar.length, DARSLAR.length);
  assert.equal(darslar[0], '/uz/sat/qollanma/reading-writing/otish-sozlari/');
});
