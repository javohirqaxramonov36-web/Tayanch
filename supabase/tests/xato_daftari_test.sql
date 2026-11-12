-- P09 Xato daftari sinovlari (20261111233000_xato_daftari): review_overview, review_preview, reason_tag tegi,
-- bookmarks, va to'liq oqim xato → due → to'g'ri → mastered (submit_answer + start_review_session, 1/3/7/14 kun).
-- sessiya_test.sql kabi: bitta tranzaksiya, oxirida ROLLBACK. Sinov savollari faqat "SINOV" matnli soxta yozuvlar.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000c1', 'xa@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000d1', 'xb@sinov.invalid', '{}');

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, passage, stem, options, correct, explanation, figure, status, author, verified_by)
values
  ('xd-math-1', 'math', 'XD-domain', 'XD-skill-m', 2, 'mcq', null, 'SINOV <b>savol</b>   bir',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]',
   '{"choice": "B"}', 'SINOV izoh 1', null, 'draft', 'sinov', null),
  ('xd-rw-1', 'rw', 'XD-domain-rw', 'XD-skill-r', 1, 'mcq', 'SINOV parcha matni', 'SINOV savol ikki',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]',
   '{"choice": "A"}', 'SINOV izoh 2', null, 'draft', 'sinov', null),
  ('xd-math-2', 'math', 'XD-domain', 'XD-skill-m', 3, 'mcq', null, 'SINOV savol uch',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]',
   '{"choice": "A"}', 'SINOV izoh 3', null, 'draft', 'sinov', null);

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'questions' and column_name = 'verified_at') then
    execute 'update public.questions set status = ''verified'', verified_by = ''sinov2'', verified_at = now() where external_id like ''xd-%''';
  else
    update public.questions set status = 'verified', verified_by = 'sinov2' where external_id like 'xd-%';
  end if;
end
$$;

select set_config('xd.q_m1', (select id::text from public.questions where external_id = 'xd-math-1'), true),
       set_config('xd.q_r1', (select id::text from public.questions where external_id = 'xd-rw-1'), true),
       set_config('xd.q_m2', (select id::text from public.questions where external_id = 'xd-math-2'), true),
       set_config('xd.bugun', private.today_tashkent()::text, true)
\gset

-- X01 anon
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.review_overview();
    raise exception 'FAIL X01: anon review_overview ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.review_preview(gen_random_uuid());
    raise exception 'FAIL X01: anon review_preview ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK X01 anon: review_overview, review_preview yopiq';
end
$$;
reset role;

-- A: xato javob → navbat; ro'yxatda qisqa ko'rinish, javobsiz
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  m1 uuid := current_setting('xd.q_m1')::uuid;
  r1 uuid := current_setting('xd.q_r1')::uuid;
  m2 uuid := current_setting('xd.q_m2')::uuid;
  r  jsonb;
  o  jsonb;
  it jsonb;
  sid uuid;
  bugun date := current_setting('xd.bugun')::date;
begin
  o := public.review_overview();
  if jsonb_array_length(o -> 'items') <> 0 or (o ->> 'today')::date <> bugun then
    raise exception 'FAIL X02: bo''sh ro''yxat kutilgan: %', o;
  end if;

  r := public.start_session('{"domains": ["XD-domain", "XD-domain-rw"]}'::jsonb, 10, 'practice');
  sid := (r ->> 'session_id')::uuid;
  perform public.submit_answer(sid, m1, 'A', 1000);  -- xato
  perform public.submit_answer(sid, r1, 'B', 1000);  -- xato
  perform public.submit_answer(sid, m2, 'A', 1000);  -- to'g'ri: navbatga tushmaydi

  o := public.review_overview();
  if jsonb_array_length(o -> 'items') <> 2 then
    raise exception 'FAIL X02: 2 ta xato kutilgan, keldi %', o;
  end if;
  select e into it from jsonb_array_elements(o -> 'items') e where e ->> 'question_id' = m1::text;
  if (it ->> 'box')::int <> 1 or (it ->> 'next_due')::date <> bugun + 1 or not (it ->> 'in_queue')::boolean
     or (it ->> 'bookmarked')::boolean or it ->> 'preview' <> 'SINOV savol bir' then
    raise exception 'FAIL X02: m1 qatori noto''g''ri: %', it;
  end if;
  select e into it from jsonb_array_elements(o -> 'items') e where e ->> 'question_id' = r1::text;
  if it ->> 'preview' <> 'SINOV parcha matni' then
    raise exception 'FAIL X02: R&W qisqa ko''rinishi parchadan bo''lishi kerak: %', it;
  end if;
  if position('SINOV izoh' in o::text) > 0 or position('"choice"' in o::text) > 0 or position('"correct"' in o::text) > 0 then
    raise exception 'FAIL X02: ro''yxatda javob yoki tushuntirish bor';
  end if;
  raise notice 'OK X02 review_overview: xatolar 1-qutida, ertaga; qisqa ko''rinish HTML''siz; javob va izoh yo''q';

  -- X03 ertaga kelmagan: due emas
  r := public.start_review_session(null);
  if r -> 'session_id' <> 'null'::jsonb then
    raise exception 'FAIL X03: muddati kelmagan savol bilan review sessiya ochildi: %', r;
  end if;
  raise notice 'OK X03 start_review_session: due bo''lmasa sessiya yo''q';

  -- X04 teg va izoh
  update public.review_queue set reason_tag = 'other', note = 'SINOV izohim' where question_id = m1;
  begin
    update public.review_queue set reason_tag = 'bilmadim' where question_id = m1;
    raise exception 'FAIL X04: ruxsatsiz teg yozildi';
  exception when check_violation then null;
  end;
  o := public.review_overview();
  select e into it from jsonb_array_elements(o -> 'items') e where e ->> 'question_id' = m1::text;
  if it ->> 'reason_tag' <> 'other' or it ->> 'note' <> 'SINOV izohim' then
    raise exception 'FAIL X04: teg yoki izoh saqlanmadi: %', it;
  end if;
  raise notice 'OK X04 reason_tag: 5 ta tegdan biri (other) va izoh saqlanadi, boshqa teg rad etiladi';

  -- X05 saqlangan savol (navbatda emas) va preview
  insert into public.bookmarks (question_id) values (m2);
  o := public.review_overview();
  select e into it from jsonb_array_elements(o -> 'items') e where e ->> 'question_id' = m2::text;
  if it is null or (it ->> 'in_queue')::boolean or not (it ->> 'bookmarked')::boolean or it -> 'box' <> 'null'::jsonb then
    raise exception 'FAIL X05: saqlangan savol qatori noto''g''ri: %', it;
  end if;
  r := public.review_preview(m2);
  if r ->> 'stem' <> 'SINOV savol uch' or jsonb_array_length(r -> 'options') <> 2
     or position('SINOV izoh' in r::text) > 0 or position('"choice"' in r::text) > 0 then
    raise exception 'FAIL X05: preview matni yoki javobsizligi noto''g''ri: %', r;
  end if;
  delete from public.bookmarks where question_id = m2;
  begin
    perform public.review_preview(m2);
    raise exception 'FAIL X05: ro''yxatda yo''q savol ochildi';
  exception when sqlstate 'P0002' then null;
  end;
  raise notice 'OK X05 bookmarks + review_preview: saqlangan savol ro''yxatda, matn javobsiz; ro''yxatdan chiqqach ochilmaydi';
