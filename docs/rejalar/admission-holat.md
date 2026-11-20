# Admission D-seriya: holat

| Qism | Nomi | Status | Sana | Izoh |
|---|---|---|---|---|
| Q0 | Maxfiylik auditi (faqat o'qish) | tugadi | 2026-11-19 | Topilmalar pastda; kod o'zgarmadi |
| Q1 | Ma'lumot sxemasi va validator | tugadi | 2026-11-20 | Sxema, 2 skript, `Fakt.astro`, 10 sinov; haqiqiy fakt yo'q |
| Q2 | Davlatlarni taqqoslash sahifasi | tugadi | 2026-11-20 | `/uz/top-admission/davlatlar/`; filtr, saralash, taqqoslash; SOXTA fixture bilan brauzerda sinaldi |
| Q3 | Grantlar katalogi sahifasi | tugadi | 2026-11-20 | `/uz/top-admission/grantlar/`; filtr, deadline saralash, Türkiye Bursları havolasi; SOXTA fixture bilan brauzerda sinaldi |
| Q4 | "Menga mos universitet" filtri | tugadi | 2026-11-20 | `/uz/top-admission/universitetlar/`; filtr, moslik, shortlist (`user_state` orqali, server o'zgarishsiz); SOXTA fixture bilan brauzerda sinaldi; jonli login sinalmagan |
| Q5 | Ariza zinapoyasi → XP | tugadi | 2026-11-20 | Migratsiya `20261120120000_admission_xp.sql` faqat branch'da (jonli bazaga QO'LLANMAGAN), RPC `admission_step_done`, mijoz `zinapoyaXp.ts`; lokal Postgres'da AX00–AX07 o'tdi. "Q5 natijasi (2-agent)" bo'limi |
| Q6 | Kontent: 3 chuqur davlat + valyuta kurslari | tugadi | 2026-11-20 | 3 davlat fayli (8 qoralama, 13 topilmadi), `kurslar.json` CBU 2026-11-20 (14 valyuta). "Q6 natijasi" bo'limi |
| Q7 | Kontent: 12 qisqa davlat kartasi | tugadi | 2026-11-20 | 12 davlat fayli (30 qoralama, 55 topilmadi). "Q7 natijasi" bo'limi |
| Q8 | Kontent: davlat grantlari | kutilmoqda | | |
| Q9 | Kontent: 30 universitet | kutilmoqda | | |
| Q10 | Yakuniy tekshiruv va hisobot | kutilmoqda | | |

## Sozlamalar
- Eskirish muddati: "muddatli" faktlar 60 kun, "barqaror" faktlar 180 kun. (180 kun muallif tomonidan 2026-11-20 da tasdiqlangan.)
- Viza yashash summasi (`narx.viza_yashash_summasi`): rasmiy sahifada oylik (yoki boshqa davr uchun) yozilgan bo'lsa, `qiymat` yillikka aylantiriladi (oylik × 12). `manba_iborasi` rasmiy iboraning o'zi (oylik summa bilan) qoladi, hisob (masalan "1 334 GBP/oy × 12") holat faylidagi kontent eslatmasiga yoziladi. Muallif qarori, 2026-11-20.
- Grant kartasi (Q3): `nimani_qoplaydi` bilan birga `deadline` ham tasdiqlangan bo'lsagina karta chiqadi. Davlatlarni taqqoslash sahifasidagi (Q2) grant nomi rasmiy sahifaga emas, Grantlar katalogiga (`?d=<davlat>`) olib boradi. Muallif qarori, 2026-11-20. Kodga kiritildi (commit "Q3-tuzatish: grant kartasi deadline sharti, davlat sahifasidan katalogga havola", 2026-11-20): `grantKatalog.ts` `grantKorinadimi` ikkala faktni tekshiradi (matnli deadline ham tasdiqlangan bo'lsa yetadi); `davlatlar/index.astro` da grant nomi `yol('/uz/top-admission/grantlar/')?d=<davlat-slug>` ga olib boradi (karta va jadval). Keyingi commit ("Q3-tuzatish: davlatlar sahifasida grant ko'rinish qoidasi katalog bilan bir xil"): `davlatTaqqos.ts` `grantKorinadimi` katalogdagi `grantKorinadimi` ni qayta ishlatadi (turi "davlat" + `nimani_qoplaydi` va `deadline` tasdiqlangan); davlat kartasi, jadval va "Davlat granti bor" filtri shu qoidaga tayanadi.
- Top Admission vositalari havolalari (Davlatlar, Grantlar, Menga mos universitet) faqat yon panelda (`topAdmissionSahifalar.ts`); bosh sahifadagi `QavatMenyu` ga qo'shilmaydi. Muallif qarori, 2026-11-20.
- Q5 istisnosi: muallif 2026-11-20 da bitta migratsiyaga ruxsat berdi (xp_events.kind CHECK ga `admission_step`, `xp_rule` qiymati, yangi RPC `admission_step_done`; yangi jadval yo'q). Migratsiya faqat branch'da yoziladi, jonli bazaga alohida muallif tasdig'i bilan qo'llanadi. Javobsiz kichik savollar bo'yicha standart (muallif keyin o'zgartirishi mumkin): 10 XP har zinapoya uchun bir marta; `leaderboard()` o'zgarmaydi; "qadam" = zinapoyani to'g'ri terish.

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
- "Davlat granti bor": davlatning `davlat_grantlari` ichida `turi: "davlat"` va katalog qoidasidan o'tgan (`nimani_qoplaydi` va `deadline` tasdiqlangan) grant bo'lsa. Kartada grant nomi Grantlar katalogiga (`?d=<davlat-slug>`) havola. (2026-11-20 tuzatishidan oldin: faqat `nimani_qoplaydi`, havola `rasmiy_havola` ga.)
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
- Grant katalogda ko'rinadi, agar `nimani_qoplaydi` VA `deadline` faktlari tasdiqlangan bo'lsa (ikkala tur uchun; 2026-11-20 tuzatishidan oldin faqat `nimani_qoplaydi`). Qolganlari umuman chiqmaydi. `nom`, `rasmiy_havola`, `turi`, `daraja` oddiy maydon sifatida ko'rinadi.
- "To'liq qoplaydi" filtri va belgisi faqat `toliq_qoplaydi` tasdiqlangan va `qiymat: true` bo'lsa. Bunday grant bo'lmasa chip chiqmaydi (izoh matni turadi). Kontent agentlari (Q8, Q9): `toliq_qoplaydi` ni faqat rasmiy sahifada aniq yozilgan bo'lsa qo'ying.
- Filtr: guruh ichida "yoki", guruhlar orasida "va". Daraja `ikkalasi` ham Bakalavr, ham Magistr filtriga mos. Davlat chiplari faqat ko'rinadigan granti bor davlatlardan (1 ta bo'lsa guruh chiqmaydi), nom `davlatlar.nom_uz` dan.
- Tartib: tasdiqlangan YYYY-MM-DD deadline bo'yicha eng yaqini birinchi (bugun ham "o'tmagan"); keyin sanasi noma'lum yoki matnli/tasdiqlanmagan deadline (alifbo); oxirida muddati o'tganlar (eng yaqinda o'tgani birinchi) "Bu yilgi muddat o'tgan" belgisi bilan. Muddat build paytida hisoblanadi va brauzerda `toshkentBugun()` bilan qayta hisoblanadi.
- Türkiye Bursları: sahifa `main` da bor (`src/pages/uz/top-admission/turkiye-burslari/index.astro`, `origin/main` da tekshirildi). Grant slug'i `turkiye-burslari` yoki turi "davlat" va `davlat: "turkiya"` bo'lgan grant kartasida "Türkiye Bursları bo'yicha qo'llanma" havolasi (`ICHKI_SAHIFALAR`, `grantKatalog.ts`). Kontent agentlari (Q7, Q8): Turkiya davlat slug'i `turkiya`, Türkiye Bursları grant slug'i `turkiye-burslari` bo'lsin. Bo'sh holatda ham Türkiye Bursları tugmasi bor.
- Brauzerda hech narsa saqlanmaydi; holat faqat URL'da.

