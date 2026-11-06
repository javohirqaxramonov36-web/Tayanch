# Tayanch: sessiyalar orasida holat (2026-11-06)

Yangi sessiya shu fayldan boshlaydi. Ish qoidalari: `CLAUDE.md`. Dizayn tizimi: `DESIGN.md`. Repo: `javohirqaxramonov36-web/Tayanch`, sayt: https://javohirqaxramonov36-web.github.io/Tayanch/uz/

Muhim: lokal papka nomi `Tayanch-SAT prep`, lekin unda **butun sayt** turibdi (5 qavatning hammasi). Boshqa `Tayanch-*-prep` papkalarida faqat dizayn fayllari bor.

## 1. Sayt tuzilmasi: 5 qavatli bino

| Qavat | Nomi | Manzil | Holat (`bolimlar.ts`) | Nima bor |
| --- | --- | --- | --- | --- |
| 1 | Navigator | `/uz/` | doim ochiq | Bosh sahifa, muddatlar, manbalar, maxfiylik |
| 2 | Top Admission | `/uz/top-admission/` | tez-orada (ochish muallif qarori bilan) | Kirish sahifasi (qoralama) + Topshirish yo'li vositasi |
| 3 | SAT prep | `/uz/sat/` | ochiq | To'liq bo'lim |
| 4 | IELTS prep | `/uz/ielts/` | ochiq | To'liq bo'lim |
| 5 | EYUF prep | `/uz/eyuf/` | tez-orada | Faqat "qavat qurilmoqda" sahifasi |

## 2. Nima qurilgan (hammasi `main`da va saytda)

