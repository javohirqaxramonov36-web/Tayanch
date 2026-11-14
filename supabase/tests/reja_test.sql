-- P13 reja sinovlari (20261112150000_reja_p13): save_study_plan, plan_skill_stats, huquqlar, kvota.
-- rls_test.sql kabi: bitta tranzaksiya, oxirida ROLLBACK. Hamma ma'lumot "SINOV" matnli soxta yozuvlar.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000e1', 'ra@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000e2', 'rb@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000e3', 'rc@sinov.invalid', '{}');

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, status, author, verified_by)
values
  ('rj-m1', 'math', 'RJ-domain', 'RJ-skill-m', 2, 'mcq', 'SINOV savol 1',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "B"}', 'SINOV izoh', 'draft', 'sinov', null),
  ('rj-r1', 'rw', 'RJ-domain-rw', 'RJ-skill-r', 3, 'mcq', 'SINOV savol 2',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "A"}', 'SINOV izoh', 'draft', 'sinov', null);

do $$
declare
  a constant uuid := '00000000-0000-4000-8000-0000000000e1';
  s uuid;
begin
  insert into public.practice_sessions (user_id, mode) values (a, 'practice') returning id into s;
  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version)
  select a, s, q.id, 'A', q.external_id = 'rj-r1', 1 from public.questions q where q.external_id in ('rj-m1', 'rj-r1');
  insert into public.practice_sessions (user_id, mode) values (a, 'practice') returning id into s;
  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version)
  select a, s, q.id, 'B', true, 1 from public.questions q where q.external_id = 'rj-m1';
end
$$;

-- Namuna reja: 3 vazifa. Sahifa yuboradigan shakl (src/lib/sat/reja.ts serverArgumentlari).
select set_config('rj.plan', '{"title": "SINOV reja", "exam_date": "2026-12-20", "target_score": 1400, "hours_per_week": 6,
  "weak_skills": ["Transitions", "Circles"], "rules_version": 1, "start_date": "2026-11-12"}', false),
       set_config('rj.tasks', '[
  {"due_on": "2026-11-12", "title": "SINOV test", "kind": "rasmiy-test", "ref": "/uz/sat/vosita/rasmiy-testlar/", "week": 1, "phase": "diagnostic", "minutes": 180},
  {"due_on": "2026-11-13", "title": "SINOV bank", "kind": "bank", "ref": "/uz/sat/mashq/bank/?section=rw&skills=Form%2C%20Structure%2C%20and%20Sense|Transitions&difficulty=easy,medium&mode=practice&size=10", "week": 1, "phase": "diagnostic", "minutes": 45},
  {"due_on": "2026-11-20", "title": "SINOV takrorlash", "kind": "takrorlash", "ref": "/uz/sat/vosita/takrorlash/", "week": 2, "phase": "topic", "minutes": 45, "done_at": "2026-11-12T10:00:00Z"}
]', false)
\gset

-- R01. Anonim: RPC va jadvallar yopiq
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.save_study_plan(current_setting('rj.plan')::jsonb, current_setting('rj.tasks')::jsonb);
    raise exception 'FAIL R01: anon save_study_plan ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.plan_skill_stats();
    raise exception 'FAIL R01: anon plan_skill_stats ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.study_plans;
    raise exception 'FAIL R01: anon study_plans ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK R01 anon: save_study_plan, plan_skill_stats va study_plans yopiq';
end
$$;
reset role;

-- R02–R04. A: to'g'ridan yozish taqiq, RPC bilan saqlash, arxivlash, kuzatish ustunlari
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e1", "role": "authenticated"}', true) \gset
do $$
declare
  a   constant uuid := '00000000-0000-4000-8000-0000000000e1';
  p1  uuid;
  p2  uuid;
  t   uuid;
  n   integer;
  r   record;
