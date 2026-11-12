# Chiqarish ro'yxati: SAT MVP (P28)

Tuzildi 2026-11-12, branch `sat-joylash`. Bu ro'yxat saytni "chop etilgan" deb e'lon qilmaydi: e'lon faqat muallif aytganda.

Holat belgilari:
- **bajarildi**: qilingan va manbasi (sana, qayerda tekshirilgani) yozilgan;
- **muallif bajaradi**: Dashboard, kabinet yoki haqiqiy pul/hisob kerak, Claude qilmaydi;
- **sinalmagan**: sozlangan yoki yozilgan, lekin ishlashi ko'rilmagan;
- "tekshirish kerak": aniq bilinmagan texnik fakt.

Batafsil sozlash qadamlari `supabase/README.md` da; bu fayl faqat ro'yxat va holat. Kalit, token va parol qiymatlari bu yerga yozilmaydi.

## Qisqa xulosa (muallif uchun)

| # | Muallif qarori yoki ishi | Nega |
| --- | --- | --- |
| 1 | **Supabase Pro rejaga o'tish** (tavsiya: birinchi pullik foydalanuvchilar kelishidan oldin) | Bepul rejada backup yo'q va loyiha 1 hafta faolsizlikdan keyin pauzaga tushadi (1.1). |
| 2 | Google Auth Platform → Audience → **Publish app** | Hozir "Testing": faqat qo'shilgan test foydalanuvchilar Google bilan kira oladi (1.3). |
| 3 | Birinchi zaxira nusxa (`db dump`) | Hozir hech qanday nusxa yo'q (4). |
| 4 | Staging uchun ikkinchi loyiha: kerakmi | Tavsiya 1.2 da; loyiha yaratilmagan. |
| 5 | GitHub bildirishnoma sozlamasi (Actions xatosi xatga kelishi) | Uptime tekshiruvi xatoni shu yo'l bilan bildiradi (5.3). |

## 1. Supabase

### 1.1 Reja va cheklovlar

Manbalar qayta tekshirildi **2026-11-12**: supabase.com/pricing, supabase.com/docs/guides/platform/backups (oldingi tekshiruv 2026-11-09, `supabase/README.md` 0-bo'lim).

| Mavzu | Free (hozirgi) | Pro |
| --- | --- | --- |
| Narx | 0 | oyiga 25 dollardan ("From $25/month") |
| Faolsizlik pauzasi | 1 haftadan keyin pauza | pauza yo'q |
| Kunlik backup | yo'q | bor, 7 kun saqlanadi |
| Point-in-Time Recovery | yo'q | qo'shimcha haq bilan |
| Baza hajmi | 500 MB | 8 GB disk |
| MAU | 50 000 | 100 000 |
| Egress | 5 GB | 250 GB |

| Band | Holat |
| --- | --- |
| Loyiha `uvwejvjrsswssgydwevm`, Frankfurt, reja Free | bajarildi (README) |
| Pro'ga o'tish qarori | **muallif bajaradi**. Tavsiya: pullik obuna sotilayotgan ekan, birinchi haqiqiy to'lovchilar oqimidan oldin Pro'ga o'tish. Sabab: (1) pauza bo'lsa kirish, mashq va to'lov to'xtaydi, to'lagan foydalanuvchi xizmatsiz qoladi; (2) backup yo'q, baza buzilsa to'lov va obuna tarixi yo'qoladi. Pro'ga o'tmasa: 4-bo'limdagi qo'lda zaxira majburiy va har hafta qilinadi. |
| Narxlar o'zgarishi mumkin | to'lovdan oldin pricing sahifasida qayta ko'riladi |

### 1.2 Staging va production

Hozir bitta loyiha: u **production**. Sinovlar lokal Postgres'da (`npm run db:tekshir`, `npm run inpay:webhook-sinov`, `npm run funksiyalar:tekshir`) va jonli loyihada sinov kaliti bilan qilingan (README 10-bo'lim).

Tavsiya (loyiha yaratilmagan, **muallif qaror qiladi**):

| Variant | Afzalligi | Kamchiligi |
| --- | --- | --- |
| A. Ikkinchi bepul loyiha `tayanch-staging` (bepul rejada 2 ta faol loyiha mumkin) | Migratsiya va funksiyani jonli bazaga tegmasdan sinash; inPAY `sk_test_` kaliti doim shu yerda | Sozlamalarni ikki joyda yuritish (`config.toml`, secrets, Cron); 1 hafta ishlatilmasa pauza |
| B. Staging yo'q, hozirgi tartib | Qo'shimcha ish yo'q | Har migratsiya to'g'ridan-to'g'ri jonli bazaga; `--dry-run` va lokal sinov yagona himoya |

