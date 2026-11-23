# EYUF Faza 0. Faktlar va manbalar

`as_of: 2026-11-20`. Auditoriya bakalavriat va magistratura. Holat — muallif ko‘rigi uchun.

Tayanch El-yurt umidi jamg‘armasining rasmiy platformasi emas.

`verified: true` fakt aynan ko‘rsatilgan hujjatda tekshirilganini bildiradi. Hujjatning davri va rasmiyligi alohida qayd etiladi. Keyingi tanlovga tatbiq avtomatik ko‘chirilmaydi. Aniqlashtiriladigan joylar [gaps.md](gaps.md) da, IQ holati [iq-inventory.md](iq-inventory.md) da.

## Manbalar reyestri

Quyidagi barcha manbalar 2026-11-20 kuni tekshirildi. PDF betlari birinchi betdan boshlab sanaladi. Kitobning bosma beti alohida yoziladi. Lokal PDFlar muallifning Downloads papkasida qoladi.

| source | Hujjat va joylashuvi | Davr va ishonch chegarasi |
| --- | --- | --- |
| S01 | PF-77, 2025-05-05, amaldagi matn, ayniqsa 3-ilova. [Lex.uz](https://lex.uz/docs/-7520218) | Huquqiy birlamchi manba. Ko‘rilgan matnda 2025-10-29 o‘zgartirishlari ham bor. |
| S02 | “Nomzodlarga” sahifasidagi Nizom. [Tanlov tartibi](https://el-yurt.uz/candidates?view=rules) | Rasmiy sayt, lekin ayrim tashkilot nomlari Lex.uz matnidan eski. |
| S03 | `Kvota 2026-2.pdf`, 1 bet. [Rasmiy PDF](https://api.el-yurt.uz/storage/quota-documents/992ee8d2-a625-47f9-9fbb-2fdf8bad0954-1793432390.pdf) | 2026-yil 2-tanlov. Jadval ustunlari tasvirda tekshirildi. |
| S04 | `Ustuvor mutaxassisliklar.pdf`, 13 bet, kirill. [Rasmiy PDF](https://api.el-yurt.uz/storage/competition-documents/585002d1-c195-4bd2-bb9e-556606cb7eff-1775139502.pdf) | Sarlavhada 2026-yil. Matn qatlamidagi tartib jadvalning vizual guruhlanishidan farq qilishi mumkin. |
| S05 | `Test Spetsifikatsiyasi (2).pdf`, 4 bet, skaner. [Rasmiy PDF](https://api.el-yurt.uz/storage/competition-documents/b23391a7-e612-48be-a65b-5f43b079c7c2-1775741766.pdf) | Hozir rasmiy saytda berilgan nusxa. Barcha 4 bet tasvirda o‘qildi. Hujjatning ichida 2026-2 deb belgilanmagan. |
| S06 | `Baholash_uslubiyoti_2025_2-tanlov.pdf`, 5 bet. [Rasmiy PDF](https://api.el-yurt.uz/storage/competition-documents/67ec55a7-f608-4303-b7a7-799e020d0408-1763475015.pdf) | 5-betdagi izoh aynan 2025-yil 2-tanlovga tegishli. 2026-2 uchun amal qilishi `verified: false`. |
| S07 | `Tanlov grafigi 2026-2 (2).pdf`, 1 bet. [Rasmiy PDF](https://api.el-yurt.uz/storage/competition-documents/6bd31078-9dd4-48c1-b9e7-a8e386089ca6-1793253675.pdf) | 2026-yil 2-tanlov, muddatlar o‘zgarishi mumkinligi haqida izoh bor. |
| S08 | `/Users/javohir/Downloads/esse_tavsiya.pdf`, 2 bet, kirill | Matni va ikkala bet tasviri o‘qildi. Lokal faylda nashr sanasi, tasdiqlovchi rekvizit va rasmiy yuklash havolasi aniqlanmadi. Mazmun tekshirilgan, rasmiy kelib chiqishi `verified: false`. |
| S09 | `/Users/javohir/Downloads/EYUF Interview questions.pdf`, 3 bet | Muallif bergan tayyorgarlik materiali. 1-xonada 51, 2-xonada 35 savol bor. Rasmiy savol banki ekanligi `verified: false`. |
| S10 | `/Users/javohir/Downloads/Savollar.pdf`, 4 bet, skaner | 25 savol. 1-betda norasmiyligi ochiq yozilgan. 4-betda chet tilidagi savol/javob haqida eslatma bor. OCR orqali o‘qildi, ogohlantirish tasvirda tekshirildi. |
| S11 | `/Users/javohir/Downloads/IQ&Tahliliy fikrlash PREP 1.pdf`, 48 bet | 5 IQ test, har birida 20 savol. Kalitlar PDF 47–48-betlarda, bosma 317–318-betlarda. |
| S12 | `/Users/javohir/Downloads/IQ&Tahliliy fikrlash PREP 2.pdf`, 49 bet | To‘liq kitobning ketma-ket nusxasi bo‘lmagan tanlangan sahifalar. C bo‘limlari, A/B parchalar va kalitlar. To‘liqlik inventarda ajratilgan. |
| S13 | `Tuition fees limit.pdf`, 1 bet. [Rasmiy PDF](https://api.el-yurt.uz/storage/competition-documents/0f9275c0-38d7-4c30-92fc-5caeee889517-1794641298.pdf) | Mamlakat guruhi, daraja va bilim sohasiga qarab chegaralar, AQSh dollarida. Jadval izohida tuition va akademik fees bor. Davriylik aniq yozilmagan. |

S03–S07 va S13 havolalari rasmiy saytning ochiq `quota-documents` va `competition-documents` javoblaridan olindi. Shaxsiy kabinetga kirilmadi.

## Talablar va yo‘llar

Jadvalning barcha qatorlari uchun `as_of: 2026-11-20`, `verified: true`. Qavs ichidagi band `source`ning aniq joyini ko‘rsatadi. Magistr darajasi `master`, bakalavr `bachelor` deb yuritiladi.

| ID | Fakt | level | source |
| --- | --- | --- | --- |
| F01 | Tanlovda O‘zbekiston fuqarolari Nizom shartlari asosida qatnashadi. | bachelor, master | S01, 3-ilova, 4-band |
| F02 | Bakalavr bo‘yicha 30 yoshdan katta nomzodlar va ilgari xorijda o‘xshash bakalavr mutaxassisligida o‘qiganlar qatnasha olmaydi. Matndagi yosh chegarasi 30 ni ham qamrab oladi. Yoshni hisoblash sanasi alohida aniqlashtiriladi. | bachelor | S01, 3-ilova, 5(a) |
| F03 | Magistr uchun 22 dan kichik yoki 40 dan katta yosh, shuningdek xorijda ayni yoki turdosh magistraturani ilgari o‘qiganlik qatnashishga to‘sqinlik qiladi. | master | S01, 3-ilova, 5(b) |
| F04 | Magistrga kamida 1 yil mehnat staji kerak. Mehnat ma’lumoti Yagona milliy mehnat tizimiga to‘liq kiritilgan bo‘lishi shart. | master | S01, 3-ilova, 5(g), 14(b) |
| F05 | Xorijdagi ta’lim bilan bog‘liq xarajatlari to‘liq xorijiy grant bilan qoplanadiganlar, xorijdagi sirtqi/onlayn dasturdagilar, sudlanganligi tugallanmagan yoki olib tashlanmaganlar qatnasha olmaydi. Faqat tuition qoplanadigan grant alohida imtihonsiz yo‘l shartlarida tekshiriladi. | bachelor, master | S01, 3-ilova, 5(e,j,z), 21–23-bandlar |
| F06 | Nizom 6 bosqichni sanaydi. Hujjatlar, uch imtihonsiz yo‘l, test va suhbat. | bachelor, master | S01, 3-ilova, 19-band |
| F07 | Top-100 imtihonsiz yo‘lda tuition to‘liq qoplanadigan grant va tegishli kvota talab qilinadi. Bakalavrga QS, magistrga THE global reytingi olinadi. G‘oliblar kvota va universitet reytingi asosida aniqlanadi. | bachelor, master | S01, 3-ilova, 9, 21-bandlar |
| F08 | Top-300 imtihonsiz yo‘lda tuition to‘liq qoplanadigan grant talab qilinadi. Ushbu yo‘l g‘oliblariga transport va turar joy xarajatlari ajratiladi. | bachelor, master | S01, 3-ilova, 22-band |
| F09 | Prezident, ijod va ixtisoslashtirilgan maktab bitiruvchisi QS top-20 bakalavrga tuition kamida yarmi qoplanadigan grant bilan kirsa, tegishli imtihonsiz yo‘l mavjud. | bachelor | S01, 3-ilova, 23-band |
| F10 | Boshqaruv kengashi top-300ga kirmagan sohaviy yetakchi muassasalar ro‘yxatini ham tasdiqlashi mumkin. Joriy ro‘yxat alohida tekshiriladi. | bachelor, master | S01, 3-ilova, 10, 12(g) |
| F11 | Umumiy hujjatlar ariza, pasport/ID, til sertifikati yoki shartsiz qabul asosidagi istisno, yo‘nalish ko‘rsatilgan amaldagi qabul/shartli qabul xati, Jamg‘arma shaklidagi ma’lumotnomadan iborat. Grant hujjati tegishli yo‘l uchun kerak. | bachelor, master | S01, 3-ilova, 12-band |
| F12 | IELTS Academic bakalavrga kamida 6, magistrga kamida 7 yoki tenglashtirilgan sertifikat. Shartsiz qabul xati taqdim etilsa, til sertifikatini taqdim etish talab qilinmaydi. Kengash talab ballarini qayta ko‘rishi mumkin. | bachelor, master | S01, 3-ilova, 12(v) |
| F13 | Bakalavrga attestat/diplom va motivatsion esse qo‘shimcha kerak. | bachelor | S01, 3-ilova, 13-band |
| F14 | Magistrga diplom ilovasi bilan, mehnat daftarchasi nusxasi, agar mavjud bo‘lsa ilmiy maqolalar ro‘yxati va elektron shakllari, motivatsion esse kerak. | master | S01, 3-ilova, 14-band |
| F15 | Xorijda berilgan attestat/diplom uchun vakolatli organ tan olganlik hujjati ham talab qilinadi. | bachelor, master | S01, 3-ilova, 16-band |
| F16 | Ariza onlayn beriladi. Tanlovdan o‘tgach tegishli hujjatlar va kafolatlar chop etilgan shaklda taqdim etiladi. | bachelor, master | S01, 3-ilova, 17-band |
| F17 | Foundation xarajatlarini Kengash qarori bilan moliyalashtirish mumkin. Tayyorlov va bakalavrning jami muddati 4 yildan oshmasligi kerak. | bachelor | S01, 3-ilova, 6-band |

## Test

Quyidagi qatorlarda ham `as_of: 2026-11-20`, `verified: true`. S05 bo‘yicha 2026-2ga tatbiqning hujjat ichidagi sanasi aniqlashtiriladi.

| ID | Fakt | level | source |
| --- | --- | --- | --- |
| F18 | Test intellektual, tahliliy, ijodiy qobiliyat va psixologik barqarorlik darajasini baholashga qaratilgan. Tashkilotchi Bilim va malakalarni baholash agentligi. | bachelor, master | S01, 3-ilova, 24-band |
| F19 | Testdan kamida 61/100 olish suhbatga o‘tish sharti. | bachelor, master | S01, 3-ilova, 24-band |
| F20 | Amaldagi SAT kamida 1300, GRE Verbal/Quantitative/Writing har biri kamida 75-persentil, GMAT Verbal/Quantitative bo‘yicha kamida 75-persentil, A-Level fanlar bo‘yicha kamida A bilan testdan ozod qilish va eng yuqori ball berish nazarda tutilgan. GMAT yangi formatiga moslashtirish aniqlashtiriladi. | bachelor, master | S01, 3-ilova, 24-band |
| F21 | Bakalavr testi 20 tahliliy fikrlash va 20 IQ savolidan iborat. | bachelor | S05, PDF 1-bet, I bo‘lim |
| F22 | Magistr testi 20 tahliliy fikrlash va 20 ilmiy-tadqiqot kompetensiyasi savolidan iborat. | master | S05, PDF 1-bet, I bo‘lim |
| F23 | Test o‘zbek tilida. Asosan 4–6 variantli, bitta to‘g‘ri javobli yopiq topshiriqlar. | bachelor, master | S05, PDF 1 va 3-betlar |
| F24 | 40 topshiriqqa 60 daqiqa. To‘g‘ri javob 2,5 ball, noto‘g‘ri javob 0 ball. | bachelor, master | S05, PDF 3-bet, IV bo‘lim |
| F25 | Tahliliy blokda aylantirish, shaklni qismlarga ajratish/yig‘ish, mantiqiy bog‘lanishlar, so‘z va tushunchalar, son-harf qonuniyatlari va tasniflash bor. IQ blokida sonli/shaklli qonuniyatlar, tushirilgan raqam va anagramma ham bor. | bachelor, master | S05, PDF 2–3-betlar, kodifikator |
| F26 | Ilmiy-tadqiqot bloki metodlar, metodologik yondashuvlar, ilmiy adabiyot izlash va tahlil, maqola yozish, innovatsiya, axborot texnologiyalarini qamraydi. | master | S05, PDF 3-bet, III kompetensiya guruhi |

S05da ijodiy fikrlash yoki psixologik barqarorlik uchun alohida savol soni/rubrika berilmagan. Ular bo‘yicha tayyorgarlik mashqlarining dizayni Tayanch metodik qarori sifatida belgilanadi.

## Suhbat va majburiyatlar

Bu jadval uchun `as_of: 2026-11-20`, `verified: true`, `level: ["bachelor","master"]`.

| ID | Fakt | source |
| --- | --- | --- |
| F27 | Suhbat davlat tilida, eng yuqori ball 100, kamida 61 ball olganlar suhbatdan o‘tgan deb e’tirof etiladi. | S01, 3-ilova, 25-band |
| F28 | Sadoqat, ma’naviy-axloqiy tafakkur, dunyoqarash va qadriyatlar, xorijda o‘qish maqsadi, bilimni O‘zbekistonda qo‘llash, mutaxassislik bilimi baholanadi. Esse alohida inobatga olinadi. | S01, 3-ilova, 25-band |
| F29 | Suhbat jarayonlari yoziladi, onlayn ovozli translyatsiya qilinadi va maxsus platformaga joylashtiriladi. | S01, 3-ilova, 25-band |
| F30 | Xorijda o‘qiyotgan yoki xizmat safaridagi nomzodning asoslantirilgan murojaati va komissiya qarori bilan test hamda suhbat videomuloqot shaklida tashkil etilishi mumkin. | S01, 3-ilova, 25-band |
| F31 | Baholash uslubiyoti suhbatdan bir oy oldin e’lon qilinadi. Tanlov komissiyasining kamida yarmi nodavlat tashkilotlar vakillari bo‘lishi zarur. | S01, 3-ilova, 3-band |
| F32 | Natijadan boshlab 3 ish kuni davomida apellyatsiya beriladi. Qabul qilingan shikoyat 5 ish kunida ko‘rilib javob yuborilishi kerak. Qayta test/suhbat/yozma ishga ruxsat berilmaydi. | S01, 3-ilova, 30, 35-bandlar |
| F33 | G‘oliblarni aniqlashda test va suhbat umumiy ballari, kvota hisobga olinadi. | S01, 3-ilova, 26-band |
| F34 | Stipendiat, Jamg‘arma, ish beruvchi va moliyaviy kafillar o‘rtasida to‘rt tomonlama shartnoma rasmiylashtiriladi. | S01, 3-ilova, 28-band |
| F35 | Ishsiz bakalavr stipendiat uchun ish beruvchi buyurtmachi tomon va kafolat beruvchi — amaldagi matnda Boshqaruv samaradorligi agentligi. | S01, 3-ilova, 17(a), 28-bandlar |
| F36 | Moliyaviy kafolat hujjatlari va uzrsiz bekor qilish oqibatlari mavjud. Asosiy Farmon 13(v) bandida sarflangan barcha xarajatlarning ikki barobari ko‘rsatilgan. Nizom 17(b) bandida xarajatlar va kamida ikki barobar moliyaviy jarima birga tilga olingan. Aniq hisob-kitob shartnoma matni bilan tekshiriladi. | S01, Farmon 13(v), 3-ilova 17(b) |
| F37 | Bakalavr/magistr shartsiz qabul hujjatini 6 oyda taqdim etmasa yoki g‘oliblik qaroridan boshlab 1 yilda o‘qishni boshlamasa, Kengash qarori bilan stipendiya bekor qilinishi mumkin. | S01, 3-ilova, 29-band |
| F38 | Konsullik ro‘yxati, o‘qish davri yakunlarida akademik hisobot, qo‘shimcha grantlar haqida xabarlash, o‘zlashtirish va yurish-turish majburiyatlari bor. Qo‘shimcha ishlashga cheklovda o‘qish bilan bog‘liq volontyorlik istisno qilingan. | S01, 3-ilova, 36-band |
| F39 | To‘liq kurs tugagach uzog‘i bilan 1 oyda qaytish, qaytgach uzog‘i bilan 1 oyda ish boshlash va shartnomadagi muddat uzluksiz to‘liq bandlikda ishlash ko‘rsatilgan. | S01, 3-ilova, 36-band |
| F40 | Asosiy Farmon 13(a)(ii–iii) bandida bakalavrga 5 yil, magistrga 3 yil ishlab berish yozilgan. Bu raqamlar rasmiy matnda tekshirildi. Shaxsiy shartnoma va tegishli istisnolar darsda alohida ko‘riladi. | S01, Farmon 13(a), 3-ilova 36-band |

## Davri chegaralangan suhbat metodikasi

`as_of: 2026-11-20`. Quyidagilar S06 mazmuni uchun `verified: true`, aynan 2026-2ga tatbiqi uchun `verified: false`.

| ID | S06dagi ma’lumot | source |
| --- | --- | --- |
| H01 | Uch mezonning maksimumlari 30, 30, 40 ball. Ular qadriyat/sadoqat/dunyoqarash, esse va qaytib bilim qo‘llash rejasi, mutaxassislik nazariyasi va amaliyotiga tegishli. | S06, PDF 3–5-betlar |
| H02 | Suhbat 30 daqiqagacha. A’zolarning baholari o‘rtachasi olinadi. Taklif etilgan ekspert/stipendiat fikr bildiradi, ball qo‘ymaydi. | S06, PDF 2-bet |
| H03 | Hujjatning yakuniy izohi uslubiyotni 2025-yil 2-tanlov nomzodlarini baholashga asos deb belgilaydi. | S06, PDF 5-bet |

## Esse tavsiyalarining lotincha mazmuni

`as_of: 2026-11-20`, `level: ["bachelor","master"]`. Quyidagi mazmun lokal S08ga solishtirildi. Hujjatning rasmiy kelib chiqishi va joriy tanlov uchun majburiyligi aniqlashtirilguncha umumiy `verified: false`. Matnning o‘zida “odatda”, “o‘rtacha” kabi uslubiy tavsiya ifodalari bor.

| ID | Lotincha qayd | source |
| --- | --- | --- |
| E01 | Hajm odatda o‘rtacha 500–1000 so‘z atrofida, bir yoki ikki varaq bo‘lishi mumkin. | S08, PDF 1-bet, 1-tavsiya |
| E02 | Kirish, asosiy qismlar, xulosa. Times New Roman, Arial yoki Bookman, 12–14 o‘lcham tavsiya etilgan. | S08, PDF 1-bet, 2–3-tavsiyalar |
| E03 | Nomzod nega munosib ekanini dastur talablarini anglab, kamida uchta asosiy talabga tayangan holda isbotlashi kerak. Uch dalil mashqi shu fikrga asoslangan Tayanch mashqi bo‘ladi. | S08, PDF 1-bet, mazmun bo‘limi 2-band |
| E04 | Soha dolzarbligi, o‘qishdan maqsad va qaytgach bilimning jamiyat/davlatga foydasi tushuntiriladi. | S08, PDF 1–2-betlar, mazmun 3-band |
| E05 | Haqqoniylik, imkoniyatlarga xolis baho, ko‘chirmachilik va yolg‘on ma’lumotdan saqlanish ko‘rsatilgan. | S08, PDF 2-bet, mazmun 4-band |
| E06 | Tajriba va ko‘nikmalar bilan tanlangan davlat, universitet va yo‘nalish ahamiyati bog‘lanadi. Xulosada ilmiy/kasbiy hamda mamlakat/jamiyat uchun ta’sir dalillanadi. Uslub, grammatika, sintaksis va qismlar bog‘liqligi qayta tekshiriladi. | S08, PDF 2-bet, mazmun 5–7-bandlar |

## Kvotalar, 2026-yil 2-tanlov

`as_of: 2026-11-20`, `verified: true`, `source: S03, PDF 1-bet`. Raqamlar aynan ustun ma’nosi bilan keyinchalik `data/eyuf/quotas.json`ga ko‘chiriladi.

| Daraja | Jami | Top-100 imtihonsiz | Top-300 imtihonsiz | Top-20 imtihonsiz | Ochiq tanlov |
| --- | --- | --- | --- | --- | --- |
| bachelor | 101 | 5 | 5 | 2 | 89 |
| master | 158 | 1 | 1 | — | 156 |

Sohalar qatoridagi sonlar **ochiq tanlov** ustunida turibdi. Darajaning jami kvotasi sifatida berilmaydi. AI qo‘shimcha qatori AKTga aloqador alohida 5/3 o‘rin. Ma’lumot modelida ikki marta qo‘shishni oldini oladigan alohida qayd kerak.

| Ta’lim sohasi | bachelor ochiq | master ochiq |
| --- | --- | --- |
| Muhandislik ishi | 10 | 11 |
| Ishlab chiqarish va ishlov berish sohalari | 9 | 9 |
| Arxitektura va qurilish | 10 | 9 |
| Axborot-kommunikatsiya texnologiyalari | 9 | 7 |
| Sun’iy intellekt qo‘shimcha qatori | 5 | 3 |
| Biologik va turdosh fanlar | 7 | 5 |
| Atrof-muhit | 3 | 6 |
| Fizika va tabiiy fanlar | 9 | 11 |
| Matematika va statistika | 8 | 11 |
| Qishloq, o‘rmon, baliq xo‘jaligi | 3 | 10 |
| Veterinariya | 2 | 4 |
| Xizmat ko‘rsatish sohasi | 4 | 13 |
| Transport xizmatlari | 3 | 9 |
| Biznes va boshqaruv | 3 | 5 |
| Huquq | 0 | 5 |
| Sog‘liqni saqlash va ijtimoiy ta’minot | 0 | 15 |
| Ijtimoiy va xulq-atvorga mansub fanlar | 2 | 7 |
| Jurnalistika va axborot | 2 | 5 |
| Ta’lim | 0 | 6 |
| San’at | 0 | 3 |
| Tillar | 0 | 2 |
| **Ochiq tanlov yig‘indisi** | **89** | **156** |

15 sohada bakalavr ochiq kvotasi musbat, 5 sohada nol. Bu 2026-2 holati. Keyingi tanlov filtri yangi ma’lumotdan olinadi. Magistr uchun barcha 20 sohada ochiq kvota musbat. Manbadagi 10 bilim sohasi bilan 20 ta’lim sohasi aralashtirilmaydi.

Arxitektura va qurilish uchun S04ning PDF 4-betida 145–177-raqamlar oralig‘idagi mutaxassisliklar bor. Ular orasida arxitektura, shaharsozlik va landshaft arxitekturasi, qurilish muhandisligi, konstruktiv loyihalash, zilzilabardoshlik, yo‘l muhandisligi, geotexnika va restavratsiya bor. To‘liq lotincha ro‘yxat Faza 2da asl jadvalning guruh chegaralari bilan solishtiriladi.

## Tanlov grafigi, 2026-yil 2-tanlov

`as_of: 2026-11-20`, `verified: true`, `source: S07, PDF 1-bet`. Bu hujjatda e’lon qilingan jadval. Sana o‘zgarishi mumkinligi haqidagi izoh ham saqlanadi.

| Hodisa | Boshlanish | Yakun |
| --- | --- | --- |
| Hujjatlar qabuli | 2026-11-01 | 2026-11-15 |
| Hujjatlarni tahlil qilish | 2026-11-16 | 2026-11-21 |
| Birinchi bosqich natijasi | 2026-11-23 | shu kun |
| Test | 2026-11-25 | shu kun |
| Test apellyatsiyasi jadvali | 2026-11-25 | 2026-11-27 |
| Davlat tilidagi suhbat | 2026-11-27 | 2026-12-12 |
| Suhbat apellyatsiyasi jadvali | 2026-12-14 | 2026-12-16 |
| Tanlov natijalari | — | 2027-01-16gacha |

Jadvaldagi apellyatsiya kunlari bilan Nizomdagi individual natijadan boshlanadigan 3 ish kunlik muddat alohida yoziladi. 2026-11-20 holatida jadvaldagi hujjat qabuli muddati o‘tgan. Shaxsiy suhbat sanasi alohida grafikdan olinishi kerak.

## Suhbat savollarining manba maqomi

`as_of: 2026-11-20`. S09dagi 51 + 35 va S10dagi 25 yozuv — takrorlari ajratilmagan **111 manba yozuvi**. Bu noyob savollar soni emas. Rasmiy bank ekanligi `verified: false`.

S09ning xona bo‘yicha bo‘linishi o‘sha qo‘llanmaning tuzilishi sifatida saqlanadi. Nizom va tekshirilgan S06da ikki xona majburiyligi aniqlanmadi. S10dagi chet tilidagi blok haqidagi fikr ham norasmiy tayyorgarlik eslatmasi sifatida beriladi. Rasmiy davlat tili talabi S01dan olinadi.

## Faza chegarasi

Ushbu bosqichning mahsuloti uchta hujjat. Darslar rejasi Faza 1da tuziladi. JSON sxemalari va import Faza 2ga tegishli. UI va saqlash xatti-harakati Faza 3 oldidan alohida spetsifikatsiya bilan kelishiladi.
