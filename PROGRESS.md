# Homepage redesign

## Amaldagi qaror — Google va email/parol

Muallif mablag' yo'qligini bildirib, Google va mavjud email/parol bilan davom etishni tasdiqladi (2026-11-21). Telegram va SMS login bekor qilindi. Quyidagi oldingi Telegram/telefon bosqichlari tarixiy qayd, ularning sozlash va nashr qadamlari endi bajarilmaydi.

- Login dialog Google tugmasi va mavjud email/parol sahifasi havolasiga soddalashtirildi. Qaytish manzili, query/hash va to'lov davomiyligi saqlanadi.
- Telegram widget callback kodi, bot konfiguratsiyasi, Edge Function, migratsiya, testlar, config bloki, rang tokeni va Telegram maxfiylik qoralamasi olib tashlandi.
- Telegram migratsiyasi jonli bazaga qo'llanmagan va funksiya nashr qilinmagan. Ushbu o'zgarish uchun yangi xizmat, SMS provayderi yoki secret kerak emas.
- Maxfiylik siyosatidagi Telegram `[TEKSHIRING]` paragrafi olib tashlandi. Faqat narx yuklanmay qolish holatidagi Pro placeholderlari mavjud.
- Yakuniy tekshiruv natijalari fayl oxiriga yoziladi.


Branch `homepage-redesign`, asos `origin/main`, 2026-11-21. Faqat lokal commitlar. Muallifning besh qismni to'xtamasdan bajarish topshirig'i interaktiv spetsifikatsiyaga ham ruxsat sifatida qabul qilindi.

## 1-qism — tugadi

### Kod xaritasi

- Umumiy header va yon panel `src/components/BolimYon.astro`, `Menyu.astro` uni o'raydi. `Asosiy.astro`, `BolimQobiq.astro`, `IeltsFokus.astro` foydalanadi.
- Bosh sahifa, hero va eski kartalar `src/pages/uz/index.astro`. Bino `Bino.astro`. Qavat dropdownlari `navigator/QavatMenyu.astro`.
- Muddatlar `DeadlineRoyxati.astro`, ma'lumot `src/data/deadline.ts`, manbalar `manbalar.ts`. Mazmun va sanalar saqlanadi.
- Google login `src/lib/hisob.ts` (`googleBilanKirish`, PKCE), `hisob/GoogleTugma.astro`, `/uz/hisob/callback/`, `/uz/hisob/rozilik/`. Email/parol sahifalari saqlanadi.
- Mavzu `BolimYon.astro`, boshlang'ich sinxron skript `BoshQism.astro`, kalit `tayanch:mavzu`. Hisob `tayanch:auth`.
- inPAY `src/lib/sat/tolov.ts`, `supabase/functions/tolov-yaratish/`, kirish `/uz/sat/hisob/obuna/`. So'rov faqat plan_code va period yuboradi, summa serverda.
- Boshlanish yo'llari `/uz/top-admission/`, `/uz/sat/`, `/uz/ielts/`, `/uz/eyuf/`, `/uz/ai-academy/`. IQ `/uz/eyuf/iq/`.
- Mavjud uch qadamli Navigator `src/lib/navigator/boshqaruv.ts`, `navigator/YolXaritasi.astro`, saqlash `tayanch:navigator-yol:v1`. Bosh sahifadagi popup olib tashlanadi, alohida chooser yo'liga ko'chiriladi. Eski saqlangan progress o'chirilmaydi.

### Haqiqiy bepul va Pro

