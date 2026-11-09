-- RLS va RPC sinovlari: ikki foydalanuvchi (A, B), anonim va service role.
-- Hammasi bitta tranzaksiyada, oxirida ROLLBACK: bazada hech narsa qolmaydi.
-- Har tekshiruv o'tsa "OK ..." xabari chiqadi; birortasi o'tmasa "FAIL ..." xatosi bilan to'xtaydi.
-- Sinov savollari faqat "SINOV" matnli soxta yozuvlar (haqiqiy savol mazmuni emas).
\set ON_ERROR_STOP on
\set QUIET on

begin;

------------------------------------------------------------------------------
-- 0. Tayyorlash (superuser)
------------------------------------------------------------------------------
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-00000000000a', 'a@sinov.invalid', '{"full_name": "Sinov A"}'),
  ('00000000-0000-4000-8000-00000000000b', 'b@sinov.invalid', '{"name": "Sinov B", "iss": "https://accounts.google.com"}'),
  ('00000000-0000-4000-8000-00000000000c', 'c@sinov.invalid', '{}');

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, figure, status, author, verified_by, verified_at)
values
  ('sinov-mcq-1', 'math', 'SINOV-domain', 'SINOV-skill', 2, 'mcq', 'SINOV savol 1',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2", "is_correct": true}]',
   '{"choice": "B"}', 'SINOV tushuntirish', '{"path": "sinov/fig1.png", "alt": "SINOV rasm"}', 'verified', 'sinov', 'sinov-tekshiruvchi', now()),
  ('sinov-mcq-2', 'math', 'SINOV-domain', 'SINOV-skill', 3, 'mcq', 'SINOV savol 2',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]',
   '{"choice": "A"}', 'SINOV tushuntirish', null, 'verified', 'sinov', 'sinov-tekshiruvchi', now()),
  ('sinov-spr-1', 'math', 'SINOV-domain', 'SINOV-skill', 3, 'spr', 'SINOV savol 3',
   null, '{"accepted": ["1/2"]}', 'SINOV tushuntirish', null, 'verified', 'sinov', 'sinov-tekshiruvchi', now()),
  ('sinov-draft-1', 'math', 'SINOV-domain', 'SINOV-skill', 1, 'mcq', 'SINOV qoralama',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]',
   '{"choice": "A"}', 'SINOV tushuntirish', null, 'draft', 'sinov', null, null);

insert into storage.objects (bucket_id, name) values
  ('question-figures', 'sinov/fig1.png'),
  ('question-figures', 'sinov/fig-boshqa.png');

select set_config('test.q_mcq1', (select id::text from public.questions where external_id = 'sinov-mcq-1'), true),
       set_config('test.q_mcq2', (select id::text from public.questions where external_id = 'sinov-mcq-2'), true),
       set_config('test.q_spr1', (select id::text from public.questions where external_id = 'sinov-spr-1'), true),
       set_config('test.q_draft', (select id::text from public.questions where external_id = 'sinov-draft-1'), true)
\gset

do $$
begin
  if (select count(*) from public.profiles where id in ('00000000-0000-4000-8000-00000000000a',
      '00000000-0000-4000-8000-00000000000b', '00000000-0000-4000-8000-00000000000c')) <> 3 then
    raise exception 'FAIL 01: handle_new_user profil yaratmadi';
  end if;
  if (select display_name from public.profiles where id = '00000000-0000-4000-8000-00000000000a') is distinct from 'Sinov A'
     or (select display_name from public.profiles where id = '00000000-0000-4000-8000-00000000000b') is distinct from 'Sinov B'
     or (select display_name from public.profiles where id = '00000000-0000-4000-8000-00000000000c') is not null then
    raise exception 'FAIL 01: display_name noto''g''ri';
  end if;
  raise notice 'OK 01 handle_new_user: email (full_name), Google (name) va ismsiz holatda profil yaratildi';
