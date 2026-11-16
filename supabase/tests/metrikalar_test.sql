-- P25 metrikalar sinovlari (20261112143717_metrikalar): hodisa yozish, xossa tekshiruvi, ulashishni o'chirish,
-- tezlik cheklovi, mijoz huquqlari. Bitta tranzaksiya, oxirida ROLLBACK.
-- docs/metrikalar.sql so'rovlari alohida (scripts/rls-tekshir.sh, sun'iy ma'lumot bilan) tekshiriladi.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, figure, status, author, verified_by, verified_at)
values
  ('mt-rw-1', 'rw', 'MT-domain', 'MT-skill', 2, 'mcq', 'SINOV savol',
   '[{"key": "A", "text": "SINOV 1"}, {"key": "B", "text": "SINOV 2"}]',
   '{"choice": "B"}', 'SINOV izoh', null, 'verified', 'sinov', 'sinov2', now());

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000e1', 'm1@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000e2', 'm2@sinov.invalid', '{}');

-- M01: signup profil yaratilganda, xossasiz, page null; ulashish standart holatda yoqiq
do $$
declare u1 constant uuid := '00000000-0000-4000-8000-0000000000e1'; n integer;
begin
  select count(*) into n from public.events where user_id = u1 and name = 'signup' and props = '{}' and page is null;
  if n <> 1 then raise exception 'FAIL M01: signup hodisasi % ta', n; end if;
  if not (select usage_analytics from public.profiles where id = u1) then
    raise exception 'FAIL M01: usage_analytics standart holatda yoqiq emas';
  end if;
  raise notice 'OK M01 signup: profil yaratilganda bitta hodisa, xossasiz; ulashish standart holatda yoqiq';
end $$;

-- M02, M03, M04: sessiya va kun savoli trigger'lari
do $$
declare
  u1 constant uuid := '00000000-0000-4000-8000-0000000000e1';
  s1 uuid; s2 uuid; sd uuid; q uuid; n integer;