- Top Admission kursi, grantlar va qo'llanmalar ochiq. SAT interaktiv Math/R&W darslari va lokal xato daftari ochiq. IELTS Reading va darslar ochiq. EYUF IQ ochiq. Bularning kartalari `free=true`.
- AI Academy `src/data/aiAcademy.ts` da yagona kurs `tez-orada`, `bepulDarslar=null`. `free=false`, ochiq kurs va'dasi qo'shilmaydi.
- `20261111090000_tariflar_p19.sql` Pro narxi 59000, davri 30 kun. `docs/tarif-qoidalari.md` ham shu qiymat. Amaldagi narxlar `plans` bazasidan olinadi. Max faol emas. Homepage faqat Bepul va Pro ko'rsatadi.
- `docs/tarif-qoidalari.md` va `20261111120000_analitika.sql` Pro uchun `analytics_extended` beradi. Free va Pro savol/sessiya/so'z/reja/mock limitlari kalit yo'q bo'lganda cheklovsiz.
- AI Tutor barcha tariflarda kalitlar yo'q bo'lsa yopiq. Free 3/30 va Pro 30/300 hujjatda faqat taklif, amaldagi limit emas. Reklamada ishlatilmaydi.
- IELTS Writing bepul hisob uchun kunlik limit `ai_settings.ielts_writing_daily` dan, SAT Pro bilan bog'lanmagan. Haqiqiy qiymatni tasdiqlamasdan marketing soni kiritilmaydi.
- Jonli bazaning hozirgi qiymatlari o'qilmadi. Homepage narx/Pro afzalliklari ommaviy `plans` so'rovi bilan olinadi, sozlanmagan holatda ko'rinadigan placeholder ishlatiladi.

### Dizayn qarorlari va ochiq masalalar

- Promptdagi “Manrope already used” kodga mos emas. Mavjud self-hosted Onest va DS tokenlari saqlanadi. Yangi UI uchun yetishmayotgan tokenlar qo'shiladi.
- Telegram bot username berilmagan. Sozlashgacha login tugmasi aniq placeholder bilan o'chiq.
- EYUF fayllari boshqa chatda band, bu ish ularni tahrirlamaydi. Faqat mavjud IQ yo'liga havola beradi.

## Xatti-harakat spetsifikatsiyasi

1. Desktop bitta pill nav, route bo'yicha faol band, bir vaqtda bitta dropdown.
2. Dropdownlar button, aria-expanded, Tab va yo'nalish tugmalari, Escape va tashqariga bosish bilan yopiladi.
3. Mobil hamburger oltita bandni va kengayadigan subhavolalarni ochadi, mavzu tugmasi shu menyuda.
4. Til tanlovi faqat o'zbekcha, English va Русский o'chiq va Tez orada bilan.
5. Login dialog yopiq/ochiq/band/xato holatlari, native modal fokus qamrovi va ochuvchiga fokus qaytishi.
6. Google mavjud PKCE orqali, Telegram serverda tekshirilib Supabase sessiyasiga aylanadi. Rozilik/yosh darvozasi saqlanadi.
7. Pro login talab qilsa dialog, keyin mavjud server checkout. Bekor qilish to'lov yaratmaydi.
8. Yangi parol/token saqlash yo'q. Mavjud `tayanch:auth`, `tayanch:mavzu`, `tayanch:sat-tolov` va qaytish kaliti ishlatiladi.

## 2-qism — tugadi

- `BolimYon.astro`, `navigator/QavatMenyu.astro`, yangi `HeaderAmallar.astro`, `tokens.css` va homepage eski nav sloti yangilandi.
- Hamma umumiy qoliplarda oltita bandli pill nav, route holati, til dropdown va hisob havolasi. Mavjud subhavolalar qayta ishlatildi. SAT subhavolalari inglizcha qoladi, yangi header matni o'zbekcha.
- Desktop hamburger yashirildi. Mobil menyuda oltita bo'lim va joriy sahifaning mavjud navigatsiya/hisob/Suhbatdosh qismlari saqlandi. Mavzu bitta DOM tugma bilan menyuga ko'chadi, kalit o'zgarmaydi.
- Kirish hozircha mavjud login yo'liga ishlaydi. 4-qism dialog bilan bog'laydi.
- IELTS Writing kunlik standart limit migratsiyada 2 (`20261119120000_ielts_writing_baho.sql`), amaldagi qiymat server sozlamasida. AI Pro afzalligi qilib ko'rsatilmaydi.
- UI brauzer tekshiruvi 5-qismda.

