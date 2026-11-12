-- P09 Xato daftari: savol banki xatolari va saqlangan savollar ro'yxati (/uz/sat/vosita/takrorlash/).
-- Leitner qoidasi o'zgarmaydi (submit_answer, start_review_session, src/lib/takrorlash.ts).
-- 1) review_queue.reason_tag faqat 5 ta teg (sessiya va xato daftari bilan bir xil).
-- 2) review_overview(): foydalanuvchining navbati va saqlanganlari, qisqa ko'rinish bilan; javob va tushuntirish yo'q.
-- 3) review_preview(p_question): bitta savolning to'liq matni va variantlari (javobsiz), faqat ro'yxatdagi savol uchun.
-- Ikkalasi kvota sarflamaydi: savolni foydalanuvchi sessiyada allaqachon ko'rgan.

-- 1. Teglar. Ro'yxatda yo'q eski teg (P08 UI faqat 4 tasini yozadi) 'other' ga o'tadi: aks holda shu qatorni
-- yangilash (masalan submit_answer qutini o'zgartirsa) cheklovga urilardi.
update public.review_queue
   set reason_tag = 'other'
 where reason_tag is not null and reason_tag not in ('careless', 'concept_gap', 'time_pressure', 'misread', 'other');
alter table public.review_queue drop constraint if exists review_queue_reason_tag_kalit;
alter table public.review_queue add constraint review_queue_reason_tag_kalit
  check (reason_tag is null or reason_tag in ('careless', 'concept_gap', 'time_pressure', 'misread', 'other'));

-- Qisqa ko'rinish: HTML teglarsiz, bo'shliqlar bitta, 140 belgigacha. R&W da parcha (passage), bo'lmasa savol matni.
create or replace function private.savol_qisqa(p_passage text, p_stem text)
returns text
language sql
immutable
set search_path = ''
as $$
  select left(btrim(regexp_replace(regexp_replace(coalesce(nullif(btrim(p_passage), ''), p_stem), '<[^>]*>', ' ', 'g'), '\s+', ' ', 'g')), 140)
$$;

-- 2. Ro'yxat. Faqat verified savollar; ko'pi bilan 500 qator (navbat va saqlanganlar birlashgan).
create or replace function public.review_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
begin
  return jsonb_build_object(
    'today', private.today_tashkent(),
    'items', coalesce((
      select jsonb_agg(x.j order by x.saralash, x.question_id)
      from (
        select ids.question_id,
               coalesce(r.next_due::text, '9999-12-31') || coalesce(b.created_at::text, '') as saralash,
               jsonb_build_object(
                 'question_id', ids.question_id,
                 'section', q.section,
                 'domain', q.domain,
                 'skill', q.skill,
                 'difficulty', q.difficulty,
                 'format', q.format,
                 'preview', private.savol_qisqa(q.passage, q.stem),
                 'in_queue', r.question_id is not null,
                 'box', r.box,
                 'next_due', r.next_due,
                 'reason_tag', r.reason_tag,
                 'note', r.note,
                 'first_missed_at', r.first_missed_at,
                 'last_reviewed_at', r.last_reviewed_at,
                 'bookmarked', b.question_id is not null,
                 'bookmarked_at', b.created_at
               ) as j
        from (
          select rq.question_id from public.review_queue rq where rq.user_id = v_user
          union
          select bm.question_id from public.bookmarks bm where bm.user_id = v_user
        ) ids
        join public.questions q on q.id = ids.question_id and q.status = 'verified'
        left join public.review_queue r on r.user_id = v_user and r.question_id = ids.question_id
        left join public.bookmarks b on b.user_id = v_user and b.question_id = ids.question_id
        order by 2, 1
        limit 500
      ) x
    ), '[]'::jsonb)
  );
end
$$;

-- 3. Bitta savolni ochish: matn va variantlar, javob (correct) va tushuntirish (explanation) yo'q.
create or replace function public.review_preview(p_question uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_q    public.questions;
begin
  if not exists (select 1 from public.review_queue r where r.user_id = v_user and r.question_id = p_question)
     and not exists (select 1 from public.bookmarks b where b.user_id = v_user and b.question_id = p_question) then
    raise exception 'not_in_list' using errcode = 'P0002';
  end if;
  select * into v_q from public.questions q where q.id = p_question and q.status = 'verified';
  if not found then
    raise exception 'question_unavailable' using errcode = 'P0002';
  end if;
  return jsonb_build_object(
    'id', v_q.id,
    'section', v_q.section,
    'domain', v_q.domain,
    'skill', v_q.skill,
    'difficulty', v_q.difficulty,
    'format', v_q.format,
    'passage', v_q.passage,
    'stem', v_q.stem,
    'options', (select jsonb_agg(jsonb_build_object('key', e.opt ->> 'key', 'text', e.opt ->> 'text') order by e.ord)
                from jsonb_array_elements(v_q.options) with ordinality as e(opt, ord)),
    'figure', case when v_q.figure is null then null else
                jsonb_build_object('path', v_q.figure ->> 'path', 'alt', v_q.figure ->> 'alt', 'caption', v_q.figure ->> 'caption') end
  );
end
$$;

revoke all on function private.savol_qisqa(text, text) from public, anon, authenticated;
revoke all on function public.review_overview() from public, anon;
revoke all on function public.review_preview(uuid) from public, anon;
grant execute on function public.review_overview() to authenticated;
grant execute on function public.review_preview(uuid) to authenticated;
