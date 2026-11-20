TAYANCH — TOP ADMISSION: E-SERIYA (D-seriyaning davomi)
Avtomatik prompt: 11 qism (E0–E10). Har qism alohida yordamchi agentda (toza kontekst = yangi chat).
Mavzu: Q8/Q9 savollariga muallif javoblari, bloklangan saytlar, davlat grantlari uchun to'liq qo'llanmalar.
MUALLIF UCHUN QISQA YO'RIQNOMA (Claude Code: kerakli joyda muallifga shundan eslatma ber)

* Shu promptni BIR MARTA nusxalab qo'yasan. Claude Code hamma qismlarni o'zi, ketma-ket bajaradi.
* Agar D-seriya (Q10) hali tugamagan bo'lsa, Claude Code avval uni tugatadi, keyin E-seriyaga o'tadi.
* Sendan javob faqat ruxsat so'ralganda yoki biror qism "to'siq"qa uchraganda kerak bo'ladi. Ruxsatlar kamroq so'ralishi uchun tahrirlarni avtomatik qabul qilish rejimini yoqib qo'y.
* Chat uzilsa yoki limit tugasa: yangi chat ochib davom deb yozasan.
* Agar Claude Code "davom" ni tushunmasa: admission-d branchiga o't, docs/rejalar/admission-e-reja.md faylini to'liq o'qi, 0-bo'limdagi tartibga amal qil.
* Hamma ish `admission-d` branchida qilinadi, PR #198 yangilanadi. `main`ga merge'ni faqat sen qilasan.
* Yangi topilgan faktlar avval "qoralama" bo'ladi. Sen ularni `docs/tekshiruv/tasdiq-royxati.md` orqali Cmd+F bilan tasdiqlaysan.
* Seriya oxirida Claude Code bitta savol berishi mumkin: 15 ta davlatdan tashqarida topilgan full ride grantlarni (agar topilsa) qo'shish kerakmi?

0. BU PROMPT QANDAY ISHLAYDI
Bu D-seriyaning davomi. D-seriyaning `docs/rejalar/admission-reja.md` faylidagi 1-bo'lim (KONTEKST) va 2-bo'lim (QAT'IY QOIDALAR) bu seriyada ham TO'LIQ amal qiladi. Har agent ikkala faylni ham o'qiydi.
Rollar xuddi D-seriyadagidek:

* BOSHQARUVCHI: asosiy chat. Qismlarni o'zi bajarmaydi, agentlarni ishga tushiradi va natijani tekshiradi.
* QISM AGENTI: bitta qismni bajaradigan yordamchi agent (Agent/Task tool, general-purpose turi), toza kontekst bilan.

Fayllar:

* `docs/rejalar/admission-e-reja.md`: shu prompt (o'zgartirilmaydi)
* `docs/rejalar/admission-e-holat.md`: E-seriya holat fayli
* `docs/rejalar/admission-reja.md` va `docs/rejalar/admission-holat.md`: D-seriya fayllari (kontekst va Q6–Q9 natijalari uchun o'qiladi)

A. BOSHQARUVCHI: boshlanishda, shu tartibda

1. `git status`: commit qilinmagan o'zgarishlar bo'lsa, to'xta va muallifga xabar ber. Hech narsani o'chirma va stash qilma.
2. `admission-d` branchiga o't.
3. `docs/rejalar/admission-holat.md` ni o'qi. Agar D-seriyaning biror qismi (Q0–Q10) "tugadi" bo'lmasa: AVVAL D-seriyani `docs/rejalar/admission-reja.md` dagi BOSHQARUVCHI tartibida oxirigacha yetkaz. Agar Q10 hozir boshqa chatda ishlayotgan bo'lsa, u tugaguncha kut (holat faylini vaqti-vaqti bilan tekshir). Keyin 4-bandga o't.
4. `docs/rejalar/admission-e-reja.md` yo'q bo'lsa (E-seriyaning birinchi ishga tushirilishi): a) Shu promptni TO'LIQ va O'ZGARTIRMASDAN shu faylga saqla. b) `docs/rejalar/admission-e-holat.md` ni 3-bo'limdagi shablon bilan yarat. c) Repo ildizidagi `CLAUDE.md` oxiriga quyidagi blokni qo'sh (fayl yo'q bo'lsa, yarat; mavjud matnga tegma): <!-- admission-e: boshlanish -->
Admission E-seriya (vaqtinchalik)
Agar foydalanuvchi "davom" deb yozsa: `admission-d` branchiga o't, `docs/rejalar/admission-e-reja.md` faylini to'liq o'qi va uning 0-bo'limidagi BOSHQARUVCHI tartibiga amal qil. <!-- admission-e: tugash -->d) Commit qil (`E-tayyorgarlik: reja va holat fayllari`) va `git push origin admission-d`.
5. Muallifga bir qator yoz: "E-seriya boshlandi: 11 qism, ketma-ket. Javobingiz kerak bo'lsa, o'zim aytaman."

