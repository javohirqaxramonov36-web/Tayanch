-- P32 2-PR musobaqa sinovlari (20261116124750_musobaqa): vaqt oynasi, natija yashirinligi, kvota/XP/review yo'qligi,
-- savollar bankdan chiqarilishi, natija jadvali (opt-in, 18+), RLS. reyting_test.sql kabi: bitta tranzaksiya, ROLLBACK.
-- Tranzaksiya ichida now() o'zgarmaydi: "vaqt o'tdi" holatlari musobaqa/urinish vaqtlarini postgres sifatida surib qilinadi.
\set ON_ERROR_STOP on
\set QUIET on

begin;

-- A, B: kattalar, reytingda; C: 18 yoshgacha; D: katta, reytingda emas; E: katta, qatnashmaydi
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000004a1', 'ma@sinov.invalid', '{"age_group": "adult"}'),
  ('00000000-0000-4000-8000-0000000004b1', 'mb@sinov.invalid', '{"age_group": "adult"}'),
  ('00000000-0000-4000-8000-0000000004c1', 'mc@sinov.invalid', '{"age_group": "minor", "guardian_name": "SINOV"}'),
  ('00000000-0000-4000-8000-0000000004d1', 'md@sinov.invalid', '{"age_group": "adult"}'),
  ('00000000-0000-4000-8000-0000000004e1', 'me@sinov.invalid', '{"age_group": "adult"}');

insert into public.profiles (id)
select u.id from auth.users u where u.email like 'm_@sinov.invalid'
on conflict (id) do nothing;

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, figure, status, author, verified_by)
select 'mt-' || g, 'math', 'MT-domain', 'MT-skill', 2, 'mcq', 'SINOV musobaqa ' || g,
       '[{"key": "A", "text": "SINOV a"}, {"key": "B", "text": "SINOV b"}]', '{"choice": "B"}', 'SINOV izoh', null,
       'draft', 'sinov', null
  from generate_series(1, 6) g;

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'questions' and column_name = 'verified_at') then
    execute 'update public.questions set status = ''verified'', verified_by = ''sinov2'', verified_at = now() where external_id in (''mt-1'', ''mt-2'', ''mt-3'', ''mt-4'', ''mt-6'')';
  else
    update public.questions set status = 'verified', verified_by = 'sinov2' where external_id in ('mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-6');
  end if;
end
$$;

select
  set_config('mt.q1', (select id::text from public.questions where external_id = 'mt-1'), true),
  set_config('mt.q2', (select id::text from public.questions where external_id = 'mt-2'), true),
  set_config('mt.q3', (select id::text from public.questions where external_id = 'mt-3'), true),
  set_config('mt.q4', (select id::text from public.questions where external_id = 'mt-4'), true),
  set_config('mt.q5', (select id::text from public.questions where external_id = 'mt-5'), true),
  set_config('mt.q6', (select id::text from public.questions where external_id = 'mt-6'), true)
\gset

-- mt-6: kurs savoli (sat-kurs: tegi) musobaqaga olinmaydi
update public.questions set tags = array['sat-kurs:sinov'] where external_id = 'mt-6';

------------------------------------------------------------------------------
-- Muallif: yaratish va tekshiruvlar (postgres)
------------------------------------------------------------------------------
do $$
declare
  q1 uuid := current_setting('mt.q1')::uuid;
  q2 uuid := current_setting('mt.q2')::uuid;
  q3 uuid := current_setting('mt.q3')::uuid;
  q4 uuid := current_setting('mt.q4')::uuid;
  q5 uuid := current_setting('mt.q5')::uuid;
