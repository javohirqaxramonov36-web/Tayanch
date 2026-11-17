-- P19. SAT tariflari: jonli bazadagi holatni repoga yozadi (muallif qarori, 2026-11-10/11).
--   pro:   59 000 so'm, 30 kun, faol (jonli bazada 2026-11-10 dan shunday, SQL Editor orqali qo'yilgan).
--   elite: faol emas ("Coming soon"), narx va muddat yo'q.
--   free:  faol, narxsiz.
-- Kvota (limits): muallif qarori 2026-11-11 "hozircha cheklovsiz" -> hamma tarifda '{}' (kalit yo'q = cheklov yo'q,
-- 0008_rpc.sql boshi). Shuning uchun limits bu yerda o'zgartirilmaydi.
-- Idempotent: qiymat allaqachon shunday bo'lsa qator yangilanmaydi (updated_at ham o'zgarmaydi).

update public.plans
   set price_uzs   = 59000,
       period_days = 30,
       is_active   = true,
       features    = '["Early access price", "The question bank is still being built", "Pro unlocks it the moment it launches"]'::jsonb
 where code = 'pro'
   and (price_uzs, period_days, is_active, features)
       is distinct from (59000::bigint, 30, true, '["Early access price", "The question bank is still being built", "Pro unlocks it the moment it launches"]'::jsonb);

update public.plans
   set is_active = false
 where code = 'elite'
   and is_active;
