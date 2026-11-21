# Admission E-seriya: yakuniy hisobot (E10, 2026-11-21)

Branch `admission-d` (worktree `.claude/worktrees/admission-d`), PR #198 (`admission-d` → `main`, ochiq, MERGE QILINMAGAN). Batafsil har qism: `docs/rejalar/admission-e-holat.md`. D-seriya hisoboti: `docs/rejalar/admission-yakun.md`.

## 1. Nima qurildi (E1–E9)
| Sahifa | Yo'l | O'zgarish |
|---|---|---|
| Menga mos universitet | `/uz/top-admission/universitetlar/` | UK va Koreya uchun "kamida X" xarajat (`kontrakt_eng_past` + davlat kartasidagi viza yashash summasi, USD'da, tarkibi ko'rinadi); `ielts_holati` (minimum / tavsiya / talab qilinmaydi / topilmadi, saralash faqat "minimum" bo'yicha); "Foundation yili kerak" belgisi; to'liq ehtiyojga asoslangan yordam izohi; "Bu yilgi muddat o'tgan, keyingisi hali e'lon qilinmagan" |
| Grantlar katalogi | `/uz/top-admission/grantlar/` | `qollanma` bor grantlarda "To'liq qo'llanma" tugmasi; Türkiye Bursları mavjud sahifasiga havola (sahifaning o'zi o'zgarmagan); muddat o'tgan matni |
| Davlatlarni taqqoslash | `/uz/top-admission/davlatlar/` | Grant topilmagan davlatda `grant.izoh` Fakt sifatida (sana va manba bilan), `GrantYoqIzoh` komponenti |
| Grant qo'llanmasi (umumiy shablon) | `/uz/top-admission/grantlar/[slug]/` | Kim topshira oladi, nimani qoplaydi, hujjatlar, bosqichlar (vertikal vaqt chizig'i), ariza yo'li, rasmiy FAQ, rasmiy havolalar; tepada "Grant shartlari har yili o'zgaradi..." ogohlantirishi |

Kod: `src/lib/topAdmission/{sxema,fakt,universitetMoslik,grantKatalog,davlatTaqqos,qollanma}.ts`, `src/components/topAdmission/{UniKarta,GrantYoqIzoh}.astro`, testlar `src/lib/topAdmission/testlar/{e1,e4}.test.ts`. Sxemadagi yangi maydonlar hammasi ixtiyoriy. Supabase'ga tegilmagan.

## 2. Qo'llanmalar
| Grant | Yo'l | Faktlar (hammasi qoralama yoki topilmadi) | Asosiy manba |
|---|---|---|---|
| Stipendium Hungaricum | `/uz/top-admission/grantlar/stipendium-hungaricum/` | 47 qoralama + 6 rasmiy havola | stipendiumhungaricum.hu, 2026/27 chaqiruvi |
| Global Korea Scholarship (GKS) | `/uz/top-admission/grantlar/global-korea-scholarship/` | 53 qoralama + 3 rasmiy havola | 2027 GKS-U qo'llanma PDF (NIIED, studyinkorea.go.kr) |
| Xitoy hukumati granti (CSC) | `/uz/top-admission/grantlar/chinese-government-scholarship/` | 32 qoralama + 4 topilmadi, 5 rasmiy havola | Xitoyning Indoneziya va AQShdagi elchixonalari, Pekin hukumati (2020) |
| MEXT (Yaponiya) | `/uz/top-admission/grantlar/mext/` | 38 qoralama + 5 topilmadi, 4 rasmiy havola | MEXT 2027 bakalavr qo'llanma PDF |
| Study in Saudi (Full Scholarship) | `/uz/top-admission/grantlar/study-in-saudi/` | 32 qoralama + 3 topilmadi | moe.gov.sa, Study in Saudi profil PDF |

Türkiye Bursları: mavjud `/uz/top-admission/turkiye-burslari/` sahifasi, o'zgartirilmagan. Hamma qo'llanma sahifasi hozir "Ma'lumot tekshirilmoqda" ko'rsatadi (tasdiqlangan fakt 0).

## 3. Faktlar soni (`npm run malumot:tekshir`, 2026-11-21)
68 hujjat, 616 fakt (D-seriya oxirida 67 hujjat, 365 fakt).

