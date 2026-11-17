-- P31 + P30: mock imtihonda adaptive-style 2-modul (20261113111947_mock_adaptiv). Tarmoq serverda, 1-/3-modul yopilganda.
-- MA01 qiyin (R&W 27/27) va oson (Math 0/22), MA02 chegara atrofi (17/27 → qiyin, 16/27 → oson, retake),
-- MA03 sohada savol kam → standart, MA04 mijoz tarmoqni ko'rmaydi va yoza olmaydi, MA05 natijada izoh ma'lumoti.
-- Bitta tranzaksiya, oxirida ROLLBACK. Savollar faqat "SINOV" matnli soxta yozuvlar (to'g'ri javob A).
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000e1', 'ma1@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000e2', 'ma2@sinov.invalid', '{}');

-- Har ko'nikmaga 10 ta savol, qiyinlik 1–5 dan ikkitadan (muvozanatli pool).
insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, status, author, verified_by)
select format('ma-%s-%s', row_number() over (order by s.s_section, s.s_domain, s.s_skill), g.i),
       s.s_section, s.s_domain, s.s_skill, 1 + (g.i % 5), 'mcq', 'SINOV savol',
       '[{"key": "A", "text": "SINOV A"}, {"key": "B", "text": "SINOV B"}]', '{"choice": "A"}', 'SINOV izoh',
       'draft', 'sinov', null
  from private.mock_skills() s
 cross join generate_series(1, 10) as g (i);

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'questions' and column_name = 'verified_at') then
    execute 'update public.questions set status = ''verified'', verified_by = ''sinov2'', verified_at = now() where external_id like ''ma-%''';
  else
    update public.questions set status = 'verified', verified_by = 'sinov2' where external_id like 'ma-%';
  end if;
  if not private.mock_is_ready() then
    raise exception 'FAIL MA00: 300 savol bilan mock tayyor emas';
  end if;
end
$$;

-- Joriy modulni boshlaydi, birinchi k savolga A (to'g'ri), qolganiga B javob beradi va topshiradi.
-- (Har blokda takrorlanadi: sinov faylida yordamchi funksiya yaratilmaydi.)

-- MA01: R&W 27/27 → qiyin, Math 0/22 → oson
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000e1", "role": "authenticated"}', true) \gset
do $$
declare
  p  jsonb := public.start_mock(null);
  a  uuid := (p ->> 'attempt_id')::uuid;
  k  integer;
  mo integer;
begin
  perform set_config('ma.a1', a::text, true);
  perform set_config('ma.f1', p ->> 'form_id', true);
  foreach mo in array array[1, 2, 3, 4] loop
    p := public.mock_start_module(a);
    -- MA04: modul davomida tarmoq yoki qiyinlik mijozga berilmaydi
    if p ? 'adaptive' or exists (select 1 from jsonb_array_elements(p -> 'questions') e where e ? 'difficulty')
       or exists (select 1 from jsonb_array_elements(p -> 'modules') m where m ? 'branch' or m ? 'next_branch') then
      raise exception 'FAIL MA04: % -modul payload''ida tarmoq yoki qiyinlik bor', mo;
    end if;
    if mo = 2 and jsonb_array_length(p -> 'questions') <> 27 then
      raise exception 'FAIL MA01: adaptiv 2-modulda % savol (27 kutilgan)', jsonb_array_length(p -> 'questions');
    end if;
    if mo = 4 and jsonb_array_length(p -> 'questions') <> 22 then
      raise exception 'FAIL MA01: adaptiv 4-modulda % savol (22 kutilgan)', jsonb_array_length(p -> 'questions');
    end if;
    k := case mo when 1 then 27 when 2 then 5 when 3 then 0 else 3 end;
    perform public.mock_save(a, (
      select jsonb_agg(jsonb_build_object('question_id', e ->> 'id',
                                          'answer', case when (e ->> 'position')::integer <= k then 'A' else 'B' end,
                                          'time_ms', 1000))
        from jsonb_array_elements(p -> 'questions') e where (e ->> 'position')::integer <= 30));
    p := public.mock_submit_module(a, mo);
  end loop;
  if p ->> 'status' <> 'finished' then
    raise exception 'FAIL MA01: mock tugamadi: %', p ->> 'status';
  end if;
  -- R&W 27 + 5 = 32 / 54, Math 0 + 3 = 3 / 44 (ball formulasi tarmoqqa qaramaydi)
  if (p -> 'scores' -> 'rw' ->> 'correct')::integer <> 32 or (p -> 'scores' -> 'rw' ->> 'total')::integer <> 54
     or (p -> 'scores' -> 'math' ->> 'correct')::integer <> 3 or (p -> 'scores' -> 'math' ->> 'total')::integer <> 44 then
    raise exception 'FAIL MA01: ball: %', p -> 'scores';
  end if;
