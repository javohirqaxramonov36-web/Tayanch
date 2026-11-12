# Reading test 3 (`reading-03`): muallif tekshiruvi

Fayl: `src/data/ielts/reading-testlar/reading-03.json` (sxema v1, `docs/ielts-schema.md`).
Matn va savollarni AI yozgan, hali muallif tekshirmagan. Merge qilishdan oldin quyidagilar
tekshiriladi. Tushuntirishlar o'zbekcha (`explanationLang: "uz"`).

## Tarkib

| Passage | Mavzu | Daraja | So'z | Savollar |
| --- | --- | --- | --- | --- |
| 1 | Borrowing Instead of Buying ("buyumlar kutubxonasi") | Oson-O'rta | 631 | 1–7 TFNG, 8–13 gap-fill (ONE WORD) |
| 2 | Salt from the Sun (dengiz tuzini quyoshda olish) | O'rta | 597 | 14–19 Matching headings, 20–23 MCQ, 24–26 gap-fill (TWO WORDS) |
| 3 | Why Languages Borrow (o'zlashma so'zlar) | O'rta-Qiyin | 705 | 27–30 MCQ, 31–32 Choose TWO, 33–37 TFNG, 38–40 gap-fill (TWO WORDS) |

Mavzular `reading-01` (karvonsaroylar, yashil tomlar, planning fallacy) va `reading-02` (PR #133: qanot, o'zini tuzatadigan beton, spacing effect) dagilardan boshqa.

Javoblar taqsimoti: TFNG 12 ta (TRUE 4, FALSE 4, NOT GIVEN 4), bitta javobli MCQ 8 ta
(A, B, C, D har biri 2 tadan), Choose TWO 2 ball, Matching headings 6, gap-fill 12.
Matching headings javoblari ketma-ket emas (v, ii, vi, vii, iv, i), 2 ta chalg'ituvchi (iii, viii).

## Javoblar kaliti

| № | Javob | № | Javob | № | Javob | № | Javob |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | TRUE | 11 | donations | 21 | C | 31 | B |
| 2 | FALSE | 12 | agreement | 22 | A | 32 | E |
| 3 | NOT GIVEN | 13 | landfill | 23 | D | 33 | TRUE |
| 4 | TRUE | 14 | v | 24 | clay | 34 | FALSE |
| 5 | FALSE | 15 | ii | 25 | forecasts | 35 | NOT GIVEN |
| 6 | NOT GIVEN | 16 | vi | 26 | wading birds | 36 | FALSE |
| 7 | TRUE | 17 | vii | 27 | A | 37 | NOT GIVEN |
| 8 | space | 18 | iv | 28 | D | 38 | words |
| 9 | cooking | 19 | i | 29 | C | 39 | family members |
| 10 | hall | 20 | B | 30 | B | 40 | contact |

31–32: "Choose TWO", javob B va E (tartib ahamiyatsiz). 25 da "detailed forecasts" ham qabul qilinadi.

## Muallif qarorlari (muallif qarorni Claude'ga topshirdi)

- **`reading-03` nomi**: `reading-02` ni boshqa sessiya PR #133 da (boshqa mavzular bilan) allaqachon ochgan. Uning ustiga yozilmadi; bu test uchinchi test sifatida alohida PR'da. Fayllar to'qnashmaydi, uchalasi merge bo'lsa boshlash sahifasi testni tasodifiy tanlaydi.
- **Mavzular umumiy bilimga tayanadi**, aniq joy, ism, sana va raqam yo'q. P1 biror shahar
  haqida emas, "library of things" g'oyasini umumiy tasvirlaydi: shunda matnda tekshirib
  bo'lmaydigan uydirma tafsilot qolmaydi.
- **P3 da o'zbek tili misoli** (arabcha, forscha, ruscha, inglizcha qatlamlar): o'quvchiga
  tanish, matnni yaqinlashtiradi va umumiy ma'lum fakt.
- **Savol turlarining joylashuvi `reading-01` dan farqli** (MCQ P2 va P3 da, Choose TWO P3 da),
  shunda ikki test bir xil qolipda ko'rinmaydi.

## Muallif tekshiradigan joylar

- [ ] **Faktlar (tekshirish kerak).** Raqam va sana yo'q. Tekshiriladigan umumiy da'volar:
  - P1: "library of things" bir qancha mamlakatlarda mavjudligi; odatda ko'ngillilar boshlashi va xayriya buyumlari bilan to'lishi; ayrimlari ta'mirlash guruhlari bilan ishlashi.
  - P2: muzlatkichdan oldin tuz go'sht va baliqni saqlash uchun ishlatilgani; hovuzlarda suv quyuqlashib, tuzdan kam eriydigan minerallar oldin cho'kishi; loy tuproq afzalligi; yuzadagi nozik tuz qo'lda olinib qimmatroq sotilishi; XX asrda ko'p kichik tuz xo'jaliklari yopilgani; tiklangan hovuzlar suvda yuradigan qushlar uchun oziqlanish joyi bo'lishi.
  - P3: ingliz tili lug'atining katta qismi fransuz va lotin tilidan; o'zbek tilidagi arabcha, forscha, ruscha va inglizcha qatlamlar; choy va qahva nomlari ko'p tillarda o'xshash; "cow" (o'z so'zi) va "beef" (fransuzcha); "skyscraper" ning Yevropa tillaridagi calque'lari ("cloud-scraper", "sky-scratcher" ma'nosida); asosiy lug'at (tana a'zolari, qarindoshlar) almashtirishga chidamliroq ekani.
