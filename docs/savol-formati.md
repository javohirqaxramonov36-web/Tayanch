# Original savol formati (P05)

Holat: 2026-11-09. Turlar va taksonomiya: `src/data/savolSxema.ts`. Skriptlar: `scripts/savol-*.mjs`, umumiy mantiq `scripts/savol/umumiy.mjs`, testlar `npm run savol:sinov`.

Bu format faqat Tayanch'ning **original** savollari uchun (AI qoralama + inson tekshiruvi yoki inson yozgan). College Board materiallari bu formatga kiritilmaydi, ularga qarab yozilmaydi va import qilinmaydi (`docs/kontent-siyosati.md`). Dars ichidagi savollar (`src/data/satDarslar/`, `scripts/savollarni-tekshir.ts`) bunga aloqasi yo'q.

## 1. Savollar qayerda turadi

- Savollar **repodan tashqaridagi** papkada: `TAYANCH_SAVOLLAR_DIR` (masalan `~/Tayanch-savollar`). Repo ochiq, javoblar oshkor bo'lmasligi kerak.
- Skriptlar papka repo ichida bo'lsa to'xtaydi. `npm run repo:tekshir` repoda `"source": "original"` bo'lgan JSON/JSONL topsa xato beradi (istisno: shu hujjatdagi namuna fayli).
- Repoda faqat `docs/namuna-savol.json`: 3 ta **Namuna** savol (`tags: ["namuna"]`, matnda "Namuna."). Ular haqiqiy savol emas, import ularni bazaga yuklamaydi.

Papka ichida istalgan tuzilma bo'lishi mumkin (ichki papkalar ham o'qiladi). Fayl turlari:

- `.json`: bitta savol obyekti yoki savollar massivi;
- `.jsonl`: har qatorda bitta savol.

Rasmlar savol fayli yonida (nisbiy yo'l bilan). `korib-chiqish/` papkasini `savol:korib-chiq` o'zi yaratadi.

## 2. Maydonlar

| Maydon | Tur | Qoida |
| --- | --- | --- |
| `external_id` | matn | Barqaror, o'zgarmaydi. 3–64 belgi: kichik lotin harf, raqam, defis. Import shu bo'yicha upsert qiladi. Tavsiya: `<section>-<skill qisqa>-<raqam>`, masalan `math-lin1-001` |
| `section` | `rw` \| `math` | |
| `domain` | matn | Rasmiy domen nomi (CB12), §3 |
| `skill` | matn | Shu domen ichidagi rasmiy ko'nikma nomi (CB12), §3 |
| `difficulty` | 1–5 | Butun son. Bu Tayanch'ning o'z shkalasi (rasmiy shkala emas) |
| `format` | `mcq` \| `spr` | `spr` faqat `math` da |
| `passage` | matn \| null | R&W da majburiy. Belgilash §4 |
| `stem` | matn | Savol matni |
| `options` | `[{key, text}]` \| null | `mcq`: aniq 4 ta, kalitlar `A`, `B`, `C`, `D` tartibida, matnlar har xil, boshqa maydon yo'q. `spr`: null yoki yo'q |
| `answer` | harf \| matnlar ro'yxati | `mcq`: bitta harf (`"B"`). `spr`: qabul qilinadigan javoblar, masalan `["3/4", ".75", "0.75"]`, §5 |
| `explanation` | matn | Majburiy, kamida 20 belgi |
| `figure` | null \| `{type, src, alt}` | `type`: `svg` \| `png`; `src`: savol fayliga nisbatan yo'l (`..` va absolyut yo'l emas, kengaytma `type` ga mos); `alt`: rasm tavsifi, majburiy |
| `tags` | matnlar ro'yxati | Bo'sh bo'lishi mumkin. `namuna` tegi: §1 |
| `source` | `"original"` | Boshqa qiymat rad etiladi |
| `drafted_by` | `ai` \| `human` | Kim qoralama yozgan |
| `author` | matn | Yozgan odam yoki AI qoralama uchun AI nomi (masalan `"Claude (AI)"`) |
| `verified_by` | matn \| null | Tasdiqlagan **inson** ismi. `author` bilan bir xil emas, AI nomi emas |
| `verified_at` | ISO sana \| null | `savol:tasdiqla` yozadi |
| `verified_hash` | matn \| null | `savol:tasdiqla` yozadi: tasdiqlash paytidagi mazmun hash'i |
| `version` | butun son ≥ 1 | Tasdiqlangan yoki bazaga yuklangan savol mazmuni o'zgarsa oshiriladi |

Boshqa maydon bo'lsa xato (imlo xatosini ushlash uchun).

**Boshlang'ich sxemaga qo'shilganlar** (muallif tasdiqladi, 2026-11-09):

- `figure.alt`: ekran o'quvchi uchun.
- `verified_at` va `verified_hash`: tasdiqdan keyin savol o'zgarsa, u avtomatik draft'ga qaytadi.
- `options` kalitlari qat'iy `A–D`.
- Ruxsat etilgan HTML ro'yxati.
- `Command of Evidence` ikki ko'nikmaga bo'lingan (§3).

