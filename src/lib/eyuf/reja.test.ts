import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  moslik,
  imtihonsiz,
  testIstisnosi,
  rejaTuz,
  type Profil,
} from './reja.ts';
const p: Profil = {
  level: 'bachelor',
  age: 30,
  citizen: 'yes',
  prior: 'no',
  study: 'no',
  conviction: 'no',
  work: 1,
  letter: 'unconditional',
  ielts: null,
  funding: 'tuition',
  grantPercent: null,
  ranking: 50,
  rankingSystem: 'QS',
  rankingEdition: '2027',
  university: 'Namuna',
  specialty: 'Arxitektura',
  school: 'no',
  certificate: 'sat',
  certificateValid: 'yes',
  sat: 1300,
  verbal: null,
  quant: null,
  writing: null,
  alevel: 'unknown',
};
test('Yosh, grant va daraja istisnolari ajratiladi', () => {
  assert.equal(moslik(p).state, 'aniqlashtirish');
  assert.equal(moslik({ ...p, age: 31 }).state, 'mos-emas');
  assert.equal(moslik({ ...p, level: 'master', age: 21 }).state, 'mos-emas');
  assert.equal(moslik({ ...p, funding: 'full-cost' }).state, 'mos-emas');
});
test('QS/THE va grant shartlari', () => {
  assert.equal(imtihonsiz(p).state, 'mos');
  assert.equal(imtihonsiz({ ...p, level: 'master' }).state, 'aniqlashtirish');
  assert.equal(
    imtihonsiz({
      ...p,
      ranking: 20,
      funding: 'partial',
      grantPercent: 50,
      school: 'yes',
    }).state,
    'mos',
  );
  assert.equal(
    imtihonsiz({
      ...p,
      ranking: 20,
      funding: 'partial',
      grantPercent: 49,
      school: 'yes',
    }).state,
    'mos-emas',
  );
});
test('SAT, GRE va GMAT noaniqligi', () => {
  assert.equal(testIstisnosi(p).state, 'mos');
  assert.equal(testIstisnosi({ ...p, sat: 1290 }).state, 'mos-emas');
  assert.equal(
    testIstisnosi({
      ...p,
      certificate: 'gre',
      verbal: 75,
      quant: 75,
      writing: 74,
    }).state,
    'mos-emas',
  );
  assert.equal(
    testIstisnosi({ ...p, certificate: 'gmat' }).state,
    'aniqlashtirish',
  );
});
test('Kunlik reja muddat va daraja bo‘yicha', () => {
  const lessons = [
    {
      id: 'a',
      title: 'A',
      duration_min: 20,
      course: 'c1',
      module: 'a',
      level: ['bachelor'],
    },
    {
      id: 'b',
      title: 'B',
      duration_min: 20,
      course: 'c2',
      module: 'b',
      level: ['bachelor'],
    },
  ];
  assert.equal(rejaTuz(lessons, 'bachelor', 30, 1, false).remaining, 1);
  assert.equal(rejaTuz(lessons, 'master', 30, null, false).days.length, 0);
  assert.equal(rejaTuz(lessons, 'bachelor', 30, null, true).days.length, 1);
});
