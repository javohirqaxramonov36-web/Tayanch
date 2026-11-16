-- P24. Savol xatosi haqida xabar (reports) va fikr-mulohaza (feedback): takror va tezlik cheklovi.
-- Jadvallar va RLS 0007 da bor (foydalanuvchi faqat o'z yozuvini o'qiydi va qo'shadi); bu yerda o'zgarmaydi.
--
-- Qoidalar:
--   * Bir foydalanuvchida bir savolga bitta ochiq xabar (status 'open' yoki 'reviewed'). Muallif 'closed' qilgach
--     (masalan savol to'g'rilangach) yana xabar yuborish mumkin.
--   * Tezlik: 24 soatda 10 ta report va 5 ta feedback. BOSHLANG'ICH QIYMAT, muallif tasdig'i kerak (P24, 2026-11-12).
--     O'zgartirish: private.xabar_limit() ni yangi migratsiyada qayta yozish.
--   * Report faqat qoralama bo'lmagan savolga (verified yoki hidden) va faqat o'z sessiyasi bilan.
-- Xato matnlari (mijoz shu so'zlarni tekshiradi, src/lib/sat/xabar.ts):
--   report_duplicate (23505), report_rate_limited, feedback_rate_limited (P0001),
--   question_not_reportable, session_not_found (P0002), feedback_empty (22023).
-- Admin: public.admin_unhide_question() (faqat service role, audit_log ga yoziladi). Qo'llanma: docs/admin-qollanma.md.

create or replace function private.xabar_limit(p_tur text)
returns integer
language sql
immutable
set search_path = ''
as $$
  -- Boshlang'ich qiymatlar, muallif tasdig'i kerak.
  select case p_tur when 'report' then 10 when 'feedback' then 5 end
$$;

-- Bir vaqtdagi ikki so'rov ham takror tekshiruvidan o'tib ketmasin: zaxira sifatida noyob indeks.
create unique index if not exists reports_open_unique
  on public.reports (user_id, question_id) where status in ('open', 'reviewed');

create index if not exists reports_user_created_idx on public.reports (user_id, created_at desc);
create index if not exists feedback_user_created_idx on public.feedback (user_id, created_at desc);

create or replace function private.reports_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status text;
begin
  -- Bir foydalanuvchining so'rovlari ketma-ket tekshiriladi (sanash poygasi bo'lmasin).
  perform pg_advisory_xact_lock(hashtextextended('tayanch:reports:' || new.user_id::text, 0));

  select q.status into v_status from public.questions q where q.id = new.question_id;
  if v_status is null or v_status = 'draft' then
    raise exception 'question_not_reportable' using errcode = 'P0002';
  end if;

  if new.session_id is not null and not exists (
    select 1 from public.practice_sessions s where s.id = new.session_id and s.user_id = new.user_id
  ) then
    raise exception 'session_not_found' using errcode = 'P0002';
  end if;

  if exists (
    select 1 from public.reports r
     where r.user_id = new.user_id and r.question_id = new.question_id and r.status in ('open', 'reviewed')
  ) then
    raise exception 'report_duplicate' using errcode = '23505';
  end if;

  if (select count(*) from public.reports r
       where r.user_id = new.user_id and r.created_at > now() - interval '24 hours') >= private.xabar_limit('report') then
    raise exception 'report_rate_limited' using errcode = 'P0001';
  end if;

  new.message := nullif(btrim(new.message), '');
  return new;
end
$$;

create or replace trigger reports_guard before insert on public.reports
  for each row execute function private.reports_guard();

create or replace function private.feedback_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended('tayanch:feedback:' || new.user_id::text, 0));

  new.message := btrim(new.message);
  if new.message = '' then
    raise exception 'feedback_empty' using errcode = '22023';
  end if;
  new.page := nullif(btrim(new.page), '');

  if (select count(*) from public.feedback f
       where f.user_id = new.user_id and f.created_at > now() - interval '24 hours') >= private.xabar_limit('feedback') then
    raise exception 'feedback_rate_limited' using errcode = 'P0001';
  end if;
  return new;
end
$$;

create or replace trigger feedback_guard before insert on public.feedback
  for each row execute function private.feedback_guard();

-- To'g'rilangan savolni qayta ochish. P05 importi hidden savolni ochmaydi (scripts/savol-import.mjs),
-- shuning uchun to'g'rilangan versiya import qilingach muallif shu funksiyani chaqiradi.
create or replace function public.admin_unhide_question(p_external_id text, p_reason text, p_actor text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id     uuid;
  v_old    text;
  v_tasdiq text;
begin
  if p_actor is null or btrim(p_actor) = '' then
    raise exception 'actor_required' using errcode = '22023';
  end if;
  select q.id, q.status, q.verified_by into v_id, v_old, v_tasdiq
    from public.questions q where q.external_id = p_external_id for update;
  if not found then
    raise exception 'question_not_found' using errcode = 'P0002';
  end if;
  if v_old <> 'hidden' then
    raise exception 'question_not_hidden' using errcode = '22023';
  end if;
  if v_tasdiq is null or btrim(v_tasdiq) = '' then
    raise exception 'question_not_verified' using errcode = '22023';
  end if;

  update public.questions set status = 'verified' where id = v_id;

  insert into public.audit_log (actor, action, target_table, target_id, details)
  values (p_actor, 'unhide_question', 'questions', v_id::text,
          jsonb_build_object('external_id', p_external_id, 'old_status', v_old, 'reason', p_reason));
  return v_id;
end
$$;

revoke all on function private.xabar_limit(text) from public, anon, authenticated;
revoke all on function private.reports_guard() from public, anon, authenticated;
revoke all on function private.feedback_guard() from public, anon, authenticated;
revoke all on function public.admin_unhide_question(text, text, text) from public, anon, authenticated;
grant execute on function public.admin_unhide_question(text, text, text) to service_role;
