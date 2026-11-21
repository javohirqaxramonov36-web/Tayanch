# EYUF Faza 3. UI qoralamasi va tekshiruv

`as_of: 2026-11-21`. Branch `codex/eyuf-manbalar-faza0`. Nashr va merge bajarilmagan.

## Qurilgan qismlar

| Yo‘l | UI va mantiq |
| --- | --- |
| /uz/eyuf/reja/ | Daraja va tanlov shartlari bo‘yicha uch alohida hisobot, muddat/vaqtga mos kunlik reja, kun vazifalarini tahrirlash va yuklab olish |
| /uz/eyuf/tayyorgarlik/ | c1ning 14 darsi, daraja filtri, matnli qoralamalar, ish varag‘i, hujjat belgisi, dars mahsuloti progressi, esse uchun opt-in saqlash |
| /uz/eyuf/trenajyor/ | Birinchi test namunasi, tur/daraja filtri, mashq, sprint, combo, kunlik savollar/streak, mahorat, badge shartlari va 1/3/7 kunlik takrorlash |
| /uz/eyuf/suhbat/ | Norasmiy savol kartalari, xona/soha filtri, 15/20 daqiqalik Tayanch mock, MediaRecorder, tarixiy rubrika, diagramma va matnli jadval |
| /uz/eyuf/soha/arxitektura/ | Darajaviy 9 dars ish varag‘i, ko‘rik uchun lotincha mutaxassisliklar, manba kutilayotgan bloklar |

Yangi sahifalar qoralama va noindex. EYUFga tegishli mahalliy qobiq mavjud BolimQobiq, QavatFoto, tugma va DS tokenlaridan foydalanadi. Har yangi sahifada rasmiy platformaga aloqador emaslik eslatmasi, manba holati va lokal EYUF ma’lumotlarini tozalash amali bor. Eski EYUF kurs sahifalariga ham eslatma qo‘shildi. Top Admission va umumiy layout/tokens fayllari tahrir qilinmagan.

Diagnostika sezgir moslik javoblarini tab xotirasida tutadi. Opt-in saqlashda daraja, kunlik vaqt va qolgan kunlar yoziladi. Joriy yoshni hisoblash sanasi hamda hujjatlarning rasmiy tekshiruvi ochiq bo‘lgani uchun moslik xulosasi tegishli noaniqliklarni saqlaydi. GMAT talqini rasmiy aniqlashtirish talab qilgan holat sifatida ko‘rsatiladi. Moslik, imtihonsiz yo‘l va test istisnosi bir-biriga qo‘shib yuborilmaydi.

Kurs matnlari Faza 0dagi faktlar va muallifning pedagogik topshirig‘i asosida yozilgan yangi qoralama. `verified` false holati saqlangan. Esse ish varag‘i foydalanuvchining matnini saqlaydi. Tayanch tomonidan avtomatik esse yozish yoki tashqi AIga jo‘natish qo‘shilmagan. `interviewEngine` kelajakdagi server orqali ulanadigan mexanizm uchun tip chegarasini beradi.

## Muhim cheklovlar

- `data/eyuf/settings.json`dagi `book_content_enabled` false holatida. Bu sozlama endi yangi trenajyor va avvalgi /uz/eyuf/iq/ sahifasidagi kitob mashqini bir joydan boshqaradi. Shuning uchun ushbu branchning yakuniy lokal buildida ikkala joyda kitob kontenti o‘chirilgan xabari turadi. Jonli sayt ushbu branchdan nashr qilinmagan.
- Kitob yoqilgan vaqtinchalik buildda faol IQ oqimlari sinaldi, so‘ng sozlama falsega qaytarilib yakuniy build qayta qurildi. Birinchi testdagi 9-savolning javobi ochiq. Uning ball/XP maqomi o‘zgarmagan. To‘liq mock uchun 40 savollik darajaviy qamrov yetarli emas, shu sabab u tayyorlanmoqda holatida.
- Qiyinlik tasdiqlanmagan. Adaptiv difficulty tanlovi faollashtirilmagan. Interval takrorlash, mahorat va badge shartlari tasdiqlangan metodik parametrlar bo‘yicha ishlaydi. Kichik bankda ayrim badge shartiga hali yetib bo‘lmaydi.
- Arxitektura trekidagi muammo, qonunchilik, iqtibos, talab va tashkilot faktlari uchun manbalar kutilmoqda. Qolgan treklar, hudud tarix/shaxs/sanoat kontenti va yangi yangiliklar bu fazada to‘ldirilmagan. Ular verified truega o‘tkazilmagan.
- Suhbat rubrikasi 2025-2 tarixiy manba maqomida ko‘rsatiladi. 2026-2 uchun rasmiy tasdiq ochiq. Suhbat savollari norasmiy va transkripsiya ko‘rigini kutmoqda.

