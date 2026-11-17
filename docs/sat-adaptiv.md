# SAT mock imtihon: adaptive-style 2-modul (P31)

Holat: yadro PR #131 da merge qilingan (2026-11-12). Sozlama qiymatlari tasdiqlangan, `chegara = 60` (PR #141, 2026-11-17 da merge qilingan). Mock imtihonga (P30, PR #144 da merge qilingan) ulash: branch `sat-adaptiv-ulash`, PR #172, pastdagi "P30 ga ulash". Migratsiyalar `20261112163208_adaptiv_kalibr.sql` (2026-11-13), `20261113072953_adaptiv_tarmoq.sql` va `20261113111947_mock_adaptiv.sql` (2026-11-17) jonli bazaga qo'llangan.

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
| `supabase/migrations/20261113072953_adaptiv_tarmoq.sql` | `private.adaptive_branch()`, `private.adaptive_difficulties()`, `private.adaptive_config()`: tarmoq tanlashning server nusxasi |
| `supabase/tests/adaptiv_test.sql` | SQL sinovi AD01–AD06 (`npm run db:tekshir`) |
| `supabase/migrations/20261113111947_mock_adaptiv.sql` | P30 ga ulash: `mock_attempt_questions`, `mock_modules.next_branch*`, `private.mock_questions()`, `private.mock_adapt()`; P30 funksiyalari urinish savollarini o'qiydi |
| `supabase/tests/mock_adaptiv_test.sql` | SQL sinovi MA01–MA05 (`npm run db:tekshir`) |
| `src/lib/sat/mock.ts` | `MockNatija.adaptive`, `tarmoqIzohi()` (natija ekranidagi izoh) |
| `src/lib/sat/mockImtihonMock.ts` | Dev mock: tarmoq shu qoida bilan; `?mock=natija-qiyin`, `?mock=natija-oson` |

## Tarmoq tanlash qoidasi

`tarmoqTanla(natija, bolim, savolSoni)` → `{ tarmoq, sabab, aniqlik }`:

