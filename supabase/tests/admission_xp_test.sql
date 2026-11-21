-- Admission D-seriya Q5 sinovlari (20261120120000_admission_xp): Ariza zinapoyasi XP'si.
-- reyting_test.sql kabi: bitta tranzaksiya, oxirida ROLLBACK. Foydalanuvchilar "sinov.invalid" soxta yozuvlar.
-- Lokal: npm run db:tekshir (scripts/rls-tekshir.sh). Jonli bazada ishga tushirilmaydi.
\set ON_ERROR_STOP on
\set QUIET on

begin;

-- A, B: kattalar
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000005a1', 'axa@sinov.invalid', '{"age_group": "adult"}'),
  ('00000000-0000-4000-8000-0000000005b1', 'axb@sinov.invalid', '{"age_group": "adult"}');

insert into public.profiles (id)
select u.id from auth.users u where u.email like 'ax_@sinov.invalid'
on conflict (id) do nothing;

-- SAT qoidalari o'zgarmagan, yangi qiymat 10
do $$
begin
  if private.xp_rule('answer') <> 2 or private.xp_rule('correct') <> 3 or private.xp_rule('review') <> 4
     or private.xp_rule('daily') <> 5 or private.xp_rule('daily_correct') <> 5 or private.xp_rule('daily_cap') <> 300
     or private.xp_rule('min_time_ms') <> 3000 then
    raise exception 'FAIL AX00: SAT XP qoidalari o''zgargan';
  end if;
  if private.xp_rule('admission_step') <> 10 then
    raise exception 'FAIL AX00: admission_step = %', private.xp_rule('admission_step');
  end if;
  raise notice 'OK AX00: xp_rule SAT qiymatlari o''zgarmagan, admission_step = 10';
end
$$;

------------------------------------------------------------------------------
-- Mehmon (anon): chaqira olmaydi
------------------------------------------------------------------------------
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.admission_step_done('zinapoya:ucas');
    raise exception 'FAIL AX01: anon admission_step_done ni chaqira oldi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK AX01 anon: admission_step_done yopiq';
end
$$;
reset role;

-- authenticated roli, lekin sub yo'q (auth.uid() null)
set local role authenticated;
select set_config('request.jwt.claims', '{"role": "authenticated"}', true) \gset
do $$
begin
  begin
    perform public.admission_step_done('zinapoya:ucas');
    raise exception 'FAIL AX02: uid siz chaqiruv o''tdi';
  exception when sqlstate '28000' then null;
  end;
  raise notice 'OK AX02: uid siz chaqiruv not_authenticated';
end
$$;
reset role;

------------------------------------------------------------------------------
-- A: bir martalik
------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000005a1", "role": "authenticated"}', true) \gset
do $$
declare
  v integer;
  n integer;
begin
  v := public.admission_step_done('zinapoya:commonapp');
  if v <> 10 then raise exception 'FAIL AX03: birinchi chaqiruv % (kutilgan 10)', v; end if;
  v := public.admission_step_done('zinapoya:commonapp');
  if v <> 0 then raise exception 'FAIL AX03: ikkinchi chaqiruv % (kutilgan 0)', v; end if;
  v := public.admission_step_done('zinapoya:commonapp');
  if v <> 0 then raise exception 'FAIL AX03: uchinchi chaqiruv % (kutilgan 0)', v; end if;
  select count(*) into n from public.xp_events where kind = 'admission_step' and ref = 'zinapoya:commonapp';
  if n <> 1 then raise exception 'FAIL AX03: xp_events da % qator (kutilgan 1)', n; end if;
  raise notice 'OK AX03: birinchi chaqiruv 10 XP, takroriy 0, xp_events da bitta qator';

  if public.admission_step_done('zinapoya:turkiye') <> 10 or public.admission_step_done('zinapoya:ucas') <> 10 then
    raise exception 'FAIL AX04: boshqa zinapoyalar 10 XP bermadi';
  end if;
  select coalesce(sum(xp), 0) into n from public.xp_events where kind = 'admission_step';
  if n <> 30 then raise exception 'FAIL AX04: jami % (kutilgan 30)', n; end if;
  raise notice 'OK AX04: uchala zinapoya, jami 30 XP (umrbod maksimum)';

  begin
    perform public.admission_step_done('zinapoya:boshqa');
    raise exception 'FAIL AX05: noto''g''ri qadam qabul qilindi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.admission_step_done(null);
    raise exception 'FAIL AX05: null qadam qabul qilindi';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.admission_step_done('answer');
    raise exception 'FAIL AX05: SAT turi qadam sifatida qabul qilindi';
  exception when invalid_parameter_value then null;
  end;
  raise notice 'OK AX05: ruxsat ro''yxatidan tashqari qadam bad_step (22023)';

  begin
    insert into public.xp_events (user_id, kind, ref, xp, day)
    values ('00000000-0000-4000-8000-0000000005a1', 'admission_step', 'zinapoya:yangi', 10, current_date);
    raise exception 'FAIL AX06: mijoz xp_events ga yozdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK AX06: mijoz xp_events ga to''g''ridan-to''g''ri yoza olmaydi';
end
$$;
reset role;

------------------------------------------------------------------------------
-- B: kunlik 300 chegarasi (SAT XP'si bilan umumiy)
------------------------------------------------------------------------------
insert into public.xp_events (user_id, kind, ref, xp, day)
select '00000000-0000-4000-8000-0000000005b1', 'answer', 'ax-sinov-' || g, case when g < 6 then 50 else 45 end,
       private.today_tashkent()
  from generate_series(1, 6) g;   -- 5 * 50 + 45 = 295

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000005b1", "role": "authenticated"}', true) \gset
do $$
declare
  v integer;
begin
  v := public.admission_step_done('zinapoya:ucas');
  if v <> 5 then raise exception 'FAIL AX07: chegaraga 5 qolganda % berildi (kutilgan 5)', v; end if;
  v := public.admission_step_done('zinapoya:turkiye');
  if v <> 0 then raise exception 'FAIL AX07: chegara to''lganda % berildi (kutilgan 0)', v; end if;
  if exists (select 1 from public.xp_events where kind = 'admission_step' and ref = 'zinapoya:turkiye') then
    raise exception 'FAIL AX07: chegara to''lganda yozuv qoldi (kalit band bo''lmasligi kerak)';
  end if;
  if (select count(*) from public.xp_events where kind = 'admission_step') <> 1 then
    raise exception 'FAIL AX07: B boshqa foydalanuvchi XP''sini ko''rdi yoki ortiqcha yozuv bor';
  end if;
  raise notice 'OK AX07: kunlik 300 chegarasi (qolgan 5 XP berildi, keyingisi 0, kalit band qilinmadi); RLS: faqat o''z yozuvlari';
end
$$;
reset role;

rollback;
