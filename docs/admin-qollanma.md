# Admin qo'llanma: savol xabarlari (Report) va fikr-mulohaza (P24)

Alohida admin sahifasi yo'q (MVP qarori). Hamma ish Supabase panelida: **SQL Editor** (pastdagi tayyor so'rovlar) va kerak bo'lsa **Table Editor**. Panel bo'limlarining aniq nomlari Supabase versiyasiga qarab o'zgarishi mumkin (tekshirish kerak).

Sxema: `public.reports`, `public.feedback` (migratsiya `20261108000007_boshqa.sql`), cheklovlar `20261112151943_xabar_cheklov.sql`. Model: `docs/ma'lumotlar-modeli.md`.

## 0. Maxfiylik qoidasi

- SQL Editor `postgres` roli bilan ishlaydi va RLS'ni chetlab o'tadi: u hamma foydalanuvchining yozuvini ko'radi. Shuning uchun pastdagi so'rovlar `user_id` ni **tanlamaydi** va `auth.users` (email) bilan **birlashtirmaydi**. Kim yozgani kerak bo'lmaydi: savolni to'g'rilash uchun sabab va izoh yetadi.
- Table Editor `reports` va `feedback` jadvalida `user_id` ustunini ko'rsatadi. Skrinshot olmang va bu ustunni hech kimga ko'rsatmang.
- Izohda foydalanuvchi o'zi yoki boshqa odam haqida shaxsiy ma'lumot yozgan bo'lsa, izohni o'chiring (5-bo'lim). Formalarda ham "Don't include personal information" degan eslatma bor.
- Foydalanuvchi hisobini o'chirsa, uning xabarlari va fikrlari ham o'chadi (`on delete cascade`).
- Foydalanuvchi saytda faqat o'z xabarlarini ko'ra oladi (RLS `reports_select_own`, `feedback_select_own`). Bu `supabase/tests/xabar_test.sql` X08 da sinalgan.

## 1. Qoidalar

| Qoida | Qiymat | Qayerda |
| --- | --- | --- |
| Bitta savolga bitta ochiq xabar | `open` yoki `reviewed` holatida bittadan ortiq emas. `closed` dan keyin qayta yuborish mumkin | noyob indeks `reports_open_unique` + trigger |
| Report tezligi | 24 soatda 10 ta | `private.xabar_limit('report')` |
| Feedback tezligi | 24 soatda 5 ta | `private.xabar_limit('feedback')` |
| Report qaysi savolga | faqat `verified` yoki `hidden` (qoralamaga emas) | `private.reports_guard()` |
| Holatni kim o'zgartiradi | faqat admin (SQL Editor). Foydalanuvchi `status` ni yoza olmaydi | jadval huquqlari |

Limitlar **boshlang'ich qiymat, muallif tasdig'i kerak**. O'zgartirish uchun yangi migratsiyada `private.xabar_limit()` qayta yoziladi.

Holatlar: `open` (yangi) → `reviewed` (ko'rildi, ish ketmoqda) → `closed` (hal qilindi yoki xato emas).

## 2. Ko'rib chiqish: tayyor so'rovlar

### 2.1. Savol bo'yicha ochiq xabarlar soni

```sql
select q.external_id,
       q.status                                              as savol_holati,
       q.version,
       count(*) filter (where r.status = 'open')             as ochiq,
       count(*) filter (where r.status = 'reviewed')         as korilmoqda,
       count(distinct r.user_id)                             as foydalanuvchilar_soni,
       count(*) filter (where r.reason = 'wrong_answer')     as wrong_answer,
       count(*) filter (where r.reason = 'unclear')          as unclear,
       count(*) filter (where r.reason = 'typo')             as typo,
       count(*) filter (where r.reason = 'figure')           as figure,
       count(*) filter (where r.reason = 'other')            as other,
       max(r.created_at)                                     as oxirgi_xabar
  from public.reports r
  join public.questions q on q.id = r.question_id
 where r.status in ('open', 'reviewed')
 group by q.external_id, q.status, q.version
 order by foydalanuvchilar_soni desc, oxirgi_xabar desc;
```

`foydalanuvchilar_soni` faqat son. Kimligi ko'rsatilmaydi.

### 2.2. Ochiq xabarlar ro'yxati (izoh bilan)

```sql
select r.id, q.external_id, r.reason, r.message, r.created_at
  from public.reports r
  join public.questions q on q.id = r.question_id
 where r.status = 'open'
 order by r.created_at desc
 limit 100;
```

### 2.3. Bitta savolning hamma xabarlari

```sql
select r.id, r.reason, r.message, r.status, r.created_at
  from public.reports r
  join public.questions q on q.id = r.question_id
 where q.external_id = 'SAVOL-ID'
 order by r.created_at desc;
```

### 2.4. So'nggi fikr-mulohazalar

```sql
select f.created_at, f.page, f.message
  from public.feedback f
 order by f.created_at desc
 limit 50;
```

Kunlar bo'yicha soni:

```sql
select date_trunc('day', created_at at time zone 'Asia/Tashkent') as kun, count(*)
  from public.feedback
 group by 1 order by 1 desc limit 30;
```

## 3. Xabarni belgilash

```sql
-- Ko'rildi (ish ketmoqda)
update public.reports set status = 'reviewed' where id = 'XABAR-UUID';

-- Xato emas yoki hal qilindi
update public.reports set status = 'closed' where id = 'XABAR-UUID';
```

## 4. Savolni yashirish va to'g'rilangan savolni qayta ochish

Savol yashirilsa, u yangi sessiyalarga va kun savoliga chiqmaydi.

```sql
select public.admin_hide_question('SAVOL-ID', 'Report: noto''g''ri javob', 'Muallif ismi');
```

To'g'rilash tartibi (P05, `docs/savol-formati.md`; PR #63 merge bo'lgach skriptlar `main` da bo'ladi):

1. Savollar papkasidagi (`TAYANCH_SAVOLLAR_DIR`) JSON faylda xatoni to'g'rilang va **`version` ni 1 ga oshiring**. Version oshmasa import savolni rad etadi.
2. `npm run savol:tekshir`, keyin `npm run savol:korib-chiq`.
3. Qayta tasdiqlang: `npm run savol:tasdiqla -- --kim "Ism Familiya" --fayl <...-tasdiqlash.txt>`. Mazmun o'zgargani uchun eski tasdiq hash'i mos kelmaydi.
4. `npm run savol:import` (dry-run), natijani ko'ring, keyin `npm run savol:import -- --apply`. Import bazadagi `hidden` holatni **saqlab qoladi**, savol avtomatik ochilmaydi.
5. Savolni qayta oching (`audit_log` ga yoziladi; savolda `verified_by` bo'lmasa rad etadi):

   ```sql
   select public.admin_unhide_question('SAVOL-ID', 'v2 da to''g''rilandi', 'Muallif ismi');
   ```

6. Shu savolning ochiq xabarlarini yoping:

   ```sql
   update public.reports set status = 'closed'
    where question_id = (select id from public.questions where external_id = 'SAVOL-ID')
      and status in ('open', 'reviewed');
   ```

Yopilgandan keyin foydalanuvchi yangi versiyada yana xato ko'rsa, qayta xabar yubora oladi.

Amallar jurnali:

```sql
select created_at, actor, action, details
  from public.audit_log
 where action in ('hide_question', 'unhide_question')
 order by created_at desc limit 50;
```

## 5. Izohdagi shaxsiy ma'lumotni o'chirish

```sql
update public.reports set message = null where id = 'XABAR-UUID';
delete from public.feedback where id = 'FIKR-UUID';  -- feedback'da message majburiy, shuning uchun yozuv o'chiriladi
```

`feedback.id` ni ko'rish uchun 2.4 dagi so'rovga `f.id` qo'shing.

## 6. Taklif (qurilmagan): avtomatik yashirish

Muallif qarori kutilmoqda (2026-11-12), hozircha **qurilmaydi**.

- Qoida: 14 kun ichida 3 ta turli foydalanuvchi `verified` savolga ochiq `wrong_answer` xabarini yuborsa, trigger savolni `hidden` qiladi va `audit_log` ga `auto_hide` (actor `trigger:reports`) yozadi.
- Faqat `wrong_answer` hisoblanadi: typo va unclear savolni ishlatib bo'lmaydigan qilmaydi.
- Xavfi: bir necha kishi kelishib noto'g'ri xabar yuborsa, to'g'ri savol yashirinib qoladi. Shuning uchun savol faqat yashiriladi, hech narsa o'chirilmaydi va muallif 4-bo'limdagi tartibda qayta ochadi.
- Ochiq savollar: N (3) va muddat (14 kun) qiymatlari, avtomatik yashirilganda muallifga xabar berish (hozir email yo'q, faqat 2.1 so'rovi).
