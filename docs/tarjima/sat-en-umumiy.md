# SAT matni inglizchaga: 1-PR (umumiy qism)

Branch `sat-en-umumiy`. Muallif tekshiradi. Faqat mavjud matn tarjima qilingan, yangi da'vo yo'q.
Boshqa qavatlar (1, 2, 4, 5) matni o'zgarmagan: o'zbekcha matn `src/data/umumiyMatn.ts` dagi `uz` lug'atiga harfma-harf ko'chirilgan.

## Umumiy qoliplar (faqat SAT sahifalarida inglizcha)

| Joy | Oldin | Keyin |
| --- | --- | --- |
| `<html lang>` (BolimQobiq `bolim="sat"`, SatFokus) | uz | en |
| O'tish havolasi | Asosiy matnga o'tish | Skip to main content |
| Qavat yo'li (nav nomi) | Qayerdaman | You are here |
| Qavat yo'li, Lift, Zina | 3-qavat | Floor 3 |
| Lift (nav nomi) | Qavatlar (lift) | Floors (lift) |
| Lift (tugma nomi oxiri) | , tez orada | , coming soon |
| Zina (nav nomi) | Zina: qo'shni qavatlar | Stairs: neighboring floors |
| Zina | Pastga · 2-qavat / Yuqoriga · 4-qavat | Down · Floor 2 / Up · Floor 4 |
| Zina | qurilmoqda | under construction |
| SatFokus yopish tugmasi | SAT bo'limiga qaytish | Back to the SAT section |

## Yon panel (BolimYon, `bolim="sat"`)

| Oldin | Keyin |
| --- | --- |
| Menyuni ochish | Open menu |
| Menyuni yopish | Close menu |
| Yon panelni yig'ish | Collapse sidebar |
| Yon panelni yoyish | Expand sidebar |
| SAT bo'limi (panel nomi) | SAT section |
| SAT navigatsiyasi | SAT navigation |
| SAT bo'limi haqida | About the SAT section |
| Tashqi havolalar | External links |
| rasmiy sayt | official site |
| (yangi tabda ochiladi) | (opens in a new tab) |
| College Board rasmiy sayt (yangi tabda ochiladi) | College Board official site (opens in a new tab) |
| Qorong'i mavzu | Dark mode |

## Yon panel guruhlari va sahifa nomlari (`satSahifalar.ts`)

| Oldin | Keyin |
| --- | --- |
| Mashq | Practice |
| Math darslari | Math lessons |
| Reading & Writing darslari | Reading & Writing lessons |
| O'qish | Reading (eslatma: R&W bilan adashishi mumkin; muqobil "Books and vocabulary") |
| Qo'llanmalar | Guides |
| Test | Test |
| Savol banki | Question bank |
| Mening natijalarim | My results |
| Reja tuzgich | Study planner |
| Xato daftari: takrorlash | Mistake log: review |
| Hajm laboratoriyasi | Volume lab |
| Funksiya grafigi | Function graphs |
| Birlik aylana | Unit circle |
| Statistika | Statistics |
| Xatoni toping | Find the error |
| Dalilni belgilang | Mark the evidence |
| O'tish so'zlari | Transition words |
| Lug'at kontekstda | Vocabulary in context (rasmiy skill nomi "Words in Context" CB06 da tekshirilmagan, shuning uchun boshqa ibora) |
| Kitoblar | Books |
| Lug'at | Vocabulary |
| Strategiya | Strategy |
| Math va Desmos | Math and Desmos |
| Reading & Writing | Reading & Writing |
| Vaqt va retake | Timing and retakes |
| Bo'lim kirishi / Mashq / Vosita / Qo'llanma (sahifa turi) | Section home / Practice / Tool / Guide |

### Tavsiflar (`tavsif`)

