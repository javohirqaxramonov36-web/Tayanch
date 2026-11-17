-- P32 reyting sinovlari (20261112184613_reyting): XP qoidalari, aldovdan himoya, opt-in/opt-out, laqab moderatsiyasi,
-- 18 yoshgacha cheklov, RLS. sessiya_test.sql kabi: bitta tranzaksiya, oxirida ROLLBACK. Savollar "SINOV" soxta yozuvlar.
\set ON_ERROR_STOP on
\set QUIET on

begin;

-- A, B: kattalar; C: 18 yoshgacha; D: yosh guruhi yo'q (eski hisob)
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000003a1', 'ra@sinov.invalid', '{"age_group": "adult"}'),
  ('00000000-0000-4000-8000-0000000003b1', 'rb@sinov.invalid', '{"age_group": "adult"}'),
  ('00000000-0000-4000-8000-0000000003c1', 'rc@sinov.invalid', '{"age_group": "minor", "guardian_name": "SINOV"}'),
  ('00000000-0000-4000-8000-0000000003d1', 'rd@sinov.invalid', '{}');

insert into public.profiles (id)
select u.id from auth.users u where u.email like 'r_@sinov.invalid'
on conflict (id) do nothing;

insert into public.questions
  (external_id, section, domain, skill, difficulty, format, stem, options, correct, explanation, figure, status, author, verified_by)
select 'rt-' || g, 'math', 'RT-domain', 'RT-skill', 2, 'mcq', 'SINOV reyting ' || g,
       '[{"key": "A", "text": "SINOV a"}, {"key": "B", "text": "SINOV b"}]', '{"choice": "B"}', 'SINOV izoh', null,
       'draft', 'sinov', null
  from generate_series(1, 6) g;

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'questions' and column_name = 'verified_at') then
    execute 'update public.questions set status = ''verified'', verified_by = ''sinov2'', verified_at = now() where external_id like ''rt-%''';
  else
    update public.questions set status = 'verified', verified_by = 'sinov2' where external_id like 'rt-%';
  end if;
end
$$;

-- Sessiyalar postgres sifatida (private.create_session); javoblar foydalanuvchi sifatida submit_answer orqali.
select
  set_config('rt.q1', (select id::text from public.questions where external_id = 'rt-1'), true),
  set_config('rt.q2', (select id::text from public.questions where external_id = 'rt-2'), true),
  set_config('rt.q3', (select id::text from public.questions where external_id = 'rt-3'), true),
  set_config('rt.q4', (select id::text from public.questions where external_id = 'rt-4'), true),
  set_config('rt.q5', (select id::text from public.questions where external_id = 'rt-5'), true),
  set_config('rt.q6', (select id::text from public.questions where external_id = 'rt-6'), true)
\gset

select
  set_config('rt.a_s1', private.create_session('00000000-0000-4000-8000-0000000003a1', 'practice', '{}',
    array[current_setting('rt.q1')::uuid, current_setting('rt.q2')::uuid, current_setting('rt.q3')::uuid])::text, true),
  set_config('rt.a_s2', private.create_session('00000000-0000-4000-8000-0000000003a1', 'timed', '{}',
    array[current_setting('rt.q1')::uuid, current_setting('rt.q2')::uuid])::text, true),
  set_config('rt.a_daily', private.create_session('00000000-0000-4000-8000-0000000003a1', 'daily', '{}',
    array[current_setting('rt.q4')::uuid], private.today_tashkent())::text, true),
  set_config('rt.b_s1', private.create_session('00000000-0000-4000-8000-0000000003b1', 'practice', '{}',
    array[current_setting('rt.q1')::uuid, current_setting('rt.q5')::uuid])::text, true),
  set_config('rt.c_s1', private.create_session('00000000-0000-4000-8000-0000000003c1', 'practice', '{}',
    array[current_setting('rt.q1')::uuid])::text, true)
\gset

insert into public.review_queue (user_id, question_id, box, next_due)
values ('00000000-0000-4000-8000-0000000003a1', current_setting('rt.q3')::uuid, 1, private.today_tashkent());

