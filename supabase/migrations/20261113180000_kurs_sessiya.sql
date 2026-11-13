-- SAT kursi 1b: P05 tegi orqali server to'plami, taymersiz mini-test va mavjud redo/analitika.
alter table public.practice_sessions drop constraint if exists practice_sessions_mode_check;
alter table public.practice_sessions add constraint practice_sessions_mode_check
  check (mode in ('practice', 'timed', 'daily', 'review', 'mock', 'course_practice', 'mini_test'));

-- Kurs savollari umumiy bank, kun savoli va mock tanloviga kirmaydi.
create or replace function private.course_tags(p_tags text[])
returns text[]
language sql
immutable
set search_path = ''
as $$
  select array(select t from unnest(p_tags) t where t like 'sat-kurs:%')
$$;

revoke all on function private.course_tags(text[]) from public, anon, authenticated;

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
    and cardinality(private.course_tags(q.tags)) = 0
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
   where p.day = p_day and q.status = 'verified' and q.figure is null
     and cardinality(private.course_tags(q.tags)) = 0;
  if found then
    return v_qid;
  end if;

  -- Avvalgi tanlov endi yaroqsiz (yashirilgan yoki rasm qo'shilgan): qayta tanlanadi.
  delete from public.daily_picks p where p.day = p_day;

  select q.id into v_qid
    from public.questions q
   where q.status = 'verified' and q.figure is null
     and cardinality(private.course_tags(q.tags)) = 0
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
       and cardinality(private.course_tags(q.tags)) = 0
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
           and cardinality(private.course_tags(p.tags)) = 0
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

-- Katalogning v1 hajmlari (docs/course-spec/math-topics.csv). Yetishmagan yoki ortiqcha to'plam ochilmaydi.
create or replace function public.start_course_session(p_set text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_topic text := split_part(p_set, ':', 3);
  v_stage text := split_part(p_set, ':', 4);
  v_size integer;
  v_ids uuid[];
  v_id uuid;
begin
  if p_set is null or p_set !~ '^sat-kurs:v1:(mx3|a[1-5]):(foundation|core|advanced|mini_test)$' then
    raise exception 'invalid_course_set' using errcode = '22023';
  end if;

  v_size := case v_stage
    when 'foundation' then 8
    when 'core' then case v_topic when 'mx3' then 8 else 10 end
    when 'advanced' then case v_topic when 'mx3' then 4 else 8 end
    when 'mini_test' then case v_topic when 'mx3' then 0 else 10 end
  end;
  if v_size = 0 then
    raise exception 'invalid_course_set' using errcode = '22023';
  end if;

  select array_agg(x.id order by x.external_id) into v_ids
  from (
    select q.id, q.external_id
    from public.questions q
    where q.status = 'verified' and q.section = 'math' and q.tags @> array[p_set]
      and private.course_tags(q.tags) = array[p_set]
    order by q.id for share
  ) x;
  if coalesce(cardinality(v_ids), 0) <> v_size then
    raise exception 'course_set_unavailable' using errcode = 'P0002';
  end if;

  v_id := private.create_session(v_user, case v_stage when 'mini_test' then 'mini_test' else 'course_practice' end,
    jsonb_build_object('course', jsonb_build_object('v', 1, 'set_id', p_set, 'topic_id', upper(v_topic), 'stage', v_stage)),
    v_ids);
  perform private.consume_quota(v_user, 'sessions', 1);
  perform private.consume_quota(v_user, 'questions', v_size);
  return public.get_session(v_id);
end
$$;

-- Yashirilgan yoki o'chirilgan savol to'plam maxrajini kamaytirmaydi.
create or replace function private.check_course_session(p_session public.practice_sessions)
returns void
language plpgsql
stable
set search_path = ''
as $$
begin
  if (select count(*) from public.session_questions sq
      join public.questions q on q.id = sq.question_id and q.status = 'verified'
      where sq.session_id = p_session.id) <> p_session.question_count then
    raise exception 'question_unavailable' using errcode = 'P0002';
  end if;
end
$$;

create or replace function public.get_session(p_session uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_s public.practice_sessions;
  v_course jsonb;
  v_payload jsonb;
begin
  select * into v_s from public.practice_sessions s where s.id = p_session and s.user_id = v_user;
  if not found then
    raise exception 'session_not_found' using errcode = 'P0002';
  end if;

  if v_s.mode in ('course_practice', 'mini_test') then
    perform private.check_course_session(v_s);
    v_course := v_s.filters -> 'course';
  end if;

  v_payload := private.session_payload(p_session) || jsonb_build_object(
    'finished_at', v_s.finished_at,
    'server_now', now(),
    'time_limit_ms', case when v_s.mode = 'timed' then private.session_time_limit_ms(p_session) end,
    'results', case when v_s.mode = 'mini_test' and v_s.finished_at is null then '[]'::jsonb else coalesce((
      select jsonb_agg(jsonb_build_object(
               'question_id', a.question_id, 'answer', a.answer, 'is_correct', a.is_correct,
               'correct', case q.format when 'mcq' then q.correct -> 'choice' else q.correct -> 'accepted' end,
               'explanation', q.explanation, 'time_ms', a.time_ms
             ) order by a.created_at)
      from public.attempts a
      join public.questions q on q.id = a.question_id
      where a.session_id = p_session and a.user_id = v_user
    ), '[]'::jsonb) end,
    'review', coalesce((
      select jsonb_agg(jsonb_build_object('question_id', r.question_id, 'reason_tag', r.reason_tag))
      from public.review_queue r
      join public.session_questions sq on sq.question_id = r.question_id and sq.session_id = p_session
      where r.user_id = v_user and r.box < 5
    ), '[]'::jsonb)
  );
  if v_course is null then return v_payload; end if;

  v_payload := v_payload || jsonb_build_object(
    'course', v_course,
    'elapsed_ms', floor(extract(epoch from (v_s.finished_at - v_s.started_at)) * 1000)
  );
  if v_s.mode = 'mini_test' and v_s.finished_at is not null then
    v_payload := v_payload || jsonb_build_object(
      'passed', (select count(*) * 10 >= v_s.question_count * 7 from public.attempts a
                 where a.session_id = p_session and a.is_correct),
      'topic_passed', exists (
        select 1 from public.practice_sessions s
        where s.user_id = v_user and s.mode = 'mini_test' and s.finished_at is not null
          and s.filters -> 'course' ->> 'topic_id' = v_course ->> 'topic_id'
          and (select count(*) * 10 from public.attempts a where a.session_id = s.id and a.is_correct) >= s.question_count * 7
      ),
      'skipped_solutions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'question_id', q.id,
          'correct', case q.format when 'mcq' then q.correct -> 'choice' else q.correct -> 'accepted' end,
          'explanation', q.explanation
        ) order by sq.position)
        from public.session_questions sq join public.questions q on q.id = sq.question_id
        where sq.session_id = p_session and not exists (
          select 1 from public.attempts a where a.session_id = p_session and a.question_id = q.id
        )
      ), '[]'::jsonb)
    );
  end if;
  return v_payload;