| Sahifa | Oldin | Keyin |
| --- | --- | --- |
| Test | Reading & Writing va Math bo'yicha qisqa mashq testlari. To'liq mock uchun rasmiy materiallarga havola beriladi. | Short practice tests in Reading & Writing and Math. For a full mock test, links to official materials are provided. |
| Savol banki | Mavzu bo'yicha saralangan mashq savollari: Reading & Writing va Math. | Practice questions sorted by topic: Reading & Writing and Math. |
| Mening natijalarim | Mashqlardagi javoblaringiz va xatolaringiz ro'yxati. Ma'lumot faqat shu brauzerda saqlanadi. Ball hisoblanmaydi. | A list of your answers and mistakes in the exercises. Data is saved only in this browser. No score is calculated. |
| Reja tuzgich | Imtihon sanasi va maqsad ballingizdan haftalik tayyorgarlik ro'yxati. Ma'lumot faqat shu brauzerda saqlanadi. Ball kafolatlanmaydi. | A weekly prep list built from your test date and target score. Data is saved only in this browser. No score is guaranteed. |
| Xato daftari: takrorlash | Darslarda xato qilingan mashqlarni oraliq bilan takrorlash: ertaga, keyin 3, 7 va 14 kundan so'ng. Ma'lumot faqat shu brauzerda. Ball hisoblanmaydi. | Review the exercises you got wrong in lessons at intervals: tomorrow, then after 3, 7 and 14 days. Data stays only in this browser. No score is calculated. |
| Hajm | Silindr, konus, shar va prizma hajmi 3D sahnada: o'lchamni o'zgartiring, formulani ko'ring, 6 ta mashq. | The volume of a cylinder, cone, sphere and prism in a 3D scene: change the dimensions, see the formula, 6 exercises. |
| Funksiya grafigi | To'g'ri chiziq, parabolaning uch shakli va ikki tenglama kesishishi: slayder bilan grafikni o'zgartiring, 5 ta mashq. | A straight line, three forms of a parabola and the intersection of two equations: change the graph with sliders, 5 exercises. |
| Birlik aylana | Burchakni sudrab sin, cos va tan qiymatlarini ko'ring, gradus va radianni almashtiring, 5 ta mashq. | Drag the angle to see the sin, cos and tan values, switch between degrees and radians, 5 exercises. |
| Statistika | Nuqtalarni sudrab o'rtacha, mediana va standart og'ish qanday o'zgarishini ko'ring, 5 ta mashq. | Drag the points to see how the mean, median and standard deviation change, 5 exercises. |
| Xatoni toping | Gapdagi xatoli so'z yoki belgini bosing, keyin tuzating: vergul, nuqtali vergul, ikki nuqta, ega va fe'l, zamon. 5 ta mashq. | Tap the word or punctuation mark with the error in a sentence, then fix it: commas, semicolons, colons, subject and verb, tense. 5 exercises. |
| Dalilni belgilang | Qisqa matnda da'voni qo'llab-quvvatlaydigan gapni belgilang va tuzoq gaplarni ajrating. 5 ta mashq. | In a short text, mark the sentence that supports the claim and tell the trap sentences apart. 5 exercises. |
| O'tish so'zlari | Ikki gap orasidagi munosabatni toping (qarama-qarshilik, sabab-natija, misol, davom) va mos o'tish so'zini tanlang. 5 ta mashq. | Find the relationship between two sentences (contrast, cause and effect, example, continuation) and choose the matching transition word. 5 exercises. |
| Lug'at kontekstda | So'z ma'nosini gapdagi kontekst ishorasidan toping: ko'p ma'noli so'zlar, ohang va asosiy ma'no tuzog'i. 5 ta mashq. | Find a word's meaning from the context clue in the sentence: words with several meanings, tone, and the primary-meaning trap. 5 exercises. |
| Kitoblar | Tayyorgarlik uchun o'qish ro'yxati. Faqat bepul yoki ochiq litsenziyali materiallar, havola bilan. | A reading list for your prep. Only free or openly licensed materials, with links. |
| Lug'at | Reading & Writing matnlarida uchraydigan so'zlar uchun kartochkalar. | Flashcards for words that appear in Reading & Writing texts. |
| Strategiya | Tayyorgarlikni qayerdan boshlash va qanday rejalashtirish: muallif tajribasi asosida. | Where to start your prep and how to plan it: based on the author's experience. |
| Math va Desmos | Math bo'limida Desmos kalkulyatori va formulalarni qo'llash usullari. | Ways to use the Desmos calculator and formulas in the Math section. |
| Reading & Writing | Reading & Writing savol turlari bilan ishlash va xatolarni tahlil qilish. | Working with Reading & Writing question types and analyzing mistakes. |
| Vaqt va retake | Imtihon vaqtini taqsimlash va qayta topshirishni rejalashtirish. | Pacing your time in the test and planning a retake. |

### "Tekshirilmagan joylar" (`tekshirilmagan`)

