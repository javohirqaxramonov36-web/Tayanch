# Reading test 4 (`reading-04`): muallif tekshiruvi

Fayl: `src/data/ielts/reading-testlar/reading-04.json` (sxema v1, `docs/ielts-schema.md`).
Matn va savollarni AI yozgan, hali muallif tekshirmagan. Merge qilishdan oldin quyidagilar
tekshiriladi. Tushuntirishlar o'zbekcha (`explanationLang: "uz"`).

## Tarkib

| Passage | Mavzu | Daraja | So'z | Savollar |
| --- | --- | --- | --- | --- |
| 1 | Bikes That Carry the City (yuk velosipedlari va "last mile") | Oson-O'rta | 641 | 1–4 gap-fill (ONE WORD), 5–13 TFNG |
| 2 | Finding the Way Home (qushlar migratsiyada yo'lni qanday topadi) | O'rta | 658 | 14–17 MCQ, 18–19 Choose TWO, 20–26 gap-fill (TWO WORDS) |
| 3 | The Experience of Waiting (navbat va kutish psixologiyasi) | O'rta-Qiyin | 724 | 27–33 Matching headings, 34–37 MCQ, 38–40 gap-fill (ONE WORD) |

Mavzular oldingi testlardagilardan boshqa: `reading-01` (karvonsaroylar, yashil tomlar, planning fallacy),
`reading-02` (PR #133: qanot/karez, o'zini tuzatadigan beton, spacing effect), `reading-03` (PR #146: buyumlar
kutubxonasi, dengiz tuzi, o'zlashma so'zlar).

Javoblar taqsimoti: TFNG 9 ta (TRUE 3, FALSE 3, NOT GIVEN 3), bitta javobli MCQ 8 ta
(A, B, C, D har biri 2 tadan), Choose TWO 2 ball, Matching headings 7, gap-fill 14.
Matching headings javoblari ketma-ket emas (vi, iii, ix, vii, i, v, ii), 2 ta chalg'ituvchi (iv, viii).

## Javoblar kaliti

| № | Javob | № | Javob | № | Javob | № | Javob |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | mile | 11 | TRUE | 21 | plankton | 31 | i |
| 2 | motor | 12 | FALSE | 22 | inherited instructions | 32 | v |
| 3 | park | 13 | NOT GIVEN | 23 | direction | 33 | ii |
| 4 | overnight | 14 | B | 24 | destination | 34 | C |
| 5 | FALSE | 15 | D | 25 | lights | 35 | A |
| 6 | TRUE | 16 | A | 26 | timing | 36 | D |
| 7 | NOT GIVEN | 17 | C | 27 | vi | 37 | B |
| 8 | TRUE | 18 | B | 28 | iii | 38 | important |
| 9 | NOT GIVEN | 19 | D | 29 | ix | 39 | reassurance |
| 10 | FALSE | 20 | position | 30 | vii | 40 | refusal |

18–19: "Choose TWO", javob B va D (tartib ahamiyatsiz). 22 da "instructions" ham qabul qilinadi (`acceptedAnswers`).

## Muallif qarorlari (muallif qarorni Claude'ga topshirdi)

- **Savol turlarining joylashuvi oldingi uchta testdan farqli.** `reading-01`–`03` da P1 TFNG bilan boshlanadi
  va Matching headings P2 da. Bu yerda P1 gap-fill bilan boshlanadi, P2 MCQ bilan, Matching headings P3 da
  (7 paragraf, eng qiyin passage). Shunda testlar bir xil qolipda ko'rinmaydi.
- **TFNG 9 ta (har javob 3 tadan)**, oldingi testlarda 11–12. Buning o'rniga gap-fill ko'proq (14 ta):
  haqiqiy imtihonda ham turlar soni testdan testga o'zgaradi, va teng taqsimot 3 ga bo'linadigan son talab qiladi.
- **Mavzular umumiy bilimga tayanadi**, aniq joy, ism, sana va raqam yo'q. P3 dagi "lift yonidagi oynalar"
  hikoyasi matnning o'zida "tez-tez aytiladigan, har tafsilotda to'g'ri bo'lmasligi mumkin" deb berilgan
  (savol 34 shunga qurilgan), shuning uchun uni haqiqiy voqea sifatida da'vo qilmaydi.
- **Gap-fill so'z chegarasi**: P1 va P3 ONE WORD, P2 TWO WORDS. Bitta savolda (22) qisqa variant qabul qilinadi,
  chunki "instructions" ham gapga grammatik va ma'no jihatdan mos keladi.

## Muallif tekshiradigan joylar

- [ ] **Faktlar (tekshirish kerak).** Raqam va sana yo'q. Tekshiriladigan umumiy da'volar:
  - P1: yetkazishning oxirgi bosqichi ("last mile") eng qimmat va sekin qism ekani; yuk velosipedlari motorli furgonlardan oldin ham ishlatilgani; elektr yordamchi motor; ko'p shaharlarda haydovchilik guvohnomasi talab qilinmasligi; ayrim kengashlar velosipedlar uchun yuk tushirish joylari ajratgani; "micro-hub" atamasi.
  - P2: kunduzgi qushlar quyosh kompasidan ichki soat bilan foydalanishi (soatni surish tajribalari); tungi qushlar shimolni yulduzlarning aylanish markazidan o'rganishi (sun'iy osmon tajribasi); magnit sezgi haqida ikki faraz (ko'zdagi kimyoviy reaksiyalar, boshdagi magnit zarrachalar); dengiz qushlari plankton chiqaradigan moddalarni hidlashi; yosh va katta qushlarni joyidan ko'chirish tajribalaridagi farq; shahar chiroqlari va iqlim o'zgarishi ta'siri.
  - P3: band bo'lmagan va noaniq kutish uzoqroq tuyulishi; yagona "ilon" navbat adolatli tuyulishi va o'rtacha kutish shart emas qisqarishi; tajribaning oxiri eslashga ko'proq ta'sir qilishi (umumiy "peak-end" g'oyasi, nomi tilga olinmagan); boshqalar bilan kutish yengilroq tuyulishi.
- [ ] **NOT GIVEN savollari** (7, 9, 13): matnda tasdiq ham, inkor ham yo'qligi.
  9 ga alohida qarang: D paragraf kompaniya xarajatlari haqida, maosh haqida emas.
- [ ] **TRUE/FALSE chegarasi**: 8 ("sometimes ... faster" va "may ... or even more quickly"), 11 ("set aside places" va "loading spaces reserved for bikes").
- [ ] **Bitta to'g'ri javob**: MCQ 14–17, 34–37 va 18–19 da boshqa variant ham himoya qilinadigan emasligi.
  14 ga qarang: A (oldingi safar xotirasi) F paragrafda qisman bor, lekin savol A paragraf haqida.
- [ ] **Gap-fill**: javob so'zma-so'z matnda bor, so'z chegarasiga sig'adi, boshqa so'z ham mos kelib qolmaydi
  (`acceptedAnswers` kerakmi). 3 ("park"), 20 ("position") va 22 ga qarang.
- [ ] **Matching headings**: iv va viii (chalg'ituvchi) hech qaysi paragrafga mos emas. iv A va G uchun chalg'itadi
  (ikkalasida xodimlar tilga olinadi), viii C uchun (tablo navbatni yo'q qilmaydi).
- [ ] **Tushuntirishlar** o'zbekchasi.
- [ ] **Uzunlik**: matnlar haqiqiy imtihon matnlaridan qisqaroq bo'lishi mumkin (tekshirish kerak, manba IE02).
- [ ] **Kontent siyosati** (`docs/kontent-siyosati.md`): rasmiy yoki boshqa saytdagi matnga qarab yozilmagan, "o'zgartirib" ko'chirilmagan.

## Sinalgan (2026-11-13, lokal `astro dev`, branch faqat `main` + shu test)

- `npm run validate:tests`: 40 savol, sxema to'g'ri; `npm test` 189/189; `npm run repo:tekshir` muammo yo'q; `npm run build` o'tdi (75 sahifa, `reading-04.json` `dist` da bor).
- 375px qorong'i: test ekrani ochildi, 3 passage almashdi, hisoblagich 40/40. Ataylab xato 7 (TRUE), 18–19 (B va C);
  1 ga qo'lda "  MILE ", 22 ga "  Instructions " (`acceptedAnswers`, bo'shliq va katta harf).
  Natija 37/40, taxminiy band 8.5; xato 7, 19, 36 (36 ham ataylab A); "Choose TWO" da bitta to'g'ri harf 1 ball;
  1 va 22 to'g'ri hisoblandi. Turlar: TFNG 8/9, MCQ 8/10, headings 7/7, gap-fill 14/14.
  "Faqat xato va javobsiz" filtri faqat 7, 19, 36 ni ko'rsatdi; tushuntirish `lang="uz"`, dalil bloki ochiladi. Gorizontal scroll yo'q.
- 1280px yorug': ikki ustunli ko'rinish. Ataylab xato 13 (FALSE), 18–19 (D va E), 33 (iv, chalg'ituvchi);
  2 ga qo'lda "Motor  ", 40 ga "  REFUSAL". Natija 37/40, band 8.5, gap-fill 14/14; filtr faqat 13, 18, 33. Konsolda xato yo'q.
- Javoblarning ko'pi brauzerda skript bilan to'ldirildi (radio/checkbox `click()`, matn `input` hodisasi);
  1, 2 qo'lda yozildi, "Yakunlash" va tasdiq qo'lda bosildi.

Sinalmagan: haqiqiy telefon, VoiceOver, axe, taymer tugashi, boshqa testlar (#121, #133, #146) bilan birga
tasodifiy tanlov (bu branch'da faqat `reading-04` bor).
