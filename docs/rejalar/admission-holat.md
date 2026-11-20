# Admission D-seriya: holat

| Qism | Nomi | Status | Sana | Izoh |
|---|---|---|---|---|
| Q0 | Maxfiylik auditi (faqat o'qish) | tugadi | 2026-11-19 | Topilmalar pastda; kod o'zgarmadi |
| Q1 | Ma'lumot sxemasi va validator | tugadi | 2026-11-20 | Sxema, 2 skript, `Fakt.astro`, 10 sinov; haqiqiy fakt yo'q |
| Q2 | Davlatlarni taqqoslash sahifasi | tugadi | 2026-11-20 | `/uz/top-admission/davlatlar/`; filtr, saralash, taqqoslash; SOXTA fixture bilan brauzerda sinaldi |
| Q3 | Grantlar katalogi sahifasi | tugadi | 2026-11-20 | `/uz/top-admission/grantlar/`; filtr, deadline saralash, Türkiye Bursları havolasi; SOXTA fixture bilan brauzerda sinaldi |
| Q4 | "Menga mos universitet" filtri | kutilmoqda | | |
| Q5 | Ariza zinapoyasi → XP | kutilmoqda | | |
| Q6 | Kontent: 3 chuqur davlat + valyuta kurslari | kutilmoqda | | |
| Q7 | Kontent: 12 qisqa davlat kartasi | kutilmoqda | | |
| Q8 | Kontent: davlat grantlari | kutilmoqda | | |
| Q9 | Kontent: 30 universitet | kutilmoqda | | |
| Q10 | Yakuniy tekshiruv va hisobot | kutilmoqda | | |

## Sozlamalar
- Eskirish muddati: "muddatli" faktlar 60 kun, "barqaror" faktlar 180 kun. (180 kun muallif tomonidan 2026-11-20 da tasdiqlangan.)
- Viza yashash summasi (`narx.viza_yashash_summasi`): rasmiy sahifada oylik (yoki boshqa davr uchun) yozilgan bo'lsa, `qiymat` yillikka aylantiriladi (oylik × 12). `manba_iborasi` rasmiy iboraning o'zi (oylik summa bilan) qoladi, hisob (masalan "1 334 GBP/oy × 12") holat faylidagi kontent eslatmasiga yoziladi. Muallif qarori, 2026-11-20.

## Repo qoidalari bilan moslashtirish (BOSHQARUVCHI, 2026-11-19)
Reja matni o'zgartirilmagan. Quyidagi joylarda reja repo'ning amaldagi qoidalari (`CLAUDE.md`, `DESIGN.md`) bilan farq qiladi; qism agentlari repo qoidasiga amal qiladi:
- **Joy:** ish `main` checkout'da emas, alohida worktree'da: `Tayanch-SAT prep/.claude/worktrees/admission-d` (branch `admission-d`, asos `origin/main` 8b803c5). Sabab: bir papkada 4 akkaunt ishlaydi, `main` checkout'da branch almashtirish taqiqlangan. "davom" bo'lsa, shu worktree'ga o't.
- **Dizayn:** rejadagi "shrift Manrope, glassmorphism yo'q" eski. Amaldagi manba `DESIGN.md` va `src/styles/tokens.css` (matn shrifti Onest, Top Admission qavat tokenlari `adm-*`, sirtlar "Sirtlar" bo'limi bo'yicha). Xom rang/o'lcham yozilmaydi.
- **Yo'llar:** Top Admission sahifalari `src/pages/uz/top-admission/` da (`/uz/top-admission/...`), rejadagi `.../admission/...` emas. Ichki havola faqat `yol()` orqali.
- **"Header ochiladigan ro'yxati":** saytda qavatlar menyusi `QavatMenyu` faqat `/uz/` da, bo'lim ichida yon panel (`BolimYon`, `bolimlar.ts`). Agent avval o'rganadi; tuzilish rejadagidan farq qilsa, rejaning o'zi aytganidek tegmaydi va shu faylga yozadi (yoki `bolimlar.ts` dagi Top Admission bandlariga qo'shish mos bo'lsa, shuni qiladi va yozadi).
- **Faktlar:** `src/data/manbalar.ts` mavjud manba konventsiyasi; Q1 sxemasi u bilan to'qnashmasligi kerak.
- **band.md:** `~/Tayanch/00-ai/band.md` da qator bor; seriya tugaganda "Tugagan" ga ko'chiriladi.

## Q1 natijasi (2026-11-20)
Astro 7.4.5 content layer (node_modules'dan tekshirildi): config `src/content.config.ts`, loader `glob` (`astro/loaders`), zod v4 (`astro/zod`), havola `reference` (`astro:content`). Glob loader `slug` maydonini entry id sifatida oladi.

O'zgargan / yangi fayllar:
- `src/content.config.ts`: kolleksiyalar `davlatlar`, `grantlar`, `universitetlar` (`src/data/topAdmission/<kolleksiya>/<slug>.json`, hozir bo'sh, `.gitkeep`).
- `src/lib/topAdmission/sxema.ts`: `faktSxema`, `davlatSxema`, `grantSxema`, `universitetSxema`, `kurslarSxema` (strict: noma'lum maydon ham xato). Sxema build'da (`reference`) va node'da (`oddiyRef`) bir xil.
- `src/lib/topAdmission/fakt.ts`: `ESKIRISH_KUNLARI` (yagona konstanta: muddatli 60, barqaror 180), `faktKorinadimi`, `faktEskirganmi` (chegara: 60/180-kun hali eskirmagan, 61/181-kundan eskirgan; bugun Toshkent bo'yicha), `faktQiymatMatni`, `sanaMatni`, `kurslarBormi`, `usdga`.
- `src/data/topAdmission/kurslar.json`: bo'sh shablon (`kurslar`: valyuta kodi -> 1 birlik necha USD). Bo'sh bo'lsa `kurslarBormi` false, `usdga` null.
- `src/components/topAdmission/Fakt.astro`: qiymat + "Manba" + tekshirilgan sana; eskirgan bo'lsa "qayta tekshirilmoqda" belgisi; ko'rinmasa "Ma'lumot tekshirilmoqda". Props: `fakt`, `birlik?`, `format?`.
- `scripts/malumot/umumiy.ts`, `tekshir.ts`, `tasdiq.ts`; `package.json`: `malumot:tekshir`, `malumot:tasdiq`, `npm test` ga `src/lib/topAdmission/testlar/*.test.ts`.
- `docs/tekshiruv/tasdiq-royxati.md` (avtomatik, hozir 0 ta). DIQQAT: `.gitignore:16` (`tekshiruv/`) bu papkani e'tiborsiz qoldiradi, fayl commit qilinmaydi, faqat lokal turadi (muallif o'z Mac'ida `npm run malumot:tasdiq` dan keyin ochadi). `.gitignore` o'zgartirilmadi.
- Sinov: `src/lib/topAdmission/testlar/fakt.test.ts`, SOXTA fixture'lar `tests/fixtures/topAdmission/davlatlar/` (haqiqiy kolleksiyaga kirmaydi).

Sxemaga rejadan tashqari qo'shilganlar (keyingi qismlar uchun): `grantlar.toliq_qoplaydi` (ixtiyoriy ha/yo'q fakt, Q3 "to'liq qoplaydi" filtri faqat shu tasdiqlangan bo'lsa); `kurslar.json` da `manba_nomi`, `izoh`. `valyuta` ISO kodi oddiy maydon (fakt emas). `daraja`, `turi`, `nom`, `rasmiy_havola` oddiy maydon. `deadline` matn fakt: qiymat YYYY-MM-DD bo'lsa saralanadi (Q3/Q4 shunga tayanadi).

Sinov natijasi:
- `node --test src/lib/topAdmission/testlar/*.test.ts`: 10/10 o'tdi. Fixture 1 (to'g'ri) o'tadi; fixture 2 (source_url'siz qoralama) bitta xato beradi `narx.kontrakt_yillik.source_url`; fixture 3 ("topilmadi") o'tadi.
- Build xatosi qo'lda sinaldi (fixture 2 vaqtincha `src/data/topAdmission/davlatlar/` ga qo'yildi, keyin o'chirildi): build exit 1, xabar `[InvalidContentEntryDataError] davlatlar → sinoviya-manbasiz ... narx.kontrakt_yillik.source_url: holat "qoralama" bo'lsa majburiy` va fayl yo'li bilan.
- `npm run malumot:tekshir -- --papka tests/fixtures/topAdmission`: 1 sxema xatosi, 3 eskirgan, 1 "topilmadi" (fayl | maydon | sana | kun); haqiqiy papkada 0 hujjat, exit 0. Sxema xatosi bo'lsa exit 1, eskirgan/"topilmadi" exit 0; build'ga ulanmagan.
- `npm run build` o'tdi (bo'sh kolleksiya uchun 3 ta glob-loader ogohlantirishi kutilgan). `npm test` 341/341. `npm run check`: faqat 4 ta eski xato. `npm run repo:tekshir`: muammo yo'q.
- Sinalmagan: `Fakt.astro` hali hech bir sahifada ishlatilmagan (Q2 da birinchi marta ko'rinadi; brauzer, 375/1280, qorong'i mavzu, kontrast o'sha yerda tekshiriladi). Eskirish build paytida hisoblanadi (statik sayt), sayt qayta qurilmasa belgi yangilanmaydi.

## Q2 natijasi (2026-11-20)
Sahifa: `/uz/top-admission/davlatlar/` (`src/pages/uz/top-admission/davlatlar/index.astro`, `BolimQobiq`, turi "vosita", holat "qoralama").

O'zgargan / yangi fayllar:
- `src/pages/uz/top-admission/davlatlar/index.astro`: kartalar (5 mezon, har fakt `Fakt.astro` orqali), filtr chiplari (4 ta), saralash (nomi / taxminiy yillik xarajat), taqqoslash (2–3 davlat; >760px jadval, <=760px ketma-ket kartalar), bo'sh holat, URL holati.
- `src/lib/topAdmission/davlatTaqqos.ts`: sof mantiq (filtr belgilari, taxminiy USD, saralash, taqqoslash tanlovi, URL `?f=&s=&t=` o'qish/yozish). Sahifa build'da ham, brauzer skriptida ham shuni ishlatadi.
- `src/lib/topAdmission/testlar/davlatTaqqos.test.ts`: 8 sinov (SOXTA ma'lumot), `npm test` ga glob orqali kiradi.
- `src/data/topAdmissionSahifalar.ts`: yon panel "Vositalar" guruhiga "Davlatlarni taqqoslash" bandi.

Qarorlar (keyingi qismlar uchun):
- "Header ochiladigan ro'yxati": bo'limda header menyusi yo'q (`QavatMenyu` faqat `/uz/` da). Havola Top Admission yon paneliga (`taGuruhlar`, "Vositalar") qo'shildi. Q3 ("Grantlar") va Q4 ("Menga mos universitet") ham shu faylga qo'shsin.
- Yo'l: `/uz/top-admission/davlatlar/` (rejadagi misol bo'yicha, `vosita/` ostida emas). Q3 uchun tavsiya: `/uz/top-admission/grantlar/`, Q4: `/uz/top-admission/universitetlar/`.
- Filtr, saralash va taxminiy narx FAQAT tasdiqlangan faktdan. Qoralama fakt hech qayerda ko'rinmaydi va filtrga ta'sir qilmaydi (SOXTA fixture bilan tekshirildi: qoralama qiymatlar va qoralama grant HTML'da yo'q).
- "Davlat granti bor": davlatning `davlat_grantlari` ichida `turi: "davlat"` va `nimani_qoplaydi` fakti tasdiqlangan grant bo'lsa. Kartada grant nomi `rasmiy_havola` ga havola (Q3 sahifasi bo'lgach, unga havola qo'shish mumkin).
- `grant.izoh` (oddiy matn, fakt emas) sahifada KO'RSATILMAYDI: manbasiz matn chiqmasin.
- "O'qish paytida ishlash mumkin" konventsiyasi (Q6/Q7 kontent agentlari uchun): `ishlash.oqish_paytida.qiymat` mumkin emas bo'lsa `false` (yoki 0 / "yo'q"); mumkin bo'lsa `true`, son (haftasiga soat) yoki qisqa matn.
- Taxminiy yillik xarajat = `kontrakt_yillik` + `viza_yashash_summasi` (ikkalasi tasdiqlangan, bir xil `valyuta`), `usdga` bilan, butun songa yaxlitlanadi. `kurslar.json` bo'sh bo'lsa narx saralash tugmasi chiqmaydi va "kurs ma'lumoti yo'q" yoziladi; narxi yo'q davlat oxirida va "ma'lumot tekshirilmoqda" belgisi bilan.
- Standart tartib alifbo (reyting yo'q). `chuqur_qollanma_havola` `/` bilan boshlansa `yol()` orqali, `https://` bo'lsa o'zicha; bo'lmasa "chuqur qo'llanma tez orada" yorlig'i.
- Bo'sh holat: kolleksiyada birorta tasdiqlangan fakt (yoki ko'rinadigan grant) bo'lmasa filtr/taqqoslash o'rniga "Ma'lumotlar rasmiy manbada tekshirilmoqda" kartasi, davlat nomlari ro'yxati (bo'lsa) va Topshirish yo'li / Platformalar havolalari. Hozirgi saytda shu holat.
- Brauzerda hech narsa saqlanmaydi (localStorage yo'q); holat faqat URL'da.

Sinov:
- `npm test` 349/349 (yangi 8 ta). `npm run check`: faqat 4 ta eski xato. `npm run build` o'tdi. `npm run repo:tekshir`: muammo yo'q.
- Vaqtincha SOXTA fixture (4 davlat "Sinoviya A–D", 2 grant, kurs EUR; scratchpad'da, commit qilinmagan, build'dan keyin o'chirildi) bilan build va brauzer (lokal statik server, Claude Browser paneli): filtr ("Ingliz tilida dastur bor" -> 4 tadan 2), narx saralashi (B 12 100, A 35 000, narxsizlar oxirida), 4-davlatni qo'shishda xabar va `aria-disabled`, URL'dan holatni tiklash (`?t=...&s=narx`), jadval (1280px, qorong'i mavzu) va telefon kartalari (375px, yorug' mavzu, gorizontal scroll yo'q), eskirgan fakt yonida "qayta tekshirilmoqda", bo'sh holat (375px) ko'rildi.
- Sinalmagan: axe/VoiceOver, haqiqiy telefon, JS'siz ko'rinish brauzerda (kod bo'yicha: kartalar ko'rinadi, filtr va taqqoslash yashirin), bo'sh holat 1280px va qorong'ida, `prefers-reduced-motion`. Kontrast alohida o'lchanmadi (faqat mavjud DS tokenlari ishlatilgan).

## Q3 natijasi (2026-11-20)
Sahifa: `/uz/top-admission/grantlar/` (`src/pages/uz/top-admission/grantlar/index.astro`, `BolimQobiq`, turi "vosita", holat "qoralama"), Q2 uslubida (`gk-*` klasslar).

O'zgargan / yangi fayllar:
- `src/pages/uz/top-admission/grantlar/index.astro`: grant kartalari (nom, turi, daraja, davlat [+ universitet nomi bo'lsa], nimani qoplaydi, to'liq qoplaydi, deadline: har fakt `Fakt.astro` orqali; "Rasmiy sahifa" havolasi), filtr chiplari (Turi, Davlat, Daraja, Qoplash), deadline saralash, "Bu yilgi muddat o'tgan" belgisi, doimiy ogohlantirish "Grant shartlari har yili o'zgaradi. Topshirishdan oldin rasmiy sahifani tekshiring.", bo'sh holat.
- `src/lib/topAdmission/grantKatalog.ts`: sof mantiq (ko'rinish, to'liq qoplash, deadline sanasi, muddat holati, saralash, filtr, URL `?tur=&d=&dr=&toliq=`, ichki sahifalar).
- `src/lib/topAdmission/testlar/grantKatalog.test.ts`: 7 sinov (SOXTA ma'lumot).
- `src/data/topAdmissionSahifalar.ts`: yon panel "Vositalar" guruhiga "Grantlar" bandi.

Qarorlar (keyingi qismlar uchun):
- Grant katalogda ko'rinadi, agar `nimani_qoplaydi` fakti tasdiqlangan bo'lsa (Q2 qoidasi bilan bir xil, ikkala tur uchun). Qolganlari umuman chiqmaydi. `nom`, `rasmiy_havola`, `turi`, `daraja` oddiy maydon sifatida ko'rinadi.
- "To'liq qoplaydi" filtri va belgisi faqat `toliq_qoplaydi` tasdiqlangan va `qiymat: true` bo'lsa. Bunday grant bo'lmasa chip chiqmaydi (izoh matni turadi). Kontent agentlari (Q8, Q9): `toliq_qoplaydi` ni faqat rasmiy sahifada aniq yozilgan bo'lsa qo'ying.
- Filtr: guruh ichida "yoki", guruhlar orasida "va". Daraja `ikkalasi` ham Bakalavr, ham Magistr filtriga mos. Davlat chiplari faqat ko'rinadigan granti bor davlatlardan (1 ta bo'lsa guruh chiqmaydi), nom `davlatlar.nom_uz` dan.
- Tartib: tasdiqlangan YYYY-MM-DD deadline bo'yicha eng yaqini birinchi (bugun ham "o'tmagan"); keyin sanasi noma'lum yoki matnli/tasdiqlanmagan deadline (alifbo); oxirida muddati o'tganlar (eng yaqinda o'tgani birinchi) "Bu yilgi muddat o'tgan" belgisi bilan. Muddat build paytida hisoblanadi va brauzerda `toshkentBugun()` bilan qayta hisoblanadi.
- Türkiye Bursları: sahifa `main` da bor (`src/pages/uz/top-admission/turkiye-burslari/index.astro`, `origin/main` da tekshirildi). Grant slug'i `turkiye-burslari` yoki turi "davlat" va `davlat: "turkiya"` bo'lgan grant kartasida "Türkiye Bursları bo'yicha qo'llanma" havolasi (`ICHKI_SAHIFALAR`, `grantKatalog.ts`). Kontent agentlari (Q7, Q8): Turkiya davlat slug'i `turkiya`, Türkiye Bursları grant slug'i `turkiye-burslari` bo'lsin. Bo'sh holatda ham Türkiye Bursları tugmasi bor.
- Brauzerda hech narsa saqlanmaydi; holat faqat URL'da.

Sinov:
- `npm test` 356/356 (yangi 7 ta). `npm run check`: faqat 4 ta eski xato. `npm run build` o'tdi. `npm run repo:tekshir`: muammo yo'q.
- Vaqtincha SOXTA fixture (2 davlat, 6 grant: yaqin, uzoq + to'liq, matnli deadline, o'tgan, qoralama `nimani_qoplaydi`, qoralama `toliq_qoplaydi`; commit qilinmagan, build'dan keyin o'chirildi) bilan build va brauzer (lokal statik server, Claude Browser paneli): tartib yaqin → uzoq → noma'lum → o'tgan; qoralama grant HTML'da yo'q; qoralama `toliq_qoplaydi` to'liq deb hisoblanmadi; "To'liq qoplaydi" filtri 1 ta; Magistr + Universitet filtri; mos grant yo'q holati va "Filtrlarni tozalash"; URL'dan holatni tiklash (`?tur=davlat&dr=bakalavr`); Türkiye Bursları havolasi; yon panel bandi. 1280px yorug' va 375px qorong'i mavzu ko'rildi, gorizontal scroll yo'q. Bo'sh holat 375px qorong'ida ko'rildi.
- Sinalmagan: axe/VoiceOver, haqiqiy telefon, JS'siz ko'rinish brauzerda (kod bo'yicha: kartalar build tartibida, filtr yashirin), bo'sh holat 1280px, `prefers-reduced-motion`. Kontrast alohida o'lchanmadi (faqat mavjud DS tokenlari).

## Topilmalar (Q0)
Audit 2026-11-19, `admission-d` (asos 8b803c5), faqat repo kodi o'qildi. Jonli Supabase (deploy qilingan versiya, sozlamalar, haqiqiy bucket'lar) va tashqi provayderlar shartlari tekshirilmagan. Qisqartmalar: `F` = `supabase/functions/`, `M` = `supabase/migrations/`.

| # | Savol | Javob | Manba (fayl:qator) |
|---|---|---|---|
| 1 | Ovoz (audio) bazaga, Storage'ga yoki boshqa joyga saqlanadimi? | Repo kodida saqlanmaydi. Ovoz faqat `suhbatdosh` da ishlatiladi: brauzer `MediaRecorder` bilan yozib, xotirada WAV base64 qilib yuboradi (localStorage yo'q). Edge Function uni faqat xotirada tekshirib transkripsiyaga beradi; bazaga yoki Storage'ga yozuv (insert/upload) yo'q, logga ham yozilmaydi. Javob ovozi (TTS) ham faqat javobda brauzerga qaytadi. Migratsiyalardagi bucket'lar faqat ikkita: `question-figures` (savol rasmlari) va `suhbatdosh-bilim` (umumiy bilim .md fayllari, faqat service role o'qiydi); audio bucket yo'q. Kim o'qiy oladi / muddat: saqlanmagani uchun qo'llanmaydi. Eslatma: `suhbatdosh` hozir faqat bitta hisobga (`SUHBATDOSH_EGA_ID`, muallif) ochiq. | `src/lib/suhbatdosh.ts:165-186`; `F/suhbatdosh/handler.ts:82-106`; `F/suhbatdosh/index.ts:55-61, 82-96`; `M/20261108000009_storage.sql:8-15`; `M/20261115190000_suhbatdosh_bilim.sql:1-4`; egasi tekshiruvi `F/suhbatdosh/handler.ts:76` |
| 2 | Ovoz tashqi API'ga yuboriladimi? Qaysi provayder? | Ha. Google Gemini API (`generativelanguage.googleapis.com`): transkripsiya `gemini-3.5-flash-lite` (audio/wav inlineData), javob matni ham shu model, ovozli javob `gemini-3.8-flash-lite-tts`. Kalit `SUHBATDOSH_GEMINI_FREE_KEY` (nomidan bepul tarif ko'rinadi). Google bu ma'lumotni qancha saqlashi va model o'qitishda ishlatishi: repo'da topilmadi. Matnli AI (`ai-tutor`, `ielts-writing-baho`) Anthropic SDK orqali Claude'ga boradi (ovoz emas). | `F/suhbatdosh/index.ts:10-13, 25-31, 55-61, 82-89`; `F/_shared/anthropic.ts:3`; `F/ai-tutor/index.ts:4,11`; `F/ielts-writing-baho/index.ts:4,11` |
| 3 | Insho yoki xabar MATNI bazada saqlanadimi? Qaysi jadval/ustun? | Ha (Suhbatdosh'dan tashqari). AI Tutor: `public.ai_messages.content` (foydalanuvchi matni email/telefon tozalangandan keyin va AI javobi), suhbat sarlavhasi `public.ai_conversations.title`. IELTS Writing: `public.ielts_writing_results.prompt` va `.essay` (tozalangan), `essay_hash`, `result` (baho). `private.ai_usage` matnsiz (token, narx), faqat `input_hash` 1 soat turadi. Suhbatdosh savol/javob matnini saqlamaydi. Ikkala jadval RLS: egasi faqat o'qiydi va o'chiradi, yozish faqat service role RPC orqali. | `M/20261112173842_ai_tutor.sql:40-58, 78-123, 374-402`; `F/ai-tutor/handler.ts:127, 256-265`; `M/20261119120000_ielts_writing_baho.sql:29-57, 194-196`; `F/ielts-writing-baho/handler.ts:116-125, 230-241`; `F/_shared/aiTozalash.ts:5-13, 31` |
| 4 | Avtomatik o'chirish (retention, cron, TTL) bormi? | AI matnlari uchun topilmadi: `ai_messages`, `ai_conversations`, `ielts_writing_results` hisob ochiq turguncha qoladi. Yagona avtomatik tozalash: `private.ai_usage.input_hash` 1 soatdan keyin `null` (har `ai_begin` chaqiruvida). Repo'dagi yagona cron `obuna-muddati` (obunalar uchun, AI emas). IELTS 24 soatlik oyna faqat takroriy natijani qaytarish uchun, o'chirish emas. | `M/20261112173842_ai_tutor.sql:49-50, 216-217`; `M/20261112000000_obuna_holati.sql:42-43`; `M/20261119120000_ielts_writing_baho.sql:107-112`; `docs/maxfiylik-jadvali.md:29` ("Hisob ochiq turguncha") |
| 5 | Foydalanuvchi o'z ma'lumotini yoki akkauntini o'chira oladimi? | Ha. (a) Butun hisob: `/uz/hisob/profil/` → Edge Function `hisob-malumot` `{"amal":"ochirish"}`: email bilan tasdiq, oxirgi 10 daqiqada qayta kirish, jarayondagi to'lov yo'qligi, audit yozuvi, so'ng `auth.admin.deleteUser`; `on delete cascade` bilan AI jadvallari ham o'chadi. Qoladiganlar: `payments` (`user_id` null), `private.ai_usage` (`user_id` null, matnsiz). (b) Alohida: AI Tutor'da bitta suhbat yoki hammasini o'chirish tugmasi; IELTS Writing natijalarida har natija uchun "O'chirish" tugmasi (RLS delete policy). (c) Eksport: `{"amal":"eksport"}` `ai_conversations`, `ai_messages` ni beradi, lekin `ielts_writing_results` eksport ro'yxatida YO'Q. | `F/hisob-malumot/handler.ts:1-16, 97-118`; `F/hisob-malumot/index.ts:13-50, 126`; `M/20261112090000_hisob_ochirish_tolov.sql:1-19`; `M/20261112173842_ai_tutor.sql:42, 80, 94, 115-123`; `M/20261119120000_ielts_writing_baho.sql:31, 55-57`; `src/pages/uz/hisob/profil/index.astro:68`; `src/pages/uz/sat/vosita/ai-tutor/index.astro:386, 414`; `src/pages/uz/ielts/mashq/writing/index.astro:281-287` |

Qo'shimcha kuzatuvlar (tuzatilmagan, qaror muallifda):
- `ielts_writing_results` `hisob-malumot` eksport ro'yxatida va `docs/maxfiylik-jadvali.md` jadvalida yo'q (`F/hisob-malumot/index.ts:13-15` izohi yangi jadvalni ikkala joyga qo'shishni talab qiladi).
- `suhbatdosh` (Gemini, ovoz) `docs/maxfiylik-jadvali.md` va Maxfiylik sahifasida tilga olinmagan (grep: "Gemini", "suhbatdosh", "ovoz" topilmadi). Hozir faqat muallif hisobiga ochiq, lekin ochilsa siyosat matni kerak bo'ladi.
- Anthropic va Google'ning so'rovlarni saqlash muddati va model o'qitishda ishlatishi, hamda chet elga uzatish (LX02, LX04) `docs/maxfiylik-jadvali.md:32-33` da "hali tasdiqlanmagan" deb turibdi.

## Keyingi chat uchun eslatma
- Q3 tugadi ("Q3 natijasi" bo'limi). Keyingi: Q4. Uslub `grantlar/index.astro` (`gk-*`) va `davlatlar/index.astro` (`dt-*`); URL holati namunasi `grantKatalog.ts`; yon panelga "Menga mos universitet" bandini `src/data/topAdmissionSahifalar.ts` ga qo'sh. Deadline saralash/muddat uchun `deadlineSanasi`, `muddatHolati` (`grantKatalog.ts`) qayta ishlatilishi mumkin.
- Q0 tugadi (faqat `docs/rejalar/admission-holat.md` o'zgardi).
- Q2 tugadi ("Q2 natijasi" bo'limi). Keyingi: Q3. Grantlar sahifasi Q2 uslubida: `davlatlar/index.astro` dagi `dt-*` klasslar va `davlatTaqqos.ts` dagi URL holati namunasi; yon panel bandi `src/data/topAdmissionSahifalar.ts`.
- Q1 tugadi. Q2 uchun eslatma: Faktni `src/components/topAdmission/Fakt.astro` bilan ko'rsat; ma'lumotni `getCollection('davlatlar')` bilan ol; narx saralashda `usdga` + `kurslarBormi` (kurs bo'lmasa saralash o'chadi); kurs fayli `src/data/topAdmission/kurslar.json` ni `kurslarSxema.parse` bilan o'qi. Bo'sh kolleksiya hozir normal holat.

## Muallif uchun savollar
- Q3: Grant kartasi faqat `nimani_qoplaydi` tasdiqlangan bo'lsa chiqadi (deadline tekshirilmagan bo'lsa ham karta chiqadi, deadline o'rnida "Ma'lumot tekshirilmoqda"). Shu qoida ma'qulmi yoki deadline ham tasdiqlangan bo'lishi shartmi?
- Q3: Davlatlarni taqqoslash sahifasidagi grant nomi hozir rasmiy sahifaga olib boradi. Uni Grantlar katalogiga (filtr bilan, `?d=<davlat>`) yo'naltirish kerakmi? (Q2 fayli, Q3 doirasidan tashqari, tegilmadi.)
- Q2: `viza_yashash_summasi` yillik summa deb qabul qilindi (taxminiy xarajat = kontrakt + shu summa). Rasmiy sahifada oylik yoki boshqa davr uchun yozilgan bo'lsa (masalan, 9 oylik), kontent agenti qanday yozsin: aynan rasmiy qiymat (davr izohi bilan, saralashdan chiqariladi) yoki yillikka hisoblanadimi?
- Q2: Header menyusi bo'limda yo'q, shuning uchun "Davlatlarni taqqoslash" Top Admission yon paneliga ("Vositalar") qo'shildi. Bosh sahifadagi `QavatMenyu` ga ham qo'shilsinmi?
- Q1: `docs/tekshiruv/` `.gitignore` da (`tekshiruv/` qoidasi). Tasdiq ro'yxati lokal qolsinmi (hozirgi holat) yoki repoga kirishi uchun `.gitignore` ga istisno qo'shilsinmi?
- Q1: "barqaror" faktlar uchun 180 kun tasdiqlanadimi? (Bitta joyda: `ESKIRISH_KUNLARI`, `src/lib/topAdmission/fakt.ts`.)
- Q0: `ielts_writing_results` ni hisob eksportiga va `docs/maxfiylik-jadvali.md` ga qo'shish kerakmi? (Admission seriyasidan tashqari ish, alohida branch.)
- Q0: AI matnlari (AI Tutor, IELTS Writing) uchun saqlash muddati (masalan, N oydan keyin avtomatik o'chirish) kerakmi yoki "hisob ochiq turguncha" qoladimi? Huquqchi bilan maslahatda ko'riladi.
- Q0: Suhbatdosh boshqa foydalanuvchilarga ochilishidan oldin Gemini (bepul kalit) shartlari va Maxfiylik sahifasi matni tekshiriladimi?
