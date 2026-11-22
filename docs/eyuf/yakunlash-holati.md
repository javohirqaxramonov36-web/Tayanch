# EYUF qolgan ishlar holati

2026-11-21. Branch `codex/eyuf-yakunlash`. Avvalgi PR #201 qoralama nashri ustida davom.

## Bajarilgan kengaytmalar

- PREP_1 banki yangi sxemada 100 savolga yetkazildi. Avvalgi 88 tasdiqlangan yechim saqlandi, 12 ochiq javob ball va mockka kirmaydi.
- Darajaviy ikkinchi blok uchun 20 bakalavr so‘z-mantiq va 20 magistr tadqiqot savoli yozildi. Ular Tayanch mualliflik mashqlari deb belgilanadi. Qiyinlik kalibratsiyasi alohida ochiq.
- PREP_2dan 110 C savoli rasmga kesildi. 26 mustaqil yechim tasdiqlandi, 84 javob ochiq. PREP_1 bilan bir xil 30 savol yangi ID bilan takrorlanmadi. QR va javob jadvali rasmga olinmadi.
- 40 savol/60 daqiqalik ikki blokli simulyatsiya hamda 10 savol/15 daqiqalik diagnostika qo‘shildi. Yechimlar yakunda, vaqt sahifa yopilganda ham o‘tadi, sessiya lokal tiklanadi. Kalit `tayanch:eyuf-mock:v1`. Kitob o‘chirgichi saralashda ishlaydi.
- Kitob mashqlari qayta yoqildi. Yangi trenajyor kitob o‘chirgichiga amal qiladi. PR #204dagi eski IQ sahifasining mustaqil ishlash qarori saqlanadi.
- Test, suhbat va diagnostikadagi 53 yadro darsiga metodik matn qo‘shildi. Test va suhbat darslari mavjud daraja/progress komponentiga ulandi.
- 20 soha trekiga sana va manbali rasmiy xabarlar, tushunchalar, muammo nomzodlari va shartli ssenariy mashqlari qo‘shildi. Manba yetishmagan fakt bloklari outline holatida saqlandi.
- 14 hududga tanlangan tarixiy meros, hududga aloqador shaxslar va iqtisodiy yo‘nalishlar yozildi. Rasmiy turizm profilidagi ziddiyatli tarixiy sanalar ko‘chirilmagan. Hududning ishlab chiqarish o‘sishi yoki ish o‘rni kafolati haqida da’vo yo‘q.
- Sanali islohotlar bazasi joriy va arxiv kartalariga ajratildi. 20-noyabr xabari joriy, oldingi uch xabar tarixiy misol sifatida arxivda. Arxiv sanasi Tayanch tahririy parametri.
- 111 norasmiy suhbat savoliga inglizcha o‘quv tarjimasi qo‘shildi. 20 trek uchun yana 60 Tayanch savoli va soha tanlash filtri qo‘shildi.
- Esse jumlalaridan himoya savollari qurilmada hosil qilinadi. Matn tashqi xizmatga yuborilmaydi, yangi avtomatik saqlash qo‘shilmadi.

## Haqiqiy qurilmadagi tekshiruv

Muallif USB debuggingga ruxsat berdi. Samsung SM-A245N, Android Chrome 155, CSS viewport 360×650. Sensor hodisalari bilan mock boshlash, javob, reload/tiklash, keyingi savol, rasm zoom/yopish va yakunlash sinaldi. 14 hudud kartasi ochildi. Haqiqiy mikrofon ruxsati, MediaRecorder start/stop, lokal blob audio elementi va yozuvni tasdiq bilan o‘chirish sinaldi. Audio mazmuni Macga olinmadi. Ovozning eshitilish sifati alohida inson ko‘rigini talab qiladi.

Dastlabki CDP screenshot ayrim bloklarni takrorlab ko‘rsatdi. Androidning native screenshoti bilan sahifaning haqiqiy ko‘rinishi solishtirildi. Mockdagi katta rasm uchun aniqlangan min-content va scoped CSS muammosi tuzatildi. Sinalgan holatlarda overflow qolmadi.

## Ochiq chegaralar

