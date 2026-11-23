begin;
insert into auth.users(id,email) values ('00000000-0000-4000-8000-000000000081','one@sinov.invalid'),('00000000-0000-4000-8000-000000000082','two@sinov.invalid');
insert into public.payments(user_id,plan_code,provider_order_id,amount_uzs,status,raw)
select '00000000-0000-4000-8000-000000000081','pro','subtest_'||n,1000,'paid',r from (values (1,'{"inpay":{"livemode":true}}'::jsonb),(2,'{"inpay":{"livemode":false}}'::jsonb),(3,'{}'::jsonb),(4,'{"inpay":{"livemode":"true"}}'::jsonb)) t(n,r);
insert into public.payments(user_id,plan_code,provider_order_id,amount_uzs,status,raw) values ('00000000-0000-4000-8000-000000000082','pro','subtest_other',1000,'paid','{"inpay":{"livemode":true}}');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000081","role":"authenticated"}',true);
do $$ begin
 if jsonb_array_length(public.account_subscriptions()->'payments') <> 1 then raise exception 'FAIL live-only/own'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform public.account_subscriptions(); raise exception 'FAIL anon'; exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
\echo 'OK account_subscriptions: own, boolean live-only, missing/test/string hidden, anon denied'
