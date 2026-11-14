-- 1b: kurs mashqi va mini-test. Faqat vaqtinchalik Postgres uchun sun'iy yozuvlar.
begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000a1', 'kurs-a@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000b1', 'kurs-b@sinov.invalid', '{}');

insert into public.questions (
  external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation,
  tags, status, author, verified_by, verified_at
)
select 'kurs-sinov-' || st || '-' || lpad(n::text, 2, '0'), 'math', 'Algebra',
  'Linear equations in one variable', 1, 'mcq', 'SINOV savol',
  '[{"key":"A","text":"SINOV 1"},{"key":"B","text":"SINOV 2"}]', '{"choice":"A"}', 'SINOV izoh',
  array['sat-kurs:v1:a1:' || st], 'verified', 'sinov', 'sinov-tekshiruvchi', now()
from (values ('mini_test', 10), ('foundation', 8)) as s(st, son)
cross join lateral generate_series(1, son) n;

update public.plans set limits = case code
  when 'free' then '{"sessions":{"max":1},"questions":{"max":10},"answers":{"max":6}}'
  when 'pro' then '{"sessions":{"max":5},"questions":{"max":60},"answers":{"max":50}}'
  when 'max' then '{"sessions":{"max":10},"questions":{"max":19},"answers":{"max":80}}'
end::jsonb where code in ('free', 'pro', 'max');

set local role anon;
do $$
begin
  begin
    perform public.start_course_session('sat-kurs:v1:a1:mini_test');
    raise exception 'FAIL C01: anon start_course_session';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.finish_course_mini_test(gen_random_uuid(), '[]');
    raise exception 'FAIL C01: anon finish_course_mini_test';
  exception when insufficient_privilege then null;
  end;
end
$$;
reset role;

do $$
begin
  if private.daily_pick(private.today_tashkent()) is not null
     or exists (select 1 from private.mock_readiness() where verified > 0) then
    raise exception 'FAIL C01: kurs savollari kun savoli yoki mock uchun ochiq';
  end if;
end
$$;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}', true) \gset
do $$
declare
  p jsonb;
  javoblar jsonb;
  sid uuid;
  qid uuid;
