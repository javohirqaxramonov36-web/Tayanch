-- P10 kun savoli sinovlari (20261111120000_kun_savoli): tanlov, navbat, mehmon, login, streak, kvota.
-- sessiya_test.sql kabi: bitta tranzaksiya, oxirida ROLLBACK. Sinov savollari faqat "SINOV" matnli soxta yozuvlar.
-- Sana simulyatsiyasi: private.today_tashkent() tranzaksiya ichida ks.today sozlamasidan o'qiydigan qilib almashtiriladi.
\set ON_ERROR_STOP on
\set QUIET on

begin;

create or replace function private.today_tashkent()
returns date language sql stable set search_path = '' as $$
  select current_setting('ks.today')::date
$$;
-- 2026-11-11: 2026-01-01 dan 314-kun (juft) → Reading and Writing.
select set_config('ks.today', '2026-11-11', false) \gset

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000c1', 'ka@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000d1', 'kb@sinov.invalid', '{}');

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, figure, status, author, verified_by)
values
  ('ks-rw-1', 'rw', 'KS-domain-rw', 'KS-skill-r', 2, 'mcq', 'SINOV kun R1',
   '[{"key": "A", "text": "SINOV a"}, {"key": "B", "text": "SINOV b"}]', '{"choice": "B"}', 'SINOV kun izoh R1', null, 'draft', 'sinov', null),
  ('ks-rw-2', 'rw', 'KS-domain-rw', 'KS-skill-r', 3, 'mcq', 'SINOV kun R2',
   '[{"key": "A", "text": "SINOV a"}, {"key": "B", "text": "SINOV b"}]', '{"choice": "A"}', 'SINOV kun izoh R2', null, 'draft', 'sinov', null),
  ('ks-math-1', 'math', 'KS-domain-m', 'KS-skill-m', 2, 'spr', 'SINOV kun M1',
   null, '{"accepted": ["1/2"]}', 'SINOV kun izoh M1', null, 'draft', 'sinov', null),
  ('ks-math-fig', 'math', 'KS-domain-m', 'KS-skill-m', 2, 'spr', 'SINOV kun rasmli',
   null, '{"accepted": ["3"]}', 'SINOV kun izoh F', '{"path": "sinov/ks.png", "alt": "SINOV"}', 'draft', 'sinov', null);

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'questions' and column_name = 'verified_at') then
    execute 'update public.questions set status = ''verified'', verified_by = ''sinov2'', verified_at = now() where external_id like ''ks-%''';
  else
    update public.questions set status = 'verified', verified_by = 'sinov2' where external_id like 'ks-%';
  end if;
end
$$;

------------------------------------------------------------------------------
-- Mehmon (anon)
------------------------------------------------------------------------------
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset

do $$
declare
  r   jsonb;
  qid uuid;
begin
  r := public.daily_question_public();
  qid := (r -> 'question' ->> 'id')::uuid;
  if qid is null or r -> 'question' ->> 'section' <> 'rw' or r ->> 'date' <> '2026-11-11' then
    raise exception 'FAIL K01: 2026-11-11 uchun R&W savoli kutilgan: %', r;
  end if;
  if position('SINOV kun izoh' in r::text) > 0 or position('"choice"' in r::text) > 0
     or position('"accepted"' in r::text) > 0 or position('"correct"' in r::text) > 0 then
    raise exception 'FAIL K01: mehmon savolida to''g''ri javob yoki izoh bor: %', r;
  end if;
  if (r ->> 'next_at')::timestamptz <> '2026-11-11 19:00:00+00'::timestamptz then
    raise exception 'FAIL K01: next_at Toshkent 00:00 (UTC 19:00) emas: %', r ->> 'next_at';
  end if;
  perform set_config('ks.q1', qid::text, false);

  -- Javob: to'g'ri javob va izoh faqat shu yerda. Begona savol rad etiladi.
  r := public.check_daily_answer(qid, 'A');
  if r ->> 'explanation' is null or r -> 'correct' is null or r -> 'is_correct' is null then
    raise exception 'FAIL K02: check_daily_answer natijasi to''liq emas: %', r;
  end if;
  begin
    perform public.check_daily_answer(gen_random_uuid(), 'A');
    raise exception 'FAIL K02: begona savol qabul qilindi';
  exception when sqlstate 'P0002' then null;
  end;
  begin
    perform public.check_daily_answer(qid, '   ');
    raise exception 'FAIL K02: bo''sh javob qabul qilindi';
  exception when sqlstate '22023' then null;
  end;
  begin
    perform public.daily_question();
    raise exception 'FAIL K02: anon daily_question ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.daily_picks;
    raise exception 'FAIL K02: anon daily_picks ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK K01 mehmon: bugungi R&W savoli javobsiz, next_at = Toshkent 00:00';
  raise notice 'OK K02 mehmon: javob faqat tekshiruvdan keyin, begona savol va bo''sh javob rad, jadval yopiq';
end
$$;
reset role;

