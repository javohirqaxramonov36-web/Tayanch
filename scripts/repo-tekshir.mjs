// Repo ochiq: kuzatilayotgan (git ls-files) fayllarda taqiqlangan yo'l va maxfiy kalit qiymatini qidiradi.
// Ishga tushirish: npm run repo:tekshir   (yoki: node scripts/repo-tekshir.mjs)
// Topilsa xato kodi 1 bilan to'xtaydi. Natijada faqat fayl, qator va qoida nomi chiqadi, topilgan qiymat hech qachon.
// Qoidalar asosi: docs/kontent-siyosati.md. Faqat Node'ning o'z modullari (CI'da npm install'siz ishlaydi).
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

// 1. Yo'l qoidalari: bu fayllar repoga umuman tushmasligi kerak.
const yolQoidalari = [
  { nomi: "College Board mock testlari papkasi", re: /(^|\/)SAT mock testlar\//i },
  { nomi: "College Board Question Bank papkasi", re: /(^|\/)SAT-question bank\//i },
  { nomi: "Kurs materiallari papkasi", re: /(^|\/)SAT-kurs materillari\//i },
  { nomi: "Xususiy SAT kursi kontenti", re: /(^|\/)content\/sat-(?:math|english)\//i },
  { nomi: "College Board practice test fayli", re: /(^|\/)sat-practice-test-[^/]*$/i },
  { nomi: "College Board scoring fayli", re: /(^|\/)scoring-sat-practice-[^/]*$/i },
  { nomi: "UUID nomli JSON (savol banki eksporti)", re: /(^|\/)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[^/]*\.json$/i },
  { nomi: ".env fayli", re: /(^|\/)\.env(\.(?!example$)[^/]*)?$/i },
  { nomi: "Ichki qoralama (grants-qoralama.json)", re: /(^|\/)grants-qoralama\.json$/i },
  { nomi: "inbox/ papkasi", re: /(^|\/)inbox\//i },
  { nomi: "private/ papkasi", re: /(^|\/)private\//i },
  { nomi: "Kalit yoki sertifikat fayli", re: /\.(pem|p12|pfx)$/i },
];

// 2. Matn qoidalari: kalit QIYMATI bo'lsa ushlaydi ("service_role" so'zining o'zi xato emas).
const matnQoidalari = [
  { nomi: "Supabase secret kaliti (sb_secret_)", re: /\bsb_secret_[A-Za-z0-9_-]{16,}/ },
  { nomi: "service_role kaliti qiymati", re: /SERVICE_ROLE(_KEY)?["']?\s*[:=]\s*["']?[A-Za-z0-9._-]{20,}/i },
  { nomi: "Bearer token", re: /\bBearer\s+[A-Za-z0-9._~+/=-]{20,}/i },
  { nomi: "Webhook secret (whsec_)", re: /\bwhsec_[A-Za-z0-9+/=_-]{16,}/ },
  { nomi: "Webhook/inPAY/merchant secret qiymati", re: /(webhook|inpay|merchant)[_-]?(secret|token|key)["']?\s*[:=]\s*["'][^"'\s$]{12,}["']/i },
  { nomi: "Google OAuth client secret (GOCSPX-)", re: /\bGOCSPX-[A-Za-z0-9_-]{20,}/ },
  { nomi: "Shaxsiy kalit (PRIVATE KEY bloki)", re: /-----BEGIN (?:[A-Z]+ )*PRIVATE KEY-----/ },
  { nomi: "GitHub token", re: /\b(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{40,})/ },
  { nomi: "AWS kirish kaliti", re: /\bAKIA[0-9A-Z]{16}\b/ },
];

// JWT ichida role=service_role bo'lsa xato. Ochiq (anon/publishable) kalit ham JWT bo'lishi mumkin, u ruxsat etilgan.
const jwtRe = /eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}/g;
function serviceRoleJwtmi(qator) {
  for (const m of qator.matchAll(jwtRe)) {
    try {
      const yuk = Buffer.from(m[1], 'base64url').toString('utf8');
      if (/"role"\s*:\s*"service_role"/.test(yuk)) return true;
    } catch {
      // dekod bo'lmasa JWT emas
    }
  }
  return false;
}

const otkaziladi = new Set(['package-lock.json']);
const MAKS_HAJM = 5 * 1024 * 1024;

const fayllar = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const xatolar = [];

for (const fayl of fayllar) {
  for (const q of yolQoidalari) {
    if (q.re.test(fayl)) xatolar.push(`${fayl}  [${q.nomi}]`);
  }
  if (otkaziladi.has(fayl)) continue;

  let buf;
  try {
    if (statSync(fayl).size > MAKS_HAJM) continue;
    buf = readFileSync(fayl);
  } catch {
    continue; // index'da bor, diskda yo'q
  }
  if (buf.subarray(0, 8000).includes(0)) continue; // binar fayl

  // 3. Original savollar repoda emas (javoblar oshkor bo'ladi): faqat namuna fayli ruxsat etilgan (docs/savol-formati.md).
  if (/\.jsonl?$/i.test(fayl) && fayl !== 'docs/namuna-savol.json' && /"source"\s*:\s*"original"/.test(buf.toString('utf8'))) {
    xatolar.push(`${fayl}  [Original savol fayli (source: "original") repoda; TAYANCH_SAVOLLAR_DIR ga ko'chiring]`);
  }

  const qatorlar = buf.toString('utf8').split('\n');
  qatorlar.forEach((qator, i) => {
    for (const q of matnQoidalari) {
      if (q.re.test(qator)) xatolar.push(`${fayl}:${i + 1}  [${q.nomi}]`);
    }
    if (qator.includes('eyJ') && serviceRoleJwtmi(qator)) xatolar.push(`${fayl}:${i + 1}  [service_role JWT]`);
  });
}

if (xatolar.length) {
  console.error(`repo:tekshir: ${xatolar.length} ta muammo (qiymatlar ko'rsatilmaydi):`);
  for (const x of xatolar) console.error(`  XATO  ${x}`);
  console.error("Faylni index'dan olib tashlang (git rm --cached <fayl>) va .gitignore ni tekshiring. Tarixda bo'lsa: docs/kontent-siyosati.md.");
  process.exit(1);
}
console.log(`repo:tekshir: ${fayllar.length} ta kuzatilayotgan fayl tekshirildi, muammo yo'q.`);
