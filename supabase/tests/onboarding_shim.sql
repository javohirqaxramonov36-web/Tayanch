-- FAQAT LOKAL SINOV UCHUN (onboarding_profiles_test.sql dan oldin). Supabase loyihasida ishga tushirilmaydi.
-- Oddiy Postgres'da Supabase muhitining minimal o'xshatmasi: rollar, auth.users, auth.uid().
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin noinherit; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin noinherit; end if;
end
$$;
grant anon, authenticated to current_user;

create schema if not exists auth;
create table if not exists auth.users (
  id    uuid primary key default gen_random_uuid(),
  email text
);
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb ->> 'sub', '')::uuid
$$;
grant usage on schema auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;

-- Supabase public sxemadagi yangi jadvallarga standart huquq beradi: migratsiya shunga qaramay himoyalanganini tekshiramiz.
grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
