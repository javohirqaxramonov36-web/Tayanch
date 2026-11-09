# Supabase: loyiha va migratsiyalar

Sxema, RLS va server funksiyalari (P02). Qarorlar: `docs/qarorlar/001-hisob-tolov-server.md`. Jadvallar va oqimlar: `docs/ma'lumotlar-modeli.md`.

Bu qadamlarni **muallif** bajaradi. Claude kalitlarni so'ramaydi, ko'rmaydi va yozmaydi.

## Papka

| Fayl | Nima |
| --- | --- |
| `migrations/20261108000001_asos.sql` … `09_storage.sql` | Tartiblangan migratsiyalar. Takror ishga tushirilsa buzilmaydi. |
| `migrations/20261109120000_questions_p05.sql` | 0010: `questions` ni P05 savol formatiga moslash (ADR 002). |
| `tests/lokal-shim.sql` | **Faqat lokal sinov uchun**: oddiy Postgres'da Supabase rollari, `auth`, `storage` o'xshatmasi. Supabase loyihasida ishga tushirilmaydi. |
| `tests/rls_test.sql` | RLS va RPC sinovlari (ikki foydalanuvchi, anonim, service role). Bitta tranzaksiyada, oxirida `ROLLBACK`. |
| `../scripts/rls-tekshir.sh` | Lokal sinov: vaqtinchalik klaster, migratsiyalar 2 marta, testlar. `npm run db:tekshir` |

## 0. Ishga tushirishdan oldin (majburiy)

- **Bepul reja cheklovlari.** Supabase bepul rejasida faol bo'lmagan loyiha to'xtatilishi (pause) va zaxira nusxa (backup) cheklangan bo'lishi mumkin. Aniq shartlarni ishga tushirishdan oldin rasmiy sahifadan tekshiring: https://supabase.com/pricing va https://supabase.com/docs (Billing, Backups bo'limlari). Tekshirilgan sanani shu yerga yozing.
- **Pro rejaga o'tish qarori P28 da qabul qilinadi.** Unga qadar bepul reja faqat sinov va yopiq beta uchun.
- To'lov (inPAY) ishga tushmaguncha `subscriptions` ga faqat `admin_grant_plan` yozadi.

## 1. Loyiha yaratish

1. https://supabase.com/dashboard da yangi loyiha: nomi masalan `tayanch`, region foydalanuvchilarga yaqin (tanlov muallifda), baza paroli parol menejerida saqlanadi (repoga emas).
2. **Project Settings → API**: loyiha URL va **publishable (anon) kaliti**. Faqat shu ikkitasi saytga (brauzerga) beriladi. `service_role` / secret kaliti hech qachon saytga, repoga yoki chatga yozilmaydi.
3. **Authentication → Providers**: Email yoqilgan; Google (SB04 qo'llanmasi bo'yicha). Google client secret faqat Dashboard'da kiritiladi.
4. **Authentication → URL Configuration**: Site URL `https://javohirqaxramonov36-web.github.io/Tayanch/`, Redirect URL'lar ro'yxatiga `.../Tayanch/uz/hisob/` sahifalari (hisob sahifasi qurilganda aniq yo'llar qo'shiladi) va lokal `http://localhost:4321/Tayanch/`.

## 2. Migratsiyalarni qo'llash

Supabase CLI bilan (tavsiya): https://supabase.com/docs/guides/cli

```bash
supabase login
```

```bash
supabase link --project-ref <loyiha-ref>
```

```bash
supabase db push
```

CLI `supabase/config.toml` so'rasa, avval `supabase init` (mavjud `migrations/` papkasiga tegmasligi: tekshirish kerak). `db push` `supabase/migrations/` dagi qo'llanmagan fayllarni tartib bilan qo'llaydi. CLI'siz: Dashboard → SQL Editor'da fayllarni raqam tartibida birma-bir ishga tushiring (`tests/lokal-shim.sql` ni **emas**).

Tekshirish (Dashboard):
- **Table Editor**: har jadvalda "RLS enabled".
- **Database → Functions**: `start_session`, `submit_answer`, `daily_question`, `start_review_session`, `question_counts`, `usage_status`.
- **Storage**: `question-figures` bucket, Public = off.
- SQL Editor: `select * from private.run_spr_tests();` → bo'sh natija (hamma SPR holati o'tdi).

