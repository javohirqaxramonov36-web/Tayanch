// Savol tekshiruvchisi, tasdiqlash va import dry-run testlari (P05). Ishga tushirish: npm run savol:sinov
// Har test vaqtinchalik papkada (repodan tashqarida) ishlaydi; repo fayllariga yozilmaydi.
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import { REPO, mazmunHash, savolHolati, savolniTekshir, sprSon } from './umumiy.mjs';

const namunalar = JSON.parse(readFileSync(join(REPO, 'docs/namuna-savol.json'), 'utf8'));
const nusxa = (i = 1) => structuredClone(namunalar[i]);
const xatolar = (s) => savolniTekshir(s).xatolar;
const papkalar = [];
const vaqtinchalik = () => { const p = mkdtempSync(join(tmpdir(), 'tayanch-savol-')); papkalar.push(p); return p; };
after(() => papkalar.forEach((p) => rmSync(p, { recursive: true, force: true })));

const ishgaTushir = (skript, args, env = {}) => spawnSync(process.execPath, [join(REPO, 'scripts', skript), ...args], {
  cwd: REPO,
  encoding: 'utf8',
  env: { PATH: process.env.PATH, HOME: process.env.HOME, ...env },
});

describe('namuna savollar', () => {
  it("3 ta namuna xatosiz o'tadi va draft", () => {
    assert.equal(namunalar.length, 3);
    for (const s of namunalar) {
      assert.deepEqual(xatolar(s), [], s.external_id);
      assert.equal(savolHolati(s), 'draft');
      assert.ok(s.tags.includes('namuna'));
    }
  });
});

