TAYANCH — TOP ADMISSION: MA'LUMOT VA INTERAKTIV VOSITALAR
Avtomatik prompt: 11 qism (Q0–Q10). Har qism alohida yordamchi agentda (toza kontekst = yangi chat).
MUALLIF UCHUN QISQA YO'RIQNOMA (Claude Code: kerakli joyda muallifga shundan eslatma ber)

* Shu promptni BIR MARTA nusxalab qo'yasan. Claude Code 11 qismning hammasini o'zi, ketma-ket bajaradi. Har qism alohida yordamchi agentda (subagent) ishlaydi, ya'ni har biri yangi chat kabi toza kontekst bilan.
* Sen hech narsa yozmaysan. Faqat 3 holatda sendan javob kerak bo'ladi:
   1. Q9: 30 ta universitet ro'yxatini tasdiqlash ("tasdiqlayman" deb yozasan yoki o'zgarishlarni aytasan).
   2. Biror qism "to'siq"qa uchrasa (masalan, Q5 da XP uchun bazani o'zgartirish kerak bo'lsa). Claude Code nima qilishingni aniq aytadi.
   3. Ruxsat so'ralsa (fayl tahrirlash, buyruq ishga tushirish). Kamroq so'rashi uchun Claude Code'da tahrirlarni avtomatik qabul qilish rejimini yoqib qo'y.
* Agar chat uzilsa yoki ishlatish limiti tugasa: keyinroq yangi chat ochib davom deb yozasan. Ish qolgan joyidan davom etadi.
* Agar Claude Code "davom" ni tushunmasa: admission-d branchiga o't, docs/rejalar/admission-reja.md faylini to'liq o'qi, 0-bo'limdagi tartibga amal qil.
* Hamma ish `admission-d` branchida qilinadi. Sayt (main) o'zgarmaydi. Merge'ni faqat sen, oxirida ko'rib chiqib qilasan.
* AI topgan har fakt avval "qoralama" bo'ladi va saytda ko'rinmaydi. Sen uni `docs/tekshiruv/tasdiq-royxati.md` dagi havolani ochib, iborani Cmd+F bilan qidirib tasdiqlaysan.
* Eskirish muddati: "muddatli" faktlar 60 kun, "barqaror" faktlar 180 kun. O'zgartirmoqchi bo'lsang, istalgan paytda ayt.
* Claude Code qila olmaydigan, o'zing qiladigan ishlar: inPAY'da 59 000 so'mlik to'lov, payment.failed va refund sinovi; Q0 topilmalari bo'yicha (baza Frankfurtda) huquqchi bilan maslahat.

0. BU PROMPT QANDAY ISHLAYDI
Ikki rol bor:

* BOSHQARUVCHI: muallif bilan gaplashayotgan asosiy chat. U qismlarni o'zi bajarmaydi, faqat agentlarni ishga tushiradi va natijani tekshiradi. Shu tufayli uning konteksti to'lib qolmaydi.
* QISM AGENTI: bitta qismni bajaradigan yordamchi agent (Agent/Task tool, general-purpose turi). Har bir agent yangi, toza kontekst bilan boshlanadi.

Hamma narsa repo'dagi ikki faylda saqlanadi:

* `docs/rejalar/admission-reja.md`: shu promptning o'zi (o'zgartirilmaydi)
* `docs/rejalar/admission-holat.md`: holat fayli (qaysi qism tugadi, topilmalar, eslatmalar)

A. BOSHQARUVCHI: boshlanishda, shu tartibda

1. `git status` ni ishga tushir. Commit qilinmagan o'zgarishlar bo'lsa, to'xta va muallifga xabar ber. Hech narsani o'chirma va stash qilma.
2. `admission-d` branchi mavjud bo'lsa, unga o't. Mavjud bo'lmasa, uni `main`dan yarat.
3. `docs/rejalar/admission-reja.md` fayli yo'q bo'lsa (bu birinchi ishga tushirish degani): a) Shu promptni TO'LIQ va O'ZGARTIRMASDAN shu faylga saqla. b) `docs/rejalar/admission-holat.md` faylini 3-bo'limdagi shablon bilan yarat. c) Repo ildizidagi `CLAUDE.md` fayliga (yo'q bo'lsa, yarat) uning oxiriga quyidagi blokni qo'sh. Mavjud matnga tegma: <!-- admission-d: boshlanish -->
Admission D-seriya (vaqtinchalik)
Agar foydalanuvchi "davom" deb yozsa: `admission-d` branchiga o't, `docs/rejalar/admission-reja.md` faylini to'liq o'qi va uning 0-bo'limidagi BOSHQARUVCHI tartibiga amal qil. <!-- admission-d: tugash -->d) Commit qil: `Q-tayyorgarlik: reja va holat fayllari`.
4. Muallifga bir qator yoz: "Boshladim. 11 qism ketma-ket bajariladi, har biri alohida agentda. Sizdan javob kerak bo'lsa, o'zim aytaman."