## 3-qism — tugadi

- Homepage `src/pages/uz/index.astro` ixcham hero, beshta to'liq havola-karta, yordamchi havola, o'zgarmagan DeadlineRoyxati va ikki tarif bilan qayta qurildi. Footer saqlandi.
- Kartalar bitta manbada `src/data/boshSahifa.ts`. EYUF faqat mavjud `/uz/eyuf/iq/` ga boradi. AI Academy bepul belgisisiz.
- `src/pages/uz/yol-tanlash/index.astro` mavjud Navigator komponentlarini ishlatadi. Progress kaliti va sinxron mantiq o'zgarmadi. Bosh sahifa popup/roadmap va bino importlari olib tashlandi.
- `BoshTariflar.astro` narx/davr/afzallikni faol SAT Pro `plans` qatoridan oladi. Kengaytirilgan analitika faqat server bayrog'i bo'lsa ko'rsatiladi. Yillik/kunlik chegirma yoki AI va'dasi yo'q. Kunlik ekvivalent haqiqiy narx/davrdan yaxlitlanadi.
- Ommaviy Supabase sozlamasi yo'q yoki so'rov ishlamasa `[TO'LDIRING: Pro narxi va davri]`, `[TO'LDIRING: Pro imkoniyatlari]` ko'rinadi va to'lov o'chiq. Mavjud server checkout ishlatiladi. 4-qism login hodisasini ulaydi.
- Font talabi bo'yicha mavjud Onest saqlandi, Manrope repoda yo'q. Maket qiymatlari yetishmagan tokenlar sifatida `tokens.css` ga qo'shildi.

## 4-qism — tugadi

- `hisob/KirishDialog.astro`, `src/lib/kirishDialog.ts`, `telegramLogin.ts`, `hisob.ts`, `hisobHolat.ts`: native dialog, fokus/Escape, mavjud Google PKCE, Telegram callback → Edge Function → verifyOtp. Email/parol uchun mavjud sahifa ham ochiq.
- `supabase/functions/telegram-auth/{verify,handler,index}.ts`, `20261121180000_telegram_login.sql`, `supabase/config.toml`: HMAC-SHA256, 600 soniya, 30 soniyadan ortiq kelajakni rad etish, cheklangan so'rov hajmi, CORS, generic xatolar. Log faqat bosqich kodi.
- `telegram_id` nullable/unique, yangi auth foydalanuvchi triggerida server app_metadata'dan atomik yoziladi. Bir paytdagi yangi kirishlar va takroriy urinishlar profil claimini qayta tekshiradi. Email kolliziyasidagi boshqa hisob olinmaydi. Har login oldidan app_metadata mosligi tekshiriladi.
- Mavjud own-profile SELECT/UPDATE RLS va ustun grantlari saqlandi. Telegram identifikatori mijoz tomonidan o'zgartirilmaydi. Ism/username/photo serverda yoziladi. Oddiy mavjud profil tahriri ishlaydi.
- generateLink magiclink xat yubormaydi, faqat hashed_token javobi. Brauzer verifyOtp bilan bir xil Supabase sessiya kalitini ishlatadi. Yosh va rozilik darvozasi chetlab o'tilmaydi.
- IP bo'yicha avvaldan umumiy rate-limit naqshi topilmadi. IP cheklovi qo'shilmadi. Jonli yoqishdan oldin gateway himoyasini ko'rib chiqish kerak.
- Bot username va ochiq raqamli bot ID berilmagan. `src/data/telegramLogin.ts` da bo'sh. Token so'ralmadi/o'qilmadi. Telegram tugmasi sozlanmaguncha o'chiq va placeholder ko'rinadi.
- `src/pages/uz/maxfiylik/index.astro` da Telegram ma'lumotlari haqidagi `[TEKSHIRING]` qoralama qo'shildi.
- Promptdagi Telegram #2AABEE ustida oq matn 4.5:1 bermaydi. Kontrast talabi uchun DS tokenida quyuqroq #086BA4 tanlandi.
- Rasmiy JS widgetning `Telegram.Login.auth` callback API'si ishlatiladi. Custom matnli tugmadan popupni sinxron ochadi, redirect yoki botga xabar yuborish ruxsati so'ramaydi. Birinchi marta Telegramning o'zi tasdiq so'rashi mumkin.
- Native Telegram Supabase provider ro'yxatida yo'q. Custom OIDC bor, lekin bu tayyor Telegram provider emas. Topshiriqdagi widget/HMAC fallback tanlandi. Telegramning yangi Login hujjati legacy widget sahifasiga arxiv havolasi beradi.