do $$
begin
  if (select count(*) from public.attempts) <> 0 or (select count(*) from public.practice_sessions) <> 0
     or (select count(*) from public.usage_counters) <> 0 then
    raise exception 'FAIL K03: mehmon so''rovi attempts / sessions / usage_counters ga yozdi';
  end if;
  raise notice 'OK K03 mehmon: hech narsa yozilmaydi (faqat kun tanlovi)';
end
$$;

-- Kun ichida yangi savol qo'shildi: bugungi tanlov o'zgarmasligi kerak.
insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, status, author, verified_by)
values ('ks-rw-3', 'rw', 'KS-domain-rw', 'KS-skill-r', 1, 'mcq', 'SINOV kun R3',
        '[{"key": "A", "text": "SINOV a"}, {"key": "B", "text": "SINOV b"}]', '{"choice": "A"}', 'SINOV kun izoh R3', 'draft', 'sinov', null);
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'questions' and column_name = 'verified_at') then
    execute 'update public.questions set status = ''verified'', verified_by = ''sinov2'', verified_at = now() where external_id = ''ks-rw-3''';
  else
    update public.questions set status = 'verified', verified_by = 'sinov2' where external_id = 'ks-rw-3';
  end if;
end
$$;

------------------------------------------------------------------------------
-- Foydalanuvchi A
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset

do $$
declare
  q1  uuid := current_setting('ks.q1')::uuid;
  r   jsonb;
  s   jsonb;
  sid uuid;
begin
  r := public.daily_question();
  sid := (r ->> 'session_id')::uuid;
  if (r -> 'question' ->> 'id')::uuid is distinct from q1 or sid is null then
    raise exception 'FAIL K04: login savoli mehmonnikidan farq qildi yoki sessiya yo''q: %', r;
  end if;
  if position('SINOV kun izoh' in r::text) > 0 or r -> 'result' <> 'null'::jsonb then
    raise exception 'FAIL K04: javobdan oldin natija yoki izoh bor: %', r;
  end if;
  if (r -> 'streak' ->> 'current')::integer <> 0 or (r -> 'streak' ->> 'active_today')::boolean then
    raise exception 'FAIL K04: yangi foydalanuvchi streak''i 0 emas: %', r -> 'streak';
  end if;
  raise notice 'OK K04 login: savol mehmon bilan bir xil (yangi savol qo''shilganda ham), javobsiz, streak 0';

  s := public.submit_answer(sid, q1, 'B');
  if s ->> 'explanation' is null then
    raise exception 'FAIL K05: submit_answer izoh qaytarmadi: %', s;
  end if;
  r := public.daily_question();
  if r -> 'result' ->> 'answer' <> 'B' or r -> 'result' ->> 'explanation' is null
     or (r -> 'streak' ->> 'current')::integer <> 1 or not (r -> 'streak' ->> 'active_today')::boolean
     or (r ->> 'session_id')::uuid <> sid then
    raise exception 'FAIL K05: javobdan keyingi holat noto''g''ri: %', r;
  end if;
  if exists (select 1 from public.usage_counters where user_id = '00000000-0000-4000-8000-0000000000c1' and count > 0) then
    raise exception 'FAIL K06: kun savoli kvota sarfladi: %',
      (select jsonb_agg(u) from public.usage_counters u where user_id = '00000000-0000-4000-8000-0000000000c1');
  end if;
  raise notice 'OK K05 login: javobdan keyin natija va izoh, streak 1 (bugun faol)';
  raise notice 'OK K06 kvota: daily_question va daily submit_answer hech qanday kvota kalitini sarflamadi';
  perform set_config('ks.sid1', sid::text, false);
end
$$;
reset role;

-- 2-kun (2026-11-12, toq → Math)
select set_config('ks.today', '2026-11-12', false) \gset
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset

do $$
declare
  r   jsonb;
  sid uuid;
begin
  r := public.daily_question();
  if r -> 'question' ->> 'section' <> 'math' or r -> 'question' ->> 'external_id' <> 'ks-math-1' then
    raise exception 'FAIL K07: 2026-11-12 da rasmsiz Math savoli kutilgan: %', r -> 'question';
  end if;
  if (r -> 'streak' ->> 'current')::integer <> 1 or (r -> 'streak' ->> 'active_today')::boolean then
    raise exception 'FAIL K08: ertasi kuni javobdan oldin streak 1 (saqlangan) bo''lishi kerak: %', r -> 'streak';
  end if;
  begin
    perform public.submit_answer(current_setting('ks.sid1')::uuid, (r -> 'question' ->> 'id')::uuid, 'A');
    raise exception 'FAIL K09: kechagi sessiyaga bugun javob qabul qilindi';
  exception when sqlstate 'P0002' then null;   -- bugungi savol kechagi sessiyada yo'q
  end;
  sid := (r ->> 'session_id')::uuid;
  perform public.submit_answer(sid, (r -> 'question' ->> 'id')::uuid, '0.5');
  r := public.daily_question();
  if (r -> 'streak' ->> 'current')::integer <> 2 or not (r -> 'result' ->> 'is_correct')::boolean then
    raise exception 'FAIL K08: 2-kun javobidan keyin streak 2 va to''g''ri javob kutilgan: %', r;
  end if;
  raise notice 'OK K07 navbat: 11-noyabr R&W, 12-noyabr Math (rasmli savol chiqmaydi)';
  raise notice 'OK K08 streak: kun tugaguncha saqlanadi, ketma-ket 2 kun = 2';