B. BOSHQARUVCHI: qismlar sikli
Holat faylidagi qismlarni tartib bilan ol (statusi "kutilmoqda" yoki "qisman" bo'lgan birinchisidan boshlab). Har qism uchun:

1. Bitta QISM AGENTini ishga tushir. Agentlar faqat KETMA-KET ishlaydi, hech qachon parallel emas (bir xil fayllar va git bilan ishlashadi). Agentga quyidagi topshiriqni ber ({N} o'rniga qism raqamini qo'y): "Sen Tayanch repo'sida ishlaysan. `admission-d` branchida ekaningni tekshir (bo'lmasa, unga o't). `docs/rejalar/admission-reja.md` faylini to'liq o'qi. Sen QISM AGENTIsan: faqat Q{N} qismini bajar, 0-bo'limning C bandidagi qoidalarga amal qil. Boshqa qismga o'tma va boshqa agent ishga tushirma. Yakuniy javobingda qisqa hisobot ber: status (tugadi / qisman / to'siq), nima qilindi (3–5 qator), commit hash, muallif uchun savollar."
2. Agent tugagach, javobini o'qi. Keyin holat faylini va `git log -1` ni o'zing tekshir: status yozilganmi, commit bormi.
3. Natijaga qarab:
   * "tugadi": muallifga bir qator yoz ("Q{N} tugadi: …") va keyingi qismga o't.
   * "qisman": xuddi shu qism uchun yangi agent ishga tushir (u ishni qolgan joyidan davom ettiradi). Bitta qism uchun ketma-ket 3 ta "qisman" bo'lsa, to'xta va muallifga ayt.
   * "to'siq": TO'XTA. Muallifga oddiy o'zbek tilida yoz: nima uchun to'xtadi va muallif AYNAN nima qilishi kerak. Javobini kut. Muallif shu chatning o'zida javob bersa (masalan, Q9 ro'yxatini "tasdiqlayman" desa), kerakli faylni o'zing yangila, statusni "kutilmoqda" ga qaytar, commit qil va siklni davom ettir.
   * Agent hisobot bermasa yoki holat fayli yangilanmagan bo'lsa: shu qismni yangi agent bilan bir marta qayta ishga tushir. Yana muvaffaqiyatsiz bo'lsa, to'xta va muallifga ayt.
4. Agent hisobotida "Muallif uchun savollar" bo'lsa, ularni muallifga ko'rsat. Agar savollar ishni to'xtatmasa, siklni davom ettir.
5. Hamma qism "tugadi" bo'lganda muallifga yakuniy xabar yoz (Q10 dagi 7-band mazmunida).

Agar bu muhitda yordamchi agent (Agent/Task tool) mavjud bo'lmasa: qismlarni o'zing, bitta chatda ketma-ket bajar. Har qism oxirida holat faylini yangila va commit qil. Kontekst tugay boshlasa, to'xta va muallifga "Yangi chat ochib davom deb yozing" de.
C. QISM AGENTI qoidalari

1. Holat faylini o'qi. Agar qisming "qisman" bo'lsa, "Keyingi chat uchun eslatma" bo'limidagi joydan davom et.
2. Faqat o'z qismingni bajar. 2-bo'limdagi qat'iy qoidalarga amal qil.
3. Ish oxirida: a) Qismning "Tayyor mezonlari"ni bittalab tekshir. b) `npm run build` ni ishga tushir (repo'da test yoki lint bo'lsa, ularni ham). Build xato bersa, uni tuzat. Tuzata olmasang, status "to'siq" bo'ladi. c) Holat fayliga yoz: status ("tugadi", "qisman" yoki "to'siq"), sana, o'zgargan fayllar ro'yxati, keyingi agent uchun eslatma, muallif uchun ochiq savollar. d) Commit qil. Xabar formati: `Q{raqam}: {qisqa tavsif}`. `main`ga push yoki merge QILMA. e) BOSHQARUVCHIga hisobot ber (B-1 bandidagi formatda). Muallifdan to'g'ridan-to'g'ri hech narsa so'rama: savollarni hisobotga yoz.
4. Kontekst tugay boshlasa: to'xta, statusni "qisman" qil, nima qilinganini va nima qolganini aniq yoz (fayl va element darajasida), commit qil va hisobot ber.

