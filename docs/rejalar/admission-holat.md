# Admission D-seriya: holat

| Qism | Nomi | Status | Sana | Izoh |
|---|---|---|---|---|
| Q0 | Maxfiylik auditi (faqat o'qish) | tugadi | 2026-11-19 | Topilmalar pastda; kod o'zgarmadi |
| Q1 | Ma'lumot sxemasi va validator | tugadi | 2026-11-20 | Sxema, 2 skript, `Fakt.astro`, 10 sinov; haqiqiy fakt yo'q |
| Q2 | Davlatlarni taqqoslash sahifasi | kutilmoqda | | |
| Q3 | Grantlar katalogi sahifasi | kutilmoqda | | |
| Q4 | "Menga mos universitet" filtri | kutilmoqda | | |
| Q5 | Ariza zinapoyasi → XP | kutilmoqda | | |
| Q6 | Kontent: 3 chuqur davlat + valyuta kurslari | kutilmoqda | | |
| Q7 | Kontent: 12 qisqa davlat kartasi | kutilmoqda | | |
| Q8 | Kontent: davlat grantlari | kutilmoqda | | |
| Q9 | Kontent: 30 universitet | kutilmoqda | | |
| Q10 | Yakuniy tekshiruv va hisobot | kutilmoqda | | |

## Sozlamalar
- Eskirish muddati: "muddatli" faktlar 60 kun, "barqaror" faktlar 180 kun. (180 kun muallif tomonidan HALI TASDIQLANMAGAN.)

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
- Q0 tugadi (faqat `docs/rejalar/admission-holat.md` o'zgardi).
- Q1 tugadi. Keyingi: Q2. Faktni `src/components/topAdmission/Fakt.astro` bilan ko'rsat; ma'lumotni `getCollection('davlatlar')` bilan ol; narx saralashda `usdga` + `kurslarBormi` (kurs bo'lmasa saralash o'chadi); kurs fayli `src/data/topAdmission/kurslar.json` ni `kurslarSxema.parse` bilan o'qi. Bo'sh kolleksiya hozir normal holat.

## Muallif uchun savollar
- Q1: `docs/tekshiruv/` `.gitignore` da (`tekshiruv/` qoidasi). Tasdiq ro'yxati lokal qolsinmi (hozirgi holat) yoki repoga kirishi uchun `.gitignore` ga istisno qo'shilsinmi?
- Q1: "barqaror" faktlar uchun 180 kun tasdiqlanadimi? (Bitta joyda: `ESKIRISH_KUNLARI`, `src/lib/topAdmission/fakt.ts`.)
- Q0: `ielts_writing_results` ni hisob eksportiga va `docs/maxfiylik-jadvali.md` ga qo'shish kerakmi? (Admission seriyasidan tashqari ish, alohida branch.)
- Q0: AI matnlari (AI Tutor, IELTS Writing) uchun saqlash muddati (masalan, N oydan keyin avtomatik o'chirish) kerakmi yoki "hisob ochiq turguncha" qoladimi? Huquqchi bilan maslahatda ko'riladi.
- Q0: Suhbatdosh boshqa foydalanuvchilarga ochilishidan oldin Gemini (bepul kalit) shartlari va Maxfiylik sahifasi matni tekshiriladimi?
