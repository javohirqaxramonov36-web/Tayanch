-- 20261113111947. P31 ni P30 ga ulash: mock imtihonda adaptive-style 2-modul (Tayanch qoidasi, rasmiy SAT algoritmi
-- yoki IRT emas). Hujjat: docs/sat-adaptiv.md ("P30 ga ulash"). Bog'liq: 20261113012418_mock_imtihon.sql (P30),
-- 20261113072953_adaptiv_tarmoq.sql (private.adaptive_branch / adaptive_difficulties).
--
-- Xatti-harakat (Claude qarori, muallif topshirig'i bilan, 2026-11-13):
--   1. 1-modul (R&W) yoki 3-modul (Math) yopilganda (topshirish, vaqt tugashi yoki to'xtatish) tarmoq SERVERDA tanlanadi:
--      to'g'ri = shu modulda to'g'ri javoblar, jami = modul savollari (bo'sh javob = xato).
--   2. Savol soni: shu bo'limda verified, blueprint sohasidagi, shu urinishda ishlatilmagan savollar, har tarmoq
--      qiyinliklari bo'yicha. Tarmoq oson/qiyin bo'lsa-yu biror sohada 2-modulga yetmasa → standart (savol-kam).
--   3. oson / qiyin: 2-modul savollari URINISH darajasida (mock_attempt_questions) qayta tanlanadi; forma o'zgarmaydi,
--      shuning uchun retake va eski natijalar buzilmaydi. Soha soni va tartib P30 dagidek, avval ko'rilmagan savollar.
--   4. standart: hech narsa yozilmaydi, formaning 2-moduli (P30 tartibi).
--   5. Tarmoq, sabab va aniqlik qarorni bergan modul qatorida (mock_modules, module 1 yoki 3: next_branch*):
--      2-/4-modul qatori faqat modul boshlanganda yaratiladi (deadline_at not null).
--   6. Imtihon davomida tarmoq mijozga berilmaydi (mock_payload); faqat get_mock_result (tugagan mock) da "adaptive".
--   7. Retake: 1-modul o'sha, tarmoq va 2-modul qayta tanlanadi.
-- Takror ishga tushirish xavfsiz (if not exists, create or replace, drop ... if exists).

------------------------------------------------------------------------------
-- Jadval va ustunlar
------------------------------------------------------------------------------

-- Urinishning adaptiv 2-moduli (faqat oson/qiyin tarmoqda). Bo'lsa, shu modul uchun formaning o'rnini bosadi.
create table if not exists public.mock_attempt_questions (
  attempt_id  uuid not null references public.mock_attempts (id) on delete cascade,
  module      smallint not null check (module in (2, 4)),
  position    smallint not null check (position >= 1),
  question_id uuid not null references public.questions (id) on delete cascade,
  primary key (attempt_id, module, position),
  unique (attempt_id, question_id)
);

create index if not exists mock_attempt_questions_question_idx on public.mock_attempt_questions (question_id);

alter table public.mock_attempt_questions enable row level security;
revoke all on table public.mock_attempt_questions from anon, authenticated;

alter table public.mock_modules add column if not exists next_branch text;
alter table public.mock_modules add column if not exists next_branch_reason text;
alter table public.mock_modules add column if not exists next_branch_accuracy numeric;

alter table public.mock_modules drop constraint if exists mock_modules_next_branch_check;
alter table public.mock_modules add constraint mock_modules_next_branch_check check (
  (next_branch is null and next_branch_reason is null)
  or (module in (1, 3) and next_branch in ('standart', 'oson', 'qiyin')
      and next_branch_reason in ('chegara-yoq', 'savol-kam', 'natija-yoq', 'ustida', 'ostida'))
);

------------------------------------------------------------------------------
-- Urinish savollari: forma + adaptiv almashtirish
------------------------------------------------------------------------------

-- Urinishning haqiqiy savollari (hamma modul). Modulda mock_attempt_questions bo'lsa, formaning o'sha moduli o'rniga.
create or replace function private.mock_questions(p_attempt uuid)
returns table (q_module smallint, q_position smallint, q_question_id uuid)
language sql
stable
security definer
set search_path = ''
as $$
  select fq.module, fq.position, fq.question_id
    from public.mock_attempts a
    join public.mock_form_questions fq on fq.form_id = a.form_id
   where a.id = p_attempt
     and not exists (select 1 from public.mock_attempt_questions aq
                      where aq.attempt_id = a.id and aq.module = fq.module)
  union all
  select aq.module, aq.position, aq.question_id
    from public.mock_attempt_questions aq
   where aq.attempt_id = p_attempt
$$;

-- Tarmoqni tanlaydi va (oson/qiyin bo'lsa) keyingi modulni yig'adi. p_module = 1 yoki 3, p_session = shu modulning
-- baholangan mashq sessiyasi. mock_close_module ichidan chaqiriladi (qator qulflangan). Tarmoqni qaytaradi.
create or replace function private.mock_adapt(p_attempt uuid, p_module integer, p_session uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user    uuid;
  v_section text := private.mock_section(p_module);
  v_next    smallint := (p_module + 1)::smallint;
  v_total   integer;
  v_correct integer;
  v_used    uuid[];
  v_seen    uuid[];
  v_easy    integer;
  v_hard    integer;
  v_diff    smallint[];
  v_branch  text;
  v_reason  text;
  v_acc     numeric;
begin
  if p_module not in (1, 3) then
    return null;
  end if;
  select a.user_id into v_user from public.mock_attempts a where a.id = p_attempt;

  -- Takror chaqiruv (masalan qayta yopish) tarmoqni o'zgartirmaydi.
  if exists (select 1 from public.mock_modules mm
              where mm.attempt_id = p_attempt and mm.module = p_module and mm.next_branch is not null) then
    return (select mm.next_branch from public.mock_modules mm where mm.attempt_id = p_attempt and mm.module = p_module);
  end if;

  select count(*) into v_total from private.mock_questions(p_attempt) x where x.q_module = p_module;
  select count(*) into v_correct from public.attempts at where at.session_id = p_session and at.is_correct;

  -- Shu urinishda ishlatilgan (keyingi moduldan tashqari hamma modul).
  select coalesce(array_agg(x.q_question_id), '{}') into v_used
    from private.mock_questions(p_attempt) x where x.q_module <> v_next;

  select count(*) filter (where q.difficulty = any (private.adaptive_difficulties('oson'))),
         count(*) filter (where q.difficulty = any (private.adaptive_difficulties('qiyin')))
    into v_easy, v_hard
    from public.questions q
   where q.status = 'verified' and q.section = v_section and not (q.id = any (v_used))
     and q.domain in (select b.b_domain from private.mock_blueprint() b where b.b_section = v_section);

  select ab.branch, ab.reason, ab.accuracy into v_branch, v_reason, v_acc
    from private.adaptive_branch(v_section, v_correct, v_total, v_easy, v_hard) ab;

  if v_branch in ('oson', 'qiyin') then
    v_diff := private.adaptive_difficulties(v_branch);
    -- Har soha bo'yicha ham yetishi kerak: 2-modul blueprint tarkibini buzmasin.
    if exists (
      select 1 from private.mock_blueprint() b
       where b.b_section = v_section
         and (select count(*) from public.questions q
               where q.status = 'verified' and q.section = v_section and q.domain = b.b_domain
                 and q.difficulty = any (v_diff) and not (q.id = any (v_used))) < b.b_per_module
    ) then
      v_branch := 'standart';
      v_reason := 'savol-kam';
    end if;
  end if;

  if v_branch in ('oson', 'qiyin') then
    -- Ko'rilgan: javob bergan savollar, boshqa formalar va boshqa urinishlarning adaptiv modullari (P30 qoidasi kabi).
    select coalesce(array_agg(distinct s.qid), '{}') into v_seen from (
      select at.question_id as qid from public.attempts at where at.user_id = v_user
      union
      select fq.question_id from public.mock_form_questions fq
        join public.mock_forms f on f.id = fq.form_id
       where f.user_id = v_user
         and f.id <> (select a.form_id from public.mock_attempts a where a.id = p_attempt)
      union
      select aq.question_id from public.mock_attempt_questions aq
        join public.mock_attempts a on a.id = aq.attempt_id
       where a.user_id = v_user and a.id <> p_attempt
    ) s;

    -- Soha ichida ko'nikmalar navbatma-navbat, avval ko'rilmaganlar; tartib P30 dagidek
    -- (R&W: soha bo'yicha guruh, soha ichida qiyinlik o'sib boradi; Math: qiyinlik o'sib boradi).
    insert into public.mock_attempt_questions (attempt_id, module, position, question_id)
    select p_attempt, v_next, row_number() over (order by t.key), t.id
      from (
        select pk.id,
               ((case when v_section = 'rw' then b.b_ord * 10 else 0 end) + pk.difficulty + random() * 0.5)::numeric as key
          from private.mock_blueprint() b
         cross join lateral (
           with pool as (
             select p.id, p.skill, p.difficulty, (p.id = any (v_seen)) as seen, random() as rnd
               from public.questions p
              where p.status = 'verified' and p.section = b.b_section and p.domain = b.b_domain
                and p.difficulty = any (v_diff) and not (p.id = any (v_used))
           ), ranked as (
             select pool.*, row_number() over (partition by pool.skill order by pool.seen, pool.rnd) as rn from pool
           )
           select r.id, r.difficulty from ranked r order by r.seen, r.rn, r.rnd limit b.b_per_module
         ) pk
         where b.b_section = v_section
      ) t;
  end if;

  update public.mock_modules mm
     set next_branch = v_branch, next_branch_reason = v_reason, next_branch_accuracy = v_acc
   where mm.attempt_id = p_attempt and mm.module = p_module;

  return v_branch;
end
$$;

------------------------------------------------------------------------------
-- P30 funksiyalari: forma o'rniga urinish savollari (private.mock_questions)
------------------------------------------------------------------------------

create or replace function private.mock_scores(p_attempt uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_rw_t integer; v_rw_c integer; v_m_t integer; v_m_c integer;
  v_rw integer; v_m integer;
begin
  select count(*) filter (where x.q_module <= 2), count(*) filter (where x.q_module > 2)
    into v_rw_t, v_m_t
    from private.mock_questions(p_attempt) x;

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

-- Joriy modulni yopadi: mashq sessiyasi + attempts (baho), xatolar redo ro'yxatiga, 1-/3-modulda tarmoq tanlanadi,
-- keyingi bosqichga o'tadi. Chaqiruvchi mock_attempts qatorini "for update" bilan qulflagan bo'lishi kerak.
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

  select count(*) into v_cnt from private.mock_questions(a.id) x where x.q_module = a.current_module;

  insert into public.practice_sessions (user_id, mode, filters, question_count, started_at, finished_at)
  values (a.user_id, 'mock', jsonb_build_object('mock_attempt', a.id, 'module', a.current_module),
          v_cnt, m.started_at, v_end)
  returning id into v_sess;

  insert into public.session_questions (session_id, question_id, position)
  select v_sess, x.q_question_id, x.q_position
    from private.mock_questions(a.id) x
   where x.q_module = a.current_module;

  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, time_ms, flagged, question_version)
  select a.user_id, v_sess, ma.question_id, ma.answer,
         private.check_answer(q.format, q.correct, ma.answer), ma.time_ms, ma.flagged, q.version
    from public.mock_answers ma
    join private.mock_questions(a.id) x
      on x.q_module = a.current_module and x.q_question_id = ma.question_id
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

  -- P31: bo'limning 1-moduli yopildi → 2-modul tarmog'i (serverda; mijoz ta'sir qila olmaydi).
  if a.current_module in (1, 3) then
    perform private.mock_adapt(a.id, a.current_module, v_sess);
  end if;

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

-- Mijozga beriladigan holat. Savollar faqat boshlangan joriy modul uchun va JAVOBSIZ. Tarmoq bu yerda YO'Q.
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
               'question_count', (select count(*) from private.mock_questions(a.id) x where x.q_module = g.m),
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
               'position', x.q_position,
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
             ) order by x.q_position)
        from private.mock_questions(a.id) x
        join public.questions q on q.id = x.q_question_id
       where x.q_module = a.current_module
    ), '[]'::jsonb) else '[]'::jsonb end,
    'answers', case when a.phase = 'module' then coalesce((
      select jsonb_agg(jsonb_build_object('question_id', ma.question_id, 'answer', ma.answer,
                                          'flagged', ma.flagged, 'time_ms', ma.time_ms))
        from public.mock_answers ma
        join private.mock_questions(a.id) x
          on x.q_module = a.current_module and x.q_question_id = ma.question_id
       where ma.attempt_id = a.id
    ), '[]'::jsonb) else '[]'::jsonb end
  )
  from public.mock_attempts a
  join public.mock_forms f on f.id = a.form_id
  where a.id = p_attempt
$$;

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
  select a.id, x.q_question_id,
         nullif(btrim(e ->> 'answer'), ''),
         coalesce((e ->> 'flagged')::boolean, false),
         least(greatest(coalesce((e ->> 'time_ms')::integer, 0), 0), private.mock_module_ms(a.current_module)),
         now()
    from jsonb_array_elements(p_items) e
    join private.mock_questions(a.id) x
      on x.q_module = a.current_module
     and x.q_question_id = (e ->> 'question_id')::uuid
  on conflict (attempt_id, question_id) do update
    set answer = excluded.answer, flagged = excluded.flagged,
        time_ms = greatest(ma.time_ms, excluded.time_ms), updated_at = now();
  get diagnostics v_n = row_count;

  return jsonb_build_object('saved', v_n, 'server_now', now());
end
$$;

-- Natija: taxminiy ball, har savol (matn, javob, to'g'ri javob, tushuntirish), redo holati va
-- "adaptive": har bo'lim uchun {branch, reason} (eski urinishlarda yoki tarmoq tanlanmagan bo'lsa null).
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
    'adaptive', jsonb_build_object(
      'rw', (select jsonb_build_object('branch', mm.next_branch, 'reason', mm.next_branch_reason)
               from public.mock_modules mm
              where mm.attempt_id = a.id and mm.module = 1 and mm.next_branch is not null),
      'math', (select jsonb_build_object('branch', mm.next_branch, 'reason', mm.next_branch_reason)
                 from public.mock_modules mm
                where mm.attempt_id = a.id and mm.module = 3 and mm.next_branch is not null)
    ),
    'questions', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', q.id,
               'module', x.q_module,
               'position', x.q_position,
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
             ) order by x.q_module, x.q_position)
        from private.mock_questions(a.id) x
        join public.questions q on q.id = x.q_question_id
        left join public.mock_modules mm on mm.attempt_id = a.id and mm.module = x.q_module
        left join public.attempts at on at.session_id = mm.session_id and at.question_id = x.q_question_id
    ), '[]'::jsonb)
  );