Tavsiya: **A**, lekin birinchi hafta ichida emas: hozircha B tartibi (lokal sinov, `db push --dry-run`, muallif "ha") saqlanadi. A tanlansa: staging'da faqat `sk_test_` kaliti, sayt build'i jonli loyihaga ulanadi (GitHub variables o'zgarmaydi), staging URL'i faqat lokal `.env` da.

### 1.3 Auth, email va Google

| Band | Holat |
| --- | --- |
| Email tasdiqlash yoqilgan, parol kamida 8 belgi | bajarildi (2026-11-09, `config.toml`, README 2.2) |
| Site URL production manzilda (`…github.io/Tayanch/uz/hisob/kirish/`) | bajarildi (README 2.1) |
| Redirect URL'lar production manzillarga (`kirish/`, `parol-tiklash/`, `callback/`) | bajarildi (README 2.1) |
| Lokal `http://localhost:4321/Tayanch/**` redirect'i ro'yxatda | ataylab qoldirilgan (lokal sinov uchun). Olib tashlash: muallif qarori; olib tashlansa `config.toml` dan va `config push` bilan |
| `?keyin=` query bilan redirect glob'ga mos kelishi | **tekshirish kerak** (README 2.1) |
| O'z SMTP: Gmail SMTP, yuboruvchi "Tayanch", soatiga 30 xat | bajarildi (2026-11-10, README 2.4). Muallif tasdiqladi: parol tiklash xati keldi |
| SMTP logini muallifning asosiy Gmail manzili (alohida hisob emas) | xavf: shu hisob paroli o'zgarsa App Password bekor bo'ladi va xat ketmaydi. Tavsiya: keyin alohida hisobga o'tish (README 2.4, 1-qadam). **muallif bajaradi** |
| Gmail kunlik limiti (shaxsiy hisob, kuniga 500 xat) | ma'lum cheklov; oshsa o'z domen + Resend (README 2.4) |
| Standart Supabase pochtasi faqat sinov uchun | bajarildi: o'z SMTP yoqilgan |
| Xat "Spam"ga tushmasligi (jamoadan tashqari, yangi foydalanuvchi) | **sinalmagan** (2-bo'lim, 1-stsenariy) |
| Google provider yoqilgan, saytda Google bilan kirish | bajarildi (2026-11-10, README 2.5) |
| Google Auth Platform: "Testing" → **"In production"** (Publish app) | **muallif bajaradi**. Google yordami (support.google.com/cloud/answer/15549945, 2026-11-12): Testing'da faqat 100 tagacha test foydalanuvchi kira oladi; "In production" da har qanday Google hisobi. Faqat asosiy scope'lar (`openid`, `email`, `profile`) ishlatilganda tekshiruv majburiymi: sahifa aniq aytmaydi, **tekshirish kerak** (Console "Publish app" dan keyin o'zi aytadi) |
| Google: Authorized redirect URI = Supabase callback (`https://<ref>.supabase.co/auth/v1/callback`) | bajarildi (README 2.5) |
| Google: lokal JavaScript origin (`localhost:4321`) | production'dan oldin olib tashlash mumkin, muallif qarori (README 2.5) |
| "Publish app" dan keyin test ro'yxatida bo'lmagan Google hisobi bilan kirish | **sinalmagan** (2-bo'lim, 1-stsenariy) |

### 1.4 Migratsiyalar va Cron

| Band | Holat |
| --- | --- |
| `main` dagi hamma migratsiya jonli bazada (oxirgisi `20261112000000_obuna_holati.sql`) | bajarildi (2026-11-11, HANDOFF P22). Ishga tushirish kunidan oldin `supabase migration list` bilan qayta ko'riladi (faqat o'qish) |
| `20261109130000_onboarding_profiles.sql` | README 11-bo'limida "hali `db push` qilinmagan" deyilgan: **tekshirish kerak** (`migration list`) |
| Cron `inpay-muvofiqlash` (har 10 daqiqa) | bajarildi (jobid 1, HTTP 200) |
| Cron `obuna-muddati` (har kuni 19:05 UTC) | bajarildi (jobid 2). Birinchi natija (`cron.job_run_details`): **sinalmagan** |
| Ochiq PR'lardagi migratsiyalar (masalan PR #63 savollar) | ularning PR'ida alohida; raqam to'qnashuvi: push oldidan `migration list` va `--dry-run` |

## 2. GitHub Actions

| Band | Holat |
| --- | --- |
| `deploy.yml`: build'da faqat `vars.PUBLIC_SUPABASE_URL`, `vars.PUBLIC_SUPABASE_ANON_KEY` (Variables, Secrets emas) | bajarildi (fayl ko'rildi 2026-11-12) |
| Brauzer kaliti publishable (`sb_publishable_…`), service/secret kalit build'da yo'q | bajarildi (README 2, holat) |
| Build'dan oldin `repo-tekshir` (taqiqlangan fayl va kalit qiymati) | bajarildi (`deploy.yml` 1-qadam) |
| Repoda maxfiy kalit yo'q | bajarildi: `npm run repo:tekshir` shu branch'da toza (hisobot) |
| GitHub Secrets'da nima borligi | Actions hozir hech qanday Secret ishlatmaydi. Ortiqcha Secret bo'lsa (masalan eski sinov qiymati) muallif o'chiradi: **muallif bajaradi** |
| Repo Settings → Pages → Source: "GitHub Actions" | bajarildi (sayt joylanmoqda) |
| Yangi `uptime.yml` (5.3) | **sinalmagan**: `schedule` faqat default branch'dan ishlaydi, merge'dan keyin Actions → "Uptime tekshiruvi" → Run workflow bilan bir marta qo'lda ishga tushiriladi |

## 3. inPAY

| Band | Holat |
| --- | --- |
| API v2, to'rtta funksiya deploy qilingan (`tolov-yaratish`, `inpay-webhook`, `inpay-holat`, `inpay-muvofiqlash`) | bajarildi (2026-11-10, README 10) |
| Kassa faol (`MERCHANT_INACTIVE` yo'q) | bajarildi: 2026-11-10 dagi jonli to'lov o'tgan. Har ishga tushirish kunida 3-stsenariy bilan qayta ko'riladi. Faol bo'lmasa, sayt "Payments are temporarily unavailable" deydi (`503 payments_unavailable`), logda `merchant_inactive` |
| Eng kam summa 1000 so'm | bajarildi: birinchi jonli to'lov 1000 so'm bilan qilingan (README 10) |
| Test → jonli o'tkazish tartibi | bajarildi (README "Jonli rejim"): Pro o'chiq holda `INPAY_SECRET_KEY` `sk_live_` ga almashtiriladi → Pro yoqiladi → bitta to'lov → bazada tekshiruv → narx haqiqiyga qaytariladi |
| Jonli kalit Supabase secrets'da | bajarildi (muallif qo'ygan, 2026-11-10). Claude qiymatni ko'rmagan |
| `INPAY_WEBHOOK_SECRET`, `MUVOFIQLASH_SECRET` secrets'da (Vault'da ham) | bajarildi (muallif) |
| Webhook manzili jonli funksiya: `https://uvwejvjrsswssgydwevm.supabase.co/functions/v1/inpay-webhook`; `return_url` `/uz/sat/hisob/tolov-natija/` | bajarildi: kod funksiya manzilini o'zi beradi; oq ro'yxatda ikkala domen (README 10) |
| Pro narxi 59 000 so'm, 30 kun | bajarildi (`plans`, 2026-11-10) |
| 1 ta haqiqiy kichik to'lov | bajarildi (2026-11-10, 1000 so'm): `paid`, `livemode = true`, webhook imzo bilan, 30 kunlik obuna, `audit_log` `payment_paid` |
| 59 000 so'mlik haqiqiy narxda to'lov | **muallif bajaradi** (3-stsenariy), ixtiyoriy |
| Jonli rejimda `payment.failed` webhook kelishi | **sinalmagan** |
| Cron eskirgan `pending` to'lovni yopishi | **sinalmagan** (shunday to'lov hali bo'lmagan) |
| Qaytarish (refund) yo'li | inPAY hujjatida topilmadi: **tekshirish kerak**; hozircha qo'lda (inPAY kabineti + `admin_grant_plan` emas, obunani SQL bilan bekor qilish) |
| Sinov to'lovlari daromadga kirmaydi | bajarildi: daromad so'rovi `livemode = true` bo'yicha (README 10) |

