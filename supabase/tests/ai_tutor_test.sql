-- P33 AI Tutor sinovlari (20261112173842_ai_tutor): standart yopiq, tarif limiti, tezlik/takror, kvota,
-- xarajat, byudjet kill switch, mijoz huquqlari, tarix va o'chirish, hisobot.
-- Bitta tranzaksiya, oxirida ROLLBACK. Limit va byudjet raqamlari faqat shu sinov ichida (haqiqiy qiymatni muallif qo'yadi).
-- Eslatma: tranzaksiya ichida now() o'zgarmaydi, shuning uchun "vaqt o'tdi" holati created_at ni orqaga surib sinaladi.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000a1', 'aa@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000b1', 'ab@sinov.invalid', '{}');

-- AT01: standart holat yopiq (enabled = false, byudjet yo'q, limit yo'q)
do $$
declare
  r jsonb;
  s private.ai_settings;
begin
  select * into s from private.ai_settings where id;
  if s.enabled or s.monthly_budget_usd is not null then
    raise exception 'FAIL AT01: standart sozlama ochiq (enabled=%, budget=%)', s.enabled, s.monthly_budget_usd;
  end if;
  if s.model <> 'claude-haiku-5-5' or s.price_input_per_mtok <> 0.10 or s.price_output_per_mtok <> 0.50 then
    raise exception 'FAIL AT01: model yoki narx kutilganidek emas';
  end if;
  r := public.ai_begin('00000000-0000-4000-8000-0000000000a1', null, 100, 1);
  if r ->> 'error' <> 'ai_paused' then raise exception 'FAIL AT01: yopiq holatda %', r; end if;

  -- Faqat enabled = true, byudjet yo'q: baribir yopiq
  update private.ai_settings set enabled = true where id;
  r := public.ai_begin('00000000-0000-4000-8000-0000000000a1', null, 100, 1);
  if r ->> 'error' <> 'ai_paused' then raise exception 'FAIL AT01: byudjetsiz ochildi %', r; end if;
  if exists (select 1 from private.ai_usage) then raise exception 'FAIL AT01: yopiq holatda ai_usage yozildi'; end if;
  raise notice 'OK AT01 standart holat yopiq: enabled=false, byudjet null; byudjetsiz enabled ham yopiq';
end
$$;

-- AT02: byudjet bor, lekin tarifda limit yo'q yoki chala: not_in_plan
do $$
declare
  r jsonb;
begin
  update private.ai_settings set enabled = true, monthly_budget_usd = 1.00 where id;
  update public.plans set limits = limits - 'ai_messages' - 'ai_messages_month' where code = 'free';
  r := public.ai_begin('00000000-0000-4000-8000-0000000000a1', null, 100, 1);
  if r ->> 'error' <> 'not_in_plan' then raise exception 'FAIL AT02: limitsiz %', r; end if;

  update public.plans set limits = limits || '{"ai_messages": {"max": 3, "per": "day"}}' where code = 'free';
  r := public.ai_begin('00000000-0000-4000-8000-0000000000a1', null, 100, 1);
  if r ->> 'error' <> 'not_in_plan' then raise exception 'FAIL AT02: faqat kunlik limit bilan ochildi %', r; end if;

  update public.plans set limits = limits || '{"ai_messages_month": {"max": 0, "per": "month"}}' where code = 'free';
  r := public.ai_begin('00000000-0000-4000-8000-0000000000a1', null, 100, 1);
  if r ->> 'error' <> 'not_in_plan' then raise exception 'FAIL AT02: oylik max=0 bilan ochildi %', r; end if;

  update public.plans set limits = limits || '{"ai_messages_month": {"max": 30, "per": "day"}}' where code = 'free';
  r := public.ai_begin('00000000-0000-4000-8000-0000000000a1', null, 100, 1);
  if r ->> 'error' <> 'not_in_plan' then raise exception 'FAIL AT02: oylik kalit per=day bilan ochildi %', r; end if;
  raise notice 'OK AT02 limit yozilmagan, chala, 0 yoki davri noto''g''ri: not_in_plan (cheksiz emas)';
end
$$;

-- AT03: hammasi qo'yilgan: band qilish, hisoblagich, reserved_usd
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000a1';
  r jsonb;
  x private.ai_usage;
begin
  update public.plans set limits = limits || '{"ai_messages_month": {"max": 30, "per": "month"}}' where code = 'free';
  r := public.ai_begin(u, repeat('a', 64), 1000, 2);
  if not (r ->> 'ok')::boolean then raise exception 'FAIL AT03: ochiq holatda rad %', r; end if;
  select * into x from private.ai_usage where id = (r ->> 'usage_id')::bigint;
  -- (1000 * 0.10 + 800 * 0.50) * 2 / 1e6 = 0.001
  if x.status <> 'reserved' or x.reserved_usd <> 0.001 or x.plan_code <> 'free' or x.model <> 'claude-haiku-5-5' then
    raise exception 'FAIL AT03: band qilish noto''g''ri (status %, reserved %, plan %)', x.status, x.reserved_usd, x.plan_code;
  end if;
  if (select count from public.usage_counters where user_id = u and key = 'ai_messages' and period_start = private.today_tashkent()) <> 1
     or (select count from public.usage_counters where user_id = u and key = 'ai_messages_month' and period_start = private.ai_month()) <> 1 then
    raise exception 'FAIL AT03: kunlik va oylik hisoblagich 1 emas';
  end if;
  raise notice 'OK AT03 ochiq: reserved_usd = 0.001, ai_messages (kun) va ai_messages_month (oy) 1 dan';
end
$$;

-- AT04: tezlik (5 s) va takror (60 s ichida bir xil xesh)
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000a1';
  r jsonb;
begin
  r := public.ai_begin(u, repeat('b', 64), 100, 1);
  if r ->> 'error' <> 'rate_limited' or (r ->> 'retry_after')::integer < 1 then
    raise exception 'FAIL AT04: darhol ikkinchi so''rov o''tdi %', r;
  end if;
  update private.ai_usage set created_at = now() - interval '10 seconds' where user_id = u;
  r := public.ai_begin(u, repeat('a', 64), 100, 1);
  if r ->> 'error' <> 'duplicate' then raise exception 'FAIL AT04: takror so''rov o''tdi %', r; end if;
  r := public.ai_begin(u, repeat('b', 64), 100, 1);
  if not (r ->> 'ok')::boolean then raise exception 'FAIL AT04: 10 s dan keyin boshqa matn rad etildi %', r; end if;
  -- Bir soatdan eski xesh o'chiriladi
  update private.ai_usage set created_at = now() - interval '2 hours' where user_id = u;
  perform public.ai_begin('00000000-0000-4000-8000-0000000000b1', null, 100, 1);
  if exists (select 1 from private.ai_usage where user_id = u and input_hash is not null) then
    raise exception 'FAIL AT04: eski xesh o''chirilmadi';
  end if;
  raise notice 'OK AT04 5 s ichida rate_limited (retry_after), 60 s ichida bir xil matn duplicate, eski xesh o''chadi';
end
$$;

-- AT05: kunlik kvota tugashi (max 3), rad etilgan so'rov hisoblagichni o'zgartirmaydi
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000a1';
  r jsonb;
  n integer;
begin
  update private.ai_settings set min_interval_seconds = 0, duplicate_window_seconds = 0 where id;
  -- AT03 va AT04 da 2 ta sarflangan: yana 1 tasi o'tadi, keyingisi rad
  r := public.ai_begin(u, null, 100, 1);
  if not (r ->> 'ok')::boolean then raise exception 'FAIL AT05: 3-so''rov rad etildi %', r; end if;
  r := public.ai_begin(u, null, 100, 1);
  if r ->> 'error' <> 'quota_exceeded' then raise exception 'FAIL AT05: 4-so''rov o''tdi %', r; end if;
  select count into n from public.usage_counters where user_id = u and key = 'ai_messages' and period_start = private.today_tashkent();
  if n <> 3 then raise exception 'FAIL AT05: hisoblagich % (3 kutilgan)', n; end if;
  select count into n from public.usage_counters where user_id = u and key = 'ai_messages_month' and period_start = private.ai_month();
  if n <> 3 then raise exception 'FAIL AT05: oylik hisoblagich % (3 kutilgan)', n; end if;
  raise notice 'OK AT05 kunlik limit 3: 4-so''rov quota_exceeded, kunlik va oylik hisoblagich 3';
end
$$;

-- AT06: yakunlash: haqiqiy xarajat; provayder xatosida kvota qaytadi; ikkinchi yakunlash rad
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000a1';
  id1 bigint;
  id2 bigint;
  r jsonb;
  n integer;
begin
  select id into id1 from private.ai_usage where user_id = u and status = 'reserved' order by id limit 1;
  r := public.ai_finish(id1, 1200, 300, 1, true, 'verified');
  -- (1200 * 0.10 + 300 * 0.50) / 1e6 = 0.00027
  if (r ->> 'cost_usd')::numeric <> 0.00027
     or (select status from private.ai_usage where id = id1) <> 'done'
     or (select check_status from private.ai_usage where id = id1) <> 'verified' then
    raise exception 'FAIL AT06: xarajat yoki holat noto''g''ri %', r;
  end if;
  r := public.ai_finish(id1, 1, 1, 1, true, 'verified');
  if r ->> 'error' <> 'not_reserved' then raise exception 'FAIL AT06: ikkinchi yakunlash qabul qilindi'; end if;

  select id into id2 from private.ai_usage where user_id = u and status = 'reserved' order by id limit 1;
  r := public.ai_finish(id2, 0, 0, 1, false, null);
  if (select status from private.ai_usage where id = id2) <> 'failed' then raise exception 'FAIL AT06: failed yozilmadi'; end if;
  select count into n from public.usage_counters where user_id = u and key = 'ai_messages' and period_start = private.today_tashkent();
  if n <> 2 then raise exception 'FAIL AT06: provayder xatosida kvota qaytmadi (%)', n; end if;
  raise notice 'OK AT06 cost_usd = 0.00027 (1200 in, 300 out); ikkinchi yakunlash rad; xato bo''lsa kvota qaytadi';
end
$$;

-- AT07: byudjet kill switch: band qilish byudjetdan oshsa AI o'chadi va o'chiq qoladi
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000b1';
  r jsonb;
  spent numeric;
  s private.ai_settings;
begin
  select coalesce(sum(coalesce(cost_usd, reserved_usd)), 0) into spent from private.ai_usage where month = private.ai_month();
  -- Keyingi so'rovning bandi (100 * 0.10 + 800 * 0.50) / 1e6 = 0.00041 sig'maydigan byudjet
  update private.ai_settings set monthly_budget_usd = spent + 0.0003 where id;
  r := public.ai_begin(u, null, 100, 1);
  if r ->> 'error' <> 'ai_paused' then raise exception 'FAIL AT07: byudjetdan oshadigan so''rov o''tdi %', r; end if;
  select * into s from private.ai_settings where id;
  if s.enabled or s.disabled_reason <> 'budget_reached' or s.disabled_at is null then
    raise exception 'FAIL AT07: AI avtomatik o''chmadi';
  end if;
  -- Byudjet oshirilsa ham enabled qo'lda yoqilmaguncha yopiq
  update private.ai_settings set monthly_budget_usd = 100 where id;
  r := public.ai_begin(u, null, 100, 1);
  if r ->> 'error' <> 'ai_paused' then raise exception 'FAIL AT07: o''chgan AI o''zi yoqildi %', r; end if;
  raise notice 'OK AT07 byudjet yetmasa AI o''chadi (budget_reached) va qo''lda yoqilmaguncha yopiq';
end
$$;

-- AT08: yakunlashda oy xarajati byudjetga yetsa AI o'chadi
do $$
declare
  u constant uuid := '00000000-0000-4000-8000-0000000000b1';
  r jsonb;
  spent numeric;
begin
  update private.ai_settings set enabled = true, disabled_reason = null, disabled_at = null, monthly_budget_usd = 100 where id;
  r := public.ai_begin(u, null, 100, 1);
  if not (r ->> 'ok')::boolean then raise exception 'FAIL AT08: qayta yoqilgach rad %', r; end if;
  select coalesce(sum(coalesce(cost_usd, reserved_usd)), 0) into spent from private.ai_usage where month = private.ai_month();
  update private.ai_settings set monthly_budget_usd = spent - 0.00041 + 0.00005 where id;
  perform public.ai_finish((r ->> 'usage_id')::bigint, 100, 800, 1, true, 'not_checked');
  if (select enabled from private.ai_settings where id) then
    raise exception 'FAIL AT08: byudjetga yetgach AI ochiq qoldi';
  end if;
  update private.ai_settings set enabled = true, disabled_reason = null, disabled_at = null, monthly_budget_usd = 100 where id;
  raise notice 'OK AT08 yakunlashda oy xarajati byudjetga yetsa AI o''chadi';
end
$$;

-- AT09: kontekst faqat o'z urinishi va original tasdiqlangan savol; tarix yozish va o'qish
do $$
declare
  a constant uuid := '00000000-0000-4000-8000-0000000000a1';
  b constant uuid := '00000000-0000-4000-8000-0000000000b1';
  q uuid;
  qd uuid;
  s uuid;
  at1 bigint;
  at2 bigint;
  c uuid;
  r jsonb;
begin
  insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, options, correct,
                                explanation, status, author, verified_by)
  values ('ai-sinov-1', 'math', 'AI-domain', 'AI-skill', 2, 'mcq', 'SINOV: 2 + 3 = ?',
          '[{"key": "A", "text": "4"}, {"key": "B", "text": "5"}]', '{"choice": "B"}', 'SINOV izoh', 'verified', 'sinov', 'sinov2')
  returning id into q;
  insert into public.questions (external_id, section, domain, skill, difficulty, format, stem, correct, status, author)
  values ('ai-sinov-2', 'math', 'AI-domain', 'AI-skill', 2, 'spr', 'SINOV qoralama', '{"accepted": ["1"]}', 'draft', 'sinov')
  returning id into qd;
  insert into public.practice_sessions (user_id, mode) values (a, 'practice') returning id into s;
  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version)
  values (a, s, q, 'A', false, 1) returning id into at1;
  insert into public.attempts (user_id, session_id, question_id, answer, is_correct, question_version)
  values (a, s, qd, '2', false, 1) returning id into at2;

  r := public.ai_attempt_context(a, at1);
  if r ->> 'stem' <> 'SINOV: 2 + 3 = ?' or r -> 'correct' ->> 'choice' <> 'B' or r ->> 'user_answer' <> 'A' then
    raise exception 'FAIL AT09: kontekst noto''g''ri %', r;
  end if;
  if public.ai_attempt_context(b, at1) is not null then raise exception 'FAIL AT09: begona urinish konteksti berildi'; end if;
  if public.ai_attempt_context(a, at2) is not null then raise exception 'FAIL AT09: qoralama savol konteksti berildi'; end if;

  c := public.ai_save_turn(a, null, 'attempt', at1, q, 'AI-skill', 'Why is A wrong?', 'Because 2 + 3 = 5.', 'verified');
  perform public.ai_save_turn(a, c, 'attempt', at1, q, null, 'Thanks', 'You are welcome.', 'verified');
  r := public.ai_conversation_history(a, c, 6);
  if jsonb_array_length(r -> 'messages') <> 4 or r -> 'messages' -> 0 ->> 'content' <> 'Why is A wrong?' then
    raise exception 'FAIL AT09: tarix tartibi noto''g''ri %', r;
  end if;
  if public.ai_conversation_history(b, c, 6) is not null then raise exception 'FAIL AT09: begona tarix o''qildi'; end if;
  begin
    perform public.ai_save_turn(b, c, 'attempt', null, null, null, 'x', 'y', null);
    raise exception 'FAIL AT09: begona suhbatga yozildi';
  exception when sqlstate 'P0002' then null;
  end;
  begin
    perform public.ai_save_turn(a, c, 'own', null, null, null, 'x', 'y', null);
    raise exception 'FAIL AT09: suhbat rejimi almashtirildi';
  exception when sqlstate 'P0002' then null;
  end;
  perform set_config('ai.conv', c::text, true);
  raise notice 'OK AT09 kontekst faqat o''z urinishi + verified original; tarix eskidan yangiga; begona suhbat yopiq';
