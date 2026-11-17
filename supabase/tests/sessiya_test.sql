-- P08 sessiya RPC sinovlari (20261110120000_sessiya): get_session, finish_session, add_to_review, submit_answer o'zgarishlari.
-- rls_test.sql kabi: bitta tranzaksiya, oxirida ROLLBACK. Sinov savollari faqat "SINOV" matnli soxta yozuvlar.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000a1', 'sa@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000b1', 'sb@sinov.invalid', '{}');

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, figure, status, author, verified_by)
values
  ('ss-math-1', 'math', 'SS-domain', 'SS-skill-m', 2, 'mcq', 'SINOV savol 1',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]',
   '{"choice": "B"}', 'SINOV izoh 1', null, 'draft', 'sinov', null),
  ('ss-math-2', 'math', 'SS-domain', 'SS-skill-m', 3, 'spr', 'SINOV savol 2',
   null, '{"accepted": ["1/2"]}', 'SINOV izoh 2', null, 'draft', 'sinov', null),
  ('ss-rw-1', 'rw', 'SS-domain-rw', 'SS-skill-r', 1, 'mcq', 'SINOV savol 3',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]',
   '{"choice": "A"}', 'SINOV izoh 3', null, 'draft', 'sinov', null);

-- Tasdiqlash: PR #65 (questions_p05) sxemasida verified_at ham majburiy; ustun bo'lmasa (main) faqat status.
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'questions' and column_name = 'verified_at') then
    execute 'update public.questions set status = ''verified'', verified_by = ''sinov2'', verified_at = now() where external_id like ''ss-%''';
  else
    update public.questions set status = 'verified', verified_by = 'sinov2' where external_id like 'ss-%';
  end if;
end
$$;

select set_config('ss.q_m1', (select id::text from public.questions where external_id = 'ss-math-1'), true),
       set_config('ss.q_m2', (select id::text from public.questions where external_id = 'ss-math-2'), true),
       set_config('ss.q_r1', (select id::text from public.questions where external_id = 'ss-rw-1'), true)
\gset

-- Anonim
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.get_session(gen_random_uuid());
    raise exception 'FAIL S01: anon get_session ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.finish_session(gen_random_uuid());
    raise exception 'FAIL S01: anon finish_session ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.add_to_review(gen_random_uuid());
    raise exception 'FAIL S01: anon add_to_review ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK S01 anon: get_session, finish_session, add_to_review yopiq';
end
$$;
reset role;

-- Foydalanuvchi A
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true) \gset

do $$
declare
  m1  uuid := current_setting('ss.q_m1')::uuid;
  m2  uuid := current_setting('ss.q_m2')::uuid;
  r1  uuid := current_setting('ss.q_r1')::uuid;
  r   jsonb;
  g   jsonb;
  sid uuid;
  pid uuid;
