import { test } from 'node:test';
import assert from 'node:assert/strict';
import { savollar } from './savollar.ts';
import bank from '../../../../data/eyuf/questions-iq.json' with { type: 'json' };
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
  assert.equal(n.ball,95);
  assert.equal(n.tekshirilmoqda.length,1);
  const bir=mukofotHisobla(h,savollar);
  assert.equal(bir.sessiya!.olinganXp,95);
  assert.deepEqual(mukofotHisobla(bir,savollar),bir);
  bir.sessiya=yangiSessiya('1',bank,30);
  for(const s of bank) bir.sessiya.javoblar[s.id]=s.kitobJavobi;
  assert.equal(mukofotHisobla(bir,savollar).sessiya!.olinganXp,0);
});
test('Yangi tasdiq eski natijani yangilaydi, avvalgi XP qayta berilmaydi', () => {
  const bank = savollar.filter(s => s.test === 1);
  const eskiBank = bank.map(s => s.raqam === 16 ? { ...s, tekshirilgan: false } : s);
  const holat = boshHolat();
  holat.sessiya = yangiSessiya('1', bank, 30);
  for (const savol of bank) holat.sessiya.javoblar[savol.id] = savol.kitobJavobi;

  const avvalgiNatija = mukofotHisobla(holat, eskiBank);
  assert.equal(avvalgiNatija.sessiya!.olinganXp, 90);
  const tiklangan = holatniOqi(JSON.stringify(avvalgiNatija), savollar);
  assert.equal(natijaniHisobla(tiklangan.sessiya!, savollar).ball, 95);
  assert.deepEqual(tiklangan, avvalgiNatija);
  assert.deepEqual(mukofotHisobla(tiklangan, savollar), tiklangan);

  tiklangan.sessiya = yangiSessiya('1', bank, 30);
  for (const savol of bank) tiklangan.sessiya.javoblar[savol.id] = savol.kitobJavobi;
  const qayta = mukofotHisobla(tiklangan, savollar);
  assert.equal(qayta.sessiya!.olinganXp, 5);
  assert.equal(qayta.mukofotlar.length, 19);
  assert.equal(mukofotHisobla(holat, savollar).sessiya!.olinganXp, 95);
});
test('Yangi tasdiqlar ham kunlik 300 XP chegarasiga amal qiladi', () => {
  const hozir = Date.now();
  const kun = new Date(hozir).toLocaleDateString('en-CA', { timeZone: 'Asia/Tashkent' });
  const tasdiqlangan = savollar.filter(s => s.tekshirilgan);
  const holat = boshHolat();
  holat.mukofotlar = tasdiqlangan.slice(0, 59).map(s => ({ id: s.id, kun }));
  const bank = tasdiqlangan.slice(59, 79);
  holat.sessiya = yangiSessiya('aralash', bank, 30, hozir);
  for (const savol of bank) holat.sessiya.javoblar[savol.id] = savol.kitobJavobi;
  const natija = mukofotHisobla(holat, savollar, hozir);
  assert.equal(natija.sessiya!.olinganXp, 5);
  assert.equal(natija.mukofotlar.length, 60);
});
test('Buzilgan va eski localStorage xavfsiz tashlanadi', () => {
  for(const x of ['{','null','[]','{"versiya":0}']) assert.deepEqual(holatniOqi(x,savollar),boshHolat());
  const h=boshHolat(); h.sessiya=yangiSessiya('1',savollar.slice(0,20),30);
  assert.deepEqual(holatniOqi(JSON.stringify(h),savollar),h);
  h.sessiya.savollar[0]='mavjud-emas';
  assert.equal(holatniOqi(JSON.stringify(h),savollar).sessiya,null);
});
test('Yangi bank mukofotlari eski IQ sessiyasida ham saqlanadi', () => {
  const state = boshHolat();
  state.mukofotlar = [{ id: 'prep2-09-c01', kun: '2026-11-21' }];
  state.sessiya = yangiSessiya('1', savollar.slice(0, 20), 30);
  const restored = holatniOqi(JSON.stringify(state), savollar);
  assert.deepEqual(restored, state);
});

test('PREP_1 kaliti va ko‘rik holati ikkala kirish nuqtasida bir xil', () => {
  for (const savol of savollar) {
    const unified = bank.items.find(item => item.id === savol.id);
    assert(unified, savol.id);
    assert.equal(unified.book_answer, savol.kitobJavobi, savol.id);
    assert.equal(unified.verified, savol.tekshirilgan, savol.id);
  }
});