begin
  begin
    perform private.contest_create('mt-otgan', 'SINOV past', now() - interval '1 hour', now() + interval '1 hour', 30, array[q1]);
    raise exception 'FAIL M01: o''tgan vaqtdan boshlanadigan musobaqa yaratildi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform private.contest_create('mt-draft', 'SINOV draft', now() + interval '1 hour', now() + interval '2 hours', 30, array[q1, q5]);
    raise exception 'FAIL M01: tasdiqlanmagan savol musobaqaga qo''shildi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform private.contest_create('mt-takror', 'SINOV dup', now() + interval '1 hour', now() + interval '2 hours', 30, array[q1, q1]);
    raise exception 'FAIL M01: takroriy savol qabul qilindi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform private.contest_create('mt-kurs', 'SINOV course', now() + interval '1 hour', now() + interval '2 hours', 30,
                                   array[current_setting('mt.q6')::uuid]);
    raise exception 'FAIL M01: kurs savoli musobaqaga qo''shildi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform private.contest_create('MT Yomon', 'SINOV slug', now() + interval '1 hour', now() + interval '2 hours', 30, array[q1]);
    raise exception 'FAIL M01: noto''g''ri slug qabul qilindi';
  exception when check_violation then null;
  end;

  -- Asosiy musobaqa (q1–q3, 30 daqiqa) va keyingisi (q4)
  perform private.contest_create('mt-asosiy', 'SINOV Contest', now() + interval '1 hour', now() + interval '3 hours', 30, array[q1, q2, q3]);
  perform private.contest_create('mt-keyin', 'SINOV Later', now() + interval '1 day', now() + interval '2 days', 20, array[q4]);
  insert into public.contests (slug, title, starts_at, ends_at, duration_min, published)
  values ('mt-yashirin', 'SINOV hidden', now() + interval '1 day', now() + interval '2 days', 10, false);

  -- Boshlanmagan musobaqada savolni almashtirish mumkin
  update public.contest_questions set position = 9 where question_id = q4;
  update public.contest_questions set position = 1 where question_id = q4;
  raise notice 'OK M01 yaratish: o''tgan vaqt, tasdiqlanmagan savol, kurs savoli, takror savol va noto''g''ri slug rad etiladi';

  -- Savollar bank va kun savolidan chiqariladi (musobaqa tugaguncha)
  if exists (select 1 from private.filtered_questions(null, '{}') q where q.id in (q1, q2, q3, q4)) then
    raise exception 'FAIL M02: musobaqa savoli filtered_questions da';
  end if;
  if private.daily_pick(private.today_tashkent()) in (q1, q2, q3, q4) then
    raise exception 'FAIL M02: musobaqa savoli kun savoli bo''ldi';
  end if;
  raise notice 'OK M02 himoya: musobaqa savollari Savol banki va kun savolida yo''q';
end
$$;

------------------------------------------------------------------------------
-- Mehmon (anon)
------------------------------------------------------------------------------
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
declare
  r jsonb;
begin
  r := public.contest_list();
  if (select count(*) from jsonb_array_elements(r -> 'contests') x where x ->> 'slug' like 'mt-%') <> 2 then
    raise exception 'FAIL M03: anon ro''yxatida 2 ta e''lon qilingan musobaqa kutilgan: %', r;
  end if;
  if r::text like '%SINOV hidden%' or r::text like '%' || current_setting('mt.q1') || '%' then
    raise exception 'FAIL M03: ro''yxatda yashirin musobaqa yoki savol ID bor';
  end if;
  begin
    perform public.contest_start('mt-asosiy');
    raise exception 'FAIL M03: anon contest_start ni chaqira oldi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.contest_questions;
    raise exception 'FAIL M03: anon contest_questions ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK M03 anon: faqat ro''yxat (savolsiz), boshlash va savollar ro''yxati yopiq';
end
$$;
reset role;

