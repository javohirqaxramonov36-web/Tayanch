# Foydalanuvchi sinovi (2026-11-21)

Jonli sayt (tayanchedu.uz) foydalanuvchi ko'zi bilan: 800px desktop va 375px telefon, qorong'i va yorug' mavzu, hisob bilan kirgan holatda. 147 ichki sahifa avtomatik aylanib chiqildi.

## Tuzatilgan (PR ux-foydalanuvchi)
| # | Muammo | Ta'siri | Tuzatish |
| --- | --- | --- | --- |
| 1 | Bo'lim sahifalarida logo bo'lim ildiziga olib boradi, ustki menyu va panelda bosh sahifa havolasi yo'q | Foydalanuvchi bo'limdan chiqib Navigator'ga qayta olmaydi | Logo `/uz/` ga |
| 2 | Yon panel (telefon, ≤ 1000px) yarim shaffof: orqadagi matn panel ustida o'qiladi | Menyu o'qilishi qiyin | Panel zich sirtda (ichma-ich blur ishlamaydi) |
| 3 | EYUF bosh sahifa kartasi va mega menyuda "Tez orada", lekin bo'limda 10 sahifa ishlaydi | Foydalanuvchi bo'limni yopiq deb o'ylaydi | `holat: 'ochiq'`, menyuda sahifalar |
| 4 | EYUF kirishida faqat IQ test ko'rinadi; mock, suhbat, trenajyor yashirin | Imkoniyatlar topilmaydi | Hamma guruh kartalari |
| 5 | EYUF: ichki havolada ↗ (tashqi sayt belgisi), "— qoralama" yozuvi | Chalg'itadi, ishonchni pasaytiradi | → va yozuv olib tashlandi |
| 6 | Bosh sahifa kartalari eskirgan (Top Admission: grantlar, davlatlar, kurs yo'q) | Qiymat ko'rinmaydi | Ro'yxat yangilandi |
| 7 | IELTS: "Yana 0 ta qo'llanma tez orada" | Xato kabi ko'rinadi | 0 bo'lsa chiqmaydi |
| 8 | Top Admission "Yaqin muddatlar" da tugagan EYUF muddati birinchi | Eng yaqin muddat pastda qoladi | Tugaganlar oxirga |

## Ochiq (muallif qarori yoki alohida ish)
- A1 kursida A2–A5 havolalari 404 (`/uz/sat/kurs/matematika/algebra/a2/` ...). Kurs alohida chiqariladi.
- Bosh sahifa: "Ro'yxatsiz va to'lovsiz" degan va'da SAT'dagi Pro/Max tariflari bilan zid ko'rinadi (matn muallifda).
- "Beta — in development" o'zbekcha bo'limlarda inglizcha (muallif qarori bilan TA'da olib tashlangan; qolganlari ochiq).
- Nomlash: menyuda "EYUF" / "EYUF prep", sahifada "El-Yurt Umidi".
- SAT kirishida yuklangandan keyin "Set your SAT goal" bandi tepada paydo bo'lib, kontentni pastga suradi (layout shift).
- "Vaqt mintaqasi rasmiy manbada ko'rsatilmagan" izohi bosh sahifa muddat kartasida shovqin.

Sinalmagan: VoiceOver, haqiqiy telefon, hisobsiz (kirmagan) holatdagi oqimlar.
