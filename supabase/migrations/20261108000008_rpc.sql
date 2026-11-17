-- 0008. Server funksiyalari (RPC): savol berish, javobni tekshirish, kvota, SPR normallash.
-- Hamma public RPC: security definer, search_path = '' (to'liq nomlar), execute faqat authenticated.
-- Mijoz to'g'ri javobni savol bilan birga hech qachon olmaydi: correct va explanation faqat submit_answer javobida.
--
-- Kvota kalitlari (qiymatlarni P19 da muallif plans.limits ga yozadi; kalit yo'q = cheklov yo'q):
--   sessions        start_session chaqiruvi            +1
--   questions       berilgan savollar soni             +n (start_session, daily_question, start_review_session)
--   answers         submit_answer (yangi javob)        +1
--   daily           daily_question (kunning birinchisi) +1
--   review_sessions start_review_session               +1
-- Hisoblagich cheklov bo'lmasa ham yuritiladi (usage_status uchun), davr standart holda 'day'.

------------------------------------------------------------------------------
-- Ichki yordamchilar (private)
------------------------------------------------------------------------------

-- Foydalanuvchining hozirgi tarifi: faol obuna (bolim bo'yicha), bo'lmasa 'free'.
create or replace function private.current_plan(p_user uuid, p_bolim text default 'sat')
returns public.plans
language sql
stable
security definer
set search_path = ''
as $$
  select p.*
  from public.plans p
  where p.code = coalesce(
    (select s.plan_code
     from public.subscriptions s
     join public.plans sp on sp.code = s.plan_code
     where s.user_id = p_user
       and s.bolim = p_bolim
       and s.status = 'active'
       and s.starts_at <= now()
       and (s.ends_at is null or s.ends_at > now())
     order by sp.sort desc
     limit 1),
    'free')
$$;

create or replace function private.period_start(p_per text)
returns date
language sql
stable
set search_path = ''
as $$
  select case p_per
    when 'month' then date_trunc('month', private.today_tashkent())::date
    else private.today_tashkent()
  end
$$;

-- Kvotani tekshiradi va hisoblagichni oshiradi. Oshib ketsa 'quota_exceeded' (P0001) xatosi.
-- Xato bo'lsa butun RPC tranzaksiyasi qaytariladi (sessiya ham yaratilmaydi).
create or replace function private.consume_quota(p_user uuid, p_key text, p_amount integer default 1)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan  public.plans;
  v_rule  jsonb;
  v_max   integer;
  v_start date;
begin
  if p_amount <= 0 then
    return;
  end if;

  v_plan := private.current_plan(p_user, 'sat');
  v_rule := v_plan.limits -> p_key;
  if jsonb_typeof(v_rule) = 'object' and jsonb_typeof(v_rule -> 'max') = 'number' then
    v_max := (v_rule ->> 'max')::integer;
  end if;
  v_start := private.period_start(coalesce(v_rule ->> 'per', 'day'));

  insert into public.usage_counters (user_id, key, period_start, count)
  values (p_user, p_key, v_start, 0)
  on conflict (user_id, key, period_start) do nothing;

  update public.usage_counters
     set count = count + p_amount, updated_at = now()
   where user_id = p_user and key = p_key and period_start = v_start
     and (v_max is null or count + p_amount <= v_max);

  if not found then
    raise exception 'quota_exceeded'
      using errcode = 'P0001',
            detail = jsonb_build_object('key', p_key, 'max', v_max, 'plan', v_plan.code)::text;
  end if;
end
$$;

-- Filtrlarga mos tasdiqlangan savollar. Filtr: {"section": "math"|"rw", "domains": [...], "skills": [...],
-- "difficulties": [1..5], "unanswered_only": bool, "incorrect_only": bool, "bookmarked_only": bool}.
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

-- Sessiya yaratadi va savollarni biriktiradi. Kvota keyin tekshiriladi: xato bo'lsa hammasi qaytariladi.
create or replace function private.create_session(p_user uuid, p_mode text, p_filters jsonb,
                                                  p_question_ids uuid[], p_daily_date date default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  insert into public.practice_sessions (user_id, mode, filters, question_count, daily_date)
  values (p_user, p_mode, coalesce(p_filters, '{}'::jsonb), cardinality(p_question_ids), p_daily_date)
  returning id into v_id;

  insert into public.session_questions (session_id, question_id, position)
  select v_id, x.qid, x.pos::integer
  from unnest(p_question_ids) with ordinality as x(qid, pos);

  return v_id;
end
$$;

create or replace function private.require_user()
returns uuid
language plpgsql
stable
set search_path = ''
as $$
declare
  v uuid := auth.uid();
begin
  if v is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;
  return v;
end
$$;

------------------------------------------------------------------------------
-- SPR (talaba kiritadigan javob) normallash
------------------------------------------------------------------------------

-- Javobni aniq kasrga aylantiradi: {surat, maxraj}. Tushunilmasa null.
-- Qabul qilinadi: butun son, o'nlik (.5, 0.5, 5.), kasr (1/2, -3/4), oldida minus (-, −, –, —, ﹣, －).
-- Chetdagi bo'shliqlar va minusdan keyingi hamda '/' atrofidagi bo'shliq olinadi.
-- Raqamlar orasidagi bo'shliq (1 1/2), vergul (1,5), '+' belgisi rad etiladi.
create or replace function private.spr_parse(p_input text)
returns numeric[]
language plpgsql
immutable
set search_path = ''
as $$
declare
  s   text;
  neg boolean := false;
  num numeric;
  den numeric;
  int_part text;
  frac_part text;
begin
  if p_input is null then
    return null;
  end if;
  s := btrim(p_input, E' \t\r\n ');
  s := translate(s, E'−–—﹣－', '-----');
  s := regexp_replace(s, '^-\s+', '-');
  s := regexp_replace(s, '\s*/\s*', '/');

  if left(s, 1) = '-' then
    neg := true;
    s := substr(s, 2);
  end if;

  if s ~ '^[0-9]+/[0-9]+$' then
    num := split_part(s, '/', 1)::numeric;
    den := split_part(s, '/', 2)::numeric;
    if den = 0 then
      return null;
    end if;
  elsif s ~ '^[0-9]*\.?[0-9]*$' and s ~ '[0-9]' then
    int_part := split_part(s, '.', 1);
    frac_part := split_part(s, '.', 2);
    num := (coalesce(nullif(int_part, ''), '0') || frac_part)::numeric;
    den := power(10::numeric, char_length(frac_part));
  else
    return null;
  end if;

  if neg then
    num := -num;
  end if;
  return array[num, den];
end
$$;

-- Javob qabul qilinadigan ro'yxatdagi biror qiymatga tengmi (kasr va o'nlik aniq solishtiriladi: 1/2 = 0.5 = 2/4).
-- Ro'yxatdagi son bo'lmagan qiymat bilan (kam uchraydi) katta-kichik harfsiz matn solishtiriladi.
create or replace function private.spr_equal(p_answer text, p_accepted jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  a numeric[];
  b numeric[];
  e text;
begin
  if p_answer is null or btrim(p_answer) = '' or jsonb_typeof(p_accepted) <> 'array' then
    return false;
  end if;
  a := private.spr_parse(p_answer);
  for e in select jsonb_array_elements_text(p_accepted) loop
    b := private.spr_parse(e);
    if a is not null and b is not null then
      if a[1] * b[2] = b[1] * a[2] then
        return true;
      end if;
    elsif a is null and b is null then
      if lower(btrim(p_answer)) = lower(btrim(e)) then
        return true;
      end if;
    end if;
  end loop;
  return false;
end
$$;

create or replace function private.check_answer(p_format text, p_correct jsonb, p_answer text)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case p_format
    when 'mcq' then upper(btrim(coalesce(p_answer, ''))) = upper(btrim(p_correct ->> 'choice'))
    when 'spr' then private.spr_equal(p_answer, p_correct -> 'accepted')
    else false
  end
$$;

-- SPR sinov jadvali. private.run_spr_tests() faqat mos kelmagan qatorlarni qaytaradi (bo'sh = hammasi o'tdi).
create table if not exists private.spr_test_cases (
  id       integer generated always as identity primary key,
  input    text not null,
  accepted jsonb not null,
  expected boolean not null,
  note     text,
  unique (input, accepted)
);

insert into private.spr_test_cases (input, accepted, expected, note) values
  ('0.5',    '["1/2"]',  true,  'o''nlik = kasr'),
  ('.5',     '["1/2"]',  true,  'nolsiz o''nlik'),
  ('.5',     '["0.5"]',  true,  '.5 = 0.5'),
  ('1/2',    '["0.5"]',  true,  'kasr = o''nlik'),
  ('2/4',    '["1/2"]',  true,  'qisqarmagan kasr'),
  (' 0.5 ',  '[".5"]',   true,  'chetdagi bo''shliq'),
  (E'−3', '["-3"]', true,  'unicode minus (U+2212)'),
  (E'–3', '["-3"]', true,  'en dash minus o''rnida'),
  ('- 3',    '["-3"]',   true,  'minusdan keyin bo''shliq'),
  ('-.5',    '["-1/2"]', true,  'manfiy nolsiz o''nlik'),
  ('-1/2',   '["-0.5"]', true,  'manfiy kasr'),
  ('3',      '["3.0"]',  true,  'butun = o''nlik'),
  ('5.',     '["5"]',    true,  'oxirida nuqta'),
  ('1 / 2',  '["0.5"]',  true,  '/ atrofida bo''shliq'),
  ('007',    '["7"]',    true,  'oldidagi nollar'),
  ('.6666',  '["2/3", ".6666", ".6667", "0.666", "0.667"]', true, 'ro''yxatdagi yaxlitlangan qiymat'),
  ('.6666',  '["2/3"]',  false, 'yaxlitlash avtomatik emas: muallif ro''yxatga yozadi'),
  ('1 1/2',  '["3/2"]',  false, 'aralash son rad etiladi'),
  ('11/2',   '["3/2"]',  false, 'bo''shliqsiz aralash son boshqa son'),
  ('0.5',    '["-0.5"]', false, 'ishora farqi'),
  ('',       '["0"]',    false, 'bo''sh javob'),
  ('   ',    '["0"]',    false, 'faqat bo''shliq'),
  ('1/0',    '["1"]',    false, 'nolga bo''lish'),
  ('abc',    '["1"]',    false, 'son emas'),
  ('1,5',    '["1.5"]',  false, 'vergul o''nlik ajratgich emas'),
  ('+2',     '["2"]',    false, '+ belgisi qabul qilinmaydi'),
  ('1.2.3',  '["1.23"]', false, 'ikki nuqta'),
  ('--3',    '["3"]',    false, 'ikki minus'),
  ('.',      '["0"]',    false, 'faqat nuqta')
on conflict (input, accepted) do nothing;

create or replace function private.run_spr_tests()
returns table (id integer, input text, accepted jsonb, expected boolean, actual boolean, note text)
language sql
stable
set search_path = ''
as $$
  select t.id, t.input, t.accepted, t.expected, private.spr_equal(t.input, t.accepted), t.note
  from private.spr_test_cases t
  where private.spr_equal(t.input, t.accepted) is distinct from t.expected
  order by t.id
$$;

------------------------------------------------------------------------------
-- Ochiq RPC'lar (public)
------------------------------------------------------------------------------

-- Filtrga mos savollar soni (mavzu va qiyinlik bo'yicha). Kvota sarflamaydi.
create or replace function public.question_counts(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
begin
  return (
    select jsonb_build_object(
      'total', coalesce(sum(g.total), 0),
      'groups', coalesce(jsonb_agg(to_jsonb(g) order by g.section, g.domain, g.skill, g.difficulty), '[]'::jsonb)
    )
    from (
      select q.section, q.domain, q.skill, q.difficulty,
             count(*) as total,
             count(*) filter (where exists (select 1 from public.attempts a
                                            where a.user_id = v_user and a.question_id = q.id)) as answered
      from private.filtered_questions(v_user, p_filters) q
      group by q.section, q.domain, q.skill, q.difficulty
    ) g
  );
end
$$;

-- Yangi mashq sessiyasi: savollar JAVOBSIZ va tushuntirishsiz.
-- p_volume 1–100 (texnik chegara, tarif emas). p_mode: 'practice' | 'timed'.
create or replace function public.start_session(p_filters jsonb, p_volume integer, p_mode text default 'practice')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_ids  uuid[];
  v_id   uuid;
begin
  if p_mode is null or p_mode not in ('practice', 'timed') then
    raise exception 'invalid_mode' using errcode = '22023';
  end if;
  if p_volume is null or p_volume < 1 or p_volume > 100 then
    raise exception 'invalid_volume' using errcode = '22023';
  end if;

  select array_agg(x.id) into v_ids
  from (select q.id from private.filtered_questions(v_user, p_filters) q order by random() limit p_volume) x;

  if v_ids is null then
    return jsonb_build_object('session_id', null, 'mode', p_mode, 'questions', '[]'::jsonb);
  end if;

  v_id := private.create_session(v_user, p_mode, p_filters, v_ids);
  perform private.consume_quota(v_user, 'sessions', 1);
  perform private.consume_quota(v_user, 'questions', cardinality(v_ids));

  return private.session_payload(v_id);
end
$$;

-- Javobni tekshiradi. Bir savolga sessiyada bitta urinish; takror chaqirilsa saqlangan natija qaytadi.
-- Qaytaradi: is_correct, correct (to'g'ri javob), explanation, already_answered.
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

  select * into v_attempt from public.attempts a where a.session_id = p_session and a.question_id = p_question;
  if found then
    return jsonb_build_object(
      'is_correct', v_attempt.is_correct,
      'correct', case v_q.format when 'mcq' then v_q.correct -> 'choice' else v_q.correct -> 'accepted' end,
      'explanation', v_q.explanation,
      'already_answered', true);
  end if;

  if p_answer is null or char_length(p_answer) > 100 then
    raise exception 'invalid_answer' using errcode = '22023';
  end if;

  v_correct := private.check_answer(v_q.format, v_q.correct, p_answer);

  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, time_ms, question_version)
  values (v_user, p_session, p_question, p_answer, v_correct,
          case when p_time_ms >= 0 then p_time_ms end, v_q.version);

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

  perform private.consume_quota(v_user, 'answers', 1);

  return jsonb_build_object(
    'is_correct', v_correct,
    'correct', case v_q.format when 'mcq' then v_q.correct -> 'choice' else v_q.correct -> 'accepted' end,
    'explanation', v_q.explanation,
    'already_answered', false);
end
$$;

-- Kunning savoli: Toshkent sanasi bo'yicha hamma uchun bir xil savol. Kuniga bitta sessiya,
-- takror chaqirilsa o'sha sessiya qaytadi (kvota qayta sarflanmaydi).
create or replace function public.daily_question()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := private.require_user();
  v_today date := private.today_tashkent();
  v_id    uuid;
  v_qid   uuid;
begin
  select s.id into v_id from public.practice_sessions s
   where s.user_id = v_user and s.mode = 'daily' and s.daily_date = v_today;
  if found then
    return private.session_payload(v_id);
  end if;

  select q.id into v_qid from public.questions q
   where q.status = 'verified'
   order by md5(q.id::text || v_today::text)
   limit 1;
  if v_qid is null then
    return jsonb_build_object('session_id', null, 'mode', 'daily', 'questions', '[]'::jsonb);
  end if;

  begin
    v_id := private.create_session(v_user, 'daily', '{}'::jsonb, array[v_qid], v_today);
  exception when unique_violation then
    -- Parallel chaqiruv sessiyani allaqachon yaratgan.
    select s.id into v_id from public.practice_sessions s
     where s.user_id = v_user and s.mode = 'daily' and s.daily_date = v_today;
    return private.session_payload(v_id);
  end;

  perform private.consume_quota(v_user, 'daily', 1);
  perform private.consume_quota(v_user, 'questions', 1);
  return private.session_payload(v_id);
end
$$;

-- Muddati kelgan takrorlash savollari (1–4-qutilar). p_limit 1–100 (texnik chegara), standart 100.
create or replace function public.start_review_session(p_limit integer default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_lim  integer := coalesce(p_limit, 100);
  v_ids  uuid[];
  v_id   uuid;
begin
  if v_lim < 1 or v_lim > 100 then
    raise exception 'invalid_volume' using errcode = '22023';
  end if;

  select array_agg(x.question_id) into v_ids
  from (
    select r.question_id
    from public.review_queue r
    join public.questions q on q.id = r.question_id and q.status = 'verified'
    where r.user_id = v_user and r.box < 5 and r.next_due <= private.today_tashkent()
    order by r.next_due, r.box, r.question_id
    limit v_lim
  ) x;

  if v_ids is null then
    return jsonb_build_object('session_id', null, 'mode', 'review', 'questions', '[]'::jsonb);
  end if;

  v_id := private.create_session(v_user, 'review', '{}'::jsonb, v_ids);
  perform private.consume_quota(v_user, 'review_sessions', 1);
  perform private.consume_quota(v_user, 'questions', cardinality(v_ids));
  return private.session_payload(v_id);
end
$$;

-- Tarif, cheklovlar va joriy davrdagi sarf. Kvota sarflamaydi.
create or replace function public.usage_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_plan public.plans;
begin
  v_plan := private.current_plan(v_user, 'sat');
  return jsonb_build_object(
    'bolim', 'sat',
    'plan', jsonb_build_object('code', v_plan.code, 'name', v_plan.name),
    'limits', (
      select coalesce(jsonb_object_agg(l.key, jsonb_build_object(
               'max', (l.value ->> 'max')::integer,
               'per', coalesce(l.value ->> 'per', 'day'),
               'used', coalesce(c.count, 0),
               'remaining', greatest((l.value ->> 'max')::integer - coalesce(c.count, 0), 0))), '{}'::jsonb)
      from jsonb_each(v_plan.limits) l
      left join public.usage_counters c
        on c.user_id = v_user and c.key = l.key
       and c.period_start = private.period_start(coalesce(l.value ->> 'per', 'day'))
      where jsonb_typeof(l.value -> 'max') = 'number'
    ),
    'today', (
      select coalesce(jsonb_object_agg(c.key, c.count), '{}'::jsonb)
      from public.usage_counters c
      where c.user_id = v_user and c.period_start = private.today_tashkent()
    )
  );
end
$$;

-- Savol rasmi shu foydalanuvchiga berilgan sessiyada bormi (Storage policy uchun).
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
  )
$$;

------------------------------------------------------------------------------
-- Admin amallari: faqat service role (SQL editor yoki Edge Function). audit_log ga yoziladi.
------------------------------------------------------------------------------

-- Qo'lda tarif berish. p_days null bo'lsa muddatsiz.
create or replace function public.admin_grant_plan(p_user uuid, p_plan_code text, p_days integer,
                                                   p_reason text, p_actor text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_actor is null or btrim(p_actor) = '' then
    raise exception 'actor_required' using errcode = '22023';
  end if;
  if not exists (select 1 from public.plans p where p.code = p_plan_code) then
    raise exception 'plan_not_found' using errcode = 'P0002';
  end if;
  if p_days is not null and p_days < 1 then
    raise exception 'invalid_days' using errcode = '22023';
  end if;

  insert into public.subscriptions (user_id, bolim, plan_code, status, starts_at, ends_at, source)
  values (p_user, (select p.bolim from public.plans p where p.code = p_plan_code), p_plan_code, 'active', now(),
          case when p_days is null then null else now() + make_interval(days => p_days) end, 'admin')
  returning id into v_id;

  insert into public.audit_log (actor, action, target_table, target_id, details)
  values (p_actor, 'grant_plan', 'subscriptions', v_id::text,
          jsonb_build_object('user_id', p_user, 'plan_code', p_plan_code, 'days', p_days, 'reason', p_reason));
  return v_id;
end
$$;

-- Savolni yashirish (masalan, xato topilganda). Sessiyalarda berilmaydi, javob qabul qilinmaydi.
create or replace function public.admin_hide_question(p_external_id text, p_reason text, p_actor text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id  uuid;
  v_old text;
begin
  if p_actor is null or btrim(p_actor) = '' then
    raise exception 'actor_required' using errcode = '22023';
  end if;
  select q.id, q.status into v_id, v_old from public.questions q where q.external_id = p_external_id for update;
  if not found then
    raise exception 'question_not_found' using errcode = 'P0002';
  end if;

  update public.questions set status = 'hidden' where id = v_id;

  insert into public.audit_log (actor, action, target_table, target_id, details)
  values (p_actor, 'hide_question', 'questions', v_id::text,
          jsonb_build_object('external_id', p_external_id, 'old_status', v_old, 'reason', p_reason));
  return v_id;
end
$$;

------------------------------------------------------------------------------
-- Huquqlar. Supabase yangi funksiyalarga anon va authenticated uchun execute beradi: aniq qaytarib olamiz.
------------------------------------------------------------------------------

revoke all on all functions in schema private from public, anon, authenticated;
revoke all on table private.spr_test_cases from public, anon, authenticated;

revoke all on function public.question_counts(jsonb) from public, anon;
revoke all on function public.start_session(jsonb, integer, text) from public, anon;
revoke all on function public.submit_answer(uuid, uuid, text, integer) from public, anon;
revoke all on function public.daily_question() from public, anon;
revoke all on function public.start_review_session(integer) from public, anon;
revoke all on function public.usage_status() from public, anon;
revoke all on function public.can_read_question_figure(text) from public, anon;
revoke all on function public.admin_grant_plan(uuid, text, integer, text, text) from public, anon, authenticated;
revoke all on function public.admin_hide_question(text, text, text) from public, anon, authenticated;

grant execute on function public.question_counts(jsonb) to authenticated;
grant execute on function public.start_session(jsonb, integer, text) to authenticated;
grant execute on function public.submit_answer(uuid, uuid, text, integer) to authenticated;
grant execute on function public.daily_question() to authenticated;
grant execute on function public.start_review_session(integer) to authenticated;
grant execute on function public.usage_status() to authenticated;
grant execute on function public.can_read_question_figure(text) to authenticated;
grant execute on function public.admin_grant_plan(uuid, text, integer, text, text) to service_role;
grant execute on function public.admin_hide_question(text, text, text) to service_role;