## 4. Zaxira (backup)

Bepul rejada avtomatik backup yo'q (1.1). Pro'ga o'tilsa kunlik backup 7 kun saqlanadi; shunda ham oyiga bir marta qo'lda nusxa tavsiya qilinadi (loyihadan tashqarida nusxa).

| Band | Holat |
| --- | --- |
| Usul | Supabase hujjati: bepul loyihalar CLI `db dump` bilan muntazam eksport qilsin va nusxani tashqarida saqlasin (supabase.com/docs/guides/platform/backups, 2026-11-12) |
| Kim | **muallif bajaradi** (o'z kompyuterida, Terminal'da). Claude buyruqni Terminal panelida ishga tushirishi mumkin, faqat muallif "ha" deganidan keyin; parolni muallif kiritadi |
| Qachon | Pro'gacha: har hafta (dushanba) va har migratsiya oldidan. Pro'dan keyin: oyiga bir marta va katta migratsiya oldidan |
| Qayerga | Repo papkasidan **tashqarida**, shifrlangan joyda (nusxada foydalanuvchi email'i, to'lov tarixi bor). Fayl nomi masalan `tayanch-YYYY-MM-DD-schema.sql`, `…-data.sql` |
| Buyruqlar (tekshirish kerak: CLI versiyasidagi bayroqlar) | `supabase db dump --linked -f <tashqi papka>/…-schema.sql`, `supabase db dump --linked --data-only -f <tashqi papka>/…-data.sql`, `supabase db dump --linked --role-only -f …-roles.sql`. `auth` sxemasi (foydalanuvchilar) nusxaga kirishi: **tekshirish kerak** |
| Tiklash sinovi | **sinalmagan**: nusxa bo'sh lokal Postgres'ga yuklanib, jadvallar soni `loyiha_tekshir.sql` bilan solishtiriladi. Birinchi nusxadan keyin bir marta |
| GitHub Actions bilan avtomatik dump | **qilinmaydi**: repo ochiq, nusxa foydalanuvchi ma'lumoti bilan Actions artifact yoki logga tushishi xavfli, baza parolini GitHub'ga berish kerak bo'ladi |
| Birinchi nusxa | **muallif bajaradi** (hozir nusxa yo'q) |

## 5. Monitoring

### 5.1 Edge Function loglari

| Qayerda | Nima |
| --- | --- |
| Dashboard → Edge Functions → `<funksiya>` → Logs / Invocations | Har chaqiruvning holat kodi. Loglarda tana, imzo va sir yo'q (README 10) |
| Dashboard → Logs → Edge Functions | Bir nechta funksiya bo'yicha qidiruv: `merchant_inactive`, `server_not_configured`, `signature`, 500 |
| Bepul rejada log saqlanish muddati | **tekshirish kerak** (pricing sahifasidagi "Log retention") |

### 5.2 To'lov xatosi bildirishnomasi

Avtomatik bildirishnoma (Telegram yoki email) **qurilmagan**: u bot token yoki xat yuborish sirini talab qiladi va alohida vazifa. Hozircha kunlik qo'lda tekshiruv (SQL Editor, faqat o'qish):