- PREP_2ning lokal nusxasi 49 bet. Muallifning Macdan topish ko‘rsatmasi bilan Downloads, Documents, Desktop, Obsidian va mavjud PDF nomlari hamda bet sonlari tekshirildi. To‘liq A/B bo‘limli boshqa nusxa topilmadi. Yetishmagan shartlarni kalitdan tiklash mumkin emas.
- PREP_2ning qolgan mavjud savollari, dublikatlar, izohlar va kesimlar auditi davom etmoqda. 110 yozuvning 84 javobi tekshirilmagan.
- PREP_1 12 ochiq javob, kitob savollarining batafsil matnli transkripsiyasi, tur va difficulty ko‘rigi ochiq.
- 570 mutaxassislik lotin transkripsiyasi `verified=false`. Asl kirill va PDF lokatorlari saqlangan. Buni muallif tasdig‘isiz tekshirilgan deb belgilash mumkin emas.
- Har bir soha uchun uch eng katta mahalliy muammo, joriy vakansiya, global talab va Prezidentning aynan soha haqidagi iqtiboslari to‘liq yig‘ilmagan. Metodik muammo nomzodlari fakt sifatida ko‘rsatilmaydi.
- 2026-2 suhbat rubrikasining rasmiy tatbiqi ochiq. Tarixiy 2025-2 maqomi saqlanadi.
- AI suhbatdoshi dastlabki topshiriqda keyingi bosqichga qoldirilgan. Joriy talabdagi `interviewEngine` interfeysi mavjud. Frontendga API kaliti kiritilmaydi.
- Difficulty kalibratsiyasi va tasdiqlangan difficulty bo‘yicha adaptiv tanlov ochiq. Yangi PREP_2 va mualliflik savollari mavjud eski XP bankida bo‘lmagani uchun ularga XP berilmaydi, mahorat va takrorlash hisoblanadi.
- VoiceOver va iPhone sinovi bajarilmagan. Android mikrofon hamda sensor sinovi ularning o‘rnini bosmaydi.

Ushbu hujjat to‘liq topshiriq tugallanganini bildirmaydi. Natijalar bosqichlar bo‘yicha yangilanadi.

## 2026-11-21 yakuniy regressiya

- Bank 250 yozuv, 154 mustaqil tasdiqlangan va 96 ochiq javob. Har darajada 230 mavjud yozuv, shundan 134 mockka mos. To‘liq mock 20 IQ va 20 darajaga mos ikkinchi blokdan olinadi.
- 23/23 EYUF unit testi, JSON/sxema/manba/asset tekshiruvi va repo siyosati o‘tdi.
- Joriy main bilan build 146 sahifa. `astro check`da EYUF xatosi yo‘q, boshqa bo‘limlarda avvaldan mavjud to‘rtta xato qolgan.
- 360/1280px va yorug‘/qorong‘i mavzudagi mock, hududlar, trenajyor, suhbat uchun 16 holat axe WCAG A/AA xatosiz, gorizontal overflow va JS xatosisiz o‘tdi. Mock/hududlar Lighthouse accessibility 100.
- To‘liq 40 javob, 100 ball, reload/tiklash, yakun va progress idempotentligi hamda `progressApplied` yozilmay qolgan retry holati tekshirildi. Yakuniy ko‘rikda rasm, variantlar, qoida va qadamlar bor, zoom ishlaydi.
- Suhbatning soha/inglizcha filtri, esse da’volari, HTMLni matn sifatida ko‘rsatish, tasdiq bilan tozalash va localStorage yozish taqiqlangan holatda mockning davom etishi sinaldi.
- Yangilik kartasi Toshkent sanasi bilan archive_on kunida qurilmada ham arxivga ko‘chadi. Qurilma vaqti foydalanuvchi sozlamasiga bog‘liq. JSsiz holat oxirgi build sanasiga mos.
- Eng so‘nggi qayta tekshiruvda Android USB orqali ulanmagan. Oldingi haqiqiy qurilma tekshiruvi qayta bajarildi deb hisoblanmaydi.

Nashr doirasi ushbu tekshirilgan UI va belgilangan qoralama kontentdir. Yuqoridagi ochiq kontent va qurilma bandlari alohida qoladi. Zarur rollback shu PRni revert qilib deploy qilish, so‘ng HANDOFFdagi A1 statik nashrini tiklash orqali bajariladi.

