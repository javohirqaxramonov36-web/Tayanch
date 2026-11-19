-- IELTS Writing baholovchi (2026-11-19): Task 2 inshosini AI bilan taxminiy baholash.
-- Hujjat: docs/ielts-writing-baho.md. Edge Function: supabase/functions/ielts-writing-baho/.
--
-- AI Tutor (20261112173842_ai_tutor) bilan UMUMIY: private.ai_settings (kill switch, model, narx, oylik byudjet,
-- tezlik) va private.ai_usage (xarajat jurnali). Shuning uchun oylik byudjet SAT Tutor bilan bitta.
-- FARQI: IELTS'da tarif yo'q (pullik qism faqat SAT'da), limit = kirgan foydalanuvchiga kunlik bepul
-- tekshiruvlar soni (ai_settings.ielts_writing_daily, standart 2; 0 = yopiq). Kun Toshkent vaqti bilan.
-- Muvaffaqiyatsiz baholash (provayder xatosi, yaroqsiz javob) kunlik limitdan sanalmaydi.
-- SAT funksiyalari (ai_begin, ai_finish) o'zgarmaydi.

------------------------------------------------------------------------------
-- Sozlama va jurnal kengaytmasi

alter table private.ai_settings
  add column if not exists ielts_writing_daily integer not null default 2
    check (ielts_writing_daily between 0 and 50),
  add column if not exists ielts_writing_max_output_tokens integer not null default 2000
    check (ielts_writing_max_output_tokens between 500 and 4000);

alter table private.ai_usage
  add column if not exists feature text not null default 'sat_tutor'
    check (feature in ('sat_tutor', 'ielts_writing'));

create index if not exists ai_usage_feature_user_idx on private.ai_usage (feature, user_id, created_at desc);

------------------------------------------------------------------------------
-- Natijalar (foydalanuvchi hisobida; o'zi o'qiydi va o'chiradi, yozish faqat Edge Function orqali)

create table if not exists public.ielts_writing_results (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  task_type     text not null default 'task2' check (task_type in ('task2')),
  prompt_id     text check (prompt_id is null or prompt_id ~ '^[a-z0-9-]{1,40}$'),
  prompt        text not null check (char_length(prompt) between 20 and 1200),
  essay         text not null check (char_length(essay) between 1 and 6000),
  word_count    integer not null check (word_count between 0 and 2000),
  essay_hash    text not null check (essay_hash ~ '^[0-9a-f]{64}$'),
  task_band     numeric(2, 1) not null check (task_band between 1 and 9 and task_band * 2 = trunc(task_band * 2)),
  result        jsonb not null check (jsonb_typeof(result) = 'object'),
  model         text not null check (char_length(model) between 1 and 80),
  created_at    timestamptz not null default now()
);

create index if not exists ielts_writing_results_user_idx on public.ielts_writing_results (user_id, created_at desc);
create index if not exists ielts_writing_results_hash_idx on public.ielts_writing_results (user_id, essay_hash, created_at desc);

alter table public.ielts_writing_results enable row level security;

revoke all on public.ielts_writing_results from anon, authenticated;
grant select, delete on public.ielts_writing_results to authenticated;

drop policy if exists ielts_writing_results_select_own on public.ielts_writing_results;
create policy ielts_writing_results_select_own on public.ielts_writing_results
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists ielts_writing_results_delete_own on public.ielts_writing_results;
create policy ielts_writing_results_delete_own on public.ielts_writing_results
  for delete to authenticated using (user_id = (select auth.uid()));

------------------------------------------------------------------------------
-- Yordamchi: bugun (Toshkent) foydalanuvchi ishlatgan tekshiruvlar (band qilingan + bajarilgan)

create or replace function private.ielts_writing_used_today(p_user uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer
    from private.ai_usage
   where feature = 'ielts_writing' and user_id = p_user
     and status in ('reserved', 'done')
     and created_at >= (private.today_tashkent()::timestamp at time zone 'Asia/Tashkent')
$$;

------------------------------------------------------------------------------
-- Edge Function uchun (faqat service_role)

-- So'rovdan OLDIN. Tartib: kesh (24 soat ichida xuddi shu insho -> eski natija, limit sarflanmaydi, AI kerak emas)
-- -> yoqilganlik -> tezlik -> kunlik limit -> byudjet -> xarajatni band qilish.
-- Natija: {"ok": true, "cached": true, "result_id", "task_band", "result", "word_count", "created_at"}
--      yoki {"ok": true, "cached": false, "usage_id", "model", "max_output_tokens"}
--      yoki {"ok": false, "error": "ai_paused" | "rate_limited" | "quota_exceeded", ...}.
create or replace function public.ielts_writing_begin(
  p_user uuid, p_essay_hash text, p_est_input_tokens integer, p_calls integer default 2)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  s       private.ai_settings;
  r       public.ielts_writing_results;
  v_month date := private.ai_month();
  v_last  timestamptz;
  v_used  integer;
  v_spent numeric;
  v_res   numeric;
  v_id    bigint;
begin
  if p_user is null or p_essay_hash is null or p_essay_hash !~ '^[0-9a-f]{64}$'
     or p_est_input_tokens is null or p_est_input_tokens < 0 or p_est_input_tokens > 100000
     or p_calls is null or p_calls not between 1 and 5 then
    raise exception 'invalid_request' using errcode = '22023';
  end if;

  select * into r from public.ielts_writing_results
   where user_id = p_user and essay_hash = p_essay_hash and created_at > now() - interval '24 hours'
   order by created_at desc limit 1;
  if found then
    return jsonb_build_object('ok', true, 'cached', true, 'result_id', r.id, 'task_band', r.task_band,
      'result', r.result, 'word_count', r.word_count, 'created_at', r.created_at);
  end if;

  select * into s from private.ai_settings where id for update;
  if not found or not private.ai_configured(s) or s.ielts_writing_daily = 0 then
    perform private.ai_count_rejection('paused');
    return jsonb_build_object('ok', false, 'error', 'ai_paused');
  end if;

  select max(created_at) into v_last from private.ai_usage where user_id = p_user;
  if v_last is not null and v_last > now() - make_interval(secs => s.min_interval_seconds) then
    perform private.ai_count_rejection('rate_limited');
    return jsonb_build_object('ok', false, 'error', 'rate_limited',
      'retry_after', greatest(1, ceil(extract(epoch from (v_last + make_interval(secs => s.min_interval_seconds) - now())))::integer));
  end if;

  v_used := private.ielts_writing_used_today(p_user);
  if v_used >= s.ielts_writing_daily then
    perform private.ai_count_rejection('quota_exceeded');
    return jsonb_build_object('ok', false, 'error', 'quota_exceeded', 'daily_limit', s.ielts_writing_daily);
  end if;

  v_res := round((p_est_input_tokens * s.price_input_per_mtok
                  + s.ielts_writing_max_output_tokens * s.price_output_per_mtok) * p_calls / 1000000.0, 6);
  select coalesce(sum(coalesce(cost_usd, reserved_usd)), 0) into v_spent
    from private.ai_usage where month = v_month;
  if v_spent + v_res > s.monthly_budget_usd then
    update private.ai_settings
       set enabled = false, disabled_reason = 'budget_reached', disabled_at = now(), updated_at = now()
     where id;
    perform private.ai_count_rejection('budget_reached');
    return jsonb_build_object('ok', false, 'error', 'ai_paused');
  end if;

  insert into private.ai_usage (user_id, plan_code, month, status, model, price_in, price_out, reserved_usd, feature)
  values (p_user, null, v_month, 'reserved', s.model, s.price_input_per_mtok, s.price_output_per_mtok, v_res, 'ielts_writing')
  returning id into v_id;

  return jsonb_build_object('ok', true, 'cached', false, 'usage_id', v_id, 'model', s.model,
    'max_output_tokens', s.ielts_writing_max_output_tokens,
    'remaining', greatest(0, s.ielts_writing_daily - v_used - 1));
end
$$;

-- So'rovdan KEYIN: haqiqiy token bilan xarajat yoziladi. p_ok = true bo'lsa natija saqlanadi va uning id si qaytadi.
-- p_ok = false: qator 'failed' bo'ladi va kunlik limitdan sanalmaydi; xarajat baribir haqiqiy token bo'yicha.
create or replace function public.ielts_writing_finish(
  p_usage_id bigint, p_user uuid, p_input_tokens integer, p_output_tokens integer, p_calls integer, p_ok boolean,
  p_prompt_id text, p_prompt text, p_essay text, p_word_count integer, p_essay_hash text,
  p_task_band numeric, p_result jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  s       private.ai_settings;
  u       private.ai_usage;
  v_cost  numeric;
  v_spent numeric;
  v_id    uuid;
begin
  if p_input_tokens is null or p_input_tokens < 0 or p_output_tokens is null or p_output_tokens < 0
     or p_calls is null or p_calls not between 0 and 5 or p_ok is null then
    raise exception 'invalid_request' using errcode = '22023';
  end if;

  select * into s from private.ai_settings where id for update;
  select * into u from private.ai_usage where id = p_usage_id for update;
  if not found or u.status <> 'reserved' or u.feature <> 'ielts_writing' or u.user_id is distinct from p_user then
    return jsonb_build_object('ok', false, 'error', 'not_reserved');
  end if;

  v_cost := round((p_input_tokens * u.price_in + p_output_tokens * u.price_out) / 1000000.0, 6);

  update private.ai_usage
     set status = case when p_ok then 'done' else 'failed' end,
         calls = p_calls, input_tokens = p_input_tokens, output_tokens = p_output_tokens,
         cost_usd = v_cost, settled_at = now()
   where id = u.id;

  if p_ok then
    insert into public.ielts_writing_results
      (user_id, task_type, prompt_id, prompt, essay, word_count, essay_hash, task_band, result, model)
    values (p_user, 'task2', p_prompt_id, p_prompt, p_essay, p_word_count, p_essay_hash, p_task_band, p_result, u.model)
    returning id into v_id;
  end if;

  select coalesce(sum(coalesce(cost_usd, reserved_usd)), 0) into v_spent
    from private.ai_usage where month = u.month;
  if s.monthly_budget_usd is not null and v_spent >= s.monthly_budget_usd and s.enabled then
    update private.ai_settings
       set enabled = false, disabled_reason = 'budget_reached', disabled_at = now(), updated_at = now()
     where id;
  end if;

  return jsonb_build_object('ok', true, 'result_id', v_id, 'cost_usd', v_cost);
end
$$;

revoke all on function private.ielts_writing_used_today(uuid) from public, anon, authenticated;
revoke all on function public.ielts_writing_begin(uuid, text, integer, integer) from public, anon, authenticated;
revoke all on function public.ielts_writing_finish(bigint, uuid, integer, integer, integer, boolean, text, text, text, integer, text, numeric, jsonb)
  from public, anon, authenticated;
grant execute on function public.ielts_writing_begin(uuid, text, integer, integer) to service_role;
grant execute on function public.ielts_writing_finish(bigint, uuid, integer, integer, integer, boolean, text, text, text, integer, text, numeric, jsonb)
  to service_role;

------------------------------------------------------------------------------
-- Mijoz uchun (authenticated): sahifadagi "Bugun N ta tekshiruv qoldi". Byudjet va narx oshkor qilinmaydi.

create or replace function public.ielts_writing_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  uid    uuid := (select auth.uid());
  s      private.ai_settings;
  v_on   boolean;
  v_used integer;
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  select * into s from private.ai_settings where id;
  v_on := coalesce(private.ai_configured(s), false) and coalesce(s.ielts_writing_daily, 0) > 0;
  v_used := private.ielts_writing_used_today(uid);
  return jsonb_build_object(
    'available', v_on,
    'reason', case when not v_on then 'paused' end,
    'daily_limit', coalesce(s.ielts_writing_daily, 0),
    'used_today', v_used,
    'remaining', case when v_on then greatest(0, s.ielts_writing_daily - v_used) else 0 end);
end
$$;

revoke all on function public.ielts_writing_status() from public, anon;
grant execute on function public.ielts_writing_status() to authenticated;
