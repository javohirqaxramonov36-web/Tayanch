# SAT Math va SAT English kurslari rejasi

2026-11-13 · 3-qavat SAT · MVP qarorlari kiritildi

## 1. Mavjud sayt hisoboti

Tekshiruv ishchi nusxa (`HEAD` `3856fa9`) va lokal `origin/main` (`2051789`) bo‘yicha. Lokal `main` `origin/main`dan 45 commit ortda. Ishchi nusxada `docs/SAT_CONTEXT.md` topilmadi. Hisobot `sat-kalkulyator` tarmog‘idagi `73bcc00:docs/SAT_CONTEXT.md`dan o‘qildi va hozirgi farqlar quyida tekshirildi. Hajm va o‘quv tartibi uchun `docs/course-spec/README.md`, `docs/course-spec/math-topics.csv` va `docs/course-spec/english-topics.csv` ishlatildi.

| Band | Topilma va kursga ta’siri | Dalil |
| --- | --- | --- |
| a. Stack va routing | Astro 7 va TypeScript, statik GitHub Pages. SAT sahifalari `src/pages/uz/sat/` ostida. `yol()` `/Tayanch` bazasini qo‘llaydi, URL oxirida `/` bor. Kirish sahifasida test tuzilmasi, boshlash qo‘llanmasida Bluebook diagnostika yo‘li, mashqda test, bank va mock bor. | `package.json`, `astro.config.mjs`, `.github/workflows/deploy.yml`, `src/lib/yol.ts`, `src/pages/uz/sat/index.astro`, `src/pages/uz/sat/qollanma/qayerdan-boshlash/index.astro`, `src/pages/uz/sat/mashq/{test,bank,mock}/index.astro` |
| a. Saqlash va hisob | Bitta Supabase Auth, `tayanch:auth`. Umumiy kirish `/uz/hisob/kirish/`, SAT hisob sahifalari ham bor. Hisobli mashq urinishlari Supabase’da, brauzerdagi eski mashq tarixi `tayanch:sat-javoblar`, dars progressi `tayanch:sat-dars-progress`, sessiya qoralamasi `tayanch:sat-sessiya:v1:<id>`. `user_state` RLS bilan mavjud. Kurs holati uchun tayyor adapter joriy `main`da topilmadi. | `src/lib/hisob.ts`, `src/data/hisobSozlama.ts`, `src/data/satNamuna.ts`, `src/lib/darsSaqlash.ts`, `src/lib/sat/sessiya.ts`, `supabase/migrations/20261108000005_foydalanuvchi.sql` |
| b. Savol modeli | P05 `external_id`, `section: math/rw`, domen/skill, `difficulty: 1–5`, `format: mcq/spr`, `stem`, `passage`, `options`, `answer`, `explanation`, `tags`, `source`, muallif, tasdiq va versiyani saqlaydi. Import MCQ uchun A–D, SPR uchun javoblar ro‘yxatini qabul qiladi. DB `correct.choice` yoki `correct.accepted` ishlatadi. Mijoz savolni javobsiz oladi. | `src/data/savolSxema.ts`, `src/lib/sat/savolTuri.ts`, `scripts/savol/umumiy.mjs`, `supabase/migrations/20261108000003_questions.sql`, `supabase/migrations/20261109120000_questions_p05.sql`, `supabase/migrations/20261108000008_rpc.sql` |
| b. Diagnostika va kurs sxemasi | Ichki diagnostika `sat-diagnostika-json@69cfad7`da. `HEAD` va `origin/main`da sahifa, JSON va `progressStore` topilmadi. Tarmoqdagi model `id`, `section: Math/RW`, domen/skill, `difficulty: easy/medium/hard`, `prompt`, 4 `choices`, A–D `answer`, `explanation_uz`, `reviewed`, `source`, ixtiyoriy `desmos_tip`. 5+5 qoralamaning `reviewed` qiymati `false`. Kurs sxemasi `section` o‘rniga `course`, sonli qiyinlik, `topic_id`, `stage`, `type`, `time_sec`, `passage`, SPR `accepted`, `explanation_en` va Math `check`ni qo‘shadi. Kurs va diagnostikada `explanation_uz` majburiy bo‘lish sharti farq qiladi. | `sat-diagnostika-json:src/lib/diagnostika.ts`, `sat-diagnostika-json:src/data/sat-diagnostic.json`, `sat-diagnostika-json:src/lib/progressStore.ts`, `docs/course-spec/README.md` |
| c. Xatolar va progress | `submit_answer` `attempts`ga bir sessiya/savol uchun bitta urinish yozadi. Xato bo‘lsa `review_queue`ga UUID bo‘yicha yozadi. Mock ham yakunda shu jadvallarga yozadi. `review_overview` orqali daftar, `analytics_summary` orqali urinish va skill kesimidagi progress chiqadi. Eski darslar `javobniYoz()` va brauzer kalitlaridan foydalanadi. Eski dars daftarining savol ro‘yxati `hammaSavollar`dan olinadi. Kurs savollari bitta DB UUID bilan mavjud server oqimiga ulanadi. | `supabase/migrations/20261108000004_mashq.sql`, `supabase/migrations/20261111220000_kun_savoli.sql`, `supabase/migrations/20261113012418_mock_imtihon.sql`, `supabase/migrations/20261111233000_xato_daftari.sql`, `supabase/migrations/20261111120000_analitika.sql`, `src/lib/darsSaqlash.ts`, `src/pages/uz/sat/vosita/{natijalar,takrorlash}/index.astro` |
| d. Tavsiya nuqtasi | Ichki diagnostika tarmog‘ida `hisoblaNatija()` zaif domenlarni hisoblaydi, natija sahifasi `DOMEN_DARSLARI` orqali havola beradi. Tarmoq joriy saytda yo‘q. MVP’da kurs havolasi uchun ishlaydigan nuqtalar mock natijasidagi domen/skill va Natijalar sahifasidagi zaif skill bloki. Bluebook natijasini avtomatik import qilish topilmadi. | `sat-diagnostika-json:src/lib/diagnostika.ts`, `sat-diagnostika-json:src/pages/uz/sat/mashq/diagnostika/index.astro:120`, `src/pages/uz/sat/mashq/mock/imtihon/index.astro:691`, `src/pages/uz/sat/vosita/natijalar/index.astro:445`, `src/data/satYolXaritasi.ts` |
| e. Dizayn va til | DS `--color-accent-*`, sirt, fokus va o‘lcham tokenlari bor. `BolimQobiq`, `SatFokus`, `DarsQolip`, `SavolUslub`, `DesmosHavola` qayta ishlatiladi. `BolimQobiq` SAT uchun `bolimTili('sat')`dan `en` oladi, `SatFokus`da `lang="en"`. Ishchi nusxa va `origin/main` Onest ishlatadi. Manrope topilmadi. Kurs uchun ko‘k DS tokenlari, lokal Manrope va zich sirt rejalangan. Foundation o‘zbekcha parchalari `lang="uz"` bilan. | `DESIGN.md`, `src/styles/{tokens,global}.css`, `src/data/umumiyMatn.ts:10`, `src/layouts/{BolimQobiq,SatFokus}.astro`, `src/components/dars/DarsQolip.astro`, `src/components/sat/{SavolUslub,DesmosHavola}.astro` |
| f. Formula va og‘irlik | KaTeX mavjud. `xavfsizMatn()` `$…$` va `$$…$$` uchun JS va CSS’ni kechiktirib yuklaydi, HTML va MathML beradi. Yangi formula kutubxonasi uchun qo‘shimcha yuk 0. Oldingi lokal `dist/_astro/` o‘lchovi KaTeX JS va CSS uchun jami ≈83 KiB gzip, ishlatilgan WOFF2 shriftlari bundan tashqari. Misol uchun Main-Regular ≈26 KiB, Math-Italic ≈16 KiB. Statik dars formulalarini build vaqtida shu KaTeX bilan render qilish, yakuniy kurs yukini keyin o‘lchash. | `package.json`, `src/lib/sat/xavfsizMatn.ts:22`, `src/lib/sat/xavfsizMatn.ts:112`, `dist/_astro/katex.BYLiqMcl.js`, `dist/_astro/katex.min.CdaDuyQQ.css` |

