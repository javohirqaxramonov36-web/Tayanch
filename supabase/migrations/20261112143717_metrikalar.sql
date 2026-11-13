-- 20261112143717. P25 mahsulot metrikalari (birinchi tomon, maxfiylikka mos).
-- Tayyor so'rovlar: docs/metrikalar.sql (muallif Supabase SQL muharririda ishlatadi).
-- Takror ishga tushirilsa buzilmaydi (if not exists / create or replace / drop ... if exists).
--
-- Qoidalar:
--   * events ga faqat bitta yordamchi yozadi: private.track(user, name, props). Mijozning to'g'ridan-to'g'ri
--     INSERT huquqi olib tashlanadi; brauzer faqat public.track_event (ruxsat etilgan nomlar: plan_viewed) orqali.
--   * Hodisa nomi va har hodisaning xossa kalitlari qat'iy ro'yxatda. Qiymat faqat qisqa slug (a-z, 0-9, _ . -),
--     son yoki boolean: email, ism, savol matni, javob, URL yozib bo'lmaydi. page ustuni yozilmaydi (null).
--   * IP manzil, user-agent, qurilma barmoq izi saqlanmaydi: events da bunday ustun yo'q va hech qayerdan olinmaydi.
--   * profiles.usage_analytics = false bo'lsa yozilmaydi. payment_started va payment_success bundan mustasno:
--     ular payments yozuvidan (trigger) olinadi va to'lov hisobi uchun kerak.
--   * usage_analytics o'chirilganda shu foydalanuvchining to'lovdan boshqa hodisalari darhol o'chiriladi.
--   * Tezlik cheklovi: bir foydalanuvchiga soatiga ko'pi bilan 60 ta to'lovsiz hodisa; plan_viewed 10 daqiqada
--     bir marta. Chegaradan oshgani jimgina tashlab yuboriladi (foydalanuvchi amali buzilmaydi).
--   * Trigger ichidagi xato asosiy amalni (sessiya, javob, to'lov) hech qachon to'xtatmaydi: warning bilan o'tadi.
--
-- Hodisalar:
--   signup                  profiles qatori yaratilganda (auth.users trigger'i orqali)      props: {}
--   first_session           foydalanuvchining birinchi daily bo'lmagan mashq sessiyasi        props: mode, question_count
--   session_completed       daily bo'lmagan sessiya finished_at oldi                          props: mode, question_count
--   daily_question_answered daily sessiyada javob (attempts)                                  props: section, is_correct
--   plan_viewed             Obuna sahifasi ochildi (brauzer, track_event)                     props: {}
--   payment_started         payments qatori yaratildi                                         props: plan_code, amount_uzs
--   payment_success         payments.status 'paid' ga o'tdi                                   props: plan_code, amount_uzs, livemode

------------------------------------------------------------------------------
-- 1. Profil: ulashish sozlamasi
------------------------------------------------------------------------------

alter table public.profiles
  add column if not exists usage_analytics boolean not null default true;

grant update (usage_analytics) on table public.profiles to authenticated;

------------------------------------------------------------------------------
-- 2. Yagona yozuvchi
------------------------------------------------------------------------------

-- Hodisa nomi -> ruxsat etilgan xossa kalitlari.
create or replace function private.event_props_allowed(p_name text)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case p_name
    when 'signup' then '{}'::text[]
    when 'first_session' then array['mode', 'question_count']
    when 'session_completed' then array['mode', 'question_count']
    when 'daily_question_answered' then array['section', 'is_correct']
    when 'plan_viewed' then '{}'::text[]
    when 'payment_started' then array['plan_code', 'amount_uzs']
    when 'payment_success' then array['plan_code', 'amount_uzs', 'livemode']
    else null
  end
$$;

-- Yozildi: true. Tashlab yuborildi (o'chirilgan, chegara, foydalanuvchi yo'q): false.
-- Noma'lum nom yoki ruxsatsiz xossa: xato (dasturchi xatosi, jim o'tkazilmaydi).
create or replace function private.track(p_user uuid, p_name text, p_props jsonb default '{}'::jsonb)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_allowed text[] := private.event_props_allowed(p_name);
  v_props   jsonb := coalesce(p_props, '{}'::jsonb);
  v_key     text;
  v_val     jsonb;
  v_payment boolean := p_name in ('payment_started', 'payment_success');
  v_share   boolean;
begin
  if v_allowed is null then
    raise exception 'unknown_event' using errcode = '22023';
  end if;
  if jsonb_typeof(v_props) <> 'object' then
    raise exception 'invalid_props' using errcode = '22023';
  end if;
  for v_key, v_val in select * from jsonb_each(v_props) loop
    if not v_key = any (v_allowed) then
      raise exception 'invalid_props' using errcode = '22023', detail = v_key;
    end if;
    if not (
         jsonb_typeof(v_val) in ('number', 'boolean')
      or (jsonb_typeof(v_val) = 'string' and (v_val #>> '{}') ~ '^[a-z0-9_.-]{1,32}$')
    ) then
      raise exception 'invalid_props' using errcode = '22023', detail = v_key;
    end if;
  end loop;

  if p_user is null then
    return false;
  end if;

  if not v_payment then
    select p.usage_analytics into v_share from public.profiles p where p.id = p_user;
    if v_share is distinct from true then
      return false;   -- o'chirilgan yoki profil yo'q
    end if;

    if (select count(*) from public.events e
         where e.user_id = p_user and e.created_at > now() - interval '1 hour'
           and e.name not in ('payment_started', 'payment_success')) >= 60 then
      return false;
    end if;

    if p_name = 'plan_viewed' and exists (
      select 1 from public.events e
       where e.user_id = p_user and e.name = 'plan_viewed' and e.created_at > now() - interval '10 minutes') then
      return false;
    end if;
  end if;

  insert into public.events (user_id, name, props, page) values (p_user, p_name, v_props, null);
  return true;
end
$$;

revoke all on function private.event_props_allowed(text) from public;
revoke all on function private.track(uuid, text, jsonb) from public;

-- Trigger'lar uchun: xato asosiy amalni to'xtatmaydi.
create or replace function private.track_safe(p_user uuid, p_name text, p_props jsonb default '{}'::jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.track(p_user, p_name, p_props);
exception when others then
  raise warning 'track % o''tkazib yuborildi: %', p_name, sqlerrm;
end
$$;

revoke all on function private.track_safe(uuid, text, jsonb) from public;

------------------------------------------------------------------------------
-- 3. Brauzer uchun RPC
------------------------------------------------------------------------------

-- Brauzer faqat serverda bilib bo'lmaydigan hodisani yuboradi. Qolganlari trigger bilan yoziladi va soxtalashtirilmaydi.
create or replace function public.track_event(p_name text, p_props jsonb default '{}'::jsonb)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
begin
  if p_name is null or p_name not in ('plan_viewed') then
    raise exception 'event_not_allowed' using errcode = '42501';
  end if;
  return private.track(v_user, p_name, p_props);
end
$$;

revoke all on function public.track_event(text, jsonb) from public, anon;
grant execute on function public.track_event(text, jsonb) to authenticated, service_role;

-- To'g'ridan-to'g'ri yozish yopiladi (0007 dagi grant va policy).
revoke insert on table public.events from authenticated;
drop policy if exists events_insert_own on public.events;

------------------------------------------------------------------------------
-- 4. Trigger'lar
------------------------------------------------------------------------------

-- signup
create or replace function private.events_on_profile_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.track_safe(new.id, 'signup', '{}'::jsonb);
  return null;
end
$$;

drop trigger if exists events_signup on public.profiles;
create trigger events_signup after insert on public.profiles
  for each row execute function private.events_on_profile_insert();

-- usage_analytics o'chirildi: to'lovdan boshqa hodisalar o'chiriladi.
create or replace function private.events_on_optout()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.events e
   where e.user_id = new.id and e.name not in ('payment_started', 'payment_success');
  return null;
end
$$;

drop trigger if exists events_optout on public.profiles;
create trigger events_optout after update of usage_analytics on public.profiles
  for each row when (old.usage_analytics and not new.usage_analytics)
  execute function private.events_on_optout();

-- first_session (daily bo'lmagan birinchi sessiya)
create or replace function private.events_on_session_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.mode <> 'daily' and not exists (
    select 1 from public.practice_sessions s
     where s.user_id = new.user_id and s.mode <> 'daily' and s.id <> new.id) then
    perform private.track_safe(new.user_id, 'first_session',
      jsonb_build_object('mode', new.mode, 'question_count', new.question_count));
  end if;
  return null;
end
$$;

drop trigger if exists events_first_session on public.practice_sessions;
create trigger events_first_session after insert on public.practice_sessions
  for each row execute function private.events_on_session_insert();

-- session_completed
create or replace function private.events_on_session_finish()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.track_safe(new.user_id, 'session_completed',
    jsonb_build_object('mode', new.mode, 'question_count', new.question_count));
  return null;
end
$$;

drop trigger if exists events_session_completed on public.practice_sessions;
create trigger events_session_completed after update of finished_at on public.practice_sessions
  for each row when (old.finished_at is null and new.finished_at is not null and new.mode <> 'daily')
  execute function private.events_on_session_finish();

-- daily_question_answered
create or replace function private.events_on_attempt_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_section text;
begin
  if exists (select 1 from public.practice_sessions s where s.id = new.session_id and s.mode = 'daily') then
    select q.section into v_section from public.questions q where q.id = new.question_id;
    perform private.track_safe(new.user_id, 'daily_question_answered',
      jsonb_build_object('section', v_section, 'is_correct', new.is_correct));
  end if;
  return null;
end
$$;

drop trigger if exists events_daily_answer on public.attempts;
create trigger events_daily_answer after insert on public.attempts
  for each row execute function private.events_on_attempt_insert();

-- payment_started / payment_success (to'lov yozuvidan; usage_analytics ga bog'liq emas)
create or replace function private.events_on_payment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_live jsonb := new.raw -> 'inpay' -> 'livemode';
begin
  if tg_op = 'INSERT' then
    perform private.track_safe(new.user_id, 'payment_started',
      jsonb_build_object('plan_code', new.plan_code, 'amount_uzs', new.amount_uzs));
  elsif new.status = 'paid' and old.status is distinct from 'paid' then
    perform private.track_safe(new.user_id, 'payment_success',
      jsonb_build_object('plan_code', new.plan_code, 'amount_uzs', new.amount_uzs)
      || case when jsonb_typeof(v_live) = 'boolean' then jsonb_build_object('livemode', v_live)
              when jsonb_typeof(v_live) = 'string' and (v_live #>> '{}') in ('true', 'false')
                then jsonb_build_object('livemode', (v_live #>> '{}')::boolean)
              else '{}'::jsonb end);
  end if;
  return null;
end
$$;

drop trigger if exists events_payment on public.payments;
create trigger events_payment after insert or update of status on public.payments
  for each row execute function private.events_on_payment();

revoke all on function private.events_on_profile_insert(), private.events_on_optout(),
  private.events_on_session_insert(), private.events_on_session_finish(),
  private.events_on_attempt_insert(), private.events_on_payment() from public;

-- Metrika so'rovlari uchun indeks (created_at bo'yicha diapazon).
create index if not exists events_created_idx on public.events (created_at);