select
  set_config('rt.a_r1', private.create_session('00000000-0000-4000-8000-0000000003a1', 'review', '{}',
    array[current_setting('rt.q3')::uuid])::text, true),
  set_config('rt.a_r2', private.create_session('00000000-0000-4000-8000-0000000003a1', 'review', '{}',
    array[current_setting('rt.q3')::uuid])::text, true)
\gset

------------------------------------------------------------------------------
-- Mehmon (anon): hech narsa yo'q
------------------------------------------------------------------------------
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.leaderboard('week', 'all');
    raise exception 'FAIL R01: anon leaderboard() ni chaqira oldi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.leaderboard_me();
    raise exception 'FAIL R01: anon leaderboard_me() ni chaqira oldi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.xp_events;
    raise exception 'FAIL R01: anon xp_events ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK R01 anon: reyting RPC va xp_events yopiq';
end
$$;
reset role;

------------------------------------------------------------------------------
-- A: XP qoidalari
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000003a1", "role": "authenticated"}', true) \gset

do $$
declare
  s1 uuid := current_setting('rt.a_s1')::uuid;
  s2 uuid := current_setting('rt.a_s2')::uuid;
  q1 uuid := current_setting('rt.q1')::uuid;
  q2 uuid := current_setting('rt.q2')::uuid;
  q3 uuid := current_setting('rt.q3')::uuid;
  jami integer;
begin
  -- q1 to'g'ri, 4 s: javob 2 + to'g'ri 3
  perform public.submit_answer(s1, q1, 'B', 4000);
  select sum(xp) into jami from public.xp_events;
  if jami <> 5 then raise exception 'FAIL R02: q1 dan 5 XP kutilgan, keldi %', jami; end if;
  -- takror yuborish: yangi XP yo'q
  perform public.submit_answer(s1, q1, 'B', 4000);
  if (select sum(xp) from public.xp_events) <> 5 then raise exception 'FAIL R02: takror yuborish XP berdi'; end if;
  raise notice 'OK R02 XP: birinchi to''g''ri javob 2+3, takror yuborish XP bermaydi';

  -- q2 to'g'ri, lekin 1 s: XP yo'q (juda tez)
  perform public.submit_answer(s1, q2, 'B', 1000);
  -- q3 xato, 5 s: faqat javob 2
  perform public.submit_answer(s1, q3, 'A', 5000);
  if (select sum(xp) from public.xp_events) <> 7 then
    raise exception 'FAIL R03: tez javob 0, xato javob 2 kutilgan; jami %', (select sum(xp) from public.xp_events);
  end if;
  raise notice 'OK R03 XP: 3 soniyadan tez javob XP bermaydi, xato javob faqat 2';

  -- Boshqa sessiyada q1 yana: yangi XP yo'q. q2 endi 5 s, to'g'ri: javob 2, lekin "birinchi urinish" emas → to'g'ri bonus yo'q
  perform public.submit_answer(s2, q1, 'B', 5000);
  perform public.submit_answer(s2, q2, 'B', 5000);
  if (select sum(xp) from public.xp_events) <> 9 then
    raise exception 'FAIL R04: qayta yechish: jami 9 kutilgan, keldi %', (select sum(xp) from public.xp_events);
  end if;
  raise notice 'OK R04 XP: bir savolni qayta yechish yangi XP bermaydi, to''g''ri bonus faqat birinchi urinishda';
end
$$;

-- Takrorlash va kun savoli
do $$
declare
  r1 uuid := current_setting('rt.a_r1')::uuid;
  r2 uuid := current_setting('rt.a_r2')::uuid;
  d  uuid := current_setting('rt.a_daily')::uuid;
  q3 uuid := current_setting('rt.q3')::uuid;
  q4 uuid := current_setting('rt.q4')::uuid;
  m  jsonb;