B. BOSHQARUVCHI: qismlar sikli
E-holat faylidagi qismlarni tartib bilan ol (statusi "kutilmoqda" yoki "qisman" bo'lgan birinchisidan). Har qism uchun:

1. Bitta QISM AGENTini ishga tushir. Agentlar faqat KETMA-KET ishlaydi. Topshiriq ({N} o'rniga raqam qo'y): "Sen Tayanch repo'sida ishlaysan. `admission-d` branchida ekaningni tekshir. Avval `docs/rejalar/admission-reja.md` ning 1- va 2-bo'limlarini, keyin `docs/rejalar/admission-e-reja.md` ni to'liq o'qi. Sen QISM AGENTIsan: faqat E{N} qismini bajar, E-rejaning 0-bo'limidagi C bandiga amal qil. Boshqa qismga o'tma va boshqa agent ishga tushirma. Yakuniy javobingda qisqa hisobot ber: status (tugadi / qisman / to'siq), nima qilindi (3–5 qator), commit hash, muallif uchun savollar."
2. Agent tugagach, E-holat faylini va `git log -1` ni o'zing tekshir.
3. Natijaga qarab:
   * "tugadi": `git push origin admission-d`, muallifga bir qator yoz ("E{N} tugadi: …") va keyingi qismga o't.
   * "qisman": shu qism uchun yangi agent. Bitta qismda ketma-ket 3 ta "qisman" bo'lsa, to'xta va muallifga ayt.
   * "to'siq": TO'XTA. Muallifga oddiy o'zbek tilida yoz: nima uchun to'xtadi va u AYNAN nima qilishi kerak. Javob kelsa, kerakli faylni yangila, statusni "kutilmoqda" ga qaytar, commit qil va davom et.
   * Hisobot yo'q yoki holat yangilanmagan: bir marta qayta ishga tushir; yana bo'lmasa, to'xta va ayt.
4. Agent savollari ishni to'xtatmasa, ularni yig'ib bor va E10 dan keyin bitta xabarda ko'rsat.
5. Hammasi "tugadi" bo'lganda muallifga yakuniy xabar yoz (E10 dagi 6-band mazmunida).

Yordamchi agent mavjud bo'lmasa: qismlarni o'zing ketma-ket bajar. Kontekst tugay boshlasa, to'xta va muallifga "Yangi chat ochib davom deb yozing" de.
C. QISM AGENTI qoidalari

1. E-holat faylini o'qi. Qisming "qisman" bo'lsa, "Keyingi agent uchun eslatma" dagi joydan davom et.
2. Faqat o'z qismingni bajar. D-rejaning 2-bo'limidagi qoidalar va quyidagi 2-bo'lim qoidalari amal qiladi.
3. Ish oxirida: tayyor mezonlarini tekshir; `npm run build`, `npm test`, `npm run check`, `npm run malumot:tekshir` (kontent qismlarida yana `npm run malumot:tasdiq`); E-holat fayliga status, sana, o'zgargan fayllar, keyingi agent uchun eslatma va muallif uchun savollarni yoz; commit qil (`E{raqam}: …`). `main`ga push yoki merge QILMA.
4. Kontekst tugay boshlasa: statusni "qisman" qil, nima qilinganini va nima qolganini aniq yoz, commit qil va hisobot ber.

1. MUALLIF QARORLARI (2026-11-20)
Q9 savollariga javoblar:

1. UK va Koreya yillik xarajati: "kamida X" ko'rinishida beriladi. X = universitetning rasmiy eng past xalqaro bakalavr kontrakti + davlat kartasidagi viza yashash summasi (bir valyutaga o'tkazilgan). Sahifada "kamida" so'zi va hisob qanday tuzilgani ko'rsatiladi. AQSH uchun mavjud `yillik_xarajat` (rasmiy cost of attendance) qoladi.
2. IELTS: har universitet uchun `ielts_holati` maydoni: "minimum" (rasmiy minimal ball), "tavsiya" (recommended / competitive), "talab_qilinmaydi" (masalan, Harvard), "topilmadi". Filtr faqat "minimum" bo'yicha saralaydi. "Tavsiya" bo'lsa: "Rasmiy minimum yo'q, tavsiya etilgan: 7.0", saralashga ta'sir qilmaydi. "Talab qilinmaydi" alohida yozuv bilan ko'rsatiladi.
3. KAIST va Berea: "to'liq qoplaydi" belgisi qoladi (rasmiy matnda aniq yozilgan).
4. To'liq ehtiyojga asoslangan yordam: "to'liq qoplaydi" belgisi QO'YILMAYDI. Kartada izoh: "Yordam miqdori oila daromadi asosida hisoblanadi; oila hissasi talab qilinishi mumkin."
5. Muddati o'tgan qabullar (Koreya, SH, Banach va boshqalar): "Bu yilgi muddat o'tgan, keyingisi hali e'lon qilinmagan" deb ko'rsatiladi. Agar keyingi sana rasmiy e'lon qilingan bo'lsa, yangi sana yoziladi.
6. Foundation: har universitetga yangi fakt: `foundation_kerak` ("ha" | "yo'q" | "dasturga_qarab"). Coventry'da topilgan ma'lumot shu yerga yoziladi. Leeds stipendiyasi O'zbekiston uchun ochiqligi tekshirilmaguncha ko'rsatilmaydi.
7. Grant topilmagan davlatlar (Kanada, Singapur va boshqalar): davlat kartasida: "Rasmiy manbalarda o'zbek fuqarosi uchun davlat granti topilmadi (tekshirildi: SANA)". Bu matn tekshirilgan rasmiy sahifa havolasi bilan birga Fakt sifatida yoziladi.
8. Bloklangan saytlar: boshqa usullar bilan qayta uriniladi (2-bo'lim, 1-qoida). Baribir ochilmasa, universitet yoki grant QOLADI, kartada "Ma'lumot tekshirilmoqda" yozuvi chiqadi.

Grantlar bo'yicha yangi qarorlar: 9. Bakalavr uchun ochiq davlat grantlariga Türkiye Bursları sahifasi kabi TO'LIQ QO'LLANMA qilinadi: Stipendium Hungaricum, GKS (Koreya), Xitoy hukumati granti (CSC), MEXT (Yaponiya). Mavjud Türkiye Bursları sahifasi o'zgartirilmaydi, faqat katalogdan unga havola beriladi. 10. Bakalavr uchun boshqa full ride (to'liq qoplaydigan) davlat grantlari topilsa, ular ham karta va qo'llanma bilan qo'shiladi (E9).
2. E-SERIYA QO'SHIMCHA QOIDALARI

1. Sayt ochilmasa, quyidagi tartibda uriniladi: (a) `curl` turli User-Agent va `--http1.1` bilan (D-holat faylidagi curl maslahatlarini o'qi); (b) Claude Code'ning WebFetch vositasi (unga sahifadagi kerakli gapni AYNAN, so'zma-so'z keltirishni buyur); (c) xuddi shu ma'lumot e'lon qilingan boshqa RASMIY sahifa (elchixona, vazirlik, dasturning rasmiy PDF fayli). Agregator saytlar, bloglar va forumlar hech qachon ishlatilmaydi.
2. Agar ibora WebFetch orqali olingan bo'lsa (sahifa matni to'g'ridan-to'g'ri `grep` qilinmagan bo'lsa), fakt baribir "qoralama" bo'ladi, holat faylida esa "ibora WebFetch orqali" deb belgilanadi. Muallif uni Cmd+F bilan tekshiradi.
3. Qo'llanmalarda faqat rasmiy manbada yozilgan narsalar beriladi. "Maslahat" yoki "tez-tez uchraydigan xatolar" bo'limi faqat rasmiy FAQ yoki rasmiy qo'llanmada bo'lsa qo'shiladi, o'ylab topilmaydi.
4. Sxemaga qo'shiladigan yangi maydonlar ixtiyoriy (optional) bo'lsin, shunda mavjud fayllar buzilmaydi.
5. Supabase'ga tegilmaydi (D-rejaning 2-bo'lim, 3-qoidasi).

3. E-HOLAT FAYLI SHABLONI (`docs/rejalar/admission-e-holat.md`)

```
# Admission E-seriya: holat

| Qism | Nomi | Status | Sana | Izoh |
|---|---|---|---|---|
| E0 | (BOSHQARUVCHI tayyorgarligi) | kutilmoqda | | |
| E1 | Sxema va UI: Q9 javoblari | kutilmoqda | | |
| E2 | Universitetlar: yangi maydonlar + 7 ta bloklangan sayt | kutilmoqda | | |
| E3 | Grantlar: bloklangan va bo'sh faktlar, CSC kartasi | kutilmoqda | | |
| E4 | Qo'llanma shabloni | kutilmoqda | | |
| E5 | Qo'llanma: Stipendium Hungaricum | kutilmoqda | | |
| E6 | Qo'llanma: GKS | kutilmoqda | | |
| E7 | Qo'llanma: Xitoy hukumati granti (CSC) | kutilmoqda | | |
| E8 | Qo'llanma: MEXT | kutilmoqda | | |
| E9 | Boshqa bakalavr full ride grantlarini izlash | kutilmoqda | | |
| E10 | Yakuniy tekshiruv va hisobot | kutilmoqda | | |

## Keyingi agent uchun eslatma

## Muallif uchun savollar

```

(E0 qatorini BOSHQARUVCHI 0-bo'lim A bandini bajargach "tugadi" qiladi.)
4. QISMLAR
E1. Sxema va UI: Q9 javoblari (HAQIQIY FAKT YOZILMAYDI)

1. `universitetlar` sxemasiga ixtiyoriy maydonlar qo'sh: `kontrakt_eng_past` (Fakt, valyuta bilan), `ielts_holati` ("minimum" | "tavsiya" | "talab_qilinmaydi" | "topilmadi"), `ielts_tavsiya` (Fakt), `foundation_kerak` (Fakt: "ha" | "yo'q" | "dasturga_qarab").
2. "Menga mos universitet" filtrini yangila:
   * xarajat: AQSH uchun `yillik_xarajat`; UK va Koreya uchun "kamida" = `kontrakt_eng_past` + davlat kartasidagi `viza_yashash_summasi` (`kurslar.json` orqali USD'ga). Kartada "kamida" so'zi va hisobning tarkibi ko'rinadi. Biror qism tasdiqlanmagan bo'lsa, universitet "Ma'lumot tekshirilmoqda" guruhiga tushadi.
   * IELTS: 1-bo'lim, 2-band qoidasi bo'yicha.
   * `foundation_kerak` "ha" bo'lsa: "Foundation yili kerak" belgisi.
3. To'liq ehtiyojga asoslangan yordam turidagi universitet kartalariga 1-bo'lim, 4-banddagi izohni qo'sh.
4. Grant va universitet deadline'lari o'tgan bo'lsa: "Bu yilgi muddat o'tgan, keyingisi hali e'lon qilinmagan".
5. Davlatlar sxemasida `grant.izoh` ni ixtiyoriy Fakt qil (hozir u oddiy matn yoki bo'sh). Davlat kartasida, agar `davlat_grantlari` bo'sh bo'lsa va `grant.izoh` Fakt sifatida bo'lsa: 1-bo'lim, 7-banddagi matn (sana va manba havolasi bilan).
6. Mavjud testlarni buzma; yangi mantiq uchun test qo'sh (soxta fixture bilan). Tayyor mezonlari: build, test, check o'tadi; mavjud ma'lumot fayllari sxemadan o'tadi; haqiqiy fakt yozilmagan.

E2. Universitetlar: yangi maydonlar + 7 ta bloklangan sayt

1. 30 ta universitetning har biri uchun `ielts_holati` ni rasmiy sahifaga qarab to'g'ri qo'y. Q9 da "topilmadi" bo'lgan, lekin aslida "tavsiya" yoki "talab qilinmaydi" bo'lganlar (KAIST, Yale, Purdue, Harvard) qayta ko'rib chiqiladi.
2. UK va Koreyaning 20 ta universiteti uchun `kontrakt_eng_past`. UK'ning 10 ta universiteti uchun `foundation_kerak` (Koreya uchun ham rasmiy sahifada yozilgan bo'lsa).
3. Sayti ochilmagan 7 ta universitet (Oxford, UCL, Hanyang, Korea University, Kyung Hee, Inha, Pusan National): 2-bo'lim, 1-qoida bo'yicha qayta urin va hamma maydonlarni to'ldir. Baribir ochilmasa, fayl qoladi, holat faylida qaysi usullar sinalgani yoziladi.
4. Leeds stipendiyasi: O'zbekiston uchun ochiqligini rasmiy sahifada tekshir. Tasdiqlanmasa, ko'rsatilmaydi.
5. Ishni universitetma-universitet bajar. Kontekst tugasa, "qisman" statusi bilan to'xta va qaysilari tugaganini yoz. Tayyor mezonlari: 30 ta universitetda yangi maydonlar bor (qoralama yoki topilmadi); 7 ta sayt uchun natija yozilgan; tasdiq ro'yxati yangilangan; build o'tadi.

E3. Grantlar: bloklangan va bo'sh faktlar, CSC kartasi

1. Xitoy hukumati granti (CSC): 2-bo'lim, 1-qoida bo'yicha (campuschina.org, csc.edu.cn, Xitoyning O'zbekistondagi elchixonasi, Xitoy Ta'lim vazirligi). Grant kartasini (`turi: "davlat"`, `davlat: "xitoy"`) yarat va Xitoy davlat kartasiga bog'la. Hech qanday rasmiy sahifa ochilmasa: karta baribir yaratiladi, `rasmiy_havola` va hamma faktlar "topilmadi" holatida.
2. Faktlari "topilmadi" bo'lgan grantlarni qayta urin: GKS deadline, MEXT deadline (Yaponiya elchixonasi), Fulbright, DAAD, Avstraliya RTP, Study in Saudi, MAECI (O'zbekiston mos davlatlar ro'yxatida bormi).
3. Australia Awards: O'zbekiston ro'yxatda bormi, tekshir. Bo'lsa, karta yarat.
4. Kanada va Singapur: 1-bo'lim, 7-band bo'yicha "topilmadi" izohini tekshirilgan rasmiy sahifa havolasi bilan yoz.
5. Har grantga `daraja` (bakalavr / magistr / ikkalasi) rasmiy matn bo'yicha to'g'ri qo'yilganini tekshir. Tayyor mezonlari: CSC kartasi bor; har bir urinish natijasi holat fayliga yozilgan; tasdiq ro'yxati yangilangan; build o'tadi.

E4. Qo'llanma shabloni (HAQIQIY FAKT YOZILMAYDI)

1. Mavjud `src/pages/uz/top-admission/turkiye-burslari/` sahifasini namuna sifatida o'rgan: tuzilishi, bo'limlari, uslubi. Unga TEGMA.
2. `grantlar` sxemasiga ixtiyoriy `qollanma` bo'limini qo'sh. Unda bo'lsin:
   * `kim_topshira_oladi`: Fakt ro'yxati (fuqarolik, yosh, ta'lim darajasi, baholar, til talabi)
   * `nimani_qoplaydi_batafsil`: Fakt ro'yxati (o'qish to'lovi, stipendiya summasi, yotoqxona, sug'urta, aviachipta)
   * `hujjatlar`: Fakt ro'yxati
   * `bosqichlar`: ro'yxat {nom, tavsif, sana (Fakt)}
   * `ariza_yoli`: Fakt (ariza qayerga beriladi: portal, elchixona yoki universitet)
   * `rasmiy_faq`: ixtiyoriy, faqat rasmiy FAQ'dan {savol, javob (Fakt)}
   * `rasmiy_havolalar`: ro'yxat {nom, url}
3. Bitta umumiy qo'llanma sahifa shabloni (masalan, `.../top-admission/grantlar/[slug]/`). Sahifa `qollanma` bo'limi bor grantlar uchun yaratiladi. Har fakt umumiy Fakt komponenti orqali (manba va sana bilan), tasdiqlanmagan faktlar o'rnida "Ma'lumot tekshirilmoqda".
4. Bosqichlar vizual vaqt chizig'i (timeline) ko'rinishida bo'lsin. Telefonda vertikal, noutbukda ham o'qish oson bo'lsin.
5. Grantlar katalogidagi kartaga "To'liq qo'llanma" tugmasi qo'shiladi (`qollanma` bo'lsa). Türkiye Bursları kartasi esa mavjud sahifasiga olib boradi.
6. Sahifa tepasida ogohlantirish: "Grant shartlari har yili o'zgaradi. Topshirishdan oldin rasmiy sahifani tekshiring."
7. Sinov: soxta fixture bilan sahifani tekshir (fixture commit qilinmaydi). Tayyor mezonlari: shablon ishlaydi; 375px va 1280px; build va test o'tadi; haqiqiy fakt yozilmagan.

