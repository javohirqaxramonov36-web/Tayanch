-- Tarif nomi: Elite -> Max (muallif qarori, 2026-11-11: "tariflar free, pro, max bo'lishi kerak").
-- Kod ham o'zgaradi ('elite' -> 'max'): 2026-11-11 holatiga jonli bazada subscriptions va payments da
-- 'elite' ga havola yo'q edi, tarif faol emas (is_active = false, narx null).
-- Faqat nom va kod o'zgaradi; bolim, sort, is_active, narx, muddat, limits, features o'z holicha qoladi.
-- subscriptions/payments.plan_code FK si "on update" siz: agar 'elite' ga havola paydo bo'lgan bo'lsa,
-- update FK xatosi bilan to'xtaydi (jim qayta yozilmaydi), shunda havolalarni avval qo'lda ko'chirish kerak.

update public.plans
   set code = 'max',
       name = 'Max'
 where code = 'elite'
   and not exists (select 1 from public.plans where code = 'max');

do $$
begin
  if exists (select 1 from public.plans where code = 'elite') then
    raise exception 'plans: elite qatori qoldi (max allaqachon bormi?)';
  end if;
  if not exists (select 1 from public.plans where code = 'max' and name = 'Max') then
    raise exception 'plans: max qatori yo''q';
  end if;
end $$;
