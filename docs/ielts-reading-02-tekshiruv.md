# Reading test 2 (`reading-02`): muallif tekshiruvi

Fayl: `src/data/ielts/reading-testlar/reading-02.json` (sxema v1, `docs/ielts-schema.md`).
Matn va savollarni AI yozgan, hali muallif tekshirmagan. Merge qilishdan oldin quyidagilar
tekshiriladi. Tushuntirishlar o'zbekcha (`explanationLang: "uz"`). `reading-01` (PR #121) bilan
mavzu takrorlanmaydi; ikkalasi saytda bo'lsa, boshlash sahifasi testni tasodifiy tanlaydi.

## Tarkib

| Passage | Mavzu | Daraja | So'z | Savollar |
| --- | --- | --- | --- | --- |
| 1 | Water from Beneath the Desert (qanot / karez) | Oson-O'rta | 655 | 1–6 TFNG, 7–13 gap-fill (ONE WORD) |
| 2 | Concrete That Mends Itself (o'zini tuzatadigan beton) | O'rta | 700 | 14–19 Matching headings, 20–21 Choose TWO, 22–26 gap-fill (TWO WORDS) |
| 3 | Remembering on Schedule (spacing effect, Leitner) | Qiyin | 683 | 27–31 MCQ, 32–36 TFNG, 37–40 gap-fill (ONE WORD) |

Jami ~2040 so'z (haqiqiy IELTS Academic testlari odatda biroz uzunroq). Javoblar taqsimoti: TFNG 11 ta
(TRUE 4, FALSE 5, NOT GIVEN 2), MCQ 7 ball (27–31: B, A, D, C, A), Matching headings 6, gap-fill 16.

## Javoblar kaliti

| № | Javob | № | Javob | № | Javob | № | Javob |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | FALSE | 11 | ice | 21 | C | 31 | A |
| 2 | TRUE | 12 | wells | 22 | tension | 32 | FALSE |
| 3 | FALSE | 13 | climate | 23 | space | 33 | TRUE |
| 4 | TRUE | 14 | ii | 24 | autogenous healing | 34 | NOT GIVEN |
| 5 | FALSE | 15 | i | 25 | spores | 35 | FALSE |
| 6 | NOT GIVEN | 16 | iii | 26 | lime | 36 | TRUE |
| 7 | evaporation | 17 | vi | 27 | B | 37 | mastery |
| 8 | fuel | 18 | vii | 28 | A | 38 | familiar |
| 9 | snowmelt | 19 | iv | 29 | D | 39 | discouraging |
| 10 | time | 20 | A | 30 | C | 40 | arrangement |

20–21: "Choose TWO", javob A va C (tartib ahamiyatsiz). 24: "autogenous" ham qabul qilinadi.

## Muallif tekshiradigan joylar

- [ ] **Faktlar (tekshirish kerak).** Matnlar umumiy bilimga tayangan, raqam va sana kam. Tekshiriladigan da'volar:
  - P1: karez (Afg'oniston, G'arbiy Xitoy), foggara (Jazoir), falaj (Ummon) nomlari; Eronda qazuvchi "muqanni"; qazish chiqish joyidan tepaga qarab boshlanishi; qishda qanot suvidan muz tayyorlanishi; 2016-yil Eron qanotlari UNESCO ro'yxatiga kiritilgani.
  - P2: beton dunyodagi eng ko'p ishlatiladigan qurilish materiali; Delft texnologiya universiteti, mikrobiolog Henk Jonkers; spora, kalsiy laktat, kalsiy karbonat; bakteriyalar kislorodni sarflashi; 2023-yil MIT ishtirokidagi Rim betoni (ohak bo'lakchalari) tadqiqoti.
  - P3: Ebbinghaus 1880-yillarda o'zi ustida ma'nosiz bo'g'inlar bilan tajriba; Robert Bjork "desirable difficulties"; Sebastian Leitner nemis jurnalisti, 1970-yillar boshi; kompyuter dasturlari 1980-yillar oxiridan.
- [ ] **Inglizcha matn**: tabiiy va IELTS darajasiga mosligi.
- [ ] **O'zbekcha tushuntirishlar**: imlo va uslub.
- [ ] **Bahsli savollar**: 2 (sinov qudug'i "confirm" so'zi), 33 (qayta o'qish "false impression": TRUE), 34 (NOT GIVEN).
- [ ] Tasdiqlansa: shu faylda belgilash va PR'ni merge qilish.

## Sinov (2026-11-12, headless Chrome, `astro preview`)

- Sinalgan: `npm run validate:tests`, `npm test` (149/149), `npm run repo:tekshir`, `npm run build` (69 sahifa).
- 1280 qorong'i: 40 ta to'g'ri javob → 40/40, taxminiy band 9.0. 375 yorug': 7 ta ataylab xato → 33/40, 7.5; xatolar tahlili; gorizontal toshish yo'q; sahifa xatolari yo'q.
- Sinalmagan: haqiqiy telefon, VoiceOver, axe, 60 daqiqalik taymer oxirigacha, PR #121 bilan birga ikki test holati.
