import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BOSQICHLAR, katalogniOqi } from './katalog.mjs';
import { kursImportRejasi, kursSavoliniOqi } from './savol.mjs';
import { kursPapkasi, pngOqi, xususiyFayl } from './xususiy.mjs';

function pythonTekshir(topshiriqlar) {
  const natija = spawnSync(process.env.TAYANCH_KURS_PYTHON || 'python3', [
    '-I', '-B', fileURLToPath(new URL('./tekshir.py', import.meta.url)),
  ], {
    input: JSON.stringify(topshiriqlar), encoding: 'utf8', timeout: 20_000, killSignal: 'SIGKILL',
    maxBuffer: 2 * 1024 * 1024, env: { PATH: process.env.PATH },
  });
  if (natija.error || natija.status !== 0) {
    throw new Error('SymPy/Markdown jarayoni bajarilmadi. requirements.txt, Python yo‘li va resurs chegaralarini tekshiring');
  }
  const javob = JSON.parse(natija.stdout);
  if (!Array.isArray(javob) || javob.length !== topshiriqlar.length) throw new Error('Python tekshiruv natijasi xato');
  return javob;
}

export function kursniTekshir({ papka, mavzuId, staging = false, muallif = process.env.TAYANCH_MUALLIF?.trim() } = {}) {
  const katalog = katalogniOqi().filter((m) => !mavzuId || m.id === mavzuId);
  if (!katalog.length) throw new Error('MVP mavzusi topilmadi');
  const ildiz = kursPapkasi(papka, staging ? 'staging' : 'content');
  const xatolar = [];
  const natijalar = [];
  const darslar = new Map();
  const topshiriqlar = [];
  const idlar = new Map();
  const matnlar = new Map();

  for (const mavzu of katalog) {
    const mavzuPapkasi = join('sat-math', mavzu.domainSlug, mavzu.topicSlug);
    const lessonJoy = `${mavzu.id}/lesson.md`;
    try {
      const text = xususiyFayl(ildiz, join(mavzuPapkasi, 'lesson.md'), 128 * 1024).toString('utf8');
      topshiriqlar.push({ joy: lessonJoy, papka: mavzuPapkasi, topshiriq: { type: 'lesson', text } });
    } catch (e) {
      xatolar.push(`${lessonJoy}: ${e.message}`);
    }

    const nom = join(mavzuPapkasi, 'questions.json');
    const faylJoy = `${mavzu.id}/questions.json`;
    let savollar;
    try {
      const buf = xususiyFayl(ildiz, nom);
      try { savollar = JSON.parse(buf.toString('utf8')); } catch { throw new Error('JSON sintaksisi xato'); }
      if (!Array.isArray(savollar) || savollar.length !== mavzu.total) {
        throw new Error(`JSON massivida ${mavzu.total} ta savol kerak`);
      }
    } catch (e) {
      xatolar.push(`${faylJoy}: ${e.message}`);
      continue;
    }

    for (const stage of BOSQICHLAR) {
      if (savollar.filter((s) => s?.stage === stage).length !== mavzu.counts[stage]) {
        xatolar.push(`${faylJoy}: ${stage} bosqichida ${mavzu.counts[stage]} ta savol kerak`);
      }
    }
    if (savollar.filter((s) => s?.type === 'spr').length !== mavzu.spr) {
      xatolar.push(`${faylJoy}: CSV spr_share bo‘yicha ${mavzu.spr} ta SPR kerak`);
    }

    for (const [i, s] of savollar.entries()) {
      const joy = `${faylJoy} #${i + 1}`;
      try {
        const n = kursSavoliniOqi(s, mavzu, join(ildiz, nom), muallif);
        if (idlar.has(s.id)) throw new Error(`Takror ID (${idlar.get(s.id)})`);
        if (matnlar.has(n.matnImzosi)) throw new Error(`Takror matn (${matnlar.get(n.matnImzosi)})`);
        idlar.set(s.id, joy);
        matnlar.set(n.matnImzosi, joy);
        natijalar.push({ ...n, joy, manba: s });
        topshiriqlar.push({ joy, topshiriq: n.topshiriq });
      } catch (e) {
        xatolar.push(`${joy}: ${e.message}`);
      }
    }
  }

  if (topshiriqlar.length) {
    const javoblar = pythonTekshir(topshiriqlar.map((x) => x.topshiriq));
    javoblar.forEach((javob, i) => {
      const { joy, papka } = topshiriqlar[i];
      if (javob.error) xatolar.push(`${joy}: ${javob.error}`);
      if (!javob.sections) return;
      let sections = javob.sections;
      for (const rasm of new Set(javob.images)) {
        try {
          const png = pngOqi(join(ildiz, papka), rasm);
          sections = sections.map((html) => html.replaceAll(`src="${rasm}"`, `src="data:image/png;base64,${png.toString('base64')}"`));
        } catch (e) { xatolar.push(`${joy}: ${e.message}`); }
      }
      darslar.set(joy.split('/')[0], sections);
    });
  }

  return { katalog, xatolar, natijalar, darslar, reja: xatolar.length ? [] : kursImportRejasi(natijalar, katalog) };
}