### Rasmiy manbalar, tekshirilgan 2026-11-21

- Telegram widget, callback va imzo https://core.telegram.org/widgets/login-legacy
- Rasmiy widget JS callback API https://telegram.org/js/telegram-widget.js?22
- Supabase provider ro'yxati https://supabase.com/docs/guides/auth/social-sign-in
- Supabase generateLink https://supabase.com/docs/reference/javascript/auth-admin-generatelink
- Supabase verifyOtp https://supabase.com/docs/reference/javascript/auth-verifyotp

Boshlang'ich tekshiruv 147 sahifali build, mavjud 399/399 test va Telegram HMAC/HTTP 4/4 test. Qo'shimcha account/race testlari va to'liq brauzer sinovi 5-qismda.

## 5-qism — tugadi

### Yakuniy tekshiruvlar

- `PATH=/opt/homebrew/bin:$PATH npm run build` muvaffaqiyatli, **147 sahifa**, 2026-11-21 yakuniy tekshiruv. Eski katta chunk va `/uz/sat/hisob/profil` dublikat marshrut ogohlantirishlari qoladi.
- `npm test` **399/399**. `npm run funksiyalar:tekshir` **115/115**, shu jumladan Telegram **8/8**. Deno barcha funksiyalarni va yangi `telegram-auth/index.ts` ni tekshirdi.
- `npm run check` **4 eski xato**, o'zgartirilgan fayllarda yangi xato yo'q. Xato fayllari origin/main bilan bir xil ekanligi git orqali tekshirildi — `src/data/satDarslar/tekshiruv.ts:61`, `src/lib/savolBankiMock.ts:62`, `src/lib/navigator/boshqaruv.ts:83`, `src/pages/uz/sat/vosita/takrorlash/index.astro:409`.
- `npm run repo:tekshir` muammosiz. `git diff --check` muammosiz.
- Izolyatsiyalangan headless Chrome. 390×844 va 1440×900, yorug'/qorong'i. Beshta karta birinchi ekranda ko'rinadi. 1024px header ham toshmaydi. Telefon ko'rinishida oxirgi kartaning pastki cheti 676px, desktopda kartalar bir qatorda.
- Bosh sahifa axe WCAG 2 A/AA va 2.1 AA tekshiruvi har ikki asosiy o'lcham/mavzuda **0 buzilish**. Oltita bo'lim headeri × 2 o'lcham × 2 mavzu, **24 holat, 0 buzilish**. Login dialog va ochiq mobil menyu **0 buzilish**. Matn kontrasti axe orqali tekshirildi.
- Dastlab mavzu tugmasi JS orqali headerga ko'chgani va font swap sabab kichik siljish topildi. Mavzu tugmasi server HTML'iga joylandi, mavjud Onest latin/symbols fontlari homepage'da preload qilindi. Yakuniy bosh sahifa yuklanish sinovida to'rtta o'lcham/mavzu kombinatsiyasida **CLS 0**. Tarmoq tezligi sun'iy sekinlashtirilmagan.
- Dropdown ArrowDown, Escape, tashqi bosish mantiqi, til variantlari, mobil bo'lim kengayishi, theme saqlashi, dialog Tab/Shift+Tab qamrovi, yopilganda fokus qaytishi tekshirildi. Mavjud yo'l tanlash vositasi alohida sahifada ochildi.
- Karta, barcha ochiq asosiy nav subhavolalari va footer ichidagi **77 noyob ichki URL**, hammasi HTTP 200. Ildiz logo mavjud `/` redirectiga olib boradi.
- Brauzer `pageerror` hodisasi **0**.
- Alohida vaqtinchalik build va soxta Telegram/Supabase/inPAY javoblari bilan 59000/30 narx, kuniga 1967, Pro bayrog'i, login bekor qilishda to'lov yaratilmasligi, Telegram callback → verifyOtp → aynan bitta checkout, generic xatodan qayta urinish, hisob sarlavhasi yangilanishi va query/hash saqlanishi tekshirildi. Hech qanday haqiqiy to'lov yoki hisob yaratilmagan. Fixture bot/URL/key repoga kiritilmagan.
- Telegram server testlari buzilgan imzo, eskirgan/kelajakdagi auth_date, noto'g'ri ID, optional maydonlar, CORS, katta/yaroqsiz tana, mavjud/yangi foydalanuvchi, parallel yaratish retry, begona email kolliziyasi, app_metadata nomuvofiqligi va qisman xatoda sessiya berilmasligini tekshiradi. Database concurrency sinovi mock asosida, PostgreSQL'da bajarilmagan.
- Kuzatilayotgan manba va dist matnlarida Telegram bot tokeni formatiga mos satr topilmadi. `TELEGRAM_BOT_TOKEN` ning bajariladigan koddagi yagona ishlatilishi `supabase/functions/telegram-auth/index.ts`. Haqiqiy token o'qilmagan va berilmaganligi uchun uning aniq qiymati bo'yicha qidiruv qilinmadi.