end
$$;

create or replace function public.finish_session(p_session uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_s    public.practice_sessions;
  v_f    timestamptz;
begin
  select * into v_s from public.practice_sessions s where s.id = p_session and s.user_id = v_user for update;
  if not found then
    raise exception 'session_not_found' using errcode = 'P0002';
  end if;
  if v_s.mode = 'mini_test' then
    raise exception 'mini_test_requires_batch' using errcode = '55000';
  end if;
  if v_s.mode = 'course_practice' then
    perform private.check_course_session(v_s);
  end if;
  update public.practice_sessions s
     set finished_at = coalesce(s.finished_at, now())
   where s.id = p_session and s.user_id = v_user
  returning s.finished_at into v_f;
  return jsonb_build_object('finished_at', v_f);
end
$$;

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
                 where s.user_id = v_user and sq.question_id = p_question
                   and (s.mode <> 'mini_test' or s.finished_at is not null)) then
    raise exception 'question_not_in_session' using errcode = 'P0002';
  end if;

  insert into public.review_queue (user_id, question_id, box, next_due)
  values (v_user, p_question, 1, v_today + 1)
  on conflict (user_id, question_id) do update
    set box = 1, next_due = v_today + 1
    where public.review_queue.box >= 5;

  return jsonb_build_object('in_review', true);
end
$$;