## Davomiy audit, 2026-11-21 — codex/eyuf-yakun-audit

Asos `origin/main` `4c800e34`. Ushbu bo‘limdagi ish hali nashr qilinmagan.

- 41 ta PREP_2 javobi yangi mustaqil yechim va asl PDF/variant/kalit solishtirishi bilan kiritildi. Jami 195 tasdiq, 55 ochiq javob. Sonli/harfli yozuvlarga matnli shart va variantlar qo‘shildi, turlar qayta tasniflandi.
- Rasmiy S04 PDF qayta olindi. 570 asl kirill matni aynan PDF beti va qatori bilan solishtirildi. 35 lotin nomi tuzatildi. Dalil va farqlar `transkripsiya-audit.md`da. Bu inson ko‘rigi maqomini o‘zgartirmaydi.
- JSON/manba/assets validatori va 23/23 EYUF unit testi o‘tdi. Yakuniy build va brauzer regressiyasi keyingi o‘zgarishlardan so‘ng qayta bajariladi.

Hali bajariladiganlar ketma-ketligi quyida saqlanadi.

1. 55 ochiq javobni ko‘rish, matn/type/variant va kesim auditi. PREP_2 A/Bning mavjud to‘liq savollarini import qilish. Yetishmagan asl shartlarni qayd etish.
2. Qiyinlikning dalilli metodik kalibratsiyasi, adaptiv tanlov va mavjud XPni yangi IDlarga ulash. Eski XP, kunlik chegara va IDlarni saqlash.
3. Rasmiy rubrika, universitet ro‘yxati, blankalar va G01–G17 qayta tekshiruvi.
4. 20 trek fakt bloklari, ayniqsa arxitektura namunasi. Birlamchi manbalarga asoslangan muammolar, islohotlar, iqtibos, talab, istiqbol va tashkilotlar.
5. Original topshiriqdagi diagnostika, kurs, ijod/stress, rubrika va mock suhbat mezonlarini normal kirish yo‘llarida solishtirish.
6. Unit/schema/repo/build, 360/1280 light/dark, axe/Lighthouse, storage/concurrency/reload. Qurilma ulangan bo‘lsa haqiqiy telefon.
7. Commit, push, PR, merge, deploy, latest main uchun A1 qayta nashri va jonli tekshiruv.


### Davomiy auditning keyingi natijasi

- Bank 250 yozuv, 215 tasdiq / 35 ochiq. PREP_2dan ushbu chatda 61 yangi javob mustaqil vizual yechim bilan tasdiqlandi. 61 yozuvga metodik qiyinlik ko‘rigi va uning dalili yozildi. Bu empirik qiyinlik kalibratsiyasi emas.
- Mashq/combo uchun tasdiqlangan qiyinlikka mos keyingi savol tanlovi qo‘shildi. Boshlanish 2, tur bo‘yicha kamida 5 javobdan keyin <50% 1, >=80% 3, aks holda2. Daily/review/mock o‘z tartibida.
- PREP_2/original javoblari eski IQ mukofotlar kalitiga ulana boshladi, 5 XP va300 kunlik chegara saqlandi. Eski IQ modeli yangi IDlarni yo‘qotmaydi. Ikkala yozuvchi Web Locks qulfidan foydalanadi. Yakuniy yangi XP browser/concurrency sinovi hali kerak.
- 570 transkripsiyaning AI auditi review maydonida, inson tasdig‘i verified maydonida alohida. Mutaxassisliklar komponentidagi izoh yangilandi.
- Build146 muvaffaqiyatli. Unit25/25. Schema/assets/manba va repo1200 OK. Astrocheck4avvalgi boshqa bo‘lim xatosi, EYUF0. TopAdmission diff0.
- Dependency havolasi Astro keshiga yozishda EPERM bergani uchun worktreeda dependencylarning alohida nusxasi bor. 4338port band, joriy build serveri4348.
- 2026-11-21 rasmiy landing API qayta o‘qildi. competition-documents6, template-documents8. Rubrika hamon2025_2-tanlov. Blankalar orasida ma’lumotnoma yo‘q. Universitetlar API492yozuvni ko‘rsatadi, birinchi yozuvning reyting nashri2027. To‘liq universitet auditi hali bajarilmagan.

