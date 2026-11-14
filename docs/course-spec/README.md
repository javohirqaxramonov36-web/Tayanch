# SAT kurslari: course-spec

Bu papkani muallif tayyorlagan (Claude bilan). Kurs tuzilmasi uchun yagona ichki manba shu yerda.
Uchinchi tomon kitoblari, PDF'lar, savollar yoki passage'lar bu papkaga ham, repo'ga ham kirmaydi.

## Fayllar
| Fayl | Mazmuni |
|---|---|
| `math-topics.csv` | SAT Math: 25 mavzu (22 ta rasmiy domain mavzusi + 3 ta qo'shimcha modul) |
| `english-topics.csv` | SAT Reading & Writing: 11 mavzu (rasmiy skill'lar) |

CSV ustunlari: `id, course, domain, cb_skill, topic, order, prerequisites, subtopics (";" bilan),
desmos_useful, spr_share, foundation_practice, core_practice, advanced_practice, mini_test,
total_questions, est_minutes, notes`.

## Qabul qilingan qarorlar
1. **Bosqichlar:** har mavzuda 3 ta bosqich (Foundation / Core / Advanced). Har bosqichda qisqa nazariya,
   2–3 ta yechilgan namuna (savol hisobiga kirmaydi) va mustaqil mashq bor. Mavzu oxirida mini-test.
2. **Til:** kurs kontenti inglizcha. Foundation bosqichining nazariyasi va savol izohlariga qo'shimcha
   o'zbekcha izoh (`explanation_uz`) yoziladi. Core va Advanced bosqichlarida faqat `explanation_en` bo'ladi.
   Interfeys saytning mavjud til qoidasiga amal qiladi.
3. **Dizayn:** ko'k rang + Manrope (glassmorphism olib tashlangan).
4. **Desmos:** MVP'da embed qilinmaydi, desmos.com/calculator yangi tabda ochiladi. Embed/API keyinroq,
   litsenziya tekshirilgandan keyin ko'rib chiqiladi.
5. **MVP:** faqat Math > Algebra (A1–A5) va MX3 (grid-in qoidalari), hammasi oxirigacha. Keyin Advanced Math,
   keyin qolganlari. English Math MVP'dan keyin boshlanadi.
6. **Saytda ko'rinish:** production'da faqat `reviewed: true` savollar ko'rinadi.

## Hajm
| Kurs / domain | Mavzu | Savol | Taxminiy o'quvchi vaqti |
|---|---|---|---|
| Math: qo'shimcha modullar (strategiya, Desmos, grid-in) | 3 | 50 | 2,6 soat |
| Math: Algebra | 5 | 180 | 6,4 soat |
| Math: Advanced Math | 6 | 216 | 7,7 soat |
| Math: Problem-Solving and Data Analysis | 7 | 140 | 6,5 soat |
| Math: Geometry and Trigonometry | 4 | 96 | 4,1 soat |
| **Math jami** | **25** | **682** | **27,3 soat** |
| English: Craft and Structure | 3 | 90 | 3,2 soat |
| English: Information and Ideas | 4 | 120 | 4,3 soat |
| English: Standard English Conventions | 2 | 80 | 2,6 soat |
| English: Expression of Ideas | 2 | 60 | 2,1 soat |
| **English jami** | **11** | **350** | **12,2 soat** |
| **Hammasi** | **36** | **1 032** | **39,5 soat** |

Bosqichlar bo'yicha savol soni (mashq F/C/A + mini-test):
- Algebra va Advanced Math: 8/10/8 + 10 = 36
- Geometry: 6/6/4 + 8 = 24
- PSDA: 5/5/4 + 6 = 20
- English (oddiy mavzu): 6/8/6 + 10 = 30
- English (Boundaries; Form, Structure, and Sense): 8/12/8 + 12 = 40

Vaqt hisobi: mavzu boshiga dars o'qish uchun 30 daqiqa (English'da 25), har savolga 1,3 daqiqa.

Kursdagi ulush testdagi ulushdan biroz farq qiladi. Rasmiy test taqsimoti: Algebra ≈35%, Advanced ≈35%,
PSDA ≈15%, Geometry ≈15%. PSDA'da kichik skill'lar ko'p bo'lgani uchun kursda uning ulushi kattaroq.
MVP natijasidan keyin qayta ko'rib chiqiladi.

## Savol sxemasi (majburiy maydonlar)
`id, course, domain, skill, topic_id, stage (Foundation|Core|Advanced|mini_test), difficulty (1-3), type (mcq|spr),
time_sec, prompt, passage (English), choices (mcq: 4 ta), answer, accepted (spr), explanation_en,
explanation_uz (Foundation'da majburiy), check (Math: sympy ifodasi), reviewed, source: "original"`

## Grid-in (SPR) javob qoidasi (TODO_VERIFY: Bluebook yo'riqnomasi bilan solishtirish kerak)
- Musbat javob: 5 tagacha belgi; manfiy javob: minus belgisi bilan 6 tagacha.
- Kasr yoki o'nlik kasr qabul qilinadi; aralash son qabul qilinmaydi (3 1/2 → 7/2 yoki 3.5).
- Uzun o'nlik kasrni joy yetguncha kesish yoki yaxlitlash mumkin.
- Javob bir nechta bo'lsa, bittasi yoziladi.
- Belgilar yozilmaydi: %, $, vergul, birlik nomlari.
- Tekshiruvchi kod: savolda aniq qiymat saqlanadi (masalan "2/3"). Unga son jihatdan teng har qanday kasr
  qabul qilinadi. O'nlik kasr ham qabul qilinadi, agar u aniq qiymatni belgi limitigacha kesish yoki
  yaxlitlashdan hosil bo'lsa (2/3 → .6666, .6667, 0.666, 0.667). Kamroq aniqlikdagi javob (.67) qabul
  qilinmaydi.

## Kontent qoidalari
- Har bir savol, passage va izoh original. Muallif yozuvchiga hech qanday kitob yoki tijoriy material
  berilmaydi.
- English passage'lari 25–150 so'z. Janrlar navbat bilan: fan, tarix/ijtimoiy fan, adabiyot, gumanitar.
  Jadval va grafiklardagi ma'lumotlar uydirma ekani ochiq ko'rinsin.
- MCQ: bitta aniq to'g'ri javob. Distraktorlar tipik xatolardan tuziladi (ishora xatosi, noto'g'ri qiymat
  topilgani, yarim yo'lda to'xtash).
- English: javob faqat passage'dan topiladi, umumiy bilim talab qilinmaydi.

## Tekshiruv jarayoni
1. Claude mavzuni yozadi (1 mavzu = 1 chat), `reviewed: false`.
2. Skript: sxema, dublikat, 4 variant / 1 javob, Math uchun `check` ifodasini sympy bilan bajarish.
3. English: ikkinchi Claude chati savolni javobsiz yechadi. Javob farq qilsa, savol qayta yoziladi.
4. Muallif o'qiydi va `reviewed: true` qo'yadi.

## Tashqi havolalar (hammasi TODO_VERIFY)
- College Board Bluebook (rasmiy amaliy testlar)
- Khan Academy Digital SAT kursi
- College Board: SAT Math va R&W domain/skill ta'riflari

## 1a mahalliy tekshiruv

- `TAYANCH_SAVOLLAR_DIR` berilmasa, ildiz `~/Tayanch-savollar`. Har mavzuda
  `content/sat-math/{extra,algebra}/{mx3,a1,...,a5}/lesson.md` va `questions.json` bo‘ladi.
  MX3 `extra` papkasida, A1–A5 `algebra` papkasida. CSV tartib, prerequisite va savol sonlari manbai.
- `lesson.md` uchta H2 bo‘limdan iborat (`Foundation`, `Core`, `Advanced`). Har birida
  `### Theory` va `### Examples`, Foundation’da ular orasida `### Nazariya (UZ)` bo‘ladi.
  `Examples` ichida 2–3 ta H4 sarlavhali, matn bilan yechilgan misol kerak.
  Markdown’da xom HTML ishlatilmaydi. Havolalar HTTPS yoki sahifa ichidagi `#anchor`.
  Rasmlar mavzu ichidagi nisbiy PNG fayl va kamida 5 belgili alt matn bilan beriladi.
- `questions.json` savollar massivi. Yuqoridagi sxemaga `stage: "mini_test"` qo‘shiladi.
  A1–A5 da 10 tadan, MX3 da 0 ta mini-test savoli bor. `spr_share` mavzu savollari soniga
  ko‘paytirilib, eng yaqin butun songa yaxlitlanadi (aynan yarmi yuqoriga).
  MX3 savolida `domain` va `skill` P05 taksonomiyasidan tanlanadi.
- MCQ `choices` A–D tartibidagi to‘rtta matn, `answer` bitta harf. SPR `answer` aniq son
  yoki kasr ko‘rinishidagi matn (bir nechta aniq qiymat bo‘lsa, massiv),
  `accepted` ruxsat etilgan yozuvlar massivi.
  Savol rasmi kerak bo‘lsa, `figure` ichida `type: "png"`, `src` va `alt` beriladi.
  `author`, `drafted_by: "ai" | "human"` va butun `version` (1 dan boshlab) majburiy.
- Math `check` JSON obyekti. Quyida ruxsat etilgan maydonlar keltirilgan.
  Ifodalarda `x y m b a t n`, oddiy son va kasr, qavs, `+ - * /`, doimiy sonning
  0–3 darajasi (`**`) va zarur joyda `= < <= > >=` ishlatiladi.
  MCQ variantlari shu sintaksisdagi son, ifoda, kortej yoki tegishli munosabat bo‘ladi.
  `no solution`, `all real numbers` va `infinitely many solutions` ham tekshiruv natijasiga mos kelsa ishlaydi.

| `check.kind` | Boshqa maydonlar |
| --- | --- |
| `expression` | `expression` (hisoblanadigan matn) |
| `linear` | `equations` (1–3 matn), `variables` (1–2 nom), `target` (topiladigan ifoda yoki nuqta) |
| `linear_count` | `equations` (1–3 matn), `variables` (1–2 nom). MCQ variantlari `No solution`, `Exactly one solution`, `Exactly two solutions` va `Infinitely many solutions`. |
| `inequality` | `relations` (1–3 matn, kesishma), `variables` (1 nom) |
| `relation` | `expression` (chiziq yoki yarim tekislik), `variables` (2 nom) |
| `alternatives` | `expressions` (SPR uchun 2–4 takrorsiz ratsional qiymatni beradigan matn) |

SymPy `check` bilan variantlar yoki SPR yozuvlarini solishtiradi. Muallif `check` savol
matnini to‘g‘ri ifodalashini, shuningdek mazmunning originalligini alohida tekshiradi.

```sh
python3 -m venv /tmp/tayanch-kurs-venv
/tmp/tayanch-kurs-venv/bin/python -m pip install -r scripts/kurs/requirements.txt
export TAYANCH_KURS_PYTHON=/tmp/tayanch-kurs-venv/bin/python
npm run kurs:tekshir -- --katalog
npm run kurs:tekshir
npm run kurs:sinov
```

Muallif ko‘rigidan oldin `reviewed: false` qo‘yiladi. `npm run kurs:tekshir -- --hashlar`
yaroqli qoralamalarning joyi va mazmun hash’ini chiqaradi. Muallif ko‘rikdan o‘tkazgan
yozuvga `reviewed: true`, `verified_by` (qoralovchidan boshqa inson),
`verified_at` (UTC ISO 8601) va `verified_hash`ni shaxsan qo‘yadi.
`TAYANCH_MUALLIF` tasdiqlash uchun ishonchli lokal muhitda belgilanadi va `verified_by`ga
mos bo‘lishi kerak. Bu mahalliy muallif attestatsiyasi. Savol mazmuni, joyi, izohi yoki rasm
baytlari o‘zgarsa, versiya oshirilib, qayta ko‘rikdan o‘tkaziladi.

`npm run kurs:tekshir -- --nashr` va `npm run kurs:import` 200 ta tasdiqlangan yozuvni
talab qiladi. Import bu bosqichda dry-run bo‘lib, P05 qatorlari xotirada quriladi.
Hisobotda faqat sonlar va xato joylari chiqadi. CI xususiy kontent o‘rniga vaqtinchalik
sun’iy to‘plamni tekshiradi. Nashrdan oldin muallif haqiqiy paketga `--nashr`ni qo‘llaydi.

## 1e · Mavzuni alohida tayyorlash

`--mavzu A1` ishlatilganda faqat shu mavzu tekshiriladi. `--staging` xususiy
`staging/sat-math` katalogini, odatiy rejim esa `content/sat-math` katalogini o‘qiydi.
`kurs:konvert -- --reja <xususiy-json>` Stage 4 ning P05 tasdiqlarini alohida
`p05-manbalar.json` fayliga nusxalaydi. Kursga moslashtirilgan yozuvlar yangi ID va
mazmun hash’iga ega. `check_choices` kerak joyda ko‘rsatilgan variantlarning matematik
ifodalarini beradi. Muallif ifoda va ko‘rinadigan variantning mosligini ham tekshiradi.

1. `kurs:korib-chiq -- --mavzu A1 --kim '<ism>'` xususiy `REVIEW.md` va
   `tasdiqlash.txt` hosil qiladi. Har qatorda ID va mazmun hash’i bor. Muallif
   `REVIEW.md`ni o‘qib, tasdiqlamaydigan qatorlarini `#` bilan belgilaydi.
2. Muallif `REVIEW.md` oxiridagi `kurs:tasdiqla` buyrug‘ini bajaradi. `--sinov`
   faqat tekshiradi. Mazmun keyin o‘zgarsa, versiyani oshirib, tasdiq maydonlarini
   tozalang, `reviewed: false` qo‘ying va yangi ko‘rik ro‘yxatini tayyorlang.
3. `TAYANCH_MUALLIF='<ism>' npm run kurs:import -- --staging --mavzu A1` xususiy
   mavzuni yozuvsiz tekshiradi. Shundan keyin muallif
   `TAYANCH_MUALLIF='<ism>' npm run kurs:kochir -- --mavzu A1` bilan to‘liq
   mavzuni `content/` ga o‘tkazadi. Mavjud manzil ustiga yozilmaydi.
4. `TAYANCH_MUALLIF='<ism>' npm run kurs:import -- --mavzu A1 --sql` faqat
   xususiy `import.sql` faylini yozadi. SQL bitta tranzaksiyada ishlaydi, barqaror
   `external_id` orqali UUIDni saqlaydi va bir xil yozuvni takror yangilamaydi.
   Yashirilgan, boshqa to‘plamga tegishli yoki bir xil versiyada tahrirlangan
   yozuv to‘liq tranzaksiyani to‘sadi. Rasmli savol uchun SQL eksport to‘xtaydi.
   SQL faylini `psql -X -v ON_ERROR_STOP=1 -f <fayl>` orqali bajaring. Generator
   tranzaksiya ichida tasdiqlangan qatorlar va mavzu sonini tekshiradi. Birinchi
   A1 ilk relizi uchun `kurs:import -- --mavzu A1 --staging --sql --birinchi-nashr`
   boshqa kurs mavzulari soni nol bo‘lishini ham talab qiladi va `SET LOCAL ROLE
   postgres`ni tranzaksiya ichida bajaradi. Bu rejimni `postgres` roliga o‘tish
   huquqi bor Supabase ulanishida ishlating.
5. Jonli ish uchun alohida tasdiqdan oldin migratsiyalar ro‘yxati, shu mavzudagi
   mavjud savollar va bog‘langan sessiyalar sonini faqat o‘qib tekshiring. Mavzu
   qatorlarining xususiy DB zaxirasini oling. Tranzaksiya xato bersa o‘zi bekor
   bo‘ladi. Qo‘llangan mavzuni qaytarishda avval statik flagni o‘chiring va kerak
   bo‘lsa savollarni yashiring. Sessiya tarixi bog‘langan UUIDlarni o‘chirmang.
   Zaxiradagi mavjud qatorlarni UUID bo‘yicha tiklash alohida DB amali.
6. Tasdiqlangan SQL muvaffaqiyatli commit bo‘lgach, qaytgan bitta JSON satrini
   xususiy mavzu katalogida `import-receipt.json` sifatida saqlang. Nashr build’i
   receipt’dagi to‘plam hash’i va sonlarni joriy validator rejasi bilan solishtiradi.
   Sahifadagi savol va mini-test sonlari receipt’dan olinadi. Receipt yo‘q, kontent
   to‘liq emas yoki hash o‘zgargan mavzu `Coming soon` holatiga qaytadi.
   Faqat ochiq nazariya statik HTML’ga chiqadi.
7. `TAYANCH_KURS_NASHR=1` nashr ruxsati. Flagni olib tashlab qayta build va
   deploy qilish barcha kurs sahifalari va havolalarini qaytarib oladi. Statik
   sayt uchun kontent yoki receipt o‘zgarganda ham qayta build kerak. Qoralamalar,
   receipt, zaxira va import fayllari repodan tashqarida qoladi.
