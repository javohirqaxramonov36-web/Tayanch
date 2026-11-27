# IELTS inglizchaga, 3-PR: mashqlar (branch `ielts-inglizcha-3`, asos `ielts-inglizcha-2`)

Seriya va qaror: `docs/tarjima/ielts-inglizcha-1.md`. Inglizcha matnni muallif tekshiradi.

## Sahifalar
| Sahifa | Nima tarjima qilindi |
| --- | --- |
| `/uz/ielts/mashq/tfng/` | kirish matni, to'plam ro'yxati, karta, javob xabarlari, natija |
| `/uz/ielts/mashq/listening-imlo/` | kirish, ovozsiz rejim xabari, tugmalar, tekshiruv xabarlari, natija, manba izohlari |
| `/uz/ielts/mashq/listening-raqamlar/` | xuddi shunday |
| `/uz/ielts/mashq/writing/` | kirish, mavzu tanlash, so'z sanog'i, hisob/kvota xabarlari, natija, tarix (sana `en-GB` formatida), tasdiq oynalari |

## Ma'lumot va kutubxona
- `tfngToplamlar.ts`: to'plam nomi "SAMPLE: a community library", izohlar inglizcha (`izoh_uz` kalit nomi eski, qoldirildi).
- `imloToplamlar.ts`: to'plam nomlari va 26 ta imlo maslahati inglizcha; `tarjima` (so'zning o'zbekcha ma'nosi) qoladi va ekranda "Uzbek:" yorlig'i bilan, `lang="uz"`.
- `raqamToplamlar.ts`: to'plam nomlari, maydon yorliqlari (`kontekst`) va qoidalar inglizcha. Harf talaffuzi o'zbekcha transliteratsiya o'rniga inglizcha o'xshatish bilan: masalan I "ay", E "i" → I sounds like "eye", E like "ee".
- `raqamTekshir.ts`: to'g'ri sana ko'rinishi "(yoki …)" → "(or …)".
- `writing/baho.ts`: mezon izohlari (Answering the question, Organisation and linking, Vocabulary, Grammar), so'z sanog'i izohlari va server xato xabarlari inglizcha; testlar (`baho.test.ts`) yangi matnga moslandi.
- `writing/api.ts`: dev mock namunalaridagi "Namuna:" → "Sample:".

## Asosiy misollar (oldin → keyin)
| Oldin | Keyin |
| --- | --- |
| Kartani oʻngga suring: TRUE, chapga: FALSE, pastga: NOT GIVEN | Swipe the card right for TRUE, left for FALSE and down for NOT GIVEN |
| Brauzeringizda inglizcha ovoz topilmadi … oʻzbekcha maʼnosi koʻrsatiladi. | No English voice was found in your browser, so the Uzbek meaning of each word is shown instead. |
| Ma'nosi: chorshanba | Uzbek: chorshanba |
| Oʻrtadagi d eshitilmaydi: Wed-nes-day. | The d in the middle is silent: Wed-nes-day. |
| "oh" nolni bildiradi. | "oh" means zero. |
| Bugungi 2 ta bepul tekshiruv tugadi. Ertaga (Toshkent vaqti bilan yarim tundan keyin) … | You have used today's 2 free assessments. You can get more tomorrow (after midnight, Tashkent time). |
| Taxminiy baho. Uni AI qoʻyadi, bu rasmiy IELTS natijasi emas. Izohlar inglizcha. | Estimated score. It is given by AI and is not an official IELTS result. |

Maxfiylik havolasi o'zbekcha sahifaga "(in Uzbek)" belgisi bilan.