begin
  -- R02
  begin
    insert into public.study_plans (title) values ('SINOV to''g''ridan');
    raise exception 'FAIL R02: study_plans ga to''g''ridan insert o''tdi';
  exception when insufficient_privilege then null;
  end;

  p1 := public.save_study_plan(current_setting('rj.plan')::jsonb, current_setting('rj.tasks')::jsonb);

  begin
    insert into public.plan_tasks (plan_id, title, ref) values (p1, 'SINOV to''g''ridan', '/uz/sat/');
    raise exception 'FAIL R02: plan_tasks ga to''g''ridan insert o''tdi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.study_plans set status = 'archived' where id = p1;
    raise exception 'FAIL R02: study_plans ni to''g''ridan yangiladi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.plan_tasks set ref = 'https://boshqa.example/' where plan_id = p1;
    raise exception 'FAIL R02: plan_tasks.ref ni yangiladi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.plan_tasks set title = 'buzildi' where plan_id = p1;
    raise exception 'FAIL R02: plan_tasks.title ni yangiladi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK R02 to''g''ridan insert/update yopiq (study_plans, plan_tasks.ref/title)';

  -- R03
  select * into r from public.study_plans where id = p1;
  if r.status <> 'active' or r.bolim <> 'sat' or r.hours_per_week <> 6 or r.weak_skills <> array['Transitions', 'Circles']
     or r.rules_version <> 1 or r.start_date <> date '2026-11-12' or r.exam_date <> date '2026-12-20' or r.target_score <> 1400 then
    raise exception 'FAIL R03: reja maydonlari: %', row_to_json(r);
  end if;
  select count(*) into n from public.plan_tasks where plan_id = p1;
  if n <> 3 then raise exception 'FAIL R03: vazifalar soni % (kutilgan 3)', n; end if;
  if (select string_agg(position::text || ':' || phase || ':' || minutes || ':' || week, ',' order by position)
        from public.plan_tasks where plan_id = p1) <> '0:diagnostic:180:1,1:diagnostic:45:1,2:topic:45:2' then
    raise exception 'FAIL R03: position/phase/minutes/week';
  end if;
  if (select done_at from public.plan_tasks where plan_id = p1 and position = 2) <> timestamptz '2026-11-12T10:00:00Z' then
    raise exception 'FAIL R03: done_at saqlanmadi (brauzerdagi belgilar hisobga ko''chishi kerak)';
  end if;

  p2 := public.save_study_plan(current_setting('rj.plan')::jsonb - 'weak_skills', current_setting('rj.tasks')::jsonb);
  if (select status from public.study_plans where id = p1) <> 'archived' then raise exception 'FAIL R03: eski reja arxivlanmadi'; end if;
  if (select count(*) from public.study_plans where status = 'active') <> 1 then raise exception 'FAIL R03: faol reja bittadan ko''p'; end if;
  if (select weak_skills from public.study_plans where id = p2) <> '{}' then raise exception 'FAIL R03: weak_skills bo''sh emas'; end if;
  if (select count from public.usage_counters where user_id = a and key = 'plan_rebuilds') <> 2 then
    raise exception 'FAIL R03: plan_rebuilds hisoblagichi 2 emas';
  end if;
  raise notice 'OK R03 save_study_plan: maydonlar, tartib, done_at; qayta saqlash eski rejani arxivlaydi, hisoblagich 2';

  -- R04
  select id into t from public.plan_tasks where plan_id = p2 and position = 0;
  update public.plan_tasks set done_at = now(), due_on = date '2026-11-14', week = 1, position = 5 where id = t;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'FAIL R04: kuzatish ustunlari yangilanmadi'; end if;
  begin
    update public.plan_tasks set week = 99 where id = t;
    raise exception 'FAIL R04: week 99 o''tdi';
  exception when check_violation then null;
  end;
  delete from public.plan_tasks where plan_id = p2 and position = 1;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'FAIL R04: o''z vazifasini o''chira olmadi'; end if;
  delete from public.study_plans where id = p1;
  get diagnostics n = row_count;
  if n <> 1 then raise exception 'FAIL R04: o''z arxiv rejasini o''chira olmadi'; end if;
  -- o'chirish kvotani qaytarmaydi
  p1 := public.save_study_plan(current_setting('rj.plan')::jsonb, current_setting('rj.tasks')::jsonb);
  if (select count from public.usage_counters where user_id = a and key = 'plan_rebuilds') <> 3 then
    raise exception 'FAIL R04: o''chirgandan keyin saqlash hisoblagichni oshirmadi';
  end if;
  perform set_config('rj.p_a', p1::text, false);
  raise notice 'OK R04 done_at/due_on/week/position yangilanadi, check ishlaydi, o''chirish mumkin, o''chirish kvotani qaytarmaydi';

  -- R06. Noto'g'ri kirish: hech narsa yozilmaydi, kvota sarflanmaydi
  begin
    perform public.save_study_plan(current_setting('rj.plan')::jsonb,
      '[{"due_on": "2026-11-12", "title": "SINOV", "ref": "https://boshqa.example/uz/"}]');
    raise exception 'FAIL R06: tashqi ref qabul qilindi';
  exception when check_violation then null;
  end;
  begin
    perform public.save_study_plan(current_setting('rj.plan')::jsonb,
      '[{"due_on": "2026-11-12", "title": "SINOV", "ref": "/uz/sat/?a=<script>"}]');
    raise exception 'FAIL R06: ref ichida <script> qabul qilindi';
  exception when check_violation then null;
  end;
  begin
    perform public.save_study_plan(current_setting('rj.plan')::jsonb, '[]');
    raise exception 'FAIL R06: bo''sh vazifalar qabul qilindi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.save_study_plan(jsonb_set(current_setting('rj.plan')::jsonb, '{weak_skills}', '["a","b","c","d","e","f","g"]'),
      current_setting('rj.tasks')::jsonb);
    raise exception 'FAIL R06: 7 ta zaif skill qabul qilindi';
  exception when check_violation then null;
  end;
  begin
    perform public.save_study_plan(jsonb_set(current_setting('rj.plan')::jsonb, '{hours_per_week}', '30'),
      current_setting('rj.tasks')::jsonb);
    raise exception 'FAIL R06: haftasiga 30 soat qabul qilindi';
  exception when check_violation then null;
  end;
  begin
    perform public.save_study_plan(jsonb_set(current_setting('rj.plan')::jsonb, '{bolim}', '"ielts"'), current_setting('rj.tasks')::jsonb);
    raise exception 'FAIL R06: bolim ielts qabul qilindi';
  exception when invalid_parameter_value then null;
  end;
  if (select count from public.usage_counters where user_id = a and key = 'plan_rebuilds') <> 3 then
    raise exception 'FAIL R06: rad etilgan saqlash kvotani sarfladi';
  end if;
  if (select id from public.study_plans where status = 'active') <> p1 then
    raise exception 'FAIL R06: rad etilgan saqlash faol rejani o''zgartirdi';
  end if;
  raise notice 'OK R06 tashqi/xavfli ref, bo''sh ro''yxat, 7 skill, 30 soat, boshqa bo''lim rad; kvota va faol reja o''zgarmadi';

  -- R08. plan_skill_stats: faqat o'z urinishlari, skill bo'yicha
  if (select jsonb_agg(to_jsonb(x) order by x.section) from public.plan_skill_stats() x)
     <> '[{"section": "math", "skill": "RJ-skill-m", "answered": 2, "correct": 1}, {"section": "rw", "skill": "RJ-skill-r", "answered": 1, "correct": 1}]'::jsonb then
    raise exception 'FAIL R08: plan_skill_stats: %', (select jsonb_agg(to_jsonb(x)) from public.plan_skill_stats() x);
  end if;
  raise notice 'OK R08 plan_skill_stats: section, skill, answered, correct';
