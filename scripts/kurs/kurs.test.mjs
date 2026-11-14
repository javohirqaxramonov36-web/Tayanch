import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { katalogniOqi } from './katalog.mjs';
import { nashrniOqi } from './buildNashr.mjs';
import { importSql } from './importSql.mjs';
import { nashrMalumoti } from './nashr.mjs';
import { kursniTekshir } from './tekshir.mjs';
import { kursPapkasi } from './xususiy.mjs';
import { REPO, savolFayllari } from '../savol/umumiy.mjs';

const katalog = katalogniOqi();
const papka = mkdtempSync(join(realpathSync(tmpdir()), 'tayanch-kurs-'));
const muallif = 'Sinov tekshiruvchisi';
const belgi = 'KURS_PRIVATE_SYNTHETIC_27FC9D3';
const javobBelgisi = '6135784291679853';
const faylPapkasi = (m) => join(papka, 'content', 'sat-math', m.domainSlug, m.topicSlug);
const savolYoli = (m) => join(faylPapkasi(m), 'questions.json');
const darsYoli = (m) => join(faylPapkasi(m), 'lesson.md');
const mA1 = katalog.find((m) => m.id === 'A1');
const tekshir = () => kursniTekshir({ papka, muallif });
const yoz = (fayl, savollar) => writeFileSync(fayl, JSON.stringify(savollar));
const cli = (...args) => spawnSync(process.execPath, [join(REPO, 'scripts/kurs.mjs'), ...args], {
  encoding: 'utf8', timeout: 30_000, env: { ...process.env, TAYANCH_SAVOLLAR_DIR: papka, TAYANCH_MUALLIF: muallif },
});

const lesson = ['Foundation', 'Core', 'Advanced'].map((stage) => [
  `## ${stage}`,
  '### Theory',
  `Synthetic lesson ${belgi}.`,
  ...(stage === 'Foundation' ? ['### Nazariya (UZ)', 'Sinov uchun nazariya.'] : []),
  '### Examples',
  '#### Sample one',
  'First worked example.',
  '#### Sample two',
  'Second worked example.',
].join('\n\n')).join('\n\n');

before(() => {
  for (const m of katalog) {
    mkdirSync(faylPapkasi(m), { recursive: true });
    writeFileSync(darsYoli(m), lesson);
    const savollar = [];
    for (const [stage, count] of Object.entries(m.counts)) {
      for (let i = 0; i < count; i++) {
        const index = savollar.length + 1;
        const spr = index <= m.spr;
        savollar.push({
          id: `sinov-${m.topicSlug}-${index}`, course: 'math', topic_id: m.id, stage,
          domain: 'Algebra', skill: m.skill ?? mA1.skill, difficulty: 2, time_sec: 90,
          type: spr ? 'spr' : 'mcq', prompt: `Synthetic fixture ${belgi} ${m.id} ${index}.`,
          check: { kind: 'linear', equations: ['3*x=2'], variables: ['x'], target: 'x' },
          ...(spr
            ? { answer: '2/3', accepted: ['2/3', '.6666', '.6667', '0.666', '0.667'] }
            : { answer: 'A', choices: ['2/3', '3/2', '2', '3'] }),
          explanation_en: `Synthetic explanation ${belgi}.`,
          ...(stage === 'Foundation' ? { explanation_uz: 'Sinov uchun izoh.' } : {}),
          reviewed: false, source: 'original', author: 'Sinov qoralovchisi', drafted_by: 'human', version: 1,
        });
      }
    }
    if (m.id === 'A1') {
      Object.assign(savollar[m.spr], {
        check: { kind: 'expression', expression: javobBelgisi },
        choices: [javobBelgisi, '1', '2', '3'],
      });
    }
    yoz(savolYoli(m), savollar);
  }
});

after(() => rmSync(papka, { recursive: true, force: true }));

test('CSV 6 mavzu, 200 savol, 5 mini-test va prerequisite siklini tekshiradi', () => {
  assert.deepEqual(katalog.map((m) => [m.id, m.counts.mini_test]),
    [['MX3', 0], ['A1', 10], ['A2', 10], ['A3', 10], ['A4', 10], ['A5', 10]]);
  assert.equal(katalog.reduce((sum, m) => sum + m.total, 0), 200);
  assert.deepEqual(katalog.at(-1).prerequisites, ['A1', 'A3']);
  const csv = readFileSync(new URL('../../docs/course-spec/math-topics.csv', import.meta.url), 'utf8');
  assert.throws(() => katalogniOqi(csv.replace('8,A1; A3,', '8,A5,')), /sikl/);
  assert.throws(() => katalogniOqi(csv.replace('8,A1; A3,', '8,A9,')), /topilmadi/);
  assert.throws(() => katalogniOqi(csv.replace('8,10,8,10,36', '8,10,8,9,35')), /mini-test/);
});

