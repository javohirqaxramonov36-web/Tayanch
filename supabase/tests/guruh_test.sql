-- P34 guruh sinovlari (20261113100000_guruhlar_p34): litsenziya, taklif kodi, rozilik, RLS va group_progress.
-- Asosiy talab: o'qituvchi faqat o'z guruhidagi o'quvchilarning rozilik berilgan ma'lumotini ko'radi.
-- Bitta tranzaksiya, oxirida ROLLBACK.
\set ON_ERROR_STOP on
\set QUIET on

begin;

-- T1, T2: o'qituvchilar; S1: kattalar, S2: 18 yoshgacha, S3: begona o'quvchi; N: litsenziyasiz.
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000c1', 't1@sinov.invalid', '{"age_group": "adult"}'),
  ('00000000-0000-4000-8000-0000000000c2', 't2@sinov.invalid', '{"age_group": "adult"}'),
  ('00000000-0000-4000-8000-0000000000d1', 's1@sinov.invalid', '{"age_group": "adult"}'),
  ('00000000-0000-4000-8000-0000000000d2', 's2@sinov.invalid', '{"age_group": "minor", "guardian_name": "Ota"}'),
  ('00000000-0000-4000-8000-0000000000d3', 's3@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000e1', 'n@sinov.invalid', '{"age_group": "adult"}');

-- Yordamchi: SQL ni bajaradi, xato bo'lsa xabarini qaytaradi (chaqiruvchi huquqi bilan). ROLLBACK da o'chadi.
create function public.sinov_xato(q text) returns text language plpgsql as $$
begin
  execute q;
  return null;
exception when others then
  return sqlerrm;
end
$$;
grant execute on function public.sinov_xato(text) to anon, authenticated;

-- Savollar va urinishlar: S1 da qo'shilishdan OLDINGI urinish ham bor (u ko'rinmasligi kerak).
do $$
declare
  q1 uuid; q2 uuid; s uuid;
begin
  insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, options, correct, status, author)
  values ('gr-1', 'math', 'GR-algebra', 'GR-s', 2, 'mcq', 'SINOV', '[{"key": "A", "text": "1"}, {"key": "B", "text": "2"}]',
          '{"choice": "B"}', 'draft', 'sinov') returning id into q1;
  insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, options, correct, status, author)
  values ('gr-2', 'rw', 'GR-craft', 'GR-s', 2, 'mcq', 'SINOV', '[{"key": "A", "text": "1"}, {"key": "B", "text": "2"}]',
          '{"choice": "B"}', 'draft', 'sinov') returning id into q2;
  insert into public.practice_sessions (user_id, mode) values ('00000000-0000-4000-8000-0000000000d1', 'practice') returning id into s;
  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version, created_at)
  values ('00000000-0000-4000-8000-0000000000d1', s, q1, 'A', false, 1, now() - interval '30 days');
  perform set_config('test.q1', q1::text, true);
  perform set_config('test.q2', q2::text, true);
  perform set_config('test.s1_session', s::text, true);
end
$$;