1. `chegara` berilmagan yoki 0–100 oralig'ida emas → `standart`, sabab `chegara-yoq`.
2. Oson yoki qiyin tarmoqda savol `minSavolTarmoq[bolim]` dan kam → `standart`, sabab `savol-kam`.
3. 1-modul natijasi yaroqsiz (0 savol, butun bo'lmagan son, to'g'ri > jami) → `standart`, sabab `natija-yoq`.
4. Aniqlik (to'g'ri / jami × 100) chegaradan **qat'iy katta** → `qiyin`, aks holda (tenglik ham) → `oson`. Taqqoslash butun sonlarda: `to'g'ri × 100 > chegara × jami` (float xatosi tenglikni "ustida" qilmasin, masalan 7/10 × 100 = 70.00000000000001).

Server nusxasi: `private.adaptive_branch(section, correct, total, easy_count, hard_count)` → `(branch, reason, accuracy)`, qoida, tartib va sabab nomlari bir xil; noto'g'ri bo'lim → xato `adaptive_bad_section`. `private.adaptive_difficulties(branch)` = `tarmoqQiyinliklari`. Qiymatlar `private.adaptive_config()` da; `adaptiv.test.ts` ularni `satAdaptiv.ts` bilan solishtiradi.

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

N yoki pog'ona o'zgarsa, ikki joy birga o'zgaradi: `src/data/satAdaptiv.ts` va `_adaptiv_kalibr.sql` dagi standart qiymatlar. Chegara, tarmoq qiyinliklari yoki eng kam savol soni o'zgarsa: `satAdaptiv.ts` va `private.adaptive_config()` (`_adaptiv_tarmoq.sql`). Jonli bazaga qo'llangandan keyin o'zgarish yangi migratsiya bilan. `adaptiv.test.ts` ularning bir xilligini tekshiradi.

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
- `npm run db:tekshir` (`supabase/tests/adaptiv_test.sql`): AD01 birinchi javob qoidasi, AD02 N, versiya va draft, AD03 apply va `audit_log`, AD04 huquqlar, AD05 tarmoq tanlash (JS sinovidagi holatlar: 17/27, 16/27, 14/22, 13/22, aynan 60%, 70 va 7/10, null va 101 chegara, savol kam, yaroqsiz natija, noto'g'ri bo'lim, qiyinliklar), AD06 tarmoq funksiyalari huquqlari.
- `npm run db:tekshir` (`supabase/tests/mock_adaptiv_test.sql`): MA01 R&W 27/27 → qiyin (2-modul faqat 3–5), Math 0/22 → oson (4-modul faqat 1–3), soha soni va R&W soha tartibi, 1-modul bilan kesishma yo'q, forma o'zgarmagan, mashq sessiyasi adaptiv savollar bilan; MA02 retake 16/27 → oson, 17/27 → qiyin; MA03 Math sohasida qiyin savol yetmasa → standart (`savol-kam`), 4-modul forma tartibida; MA04 payload'da tarmoq va qiyinlik yo'q, `mock_attempt_questions`, `private.mock_adapt`, `mock_modules` mijozga yopiq; MA05 `get_mock_result.adaptive`. P30 ning `mock_test.sql` (M01–M10) ham o'zgarishsiz o'tadi.
- `npm test`: `tarmoqIzohi` (faqat oson/qiyin, "IRT" / "same as the real SAT" yo'q), migratsiyada tarmoq `mock_close_module` da va `mock_payload` da tarmoq yo'qligi.
- Brauzer (dev mock `?mock=natija-qiyin`, `?mock=natija-oson`): 390 va 1280, yorug' va qorong'i, axe (wcag2a/aa, best-practice) 0 xato (2026-11-16).

## P30 ga ulash (`sat-adaptiv-ulash`)

Claude qarori, muallif topshirig'i bilan (2026-11-13). Reja (2026-11-12) P30 loyihasini o'qib yozilgan edi; P30 PR #144 da merge bo'lgach kod bilan qayta tekshirildi, farqlari pastda.

### Xatti-harakat spetsifikatsiyasi

1. **Qachon.** R&W 1-modul (1) yoki Math 1-modul (3) yopilganda: "Next module", vaqt tugashi (`mock_tick`) yoki "Stop" (`mock_abandon`). Tarmoq `private.mock_close_module` ichida, `private.mock_adapt` → `private.adaptive_branch`. Brauzer tarmoqqa ta'sir qila olmaydi.
2. **Natija.** To'g'ri = shu modulda to'g'ri baholangan javoblar, jami = modul savollari (bo'sh javob = xato).
3. **Savol soni.** Shu bo'limda, blueprint sohasidagi, `verified`, shu urinishning boshqa modullarida ishlatilmagan savollar, har tarmoq qiyinliklari bo'yicha. Tarmoq oson/qiyin chiqsa-yu biror sohada 2-modulga yetmasa → `standart` (`savol-kam`).
4. **2-modul.** `oson` / `qiyin`: savollar `private.adaptive_difficulties(tarmoq)` bo'yicha qayta tanlanadi, soha soni (27 = 8/7/7/5, 22 = 8/8/3/3) va tartib P30 dagidek (R&W soha guruhi, ichida qiyinlik o'sadi; Math qiyinlik o'sadi), avval foydalanuvchi ko'rmagan savollar, soha ichida ko'nikmalar navbatma-navbat. `standart`: formaning 2-moduli, P30 tartibi o'zgarmaydi.
5. **Saqlash.** Tarmoq, sabab, aniqlik: `mock_modules` ning 1- / 3-modul qatorida (`next_branch`, `next_branch_reason`, `next_branch_accuracy`). Adaptiv savollar: `mock_attempt_questions` (urinish darajasida). Yangi `localStorage` kaliti yo'q.
6. **Ekran.** Imtihon davomida tarmoq ko'rsatilmaydi: `mock_payload` da yo'q, savol soni va vaqt o'zgarmaydi. Natija ekranida, oson/qiyin bo'lsa, "How Module 2 was chosen" bo'limi, har bo'limga bitta inglizcha izoh: "Module 2 was a harder / an easier set of questions, chosen from your Module 1 accuracy (adaptive-style). This is Tayanch's own rule, not the official SAT algorithm. The estimated score counts correct answers only and does not adjust for the harder or easier set." `standart` yoki eski urinish → bo'lim chiqmaydi.
7. **Klaviatura va telefon.** Yangi tugma yoki forma yo'q; bo'lim oddiy `h2` + `p` (`mk-bolim-izoh`), 390px da gorizontal aylantirish yo'q.
8. **Retake.** O'sha forma: 1-modul o'sha, tarmoq va 2-modul har urinishda qayta tanlanadi.

### Rejadan farqlar (sababi bilan)

- **Forma emas, urinish.** Reja "oldindan yig'ilgan 2-modul almashtiriladi" degan edi. `mock_form_questions` ni o'zgartirish retake'ni (o'sha forma) va eski urinishlar natijasini (`get_mock_result` formani o'qiydi) buzardi. Shuning uchun almashtirish `mock_attempt_questions` da, P30 funksiyalari (`mock_payload`, `mock_save`, `mock_close_module`, `mock_scores`, `get_mock_result`, `can_read_question_figure`) `private.mock_questions(attempt)` orqali o'qiydi.
- **Tarmoq 1-/3-modul qatorida.** Reja 2-/4-modul qatorini aytgan edi, lekin u qator faqat modul boshlanganda yaratiladi (`deadline_at not null`). Qarorni bergan modul qatori allaqachon bor.
- **Izohda ball haqida jumla.** Taxminiy ball (200 + 600 × to'g'ri / jami) tarmoqqa qaramaydi: qiyin tarmoqdagi o'quvchi ballda yutqazishi mumkin. Buni yashirmaslik uchun izohga qo'shildi.
- `admin_mock_readiness()` ga qiyinlik bo'yicha son (reja 4-band) bu PR'da qo'shilmadi: alohida kichik ish.

### Ochiq

- Ballni tarmoqqa moslash (masalan qiyin tarmoqqa og'irlik) rasmiy algoritmga o'xshatishni va manbasiz raqamni talab qiladi. Hozircha yo'q, izohda aytilgan.
- Muvozanat sharti (chegara 60 sababi): P30 1-modulni pool'dagi qiyinlik taqsimotiga qarab tuzadi. Jonli bazada savollar kelganda 1-modul qiyinlik taqsimotini tekshirish kerak.
- Jonli Supabase bilan UI sinalmagan: migratsiyalar qo'llangan (2026-11-17), lekin jonli bazada verified savol 36 ta, mock ochilishi uchun kamida 240 kerak.

## Keyingi qadam

1. PR #141 va PR #172 merge qilingan (2026-11-17).
2. Jonli bazaga 2026-11-17 da qo'llangan (muallif ruxsati): `migration list` jonli bazada faqat shu 2 fayl yo'qligini ko'rsatdi, `db push --include-all --skip-vault --dry-run` faqat `20261113072953_adaptiv_tarmoq.sql` va `20261113111947_mock_adaptiv.sql` ni ko'rsatdi, keyin push. Faqat-o'qish tekshiruvi: `mock_attempt_questions` RLS yoqilgan, anon/authenticated uchun yopiq; `mock_modules.next_branch*` va CHECK (validated); `private.mock_adapt`, `private.mock_questions`, `private.adaptive_*` mijozga yopiq; `mock_close_module` `mock_adapt` ni chaqiradi, `mock_payload` da tarmoq yo'q, `get_mock_result` da `adaptive` bor. Jonli bazada mock urinishlari 0, verified savol 36 ta (mock uchun kamida 240 kerak), shuning uchun UI jonli sinalmagan.
3. `admin_mock_readiness()` ga qiyinlik darajalari bo'yicha son (muvozanat shartini kuzatish uchun).
4. Jonli bazada 240+ verified savol bo'lgach: hisob bilan mock oqimi va ikkala tarmoqni saytda sinash.
