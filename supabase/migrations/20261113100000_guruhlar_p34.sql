-- P34. O'qituvchi guruhlari va o'quvchi roziligi (2026-11-12, muallif tasdig'i). Qarorlar: docs/qarorlar/004-guruhlar.md.
--
-- Asosiy qoida: o'qituvchi o'quvchining jadvallarini (attempts, sessiyalar va boshqalar) to'g'ridan-to'g'ri
-- O'QIY OLMAYDI. Natijani faqat public.group_progress() beradi: faqat guruh egasi, faqat guruhdagi o'quvchi,
-- faqat o'quvchi ruxsat bergan qism (share_summary, share_topics) va faqat guruhga qo'shilgan kundan keyingi urinishlar.
-- Email, yosh, to'lov va ota-ona ma'lumoti o'qituvchiga hech qachon qaytmaydi.
--
-- Guruh yaratish huquqi: group_licenses (muallif admin_grant_group_license bilan qo'lda beradi, audit_log ga yoziladi).
-- subscriptions/admin_grant_plan ishlatilmaydi: private.current_plan() eng yuqori obunani oladi va o'qituvchining
-- o'z mashq kvotasini o'zgartirib yuborardi.
--
-- A'zolik qatori bor = o'quvchi guruhda. Chiqish yoki chiqarib yuborish qatorni o'chiradi (nusxa qolmaydi).
-- Kutilgan xatolar: raise ... errcode 'P0001', message = kod (mijoz src/lib/sat/guruh.ts da matnga aylantiradi).
-- Taklif kodini qidirish xatosi (not_found) exception emas, jsonb {"error": ...}: urinish yozuvi saqlanib qolishi uchun.

-- Litsenziya ------------------------------------------------------------------

create table if not exists public.group_licenses (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  max_groups  integer not null check (max_groups between 1 and 100),
  max_members integer not null check (max_members between 1 and 500),
  starts_at   timestamptz not null default now(),
  ends_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint group_licenses_period check (ends_at is null or ends_at > starts_at)
);

create or replace trigger group_licenses_updated_at before update on public.group_licenses
  for each row execute function private.set_updated_at();

alter table public.group_licenses enable row level security;
revoke all on table public.group_licenses from public, anon, authenticated;
grant select on table public.group_licenses to authenticated;
drop policy if exists group_licenses_select_own on public.group_licenses;
create policy group_licenses_select_own on public.group_licenses
  for select to authenticated using (user_id = (select auth.uid()));

-- Amaldagi litsenziya (boshlangan va tugamagan) yoki null.
create or replace function private.group_license(p_user uuid)
returns public.group_licenses
language sql stable security definer
set search_path = ''
as $$
  select l.* from public.group_licenses l
   where l.user_id = p_user and l.starts_at <= now() and (l.ends_at is null or l.ends_at > now())
$$;
revoke all on function private.group_license(uuid) from public, anon, authenticated;

-- Guruhlar --------------------------------------------------------------------

create table if not exists public.groups (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users (id) on delete cascade,
  bolim           text not null default 'sat' check (bolim in ('sat')),
  name            text not null check (char_length(name) between 2 and 80 and name = btrim(name)),
  -- O'quvchiga rozilik ekranida ko'rinadigan o'qituvchi ismi (egasining profilidan olinmaydi).
  teacher_name    text not null check (char_length(teacher_name) between 2 and 80 and teacher_name = btrim(teacher_name)),
  invite_code     text not null unique check (invite_code ~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$'),
  code_rotated_at timestamptz not null default now(),
  archived_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists groups_owner_idx on public.groups (owner_id, created_at);

create or replace trigger groups_updated_at before update on public.groups
  for each row execute function private.set_updated_at();

alter table public.groups enable row level security;
revoke all on table public.groups from public, anon, authenticated;
grant select on table public.groups to authenticated;
drop policy if exists groups_select_own on public.groups;
create policy groups_select_own on public.groups
  for select to authenticated using (owner_id = (select auth.uid()));

-- A'zolik va rozilik ----------------------------------------------------------

create table if not exists public.group_members (
  id                  uuid primary key default gen_random_uuid(),
  group_id            uuid not null references public.groups (id) on delete cascade,
  user_id             uuid not null references auth.users (id) on delete cascade,
  -- O'qituvchiga ko'rinadigan ism: o'quvchi o'zi yozadi.
  member_name         text not null check (char_length(member_name) between 2 and 80 and member_name = btrim(member_name)),
  share_summary       boolean not null default false,
  share_topics        boolean not null default false,
  consent_version     text not null check (char_length(consent_version) between 1 and 32),
  consent_at          timestamptz not null default now(),
  -- 18 yoshgacha (user_metadata.age_group <> 'adult'): ota-ona yoki vasiy ismi va tasdiq vaqti.
  guardian_name       text check (guardian_name is null or char_length(guardian_name) between 2 and 80),
  guardian_consent_at timestamptz,
  joined_at           timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (group_id, user_id),
  constraint group_members_guardian check ((guardian_name is null) = (guardian_consent_at is null))
);
create index if not exists group_members_user_idx on public.group_members (user_id);

create or replace trigger group_members_updated_at before update on public.group_members
  for each row execute function private.set_updated_at();

alter table public.group_members enable row level security;
revoke all on table public.group_members from public, anon, authenticated;
grant select on table public.group_members to authenticated;
drop policy if exists group_members_select_own on public.group_members;
create policy group_members_select_own on public.group_members
  for select to authenticated using (user_id = (select auth.uid()));

-- Taklif kodini taxmin qilishdan himoya: noto'g'ri kod urinishlari (soatiga 20 tagacha).
create table if not exists private.group_code_attempts (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists group_code_attempts_user_idx on private.group_code_attempts (user_id, created_at desc);
revoke all on table private.group_code_attempts from public, anon, authenticated;

-- Yordamchilar ----------------------------------------------------------------

-- 8 belgi, adashtirmaydigan alifbo (0/O, 1/I/L yo'q). Tasodif manbasi: gen_random_uuid() (kriptografik).
-- UUID v4 ning 6-bayti (versiya) va 8-bayti (variant) qisman o'zgarmas: ular ishlatilmaydi.
create or replace function private.group_new_code()
returns text
language plpgsql volatile
set search_path = ''
as $$
declare
  alifbo constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  b bytea;
  kod text;
  i integer;
  baytlar constant integer[] := array[0, 1, 2, 3, 4, 5, 7, 9];
begin
  loop
    b := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
    kod := '';
    foreach i in array baytlar loop
      kod := kod || substr(alifbo, 1 + (get_byte(b, i) % 31), 1);
    end loop;
    exit when not exists (select 1 from public.groups where invite_code = kod);
  end loop;
  return kod;
end
$$;
revoke all on function private.group_new_code() from public, anon, authenticated;

create or replace function private.group_clean_text(p text, p_min integer, p_max integer, p_err text)
returns text
language plpgsql immutable
set search_path = ''
as $$
declare
  v text := regexp_replace(btrim(coalesce(p, '')), '\s+', ' ', 'g');
begin
  if char_length(v) < p_min or char_length(v) > p_max then
    raise exception '%', p_err using errcode = 'P0001';
  end if;
  return v;
end
$$;
revoke all on function private.group_clean_text(text, integer, integer, text) from public, anon, authenticated;

-- 18 yoshgacha deb hisoblanadimi: age_group aniq 'adult' bo'lmasa, ha (ehtiyot tomoni).
-- Eslatma: user_metadata ni foydalanuvchi o'zi o'zgartira oladi (P23 dagi ochiq savol, huquqshunos fikri kerak).
create or replace function private.is_minor(p_user uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select coalesce((select u.raw_user_meta_data ->> 'age_group' from auth.users u where u.id = p_user), '') <> 'adult'
$$;
revoke all on function private.is_minor(uuid) from public, anon, authenticated;

create or replace function private.group_owned(p_group uuid)
returns public.groups
language plpgsql stable security definer
set search_path = ''
as $$
declare
  g public.groups;
begin
  select * into g from public.groups where id = p_group and owner_id = (select auth.uid());
  if not found then raise exception 'group_not_found' using errcode = 'P0001'; end if;
  return g;
end
$$;
revoke all on function private.group_owned(uuid) from public, anon, authenticated;

create or replace function private.group_require_auth()
returns uuid
language plpgsql stable
set search_path = ''
as $$
declare
  v uuid := (select auth.uid());
begin
  if v is null then raise exception 'not_authenticated' using errcode = '28000'; end if;
  return v;
end
$$;
revoke all on function private.group_require_auth() from public, anon, authenticated;

-- Admin (faqat service_role) -----------------------------------------------------

create or replace function public.admin_grant_group_license(p_user uuid, p_max_groups integer, p_max_members integer,
                                                            p_days integer, p_reason text, p_actor text)
returns uuid
language plpgsql security definer
set search_path = ''
as $$
begin
  if p_actor is null or btrim(p_actor) = '' then raise exception 'actor_required' using errcode = '22023'; end if;
  if not exists (select 1 from auth.users where id = p_user) then raise exception 'user_not_found' using errcode = 'P0002'; end if;
  if p_days is not null and p_days < 1 then raise exception 'invalid_days' using errcode = '22023'; end if;

  insert into public.group_licenses (user_id, max_groups, max_members, starts_at, ends_at)
  values (p_user, p_max_groups, p_max_members, now(),
          case when p_days is null then null else now() + make_interval(days => p_days) end)
  on conflict (user_id) do update
    set max_groups = excluded.max_groups, max_members = excluded.max_members,
        starts_at = excluded.starts_at, ends_at = excluded.ends_at;

  insert into public.audit_log (actor, action, target_table, target_id, details)
  values (btrim(p_actor), 'grant_group_license', 'group_licenses', p_user::text,
          jsonb_build_object('max_groups', p_max_groups, 'max_members', p_max_members, 'days', p_days, 'reason', p_reason));
  return p_user;
end
$$;

create or replace function public.admin_revoke_group_license(p_user uuid, p_reason text, p_actor text)
returns uuid
language plpgsql security definer
set search_path = ''
as $$
declare
  n integer;
begin
  if p_actor is null or btrim(p_actor) = '' then raise exception 'actor_required' using errcode = '22023'; end if;
  delete from public.group_licenses where user_id = p_user;
  get diagnostics n = row_count;
  insert into public.audit_log (actor, action, target_table, target_id, details)
  values (btrim(p_actor), 'revoke_group_license', 'group_licenses', p_user::text,
          jsonb_build_object('reason', p_reason, 'changed', n = 1));
  return p_user;
end
$$;

revoke all on function public.admin_grant_group_license(uuid, integer, integer, integer, text, text) from public, anon, authenticated;
revoke all on function public.admin_revoke_group_license(uuid, text, text) from public, anon, authenticated;
grant execute on function public.admin_grant_group_license(uuid, integer, integer, integer, text, text) to service_role;
grant execute on function public.admin_revoke_group_license(uuid, text, text) to service_role;

-- O'qituvchi ------------------------------------------------------------------

-- Litsenziya holati va o'z guruhlari (kod va a'zolar soni bilan).
create or replace function public.group_teacher_overview()
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $$
declare
  v_user uuid := private.group_require_auth();
  l public.group_licenses := private.group_license(v_user);
begin
  return jsonb_build_object(
    'license', case when l.user_id is null then null else jsonb_build_object(
      'max_groups', l.max_groups, 'max_members', l.max_members, 'ends_at', l.ends_at) end,
    'groups', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', g.id, 'name', g.name, 'teacher_name', g.teacher_name, 'invite_code', g.invite_code,
               'archived', g.archived_at is not null, 'created_at', g.created_at,
               'members', (select count(*) from public.group_members m where m.group_id = g.id))
             order by g.archived_at nulls first, g.created_at)
        from public.groups g where g.owner_id = v_user), '[]'::jsonb));
end
$$;

create or replace function public.group_create(p_name text, p_teacher_name text)
returns uuid
language plpgsql security definer
set search_path = ''
as $$
declare
  v_user uuid := private.group_require_auth();
  l public.group_licenses := private.group_license(v_user);
  v_name text := private.group_clean_text(p_name, 2, 80, 'invalid_name');
  v_teacher text := private.group_clean_text(p_teacher_name, 2, 80, 'invalid_teacher_name');
  v_id uuid;
begin
  if l.user_id is null then raise exception 'no_license' using errcode = 'P0001'; end if;
  -- Bir egasi uchun parallel yaratish limitni chetlab o'tmasin.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('tayanch:groups:' || v_user::text, 0));
  if (select count(*) from public.groups where owner_id = v_user and archived_at is null) >= l.max_groups then
    raise exception 'group_limit' using errcode = 'P0001';
  end if;
  insert into public.groups (owner_id, name, teacher_name, invite_code)
  values (v_user, v_name, v_teacher, private.group_new_code())
  returning id into v_id;
  return v_id;
end
$$;

create or replace function public.group_rotate_code(p_group uuid)
returns text
language plpgsql security definer
set search_path = ''
as $$
declare
  g public.groups;
  v_kod text;
begin
  perform private.group_require_auth();
  g := private.group_owned(p_group);
  if g.archived_at is not null then raise exception 'group_archived' using errcode = 'P0001'; end if;
  v_kod := private.group_new_code();
  update public.groups set invite_code = v_kod, code_rotated_at = now() where id = g.id;
  return v_kod;
end
$$;

-- Arxiv: yangi a'zo qo'shilmaydi, o'qituvchi natijani ko'rmaydi. A'zolar guruhni ko'radi va chiqib keta oladi.
create or replace function public.group_archive(p_group uuid)
returns void
language plpgsql security definer
set search_path = ''
as $$
declare
  g public.groups;
begin
  perform private.group_require_auth();
  g := private.group_owned(p_group);
  update public.groups set archived_at = coalesce(archived_at, now()) where id = g.id;
end
$$;

-- O'chirish: guruh va hamma a'zolik (rozilik bilan birga) o'chadi.
create or replace function public.group_delete(p_group uuid)
returns void
language plpgsql security definer
set search_path = ''
as $$
declare
  g public.groups;
begin
  perform private.group_require_auth();
  g := private.group_owned(p_group);
  delete from public.groups where id = g.id;
end
$$;

create or replace function public.group_remove_member(p_group uuid, p_member uuid)
returns void
language plpgsql security definer
set search_path = ''
as $$
declare
  g public.groups;
begin
  perform private.group_require_auth();
  g := private.group_owned(p_group);
  delete from public.group_members where id = p_member and group_id = g.id;
  if not found then raise exception 'member_not_found' using errcode = 'P0001'; end if;
end
$$;

-- Guruh natijasi. Faqat egasi, faqat amaldagi litsenziya bilan, faqat arxivlanmagan guruh.
-- Ruxsat berilmagan qism null. Urinishlar faqat joined_at dan keyingilari.
create or replace function public.group_progress(p_group uuid)
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $$
declare
  v_user uuid := private.group_require_auth();
  g public.groups := private.group_owned(p_group);
begin
  if (private.group_license(v_user)).user_id is null then raise exception 'no_license' using errcode = 'P0001'; end if;
  if g.archived_at is not null then raise exception 'group_archived' using errcode = 'P0001'; end if;

  return jsonb_build_object(
    'group', jsonb_build_object('id', g.id, 'name', g.name),
    'members', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', m.id,
               'name', m.member_name,
               'joined_at', m.joined_at,
               'share_summary', m.share_summary,
               'share_topics', m.share_topics,
               'summary', case when m.share_summary then (
                  select jsonb_build_object(
                           'answered', count(*),
                           'correct', count(*) filter (where a.is_correct),
                           'answered_7d', count(*) filter (where a.created_at > now() - interval '7 days'),
                           'last_active', max(a.created_at))
                    from public.attempts a
                   where a.user_id = m.user_id and a.created_at >= m.joined_at) end,
               'topics', case when m.share_topics then (
                  select coalesce(jsonb_agg(jsonb_build_object(
                           'section', t.section, 'domain', t.domain, 'answered', t.n, 'correct', t.c)
                           order by t.section, t.domain), '[]'::jsonb)
                    from (select q.section, q.domain, count(*) as n, count(*) filter (where a.is_correct) as c
                            from public.attempts a
                            join public.questions q on q.id = a.question_id
                           where a.user_id = m.user_id and a.created_at >= m.joined_at
                           group by q.section, q.domain) t) end)
             order by lower(m.member_name), m.joined_at)
        from public.group_members m where m.group_id = g.id), '[]'::jsonb));
