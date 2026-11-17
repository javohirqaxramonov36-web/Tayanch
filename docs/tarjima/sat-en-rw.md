# SAT matni inglizchaga: 3-PR (Reading & Writing darslari)

Branch `sat-en-rw`. Muallif tekshiradi. Faqat mavjud matn tarjima qilingan, yangi da'vo, fakt yoki raqam yo'q. Inglizcha savol matnlari va variantlar, `togri`, `togriBolak`, id va `verified: false` o'zgarmagan (skript bilan tekshirilgan, pastda).

## Yozuv qoidalari

- Atamalar: Reading & Writing darslari → Reading & Writing lessons, darsi → lesson; Misol / Qoida / Sinab ko'r (qadamlar) → Example / Rule / Try it; Namuna → Sample; Vazifa → Task; Qayta urinish → Try again; Keyingi misol → Next example; O'zim topaman → I'll find it myself; Hali belgilanmagan → Nothing marked yet; Hali tanlanmagan → Nothing chosen yet.
- Dars nomlari yon paneldagidek (`satSahifalar.ts`, 1-PR): Find the error, Mark the evidence, Transition words, Vocabulary in context. "Transitions" va "Words in Context" rasmiy nom sifatida ishlatilmagan (CB06 da tekshirilmagan; bu gap sahifalardagi `tekshirilmagan` ro'yxatida qolgan).
- Grammatika: vergul → comma, nuqtali vergul → semicolon, ikki nuqta → colon, mustaqil gap → independent clause, tobe qism → dependent part, ega va fe'l → subject and verb (mashq mavzusida subject-verb agreement), zamon → tense, to'ldiruvchi → object, majhul/aniq nisbat → passive/active voice.
- Dalil: da'vo → claim, dalil → evidence, omil → factor, kontekst / usul / takror → context / method / restatement, mavzuga yaqin → close to the topic, teskari fikr → opposing view.
- O'tish so'zlari: qarama-qarshilik → contrast, sabab-natija → cause and effect, misol → example, davom → addition. `rw-tekshiruv.ts` dagi ichki kodlar (`zid`, `sabab`, `misol`, `davom`) o'zgarmagan.
- Lug'at: kontekst ishorasi → context clue, asosiy ma'no tuzog'i → primary meaning trap, ohang → tone. Lug'at kartalari tugmalari uchun "I know it" / "Still learning" ishlatildi (lug'at sahifasi 4-PR da tarjima qilinadi: o'sha yerdagi yorliqlar shunga mos bo'lishi kerak).
- `lang`: sahifa endi `<html lang="en">`, shuning uchun sahifadagi qo'lda qo'yilgan `lang="en"` lar va `savolTili="en"` olib tashlandi; dalil sahifasidagi `gap-yorliq` dan `lang="uz"` olib tashlandi. Bitta istisno: lug'at sahifasidagi "Put in a word of your own. It can even be in Uzbek" qadamida o'zbekcha misol so'zlar ("xavfli", "hal qilmoq") o'zbekcha qoldi va `<span lang="uz">` bilan o'ralgan (muallif qarori kerak bo'lsa, ko'rib chiqing).
- O'tish so'zlari "Method" izohidagi o'zbekcha bog'lovchilar ("lekin", "shuning uchun", "masalan", "yana") inglizchaga o'girildi ("but", "so", "for example", "also").

## Savollar (`src/data/satDarslar/rw-*.ts`)

Avtomatik jadval (eski va yangi fayl maydonma-maydon solishtirilgan). Skript natijasi: 20 savol; `id`, `modul`, `qiyinlik`, `togri`, `verified`, `belgilash` (bo'laklar va `togriBolak`) va variant matnlarida farq 0.

### rw-xatoni-toping.ts

| id | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| rw-xato-1 | mavzu | Vergul: ikki mustaqil gap | Comma: two independent clauses |
| rw-xato-1 | xato A | "however" bilan vergul: bog'lovchi ravish ikki mustaqil gapni vergul bilan ulay olmaydi (comma splice) | A comma with "however": a conjunctive adverb cannot join two independent clauses with a comma (comma splice) |
| rw-xato-1 | xato C | Belgisiz qo'shilgan gap (run-on): ikki mustaqil gap orasida hech qanday belgi yo'q | Run-on sentence: there is no punctuation at all between the two independent clauses |
| rw-xato-1 | xato D | Vergul bilan qo'shilgan gap (comma splice): ikki mustaqil gap faqat vergul bilan ulangan | Comma splice: the two independent clauses are joined by a comma alone |
| rw-xato-1 | yechim | "The library extended its weekend hours" va "students can now study there until midnight": ikkalasida ham ega va kesim bor, ya'ni ikkalasi mustaqil gap. Ikki mustaqil gap faqat vergul bilan ulanmaydi; nuqtali vergul ularni to'g'ri bog'laydi. | "The library extended its weekend hours" and "students can now study there until midnight": each has a subject and a verb, so both are independent clauses. Two independent clauses cannot be joined by a comma alone; a semicolon joins them correctly. |
| rw-xato-2 | mavzu | Nuqtali vergul | Semicolon |
| rw-xato-2 | xato A | Ikki nuqta to'liq bo'lmagan gapdan keyin: "Because …" qismi mustaqil gap emas | A colon after an incomplete sentence: the "Because …" part is not an independent clause |
| rw-xato-2 | xato B | Tobe qism alohida gap qilib ajratilgan (fragment): "Because the bridge was closed for repairs." to'liq gap emas | The dependent part is split off as a separate sentence (fragment): "Because the bridge was closed for repairs." is not a complete sentence |
| rw-xato-2 | xato D | Nuqtali vergul tobe qismdan keyin: nuqtali vergulning ikki tomonida mustaqil gap bo'lishi kerak | A semicolon after a dependent part: a semicolon needs an independent clause on both sides |
| rw-xato-2 | yechim | "Because" bilan boshlangan qism tobe (o'zi to'liq gap emas). Tobe qism gap boshida kelsa, asosiy gapdan vergul bilan ajratiladi. Nuqtali vergul esa faqat ikki mustaqil gap orasida turadi. | The part that begins with "Because" is dependent (it is not a complete sentence on its own). When a dependent part comes at the start of a sentence, a comma separates it from the main clause. A semicolon goes only between two independent clauses. |
| rw-xato-3 | mavzu | Ikki nuqta | Colon |
| rw-xato-3 | xato A | Ikki nuqta to'liq bo'lmagan gapdan keyin: "requires" fe'li to'ldiruvchisidan ajratilgan | A colon after an incomplete sentence: the verb "requires" is separated from its object |
| rw-xato-3 | xato B | Nuqtali vergul ro'yxat oldidan: keyingi qism mustaqil gap emas | A semicolon before a list: the part that follows is not an independent clause |
| rw-xato-3 | xato C | Fe'l va to'ldiruvchi orasida ortiqcha vergul | An unnecessary comma between a verb and its object |
| rw-xato-3 | yechim | Ikki nuqtadan oldin to'liq gap turishi kerak. "The recipe requires" to'liq emas: "requires" fe'li to'ldiruvchini (flour, butter, and two eggs) kutadi. Fe'l va uning to'ldiruvchisi orasiga hech qanday belgi qo'yilmaydi. | A colon must come after a complete sentence. "The recipe requires" is not complete: the verb "requires" needs its object (flour, butter, and two eggs). No punctuation goes between a verb and its object. |
| rw-xato-4 | mavzu | Ega va fe'l moslashuvi | Subject-verb agreement |
| rw-xato-4 | xato B | Tuslangan fe'l o'rniga -ing shakli: gapda asosiy fe'l qolmaydi (fragment) | An -ing form instead of a finite verb: the sentence is left without a main verb (fragment) |
| rw-xato-4 | xato C | Ega va fe'l mos emas: fe'l yaqindagi "letters" ga moslashtirilgan, ega esa "collection" (birlik) | The subject and verb do not agree: the verb agrees with the nearby "letters", but the subject is "collection" (singular) |
| rw-xato-4 | xato D | Nisbat noto'g'ri: "by a local family" majhul nisbatni talab qiladi, "was donating" aniq nisbat | Wrong voice: "by a local family" calls for the passive voice, but "was donating" is active |
| rw-xato-4 | yechim | Ega "collection" (birlik); "of old letters" faqat uni aniqlaydi. Shuning uchun fe'l birlikda: "was". "by a local family" ishni kim qilganini aytadi, demak majhul nisbat kerak: "was donated". | The subject is "collection" (singular); "of old letters" only describes it. So the verb is singular: "was". "by a local family" tells who did the action, so the passive voice is needed: "was donated". |
| rw-xato-5 | mavzu | Zamon | Verb tense |
| rw-xato-5 | xato A | Present Perfect aniq o'tgan vaqt bilan: "Last winter" bilan Present Perfect ishlatilmaydi | Present Perfect with a specific past time: Present Perfect is not used with "Last winter" |
| rw-xato-5 | xato B | Kelasi zamon: "Last winter" o'tgan vaqtni bildiradi | Future tense: "Last winter" refers to past time |
| rw-xato-5 | xato D | Hozirgi zamon o'tgan voqea uchun: "Last winter" o'tgan zamonni talab qiladi | Present tense for a past event: "Last winter" calls for the past tense |
| rw-xato-5 | yechim | "Last winter" o'tib ketgan, aniq vaqt. Aniq o'tgan vaqtdagi tugagan ish Past Simple bilan aytiladi: "planted". Gapning ikkinchi qismidagi "still enjoy" esa hozirgi holat, u hozirgi zamonda qoladi. | "Last winter" is a specific time that is already over. A finished action at a specific past time is expressed with the Past Simple: "planted". "still enjoy" in the second part of the sentence is a present situation, so it stays in the present tense. |

### rw-dalil.ts

| id | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| rw-dalil-1 | mavzu | Fan: tajriba natijasi | Science: an experiment result |
| rw-dalil-1 | matn | Sinf o'quvchilari o'simliklar o'sishidagi farqni suv emas, yorug'lik keltirib chiqargan, degan xulosaga keldi. Qaysi gap suv sabab bo'lmaganini ko'rsatadi? | The students in the class concluded that light, not water, caused the difference in how the plants grew. Which sentence shows that water was not the cause? |
| rw-dalil-1 | xato A | Tajriba sharoiti: guruhlar qayerda turganini aytadi, suvni istisno qilmaydi | Experimental setup: it tells where the groups were placed but does not rule out water |
| rw-dalil-1 | xato C | Natija: farq borligini ko'rsatadi, lekin suv sabab emasligini isbotlamaydi | Result: it shows that there was a difference but does not prove that water was not the cause |
| rw-dalil-1 | xato D | Mavzuga yaqin, lekin da'voga aloqasi yo'q | Close to the topic, but unrelated to the claim |
| rw-dalil-1 | yechim | Da'vo ikki qismdan iborat: farqni yorug'lik keltirib chiqargan va suv sabab emas. Ikkala guruh bir xil suv olgan bo'lsa, suv farqni tushuntira olmaydi. Faqat 2-gap suvni istisno qiladi. | The claim has two parts: light caused the difference, and water was not the cause. If both groups received the same amount of water, water cannot explain the difference. Only sentence 2 rules out water. |
| rw-dalil-2 | mavzu | Ijtimoiy fanlar: kuzatuv | Social science: an observation |
| rw-dalil-2 | matn | Kutubxona xodimlari kechki soatlar ayniqsa kunduzi ishlaydigan kattalarga foyda berdi, deb hisoblaydi. Qaysi gap bu fikrni eng to'g'ridan-to'g'ri qo'llab-quvvatlaydi? | The library staff believe that the evening hours especially benefited adults who work during the day. Which sentence most directly supports this idea? |
| rw-dalil-2 | xato A | Kontekst: kuzatuv qanday yig'ilganini aytadi, natijani emas | Context: it tells how the observations were collected, not what they showed |
| rw-dalil-2 | xato B | Boshqa guruh haqida: talabalar odati kattalar foyda ko'rganini ko'rsatmaydi | About another group: the students' habits do not show that adults benefited |
| rw-dalil-2 | xato C | Mavzuga yaqin, lekin da'voga aloqasi yo'q | Close to the topic, but unrelated to the claim |
| rw-dalil-2 | yechim | Da'vo kechki soatlardan kim foyda ko'rgani haqida. Kechki tashrif buyuruvchilarning ko'pi ishdan to'g'ri kelgan kattalar bo'lgani aynan shuni ko'rsatadi. | The claim is about who benefited from the evening hours. That most of the late visitors were adults who came straight from work shows exactly this. |
| rw-dalil-3 | mavzu | Adabiyot: xarakter | Literature: character |
| rw-dalil-3 | matn | Matn soatsozni o'z ishidan ko'ra boshqalarga yordam berishni ustun qo'yadigan inson sifatida tasvirlaydi. Qaysi gap buni eng yaxshi qo'llab-quvvatlaydi? | The text portrays the clockmaker as a person who puts helping others ahead of his own work. Which sentence best supports this? |
| rw-dalil-3 | xato A | Odatni ko'rsatadi, boshqalarga munosabatni emas | It shows a habit, not his attitude toward others |
| rw-dalil-3 | xato B | Voqeani boshlaydi, xarakterni ko'rsatmaydi | It starts the story but does not show character |
| rw-dalil-3 | xato D | Sahna tavsifi, xarakter haqida emas | A description of the scene, not of the character |
| rw-dalil-3 | yechim | Da'voda ikki narsa bor: o'z ishi va boshqalarga yordam. 3-gapda soatsoz o'z ishini chetga qo'yadi, bolaga yordam beradi va haq olmaydi, ya'ni ikkalasi ham bor. | The claim has two parts: his own work and helping others. In sentence 3, the clockmaker sets his own work aside, helps the boy and takes no payment, so both parts are there. |
| rw-dalil-4 | mavzu | Madaniyat: qo'l mehnati | Culture: handicraft |
| rw-dalil-4 | matn | Oila qo'lda qilingan qog'oz uzoq yillar buzilmay saqlanadi, deb hisoblaydi. Qaysi gap shu da'voni eng yaxshi qo'llab-quvvatlaydi? | The family believes that handmade paper lasts for many years without falling apart. Which sentence best supports this claim? |
| rw-dalil-4 | xato A | Kontekst: ustaxona haqida, chidamlilik haqida emas | Context: it is about the workshop, not about durability |
| rw-dalil-4 | xato C | Asossiz sabab-oqibat: ishning sekinligi qog'oz uzoq saqlanishini isbotlamaydi | Unsupported cause and effect: slow work does not prove that the paper lasts a long time |
| rw-dalil-4 | xato D | Tashqi ko'rinish haqida, chidamlilik haqida emas | It is about appearance, not about durability |
| rw-dalil-4 | yechim | Da'vo vaqt o'tishi bilan qog'oz buzilmasligi haqida. Uzoq vaqt oldin qilingan daftar sahifalari hali ham butun ekani shuni bevosita ko'rsatadi. | The claim is that the paper does not fall apart over time. The pages of a notebook made long ago are still intact, and this shows it directly. |
| rw-dalil-5 | mavzu | Fan: xulosa va dalil | Science: conclusion and evidence |
| rw-dalil-5 | matn | Talaba kaptarlar uyga yo'lni faqat tanish binolarni ko'rib topmaydi, degan xulosaga keldi. Qaysi gap bu xulosani eng yaxshi qo'llab-quvvatlaydi? | A student concluded that pigeons do not find their way home only by seeing familiar buildings. Which sentence best supports this conclusion? |
| rw-dalil-5 | xato A | Rad etilayotgan qarash (teskari fikr), dalil emas | The view being rejected (the opposing view), not evidence |
| rw-dalil-5 | xato B | Tajriba usuli: natijani aytmaydi | Experimental method: it does not state the result |
| rw-dalil-5 | xato D | Da'voning o'zi: xulosani takrorlaydi, dalil emas | The claim itself: it repeats the conclusion and is not evidence |
| rw-dalil-5 | yechim | Dalil kuzatilgan natija bo'lishi kerak. Qushlar tanish belgilar yo'q joydan ham qaytgani xulosani qo'llab-quvvatlaydi. 4-gap esa xulosaning o'zi, uni dalil deb bo'lmaydi. | Evidence must be an observed result. The birds returned even from a place with no familiar landmarks, and this supports the conclusion. Sentence 4 is the conclusion itself, so it cannot count as evidence. |

### rw-otish.ts

| id | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| rw-otish-1 | mavzu | Qarama-qarshilik: keng tarqalgan fikr va fakt | Contrast: a common belief and a fact |
| rw-otish-1 | xato A | Misol so'zi: 2-gap 1-gapdagi umumiy fikrning aniq misoli emas | An example word: sentence 2 is not a specific example of the general idea in sentence 1 |
| rw-otish-1 | xato C | Sabab-natija so'zi: 2-gap 1-gapdan kelib chiqqan natija emas | A cause-and-effect word: sentence 2 is not a result of sentence 1 |
| rw-otish-1 | xato D | Davom so'zi: 2-gap yangi, bir yo'nalishdagi fikr qo'shmaydi | An addition word: sentence 2 does not add a new idea in the same direction |
| rw-otish-1 | yechim | 1-gap ko'pchilikning taxmini (suv deyarli kerak emas), 2-gap unga qarshi fakt (muntazam sug'orilsa yaxshi o'sadi). Munosabat: qarama-qarshilik, demak "However,". | Sentence 1 is what many people assume (cacti need almost no water); sentence 2 is a fact that goes against it (they grow better when watered regularly). Relationship: contrast, so "However,". |
| rw-otish-2 | mavzu | Sabab-natija: voqea va oqibat | Cause and effect: an event and its consequence |
| rw-otish-2 | xato A | Qarama-qarshilik so'zi: 2-gap 1-gapga qarshi chiqmaydi | A contrast word: sentence 2 does not go against sentence 1 |
| rw-otish-2 | xato B | Misol so'zi: 2-gap 1-gapdagi umumiy fikrning aniq misoli emas | An example word: sentence 2 is not a specific example of the general idea in sentence 1 |
| rw-otish-2 | xato D | Davom so'zi: 2-gap yangi, bir yo'nalishdagi fikr qo'shmaydi | An addition word: sentence 2 does not add a new idea in the same direction |
| rw-otish-2 | yechim | Yo'l ko'milgani sabab, bozorning boshqa joyga ko'chirilgani uning natijasi. Munosabat: sabab-natija, demak "Therefore,". | The buried road is the cause; moving the market to another place is its result. Relationship: cause and effect, so "Therefore,". |
| rw-otish-3 | mavzu | Misol: umumiy fikr va aniq holat | Example: a general idea and a specific case |
| rw-otish-3 | xato A | Sabab-natija so'zi: 2-gap 1-gapdan kelib chiqqan natija emas | A cause-and-effect word: sentence 2 is not a result of sentence 1 |
| rw-otish-3 | xato B | Davom so'zi: 2-gap yangi, bir yo'nalishdagi fikr qo'shmaydi | An addition word: sentence 2 does not add a new idea in the same direction |
| rw-otish-3 | xato C | Qarama-qarshilik so'zi: 2-gap 1-gapga qarshi chiqmaydi | A contrast word: sentence 2 does not go against sentence 1 |
| rw-otish-3 | yechim | 1-gap umumiy fikr (ba'zi qushlar asbob ishlatadi), 2-gap uning aniq holati (qarg'alar novdadan ilgak yasaydi). Yangi fikr emas, o'sha fikrning misoli. Demak "For instance,". | Sentence 1 is a general idea (some birds use tools); sentence 2 is a specific case of it (crows make hooks from twigs). It is not a new idea but an example of the same idea. So "For instance,". |
| rw-otish-4 | mavzu | Davom: bir yo'nalishdagi ikkinchi foyda | Addition: a second benefit in the same direction |
| rw-otish-4 | xato B | Qarama-qarshilik so'zi: 2-gap 1-gapga qarshi chiqmaydi | A contrast word: sentence 2 does not go against sentence 1 |
| rw-otish-4 | xato C | Misol so'zi: 2-gap 1-gapdagi umumiy fikrning aniq misoli emas | An example word: sentence 2 is not a specific example of the general idea in sentence 1 |
| rw-otish-4 | xato D | Sabab-natija so'zi: 2-gap 1-gapdan kelib chiqqan natija emas | A cause-and-effect word: sentence 2 is not a result of sentence 1 |
| rw-otish-4 | yechim | Ikkala gap daraxtlarning foydasi haqida: biri soya, ikkinchisi tuproqni ushlash. Ildizlar tuproqni ushlashi mashinalar salqin bo'lganining natijasi emas. Munosabat: davom, demak "In addition,". | Both sentences are about the benefits of the trees: one is shade, the other is holding the soil. The roots holding the soil is not a result of the cars staying cool. Relationship: addition, so "In addition,". |
| rw-otish-5 | mavzu | Qarama-qarshilik: kamchilikka qaramay | Contrast: in spite of the drawbacks |
| rw-otish-5 | xato A | Sabab-natija so'zi: gap oxiridagi "so" tuzog'i; filtr yaxshi tozalagani og'ir va qimmatligidan kelib chiqmaydi | A cause-and-effect word: the "so" trap at the end of the sentence; the filter cleaning well does not follow from its being heavy and expensive |
| rw-otish-5 | xato B | Misol so'zi: 2-gap 1-gapdagi umumiy fikrning aniq misoli emas | An example word: sentence 2 is not a specific example of the general idea in sentence 1 |
| rw-otish-5 | xato D | Davom so'zi: 1-gap kamchiliklar, 2-gap yutuq; ular bir yo'nalishda emas | An addition word: sentence 1 is about drawbacks, sentence 2 about an achievement; they do not go in the same direction |
| rw-otish-5 | yechim | 1-gap kamchiliklarni sanaydi, 2-gap ularga qaramay yutuqni aytadi. Munosabat: qarama-qarshilik (yon berish), demak "Nevertheless,". 2-gapdagi "so" boshqa bog'lanish: u yutuq va qarorni ulaydi. | Sentence 1 lists the drawbacks; sentence 2 states an achievement in spite of them. Relationship: contrast (concession), so "Nevertheless,". The "so" in sentence 2 is a different connection: it links the achievement and the decision. |

### rw-lugat.ts

| id | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| rw-lugat-1 | mavzu | Bo'sh joy: ishora gapning o'zida | Blank: the clue is in the sentence itself |
| rw-lugat-1 | xato A | Mavzuga yaqin: so'qmoq haqida, lekin ikki nuqtadan keyingi ishora (shoxlar, yuvilgan joylar) xavf haqida | Close to the topic: it describes the trail, but the clue after the colon (branches, washed-away parts) is about danger |
| rw-lugat-1 | xato B | Ohang mos (salbiy), lekin ma'no boshqa: odam ko'pligi haqida ishora yo'q | The tone fits (negative), but the meaning is different: there is no clue about crowds |
| rw-lugat-1 | xato D | Ishorasiz tanlov: tanishlik haqida gapda hech narsa yo'q | A choice with no clue: nothing in the sentence is about familiarity |
| rw-lugat-1 | yechim | Ikki nuqtadan keyingi qism bo'sh joyni tushuntiradi: shoxlar yo'lni yopgan, bir qismi yuvilib ketgan. Demak so'qmoq xavfli: "hazardous". | The part after the colon explains the blank: branches covered the path, and part of it washed away. So the trail is dangerous: "hazardous". |
| rw-lugat-2 | mavzu | Ko'p ma'noli so'z: address | A word with several meanings: address |
| rw-lugat-2 | xato A | Asosiy ma'no tuzog'i: "address" ning eng tanish ma'nosi (manzil), lekin gapda xat yo'q | Primary meaning trap: the most familiar meaning of "address" (a location), but there is no letter in the sentence |
| rw-lugat-2 | xato C | Boshqa ma'no: "address a crowd" dagi ma'no, lekin bu yerda tanqislikka nutq so'zlanmaydi | A different meaning: the meaning in "address a crowd", but here no one gives a speech to a shortage |
| rw-lugat-2 | xato D | Asosiy ma'noga yaqin: xat jo'natish, gapda esa quvurlar ta'miri bor | Close to the primary meaning: sending a letter, but the sentence is about repairing pipes |
| rw-lugat-2 | yechim | "starting with repairs to the old pipes" ishorasi: mer muammoni hal qilishni quvurlar ta'miridan boshlaydi. "address" bu yerda "hal qilishga kirishmoq": "deal with". | The clue is "starting with repairs to the old pipes": the mayor begins solving the problem with pipe repairs. Here "address" means "to set about solving": "deal with". |
| rw-lugat-3 | mavzu | Bo'sh joy: "Unlike" qarama-qarshi ishora | Blank: "Unlike" signals a contrast |
| rw-lugat-3 | xato A | Teskari ma'no: "Unlike talkative" kam gapiradiganni talab qiladi, bu esa ochiq gapiradigan | Opposite meaning: "Unlike talkative" calls for someone who speaks little, but this word means someone who speaks openly |
| rw-lugat-3 | xato B | Gapga zid: yozma javoblari puxta o'ylangan (careful thought) | It contradicts the sentence: his written answers were carefully thought out (careful thought) |
| rw-lugat-3 | xato C | Ishorasiz tanlov: qiziquvchanlik haqida gapda dalil yo'q | A choice with no clue: the sentence gives no evidence of curiosity |
| rw-lugat-3 | yechim | "Unlike his talkative classmates" va "he rarely spoke" ikkalasi kam gapirishni ko'rsatadi. "reserved" (kamgap, o'zini tutadigan) mos. | "Unlike his talkative classmates" and "he rarely spoke" both point to speaking little. "reserved" (quiet, restrained) fits. |
| rw-lugat-4 | mavzu | Bo'sh joy: ohang "but" dan keyin o'zgaradi | Blank: the tone changes after "but" |
| rw-lugat-4 | xato A | Ohang tuzog'i: tanqidchilarning kutgani (minor effort), "but … proved them wrong" esa teskarisini aytadi | Tone trap: this is what the critics expected (minor effort), but "but … proved them wrong" says the opposite |
| rw-lugat-4 | xato C | Teskari ohang: "inventive" bilan zid, salbiy baho | Opposite tone: it clashes with "inventive" and is a negative judgment |
| rw-lugat-4 | xato D | Mavzuga yaqin: film haqida, lekin narx haqida ishora yo'q | Close to the topic: it is about the film, but there is no clue about cost |
| rw-lugat-4 | yechim | "but … proved them wrong": film kutilganidan yaxshi chiqqan, "careful pacing and inventive camera work" yuqori baho. Ijobiy va kuchli so'z kerak: "remarkable". | "but … proved them wrong": the film turned out better than expected, and "careful pacing and inventive camera work" is high praise. A strong, positive word is needed: "remarkable". |
| rw-lugat-5 | mavzu | Ko'p ma'noli so'z: sharp | A word with several meanings: sharp |
| rw-lugat-5 | xato A | Asosiy ma'no tuzog'i: pichoq yoki uchli narsa haqida, gapda esa son kamaygan | Primary meaning trap: it is about a knife or a pointed object, but the sentence is about a number going down |
| rw-lugat-5 | xato B | Boshqa ma'no: "a sharp student" dagi ma'no, kamayishga mos emas | A different meaning: the meaning in "a sharp student", which does not fit a drop |
| rw-lugat-5 | xato D | Boshqa ma'no: "sharp words" dagi ma'no, ovoz yoki gap ohangi haqida | A different meaning: the meaning in "sharp words", about the tone of a voice or of speech |
| rw-lugat-5 | yechim | "drop in the number" ishorasi: so'z kamayish qanday bo'lganini aytadi. Zavod yopilgandan keyin tez va keskin kamaygan: "sudden". | The clue is "drop in the number": the word tells how the decrease happened. After the factory closed, the number fell quickly and steeply: "sudden". |

## Sahifalar (oldin `-`, keyin `+`)

Faqat o'zgargan qatorlar (`git diff -U0`). Kod nomlari, URL, `data-*` va `localStorage` kalitlari o'zgarmagan. Ichki izohlar (`//`) o'zbekcha qoldi.

### xatoni-toping

```diff
-  { mavzu: 'Vergul', shablon: 'The storm knocked out the power[,] the whole street went dark.', tuzatish: ';', qoida: "Ikki mustaqil gap faqat vergul bilan ulanmaydi (comma splice). Nuqtali vergul, nuqta yoki \", and\" kerak." },
-  { mavzu: 'Nuqtali vergul', shablon: 'Although the road was icy[;] the driver stayed calm.', tuzatish: ',', qoida: "\"Although …\" tobe qism, mustaqil gap emas. Nuqtali vergulning ikki tomonida mustaqil gap bo'lishi kerak; bu yerda vergul." },
-  { mavzu: 'Ikki nuqta', shablon: 'The guide reminded us to bring[:] a map, water, and a jacket.', tuzatish: '', qoida: "Ikki nuqtadan oldin to'liq gap turadi. \"to bring\" to'ldiruvchini kutadi, shuning uchun belgi kerak emas." },
-  { mavzu: "Ega va fe'l", shablon: 'Each of the paintings in the hall [show] a different season.', tuzatish: 'shows', qoida: "Ega \"Each\" (birlik), \"of the paintings\" uni aniqlaydi xolos. Fe'l birlikda: shows." },
-  { mavzu: 'Zamon', shablon: 'Yesterday the team [finishes] the project and presented it to the class.', tuzatish: 'finished', qoida: "\"Yesterday\" va \"presented\" o'tgan zamonni ko'rsatadi. Ikkinchi fe'l ham o'tgan zamonda: finished." },
+  { mavzu: 'Comma', shablon: 'The storm knocked out the power[,] the whole street went dark.', tuzatish: ';', qoida: 'Two independent clauses cannot be joined by a comma alone (comma splice). A semicolon, a period or ", and" is needed.' },
+  { mavzu: 'Semicolon', shablon: 'Although the road was icy[;] the driver stayed calm.', tuzatish: ',', qoida: '"Although …" is a dependent part, not an independent clause. A semicolon needs an independent clause on both sides; here a comma is needed.' },
+  { mavzu: 'Colon', shablon: 'The guide reminded us to bring[:] a map, water, and a jacket.', tuzatish: '', qoida: 'A colon comes after a complete sentence. "to bring" needs its object, so no punctuation is needed.' },
+  { mavzu: 'Subject and verb', shablon: 'Each of the paintings in the hall [show] a different season.', tuzatish: 'shows', qoida: 'The subject is "Each" (singular); "of the paintings" only describes it. The verb is singular: shows.' },
+  { mavzu: 'Tense', shablon: 'Yesterday the team [finishes] the project and presented it to the class.', tuzatish: 'finished', qoida: '"Yesterday" and "presented" point to the past tense. Like the second verb, this one is in the past tense: finished.' },
-  yolBandlari={['Reading & Writing darslari']}
-  darsTuri="Reading & Writing darsi"
+  yolBandlari={['Reading & Writing lessons']}
+  darsTuri="Reading & Writing lesson"
-  title="Xatoni toping · SAT"
-  description="SAT Reading & Writing: gapdagi xatoli so'z yoki tinish belgisini toping va tuzating. Vergul, nuqtali vergul, ikki nuqta, ega va fe'l, zamon. 5 ta mashq."
+  title="Find the error · SAT"
+  description="SAT Reading & Writing: find the word or punctuation mark with the error in a sentence and fix it. Commas, semicolons, colons, subject and verb, tense. 5 exercises."
-  sarlavha="Xatoni toping: avval joyini, keyin tuzatishni"
-  lead="Grammatika savolida birinchi ish: xato qayerda ekanini ko'rish. Gapdagi so'z yoki belgini bosing, keyin uni qaysi qoida bilan tuzatishni tanlang. Har noto'g'ri variant bitta tipik xatoni ko'rsatadi."
-  qadamNomlari={['Misol', 'Qoida', "Sinab ko'r"]}
+  sarlavha="Find the error: first its location, then the revision"
+  lead="In a grammar question, the first job is to see where the error is. Tap a word or punctuation mark in the sentence, then choose the rule that fixes it. Each wrong option shows one typical mistake."
+  qadamNomlari={['Example', 'Rule', 'Try it']}
-    "Ikki mustaqil gapni vergul, nuqtali vergul va ikki nuqta bilan to'g'ri ulaysiz.",
-    "Fe'lni yaqindagi otga emas, haqiqiy egaga moslaysiz.",
-    "Gapdagi vaqt so'zi va qo'shni fe'llardan to'g'ri zamonni tanlaysiz.",
+    'You join two independent clauses correctly with a comma, a semicolon and a colon.',
+    'You make the verb agree with its real subject, not with the nearest noun.',
+    'You choose the right tense from the time word and the neighboring verbs in the sentence.',
-    "Ikki mustaqil gap: nuqta, nuqtali vergul yoki \", and / but / so\". Faqat vergul: comma splice.",
-    "Nuqtali vergulning ikki tomonida ham mustaqil gap bo'ladi. Tobe qismdan (Because, Although …) keyin vergul.",
-    "Ikki nuqtadan oldin to'liq gap turadi. Fe'l va uning to'ldiruvchisi orasiga belgi qo'yilmaydi.",
-    "Ega va fe'l: \"of …\" qismini tashlab o'qing, fe'l qolgan egaga moslashadi.",
-    "Zamon: aniq o'tgan vaqt (last winter, yesterday) bilan Past Simple; qo'shni fe'llar zamonini kuzating.",
+    'Two independent clauses: a period, a semicolon or ", and / but / so". A comma alone: comma splice.',
+    'A semicolon has an independent clause on both sides. After a dependent part (Because, Although …), use a comma.',
+    'A colon comes after a complete sentence. No punctuation goes between a verb and its object.',
+    'Subject and verb: read the sentence without the "of …" part; the verb agrees with the subject that is left.',
+    'Tense: with a specific past time (last winter, yesterday), use the Past Simple; watch the tense of the neighboring verbs.',
-  keyingi={{ nomi: 'Dalilni belgilang', href: yol('/uz/sat/qollanma/reading-writing/dalil/') }}
+  keyingi={{ nomi: 'Mark the evidence', href: yol('/uz/sat/qollanma/reading-writing/dalil/') }}
-    "Mashq savollari va misollar Tayanch uchun yozilgan; muallif tekshirmaganlari \"tekshirilmagan\" deb belgilangan.",
-    "Mavzular tanlovi (vergul, nuqtali vergul, ikki nuqta, ega va fe'l, zamon) Tayanch tavsiyasi. Rasmiy sahifada domen tavsifi bor, mavzular ro'yxati yo'q.",
+    'The exercise questions and examples were written for Tayanch; those not yet reviewed by the author are marked "not verified".',
+    'The choice of topics (commas, semicolons, colons, subject and verb, tense) is a Tayanch recommendation. The official page has a description of the domain but no list of topics.',
-      <p class="rw-namuna"><span class="pill">Namuna</span> <span class="kichik ikkinchi" id="rw-mavzu"></span></p>
-      <div class="bolaklar soz-bolaklar" id="rw-gap" role="group" aria-label="Misol gap bo'laklari" lang="en"></div>
+      <p class="rw-namuna"><span class="pill">Sample</span> <span class="kichik ikkinchi" id="rw-mavzu"></span></p>
+      <div class="bolaklar soz-bolaklar" id="rw-gap" role="group" aria-label="Parts of the example sentence"></div>
-        <p class="kichik ikkinchi">Tuzatilgan gap</p>
-        <p class="rw-tuzatilgan-matn" id="rw-tuzatilgan-matn" lang="en"></p>
+        <p class="kichik ikkinchi">Corrected sentence</p>
+        <p class="rw-tuzatilgan-matn" id="rw-tuzatilgan-matn"></p>
-    <div class="segment sahna-tugmalar" role="group" aria-label="Misol mavzusi">
+    <div class="segment sahna-tugmalar" role="group" aria-label="Example topic">
-    <p>Sahnadagi gapda xatoli bo'lak uzuq tagchiziq va chiziq bilan, tuzatish esa ko'k fon bilan ko'rsatilgan. Mavzuni almashtirib, beshta tipik xatoni ko'ring.</p>
-    <div class="formula"><span class="kichik ikkinchi">Qoida</span><span class="f-qiymat rw-qoida" id="rw-qoida"></span></div>
-    <div class="segment"><button type="button" class="katta asosiy" data-qadamga="sinab">O'zim topaman</button></div>
+    <p>In the sentence in the scene, the part with the error is shown with a dashed underline and a line through it, and the revision with a blue background. Switch topics to see five typical mistakes.</p>
+    <div class="formula"><span class="kichik ikkinchi">Rule</span><span class="f-qiymat rw-qoida" id="rw-qoida"></span></div>
+    <div class="segment"><button type="button" class="katta asosiy" data-qadamga="sinab">I'll find it myself</button></div>
-      <div><dt>Vergul</dt><dd>Ikki mustaqil gap (ega + kesim) faqat vergul bilan ulanmaydi. Tipik xato: comma splice.</dd></div>
-      <div><dt>Nuqtali vergul</dt><dd>Ikki tomonida mustaqil gap. Tipik xato: tobe qismdan keyin nuqtali vergul.</dd></div>
-      <div><dt>Ikki nuqta</dt><dd>Oldida to'liq gap, keyin ro'yxat yoki izoh. Tipik xato: fe'l va to'ldiruvchi orasida ikki nuqta.</dd></div>
-      <div><dt>Ega va fe'l</dt><dd>Fe'l haqiqiy egaga moslashadi. Tipik xato: yaqindagi otga moslash (The collection of letters were …).</dd></div>
-      <div><dt>Zamon</dt><dd>Vaqt so'zi va qo'shni fe'llar zamonni belgilaydi. Tipik xato: aniq o'tgan vaqt bilan Present Perfect.</dd></div>
+      <div><dt>Comma</dt><dd>Two independent clauses (subject + verb) cannot be joined by a comma alone. Typical mistake: comma splice.</dd></div>
+      <div><dt>Semicolon</dt><dd>An independent clause on both sides. Typical mistake: a semicolon after a dependent part.</dd></div>
+      <div><dt>Colon</dt><dd>A complete sentence before it, then a list or an explanation. Typical mistake: a colon between a verb and its object.</dd></div>
+      <div><dt>Subject and verb</dt><dd>The verb agrees with its real subject. Typical mistake: agreeing with the nearest noun (The collection of letters were …).</dd></div>
+      <div><dt>Tense</dt><dd>The time word and the neighboring verbs set the tense. Typical mistake: Present Perfect with a specific past time.</dd></div>
-      <p><b>Vazifa.</b> Sahnadagi gapda xatoli so'z yoki belgini bosing. Klaviaturada: Tab bilan gapga kiring, strelkalar bilan yuring, Enter bilan belgilang.</p>
-      <p class="vazifa-holat" id="rw-sinab-holat" aria-live="polite">Hali belgilanmagan.</p>
+      <p><b>Task.</b> Tap the word or punctuation mark with the error in the sentence in the scene. With a keyboard: press Tab to enter the sentence, move with the arrow keys, press Enter to mark.</p>
+      <p class="vazifa-holat" id="rw-sinab-holat" aria-live="polite">Nothing marked yet.</p>
-    <div class="segment"><button type="button" class="kichik-tugma" id="rw-keyingi-misol">Keyingi misol</button></div>
+    <div class="segment"><button type="button" class="kichik-tugma" id="rw-keyingi-misol">Next example</button></div>
-    if (m.tuzatish === '') tuz.setAttribute('aria-label', `${qosh(yangi)} (belgi olib tashlandi)`); else tuz.removeAttribute('aria-label');
+    if (m.tuzatish === '') tuz.setAttribute('aria-label', `${qosh(yangi)} (punctuation removed)`); else tuz.removeAttribute('aria-label');
-      if (k < 0) { $('rw-sinab-holat').textContent = 'Hali belgilanmagan.'; return; }
+      if (k < 0) { $('rw-sinab-holat').textContent = 'Nothing marked yet.'; return; }
-        $('rw-sinab-holat').textContent = `Topdingiz: «${bolaklar[k]}» → «${m.tuzatish || 'belgisiz'}». ${m.qoida}`;
+        $('rw-sinab-holat').textContent = `You found it: «${bolaklar[k]}» → «${m.tuzatish || 'no punctuation'}». ${m.qoida}`;
-        $('rw-sinab-holat').textContent = `«${bolaklar[k]}» to'g'ri yozilgan. Yana urinib ko'ring.`;
+        $('rw-sinab-holat').textContent = `«${bolaklar[k]}» is correct. Try again.`;
-      $('rw-sinab-holat').textContent = 'Hali belgilanmagan.';
+      $('rw-sinab-holat').textContent = 'Nothing marked yet.';
-      $('rw-holat').textContent = `${m.mavzu}: xatoli bo'lakni toping.`;
+      $('rw-holat').textContent = `${m.mavzu}: find the part with the error.`;
-      $('rw-holat').textContent = `${m.mavzu}: xato «${bolaklar[xato]}», tuzatish «${m.tuzatish || 'belgisiz'}».`;
+      $('rw-holat').textContent = `${m.mavzu}: the error is «${bolaklar[xato]}», the revision is «${m.tuzatish || 'no punctuation'}».`;
```

### dalil

```diff
-const davo = "Somon qatlami tuproqni namroq saqlashga yordam beradi.";
+const davo = 'A layer of straw helps soil stay moist.';
-  { matn: 'The school garden club wanted to know whether a layer of straw helps soil stay moist.', rol: 'Savol', sabab: "Tadqiqot savoli: nima tekshirilganini aytadi, natijani emas." },
-  { matn: 'The members covered half of one garden bed with straw and left the other half bare.', rol: 'Usul', sabab: "Tajriba usuli: nima qilinganini aytadi, natijani emas." },
-  { matn: 'After a week without rain, the soil under the straw was still damp, while the bare soil had dried and cracked.', rol: 'Dalil', sabab: "Kuzatilgan natija va aynan da'vo omili (namlik): bu dalil." },
-  { matn: 'The club plans to plant tomatoes in the bed next spring.', rol: 'Aloqasiz', sabab: "Kelajak rejasi: mavzuga yaqin, lekin da'voga aloqasi yo'q." },
+  { matn: 'The school garden club wanted to know whether a layer of straw helps soil stay moist.', rol: 'Question', sabab: 'The research question: it tells what was tested, not the result.' },
+  { matn: 'The members covered half of one garden bed with straw and left the other half bare.', rol: 'Method', sabab: 'The experimental method: it tells what was done, not the result.' },
+  { matn: 'After a week without rain, the soil under the straw was still damp, while the bare soil had dried and cracked.', rol: 'Evidence', sabab: 'An observed result about exactly the factor in the claim (moisture): this is the evidence.' },
+  { matn: 'The club plans to plant tomatoes in the bed next spring.', rol: 'Unrelated', sabab: 'A plan for the future: close to the topic, but unrelated to the claim.' },
-  yolBandlari={['Reading & Writing darslari']}
-  darsTuri="Reading & Writing darsi"
+  yolBandlari={['Reading & Writing lessons']}
+  darsTuri="Reading & Writing lesson"
-  title="Dalilni belgilang · SAT"
-  description="SAT Reading & Writing: qisqa matnda da'voni qo'llab-quvvatlaydigan gapni belgilang. Kontekst, usul, takror va mavzuga yaqin gaplarni dalildan ajrating. 5 ta mashq."
+  title="Mark the evidence · SAT"
+  description="SAT Reading & Writing: in a short text, mark the sentence that supports the claim. Tell context, method, restatement and close-to-the-topic sentences apart from evidence. 5 exercises."
-  sarlavha="Dalilni belgilang: da'voni qaysi gap isbotlaydi"
-  lead="Dalil savolida hamma gap mavzuga yaqin ko'rinadi. Farqi: dalil kuzatilgan fakt bo'ladi va aynan da'vodagi omilga tegadi. Matndagi gapni bosing, keyin nega u dalil ekanini yoki emasligini ko'ring."
-  qadamNomlari={['Misol', 'Qoida', "Sinab ko'r"]}
-  keyingi={{ nomi: "O'tish so'zlari", href: yol('/uz/sat/qollanma/reading-writing/otish-sozlari/') }}
+  sarlavha="Mark the evidence: which sentence proves the claim"
+  lead="In an evidence question, every sentence seems close to the topic. The difference: evidence is an observed fact, and it is about exactly the factor in the claim. Tap a sentence in the text, then see why it is or is not evidence."
+  qadamNomlari={['Example', 'Rule', 'Try it']}
+  keyingi={{ nomi: 'Transition words', href: yol('/uz/sat/qollanma/reading-writing/otish-sozlari/') }}
-    "Da'voning asosiy omilini (nima, kim, qanday o'zgarish) bir qarashda ajratasiz.",
-    "Kontekst, usul va xulosani takrorlovchi gapni dalildan farqlaysiz.",
-    "Mavzuga yaqin, lekin da'voga aloqasi yo'q gap tuzog'iga tushmaysiz.",
+    'You spot the main factor of a claim (what, who, what change) at a glance.',
+    'You tell context, method and a sentence that restates the conclusion apart from evidence.',
+    'You do not fall for the trap of a sentence that is close to the topic but unrelated to the claim.',
-    "Avval da'voni o'qing va uning omilini ajrating: aynan nima isbotlanishi kerak.",
-    "Dalil kuzatilgan fakt yoki natija bo'ladi. Savol, usul va kontekst gaplari dalil emas.",
-    "Da'voni boshqa so'zlar bilan takrorlagan gap dalil emas: u xulosaning o'zi.",
-    "Mavzuga yaqin gap tuzoq: da'vodagi omilga tegmasa, u dalil emas.",
+    'First read the claim and pick out its factor: what exactly needs to be proved.',
+    'Evidence is an observed fact or result. Question, method and context sentences are not evidence.',
+    'A sentence that restates the claim in other words is not evidence: it is the conclusion itself.',
+    'A sentence close to the topic is a trap: if it is not about the factor in the claim, it is not evidence.',
-    "Matnlar va savollar Tayanch uchun yozilgan, vaziyatlar o'ylab topilgan; muallif tekshirmaganlari \"tekshirilmagan\" deb belgilangan.",
-    "Tuzoq turlari (kontekst, usul, takror, mavzuga yaqin) Tayanch tavsiyasi, rasmiy tasnif emas.",
+    'The texts and questions were written for Tayanch, and the situations are made up; those not yet reviewed by the author are marked "not verified".',
+    'The trap types (context, method, restatement, close to the topic) are a Tayanch recommendation, not an official classification.',
-      <p class="rw-namuna"><span class="pill">Namuna</span> <span class="kichik ikkinchi">O'ylab topilgan vaziyat</span></p>
-      <p class="rw-davo"><span class="kichik ikkinchi">Da'vo</span> {davo}</p>
-      <div class="bolaklar gap-bolaklar" id="rw-matn" role="group" aria-label="Matn gaplari" lang="en">
+      <p class="rw-namuna"><span class="pill">Sample</span> <span class="kichik ikkinchi">Made-up situation</span></p>
+      <p class="rw-davo"><span class="kichik ikkinchi">Claim</span> {davo}</p>
+      <div class="bolaklar gap-bolaklar" id="rw-matn" role="group" aria-label="Sentences of the text">
-            <span class="gap-yorliq" lang="uz" hidden></span>
+            <span class="gap-yorliq" hidden></span>
-    <p>Sahnadagi har gap rolini ko'rsatuvchi yorliq bilan belgilangan. Dalil gap ko'k chegara va tagchiziq bilan, qolganlari uzuq chegara bilan ajratilgan.</p>
-    <div class="formula"><span class="kichik ikkinchi">Nega aynan shu gap</span><span class="f-qiymat rw-qoida">{gaplar[DALIL].sabab}</span></div>
-    <div class="segment"><button type="button" class="katta asosiy" data-qadamga="sinab">O'zim topaman</button></div>
+    <p>Each sentence in the scene has a label that shows its role. The evidence sentence has a blue border and an underline; the others have a dashed border.</p>
+    <div class="formula"><span class="kichik ikkinchi">Why this sentence</span><span class="f-qiymat rw-qoida">{gaplar[DALIL].sabab}</span></div>
+    <div class="segment"><button type="button" class="katta asosiy" data-qadamga="sinab">I'll find it myself</button></div>
-      <div><dt>Dalil</dt><dd>Kuzatilgan fakt yoki natija, va u da'vodagi omilga to'g'ridan-to'g'ri tegadi.</dd></div>
-      <div><dt>Kontekst, savol, usul</dt><dd>Vaziyatni yoki nima qilinganini aytadi, natijani emas.</dd></div>
-      <div><dt>Da'vo takrori</dt><dd>Xulosani boshqa so'zlar bilan aytadi. U isbot emas, isbotlanadigan narsa.</dd></div>
-      <div><dt>Mavzuga yaqin</dt><dd>Shu mavzuda, lekin da'vodagi omilga tegmaydi.</dd></div>
-      <div><dt>Teskari fikr</dt><dd>Muallif rad etayotgan qarash. U da'voga qarshi.</dd></div>
+      <div><dt>Evidence</dt><dd>An observed fact or result, and it is directly about the factor in the claim.</dd></div>
+      <div><dt>Context, question, method</dt><dd>Tells the situation or what was done, not the result.</dd></div>
+      <div><dt>Restated claim</dt><dd>Says the conclusion in other words. It is not proof; it is what needs to be proved.</dd></div>
+      <div><dt>Close to the topic</dt><dd>On the same topic, but not about the factor in the claim.</dd></div>
+      <div><dt>Opposing view</dt><dd>A view the author rejects. It goes against the claim.</dd></div>
-      <p><b>Vazifa.</b> Da'voni o'qing va sahnadagi matnda uni qo'llab-quvvatlaydigan gapni bosing. Klaviaturada: Tab bilan matnga kiring, strelkalar bilan yuring, Enter bilan belgilang.</p>
-      <p class="vazifa-holat" id="rw-sinab-holat" aria-live="polite">Hali belgilanmagan.</p>
+      <p><b>Task.</b> Read the claim and tap the sentence in the scene's text that supports it. With a keyboard: press Tab to enter the text, move with the arrow keys, press Enter to mark.</p>
+      <p class="vazifa-holat" id="rw-sinab-holat" aria-live="polite">Nothing marked yet.</p>
-    <div class="segment"><button type="button" class="kichik-tugma" id="rw-qayta">Qayta urinish</button></div>
+    <div class="segment"><button type="button" class="kichik-tugma" id="rw-qayta">Try again</button></div>
-    if (k < 0) { holat.textContent = 'Hali belgilanmagan.'; holat.dataset.ok = ''; return; }
+    if (k < 0) { holat.textContent = 'Nothing marked yet.'; holat.dataset.ok = ''; return; }
-      yorliq(k, "To'g'ri dalil", 'gap-togri');
-      holat.textContent = `To'g'ri. ${gaplar[k].sabab}`;
+      yorliq(k, 'Correct evidence', 'gap-togri');
+      holat.textContent = `Correct. ${gaplar[k].sabab}`;
-      yorliq(k, 'Siz tanlagan', 'gap-xato');
-      holat.textContent = `Bu dalil emas. ${gaplar[k].sabab} Yana urinib ko'ring.`;
+      yorliq(k, 'Your choice', 'gap-xato');
+      holat.textContent = `This is not evidence. ${gaplar[k].sabab} Try again.`;
-      holat.textContent = 'Hali belgilanmagan.'; holat.dataset.ok = '';
-      $('rw-holat').textContent = "Da'voni qo'llab-quvvatlaydigan gapni toping.";
+      holat.textContent = 'Nothing marked yet.'; holat.dataset.ok = '';
+      $('rw-holat').textContent = 'Find the sentence that supports the claim.';
-      $('rw-holat').textContent = `Dalil: ${dalil + 1}-gap. Qolganlari: ${gaplar.filter((_, k) => k !== dalil).map((x) => x.rol.toLowerCase()).join(', ')}.`;
+      $('rw-holat').textContent = `Evidence: sentence ${dalil + 1}. The others: ${gaplar.filter((_, k) => k !== dalil).map((x) => x.rol.toLowerCase()).join(', ')}.`;
```

### otish-sozlari

```diff
-  { id: 'zid', nomi: 'Qarama-qarshilik', sozlar: ['However,', 'In contrast,', 'Nevertheless,'], savol: "2-gap 1-gapga qarshi chiqadimi yoki kutilmagan narsani aytadimi?" },
-  { id: 'sabab', nomi: 'Sabab-natija', sozlar: ['Therefore,', 'As a result,', 'Consequently,'], savol: '2-gap 1-gapdan kelib chiqadimi?' },
-  { id: 'misol', nomi: 'Misol', sozlar: ['For example,', 'For instance,', 'Specifically,'], savol: "2-gap 1-gapdagi umumiy fikrning aniq holatimi?" },
-  { id: 'davom', nomi: 'Davom', sozlar: ['Moreover,', 'In addition,', 'Furthermore,'], savol: "2-gap shu yo'nalishda yangi fikr qo'shadimi?" },
+  { id: 'zid', nomi: 'Contrast', sozlar: ['However,', 'In contrast,', 'Nevertheless,'], savol: 'Does sentence 2 go against sentence 1 or say something unexpected?' },
+  { id: 'sabab', nomi: 'Cause and effect', sozlar: ['Therefore,', 'As a result,', 'Consequently,'], savol: 'Does sentence 2 follow from sentence 1?' },
+  { id: 'misol', nomi: 'Example', sozlar: ['For example,', 'For instance,', 'Specifically,'], savol: 'Is sentence 2 a specific case of the general idea in sentence 1?' },
+  { id: 'davom', nomi: 'Addition', sozlar: ['Moreover,', 'In addition,', 'Furthermore,'], savol: 'Does sentence 2 add a new idea in the same direction?' },
-  { birinchi: "The museum's new wing was designed to hold large sculptures.", ikkinchi: 'most of the pieces shown there in its first year were small paintings.', munosabat: 'zid', sabab: "Qanot katta haykallar uchun qurilgan, lekin unda kichik rasmlar ko'rsatilgan: kutilganiga qarshi." },
-  { birinchi: "The bakery's only oven broke early on Friday morning.", ikkinchi: 'no fresh bread was sold that day.', munosabat: 'sabab', sabab: "Pech buzilgani sabab, non sotilmagani uning natijasi." },
-  { birinchi: 'Many desert animals avoid the midday heat.', ikkinchi: 'fennec foxes stay in cool burrows until the sun goes down.', munosabat: 'misol', sabab: "Fenek tulkilari 1-gapdagi \"ko'p cho'l hayvonlari\" ning aniq misoli." },
-  { birinchi: 'Walking to school saves the family money on bus fares.', ikkinchi: 'it gives the children a short morning workout.', munosabat: 'davom', sabab: "Ikkalasi piyoda yurishning foydasi: ikkinchi foyda birinchisiga qo'shiladi, undan kelib chiqmaydi." },
+  { birinchi: "The museum's new wing was designed to hold large sculptures.", ikkinchi: 'most of the pieces shown there in its first year were small paintings.', munosabat: 'zid', sabab: 'The wing was built for large sculptures, but small paintings were shown in it: the opposite of what was expected.' },
+  { birinchi: "The bakery's only oven broke early on Friday morning.", ikkinchi: 'no fresh bread was sold that day.', munosabat: 'sabab', sabab: 'The broken oven is the cause; no bread being sold is its result.' },
+  { birinchi: 'Many desert animals avoid the midday heat.', ikkinchi: 'fennec foxes stay in cool burrows until the sun goes down.', munosabat: 'misol', sabab: 'Fennec foxes are a specific example of the "many desert animals" in sentence 1.' },
+  { birinchi: 'Walking to school saves the family money on bus fares.', ikkinchi: 'it gives the children a short morning workout.', munosabat: 'davom', sabab: 'Both are benefits of walking: the second benefit is added to the first and does not follow from it.' },
-  yolBandlari={['Reading & Writing darslari']}
-  darsTuri="Reading & Writing darsi"
+  yolBandlari={['Reading & Writing lessons']}
+  darsTuri="Reading & Writing lesson"
-  title="O'tish so'zlari · SAT"
-  description="SAT Reading & Writing: ikki gap orasidagi munosabatni (qarama-qarshilik, sabab-natija, misol, davom) topib, mos o'tish so'zini tanlang. 5 ta mashq."
+  title="Transition words · SAT"
+  description="SAT Reading & Writing: find the relationship between two sentences (contrast, cause and effect, example, addition) and choose the right transition word. 5 exercises."
-  sarlavha="O'tish so'zlari: avval munosabat, keyin so'z"
-  lead="O'tish so'zi savolida variantlarning hammasi grammatik jihatdan to'g'ri. Farqi ma'noda: so'z ikki gap orasidagi munosabatni aytadi. Avval 2-gap 1-gapga nima qilishini aniqlang, keyin shu munosabat so'zini tanlang."
-  qadamNomlari={['Misol', 'Qoida', "Sinab ko'r"]}
-  savolTili="en"
-  savolKorsatma="Bo'sh joyga eng mantiqiy o'tish so'zini tanlang."
+  sarlavha="Transition words: first the relationship, then the word"
+  lead="In a transition question, all the options are grammatically correct. The difference is in meaning: the word states the relationship between the two sentences. First decide what sentence 2 does to sentence 1, then choose a word for that relationship."
+  qadamNomlari={['Example', 'Rule', 'Try it']}
+  savolKorsatma="Choose the most logical transition word for the blank."
-    "Ikki gap orasidagi munosabatni to'rt turdan biriga ajratasiz.",
-    "Har munosabat uchun o'tish so'zlarini bilasiz va ularni aralashtirmaysiz.",
-    "Gap ichidagi boshqa bog'lovchi (masalan \"so\") tuzog'iga tushmaysiz.",
+    'You sort the relationship between two sentences into one of four types.',
+    'You know the transition words for each relationship and do not mix them up.',
+    'You do not fall for the trap of another connecting word inside the sentence (for example, "so").',
-    "Bo'sh joyni yoping va so'ring: 2-gap 1-gapga nima qiladi?",
-    "Qarshi chiqsa: However, In contrast, Nevertheless. Kelib chiqsa: Therefore, As a result, Consequently.",
-    "Aniq holat bo'lsa: For example, For instance. Yangi fikr qo'shsa: Moreover, In addition, Furthermore.",
-    "Bir munosabatdagi so'zlar ko'pincha bir-birining o'rnini bosadi; javob variantlarida esa odatda har munosabatdan bittadan bo'ladi.",
-    "Ikkinchi foyda birinchisining natijasi emas: \"As a result\" faqat sabab bo'lsa.",
+    'Cover the blank and ask: what does sentence 2 do to sentence 1?',
+    'If it goes against it: However, In contrast, Nevertheless. If it follows from it: Therefore, As a result, Consequently.',
+    'If it is a specific case: For example, For instance. If it adds a new idea: Moreover, In addition, Furthermore.',
+    'Words for the same relationship can often replace each other; the answer options, though, usually have one word from each relationship.',
+    'A second benefit is not a result of the first: use "As a result" only when there is a cause.',
-  keyingi={{ nomi: "Lug'at kontekstda", href: yol('/uz/sat/qollanma/reading-writing/lugat-kontekstda/') }}
+  keyingi={{ nomi: 'Vocabulary in context', href: yol('/uz/sat/qollanma/reading-writing/lugat-kontekstda/') }}
-    "Matnlar va savollar Tayanch uchun yozilgan, vaziyatlar o'ylab topilgan; muallif tekshirmaganlari \"tekshirilmagan\" deb belgilangan.",
-    "To'rt munosabat jadvali va so'zlar ro'yxati Tayanch tavsiyasi, rasmiy tasnif emas. \"Transitions\" skill nomi rasmiy manbada tekshirilmagan; CB06 da faqat domen nomi (Expression of Ideas) bor.",
+    'The texts and questions were written for Tayanch, and the situations are made up; those not yet reviewed by the author are marked "not verified".',
+    'The four-relationship table and the word lists are a Tayanch recommendation, not an official classification. The skill name "Transitions" has not been checked in an official source; CB06 has only the domain name (Expression of Ideas).',
-      <p class="rw-namuna"><span class="pill">Namuna</span> <span class="kichik ikkinchi" id="otish-tartib">1 / {misollar.length} misol</span></p>
-      <p class="otish-matn" lang="en">
+      <p class="rw-namuna"><span class="pill">Sample</span> <span class="kichik ikkinchi" id="otish-tartib">Example 1 of {misollar.length}</span></p>
+      <p class="otish-matn">
-      <div class="bolaklar gap-bolaklar" id="otish-jadval" role="group" aria-label="Ma'no munosabati: 2-gap 1-gapga nima qiladi">
+      <div class="bolaklar gap-bolaklar" id="otish-jadval" role="group" aria-label="Relationship in meaning: what sentence 2 does to sentence 1">
-            <span class="gap-matn"><b>{m.nomi}</b> <span class="mun-sozlar" lang="en">{m.sozlar.map((x) => x.replace(/,$/, '')).join(' · ')}</span></span>
+            <span class="gap-matn"><b>{m.nomi}</b> <span class="mun-sozlar">{m.sozlar.map((x) => x.replace(/,$/, '')).join(' · ')}</span></span>
-    <div class="segment otish-boshqaruv"><button type="button" class="kichik-tugma" id="otish-keyingi">Keyingi misol</button></div>
+    <div class="segment otish-boshqaruv"><button type="button" class="kichik-tugma" id="otish-keyingi">Next example</button></div>
-    <p>Sahnadagi bo'sh joy to'ldirilgan, jadvalda shu juftning munosabati ko'k chegara bilan belgilangan. "Keyingi misol" bilan to'rt munosabatning har birini ko'ring.</p>
-    <div class="formula"><span class="kichik ikkinchi">Nega aynan shu munosabat</span><span class="f-qiymat rw-qoida" id="otish-sabab">{misollar[0].sabab}</span></div>
-    <div class="segment"><button type="button" class="katta asosiy" data-qadamga="sinab">O'zim topaman</button></div>
+    <p>The blank in the scene is filled in, and the table marks the relationship for this pair with a blue border. Use "Next example" to see each of the four relationships.</p>
+    <div class="formula"><span class="kichik ikkinchi">Why this relationship</span><span class="f-qiymat rw-qoida" id="otish-sabab">{misollar[0].sabab}</span></div>
+    <div class="segment"><button type="button" class="katta asosiy" data-qadamga="sinab">I'll find it myself</button></div>
-        <div><dt>{m.nomi} <span class="mun-sozlar" lang="en">{m.sozlar.map((x) => x.replace(/,$/, '')).join(' · ')}</span></dt><dd>{m.savol}</dd></div>
+        <div><dt>{m.nomi} <span class="mun-sozlar">{m.sozlar.map((x) => x.replace(/,$/, '')).join(' · ')}</span></dt><dd>{m.savol}</dd></div>
-    <p class="kichik ikkinchi">Usul: bo'sh joyni yoping, ikki gapni o'z so'zingiz bilan ulang ("lekin", "shuning uchun", "masalan", "yana"), keyin shu ma'nodagi variantni toping.</p>
+    <p class="kichik ikkinchi">Method: cover the blank, connect the two sentences in your own words ("but", "so", "for example", "also"), then find the option with that meaning.</p>
-      <p><b>Vazifa.</b> Sahnadagi ikki gapni o'qing va jadvaldan ularning munosabatini tanlang. Klaviaturada: Tab bilan jadvalga kiring, strelkalar bilan yuring, Enter bilan tanlang.</p>
-      <p class="vazifa-holat" id="otish-sinab-holat" aria-live="polite">Hali tanlanmagan.</p>
+      <p><b>Task.</b> Read the two sentences in the scene and choose their relationship from the table. With a keyboard: press Tab to enter the table, move with the arrow keys, press Enter to choose.</p>
+      <p class="vazifa-holat" id="otish-sinab-holat" aria-live="polite">Nothing chosen yet.</p>
-    <div class="segment"><button type="button" class="kichik-tugma" id="otish-qayta">Qayta urinish</button></div>
+    <div class="segment"><button type="button" class="kichik-tugma" id="otish-qayta">Try again</button></div>
-    if (k < 0) { holat.textContent = 'Hali tanlanmagan.'; holat.dataset.ok = ''; return; }
+    if (k < 0) { holat.textContent = 'Nothing chosen yet.'; holat.dataset.ok = ''; return; }
-      yorliq(k, "To'g'ri", 'gap-togri');
+      yorliq(k, 'Correct', 'gap-togri');
-      holat.textContent = `To'g'ri: ${munosabatlar[k].nomi.toLowerCase()}. ${m.sabab}`;
+      holat.textContent = `Correct: ${munosabatlar[k].nomi.toLowerCase()}. ${m.sabab}`;
-      yorliq(k, 'Siz tanlagan', 'gap-xato');
-      holat.textContent = `Bu munosabat mos emas. Savol: ${munosabatlar[k].savol} Bu juftda javob "yo'q". Yana urinib ko'ring.`;
+      yorliq(k, 'Your choice', 'gap-xato');
+      holat.textContent = `This relationship does not fit. Question: ${munosabatlar[k].savol} For this pair, the answer is "no". Try again.`;
-    $('otish-tartib').textContent = `${joriy + 1} / ${misollar.length} misol`;
+    $('otish-tartib').textContent = `Example ${joriy + 1} of ${misollar.length}`;
-      holat.textContent = 'Hali tanlanmagan.'; holat.dataset.ok = '';
-      $('otish-holat').textContent = `${joriy + 1}-misol. Ikki gap orasidagi munosabatni tanlang.`;
+      holat.textContent = 'Nothing chosen yet.'; holat.dataset.ok = '';
+      $('otish-holat').textContent = `Example ${joriy + 1}. Choose the relationship between the two sentences.`;
-      yorliq(k, 'Shu juft', 'gap-togri');
+      yorliq(k, 'This pair', 'gap-togri');
-      $('otish-holat').textContent = `${joriy + 1}-misol. Munosabat: ${munosabatlar[k].nomi.toLowerCase()}, bo'sh joyda "${munosabatlar[k].sozlar[0]}".`;
+      $('otish-holat').textContent = `Example ${joriy + 1}. Relationship: ${munosabatlar[k].nomi.toLowerCase()}, with "${munosabatlar[k].sozlar[0]}" in the blank.`;
```

### lugat-kontekstda

```diff
-    { oldi: 'Please write your home', keyin: 'on the form before you leave.', ishora: 'write … on the form', mano: "manzil (ot)" },
-    { oldi: 'The council met to', keyin: 'complaints about the noisy road.', ishora: 'complaints', mano: "hal qilishga kirishmoq (fe'l)" },
+    { oldi: 'Please write your home', keyin: 'on the form before you leave.', ishora: 'write … on the form', mano: 'a location (noun)' },
+    { oldi: 'The council met to', keyin: 'complaints about the noisy road.', ishora: 'complaints', mano: 'to set about solving (verb)' },
-  { shablon: 'The old bridge could no longer [bear] the {weight} of loaded trucks, so the city closed it to heavy traffic.', mano: "ko'tarmoq, ushlab turmoq", izoh: "\"weight\" (og'irlik): ko'prik og'irlikni ko'tara olmaydi. \"bear\" bu yerda ayiq emas." },
-  { shablon: 'Her argument was [sound]: every step {followed} {logically} from the evidence she presented.', mano: "asosli, mustahkam", izoh: "\"followed logically\": har qadam mantiqan kelib chiqadi. \"sound\" bu yerda ovoz emas." },
+  { shablon: 'The old bridge could no longer [bear] the {weight} of loaded trucks, so the city closed it to heavy traffic.', mano: 'to carry, to hold up', izoh: '"weight": the bridge cannot carry the weight. Here "bear" is not the animal.' },
+  { shablon: 'Her argument was [sound]: every step {followed} {logically} from the evidence she presented.', mano: 'well-founded, solid', izoh: '"followed logically": each step follows logically. Here "sound" is not a noise.' },
-  yolBandlari={['Reading & Writing darslari']}
-  darsTuri="Reading & Writing darsi"
+  yolBandlari={['Reading & Writing lessons']}
+  darsTuri="Reading & Writing lesson"
-  title="Lug'at kontekstda · SAT"
-  description="SAT Reading & Writing: so'z ma'nosini gapdagi kontekst ishorasidan toping. Ko'p ma'noli so'zlar, ohang va asosiy ma'no tuzog'i. 5 ta mashq."
+  title="Vocabulary in context · SAT"
+  description="SAT Reading & Writing: find the meaning of a word from the context clue in the sentence. Words with several meanings, tone and the primary meaning trap. 5 exercises."
-  sarlavha="Lug'at kontekstda: ma'noni gap aytadi"
-  lead="Bu savollarda so'zning eng tanish ma'nosi ko'pincha tuzoq bo'ladi. Javob gapning o'zida: atrofdagi so'zlar (kontekst ishorasi) qaysi ma'no kerakligini ko'rsatadi. Ishorani toping, keyin variantni gapga qo'yib tekshiring."
-  qadamNomlari={['Misol', 'Qoida', "Sinab ko'r"]}
-  savolTili="en"
-  savolKorsatma="Gapni o'qing va eng mantiqiy, aniq so'z yoki ma'noni tanlang."
+  sarlavha="Vocabulary in context: the sentence tells the meaning"
+  lead="In these questions, the most familiar meaning of a word is often a trap. The answer is in the sentence itself: the words around it (the context clue) show which meaning is needed. Find the clue, then check an option by putting it into the sentence."
+  qadamNomlari={['Example', 'Rule', 'Try it']}
+  savolKorsatma="Read the sentence and choose the most logical and precise word or meaning."
-    "Gapdagi kontekst ishorasini (izoh, qarama-qarshilik, natija) topasiz.",
-    "Ko'p ma'noli so'zning gapdagi ma'nosini asosiy ma'nosidan ajratasiz.",
-    "Ohangi teskari yoki mavzuga yaqin, lekin ma'nosi boshqa variantni chetga surasiz.",
+    'You find the context clue in a sentence (an explanation, a contrast, a result).',
+    'You tell the meaning of a word with several meanings in a sentence apart from its primary meaning.',
+    'You set aside an option with the opposite tone, or one that is close to the topic but has a different meaning.',
-    "So'zni yoping va o'rniga o'z so'zingizni qo'ying, keyin variantlarga qarang.",
-    "Ishora izlang: ikki nuqtadan keyingi izoh, \"Unlike\", \"but\", natija yoki misol.",
-    "So'zning eng tanish ma'nosi ko'pincha tuzoq: gapga qo'yib tekshiring.",
-    "Ohangni aniqlang (ijobiy, salbiy, neytral) va teskari ohangli variantni chetga suring.",
+    'Cover the word and put in a word of your own, then look at the options.',
+    'Look for a clue: an explanation after a colon, "Unlike", "but", a result or an example.',
+    'The most familiar meaning of a word is often a trap: check it by putting it into the sentence.',
+    'Decide the tone (positive, negative, neutral) and set aside the option with the opposite tone.',
-    "Matnlar va savollar Tayanch uchun yozilgan, vaziyatlar o'ylab topilgan; muallif tekshirmaganlari \"tekshirilmagan\" deb belgilangan.",
-    "Ishora turlari va tuzoq nomlari Tayanch tavsiyasi, rasmiy tasnif emas. \"Words in Context\" skill nomi rasmiy manbada tekshirilmagan; CB06 da faqat domen nomi (Craft and Structure) bor.",
+    'The texts and questions were written for Tayanch, and the situations are made up; those not yet reviewed by the author are marked "not verified".',
+    'The clue types and trap names are a Tayanch recommendation, not an official classification. The skill name "Words in Context" has not been checked in an official source; CB06 has only the domain name (Craft and Structure).',
-      <p class="rw-namuna"><span class="pill">Namuna</span> <span class="kichik ikkinchi" id="lug-tartib">Bitta so'z, ikki ma'no</span></p>
+      <p class="rw-namuna"><span class="pill">Sample</span> <span class="kichik ikkinchi" id="lug-tartib">One word, two meanings</span></p>
-            <p class="kichik ikkinchi">{k + 1}-gap</p>
-            <p class="lug-gap" lang="en">{x.oldi} <b class="lug-soz">{ikkiMano.soz}</b> {x.keyin}</p>
-            <p class="lug-izoh">Ishora: <span lang="en">{x.ishora}</span> → <b>{x.mano}</b></p>
+            <p class="kichik ikkinchi">Sentence {k + 1}</p>
+            <p class="lug-gap">{x.oldi} <b class="lug-soz">{ikkiMano.soz}</b> {x.keyin}</p>
+            <p class="lug-izoh">Clue: {x.ishora} → <b>{x.mano}</b></p>
-          <div class="bolaklar soz-bolaklar lug-gap-bolaklar" data-sinov={s} role="group" aria-label="Gap so'zlari: ishora so'zni belgilang" lang="en" hidden={s !== 0}>
+          <div class="bolaklar soz-bolaklar lug-gap-bolaklar" data-sinov={s} role="group" aria-label="Words of the sentence: mark the clue word" hidden={s !== 0}>
-    <p>Sahnada "{ikkiMano.soz}" ikki gapda ikki xil ma'noda. So'z bir xil, ma'noni atrofdagi so'zlar tanlaydi.</p>
-    <div class="formula"><span class="kichik ikkinchi">Asosiy fikr</span><span class="f-qiymat rw-qoida">Lug'atdagi birinchi ma'noni emas, gap talab qilgan ma'noni tanlang.</span></div>
-    <div class="segment"><button type="button" class="katta asosiy" data-qadamga="sinab">O'zim topaman</button></div>
+    <p>In the scene, "{ikkiMano.soz}" has a different meaning in each of the two sentences. The word is the same; the words around it choose the meaning.</p>
+    <div class="formula"><span class="kichik ikkinchi">Key idea</span><span class="f-qiymat rw-qoida">Choose the meaning the sentence calls for, not the first meaning in the dictionary.</span></div>
+    <div class="segment"><button type="button" class="katta asosiy" data-qadamga="sinab">I'll find it myself</button></div>
-      <li><b>So'zni yoping.</b> Gapni so'zsiz o'qing.</li>
-      <li><b>Ishorani toping.</b> Ikki nuqtadan keyingi izoh, "Unlike" yoki "but" dan keyingi qarama-qarshilik, natija yoki misol.</li>
-      <li><b>O'z so'zingizni qo'ying.</b> O'zbekcha bo'lsa ham bo'ladi: "xavfli", "hal qilmoq".</li>
-      <li><b>Variantni gapga qo'ying.</b> Ma'no va ohang mos kelsin; eng tanish ma'no tuzoq bo'lishi mumkin.</li>
+      <li><b>Cover the word.</b> Read the sentence without it.</li>
+      <li><b>Find the clue.</b> An explanation after a colon, a contrast after "Unlike" or "but", a result or an example.</li>
+      <li><b>Put in a word of your own.</b> It can even be in Uzbek: "<span lang="uz">xavfli</span>", "<span lang="uz">hal qilmoq</span>".</li>
+      <li><b>Put the option into the sentence.</b> The meaning and the tone should fit; the most familiar meaning may be a trap.</li>
-      <p><b>Vazifa.</b> Sahnadagi gapda ajratilgan so'zning ma'nosini ko'rsatadigan ishora so'zni bosing. Klaviaturada: Tab bilan gapga kiring, strelkalar bilan yuring, Enter bilan belgilang.</p>
-      <p class="vazifa-holat" id="lug-sinab-holat" aria-live="polite">Hali belgilanmagan.</p>
+      <p><b>Task.</b> Tap the clue word that shows the meaning of the highlighted word in the sentence in the scene. With a keyboard: press Tab to enter the sentence, move with the arrow keys, press Enter to mark.</p>
+      <p class="vazifa-holat" id="lug-sinab-holat" aria-live="polite">Nothing marked yet.</p>
-      <button type="button" class="kichik-tugma" id="lug-qayta">Qayta urinish</button>
-      <button type="button" class="kichik-tugma" id="lug-keyingi">Keyingi misol</button>
+      <button type="button" class="kichik-tugma" id="lug-qayta">Try again</button>
+      <button type="button" class="kichik-tugma" id="lug-keyingi">Next example</button>
-    <h3 id="lug-blok-h">Lug'at kartalaringiz</h3>
-    <p id="lug-blok-matn" data-jami={kartalar.length} data-sozlar={JSON.stringify(kartalar.map((k) => k.soz))}>Lug'at kartalari holati shu brauzerdan o'qiladi.</p>
-    <a class="matn-tugma kok-tugma" href={yol('/uz/sat/mashq/lugat/')}>Lug'at kartalariga o'tish</a>
+    <h3 id="lug-blok-h">Your vocabulary cards</h3>
+    <p id="lug-blok-matn" data-jami={kartalar.length} data-sozlar={JSON.stringify(kartalar.map((k) => k.soz))}>The status of your vocabulary cards is read from this browser.</p>
+    <a class="matn-tugma kok-tugma" href={yol('/uz/sat/mashq/lugat/')}>Go to the vocabulary cards</a>
-      if (k < 0) { holat.textContent = 'Hali belgilanmagan.'; holat.dataset.ok = ''; return; }
+      if (k < 0) { holat.textContent = 'Nothing marked yet.'; holat.dataset.ok = ''; return; }
-        holat.textContent = `To'g'ri. ${sinovlar[s].izoh} Ma'nosi: ${sinovlar[s].mano}.`;
+        holat.textContent = `Correct. ${sinovlar[s].izoh} Meaning: ${sinovlar[s].mano}.`;
-        holat.textContent = `Bu so'zning o'zi. Ishora uning atrofida: "${maqsad}" nimani qiladi yoki qanday?`;
+        holat.textContent = `This is the word itself. The clue is around it: what does "${maqsad}" do, or how?`;
-        holat.textContent = `"${b.m}" so'zi "${maqsad}" ning ma'nosini aniqlamaydi. Yana urinib ko'ring.`;
+        holat.textContent = `The word "${b.m}" does not determine the meaning of "${maqsad}". Try again.`;
-      $('lug-tartib').textContent = `${joriy + 1} / ${sinovlar.length} misol`;
-      $('lug-holat').textContent = `"${maqsad}" so'zining ma'nosini ko'rsatadigan so'zni bosing.`;
-      holat.textContent = 'Hali belgilanmagan.'; holat.dataset.ok = '';
+      $('lug-tartib').textContent = `Example ${joriy + 1} of ${sinovlar.length}`;
+      $('lug-holat').textContent = `Tap the word that shows the meaning of "${maqsad}".`;
+      holat.textContent = 'Nothing marked yet.'; holat.dataset.ok = '';
-      $('lug-tartib').textContent = "Bitta so'z, ikki ma'no";
-      $('lug-holat').textContent = "1-gapda \"address\" manzil, 2-gapda hal qilishga kirishmoq.";
+      $('lug-tartib').textContent = 'One word, two meanings';
+      $('lug-holat').textContent = 'In sentence 1, "address" is a location; in sentence 2, it means to set about solving.';
-      ? `Namuna lug'atdagi ${sozlar.length} ta so'zdan hali birortasini belgilamagansiz.`
-      : `Namuna lug'atdagi ${sozlar.length} ta so'zdan ${bilaman} tasini "bilaman", ${organ} tasini "o'rganyapman" deb belgilagansiz.`;
+      ? `You have not marked any of the ${sozlar.length} words in the sample vocabulary yet.`
+      : `Of the ${sozlar.length} words in the sample vocabulary, you have marked ${bilaman} as "I know it" and ${organ} as "Still learning".`;
-    blok.textContent = "Lug'at kartalari holatini o'qib bo'lmadi (brauzer saqlashga ruxsat bermagan bo'lishi mumkin).";
+    blok.textContent = 'Could not read the status of your vocabulary cards (the browser may not allow storage).';
```

## Savol tekshiruvi (`rw-tekshiruv.ts`, `scripts/savollarni-tekshir.ts`)

- `rw-tekshiruv.ts` o'zgarmagan: uning qiymatlari faqat inglizcha variant matni va savol matnidagi ishoralarga bog'liq (ular o'zgarmagan); usul tavsiflari (ichki hujjat) o'zbekcha qoldi.
- `npm run savollar:tekshir`: SAT 41 savol, 0 farq. `docs/sat-savollar-tekshiruv.md` qayta yaratildi (faqat 20 ta R&W qatori va sana o'zgargan); IELTS va Top Admission jadvallarida faqat sana o'zgargani uchun ular qaytarildi.

## Ma'lum qolgan o'zbekcha joylar (boshqa PR doirasi)

- Takrorlash sahifasi (`/uz/sat/vosita/takrorlash/`): modul nomi (`turlar.ts` `modulNomi`, masalan "Dalilni belgilang") 5-PR da.
