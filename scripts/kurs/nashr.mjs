import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { kursPapkasi, xususiyFayl } from './xususiy.mjs';

export function mavzuYoli(ildiz, mavzu) {
  return join(ildiz, 'sat-math', mavzu.domainSlug, mavzu.topicSlug);
}

export function nashrMalumoti(reja) {
  const savollar = reja.filter(({ qator }) => qator.status === 'verified');
  const imzo = savollar.map(({ qator }) => `${qator.external_id}:${qator.content_hash}`).sort().join('\n');
  return {
    hash: createHash('sha256').update(imzo).digest('hex'),
    savollar: savollar.length,
    miniTest: savollar.filter(({ qator }) => qator.tags[0].endsWith(':mini_test')).length,
  };
}

export function mavzuniKochir(papka, mavzu) {
  const staging = kursPapkasi(papka, 'staging');
  const manba = mavzuYoli(staging, mavzu);
  const content = join(dirname(staging), 'content');
  if (!existsSync(content)) mkdirSync(content, { mode: 0o700 });
  const ildiz = kursPapkasi(papka);
  if (ildiz !== content) throw new Error('Content symlink bo‘lishi mumkin emas');
  for (const bolim of ['sat-math', `sat-math/${mavzu.domainSlug}`]) {
    const yol = join(ildiz, bolim);
    if (!existsSync(yol)) mkdirSync(yol, { mode: 0o700 });
    if (statSync(yol, { throwIfNoEntry: false })?.isDirectory() !== true) throw new Error('Content yo‘li katalog bo‘lishi kerak');
    if (kursPapkasi(papka, `content/${bolim}`) !== yol) throw new Error('Content ichida symlink mumkin emas');
  }
  const joy = mavzuYoli(ildiz, mavzu);
  if (existsSync(joy)) throw new Error('Content mavzusi allaqachon mavjud');
  renameSync(manba, joy);
}

export function kursTasdiqla({ papka, natija, kim, idlar, sinov }) {
  const [mavzu] = natija.katalog;
  const fayl = join(mavzuYoli(kursPapkasi(papka, 'staging'), mavzu), 'questions.json');
  const royxat = new Map(natija.natijalar.map((n) => [n.manba.id, n]));
  for (const [id, hash] of idlar) {
    if (royxat.get(id)?.hash !== hash) throw new Error('Ko‘rik ro‘yxatidagi savol yoki hash mos kelmadi');
  }
  const vaqt = new Date().toISOString();
  const tanlangan = new Map(idlar);
  const savollar = natija.natijalar.map(({ manba, hash }) => {
    if (!tanlangan.has(manba.id) || manba.reviewed) return manba;
    if (manba.author.trim().toLowerCase() === kim.toLowerCase()) throw new Error('Tasdiqlovchi author bilan bir xil');
    return { ...manba, reviewed: true, verified_by: kim, verified_at: vaqt, verified_hash: hash };
  });
  if (sinov) return;
  const asl = JSON.parse(xususiyFayl(dirname(fayl), 'questions.json'));
  if (JSON.stringify(asl) !== JSON.stringify(natija.natijalar.map(({ manba }) => manba))) {
    throw new Error('Savollar ko‘rik paytida o‘zgardi. Tekshiruvni qayta bajaring.');
  }
  const vaqtinchalik = `${fayl}.${process.pid}.tmp`;
  writeFileSync(vaqtinchalik, JSON.stringify(savollar, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  renameSync(vaqtinchalik, fayl);
}

export function idsOqi(papka, mavzu) {
  const ildiz = mavzuYoli(kursPapkasi(papka, 'staging'), mavzu);
  const ids = xususiyFayl(ildiz, 'tasdiqlash.txt').toString('utf8').split('\n')
    .map((qator) => qator.split('#')[0].trim()).filter(Boolean);
  if (!ids.length) throw new Error('Tasdiqlash ro‘yxati bo‘sh');
  const qatorlar = ids.map((qator) => qator.split(/\s+/));
  if (qatorlar.some((qator) => qator.length !== 2 || !/^[a-f0-9]{64}$/.test(qator[1]))
      || new Set(qatorlar.map(([id]) => id)).size !== qatorlar.length) {
    throw new Error('Ko‘rik ro‘yxatida har qatorda bitta ID va hash kerak');
  }
  return qatorlar;
}