end
$$;

-- O'quvchi --------------------------------------------------------------------

-- Kod bo'yicha guruhni topish (urinishlar soni cheklangan). Kod topilmasa urinish yoziladi.
create or replace function private.group_by_code(p_user uuid, p_code text)
returns public.groups
language plpgsql security definer
set search_path = ''
as $$
declare
  v_kod text := upper(regexp_replace(coalesce(p_code, ''), '[\s-]', '', 'g'));
  g public.groups;
begin
  -- Faqat oxirgi soat kerak: shu foydalanuvchining eskilari o'chiriladi (jadval o'smaydi).
  delete from private.group_code_attempts where user_id = p_user and created_at <= now() - interval '1 hour';
  if (select count(*) from private.group_code_attempts
       where user_id = p_user and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'too_many_attempts' using errcode = 'P0001';
  end if;
  select * into g from public.groups where invite_code = v_kod;
  if not found or g.archived_at is not null or (private.group_license(g.owner_id)).user_id is null then
    insert into private.group_code_attempts (user_id) values (p_user);
    return null;
  end if;
  return g;
end
$$;
revoke all on function private.group_by_code(uuid, text) from public, anon, authenticated;

-- Rozilik ekrani uchun: guruh va o'qituvchi nomi, o'quvchi 18 yoshgachami, allaqachon a'zomi.
create or replace function public.group_preview(p_code text)
returns jsonb
language plpgsql volatile security definer
set search_path = ''
as $$
declare
  v_user uuid := private.group_require_auth();
  g public.groups := private.group_by_code(v_user, p_code);
begin
  if g.id is null then return jsonb_build_object('error', 'not_found'); end if;
  return jsonb_build_object(
    'name', g.name, 'teacher_name', g.teacher_name,
    'own_group', g.owner_id = v_user,
    'already_member', exists (select 1 from public.group_members where group_id = g.id and user_id = v_user),
    'minor', private.is_minor(v_user));
end
$$;

create or replace function public.group_join(p_code text, p_member_name text, p_share_summary boolean,
                                             p_share_topics boolean, p_consent_version text,
                                             p_guardian_name text, p_guardian_confirm boolean)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  v_user uuid := private.group_require_auth();
  g public.groups := private.group_by_code(v_user, p_code);
  v_name text;
  v_guardian text;
  v_version text := btrim(coalesce(p_consent_version, ''));
  v_id uuid;
begin
  if g.id is null then return jsonb_build_object('error', 'not_found'); end if;
  if g.owner_id = v_user then raise exception 'own_group' using errcode = 'P0001'; end if;
  if char_length(v_version) not between 1 and 32 then raise exception 'invalid_consent' using errcode = 'P0001'; end if;
  v_name := private.group_clean_text(p_member_name, 2, 80, 'invalid_member_name');
  if private.is_minor(v_user) then
    v_guardian := private.group_clean_text(p_guardian_name, 2, 80, 'guardian_required');
    if p_guardian_confirm is not true then raise exception 'guardian_required' using errcode = 'P0001'; end if;
  end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('tayanch:group-members:' || g.id::text, 0));
  if exists (select 1 from public.group_members where group_id = g.id and user_id = v_user) then
    raise exception 'already_member' using errcode = 'P0001';
  end if;
  if (select count(*) from public.group_members where group_id = g.id)
     >= (private.group_license(g.owner_id)).max_members then
    raise exception 'group_full' using errcode = 'P0001';
  end if;

  insert into public.group_members (group_id, user_id, member_name, share_summary, share_topics,
                                    consent_version, guardian_name, guardian_consent_at)
  values (g.id, v_user, v_name, coalesce(p_share_summary, false), coalesce(p_share_topics, false),
          v_version, v_guardian, case when v_guardian is null then null else now() end)
  returning id into v_id;
  return jsonb_build_object('id', v_id);
