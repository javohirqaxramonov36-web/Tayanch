-- P22 obuna holati sinovlari (20261112000000_obuna_holati): muddat tugatish ishi va to'lov tarixi.
-- Bitta tranzaksiya, oxirida ROLLBACK.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000f1', 'o1@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000f2', 'o2@sinov.invalid', '{}');

-- O01: muddati o'tgan active -> expired, audit bor; kelajakdagi va muddatsiz obuna tegilmaydi; ma'lumot o'chmaydi
do $$
declare
  u1 constant uuid := '00000000-0000-4000-8000-0000000000f1';
  u2 constant uuid := '00000000-0000-4000-8000-0000000000f2';
  eski uuid; faol uuid; cheksiz uuid; n integer;
begin
  insert into public.subscriptions (user_id, bolim, plan_code, status, starts_at, ends_at, source)
  values (u1, 'sat', 'pro', 'active', now() - interval '31 days', now() - interval '1 day', 'admin') returning id into eski;
  insert into public.subscriptions (user_id, bolim, plan_code, status, starts_at, ends_at, source)
  values (u2, 'sat', 'pro', 'active', now() - interval '25 days', now() + interval '5 days', 'admin') returning id into faol;
  insert into public.subscriptions (user_id, bolim, plan_code, status, starts_at, ends_at, source)
  values (u2, 'sat', 'pro', 'active', now() - interval '1 day', null, 'admin') returning id into cheksiz;

  if (private.current_plan(u1, 'sat')).code <> 'free' then
    raise exception 'FAIL O01: muddati o''tgan obuna ish oldidan ham amalda';
  end if;

  n := private.expire_subscriptions();
  if n < 1 then raise exception 'FAIL O01: hech narsa expired bo''lmadi (%)', n; end if;
  if (select status from public.subscriptions where id = eski) <> 'expired' then
    raise exception 'FAIL O01: muddati o''tgan obuna expired emas';
  end if;
  if (select status from public.subscriptions where id = faol) <> 'active'
     or (select status from public.subscriptions where id = cheksiz) <> 'active' then
    raise exception 'FAIL O01: amaldagi obuna o''zgardi';
  end if;
  if not exists (select 1 from public.audit_log where action = 'subscription_expired' and target_id = eski::text
                  and actor = 'cron:obuna-muddati' and details ->> 'plan_code' = 'pro') then
    raise exception 'FAIL O01: audit yozuvi yo''q';
  end if;
  if (private.current_plan(u2, 'sat')).code <> 'pro' or (private.current_plan(u1, 'sat')).code <> 'free' then
    raise exception 'FAIL O01: amaldagi tarif noto''g''ri';
  end if;

  -- O02: takror ishga tushirish hech narsa o'zgartirmaydi
  if private.expire_subscriptions() <> 0 then raise exception 'FAIL O02: ikkinchi ishga tushirish yana yozdi'; end if;
  if (select count(*) from public.audit_log where action = 'subscription_expired' and target_id = eski::text) <> 1 then
    raise exception 'FAIL O02: audit takrorlandi';
  end if;
  raise notice 'OK O01 muddati o''tgan obuna expired + audit, amaldagilar tegilmadi';
  raise notice 'OK O02 takror ishga tushirish: 0 qator';
end
$$;

-- To'lovlar: u1 da bitta jonli (paid) va bitta sinov (pending), u2 da bitta
insert into public.payments (id, user_id, bolim, plan_code, provider, provider_order_id, amount_uzs, status, raw, paid_at, created_at) values
  ('00000000-0000-4000-8000-0000000000a1', '00000000-0000-4000-8000-0000000000f1', 'sat', 'pro', 'inpay', 'pay_sinov_a1', 59000, 'paid',
   '{"inpay": {"livemode": true, "checkout_url": "https://x.invalid/a"}}', now() - interval '2 days', now() - interval '2 days'),
  ('00000000-0000-4000-8000-0000000000a2', '00000000-0000-4000-8000-0000000000f1', 'sat', 'pro', 'inpay', 'pay_sinov_a2', 1000, 'pending',
   '{"inpay": {"livemode": false}}', null, now() - interval '20 minutes'),
  ('00000000-0000-4000-8000-0000000000a3', '00000000-0000-4000-8000-0000000000f2', 'sat', 'pro', 'inpay', 'pay_sinov_a3', 59000, 'paid',
   '{"inpay": {"livemode": true}}', now(), now());

-- O03: payment_history faqat o'z to'lovlari, yangisi birinchi, sinov belgisi to'g'ri, raw chiqmaydi
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000f1", "role": "authenticated"}', true) \gset
do $$
declare
  r record; n integer;
begin
  select count(*) into n from public.payment_history();
  if n <> 2 then raise exception 'FAIL O03: kutilgan 2 ta to''lov, keldi %', n; end if;
  select * into r from public.payment_history() limit 1;
  if r.id <> '00000000-0000-4000-8000-0000000000a2' or r.test is distinct from true or r.status <> 'pending' then
    raise exception 'FAIL O03: tartib yoki sinov belgisi noto''g''ri (%)', row_to_json(r);
  end if;
  if (select test from public.payment_history() where id = '00000000-0000-4000-8000-0000000000a1') is distinct from false
     or (select plan_name from public.payment_history() where id = '00000000-0000-4000-8000-0000000000a1') <> 'Pro' then
    raise exception 'FAIL O03: jonli to''lov belgisi yoki tarif nomi noto''g''ri';
  end if;
  if exists (select 1 from public.payment_history('ielts')) then raise exception 'FAIL O03: boshqa bo''lim to''lovi chiqdi'; end if;
  raise notice 'OK O03 payment_history: faqat o''z to''lovlari, yangisi birinchi, sinov belgisi';
end
$$;

-- O04: mijoz muddat ishini chaqira olmaydi va obunani o'zgartira olmaydi
do $$
begin
  begin
    perform private.expire_subscriptions();
    raise exception 'FAIL O04: authenticated private.expire_subscriptions ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.subscriptions set ends_at = now() + interval '1 year';
    raise exception 'FAIL O04: authenticated obunani o''zgartirdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK O04 mijoz: muddat ishi va obuna yozuvi yopiq';
end
$$;
reset role;

-- O05: anon payment_history ni chaqira olmaydi
set local role anon;
do $$
begin
  begin
    perform * from public.payment_history();
    raise exception 'FAIL O05: anon payment_history ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK O05 anon: payment_history yopiq';
end
$$;
reset role;

rollback;