test('xususiy yo‘l, sxema, takrorlar, Markdown, bosqich va SymPy xatolari', () => {
  const draft = tekshir();
  assert.deepEqual(draft.xatolar, []);
  assert.equal(draft.natijalar.length, 200);
  assert.deepEqual(draft.reja, []);
  assert.deepEqual(savolFayllari(papka), []);
  assert.throws(() => kursPapkasi(REPO), /repo tashqarisida/);

  const fayl = savolYoli(mA1);
  const asl = readFileSync(fayl, 'utf8');
  const savollar = JSON.parse(asl);
  const dars = darsYoli(mA1);
  try {
    savollar[0].unknown = true;
    savollar[1].accepted = ['.67'];
    savollar[2].answer = '3/2';
    savollar[3].check.target = 'open(x)';
    savollar[4].prompt = `  ${savollar[5].prompt.toUpperCase()}  `;
    savollar[6].id = savollar[7].id;
    savollar[8].explanation_uz = '';
    savollar[9].source = 'copied';
    savollar[10].figure = { type: 'png', alt: 'No', src: 'image.png' };
    savollar[11].answer = 'D';
    savollar[12].choices[2] = '4/6';
    savollar[13].choices[1] = savollar[13].choices[0];
    savollar[14].stage = 'mini_test';
    savollar[15].reviewed = true;
    savollar[16].explanation_en += ' [unsafe][link]\n\n[link]: javascript:alert(1)';
    savollar[17].topic_id = 'MX3';
    yoz(fayl, savollar);
    writeFileSync(dars, lesson + '\n\n<script>alert(1)</script>');
    const { xatolar, reja } = tekshir();
    for (const mezon of [
      'noma’lum maydon', 'accepted qiymatlari', 'aniq javob', 'ruxsatsiz amal', 'Takror matn', 'Takror ID',
      'explanation_uz', 'metama’lumotlari', 'figure:', 'yagona isbotlangan', 'P05:', 'mini_test bosqichida',
      'verified_by', 'faqat HTTPS', 'stage mavzu', 'xom HTML',
    ]) assert.ok(xatolar.some((x) => x.includes(mezon)), mezon);
    assert.deepEqual(reja, []);
    const natija = cli('dry-run');
    assert.equal(natija.status, 1);
    assert.doesNotMatch(natija.stderr + natija.stdout, new RegExp(belgi));
    writeFileSync(fayl, asl);
    rmSync(dars);
    symlinkSync(darsYoli(katalog[0]), dars);
    assert.ok(tekshir().xatolar.some((x) => x.includes('symlink')));
  } finally {
    writeFileSync(fayl, asl);
    rmSync(dars);
    writeFileSync(dars, lesson);
  }
});

test('chiziqli sistemalar va tengsizliklar, barcha variantlar SymPy orqali', () => {
  const fayl = savolYoli(mA1);
  const asl = readFileSync(fayl, 'utf8');
  const savollar = JSON.parse(asl);
  const algebra = [
    [{ kind: 'linear', equations: ['x+y=5', 'x-y=1'], variables: ['x', 'y'], target: '(x,y)' },
      ['(3,2)', '(2,3)', '(4,1)', '(1,4)']],
    [{ kind: 'linear', equations: ['x+1=x+2'], variables: ['x'], target: 'x' },
      ['no solution', 'all real numbers', '1', '2']],
    [{ kind: 'linear', equations: ['x+1=x+1'], variables: ['x'], target: 'x' },
      ['all real numbers', 'no solution', '1', '2']],
    [{ kind: 'inequality', relations: ['-2*x<-4', 'x<=4'], variables: ['x'] },
      ['2<x<=4', '2<=x<4', '2<x<4', '2<=x<=4']],
    [{ kind: 'relation', expression: 'y<2*x+1', variables: ['x', 'y'] },
      ['2*y<4*x+2', 'y<=2*x+1', 'y>2*x+1', 'y>=2*x+1']],
    [{ kind: 'linear', equations: ['x+y=5', '2*x+2*y=10'], variables: ['x', 'y'], target: '(x,y)' },
      ['infinitely many solutions', 'all real numbers', 'no solution', '(3,2)']],
  ];
  try {
    algebra.forEach(([check, choices], i) => Object.assign(savollar[mA1.spr + i], { check, choices }));
    Object.assign(savollar[0], {
      check: { kind: 'alternatives', expressions: ['-2/3', '3/2'] },
      answer: ['-2/3', '3/2'], accepted: ['-.6667', '-0.666', '1.5'],
    });
    Object.assign(savollar[1], {
      check: { kind: 'expression', expression: '9.9996' }, answer: '9.9996', accepted: ['9.999', '10.00'],
    });
    yoz(fayl, savollar);
    assert.deepEqual(tekshir().xatolar, []);
  } finally {
    writeFileSync(fayl, asl);
  }
});

