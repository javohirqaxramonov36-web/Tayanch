import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(process.argv[2] ?? 'dist');
const yollar = readFileSync(new URL('./live-course-paths.txt', import.meta.url), 'utf8')
  .split(/\r?\n/)
  .map((qator) => qator.trim())
  .filter((qator) => qator && !qator.startsWith('#'));

const yolNaqshi = /^\/uz\/(sat|ielts)\/(?:[a-z0-9-]+\/)*$/;
if (!yollar.length || yollar.some((yol) => !yolNaqshi.test(yol)) || new Set(yollar).size !== yollar.length) {
  throw new Error('Jonli kurs yo‘llari manifesti bo‘sh, noto‘g‘ri yoki takrorlangan.');
}

const yetishmaydi = yollar.filter((yol) =>
  !statSync(resolve(dist, `.${yol}index.html`), { throwIfNoEntry: false })?.isFile(),
);
if (yetishmaydi.length) {
  console.error(`Buildda ${yetishmaydi.length} ta jonli kurs yo‘li yo‘q:\n${yetishmaydi.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Buildda ${yollar.length} ta jonli SAT/IELTS kurs yo‘li bor.`);
}