begin
  if public.start_session('{}', 10, 'practice') ->> 'session_id' is not null then
    raise exception 'FAIL C01: kurs savollari bankka chiqdi';
  end if;
  begin
    perform public.start_course_session('sat-kurs:v1:mx3:mini_test');
    raise exception 'FAIL C02: MX3 mini-test';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.start_course_session('sat-kurs:v1:a5:mini_test');
    raise exception 'FAIL C02: bo''sh to''plam';
  exception when no_data_found then null;
  end;

  p := public.start_course_session('sat-kurs:v1:a1:mini_test');
  sid := (p ->> 'session_id')::uuid;
  qid := (p -> 'questions' -> 0 ->> 'id')::uuid;
  perform set_config('kurs.sid', sid::text, true);
  if p ->> 'mode' <> 'mini_test' or p ->> 'time_limit_ms' is not null or jsonb_array_length(p -> 'questions') <> 10
     or p::text ~ '"(correct|explanation)"' or p -> 'results' <> '[]'::jsonb then
    raise exception 'FAIL C02: start payload';
  end if;

  begin
    perform public.start_course_session('sat-kurs:v1:a1:mini_test');
    raise exception 'FAIL C02: Free sessiya kvotasi ishlamadi';
  exception when raise_exception then
    if sqlerrm <> 'quota_exceeded' then raise; end if;
  end;
  begin
    perform public.submit_answer(sid, qid, 'A');
    raise exception 'FAIL C02: mini-test bitta javobni qabul qildi';
  exception when sqlstate '55000' then null;
  end;
  begin
    perform public.finish_session(sid);
    raise exception 'FAIL C02: mini-test eski RPC orqali yakunlandi';
  exception when sqlstate '55000' then null;
  end;
  begin
    perform public.add_to_review(qid);
    raise exception 'FAIL C02: ochiq mini-testdan redo orqali javob ochiladi';
  exception when no_data_found then null;
  end;

  select jsonb_agg(jsonb_build_object('question_id', item ->> 'id', 'answer', case when pos <= 6 then 'A' else 'B' end))
    into javoblar from jsonb_array_elements(p -> 'questions') with ordinality as a(item, pos) where pos <= 7;
  begin
    perform public.finish_course_mini_test(sid, javoblar);
    raise exception 'FAIL C03: Free javob kvotasi ishlamadi';
  exception when raise_exception then
    if sqlerrm <> 'quota_exceeded' then raise; end if;
  end;
  begin
    perform public.finish_course_mini_test(sid, jsonb_build_array(javoblar -> 0, javoblar -> 0));
    raise exception 'FAIL C03: takror savol qabul qilindi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.finish_course_mini_test(sid, jsonb_build_array(javoblar -> 0,
      jsonb_build_object('question_id', gen_random_uuid(), 'answer', 'A')));
    raise exception 'FAIL C03: to''plamga tegishli bo''lmagan savol qabul qilindi';
  exception when no_data_found then null;
  end;
  if exists (select 1 from public.attempts where session_id = sid)
     or exists (select 1 from public.review_queue)
     or public.get_session(sid) ->> 'finished_at' is not null then
    raise exception 'FAIL C03: rad etilgan yakun qisman yozildi';
  end if;
  p := public.finish_course_mini_test(sid, javoblar - 6);
  if (p ->> 'passed')::boolean is distinct from false or (p ->> 'topic_passed')::boolean is distinct from false
     or p ->> 'elapsed_ms' is null or jsonb_array_length(p -> 'skipped_solutions') <> 4
     or jsonb_array_length(p -> 'results') <> 6 then
    raise exception 'FAIL C03: 6/10, sarflangan vaqt yoki o''tkazilgan javoblar';
  end if;
  if p - 'server_now' <> public.finish_course_mini_test(sid, javoblar) - 'server_now'
     or (public.usage_status() -> 'today' ->> 'answers')::integer is distinct from 6 then
    raise exception 'FAIL C03: takror yuborish natijani yoki kvotani o''zgartirdi';
  end if;
  raise notice 'OK C01–C03: ruxsatlar, yashirin javoblar, Free kvotasi va 6/10';
end
$$;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b1","role":"authenticated"}', true) \gset
do $$
declare sid uuid := current_setting('kurs.sid')::uuid;
begin
  begin
    perform public.get_session(sid);
    raise exception 'FAIL C04: boshqa foydalanuvchi sessiyani ochdi';
  exception when no_data_found then null;
  end;
  begin
    perform public.finish_course_mini_test(sid, '[]');
    raise exception 'FAIL C04: boshqa foydalanuvchi sessiyani yakunladi';
  exception when no_data_found then null;
  end;
end
$$;
reset role;

select public.admin_grant_plan('00000000-0000-4000-8000-0000000000a1', 'pro', 30, 'SINOV', 'sinov') \gset
select public.admin_grant_plan('00000000-0000-4000-8000-0000000000b1', 'max', 30, 'SINOV', 'sinov') \gset

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated"}', true) \gset
do $$
declare
  p jsonb := public.start_course_session('sat-kurs:v1:a1:mini_test');
  sid uuid := (p ->> 'session_id')::uuid;
  javoblar jsonb;
  qid uuid;
  u jsonb;
