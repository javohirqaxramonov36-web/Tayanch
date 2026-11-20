-- 20261120120000. Admission D-seriya Q5: Ariza zinapoyasi XP (Top Admission).
-- Muallif ruxsati: docs/rejalar/admission-holat.md, "Sozlamalar" -> "Q5 istisnosi" (2026-11-20). Faqat shu uchta o'zgarish:
--   1. public.xp_events.kind CHECK ga 'admission_step' qo'shiladi (yangi jadval yo'q).
--   2. private.xp_rule ga 'admission_step' = 10 (qolgan qiymatlar 20261112184613_reyting.sql dagi bilan BIR XIL).
--   3. Yangi RPC public.admission_step_done(p_step text): faqat kirgan foydalanuvchi, faqat ruxsat ro'yxatidagi
--      zinapoya, private.xp_add orqali; unique (user_id, kind, ref) tufayli har zinapoya umrida bir marta (jami 30 XP).
-- leaderboard() va boshqa RPC'lar o'zgarmaydi. Takror ishga tushirish xavfsiz (drop ... if exists / create or replace).
-- Ma'lum cheklov: zinapoyaning to'g'ri tartibi brauzerda tekshiriladi, server buni tasdiqlay olmaydi. Himoya: ruxsat
-- ro'yxati (3 ta), noyob kalit va kunlik 300 XP chegarasi.

------------------------------------------------------------------------------
-- 1. xp_events.kind
------------------------------------------------------------------------------

alter table public.xp_events drop constraint if exists xp_events_kind_check;
alter table public.xp_events add constraint xp_events_kind_check
  check (kind in ('answer', 'correct', 'review', 'daily', 'daily_correct', 'admission_step'));

------------------------------------------------------------------------------
-- 2. XP qoidasi (src/data/topAdmissionXp.ts va docs/xp-qoidasi.md bilan bir xil bo'lishi kerak)
------------------------------------------------------------------------------

create or replace function private.xp_rule(p_key text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case p_key
    when 'answer'         then 2     -- savolga birinchi javob (mashq / taymerli)
    when 'correct'        then 3     -- shu savolga birinchi urinishda to'g'ri javob (qo'shimcha)
    when 'review'         then 4     -- takrorlashda to'g'ri javob (savolga kuniga bir marta)
    when 'daily'          then 5     -- kun savoliga javob
    when 'daily_correct'  then 5     -- kun savoliga to'g'ri javob (qo'shimcha)
    when 'admission_step' then 10    -- Top Admission: Ariza zinapoyasini birinchi marta to'g'ri terish (zinapoyaga bir marta)
    when 'daily_cap'      then 300   -- kuniga ko'pi bilan
    when 'min_time_ms'    then 3000  -- mashq javobi bundan tez bo'lsa XP yo'q
  end
$$;

revoke all on function private.xp_rule(text) from public, anon, authenticated;

------------------------------------------------------------------------------
-- 3. RPC: zinapoya bajarildi
------------------------------------------------------------------------------

-- Qaytaradi: berilgan XP (10) yoki 0 (avval olingan yoki kunlik chegara to'lgan).
create or replace function public.admission_step_done(p_step text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_step is null or p_step not in ('zinapoya:turkiye', 'zinapoya:commonapp', 'zinapoya:ucas') then
    raise exception 'bad_step' using errcode = '22023';
  end if;
  -- SAT XP'si bilan bir xil qulf: parallel so'rovlarda kunlik chegara oshib ketmaydi.
  perform pg_advisory_xact_lock(hashtextextended('xp:' || v_uid::text, 0));
  return private.xp_add(v_uid, 'admission_step', p_step, private.xp_rule('admission_step'), private.today_tashkent());
end
$$;

revoke all on function public.admission_step_done(text) from public, anon;
grant execute on function public.admission_step_done(text) to authenticated;