| Oldin | Keyin |
| --- | --- |
| Sahifa mazmuni hali yozilmagan: hozircha faqat sarlavha va reja. | The page content has not been written yet: for now there is only a title and a plan. |
| Mashq savollari hali tuzilmagan; ular boshqa saytlardan ko'chirilmaydi. | The practice questions have not been written yet; they are not copied from other sites. |
| Savollar manbasi va litsenziyasi hali belgilanmagan. | The source and license of the questions have not been decided yet. |
| Haftalik vazifalar Tayanch tavsiyasi, rasmiy reja emas. | The weekly tasks are a Tayanch recommendation, not an official plan. |
| Ball qadami (10) rasmiy sahifada yozilmagan: kiritish maydonida qulaylik uchun olingan. | The score step (10) is not stated on the official page: it is used in the input field for convenience. |
| Takrorlash oraliqlari Tayanch tanlovi, rasmiy tavsiya emas. | The review intervals are a Tayanch choice, not an official recommendation. |
| Mashq savollari Tayanch uchun yozilgan; muallif tekshiruvidan o'tmaganlari "tekshirilmagan" deb belgilangan. | The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified". |
| Matnlar va savollar Tayanch uchun yozilgan; ... | The texts and questions were written for Tayanch; ... |
| Standart og'ish populatsiya formulasi bilan (n ga bo'linadi). | Standard deviation uses the population formula (divided by n). |
| Munosabat jadvali Tayanch tavsiyasi, rasmiy tasnif emas. | The relationship table is a Tayanch recommendation, not an official classification. |
| Ro'yxatdagi har material litsenziyasi alohida tekshiriladi. | The license of each material on the list is checked separately. |
| So'zlar ro'yxati manbasi hali belgilanmagan. | The source of the word list has not been decided yet. |
| Imtihonda Desmos qanday berilishi haqida rasmiy manba hali jurnalga qo'shilmagan. | An official source on how Desmos is provided in the test has not been added to the source log yet. |
| Savol turlari ro'yxati uchun rasmiy manba hali jurnalga qo'shilmagan. | An official source for the list of question types has not been added to the source log yet. |
| Imtihon vaqti va qayta topshirish qoidalari uchun rasmiy manba hali jurnalga qo'shilmagan. | An official source for test timing and retake rules has not been added to the source log yet. |

## SAT kirish sahifasi (`/uz/sat/`)

| Oldin | Keyin |
| --- | --- |
| (description) Digital SAT tayyorgarligi: English (Reading & Writing) va Math. Mustaqil, qimmat kurslarsiz reja. | Digital SAT prep: English (Reading & Writing) and Math. An independent plan, without expensive courses. |
| Qoralama · Bo'lim kirishi | Draft · Section home |
| Digital SAT®, qimmat kurslarsiz. | Digital SAT®, without expensive courses. |
| English (Reading & Writing) va Math bir xil e'tibor bilan. Reja muallifning SAT 1420 natijasiga olib kelgan mustaqil tayyorgarligiga asoslanadi: Desmos va formulalar, vaqtni boshqarish, xatolar tahlili. | English (Reading & Writing) and Math, with equal attention. The plan is based on the independent prep that led the author to an SAT score of 1420: Desmos and formulas, time management, mistake analysis. |
| (telefon) English va Math bir xil e'tibor bilan. Muallifning mustaqil tayyorgarligiga asoslangan reja. | English and Math, with equal attention. A plan based on the author's independent prep. |
| Mashq testini boshlash | Start a practice test |
| Strategiyani o'qish | Read the strategy |
| Imtihon tuzilmasi | Test structure |
| 2 modul, har biri 32 daqiqa · 54 savol | 2 modules, 32 minutes each · 54 questions |
| 2 modul, har biri 35 daqiqa · 44 savol | 2 modules, 35 minutes each · 44 questions |
| Manba: College Board, tekshirilgan 2026-11-04. | Source: College Board, checked 2026-11-04. |
| Qayerdan boshlaysiz? | Where will you start? |
| Uch qadam, istalgan tartibda | Three steps, in any order |
| TUSHUNISH · Strategiya · Tayyorgarlikni qayerdan boshlash va qanday rejalashtirish. · Qo'llanmani ochish | UNDERSTAND · Strategy · Where to start your prep and how to plan it. · Open the guide |
| MASHQ · Test va savol banki · Mavzu bo'yicha qisqa testlar, javobdan keyin darhol izoh. · Mashq qilish | PRACTICE · Tests and question bank · Short tests by topic, with an explanation right after each answer. · Start practicing |
| TAHLIL · Mening natijalarim · Xatolar ro'yxati, faqat shu brauzerda saqlanadi. Ball hisoblanmaydi. · Natijalarni ko'rish | ANALYZE · My results · A list of your mistakes, saved only in this browser. No score is calculated. · See your results |
| Bo'limdagi barcha sahifalar | All pages in this section |
| tez orada | coming soon |
| Aloqa va eslatma (bo'lim nomi) | Contact and note |
| Telegram kanal | Telegram channel |
| Natija kafolatlanmaydi. | Results are not guaranteed. |

## "Tez orada" sahifalari (`[...qism].astro`: Kitoblar, Strategiya, Math va Desmos, Reading & Writing, Vaqt va retake)

| Oldin | Keyin |
| --- | --- |
| Qoralama | Draft |
| Tez orada | Coming soon |
| Bu sahifa hali tayyor emas. Hozircha faqat reja bor. | This page is not ready yet. For now there is only a plan. |
| Til: O'zbekcha | Language: English (sahifa tili endi inglizcha, shuning uchun qiymat ham o'zgardi) |
| Sahifa turi | Page type |
| Bo'lim: SAT | Section: SAT |
| Holat: Qoralama | Status: Draft |
| SAT bo'limiga qaytish | Back to the SAT section |