end
$$;

-- AT10: mijoz huquqlari (authenticated): o'z tarixini o'qiydi va o'chiradi, server funksiyalari yopiq
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000b1", "role": "authenticated"}', true) \gset

do $$
begin
  if exists (select 1 from public.ai_conversations) or exists (select 1 from public.ai_messages) then
    raise exception 'FAIL AT10: B begona suhbatni ko''rdi';
  end if;
  delete from public.ai_conversations;
  begin
    perform public.ai_begin(auth.uid(), null, 1, 1);
    raise exception 'FAIL AT10: mijoz ai_begin ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.ai_finish(1, 0, 0, 0, false, null);
    raise exception 'FAIL AT10: mijoz ai_finish ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.ai_save_turn(auth.uid(), null, 'own', null, null, 't', 'x', 'y', null);
    raise exception 'FAIL AT10: mijoz ai_save_turn ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.ai_attempt_context(auth.uid(), 1);
    raise exception 'FAIL AT10: mijoz ai_attempt_context ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform private.ai_monthly_report();
    raise exception 'FAIL AT10: mijoz hisobotni o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from private.ai_settings;
    raise exception 'FAIL AT10: mijoz sozlamani o''qidi';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.ai_conversations (user_id, mode, title) values (auth.uid(), 'own', 'x');
    raise exception 'FAIL AT10: mijoz suhbat yozdi';
  exception when insufficient_privilege then null;
  end;
  if (public.ai_tutor_status() ->> 'available')::boolean is not true then
    raise exception 'FAIL AT10: ochiq holatda status available emas %', public.ai_tutor_status();
  end if;
  if public.ai_tutor_status() ? 'budget_usd' then raise exception 'FAIL AT10: status byudjetni oshkor qildi'; end if;