### Yakuniy o'zgarishlar

- Tekshiruvda topilgan query/hash yo'qolishi va yopilgan dialogdan kechikkan callback davom etishi tuzatildi. Bloklangan Telegram popupi uchun vaqt tugashi va qayta urinish mavjud.
- Joriy bo'limning mavjud yon paneli desktop dropdownidagi “Joriy bo'lim menyusi” orqali ochiladi. Shu bilan hisob, upgrade va Suhbatdosh kirishlari saqlanadi. Desktopda hamburger ko'rsatilmaydi.
- Font va Telegram rang qarorlari yuqorida qayd etildi. Mavjud Onest saqlandi. Oq Telegram matni uchun kontrastga mos quyuq ko'k ishlatildi.
- Ish `homepage-redesign` branchida beshta lokal commitga bo'lindi. Push, merge, sayt/Edge Function nashri va jonli migratsiya bajarilmadi.

### Barcha placeholderlar

1. `src/data/telegramLogin.ts` — `username: ''`, `botId: null`. Dialogda `[TO'LDIRING: Telegram bot username va ID]`, `src/components/hisob/KirishDialog.astro`.
2. `src/components/BoshTariflar.astro` — `[TO'LDIRING: Pro narxi va davri]`, `[TO'LDIRING: Pro imkoniyatlari]`. Faol `plans` javobi kelganda haqiqiy qiymatlarga almashadi. Xato/sozlanmagan holatda qoladi, checkout o'chiq.
3. `src/pages/uz/maxfiylik/index.astro` — Telegram ma'lumotlari paragrafi `[TEKSHIRING]…[/TEKSHIRING]` bilan belgilangan.

### Javohir uchun qo'lda bajariladigan qadamlar

