# Reading test 1 (`reading-01`): muallif tekshiruvi

Fayl: `src/data/ielts/reading-testlar/reading-01.json` (sxema v1, `docs/ielts-schema.md`).
Matn va savollarni AI yozgan, hali muallif tekshirmagan. Merge qilishdan oldin quyidagilar
tekshiriladi. Tushuntirishlar o'zbekcha (`explanationLang: "uz"`).

## Tarkib

| Passage | Mavzu | Daraja | So'z | Savollar |
| --- | --- | --- | --- | --- |
| 1 | Inns of the Silk Road (karvonsaroylar) | Oson-O'rta | 534 | 1–6 TFNG, 7–13 gap-fill (ONE WORD) |
| 2 | Roofs That Grow (yashil tomlar) | O'rta | 549 | 14–19 Matching headings, 20–21 Choose TWO, 22–26 gap-fill (TWO WORDS) |
| 3 | Why Plans Run Late (planning fallacy) | O'rta-Qiyin | 643 | 27–31 MCQ, 32–36 TFNG, 37–40 gap-fill (TWO WORDS) |

Javoblar taqsimoti: TFNG 11 ta (TRUE 3, FALSE 5, NOT GIVEN 3), MCQ 7 ball, Matching headings 6, gap-fill 16.

## Javoblar kaliti

| № | Javob | № | Javob | № | Javob | № | Javob |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | TRUE | 11 | roads | 21 | D | 31 | A |
| 2 | FALSE | 12 | workshops | 22 | water | 32 | TRUE |
| 3 | FALSE | 13 | walls | 23 | parks | 33 | FALSE |
| 4 | NOT GIVEN | 14 | vi | 24 | sewer systems | 34 | NOT GIVEN |
| 5 | TRUE | 15 | i | 25 | countryside | 35 | FALSE |
| 6 | FALSE | 16 | ii | 26 | evaporates | 36 | NOT GIVEN |
| 7 | patrons | 17 | iii | 27 | B | 37 | interruptions |
| 8 | taxes | 18 | iv | 28 | B | 38 | taxpayers |
| 9 | prices | 19 | v | 29 | C | 39 | start late |
| 10 | pass | 20 | B | 30 | B | 40 | pessimism |

20–21: "Choose TWO", javob B va D (tartib ahamiyatsiz).

## Muallif tekshiradigan joylar

- [ ] **Faktlar (tekshirish kerak).** Matnlar umumiy bilimga tayangan, raqam va sana deyarli yo'q.
  Tekshiriladigan da'volar:
  - P1: "caravanserai" so'zi forscha (karvon + saroy); yo'llarda taxminan bir kunlik yo'l oralig'ida qurilgani; Markaziy Osiyoda ba'zi tiklangan karvonsaroylar do'kon yoki mehmonxona sifatida ishlatilishi.
  - P2: yashil tom qatlamlari tartibi; extensive va intensive turlar ta'rifi; membranani quyoshdan himoya qilishi.
  - P3: "planning fallacy" atamasi Kahneman va Tversky, 1979; dastlab faqat vaqt haqida bo'lgani; "inside view" va "outside view" Kahneman nomi bilan; reference class forecasting katta davlat loyihalari uchun tavsiya qilingani.
- [ ] **NOT GIVEN savollari** (4, 34, 36): matnda tasdiq ham, inkor ham yo'qligi.
- [ ] **Bitta to'g'ri javob**: MCQ 27–31 va 20–21 da boshqa variant ham himoya qilinadigan emasligi.
- [ ] **Gap-fill**: javob so'zma-so'z matnda bor, so'z chegarasiga sig'adi, boshqa so'z ham mos kelib qolmaydi (`acceptedAnswers` kerakmi).
- [ ] **Matching headings**: vii va viii (chalg'ituvchi) hech qaysi paragrafga mos emas.
- [ ] **Tushuntirishlar** o'zbekchasi.
- [ ] **Uzunlik**: matnlar haqiqiy imtihon matnlaridan qisqaroq bo'lishi mumkin (tekshirish kerak, manba IE02). Kerak bo'lsa keyingi PR'da uzaytiriladi.
- [ ] **Kontent siyosati** (`docs/kontent-siyosati.md`): rasmiy yoki boshqa saytdagi matnga qarab yozilmagan, "o'zgartirib" ko'chirilmagan.

## Sinalgan (2026-11-12, lokal `astro preview`, tor oyna, qorong'i mavzu)

- `npm run validate:tests`: 40 savol, sxema to'g'ri; `npm test` 137/137; `npm run build` o'tdi.
- Boshlash sahifasi testni ko'radi, test ekrani ochiladi, 3 passage almashadi, hisoblagich 40/40.
- Ataylab 2 ta xato (4: TRUE; 39: "start very late", 3 so'z) va 24 da "  Sewer  Systems " (bo'shliq va katta harf):
  natija 38/40, taxminiy band 8.5, 24 to'g'ri hisoblandi, 4 va 39 xato.
- "Faqat xato va javobsiz" filtri, o'zbekcha tushuntirish (`lang="uz"`), dalil bloki.

Sinalmagan: 1280px kenglik va yorug' mavzu (dvigatel o'zgarmagan), haqiqiy telefon, VoiceOver, taymer tugashi.
