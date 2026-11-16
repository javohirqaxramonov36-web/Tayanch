-- P26 sinovi (20261116094217_cheklovlar_p26, K6): bookmark faqat ko'rilgan savolga.
-- Kunlik chegaralar boshqa sinovlarda: reports/feedback xabar_test.sql (P24), events metrikalar_test.sql (P25).
-- Bitta tranzaksiya, oxirida ROLLBACK. Sinov savollari faqat "SINOV" matnli soxta yozuvlar.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000c1', 'c1@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000c2', 'c2@sinov.invalid', '{}');

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, status, author, verified_by, verified_at)
select 'sinov-chk-' || g, 'math', 'SINOV-domain', 'SINOV-skill', 2, 'mcq', 'SINOV savol ' || g,
       '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "A"}', 'SINOV',
       'verified', 'sinov-muallif', 'sinov-tekshiruvchi', now()
  from generate_series(1, 4) g;

-- A: chk-1 sessiyada, chk-2 takrorlash navbatida, chk-3 javoblarida; chk-4 ni hech kim ko'rmagan.
-- B: hech narsa ko'rmagan.
with s as (
  insert into public.practice_sessions (user_id, mode) values ('00000000-0000-4000-8000-0000000000c1', 'practice')
  returning id
), sq as (
  insert into public.session_questions (session_id, question_id, position)
  select s.id, q.id, 1 from s, public.questions q where q.external_id = 'sinov-chk-1'
  returning session_id
)
insert into public.attempts (user_id, session_id, question_id, answer, is_correct, time_ms, question_version)
select '00000000-0000-4000-8000-0000000000c1', (select session_id from sq), q.id, 'B', false, 1000, q.version
  from public.questions q where q.external_id = 'sinov-chk-3';

insert into public.review_queue (user_id, question_id, box, next_due)
select '00000000-0000-4000-8000-0000000000c1', q.id, 1, current_date
  from public.questions q where q.external_id = 'sinov-chk-2';

select set_config('test.c_q1', (select id::text from public.questions where external_id = 'sinov-chk-1'), true),
       set_config('test.c_q2', (select id::text from public.questions where external_id = 'sinov-chk-2'), true),
       set_config('test.c_q3', (select id::text from public.questions where external_id = 'sinov-chk-3'), true),
       set_config('test.c_q4', (select id::text from public.questions where external_id = 'sinov-chk-4'), true) \gset

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset

do $$
begin
  insert into public.bookmarks (question_id) values (current_setting('test.c_q1')::uuid);
  insert into public.bookmarks (question_id) values (current_setting('test.c_q2')::uuid);
  insert into public.bookmarks (question_id) values (current_setting('test.c_q3')::uuid);
  raise notice 'OK C01 bookmark: sessiyadagi, takrorlash navbatidagi va javob berilgan savolga yoziladi';

  begin
    insert into public.bookmarks (question_id) values (current_setting('test.c_q4')::uuid);
    raise exception 'FAIL C02: ko''rilmagan savolga bookmark yozildi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.bookmarks (question_id) values (gen_random_uuid());
    raise exception 'FAIL C02: mavjud bo''lmagan savolga bookmark yozildi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK C02 bookmark: ko''rilmagan yoki noma''lum savolni RLS rad etadi';
end
$$;

-- B: A ko'rgan savollar B uchun "ko'rilgan" emas
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c2", "role": "authenticated"}', true) \gset
do $$
begin
  begin
    insert into public.bookmarks (question_id) values (current_setting('test.c_q1')::uuid);
    raise exception 'FAIL C03: B A ning sessiya savolini saqladi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.bookmarks (user_id, question_id)
    values ('00000000-0000-4000-8000-0000000000c1', current_setting('test.c_q1')::uuid);
    raise exception 'FAIL C03: B A nomidan bookmark yozdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK C03 B: A ko''rgan savolni ham, A nomidan ham saqlay olmaydi';
end
$$;

reset role;
do $$ begin raise notice 'CHEKLOV SINOVLARI O''TDI'; end $$;
rollback;