D. Muallif ish jarayonida sozlamani o'zgartirsa
Masalan, "barqaror faktlar ham 60 kun bo'lsin" desa: BOSHQARUVCHI o'zgarishni bajaradi, holat faylidagi "Sozlamalar" bo'limini yangilaydi, commit qiladi va siklni davom ettiradi.
1. KONTEKST
Loyiha: Tayanch (tayanchedu.uz). Bu o'zbek yoshlari uchun EdTech platforma. Muallif: Javohir, yolg'iz asoschi. Bo'limlar ("qavatlar"): Top Admission, SAT, IELTS, EYUF, AI Academy.
Texnik holat (2026-11-19 audit):

* Frontend: Astro 7, statik (`output: 'static'`).
* Backend: Supabase (Auth, Postgres, Edge Functions). Mintaqa eu-central-1. Jadvallar soni 50 ta.
* Deploy: GitHub Pages. `main`ga har push GitHub Actions orqali jonli saytga chiqadi. SHU SABABLI `main`ga TEGILMAYDI.
* Login: Supabase Auth (email+parol, Google PKCE), sahifalar `/uz/hisob/` ostida.
* Mavjud jadvallar: `user_state` (brauzerdagi `tayanch:*` kalitlarining server nusxasi), `onboarding_profiles`, `xp_events`, `leaderboard_members` va boshqalar.
* Dizayn: asosiy rang ko'k, shrift Manrope (bitta oila), zamonaviy va yoshlarga mos. Glassmorphism yo'q. Avtomatik popup yo'q.
* Til: UI o'zbekcha (lotin). Apostrof va oʻ/gʻ yozilishida repo'dagi mavjud konventsiyaga amal qil.

Maqsad: o'quvchi saytda quyidagi savollarga javob topa olsin: qaysi davlat menga mos, qayerda full ride grant bor, qayerda o'qish va yashash arzon, qaysi universitetlar menga to'g'ri keladi. Sayt "eng yaxshi davlat" reytingini BERMAYDI. O'quvchi mezonlarni o'zi tanlaydi, sayt rasmiy faktlar bo'yicha saralab beradi.
Qabul qilingan qarorlar:

1. 15 ta davlat qisqa kartada bo'ladi. Ulardan 3 tasi (AQSH, Buyuk Britaniya, Janubiy Koreya) "chuqur qo'llanma" belgisiga ega. Ro'yxat: AQSH, Buyuk Britaniya, Janubiy Koreya, Germaniya, Italiya, Vengriya, Turkiya, Xitoy, Yaponiya, Kanada, Avstraliya, Malayziya, Polsha, Saudiya Arabistoni, Singapur.
2. 5 ta mezon: (1) o'qish va yashash narxi; (2) grant imkoniyati; (3) til talabi; (4) ishlash va qolish huquqi; (5) o'zbek 11 yillik maktab diplomi to'g'ridan-to'g'ri qabul qilinadimi yoki foundation / Studienkolleg kerakmi.
3. Yashash narxining asosiy manbasi: viza uchun rasmiy talab qilinadigan yashash summasi.
4. "Menga mos universitet": oddiy filtr. "Kirish ehtimoli %" bo'lmaydi.
5. Grant katalogiga davlat grantlari ham, universitetlarning xalqaro talabalarga beradigan full ride / to'liq ehtiyojga asoslangan yordami ham kiradi.
6. Vositalar bepul. Pullik qism (AI tahlil, esse) bu promptga kirmaydi.
7. XP: Ariza zinapoyasidagi haqiqiy qadamlar XP beradi. Admission bo'limida reyting KO'RSATILMAYDI.
8. Admission uchun yangi baza jadvali QO'SHILMAYDI.

2. QAT'IY QOIDALAR (hamma qismlarda amal qiladi)

