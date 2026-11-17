// Regressiya: src/lib/takrorlash.ts (PR #22) xatti-harakati P09 dan keyin ham o'zgarmasligi kerak.
// Leitner: xato → 1-quti, ertaga; to'g'ri: 1→2 (+3 kun), 2→3 (+7), 3→4 (+14), 4-qutida to'g'ri → 5 (mastered).
// takrorlash.ts kengaytmasiz import qiladi (Astro/Vite uslubi): sinovda .ts qo'shuvchi resolve hook ulanadi.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({
  resolve(s, c, n) {
    try { return n(s, c); }
    catch (e) { if (s.startsWith('.') && !/\.[a-z]+$/.test(s)) return n(s + '.ts', c); throw e; }
  },
});

const xotira = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (k: string) => (xotira.has(k) ? xotira.get(k)! : null),
    setItem: (k: string, v: string) => { xotira.set(k, String(v)); },
    removeItem: (k: string) => { xotira.delete(k); },
    clear: () => xotira.clear(),
  },
});

const T = await import('../takrorlash.ts');
const { javobdanKeyin, sinxronla, guruhla, holatniOqi, sanaQosh, takrorKalit, ORALIQ, BIRINCHI_ORALIQ } = T;

const DAFTAR = 'tayanch:sat-xato-daftari';
const daftar = (x: { id: string; modul: string; tanlangan: string; sana: string }[]) => xotira.set(DAFTAR, JSON.stringify(x));

test('oraliqlar o\'zgarmagan: 1, 3, 7, 14 kun; kalit tayanch:sat-takrorlash', () => {
  assert.equal(BIRINCHI_ORALIQ, 1);
  assert.deepEqual(ORALIQ, { 1: 3, 2: 7, 3: 14 });
  assert.equal(takrorKalit('sat'), 'tayanch:sat-takrorlash');
  assert.equal(sanaQosh('2026-12-30', 3), '2027-01-02');
  assert.equal(sanaQosh('2028-02-28', 1), '2028-02-29');
});

test('javobdanKeyin: xato 1-qutiga, to\'g\'ri keyingi qutiga, 4-qutida mastered', () => {
  const kun = '2026-11-11';
  const y = { quti: 3 as const, keyingi: '2026-11-11', xatoSana: '2026-11-01' };
  assert.deepEqual(javobdanKeyin(y, false, kun), { quti: 1, keyingi: '2026-11-12', xatoSana: kun });
  assert.deepEqual(javobdanKeyin({ ...y, quti: 1 }, true, kun), { quti: 2, keyingi: '2026-11-14', xatoSana: '2026-11-01' });
  assert.deepEqual(javobdanKeyin({ ...y, quti: 2 }, true, kun), { quti: 3, keyingi: '2026-11-18', xatoSana: '2026-11-01' });
  assert.deepEqual(javobdanKeyin(y, true, kun), { quti: 4, keyingi: '2026-11-25', xatoSana: '2026-11-01' });
  assert.deepEqual(javobdanKeyin({ ...y, quti: 4 }, true, kun), { quti: 5, keyingi: kun, xatoSana: '2026-11-01' });
  assert.deepEqual(javobdanKeyin({ ...y, quti: 5 }, true, kun), { quti: 5, keyingi: kun, xatoSana: '2026-11-01' });
});

