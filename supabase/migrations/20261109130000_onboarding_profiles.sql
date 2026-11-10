-- Navigator onboarding profili: har foydalanuvchiga bitta qator (1-qavat, /uz/).
-- Mustaqil migratsiya: ochiq PR'lardagi (#38, #57, #64) fayllarga bog'liq emas, ular bilan birga ham ishlaydi
-- (`create ... if not exists`, `create or replace`). Ustunlar src/lib/navigator/profil.ts dagi YolProfil bilan bir xil.
--
-- Ziddiyat qoidasi ("updated_at yangisi yutadi"): updated_at ni mijoz yozadi (haqiqiy tahrir vaqti).
-- Server faqat (1) kelajakdagi vaqtni now() ga tushiradi, (2) eskiroq updated_at bilan kelgan UPDATE'ni
-- e'tiborsiz qoldiradi (qator o'zgarmaydi). Shunda ikki qurilma bir vaqtda yozsa ham yangisi qoladi.

create schema if not exists private;

create table if not exists public.onboarding_profiles (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  goals         text[] not null default '{}'
                check (goals <@ array['top-admission', 'sat', 'ielts', 'eyuf']::text[] and cardinality(goals) <= 4),
  primary_goal  text check (primary_goal is null or primary_goal = any (goals)),
  time_left     text check (time_left in ('15d', '1m', '3m', 'date', 'unknown')),
  exam_date     date,
  daily_minutes smallint check (daily_minutes in (15, 30, 60, 120)),
  skipped       boolean not null default false,
  updated_at    timestamptz not null default now(),
  -- exam_date faqat "Aniq sana" javobida bo'ladi va unda albatta bo'ladi
  constraint onboarding_profiles_exam_date_check
    check ((time_left is distinct from 'date' and exam_date is null) or (time_left = 'date' and exam_date is not null)),
  -- o'tkazib yuborilmagan profilda kamida bitta maqsad bor
  constraint onboarding_profiles_goal_or_skipped_check check (skipped or cardinality(goals) > 0)
);

comment on table public.onboarding_profiles is
  'Navigator onboarding javoblari (maqsadlar, muddat, kunlik vaqt). Faqat egasi o''qiydi va yozadi (RLS).';

create or replace function private.onboarding_profiles_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.updated_at is null or new.updated_at > now() then
    new.updated_at := now();
  end if;
  -- stale write from another device: keep the newer row unchanged
  if tg_op = 'UPDATE' and new.updated_at < old.updated_at then
    return old;
  end if;
  return new;
end
$$;

revoke all on function private.onboarding_profiles_updated_at() from public;

create or replace trigger onboarding_profiles_updated_at
  before insert or update on public.onboarding_profiles
  for each row execute function private.onboarding_profiles_updated_at();

-- RLS: foydalanuvchi faqat o'z qatorini o'qiydi, qo'shadi, yangilaydi va o'chiradi. anon hech narsa qila olmaydi.
alter table public.onboarding_profiles enable row level security;
revoke all on table public.onboarding_profiles from anon, authenticated;
grant select, insert, update, delete on table public.onboarding_profiles to authenticated;

drop policy if exists onboarding_profiles_select_own on public.onboarding_profiles;
create policy onboarding_profiles_select_own on public.onboarding_profiles
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists onboarding_profiles_insert_own on public.onboarding_profiles;
create policy onboarding_profiles_insert_own on public.onboarding_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists onboarding_profiles_update_own on public.onboarding_profiles;
create policy onboarding_profiles_update_own on public.onboarding_profiles
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists onboarding_profiles_delete_own on public.onboarding_profiles;
create policy onboarding_profiles_delete_own on public.onboarding_profiles
  for delete to authenticated using ((select auth.uid()) = user_id);
