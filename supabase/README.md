# Supabase: loyiha, sxema va hisob sozlamalari

Sxema, RLS va server funksiyalari (P02) hamda Auth dashboard sozlamalari (P03). Qarorlar: `docs/qarorlar/001-hisob-tolov-server.md`. Jadvallar va oqimlar: `docs/ma'lumotlar-modeli.md`. Brauzer uchun ochiq qiymatlar (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`): `docs/lokal-ish-tartibi.md`, "Supabase o'zgaruvchilari".

Bu qadamlarni **muallif** bajaradi. Kalit, parol va SMTP ma'lumotlari bu faylga **yozilmaydi**; ularni muallif Supabase dashboard'iga yoki secrets'ga o'zi kiritadi. Claude kalitlarni so'ramaydi, ko'rmaydi va yozmaydi. Loyiha ref'i ham yozilmaydi: buyruqlarda `<ref>`.

Manbalar (tekshirildi 2026-11-09): supabase.com/docs/guides/auth/redirect-urls, /auth/rate-limits, /auth/auth-smtp.

**Holat (2026-11-09):**
- Loyiha: Frankfurt mintaqasidagi Tayanch loyihasi (ref muallifda).
- Sxema: `migrations/20261108000001` … `09` Tayanch loyihasiga qo'llangan (P02).
- Auth: 3–4-bo'limdagi sozlamalar `supabase/config.toml` da yozilgan va qo'llangan (`supabase config push --remote=<ref>`; faylda yo'q sozlamalar o'zgarmaydi). O'zgargani: Site URL (`localhost:3000` edi), Redirect URL'lar (bo'sh edi), parol uzunligi 6 → 8. Email tasdiqlash avvaldan yoqilgan edi. Keyingi o'zgarishlar ham shu fayl orqali: avval `supabase config diff --remote=<ref>`, so'ng `push`.
- Brauzer kaliti: publishable (`sb_publishable_...`, legacy `anon` emas); `.env` va GitHub repo variables'ga qiymat ko'rsatilmasdan CLI orqali yozilgan.

## Papka

| Fayl | Nima |
| --- | --- |
| `config.toml` | Supabase CLI sozlamasi: Auth (Site URL, Redirect URL'lar, parol, email tasdiqlash). Faqat ochiq qiymatlar. |
| `migrations/20261108000001_asos.sql` … `09_storage.sql` | Tartiblangan migratsiyalar. Takror ishga tushirilsa buzilmaydi. |
| `tests/lokal-shim.sql` | **Faqat lokal sinov uchun**: oddiy Postgres'da Supabase rollari, `auth`, `storage` o'xshatmasi. Supabase loyihasida ishga tushirilmaydi. |
| `tests/rls_test.sql` | RLS va RPC sinovlari (ikki foydalanuvchi, anonim, service role). Bitta tranzaksiyada, oxirida `ROLLBACK`. |
| `../scripts/rls-tekshir.sh` | Lokal sinov: vaqtinchalik klaster, migratsiyalar 2 marta, testlar. `npm run db:tekshir` |

`config.toml` va `migrations/` bitta `supabase/` papkasida: CLI repo ildizidan ishga tushirilganda shu papkani o'zi topadi, `--workdir` kerak emas va `supabase init` qilinmaydi.

## 0. Bepul reja cheklovlari (majburiy)

- Supabase bepul rejasida faol bo'lmagan loyiha to'xtatilishi (pause) va zaxira nusxa (backup) cheklangan bo'lishi mumkin. Aniq shartlarni rasmiy sahifadan tekshiring: https://supabase.com/pricing va https://supabase.com/docs (Billing, Backups bo'limlari). Tekshirilgan sanani shu yerga yozing.
- **Pro rejaga o'tish qarori P28 da qabul qilinadi.** Unga qadar bepul reja faqat sinov va yopiq beta uchun.
- To'lov (inPAY) ishga tushmaguncha `subscriptions` ga faqat `admin_grant_plan` yozadi.

## 1. Kalitlar qayerda turadi

| Kalit | Joy |
| --- | --- |
| Supabase URL, publishable kalit (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`) | Sayt sozlamasi: lokal `.env` va GitHub repo variables. Ochiq bo'lishi mumkin, xavfsizlikni RLS ta'minlaydi (SB01). Dashboard: Project Settings → API. |
| `service_role` / secret kalit | Faqat Supabase Edge Functions muhiti (avtomatik) va lokal `supabase/functions/.env`. Saytga, repoga va chatga hech qachon. |
| Baza paroli | Parol menejeri (repoga emas). |
| Google client secret | Dashboard → Authentication → Providers |
| inPAY `merchant_id`, `bearer_token`, `webhook_secret` | `supabase secrets set ...` (SB02) va lokal `supabase/functions/.env` |
| SMTP host, username, parol | Dashboard → Authentication → Settings → SMTP (6-bo'lim) |

`.env` fayllari `.gitignore` da. Kalit oshkor bo'lsa: darhol rotate.

## 2. Migratsiyalarni qo'llash

Supabase CLI bilan (tavsiya): https://supabase.com/docs/guides/cli

```bash
supabase login
```

```bash
supabase link --project-ref <ref>
```

```bash
supabase db push
```

`db push` `supabase/migrations/` dagi qo'llanmagan fayllarni tartib bilan qo'llaydi. Bazadagi migratsiya tarixi repodagi fayllarga mos bo'lishi kerak: bazada bor, repoda yo'q migratsiya bo'lsa CLI "remote migration not found locally" bilan to'xtaydi. Shu sabab qo'llangan migratsiya fayllari o'zgartirilmaydi va o'chirilmaydi, o'zgarish faqat yangi raqamli fayl bilan. CLI'siz: Dashboard → SQL Editor'da fayllarni raqam tartibida birma-bir ishga tushiring (`tests/lokal-shim.sql` ni **emas**).

Tekshirish (Dashboard):
- **Table Editor**: har jadvalda "RLS enabled".
- **Database → Functions**: `start_session`, `submit_answer`, `daily_question`, `start_review_session`, `question_counts`, `usage_status`.
- **Storage**: `question-figures` bucket, Public = off.
- SQL Editor: `select * from private.run_spr_tests();` → bo'sh natija (hamma SPR holati o'tdi).