begin
  insert into public.practice_sessions (user_id, mode, question_count) values (u1, 'practice', 10) returning id into s1;
  insert into public.practice_sessions (user_id, mode, question_count) values (u1, 'timed', 5) returning id into s2;
  insert into public.practice_sessions (user_id, mode, daily_date) values (u1, 'daily', private.today_tashkent()) returning id into sd;

  select count(*) into n from public.events where user_id = u1 and name = 'first_session'
     and props = '{"mode": "practice", "question_count": 10}';
  if n <> 1 or (select count(*) from public.events where user_id = u1 and name = 'first_session') <> 1 then
    raise exception 'FAIL M02: first_session bitta va birinchi sessiyadan bo''lishi kerak';
  end if;
  raise notice 'OK M02 first_session: faqat birinchi daily bo''lmagan sessiyada, mode va question_count bilan';

  update public.practice_sessions set finished_at = now() where id = s1;
  update public.practice_sessions set finished_at = now() + interval '1 minute' where id = s1;  -- qayta: yangi hodisa yo'q
  update public.practice_sessions set finished_at = now() where id = sd;                          -- daily: hodisa yo'q
  select count(*) into n from public.events where user_id = u1 and name = 'session_completed';
  if n <> 1 then raise exception 'FAIL M03: session_completed % ta (kutilgan 1)', n; end if;
  raise notice 'OK M03 session_completed: tugaganda bir marta, daily sessiya hisobga kirmaydi';

  select id into q from public.questions where external_id = 'mt-rw-1';
  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version)
  values (u1, sd, q, 'B', true, 1), (u1, s2, q, 'A', false, 1);
  select count(*) into n from public.events where user_id = u1 and name = 'daily_question_answered'
     and props = '{"section": "rw", "is_correct": true}';
  if n <> 1 or (select count(*) from public.events where user_id = u1 and name = 'daily_question_answered') <> 1 then
    raise exception 'FAIL M04: daily_question_answered faqat kun savolida bo''lishi kerak';
  end if;
  if exists (select 1 from public.events e, jsonb_each(e.props) kv
              where e.user_id = u1 and (kv.value #>> '{}') in ('B', 'A', 'SINOV savol', 'm1@sinov.invalid')) then
    raise exception 'FAIL M04: xossada javob, savol matni yoki email bor';
  end if;
  raise notice 'OK M04 daily_question_answered: faqat daily sessiyada, section va is_correct; javob va matn yo''q';
end $$;

-- M05: to'lov hodisalari payments yozuvidan
do $$
declare u2 constant uuid := '00000000-0000-4000-8000-0000000000e2'; p uuid; n integer;
begin
  insert into public.payments (user_id, plan_code, provider_order_id, amount_uzs, raw)
  values (u2, 'pro', 'mt-order-1', 59000, '{"inpay": {"livemode": true}}') returning id into p;
  update public.payments set status = 'pending' where id = p;
  update public.payments set status = 'paid', paid_at = now() where id = p;
  update public.payments set status = 'paid' where id = p;   -- takror: yangi hodisa yo'q
  if (select count(*) from public.events where user_id = u2 and name = 'payment_started'
        and props = '{"plan_code": "pro", "amount_uzs": 59000}') <> 1 then
    raise exception 'FAIL M05: payment_started';
  end if;
  if (select count(*) from public.events where user_id = u2 and name = 'payment_success'
        and props = '{"plan_code": "pro", "amount_uzs": 59000, "livemode": true}') <> 1 then
    raise exception 'FAIL M05: payment_success';
  end if;
  raise notice 'OK M05 to''lov: payment_started (yaratilganda), payment_success (paid, bir marta, livemode bilan)';
end $$;

-- M06: ulashishni o'chirish (mijoz sifatida), keyin faqat to'lov hodisalari
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e2", "role": "authenticated"}', true) \gset
do $$
begin
  if not public.track_event('plan_viewed') then raise exception 'FAIL M06: plan_viewed yozilmadi'; end if;
  update public.profiles set usage_analytics = false where id = auth.uid();
  if public.track_event('plan_viewed') then raise exception 'FAIL M06: o''chirilganda yozildi'; end if;
end $$;
reset role;
do $$
declare u2 constant uuid := '00000000-0000-4000-8000-0000000000e2'; p uuid;
begin
  if exists (select 1 from public.events where user_id = u2 and name not in ('payment_started', 'payment_success')) then
    raise exception 'FAIL M06: o''chirilgandan keyin to''lovdan boshqa hodisa qoldi';
  end if;
  if (select count(*) from public.events where user_id = u2) <> 2 then
    raise exception 'FAIL M06: to''lov hodisalari o''chib ketdi';
  end if;
  insert into public.practice_sessions (user_id, mode, question_count) values (u2, 'practice', 3) returning id into p;
  update public.practice_sessions set finished_at = now() where id = p;
  insert into public.payments (user_id, plan_code, provider_order_id, amount_uzs) values (u2, 'pro', 'mt-order-2', 59000);
  if exists (select 1 from public.events where user_id = u2 and name in ('first_session', 'session_completed')) then
    raise exception 'FAIL M06: o''chirilganda sessiya hodisasi yozildi';
  end if;
  if (select count(*) from public.events where user_id = u2 and name = 'payment_started') <> 2 then
    raise exception 'FAIL M06: o''chirilganda payment_started yozilmadi';
  end if;
  raise notice 'OK M06 o''chirish: oldingi to''lovsiz hodisalar o''chdi, yangilari yozilmaydi, to''lov hodisalari qoladi';
end $$;

-- M07: xossa va nom tekshiruvi
do $$
declare u1 constant uuid := '00000000-0000-4000-8000-0000000000e1';
begin
  begin
    perform private.track(u1, 'page_view', '{}');
    raise exception 'FAIL M07: noma''lum hodisa yozildi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform private.track(u1, 'first_session', '{"email": "a@b.c"}');
    raise exception 'FAIL M07: ruxsatsiz kalit yozildi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform private.track(u1, 'first_session', '{"mode": "Savol matni: 2x + 3 = 7"}');
    raise exception 'FAIL M07: erkin matn yozildi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform private.track(u1, 'first_session', '{"mode": {"ichki": 1}}');
    raise exception 'FAIL M07: ichma-ich obyekt yozildi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform private.track(u1, 'daily_question_answered', '{"section": "a@b.c"}');
    raise exception 'FAIL M07: email ko''rinishidagi qiymat yozildi';
  exception when invalid_parameter_value then null;
  end;
  raise notice 'OK M07 tekshiruv: noma''lum nom, ruxsatsiz kalit, erkin matn, obyekt, email rad etiladi';
end $$;

-- M08: tezlik cheklovi
do $$
declare u1 constant uuid := '00000000-0000-4000-8000-0000000000e1'; i integer; ok integer := 0;
begin
  delete from public.events where user_id = u1;
  for i in 1..70 loop
    if private.track(u1, 'session_completed', '{"mode": "practice", "question_count": 1}') then ok := ok + 1; end if;
  end loop;
  if ok <> 60 then raise exception 'FAIL M08: soatiga % ta yozildi (kutilgan 60)', ok; end if;
  if not private.track(u1, 'payment_started', '{"plan_code": "pro", "amount_uzs": 1}') then
    raise exception 'FAIL M08: to''lov hodisasi chegarada to''xtadi';
  end if;
  update public.events set created_at = now() - interval '2 hours' where user_id = u1;
  if not private.track(u1, 'plan_viewed') then raise exception 'FAIL M08: plan_viewed 1'; end if;
  if private.track(u1, 'plan_viewed') then raise exception 'FAIL M08: plan_viewed 10 daqiqada ikki marta'; end if;
  raise notice 'OK M08 chegara: soatiga 60 ta, ortig''i tashlanadi; to''lov hodisasi cheklanmaydi; plan_viewed 10 daqiqada 1';
end $$;

-- M09: mijoz huquqlari
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000e1", "role": "authenticated"}', true) \gset
do $$
begin
  begin
    perform public.track_event('signup');
    raise exception 'FAIL M09: mijoz signup yubordi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.track_event('payment_success', '{"plan_code": "pro", "amount_uzs": 1}');
    raise exception 'FAIL M09: mijoz payment_success yubordi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.events (name, props) values ('plan_viewed', '{}');
    raise exception 'FAIL M09: mijoz events ga to''g''ridan-to''g''ri yozdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.events limit 1;
    raise exception 'FAIL M09: mijoz events ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.profiles set usage_analytics = false where id = '00000000-0000-4000-8000-0000000000e2';
    if (select usage_analytics from public.profiles where id = auth.uid()) is distinct from true then
      raise exception 'FAIL M09: o''z profili o''zgardi';
    end if;
  end;
  raise notice 'OK M09 mijoz: faqat plan_viewed, events o''qilmaydi va to''g''ridan-to''g''ri yozilmaydi';
end $$;
reset role;

set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.track_event('plan_viewed');
    raise exception 'FAIL M10: anon track_event chaqirdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK M10 anon: track_event yopiq (hisobsiz hech narsa yozilmaydi)';
end $$;
reset role;

-- M11: trigger ichidagi xato asosiy amalni to'xtatmaydi
do $$
declare u1 constant uuid := '00000000-0000-4000-8000-0000000000e1'; p uuid;
begin
  -- Ruxsatsiz xossa: private.track xato beradi, track_safe uni warning'ga aylantiradi.
  perform private.track_safe(u1, 'first_session', '{"email": "x"}');
  insert into public.payments (user_id, plan_code, provider_order_id, amount_uzs) values (u1, 'pro', 'mt-order-3', 59000)
  returning id into p;
  if p is null then raise exception 'FAIL M11'; end if;
  raise notice 'OK M11 track_safe: xato warning bilan o''tadi, asosiy amal davom etadi';
end $$;

\echo '  NOTICE:  METRIKALAR SINOVLARI O''TDI'
rollback;
