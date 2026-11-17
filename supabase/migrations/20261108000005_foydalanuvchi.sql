-- 0005. Foydalanuvchi o'zi kiritadigan ma'lumot: rasmiy test natijalari, reja, kalit-qiymat sinxronlash, lug'at.
-- Hammasida: faqat o'z qatorlari (select/insert/update/delete).

-- Rasmiy (Bluebook) test natijasi: foydalanuvchi o'zi yozadi. Savol matni saqlanmaydi.
create table if not exists public.official_tests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  test_name   text not null check (char_length(test_name) between 1 and 80),
  taken_on    date,
  -- College Board shkalasi: umumiy 400–1600, bo'lim 200–800. Faqat yaroqlilik tekshiruvi.
  total_score integer check (total_score between 400 and 1600),
  rw_score    integer check (rw_score between 200 and 800),
  math_score  integer check (math_score between 200 and 800),
  notes       text check (char_length(notes) <= 2000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists official_tests_user_idx on public.official_tests (user_id, taken_on desc);

-- Rasmiy testdagi xato: faqat raqam, mavzu va o'z izohi. Savol yoki passage matnini ko'chirib yozmang.
create table if not exists public.official_mistakes (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null default auth.uid() references auth.users (id) on delete cascade,
  official_test_id uuid not null references public.official_tests (id) on delete cascade,
  section          text not null check (section in ('math', 'rw')),
  module           smallint check (module in (1, 2)),
  question_number  smallint check (question_number between 1 and 99),
  domain           text check (char_length(domain) <= 80),
  skill            text check (char_length(skill) <= 80),
  reason_tag       text check (char_length(reason_tag) <= 40),
  note             text check (char_length(note) <= 1000),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists official_mistakes_user_idx on public.official_mistakes (user_id);
create index if not exists official_mistakes_test_idx on public.official_mistakes (official_test_id);

create table if not exists public.study_plans (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title        text not null check (char_length(title) between 1 and 120),
  exam_date    date,
  target_score integer check (target_score between 400 and 1600),
  status       text not null default 'active' check (status in ('active', 'archived')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists study_plans_user_idx on public.study_plans (user_id);

create table if not exists public.plan_tasks (
  id         uuid primary key default gen_random_uuid(),
  plan_id    uuid not null references public.study_plans (id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  due_on     date,
  title      text not null check (char_length(title) between 1 and 200),
  kind       text check (char_length(kind) <= 40),
  ref        text check (char_length(ref) <= 300),          -- ichki sahifa yo'li yoki savol external_id
  position   integer not null default 0,
  done_at    timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plan_tasks_plan_idx on public.plan_tasks (plan_id, position);
create index if not exists plan_tasks_user_due_idx on public.plan_tasks (user_id, due_on);

-- Oddiy kalit-qiymat sinxronlash: brauzerdagi tayanch:* kalitlarining server nusxasi.
-- Hajm chegarasi texnik himoya (256 KB), tarif emas.
create table if not exists public.user_state (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  key        text not null check (key ~ '^tayanch:[a-z0-9:_-]{1,92}$'),
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, key),
  constraint user_state_size check (pg_column_size(value) <= 262144)
);

-- Lug'at so'zlari: tasdiqlanganini hamma o'qiydi (hozirgi lug'at sahifasi ham ochiq).
create table if not exists public.vocab_words (
  id             uuid primary key default gen_random_uuid(),
  word           text not null check (char_length(word) between 1 and 80),
  part_of_speech text check (char_length(part_of_speech) <= 20),
  definition     text not null,
  example        text,
  status         text not null default 'draft' check (status in ('draft', 'verified', 'hidden')),
  author         text,
  verified_by    text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint vocab_words_verified_by check (status <> 'verified' or verified_by is not null)
);

create unique index if not exists vocab_words_word_key on public.vocab_words (lower(word));

-- Holatlar mavjud tayanch:sat-lugat bilan mos: learning = "o'rganyapman", known = "bilaman".
create table if not exists public.vocab_progress (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  word_id    uuid not null references public.vocab_words (id) on delete cascade,
  status     text not null check (status in ('new', 'learning', 'known')),
  box        smallint check (box between 1 and 5),
  next_due   date,
  updated_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

create index if not exists vocab_progress_word_idx on public.vocab_progress (word_id);

-- updated_at triggerlari
create or replace trigger official_tests_updated_at before update on public.official_tests
  for each row execute function private.set_updated_at();
create or replace trigger official_mistakes_updated_at before update on public.official_mistakes
  for each row execute function private.set_updated_at();
create or replace trigger study_plans_updated_at before update on public.study_plans
  for each row execute function private.set_updated_at();
create or replace trigger plan_tasks_updated_at before update on public.plan_tasks
  for each row execute function private.set_updated_at();
create or replace trigger user_state_updated_at before update on public.user_state
  for each row execute function private.set_updated_at();
create or replace trigger vocab_words_updated_at before update on public.vocab_words
  for each row execute function private.set_updated_at();
create or replace trigger vocab_progress_updated_at before update on public.vocab_progress
  for each row execute function private.set_updated_at();

-- RLS: o'z qatorlari. Bir xil to'rt policy'ni har jadvalga qo'yadi.
do $$
declare
  t text;
begin
  foreach t in array array['official_tests', 'official_mistakes', 'study_plans', 'plan_tasks',
                           'user_state', 'vocab_progress']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', t);

    execute format('drop policy if exists %I on public.%I', t || '_select_own', t);
    execute format('create policy %I on public.%I for select to authenticated using (user_id = (select auth.uid()))',
                   t || '_select_own', t);
    execute format('drop policy if exists %I on public.%I', t || '_insert_own', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (user_id = (select auth.uid()))',
                   t || '_insert_own', t);
    execute format('drop policy if exists %I on public.%I', t || '_update_own', t);
    execute format('create policy %I on public.%I for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))',
                   t || '_update_own', t);
    execute format('drop policy if exists %I on public.%I', t || '_delete_own', t);
    execute format('create policy %I on public.%I for delete to authenticated using (user_id = (select auth.uid()))',
                   t || '_delete_own', t);
  end loop;
end
$$;

-- Bola qator ota qatori ham o'ziniki bo'lishi kerak (boshqaning testiga/rejasiga yozib bo'lmaydi).
drop policy if exists official_mistakes_parent_own on public.official_mistakes;
create policy official_mistakes_parent_own on public.official_mistakes
  as restrictive for all to authenticated
  using (true)
  with check (exists (select 1 from public.official_tests t
                      where t.id = official_test_id and t.user_id = (select auth.uid())));

drop policy if exists plan_tasks_parent_own on public.plan_tasks;
create policy plan_tasks_parent_own on public.plan_tasks
  as restrictive for all to authenticated
  using (true)
  with check (exists (select 1 from public.study_plans p
                      where p.id = plan_id and p.user_id = (select auth.uid())));

-- vocab_words: faqat tasdiqlangan so'zlarni o'qish.
alter table public.vocab_words enable row level security;
revoke all on table public.vocab_words from anon, authenticated;
grant select on table public.vocab_words to anon, authenticated;

drop policy if exists vocab_words_select_verified on public.vocab_words;
create policy vocab_words_select_verified on public.vocab_words
  for select to anon, authenticated using (status = 'verified');