begin
  perform public.submit_answer(r1, q3, 'B', 4000);
  perform public.submit_answer(r2, q3, 'B', 4000);   -- shu kuni ikkinchi marta: XP yo'q
  if (select sum(xp) from public.xp_events where kind = 'review') <> 4 then
    raise exception 'FAIL R05: takrorlash XP 4 (kuniga bir marta) kutilgan';
  end if;
  raise notice 'OK R05 XP: takrorlashda to''g''ri javob 4, bir savolga kuniga bir marta';

  perform public.submit_answer(d, q4, 'B');           -- kun savoli mijozdan time_ms siz keladi
  if (select sum(xp) from public.xp_events where kind in ('daily', 'daily_correct')) <> 10 then
    raise exception 'FAIL R06: kun savoli 5+5 kutilgan';
  end if;
  m := public.leaderboard_me();
  if (m -> 'xp' ->> 'today')::integer <> 23 or (m -> 'xp' ->> 'week')::integer <> 23
     or (m ->> 'eligible')::boolean is not true or (m ->> 'joined')::boolean then
    raise exception 'FAIL R06: leaderboard_me noto''g''ri: %', m;
  end if;
  raise notice 'OK R06 XP: kun savoli 5+5; leaderboard_me: bugun 23, qatnashmaydi (standart opt-in o''chiq)';

  begin
    insert into public.xp_events (user_id, kind, ref, xp, day)
    values ('00000000-0000-4000-8000-0000000003a1', 'answer', 'soxta', 50, private.today_tashkent());
    raise exception 'FAIL R07: mijoz xp_events ga yozdi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.leaderboard_members (user_id) values ('00000000-0000-4000-8000-0000000003a1');
    raise exception 'FAIL R07: mijoz leaderboard_members ga to''g''ridan-to''g''ri yozdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK R07 RLS: mijoz xp_events va leaderboard_members ga yoza olmaydi';
end
$$;

-- Laqab moderatsiyasi va qo'shilish
do $$
declare
  m jsonb;
  n text;
begin
  foreach n in array array['F_u_c_k1', 'xAdmin', 'sh1t_x', 'B1yat99', 'jalab_7', 'T4yanch'] loop
    begin
      perform public.leaderboard_join(n, null, false);
      raise exception 'FAIL R08: taqiqlangan laqab qabul qilindi: %', n;
    exception when invalid_parameter_value then
      if sqlerrm <> 'nickname_not_allowed' then raise exception 'FAIL R08: % uchun xato %', n, sqlerrm; end if;
    end;
  end loop;
  foreach n in array array['ab', 'Ad.min', 'with space', 'aaaaaaaaaaaaaaaaaaaaa'] loop
    begin
      perform public.leaderboard_join(n, null, false);
      raise exception 'FAIL R08: noto''g''ri shakldagi laqab qabul qilindi: %', n;
    exception when invalid_parameter_value then
      if sqlerrm <> 'nickname_invalid' then raise exception 'FAIL R08: % uchun xato %', n, sqlerrm; end if;
    end;
  end loop;
  begin
    update public.profiles set nickname = 'sh1t_x' where id = '00000000-0000-4000-8000-0000000003a1';
    raise exception 'FAIL R08: profil orqali taqiqlangan laqab yozildi';
  exception when invalid_parameter_value then null;
  end;
  if public.leaderboard_join('Sat_Fan', 'u1', false) is not null then
    raise exception 'FAIL R08: country_invalid kutilgan';
  end if;
exception when invalid_parameter_value then
  if sqlerrm <> 'country_invalid' then raise; end if;
  raise notice 'OK R08 moderatsiya: 6 taqiqlangan laqab (leet, _ bilan), 4 noto''g''ri shakl, profil triggeri, noto''g''ri mamlakat rad etildi';
end
$$;

do $$
declare
  m jsonb;
begin
  m := public.leaderboard_join('Aziz_01', 'uz', true);
  if (m ->> 'joined')::boolean is not true or m ->> 'country' <> 'UZ' or (m ->> 'show_country')::boolean is not true then
    raise exception 'FAIL R09: qo''shilish holati noto''g''ri: %', m;
  end if;
  raise notice 'OK R09 opt-in: Aziz_01 qo''shildi, mamlakat UZ ko''rsatiladi';
end
$$;
reset role;

------------------------------------------------------------------------------
-- B: boshqa foydalanuvchi ma'lumotini ko'rmaydi
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000003b1", "role": "authenticated"}', true) \gset

do $$
declare
  r jsonb;
