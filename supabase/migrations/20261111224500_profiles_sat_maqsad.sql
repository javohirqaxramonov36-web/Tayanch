-- P12. SAT maqsad va imtihon sanasi: tez sozlash (/uz/sat/hisob/maqsad/) va sarlavha (/uz/sat/).
-- target_score va exam_date 0002 da bor. Qo'shiladi:
--   current_score: hozirgi eng yaxshi SAT ball (ixtiyoriy), 400–1600, qadam 10 (CB04).
--   sat_setup_at:  sozlash tugagan yoki "Skip for now" bosilgan vaqt; sarlavha taklif kartasini qayta ko'rsatmaydi.
-- target_score ga qadam 10 qoidasi: NOT VALID, ya'ni eski qatorlar tekshirilmaydi, faqat yangi yozuvlar.
-- Faqat yaroqlilik tekshiruvi; ball yoki natija bashorat qilinmaydi.

alter table public.profiles
  add column if not exists current_score integer
    constraint profiles_current_score_check
    check (current_score between 400 and 1600 and current_score % 10 = 0),
  add column if not exists sat_setup_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_target_score_step' and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_target_score_step check (target_score % 10 = 0) not valid;
  end if;
end
$$;

-- RLS o'zgarmaydi (faqat o'z qatori). Yangi ustunlarni yangilash huquqi.
grant update (current_score, sat_setup_at) on table public.profiles to authenticated;