test('sinxronla: yangi xato 1-qutiga (ertaga), eski sana o\'zgartirmaydi, yangi xato qaytaradi, noma\'lum id yo\'q', () => {
  xotira.clear();
  daftar([
    { id: 'hajm-1', modul: 'hajm', tanlangan: 'x', sana: '2026-11-10' },
    { id: 'yoq-9', modul: 'hajm', tanlangan: 'x', sana: '2026-11-10' },
  ]);
  const mavjud = new Set(['hajm-1', 'hajm-2']);
  let h = sinxronla('sat', mavjud);
  assert.deepEqual(h.savollar, { 'hajm-1': { quti: 1, keyingi: '2026-11-11', xatoSana: '2026-11-10' } });
  assert.ok(xotira.has('tayanch:sat-takrorlash'));

  // Qutini surib qo'yamiz; daftar sanasi o'zgarmasa holat o'zgarmaydi
  h.savollar['hajm-1'] = { quti: 3, keyingi: '2026-11-20', xatoSana: '2026-11-10' };
  T.holatniYoz('sat', h);
  const oldin = xotira.get('tayanch:sat-takrorlash');
  h = sinxronla('sat', mavjud);
  assert.equal(h.savollar['hajm-1'].quti, 3);
  assert.equal(xotira.get('tayanch:sat-takrorlash'), oldin);

  // Darsda yana xato (yangiroq sana) → 1-quti
  daftar([{ id: 'hajm-1', modul: 'hajm', tanlangan: 'y', sana: '2026-11-15' }]);
  h = sinxronla('sat', mavjud);
  assert.deepEqual(h.savollar['hajm-1'], { quti: 1, keyingi: '2026-11-16', xatoSana: '2026-11-15' });
});

test('holatniOqi: buzilgan yozuvlar tashlanadi, boshqa versiya bo\'sh', () => {
  xotira.set('tayanch:sat-takrorlash', JSON.stringify({ versiya: 1, savollar: {
    a: { quti: 2, keyingi: '2026-11-11', xatoSana: '2026-11-01' },
    b: { quti: 7, keyingi: '2026-11-11', xatoSana: '2026-11-01' },
    c: { quti: 1, keyingi: '11/11', xatoSana: '2026-11-01' },
  } }));
  assert.deepEqual(Object.keys(holatniOqi('sat').savollar), ['a']);
  xotira.set('tayanch:sat-takrorlash', JSON.stringify({ versiya: 2, savollar: { a: { quti: 1, keyingi: '2026-11-11', xatoSana: '2026-11-01' } } }));
  assert.deepEqual(holatniOqi('sat').savollar, {});
  xotira.set('tayanch:sat-takrorlash', '{buzuq');
  assert.deepEqual(holatniOqi('sat').savollar, {});
});

test('guruhla: bugun / keyinroq / o\'zlashtirildi, sana bo\'yicha tartib', () => {
  const h = { versiya: 1 as const, savollar: {
    b: { quti: 2 as const, keyingi: '2026-11-11', xatoSana: '2026-11-01' },
    a: { quti: 1 as const, keyingi: '2026-11-11', xatoSana: '2026-11-01' },
    c: { quti: 1 as const, keyingi: '2026-11-09', xatoSana: '2026-11-01' },
    d: { quti: 3 as const, keyingi: '2026-11-20', xatoSana: '2026-11-01' },
    e: { quti: 5 as const, keyingi: '2026-11-05', xatoSana: '2026-11-01' },
  } };
  assert.deepEqual(guruhla(h, '2026-11-11'), { bugun: ['c', 'a', 'b'], keyinroq: ['d'], ozlashtirildi: ['e'] });
});

test('oqim: xato → ertaga due → 4 marta to\'g\'ri (1/3/7/14 kun) → mastered', () => {
  xotira.clear();
  daftar([{ id: 'hajm-2', modul: 'hajm', tanlangan: 'x', sana: '2026-11-10' }]);
  const h = sinxronla('sat', new Set(['hajm-2']));
  assert.deepEqual(guruhla(h, '2026-11-10').bugun, []);
  let kun = '2026-11-11';
  const kutilgan = [[2, '2026-11-14'], [3, '2026-11-21'], [4, '2026-12-05'], [5, '2026-12-05']] as const;
  for (const [quti, keyingi] of kutilgan) {
    assert.deepEqual(guruhla(h, kun).bugun, ['hajm-2']);
    h.savollar['hajm-2'] = javobdanKeyin(h.savollar['hajm-2'], true, kun);
    assert.equal(h.savollar['hajm-2'].quti, quti);
    assert.equal(h.savollar['hajm-2'].keyingi, keyingi);
    kun = keyingi;
  }
  assert.deepEqual(guruhla(h, '2027-01-01'), { bugun: [], keyinroq: [], ozlashtirildi: ['hajm-2'] });
});
