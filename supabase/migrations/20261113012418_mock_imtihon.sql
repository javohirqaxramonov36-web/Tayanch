-- 20261113012418. To'liq mock imtihon (P30, /uz/sat/mashq/mock/): faqat muallifning original, tasdiqlangan
-- savollaridan yig'iladi. College Board testlari ishlatilmaydi. Adaptiv emas: 2-modul ham 1-modul kabi aralash.
-- Takror ishga tushirish xavfsiz (if not exists, create or replace, drop ... if exists).
--
-- Tuzilma (2026-11-12 da rasmiy sahifalarda tekshirilgan):
--   CB03 (structure): R&W 54 savol, ikki 32 daqiqalik modul; Math 44 savol, ikki 35 daqiqalik modul;
--        bo'limlar orasida 10 daqiqa tanaffus; jami 2 soat 14 daqiqa.
--   CB41 (R&W spec), CB42 (Math spec), CB43 (Math overview): modulda R&W 25 + 2 pretest = 27, Math 20 + 2 pretest = 22;
--        soha ulushi R&W ≈26/28/20/26%, Math ≈35/35/15/15%.
--   Tayanch mockida pretest yo'q: 98 savolning hammasi hisoblanadi.
-- Modulda sohalar soni (ulushdan yaxlitlangan, Tayanch qarori):
--   R&W 27 = Craft and Structure 8, Information and Ideas 7, Standard English Conventions 7, Expression of Ideas 5.
--   Math 22 = Algebra 8, Advanced Math 8, Problem-Solving and Data Analysis 3, Geometry and Trigonometry 3.
-- Tayyorlik: har ko'nikmada kamida 8 ta verified savol (N = 8, docs/mock-imtihon.md) va har sohada
--   ikki modulga yetadigan savol. Yetmasa start_mock 'mock_not_ready'; tafsilot admin_mock_readiness() da.
-- Vaqt server tomonda: modul muddati + 30 s dan keyin javob qabul qilinmaydi, modul o'zi yopiladi.
-- Kvota (P19): yangi forma 'mock_first', o'sha formani qayta topshirish 'mock_retake'. Mock ichida
--   sessions / questions / answers kalitlari sarflanmaydi. Limit qiymatlari plans.limits da (hozircha yo'q = cheklovsiz).
-- Ball: "taxminiy", rasmiy emas: bo'lim = 200 + 600 × to'g'ri / jami, 10 ga yaxlitlangan; jami = ikkisi yig'indisi.

create schema if not exists private;

------------------------------------------------------------------------------
-- Sozlamalar
------------------------------------------------------------------------------

create or replace function private.mock_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'min_per_skill', 8,
    'rw_module_ms', 1920000,     -- 32 daqiqa (CB03)
    'math_module_ms', 2100000,   -- 35 daqiqa (CB03)
    'break_ms', 600000,          -- 10 daqiqa (CB03)
    'grace_ms', 30000            -- tarmoq kechikishi uchun
  )
$$;

-- Modul sohalari: bo'lim, soha, modulda nechta, R&W dagi tartib.
create or replace function private.mock_blueprint()
returns table (b_section text, b_domain text, b_per_module integer, b_ord integer)
language sql
immutable
set search_path = ''
as $$
  values
    ('rw', 'Craft and Structure', 8, 1),
    ('rw', 'Information and Ideas', 7, 2),
    ('rw', 'Standard English Conventions', 7, 3),
    ('rw', 'Expression of Ideas', 5, 4),
    ('math', 'Algebra', 8, 1),
    ('math', 'Advanced Math', 8, 2),
    ('math', 'Problem-Solving and Data Analysis', 3, 3),
    ('math', 'Geometry and Trigonometry', 3, 4)
$$;

