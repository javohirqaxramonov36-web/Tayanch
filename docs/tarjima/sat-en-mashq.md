# SAT matni inglizchaga: 4-PR (Mashq: test, savol banki, lug'at kartalari)

Branch `sat-en-mashq`. Muallif tekshiradi. Faqat mavjud matn tarjima qilingan, yangi da'vo, fakt yoki raqam yo'q. Javob variantlari, `togri`, bankdagi sonlar va `localStorage` kalitlari (`tayanch:sat-javoblar`, `tayanch:sat-lugat`) o'zgarmagan (skript bilan tekshirilgan, pastda).

## Yozuv qoidalari

- Sahifa nomlari yon paneldagidek (`satSahifalar.ts`): Practice test (yon panelda "Test"), Question bank, Vocabulary cards (yon panelda "Vocabulary"). Qavat yo'li: Mashq → Practice, O'qish → Reading.
- Atamalar: Namuna → Sample, Namuna ma'lumot → Sample data, Namuna to'plam → Sample set, Savol → Question, Tekshirish → Check, Keyingi savol → Next question, O'tkazib yuborish → Skip, Keyinroq qaytish → Come back later, Qiyinlik → Difficulty (Hammasi / Oson / O'rta / Qiyin → All / Easy / Medium / Hard), yechilgan → solved, Bilaman → I know it, Hali o'rganyapman → Still learning.
- Mavzu nomlari bankda va savollarda bir xil (bank `?mavzular=` bilan testni filtrlaydi, brauzerda sinalgan). R&W mavzulari tasviriy, rasmiy skill nomi sifatida emas: "Main idea of a text", "Meaning of a word in context", "Structure and purpose of a text", "Conclusions from evidence", "Punctuation", "Connecting sentences".
- Math izohida o'nli nuqta (2-PR qarori): `0,25` → `0.25`.
- Sana: test yangi javobni `November 9` ko'rinishida saqlaydi (oldin `9-noyabr`); namuna javoblar ham shunday. Brauzerda avval saqlangan javoblar eski ko'rinishda qoladi.
- Lug'at kartalari (muallif qarori): `tarjima` o'zbekcha qoldi, ekranda `lang="uz"` bilan; kartaning orqa yuzidagi yorliq "O'zbekcha" → "Uzbek:". `turkum`: sifat → adjective, fe'l → verb. Lug'at kontekstda darsidagi xabar ("I know it" / "Still learning", 3-PR) bilan mos.
- `lang`: sahifa endi `<html lang="en">`, qo'lda qo'yilgan `lang="en"` lar olib tashlandi.

## Ma'lumot (`src/data/satNamuna.ts`)

Avtomatik jadval (eski va yangi fayl maydonma-maydon solishtirilgan). Skript natijasi: `id`, `bolim`, `variantlar`, `togri`, `soz`, `tarjima`, `misol`, `yechilgan`, `jami`, `javob`, `togriJavob` va kalitlarda farq 0.

### savollar