E5–E8. Qo'llanma kontenti (har biri alohida qism)

* E5: Stipendium Hungaricum (`stipendium-hungaricum`). Manba: stipendiumhungaricum.hu (D-holatdagi WP REST maslahatini ham o'qi), O'zbekiston tomonidan nomzodlarni tavsiya qiluvchi rasmiy organ sahifasi (agar ochilsa).
* E6: GKS (`global-korea-scholarship`). Manba: studyinkorea.go.kr, NIIED rasmiy e'lonlari va qo'llanma PDF'lari, Koreyaning O'zbekistondagi elchixonasi. Bakalavr (Undergraduate) yo'nalishiga e'tibor qarat.
* E7: Xitoy hukumati granti (CSC kartasi E3 da yaratilgan). Manba: 2-bo'lim, 1-qoida. Hech biri ochilmasa: qo'llanma bo'limlari "topilmadi" bilan yaratiladi, sahifa "Ma'lumot tekshirilmoqda" ko'rsatadi; holat faylida sinalgan usullar ro'yxati beriladi; status baribir "tugadi" (to'siq emas).
* E8: MEXT (`mext`). Manba: studyinjapan.go.jp, mext.go.jp, Yaponiyaning O'zbekistondagi elchixonasi. Bakalavr (Undergraduate) yo'nalishiga e'tibor qarat.

Har bir qism uchun:

1. `qollanma` bo'limini to'ldir, hamma fakt "qoralama" holatida, aynan ibora va sana bilan.
2. Grant kartasining asosiy faktlarini (nimani_qoplaydi, toliq_qoplaydi, deadline, daraja) ham yangila, agar yangi rasmiy ma'lumot topilsa.
3. Qo'llanma sahifasi build'da yaratilishini va to'g'ri ko'rinishini tekshir.
4. `npm run malumot:tasdiq`. Tayyor mezonlari: `qollanma` bo'limi bor; har bo'lim "qoralama" yoki "topilmadi" faktlardan iborat; sahifa build'da bor; build o'tadi.

E9. Boshqa bakalavr full ride grantlarini izlash

1. 15 ta davlatning har biri uchun: bakalavr darajasida, O'zbekiston fuqarolari uchun ochiq va rasmiy matnda "to'liq qoplaydi" (fully funded, full scholarship) deb yozilgan davlat grantini FAQAT rasmiy manbalardan izla. Study in Saudi'ning "Full Scholarship" turini ham shu yerda tekshir.
2. Shartga to'liq mos keladigan va 15 ta davlat ichida bo'lgan har bir grant uchun karta va to'liq `qollanma` yarat (E5–E8 qoidalari bo'yicha). Kontekst yetmasa, "qisman" bilan to'xta.
3. 15 ta davlatdan TASHQARIDAGI davlatlarda topilgan grantlar uchun karta YARATMA. Ularni `docs/rejalar/qoshimcha-grantlar.md` fayliga yoz: nom, davlat, rasmiy havola, O'zbekiston ochiqligini tasdiqlovchi ibora, daraja. Muallif uchun savol yoz: "15 ta davlatdan tashqarida N ta bakalavr full ride grant topildi (qoshimcha-grantlar.md). Ular uchun yangi davlat kartasi va qo'llanma qilinsinmi?" Bu savol ishni to'xtatmaydi. Tayyor mezonlari: har 15 davlat uchun natija yozilgan (topildi / topilmadi va sabab); topilganlarning kartasi va qo'llanmasi bor; build o'tadi.