------------------------------------------------------------------------------
-- Boshlanmagan musobaqa
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004a1", "role": "authenticated"}', true) \gset
do $$
begin
  begin
    perform public.contest_start('mt-asosiy');
    raise exception 'FAIL M04: boshlanmagan musobaqa boshlandi';
  exception when object_not_in_prerequisite_state then
    if sqlerrm <> 'contest_not_started' then raise; end if;
  end;
  begin
    perform 1 from public.contest_questions;
    raise exception 'FAIL M04: authenticated contest_questions ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from private.contest_answers;
    raise exception 'FAIL M04: authenticated private.contest_answers ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  if exists (select 1 from public.contests where slug = 'mt-yashirin') then
    raise exception 'FAIL M04: e''lon qilinmagan musobaqa ko''rindi';
  end if;
  begin
    perform public.contest_state('mt-yashirin');
    raise exception 'FAIL M04: e''lon qilinmagan musobaqa holati qaytdi';
  exception when no_data_found then null;
  end;
  raise notice 'OK M04 oyna: boshlanmagan musobaqa rad etiladi; savollar ro''yxati, javoblar, yashirin musobaqa yopiq';
end
$$;
reset role;

-- Laqablar (A, B, C reytingga qo'shiladi; C qila olmaydi). Postgres sifatida, leaderboard_join qoidasini chetlab
-- o'tmasdan: har biri o'z nomidan.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004a1", "role": "authenticated"}', true) \gset
select public.leaderboard_join('Mt_Alpha', null, false) \gset
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004b1", "role": "authenticated"}', true) \gset
select public.leaderboard_join('Mt_Bravo', 'UZ', true) \gset
reset role;
-- D: laqab bor, lekin reytingga qo'shilmagan
update public.profiles set nickname = 'Mt_Delta' where id = '00000000-0000-4000-8000-0000000004d1';

-- Musobaqa ochiladi: boshlanish 10 daqiqa oldin (oyna 3 soat)
update public.contests set starts_at = now() - interval '10 minutes' where slug = 'mt-asosiy';

------------------------------------------------------------------------------
-- A: boshlash, javoblar yashirin, kvota/XP/review yo'q
------------------------------------------------------------------------------
select
  set_config('mt.usage_a', (select coalesce(sum(count), 0)::text from public.usage_counters
                             where user_id = '00000000-0000-4000-8000-0000000004a1'), true)
\gset

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004a1", "role": "authenticated"}', true) \gset
do $$
declare
  s   jsonb;
  s2  jsonb;
  sid uuid;
  r   jsonb;
  q1 uuid := current_setting('mt.q1')::uuid;
  q2 uuid := current_setting('mt.q2')::uuid;
  q3 uuid := current_setting('mt.q3')::uuid;
begin
  s := public.contest_start('mt-asosiy');
  sid := (s -> 'entry' ->> 'session_id')::uuid;
  if sid is null or (select mode from public.practice_sessions where id = sid) <> 'contest' then
    raise exception 'FAIL M05: contest sessiyasi ochilmadi: %', s;
  end if;
  if jsonb_array_length(s -> 'questions') <> 3 or (s -> 'questions' -> 0 ->> 'id')::uuid <> q1 then
    raise exception 'FAIL M05: savollar tartibi noto''g''ri: %', s -> 'questions';
  end if;
  if s::text like '%"correct"%' or s::text like '%SINOV izoh%' then
    raise exception 'FAIL M05: holatda to''g''ri javob yoki tushuntirish bor';
  end if;
  s2 := public.contest_start('mt-asosiy');
  if (s2 -> 'entry' ->> 'session_id')::uuid <> sid
     or (select count(*) from public.contest_entries) <> 1 then
    raise exception 'FAIL M05: takror boshlash yangi urinish ochdi';
  end if;
  raise notice 'OK M05 boshlash: contest sessiyasi, savollar javobsiz tartibda, takror boshlash o''sha urinish';

  r := public.submit_answer(sid, q1, 'B', 20000);   -- to'g'ri
  if not (r ->> 'accepted')::boolean or not (r ->> 'hidden')::boolean
     or r -> 'is_correct' <> 'null'::jsonb or r -> 'correct' <> 'null'::jsonb or r -> 'explanation' <> 'null'::jsonb then
    raise exception 'FAIL M06: javobda natija ko''rindi: %', r;
  end if;
  r := public.submit_answer(sid, q2, 'A', 20000);   -- xato
  if exists (select 1 from public.attempts where session_id = sid) then
    raise exception 'FAIL M06: contest javobi attempts ga yozildi';
  end if;
  if exists (select 1 from public.xp_events) then
    raise exception 'FAIL M06: contest javobi XP berdi';
  end if;
  if exists (select 1 from public.review_queue where question_id = q2) then
    raise exception 'FAIL M06: xato contest javobi review_queue ga tushdi';
  end if;
  r := public.get_session(sid);
  if jsonb_array_length(r -> 'results') <> 0 then
    raise exception 'FAIL M06: get_session natijani ko''rsatdi: %', r -> 'results';
  end if;
  r := public.submit_answer(sid, q1, 'A', 20000);   -- takror: o'zgarmaydi
  if not (r ->> 'already_answered')::boolean then
    raise exception 'FAIL M06: takror javob qabul qilindi';
  end if;
  begin
    perform public.add_to_review(q2);
    raise exception 'FAIL M06: musobaqa savoli takrorlash ro''yxatiga qo''shildi';
  exception when object_not_in_prerequisite_state then null;
  end;
  s := public.contest_state('mt-asosiy');
  if (s -> 'answers' ->> q2::text) <> 'A' or (s -> 'entry' ->> 'answered')::int <> 2 then
    raise exception 'FAIL M06: saqlangan javoblar holatda yo''q: %', s -> 'answers';
  end if;
  begin
    perform public.contest_results('mt-asosiy');
    raise exception 'FAIL M06: tugamagan musobaqa natijasi ochildi';
  exception when object_not_in_prerequisite_state then null;
  end;
  begin
    perform public.contest_review('mt-asosiy');
    raise exception 'FAIL M06: tugamagan musobaqa sharhi ochildi';
  exception when object_not_in_prerequisite_state then null;
  end;
  raise notice 'OK M06 javob: natija yashirin (javob, get_session, holat), attempts/XP/review_queue yo''q, natija va sharh tugaguncha yopiq';

  r := public.submit_answer(sid, q3, 'B', 20000);   -- oxirgi savol: urinish yakunlanadi
  s := public.contest_state('mt-asosiy');
  if not (s -> 'entry' ->> 'finished')::boolean or s -> 'questions' <> 'null'::jsonb then
    raise exception 'FAIL M07: hamma savoldan keyin urinish yakunlanmadi: %', s -> 'entry';
  end if;
  raise notice 'OK M07 yakun: hamma savolga javobdan keyin urinish yopiladi, savollar qaytmaydi';
end
$$;
reset role;

do $$
begin
  if (select coalesce(sum(count), 0) from public.usage_counters where user_id = '00000000-0000-4000-8000-0000000004a1')
     <> current_setting('mt.usage_a')::numeric then
    raise exception 'FAIL M08: musobaqa kvota sarfladi';
  end if;
  raise notice 'OK M08 kvota: contest_start va submit_answer kvota sarflamaydi';
end
$$;

------------------------------------------------------------------------------
-- B: shaxsiy muddat, Finish; C va D ham qatnashadi
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004b1", "role": "authenticated"}', true) \gset
select set_config('mt.b_sid', (public.contest_start('mt-asosiy') -> 'entry' ->> 'session_id'), true) \gset
do $$
declare
  sid uuid := current_setting('mt.b_sid')::uuid;
begin
  perform public.submit_answer(sid, current_setting('mt.q1')::uuid, 'B', 9000);
  perform public.submit_answer(sid, current_setting('mt.q2')::uuid, 'A', 9000);
  if (select count(*) from public.contest_entries) <> 1 then
    raise exception 'FAIL M09: B boshqa qatnashchining urinishini ko''rdi';
  end if;
end
$$;
reset role;

-- B ning muddati o'tdi (31 daqiqa oldin boshlagan, davomiylik 30)
update public.contest_entries set started_at = now() - interval '31 minutes'
 where session_id = current_setting('mt.b_sid')::uuid;
update private.contest_answers set answered_at = now() - interval '25 minutes'
 where session_id = current_setting('mt.b_sid')::uuid;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004b1", "role": "authenticated"}', true) \gset
do $$
begin
  begin
    perform public.submit_answer(current_setting('mt.b_sid')::uuid, current_setting('mt.q3')::uuid, 'B', 9000);
    raise exception 'FAIL M09: muddat o''tgandan keyin javob qabul qilindi';
  exception when object_not_in_prerequisite_state then
    if sqlerrm <> 'contest_closed' then raise; end if;
  end;
  if not (public.contest_state('mt-asosiy') -> 'entry' ->> 'finished')::boolean then
    raise exception 'FAIL M09: muddati o''tgan urinish yakunlangan deb ko''rinmadi';
  end if;
  raise notice 'OK M09 muddat: shaxsiy muddatdan keyin contest_closed, boshqaning urinishi ko''rinmaydi';
end
$$;

-- C (18 yoshgacha) qatnashadi va Finish bosadi
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004c1", "role": "authenticated"}', true) \gset
select set_config('mt.c_sid', (public.contest_start('mt-asosiy') -> 'entry' ->> 'session_id'), true) \gset
do $$
declare
  s jsonb;
begin
  perform public.submit_answer(current_setting('mt.c_sid')::uuid, current_setting('mt.q1')::uuid, 'B', 9000);
  perform public.submit_answer(current_setting('mt.c_sid')::uuid, current_setting('mt.q2')::uuid, 'B', 9000);
  perform public.submit_answer(current_setting('mt.c_sid')::uuid, current_setting('mt.q3')::uuid, 'B', 9000);
  s := public.contest_finish('mt-asosiy');
  if not (s -> 'entry' ->> 'finished')::boolean then raise exception 'FAIL M10: Finish ishlamadi'; end if;
end
$$;

-- D (katta, reytingda emas) bitta to'g'ri javob, keyin Finish
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004d1", "role": "authenticated"}', true) \gset
select set_config('mt.d_sid', (public.contest_start('mt-asosiy') -> 'entry' ->> 'session_id'), true) \gset
do $$
begin
  perform public.submit_answer(current_setting('mt.d_sid')::uuid, current_setting('mt.q1')::uuid, 'B', 9000);
  perform public.contest_finish('mt-asosiy');
  begin
    perform public.submit_answer(current_setting('mt.d_sid')::uuid, current_setting('mt.q2')::uuid, 'B', 9000);
    raise exception 'FAIL M10: Finish dan keyin javob qabul qilindi';
  exception when object_not_in_prerequisite_state then
    if sqlerrm <> 'session_finished' then raise; end if;
  end;
  raise notice 'OK M10 Finish: urinish yopiladi, keyingi javob session_finished';
end
$$;
reset role;

-- Muallif himoyasi: boshlangan musobaqada savollar va boshlanish o'zgarmaydi
do $$
begin
  begin
    delete from public.contest_questions where question_id = current_setting('mt.q3')::uuid;
    raise exception 'FAIL M11: boshlangan musobaqadan savol o''chirildi';
  exception when object_not_in_prerequisite_state then null;
  end;
  begin
    update public.contests set starts_at = now() where slug = 'mt-asosiy';
    raise exception 'FAIL M11: boshlangan musobaqa vaqti o''zgardi';
  exception when object_not_in_prerequisite_state then null;
  end;
  begin
    insert into public.contest_questions (contest_id, question_id, position)
    select id, current_setting('mt.q4')::uuid, 7 from public.contests where slug = 'mt-asosiy';
    raise exception 'FAIL M11: boshlangan musobaqaga savol qo''shildi';
  exception when object_not_in_prerequisite_state then null;
  end;
  raise notice 'OK M11 muallif: boshlangan musobaqada savollar, boshlanish vaqti va davomiylik qulflangan';
end
$$;

-- A ning javob vaqtlari: 12 daqiqa (A: 2 ball, B: 1 ball 6 daqiqa, C: 3 ball lekin 18 yoshgacha, D: 1 ball reytingda emas)
update private.contest_answers a set answered_at = e.started_at + interval '12 minutes'
  from public.contest_entries e
 where e.session_id = a.session_id and e.user_id = '00000000-0000-4000-8000-0000000004a1';
update private.contest_answers a set answered_at = e.started_at + interval '6 minutes'
  from public.contest_entries e
 where e.session_id = a.session_id and e.user_id = '00000000-0000-4000-8000-0000000004b1';

-- Musobaqa tugaydi
update public.contests set ends_at = now() - interval '1 second' where slug = 'mt-asosiy';

------------------------------------------------------------------------------
-- Natija jadvali va sharh
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004a1", "role": "authenticated"}', true) \gset
do $$
declare
  r jsonb;
  v jsonb;
begin
  r := public.contest_results('mt-asosiy');
  if jsonb_array_length(r -> 'rows') <> 2 then
    raise exception 'FAIL M12: jadvalda faqat A va B (reytingdagi kattalar) kutilgan: %', r -> 'rows';
  end if;
  if r -> 'rows' -> 0 ->> 'nickname' <> 'Mt_Alpha' or (r -> 'rows' -> 0 ->> 'score')::int <> 2
     or (r -> 'rows' -> 0 ->> 'time_ms')::bigint <> 720000 or (r -> 'rows' -> 0 ->> 'rank')::int <> 1
     or r -> 'rows' -> 1 ->> 'nickname' <> 'Mt_Bravo' or (r -> 'rows' -> 1 ->> 'rank')::int <> 2
     or r -> 'rows' -> 1 ->> 'country' <> 'UZ' then
    raise exception 'FAIL M12: tartib (ball, keyin vaqt) noto''g''ri: %', r -> 'rows';
  end if;
  if r::text like '%Mt_Delta%' or r::text like '%0000000004%' or r::text like '%sinov.invalid%' then
    raise exception 'FAIL M12: jadvalda reytingda bo''lmagan laqab, user_id yoki email bor';
  end if;
  if (r -> 'me' ->> 'rank')::int <> 1 or (r -> 'me' ->> 'score')::int <> 2 or not (r -> 'rows' -> 0 ->> 'me')::boolean then
    raise exception 'FAIL M12: o''z natijasi noto''g''ri: %', r -> 'me';
  end if;
  raise notice 'OK M12 jadval: faqat reytingdagi kattalar, ball kamayish + vaqt o''sish, user_id/email yo''q';

  v := public.contest_review('mt-asosiy');
  if jsonb_array_length(v -> 'items') <> 3
     or not (v -> 'items' -> 0 ->> 'is_correct')::boolean or (v -> 'items' -> 1 ->> 'is_correct')::boolean
     or v -> 'items' -> 1 ->> 'correct' <> 'B' or v -> 'items' -> 1 ->> 'explanation' <> 'SINOV izoh' then
    raise exception 'FAIL M13: sharh noto''g''ri: %', v;
  end if;
  raise notice 'OK M13 sharh: tugagach o''z javoblari, to''g''ri javob va tushuntirish';
end
$$;

-- B: teng ball holati uchun B ga yana bitta to'g'ri javob (vaqt A bilan bir xil) → bir xil o'rin
reset role;
update private.contest_answers set is_correct = true, answered_at = (select started_at from public.contest_entries where session_id = current_setting('mt.b_sid')::uuid) + interval '12 minutes'
 where session_id = current_setting('mt.b_sid')::uuid;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004b1", "role": "authenticated"}', true) \gset
do $$
declare
  r jsonb := public.contest_results('mt-asosiy');
begin
  if (r -> 'rows' -> 0 ->> 'rank')::int <> 1 or (r -> 'rows' -> 1 ->> 'rank')::int <> 1 then
    raise exception 'FAIL M14: teng ball va vaqt bir xil o''rin bermadi: %', r -> 'rows';
  end if;
  raise notice 'OK M14 tenglik: bir xil ball va vaqt = bir xil o''rin';
end
$$;

-- C (18 yoshgacha): jadval yo'q, faqat o'z natijasi
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004c1", "role": "authenticated"}', true) \gset
do $$
declare
  r jsonb := public.contest_results('mt-asosiy');
begin
  if (r ->> 'eligible')::boolean or jsonb_array_length(r -> 'rows') <> 0 or r -> 'me_row' <> 'null'::jsonb then
    raise exception 'FAIL M15: 18 yoshgacha foydalanuvchi jadvalni ko''rdi: %', r;
  end if;
  if (r -> 'me' ->> 'score')::int <> 3 or r -> 'me' -> 'rank' <> 'null'::jsonb then
    raise exception 'FAIL M15: 18 yoshgacha o''z natijasi noto''g''ri: %', r -> 'me';
  end if;
  raise notice 'OK M15 18 yoshgacha: jadval yo''q, o''z bali bor (o''rinsiz)';
end
$$;

-- D (reytingda emas): jadvalni ko'radi, o'zi jadvalda yo'q
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004d1", "role": "authenticated"}', true) \gset
do $$
declare
  r jsonb := public.contest_results('mt-asosiy');
begin
  if jsonb_array_length(r -> 'rows') <> 2 or (r -> 'me' ->> 'score')::int <> 1 or r -> 'me' -> 'rank' <> 'null'::jsonb then
    raise exception 'FAIL M16: reytingda bo''lmagan katta: %', r;
  end if;
  raise notice 'OK M16 opt-in: reytingga qo''shilmagan qatnashchi jadvalda yo''q, o''z natijasini ko''radi';
end
$$;

-- E (qatnashmagan): jadval bor, sharh yo'q; boshlash yopiq
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000004e1", "role": "authenticated"}', true) \gset
do $$
declare
  r jsonb := public.contest_results('mt-asosiy');
begin
  if (r ->> 'entered')::boolean or r -> 'me' <> 'null'::jsonb then
    raise exception 'FAIL M17: qatnashmagan foydalanuvchida natija bor: %', r -> 'me';
  end if;
  begin
    perform public.contest_review('mt-asosiy');
    raise exception 'FAIL M17: qatnashmagan foydalanuvchi sharhni ko''rdi';
  exception when no_data_found then null;
  end;
  begin
    perform public.contest_start('mt-asosiy');
    raise exception 'FAIL M17: tugagan musobaqa boshlandi';
  exception when object_not_in_prerequisite_state then
    if sqlerrm <> 'contest_closed' then raise; end if;
  end;
  raise notice 'OK M17 qatnashmagan: natijasi va sharhi yo''q, tugagan musobaqani boshlab bo''lmaydi';
end
$$;
reset role;

-- Tugagan musobaqa savollari bankka qaytadi, keyingisi hali himoyada
do $$
begin
  if (select count(*) from private.filtered_questions(null, '{}') q
       where q.id in (current_setting('mt.q1')::uuid, current_setting('mt.q2')::uuid, current_setting('mt.q3')::uuid)) <> 3 then
    raise exception 'FAIL M18: tugagan musobaqa savollari bankka qaytmadi';
  end if;
  if exists (select 1 from private.filtered_questions(null, '{}') q where q.id = current_setting('mt.q4')::uuid) then
    raise exception 'FAIL M18: keyingi musobaqa savoli bankda';
  end if;
  if exists (select 1 from public.xp_events) then
    raise exception 'FAIL M18: musobaqa XP berdi';
  end if;
  raise notice 'OK M18 bank: tugagan musobaqa savollari qaytadi, keyingisi himoyada; XP yozilmagan';
end
$$;

rollback;