## 3. Auth: URL Configuration

Dashboard → Authentication → URL Configuration (`/dashboard/project/_/auth/url-configuration`). Qiymatlar `config.toml` da (`[auth]`); dashboard'da qo'lda o'zgartirilmaydi.

**Site URL** (havolada `redirectTo` bo'lmasa shu ishlatiladi):

```
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/kirish/
```

**Redirect URLs** (ruxsat ro'yxati). Hisob sahifalari 1-qavatda (`/uz/hisob/`, 2026-11-09). Kod ikkita manzilga qaytaradi: tasdiqlash xati → `kirish/` (ba'zan `?keyin=...` bilan), parol tiklash xati → `parol-tiklash/`. Eski `/uz/sat/hisob/` manzillari ham ro'yxatda qoladi (ular yangi joyga yo'naltiradi). Base `/Tayanch` harf katta-kichikligiga sezgir. Aniq ro'yxat: `config.toml`.

```
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/kirish/
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/kirish/**
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/parol-tiklash/
https://javohirqaxramonov36-web.github.io/Tayanch/uz/sat/hisob/kirish/**
https://javohirqaxramonov36-web.github.io/Tayanch/uz/sat/hisob/parol-tiklash/
http://localhost:4321/Tayanch/**
```

`**` har qanday belgini (`/` ham) qamraydi. Query (`?keyin=`) glob bilan mos kelishini hujjat aniq aytmaydi: **tekshirish kerak** (Supabase hujjatidagi glob sinov vositasida yoki haqiqiy xat bilan). Mos kelmasa, Supabase Site URL'ga qaytaradi: foydalanuvchi baribir kirgan bo'ladi, faqat `keyin` yo'qoladi.

Lokal port boshqacha bo'lsa (masalan `astro dev` 4321 dan boshqa), shu port ham qo'shiladi.

## 4. Auth: email bilan kirish

Dashboard → Authentication → Sign In / Providers → Email:

- **Confirm email**: yoqilgan (majburiy tasdiqlash, P03 talabi).
- **Minimum password length**: 8 dan kam emas (formadagi `hisobSozlama.parolMinUzunlik`; HANDOFF §5, 18-savol).
- **Secure password change** va boshqa sozlamalar: standart holatda.

Oqim turi: brauzer kodi `flowType: 'implicit'` ishlatadi (`src/lib/hisob.ts`). Sabab: xatdagi havola boshqa brauzer yoki telefonda ochilsa ham ishlashi kerak; PKCE havolani so'ragan brauzerni talab qiladi. Standart email shablonlari (`{{ .ConfirmationURL }}`) o'zgartirilmaydi: **tekshirish kerak**, `redirect_to` to'g'ri o'tishi birinchi haqiqiy sinovda ko'riladi.

## 5. Standart pochta xizmati: faqat sinov uchun

