# Admission D-seriya: yakuniy hisobot (Q10, 2026-11-20)

Branch `admission-d` (worktree `.claude/worktrees/admission-d`), PR #198 (`admission-d` → `main`, ochiq, MERGE QILINMAGAN). Batafsil har qism: `docs/rejalar/admission-holat.md`.

## 1. Nima qurildi
| Sahifa | Yo'l | Nima qiladi |
|---|---|---|
| Davlatlarni taqqoslash | `/uz/top-admission/davlatlar/` | 15 davlat, 5 mezon, filtr chiplari, narx bo'yicha saralash (USD, kurs sanasi bilan), 2–3 davlatni yonma-yon taqqoslash, holat URL'da |
| Grantlar katalogi | `/uz/top-admission/grantlar/` | Davlat va universitet grantlari, filtr (turi, davlat, daraja, to'liq qoplash), deadline bo'yicha tartib, "Bu yilgi muddat o'tgan", Türkiye Bursları sahifasiga havola, doimiy ogohlantirish |
| Menga mos universitet | `/uz/top-admission/universitetlar/` | Davlat, IELTS, byudjet, "yordam beradiganlar" filtri; "Talab · Sizda" taqqoslash; shortlist (`tayanch:admission-shortlist`, hisob bilan `user_state` orqali); "qabul ehtimoli emas" ogohlantirishi |
| Ariza zinapoyasi → XP | `/uz/top-admission/qollanma/ariza-zinapoyasi/` | Zinapoya birinchi marta to'g'ri terilganda +10 XP (har zinapoyaga bir marta, jami 30). Reyting ko'rsatilmaydi |

Havolalar faqat Top Admission yon panelida ("Vositalar", `src/data/topAdmissionSahifalar.ts`); bosh sahifa menyusi o'zgarmagan.

Ma'lumot qatlami: sxema va validator (`src/content.config.ts`, `src/lib/topAdmission/sxema.ts`, `fakt.ts`), umumiy `Fakt.astro`, skriptlar `npm run malumot:tekshir`, `npm run malumot:tasdiq`. Kontent: 15 davlat, 22 grant (12 davlat + 10 universitet), 30 universitet, `kurslar.json` (CBU, 2026-11-20, 14 valyuta).

## 2. Faktlar soni (`npm run malumot:tekshir`, 2026-11-20)
67 hujjat, 365 fakt.

| Kolleksiya | Fayl | Tasdiqlangan | Qoralama | Topilmadi |
|---|---|---|---|---|
| Davlatlar | 15 | 0 | 38 | 68 |
| Grantlar | 22 | 0 | 33 | 16 |
| Universitetlar | 30 | 0 | 94 | 116 |
| **Jami** | 67 | **0** | **165** | **200** |

Muddati o'tgan (eskirgan) fakt: 0. Saytda faqat "tasdiqlangan" fakt ko'rinadi, shuning uchun hozir uchala vosita sahifasi bo'sh holatda ("Ma'lumot rasmiy manbada tekshirilmoqda").

## 3. Havolalar tekshiruvi (curl, `-L`, 25–40 s timeout, 2026-11-20)
- `source_url`: 110 ta noyob havola. **Ishlamaydigan: 0.**
  - 106 tasi brauzer User-Agent'i bilan 200.
  - 4 tasi faqat oddiy `curl` User-Agent'i bilan 200 qaytardi, brauzer UA bilan javob bermadi (bot filtri, havola o'zi ishlaydi): `canada.ca` ning 3 sahifasi (`kanada.json`: work-off-campus, financial-support, after-graduation/about) va `https://www.chevening.org/scholarships/` (`chevening.json`).
- Qo'shimcha (`rasmiy_havola`, `manba_url`): 8 ta, 7 tasi 200. `https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/` (`grantlar/daad-study-scholarships.json`) curl bilan ochilmadi (ulanish timeout) — o'zingiz brauzerda tekshiring. Bu grantning faktlari baribir "topilmadi".
- Manba havolasi umuman yo'q (hamma fakt "topilmadi", sayt ochilmagan): Oxford, UCL, Hanyang (Cloudflare 403), Korea University, Kyung Hee, Inha, Pusan National.
- Faktlar o'zgartirilmadi.

