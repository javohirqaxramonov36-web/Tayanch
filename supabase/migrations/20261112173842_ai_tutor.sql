-- P33 AI Tutor (2026-11-12): server tomonidagi suhbat, limit, umumiy oylik byudjet, kill switch, xarajat hisobi.
-- Hujjat: docs/ai-tutor.md. Edge Function: supabase/functions/ai-tutor/.
--
-- Standart holat: AI YOPIQ. Uni muallif o'zi ochadi (uch shart birga):
--   1) Supabase secrets: AI_API_KEY;
--   2) private.ai_settings: enabled = true va monthly_budget_usd (USD) qo'yilgan;
--   3) plans.limits: "ai_messages" (per day) va "ai_messages_month" (per month), max > 0.
-- Biror shart bo'lmasa so'rov AI provayderiga yuborilmaydi. Boshqa kvota kalitlaridan farqi: limit yozilmagan
-- bo'lsa bu "cheksiz" emas, "yopiq" degani (cheksiz bepul foydalanish yo'q).
--
-- Narx (Claude Haiku 5.5, 100 000 tokengacha bo'lgan prompt): kirish $0.10 / MTok, chiqish $0.50 / MTok.
-- Manba: https://platform.claude.com/docs/en/about-claude/pricing ("Model pricing" jadvali), o'qilgan 2026-11-12.
-- Model yoki narx o'zgarsa, faqat ai_settings qatori yangilanadi (kod o'zgarmaydi).

------------------------------------------------------------------------------
-- Sozlama (bitta qator)

create table if not exists private.ai_settings (
  id                       boolean primary key default true check (id),
  enabled                  boolean not null default false,
  monthly_budget_usd       numeric(12, 6) check (monthly_budget_usd is null or monthly_budget_usd >= 0),
  model                    text not null default 'claude-haiku-5-5' check (char_length(model) between 1 and 80),
  price_input_per_mtok     numeric(10, 4) check (price_input_per_mtok is null or price_input_per_mtok >= 0),
  price_output_per_mtok    numeric(10, 4) check (price_output_per_mtok is null or price_output_per_mtok >= 0),
  max_output_tokens        integer not null default 800 check (max_output_tokens between 100 and 4000),
  min_interval_seconds     integer not null default 5 check (min_interval_seconds between 0 and 600),
  duplicate_window_seconds integer not null default 60 check (duplicate_window_seconds between 0 and 3600),
  disabled_reason          text,
  disabled_at              timestamptz,
  updated_at               timestamptz not null default now()
);

insert into private.ai_settings (id, price_input_per_mtok, price_output_per_mtok)
values (true, 0.10, 0.50)
on conflict (id) do nothing;

------------------------------------------------------------------------------
-- Xarajat jurnali (matnsiz: faqat token, narx, holat). Hisob o'chirilsa user_id null bo'ladi, xarajat qoladi.

create table if not exists private.ai_usage (
  id            bigint generated always as identity primary key,
  user_id       uuid references auth.users (id) on delete set null,
  plan_code     text,
  month         date not null,
  status        text not null check (status in ('reserved', 'done', 'failed')),
  model         text not null,
  price_in      numeric(10, 4) not null,
  price_out     numeric(10, 4) not null,
  -- Takror so'rovni aniqlash uchun xabar xeshi; 1 soatdan keyin o'chiriladi (ai_begin).
  input_hash    text check (input_hash is null or input_hash ~ '^[0-9a-f]{64}$'),
  calls         smallint not null default 0 check (calls between 0 and 5),
  input_tokens  integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  reserved_usd  numeric(12, 6) not null check (reserved_usd >= 0),
  cost_usd      numeric(12, 6) check (cost_usd is null or cost_usd >= 0),
  check_status  text check (check_status is null or check_status in ('verified', 'unverified', 'not_checked')),
  created_at    timestamptz not null default now(),
  settled_at    timestamptz
);