1. `main`ga push yoki merge qilma. Faqat `admission-d` branchida ishla.
2. Xotiradan yoki taxmin bilan FAKT YOZMA. Har bir fakt rasmiy sahifadan olinadi va o'sha sahifadagi aynan ibora bilan birga yoziladi. Sahifani ocha olmasang yoki ibora topilmasa, faktni bo'sh qoldir va holatini "topilmadi" qil.
3. Supabase'ga jadval, migratsiya, RPC yoki Edge Function qo'shma va mavjudlarini o'zgartirma. Agar busiz ishni bajarib bo'lmasa, to'xta va qism statusini "to'siq" qil.
4. Taqiqlangan narsalar: "kirish ehtimoli %", grant yoki xarajat kalkulyatori, "siz X grant olasiz" kabi iboralar, "100% grant", "kafolat", uydirma raqamlar (foydalanuvchilar soni, natijalar, reytinglar), avtomatik popup, Admission sahifalarida reyting (leaderboard).
5. Saytda faqat holati "tasdiqlangan" bo'lgan faktlar ko'rsatiladi. "Qoralama" va "topilmadi" holatidagi faktlar o'rniga "Ma'lumot tekshirilmoqda" yozuvi chiqadi.
6. Qism doirasidan tashqaridagi fayllarga tegma, refactor qilma, mavjud sahifalarni o'chirma.
7. Yangi npm paket qo'shmaslikka harakat qil. Juda zarur bo'lsa, sababini holat fayliga yoz.
8. Har sahifa telefonda (375px) va noutbukda (1280px) to'g'ri ko'rinishi kerak.
9. Noaniq joy bo'lsa, taxmin qilma. Savolni holat faylidagi "Muallif uchun savollar" bo'limiga yoz.
10. Har bir kodlash qismidan oldin repo'ning mavjud tuzilishini o'rgan: Top Admission sahifalari qayerda, komponentlar, header ochiladigan ro'yxati, `user_state` qanday ishlaydi. Yangi kod shu uslubga mos yozilsin.

3. HOLAT FAYLI SHABLONI (`docs/rejalar/admission-holat.md`)

```
# Admission D-seriya: holat

| Qism | Nomi | Status | Sana | Izoh |
|---|---|---|---|---|
| Q0 | Maxfiylik auditi (faqat o'qish) | kutilmoqda | | |
| Q1 | Ma'lumot sxemasi va validator | kutilmoqda | | |
| Q2 | Davlatlarni taqqoslash sahifasi | kutilmoqda | | |
| Q3 | Grantlar katalogi sahifasi | kutilmoqda | | |
| Q4 | "Menga mos universitet" filtri | kutilmoqda | | |
| Q5 | Ariza zinapoyasi → XP | kutilmoqda | | |
| Q6 | Kontent: 3 chuqur davlat + valyuta kurslari | kutilmoqda | | |
| Q7 | Kontent: 12 qisqa davlat kartasi | kutilmoqda | | |
| Q8 | Kontent: davlat grantlari | kutilmoqda | | |
| Q9 | Kontent: 30 universitet | kutilmoqda | | |
| Q10 | Yakuniy tekshiruv va hisobot | kutilmoqda | | |

## Sozlamalar
- Eskirish muddati: "muddatli" faktlar 60 kun, "barqaror" faktlar 180 kun. (180 kun muallif tomonidan HALI TASDIQLANMAGAN.)

## Topilmalar (Q0)

## Keyingi chat uchun eslatma

## Muallif uchun savollar

```