-- Ko'nikmalar ro'yxati: src/data/satTaksonomiya.ts bilan bir xil (mockTaksonomiya.test.ts tekshiradi).
create or replace function private.mock_skills()
returns table (s_section text, s_domain text, s_skill text)
language sql
immutable
set search_path = ''
as $$
  values
    ('rw', 'Information and Ideas', 'Central Ideas and Details'),
    ('rw', 'Information and Ideas', 'Command of Evidence: Textual'),
    ('rw', 'Information and Ideas', 'Command of Evidence: Quantitative'),
    ('rw', 'Information and Ideas', 'Inferences'),
    ('rw', 'Craft and Structure', 'Words in Context'),
    ('rw', 'Craft and Structure', 'Text Structure and Purpose'),
    ('rw', 'Craft and Structure', 'Cross-Text Connections'),
    ('rw', 'Expression of Ideas', 'Rhetorical Synthesis'),
    ('rw', 'Expression of Ideas', 'Transitions'),
    ('rw', 'Standard English Conventions', 'Boundaries'),
    ('rw', 'Standard English Conventions', 'Form, Structure, and Sense'),
    ('math', 'Algebra', 'Linear equations in one variable'),
    ('math', 'Algebra', 'Linear equations in two variables'),
    ('math', 'Algebra', 'Linear functions'),
    ('math', 'Algebra', 'Systems of two linear equations in two variables'),
    ('math', 'Algebra', 'Linear inequalities in one or two variables'),
    ('math', 'Advanced Math', 'Equivalent expressions'),
    ('math', 'Advanced Math', 'Nonlinear equations in one variable and systems of equations in two variables'),
    ('math', 'Advanced Math', 'Nonlinear functions'),
    ('math', 'Problem-Solving and Data Analysis', 'Ratios, rates, proportional relationships, and units'),
    ('math', 'Problem-Solving and Data Analysis', 'Percentages'),
    ('math', 'Problem-Solving and Data Analysis', 'One-variable data: Distributions and measures of center and spread'),
    ('math', 'Problem-Solving and Data Analysis', 'Two-variable data: Models and scatterplots'),
    ('math', 'Problem-Solving and Data Analysis', 'Probability and conditional probability'),
    ('math', 'Problem-Solving and Data Analysis', 'Inference from sample statistics and margin of error'),
    ('math', 'Problem-Solving and Data Analysis', 'Evaluating statistical claims: Observational studies and experiments'),
    ('math', 'Geometry and Trigonometry', 'Area and volume'),
    ('math', 'Geometry and Trigonometry', 'Lines, angles, and triangles'),
    ('math', 'Geometry and Trigonometry', 'Right triangles and trigonometry'),
    ('math', 'Geometry and Trigonometry', 'Circles')
$$;

create or replace function private.mock_section(p_module integer)
returns text
language sql
immutable
set search_path = ''
as $$
  select case when p_module <= 2 then 'rw' else 'math' end
$$;