describe('rad etiladigan savollar', () => {
  it("ikkita to'g'ri javob (mcq)", () => {
    const s = nusxa(); s.answer = ['A', 'B'];
    assert.match(xatolar(s).join('\n'), /bitta harf/);
    s.answer = 'AB';
    assert.match(xatolar(s).join('\n'), /bitta harf/);
  });
  it("variantda to'g'ri belgisi (ikkinchi to'g'ri javob yashirin)", () => {
    const s = nusxa(); s.options[2].correct = true;
    assert.match(xatolar(s).join('\n'), /faqat key va text/);
  });
  it("noto'g'ri LaTeX", () => {
    const s = nusxa(); s.stem = 'If \\(\\frac{3x + 7 = 22\\), what is x?';
    assert.match(xatolar(s).join('\n'), /stem: LaTeX xato/);
    s.stem = 'If \\(3x + 7 = 22, what is x?';
    assert.match(xatolar(s).join('\n'), /LaTeX yopilmagan/);
    s.stem = 'If $\\frac{1}{2}x = 3$, what is x?';
    assert.match(xatolar(s).join('\n'), /ichida emas/);
  });
  it('3 yoki 5 variant, noto\'g\'ri kalit tartibi', () => {
    const s = nusxa(); s.options.pop();
    assert.match(xatolar(s).join('\n'), /aniq 4 ta/);
    const t = nusxa(); [t.options[0].key, t.options[1].key] = ['B', 'A'];
    assert.match(xatolar(t).join('\n'), /tartibida/);
  });
  it('taksonomiyada yo\'q domen yoki ko\'nikma', () => {
    const s = nusxa(); s.skill = 'Quadratics';
    assert.match(xatolar(s).join('\n'), /skill/);
    s.domain = 'Geometry';
    assert.match(xatolar(s).join('\n'), /domain/);
  });
  it('source original emas, tushuntirish yo\'q, noma\'lum maydon', () => {
    const s = nusxa(); s.source = 'collegeboard'; s.explanation = ''; s.extra = 1;
    const x = xatolar(s).join('\n');
    assert.match(x, /source/); assert.match(x, /explanation: majburiy/); assert.match(x, /noma'lum maydon "extra"/);
  });
  it('ruxsat etilmagan HTML', () => {
    const s = nusxa(0); s.passage = 'Text <script>x</script> <u class="a">y</u>';
    const x = xatolar(s).join('\n');
    assert.match(x, /<script>/); assert.match(x, /atribut/);
  });
  it('verified_by author bilan bir xil yoki AI', () => {
    const s = nusxa(); s.verified_by = s.author; s.verified_at = new Date().toISOString(); s.verified_hash = mazmunHash(s);
    assert.match(xatolar(s).join('\n'), /author bilan bir xil/);
    s.verified_by = 'Claude';
    assert.match(xatolar(s).join('\n'), /AI nomi emas/);
    assert.equal(savolHolati(s), 'draft');
  });
  it('tasdiqdan keyin mazmun o\'zgarsa draft', () => {
    const s = nusxa(); s.verified_by = 'Tekshiruvchi'; s.verified_at = new Date().toISOString(); s.verified_hash = mazmunHash(s);
    assert.deepEqual(xatolar(s), []);
    assert.equal(savolHolati(s), 'verified');
    s.answer = 'C';
    assert.match(xatolar(s).join('\n'), /mazmun o'zgargan/);
    assert.equal(savolHolati(s), 'draft');
  });
});

describe('SPR javoblari', () => {
  it('formatlar', () => {
    assert.equal(sprSon('24/2'), 12);
    assert.equal(sprSon('.75'), 0.75);
    assert.equal(sprSon('-3'), -3);
    assert.equal(sprSon('1 1/2'), null);
    assert.equal(sprSon('12%'), null);
  });
  it("teng bo'lmagan, aralash son, belgili javob rad etiladi", () => {
    const s = nusxa(2);
    s.answer = ['12', '12.0', '24/2'];
    assert.deepEqual(xatolar(s), []);
    s.answer = ['12', '13'];
    assert.match(xatolar(s).join('\n'), /teng emas/);
    s.answer = ['1 1/2'];
    assert.match(xatolar(s).join('\n'), /aralash son/);
    s.answer = ['$5'];
    assert.match(xatolar(s).join('\n'), /%, \$ yoki vergul/);
    s.answer = 'A';
    assert.match(xatolar(s).join('\n'), /ro'yxati kerak/);
  });
  it('uzun javob ogohlantirish beradi', () => {
    const s = nusxa(2); s.answer = ['0.66666'];
    assert.match(savolniTekshir(s).ogohlar.join('\n'), /5, manfiy 6/);
  });
});

describe('skriptlar (vaqtinchalik papka)', () => {
  const xato = () => {
    const s = nusxa(); s.external_id = 'sinov-xato-001'; s.answer = ['A', 'B']; s.stem = 'Bad \\(\\frac{1}{2\\) LaTeX';
    return s;
  };

  it('savol:tekshir xatoli faylni rad etadi, dublikatni ushlaydi', () => {
    const p = vaqtinchalik();
    const yaxshi = nusxa(); yaxshi.external_id = 'sinov-math-001'; yaxshi.tags = [];
    const dublikat = { ...structuredClone(yaxshi), external_id: 'sinov-math-002' };
    writeFileSync(join(p, 'a.jsonl'), [yaxshi, dublikat, xato()].map((x) => JSON.stringify(x)).join('\n') + '\n');
    const r = ishgaTushir('savol-tekshir.mjs', [], { TAYANCH_SAVOLLAR_DIR: p });
    assert.equal(r.status, 1);
    assert.match(r.stdout, /savollar: 3, o'tdi: 1, rad etildi: 2/);
    assert.match(r.stdout, /dublikat matn/);
    assert.match(r.stdout, /LaTeX xato/);
    assert.match(r.stdout, /bitta harf/);
  });

  it('repo ichidagi papka qabul qilinmaydi', () => {
    const r = ishgaTushir('savol-tekshir.mjs', [], { TAYANCH_SAVOLLAR_DIR: join(REPO, 'docs') });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /repo ichida/);
  });

  it("korib-chiq → tasdiqla → import dry-run", () => {
    const p = vaqtinchalik();
    const s1 = nusxa(1); s1.external_id = 'sinov-math-010'; s1.tags = []; s1.drafted_by = 'ai'; s1.author = 'Claude (AI)';
    const s2 = nusxa(2); s2.external_id = 'sinov-math-011'; s2.tags = [];
    writeFileSync(join(p, 'b.json'), JSON.stringify([s1, s2, xato()], null, 2));

    let r = ishgaTushir('savol-korib-chiq.mjs', [], { TAYANCH_SAVOLLAR_DIR: p });
    assert.equal(r.status, 0, r.stderr);
    const chiqish = readdirSync(join(p, 'korib-chiqish'));
    const md = readFileSync(join(p, 'korib-chiqish', chiqish.find((f) => f.endsWith('.md'))), 'utf8');
    assert.match(md, /sinov-math-010/);
    assert.match(md, /Tekshiruvdan o'tmagan/);
    const royxatFayl = join(p, 'korib-chiqish', chiqish.find((f) => f.endsWith('-tasdiqlash.txt')));
    const royxat = readFileSync(royxatFayl, 'utf8');
    assert.ok(royxat.includes('sinov-math-010') && royxat.includes('sinov-math-011') && !royxat.includes('sinov-xato-001'));
    // Muallif faqat 010 ni tasdiqlaydi: 011 ni izohga oladi
    writeFileSync(royxatFayl, royxat.replace('sinov-math-011', '# sinov-math-011'));

    // Tasdiqlovchi author bilan bir xil bo'lsa rad
    r = ishgaTushir('savol-tasdiqla.mjs', ['--kim', 'Tayanch (Namuna)', '--id', 'sinov-math-011'], { TAYANCH_SAVOLLAR_DIR: p });
    assert.equal(r.status, 1);
    assert.match(r.stdout, /author bilan bir xil/);
    // AI tasdiqlay olmaydi
    r = ishgaTushir('savol-tasdiqla.mjs', ['--kim', 'Claude', '--id', 'sinov-math-010'], { TAYANCH_SAVOLLAR_DIR: p });
    assert.equal(r.status, 1);
    // Xatoli savol tasdiqlanmaydi
    r = ishgaTushir('savol-tasdiqla.mjs', ['--kim', 'Sinov Muallif', '--id', 'sinov-xato-001'], { TAYANCH_SAVOLLAR_DIR: p });
    assert.equal(r.status, 1);

    r = ishgaTushir('savol-tasdiqla.mjs', ['--kim', 'Sinov Muallif', '--fayl', royxatFayl], { TAYANCH_SAVOLLAR_DIR: p });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    const yozilgan = JSON.parse(readFileSync(join(p, 'b.json'), 'utf8'));
    assert.equal(yozilgan.length, 3);
    assert.equal(yozilgan[0].verified_by, 'Sinov Muallif');
    assert.ok(yozilgan[0].verified_at && yozilgan[0].verified_hash);
    assert.equal(yozilgan[2].verified_by, null);

    r = ishgaTushir('savol-import.mjs', [], { TAYANCH_SAVOLLAR_DIR: p });
    assert.equal(r.status, 1); // xatoli savol rad etildi
    assert.match(r.stdout, /DRY-RUN/);
    assert.match(r.stdout, /\| sinov-math-010 \| verified \|/);
    assert.match(r.stdout, /\| sinov-math-011 \| draft \|/);
    assert.match(r.stdout, /\| Rad etildi \| 1 \|/);
  });

  it('import --apply kalitsiz ishlamaydi', () => {
    const r = ishgaTushir('savol-import.mjs', ['--apply', '--fayl', 'docs/namuna-savol.json']);
    assert.equal(r.status, 1);
    assert.match(r.stderr, /SUPABASE_SERVICE_ROLE_KEY kerak/);
  });

  it('repo:tekshir original savol faylini ushlaydi (namuna fayli bundan mustasno)', () => {
    const r = execFileSync(process.execPath, [join(REPO, 'scripts/repo-tekshir.mjs')], { cwd: REPO, encoding: 'utf8' });
    assert.match(r, /muammo yo'q/);
  });
});