Sinov:
- `npm test` 356/356 (yangi 7 ta). `npm run check`: faqat 4 ta eski xato. `npm run build` o'tdi. `npm run repo:tekshir`: muammo yo'q.
- Vaqtincha SOXTA fixture (2 davlat, 6 grant: yaqin, uzoq + to'liq, matnli deadline, o'tgan, qoralama `nimani_qoplaydi`, qoralama `toliq_qoplaydi`; commit qilinmagan, build'dan keyin o'chirildi) bilan build va brauzer (lokal statik server, Claude Browser paneli): tartib yaqin → uzoq → noma'lum → o'tgan; qoralama grant HTML'da yo'q; qoralama `toliq_qoplaydi` to'liq deb hisoblanmadi; "To'liq qoplaydi" filtri 1 ta; Magistr + Universitet filtri; mos grant yo'q holati va "Filtrlarni tozalash"; URL'dan holatni tiklash (`?tur=davlat&dr=bakalavr`); Türkiye Bursları havolasi; yon panel bandi. 1280px yorug' va 375px qorong'i mavzu ko'rildi, gorizontal scroll yo'q. Bo'sh holat 375px qorong'ida ko'rildi.
- Sinalmagan: axe/VoiceOver, haqiqiy telefon, JS'siz ko'rinish brauzerda (kod bo'yicha: kartalar build tartibida, filtr yashirin), bo'sh holat 1280px, `prefers-reduced-motion`. Kontrast alohida o'lchanmadi (faqat mavjud DS tokenlari).

## Q4 natijasi (2026-11-20)
Sahifa: `/uz/top-admission/universitetlar/` (`src/pages/uz/top-admission/universitetlar/index.astro`, `BolimQobiq`, turi "vosita", holat "qoralama"), Q2/Q3 uslubida (`um-*` klasslar).

O'zgargan / yangi fayllar:
- `src/pages/uz/top-admission/universitetlar/index.astro`: davlat chiplari (AQSH, Buyuk Britaniya, Janubiy Koreya; bir nechtasi), IELTS tanlovi (`<select>`, 4.0–9.0), yillik byudjet (USD, matn maydoni `inputmode="numeric"`), "Faqat xalqaro talabaga moliyaviy yordam beradiganlar" va "Faqat talabga mos keladiganlar" belgilari (`<button aria-pressed>`). `<form>` yo'q, yuborish yo'q: har o'zgarishda ro'yxat darhol yangilanadi. Doimiy ogohlantirish natija tepasida: "Bu ro'yxat rasmiy talablar bo'yicha saralash, qabul ehtimoli emas." (bo'sh holatda ham). "Mening ro'yxatim" (shortlist) bloki, "Ma'lumot tekshirilmoqda (N ta)" guruhi, bo'sh holat.
- `src/components/topAdmission/UniKarta.astro`: karta (min IELTS, yillik xarajat, imtihonlar, ariza to'lovi, to'lovdan ozod qilish, yordam turi, deadline: har biri `Fakt.astro`), taqqoslash qatorlari "Talab: 6.5 · Sizda: 6.0" va "Xarajat: ≈ N USD · Byudjet: M USD", "Talabga yetmaydi" belgisi, "Ro'yxatga saqlash" tugmasi.
- `src/lib/topAdmission/universitetMoslik.ts`: sof mantiq (`MOS_DAVLATLAR`, `uniXulosasi`, `moslik`, kiritishni o'qish, URL, shortlist `shortlistTozala`/`shortlistAlmashtir`, kalit `SHORTLIST_KALIT`).
- `src/lib/topAdmission/testlar/universitetMoslik.test.ts`: 8 sinov (SOXTA ma'lumot).
- Sinxron (mavjud mexanizm, server o'zgarishsiz): `src/lib/holatBirlashtir.ts` (`SINXRON_KALITLAR` ga `tayanch:admission-shortlist`, shakl `royxat(200)`), `src/lib/holat.ts` (yangi `sinxronHolati()`; sarlavha izohi), `src/components/SatSinxron.astro` (dialog sanog'ida "saved university (Top Admission)" nomi), `scripts/sinxron-test.ts` (sanoqqa yangi kalit + "Shortlist" sinovi), `docs/sinxron-qoidalari.md` ("Top Admission shortlisti" bo'limi).
- `src/data/topAdmissionSahifalar.ts`: yon panel "Vositalar" guruhiga "Menga mos universitet".

Qarorlar (keyingi qismlar uchun):
- Davlat slug'lari (Q6, Q9 kontent agentlari shularni ishlatsin): `aqsh`, `buyuk-britaniya`, `janubiy-koreya` (`MOS_DAVLATLAR`). Universitet `davlat` maydoni shu slug'ga havola.
- Kerakli faktlar (moslik uchun): `min_ielts` va `yillik_xarajat` tasdiqlangan, xarajat USD'ga o'giriladigan (USD yoki `kurslar.json` da kursi bor valyuta). "Yordam" belgisi yoqilganda `xalqaro_yordam_turi` ham. Biri bo'lmasa universitet "Ma'lumot tekshirilmoqda (N ta)" guruhida, moslik hisoblanmaydi (taqqoslash qatori va belgi chiqmaydi). `kurslar.json` bo'sh bo'lsa GBP/KRW universitetlari shu guruhga tushadi, sahifada "Valyuta kursi ma'lumoti yo'q" izohi.
- `xalqaro_yordam_turi` konventsiyasi (Q9): rasmiy sahifada xalqaro talabaga yordam yo'qligi aniq yozilgan bo'lsa qiymat aynan `"yo'q"` (`YORDAM_YOQ`); "yordam" belgisi bunday universitetni yashiradi. Boshqa har qanday tasdiqlangan matn = yordam beradi.
- Moslik: IELTS bali talabga teng yoki yuqori bo'lsa mos; xarajat (USD, butun songa yaxlitlangan) byudjetga teng yoki kam bo'lsa mos. Kiritilmagan qiymat tekshirilmaydi ("Sizda: kiritilmagan"). "Faqat talabga mos" o'chiq bo'lsa yetmaydiganlar "Talabga yetmaydi" belgisi bilan mos keladiganlardan keyin chiqadi; har guruh ichida alifbo (reyting yo'q). SAT bo'yicha solishtirish yo'q.
- URL'da faqat `?d=&yordam=&mos=`. IELTS bali va byudjet URL'ga ham, brauzerga ham yozilmaydi (shaxsiy ma'lumot), sahifa yangilansa tozalanadi.
- Shortlist: kalit `tayanch:admission-shortlist`, qiymat `[{ id: slug }]`, 200 tagacha, `holatOqi`/`holatYoz` orqali. Hisobsiz: faqat localStorage. Hisob bilan: sahifa `hisobniUla()` ni chaqiradi; sinxron faqat rozilikdan keyin (SAT dialogidagi "Import" yoki shu sahifadagi "Hisobga saqlash" tugmasi, ikkalasi `importQil`, ya'ni SAT progressi ham ko'chadi: tugma yonidagi matn buni aytadi). Avtomatik popup yo'q. `user_state` serverida kalit ruxsat ro'yxati yo'q (faqat `^tayanch:[a-z0-9:_-]{1,92}$` regex, `20261108000005_foydalanuvchi.sql:74`), shuning uchun jadval/migratsiya/RPC o'zgarmadi va "to'siq" yo'q.
- Kolleksiyada yo'q slug shortlistda saqlanadi, lekin ko'rsatilmaydi. Bo'sh holatda (birorta tasdiqlangan universitet fakti yo'q) filtr ham, shortlist bloki ham chiqmaydi.

Sinov:
- `npm test` 364/364 (yangi 8 ta). `npm run sinxron:tekshir` 16/16 (yangi "Shortlist" sinovi: hisobsiz faqat brauzer, rozilikgacha serverga hech narsa, `importQil` dan keyin `user_state`, qo'shish debounce navbati bilan, olib tashlash tombstone bilan boshqa qurilmada ham o'chadi). `npm run check`: faqat 4 ta eski xato. `npm run build` o'tdi. `npm run repo:tekshir`: muammo yo'q.
- Vaqtincha SOXTA fixture (3 davlat `aqsh`/`buyuk-britaniya`/`janubiy-koreya`, 4 universitet: USD hammasi tasdiqlangan; GBP + `yordam "yo'q"`; KRW + qoralama `min_ielts`; USD + `topilmadi` yordam; `kurslar.json` da SOXTA GBP kursi; commit qilinmagan, build'dan keyin o'chirildi va `kurslar.json` tiklandi) bilan build va brauzer (lokal statik server, Claude Browser paneli): qoralama `min_ielts` ko'rinmadi va universitet "tekshirilmoqda" guruhiga tushdi; IELTS 6.0 + byudjet 45 000 da "Talab: 6.5 · Sizda: 6.0", "Xarajat: ≈ 37 500 USD · Byudjet: 45 000 USD", "Talabga yetmaydi"; "Faqat talabga mos" ularni yashirdi; "yordam" belgisi `yo'q` ni yashirdi va `topilmadi` yordamni tekshirilmoqda guruhiga o'tkazdi; davlat filtri; URL tiklash (`?yordam=1`); noto'g'ri byudjet (`abc`) `aria-invalid` va izoh; shortlist qo'shish/olib tashlash, localStorage, sahifa yangilangandan keyin saqlanishi, olib tashlashdan keyin fokus keyingi tugmaga. 1280px (qorong'i va yorug'), 375px (yorug'), ~408px (qorong'i) ko'rildi, gorizontal scroll yo'q. Bo'sh holat 375px yorug'da ko'rildi.
- Sinalmagan: haqiqiy hisob bilan kirib sinxron (jonli Supabase `user_state` upsert/RLS; parol kiritish taqiqlangani uchun), "Hisobga saqlash" tugmasi brauzerda (faqat unit test), boshqa tabdan `storage` hodisasi, axe/VoiceOver, haqiqiy telefon, JS'siz ko'rinish brauzerda (kod bo'yicha: kartalar build tartibida, filtr va shortlist yashirin), `prefers-reduced-motion`. Kontrast alohida o'lchanmadi (faqat mavjud DS tokenlari).

## Q5 natijasi (2-agent, 2026-11-20): TUGADI (jonli bazaga qo'llanmagan)
Asos: "Sozlamalar" → "Q5 istisnosi" (muallif ruxsati), quyidagi "Q5 natijasi: TO'SIQ" dagi "Kerakli o'zgarish" 1–5 bajarildi. Standartlar: 10 XP har zinapoyaga bir marta, `leaderboard()` o'zgarmagan, qadam = zinapoyani to'g'ri terish.

O'zgargan / yangi fayllar:
- `supabase/migrations/20261120120000_admission_xp.sql` (yangi; vaqt belgisi `origin/main` va hamma remote branch'lardagi eng oxirgisidan, `20261119120000`, keyin): `xp_events_kind_check` qayta yaratildi (`admission_step` qo'shildi); `private.xp_rule` `create or replace` (SAT qiymatlari aynan o'sha, yangi `admission_step` = 10); yangi `public.admission_step_done(p_step text) returns integer`, `security definer`, `set search_path = ''`, `auth.uid()` null → `not_authenticated` (28000), ruxsat ro'yxati `zinapoya:turkiye|commonapp|ucas` dan tashqari → `bad_step` (22023), SAT bilan bir xil advisory lock, `private.xp_add(..., private.today_tashkent())`; `revoke … from public, anon`, `grant execute … to authenticated`. Yangi jadval yo'q, boshqa RPC o'zgarmagan.
- `supabase/tests/admission_xp_test.sql` (yangi, bitta tranzaksiya, `rollback`): AX00 SAT qiymatlari o'zgarmagan, AX01 anon yopiq, AX02 uid'siz rad, AX03 birinchi chaqiruv 10 / takroriy 0 / bitta qator, AX04 uchala zinapoya jami 30, AX05 noto'g'ri/null/SAT turi rad, AX06 mijoz `xp_events` ga yoza olmaydi, AX07 kunlik 300 chegarasi (295 da 5 beriladi, keyingisi 0, kalit band qilinmaydi) va RLS.
- `scripts/rls-tekshir.sh`: `admission_xp_test.sql` `reyting_test.sql` dan keyin qo'shildi.
- `src/data/topAdmissionXp.ts` (yangi): `ADMISSION_ZINAPOYA_XP = 10`, `ADMISSION_XP_QADAMLAR` (server ro'yxati bilan bir xil).
- `src/lib/topAdmission/zinapoyaXp.ts` (yangi, sof): `zinapoyaXpYuboruvchi(mijoz)`: noma'lum zinapoya, mijoz yo'q, loginsiz, xato, istisno → jim `null`; bir zinapoya uchun so'rov jarayonda yoki muvaffaqiyatli bo'lsa qayta yuborilmaydi; `null` bo'lsa (login yo'q/xato) keyingi to'g'ri terishda qayta urinadi. `xpYozuvi` faqat XP > 0 da "+N XP olindi".
- `src/lib/topAdmission/testlar/zinapoyaXp.test.ts` (yangi, 9 sinov, SOXTA mijoz): qadamlar `zinapoyalar.ts` id'lari bilan server ro'yxatiga mos; bitta RPC; ketma-ket va parallel takror faqat bir marta; loginsiz RPC yo'q, kirgandan keyin yuboriladi; mijoz yo'q; xato yutiladi va qayta urinish; istisno; noma'lum zinapoya; yozuv matni.
- `src/pages/uz/top-admission/qollanma/ariza-zinapoyasi/index.astro`: "Hammasi to'g'ri" bo'lganda `xpYubor(joriy.id)`; supabase-js faqat build'da Supabase sozlangan va brauzerda sessiya kaliti (`tayanch:auth`) bo'lsa dinamik yuklanadi (`holatHisob.ts` yondashuvi); `<p id="zp-xp" aria-live="polite">` faqat XP > 0 da "+10 XP olindi: … zinapoyasi." (bo'sh bo'lsa yashirin). Reyting, boshqalar XP'si, `leaderboard_me` chaqiruvi yo'q.
- `docs/xp-qoidasi.md`: "Top Admission" jadvali va eslatmalar.

Sinov:
- Lokal vaqtinchalik Postgres 17 klasteri (`lokal-shim.sql` + hamma 43 migratsiya 2 marta, xatosiz; security definer'larda `search_path` bor): `reyting_test` R01–R18, `musobaqa_test` M01–M18, `admission_xp_test` AX00–AX07 hammasi OK. To'liq `npm run db:tekshir` `xavfsizlik_test.sql` da to'xtaydi: `FAIL X1 anon kutilmagan jadval huquqi: contests:SELECT`. Bu ESKI xato: `origin/main` ning `supabase/` papkasida ham aynan shu natija (Q5 migratsiyasisiz), Q5 ga aloqasi yo'q, tuzatilmadi. Shuning uchun `db:tekshir` dagi keyingi testlar (va yangi AX) to'liq skript ichida emas, alohida skript bilan ishga tushirildi.
- `npm test` 373/373, `npm run check` faqat 4 ta eski xato, `npm run build` o'tdi, `npm run repo:tekshir` muammo yo'q.
- Brauzer (lokal statik server, Claude Browser, loginsiz): UCAS zinapoyasi to'g'ri terildi va ikki marta tekshirildi: "Hammasi to'g'ri", XP yozuvi yo'q va yashirin, supabase-js bo'lagi yuklanmadi, konsolda xato yo'q.

Jonli bazaga qo'llash uchun muallif qadamlari (Claude qilmadi; jonli bazaga hech narsa qo'llanmagan):
1. `admission-d` ni `main` ga merge qilishdan OLDIN yoki birga: link qilingan worktree'da `supabase migration list` (jonli baza main'dan oldinda bo'lishi mumkin, xotira "Migratsiya raqami"): `20261120120000` "Local" ustunida bo'lishi, "Remote" da bo'lmasligi va undan keyingi remote-only raqam yo'qligini tekshiring.
2. `supabase db push --dry-run` (CLI 3.x da `--remote` kerak bo'lishi mumkin, `supabase/README.md`): ro'yxatda FAQAT `20261120120000_admission_xp.sql` bo'lishi kerak.
3. `supabase db push` (shu bitta fayl).
4. Tekshiruv (faqat o'qiydi): `supabase/tests/loyiha_tekshir.sql` (eslatma: `admission_step_done` uning `kutilgan_rpc` ro'yxatiga qo'shilmagan, leaderboard RPC'lari kabi; xohlasangiz keyin qo'shiladi).
5. Saytda haqiqiy hisob bilan bitta zinapoyani to'g'ri terib "+10 XP olindi" chiqishini va ikkinchi marta chiqmasligini ko'ring; SAT Leaderboard'da o'z XP'ingiz 10 ga oshganini ko'ring.
Migratsiya qo'llanmaguncha saytda RPC topilmaydi: mijoz xatoni jim yutadi, UI o'zgarmaydi, XP yozilmaydi.

Sinalmagan: jonli Supabase'da (migratsiya qo'llanmagan), haqiqiy hisob bilan kirib XP yozilishi va "+10 XP" yozuvi brauzerda (parol kiritilmaydi; faqat unit test va SQL sinovi), parallel ikki tab (server tomoni advisory lock + noyob kalit, alohida sinalmagan), axe/VoiceOver, haqiqiy telefon, 375px/qorong'i mavzuda yangi yozuv (faqat mavjud tokenlar: `--matn`, `kichik`).

## Q5 natijasi (2026-11-20): TO'SIQ (1-agent; quyidagi "Kerakli o'zgarish" 2-agent tomonidan bajarildi)
Kod, migratsiya va RPC o'zgarmadi. Faqat shu fayl yangilandi.

Topilganlar:
- Ariza zinapoyasi bor: `src/pages/uz/top-admission/qollanma/ariza-zinapoyasi/index.astro` (PR #25), `DarsQolip` darsi: Misol / Qoida / Sinab ko'r. "Sinab ko'r" da 3 ta zinapoya (`turkiye`, `commonapp`, `ucas`, `src/data/topAdmissionDarslar/zinapoyalar.ts`), har birida 4 pog'ona; "Tekshirish" hammasi to'g'ri bo'lsa `Hammasi to'g'ri: … zinapoyasi tayyor.` (qator ~268). Hozir Supabase'ga hech narsa yubormaydi, faqat `tayanch-topshirish-yoli` ni o'qiydi. Belgilanadigan (checkbox) "qadam" yo'q: qadam = bitta zinapoyani to'g'ri terish.
- XP faqat server trigger'i orqali yoziladi: `public.attempts` ga qator tushganda `attempts_award_xp` → `private.award_xp_apply` → `private.xp_add(user, kind, ref, xp, day)` (`supabase/migrations/20261112184613_reyting.sql:173-271`). `attempts` ga faqat SAT `submit_answer` yozadi. Mijoz `xp_events` ga yoza olmaydi (`revoke all … from anon, authenticated`, faqat `select`, qator 59-60); `private.xp_add` mijozga yopiq (qator 486).
- `xp_events.kind` CHECK: faqat `'answer', 'correct', 'review', 'daily', 'daily_correct'` (qator 46). Admission turi (masalan `admission_step`) yozilsa CHECK rad etadi.
- Bir martalik kafolati mexanizmda bor: `unique (user_id, kind, ref)` va `on conflict … do nothing` (qator 52, 187-189). Lekin unga mijozdan kirish yo'li yo'q.
- `20261116124750_musobaqa.sql` XP'ga tegmaydi (musobaqa javobi XP bermaydi). `origin/main` (25fc70a) da boshqa XP yozadigan migratsiya yoki Edge Function yo'q (`git grep xp_events|xp_add|award_xp`).
- Xulosa: Admission qadamini migratsiyasiz va mavjud RPC'larni o'zgartirmasdan XP'ga aylantirib bo'lmaydi (reja 4-bo'lim Q5 6-band, 2-bo'lim 3-qoida). Q5 shu yerda to'xtadi. Bir martalikni unit test bilan ko'rsatish ham mumkin bo'lmadi: chaqiriladigan RPC yo'q.

Kerakli o'zgarish (muallif tasdiqlasa, ALOHIDA branch'da yangi migratsiya; bu yerda yozilmagan):
1. `xp_events.kind` CHECK ga `'admission_step'` qo'shish (constraint'ni `drop … if exists` + `add` bilan qayta yaratish).
2. `private.xp_rule` ga `when 'admission_step' then 10` (`create or replace`, qolgan qiymatlar o'zgarmaydi). Ikki joy birga: `src/data/satReyting.ts` emas, Admission uchun alohida konstanta (masalan `src/data/topAdmissionXp.ts`); `docs/xp-qoidasi.md` ga "Admission" qatori.
3. Yangi RPC `public.admission_step_done(p_step text) returns integer`, `security definer`, `set search_path = ''`:
   - `auth.uid()` null bo'lsa `raise exception 'not_authenticated'`.
   - `p_step` ruxsat ro'yxatida bo'lishi shart: `'zinapoya:turkiye'`, `'zinapoya:commonapp'`, `'zinapoya:ucas'` (boshqasi `raise exception 'bad_step' using errcode = '22023'`). Ro'yxat serverda, shuning uchun umrbod maksimum 3 × 10 = 30 XP.
   - `pg_advisory_xact_lock(hashtextextended('xp:' || uid, 0))` (SAT bilan bir xil qulf), so'ng `return private.xp_add(uid, 'admission_step', p_step, private.xp_rule('admission_step'), private.today_tashkent())`. `unique (user_id, kind, ref)` tufayli ikkinchi chaqiruv 0 qaytaradi (belgini olib qayta qo'yish XP bermaydi).
   - `revoke all … from public, anon; grant execute … to authenticated`.
4. Sinov: `supabase/tests/` ga (masalan `admission_xp_test.sql`, rollback bilan): birinchi chaqiruv 10, ikkinchisi 0, `xp_events` da bitta qator; noto'g'ri `p_step` xato; anon chaqira olmaydi; kunlik 300 chegarasi.
5. Mijoz (migratsiya jonli bazaga qo'llangandan keyin, Q5 ni qayta ishga tushirish): zinapoya `Hammasi to'g'ri` bo'lganda, faqat hisob bilan kirgan bo'lsa, `rpc('admission_step_done', { p_step: 'zinapoya:' + joriy.id })`; xato jim yutiladi (loginsiz chaqirilmaydi, xato chiqmaydi). Qaytgan XP > 0 bo'lsa `aria-live` holatda "+10 XP" yozuvi. O'z progressi: `leaderboard_me()` (faqat o'z XP'si; reyting/boshqalar ko'rsatilmaydi). Bir martalik bayroq brauzerda saqlanmaydi: manba server kaliti.

XP qiymati sababi (10): SAT'da bitta savol birinchi urinishda to'g'ri = 2 + 3 = 5 XP, kun savoli to'g'ri = 5 + 5 = 10 XP. Bitta zinapoya 4 pog'onani to'g'ri tartiblash, ya'ni bir nechta savolga teng mehnat, lekin umrida bir marta; kun savoli bilan teng (10) mutanosib. Jami 30 XP, SAT'dagi kunlik 300 chegaradan ancha kichik, reytingni buzmaydi. Muallif tasdig'i kerak.

Ma'lum cheklov (tasdiqdan oldin bilish kerak): zinapoyaning to'g'ri javobi statik JS'da (`zinapoyalar.ts`), server tartibni tekshira olmaydi. XP amalda "o'quvchi o'zi bajardim degan" qadam uchun; himoya faqat ruxsat ro'yxati, noyob kalit va kunlik chegara (umrbod 30 XP).

## Q7 natijasi (2026-11-20)
O'zgargan / yangi fayllar: `src/data/topAdmission/davlatlar/` ichida `germaniya`, `italiya`, `vengriya`, `turkiya`, `xitoy`, `yaponiya`, `kanada`, `avstraliya`, `malayziya`, `polsha`, `saudiya-arabistoni`, `singapur` (`.json`; `chuqur_qollanma: false`, `davlat_grantlari: []`). `docs/tekshiruv/tasdiq-royxati.md` yangilandi (jami 38 qoralama: Q6 8 + Q7 30; `.gitignore` sababli faqat lokal). Kod o'zgarmadi.

Sanoq (hammasi `tekshirilgan_sana: 2026-11-20`, `holat: "qoralama"` yoki `"topilmadi"`; har `manba_iborasi` curl bilan yuklangan sahifa matnida `grep -F` orqali aynan topildi; Saudiya PDF matni python bilan PDF oqimlaridan ajratib tekshirildi):
| Davlat | qoralama | topilmadi | Qoralama faktlar |
|---|---|---|---|
| Germaniya | 3 | 4 | viza yashash summasi, o'qish paytida ishlash (140 kun), bitirgandan keyin (18 oy) |
| Italiya | 3 | 4 | viza yashash summasi, ingliz tilida dastur, o'qish paytida ishlash (20 soat / 1 040 soat) |
| Vengriya | 1 | 6 | ingliz tilida dastur |
| Turkiya | 2 | 5 | ingliz tilida dastur, o'qish paytida ishlash (1-kursdan keyin) |
| Xitoy | 1 | 6 | ingliz tilida dastur |
| Yaponiya | 6 | 2 | kontrakt (milliy univ. 1-yil), ingliz tilida dastur, ishlash (28 soat), bitirgandan keyin (1 yil), diplom ("yo'q") + `tayyorlov_nomi` |
| Kanada | 3 | 4 | viza yashash summasi, ishlash (24 soat), PGWP (3 yil) |
| Avstraliya | 2 | 5 | ishlash (2 haftada 48 soat), 485 viza |
| Malayziya | 3 | 4 | ingliz tilida dastur, ishlash (faqat ta'tilda 20 soat), Graduate Pass (12 oy) |
| Polsha | 3 | 4 | viza yashash summasi, ishlash (ruxsatnomasiz), bitirgandan keyin (9 oy) |
| Saudiya Arabistoni | 1 | 6 | ingliz tilida dastur |
| Singapur | 2 | 5 | ishlash (16 soat), LTVP (IHL bitiruvchisi) |
"topilmadi" soni 7 asosiy faktdan (`tayyorlov_nomi` hisobga kirmaydi).

Oylik → yillik hisoblar ("Sozlamalar" qoidasi):
- Germaniya: 992 EUR/oy × 12 = 11 904 EUR (sahifaning o'zida ham "11.904 Euro für das gesamte erste Jahr"). Manba: Germaniyaning Toshkentdagi elchixonasi.
- Polsha: 1 010 PLN/oy × 12 = 12 120 PLN. Diqqat: rasmiy summa "after deducting actual housing costs", ya'ni uy-joy xarajatidan TASHQARI.
- Italiya: sahifada yillik summa bor (848,32 EUR/oy, "equivalent to €10,179.85 per year"), shuning uchun rasmiy yillik 10 179,85 EUR yozildi (848,32 × 12 = 10 179,84; 1 sent farq rasmiy yaxlitlash). Manba Italiyaning Hanoydagi elchixonasi (2026/27); Toshkent elchixonasi sahifasi topilmadi.
- Kanada: sahifada yillik summa (1 kishi, Kvebekdan tashqari, 2026-09-01 dan keyin ariza): 23 448 CAD. Jadval katakchasida bo'lgani uchun ibora faqat "$23,448" (Cmd+F shu bilan topadi; qatori "If you apply on or after September 1, 2026", 1 oila a'zosi).

Manbalar (faqat rasmiy):
- Germaniya: taschkent.diplo.de (talaba vizasi), gesetze-im-internet.de Residence Act inglizcha tarjimasi (§16b(3) 140 kun, §20(2) 18 oy; tarjima 2024-05-08 o'zgarishigacha). make-it-in-germany.com (Radware bot himoyasi), daad.de va study-in-germany.de (ulanish rad etildi) ochilmadi.
- Italiya: ambhanoi.esteri.it (summa, ingliz tili dasturlari), esteri.it FAQ "Study in Italy" (ishlash).
- Vengriya: stipendiumhungaricum.hu bosh sahifa. oif.gov.hu "Temporary Service Interruption" (2026-11-19 dan, taxminan 2026-11-23 gacha), studyinhungary.hu texnik ishlarda: ishlash, yashash summasi, bitirgandan keyin shu sababli "topilmadi"; sayt tiklangach qayta urinish kerak.
- Turkiya: studyinturkiye.gov.tr (YÖK) bosh sahifa va FAQ.
- Xitoy: en.moe.gov.cn "List for English-taught Programmes..." (sahifa sanasi 2009, eski). campuschina.org (412), nia.gov.cn (404) ochilmadi; Pekin shahar hukumati sahifasi milliy qoida emas, ishlatilmadi.
- Yaponiya: studyinjapan.go.jp (JASSO): universities, english-programs, part-time-jobs, employment.
- Kanada: canada.ca IRCC (financial-support, work-off-campus, after-graduation/about). Eslatma: canada.ca brauzer User-Agent bilan javob bermaydi, oddiy curl bilan ochiladi.
- Avstraliya: studyaustralia.gov.au (subclass 500 va 485 sahifalari). immi.homeaffairs.gov.au JS bilan chiziladi; joriy yashash summasi rasmiy sahifa matnida topilmadi (faqat 2023 dagi eski AU$24,505 yangiligi bor, ishlatilmadi).
- Malayziya: educationmalaysia.gov.my (EMGS, Oliy ta'lim vazirligi qarashli) FAQ va bosh sahifa.
- Polsha: mos.cudzoziemcy.gov.pl (Ichki ishlar vazirligi MOS portali): o'qish ruxsatnomasi va bitiruvchi ruxsatnomasi sahifalari. udsc.gov.pl ochilmadi; NAWA sahifalarida ingliz tilida dastur haqida ibora topilmadi.
- Saudiya: object.moe.gov.sa "Study in Saudi" profil PDF. studyinsaudi.moe.gov.sa ochilmadi.
- Singapur: mom.gov.sg (talabalar uchun ish ruxsatnomasidan ozod qilish), ica.gov.sg (LTVP).

Kontent eslatmalari:
- Yaponiya `kontrakt_yillik` = 820 000 JPY: rasmiy ibora milliy universitetning BIRINCHI yili (kirish to'lovi + kontrakt) jami xarajati; davlat/xususiy universitetlar uchun 930 000 / 1 100 000 JPY. Yaponiya `diplom.togridan_togri` = "yo'q": rasmiy shart "12 years of formal school education"; o'zbek 11 yillik maktabi (reja 1-bo'lim, 5-mezon) 12 yildan kam, shuning uchun "designated university preparatory course" `tayyorlov_nomi` ga yozildi.
- Saudiya ibora qisqa ("English for Practical"): PDF'da "Language of Study ... English for Practical-Based Majors"; defis atrofidagi bo'shliq PDF ko'ruvchida turlicha bo'lishi mumkin, shuning uchun ibora defisdan oldin kesildi.
- Kanada, Polsha va Singapur'dagi ba'zi iboralar jadval katakchalaridan (masalan "Period for which granted 9 months", "Graduate from an Institute of Higher Learning (IHL) Seeking employment in Singapore"); brauzerda Cmd+F katakchalar orasida topmasligi mumkin, unda qismini qidiring.
- Hamma davlatda `kontrakt_yillik` (Yaponiyadan tashqari), `odatiy_ielts` va (Yaponiyadan tashqari) `diplom` "topilmadi": davlat darajasida rasmiy ibora yo'q yoki sahifa ochilmadi, universitetga qarab.
- `davlat_grantlari` bo'sh (Q8). `chuqur_qollanma_havola` yo'q.

Sinov: `npm run malumot:tasdiq` 38 qoralama; `npm run malumot:tekshir` 15 hujjat, 106 fakt, 0 eskirgan, 68 topilmadi, sxema xatosi yo'q; `npm test` 373/373; `npm run build` o'tdi (qoralama qiymatlar `dist/uz/top-admission/` da yo'q); `npm run repo:tekshir` muammo yo'q. Sinalmagan: sahifa brauzerda ko'rilmadi (tasdiqlangan fakt yo'q, bo'sh holat o'zgarmagan).

## Q6 natijasi (2026-11-20)
O'zgargan / yangi fayllar:
- `src/data/topAdmission/davlatlar/aqsh.json`, `buyuk-britaniya.json`, `janubiy-koreya.json` (slug'lar Q4 konventsiyasi bo'yicha; `chuqur_qollanma: true`).
- `src/data/topAdmission/kurslar.json`: O'zbekiston Markaziy banki rasmiy kurslari, 2026-11-20 (`https://cbu.uz/uz/arkhiv-kursov-valyut/json/`, CBU rasmiy JSON). 1 birlik necha USD = (valyuta so'm kursi) / (USD so'm kursi 11971.64), 6 muhim raqam: EUR, GBP, KRW, JPY, CNY, CAD, AUD, MYR, PLN, SAR, SGD, TRY, HUF, CHF (Q7 davlatlari uchun ham). So'm kurslari `izoh` maydonida.
- `src/lib/topAdmission/testlar/fakt.test.ts`: kurslar sinovi haqiqiy fayl bo'sh deb faraz qilardi; endi haqiqiy fayl sxemadan o'tishi, bo'sh holat esa alohida obyekt bilan sinaladi.
- `docs/tekshiruv/tasdiq-royxati.md` yangilandi (8 ta qoralama; `.gitignore` sababli faqat lokal).

Sanoq (hammasi `tekshirilgan_sana: 2026-11-20`; manba iborasi har biri curl bilan sahifa matnida aynan topilishi tekshirildi):
| Davlat | qoralama | topilmadi |
|---|---|---|
| AQSH | 2 (o'qish paytida ishlash, OPT) | 5 (kontrakt, viza yashash summasi, ingliz tilida dastur, odatiy IELTS, diplom) |
| Buyuk Britaniya | 3 (viza yashash summasi, o'qish paytida ishlash, Graduate visa) | 4 (kontrakt, ingliz tilida dastur, odatiy IELTS, diplom) |
| Janubiy Koreya | 3 (ingliz tilida dastur, o'qish paytida ishlash, D-10-1) | 4 (kontrakt, viza yashash summasi, odatiy IELTS, diplom) |

Oylik → yillik hisob ("Sozlamalar" qoidasi):
- Buyuk Britaniya `viza_yashash_summasi` = 1 171 GBP/oy × 12 = 14 052 GBP (London tashqarisi). Iboraning o'zida "for up to 9 months" bor: viza uchun rasmiy talab 9 oy × 1 171 = 10 539 GBP; qoida bo'yicha ×12 yozildi. London uchun: 1 529 GBP/oy (×12 = 18 348 GBP), faylga yozilmadi (sxemada bitta qiymat).

Manbalar (faqat rasmiy):
- gov.uk/student-visa/money (yashash summasi); gov.uk/guidance/immigration-rules/immigration-rules-appendix-student (ST 26.1, "20 hours per week during term-time"); gov.uk/graduate-visa ("18 months if you apply on or after 1 January 2027"; 2026-12-31 gacha 2 yil); gov.uk/student-visa/knowledge-of-english (faqat o'qildi: daraja bo'yicha CEFR B2, IELTS raqami yo'q).
- studyinthestates.dhs.gov/students/work/working-in-the-united-states (kampus ichida 20 soat); uscis.gov OPT sahifasi (12 oy). travel.state.gov va educationusa.state.gov 403 qaytardi (ochilmadi).
- studyinkorea.go.kr: `/fr/work/aboutForeignerEmploymentSystem.do` (30 soat; sahifa yo'li /fr/ bo'lsa ham matn inglizcha), `/ko/life/residenceAndStayInfo.do` (D-10-1), `/eng/plan/examAndKoreanStudy.do` ("English-taught programs").
- cbu.uz rasmiy JSON (kurslar).

"topilmadi" sabablari:
- Kontrakt (3 davlat): davlat darajasidagi rasmiy raqam yo'q, universitetga qarab (Q9 universitet fayllarida).
- AQSH viza yashash summasi: davlat belgilagan summa yo'q, I-20 dagi summani universitet belgilaydi.
- Koreya viza yashash summasi: KIS/hikorea rasmiy sahifasida topilmadi; elchixonalar sahifalarida turlicha (masalan London elchixonasi 15 000/13 000 USD), Toshkent elchixonasi (overseas.mofa.go.kr/uz-ru) viza bo'limi JS menyu orqali, curl/WebFetch bilan ochilmadi.
- Odatiy IELTS (3 davlat): davlat darajasida IELTS raqami yo'q (UK: CEFR B2; AQSH/Koreya: universitetga qarab).
- Ingliz tilida dastur bor (AQSH, UK): rasmiy hukumat sahifasida "ingliz tilida dastur" degan aniq ibora topilmadi (UK sahifasi faqat ingliz tili talabini aytadi). Muallif savoli pastda.
- Diplom to'g'ridan-to'g'ri (3 davlat): o'zbek 11 yillik diplomi bo'yicha hukumat sahifasida ibora yo'q; universitetga qarab. `tayyorlov_nomi` qo'yilmadi.
- `davlat_grantlari` bo'sh (Q8). `chuqur_qollanma_havola` qo'yilmadi: repo'da davlat qo'llanma sahifasi yo'q (`src/pages/uz/top-admission/qollanma/` da faqat `ariza-zinapoyasi`); sahifada "chuqur qo'llanma tez orada" yorlig'i chiqadi.

`oqish_paytida`/`bitirgandan_keyin` qiymati qisqa o'zbekcha matn (Q2 konventsiyasi: matn = ishlash mumkin), chunki `Fakt.astro` songa birlik qo'shmaydi.

Sinov: `npm run malumot:tasdiq` 8 qoralama; `npm run malumot:tekshir` 3 hujjat, 21 fakt, 0 eskirgan, 13 topilmadi, sxema xatosi yo'q; `npm test` 373/373; `npm run build` o'tdi (qoralama qiymatlar `dist/uz/top-admission/davlatlar/` HTML'da yo'q, faqat davlat nomlari); `npm run repo:tekshir` muammo yo'q. Sinalmagan: sahifa brauzerda ko'rilmadi (bo'sh holat o'zgarmagan, chunki tasdiqlangan fakt yo'q).

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
- **BOSHQARUVCHI, 2026-11-20 (chat almashdi):** Q0–Q7 tugadi. Q8 agenti boshlanishi bilan to'xtatildi (hech narsa yozilmagan) — Q8 boshidan boshlanadi. PR #198 (`admission-d` → `main`) ochiq, MERGE QILINMAYDI; har qismdan keyin `git push origin admission-d` bilan yangilanadi. Q9 da universitet ro'yxati muallifga ko'rsatiladi va tasdig'i kutiladi. Muallif savollari har qism natijasida; Q10 yakuniy hisobotda yig'iladi.
- Q7 tugadi ("Q7 natijasi"). Keyingi: Q8 (davlat grantlari). 15 davlat fayli bor, slug'lar: `aqsh`, `buyuk-britaniya`, `janubiy-koreya`, `germaniya`, `italiya`, `vengriya`, `turkiya`, `xitoy`, `yaponiya`, `kanada`, `avstraliya`, `malayziya`, `polsha`, `saudiya-arabistoni`, `singapur`. Curl maslahati: canada.ca uchun `-A curl/...` (brauzer UA'si bilan javob yo'q), `--http1.1` foydali; daad.de, make-it-in-germany.com, campuschina.org, studyinsaudi.moe.gov.sa curl bilan ochilmadi; oif.gov.hu ~2026-11-23 gacha ishlamaydi. Q8 uchun stipendiumhungaricum.hu "about" sahifasida qoplash ro'yxati bor (WP REST `/wp-json/wp/v2/pages` sahifa ro'yxatini beradi).
- Q6 tugadi ("Q6 natijasi"). Keyingi: Q7. `kurslar.json` da Q7 valyutalari (EUR, HUF, TRY, CNY, JPY, CAD, AUD, MYR, PLN, SAR, SGD) bor, qayta olish shart emas (kerak bo'lsa `https://cbu.uz/uz/arkhiv-kursov-valyut/json/`). Manba iborasini sahifa matnida curl bilan tekshirish foydali (WebFetch iborani qisqartirishi mumkin). `fakt.test.ts` endi haqiqiy `kurslar.json` ni bo'sh deb farazlamaydi.
- Q5 tugadi ("Q5 natijasi (2-agent)"). Migratsiya `20261120120000_admission_xp.sql` faqat branch'da; jonli bazaga muallif qo'llaydi (qadamlar o'sha bo'limda). Keyingi: Q6. Q10 uchun: `npm run db:tekshir` `xavfsizlik_test` dagi eski `contests:SELECT` xatosida to'xtaydi (main'da ham), Q5 sababli emas.
- Q4 tugadi ("Q4 natijasi" bo'limi). Keyingi: Q5 (Ariza zinapoyasi → XP). Q6/Q9 uchun: davlat slug'lari `aqsh`, `buyuk-britaniya`, `janubiy-koreya`; `xalqaro_yordam_turi` yordam yo'q bo'lsa aynan `"yo'q"`; GBP va KRW kurslari `kurslar.json` da bo'lmasa UK/Koreya universitetlari moslikka kirmaydi.
- Q3 tugadi ("Q3 natijasi" bo'limi). Keyingi: Q4. Uslub `grantlar/index.astro` (`gk-*`) va `davlatlar/index.astro` (`dt-*`); URL holati namunasi `grantKatalog.ts`; yon panelga "Menga mos universitet" bandini `src/data/topAdmissionSahifalar.ts` ga qo'sh. Deadline saralash/muddat uchun `deadlineSanasi`, `muddatHolati` (`grantKatalog.ts`) qayta ishlatilishi mumkin.
- Q0 tugadi (faqat `docs/rejalar/admission-holat.md` o'zgardi).
- Q2 tugadi ("Q2 natijasi" bo'limi). Keyingi: Q3. Grantlar sahifasi Q2 uslubida: `davlatlar/index.astro` dagi `dt-*` klasslar va `davlatTaqqos.ts` dagi URL holati namunasi; yon panel bandi `src/data/topAdmissionSahifalar.ts`.
- Q1 tugadi. Q2 uchun eslatma: Faktni `src/components/topAdmission/Fakt.astro` bilan ko'rsat; ma'lumotni `getCollection('davlatlar')` bilan ol; narx saralashda `usdga` + `kurslarBormi` (kurs bo'lmasa saralash o'chadi); kurs fayli `src/data/topAdmission/kurslar.json` ni `kurslarSxema.parse` bilan o'qi. Bo'sh kolleksiya hozir normal holat.

## Muallif uchun savollar
- Q7: Yaponiya `kontrakt_yillik` milliy universitetning 1-yil jami xarajati (kirish to'lovi bilan, 820 000 JPY) bilan yozildi. Shu qoladimi yoki faqat yillik kontrakt (kirish to'lovisiz) kerakmi (unda "topilmadi")?
- Q7: Yaponiya diplomi "yo'q" (12 yil talabi, o'zbek maktabi 11 yil) deb yozildi. 11 yil + akademik litsey/kollej bitirganlar uchun farq bormi; shu talqin ma'qulmi?
- Q7: Polsha yashash summasi uy-joy xarajatidan tashqari (1 010 PLN/oy × 12). Taqqoslash sahifasida bu boshqa davlatlardan past ko'rinadi; izoh kerakmi yoki faktni "topilmadi" qilamizmi?
- Q7: Italiya summasi Hanoy elchixonasidan (Toshkent sahifasi topilmadi); boshqa elchixonalar 783,06 EUR/oy ham yozgan. Toshkentdagi Italiya elchixonasining talaba vizasi sahifasi havolasini bera olasizmi?
- Q7: Vengriya immigratsiya sayti (oif.gov.hu) 2026-11-23 gacha ishlamaydi; Vengriyaning 6 fakti "topilmadi". Q10 dan oldin qayta urinilsinmi?
- Q6: UK viza yashash summasi London tashqarisi bo'yicha (1 171 GBP × 12 = 14 052) yozildi. London (1 529 GBP/oy) asos bo'lsinmi? Va rasmiy talab 9 oy uchun bo'lsa ham ×12 qoidasi qolaveradimi?
- Q6: AQSH va UK uchun "ingliz tilida dastur bor" hukumat sahifasida aniq ibora bilan topilmadi ("topilmadi"), shu sababli "Ingliz tilida dastur bor" filtri ularni ko'rsatmaydi. Boshqa rasmiy manbani (masalan, UCAS yoki EducationUSA, oxirgisi 403 berdi) ishlatishga ruxsat berasizmi yoki o'zingiz qo'shasizmi?
- Q6: Koreya viza yashash summasi elchixonaga qarab farq qiladi; Toshkentdagi Koreya elchixonasining D-2 sahifasi havolasini bera olasizmi?
- Q5: Migratsiyani jonli bazaga qachon qo'llaysiz: merge'dan oldin (tavsiya, aks holda saytdagi zinapoya XP bermaydi, lekin buzilmaydi) yoki merge bilan birga? Qadamlar "Q5 natijasi (2-agent)" da.
- Q5: `npm run db:tekshir` `main` da ham `xavfsizlik_test` X1 (`contests` jadvaliga anon SELECT) bilan yiqiladi. Bu Admission seriyasidan tashqari; alohida branch'da tekshirilsinmi (test eskirganmi yoki huquq ortiqchami)?
- HAL QILINDI (2026-11-20, "Sozlamalar" → "Q5 istisnosi" standarti): Q5 (TO'SIQ): Admission XP uchun yangi migratsiya kerak ("Q5 natijasi", "Kerakli o'zgarish" 1–4). Reja "Supabase'ga migratsiya/RPC qo'shilmaydi" deydi. Shu bitta istisnoga (CHECK ga `admission_step`, `xp_rule` ga qiymat, yangi `admission_step_done` RPC, jadval yo'q) ruxsat berasizmi yoki Q5 bekor qilinadimi?
- HAL QILINDI (2026-11-20, "Sozlamalar" → "Q5 istisnosi" standarti): Q5: XP qiymati: bitta zinapoya uchun 10 XP (umrida bir marta, jami 30). Ma'qulmi?
- HAL QILINDI (2026-11-20, "Sozlamalar" → "Q5 istisnosi" standarti): Q5: `leaderboard()` hamma `xp_events` ni yig'adi, ya'ni Admission XP'si SAT reytingidagi jami ballga ham qo'shiladi. Shu ma'qulmi yoki SAT reytingi faqat SAT turlarini (`kind`) hisoblasinmi? (Ikkinchisi `leaderboard` RPC'sini ham o'zgartirishni talab qiladi.)
- HAL QILINDI (2026-11-20, "Sozlamalar" → "Q5 istisnosi" standarti): Q5: Rejada "belgini olib qayta qo'yish" deyilgan, lekin zinapoyada belgi (checkbox) yo'q, qadam = zinapoyani to'g'ri terish. Shu talqin to'g'rimi yoki zinapoyaga haqiqiy ariza qadamlari uchun checklist (masalan, "Common App akkaunt ochdim") qo'shilishi kerakmi? (Bu yangi interaktiv funksiya, alohida spetsifikatsiya kerak.)
- Q4: Shortlistni hisobga ulash umumiy rozilik bilan ishlaydi: SAT dialogidagi "Import" yoki Top Admission sahifasidagi "Hisobga saqlash" bosilsa, shu brauzerdagi SAT progressi ham, shortlist ham hisobga ko'chadi. Shu ma'qulmi yoki Top Admission uchun alohida rozilik kerakmi? (Alohida rozilik `holat.ts` ni bo'limlarga ajratishni talab qiladi.)
- Q4: SAT dialogi (inglizcha) sanog'ida endi "saved university (Top Admission)" qatori chiqishi mumkin va "Clear local copy" shortlistni ham brauzerdan o'chiradi. Dialog matnida ("SAT progress") buni alohida aytish kerakmi?
- Q4: IELTS bali va byudjet hech qayerga saqlanmaydi (sahifa yangilansa tozalanadi). Ularni brauzerda (localStorage) eslab qolish kerakmi?
- HAL QILINDI (2026-11-20, "Sozlamalar"): Q3: Grant kartasi faqat `nimani_qoplaydi` tasdiqlangan bo'lsa chiqadi (deadline tekshirilmagan bo'lsa ham karta chiqadi, deadline o'rnida "Ma'lumot tekshirilmoqda"). Shu qoida ma'qulmi yoki deadline ham tasdiqlangan bo'lishi shartmi?
- HAL QILINDI (2026-11-20, "Sozlamalar"): Q3: Davlatlarni taqqoslash sahifasidagi grant nomi hozir rasmiy sahifaga olib boradi. Uni Grantlar katalogiga (filtr bilan, `?d=<davlat>`) yo'naltirish kerakmi? (Q2 fayli, Q3 doirasidan tashqari, tegilmadi.)
- Q2: `viza_yashash_summasi` yillik summa deb qabul qilindi (taxminiy xarajat = kontrakt + shu summa). Rasmiy sahifada oylik yoki boshqa davr uchun yozilgan bo'lsa (masalan, 9 oylik), kontent agenti qanday yozsin: aynan rasmiy qiymat (davr izohi bilan, saralashdan chiqariladi) yoki yillikka hisoblanadimi?
- Q2: Header menyusi bo'limda yo'q, shuning uchun "Davlatlarni taqqoslash" Top Admission yon paneliga ("Vositalar") qo'shildi. Bosh sahifadagi `QavatMenyu` ga ham qo'shilsinmi?
- Q1: `docs/tekshiruv/` `.gitignore` da (`tekshiruv/` qoidasi). Tasdiq ro'yxati lokal qolsinmi (hozirgi holat) yoki repoga kirishi uchun `.gitignore` ga istisno qo'shilsinmi?
- Q1: "barqaror" faktlar uchun 180 kun tasdiqlanadimi? (Bitta joyda: `ESKIRISH_KUNLARI`, `src/lib/topAdmission/fakt.ts`.)
- Q0: `ielts_writing_results` ni hisob eksportiga va `docs/maxfiylik-jadvali.md` ga qo'shish kerakmi? (Admission seriyasidan tashqari ish, alohida branch.)
- Q0: AI matnlari (AI Tutor, IELTS Writing) uchun saqlash muddati (masalan, N oydan keyin avtomatik o'chirish) kerakmi yoki "hisob ochiq turguncha" qoladimi? Huquqchi bilan maslahatda ko'riladi.
- Q0: Suhbatdosh boshqa foydalanuvchilarga ochilishidan oldin Gemini (bepul kalit) shartlari va Maxfiylik sahifasi matni tekshiriladimi?
