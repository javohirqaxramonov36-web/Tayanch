# SAT mock imtihon: adaptive-style 2-modul (P31)

Holat: yadro qurilgan (branch `sat-adaptiv`, 2026-11-12). Mock imtihonga (P30, branch `sat-mock-imtihon`) ulash alohida kichik PR bo'ladi. Migratsiya jonli bazaga 2026-11-13 da qo'llangan (PR #131 merge qilingan).

## Bu nima va nima emas

- Tayanch mock imtihonida 2-modul 1-modul natijasiga qarab tanlanadi. Usul **adaptive-style**: oddiy qoida, 1-modul aniqligi chegaradan yuqori bo'lsa qiyinroq to'plam beriladi, aks holda osonroq to'plam.
- Bu College Board'ning rasmiy algoritmi emas. Tayanch o'z qoidasini rasmiy algoritm (IRT) bilan bir xil deb da'vo qilmaydi, ball hisobi ham rasmiy emas. Rasmiy algoritm tafsilotlari bu hujjatga yozilmagan (manba bilan tekshirilmagan). Sahifa matnida "adaptive-style" deb yoziladi, "same as the real SAT" yoki "IRT" deb yozilmaydi.
- Modul tuzilmasi CB03 dan: R&W 2 modul, jami 54 savol; Math 2 modul, jami 44 savol (`src/data/manbalar.ts`).

## Fayllar

| Fayl | Nima |
| --- | --- |
| `src/data/satAdaptiv.ts` | Sozlama: chegara, tarmoq qiyinliklari, eng kam savol soni, kalibrlash N va pog'onalar |
| `src/lib/sat/adaptiv.ts` | Sof funksiyalar: `tarmoqTanla`, `adaptivHolat`, `tarmoqQiyinliklari`, `kalibrla`, `kalibrJadval` |
| `src/lib/testlar/adaptiv.test.ts` | Sun'iy javoblar bilan sinov (`npm test`) |
| `supabase/migrations/20261112163208_adaptiv_kalibr.sql` | `private.difficulty_calibration()` (hisobot), `private.apply_difficulty_calibration()` (yozish) |
| `supabase/tests/adaptiv_test.sql` | SQL sinovi AD01–AD04 (`npm run db:tekshir`) |

## Tarmoq tanlash qoidasi

`tarmoqTanla(natija, bolim, savolSoni)` → `{ tarmoq, sabab, aniqlik }`:

1. `chegara` berilmagan yoki 0–100 oralig'ida emas → `standart`, sabab `chegara-yoq`.
2. Oson yoki qiyin tarmoqda savol `minSavolTarmoq[bolim]` dan kam → `standart`, sabab `savol-kam`.
3. 1-modul natijasi yaroqsiz (0 savol, butun bo'lmagan son, to'g'ri > jami) → `standart`, sabab `natija-yoq`.
4. Aniqlik (to'g'ri / jami × 100) chegaradan **qat'iy katta** → `qiyin`, aks holda (tenglik ham) → `oson`.

`standart` = P30 dagi oddiy tartib, qiyinlik bo'yicha filtr yo'q (`tarmoqQiyinliklari('standart') === null`). `savolSoni` ni P30 beradi: shu bo'limda har tarmoq qiyinliklariga mos, tasdiqlangan va 1-modulda ishlatilmagan savollar soni. P30 1-modul boshlanishidan oldin `adaptivHolat()` ni chaqirib, adaptivlik bo'lishini oldindan bilishi mumkin.

## Sozlama qiymatlari (muallif tasdig'i kutilmoqda)

| Kalit | Qiymat | Sabab |
| --- | --- | --- |
| `chegara` | `null` (o'chiq) | Qiymat muallif bilan kelishiladi, o'ylab topilmaydi. Berilmaguncha adaptivlik o'chiq. |
| `tarmoqQiyinlik.oson` | 1, 2, 3 | Taklif. `questions.difficulty` 1–5 shkalasi. 3 (o'rta) ikkala tarmoqda: ikkala to'plamda ham o'rta savol bo'ladi. |
| `tarmoqQiyinlik.qiyin` | 3, 4, 5 | Taklif. |
| `minSavolTarmoq.rw` | 27 | Taklif: bitta R&W moduli (54 / 2, CB03), 2-modul takrorsiz to'lsin. |
| `minSavolTarmoq.math` | 22 | Taklif: bitta Math moduli (44 / 2, CB03). |
| `kalibrlash.minJavob` (N) | 30 | Taklif. 30 javobda to'g'ri javob ulushining 95% ishonch oralig'i eng yomon holatda (ulush 50%) taxminan ±18 band (1,96 × √(0,25 / 30) ≈ 0,18). Bu bitta qiyinlik pog'onasidan (20 band) kichik. Kamroq javobda bitta tasodifiy javob savolni boshqa pog'onaga o'tkazib yuborishi mumkin. |
| `kalibrlash.pogonalar` | 80, 60, 40, 20 | Taklif. To'g'ri javob ulushi ≥ 80% → 1, ≥ 60% → 2, ≥ 40% → 3, ≥ 20% → 4, qolgani → 5. |

Muallif uchun savollar (PR tavsifida ham):
1. 1-modul aniqligi chegarasi necha foiz bo'lsin?
2. N = 30 va pog'onalar 80/60/40/20 ma'qulmi?
3. Tarmoq qiyinliklari 1–3 / 3–5 va eng kam savol soni (R&W 27, Math 22) ma'qulmi?

N yoki pog'ona o'zgarsa, ikki joy birga o'zgaradi: `src/data/satAdaptiv.ts` va migratsiyadagi standart qiymatlar (yangi migratsiya bilan). `adaptiv.test.ts` ularning bir xilligini tekshiradi.

## Kalibrlash

Qoidalar (`private.difficulty_calibration`):
- faqat `status = 'verified'` savollar;
- har foydalanuvchining savolning **joriy versiyasiga** bergan **birinchi** javobi sanaladi (takror urinish, redo va matn o'zgarishidan oldingi javoblar ulushni buzmaydi);
- javoblar N dan kam bo'lsa taklif yo'q (`not_enough`), qiyinlik o'zgarmaydi;
- `status`: `change` (taklif joriy qiyinlikdan farq qiladi), `ok`, `not_enough`.

Qiyinlik avtomatik o'zgarmaydi: muallif hisobotni ko'rib, keyin qo'lda yozadi. `difficulty` o'zgarishi `questions.version` ni oshirmaydi (versiya faqat matn o'zgarganda oshadi), shuning uchun javoblar keyingi kalibrlashda ham sanaladi.

### Hisobot (faqat o'qiydi)

Supabase SQL Editor'da (egasi sifatida; anon, authenticated va service_role bu funksiyani chaqira olmaydi):

```sql
select external_id, section, current_difficulty, answers, correct, p_correct, suggested_difficulty, status
from private.difficulty_calibration();          -- standart: N = 30, pog'onalar 80/60/40/20
-- boshqa qiymat bilan sinab ko'rish: private.difficulty_calibration(50, '{85,65,45,25}')
```

Hisobot jadvali ustunlari:

| Ustun | Ma'no |
| --- | --- |
| `external_id`, `section` | Savol |
| `current_difficulty` | Hozirgi qiyinlik (1–5) |
| `answers`, `correct` | Sanalgan javoblar va to'g'rilari |
| `p_correct` | To'g'ri javob ulushi, %, 1 xona |
| `suggested_difficulty` | Taklif (N dan kam bo'lsa bo'sh) |
| `status` | `change` / `ok` / `not_enough` |

Brauzer yoki skriptda shu jadvalni Markdown ko'rinishida chiqarish uchun `kalibrJadval(kalibrla(qatorlar))` (bir xil qoida).

### Qo'llash (yozadi)

Faqat hisobot ko'rib chiqilgandan keyin, muallif:

```sql
select private.apply_difficulty_calibration('<kim tasdiqladi>');   -- o'zgargan savollar sonini qaytaradi
```

Faqat `change` qatorlari yoziladi, har biri `audit_log` ga (`action = 'difficulty_calibration'`, `from`, `to`, `answers`, `p_correct`, N va pog'onalar). Takror ishga tushirish hech narsani o'zgartirmaydi.

## Sinov

- `npm test` (`src/lib/testlar/adaptiv.test.ts`): sun'iy javoblar bilan ikki tarmoq (R&W 22/27 → qiyin, 9/27 → oson; Math 18/22 → qiyin, 4/22 → oson), chegaraga teng natija → oson, chegara yo'q → standart, savol kam → standart, yaroqsiz chegara va natija, kalibrlash pog'onalari va N, SQL standart qiymatlari sozlama bilan bir xilligi. Sinov chegarasi (50) faqat sinov ichida, haqiqiy qiymat emas.
- `npm run db:tekshir` (`supabase/tests/adaptiv_test.sql`): AD01 birinchi javob qoidasi, AD02 N, versiya va draft, AD03 apply va `audit_log`, AD04 huquqlar.

## Keyingi qadam

1. P30 (`sat-mock-imtihon`) merge bo'lgach kichik PR: 1-modul tugaganda `tarmoqTanla` chaqiriladi, 2-modul savollari `tarmoqQiyinliklari()` bo'yicha olinadi, natija sahifasida "adaptive-style" izohi.
2. Muallif chegara qiymatini bergach, `chegara` yoziladi.
3. Migratsiya jonli bazaga faqat muallif ruxsati bilan (`db push --dry-run`, keyin push).
