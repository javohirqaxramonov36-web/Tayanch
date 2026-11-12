-- P24 sinovlari (20261112151943_xabar_cheklov): reports va feedback cheklovlari, RLS, admin_unhide_question.
-- Bitta tranzaksiya, oxirida ROLLBACK. npm run db:tekshir ichida ishga tushadi.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000e1', 'x1@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000e2', 'x2@sinov.invalid', '{}');

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, status, author, verified_by, verified_at)
select 'xabar-sinov-' || g, 'math', 'SINOV-domain', 'SINOV-skill', 2, 'mcq', 'SINOV savol ' || g,
       '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]', '{"choice": "A"}',
       case when g = 12 then 'draft' else 'verified' end, 'sinov',
       case when g = 12 then null else 'sinov-tekshiruvchi' end, case when g = 12 then null else now() end
  from generate_series(1, 12) g;

insert into public.practice_sessions (id, user_id, mode) values
  ('00000000-0000-4000-8000-0000000000d1', '00000000-0000-4000-8000-0000000000e1', 'practice'),
  ('00000000-0000-4000-8000-0000000000d2', '00000000-0000-4000-8000-0000000000e2', 'practice');

-- Sinov ichida id lar (authenticated questions jadvalini o'qiy olmaydi): test.xq<n> sozlamalari.
select set_config('test.xq' || g, (select id::text from public.questions where external_id = 'xabar-sinov-' || g), true)
  from generate_series(1, 12) g \g /dev/null

------------------------------------------------------------------------------
-- Foydalanuvchi 1
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e1", "role": "authenticated"}', true) \gset

do $$
declare
  ok boolean;
begin
  -- X01: report yuboriladi, bo'sh izoh null bo'ladi, status 'open'
  insert into public.reports (question_id, session_id, reason, message)
  values (current_setting('test.xq' || 1)::uuid, '00000000-0000-4000-8000-0000000000d1', 'typo', '   ');
  if (select count(*) from public.reports where question_id = current_setting('test.xq' || 1)::uuid) <> 1
     or (select message from public.reports where question_id = current_setting('test.xq' || 1)::uuid) is not null
     or (select status from public.reports where question_id = current_setting('test.xq' || 1)::uuid) <> 'open' then
    raise exception 'FAIL X01: report yozilmadi yoki izoh/status noto''g''ri';
  end if;
  raise notice 'OK X01 report yuborildi (status open, bo''sh izoh null)';

  -- X02: shu savolga takror (boshqa sabab bilan ham) rad etiladi
  ok := false;
  begin
    insert into public.reports (question_id, reason) values (current_setting('test.xq' || 1)::uuid, 'wrong_answer');
  exception when unique_violation then
    ok := sqlerrm = 'report_duplicate';
  end;
  if not ok then raise exception 'FAIL X02: takror report o''tib ketdi'; end if;
  raise notice 'OK X02 takror report rad etildi (report_duplicate)';

  -- X03: qoralama savol va mavjud bo'lmagan savol rad etiladi
  ok := false;
  begin
    insert into public.reports (question_id, reason) values (current_setting('test.xq' || 12)::uuid, 'typo');
  exception when no_data_found then ok := sqlerrm = 'question_not_reportable';
  end;
  if not ok then raise exception 'FAIL X03: draft savolga report o''tdi'; end if;
  ok := false;
  begin
    insert into public.reports (question_id, reason) values (gen_random_uuid(), 'typo');
  exception when no_data_found then ok := sqlerrm = 'question_not_reportable';
  end;
  if not ok then raise exception 'FAIL X03: mavjud bo''lmagan savolga report o''tdi'; end if;
  raise notice 'OK X03 draft va mavjud bo''lmagan savolga report rad etildi';

  -- X04: boshqa foydalanuvchining sessiyasi bilan rad etiladi
  ok := false;
  begin
    insert into public.reports (question_id, session_id, reason) values (current_setting('test.xq' || 2)::uuid, '00000000-0000-4000-8000-0000000000d2', 'typo');
  exception when no_data_found then ok := sqlerrm = 'session_not_found';
  end;
  if not ok then raise exception 'FAIL X04: begona sessiya bilan report o''tdi'; end if;
  raise notice 'OK X04 begona session_id rad etildi';

  -- X05: tezlik cheklovi: 24 soatda 10 ta (1 ta bor, yana 9 ta o'tadi, 11-chisi rad)
  for i in 2..10 loop
    insert into public.reports (question_id, reason) values (current_setting('test.xq' || i)::uuid, 'other');
  end loop;
  ok := false;
  begin
    insert into public.reports (question_id, reason) values (current_setting('test.xq' || 11)::uuid, 'other');
  exception when raise_exception then ok := sqlerrm = 'report_rate_limited';
  end;
  if not ok then raise exception 'FAIL X05: 11-report o''tib ketdi'; end if;
  raise notice 'OK X05 tezlik cheklovi: 10 ta o''tdi, 11-chisi rad (report_rate_limited)';

  -- X06: foydalanuvchi status ni o'zgartira olmaydi va o'chira olmaydi
  ok := false;
  begin
    update public.reports set status = 'closed';
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FAIL X06: foydalanuvchi status ni o''zgartirdi'; end if;
  ok := false;
  begin
    delete from public.reports;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FAIL X06: foydalanuvchi report o''chirdi'; end if;
  ok := false;
  begin
    insert into public.reports (question_id, reason, status) values (current_setting('test.xq' || 11)::uuid, 'other', 'closed');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FAIL X06: foydalanuvchi status ni o''zi yozdi'; end if;
  raise notice 'OK X06 foydalanuvchi status ni yoza, o''zgartira, o''chira olmaydi';

  -- X07: feedback: 5 ta o'tadi, 6-chisi rad; bo'sh xabar rad
  ok := false;
  begin
    insert into public.feedback (message) values ('   ');
  exception when invalid_parameter_value then ok := sqlerrm = 'feedback_empty';
  end;
  if not ok then raise exception 'FAIL X07: bo''sh feedback o''tdi'; end if;
  for i in 1..5 loop
    insert into public.feedback (message, page) values ('SINOV fikr ' || i, '/Tayanch/uz/sat/');
  end loop;
  ok := false;
  begin
    insert into public.feedback (message) values ('SINOV fikr 6');
  exception when raise_exception then ok := sqlerrm = 'feedback_rate_limited';
  end;
  if not ok then raise exception 'FAIL X07: 6-feedback o''tib ketdi'; end if;
  raise notice 'OK X07 feedback: bo''sh rad, 5 ta o''tdi, 6-chisi rad (feedback_rate_limited)';
end
$$;

------------------------------------------------------------------------------
-- Foydalanuvchi 2: boshqa odamning xabari ko'rinmaydi
------------------------------------------------------------------------------
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e2", "role": "authenticated"}', true) \gset

do $$
begin
  if (select count(*) from public.reports) <> 0 or (select count(*) from public.feedback) <> 0 then
    raise exception 'FAIL X08: boshqa foydalanuvchining xabari ko''rindi';
  end if;
  -- Bir savolga turli foydalanuvchilar alohida xabar yubora oladi
  insert into public.reports (question_id, session_id, reason) values (current_setting('test.xq' || 1)::uuid, '00000000-0000-4000-8000-0000000000d2', 'wrong_answer');
  if (select count(*) from public.reports) <> 1 then
    raise exception 'FAIL X08: o''z xabari ko''rinmadi';
  end if;
  raise notice 'OK X08 RLS: foydalanuvchi faqat o''z xabarini ko''radi; boshqa foydalanuvchi shu savolga yubora oladi';
end
$$;

------------------------------------------------------------------------------
-- Anon: yoza ham, o'qiy ham olmaydi
------------------------------------------------------------------------------
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset

do $$
declare
  ok boolean := false;
begin
  begin
    insert into public.reports (question_id, reason) values (current_setting('test.xq' || 1)::uuid, 'typo');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FAIL X09: anon report yozdi'; end if;
  ok := false;
  begin
    perform 1 from public.feedback;
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FAIL X09: anon feedback o''qidi'; end if;
  ok := false;
  begin
    perform public.admin_unhide_question('xabar-sinov-1', 'sinov', 'sinov');
  exception when insufficient_privilege then ok := true;
  end;
  if not ok then raise exception 'FAIL X09: anon admin_unhide_question chaqirdi'; end if;
  raise notice 'OK X09 anon: report yoza, feedback o''qiy, admin funksiyani chaqira olmaydi';
end
$$;

------------------------------------------------------------------------------
-- Admin (service role): yopilgandan keyin qayta xabar, yashirish va qayta ochish
------------------------------------------------------------------------------
reset role;
select set_config('request.jwt.claims', '', true) \gset

do $$
declare
  ok boolean := false;
begin
  -- authenticated admin_unhide_question ni chaqira olmaydi
  if has_function_privilege('authenticated', 'public.admin_unhide_question(text,text,text)', 'execute') then
    raise exception 'FAIL X10: authenticated admin_unhide_question ga ega';
  end if;

  update public.reports set status = 'closed'
   where question_id = current_setting('test.xq' || 1)::uuid and user_id = '00000000-0000-4000-8000-0000000000e1';
  -- Yopilgach shu foydalanuvchi yana yubora oladi (limitdan tashqari holat uchun eski yozuvlar surib qo'yiladi)
  update public.reports set created_at = now() - interval '25 hours' where user_id = '00000000-0000-4000-8000-0000000000e1';
  set local role authenticated;
  perform set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e1", "role": "authenticated"}', true);
  insert into public.reports (question_id, reason) values (current_setting('test.xq' || 1)::uuid, 'unclear');
  reset role;
  perform set_config('request.jwt.claims', '', true);
  if (select count(*) from public.reports where question_id = current_setting('test.xq' || 1)::uuid and user_id = '00000000-0000-4000-8000-0000000000e1') <> 2 then
    raise exception 'FAIL X10: yopilgandan keyin qayta report yozilmadi';
  end if;
  raise notice 'OK X10 closed dan keyin qayta report; 24 soatdan eski yozuvlar limitga kirmaydi';

  perform public.admin_hide_question('xabar-sinov-1', 'SINOV xabar', 'sinov-admin');
  if (select status from public.questions where external_id = 'xabar-sinov-1') <> 'hidden' then
    raise exception 'FAIL X11: savol yashirilmadi';
  end if;
  perform public.admin_unhide_question('xabar-sinov-1', 'SINOV to''g''rilandi', 'sinov-admin');
  if (select status from public.questions where external_id = 'xabar-sinov-1') <> 'verified'
     or not exists (select 1 from public.audit_log where action = 'unhide_question' and actor = 'sinov-admin'
                     and details ->> 'external_id' = 'xabar-sinov-1') then
    raise exception 'FAIL X11: qayta ochilmadi yoki audit yo''q';
  end if;
  begin
    perform public.admin_unhide_question('xabar-sinov-2', 'sinov', 'sinov-admin');
  exception when invalid_parameter_value then ok := sqlerrm = 'question_not_hidden';
  end;
  if not ok then raise exception 'FAIL X11: yashirilmagan savol "ochildi"'; end if;
  raise notice 'OK X11 admin_hide_question -> admin_unhide_question, audit_log; yashirilmagan savol rad';
end
$$;

-- X12: docs/admin-qollanma.md dagi so'rovlar ishlaydi (2.1, 2.2, 2.4, 3, 4.6, 5)
do $$
declare n integer;
begin
  select count(*) into n from (
    select q.external_id, q.status, q.version,
           count(*) filter (where r.status = 'open') as ochiq,
           count(*) filter (where r.status = 'reviewed') as korilmoqda,
           count(distinct r.user_id) as foydalanuvchilar_soni,
           count(*) filter (where r.reason = 'wrong_answer') as wrong_answer,
           max(r.created_at) as oxirgi_xabar
      from public.reports r join public.questions q on q.id = r.question_id
     where r.status in ('open', 'reviewed')
     group by q.external_id, q.status, q.version
     order by foydalanuvchilar_soni desc, oxirgi_xabar desc) t;
  if n < 1 then raise exception 'FAIL X12: 2.1 so''rovi bo''sh'; end if;
  perform r.id, q.external_id, r.reason, r.message, r.created_at
    from public.reports r join public.questions q on q.id = r.question_id where r.status = 'open';
  perform f.created_at, f.page, f.message from public.feedback f order by f.created_at desc limit 50;
  perform date_trunc('day', created_at at time zone 'Asia/Tashkent'), count(*) from public.feedback group by 1;
  update public.reports set status = 'reviewed' where id = (select id from public.reports where status = 'open' limit 1);
  update public.reports set status = 'closed'
   where question_id = (select id from public.questions where external_id = 'xabar-sinov-1') and status in ('open', 'reviewed');
  if exists (select 1 from public.reports r join public.questions q on q.id = r.question_id
              where q.external_id = 'xabar-sinov-1' and r.status <> 'closed') then
    raise exception 'FAIL X12: 4.6 yopish so''rovi ishlamadi';
  end if;
  update public.reports set message = null where id = (select id from public.reports limit 1);
  raise notice 'OK X12 admin qo''llanma so''rovlari ishlaydi';
end
$$;

rollback;
