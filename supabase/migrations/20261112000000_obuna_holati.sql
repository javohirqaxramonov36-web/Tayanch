-- P22. Obuna holati: muddati o'tgan obunani kundalik 'expired' qilish va foydalanuvchiga to'lov tarixi.
--
-- Amaldagi tarif bunga bog'liq EMAS: private.current_plan() allaqachon ends_at o'tgan obunani hisobga olmaydi,
-- shuning uchun muddat tugagan zahoti foydalanuvchi Free limitiga tushadi. Bu ish faqat bazadagi holatni
-- haqiqatga moslaydi (hisobot, audit, obuna sahifasi). Hech narsa o'chirilmaydi.
-- Mijoz obuna yoki to'lovni o'zgartira olmaydi: ikkala funksiya ham faqat o'qiydi yoki faqat Cron (postgres) chaqiradi.

------------------------------------------------------------------------------
-- 1. Muddati o'tgan obunalar: active -> expired (har biri audit_log ga)
------------------------------------------------------------------------------
create or replace function private.expire_subscriptions()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  n integer;
begin
  with t as (
    update public.subscriptions s
       set status = 'expired'
     where s.status = 'active'
       and s.ends_at is not null
       and s.ends_at <= now()
    returning s.id, s.user_id, s.bolim, s.plan_code, s.ends_at
  )
  insert into public.audit_log (actor, action, target_table, target_id, details)
  select 'cron:obuna-muddati', 'subscription_expired', 'subscriptions', t.id::text,
         jsonb_build_object('user_id', t.user_id, 'bolim', t.bolim, 'plan_code', t.plan_code, 'ends_at', t.ends_at)
    from t;
  get diagnostics n = row_count;
  return n;
end
$$;

revoke all on function private.expire_subscriptions() from public, anon, authenticated;

-- Har kuni 00:05 Toshkent vaqti (UTC+5) = 19:05 UTC. pg_cron jonli loyihada yoqilgan (inpay-muvofiqlash, jobid 1);
-- lokal sinov klasterida yo'q, shuning uchun shartli. cron.schedule bir xil nom bilan qayta chaqirilsa jadvalni yangilaydi.
do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('obuna-muddati', '5 19 * * *', 'select private.expire_subscriptions()');
  end if;
end
$$;

------------------------------------------------------------------------------
-- 2. To'lov tarixi (faqat o'z to'lovlari). raw ustuni mijozga yopiq: undan faqat "sinov to'lovi" belgisi olinadi.
------------------------------------------------------------------------------
create or replace function public.payment_history(p_bolim text default 'sat')
returns table (
  id          uuid,
  plan_code   text,
  plan_name   text,
  amount_uzs  bigint,
  status      text,
  provider    text,
  created_at  timestamptz,
  paid_at     timestamptz,
  test        boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select pm.id, pm.plan_code, pl.name, pm.amount_uzs, pm.status, pm.provider, pm.created_at, pm.paid_at,
         coalesce(pm.raw -> 'inpay' ->> 'livemode', '') = 'false'
    from public.payments pm
    join public.plans pl on pl.code = pm.plan_code
   where pm.user_id = (select auth.uid())
     and pm.bolim = p_bolim
   order by pm.created_at desc
   limit 50
$$;

revoke all on function public.payment_history(text) from public, anon;
grant execute on function public.payment_history(text) to authenticated;
