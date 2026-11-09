# Tayanch: dizayn tizimi

Yo'nalish: **hikoyali bosh sahifa va o'yinli mashqlar** (Quizlet'dan ilhomlangan interaktivlik). Oq fon, qora tipografiya va chegaralar, ko'k ta'kid, yumaloq tugmalar. Asos maket: Claude Design'dagi "Tayanch bosh sahifa maketlari", "Hikoya (v2)" sahifasi (2026-11-04). Bosh sahifa tuzilmasi: loyihadagi `BRIEF-bosh-sahifa.md`.

Kodda qiymat yozilmaydi, faqat `src/styles/tokens.css` dagi nomlar ishlatiladi.

## Rang

Palitra: **oq, qora, ko'k** (2026-11-04 qarori). Bo'limlar rang bilan emas, ikonka va karta ichidagi mazmun bilan farqlanadi.

| Token | Qiymat | Roli |
| --- | --- | --- |
| `--rang-asosiy` | `#4255ff` | Ko'k: asosiy tugmalar, havolalar, progress, ta'kid so'zlar, ikonkalar |
| `--rang-asosiy-toq` | `#2f40e0` | Ko'k tugma hover |
| `--rang-asosiy-chuqur` | `#2433b8` | Topshirish yo'li: 3D pog'onaning yon yuzi (ikkala mavzuda) |
| `--rang-asosiy-qorada` | `#8b97ff` | Qora fon ustidagi ko'k (timeline chizig'i va nuqtalari) |
| `--fon` | `#ffffff` | Sahifa foni |
| `--fon-ikkinchi` | `#f5f6fa` | Tinch sahna foni, ichki kartalar |
| `--sirt-ikkinchi` | `#eceef3` | Neytral yorliq, ikkinchi darajali tugma |
| `--chiziq` / `--chiziq-kuchli` | `#e6e8ee` / `#dfe2ea` | Ajratuvchi va variant tugmasi chegarasi (forma maydoniga emas: fon ustida 1.30:1) |
| `--chiziq-maydon` | = `--matn-sust` | Forma maydoni (input, select, textarea) chegarasi. WCAG 1.4.11 (kamida 3:1): fon ustida 6.27:1, `--fon-ikkinchi` ustida 5.80:1 (2026-11-09) |
| `--matn` = `--qora` | `#0f1115` | Asosiy matn, qora sahna, karta chegarasi (1.5px) |
| `--matn-ikkinchi` | `#4a5063` | Tavsiflar |
| `--matn-sust` | `#5a6072` | Yorliqlar, izohlar |
| `--qora-sirt` / `--qora-chiziq` | `#1b1e26` / `#2a2e38` | Qora sahna ichidagi kartalar va chiziqlar |
| `--qora-matn-ikkinchi` | `#b4b9c8` | Qora fondagi ikkinchi darajali matn |