begin
  if exists (select 1 from public.xp_events) or exists (select 1 from public.leaderboard_members)
     or exists (select 1 from public.profiles where id <> '00000000-0000-4000-8000-0000000003b1') then
    raise exception 'FAIL R10: B boshqa foydalanuvchi XP, a''zolik yoki profilini o''qidi';
  end if;

  -- Qatnashmasa ham ko'radi (kattalar), lekin o'zi jadvalda yo'q
  r := public.leaderboard('week', 'all');
  if jsonb_array_length(r -> 'rows') <> 1 or r -> 'rows' -> 0 ->> 'nickname' <> 'Aziz_01'
     or (r -> 'rows' -> 0 ->> 'xp')::integer <> 23 or r -> 'rows' -> 0 ->> 'country' <> 'UZ'
     or (r -> 'rows' -> 0 ->> 'me')::boolean then
    raise exception 'FAIL R10: jadval noto''g''ri: %', r;
  end if;
  if position('00000000-0000-4000-8000-0000000003a1' in r::text) > 0 or position('ra@sinov' in r::text) > 0
     or r -> 'rows' -> 0 ? 'user_id' or r -> 'rows' -> 0 ? 'display_name' then
    raise exception 'FAIL R10: jadvalda user_id, email yoki ism bor: %', r;
  end if;
  raise notice 'OK R10 RLS: B faqat o''zini o''qiydi; jadvalda faqat laqab, mamlakat, XP (user_id/email/ism yo''q)';

  begin
    perform public.leaderboard_join('aziz_01', null, false);
    raise exception 'FAIL R11: band laqab (katta-kichik harf farqi bilan) qabul qilindi';
  exception when unique_violation then
    if sqlerrm <> 'nickname_taken' then raise; end if;
  end;
  perform public.leaderboard_join('Bek', null, true);   -- mamlakatsiz: show_country false bo'lib qoladi
  begin
    perform public.leaderboard('week', 'country');
    raise exception 'FAIL R11: mamlakatsiz foydalanuvchi country jadvalini oldi';
  exception when invalid_parameter_value then
    if sqlerrm <> 'no_country' then raise; end if;
  end;
  raise notice 'OK R11: band laqab rad etildi; mamlakatsiz a''zo "country" jadvalini ololmaydi';

  perform public.submit_answer(current_setting('rt.b_s1')::uuid, current_setting('rt.q1')::uuid, 'B', 6000);
  r := public.leaderboard('week', 'all');
  if jsonb_array_length(r -> 'rows') <> 2 or r -> 'rows' -> 1 ->> 'nickname' <> 'Bek'
     or (r -> 'rows' -> 1 ->> 'me')::boolean is not true or r -> 'rows' -> 1 -> 'country' <> 'null'::jsonb
     or (r -> 'rows' -> 1 ->> 'rank')::integer <> 2 then
    raise exception 'FAIL R12: B qo''shilgandan keyingi jadval noto''g''ri: %', r;
  end if;
  raise notice 'OK R12: Bek 2-o''rinda, "me" belgisi faqat o''zida, mamlakat ko''rsatilmaydi';
end
$$;
reset role;

-- Kunlik chegara: B bugun 298 XP (postgres sifatida soxta yozuvlar), keyin q5 to'g'ri → faqat 2 (300 gacha), bonus yozilmaydi
insert into public.xp_events (user_id, kind, ref, xp, day)
select '00000000-0000-4000-8000-0000000003b1', 'answer', 'sinov-chegara-' || g, case when g < 6 then 50 else 43 end, private.today_tashkent()
  from generate_series(1, 6) g;   -- 5×50 + 43 = 293; B da avval 5 bor → 298

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000003b1", "role": "authenticated"}', true) \gset
do $$
declare
  m jsonb;
begin
  perform public.submit_answer(current_setting('rt.b_s1')::uuid, current_setting('rt.q5')::uuid, 'B', 6000);
  m := public.leaderboard_me();
  if (m -> 'xp' ->> 'today')::integer <> 300 then
    raise exception 'FAIL R13: kunlik chegara 300 kutilgan, keldi %', m -> 'xp' ->> 'today';
  end if;
  if exists (select 1 from public.xp_events where kind = 'correct' and ref = current_setting('rt.q5')) then
    raise exception 'FAIL R13: chegara to''lganda bonus yozildi (kalit band bo''ldi)';
  end if;
  raise notice 'OK R13 chegara: kuniga 300 XP, ortig''i kesiladi, to''lgan bo''lsa yozuv qo''shilmaydi';
