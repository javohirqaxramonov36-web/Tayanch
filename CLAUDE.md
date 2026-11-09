# Tayanch: ish qoidalari

Til: javoblar o'zbekcha (lotin), qisqa. Kod va fayl nomlari o'z holicha. SAT bo'limining (3-qavat) HAMMA sahifa matni inglizcha (ilova va qo'llanma sahifalari); sahifa yo'llari (URL) va kod nomlari o'zbekcha lotin konventsiya bo'yicha qoladi. Inglizcha matnni muallif tekshiradi. Boshqa qavatlar matni o'zbekcha.

## Joriy holat (2026-11-08)
Yangi sessiyada avval `HANDOFF.md` ni o'qi: nima qurilgan, nima qurilmagan, qarorlar, ochiq savollar, nomlash va texnik eslatmalar.
- Qurilgan va saytda: 1-qavat (bosh sahifa), 3-qavat SAT (PR #7), 4-qavat IELTS (PR #8), Lift (PR #10), Topshirish yo'li vositasi (PR #11, qoralama), 2-qavat Top Admission kirish sahifasi (PR #12, #14: qolgan kun, "Mening yo'lim"; `bolimlar.ts` da `tez-orada`).
- Top Admission'da qolganlari (maket: https://claude.ai/artifact/1zP2rnjMp46RgY9WpD84GF):
  1. Türkiye Bursları yo'nalish sahifasi (`/uz/top-admission/turkiye-burslari/`, maket B "Burslar*"): qurilgan, branch `turkiye-burslari` (2026-11-09), PR kutilmoqda. Faktlar TB01–TB05.
  2. Top Admission yon paneli: `BolimYon` ga `bolim="top-admission"` (maket "LiftSidebar"); shundan keyin kirish va vosita `BolimQobiq` ga o'tadi.
- Interaktiv darslar: 0-bosqich PR #18, SAT Math PR #15, SAT R&W 1–2-modul ("Xatoni toping", "Dalilni belgilang", `DarsQolip` belgilash rejimi) PR #20, R&W 3–4-modul ("O'tish so'zlari", "Lug'at kontekstda") PR #21 da merge qilingan. 2-bosqich SAT Xato daftari va takrorlash (`/uz/sat/vosita/takrorlash/`, kalit `tayanch:sat-takrorlash`) PR #22 da merge qilingan. 3-bosqich IELTS Reading darslari (`/uz/ielts/qollanma/reading/tfng/`, `/sarlavhalar/`, branch `ielts-interaktiv`) PR #23 da merge qilingan. 4-bosqich Top Admission "Ariza zinapoyasi" (`/uz/top-admission/qollanma/ariza-zinapoyasi/`, branch `top-admission-zinapoya`) PR #25 da merge qilingan. Navbatda 5-bosqich EYUF (dizayn yo'q); IELTS va Top Admission takrorlash alohida PR. PR #17 (SAT mashq) alohida, unga tegilmaydi. Standart: `docs/interaktiv-dars-standarti.md` (har yangi dars oldidan o'qiladi), umumiy qolip `DarsQolip`.
- SAT va College Board belgilari (merge qilingan): PR #30 yon panelda College Board rasmiy saytiga matnli havola (CB07), PR #31 har SAT sahifasi pastida `SatEslatma` (CB08, CB09), PR #32 SAT matnida ® / ™ (har sahifada eng ko'zga tashlanadigan joyda bir marta). Ochiq: `<title>` da ® (CB08 da qoida yo'q, muallif qarori), 1-qavatdagi SAT matni hozircha belgisiz (muallif: tegilmaydi). Sinalmagan: axe, VoiceOver, haqiqiy telefon.
- SAT matni inglizchaga (reja muallif tasdiqlagan, 2026-11-08; 5 PR): 1-PR umumiy qism PR #36 da merge qilingan (`src/data/umumiyMatn.ts` uz/en lug'ati, `bolimTili`/`yolTili`, SAT'da `<html lang="en">`, yon panel, `DarsQolip` qolip matni, `ManbaBlok`, `QavatYoli`, `Lift`, `Zina`, `satSahifalar.ts`, kirish va "tez orada" sahifalari). 2-PR Math darslari PR #39 da merge qilingan (4 dars, 21 savol, `sonYozuv.ts` o'nli nuqta va `(x, y)`, `÷`, `cm`). 3-PR R&W darslari PR #45 da merge qilingan (4 dars, 20 savol; qadamlar Example / Rule / Try it; lug'at darsidagi "xavfli", "hal qilmoq" o'zbekcha, `lang="uz"`). 4-PR mashq sahifalari PR #47 da merge qilingan (Test, Savol banki, Lug'at kartalari, `satNamuna.ts`; lug'at kartalaridagi `tarjima` o'zbekcha, `lang="uz"` va "Uzbek:" yorlig'i bilan). Navbatda: 5 `sat-en-vosita`. Har PR'da `docs/tarjima/<branch>.md` (oldin → keyin) va boshqa qavatlar computed style solishtiruvi. Hozircha vositalarda ramka inglizcha, ichi o'zbekcha. PR #35 (`sat-grafik-reset`) grafikka o'zbekcha "Boshlang'ich holat" tugmasini qo'shadi: merge bo'lsa tarjima qilinadi.
- Boshqa qurilmagan: 5-qavat EYUF (dizayn yo'q).
- Yangi qaror (2026-11-08): butun sayt uchun bitta hisob (Supabase), to'lov (inPAY) hozircha faqat SAT'da, SAT matni inglizcha, freemium (Free, Pro, Elite). Batafsil: `docs/qarorlar/001-hisob-tolov-server.md`, HANDOFF §4. P03 (branch `sat-hisob-auth`): email + parol bilan ro'yxat, kirish, parol tiklash, profil (`/uz/sat/hisob/`); Google P03B, profiles jadvali P12, Maxfiylik/Shartlar P23, o'z SMTP P28. Dashboard sozlamalari: `supabase/README.md`.
- Build: `PATH=/opt/homebrew/bin:$PATH npm run build` (standart Node 22 Astro 7 uchun eski).

## Loyiha
- Astro, statik sayt, GitHub Pages. `astro.config.mjs`: base "/Tayanch" (harf katta-kichikligiga sezgir), `trailingSlash: 'always'`.
- Sayt 5 qavatli bino: 1 Navigator, 2 Top Admission, 3 SAT prep, 4 IELTS prep, 5 EYUF prep. Sahifalar `src/pages/uz/<bolim>/`, qolip `BolimQobiq`.
- Dizayn: `DESIGN.md` (tokenlar, komponentlar, "Taqiqlar" bo'limi). Qiymatlar faqat `src/styles/tokens.css` dan, xom rang/o'lcham yozilmaydi.
- Ichki havola faqat `yol()` orqali (`src/lib/yol.ts`). Ma'lumotlar: `src/data/` (`qavatlar.ts`, `bolimlar.ts`, `manbalar.ts`, `deadline.ts`).
- Hisob butun sayt uchun bitta (bir bino, bitta kalit): login email va Google bilan, Supabase Auth. Kirish va profil sahifalari hozircha SAT ichida (`/uz/sat/hisob/`, inglizcha, P03, 2026-11-09); 1-qavatdagi `/uz/hisob/` keyinroq. Har qavatga alohida login yo'q. Supabase sessiya kaliti `tayanch:auth`.
- To'lov va tariflar (Free, Pro, Elite; kvotali freemium) hozircha faqat SAT'da (`/uz/sat/hisob/`, inglizcha), inPAY orqali. Obuna qavatga bog'lanadi (`bolim` maydoni). 2, 4, 5-qavatlarda pullik qism yo'q, ular hozircha o'zgarmaydi.
- Server: Supabase (Auth, Postgres, Edge Functions). GitHub Pages faqat statik joylashtirish bo'lib qoladi. To'lov holati faqat server (Edge Function, inPAY webhook) orqali yoziladi, brauzer to'lovni "tasdiqlay" olmaydi.
- Ma'lumot: hisob bilan kirganda Supabase'da (RLS yoqilgan jadvallarda), hisobsiz holatda faqat brauzerda, kalitlar `tayanch:` bilan boshlanadi. Hisob va to'lov formalaridan tashqari formalar yo'q.
- Kalitlar: brauzerda faqat Supabase ochiq kaliti (publishable/anon) bo'lishi mumkin. service_role/secret kalit, Google client secret, inPAY merchant ma'lumotlari, bearer token va webhook secret faqat Supabase secrets va lokal `.env` da (muallif o'zi qo'yadi). Ularni so'rama, o'qima, repoga, logga yoki javobga yozma.
- Repo hozircha ochiq qoladi (2026-11-08, HANDOFF §5 11-savol): pullik kontent va foydalanuvchi ma'lumoti repoga va statik build'ga yozilmaydi, faqat Supabase'da. Har holda `grants-qoralama.json`, `inbox/`, `.env`, token va parollarni repoga qo'shma.
- Savollar faqat original: AI qoralama yozadi, muallif tekshirib tasdiqlaydi (`verified_by`). College Board materiallari (PDF, JSON, savol, passage, tushuntirish matni) repoga, bazaga, promptga yoki ekranga qo'yilmaydi.
- Kontent siyosati: `docs/kontent-siyosati.md` (CB10, CB11; "o'zgartirib" qayta yozish va "prediction"/sizdirilgan materiallar ham taqiq); commit oldidan `npm run repo:tekshir`, lokal CB fayllari faqat shaxsiy (`docs/lokal-ish-tartibi.md`).
- Natija kafolatlanmaydi. Qoida, talab va muddat faqat rasmiy manbadan, manba va sana bilan.

## Har vazifada tartib (majburiy, men skill nomini yozmasam ham)
1. **Aniqla.** Qaysi qavat/bo'lim va sahifa ekanini aniqla. Aniq bo'lmasa, ko'pi bilan 3 ta savol ber. Faqat kerakli fayllarni o'qi.
2. **Spetsifikatsiya.** Interaktiv funksiya bo'lsa, kod yozishdan oldin 5-8 qatorli xatti-harakat spetsifikatsiyasi yoz (holatlar, hodisalar, klaviatura va telefon xatti-harakati, `localStorage` kaliti `tayanch:...`) va tasdig'imni kut.
3. **Qur.** Pastdagi jadvaldan mos skillni o'zing tanla va ishlat. Katta ishni kichik, mustaqil bosqichlarga bo'l.
4. **Tekshir.** `a11y-check` va `contrast`, so'ng `npm run build`. Telefon va qorong'i mavzuda tekshir.
5. **Hisobot.** Qisqa: nima o'zgardi, qaysi faylda, nima sinalmagan, keyingi qadam.

## Skill tanlash
Bir vazifada bitta asosiy skill. Bir nechta dizayn skillini aralashtirma. Mos skill bo'lmasa, o'zing davom et; skill nomini o'ylab topma.

| Vazifa | Skill |
| --- | --- |
| Yangi sahifa yoki komponent kodi | `frontend-design` |
| Tugma, forma, kartochka kabi interaktiv elementlar xatti-harakati | `interaction-design` |
| Foydalanuvchi yo'li (masalan "Topshirish yo'li") | `journey-mapping` |
| Tayyor sahifani dizayn jihatdan baholash | `design-critique` |
| Qulaylik (a11y) tekshiruvi, kontrast | `a11y-check`, `contrast` |
| Sahifa ishonchliligi va sifati | `website-quality-checker` |
| Tugma va xabar matni (UX yozuvi) | `ux-writing` (o'zbekcha matnni men tekshiraman) |
| Kod tekshiruvi, nosozlik, test rejasi | `code-review`, `debug`, `testing-strategy` |
| Joylashdan oldin | `deploy-checklist` |
| Limit sarfi diagnostikasi | `token-doctor`, `inspect-context`, `find-bloat`: faqat men so'raganimda |

Ishlatma (loyihaga mos emas yoki DESIGN.md bilan zid): `liquid-glass`, `code-to-figma`, `figma-to-code`, `handoff-to-code`, `chrome-*`, PDF Viewer, Productivity, `standup`, `incident-response`. Dizayn uslubi faqat DESIGN.md dan olinadi: gradient, glassmorphism yo'q.

## Limitni tejash
- Fayllarni to'liq o'qima: avval qidir (Grep), keyin kerakli qismini o'qi.
- Hech qachon o'qima: `package-lock.json`. Dizayn maketlari (HTML): faqat men aytgan ekranni.
- Bir vazifa = bitta sahifa yoki komponent.
- Men so'ramasam, subagent va chuqur tadqiqotni ishlatma.
- Javob qisqa.

## Sifat
- "Tayyor" deyishdan oldin `npm run build` natijasini ko'rsat.
- Sinab ko'rmaganingni "sinalgan" dema, "sinalmagan" deb yoz. Aniq bilmagan texnik faktni "tekshirish kerak" deb belgila.
- Tugma faqat `<button>` yoki `<a>`, ikonka emoji emas.
- Uydirma raqam, sana, sharh yo'q. Savol-javob namunalari ekranda "Namuna" deb belgilanadi.
- Bepul va ochiq resurslar afzal.
