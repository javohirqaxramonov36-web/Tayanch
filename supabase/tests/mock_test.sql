-- P30 mock imtihon sinovlari (20261113012418_mock_imtihon): tayyorlik, forma yig'ish, modul vaqti,
-- uzilish va davom ettirish, baholash, redo, kreditlar (P19), begona foydalanuvchi.
-- Bitta tranzaksiya, oxirida ROLLBACK. Savollar faqat "SINOV" matnli soxta yozuvlar.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000c1', 'ma@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000d1', 'mb@sinov.invalid', '{}');

-- M01: anon va oddiy foydalanuvchi huquqlari
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.mock_status();
    raise exception 'FAIL M01: anon mock_status ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.start_mock(null);
    raise exception 'FAIL M01: anon start_mock ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
end
$$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
begin
  begin
    perform * from public.admin_mock_readiness();
    raise exception 'FAIL M01: authenticated admin_mock_readiness ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.mock_attempts;
    raise exception 'FAIL M01: authenticated mock_attempts ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.mock_answers;
    raise exception 'FAIL M01: authenticated mock_answers ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK M01 huquqlar: anon yopiq, admin hisoboti va jadvallar mijozga yopiq';
end
$$;

-- M02: savol yetmasa mock ochilmaydi
do $$
declare
  s jsonb := public.mock_status();
begin
  if (s ->> 'ready')::boolean then
    raise exception 'FAIL M02: savolsiz ready = true';
  end if;
  begin
    perform public.start_mock(null);
    raise exception 'FAIL M02: savolsiz start_mock o''tdi';
  exception when object_not_in_prerequisite_state then
    if sqlerrm <> 'mock_not_ready' then raise; end if;
  end;
end
$$;
reset role;

do $$
declare
  n integer;
  m integer;
begin
  select count(*), count(*) filter (where missing > 0) into n, m from public.admin_mock_readiness();
  if n <> 38 or m <> 38 then
    raise exception 'FAIL M02: admin hisobotida 38 qator (30 ko''nikma + 8 soha) kutilgan, % / % yetishmaydi', n, m;
  end if;
  raise notice 'OK M02 tayyorlik: savol yetmasa mock_not_ready, admin hisobotida 30 ko''nikma + 8 soha';
end
$$;

-- Har ko'nikmaga 8 ta tasdiqlangan soxta savol (to'g'ri javob A); 'Circles' savollarida rasm.
insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, figure, status, author, verified_by)
select format('mk-%s-%s-%s', s.s_section, row_number() over (order by s.s_section, s.s_domain, s.s_skill), g.i),
       s.s_section, s.s_domain, s.s_skill, 1 + (g.i % 5), 'mcq', 'SINOV savol',
       '[{"key": "A", "text": "SINOV A"}, {"key": "B", "text": "SINOV B"}]', '{"choice": "A"}', 'SINOV izoh',
       case when s.s_skill = 'Circles' then jsonb_build_object('path', format('sinov/mk-%s.png', g.i), 'alt', 'SINOV') end,
       'draft', 'sinov', null
  from private.mock_skills() s
 cross join generate_series(1, 8) as g (i);

-- Bitta ko'nikma 7 ta bo'lsa hali tayyor emas
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'questions' and column_name = 'verified_at') then
    execute 'update public.questions set status = ''verified'', verified_by = ''sinov2'', verified_at = now() where external_id like ''mk-%''';
  else
    update public.questions set status = 'verified', verified_by = 'sinov2' where external_id like 'mk-%';
  end if;
  update public.questions set status = 'hidden'
   where id = (select id from public.questions where skill = 'Transitions' and external_id like 'mk-%' limit 1);
  if private.mock_is_ready() then
    raise exception 'FAIL M02: Transitions 7 ta bo''lsa ham ready';
  end if;
  if (select missing from public.admin_mock_readiness() where skill = 'Transitions') <> 1 then
    raise exception 'FAIL M02: Transitions uchun missing = 1 kutilgan';
  end if;
  update public.questions set status = 'verified' where skill = 'Transitions' and external_id like 'mk-%';
  if not private.mock_is_ready() then
    raise exception 'FAIL M02: 240 savol bilan ready = false';
  end if;
  raise notice 'OK M02b tayyorlik: N = 8, bitta ko''nikmada 7 ta bo''lsa yopiq, hisobot aniq ko''nikmani ko''rsatadi';
