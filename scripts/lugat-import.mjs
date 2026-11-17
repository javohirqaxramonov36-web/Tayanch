// Lug'at so'zlarini CSV dan Supabase vocab_words ga yuklash (P15). Standart holda faqat tekshiradi (dry-run).
//
//   npm run lugat:import -- <fayl.csv>                                   tekshiradi, hech narsa yozmaydi
//   npm run lugat:import -- <fayl.csv> --apply --tasdiqlovchi "<ism>"    yozadi (status = verified)
//
// --apply uchun lokal muhit o'zgaruvchilari (repoga yozilmaydi, .env gitignore'da):
//   SUPABASE_URL (yoki PUBLIC_SUPABASE_URL) va SUPABASE_SERVICE_ROLE_KEY.
// Kalit qiymati hech qachon chiqarilmaydi. Mavjud so'z (harf katta-kichikligidan qat'i nazar) yangilanadi,
// CSV da yo'q so'zlar o'chirilmaydi (faqat soni aytiladi). Ta'rif va misol muallifning o'z so'zlari bo'lishi kerak.
import { readFileSync, existsSync } from 'node:fs';
import { tekshir, xulosa } from './lugat/tekshir.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const qiymat = (nom) => { const i = args.indexOf(nom); return i >= 0 ? args[i + 1] : undefined; };
const tasdiqlovchi = qiymat('--tasdiqlovchi');
const muallif = qiymat('--muallif') ?? 'muallif';
const fayl = args.find((a, i) => !a.startsWith('--') && !['--tasdiqlovchi', '--muallif'].includes(args[i - 1]));

if (!fayl) {
  console.error('Foydalanish: npm run lugat:import -- <fayl.csv> [--apply --tasdiqlovchi "<ism>"]');
  process.exit(2);
}
if (!existsSync(fayl)) { console.error(`Fayl topilmadi: ${fayl}`); process.exit(2); }

const { sozlar, xatolar, ogohlar } = tekshir(readFileSync(fayl, 'utf8'));
const x = xulosa(sozlar);
console.log(`Fayl: ${fayl}`);
console.log(`To'g'ri so'zlar: ${x.jami}; xatolar: ${xatolar.length}; ogohlar: ${ogohlar.length}`);
console.log(`Qiyinlik: ${JSON.stringify(x.qiyinlik)}`);
console.log(`Mavzu: ${JSON.stringify(x.mavzu)}`);
for (const e of xatolar) console.log(`  XATO  ${e}`);
for (const o of ogohlar) console.log(`  OGOH  ${o}`);
if (xatolar.length) { console.error('Xato bor: import qilinmaydi.'); process.exit(1); }

if (!apply) {
  console.log('Dry-run: bazaga hech narsa yozilmadi. Yozish uchun --apply --tasdiqlovchi "<ism>".');
  process.exit(0);
}
if (!tasdiqlovchi?.trim()) { console.error('--apply uchun --tasdiqlovchi "<ism>" kerak (vocab_words.verified_by).'); process.exit(2); }

try { process.loadEnvFile?.('.env'); } catch { /* .env bo'lmasa muhitdan olinadi */ }
const url = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const kalit = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !kalit) { console.error('SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY lokal muhitda yo\'q.'); process.exit(2); }

const { createClient } = await import('@supabase/supabase-js');
const db = createClient(url, kalit, { auth: { persistSession: false, autoRefreshToken: false } });

const { data: bor, error: oqishXato } = await db.from('vocab_words').select('id, word');
if (oqishXato) { console.error(`vocab_words o'qilmadi: ${oqishXato.message}`); process.exit(1); }
const idlar = new Map(bor.map((r) => [r.word.toLowerCase(), r.id]));

const qator = (s) => ({ ...s, status: 'verified', author: muallif, verified_by: tasdiqlovchi.trim() });
const yangi = sozlar.filter((s) => !idlar.has(s.word.toLowerCase())).map(qator);
const eski = sozlar.filter((s) => idlar.has(s.word.toLowerCase())).map((s) => ({ id: idlar.get(s.word.toLowerCase()), ...qator(s) }));

const BOLAK = 200;
for (let i = 0; i < yangi.length; i += BOLAK) {
  const { error } = await db.from('vocab_words').insert(yangi.slice(i, i + BOLAK));
  if (error) { console.error(`Qo'shishda xato: ${error.message}`); process.exit(1); }
}
for (let i = 0; i < eski.length; i += BOLAK) {
  const { error } = await db.from('vocab_words').upsert(eski.slice(i, i + BOLAK), { onConflict: 'id' });
  if (error) { console.error(`Yangilashda xato: ${error.message}`); process.exit(1); }
}
const csvda = new Set(sozlar.map((s) => s.word.toLowerCase()));
const qolgan = bor.filter((r) => !csvda.has(r.word.toLowerCase())).length;
console.log(`Yozildi: yangi ${yangi.length}, yangilangan ${eski.length}. CSV da yo'q, bazada qolgan: ${qolgan} (o'chirilmadi).`);