1. Mavjud Tayanch botini login uchun ishlatish yoki @BotFather'da alohida bot yaratish. Bot nomi/logo Tayanch bilan mosligini tekshirish.
2. @BotFather'da `/setdomain` orqali `tayanchedu.uz` ni belgilash. Legacy widget rejimini tekshirish. Yangi OIDC rejimi bu implementatsiya bilan ishlatilmaydi.
3. Ochiq username va raqamli bot ID ni `src/data/telegramLogin.ts` ga kiritish. Bot tokenini ushbu faylga yozmaslik.
4. Supabase Secrets'da `TELEGRAM_BOT_TOKEN` ni qo'yish. Mavjud server service-role sozlamasi ishlashini tekshirish. Kalitlarni repo yoki brauzerga kiritmaslik.
5. Jonli migratsiyalar ro'yxatini solishtirib, dry-run va sinov bazasidan keyin `supabase/migrations/20261121180000_telegram_login.sql` ni qo'llash. Google/email yangi foydalanuvchi triggeri, o'z profiliga RLS va Telegram ID ning mijozdan o'zgarmasligini haqiqiy bazada tekshirish.
6. `telegram-auth` Edge Function'ini `verify_jwt=false` sozlamasi bilan nashr qilish. CORS origin `https://tayanchedu.uz`. IP bo'yicha gateway rate-limit bu versiyada yo'q, ommaviy yoqishdan oldin sozlashni kelishish.
7. `[TEKSHIRING]` maxfiylik paragrafini va yangi UX matnlarini ko'rib chiqish. SAT Pro butun sayt obunasi emasligi, faqat SAT uchunligi matnda ko'rsatilgan.
8. Ishni review qilib, so'ng `homepage-redesign` ni `main` ga birlashtirish. Mavjud CI ochiq Supabase URL/key bilan build qiladi. Yangi bot konfiguratsiyasi ham buildga kirishi kerak. Main push saytda A1 kursini flagsiz o'chirishi haqidagi mavjud HANDOFF tartibini hisobga olish.
9. Jonli saytda Telegram birinchi/qayta login, Google, email/parol, yangi hisob rozilik/yosh bosqichi, saqlangan progress, Pro checkout/obuna holatini haqiqiy hisob bilan tekshirish. Haqiqiy checkoutni muallif tasdig'i bilan bajarish.

### Keyingi ishlar va sinalmaganlar

- Google va Telegram hisoblarini bog'lash ushbu versiyadan tashqarida, avtomatik birlashtirish yo'q.
- English va Русский tillari hozircha o'chiq. Keyin `HeaderAmallar.astro` dagi til ma'lumotlari kengaytiriladi.
- Uch savolli chooser qurilgan mavjud vositadan qayta ishlatildi, alohida yangi quiz kerak emas.
- AI Academy ochiq dars chiqarganda kartadagi free qiymatini qayta tekshirish. Hozir false.
- IP rate-limit, bir martalik Telegram payload replay himoyasini kuchaytirish alohida ish. Hozir imzo va 600 soniya amal qiladi.
- Jonli Telegram/Google/inPAY, migratsiyaning haqiqiy bazaga tatbiqi, haqiqiy telefon va VoiceOver sinalmagan. Tarmoq sekinligida font yuklanishi alohida emulyatsiya qilinmagan.
- Ko'rib chiqish skrinshotlari va test loglari vaqtinchalik `/private/tmp/homepage-*` fayllarida. Asosiy saqlanadigan hisobot ushbu fayl.

## Yo'nalish o'zgarishi — 2026-11-21

Muallif Telegram login fikridan qaytdi va telefon raqami + SMS-kod bilan kirishni taklif qildi. Telegram sozlash/nashr ishlari shu qaror bilan bekor bo'ldi. Supabase'da yozuvli amal, migratsiya yoki Edge deploy bajarilmadi. Read-only ulanish tekshiruvi transport/DNS xatosi bilan tugadi, secret mavjudligi tasdiqlanmadi. Muallif token hali kiritilmaganini bildirdi.

