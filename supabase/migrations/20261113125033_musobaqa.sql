-- 20261113125033. P32 2-PR: SAT musobaqalari (vaqt oynasi, savollar to'plami, natija jadvali). Mukofot yo'q.
-- Qoidalar hujjati: docs/xp-qoidasi.md, "Musobaqa" bo'limi. Takror ishga tushirish xavfsiz.
--
-- Asosiy fikrlar:
--   * Musobaqani muallif SQL bilan yaratadi: private.contest_create(...). Savollar faqat status = 'verified' va
--     rasmsiz (trigger tekshiradi). Musobaqa boshlangach savollar, boshlanish vaqti va davomiylik o'zgarmaydi.
--   * Qatnashish: contest_start → practice_sessions (mode = 'contest') + contest_entries. Bir foydalanuvchiga bitta
--     urinish. Shaxsiy muddat: least(ends_at, started_at + duration_min).
--   * Javob submit_answer orqali, lekin contest sessiyasida u public.attempts ga EMAS, private.contest_answers ga
--     yoziladi. Sabab: attempts ni foydalanuvchi o'zi o'qiy oladi (is_correct ustuni), analitika, xato daftari va
--     XP triggeri ham attempts dan oladi. Shunday qilib musobaqa davomida to'g'ri/xato hech qayerda ko'rinmaydi,
--     kvota sarflanmaydi, review_queue ga yozilmaydi va XP berilmaydi (attempts_award_xp ishga tushmaydi).
--   * Musobaqa savollari yaratilgandan ends_at gacha Savol banki (filtered_questions), kun savoli (daily_pick) va
--     "Add to redo list" (add_to_review) dan chiqariladi: javobni oldindan bilib bo'lmaydi.
--   * Natija jadvali (contest_results) va o'z sharhi (contest_review) faqat ends_at dan keyin. Tartib: ball
--     (to'g'ri javoblar soni) kamayish, keyin vaqt (boshlashdan oxirgi javobgacha) o'sish; teng = bir xil o'rin.
--     Jadvalda faqat 1-PR qoidasi: leaderboard_members a'zosi, yashirilmagan, ruxsat etilgan laqab, age_group =
--     'adult' (private.leaderboard_eligible). Boshqalar faqat o'z natijasini ko'radi.

------------------------------------------------------------------------------
-- 1. practice_sessions.mode: 'contest'
------------------------------------------------------------------------------
alter table public.practice_sessions drop constraint if exists practice_sessions_mode_check;
alter table public.practice_sessions add constraint practice_sessions_mode_check
  check (mode in ('practice', 'timed', 'daily', 'review', 'contest'));

------------------------------------------------------------------------------
-- 2. Jadvallar
------------------------------------------------------------------------------
create table if not exists public.contests (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,39}$'),
  title        text not null check (char_length(btrim(title)) between 3 and 80),
  description  text check (char_length(description) <= 300),
  starts_at    timestamptz not null,
  ends_at      timestamptz not null,
  duration_min integer not null check (duration_min between 1 and 300),
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint contests_window check (ends_at > starts_at)
);

create or replace trigger contests_updated_at
  before update on public.contests
  for each row execute function private.set_updated_at();

