-- P19 kvota sinovlari (20261111210000_kvota_p19): limit tugashi, kun almashishi, tarif tugashi, admin, usage_status.
-- Parallel so'rovlar alohida: scripts/rls-tekshir.sh oxirida (bir nechta ulanish kerak).
-- Bitta tranzaksiya, oxirida ROLLBACK. Limit raqamlari faqat shu sinov ichida (haqiqiy qiymat: plans, muallif).
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000d5', 'kd@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000e5', 'ke@sinov.invalid', '{}');

update public.plans set limits = '{"questions": {"max": 5, "per": "day"},
                                   "new_words": {"max": 2, "per": "day"},
                                   "plan_rebuilds": {"max": 1, "per": "month"}}'
 where code = 'free';
update public.plans set limits = '{"questions": {"max": 20, "per": "day"}}' where code = 'pro';

-- K00: effective plan
do $$
begin
  if (private.current_plan('00000000-0000-4000-8000-0000000000d5', 'sat')).code <> 'free' then
    raise exception 'FAIL K00: obunasiz foydalanuvchi free emas';
  end if;
  raise notice 'OK K00 obunasiz foydalanuvchi = free';
end
$$;

-- K01: limit tugashi (kunlik va oylik), "hammasi yoki hech narsa"
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000d5';
  n integer;
begin
  perform private.consume_quota(u, 'questions', 3);
  begin
    perform private.consume_quota(u, 'questions', 3);   -- 3 + 3 > 5
    raise exception 'FAIL K01: limitdan oshgan so''rov o''tdi';
  exception when sqlstate 'P0001' then
    if sqlerrm <> 'quota_exceeded' then raise; end if;
  end;
  select count into n from public.usage_counters where user_id = u and key = 'questions' and period_start = private.today_tashkent();
  if n <> 3 then raise exception 'FAIL K01: rad etilgan so''rov hisoblagichni o''zgartirdi (%)', n; end if;
  perform private.consume_quota(u, 'questions', 2);     -- aynan 5: chegarada o'tadi

  perform private.consume_quota(u, 'new_words', 1);
  perform private.consume_quota(u, 'new_words', 1);
  begin
    perform private.consume_quota(u, 'new_words', 1);
    raise exception 'FAIL K01: new_words 3-marta o''tdi';
  exception when sqlstate 'P0001' then null;
  end;

  perform private.consume_quota(u, 'plan_rebuilds', 1);
  begin
    perform private.consume_quota(u, 'plan_rebuilds', 1);
    raise exception 'FAIL K01: plan_rebuilds oyiga 2-marta o''tdi';
  exception when sqlstate 'P0001' then null;
  end;
  if not exists (select 1 from public.usage_counters where user_id = u and key = 'plan_rebuilds'
                  and period_start = date_trunc('month', private.today_tashkent())::date) then
    raise exception 'FAIL K01: oylik hisoblagich oy boshiga yozilmadi';
  end if;

  -- cheklovsiz kalit: sanaladi, lekin to'xtatilmaydi
  perform private.consume_quota(u, 'answers', 1000);
  raise notice 'OK K01 limit: chegarada o''tadi, oshganda quota_exceeded, rad etilgan so''rov sarflamaydi; kunlik va oylik';
end
$$;

-- K02: kun almashishi. Kechagi to'la hisoblagich bugungi kunga ta'sir qilmaydi; tiklanish vaqti Toshkent yarim tuni.
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000e5';
  t date := private.today_tashkent();
  r timestamptz := private.period_end('day');
  m timestamptz := private.period_end('month');
begin
  insert into public.usage_counters (user_id, key, period_start, count) values (u, 'questions', t - 1, 5);
  perform private.consume_quota(u, 'questions', 5);
  if (select count from public.usage_counters where user_id = u and key = 'questions' and period_start = t - 1) <> 5 then
    raise exception 'FAIL K02: kechagi hisoblagich o''zgardi';
  end if;
  if r <> ((t + 1)::timestamp at time zone 'Asia/Tashkent') or r <= now() or r > now() + interval '1 day' then
    raise exception 'FAIL K02: kunlik resets_at noto''g''ri (%)', r;
  end if;
  if (r at time zone 'Asia/Tashkent')::time <> '00:00' then
    raise exception 'FAIL K02: resets_at Toshkent yarim tuni emas (%)', r;
  end if;
  if (m at time zone 'Asia/Tashkent') <> (date_trunc('month', t) + interval '1 month') then
    raise exception 'FAIL K02: oylik resets_at noto''g''ri (%)', m;
  end if;
  raise notice 'OK K02 kun almashishi: davr kaliti Toshkent sanasi, yangi kun 0 dan, resets_at keyingi yarim tun / oy boshi';
