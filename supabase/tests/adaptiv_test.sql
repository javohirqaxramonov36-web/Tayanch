-- P31 kalibrlash sinovi (20261112163208_adaptiv_kalibr): private.difficulty_calibration, private.apply_difficulty_calibration.
-- Tarmoq sinovi (20261113072953_adaptiv_tarmoq): private.adaptive_branch, private.adaptive_difficulties, private.adaptive_config.
-- Bitta tranzaksiya, oxirida ROLLBACK. Savollar va javoblar soxta ("SINOV"); N = 30 (standart).
\set ON_ERROR_STOP on
\set QUIET on

begin;

-- 31 ta soxta foydalanuvchi
insert into auth.users (id, email, raw_user_meta_data)
select ('00000000-0000-4000-8000-0000000a' || lpad(to_hex(i), 4, '0'))::uuid, 'ad' || i || '@sinov.invalid', '{}'
from generate_series(1, 31) i;

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, status, author, verified_by, verified_at)
select v.ext, 'math', 'AD-domain', 'AD-skill', v.d, 'mcq', 'SINOV savol ' || v.ext,
       '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "A"}', 'SINOV izoh', v.st, 'sinov',
       case when v.st = 'verified' then 'sinov-tekshiruvchi' end,
       case when v.st = 'verified' then now() end
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

-- AD05: tarmoq tanlash (20261113072953_adaptiv_tarmoq), src/lib/sat/adaptiv.ts tarmoqTanla bilan bir xil holatlar
do $$
declare
  r record;
  kut record;
begin
  for kut in
    select * from (values
      -- section, correct, total, easy, hard, config (null = standart), branch, reason
      ('rw',   17, 27, 40, 40, null::jsonb, 'qiyin',    'ustida'),       -- 63.0% > 60
      ('rw',   16, 27, 40, 40, null,        'oson',     'ostida'),       -- 59.3%
      ('math', 14, 22, 40, 40, null,        'qiyin',    'ustida'),       -- 63.6%
      ('math', 13, 22, 40, 40, null,        'oson',     'ostida'),       -- 59.1%
      ('rw',    3,  5, 40, 40, null,        'oson',     'ostida'),       -- aynan 60% → oson (qat'iy katta)
      ('rw',    7, 10, 40, 40, '{"threshold":70,"easy":[1,2,3],"hard":[3,4,5],"min_rw":27,"min_math":22}', 'oson', 'ostida'),
      ('rw',   27, 27, 40, 40, '{"threshold":null,"easy":[1,2,3],"hard":[3,4,5],"min_rw":27,"min_math":22}', 'standart', 'chegara-yoq'),
      ('rw',   27, 27, 40, 40, '{"threshold":101,"easy":[1,2,3],"hard":[3,4,5],"min_rw":27,"min_math":22}', 'standart', 'chegara-yoq'),
      ('rw',   20, 27, 26, 40, null,        'standart', 'savol-kam'),
      ('math', 20, 22, 22, 21, null,        'standart', 'savol-kam'),
      ('math', 20, 22, null, 40, null,      'standart', 'savol-kam'),
      ('rw',    0,  0, 40, 40, null,        'standart', 'natija-yoq'),
      ('rw',   28, 27, 40, 40, null,        'standart', 'natija-yoq'),
      ('rw',   null, 27, 40, 40, null,      'standart', 'natija-yoq')
    ) v(sec, c, t, e, h, cfg, br, rs)
  loop
    if kut.cfg is null then
      select * into r from private.adaptive_branch(kut.sec, kut.c, kut.t, kut.e, kut.h);
    else
      select * into r from private.adaptive_branch(kut.sec, kut.c, kut.t, kut.e, kut.h, kut.cfg);
    end if;
    if r.branch is distinct from kut.br or r.reason is distinct from kut.rs then
      raise exception 'FAIL AD05: % %/% (%/%) → % %, kutilgan % %', kut.sec, kut.c, kut.t, kut.e, kut.h, r.branch, r.reason, kut.br, kut.rs;
    end if;
    if kut.rs in ('ustida', 'ostida') and r.accuracy <> kut.c * 100.0 / kut.t then
      raise exception 'FAIL AD05: aniqlik % noto''g''ri', r.accuracy;
    end if;
    if kut.rs = 'natija-yoq' and r.accuracy is not null then
      raise exception 'FAIL AD05: yaroqsiz natijada aniqlik null emas';
    end if;
  end loop;
  begin
    perform private.adaptive_branch('ielts', 1, 2, 40, 40);
    raise exception 'FAIL AD05: noto''g''ri bo''lim qabul qilindi';
  exception when invalid_parameter_value then null;
  end;
  if private.adaptive_difficulties('oson') <> '{1,2,3}'::smallint[]
     or private.adaptive_difficulties('qiyin') <> '{3,4,5}'::smallint[]
     or private.adaptive_difficulties('standart') is not null then
    raise exception 'FAIL AD05: adaptive_difficulties noto''g''ri';
  end if;
  raise notice 'OK AD05 tarmoq: 60%% chegara, tenglik → oson, 70 va 7/10, null chegara, savol kam, yaroqsiz natija, qiyinliklar';
end
$$;

-- AD06: anon, authenticated, service_role tarmoq funksiyalarini chaqira olmaydi
do $$
declare
  rol text;
begin
  foreach rol in array array['anon', 'authenticated', 'service_role'] loop
    execute format('set local role %I', rol);
    begin
      perform private.adaptive_branch('rw', 20, 27, 40, 40, '{}'::jsonb);
      raise exception 'FAIL AD06: % adaptive_branch ni chaqirdi', rol;
    exception when insufficient_privilege then null;
    end;
    begin
      perform private.adaptive_config();
      raise exception 'FAIL AD06: % adaptive_config ni chaqirdi', rol;
    exception when insufficient_privilege then null;
    end;
    begin
      perform private.adaptive_difficulties('oson', '{}'::jsonb);
      raise exception 'FAIL AD06: % adaptive_difficulties ni chaqirdi', rol;
    exception when insufficient_privilege then null;
    end;
    reset role;
  end loop;
  raise notice 'OK AD06 anon, authenticated, service_role tarmoq funksiyalarini chaqira olmaydi';
end
$$;

do $$ begin raise notice 'ADAPTIV KALIBRLASH VA TARMOQ SINOVLARI O''TDI'; end $$;

rollback;
