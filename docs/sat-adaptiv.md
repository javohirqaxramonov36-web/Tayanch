# SAT mock imtihon: adaptive-style 2-modul (P31)

Holat: yadro PR #131 da merge qilingan (2026-11-12). Sozlama qiymatlari tasdiqlangan, `chegara = 60` (branch `sat-adaptiv-qaror`). Mock imtihonga (P30, branch `sat-mock-imtihon`) ulash alohida kichik PR bo'ladi: P30 hali main'da emas. Migratsiya jonli bazaga **qo'llanmagan**, muallif ruxsati kutilmoqda.

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
4. Aniqlik (to'g'ri / jami × 100) chegaradan **qat'iy katta** → `qiyin`, aks holda (tenglik ham) → `oson`. Taqqoslash butun sonlarda: `to'g'ri × 100 > chegara × jami` (float xatosi tenglikni "ustida" qilmasin, masalan 7/10 × 100 = 70.00000000000001).

Chegara 60 da: R&W 27 savolli 1-modulda 17+ to'g'ri (63,0%) → qiyin, 16 (59,3%) → oson; Math 22 savolda 14+ (63,6%) → qiyin, 13 (59,1%) → oson.

`standart` = P30 dagi oddiy tartib, qiyinlik bo'yicha filtr yo'q (`tarmoqQiyinliklari('standart') === null`). `savolSoni` ni P30 beradi: shu bo'limda har tarmoq qiyinliklariga mos, tasdiqlangan va 1-modulda ishlatilmagan savollar soni. P30 1-modul boshlanishidan oldin `adaptivHolat()` ni chaqirib, adaptivlik bo'lishini oldindan bilishi mumkin.

## Sozlama qiymatlari (tasdiqlangan)

Hammasi: **Claude qarori, muallif topshirig'i bilan (2026-11-12)**. Muallif ochiq qarorlarni Claude'ga topshirgan. Qiymat o'zgarsa, shu jadval va sabab birga yangilanadi.

| Kalit | Qiymat | Sabab |
| --- | --- | --- |
| `chegara` | 60 | 1-modul qiyinlik 1–5 bo'yicha teng aralash bo'lsa (har darajadan ~20%), faqat 1–3 darajadagi savollarni yechgan o'quvchi taxminan 60% oladi. Demak 60% dan yuqori natija 4–5 darajadagi savollarni ham yechganini bildiradi va qiyin tarmoqqa (3–5) o'tishga asos bo'ladi. Aynan 60% (faqat 1–3 ni yechgan) oson tarmoqqa (1–3) tushadi: qoida qat'iy katta. |
| `tarmoqQiyinlik.oson` | 1, 2, 3 | `questions.difficulty` 1–5 shkalasi. 3 (o'rta) ikkala tarmoqda: chegaraga yaqin o'quvchi qaysi tarmoqqa tushsa ham o'z darajasidagi savollarni oladi, tarmoqlar orasida keskin sakrash bo'lmaydi. |
| `tarmoqQiyinlik.qiyin` | 3, 4, 5 | Xuddi shu sabab. |
| `minSavolTarmoq.rw` | 27 | Bitta R&W moduli (54 / 2, CB03): 2-modul takrorsiz to'lishi uchun kamida shuncha savol kerak. Kamida bo'lsa 2-modul standart tartibda. |
| `minSavolTarmoq.math` | 22 | Bitta Math moduli (44 / 2, CB03). |
| `kalibrlash.minJavob` (N) | 30 | 30 javobda to'g'ri javob ulushining 95% ishonch oralig'i eng yomon holatda (ulush 50%) taxminan ±18 band (1,96 × √(0,25 / 30) ≈ 0,18). Bu bitta qiyinlik pog'onasidan (20 band) kichik. Kamroq javobda bitta tasodifiy javob savolni boshqa pog'onaga o'tkazib yuborishi mumkin. Ko'proq N (masalan 100) yangi platformada uzoq kutishni talab qiladi. |
| `kalibrlash.pogonalar` | 80, 60, 40, 20 | To'g'ri javob ulushi ≥ 80% → 1, ≥ 60% → 2, ≥ 40% → 3, ≥ 20% → 4, qolgani → 5. 0–100 ni 5 ta teng (20 band) bo'lakka bo'ladi, `difficulty` 1–5 shkalasiga to'g'ridan-to'g'ri mos; bo'lak kengligi N = 30 dagi ishonch oralig'i bilan mos. |

**Shart (P30 uchun):** chegara 60 ning sababi faqat 1-modul qiyinlik bo'yicha **muvozanatli** bo'lsa to'g'ri: 1-modulda 1, 2, 3, 4, 5 darajadagi savollar taxminan teng ulushda (har biridan ~20%). P30 1-modulni shunday tuzishi kerak. Agar 1-modul boshqacha aralash bo'lsa (masalan o'rta savollar ko'p), chegara qayta ko'rib chiqiladi.

Kodni o'qib tekshirilgan, qiymatlarga e'tiroz yo'q. Bitta tuzatish kiritildi: chegara bilan taqqoslash butun sonlarda (yuqoridagi 4-qoida), aks holda boshqa chegarada (masalan 70) tenglik float xatosi bilan "qiyin" bo'lib qolardi.

Muallif uchun savollar: yopilgan (Claude qarori, muallif topshirig'i bilan, 2026-11-12). Ochiq qolganlari faqat ruxsatga oid: PR merge va migratsiyani jonli bazaga qo'llash.

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

- `npm test` (`src/lib/testlar/adaptiv.test.ts`): standart chegara 60 (R&W 17/27 → qiyin, 16/27 → oson; Math 14/22 → qiyin, 13/22 → oson; `null` hali ham adaptivlikni o'chiradi), sun'iy javoblar bilan ikki tarmoq (R&W 22/27 → qiyin, 9/27 → oson; Math 18/22 → qiyin, 4/22 → oson), chegaraga teng natija → oson, chegara yo'q → standart, savol kam → standart, yaroqsiz chegara va natija, kalibrlash pog'onalari va N, SQL standart qiymatlari sozlama bilan bir xilligi. Boshqa chegaralar (50, 70) faqat sinov ichida.
- `npm run db:tekshir` (`supabase/tests/adaptiv_test.sql`): AD01 birinchi javob qoidasi, AD02 N, versiya va draft, AD03 apply va `audit_log`, AD04 huquqlar.

## Keyingi qadam

1. P30 (`sat-mock-imtihon`) merge bo'lgach kichik PR (branch `sat-adaptiv-ulash`): 1-modul tugaganda `tarmoqTanla` chaqiriladi, 2-modul savollari `tarmoqQiyinliklari()` bo'yicha olinadi, natija sahifasida "adaptive-style" izohi. P30 1-modulni qiyinlik bo'yicha muvozanatli tuzishi kerak (yuqoridagi shart).
2. Migratsiya jonli bazaga faqat muallif ruxsati bilan (`db push --dry-run`, keyin push).