end
$$;

select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000a1", "role": "authenticated"}', true) \gset

do $$
declare
  n integer;
begin
  select count(*) into n from public.ai_messages;
  if n <> 4 then raise exception 'FAIL AT10: A o''z xabarlarini ko''rmadi (%)', n; end if;
  select count(*) into n from public.ai_recent_mistakes(20);
  if n <> 1 then raise exception 'FAIL AT10: ai_recent_mistakes % (faqat original verified 1 ta kutilgan)', n; end if;
  delete from public.ai_conversations where id = current_setting('ai.conv')::uuid;
  if exists (select 1 from public.ai_messages) then raise exception 'FAIL AT10: suhbat o''chganda xabarlar qoldi'; end if;
  if (public.ai_tutor_status() ->> 'reason') is not null then raise exception 'FAIL AT10: A uchun reason bor'; end if;
end
$$;

reset role;
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.ai_tutor_status();
    raise exception 'FAIL AT10: anon ai_tutor_status ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.ai_messages;
    raise exception 'FAIL AT10: anon ai_messages ni o''qidi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK AT10 mijoz: faqat o''z tarixi (o''qish, o''chirish), server funksiyalari, sozlama va hisobot yopiq; anon yopiq';
end
$$;
reset role;

-- AT11: hisobni o'chirish: suhbat va xabarlar o'chadi, xarajat yozuvi user_id = null bilan qoladi
do $$
declare
  a constant uuid := '00000000-0000-4000-8000-0000000000a1';
  n_before integer;
  c uuid;
