-- P14 analitika RPC sinovi (20261111120000_analitika): public.analytics_summary().
-- Bitta tranzaksiya, oxirida ROLLBACK. Sinov savollari faqat "SINOV" matnli soxta yozuvlar.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000a4', 'aa@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000b4', 'ab@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000c4', 'ac@sinov.invalid', '{}');

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, status, author, verified_by)
values
  ('an-math-1', 'math', 'AN-domain', 'AN-skill-m', 2, 'mcq', 'SINOV savol 1',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "B"}', 'SINOV izoh', 'draft', 'sinov', null),
  ('an-math-2', 'math', 'AN-domain', 'AN-skill-m', 4, 'mcq', 'SINOV savol 2',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "B"}', 'SINOV izoh', 'draft', 'sinov', null),
  ('an-rw-1', 'rw', 'AN-domain-rw', 'AN-skill-r', 3, 'mcq', 'SINOV savol 3',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "A"}', 'SINOV izoh', 'draft', 'sinov', null);

-- Urinishlar to'g'ridan-to'g'ri yoziladi (sana va vaqtni boshqarish uchun). k = necha kun oldin (Toshkent), soat Toshkent bo'yicha.
do $$
declare
  a  constant uuid := '00000000-0000-4000-8000-0000000000a4';
  b  constant uuid := '00000000-0000-4000-8000-0000000000b4';
  t  date := (now() at time zone 'Asia/Tashkent')::date;
  m1 uuid := (select id from public.questions where external_id = 'an-math-1');
  m2 uuid := (select id from public.questions where external_id = 'an-math-2');
  r1 uuid := (select id from public.questions where external_id = 'an-rw-1');
  s  uuid;
  r  record;
begin
  for r in
    select * from (values
      (a, 0,   interval '0 hours 1 minute', m1, true,  30000),
      (a, 0,   interval '0 hours 1 minute', r1, false, 60000),
      (a, 1,   interval '12 hours',         m1, false, 50000),
      (a, 1,   interval '12 hours',         m2, true,  null),
      (a, 3,   interval '12 hours',         r1, true,  20000),
      (a, 100, interval '12 hours',         m2, false, 10000),
      -- B: Toshkentda bugun 00:01 (UTC bo'yicha kecha): bugungi kun deb sanalishi kerak
      (b, 0,   interval '0 hours 1 minute', m1, true,  5000)
    ) v(u, k, soat, q, ok, ms)
  loop
    insert into public.practice_sessions (user_id, mode) values (r.u, 'practice') returning id into s;
    insert into public.attempts (user_id, session_id, question_id, answer, is_correct, time_ms, question_version, created_at)
    values (r.u, s, r.q, 'A', r.ok, r.ms, 1, ((t - r.k)::timestamp + r.soat) at time zone 'Asia/Tashkent');
  end loop;

  insert into public.bookmarks (user_id, question_id) values (a, m1);
  insert into public.review_queue (user_id, question_id, next_due, reason_tag) values (a, r1, t, 'misread'), (a, m1, t, null);
end
$$;

do $$
begin
  if not (select features ? 'analytics_extended' from public.plans where code = 'pro')
     or not (select features ? 'analytics_extended' from public.plans where code = 'max')
     or (select features ? 'analytics_extended' from public.plans where code = 'free') then
    raise exception 'FAIL A00: analytics_extended bayrog''i noto''g''ri tariflarda';
  end if;
  if (select jsonb_array_length(features) - jsonb_array_length(features - 'analytics_extended') from public.plans where code = 'pro') <> 1 then
    raise exception 'FAIL A00: bayroq takrorlangan (migratsiya 2 marta ishlaganda)';
  end if;
  raise notice 'OK A00 analytics_extended: pro va max da bitta, free da yo''q';
end
$$;

-- Anonim
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.analytics_summary();
    raise exception 'FAIL A01: anon analytics_summary ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK A01 anon: analytics_summary yopiq';
end
$$;
reset role;

-- C: ma'lumot yo'q
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c4", "role": "authenticated"}', true) \gset
do $$
declare j jsonb := public.analytics_summary();
begin
  if j -> 'totals' <> '{"attempts": 0, "correct": 0, "bookmarks": 0, "streak": 0, "active_days": 0}'::jsonb
     or j -> 'skills' <> '[]' or j -> 'sections' <> '[]' or j -> 'days' <> '[]' or j -> 'reasons' <> '[]'
     or (j ->> 'reasons_untagged')::int <> 0 or (j ->> 'extended')::boolean or j -> 'difficulty' <> 'null'
     or j ->> 'tz' <> 'Asia/Tashkent' then
    raise exception 'FAIL A02: bo''sh holat noto''g''ri: %', j;
  end if;
  raise notice 'OK A02 bo''sh foydalanuvchi: nollar, bo''sh massivlar, difficulty yo''q';
end
$$;
reset role;

-- A: free
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a4", "role": "authenticated"}', true) \gset
do $$
declare
  j jsonb := public.analytics_summary();
  t date := (now() at time zone 'Asia/Tashkent')::date;
begin
  if j -> 'totals' <> '{"attempts": 6, "correct": 3, "bookmarks": 1, "streak": 2, "active_days": 4}'::jsonb then
    raise exception 'FAIL A03: totals: %', j -> 'totals';
  end if;
  if j -> 'skills' <> '[{"section": "math", "domain": "AN-domain", "skill": "AN-skill-m", "attempts": 4, "correct": 2},
                        {"section": "rw", "domain": "AN-domain-rw", "skill": "AN-skill-r", "attempts": 2, "correct": 1}]'::jsonb then
    raise exception 'FAIL A03: skills: %', j -> 'skills';
  end if;
  if j -> 'sections' <> '[{"section": "math", "attempts": 4, "correct": 2, "time_ms": 90000},
                          {"section": "rw", "attempts": 2, "correct": 1, "time_ms": 80000}]'::jsonb then
    raise exception 'FAIL A03: sections: %', j -> 'sections';
  end if;
  if j -> 'days' <> jsonb_build_array(
       jsonb_build_object('date', t - 3, 'attempts', 1),
       jsonb_build_object('date', t - 1, 'attempts', 2),
       jsonb_build_object('date', t, 'attempts', 2)) then
    raise exception 'FAIL A03: days (90 kun, Toshkent kuni): %', j -> 'days';
  end if;
  if j -> 'reasons' <> '[{"tag": "misread", "count": 1}]'::jsonb or (j ->> 'reasons_untagged')::int <> 1 then
    raise exception 'FAIL A03: reasons: % / %', j -> 'reasons', j -> 'reasons_untagged';
  end if;
  if (j ->> 'extended')::boolean or j -> 'difficulty' <> 'null' then
    raise exception 'FAIL A03: free tarifda kengaytirilgan ma''lumot ketdi: %', j -> 'difficulty';
  end if;
  raise notice 'OK A03 A (free): totals, streak 2, skills, sections, days (100 kun oldingi kirmaydi), reasons; difficulty yo''q';
