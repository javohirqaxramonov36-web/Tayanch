-- 0011. Mashq sessiyasi sahifasi (P08, /uz/sat/mashq/sessiya/): sessiyani qayta ochish, yakunlash,
-- redo ro'yxatiga qo'shish; submit_answer: bir vaqtdagi ikki so'rov va yakunlangan sessiya.
-- Takror ishga tushirish xavfsiz (create or replace).
--
-- Taymerli rejim vaqti (CB03, Digital SAT tuzilmasi, 2026-11-05 da tekshirilgan):
--   Reading and Writing 64 daqiqa / 54 savol ≈ 71,1 s, Math 70 daqiqa / 44 savol ≈ 95,5 s har savolga.
--   Sessiya chegarasi = savollar bo'yicha yig'indi, butun soniyaga yaxlitlangan. Vaqtni mijoz started_at dan sanaydi
--   (qayta yuklash taymerni nolga qaytarmaydi). Server hozircha muddatdan keyingi javobni rad etmaydi (ochiq savol).

create schema if not exists private;

-- Taymerli sessiya chegarasi, millisekund.
create or replace function private.session_time_limit_ms(p_session uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select (ceil(coalesce(sum(case q.section when 'rw' then 3840000.0 / 54 else 4200000.0 / 44 end), 0) / 1000) * 1000)::integer
  from public.session_questions sq
  join public.questions q on q.id = sq.question_id
  where sq.session_id = p_session
$$;

------------------------------------------------------------------------------
-- Sessiyani qayta ochish (sahifa yangilanganda, internet qaytganda, ikkinchi tabda). Kvota sarflamaydi.
-- Savollar session_payload kabi JAVOBSIZ. To'g'ri javob va tushuntirish faqat javob berilgan savollar uchun (results).
create or replace function public.get_session(p_session uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_s    public.practice_sessions;
begin
  select * into v_s from public.practice_sessions s where s.id = p_session and s.user_id = v_user;
  if not found then
    raise exception 'session_not_found' using errcode = 'P0002';
  end if;

  return private.session_payload(p_session) || jsonb_build_object(
    'finished_at', v_s.finished_at,
    'server_now', now(),
    'time_limit_ms', case when v_s.mode = 'timed' then private.session_time_limit_ms(p_session) end,
    'results', coalesce((
      select jsonb_agg(jsonb_build_object(
               'question_id', a.question_id,
               'answer', a.answer,
               'is_correct', a.is_correct,
               'correct', case q.format when 'mcq' then q.correct -> 'choice' else q.correct -> 'accepted' end,
               'explanation', q.explanation,
               'time_ms', a.time_ms
             ) order by a.created_at)
      from public.attempts a
      join public.questions q on q.id = a.question_id
      where a.session_id = p_session and a.user_id = v_user
    ), '[]'::jsonb),
    -- Shu sessiya savollaridan redo ro'yxatida (1–4-qutilar) turganlari va xato sababi tegi
    'review', coalesce((
      select jsonb_agg(jsonb_build_object('question_id', r.question_id, 'reason_tag', r.reason_tag))
      from public.review_queue r
      join public.session_questions sq on sq.question_id = r.question_id and sq.session_id = p_session
      where r.user_id = v_user and r.box < 5
    ), '[]'::jsonb)
  );
end
$$;

------------------------------------------------------------------------------
-- Sessiyani yakunlaydi (o'tkazib yuborilgan savol qolgan bo'lsa ham). Takror chaqirilsa birinchi vaqt qoladi.
create or replace function public.finish_session(p_session uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_f    timestamptz;
begin
  update public.practice_sessions s
     set finished_at = coalesce(s.finished_at, now())
   where s.id = p_session and s.user_id = v_user
  returning s.finished_at into v_f;
  if not found then
    raise exception 'session_not_found' using errcode = 'P0002';
  end if;
  return jsonb_build_object('finished_at', v_f);
end
$$;

------------------------------------------------------------------------------
-- "Add to redo list": foydalanuvchiga biror sessiyada berilgan savolni takrorlash navbatiga qo'yadi.
-- Navbatda (1–4-quti) bo'lsa o'zgarmaydi; o'zlashtirilgan (5) bo'lsa 1-qutiga, ertaga qaytadi.
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

  insert into public.review_queue (user_id, question_id, box, next_due)
  values (v_user, p_question, 1, v_today + 1)
  on conflict (user_id, question_id) do update
    set box = 1, next_due = v_today + 1
    where public.review_queue.box >= 5;

  return jsonb_build_object('in_review', true);
end
$$;

------------------------------------------------------------------------------
-- submit_answer (0008 dan): 1) bir savolga bir vaqtda ikki so'rov kelsa (ikki tab, tez ikki bosish) ikkinchisi
-- unique xatosi emas, saqlangan natijani oladi; 2) yakunlangan sessiyaga yangi javob qabul qilinmaydi
-- (natija sahifasida to'g'ri javobni ko'rib, keyin javob yuborib bo'lmasin). Qolgani 0008 bilan bir xil.
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

  perform private.consume_quota(v_user, 'answers', 1);

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
revoke all on function private.session_time_limit_ms(uuid) from public, anon, authenticated;

revoke all on function public.get_session(uuid) from public, anon;
revoke all on function public.finish_session(uuid) from public, anon;
revoke all on function public.add_to_review(uuid) from public, anon;
revoke all on function public.submit_answer(uuid, uuid, text, integer) from public, anon;

grant execute on function public.get_session(uuid) to authenticated;
grant execute on function public.finish_session(uuid) to authenticated;
grant execute on function public.add_to_review(uuid) to authenticated;
grant execute on function public.submit_answer(uuid, uuid, text, integer) to authenticated;