## Bajarilgan tekshiruvlar

- `node scripts/eyuf/tekshir.mjs` — 10 JSON sxemasi, 252 dars, 20 trek, 14 hudud, 111 suhbat yozuvi, 20 IQ savoli, kvota/manba/rasm bog‘lanishlari va mock/book saralashi o‘tdi. Diagnostika raqamlari `rules.json`ga, uning sxemasi `schemas/rules.schema.json`ga joylashtirildi.
- `node --test src/lib/eyuf/reja.test.ts src/lib/eyuf/trenajyor.test.ts src/lib/eyuf/iq/model.test.ts` — 15/15. Yosh/daraja/grant/sertifikat farqlari, muddatli reja, interval/mahorat/badge/streak, parallel progress va eski IQ XP regressiyalari o‘tdi.
- Lokal Chrome funksional tekshiruvi — diagnostika hisoboti, daraja filtri, mahsulot progressi va reload, esse opt-in tiklash, ikki tab kurs progressi, storage yozishi rad etilganda davom etish o‘tdi.
- Kitob yoqilgan vaqtinchalik lokal build — mashq va darhol izoh, A–F, zoom/Escape, kunlik 10 savol va streak, bo‘sh takrorlash navbati, sprint muddatida yakunlash o‘tdi. Yakuniy o‘chirilgan holatda yangi va avvalgi IQ sahifasidagi gate tekshirildi.
- Suhbat — tasodifiy karta, tarixiy rubrika natijasi va matnli jadval o‘tdi. Sun’iy mikrofon bilan yozish/to‘xtatish/tinglash elementi/yuklab olish/o‘chirish, mikrofon kirishi rad etilgan holat tekshirildi. Haqiqiy ovoz yozuvi ishlatilmadi.
- Axe WCAG/kontrast — 5 sahifaning 360/1280px, yorug‘/qorong‘i 20 holati, kitob yoqilgan IQning yana 12 holati hamda suhbat rubrikasi natijasi holatida 0 xato. Gorizontal overflow aniqlanmadi. Mobil screenshotlar ko‘rildi.
- Lighthouse accessibility — reja, tayyorgarlik, suhbat, arxitektura va yakuniy o‘chirilgan holatdagi trenajyor sahifalarining har biri 100. Bu avtomatik tekshiruv natijasi. Faol IQ trenajyor holatlari alohida axe bilan tekshirildi.
- Astro check — EYUF diagnostik xatosi yo‘q. Loyihada EYUFdan tashqaridagi avvalgi 4 xato qolgan.

Yakuniy build — 94 sahifa, 2,20 soniya. Buildda avvalgi katta chunk va SAT profil route ogohlantirishlari qoldi. Vaqtinchalik indeks orqali repo tekshiruvi 836 faylda o‘tdi, whitespace va EYUF doirasi tekshirildi.

## Sinalmagan va keyingi ish

Haqiqiy telefon, VoiceOver va turli haqiqiy mikrofon/brauzer kombinatsiyalari sinalmagan. Matn, transkripsiya va alt tavsiflar muallif ko‘rigini kutmoqda. Oldingi esse holatlarini tanlash xabari mavjud, murakkab bir vaqtdagi tahrir ssenariylarining to‘liq auditi hali bajarilmagan. Qolgan ochiq manbalar [gaps.md](gaps.md)da.

Keyingi muallif ko‘rigi ushbu UI qoralamasi, kontentning ochiq joylari va kitob sozlamasini qamrab oladi. Faza 4dagi qolgan soha treklari va natija kursiga o‘tish uchun alohida tasdiq kutiladi.
