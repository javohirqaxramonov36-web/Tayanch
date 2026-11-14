import assert from 'node:assert/strict';
import { test } from 'node:test';
import { tavsiyaKursYoli } from '../sat/kursTavsiya.ts';

test('Kurs tavsiyasi faqat nashrdagi va sharti bajarilgan mavzuga boradi', () => {
  const domain = 'Algebra';
  const skill = 'Linear functions';
  const mavzular = [
    { id: 'A2', domain, skill, href: '/a2/', domainHref: '/algebra/', prerequisites: ['A1'] },
    { id: 'A3', domain, skill, href: '/a3/', domainHref: '/algebra/', prerequisites: ['M1'] },
  ];
  const qism = { section: 'math', domain, skill };
  assert.equal(tavsiyaKursYoli(mavzular, qism, new Set(['A1', 'M1'])), '/a2/');
  assert.equal(tavsiyaKursYoli(mavzular, qism, new Set(['M1'])), '/a3/');
  assert.equal(tavsiyaKursYoli(mavzular, qism, new Set()), '/algebra/');
  assert.equal(tavsiyaKursYoli([], qism, new Set(['A1'])), undefined);
  assert.equal(tavsiyaKursYoli(mavzular, { ...qism, section: 'rw' }, new Set(['A1'])), undefined);
});