-- Litsenziya (admin, service_role o'rnida postgres): T1 = 1 guruh / 2 a'zo, T2 = 2 guruh / 10 a'zo.
do $$ begin
  perform public.admin_grant_group_license('00000000-0000-4000-8000-0000000000c1', 1, 2, 30, 'sinov', 'sinov');
  perform public.admin_grant_group_license('00000000-0000-4000-8000-0000000000c2', 2, 10, null, 'sinov', 'sinov');
end $$;

do $$
begin
  if (select count(*) from public.audit_log where action = 'grant_group_license') <> 2 then
    raise exception 'FAIL G00: litsenziya audit_log ga yozilmadi';
  end if;
  raise notice 'OK G00 admin litsenziya beradi, audit yoziladi';
end
$$;

------------------------------------------------------------------------------
-- G01: anon hech narsa qila olmaydi
------------------------------------------------------------------------------
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
declare
  e text;
begin
  foreach e in array array[
    public.sinov_xato('select public.group_teacher_overview()'),
    public.sinov_xato('select public.group_preview(''ABCDEFGH'')'),
    public.sinov_xato('select public.group_my_memberships()'),
    public.sinov_xato('select count(*) from public.groups'),
    public.sinov_xato('select count(*) from public.group_members'),
    public.sinov_xato('select count(*) from public.group_licenses')] loop
    if e is null or e not like 'permission denied%' then raise exception 'FAIL G01: anon ruxsat oldi (%)', e; end if;
  end loop;
  raise notice 'OK G01 anon: group_* va guruh jadvallari yopiq';
end
$$;
reset role;

------------------------------------------------------------------------------
-- G02: litsenziyasiz foydalanuvchi guruh yarata olmaydi; admin funksiyasi authenticated uchun yopiq
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e1", "role": "authenticated"}', true) \gset
do $$
declare
  e text;
begin
  e := public.sinov_xato('select public.group_create(''Guruh'', ''Ustoz'')');
  if e is distinct from 'no_license' then raise exception 'FAIL G02: litsenziyasiz yaratildi (%)', e; end if;
  e := public.sinov_xato('select public.admin_grant_group_license(auth.uid(), 5, 5, null, ''x'', ''x'')');
  if e is null or e not like 'permission denied%' then raise exception 'FAIL G02: admin funksiyasi ochiq (%)', e; end if;
  e := public.sinov_xato('insert into public.group_licenses (user_id, max_groups, max_members) values (auth.uid(), 5, 5)');
  if e is null or e not like 'permission denied%' then raise exception 'FAIL G02: litsenziya to''g''ridan yozildi (%)', e; end if;
  raise notice 'OK G02 litsenziyasiz: group_create rad, litsenziyani o''zi yoza olmaydi';
end
$$;
reset role;

------------------------------------------------------------------------------
-- G03: T1 guruh yaratadi; limit 1; jadvalga to'g'ridan yozish yo'q
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  g uuid; kod text; e text; o jsonb;
begin
  g := public.group_create('  SAT   kechki  ', 'Ustoz Aziza');
  select invite_code into kod from public.groups where id = g;
  if kod !~ '^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$' then raise exception 'FAIL G03: kod formati %', kod; end if;
  if (select name from public.groups where id = g) <> 'SAT kechki' then raise exception 'FAIL G03: nom tozalanmadi'; end if;
  e := public.sinov_xato('select public.group_create(''Ikkinchi'', ''Ustoz'')');
  if e is distinct from 'group_limit' then raise exception 'FAIL G03: limit ishlamadi (%)', e; end if;
  e := public.sinov_xato('update public.groups set name = ''X''');
  if e is null or e not like 'permission denied%' then raise exception 'FAIL G03: jadval to''g''ridan o''zgardi (%)', e; end if;
  o := public.group_teacher_overview();
  if jsonb_array_length(o -> 'groups') <> 1 or (o -> 'license' ->> 'max_members')::int <> 2 then
    raise exception 'FAIL G03: overview %', o;
  end if;
  perform set_config('test.g1', g::text, true);
  perform set_config('test.kod1', kod, true);
  raise notice 'OK G03 guruh yaratildi, kod 8 belgi, limit 1, jadvalga to''g''ridan yozish yo''q';
end
$$;
reset role;

------------------------------------------------------------------------------
-- G04: S1 (kattalar) qo'shiladi: faqat umumiy natija; S2 (18 yoshgacha) ota-onasiz qo'shila olmaydi
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000d1", "role": "authenticated"}', true) \gset
do $$
declare
  p jsonb; r jsonb;
begin
  p := public.group_preview(lower(current_setting('test.kod1')));
  if p ->> 'name' <> 'SAT kechki' or p ->> 'teacher_name' <> 'Ustoz Aziza' or (p ->> 'minor')::boolean then
    raise exception 'FAIL G04: preview %', p;
  end if;
  if p ?| array['owner_id', 'email', 'invite_code'] then raise exception 'FAIL G04: preview ortiqcha maydon %', p; end if;
  r := public.group_join(current_setting('test.kod1'), 'Ali V.', true, false, 'guruh-2026-11-12', null, null);
  if r ? 'error' then raise exception 'FAIL G04: join %', r; end if;
  perform set_config('test.m1', r ->> 'id', true);
  if public.sinov_xato(format('select public.group_join(%L, ''Ali'', true, true, ''v'', null, null)', current_setting('test.kod1')))
     is distinct from 'already_member' then
    raise exception 'FAIL G04: ikki marta qo''shildi';
  end if;
  raise notice 'OK G04 S1 qo''shildi (umumiy natija: ha, mavzular: yo''q)';
end
$$;
reset role;

-- S1 qo'shilgandan keyingi urinishlar (postgres nomidan): 2 ta, biri to'g'ri.
insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version)
values ('00000000-0000-4000-8000-0000000000d1', current_setting('test.s1_session')::uuid, current_setting('test.q2')::uuid, 'B', true, 1);
do $$
declare
  s uuid;