test('MCQ chiziqli yechimlar sonini va so‘zli variantlarni alohida tekshiradi', () => {
  const fayl = savolYoli(mA1);
  const asl = readFileSync(fayl, 'utf8');
  const savollar = JSON.parse(asl);
  const choices = ['No solution', 'Exactly one solution', 'Exactly two solutions', 'Infinitely many solutions'];
  const misollar = [['x+1=x+2', 'A'], ['2*x=8', 'B'], ['2*(x+1)=2*x+2', 'D']];
  const tekshirA1 = () => kursniTekshir({ papka, muallif, mavzuId: 'A1' });
  try {
    for (const [i, [tenglama, answer]] of misollar.entries()) {
      Object.assign(savollar[mA1.spr + i], {
        check: { kind: 'linear_count', equations: [tenglama], variables: ['x'] }, choices, answer,
      });
    }
    yoz(fayl, savollar);
    assert.deepEqual(tekshirA1().xatolar, []);

    savollar[mA1.spr].answer = 'B';
    savollar[mA1.spr + 2].choices = ['0', ...choices.slice(1)];
    yoz(fayl, savollar);
    const { xatolar } = tekshirA1();
    assert.ok(xatolar.some((xato) => xato.includes('yechimlar soni kalitga mos emas')));
    assert.ok(xatolar.some((xato) => xato.includes('to‘rtta farqli variant')));
  } finally {
    writeFileSync(fayl, asl);
  }
});

function daraxt(ildiz) {
  return readdirSync(ildiz, { withFileTypes: true }).flatMap((entry) => {
    const yol = join(ildiz, entry.name);
    return entry.isDirectory() ? daraxt(yol) : [yol];
  }).sort();
}

function faylHashlari(ildiz) {
  return daraxt(ildiz).map((fayl) => [fayl, createHash('sha256').update(readFileSync(fayl)).digest('hex')]);
}