| Kalit | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| m-chiziqli-1 | mavzu | Chiziqli tenglamalar | Linear equations |
| m-chiziqli-1 | matn | Agar 3x + 5 = 20 bo'lsa, x ning qiymati nechaga teng? | If 3x + 5 = 20, what is the value of x? |
| m-chiziqli-1 | izoh | Ikki tomondan 5 ni ayiramiz: 3x = 15. Keyin 3 ga bo'lamiz: x = 5. Tekshirish: 3 · 5 + 5 = 20. | Subtract 5 from both sides: 3x = 15. Then divide by 3: x = 5. Check: 3 · 5 + 5 = 20. |
| m-foiz-1 | mavzu | Foizlar va nisbatlar | Percentages and ratios |
| m-foiz-1 | matn | 80 ning 25 foizi nechaga teng? | What is 25 percent of 80? |
| m-foiz-1 | izoh | 25% = 0,25. 80 · 0,25 = 20. | 25% = 0.25. 80 · 0.25 = 20. |
| m-kvadrat-1 | mavzu | Kvadrat tenglamalar | Quadratic equations |
| m-kvadrat-1 | matn | x² = 49 va x > 0 bo'lsa, x nechaga teng? | If x² = 49 and x > 0, what is x? |
| m-kvadrat-1 | izoh | x² = 49 tenglamaning ildizlari 7 va −7. Shart bo'yicha x > 0, demak x = 7. | The roots of the equation x² = 49 are 7 and −7. The condition says x > 0, so x = 7. |
| m-funksiya-1 | mavzu | Funksiyalar | Functions |
| m-funksiya-1 | matn | f(x) = 2x − 1 bo'lsa, f(4) nechaga teng? | If f(x) = 2x − 1, what is f(4)? |
| m-funksiya-1 | izoh | x o'rniga 4 qo'yamiz: 2 · 4 − 1 = 7. | Substitute 4 for x: 2 · 4 − 1 = 7. |
| rw-tinish-1 | mavzu | Tinish belgilari | Punctuation |
| rw-tinish-1 | matn | Qaysi variant gapni to'g'ri yakunlaydi? "The library opened in ___ has served the town ever since." | Which choice completes the sentence correctly? "The library opened in ___ has served the town ever since." |
| rw-tinish-1 | izoh | Ikki mustaqil gap vergul va "and" bilan bog'lanadi: "1998, and it". Faqat vergul qo'yish (C) xato hisoblanadi. | Two independent clauses are joined with a comma and "and": "1998, and it". Using only a comma (C) is an error. |
| rw-soz-1 | mavzu | So'zning kontekstdagi ma'nosi | Meaning of a word in context |
| rw-soz-1 | matn | Qaysi so'z mantiqan to'g'ri keladi? "The scientist was cautious, refusing to draw conclusions until every result was ___." | Which word fits most logically? "The scientist was cautious, refusing to draw conclusions until every result was ___." |
| rw-soz-1 | izoh | "Cautious" (ehtiyotkor) olim natijalar tekshirilmaguncha xulosa qilmaydi: "verified" — tekshirilgan. | A "cautious" scientist does not draw conclusions until the results are checked: "verified" means checked. |

### kartalar

| Kalit | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| ambiguous | turkum | sifat | adjective |
| concede | turkum | fe'l | verb |
| meticulous | turkum | sifat | adjective |
| undermine | turkum | fe'l | verb |
| plausible | turkum | sifat | adjective |
| scrutinize | turkum | fe'l | verb |

### bankMavzular.rw

| Kalit | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| Matndagi asosiy g'oya | nomi | Matndagi asosiy g'oya | Main idea of a text |
| So'zning kontekstdagi ma'nosi | nomi | So'zning kontekstdagi ma'nosi | Meaning of a word in context |
| Matn tuzilishi va maqsadi | nomi | Matn tuzilishi va maqsadi | Structure and purpose of a text |
| Dalil bilan xulosa | nomi | Dalil bilan xulosa | Conclusions from evidence |
| Tinish belgilari | nomi | Tinish belgilari | Punctuation |
| Gaplarni bog'lash | nomi | Gaplarni bog'lash | Connecting sentences |

### bankMavzular.math

| Kalit | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| Chiziqli tenglamalar | nomi | Chiziqli tenglamalar | Linear equations |
| Foizlar va nisbatlar | nomi | Foizlar va nisbatlar | Percentages and ratios |
| Kvadrat tenglamalar | nomi | Kvadrat tenglamalar | Quadratic equations |
| Funksiyalar | nomi | Funksiyalar | Functions |
| Geometriya | nomi | Geometriya | Geometry |
| Statistika | nomi | Statistika | Statistics |

### namunaJavoblar

| Kalit | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| n1 | mavzu | Chiziqli tenglamalar | Linear equations |
| n1 | sana | 3-noyabr | November 3 |
| n2 | mavzu | Matndagi asosiy g'oya | Main idea of a text |
| n2 | sana | 3-noyabr | November 3 |
| n3 | mavzu | Foizlar | Percentages |
| n3 | sana | 2-noyabr | November 2 |
| n4 | mavzu | Tinish belgilari | Punctuation |
| n4 | sana | 2-noyabr | November 2 |
| n5 | mavzu | Kvadrat tenglamalar | Quadratic equations |
| n5 | sana | 1-noyabr | November 1 |

## Sahifalar (oldin `-`, keyin `+`)

Faqat o'zgargan qatorlar (`git diff -U0`). Kod nomlari, URL, `data-*` qiymatlari va `localStorage` kalitlari o'zgarmagan. Ichki izohlar (`//`) o'zbekcha qoldi.

### test

