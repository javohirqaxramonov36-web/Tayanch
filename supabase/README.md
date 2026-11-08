# Supabase: loyiha va migratsiyalar

Sxema, RLS va server funksiyalari (P02, PR #38). Haqiqiy loyihani ishga tushirish (P02b). Qarorlar: `docs/qarorlar/001-hisob-tolov-server.md`. Jadvallar va oqimlar: `docs/ma'lumotlar-modeli.md`.

Login, link, push va Dashboard qadamlarini **muallif** o'z terminali va brauzerida bajaradi. Claude kalit, token va baza parolini so'ramaydi, ko'rmaydi va yozmaydi. Repoga va chatga faqat project-ref yozilishi mumkin.

## Papka

| Fayl | Nima |
| --- | --- |
| `migrations/20261108000001_asos.sql` … `09_storage.sql` | Tartiblangan migratsiyalar. Takror ishga tushirilsa buzilmaydi. |
| `tests/lokal-shim.sql` | **Faqat lokal sinov uchun**: oddiy Postgres'da Supabase rollari, `auth`, `storage` o'xshatmasi. Supabase loyihasida ishga tushirilmaydi. |
| `tests/rls_test.sql` | RLS va RPC sinovlari (ikki foydalanuvchi, anonim, service role). Bitta tranzaksiyada, oxirida `ROLLBACK`. Faqat `psql` bilan (6-bo'lim). |
| `tests/loyiha_tekshir.sql` | Loyiha holatini tekshirish, **faqat o'qiydi**: RLS, RPC va ularning huquqlari, jadval huquqlari lokal sinov bilan bir xilligi, bucket, trigger, SPR, sinov qoldig'i. SQL Editor'da ham, `psql` da ham ishlaydi. |
| `../scripts/rls-tekshir.sh` | Lokal sinov: vaqtinchalik klaster, migratsiyalar 2 marta, testlar. `npm run db:tekshir` |

`supabase/.temp/` (CLI `link` dan keyin yaratadi: project-ref, pooler manzili) `.gitignore` da. `supabase/config.toml` hozircha yo'q (3-bo'lim).

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
- Email bilan ro'yxatdan o'tish jamoadan tashqaridagi foydalanuvchilarga ishlashi uchun o'z SMTP serveri kerak (alohida qaror, `/uz/hisob/` dan oldin).
- **Pro rejaga o'tish qarori P28 da qabul qilinadi.**
- To'lov (inPAY) ishga tushmaguncha `subscriptions` ga faqat `admin_grant_plan` yozadi.

## 1. Loyiha yaratish

Muallif yaratgan (reja Free). Yangi loyiha kerak bo'lsa: https://supabase.com/dashboard → New project, region foydalanuvchilarga yaqin, baza paroli parol menejerida (repoga emas).

## 2. Dashboard sozlamalari (muallif)

Hammasi Dashboard'da qilinadi, kalit qiymatlari repoga, chatga, logga yozilmaydi.

1. **Authentication → Sign In / Providers → Email**: yoqilgan, "Confirm email" yoqilgan. Standart SMTP cheklovi: 0-bo'lim. Sinov uchun loyiha jamoasi a'zosining manzili ishlaydi.
2. **Google** (SB04, https://supabase.com/docs/guides/auth/social-login/auth-google):
   1. Google Cloud Console → Google Auth Platform: **Data Access (Scopes)** da `openid` (qo'lda qo'shiladi), `.../auth/userinfo.email`, `.../auth/userinfo.profile`. Boshqa scope qo'shilmaydi (tekshiruv jarayoni uzayadi).
   2. **Clients** → yangi OAuth client, turi **Web application**.
   3. **Authorized JavaScript origins**: `https://javohirqaxramonov36-web.github.io` (yo'lsiz) va lokal `http://localhost:4321` (qo'llanma uni production'dan oldin olib tashlashni tavsiya qiladi).
   4. **Authorized redirect URIs**: Supabase Dashboard → Authentication → Providers → Google sahifasidagi **Callback URL** (nusxa ko'chiriladi, qo'lda yozilmaydi).
   5. Client ID va **Client Secret** faqat Supabase Dashboard'dagi Google provider sahifasiga kiritiladi, provider yoqiladi.
3. **Authentication → URL Configuration**:
   - Site URL: `https://javohirqaxramonov36-web.github.io/Tayanch/`
   - Redirect URLs: `https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/**` va `http://localhost:4321/Tayanch/**`. `**` kerak: `*` `/` dan o'tmaydi, saytda har manzil `/` bilan tugaydi. Aniq yo'llar `/uz/hisob/` qurilganda qayta ko'riladi.
4. **Anonymous sign-ins**: o'chiq qoladi (ishlatilmaydi).
5. **Data API** (exposed schemas): faqat `public` (va standart `graphql_public`). `private` qo'shilmaydi.
6. **API keys**: saytga keyingi vazifada faqat loyiha URL va publishable (anon) kalit beriladi (SB01). Secret / `service_role` kaliti hech qachon saytga, repoga, chatga.

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
- Token va parol: `login` brauzer orqali, token CLI'ning o'zida saqlanadi. Baza paroli so'ralsa, faqat terminalga kiritiladi.
- `config.toml`: `db push --dry-run` (lokal) usiz ishladi; `link` va `db push --remote` uchun kerakmi: haqiqiy loyihada tekshiriladi. So'ralsa `supabase init`: 2026-11-09 da nusxa papkada sinaldi, faqat `config.toml` va `.temp/` qo'shdi, `migrations/` fayllari o'zgarmadi (checksum bir xil). `config.toml` dagi auth qiymatlari lokal standart (`site_url = "http://127.0.0.1:3000"`), shuning uchun u repoga faqat ko'rib chiqilgandan keyin qo'shiladi va `supabase config push` ishlatilmaydi (Dashboard sozlamalarini almashtirishi mumkin: tekshirish kerak).
- CLI'siz: Dashboard → SQL Editor'da fayllarni raqam tartibida birma-bir (`tests/lokal-shim.sql` ni **emas**). Bunda migratsiyalar tarixi yozilmaydi, keyin `db push` ularni yangi deb hisoblaydi: tavsiya qilinmaydi.

## 4. Push dan keyin tekshirish

Dashboard → SQL Editor → `tests/loyiha_tekshir.sql` matnini qo'yib Run (yoki 6-bo'limdagi `psql` bilan `-f supabase/tests/loyiha_tekshir.sql`). Hamma qatorda `ok` yoki `info` bo'lishi kerak:

| tartib | tekshiruv | kutilgan |
| --- | --- | --- |
| 10 | RLS | 23 jadval, RLS o'chiq: yo'q |
| 20–22 | RPC | 9 / 9; anon hech birini, authenticated 7 tasini, `admin_*` ni faqat service_role chaqiradi; anon uchun boshqa public funksiya yo'q |
| 30, 40 | security definer, private | search_path hammasida; `private` anon/authenticated uchun yopiq |
| 50 | huquqlar | 46 qator, farqlar: 0 (farq bo'lsa 51-qatorlar: jadval / rol, kutilgan va haqiqiy) |
| 60, 61 | Storage | `question-figures` public = false; `question_figures_served_read` siyosati bor |
| 70 | trigger | `on_auth_user_created` bor va yoqilgan |
| 80 | SPR | 0 ta o'tmagan holat, jami 29 |
| 90–92 | ma'lumot | plans `limits={}`, narx null; savol 0; sinov qoldig'i 0 |
| 100 | Realtime | public jadval publikatsiyada yo'q |
| 110, 111 | info | standart huquqlar (lokal shim bilan solishtirish uchun), Postgres versiyasi |

Lokal natija (2026-11-09, Postgres 17.11): hamma qator `ok`; ataylab buzilganda (RLS o'chirildi, anon'ga `questions` SELECT, `admin_grant_plan` authenticated'ga, bucket ochildi) 4 tasi ham `XATO` bo'ldi. Dashboard'da ko'z bilan: Table Editor'da "RLS enabled", Storage'da bucket "Public" belgisiz.

## 5. Kalitlar qayerda turadi

| Kalit | Joy |
| --- | --- |
| Supabase URL, publishable (anon) kalit | Sayt sozlamasi (ochiq bo'lishi mumkin, xavfsizlikni RLS ta'minlaydi, SB01). Bu vazifada saytga ulanmaydi. |
| `service_role` / secret kalit | Faqat Supabase Edge Functions muhiti (avtomatik) va lokal `supabase/functions/.env` |
| Google client secret | Dashboard → Authentication → Providers → Google |
| Baza paroli | Parol menejeri; CLI yoki `psql` so'raganda terminalga |
| inPAY `merchant_id`, `bearer_token`, `webhook_secret` | `supabase secrets set ...` (SB02) va lokal `supabase/functions/.env` |

`.env` fayllari va `supabase/.temp/` `.gitignore` da. Kalit oshkor bo'lsa: darhol rotate.

## 6. Sinov

### Lokal

Postgres 15+ kerak (masalan `brew install postgresql@17`):

```bash
npm run db:tekshir
```

Natija: migratsiyalar 2 marta xatosiz, RLS hamma jadvalda, `OK 01` … `OK 15`, `HAMMASI O'TDI`.

### Haqiqiy loyihada (`rls_test.sql`)

Test 3 ta sinov foydalanuvchisini `auth.users` ga, 4 ta "SINOV" savolni `questions` ga, 2 ta yozuvni `storage.objects` ga yozadi, rollar bilan tekshiradi va oxirida `ROLLBACK` qiladi: bazada hech narsa qolmaydi. Xato bo'lsa `ON_ERROR_STOP` psql'ni to'xtatadi, tranzaksiya commit bo'lmaydi.

1. Shart: 4-bo'lim hamma qatori `ok`. Eng yaxshi vaqt: haqiqiy foydalanuvchilar hali yo'q (hozir).
2. **Faqat `psql`**: faylda psql meta-buyruqlari (`\set`, `\gset`) bor, SQL Editor ularni bajarmaydi.
3. Ulanish: Dashboard → **Connect** → **Session pooler** (port 5432, IPv4). Bepul rejada direct connection faqat IPv6; transaction pooler (6543) sessiya holatini saqlamaydi. Manzildan `:[YOUR-PASSWORD]` qismini olib tashlang: psql parolni o'zi so'raydi (parol buyruqlar tarixiga tushmaydi).
4. Repo ildizidan (Homebrew `psql` 17):

```bash
psql "postgresql://postgres.<loyiha-ref>@<pooler-host>:5432/postgres" -X -v ON_ERROR_STOP=1 -f supabase/tests/rls_test.sql
```

5. Kutilgan: `OK 01` … `OK 15`, `HAMMASI O'TDI`, oxirida `ROLLBACK`.
6. Keyin `loyiha_tekshir.sql` ni qayta ishga tushiring: 92-qator (sinov qoldig'i) `ok`.
7. 0-qadamda `permission denied` (`auth.users` yoki `storage.objects` ga to'g'ridan-to'g'ri yozish) chiqsa: xato qatorini Claude'ga ko'rsating, test moslanadi (masalan sinov foydalanuvchilari Dashboard → Authentication → Add user orqali). Supabase 2025-04-21 dan `auth`/`storage` da jadval va funksiya yaratishni cheklagan; trigger va RLS siyosati ruxsat etilgan, oddiy yozish (DML) cheklovlar ro'yxatida yo'q (changelog 34270). Real yozish ishlashi: **tekshirish kerak**.

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