begin
  insert into public.practice_sessions (user_id, mode) values ('00000000-0000-4000-8000-0000000000d1', 'practice') returning id into s;
  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version)
  values ('00000000-0000-4000-8000-0000000000d1', s, current_setting('test.q1')::uuid, 'A', false, 1);
end
$$;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000d2", "role": "authenticated"}', true) \gset
do $$
declare
  p jsonb; e text; r jsonb;
begin
  p := public.group_preview(current_setting('test.kod1'));
  if not (p ->> 'minor')::boolean then raise exception 'FAIL G05: S2 18 yoshgacha deb topilmadi'; end if;
  e := public.sinov_xato(format('select public.group_join(%L, ''Laylo'', false, false, ''v1'', null, null)', current_setting('test.kod1')));
  if e is distinct from 'guardian_required' then raise exception 'FAIL G05: ota-onasiz qo''shildi (%)', e; end if;
  e := public.sinov_xato(format('select public.group_join(%L, ''Laylo'', false, false, ''v1'', ''Ota Onasi'', false)', current_setting('test.kod1')));
  if e is distinct from 'guardian_required' then raise exception 'FAIL G05: tasdiqsiz qo''shildi (%)', e; end if;
  r := public.group_join(current_setting('test.kod1'), 'Laylo', false, false, 'v1', 'Ota Onasi', true);
  if r ? 'error' then raise exception 'FAIL G05: join %', r; end if;
  -- Kengaytirish ota-ona tasdig'ini qayta so'raydi
  e := public.sinov_xato(format('select public.group_update_sharing(%L, true, false, ''v1'', null, null)', r ->> 'id'));
  if e is distinct from 'guardian_required' then raise exception 'FAIL G05: kengaytirish tasdiqsiz o''tdi (%)', e; end if;
  -- S2 boshqa a'zoni ko'rmaydi
  if (select count(*) from public.group_members) <> 1 then raise exception 'FAIL G05: S2 boshqa a''zolarni ko''rdi'; end if;
  if public.sinov_xato(format('select public.group_progress(%L)', current_setting('test.g1'))) is distinct from 'group_not_found' then
    raise exception 'FAIL G05: o''quvchi guruh natijasini oldi';
  end if;
  if public.sinov_xato(format('select public.group_leave(%L)', current_setting('test.m1'))) is distinct from 'member_not_found' then
    raise exception 'FAIL G05: S2 S1 ni chiqarib yubordi';
  end if;
  raise notice 'OK G05 18 yoshgacha: ota-ona ismi va tasdig''i majburiy, kengaytirishda qayta so''raladi; boshqa a''zo ko''rinmaydi';
end
$$;
reset role;

-- S3 uchinchi bo'lib qo'shilmoqchi: limit 2
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000d3", "role": "authenticated"}', true) \gset
do $$
begin
  if public.sinov_xato(format('select public.group_join(%L, ''Sardor'', true, true, ''v1'', ''Ota'', true)', current_setting('test.kod1')))
     is distinct from 'group_full' then
    raise exception 'FAIL G06: a''zo limiti ishlamadi';
  end if;
  raise notice 'OK G06 a''zo limiti (max_members) ishlaydi';
end
$$;
reset role;