test('tasdiqsiz va eskirgan hash rad etiladi, tasdiqlangan dry-run yozmaydi', () => {
  const { natijalar } = tekshir();
  const draft = cli('dry-run');
  assert.equal(draft.status, 1);
  assert.match(draft.stdout, /Importga tayyor: 0/);
  for (const m of katalog) {
    const fayl = savolYoli(m);
    const savollar = JSON.parse(readFileSync(fayl, 'utf8'));
    const hashlar = natijalar.filter((n) => n.fayl === fayl);
    savollar.forEach((s, i) => Object.assign(s, {
      reviewed: true, verified_by: muallif, verified_at: '2020-01-01T00:00:00Z', verified_hash: hashlar[i].hash,
    }));
    yoz(fayl, savollar);
  }

  const tasdiq = tekshir();
  assert.deepEqual(tasdiq.xatolar, []);
  assert.equal(tasdiq.reja.length, 200);
  assert.ok(tasdiq.reja.every(({ qator }) => qator.status === 'verified' && qator.difficulty === 3));
  assert.equal(tasdiq.reja.filter(({ qator }) => qator.tags[0].endsWith(':mini_test')).length, 50);
  assert.deepEqual(tasdiq.reja[0].qator.correct.accepted, ['2/3', '.6666', '.6667', '0.666', '0.667']);
  assert.deepEqual(tasdiq.reja[0].qator.correct.exact, ['2/3']);
  assert.deepEqual(tasdiq.reja.find(({ qator }) => qator.format === 'mcq').qator.correct, { choice: 'A' });

  const mavzu = kursniTekshir({ papka, mavzuId: mA1.id, muallif });
  assert.equal(mavzu.reja.length, mA1.total);
  const sql = importSql(mA1, mavzu.reja);
  assert.equal(importSql(mA1, kursniTekshir({ papka, mavzuId: mA1.id, muallif }).reja), sql);
  assert.match(sql, /on conflict \(external_id\) do update/);
  assert.match(sql, /to_jsonb\(eski\)[\s\S]*is distinct from to_jsonb\(excluded\)/);

  const oldin = faylHashlari(papka);
  const dry = cli('dry-run');
  assert.equal(dry.status, 0, dry.stderr);
  assert.match(dry.stdout, /Importga tayyor: 200/);
  assert.equal(cli('dry-run', '--apply').status, 1);
  assert.deepEqual(faylHashlari(papka), oldin);
  assert.doesNotMatch(dry.stdout + dry.stderr, new RegExp(belgi));
  assert.doesNotMatch(dry.stdout + dry.stderr, new RegExp(javobBelgisi));
  assert.ok(kursniTekshir({ papka, muallif: 'Boshqa tekshiruvchi' }).xatolar.some((x) => x.includes('verified_by')));

  const receiptYoli = join(faylPapkasi(mA1), 'import-receipt.json');
  writeFileSync(receiptYoli, JSON.stringify({ topic: mA1.id, ...nashrMalumoti(mavzu.reja) }));
  assert.deepEqual(Object.keys(nashrniOqi(papka, muallif)), ['A1']);
  assert.match(nashrniOqi(papka, muallif).A1.darslar[0], /lang="uz"/);
  const lesson = readFileSync(darsYoli(mA1));
  rmSync(darsYoli(mA1));
  assert.deepEqual(nashrniOqi(papka, muallif), {});
  writeFileSync(darsYoli(mA1), lesson);

  const original = JSON.parse(readFileSync(savolYoli(mA1), 'utf8'));
  yoz(savolYoli(mA1), original.slice(1));
  assert.deepEqual(nashrniOqi(papka, muallif), {});
  const { verified_by, verified_at, verified_hash, ...qoralama } = original[0];
  yoz(savolYoli(mA1), [{ ...qoralama, reviewed: false }, ...original.slice(1)]);
  assert.deepEqual(nashrniOqi(papka, muallif), {});
  yoz(savolYoli(mA1), original);
  assert.ok(nashrniOqi(papka, muallif).A1);

  const fayl = savolYoli(mA1);
  const savollar = JSON.parse(readFileSync(fayl, 'utf8'));
  savollar[0].explanation_uz += ' Tahrir.';
  yoz(fayl, savollar);
  const eskirgan = tekshir();
  assert.ok(eskirgan.xatolar.some((x) => x.includes('verified_hash')));
  assert.deepEqual(eskirgan.reja, []);
  assert.deepEqual(nashrniOqi(papka, muallif), {});
});

test('To‘liq tasdiqsiz mavzu staging dan ko‘chmaydi', () => {
  const ildiz = join(papka, 'staging', 'sat-math', mA1.domainSlug, mA1.topicSlug);
  mkdirSync(ildiz, { recursive: true });
  writeFileSync(join(ildiz, 'lesson.md'), lesson);
  const savollar = JSON.parse(readFileSync(savolYoli(mA1), 'utf8')).map(({ verified_by, verified_at, verified_hash, ...s }) =>
    ({ ...s, reviewed: false }));
  yoz(join(ildiz, 'questions.json'), savollar);
  const oldin = faylHashlari(papka);
  const kochir = cli('kochir', '--mavzu', 'A1');
  assert.equal(kochir.status, 1);
  assert.match(kochir.stderr, /to‘liq tasdig‘i/);
  assert.deepEqual(faylHashlari(papka), oldin);
});

test('Astro buildga xususiy dars, qoralama va javoblar chiqmaydi', () => {
  const dist = join(papka, 'dist');
  const build = spawnSync(process.execPath, [
    join(REPO, 'node_modules/.bin/astro'), 'build', '--outDir', dist,
  ], { cwd: REPO, encoding: 'utf8', timeout: 60_000,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', TAYANCH_KURS_NASHR: '0', TAYANCH_SAVOLLAR_DIR: papka },
  });
  assert.equal(build.status, 0, build.stderr || build.stdout);
  const fayllar = daraxt(dist);
  assert.ok(fayllar.some((yol) => yol.endsWith('/index.html')));
  assert.ok(fayllar.every((yol) => !yol.endsWith('questions.json') && !yol.endsWith('lesson.md')));
  for (const yol of fayllar) {
    const matn = readFileSync(yol);
    assert.ok(!matn.includes(belgi) && !matn.includes(javobBelgisi));
  }
});
