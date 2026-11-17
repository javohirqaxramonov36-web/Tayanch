# SAT matni inglizchaga: 5-PR (vositalar)

Branch `sat-en-vosita`. Muallif tekshiradi. Faqat mavjud matn tarjima qilingan, yangi da'vo, fakt yoki raqam yo'q. `localStorage` kalitlari (`tayanch:sat-reja`, `tayanch:sat-takrorlash`, `tayanch:sat-xato-daftari`, `tayanch:sat-dars-progress`, `tayanch:sat-javoblar`) va saqlanadigan ma'lumot shakli o'zgarmagan. `src/lib/takrorlash.ts` da ekranga chiqadigan matn yo'q, unga tegilmagan.

## Yozuv qoidalari

- Sahifa nomlari yon paneldagidek (`satSahifalar.ts`): My results, Study planner, Mistake log: review. Qavat yo'li: Mashq → Practice. Yorliqlar: Vosita → Tool, Qoralama → Draft, Namuna ma'lumot → Sample data.
- ® / ™ joylari saqlangan (PR #32): h1 "SAT® reja tuzgich" → "SAT® Study Planner"; "Bluebook™ ilovasida" → "in the Bluebook™ app".
- Sana: `9-noyabr` → `November 9` (Reja, Takrorlash; test 4-PR'dan beri shunday saqlaydi).
- Takrorlash: Leitner atamalari quti → box, o'zlashtirildi → Mastered; qiyinlik yorlig'i (`oson` kabi xom qiymat edi) endi `umumiyMatn.en.dars.qiyinlik` dan (easy / medium / hard), darslardagidek. R&W savol matni endi hammasi inglizcha bo'lgani uchun `matnTili` / `variantTili` (`lang="en"`) olib tashlandi. Ko'rsatmalar dars sahifalaridagi `savolKorsatma` bilan bir xil.
- Reja bosqichlari: Diagnostika / Asos / Mashq / Oxirgi hafta → Diagnostic / Foundation / Practice / Final week (bosqich nomi saqlanmaydi, har safar hisoblanadi).
- `src/data/satDarslar/turlar.ts` `modulNomi` (faqat SAT): yon paneldagi nomlar. IELTS va Top Admission `turlar.ts` ga tegilmagan.

## `modulNomi` (`src/data/satDarslar/turlar.ts`)

| Modul | Oldin | Keyin |
| --- | --- | --- |
| `hajm` | Hajm laboratoriyasi | Volume lab |
| `grafik` | Funksiya grafigi | Function graphs |
| `aylana` | Birlik aylana | Unit circle |
| `statistika` | Statistika | Statistics |
| `rw-xato` | Xatoni toping | Find the error |
| `rw-dalil` | Dalilni belgilang | Mark the evidence |
| `rw-otish` | O'tish so'zlari | Transition words |
| `rw-lugat` | Lug'at kontekstda | Vocabulary in context |

## Sahifalar (oldin `-`, keyin `+`)

Faqat o'zgargan qatorlar (`git diff -U0`). Kod nomlari, URL, `data-*` qiymatlari va `localStorage` kalitlari o'zgarmagan. Ichki izohlar (`//`) o'zbekcha qoldi.

### natijalar

```diff
-  title="Mening natijalarim · SAT"
-  description="Mashqlardagi javoblaringiz va xatolaringiz. Ma'lumot faqat shu brauzerda saqlanadi. Ball hisoblanmaydi."
+  title="My results · SAT"
+  description="Your answers and mistakes in practice. The data is saved only in this browser. No score is calculated."
-  yol={["Mashq"]}
+  yol={['Practice']}
-      <p class="pill-qator"><span class="pill">Vosita</span><span class="pill pill-chiziq" id="namuna-pill">Namuna ma'lumot</span></p>
-      <h1 id="nat-h">Mening natijalarim</h1>
-      <p class="lead">Mashqlardagi javoblaringiz va xatolaringiz. Ma'lumot faqat shu brauzerda saqlanadi, hech qayerga yuborilmaydi. Ball hisoblanmaydi: bu SAT balli emas.</p>
-      <p class="namuna-izoh" id="namuna-izoh">Siz hali mashq yechmagansiz, shuning uchun pastda namuna ko'rsatilgan. <a href={yol('/uz/sat/mashq/test/')}>Mashq testini boshlang</a>, javoblaringiz shu yerda chiqadi.</p>
+      <p class="pill-qator"><span class="pill">Tool</span><span class="pill pill-chiziq" id="namuna-pill">Sample data</span></p>
+      <h1 id="nat-h">My results</h1>
+      <p class="lead">Your answers and mistakes in practice. The data is saved only in this browser and is not sent anywhere. No score is calculated: this is not an SAT score.</p>
+      <p class="namuna-izoh" id="namuna-izoh">You have not solved any practice questions yet, so a sample is shown below. <a href={yol('/uz/sat/mashq/test/')}>Start the practice test</a>, and your answers will appear here.</p>
-    <section class="korsatkich" aria-label="Umumiy ko'rsatkichlar">
+    <section class="korsatkich" aria-label="Summary">
-        <p class="ustki-yorliq kok-yorliq">Bo'limlar bo'yicha</p>
+        <p class="ustki-yorliq kok-yorliq">By section</p>
-        <p class="kb-nom">Takrorlash kerak</p>
+        <p class="kb-nom">Needs review</p>
-        <p class="kb-izoh">xato javob</p>
-        <a href={yol('/uz/sat/mashq/test/')}>Xatolarni qayta ishlash</a>
+        <p class="kb-izoh">wrong answers</p>
+        <a href={yol('/uz/sat/mashq/test/')}>Work on mistakes</a>
-        <h2 id="royxat-h">Javoblar tarixi</h2>
-        <div class="segment" role="group" aria-label="Filtr">
-          <button type="button" aria-pressed="true" data-filtr="hammasi">Hammasi <span class="soni"></span></button>
-          <button type="button" aria-pressed="false" data-filtr="xato">Xatolar <span class="soni"></span></button>
-          <button type="button" aria-pressed="false" data-filtr="togri">To'g'ri <span class="soni"></span></button>
+        <h2 id="royxat-h">Answer history</h2>
+        <div class="segment" role="group" aria-label="Filter">
+          <button type="button" aria-pressed="true" data-filtr="hammasi">All <span class="soni"></span></button>
+          <button type="button" aria-pressed="false" data-filtr="xato">Mistakes <span class="soni"></span></button>
+          <button type="button" aria-pressed="false" data-filtr="togri">Correct <span class="soni"></span></button>
-      <p class="bosh-holat" id="bosh-holat" hidden>Bu filtrda javob yo'q.</p>
+      <p class="bosh-holat" id="bosh-holat" hidden>No answers for this filter.</p>
-    <section class="malumot" aria-label="Ma'lumot">
+    <section class="malumot" aria-label="Data">
-        <p class="m-sarlavha">Ma'lumot faqat shu brauzerda</p>
-        <p class="m-matn">Boshqa qurilma yoki brauzerda bu ro'yxat ko'rinmaydi. O'chirsangiz, qaytarib bo'lmaydi.</p>
+        <p class="m-sarlavha">Data stays in this browser</p>
+        <p class="m-matn">This list is not visible on another device or browser. If you delete it, it cannot be restored.</p>
-      <button type="button" class="chiziq-tugma" id="ochirish">Natijalarni o'chirish</button>
+      <button type="button" class="chiziq-tugma" id="ochirish">Delete results</button>
-      <h2 id="ochirish-sarlavha">Natijalarni o'chirasizmi?</h2>
-      <p>Shu brauzerdagi mashq javoblaringiz o'chadi. Buni qaytarib bo'lmaydi.</p>
+      <h2 id="ochirish-sarlavha">Delete your results?</h2>
+      <p>Your practice answers in this browser will be deleted. This cannot be undone.</p>
-        <button type="submit" value="bekor" class="chiziq-tugma" autofocus>Bekor qilish</button>
-        <button type="submit" value="ochir" class="asosiy-tugma">Ha, o'chirish</button>
+        <button type="submit" value="bekor" class="chiziq-tugma" autofocus>Cancel</button>
+        <button type="submit" value="ochir" class="asosiy-tugma">Yes, delete</button>
-      q.querySelector('.bq-son')!.textContent = `${t} / ${b.length} to'g'ri`;
+      q.querySelector('.bq-son')!.textContent = `${t} / ${b.length} correct`;
-        <span class="q-belgi ${q.togri ? 'togri' : 'xato'}" role="img" aria-label="${q.togri ? "To'g'ri" : 'Xato'}">
+        <span class="q-belgi ${q.togri ? 'togri' : 'xato'}" role="img" aria-label="${q.togri ? 'Correct' : 'Wrong'}">
-      li.querySelector('.q-izoh')!.textContent = `${q.bolim} · ${q.sana} · javobingiz ${q.javob}, to'g'risi ${q.togriJavob}`;
+      li.querySelector('.q-izoh')!.textContent = `${q.bolim} · ${q.sana} · your answer ${q.javob}, correct ${q.togriJavob}`;
-        a.textContent = 'Qayta yechish';
+        a.textContent = 'Solve again';
-      document.getElementById('ochirish-xabar')!.textContent = "Natijalar o'chirildi.";
+      document.getElementById('ochirish-xabar')!.textContent = 'Results deleted.';
```

### reja

```diff
-  title="Reja tuzgich · SAT"
-  description="SAT tayyorgarligi uchun haftalik reja: imtihon sanasi va maqsad balldan checklist. Ma'lumot faqat shu brauzerda. Ball kafolatlanmaydi."
+  title="Study planner · SAT"
+  description="A weekly plan for SAT preparation: a checklist from your test date and target score. The data stays only in this browser. No score is guaranteed."
-  yol={['Mashq']}
+  yol={['Practice']}
-      <p class="pill-qator"><span class="ustki-kok">Vosita</span><span class="pill pill-chiziq">Qoralama</span></p>
-      <h1>SAT® reja tuzgich</h1>
-      <p class="lead">Imtihon sanasi va maqsad ballingizni kiriting: vosita qolgan haftalarni bosqichlarga bo'lib, har haftaga bajariladigan ro'yxat tuzadi. Belgilaringiz shu brauzerda saqlanadi.</p>
+      <p class="pill-qator"><span class="ustki-kok">Tool</span><span class="pill pill-chiziq">Draft</span></p>
+      <h1>SAT® Study Planner</h1>
+      <p class="lead">Enter your test date and target score: the tool divides the remaining weeks into stages and makes a to-do list for each week. Your check marks are saved in this browser.</p>
-    <p class="ogoh" role="note"><b>Ball kafolatlanmaydi.</b> Bu reja tayyorgarlikni tartibga soladi, natijani bashorat qilmaydi. Haftalik vazifalar Tayanch tavsiyasi, rasmiy reja emas.</p>
+    <p class="ogoh" role="note"><b>No score is guaranteed.</b> This plan organizes your preparation; it does not predict your result. The weekly tasks are a Tayanch recommendation, not an official plan.</p>
-        <label for="r-sana">Imtihon sanasi</label>
+        <label for="r-sana">Test date</label>
-        <p class="kichik ikkinchi">Sanani o'zingiz kiriting. Rasmiy sanalar ro'yxati: College Board sayti.</p>
+        <p class="kichik ikkinchi">Enter the date yourself. The official list of dates is on the College Board website.</p>
-          <label for="r-hozirgi">Hozirgi ball (ixtiyoriy)</label>
-          <input type="number" id="r-hozirgi" inputmode="numeric" min="400" max="1600" step="10" placeholder="masalan, 1150" />
+          <label for="r-hozirgi">Current score (optional)</label>
+          <input type="number" id="r-hozirgi" inputmode="numeric" min="400" max="1600" step="10" placeholder="for example, 1150" />
-          <label for="r-maqsad">Maqsad ball</label>
-          <input type="number" id="r-maqsad" inputmode="numeric" min="400" max="1600" step="10" required placeholder="masalan, 1350" />
+          <label for="r-maqsad">Target score</label>
+          <input type="number" id="r-maqsad" inputmode="numeric" min="400" max="1600" step="10" required placeholder="for example, 1350" />
-      <p class="kichik ikkinchi">SAT umumiy ball oralig'i: 400–1600 (College Board, CB04).</p>
+      <p class="kichik ikkinchi">SAT total score range: 400–1600 (College Board, CB04).</p>
-        <legend>Haftada necha kun shug'ullanasiz</legend>
+        <legend>How many days a week you study</legend>
-          {[3, 4, 5, 6].map((k) => <button type="button" data-kun={k} aria-pressed={k === 4 ? 'true' : 'false'}>{k} kun</button>)}
+          {[3, 4, 5, 6].map((k) => <button type="button" data-kun={k} aria-pressed={k === 4 ? 'true' : 'false'}>{k} days</button>)}
-        <legend>Ko'proq e'tibor</legend>
+        <legend>More focus on</legend>
-          <button type="button" data-fokus="teng" aria-pressed="true">Teng</button>
+          <button type="button" data-fokus="teng" aria-pressed="true">Both equally</button>
-        <button type="submit" class="katta asosiy">Reja tuzish</button>
-        <span class="tasdiq" id="qayta-tasdiq" hidden>Yangi reja eski belgilarni o'chiradi.
-          <button type="button" class="matn-tugma" id="qayta-ha">Davom etish</button>
-          <button type="button" class="matn-tugma" id="qayta-yoq">Bekor qilish</button>
+        <button type="submit" class="katta asosiy">Make a plan</button>
+        <span class="tasdiq" id="qayta-tasdiq" hidden>A new plan deletes your old check marks.
+          <button type="button" class="matn-tugma" id="qayta-ha">Continue</button>
+          <button type="button" class="matn-tugma" id="qayta-yoq">Cancel</button>
-        <h2 id="natija-h" tabindex="-1">Sizning rejangiz</h2>
+        <h2 id="natija-h" tabindex="-1">Your plan</h2>
-          <p class="kichik"><span id="bajarildi">0</span> / <span id="jami">0</span> vazifa bajarildi</p>
+          <p class="kichik"><span id="bajarildi">0</span> / <span id="jami">0</span> tasks done</p>
-        <button type="button" class="matn-tugma" id="ochir">Rejani o'chirish</button>
-        <span class="tasdiq" id="ochir-tasdiq" hidden>O'chirilsinmi?
-          <button type="button" class="matn-tugma" id="ochir-ha">Ha, o'chirish</button>
-          <button type="button" class="matn-tugma" id="ochir-yoq">Bekor qilish</button>
+        <button type="button" class="matn-tugma" id="ochir">Delete plan</button>
+        <span class="tasdiq" id="ochir-tasdiq" hidden>Delete it?
+          <button type="button" class="matn-tugma" id="ochir-ha">Yes, delete</button>
+          <button type="button" class="matn-tugma" id="ochir-yoq">Cancel</button>
-      <p class="kichik ikkinchi" id="saqlash-holat">Reja faqat shu brauzerda saqlanadi.</p>
+      <p class="kichik ikkinchi" id="saqlash-holat">The plan is saved only in this browser.</p>
-        "Haftalik vazifalar va bosqichlar Tayanch tavsiyasi, rasmiy reja emas.",
-        "Ball qadami (10) rasmiy sahifada yozilmagan: maydonda qulaylik uchun olingan.",
-        "Imtihon sanalari bu sahifada berilmaydi: rasmiy ro'yxat College Board saytida.",
+        'The weekly tasks and stages are a Tayanch recommendation, not an official plan.',
+        'The score step (10) is not stated on the official page: it is used in the field for convenience.',
+        'Test dates are not given on this page: the official list is on the College Board website.',
-  const OYLAR = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
+  const OYLAR = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
-  const sanaMatn = (t: number) => { const d = new Date(t); return `${d.getUTCDate()}-${OYLAR[d.getUTCMonth()]}`; };
+  const sanaMatn = (t: number) => { const d = new Date(t); return `${OYLAR[d.getUTCMonth()]} ${d.getUTCDate()}`; };
-      { matn: 'Hajm darsini o\'ting va 6 ta mashqni yeching', havola: H.hajm, havolaMatn: 'Hajm laboratoriyasi' },
-      { matn: 'Funksiya grafigi darsini o\'ting va 5 ta mashqni yeching', havola: H.grafik, havolaMatn: 'Funksiya grafigi' },
-      { matn: 'Birlik aylana darsini o\'ting va 5 ta mashqni yeching', havola: H.aylana, havolaMatn: 'Birlik aylana' },
-      { matn: 'Statistika darsini o\'ting va 5 ta mashqni yeching', havola: H.statistika, havolaMatn: 'Statistika' },
+      { matn: 'Complete the Volume lesson and solve its 6 exercises', havola: H.hajm, havolaMatn: 'Volume lab' },
+      { matn: 'Complete the Function graphs lesson and solve its 5 exercises', havola: H.grafik, havolaMatn: 'Function graphs' },
+      { matn: 'Complete the Unit circle lesson and solve its 5 exercises', havola: H.aylana, havolaMatn: 'Unit circle' },
+      { matn: 'Complete the Statistics lesson and solve its 5 exercises', havola: H.statistika, havolaMatn: 'Statistics' },
-    const mathMashq: Vazifa = { matn: "Savol bankidan Math savollari: zaif mavzu bo'yicha bitta to'plam", havola: H.bank, havolaMatn: 'Savol banki' };
+    const mathMashq: Vazifa = { matn: 'Math questions from the question bank: one set on a weak topic', havola: H.bank, havolaMatn: 'Question bank' };
-      { matn: "Savol bankidan Reading and Writing savollari: bitta to'plam", havola: H.bank, havolaMatn: 'Savol banki' },
-      { matn: "Lug'at kartochkalari: 20 ta so'z", havola: H.lugat, havolaMatn: "Lug'at" },
+      { matn: 'Reading and Writing questions from the question bank: one set', havola: H.bank, havolaMatn: 'Question bank' },
+      { matn: 'Vocabulary cards: 20 words', havola: H.lugat, havolaMatn: 'Vocabulary' },
-    const xatoDaftar: Vazifa = { matn: 'Xato daftaridagi bugungi savollarni takrorlang', havola: H.takrorlash, havolaMatn: 'Takrorlash' };
-    const mock: Vazifa = { matn: "Bluebook™ ilovasida to'liq practice test ishlang (CB01) va xatolarni yozib chiqing" };
+    const xatoDaftar: Vazifa = { matn: "Review today's questions in the mistake log", havola: H.takrorlash, havolaMatn: 'Review' };
+    const mock: Vazifa = { matn: 'Take a full practice test in the Bluebook™ app (CB01) and write down your mistakes' };
-        bosqich = 'Diagnostika';
-        v.push(mock, { matn: "Xatolarni Math va Reading and Writing bo'yicha ajrating, eng ko'p xato qilingan 3 mavzuni yozing" });
+        bosqich = 'Diagnostic';
+        v.push(mock, { matn: 'Sort your mistakes into Math and Reading and Writing, and write down the 3 topics with the most mistakes' });
-        bosqich = 'Oxirgi hafta';
-        v.push(xatoDaftar, { matn: 'Yengil takrorlash: yangi mavzu boshlamang' }, { matn: "Imtihon kuni talablari va kerakli hujjatlarni College Board saytidan tekshiring" });
+        bosqich = 'Final week';
+        v.push(xatoDaftar, { matn: 'Light review: do not start a new topic' }, { matn: 'Check the test day requirements and the documents you need on the College Board website' });
-        bosqich = 'Asos';
+        bosqich = 'Foundation';
-        bosqich = 'Mashq';
+        bosqich = 'Practice';
-          if (t < mathSoni) v.push(bosqich === 'Asos' && mathI < math.length ? math[mathI++] : mathMashq);
+          if (t < mathSoni) v.push(bosqich === 'Foundation' && mathI < math.length ? math[mathI++] : mathMashq);
-      ['Imtihon', sanaMatn(sanaUTC(r.sana))],
-      ['Qolgan hafta', String(Math.max(0, qolganHafta))],
-      ['Maqsad ball', String(r.maqsad)],
+      ['Test date', sanaMatn(sanaUTC(r.sana))],
+      ['Weeks left', String(Math.max(0, qolganHafta))],
+      ['Target score', String(r.maqsad)],
-    if (r.hozirgi) qator.push(['Farq', `${r.maqsad - r.hozirgi >= 0 ? '+' : '−'}${Math.abs(r.maqsad - r.hozirgi)} ball`]);
+    if (r.hozirgi) qator.push(['Difference', `${r.maqsad - r.hozirgi >= 0 ? '+' : '−'}${Math.abs(r.maqsad - r.hozirgi)} points`]);
-    uzoq.textContent = `Imtihongacha ${qolganHafta} hafta: reja birinchi ${MAKS_HAFTA} haftaga tuzildi. Tugagach, rejani qayta tuzing.`;
+    uzoq.textContent = `${qolganHafta} weeks until the test: the plan covers the first ${MAKS_HAFTA} weeks. When they are over, make a new plan.`;
-      const nom = document.createElement('span'); nom.className = 'h-nom'; nom.textContent = `${k + 1}-hafta · ${sanaMatn(h.boshi)} – ${sanaMatn(oxiri)}`;
+      const nom = document.createElement('span'); nom.className = 'h-nom'; nom.textContent = `Week ${k + 1} · ${sanaMatn(h.boshi)} – ${sanaMatn(oxiri)}`;
-        if (v.havola) { const a = document.createElement('a'); a.href = v.havola; a.className = 'v-havola'; a.textContent = v.havolaMatn ?? 'Ochish'; li2.append(a); }
+        if (v.havola) { const a = document.createElement('a'); a.href = v.havola; a.className = 'v-havola'; a.textContent = v.havolaMatn ?? 'Open'; li2.append(a); }
-    $('saqlash-holat').textContent = ok ? 'Reja faqat shu brauzerda saqlanadi.' : "Brauzer saqlashga ruxsat bermadi: reja sahifa yopilganda yo'qoladi.";
+    $('saqlash-holat').textContent = ok ? 'The plan is saved only in this browser.' : 'The browser did not allow saving: the plan will be lost when the page is closed.';
-    if (!sana) { xato('Imtihon sanasini kiriting.'); $('r-sana').focus(); return null; }
-    if (sanaUTC(sana) <= sanaUTC(bugun())) { xato("Imtihon sanasi bugundan keyin bo'lishi kerak."); $('r-sana').focus(); return null; }
-    if (!Number.isFinite(maqsad) || maqsad < 400 || maqsad > 1600) { xato("Maqsad ballni 400 dan 1600 gacha kiriting."); $('r-maqsad').focus(); return null; }
+    if (!sana) { xato('Enter the test date.'); $('r-sana').focus(); return null; }
+    if (sanaUTC(sana) <= sanaUTC(bugun())) { xato('The test date must be after today.'); $('r-sana').focus(); return null; }
+    if (!Number.isFinite(maqsad) || maqsad < 400 || maqsad > 1600) { xato('Enter a target score from 400 to 1600.'); $('r-maqsad').focus(); return null; }
-      if (!Number.isFinite(hozirgi) || hozirgi < 400 || hozirgi > 1600) { xato("Hozirgi ballni 400 dan 1600 gacha kiriting yoki bo'sh qoldiring."); $('r-hozirgi').focus(); return null; }
+      if (!Number.isFinite(hozirgi) || hozirgi < 400 || hozirgi > 1600) { xato('Enter a current score from 400 to 1600, or leave it blank.'); $('r-hozirgi').focus(); return null; }
```

### takrorlash

```diff
+import { matn as umumiyMatn } from '../../../../../data/umumiyMatn';
+
+const T = umumiyMatn.en.dars;
-  'rw-xato': "Gapdagi xatoni to'g'ri tuzatadigan variantni tanlang.",
-  'rw-otish': "Bo'sh joyga eng mantiqiy o'tish so'zini tanlang.",
-  'rw-lugat': "Gapni o'qing va eng mantiqiy, aniq so'z yoki ma'noni tanlang.",
+  'rw-xato': 'Choose the option that correctly fixes the error in the sentence.',
+  'rw-otish': 'Choose the most logical transition word for the blank.',
+  'rw-lugat': 'Read the sentence and choose the most logical and precise word or meaning.',
-    const rw = s.modul.startsWith('rw-');
-      id: s.id, modul: s.modul, mavzu: s.mavzu, qiyinlik: s.qiyinlik, verified: s.verified,
+      id: s.id, modul: s.modul, mavzu: s.mavzu, qiyinlik: T.qiyinlik[s.qiyinlik], verified: s.verified,
-      // R&W: variantlar inglizcha; savol matni "Dalil" darsida o'zbekcha, qolganida inglizcha
-      matnTili: rw && s.belgilash?.tur !== 'gap' ? 'en' : '',
-      variantTili: rw ? 'en' : '',
-  title="Xato daftari: takrorlash · SAT"
-  description="SAT darslarida xato qilingan mashqlarni oraliqli takrorlash: 1, 3, 7 va 14 kundan keyin. Ma'lumot faqat shu brauzerda. Ball hisoblanmaydi."
+  title="Mistake log: review · SAT"
+  description="Spaced review of the exercises you got wrong in the SAT lessons: after 1, 3, 7 and 14 days. The data stays only in this browser. No score is calculated."
-  yol={['Mashq']}
+  yol={['Practice']}
-      <p class="pill-qator"><span class="ustki-kok">Vosita</span><span class="pill pill-chiziq">Qoralama</span></p>
-      <h1>Xato daftari: takrorlash</h1>
-      <p class="lead">Darslarda xato qilingan mashqlar shu yerga tushadi va oraliq bilan qaytadi: ertaga, keyin 3, 7 va 14 kundan so'ng. To'g'ri yechsangiz keyingi qutiga o'tadi, xato qilsangiz boshiga qaytadi.</p>
+      <p class="pill-qator"><span class="ustki-kok">Tool</span><span class="pill pill-chiziq">Draft</span></p>
+      <h1>Mistake log: review</h1>
+      <p class="lead">Exercises you got wrong in the lessons land here and come back at intervals: tomorrow, then after 3, 7 and 14 days. Solve one correctly and it moves to the next box; get it wrong and it goes back to the start.</p>
-    <p class="kichik ikkinchi">Tayanch uchun yozilgan namuna savollar, rasmiy SAT savoli emas. Ball hisoblanmaydi. Oraliqlar Tayanch tanlovi.</p>
+    <p class="kichik ikkinchi">Sample questions written for Tayanch, not official SAT questions. No score is calculated. The intervals are Tayanch's choice.</p>
-      <h2 id="royxat-h" tabindex="-1">Bugungi takrorlash</h2>
+      <h2 id="royxat-h" tabindex="-1">Today's review</h2>
-        <div><dt>Bugun</dt><dd id="son-bugun">0</dd></div>
-        <div><dt>Keyinroq</dt><dd id="son-keyin">0</dd></div>
-        <div><dt>O'zlashtirildi</dt><dd id="son-ozl">0</dd></div>
+        <div><dt>Today</dt><dd id="son-bugun">0</dd></div>
+        <div><dt>Later</dt><dd id="son-keyin">0</dd></div>
+        <div><dt>Mastered</dt><dd id="son-ozl">0</dd></div>
-        <button type="button" class="katta asosiy" id="boshla" hidden>Takrorlashni boshlash</button>
-        <button type="button" class="katta ikkinchi" id="oldin" hidden>Keyingilarini hozir takrorlash</button>
+        <button type="button" class="katta asosiy" id="boshla" hidden>Start review</button>
+        <button type="button" class="katta ikkinchi" id="oldin" hidden>Review upcoming ones now</button>
-        <h3>Darslar</h3>
+        <h3>Lessons</h3>
-        <summary>Keyinroq takrorlanadi (<span id="g-keyin-son">0</span>)</summary>
+        <summary>Review later (<span id="g-keyin-son">0</span>)</summary>
-        <summary>O'zlashtirildi (<span id="g-ozl-son">0</span>)</summary>
+        <summary>Mastered (<span id="g-ozl-son">0</span>)</summary>
-        <h2 id="sessiya-h">Takrorlash</h2>
+        <h2 id="sessiya-h">Review</h2>
-            <p><b>Yechim.</b> <span id="izoh-yechim"></span></p>
+            <p><b>Solution.</b> <span id="izoh-yechim"></span></p>
-            <a class="matn-tugma kok-tugma" id="s-dars" href="#">Darsga o'tish</a>
-            <button type="submit" class="katta asosiy" id="tekshir" disabled>Tekshirish</button>
-            <button type="button" class="katta qora" id="keyingi" hidden>Keyingisi</button>
+            <a class="matn-tugma kok-tugma" id="s-dars" href="#">Go to the lesson</a>
+            <button type="submit" class="katta asosiy" id="tekshir" disabled>Check</button>
+            <button type="button" class="katta qora" id="keyingi" hidden>Next</button>
-        <button type="button" class="katta asosiy" id="qaytish">Ro'yxatga qaytish</button>
+        <button type="button" class="katta asosiy" id="qaytish">Back to the list</button>
-      <button type="button" class="matn-tugma" id="toxtat">Takrorlashni to'xtatish</button>
+      <button type="button" class="matn-tugma" id="toxtat">Stop review</button>
-      <button type="button" class="matn-tugma" id="tozala">Takrorlash tarixini o'chirish</button>
-      <span class="tasdiq" id="tasdiq" hidden>Qutilar va sanalar o'chirilsinmi? Darslardagi xato daftari qoladi.
-        <button type="button" class="matn-tugma" id="tasdiq-ha">Ha, o'chirish</button>
-        <button type="button" class="matn-tugma" id="tasdiq-yoq">Bekor qilish</button>
+      <button type="button" class="matn-tugma" id="tozala">Delete review history</button>
+      <span class="tasdiq" id="tasdiq" hidden>Delete the boxes and dates? The mistake log in the lessons stays.
+        <button type="button" class="matn-tugma" id="tasdiq-ha">Yes, delete</button>
+        <button type="button" class="matn-tugma" id="tasdiq-yoq">Cancel</button>
-      <p class="kichik ikkinchi" id="saqlash-holat" aria-live="polite">Takrorlash holati faqat shu brauzerda saqlanadi.</p>
+      <p class="kichik ikkinchi" id="saqlash-holat" aria-live="polite">Review progress is saved only in this browser.</p>
-        "Takrorlash oraliqlari (1, 3, 7, 14 kun) Tayanch tanlovi, rasmiy tavsiya emas.",
-        "Savollar Tayanch uchun yozilgan namuna; muallif tekshirmaganlari \"tekshirilmagan\" yorlig'i bilan.",
-        "\"Xatoni toping\" savollarida xato joyini belgilash bosqichi bu sahifada yo'q: faqat tuzatish tanlanadi.",
+        "The review intervals (1, 3, 7, 14 days) are Tayanch's choice, not an official recommendation.",
+        'The questions are samples written for Tayanch; those not yet reviewed by the author are labeled "not verified".',
+        "On this page, \"Find the error\" questions have no step for marking the error's location: only the revision is chosen.",
-    matnTili: string; variantTili: string; korsatma: string;
+    korsatma: string;
-  const OYLAR = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
+  const OYLAR = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
-  const sanaMatn = (s: string) => { const [, m, d] = s.split('-').map(Number); return `${d}-${OYLAR[m - 1]}`; };
+  const sanaMatn = (s: string) => { const [, m, d] = s.split('-').map(Number); return `${OYLAR[m - 1]} ${d}`; };
-      ? 'Takrorlash holati faqat shu brauzerda saqlanadi.'
-      : "Brauzer saqlashga ruxsat bermadi: takrorlash holati sahifa yopilganda yo'qoladi.";
+      ? 'Review progress is saved only in this browser.'
+      : 'The browser did not allow saving: review progress will be lost when the page is closed.';
-      ? "Xato daftari bo'sh. Darslarda xato qilingan mashqlar shu yerga tushadi va ertasi kuni takrorlanadi."
+      ? 'The mistake log is empty. Exercises you get wrong in the lessons land here and are reviewed the next day.'
-        ? `Bugun ${g.bugun.length} ta mashqni takrorlash kerak.`
+        ? `Today you have ${g.bugun.length} ${g.bugun.length === 1 ? 'exercise' : 'exercises'} to review.`
-          ? `Bugun takrorlanadigan mashq yo'q. Keyingisi: ${sanaMatn(holat.savollar[g.keyinroq[0]].keyingi)}.`
-          : "Hamma xatolar o'zlashtirildi. Yangi xatolar darslardan tushadi.";
+          ? `Nothing to review today. Next: ${sanaMatn(holat.savollar[g.keyinroq[0]].keyingi)}.`
+          : 'All mistakes are mastered. New mistakes will come from the lessons.';
-    $<HTMLButtonElement>('boshla').textContent = `Takrorlashni boshlash (${g.bugun.length})`;
+    $<HTMLButtonElement>('boshla').textContent = `Start review (${g.bugun.length})`;
-    $('s-legend').textContent = `${joriy + 1}-savol, jami ${navbat.length}`;
+    $('s-legend').textContent = `Question ${joriy + 1} of ${navbat.length}`;
-    meta.replaceChildren(pill('Namuna'), pill(s.qiyinlik), mavzu, ...(s.verified ? [] : [pill('tekshirilmagan', 'pill pill-ogoh')]));
+    meta.replaceChildren(pill('Sample'), pill(s.qiyinlik), mavzu, ...(s.verified ? [] : [pill('not verified', 'pill pill-ogoh')]));
-    if (s.matnTili) matn.lang = s.matnTili; else matn.removeAttribute('lang');
-      if (s.variantTili) m.lang = s.variantTili;
-    $<HTMLButtonElement>('keyingi').textContent = joriy < navbat.length - 1 ? 'Keyingisi' : 'Yakunlash';
+    $<HTMLButtonElement>('keyingi').textContent = joriy < navbat.length - 1 ? 'Next' : 'Finish';
-    $('izoh-sarlavha').textContent = togrimi ? "To'g'ri." : `Xato. To'g'ri javob: ${HARF[s.togri]}) ${s.variantlar[s.togri]}`;
-    $('izoh-xato').textContent = !togrimi && s.xatolar[j] ? `Tipik xato: ${s.xatolar[j]}.` : '';
+    $('izoh-sarlavha').textContent = togrimi ? 'Correct.' : `Wrong. The correct answer: ${HARF[s.togri]}) ${s.variantlar[s.togri]}`;
+    $('izoh-xato').textContent = !togrimi && s.xatolar[j] ? `Typical mistake: ${s.xatolar[j]}.` : '';
-      ? "O'zlashtirildi: bu mashq endi takrorlanmaydi."
+      ? 'Mastered: this exercise will not be reviewed again.'
-        ? `${yangi.quti}-quti. Keyingi takrorlash: ${sanaMatn(yangi.keyingi)}.`
-        : `1-qutiga qaytdi. Keyingi takrorlash: ${sanaMatn(yangi.keyingi)}.`;
+        ? `Box ${yangi.quti}. Next review: ${sanaMatn(yangi.keyingi)}.`
+        : `Back to box 1. Next review: ${sanaMatn(yangi.keyingi)}.`;
-    $('yakun-matn').textContent = `${navbat.length} ta mashqdan ${togriSoni} tasi to'g'ri. ${g.bugun.length > 0 ? `Bugun yana ${g.bugun.length} ta qoldi.` : 'Bugungi takrorlash tugadi.'}`;
+    $('yakun-matn').textContent = `${togriSoni} of ${navbat.length} correct. ${g.bugun.length > 0 ? `${g.bugun.length} more left for today.` : "Today's review is done."}`;
-    $('saqlash-holat').textContent = "Takrorlash tarixi o'chirildi. Daftardagi xatolar 1-qutidan qayta boshlandi.";
+    $('saqlash-holat').textContent = 'Review history deleted. The mistakes in the log start again from box 1.';
```

## Butun 3-qavat skaneri

Build'dagi 20 ta SAT sahifasi (`/uz/sat/` ostidagi hammasi) HTML'i o'qilib, ko'rinadigan matn, `aria-label`, `title`, `placeholder`, `alt`, `<title>` va `description` o'zbekcha so'zlar ro'yxati bilan skanerlandi: hammasida `<html lang="en">`, o'zbekcha matn faqat ataylab `lang="uz"` bilan belgilangan joylarda (lug'at kartasidagi `tarjima`; "Vocabulary in context" darsidagi "xavfli", "hal qilmoq"). Skript yaratadigan matn har sahifada bosib tekshirilgan (shu va oldingi PR'larda). 1-qavatdagi SAT matniga tegilmagan.

## Ochiq (muallif qarori kerak)

- Natijalar: brauzerda 4-PR'dan oldin saqlangan javoblarda mavzu nomi o'zbekcha (masalan "Chiziqli tenglamalar") va sana `8-noyabr` ko'rinishida qoladi. Bunday xato javobdagi "Solve again" havolasi `?mavzular=Chiziqli tenglamalar` bilan ochiladi; bu nom yangi savollarda yo'q, shuning uchun test hamma savollarni ko'rsatadi (xato emas, lekin filtr ishlamaydi). Tuzatish uchun eski nom → yangi nom moslash jadvali (yangi mantiq) kerak: qo'shilmagan, muallif qarori kutiladi.
