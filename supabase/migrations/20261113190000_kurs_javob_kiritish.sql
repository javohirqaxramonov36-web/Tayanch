-- SAT kursi 1c: kurs savoli redo ichida ham bir xil format va baholashdan o'tadi.
create or replace function private.course_spr_format(p_input text)
returns text
language sql
immutable
set search_path = ''
as $$
  with normalized as (
    select regexp_replace(
      regexp_replace(btrim(regexp_replace(translate(p_input, '−–—﹣－', '-----'),
        U&'[\0009-\000D\00A0\1680\2000-\200A\2028\2029\202F\205F\3000\FEFF]', ' ', 'g')),
        '^- +', '-'), ' */ *', '/') as answer
    where char_length(p_input) <= 100
  )
  select answer from normalized
  where char_length(answer) <= case when left(answer, 1) = '-' then 6 else 5 end
    and answer ~ '^-?([0-9]+|[0-9]*\.[0-9]+|[0-9]+/[0-9]+)$'
    and answer !~ '/0+$'
$$;

-- accepted 1a quvuridan kelgan, tekshirilgan shakllar. exact bo'lsa, qo'shimcha
-- sig'adigan o'nliklar ham asl qiymatdan aniq hisoblanadi (double precision ishlatilmaydi).
create or replace function private.course_spr_equal(p_input text, p_correct jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  s text := private.course_spr_format(p_input);
  a numeric[];
  b numeric[];
  e text;
  whole text;
  places integer;
  factor numeric;
  scaled_num numeric;
  truncated numeric;
begin
  if s is null then return false; end if;
  if jsonb_typeof(p_correct -> 'exact') is distinct from 'array' then
    return private.spr_equal(s, p_correct -> 'accepted') is true;
  end if;

  a := private.spr_parse(s);
  whole := split_part(ltrim(s, '-'), '.', 1);
  places := char_length(split_part(s, '.', 2));
  for e in select jsonb_array_elements_text(p_correct -> 'exact') loop
    b := private.spr_parse(e);
    if b is null then continue; end if;
    if a[1] * b[2] = b[1] * a[2] then return true; end if;

    -- Yaqin o'nlik barcha mavjud belgilarni ishlatadi; yetakchi 0 joyni egallaydi.
    if places = 0 or places <> 4 - char_length(whole)
       or whole ~ '^0[0-9]' or (left(s, 1) = '-') <> (b[1] < 0) then
      continue;
    end if;
    factor := power(10::numeric, places);
    scaled_num := abs(b[1]) * factor;
    truncated := div(scaled_num, b[2]);
    if abs(a[1]) = truncated
       or abs(a[1]) = truncated + (case when mod(scaled_num, b[2]) * 2 >= b[2] then 1 else 0 end) then
      return true;
    end if;
  end loop;
  return false;
end
$$;

revoke all on function private.course_spr_format(text) from public, anon, authenticated;
revoke all on function private.course_spr_equal(text, jsonb) from public, anon, authenticated;

-- Sessiyadagi savollar: faqat ko'rsatiladigan maydonlar. correct va explanation bu yerda YO'Q.
create or replace function private.session_payload(p_session uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'session_id', s.id,
    'mode', s.mode,
    'started_at', s.started_at,
    'questions', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', q.id,
               'external_id', q.external_id,
               'position', sq.position,
               'section', q.section,
               'domain', q.domain,
               'skill', q.skill,
               'difficulty', q.difficulty,
               'format', q.format,
               'course_question', cardinality(private.course_tags(q.tags)) > 0,
               'passage', q.passage,
               'stem', q.stem,
               'options', (select jsonb_agg(jsonb_build_object('key', e.opt ->> 'key', 'text', e.opt ->> 'text')
                                            order by e.ord)
                           from jsonb_array_elements(q.options) with ordinality as e(opt, ord)),
               'figure', case when q.figure is null then null else
                           jsonb_build_object('path', q.figure ->> 'path', 'alt', q.figure ->> 'alt',
                                              'caption', q.figure ->> 'caption') end,
               'answered', exists (select 1 from public.attempts a
                                   where a.session_id = s.id and a.question_id = q.id),
               'bookmarked', exists (select 1 from public.bookmarks b
                                     where b.user_id = s.user_id and b.question_id = q.id)
             ) order by sq.position)
      from public.session_questions sq
      join public.questions q on q.id = sq.question_id
      where sq.session_id = s.id
    ), '[]'::jsonb)
  )
  from public.practice_sessions s
  where s.id = p_session
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

  if v_q.format = 'spr' and cardinality(private.course_tags(v_q.tags)) > 0 then
    p_answer := private.course_spr_format(p_answer);
    if p_answer is null then
      raise exception 'invalid_answer' using errcode = '22023';
    end if;
    v_correct := private.course_spr_equal(p_answer, v_q.correct);
  else
    v_correct := private.check_answer(v_q.format, v_q.correct, p_answer);
  end if;

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
