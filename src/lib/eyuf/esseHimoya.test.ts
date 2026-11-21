import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esseDavolari, himoyaSavollari } from './esseHimoya.ts';
test('Esse jumlalarga ajratiladi, bo‘sh matn va limit boshqariladi', () => {
  assert.deepEqual(esseDavolari(''), []);
  assert.equal(
    esseDavolari(
      'Men tadqiqot loyihasida qatnashdim. Natijani jamoa bilan tekshirdik!',
    ).length,
    2,
  );
  assert.equal(
    esseDavolari(Array(40).fill('Men jamoada loyihani bajardim.').join(' '))
      .length,
    30,
  );
  assert.equal(himoyaSavollari('<script>x</script>').length, 4);
});