```sql
-- 1) Xato bilan saqlangan webhook hodisalari (obuna bermagan).
select received_at, event_id, provider_order_id, error
  from public.payment_events
 where error is not null and received_at > now() - interval '2 days'
 order by received_at desc;

-- 2) 1 soatdan eski, hali yopilmagan to'lovlar (Cron 15 daqiqa–48 soat oralig'ida so'raydi).
select id, status, created_at
  from public.payments
 where status in ('created', 'pending') and created_at < now() - interval '1 hour'
 order by created_at;

-- 3) To'langan, lekin obunasi yo'q to'lovlar (bo'lmasligi kerak).
select p.id, p.paid_at
  from public.payments p
 where p.status = 'paid' and p.raw->'inpay'->>'livemode' = 'true'
   and not exists (select 1 from public.subscriptions s where s.payment_id = p.id);

-- 4) Cron natijalari (oxirgi 24 soat, muvaffaqiyatsizlar).
select jobid, status, start_time, return_message
  from cron.job_run_details
 where start_time > now() - interval '1 day' and status <> 'succeeded'
 order by start_time desc;
```

Ustun nomlari `20261108000006_tolov.sql` bilan solishtirilgan (2026-11-12); so'rovlar jonli bazada hali ishlatilmagan: **sinalmagan**.