create table if not exists public.contest_questions (
  contest_id  uuid not null references public.contests (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  position    integer not null check (position >= 1),
  primary key (contest_id, question_id),
  unique (contest_id, position)
);

create index if not exists contest_questions_question_idx on public.contest_questions (question_id);

create table if not exists public.contest_entries (
  contest_id  uuid not null references public.contests (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  session_id  uuid not null unique references public.practice_sessions (id) on delete cascade,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  primary key (contest_id, user_id)
);

create index if not exists contest_entries_user_idx on public.contest_entries (user_id);

-- Javoblar: mijoz o'qiy olmaydi (private sxema, huquq yo'q). Faqat RPC.
create table if not exists private.contest_answers (
  session_id       uuid not null references public.practice_sessions (id) on delete cascade,
  question_id      uuid not null references public.questions (id) on delete cascade,
  user_id          uuid not null references auth.users (id) on delete cascade,
  answer           text not null check (char_length(answer) <= 100),
  is_correct       boolean not null,
  time_ms          integer check (time_ms >= 0),
  question_version integer not null,
  answered_at      timestamptz not null default now(),
  primary key (session_id, question_id)
);

create index if not exists contest_answers_user_idx on private.contest_answers (user_id);

-- RLS
alter table public.contests enable row level security;
alter table public.contest_questions enable row level security;
alter table public.contest_entries enable row level security;
alter table private.contest_answers enable row level security;

revoke all on table public.contests, public.contest_questions, public.contest_entries from anon, authenticated;
revoke all on table private.contest_answers from public, anon, authenticated;
grant select on table public.contests to anon, authenticated;
grant select on table public.contest_entries to authenticated;
-- contest_questions: hech kimga to'g'ridan-to'g'ri o'qish yo'q (savollar ro'yxati musobaqa boshlanguncha sir).

drop policy if exists contests_select_published on public.contests;
create policy contests_select_published on public.contests
  for select to anon, authenticated using (published);

drop policy if exists contest_entries_select_own on public.contest_entries;
create policy contest_entries_select_own on public.contest_entries
  for select to authenticated using (user_id = (select auth.uid()));

------------------------------------------------------------------------------
-- 3. Yordamchilar va himoya triggerlari
------------------------------------------------------------------------------

-- Savol hali tugamagan (yoki boshlanmagan) musobaqada: bank, kun savoli va takrorlash ro'yxatiga berilmaydi.
create or replace function private.contest_reserved(p_question uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.contest_questions cq
                 join public.contests c on c.id = cq.contest_id
                 where cq.question_id = p_question and c.ends_at > now())
$$;

create or replace function private.contest_status(p_c public.contests)
returns text
language sql
stable
set search_path = ''
as $$
  select case when now() < p_c.starts_at then 'upcoming' when now() < p_c.ends_at then 'open' else 'ended' end
$$;

-- Shaxsiy muddat: oyna yopilishi yoki boshlagandan duration_min o'tishi, qaysi biri oldin bo'lsa.
create or replace function private.contest_deadline(p_c public.contests, p_started timestamptz)
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select least(p_c.ends_at, p_started + make_interval(mins => p_c.duration_min))
$$;

-- Savollar: faqat tasdiqlangan va rasmsiz; musobaqa boshlangach qo'shish/o'zgartirish/o'chirish yo'q.
-- (Butun musobaqani o'chirish mumkin: kaskad paytida musobaqa qatori allaqachon yo'q.)
create or replace function private.contest_questions_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_q public.questions;
begin
  if tg_op in ('UPDATE', 'DELETE') and exists (select 1 from public.contests c
                                               where c.id = old.contest_id and c.starts_at <= now()) then
    raise exception 'contest_started' using errcode = '55000';
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    if exists (select 1 from public.contests c where c.id = new.contest_id and c.starts_at <= now()) then
      raise exception 'contest_started' using errcode = '55000';
    end if;
    select * into v_q from public.questions q where q.id = new.question_id;
    if not found or v_q.status <> 'verified' then
      raise exception 'question_not_verified' using errcode = '22023';
    end if;
    if v_q.figure is not null then
      raise exception 'question_has_figure' using errcode = '22023';
    end if;
    return new;
  end if;
  return old;
end
$$;

drop trigger if exists contest_questions_guard on public.contest_questions;
create trigger contest_questions_guard
  before insert or update or delete on public.contest_questions
  for each row execute function private.contest_questions_guard();

-- Boshlangan musobaqada boshlanish vaqti va davomiylik o'zgarmaydi. ends_at ni muallif o'zgartira oladi
-- (shaxsiy muddat har safar qayta hisoblanadi).
create or replace function private.contests_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.starts_at <= now() and (new.starts_at is distinct from old.starts_at
                                 or new.duration_min is distinct from old.duration_min) then
    raise exception 'contest_started' using errcode = '55000';
  end if;
  return new;
end
$$;

drop trigger if exists contests_guard on public.contests;
create trigger contests_guard
  before update on public.contests
  for each row execute function private.contests_guard();

-- Muallif uchun (SQL editor, postgres roli):
--   select private.contest_create('nov-math-1', 'November Math Sprint', '2026-11-20 18:00+05', '2026-11-20 21:00+05',
--                                 30, array['<savol uuid>', '<savol uuid>']::uuid[]);
create or replace function private.contest_create(p_slug text, p_title text, p_starts timestamptz, p_ends timestamptz,
                                                  p_duration_min integer, p_questions uuid[],
                                                  p_description text default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_questions is null or cardinality(p_questions) < 1 or cardinality(p_questions) > 50 then
    raise exception 'contest_question_count' using errcode = '22023';
  end if;
  if (select count(distinct x) from unnest(p_questions) x) <> cardinality(p_questions) then
    raise exception 'contest_question_duplicate' using errcode = '22023';
  end if;
  if p_starts is null or p_starts <= now() then
    raise exception 'contest_starts_in_past' using errcode = '22023';
  end if;

  insert into public.contests (slug, title, description, starts_at, ends_at, duration_min)
  values (p_slug, btrim(p_title), nullif(btrim(coalesce(p_description, '')), ''), p_starts, p_ends, p_duration_min)
  returning id into v_id;

  insert into public.contest_questions (contest_id, question_id, position)
  select v_id, x.qid, x.pos::integer from unnest(p_questions) with ordinality as x(qid, pos);

  return v_id;
end
$$;

-- Ballar: kamida bitta javob bergan qatnashchilar. time_ms = boshlashdan oxirgi javobgacha (muddat bilan cheklangan).
create or replace function private.contest_scores(p_contest uuid)
returns table (user_id uuid, score integer, time_ms bigint, answered integer)
language sql
stable
security definer
set search_path = ''
as $$
  select e.user_id,
         (count(*) filter (where a.is_correct))::integer,
         greatest(0, least(round(extract(epoch from (max(a.answered_at) - e.started_at)) * 1000),
                           c.duration_min::bigint * 60000))::bigint,
         count(*)::integer
    from public.contest_entries e
    join public.contests c on c.id = e.contest_id
    join private.contest_answers a on a.session_id = e.session_id
   where e.contest_id = p_contest
   group by e.user_id, e.started_at, c.duration_min
$$;

-- Musobaqa haqida umumiy ma'lumot (savollarsiz).
create or replace function private.contest_info(p_c public.contests)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'slug', p_c.slug,
    'title', p_c.title,
    'description', p_c.description,
    'starts_at', p_c.starts_at,
    'ends_at', p_c.ends_at,
    'duration_min', p_c.duration_min,
    'question_count', (select count(*) from public.contest_questions cq where cq.contest_id = p_c.id),
    'status', private.contest_status(p_c))
$$;

create or replace function private.contest_entry_info(p_c public.contests, p_e public.contest_entries)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select case when p_e.session_id is null then null else jsonb_build_object(
    'session_id', p_e.session_id,
    'started_at', p_e.started_at,
    'deadline', private.contest_deadline(p_c, p_e.started_at),
    'finished', p_e.finished_at is not null or now() >= private.contest_deadline(p_c, p_e.started_at),
    'answered', (select count(*) from private.contest_answers a where a.session_id = p_e.session_id)) end
$$;

-- submit_answer ning contest tarmog'i. Natija (is_correct, correct, explanation) QAYTMAYDI: hidden = true.
create or replace function private.contest_submit(p_user uuid, p_session public.practice_sessions, p_q public.questions,
                                                  p_answer text, p_time_ms integer)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_e public.contest_entries;
  v_c public.contests;
  v_javob jsonb := jsonb_build_object('accepted', true, 'hidden', true,
                                      'is_correct', null, 'correct', null, 'explanation', null);
begin
  select * into v_e from public.contest_entries e where e.session_id = p_session.id and e.user_id = p_user;
  select * into v_c from public.contests c where c.id = v_e.contest_id;
  if v_e.session_id is null or v_c.id is null then
    raise exception 'session_not_found' using errcode = 'P0002';
  end if;

  if exists (select 1 from private.contest_answers a where a.session_id = p_session.id and a.question_id = p_q.id) then
    return v_javob || jsonb_build_object('already_answered', true);
  end if;
  if p_session.finished_at is not null or v_e.finished_at is not null then
    raise exception 'session_finished' using errcode = '55000';
  end if;
  if now() < v_c.starts_at or now() >= private.contest_deadline(v_c, v_e.started_at) then
    raise exception 'contest_closed' using errcode = '55000';
  end if;
  if p_answer is null or char_length(p_answer) > 100 then
    raise exception 'invalid_answer' using errcode = '22023';
  end if;

  insert into private.contest_answers (session_id, question_id, user_id, answer, is_correct, time_ms, question_version)
  values (p_session.id, p_q.id, p_user, p_answer, private.check_answer(p_q.format, p_q.correct, p_answer),
          case when p_time_ms >= 0 then p_time_ms end, p_q.version)
  on conflict (session_id, question_id) do nothing;
  if not found then
    return v_javob || jsonb_build_object('already_answered', true);
  end if;

  -- Hamma savolga javob berildi: urinish yakunlanadi (vaqt shu yerda to'xtaydi).
  if (select count(*) from private.contest_answers a where a.session_id = p_session.id) >= p_session.question_count then
    update public.practice_sessions s set finished_at = now() where s.id = p_session.id and s.finished_at is null;
    update public.contest_entries e set finished_at = now() where e.session_id = p_session.id and e.finished_at is null;
  end if;

  return v_javob || jsonb_build_object('already_answered', false);
end
$$;

------------------------------------------------------------------------------
-- 4. Mavjud funksiyalar: musobaqa savollarini oldindan berilishdan himoya
------------------------------------------------------------------------------

-- filtered_questions (0008 dan): o'zgarish faqat "and not private.contest_reserved(q.id)".
create or replace function private.filtered_questions(p_user uuid, f jsonb)
returns setof public.questions
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  f := coalesce(f, '{}'::jsonb);
  if jsonb_typeof(f) <> 'object' then
    raise exception 'invalid_filters' using errcode = '22023';
  end if;

  return query
  select q.*
  from public.questions q
  where q.status = 'verified'
    and not private.contest_reserved(q.id)
    and (f ->> 'section' is null or q.section = f ->> 'section')
    and (jsonb_typeof(f -> 'domains') is distinct from 'array' or jsonb_array_length(f -> 'domains') = 0
         or q.domain in (select jsonb_array_elements_text(f -> 'domains')))
    and (jsonb_typeof(f -> 'skills') is distinct from 'array' or jsonb_array_length(f -> 'skills') = 0
         or q.skill in (select jsonb_array_elements_text(f -> 'skills')))
    and (jsonb_typeof(f -> 'difficulties') is distinct from 'array' or jsonb_array_length(f -> 'difficulties') = 0
         or q.difficulty in (select (jsonb_array_elements_text(f -> 'difficulties'))::smallint))
    and (coalesce((f ->> 'unanswered_only')::boolean, false) = false
         or not exists (select 1 from public.attempts a where a.user_id = p_user and a.question_id = q.id))
    and (coalesce((f ->> 'incorrect_only')::boolean, false) = false
         or exists (select 1 from public.attempts a
                    where a.user_id = p_user and a.question_id = q.id and not a.is_correct))
    and (coalesce((f ->> 'bookmarked_only')::boolean, false) = false
         or exists (select 1 from public.bookmarks b where b.user_id = p_user and b.question_id = q.id));
end
$$;

-- daily_pick (20261111220000 dan): o'zgarish faqat ikki joyda "and not private.contest_reserved(q.id)".
create or replace function private.daily_pick(p_day date)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_qid     uuid;
  v_section text := private.daily_section(p_day);
begin
  select p.question_id into v_qid
    from public.daily_picks p
    join public.questions q on q.id = p.question_id
   where p.day = p_day and q.status = 'verified' and q.figure is null and not private.contest_reserved(q.id);
  if found then
    return v_qid;
  end if;

  -- Avvalgi tanlov endi yaroqsiz (yashirilgan, rasm qo'shilgan yoki musobaqaga olingan): qayta tanlanadi.
  delete from public.daily_picks p where p.day = p_day;

  select q.id into v_qid
    from public.questions q
   where q.status = 'verified' and q.figure is null and not private.contest_reserved(q.id)
   order by (q.section <> v_section),
            (select max(p.day) from public.daily_picks p where p.question_id = q.id) nulls first,
            md5(q.external_id || p_day::text)
   limit 1;
  if v_qid is null then
    return null;
  end if;

  insert into public.daily_picks (day, question_id, section)
  select p_day, q.id, q.section from public.questions q where q.id = v_qid
  on conflict (day) do nothing;

  -- Parallel so'rov boshqasini yozib ulgurgan bo'lsa, o'shanisi (hamma uchun bitta).
  select p.question_id into v_qid from public.daily_picks p where p.day = p_day;
  return v_qid;
end
$$;

-- add_to_review (20261110120000 dan): tugamagan musobaqa savoli takrorlash ro'yxatiga qo'yilmaydi.
create or replace function public.add_to_review(p_question uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := private.require_user();
  v_today date := private.today_tashkent();
begin
  if not exists (select 1 from public.session_questions sq
                 join public.practice_sessions s on s.id = sq.session_id
                 where s.user_id = v_user and sq.question_id = p_question) then
    raise exception 'question_not_in_session' using errcode = 'P0002';
  end if;
  if private.contest_reserved(p_question) then
    raise exception 'question_in_contest' using errcode = '55000';
  end if;

  insert into public.review_queue (user_id, question_id, box, next_due)
  values (v_user, p_question, 1, v_today + 1)
  on conflict (user_id, question_id) do update
    set box = 1, next_due = v_today + 1
    where public.review_queue.box >= 5;

  return jsonb_build_object('in_review', true);
end
$$;

-- submit_answer (20261111220000 dan). O'zgarish faqat 'contest' sessiyasida: private.contest_submit ga o'tadi
-- (vaqt oynasi, natija yashirin, kvota va review_queue yo'q, attempts ga yozilmaydi). Qolgani avvalgidek.
create or replace function public.submit_answer(p_session uuid, p_question uuid, p_answer text, p_time_ms integer default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user    uuid := private.require_user();
  v_session public.practice_sessions;
  v_q       public.questions;
  v_attempt public.attempts;
  v_correct boolean;
  v_today   date := private.today_tashkent();
  v_box     smallint;
begin
  select * into v_session from public.practice_sessions s where s.id = p_session and s.user_id = v_user;
  if not found then
    raise exception 'session_not_found' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.session_questions sq
                 where sq.session_id = p_session and sq.question_id = p_question) then
    raise exception 'question_not_in_session' using errcode = 'P0002';
  end if;

  select * into v_q from public.questions q where q.id = p_question;
  if not found or v_q.status <> 'verified' then
    raise exception 'question_unavailable' using errcode = 'P0002';
  end if;

  if v_session.mode = 'contest' then
    return private.contest_submit(v_user, v_session, v_q, p_answer, p_time_ms);
  end if;

  select * into v_attempt from public.attempts a where a.session_id = p_session and a.question_id = p_question;
  if found then
    return jsonb_build_object(
      'is_correct', v_attempt.is_correct,
      'correct', case v_q.format when 'mcq' then v_q.correct -> 'choice' else v_q.correct -> 'accepted' end,
      'explanation', v_q.explanation,
      'already_answered', true);
  end if;

  if v_session.finished_at is not null then
    raise exception 'session_finished' using errcode = '55000';
  end if;

  if v_session.mode = 'daily' and v_session.daily_date <> v_today then
    raise exception 'daily_expired' using errcode = '55000';
  end if;

  if p_answer is null or char_length(p_answer) > 100 then
    raise exception 'invalid_answer' using errcode = '22023';
  end if;

  v_correct := private.check_answer(v_q.format, v_q.correct, p_answer);

  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, time_ms, question_version)
  values (v_user, p_session, p_question, p_answer, v_correct,
          case when p_time_ms >= 0 then p_time_ms end, v_q.version)
  on conflict (session_id, question_id) do nothing;

  if not found then
    -- Boshqa so'rov shu orada yozib ulgurdi: uning natijasi qaytadi, kvota va navbat qayta o'zgarmaydi.
    select * into v_attempt from public.attempts a where a.session_id = p_session and a.question_id = p_question;
    return jsonb_build_object(
      'is_correct', v_attempt.is_correct,
      'correct', case v_q.format when 'mcq' then v_q.correct -> 'choice' else v_q.correct -> 'accepted' end,
      'explanation', v_q.explanation,
      'already_answered', true);
  end if;

  -- Takrorlash navbati (src/lib/takrorlash.ts bilan bir xil):
  -- xato → 1-quti, ertaga; takrorlash sessiyasida to'g'ri → keyingi quti (1→2: 3 kun, 2→3: 7, 3→4: 14), 4-qutida → 5 (o'zlashtirildi).
  if not v_correct then
    insert into public.review_queue (user_id, question_id, box, next_due, first_missed_at, last_reviewed_at)
    values (v_user, p_question, 1, v_today + 1, now(), now())
    on conflict (user_id, question_id) do update
      set box = 1, next_due = v_today + 1, last_reviewed_at = now();
  elsif v_session.mode = 'review' then
    select r.box into v_box from public.review_queue r
     where r.user_id = v_user and r.question_id = p_question for update;
    if found and v_box < 5 then
      update public.review_queue r
         set box = v_box + 1,
             next_due = v_today + case v_box when 1 then 3 when 2 then 7 when 3 then 14 else 0 end,
             last_reviewed_at = now()
       where r.user_id = v_user and r.question_id = p_question;
    end if;
  end if;

  update public.practice_sessions s
     set finished_at = now()
   where s.id = p_session and s.finished_at is null
     and (select count(*) from public.attempts a where a.session_id = p_session) >= s.question_count;

  if v_session.mode <> 'daily' then
    perform private.consume_quota(v_user, 'answers', 1);
  end if;

  return jsonb_build_object(
    'is_correct', v_correct,
    'correct', case v_q.format when 'mcq' then v_q.correct -> 'choice' else v_q.correct -> 'accepted' end,
    'explanation', v_q.explanation,
    'already_answered', false);
end
$$;

------------------------------------------------------------------------------
-- 5. RPC
------------------------------------------------------------------------------

-- Ro'yxat: ochiq, keyingi va oxirgi 20 ta tugagan musobaqa. Mehmon ham ko'radi (o'z yozuvi faqat kirganda).
create or replace function public.contest_list()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
begin
  return jsonb_build_object(
    'server_now', now(),
    'contests', coalesce((
      select jsonb_agg(x.j order by x.tartib, x.vaqt)
        from (
          select private.contest_info(c)
                   || jsonb_build_object('entry', private.contest_entry_info(c, e)) as j,
                 case private.contest_status(c) when 'open' then 0 when 'upcoming' then 1 else 2 end as tartib,
                 case when now() < c.ends_at then extract(epoch from c.starts_at)
                      else -extract(epoch from c.ends_at) end as vaqt
            from public.contests c
            left join public.contest_entries e on e.contest_id = c.id and e.user_id = v_user
           where c.published
             and (c.ends_at > now()
                  or c.id in (select c2.id from public.contests c2
                               where c2.published and c2.ends_at <= now()
                               order by c2.ends_at desc limit 20))
        ) x), '[]'::jsonb));
end
$$;

-- Bitta musobaqa holati. Urinish davom etayotgan bo'lsa: savollar (javobsiz) va saqlangan javoblar (faqat matni).
create or replace function public.contest_state(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_c    public.contests;
  v_e    public.contest_entries;
  v_info jsonb;
begin
  select * into v_c from public.contests c where c.slug = p_slug and c.published;
  if not found then
    raise exception 'contest_not_found' using errcode = 'P0002';
  end if;
  select * into v_e from public.contest_entries e where e.contest_id = v_c.id and e.user_id = v_user;

  v_info := private.contest_entry_info(v_c, v_e);
  return private.contest_info(v_c) || jsonb_build_object(
    'server_now', now(),
    'entry', v_info,
    'questions', case when v_info is not null and not (v_info ->> 'finished')::boolean
                      then private.session_payload(v_e.session_id) -> 'questions' end,
    'answers', case when v_info is not null then coalesce((
                 select jsonb_object_agg(a.question_id, a.answer)
                   from private.contest_answers a where a.session_id = v_e.session_id), '{}'::jsonb) end);
end
$$;

-- Boshlash (yoki davom etish: urinish bor bo'lsa holati qaytadi). Kvota sarflamaydi.
create or replace function public.contest_start(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_c    public.contests;
  v_ids  uuid[];
  v_sid  uuid;
begin
  select * into v_c from public.contests c where c.slug = p_slug and c.published;
  if not found then
    raise exception 'contest_not_found' using errcode = 'P0002';
  end if;
  if exists (select 1 from public.contest_entries e where e.contest_id = v_c.id and e.user_id = v_user) then
    return public.contest_state(p_slug);
  end if;
  if now() < v_c.starts_at then
    raise exception 'contest_not_started' using errcode = '55000';
  end if;
  if now() >= v_c.ends_at then
    raise exception 'contest_closed' using errcode = '55000';
  end if;

  select array_agg(cq.question_id order by cq.position) into v_ids
    from public.contest_questions cq
    join public.questions q on q.id = cq.question_id and q.status = 'verified'
   where cq.contest_id = v_c.id;
  if v_ids is null then
    raise exception 'contest_empty' using errcode = 'P0002';
  end if;

  v_sid := private.create_session(v_user, 'contest', jsonb_build_object('contest', v_c.slug), v_ids);
  insert into public.contest_entries (contest_id, user_id, session_id)
  values (v_c.id, v_user, v_sid)
  on conflict (contest_id, user_id) do nothing;
  if not found then
    -- Parallel so'rov urinishni ochib ulgurdi: ortiqcha sessiya o'chiriladi.
    delete from public.practice_sessions s where s.id = v_sid;
  end if;

  return public.contest_state(p_slug);
end
$$;

-- Muddatidan oldin yakunlash ("Finish"). Takror chaqirilsa birinchi vaqt qoladi.
create or replace function public.contest_finish(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_e    public.contest_entries;
begin
  select e.* into v_e from public.contest_entries e join public.contests c on c.id = e.contest_id
   where c.slug = p_slug and e.user_id = v_user;
  if not found then
    raise exception 'contest_entry_not_found' using errcode = 'P0002';
  end if;
  update public.contest_entries e set finished_at = coalesce(e.finished_at, now())
   where e.contest_id = v_e.contest_id and e.user_id = v_user;
  update public.practice_sessions s set finished_at = coalesce(s.finished_at, now()) where s.id = v_e.session_id;
  return public.contest_state(p_slug);
end
$$;

-- Natija jadvali: faqat musobaqa tugagach. Eng ko'pi 100 qator + o'z qatori (100 dan pastda bo'lsa).
-- rows faqat reytingga ruxsati bor (18+) chaqiruvchiga; me hammaga (kamida bitta javob bergan bo'lsa).
create or replace function public.contest_results(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user     uuid := private.require_user();
  v_c        public.contests;
  v_eligible boolean := private.leaderboard_eligible(v_user);
  v_rows     jsonb;
  v_me_row   jsonb;
  v_my_rank  bigint;
  v_me       jsonb;
begin
  select * into v_c from public.contests c where c.slug = p_slug and c.published;
  if not found then
    raise exception 'contest_not_found' using errcode = 'P0002';
  end if;
  if now() < v_c.ends_at then
    raise exception 'contest_not_ended' using errcode = '55000';
  end if;

  with ball as (
    select * from private.contest_scores(v_c.id)
  ), jadval as (
    select b.user_id, b.score, b.time_ms, p.nickname,
           case when m.show_country then p.country end as country,
           rank() over (order by b.score desc, b.time_ms asc) as orin,
           row_number() over (order by b.score desc, b.time_ms asc, lower(p.nickname)) as tartib
      from ball b
      join public.leaderboard_members m on m.user_id = b.user_id and m.hidden_at is null
      join public.profiles p on p.id = b.user_id
     where private.nickname_allowed(p.nickname)
       and private.leaderboard_eligible(b.user_id)
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'rank', j.orin, 'nickname', j.nickname, 'country', j.country, 'score', j.score, 'time_ms', j.time_ms,
           'me', j.user_id = v_user) order by j.tartib) filter (where j.tartib <= 100), '[]'::jsonb),
         (array_agg(jsonb_build_object(
           'rank', j.orin, 'nickname', j.nickname, 'country', j.country, 'score', j.score, 'time_ms', j.time_ms,
           'me', true)) filter (where j.user_id = v_user and j.tartib > 100))[1],
         (array_agg(j.orin) filter (where j.user_id = v_user))[1]
    into v_rows, v_me_row, v_my_rank
    from jadval j;

  select jsonb_build_object('score', b.score, 'time_ms', b.time_ms, 'answered', b.answered, 'rank', v_my_rank)
    into v_me
    from private.contest_scores(v_c.id) b where b.user_id = v_user;

  return private.contest_info(v_c) || jsonb_build_object(
    'eligible', v_eligible,
    'entered', exists (select 1 from public.contest_entries e where e.contest_id = v_c.id and e.user_id = v_user),
    'rows', case when v_eligible then v_rows else '[]'::jsonb end,
    'me_row', case when v_eligible then v_me_row end,
    'me', v_me);
end
$$;

-- O'z sharhi: faqat musobaqa tugagach va qatnashgan bo'lsa. Savol, javobingiz, to'g'ri javob, tushuntirish.
create or replace function public.contest_review(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_c    public.contests;
  v_e    public.contest_entries;
begin
  select * into v_c from public.contests c where c.slug = p_slug and c.published;
  if not found then
    raise exception 'contest_not_found' using errcode = 'P0002';
  end if;
  if now() < v_c.ends_at then
    raise exception 'contest_not_ended' using errcode = '55000';
  end if;
  select * into v_e from public.contest_entries e where e.contest_id = v_c.id and e.user_id = v_user;
  if not found then
    raise exception 'contest_entry_not_found' using errcode = 'P0002';
  end if;

  return jsonb_build_object(
    'slug', v_c.slug,
    'items', coalesce((
      select jsonb_agg(private.question_public(q.id) || jsonb_build_object(
               'position', sq.position,
               'answer', a.answer,
               'is_correct', a.is_correct,
               'correct', private.correct_public(q.format, q.correct),
               'explanation', q.explanation) order by sq.position)
        from public.session_questions sq
        join public.questions q on q.id = sq.question_id
        left join private.contest_answers a on a.session_id = sq.session_id and a.question_id = sq.question_id
       where sq.session_id = v_e.session_id), '[]'::jsonb));
end
$$;

------------------------------------------------------------------------------
-- 6. Huquqlar
------------------------------------------------------------------------------
revoke all on function private.contest_reserved(uuid) from public, anon, authenticated;
revoke all on function private.contest_status(public.contests) from public, anon, authenticated;
revoke all on function private.contest_deadline(public.contests, timestamptz) from public, anon, authenticated;
revoke all on function private.contest_questions_guard() from public, anon, authenticated;
revoke all on function private.contests_guard() from public, anon, authenticated;
revoke all on function private.contest_create(text, text, timestamptz, timestamptz, integer, uuid[], text) from public, anon, authenticated;
revoke all on function private.contest_scores(uuid) from public, anon, authenticated;
revoke all on function private.contest_info(public.contests) from public, anon, authenticated;
revoke all on function private.contest_entry_info(public.contests, public.contest_entries) from public, anon, authenticated;
revoke all on function private.contest_submit(uuid, public.practice_sessions, public.questions, text, integer) from public, anon, authenticated;
revoke all on function private.filtered_questions(uuid, jsonb) from public, anon, authenticated;
revoke all on function private.daily_pick(date) from public, anon, authenticated;

revoke all on function public.add_to_review(uuid) from public, anon;
revoke all on function public.submit_answer(uuid, uuid, text, integer) from public, anon;
revoke all on function public.contest_list() from public;
revoke all on function public.contest_state(text) from public, anon;
revoke all on function public.contest_start(text) from public, anon;
revoke all on function public.contest_finish(text) from public, anon;
revoke all on function public.contest_results(text) from public, anon;
revoke all on function public.contest_review(text) from public, anon;

grant execute on function public.add_to_review(uuid) to authenticated;
grant execute on function public.submit_answer(uuid, uuid, text, integer) to authenticated;
grant execute on function public.contest_list() to anon, authenticated;
grant execute on function public.contest_state(text) to authenticated;
grant execute on function public.contest_start(text) to authenticated;
grant execute on function public.contest_finish(text) to authenticated;
grant execute on function public.contest_results(text) to authenticated;
grant execute on function public.contest_review(text) to authenticated;
