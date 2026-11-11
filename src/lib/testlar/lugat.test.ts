// SAT lug'ati (P15) sof mantig'i: node --test 'src/lib/testlar/*.test.ts'
// Sinov to'plami: 20 ta soxta "sinov-NN" so'z.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  KALIT_LUGAT, KALIT_TAKROR, baholash, boshFiltr, filtrla, holatMatn, importRoyxati, kalitQil, lokalOqi, lokalYoz,
  navbat, quizMumkinmi, quizTuz, BOSH_HOLAT, type Soz, type SozHolat,
} from '../sat/lugat.ts';

const KUN = '2026-11-11';
const soz = (n: number, ozgarish: Partial<Soz> = {}): Soz => {
  const word = `sinov-${String(n).padStart(2, '0')}`;
  return {
    kalit: word, id: `id-${n}`, word, pos: n % 2 ? 'noun' : 'verb', definition: `SINOV definition ${n}`, example: null,
    difficulty: (['easy', 'medium', 'hard'] as const)[n % 3], topic: n <= 10 ? 'SINOV-a' : 'SINOV-b', uzbek: null, oz: false,
    ...ozgarish,
  };
};
const SOZLAR = Array.from({ length: 20 }, (_, i) => soz(i + 1));

class XotiraOmbor {
  m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, v); }
}

test('Leitner: lug\'at va Xato daftari bir xil qoida (3/7/14, 4-qutida to\'g\'ri = 5)', () => {
  let h: SozHolat = BOSH_HOLAT;
  const kutilgan = [[2, '2026-11-14'], [3, '2026-11-18'], [4, '2026-11-25'], [5, KUN]] as const;
  for (const [q, sana] of kutilgan) {
    h = baholash(h, true, KUN);
    assert.equal(h.quti, q);
    assert.equal(h.keyingi, sana);
    assert.equal(h.baho, 'bilaman');
  }
  h = baholash(h, false, KUN);
  assert.deepEqual([h.quti, h.keyingi, h.baho], [1, '2026-11-12', 'organ']);
});

test('brauzer: eski tayanch:sat-lugat o\'qiladi, yozilganda shakli saqlanadi', () => {
  const o = new XotiraOmbor();
  o.setItem(KALIT_LUGAT, JSON.stringify({ meticulous: 'bilaman', Scrutinize: 'organ', buzuq: 'xyz' }));
  const h = lokalOqi(o, KUN);
  assert.deepEqual(h.get('meticulous'), { quti: 2, keyingi: KUN, baho: 'bilaman', yulduz: false });
  assert.equal(h.get('scrutinize')?.quti, 1);
  assert.equal(h.has('buzuq'), false);

  h.set('sinov-01', baholash(BOSH_HOLAT, false, KUN));
  h.set('sinov-02', { ...BOSH_HOLAT, yulduz: true });
  assert.ok(lokalYoz(o, h, (k) => (k === 'scrutinize' ? 'Scrutinize' : k)));
  const baholar = JSON.parse(o.getItem(KALIT_LUGAT)!);
  assert.deepEqual(baholar, { meticulous: 'bilaman', Scrutinize: 'organ', 'sinov-01': 'organ' });
  const t = JSON.parse(o.getItem(KALIT_TAKROR)!);
  assert.equal(t.versiya, 1);
  assert.deepEqual(t.sozlar['sinov-02'], { quti: null, keyingi: null, yulduz: true });

  const qayta = lokalOqi(o, '2026-11-20');
  assert.deepEqual(qayta.get('sinov-01'), { quti: 1, keyingi: '2026-11-12', baho: 'organ', yulduz: false });
  assert.equal(qayta.get('sinov-02')?.yulduz, true);
});

test('brauzer: buzuq JSON va saqlash xatosi sahifani to\'xtatmaydi', () => {
  const o = new XotiraOmbor();
  o.setItem(KALIT_LUGAT, '{buzuq');
  o.setItem(KALIT_TAKROR, JSON.stringify({ versiya: 1, sozlar: { a: { quti: 9 }, b: 'x' } }));
  const h = lokalOqi(o, KUN);
  assert.deepEqual(h.get('a'), { quti: null, keyingi: null, baho: null, yulduz: false });
  const yopiq = { getItem: () => null, setItem: () => { throw new Error('QuotaExceeded'); } };
  assert.equal(lokalYoz(yopiq, h), false);
});