begin
  select jsonb_agg(jsonb_build_object('question_id', item ->> 'id',
    'answer', case when pos <= 7 then 'A' else 'B' end, 'time_ms', 1200))
    into javoblar from jsonb_array_elements(p -> 'questions') with ordinality as a(item, pos);
  p := public.finish_course_mini_test(sid, javoblar);
  if not (public.course_links() -> 'passed' ? 'A1')
     or (public.course_links(array(select question_id from public.review_queue)) -> 'questions')
       is distinct from (select jsonb_object_agg(question_id, 'A1') from public.review_queue) then
    raise exception 'FAIL C05: kurs tavsiya va redo mavzusi';
  end if;
  if (p ->> 'passed')::boolean is distinct from true or (p ->> 'topic_passed')::boolean is distinct from true
     or (select count(*) from public.review_queue) <> 3
     or (public.analytics_summary() #>> '{totals,attempts}')::integer is distinct from 16 then
    raise exception 'FAIL C05: 7/10, redo yoki analytics';
  end if;
  if p - 'server_now' <> public.finish_course_mini_test(sid, '[]') - 'server_now'
     or (select count(*) from public.review_queue) <> 3 then
    raise exception 'FAIL C05: takror yakunda redo yoki natija o''zgardi';
  end if;

  p := public.start_course_session('sat-kurs:v1:a1:mini_test');
  p := public.finish_course_mini_test((p ->> 'session_id')::uuid, '[]');
  if (p ->> 'passed')::boolean is distinct from false or (p ->> 'topic_passed')::boolean is distinct from true then
    raise exception 'FAIL C05: oldingi Passed yo''qoldi';
  end if;

  p := public.start_course_session('sat-kurs:v1:a1:foundation');
  sid := (p ->> 'session_id')::uuid;
  qid := (p -> 'questions' -> 0 ->> 'id')::uuid;
  if p ->> 'mode' <> 'course_practice' or public.submit_answer(sid, qid, 'A') ->> 'correct' <> 'A'
     or public.finish_session(sid) ->> 'finished_at' is null then
    raise exception 'FAIL C06: kurs mashqi';
  end if;
  u := public.usage_status();
  if u #>> '{plan,code}' is distinct from 'pro' or (u #>> '{today,sessions}')::integer is distinct from 4
     or (u #>> '{today,questions}')::integer is distinct from 38
     or (u #>> '{today,answers}')::integer is distinct from 17 then
    raise exception 'FAIL C06: Pro kvotasi: %', u;
  end if;
  raise notice 'OK C04–C06: sessiya egasi, 7/10, saqlangan Passed, redo, analytics va Pro kvotasi';
end
$$;

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000b1","role":"authenticated"}', true) \gset
do $$
declare
  p jsonb := public.start_course_session('sat-kurs:v1:a1:mini_test');
  u jsonb := public.usage_status();
begin
  perform set_config('kurs.yashirin', p ->> 'session_id', true);
  begin
    perform public.start_course_session('sat-kurs:v1:a1:mini_test');
    raise exception 'FAIL C07: Max savol kvotasi ishlamadi';
  exception when raise_exception then
    if sqlerrm <> 'quota_exceeded' then raise; end if;
  end;
  if u #>> '{plan,code}' is distinct from 'max'
     or u #>> '{limits,questions,remaining}' is distinct from '9'
     or public.usage_status() #>> '{today,sessions}' is distinct from '1' then
    raise exception 'FAIL C07: Max kvotasi';
  end if;
end
$$;
reset role;

update public.questions set status = 'hidden' where external_id = 'kurs-sinov-mini_test-01';

set local role authenticated;
do $$
declare sid uuid := current_setting('kurs.yashirin')::uuid;
begin
  begin
    perform public.get_session(sid);
    raise exception 'FAIL C07: yashirilgan savol ochildi';
  exception when no_data_found then null;
  end;
  begin
    perform public.finish_course_mini_test(sid, '[]');
    raise exception 'FAIL C07: yashirilgan savolli to''plam yakunlandi';
  exception when no_data_found then null;
  end;
  begin
    perform public.start_course_session('sat-kurs:v1:a1:mini_test');
    raise exception 'FAIL C07: yashirilgan savolli to''plam ochildi';
  exception when no_data_found then null;
  end;
  raise notice 'OK C07: Max tarifi va yashirilgan savol';
end
$$;
rollback;
