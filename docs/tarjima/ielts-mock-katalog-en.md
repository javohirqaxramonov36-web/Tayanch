# #224 mock katalog inglizchaga (branch `ielts-mock-katalog-en`, asos `codex/ielts-mock-katalog` + `origin/main`)

Codex branch'i va uning worktree'idagi commit qilinmagan ish o'zgarmagan. Bu branch #224 ning uchta commit'ini joriy `main` bilan birlashtiradi va matnni IELTS qoidasiga (2026-11-27, to'liq inglizcha) moslaydi. #224 o'rniga merge qilinadi.

## Konfliktlar
- `/uz/ielts/mashq/reading/`: #224 ning soddalashtirilgan sahifasi (mock tanlash, Boshlash) olindi, matn inglizcha, tugma DS sinfi (`t-tugma ielts-tugma--urgu`), yo'l `Reading` + ota sahifa.
- `ekran/natija.ts`: #224 dagi dalilsiz (yuklangan mock) holat saqlandi, tugma DS sinfi.
- Test JSON'lari: #224 ning `drafted_by`/`reviewed` maydonlari va `main` dagi inglizcha tushuntirishlar avtomatik birlashdi; `validate:tests` o'tdi.

## Matn (oldin → keyin)
| Oldin | Keyin |
| --- | --- |
| IELTS Reading mashqi. Mockni tanlang va testni boshlang. | IELTS Reading practice. Choose a mock and start the test. |
| 60 daqiqa · 40 savol · 3 matn | 60 minutes · 40 questions · 3 passages |
| Mock tanlang / Boshlash | Choose a mock / Start |
| Mocklar tayyorlanmoqda. | Mocks are being prepared. |
| Oxirgi natijalar | Recent results |
| Manbalar va izohlar / IELTS formatidagi mashq testlari. | Sources and notes / Practice tests in the IELTS format. |
| Yuklangan mocklarda manba javob kaliti ishlatiladi. | Uploaded mocks use the answer key from their source. |
| Matndagi dalil hali tekshirilmagan. | The evidence in the passage has not been checked yet. (`RM.dalilYoq`) |
| Tanlangan mock topilmadi. Katalogdan boshqa test tanlang. | The selected mock wasn't found. Choose another test from the catalogue. (`RM.mockYoq`) |

Yuklangan mocklar repoda emas (tashqi papka, #224 dagidek); ularni ishlatish huquqi va kontent tekshiruvi muallifda.