create or replace function private.mock_module_ms(p_module integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case when p_module <= 2 then (private.mock_config() ->> 'rw_module_ms')::integer
              else (private.mock_config() ->> 'math_module_ms')::integer end
$$;

-- Taxminiy bo'lim balli (rasmiy konversiya emas): 200 + 600 × to'g'ri / jami, 10 ga yaxlitlangan.
create or replace function private.mock_section_score(p_correct integer, p_total integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case when coalesce(p_total, 0) <= 0 then 200
              else 200 + (round(60.0 * greatest(least(p_correct, p_total), 0) / p_total) * 10)::integer end
$$;

------------------------------------------------------------------------------
-- Jadvallar. Hammasini faqat RPC (security definer) yozadi va o'qiydi: mijozga to'g'ridan-to'g'ri huquq yo'q.
------------------------------------------------------------------------------

-- Forma: foydalanuvchi uchun yig'ilgan 98 savollik to'plam. Retake = shu formani qayta topshirish.
create table if not exists public.mock_forms (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  form_no    integer not null check (form_no >= 1),
  created_at timestamptz not null default now(),
  unique (user_id, form_no)
);

create table if not exists public.mock_form_questions (
  form_id     uuid not null references public.mock_forms (id) on delete cascade,
  module      smallint not null check (module between 1 and 4),
  position    smallint not null check (position >= 1),
  question_id uuid not null references public.questions (id) on delete cascade,
  primary key (form_id, module, position),
  unique (form_id, question_id)
);

create index if not exists mock_form_questions_question_idx on public.mock_form_questions (question_id);

-- Urinish. phase: ready (modul boshlanmagan), module (modul ketyapti), break (tanaffus), done.
create table if not exists public.mock_attempts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  form_id          uuid not null references public.mock_forms (id) on delete cascade,
  kind             text not null check (kind in ('first', 'retake')),
  status           text not null default 'active' check (status in ('active', 'finished', 'abandoned')),
  phase            text not null default 'ready' check (phase in ('ready', 'module', 'break', 'done')),
  current_module   smallint not null default 1 check (current_module between 1 and 4),
  break_started_at timestamptz,
  scores           jsonb,
  started_at       timestamptz not null default now(),
  finished_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint mock_attempts_done check ((status = 'active') = (phase <> 'done'))
);

create index if not exists mock_attempts_user_idx on public.mock_attempts (user_id, started_at desc);
create index if not exists mock_attempts_form_idx on public.mock_attempts (form_id);
-- Bir vaqtda bitta ochiq mock.
create unique index if not exists mock_attempts_one_active on public.mock_attempts (user_id) where status = 'active';

create or replace trigger mock_attempts_updated_at
  before update on public.mock_attempts
  for each row execute function private.set_updated_at();

create table if not exists public.mock_modules (
  attempt_id     uuid not null references public.mock_attempts (id) on delete cascade,
  module         smallint not null check (module between 1 and 4),
  started_at     timestamptz not null default now(),
  deadline_at    timestamptz not null,
  submitted_at   timestamptz,
  auto_submitted boolean not null default false,
  session_id     uuid references public.practice_sessions (id) on delete set null,
  primary key (attempt_id, module)
);

create index if not exists mock_modules_session_idx on public.mock_modules (session_id);

-- Modul davomidagi qoralama javoblar. Baholash faqat modul yopilganda (attempts ga o'tadi).
create table if not exists public.mock_answers (
  attempt_id  uuid not null references public.mock_attempts (id) on delete cascade,
  question_id uuid not null references public.questions (id) on delete cascade,
  answer      text check (char_length(answer) <= 100),
  flagged     boolean not null default false,
  time_ms     integer not null default 0 check (time_ms >= 0),
  updated_at  timestamptz not null default now(),
  primary key (attempt_id, question_id)
);

create index if not exists mock_answers_question_idx on public.mock_answers (question_id);

alter table public.mock_forms enable row level security;
alter table public.mock_form_questions enable row level security;
alter table public.mock_attempts enable row level security;
alter table public.mock_modules enable row level security;
alter table public.mock_answers enable row level security;

revoke all on table public.mock_forms, public.mock_form_questions, public.mock_attempts,
  public.mock_modules, public.mock_answers from anon, authenticated;

-- Modul yopilganda yaratiladigan mashq sessiyasi (attempts, redo, analitika shu orqali).
alter table public.practice_sessions drop constraint if exists practice_sessions_mode_check;
alter table public.practice_sessions add constraint practice_sessions_mode_check
  check (mode in ('practice', 'timed', 'daily', 'review', 'mock'));

------------------------------------------------------------------------------
-- Tayyorlik (admin hisoboti)
------------------------------------------------------------------------------

create or replace function private.mock_readiness()
returns table (kind text, section text, domain text, skill text, verified integer, needed integer, missing integer)
language sql
stable
security definer
set search_path = ''
as $$
  with v as (
    select q.section as v_section, q.domain as v_domain, q.skill as v_skill, count(*)::integer as n
      from public.questions q
     where q.status = 'verified'
     group by 1, 2, 3
  ), n as (
    select (private.mock_config() ->> 'min_per_skill')::integer as k
  )
  select 'skill', s.s_section, s.s_domain, s.s_skill, coalesce(v.n, 0), n.k, greatest(n.k - coalesce(v.n, 0), 0)
    from private.mock_skills() s
    cross join n
    left join v on v.v_section = s.s_section and v.v_domain = s.s_domain and v.v_skill = s.s_skill
  union all
  select 'domain', b.b_section, b.b_domain, null, coalesce(sum(v.n), 0)::integer, b.b_per_module * 2,
         greatest(b.b_per_module * 2 - coalesce(sum(v.n), 0), 0)::integer
    from private.mock_blueprint() b
    left join v on v.v_section = b.b_section and v.v_domain = b.b_domain
   group by b.b_section, b.b_domain, b.b_per_module
$$;

create or replace function private.mock_is_ready()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select not exists (select 1 from private.mock_readiness() r where r.missing > 0)
$$;

-- Admin hisoboti: faqat service role (SQL Editor). Qaysi ko'nikma va sohada nechta savol yetishmaydi.
--   select * from public.admin_mock_readiness() where missing > 0;
create or replace function public.admin_mock_readiness()
returns table (kind text, section text, domain text, skill text, verified integer, needed integer, missing integer)
language sql
stable
security definer
set search_path = ''
as $$
  select * from private.mock_readiness() order by 2, 1 desc, 3, 4
$$;

------------------------------------------------------------------------------
-- Forma yig'ish
------------------------------------------------------------------------------

-- Avval foydalanuvchi ko'rmagan savollar; soha ichida ko'nikmalar navbatma-navbat; tanlanganlar qiyinlik
-- bo'yicha tartiblanib 1- va 2-modulga galma-gal bo'linadi (ikki modul qiyinlik jihatdan teng: adaptiv emas).
-- R&W modulida savollar soha bo'yicha guruhlangan (blueprint tartibi), soha ichida qiyinlik o'sib boradi;
-- Math modulida qiyinlik o'sib boradi. Bu Tayanch tartibi (rasmiy tartib da'vo qilinmaydi).
create or replace function private.mock_build_form(p_user uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_form uuid;
  v_no   integer;
  v_seen uuid[];
  b      record;
  q      record;
  v_got  integer;
  v_flip integer;
  v_ids  uuid[] := '{}';
  v_mods smallint[] := '{}';
  v_keys numeric[] := '{}';
begin
  select coalesce(max(f.form_no), 0) + 1 into v_no from public.mock_forms f where f.user_id = p_user;
  insert into public.mock_forms (user_id, form_no) values (p_user, v_no) returning id into v_form;

  select coalesce(array_agg(distinct x.qid), '{}') into v_seen from (
    select a.question_id as qid from public.attempts a where a.user_id = p_user
    union
    select fq.question_id from public.mock_form_questions fq
      join public.mock_forms f on f.id = fq.form_id
     where f.user_id = p_user and f.id <> v_form
  ) x;

  for b in select * from private.mock_blueprint() loop
    v_got := 0;
    v_flip := (random() < 0.5)::integer;
    for q in
      with pool as (
        select p.id, p.skill, p.difficulty, (p.id = any (v_seen)) as seen, random() as rnd
          from public.questions p
         where p.status = 'verified' and p.section = b.b_section and p.domain = b.b_domain
      ), ranked as (
        select pool.*, row_number() over (partition by pool.skill order by pool.seen, pool.rnd) as rn from pool
      ), picked as (
        select r.id, r.difficulty from ranked r order by r.seen, r.rn, r.rnd limit b.b_per_module * 2
      )
      select pk.id, pk.difficulty, row_number() over (order by pk.difficulty, random()) as k from picked pk
    loop
      v_got := v_got + 1;
      v_ids := v_ids || q.id;
      v_mods := v_mods || ((case when b.b_section = 'rw' then 1 else 3 end) + ((q.k + v_flip) % 2))::smallint;
      v_keys := v_keys || ((case when b.b_section = 'rw' then b.b_ord * 10 else 0 end) + q.difficulty + random() * 0.5)::numeric;
    end loop;
    if v_got < b.b_per_module * 2 then
      raise exception 'mock_not_ready' using errcode = '55000';
    end if;
  end loop;

  insert into public.mock_form_questions (form_id, module, position, question_id)
  select v_form, t.m, row_number() over (partition by t.m order by t.key), t.id
    from unnest(v_ids, v_mods, v_keys) as t (id, m, key);

  return v_form;
end
$$;

------------------------------------------------------------------------------
-- Modulni yopish va baholash
------------------------------------------------------------------------------

create or replace function private.mock_scores(p_attempt uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_form uuid;
  v_rw_t integer; v_rw_c integer; v_m_t integer; v_m_c integer;
  v_rw integer; v_m integer;
begin
  select a.form_id into v_form from public.mock_attempts a where a.id = p_attempt;

  select count(*) filter (where fq.module <= 2), count(*) filter (where fq.module > 2)
    into v_rw_t, v_m_t
    from public.mock_form_questions fq where fq.form_id = v_form;

  select count(*) filter (where mm.module <= 2 and at.is_correct), count(*) filter (where mm.module > 2 and at.is_correct)
    into v_rw_c, v_m_c
    from public.mock_modules mm
    join public.attempts at on at.session_id = mm.session_id
   where mm.attempt_id = p_attempt;

  v_rw := private.mock_section_score(v_rw_c, v_rw_t);
  v_m := private.mock_section_score(v_m_c, v_m_t);
  return jsonb_build_object(
    'estimate', true,
    'rw', jsonb_build_object('correct', v_rw_c, 'total', v_rw_t, 'score', v_rw),
    'math', jsonb_build_object('correct', v_m_c, 'total', v_m_t, 'score', v_m),
    'total', v_rw + v_m
  );
end
$$;

-- Joriy modulni yopadi: mashq sessiyasi + attempts (baho), xatolar redo ro'yxatiga, keyingi bosqichga o'tadi.
-- Chaqiruvchi mock_attempts qatorini "for update" bilan qulflagan bo'lishi kerak.
create or replace function private.mock_close_module(p_attempt uuid, p_auto boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  a       public.mock_attempts;
  m       public.mock_modules;
  v_sess  uuid;
  v_cnt   integer;
  v_end   timestamptz;
  v_today date := private.today_tashkent();
begin
  select * into a from public.mock_attempts x where x.id = p_attempt;
  if a.status <> 'active' or a.phase <> 'module' then
    return;
  end if;
  select * into m from public.mock_modules x where x.attempt_id = a.id and x.module = a.current_module;

  v_end := case when p_auto then least(now(), m.deadline_at) else now() end;

  select count(*) into v_cnt from public.mock_form_questions fq
   where fq.form_id = a.form_id and fq.module = a.current_module;

  insert into public.practice_sessions (user_id, mode, filters, question_count, started_at, finished_at)
  values (a.user_id, 'mock', jsonb_build_object('mock_attempt', a.id, 'module', a.current_module),
          v_cnt, m.started_at, v_end)
  returning id into v_sess;

  insert into public.session_questions (session_id, question_id, position)
  select v_sess, fq.question_id, fq.position
    from public.mock_form_questions fq
   where fq.form_id = a.form_id and fq.module = a.current_module;

  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, time_ms, flagged, question_version)
  select a.user_id, v_sess, ma.question_id, ma.answer,
         private.check_answer(q.format, q.correct, ma.answer), ma.time_ms, ma.flagged, q.version
    from public.mock_answers ma
    join public.mock_form_questions fq
      on fq.form_id = a.form_id and fq.module = a.current_module and fq.question_id = ma.question_id
    join public.questions q on q.id = ma.question_id
   where ma.attempt_id = a.id and nullif(btrim(ma.answer), '') is not null;

  -- Xatolar redo ro'yxatiga (submit_answer bilan bir xil qoida: 1-quti, ertaga).
  insert into public.review_queue (user_id, question_id, box, next_due, first_missed_at, last_reviewed_at)
  select a.user_id, at.question_id, 1, v_today + 1, now(), now()
    from public.attempts at
   where at.session_id = v_sess and not at.is_correct
  on conflict (user_id, question_id) do update
    set box = 1, next_due = excluded.next_due, last_reviewed_at = now();

  update public.mock_modules x
     set submitted_at = v_end, auto_submitted = p_auto, session_id = v_sess
   where x.attempt_id = a.id and x.module = a.current_module;

  if a.current_module = 4 then
    update public.mock_attempts x
       set status = 'finished', phase = 'done', finished_at = v_end, scores = private.mock_scores(a.id)
     where x.id = a.id;
  elsif a.current_module = 2 then
    update public.mock_attempts x
       set phase = 'break', current_module = 3, break_started_at = v_end
     where x.id = a.id;
  else
    update public.mock_attempts x
       set phase = 'ready', current_module = a.current_module + 1
     where x.id = a.id;
  end if;
end
$$;

-- Muddati o'tgan modulni yopadi (uzilishdan keyin qaytganda). Chaqiruvchi qatorni qulflagan bo'ladi.
create or replace function private.mock_tick(p_attempt uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  a public.mock_attempts;
begin
  select * into a from public.mock_attempts x where x.id = p_attempt;
  if a.status = 'active' and a.phase = 'module' and exists (
    select 1 from public.mock_modules m
     where m.attempt_id = a.id and m.module = a.current_module
       and now() > m.deadline_at + make_interval(secs => (private.mock_config() ->> 'grace_ms')::numeric / 1000)
  ) then
    perform private.mock_close_module(a.id, true);
  end if;
end
$$;

-- Mijozga beriladigan holat. Savollar faqat boshlangan joriy modul uchun va JAVOBSIZ.
create or replace function private.mock_payload(p_attempt uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'attempt_id', a.id,
    'form_id', a.form_id,
    'form_no', f.form_no,
    'kind', a.kind,
    'status', a.status,
    'phase', a.phase,
    'current_module', a.current_module,
    'started_at', a.started_at,
    'finished_at', a.finished_at,
    'break_started_at', a.break_started_at,
    'server_now', now(),
    'config', private.mock_config() - 'min_per_skill',
    'scores', a.scores,
    'modules', (
      select jsonb_agg(jsonb_build_object(
               'module', g.m,
               'section', private.mock_section(g.m),
               'question_count', (select count(*) from public.mock_form_questions fq
                                   where fq.form_id = a.form_id and fq.module = g.m),
               'time_ms', private.mock_module_ms(g.m),
               'started_at', mm.started_at,
               'deadline_at', mm.deadline_at,
               'submitted_at', mm.submitted_at,
               'auto_submitted', coalesce(mm.auto_submitted, false)
             ) order by g.m)
        from generate_series(1, 4) as g (m)
        left join public.mock_modules mm on mm.attempt_id = a.id and mm.module = g.m
    ),
    'questions', case when a.phase = 'module' then coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', q.id,
               'position', fq.position,
               'section', q.section,
               'format', q.format,
               'passage', q.passage,
               'stem', q.stem,
               'options', (select jsonb_agg(jsonb_build_object('key', e.opt ->> 'key', 'text', e.opt ->> 'text')
                                            order by e.ord)
                           from jsonb_array_elements(q.options) with ordinality as e (opt, ord)),
               'figure', case when q.figure is null then null else
                           jsonb_build_object('path', q.figure ->> 'path', 'alt', q.figure ->> 'alt',
                                              'caption', q.figure ->> 'caption') end
             ) order by fq.position)
        from public.mock_form_questions fq
        join public.questions q on q.id = fq.question_id
       where fq.form_id = a.form_id and fq.module = a.current_module
    ), '[]'::jsonb) else '[]'::jsonb end,
    'answers', case when a.phase = 'module' then coalesce((
      select jsonb_agg(jsonb_build_object('question_id', ma.question_id, 'answer', ma.answer,
                                          'flagged', ma.flagged, 'time_ms', ma.time_ms))
        from public.mock_answers ma
        join public.mock_form_questions fq
          on fq.form_id = a.form_id and fq.module = a.current_module and fq.question_id = ma.question_id
       where ma.attempt_id = a.id
    ), '[]'::jsonb) else '[]'::jsonb end
  )
  from public.mock_attempts a
  join public.mock_forms f on f.id = a.form_id
  where a.id = p_attempt
