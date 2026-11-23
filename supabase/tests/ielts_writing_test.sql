-- IELTS Writing baholovchi sinovlari (20261119120000_ielts_writing_baho): standart yopiq, kunlik limit,
-- muvaffaqiyatsiz baholash limitdan sanalmasligi, kesh, tezlik, byudjet, natija saqlash, RLS va huquqlar, SAT bilan ajralish.
-- Bitta tranzaksiya, oxirida ROLLBACK. Byudjet raqami faqat shu sinov ichida (haqiqiy qiymatni muallif qo'yadi).
-- Tranzaksiya ichida now() o'zgarmaydi: "vaqt o'tdi" holati created_at ni orqaga surib sinaladi.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000c1', 'iw1@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000c2', 'iw2@sinov.invalid', '{}');

-- Sinov yordamchisi: band qilingan qatorni yakunlash (natija bilan yoki natijasiz).
create function pg_temp.yakunla(p_usage bigint, p_user uuid, p_ok boolean, p_hash text) returns jsonb
language sql as $$
  select public.ielts_writing_finish(p_usage, p_user, 2000, 600, 1, p_ok, 't2-01',
    'Namuna: Some people think university should be free. Discuss.', 'Namuna essay text.', 197, p_hash,
    case when p_ok then 6.5 end,
    case when p_ok then '{"criteria": {}, "overall_summary": "x", "under_length": true}'::jsonb end)
$$;

-- IW01: standart: daily = 2, max_output 2000; AI yopiq bo'lsa ai_paused, jurnal yozilmaydi
do $$
declare
  r jsonb;
  s private.ai_settings;
begin
  select * into s from private.ai_settings where id;
  if s.ielts_writing_daily <> 2 or s.ielts_writing_max_output_tokens <> 2000 then
    raise exception 'FAIL IW01: standart qiymatlar % %', s.ielts_writing_daily, s.ielts_writing_max_output_tokens;
  end if;
  update private.ai_settings set enabled = false, monthly_budget_usd = null where id;
  r := public.ielts_writing_begin('00000000-0000-4000-8000-0000000000c1', repeat('a', 64), 1000, 2);
  if r ->> 'error' <> 'ai_paused' then raise exception 'FAIL IW01: yopiq holatda %', r; end if;
  -- Ochiq, lekin daily = 0: yopiq
  update private.ai_settings set enabled = true, monthly_budget_usd = 1.00, ielts_writing_daily = 0, min_interval_seconds = 0 where id;
  r := public.ielts_writing_begin('00000000-0000-4000-8000-0000000000c1', repeat('a', 64), 1000, 2);
  if r ->> 'error' <> 'ai_paused' then raise exception 'FAIL IW01: daily=0 da %', r; end if;
  if exists (select 1 from private.ai_usage where feature = 'ielts_writing') then raise exception 'FAIL IW01: jurnal yozildi'; end if;
  raise notice 'OK IW01 standart 2/kun; AI yopiq yoki daily=0: ai_paused';
end
$$;

-- IW02: band qilish (tarifsiz), feature, reserved_usd, remaining; SAT hisoblagichlariga tegmaydi
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000c1';
  r jsonb;
  x private.ai_usage;
begin
  update private.ai_settings set ielts_writing_daily = 2 where id;
  r := public.ielts_writing_begin(u, repeat('a', 64), 1000, 2);
  if not (r ->> 'ok')::boolean or (r ->> 'cached')::boolean then raise exception 'FAIL IW02: %', r; end if;
  select * into x from private.ai_usage where id = (r ->> 'usage_id')::bigint;
  -- (1000 * 0.10 + 2000 * 0.50) * 2 / 1e6 = 0.0022
  if x.feature <> 'ielts_writing' or x.status <> 'reserved' or x.reserved_usd <> 0.0022 or x.plan_code is not null then
    raise exception 'FAIL IW02: qator noto''g''ri (feature %, reserved %, plan %)', x.feature, x.reserved_usd, x.plan_code;
  end if;
  if (r ->> 'remaining')::int <> 1 or (r ->> 'max_output_tokens')::int <> 2000 then raise exception 'FAIL IW02: remaining/max %', r; end if;
  if exists (select 1 from public.usage_counters where user_id = u and key like 'ai_%') then
    raise exception 'FAIL IW02: SAT AI hisoblagichi o''zgardi';
  end if;
  raise notice 'OK IW02 band qilish: feature ielts_writing, reserved 0.0022, remaining 1, SAT kvotasiga tegmaydi';
end
$$;

-- IW03: muvaffaqiyatsiz yakun limitdan sanalmaydi; muvaffaqiyatli yakun natija yozadi; 3-chi so'rov quota_exceeded
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000c1';
  r jsonb;
  f jsonb;
  v_first bigint := (select id from private.ai_usage where user_id = u and feature = 'ielts_writing');
begin
  f := pg_temp.yakunla(v_first, u, false, repeat('a', 64));
  if not (f ->> 'ok')::boolean or f ->> 'result_id' is not null then raise exception 'FAIL IW03: failed yakun %', f; end if;
  if private.ielts_writing_used_today(u) <> 0 then raise exception 'FAIL IW03: failed qator sanaldi'; end if;
  if (select cost_usd from private.ai_usage where id = v_first) <> 0.0005 then raise exception 'FAIL IW03: xarajat yozilmadi'; end if;

  r := public.ielts_writing_begin(u, repeat('b', 64), 1000, 2);
  f := pg_temp.yakunla((r ->> 'usage_id')::bigint, u, true, repeat('b', 64));
  if f ->> 'result_id' is null then raise exception 'FAIL IW03: natija yozilmadi %', f; end if;
  if (select task_band from public.ielts_writing_results where id = (f ->> 'result_id')::uuid) <> 6.5 then
    raise exception 'FAIL IW03: task_band';
  end if;
  -- Ikkinchi marta yakunlab bo'lmaydi
  f := pg_temp.yakunla((r ->> 'usage_id')::bigint, u, true, repeat('b', 64));
  if f ->> 'error' <> 'not_reserved' then raise exception 'FAIL IW03: qayta yakun %', f; end if;

  r := public.ielts_writing_begin(u, repeat('c', 64), 1000, 2);
  if not (r ->> 'ok')::boolean then raise exception 'FAIL IW03: 2-tekshiruv rad %', r; end if;
  r := public.ielts_writing_begin(u, repeat('d', 64), 1000, 2);
  if r ->> 'error' <> 'quota_exceeded' or (r ->> 'daily_limit')::int <> 2 then raise exception 'FAIL IW03: 3-chisi %', r; end if;

  -- Kechagi qatorlar bugungi limitga kirmaydi
  update private.ai_usage set created_at = created_at - interval '1 day' where user_id = u and feature = 'ielts_writing';
  if private.ielts_writing_used_today(u) <> 0 then raise exception 'FAIL IW03: kechagi sanaldi'; end if;
  raise notice 'OK IW03 failed sanalmaydi, ok natija yozadi, qayta yakun yo''q, 3-chisi quota_exceeded, kun yangilanadi';
end
$$;

-- IW04: kesh: 24 soat ichida xuddi shu xesh -> eski natija, AI yopiq bo'lsa ham, jurnal yozilmaydi
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000c1';
  r jsonb;
  n integer := (select count(*) from private.ai_usage);
begin
  update private.ai_settings set enabled = false where id;
  r := public.ielts_writing_begin(u, repeat('b', 64), 1000, 2);
  if not (r ->> 'cached')::boolean or (r ->> 'task_band')::numeric <> 6.5 or (r ->> 'word_count')::int <> 197 then
    raise exception 'FAIL IW04: kesh %', r;
  end if;
  if (select count(*) from private.ai_usage) <> n then raise exception 'FAIL IW04: keshda jurnal yozildi'; end if;
  -- Boshqa foydalanuvchi shu xesh bilan keshni ololmaydi
  r := public.ielts_writing_begin('00000000-0000-4000-8000-0000000000c2', repeat('b', 64), 1000, 2);
  if r ->> 'error' <> 'ai_paused' then raise exception 'FAIL IW04: begona kesh %', r; end if;
  -- 24 soatdan eski natija kesh emas
  update public.ielts_writing_results set created_at = now() - interval '25 hours' where user_id = u;
  r := public.ielts_writing_begin(u, repeat('b', 64), 1000, 2);
  if r ->> 'error' <> 'ai_paused' then raise exception 'FAIL IW04: eski kesh %', r; end if;
  update private.ai_settings set enabled = true where id;
  raise notice 'OK IW04 kesh: o''z natijasi 24 soat, AI yopiq bo''lsa ham; begona va eski emas';
end
$$;

-- IW05: tezlik (SAT Tutor bilan umumiy oxirgi so'rov vaqti)
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000c2';
  r jsonb;
begin
  update private.ai_settings set min_interval_seconds = 30 where id;
  r := public.ielts_writing_begin(u, repeat('e', 64), 1000, 2);
  if not (r ->> 'ok')::boolean then raise exception 'FAIL IW05: 1-so''rov %', r; end if;
  r := public.ielts_writing_begin(u, repeat('f', 64), 1000, 2);
  if r ->> 'error' <> 'rate_limited' or (r ->> 'retry_after')::int < 1 then raise exception 'FAIL IW05: %', r; end if;
  update private.ai_settings set min_interval_seconds = 0 where id;
  raise notice 'OK IW05 tezlik: rate_limited + retry_after';
end
$$;

-- IW06: byudjet umumiy: yetmasa AI o'chadi (SAT ham), finish byudjetga yetsa o'chiradi
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000c2';
  r jsonb;
  s private.ai_settings;
  v_spent numeric := (select coalesce(sum(coalesce(cost_usd, reserved_usd)), 0) from private.ai_usage where month = private.ai_month());
begin
  update private.ai_settings set monthly_budget_usd = v_spent + 0.001 where id;
  update private.ai_usage set created_at = created_at - interval '1 day' where user_id = u;
  r := public.ielts_writing_begin(u, repeat('1', 64), 1000, 2);
  if r ->> 'error' <> 'ai_paused' then raise exception 'FAIL IW06: byudjetdan oshdi %', r; end if;
  select * into s from private.ai_settings where id;
  if s.enabled or s.disabled_reason <> 'budget_reached' then raise exception 'FAIL IW06: o''chmadi'; end if;

  update private.ai_settings set enabled = true, disabled_reason = null, monthly_budget_usd = v_spent + 0.01 where id;
  r := public.ielts_writing_begin(u, repeat('2', 64), 1000, 2);
  if not (r ->> 'ok')::boolean then raise exception 'FAIL IW06: %', r; end if;
  update private.ai_settings set monthly_budget_usd = v_spent + 0.0001 where id;
  perform pg_temp.yakunla((r ->> 'usage_id')::bigint, u, true, repeat('2', 64));
  select * into s from private.ai_settings where id;
  if s.enabled then raise exception 'FAIL IW06: finish byudjetga yetganda o''chirmadi'; end if;
  update private.ai_settings set enabled = true, disabled_reason = null, monthly_budget_usd = 1.00 where id;
  raise notice 'OK IW06 umumiy byudjet: begin va finish AI ni o''chiradi';
end
$$;

-- IW07: finish faqat o'z ielts qatori: begona user yoki SAT qatori -> not_reserved; noto'g'ri kirish -> xato
do $$
declare
  r jsonb;
  f jsonb;
  v_sat bigint;
begin
  r := public.ielts_writing_begin('00000000-0000-4000-8000-0000000000c1', repeat('3', 64), 1000, 2);
  f := pg_temp.yakunla((r ->> 'usage_id')::bigint, '00000000-0000-4000-8000-0000000000c2', true, repeat('3', 64));
  if f ->> 'error' <> 'not_reserved' then raise exception 'FAIL IW07: begona yakun %', f; end if;
  insert into private.ai_usage (user_id, month, status, model, price_in, price_out, reserved_usd)
  values ('00000000-0000-4000-8000-0000000000c1', private.ai_month(), 'reserved', 'm', 0.1, 0.5, 0.001)
  returning id into v_sat;
  f := pg_temp.yakunla(v_sat, '00000000-0000-4000-8000-0000000000c1', true, repeat('3', 64));
  if f ->> 'error' <> 'not_reserved' then raise exception 'FAIL IW07: SAT qatori yakunlandi %', f; end if;
  begin
    perform public.ielts_writing_begin('00000000-0000-4000-8000-0000000000c1', 'not-a-hash', 1000, 2);
    raise exception 'FAIL IW07: noto''g''ri xesh qabul qilindi';
  exception when sqlstate '22023' then null;
  end;
  raise notice 'OK IW07 finish faqat o''z ielts qatori; noto''g''ri xesh rad';
end
$$;

-- IW08: mijoz huquqlari: status, RLS (o'z natijasi), begin/finish yopiq
do $$
declare
  r jsonb;
  n integer;
begin
  update private.ai_usage set created_at = created_at - interval '2 days' where user_id = '00000000-0000-4000-8000-0000000000c1';
  perform set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true);
  set local role authenticated;
  r := public.ielts_writing_status();
  if not (r ->> 'available')::boolean or (r ->> 'daily_limit')::int <> 2 or (r ->> 'remaining')::int <> 2 then
    raise exception 'FAIL IW08: status %', r;
  end if;
  select count(*) into n from public.ielts_writing_results;
  if n <> 1 then raise exception 'FAIL IW08: o''z natijalari % (1 kutilgan)', n; end if;
  begin
    perform public.ielts_writing_begin('00000000-0000-4000-8000-0000000000c1', repeat('4', 64), 1000, 2);
    raise exception 'FAIL IW08: authenticated begin chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.ielts_writing_results (user_id, prompt, essay, word_count, essay_hash, task_band, result, model)
    values ('00000000-0000-4000-8000-0000000000c1', repeat('p', 30), 'e', 1, repeat('5', 64), 9, '{}', 'm');
    raise exception 'FAIL IW08: authenticated natija yozdi';
  exception when insufficient_privilege then null;
  end;
  delete from public.ielts_writing_results;
  reset role;

  set local role anon;
  begin
    perform public.ielts_writing_status();
    raise exception 'FAIL IW08: anon status chaqirdi';
  exception when insufficient_privilege then null;
  end;
  reset role;
  -- c1 o'z natijasini o'chirdi, c2 niki qoldi
  if (select count(*) from public.ielts_writing_results where user_id = '00000000-0000-4000-8000-0000000000c1') <> 0
     or (select count(*) from public.ielts_writing_results where user_id = '00000000-0000-4000-8000-0000000000c2') <> 1 then
    raise exception 'FAIL IW08: o''chirish RLS';
  end if;
  raise notice 'OK IW08 status, RLS o''qish/o''chirish faqat o''ziniki, begin va yozish yopiq, anon yopiq';
end
$$;

rollback;