| PR | Nima |
| --- | --- |
| #4, #5, #6 | Astro poydevori, bosh sahifa (hikoya, muallif yo'li, maqsad testi), rasmiy manbalar va muddatlar |
| #7 | **SAT bo'limi** (`Tayanch-SAT-dizayn.md`): yon panel, qorong'i mavzu, SAT bosh sahifa, Mashq testi, Savol banki, Mening natijalarim, Lug'at. Kitoblar va 4 ta qo'llanma "tez orada" |
| #8 | **IELTS bo'limi** (`Tayanch-IELTS-dizayn.md`): kirish, Reading qo'llanmasi (mini-mashq bilan), 30 kunlik reja. Listening, Writing Task 2, Speaking, General English "tez orada" |
| #9 | Bo'limlar bitta saytga bog'landi (SAT va IELTS ochildi) |
| #10 | **Tayanch binosi**: Lift (5 qavat tugmasi; telefonda pastki panel), Qavat yo'li ("3-qavat › Mashq › Test"), Zina (qo'shni qavatlar), 2- va 5-qavat "qurilmoqda" sahifalari |
| #12, #14 | **Top Admission kirish sahifasi** (maket A): Topshirish yo'li kartasi, muddat chiptalari muhr bilan (EY01, TB01), yo'nalishlar (TB01, SH01), muallif bloki, Zina, MRZ. `Asosiy` qolipida (yon panelsiz). Chiptada qolgan kun (brauzer, Toshkent sanasi) va "Mening yo'lim" bloki (`tayanch-topshirish-yoli` dan faqat o'qiydi). `bolimlar.ts`: top-admission `tez-orada` (muallif qarori, 2026-11-05). #14: "Muallif yo'li" nomi `h2`. Sinalgan (2026-11-05): muddat holatlari (Bugun, kun ochilishiga, kun qoldi, O'tgan), 375px, qorong'i mavzu, Tab tartibi, a11y semantikasi, jonli sayt. Sinalmagan: haqiqiy VoiceOver |
| #15 | **SAT Math interaktiv darslari, 1-bosqich** (branch `sat-interaktiv`): Hajm (3D, `three` npm, kechiktirib yuklanadi), Funksiya grafigi, Birlik aylana, Statistika (SVG), Reja tuzgich. 21 ta savol `src/data/satDarslar/` (`verified: false`); `npm run savollar:tekshir`, jadval `docs/sat-savollar-tekshiruv.md`. Keyingi: 2-bosqich Reading & Writing, 3-bosqich Xato daftari va takrorlash |
| #18 | **Interaktiv dars standarti** (0-bosqich, branch `dars-standarti`, merge 2026-11-06) `docs/interaktiv-dars-standarti.md` (barcha qavatlar uchun qoidalar). `DarsQolip` umumlashtirildi: `bolim`, `savollar`, `yolBandlari`, `darsTuri`, `imtihon`, `manbalar`, sanalar, `keyingi.href` prop. Umumiy turlar `src/data/darsTurlar.ts`, saqlash kalitlari `tayanch:<bolim>-dars-progress` / `-xato-daftari`. `BolimYon`/`BolimQobiq` 4 bo'limni qabul qiladi (Top Admission va EYUF: minimal panel). Savol skripti `src/data/*Darslar/tekshiruv.ts` ni o'zi topadi, jadval `docs/<bolim>-savollar-tekshiruv.md`. Sinalgan (2026-11-06): 4 ta SAT darsi origin/main bilan computed style bo'yicha bir xil (390/1280), mashq, xato daftari, o'chirish tasdig'i, 3D yuklanishi. Sinalmagan: TypeScript (`tsc` yo'q), Top Admission/EYUF minimal paneli (hali ishlatilmaydi) |
| #20 | **SAT Reading & Writing darslari, 1-bosqich, 1–2-modul** (branch `sat-reading-writing`): `/uz/sat/qollanma/reading-writing/xatoni-toping/` (Standard English Conventions: vergul, nuqtali vergul, ikki nuqta, ega va fe'l, zamon) va `/dalil/` (Information and Ideas). `DarsQolip` ga ixtiyoriy `belgilash` (so'z yoki gap, `src/lib/belgilashGuruh.ts`: `<button aria-pressed>`, roving tabindex, strelka/Home/End, Enter) va `qadamNomlari` prop qo'shildi; Math o'zgarmadi. 10 ta savol `src/data/satDarslar/rw-*.ts` (`verified: false`), ikkinchi usul `rw-tekshiruv.ts` (qoida jadvali / gap belgilari). Manba CB06. Modul nomlari `rw-xato`, `rw-dalil` (kalitlar o'sha `tayanch:sat-dars-progress` / `-xato-daftari`). Sinalgan (2026-11-06): 1280 va 390, qorong'i mavzu, Enter bilan belgilash, joy/tuzatish oqimi, xato daftari, Math darsi. Sinalmagan: haqiqiy VoiceOver, haqiqiy telefonda barmoq |
| #21 | **SAT R&W 3–4-modul** (branch `sat-rw-otish-lugat`, PR #21 da merge qilingan): `/uz/sat/qollanma/reading-writing/otish-sozlari/` (Expression of Ideas: munosabat jadvali qarama-qarshilik, sabab-natija, misol, davom; sahnada 4 misol juft, munosabatni tanlash) va `/lugat-kontekstda/` (Craft and Structure: kontekst ishorasi, ko'p ma'noli so'z; sahnada ishora so'zni belgilash). 10 ta savol `rw-otish.ts`, `rw-lugat.ts` (`verified: false`), ikkinchi usul `rw-tekshiruv.ts` (munosabat jadvali; ishora + ohang/ma'no belgilari), 41 savol 0 farq. `DarsQolip` ga ixtiyoriy `savolTili`, `savolKorsatma` prop va `xulosa-oxiri` slot (Math HTML o'zgarmadi). Lug'at darsi `tayanch:sat-lugat` ni faqat o'qiydi ("bilaman"/"o'rganyapman" soni). Manba faqat CB06 (skill nomlari "Transitions", "Words in Context" rasmiy manbada tekshirilmagan). Sinalgan (2026-11-06): 1024 va 375, qorong'i mavzu, laboratoriya, strelka/End, mashq, Xato daftari (`lang="en"`), lug'at kaliti o'zgarmasligi. Sinalmagan: 1280 kenglik (oyna 1024), haqiqiy VoiceOver, haqiqiy telefon |
| #22 | **SAT Xato daftari: takrorlash** (interaktiv darslar 2-bosqich, branch `sat-xato-daftari`, PR #22 da merge qilingan): `/uz/sat/vosita/takrorlash/`. Darslardagi xatolar (`tayanch:sat-xato-daftari`, faqat o'qiladi) Leitner qutilariga tushadi: yangi kalit `tayanch:sat-takrorlash` (`{versiya:1, savollar:{[id]:{quti, keyingi, xatoSana}}}`, muallif ruxsati 2026-11-06). Oraliqlar 1, 3, 7, 14 kun (Tayanch tanlovi); 4-qutida to'g'ri = o'zlashtirildi; darsda qayta xato 1-qutiga qaytaradi. Javob `javobniYoz()` orqali yoziladi (dars progressi va daftar o'z shaklida). Mantiq `src/lib/takrorlash.ts`. "Xatoni toping" savollarida joy belgilash bosqichi yo'q, faqat tuzatish. `DarsQolip` ga ixtiyoriy `takrorlashHref` (daftar blokida havola), yon panelda "Xato daftari: takrorlash", Reja tuzgich vazifasi havolasi. Sinalgan (2026-11-06): 1280 qorong'i, 375 yorug', klaviatura (Tab, strelka, Enter), qutilar o'tishi, o'zlashtirildi, "hozir takrorlash", daftar va progress yozilishi. Sinalmagan: haqiqiy VoiceOver, haqiqiy telefon, bir nechta tab bir vaqtda ochiq bo'lishi |
| #23 | **IELTS Reading interaktiv darslari** (interaktiv darslar 3-bosqich, branch `ielts-interaktiv`, PR #23 da merge qilingan): `/uz/ielts/qollanma/reading/tfng/` (True / False / Not Given: sahnada dalil gapni belgilash yoki "Bunday gap yo'q", keyin javob) va `/sarlavhalar/` (Matching headings: A paragraf namuna sifatida oldindan moslangan, B va C ga sarlavha tanlanadi, bittasi ortiqcha). 10 ta savol `src/data/ieltsDarslar/` (`verified: false`), ikkinchi usul `tekshiruv.ts` (TFNG: har gap mos/zid/aloqasiz + dalil ibora; sarlavha: majburiy qismlar qamrovi), 0 farq, jadval `docs/ielts-savollar-tekshiruv.md`. Umumiy turga ixtiyoriy `parcha` maydoni, `DarsQolip` uni savol matni ustida ko'rsatadi (SAT HTML o'zgarmadi). Kalitlar `tayanch:ielts-dars-progress` / `-xato-daftari`. Yon panelda "Reading darslari" guruhi, Reading qo'llanmasidan havola. Manba IE02 (2026-11-06 qayta tekshirildi: savol turlari nomi va ta'rifi). IELTS takrorlash sahifasi yo'q (alohida PR). Sinalgan (2026-11-06): 375 yorug', 1280 qorong'i, laboratoriya oqimlari, mashq, Xato daftari va kalitlar. Sinalmagan: haqiqiy VoiceOver, haqiqiy telefon, klaviatura faqat qisman (dasturiy bosish) |
| #25 | **Top Admission: Ariza zinapoyasi** (interaktiv darslar 4-bosqich, branch `top-admission-zinapoya`, PR #25 da merge qilingan): `/uz/top-admission/qollanma/ariza-zinapoyasi/`. Sahnada 4 pog'onali zinapoya: Misol qadamida Türkiye Bursları (TB01) pog'onama-pog'ona to'ladi, Sinab ko'r qadamida Common App, UCAS yoki Türkiye Bursları kartalari pog'onalarga qo'yiladi (ko'chirish va almashtirish bor). Boshlang'ich yo'l `tayanch-topshirish-yoli` dagi davlatdan (faqat o'qiladi). Yo'llar `src/data/topAdmissionDarslar/zinapoyalar.ts`, 5 savol `ta-zinapoya.ts` (`verified: false`), ikkinchi usul `tekshiruv.ts` (TB01 oylari, `kerak` bog'lanishlari, manba izohi), 0 farq, jadval `docs/top-admission-savollar-tekshiruv.md`. Manbalar TB01, UC01, CA02, CA01. Common App va UCAS tartibi Tayanch tavsiyasi. Kirish sahifasidan havola. Kalitlar `tayanch:top-admission-dars-progress` / `-xato-daftari`. Sinalgan (2026-11-06): 1280 qorong'i, 375 yorug', klaviatura (strelka, Enter), joylash va tekshirish, mashq va Xato daftari, kontrast. Sinalmagan: haqiqiy VoiceOver, haqiqiy telefon |
| #11 | **Topshirish yo'li** (`/uz/top-admission/vosita/topshirish-yoli/`): 3 savol → mos ariza yo'llari, aylanadigan "pasport" kartalar, muhrli rasmiy faktlar. Holati: qoralama |

