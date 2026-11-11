-- P19 (2-qism). Kvota holati: tiklanish vaqti (resets_at) va hisoblash qoidalari.
-- Qoidalar hujjati: docs/tarif-qoidalari.md.
--
-- Muallif qarori (2026-11-11): limitlar hozircha yo'q (hamma tarifda limits = '{}'), Elite "Coming soon",
-- faqat 30 kunlik davr, sinov muddati yo'q. Shuning uchun bu fayl plans qiymatlarini o'zgartirmaydi.
-- Raqamlar keyin ma'lumot sifatida yoziladi (kod o'zgarmaydi), masalan:
--   update public.plans set limits = '{"questions": {"max": <son>, "per": "day"}}' where code = 'free';
--
-- Kvota kalitlari (hammasi private.consume_quota orqali, bitta funksiya):
--   sessions, questions, answers, daily, review_sessions  0008_rpc.sql
--   new_words      P15 lug'at: kunning yangi so'zi
--   plan_rebuilds  P13 reja: rejani qayta tuzish
-- Yangi kalit qo'shish uchun migratsiya kerak emas: RPC consume_quota(v_user, '<kalit>', n) chaqiradi,
-- muallif plans.limits ga '<kalit>' yozsa cheklov ishlaydi.
--
-- Amaldagi tarif (effective plan) = private.current_plan(user, bolim): faol, boshlangan va tugamagan obuna;
-- bir nechta bo'lsa eng yuqori sort; hech biri bo'lmasa 'free'. Obuna tugaganda hech narsa o'chirilmaydi.
--
-- Takror ishga tushirilsa buzilmaydi.

-- Muallif qarori (2026-11-11): tariflar Free, Pro, Max. Ekrandagi nom 'Max', ichki kod 'elite' qoladi
-- (payments/subscriptions tashqi kalitlari, tolov-yaratish va eski migratsiyalar shu kodga bog'langan).
update public.plans set name = 'Max' where code = 'elite' and name is distinct from 'Max';

-- Davr tugash vaqti (keyingi davr boshi), Toshkent yarim tuni bo'yicha. 'day' standart.
create or replace function private.period_end(p_per text)
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select (case p_per
            when 'month' then (date_trunc('month', private.today_tashkent()) + interval '1 month')::date
            else private.today_tashkent() + 1
          end)::timestamp at time zone 'Asia/Tashkent'
$$;

revoke all on function private.period_end(text) from public, anon, authenticated;

-- Tarif, cheklovlar va joriy davrdagi sarf. Kvota sarflamaydi.
-- 0008 dagi shakl saqlanadi (Savol banki va Obuna sahifasi o'qiydi); qo'shilgani:
--   limits.<kalit>.resets_at, today_resets_at. today faqat kunlik kalitlar (oylik kalit limits da ko'rinadi).
create or replace function public.usage_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_plan public.plans;
begin
  v_plan := private.current_plan(v_user, 'sat');
  return jsonb_build_object(
    'bolim', 'sat',
    'plan', jsonb_build_object('code', v_plan.code, 'name', v_plan.name),
    'limits', (
      select coalesce(jsonb_object_agg(l.key, jsonb_build_object(
               'max', (l.value ->> 'max')::integer,
               'per', coalesce(l.value ->> 'per', 'day'),
               'used', coalesce(c.count, 0),
               'remaining', greatest((l.value ->> 'max')::integer - coalesce(c.count, 0), 0),
               'resets_at', private.period_end(coalesce(l.value ->> 'per', 'day')))), '{}'::jsonb)
      from jsonb_each(v_plan.limits) l
      left join public.usage_counters c
        on c.user_id = v_user and c.key = l.key
       and c.period_start = private.period_start(coalesce(l.value ->> 'per', 'day'))
      where jsonb_typeof(l.value -> 'max') = 'number'
    ),
    'today', (
      select coalesce(jsonb_object_agg(c.key, c.count), '{}'::jsonb)
      from public.usage_counters c
      where c.user_id = v_user and c.period_start = private.today_tashkent()
        -- oylik kalitning hisoblagichi oy boshida "bugun" bo'lib ko'rinmasin
        and coalesce(v_plan.limits -> c.key ->> 'per', 'day') = 'day'
    ),
    'today_resets_at', private.period_end('day')
  );
end
$$;

revoke all on function public.usage_status() from public, anon;
grant execute on function public.usage_status() to authenticated;