end
$$;
reset role;

-- R05. B A rejasini ko'rmaydi va o'zgartirmaydi
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e2", "role": "authenticated"}', true) \gset
do $$
declare
  pa uuid := current_setting('rj.p_a')::uuid;
  n  integer;
begin
  if (select count(*) from public.study_plans) <> 0 or (select count(*) from public.plan_tasks) <> 0 then
    raise exception 'FAIL R05: B A rejasini ko''rdi';
  end if;
  update public.plan_tasks set done_at = now() where plan_id = pa;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FAIL R05: B A vazifasini belgiladi'; end if;
  delete from public.plan_tasks where plan_id = pa;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FAIL R05: B A vazifasini o''chirdi'; end if;
  delete from public.study_plans where id = pa;
  get diagnostics n = row_count;
  if n <> 0 then raise exception 'FAIL R05: B A rejasini o''chirdi'; end if;
  if (select count(*) from public.plan_skill_stats()) <> 0 then raise exception 'FAIL R05: B A statistikasini ko''rdi'; end if;
  -- B o'z rejasini saqlasa A ning faol rejasi o'zgarmaydi
  perform public.save_study_plan(current_setting('rj.plan')::jsonb, current_setting('rj.tasks')::jsonb);
  if (select count(*) from public.study_plans where status = 'active') <> 1 then raise exception 'FAIL R05: B faol rejasi'; end if;
  raise notice 'OK R05 B: A rejasi, vazifalari va statistikasi ko''rinmaydi, o''zgarmaydi, o''chmaydi';
end
$$;
reset role;

do $$
begin
  if (select status from public.study_plans where id = current_setting('rj.p_a')::uuid) <> 'active'
     or (select count(*) from public.plan_tasks where plan_id = current_setting('rj.p_a')::uuid) <> 3 then
    raise exception 'FAIL R05: A rejasi B harakatlaridan keyin o''zgargan';
  end if;
end
$$;

-- R07. Kvota: namuna limit (oyiga 1), faqat shu tranzaksiyada
update public.plans set limits = limits || '{"plan_rebuilds": {"max": 1, "per": "month"}}' where code = 'free' and bolim = 'sat';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e3", "role": "authenticated"}', true) \gset
do $$
declare
  p uuid;
  u jsonb;
begin
  p := public.save_study_plan(current_setting('rj.plan')::jsonb, current_setting('rj.tasks')::jsonb);
  begin
    perform public.save_study_plan(current_setting('rj.plan')::jsonb, current_setting('rj.tasks')::jsonb);
    raise exception 'FAIL R07: limit 1 da 2-saqlash o''tdi';
  exception when sqlstate 'P0001' then
    if sqlerrm <> 'quota_exceeded' then raise; end if;
  end;
  if (select id from public.study_plans where status = 'active') <> p or (select count(*) from public.study_plans) <> 1 then
    raise exception 'FAIL R07: kvota tugaganda joriy reja saqlanmadi';
  end if;
  -- belgilash kvota sarflamaydi
  update public.plan_tasks set done_at = now() where plan_id = p;
  u := public.usage_status();
  if (u -> 'limits' -> 'plan_rebuilds' ->> 'remaining')::integer <> 0 or (u -> 'limits' -> 'plan_rebuilds' ->> 'max')::integer <> 1 then
    raise exception 'FAIL R07: usage_status plan_rebuilds: %', u -> 'limits';
  end if;
  raise notice 'OK R07 kvota: oyiga 1 da 2-saqlash quota_exceeded, joriy reja qoladi, belgilash sarflamaydi, usage_status 0/1';
end
$$;
reset role;

rollback;