end
$$;

-- Kredit limiti sinovi uchun: Free da retake oyiga 1 ta
update public.plans set limits = limits || '{"mock_retake": {"max": 1, "per": "month"}}' where code = 'free';

-- M03: forma yig'iladi, javoblar oshkor emas
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  p  jsonb := public.start_mock(null);
  a  uuid := (p ->> 'attempt_id')::uuid;
begin
  perform set_config('mk.a1', a::text, true);
  perform set_config('mk.f1', p ->> 'form_id', true);
  if p ->> 'phase' <> 'ready' or (p ->> 'current_module')::integer <> 1 or p ->> 'kind' <> 'first' then
    raise exception 'FAIL M03: boshlang''ich holat noto''g''ri: %', p;
  end if;
  if jsonb_array_length(p -> 'questions') <> 0 then
    raise exception 'FAIL M03: modul boshlanmasdan savollar berildi';
  end if;
  if (select string_agg((m ->> 'question_count') || '/' || (m ->> 'time_ms'), ',' order by (m ->> 'module')::integer)
        from jsonb_array_elements(p -> 'modules') m) <> '27/1920000,27/1920000,22/2100000,22/2100000' then
    raise exception 'FAIL M03: modul savol soni yoki vaqti: %', p -> 'modules';
  end if;
  begin
    perform public.start_mock(null);
    raise exception 'FAIL M03: ikkinchi ochiq mock yaratildi';
  exception when object_not_in_prerequisite_state then
    if sqlerrm <> 'mock_in_progress' then raise; end if;
  end;
end
$$;
reset role;

do $$
declare
  f uuid := current_setting('mk.f1')::uuid;
  bad text;
begin
  select string_agg(format('%s %s: %s (kutilgan %s)', x.module, b.b_domain, coalesce(x.n, 0), b.b_per_module), '; ')
    into bad
    from private.mock_blueprint() b
    cross join (values (1), (2), (3), (4)) mm (module)
    left join lateral (
      select fq.module, count(*) as n from public.mock_form_questions fq
        join public.questions q on q.id = fq.question_id
       where fq.form_id = f and fq.module = mm.module and q.domain = b.b_domain
       group by fq.module
    ) x on true
   where private.mock_section(mm.module) = b.b_section
     and coalesce(x.n, 0) <> b.b_per_module;
  if bad is not null then
    raise exception 'FAIL M03: soha taqsimoti: %', bad;
  end if;
  perform set_config('mk.fig', (select q.figure ->> 'path' from public.questions q
                                  join public.mock_form_questions fq on fq.question_id = q.id
                                 where fq.form_id = f and q.figure is not null limit 1), true);
  if current_setting('mk.fig') is null or current_setting('mk.fig') = '' then
    raise exception 'FAIL M03: formada rasmli (Circles) savol yo''q';
  end if;
  if (select count(distinct question_id) from public.mock_form_questions where form_id = f) <> 98 then
    raise exception 'FAIL M03: formada 98 ta har xil savol emas';
  end if;
  raise notice 'OK M03 forma: 98 savol, modulda 27/27/22/22, soha taqsimoti blueprint bo''yicha, savollar boshlanmasdan berilmaydi, bitta ochiq mock';
end
$$;

-- M04: 1-modul: savollar javobsiz, saqlash, baholash, redo
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  a  uuid := current_setting('mk.a1')::uuid;
  p  jsonb := public.mock_start_module(a);
  p2 jsonb;
  qs uuid[];
  items jsonb;
  r  jsonb;
  dl timestamptz;
  st timestamptz;