## 4. Taqiqlangan iboralar (Admission fayllari)
Qidirildi: `src/pages/uz/top-admission/`, `src/components/topAdmission/`, `src/lib/topAdmission/`, `src/data/topAdmission/`, `src/data/topAdmission*.ts`.
- "ehtimol": faqat inkor shaklida ("qabul ehtimoli emas" Q4 ogohlantirishi; eski sahifalarda "Qabul ehtimoli hisoblanmaydi"). Tuzatish kerak emas.
- "kafolat": faqat "Natija kafolatlanmaydi" (repo qoidasi bo'yicha majburiy ogohlantirish) va kod izohi. Tuzatish kerak emas.
- "100%": kodda faqat CSS (`width: 100%`). Ma'lumotda rasmiy `manba_iborasi` ichida 7 joy (Grinnell, MIT, Berea ×2 grant + universitet, Yale grant + universitet). Bu universitet sahifasidagi aynan ibora, O'ZGARTIRILMADI. Tasdiqlashda e'tibor bering: shu faktlarning `qiymat` matnida "100% grant" kabi va'da bo'lmasin.
- Reyting/leaderboard komponenti: yo'q (faqat "reyting yo'q" degan izoh va matn).
- Kalkulyator, "siz X grant olasiz": yo'q.
Natija: tuzatiladigan narsa topilmadi, kod o'zgarmadi.

## 5. Sahifalar 375px va 1280px'da (lokal `dist/`, Claude Browser, 2026-11-20)
4 sahifa (davlatlar, grantlar, universitetlar, ariza-zinapoyasi) ikkala kenglikda ochildi: gorizontal scroll yo'q (scrollWidth = kenglik), bo'sh holat to'g'ri chiqadi, konsolda xato yo'q. Faqat qorong'i mavzu ko'rildi (yorug' mavzu Q2–Q4 da ko'rilgan).
Siz qo'lda tekshiradigan narsalar: haqiqiy telefonda ochish; birinchi faktlarni tasdiqlab build qilgandan keyin filtr, saralash va taqqoslash jadvali (to'ldirilgan holat faqat SOXTA fixture bilan sinalgan); hisob bilan kirib shortlist sinxroni va "+10 XP" (Q5 migratsiyasidan keyin).

## 6. Siz qo'lda qiladigan ishlar
1. **Faktlarni tasdiqlash.** `npm run malumot:tasdiq` → `docs/tekshiruv/tasdiq-royxati.md` (165 qator). Fayl `.gitignore` da (`tekshiruv/`), repoda yo'q, faqat lokal; har safar shu buyruq bilan yaratiladi. Har qatordagi havolani ochib, `manba_iborasi` ni Cmd+F bilan qidiring; to'g'ri bo'lsa JSON'da `holat` ni `"tasdiqlangan"` qiling.
2. **Q5 migratsiyasi** `supabase/migrations/20261120120000_admission_xp.sql` jonli bazaga QO'LLANMAGAN. Qadamlar: `admission-holat.md` → "Q5 natijasi (2-agent)" → "Jonli bazaga qo'llash uchun muallif qadamlari" (1–5). Qo'llanmasa sayt buzilmaydi, faqat XP yozilmaydi.
3. **inPAY sinovi:** 59 000 so'mlik haqiqiy to'lov, `payment.failed` va refund holatlari.
4. **Huquqchi bilan maslahat** Q0 topilmalari bo'yicha (baza Frankfurtda, AI matnlari saqlash muddati, Gemini/Anthropic'ga uzatish): `admission-holat.md` → "Topilmalar (Q0)".

