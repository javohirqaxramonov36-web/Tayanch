# Tayanch: sessiyalar orasida holat (2026-11-05)

Yangi sessiya shu fayldan boshlaydi. Ish qoidalari: `CLAUDE.md`. Dizayn tizimi: `DESIGN.md`. Repo: `javohirqaxramonov36-web/Tayanch`, sayt: https://javohirqaxramonov36-web.github.io/Tayanch/uz/

Muhim: lokal papka nomi `Tayanch-SAT prep`, lekin unda **butun sayt** turibdi (5 qavatning hammasi). Boshqa `Tayanch-*-prep` papkalarida faqat dizayn fayllari bor.

## 1. Sayt tuzilmasi: 5 qavatli bino

| Qavat | Nomi | Manzil | Holat (`bolimlar.ts`) | Nima bor |
| --- | --- | --- | --- | --- |
| 1 | Navigator | `/uz/` | doim ochiq | Bosh sahifa, muddatlar, manbalar, maxfiylik |
| 2 | Top Admission | `/uz/top-admission/` | tez-orada | "Qavat qurilmoqda" sahifasi + Topshirish yo'li vositasi |
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
| #11 | **Topshirish yo'li** (`/uz/top-admission/vosita/topshirish-yoli/`): 3 savol → mos ariza yo'llari, aylanadigan "pasport" kartalar, muhrli rasmiy faktlar. Holati: qoralama |

## 3. Nima qurilmagan (navbat taklifi)

1. **2-qavat Top Admission kirish sahifasi**: maket bor ("Main", "KirishQorongi", "KirishTelefon" artboard'lari). Hozirgi `/uz/top-admission/` qurilmoqda sahifasining o'rnini oladi.
2. **Türkiye Burslari sahifasi**: maket bor ("Burslar*" artboard'lari). Viza sahifasi va chipta detallari DESIGN.md'da tavsiflangan.
3. **Top Admission yon paneli**: `BolimYon` ga `bolim="top-admission"` qo'shiladi (SAT/IELTS kabi). Maket: "LiftSidebar" artboard'i.
4. **5-qavat EYUF**: dizayn fayli hali yo'q.
5. Ochilgandan keyin `bolimlar.ts` da `top-admission` holatini `ochiq` ga o'tkazish (muallif tasdig'i bilan).
6. Tez-oradagi sahifalar: SAT (Kitoblar, Strategiya, Math va Desmos, Reading & Writing, Vaqt va retake), IELTS (Listening, Writing Task 2, Speaking, General English).

Top Admission maketi (Claude Design): https://claude.ai/artifact/1zP2rnjMp46RgY9WpD84GF. Artboard'lar: Main/Kirish (A), Burslar (B), Vosita (C, qurilgan), Lift* (D, qurilgan). Har birining yorug', qorong'i va telefon varianti bor.

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

## 6. Fayl nomlash qoidalari

- **Manzil**: `/uz/<bolim>/<qism>/<sahifa>/`. Kichik lotin harflar, defis, apostrofsiz (qo'llanma → `qollanma`, Türkiye → `turkiye`). Har manzil `/` bilan tugaydi (`trailingSlash: 'always'`).
- **Sahifa fayli**: `src/pages/uz/<bolim>/<qism>/<sahifa>/index.astro`. Qismlar: `mashq/`, `vosita/`, `qollanma/`.
- **Kod nomlari o'zbekcha**: komponentlar PascalCase (`BolimYon`, `QavatYoli`, `TopshirishYoli`), ma'lumot va funksiyalar camelCase (`qavatlar`, `joriyQavat`, `yollarniTanla`), CSS klasslari kichik harf, defis bilan (`yon-past`, `savol-zinasi`).
- **Qoliplar**: `Asosiy` (1-qavat va qurilmoqda sahifalari), `BolimQobiq` (yon panelli bo'lim: `bolim="sat" | "ielts"`), `SatFokus` (yon panelsiz mashq ekrani).
- **Ma'lumot**: `src/data/` (`qavatlar.ts`, `bolimlar.ts`, `manbalar.ts`, `deadline.ts`, `satSahifalar.ts`, `satNamuna.ts`, `ieltsSahifalar.ts`, `topshirishYoli.ts`).
- **Manba ID**: 2 harf + 2 raqam, tashkilot bo'yicha (CB = College Board, IE = ielts.org, ID = IDP, CA = Common App, UC = UCAS, SH = Stipendium Hungaricum, TB = Türkiye Bursları, CO = Coalition, EY = El-yurt umidi, LX = lex.uz).
- **localStorage**: kalit `tayanch:` bilan boshlanadi (`tayanch:mavzu`, `tayanch:sidebar`, `tayanch:sat-javoblar`, `tayanch:sat-lugat`, `tayanch:ielts-reja`; sessionStorage `tayanch:qavat`). Istisno: `tayanch-topshirish-yoli` (3-ochiq savol).
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

- **Node**: standart `node` (v22.23.2) Astro 7 uchun eski. Shunday ishga tushiring: `PATH=/opt/homebrew/bin:$PATH npm run build` (Homebrew Node 26).
- **Lokal ko'rish**: `PATH=/opt/homebrew/bin:$PATH npx astro preview --port 4321` → http://localhost:4321/Tayanch/uz/
- **Vizual tekshiruv**: Playwright Chromium bu mashinada o'rnatilmaydi (yuklanadi, lekin arxivdan chiqarishda to'xtaydi). Shuning uchun `korib-chiquvchi` agenti ishlamaydi. Tekshiruv ilova ichidagi brauzerda (Claude Browser) qilinadi.
- **Agentlar**: `.claude/agents/` (manba-tekshiruvchi, quruvchi, korib-chiquvchi, qoida-qorovuli). Repo sessiyadan keyin klonlangani uchun ular nom bilan chaqirilmadi; general-purpose agentga ularning `.md` fayli o'qitildi.
- **Bir papkada ikki sessiya ishlamasin.** 2026-11-05 da parallel sessiya `DESIGN.md` va `tokens.css` ni o'zgartirgan, bu o'zgarishlar boshqa commit'ga aralashib ketdi.
- **Prototip branch**: `prototip-topshirish-yoli` (`prototip/topshirish-yoli.html`). Saytga chiqmaydi.
- **Joylash**: `main` ga push bo'lganda GitHub Actions saytni quradi (`.github/workflows/deploy.yml`).