Supabase'ning o'z pochta xizmati (hujjat bo'yicha, 2026-11-09):

- soatiga **2 ta** xat (butun loyiha bo'yicha; ogohlantirishsiz o'zgarishi mumkin);
- faqat loyiha **jamoasi a'zolari** manziliga yuboradi, boshqa manzil "Email address not authorized" xatosini oladi (formada "Could not create the account" bo'lib chiqadi);
- yetkazish kafolati (SLA) yo'q.

Demak haqiqiy foydalanuvchilar uchun o'z SMTP kerak (P28). Shu paytgacha sinov faqat muallifning (jamoa a'zosi) email'i bilan.

## 6. O'z SMTP (P28 da bajariladi)

1. SMTP xizmatini tanlash (masalan Resend; hujjatda Resend, AWS SES, Postmark, SendGrid, ZeptoMail, Brevo bor). Narx va bepul limitni xizmatning o'z sahifasidan tekshirish.
2. Xizmatda yuboruvchi domenni tasdiqlash (DNS yozuvlari: SPF, DKIM). GitHub Pages'ning `github.io` domeni uchun DNS yozib bo'lmaydi: o'z domen kerak bo'ladi (**tekshirish kerak**: domen qarori muallifda).
3. Xizmatdan SMTP host, port, username va parol (API kalit) olish. Ular faqat dashboard'ga kiritiladi, repoga va chatga yozilmaydi.
4. Dashboard → Authentication → Settings → SMTP (`/dashboard/project/_/auth/smtp`): "Enable custom SMTP", host, port, username, password, From manzili (masalan `no-reply@<domen>`), yuboruvchi nomi ("Tayanch").
5. Dashboard → Authentication → Rate Limits: o'z SMTP bilan boshlang'ich limit soatiga 30 ta xat (hujjat); kerak bo'lsa oshiriladi.
6. Email shablonlari (Authentication → Emails): matnni inglizchaga moslash (SAT bo'limi), muallif tekshiradi.
7. Sinov: yangi email bilan ro'yxat, tasdiqlash, kirish, parol tiklash.

## 7. Sxema sinovi

Lokal (Postgres 15+ kerak, masalan `brew install postgresql@17`):

```bash
npm run db:tekshir
```

Natija: migratsiyalar 2 marta xatosiz, RLS hamma jadvalda, `OK 01` … `OK 15`, `HAMMASI O'TDI`.

Haqiqiy loyihada: `tests/rls_test.sql` ni SQL Editor yoki `psql` bilan ishga tushirish mumkin (u sinov foydalanuvchilarini `auth.users` ga yozadi va oxirida `ROLLBACK` qiladi). Real `auth.users` va `storage.objects` ga to'g'ridan-to'g'ri yozish lokal o'xshatmadagidek ishlashi: **tekshirish kerak**. Avval sinov (branch yoki alohida) loyihada sinang.

## 8. Kvota va tariflar

`plans` jadvalida `free`, `pro`, `elite`: `price_uzs = null`, `limits = {}` (cheklov yo'q). Qiymatlarni P19 da muallif beradi:

```sql
update public.plans
   set limits = '{"answers": {"max": <son>, "per": "day"}}'
 where code = 'free';
```

Kvota kalitlari: `sessions`, `questions`, `answers`, `daily`, `review_sessions` (batafsil: `migrations/20261108000008_rpc.sql` boshida).

## 9. Admin amallari

Faqat service role (SQL Editor yoki Edge Function), har biri `audit_log` ga yoziladi:

```sql
select public.admin_grant_plan('<user uuid>', 'pro', 30, 'sabab', 'muallif');
select public.admin_hide_question('<external_id>', 'sabab', 'muallif');
```

## 10. Savol qo'shish

Savollar migratsiyaga yozilmaydi. Ular alohida vazifada service role bilan `questions` ga yuklanadi: `status = 'draft'`, muallif tekshirgach `verified` va `verified_by`. College Board materiali qo'yilmaydi. Rasm `question-figures` bucket'iga, yo'li `figure.path` ga.

## 11. Keyingi vazifalar

- P03B: Google bilan kirish (Google provider, SB04 qo'llanmasi bo'yicha; client ID/secret faqat dashboard'da; Redirect URL'lar 3-bo'limdagi ro'yxatda).
- P12: profilni `profiles` jadvaliga ulash. Jadval (RLS bilan, `display_name`, `nickname`, `target_score`, `exam_date` va boshqalar) `migrations/20261108000002_profiles.sql` da bor, lekin sayt kodi uni hali ishlatmaydi: hozircha `display_name`, `nickname` Supabase `user_metadata` da.
- P23: Maxfiylik va Shartlar sahifalari (`hisobSozlama.maxfiylikSahifa`, `shartlarSahifa`).
- P28: o'z SMTP (6-bo'lim) va Pro rejaga o'tish qarori (0-bo'lim).
