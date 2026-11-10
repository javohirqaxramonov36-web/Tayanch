-- FAQAT LOKAL SINOV: onboarding_profiles migratsiyasi, RLS va updated_at qoidasi.
-- Oddiy Postgres'da ishga tushiriladi (Supabase loyihasida emas):
--   psql -v ON_ERROR_STOP=1 -f supabase/tests/onboarding_profiles_test.sql   (migratsiyadan keyin)
-- Avval supabase/tests/onboarding_shim.sql (rollar, auth.users, auth.uid()), keyin migratsiya, keyin shu fayl.
-- Haqiqiy Supabase bilan farq qilishi mumkin: yakuniy sinov real loyihada.
\set QUIET on
\set ON_ERROR_STOP on

begin;

-- ---------- 1. Natija: hamma tekshiruvlar o'tsa "OK" chiqadi, aks holda xato bilan to'xtaydi ----------
create temporary table natija (nomi text, ok boolean) on commit drop;
grant all on natija to authenticated, anon;

insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'a@sinov.uz'),
  ('22222222-2222-2222-2222-222222222222', 'b@sinov.uz');

-- ---------- 2. A foydalanuvchi ----------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);

insert into public.onboarding_profiles (user_id, goals, primary_goal, time_left, exam_date, daily_minutes, skipped, updated_at)
values ('11111111-1111-1111-1111-111111111111', '{sat,ielts}', 'ielts', 'date', '2026-12-01', 60, false, '2026-11-09T10:00:00Z');
insert into natija select 'A o''z qatorini qo''sha oladi', count(*) = 1 from public.onboarding_profiles;

-- B nomidan qator qo'shish taqiqlangan
do $$ begin
  insert into public.onboarding_profiles (user_id, goals) values ('22222222-2222-2222-2222-222222222222', '{sat}');
  insert into natija values ('A boshqa user_id bilan qo''sha olmaydi', false);
exception when insufficient_privilege then
  insert into natija values ('A boshqa user_id bilan qo''sha olmaydi', true);
end $$;

-- Eskiroq updated_at bilan yangilash e'tiborsiz qolinadi (boshqa qurilmadan kechikkan yozuv)
update public.onboarding_profiles set daily_minutes = 15, updated_at = '2026-11-09T09:00:00Z';
insert into natija select 'eskiroq yozuv qatorni o''zgartirmaydi', daily_minutes = 60 and updated_at = '2026-11-09T10:00:00Z'
  from public.onboarding_profiles;

-- Yangiroq updated_at yutadi
update public.onboarding_profiles set daily_minutes = 120, updated_at = '2026-11-09T11:00:00Z';
insert into natija select 'yangiroq yozuv yutadi', daily_minutes = 120 from public.onboarding_profiles;

-- Kelajakdagi vaqt now() ga tushiriladi
update public.onboarding_profiles set updated_at = now() + interval '1 day';
insert into natija select 'kelajakdagi updated_at now() ga tushadi', updated_at <= now() from public.onboarding_profiles;

-- upsert (supabase-js .upsert): eskiroq bo'lsa ham xato bermaydi, qator o'zgarmaydi
insert into public.onboarding_profiles as p (user_id, goals, primary_goal, time_left, daily_minutes, updated_at)
values ('11111111-1111-1111-1111-111111111111', '{eyuf}', 'eyuf', 'unknown', 30, '2026-01-01T00:00:00Z')
on conflict (user_id) do update set goals = excluded.goals, primary_goal = excluded.primary_goal,
  time_left = excluded.time_left, exam_date = excluded.exam_date, daily_minutes = excluded.daily_minutes,
  updated_at = excluded.updated_at;
insert into natija select 'eskiroq upsert qatorni o''zgartirmaydi', goals = '{sat,ielts}' from public.onboarding_profiles;

-- Cheklovlar
do $$ begin
  update public.onboarding_profiles set goals = '{sat,hack}', updated_at = now();
  insert into natija values ('noma''lum maqsad rad etiladi', false);
exception when check_violation then insert into natija values ('noma''lum maqsad rad etiladi', true);
end $$;
do $$ begin
  update public.onboarding_profiles set primary_goal = 'eyuf', updated_at = now();
  insert into natija values ('asosiy maqsad goals ichida bo''lishi shart', false);
exception when check_violation then insert into natija values ('asosiy maqsad goals ichida bo''lishi shart', true);
end $$;
do $$ begin
  update public.onboarding_profiles set time_left = '1m', updated_at = now();
  insert into natija values ('exam_date faqat time_left=date bilan', false);
exception when check_violation then insert into natija values ('exam_date faqat time_left=date bilan', true);
end $$;
do $$ begin
  update public.onboarding_profiles set goals = '{}', primary_goal = null, skipped = false, updated_at = now();
  insert into natija values ('maqsadsiz profil faqat skipped bilan', false);
exception when check_violation then insert into natija values ('maqsadsiz profil faqat skipped bilan', true);
end $$;

-- ---------- 3. B foydalanuvchi A qatorini ko'rmaydi va o'zgartira olmaydi ----------
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
insert into natija select 'B A qatorini ko''rmaydi', count(*) = 0 from public.onboarding_profiles;
update public.onboarding_profiles set daily_minutes = 15, updated_at = now();
delete from public.onboarding_profiles;
insert into public.onboarding_profiles (user_id, skipped) values ('22222222-2222-2222-2222-222222222222', true);
insert into natija select 'B o''tkazib yuborilgan profilni saqlay oladi', count(*) = 1 from public.onboarding_profiles;

-- ---------- 4. anon hech narsa qila olmaydi ----------
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$ begin
  perform 1 from public.onboarding_profiles;
  insert into natija values ('anon o''qiy olmaydi', false);
exception when insufficient_privilege then insert into natija values ('anon o''qiy olmaydi', true);
end $$;

-- ---------- 5. Egasi sifatida tekshirish: A qatori B harakatidan keyin o'zgarmagan, cascade ----------
reset role;
insert into natija select 'B A qatorini o''zgartira olmadi', daily_minutes = 120
  from public.onboarding_profiles where user_id = '11111111-1111-1111-1111-111111111111';
delete from auth.users where id = '11111111-1111-1111-1111-111111111111';
insert into natija select 'user o''chirilsa profil ham o''chadi (cascade)', count(*) = 0
  from public.onboarding_profiles where user_id = '11111111-1111-1111-1111-111111111111';

\set QUIET off
select nomi, case when ok then 'OK' else 'XATO' end as holat from natija;
do $$ begin
  if exists (select 1 from natija where not ok) then raise exception 'onboarding_profiles: tekshiruv o''tmadi'; end if;
end $$;

rollback;