Qora sahna sahifada faqat bitta: bosh sahifadagi cho'qqi (muallif yo'li).
Matn ko'rinishidagi havola va ta'kid uchun `--rang-havola` (yorug'da `#4255ff`). Telefonda panel orqasidagi parda: `--parda`.

### Qorong'i mavzu (2026-11-04, S1)

`:root[data-mavzu='qorongi']` ichida tokenlar qayta beriladi. Yangi rang yo'q: faqat yuqoridagi oq, qora, ko'k va kulranglar. Yagona istisno: ogohlik juftligi (2026-11-05 qarori, quyida).

| Token | Qorong'i qiymat |
| --- | --- |
| `--fon`, `--sirt` | `#0f1115` |
| `--fon-ikkinchi` | `#1b1e26` |
| `--sirt-ikkinchi`, `--chiziq`, `--chiziq-kuchli` | `#2a2e38` |
| `--matn` | `#ffffff` |
| `--matn-ikkinchi`, `--matn-sust`, `--chiziq-maydon` | `#b4b9c8` (maydon chegarasi fon ustida 9.64:1, `--fon-ikkinchi` ustida 8.50:1) |
| `--rang-asosiy` | `#4255ff` (fon sifatida, oq matn bilan) |
| `--rang-havola` | `#8b97ff` (qora fondagi matn) |
| `--rang-ogoh-fon` / `--rang-ogoh-matn` | `#33240f` / `#ffc98a` ("tekshirish kerak" yorlig'i; yorug'da `#fff4e5` / `#8a3b0a`). Oldingi `#1b1e26` / oq juftligi ogohlikni oddiy yorliqdan ajratmas edi |

Boshlang'ich holat `prefers-color-scheme` dan. Tanlov `localStorage` da (`tayanch:mavzu`), `<head>` dagi inline skript sahifa chizilishidan oldin `data-mavzu` qo'yadi, shuning uchun rang miltillamaydi. Tanlov tugmasi hozircha faqat SAT yon panelida.

Brauzerda saqlanadigan hamma kalit `tayanch:` bilan boshlanadi (`tayanch:mavzu`, `tayanch:sidebar`, `tayanch:sat-javoblar`, `tayanch:sat-lugat`, `tayanch:ielts-reja`). Natijalar sahifasidagi "Natijalarni o'chirish" tugmasi faqat `tayanch:sat-javoblar` ni o'chiradi.

## Tipografiya

Bitta oila: **Figtree** (Google Fonts, OFL litsenziya), `@fontsource-variable/figtree` orqali saytning o'zidan yuklanadi (tashqi so'rov yo'q).

| Token | O'lcham / qator | Qalinlik | Qayerda |
| --- | --- | --- | --- |
| `--matn-h1` | 46px / 1.12 (telefonda 34px) | 800 | Sahifa sarlavhasi |
| `--matn-h2` | 32px / 1.2 (telefonda 26px) | 800 | Bo'lim sarlavhasi |
| `--matn-h3` | 24px / 1.25 | 800 | Karta sarlavhasi |
| `--matn-katta` | 18px / 1.6 | 400 | Kirish matni |
| `--matn-asosiy` | 16px / 1.6 | 400 | Oddiy matn |
| `--matn-kichik` | 14px / 1.5 | 500 | Izoh, yorliq |
| `--matn-mayda` | 13px / 1.4 | 700 | Ustki yorliq (`1 · BOSHLASH`) |

Qator uzunligi 60–75 belgi (`max-width: 62ch`).

## Bo'shliq

4 ga asoslangan shkala: `--b-1` 4px, `--b-2` 8px, `--b-3` 12px, `--b-4` 16px, `--b-5` 20px, `--b-6` 24px, `--b-8` 32px, `--b-10` 40px, `--b-14` 56px, `--b-16` 64px.
Kontent kengligi: `--kenglik` 1200px, yon chekka 20px. Bo'limlar orasi: 56–64px.

## Shakl va chuqurlik

- Radius: `--r-kichik` 6px, `--r-logo` 10px, `--r-yon` 12px, `--r-orta` 16px, `--r-katta` 24px, `--r-toliq` 999px.
- Soya: faqat bitta, `--soya` `0 4px 16px rgba(40,46,62,0.08)`. Faqat asosiy interaktiv karta (test, kartochka) uchun.

## Komponentlar

- **Tugma.** Asosiy: `--rang-asosiy` fon, oq matn, to'liq yumaloq, balandlik kamida 48px. Ikkinchi darajali: `--sirt` yoki `--sirt-ikkinchi` fon. Hover: ozgina to'qroq. Fokus: 3px `--rang-asosiy` chegara. Tugma faqat `<button>` yoki `<a>`.
- **Variant tugmasi** (test javobi): oq, 2px `--chiziq-kuchli` chegara, `--r-orta`, chapga tekislangan matn, balandlik 56px.
- **Bo'lim kartasi**: oq fon, 1.5px qora chegara, `--r-katta`, ko'k chiziqli ikonka. Hover: qora ofset soya. Bitta karta (SAT) qora bo'lishi mumkin.
- **Yorliq (pill)**: `--r-toliq`, 13px qalin matn. "Tez orada" = `--sirt-ikkinchi`.
- **Progress**: 8px balandlik, `--r-toliq`, to'ldirish `--rang-asosiy`.
- **SAT bo'limi dizayni** (2026-11-04): asos `Tayanch-SAT-dizayn.md` (Claude Design kanvasi, 6 ekran: Main, Mashq, Telefon, Natijalar, Lug'at, Savol banki). Ekranlardagi savol, so'z va raqamlar namuna, saytga qo'yilmaydi. Hammasi qo'llangan: yon panel, SAT kirishi (hero, qora "Imtihon tuzilmasi" kartasi CB03 raqamlari bilan, 3 qadam, sahifalar guruhlari), telefon ko'rinishi, Mashq testi va Lug'at (yon panelsiz "fokus" qolipi `SatFokus`), Savol banki, Mening natijalarim. Namuna savollar va so'zlar `src/data/satNamuna.ts` da, ekranda "Namuna" deb belgilangan. Natijalar haqiqiy javoblarni ko'rsatadi; javob bo'lmasa namuna chiqadi va "Namuna ma'lumot" yorlig'i turadi.
  - Yon panel qatori: 44px, `--r-yon` 12px, faol qator ko'k fon va oq matn, ikonkalar ko'k. Qo'llanmalar ikonkasiz, 44px chapdan surilgan. Bu yerdagi kichik tugmalar 44px (umumiy 48px qoidasidan istisno, dizayn bo'yicha).
  - Katta tugma: 52px, to'liq yumaloq, 800 qalinlik. Telefonda to'liq kenglik.