begin
  -- Taymerli sessiya: 2 Math + 1 R&W
  r := public.start_session('{"domains": ["SS-domain", "SS-domain-rw"]}'::jsonb, 10, 'timed');
  sid := (r ->> 'session_id')::uuid;
  perform set_config('ss.sid', sid::text, true);

  g := public.get_session(sid);
  if jsonb_array_length(g -> 'questions') <> 3 or g ->> 'mode' <> 'timed' then
    raise exception 'FAIL S02: get_session savollari yoki rejimi noto''g''ri: %', g;
  end if;
  if position('SINOV izoh' in (g -> 'questions')::text) > 0 or position('"choice"' in g::text) > 0
     or position('"accepted"' in g::text) > 0 then
    raise exception 'FAIL S02: javobsiz savollarda to''g''ri javob yoki izoh bor';
  end if;
  if jsonb_array_length(g -> 'results') <> 0 or g -> 'finished_at' <> 'null'::jsonb then
    raise exception 'FAIL S02: yangi sessiyada natija yoki finished_at bor';
  end if;
  -- 2 × 4200000/44 + 3840000/54 = 262 020,2 ms → 263 000 (yuqoriga yaxlitlanadi)
  if (g ->> 'time_limit_ms')::integer <> 263000 then
    raise exception 'FAIL S02: time_limit_ms 263000 kutilgan, keldi %', g ->> 'time_limit_ms';
  end if;
  if g ->> 'server_now' is null then
    raise exception 'FAIL S02: server_now yo''q';
  end if;
  raise notice 'OK S02 get_session: javobsiz savollar, natija bo''sh, taymer chegarasi CB03 bo''yicha (263000 ms)';

  -- Qayta ochish yangi savol bermaydi va kvota sarflamaydi
  if (select count(*) from public.practice_sessions where user_id = '00000000-0000-4000-8000-0000000000a1') <> 1 then
    raise exception 'FAIL S03: get_session yangi sessiya yaratdi';
  end if;
  raise notice 'OK S03 get_session: yangi sessiya yaratmaydi';

  -- Xato javob → results da to'g'ri javob va izoh, review da savol
  r := public.submit_answer(sid, m1, 'A', 4200);
  if (r ->> 'is_correct')::boolean or r ->> 'already_answered' <> 'false' then
    raise exception 'FAIL S04: xato javob noto''g''ri baholandi: %', r;
  end if;
  r := public.submit_answer(sid, m1, 'B', 10);
  if r ->> 'already_answered' <> 'true' or (r ->> 'is_correct')::boolean then
    raise exception 'FAIL S04: takror yuborish saqlangan natijani qaytarmadi: %', r;
  end if;
  g := public.get_session(sid);
  if jsonb_array_length(g -> 'results') <> 1
     or g -> 'results' -> 0 ->> 'answer' <> 'A'
     or g -> 'results' -> 0 ->> 'correct' <> 'B'
     or g -> 'results' -> 0 ->> 'explanation' <> 'SINOV izoh 1'
     or (g -> 'results' -> 0 ->> 'time_ms')::integer <> 4200 then
    raise exception 'FAIL S04: results noto''g''ri: %', g -> 'results';
  end if;
  if position('SINOV izoh 2' in g::text) > 0 or position('SINOV izoh 3' in g::text) > 0 then
    raise exception 'FAIL S04: javob berilmagan savol izohi chiqdi';
  end if;
  if jsonb_array_length(g -> 'review') <> 1 or g -> 'review' -> 0 ->> 'question_id' <> m1::text then
    raise exception 'FAIL S04: xato savol review da yo''q: %', g -> 'review';
  end if;
  raise notice 'OK S04 submit_answer: takror yuborish idempotent; get_session faqat javob berilgan savol izohini beradi';

  -- Xato sababi tegi (jadvalga to'g'ridan-to'g'ri, RLS) get_session da ko'rinadi
  update public.review_queue set reason_tag = 'misread' where question_id = m1;
  if public.get_session(sid) -> 'review' -> 0 ->> 'reason_tag' <> 'misread' then
    raise exception 'FAIL S05: reason_tag get_session da yo''q';
  end if;
  raise notice 'OK S05 reason_tag: saqlanadi va get_session da qaytadi';

  -- add_to_review: javob berilmagan savol; takror chaqirish xavfsiz; begona savol rad etiladi
  perform public.add_to_review(r1);
  perform public.add_to_review(r1);
  if (select count(*) from public.review_queue where question_id = r1) <> 1
     or (select box from public.review_queue where question_id = r1) <> 1 then
    raise exception 'FAIL S06: add_to_review navbatga to''g''ri qo''ymadi';
  end if;
  begin
    perform public.add_to_review(gen_random_uuid());
    raise exception 'FAIL S06: sessiyada bo''lmagan savol qo''shildi';
  exception when sqlstate 'P0002' then null;
  end;
  if jsonb_array_length(public.get_session(sid) -> 'review') <> 2 then
    raise exception 'FAIL S06: review da 2 ta savol kutilgan';
  end if;
  raise notice 'OK S06 add_to_review: navbatga qo''yadi, takror xavfsiz, begona savol rad etiladi';

  -- finish_session: o'tkazilgan savol qolsa ham yakunlaydi; keyin yangi javob qabul qilinmaydi
  r := public.finish_session(sid);
  if r ->> 'finished_at' is null then
    raise exception 'FAIL S07: finish_session finished_at bermadi';
  end if;
  if public.finish_session(sid) ->> 'finished_at' <> r ->> 'finished_at' then
    raise exception 'FAIL S07: takror finish_session vaqtni o''zgartirdi';
  end if;
  begin
    perform public.submit_answer(sid, m2, '1/2', 100);
    raise exception 'FAIL S07: yakunlangan sessiyaga javob qabul qilindi';
  exception when sqlstate '55000' then null;
  end;
  if (public.submit_answer(sid, m1, 'B', 1) ->> 'already_answered') <> 'true' then
    raise exception 'FAIL S07: yakunlangan sessiyada eski natija qaytmadi';
  end if;
  if public.get_session(sid) ->> 'finished_at' is null then
    raise exception 'FAIL S07: get_session finished_at bermadi';
  end if;
  raise notice 'OK S07 finish_session: yakunlaydi, takror xavfsiz, keyin yangi javob yo''q (eski natija qaytadi)';

  -- Taymersiz sessiya: chegara yo'q; hammasiga javob berilganda o'zi yakunlanadi
  r := public.start_session('{"domains": ["SS-domain-rw"]}'::jsonb, 1, 'practice');
  pid := (r ->> 'session_id')::uuid;
  perform set_config('ss.pid', pid::text, true);
  if public.get_session(pid) -> 'time_limit_ms' <> 'null'::jsonb then
    raise exception 'FAIL S08: practice sessiyada time_limit_ms bor';
  end if;
  perform public.submit_answer(pid, r1, 'A', 900);
  if public.get_session(pid) ->> 'finished_at' is null then
    raise exception 'FAIL S08: hamma savolga javobdan keyin sessiya yakunlanmadi';
  end if;
  raise notice 'OK S08 practice: time_limit_ms yo''q, oxirgi javobdan keyin finished_at';
end
$$;
reset role;

-- Foydalanuvchi B: A sessiyasini ocha, yakunlay olmaydi
set local role authenticated;
select set_config('request.jwt.claims',
  '{"sub": "00000000-0000-4000-8000-0000000000b1", "role": "authenticated"}', true) \gset
do $$
declare
  sid uuid := current_setting('ss.sid')::uuid;
begin
  begin
    perform public.get_session(sid);
    raise exception 'FAIL S09: B A sessiyasini ochdi';
  exception when sqlstate 'P0002' then null;
  end;
  begin
    perform public.finish_session(current_setting('ss.pid')::uuid);
    raise exception 'FAIL S09: B A sessiyasini yakunladi';
  exception when sqlstate 'P0002' then null;
  end;
  begin
    perform public.add_to_review(current_setting('ss.q_m1')::uuid);
    raise exception 'FAIL S09: B o''ziga berilmagan savolni navbatga qo''ydi';
  exception when sqlstate 'P0002' then null;
  end;
  raise notice 'OK S09 B: A sessiyasini ocha olmaydi, yakunlay olmaydi, unga berilmagan savolni navbatga qo''ya olmaydi';
end
$$;
reset role;

do $$ begin raise notice 'SESSIYA SINOVLARI O''TDI'; end $$;

rollback;