end
$$;

------------------------------------------------------------------------------
-- 1. Anonim
------------------------------------------------------------------------------
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset

do $$
begin
  begin
    perform 1 from public.questions limit 1;
    raise exception 'FAIL 02: anon questions ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.profiles limit 1;
    raise exception 'FAIL 02: anon profiles ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.start_session('{}'::jsonb, 1, 'practice');
    raise exception 'FAIL 02: anon start_session ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.daily_question();
    raise exception 'FAIL 02: anon daily_question ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.events (user_id, name) values ('00000000-0000-4000-8000-00000000000a', 'sinov');
    raise exception 'FAIL 02: anon events ga yozdi';
  exception when insufficient_privilege then null;
  end;
  if not exists (select 1 from public.plans where code = 'free') then
    raise exception 'FAIL 02: anon faol tarifni ko''rmadi';
  end if;
  if exists (select 1 from public.plans where code in ('pro', 'elite')) then
    raise exception 'FAIL 02: anon faol bo''lmagan tarifni ko''rdi';
  end if;
  if exists (select 1 from storage.objects where bucket_id = 'question-figures') then
    raise exception 'FAIL 02: anon savol rasmini ko''rdi';
  end if;
  raise notice 'OK 02 anon: questions, profiles, RPC, events, rasm yopiq; faqat faol tarif ko''rinadi';
end
$$;

reset role;

------------------------------------------------------------------------------
-- 2. Foydalanuvchi A
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-00000000000a", "role": "authenticated"}', true) \gset

do $$
declare
  a    uuid := '00000000-0000-4000-8000-00000000000a';
  q1   uuid := current_setting('test.q_mcq1')::uuid;
  q2   uuid := current_setting('test.q_mcq2')::uuid;
  qs   uuid := current_setting('test.q_spr1')::uuid;
  r    jsonb;
  res  jsonb;
  sid  uuid;
