-- 0002. Profil va yangi foydalanuvchi triggeri.
-- Bitta hisob butun sayt uchun (docs/qarorlar/001-hisob-tolov-server.md).

create table if not exists public.profiles (
  id              uuid primary key references auth.users (id) on delete cascade,
  display_name    text check (char_length(display_name) <= 80),
  nickname        text check (char_length(nickname) between 2 and 32),
  country         text check (country ~ '^[A-Z]{2}$'),            -- ISO 3166-1 alpha-2
  -- SAT umumiy ball shkalasi 400–1600 (College Board). Faqat yaroqlilik tekshiruvi.
  target_score    integer check (target_score between 400 and 1600),
  exam_date       date,
  consent_version text check (char_length(consent_version) <= 32),
  consent_at      timestamptz,                                    -- trigger qo'yadi, mijoz yozmaydi
  locale          text not null default 'uz' check (locale in ('uz', 'en')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create unique index if not exists profiles_nickname_key
  on public.profiles (lower(nickname)) where nickname is not null;

create or replace trigger profiles_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

-- consent_version o'zgarsa consent_at ni server vaqti bilan yozadi.
create or replace function private.profiles_consent_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.consent_version is distinct from old.consent_version then
    new.consent_at := case when new.consent_version is null then null else now() end;
  else
    new.consent_at := old.consent_at;
  end if;
  return new;
end
$$;

create or replace trigger profiles_consent_at
  before update on public.profiles
  for each row execute function private.profiles_consent_at();

-- RLS: faqat o'z profili. Qatorni trigger yaratadi, mijoz INSERT/DELETE qilmaydi.
alter table public.profiles enable row level security;
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, nickname, country, target_score, exam_date, consent_version, locale)
  on table public.profiles to authenticated;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- auth.users ga yangi qator (email yoki Google) → profiles qatori.
-- Google ism beradi: raw_user_meta_data ->> 'full_name' yoki 'name'. Email bilan kirishda ism bo'lmasligi mumkin.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')), ''), 80)
  )
  on conflict (id) do nothing;
  return new;
end
$$;

revoke all on function private.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();