begin
  if p ->> 'phase' <> 'module' or jsonb_array_length(p -> 'questions') <> 27 then
    raise exception 'FAIL M04: 1-modul ochilmadi: % savol', jsonb_array_length(p -> 'questions');
  end if;
  if exists (select 1 from jsonb_array_elements(p -> 'questions') e
              where e ? 'correct' or e ? 'explanation' or e ? 'skill' or e ? 'difficulty') then
    raise exception 'FAIL M04: modul savollarida javob yoki ko''nikma bor';
  end if;
  select (m ->> 'started_at')::timestamptz, (m ->> 'deadline_at')::timestamptz into st, dl
    from jsonb_array_elements(p -> 'modules') m where (m ->> 'module')::integer = 1;
  if dl - st <> interval '32 minutes' then
    raise exception 'FAIL M04: 1-modul muddati 32 daqiqa emas: %', dl - st;
  end if;
  -- takror start vaqtni o'zgartirmaydi
  p2 := public.mock_start_module(a);
  if (select (m ->> 'started_at')::timestamptz from jsonb_array_elements(p2 -> 'modules') m
       where (m ->> 'module')::integer = 1) <> st then
    raise exception 'FAIL M04: takror mock_start_module vaqtni qayta boshladi';
  end if;

  select array_agg((e ->> 'id')::uuid order by (e ->> 'position')::integer) into qs
    from jsonb_array_elements(p -> 'questions') e;
  -- 10 ta to'g'ri (A), 5 ta xato (B), 1 ta bo'sh; begona savol e'tiborsiz
  select jsonb_agg(jsonb_build_object('question_id', qs[i], 'answer', case when i <= 10 then 'A' else 'B' end,
                                      'flagged', i = 3, 'time_ms', 40000))
    into items from generate_series(1, 15) i;
  items := items || jsonb_build_array(jsonb_build_object('question_id', qs[16], 'answer', '  ', 'time_ms', 1000),
                                      jsonb_build_object('question_id', gen_random_uuid(), 'answer', 'A'));
  r := public.mock_save(a, items);
  if (r ->> 'saved')::integer <> 16 then
    raise exception 'FAIL M04: 16 ta saqlanishi kerak edi, %', r;
  end if;
  -- javob o'zgartiriladi (11-savol B → A), vaqt kamaymaydi
  r := public.mock_save(a, jsonb_build_array(jsonb_build_object('question_id', qs[11], 'answer', 'A', 'time_ms', 100)));
  p2 := public.get_mock(a);
  if jsonb_array_length(p2 -> 'answers') <> 16
     or not exists (select 1 from jsonb_array_elements(p2 -> 'answers') x
                     where (x ->> 'question_id')::uuid = qs[11] and x ->> 'answer' = 'A' and (x ->> 'time_ms')::integer = 40000)
     or not exists (select 1 from jsonb_array_elements(p2 -> 'answers') x
                     where (x ->> 'question_id')::uuid = qs[16] and x -> 'answer' = 'null'::jsonb) then
    raise exception 'FAIL M04: qoralama javoblar qayta ochilganda noto''g''ri: %', p2 -> 'answers';
  end if;
  begin
    perform public.mock_save(a, jsonb_build_array(jsonb_build_object('question_id', qs[1], 'answer', repeat('x', 101))));
    raise exception 'FAIL M04: 101 belgili javob qabul qilindi';
  exception when invalid_parameter_value then null;
  end;

  p2 := public.mock_submit_module(a, 1);
  if p2 ->> 'phase' <> 'ready' or (p2 ->> 'current_module')::integer <> 2 then
    raise exception 'FAIL M04: 1-moduldan keyin holat: % / %', p2 ->> 'phase', p2 ->> 'current_module';
  end if;
  -- takror topshirish hech narsani o'zgartirmaydi
  p2 := public.mock_submit_module(a, 1);
  if (p2 ->> 'current_module')::integer <> 2 or p2 ->> 'phase' <> 'ready' then
    raise exception 'FAIL M04: takror mock_submit_module holatni o''zgartirdi';
  end if;
  perform set_config('mk.q11', qs[11]::text, true);
  perform set_config('mk.q20', qs[20]::text, true);
end
$$;
reset role;

do $$
declare
  a uuid := current_setting('mk.a1')::uuid;
  s uuid;
