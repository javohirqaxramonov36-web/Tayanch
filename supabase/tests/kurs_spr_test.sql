-- Bir xil vektorlar src/lib/testlar/kursSpr.test.ts da mijoz formatini ham tekshiradi.
begin;

create temp table kurs_spr_fixture (data jsonb);
\copy kurs_spr_fixture from program 'tr -d "\n" < supabase/tests/kurs_spr_vektorlar.json; printf "\n"' with (format csv, delimiter E'\t', quote E'\x01')

do $$
declare
  v jsonb;
  n integer := 0;
begin
  for v in select jsonb_array_elements(data) from kurs_spr_fixture loop
    if private.course_spr_format(v ->> 'input') is distinct from v ->> 'format'
       or private.course_spr_equal(v ->> 'input', v) is distinct from (v ->> 'correct')::boolean then
      raise exception 'FAIL 1c SPR vektor: %', v;
    end if;
    n := n + 1;
  end loop;
  if n = 0 then raise exception 'FAIL 1c: SPR vektorlari o‘qilmadi'; end if;
  if not private.check_answer('spr', '{"accepted":["5"]}', '5.')
     or not private.check_answer('spr', '{"accepted":["123456"]}', '123456')
     or private.check_answer('spr', '{"accepted":["5/13"]}', '0.385')
     or not private.course_spr_equal('0.385', '{"accepted":["5/13","0.385"]}') then
    raise exception 'FAIL 1c: bank/mock baholashi yoki 1a accepted shakllari';
  end if;
  raise notice 'OK 1c: % ta SPR vektori, bank/mock va 1a accepted shakllari', n;
end
$$;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000c1', 'kurs-spr@sinov.invalid', '{}');

insert into public.questions (
  external_id, section, domain, skill, difficulty, format, stem, correct, explanation,
  tags, status, author, verified_by, verified_at
)
select 'kurs-spr-sinov-' || st || '-' || n, 'math', 'Algebra', 'Linear equations in one variable', 1, 'spr',
  'Sample: enter five thirteenths.', '{"accepted":["5/13"],"exact":["5/13"]}', 'Sample explanation.',
  array['sat-kurs:v1:a1:' || st], 'verified', 'sinov', 'sinov-tekshiruvchi', now()
from (values ('foundation', 8), ('mini_test', 1)) as s(st, son)
cross join lateral generate_series(1, son) n;

update public.plans set limits = '{}' where code = 'free';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000c1","role":"authenticated"}', true) \gset
do $$
declare
  p jsonb := public.start_course_session('sat-kurs:v1:a1:foundation');
  sid uuid := (p ->> 'session_id')::uuid;
  qid uuid := (p #>> '{questions,0,id}')::uuid;
begin
  if p #>> '{questions,0,course_question}' is distinct from 'true'
     or p #> '{questions,0,correct}' is not null then
    raise exception 'FAIL 1c: savol formati belgisi yoki maxfiy javob';
  end if;
  begin
    perform public.submit_answer(sid, qid, '5.');
    raise exception 'FAIL 1c: mashq yaroqsiz javobni qabul qildi';
  exception when invalid_parameter_value then null;
  end;
  if public.submit_answer(sid, qid, '0.385') ->> 'is_correct' is distinct from 'true' then
    raise exception 'FAIL 1c: mashq SPR bahosi';
  end if;
end
$$;
reset role;

-- 1b da mini-test 10 ta savoldan tuziladi.
insert into public.questions (
  external_id, section, domain, skill, difficulty, format, stem, correct, explanation,
  tags, status, author, verified_by, verified_at
)
select 'kurs-spr-sinov-mini-' || n, 'math', 'Algebra', 'Linear equations in one variable', 1, 'spr',
  'Sample: enter five thirteenths.', '{"accepted":["5/13","0.385"]}', 'Sample explanation.',
  array['sat-kurs:v1:a1:mini_test'], 'verified', 'sinov', 'sinov-tekshiruvchi', now()
from generate_series(1, 9) n;

set local role authenticated;
do $$
declare
  p jsonb := public.start_course_session('sat-kurs:v1:a1:mini_test');
  sid uuid := (p ->> 'session_id')::uuid;
  qid uuid := (p #>> '{questions,0,id}')::uuid;
  qid2 uuid := (p #>> '{questions,1,id}')::uuid;
  javoblar jsonb := jsonb_build_array(
    jsonb_build_object('question_id', qid, 'answer', '0.385'),
    jsonb_build_object('question_id', qid2, 'answer', '1..2'));
begin
  begin
    perform public.finish_course_mini_test(sid, javoblar);
    raise exception 'FAIL 1c: mini-test yaroqsiz javobni qabul qildi';
  exception when invalid_parameter_value then null;
  end;
  p := public.get_session(sid);
  if p ->> 'finished_at' is not null or p #>> '{questions,0,answered}' is distinct from 'false' then
    raise exception 'FAIL 1c: yaroqsiz mini-test qisman yozildi';
  end if;
  p := public.finish_course_mini_test(sid, jsonb_set(javoblar, '{1,answer}', '"0.38"'));
  if jsonb_array_length(p -> 'results') <> 2
     or (select count(*) from jsonb_array_elements(p -> 'results') r where r ->> 'is_correct' = 'true') <> 1 then
    raise exception 'FAIL 1c: mini-test SPR bahosi';
  end if;
end
$$;
reset role;
update public.review_queue set next_due = private.today_tashkent();
set local role authenticated;
do $$
declare
  p jsonb := public.start_review_session(1);
  sid uuid := (p ->> 'session_id')::uuid;
  qid uuid := (p #>> '{questions,0,id}')::uuid;
begin
  if p #>> '{questions,0,course_question}' is distinct from 'true'
     or public.submit_answer(sid, qid, '0.385') ->> 'is_correct' is distinct from 'true' then
    raise exception 'FAIL 1c: kurs redo SPR bahosi';
  end if;
  raise notice 'OK 1c: kurs mashqi, atomar mini-test va redo';
end
$$;
rollback;