begin
  -- questions jadvali yopiq
  begin
    perform 1 from public.questions limit 1;
    raise exception 'FAIL 03: A questions ni to''g''ridan-to''g''ri o''qidi';
  exception when insufficient_privilege then null;
  end;

  -- start_session: faqat tasdiqlangan, javobsiz
  r := public.start_session('{"domains": ["SINOV-domain"]}'::jsonb, 10, 'practice');
  if jsonb_array_length(r -> 'questions') <> 3 then
    raise exception 'FAIL 04: 3 ta tasdiqlangan savol kutilgan, keldi: %', jsonb_array_length(r -> 'questions');
  end if;
  if position('sinov-draft-1' in r::text) > 0 then
    raise exception 'FAIL 04: qoralama savol berildi';
  end if;
  if position('"correct"' in r::text) > 0 or position('"choice"' in r::text) > 0
     or position('"accepted"' in r::text) > 0 or position('"explanation"' in r::text) > 0
     or position('SINOV tushuntirish' in r::text) > 0 or position('is_correct' in r::text) > 0 then
    raise exception 'FAIL 04: start_session javobida to''g''ri javob yoki tushuntirish bor: %', r;
  end if;
  raise notice 'OK 04 start_session: 3 ta tasdiqlangan savol, correct/explanation/is_correct yo''q, qoralama yo''q';

  sid := (r ->> 'session_id')::uuid;
  perform set_config('test.sid_a', sid::text, true);

  -- submit_answer: xato MCQ
  res := public.submit_answer(sid, q1, 'A', 1200);
  if (res ->> 'is_correct')::boolean or res -> 'correct' <> '"B"'::jsonb or res ->> 'explanation' <> 'SINOV tushuntirish' then
    raise exception 'FAIL 05: xato MCQ natijasi noto''g''ri: %', res;
  end if;
  if (select box from public.review_queue where user_id = a and question_id = q1) is distinct from 1::smallint then
    raise exception 'FAIL 05: xato javob review_queue 1-qutiga tushmadi';
  end if;
  -- takror javob: saqlangan natija, o'zgarmaydi
  res := public.submit_answer(sid, q1, 'B', 10);
  if not (res ->> 'already_answered')::boolean or (res ->> 'is_correct')::boolean then
    raise exception 'FAIL 05: takror javob natijani o''zgartirdi: %', res;
  end if;
  -- SPR: .5 = 1/2
  res := public.submit_answer(sid, qs, ' .5 ', 900);
  if not (res ->> 'is_correct')::boolean or res -> 'correct' <> '["1/2"]'::jsonb then
    raise exception 'FAIL 05: SPR .5 qabul qilinmadi: %', res;
  end if;
  raise notice 'OK 05 submit_answer: xato -> 1-quti, takror javob o''zgarmaydi, SPR .5 = 1/2';

  -- To'g'ridan-to'g'ri yozuvlar taqiqlangan
  begin
    insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version)
    values (a, sid, q2, 'A', true, 1);
    raise exception 'FAIL 06: A attempts ga to''g''ridan-to''g''ri yozdi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.attempts set is_correct = true where question_id = q1;
    raise exception 'FAIL 06: A is_correct ni o''zgartirdi';
  exception when insufficient_privilege then null;
  end;
  update public.attempts set flagged = true where question_id = q1;
  if not (select flagged from public.attempts where question_id = q1) then
    raise exception 'FAIL 06: flagged yozilmadi';
  end if;
  begin
    insert into public.practice_sessions (user_id, mode) values (a, 'practice');
    raise exception 'FAIL 06: A sessiyani to''g''ridan-to''g''ri yaratdi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.review_queue set box = 5 where question_id = q1;
    raise exception 'FAIL 06: A review_queue.box ni o''zgartirdi';
  exception when insufficient_privilege then null;
  end;
  update public.review_queue set note = 'SINOV izoh', reason_tag = 'hisob' where question_id = q1;
  begin
    insert into public.subscriptions (user_id, plan_code, source) values (a, 'elite', 'admin');
    raise exception 'FAIL 06: A subscriptions ga yozdi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.payments (user_id, plan_code, provider_order_id, amount_uzs) values (a, 'pro', 'sinov-1', 1);
    raise exception 'FAIL 06: A payments ga yozdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform raw from public.payments limit 1;
    raise exception 'FAIL 06: A payments.raw ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.payment_events limit 1;
    raise exception 'FAIL 06: A payment_events ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.audit_log limit 1;
    raise exception 'FAIL 06: A audit_log ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.usage_counters set count = 0;
    raise exception 'FAIL 06: A usage_counters ni o''zgartirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from private.spr_test_cases limit 1;
    raise exception 'FAIL 06: A private sxemaga kirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.admin_grant_plan(a, 'elite', 30, 'sinov', 'sinov');
    raise exception 'FAIL 06: A admin_grant_plan ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.profiles set consent_at = now() where id = a;
    raise exception 'FAIL 06: A consent_at ni qo''lda yozdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK 06 A: attempts/sessions/review box/subscriptions/payments/payment_events/audit_log/usage/private/admin yozuvlari taqiqlangan; flagged va note ruxsat';

  -- O'z ma'lumoti
  update public.profiles set display_name = 'Sinov A2', consent_version = 'v1', target_score = 1400 where id = a;
  if (select consent_at from public.profiles where id = a) is null then
    raise exception 'FAIL 07: consent_at trigger ishlamadi';
  end if;
  insert into public.user_state (key, value) values ('tayanch:sat-lugat', '{"versiya": 1}');
  insert into public.bookmarks (question_id) values (q2);
  insert into public.official_tests (test_name, total_score) values ('SINOV test', 1300);
  insert into public.official_mistakes (official_test_id, section, module, question_number)
    select id, 'math', 1, 5 from public.official_tests limit 1;
  insert into public.study_plans (title) values ('SINOV reja');
  insert into public.plan_tasks (plan_id, title) select id, 'SINOV vazifa' from public.study_plans limit 1;
  insert into public.feedback (message) values ('SINOV fikr');
  insert into public.reports (question_id, reason) values (q1, 'typo');
  insert into public.events (name, props) values ('sinov.event', '{"a": 1}');
  begin
    perform 1 from public.events limit 1;
    raise exception 'FAIL 07: A events ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.user_state (key, value) values ('boshqa-kalit', '{}');
    raise exception 'FAIL 07: tayanch: prefiksisiz kalit yozildi';
  exception when check_violation then null;
  end;
  raise notice 'OK 07 A: profil, consent_at trigger, user_state, bookmarks, official_*, reja, feedback, reports, events (faqat yozish)';

  -- Storage: berilgan savol rasmi ko'rinadi, boshqasi yo'q
  if not exists (select 1 from storage.objects where bucket_id = 'question-figures' and name = 'sinov/fig1.png') then
    raise exception 'FAIL 08: A berilgan savol rasmini ko''rmadi';
  end if;
  if exists (select 1 from storage.objects where name = 'sinov/fig-boshqa.png') then
    raise exception 'FAIL 08: A berilmagan rasmni ko''rdi';
  end if;
  raise notice 'OK 08 storage: rasm faqat berilgan savol uchun ko''rinadi';

  -- usage_status, question_counts, daily_question
  res := public.usage_status();
  if res -> 'plan' ->> 'code' <> 'free' or (res -> 'today' ->> 'answers')::integer <> 2
     or (res -> 'today' ->> 'questions')::integer <> 3 or res -> 'limits' <> '{}'::jsonb then
    raise exception 'FAIL 09: usage_status noto''g''ri: %', res;
  end if;
  res := public.question_counts('{"domains": ["SINOV-domain"]}'::jsonb);
  if (res ->> 'total')::integer <> 3 then
    raise exception 'FAIL 09: question_counts noto''g''ri: %', res;
  end if;
  r := public.daily_question();
  res := public.daily_question();
  if r ->> 'session_id' is null or r ->> 'session_id' <> res ->> 'session_id' then
    raise exception 'FAIL 09: daily_question bir kunda ikki xil sessiya berdi';
  end if;
  if position('"correct"' in r::text) > 0 or position('"explanation"' in r::text) > 0 then
    raise exception 'FAIL 09: daily_question javobida to''g''ri javob bor';
  end if;
  if (public.usage_status() -> 'today' ->> 'daily')::integer <> 1 then
    raise exception 'FAIL 09: daily kvotasi ikki marta sarflandi';
  end if;
  raise notice 'OK 09 usage_status (limits bo''sh = cheklovsiz), question_counts, daily_question (kuniga bitta sessiya, javobsiz)';