begin
  select session_id into s from public.mock_modules where attempt_id = a and module = 1;
  if (select mode from public.practice_sessions where id = s) <> 'mock'
     or (select finished_at from public.practice_sessions where id = s) is null then
    raise exception 'FAIL M04: 1-modul uchun yakunlangan mock sessiyasi yo''q';
  end if;
  if (select count(*) from public.attempts where session_id = s) <> 15
     or (select count(*) from public.attempts where session_id = s and is_correct) <> 11
     or (select count(*) from public.attempts where session_id = s and flagged) <> 1 then
    raise exception 'FAIL M04: baholash: % javob, % to''g''ri',
      (select count(*) from public.attempts where session_id = s),
      (select count(*) from public.attempts where session_id = s and is_correct);
  end if;
  if (select count(*) from public.review_queue r join public.attempts at on at.question_id = r.question_id
       where at.session_id = s and not at.is_correct and r.user_id = '00000000-0000-4000-8000-0000000000c1' and r.box = 1) <> 4 then
    raise exception 'FAIL M04: 4 ta xato redo ro''yxatida bo''lishi kerak';
  end if;
  if (select count(*) from public.session_questions where session_id = s) <> 27 then
    raise exception 'FAIL M04: sessiyada 27 savol bo''lishi kerak (o''tkazilganlar uchun "Add to redo list")';
  end if;
  raise notice 'OK M04 1-modul: javobsiz savollar, qoralama saqlash va o''zgartirish, 15 javob baholandi (11 to''g''ri), 4 xato redo da, takror topshirish xavfsiz';
end
$$;

-- M05: uzilish: 2-modul boshlanadi, foydalanuvchi ketadi, muddat o'tadi; qaytganda modul o'zi yopiladi
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  a uuid := current_setting('mk.a1')::uuid;
  p jsonb := public.mock_start_module(a);
begin
  perform public.mock_save(a, jsonb_build_array(jsonb_build_object('question_id', (p -> 'questions' -> 0 ->> 'id')::uuid, 'answer', 'A')));
end
$$;
reset role;

-- Muddatdan oldin grace ichida (deadline + 10 s) saqlash hali ishlaydi; keyin muddat + 1 daqiqa o'tgan deb ko'rsatamiz
update public.mock_modules set started_at = now() - interval '32 minutes 10 seconds', deadline_at = now() - interval '10 seconds'
 where attempt_id = current_setting('mk.a1')::uuid and module = 2;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  a uuid := current_setting('mk.a1')::uuid;
  p jsonb := public.get_mock(a);
  r jsonb;
begin
  if p ->> 'phase' <> 'module' then
    raise exception 'FAIL M05: grace ichida modul yopildi';
  end if;
  r := public.mock_save(a, jsonb_build_array(jsonb_build_object('question_id', (p -> 'questions' -> 1 ->> 'id')::uuid, 'answer', 'A')));
  if (r ->> 'saved')::integer <> 1 then
    raise exception 'FAIL M05: grace ichida saqlanmadi';
  end if;
end
$$;
reset role;
update public.mock_modules set started_at = now() - interval '33 minutes', deadline_at = now() - interval '1 minute'
 where attempt_id = current_setting('mk.a1')::uuid and module = 2;
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  a uuid := current_setting('mk.a1')::uuid;
  r jsonb;
  p jsonb;
  m jsonb;
begin
  r := public.mock_save(a, jsonb_build_array(jsonb_build_object('question_id', current_setting('mk.q20')::uuid, 'answer', 'A')));
  if not coalesce((r ->> 'module_closed')::boolean, false) or (r ->> 'saved')::integer <> 0 then
    raise exception 'FAIL M05: muddatdan keyin javob qabul qilindi: %', r;
  end if;
  p := public.get_mock(a);
  select x into m from jsonb_array_elements(p -> 'modules') x where (x ->> 'module')::integer = 2;
  if p ->> 'phase' <> 'break' or (p ->> 'current_module')::integer <> 3
     or not (m ->> 'auto_submitted')::boolean
     or (m ->> 'submitted_at')::timestamptz <> (m ->> 'deadline_at')::timestamptz then
    raise exception 'FAIL M05: muddat o''tgach modul yopilmadi: % %', p ->> 'phase', m;
  end if;
  if jsonb_array_length(p -> 'questions') <> 0 then
    raise exception 'FAIL M05: tanaffusda savollar berildi';
  end if;
  raise notice 'OK M05 uzilish: grace (30 s) ichida saqlanadi, keyin rad etiladi, qaytganda modul muddat vaqti bilan avtomatik yopiladi, tanaffus boshlanadi';