------------------------------------------------------------------------------
-- G07: T1 natijani ko'radi: faqat rozilik berilgan qism, faqat qo'shilgandan keyin
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  r jsonb; s1 jsonb; s2 jsonb;
begin
  r := public.group_progress(current_setting('test.g1')::uuid);
  if jsonb_array_length(r -> 'members') <> 2 then raise exception 'FAIL G07: a''zolar soni %', r; end if;
  select x into s1 from jsonb_array_elements(r -> 'members') x where x ->> 'name' = 'Ali V.';
  select x into s2 from jsonb_array_elements(r -> 'members') x where x ->> 'name' = 'Laylo';
  if (s1 -> 'summary' ->> 'answered')::int <> 2 or (s1 -> 'summary' ->> 'correct')::int <> 1 then
    raise exception 'FAIL G07: S1 umumiy natija noto''g''ri (qo''shilishdan oldingi urinish ham sanaldimi?) %', s1;
  end if;
  if s1 -> 'topics' <> 'null'::jsonb then raise exception 'FAIL G07: S1 mavzulari ruxsatsiz ko''rindi'; end if;
  if s2 -> 'summary' <> 'null'::jsonb or s2 -> 'topics' <> 'null'::jsonb then raise exception 'FAIL G07: S2 ma''lumoti ruxsatsiz ko''rindi'; end if;
  if r::text ~* 'email|guardian|age_group|user_id|payment' then raise exception 'FAIL G07: ortiqcha maydon: %', r; end if;
  -- To'g'ridan-to'g'ri o'qish: hech narsa
  if (select count(*) from public.attempts) <> 0 then raise exception 'FAIL G08: o''qituvchi attempts ni o''qidi'; end if;
  if (select count(*) from public.group_members) <> 0 then raise exception 'FAIL G08: o''qituvchi group_members ni o''qidi'; end if;
  if (select count(*) from public.profiles where id <> auth.uid()) <> 0 then raise exception 'FAIL G08: o''qituvchi profiles ni o''qidi'; end if;
  if (select count(*) from public.practice_sessions) <> 0 then raise exception 'FAIL G08: o''qituvchi sessiyalarni o''qidi'; end if;
  raise notice 'OK G07 o''qituvchi: S1 umumiy natijasi (faqat qo''shilgandan keyin), mavzular null; S2 hammasi null; email/yosh yo''q';
  raise notice 'OK G08 o''qituvchi attempts, group_members, profiles, practice_sessions dan 0 qator oladi';
end
$$;
reset role;