Hali commit/push/merge/deploy bajarilmagan. 35ochiq savol, A/Bimport, qolgan transkripsiya va kesim auditi, 20trek faktlari, qabulmezonlari va yakuniy browser/XP/concurrency tekshiruvi davom etishi kerak. Eski 55/58/74/96sonli oraliq qaydlari tarixiy, engso‘nggi bank holati215/35.

### XP brauzer sinovi

2026-11-21 Chrome, aynan ushbu branchning4348portdagi buildi. Yangi PREP_2 ID birinchi to‘g‘ri javobda mukofot oldi, takror javobda ID takrorlanmadi. Eski IQ sahifasini ochish/reload yangi mukofotni saqladi. Ikki tab bir savolni bir vaqtda yechganda bitta mukofot qoldi. 60mukofot/300XP bo‘lgan Toshkent kunida yangi mukofot berilmadi. JS xatosi0. Skript `/private/tmp/eyuf-xp-audit.cjs`.

16axe holati (360/1280×yorug‘/qorong‘i×mock/hududlar/trenajyor/suhbat) xatosiz, overflow0, JS0. Bu davrda Lighthouse qayta bajarilmadi.

## Yangi chat uchun eng so‘nggi topshirish, 2026-11-21

Muallif chat uzaygani uchun yangi chat ochib kelgan joyidan davom etishni so‘radi. Asos HEAD4c800e34, branchcodex/eyuf-yakun-audit, worktree `/Users/javohir/.codex/worktrees/eyuf-yakun-audit/Tayanch-SAT prep`. Barcha o‘zgarishlar commit qilinmagan. Eski chat endi tahrirlamaydi. Shu worktreeni aniq yo‘l bilan ishlating, boshqa chatga tegishli deb attach rad etilsa fayllarni yo‘qotib yangi toza worktreega o‘tib ketmang.

Eng so‘nggi bank264yozuv:219true/45false. Avvalgi250yozuvda215true/35false. PREP_2A/Bdan14savol va14rasm qo‘shildi, to‘rttasi kalitga mos. Qolgan10tasida mustaqil hisob bilan kalit ziddiyati bor. IMPORTNI NASHRDAN OLDIN QAYTA TEKSHIRISH MUHIM. `/private/tmp/eyuf-import-ab-audit.py`ning tur raqami/kalit javobi keyingi sahifadagi jadvalga to‘g‘ri bog‘langanini alohida tekshiring. Matematik hisoblar oddiy, ko‘p kalit ziddiyati lokator xatosi bo‘lishi ham mumkin. Taxmin bilan verified qo‘ymang. Skript idempotent, mavjud IDlarni tashlab o‘tadi.

Build146 oxirgi17:50:09success. Schema264yozuvOK, unit25/25. Yangi importdan oldingi ChromeXPsinovi o‘tdi, 16axeholat0. Yangi importdan so‘ng browser qayta tekshirilmagan. Astrocheck4boshqa bo‘lim eski xato, EYUF0. Qo‘shimcha helper/debugskriptlar `/private/tmp/eyuf-*`da. Auditning mustaqil yechimlari `/private/tmp/eyuf-audit-numeric-v2.py`danv7gacha, allaqachon bankka kiritilgan. Eski importskriptlarni rerun qilmang. JSONtasdiq reviewda Codexaudit bo‘lib, inson tasdig‘i deb ko‘rsatilmaydi.

Ochiq35asl savoldan ayrimlari ko‘rildi, hali yechim tasdiqlanmagan. PREP_1tasvirlari `public/eyuf/iq/test-*-savol-*`. 3-test13tarozi tayanchi katakchegarasida, masofa kalit6ga mosligi shubhali. 2-test7 A,D,G,K,P,? harfketma-ketligi ochiq. 3-test15jadval va5-test20sonli jadval ko‘rildi, hali yechim yo‘q. Aslrasmlar va variantlar bor, oddiy“false” bilan ish tugadi demang.