end
$$;

-- M06: tanaffusdan keyin Math modullari, natija va taxminiy ball
do $$
declare
  a uuid := current_setting('mk.a1')::uuid;
  p jsonb;
  st timestamptz; dl timestamptz;
begin
  p := public.mock_start_module(a);
  select (m ->> 'started_at')::timestamptz, (m ->> 'deadline_at')::timestamptz into st, dl
    from jsonb_array_elements(p -> 'modules') m where (m ->> 'module')::integer = 3;
  if p ->> 'phase' <> 'module' or jsonb_array_length(p -> 'questions') <> 22 or dl - st <> interval '35 minutes' then
    raise exception 'FAIL M06: 3-modul: %, % savol, %', p ->> 'phase', jsonb_array_length(p -> 'questions'), dl - st;
  end if;
  begin
    perform public.get_mock_result(a);
    raise exception 'FAIL M06: tugamagan mock natijasi berildi';
  exception when object_not_in_prerequisite_state then null;
  end;
  perform public.mock_submit_module(a, 3);
  perform public.mock_start_module(a);
  p := public.mock_submit_module(a, 4);
  if p ->> 'status' <> 'finished' or p ->> 'phase' <> 'done' then
    raise exception 'FAIL M06: 4-moduldan keyin tugamadi: %', p ->> 'status';
  end if;
  -- R&W: 1-modulda 11 + 2-modulda 2 = 13 / 54 → 200 + round(60 × 13 / 54) × 10 = 340; Math 0 / 44 → 200
  if (p -> 'scores' -> 'rw' ->> 'correct')::integer <> 13 or (p -> 'scores' -> 'rw' ->> 'score')::integer <> 340
     or (p -> 'scores' -> 'math' ->> 'score')::integer <> 200 or (p -> 'scores' ->> 'total')::integer <> 540
     or not (p -> 'scores' ->> 'estimate')::boolean then
    raise exception 'FAIL M06: ball: %', p -> 'scores';
  end if;
  p := public.get_mock_result(a);
  if jsonb_array_length(p -> 'questions') <> 98
     or exists (select 1 from jsonb_array_elements(p -> 'questions') e where not (e ? 'correct' and e ? 'explanation')) then
    raise exception 'FAIL M06: natijada 98 savol va to''g''ri javoblar bo''lishi kerak';
  end if;
  if (select count(*) from jsonb_array_elements(p -> 'questions') e where (e ->> 'in_review')::boolean) <> 4 then
    raise exception 'FAIL M06: natijada 4 ta redo kutilgan';
  end if;
  if not public.can_read_question_figure(current_setting('mk.fig')) then
    raise exception 'FAIL M06: mock savoli rasmini o''qib bo''lmadi';
  end if;
  raise notice 'OK M06 natija: 3–4-modul (35 daq), taxminiy ball 340 + 200 = 540, natijada 98 savol, redo holati, rasm huquqi';
end
$$;

-- M07: retake, kreditlar, abandon
do $$
declare
  f uuid := current_setting('mk.f1')::uuid;
  p jsonb;
  s jsonb;
