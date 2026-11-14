import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { sprTekshir } from '../sat/sprFormat.ts';

const vektorlar: { input: string; format: string | null }[] = JSON.parse(
  readFileSync(new URL('../../../supabase/tests/kurs_spr_vektorlar.json', import.meta.url), 'utf8'),
);

for (const { input, format } of vektorlar) {
  test(`Kurs SPR formati ${JSON.stringify(input)}`, () => {
    const natija = sprTekshir(input, true);
    assert.equal(natija.ok ? natija.qiymat : null, format);
  });
}

test('Bank va mock SPR formati avvalgi kiritishlarni qabul qiladi', () => {
  assert.equal(sprTekshir('5.').ok, true);
  assert.equal(sprTekshir('123456').ok, true);
});
