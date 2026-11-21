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
