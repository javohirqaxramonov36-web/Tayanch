import { katalogniOqi } from './katalog.mjs';
import { mavzuYoli, nashrMalumoti } from './nashr.mjs';
import { kursniTekshir } from './tekshir.mjs';
import { kursPapkasi, xususiyFayl } from './xususiy.mjs';

export function nashrniOqi(papka, muallif) {
  let content;
  try { content = kursPapkasi(papka); } catch { return {}; }
  const nashr = {};
  for (const mavzu of katalogniOqi()) {
    try {
      const joy = mavzuYoli(content, mavzu);
      const receipt = JSON.parse(xususiyFayl(joy, 'import-receipt.json', 1024));
      const { xatolar, reja, darslar } = kursniTekshir({ papka, mavzuId: mavzu.id, muallif });
      if (xatolar.length || !reja.length) continue;
      const { hash, savollar, miniTest } = nashrMalumoti(reja);
      if (receipt.topic !== mavzu.id || receipt.hash !== hash || receipt.savollar !== savollar || receipt.miniTest !== miniTest) continue;
      nashr[mavzu.id] = { savollar: receipt.savollar, miniTest: receipt.miniTest, darslar: darslar.get(mavzu.id) };
    } catch {
      // Yaroqsiz yoki eskirgan xususiy paket nashrga chiqmaydi.
    }
  }
  return nashr;
}