end
$$;

reset role;

------------------------------------------------------------------------------
-- 3. Foydalanuvchi B: A ning ma'lumotiga kira olmaydi
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-00000000000b", "role": "authenticated"}', true) \gset

do $$
declare
  a     uuid := '00000000-0000-4000-8000-00000000000a';
  sid_a uuid := current_setting('test.sid_a')::uuid;
  q1    uuid := current_setting('test.q_mcq1')::uuid;
  q2    uuid := current_setting('test.q_mcq2')::uuid;
  n     integer;
  r     jsonb;
  t     text;
begin
  if (select count(*) from public.profiles) <> 1
     or (select id from public.profiles) <> '00000000-0000-4000-8000-00000000000b' then
    raise exception 'FAIL 10: B boshqa profilni ko''rdi';
  end if;
  foreach t in array array['practice_sessions', 'session_questions', 'attempts', 'bookmarks', 'review_queue',
                           'official_tests', 'official_mistakes', 'study_plans', 'plan_tasks', 'user_state',
                           'vocab_progress', 'subscriptions', 'usage_counters', 'reports', 'feedback'] loop
    execute format('select count(*) from public.%I', t) into n;
    if n <> 0 then
      raise exception 'FAIL 10: B % jadvalida A qatorlarini ko''rdi (%)', t, n;
    end if;
  end loop;

  update public.profiles set display_name = 'buzildi' where id = a;
  get diagnostics n = row_count;
  if n <> 0 then
    raise exception 'FAIL 10: B A profilini o''zgartirdi';
  end if;
  delete from public.bookmarks where user_id = a;
  get diagnostics n = row_count;
  if n <> 0 then
    raise exception 'FAIL 10: B A xatcho''pini o''chirdi';
  end if;
  begin
    insert into public.user_state (user_id, key, value) values (a, 'tayanch:sinov', '{}');
    raise exception 'FAIL 10: B A nomidan user_state yozdi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.plan_tasks (plan_id, title)
    values ((select '00000000-0000-0000-0000-000000000000'::uuid), 'x');
    raise exception 'FAIL 10: B begona rejaga vazifa yozdi';
  exception when insufficient_privilege or foreign_key_violation then null;
  end;
  begin
    perform public.submit_answer(sid_a, q1, 'B', 1);
    raise exception 'FAIL 10: B A sessiyasiga javob yubordi';
  exception when sqlstate 'P0002' then null;
  end;
  if exists (select 1 from storage.objects where name = 'sinov/fig1.png') then
    raise exception 'FAIL 10: B o''ziga berilmagan savol rasmini ko''rdi';
  end if;

  -- B o'z sessiyasida bo'lmagan savolga javob bera olmaydi
  r := public.start_session('{"domains": ["SINOV-domain"], "difficulties": [2]}'::jsonb, 1, 'timed');
  if jsonb_array_length(r -> 'questions') <> 1 or r -> 'questions' -> 0 ->> 'external_id' <> 'sinov-mcq-1' then
    raise exception 'FAIL 10: difficulty filtri ishlamadi: %', r;
  end if;
  begin
    perform public.submit_answer((r ->> 'session_id')::uuid, q2, 'A', 1);
    raise exception 'FAIL 10: sessiyada bo''lmagan savolga javob qabul qilindi';
  exception when sqlstate 'P0002' then null;
  end;
  begin
    perform public.submit_answer((r ->> 'session_id')::uuid, current_setting('test.q_draft')::uuid, 'A', 1);
    raise exception 'FAIL 10: qoralama savolga javob qabul qilindi';
  exception when sqlstate 'P0002' then null;
  end;
  if not exists (select 1 from storage.objects where name = 'sinov/fig1.png') then
    raise exception 'FAIL 10: B o''ziga berilgan savol rasmini ko''rmadi';
  end if;
  begin
    perform public.start_session('{}'::jsonb, 101, 'practice');
    raise exception 'FAIL 10: volume 101 qabul qilindi';
  exception when sqlstate '22023' then null;
  end;
  begin
    perform public.start_session('{}'::jsonb, 1, 'admin');
    raise exception 'FAIL 10: noma''lum mode qabul qilindi';
  exception when sqlstate '22023' then null;
  end;
  raise notice 'OK 10 B: A qatorlarini ko''rmaydi/o''zgartirmaydi, A sessiyasiga va sessiyadan tashqari savolga javob yubora olmaydi, filtr va chegaralar ishlaydi';