```diff
-  title="Mashq testi · SAT"
-  description="Reading & Writing va Math bo'yicha qisqa namuna mashq: javobdan keyin darhol izoh."
-  ustki={`${savollar[0].bolim} · Namuna`}
+  title="Practice test · SAT"
+  description="A short sample practice set in Reading & Writing and Math: an explanation right after each answer."
+  ustki={`${savollar[0].bolim} · Sample`}
-  progressNomi="Mashq jarayoni"
-  yol={["Mashq"]}
+  progressNomi="Practice progress"
+  yol={['Practice']}
-    Desmos<span class="sr">(yangi oynada ochiladi)</span>
+    Desmos<span class="sr">(opens in a new tab)</span>
-        <span class="pill" id="savol-raqam">Savol 1</span>
+        <span class="pill" id="savol-raqam">Question 1</span>
-          Keyinroq qaytish
+          Come back later
-      <button type="button" class="matn-tugma" id="otkazish">O'tkazib yuborish</button>
-      <button type="button" class="katta asosiy" id="tekshir" disabled>Tekshirish</button>
-      <button type="button" class="katta qora" id="keyingi" hidden>Keyingi savol</button>
+      <button type="button" class="matn-tugma" id="otkazish">Skip</button>
+      <button type="button" class="katta asosiy" id="tekshir" disabled>Check</button>
+      <button type="button" class="katta qora" id="keyingi" hidden>Next question</button>
-    <p class="pill">To'plam tugadi</p>
-    <h1 id="tugadi-h" tabindex="-1">Namuna to'plam tugadi</h1>
+    <p class="pill">Set complete</p>
+    <h1 id="tugadi-h" tabindex="-1">Sample set complete</h1>
-      <a class="katta asosiy" href={yol('/uz/sat/vosita/natijalar/')}>Natijalarni ko'rish</a>
-      <button type="button" class="katta ikkinchi" id="qayta">Qaytadan boshlash</button>
+      <a class="katta asosiy" href={yol('/uz/sat/vosita/natijalar/')}>See results</a>
+      <button type="button" class="katta ikkinchi" id="qayta">Start over</button>
-  const OYLAR = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
+  const OYLAR = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
-    $('fokus-ustki').textContent = `${s.bolim} · Namuna`;
+    $('fokus-ustki').textContent = `${s.bolim} · Sample`;
-    $('savol-raqam').textContent = `Savol ${i + 1}`;
+    $('savol-raqam').textContent = `Question ${i + 1}`;
-    $('izoh-sarlavha').textContent = togrimi ? `To'g'ri! Javob: ${HARF[s.togri]}` : `Bu safar emas. To'g'ri javob: ${HARF[s.togri]}`;
+    $('izoh-sarlavha').textContent = togrimi ? `Correct! Answer: ${HARF[s.togri]}` : `Not this time. Correct answer: ${HARF[s.togri]}`;
-      sana: `${d.getDate()}-${OYLAR[d.getMonth()]}`,
+      sana: `${OYLAR[d.getMonth()]} ${d.getDate()}`,
-      $('tugadi-matn').textContent = `${toplam.length} ta savoldan ${togrilar} tasiga to'g'ri javob berdingiz. Javoblar "Mening natijalarim" sahifasida, faqat shu brauzerda saqlandi.`;
+      $('tugadi-matn').textContent = `You answered ${togrilar} of ${toplam.length} questions correctly. Your answers are on the "My results" page and were saved only in this browser.`;
```

### bank