E10. Yakuniy tekshiruv va hisobot

1. `npm run build`, `npm test`, `npm run check`, `npm run malumot:tekshir`, `npm run malumot:tasdiq`.
2. Yangi `source_url` havolalarini tekshir (ochiladimi), faqat hisobot sifatida.
3. Yangi sahifalarni taqiqlangan iboralarga tekshir (D-reja 2-bo'lim, 4-qoida). Filtrdagi "qabul ehtimoli emas" ogohlantirishi bundan mustasno.
4. `docs/rejalar/admission-e-yakun.md` faylini yarat: nima qurildi (sahifalar va yo'llar); qo'llanmalar ro'yxati; faktlar soni holat bo'yicha; hali ochilmagan saytlar; muallif uchun hamma ochiq savollar (E9 savoli ham); muallifning qo'lda qiladigan ishlari (tasdiq ro'yxatini Cmd+F bilan tekshirish, inPAY sinovlari, Q0 bo'yicha huquqchi maslahati).
5. `CLAUDE.md` dagi `<!-- admission-e: boshlanish -->` va `<!-- admission-e: tugash -->` orasidagi blokni (belgilari bilan birga) o'chir. Agar CLAUDE.md faqat shu blok uchun yaratilgan bo'lsa, faylni o'chir.
6. Hisobotda (BOSHQARUVCHI uni muallifga yetkazadi) oddiy tilda yoz: nima tayyor; nechta fakt tasdiq kutmoqda va tasdiq ro'yxati qayerda; muallif uchun savollar; PR #198 ni ko'rib chiqib merge qilish bo'yicha keyingi qadam. MERGE QILMA. Tayyor mezonlari: hisobot fayli bor; build o'tadi; CLAUDE.md blok olib tashlangan; E-holat faylida hamma qismlar "tugadi".
