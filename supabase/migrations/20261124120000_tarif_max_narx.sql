-- Max narxi va Pro matni (muallif qarori, 2026-11-24).
-- 1) Max: 119 000 so'm, 30 kun. Sotuvga hali chiqmaydi: is_active = false qoladi (AI tutor tayyor bo'lgach
--    alohida migratsiya bilan yoqiladi; docs/tarif-qoidalari.md "Max sotuvga chiqishi").
--    payment_create faol bo'lmagan tarifga to'lov yaratmaydi (20261109000010_tolov_inpay.sql), shuning uchun
--    narx yozilishi to'lovni ochmaydi.
-- 2) Pro: eskirgan ko'rinadigan matnlar ("Early access price", "The question bank is still being built",
--    "Pro unlocks it the moment it launches") olib tashlanadi; jonli bazada tasdiqlangan savollar bor.
--    Mashina bayrog'i analytics_extended qoladi.
-- limits o'zgarmaydi (Free, Pro, Max hozircha cheklovsiz).

update public.plans
   set price_uzs   = 119000,
       period_days = 30
 where code = 'max'
   and bolim = 'sat'
   and (price_uzs, period_days) is distinct from (119000::bigint, 30);

update public.plans
   set features = '["analytics_extended"]'::jsonb
 where code = 'pro'
   and bolim = 'sat'
   and features is distinct from '["analytics_extended"]'::jsonb;

do $$
begin
  if not exists (select 1 from public.plans
                  where code = 'max' and price_uzs = 119000 and period_days = 30 and not is_active) then
    raise exception 'plans: max narxi yozilmadi yoki max faol bo''lib qolgan';
  end if;
  if not exists (select 1 from public.plans where code = 'pro' and features = '["analytics_extended"]'::jsonb) then
    raise exception 'plans: pro features yangilanmadi';
  end if;
end $$;
