-- P26 cheklov sinovlari (20261112143817_cheklovlar_p26): events kunlik chegarasi (K3) va bookmark sharti (K6).
-- reports/feedback chegarasi P24 sinovida (xabar_test.sql). Parallel so'rovlar: scripts/rls-tekshir.sh oxirida.
-- Bitta tranzaksiya, oxirida ROLLBACK. Sinov savollari faqat "SINOV" matnli soxta yozuvlar.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000c1', 'c1@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000c2', 'c2@sinov.invalid', '{}');

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, status, author, verified_by, verified_at)
values
  ('sinov-chk-1', 'math', 'SINOV-domain', 'SINOV-skill', 2, 'mcq', 'SINOV savol 1',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "A"}', 'SINOV', 'verified', 'sinov-muallif', 'sinov-tekshiruvchi', now()),
  ('sinov-chk-2', 'math', 'SINOV-domain', 'SINOV-skill', 2, 'mcq', 'SINOV savol 2',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "A"}', 'SINOV', 'verified', 'sinov-muallif', 'sinov-tekshiruvchi', now());

-- A sinov-chk-1 ni sessiyada ko'rgan; B ham chk-1 ni ko'rgan; chk-2 ni hech kim ko'rmagan.
with s as (
  insert into public.practice_sessions (user_id, mode)
  values ('00000000-0000-4000-8000-0000000000c1', 'practice'), ('00000000-0000-4000-8000-0000000000c2', 'practice')
  returning id
)
insert into public.session_questions (session_id, question_id, position)
select s.id, q.id, 1 from s, public.questions q where q.external_id = 'sinov-chk-1';

select set_config('test.c_q1', (select id::text from public.questions where external_id = 'sinov-chk-1'), true),
       set_config('test.c_q2', (select id::text from public.questions where external_id = 'sinov-chk-2'), true) \gset

-- Foydalanuvchi A
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset

do $$
declare
  q1 uuid := current_setting('test.c_q1')::uuid;
  q2 uuid := current_setting('test.c_q2')::uuid;
  i  integer;
begin
  -- C01 K6: bookmark faqat ko'rilgan savolga
  insert into public.bookmarks (question_id) values (q1);
  begin
    insert into public.bookmarks (question_id) values (q2);
    raise exception 'FAIL C01: ko''rilmagan savolga bookmark yozildi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.bookmarks (question_id) values (gen_random_uuid());
    raise exception 'FAIL C01: mavjud bo''lmagan savolga bookmark yozildi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK C01 bookmark: ko''rilgan savolga yoziladi, ko''rilmagan yoki noma''lum savolni RLS rad etadi';

  -- C02 K3: events kuniga 500
  for i in 1..500 loop
    insert into public.events (name) values ('sinov.event');
  end loop;
  begin
    insert into public.events (name) values ('sinov.event');
    raise exception 'FAIL C02: 501-event o''tdi';
  exception when raise_exception then
    if sqlerrm <> 'events_rate_limited' then raise; end if;
  end;
  raise notice 'OK C02 events: 500 ta o''tdi, 501-si events_rate_limited';
end
$$;

-- Foydalanuvchi B: hisob alohida, B ham o'zi ko'rgan savolni saqlay oladi
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c2", "role": "authenticated"}', true) \gset
do $$
begin
  insert into public.events (name) values ('sinov.event');
  insert into public.bookmarks (question_id) values (current_setting('test.c_q1')::uuid);
  raise notice 'OK C03 B: A chegarasi B ga ta''sir qilmaydi';
end
$$;

-- Kecha yozilganlar bugungi chegaraga kirmaydi (superuser vaqtni suradi)
reset role;
update public.events set created_at = created_at - interval '1 day'
 where user_id = '00000000-0000-4000-8000-0000000000c1';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
begin
  insert into public.events (name) values ('sinov.event');
  raise notice 'OK C04 kun almashganda event yana yoziladi (Toshkent kuni)';
end
$$;

-- service_role: chegara yo'q (JWT'da sub yo'q). A bugun 1 ta yozgan, server 600 ta qo'shadi.
reset role;
set local role service_role;
select set_config('request.jwt.claims', '{"role": "service_role"}', true) \gset
do $$
begin
  insert into public.events (user_id, name)
  select '00000000-0000-4000-8000-0000000000c1', 'sinov.server' from generate_series(1, 600);
  raise notice 'OK C05 service_role: chegara qo''llanmaydi';
end
$$;

reset role;
do $$ begin raise notice 'CHEKLOV SINOVLARI O''TDI'; end $$;
rollback;