## Dars qolipi (DarsQolip, faqat SAT darslarida inglizcha; matnlar 2- va 3-PR gacha dars ichidagi o'zbekcha matn bilan aralash turadi)

| Oldin | Keyin |
| --- | --- |
| Animatsiya / Formula / Sinab ko'r (Math qadamlari) | Animation / Formula / Try it |
| Qoralama | Draft |
| Bu darsdan keyin | After this lesson |
| 0 / 5 mashq to'g'ri yechilgan | 0 / 5 exercises solved correctly |
| Laboratoriya (yashirin sarlavha) | Lab |
| Dars qadamlari | Lesson steps |
| Mashqlar | Exercises |
| Tayanch uchun yozilgan namuna savollar, rasmiy SAT savoli emas. Ball hisoblanmaydi. | Sample questions written for Tayanch, not official SAT questions. No score is calculated. |
| Mashqlar ro'yxati | List of exercises |
| 1-mashq | Exercise 1 |
| Namuna | Sample |
| oson / o'rta / qiyin | easy / medium / hard |
| tekshirilmagan | not verified |
| 1. Gapdagi xatoli so'z yoki belgini bosing. | 1. Tap the word or punctuation mark that contains the error. |
| Gap bo'laklari: xatoli bo'lakni belgilang | Sentence parts: mark the part with the error |
| Matn: dalil bo'ladigan gapni bosing | Text: tap the sentence that serves as evidence |
| Matn gaplari: dalil gapni belgilang | Sentences of the text: mark the evidence sentence |
| 2. To'g'ri tuzatishni tanlang. | 2. Choose the correct revision. |
| Yechim. | Solution. |
| Joyni tekshirish | Check the location |
| Tekshirish | Check |
| Qayta yechish | Try again |
| Keyingi mashq | Next exercise |
| Xulosaga o'tish | Go to the summary |
| Xulosa | Summary |
| Xato daftari | Mistake log |
| Shu darsda xato qilingan mashqlar. To'g'ri yechsangiz ro'yxatdan chiqadi. | Exercises you got wrong in this lesson. Solve one correctly and it leaves the list. |
| Hozircha xato yo'q. | No mistakes yet. |
| Hamma darslardagi xatolarni takrorlash | Review mistakes from all lessons |
| Shu dars natijalarini o'chirish | Delete results for this lesson |
| O'chirilsinmi? | Delete them? |
| Ha, o'chirish | Yes, delete |
| Bekor qilish | Cancel |
| Natijalar faqat shu brauzerda saqlanadi. | Results are saved only in this browser. |
| Brauzer saqlashga ruxsat bermadi: natijalar sahifa yopilganda yo'qoladi. | The browser did not allow saving: results will be lost when the page is closed. |
| Shu dars natijalari o'chirildi. | Results for this lesson were deleted. |
| Keyingi dars: … | Next lesson: … |
| , to'g'ri yechilgan / , xato (nuqta tugmasi nomi) | , solved correctly / , wrong |
| Joy to'g'ri topildi. Endi tuzatishni tanlang. | You found the right location. Now choose the revision. |
| Xato bu yerda emas. Xato joyi: «…». Endi tuzatishni tanlang. | The error is not here. The error is at: «…». Now choose the revision. |
| To'g'ri dalil | Correct evidence |
| Siz tanlagan | Your choice |
| To'g'ri. | Correct. |
| Xato. To'g'ri dalil: «…» | Wrong. The correct evidence: «…» |
| Xato joyi topilmadi. Tuzatish to'g'ri: … | You did not find the error's location. The revision is correct: … |
| Xato joyi topilmadi. To'g'ri tuzatish: … | You did not find the error's location. The correct revision: … |
| Xato. To'g'ri javob: … | Wrong. The correct answer: … |
| xato joyi noto'g'ri topildi | the error's location was not found correctly |
| Tipik xato: … | Typical mistake: … |
| Sizning javobingiz: … · sana | Your answer: … · date |
| (Xato daftariga yoziladigan matn) joy: «…»; … | location: «…»; … (eski yozuvlar o'z holicha qoladi) |

## Manbalar bloki (ManbaBlok, faqat SAT sahifalarida inglizcha)

| Oldin | Keyin |
| --- | --- |
| Manbalar va tekshiruv | Sources and review |
| Rasmiy manbalar | Official sources |
| Tekshirilgan sana | Date checked |
| Keyingi tekshiruv | Next review |
| Tekshirilmagan joylar | Not yet verified |
| Yo'q | None |
