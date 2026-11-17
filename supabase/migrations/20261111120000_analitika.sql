-- P14. Analitika paneli ("My results", /uz/sat/vosita/natijalar/).
-- Bitta RPC: public.analytics_summary(). Hisob serverda, mijozga faqat yig'indi ketadi (attempts yuklanmaydi).
-- Kun chegarasi: Asia/Tashkent (private.today_tashkent bilan bir xil).
-- Kengaytirilgan bloklar (qiyinlik bo'yicha aniqlik va vaqt) plans.features dagi 'analytics_extended' kaliti bilan
-- yoqiladi: kalit bo'lmasa bu ma'lumot javobga umuman qo'shilmaydi.
-- Takror ishga tushirilsa buzilmaydi.

-- Tarif imkoniyati kaliti: plans.features massivida satr sifatida turadi.
-- snake_case kalit = mashina bayrog'i (Obuna sahifasi ko'rsatmaydi); boshqa satrlar = ko'rsatiladigan matn.
create or replace function private.has_feature(p_user uuid, p_key text, p_bolim text default 'sat')
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select (private.current_plan(p_user, p_bolim)).features ? p_key), false)
$$;

-- Muallif qarori (2026-11-11): kengaytirilgan analitika Pro va Elite'da.
update public.plans
set features = features || '["analytics_extended"]'::jsonb
where code in ('pro', 'elite') and bolim = 'sat' and not features ? 'analytics_extended';

create or replace function public.analytics_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user     uuid := private.require_user();
  v_today    date := private.today_tashkent();
  v_extended boolean := private.has_feature(v_user, 'analytics_extended');
  v_res      jsonb;
  v_last     date;
  v_streak   integer := 0;
begin
  -- Ketma-ket kunlar: oxirgi faol kun bugun yoki kecha bo'lsa, shu kungacha uzluksiz kunlar soni.
  select max(d) into v_last
  from (select distinct (a.created_at at time zone 'Asia/Tashkent')::date as d
        from public.attempts a where a.user_id = v_user) k;

  if v_last is not null and v_last >= v_today - 1 then
    select count(*) into v_streak
    from (
      select d, (v_last - d) - (row_number() over (order by d desc) - 1) as farq
      from (select distinct (a.created_at at time zone 'Asia/Tashkent')::date as d
            from public.attempts a where a.user_id = v_user) k
    ) t
    where t.farq = 0;
  end if;

  with u as (
    select a.is_correct, a.time_ms,
           (a.created_at at time zone 'Asia/Tashkent')::date as kun,
           q.section, q.domain, q.skill, q.difficulty
    from public.attempts a
    join public.questions q on q.id = a.question_id
    where a.user_id = v_user
  )
  select jsonb_build_object(
    'tz', 'Asia/Tashkent',
    'today', v_today,
    'extended', v_extended,
    'totals', jsonb_build_object(
      'attempts', (select count(*) from u),
      'correct', (select count(*) from u where is_correct),
      'bookmarks', (select count(*) from public.bookmarks b where b.user_id = v_user),
      'streak', v_streak,
      'active_days', (select count(distinct kun) from u)
    ),
    'sections', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'section', s.section, 'attempts', s.n, 'correct', s.c, 'time_ms', s.t) order by s.section), '[]'::jsonb)
      from (select section, count(*) as n, count(*) filter (where is_correct) as c,
                   coalesce(sum(time_ms), 0) as t
            from u group by section) s
    ),
    'skills', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'section', s.section, 'domain', s.domain, 'skill', s.skill,
        'attempts', s.n, 'correct', s.c) order by s.section, s.domain, s.skill), '[]'::jsonb)
      from (select section, domain, skill, count(*) as n, count(*) filter (where is_correct) as c
            from u group by section, domain, skill) s
    ),
    'days', (
      select coalesce(jsonb_agg(jsonb_build_object('date', s.kun, 'attempts', s.n) order by s.kun), '[]'::jsonb)
      from (select kun, count(*) as n from u where kun > v_today - 90 group by kun) s
    ),
    'reasons', (
      select coalesce(jsonb_agg(jsonb_build_object('tag', s.tag, 'count', s.n) order by s.n desc, s.tag), '[]'::jsonb)
      from (select r.reason_tag as tag, count(*) as n
            from public.review_queue r
            where r.user_id = v_user and r.reason_tag is not null
            group by r.reason_tag) s
    ),
    'reasons_untagged', (
      select count(*) from public.review_queue r where r.user_id = v_user and r.reason_tag is null
    ),
    -- Kengaytirilgan: qiyinlik guruhi bo'yicha aniqlik va vaqt. Guruhlar src/lib/savolBanki.ts dagi
    -- QIYINLIK_DARAJA bilan bir xil: easy = 1–2, medium = 3, hard = 4–5.
    -- median_ms: vaqt o'lchangan urinishlar medianasi (ochiq qolgan sahifa kabi chetki qiymatlar o'rtachani buzmasin).
    'difficulty', case when v_extended then (
      select coalesce(jsonb_agg(jsonb_build_object(
        'band', s.band, 'attempts', s.n, 'correct', s.c,
        'timed', s.tn, 'median_ms', s.med) order by s.tartib), '[]'::jsonb)
      from (select band, min(difficulty) as tartib, count(*) as n, count(*) filter (where is_correct) as c,
                   count(time_ms) as tn,
                   round((percentile_cont(0.5) within group (order by time_ms))::numeric)::integer as med
            from (select u.*, case when difficulty <= 2 then 'easy' when difficulty = 3 then 'medium' else 'hard' end as band
                  from u) ub
            group by band) s
    ) else null end
  ) into v_res;

  return v_res;
end
$$;

revoke all on function private.has_feature(uuid, text, text) from public, anon, authenticated;
revoke all on function public.analytics_summary() from public, anon;
grant execute on function public.analytics_summary() to authenticated;
