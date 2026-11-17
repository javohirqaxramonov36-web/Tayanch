-- 0007. Savol haqida xabar, fikr-mulohaza, hodisalar (P25) va admin jurnali.

create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  session_id  uuid references public.practice_sessions (id) on delete set null,
  reason      text not null check (reason in ('wrong_answer', 'typo', 'unclear', 'figure', 'other')),
  message     text check (char_length(message) <= 2000),
  status      text not null default 'open' check (status in ('open', 'reviewed', 'closed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists reports_question_idx on public.reports (question_id, status);
create index if not exists reports_user_idx on public.reports (user_id);

create or replace trigger reports_updated_at before update on public.reports
  for each row execute function private.set_updated_at();

create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  page       text check (char_length(page) <= 300),
  message    text not null check (char_length(message) between 1 and 4000),
  rating     smallint check (rating between 1 and 5),
  created_at timestamptz not null default now()
);

create index if not exists feedback_user_idx on public.feedback (user_id);

-- P25 analitika: mijoz faqat yozadi, o'qimaydi.
create table if not exists public.events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name       text not null check (name ~ '^[a-z][a-z0-9_.]{1,63}$'),
  props      jsonb not null default '{}'::jsonb check (pg_column_size(props) <= 8192),
  page       text check (char_length(page) <= 300),
  created_at timestamptz not null default now()
);

create index if not exists events_user_idx on public.events (user_id, created_at desc);
create index if not exists events_name_idx on public.events (name, created_at desc);

-- Admin amallari (qo'lda tarif berish, savolni yashirish). Faqat service role.
create table if not exists public.audit_log (
  id           bigint generated always as identity primary key,
  actor        text not null,
  action       text not null,
  target_table text not null,
  target_id    text,
  details      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists audit_log_target_idx on public.audit_log (target_table, target_id);

-- RLS
alter table public.reports enable row level security;
alter table public.feedback enable row level security;
alter table public.events enable row level security;
alter table public.audit_log enable row level security;

revoke all on table public.reports, public.feedback, public.events, public.audit_log from anon, authenticated;

grant select on table public.reports to authenticated;
grant insert (question_id, session_id, reason, message) on table public.reports to authenticated;
drop policy if exists reports_select_own on public.reports;
create policy reports_select_own on public.reports
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists reports_insert_own on public.reports;
create policy reports_insert_own on public.reports
  for insert to authenticated with check (user_id = (select auth.uid()));

grant select on table public.feedback to authenticated;
grant insert (page, message, rating) on table public.feedback to authenticated;
drop policy if exists feedback_select_own on public.feedback;
create policy feedback_select_own on public.feedback
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists feedback_insert_own on public.feedback;
create policy feedback_insert_own on public.feedback
  for insert to authenticated with check (user_id = (select auth.uid()));

grant insert (name, props, page) on table public.events to authenticated;
drop policy if exists events_insert_own on public.events;
create policy events_insert_own on public.events
  for insert to authenticated with check (user_id = (select auth.uid()));

-- audit_log: mijozga hech narsa.