end
$$;
reset role;

------------------------------------------------------------------------------
-- C (18 yoshgacha) va D (yosh guruhi yo'q): faqat o'z XP'si
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000003c1", "role": "authenticated"}', true) \gset
do $$
declare
  m jsonb;
begin
  perform public.submit_answer(current_setting('rt.c_s1')::uuid, current_setting('rt.q1')::uuid, 'B', 4000);
  m := public.leaderboard_me();
  if (m ->> 'eligible')::boolean or (m -> 'xp' ->> 'today')::integer <> 5 then
    raise exception 'FAIL R14: minor uchun leaderboard_me noto''g''ri: %', m;
  end if;
  begin
    perform public.leaderboard_join('Kichik_1', null, false);
    raise exception 'FAIL R14: 18 yoshgacha foydalanuvchi qo''shildi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.leaderboard('week', 'all');
    raise exception 'FAIL R14: 18 yoshgacha foydalanuvchi jadvalni ko''rdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK R14 18 yoshgacha: o''z XP''si (5) ko''rinadi; qo''shilish va jadval yopiq';
end
$$;
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000003d1", "role": "authenticated"}', true) \gset
do $$
begin
  begin
    perform public.leaderboard_join('Eski_1', null, false);
    raise exception 'FAIL R15: yosh guruhi yo''q hisob qo''shildi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK R15: yosh guruhi yo''q hisob reytingga qo''shilmaydi';
end
$$;
reset role;

-- Moderator yashirishi (postgres) va mamlakat jadvali
update public.leaderboard_members set hidden_at = now(), hidden_reason = 'SINOV'
 where user_id = '00000000-0000-4000-8000-0000000003b1';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000003a1", "role": "authenticated"}', true) \gset
do $$
declare
  r jsonb;
begin
  r := public.leaderboard('month', 'all');
  if jsonb_array_length(r -> 'rows') <> 1 or r -> 'rows' -> 0 ->> 'nickname' <> 'Aziz_01'
     or (r -> 'rows' -> 0 ->> 'me')::boolean is not true then
    raise exception 'FAIL R16: yashirilgan a''zo jadvalda: %', r;
  end if;
  r := public.leaderboard('week', 'country');
  if r ->> 'country' <> 'UZ' or jsonb_array_length(r -> 'rows') <> 1 then
    raise exception 'FAIL R16: country jadvali noto''g''ri: %', r;
  end if;
  raise notice 'OK R16: moderator yashirgan laqab ko''rinmaydi; oylik va mamlakat jadvali ishlaydi';

  -- Opt-out: darhol yo'qoladi, XP o'zida qoladi
  r := public.leaderboard_leave();
  if (r ->> 'joined')::boolean or (r -> 'xp' ->> 'week')::integer <> 23 then
    raise exception 'FAIL R17: leave holati noto''g''ri: %', r;
  end if;
  if jsonb_array_length(public.leaderboard('week', 'all') -> 'rows') <> 0 then
    raise exception 'FAIL R17: chiqqandan keyin jadvalda qoldi';
  end if;
  raise notice 'OK R17 opt-out: jadvaldan darhol yo''qoladi, o''z XP''si (23) saqlanadi';
end
$$;
reset role;

-- Hisob o'chirilsa XP va a'zolik ham o'chadi
delete from auth.users where id = '00000000-0000-4000-8000-0000000003b1';
do $$
begin
  if exists (select 1 from public.xp_events where user_id = '00000000-0000-4000-8000-0000000003b1')
     or exists (select 1 from public.leaderboard_members where user_id = '00000000-0000-4000-8000-0000000003b1') then
    raise exception 'FAIL R18: o''chirilgan hisob XP yoki a''zoligi qoldi';
  end if;
  raise notice 'OK R18: hisob o''chirilganda XP va a''zolik ham o''chadi';
end
$$;

rollback;