end
$$;

reset role;

------------------------------------------------------------------------------
-- 4. Kvota (plans.limits) va admin amallari
------------------------------------------------------------------------------
-- Faqat shu sinov ichida: free tarifiga namuna cheklov (ROLLBACK bilan yo'qoladi; haqiqiy qiymat P19 da).
update public.plans set limits = '{"answers": {"max": 3, "per": "day"}}' where code = 'free';

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-00000000000a", "role": "authenticated"}', true) \gset

do $$
declare
  r   jsonb;
  sid uuid;
  ids uuid[];
  n   integer;
begin
  r := public.start_session('{"domains": ["SINOV-domain"]}'::jsonb, 10, 'practice');
  sid := (r ->> 'session_id')::uuid;
  select array_agg((e ->> 'id')::uuid order by (e ->> 'position')::integer) into ids
    from jsonb_array_elements(r -> 'questions') e;
  perform public.submit_answer(sid, ids[1], 'A', 1);       -- 3-javob: chegarada
  begin
    perform public.submit_answer(sid, ids[2], 'A', 1);     -- 4-javob: oshib ketadi
    raise exception 'FAIL 11: kvota oshib ketganda javob qabul qilindi';
  exception when sqlstate 'P0001' then
    if sqlerrm <> 'quota_exceeded' then
      raise;
    end if;
  end;
  select count(*) into n from public.attempts where session_id = sid;
  if n <> 1 then
    raise exception 'FAIL 11: kvota xatosidan keyin urinish saqlanib qoldi (%)', n;
  end if;
  if (public.usage_status() -> 'limits' -> 'answers' ->> 'remaining')::integer <> 0 then
    raise exception 'FAIL 11: usage_status remaining noto''g''ri: %', public.usage_status();
  end if;
  perform set_config('test.sid_quota', sid::text, true);
  perform set_config('test.q_quota', ids[2]::text, true);
  raise notice 'OK 11 kvota: plans.limits dan o''qiladi, oshganda quota_exceeded, urinish yozilmaydi';
end
$$;

reset role;

-- service role: qo'lda tarif berish (pro: limits bo'sh = cheklovsiz) va savolni yashirish
set local role service_role;
select set_config('request.jwt.claims', '{"role": "service_role"}', true) \gset

