// npm run validate:tests
// Validates every IELTS Reading test JSON (and the test fixture) against schema v1 and checks
// the band table. Exit code 1 on any error. The same checks run inside `astro build`.
import { BAND_JADVALI } from '../src/data/ielts/bandJadvali.ts';
import { jadvalXatolari } from '../src/lib/ielts/reading/band.ts';
import { FIXTURE_PAPKA, JAMI_SAVOL, TEST_PAPKA, yuklaTestlar } from '../src/lib/ielts/reading/testlarYukla.ts';

const { fayllar } = yuklaTestlar({ fixture: true });
let xatoSoni = 0;

for (const f of fayllar) {
  const tur = f.fixture ? 'fixture' : 'test';
  if (f.xatolar.length === 0) {
    console.log(`ok    ${f.fayl} (${tur}, ${f.savollar} questions)`);
    continue;
  }
  xatoSoni += f.xatolar.length;
  console.error(`FAIL  ${f.fayl} (${tur})`);
  for (const x of f.xatolar) console.error(`      - ${x}`);
}

const jadval = jadvalXatolari(BAND_JADVALI, JAMI_SAVOL);
if (jadval.length > 0) {
  xatoSoni += jadval.length;
  console.error('FAIL  src/data/ielts/bandJadvali.ts');
  for (const x of jadval) console.error(`      - ${x}`);
}

const haqiqiy = fayllar.filter((f) => !f.fixture).length;
if (haqiqiy === 0) console.log(`note  no tests in ${TEST_PAPKA}/ yet (fixtures: ${FIXTURE_PAPKA}/)`);

if (xatoSoni > 0) {
  console.error(`\n${xatoSoni} error(s). See docs/ielts-schema.md.`);
  process.exit(1);
}
console.log(`\nIELTS Reading: ${haqiqiy} test(s) valid, band table valid.`);