## 3. Taksonomiya (CB12, tekshirildi 2026-11-09)

Manba: [College Board, content domains](https://satsuite.collegeboard.org/higher-ed-professionals/test-validity/content-domains). Nomlar sahifadagidek. PSAT izohlari olib tashlangan.

- **rw.** Information and Ideas (Central Ideas and Details; Command of Evidence: Textual; Command of Evidence: Quantitative; Inferences) · Craft and Structure (Words in Context; Text Structure and Purpose; Cross-Text Connections) · Expression of Ideas (Rhetorical Synthesis; Transitions) · Standard English Conventions (Boundaries; Form, Structure, and Sense).
- **math.** Algebra (5) · Advanced Math (3) · Problem-Solving and Data Analysis (7) · Geometry and Trigonometry (4). To'liq ro'yxat: `savolTaksonomiya`.

Rasmiy sahifada "Command of Evidence" bitta ko'nikma, ichida "Textual" va "Quantitative" qismlari bor. Qamrovni alohida ko'rish uchun bu yerda ikki ko'nikma.

## 4. Matn belgilash

- **HTML**: faqat `u b i br table caption thead tbody tr th td`, atributsiz. Ochilgan va yopilgan teglar soni teng bo'lishi kerak. Boshqa teg (`script`, `img`, `span`...) rad etiladi.
- **Matematika (KaTeX)**: faqat `\( ... \)` (qator ichida) va `\[ ... \]` (alohida qator). `$` pul belgisi uchun bo'sh qoladi. Har ifoda `katex` bilan `throwOnError` va `strict` rejimida parse qilinadi. Ajratgichsiz LaTeX buyrug'i (`$\frac12$`, `\sqrt{2}`) xato beradi. JSON ichida teskari chiziq ikkilanadi: `"\\(3x + 7 = 22\\)"`.

## 5. SPR javoblari

Har javob ruxsat etilgan uch turdan biri bo'lishi kerak:

- butun son: `12`, `-3`;
- o'nli son: `0.75`, `.75`;
- oddiy kasr: `3/4`, `-24/2`.

Rad etiladi:

- aralash son (`1 1/2`);
- `%`, `$` yoki vergul;
- bo'shliq;
- takror javob;
- maxraj 0;
- boshqalardan farq qiladigan qiymat. Hamma javob bitta qiymatning yozuvlari bo'lishi kerak. O'nli yaxlitlash uchun 0.001 gacha farqqa ruxsat bor.

**Ogohlantirish (xato emas):** musbat javob 5 belgidan, manfiy javob 6 belgidan oshsa. Bu qoida va "aralash son yo'q" qoidasi **tekshirish kerak**: rasmiy SPR yo'riqnomasi matni 2026-11-09 da o'qilmadi (PDF matni ajratib olinmadi). Tasdiqlansa, ogohlantirish xatoga aylantiriladi va manba `manbalar.ts` ga qo'shiladi.

## 6. Holat va ish jarayoni

1. **Qoralama.** AI qoralama yozadi (03-Savol-yozish-prompti; promptga College Board materiali qo'yilmaydi) yoki muallif o'zi yozadi. Faylga `verified_by: null` bilan saqlanadi.
2. **Tekshiruv.** `npm run savol:tekshir`: xatolar jadvali va qamrov (domen × ko'nikma × qiyinlik, tasdiqlangan/draft).
3. **Ko'rib chiqish.** `npm run savol:korib-chiq` (`--section rw|math`, `--limit N`). U `$TAYANCH_SAVOLLAR_DIR/korib-chiqish/` ga ikki fayl yozadi:
   - `<sana>.md`: har savol uchun passage, savol, variantlar, to'g'ri javob, tushuntirish;
   - `<sana>-tasdiqlash.txt`: faqat tekshiruvdan o'tgan ID'lar.
4. **Tasdiqlash.** Muallif `.md` ni o'qiydi. Tasdiqlamaydigan savollarini `.txt` dan o'chiradi yoki `#` bilan izohga oladi. So'ng:
   ```bash
   npm run savol:tasdiqla -- --kim "Ism Familiya" --fayl <...-tasdiqlash.txt>
   ```
   ID bilan ham bo'ladi: `--id a,b`. Faqat ko'rish uchun `--sinov`. Skript manba faylga `verified_by`, `verified_at`, `verified_hash` yozadi. Quyidagi holatlarda rad etadi:
   - savol tekshiruvdan o'tmagan;
   - ism `author` bilan bir xil;
   - ism AI nomi;
   - ID topilmagan.
5. **Import.** `npm run savol:import` (dry-run), keyin `npm run savol:import -- --apply` (§7).

**Qoidalar:**

- `verified_by` bo'lmagan savol hech qachon `verified` bo'lmaydi.
- `drafted_by: "ai"` savol faqat inson `verified_by` bilan `verified` bo'ladi. Ungacha tekshiruvchi ogohlantiradi, import `draft` qilib yuklaydi.
- Tasdiqdan keyin mazmun o'zgarsa (`verified_hash` mos kelmasa), tekshiruvchi xato beradi va import `draft` qiladi. Yechim: `version` ni oshirib qayta tasdiqlash.
- `author ≠ verified_by`: muallif o'zi yozgan (`drafted_by: "human"`, `author` = muallif) savolni o'zi tasdiqlay olmaydi. Uni boshqa inson tasdiqlashi kerak.

### Qarorlar (2026-11-09; muallif qarorlarni Claude'ga topshirdi)

- **`author ≠ verified_by` qoladi.** Asosiy yo'l: AI qoralama yozadi (`author` = AI nomi), muallif tasdiqlaydi. Muallif o'zi yozgan savolni boshqa inson tasdiqlaydi; bunday odam bo'lmasa, savol draft bo'lib qoladi. Sabab: har savolni kamida bitta boshqa ko'z tekshiradi, bu javob xatosidan himoya qiladi.
- **Savollar papkasi:** `~/Tayanch-savollar` (repodan tashqarida, zaxira nusxasi muallifda). Skriptlarda qattiq yozilmagan, faqat `TAYANCH_SAVOLLAR_DIR` orqali beriladi.
- **Birinchi bosqich maqsadi:** har 30 ko'nikmada kamida 3 ta tasdiqlangan savol (qiyinlik 2, 3 va 4), jami kamida 90 ta. Bu ish rejasi maqsadi, saytda ko'rsatiladigan raqam emas. Qamrov `savol:tekshir` jadvalida kuzatiladi.

## 7. Import (Supabase)

- **Standart rejim dry-run.** Hech narsa yozilmaydi. Kalit bo'lmasa tarmoqqa ham chiqilmaydi. Kalit bo'lsa bazadan faqat o'qiladi (yaratiladi/yangilanadi farqi uchun).
- **`--apply`.** Ikki narsa qiladi:
  - figure fayllarini bucket'ga yuklaydi, yo'l `<section>/<external_id>/<hash12>.<svg|png>`; shu yo'l bazadagi `figure.src` ga yoziladi;
  - savollarni `external_id` bo'yicha upsert qiladi, 100 tadan.
- **Rad etiladi:**
  - tekshiruvdan o'tmagan savol;
  - `namuna` tegli savol (`--apply` da);
  - bazadagidan mazmuni farq qiladigan, lekin `version` i oshmagan savol.
- **Hisobot:** yaratilgan, yangilangan, o'zgarmagan, rad etilgan; verified/draft soni; yuklanadigan rasmlar.
- **Kalitlar** faqat lokal `.env` dan olinadi (`.gitignore` da). npm skripti `node --env-file-if-exists=.env` bilan ishga tushadi. Kerakli o'zgaruvchilar:
  - `SUPABASE_URL` (yoki `PUBLIC_SUPABASE_URL`);
  - `SUPABASE_SERVICE_ROLE_KEY`.

  Qiymatlar logga chiqmaydi. Publishable/anon kalit berilsa, skript to'xtaydi.
- **Jadval va bucket nomlari** env'dan olinadi: `TAYANCH_SAVOL_JADVAL` (standart `questions`), `TAYANCH_SAVOL_BUCKET` (standart `question-figures`).
- **Baza shakli** (`bazaQatori`, `scripts/savol/umumiy.mjs`): jadval `public.questions` (P02, PR #38 + 0010 migratsiyasi; qarorlar `docs/qarorlar/002-sat-savol-baza.md`).
  - `answer` → `correct`: mcq `{"choice": "B"}`, spr `{"accepted": [...]}` (server `submit_answer` shu bilan tekshiradi);
  - `figure` → `{path, alt, type}`, `path` = bucket ichidagi yo'l;
  - `id` yuborilmaydi (baza yaratadi), upsert `external_id` bo'yicha;
  - bazada `hidden` (admin yashirgan) savol import bilan qayta ochilmaydi;
  - mazmun o'zgarsa baza versiyani `greatest(fayldagi, eski + 1)` qiladi.

**P02 holati (2026-11-09):** jadval `public.questions` va private bucket `question-figures` PR #38 da (Tayanch loyihasiga qo'llangan); P05 maydonlari (`drafted_by`, `verified_at`, `tags`, `content_hash`) va `author ≠ verified_by` tekshiruvi 0010 migratsiyasida (PR #65), loyihaga **hali qo'llanmagan**. Brauzer (publishable kalit, kirgan foydalanuvchi) jadvalni to'g'ridan-to'g'ri o'qiy olmaydi: savollar RPC orqali, `correct` va `explanation` siz. Import qatorlari lokal Postgres'da shu sxemaga yozib sinalgan; `--apply` haqiqiy bazada **sinalmagan**.
