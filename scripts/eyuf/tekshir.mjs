import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import { savollarniSarala, treklarniSarala } from '../../data/eyuf/saralash.mjs';

const root = new URL('../../', import.meta.url);
const directory = new URL('data/eyuf/', root);
const read = async path => JSON.parse(await readFile(new URL(path, directory), 'utf8'));
const names = ['lessons', 'questions-iq', 'questions-interview', 'tracks', 'regions', 'news', 'quotas', 'sources', 'settings', 'rules'];
const ajv = new Ajv({ allErrors: true });
const data = {};
for (const name of names) {
  const schema = await read(`schemas/${name}.schema.json`);
  const validate = ajv.compile(schema);
  data[name] = await read(`${name}.json`);
  assert(validate(data[name]), `${name}: ${JSON.stringify(validate.errors)}`);
  if (data[name].items) {
    assert.equal(new Set(data[name].items.map(row => row.id)).size, data[name].items.length, `${name}: takror ID`);
  }
}
const sourceIds = new Set(data.sources.items.map(row => row.id));
function manbalarniTekshir(value) {
  if (!value || typeof value !== 'object') return;
  if (value.sources) for (const source of value.sources) assert(sourceIds.has(source.id), `Manba ${source.id}`);
  if (value.source) assert(sourceIds.has(typeof value.source === 'string' ? value.source : value.source.book));
  for (const child of Object.values(value)) manbalarniTekshir(child);
}
for (const value of Object.values(data)) manbalarniTekshir(value);
const lessonIds = new Set(data.lessons.items.map(row => row.id));
assert.equal(lessonIds.size, 252);
assert.equal(data.tracks.items.length, 20);
assert.equal(data.regions.items.length, 14);
assert.equal(data['questions-interview'].items.length, 171);
const specialties = data.tracks.items.flatMap(track => track.specialties);
assert.equal(specialties.length, 570);
assert.equal(new Set(specialties.map(item => item.id)).size, 570);
for (const track of data.tracks.items) {
  assert.equal(track.lesson_ids.length, 9);
  for (const id of track.lesson_ids) assert(lessonIds.has(id), id);
}
for (const level of ['bachelor', 'master']) {
  const quota = data.quotas;
  const total = quota.totals[level];
  const base = quota.items.reduce((sum, row) => sum + row.open[level], 0);
  const extra = quota.additional.reduce((sum, row) => sum + row[level], 0);
  assert.equal(base + extra, total.open);
  assert.equal(total.open + total.top100 + total.top300 + total.top20, total.total);
  const tracks = treklarniSarala(data.tracks, quota, level);
  assert.equal(tracks.length, level === 'bachelor' ? 15 : 20);
}
const bank = data['questions-iq'];
assert(bank.items.length >= 250, 'Avvalgi bank yozuvlari saqlanishi kerak');
for (const question of bank.items) {
  assert(question.book_answer === null || question.options.some(option => option.id === question.book_answer));
  assert.equal(question.answer, question.verified ? question.book_answer : null);
  assert.equal(new Set(question.options.map(option => option.id)).size, question.options.length);
  for (const image of question.image) {
    await access(new URL(`public${image.path}`, root));
    assert(question.source.page.includes(image.page));
  }
}
const settings = data.settings;
assert.equal(savollarniSarala(bank, { ...settings, book_content_enabled: false }, { level: 'bachelor' }).length, 20);
const practice = savollarniSarala(bank, { ...settings, book_content_enabled: true }, { level: 'bachelor' });
const mock = savollarniSarala(bank, { ...settings, book_content_enabled: true }, { level: 'bachelor', mock: true });
const original = { ...bank.items[0], id: 'test-original', contentSource: 'original' };
assert.equal(savollarniSarala({ items: [original] }, { ...settings, book_content_enabled: false }, { level: 'bachelor', mock: true }).length, 1);
assert.equal(savollarniSarala(bank, { ...settings, book_content_enabled: true }, { level: 'doctoral' }).length, 0);
assert.equal(treklarniSarala(data.tracks, data.quotas, 'bachelor')[0].id, 'muhandislik');
assert.equal(treklarniSarala(data.tracks, data.quotas, 'master')[0].id, 'sogliq');
assert.equal(practice.length, bank.items.filter(q => q.level.includes('bachelor')).length);
assert.equal(mock.length, bank.items.filter(q => q.level.includes('bachelor') && q.verified && q.answer !== null).length);
assert(mock.length >= 134, 'Tasdiqlangan bank kamaymasligi kerak');
assert(mock.every(question => question.id !== 'iq-1-09'));
// Buzilgan yozuvlar sxemadan o‘tmasligini ham tekshiramiz.
const validateQuestion = ajv.compile((await read('schemas/questions-iq.schema.json')).properties.items.items);
for (const bad of [{ ...bank.items[0], difficulty: 4 }, { ...bank.items[0], level: ['doctoral'] }, { ...bank.items[0], source: null }, { ...bank.items[0], answer: null }, { ...bank.items[0], verified: false }, { ...bank.items[0], book_answer: null }]) {
  assert.equal(validateQuestion(bad), false);
}
console.log(`EYUF: 10 JSON sxemasi, 252 dars, 20 trek, 14 hudud, 171 suhbat yozuvi, ${bank.items.length} test savoli tekshirildi.`);
console.log('Kvota yig‘indilari, manbalar, rasm yo‘llari, book o‘chirgichi va mock filtri OK. Mock saralashi tekshirildi.');
console.log(`Root: ${fileURLToPath(root)}`);