4. QISMLAR
Q0. Maxfiylik auditi (FAQAT O'QISH, kod o'zgarmaydi)
`supabase/functions/` ichidagi `ai-tutor`, `ielts-writing-baho` va `suhbatdosh` funksiyalarini hamda `supabase/migrations/` ichidagi tegishli jadvallarni (`ai_conversations`, `ai_messages`, `ielts_writing_results`, `private.ai_usage`, Storage bucket'lari) o'rgan va quyidagi savollarga javob ber:

1. Foydalanuvchi ovozi (audio) bazaga, Supabase Storage'ga yoki boshqa joyga saqlanadimi? Saqlansa: qayerga, qancha muddatga, uni kim o'qiy oladi?
2. Ovoz qayta ishlash uchun tashqi API'ga yuboriladimi? Qaysi provayderga?
3. Foydalanuvchi yozgan insho yoki xabarning MATNI bazada saqlanadimi? Qaysi jadval va qaysi ustunda?
4. Saqlangan matn yoki ovoz avtomatik o'chiriladimi (retention, cron, TTL)?
5. Foydalanuvchi o'z ma'lumotini yoki akkauntini o'chira oladimi? Qanday yo'l bilan?

Natijani holat faylidagi "Topilmalar (Q0)" bo'limiga jadval ko'rinishida yoz: savol | javob | manba fayl va qator raqami. Topilmagan narsani taxmin qilma, "topilmadi" deb yoz. Hech qanday tuzatish kiritma: tuzatish haqidagi qarorni muallif keyin qabul qiladi. Tayyor mezonlari: 5 savolning hammasiga manba bilan javob berilgan; faqat `docs/` ichidagi fayllar o'zgargan.
Q1. Ma'lumot sxemasi va validator (HAQIQIY FAKT YOZILMAYDI)
Avval o'rnatilgan Astro versiyasining content collections API'sini tekshir: config faylining joyi, loader, zod sxema. Buni `node_modules` yoki rasmiy hujjatdan qil, xotiradan taxmin qilma.

1. Umumiy "Fakt" sxemasi. Har bir qattiq fakt quyidagi shaklda saqlanadi:
   * `qiymat`: matn, raqam yoki ha/yo'q
   * `source_url`: https bilan boshlanadi; holat "topilmadi" bo'lsa bo'sh bo'lishi mumkin
   * `manba_iborasi`: rasmiy sahifadagi aynan ibora
   * `tekshirilgan_sana`: YYYY-MM-DD
   * `turi`: "muddatli" (deadline, talab, to'lov, summa) yoki "barqaror" (o'qitish tili, diplom talabi)
   * `holat`: "qoralama", "tasdiqlangan" yoki "topilmadi" Holat "qoralama" yoki "tasdiqlangan" bo'lsa, `source_url`, `manba_iborasi` va `tekshirilgan_sana` majburiy. Biror maydon yo'q bo'lsa, build xato bilan to'xtashi va xabarda fayl nomi hamda maydon ko'rsatilishi kerak.
2. Kolleksiyalar (ma'lumot `src/` ichida, repo uslubiga mos papkada): a) `davlatlar`: slug, nom_uz, chuqur_qollanma (true/false), chuqur_qollanma_havola (ixtiyoriy). 5 mezon:
   * narx: kontrakt_yillik, viza_yashash_summasi, valyuta
   * grant: davlat_grantlari (grantlar kolleksiyasiga havolalar), izoh
   * til: ingliz_tilida_dastur_bor, odatiy_ielts
   * ishlash: oqish_paytida, bitirgandan_keyin
   * diplom: togridan_togri ("ha" | "yo'q" | "dasturga_qarab"), tayyorlov_nomi b) `grantlar`: slug, nom, turi ("davlat" | "universitet"), davlat (havola), universitet (havola, ixtiyoriy), daraja (bakalavr / magistr / ikkalasi), nimani_qoplaydi, deadline, rasmiy_havola c) `universitetlar`: slug, nom, davlat (havola), imtihonlar, min_ielts, yillik_xarajat (rasmiy cost of attendance), valyuta, ariza_tolovi, tolovdan_ozod_qilish, xalqaro_yordam_turi, deadline Raqam, summa, sana va talab maydonlari Fakt sxemasidan foydalanadi.