end
$$;
reset role;

-- B: faqat o'ziniki; Toshkent yarim tunidan keyingi urinish bugunga tushadi
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000b4", "role": "authenticated"}', true) \gset
do $$
declare
  j jsonb := public.analytics_summary();
  t date := (now() at time zone 'Asia/Tashkent')::date;
begin
  if (j -> 'totals' ->> 'attempts')::int <> 1 or (j -> 'totals' ->> 'bookmarks')::int <> 0 or (j -> 'totals' ->> 'streak')::int <> 1
     or j -> 'days' <> jsonb_build_array(jsonb_build_object('date', t, 'attempts', 1)) then
    raise exception 'FAIL A04: B: %', j;
  end if;
  raise notice 'OK A04 B: A ma''lumotini ko''rmaydi; 00:01 (Toshkent) bugungi kun';
end
$$;
reset role;

-- A: pro obuna bilan kengaytirilgan
insert into public.subscriptions (user_id, bolim, plan_code, status, source)
values ('00000000-0000-4000-8000-0000000000a4', 'sat', 'pro', 'active', 'admin');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a4", "role": "authenticated"}', true) \gset
do $$
declare j jsonb := public.analytics_summary();
begin
  if not (j ->> 'extended')::boolean or j -> 'difficulty' <> '[
       {"band": "easy", "attempts": 2, "correct": 1, "timed": 2, "median_ms": 40000},
       {"band": "medium", "attempts": 2, "correct": 1, "timed": 2, "median_ms": 40000},
       {"band": "hard", "attempts": 2, "correct": 1, "timed": 1, "median_ms": 10000}]'::jsonb then
    raise exception 'FAIL A05: difficulty: %', j -> 'difficulty';
  end if;
  begin
    perform private.has_feature('00000000-0000-4000-8000-0000000000a4', 'analytics_extended');
    raise exception 'FAIL A05: authenticated private.has_feature ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK A05 A (pro): difficulty guruhlari, median vaqt (vaqtsiz urinish hisobga kirmaydi); has_feature yopiq';
end
$$;
reset role;

do $$ begin raise notice 'ANALITIKA SINOVLARI O''TDI'; end $$;

rollback;
