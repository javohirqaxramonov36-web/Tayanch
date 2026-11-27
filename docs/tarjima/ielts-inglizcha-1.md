# IELTS inglizchaga, 1-PR: umumiy qism (branch `ielts-inglizcha-1`)

Muallif qarori (2026-11-27): IELTS (4-qavat) SAT kabi to'liq inglizcha; o'zbekcha faqat so'z tarjimalarida ("Uzbek:" yorlig'i, `lang="uz"`).
Seriya: 1 umumiy qism → 2 qo'llanmalar → 3 mashqlar → 4 vositalar → 5 Reading dvigateli. Har PR oldingisining ustida; saytda yarim holat chiqmasligi uchun hammasi birga, tartib bilan merge qilinadi.

Inglizcha matnni muallif tekshiradi.

## Til mexanizmi
- `bolimTili('ielts')` va `yolTili('/uz/ielts/...')` endi `en`. Natijada IELTS sahifalarida `<html lang="en">`, yon panel, ustki qator (Sign in, EN), qavat yo'li, Lift/Zina, `ManbaBlok`, `DarsQolip` qolip matni inglizcha (lug'at `umumiyMatn.ts` da avvaldan bor).
- `IeltsFokus` qolipi: `lang="en"`, "Skip to main content", yo'l "Practice", noscript xabari.
- Kirish oynasi IELTS'da: shartlar havolalari o'zbekcha umumiy sahifalarga, "(in Uzbek)" belgisi va `hreflang="uz"` bilan (inglizcha huquqiy sahifalar faqat SAT'da).
- Qavatlar menyusi: IELTS paneli `lang="en"` (boshqa qavat sahifalarida ham), "All IELTS pages →".

## Matn (oldin → keyin)

### Yon panel va menyu (`src/data/ieltsSahifalar.ts`, `BolimYon`)
| Oldin | Keyin |
| --- | --- |
| Listening / Reading / Writing / Speaking sahifasi | Listening / Reading / Writing / Speaking page |
| Qo'llanma | Guide |
| Dars: … | Lesson: … |
| Listening imlo | Listening spelling |
| Harf va raqam diktanti | Letters and numbers dictation |
| Reading testi | Reading test |
| Reading natijalari | Reading results |
| Xatolarni takrorlash | Review mistakes |
| Task 2 insho mashqi | Task 2 essay practice |
| Gapirish mashqi | Speaking practice |
| Reja va takrorlash | Plan and review |
| 30 kunlik reja | 30-day plan |
| Takrorlash | Review |
| Ball kalkulyatori | Score calculator |
| Writing taymeri | Writing timer |
| Barcha mashqlar | All practice |
| tez orada / Telegram kanal | soon / Telegram channel |
| Taxminan 30 daqiqa / 60 daqiqa (ko'chirish vaqti ichida) / 60 daqiqa / 11–14 daqiqa | About 30 minutes / 60 minutes (including transfer time) / 60 minutes / 11–14 minutes |

Tavsiflar ham inglizcha (masalan "Savol turlari, oldindan o'qish, imlo tuzoqlari" → "Question types, reading ahead, spelling traps").

### Bosh sahifa (`/uz/ielts/`)
| Oldin | Keyin |
| --- | --- |
| IELTS boʻlimi · mustaqil tayyorgarlik | IELTS section · independent prep |
| IELTSʼga oʻzing tayyorlan, reja bilan. | Prepare for IELTS on your own, with a plan. |
| Har boʻlim uchun qoʻllanma, mustaqil mashq va kunma-kun reja. Bepul, roʻyxatdan oʻtmasdan, telefonda ham. | A guide for each section, self-study practice and a day-by-day plan. Free, no sign-up, works on your phone too. |
| Bepul Reading testi / Mashqlar katalogi | Free Reading test / Practice catalogue |
| Imtihon toʻrt boʻlimdan iborat. Boʻlimni tanlang | The test has four sections. Choose one |
| Mening holatim / Keyingi vazifa / Rejani tuzish | My progress / Next task / Build my plan |
| Rasmiy mashq namunalari | Official practice samples |
| IELTS British Council, IDP IELTS va Cambridge … savdo belgisi … Tayanch ular bilan bogʻliq emas … | IELTS is jointly owned by the British Council, IDP IELTS and Cambridge University Press & Assessment and is a registered trademark … Tayanch is not affiliated with them … |
| Natija kafolatlanmaydi. Band taxminiy … | Results are not guaranteed. The band is an estimate … |

### Ko'nikma sahifalari (`IeltsKonikma`)
Qo'llanma / Darslar / Mashq / Natijalar → Guide / Lessons / Practice / Results; "Qoʻllanmadan boshlash" → "Start with the guide", "Toʻgʻridan mashqqa" → "Go straight to practice", "Boshqa koʻnikmalar" → "Other skills".

### Mashqlar katalogi va Reading lug'ati (`mashqKartalar.ts`, `readingMatn.ts`)
`readingMatn.ts` (RM, MM, TAVSIYA, TUR_NOMI) to'liq inglizcha: test ekrani, yakunlash oynasi, natija, tavsiyalar. Masalan "Testni yakunlaysizmi?" → "Finish the test?", "Taxminiy band" → "Estimated band", "Boʻsh joyni toʻldirish" → "Gap fill", band izohidagi rasmiy nuqtalar (IE04) o'zgarmagan.

### Manbalar
IE08 nomi: "IELTS: egalik va savdo belgisi (ielts.org sahifa osti)" → "IELTS: ownership and trademark (ielts.org page footer)".

## Keyingi PR'larda
Qo'llanmalar (listening, reading, tfng, sarlavhalar, writing-task-2, speaking), mashqlar (writing, listening-imlo, listening-raqamlar, tfng), vositalar (reja, takrorlash, kalkulyator, writing-taymer), Reading test/natija sahifalari va `src/lib/ielts/**` xabarlari.
