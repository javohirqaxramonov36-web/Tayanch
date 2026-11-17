-- 0010. inPAY to'lovi: Edge Function'lar chaqiradigan SQL funksiyalar. Faqat service_role chaqiradi.
-- Jadvallar 0006 da, bu migratsiya ularni o'zgartirmaydi. Oqim: docs/ma'lumotlar-modeli.md, "To'lov".
-- inPAY API v2 (manba IP03): to'lov yaratish POST /payments/, webhook hodisalari payment.succeeded/failed/canceled.
--
--   tolov-yaratish (Edge Function) -> payment_create      -> payments (created)
--                                  -> inPAY POST /payments/
--                                  -> payment_set_invoice -> payments (pending | failed)
--   inpay-webhook  (imzo tekshirilgan) -> payment_apply_event -> payment_events, payments (paid), subscriptions, audit_log
--
-- payments.raw (mijozga ko'rsatilmaydi):
--   {"tayanch": {"period_days": n, "plan_name": "..."},   -- to'lov yaratilgan paytdagi tarif nusxasi
--    "inpay": {...},                                       -- inPAY javobidagi data (id, status, checkout_url, livemode, ...)
--    "inpay_error": {...}}                                 -- inPAY xato javobi (code, status, request_id)

------------------------------------------------------------------------------
-- 1. To'lov yaratish (inPAY'ga murojaatdan oldin)
------------------------------------------------------------------------------
-- Tarif faol, pullik, narxi (inPAY minimumi 1000 so'm) va muddati belgilangan bo'lishi shart.
-- Narx va muddat plans dan olinadi (P19 da muallif beradi); brauzer summani yubormaydi.
create or replace function public.payment_create(p_user uuid, p_plan_code text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan public.plans;
  v_id   uuid := gen_random_uuid();
begin
  if p_user is null or not exists (select 1 from auth.users u where u.id = p_user) then
    raise exception 'user_not_found' using errcode = 'P0002';
  end if;

  select * into v_plan from public.plans p where p.code = p_plan_code;
  if not found then
    raise exception 'plan_not_found' using errcode = 'P0002';
  end if;
  if not v_plan.is_active or v_plan.code = 'free' then
    raise exception 'plan_not_available' using errcode = '22023';
  end if;
  if v_plan.price_uzs is null or v_plan.price_uzs < 1000 or v_plan.period_days is null then
    raise exception 'plan_price_not_set' using errcode = '22023';
  end if;

  -- Bir foydalanuvchida 1 soat ichida 5 tadan ortiq ochiq (created/pending) to'lov yaratilmaydi.
  -- Tayanch tanlovi (tasodifiy ko'p bosish va suiiste'molga qarshi), inPAY qoidasi emas.
  perform pg_advisory_xact_lock(hashtextextended('payment_create:' || p_user::text, 0));
  if (select count(*) from public.payments pm
       where pm.user_id = p_user
         and pm.status in ('created', 'pending')
         and pm.created_at > now() - interval '1 hour') >= 5 then
    raise exception 'too_many_payments' using errcode = 'P0001';
  end if;

  -- provider_order_id hozircha vaqtinchalik ('tayanch:<id>'); inPAY javobidan keyin uning id si yoziladi.
  insert into public.payments (id, user_id, bolim, plan_code, provider, provider_order_id, amount_uzs, status, raw)
  values (v_id, p_user, v_plan.bolim, v_plan.code, 'inpay', 'tayanch:' || v_id::text, v_plan.price_uzs, 'created',
          jsonb_build_object('tayanch', jsonb_build_object('period_days', v_plan.period_days, 'plan_name', v_plan.name)));

  return jsonb_build_object(
    'payment_id',  v_id,
    'amount_uzs',  v_plan.price_uzs,
    'period_days', v_plan.period_days,
    'plan_code',   v_plan.code,
    'plan_name',   v_plan.name,
    'bolim',       v_plan.bolim
  );
end
$$;

------------------------------------------------------------------------------
-- 2. inPAY javobini yozish
------------------------------------------------------------------------------
-- p_provider_order_id bor: inPAY to'lovi yaratildi -> pending.
-- p_provider_order_id null: inPAY xato qaytardi yoki javob bermadi -> failed (p_response = xato tafsiloti).
create or replace function public.payment_set_invoice(p_payment_id uuid, p_provider_order_id text, p_response jsonb)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status text;
begin
  select pm.status into v_status from public.payments pm where pm.id = p_payment_id for update;
  if not found then
    raise exception 'payment_not_found' using errcode = 'P0002';
  end if;
  if v_status <> 'created' then
    raise exception 'payment_wrong_state' using errcode = '22023';
  end if;

  if p_provider_order_id is null then
    update public.payments pm
       set status = 'failed',
           raw = coalesce(pm.raw, '{}'::jsonb) || jsonb_build_object('inpay_error', coalesce(p_response, '{}'::jsonb))
     where pm.id = p_payment_id;
    return 'failed';
  end if;

  if p_provider_order_id !~ '^[A-Za-z0-9_-]{1,64}$' then
    raise exception 'invalid_provider_order_id' using errcode = '22023';
  end if;

  update public.payments pm
     set provider_order_id = p_provider_order_id,
         status = 'pending',
         raw = coalesce(pm.raw, '{}'::jsonb) || jsonb_build_object('inpay', coalesce(p_response, '{}'::jsonb))
   where pm.id = p_payment_id;
  return 'pending';
end
$$;

------------------------------------------------------------------------------
-- 3. Webhook hodisasini qo'llash (imzo Edge Function'da tekshirilgandan keyin)
------------------------------------------------------------------------------
-- Bitta tranzaksiya. Natija: {"result": ..., "error": ..., "payment_id": ..., "subscription_id": ...}
--   duplicate      shu evt_ id oldin kelgan: hech narsa o'zgarmaydi (inPAY takror yuborishi mumkin)
--   paid           to'lov paid, obuna yaratildi
--   already_paid   to'lov oldin paid bo'lgan (boshqa evt_ id bilan takror succeeded)
--   failed         payment.failed: created/pending -> failed
--   canceled       payment.canceled: created/pending/failed -> canceled
--   ignored        boshqa hodisa yoki holat o'zgarmaydigan hodisa
--   error          hodisa saqlandi (error ustuni bilan), to'lov va obuna o'zgarmadi: qo'lda ko'riladi
-- 'error' holatida ham hodisa saqlanadi, shuning uchun inPAY takrorlari 'duplicate' bo'ladi.
-- Kutilmagan xato (masalan baza) butun tranzaksiyani qaytaradi: hodisa saqlanmaydi va inPAY qayta yuboradi.
create or replace function public.payment_apply_event(p_event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event_id  text := p_event ->> 'id';
  v_type      text := p_event ->> 'type';
  v_obj       jsonb := p_event -> 'data' -> 'object';
  v_order_id  text;
  v_livemode  boolean;
  v_amount    numeric;
  v_currency  text;
  v_meta_id   text;
  v_ev        bigint;
  v_pay       public.payments;
  v_days      integer;
  v_start     timestamptz;
  v_sub       uuid;
  v_err       text;
  v_result    text;
begin
  if jsonb_typeof(p_event) is distinct from 'object'
     or v_event_id is null or v_event_id !~ '^[A-Za-z0-9_.:-]{1,128}$'
     or v_type is null or length(v_type) > 64 then
    raise exception 'invalid_event' using errcode = '22023';
  end if;

  if jsonb_typeof(v_obj) = 'object' then
    v_order_id := v_obj ->> 'id';
    v_currency := v_obj ->> 'currency';
    v_meta_id  := v_obj -> 'metadata' ->> 'payment_id';
    if jsonb_typeof(v_obj -> 'amount') = 'number'
       or (jsonb_typeof(v_obj -> 'amount') = 'string' and (v_obj ->> 'amount') ~ '^[0-9]{1,15}(\.[0-9]{1,2})?$') then
      v_amount := (v_obj ->> 'amount')::numeric;
    end if;
  end if;
  if jsonb_typeof(p_event -> 'livemode') = 'boolean' then
    v_livemode := (p_event ->> 'livemode')::boolean;
  end if;

  insert into public.payment_events (provider, event_id, provider_order_id, payload, signature_ok)
  values ('inpay', v_event_id, left(v_order_id, 64), p_event, true)
  on conflict (provider, event_id) do nothing
  returning id into v_ev;
  if v_ev is null then
    return jsonb_build_object('result', 'duplicate');
  end if;

  if v_type not in ('payment.succeeded', 'payment.failed', 'payment.canceled') then
    update public.payment_events set processed_at = now() where id = v_ev;
    return jsonb_build_object('result', 'ignored');
  end if;

  select * into v_pay from public.payments pm
   where pm.provider = 'inpay' and pm.provider_order_id = v_order_id
   for update;
  if not found then
    v_err := 'unknown_order';
  elsif v_meta_id is not null and v_meta_id <> v_pay.id::text then
    v_err := 'metadata_mismatch';
  elsif v_livemode is null or v_livemode is distinct from (v_pay.raw -> 'inpay' ->> 'livemode')::boolean then
    v_err := 'livemode_mismatch';
  end if;

  if v_err is null and v_type = 'payment.succeeded' then
    if v_pay.status = 'paid' then
      v_result := 'already_paid';
    elsif v_pay.status = 'refunded' then
      v_err := 'payment_refunded';
    elsif v_amount is null or v_amount <> v_pay.amount_uzs or upper(coalesce(v_currency, '')) <> 'UZS' then
      v_err := 'amount_mismatch';
    else
      v_days := case when (v_pay.raw -> 'tayanch' ->> 'period_days') ~ '^[0-9]{1,5}$'
                     then (v_pay.raw -> 'tayanch' ->> 'period_days')::integer end;
      if v_days is null or v_days < 1 then
        v_err := 'period_missing';
      end if;
    end if;

    if v_err is null and v_result is null then
      update public.payments pm set status = 'paid', paid_at = now() where pm.id = v_pay.id;

      -- Shu tarifda faol obuna bo'lsa, yangisi uning oxiridan boshlanadi (oldindan uzaytirishda kun yo'qolmaydi).
      select greatest(now(), coalesce(max(s.ends_at), now())) into v_start
        from public.subscriptions s
       where s.user_id = v_pay.user_id
         and s.bolim = v_pay.bolim
         and s.plan_code = v_pay.plan_code
         and s.status = 'active'
         and s.ends_at > now();

      insert into public.subscriptions (user_id, bolim, plan_code, status, starts_at, ends_at, source, payment_id)
      values (v_pay.user_id, v_pay.bolim, v_pay.plan_code, 'active', v_start,
              v_start + make_interval(days => v_days), 'payment', v_pay.id)
      on conflict (payment_id) where payment_id is not null do nothing
      returning id into v_sub;

      insert into public.audit_log (actor, action, target_table, target_id, details)
      values ('inpay-webhook', 'payment_paid', 'payments', v_pay.id::text,
              jsonb_build_object('event_id', v_event_id, 'subscription_id', v_sub, 'plan_code', v_pay.plan_code,
                                 'amount_uzs', v_pay.amount_uzs, 'livemode', v_livemode));
      v_result := 'paid';
    end if;

  elsif v_err is null and v_type = 'payment.failed' then
    if v_pay.status in ('created', 'pending') then
      update public.payments pm set status = 'failed' where pm.id = v_pay.id;
      v_result := 'failed';
    else
      v_result := 'ignored';
    end if;

  elsif v_err is null and v_type = 'payment.canceled' then
    if v_pay.status in ('created', 'pending', 'failed') then
      update public.payments pm set status = 'canceled' where pm.id = v_pay.id;
      v_result := 'canceled';
    else
      v_result := 'ignored';
    end if;
  end if;

  if v_err is not null then
    update public.payment_events set error = v_err where id = v_ev;
    return jsonb_build_object('result', 'error', 'error', v_err, 'payment_id', v_pay.id);
  end if;

  update public.payment_events set processed_at = now() where id = v_ev;
  return jsonb_build_object('result', v_result, 'payment_id', v_pay.id, 'subscription_id', v_sub);
end
$$;

------------------------------------------------------------------------------
-- Huquqlar: faqat service_role (Edge Function). Supabase public sxemada yangi funksiyaga
-- anon/authenticated ga ham EXECUTE beradi, shuning uchun aniq olib tashlanadi.
------------------------------------------------------------------------------
revoke all on function public.payment_create(uuid, text) from public, anon, authenticated;
revoke all on function public.payment_set_invoice(uuid, text, jsonb) from public, anon, authenticated;
revoke all on function public.payment_apply_event(jsonb) from public, anon, authenticated;

grant execute on function public.payment_create(uuid, text) to service_role;
grant execute on function public.payment_set_invoice(uuid, text, jsonb) to service_role;
grant execute on function public.payment_apply_event(jsonb) to service_role;
