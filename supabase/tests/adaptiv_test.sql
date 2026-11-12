-- P31 kalibrlash sinovi (20261112143717_adaptiv_kalibr): private.difficulty_calibration, private.apply_difficulty_calibration.
-- Bitta tranzaksiya, oxirida ROLLBACK. Savollar va javoblar soxta ("SINOV"); N = 30 (standart).
\set ON_ERROR_STOP on
\set QUIET on

begin;

-- 31 ta soxta foydalanuvchi
insert into auth.users (id, email, raw_user_meta_data)
select ('00000000-0000-4000-8000-0000000a' || lpad(to_hex(i), 4, '0'))::uuid, 'ad' || i || '@sinov.invalid', '{}'
from generate_series(1, 31) i;

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, status, author, verified_by)
select v.ext, 'math', 'AD-domain', 'AD-skill', v.d, 'mcq', 'SINOV savol ' || v.ext,
       '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "A"}', 'SINOV izoh', v.st, 'sinov',
       case when v.st = 'verified' then 'sinov-tekshiruvchi' end
from (values
  ('ad-oson',  3, 'verified'),  -- 30 foydalanuvchi, 27 to'g'ri (90%) → taklif 1, change
  ('ad-mos',   3, 'verified'),  -- 30 foydalanuvchi, 15 to'g'ri (50%) → 3, ok
  ('ad-kam',   3, 'verified'),  -- 29 foydalanuvchi, hammasi to'g'ri → not_enough
  ('ad-versiya', 2, 'verified'),-- 30 javob eski versiyaga, joriy versiyaga 0 → not_enough
  ('ad-qoralama', 3, 'draft')   -- hisobotga kirmaydi
) v(ext, d, st);

do $$
declare
  u uuid;
  i integer;
  s uuid;
  q_oson uuid := (select id from public.questions where external_id = 'ad-oson');
  q_mos  uuid := (select id from public.questions where external_id = 'ad-mos');
  q_kam  uuid := (select id from public.questions where external_id = 'ad-kam');
  q_ver  uuid := (select id from public.questions where external_id = 'ad-versiya');
  q_dr   uuid := (select id from public.questions where external_id = 'ad-qoralama');
begin
  for i in 1..30 loop
    u := ('00000000-0000-4000-8000-0000000a' || lpad(to_hex(i), 4, '0'))::uuid;
    insert into public.practice_sessions (user_id, mode) values (u, 'practice') returning id into s;
    insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version, created_at) values
      (u, s, q_oson, 'A', i <= 27, 1, now() - interval '2 days'),
      (u, s, q_mos,  'A', i <= 15, 1, now() - interval '2 days'),
      (u, s, q_ver,  'A', true,    1, now() - interval '2 days'),
      (u, s, q_dr,   'A', true,    1, now() - interval '2 days');
    if i <= 29 then
      insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version, created_at)
      values (u, s, q_kam, 'A', true, 1, now() - interval '2 days');
    end if;
    -- Takror urinish (keyinroq, boshqa sessiyada): hammasi noto'g'ri, lekin sanalmasligi kerak
    insert into public.practice_sessions (user_id, mode) values (u, 'review') returning id into s;
    insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version, created_at)
    values (u, s, q_oson, 'B', false, 1, now() - interval '1 day');
  end loop;
  -- ad-versiya matni o'zgardi: versiya 2, eski 30 javob sanalmaydi
  update public.questions set stem = 'SINOV savol ad-versiya (yangi)' where id = q_ver;
end
$$;

do $$
declare
  r record;
  n integer;