$$;

-- Urinishni egasi bilan qulflab oladi, muddati o'tgan modulni yopadi.
create or replace function private.mock_lock(p_user uuid, p_attempt uuid)
returns public.mock_attempts
language plpgsql
security definer
set search_path = ''
as $$
declare
  a public.mock_attempts;
begin
  select * into a from public.mock_attempts x where x.id = p_attempt and x.user_id = p_user for update;
  if not found then
    raise exception 'mock_not_found' using errcode = 'P0002';
  end if;
  perform private.mock_tick(a.id);
  select * into a from public.mock_attempts x where x.id = p_attempt;
  return a;
end
$$;

------------------------------------------------------------------------------
-- RPC'lar
------------------------------------------------------------------------------

-- Kirish sahifasi: tayyormi (faqat ha/yo'q), ochiq urinish, tarix, kreditlar.
create or replace function public.mock_status()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user   uuid := private.require_user();
  v_active uuid;
  v_plan   public.plans;
begin
  select a.id into v_active from public.mock_attempts a where a.user_id = v_user and a.status = 'active';
  if v_active is not null then
    perform private.mock_lock(v_user, v_active);
  end if;
  v_plan := private.current_plan(v_user, 'sat');

  return jsonb_build_object(
    'ready', private.mock_is_ready(),
    'active', (select jsonb_build_object('attempt_id', a.id, 'form_no', f.form_no, 'kind', a.kind,
                                         'phase', a.phase, 'current_module', a.current_module,
                                         'started_at', a.started_at)
                 from public.mock_attempts a join public.mock_forms f on f.id = a.form_id
                where a.user_id = v_user and a.status = 'active'),
    'history', coalesce((
      select jsonb_agg(h.j order by h.t desc) from (
        select a.started_at as t,
               jsonb_build_object('attempt_id', a.id, 'form_id', a.form_id, 'form_no', f.form_no, 'kind', a.kind,
                                  'status', a.status, 'started_at', a.started_at, 'finished_at', a.finished_at,
                                  'scores', a.scores) as j
          from public.mock_attempts a join public.mock_forms f on f.id = a.form_id
         where a.user_id = v_user and a.status <> 'active'
         order by a.started_at desc
         limit 30
      ) h
    ), '[]'::jsonb),
    'credits', (
      select jsonb_object_agg(k.key, jsonb_build_object(
               'max', case when jsonb_typeof(v_plan.limits -> k.key -> 'max') = 'number'
                           then (v_plan.limits -> k.key ->> 'max')::integer end,
               'per', coalesce(v_plan.limits -> k.key ->> 'per', 'day'),
               'used', coalesce((select c.count from public.usage_counters c
                                  where c.user_id = v_user and c.key = k.key
                                    and c.period_start = private.period_start(coalesce(v_plan.limits -> k.key ->> 'per', 'day'))), 0),
               'resets_at', private.period_end(coalesce(v_plan.limits -> k.key ->> 'per', 'day'))))
        from (values ('mock_first'), ('mock_retake')) as k (key)
    ),
    'plan', jsonb_build_object('code', v_plan.code, 'name', v_plan.name)
  );
end
$$;

-- Yangi mock (p_form null) yoki o'sha formani qayta topshirish (retake). Kredit shu yerda sarflanadi.
create or replace function public.start_mock(p_form uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_form uuid;
  v_kind text;
  v_id   uuid;
begin
  -- Bir foydalanuvchining parallel so'rovlari ketma-ket bajariladi.
  perform pg_advisory_xact_lock(hashtextextended('mock:' || v_user::text, 0));

  if exists (select 1 from public.mock_attempts a where a.user_id = v_user and a.status = 'active') then
    select a.id into v_id from public.mock_attempts a where a.user_id = v_user and a.status = 'active';
    perform private.mock_lock(v_user, v_id);
    if exists (select 1 from public.mock_attempts a where a.id = v_id and a.status = 'active') then
      raise exception 'mock_in_progress' using errcode = '55000';
    end if;
  end if;

  if p_form is null then
    if not private.mock_is_ready() then
      raise exception 'mock_not_ready' using errcode = '55000';
    end if;
    perform private.consume_quota(v_user, 'mock_first', 1);
    v_form := private.mock_build_form(v_user);
    v_kind := 'first';
  else
    select f.id into v_form from public.mock_forms f where f.id = p_form and f.user_id = v_user;
    if not found then
      raise exception 'mock_not_found' using errcode = 'P0002';
    end if;
    if exists (select 1 from public.mock_form_questions fq join public.questions q on q.id = fq.question_id
                where fq.form_id = v_form and q.status <> 'verified') then
      raise exception 'mock_form_unavailable' using errcode = '55000';
    end if;
    perform private.consume_quota(v_user, 'mock_retake', 1);
    v_kind := 'retake';
  end if;

  insert into public.mock_attempts (user_id, form_id, kind) values (v_user, v_form, v_kind) returning id into v_id;
  return private.mock_payload(v_id);
end
$$;

create or replace function public.get_mock(p_attempt uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
begin
  perform private.mock_lock(v_user, p_attempt);
  return private.mock_payload(p_attempt);
end
$$;

-- Modulni boshlaydi (ready yoki break holatidan). Vaqt shu paytdan sanaladi. Takror chaqiruv xavfsiz.
create or replace function public.mock_start_module(p_attempt uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  a      public.mock_attempts;
begin
  a := private.mock_lock(v_user, p_attempt);
  if a.status = 'active' and a.phase in ('ready', 'break') then
    insert into public.mock_modules (attempt_id, module, started_at, deadline_at)
    values (a.id, a.current_module, now(),
            now() + make_interval(secs => private.mock_module_ms(a.current_module)::numeric / 1000))
    on conflict (attempt_id, module) do nothing;
    update public.mock_attempts x set phase = 'module' where x.id = a.id;
  end if;
  return private.mock_payload(p_attempt);
end
$$;

-- Qoralama javoblarni saqlaydi (navbatdan bir nechtasi bir so'rovda):
--   p_items = [{"question_id": uuid, "answer": text|null, "flagged": bool, "time_ms": int}, ...]
-- Faqat joriy, boshlangan modul savollari; muddat + grace dan keyin {"module_closed": true}.
create or replace function public.mock_save(p_attempt uuid, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  a      public.mock_attempts;
  v_n    integer;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 30 then
    raise exception 'invalid_items' using errcode = '22023';
  end if;
  if exists (select 1 from jsonb_array_elements(p_items) e
              where char_length(e ->> 'answer') > 100) then
    raise exception 'invalid_answer' using errcode = '22023';
  end if;

  a := private.mock_lock(v_user, p_attempt);
  if a.status <> 'active' or a.phase <> 'module' then
    -- Xato emas: mock_lock muddati o'tgan modulni yopgan bo'lishi mumkin, u saqlanib qolsin.
    return jsonb_build_object('saved', 0, 'module_closed', true, 'server_now', now());
  end if;

  insert into public.mock_answers as ma (attempt_id, question_id, answer, flagged, time_ms, updated_at)
  select a.id, fq.question_id,
         nullif(btrim(e ->> 'answer'), ''),
         coalesce((e ->> 'flagged')::boolean, false),
         least(greatest(coalesce((e ->> 'time_ms')::integer, 0), 0), private.mock_module_ms(a.current_module)),
         now()
    from jsonb_array_elements(p_items) e
    join public.mock_form_questions fq
      on fq.form_id = a.form_id and fq.module = a.current_module
     and fq.question_id = (e ->> 'question_id')::uuid
  on conflict (attempt_id, question_id) do update
    set answer = excluded.answer, flagged = excluded.flagged,
        time_ms = greatest(ma.time_ms, excluded.time_ms), updated_at = now();
  get diagnostics v_n = row_count;

  return jsonb_build_object('saved', v_n, 'server_now', now());
end
$$;

-- Modulni topshiradi ("Next module" / "Finish"). p_module joriy modul bo'lmasa (ikkinchi tab, takror bosish)
-- hech narsa o'zgarmaydi, joriy holat qaytadi.
create or replace function public.mock_submit_module(p_attempt uuid, p_module integer)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  a      public.mock_attempts;
begin
  a := private.mock_lock(v_user, p_attempt);
  if a.status = 'active' and a.phase = 'module' and a.current_module = p_module then
    perform private.mock_close_module(a.id, false);
  end if;
  return private.mock_payload(p_attempt);
end
$$;

-- Mockni tugatmasdan to'xtatish. Joriy modul javoblari baholanadi (redo ro'yxatiga tushadi), ball qo'yilmaydi.
create or replace function public.mock_abandon(p_attempt uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  a      public.mock_attempts;
begin
  a := private.mock_lock(v_user, p_attempt);
  if a.status = 'active' then
    if a.phase = 'module' then
      -- 4-modulda bu urinishni "finished" qiladi; pastdagi update baribir "abandoned" ga o'tkazadi.
      perform private.mock_close_module(a.id, false);
    end if;
    update public.mock_attempts x
       set status = 'abandoned', phase = 'done', finished_at = coalesce(x.finished_at, now()), scores = null
     where x.id = a.id;
  end if;
  return private.mock_payload(p_attempt);
end
$$;

-- Natija: taxminiy ball, har savol (matn, javob, to'g'ri javob, tushuntirish), redo holati.
create or replace function public.get_mock_result(p_attempt uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  a      public.mock_attempts;
begin
  select * into a from public.mock_attempts x where x.id = p_attempt and x.user_id = v_user;
  if not found then
    raise exception 'mock_not_found' using errcode = 'P0002';
  end if;
  if a.status <> 'finished' then
    raise exception 'mock_not_finished' using errcode = '55000';
  end if;

  return private.mock_payload(p_attempt) || jsonb_build_object(
    'questions', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', q.id,
               'module', fq.module,
               'position', fq.position,
               'section', q.section,
               'domain', q.domain,
               'skill', q.skill,
               'difficulty', q.difficulty,
               'format', q.format,
               'passage', q.passage,
               'stem', q.stem,
               'options', (select jsonb_agg(jsonb_build_object('key', e.opt ->> 'key', 'text', e.opt ->> 'text')
                                            order by e.ord)
                           from jsonb_array_elements(q.options) with ordinality as e (opt, ord)),
               'figure', case when q.figure is null then null else
                           jsonb_build_object('path', q.figure ->> 'path', 'alt', q.figure ->> 'alt',
                                              'caption', q.figure ->> 'caption') end,
               'answer', at.answer,
               'is_correct', coalesce(at.is_correct, false),
               'answered', at.id is not null,
               'flagged', coalesce(at.flagged, false),
               'time_ms', at.time_ms,
               'correct', case q.format when 'mcq' then q.correct -> 'choice' else q.correct -> 'accepted' end,
               'explanation', q.explanation,
               'in_review', exists (select 1 from public.review_queue r
                                     where r.user_id = v_user and r.question_id = q.id and r.box < 5),
               'reason_tag', (select r.reason_tag from public.review_queue r
                               where r.user_id = v_user and r.question_id = q.id and r.box < 5)
             ) order by fq.module, fq.position)
        from public.mock_form_questions fq
        join public.questions q on q.id = fq.question_id
        left join public.mock_modules mm on mm.attempt_id = a.id and mm.module = fq.module
        left join public.attempts at on at.session_id = mm.session_id and at.question_id = fq.question_id
       where fq.form_id = a.form_id
    ), '[]'::jsonb)
  );
end
$$;

------------------------------------------------------------------------------
-- Rasm: mock formasidagi savol rasmi ham o'qiladi (modul davomida sessiya hali yo'q).
------------------------------------------------------------------------------
create or replace function public.can_read_question_figure(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.session_questions sq
    join public.practice_sessions s on s.id = sq.session_id
    join public.questions q on q.id = sq.question_id
    where s.user_id = auth.uid()
      and q.status = 'verified'
      and q.figure ->> 'path' = p_name
  ) or exists (
    select 1
    from public.mock_form_questions fq
    join public.mock_forms f on f.id = fq.form_id
    join public.questions q on q.id = fq.question_id
    where f.user_id = auth.uid()
      and q.status = 'verified'
      and q.figure ->> 'path' = p_name
  )
$$;

------------------------------------------------------------------------------
-- Huquqlar
------------------------------------------------------------------------------
revoke all on function private.mock_config() from public, anon, authenticated;
revoke all on function private.mock_blueprint() from public, anon, authenticated;
revoke all on function private.mock_skills() from public, anon, authenticated;
revoke all on function private.mock_section(integer) from public, anon, authenticated;
revoke all on function private.mock_module_ms(integer) from public, anon, authenticated;
revoke all on function private.mock_section_score(integer, integer) from public, anon, authenticated;
revoke all on function private.mock_readiness() from public, anon, authenticated;
revoke all on function private.mock_is_ready() from public, anon, authenticated;
revoke all on function private.mock_build_form(uuid) from public, anon, authenticated;
revoke all on function private.mock_scores(uuid) from public, anon, authenticated;
revoke all on function private.mock_close_module(uuid, boolean) from public, anon, authenticated;
revoke all on function private.mock_tick(uuid) from public, anon, authenticated;
revoke all on function private.mock_payload(uuid) from public, anon, authenticated;
revoke all on function private.mock_lock(uuid, uuid) from public, anon, authenticated;

revoke all on function public.admin_mock_readiness() from public, anon, authenticated;
grant execute on function public.admin_mock_readiness() to service_role;

revoke all on function public.mock_status() from public, anon;
revoke all on function public.start_mock(uuid) from public, anon;
revoke all on function public.get_mock(uuid) from public, anon;
revoke all on function public.mock_start_module(uuid) from public, anon;
revoke all on function public.mock_save(uuid, jsonb) from public, anon;
revoke all on function public.mock_submit_module(uuid, integer) from public, anon;
revoke all on function public.mock_abandon(uuid) from public, anon;
revoke all on function public.get_mock_result(uuid) from public, anon;

grant execute on function public.mock_status() to authenticated;
grant execute on function public.start_mock(uuid) to authenticated;
grant execute on function public.get_mock(uuid) to authenticated;
grant execute on function public.mock_start_module(uuid) to authenticated;
grant execute on function public.mock_save(uuid, jsonb) to authenticated;
grant execute on function public.mock_submit_module(uuid, integer) to authenticated;
grant execute on function public.mock_abandon(uuid) to authenticated;
grant execute on function public.get_mock_result(uuid) to authenticated;
