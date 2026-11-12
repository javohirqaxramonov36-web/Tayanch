# Xavfsizlik auditi (P26): SAT, hisob va to'lov qatlami

Sana: 2026-11-12. Asos: `origin/main` `bd0159c` (PR #114 dan keyin), branch `sat-xavfsizlik-audit`.
Jonli loyiha: `uvwejvjrsswssgydwevm`. Jonli bazada faqat o'qiydigan so'rovlar bajarildi: hech narsa yozilmagan, sozlama o'zgartirilmagan.
Hujum kodi yoki zararli yuklama yozilmagan. Sinovlar lokal vaqtinchalik Postgres va katalogni o'qish bilan qilingan.

Holat belgilari: **tuzatildi** (shu PR'da), **ochiq** (qaror yoki alohida ish kerak), **sinalmagan** (tekshirib bo'lmadi),
**muammo yo'q** (tekshirildi, topilma yo'q). Jiddiylik: Yuqori / O'rta / Past / Info.

## 1. Qisqa xulosa

- Yuqori darajali topilma yo'q. RLS, RPC huquqlari, to'lov oqimi va savol javoblarini yashirish to'g'ri qurilgan.
  Lokal sinovlar va jonli katalog bir xil natija berdi.
- O'rta: (F01) sayt boshqa 3 ta GitHub Pages sayti bilan bitta origin'da turadi, shuning uchun sessiya tokeni ular bilan umumiy;
  (F02) kirish va ro'yxatdan o'tishda CAPTCHA yo'q.
- Tuzatildi: `repo:tekshir` inPAY kaliti, Supabase access token va parolli Postgres manzilini ham ushlaydi (F15).
  Har yangi jadval yoki RPC uchun ruxsat ro'yxati sinovi qo'shildi (F16).

## 2. Topilmalar