end
$$;
reset role;

-- X06 to'liq oqim: due → to'g'ri (2-quti, +3) → (3, +7) → (4, +14) → mastered (5). Sanani superuser surib qo'yadi.
do $$
declare
  m1 uuid := current_setting('xd.q_m1')::uuid;
  bugun date := private.today_tashkent();
  kutilgan_quti int[] := array[2, 3, 4, 5];
  kutilgan_oraliq int[] := array[3, 7, 14, 0];
  r jsonb;
  sid uuid;
  q record;
begin
  for i in 1..4 loop
    update public.review_queue set next_due = bugun where question_id = m1 and user_id = '00000000-0000-4000-8000-0000000000c1';
    perform set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true);
    set local role authenticated;
    r := public.start_review_session(null);
    sid := (r ->> 'session_id')::uuid;
    if sid is null or jsonb_array_length(r -> 'questions') <> 1 or r -> 'questions' -> 0 ->> 'id' <> m1::text then
      raise exception 'FAIL X06: %-qadam: review sessiyada faqat due m1 kutilgan: %', i, r;
    end if;
    perform public.submit_answer(sid, m1, 'B', 1000);
    reset role;
    select box, next_due into q from public.review_queue where question_id = m1 and user_id = '00000000-0000-4000-8000-0000000000c1';
    if q.box <> kutilgan_quti[i] or q.next_due <> bugun + kutilgan_oraliq[i] then
      raise exception 'FAIL X06: %-qadam: quti % / sana % kutilgan, keldi % / %', i, kutilgan_quti[i], bugun + kutilgan_oraliq[i], q.box, q.next_due;
    end if;
  end loop;

  -- mastered: due ro'yxatga kirmaydi
  update public.review_queue set next_due = bugun - 1 where question_id = m1;
  perform set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true);
  set local role authenticated;
  r := public.start_review_session(null);
  if exists (select 1 from jsonb_array_elements(r -> 'questions') e where e ->> 'id' = m1::text) then
    raise exception 'FAIL X06: mastered savol review sessiyaga tushdi';
  end if;
  reset role;
  raise notice 'OK X06 oqim: xato → due → to''g''ri ×4 → 2/3/4/5-quti, oraliqlar 3/7/14 kun; mastered due emas';
end
$$;

-- X07 B: A ning ro'yxatini ko'rmaydi va ocha olmaydi
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000d1", "role": "authenticated"}', true) \gset
do $$
begin
  if jsonb_array_length(public.review_overview() -> 'items') <> 0 then
    raise exception 'FAIL X07: B A ning ro''yxatini ko''rdi';
  end if;
  begin
    perform public.review_preview(current_setting('xd.q_m1')::uuid);
    raise exception 'FAIL X07: B A ning savolini ochdi';
  exception when sqlstate 'P0002' then null;
  end;
  if (select count(*) from public.review_queue) <> 0 then
    raise exception 'FAIL X07: B review_queue da A qatorlarini ko''rdi (RLS)';
  end if;
  raise notice 'OK X07 B: A ro''yxatini ko''rmaydi, savolini ocha olmaydi';
end
$$;
reset role;

do $$ begin raise notice 'XATO DAFTARI SINOVLARI O''TDI'; end $$;

rollback;