create or replace function private.record_session_answer(
  p_user uuid, p_session uuid, p_question uuid, p_answer text, p_time_ms integer, p_mini_test boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.practice_sessions;
  v_q       public.questions;
  v_attempt public.attempts;
  v_correct boolean;
  v_today   date := private.today_tashkent();
  v_box     smallint;
begin
  select * into v_session from public.practice_sessions s where s.id = p_session and s.user_id = p_user for update;
  if not found then
    raise exception 'session_not_found' using errcode = 'P0002';
  end if;
  if (v_session.mode = 'mini_test') <> p_mini_test then
    raise exception 'mini_test_requires_batch' using errcode = '55000';
  end if;
  if v_session.mode = 'course_practice' then
    perform private.check_course_session(v_session);
  end if;
  if not exists (select 1 from public.session_questions sq
                 where sq.session_id = p_session and sq.question_id = p_question) then
    raise exception 'question_not_in_session' using errcode = 'P0002';
  end if;

  select * into v_q from public.questions q where q.id = p_question for share;
  if not found or v_q.status <> 'verified' then
    raise exception 'question_unavailable' using errcode = 'P0002';
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
  values (p_user, p_session, p_question, p_answer, v_correct,
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
    values (p_user, p_question, 1, v_today + 1, now(), now())
    on conflict (user_id, question_id) do update
      set box = 1, next_due = v_today + 1, last_reviewed_at = now();
  elsif v_session.mode = 'review' then
    select r.box into v_box from public.review_queue r
     where r.user_id = p_user and r.question_id = p_question for update;
    if found and v_box < 5 then
      update public.review_queue r
         set box = v_box + 1,
             next_due = v_today + case v_box when 1 then 3 when 2 then 7 when 3 then 14 else 0 end,
             last_reviewed_at = now()
       where r.user_id = p_user and r.question_id = p_question;
    end if;
  end if;

  if not p_mini_test then
    update public.practice_sessions s
       set finished_at = now()
     where s.id = p_session and s.finished_at is null
       and (select count(*) from public.attempts a where a.session_id = p_session) >= s.question_count;
  end if;

  if v_session.mode <> 'daily' and not p_mini_test then
    perform private.consume_quota(p_user, 'answers', 1);
  end if;

  return jsonb_build_object(
    'is_correct', v_correct,
    'correct', case v_q.format when 'mcq' then v_q.correct -> 'choice' else v_q.correct -> 'accepted' end,
    'explanation', v_q.explanation,
    'already_answered', false);
end
$$;

create or replace function public.submit_answer(p_session uuid, p_question uuid, p_answer text, p_time_ms integer default null)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select private.record_session_answer(private.require_user(), p_session, p_question, p_answer, p_time_ms, false)
$$;

-- Bir tranzaksiya: sessiya qulfi, javoblar, redo, kvota va yakun. Takror so'rov saqlangan natijani oladi.
create or replace function public.finish_course_mini_test(p_session uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_s public.practice_sessions;
  v_item record;
begin
  select * into v_s from public.practice_sessions s
  where s.id = p_session and s.user_id = v_user and s.mode = 'mini_test' for update;
  if not found then
    raise exception 'session_not_found' using errcode = 'P0002';
  end if;

  perform q.id from public.session_questions sq
  join public.questions q on q.id = sq.question_id where sq.session_id = p_session
  order by q.id for share of q;
  perform private.check_course_session(v_s);
  if v_s.finished_at is not null then
    return public.get_session(p_session);
  end if;

  if jsonb_typeof(p_answers) is distinct from 'array' then
    raise exception 'invalid_answer' using errcode = '22023';
  end if;
  if jsonb_array_length(p_answers) > v_s.question_count or exists (
    select 1 from jsonb_array_elements(p_answers) as item
    where jsonb_typeof(item -> 'question_id') is distinct from 'string'
       or jsonb_typeof(item -> 'answer') is distinct from 'string'
       or char_length(btrim(item ->> 'answer')) = 0
       or char_length(item ->> 'answer') > 100
       or (item ->> 'time_ms')::numeric not between 0 and 2147483647
  ) then
    raise exception 'invalid_answer' using errcode = '22023';
  end if;
  if (select count(distinct question_id) from jsonb_to_recordset(p_answers) as a(question_id uuid))
      <> jsonb_array_length(p_answers) then
    raise exception 'invalid_answer' using errcode = '22023';
  end if;

  for v_item in
    select * from jsonb_to_recordset(p_answers) as a(question_id uuid, answer text, time_ms integer)
    order by question_id
  loop
    perform private.record_session_answer(v_user, p_session, v_item.question_id, v_item.answer, v_item.time_ms, true);
  end loop;
  perform private.consume_quota(v_user, 'answers', jsonb_array_length(p_answers));

  update public.practice_sessions set finished_at = greatest(started_at, clock_timestamp()) where id = p_session;
  return public.get_session(p_session);
end
$$;

revoke all on function private.check_course_session(public.practice_sessions) from public, anon, authenticated;
revoke all on function private.record_session_answer(uuid, uuid, uuid, text, integer, boolean) from public, anon, authenticated;
revoke all on function public.start_course_session(text) from public, anon;
revoke all on function public.finish_course_mini_test(uuid, jsonb) from public, anon;
grant execute on function public.start_course_session(text) to authenticated;
grant execute on function public.finish_course_mini_test(uuid, jsonb) to authenticated;