| Kolleksiya | Fayl | Tasdiqlangan | Qoralama | Topilmadi |
|---|---|---|---|---|
| Davlatlar | 15 | 0 | 40 | 68 |
| Grantlar | 23 | 0 | 238 | 25 |
| Universitetlar | 30 | 0 | 116 | 129 |
| **Jami** | 68 | **0** | **394** | **222** |

Muddati o'tgan (eskirgan) fakt: 0. Yangi grant fayli: `chinese-government-scholarship.json` (E3).

## 4. Havolalar tekshiruvi (curl `-L`, 35 s timeout, 2026-11-21)
Faqat hisobot, faktlar o'zgartirilmadi. Har havola avval Chrome UA, ochilmasa `--http1.1` bilan Chrome UA, keyin oddiy `curl` UA bilan sinaldi.
- Yangi `source_url` (D-seriyadan keyin qo'shilgan, `git diff 0adf7c2..HEAD -- src/data/topAdmission`): 30 ta noyob havola. **29 tasi 200.**
  - Ochilmadi (hamma UA bilan, Safari, Firefox va iPhone UA bilan ham 403): `https://www.ucl.ac.uk/study/prospective-students/undergraduate/how-apply/english-language-requirements` (`universitetlar/ucl.json`, `universitetlar/warwick.json`). E2 da Safari UA bilan ochilgan edi; hozir bot filtri. Brauzerda o'zingiz tekshiring.
- Qo'shimcha yangi havolalar (`rasmiy_havolalar`, `rasmiy_havola`): 23 ta, 20 tasi 200. Ochilmadi:
  - `https://www.campuschina.org/` — 412 (CSC qo'llanmasi rasmiy havolasi).
  - `https://www.uz.emb-japan.go.jp/itpr_en/index.html` — 403 (MEXT qo'llanmasi).
  - `https://overseas.mofa.go.kr/uz-uz/index.do` — 307 yo'naltirish tugamaydi (GKS qo'llanmasi).

## 5. Hali ochilmagan saytlar (E2–E9 dan)
- Universitetlar: Oxford (www.ox.ac.uk 403, Cloudflare; hamma fakt topilmadi), Hanyang (403, Cloudflare), Inha (inglizcha qo'llanma topilmadi), Pusan National (admission.pusan.ac.kr DNS yo'q). Qisman: Korea University (yordam, ozod qilish, xarajat topilmadi), Kyung Hee (faqat deadline), UCL (yuqoridagi 403).
- Grantlar: campuschina.org, csc.edu.cn (412); uz.emb-japan.go.jp (403); overseas.mofa.go.kr va niied.go.kr (GKS aniq e'lon); uz.usembassy.gov va exchanges.state.gov (403, Fulbright, Global UGRAD); daad.de (ulanish yo'q); dfat.gov.au va education.gov.au (ulanish yo'q: Australia Awards, RTP); studyinsaudi.moe.gov.sa (DNS yo'q).
- 15 davlatdan tashqaridagi 6 nomzod (Bruney, Indoneziya KNB, Rossiya kvotasi, Tayvan, Ruminiya, Chexiya): saytlar ochilmadi yoki JS ilova (`docs/rejalar/qoshimcha-grantlar.md`).

## 6. Taqiqlangan iboralar (D-reja 2-bo'lim, 4-qoida)
Qidirildi: D-seriyadan keyin o'zgargan hamma `src/` fayllari va build'dagi 5 qo'llanma sahifasi (`dist/uz/top-admission/grantlar/*/`).
- "ehtimol": faqat inkor shaklida ("qabul ehtimoli emas" filtr ogohlantirishi, istisno; qo'llanma sahifasida "Qabul yoki grant ehtimoli hisoblanmaydi").
- "kafolat": faqat "Natija kafolatlanmaydi" ogohlantirishi va CSS klass nomi.
- "100%": kodda faqat CSS. Ma'lumotda rasmiy `manba_iborasi` ichida 6 joy (Grinnell ×2, MIT, Yale ×2, Berea), aynan ibora, o'zgartirilmadi; ularning `qiymat` matnida "100 foizi" ehtiyoj yoki xarajat qoplanishi haqida, "100% grant" va'dasi yo'q.
- Reyting, leaderboard, kalkulyator, "siz X grant olasiz", avtomatik popup: yo'q ("reyting" faqat "Sayt reyting bermaydi" matni va kod izohlarida).
Natija: tuzatiladigan narsa topilmadi.

## 7. Muallif uchun ochiq savollar (E1–E9)
To'liq matn: `admission-e-holat.md` → "Muallif uchun savollar".
1. E2: Warwick "Band 0" 2027-28 da £21,950 (2026-27 da £27,870). Haqiqiy narxmi yoki Band 1 (£29,260) qo'yilsinmi?
2. E2: LSE va Manchester `foundation_kerak: "ha"`, Cambridge va UCL "topilmadi". Shu talqin ma'qulmi?
3. E2: Amherst 7.5 "tavsiya", MIT 7 "minimum". To'g'rimi?
4. E2: Korea University kontrakti taxminiy ("Approx." × 2 semestr). "Kamida" hisobida ishlatilsinmi?
5. E3/E7: CSC qoplash summalari (2 500 CNY/oy, yotoqxona 700 CNY/oy) Pekin hukumatining 2020 yilgi sahifasidan. campuschina.org da hozirgi summalarni brauzerda tekshira olasizmi?
6. E3: Singapur MOE Tuition Grant (3 yil ishlash majburiyati bilan). "Davlat granti topilmadi" qolsinmi yoki alohida karta?
7. E3: MAECI (Italiya): O'zbekiston mos davlatlar ro'yxatida rasmiy matnda topilmadi (faqat elchixona e'loni). Grant qolsinmi?
8. E3: Australia Awards: dfat.gov.au "participating countries" sahifasida O'zbekiston bormi (brauzerda)?
9. E4: Qo'llanma sarlavhasida davlat kodi ("UZ → HU") kerakmi? Kerak bo'lsa, davlatlar sxemasiga `kod` maydoni qo'shiladi.
10. E4: Qo'llanmada "TEKSHIRILGAN" muhri ham kerakmi (hozir har fakt yonida manba va sana bor)?
11. E5: Stipendium Hungaricum bosqich sanalari 2026/27 niki (o'tgan). Qolsinmi yoki yangi chaqiruvgacha "topilmadi"?
12. E5: O'zbekiston mas'ul organi nomi va kontakti (SH saytida eski nom bilan) qo'llanmaga qo'shilsinmi?
13. E6: GKS kartasida aniq sana 2026-09-30 (elchixona yo'li) qo'yilsinmi (katalogda "muddat o'tgan" chiqadi) yoki matnli qolsinmi?
14. E6: Universitet yo'li (UIC) uchun alohida bosqichlar kerakmi?
15. E6: GKS manbasi PDF yuklab olish havolasi; tasdiqlashda PDF'da Cmd+F. Ma'qulmi?
16. E7: CSC shartlari Xitoyning Indoneziyadagi elchixonasi 2027/2028 e'lonidan. Shu manba ma'qulmi yoki faqat O'zbekiston e'loni chiqqanda ko'rsatilsinmi?
17. E7: O'zbekiston uchun CSC ariza qabul qiluvchi tashkilot (agency) raqami va muddatini elchixona yoki vazirlikdan bilib bera olasizmi?
18. E8: MEXT "12 yillik maktab ta'limi" sharti va O'zbekistonning 11 yillik maktabi. Elchixonadan aniqlab bera olasizmi?
19. E8: uz.emb-japan.go.jp (bizdan 403) da 2027/2028 MEXT bakalavr muddati, imtihon va intervyu sanalarini brauzerda topib bera olasizmi?
20. E8: Qo'llanma 2027 qabulniki. Shunday qoldiramizmi?
21. E9: Study in Saudi kartasida `toliq_qoplaydi: true` (qoralama), lekin dastur ichida qisman va pullik turlar ham bor. Belgi qolsinmi?
22. E9: Saudiya "mahram" talabi qo'llanmada rasmiy matn bo'yicha berildi. Ma'qulmi?
23. E9: 15 ta davlatdan tashqarida rasmiy manbada tasdiqlangan bakalavr full ride grant topilmadi (0 ta); 6 ta nomzod saytlari ochilmadi (`qoshimcha-grantlar.md`). Ular brauzerda tekshirilib, yangi davlat kartasi va qo'llanma qilinsinmi?
24. E9: Xitoy CLEC "International Chinese Language Teachers Scholarship" (rasmiy matnda "full" yo'q, O'zbekiston tashkiloti tasdiqlanmagan). Alohida karta kerakmi?

D-seriyaning ochiq savollari (Q0–Q9): `admission-yakun.md` 7-bo'lim (ularning bir qismiga E-reja 1-bo'limida javob berilgan).

## 8. Muallifning qo'lda qiladigan ishlari
1. **Faktlarni tasdiqlash.** `npm run malumot:tasdiq` → `docs/tekshiruv/tasdiq-royxati.md` (394 qator). Fayl `.gitignore` da, faqat lokal. Har qatordagi havolani ochib (PDF bo'lsa PDF ko'ruvchida), `manba_iborasi` ni Cmd+F bilan qidiring; to'g'ri bo'lsa JSON'da `holat` ni `"tasdiqlangan"` qiling. "Ibora WebFetch orqali" deb belgilangan faktlarga alohida e'tibor bering (`admission-e-holat.md`).
2. **Ochilmagan saytlar**ni brauzerda ochib ko'rish (5-bo'lim): ayniqsa campuschina.org, uz.emb-japan.go.jp, dfat.gov.au, UCL.
3. **Q5 migratsiyasi** (`supabase/migrations/20261120120000_admission_xp.sql`) jonli bazaga qo'llanmagan (D-seriya `admission-yakun.md` 6-bo'lim, 2-band). E-seriya bazaga tegmadi.
4. **inPAY sinovi:** 59 000 so'mlik haqiqiy to'lov, `payment.failed` va refund holatlari.
5. **Huquqchi bilan maslahat** Q0 topilmalari bo'yicha (baza Frankfurtda): `admission-holat.md` → "Topilmalar (Q0)".

## 9. Tekshiruv natijalari (E10, 2026-11-21)
- `npm run build`: o'tdi (93 sahifa).
- `npm test`: 392/392.
- `npm run check`: 4 xato, hammasi eski (`satDarslar/tekshiruv.ts`, `savolBankiMock.ts`, `navigator/boshqaruv.ts`, `sat/vosita/takrorlash`), Admission fayllarida xato yo'q.
- `npm run malumot:tekshir`: sxema xatosi yo'q, 68 hujjat, 616 fakt, 0 eskirgan, 222 topilmadi.
- `npm run malumot:tasdiq`: 394 qoralama.
- `npm run repo:tekshir`: muammo yo'q.
- `CLAUDE.md` dagi `admission-e` vaqtinchalik bloki olib tashlandi; `git diff origin/main -- CLAUDE.md` bo'sh.
- Sinalmagan (E10 da): sahifalarni 375px va 1280px da qayta ochish (E4–E9 qismlarida tekshirilgan), haqiqiy telefon, tasdiqlangan faktlar bilan to'ldirilgan holat (faqat soxta fixture bilan sinalgan).

## 10. PR #198 bo'yicha keyingi qadam
Merge faqat siz qilasiz. 2026-11-21 holatida PR `OPEN`, `MERGEABLE`, branch `origin/main` dan 8 commit orqada, konflikt yo'q (`git merge-tree`). E10 commit'i hali push qilinmagan (BOSHQARUVCHI `git push origin admission-d` qiladi).
1. Q5 migratsiyasini jonli bazaga qo'llang (8-bo'lim, 3-band), merge'dan oldin yoki birga.
2. Kamida bir nechta faktni tasdiqlab, shu branch'ga commit qiling: hozir merge qilinsa, sahifalar saytda bo'sh holatda ("Ma'lumot tekshirilmoqda") chiqadi. Bu xavfsiz, lekin foydasiz.
3. PR #198 ni GitHub'da ko'rib chiqib merge qiling.
4. Merge'dan keyin: A1 kursni qayta chiqarish (CLAUDE.md "Joriy holat": har `main` push uni o'chiradi), deploy tugagach saytda sahifalarni ochib ko'rish, `00-ai/band.md` dagi qatorni "Tugagan" ga ko'chirish.