- **IELTS bo'limi dizayni** (2026-11-05): asos `Tayanch-IELTS-dizayn.md` (7 ekran: kirish, Reading qo'llanma, 30 kunlik reja; har biri telefon varianti bilan). SAT'dan farqlari: yon panel qatori 48px va `--r-orta` 16px, matn 16px; "tez orada" bandlar havola emas (kulrang ikonka va yorliq, Tab bilan o'tilmaydi); logo radiusi `--r-kichik`; pastda Telegram bandi. Sahifadagi yagona soya: kirishda reja kartasi, qo'llanmada mini-mashq, rejada savol kartasi. "Manbalar va tekshiruv" bloki `ManbaBlok`. Kvadrat qavsdagi joylar rasmiy manbadan to'ldirildi (IE01–IE03, ID01); tekshirib bo'lmaganlari "tekshirilmoqda" deb qoldi.
- **Bo'lim yon paneli** (`BolimYon`, `bolim="sat" | "ielts"`, qolip `BolimQobiq`): 1024px va undan kengda chapda doimiy (`--yon-kenglik` 288px), yig'ilganda `--yon-yigilgan` 72px. Undan torda ustki qatordagi hamburger tugmasi panelni chapdan chiqaradi: Esc yopadi, fokus panel ichida qoladi, qolgan sahifa `inert`. Pastda "Tayanch bosh sahifasi" havolasi va mavzu tugmasi (dizayn bo'yicha).
- **Tayanch binosi** (2026-11-05, muallif qarori): sayt 5 qavatli bino. 1 Navigator (`/uz/`), 2 Top Admission, 3 SAT prep, 4 IELTS prep, 5 EYUF prep. Ma'lumot `src/data/qavatlar.ts` (2–5 qavat holati `bolimlar.ts` dan), `joriyQavat(pathname)`.
- **Lift** (`Lift.astro`): 5 ta yumaloq raqamli tugma (48px), `<nav aria-label="Qavatlar (lift)">`, tugma `<a>`. Joriy qavat ko'k fon va oq raqam, `aria-current="location"`. Tez-oradagi qavat kulrang raqam va nuqta, lekin kirsa bo'ladi ("qavat qurilmoqda" sahifasi). Kompyuterda: bo'lim yon panelida logo ostida ("3-qavat · SAT prep" yozuvi bilan; yig'ilgan panelda ustun, yozuvsiz), 1-qavat menyusining o'ng tomonida, mashq sahifasi sarlavhasida. Telefonda: pastda doim turuvchi 5 tugmali panel (raqam + qisqa nom, 64px + safe area), sahifa pastiga shuncha bo'shliq qo'shiladi; chiqib keladigan panel ochiqligida inert. Qavat o'zgarsa qisqa "2 → 3" ko'rsatkichi (sessionStorage `tayanch:qavat`; reduced motion'da animatsiyasiz).
- **Qavat yo'li** (`QavatYoli.astro`): sahifa tepasida "3-qavat › Mashq › Test"; oxirgi band havola emas (`aria-current="page"`). 1-qavat bosh sahifasida yo'q.
- **Zina** (`Zina.astro`): qavat kirish sahifasi pastida qo'shni qavatlarga ikki karta (pastga chapda, yuqoriga o'ngda). 1-qavatda faqat yuqoriga, 5-qavatda faqat pastga.
- **Top Admission: pasport/viza detallari** (maket, 2026-11-05: Claude Design "Tayanch Top Admission maketi", https://claude.ai/artifact/1zP2rnjMp46RgY9WpD84GF; A kirish, B Türkiye Bursları, C Topshirish yo'li, D lift; yorug' va qorong'i). Detallar ma'no tashiydi, bezak emas; hammasi CSS/SVG, rasmsiz (pasport surati, bayroq, gerb yo'q).
  - **Muhr**: 58–92px doira, 2px uzuq ko'k chegara + ichki 1.5px halqa, -8° burilgan, ichida "TEKSHIRILGAN" va sana. Faqat rasmiy manbada tekshirilgan faktda. Tekshirilmaganida muhr yo'q, o'rniga ogohlik rangidagi "tekshirish kerak" yorlig'i.
  - **Chipta**: faqat muddat kartalari. 1.5px qora chegara, `--r-orta`; o'ng "korishok" (150px, telefonda 96px) uzuq chiziq bilan ajratilgan, chegarasida tepa va pastda yarim doira teshik. Chapda sana katta (900), korishokda qolgan kun.
  - **Viza sahifasi**: yo'nalish sahifasi boshidagi karta, 24px katakli nozik to'r (`--sirt-ikkinchi`), chap yuqorida davlat kodi ("UZ → TR", ko'k, 900), 2×2 maydon: Dastur, Daraja, Ariza oynasi, Manba.
  - **MRZ qatori**: faqat sahifa oxiri blokida, `--fon-ikkinchi` lentada ikki qator `TAYANCH<<TOP<ADMISSION<<<…`, Figtree 700, harf oralig'i 0.22em, `aria-hidden`. Shaxsiy ma'lumot yo'q.
  - **Savol progressi** (Topshirish yo'lidagi 3D zinapoya) va **Zina** (qavatlar orasidagi tekis kartalar) har xil ko'rinadi va har xil yozilgan; ularni adashtirmaslik kerak.
  - Topshirish yo'lida asosiy yo'l kartasi qora (qorong'ida `--fon-ikkinchi` + 2px `--rang-havola` chegara); kartaning orqa yuzi pasport sahifasi (to'r fon, muhrli faktlar, "tekshirish kerak" yorliqlari).
- **Hisob va to'lov sahifalari** (2026-11-08, ADR `docs/qarorlar/001-hisob-tolov-server.md`). Umumiy kirish va profil 1-qavatda (o'zbekcha), SAT tarif sahifalari inglizcha. Yangi rang yo'q, faqat mavjud tokenlar. Qizil yoki yashil ta'kid taqiqi bu yerda ham amal qiladi: xato ham, muvaffaqiyat ham rang bilan emas, matn va ikonka bilan aytiladi.
  - **Forma maydoni**: ko'rinib turadigan `<label>` maydon ustida (placeholder yorliq o'rnini bosmaydi). Balandlik kamida 48px, `--sirt` fon, 2px `--chiziq-maydon` chegara (`--chiziq-kuchli` emas: u 3:1 ga yetmaydi), `--r-orta`, matn `--matn-asosiy`. Fokus: 3px `--rang-asosiy` chegara. To'g'ri `type` va `autocomplete` (`email`, `current-password`, `new-password`). Yordamchi matn maydon ostida `--matn-ikkinchi`, `aria-describedby` bilan bog'lanadi.
  - **Xato xabari**: maydon ostida, ogohlik juftligi (`--rang-ogoh-fon` / `--rang-ogoh-matn`), `--r-kichik`, ogohlik ikonkasi (inline SVG) va matn. Maydonga `aria-invalid="true"` va `aria-describedby`. Forma yuborilganda xatolar ro'yxati tepada `role="alert"` bilan, fokus unga o'tadi. Xato faqat rang bilan ko'rsatilmaydi. Matn nima qilishni aytadi ("Email manzilida @ belgisi yo'q"), aybdor qilmaydi.
  - **Parol maydoni**: forma maydoni qoidalari + "Ko'rsatish" / "Show" tugmasi (`<button type="button">`, `aria-pressed`, maydon ichida o'ngda, 48px). Talablar (uzunlik) maydon ostida oldindan yoziladi. Nusxa qo'yish (paste) taqiqlanmaydi.
  - **Kvota ko'rsatkichi** (Free tarifda): Progress komponenti (8px, `--r-toliq`, to'ldirish `--rang-asosiy`) + matn "ishlatilgan / jami" ko'rinishida (kvota raqamlari hali belgilanmagan). Kvota tugaganda rang o'zgarmaydi; ostida matn va Pro tariflar sahifasiga `<a>` havola. `role="progressbar"` bilan `aria-valuenow`/`aria-valuemax` yoki oddiy matn.
  - **To'lov usuli tugmasi** (Click, Payme, UzCard/HUMO): radio guruhi sifatida (`<fieldset>` + `<legend>`, har biri `<input type="radio">` va `<label>`), Variant tugmasi ko'rinishida: 56px, 2px `--chiziq-kuchli`, `--r-orta`. Tanlangani 2px `--rang-asosiy` chegara va belgi ikonkasi. Usul nomi matn bilan yoziladi; to'lov tizimlari logotiplari faqat ularning rasmiy brend qoidalari tekshirilgandan keyin. Pastda bitta asosiy tugma "To'lash" / "Pay", summa tugma yonida yoziladi. Karta raqami Tayanch sahifasida so'ralmaydi (to'lov inPAY sahifasida).
- **SAT bo'limi inglizcha matnlari** (2026-11-08, SAT matni inglizcha): muhr ichida "TEKSHIRILGAN" o'rniga **VERIFIED** va sana; "tekshirish kerak" yorlig'i o'rniga **needs verification**; footerdagi "Natija kafolatlanmaydi" o'rniga **Results are not guaranteed**; "Namuna" o'rniga **Sample**. Ko'rinish va qoidalar o'zbekcha variant bilan bir xil. SAT sahifalarida `<html lang="en">` (qolip vazifasi). Inglizcha matnni muallif tekshiradi.
- **Menyu**: oq qator, logo chapda, havolalar o'ngda; bo'limlarga o'tish o'rniga lift. Telefonda ikkinchi qatorga o'tadi.
- **Footer**: "Natija kafolatlanmaydi", Maxfiylik, Manba jurnali.
- **Sahifa oxiri bloki** (har sahifada, T1): rasmiy manbalar, tekshirilgan sana, keyingi tekshiruv, tekshirilmagan joylar.

## Tasvir va ikonkalar

- Ikonkalar: inline chiziqli SVG, `stroke-width: 2`, `currentColor`. Emoji ikonka sifatida ishlatilmaydi.
- Illyustratsiya: hozircha yo'q. Keyin ochiq litsenziyali to'plamdan (litsenziyasi tekshirilib), so'ng o'z maskotimiz.
- Real odam surati faqat muallifniki va faqat o'zi bergan bo'lsa.

## Taqiqlar

Gradient fonlar, gradient matn, glassmorphism, chap tomonda rangli chiziqli kartalar, uchta bir xil karta qatorini odat bo'yicha qo'yish, uydirma raqam yoki sharh.
