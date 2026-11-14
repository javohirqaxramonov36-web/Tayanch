-- 1e: tavsiya va xato daftariga faqat hisob egasining kurs metama'lumoti.
create or replace function public.course_links(p_questions uuid[] default '{}')
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  with foydalanuvchi as (select private.require_user() as id)
  select jsonb_build_object(
    'passed', coalesce((
      select jsonb_agg(distinct s.filters -> 'course' ->> 'topic_id')
      from public.practice_sessions s, foydalanuvchi f
      where s.user_id = f.id and s.mode = 'mini_test' and s.finished_at is not null
        and s.filters -> 'course' ->> 'v' = '1'
        and s.question_count > 0
        and (select count(*) from public.attempts a
          where a.session_id = s.id and a.user_id = f.id and a.is_correct) * 10 >= s.question_count * 7
    ), '[]'::jsonb),
    'questions', coalesce((
      select jsonb_object_agg(q.id, upper(split_part((private.course_tags(q.tags))[1], ':', 3)))
      from public.questions q, foydalanuvchi f
      where q.id = any(p_questions)
        and cardinality(p_questions) <= 500
        and q.section = 'math' and q.status = 'verified'
        and cardinality(private.course_tags(q.tags)) = 1
        and (exists(select 1 from public.review_queue r where r.user_id = f.id and r.question_id = q.id)
          or exists(select 1 from public.bookmarks b where b.user_id = f.id and b.question_id = q.id))
    ), '{}'::jsonb)
  )
$$;
revoke all on function public.course_links(uuid[]) from public, anon;
grant execute on function public.course_links(uuid[]) to authenticated;