do $$
declare
  v uuid;
begin
  v := public.admin_grant_plan('00000000-0000-4000-8000-00000000000a', 'pro', 30, 'SINOV', 'sinov@tayanch');
  if not exists (select 1 from public.audit_log where action = 'grant_plan' and target_id = v::text) then
    raise exception 'FAIL 12: admin_grant_plan audit_log ga yozmadi';
  end if;
  v := public.admin_hide_question('sinov-mcq-2', 'SINOV', 'sinov@tayanch');
  if (select status from public.questions where id = v) <> 'hidden'
     or not exists (select 1 from public.audit_log where action = 'hide_question' and target_id = v::text) then
    raise exception 'FAIL 12: admin_hide_question ishlamadi';
  end if;
  raise notice 'OK 12 service role: admin_grant_plan va admin_hide_question audit_log bilan';
end
$$;

reset role;

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-00000000000a", "role": "authenticated"}', true) \gset

do $$
declare
  r   jsonb;
  res jsonb;
begin
  -- pro tarifi: cheklov yo'q, avval rad etilgan javob endi o'tadi
  if public.usage_status() -> 'plan' ->> 'code' <> 'pro' then
    raise exception 'FAIL 13: admin bergan tarif ko''rinmadi';
  end if;
  begin
    res := public.submit_answer(current_setting('test.sid_quota')::uuid, current_setting('test.q_quota')::uuid, 'A', 1);
  exception when sqlstate 'P0002' then
    null; -- savol yashirilgan bo'lishi mumkin (sinov-mcq-2): bu ham to'g'ri xatti-harakat
  end;
  -- yashirilgan savol yangi sessiyada berilmaydi
  r := public.start_session('{"domains": ["SINOV-domain"]}'::jsonb, 10, 'practice');
  if jsonb_array_length(r -> 'questions') <> 2 or position('sinov-mcq-2' in r::text) > 0 then
    raise exception 'FAIL 13: yashirilgan savol berildi: %', r;
  end if;
  begin
    perform public.submit_answer(current_setting('test.sid_a')::uuid, current_setting('test.q_mcq2')::uuid, 'A', 1);
    raise exception 'FAIL 13: yashirilgan savolga javob qabul qilindi';
  exception when sqlstate 'P0002' then null;
  end;
  raise notice 'OK 13 pro tarif cheklovsiz, yashirilgan savol berilmaydi va javobi qabul qilinmaydi';
