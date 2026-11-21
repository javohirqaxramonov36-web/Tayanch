# EYUF Faza 4 tekshiruv hisoboti

2026-11-21. Branch `codex/eyuf-manbalar-faza0`. Lokal UI va kontent qoralamasi.

## Qo‘shilgan qismlar

- `/uz/eyuf/soha/` katalogi 20 trekni daraja, ochiq kvota va qidiruv bo‘yicha ko‘rsatadi. Bakalavr uchun 15, magistr uchun 20 trek mavjud. Tartib joriy ochiq kvotaga asoslanadi.
- Arxitektura URLi saqlanib, yana 19 trek sahifasi umumiy `SohaSahifa` komponentiga ulandi. Daraja havola orqali uzatiladi. Bakalavr uchun 8, magistr uchun 9 dars ko‘rinadi.
- S04 rasmiy PDFining 13 betidan 570 raqamlangan mutaxassislik olindi. Har yozuvda asl kirillcha matn, dastlabki lotin transkripsiyasi va bet/qator manbasi mavjud. Barchasining `verified` qiymati false. Lotin yozuvi muallif ko‘rigini kutmoqda.
- 180 soha darsiga dalil yig‘ish, muammo tahlili, tashkilot va qaytish rejasini ishlab chiqish uchun matnli ish varaqlari qo‘shildi. Fakt kutilayotgan outline bloklari saqlangan. Sohalarning to‘liq faktologik kursi hali manbalar bilan to‘ldirilmagan.
- `/uz/eyuf/natija/` kursida natija va apellatsiya, kafillik/shartnoma, stipendiat majburiyatlari, bekor qilish xavflari va B reja bo‘yicha 5 matnli dars mavjud. Huquqiy bloklar S01 lokatorlariga, metodik bloklar T01ga bog‘langan. Darslar qoralama, `verified` false.
- Mutaxassisliklar qidiruvi lotin va asl kirill yozuvini qamraydi. Barcha sahifalar mavjud EYUF progress va ish varag‘i mexanizmini ishlatadi.

## Tekshiruv natijalari

| Tekshiruv | Natija |
| --- | --- |
| JSON va bog‘lanish validatori | 10 sxema o‘tdi, 252 dars, 20 trek, 570 noyob mutaxassislik |
| EYUF unit testlari | 19/19 o‘tdi |
| Yakuniy Astro build | 115 sahifa, 1,25 soniya |
| Faza 4 axe WCAG va kontrast | 22 sahifa × 360/1280px × yorug‘/qorong‘i, 88 holatda 0 xato |
| Faza 3 regressiyasi | 5 sahifaning 20 holati, funksional oqimlar, 0 axe va JS xatosi |
| Lighthouse accessibility | Katalog, natija, huquq, muhandislik sahifalarida 100 |
| Repo tekshiruvi | Vaqtinchalik indeksdagi 844 faylda muammo yo‘q |
| Whitespace tekshiruvi | O‘tdi |
| Astro check | EYUF xatosi yo‘q, boshqa bo‘limlardagi avvalgi 4 xato qolgan |

Brauzerda katalogning daraja filtri, kirillcha qidiruv, magistr darajasining trekka uzatilishi, mutaxassislik ichki qidiruvi, natija kursi progressining reload orqali tiklanishi va B reja havolasi tekshirildi. Barcha 22 yo‘l HTTP 200 berdi, gorizontal overflow va JS xatosi topilmadi. Mobil screenshotlar ko‘rildi.

## Ochiq qismlar

Soha muammolari, islohotlar, qonunchilik, prezident iqtiboslari, talab va tashkilotlar uchun tasdiqlangan fakt bloklari kutilmoqda. Mutaxassislik transkripsiyasi avtomatik dastlabki nusxa. Hududlar, yangiliklar, to‘liq IQ banki va 2026-2 suhbat rubrikasi bo‘yicha oldingi manba bo‘shliqlari ham ochiq. Batafsil `gaps.md` va Faza 3 hisoboti bilan birga o‘qiladi.

`book_content_enabled` false. Yakuniy lokal buildda yangi trenajyor va avvalgi IQ sahifasining kitob mashqi shu sozlamaga bo‘ysunadi. Haqiqiy telefon, VoiceOver va haqiqiy mikrofon bilan sinov bajarilmagan.

Nashr holati qoralama. Commit, PR, merge va deploy bajarilmagan. Keyingi ko‘rik kontent, transkripsiya va kitob sozlamasini qamrab oladi.