end
$$;

-- O'quvchining guruhlari va nimani ulashayotgani.
create or replace function public.group_my_memberships()
returns jsonb
language plpgsql stable security definer
set search_path = ''
as $$
declare
  v_user uuid := private.group_require_auth();
begin
  return jsonb_build_object(
    'minor', private.is_minor(v_user),
    'memberships', coalesce((
      select jsonb_agg(jsonb_build_object(
               'id', m.id, 'group_name', g.name, 'teacher_name', g.teacher_name,
               'archived', g.archived_at is not null, 'member_name', m.member_name,
               'share_summary', m.share_summary, 'share_topics', m.share_topics,
               'joined_at', m.joined_at, 'consent_at', m.consent_at)
             order by m.joined_at)
        from public.group_members m join public.groups g on g.id = m.group_id
       where m.user_id = v_user), '[]'::jsonb));
end
$$;

-- Ruxsatni o'zgartirish. Kamaytirish har doim mumkin; 18 yoshgacha bo'lsa, kengaytirish ota-ona tasdig'ini qayta so'raydi.
create or replace function public.group_update_sharing(p_member uuid, p_share_summary boolean, p_share_topics boolean,
                                                       p_consent_version text, p_guardian_name text,
                                                       p_guardian_confirm boolean)
returns void
language plpgsql security definer
set search_path = ''
as $$
declare
  v_user uuid := private.group_require_auth();
  m public.group_members;
  v_s boolean := coalesce(p_share_summary, false);
  v_t boolean := coalesce(p_share_topics, false);
  v_version text := btrim(coalesce(p_consent_version, ''));
  v_guardian text;
  v_kengaydi boolean;