| ID | Jiddiylik | Mavzu | Holat | Qisqacha |
| --- | --- | --- | --- | --- |
| F01 | O'rta | Origin | ochiq | `javohirqaxramonov36-web.github.io` shu GitHub hisobidagi yana 3 ta Pages sayti bilan umumiy. `localStorage` ham umumiy, demak sessiya (`tayanch:auth`: access va refresh token) ular uchun ham ochiq |
| F02 | O'rta | Bot himoyasi | ochiq | Kirish va ro'yxatda CAPTCHA yo'q. Parol bilan kirish `/token` orqali o'tadi: bitta IP'dan 5 daqiqada 150 so'rov (Supabase standarti). Hisob qulflanmaydi |
| F03 | Past | Cheklov | ochiq | `reports`, `feedback`, `events`: authenticated to'g'ridan-to'g'ri yozadi, foydalanuvchiga kunlik chegara yo'q (hajm `check` bilan cheklangan). Hozir saytda bu jadvallarni ishlatadigan forma yo'q |
| F04 | Past | XSS chuqur himoyasi | ochiq | CSP yo'q: GitHub Pages sarlavha bermaydi, `<meta http-equiv>` qo'yilmagan. Sessiya `localStorage` da, flow `implicit` (token URL hash'da keladi). XSS bo'lsa token o'g'irlanishi mumkin. Hozir XSS topilmagan (5-bo'lim) |
| F05 | Past | CORS | ochiq | Edge Function'larda `TOLOV_ORIGINLAR` secret'i o'rnatilmagan, shuning uchun standart ro'yxat ishlaydi va unda `http://localhost:4321` ham bor. Hammasi JWT talab qiladi, shuning uchun bu avtorizatsiyani chetlab o'tmaydi |
| F06 | Past | Redirect | ochiq | Auth Redirect URL ro'yxatida `http://localhost:4321/Tayanch/**` bor (lokal ishlab chiqish uchun). Qolgan manzillar sayt ichida. `xavfsizKeyin` ochiq redirectni yopadi |
| F07 | Past | Cheklov | ochiq | `inpay-holat`: foydalanuvchi bo'yicha so'rov chegarasi yo'q. `pending` to'lov bo'lsa har chaqiruv inPAY API'ga boradi (faqat o'z to'lovi) |
| F08 | Info | Kun savoli | muammo yo'q | `check_daily_answer` anon uchun cheklovsiz va to'g'ri javobni qaytaradi. Bu dizayn bo'yicha: faqat bugungi ochiq savol, boshqa savol rad etiladi |
| F09 | Past | Kvota | ochiq | `review_preview` (jonli bazada, main'da emas; branch `sat-xato-daftari-sync`): `bookmarks` ga istalgan `question_id` qo'shib, savol matnini kvotasiz ochish mumkin. UUID'ni taxmin qilib bo'lmaydi. Javob va tushuntirish berilmaydi |
| F10 | Info | Supabase | muammo yo'q (tekshirish kerak) | `public.rls_auto_enable()` (Supabase'ning `ensure_rls` event trigger'i) anon'da EXECUTE bilan turadi. Funksiya `event_trigger` turida, RPC orqali chaqirilmaydi. Repo uni boshqarmaydi |
| F11 | Info | Migratsiya | muammo yo'q | Jonli bazada main'da yo'q 2 ta migratsiya bor (`20261109120000_questions_p05`, `20261111233000_xato_daftari`). Ikkalasi ham ko'rib chiqildi: `search_path=''`, huquqlar to'g'ri, `correct` va `explanation` qaytarilmaydi |
| F12 | Info | Parol | sinalmagan | Minimal uzunlik 8 (jonli bilan mos). Harf/raqam talabi yo'q. Sizib chiqqan parol tekshiruvi (HaveIBeenPwned) yoqilganmi va Free tarifda bormi: tekshirish kerak |
| F13 | Info | Paketlar | muammo yo'q | `npm audit`: 0 zaiflik. Yangi versiyalar 3-bo'limda |
| F14 | Past | XSS | ochiq | `<script type="application/json" set:html={JSON.stringify(...)}>` 15 joyda ishlatilgan, `<` faqat bitta joyda (`savol-namuna`) qochirilgan. Ma'lumot build paytidagi statik fayllardan keladi, foydalanuvchi matni emas |
| F15 | Past | Kalitlar | tuzatildi | `repo:tekshir` inPAY `sk_live_`/`sk_test_`, Supabase `sbp_` access token va parolli `postgres://` manzilni ushlamas edi |
| F16 | Past | RLS sinovi | tuzatildi | Yangi jadval yoki RPC tasodifan ochilib qolsa ushlaydigan umumiy sinov yo'q edi (`rls_test.sql` faqat ma'lum obyektlarni sinaydi) |

## 3. Bandma-band tekshiruv

### RLS va funksiyalar
| Talab | Holat | Dalil |
| --- | --- | --- |
| Har jadval: ikki foydalanuvchi (A, B) va anon | muammo yo'q (lokal sinalgan) | `rls_test.sql` 02, 06, 07, 10: A/B/anon, 26 jadval. Jonli bazada A/B yozuvli sinov bajarilmadi (yozish talab qiladi): **sinalmagan** |
| RLS hamma public jadvalda yoqilgan | muammo yo'q | Lokal va jonli: 26/26. Jonli bazada `ensure_rls` trigger ham bor |
| `user_id` bor jadval policy'lari `auth.uid()` ga bog'langan | muammo yo'q | X6 (lokal + jonli SELECT) |
| `questions` ga to'g'ridan-to'g'ri SELECT yo'q | muammo yo'q | X5: hech bir ustun anon/authenticated uchun o'qilmaydi (lokal + jonli) |
| `start_session` javobida `correct` yo'q | muammo yo'q | `rls_test` 04: `correct`, `explanation`, `is_correct` yo'q, qoralama savollar ham yo'q. `review_preview` ham javobsiz (F11) |
| SECURITY DEFINER funksiyalarda `search_path` | muammo yo'q | 46 ta definer funksiyaning hammasida `search_path=''` (lokal skript + jonli katalog) |
| anon RPC | muammo yo'q | Jonli: faqat `daily_question_public`, `check_daily_answer` (+ F10) |
| admin va to'lov funksiyalari | muammo yo'q | X3: `admin_*`, `payment_create/set_invoice/apply_event/pending_stale` faqat service_role (lokal + jonli) |
| Server jadvallariga brauzerdan yozish | muammo yo'q | X4: questions, plans, payments, subscriptions, payment_events, usage_counters, audit_log, daily_picks, sessiyalar, vocab_words yopiq; `attempts` faqat `flagged` |
| Storage | muammo yo'q | `question-figures` yopiq, rasm faqat berilgan savol uchun (`rls_test` 08) |

### Kalitlar
| Talab | Holat | Dalil |
| --- | --- | --- |
| Repo'da maxfiy kalit yo'q | muammo yo'q | `repo:tekshir`: 355 fayl, muammo yo'q |
| Git tarixida maxfiy kalit yo'q | muammo yo'q | Hamma ref'lardagi 1600 ta matn blob'i `repo:tekshir` naqshlari va qo'shimcha naqshlar bilan qidirildi (sk_, sbp_, parolli postgres, service_role JWT). Topilma yo'q. Skript faqat fayl nomini chiqaradi |
| service_role faqat Edge Function va lokal skriptda | muammo yo'q | `src/` da yo'q. Ishlatiladigan joylar: `supabase/functions/*/index.ts`, `scripts/lugat-import.mjs` (lokal env'dan). Brauzer faqat `PUBLIC_SUPABASE_URL` va `PUBLIC_SUPABASE_ANON_KEY` oladi (`astro.config.mjs`, Actions Variables) |
| Edge Function secret'lari | muammo yo'q | Faqat nomlari ko'rildi: INPAY_SECRET_KEY, INPAY_WEBHOOK_SECRET, MUVOFIQLASH_SECRET va Supabase o'zi qo'yadiganlari. Qiymatlar o'qilmadi |
| Anon kalitni aylantirish tartibi | ochiq (hujjat) | 7-bo'lim |

### To'lov
| Talab | Holat | Dalil |
| --- | --- | --- |
| Webhook imzosi | muammo yo'q | `inpay-webhook`: HMAC-SHA256 xom tana bo'yicha (`t.` + tana), 5 daqiqalik oyna, doimiy vaqtli solishtirish. Imzo tekshirilmaguncha tana parse qilinmaydi, 64 KB chegara bor. Deno sinovlari |
| Idempotentlik | muammo yo'q | `payment_events.event_id` unique, takror hodisa "duplicate" bo'ladi. `rls_test` 18, 19. 2026-11-10 dagi jonli sinovda takror succeeded obunani uzaytirmagan |
| Summa serverda | muammo yo'q | `tolov-yaratish` tanada summa maydoni bo'lsa so'rovni rad etadi, narx `plans` dan olinadi. Webhook summa, valyuta, livemode va metadata'ni tekshiradi (`rls_test` 18) |
| Qaytish sahifasi obunani yoqmaydi | muammo yo'q | `inpay-holat` faqat o'z to'lovini ko'radi, holatni inPAY'dan server orqali o'qiydi va webhook bilan bir xil `payment_apply_event` orqali qo'llaydi. Brauzer `payments`/`subscriptions` ga yoza olmaydi (X4) |

### XSS
| Talab | Holat | Dalil |
| --- | --- | --- |
| Savol/passage/izoh belgilashi tozalanadi | muammo yo'q | `src/lib/sat/xavfsizMatn.ts`: DOMParser inert hujjat, ruxsat etilgan teglar (`u em strong sup sub br p table thead tbody tr th td`), atributdan faqat `th[scope]`, KaTeX `trust: false`. `savolKorsatkich.ts` innerHTML ishlatmaydi |
| Foydalanuvchi matni (izoh, nickname, so'z) chiqarishda escape | muammo yo'q | Hamma `innerHTML` joylari ko'rib chiqildi: dinamik matn `textContent` yoki `qoch()` orqali o'tadi (natijalar, IELTS reja, IELTS reading, Lift `Number()`). DB'da uzunlik `check` lari bor |
| Chuqur himoya (CSP) | ochiq | F04 |

### Cheklovlar
| Talab | Holat | Dalil |
| --- | --- | --- |
| `submit_answer` | muammo yo'q | `consume_quota(answers)`, atomik (10 parallel so'rov sinovi K06) |
| `report`, `feedback` | ochiq | F03 |
| `daily_question` (mehmon) | Info | Mehmon RPC'sida chegara yo'q, faqat bugungi savol (F08). Kirgan foydalanuvchi uchun kvota bor |
| Kirish urinishlari | ochiq | Supabase standart chegaralari (IP bo'yicha): `/token` 150, ro'yxat/tiklash/resend 30, `/verify` 30 (hammasi 5 daqiqada). Email yuborish jonli bazada soatiga 30, OTP oralig'i 1 daqiqa. Manba: supabase.com/docs/guides/auth/rate-limits (2026-11-12). Hisob qulflanmaydi, F02 |
| Email borligi oshkor bo'lmasligi | muammo yo'q | `xatoMatni()`: kirishda "Email yoki parol noto'g'ri", ro'yxatda umumiy xabar, tiklashda "Agar ... bilan hisob bo'lsa". `email_not_confirmed` faqat parol to'g'ri bo'lganda chiqadi (tekshirish kerak, kodda belgilangan) |

### Sozlamalar
| Talab | Holat | Dalil |
| --- | --- | --- |
| Email tasdiqlash yoqilgan | muammo yo'q | `config.toml` va jonli bazada bir xil (`config diff`: e'lon qilingan sozlamalarda farq yo'q) |
| Parol minimal uzunligi | muammo yo'q | 8, jonli bilan mos (F12) |
| Redirect URL ro'yxati | Past | Jonli bilan mos, F06 |
| CORS | Past | Ruxsat ro'yxati bor, ro'yxatda yo'q origin 403 oladi. F05 |
| Anonim kirish | muammo yo'q | Yoqilmagan (`config diff` farq ko'rsatmadi) |
| MFA (TOTP) | Info | Jonli bazada yoqilgan (Supabase standarti), interfeysda ishlatilmaydi |

### Qaramliklar
`npm audit` (dev bilan ham, `--omit=dev` bilan ham): **0 zaiflik**. O'rnatilgan versiyalar va npm'da chiqqan sanasi:

| Paket | Versiya | Chiqqan | Izoh |
| --- | --- | --- | --- |
| @supabase/supabase-js | 2.119.0 | 2026-11-04 | **juda yangi (8 kun)** |
| astro | 7.4.5 | 2026-11-02 | **juda yangi (10 kun)** |
| katex | 0.19.1 | 2026-10-23 | 20 kun |
| @astrojs/check | 0.9.12 | 2026-10-21 | dev |
| @types/node | 26.6.6 | 2026-10-28 | dev |
| three | 0.186.1 | 2026-09-24 | |
| @fontsource-variable/onest | 5.3.1 | 2026-08-30 | |
| typescript | 6.0.3 | 2026-04-16 | dev |

Edge Function'larda `npm:@supabase/supabase-js@2.118.0`, versiya aniq qotirilgan. `package.json` da `^` diapazonlar bor, lekin `npm ci` lock fayl bilan ishlaydi.
Tavsiya: yangi versiyaga chiqqanidan kamida 7 kun o'tgach o'tish.

## 4. Shu PR'da tuzatilgani

1. `scripts/repo-tekshir.mjs`: 3 ta yangi naqsh qo'shildi (inPAY `sk_live_`/`sk_test_`, Supabase `sbp_`, parolli `postgres://`).
   Soxta qiymatlar bilan alohida papkada sinaldi: hammasi ushlandi. `[YOUR-PASSWORD]` va `<...>` kabi namunalar ushlanmaydi.
2. `supabase/tests/xavfsizlik_test.sql` (yangi) va `scripts/rls-tekshir.sh` ga ulandi. Ruxsat ro'yxati asosida 9 ta tekshiruv bor:
   X1 anon jadval/ustun, X2 anon RPC, X3 admin/to'lov RPC, X4 server jadvallariga yozish, X5 `questions` ustunlari,
   X6 `user_id` policy'lari, X7 `private` sxema, X8 view, X9 bucket.
   Sinovning o'zi ham tekshirildi: 8 ta huquq ataylab ochilganda (masalan `questions.stem` ga SELECT, admin RPC,
   `using (true)` policy, view, ochiq bucket) har birini tegishli X ushladi.

Migratsiya, Edge Function yoki sayt kodi o'zgarmadi. Deploy va `db push` kerak emas.

## 5. Katta o'zgarishlar (tasdiq kerak)

| # | Taklif | Ta'siri | Hajmi |
| --- | --- | --- | --- |
| K1 (F01) | Tayanch uchun alohida origin: o'z domeni (masalan `tayanch.uz`, GitHub Pages custom domain). Yoki hech bo'lmasa qolgan 3 ta Pages saytida begona skript bo'lmasligini qoida qilish | Sessiya boshqa saytlardan ajraladi. Domen pullik. `astro.config.mjs` base, Supabase Site URL va Redirect URL'lar, Google OAuth origin, inPAY return URL o'zgaradi | Katta |
| K2 (F02) | CAPTCHA (Cloudflare Turnstile yoki hCaptcha) | Pastda | O'rta |
| K3 (F03) | `reports`/`feedback`/`events` uchun trigger bilan kunlik chegara (masalan 20 / 10 / 1000; raqamlar muallif qarori) | Migratsiya va jonli bazaga push | Kichik |
| K4 (F04) | `<meta http-equiv="Content-Security-Policy">`: `script-src 'self'` (+ `is:inline` skriptlar uchun hash), `connect-src` Supabase va Edge Function manzillari | Inline skriptlarni xeshlash yoki faylga ko'chirish kerak. Noto'g'ri sozlansa sahifalar buziladi | O'rta |
| K5 (F05) | `TOLOV_ORIGINLAR` secret'ini faqat sayt origin'i bilan o'rnatish (kod o'zgarmaydi) | Lokal dev'da to'lovni sinash uchun secret'ga localhost qo'shib qo'yish kerak bo'ladi | Kichik, muallif secret qo'yadi |
| K6 (F09) | `bookmarks` insert policy'sini faqat foydalanuvchi sessiyada ko'rgan savollar bilan cheklash | Migratsiya. Xatcho'p UI'sini tekshirish kerak | Kichik |

### CAPTCHA taklifi (K2)
Supabase rasmiy hujjati (supabase.com/docs/guides/auth/auth-captcha, 2026-11-12) ikkita provayderni sanaydi: **hCaptcha** va **Cloudflare Turnstile**.
Ular kirish, ro'yxatdan o'tish va parol tiklash formalariga qo'shiladi, token `options.captchaToken` orqali beriladi.
Tarif cheklovi hujjatda aytilmagan: tekshirish kerak. Provayder hisobi va kaliti kerak: site key ochiq, secret key Dashboard'ga muallif o'zi qo'yadi.

- Tavsiya: **Cloudflare Turnstile**, "Managed" rejim. Ko'pincha foydalanuvchiga ko'rinmaydi (rasm tanlash yo'q), bepul reja bor (tekshirish kerak).
- Foydalanish qulayligiga ta'siri:
  - Har forma yuborilishiga taxminan 1 soniya kechikish qo'shiladi. Shubhali tarmoqda (VPN, umumiy IP) "katakchani belgilang" chiqishi mumkin.
  - Uchinchi tomon skripti (`challenges.cloudflare.com`) yuklanadi. Bu Maxfiylik sahifasida yozilishi kerak va K4 da CSP'ga qo'shiladi.
  - Skript bloklansa (reklama blokeri, sekin internet) forma yuborilmaydi. Tushunarli xato matni va "qayta urinish" kerak.
  - a11y: Turnstile vidjeti klaviatura va ekran o'quvchi bilan ishlashi tekshirilishi kerak (sinalmagan).
  - Google bilan kirish CAPTCHA'siz qoladi, uni Google o'zi himoya qiladi.
  - Yoqilgandan keyin token yubormaydigan eski sahifa versiyalarida kirish ishlamaydi: avval kod deploy qilinadi, keyin Dashboard'da yoqiladi.
- hCaptcha: xuddi shu oqim, lekin "Passive" rejim pullik (tekshirish kerak), bepul rejimda ko'proq topshiriq ko'rsatadi.

## 6. Qaror savollari

1. K1: o'z domeni olinadimi? Agar yo'q bo'lsa, qolgan 3 ta Pages saytida begona skript yo'qligini qoida qilamizmi?
2. K2: CAPTCHA kerakmi? Kerak bo'lsa Turnstile (tavsiya) yoki hCaptcha? Qaysi formalarda: kirish, ro'yxat, tiklash (hammasi tavsiya)?
3. K3 va K6: bitta kichik migratsiya PR'ida qilinadimi? Chegara raqamlarini siz berasizmi yoki men taklif qilaymi?
4. K4: CSP alohida PR'da qilinadimi? Saytning hamma sahifasini qayta tekshirishni talab qiladi.
5. K5 va F06: prod'da localhost'ni olib tashlaymizmi? Lokal to'lov sinovi uchun alohida yo'l kerak bo'ladi.
6. F12: Dashboard'da "Leaked password protection" bormi? Bo'lsa yoqamizmi?

## 7. Kalitlarni aylantirish (rotation) tartibi

Ochiq kalit (anon yoki publishable) dizayn bo'yicha ochiq: uni bilish RLS'ni chetlab o'tmaydi. Aylantirish faqat suiiste'mol bo'lganda
(masalan bot trafik) kerak. Saytda qaysi turdagi kalit turgani (`sb_publishable_` yoki eski anon JWT): tekshirish kerak (Actions Variable `PUBLIC_SUPABASE_ANON_KEY`).

- **Publishable kalit (tavsiya):** Dashboard → Settings → API Keys → yangi publishable kalit yaratiladi → GitHub repo
  Settings → Secrets and variables → Actions → Variables → `PUBLIC_SUPABASE_ANON_KEY` yangilanadi → Deploy workflow qayta ishga tushiriladi →
  saytda kirish, kun savoli va to'lov tekshiriladi → eski publishable kalit o'chiriladi. Sessiyalar uzilmaydi.
- **Eski anon JWT:** JWT secret'ni aylantirmasdan alohida aylantirib bo'lmaydi. JWT secret aylantirilsa service_role ham, hamma sessiyalar ham bekor bo'ladi.
  Shuning uchun avval publishable kalitga o'tish tavsiya qilinadi.
- **Maxfiy kalitlar** (secret/service_role, `INPAY_SECRET_KEY`, `INPAY_WEBHOOK_SECRET`, `MUVOFIQLASH_SECRET`): muallif yangi qiymatni
  provayder kabinetida yaratadi, `supabase secrets set` bilan o'zi qo'yadi, keyin eskisini bekor qiladi. Webhook secret almashganda
  inPAY kabinetidagi secret bilan bir vaqtda almashtiriladi: oradagi hodisalar 401 oladi va inPAY ularni qayta yuboradi (IP03).
  Har aylantirishdan keyin bitta sinov to'lovi qilinadi.

## 8. Tekshiruv natijalari (2026-11-12)

- `npm run db:tekshir`: 22 migratsiya 2 marta xatosiz; RLS 26/26; security definer'larning hammasida `search_path`;
  rls, sessiya, analitika, lug'at, kvota, kun savoli, obuna sinovlari va yangi `XAVFSIZLIK SINOVLARI O'TDI` (X1–X9); K06 parallel 3/10.
- `npm run funksiyalar:tekshir`: 49 passed, 0 failed (Deno).
- `npm audit`: 0 vulnerabilities.
- `npm run repo:tekshir`: muammo yo'q.
- `npm run build`: 58 sahifa, xatosiz.
- Jonli baza (faqat SELECT): RLS o'chiq jadval yo'q; anon jadval huquqi yo'q; anon RPC faqat kun savoli (+ F10); X3, X4, X4b, X5, X6, X7, X8, X9 toza;
  `config diff`: e'lon qilingan sozlamalarda farq yo'q.
- Sinalmagan: jonli bazada A/B yozuvli RLS sinovi (yozish ruxsati kerak), axe/VoiceOver, haqiqiy telefon, CAPTCHA (yoqilmagan).