Keyingi majburiy ishlar: qolganA/Bsavollar, barchaIQmatn/type/kesim/dublikat; difficultyko‘rigi (hozir61savol metodik), XPstorageblocked/xatotestlar; 20soha8+1faktlarining barcha ochiqbloklari (arxitektura birinchi to‘liq namuna); rasmiyG01–G17 vauniversitetro‘yxat492/2027reyting talqini; originalpromptbilan diagnostika/kurs/ijod/stress/rubrika/mocksuhbat qabulmezonlari; yakuniytest/browser/Lighthouse; commit/push/PR/merge/deployvaA1qaytanashr. Hali nashr qilinmagan, umumiytopshiriq tugamagan.

Muhim rasmiyAPIlar qayta tekshirildi: `https://api.el-yurt.uz/api/landing/v1/competition-documents?per_page=100&lang=uz`6hujjat, `template-documents`8hujjat, `universities`492yozuv. Rubrika2025_2PDF, ma’lumotnomablanka yo‘q. Joriy nusxalar `/private/tmp/eyuf-current-competition-documents.json`, `eyuf-current-template-documents.json`, `eyuf-universities-current.json`. S04freshPDF `/private/tmp/eyuf-specialties-audit.pdf`, hashdocsda. 570qator bet+raqam match,35lotinxato tuzatildi, reviewmetadatahammasida.

## Davomiy audit holati, 2026-11-22

Bu bo‘lim oldingi snapshot raqamlaridan keyingi holatni qayd etadi. Umumiy topshiriq hali tugamagan va bu o‘zgarishlar hali nashr qilinmagan.

- Bank 298 savol, 232 mustaqil tasdiq va 66 ochiq. PREP_1 ikkala kirish nuqtasida 89/11. Eski va yangi bank kaliti/maqomi tengligini tekshiradigan regressiya testi qo‘shildi.
- Mahalliy PDFdagi to‘liq 48 A/B nomzod import qilingan. 30 A yozuvining mos kalit sahifasi mavjud emas, book_answer=null. 16 to‘liq bo‘lmagan parcha shartsiz import qilinmagan.
- Metodik difficulty ko‘rigi 259/298. Qolgan 39 savolning mustaqil yechimi ochiq. Bu baholar empirik kalibratsiya emas. Sonli va harfli deb belgilangan yozuvlarda matn ko‘rigi bajarilgan, figurali savollar va barcha crop/QR ko‘rigi yakunlanmagan.
- PREP2 13-B8 mustaqil koordinata hisobida 181,845 cm chiqadi. Kitob variantlari bilan haqiqiy ziddiyat izohga yozildi. Shart o‘zgartirilmadi.
- 20 soha uchun boshlang‘ich kasbiy tushuncha, xalqaro talab va istiqbol bloklari kiritildi. BLS raqamlari AQSHning 2025–2035 prognozi sifatida berilgan. Butun jahon yoki O‘zbekiston bandlik prognozi deb ko‘rsatilmaydi.
- 2026-yilgi mahalliy dalillar, qonunlar, tashkilotlar, talab va sog‘liq bo‘yicha iqtibos bilan yana 25 blok qo‘shildi. Shaxsiy ish varag‘i va metodik ssenariy manbada tasdiqlangan faktga aylantirilmadi.
- Rasmiy G01–G17 ko‘rigi `rasmiy-qayta-audit.md`da. Universitetlarning barcha 492 yozuvi yuklandi. Rubrika hanuz 2025_2, ma’lumotnoma blankasi ochiq 8 namunada yo‘q, tuition jadvalida davr aniq emas.
- Build 147 sahifa bilan o‘tdi. EYUF unit 26/26. Repo tekshiruvi 1260 faylda muammosiz. Oldingi umumiy unit 399/399 edi, yangi regressiya bilan qayta bajarish kerak. Astro checkdagi to‘rtta boshqa bo‘lim xatosi avvalgi ko‘rikda qayd etilgan.

### Har trekning tekshirilgan fakt bloklari

Son blok miqdorini bildiradi. 0 qolgan manbali kontent ishini ko‘rsatadi. Musbat son butun dars tugallanganini anglatmaydi. Metodik topshiriqlar alohida ko‘rik holatida qoladi. Ustunlar ketma-ket asoslar, mahalliy muammolar, islohot, iqtibos, talab, istiqbol, tashkilot/rollar, suhbat/mutaxassislik va magistr tadqiqoti.