## 3. Nima qurilmagan (navbat taklifi)

1. **Türkiye Burslari sahifasi**: maket bor ("Burslar*" artboard'lari). Viza sahifasi va chipta detallari DESIGN.md'da tavsiflangan.
2. **Top Admission yon paneli**: `BolimYon` ga `bolim="top-admission"` qo'shiladi (SAT/IELTS kabi). Maket: "LiftSidebar" artboard'i. Shundan keyin kirish va vosita sahifalari `BolimQobiq` ga o'tadi.
3. **5-qavat EYUF**: dizayn fayli hali yo'q.
4. **SAT R&W 3- va 4-modul**: PR #21 da merge qilingan (2-bo'limga qarang). Eslatma: 3 "O'tish so'zlari" (transitions; ma'no munosabati jadvali: qarama-qarshilik, sabab, misol, davom). Domen "Expression of Ideas" CB06 da bor; "Transitions" skill nomi faqat Student Question Bank sahifasida (taklif: CB07, brauzerda aynan yozilishi tekshirilmagan). 4 "Lug'at kontekstda" (Craft and Structure): mavjud `mashq/lugat/` va `tayanch:sat-lugat` ni faqat o'qiydi, buzmaydi.
5. **Interaktiv darslar rejasi** (har biri alohida branch va PR, standart: `docs/interaktiv-dars-standarti.md`): 1 SAT Reading & Writing (`sat-reading-writing`), 2 SAT Xato daftari va takrorlash, 3 IELTS interaktiv, 4 Top Admission ariza zinapoyasi, 5 EYUF dizayn va suhbat simulyatori, 6 yakuniy sifat tekshiruvi. 0-bosqich (PR #18), 1-bosqich (R&W, PR #20, #21) va 2-bosqich (Xato daftari, PR #22 da merge qilingan) tugagan; 3-bosqich IELTS interaktiv (Reading: TFNG, Matching headings) PR #23 da, 4-bosqich Top Admission ariza zinapoyasi PR #25 da merge qilingan. Keyingi IELTS qadamlari: takrorlash (`tayanch:ielts-takrorlash`, `takrorlash.ts` ni umumlashtirish), Listening (audio kerak). PR #17 merge bo'lgach: mashq xatolarini (`tayanch:sat:v1`) takrorlash navbatiga qo'shish alohida PR'da.
6. Tez-oradagi sahifalar: SAT (Kitoblar, Strategiya, Math va Desmos, Reading & Writing, Vaqt va retake), IELTS (Listening, Writing Task 2, Speaking, General English).

Top Admission maketi (Claude Design): https://claude.ai/artifact/1zP2rnjMp46RgY9WpD84GF. Artboard'lar: Main/Kirish (A, qurilgan), Burslar (B), Vosita (C, qurilgan), Lift* (D, qurilgan). Har birining yorug', qorong'i va telefon varianti bor.

## 4. Qabul qilingan qarorlar

- **Bitta sayt, 5 qavat.** Qavatlar `src/data/qavatlar.ts` da; 2–5 holati `bolimlar.ts` dan olinadi, qo'lda takrorlanmaydi.
- **Navigatsiya**: bo'limlar orasida faqat Lift; menyuda "Muddatlar" va "Manbalar" qoladi. "Tez orada" qavatga kirsa bo'ladi ("qavat qurilmoqda" sahifasi).
- **Dizayn manbasi**: har bo'lim uchun Claude Design maketi. Maket ko'rinish uchun, prototip yoki prompt mantiq va matn uchun. Ziddiyat bo'lsa to'xtab muallifdan so'raladi.
- **Palitra**: oq, qora, ko'k (`#4255ff`). Yagona istisno: ogohlik juftligi (yorug' `#fff4e5`/`#8a3b0a`, qorong'i `#33240f`/`#ffc98a`).
- **Qorong'i mavzu**: tokenlar `:root[data-mavzu='qorongi']` da. Boshlang'ich holat `prefers-color-scheme` dan, tanlov `localStorage` da, `<head>` dagi inline skript miltillashni oldini oladi.
- **Faktlar**: faqat `manbalar.ts` dagi `tekshiruvDarajasi: 'rasmiy'` manba bilan. Topshirish yo'lida ID topilmasa yoki rasmiy bo'lmasa build xato beradi.
- **Namuna ma'lumot** (SAT savollari, so'zlar, savol banki raqamlari, natijalar namunasi) ekranda "Namuna" deb belgilangan. Muallif SAT uchun buni "to'liq qo'lla" deb tasdiqlagan.
- **Ball, qabul yoki grant ehtimoli hisoblanmaydi.** Login, to'lov va narx yo'q.
- **Yangi sahifa holati "qoralama"** (`noindex`). "chop-etilgan" ga faqat muallif aytganda o'tkaziladi.
- **Ish tartibi**: har vazifa yangi branch'da → PR → muallif "merge qil" deganidan keyin merge. `main` ga to'g'ridan-to'g'ri yozilmaydi.

## 5. Ochiq savollar (muallif javobi kerak)

1. Topshirish yo'li:
   - kartalardagi umumiy qadamlar matni to'g'rimi;
   - "Boshqa davlat" uchun Pathway (Kaplan) kartasi qolsinmi;
   - sahifa qachon "chop-etilgan" bo'ladi.
2. Pasport to'ri: maketda 20px va `--chiziq`, DESIGN.md'da 24px va `--sirt-ikkinchi`. Kod hozir maket bo'yicha. Qaysi biri to'g'ri?
3. Saqlash kaliti: Topshirish yo'li `tayanch-topshirish-yoli` ishlatadi (prompt shunday degan), CLAUDE.md esa `tayanch:` prefiksini talab qiladi. `tayanch:topshirish-yoli` ga o'tkazilsinmi?
4. Manba izohida aniq yozilmagan ikki fakt: TB01 "tbbs.turkiyeburslari.gov.tr portali orqali" va CO01 "har qanday talaba uchun bepul". Ularni qayta tekshirish kerak.
5. Eski ochiq PR #3 ("SAT kirish sahifasi", Jekyll davridan): yopilsinmi?
6. IELTS va EYUF uchun "bog'liq emaslik" eslatmasi matni tekshirilmagan (IELTS'da "matn tekshiriladi" yorlig'i turibdi).
7. British Council'ning bepul mashq testlari sahifasiga bu mashinadan ulanib bo'lmadi: IELTS'dagi qatori "tekshirilmoqda".
8. Telegram kanal manzili hali yo'q (hamma joyda "tez orada").
9. 2-qavat Top Admission qachon `ochiq` bo'ladi (`bolimlar.ts`) va kirish sahifasi qachon "chop-etilgan" bo'ladi.
10. Hal qilindi (2026-11-06): PR #17 `tayanch:sat-xato-daftari` ni ishlatmaydi, uning kaliti `tayanch:sat:v1`. Daftarni faqat darslar yozadi, takrorlash sahifasi uni faqat o'qiydi. PR #17 `BolimYon.astro` ni ham o'zgartiradi: PR #18 merge bo'lgani uchun PR #17 da konflikt chiqishi mumkin, u branch'da hal qilinadi.

## 6. Fayl nomlash qoidalari

- **Manzil**: `/uz/<bolim>/<qism>/<sahifa>/`. Kichik lotin harflar, defis, apostrofsiz (qo'llanma → `qollanma`, Türkiye → `turkiye`). Har manzil `/` bilan tugaydi (`trailingSlash: 'always'`).
- **Sahifa fayli**: `src/pages/uz/<bolim>/<qism>/<sahifa>/index.astro`. Qismlar: `mashq/`, `vosita/`, `qollanma/`.
- **Kod nomlari o'zbekcha**: komponentlar PascalCase (`BolimYon`, `QavatYoli`, `TopshirishYoli`), ma'lumot va funksiyalar camelCase (`qavatlar`, `joriyQavat`, `yollarniTanla`), CSS klasslari kichik harf, defis bilan (`yon-past`, `savol-zinasi`).
- **Qoliplar**: `Asosiy` (1-qavat va qurilmoqda sahifalari), `BolimQobiq` (yon panelli bo'lim: `bolim="sat" | "ielts"`), `SatFokus` (yon panelsiz mashq ekrani).
- **Ma'lumot**: `src/data/` (`qavatlar.ts`, `bolimlar.ts`, `manbalar.ts`, `deadline.ts`, `satSahifalar.ts`, `satNamuna.ts`, `ieltsSahifalar.ts`, `topshirishYoli.ts`).
- **Manba ID**: 2 harf + 2 raqam, tashkilot bo'yicha (CB = College Board, IE = ielts.org, ID = IDP, CA = Common App, UC = UCAS, SH = Stipendium Hungaricum, TB = Türkiye Bursları, CO = Coalition, EY = El-yurt umidi, LX = lex.uz).
- **localStorage**: kalit `tayanch:` bilan boshlanadi (`tayanch:mavzu`, `tayanch:sidebar`, `tayanch:sat-javoblar`, `tayanch:sat-lugat`, `tayanch:ielts-reja`, `tayanch:sat-dars-progress`, `tayanch:sat-xato-daftari`, `tayanch:sat-takrorlash`, `tayanch:sat-reja`, `tayanch:ielts-dars-progress`, `tayanch:ielts-xato-daftari`, `tayanch:top-admission-dars-progress`, `tayanch:top-admission-xato-daftari`; sessionStorage `tayanch:qavat`). Istisno: `tayanch-topshirish-yoli` (3-ochiq savol).
- **Dizayn fayllari** repo ildizida: `Tayanch-SAT-dizayn.md`, `Tayanch-IELTS-dizayn.md`. Top Admission maketi faqat Claude Design'da (havola yuqorida).
- **Branch nomi**: o'zbekcha, defis bilan (`lift-navigatsiya`, `vosita-topshirish-yoli`).

## 7. Dizayn qoidalari (qisqa; to'liq: DESIGN.md)

- Qiymatlar faqat `src/styles/tokens.css` dan: rang, bo'shliq (`--b-*`), radius (`--r-*`), matn (`--matn-*`). Yangi rang yoki token faqat muallif ruxsati bilan va DESIGN.md jadvaliga yoziladi.
- Shrift: Figtree (`--shrift`, saytning o'zidan yuklanadi, Google Fonts havolasi yo'q).
- Tugma kamida 48px (yon panel qatorlari 44px, SAT dizayni bo'yicha istisno). Fokus: 3px ko'k chegara. Tugma faqat `<button>` yoki `<a>`, ikonka inline SVG, emoji emas.
- Har sahifa 390px va 1280px da, yorug' va qorong'i mavzuda ishlashi kerak. Gorizontal scroll yo'q. Telefonda pastki lift kontentni yopmaydi (`body` pastki bo'shlig'i va `scroll-padding-bottom` global.css'da).
- Har sahifa tepasida Qavat yo'li, qavat kirish sahifasi pastida Zina, oxirida manbalar va tekshiruv bloki (`SahifaOxiri` yoki `ManbaBlok`).
- Animatsiyalar `prefers-reduced-motion` da o'chadi.
- Taqiqlar: gradient fon, glassmorphism, qizil ta'kid, uydirma raqam, sharh yoki ism, "kafolat" ("Natija kafolatlanmaydi" inkoridan tashqari), "Official", "100% grant".

## 8. Texnik eslatmalar

- **Interaktiv darslar**: yangi dars oldidan `docs/interaktiv-dars-standarti.md` o'qiladi. Yangi bo'lim savollari `src/data/<bolim>Darslar/` + `tekshiruv.ts`; `npm run savollar:tekshir` 0 farq.
- **Node**: standart `node` (v22.23.2) Astro 7 uchun eski. Shunday ishga tushiring: `PATH=/opt/homebrew/bin:$PATH npm run build` (Homebrew Node 26).
- **Lokal ko'rish**: `PATH=/opt/homebrew/bin:$PATH npx astro preview --port 4321` → http://localhost:4321/Tayanch/uz/
- **Vizual tekshiruv**: Playwright Chromium bu mashinada o'rnatilmaydi (yuklanadi, lekin arxivdan chiqarishda to'xtaydi). Shuning uchun `korib-chiquvchi` agenti ishlamaydi. Tekshiruv ilova ichidagi brauzerda (Claude Browser) qilinadi.
- **Agentlar**: `.claude/agents/` (manba-tekshiruvchi, quruvchi, korib-chiquvchi, qoida-qorovuli). Repo sessiyadan keyin klonlangani uchun ular nom bilan chaqirilmadi; general-purpose agentga ularning `.md` fayli o'qitildi.
- **Bir papkada ikki sessiya ishlamasin.** 2026-11-05 da parallel sessiya `DESIGN.md` va `tokens.css` ni o'zgartirgan, bu o'zgarishlar boshqa commit'ga aralashib ketdi.
- **Prototip branch**: `prototip-topshirish-yoli` (`prototip/topshirish-yoli.html`). Saytga chiqmaydi.
- **Joylash**: `main` ga push bo'lganda GitHub Actions saytni quradi (`.github/workflows/deploy.yml`).
