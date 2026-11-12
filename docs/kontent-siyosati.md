# Kontent siyosati (College Board va test materiallari)

Holat: 2026-11-08. Bu hujjat yuridik maslahat emas. "Tekshirish kerak" deb belgilangan joylar yurist yoki rasmiy javob bilan tasdiqlanmagan.

Tayanch repo'si ochiq va `main` ga push bo'lganda sayt joylanadi. Shuning uchun quyidagi qoidalar repo, baza (Supabase), AI promptlari va ekran uchun bir xil.

## 1. Rasmiy manbalar nima deydi

| ID | Manba | Nima yozilgan | Tekshirilgan |
| --- | --- | --- | --- |
| CB10 | [Copyright and Trademark Permission Request Instructions](https://privacy.collegeboard.org/request-form/instructions) | SAT test materiallari hozircha tijorat litsenziyasiga berilmaydi. Rasmiy SAT test materiallarini test tayyorlash (test-prep) va boshqa tijorat sharoitida ko'paytirish mumkin emas. "Commercial" ta'rifiga test-prep sharoiti kiradi. | 2026-11-08 |
| CB11 | [Legal Terms for Students (site terms)](https://privacy.collegeboard.org/site-terms) | College Board xizmatlari faqat notijorat foydalanish uchun; ularni pul ishlash yoki test-prep biznesi qismi sifatida ishlatib bo'lmaydi (10-bo'lim). Kontentni yozma ruxsatsiz tarqatish, ko'paytirish, qayta joylash, scrape yoki data-mine qilish mumkin emas (8-bo'lim). | 2026-11-08 |

Ikkala sahifada oxirgi yangilanish sanasi ko'rsatilmagan. Manba yozuvlari `src/data/manbalar.ts` da (izohda nima so'zma-so'z tekshirilgani yozilgan).

Tayanch SAT bo'limida to'lov (Pro, Max) rejalashtirilgan, ya'ni bu tijorat test-prep sharoiti. Yuqoridagi cheklovlar shu sharoitga to'g'ridan-to'g'ri tegishli deb qabul qilinadi (tekshirish kerak: yuridik baho berilmagan).

## 2. Ruxsat etilgani

- Tayanch'ning **original savollari**: AI qoralama yozadi, muallif tekshirib tasdiqlaydi (`verified_by`).
- College Board rasmiy resurslariga **havola** (Bluebook, Question Bank, Khan Academy va h.k.), logo va materialni ko'chirmasdan; savdo belgisi qoidalari: CB08, CB09.
- Foydalanuvchining **o'zi kiritgan** ma'lumoti: rasmiy practice test natijasi (ball), xato qilgan savol raqami yoki mavzusi, o'z izohi.
- Rasmiy faktlar (qoida, muddat, format) manba va sana bilan, o'z so'zlarimiz bilan.

## 3. Ruxsat etilmagani

- College Board savoli, passage'i, javob variantlari, tushuntirish matni, rasm va jadvallari, scoring jadvallari:
  - repoda (har qanday fayl, shu jumladan test va namuna ma'lumoti);
  - bazada (Supabase);
  - AI promptlarida (savol yaratish, tushuntirish yoki tekshirish uchun "namuna" sifatida ham);
  - ekranda (iqtibos, skrinshot, embed).
- Ularni "o'zgartirib" qayta yozish: raqam, ism yoki so'zlarni almashtirib, tuzilmani saqlab qolish. Original savol rasmiy savoldan ko'chirilmaydi va unga qarab yozilmaydi.
- Question Bank yoki Bluebook'dan ma'lumotni avtomatik yig'ish (scrape).

## 4. Muallifning lokal fayllari

Muallif kompyuterida College Board'dan yuklangan fayllar (practice test PDF, scoring PDF, Question Bank JSON) va kurs materiallari bor. Ular **faqat shaxsiy o'rganish uchun**: repoga, bazaga, promptga va saytga tushmaydi.

- `.gitignore` ularni chetlab o'tadi; `npm run repo:tekshir` (va deploy workflow'da build'dan oldin) ular yoki maxfiy kalit kuzatilayotgan fayllarda bo'lsa xato beradi.
- Tavsiya: ularni repo papkasidan tashqariga ko'chirish. Yo'riqnoma: `docs/lokal-ish-tartibi.md`.
- `SAT-kurs materillari/` mazmuni noma'lum (uchinchi tomon kursi bo'lishi mumkin). U ham faqat shaxsiy va xuddi shu qoidalar ostida; litsenziyasi tekshirish kerak.

## 5. Ochiq: Question Bank shartlari

SAT Suite Question Bank'ning o'z foydalanish shartlari **hali o'qilmagan** (tekshirish kerak). O'qilguncha Question Bank faqat havola sifatida tilga olinadi, undan hech narsa olinmaydi. O'qilgach, manba `manbalar.ts` ga qo'shiladi va shu bo'lim yangilanadi.

## 6. "Prediction", sizdirilgan va esda qolgan test materiallari

"Prediction" deb atalgan, sizdirilgan (leaked) yoki haqiqiy imtihondan esda qolgan savollar va passage'lar ham taqiqlanadi: bu test xavfsizligi va mualliflik huquqi masalasi. Ular saytga qo'yilmaydi, havola berilmaydi va targ'ib qilinmaydi. Imtihon xavfsizligi bo'yicha College Board qoidalariga aniq manba bilan havola qilish uchun alohida tekshirish kerak (hali manba qo'shilmagan).

## Agar taqiqlangan fayl tarixga tushib qolsa

`repo:tekshir` faqat hozir kuzatilayotgan fayllarni ko'radi. Tarix bo'yicha tekshiruv (2026-11-08, `git log --all`): taqiqlangan yo'l, naqsh va kalit qiymati topilmagan. Keyinchalik topilsa, hech narsa avtomatik o'chirilmaydi: Claude `git filter-repo` (yoki BFG) qadamlarini yozadi, muallif tasdiqlaydi, so'ng force push va kalit almashtirish (rotate) qilinadi.
