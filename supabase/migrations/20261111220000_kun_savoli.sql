-- 20261111220000. Kun savoli (P10, SAT kirish sahifasi): hamma uchun bitta savol, mehmon uchun cheklangan RPC,
-- streak (ketma-ket faol kun) serverda. Takror ishga tushirish xavfsiz (if not exists / create or replace).
--
-- Qoidalar:
--   * Sana chegarasi Asia/Tashkent (UTC+5, yozgi vaqt yo'q): savol har kuni Toshkent vaqti 00:00 da (UTC 19:00)
--     almashadi. Boshqa mintaqadagi foydalanuvchi uchun ham shu chegara: masalan Nyu-Yorkda (UTC-5) savol 14:00 da
--     almashadi. Brauzer keyingi savol vaqtini (next_at) foydalanuvchining mahalliy vaqtida ko'rsatadi.
--   * Tanlov barqaror: kunning birinchi so'rovida daily_picks ga yoziladi va kun oxirigacha hamma uchun bir xil.
--     Kun ichida yangi savol import qilinsa ham bugungi savol o'zgarmaydi. Savol yashirilsa (hidden), qayta tanlanadi.
--   * Navbat: 2026-01-01 dan beri juft kun Reading and Writing, toq kun Math. O'sha bo'limda tasdiqlangan savol
--     bo'lmasa, ikkinchi bo'limdan olinadi. Avval hech qachon berilmagan savol, keyin eng uzoq berilmagani.
--   * Faqat verified va rasmsiz savollar: mehmon savol rasmini ocha olmaydi (storage policy sessiya talab qiladi).
--   * Kvota (P19 bilan kelishilgan qoida): kun savoli HECH QANDAY kvota kalitini sarflamaydi (daily, questions,
--     answers). 0008 dagi daily_question va submit_answer shu yerda shunga moslab qayta yoziladi.
--   * Mehmon (anon): daily_question_public savolni javobsiz beradi; check_daily_answer faqat bugungi savolga javobni
--     tekshiradi va hech narsa yozmaydi. To'g'ri javob va tushuntirish faqat javob yuborilgandan keyin.
--   * Streak: faol kun = kun savoliga javob berilgan Toshkent kuni (to'g'ri yoki xato farqsiz). Bugun hali javob
--     berilmagan bo'lsa, kechagacha bo'lgan ketma-ketlik saqlanadi (kun tugaguncha uzilmaydi).

------------------------------------------------------------------------------
-- Jadval
------------------------------------------------------------------------------

create table if not exists public.daily_picks (
  day         date primary key,
  question_id uuid not null references public.questions (id) on delete cascade,
  section     text not null check (section in ('math', 'rw')),
  created_at  timestamptz not null default now()
);

create index if not exists daily_picks_question_idx on public.daily_picks (question_id, day desc);

-- Mijoz to'g'ridan-to'g'ri o'qimaydi ham, yozmaydi ham: faqat RPC (security definer).
alter table public.daily_picks enable row level security;
revoke all on table public.daily_picks from anon, authenticated;

------------------------------------------------------------------------------
-- Ichki yordamchilar (private)
------------------------------------------------------------------------------

-- Kun bo'limi: juft kun 'rw', toq kun 'math' (2026-01-01 = 0-kun).
create or replace function private.daily_section(p_day date)
returns text
language sql
immutable
set search_path = ''
as $$
  select case when (p_day - date '2026-01-01') % 2 = 0 then 'rw' else 'math' end
$$;

-- Keyingi savol vaqti: ertangi Toshkent kunining boshi.
create or replace function private.daily_next_at(p_day date)
returns timestamptz
language sql
immutable
set search_path = ''
as $$
  select (p_day + 1)::timestamp at time zone 'Asia/Tashkent'
$$;

-- Kunning savoli (id). Birinchi chaqiruvda tanlab daily_picks ga yozadi. Savol yo'q bo'lsa null.
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
   where p.day = p_day and q.status = 'verified' and q.figure is null;
  if found then
    return v_qid;
  end if;

  -- Avvalgi tanlov endi yaroqsiz (yashirilgan yoki rasm qo'shilgan): qayta tanlanadi.
  delete from public.daily_picks p where p.day = p_day;

  select q.id into v_qid
    from public.questions q
   where q.status = 'verified' and q.figure is null
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

-- Savol: faqat ko'rsatiladigan maydonlar (session_payload bilan bir xil). correct va explanation YO'Q.
create or replace function private.question_public(p_question uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
           'id', q.id,
           'external_id', q.external_id,
           'section', q.section,
           'domain', q.domain,
           'skill', q.skill,
           'difficulty', q.difficulty,
           'format', q.format,
           'passage', q.passage,
           'stem', q.stem,
           'options', (select jsonb_agg(jsonb_build_object('key', e.opt ->> 'key', 'text', e.opt ->> 'text')
                                        order by e.ord)
                       from jsonb_array_elements(q.options) with ordinality as e(opt, ord)))
    from public.questions q
   where q.id = p_question
$$;

-- Streak: {"current": n, "active_today": bool}.
create or replace function private.daily_streak(p_user uuid, p_today date)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with kunlar as (
    select distinct s.daily_date as day
      from public.practice_sessions s
     where s.user_id = p_user and s.mode = 'daily' and s.daily_date <= p_today
       and exists (select 1 from public.attempts a where a.session_id = s.id)
  ),
  guruh as (
    select k.day, k.day - (row_number() over (order by k.day))::integer as g from kunlar k
  ),
  tayanch as (
    select case when exists (select 1 from kunlar where day = p_today) then p_today else p_today - 1 end as day
  )
  select jsonb_build_object(
    'current', (select count(*) from guruh where g = (select g.g from guruh g, tayanch t where g.day = t.day)),
    'active_today', exists (select 1 from kunlar where day = p_today))
$$;

-- To'g'ri javob ko'rinishi (submit_answer bilan bir xil).
create or replace function private.correct_public(p_format text, p_correct jsonb)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select case p_format when 'mcq' then p_correct -> 'choice' else p_correct -> 'accepted' end
$$;

------------------------------------------------------------------------------
-- Ochiq RPC'lar (public)
------------------------------------------------------------------------------

-- Mehmon va kirgan foydalanuvchi: bugungi savol JAVOBSIZ. Hech qanday hisob, sessiya yoki kvota yo'q.
create or replace function public.daily_question_public()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := private.today_tashkent();
  v_qid   uuid := private.daily_pick(v_today);
begin
  return jsonb_build_object(
    'date', v_today,
    'next_at', private.daily_next_at(v_today),
    'question', case when v_qid is null then null else private.question_public(v_qid) end);
end
$$;

-- Mehmon: bugungi savolga javobni tekshiradi. Hech narsa yozmaydi.
-- Boshqa (kechagi yoki begona) savol uchun 'question_not_today' (P0002): to'g'ri javobni oldindan olib bo'lmaydi.
create or replace function public.check_daily_answer(p_question uuid, p_answer text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today date := private.today_tashkent();
  v_q     public.questions;
begin
  if p_question is null or p_question is distinct from private.daily_pick(v_today) then
    raise exception 'question_not_today' using errcode = 'P0002';
  end if;
  if p_answer is null or char_length(btrim(p_answer)) = 0 or char_length(p_answer) > 100 then
    raise exception 'invalid_answer' using errcode = '22023';
  end if;

  select * into v_q from public.questions q where q.id = p_question;
  return jsonb_build_object(
    'is_correct', private.check_answer(v_q.format, v_q.correct, p_answer),
    'correct', private.correct_public(v_q.format, v_q.correct),
    'explanation', v_q.explanation);
end
$$;

-- Kirgan foydalanuvchi: bugungi savol (kuniga bitta 'daily' sessiya), javob berilgan bo'lsa natija, streak.
-- Kvota sarflamaydi. Javob submit_answer(session_id, question.id, answer) bilan yuboriladi.
-- Qaytaradi: {date, next_at, session_id, question (javobsiz) | null, result: null | {answer, is_correct, correct,
-- explanation}, streak: {current, active_today}}.
create or replace function public.daily_question()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := private.require_user();
  v_today date := private.today_tashkent();
  v_qid   uuid := private.daily_pick(v_today);
  v_sid   uuid;
  v_sq    uuid;
  v_att   public.attempts;
  v_q     public.questions;
begin
  select s.id into v_sid from public.practice_sessions s
   where s.user_id = v_user and s.mode = 'daily' and s.daily_date = v_today;

  if v_sid is null and v_qid is not null then
    begin
      v_sid := private.create_session(v_user, 'daily', '{}'::jsonb, array[v_qid], v_today);
    exception when unique_violation then
      -- Parallel chaqiruv sessiyani allaqachon yaratgan.
      select s.id into v_sid from public.practice_sessions s
       where s.user_id = v_user and s.mode = 'daily' and s.daily_date = v_today;
    end;
  end if;

  if v_sid is not null then
    select * into v_att from public.attempts a where a.session_id = v_sid order by a.created_at limit 1;
    select sq.question_id into v_sq from public.session_questions sq where sq.session_id = v_sid order by sq.position limit 1;
    if v_att.id is null and v_qid is not null and v_sq is distinct from v_qid then
      -- Javob berilmagan sessiyadagi savol bugungi tanlovdan farq qiladi (savol yashirilgan): almashtiriladi.
      update public.session_questions sq set question_id = v_qid where sq.session_id = v_sid;
      v_sq := v_qid;
    end if;
  end if;

  if v_att.id is not null then
    select * into v_q from public.questions q where q.id = v_att.question_id and q.status = 'verified';
  elsif v_sq is not null and v_sq = v_qid then
    select * into v_q from public.questions q where q.id = v_sq;
  end if;

  return jsonb_build_object(
    'date', v_today,
    'next_at', private.daily_next_at(v_today),
    'session_id', case when v_q.id is not null then v_sid end,
    'question', case when v_q.id is not null then private.question_public(v_q.id) end,
    'result', case when v_q.id is not null and v_att.id is not null then jsonb_build_object(
                'answer', v_att.answer,
                'is_correct', v_att.is_correct,
                'correct', private.correct_public(v_q.format, v_q.correct),
                'explanation', v_q.explanation) end,
    'streak', private.daily_streak(v_user, v_today));
end
$$;

-- submit_answer (20261110120000 dan). O'zgarish faqat 'daily' sessiyada:
--   1) kvota sarflanmaydi (P19 qoidasi); 2) kun o'tgandan keyin javob qabul qilinmaydi ('daily_expired', 55000),
--   shunda streak faqat o'sha kuni berilgan javobdan hisoblanadi. Qolgani avvalgidek.
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
-- Huquqlar
------------------------------------------------------------------------------
revoke all on function private.daily_section(date) from public, anon, authenticated;
revoke all on function private.daily_next_at(date) from public, anon, authenticated;
revoke all on function private.daily_pick(date) from public, anon, authenticated;
revoke all on function private.question_public(uuid) from public, anon, authenticated;
revoke all on function private.daily_streak(uuid, date) from public, anon, authenticated;
revoke all on function private.correct_public(text, jsonb) from public, anon, authenticated;

revoke all on function public.daily_question_public() from public;
revoke all on function public.check_daily_answer(uuid, text) from public;
revoke all on function public.daily_question() from public, anon;
revoke all on function public.submit_answer(uuid, uuid, text, integer) from public, anon;

grant execute on function public.daily_question_public() to anon, authenticated;
grant execute on function public.check_daily_answer(uuid, text) to anon, authenticated;
grant execute on function public.daily_question() to authenticated;
grant execute on function public.submit_answer(uuid, uuid, text, integer) to authenticated;