3. Valyuta kurslari fayli (masalan, `kurslar.json`): manba URL, sana va har valyutaning USD'ga nisbati. Ma'lumot keyin Q6 da to'ldiriladi. Kurs bo'lmasa, sahifalar narx bo'yicha saralashni o'chirib qo'yadi va "kurs ma'lumoti yo'q" deb yozadi.
4. Sozlama: eskirish kunlari ("muddatli" 60, "barqaror" 180) bitta konstantada turadi va ikkala skript hamda UI shu konstantadan foydalanadi.
5. `npm run malumot:tekshir`: muddati o'tgan faktlar va "topilmadi" holatidagi faktlar hisoboti. Ro'yxat ustunlari: fayl, maydon, sana, necha kun o'tgan. Bu skript build'ni TO'XTATMAYDI.
6. `npm run malumot:tasdiq`: holati "qoralama" bo'lgan hamma faktlardan `docs/tekshiruv/tasdiq-royxati.md` faylini yaratadi. Har qatorda: fayl, maydon, qiymat, source_url, manba_iborasi. Muallif har iborani rasmiy sahifada Cmd+F bilan qidirib tasdiqlaydi.
7. Yordamchi funksiyalar: `faktKorinadimi(fakt)` (faqat "tasdiqlangan" bo'lsa true) va `faktEskirganmi(fakt)`. UI'da eskirgan tasdiqlangan fakt yonida "qayta tekshirilmoqda" belgisi chiqadi.
8. Umumiy UI komponenti: faktni qiymati, "Manba" havolasi va tekshirilgan sanasi bilan ko'rsatadi; ko'rinmaydigan faktlar o'rniga "Ma'lumot tekshirilmoqda" yozadi.
9. Sinov: test papkasiga ATAYLAB SOXTA ma'lumotli fixture'lar qo'y: bittasi to'g'ri, bittasi source_url'siz "qoralama", bittasi "topilmadi". Birinchisi o'tishi, ikkinchisi xato berishi, uchinchisi o'tishini ko'rsat. Fixture'lar haqiqiy kolleksiyaga kirmaydi.

Tayyor mezonlari: build o'tadi; ikkala skript ishlaydi; sinov natijasi holat fayliga yozilgan; haqiqiy fakt yozilmagan.
Q2. Davlatlarni taqqoslash sahifasi
Avval Top Admission'ning mavjud yo'llari (route) va header ochiladigan ro'yxatini o'rgan. Sahifani shu tuzilishga mos joyga qo'y (masalan, `.../admission/davlatlar/`).

1. Sahifada 15 ta davlat kartasi bo'ladi. Har kartada 5 mezonning qisqa ko'rinishi va "chuqur qo'llanma" belgisi bor; chuqur qo'llanma mavjud bo'lsa, unga havola beriladi.
2. Filtrlar (chip ko'rinishida): "Diplom to'g'ridan-to'g'ri qabul qilinadi", "Ingliz tilida dastur bor", "Davlat granti bor", "O'qish paytida ishlash mumkin".
3. Saralash: taxminiy yillik xarajat (kontrakt + viza yashash summasi) USD'da. Yonida "taxminiy, kurs sanasi: …" izohi turadi. Kurs yoki fakt yo'q davlatlar ro'yxat oxiriga tushadi va "ma'lumot tekshirilmoqda" belgisini oladi.
4. Taqqoslash: o'quvchi 2–3 davlatni tanlaydi va ular yonma-yon jadvalda ko'rsatiladi (telefonda ketma-ket kartalar ko'rinishida).
5. Tanlangan filtrlar URL query'da saqlanadi, shunda havolani ulashish mumkin. Shaxsiy ma'lumot saqlanmaydi.
6. Har bir fakt Q1 dagi umumiy komponent orqali ko'rsatiladi (manba havolasi va sana bilan).
7. Bo'sh holat (hech qanday tasdiqlangan ma'lumot yo'q bo'lganda) chiroyli ko'rinadi.
8. Header'dagi Top Admission ochiladigan ro'yxatiga "Davlatlarni taqqoslash" havolasini qo'sh. Header tuzilishi rejadagidan farq qilsa, unga tegma va buni holat fayliga yoz. Sinov: sahifani bo'sh holatda va (vaqtincha, commit qilinmaydigan) fixture bilan tekshir. Tayyor mezonlari: filtr, saralash va taqqoslash ishlaydi; 375px va 1280px'da to'g'ri ko'rinadi; "qoralama" fakt ko'rinmaydi; build o'tadi.

Q3. Grantlar katalogi sahifasi

1. Sahifa Top Admission ichida, Q2 bilan bir xil uslubda.
2. Filtrlar: turi (davlat / universitet), davlat, daraja (bakalavr / magistr), "to'liq qoplaydi" (faqat bu `nimani_qoplaydi` faktida aniq yozilgan bo'lsa).
3. Har kartada: nom, turi, davlat, nimani qoplaydi, deadline, rasmiy havola, manba va sana.
4. Deadline'ga qarab saralash (eng yaqini birinchi). Muddati o'tgan grantlar "Bu yilgi muddat o'tgan" belgisi bilan ro'yxat oxiriga tushadi.
5. Mavjud "Türkiye burslari" sahifasini o'chirma: Turkiya granti kartasidan unga havola ber.
6. Sahifada ko'rinadigan ogohlantirish: "Grant shartlari har yili o'zgaradi. Topshirishdan oldin rasmiy sahifani tekshiring."
7. Header ochiladigan ro'yxatiga "Grantlar" havolasini qo'sh (Q2 dagi shart bilan). Tayyor mezonlari: Q2 bilan bir xil.

Q4. "Menga mos universitet" filtri

1. Kiritiladigan ma'lumotlar: davlat (AQSH / Buyuk Britaniya / Janubiy Koreya, bir nechtasini tanlash mumkin), IELTS bali, yillik byudjet (USD), "Faqat xalqaro talabaga moliyaviy yordam beradiganlar" belgisi.
2. Natija: universitetlar ro'yxati. Har birida quyidagilar ko'rsatiladi: min IELTS bilan o'quvchining bali yonma-yon ("Talab: 6.5 · Sizda: 6.0"), yillik xarajat va byudjet yonma-yon, imtihonlar, ariza to'lovi va undan ozod qilish, yordam turi, deadline, manbalar.
3. "Faqat talabga mos keladiganlar" belgisi: min IELTS'dan past yoki byudjetdan qimmat bo'lganlar yashiriladi. Belgi o'chiq bo'lsa, ular "talabga yetmaydi" belgisi bilan ko'rsatiladi.
4. Kerakli fakti tasdiqlanmagan universitetlar alohida "Ma'lumot tekshirilmoqda (N ta)" guruhiga tushadi, moslik hisoblanmaydi.
5. SAT bo'yicha moslashtirish yo'q (rasmiy minimal ball odatda e'lon qilinmaydi).
6. Natija tepasida doim ko'rinadigan matn: "Bu ro'yxat rasmiy talablar bo'yicha saralash, qabul ehtimoli emas."
7. Shortlist: o'quvchi universitetni saqlay oladi. Login bo'lsa, repo'ning `user_state` mexanizmi orqali (`tayanch:*` kaliti, mavjud konventsiya bo'yicha); login bo'lmasa, faqat brauzerda. Yangi jadval qo'shilmaydi.
8. Header ochiladigan ro'yxatiga "Menga mos universitet" havolasini qo'sh (Q2 dagi shart bilan). Tayyor mezonlari: filtr va shortlist ishlaydi (login bilan ham, loginsiz ham); "ehtimol" so'zi faqat ogohlantirish matnida uchraydi; 375px va 1280px; build o'tadi.

Q5. Ariza zinapoyasi → XP

1. Repo'dagi mavjud "Ariza zinapoyasi"ni top. U mavjud bo'lmasa, status "to'siq" qil va to'xta.
2. `xp_events` qanday yozilishini o'rgan: qaysi funksiya yoki RPC orqali, qanday tur va qiymatlar bilan, SAT'da qanday ishlatilgan.
3. Zinapoyadagi har bir qadam BIRINCHI marta bajarilganda mavjud mexanizm orqali XP yoziladi. Belgini olib qayta qo'yish orqali XP yig'ib bo'lmasligi kerak (bitta foydalanuvchi, bitta qadam, bitta marta).
4. XP qiymatini SAT'dagi mavjud qiymatlarga mutanosib tanla va sababini holat fayliga yoz.
5. Admission sahifalarida reyting va boshqa foydalanuvchilarning XP'si ko'rsatilmaydi. Faqat o'quvchining o'z progressi ko'rinadi.
6. Agar buni migratsiyasiz va mavjud RPC'larni o'zgartirmasdan qilib bo'lmasa, status "to'siq" qil, kerakli o'zgarishni holat fayliga tasvirlab yoz va to'xta. Tayyor mezonlari: XP faqat bir marta yoziladi (sinov bilan ko'rsatilgan); login bo'lmaganda xato chiqmaydi; build o'tadi.

Q6. Kontent: 3 chuqur davlat (AQSH, Buyuk Britaniya, Janubiy Koreya) + valyuta kurslari

1. Har davlat uchun 5 mezon bo'yicha faktlarni FAQAT rasmiy manbalardan ol: hukumat, immigratsiya yoki viza sahifalari, rasmiy grant dasturlari sahifalari. Agregator saytlar, bloglar va forumlar ishlatilmaydi.
2. Har bir fakt `holat: "qoralama"` bilan yoziladi, aynan ibora va sana bilan. Topa olmagan faktingni "topilmadi" qil, taxmin bilan to'ldirma.
3. Valyuta kurslari: rasmiy manbadan (masalan, O'zbekiston Markaziy banki kurslari) sana bilan yoz. Manbaga kira olmasang, faylni bo'sh qoldir va buni holat fayliga yoz.
4. Oxirida `npm run malumot:tasdiq` ni ishga tushir. Tayyor mezonlari: 3 ta davlat fayli bor; har bir fakt "qoralama" (manba bilan) yoki "topilmadi" holatida; tasdiq ro'yxati yangilangan; build o'tadi.

Q7. Kontent: 12 ta qisqa davlat kartasi
Davlatlar: Germaniya, Italiya, Vengriya, Turkiya, Xitoy, Yaponiya, Kanada, Avstraliya, Malayziya, Polsha, Saudiya Arabistoni, Singapur. Q6 dagi qoidalarning hammasi amal qiladi. Ishni davlatma-davlat bajar. Kontekst tugasa, "qisman" statusi bilan to'xta va qaysi davlatlar tugaganini aniq yoz. Tayyor mezonlari: 12 ta davlat fayli bor; tasdiq ro'yxati yangilangan; build o'tadi.
Q8. Kontent: davlat grantlari

1. 15 ta davlatning har biri uchun hukumat yoki davlat grant dasturini FAQAT rasmiy hukumat yoki dastur sahifasidan izla. Rasmiy dastur topilmasa, grant yaratma va buni holat fayliga yoz.
2. Har grant: `turi: "davlat"`, Q1 sxemasi bo'yicha, hamma fakt "qoralama" holatida. Grantni davlat kartasidagi `davlat_grantlari` maydoniga bog'la.
3. "To'liq qoplaydi" degan narsa faqat rasmiy sahifada aniq yozilgan bo'lsa yoziladi.
4. Oxirida `npm run malumot:tasdiq`. Tayyor mezonlari: har davlat uchun yoki grant fayli bor, yoki "rasmiy dastur topilmadi" deb yozilgan; build o'tadi.

Q9. Kontent: 30 universitet (AQSH, Buyuk Britaniya, Janubiy Koreya, har biridan 10 tadan)

1. Agar `docs/rejalar/universitetlar-royxati.md` mavjud bo'lmasa: har davlat uchun 10 tadan universitet TAKLIF qil. Ro'yxat har xil darajadagi universitetlardan iborat bo'lsin; AQSH uchun xalqaro talabalarga moliyaviy yordam beradiganlarga ustunlik ber. Har biri yoniga bir qatorli sabab yoz. Faylning birinchi qatoriga "TASDIQLANMAGAN" deb yoz. Q9 statusini "to'siq: muallif ro'yxatni tasdiqlashi kerak" qil, commit qil va to'xta. Hisobotga muallif uchun shu matnni yoz: "30 ta universitet ro'yxati `docs/rejalar/universitetlar-royxati.md` faylida. Ko'rib chiqing. O'zgartirmoqchi bo'lsangiz (olib tashlash yoki qo'shish), shu chatda yozing. Yoqsa, «tasdiqlayman» deb yozing." BOSHQARUVCHI bu matnni muallifga yetkazadi, javobga qarab faylni yangilaydi va birinchi qatorni TASDIQLANDI ga almashtiradi.
2. Agar faylning birinchi qatorida "TASDIQLANDI" yozilgan bo'lsa: shu ro'yxat bo'yicha ishla.
3. Har universitet uchun faktlar FAQAT universitetning o'z rasmiy sahifalaridan olinadi: admissions, international students, cost of attendance, financial aid. Hamma fakt "qoralama".
4. Agar rasmiy sahifada xalqaro talabalarga full ride yoki to'liq ehtiyojga asoslangan yordam aniq yozilgan bo'lsa, `grantlar` kolleksiyasida `turi: "universitet"` grant yarat va uni universitetga bog'la.
5. Ishni universitetma-universitet bajar. Kontekst tugasa, "qisman" statusi bilan to'xta va qaysilari tugaganini yoz.
6. Oxirida `npm run malumot:tasdiq`. Tayyor mezonlari: ro'yxatdagi 30 ta universitet fayli bor; build o'tadi.

Q10. Yakuniy tekshiruv va muallif uchun hisobot

1. `npm run build`, `npm run malumot:tekshir` va `npm run malumot:tasdiq` ni ishga tushir.
2. Hamma `source_url` havolalarini tekshir (ochiladimi). Natijani faqat hisobot sifatida yoz, faktlarni o'zgartirma.
3. Butun Admission bo'limini taqiqlangan iboralarga tekshir (2-bo'lim, 4-qoida): "ehtimol", "kafolat", "100%", reyting komponentlari. Q4 dagi "qabul ehtimoli emas" ogohlantirishi bundan mustasno, unga tegma. Boshqa topilganlarini tuzat.
4. Imkon bo'lsa, sahifalarni 375px va 1280px'da tekshir. Imkon bo'lmasa, muallif qo'lda tekshirishi uchun ro'yxat tuz.
5. `docs/rejalar/admission-yakun.md` faylini yarat. Unda bo'lsin: nima qurildi (sahifalar va yo'llar); faktlar soni holat bo'yicha (tasdiqlangan / qoralama / topilmadi); ishlamaydigan havolalar; muallif uchun ochiq savollar; muallifning qo'lda qiladigan ishlari (tasdiq ro'yxatini Cmd+F bilan tekshirish, inPAY'da 59 000 so'mlik to'lov / payment.failed / refund sinovi, Q0 topilmalari bo'yicha huquqchi bilan maslahat); `main`ga qanday merge qilish bo'yicha tavsiya. MERGE QILMA.
6. `CLAUDE.md` dagi `<!-- admission-d: boshlanish -->` va `<!-- admission-d: tugash -->` orasidagi vaqtinchalik blokni (belgilari bilan birga) o'chir. Faylning qolgan qismiga tegma. Agar CLAUDE.md shu blok uchun yaratilgan bo'lsa va boshqa matn bo'lmasa, faylni o'chir.
7. Hisobotda (BOSHQARUVCHI uni muallifga yetkazadi) oddiy tilda yoz: nima tayyor; nechta fakt tasdig'ini kutmoqda va tasdiq ro'yxati qayerda; qo'lda qilinadigan ishlar (inPAY sinovlari, huquqchi); main'ga merge qilish uchun keyingi qadam. Tayyor mezonlari: hisobot fayli bor; build o'tadi; CLAUDE.md dagi vaqtinchalik blok olib tashlangan; hamma qismlar holat faylida "tugadi" deb belgilangan.