## 3. Kalitlar qayerda turadi

| Kalit | Joy |
| --- | --- |
| Supabase URL, publishable (anon) kalit | Sayt sozlamasi (ochiq bo'lishi mumkin, xavfsizlikni RLS ta'minlaydi, SB01) |
| `service_role` / secret kalit | Faqat Supabase Edge Functions muhiti (avtomatik) va lokal `supabase/functions/.env` |
| Google client secret | Dashboard → Authentication → Providers |
| inPAY `merchant_id`, `bearer_token`, `webhook_secret` | `supabase secrets set ...` (SB02) va lokal `supabase/functions/.env` |

`.env` fayllari `.gitignore` da. Kalit oshkor bo'lsa: darhol rotate.

## 4. Sinov

Lokal (Postgres 15+ kerak, masalan `brew install postgresql@17`):

```bash
npm run db:tekshir
```

Natija: migratsiyalar 2 marta xatosiz, RLS hamma jadvalda, `OK 01` … `OK 16`, `HAMMASI O'TDI`.

Haqiqiy loyihada: `tests/rls_test.sql` ni SQL Editor yoki `psql` bilan ishga tushirish mumkin (u sinov foydalanuvchilarini `auth.users` ga yozadi va oxirida `ROLLBACK` qiladi). Real `auth.users` va `storage.objects` ga to'g'ridan-to'g'ri yozish lokal o'xshatmadagidek ishlashi: **tekshirish kerak**. Avval sinov (branch yoki alohida) loyihada sinang.

## 5. Kvota va tariflar

`plans` jadvalida `free`, `pro`, `elite`: `price_uzs = null`, `limits = {}` (cheklov yo'q). Qiymatlarni P19 da muallif beradi:

```sql
update public.plans
   set limits = '{"answers": {"max": <son>, "per": "day"}}'
 where code = 'free';
```

Kvota kalitlari: `sessions`, `questions`, `answers`, `daily`, `review_sessions` (batafsil: `migrations/20261108000008_rpc.sql` boshida).

## 6. Admin amallari

Faqat service role (SQL Editor yoki Edge Function), har biri `audit_log` ga yoziladi:

```sql
select public.admin_grant_plan('<user uuid>', 'pro', 30, 'sabab', 'muallif');
select public.admin_hide_question('<external_id>', 'sabab', 'muallif');
```

## 7. Savol qo'shish

Savollar migratsiyaga yozilmaydi. Ular P05 importi bilan service role orqali `questions` ga yuklanadi (`docs/savol-formati.md` §7, ADR 002): `external_id` bo'yicha upsert, tasdiqlanmagani `draft`, muallif tasdiqlagani (`verified_by` ≠ `author`, `verified_at`) `verified`. College Board materiali qo'yilmaydi. Rasm `question-figures` bucket'iga, yo'li `figure.path` ga.

**0010 holati (2026-11-09):** Tayanch loyihasiga **qo'llangan** (muallif ishga tushirdi; `migration list` da 0001–0010 local = remote, yangi ustunlar `gen types` da ko'rindi). Keyingi migratsiyalar uchun tartib: `supabase --workdir "$PWD" migration list --remote=<ref>`, so'ng `db push --remote=<ref> --dry-run`, keyin `db push --remote=<ref>`. Bu branch'da `supabase/config.toml` yo'q: `--workdir` siz CLI yuqoridagi papkaga chiqib ketadi va "remote migration not found locally" deydi. Tekshirish (SQL Editor):

```sql
select column_name from information_schema.columns
 where table_schema = 'public' and table_name = 'questions'
   and column_name in ('drafted_by', 'verified_at', 'tags', 'content_hash');          -- 4 qator
select conname from pg_constraint where conrelid = 'public.questions'::regclass
   and conname in ('questions_verified_rule', 'questions_draft_rule', 'questions_figure_alt',
                   'questions_source_original', 'questions_drafted_by');               -- 5 qator
```
