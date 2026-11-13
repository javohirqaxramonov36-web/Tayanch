-- P25: docs/metrikalar.sql uchun sun'iy ma'lumot va kutilgan natija. scripts/rls-tekshir.sh ishlatadi:
--   1) shu fayl ma'lumotni yozadi va kutilgan qatorlarni chiqaradi (unaligned, '|' bilan);
--   2) docs/metrikalar.sql ishga tushiriladi, har kutilgan qator natijada aynan bo'lishi tekshiriladi;
--   3) ma'lumot o'chiriladi.
-- Vaqtlar now() ga nisbatan: t0 = 10 kun oldin. Kun chegarasi Asia/Tashkent.
--
-- Foydalanuvchilar:
--   s1: t0 ro'yxat + first_session; t0+1 sessiya tugatdi va to'ladi (pro, 59000, livemode=true); t0+7 qaytdi
--   s2: t0 ro'yxat + first_session; t0+1 kun savoli, sinov to'lovi (livemode=false)
--   s3: t0 ro'yxat, boshqa hech narsa
--   s4: 2 kun oldin ro'yxat (D7 hali kelmagan)
\set ON_ERROR_STOP on
\set QUIET on

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000d1', 's1@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000d2', 's2@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000d3', 's3@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000d4', 's4@sinov.invalid', '{}');

insert into public.payments (user_id, plan_code, provider_order_id, amount_uzs, status, raw, paid_at, created_at) values
  ('00000000-0000-4000-8000-0000000000d1', 'pro', 'ms-1', 59000, 'paid', '{"inpay": {"livemode": true}}',
   now() - interval '9 days', now() - interval '9 days'),
  ('00000000-0000-4000-8000-0000000000d2', 'pro', 'ms-2', 1000, 'paid', '{"inpay": {"livemode": false}}',
   now() - interval '9 days', now() - interval '9 days');

-- Trigger yozgan hodisalar o'rniga vaqti aniq sun'iy hodisalar.
delete from public.events where user_id::text like '00000000-0000-4000-8000-0000000000d_';

create temporary table ms_hodisa (user_id uuid, name text, props jsonb, created_at timestamptz);
insert into ms_hodisa
select ('00000000-0000-4000-8000-0000000000' || u)::uuid, n, p::jsonb, now() - (k || ' days')::interval
from (values
  ('d1', 'signup', '{}', 10), ('d1', 'first_session', '{"mode": "practice", "question_count": 10}', 10),
  ('d1', 'session_completed', '{"mode": "practice", "question_count": 10}', 9),
  ('d1', 'payment_started', '{"plan_code": "pro", "amount_uzs": 59000}', 9),
  ('d1', 'payment_success', '{"plan_code": "pro", "amount_uzs": 59000, "livemode": true}', 9),
  ('d1', 'session_completed', '{"mode": "timed", "question_count": 5}', 3),
  ('d2', 'signup', '{}', 10), ('d2', 'first_session', '{"mode": "practice", "question_count": 10}', 10),
  ('d2', 'daily_question_answered', '{"section": "rw", "is_correct": false}', 9),
  ('d2', 'payment_started', '{"plan_code": "pro", "amount_uzs": 1000}', 9),
  ('d2', 'payment_success', '{"plan_code": "pro", "amount_uzs": 1000, "livemode": false}', 9),
  ('d3', 'signup', '{}', 10),
  ('d4', 'signup', '{}', 2)
) v (u, n, p, k);

insert into public.events (user_id, name, props, created_at) select * from ms_hodisa;

-- Kutilgan qatorlar (har biri docs/metrikalar.sql natijasida aynan bo'lishi kerak).
\pset format unaligned
\pset fieldsep '|'
\pset tuples_only on
with tk as (select (now() at time zone 'Asia/Tashkent')::date as bugun),
faol as (
  select distinct user_id, (created_at at time zone 'Asia/Tashkent')::date as kun from ms_hodisa where name <> 'signup'
)
-- 2. DAU
select kun || '|' || count(distinct user_id) from faol group by kun
union all
-- 3. WAU
select date_trunc('week', kun)::date || '|' || count(distinct user_id) from faol group by date_trunc('week', kun)
union all
-- 1. Joriy hafta: 4 ta yangi profil (hammasi hozir yaratilgan); ulashganlar: s4 shu haftada bo'lsa 1
select date_trunc('week', bugun)::date || '|4|' ||
       case when date_trunc('week', bugun - 2) = date_trunc('week', bugun) then 1 else 0 end from tk
union all
-- 4. Qaytish
select (bugun - 10) || '|3|2|66.7|1|33.3' from tk
union all
select (bugun - 2) || '|1|0|0.0||' from tk
union all
-- 5. Funnel
select '1|signup|4|100.0|'
union all select '2|first_session|2|50.0|50.0'
union all select '3|payment_started|2|50.0|100.0'
union all select '4|payment_success|1|25.0|50.0'
union all
-- 6. Daromad: faqat livemode=true
select date_trunc('month', (now() - interval '9 days') at time zone 'Asia/Tashkent')::date || '|pro|1|1|59000';
