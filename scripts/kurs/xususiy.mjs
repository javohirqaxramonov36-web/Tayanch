import { readFileSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { homedir } from 'node:os';
import { REPO } from '../savol/umumiy.mjs';

function ichidami(asos, yol) {
  const farq = relative(asos, yol);
  return farq !== '..' && !farq.startsWith(`..${sep}`) && !isAbsolute(farq);
}

export function kursPapkasi(papka = process.env.TAYANCH_SAVOLLAR_DIR ?? join(homedir(), 'Tayanch-savollar'), bolim = 'content') {
  const yol = resolve(papka.replace(/^~(?=$|\/)/, homedir()), bolim);
  const repo = realpathSync(REPO);
  if (ichidami(REPO, yol)) throw new Error('Kurs kontenti repo tashqarisida bo‘lishi kerak');
  let ildiz;
  try {
    ildiz = realpathSync(yol);
    if (!statSync(ildiz).isDirectory()) throw new Error();
  } catch {
    throw new Error(`Xususiy ${bolim}/ papkasi topilmadi`);
  }
  if (ichidami(repo, ildiz)) throw new Error('Kurs kontenti repo tashqarisida bo‘lishi kerak');
  return ildiz;
}

export function xususiyFayl(ildiz, nom, limit = 512 * 1024) {
  const yol = resolve(ildiz, nom);
  if (!ichidami(ildiz, yol)) throw new Error('Xususiy fayl yo‘li papkadan tashqariga chiqdi');
  try {
    const asl = realpathSync(yol);
    if (asl !== yol) throw new Error();
    const holat = statSync(asl);
    if (!holat.isFile() || holat.size > limit) throw new Error();
    return readFileSync(asl);
  } catch {
    throw new Error('Xususiy fayl topilmadi, symlink yoki hajm chegarasi xato');
  }
}

export function pngOqi(ildiz, nom) {
  if (typeof nom !== 'string' || !/^(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.png$/i.test(nom)) {
    throw new Error('Rasm uchun mavzu ichidagi nisbiy PNG yo‘li kerak');
  }
  const rasm = xususiyFayl(ildiz, nom, 2 * 1024 * 1024);
  if (!rasm.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) throw new Error('Rasm PNG formatida emas');
  return rasm;
}
