import { test } from 'node:test';
import assert from 'node:assert/strict';
import { savollar } from './savollar.ts';
import { boshHolat, yangiSessiya, mukofotHisobla, holatniOqi, aralashtir, natijaniHisobla } from './model.ts';

test('100 savol, har test 20, kalit variantlarda mavjud', () => {
  assert.equal(savollar.length, 100);
  assert.equal(new Set(savollar.map(s => s.id)).size, 100);
  for (let i = 1; i <= 5; i++) assert.equal(savollar.filter(s => s.test === i).length, 20);
  for (const s of savollar) {
    assert(s.variantlar.includes(s.kitobJavobi));
    assert(s.rasmlar.length > 0);
    assert(s.yechim.length > 20);
  }
});
test('Aralash savollar takrorlanmaydi', () => {
  assert.equal(new Set(aralashtir(savollar).slice(0,20).map(s => s.id)).size,20);
});
test('Natija, takroriy XP va tekshirilayotgan javob', () => {
  const h=boshHolat();
  const bank=savollar.filter(s => s.test===1);
  h.sessiya=yangiSessiya('1',bank,30);
  for(const s of bank) h.sessiya.javoblar[s.id]=s.kitobJavobi;
  const n=natijaniHisobla(h.sessiya,savollar);
  assert.equal(n.ball,90);
  assert.equal(n.tekshirilmoqda.length,2);
  const bir=mukofotHisobla(h,savollar);
  assert.equal(bir.sessiya!.olinganXp,90);
  assert.deepEqual(mukofotHisobla(bir,savollar),bir);
  bir.sessiya=yangiSessiya('1',bank,30);
  for(const s of bank) bir.sessiya.javoblar[s.id]=s.kitobJavobi;
  assert.equal(mukofotHisobla(bir,savollar).sessiya!.olinganXp,0);
});
test('Buzilgan va eski localStorage xavfsiz tashlanadi', () => {
  for(const x of ['{','null','[]','{"versiya":0}']) assert.deepEqual(holatniOqi(x,savollar),boshHolat());
  const h=boshHolat(); h.sessiya=yangiSessiya('1',savollar.slice(0,20),30);
  assert.deepEqual(holatniOqi(JSON.stringify(h),savollar),h);
  h.sessiya.savollar[0]='mavjud-emas';
  assert.equal(holatniOqi(JSON.stringify(h),savollar).sessiya,null);
});