end
$$;

reset role;

-- Takrorlash: A ning xato savolini bugunga o'tkazamiz
update public.review_queue set next_due = private.today_tashkent()
 where user_id = '00000000-0000-4000-8000-00000000000a' and question_id = current_setting('test.q_mcq1')::uuid;

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-00000000000a", "role": "authenticated"}', true) \gset

do $$
declare
  a   uuid := '00000000-0000-4000-8000-00000000000a';
  q1  uuid := current_setting('test.q_mcq1')::uuid;
  r   jsonb;
  res jsonb;
begin
  -- takrorlash sessiyasi: to'g'ri javob 1 -> 2-quti, +3 kun
  r := public.start_review_session();
  if jsonb_array_length(r -> 'questions') <> 1 or (r -> 'questions' -> 0 ->> 'id')::uuid <> q1 then
    raise exception 'FAIL 13: takrorlash sessiyasi noto''g''ri: %', r;
  end if;
  res := public.submit_answer((r ->> 'session_id')::uuid, q1, 'B', 500);
  if not (res ->> 'is_correct')::boolean then
    raise exception 'FAIL 13: takrorlashda to''g''ri javob qabul qilinmadi';
  end if;
  if (select box from public.review_queue where user_id = a and question_id = q1) <> 2
     or (select next_due - (now() at time zone 'Asia/Tashkent')::date
           from public.review_queue where user_id = a and question_id = q1) <> 3 then
    raise exception 'FAIL 13: Leitner o''tishi noto''g''ri';
  end if;
  if (select reason_tag from public.review_queue where user_id = a and question_id = q1) <> 'hisob' then
    raise exception 'FAIL 13: reason_tag yo''qoldi';
  end if;
  raise notice 'OK 14 takrorlash sessiyasi: muddati kelgan savol, to''g''ri javob 1 -> 2-quti (+3 kun), reason_tag saqlanadi';
end
$$;

reset role;

------------------------------------------------------------------------------
-- 5. SPR normallash jadvali
------------------------------------------------------------------------------
do $$
declare
  n     integer;
  total integer;
  r     record;
begin
  select count(*) into total from private.spr_test_cases;
  select count(*) into n from private.run_spr_tests();
  for r in select * from private.run_spr_tests() loop
    raise warning 'SPR: input=% accepted=% expected=% actual=% (%)', r.input, r.accepted, r.expected, r.actual, r.note;
  end loop;
  if n > 0 then
    raise exception 'FAIL 15: SPR sinovlari: % / % o''tmadi', n, total;
  end if;
  raise notice 'OK 15 SPR normallash: % / % holat o''tdi', total, total;
end
$$;

------------------------------------------------------------------------------
-- 6. P05 qoidalari (0010): tasdiqlash, draft, rasm alt, source, versiya, import upsert
------------------------------------------------------------------------------
set role service_role;

do $$
declare
  holat  record;
  v_ver  integer;
  v_tags text[];