| Trek | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Muhandislik ishi | 1 | 1 | 1 | 0 | 2 | 2 | 1 | 0 | 0 |
| Arxitektura va qurilish | 1 | 3 | 2 | 2 | 3 | 1 | 2 | 0 | 0 |
| Ishlab chiqarish va ishlov berish | 1 | 1 | 2 | 0 | 1 | 2 | 1 | 0 | 0 |
| Axborot-kommunikatsiya texnologiyalari | 1 | 1 | 1 | 1 | 3 | 2 | 1 | 0 | 0 |
| Fizika va tabiiy fanlar | 1 | 0 | 2 | 0 | 1 | 1 | 1 | 0 | 0 |
| Matematika va statistika | 1 | 0 | 2 | 1 | 1 | 1 | 1 | 0 | 0 |
| Biologik va turdosh fanlar | 1 | 0 | 2 | 0 | 1 | 1 | 1 | 0 | 0 |
| Xizmat ko‘rsatish | 1 | 1 | 1 | 0 | 1 | 1 | 0 | 0 | 0 |
| Atrof-muhit | 1 | 1 | 1 | 0 | 1 | 2 | 0 | 0 | 0 |
| Qishloq, o‘rmon, baliq xo‘jaligi | 1 | 1 | 2 | 0 | 2 | 2 | 1 | 0 | 0 |
| Transport xizmatlari | 1 | 1 | 1 | 0 | 1 | 2 | 1 | 0 | 0 |
| Biznes va boshqaruv | 1 | 1 | 2 | 0 | 1 | 1 | 1 | 0 | 0 |
| Veterinariya | 1 | 1 | 2 | 0 | 2 | 1 | 1 | 0 | 0 |
| Ijtimoiy va xulq-atvor fanlari | 1 | 0 | 2 | 0 | 1 | 1 | 1 | 0 | 0 |
| Jurnalistika va axborot | 1 | 1 | 1 | 1 | 2 | 1 | 0 | 0 | 0 |
| Huquq | 1 | 0 | 2 | 0 | 1 | 2 | 0 | 0 | 0 |
| Sog‘liqni saqlash va ijtimoiy ta’minot | 1 | 1 | 2 | 1 | 3 | 2 | 1 | 0 | 0 |
| Ta’lim | 1 | 1 | 2 | 0 | 1 | 1 | 0 | 0 | 0 |
| San’at | 1 | 1 | 3 | 0 | 1 | 1 | 2 | 0 | 0 |
| Tillar | 1 | 0 | 2 | 1 | 2 | 1 | 0 | 0 | 0 |

### Hali bajariladigan ishlar

20 trekning uchta mahalliy muammosi, joriy islohoti, manbali iqtibosi, mahalliy va global talabi, aniq tashkilot/lavozimlari bo‘yicha jadvaldagi bo‘sh joylarni to‘ldirish. Arxitektura namunasini barcha 8+1 dars bo‘yicha yakunlash. IQdagi qolgan mustaqil yechim, figurali tur/matn/crop/QR/dublikat ko‘rigi. Barcha normal foydalanuvchi oqimlari, mobil yorug‘/qorong‘i, accessibility va saqlash regressiyasi. Shundan so‘ng commit/push/PR/merge/deploy va eng yangi main uchun A1 qayta nashri.

### Davomchi uchun aniq yo‘llar

Worktree `/Users/javohir/.codex/worktrees/eyuf-yakun-audit/Tayanch-SAT prep`, branch `codex/eyuf-yakun-audit`. Inherited WIP `18663073`da saqlangan, main `5885b718` bilan merge `7503e811`. Keyingi o‘zgarishlar shu worktree ichida. Eski importlarni rerun qilmang. Yangi skriptlar `/private/tmp/eyuf-local-evidence-v9.py`, `eyuf-local-evidence-v11.py`, `eyuf-definitions-v12.py`, `eyuf-difficulty-v13.py`. Oxirgi skript visual_review_evidence maydonini qo‘shadi, keyingi tuzatishda bu izoh mavjud answer_evidence maydoniga o‘tkazildi, shu sabab uni o‘zgartirmasdan rerun qilmang.
## Yakuniy ko‘rik, 2026-11-22

