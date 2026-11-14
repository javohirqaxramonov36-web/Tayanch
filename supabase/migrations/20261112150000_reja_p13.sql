-- P13. SAT haftalik reja (/uz/sat/vosita/reja/). Qoidalar: docs/reja-algoritmi.md, mijoz mantiqi src/lib/sat/reja.ts.
-- Reja faqat public.save_study_plan orqali yoziladi: har chaqiruv plan_rebuilds kvotasini sarflaydi
-- (o'chirib qayta tuzish bilan ham chetlab o'tib bo'lmaydi). Mijoz plan_tasks da faqat done_at, due_on, week, position
-- ni yangilaydi (checkbox va "Move missed tasks"), o'z rejasini va vazifasini o'chira oladi.
-- Kvota raqami P19 da: plans.limits da plan_rebuilds yo'q = cheklovsiz.
-- Takror ishga tushirilsa buzilmaydi.

------------------------------------------------------------------------------
-- Ustunlar
------------------------------------------------------------------------------
alter table public.study_plans
  add column if not exists bolim          text not null default 'sat',
  add column if not exists hours_per_week smallint,
  add column if not exists weak_skills    text[] not null default '{}',
  add column if not exists rules_version  smallint,
  add column if not exists start_date     date;

alter table public.study_plans drop constraint if exists study_plans_bolim_check;
alter table public.study_plans add constraint study_plans_bolim_check
  check (bolim in ('top-admission', 'sat', 'ielts', 'eyuf'));
alter table public.study_plans drop constraint if exists study_plans_hours_check;
alter table public.study_plans add constraint study_plans_hours_check check (hours_per_week between 2 and 20);
alter table public.study_plans drop constraint if exists study_plans_weak_skills_check;
alter table public.study_plans add constraint study_plans_weak_skills_check
  check (cardinality(weak_skills) <= 6 and array_position(weak_skills, null) is null);
alter table public.study_plans drop constraint if exists study_plans_rules_version_check;
alter table public.study_plans add constraint study_plans_rules_version_check check (rules_version between 1 and 1000);

alter table public.plan_tasks
  add column if not exists week    smallint,
  add column if not exists phase   text,
  add column if not exists minutes smallint;

alter table public.plan_tasks drop constraint if exists plan_tasks_week_check;
alter table public.plan_tasks add constraint plan_tasks_week_check check (week between 1 and 52);
alter table public.plan_tasks drop constraint if exists plan_tasks_phase_check;
alter table public.plan_tasks add constraint plan_tasks_phase_check
  check (phase in ('diagnostic', 'foundations', 'topic', 'timed', 'review', 'final'));
alter table public.plan_tasks drop constraint if exists plan_tasks_minutes_check;
alter table public.plan_tasks add constraint plan_tasks_minutes_check check (minutes between 1 and 600);
-- ref: faqat ichki '/uz/...' yo'l (src/lib/sat/reja.ts REF_NAQSH bilan bir xil). Eski qatorlar (P13 dan oldin UI yo'q edi)
-- tekshirilmaydi (not valid), yangi va yangilangan qatorlarga qo'llanadi.
alter table public.plan_tasks drop constraint if exists plan_tasks_ref_ichki;
alter table public.plan_tasks add constraint plan_tasks_ref_ichki
  check (ref is null or (ref ~ '^/uz/[a-z0-9/-]*/(\?[A-Za-z0-9=&%|,._~-]*)?$' and position('//' in ref) = 0)) not valid;

-- Har foydalanuvchida bo'lim bo'yicha bitta faol reja. Oldin bir nechta bo'lsa, eng yangisidan boshqasi arxivga.
update public.study_plans p
   set status = 'archived'
 where p.status = 'active'
   and exists (select 1 from public.study_plans n
                where n.user_id = p.user_id and n.bolim = p.bolim and n.status = 'active'
                  and (n.created_at, n.id) > (p.created_at, p.id));
create unique index if not exists study_plans_one_active
  on public.study_plans (user_id, bolim) where status = 'active';

------------------------------------------------------------------------------
-- Huquqlar: to'g'ridan yozish yopiq, vazifada faqat kuzatish ustunlari
------------------------------------------------------------------------------
revoke insert, update on table public.study_plans from authenticated;
revoke insert, update on table public.plan_tasks from authenticated;
grant update (done_at, due_on, week, position) on table public.plan_tasks to authenticated;
-- select va delete (o'z qatorlari, 0005 dagi RLS policy'lari) qoladi.

------------------------------------------------------------------------------
-- RPC
------------------------------------------------------------------------------

