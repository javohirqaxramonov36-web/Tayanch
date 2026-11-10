-- 0004. Mashq: sessiyalar, sessiyadagi savollar, urinishlar, xatcho'plar, takrorlash navbati.
-- Sessiya, urinish va navbatni faqat RPC (security definer) yozadi: mijoz is_correct ni soxtalashtira olmaydi.

create table if not exists public.practice_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  bolim          text not null default 'sat' check (bolim = 'sat'),
  mode           text not null check (mode in ('practice', 'timed', 'daily', 'review')),
  filters        jsonb not null default '{}'::jsonb,
  question_count integer not null default 0 check (question_count >= 0),
  daily_date     date,                         -- faqat mode = 'daily'
  started_at     timestamptz not null default now(),
  finished_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint practice_sessions_daily check ((mode = 'daily') = (daily_date is not null))
);

create index if not exists practice_sessions_user_idx on public.practice_sessions (user_id, started_at desc);
create unique index if not exists practice_sessions_daily_key
  on public.practice_sessions (user_id, daily_date) where mode = 'daily';

create or replace trigger practice_sessions_updated_at
  before update on public.practice_sessions
  for each row execute function private.set_updated_at();

-- Qaysi savol qaysi sessiyada berilgan: submit_answer begona savolni shu bilan rad etadi.
create table if not exists public.session_questions (
  session_id  uuid not null references public.practice_sessions (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  position    integer not null check (position >= 1),
  primary key (session_id, question_id)
);

create index if not exists session_questions_question_idx on public.session_questions (question_id);

create table if not exists public.attempts (
  id               bigint generated always as identity primary key,
  user_id          uuid not null references auth.users (id) on delete cascade,
  session_id       uuid not null references public.practice_sessions (id) on delete cascade,
  question_id      uuid not null references public.questions (id) on delete cascade,
  answer           text not null check (char_length(answer) <= 100),
  is_correct       boolean not null,
  time_ms          integer check (time_ms >= 0),
  flagged          boolean not null default false,
  question_version integer not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (session_id, question_id)
);

create index if not exists attempts_user_idx on public.attempts (user_id, created_at desc);
create index if not exists attempts_user_question_idx on public.attempts (user_id, question_id);
create index if not exists attempts_question_idx on public.attempts (question_id);

create or replace trigger attempts_updated_at
  before update on public.attempts
  for each row execute function private.set_updated_at();

create table if not exists public.bookmarks (
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index if not exists bookmarks_question_idx on public.bookmarks (question_id);

-- Leitner qutilari, src/lib/takrorlash.ts bilan bir xil: 1–4 takrorlanadi, 5 = o'zlashtirildi.
create table if not exists public.review_queue (
  user_id          uuid not null references auth.users (id) on delete cascade,
  question_id      uuid not null references public.questions (id) on delete cascade,
  box              smallint not null default 1 check (box between 1 and 5),
  next_due         date not null,
  first_missed_at  timestamptz not null default now(),
  last_reviewed_at timestamptz,
  reason_tag       text check (char_length(reason_tag) <= 40),
  note             text check (char_length(note) <= 1000),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index if not exists review_queue_due_idx on public.review_queue (user_id, next_due) where box < 5;
create index if not exists review_queue_question_idx on public.review_queue (question_id);

create or replace trigger review_queue_updated_at
  before update on public.review_queue
  for each row execute function private.set_updated_at();

-- RLS
alter table public.practice_sessions enable row level security;
alter table public.session_questions enable row level security;
alter table public.attempts enable row level security;
alter table public.bookmarks enable row level security;
alter table public.review_queue enable row level security;

revoke all on table public.practice_sessions, public.session_questions, public.attempts,
  public.bookmarks, public.review_queue from anon, authenticated;

grant select on table public.practice_sessions, public.session_questions, public.attempts,
  public.review_queue to authenticated;
grant update (flagged) on table public.attempts to authenticated;
grant update (reason_tag, note) on table public.review_queue to authenticated;
grant delete on table public.review_queue to authenticated;
grant select, insert, delete on table public.bookmarks to authenticated;

drop policy if exists practice_sessions_select_own on public.practice_sessions;
create policy practice_sessions_select_own on public.practice_sessions
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists session_questions_select_own on public.session_questions;
create policy session_questions_select_own on public.session_questions
  for select to authenticated using (
    exists (select 1 from public.practice_sessions s
            where s.id = session_id and s.user_id = (select auth.uid()))
  );

drop policy if exists attempts_select_own on public.attempts;
create policy attempts_select_own on public.attempts
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists attempts_update_own on public.attempts;
create policy attempts_update_own on public.attempts
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists bookmarks_select_own on public.bookmarks;
create policy bookmarks_select_own on public.bookmarks
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists bookmarks_insert_own on public.bookmarks;
create policy bookmarks_insert_own on public.bookmarks
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists bookmarks_delete_own on public.bookmarks;
create policy bookmarks_delete_own on public.bookmarks
  for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists review_queue_select_own on public.review_queue;
create policy review_queue_select_own on public.review_queue
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists review_queue_update_own on public.review_queue;
create policy review_queue_update_own on public.review_queue
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists review_queue_delete_own on public.review_queue;
create policy review_queue_delete_own on public.review_queue
  for delete to authenticated using (user_id = (select auth.uid()));