begin
  p := public.start_mock(f);
  if p ->> 'kind' <> 'retake' or (p ->> 'form_id')::uuid <> f then
    raise exception 'FAIL M07: retake o''sha formada emas';
  end if;
  perform public.mock_start_module((p ->> 'attempt_id')::uuid);
  p := public.mock_abandon((p ->> 'attempt_id')::uuid);
  if p ->> 'status' <> 'abandoned' or p -> 'scores' <> 'null'::jsonb then
    raise exception 'FAIL M07: abandon: % %', p ->> 'status', p -> 'scores';
  end if;
  s := public.mock_status();
  if s -> 'active' <> 'null'::jsonb or jsonb_array_length(s -> 'history') <> 2
     or (s -> 'credits' -> 'mock_first' ->> 'used')::integer <> 1
     or (s -> 'credits' -> 'mock_retake' ->> 'used')::integer <> 1
     or (s -> 'credits' -> 'mock_retake' ->> 'max')::integer <> 1
     or s -> 'credits' -> 'mock_first' -> 'max' <> 'null'::jsonb then
    raise exception 'FAIL M07: mock_status: %', s;
  end if;
  begin
    perform public.start_mock(f);
    raise exception 'FAIL M07: retake krediti tugaganda ham ochildi';
  exception when raise_exception then
    if sqlerrm <> 'quota_exceeded' then raise; end if;
  end;
  raise notice 'OK M07 kreditlar: retake o''sha forma, mock_first va mock_retake alohida sanaladi, limit tugasa quota_exceeded; abandon ball bermaydi';
end
$$;

-- M08: ikkinchi forma ko'rilmagan savollarni afzal ko'radi
do $$
declare
  p  jsonb := public.start_mock(null);
  f2 uuid := (p ->> 'form_id')::uuid;
  ov integer;
begin
  if (p ->> 'form_no')::integer <> 2 then
    raise exception 'FAIL M08: form_no 2 emas';
  end if;
  perform set_config('mk.f2', f2::text, true);
  perform set_config('mk.a2', p ->> 'attempt_id', true);
end
$$;
reset role;
do $$
declare
  ov integer;
begin
  -- Information and Ideas: 32 savol, formaga 14 kerak → ikkinchi forma birinchisi bilan kesishmaydi
  select count(*) into ov from public.mock_form_questions a
    join public.mock_form_questions b on b.question_id = a.question_id
    join public.questions q on q.id = a.question_id
   where a.form_id = current_setting('mk.f1')::uuid and b.form_id = current_setting('mk.f2')::uuid
     and q.domain = 'Information and Ideas';
  if ov <> 0 then
    raise exception 'FAIL M08: ikkinchi forma ko''rilgan savollarni oldi (% ta)', ov;
  end if;
  raise notice 'OK M08 ikkinchi forma: ko''rilmagan savollar afzal (Information and Ideas da kesishma 0)';
end
$$;

-- M09: begona foydalanuvchi
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000d1", "role": "authenticated"}', true) \gset
do $$
begin
  begin
    perform public.get_mock(current_setting('mk.a2')::uuid);
    raise exception 'FAIL M09: B foydalanuvchi A ning mockini ochdi';
  exception when no_data_found then null;
  end;
  begin
    perform public.get_mock_result(current_setting('mk.a1')::uuid);
    raise exception 'FAIL M09: B foydalanuvchi A ning natijasini oldi';
  exception when no_data_found then null;
  end;
  begin
    perform public.start_mock(current_setting('mk.f1')::uuid);
    raise exception 'FAIL M09: B foydalanuvchi A ning formasini retake qildi';
  exception when no_data_found then null;
  end;
  if public.can_read_question_figure(current_setting('mk.fig')) then
    raise exception 'FAIL M09: B foydalanuvchi savol rasmini o''qidi';
  end if;
  if jsonb_array_length(public.mock_status() -> 'history') <> 0 then
    raise exception 'FAIL M09: B tarixida A ning urinishlari';
  end if;
  raise notice 'OK M09 begona: get_mock, natija, retake va rasm yopiq';
end
$$;
reset role;

-- M10: formadagi savol yashirilsa retake ochilmaydi
update public.questions set status = 'hidden'
 where id = (select question_id from public.mock_form_questions where form_id = current_setting('mk.f2')::uuid limit 1);
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
begin
  perform public.mock_abandon(current_setting('mk.a2')::uuid);
  begin
    perform public.start_mock(current_setting('mk.f2')::uuid);
    raise exception 'FAIL M10: yashirilgan savolli forma retake qilindi';
  exception when object_not_in_prerequisite_state then
    if sqlerrm <> 'mock_form_unavailable' then raise; end if;
  end;
  raise notice 'OK M10 yashirilgan savol: forma retake uchun yopiladi';
end
$$;
reset role;

do $$ begin raise notice 'MOCK SINOVLARI O''TDI'; end $$;

rollback;
