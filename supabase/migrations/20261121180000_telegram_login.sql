-- Telegram identity belongs to the server. Keep existing own-profile RLS/column grants.
begin;
alter table public.profiles
  add column telegram_id text unique check (telegram_id ~ '^[1-9][0-9]{0,15}$'),
  add column telegram_username text check (char_length(telegram_username) <= 64),
  add column telegram_photo_url text check (char_length(telegram_photo_url) <= 2048);

-- Existing authenticated UPDATE grants list individual columns. These new identity columns
-- deliberately receive no client UPDATE grant, so users cannot claim another Telegram ID.
revoke update (telegram_id, telegram_username, telegram_photo_url) on public.profiles from anon, authenticated;
alter table public.profiles enable row level security;

-- Create the identity claim in the same transaction as auth.users. Unique email and telegram_id
-- serialize simultaneous first logins. app_metadata is writable only by the Auth admin API.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, telegram_id)
  values (
    new.id,
    left(nullif(btrim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')), ''), 80),
    nullif(new.raw_app_meta_data ->> 'telegram_id', '')
  )
  on conflict (id) do nothing;
  return new;
end
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;
commit;