begin
  select * into m from public.group_members where id = p_member and user_id = v_user for update;
  if not found then raise exception 'member_not_found' using errcode = 'P0001'; end if;
  if char_length(v_version) not between 1 and 32 then raise exception 'invalid_consent' using errcode = 'P0001'; end if;
  v_kengaydi := (v_s and not m.share_summary) or (v_t and not m.share_topics);
  if v_kengaydi and private.is_minor(v_user) then
    v_guardian := private.group_clean_text(p_guardian_name, 2, 80, 'guardian_required');
    if p_guardian_confirm is not true then raise exception 'guardian_required' using errcode = 'P0001'; end if;
  end if;
  update public.group_members
     set share_summary = v_s, share_topics = v_t, consent_version = v_version, consent_at = now(),
         guardian_name = coalesce(v_guardian, guardian_name),
         guardian_consent_at = case when v_guardian is null then guardian_consent_at else now() end
   where id = m.id;
end
$$;

-- Guruhdan chiqish: a'zolik va rozilik qatori o'chadi, o'qituvchi shu zahoti hech narsa ko'rmaydi.
create or replace function public.group_leave(p_member uuid)
returns void
language plpgsql security definer
set search_path = ''
as $$
declare
  v_user uuid := private.group_require_auth();
begin
  delete from public.group_members where id = p_member and user_id = v_user;
  if not found then raise exception 'member_not_found' using errcode = 'P0001'; end if;
end
$$;

-- Huquqlar: hamma public group_* faqat authenticated (va service_role) uchun.
do $$
declare
  f text;
begin
  foreach f in array array[
    'public.group_teacher_overview()',
    'public.group_create(text, text)',
    'public.group_rotate_code(uuid)',
    'public.group_archive(uuid)',
    'public.group_delete(uuid)',
    'public.group_remove_member(uuid, uuid)',
    'public.group_progress(uuid)',
    'public.group_preview(text)',
    'public.group_join(text, text, boolean, boolean, text, text, boolean)',
    'public.group_my_memberships()',
    'public.group_update_sharing(uuid, boolean, boolean, text, text, boolean)',
    'public.group_leave(uuid)'
  ] loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
end
$$;