Keyingi vazifa (taklif): `inpay-webhook` xato hodisa saqlaganda yoki Cron yiqilganda muallifga Telegram xabari (Edge Function + bot token Supabase secrets'da).

### 5.3 Uptime

`.github/workflows/uptime.yml` (shu PR): kuniga 4 marta (UTC 01:17, 07:17, 13:17, 19:17) sayt sahifalarini (`/`, `/uz/sat/`, `/uz/hisob/kirish/`, `/uz/sat/hisob/obuna/`) va Supabase `auth/v1/health` ni (ochiq kalit bilan) tekshiradi. Kod checkout qilinmaydi, Secret ishlatilmaydi.

| Band | Holat |
| --- | --- |
| Lokal `curl` (2026-11-12): sayt sahifalari 200; `auth/v1/health` kalitsiz 401 (shuning uchun workflow ochiq kalitni yuboradi) | bajarildi |
| Workflow'ning o'zi | **sinalmagan** (merge'dan keyin qo'lda bir marta ishga tushiriladi) |
| Xato bildirishnomasi | GitHub hujjati bo'yicha rejalashtirilgan workflow xatosi cron qatorini oxirgi o'zgartirgan foydalanuvchiga boradi: **tekshirish kerak** (GitHub → Settings → Notifications → Actions) |
| Ochiq repoda 60 kun faollik bo'lmasa rejalashtirilgan workflow'lar o'chiriladi (GitHub hujjati) | ma'lum cheklov: tekshirish kerak, bo'lsa Actions'da qayta yoqiladi |
| Health so'rovi Supabase bepul pauzasini to'xtatadimi | **tekshirish kerak** (pauza "baza faolligi"ga qaraydi; Auth health bazaga tegmasligi mumkin). Pauzaga tayanib qolmaslik: Pro (1.1) |

## 6. Orqaga qaytarish

| Vaziyat | Nima qilinadi | Holat |
| --- | --- | --- |
| Yangi build saytni buzdi | Tez yo'l: Actions → "Saytni joylash" → oxirgi yaxshi ishga tushish → "Re-run all jobs" (o'sha commit qayta quriladi va joylanadi). Doimiy yo'l: buzgan merge commit uchun `git revert` PR, merge'dan keyin avtomatik deploy | **sinalmagan** |
| To'lovda muammo (noto'g'ri summa, inPAY nosozligi, kassa bloklangan) | "Feature flag": Pro tarifini yopish, sayt qayta qurilmaydi. `tolov-yaratish` `409 plan_not_available` qaytaradi, sayt "This plan is not available yet." deydi. Muallif "ha" deganidan keyin, SQL Editor'da: `update public.plans set is_active = false where code = 'pro' and is_active = true;` → `row_count = 1`. Qaytarish: `… set is_active = true where code = 'pro' and is_active = false;` | **sinalmagan** (jonli). Mavjud Pro obunachilar saqlanadi: amaldagi tarif (`private.current_plan`) faqat obunaga qaraydi (`20261111210000_kvota_p19.sql` izohi); `plans` RLS'i faqat `is_active` qatorlarni ko'rsatadi, shuning uchun Obuna va tariflar sahifasi Pro yopiqligida qanday ko'rinishi **tekshirish kerak** |
| Kalit sizib chiqdi deb gumon | inPAY kabinetida kalitni almashtirish → Supabase secrets'ga yangisi (muallif). Webhook secret ham almashtirilsa `INPAY_WEBHOOK_SECRET` yangilanadi | muallif bajaradi |
| Migratsiya xato | Migratsiyalar takror ishga tushirilsa buzilmaydi, lekin teskari (down) migratsiya yo'q: tuzatish yangi migratsiya bilan; ma'lumot buzilsa oxirgi zaxiradan (4) | **sinalmagan** |
| Auth/SMTP ishlamayapti | Dashboard → Auth → Logs; SMTP vaqtincha o'chirilsa xat faqat jamoaga ketadi (yangi foydalanuvchi ro'yxatdan o'tolmaydi) | — |

## 7. Jonli sinov stsenariylari

Ishga tushirish kunida, production'da, muallif bajaradi (haqiqiy hisob va pul). Har stsenariy natijasi shu jadvalga sana bilan yoziladi. Claude faqat-o'qish SQL bilan bazani tekshirishga yordam beradi.

