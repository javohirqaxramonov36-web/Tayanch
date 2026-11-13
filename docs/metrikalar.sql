-- Tayanch mahsulot metrikalari (P25). FAQAT O'QIYDI.
-- Qayerda: Supabase Dashboard -> SQL Editor (postgres roli). Kerakli so'rovni belgilab, "Run" bosing.
-- Har so'rov alohida ishlaydi. Natijada faqat sonlar: email, ism, foydalanuvchi ID chiqmaydi.
--
-- Manba: public.events (birinchi tomon hodisalari, migratsiya 20261112143717_metrikalar.sql) va
-- public.payments / public.profiles (faqat sanash va summa).
-- Kun chegarasi: Asia/Tashkent (sayt bo'yicha bir xil). Hafta dushanbadan boshlanadi.
--
-- Muhim:
--   * "Faol" = shu kuni signup'dan boshqa kamida bitta hodisasi bor foydalanuvchi (first_session,
--     session_completed, daily_question_answered, plan_viewed, payment_*). Faqat savol yechib sessiyani
--     tugatmagan kun hisobga kirmaydi.
--   * "Share usage statistics" ni o'chirgan foydalanuvchilarning to'lovdan boshqa hodisalari o'chiriladi:
--     faollik, qaytish va funnel faqat ulashayotganlar bo'yicha. Hisoblar soni (profiles) va daromad (payments)
--     hammani o'z ichiga oladi.
--   * Daromad va funnel'ning oxirgi qadami faqat haqiqiy to'lovlar (inPAY livemode = true). Sinov to'lovlari
--     (livemode = false) hisobga kirmaydi.

-- 1. Ro'yxatdan o'tganlar, haftalik (oxirgi 12 hafta)
--    hisoblar: yangi profillar (hamma); ulashganlar: signup hodisasi bor (statistikani o'chirmaganlar).
with h as (
  select generate_series(
    date_trunc('week', (now() at time zone 'Asia/Tashkent') - interval '11 weeks')::date,
    date_trunc('week', now() at time zone 'Asia/Tashkent')::date,
    interval '1 week')::date as hafta
)
select h.hafta,
       (select count(*) from public.profiles p
         where date_trunc('week', p.created_at at time zone 'Asia/Tashkent')::date = h.hafta) as hisoblar,
       (select count(*) from public.events e
         where e.name = 'signup'
           and date_trunc('week', e.created_at at time zone 'Asia/Tashkent')::date = h.hafta) as ulashganlar
from h
order by h.hafta;

-- 2. Kunlik faol foydalanuvchilar (oxirgi 30 kun; faol kuni bo'lmagan sana chiqmaydi)
select (e.created_at at time zone 'Asia/Tashkent')::date as kun,
       count(distinct e.user_id) as faol
from public.events e
where e.name <> 'signup'
  and e.created_at >= now() - interval '31 days'
group by 1
order by 1;

-- 3. Haftalik faol foydalanuvchilar (oxirgi 12 hafta)
select date_trunc('week', e.created_at at time zone 'Asia/Tashkent')::date as hafta,
       count(distinct e.user_id) as faol
from public.events e
where e.name <> 'signup'
  and e.created_at >= date_trunc('week', (now() at time zone 'Asia/Tashkent') - interval '11 weeks')
                      at time zone 'Asia/Tashkent'
group by 1
order by 1;

-- 4. D1 va D7 qaytish (ro'yxat kuni bo'yicha kohort, oxirgi 30 kun)
--    D1: ro'yxatdan keyingi kun faol; D7: aynan 7-kuni faol. Kun hali kelmagan bo'lsa bo'sh (null).
with kohort as (
  select e.user_id, min((e.created_at at time zone 'Asia/Tashkent')::date) as kun
  from public.events e
  where e.name = 'signup'
  group by e.user_id
),
faol as (
  select distinct e.user_id, (e.created_at at time zone 'Asia/Tashkent')::date as kun
  from public.events e
  where e.name <> 'signup'
),
bugun as (select (now() at time zone 'Asia/Tashkent')::date as d)
select k.kun as royxat_kuni,
       count(*) as royxat,
       case when k.kun + 1 <= b.d then count(*) filter (where exists (
         select 1 from faol f where f.user_id = k.user_id and f.kun = k.kun + 1)) end as d1,
       case when k.kun + 1 <= b.d then round(100.0 * count(*) filter (where exists (
         select 1 from faol f where f.user_id = k.user_id and f.kun = k.kun + 1)) / count(*), 1) end as d1_foiz,
       case when k.kun + 7 <= b.d then count(*) filter (where exists (
         select 1 from faol f where f.user_id = k.user_id and f.kun = k.kun + 7)) end as d7,
       case when k.kun + 7 <= b.d then round(100.0 * count(*) filter (where exists (
         select 1 from faol f where f.user_id = k.user_id and f.kun = k.kun + 7)) / count(*), 1) end as d7_foiz
from kohort k cross join bugun b
where k.kun >= b.d - 30
group by k.kun, b.d
order by k.kun;

-- 5. Funnel: signup -> first_session -> payment_started -> payment_success (oxirgi 30 kunda ro'yxatdan o'tganlar)
--    Har qadam oldingi qadamni bosib o'tganlar ichidan sanaladi. payment_success: faqat livemode = true.
with s as (
  select e.user_id, min(e.created_at) as t
  from public.events e
  where e.name = 'signup' and e.created_at >= now() - interval '30 days'
  group by e.user_id
),
q as (
  select s.user_id,
         exists (select 1 from public.events e where e.user_id = s.user_id and e.name = 'first_session') as fs,
         exists (select 1 from public.events e where e.user_id = s.user_id and e.name = 'payment_started') as ps,
         exists (select 1 from public.events e where e.user_id = s.user_id and e.name = 'payment_success'
                   and e.props ->> 'livemode' = 'true') as pp
  from s
),
f as (
  select 1 as tartib, 'signup' as qadam, count(*) as soni from q
  union all select 2, 'first_session', count(*) filter (where fs) from q
  union all select 3, 'payment_started', count(*) filter (where fs and ps) from q
  union all select 4, 'payment_success', count(*) filter (where fs and ps and pp) from q
)
select f.tartib, f.qadam, f.soni,
       round(100.0 * f.soni / nullif(first_value(f.soni) over (order by f.tartib), 0), 1) as signup_dan_foiz,
       round(100.0 * f.soni / nullif(lag(f.soni) over (order by f.tartib), 0), 1) as oldingidan_foiz
from f
order by f.tartib;

-- 6. Tarif bo'yicha daromad, oylik (faqat haqiqiy to'lovlar: status = 'paid', livemode = true)
select date_trunc('month', p.paid_at at time zone 'Asia/Tashkent')::date as oy,
       p.plan_code as tarif,
       count(*) as tolovlar,
       count(distinct p.user_id) as tolovchilar,
       sum(p.amount_uzs) as summa_uzs
from public.payments p
where p.status = 'paid'
  and p.paid_at is not null
  and p.raw -> 'inpay' ->> 'livemode' = 'true'
group by 1, 2
order by 1, 2;
