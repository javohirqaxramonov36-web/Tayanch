-- 0003. Savollar banki. Mazmuni migratsiyaga yozilmaydi.
-- Faqat original savollar: AI qoralama, muallif tasdiqlaydi (verified_by). College Board materiali qo'yilmaydi.
-- Mijoz bu jadvalni to'g'ridan-to'g'ri o'qiy olmaydi: savollar faqat RPC orqali, javobsiz beriladi.

create table if not exists public.questions (
  id           uuid primary key default gen_random_uuid(),
  external_id  text not null unique check (external_id ~ '^[a-z0-9][a-z0-9._-]{1,63}$'),
  section      text not null check (section in ('math', 'rw')),
  domain       text not null check (char_length(domain) between 1 and 80),
  skill        text not null check (char_length(skill) between 1 and 80),
  difficulty   smallint not null check (difficulty between 1 and 5),
  format       text not null check (format in ('mcq', 'spr')),
  passage      text,
  stem         text not null,
  -- mcq: [{"key": "A", "text": "..."}, ...]; spr: null
  options      jsonb,
  -- mcq: {"choice": "B"}; spr: {"accepted": ["1/2", ".5"]} (ekvivalent kasr va o'nlik avtomatik teng)
  correct      jsonb not null,
  explanation  text,
  -- {"path": "<bucket ichidagi yo'l>", "alt": "...", "caption": "..."}; javob bu yerga yozilmaydi
  figure       jsonb,
  status       text not null default 'draft' check (status in ('draft', 'verified', 'hidden')),
  source       text not null default 'original',
  author       text,
  verified_by  text,
  version      integer not null default 1,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint questions_shape check (
    (format = 'mcq'
      and jsonb_typeof(options) = 'array' and jsonb_array_length(options) between 2 and 6
      and jsonb_typeof(correct -> 'choice') = 'string')
    or
    (format = 'spr'
      and options is null
      and jsonb_typeof(correct -> 'accepted') = 'array' and jsonb_array_length(correct -> 'accepted') > 0)
  ),
  constraint questions_verified_by check (status <> 'verified' or verified_by is not null),
  constraint questions_figure_path check (figure is null or jsonb_typeof(figure -> 'path') = 'string')
);

create index if not exists questions_verified_topic_idx
  on public.questions (section, domain, skill, difficulty) where status = 'verified';

create or replace trigger questions_updated_at
  before update on public.questions
  for each row execute function private.set_updated_at();

-- Mazmun o'zgarsa versiya oshadi (attempts.question_version qaysi matnga javob berilganini saqlaydi).
create or replace function private.questions_bump_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.passage, new.stem, new.options, new.correct, new.explanation, new.figure)
     is distinct from (old.passage, old.stem, old.options, old.correct, old.explanation, old.figure) then
    new.version := old.version + 1;
  end if;
  return new;
end
$$;

create or replace trigger questions_bump_version
  before update on public.questions
  for each row execute function private.questions_bump_version();

-- RLS yoqilgan, policy yo'q, huquq ham yo'q: anon va authenticated hech narsa ko'rmaydi.
alter table public.questions enable row level security;
revoke all on table public.questions from anon, authenticated;