| # | Stsenariy | Qadamlar | Kutilgan natija | Bazada tekshiruv (faqat o'qish) | Holat |
| --- | --- | --- | --- | --- | --- |
| 1 | Yangi hisob | (a) Muallifniki bo'lmagan yangi email bilan `/uz/hisob/royxat/` → xat → tasdiqlash → kirish. (b) Test ro'yxatida bo'lmagan Google hisobi bilan kirish ("Publish app" dan keyin). Telefonda ham | Xat 5 daqiqa ichida keladi, Spam'da emas; havola `kirish/` ga qaytaradi; Google rozilik sahifasida "Tayanch" | `auth.users` da yangi qator, `email_confirmed_at` bor; `profiles` qatori | sinalmagan |
| 2 | Savol sessiyasi | Yangi hisob bilan `/uz/sat/mashq/sessiya/` (yoki Savol banki) → bir nechta savolga javob → yakunlash → qayta kirib natijani ko'rish | Javoblar saqlanadi, yakunlangan sessiya qayta yozilmaydi | `practice_sessions`, `session_questions`, `attempts` | sinalmagan. Bazada `verified` savol borligi **tekshirish kerak** (savol importi PR #63 merge kutilmoqda) |
| 3 | Limit tugashi | Hozir `plans.limits = {}` (cheklovsiz, muallif qarori 2026-11-11), demak jonli foydalanuvchida limit tugamaydi. Kvota qo'yilsa: Free hisob bilan chegaraga yetish | "quota" xabari, Pro'ga yo'l; Pro hisobda chegara yo'q | `usage_status()` (shu foydalanuvchi sessiyasida) | lokal sinalgan (`kvota_test.sql`), jonli **sinalmagan**; kvota yoqilmaguncha shart emas |
| 4 | To'lov | Yangi hisob bilan `/uz/sat/hisob/obuna/` → Pro → inPAY → to'lov (59 000 so'm yoki sinov tartibida 1000 so'm, README "Jonli rejim") → `tolov-natija/` | 60 soniya ichida "paid"; ikkinchi bosish yangi to'lov ochmaydi | `payments` `paid`, `livemode = true`; `payment_events` `error is null` | 1000 so'mda bajarildi (2026-11-10); ishga tushirish kunida **muallif bajaradi** |
| 5 | Obuna yoqilishi | 4-dan keyin: Obuna sahifasida "Paid until · N days left", Pro imkoniyatlari ochiq | 30 kunlik obuna | `subscriptions` `active`, `ends_at` = to'lovdan +30 kun; `audit_log` `payment_paid` | bajarildi (2026-11-10); qayta: muallif |
| 6 | Muddat tugashi | Haqiqiy kutish 30 kun. Tezroq: dev-only `?sinov=tugagan` faqat UI uchun (lokal). Jonli: birinchi haqiqiy obuna muddati tugagan kun ertasi | "You're on Free, data kept"; ma'lumot o'chmaydi | `subscriptions` `expired`, `audit_log` `subscription_expired` (actor `cron:obuna-muddati`); `cron.job_run_details` | lokal sinalgan (`obuna_test.sql`); jonli **sinalmagan** (birinchi 1000 so'mlik obuna muddati 2026-12-10 atrofida tugaydi: sanani `subscriptions.ends_at` dan olish) |
| 7 | Hisobni o'chirish | 1-stsenariydagi sinov hisobi bilan `/uz/hisob/profil/` → "Hisobni o'chirish" → "Ha, o'chirish" → qayta kirishga urinish | Chiqariladi, qayta kira olmaydi; shu email bilan qayta ro'yxat mumkin | `auth.users` da qator yo'q; `profiles` va progress (`on delete cascade`) ham yo'q | **sinalmagan** (README 2.7). Muhim: to'lov qilgan hisob o'zini o'chira olmaydi: `payments.user_id` `on delete restrict`, o'chirish 23503 bilan to'xtaydi, sahifa alohida xabar ko'rsatadi (ataylab, `20261110210000_hisobni_ochirish.sql` izohi). Shunday so'rov kelsa qo'lda tartib kerak (to'lov tarixini saqlash muddati va shaxsiy ma'lumotni olib tashlash): **muallif qarori**, alohida vazifa. Sinov faqat to'lovsiz hisob bilan |

## 8. Ishga tushirish kuni

Muallif "chop etamiz" deganidan keyin. Tartib:

1. **Oldin (T−1 kun):** 4-bo'limdagi zaxira nusxa; `supabase migration list` farqsiz; `main` da oxirgi deploy yashil; `npm run repo:tekshir` toza.
2. **Sozlamalar:** Google "Publish app" (1.3); Pro reja qarori (1.1).
3. **Sinov:** 7-bo'limdagi 1, 2, 4, 5, 7-stsenariylar (telefonda ham).
4. **Kuzatuv birinchi 2 soat:** har 30 daqiqada 5.1 loglar va 5.2 so'rovlar 1–2.
5. **Muammo bo'lsa:** 6-bo'lim. To'lov muammosida avval Pro'ni yopish, keyin sabab.
6. **E'lon:** faqat 3-qadam yashil bo'lsa va muallif aytsa (9-bo'lim qoralamasi).

## 9. Birinchi hafta kuzatuvi

| Nima | Qayerdan | Qachon | Ogohlantiruvchi belgi |
| --- | --- | --- | --- |
| Uptime | GitHub → Actions → "Uptime tekshiruvi", xat | har kuni | qizil ishga tushish |
| Webhook xatolari | 5.2 so'rov 1 | har kuni | bitta ham qator |
| Yopilmagan to'lovlar | 5.2 so'rov 2 | har kuni | 1 soatdan eski `pending` |
| To'lov ↔ obuna mosligi | 5.2 so'rov 3 | har kuni | bitta ham qator |
| Cron | 5.2 so'rov 4 | har kuni | `failed` |
| Edge Function 4xx/5xx | Dashboard → Edge Functions → Logs | har kuni | 500, `merchant_inactive`, `server_not_configured` |
| Auth xatolari, xat yetkazish | Dashboard → Authentication → Logs; Gmail "Sent" papkasi | har kuni | SMTP xatosi; foydalanuvchi "xat kelmadi" desa |
| Gmail limiti | Supabase `rate_limit.email_sent` soatiga 30; Gmail kuniga 500 | har kuni | ro'yxatlar soni shu chegaraga yaqinlashsa |
| Ro'yxatlar soni | `select count(*) from auth.users where created_at > now() - interval '1 day';` | har kuni | — (faqat kuzatish) |
| Baza hajmi va MAU | Dashboard → Project → Usage | hafta oxirida | 500 MB ga yaqin (Free) |
| Pauza xavfi (Free) | Dashboard'dagi ogohlantirish xati | — | "project will be paused" xati |
| Zaxira | 4-bo'lim | hafta oxirida | nusxa qilinmagan |
| Foydalanuvchi xabarlari | Telegram kanal izohlari, `satTarif.aloqa` (hozir bo'sh: aloqa yo'li yo'q, **muallif qarori**) | har kuni | to'lov qildim, obuna yo'q |

## 10. Telegram e'loni (qoralama)

Faqat qoralama: hech qayerga yuborilmagan. Matnni muallif tekshiradi va o'zi yuboradi. Raqamlar faqat bazadagi haqiqiy qiymatlar (Pro narxi), boshqa raqam yo'q. `[havola]` o'rniga sayt manzili qo'yiladi.

```text
Tayanch: SAT® tayyorgarlik bo'limi ochildi

Tayanch saytida SAT® ga tayyorgarlik bo'limi ishga tushdi. Unda:
- Math va Reading & Writing bo'yicha interaktiv darslar;
- mashq savollari va xato daftari (xato qilgan savollaringizni takrorlash uchun);
- o'qish rejasi tuzgich va natijalarni kuzatish.

Darslar va asosiy mashqlar bepul. Pro tarifi: 30 kunga 59 000 so'm, to'lov inPAY orqali.

Hisob ochish uchun email yoki Google kifoya. Bitta hisob butun Tayanch saytida ishlaydi.

Muhim: Tayanch mustaqil loyiha, College Board bilan bog'liq emas. Savollar original, rasmiy SAT savollari emas. Natija kafolatlanmaydi: ball sizning tayyorgarligingizga bog'liq.

Sayt: [havola]
Taklif va xato haqida xabar: shu kanal izohlarida.
```

Tekshirish kerak (e'londan oldin): "Darslar va asosiy mashqlar bepul" Free tarifdagi haqiqiy imkoniyatlarga mosligi (`plans.features`, `docs/tarif-qoidalari.md`); SAT® belgisi va College Board eslatmasi `SatEslatma` matni bilan bir xilligi (CB08, CB09).