end
$$;
reset role;

do $$
declare
  a uuid := current_setting('ma.a1')::uuid;
  f uuid := current_setting('ma.f1')::uuid;
  bad text;
begin
  if (select next_branch || '/' || next_branch_reason from public.mock_modules where attempt_id = a and module = 1) <> 'qiyin/ustida'
     or (select next_branch || '/' || next_branch_reason from public.mock_modules where attempt_id = a and module = 3) <> 'oson/ostida'
     or (select next_branch_accuracy from public.mock_modules where attempt_id = a and module = 1) <> 100
     or exists (select 1 from public.mock_modules where attempt_id = a and module in (2, 4) and next_branch is not null) then
    raise exception 'FAIL MA01: mock_modules tarmoq yozuvi noto''g''ri';
  end if;
  if exists (select 1 from public.mock_attempt_questions aq join public.questions q on q.id = aq.question_id
              where aq.attempt_id = a and aq.module = 2 and q.difficulty not in (3, 4, 5))
     or exists (select 1 from public.mock_attempt_questions aq join public.questions q on q.id = aq.question_id
                 where aq.attempt_id = a and aq.module = 4 and q.difficulty not in (1, 2, 3)) then
    raise exception 'FAIL MA01: 2-modul qiyin (3–5), 4-modul oson (1–3) bo''lishi kerak';
  end if;
  -- Soha soni blueprint bo'yicha, 1-modul bilan kesishma yo'q, forma o'zgarmagan
  select string_agg(format('%s %s: %s', mm.module, b.b_domain, coalesce(x.n, 0)), '; ') into bad
    from private.mock_blueprint() b
    cross join (values (2), (4)) mm (module)
    left join lateral (
      select count(*) as n from public.mock_attempt_questions aq join public.questions q on q.id = aq.question_id
       where aq.attempt_id = a and aq.module = mm.module and q.domain = b.b_domain
    ) x on true
   where private.mock_section(mm.module) = b.b_section and coalesce(x.n, 0) <> b.b_per_module;
  if bad is not null then
    raise exception 'FAIL MA01: adaptiv modul soha taqsimoti: %', bad;
  end if;
  if exists (select 1 from public.mock_attempt_questions aq
               join public.mock_form_questions fq on fq.form_id = f and fq.question_id = aq.question_id and fq.module in (1, 3)
              where aq.attempt_id = a) then
    raise exception 'FAIL MA01: adaptiv modulda 1-modul savoli takrorlandi';
  end if;
  if (select count(*) from public.mock_form_questions where form_id = f) <> 98 then
    raise exception 'FAIL MA01: forma o''zgargan';
  end if;
  -- R&W modul tartibi: soha guruhlari blueprint tartibida (P30 qoidasi)
  if exists (
    select 1 from (
      select aq.position, b.b_ord, lag(b.b_ord) over (order by aq.position) as oldingi
        from public.mock_attempt_questions aq
        join public.questions q on q.id = aq.question_id
        join private.mock_blueprint() b on b.b_section = 'rw' and b.b_domain = q.domain
       where aq.attempt_id = a and aq.module = 2
    ) t where t.b_ord < t.oldingi
  ) then
    raise exception 'FAIL MA01: adaptiv R&W 2-modulda soha tartibi buzilgan';
  end if;
  -- Mashq sessiyasi adaptiv savollar bilan
  if (select count(*) from public.session_questions sq
        join public.mock_modules mm on mm.session_id = sq.session_id
        join public.mock_attempt_questions aq on aq.attempt_id = a and aq.module = 2 and aq.question_id = sq.question_id
       where mm.attempt_id = a and mm.module = 2) <> 27 then
    raise exception 'FAIL MA01: 2-modul sessiyasida adaptiv savollar emas';
  end if;
  raise notice 'OK MA01 tarmoq: R&W 27/27 → qiyin (3–5), Math 0/22 → oson (1–3), soha soni va tartib P30 dagidek, 1-modul bilan kesishma yo''q, forma o''zgarmagan';