**Glass auditi.** Lokal `origin/main:DESIGN.md:102` olib tashlashni qayd etadi. Lokal `origin/main`ning `src/` qismida `backdrop-filter` topilmadi. Eski ishchi nusxada quyidagilar bor:

- Asosiy uslublar va tokenlar `src/styles/global.css:95`, `:125`, `:132`, `:139` va `src/styles/tokens.css:339`.
- Menyu `src/components/Menyu.astro:14`, SAT yon paneli va mobil sarlavha `src/components/BolimYon.astro:67`, `:86`, mobil lift `src/components/Lift.astro:25`.
- Fokus sarlavhalari `src/layouts/SatFokus.astro:38`, `src/layouts/IeltsFokus.astro:27`.
- Lokal namuna `src/styles/glassNamuna.css:19`, `:23` va uning importi `src/pages/uz/index.astro:4`. Bino SVG shaffof bezagi `src/components/Bino.astro:94`.

**Noma’lumlar.** Jonli DB va deploy tekshirilmagan. Grid-in bo‘yicha rasmiy yo‘riqnoma tafsilotlari `TODO_VERIFY` (§5). Diagnostika PR’i ochiq va GitHub hozir uni birlashtira olmaydi. Tarmoqdagi 10 savolning hech biri tasdiqlanmagan. MVP undan mustaqil. [PR #42](https://github.com/javohirqaxramonov36-web/Tayanch/pull/42)

**MCQ semantikasi.** Bank va mock ishlatadigan `savolChiz()` variant uchun `button[role="radio"]` chizadi. Eski `DarsQolip`da haqiqiy `<input type="radio">` bor. Kurs oqimi uchun rendererga native radio qo‘shiladi va mavjud chaqiruvchilarning tanlash, variantni chiqarib tashlash hamda fokus xatti-harakati saqlanadi. Dalil `src/lib/sat/savolKorsatkich.ts:173`, `src/components/dars/DarsQolip.astro:180`.

## 2. Kurs tuzilmasi va hajmi

**Kurs → domen → mavzu → Foundation / Core / Advanced → dars va mashq → mavzu mini-testi.** Har bosqichda qisqa nazariya, 2–3 yechilgan namuna va mustaqil mashq. Foundation nazariyasi va javob izohi EN + UZ. Core va Advanced EN. MX1–MX3 CSV bo‘yicha mini-testsiz. Prerequisite tavsiyasi va o‘qish navbati `prerequisites`dan, katalog tartibi `order`dan olinadi.

| Kurs / domen | ID | Mavzu | F / C / A / mini | Jami savol | Daqiqa |
| --- | --- | ---: | --- | ---: | ---: |
| Math · Extra | MX1–MX3 | 3 | 18 / 18 / 14 / 0 | 50 | 156 |
| Math · Algebra | A1–A5 | 5 | 40 / 50 / 40 / 50 | 180 | 385 |
| Math · Advanced Math | M1–M6 | 6 | 48 / 60 / 48 / 60 | 216 | 462 |
| Math · Problem-Solving and Data Analysis | P1–P7 | 7 | 35 / 35 / 28 / 42 | 140 | 392 |
| Math · Geometry and Trigonometry | G1–G4 | 4 | 24 / 24 / 16 / 32 | 96 | 244 |
| **Math jami** | | **25** | **165 / 187 / 146 / 184** | **682** | **1 639** |
| English · Craft and Structure | E1–E3 | 3 | 18 / 24 / 18 / 30 | 90 | 192 |
| English · Information and Ideas | E4–E7 | 4 | 24 / 32 / 24 / 40 | 120 | 256 |
| English · Standard English Conventions | E8–E9 | 2 | 16 / 24 / 16 / 24 | 80 | 154 |
| English · Expression of Ideas | E10–E11 | 2 | 12 / 16 / 12 / 20 | 60 | 128 |
| **English jami** | | **11** | **70 / 96 / 70 / 114** | **350** | **730** |
| **Ikkala kurs** | | **36** | **235 / 283 / 216 / 298** | **1 032** | **2 369** |
| **MVP, Math jami ichida** | **MX3 + A1–A5** | **6** | **48 / 58 / 44 / 50** | **200** | **441** |

Manba `docs/course-spec/{math-topics,english-topics}.csv`. Daqiqalar `est_minutes` yig‘indisi. Yechilgan namunalar savol soniga kirmaydi. `spr_share` CSV’dan olinadigan kontent ulushi, nashr tekshiruvida foizning butun savolga yaxlitlash usuli hujjatlashtiriladi. MVP katalogi `MX3, A1, A2, A3, A4, A5`. A5 prerequisite’lari A1 va A3. English katalogida E3 E4 dan oldin, tavsiya yo‘lida E4 → E3. E6 uchun E4 va Math P3 talab qilinadi.

| Taqqoslash | Rejadagi qoida |
| --- | --- |
| Math rasmiy 4 domen, 19 skill. CSV 22 rasmiy domenga bog‘langan mavzu va 3 ichki modul beradi. | M2/M3/M6 bitta nonlinear functions skilliga, M4/M5 bitta nonlinear equations/systems skilliga bog‘lanadi. MX1–MX3 ichki modul, rasmiy domen yoki skill sifatida hisoblanmaydi. MX savoli uchun muallif mazmuniga mos rasmiy `domain/skill`ni alohida beradi, katalogda `Extra` qoladi. |
| R&W rasmiy 4 domen, 10 skill. CSV 11 mavzu, chunki Command of Evidence ikki turga ajratilgan. | E5/E6 rasmiy bitta skillning Textual/Quantitative turlari. Bankdagi ikkita mavjud teg bilan moslik saqlanadi. |
| `cb_skill`dagi nom farqlari | P3, P4 va P7 da ikki nuqtadan keyingi harf registri farq qiladi. P6 uchun College Board ro‘yxatidagi PSAT izohlari chiqariladi. DB uchun `savolTaksonomiya`dagi kanonik nomga moslash, kurs sarlavhalari CSV’dan. E10 uchun `passage` uyasi original qaydlar ro‘yxatini, E3 uchun juft matnni ifodalaydi. |

SAT domain/skill manbasi 2026-11-13 da tekshirildi. [College Board · Content Domains](https://satsuite.collegeboard.org/higher-ed-professionals/sat-validity/content-domains)

## 3. Sahifalar va ulanish nuqtalari

Quyida taklif qilingan ichki yo‘llar keltirilgan. `K` — `/uz/sat/kurs/matematika/` yoki `/uz/sat/kurs/ingliz-tili/`. Ichki havolalar `yol()` bilan. Kurs katalogida `SAT Math` va `SAT English (Reading & Writing)` yorliqlari ishlatiladi.

| Ekran | Yo‘l | Qayta ishlatiladigan qism |
| --- | --- | --- |
| Kurs va domen | `K`, `K<domen>/` | `BolimQobiq`, `QavatYoli`, `satSahifalar.ts`, `BolimYon`. Kurs boshida domenlar va keyingi mavzu, domenda mavzular ro‘yxati. |
| Mavzu | `K<domen>/<mavzu>/` | Bosqichlar, prerequisite havolalari, progress va mini-test. `getStaticPaths()` faqat e’lon qilinadigan katalogdan. Catch-all yo‘l bilan kolliziya tekshiriladi. |
| Dars | `…/<bosqich>/dars/` | `BolimQobiq` va `DarsQolip`ning mos dars qismlari. `asos`, `asosiy`, `murakkab` sluglari UI’dagi Foundation / Core / Advancedga mos. |
| Mashq | `…/<bosqich>/mashq/` | Kurs sessiyasini boshlash, mavjud `/uz/sat/mashq/sessiya/?id=…` ijrochisi, javobdan keyin izoh. |
| Mini-test | `…/mini-test/` | Shu ijrochi va sessiya modeli. Taymersiz. Javob va izohlar yakunda ochiladi. CSV bo‘yicha MX uchun mini-test yo‘li yo‘q. |
| Natija | `…/natija/?id=…` yoki mavjud ijrochining yakun ekrani | To‘g‘ri/jami, o‘tkazilganlar, sarflangan vaqt, skill kesimi, tavsiya va mavzuga qaytish. 70% yoki yuqori natija mavzuni `Passed` deb belgilaydi. Keyingi mavzu har qanday natijada ochiq. URL’da faqat sessiya ID. |

- SAT kirish va yon paneldan katalogga. `qollanma/qayerdan-boshlash/`dagi tashqi diagnostika yo‘li yonidan kursga. Mock natijasi va Natijalar sahifasidan `section + domain + skill → topic_id` orqali nashrdagi eng mos mavzuga. Bir nechta mavzu mos kelsa, prerequisite bajarilgan birinchi CSV mavzusi, keyin domen sahifasi. Diagnostika merge bo‘lsa, adapter `hisoblaNatija()`dan keyin, `DOMEN_DARSLARI` natija havolalari joyida ulanadi.
- Kurs natijasidan `/uz/sat/vosita/takrorlash/` va `/uz/sat/vosita/natijalar/`ga. Xatolar daftarida kurs mavzusi havolasi server savol UUID/`external_id` orqali, mavjud redo oqimi bilan. Mavjud mock, bank, dars va umumiy natija yo‘llari saqlanadi.
- Katalog va nazariya hamma uchun ochiq. Mashq, mini-test va shaxsiy natija uchun Tayanch hisobi kerak. Server mavjud Free/Pro/Max kvotalarini qo‘llaydi.

## 4. Ma’lumot modeli va migratsiya xavfi

| Qism | Reja |
| --- | --- |
| Muallif fayllari | `~/Tayanch-savollar/content/sat-math/<domain>/<topic>/lesson.md` + `questions.json`. English uchun shu ildizda `content/sat-english/<domain>/<topic>/…`. Mavjud `TAYANCH_SAVOLLAR_DIR` ildizi ishlatiladi. `lesson.md`da 3 bosqichning EN nazariyasi va namunalari, Foundation UZ bloki. |
| Kurs katalogi | CSV va dars metama’lumotidan statik, javobsiz manifest. `topic_id`, kanonik SAT teglari, slug, prerequisite va bosqichlar. `questions.json`dagi `stage` uch dars bosqichidan biri yoki `mini_test`. `stage: "mini_test"` yozuvlari serverdagi mini-test to‘plamini belgilaydi. `time_sec` muallif metama’lumoti sifatida saqlanadi. Natijada sessiyada qayd etilgan sarflangan vaqt ko‘rsatiladi. |
| P05 adapteri | `id → external_id`, `math/english → math/rw`, `prompt → stem`, `type → format`, `choices → options[A–D]`, `explanation_en → explanation`. SPR `accepted → correct.accepted` orqali import qilinadi. `answer`dagi aniq qiymat bilan `accepted` mosligi tekshiriladi. Kurs qiyinligi `1/2/3 → 1/3/5` taklifi bankning easy/medium/hard guruhlariga mos. Barqaror ID va `topic_id/stage/set` bog‘lanishi serverda saqlanadi. `check` faqat muallif quvurida. |
| Kurs sessiyasi | `start_session` tasodifiy skill filtri bilan ishlaydi va aniq to‘plamni olmaydi. Kurs uchun tasdiqlangan to‘plam ID’si orqali server `private.create_session` va kvota funksiyalarini qayta ishlatadi. Mijoz yuborgan UUID ro‘yxati kurs tarkibini belgilamaydi. `practice_sessions.filters`da versiyalangan kurs konteksti. `session_questions`, `attempts` va `review_queue` bitta savol UUID bilan ishlaydi. Mini-test javoblari yakunda atomar yuboriladi. Qayta yuborishda o‘sha yakuniy natija qaytadi va kvota bir marta sarflanadi. Oddiy `submit_answer` mini-test sessiyasini rad etadi. `get_session` va yakun RPC’si egasi va savol nashr holatini tekshiradi, yakungacha javob va izohni bermaydi. |
| Progress va ruxsat | Mashq/mini-test progressi egasiga tegishli kurs sessiyasi va urinishlaridan hisoblanadi. Yakunlangan mini-testda to‘g‘ri javoblar soni barcha savollarning kamida 70% ini tashkil etsa, mavzu o‘tilgan hisoblanadi. O‘tkazilgan savollar maxrajga kiradi va avvalgi o‘tish natijasi keyingi urinishda saqlanadi. Zarur bo‘lsa darsni o‘qib bo‘lish belgisi mavjud RLS `user_state`da mavzu/bosqich bo‘yicha `tayanch:sat-kurs:dars:v1:<topic>:<bosqich>` kalitida saqlanadi. Brauzer qoralamasi mavjud sessiya kalitidan foydalanadi. |
| Ehtimoliy DB qo‘shimchalari | Mavzu/to‘plam a’zoligi uchun server-only manifest yoki `questions.tags`ning versiyalangan teglari. `explanation_uz` uchun ixtiyoriy server maydoni, faqat Foundation javobidan keyin. Kurs konteksti bo‘lmagan eski sessiya avvalgi RPC shaklida ishlaydi. Avval DB va klient shartnomasi, keyin import va katalogni ochish. Mavjud yozuvlarga majburiy backfill kerak bo‘lmasligi ko‘zda tutiladi. |

Xavf `external_id` almashtirilsa tarix ajraladi. Tahrirda UUID saqlanadi, mazmun versiyasi oshiriladi, qayta tasdiq talab qilinadi. Mashq, mock, redo va kun savoli uchun tekshiruvlar kursning yangi savol turlari va ruxsatlari bilan regressiyani qamraydi. Kursga xos yoki pullik savollar umumiy RPC orqali tasodifan berilmasligi serverda tekshiriladi.

## 5. Kontent quvuri va grid-in

1. **Yuklash.** Muallif original Markdown + JSON yozadi, qoralama `reviewed: false`. Loader CSV va `topic_id` orqali yig‘adi. Faqat ochiq nazariya va javobsiz katalog statik build’ga kiradi. Xususiy JSON, `check`, javoblar va pullik kontent server import yo‘lida qoladi. Sabab `scripts/repo-tekshir.mjs:71` original JSON’ni kuzatiladigan ochiq repoda rad etadi.
2. **Validatsiya.** Taklif `npm run kurs:tekshir`, CI’da build/importdan oldin. Sxema, noma’lum maydon, global ID, normallangan savol dublikati, CSV referens/prerequisite sikli, hajm, to‘plam a’zoligi, passage turi, xavfsiz Markdown/rasm alt matni, Foundation UZ va asl manba tekshiriladi. `stage: "mini_test"` soni mavzuning CSV `mini_test` ustuniga teng bo‘lishi shart. MVP’da A1–A5 uchun 10 tadan, MX3 uchun 0 ta. Keyingi domenlarda CSV’dagi 0, 6, 8, 10 yoki 12 ishlatiladi. Bu tasdiqlangan `stage` kengaytmasi `course-spec/README.md`dagi uch bosqichli yozuvdan farq qiladi. MCQ A–D to‘rtta farqli variant va bitta kalit, SPR faqat Math. E3 juft original matn, E6 original grafik/jadval, E10 original qaydlar. Qoralama yoki yetishmagan to‘plam nashr katalogiga kirmaydi.
3. **SymPy.** Math `check` yopiq grammatika bo‘yicha tasdiqlangan amallar, o‘zgaruvchilar va sonlardan SymPy obyektlariga yig‘iladi. Xom `eval`, `sympify` yoki `parse_expr`ga berilmaydi. CI’da versiya pinlanadi, alohida vaqt/resurs chegarasi qo‘yiladi. Aniq javob, SPR qiymatlari va MCQ variantlari tekshiriladi. Tekshiruvda isbotlanmagan yoki bir nechta MCQ javobi chiqqan savol nashrni to‘sadi.
4. **Tasdiq va import.** English uchun mustaqil javobsiz ikkinchi yechim, so‘ng muallif ko‘rigi. `reviewed: true` va inson tasdig‘i, vaqt, mazmun hash’i birga tekshiriladi. Hash kursga xos izoh va savol joylashuvini ham qamraydi. Faqat mos hashli va tasdiqlangan yozuv mavjud P05 importeriga xaritalanadi. Dry-run standart. Tahrir qayta tasdiqni talab qiladi, DB’da yashirilgan savol yashirin qoladi. Nashrda manifest va Supabase’dagi `status = 'verified'` hamda to‘plam/ruxsat birgalikda tekshiriladi.
5. **Grid-in komponenti va tekshiruvchi.** `savolChiz()`dagi SPR matn maydoni va `sprTekshir()` qayta ishlatiladi. Mobil klaviaturada `-`, `/`, `.` yozilishi, Enter, yorliq, xato e’loni va fokus tekshiriladi. Format tekshiruvi va server baholashi alohida. `private.spr_parse`/`spr_equal` aniq ratsional tenglikni allaqachon bajaradi. Kurs qoidalari uchun aniq qiymatdan ruxsat etilgan kesilgan/yaxlitlangan o‘nlik shakllar hosil qilinadi. Har yuborilgan shakl avval belgi va formatdan o‘tadi, so‘ng ratsional tenglik bilan baholanadi. Ko‘p javobli savolda bittasi kiritiladi. Bir xil test vektorlari brauzer va serverda, shuningdek redo yo‘lida ishlaydi.
6. **SPR 1c qarorlari (2026-11-13).** Rasmiy yo‘riqnoma musbat uchun 5, manfiy uchun minus bilan 6 belgi, bitta javob, sig‘adigan kasr yoki o‘nlik, sig‘magan o‘nlikni kesish yoki yaxlitlashni ko‘rsatadi. Aralash son, `%`, `$` va vergul kiritilmaydi. [College Board Bluebook yo‘riqnomasi, 7-bet (CB44)](https://satsuite.collegeboard.org/media/pdf/english-sat-test-directions-bb.pdf#page=7)

   Tayanch `-0`, `.5`, `0.5` va chegaraga sig‘adigan ekvivalent kasrlarni qabul qiladi. `5.` uchun yo‘riqnomada qoida ko‘rsatilmagan. Tayanch kursida `5` yoki `5.0` kiritiladi. Aniq qiymat yozuvidagi ortiqcha nollar belgi chegarasiga kiradi. Yaqin o‘nliklarda mavjud o‘rinlar to‘ldiriladi, yetakchi nol ham o‘rin egallaydi va aynan yarmida kattaroq modulga yaxlitlanadi. Bu tafsilotlar Tayanch tanlovi. Mobil belgilar tugmalari Tayanchga xos. Kurs uchun import `correct.exact`ni serverga uzatadi, avvalgi yozuvlarda `correct.accepted` ishlatiladi.

**Tashqi havolalar**

- Bluebook yuklash `TODO_VERIFY` · repoda CB29 bo‘yicha 2026-11-11 da tekshirilgan, kursga qo‘shishda manzil qayta tekshiriladi. [Bluebook](https://bluebook.collegeboard.org/students/download-bluebook)
- Khan Academy Digital SAT `TODO_VERIFY` · `src/data/manbalar.ts`dagi KA01 tekshiruvida sahifa mazmuni ochilmagan. [Khan Academy](https://www.khanacademy.org/test-prep/digital-sat)
- Desmos MVP’da mavjud `DesmosHavola.astro` orqali yangi tabda. Keyinchalik embed/API imkoniyati ko‘rilsa, API kaliti, litsenziya va tijoriy foydalanish shartlari `TODO_VERIFY`. [Desmos Graphing Calculator](https://www.desmos.com/calculator)

## 6. Ishlar ketma-ketligi

Har qator alohida chat uchun. 1-bosqichning barcha bo‘laklari birgalikda MVP hisoblanadi. Takrorlanuvchi kontent importi uchun har mavzu alohida chatga ajratiladi. Har interaktiv ish avval 5–8 qatorli xatti-harakat spetsifikatsiyasi va muallif tasdig‘idan boshlanadi.

| Bosqich | Natija | Bog‘liqlik |
| --- | --- | --- |
| **1a · MVP poydevori** | MX3 va A1–A5 uchun CSV katalog, xususiy ildizdan JSON/Markdown yuklash, `kurs:tekshir`, SymPy, P05 adapteri va dry-run. | `~/Tayanch-savollar/content/`, CSV va `stage: "mini_test"` shartnomasi. |
| **1b · MVP sessiya** | Serverda kurs to‘plamini boshlash, taymersiz mini-testni yakunlash, sarflangan vaqt, 70% o‘tish belgisi, redo va analytics integratsiyasi. | 1a, Supabase sessiya oqimi va mavjud Free/Pro/Max kvotalari. |
| **1c · MVP javob kiritish** | `savolChiz()`da kurs uchun haqiqiy radio input, SPR format va server baholashi. Mavjud bank/mock klaviatura oqimi ham tekshiriladi. | 1b va SPR bo‘yicha rasmiy solishtirish. |
| **1d · MVP sahifalari** | SAT Math katalogi, Algebra/MX3 mavzulari, uch bosqich, mashq/mini-test va natija yo‘llari. Ko‘k + Manrope, mavjud layoutlar, Desmos havolasi. | 1a–1c va yangilangan, glass olib tashlangan `main`. |
| **1e · MVP nashr va ulanish** | Muallif tasdiqlagan 200 savol va 6 mavzuni yuklash, ichki havolalar, mock/Natijalar tavsiyasi, Xatolar daftari bog‘lanishi, MVP qabul sinovi. | 1d, original kontent, tasdiqlar, tarif va SPR tekshiruvi. |
| **2 · Advanced Math** | M1–M6, har mavzu uchun tekshiruv/import/nashr. | MVP, CSV’dagi A va M prerequisite’lari, tasdiqlangan kontent. |
| **3 · Qolgan Math** | MX1–MX2, P1–P7 va G1–G4 ni alohida domen paketlarida, prerequisite tartibida nashr qilish. | 2, CSV prerequisite’lari, tasdiqlangan kontent. |
| **4a · SAT English renderer** | R&W passage, juft matn, jadval/grafik va qaydlarni mavjud rendererga ulash. | MVP renderer va `course-spec`. |
| **4b · SAT English nashri** | E1–E11 ni mavzuma-mavzu nashr qilish, kurs tavsiyalari va ikki kurs bo‘yicha regressiya. | 4a va E6 uchun P3. Qolgan English prerequisite’lari CSV’dan. |

## 7. Xavflar va qabul qilingan qarorlar

| Xavf | Nazorat |
| --- | --- |
| Ochiq repo va statik build orqali kalitlar yoki javoblar chiqishi | Xususiy muallif fayllari, server importi, javobsiz payload va dist tekshiruvi. `repo:tekshir` saqlanadi. |
| Bir savol bir nechta kurs mavzusiga mos kelishi yoki yangi kurs kontenti umumiy bankda aralashishi | Kurs to‘plami va rasmiy skillni alohida saqlash, server ruxsati, avvalgi yozuvlar uchun regressiya. |
| Ichki diagnostika tarmog‘i hali ulanmagan | MVP tavsiyalari mock va Natijalar oqimiga ulanadi. Diagnostika integratsiyasi keyin, PR birlashtirilib, savollar tasdiqlangach. [PR #42](https://github.com/javohirqaxramonov36-web/Tayanch/pull/42) |
| Ishchi nusxa eski va glass o‘zgarishlari bor | Kod bosqichida yangilangan `main` bazasi. Hozirgi ishchi o‘zgarishlar alohida. Kursning Manrope yukini o‘lchash. |

Muallif qarorlari §3–5 ga kiritildi. Tarif bo‘yicha MVP’da mavjud Free/Pro/Max kvotalari tanlandi. 70% chegarasida mavzu holati yangilanadi, kurs bo‘ylab o‘tish ochiq qoladi.

## 8. Qabul mezonlari

| Bosqich | Tekshiruv ro‘yxati |
| --- | --- |
| 1a | CSV hajmi qayta hisoblanadi. A1–A5 da `mini_test` 10 tadan, MX3 da 0 ta. Yaroqsiz sxema, takror ID/matn, noto‘g‘ri MCQ, mos kelmagan SPR va SymPy xatolari CI’ni yiqitadi. Dry-run yozuv qilmaydi. Qoralama, eskirgan hash, javob va pullik material dist’da chiqmaydi. |
| 1b | Oddiy mashq va taymersiz mini-test yakunlanadi. Natijada sarflangan vaqt chiqadi. 6/10 mavzuga o‘tish belgisini qo‘ymaydi, 7/10 qo‘yadi. Keyingi mavzu ikkala holatda ham ochiq. Qayta yuborishda urinish, navbat va kvota dublikat bo‘lmaydi. Free/Pro/Max mavjud limitlari ishlaydi. Boshqa hisob yoki tasdiqsiz savol rad etiladi. Mini-test javobi yakungacha ochilmaydi. Xato `review_queue`da, urinish analytics’da ko‘rinadi. |
| 1c | Bir xil SPR test vektorlari klient va serverda o‘tadi. Tab/strelka/Enter, haqiqiy radio, ko‘rinadigan fokus, mobil kasr kiritish va ekran o‘quvchi tekshiriladi. Bank, mock va redo oqimlari sinaladi. |
| 1d | Katalog → mavzu → uch bosqich → mashq → mini-test → natija ishlaydi. MX3 da mini-test yo‘li yo‘q. SAT UI `lang="en"`, Foundation UZ bloklari `lang="uz"`. 390 va 1280 px, yorug‘/qorong‘i, kontrast va gorizontal scroll tekshiriladi. Kurs ekranlarida glass yo‘q. |
| 1e | 6 mavzu, 200 tasdiqlangan savol, 5 mini-test. Tavsiyalar faqat nashrdagi yo‘lga boradi. Kirgan/kirmagan, kvota, xato, bo‘sh to‘plam, yashirilgan savol va sessiyani davom ettirish holatlari sinaladi. `repo:tekshir`, kurs validatori, DB regressiya tekshiruvi va `PATH=/opt/homebrew/bin:$PATH npm run build` o‘tadi. |
| 2 | M1–M6, 216 savol va 6 mini-test. CSV prerequisite’lari, kanonik skill xaritasi va MVP regressiyasi sinaladi. |
| 3 | MX1–MX2, P1–P7, G1–G4 qo‘shilib, Math 25 mavzu va 682 savolga yetadi. Extra modullarda mini-test yo‘q. Prerequisite, Desmos havolasi va SPR tekshiruvlari o‘tadi. |
| 4a | Juft passage tartibi, jadvallar semantikasi, grafik alt matni va qaydlar mobil ekranda ham to‘g‘ri renderlanadi. |
| 4b | E1–E11, 350 savol va 11 mini-test. E3 uchun E4, E6 uchun P3 tavsiyalari ishlaydi. Math, English va eski SAT sahifalari bo‘yicha a11y, kontrast va build qayta tekshiriladi. |

Reja tekshiruvi CSV yig‘indilari va manba fayllari bilan bajarildi. Build, brauzer, ekran o‘quvchi va jonli DB sinovlari kod bosqichiga tegishli.