create index if not exists ai_usage_user_idx on private.ai_usage (user_id, created_at desc);
create index if not exists ai_usage_month_idx on private.ai_usage (month, status);
create index if not exists ai_usage_hash_idx on private.ai_usage (created_at) where input_hash is not null;

-- Rad etilgan so'rovlar soni (oylik hisobot uchun; kim yuborgani va matn saqlanmaydi).
create table if not exists private.ai_rejections (
  month  date not null,
  reason text not null check (reason in (
    'cb_content', 'too_long', 'invalid_request', 'rate_limited', 'duplicate',
    'quota_exceeded', 'not_in_plan', 'paused', 'budget_reached')),
  count  integer not null default 0,
  primary key (month, reason)
);

------------------------------------------------------------------------------
-- Suhbat tarixi (foydalanuvchi hisobida; o'zi o'qiydi va o'chiradi, yozish faqat Edge Function orqali)

create table if not exists public.ai_conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  mode        text not null check (mode in ('attempt', 'own')),
  attempt_id  bigint references public.attempts (id) on delete set null,
  question_id uuid references public.questions (id) on delete set null,
  title       text not null check (char_length(title) between 1 and 120),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists ai_conversations_user_idx on public.ai_conversations (user_id, updated_at desc);

create table if not exists public.ai_messages (
  id              bigint generated always as identity primary key,
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  user_id         uuid not null references auth.users (id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null check (char_length(content) between 1 and 8000),
  check_status    text check (check_status is null or check_status in ('verified', 'unverified', 'not_checked')),
  created_at      timestamptz not null default now()
);

create index if not exists ai_messages_conversation_idx on public.ai_messages (conversation_id, id);
create index if not exists ai_messages_user_idx on public.ai_messages (user_id);

alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;

revoke all on public.ai_conversations from anon, authenticated;
revoke all on public.ai_messages from anon, authenticated;
grant select, delete on public.ai_conversations to authenticated;
grant select, delete on public.ai_messages to authenticated;

drop policy if exists ai_conversations_select_own on public.ai_conversations;
create policy ai_conversations_select_own on public.ai_conversations
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists ai_conversations_delete_own on public.ai_conversations;
create policy ai_conversations_delete_own on public.ai_conversations
  for delete to authenticated using (user_id = (select auth.uid()));
drop policy if exists ai_messages_select_own on public.ai_messages;
create policy ai_messages_select_own on public.ai_messages
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists ai_messages_delete_own on public.ai_messages;
create policy ai_messages_delete_own on public.ai_messages
  for delete to authenticated using (user_id = (select auth.uid()));

------------------------------------------------------------------------------
-- Yordamchilar (private)

create or replace function private.ai_month()
returns date
language sql
stable
set search_path = ''
as $$
  select date_trunc('month', private.today_tashkent())::date
$$;

-- Tarifda shu kalit uchun musbat limit bormi (va davri to'g'rimi).
create or replace function private.ai_limit_set(p_limits jsonb, p_key text, p_per text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    jsonb_typeof(p_limits -> p_key) = 'object'
    and jsonb_typeof(p_limits -> p_key -> 'max') = 'number'
    and (p_limits -> p_key ->> 'max')::numeric > 0
    and coalesce(p_limits -> p_key ->> 'per', 'day') = p_per,
    false)
$$;

create or replace function private.ai_count_rejection(p_reason text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into private.ai_rejections (month, reason, count)
  values (private.ai_month(), p_reason, 1)
  on conflict (month, reason) do update set count = private.ai_rejections.count + 1
$$;

-- AI hozir ochiqmi (kalitdan tashqari hamma server shartlari).
create or replace function private.ai_configured(s private.ai_settings)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(s.enabled and s.monthly_budget_usd is not null
                  and s.price_input_per_mtok is not null and s.price_output_per_mtok is not null, false)
$$;

------------------------------------------------------------------------------
-- Edge Function uchun (faqat service_role)

-- So'rovdan OLDIN: yoqilganlik, tarif limiti, tezlik va takror, byudjet, kvota, xarajatni band qilish.
-- Hammasi bitta tranzaksiyada; ai_settings qatori qulflanadi, shuning uchun parallel so'rovlar byudjetdan oshira olmaydi.
-- Byudjet yetmasa AI avtomatik o'chiriladi (enabled = false, disabled_reason = 'budget_reached') va shu holat saqlanadi.
-- Natija: {"ok": true, "usage_id", "model", "max_output_tokens"} yoki {"ok": false, "error", ...}.
create or replace function public.ai_begin(
  p_user uuid, p_input_hash text, p_est_input_tokens integer, p_calls integer default 2)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  s        private.ai_settings;
  v_plan   public.plans;
  v_month  date := private.ai_month();
  v_last   timestamptz;
  v_spent  numeric;
  v_res    numeric;
  v_id     bigint;
begin
  if p_user is null or p_est_input_tokens is null or p_est_input_tokens < 0 or p_est_input_tokens > 100000
     or p_calls is null or p_calls not between 1 and 5 then
    raise exception 'invalid_request' using errcode = '22023';
  end if;

  select * into s from private.ai_settings where id for update;
  if not found or not private.ai_configured(s) then
    perform private.ai_count_rejection('paused');
    return jsonb_build_object('ok', false, 'error', 'ai_paused');
  end if;

  v_plan := private.current_plan(p_user, 'sat');
  if not (private.ai_limit_set(v_plan.limits, 'ai_messages', 'day')
          and private.ai_limit_set(v_plan.limits, 'ai_messages_month', 'month')) then
    perform private.ai_count_rejection('not_in_plan');
    return jsonb_build_object('ok', false, 'error', 'not_in_plan');
  end if;

  -- Eski xeshlar (1 soatdan katta) o'chiriladi: takrorni aniqlashdan boshqa maqsadi yo'q.
  update private.ai_usage set input_hash = null
   where input_hash is not null and created_at < now() - interval '1 hour';

  select max(created_at) into v_last from private.ai_usage where user_id = p_user;
  if v_last is not null and v_last > now() - make_interval(secs => s.min_interval_seconds) then
    perform private.ai_count_rejection('rate_limited');
    return jsonb_build_object('ok', false, 'error', 'rate_limited',
      'retry_after', greatest(1, ceil(extract(epoch from (v_last + make_interval(secs => s.min_interval_seconds) - now())))::integer));
  end if;

  if p_input_hash is not null and exists (
    select 1 from private.ai_usage
     where user_id = p_user and input_hash = p_input_hash
       and created_at > now() - make_interval(secs => s.duplicate_window_seconds)) then
    perform private.ai_count_rejection('duplicate');
    return jsonb_build_object('ok', false, 'error', 'duplicate');
  end if;

  -- Eng katta xarajat: har chaqiruvda taxminiy kirish + to'liq max_output_tokens.
  v_res := round((p_est_input_tokens * s.price_input_per_mtok + s.max_output_tokens * s.price_output_per_mtok)
                 * p_calls / 1000000.0, 6);
  select coalesce(sum(coalesce(cost_usd, reserved_usd)), 0) into v_spent
    from private.ai_usage where month = v_month;
  if v_spent + v_res > s.monthly_budget_usd then
    update private.ai_settings
       set enabled = false, disabled_reason = 'budget_reached', disabled_at = now(), updated_at = now()
     where id;
    perform private.ai_count_rejection('budget_reached');
    return jsonb_build_object('ok', false, 'error', 'ai_paused');
  end if;

  begin
    perform private.consume_quota(p_user, 'ai_messages', 1);
    perform private.consume_quota(p_user, 'ai_messages_month', 1);
  exception when sqlstate 'P0001' then
    if sqlerrm <> 'quota_exceeded' then raise; end if;
    perform private.ai_count_rejection('quota_exceeded');
    return jsonb_build_object('ok', false, 'error', 'quota_exceeded');
  end;

  insert into private.ai_usage (user_id, plan_code, month, status, model, price_in, price_out, input_hash, reserved_usd)
  values (p_user, v_plan.code, v_month, 'reserved', s.model, s.price_input_per_mtok, s.price_output_per_mtok,
          p_input_hash, v_res)
  returning id into v_id;

  return jsonb_build_object('ok', true, 'usage_id', v_id, 'model', s.model, 'max_output_tokens', s.max_output_tokens);
end
$$;

-- So'rovdan KEYIN: provayder qaytargan haqiqiy tokenlar bilan xarajat yoziladi.
-- p_ok = false (provayder xatosi, javob yo'q): kvota birligi qaytariladi, xarajat baribir haqiqiy token bo'yicha.
-- Oy xarajati byudjetga yetsa AI o'chiriladi.
create or replace function public.ai_finish(
  p_usage_id bigint, p_input_tokens integer, p_output_tokens integer, p_calls integer, p_ok boolean, p_check text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  s       private.ai_settings;
  u       private.ai_usage;
  v_cost  numeric;
  v_spent numeric;
  v_plan  public.plans;
  v_key   text;
begin
  if p_input_tokens is null or p_input_tokens < 0 or p_output_tokens is null or p_output_tokens < 0
     or p_calls is null or p_calls not between 0 and 5 then
    raise exception 'invalid_request' using errcode = '22023';
  end if;

  select * into s from private.ai_settings where id for update;
  select * into u from private.ai_usage where id = p_usage_id for update;
  if not found or u.status <> 'reserved' then
    return jsonb_build_object('ok', false, 'error', 'not_reserved');
  end if;

  v_cost := round((p_input_tokens * u.price_in + p_output_tokens * u.price_out) / 1000000.0, 6);

  update private.ai_usage
     set status = case when p_ok then 'done' else 'failed' end,
         calls = p_calls, input_tokens = p_input_tokens, output_tokens = p_output_tokens,
         cost_usd = v_cost, check_status = case when p_ok then p_check end,
         input_hash = case when p_ok then input_hash end,
         settled_at = now()
   where id = u.id;

  if not p_ok and u.user_id is not null then
    v_plan := private.current_plan(u.user_id, 'sat');
    foreach v_key in array array['ai_messages', 'ai_messages_month'] loop
      update public.usage_counters
         set count = count - 1, updated_at = now()
       where user_id = u.user_id and key = v_key and count > 0
         and period_start = private.period_start(coalesce(v_plan.limits -> v_key ->> 'per', 'day'));
    end loop;
  end if;

  select coalesce(sum(coalesce(cost_usd, reserved_usd)), 0) into v_spent
    from private.ai_usage where month = u.month;
  if s.monthly_budget_usd is not null and v_spent >= s.monthly_budget_usd and s.enabled then
    update private.ai_settings
       set enabled = false, disabled_reason = 'budget_reached', disabled_at = now(), updated_at = now()
     where id;
  end if;

  return jsonb_build_object('ok', true, 'cost_usd', v_cost);
end
$$;

-- Edge Function kirishda rad etgan so'rovni sanaydi (matnsiz).
create or replace function public.ai_reject(p_reason text)
returns void
language sql
security definer
set search_path = ''
as $$
  select private.ai_count_rejection(p_reason)
$$;

-- Xato bo'yicha kontekst: faqat foydalanuvchining o'z urinishi va Tayanch'ning tasdiqlangan ORIGINAL savoli.
create or replace function public.ai_attempt_context(p_user uuid, p_attempt bigint)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'attempt_id', a.id, 'question_id', q.id, 'section', q.section, 'domain', q.domain, 'skill', q.skill,
    'format', q.format, 'passage', q.passage, 'stem', q.stem, 'options', q.options, 'correct', q.correct,
    'explanation', q.explanation, 'figure_alt', q.figure ->> 'alt',
    'user_answer', a.answer, 'is_correct', a.is_correct)
  from public.attempts a
  join public.questions q on q.id = a.question_id
  where a.id = p_attempt and a.user_id = p_user
    and q.status = 'verified' and q.source = 'original'
$$;

-- Suhbatning oxirgi p_limit xabari (eskidan yangiga). Boshqa foydalanuvchiniki bo'lsa null.
create or replace function public.ai_conversation_history(p_user uuid, p_conversation uuid, p_limit integer default 6)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'mode', c.mode, 'attempt_id', c.attempt_id,
    'messages', coalesce((
      select jsonb_agg(jsonb_build_object('role', m.role, 'content', m.content) order by m.id)
      from (select id, role, content from public.ai_messages
             where conversation_id = c.id order by id desc limit greatest(0, least(p_limit, 20))) m
    ), '[]'::jsonb))
  from public.ai_conversations c
  where c.id = p_conversation and c.user_id = p_user
$$;

-- Bir savol-javob juftligini yozadi (tozalangan foydalanuvchi matni + AI javobi). Yangi suhbat bo'lsa yaratadi.
create or replace function public.ai_save_turn(
  p_user uuid, p_conversation uuid, p_mode text, p_attempt bigint, p_question uuid,
  p_title text, p_user_text text, p_assistant_text text, p_check text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid := p_conversation;
begin
  if v_id is null then
    insert into public.ai_conversations (user_id, mode, attempt_id, question_id, title)
    values (p_user, p_mode, p_attempt, p_question, left(coalesce(nullif(btrim(p_title), ''), 'Conversation'), 120))
    returning id into v_id;
  else
    update public.ai_conversations set updated_at = now()
     where id = v_id and user_id = p_user and mode = p_mode;
    if not found then
      raise exception 'conversation_not_found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.ai_messages (conversation_id, user_id, role, content, check_status) values
    (v_id, p_user, 'user', p_user_text, null),
    (v_id, p_user, 'assistant', p_assistant_text, p_check);
  return v_id;
end
$$;

revoke all on function public.ai_begin(uuid, text, integer, integer) from public, anon, authenticated;
revoke all on function public.ai_finish(bigint, integer, integer, integer, boolean, text) from public, anon, authenticated;
revoke all on function public.ai_reject(text) from public, anon, authenticated;
revoke all on function public.ai_attempt_context(uuid, bigint) from public, anon, authenticated;
revoke all on function public.ai_conversation_history(uuid, uuid, integer) from public, anon, authenticated;
revoke all on function public.ai_save_turn(uuid, uuid, text, bigint, uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function public.ai_begin(uuid, text, integer, integer) to service_role;
grant execute on function public.ai_finish(bigint, integer, integer, integer, boolean, text) to service_role;
grant execute on function public.ai_reject(text) to service_role;
grant execute on function public.ai_attempt_context(uuid, bigint) to service_role;
grant execute on function public.ai_conversation_history(uuid, uuid, integer) to service_role;
grant execute on function public.ai_save_turn(uuid, uuid, text, bigint, uuid, text, text, text, text) to service_role;

------------------------------------------------------------------------------
-- Mijoz uchun (authenticated)

-- AI foydalanuvchi uchun ochiqmi. Byudjet va narx raqamlari oshkor qilinmaydi.
create or replace function public.ai_tutor_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid    uuid := (select auth.uid());
  s      private.ai_settings;
  v_plan public.plans;
  v_in   boolean;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into s from private.ai_settings where id;
  v_plan := private.current_plan(uid, 'sat');
  v_in := private.ai_limit_set(v_plan.limits, 'ai_messages', 'day')
          and private.ai_limit_set(v_plan.limits, 'ai_messages_month', 'month');
  return jsonb_build_object(
    'available', coalesce(private.ai_configured(s), false) and v_in,
    'reason', case when not coalesce(private.ai_configured(s), false) then 'paused'
                   when not v_in then 'not_in_plan' end,
    'plan', v_plan.code);
end
$$;

-- Foydalanuvchining oxirgi xatolari (Tayanch original savollari): AI'dan so'rash uchun tanlov ro'yxati.
create or replace function public.ai_recent_mistakes(p_limit integer default 20)
returns table (attempt_id bigint, created_at timestamptz, section text, skill text, difficulty smallint, snippet text)
language sql
stable
security definer
set search_path = ''
as $$
  select x.attempt_id, x.created_at, x.section, x.skill, x.difficulty, x.snippet
  from (
    select distinct on (a.question_id)
           a.id as attempt_id, a.created_at, q.section, q.skill, q.difficulty,
           left(regexp_replace(q.stem, '\s+', ' ', 'g'), 90) as snippet
      from public.attempts a
      join public.questions q on q.id = a.question_id
     where a.user_id = (select auth.uid()) and not a.is_correct
       and q.status = 'verified' and q.source = 'original'
     order by a.question_id, a.created_at desc
  ) x
  order by x.created_at desc
  limit greatest(1, least(coalesce(p_limit, 20), 50))
$$;

revoke all on function public.ai_tutor_status() from public, anon;
revoke all on function public.ai_recent_mistakes(integer) from public, anon;
grant execute on function public.ai_tutor_status() to authenticated;
grant execute on function public.ai_recent_mistakes(integer) to authenticated;

------------------------------------------------------------------------------
-- Oylik hisobot (muallif: SQL Editor'da `select private.ai_monthly_report();` yoki sana bilan)

create or replace function private.ai_monthly_report(p_month date default null)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with m as (select coalesce(date_trunc('month', p_month)::date, private.ai_month()) as month),
       u as (select au.* from private.ai_usage au, m where au.month = m.month),
       s as (select * from private.ai_settings where id)
  select jsonb_build_object(
    'month', (select month from m),
    'model', (select model from s),
    'enabled', (select enabled from s),
    'disabled_reason', (select disabled_reason from s),
    'budget_usd', (select monthly_budget_usd from s),
    'spent_usd', (select coalesce(sum(coalesce(cost_usd, reserved_usd)), 0) from u),
    'cost_usd', (select coalesce(sum(cost_usd), 0) from u),
    'open_reserved_usd', (select coalesce(sum(reserved_usd), 0) from u where status = 'reserved'),
    'requests', jsonb_build_object(
      'done', (select count(*) from u where status = 'done'),
      'failed', (select count(*) from u where status = 'failed'),
      'reserved', (select count(*) from u where status = 'reserved')),
    'provider_calls', (select coalesce(sum(calls), 0) from u),
    'input_tokens', (select coalesce(sum(input_tokens), 0) from u),
    'output_tokens', (select coalesce(sum(output_tokens), 0) from u),
    'users', (select count(distinct user_id) from u),
    'by_plan', coalesce((select jsonb_object_agg(coalesce(plan_code, '?'), jsonb_build_object(
                   'requests', n, 'cost_usd', c))
                 from (select plan_code, count(*) n, coalesce(sum(cost_usd), 0) c from u group by plan_code) p), '{}'::jsonb),
    'check', coalesce((select jsonb_object_agg(check_status, n)
                 from (select check_status, count(*) n from u where check_status is not null group by check_status) k),
               '{}'::jsonb),
    'rejected', coalesce((select jsonb_object_agg(r.reason, r.count)
                 from private.ai_rejections r, m where r.month = m.month), '{}'::jsonb))
$$;

revoke all on function private.ai_month() from public, anon, authenticated;
revoke all on function private.ai_limit_set(jsonb, text, text) from public, anon, authenticated;
revoke all on function private.ai_count_rejection(text) from public, anon, authenticated;
revoke all on function private.ai_configured(private.ai_settings) from public, anon, authenticated;
revoke all on function private.ai_monthly_report(date) from public, anon, authenticated;