end
$$;

-- MA05: natijada "adaptive" va 98 savol (adaptiv modullar bilan)
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000e1", "role": "authenticated"}', true) \gset
do $$
declare
  a uuid := current_setting('ma.a1')::uuid;
  r jsonb := public.get_mock_result(a);
begin
  if r -> 'adaptive' <> '{"rw": {"branch": "qiyin", "reason": "ustida"}, "math": {"branch": "oson", "reason": "ostida"}}'::jsonb then
    raise exception 'FAIL MA05: adaptive: %', r -> 'adaptive';
  end if;
  if jsonb_array_length(r -> 'questions') <> 98
     or (select count(*) from jsonb_array_elements(r -> 'questions') e
          where (e ->> 'module')::integer = 2 and (e ->> 'difficulty')::integer < 3) <> 0
     or (select count(*) from jsonb_array_elements(r -> 'questions') e
          where (e ->> 'module')::integer = 2 and (e ->> 'is_correct')::boolean) <> 5 then
    raise exception 'FAIL MA05: natija savollari adaptiv modulga mos emas';
  end if;
  raise notice 'OK MA05 natija: adaptive {rw: qiyin, math: oson}, 98 savol, 2-modul javoblari adaptiv savollarda';
end
$$;

-- MA02: retake (o'sha forma): 16/27 → oson (59,3%); keyin yana retake 17/27 → qiyin (63,0%)
do $$
declare
  p  jsonb;
  a  uuid;
  k  integer;
  i  integer;
  br text;
begin
  for i in 1..2 loop
    p := public.start_mock(current_setting('ma.f1')::uuid);
    a := (p ->> 'attempt_id')::uuid;
    p := public.mock_start_module(a);
    k := case i when 1 then 16 else 17 end;
    perform public.mock_save(a, (
      select jsonb_agg(jsonb_build_object('question_id', e ->> 'id',
                                          'answer', case when (e ->> 'position')::integer <= k then 'A' end))
        from jsonb_array_elements(p -> 'questions') e));
    perform public.mock_submit_module(a, 1);
    p := public.mock_start_module(a);
    if jsonb_array_length(p -> 'questions') <> 27 then
      raise exception 'FAIL MA02: retake 2-modulida % savol', jsonb_array_length(p -> 'questions');
    end if;
    perform public.mock_abandon(a);
    perform set_config('ma.r' || i, a::text, true);
  end loop;
end
$$;
reset role;

do $$
begin
  if (select next_branch from public.mock_modules where attempt_id = current_setting('ma.r1')::uuid and module = 1) <> 'oson'
     or (select next_branch from public.mock_modules where attempt_id = current_setting('ma.r2')::uuid and module = 1) <> 'qiyin' then
    raise exception 'FAIL MA02: 16/27 → oson, 17/27 → qiyin kutilgan';
  end if;
  if exists (select 1 from public.mock_attempt_questions aq join public.questions q on q.id = aq.question_id
              where aq.attempt_id = current_setting('ma.r1')::uuid and q.difficulty > 3) then
    raise exception 'FAIL MA02: oson 2-modulda 4–5 qiyinlik';
  end if;
  raise notice 'OK MA02 chegara 60: retake (o''sha forma) 16/27 → oson, 17/27 → qiyin, tarmoq har urinishda qayta tanlanadi';
end
$$;

-- MA03: Math'da bitta sohada qiyin savol yetmasa → standart (savol-kam), 4-modul forma tartibida
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000e2", "role": "authenticated"}', true) \gset
do $$
declare
  p jsonb := public.start_mock(null);
begin
  perform set_config('ma.a3', p ->> 'attempt_id', true);
  perform set_config('ma.f3', p ->> 'form_id', true);
end
$$;
reset role;

-- Geometry and Trigonometry: 3–5 qiyinlikdagi, formaning 3-modulida bo'lmagan savollar yashiriladi
update public.questions q set status = 'hidden'
 where q.external_id like 'ma-%' and q.domain = 'Geometry and Trigonometry' and q.difficulty >= 3
   and not exists (select 1 from public.mock_form_questions fq
                    where fq.form_id = current_setting('ma.f3')::uuid and fq.module = 3 and fq.question_id = q.id);

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000e2", "role": "authenticated"}', true) \gset
do $$
declare
  a  uuid := current_setting('ma.a3')::uuid;
  p  jsonb;
  mo integer;
  m4 uuid[];
begin
  foreach mo in array array[1, 2, 3] loop
    p := public.mock_start_module(a);
    perform public.mock_save(a, (
      select jsonb_agg(jsonb_build_object('question_id', e ->> 'id', 'answer', 'A'))
        from jsonb_array_elements(p -> 'questions') e));
    perform public.mock_submit_module(a, mo);
  end loop;
  p := public.mock_start_module(a);
  select array_agg((e ->> 'id')::uuid order by (e ->> 'position')::integer) into m4 from jsonb_array_elements(p -> 'questions') e;
  perform set_config('ma.m4', array_to_string(m4, ','), true);
  -- MA04: mijoz adaptiv jadvalni o'qiy olmaydi, private funksiyani chaqira olmaydi
  begin
    perform 1 from public.mock_attempt_questions;
    raise exception 'FAIL MA04: authenticated mock_attempt_questions ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.mock_attempt_questions (attempt_id, module, position, question_id)
    values (a, 4, 99, (p -> 'questions' -> 0 ->> 'id')::uuid);
    raise exception 'FAIL MA04: authenticated mock_attempt_questions ga yozdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform private.mock_adapt(a, 3, null);
    raise exception 'FAIL MA04: authenticated private.mock_adapt ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.mock_modules set next_branch = 'qiyin' where attempt_id = a;
    raise exception 'FAIL MA04: authenticated mock_modules ni o''zgartirdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK MA04 mijoz: payload''da tarmoq/qiyinlik yo''q; jadval, private funksiya va mock_modules yopiq';
end
$$;
reset role;

do $$
declare
  a uuid := current_setting('ma.a3')::uuid;
  f uuid := current_setting('ma.f3')::uuid;
begin
  if (select next_branch || '/' || next_branch_reason from public.mock_modules where attempt_id = a and module = 1) <> 'qiyin/ustida'
     or (select next_branch || '/' || next_branch_reason from public.mock_modules where attempt_id = a and module = 3) <> 'standart/savol-kam' then
    raise exception 'FAIL MA03: R&W qiyin, Math standart/savol-kam kutilgan: %',
      (select string_agg(module || '=' || coalesce(next_branch, '-') || '/' || coalesce(next_branch_reason, '-'), ' ')
         from public.mock_modules where attempt_id = a);
  end if;
  if exists (select 1 from public.mock_attempt_questions where attempt_id = a and module = 4) then
    raise exception 'FAIL MA03: standart tarmoqda 4-modul almashtirildi';
  end if;
  if current_setting('ma.m4') <> (select string_agg(question_id::text, ',' order by position)
                                    from public.mock_form_questions where form_id = f and module = 4) then
    raise exception 'FAIL MA03: standart 4-modul forma tartibida emas';
  end if;
  raise notice 'OK MA03 savol kam: Math sohasida qiyin savol yetmasa → standart (savol-kam), 4-modul P30 formasi tartibida';
end
$$;

do $$ begin raise notice 'MOCK ADAPTIV SINOVLARI O''TDI'; end $$;

rollback;