Muallif 239 tasdiqlangan savol yetarli ekanini bildirdi. Bank hajmini oshirish shu chegarada to‘xtatildi. Saqlangan 298 yozuvdan 239 tasdiqlangan, 59 ko‘rik yozuvi. Mock faqat tasdiqlangan yozuvlardan tuziladi. 30 A yozuvining mos kalit beti mahalliy nusxada yo‘q, qolgan ochiq yozuvlarning mustaqil dalili yetarli emas. Ular ball va XP bermaydi.

- 48 to‘liq A/B savol asl kesimlari bilan ko‘rildi. Yangi import qilinmadi. C va A/Bdan jami 20 kesim qayta olinib, kesilgan formula, namuna yoki variant tiklandi.
- 11 C savolidagi tushib qolgan E variant qaytarildi. Tur ko‘rigi 298/298, metodik qiyinlik 298/298. Barcha shartlar aniq matnga o‘girildi. Grafik variantlarning to‘liq matnli tavsifi 74 yozuvda hali yo‘q, image_only belgisi saqlangan. Ularning shart va tasvirlari bor, matnli transkripsiya tugallangan deb ko‘rsatilmaydi.
- PREP_1ning 100 sharti eski IQ kirishiga ham ulandi. 4-test15ga oldingi matritsa qo‘shildi. 4-test20ning qora tugun haqidagi xato izohi daraja2/3 bilan tuzatildi. 2-test14dagi oldingi noto‘g‘ri izoh ham qayta tuzatildi. Ikkala tildagi asl shart hosil bo‘ladigan kubni so‘raydi. B kub uch yuzning fazoviy yo‘nalishlari bilan tasdiqlanadi.
- Yangi ikki mustaqil yechim. 9-tur C8da 7984ning 8 raqami takrorlanadi, D. 7-tur C2da oxirgi ikki raqam yig‘iladi, qolgan qism teskarilanadi. Oltita o‘tish 34826, C javobini tasdiqlaydi.
- 20 trekdagi 8+1 darslar matnli. Qolgan 19 trekning 513 outline bloki soha vaziyati, ishlangan metodik namuna, shaxsiy mashq va tekshiruv bilan almashtirildi. Arxitektura oldin alohida ishlangan. Metodik vaziyatlar T01 va verified=false bilan manbali faktdan ajratilgan.
- Barcha 20 trekda manbali soha ta’rifi, mahalliy muammo dalillari, islohot, qisqa Prezident iqtibosi, talab, istiqbol va tashkilot yo‘nalishi bor. Mutaxassislik va magistr tadqiqoti darslari shaxsiy ish varag‘i. N01 milliy ish beruvchilar so‘rovi umumiy ko‘nikmalar talabini bildiradi. Alohida kasb vakansiyalari sonini bermaydi. W01 tanlangan15 kasbiy yo‘nalish bo‘yicha xalqaro prognoz qo‘shadi. BLS ma’lumoti AQSHning 2025–2035 prognozi sifatida qoladi. 2031–2032 shaxsiy ssenariysi metodik reja.
- Eski kurslar kirish sahifasiga ham to‘rt kursning normal havolalari qo‘shildi. Top Admission diff0.
- Umumiy unit399/399, EYUF unit28/28. Schema/assets/manba validator298 savol,252 dars,20 trek,14 hudud,171 suhbat yozuvini tekshirdi. Build148 sahifa bilan o‘tdi. Repo1267 faylda muammosiz.
- Normal kirish, diagnostika, faqat rozilikli afzalliklarni saqlash, bakalavr8/magistr9 filtri, progress reload, esse rozilik/reload, esse himoyasi, mock suhbat va71/100 rubrika tekshirildi. Yangi28 axe holati (360/1280, yorug‘/qorong‘i,7 yo‘l) xato0, JS0. Avvalgi16 holat ham xato0.
- Lighthouse accessibility. Kurslar, hujjatlar, arxitektura, trenajyor, suhbat va mock sahifalari100. Telefon hozir adb ro‘yxatida yo‘q. Oldingi Samsung sensor/mikrofon start-stop/blob/delete sinovi qayd etilgan. Ovozning eshitilish sifati, VoiceOver va iPhone/TalkBack amalda sinalmagan.