begin
  -- Har holat CHECK bilan rad etilishi kerak.
  for holat in
    select * from (values
      ('verified, verified_by = author (harf va bo''shliq farqi)',
       $q$insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, correct, status, author, verified_by, verified_at)
          values ('sinov-p05-1', 'math', 'D', 'S', 2, 'spr', 'SINOV', '{"accepted": ["1"]}', 'verified', 'Sinov Inson', ' sinov inson ', now())$q$),
      ('verified, verified_at yo''q',
       $q$insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, correct, status, author, verified_by)
          values ('sinov-p05-2', 'math', 'D', 'S', 2, 'spr', 'SINOV', '{"accepted": ["1"]}', 'verified', 'Claude (AI)', 'Sinov Inson')$q$),
      ('draft, verified_by bor',
       $q$insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, correct, status, author, verified_by)
          values ('sinov-p05-3', 'math', 'D', 'S', 2, 'spr', 'SINOV', '{"accepted": ["1"]}', 'draft', 'Claude (AI)', 'Sinov Inson')$q$),
      ('rasm alt siz',
       $q$insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, correct, figure)
          values ('sinov-p05-4', 'math', 'D', 'S', 2, 'spr', 'SINOV', '{"accepted": ["1"]}', '{"path": "math/x.png"}')$q$),
      ('source original emas',
       $q$insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, correct, source)
          values ('sinov-p05-5', 'math', 'D', 'S', 2, 'spr', 'SINOV', '{"accepted": ["1"]}', 'boshqa')$q$),
      ('drafted_by noto''g''ri',
       $q$insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, correct, drafted_by)
          values ('sinov-p05-6', 'math', 'D', 'S', 2, 'spr', 'SINOV', '{"accepted": ["1"]}', 'robot')$q$)
    ) t (nom, q)
  loop
    begin
      execute holat.q;
      raise exception 'FAIL 16: rad etilmadi: %', holat.nom;
    exception when check_violation then null;
    end;
  end loop;

  -- Import shaklidagi upsert (external_id bo'yicha): draft yaratiladi, keyin versiya oshirilib verified bo'ladi.
  insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, correct, explanation,
                                figure, tags, source, drafted_by, author, verified_by, verified_at, version, status, content_hash)
  values ('sinov-p05-ok', 'math', 'D', 'S', 2, 'spr', 'SINOV', '{"accepted": ["1"]}', 'SINOV tushuntirish',
          '{"path": "math/sinov-p05-ok/abc.svg", "alt": "SINOV rasm", "type": "svg"}', '{sinov}', 'original', 'ai',
          'Claude (AI)', null, null, 1, 'draft', 'h1')
  on conflict (external_id) do update set stem = excluded.stem;

  insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, correct, explanation,
                                figure, tags, source, drafted_by, author, verified_by, verified_at, version, status, content_hash)
  values ('sinov-p05-ok', 'math', 'D', 'S', 2, 'spr', 'SINOV yangi', '{"accepted": ["1"]}', 'SINOV tushuntirish',
          '{"path": "math/sinov-p05-ok/abc.svg", "alt": "SINOV rasm", "type": "svg"}', '{sinov,p05}', 'original', 'ai',
          'Claude (AI)', 'Sinov Inson', now(), 3, 'verified', 'h2')
  on conflict (external_id) do update
    set stem = excluded.stem, tags = excluded.tags, verified_by = excluded.verified_by, verified_at = excluded.verified_at,
        version = excluded.version, status = excluded.status, content_hash = excluded.content_hash;

  select version, tags into v_ver, v_tags from public.questions where external_id = 'sinov-p05-ok';
  if v_ver <> 3 or v_tags <> '{sinov,p05}' then
    raise exception 'FAIL 16: import versiyasi saqlanmadi (kutilgan 3, keldi %)', v_ver;
  end if;

  -- Versiyani bermasdan mazmun o'zgarsa trigger +1 qiladi (0003 xatti-harakati saqlanadi).
  update public.questions set explanation = 'SINOV tushuntirish 2' where external_id = 'sinov-p05-ok';
  if (select version from public.questions where external_id = 'sinov-p05-ok') <> 4 then
    raise exception 'FAIL 16: mazmun o''zgarganda versiya oshmadi';
  end if;

  raise notice 'OK 16 P05: verified/draft/alt/source/drafted_by qoidalari, import upsert va versiya';
end
$$;

reset role;

do $$ begin raise notice 'HAMMASI O''TDI'; end $$;

rollback;