end
$$;

-- Rasm: mock formasidagi va urinishning adaptiv modulidagi savol rasmi ham o'qiladi.
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
  ) or exists (
    select 1
    from public.mock_attempt_questions aq
    join public.mock_attempts a on a.id = aq.attempt_id
    join public.questions q on q.id = aq.question_id
    where a.user_id = auth.uid()
      and q.status = 'verified'
      and q.figure ->> 'path' = p_name
  )
$$;

------------------------------------------------------------------------------
-- Huquqlar (P30 bilan bir xil: private faqat egasi, RPC faqat authenticated)
------------------------------------------------------------------------------
revoke all on function private.mock_questions(uuid) from public, anon, authenticated, service_role;
revoke all on function private.mock_adapt(uuid, integer, uuid) from public, anon, authenticated, service_role;
revoke all on function private.mock_scores(uuid) from public, anon, authenticated;
revoke all on function private.mock_close_module(uuid, boolean) from public, anon, authenticated;
revoke all on function private.mock_payload(uuid) from public, anon, authenticated;

revoke all on function public.mock_save(uuid, jsonb) from public, anon;
revoke all on function public.get_mock_result(uuid) from public, anon;
grant execute on function public.mock_save(uuid, jsonb) to authenticated;
grant execute on function public.get_mock_result(uuid) to authenticated;
