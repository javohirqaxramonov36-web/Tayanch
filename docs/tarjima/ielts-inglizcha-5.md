# IELTS inglizchaga, 5-PR: Reading dvigateli va testlar (branch `ielts-inglizcha-5`, asos `ielts-inglizcha-4`)

Seriya va qaror: `docs/tarjima/ielts-inglizcha-1.md`. Inglizcha matnni muallif tekshiradi.

## Sahifalar
| Sahifa | Nima tarjima qilindi |
| --- | --- |
| `/uz/ielts/mashq/reading/` | meta tavsif, "testlar tayyorlanmoqda" xabari, manba izohlari (ekran matni `readingMatn.ts` dan, 1-PR'da) |
| `/uz/ielts/mashq/reading/test/` | meta tavsif, noscript xabari |
| `/uz/ielts/mashq/reading/natija/` | sarlavha, meta, noscript, manba izohlari |
| `lib/ielts/reading/ekran/test.ts` | ekran o'quvchi uchun yashirin "Question N." endi `lang="uz"` emas |

## Test JSON'lari (`src/data/ielts/reading-testlar/reading-01..04.json`)
- 156 ta tushuntirish (4 × 39) inglizchaga o'girildi, `explanationLang` "uz" → "en".
- Passage darajalari: "Oson-O'rta" → "Easy–Medium", "O'rta" → "Medium", "O'rta-Qiyin" → "Medium–Hard", "Qiyin" → "Hard".
- Fayl formati o'zgarmagan (faqat shu qatorlar), `npm run validate:tests` o'tdi.
- Ma'no va dalil havolalari (paragraf, variant harflari, tuzoq izohlari) saqlangan; tekshiruv hujjatlari `docs/ielts-reading-0N-tekshiruv.md` o'zbekcha tushuntirishlarga yozilgan edi, inglizcha matnni muallif qayta ko'radi.

Misollar:
| Oldin | Keyin |
| --- | --- |
| A paragrafda karvonsaroy sayohatchilar, ularning hayvonlari va yuklari bitta darvoza ortida tunaydigan devorli joy ekani aytilgan. Bu gapga mos. | Paragraph A says a caravanserai was a walled place where travellers, their animals and their goods spent the night behind a single gate. This matches the statement. |
| D paragraf: jamoa uzoq vaqt ovqat va suvsiz tirik qola oladigan spora (spores) hosil qiluvchi bakteriyalarni tanlagan. | Paragraph D: the team chose bacteria that form spores, which can survive a long time without food or water. |

## Oldingi PR'lardan qolgan uchta qator
- Diktant maydoni `aria-label`: ", £ bilan" → ", in £".
- Matching headings darsi: "{harf} paragraf: sarlavha …" → "Paragraph {harf}: heading …", "Avval B yoki C paragrafni tanlang." → "First choose paragraph B or C."

## Yakuniy tekshiruv (butun IELTS)
Ikki skaner (o'zbekcha marker so'zlar va inglizcha lug'at) `dist/uz/ielts/**` da o'zbekcha matn topmadi (`lang="uz"` so'z tarjimalaridan tashqari). JS bundle'larda o'zbekcha faqat: so'z tarjimalari, ikki tilli umumiy lug'at (`umumiyMatn.ts`) va ekranda ko'rinmaydigan manba izohlari.
