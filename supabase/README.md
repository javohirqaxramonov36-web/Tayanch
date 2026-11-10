# Supabase: loyiha, migratsiyalar va sozlamalar

Sxema, RLS va server funksiyalari (P02, PR #38). Haqiqiy loyihani ishga tushirish (P02b). Auth va dashboard sozlamalari (hisob, P03): 2-bo'lim. To'lov (inPAY): 10-bo'lim. Qarorlar: `docs/qarorlar/001-hisob-tolov-server.md`. Jadvallar va oqimlar: `docs/ma'lumotlar-modeli.md`.

CLI buyruqlarini Claude muallif ko'radigan Terminal panelida ishga tushiradi; muallif faqat parolni terminalga yozadi, brauzerda tasdiqlaydi va bazaga yozishdan oldin "ha" deydi. Dashboard qadamlarini muallif o'zi bajaradi. Claude kalit, token va baza parolini so'ramaydi, ko'rmaydi va yozmaydi (`--password`, `--token` va parolli env berilmaydi). Repoga va chatga faqat project-ref yozilishi mumkin.

**Haqiqiy loyiha:** ref `uvwejvjrsswssgydwevm` ("Tayanch"), region `eu-central-1` (Frankfurt), reja Free, Postgres 17.11. Migratsiyalar 2026-11-09 da qo'llangan. Eski `uwgqlnvneqzcgzeroabm` (Sidney, pauzada) ishlatilmaydi.

## Papka

| Fayl | Nima |
| --- | --- |
| `migrations/20261108000001_asos.sql` … `09_storage.sql` | Tartiblangan migratsiyalar. Takror ishga tushirilsa buzilmaydi. |
| `migrations/20261109000010_tolov_inpay.sql` | To'lov SQL funksiyalari (`payment_create`, `payment_set_invoice`, `payment_apply_event`), faqat service_role. Jadvallarga tegmaydi. 10-bo'lim. |
| `migrations/20261110000011_tolov_audit_muvofiqlash.sql` | `payment_events.payload` tozalash trigger'i va `payment_pending_stale` (P21), 10-bo'lim. |
| `functions/tolov-yaratish/`, `functions/inpay-webhook/`, `functions/inpay-holat/`, `functions/inpay-muvofiqlash/` | Edge Function'lar: inPAY to'lovi, webhook, holat va muvofiqlashtirish (10-bo'lim). `_shared/` umumiy kod, `tests/` Deno testlari. |
| `tests/lokal-shim.sql` | **Faqat lokal sinov uchun**: oddiy Postgres'da Supabase rollari, `auth`, `storage` o'xshatmasi. Supabase loyihasida ishga tushirilmaydi. |
| `tests/rls_test.sql` | RLS va RPC sinovlari (ikki foydalanuvchi, anonim, service role). Bitta tranzaksiyada, oxirida `ROLLBACK`. `psql` bilan; haqiqiy loyihada parolsiz `supabase db query` va vaqtinchalik nusxa bilan sinalgan (6-bo'lim). |
| `tests/loyiha_tekshir.sql` | Loyiha holatini tekshirish, **faqat o'qiydi**: RLS, RPC va ularning huquqlari, jadval huquqlari lokal sinov bilan bir xilligi, bucket, trigger, SPR, sinov qoldig'i. SQL Editor'da ham, `psql` da ham ishlaydi. |
| `../scripts/rls-tekshir.sh` | Lokal sinov: vaqtinchalik klaster, migratsiyalar 2 marta, testlar. `npm run db:tekshir` |
| `config.toml` | Auth sozlamalari (P03, PR #58; 2-bo'lim) va Edge Function'lar uchun `verify_jwt = false` (10-bo'lim). Faqat ochiq qiymatlar. |

`supabase/.temp/` (CLI `link` dan keyin yaratadi: project-ref, pooler manzili, servis versiyalari) `.gitignore` da. Migratsiya buyruqlari `config.toml` ga bog'liq emas: `link`, `db push --remote`, `migration list --remote`, `db query --remote` u hali yo'q paytda ishladi (2026-11-09, 3-bo'lim). `config.toml` keyin P03 da qo'lda yozildi (`supabase init` emas).

## 0. Bepul reja cheklovlari

Tekshirildi **2026-11-09**, manbalar: https://supabase.com/pricing, https://supabase.com/docs/guides/platform/free-project-pausing, https://supabase.com/docs/guides/platform/backups, https://supabase.com/docs/guides/auth/auth-smtp. Sahifalarda "oxirgi yangilangan" sanasi yo'q; narx sahifasi narxlar o'zgarishi mumkinligini aytadi. Har ishga tushirish yoki reja qarori oldidan qayta tekshiriladi.

| Mavzu | Bepul rejada (manba bo'yicha) | Manba |
| --- | --- | --- |
| Pauza | Faolligi past loyiha 7 kunlik davrdan keyin (narx sahifasida "1 week of inactivity") to'xtatiladi. Faollik: o'tgan haftadagi foydalanuvchi baza faolligi. Pullik rejalardagi loyihalar faolsizlik uchun to'xtatilmaydi. | pricing, free-project-pausing |
| Qayta tiklash | To'xtatilgan loyihani to'xtatilgan kundan **1 yil** ichida Dashboard'dan tiklash mumkin (loyiha → Resume project). Loyiha ma'lumoti va sozlamalari bilan oldingi holatiga qaytadi. | free-project-pausing |
| Zaxira nusxa | Avtomatik backup **yo'q**, Point-in-Time Recovery **yo'q**. Kunlik backup faqat Pro, Team, Enterprise rejalarida. Bepul loyihalarga ma'lumotni CLI `db dump` bilan muntazam eksport qilish va nusxani loyihadan tashqarida saqlash tavsiya qilinadi. | pricing, backups |
| Faol loyihalar | 2 ta (to'xtatilganlari soni cheklanmagan). | pricing |
| Hajm (narx sahifasidagi "included" qiymatlar) | Baza 500 MB, fayl saqlash 1 GB, 50 000 MAU, egress 5 GB, Edge Function chaqiruvi 500 000. | pricing |
| Email | Standart SMTP faqat loyiha **jamoasi a'zolari** manziliga yuboradi, soatiga 2 xabar, production uchun emas. | auth-smtp |

Tayanch uchun xulosa:
- Bepul reja faqat sinov va yopiq beta uchun. Loyiha to'xtatilsa, saytdagi kirish va mashq ishlamaydi (statik sahifalar ishlayveradi).
- Backup yo'q: muhim o'zgarishdan oldin muallif qo'lda eksport qiladi va faylni **repo papkasidan tashqarida** saqlaydi (unda foydalanuvchi ma'lumoti bo'ladi). Usul (`supabase db dump` yoki Homebrew `pg_dump` session pooler orqali): sinalmagan, birinchi haqiqiy foydalanuvchidan oldin sinaladi.
- Email bilan ro'yxatdan o'tish jamoadan tashqaridagi foydalanuvchilarga ishlashi uchun o'z SMTP serveri kerak (P28, 2.4-bo'lim).
- **Pro rejaga o'tish qarori P28 da qabul qilinadi.**
- To'lov (inPAY) ishga tushmaguncha `subscriptions` ga faqat `admin_grant_plan` yozadi.

## 1. Loyiha yaratish

Muallif yaratgan (reja Free). Yangi loyiha kerak bo'lsa: https://supabase.com/dashboard → New project, region foydalanuvchilarga yaqin, baza paroli parol menejerida (repoga emas).

## 2. Dashboard va Auth sozlamalari (hisob, P03)

Bu bo'limda faqat sozlash qadamlari; kalit, parol va SMTP ma'lumotlari bu yerga **yozilmaydi** (chatga, logga ham). Ularni muallif Supabase dashboard'iga o'zi kiritadi.

Brauzer uchun ochiq qiymatlar (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`): `docs/lokal-ish-tartibi.md`, "Supabase o'zgaruvchilari".

Manbalar (tekshirildi 2026-11-09): supabase.com/docs/guides/auth/redirect-urls, /auth/rate-limits, /auth/auth-smtp.

**Holat (2026-11-09):** 2.1–2.2 dagi sozlamalar `supabase/config.toml` da yozilgan va Tayanch loyihasiga qo'llangan (`supabase config push --remote=<ref>`; faylda yo'q sozlamalar o'zgarmaydi). O'zgargani: Site URL (`localhost:3000` edi), Redirect URL'lar (bo'sh edi), parol uzunligi 6 → 8. Email tasdiqlash avvaldan yoqilgan edi. Brauzer kaliti: publishable (`sb_publishable_...`, legacy `anon` emas); `.env` va GitHub repo variables'ga qiymat ko'rsatilmasdan CLI orqali yozilgan. Keyingi o'zgarishlar ham shu fayl orqali: avval `supabase config diff --remote=<ref>`, so'ng `push`.

### 2.1 URL Configuration

Dashboard → Authentication → URL Configuration (`/dashboard/project/_/auth/url-configuration`).

**Site URL** (havolada `redirectTo` bo'lmasa shu ishlatiladi):

```
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/kirish/
```

**Redirect URLs** (ruxsat ro'yxati). Hisob sahifalari 1-qavatda (`/uz/hisob/`, 2026-11-09). Kod ikkita manzilga qaytaradi: tasdiqlash xati → `kirish/` (ba'zan `?keyin=...` bilan), parol tiklash xati → `parol-tiklash/`. Eski `/uz/sat/hisob/` manzillari ham ro'yxatda qoladi (ular yangi joyga yo'naltiradi). Base `/Tayanch` harf katta-kichikligiga sezgir. Aniq ro'yxat: `supabase/config.toml`.

```
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/kirish/
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/kirish/**
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/parol-tiklash/
https://javohirqaxramonov36-web.github.io/Tayanch/uz/sat/hisob/kirish/**
https://javohirqaxramonov36-web.github.io/Tayanch/uz/sat/hisob/parol-tiklash/
http://localhost:4321/Tayanch/**
```

`**` har qanday belgini (`/` ham) qamraydi (`*` `/` dan o'tmaydi, saytda har manzil `/` bilan tugaydi). Query (`?keyin=`) glob bilan mos kelishini hujjat aniq aytmaydi: **tekshirish kerak** (Supabase hujjatidagi glob sinov vositasida yoki haqiqiy xat bilan). Mos kelmasa, Supabase Site URL'ga qaytaradi: foydalanuvchi baribir kirgan bo'ladi, faqat `keyin` yo'qoladi.

Lokal port boshqacha bo'lsa (masalan `astro dev` 4321 dan boshqa), shu port ham qo'shiladi.

### 2.2 Email bilan kirish

Dashboard → Authentication → Sign In / Providers → Email (yoqilgan):

- **Confirm email**: yoqilgan (majburiy tasdiqlash, P03 talabi).
- **Minimum password length**: 8 dan kam emas (formadagi `hisobSozlama.parolMinUzunlik`; HANDOFF §5, 18-savol).
- **Secure password change** va boshqa sozlamalar: standart holatda.

Oqim turi: brauzer kodi `flowType: 'implicit'` ishlatadi (`src/lib/hisob.ts`). Sabab: xatdagi havola boshqa brauzer yoki telefonda ochilsa ham ishlashi kerak; PKCE havolani so'ragan brauzerni talab qiladi. Standart email shablonlari (`{{ .ConfirmationURL }}`) o'zgartirilmaydi: **tekshirish kerak**, `redirect_to` to'g'ri o'tishi birinchi haqiqiy sinovda ko'riladi.

### 2.3 Standart pochta xizmati: faqat sinov uchun

Supabase'ning o'z pochta xizmati (hujjat bo'yicha, 2026-11-09; qisqasi 0-bo'limda):

- soatiga **2 ta** xat (butun loyiha bo'yicha; ogohlantirishsiz o'zgarishi mumkin);
- faqat loyiha **jamoasi a'zolari** manziliga yuboradi, boshqa manzil "Email address not authorized" xatosini oladi (formada "Could not create the account" bo'lib chiqadi);
- yetkazish kafolati (SLA) yo'q.

Demak haqiqiy foydalanuvchilar uchun o'z SMTP kerak (P28). Shu paytgacha sinov faqat muallifning (jamoa a'zosi) email'i bilan.

### 2.4 O'z SMTP (P28 da bajariladi)

1. SMTP xizmatini tanlash (masalan Resend; hujjatda Resend, AWS SES, Postmark, SendGrid, ZeptoMail, Brevo bor). Narx va bepul limitni xizmatning o'z sahifasidan tekshirish.
2. Xizmatda yuboruvchi domenni tasdiqlash (DNS yozuvlari: SPF, DKIM). GitHub Pages'ning `github.io` domeni uchun DNS yozib bo'lmaydi: o'z domen kerak bo'ladi (**tekshirish kerak**: domen qarori muallifda).
3. Xizmatdan SMTP host, port, username va parol (API kalit) olish. Ular faqat dashboard'ga kiritiladi, repoga va chatga yozilmaydi.
4. Dashboard → Authentication → Settings → SMTP (`/dashboard/project/_/auth/smtp`): "Enable custom SMTP", host, port, username, password, From manzili (masalan `no-reply@<domen>`), yuboruvchi nomi ("Tayanch").
5. Dashboard → Authentication → Rate Limits: o'z SMTP bilan boshlang'ich limit soatiga 30 ta xat (hujjat); kerak bo'lsa oshiriladi.
6. Email shablonlari (Authentication → Emails): matnni inglizchaga moslash (SAT bo'limi), muallif tekshiradi.
7. Sinov: yangi email bilan ro'yxat, tasdiqlash, kirish, parol tiklash.

### 2.5 Google (P03B)

SB04, https://supabase.com/docs/guides/auth/social-login/auth-google. Redirect URL'lar 2.1 dagi ro'yxatda.

1. Google Cloud Console → Google Auth Platform: **Data Access (Scopes)** da `openid` (qo'lda qo'shiladi), `.../auth/userinfo.email`, `.../auth/userinfo.profile`. Boshqa scope qo'shilmaydi (tekshiruv jarayoni uzayadi).
2. **Clients** → yangi OAuth client, turi **Web application**.
3. **Authorized JavaScript origins**: `https://javohirqaxramonov36-web.github.io` (yo'lsiz) va lokal `http://localhost:4321` (qo'llanma uni production'dan oldin olib tashlashni tavsiya qiladi).
4. **Authorized redirect URIs**: Supabase Dashboard → Authentication → Providers → Google sahifasidagi **Callback URL** (nusxa ko'chiriladi, qo'lda yozilmaydi).
5. Client ID va **Client Secret** faqat Supabase Dashboard'dagi Google provider sahifasiga kiritiladi, provider yoqiladi.

### 2.6 Boshqa sozlamalar

1. **Anonymous sign-ins**: o'chiq qoladi (ishlatilmaydi).
2. **Data API** (exposed schemas): faqat `public` (va standart `graphql_public`). `private` qo'shilmaydi.
3. **API keys**: saytga faqat loyiha URL va publishable kalit beriladi (SB01; P03 da ulangan, yuqoridagi holat). Secret / `service_role` kaliti hech qachon saytga, repoga, chatga.

### 2.7 Keyingi vazifalar

- P03B: Google bilan kirish (2.5; client ID/secret faqat dashboard'da).
- P12: `profiles` jadvali (RLS bilan), maqsad ball va imtihon sanasi. Jadval sxemada bor (`migrations/20261108000002_profiles.sql`), hisob sahifalari hali unga yozmaydi: hozircha `display_name`, `nickname` Supabase `user_metadata` da.
- P23: Maxfiylik va Shartlar sahifalari (`hisobSozlama.maxfiylikSahifa`, `shartlarSahifa`).
- P28: o'z SMTP (2.4).

## 3. Migratsiyalarni qo'llash (Supabase CLI)

CLI: Homebrew, `brew install supabase/tap/supabase`, versiya **3.0.0** (2026-11-09). Qo'llanma: https://supabase.com/docs/guides/cli

Buyruqlar `supabase/migrations/` bor papkada ishga tushiriladi. PR #38 merge bo'lguncha bu `main` emas: branch `supabase-ishga-tushirish` (yoki `supabase-sxema`) worktree'si.

```bash
supabase login
```

```bash
supabase link --project-ref <loyiha-ref>
```

```bash
supabase db push --remote --dry-run
```

```bash
supabase db push --remote
```

```bash
supabase migration list --remote
```

- **CLI 3.x da `db push` sukut bo'yicha lokal bazaga** (127.0.0.1:54322) qaraydi; haqiqiy loyiha uchun `--remote` shart (`supabase db push --help`, 2026-11-09). `--remote` siz buyruq Docker'dagi lokal baza yo'qligi uchun ulanish xatosi beradi, loyihaga tegmaydi.
- `--dry-run` qo'llanadigan 9 ta migratsiyani ko'rsatadi, hech narsa yozmaydi. `migration list --remote`: Local va Remote ustunlarida bir xil 9 ta versiya.
- Token va parol: `login` brauzer orqali, token CLI'ning o'zida saqlanadi. `link`, `db push --remote`, `migration list --remote`, `db query --remote` baza parolini **so'ramadi**: CLI har safar `Initialising login role...` deb vaqtinchalik login rolini token orqali yaratadi. Baza paroli faqat `psql` uchun kerak (6-bo'lim).
- Migratsiyalar uchun `config.toml` **kerak bo'lmadi** (2026-11-09, haqiqiy loyihada). `supabase init` qilinmadi: u lokal standart auth qiymatlarini (`site_url = "http://127.0.0.1:3000"`) yozadi (2026-11-09 da nusxa papkada sinalgan; faqat `config.toml` va `.temp/` qo'shadi, `migrations/` ga tegmaydi). Keyin P03 da (PR #58) `supabase/config.toml` qo'lda, faqat kerakli Auth sozlamalari bilan yozildi va `supabase config push --remote=<ref>` bilan qo'llandi: faylda yo'q sozlamalar o'zgarmaydi (2-bo'lim, "Holat"). Har `push` dan oldin `supabase config diff --remote=<ref>`.

Haqiqiy natija (2026-11-09, CLI 3.0.0):

| Buyruq | CLI xabari |
| --- | --- |
| `supabase link --project-ref uvwejvjrsswssgydwevm` | `Target: project uvwejvjrsswssgydwevm`, `Finished supabase link.` Parol so'ramadi, `supabase/.temp/` yaratildi. |
| `supabase db push --remote --dry-run` | `Target: project Tayanch (uvwejvjrsswssgydwevm) · production`, `DRY RUN: migrations will *not* be pushed`, 9 ta fayl ro'yxati. |
| `supabase db push --remote` | Ro'yxatdan keyin `Apply 9 migrations on project Tayanch (...) · production?` **Yes / No** tanlovi, sukut **No** (Enter bosilsa bekor bo'ladi). Muallif "ha" degandan keyin `--yes` bilan qayta ishga tushirildi: `Confirmed by --yes`, 9 ta `Applying migration ...`, `Finished supabase db push.` |
| `supabase migration list --remote` | JSON: 9 ta qator, har birida `local` = `remote` (`20261108000001` … `20261108000009`). |

`--yes` faqat muallif dry-run ro'yxatini ko'rib "ha" degandan keyin qo'shiladi.
- CLI'siz: Dashboard → SQL Editor'da fayllarni raqam tartibida birma-bir (`tests/lokal-shim.sql` ni **emas**). Bunda migratsiyalar tarixi yozilmaydi, keyin `db push` ularni yangi deb hisoblaydi: tavsiya qilinmaydi.

## 4. Push dan keyin tekshirish

Eng oson yo'l: CLI 3 ning `db query` buyrug'i (parol so'ramaydi, SQL Editor'ga nusxalash shart emas):

```bash
supabase db query --remote --yes -f supabase/tests/loyiha_tekshir.sql
```

- `--read-only` bilan **ishlamaydi**: u Management API'ning faqat o'qiydigan roli bilan bajaradi, bu rolda `private` funksiyalariga huquq yo'q, natija `ERROR: 42501: permission denied for function run_spr_tests` (2026-11-09). Fayl faqat SELECT (yozish buyrug'i yo'q), shuning uchun `--read-only` siz ishga tushirish xavfsiz; hosted maqsadda CLI tasdiq so'raydi, `--yes` shuning uchun.
- Natija JSON (`rows` ichida `tartib`, `tekshiruv`, `holat`, `tafsilot`).
- Muqobil: Dashboard → SQL Editor → fayl matnini qo'yib Run, yoki 6-bo'limdagi `psql` bilan `-f supabase/tests/loyiha_tekshir.sql`.

Hamma qatorda `ok` yoki `info` bo'lishi kerak:

| tartib | tekshiruv | kutilgan |
| --- | --- | --- |
| 10 | RLS | 23 jadval, RLS o'chiq: yo'q |
| 20–22 | RPC | 9 / 9; anon hech birini, authenticated 7 tasini, `admin_*` ni faqat service_role chaqiradi; anon uchun boshqa public funksiya yo'q (trigger funksiyalari hisobga kirmaydi: ularni RPC orqali chaqirib bo'lmaydi) |
| 23 | info | public sxemadagi trigger / event trigger funksiyalari. Haqiqiy loyihada: `rls_auto_enable()` (event trigger `ensure_rls`, `ddl_command_end`), egasi `postgres`. U bizning migratsiyamizda yo'q: loyiha yaratilganda Supabase qo'shgan, yangi public jadvalda RLS ni avtomatik yoqadi (qaysi sozlama qo'shgani: tekshirish kerak) |
| 30, 40 | security definer, private | search_path hammasida; `private` anon/authenticated uchun yopiq |
| 50 | huquqlar | 46 qator, farqlar: 0 (farq bo'lsa 51-qatorlar: jadval / rol, kutilgan va haqiqiy) |
| 60, 61 | Storage | `question-figures` public = false; `question_figures_served_read` siyosati bor |
| 70 | trigger | `on_auth_user_created` bor va yoqilgan |
| 80 | SPR | 0 ta o'tmagan holat, jami 29 |
| 90–92 | ma'lumot | plans `limits={}`, narx null; savol 0; sinov qoldig'i 0 |
| 100 | Realtime | public jadval publikatsiyada yo'q |
| 110, 111 | info | standart huquqlar (lokal shim bilan solishtirish uchun), Postgres versiyasi |

Lokal natija (2026-11-09, Postgres 17.11): hamma qator `ok`; ataylab buzilganda (RLS o'chirildi, anon'ga `questions` SELECT, `admin_grant_plan` authenticated'ga, bucket ochildi) 4 tasi ham `XATO` bo'ldi. 22/23-qator lokal sinovi: event trigger funksiyasi qo'shilganda 22 `ok`, 23 `info`; anon uchun oddiy public funksiya qo'shilganda 22 `XATO`.

**Haqiqiy loyiha natijasi (2026-11-09, `uvwejvjrsswssgydwevm`, Postgres 17.11):**
- Birinchi ishga tushirishda 22-qator `XATO`: `rls_auto_enable()` (yuqoridagi Supabase event trigger funksiyasi, anon'da EXECUTE bor). Funksiya `event_trigger` qaytaradi, uni to'g'ridan-to'g'ri chaqirib bo'lmaydi, shuning uchun 22-qator trigger funksiyalarini hisobga olmaydigan qilindi va ular 23-qatorda `info` sifatida ko'rsatiladi. Migratsiyalar o'zgarmadi.
- Qayta ishga tushirishda: 10–100 hamma qator `ok`, 23, 110, 111 `info`.
- 50-qator: 46 qator, farqlar 0, ya'ni real jadval va ustun huquqlari lokal shim bilan bir xil.
- 110-qator (standart huquqlar): `postgres` va `supabase_admin` uchun public sxemada jadval (`arwdDxtm`), ketma-ketlik (`rwU`), funksiya (`X`) huquqlari `anon`, `authenticated`, `service_role` ga beriladi. Lokal shim `postgres` uchun xuddi shunday (`lokal-shim.sql` 64–66-qatorlar); `supabase_admin` yaratgan obyektlar migratsiyalarda yo'q (migratsiyalar `postgres` nomidan bajariladi).
- 80: SPR 29 / 29; 90: plans `limits={}`, narx null; 91: savol 0; 92: sinov qoldig'i 0.

Dashboard'da ko'z bilan: Table Editor'da "RLS enabled", Storage'da bucket "Public" belgisiz (muallif tekshiradi, hali ko'rilmagan).

## 5. Kalitlar qayerda turadi

| Kalit | Joy |
| --- | --- |
| Supabase URL, publishable kalit | Sayt sozlamasi `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY` (`.env` va GitHub repo variables, P03; `docs/lokal-ish-tartibi.md`). Ochiq bo'lishi mumkin, xavfsizlikni RLS ta'minlaydi (SB01). |
| `service_role` / secret kalit | Faqat Supabase Edge Functions muhiti (avtomatik) va lokal `supabase/functions/.env` |
| Google client secret | Dashboard → Authentication → Providers → Google |
| SMTP host, username, parol (P28) | Dashboard → Authentication → Settings → SMTP (2.4) |
| Baza paroli | Parol menejeri; CLI yoki `psql` so'raganda terminalga |
| inPAY `INPAY_SECRET_KEY` (`sk_test_…` / `sk_live_…`), `INPAY_WEBHOOK_SECRET` (`whsec_…`) | Dashboard → Edge Functions → Secrets (SB02), muallif o'zi qo'yadi. Merchant ID v2'da kerak emas (10-bo'lim) |

`.env` fayllari va `supabase/.temp/` `.gitignore` da. Kalit oshkor bo'lsa: darhol rotate.

## 6. Sinov

### Lokal

Postgres 15+ kerak (masalan `brew install postgresql@17`):

```bash
npm run db:tekshir
```

Natija: migratsiyalar 2 marta xatosiz, RLS hamma jadvalda, `OK 01`, `OK 02`, `OK 04` … `OK 15`, `HAMMASI O'TDI`.

`OK 03` xabari yo'q, bu xato emas: 3-tekshiruv (A `questions` jadvalini to'g'ridan-to'g'ri o'qiy olmaydi) 4-blok ichida turadi va alohida xabar chiqarmaydi. U o'tmasa test `FAIL 03` bilan to'xtaydi.

### Haqiqiy loyihada (`rls_test.sql`)

Test 3 ta sinov foydalanuvchisini `auth.users` ga, 4 ta "SINOV" savolni `questions` ga, 2 ta yozuvni `storage.objects` ga yozadi, rollar bilan tekshiradi va oxirida `ROLLBACK` qiladi: bazada hech narsa qolmaydi. Xato bo'lsa `ON_ERROR_STOP` psql'ni to'xtatadi, tranzaksiya commit bo'lmaydi.

**Natija (2026-11-09, `uvwejvjrsswssgydwevm`, Postgres 17.11):** `OK 01`, `OK 02`, `OK 04` … `OK 15`, `HAMMASI O'TDI`. `postgres` rolida `auth.users` va `storage.objects` ga to'g'ridan-to'g'ri yozish ishladi (`permission denied` chiqmadi), test moslanmadi. Keyin `loyiha_tekshir.sql`: hamma qator `ok` yoki `info`, 92-qator `ok` (auth.users 0, questions 0, storage 0).

#### Qanday ishga tushirildi: `supabase db query` (parol kerak emas)

psql uchun baza paroli kerak edi va u hal bo'lmadi (pastda), shuning uchun test CLI 3 orqali ishga tushirildi. CLI login'i yetadi, baza paroli so'ralmaydi.

- CLI faylni Management API orqali bitta so'rov va bitta tranzaksiyada bajaradi. Oldindan zararsiz sinov bilan tekshirildi: `begin … rollback` undan oldingi hamma narsani bekor qiladi (vaqtinchalik jadval ham, `set_config` ham). Rol: `postgres` (superuser emas), psql bilan session pooler orqali ulangandagi rol bilan bir xil.
- CLI `\set`/`\gset` ni bilmaydi va `notice` xabarlarini ko'rsatmaydi. Shuning uchun repodagi fayl emas, uning vaqtinchalik nusxasi ishlatildi (repoga qo'shilmagan): `\set` qatorlari olib tashlandi, `\gset` o'rniga `;`, har `raise notice 'OK NN …'` o'rniga `test.ok` sozlamasiga `OK NN` qo'shish, oxirgi `HAMMASI O'TDI` xabari o'rniga ataylab `raise exception 'NATIJA:% | HAMMASI O''TDI …'`. Tekshiruvlar va `FAIL` xatolari o'zgarmadi.
- Ataylab xato tranzaksiyani bekor qiladi (ROLLBACK bilan bir xil), CLI uni xato matnida qaytaradi: `ERROR: P0001: NATIJA: OK 01 OK 02 OK 04 OK 05 … OK 15 | HAMMASI O'TDI`. Birorta tekshiruv o'tmasa, shu joyda `FAIL NN` xatosi chiqadi.

#### Muqobil: psql (baza paroli kerak)

1. Shart: 4-bo'lim hamma qatori `ok`. Eng yaxshi vaqt: haqiqiy foydalanuvchilar hali yo'q.
2. `psql` (SQL Editor emas): faylda psql meta-buyruqlari (`\set`, `\gset`) bor, SQL Editor ularni bajarmaydi.
3. Ulanish: Dashboard → **Connect** → **Session pooler** (port 5432, IPv4). Bepul rejada direct connection faqat IPv6; transaction pooler (6543) sessiya holatini saqlamaydi. Manzildan `:[YOUR-PASSWORD]` qismini olib tashlang: psql parolni o'zi so'raydi (parol buyruqlar tarixiga tushmaydi).
4. Repo ildizidan (Homebrew `psql` 17), **macOS Terminal ilovasida**:

```bash
psql "postgresql://postgres.<loyiha-ref>@<pooler-host>:5432/postgres" -X -v ON_ERROR_STOP=1 -f supabase/tests/rls_test.sql
```

5. Kutilgan: `OK 01`, `OK 02`, `OK 04` … `OK 15`, `HAMMASI O'TDI`, oxirida `ROLLBACK`.
6. Keyin `loyiha_tekshir.sql` ni qayta ishga tushiring: 92-qator (sinov qoldig'i) `ok`.

Parol haqida (2026-11-09):
- Bu baza paroli (loyiha yaratilganda berilgan), Supabase hisobi yoki GitHub paroli emas. Esdan chiqsa: Dashboard → Project Settings → Database → **Reset database password**.
- Claude Code ilovasining Terminal panelida psql parol kiritishni qabul qilmadi (3 urinish, kirish psql'ga yetmadi). macOS Terminal ilovasida parol so'rovi ishladi, lekin `FATAL: password authentication failed for user "postgres"` (parol noto'g'ri). psql yo'li oxirigacha sinalmagan.
- `permission denied` (`auth.users` yoki `storage.objects` ga yozish) haqiqiy loyihada chiqmadi (yuqoridagi natija). Supabase 2025-04-21 dan `auth`/`storage` da jadval va funksiya yaratishni cheklagan; trigger va RLS siyosati ruxsat etilgan, oddiy yozish (DML) cheklovlar ro'yxatida yo'q (changelog 34270) va haqiqiy loyihada ishladi.

## 7. Kvota va tariflar

`plans` jadvalida `free`, `pro`, `elite`: `price_uzs = null`, `limits = {}` (cheklov yo'q). Qiymatlarni P19 da muallif beradi:

```sql
update public.plans
   set limits = '{"answers": {"max": <son>, "per": "day"}}'
 where code = 'free';
```

Kvota kalitlari: `sessions`, `questions`, `answers`, `daily`, `review_sessions` (batafsil: `migrations/20261108000008_rpc.sql` boshida).

## 8. Admin amallari

Faqat service role (SQL Editor yoki Edge Function), har biri `audit_log` ga yoziladi:

```sql
select public.admin_grant_plan('<user uuid>', 'pro', 30, 'sabab', 'muallif');
select public.admin_hide_question('<external_id>', 'sabab', 'muallif');
```

## 9. Savol qo'shish

Savollar migratsiyaga yozilmaydi. Ular alohida (keyingi vazifa) service role bilan `questions` ga yuklanadi: `status = 'draft'`, muallif tekshirgach `verified` va `verified_by`. College Board materiali qo'yilmaydi. Rasm `question-figures` bucket'iga, yo'li `figure.path` ga.

## 10. To'lov: inPAY Edge Function'lari

inPAY **API v2** (IP03, 2026-11-09). v1 (IP04) ishlatilmaydi: uning REST hujjatida webhook imzosi va sinov rejimi yo'q. Rasmiy `inpay-python` 1.0.1 SDK (IP02, manbasi 2026-11-10 da o'qildi) ham v1 uchun: `/api/v1/create/`, imzo `X-InPAY-Signature = hex(HMAC-SHA256(tana))` vaqt tamg'asisiz, maydonlar `order_id`, `amount`, `status = "success"`. Bu format v2 webhook'iga qo'llanmaydi (P21, muallif qarori 2026-11-10: v2 da qolinadi). Oqim va holatlar: `docs/ma'lumotlar-modeli.md`, "To'lov".

```
brauzer (hisobga kirgan) ── POST tolov-yaratish {"plan": "pro"} ─> payment_create (narx va muddat plans dan) ─> payments: created
                                                                ─> inPAY POST /payments/ (Idempotency-Key = payment id)
                                                                ─> payment_set_invoice ─> payments: pending, brauzerga checkout_url
inPAY ── POST inpay-webhook (X-Inpay-Signature) ─> imzo, 5 daqiqa ─> payment_apply_event (bitta tranzaksiya):
           payment_events (evt_ id unique) ─> summa, UZS, livemode, metadata.payment_id ─> payments: paid ─> subscriptions ─> audit_log
Supabase Cron (10 daqiqa) ── POST inpay-muvofiqlash (X-Cron-Secret) ─> payment_pending_stale (15 daqiqa–48 soat pending)
           ─> har biri: inPAY GET /payments/{id} ─> yakuniy bo'lsa payment_apply_event (poll_<id>_<status>)
```

- **Brauzer to'lovni tasdiqlay olmaydi**: `paid` va obunani faqat server yozadi: imzosi tekshirilgan webhook yoki `inpay-holat` (P20). `inpay-holat` inPAY'dan `GET /payments/{id}` bilan o'qiydi (IP03: webhook kelmasa shu bilan tekshiriladi) va natijani webhook bilan bir xil `payment_apply_event` ga `poll_<inpay id>_<status>` hodisa id si bilan beradi (summa, valyuta, livemode, metadata tekshiruvi o'sha yerda; takror chaqiruv `duplicate`). `return_url`: `/uz/sat/hisob/tolov-natija/?tolov=<id>`; sahifa `inpay-holat` ni 3 soniyada bir, 60 soniyagacha so'raydi.
- **Takror bosish**: `tolov-yaratish` shu foydalanuvchi va tarif uchun 30 daqiqa ichida ochilgan `pending` to'lov bo'lsa (kalit rejimi bir xil), yangisini yaratmaydi, o'sha `checkout_url` ni qaytaradi. inPAY checkout havolasining amal muddati hujjatda yo'q: tekshirish kerak.
- **Summa**: so'rov tanasida `amount`, `amount_uzs`, `price`... bo'lsa `400 amount_not_allowed`. Davr: hozir faqat `oylik` (`plans.period_days`); boshqasi `409 period_not_available` (3 oylik narx P19 da).
- **Kassa faol emas** (`merchant_inactive`): brauzerga `503 payments_unavailable`, logda aniq sabab (kalitsiz).
- **Narx**: brauzer summa yubormaydi, `plans.price_uzs` va `period_days` olinadi. Hozir ikkalasi `null` va `pro`/`elite` faol emas (P19), shuning uchun `tolov-yaratish` `409 plan_not_available` qaytaradi. Narxni muallif beradi (7-bo'lim), inPAY minimumi 1000 so'm.
- **Obuna muddati**: to'lov yaratilgan paytdagi `period_days` (`payments.raw.tayanch`). Shu tarifda faol obuna bo'lsa, yangisi uning oxiridan boshlanadi. Takroriy (avto) to'lov yo'q: har davr yangi to'lov. v2'da "Obunalar" bo'limi bor (IP03), keyingi vazifa.
- **Holatlar**: `created → pending → paid | failed | canceled`. `failed` yoki `canceled` dan keyin `payment.succeeded` kelsa `paid` bo'ladi (pul olingan). `paid` yakuniy.
- **Webhook javobi**: qayta ishlansa yoki xato bilan saqlansa 200; imzo yo'q, eskirgan yoki noto'g'ri bo'lsa 401 (P21 gacha yo'q/eskirgan 400 edi; tana parse qilinmaydi, bazaga yozilmaydi); baza xatosi 500 (inPAY 8 martagacha qayta yuboradi). Xato bilan saqlangan hodisalar (`unknown_order`, `amount_mismatch`, `livemode_mismatch`, `metadata_mismatch`) obuna bermaydi va qo'lda ko'riladi:

```sql
select received_at, event_id, provider_order_id, error from public.payment_events
 where error is not null order by received_at desc;
```

- **Audit (`payment_events.payload`)**: trigger faqat ruxsat etilgan maydonlarni saqlaydi: `id, object, type, created, livemode, source` va `data.object.{id, object, status, amount, currency, livemode, created, metadata.payment_id, metadata.plan_code}`, faqat oddiy qiymatlar. Boshqa maydonlar (telefon, karta, ism bo'lishi mumkin; v2 hodisasining to'liq tarkibi IP03 da sanab o'tilmagan) yozilmaydi, faqat NOMLARI `dropped` ro'yxatida qoladi. `payment_apply_event` to'liq hodisa bilan ishlaydi, faqat jurnal tozalanadi. Edge Function loglarida tana, imzo va sir yo'q.
- **Muvofiqlashtirish (`inpay-muvofiqlash`, P21)**: webhook kelmay qolsa (inPAY 8 marta urinadi, keyin to'xtaydi) 15 daqiqadan eski, 48 soatdan yangi `pending` to'lovlar inPAY'dan so'raladi va `inpay-holat` bilan umumiy kod (`_shared/tolovQollash.ts`) orqali qo'llanadi. Bir ishga tushishda ko'pi bilan 20 ta, 60 soniyadan keyin qolgani keyingi safarga. 48 soat va 20 ta Tayanch tanlovi. Obuna takror uzaytirilmaydi: keyin kelgan webhook `already_paid`, takror poll `duplicate`. Javob: `{"checked": n, "results": {"paid": 1, "pending": 2, ...}}`. Sir noto'g'ri bo'lsa 401, baza va inPAY'ga murojaat yo'q.
- **Chegara**: bir foydalanuvchida 1 soatda 5 tadan ortiq ochiq (`created`/`pending`) to'lov yaratilmaydi (`429`). Tayanch tanlovi.

### Secret'lar (muallif qo'yadi, qiymatlari repoga, chatga va logga yozilmaydi)

| Nom | Qayerdan | Izoh |
| --- | --- | --- |
| `INPAY_SECRET_KEY` | inPAY kabineti → Kassa → API v2 kalitlari | `sk_test_…` sinov, `sk_live_…` jonli. To'liq faqat yaratilganda bir marta ko'rsatiladi |
| `INPAY_WEBHOOK_SECRET` | `GET /webhooks/secret/` (faqat `sk_live_` bilan) yoki kabinet (tekshirish kerak) | `whsec_…`, sinov va jonli xabarlar uchun bitta |
| `MUVOFIQLASH_SECRET` | O'zingiz yaratasiz (masalan `openssl rand -hex 32`), Supabase Secrets va Vault'ga bir xil qiymat | `inpay-muvofiqlash` ni faqat Cron chaqira olishi uchun (`X-Cron-Secret`) |
| `SAYT_URL` (ixtiyoriy, maxfiy emas) | | Standart `https://javohirqaxramonov36-web.github.io/Tayanch` |
| `TOLOV_ORIGINLAR` (ixtiyoriy, maxfiy emas) | | Vergul bilan. Standart: GitHub Pages va `localhost:4321` |

`SUPABASE_URL` va service kaliti (`SUPABASE_SECRET_KEYS` yoki eski `SUPABASE_SERVICE_ROLE_KEY`) Supabase o'zi beradi. Funksiya sozlama yetishmasa `500 server_not_configured` qaytaradi va logga faqat NOMINI yozadi.

### inPAY kabinetida (muallif, deploy'dan oldin)

1. Kassa → API v2 kalitlari: kalit yaratish (avval `sk_test_`).
2. Oq ro'yxat (https://inpay.uz/merchant/whitelist/): `javohirqaxramonov36-web.github.io` (return_url) va `uvwejvjrsswssgydwevm.supabase.co` (webhook_url). Aks holda inPAY `domain_not_whitelisted` qaytaradi.
3. IP cheklovi o'chiq: Edge Function'ning chiquvchi IP manzili doimiy ekani tasdiqlanmagan (tekshirish kerak).

### Deploy (faqat muallif "ha" deganidan keyin)

```bash
supabase db push --remote
supabase functions deploy tolov-yaratish --no-verify-jwt --use-api
supabase functions deploy inpay-webhook --no-verify-jwt --use-api
supabase functions deploy inpay-holat --no-verify-jwt --use-api
supabase functions deploy inpay-muvofiqlash --no-verify-jwt --use-api
```

**Muvofiqlashtirishni rejalashtirish** (deploy'dan keyin, muallif SQL Editor'da; Supabase Cron = `pg_cron` + `pg_net`, sir Vault'da). Dashboard → Integrations → Cron va `pg_net` ni yoqish kerak; aniq yo'l va sintaksis Supabase "Scheduling Edge Functions" hujjatidan tekshirilsin (tekshirish kerak):

```sql
-- 1) Sir Vault'ga: qiymatni shu yerga o'zingiz yozasiz (repoga, chatga emas), MUVOFIQLASH_SECRET bilan bir xil.
select vault.create_secret('<MUVOFIQLASH_SECRET qiymati>', 'muvofiqlash_secret');
-- 2) Har 10 daqiqada.
select cron.schedule('inpay-muvofiqlash', '*/10 * * * *', $$
  select net.http_post(
    url     := 'https://uvwejvjrsswssgydwevm.supabase.co/functions/v1/inpay-muvofiqlash',
    headers := jsonb_build_object('x-cron-secret',
                 (select decrypted_secret from vault.decrypted_secrets where name = 'muvofiqlash_secret')),
    body    := '{}'::jsonb,
    timeout_milliseconds := 70000);
$$);
```

Qo'lda ishga tushirish (lokal `.env` da `MUVOFIQLASH_SECRET` bo'lsa; qiymat ekranga chiqmaydi):

```bash
set -a; . ./.env; set +a; curl -sS -X POST -H "x-cron-secret: $MUVOFIQLASH_SECRET" https://uvwejvjrsswssgydwevm.supabase.co/functions/v1/inpay-muvofiqlash
```

JWT tekshiruvi to'rttala funksiyada o'chiq: `inpay-webhook` ga inPAY Supabase JWT yubormaydi (imzo bilan tekshiriladi); `inpay-muvofiqlash` ni Cron chaqiradi (`X-Cron-Secret` bilan tekshiriladi); `tolov-yaratish` va `inpay-holat` foydalanuvchini kod ichida `auth.getUser` bilan tekshiradi. Bu `supabase/config.toml` da yozilgan (`[functions.<nom>]`: `verify_jwt = false`), shuning uchun bayroqsiz `supabase functions deploy <nom>` ham shunday deploy qilishi kerak (Supabase CLI config hujjati; CLI 3.0.0 da sinalmagan, tekshirish kerak). `--no-verify-jwt` zaxira sifatida buyruqda qoladi: natija bir xil. `--use-api`: Docker kerak emas. `supabase config diff` / `config push` bu bo'limlarni ko'rsatadimi yoki o'tkazib yuboradimi: tekshirish kerak. Manzillar: `https://uvwejvjrsswssgydwevm.supabase.co/functions/v1/<nom>`.

**Sinov rejimi xavfi**: `INPAY_SECRET_KEY` `sk_test_` bo'lganda test karta (`8600 0000 0000 0001`) bilan to'lov "o'tadi" va obuna beriladi. Shuning uchun sinov paytida tarif faqat sinov uchun faol qilinadi va oxirida yana yashiriladi (`is_active = false`), jonli rejimga `sk_live_` bilan o'tiladi. Jonli kalit bilan yaratilgan to'lovga sinov hodisasi (`livemode: false`) obuna bermaydi (`livemode_mismatch`).

### Sinov

```bash
npm run db:tekshir        # SQL: OK 16-21 (huquqlar, payment_create, webhook oqimi, takror hodisa, current_plan, muvofiqlash va audit)
npm run funksiyalar:tekshir   # Deno: imzo, inPAY mijozi, to'rttala funksiya oqimi; index.ts tur tekshiruvi
npm run inpay:webhook-sinov   # P21: haqiqiy SQL + haqiqiy handler, 5 stsenariy + muvofiqlashtirish (lokal test siri, inPAY soxta)
```

- **Sinalgan (2026-11-10, lokal, P21)**: `inpay:webhook-sinov` 7/7 guruh (noto'g'ri imzo, to'g'ri imzo, takror xabar, noto'g'ri summa, noma'lum to'lov, muvofiqlashtirish, loglar); 3 ta ataylab buzish ushlandi (imzo o'tkazib yuborilsa, payload tozalanmasa, paid to'lov qayta so'ralsa); SQL OK 21; Deno 49/49.

- **Sinalgan (2026-11-09, lokal)**: SQL sinovlari (OK 16–20) va 3 ta ataylab buzish (summa tekshiruvi, takror hodisa, huquq) ushlandi; Deno testlari 29/29; `index.ts` supabase-js 2.118.0 bilan tur tekshiruvidan o'tdi; handler'lar vaqtinchalik Postgres'dagi haqiqiy SQL funksiyalari bilan birga (inPAY soxta): created → pending → paid, 30 kunlik obuna, takror webhook, soxta imzo.
- **Sinalmagan (tekshirish kerak)**: Supabase'ga deploy, PostgREST orqali `rpc()` (lokal sinovda psql), haqiqiy inPAY (sinov kaliti bilan to'lov, webhook kelishi va imzo formati), `SUPABASE_SECRET_KEYS` tuzilishi, brauzerdan CORS, `/uz/sat/hisob/obuna/` va `/uz/sat/hisob/tolov-natija/` haqiqiy sessiya bilan (P20, faqat soxta holatda ko'rilgan).

## 11. Navigator onboarding (`onboarding_profiles`)

Migratsiya: `migrations/20261109130000_onboarding_profiles.sql` (mustaqil, boshqa ochiq PR migratsiyalariga bog'liq emas). Hali `db push` qilinmagan: muallif ko'rib chiqib o'zi qo'llaydi.

Lokal sinov (Docker kerak emas, oddiy Postgres):

```bash
psql -v ON_ERROR_STOP=1 -f supabase/tests/onboarding_shim.sql
psql -v ON_ERROR_STOP=1 -f supabase/migrations/20261109130000_onboarding_profiles.sql
psql -v ON_ERROR_STOP=1 -f supabase/tests/onboarding_profiles_test.sql
```

Qoidalar: RLS bilan faqat egasi o'qiydi va yozadi, `anon` ga huquq yo'q. `updated_at` ni mijoz yozadi; server kelajakdagi vaqtni `now()` ga tushiradi va eskiroq `updated_at` bilan kelgan UPDATE'ni e'tiborsiz qoldiradi (yangisi yutadi).