-- Rejani saqlash. p_plan: {bolim?, title?, exam_date?, target_score?, hours_per_week, weak_skills?, rules_version?, start_date?}.
-- p_tasks: [{due_on, title, kind?, ref?, week?, phase?, minutes?, done_at?}, ...] (1–400 ta, tartibi = position).
-- Avval kvota (har chaqiruv 1), keyin eski faol reja archived, yangisi active. Xato bo'lsa hech narsa yozilmaydi
-- (kvota ham qaytadi: bitta tranzaksiya). Noto'g'ri ref yoki ustun qiymati check_violation (23514) beradi.
create or replace function public.save_study_plan(p_plan jsonb, p_tasks jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user   uuid := private.require_user();
  v_bolim  text;
  v_skills text[];
  v_n      integer;
  v_id     uuid;
begin
  if jsonb_typeof(p_plan) is distinct from 'object' or jsonb_typeof(p_tasks) is distinct from 'array' then
    raise exception 'invalid_input' using errcode = '22023';
  end if;
  v_n := jsonb_array_length(p_tasks);
  if v_n < 1 or v_n > 400 then
    raise exception 'invalid_input' using errcode = '22023', detail = 'tasks: 1-400';
  end if;
  v_bolim := coalesce(p_plan ->> 'bolim', 'sat');
  if v_bolim <> 'sat' then
    raise exception 'invalid_input' using errcode = '22023', detail = 'bolim: faqat sat';
  end if;
  if p_plan -> 'weak_skills' is not null and jsonb_typeof(p_plan -> 'weak_skills') not in ('array', 'null') then
    raise exception 'invalid_input' using errcode = '22023', detail = 'weak_skills';
  end if;
  select coalesce(array_agg(btrim(s) order by o), '{}') into v_skills
    from jsonb_array_elements_text(coalesce(nullif(p_plan -> 'weak_skills', 'null'::jsonb), '[]'::jsonb)) with ordinality as w(s, o);
  if exists (select 1 from unnest(v_skills) s where char_length(s) not between 1 and 120) then
    raise exception 'invalid_input' using errcode = '22023', detail = 'weak_skills';
  end if;
  if exists (select 1 from jsonb_array_elements(p_tasks) t where jsonb_typeof(t) <> 'object') then
    raise exception 'invalid_input' using errcode = '22023', detail = 'tasks';
  end if;

  perform private.consume_quota(v_user, 'plan_rebuilds', 1);

  update public.study_plans
     set status = 'archived'
   where user_id = v_user and bolim = v_bolim and status = 'active';

  insert into public.study_plans (user_id, bolim, title, exam_date, target_score, hours_per_week, weak_skills,
                                  rules_version, start_date)
  values (v_user, v_bolim,
          coalesce(nullif(btrim(p_plan ->> 'title'), ''), 'SAT study plan'),
          (p_plan ->> 'exam_date')::date,
          (p_plan ->> 'target_score')::integer,
          (p_plan ->> 'hours_per_week')::smallint,
          v_skills,
          coalesce((p_plan ->> 'rules_version')::smallint, 1),
          coalesce((p_plan ->> 'start_date')::date, private.today_tashkent()))
  returning id into v_id;

  insert into public.plan_tasks (plan_id, user_id, due_on, title, kind, ref, position, done_at, week, phase, minutes)
  select v_id, v_user,
         (t ->> 'due_on')::date,
         t ->> 'title',
         t ->> 'kind',
         t ->> 'ref',
         (o - 1)::integer,
         (t ->> 'done_at')::timestamptz,
         (t ->> 'week')::smallint,
         t ->> 'phase',
         (t ->> 'minutes')::smallint
    from jsonb_array_elements(p_tasks) with ordinality as x(t, o);

  return v_id;
end
$$;

-- Zaif skill taklifi uchun: o'z urinishlari skill bo'yicha (attempts × questions). Faqat yig'indi.
create or replace function public.plan_skill_stats()
returns table (section text, skill text, answered integer, correct integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
begin
  return query
  select q.section, q.skill, count(*)::integer, (count(*) filter (where a.is_correct))::integer
    from public.attempts a
    join public.questions q on q.id = a.question_id
   where a.user_id = v_user
   group by q.section, q.skill
   order by q.section, q.skill;
end
$$;

revoke all on function public.save_study_plan(jsonb, jsonb), public.plan_skill_stats() from public, anon;
grant execute on function public.save_study_plan(jsonb, jsonb), public.plan_skill_stats() to authenticated;