------------------------------------------------------------------------------
-- G09: T2 (boshqa o'qituvchi) T1 guruhini ko'rmaydi va o'zgartira olmaydi
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c2", "role": "authenticated"}', true) \gset
do $$
declare
  g text := current_setting('test.g1');
  q text;
begin
  if (select count(*) from public.groups) <> 0 then raise exception 'FAIL G09: T2 T1 guruhini ko''rdi'; end if;
  foreach q in array array[
    format('select public.group_progress(%L)', g),
    format('select public.group_rotate_code(%L)', g),
    format('select public.group_archive(%L)', g),
    format('select public.group_delete(%L)', g),
    format('select public.group_remove_member(%L, %L)', g, current_setting('test.m1'))] loop
    if public.sinov_xato(q) is distinct from 'group_not_found' then raise exception 'FAIL G09: % o''tdi', q; end if;
  end loop;
  perform set_config('test.g2', public.group_create('T2 guruhi', 'Ustoz B')::text, true);
  raise notice 'OK G09 boshqa o''qituvchi: guruhni ko''rmaydi, natija/kod/arxiv/o''chirish/chiqarish rad';
end
$$;
reset role;

------------------------------------------------------------------------------
-- G10: S1 ruxsatni kamaytiradi va chiqadi
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000d1", "role": "authenticated"}', true) \gset
do $$
declare
  r jsonb;
begin
  r := public.group_my_memberships();
  if jsonb_array_length(r -> 'memberships') <> 1 or (r -> 'memberships' -> 0 ->> 'teacher_name') <> 'Ustoz Aziza' then
    raise exception 'FAIL G10: memberships %', r;
  end if;
  perform public.group_update_sharing(current_setting('test.m1')::uuid, false, false, 'v2', null, null);
end
$$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  s1 jsonb;
begin
  select x into s1 from jsonb_array_elements(public.group_progress(current_setting('test.g1')::uuid) -> 'members') x
   where x ->> 'name' = 'Ali V.';
  if s1 -> 'summary' <> 'null'::jsonb then raise exception 'FAIL G10: rozilik qaytarilgandan keyin ham ko''rindi'; end if;
end
$$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000d1", "role": "authenticated"}', true) \gset
do $$ begin perform public.group_leave(current_setting('test.m1')::uuid); end $$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  r jsonb := public.group_progress(current_setting('test.g1')::uuid);
begin
  if exists (select 1 from jsonb_array_elements(r -> 'members') x where x ->> 'name' = 'Ali V.') then
    raise exception 'FAIL G10: chiqqan o''quvchi hali ko''rinadi';
  end if;
  raise notice 'OK G10 rozilik qaytarilsa null, guruhdan chiqsa o''qituvchi shu zahoti ko''rmaydi';
end
$$;
reset role;

------------------------------------------------------------------------------
-- G11: kod yangilansa eski kod ishlamaydi; noto'g'ri kod urinishlari cheklangan
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
select set_config('test.kod1_yangi', public.group_rotate_code(current_setting('test.g1')::uuid), true) \gset
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000d3", "role": "authenticated"}', true) \gset
do $$
declare
  e text;
begin
  if public.group_preview(current_setting('test.kod1')) ->> 'error' <> 'not_found' then
    raise exception 'FAIL G11: eski kod ishladi';
  end if;
  for i in 2..20 loop
    perform public.group_preview('ZZZZZZZZ');
  end loop;
  e := public.sinov_xato(format('select public.group_preview(%L)', current_setting('test.kod1_yangi')));
  if e is distinct from 'too_many_attempts' then raise exception 'FAIL G11: urinish cheklovi ishlamadi (%)', e; end if;
  raise notice 'OK G11 eski kod yaroqsiz; 20 ta noto''g''ri urinishdan keyin to''g''ri kod ham bloklanadi (1 soat)';
end
$$;
reset role;

------------------------------------------------------------------------------
-- G12: arxiv va litsenziya tugashi
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c2", "role": "authenticated"}', true) \gset
select set_config('test.kod2', (select invite_code from public.groups where id = current_setting('test.g2')::uuid), true) \gset
do $$ begin perform public.group_archive(current_setting('test.g2')::uuid); end $$;
do $$
begin
  if public.sinov_xato(format('select public.group_progress(%L)', current_setting('test.g2'))) is distinct from 'group_archived' then
    raise exception 'FAIL G12: arxivdagi guruh natijasi ochiq';
  end if;
end
$$;
reset role;

do $$ begin perform public.admin_revoke_group_license('00000000-0000-4000-8000-0000000000c1', 'sinov', 'sinov'); end $$;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e1", "role": "authenticated"}', true) \gset
do $$
begin
  if public.group_preview(current_setting('test.kod2')) ->> 'error' <> 'not_found' then
    raise exception 'FAIL G12: arxivdagi guruhga qo''shilish mumkin';
  end if;
  if public.group_preview(current_setting('test.kod1_yangi')) ->> 'error' <> 'not_found' then
    raise exception 'FAIL G12: litsenziyasi olingan guruhga qo''shilish mumkin';
  end if;
end
$$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
begin
  if public.sinov_xato(format('select public.group_progress(%L)', current_setting('test.g1'))) is distinct from 'no_license' then
    raise exception 'FAIL G12: litsenziyasiz natija ochiq';
  end if;
  -- O'chirish litsenziyasiz ham mumkin: a'zolik va rozilik qatorlari ham o'chadi
  perform public.group_delete(current_setting('test.g1')::uuid);
end
$$;
reset role;

do $$
begin
  if exists (select 1 from public.group_members where group_id = current_setting('test.g1')::uuid) then
    raise exception 'FAIL G12: guruh o''chganda a''zolik qoldi';
  end if;
  raise notice 'OK G12 arxiv va litsenziya tugashi: qo''shilish va natija yopiq; o''chirishda a''zolik ham o''chadi';
end
$$;

do $$ begin raise notice 'GURUH SINOVLARI O''TDI'; end $$;

rollback;