### Manba chegaralari

G01–G17ning qayta ko‘rigi `rasmiy-qayta-audit.md`da. Ochiq rasmiy hujjatlar orasida2026-2 uchun alohida tasdiqlangan yangi rubrika, Jamg‘arma ma’lumotnoma blankasi va tuition summasining davri topilmagan. Interfeys ularni aniq manba davri bilan ko‘rsatadi. Universitetlar API492 yozuv, reyting nashrlari alohida.

### Hozirgi fakt bloklari

Sonlar manbada tekshirilgan bloklar miqdori. Dars08–09 metodik savol/tadqiqot mahsulotlari bo‘lib, nollari dars yo‘qligini anglatmaydi. Mahalliy muammolar bir blokda uchta dalilni qamrashi mumkin.

| Trek | Asos | Mahalliy | Islohot | Iqtibos | Talab | Istiqbol | Tashkilot | Savollar | Tadqiqot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Muhandislik ishi | 1 | 1 | 1 | 1 | 4 | 2 | 1 | 0 | 0 |
| Arxitektura va qurilish | 1 | 3 | 2 | 2 | 5 | 1 | 2 | 0 | 0 |
| Ishlab chiqarish va ishlov berish | 1 | 1 | 2 | 1 | 3 | 2 | 1 | 0 | 0 |
| Axborot-kommunikatsiya texnologiyalari | 1 | 1 | 1 | 1 | 5 | 2 | 1 | 0 | 0 |
| Fizika va tabiiy fanlar | 1 | 1 | 2 | 1 | 2 | 1 | 1 | 0 | 0 |
| Matematika va statistika | 1 | 1 | 2 | 1 | 3 | 1 | 1 | 0 | 0 |
| Biologik va turdosh fanlar | 1 | 1 | 2 | 1 | 2 | 1 | 1 | 0 | 0 |
| Xizmat ko‘rsatish | 1 | 2 | 1 | 1 | 4 | 1 | 1 | 0 | 0 |
| Atrof-muhit | 1 | 1 | 1 | 1 | 3 | 2 | 1 | 0 | 0 |
| Qishloq, o‘rmon, baliq xo‘jaligi | 1 | 1 | 2 | 1 | 4 | 2 | 1 | 0 | 0 |
| Transport xizmatlari | 1 | 1 | 1 | 1 | 3 | 2 | 1 | 0 | 0 |
| Biznes va boshqaruv | 1 | 1 | 3 | 1 | 3 | 1 | 1 | 0 | 0 |
| Veterinariya | 1 | 1 | 2 | 1 | 3 | 1 | 1 | 0 | 0 |
| Ijtimoiy va xulq-atvor fanlari | 1 | 1 | 2 | 1 | 3 | 1 | 1 | 0 | 0 |
| Jurnalistika va axborot | 1 | 1 | 1 | 1 | 3 | 1 | 1 | 0 | 0 |
| Huquq | 1 | 1 | 2 | 1 | 3 | 2 | 1 | 0 | 0 |
| Sog‘liqni saqlash va ijtimoiy ta’minot | 1 | 1 | 2 | 1 | 5 | 2 | 1 | 0 | 0 |
| Ta’lim | 1 | 1 | 2 | 1 | 4 | 1 | 1 | 0 | 0 |
| San’at | 1 | 1 | 3 | 1 | 3 | 1 | 2 | 0 | 0 |
| Tillar | 1 | 1 | 2 | 1 | 4 | 1 | 1 | 0 | 0 |

### Nashr oldi qo‘shimcha tekshiruv

297 ta WebP savol tasviri macOS Vision QR detektori bilan ko‘rildi, QR0. XP qayta sinovida PREP_2ID, takror javob, eski IQreload, ikki tab va300XPlimit o‘tdi. Storage.setItem bloklangan holatda javob ko‘rinadi, saqlanmagan XP0, JS0. Astrocheck453faylda4avvalgi boshqa bo‘lim xatosini ko‘rsatdi, EYUFxatosi0. Telefon adb ro‘yxati bo‘sh.