## 7. Ochiq savollar (hamma qismlardan)
To'liq matn: `admission-holat.md` → "Muallif uchun savollar". Qisqacha:
- Q9: UK/Koreya universitetlarida yagona yillik xarajat yo'q — hisoblash qoidasi kerakmi? `min_ielts` "recommended" ball (KAIST, Yale, Purdue) va imtihonsiz (Harvard) holatlar. KAIST/Berea `toliq_qoplaydi` talqini; need-based grantlarda `toliq_qoplaydi` qo'yilmagani. 7 ochilmagan universitet: havola berasizmi yoki almashtiramizmi? Koreya bahor 2027 deadline'lari (o'tgan). Leeds stipendiyasi va Coventry foundation talabi.
- Q8: Xitoy CSC (sayt ochilmadi); Stipendium Hungaricum va Banach 2026 deadline'lari (o'tgan); Fulbright, DAAD, RTP, Study in Saudi kartada ko'rinmaydi — qolsinmi? MAECI uchun O'zbekiston; Australia Awards, Kanada, Singapur.
- Q7: Yaponiya kontrakt (kirish to'lovi bilan) va diplom "yo'q" talqini; Polsha yashash summasi uy-joysiz; Italiya summasi Hanoy elchixonasidan; Vengriya sayti (2026-11-23 gacha ishlamaydi).
- Q6: UK yashash summasi (London tashqarisi, ×12); AQSH/UK "ingliz tilida dastur bor" manbasi; Koreya elchixonasi D-2 sahifasi.
- Q5: migratsiyani qachon qo'llash (merge'dan oldin tavsiya); `npm run db:tekshir` dagi eski `contests:SELECT` xatosi (main'da ham, Admission'ga aloqasiz).
- Q4: shortlist hisobga umumiy rozilik bilan ko'chishi; SAT dialogi matni; IELTS/byudjetni eslab qolish.
- Q2: `QavatMenyu` ga qo'shilmadi (qaror: faqat yon panel).
- Q1: tasdiq ro'yxati lokal qolsinmi yoki `.gitignore` ga istisno.
- Q0: `ielts_writing_results` eksport va maxfiylik jadvalida yo'q; AI matnlari saqlash muddati; Suhbatdosh (Gemini) ochilishidan oldin shartlar.

## 8. Tekshiruv natijalari (Q10, 2026-11-20)
- `npm run build`: o'tdi (88 sahifa).
- `npm test`: 373/373.
- `npm run check`: 4 xato, hammasi eski (`satDarslar/tekshiruv.ts`, `navigator/boshqaruv.ts`, `savolBankiMock.ts`, `sat/vosita/takrorlash`), Admission fayllarida xato yo'q.
- `npm run repo:tekshir`: muammo yo'q.
- `npm run malumot:tekshir`: sxema xatosi yo'q, 0 eskirgan, 200 topilmadi.
- `npm run malumot:tasdiq`: 165 qoralama.
- `npm run db:tekshir`: Q10 da ishga tushirilmadi; ma'lum eski `contests:SELECT` xatosi bilan to'xtaydi (Q5 natijasi).
- `CLAUDE.md` dagi `admission-d` vaqtinchalik bloki olib tashlandi (fayl endi `origin/main` bilan bir xil).

## 9. `main` ga merge tavsiyasi
Merge faqat siz qilasiz. Tavsiya tartibi:
1. Q5 migratsiyasini jonli bazaga qo'llang (6-bo'lim, 2-band) — merge'dan oldin yoki birga.
2. PR #198 ni GitHub'da ko'rib chiqing. 2026-11-20 holatida: `MERGEABLE`, `origin/main` dan 4 commit orqada, konflikt yo'q (`git merge-tree` bilan tekshirildi). Q10 commit'i hali push qilinmagan (BOSHQARUVCHI `git push origin admission-d` qiladi).
3. Merge qilsangiz, sahifalar saytda bo'sh holatda chiqadi (tasdiqlangan fakt 0). Bu xavfsiz, lekin foydasiz: avval kamida bir nechta faktni tasdiqlab, shu branch'ga commit qilish yaxshiroq.
4. Merge'dan keyin: A1 kursni qayta chiqarish (CLAUDE.md "Joriy holat": har `main` push uni o'chiradi), deploy tugagach saytda 4 sahifani ochib ko'rish, `00-ai/band.md` dagi qatorni "Tugagan" ga ko'chirish.