test('20 so\'z: kunlik yangi so\'z limiti faqat YANGI so\'zni kesadi, takrorlash qoladi', () => {
  const h = new Map<string, SozHolat>();
  h.set('sinov-01', { ...BOSH_HOLAT, quti: 1, keyingi: KUN });
  h.set('sinov-02', { ...BOSH_HOLAT, quti: 3, keyingi: '2026-11-01' });
  h.set('sinov-03', { ...BOSH_HOLAT, quti: 2, keyingi: '2026-11-15' });
  h.set('sinov-04', { ...BOSH_HOLAT, quti: 5, keyingi: KUN });
  const oz = soz(99, { kalit: 'mening', word: 'mening', oz: true, difficulty: null, topic: null });

  const n = navbat([...SOZLAR, oz], h, KUN, 3);
  assert.deepEqual(n.takror.map((s) => s.kalit), ['sinov-02', 'sinov-01']);
  assert.deepEqual(n.yangi.map((s) => s.kalit), ['mening', 'sinov-05', 'sinov-06', 'sinov-07']);
  assert.equal(n.ushlangan, 13);
  assert.equal(n.keyingiSana, '2026-11-15');

  const tugagan = navbat(SOZLAR, h, KUN, 0);
  assert.equal(tugagan.yangi.length, 0);
  assert.equal(tugagan.takror.length, 2);
  assert.equal(navbat(SOZLAR, h, KUN, null).yangi.length, 16);
  // Ertasi kuni: kvota yana 3, sinov-03 hali kutadi
  assert.equal(navbat(SOZLAR, h, '2026-11-12', 3).yangi.length, 3);
});

test('filtr: qiyinlik, mavzu, yulduzcha; bo\'sh = hammasi', () => {
  const h = new Map<string, SozHolat>([['sinov-03', { ...BOSH_HOLAT, yulduz: true }]]);
  const f = boshFiltr();
  assert.equal(filtrla(SOZLAR, h, f).length, 20);
  f.qiyinlik.add('easy');
  assert.ok(filtrla(SOZLAR, h, f).every((s) => s.difficulty === 'easy'));
  f.mavzu.add('SINOV-b');
  assert.ok(filtrla(SOZLAR, h, f).every((s) => s.topic === 'SINOV-b' && s.difficulty === 'easy'));
  const y = boshFiltr(); y.yulduzli = true;
  assert.deepEqual(filtrla(SOZLAR, h, y).map((s) => s.kalit), ['sinov-03']);
});

test('quiz: 4 variant, bittasi to\'g\'ri, takrorsiz; 4 tadan kam so\'zda bo\'sh', () => {
  let urug = 7;
  const rnd = () => ((urug = (urug * 16807) % 2147483647) / 2147483647);
  const q = quizTuz(SOZLAR, 10, rnd);
  assert.equal(q.length, 10);
  assert.equal(new Set(q.map((x) => x.soz.kalit)).size, 10);
  for (const x of q) {
    assert.equal(x.variantlar.length, 4);
    assert.equal(new Set(x.variantlar.map((v) => v.kalit)).size, 4);
    assert.equal(x.variantlar[x.togri].kalit, x.soz.kalit);
    assert.ok(x.variantlar.every((v) => v.pos === x.soz.pos), 'yetarli bo\'lsa chalg\'ituvchi shu turkumdan');
  }
  const kam = SOZLAR.slice(0, 3);
  assert.equal(quizMumkinmi(kam), false);
  assert.deepEqual(quizTuz(kam), []);
  assert.equal(quizMumkinmi(SOZLAR.slice(0, 4).map((s, i) => (i ? s : { ...s, definition: null }))), false);
});

test('import ro\'yxati va holat matni', () => {
  const h = new Map<string, SozHolat>([
    ['a', { quti: 2, keyingi: '2026-11-14', baho: 'bilaman', yulduz: false }],
    ['b', { ...BOSH_HOLAT }],
    ['c', { ...BOSH_HOLAT, yulduz: true }],
  ]);
  assert.deepEqual(importRoyxati(h), [
    { word: 'a', status: 'bilaman', box: 2, next_due: '2026-11-14', starred: undefined },
    { word: 'c', status: undefined, box: undefined, next_due: undefined, starred: true },
  ]);
  assert.equal(holatMatn(h.get('a'), KUN), 'Box 2 · next Nov 14');
  assert.equal(holatMatn(undefined, KUN), 'New');
  assert.equal(holatMatn({ ...BOSH_HOLAT, quti: 1, keyingi: KUN }, KUN), 'Box 1 · review today');
  assert.equal(holatMatn({ ...BOSH_HOLAT, quti: 5, keyingi: KUN }, KUN), 'Mastered');
  assert.equal(kalitQil('  Apt '), 'apt');
});
