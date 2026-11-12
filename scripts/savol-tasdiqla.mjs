// Muallif ko'rib chiqqan savollarni tasdiqlaydi (P05): manba faylga verified_by, verified_at va verified_hash yoziladi.
// Ishga tushirish:
//   TAYANCH_SAVOLLAR_DIR=~/Tayanch-savollar npm run savol:tasdiqla -- --kim "Ism Familiya" --id rw-trans-001,rw-trans-002
//   TAYANCH_SAVOLLAR_DIR=~/Tayanch-savollar npm run savol:tasdiqla -- --kim "Ism Familiya" --fayl <ro'yxat.txt>
//   --sinov: hech narsa yozmaydi, faqat nima bo'lishini ko'rsatadi.
// Ism TAYANCH_MUALLIF env'dan ham olinadi. Rad etiladi: tekshiruvdan o'tmagan savol, ism author bilan bir xil yoki AI nomi.
import { readFileSync } from 'node:fs';
import { argumentlar, aiNomimi, faylniYoz, hammasiniTekshir, mazmunHash, savolFayllari, savollarPapkasi, xatoBilanChiq } from './savol/umumiy.mjs';

const a = argumentlar();
const kim = String(a.kim ?? process.env.TAYANCH_MUALLIF ?? '').trim();
if (!kim || kim === 'true') xatoBilanChiq('--kim "<tasdiqlovchi ismi>" (yoki TAYANCH_MUALLIF) kerak');
if (aiNomimi(kim)) xatoBilanChiq('Tasdiqlovchi inson bo\'lishi kerak (AI nomi emas)');

let idlar = [];
if (typeof a.id === 'string') idlar = a.id.split(',');
else if (typeof a.fayl === 'string') idlar = readFileSync(a.fayl, 'utf8').split('\n').map((q) => q.replace(/#.*/, ''));
else xatoBilanChiq('--id a,b,c yoki --fayl <ro\'yxat.txt> kerak');
idlar = [...new Set(idlar.map((x) => x.trim()).filter(Boolean))];
if (!idlar.length) xatoBilanChiq("Ro'yxat bo'sh");

const papka = savollarPapkasi(a);
const { natijalar, faylXatolari } = hammasiniTekshir(savolFayllari(papka));
if (faylXatolari.length) xatoBilanChiq(`O'qilmagan fayl bor (${faylXatolari[0].fayl}); avval npm run savol:tekshir`);

const idBoyicha = new Map(natijalar.filter((n) => n.savol?.external_id).map((n) => [n.savol.external_id, n]));
const vaqt = new Date().toISOString();
const tasdiqlandi = [];
const otkazildi = [];
const rad = [];
const ozgarganFayllar = new Set();

for (const id of idlar) {
  const n = idBoyicha.get(id);
  if (!n) { rad.push([id, 'topilmadi']); continue; }
  const s = n.savol;
  if (s.verified_by && !n.xatolar.length) { otkazildi.push([id, `allaqachon tasdiqlangan (${s.verified_by})`]); continue; }
  // verified_* maydonlari bilan bog'liq xatolar tasdiqlash orqali tuzatiladi, qolganlari to'sadi.
  const tosiq = n.xatolar.filter((x) => !/^verified_(at|hash)/.test(x));
  if (tosiq.length) { rad.push([id, tosiq.join('; ')]); continue; }
  if (String(s.author).trim().toLowerCase() === kim.toLowerCase()) { rad.push([id, 'tasdiqlovchi author bilan bir xil']); continue; }
  s.verified_by = kim;
  s.verified_at = vaqt;
  s.verified_hash = mazmunHash(s);
  ozgarganFayllar.add(n.fayl);
  tasdiqlandi.push(id);
}

if (!a.sinov) {
  for (const fayl of ozgarganFayllar) {
    faylniYoz(fayl, natijalar.filter((n) => n.fayl === fayl).map((n) => n.savol));
  }
}

console.log(`${a.sinov ? '[sinov, hech narsa yozilmadi] ' : ''}Tasdiqlandi: ${tasdiqlandi.length}, o'tkazildi: ${otkazildi.length}, rad etildi: ${rad.length}`);
for (const id of tasdiqlandi) console.log(`  + ${id}`);
for (const [id, x] of otkazildi) console.log(`  = ${id}: ${x}`);
for (const [id, x] of rad) console.log(`  ✗ ${id}: ${x}`);
if (rad.length) process.exit(1);