begin
  c := public.ai_save_turn(a, null, 'own', null, null, 'own', 'What is a linear function?', 'A function whose graph is a line.', 'not_checked');
  select count(*) into n_before from private.ai_usage where user_id = a;
  delete from auth.users where id = a;
  if exists (select 1 from public.ai_conversations where id = c) or exists (select 1 from public.ai_messages where conversation_id = c) then
    raise exception 'FAIL AT11: hisob o''chganda suhbat qoldi';
  end if;
  if (select count(*) from private.ai_usage where user_id is null) < n_before then
    raise exception 'FAIL AT11: xarajat yozuvi yo''qoldi';
  end if;
  raise notice 'OK AT11 hisob o''chganda suhbat va xabarlar o''chadi, xarajat yozuvi anonim qoladi';
end
$$;

-- AT12: oylik hisobot
do $$
declare
  r jsonb;
begin
  r := private.ai_monthly_report();
  if (r -> 'requests' ->> 'done')::integer < 2 or (r -> 'requests' ->> 'failed')::integer < 1
     or (r ->> 'cost_usd')::numeric <= 0 or (r -> 'rejected' ->> 'quota_exceeded')::integer < 1
     or (r -> 'rejected' ->> 'rate_limited')::integer < 1 or (r -> 'rejected' ->> 'duplicate')::integer < 1
     or (r -> 'rejected' ->> 'budget_reached')::integer < 1 or (r -> 'check' ->> 'verified')::integer < 1
     or r ->> 'model' <> 'claude-haiku-5-5' or (r -> 'by_plan' -> 'free') is null then
    raise exception 'FAIL AT12: hisobot to''liq emas %', r;
  end if;
  if (private.ai_monthly_report(private.ai_month() - 31) -> 'requests' ->> 'done')::integer <> 0 then
    raise exception 'FAIL AT12: o''tgan oy hisobotida joriy oy yozuvlari';
  end if;
  raise notice 'OK AT12 oylik hisobot: so''rovlar, token, xarajat, tarif, tekshiruv va rad etilganlar';
end
$$;

rollback;
