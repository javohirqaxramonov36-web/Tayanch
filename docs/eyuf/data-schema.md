# EYUF Faza 2. Ma’lumot sxemalari va import namunasi

`as_of: 2026-11-21`. Holat — muallif ko‘rigi uchun. Tayanch El-yurt umidi jamg‘armasining rasmiy platformasi emas.

## Katalog

Repo ildizidagi `data/eyuf/` ichida tayyorlov ma’lumotlari va Draft-07 JSON Schema hujjatlari bor. Shu fazada sahifalar ushbu fayllarni import qilmaydi. Rasmiy qoidalar va raqamlarning snapshot manbalari [fact-sheet.md](fact-sheet.md)da, ochiq masalalar [gaps.md](gaps.md)da.

| Fayl | Mazmuni | Ko‘rik holati |
| --- | --- | --- |
| lessons.json | Faza 1dagi 252 darsning 13 majburiy maydoni, qo‘shimcha status/review_notes | Reja bloklari `outline`, barcha darslar draft va verified false |
| questions-iq.json | PREP_1 1-test, 20 savol, eski IDlar saqlangan | 19 javob PR #200 auditida tasdiqlangan, 9-savol ochiq |
| questions-interview.json | S09dan 86, S10dan 25 manba yozuvi | Norasmiy, transkripsiya muallif ko‘rigini kutadi, verified false |
| tracks.json | 20 trek, har birida 9 dars IDsi | Arxitektura uchun S04dagi 33 nomning lotincha qoralamasi, qolgan mutaxassislik ro‘yxatlari ochiq |
| regions.json | 14 hudud uchun tarix/shaxs/sanoat maydonlari | Fakt matnlari yig‘ilguncha null yoki bo‘sh ro‘yxat, verified false |
| quotas.json | 2026-2 daraja va ochiq kvotalar, imtihonsiz hamda AI qo‘shimcha qatorlari | Faza 0da tekshirilgan S03 snapshoti |
| news.json | Yangilikning sana, manba va arxiv holati uchun kolleksiya | Hozir yozuv yo‘q |
| sources.json | S01–S13 va T01 manba reyestri | Rasmiylik va joriy tanlovga tatbiq alohida |
| settings.json | Kitob kontenti sozlamasi, nashr holati va eslatma | book_content_enabled false, publication draft |
| schemas/*.schema.json | Yuqoridagi to‘qqiz faylning sxemalari | Majburiy maydonlar, daraja, tur va qiymat chegaralari |

## Ma’lumot talqini

Kolleksiyalarda `schema_version`, `as_of`, `items` bor. Har dars/savol/faktning tekshiruv sanasi kolleksiyadan mustaqil. `as_of` tekshiruv yoki snapshot sanasi, tanlovning o‘zi `competition` bilan belgilanadi. Tarixiy 2026-2 raqamlarini sana yangilandi degan sabab bilan yangi tanlovga qo‘llash mumkin emas.

`level` faqat bachelor va master qiymatlarini oladi. Nol bakalavr ochiq kvotali besh trek darslari ushbu snapshotda master bilan cheklangan. Qolgan 15 trekning umumiy darslari ikki darajada, to‘qqizinchisi masterda. IQ savollarining ikki daraja tegi umumiy mantiq mashqiga tatbiq etiladi. Magistrning ilmiy-tadqiqot mock blokini shu tegning o‘zi qoplamaydi.

Dars `sources` maydonida `{id, locator}` yozuvlari bor. Eski rejaning manba/bo‘shliq qaydlari `review_notes`da saqlangan. Manbalar reyestriga murojaat mavjudligi ularning barcha lokatorlari sahifa/band darajasida yakuniy tahrir qilinganini bildirmaydi. Darslarning outline bloklari keyingi fazada matn va mashqqa aylantiriladi.

Suhbat savollarining `source` maydoni kitob IDsi, xona/to‘plam, PDF bet va manba savol raqamini saqlaydi. Takror savollar hali birlashtirilmagan. S09 1-xona 37-savolidagi 5 yil norasmiy savolning asl matni sifatida saqlangan. Darajaviy majburiyat tushuntirishida S01 va shaxsiy shartnoma ishlatiladi. Xona tegi mashq qo‘llanmasidan olingan.

`official`, `applicability_verified` va kontentdagi `verified` alohida. Masalan, S06 rasmiy hujjat bo‘lsa ham uning joriy tanlovga tatbiqi ochiq. `verified: false` va null maydonlar foydalanuvchi ekranida manba kutilmoqda holatiga aylanishi kerak. Ularni nol yoki to‘qima matnga aylantirish mumkin emas.

## IQ namunasi

PR #200dan keyingi `05d0a0104d441fce4a821247b58255911bbc9f06` asos olindi. Mavjud WebP kesimlari qayta ishlatildi. Har rasmning yo‘li, o‘lchami, PDF beti va qisqa alt matni bor. Ko‘p betli savollar sabab `image` ro‘yxat sifatida saqlanadi. Yangi nusxa rasm va manba PDF repoga qo‘shilmadi. Manba QR-kodlari yoki video manzillari yangi ma’lumotga olinmadi.

Sonli savollarning sharti/jadvali va variantlari matnga ko‘chirildi. Figuralar tasvirda saqlandi. `image_only: true` variant matni rasmga murojaat qiladi. Bular to‘liq ekransiz yechish mumkin bo‘lgan geometrik tavsif maqomiga ega emas. Alt va transkripsiya uchun foydalanuvchi ko‘rigi kerak.

Har savolda `explanation.rule`, `steps`, `trap` bor. `rule` va qadamlar mavjud mustaqil yechim yozuvlaridan olindi, tuzoqlar ushbu fazada pedagogik izoh sifatida qo‘shildi. 9-savolning kitob javobi D `book_answer`da saqlangan, `answer` null, `verified` false. Qolgan 19 savolning javob tasdig‘i avvalgi auditdan meros. Ushbu fazada 19 yechim yangidan mustaqil yechilgani da’vo qilinmaydi.

`verified` aynan javob tasdig‘i. `review.transcription_verified`, `review.type_verified` va `difficulty_verified` alohida. Boshlang‘ich difficulty 2 ishchi qiymat sifatida berilgan va hammasida difficulty_verified false. Adaptiv qiyinlikda kalibrlangan qiymat sifatida ishlatilishidan oldin tasdiq kerak.

`data/eyuf/saralash.mjs`dagi `savollarniSarala()` umumiy kitob kontenti sozlamasini mashq va mockka bir xil qo‘llaydi. `mock: true` qo‘shimcha verified va null bo‘lmagan answer shartini qo‘llaydi. book o‘chirilsa ushbu 20 kitob savoli ikkala rejimdan ham tushadi. Hozir yangi paketdagi sozlama false, keyingi UI nashridan oldin muallif bilan ko‘riladi. Mavjud jonli IQ sahifasining sozlamasi bu faylga hali ulanmagan.

Ushbu namunada mockka saralash yoqilganda 19 savol qoladi. Bu 40 savollik rasmiy formatni to‘ldirmaydi. To‘liq mock uchun darajaga mos yetarli va takrorlanmaydigan bloklar kerak. Ushbu paketning o‘zi bilan to‘liq mock ochilmaydi.

## Kvota va tartib

Sohaviy `open` ustunlari imtihonsiz kvotalardan ajratilgan. `additional`dagi AI qatori `included_in_base: false` bilan ifodalangan. Bakalavr sohalar yig‘indisi 84, AI 5, ochiq jami 89, imtihonsiz 12 bilan 101. Magistr sohalar 153, AI 3, ochiq 156, imtihonsiz 2 bilan 158.

`treklarniSarala()` darajaga mos treklarni filtrlab, ochiq kvotaning kamayishi bo‘yicha tartiblaydi. Teng sonlarda `order` rasmiy qator tartibi ishlaydi. Bachelor uchun 15, master uchun 20 trek qaytadi. Hozir qo‘shimcha AI satri AKTning asosiy tartib soniga qo‘shilmaydi. U mustaqil metadata bo‘lib ko‘rsatiladi.

## Mavjud saqlangan progress bilan moslik

Savol IDlari iq-1-01…iq-1-20 o‘z holicha qoladi. Ushbu fazada eski `tayanch:eyuf-iq:v1` JSONi va KONTENT_VERSIYA o‘zgartirilmagan. Yangi kolleksiya mavjud sessiyalarning formatini almashtirmaydi. Kelajak adapter yangi sxemani mavjud `IqSavol`ga aylantirganda variant harflari, rasm tartibi va `kitobJavobi` mosligini saqlashi kerak.

Yakunlangan eski urinishning XPsi qayta yozilmasligi va takror yechish uchun avvalgi mukofot IDlari saqlanishi shart. 9-savol keyin tasdiqlansa javob ma’lumoti yangilanadi, eski mukofotlar ko‘chirilmaydi. LocalStorage try/catch va buzilgan holatni tiklash UI integratsiyasida mavjud model orqali sinovdan o‘tadi. Faza 3 oldidan xatti-harakat spetsifikatsiyasi alohida ko‘riladi.

## Tekshirish

`PATH=/opt/homebrew/bin:$PATH node scripts/eyuf/tekshir.mjs`

Skript mavjud node_modules ichidagi Ajv paketidan foydalanadi. To‘qqiz sxema, noyob ID, manba bog‘lanishi, 252 dars, 20×9 trek darslari, hudud/suhbat sonlari, kvota yig‘indilari, rasm fayllari, book sozlamasi, mockdagi ochiq javob va yaroqsiz namunalar tekshiriladi. Ajv yangi to‘g‘ridan-to‘g‘ri dependency sifatida package.jsonga qo‘shilmagan. Toza muhitda Ajv topilmasa validator uchun aniq dev dependency masalasi keyingi integratsiyada hal qilinadi.

Qo‘shimcha regressiya `PATH=/opt/homebrew/bin:$PATH node --test src/lib/eyuf/iq/model.test.ts` orqali bajariladi. Build va repo tekshiruvi ham ish yakunida bajariladi. Ushbu data fazasida yangi UI, 360px ko‘rinish yoki Lighthouse natijasi hosil bo‘lmaydi.