```diff
-  title="Savol banki · SAT"
-  description="Mavzuni tanlang va faqat shu mavzudagi savollarni yeching. Har javobdan keyin izoh chiqadi."
+  title="Question bank · SAT"
+  description="Choose a topic and solve questions on that topic only. An explanation appears after each answer."
-  yol={["Mashq"]}
+  yol={['Practice']}
-        <p class="pill-qator"><span class="pill">Mashq</span><span class="pill pill-chiziq">Namuna ma'lumot</span></p>
-        <h1 id="bank-h">Savol banki</h1>
-        <p class="lead">Mavzuni tanlang va faqat shu mavzudagi savollarni yeching. Har javobdan keyin izoh chiqadi.</p>
+        <p class="pill-qator"><span class="pill">Practice</span><span class="pill pill-chiziq">Sample data</span></p>
+        <h1 id="bank-h">Question bank</h1>
+        <p class="lead">Choose a topic and solve questions on that topic only. An explanation appears after each answer.</p>
-        Aralash savollar
+        Mixed questions
-    <section class="filtrlar" aria-label="Filtrlar">
-      <div class="segment" role="tablist" aria-label="Bo'lim">
+    <section class="filtrlar" aria-label="Filters">
+      <div class="segment" role="tablist" aria-label="Section">
-        <span class="qator-nom">Qiyinlik:</span>
-        <button type="button" class="chip" aria-pressed="true" data-qiyinlik="hammasi">Hammasi</button>
-        <button type="button" class="chip" aria-pressed="false" data-qiyinlik="oson">Oson</button>
-        <button type="button" class="chip" aria-pressed="false" data-qiyinlik="orta">O'rta</button>
-        <button type="button" class="chip" aria-pressed="false" data-qiyinlik="qiyin">Qiyin</button>
+        <span class="qator-nom">Difficulty:</span>
+        <button type="button" class="chip" aria-pressed="true" data-qiyinlik="hammasi">All</button>
+        <button type="button" class="chip" aria-pressed="false" data-qiyinlik="oson">Easy</button>
+        <button type="button" class="chip" aria-pressed="false" data-qiyinlik="orta">Medium</button>
+        <button type="button" class="chip" aria-pressed="false" data-qiyinlik="qiyin">Hard</button>
-          Faqat yechilmaganlar
+          Unsolved only
-      <h2 id="mavzu-h" class="ustki-yorliq">Reading &amp; Writing mavzulari</h2>
+      <h2 id="mavzu-h" class="ustki-yorliq">Reading &amp; Writing topics</h2>
-    <section class="tanlov" aria-label="Tanlov" aria-live="polite">
+    <section class="tanlov" aria-label="Selection" aria-live="polite">
-        <p class="ustki-yorliq kok-yorliq">Tanlangan</p>
-        <p class="tanlov-matn" id="tanlov-matn">Mavzu tanlanmagan</p>
-        <p class="tanlov-izoh" id="tanlov-izoh">Yuqoridan bir yoki bir nechta mavzuni bosing.</p>
+        <p class="ustki-yorliq kok-yorliq">Selected</p>
+        <p class="tanlov-matn" id="tanlov-matn">No topic selected</p>
+        <p class="tanlov-izoh" id="tanlov-izoh">Tap one or more topics above.</p>
-      <a class="katta-tugma oq" id="boshlash" href={yol('/uz/sat/mashq/test/')}>Yechishni boshlash</a>
+      <a class="katta-tugma oq" id="boshlash" href={yol('/uz/sat/mashq/test/')}>Start solving</a>
-    <p class="eslatma">Savollar Tayanch uchun alohida tuziladi, boshqa saytlardan ko'chirilmaydi. Mavzular holati namuna: hozircha har mavzuda savollar soni kam.</p>
+    <p class="eslatma">Questions are written separately for Tayanch and are not copied from other sites. The topic progress is sample data: for now, each topic has only a few questions.</p>
-  const QNOMI: Record<string, string> = { hammasi: 'barcha qiyinlikda', oson: 'oson', orta: "o'rta", qiyin: 'qiyin' };
+  const QNOMI: Record<string, string> = { hammasi: 'all levels', oson: 'easy', orta: 'medium', qiyin: 'hard' };
-    tanlangan: { rw: ["Matndagi asosiy g'oya"], math: ['Chiziqli tenglamalar'] } as Record<string, string[]>,
+    tanlangan: { rw: ['Main idea of a text'], math: ['Linear equations'] } as Record<string, string[]>,
-    document.getElementById('mavzu-h')!.textContent = `${s.bolim === 'rw' ? 'Reading & Writing' : 'Math'} mavzulari`;
+    document.getElementById('mavzu-h')!.textContent = `${s.bolim === 'rw' ? 'Reading & Writing' : 'Math'} topics`;
-            <span class="m-izoh"><span>${m.yechilgan} / ${m.jami} yechilgan</span><span>${m.jami - m.yechilgan} ta qoldi</span></span>
+            <span class="m-izoh"><span>${m.yechilgan} / ${m.jami} solved</span><span>${m.jami - m.yechilgan} left</span></span>
-      ? 'Mavzu tanlanmagan'
-      : `${tanlanganData.length} ta mavzu, ${qolgan} ta yechilmagan savol`;
+      ? 'No topic selected'
+      : `${tanlanganData.length} ${tanlanganData.length === 1 ? 'topic' : 'topics'}, ${qolgan} unsolved ${qolgan === 1 ? 'question' : 'questions'}`;
-      ? 'Yuqoridan bir yoki bir nechta mavzuni bosing.'
-      : `Qiyinlik: ${QNOMI[s.qiyinlik]}. ${tanlanganData.map((m) => m.nomi).join(', ')}`;
+      ? 'Tap one or more topics above.'
+      : `Difficulty: ${QNOMI[s.qiyinlik]}. ${tanlanganData.map((m) => m.nomi).join(', ')}`;
```