begin
  if (select version from public.questions where external_id = 'ad-versiya') <> 2 then
    raise exception 'FAIL AD00: versiya oshmadi';
  end if;

  select * into r from private.difficulty_calibration() where external_id = 'ad-oson';
  if r.answers <> 30 or r.correct <> 27 or r.p_correct <> 90.0 or r.suggested_difficulty <> 1 or r.status <> 'change' then
    raise exception 'FAIL AD01: ad-oson %', row_to_json(r);
  end if;
  raise notice 'OK AD01 har foydalanuvchining birinchi javobi: 30 javob, 90%% → taklif 1 (change), takror urinish sanalmadi';

  select * into r from private.difficulty_calibration() where external_id = 'ad-mos';
  if r.p_correct <> 50.0 or r.suggested_difficulty <> 3 or r.status <> 'ok' then
    raise exception 'FAIL AD02: ad-mos %', row_to_json(r);
  end if;
  select * into r from private.difficulty_calibration() where external_id = 'ad-kam';
  if r.answers <> 29 or r.suggested_difficulty is not null or r.status <> 'not_enough' then
    raise exception 'FAIL AD02: ad-kam %', row_to_json(r);
  end if;
  select * into r from private.difficulty_calibration() where external_id = 'ad-versiya';
  if r.answers <> 0 or r.status <> 'not_enough' then
    raise exception 'FAIL AD02: ad-versiya %', row_to_json(r);
  end if;
  if exists (select 1 from private.difficulty_calibration() where external_id = 'ad-qoralama') then
    raise exception 'FAIL AD02: draft savol hisobotda';
  end if;
  raise notice 'OK AD02 50%% → ok; 29 javob (N dan kam) va eski versiya javoblari → not_enough; draft hisobotda yo''q';

  -- p_min_answers = 29 bilan ad-kam ham taklif oladi (parametr ishlaydi)
  select * into r from private.difficulty_calibration(29) where external_id = 'ad-kam';
  if r.suggested_difficulty <> 1 then raise exception 'FAIL AD03: p_min_answers parametri %', row_to_json(r); end if;

  begin
    perform private.apply_difficulty_calibration('  ');
    raise exception 'FAIL AD03: bo''sh p_actor qabul qilindi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform private.apply_difficulty_calibration('sinov', 30, '{20,40,60,80}');
    raise exception 'FAIL AD03: o''suvchi p_bands qabul qilindi';
  exception when invalid_parameter_value then null;
  end;

  n := private.apply_difficulty_calibration('sinov-muallif');
  if n <> 1 then raise exception 'FAIL AD03: % ta savol o''zgardi (kutilgan 1)', n; end if;
  if (select difficulty from public.questions where external_id = 'ad-oson') <> 1
     or (select difficulty from public.questions where external_id = 'ad-mos') <> 3
     or (select difficulty from public.questions where external_id = 'ad-kam') <> 3
     or (select version from public.questions where external_id = 'ad-oson') <> 1 then
    raise exception 'FAIL AD03: qiyinlik yoki versiya noto''g''ri';
  end if;
  if (select count(*) from public.audit_log where action = 'difficulty_calibration' and actor = 'sinov-muallif'
        and details ->> 'from' = '3' and details ->> 'to' = '1') <> 1 then
    raise exception 'FAIL AD03: audit_log yozuvi yo''q';
  end if;
  if private.apply_difficulty_calibration('sinov-muallif') <> 0 then
    raise exception 'FAIL AD03: ikkinchi marta ishga tushirish yana o''zgartirdi';
  end if;
  raise notice 'OK AD03 apply: faqat change qatori yozildi, versiya oshmadi, audit_log bor, takror ishga tushirish 0';
end
$$;

-- AD04: anon, authenticated, service_role chaqira olmaydi
do $$
declare
  rol text;
begin
  foreach rol in array array['anon', 'authenticated', 'service_role'] loop
    execute format('set local role %I', rol);
    begin
      perform private.difficulty_calibration();
      raise exception 'FAIL AD04: % difficulty_calibration ni chaqirdi', rol;
    exception when insufficient_privilege then null;
    end;
    begin
      perform private.apply_difficulty_calibration('x');
      raise exception 'FAIL AD04: % apply_difficulty_calibration ni chaqirdi', rol;
    exception when insufficient_privilege then null;
    end;
    reset role;
  end loop;
  raise notice 'OK AD04 anon, authenticated, service_role ikkala funksiyani ham chaqira olmaydi';
end
$$;

do $$ begin raise notice 'ADAPTIV KALIBRLASH SINOVLARI O''TDI'; end $$;

rollback;