end
$$;

-- K03: tarif tugashi. Pro tugasa free limiti qo'llanadi, ma'lumot o'chmaydi.
do $$
declare
  u   constant uuid := '00000000-0000-4000-8000-0000000000d5';
  sub uuid;
begin
  sub := public.admin_grant_plan(u, 'pro', 30, 'sinov K03', 'sinov');
  if (private.current_plan(u, 'sat')).code <> 'pro' then raise exception 'FAIL K03: pro berilmadi'; end if;
  perform private.consume_quota(u, 'questions', 10);   -- bugun 5 + 10 = 15 <= 20 (pro)

  update public.subscriptions set starts_at = now() - interval '30 days', ends_at = now() - interval '1 second' where id = sub;
  if (private.current_plan(u, 'sat')).code <> 'free' then raise exception 'FAIL K03: muddati o''tgan obuna hali amalda'; end if;
  begin
    perform private.consume_quota(u, 'questions', 1);  -- free: 15 >= 5
    raise exception 'FAIL K03: tarif tugagach pro limiti qoldi';
  exception when sqlstate 'P0001' then null;
  end;
  if (select count from public.usage_counters where user_id = u and key = 'questions' and period_start = private.today_tashkent()) <> 15
     or not exists (select 1 from public.subscriptions where id = sub) then
    raise exception 'FAIL K03: tarif tugagach ma''lumot o''zgardi';
  end if;

  update public.subscriptions set status = 'canceled', ends_at = now() + interval '10 days' where id = sub;
  if (private.current_plan(u, 'sat')).code <> 'free' then raise exception 'FAIL K03: bekor qilingan obuna amalda'; end if;
  raise notice 'OK K03 tarif tugashi: muddati o''tgan yoki bekor obuna = free, hisoblagich va obuna yozuvi joyida';
end
$$;

-- K04: admin_grant_plan audit bilan; actor majburiy
do $$
declare
  u   constant uuid := '00000000-0000-4000-8000-0000000000e5';
  sub uuid;
begin
  sub := public.admin_grant_plan(u, 'pro', null, 'stipendiya (sinov)', 'sinov-admin');
  if not exists (select 1 from public.audit_log where action = 'grant_plan' and target_id = sub::text
                  and actor = 'sinov-admin' and details ->> 'reason' = 'stipendiya (sinov)') then
    raise exception 'FAIL K04: audit yozuvi yo''q';
  end if;
  if (select ends_at from public.subscriptions where id = sub) is not null then
    raise exception 'FAIL K04: muddatsiz tarif muddatli bo''ldi';
  end if;
  begin
    perform public.admin_grant_plan(u, 'pro', 30, 'x', ' ');
    raise exception 'FAIL K04: actor bo''sh bo''lsa ham berildi';
  exception when sqlstate '22023' then null;
  end;
  delete from public.subscriptions where id = sub;
  raise notice 'OK K04 admin_grant_plan: audit_log yoziladi, actor majburiy, p_days null = muddatsiz';
end
$$;

-- K05: mijoz huquqlari va usage_status shakli
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000d5", "role": "authenticated"}', true) \gset

do $$
declare
  s jsonb := public.usage_status();
begin
  if s -> 'plan' ->> 'code' <> 'free'
     or (s -> 'limits' -> 'questions' ->> 'used')::integer <> 15
     or (s -> 'limits' -> 'questions' ->> 'remaining')::integer <> 0
     or (s -> 'limits' -> 'questions' ->> 'resets_at') is null
     or (s -> 'limits' -> 'plan_rebuilds' ->> 'per') <> 'month'
     or (s ->> 'today_resets_at') is null
     or (s -> 'today' ->> 'answers')::integer <> 1000 then
    raise exception 'FAIL K05: usage_status noto''g''ri: %', s;
  end if;
  if s -> 'today' ? 'plan_rebuilds' then
    raise exception 'FAIL K05: oylik kalit today ichida';
  end if;

  begin
    update public.usage_counters set count = 0 where user_id = auth.uid();
    raise exception 'FAIL K05: mijoz hisoblagichni o''zgartirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform private.consume_quota(auth.uid(), 'questions', -100);
    raise exception 'FAIL K05: mijoz private.consume_quota ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.admin_grant_plan(auth.uid(), 'pro', 30, 'x', 'x');
    raise exception 'FAIL K05: mijoz o''ziga tarif berdi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.subscriptions (user_id, plan_code, source) values (auth.uid(), 'pro', 'admin');
    raise exception 'FAIL K05: mijoz obuna yozdi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK K05 usage_status: used/remaining/resets_at; mijoz hisoblagich, kvota va obunani o''zgartira olmaydi';
end
$$;

reset role;
rollback;
