-- 0006. Tariflar, to'lov, obuna va kvota hisoblagichi.
-- payments, subscriptions, payment_events ni faqat service role (Edge Function, inPAY webhook) yozadi.
-- Kvota va narx raqamlari P19 da muallif tomonidan beriladi: bu yerda price_uzs = null, limits = {}.

create table if not exists public.plans (
  code        text primary key check (code ~ '^[a-z][a-z0-9_]{1,31}$'),
  name        text not null,
  bolim       text not null default 'sat' check (bolim in ('top-admission', 'sat', 'ielts', 'eyuf')),
  price_uzs   bigint check (price_uzs >= 0),
  period_days integer check (period_days > 0),
  -- {"<kvota kaliti>": {"max": <butun son>, "per": "day" | "month"}}. Kalit yo'q = cheklov yo'q.
  limits      jsonb not null default '{}'::jsonb check (jsonb_typeof(limits) = 'object'),
  features    jsonb not null default '[]'::jsonb check (jsonb_typeof(features) = 'array'),
  is_active   boolean not null default false,
  sort        smallint not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace trigger plans_updated_at before update on public.plans
  for each row execute function private.set_updated_at();

-- Uch tarif nomi qaror qilingan (HANDOFF §4). Narx va kvota yo'q; pro/elite P19 gacha faol emas.
insert into public.plans (code, name, bolim, sort, is_active) values
  ('free',  'Free',  'sat', 0, true),
  ('pro',   'Pro',   'sat', 1, false),
  ('elite', 'Elite', 'sat', 2, false)
on conflict (code) do nothing;

create table if not exists public.payments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete restrict,
  bolim             text not null default 'sat' check (bolim in ('top-admission', 'sat', 'ielts', 'eyuf')),
  plan_code         text not null references public.plans (code),
  provider          text not null default 'inpay' check (provider in ('inpay')),
  provider_order_id text not null unique,
  amount_uzs        bigint not null check (amount_uzs > 0),
  status            text not null default 'created'
                    check (status in ('created', 'pending', 'paid', 'failed', 'canceled', 'refunded')),
  raw               jsonb,                    -- provayder javobi; mijozga ko'rsatilmaydi
  paid_at           timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists payments_user_idx on public.payments (user_id, created_at desc);

create or replace trigger payments_updated_at before update on public.payments
  for each row execute function private.set_updated_at();

create table if not exists public.subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  bolim      text not null default 'sat' check (bolim in ('top-admission', 'sat', 'ielts', 'eyuf')),
  plan_code  text not null references public.plans (code),
  status     text not null default 'active' check (status in ('pending', 'active', 'expired', 'canceled')),
  starts_at  timestamptz not null default now(),
  ends_at    timestamptz,
  source     text not null check (source in ('payment', 'admin')),
  payment_id uuid references public.payments (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_period check (ends_at is null or ends_at > starts_at),
  constraint subscriptions_payment check (source <> 'payment' or payment_id is not null)
);

create index if not exists subscriptions_user_idx on public.subscriptions (user_id, bolim, status);
create unique index if not exists subscriptions_payment_key on public.subscriptions (payment_id)
  where payment_id is not null;

create or replace trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function private.set_updated_at();

-- Webhook'lar jurnali. (provider, event_id) unique: takror kelgan webhook ikkinchi marta qayta ishlanmaydi.
create table if not exists public.payment_events (
  id                bigint generated always as identity primary key,
  provider          text not null default 'inpay',
  event_id          text not null,
  provider_order_id text,
  payload           jsonb not null,
  signature_ok      boolean not null,
  received_at       timestamptz not null default now(),
  processed_at      timestamptz,
  error             text,
  unique (provider, event_id)
);

create index if not exists payment_events_order_idx on public.payment_events (provider_order_id);

create table if not exists public.usage_counters (
  user_id      uuid not null references auth.users (id) on delete cascade,
  key          text not null check (key ~ '^[a-z][a-z0-9_]{1,31}$'),
  period_start date not null,
  count        integer not null default 0 check (count >= 0),
  updated_at   timestamptz not null default now(),
  primary key (user_id, key, period_start)
);

-- RLS
alter table public.plans enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;
alter table public.usage_counters enable row level security;

revoke all on table public.plans, public.payments, public.subscriptions,
  public.payment_events, public.usage_counters from anon, authenticated;

-- Tariflar sahifasi uchun: faol tariflarni hamma ko'radi.
grant select on table public.plans to anon, authenticated;
drop policy if exists plans_select_active on public.plans;
create policy plans_select_active on public.plans
  for select to anon, authenticated using (is_active);

-- To'lov: egasi o'qiydi, raw ustunisiz.
grant select (id, user_id, bolim, plan_code, provider, provider_order_id, amount_uzs, status, paid_at, created_at)
  on table public.payments to authenticated;
drop policy if exists payments_select_own on public.payments;
create policy payments_select_own on public.payments
  for select to authenticated using (user_id = (select auth.uid()));

grant select on table public.subscriptions to authenticated;
drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own on public.subscriptions
  for select to authenticated using (user_id = (select auth.uid()));

grant select on table public.usage_counters to authenticated;
drop policy if exists usage_counters_select_own on public.usage_counters;
create policy usage_counters_select_own on public.usage_counters
  for select to authenticated using (user_id = (select auth.uid()));

-- payment_events: mijozga hech narsa (huquq ham, policy ham yo'q).