Telefon OTP Supabase Auth'da mavjud. SMS provayderi kerak. Rasmiy `Send SMS Hook` orqali boshqa provayder ham ulanishi mumkin. Keyingi bosqichda SMS xizmati tanlovi va login xatti-harakati kelishiladi, undan so'ng Telegram UI/backend qoralamasi telefon OTP bilan almashtiriladi. Hozir branchdagi Telegram kodi avvalgi qoralama holatida, jonli yoqilmagan.

Manbalar, tekshirilgan 2026-11-21

- https://supabase.com/docs/guides/auth/phone-login
- https://supabase.com/docs/guides/auth/auth-hooks/send-sms-hook

## Google va email/parol bilan yakun — 2026-11-21

Muallif yangi xizmatlar uchun mablag' yo'qligini bildirdi va faqat Google hamda email/parol loginini tasdiqladi. Telegram/SMS bo'yicha oldingi takliflar va qo'lda sozlash ro'yxatlari bekor qilingan.

- `KirishDialog.astro` — Google asosiy tugma, email/parol mavjud formaga aniq havola. Parolsiz kirish haqidagi umumiy jumla shu ikki usulga moslandi.
- `kirishDialog.ts` — faqat mavjud Google PKCE, modal hodisalari, xavfsiz qaytish manzili va fokus qamrovi. Telegram widget yoki yangi tashqi skript yuklanmaydi.
- Telegram uchun `src/data/telegramLogin.ts`, `supabase/functions/telegram-auth/`, alohida test, `20261121180000_telegram_login.sql`, config bloki, ortiqcha rang tokeni va maxfiylik qoralamasi olib tashlandi. Jonli bazada rollback talab qilinmaydi, bu qoralama migratsiya/nashr avval bajarilmagan.
- Mavjud Google, email/parol, ro'yxatdan o'tish, parolni tiklash va rozilik/yosh darvozasi foydalaniladi. Yangi SMS provayderi yoki bot secretlari talab qilinmaydi.
- Build **147 sahifa**, `npm test` **399/399**, Edge Function testlari **107/107**, Deno check muvaffaqiyatli. Telegramning olib tashlangan 8 testi umumiy Edge sonidan kamaydi.
- `npm run check` **4 eski xato**, yangi tur xatosi yo'q. Xato fayllari origin/main bilan bir xil. `repo:tekshir` va `git diff --check` muammosiz.
- 390×844/1440×900 va ikkala mavzuda 24 header holati axe **0**, bosh sahifa CLS **0**. Dialog va ochiq mobil menyu axe **0**. Fokus Tab/Shift+Tab, Escape, til/bo'lim menyulari, mavzu almashishi, 77 ichki havola HTTP200 qayta tekshirildi.
- Izolyatsiyalangan vaqtinchalik buildda soxta javoblar bilan Google PKCE/code_challenge, query/hash saqlanishi, email/parol → avvalgi Pro tanlovi → aynan bitta checkout tekshirildi. Brauzer pageerror **0**. Haqiqiy Google/email akkaunt va haqiqiy to'lov sinalmagan.
- Jonli sayt, baza va tashqi xizmatlarda o'zgartirish bajarilmadi. Bu qaror uchun migratsiya yoki Edge deploy kerak emas. Homepage va login o'zgarishlari review uchun lokal branchda.

## Nashr ruxsati — 2026-11-21

Muallif “nashr qilda, merge ham esdan chiqmasin” deb push, PR, main merge va production deployni tasdiqladi. Oldingi lokalda to‘xtash cheklovi shu ko‘rsatma bilan yangilandi. Nashr oldi production build mavjud ochiq Supabase sozlamalari va A1 bayrog‘i bilan **157 sahifa** qurdi. Yakuniy jonli natija PR va umumiy xotirada qayd etiladi.