### lugat

```diff
-  title="Lug'at kartochkalari · SAT"
-  description="Reading & Writing matnlarida uchraydigan so'zlar uchun kartochkalar."
-  ustki="Lug'at · Namuna to'plam"
-  nomi="Reading & Writing so'zlari"
-  progressNomi="To'plam jarayoni"
-  yol={["O'qish"]}
+  title="Vocabulary cards · SAT"
+  description="Cards for words that appear in Reading & Writing texts."
+  ustki="Vocabulary · Sample set"
+  nomi="Reading & Writing words"
+  progressNomi="Set progress"
+  yol={['Reading']}
-  <h1 class="ekranda-yoq">Lug'at kartochkalari</h1>
+  <h1 class="ekranda-yoq">Vocabulary cards</h1>
-          <span class="soz" lang="en" id="soz">{kartalar[0].soz}</span>
+          <span class="soz" id="soz">{kartalar[0].soz}</span>
-          <span class="tarjima" id="tarjima"></span>
-          <span class="misol" lang="en" id="misol"></span>
+          <span class="tarjima" lang="uz" id="tarjima"></span>
+          <span class="misol" id="misol"></span>
-        <span class="maslahat">Ag'darish uchun bosing</span>
+        <span class="maslahat">Tap to flip</span>
-        <button type="button" class="dumaloq" id="oldingi" aria-label="Oldingi karta">
+        <button type="button" class="dumaloq" id="oldingi" aria-label="Previous card">
-        <button type="button" class="tugma-l chiziqli" id="bilmayman">Hali o'rganyapman</button>
-        <button type="button" class="tugma-l kok" id="bilaman">Bilaman</button>
-        <button type="button" class="dumaloq" id="keyingi" aria-label="Keyingi karta">
+        <button type="button" class="tugma-l chiziqli" id="bilmayman">Still learning</button>
+        <button type="button" class="tugma-l kok" id="bilaman">I know it</button>
+        <button type="button" class="dumaloq" id="keyingi" aria-label="Next card">
-    <aside class="holat" aria-label="To'plam holati">
+    <aside class="holat" aria-label="Set status">
-        <p class="ustki-yorliq">Shu to'plamda</p>
+        <p class="ustki-yorliq">In this set</p>
-          <div class="son kok-son"><span class="raqam" id="bilgan-soni">0</span><span>Bilaman</span></div>
-          <div class="son chiziq-son"><span class="raqam" id="organ-soni">0</span><span>O'rganyapman</span></div>
+          <div class="son kok-son"><span class="raqam" id="bilgan-soni">0</span><span>I know it</span></div>
+          <div class="son chiziq-son"><span class="raqam" id="organ-soni">0</span><span>Still learning</span></div>
-        <p class="ustki-yorliq">So'zlar</p>
+        <p class="ustki-yorliq">Words</p>
-                <span lang="en">{k.soz}</span>
+                <span>{k.soz}</span>
-        Bilmaganimga o'tish
+        Go to a word I don't know
-    $('yuz-yorliq').textContent = orqa ? "O'zbekcha" : 'English';
+    $('yuz-yorliq').textContent = orqa ? 'Uzbek:' : 'English';
-      s.textContent = h === 'bilaman' ? 'bilaman' : h === 'organ' ? "o'rganyapman" : '—';
+      s.textContent = h === 'bilaman' ? 'I know it' : h === 'organ' ? 'still learning' : '—';
```

## Ta'sir va ochiq joylar

- Natijalar sahifasi (`/uz/sat/vosita/natijalar/`, 5-PR): namuna qatorlari endi inglizcha (`namunaJavoblar`), sahifa ramkasi va "javobingiz … to'g'risi …" yozuvi hali o'zbekcha. Build'da bu sahifaning HTML farqi faqat `namuna-data` JSON'ida.
- Brauzerda avval saqlangan javoblardagi o'zbekcha mavzu nomi (masalan "Chiziqli tenglamalar") Natijalar'dagi "qayta yechish" havolasida yangi savollarga mos kelmaydi; test u holda hamma savollarni ko'rsatadi (filtr bo'sh bo'lsa shunday ishlaydi).
- PR #17 (`sat-mashq-oynatgich`, ochiq) `src/data/satNamuna.ts`, `mashq/test` va `mashq/bank` sahifalariga tegadi: merge qilinsa konflikt bo'lishi kutiladi, ulardan biri ikkinchisiga moslab qayta yozilishi kerak.