end
$$;
reset role;

-- Kechagi sessiya: savolni o'z sessiyasiga javob bermasdan qoldirgan B foydalanuvchi ertasi kuni javob bera olmaydi.
select set_config('ks.today', '2026-11-11', false) \gset
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000d1", "role": "authenticated"}', true) \gset
do $$
declare r jsonb;
begin
  r := public.daily_question();
  perform set_config('ks.sid_b', r ->> 'session_id', false);
  perform set_config('ks.q_b', r -> 'question' ->> 'id', false);
end
$$;
reset role;
select set_config('ks.today', '2026-11-12', false) \gset
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000d1", "role": "authenticated"}', true) \gset
do $$
begin
  begin
    perform public.submit_answer(current_setting('ks.sid_b')::uuid, current_setting('ks.q_b')::uuid, 'B');
    raise exception 'FAIL K09: kun o''tgandan keyin kunlik sessiyaga javob qabul qilindi';
  exception when sqlstate '55000' then null;
  end;
  raise notice 'OK K09 daily_expired: kechagi kunlik sessiyaga ertasi kuni javob berilmaydi';
end
$$;
reset role;

-- 4-kun (2026-11-14): bir kun o'tkazib yuborildi → streak 0 (yangidan boshlanadi).
select set_config('ks.today', '2026-11-14', false) \gset
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare r jsonb;
begin
  r := public.daily_question();
  if (r -> 'streak' ->> 'current')::integer <> 0 then
    raise exception 'FAIL K10: bir kun o''tkazilgandan keyin streak 0 kutilgan: %', r -> 'streak';
  end if;
  -- 2026-11-14 (317-kun, toq → Math): Math'da yagona rasmsiz savol ks-math-1, u 12-noyabrda berilgan, baribir u.
  if r -> 'question' ->> 'external_id' <> 'ks-math-1' then
    raise exception 'FAIL K10: Math kuni kutilgan savol ks-math-1: %', r -> 'question';
  end if;
  perform set_config('ks.sid4', r ->> 'session_id', false);
  raise notice 'OK K10 streak: o''tkazilgan kundan keyin 0; bo''limdagi savollar tugasa eng uzoq berilgani qaytadi';
end
$$;
reset role;

-- Savol yashirildi: bugungi tanlov qayta qilinadi, javob berilmagan sessiyadagi savol almashadi.
-- ks-math-1 yashiriladi → Math'da rasmsiz savol yo'q → R&W'dan olinadi (zaxira bo'lim).
update public.questions set status = 'hidden' where external_id = 'ks-math-1';
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare r jsonb;
begin
  r := public.daily_question();
  if r -> 'question' ->> 'section' <> 'rw' or (r ->> 'session_id')::uuid <> current_setting('ks.sid4')::uuid then
    raise exception 'FAIL K11: yashirilgan savol o''rniga shu sessiyada R&W savoli kutilgan: %', r;
  end if;
  -- 11-noyabrdagi R&W savoli (ks.q1) berilgan; qolgan ikki R&W savoli hali berilmagan → ulardan biri tanlanadi.
  if (r -> 'question' ->> 'id')::uuid = current_setting('ks.q1')::uuid then
    raise exception 'FAIL K11: avval berilmagan R&W savoli kutilgan: %', r -> 'question' ->> 'external_id';
  end if;
  raise notice 'OK K11 yashirilgan savol: qayta tanlanadi, bo''limda savol bo''lmasa ikkinchi bo''lim, avval berilmagani';
end
$$;
reset role;

-- Savol umuman yo'q: question = null (komponent yashiriladi).
update public.questions set status = 'hidden' where external_id like 'ks-%';
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
declare r jsonb;
begin
  r := public.daily_question_public();
  if r -> 'question' <> 'null'::jsonb then
    raise exception 'FAIL K12: savol yo''q bo''lsa question null kutilgan: %', r;
  end if;
  raise notice 'OK K12 savol yo''q: question = null';
end
$$;
reset role;

do $$
begin
  -- 11 va 12-noyabr qoladi; 14-noyabr yozuvi o'chdi (yaroqli savol qolmadi, K12).
  if (select count(*) from public.daily_picks) <> 2
     or exists (select 1 from public.daily_picks where day = '2026-11-14') then
    raise exception 'FAIL K13: daily_picks da 11 va 12-noyabr kutilgan: %', (select jsonb_agg(p.day) from public.daily_picks p);
  end if;
  raise notice 'OK K13 daily_picks: har kun uchun bitta yozuv, yaroqsiz tanlov o''chiriladi';
end
$$;

do $$ begin raise notice 'KUN SAVOLI SINOVLARI O''TDI'; end $$;

rollback;