- [ ] **NOT GIVEN savollari** (3, 6, 35, 37): matnda tasdiq ham, inkor ham yo'qligi.
  37 ga alohida qarang: G paragraf ota-onadan bolaga o'tishni aytadi, lekin o'rganish tezligi haqida emas.
- [ ] **Bitta to'g'ri javob**: MCQ 20–23, 27–30 va 31–32 da boshqa variant ham himoya qilinadigan emasligi.
- [ ] **Gap-fill**: javob so'zma-so'z matnda bor, so'z chegarasiga sig'adi, boshqa so'z ham mos kelib qolmaydi (`acceptedAnswers` kerakmi). 10 ("church hall"), 24 ("the clay") va 38 ga qarang.
- [ ] **Matching headings**: iii va viii (chalg'ituvchi) hech qaysi paragrafga mos emas. viii F paragraf uchun chalg'itadi (sanoat ishlab chiqaruvchilari tilga olinadi), lekin F ning asosiy fikri yopilish va qayta tiklanish (i).
- [ ] **Tushuntirishlar** o'zbekchasi.
- [ ] **Uzunlik**: matnlar haqiqiy imtihon matnlaridan qisqaroq bo'lishi mumkin (tekshirish kerak, manba IE02).
- [ ] **Kontent siyosati** (`docs/kontent-siyosati.md`): rasmiy yoki boshqa saytdagi matnga qarab yozilmagan, "o'zgartirib" ko'chirilmagan.

## Sinalgan (2026-11-12, lokal `astro dev`, 375px, qorong'i va yorug' mavzu)

- `npm run validate:tests`: 40 savol, sxema to'g'ri; `npm test` 149/149; `npm run build` o'tdi; `npm run repo:tekshir` muammo yo'q.
- Boshlash sahifasi testni ko'radi, test ekrani ochiladi, 3 passage almashadi, hisoblagich 40/40.
- Brauzer sinovi fayl hali `reading-02` deb nomlangan paytda qilindi; keyin faqat `testId`, `title` va fayl nomi o'zgardi.
- Ataylab 2 ta xato (3: TRUE; 39: "family") va 26 da "  Wading  Birds " (bo'shliq va katta harf):
  natija 38/40, taxminiy band 8.5, 26 to'g'ri hisoblandi, 3 va 39 xato. Turlar: TFNG 11/12, MCQ 10/10, headings 6/6, gap-fill 11/12.
- "Faqat xato va javobsiz" filtri (faqat 3 va 39), o'zbekcha tushuntirish (`lang="uz"`), dalil bloki. Gorizontal scroll yo'q.

Sinalmagan: 1280px kenglik (dvigatel o'zgarmagan), haqiqiy telefon, VoiceOver, taymer tugashi.
Javoblarning bir qismi brauzerda skript bilan to'ldirildi (1 va 3 qo'lda bosildi).
