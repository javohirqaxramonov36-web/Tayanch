-- P31. Mock imtihon (adaptive-style): savol qiyinligini foydalanuvchilar natijasiga ko'ra kalibrlash.
-- Rasmiy SAT algoritmi (IRT) emas: to'g'ri javob ulushi pog'onalarga solinadi. Hujjat: docs/sat-adaptiv.md.
-- Standart qiymatlar src/data/satAdaptiv.ts (kalibrlash.minJavob, kalibrlash.pogonalar) bilan bir xil
-- (src/lib/testlar/adaptiv.test.ts tekshiradi). N va pog'onalar muallif tasdig'ini kutadi.
--
-- Qoidalar:
--  * faqat status = 'verified' savollar;
--  * har foydalanuvchining savolning JORIY versiyasiga bergan BIRINCHI javobi sanaladi
--    (takror urinish, redo va matn o'zgargungacha berilgan javoblar ulushni buzmasin);
--  * javoblar p_min_answers dan kam bo'lsa taklif yo'q, qiyinlik o'zgarmaydi.
-- Ikkala funksiya ham faqat egasi (SQL Editor, postgres) uchun: anon, authenticated va service_role chaqira olmaydi.

create or replace function private.difficulty_calibration(
  p_min_answers integer default 30,
  p_bands numeric[] default '{80,60,40,20}'
)
returns table (
  question_id uuid,
  external_id text,
  section text,
  current_difficulty smallint,
  answers bigint,
  correct bigint,
  p_correct numeric,
  suggested_difficulty smallint,
  status text
)
language sql
stable
security definer
set search_path = ''
as $$
  with birinchi as (
    select distinct on (a.user_id, a.question_id) a.question_id, a.is_correct
    from public.attempts a
    join public.questions q on q.id = a.question_id and q.version = a.question_version
    order by a.user_id, a.question_id, a.created_at, a.id
  ),
  jami as (
    select q.id, q.external_id, q.section, q.difficulty,
           count(b.question_id) as n,
           count(b.question_id) filter (where b.is_correct) as ok
    from public.questions q
    left join birinchi b on b.question_id = q.id
    where q.status = 'verified'
    group by q.id
  ),
  hisob as (
    select j.*,
           case when j.n > 0 then round(100.0 * j.ok / j.n, 1) end as ulush,
           case when j.n >= p_min_answers and j.n > 0 then
             (case
                when 100.0 * j.ok / j.n >= p_bands[1] then 1
                when 100.0 * j.ok / j.n >= p_bands[2] then 2
                when 100.0 * j.ok / j.n >= p_bands[3] then 3
                when 100.0 * j.ok / j.n >= p_bands[4] then 4
                else 5
              end)::smallint
           end as taklif
    from jami j
  )
  select h.id, h.external_id, h.section, h.difficulty, h.n, h.ok, h.ulush, h.taklif,
         case when h.taklif is null then 'not_enough'
              when h.taklif = h.difficulty then 'ok'
              else 'change' end
  from hisob h
  order by (h.taklif is null), (h.taklif is not distinct from h.difficulty), h.n desc, h.external_id;
$$;

-- Hisobotdagi 'change' qatorlarini yozadi. p_actor majburiy (kim tasdiqladi), har o'zgarish audit_log ga.
-- Qiyinlik o'zgarishi questions.version ni oshirmaydi (questions_bump_version faqat matnni kuzatadi).
create or replace function private.apply_difficulty_calibration(
  p_actor text,
  p_min_answers integer default 30,
  p_bands numeric[] default '{80,60,40,20}'
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  r record;
  v_son integer := 0;
begin
  if p_actor is null or btrim(p_actor) = '' then
    raise exception 'p_actor majburiy (kim tasdiqladi)' using errcode = '22023';
  end if;
  if p_min_answers is null or p_min_answers < 1 then
    raise exception 'p_min_answers kamida 1' using errcode = '22023';
  end if;
  if p_bands is null or array_length(p_bands, 1) <> 4
     or not (p_bands[1] > p_bands[2] and p_bands[2] > p_bands[3] and p_bands[3] > p_bands[4]) then
    raise exception 'p_bands: 4 ta kamayuvchi qiymat kerak' using errcode = '22023';
  end if;

  for r in
    select * from private.difficulty_calibration(p_min_answers, p_bands) c where c.status = 'change'
  loop
    update public.questions set difficulty = r.suggested_difficulty where id = r.question_id;
    insert into public.audit_log (actor, action, target_table, target_id, details)
    values (p_actor, 'difficulty_calibration', 'questions', r.question_id::text,
            jsonb_build_object('external_id', r.external_id, 'from', r.current_difficulty, 'to', r.suggested_difficulty,
                               'answers', r.answers, 'p_correct', r.p_correct,
                               'min_answers', p_min_answers, 'bands', to_jsonb(p_bands)));
    v_son := v_son + 1;
  end loop;
  return v_son;
end
$$;

revoke all on function private.difficulty_calibration(integer, numeric[]) from public, anon, authenticated, service_role;
revoke all on function private.apply_difficulty_calibration(text, integer, numeric[]) from public, anon, authenticated, service_role;
